import { supabase, policeHelpers, auditHelpers } from '../lib/supabase';

/**
 * Fine Service
 * Handles all traffic fine operations
 */
export const fineService = {
  /**
   * Get driver's fines
   */
  async getDriverFines(driverId, status = null) {
    try {
      let query = supabase
        .from('traffic_fines')
        .select(
          `
          *,
          complaint:traffic_complaints(complaint_number, location, incident_description),
          payments:fine_payments(*),
          officer:police_officers(badge_number, user:users(full_name)),
          violation:traffic_violations(violation_name, default_fine_amount)
        `
        )
        .eq('driver_id', driverId)
        .order('issued_date', { ascending: false });

      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, fines: data || [] };
    } catch (error) {
      console.error('Get driver fines error:', error);
      return { success: false, fines: [], error: error.message };
    }
  },

  /**
   * Get fine by ID
   */
  async getFineById(fineId) {
    try {
      const { data, error } = await supabase
        .from('traffic_fines')
        .select(
          `
          *,
          complaint:traffic_complaints(*),
          payments:fine_payments(*),
          officer:police_officers(badge_number, user:users(full_name)),
          driver:drivers(nic_number, user:users(full_name, phone_number, email)),
          vehicle:driver_vehicles(registration_number, vehicle_type),
          violation:traffic_violations(violation_name, default_fine_amount, severity_level)
        `
        )
        .eq('id', fineId)
        .single();

      if (error) throw error;
      return { success: true, fine: data };
    } catch (error) {
      console.error('Get fine error:', error);
      return { success: false, fine: null, error: error.message };
    }
  },

  /**
   * Issue a fine (Police Officer)
   */
  async issueFine(fineData) {
    try {
      const result = await policeHelpers.issueFine(fineData);

      if (result.success) {
        // Log to audit trail
        await auditHelpers.logAction('ISSUE_FINE', 'traffic_fine', result.fine.id, null, fineData);

        // Create notification for driver
        await auditHelpers.createNotification(
          fineData.driver_id,
          'Traffic Fine Issued',
          `A traffic fine of LKR ${fineData.fine_amount} has been issued. Due: ${fineData.due_date}`,
          'fine',
          'fine',
          result.fine.id
        );
      }

      return result;
    } catch (error) {
      console.error('Issue fine error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update fine status
   */
  async updateFineStatus(fineId, status) {
    try {
      const updateData = {
        status,
        ...(status === 'paid' && { paid_date: new Date().toISOString() }),
      };

      const { data, error } = await supabase
        .from('traffic_fines')
        .update(updateData)
        .eq('id', fineId)
        .select()
        .single();

      if (error) throw error;

      // Log to audit trail
      await auditHelpers.logAction('UPDATE_FINE_STATUS', 'traffic_fine', fineId, null, { status });

      return { success: true, fine: data };
    } catch (error) {
      console.error('Update fine status error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Dispute/Appeal a fine
   */
  async disputeFine(fineId, reason, documents = []) {
    try {
      const fineResult = await this.getFineById(fineId);
      if (!fineResult.success) throw new Error('Fine not found');

      const fine = fineResult.fine;

      const { data: appeal, error } = await supabase
        .from('fine_appeals')
        .insert([
          {
            appeal_number: `APPEAL-${Date.now()}`,
            fine_id: fineId,
            driver_id: fine.driver_id,
            complaint_id: fine.complaint_id,
            appeal_reason: reason,
            supporting_documents: documents,
            appeal_date: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update fine status to disputed
      await this.updateFineStatus(fineId, 'disputed');

      // Create notification for admins
      const { data: admins } = await supabase
        .from('admin_users')
        .select('user_id');

      if (admins) {
        for (const admin of admins) {
          await auditHelpers.createNotification(
            admin.user_id,
            'Fine Appeal Filed',
            `An appeal has been filed for fine ${fine.fine_number}. Review pending.`,
            'appeal',
            'appeal',
            appeal.id
          );
        }
      }

      // Log to audit trail
      await auditHelpers.logAction('DISPUTE_FINE', 'traffic_fine', fineId, null, { reason });

      return { success: true, appeal };
    } catch (error) {
      console.error('Dispute fine error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all fines (Admin/Police view)
   */
  async getAllFines(filters = {}) {
    try {
      let query = supabase
        .from('traffic_fines')
        .select(
          `
          *,
          driver:drivers(nic_number, user:users(full_name)),
          complaint:traffic_complaints(complaint_number),
          payments:fine_payments(*)
        `
        )
        .order('issued_date', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.driver_id) query = query.eq('driver_id', filters.driver_id);
      if (filters.limit) query = query.limit(filters.limit);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, fines: data || [] };
    } catch (error) {
      console.error('Get all fines error:', error);
      return { success: false, fines: [], error: error.message };
    }
  },

  /**
   * Waive a fine (Admin only)
   */
  async waiveFine(fineId, reason) {
    try {
      const { data, error } = await supabase
        .from('traffic_fines')
        .update({ status: 'waived' })
        .eq('id', fineId)
        .select()
        .single();

      if (error) throw error;

      // Create notification for driver
      const fineResult = await this.getFineById(fineId);
      if (fineResult.success) {
        await auditHelpers.createNotification(
          fineResult.fine.driver_id,
          'Fine Waived',
          `Your fine ${fineResult.fine.fine_number} has been waived. Reason: ${reason}`,
          'fine',
          'fine',
          fineId
        );
      }

      // Log to audit trail
      await auditHelpers.logAction('WAIVE_FINE', 'traffic_fine', fineId, null, { reason });

      return { success: true, fine: data };
    } catch (error) {
      console.error('Waive fine error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get driver statistics
   */
  async getDriverStatistics(driverId) {
    try {
      const { data: driver, error } = await supabase
        .from('drivers')
        .select('total_fines_amount, total_paid_amount, pending_fines_count, penalty_points')
        .eq('id', driverId)
        .single();

      if (error) throw error;
      return { success: true, statistics: driver };
    } catch (error) {
      console.error('Get driver statistics error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get fine statistics for admin
   */
  async getFineStatistics() {
    try {
      const { data: totalFines } = await supabase
        .from('traffic_fines')
        .select('id')
        .eq('status', 'issued');

      const { data: paidFines } = await supabase
        .from('traffic_fines')
        .select('id')
        .eq('status', 'paid');

      const { data: overdueFines } = await supabase
        .from('traffic_fines')
        .select('id')
        .eq('status', 'overdue');

      return {
        success: true,
        statistics: {
          totalIssued: totalFines?.length || 0,
          totalPaid: paidFines?.length || 0,
          totalOverdue: overdueFines?.length || 0,
        },
      };
    } catch (error) {
      console.error('Get fine statistics error:', error);
      return { success: false, error: error.message };
    }
  },
};
