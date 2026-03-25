import { supabase, authHelpers } from '../lib/supabase';

/**
 * Authentication Service
 * Handles all authentication-related operations
 */
export const authService = {
  /**
   * User registration
   */
  async register(email, password, userData) {
    try {
      return await authHelpers.signup(email, password, userData);
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * User login
   */
  async login(email, password) {
    try {
      return await authHelpers.signin(email, password);
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * User logout
   */
  async logout() {
    try {
      return await authHelpers.signout();
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const user = await authHelpers.getCurrentUser();
      if (user) {
        const profile = await authHelpers.getUserProfile(user.id);
        return { success: true, user: { ...user, profile } };
      }
      return { success: false, user: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, user: null };
    }
  },

  /**
   * Verify email
   */
  async verifyEmail(token) {
    try {
      const { error } = await supabase.auth.verifyOtp({ token, type: 'email' });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Verify email error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    try {
      return await authHelpers.resetPassword(email);
    } catch (error) {
      console.error('Request password reset error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update password
   */
  async updatePassword(newPassword) {
    try {
      return await authHelpers.updatePassword(newPassword);
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  },
};
