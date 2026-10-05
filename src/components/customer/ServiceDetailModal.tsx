import React from 'react';
import {
  X,
  Star,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Calendar,
  Sparkles,
  Shield,
  Heart
} from 'lucide-react';
import { Service } from '../../types';
import { SpaArtwork } from '../common/SpaArtwork';
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_FORMATTED,
  getPhoneCallUrl,
  getWhatsAppUrl
} from '../../utils/whatsapp';

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: (service: Service) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onBookAppointment
}) => {
  if (!isOpen || !service) return null;

  const handleWhatsAppInquiry = () => {
    const msg = `Hello RelaxCare, I would like to inquire about the ${service.name} (${service.duration}, Starting ₹${service.price}). Please share therapist availability.`;
    window.open(getWhatsAppUrl(BUSINESS_PHONE, msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-stone-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-stone-900/50 hover:bg-stone-900/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Spa Artwork Banner */}
        <div className="shrink-0">
          <SpaArtwork slug={service.slug} name={service.name} duration={service.duration} compact={false} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Header & Pricing */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                {service.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-stone-800">{service.rating}</span>
                <span className="text-stone-400">({service.reviews_count} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2">{service.name}</h2>

            <div className="mt-4 flex items-baseline gap-2 pb-4 border-b border-stone-200/80">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                Starting Price:
              </span>
              <span className="text-3xl font-serif font-black text-stone-900">
                ₹{service.price}
              </span>
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {service.duration}
              </span>
            </div>
          </div>

          {/* Highlights & Duration */}
          <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200">
              <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>Duration: <strong>{service.duration}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Certified Spa Therapist</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Treatment Description
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-sans">{service.description}</p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Therapeutic Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-stone-200/70 text-xs text-stone-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              What's Included in Your Session
            </h3>
            <ul className="space-y-2">
              {service.includes.map((inc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div className="shrink-0 p-4 border-t border-stone-200/80 bg-white space-y-2">
          <button
            onClick={() => onBookAppointment(service)}
            className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>BOOK APPOINTMENT · ₹{service.price}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={getPhoneCallUrl(BUSINESS_PHONE)}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-800" />
              <span>Call Business</span>
            </a>
            <button
              onClick={handleWhatsAppInquiry}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700 fill-emerald-700" />
              <span>WhatsApp Business</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
