import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, authHelpers } from '../lib/supabase';

const AuthContext = createContext();

/**
 * Authentication Provider
 * Manages user authentication state and JWT tokens
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from session
   */
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const authUser = await authHelpers.getCurrentUser();
        if (mounted && authUser) {
          setUser(authUser);
          const profile = await authHelpers.getUserProfile(authUser.id);
          if (mounted) {
            setUserProfile(profile);
          }
        }
      } catch (err) {
        console.error('Initialize auth error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            const profile = await authHelpers.getUserProfile(session.user.id);
            setUserProfile(profile);
          } else {
            setUser(null);
            setUserProfile(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Sign up new user
   */
  const signup = async (email, password, userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authHelpers.signup(email, password, userData);
      if (!result.success) {
        setError(result.error || 'Signup failed');
        return result;
      }
      setUser(result.authUser);
      setUserProfile(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in existing user
   */
  const signin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authHelpers.signin(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
        return result;
      }
      setUser(result.user);
      const profile = await authHelpers.getUserProfile(result.user.id);
      setUserProfile(profile);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out current user
   */
  const signout = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authHelpers.signout();
      if (result.success) {
        setUser(null);
        setUserProfile(null);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user;

  /**
   * Check user role
   */
  const isDriver = userProfile?.user_type === 'driver';
  const isPolice = userProfile?.user_type === 'police';
  const isAdmin = userProfile?.user_type === 'admin';

  /**
   * Request password reset
   */
  const requestPasswordReset = async (email) => {
    setError(null);
    try {
      return await authHelpers.resetPassword(email);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Update password
   */
  const updatePassword = async (newPassword) => {
    setError(null);
    try {
      return await authHelpers.updatePassword(newPassword);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates) => {
    setError(null);
    try {
      if (!user) throw new Error('No user logged in');
      const result = await authHelpers.getUserProfile(user.id);
      // Handle profile updates based on user type
      // This would call role-specific update functions
      if (result) {
        setUserProfile(result);
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    // State
    user,
    userProfile,
    loading,
    error,
    isAuthenticated,

    // Role checks
    isDriver,
    isPolice,
    isAdmin,

    // Auth methods
    signup,
    signin,
    signout,
    requestPasswordReset,
    updatePassword,
    updateProfile,

    // User type for rendering
    userType: userProfile?.user_type || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * HOC to protect routes
 */
export const withAuth = (Component, requiredRole = null) => {
  return (props) => {
    const { user, loading, isAuthenticated, userType } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && userType !== requiredRole) {
      return <Navigate to="/" />;
    }

    return <Component {...props} />;
  };
};
