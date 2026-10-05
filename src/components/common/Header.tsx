import React from 'react';
import {
  Flower2,
  Phone,
  MessageCircle,
  Bell,
  Lock,
  User as UserIcon
} from 'lucide-react';
import { User as UserType } from '../../types';
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_FORMATTED,
  getPhoneCallUrl,
  getGeneralSupportWhatsAppUrl
} from '../../utils/whatsapp';

interface HeaderProps {
  currentUser: UserType;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  onOpenLogin,
  onOpenAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with delicate flower icon */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-950 to-emerald-900 text-amber-300 flex items-center justify-center shadow-xs border border-amber-300/30">
            <Flower2 className="w-5 h-5 stroke-[2]" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
            RelaxCare
          </span>
        </div>

        {/* Zone 2: Support contacts (clean desktop links) */}
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-stone-600">
          <a
            href={getPhoneCallUrl(BUSINESS_PHONE)}
            className="flex items-center gap-1.5 hover:text-emerald-800 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-800" />
            <span>Concierge: {BUSINESS_PHONE_FORMATTED}</span>
          </a>

          <a
            href={getGeneralSupportWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-900 transition-colors bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-800" />
            <span>WhatsApp Appointment</span>
          </a>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>

          {/* Admin shortcut */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
            title="Spa Admin Dashboard"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-800" />
            <span>Admin</span>
          </button>

          {/* Profile / Login */}
          {currentUser.id !== 'user-guest' ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 pl-2.5 bg-stone-200/70 hover:bg-stone-200 rounded-2xl transition-colors cursor-pointer"
            >
              <span className="text-xs font-bold text-stone-800 max-w-[85px] truncate">
                {currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}
              </span>
              <div className="w-7 h-7 rounded-xl bg-emerald-950 text-amber-200 font-serif font-bold text-xs flex items-center justify-center border border-amber-300/30">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
