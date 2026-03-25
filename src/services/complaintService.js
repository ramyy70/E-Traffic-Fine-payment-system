import { supabase, policeHelpers, auditHelpers } from '../lib/supabase';

/**
 * Complaint Service
 * Handles all traffic complaint operations
 */
export const complaintService = {
  /**
   * Get driver's complaints
   */
  async getDriverComplaints(driverId) {
    try {
      const { data, error } = await supabase
        .from('traffic_complaints')
        .select(
          `
          *,
          fines:traffic_fines(*),
          officer:police_officers(badge_number, user:users(full_name)),
          station:police_stations(station_name, location),
          violation:traffic_violations(violation_name, default_fine_amount)
        `
        )
        .eq('driver_id', driverId)
        .order('complaint_date', { ascending: false });

      if (error) throw error;
      return { success: true, complaints: data || [] };
    } catch (error) {
      console.error('Get driver complaints error:', error);
      return { success: false, complaints: [], error: error.message };
    }
  },

  /**
   * Get complaint by ID
   */
  async getComplaintById(complaintId) {
    try {
      const { data, error } = await supabase
        .from('traffic_complaints')
        .select(
          `
          *,
          driver:drivers(*, user:users(full_name, phone_number, email)),
          fines:traffic_fines(*),
          officer:police_officers(badge_number, user:users(full_name)),
          station:police_stations(station_name, location, phone),
          vehicle:driver_vehicles(registration_number, vehicle_type),
          violation:traffic_violations(violation_name, default_fine_amount, severity_level)
        `
        )
        .eq('id', complaintId)
        .single();

      if (error) throw error;
      return { success: true, complaint: data };
    } catch (error) {
      console.error('Get complaint error:', error);
      return { success: false, complaint: null, error: error.message };
    }
  },

  /**
   * Create new complaint (Police Officer)
   */
  async createComplaint(complaintData) {
    try {
      const result = await policeHelpers.createComplaint(complaintData);

      if (result.success) {
        // Log to audit trail
        await auditHelpers.logAction('CREATE_COMPLAINT', 'traffic_complaint', result.complaint.id, null, complaintData);

        // Create notification for driver
        await auditHelpers.createNotification(
          complaintData.driver_id,
          'Traffic Violation Reported',
          `A traffic complaint has been filed against your vehicle.`,
          'complaint',
          'complaint',
          result.complaint.id
        );
      }

      return result;
    } catch (error) {
      console.error('Create complaint error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update complaint status
   */
  async updateComplaintStatus(complaintId, status, notes = '') {
    try {
      const { data, error } = await supabase
        .from('traffic_complaints')
        .update({
          status,
          notes,
          ...(status === 'resolved' && { resolved_at: new Date().toISOString() }),
        })
        .eq('id', complaintId)
        .select()
        .single();

      if (error) throw error;

      // Log to audit trail
      await auditHelpers.logAction('UPDATE_COMPLAINT_STATUS', 'traffic_complaint', complaintId, null, { status, notes });

      return { success: true, complaint: data };
    } catch (error) {
      console.error('Update complaint status error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all complaints (Admin/Police view)
   */
  async getAllComplaints(filters = {}) {
    try {
      let query = supabase
        .from('traffic_complaints')
        .select(
          `
          *,
          driver:drivers(nic_number, user:users(full_name)),
          officer:police_officers(badge_number, user:users(full_name)),
          fines:traffic_fines(*)
        `
        )
        .order('complaint_date', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.station_id) query = query.eq('station_id', filters.station_id);
      if (filters.limit) query = query.limit(filters.limit);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, complaints: data || [] };
    } catch (error) {
      console.error('Get all complaints error:', error);
      return { success: false, complaints: [], error: error.message };
    }
  },

  /**
   * Assign complaint to officer
   */
  async assignComplaintToOfficer(complaintId, officerId) {
    try {
      const { data, error } = await supabase
        .from('traffic_complaints')
        .update({ officer_id: officerId })
        .eq('id', complaintId)
        .select()
        .single();

      if (error) throw error;

      // Log to audit trail
      await auditHelpers.logAction('ASSIGN_COMPLAINT', 'traffic_complaint', complaintId, null, { officer_id: officerId });

      return { success: true, complaint: data };
    } catch (error) {
      console.error('Assign complaint error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get violations list
   */
  async getViolations() {
    try {
      const { data, error } = await supabase
        .from('traffic_violations')
        .select('*')
        .order('violation_code');

      if (error) throw error;
      return { success: true, violations: data || [] };
    } catch (error) {
      console.error('Get violations error:', error);
      return { success: false, violations: [], error: error.message };
    }
  },

  /**
   * Get police stations
   */
  async getPoliceStations() {
    try {
      const { data, error } = await supabase
        .from('police_stations')
        .select('*')
        .order('station_name');

      if (error) throw error;
      return { success: true, stations: data || [] };
    } catch (error) {
      console.error('Get police stations error:', error);
      return { success: false, stations: [], error: error.message };
    }
  },
};
