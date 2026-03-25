import { supabase, db } from '../lib/supabase';

// Fine Service
export const fineService = {
  /**
   * Get all fines for a driver
   */
  async getDriverFines(driverId, status = null) {
    try {
      let query = supabase
        .from('fines')
        .select(`
          *,
          complaint:complaints(complaint_number, location, issue_details),
          payments(*),
          officer:police_officers(badge_number, user:users(full_name))
        `)
        .eq('driver_id', driverId)
        .order('issued_date', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching fines:', error);
      throw error;
    }
  },

  /**
   * Get fine by ID
   */
  async getFineById(fineId) {
    try {
      const { data, error } = await supabase
        .from('fines')
        .select(`
          *,
          complaint:complaints(*),
          payments(*),
          officer:police_officers(badge_number, user:users(full_name)),
          driver:drivers(user:users(full_name, phone_number))
        `)
        .eq('id', fineId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching fine:', error);
      throw error;
    }
  },

  /**
   * Create a new fine
   */
  async issueFine(fineData) {
    try {
      const fineNumber = `FINE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const { data: fine, error } = await supabase
        .from('fines')
        .insert([
          {
            ...fineData,
            fine_number: fineNumber,
            issued_date: new Date().toISOString(),
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Get driver info for notification
      const driver = await db.getUserById(fineData.driver_id);
      
      // Notify driver
      await db.createNotification({
        user_id: driver.id,
        title: 'Traffic Fine Issued',
        message: `A traffic fine (${fineNumber}) of LKR ${fineData.fine_amount} has been issued. Due date: ${fineData.due_date}`,
        notification_type: 'fine_issued',
        related_resource_type: 'fine',
        related_resource_id: fine.id,
      });

      // Log audit
      await db.logAudit({
        user_id: fineData.officer_id,
        action: 'ISSUE_FINE',
        resource_type: 'fine',
        resource_id: fine.id,
        new_values: fineData,
      });

      return fine;
    } catch (error) {
      console.error('Error issuing fine:', error);
      throw error;
    }
  },

  /**
   * Update fine status
   */
  async updateFineStatus(fineId, status) {
    try {
      const updateData = {
        status,
        ...(status === 'paid' && { paid_at: new Date().toISOString() }),
      };

      const { data, error } = await supabase
        .from('fines')
        .update(updateData)
        .eq('id', fineId)
        .select()
        .single();

      if (error) throw error;

      // Get fine details to notify driver
      const fine = await this.getFineById(fineId);
      const driver = await db.getUserById(fine.driver_id);

      if (status === 'paid') {
        await db.createNotification({
          user_id: driver.id,
          title: 'Fine Payment Confirmed',
          message: `Your fine (${fine.fine_number}) has been marked as paid.`,
          notification_type: 'fine_paid',
          related_resource_type: 'fine',
          related_resource_id: fineId,
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating fine status:', error);
      throw error;
    }
  },

  /**
   * Dispute a fine
   */
  async disputeFine(fineId, reason, documents = []) {
    try {
      const fine = await this.getFineById(fineId);
      
      const { data: appeal, error } = await supabase
        .from('appeal_requests')
        .insert([
          {
            appeal_number: `APPEAL-${Date.now()}`,
            fine_id: fineId,
            driver_id: fine.driver_id,
            complaint_id: fine.complaint_id,
            reason,
            supporting_documents: documents,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update fine status
      await this.updateFineStatus(fineId, 'disputed');

      // Notify admin
      const { data: admins } = await supabase
        .from('admin_users')
        .select('user_id');

      if (admins) {
        for (const admin of admins) {
          await db.createNotification({
            user_id: admin.user_id,
            title: 'Fine Dispute Filed',
            message: `A dispute has been filed for fine ${fine.fine_number}. Review pending.`,
            notification_type: 'fine_disputed',
            related_resource_type: 'appeal',
            related_resource_id: appeal.id,
          });
        }
      }

      return appeal;
    } catch (error) {
      console.error('Error disputing fine:', error);
      throw error;
    }
  },

  /**
   * Get all fines (admin/police view)
   */
  async getAllFines(filters = {}) {
    try {
      let query = supabase
        .from('fines')
        .select(`
          *,
          driver:drivers(user:users(full_name, nic)),
          complaint:complaints(complaint_number),
          payments(*)
        `)
        .order('issued_date', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.driver_id) {
        query = query.eq('driver_id', filters.driver_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching all fines:', error);
      throw error;
    }
  },

  /**
   * Waive a fine (admin only)
   */
  async waiveFine(fineId, reason) {
    try {
      const { data, error } = await supabase
        .from('fines')
        .update({ status: 'waived' })
        .eq('id', fineId)
        .select()
        .single();

      if (error) throw error;

      // Notify driver
      const fine = await this.getFineById(fineId);
      await db.createNotification({
        user_id: fine.driver_id,
        title: 'Fine Waived',
        message: `Your fine (${fine.fine_number}) has been waived. Reason: ${reason}`,
        notification_type: 'fine_waived',
        related_resource_type: 'fine',
        related_resource_id: fineId,
      });

      return data;
    } catch (error) {
      console.error('Error waiving fine:', error);
      throw error;
    }
  },
};
