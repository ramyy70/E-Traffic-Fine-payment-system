import React, { createContext, useContext, useEffect, useState } from 'react';
import { authHelpers, driverHelpers, policeHelpers, adminHelpers, supabase, getUserProfileWithRole } from '../lib/supabase';
import { stationById } from '../data/stationDirectory';

const AuthContext = createContext();

const STORAGE_SESSION_KEY = 'traffic_session_v2';

const readStorage = (key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch {
        return fallback;
    }
};

const writeStorage = (key, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
};

const removeStorage = (key) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
};

// Map the DB user profile and role-specific profile into the auth session user
const toSessionUser = (profile, roleProfile, station) => {
    if (!profile) return null;

    const nextUser = {
        id: profile.id,
        name: profile.full_name || 'User',
        role: profile.user_type,
        email: profile.email,
        phone: profile.phone_number || '',
    };

    if (profile.user_type === 'driver' && roleProfile) {
        nextUser.nic = roleProfile.nic_number || '';
    }

    if (profile.user_type === 'police' && roleProfile) {
        nextUser.badge = roleProfile.badge_number || '';
    }

    if (profile.user_type === 'admin' && roleProfile) {
        nextUser.adminCode = roleProfile.admin_code || '';
    }

    if (station) {
        nextUser.stationId = station.id;
        nextUser.stationName = station.station_name;
        nextUser.stationCode = station.station_code;
    }

    return nextUser;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const cachedUser = readStorage(STORAGE_SESSION_KEY, null);
        return cachedUser;
    });

    useEffect(() => {
        if (user) {
            writeStorage(STORAGE_SESSION_KEY, user);
        } else {
            removeStorage(STORAGE_SESSION_KEY);
        }
    }, [user]);

    // Re-verify session with Supabase on mount
    useEffect(() => {
        let mounted = true;
        const initAuth = async () => {
            const authUser = await authHelpers.getCurrentUser();
            if (authUser && mounted) {
                const profileWithRole = await getUserProfileWithRole(authUser.id);
                if (profileWithRole && mounted) {
                    await fetchAndSetRoleProfile(profileWithRole);
                }
            } else if (mounted) {
                setUser(null);
            }
        };
        initAuth();
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (mounted) {
                if (session?.user) {
                    const profileWithRole = await getUserProfileWithRole(session.user.id);
                    if (profileWithRole) await fetchAndSetRoleProfile(profileWithRole);
                } else {
                    setUser(null);
                }
            }
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    const fetchAndSetRoleProfile = async (profile) => {
        let roleProfile = null;
        let stationId = null;

        // With optimized joined fetch, the role objects are already attached
        if (profile.user_type === 'driver') {
            roleProfile = (profile.drivers && profile.drivers.length > 0) ? profile.drivers[0] : null;
            // Fallback for safety if somehow missing from joined fetch
            if (!roleProfile) {
                const { data } = await supabase.from('drivers').select('*').eq('user_id', profile.id).single();
                roleProfile = data;
            }
        } else if (profile.user_type === 'police') {
            roleProfile = (profile.police_officers && profile.police_officers.length > 0) ? profile.police_officers[0] : null;
            if (!roleProfile) {
                const { data } = await supabase.from('police_officers').select('*').eq('user_id', profile.id).single();
                roleProfile = data;
            }
            stationId = roleProfile?.station_id;
        } else if (profile.user_type === 'admin') {
            roleProfile = (profile.admin_users && profile.admin_users.length > 0) ? profile.admin_users[0] : null;
            if (!roleProfile) {
                const { data } = await supabase.from('admin_users').select('*').eq('user_id', profile.id).single();
                roleProfile = data;
            }
            stationId = roleProfile?.station_id;
        }

        const station = stationId ? stationById(stationId) : null;
        setUser(toSessionUser(profile, roleProfile, station));
    };

    const signin = async (email, password, role) => {
        try {
            const result = await authHelpers.signin(email, password);
            if (!result.success) {
                return { success: false, error: result.error || 'Login failed.' };
            }

            const profile = await authHelpers.getUserProfile(result.user.id);
            if (!profile) {
                return { success: false, error: 'User profile not found.' };
            }

            const selectedRole = String(role || '').trim().toLowerCase();
            if (selectedRole && profile.user_type !== selectedRole) {
                await authHelpers.signout();
                return { success: false, error: `This account is registered as ${profile.user_type}.` };
            }

            // Set user immediately to trigger dashboard transition
            // fetchAndSetRoleProfile will then enrich the session with role-specific details
            setUser(toSessionUser(profile, null, null));
            
            // Background enrichment
            fetchAndSetRoleProfile(profile);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signup = async (payload) => {
        const userData = payload?.user || {};
        const driverData = payload?.driver || {};
        const policeData = payload?.police || {};
        const adminData = payload?.admin || {};

        const normalizedRole = String(userData.user_type || '').trim().toLowerCase();

        // Validation for Admin Verify Code
        let station = null;
        if (normalizedRole === 'admin') {
            station = stationById(adminData.station_id);
            if (!station) {
                return { success: false, error: 'Admin registration requires a valid police station.' };
            }
            const verificationCode = String(adminData.station_verification_code || '').trim().toUpperCase();
            if (station.admin_verification_code.toUpperCase() !== verificationCode) {
                return { success: false, error: 'Invalid station verification code.' };
            }
        } else if (normalizedRole === 'police') {
            station = stationById(policeData.station_id);
            if (!station) {
                return { success: false, error: 'Select a valid police station.' };
            }
        }

        const signupResult = await authHelpers.signup(userData.email, userData.password, {
            user_type: normalizedRole,
            full_name: userData.full_name,
            phone_number: userData.phone_number,
        });

        if (!signupResult.success) {
            return { success: false, error: signupResult.error || 'Signup failed' };
        }

        const userId = signupResult.authUser.id;
        let profileResult = null;

        if (normalizedRole === 'driver') {
            profileResult = await driverHelpers.createDriverProfile(userId, driverData);
        } else if (normalizedRole === 'police') {
            profileResult = await policeHelpers.createPoliceProfile(userId, { ...policeData, date_of_joining: new Date().toISOString().split('T')[0] });
        } else if (normalizedRole === 'admin') {
            profileResult = await adminHelpers.createAdminProfile(userId, { ...adminData, role_level: adminData.role_level || 'manager', permissions: [] });
        }

        if (!profileResult || !profileResult.success) {
            return { success: false, error: profileResult?.error || 'Failed to create role profile' };
        }

        const profileWithRole = await getUserProfileWithRole(userId);
        await fetchAndSetRoleProfile(profileWithRole || signupResult.authUser);
        return { success: true };
    };

    const login = async (rawInput) => {
        return { success: false, messageKey: 'errInvalidId', error: 'Legacy quick login is disabled. Please use email and password.' };
    };

    const logout = async () => {
        await authHelpers.signout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signin, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
