import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or API key in .env.local');
}

// Main client for authenticated requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Admin client for service-role operations (backend only)
export const supabaseAdmin = import.meta.env.SSR
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })
  : null;

// ============================================================
// HELPER FUNCTIONS - AUTHENTICATION
// ============================================================

export const authHelpers = {
  /**
   * Sign up a new user with email and password
   */
  async signup(email, password, userData) {
    try {
      // Create auth user
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) throw signupError;

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            user_type: userData.user_type,
            full_name: userData.full_name,
            phone_number: userData.phone_number || null,
            is_verified: false,
          },
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      return { success: true, user: profile, authUser: authData.user };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle Supabase rate limits gracefully
      if (error.message && error.message.toLowerCase().includes('rate limit')) {
          return { 
              success: false, 
              error: 'Server is receiving too many requests right now. Please wait a few seconds and try again.' 
          };
      }
      
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign in with email and password
   */
  async signin(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Log the login
      if (data.user) {
        await supabase.rpc('log_user_login', { user_id: data.user.id });
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign out current user
   */
  async signout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update password
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: error.message };
    }
  },
};

// ============================================================
// HELPER FUNCTIONS - DRIVER OPERATIONS
// ============================================================

export const driverHelpers = {
  /**
   * Create driver profile
   */
  async createDriverProfile(userId, driverData) {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert([
          {
            user_id: userId,
            nic_number: driverData.nic_number,
            license_number: driverData.license_number,
            license_expiry_date: driverData.license_expiry_date,
            date_of_birth: driverData.date_of_birth,
            gender: driverData.gender,
            address: driverData.address,
            city: driverData.city,
            postal_code: driverData.postal_code,
            emergency_contact_name: driverData.emergency_contact_name,
            emergency_contact_phone: driverData.emergency_contact_phone,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, driver: data };
    } catch (error) {
      console.error('Create driver profile error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get driver profile with details
   */
  async getDriverProfile(driverId) {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select(
          `
          *,
          user:users(email, full_name, phone_number, profile_image_url),
          vehicles:driver_vehicles(*)
        `
        )
        .eq('id', driverId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get driver profile error:', error);
      return null;
    }
  },

  /**
   * Add vehicle to driver
   */
  async addVehicle(driverId, vehicleData) {
    try {
      const { data, error } = await supabase
        .from('driver_vehicles')
        .insert([
          {
            driver_id: driverId,
            registration_number: vehicleData.registration_number,
            vehicle_type: vehicleData.vehicle_type,
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year,
            color: vehicleData.color,
            engine_number: vehicleData.engine_number,
            chassis_number: vehicleData.chassis_number,
            insurance_expiry: vehicleData.insurance_expiry,
            vehicle_tax_expiry: vehicleData.vehicle_tax_expiry,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, vehicle: data };
    } catch (error) {
      console.error('Add vehicle error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get driver fines with payment details
   */
  async getDriverFines(driverId, status = null) {
    try {
      let query = supabase
        .from('traffic_fines')
        .select(
          `
          *,
          complaint:traffic_complaints(complaint_number, location, issue_details),
          payments:fine_payments(*),
          violation:traffic_violations(violation_name, default_fine_amount),
          officer:police_officers(badge_number, user:users(full_name))
        `
        )
        .eq('driver_id', driverId)
        .order('issued_date', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get driver fines error:', error);
      return [];
    }
  },

  /**
   * Get driver payments (recent transactions)
   */
  async getDriverPayments(driverId, limit = 10) {
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
      return data || [];
    } catch (error) {
      console.error('Get driver payments error:', error);
      return [];
    }
  },

  /**
   * Get driver complaints
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
          station:police_stations(station_name, location)
        `
        )
        .eq('driver_id', driverId)
        .order('complaint_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get driver complaints error:', error);
      return [];
    }
  },

  /**
   * Get driver notifications
   */
  async getDriverNotifications(driverId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', driverId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get notifications error:', error);
      return [];
    }
  },
};

// ============================================================
// HELPER FUNCTIONS - POLICE OPERATIONS
// ============================================================

export const policeHelpers = {
  /**
   * Create police officer profile
   */
  async createPoliceProfile(userId, policeData) {
    try {
      const { data, error } = await supabase
        .from('police_officers')
        .insert([
          {
            user_id: userId,
            badge_number: policeData.badge_number,
            rank: policeData.rank,
            department: policeData.department,
            station_id: policeData.station_id,
            date_of_joining: policeData.date_of_joining,
            identification_number: policeData.identification_number,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, officer: data };
    } catch (error) {
      console.error('Create police profile error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get police officer profile
   */
  async getPoliceProfile(policerId) {
    try {
      const { data, error } = await supabase
        .from('police_officers')
        .select(
          `
          *,
          user:users(email, full_name, phone_number, profile_image_url),
          station:police_stations(station_name, location, phone)
        `
        )
        .eq('id', policerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get police profile error:', error);
      return null;
    }
  },

  /**
   * Get assigned complaints
   */
  async getAssignedComplaints(officerId) {
    try {
      const { data, error } = await supabase
        .from('traffic_complaints')
        .select(
          `
          *,
          driver:drivers(user:users(full_name, phone_number)),
          fines:traffic_fines(*),
          station:police_stations(station_name)
        `
        )
        .eq('officer_id', officerId)
        .order('complaint_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get assigned complaints error:', error);
      return [];
    }
  },

  /**
   * Issue a fine
   */
  async issueFine(fineData) {
    try {
      const fineNumber = `FINE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { data, error } = await supabase
        .from('traffic_fines')
        .insert([
          {
            fine_number: fineNumber,
            complaint_id: fineData.complaint_id,
            driver_id: fineData.driver_id,
            vehicle_id: fineData.vehicle_id,
            officer_id: fineData.officer_id,
            violation_id: fineData.violation_id,
            fine_amount: fineData.fine_amount,
            penalty_points: fineData.penalty_points,
            issued_date: new Date().toISOString(),
            due_date: fineData.due_date,
            fine_description: fineData.fine_description,
            notes: fineData.notes,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update driver statistics
      await supabase.rpc('update_driver_statistics', { driver_id: fineData.driver_id });

      return { success: true, fine: data };
    } catch (error) {
      console.error('Issue fine error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create complaint
   */
  async createComplaint(complaintData) {
    try {
      const complaintNumber = `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { data, error } = await supabase
        .from('traffic_complaints')
        .insert([
          {
            complaint_number: complaintNumber,
            driver_id: complaintData.driver_id,
            vehicle_id: complaintData.vehicle_id,
            officer_id: complaintData.officer_id,
            violation_id: complaintData.violation_id,
            station_id: complaintData.station_id,
            location: complaintData.location,
            latitude: complaintData.latitude,
            longitude: complaintData.longitude,
            incident_description: complaintData.incident_description,
            evidence_photos: complaintData.evidence_photos || [],
            complaint_date: new Date().toISOString(),
            complaint_time: new Date().toTimeString().split(' ')[0],
            priority: complaintData.priority || 'normal',
            notes: complaintData.notes,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, complaint: data };
    } catch (error) {
      console.error('Create complaint error:', error);
      return { success: false, error: error.message };
    }
  },
};

// ============================================================
// HELPER FUNCTIONS - ADMIN OPERATIONS
// ============================================================

export const adminHelpers = {
  /**
   * Create admin user profile
   */
  async createAdminProfile(userId, adminData) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert([
          {
            user_id: userId,
            admin_code: adminData.admin_code,
            department: adminData.department,
            station_id: adminData.station_id || null,
            role_level: adminData.role_level || 'manager',
            permissions: adminData.permissions || [],
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, admin: data };
    } catch (error) {
      console.error('Create admin profile error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all complaints (admin view)
   */
  async getAllComplaints(filters = {}) {
    try {
      let query = supabase
        .from('traffic_complaints')
        .select(
          `
          *,
          driver:drivers(user:users(full_name, nic_number)),
          officer:police_officers(badge_number, user:users(full_name)),
          fines:traffic_fines(*)
        `
        )
        .order('complaint_date', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all complaints error:', error);
      return [];
    }
  },

  /**
   * Get all fines (admin view)
   */
  async getAllFines(filters = {}) {
    try {
      let query = supabase
        .from('traffic_fines')
        .select(
          `
          *,
          driver:drivers(user:users(full_name, nic_number)),
          complaint:traffic_complaints(complaint_number),
          payments:fine_payments(*)
        `
        )
        .order('issued_date', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all fines error:', error);
      return [];
    }
  },

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const { data, error } = await supabase
        .from('dashboard_statistics')
        .select('*')
        .eq('stat_date', new Date().toISOString().split('T')[0])
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return null;
    }
  },

  /**
   * Get appeal requests
   */
  async getAppealRequests(status = null) {
    try {
      let query = supabase
        .from('fine_appeals')
        .select(
          `
          *,
          driver:drivers(user:users(full_name, nic_number)),
          fine:traffic_fines(fine_number, fine_amount),
          reviewed_by:admin_users(user:users(full_name))
        `
        )
        .order('appeal_date', { ascending: false });

      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get appeal requests error:', error);
      return [];
    }
  },

  /**
   * Approve or reject appeal
   */
  async reviewAppeal(appealId, decision, comments = '') {
    try {
      const { data, error } = await supabase
        .from('fine_appeals')
        .update({
          status: 'under_review',
          appeal_decision: decision,
          review_comments: comments,
          reviewed_date: new Date().toISOString(),
        })
        .eq('id', appealId)
        .select()
        .single();

      if (error) throw error;

      // If accepted, update fine status
      if (decision === 'accepted') {
        await supabase
          .from('traffic_fines')
          .update({ status: 'waived' })
          .eq('id', data.fine_id);
      }

      return { success: true, appeal: data };
    } catch (error) {
      console.error('Review appeal error:', error);
      return { success: false, error: error.message };
    }
  },
};

// ============================================================
// HELPER FUNCTIONS - AUDIT & LOGGING
// ============================================================

export const auditHelpers = {
  /**
   * Log an action to audit trail
   */
  async logAction(action, resourceType, resourceId, oldValues = null, newValues = null) {
    try {
      const user = await authHelpers.getCurrentUser();

      await supabase.from('audit_logs').insert([
        {
          user_id: user?.id || null,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          old_values: oldValues,
          new_values: newValues,
          ip_address: null,
          user_agent: navigator.userAgent,
        },
      ]);
    } catch (error) {
      console.error('Log action error:', error);
    }
  },

  /**
   * Create notification
   */
  async createNotification(userId, title, message, type = 'general', resourceType = null, resourceId = null) {
    try {
      await supabase.from('notifications').insert([
        {
          user_id: userId,
          title,
          message,
          notification_type: type,
          related_resource_type: resourceType,
          related_resource_id: resourceId,
        },
      ]);
    } catch (error) {
      console.error('Create notification error:', error);
    }
  },
};

export const getUserProfileWithRole = async (userId) => {
  try {
    const { data, error } = await supabase.from('users').select('*, drivers!user_id(*), police_officers!user_id(*), admin_users!user_id(*)').eq('id', userId).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get user profile with role error:', error);
    return null;
  }
};
