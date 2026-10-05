import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Star,
  ChevronRight,
  Plus,
  AlertCircle,
  XCircle,
  Sparkles
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types';

interface MyAppointmentsScreenProps {
  appointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
  onBookNew: () => void;
  onCancelAppointment: (apt: Appointment) => void;
  onRateAppointment: (apt: Appointment) => void;
}

export const MyAppointmentsScreen: React.FC<MyAppointmentsScreenProps> = ({
  appointments,
  onSelectAppointment,
  onBookNew,
  onCancelAppointment,
  onRateAppointment
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const upcomingStatuses: AppointmentStatus[] = [
    'PENDING CONFIRMATION',
    'CONFIRMED',
    'THERAPIST ASSIGNED',
    'APPOINTMENT STARTED',
    'Appointment Requested',
    'Appointment Confirmed'
  ];

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'upcoming') {
      return upcomingStatuses.includes(apt.appointment_status);
    }
    if (activeTab === 'completed') {
      return apt.appointment_status === 'COMPLETED' || apt.appointment_status === 'Completed';
    }
    if (activeTab === 'cancelled') {
      return apt.appointment_status === 'CANCELLED' || apt.appointment_status === 'Cancelled';
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">My Appointments</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            View scheduled sessions, status timeline, and therapist details
          </p>
        </div>

        <button
          onClick={onBookNew}
          className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book Session</span>
        </button>
      </div>

      {/* Segmented Tabs (Requirement #11) */}
      <div className="flex items-center p-1 bg-stone-200/80 rounded-2xl">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Upcoming ({appointments.filter((a) => upcomingStatuses.includes(a.appointment_status)).length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Completed ({appointments.filter((a) => a.appointment_status === 'Completed').length})
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'cancelled'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Cancelled ({appointments.filter((a) => a.appointment_status === 'Cancelled').length})
        </button>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-14 px-4 bg-white rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="w-16 h-16 bg-amber-50 text-amber-800 rounded-3xl flex items-center justify-center mx-auto mb-3 border border-amber-200/60">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-base font-bold text-stone-900">
            No {activeTab} appointments
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Ready for a calming massage or restorative wellness ritual? Browse our certified therapists.
          </p>
          <button
            onClick={onBookNew}
            className="mt-4 py-2.5 px-5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            Explore Spa Menu
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800">
                        {apt.booking_id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          apt.appointment_status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : apt.appointment_status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {apt.appointment_status}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-stone-900 mt-1">
                      {apt.service_name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400">Session Price</span>
                    <div className="font-serif text-base font-black text-stone-900">
                      ₹{apt.price}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span>Therapist: <strong>{apt.therapist_name}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{apt.duration} Session</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{apt.date} · {apt.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-stone-400">Payment:</span>
                    <span className="font-medium text-stone-700">{apt.payment_method} ({apt.payment_status})</span>
                  </div>
                </div>

                {/* Action Buttons (Requirement #11) */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectAppointment(apt)}
                    className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {activeTab === 'upcoming' && (
                      <button
                        onClick={() => onCancelAppointment(apt)}
                        className="py-1.5 px-3 text-red-600 hover:bg-red-50 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                      >
                        Cancel Appointment
                      </button>
                    )}

                    {activeTab === 'completed' && (
                      <button
                        onClick={() => onRateAppointment(apt)}
                        className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{apt.rated ? 'View Rating' : 'Rate Experience'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
