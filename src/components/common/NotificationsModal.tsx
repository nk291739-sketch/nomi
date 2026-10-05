import React from 'react';
import { X, Bell, CheckCircle, Clock, Calendar, Sparkles } from 'lucide-react';
import { NotificationItem } from '../../types';
import { markNotificationsAsRead } from '../../services/storageService';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  notifications: NotificationItem[];
  onSelectAppointmentId?: (appointmentId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  userId,
  notifications,
  onSelectAppointmentId
}) => {
  if (!isOpen) return null;

  const handleMarkRead = () => {
    markNotificationsAsRead(userId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md max-h-[85vh] flex flex-col bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-300" />
            <h2 className="font-serif text-base font-bold">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkRead}
              className="text-[11px] font-semibold text-amber-100/90 hover:underline cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-stone-400">
              No notifications yet. You will receive session reminders and confirmations here.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.appointment_id && onSelectAppointmentId) {
                    onSelectAppointmentId(n.appointment_id);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border text-xs transition-colors flex items-start gap-3 cursor-pointer ${
                  !n.read
                    ? 'bg-amber-50/70 border-amber-200/80 hover:bg-amber-50'
                    : 'bg-white border-stone-200 hover:bg-stone-100/70'
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-stone-200 text-emerald-800 shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-stone-900">{n.title}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(n.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-stone-600 mt-1 leading-snug">{n.message}</p>
                  {n.appointment_id && (
                    <span className="inline-block mt-1 font-mono text-[10px] font-bold text-emerald-800">
                      View {n.appointment_id} →
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
