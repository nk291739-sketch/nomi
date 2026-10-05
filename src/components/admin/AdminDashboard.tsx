import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageCircle,
  AlertCircle,
  Bell,
  Check
} from 'lucide-react';
import { Appointment, Therapist, AppointmentStatus } from '../../types';
import { updateAppointmentStatus } from '../../services/storageService';
import { getPhoneCallUrl, getAdminToCustomerWhatsAppUrl } from '../../utils/whatsapp';

interface AdminDashboardProps {
  appointments: Appointment[];
  therapists: Therapist[];
  onNavigateToAppointments: () => void;
  onNavigateToTherapists: () => void;
  onNavigateToServices: () => void;
  onRefresh?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  appointments,
  therapists,
  onNavigateToAppointments,
  onNavigateToTherapists,
  onNavigateToServices,
  onRefresh
}) => {
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. New Enquiries (PENDING CONFIRMATION)
  const newEnquiries = appointments.filter(
    (a) => a.appointment_status === 'PENDING CONFIRMATION' || a.appointment_status === 'Appointment Requested'
  );

  // 2. Today's Appointments
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  // 3. Pending Confirmation
  const pendingConfirmationCount = newEnquiries.length;

  // 4. Confirmed
  const confirmedCount = appointments.filter(
    (a) => a.appointment_status === 'CONFIRMED' || a.appointment_status === 'Appointment Confirmed'
  ).length;

  // 5. Completed
  const completedCount = appointments.filter(
    (a) => a.appointment_status === 'COMPLETED' || a.appointment_status === 'Completed'
  ).length;

  // 6. Cancelled
  const cancelledCount = appointments.filter(
    (a) => a.appointment_status === 'CANCELLED' || a.appointment_status === 'Cancelled'
  ).length;

  // 7. Total Revenue
  const totalRevenue = appointments.reduce((sum, a) => {
    if (a.appointment_status !== 'CANCELLED' && a.appointment_status !== 'Cancelled') {
      return sum + (Number(a.price) || 0);
    }
    return sum;
  }, 0);

  const showFeedback = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleConfirmEnquiry = async (apt: Appointment) => {
    await updateAppointmentStatus(apt.id, 'CONFIRMED');
    showFeedback(`Appointment ${apt.booking_id} confirmed successfully.`);
    if (onRefresh) onRefresh();
  };

  const handleCancelEnquiry = async (apt: Appointment) => {
    const reason = prompt('Reason for cancelling this appointment:', 'Schedule conflict or client request');
    if (reason !== null) {
      await updateAppointmentStatus(apt.id, 'CANCELLED', reason || 'Cancelled by admin');
      showFeedback(`Appointment ${apt.booking_id} cancelled.`);
      if (onRefresh) onRefresh();
    }
  };

  const handleWhatsAppCustomer = (apt: Appointment) => {
    const url = getAdminToCustomerWhatsAppUrl({
      mobile: apt.mobile,
      customer_name: apt.customer_name,
      booking_id: apt.booking_id,
      service: apt.service_name,
      therapist: apt.therapist_name,
      date: apt.date,
      time: apt.time
    });
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {actionSuccessMessage && (
        <div className="p-3.5 bg-emerald-900 text-amber-200 border border-amber-300/40 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-stone-300 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white p-6 rounded-3xl shadow-md border border-amber-300/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
              Live Operations Control Desk
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-[10px] text-emerald-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-Time Sync
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
            RelaxCare Operations Dashboard
          </h1>
          <p className="text-stone-300 text-xs mt-1">
            Real-time appointment enquiries, schedule management, and instant status updates
          </p>
        </div>

        <button
          onClick={onNavigateToAppointments}
          className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-2xl text-xs transition-colors cursor-pointer shrink-0 shadow-md"
        >
          View All Bookings ({appointments.length})
        </button>
      </div>

      {/* DASHBOARD METRICS: The 7 requested metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* 1. New Enquiries */}
        <div className="bg-white p-4 rounded-3xl border border-amber-300/70 shadow-xs relative overflow-hidden bg-gradient-to-b from-amber-50/50 to-white">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-bold text-amber-900">New Enquiries</span>
            <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
          </div>
          <div className="font-serif text-2xl font-black text-amber-700 tabular-nums">
            {newEnquiries.length}
          </div>
          <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">Requires action</span>
        </div>

        {/* 2. Today's Appointments */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium text-stone-700">Today's</span>
            <Clock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
            {todayAppointments.length}
          </div>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Today's schedule</span>
        </div>

        {/* 3. Pending Confirmation */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium text-stone-700">Pending</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-amber-800 tabular-nums">
            {pendingConfirmationCount}
          </div>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Awaiting confirm</span>
        </div>

        {/* 4. Confirmed */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium text-stone-700">Confirmed</span>
            <Check className="w-4 h-4 text-teal-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-teal-800 tabular-nums">
            {confirmedCount}
          </div>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Confirmed slots</span>
        </div>

        {/* 5. Completed */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium text-stone-700">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-emerald-800 tabular-nums">
            {completedCount}
          </div>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Completed sessions</span>
        </div>

        {/* 6. Cancelled */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium text-stone-700">Cancelled</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-red-700 tabular-nums">
            {cancelledCount}
          </div>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Cancelled</span>
        </div>

        {/* 7. Total Revenue */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium text-stone-700">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="font-serif text-xl sm:text-2xl font-black text-stone-900 tabular-nums">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Gross active value</span>
        </div>
      </div>

      {/* ================= NEW ENQUIRIES SECTION ================= */}
      <div className="bg-white rounded-3xl border-2 border-amber-300/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>NEW ENQUIRIES</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                  {newEnquiries.length} New
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Every newly submitted booking appears here immediately in real-time.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 font-medium">
            Status: <span className="font-bold text-amber-800">Pending Confirmation</span>
          </div>
        </div>

        {newEnquiries.length === 0 ? (
          <div className="py-8 text-center bg-stone-50 rounded-2xl border border-stone-200/60 p-4">
            <CheckCircle className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
            <div className="font-serif text-stone-800 font-bold text-sm">
              All caught up! No pending enquiries.
            </div>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
              When a guest submits a new appointment request, it will appear here instantly without needing to refresh.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newEnquiries.map((apt) => (
              <div
                key={apt.id}
                className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-full -mr-8 -mt-8 pointer-events-none"></div>

                <div className="space-y-2.5">
                  {/* Header: Booking ID & Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-emerald-950 bg-white px-2.5 py-1 rounded-lg border border-amber-300">
                      Booking ID: {apt.booking_id}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-200/80 text-amber-950 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {apt.appointment_status}
                    </span>
                  </div>

                  {/* Customer & Mobile */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-2.5 rounded-xl border border-stone-200/60">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-400 uppercase block">Customer</span>
                      <span className="font-bold text-stone-900">{apt.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-stone-400 uppercase block">Mobile</span>
                      <span className="font-mono font-bold text-stone-900">+91 {apt.mobile}</span>
                    </div>
                  </div>

                  {/* Service, Therapist & Schedule */}
                  <div className="space-y-1 text-xs text-stone-700 bg-white/80 p-2.5 rounded-xl border border-stone-200/60">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Service:</span>
                      <span className="font-bold text-stone-900">{apt.service_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Therapist:</span>
                      <span className="font-semibold text-emerald-900">{apt.therapist_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Date & Time:</span>
                      <span className="font-medium text-stone-900">{apt.date} · {apt.time}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-stone-100 items-baseline">
                      <span className="text-stone-500">Amount:</span>
                      <span className="font-serif font-black text-stone-950 text-base">₹{apt.price}</span>
                    </div>
                  </div>

                  {apt.notes && (
                    <div className="text-[11px] bg-white/90 p-2 rounded-lg border border-amber-200/60 text-stone-600 italic">
                      “{apt.notes}”
                    </div>
                  )}
                </div>

                {/* THE 4 ACTION BUTTONS: CONFIRM, CALL CUSTOMER, WHATSAPP, CANCEL */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-amber-200/70">
                  {/* 1. CONFIRM */}
                  <button
                    onClick={() => handleConfirmEnquiry(apt)}
                    className="py-2 px-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    title="Confirm appointment"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
                    <span>CONFIRM</span>
                  </button>

                  {/* 2. CALL CUSTOMER */}
                  <a
                    href={getPhoneCallUrl(apt.mobile)}
                    className="py-2 px-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                    title="Call customer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-800" />
                    <span>CALL</span>
                  </a>

                  {/* 3. WHATSAPP */}
                  <button
                    onClick={() => handleWhatsAppCustomer(apt)}
                    className="py-2 px-2 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="WhatsApp message to customer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                    <span>WHATSAPP</span>
                  </button>

                  {/* 4. CANCEL */}
                  <button
                    onClick={() => handleCancelEnquiry(apt)}
                    className="py-2 px-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Cancel appointment"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>CANCEL</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT APPOINTMENTS TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              Recent Appointments
            </h3>
            <p className="text-xs text-stone-500">Live stream of incoming spa reservations</p>
          </div>

          <button
            onClick={onNavigateToAppointments}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer font-serif"
          >
            <span>View All ({appointments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-y border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Booking ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Therapist</th>
                <th className="py-2.5 px-3">Schedule</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {appointments.slice(0, 6).map((a) => (
                <tr key={a.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-900">
                    {a.booking_id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-900">{a.customer_name}</div>
                    <div className="text-[10px] text-stone-400 font-mono">+91 {a.mobile}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-stone-800">{a.service_name}</td>
                  <td className="py-3 px-3 text-stone-700">{a.therapist_name}</td>
                  <td className="py-3 px-3 text-stone-600">
                    <div>{a.date}</div>
                    <div className="text-[10px] text-stone-400">{a.time}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        a.appointment_status === 'COMPLETED' || a.appointment_status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : a.appointment_status === 'CANCELLED' || a.appointment_status === 'Cancelled'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : a.appointment_status === 'PENDING CONFIRMATION' || a.appointment_status === 'Appointment Requested'
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}
                    >
                      {a.appointment_status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-serif font-black text-stone-900">
                    ₹{a.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
