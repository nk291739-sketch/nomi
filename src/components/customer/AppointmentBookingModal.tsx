import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Service, Therapist, User as UserType } from '../../types';
import { TIME_SLOTS } from '../../data/mockData';
import {
  createAppointmentAsync,
  createAppointment,
  isTherapistBooked,
  getTherapists,
  getServices
} from '../../services/storageService';

interface AppointmentBookingModalProps {
  initialService: Service | null;
  initialTherapist: Therapist | null;
  currentUser: UserType;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (appointment: any) => void;
  onOpenLogin: () => void;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  initialService,
  initialTherapist,
  currentUser,
  isOpen,
  onClose,
  onBookingSuccess,
  onOpenLogin
}) => {
  const allServices = getServices();
  const allTherapists = getTherapists().filter((t) => t.active);

  const [selectedService, setSelectedService] = useState<Service | null>(initialService || allServices[0]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(
    initialTherapist || allTherapists[0]
  );

  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [mobile, setMobile] = useState(currentUser.mobile || '');
  const [email, setEmail] = useState(currentUser.email || '');

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1]);
  const [specialRequest, setSpecialRequest] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'Pay at Spa' | 'Online Payment'>('Pay at Spa');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialService) setSelectedService(initialService);
  }, [initialService]);

  useEffect(() => {
    if (initialTherapist) setSelectedTherapist(initialTherapist);
  }, [initialTherapist]);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!mobile) setMobile(currentUser.mobile);
      if (!email && currentUser.email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!isOpen || !selectedService || !selectedTherapist) return null;

  // Quick date selector options (Today, Tomorrow, Day After)
  const dateOptions = [
    { label: 'Today', date: new Date().toISOString().split('T')[0] },
    {
      label: 'Tomorrow',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    },
    {
      label: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Please provide your full name');
      return;
    }
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setError('Please provide a valid 10-digit mobile number');
      return;
    }
    if (!agreedTerms) {
      setError('Please agree to the booking terms and cancellation policy');
      return;
    }

    // Availability validation check (Requirement #18)
    if (isTherapistBooked(selectedTherapist.id, selectedDate, selectedTimeSlot)) {
      setError(
        `Time slot ${selectedTimeSlot} on ${selectedDate} is already booked for ${selectedTherapist.name}. Please select an available slot.`
      );
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const newApt = await createAppointmentAsync({
        service: selectedService,
        therapist: selectedTherapist,
        customer_id: currentUser.id,
        customer_name: customerName.trim(),
        mobile: cleanMobile,
        email: email.trim() || undefined,
        date: selectedDate,
        time: selectedTimeSlot,
        notes: specialRequest.trim() || undefined,
        payment_method: paymentMethod
      });

      setIsSubmitting(false);
      onBookingSuccess(newApt);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'Failed to confirm appointment. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-stone-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold font-serif">
              RelaxCare Appointment Desk
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold mt-0.5">
              Confirm Your Wellness Session
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Pricing & Selection Summary Card */}
          <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Treatment & Therapist
              </span>
              <div className="font-serif text-base font-bold text-stone-900">
                {selectedService.name}
              </div>
              <div className="text-xs text-emerald-800 font-medium">
                with {selectedTherapist.name} ({selectedService.duration})
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-stone-400">Total Price</span>
              <div className="font-serif text-2xl font-black text-stone-900">
                ₹{selectedService.price}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Pay at Spa</span>
            </div>
          </div>

          {/* Service & Therapist Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Select Service
              </label>
              <select
                value={selectedService.id}
                onChange={(e) => {
                  const found = allServices.find((s) => s.id === e.target.value);
                  if (found) setSelectedService(found);
                }}
                className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 outline-none"
              >
                {allServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration} · ₹{s.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Select Therapist
              </label>
              <select
                value={selectedTherapist.id}
                onChange={(e) => {
                  const found = allTherapists.find((t) => t.id === e.target.value);
                  if (found) setSelectedTherapist(found);
                }}
                className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 outline-none"
              >
                {allTherapists.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (⭐ {t.rating} · {t.experience})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Choose Date
            </label>
            <div className="grid grid-cols-3 gap-2">
              {dateOptions.map((opt) => {
                const isSelected = selectedDate === opt.date;
                return (
                  <button
                    key={opt.date}
                    type="button"
                    onClick={() => setSelectedDate(opt.date)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-600'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] font-mono text-stone-400">{opt.date}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TIME SLOTS & AVAILABILITY SYSTEM (Requirement #18) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Select Time Slot (for {selectedTherapist.name})
              </label>
              <span className="text-[10px] text-stone-500 font-medium">
                Live availability check
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = isTherapistBooked(selectedTherapist.id, selectedDate, slot);
                const isSelected = selectedTimeSlot === slot && !isBooked;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => !isBooked && setSelectedTimeSlot(slot)}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                      isBooked
                        ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60 line-through'
                        : isSelected
                        ? 'border-emerald-800 bg-emerald-800 text-white shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer'
                    }`}
                  >
                    <span>{slot}</span>
                    {isBooked ? (
                      <span className="text-[9px] uppercase tracking-wider font-bold text-red-600 font-mono no-underline">
                        BOOKED
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-600 font-normal">Available</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-800" />
              <span>Contact & Guest Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Your Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-2.5 bg-stone-100 border border-r-0 border-stone-200 rounded-l-xl text-xs font-semibold text-stone-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-r-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address <span className="text-stone-400 font-normal">(Optional for calendar invite)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Special Request */}
          <div className="space-y-1.5 pt-2 border-t border-stone-200">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Special Request / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on lower back and shoulders. Prefer light pressure and lavender oil."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5 pt-2 border-t border-stone-200">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="p-3 bg-emerald-50/60 border border-emerald-300 rounded-xl flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Pay at Spa'}
                  onChange={() => setPaymentMethod('Pay at Spa')}
                  className="w-4 h-4 text-emerald-800"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900">Pay at Spa</div>
                  <div className="text-[10px] text-stone-500">Cash, UPI or Card at reception</div>
                </div>
              </label>

              <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl opacity-60 flex items-center gap-2 cursor-not-allowed">
                <input type="radio" disabled name="payment" className="w-4 h-4" />
                <div>
                  <div className="text-xs font-bold text-stone-500">Online Payment</div>
                  <div className="text-[10px] text-amber-700">Coming soon</div>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox (Requirement #9) */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-emerald-800 focus:ring-emerald-700"
              />
              <span>
                I agree to the booking terms, professional wellness policy, and cancellation policy.
              </span>
            </label>
          </div>
        </form>

        {/* Sticky Confirmation Bar */}
        <div className="p-4 border-t border-stone-200 bg-white shrink-0">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-bold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <CheckCircle className="w-5 h-5 text-amber-300" />
            <span>CONFIRM APPOINTMENT · ₹{selectedService.price}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
