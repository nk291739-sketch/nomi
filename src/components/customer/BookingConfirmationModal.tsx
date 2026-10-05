import React from 'react';
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { Appointment } from '../../types';
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_FORMATTED,
  getPhoneCallUrl,
  getNewAppointmentEnquiryWhatsAppUrl,
  getCustomerBookingRequestWhatsAppUrl,
  createGoogleCalendarUrl
} from '../../utils/whatsapp';

interface BookingConfirmationModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onViewAppointment: (apt: Appointment) => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onViewAppointment
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !appointment) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(appointment.booking_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // WhatsApp template 1: Full enquiry to business
  const handleOpenEnquiryWhatsApp = () => {
    const url = getNewAppointmentEnquiryWhatsAppUrl({
      booking_id: appointment.booking_id,
      customer_name: appointment.customer_name,
      mobile: appointment.mobile,
      service: appointment.service_name,
      therapist: appointment.therapist_name,
      date: appointment.date,
      time: appointment.time
    });
    window.open(url, '_blank');
  };

  // WhatsApp template 2: Customer submission message
  const handleOpenCustomerWhatsApp = () => {
    const url = getCustomerBookingRequestWhatsAppUrl({
      booking_id: appointment.booking_id,
      service: appointment.service_name,
      date: appointment.date,
      time: appointment.time
    });
    window.open(url, '_blank');
  };

  const handleAddToCalendar = () => {
    const url = createGoogleCalendarUrl({
      booking_id: appointment.booking_id,
      service_name: appointment.service_name,
      therapist_name: appointment.therapist_name,
      date: appointment.date,
      time: appointment.time
    });
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-stone-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Customer Notification Banner (Exact requirement) */}
        <div className="p-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white text-center relative">
          <div className="w-14 h-14 bg-amber-400/20 border border-amber-300/30 rounded-2xl flex items-center justify-center mx-auto mb-2.5 text-amber-300">
            <CheckCircle className="w-8 h-8 stroke-[2.2]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-amber-200/90 font-bold font-serif">
            RelaxCare Appointment Desk
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">
            Your appointment request has been received.
          </h2>
          <div className="inline-block mt-2 px-3 py-1 bg-amber-400/10 border border-amber-300/30 rounded-xl font-mono text-sm font-bold text-amber-200">
            Booking ID: {appointment.booking_id}
          </div>
          <p className="text-amber-100/90 text-xs mt-2 font-medium">
            Your appointment will be confirmed by our team.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Status Alert Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-900">Current Status: </span>
              <span className="inline-block font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md ml-1">
                {appointment.appointment_status}
              </span>
              <p className="text-stone-600 mt-0.5 text-[11px]">
                Our spa concierge will review your schedule and confirm with {appointment.therapist_name}.
              </p>
            </div>
          </div>

          {/* Booking ID badge */}
          <div className="p-3 bg-white border border-stone-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Booking ID
              </span>
              <div className="text-base font-mono font-bold text-emerald-900">
                {appointment.booking_id}
              </div>
            </div>
            <button
              onClick={handleCopyId}
              className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Details list */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Service:</span>
              <span className="font-bold text-stone-900">{appointment.service_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Therapist:</span>
              <span className="font-semibold text-stone-900">{appointment.therapist_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Date:</span>
              <span className="font-semibold text-stone-900">{appointment.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Time:</span>
              <span className="font-semibold text-stone-900">{appointment.time}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Duration:</span>
              <span className="font-semibold text-stone-900">{appointment.duration}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Customer Name:</span>
              <span className="font-semibold text-stone-900">{appointment.customer_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Mobile:</span>
              <span className="font-mono font-medium text-stone-900">+91 {appointment.mobile}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Amount:</span>
              <span className="font-serif font-black text-stone-900 text-sm">
                ₹{appointment.price}
              </span>
            </div>
            <div className="flex justify-between py-1 items-center">
              <span className="text-stone-500">Payment:</span>
              <span className="text-stone-700 font-medium">
                {appointment.payment_method} ({appointment.payment_status})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onViewAppointment(appointment);
              }}
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>View Appointment Status</span>
            </button>

            {/* WhatsApp Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOpenEnquiryWhatsApp}
                className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold rounded-2xl text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Send appointment enquiry to RelaxCare desk"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700 fill-emerald-700" />
                <span>WhatsApp Desk</span>
              </button>

              <button
                onClick={handleOpenCustomerWhatsApp}
                className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold rounded-2xl text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Send booking request message"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>My Request WA</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCalendar}
                className="py-2.5 px-3 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 font-semibold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-800" />
                <span>Add to Calendar</span>
              </button>

              <a
                href={getPhoneCallUrl(BUSINESS_PHONE)}
                className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-800" />
                <span>Call Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
