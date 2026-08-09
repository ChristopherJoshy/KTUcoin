import React, { useEffect, useState } from 'react';
import { Bell, Award, ShieldCheck, AlertTriangle, UserCog, BellOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppNotification } from '../types';
import { fetchNotifications, markNotificationRead } from '../services/api';
import { Modal } from './ui/Modal';
import { cn } from '../lib/cn';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILTERS = ['ALL', 'POINTS', 'VERIFICATION', 'WARNING', 'SYSTEM'] as const;
type FilterKey = (typeof FILTERS)[number];

// this function is used for notifications drawer fetching user notifications and filtering by type for more info refer code-wiki.md line 105
export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL');

  const loadNotifications = async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      const list = await fetchNotifications(currentUser._id);
      setNotifications(list);
    } catch (err: any) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser?._id) {
      loadNotifications();
    }
  }, [isOpen, currentUser?._id]);

  const handleMarkRead = async (notification: AppNotification) => {
    if (notification.read) return;
    try {
      await markNotificationRead(notification._id);
      setNotifications(prev =>
        prev.map(n => (n._id === notification._id ? { ...n, read: true } : n))
      );
    } catch (err: any) {
      setNotifications(prev =>
        prev.map(n => (n._id === notification._id ? { ...n, read: true } : n))
      );
    }
  };

  const getNotificationIcon = (notification: AppNotification) => {
    if (notification.type === 'POINT_CREDIT') return <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    if (notification.type === 'VERIFICATION') return <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    if (notification.type === 'WARNING') return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    return <UserCog className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
  };

  const matchesFilter = (notification: AppNotification) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'POINTS') return notification.type === 'POINT_CREDIT';
    if (activeFilter === 'VERIFICATION') return notification.type === 'VERIFICATION';
    if (activeFilter === 'WARNING') return notification.type === 'WARNING';
    if (activeFilter === 'SYSTEM') return notification.type === 'ROLE_ASSIGN';
    return true;
  };

  const filteredNotifications = notifications.filter(matchesFilter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      subtitle={
        unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'
      }
      icon={<Bell className="w-5 h-5" />}
      size="md"
    >
      {/* Filter pills */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              activeFilter === filter
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {filter === 'ALL' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-14 text-center text-xs text-slate-400 dark:text-slate-500 animate-pulse">
          Loading notifications...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <BellOff className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No notifications here</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">New activity will appear in this feed.</p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
          {filteredNotifications.map(notification => (
            <button
              key={notification._id}
              onClick={() => handleMarkRead(notification)}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left',
                !notification.read
                  ? 'bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/60'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {getNotificationIcon(notification)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {notification.title}
                  <span className="ml-1.5 text-[10px] font-normal text-slate-400">
                    {notification.senderName}
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {notification.message}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <span className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
};
