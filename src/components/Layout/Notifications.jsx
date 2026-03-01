import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
    const { notifications } = useData();
    const { t } = useLang();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scopedNotifications = user
        ? notifications.filter((n) => !n.userId || n.userId === user.id)
        : notifications;

    const unreadCount = scopedNotifications.filter((notification) => !notification.read).length;
    const renderNotificationMessage = (notification) => {
        if (!notification.messageKey) return notification.message;
        const translated = t(notification.messageKey, notification.messageParams || {});
        if (translated === notification.messageKey && notification.message) return notification.message;
        return translated;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="ring-focus relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                aria-label={t('openNotifications')}
                aria-expanded={isOpen}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="animate-rise absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-bold text-slate-900">{t('notifications')}</h3>
                        <span className="text-xs font-semibold text-slate-500">
                            {scopedNotifications.length} {t('total')}
                        </span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {scopedNotifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-slate-500">{t('noNotifications')}</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {scopedNotifications.map((notification) => (
                                    <div key={notification.id} className="px-4 py-3 transition hover:bg-slate-50">
                                        <p className="text-sm font-medium text-slate-700">{renderNotificationMessage(notification)}</p>
                                        <p className="mt-1 text-xs text-slate-500">{notification.date}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
