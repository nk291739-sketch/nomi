import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Calendar,
  Clock,
  User,
  Star,
  Phone,
  MessageCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Copy,
  Check
} from 'lucide-react';
import { Appointment, AppointmentStatus, Therapist } from '../../types';
import { getTherapists, submitReview } from '../../services/storageService';
import {
  BUSINESS_PHONE,
  getPhoneCallUrl,
  getCustomerBookingRequestWhatsAppUrl,
  getNewAppointmentEnquiryWhatsAppUrl
} from '../../utils/whatsapp';

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const STATUS_STEPS: AppointmentStatus[] = [
  'PENDING CONFIRMATION',
  'CONFIRMED',
  'THERAPIST ASSIGNED',
  'APPOINTMENT STARTED',
  'COMPLETED'
];

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onRefresh
}) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !appointment) return null;

  const therapists = getTherapists();
  const assignedTherapist = therapists.find((t) => t.id === appointment.therapist_id);

  const isCancelled =
    appointment.appointment_status === 'CANCELLED' || appointment.appointment_status === 'Cancelled';

  // Normalize legacy status strings to new standard
  const normalizedStatus =
    appointment.appointment_status === 'Appointment Requested'
      ? 'PENDING CONFIRMATION'
      : appointment.appointment_status === 'Appointment Confirmed'
      ? 'CONFIRMED'
      : appointment.appointment_status === 'Completed'
      ? 'COMPLETED'
      : appointment.appointment_status === 'Cancelled'
      ? 'CANCELLED'
      : appointment.appointment_status;

  const currentStepIndex = STATUS_STEPS.indexOf(normalizedStatus);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    await submitReview({
      appointment_id: appointment.booking_id,
      customer_id: appointment.customer_id,
      customer_name: appointment.customer_name,
      therapist_id: appointment.therapist_id,
      rating,
      review: reviewText.trim() || 'Remarkable, serene and deeply rejuvenating massage.'
    });
    setIsSubmittingReview(false);
    setReviewDone(true);
    onRefresh();
  };

  const handleCustomerWhatsApp = () => {
    const url = getCustomerBookingRequestWhatsAppUrl({
      booking_id: appointment.booking_id,
      service: appointment.service_name,
      date: appointment.date,
      time: appointment.time
    });
    window.open(url, '_blank');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(appointment.booking_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-stone-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-300 font-bold">
                {appointment.booking_id}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20 text-white font-mono">
                {normalizedStatus}
              </span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold mt-1">
              {appointment.service_name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Booking ID Copy */}
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

          {/* Cancellation Notice */}
          {isCancelled ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-sm font-bold text-red-900">
                  Your RelaxCare appointment has been cancelled.
                </h4>
                <p className="text-xs text-red-700 mt-0.5">
                  {appointment.cancellation_reason ||
                    'This appointment was cancelled. Reach out via WhatsApp or phone if you wish to reschedule.'}
                </p>
              </div>
            </div>
          ) : (
            /* Status Timeline */
            <div className="p-4 bg-white border border-stone-200 rounded-3xl space-y-3 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Appointment Status Timeline</span>
              </h3>
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-stone-200"></div>

                {STATUS_STEPS.map((step, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={step} className="relative flex items-start gap-3 text-xs">
                      <div
                        className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center transition-colors z-10 ${
                          isDone
                            ? 'bg-emerald-800 text-white ring-4 ring-emerald-50'
                            : 'bg-white border-2 border-stone-300 text-transparent'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div
                          className={`font-semibold ${
                            isCurrent
                              ? 'text-emerald-900 text-sm font-serif font-bold'
                              : isDone
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {step}
                          {isCurrent && (
                            <span className="ml-2 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Current Status
                            </span>
                          )}
                        </div>
                        {isCurrent && (
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {step === 'PENDING CONFIRMATION' &&
                              'Your appointment request has been received. Your appointment will be confirmed by our team.'}
                            {step === 'CONFIRMED' &&
                              'Your RelaxCare appointment has been confirmed. Please arrive 10 minutes prior.'}
                            {step === 'THERAPIST ASSIGNED' &&
                              'Therapist has been assigned and is ready for your session.'}
                            {step === 'APPOINTMENT STARTED' &&
                              'Session is currently in progress.'}
                            {step === 'COMPLETED' &&
                              'Treatment completed. We hope you feel thoroughly rejuvenated.'}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assigned Therapist Card */}
          {assignedTherapist && (
            <div className="p-4 bg-white border border-stone-200 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Your Certified Therapist
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Licensed Professional
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-amber-200 shrink-0">
                  <img
                    src={assignedTherapist.photo}
                    alt={assignedTherapist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    {assignedTherapist.name}
                  </h4>
                  <div className="text-xs text-stone-500">{assignedTherapist.experience}</div>
                  <div className="text-xs font-bold text-amber-600 mt-0.5">
                    ⭐ {assignedTherapist.rating} ({assignedTherapist.total_sessions}+ sessions)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rating Section (If Completed) */}
          {(normalizedStatus === 'COMPLETED') && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  Rate Your Experience
                </h4>
                {appointment.rated && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Reviewed ✓
                  </span>
                )}
              </div>

              {appointment.rated || reviewDone ? (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Thank you! Your feedback helps us maintain the highest spa standards.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-stone-600">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Share a few words about your therapist and comfort..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none resize-none text-stone-800"
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Review & Rating
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Appointment Specs Summary */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[10px] mb-1">
              Session Information
            </h4>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Date:</span>
              <span className="font-semibold text-stone-900">{appointment.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Time Slot:</span>
              <span className="font-semibold text-stone-900">{appointment.time}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Duration:</span>
              <span className="font-semibold text-stone-900">{appointment.duration}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Price:</span>
              <span className="font-serif font-black text-stone-900 text-sm">
                ₹{appointment.price}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Payment:</span>
              <span className="font-medium text-stone-900">
                {appointment.payment_method} ({appointment.payment_status})
              </span>
            </div>
            {appointment.notes && (
              <div className="py-1">
                <span className="text-stone-500 block mb-0.5">Special Requests:</span>
                <span className="text-stone-800 italic">"{appointment.notes}"</span>
              </div>
            )}
          </div>

          {/* Quick Contact Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCustomerWhatsApp}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Send booking request message via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700 fill-emerald-700" />
              <span>WhatsApp Request</span>
            </button>

            <a
              href={getPhoneCallUrl(BUSINESS_PHONE)}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <Phone className="w-4 h-4 text-emerald-800" />
              <span>Call Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
