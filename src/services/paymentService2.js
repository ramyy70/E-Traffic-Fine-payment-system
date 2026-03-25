import { supabase, auditHelpers } from '../lib/supabase';

/**
 * Payment Service
 * Handles all fine payment operations
 */
export const paymentService = {
  /**
   * Get driver's payments (recent transactions)
   */
  async getDriverPayments(driverId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('fine_payments')
        .select(
          `
          *,
          fine:traffic_fines(fine_number, fine_amount, status)
        `
        )
        .eq('driver_id', driverId)
        .order('payment_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, payments: data || [] };
    } catch (error) {
      console.error('Get driver payments error:', error);
      return { success: false, payments: [], error: error.message };
    }
  },

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId) {
    try {
      const { data, error } = await supabase
        .from('fine_payments')
        .select(
          `
          *,
          fine:traffic_fines(*),
          driver:drivers(nic_number, user:users(full_name, phone_number, email))
        `
        )
        .eq('id', paymentId)
        .single();

      if (error) throw error;
      return { success: true, payment: data };
    } catch (error) {
      console.error('Get payment error:', error);
      return { success: false, payment: null, error: error.message };
    }
  },

  /**
   * Create a payment record
   */
  async createPayment(paymentData) {
    try {
      const paymentRef = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { data: payment, error } = await supabase
        .from('fine_payments')
        .insert([
          {
            payment_reference: paymentRef,
            fine_id: paymentData.fine_id,
            driver_id: paymentData.driver_id,
            amount_paid: paymentData.amount_paid,
            payment_method: paymentData.payment_method,
            transaction_id: paymentData.transaction_id || null,
            payment_gateway: paymentData.payment_gateway || null,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Log to audit trail
      await auditHelpers.logAction('CREATE_PAYMENT', 'fine_payment', payment.id, null, paymentData);

      return { success: true, payment };
    } catch (error) {
      console.error('Create payment error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Complete/Process a payment
   */
  async completePayment(paymentId, transactionId = null, receiptUrl = null) {
    try {
      const { data: payment, error } = await supabase
        .from('fine_payments')
        .update({
          status: 'completed',
          payment_date: new Date().toISOString(),
          ...(transactionId && { transaction_id: transactionId }),
          ...(receiptUrl && { receipt_url: receiptUrl }),
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;

      // Update associated fine status to paid
      const fineResult = await supabase
        .from('traffic_fines')
        .select('id, driver_id')
        .eq('id', payment.fine_id)
        .single();

      if (fineResult.data) {
        await supabase
          .from('traffic_fines')
          .update({ status: 'paid', paid_date: new Date().toISOString() })
          .eq('id', fineResult.data.id);

        // Create notification for driver
        await auditHelpers.createNotification(
          fineResult.data.driver_id,
          'Payment Received',
          `Payment of LKR ${payment.amount_paid} has been successfully processed. Reference: ${payment.payment_reference}`,
          'payment',
          'payment',
          paymentId
        );
      }

      // Log to audit trail
      await auditHelpers.logAction('COMPLETE_PAYMENT', 'fine_payment', paymentId, null, {
        status: 'completed',
        transaction_id: transactionId,
      });

      return { success: true, payment };
    } catch (error) {
      console.error('Complete payment error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Mark payment as failed
   */
  async failPayment(paymentId, reason = '') {
    try {
      const { data: payment, error } = await supabase
        .from('fine_payments')
        .update({
          status: 'failed',
          notes: reason,
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;

      // Create notification for driver
      await auditHelpers.createNotification(
        payment.driver_id,
        'Payment Failed',
        `Your payment of LKR ${payment.amount_paid} could not be processed. Reason: ${reason || 'Unknown'}`,
        'payment',
        'payment',
        paymentId
      );

      // Log to audit trail
      await auditHelpers.logAction('FAIL_PAYMENT', 'fine_payment', paymentId, null, { reason });

      return { success: true, payment };
    } catch (error) {
      console.error('Fail payment error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Refund a payment (Admin only)
   */
  async refundPayment(paymentId, reason = '') {
    try {
      const { data: payment, error } = await supabase
        .from('fine_payments')
        .update({
          status: 'refunded',
          notes: reason,
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;

      // Update fine status back to pending if refunded
      await supabase
        .from('traffic_fines')
        .update({ status: 'issued' })
        .eq('id', payment.fine_id);

      // Create notification for driver
      await auditHelpers.createNotification(
        payment.driver_id,
        'Payment Refunded',
        `Your payment of LKR ${payment.amount_paid} has been refunded. Reason: ${reason || 'Admin request'}`,
        'payment',
        'payment',
        paymentId
      );

      // Log to audit trail
      await auditHelpers.logAction('REFUND_PAYMENT', 'fine_payment', paymentId, null, { reason });

      return { success: true, payment };
    } catch (error) {
      console.error('Refund payment error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all payments (Admin/Police view)
   */
  async getAllPayments(filters = {}) {
    try {
      let query = supabase
        .from('fine_payments')
        .select(
          `
          *,
          driver:drivers(nic_number, user:users(full_name)),
          fine:traffic_fines(fine_number, fine_amount)
        `
        )
        .order('payment_date', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.payment_method) query = query.eq('payment_method', filters.payment_method);
      if (filters.limit) query = query.limit(filters.limit);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, payments: data || [] };
    } catch (error) {
      console.error('Get all payments error:', error);
      return { success: false, payments: [], error: error.message };
    }
  },

  /**
   * Get payment statistics
   */
  async getPaymentStatistics() {
    try {
      const { data: completedPayments } = await supabase
        .from('fine_payments')
        .select('amount_paid')
        .eq('status', 'completed');

      const { data: totalPayments } = await supabase
        .from('fine_payments')
        .select('id');

      const { data: pendingPayments } = await supabase
        .from('fine_payments')
        .select('id')
        .eq('status', 'pending');

      const totalAmount = completedPayments?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;

      return {
        success: true,
        statistics: {
          totalPayments: totalPayments?.length || 0,
          completedPayments: completedPayments?.length || 0,
          pendingPayments: pendingPayments?.length || 0,
          totalAmount,
        },
      };
    } catch (error) {
      console.error('Get payment statistics error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Generate payment receipt
   */
  async generateReceipt(paymentId) {
    try {
      const paymentResult = await this.getPaymentById(paymentId);
      if (!paymentResult.success) throw new Error('Payment not found');

      const payment = paymentResult.payment;

      // Generate receipt data
      const receiptData = {
        receiptNumber: `REC-${Date.now()}`,
        paymentReference: payment.payment_reference,
        fineNumber: payment.fine?.fine_number,
        driverName: payment.driver?.user?.full_name,
        driverNIC: payment.driver?.nic_number,
        amount: payment.amount_paid,
        paymentMethod: payment.payment_method,
        paymentDate: new Date(payment.payment_date).toLocaleDateString(),
        transactionId: payment.transaction_id,
      };

      return { success: true, receipt: receiptData };
    } catch (error) {
      console.error('Generate receipt error:', error);
      return { success: false, error: error.message };
    }
  },
};
