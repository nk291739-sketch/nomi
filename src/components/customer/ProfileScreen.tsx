import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Bell,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
  Info,
  Sparkles,
  Flower2,
  Lock
} from 'lucide-react';
import { User as UserType } from '../../types';

interface ProfileScreenProps {
  currentUser: UserType;
  onOpenAppointments: () => void;
  onOpenNotifications: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onOpenAppointments,
  onOpenNotifications,
  onOpenSupport,
  onOpenAdmin,
  onLogout
}) => {
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  return (
    <div className="space-y-5 pb-20">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-amber-200 font-serif text-2xl font-bold flex items-center justify-center shadow-md shrink-0 border border-amber-300/30">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-xl font-bold text-stone-900 truncate">
              {currentUser.name || 'Valued Guest'}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono mt-0.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>+91 {currentUser.mobile}</span>
            </div>
            {currentUser.email && (
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5 truncate">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span className="truncate">{currentUser.email}</span>
              </div>
            )}
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>RelaxCare Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Options (Requirement #13) */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
        <button
          onClick={onOpenAppointments}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">My Appointments</div>
              <div className="text-[11px] text-stone-500">Upcoming, completed and past sessions</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={onOpenNotifications}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-800">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Notifications</div>
              <div className="text-[11px] text-stone-500">Appointment updates & confirmations</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={onOpenSupport}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-800">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Help & Support</div>
              <div className="text-[11px] text-stone-500">Helpline: +91 75057 41030</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setActivePolicyModal('cancellation')}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-stone-100 text-stone-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Cancellation Policy</div>
              <div className="text-[11px] text-stone-500">Free rescheduling up to 2 hours prior</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setActivePolicyModal('terms')}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-stone-100 text-stone-700">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Terms & Professional Policy</div>
              <div className="text-[11px] text-stone-500">Legitimate wellness sanctuary standards</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setActivePolicyModal('about')}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-stone-100 text-stone-700">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">About RelaxCare</div>
              <div className="text-[11px] text-stone-500">Our philosophy and certified therapists</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Admin Portal Shortcut Card */}
      <div className="p-4 bg-stone-200/60 rounded-3xl border border-stone-300/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-amber-300 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900">Spa Management Portal</div>
            <div className="text-[10px] text-stone-500">Director dashboard, therapist scheduling</div>
          </div>
        </div>
        <button
          onClick={onOpenAdmin}
          className="py-2 px-3 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          Admin Login
        </button>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="w-full py-3 px-4 bg-stone-100 hover:bg-red-50 hover:text-red-700 border border-stone-200 text-stone-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out Account</span>
      </button>

      {/* Modal for Policies & About Us */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
          <div className="bg-stone-50 rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {activePolicyModal === 'about' && 'About RelaxCare'}
                {activePolicyModal === 'cancellation' && 'Cancellation & Rescheduling'}
                {activePolicyModal === 'terms' && 'Terms & Professional Ethics Policy'}
              </h3>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600 leading-relaxed space-y-2 font-sans max-h-[60vh] overflow-y-auto">
              {activePolicyModal === 'about' && (
                <>
                  <p>
                    <strong>RelaxCare</strong> is a sanctuary of therapeutic wellness and restorative spa treatments.
                    Our mission is articulated simply: <em>“Relax. Refresh. Rejuvenate.”</em>
                  </p>
                  <p>
                    We operate with certified male and female therapists trained in Swedish, Deep Tissue, Aromatherapy, and Thai bodywork, providing tranquil, temperature-controlled environments, organic cold-pressed oils, and private monsoon shower facilities.
                  </p>
                </>
              )}

              {activePolicyModal === 'cancellation' && (
                <>
                  <p>
                    <strong>Complimentary Rescheduling:</strong> You may cancel or reschedule your session free of charge up to 2 hours before the scheduled time slot via the app or WhatsApp helpline (+91 75057 41030).
                  </p>
                  <p>
                    <strong>Late Arrival:</strong> To respect the schedule of other guests, late arrivals may result in an abbreviated treatment time at the full service rate.
                  </p>
                </>
              )}

              {activePolicyModal === 'terms' && (
                <>
                  <p className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    <strong>Strict Professional Standards:</strong> RelaxCare provides legitimate, therapeutic, and relaxation massage and spa services only. Any inappropriate behavior is strictly prohibited and results in immediate termination of the session without refund.
                  </p>
                  <p>
                    All therapists are background-checked professionals. Health conditions and allergies must be disclosed prior to treatment.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setActivePolicyModal(null)}
              className="w-full py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
