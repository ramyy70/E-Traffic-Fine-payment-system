/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, driverHelpers, policeHelpers, adminHelpers, auditHelpers } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { normalizeNic } from '../utils/identity';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    const [fines, setFines] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [auditLog, setAuditLog] = useState([]);

    const today = () => new Date().toISOString().split('T')[0];
    const timeNow = () => new Date().toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Fetch data based on user role when they log in
    useEffect(() => {
        if (!user) {
            setFines([]);
            setComplaints([]);
            setNotifications([]);
            setAuditLog([]);
            return;
        }

        const loadContent = async () => {
            if (user.role === 'driver') {
                const [finesRes, complaintsRes, notificationsRes] = await Promise.all([
                    driverHelpers.getDriverFines(user.id),
                    driverHelpers.getDriverComplaints(user.id),
                    driverHelpers.getDriverNotifications(user.id)
                ]);
                setFines(finesRes || []);
                setComplaints(complaintsRes || []);
                setNotifications(notificationsRes || []);
            } else if (user.role === 'police') {
                const officerComplaints = await policeHelpers.getAssignedComplaints(user.id);
                setComplaints(officerComplaints || []);
            } else if (user.role === 'admin') {
                const [complaintsRes, finesRes] = await Promise.all([
                    adminHelpers.getAllComplaints(),
                    adminHelpers.getAllFines()
                ]);
                setComplaints(complaintsRes || []);
                setFines(finesRes || []);
            }
        };

        loadContent();

    }, [user]);

    // Actions
    const addNotification = async (messageInput, userId = null) => {
        const isStructured = messageInput && typeof messageInput === 'object';
        const message = isStructured ? messageInput.fallback || '' : messageInput;
        
        await auditHelpers.createNotification(userId, "System Alert", message, "general");
        
        // Optimistic update for UI
        const newNotif = {
            id: 'n' + Date.now(),
            user_id: userId,
            message,
            title: "System Alert",
            created_at: new Date().toISOString(),
            is_read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const addToLog = async (action, detailsInput, targetUser) => {
        const isStructured = detailsInput && typeof detailsInput === 'object';
        const details = isStructured ? detailsInput.fallback || '' : detailsInput;

        await auditHelpers.logAction(action, 'system', 'sys', null, { details });
        
        // Optimistic update
        const newLog = {
            id: 'al' + Date.now(),
            action,
            new_values: { details },
            user: targetUser,
            created_at: new Date().toISOString()
        };
        setAuditLog(prev => [newLog, ...prev]);
    };

    const issueFine = async (data) => {
        const nic = normalizeNic(data.nic || '');
        
        // Resolve driver ID in Supabase
        let driverId = null;
        if (nic) {
            const { data: dData } = await supabase.from('drivers').select('id').eq('nic_number', nic).single();
            if (dData) driverId = dData.id;
        }

        const finePayload = {
            driver_id: driverId,
            vehicle_id: null,
            officer_id: user?.id,
            violation_id: null, 
            fine_amount: Number(data.amount) || 0,
            fine_description: data.violationName,
            notes: `Location: ${data.location}, Vehicle: ${data.vehicleNo}, Nic: ${nic}`,
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        };

        const result = await policeHelpers.issueFine(finePayload);
        
        if (result.success) {
            // Re-fetch fines or optimistic update
            setFines(prev => [result.fine, ...prev]);
            
            if (driverId) {
                await addNotification({ fallback: `New traffic fine issued for ${data.violationName}` }, driverId);
            }
            await addToLog('FINE_ISSUED', { fallback: `Fine issued to NIC ${nic || 'N/A'}` }, 'Officer');
        } else {
            console.error(result.error);
        }
    };

    const payFine = async (fineId, payment = {}) => {
        const receiptNo = payment.receiptNo || `REC-${Date.now()}`;
        const transactionId = payment.transactionId || `TX-${Date.now()}`;

        // Create fine payment in Supabase
        const { error } = await supabase.from('fine_payments').insert([{
            fine_id: fineId,
            driver_id: user?.id,
            payment_amount: payment.amount || 0,
            payment_method: payment.method || 'card',
            transaction_reference: transactionId,
            receipt_number: receiptNo,
            payment_status: 'successful'
        }]);

        if (!error) {
            // Update fine status
            await supabase.from('traffic_fines').update({ status: 'paid' }).eq('id', fineId);

            // Optimistic update
            setFines(prev => prev.map(fine => {
                if (fine.id !== fineId) return fine;
                return { ...fine, status: 'paid' };
            }));

            addNotification({ fallback: `Fine Payment Successful. Receipt #${receiptNo}` }, user?.id);
            addToLog('PAYMENT', { fallback: `Fine paid. Receipt #${receiptNo}` }, user?.name || 'User');
        } else {
            console.error('Payment Error:', error);
        }
    };

    const submitComplaint = async (complaintData) => {
        const payload = {
            driver_id: user?.id,
            vehicle_id: null,
            officer_id: null,
            violation_id: null,
            station_id: null,
            location: complaintData.location || 'Unknown',
            latitude: null,
            longitude: null,
            incident_description: complaintData.description || 'No description',
            notes: `Date: ${complaintData.date}, Time: ${complaintData.time}`,
            priority: 'normal'
        };

        const result = await policeHelpers.createComplaint(payload);

        if (result.success) {
            setComplaints(prev => [result.complaint, ...prev]);
            addNotification({ fallback: `Complaint Submitted Successfully. Reference #${result.complaint.id}` }, user?.id);
            addToLog('COMPLAINT_SUBMIT', { fallback: 'Complaint submitted' }, 'Current User');
        } else {
            console.error(result.error);
        }
    };

    const updateComplaintStatus = async (id, newStatus) => {
        const { error } = await supabase.from('traffic_complaints').update({ status: newStatus }).eq('id', id);

        if (!error) {
            setComplaints(prev => prev.map(c =>
                c.id === id ? { ...c, status: newStatus } : c
            ));
            
            // Assume the complaint driver_id if we want to notify them
            const cItem = complaints.find(c => c.id === id);
            if (cItem && cItem.driver_id) {
                addNotification({ fallback: `Complaint #${id} marked as ${newStatus}` }, cItem.driver_id);
            }
            addToLog('COMPLAINT_UPDATE', { fallback: `Complaint #${id} ${newStatus}` }, 'Admin');
        } else {
            console.error("Error updating complaint:", error);
        }
    };

    return (
        <DataContext.Provider value={{
            fines,
            complaints,
            notifications,
            auditLog,
            payFine,
            issueFine,
            submitComplaint,
            updateComplaintStatus
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
