import { supabase, db } from '../lib/supabase';

// Payment Service
export const paymentService = {
  /**
   * Get all payments for a driver
   */
  async getDriverPayments(driverId, status = null) {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          fine:fines(fine_number, fine_amount, fine_type)
        `)
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          fine:fines(*),
          driver:drivers(user:users(full_name, phone_number))
        `)
        .eq('id', paymentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  },

  /**
   * Create a payment request/record
   */
  async createPayment(paymentData) {
    try {
      const paymentRef = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const { data: payment, error } = await supabase
        .from('payments')
        .insert([
          {
            ...paymentData,
            payment_reference: paymentRef,
            status: paymentData.status || 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Log audit
      await db.logAudit({
        user_id: paymentData.driver_id,
        action: 'CREATE_PAYMENT',
        resource_type: 'payment',
        resource_id: payment.id,
        new_values: paymentData,
      });

      return payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  /**
   * Process payment (mark as completed)
   */
  async completePayment(paymentId, transactionId = null) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          payment_date: new Date().toISOString(),
          ...(transactionId && { transaction_id: transactionId }),
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;

      // Update associated fine status to paid
      const { data: fineData } = await supabase
        .from('fines')
        .select('id, driver_id')
        .eq('id', payment.fine_id)
        .single();

      if (fineData) {
        await supabase.from('fines').update({ status: 'paid' }).eq('id', fineData.id);

        // Notify driver
        await db.createNotification({
          user_id: fineData.driver_id,
          title: 'Payment Received',
          message: `Payment of LKR ${payment.amount} has been successfully processed. Reference: ${payment.payment_reference}`,
          notification_type: 'payment_received',
          related_resource_type: 'payment',
          related_resource_id: paymentId,
        });
      }

      // Log audit
      await db.logAudit({
        user_id: payment.driver_id,
        action: 'COMPLETE_PAYMENT',
        resource_type: 'payment',
        resource_id: paymentId,
        new_values: { status: 'completed', transaction_id: transactionId },
      });

      return payment;
    } catch (error) {
      console.error('Error completing payment:', error);
      throw error;
    }
  },

  /**
   * Refund a payment
   */
  async refundPayment(paymentId, reason = '') {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .update({
          status: 'refunded',
          notes: reason,
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;

      // Notify driver
      await db.createNotification({
        user_id: payment.driver_id,
        title: 'Payment Refunded',
        message: `Your payment of LKR ${payment.amount} has been refunded. Reason: ${reason || 'Admin request'}`,
        notification_type: 'payment_refunded',
        related_resource_type: 'payment',
        related_resource_id: paymentId,
      });

      // Log audit
      await db.logAudit({
        user_id: null,
        action: 'REFUND_PAYMENT',
        resource_type: 'payment',
        resource_id: paymentId,
        new_values: { status: 'refunded', reason },
      });

      return payment;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  },

  /**
   * Get all payments (admin/police view)
   */
  async getAllPayments(filters = {}) {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          driver:drivers(user:users(full_name, nic)),
          fine:fines(fine_number, fine_amount)
        `)
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.payment_method) {
        query = query.eq('payment_method', filters.payment_method);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw error;
    }
  },

  /**
   * Get payment statistics
   */
  async getPaymentStats(filters = {}) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('status, amount')
        .eq('status', 'completed');

      if (error) throw error;

      const stats = {
        total_payments: data.length,
        total_amount: data.reduce((sum, p) => sum + p.amount, 0),
        average_amount: data.length > 0 ? data.reduce((sum, p) => sum + p.amount, 0) / data.length : 0,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  },
};
