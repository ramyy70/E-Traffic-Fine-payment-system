/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';
import { driverUserIdFromNic, isValidSriLankanNic, normalizeNic } from '../utils/identity';

const AuthContext = createContext();

// Police login: Officer ID with letters, digits and optional special chars (e.g. POL-101, COP/55)
const isOfficerId = (value) => {
    const id = value.trim().toUpperCase();
    return /^[A-Z]{2,6}[-/+]?[0-9]{2,6}$/.test(id);
};

// Admin login: simple ADM-based ID (e.g. ADM999)
const isAdminId = (value) => {
    const id = value.trim().toUpperCase();
    return /^ADM[0-9]{3,}$/.test(id);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (rawInput) => {
        const input = (rawInput || '').trim();
        const normalizedNic = normalizeNic(input);

        if (!input) {
            return { success: false, messageKey: 'errEnterId' };
        }

        if (isValidSriLankanNic(normalizedNic)) {
            const driverUser = {
                id: driverUserIdFromNic(normalizedNic),
                name: 'Driver User',
                role: 'driver',
                nic: normalizedNic,
            };
            setUser(driverUser);
            return { success: true };
        }

        if (isAdminId(input)) {
            const adminUser = {
                id: `admin-${input.toUpperCase()}`,
                name: 'System Admin',
                role: 'admin',
                badge: input.toUpperCase(),
            };
            setUser(adminUser);
            return { success: true };
        }

        if (isOfficerId(input)) {
            const officerUser = {
                id: `police-${input.toUpperCase()}`,
                name: 'Police Officer',
                role: 'police',
                badge: input.toUpperCase(),
            };
            setUser(officerUser);
            return { success: true };
        }

        return { success: false, messageKey: 'errInvalidId' };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
