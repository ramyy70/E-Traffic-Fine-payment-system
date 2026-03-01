/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { initialFines, initialComplaints, initialNotifications } from '../data/mockData';
import { driverUserIdFromNic, normalizeNic } from '../utils/identity';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const today = () => new Date().toISOString().split('T')[0];
    const timeNow = () => new Date().toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const safeParse = (value, fallback) => {
        try {
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    };

    // Load from localStorage or use initial mock data
    const [fines, setFines] = useState(() => {
        const saved = localStorage.getItem('traffic_fines');
        return saved ? safeParse(saved, initialFines) : initialFines;
    });

    const [complaints, setComplaints] = useState(() => {
        const saved = localStorage.getItem('traffic_complaints');
        return saved ? safeParse(saved, initialComplaints) : initialComplaints;
    });

    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('traffic_notifications');
        return saved ? safeParse(saved, initialNotifications) : initialNotifications;
    });

    // Persist to localStorage whenever state changes
    const [auditLog, setAuditLog] = useState(() => {
        const saved = localStorage.getItem('traffic_audit');
        return saved ? safeParse(saved, []) : [];
    });

    // Real-time sync across tabs/windows (standard browser "storage" event)
    useEffect(() => {
        const onStorage = (event) => {
            if (event.key === 'traffic_fines') {
                setFines(safeParse(event.newValue, initialFines));
            }
            if (event.key === 'traffic_complaints') {
                setComplaints(safeParse(event.newValue, initialComplaints));
            }
            if (event.key === 'traffic_notifications') {
                setNotifications(safeParse(event.newValue, initialNotifications));
            }
            if (event.key === 'traffic_audit') {
                setAuditLog(safeParse(event.newValue, []));
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem('traffic_fines', JSON.stringify(fines));
    }, [fines]);

    useEffect(() => {
        localStorage.setItem('traffic_complaints', JSON.stringify(complaints));
    }, [complaints]);

    useEffect(() => {
        localStorage.setItem('traffic_notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('traffic_audit', JSON.stringify(auditLog));
    }, [auditLog]);

    // Actions
    const addNotification = (messageInput, userId = null) => {
        const isStructured = messageInput && typeof messageInput === 'object';
        const message = isStructured ? messageInput.fallback || '' : messageInput;
        const messageKey = isStructured ? messageInput.key || null : null;
        const messageParams = isStructured ? messageInput.params || {} : {};
        const newNotif = {
            id: 'n' + Date.now(),
            userId,
            message,
            messageKey,
            messageParams,
            date: today(),
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const addToLog = (action, detailsInput, user) => {
        const isStructured = detailsInput && typeof detailsInput === 'object';
        const details = isStructured ? detailsInput.fallback || '' : detailsInput;
        const detailsKey = isStructured ? detailsInput.key || null : null;
        const detailsParams = isStructured ? detailsInput.params || {} : {};
        const newLog = {
            id: 'al' + Date.now(),
            action,
            details,
            detailsKey,
            detailsParams,
            user,
            date: new Date().toISOString()
        };
        setAuditLog(prev => [newLog, ...prev]);
    };

    const issueFine = (data) => {
        const nic = normalizeNic(data.nic || '');
        const fineId = 'f' + Date.now();

        const newFine = {
            id: fineId,
            // Link fine to the same driver id format used in AuthContext
            userId: driverUserIdFromNic(nic),
            violation: data.violationName,
            amount: Number(data.amount) || 0,
            date: today(),
            time: timeNow(),
            location: data.location,
            status: 'Unpaid',
            vehicleNo: data.vehicleNo,
            offenderName: data.driverName,
            offenderNic: nic,
            address: data.address
        };

        setFines(prev => [newFine, ...prev]);
        addNotification(
            {
                key: 'notifFineIssued',
                params: { fineId, nic: nic || 'N/A' },
                fallback: `New traffic fine ${fineId} issued for NIC ${nic || 'N/A'}`,
            },
            newFine.userId
        );
        addToLog(
            'FINE_ISSUED',
            {
                key: 'logFineIssued',
                params: { fineId, nic: nic || 'N/A' },
                fallback: `Fine #${fineId} issued to NIC ${nic || 'N/A'}`,
            },
            'Officer'
        );
    };

    const createReceiptNo = () => `REC-${Date.now()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const createTransactionId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return `TX-${crypto.randomUUID()}`;
        return `TX-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
    };

    const payFine = (fineId, payment = {}) => {
        const receiptNo = payment.receiptNo || createReceiptNo();
        const transactionId = payment.transactionId || createTransactionId();
        const paidAt = new Date().toISOString();

        let paidFine = null;

        setFines(prev => prev.map(fine => {
            if (fine.id !== fineId) return fine;
            paidFine = fine;
            return {
                ...fine,
                status: 'Paid',
                paidDate: today(),
                paidAt,
                receiptNo,
                transactionId,
                paymentMethod: payment.method || 'unknown',
                paymentChannel: payment.channel || 'web',
                payerUserId: payment.payerUserId || null,
                paymentMeta: payment.meta || {}
            };
        }));

        addNotification(
            {
                key: 'notifPaymentSuccessful',
                params: { receiptNo },
                fallback: `Fine Payment Successful. Receipt #${receiptNo}`,
            },
            paidFine?.userId || null
        );
        addToLog(
            'PAYMENT',
            {
                key: 'logPayment',
                params: { fineId, receiptNo },
                fallback: `Fine #${fineId} paid. Receipt #${receiptNo}`,
            },
            payment.payerUserId || 'Current User'
        );
    };

    const submitComplaint = (complaintData) => {
        const newComplaint = {
            id: 'c' + (complaints.length + 1),
            ...complaintData,
            status: 'Pending',
            submittedDate: new Date().toISOString().split('T')[0]
        };
        setComplaints(prev => [...prev, newComplaint]);
        addNotification({
            key: 'notifComplaintSubmitted',
            params: { complaintId: newComplaint.id },
            fallback: `Complaint Submitted Successfully. Reference #${newComplaint.id}`,
        });
        addToLog(
            'COMPLAINT_SUBMIT',
            {
                key: 'logComplaintSubmitted',
                params: { complaintId: newComplaint.id },
                fallback: `Complaint #${newComplaint.id} submitted`,
            },
            'Current User'
        );
    };

    const updateComplaintStatus = (id, newStatus) => {
        setComplaints(prev => prev.map(c =>
            c.id === id ? { ...c, status: newStatus } : c
        ));
        // Ideally we would notify the specific user, but for demo we just add a notification globally or handled by UI
        addNotification({
            key: 'notifComplaintStatusUpdated',
            params: { complaintId: id, status: newStatus },
            fallback: `Complaint #${id} marked as ${newStatus}`,
        });
        addToLog(
            'COMPLAINT_UPDATE',
            {
                key: 'logComplaintUpdated',
                params: { complaintId: id, status: newStatus },
                fallback: `Complaint #${id} ${newStatus}`,
            },
            'Admin'
        );
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
