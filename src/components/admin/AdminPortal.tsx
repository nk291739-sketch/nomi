import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  ArrowLeft,
  LogOut,
  Flower2,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Appointment, Service, Therapist } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminAppointmentList } from './AdminAppointmentList';
import { AdminTherapistList } from './AdminTherapistList';
import { AdminServiceList } from './AdminServiceList';

interface AdminPortalProps {
  appointments: Appointment[];
  therapists: Therapist[];
  services: Service[];
  onBackToCustomerApp: () => void;
  onRefresh: () => void;
  onLogoutAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  appointments,
  therapists,
  services,
  onBackToCustomerApp,
  onRefresh,
  onLogoutAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'therapists' | 'services'>('dashboard');

  const pendingCount = appointments.filter(
    (a) =>
      a.appointment_status === 'PENDING CONFIRMATION' ||
      a.appointment_status === 'Appointment Requested'
  ).length;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900 font-sans">
      {/* Top Admin Navigation */}
      <header className="sticky top-0 z-40 bg-stone-950 text-white shadow-md border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToCustomerApp}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Guest App"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold border border-amber-300/30">
                <Flower2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm sm:text-base tracking-tight block leading-tight">
                  RelaxCare
                </span>
                <span className="text-[10px] text-amber-300/80 font-mono">Spa Admin Console</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-900/90 p-1 rounded-2xl border border-stone-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-900 text-amber-200'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'appointments'
                  ? 'bg-emerald-900 text-amber-200'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Appointments</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 font-bold text-[9px] font-mono">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('therapists')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'therapists'
                  ? 'bg-emerald-900 text-amber-200'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Therapists</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'services'
                  ? 'bg-emerald-900 text-amber-200'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Menu & Prices</span>
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToCustomerApp}
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Guest View</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 transition-colors cursor-pointer"
              title="Admin Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex border-t border-stone-800 overflow-x-auto px-2 py-1.5 gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-emerald-900 text-amber-200' : 'text-stone-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'appointments' ? 'bg-emerald-900 text-amber-200' : 'text-stone-400'
            }`}
          >
            Appointments ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('therapists')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'therapists' ? 'bg-emerald-900 text-amber-200' : 'text-stone-400'
            }`}
          >
            Therapists
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'services' ? 'bg-emerald-900 text-amber-200' : 'text-stone-400'
            }`}
          >
            Menu & Pricing
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            appointments={appointments}
            therapists={therapists}
            onNavigateToAppointments={() => setActiveTab('appointments')}
            onNavigateToTherapists={() => setActiveTab('therapists')}
            onNavigateToServices={() => setActiveTab('services')}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === 'appointments' && (
          <AdminAppointmentList appointments={appointments} onRefresh={onRefresh} />
        )}

        {activeTab === 'therapists' && (
          <AdminTherapistList therapists={therapists} onRefresh={onRefresh} />
        )}

        {activeTab === 'services' && (
          <AdminServiceList services={services} onRefresh={onRefresh} />
        )}
      </main>
    </div>
  );
};
