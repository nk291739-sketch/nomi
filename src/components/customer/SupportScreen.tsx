import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShieldCheck,
  Clock,
  Sparkles,
  Flower2
} from 'lucide-react';
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_FORMATTED,
  BUSINESS_EMAIL,
  getPhoneCallUrl,
  getGeneralSupportWhatsAppUrl
} from '../../utils/whatsapp';
import { FAQS } from '../../data/mockData';

export const SupportScreen: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 text-white shadow-md border border-amber-300/20">
        <div className="flex items-center gap-2 mb-2">
          <Flower2 className="w-4 h-4 text-amber-300" />
          <span className="text-[11px] uppercase tracking-widest text-amber-200 font-bold font-serif">
            RelaxCare Concierge & Support
          </span>
        </div>
        <h1 className="font-serif text-2xl font-bold">How may we assist you?</h1>
        <p className="text-amber-100/80 text-xs mt-1 max-w-md font-sans leading-relaxed">
          “Relax. Refresh. Rejuvenate.” Our spa reception team is available 7 days a week from 9:00 AM to 9:00 PM for booking inquiries, customized packages, and therapist availability.
        </p>

        {/* Quick Contact Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={getGeneralSupportWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="p-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-700" />
            <span>Chat on WhatsApp ({BUSINESS_PHONE_FORMATTED})</span>
          </a>

          <a
            href={getPhoneCallUrl(BUSINESS_PHONE)}
            className="p-3.5 bg-amber-50 hover:bg-amber-100 text-stone-900 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors border border-amber-200"
          >
            <Phone className="w-4 h-4 text-emerald-800" />
            <span>Call Concierge: {BUSINESS_PHONE_FORMATTED}</span>
          </a>
        </div>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900">Spa Front Desk</h3>
            <p className="text-[11px] text-stone-500 mt-0.5">9:00 AM – 9:00 PM, All Days</p>
            <a
              href={getPhoneCallUrl(BUSINESS_PHONE)}
              className="text-xs font-mono font-bold text-emerald-800 hover:underline block mt-1"
            >
              +91 {BUSINESS_PHONE}
            </a>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
            <MessageCircle className="w-5 h-5 fill-emerald-700 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900">WhatsApp Dispatch</h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Instant booking confirmations</p>
            <a
              href={getGeneralSupportWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono font-bold text-emerald-700 hover:underline block mt-1"
            >
              +91 {BUSINESS_PHONE}
            </a>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900">Concierge Email</h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Corporate & membership inquiries</p>
            <a
              href={`mailto:${BUSINESS_EMAIL}`}
              className="text-xs font-mono font-semibold text-stone-700 hover:underline block mt-1 truncate"
            >
              {BUSINESS_EMAIL}
            </a>
          </div>
        </div>
      </div>

      {/* Spa Sanctuary Guarantees */}
      <div className="p-4 bg-stone-100/70 border border-stone-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-stone-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          <span className="font-semibold">Certified Wellness Professionals</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="font-semibold">Hygienic Sanitized Private Suites</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-500" />
          <span className="font-semibold">Punctual Reserved Sessions</span>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <HelpCircle className="w-5 h-5 text-emerald-800" />
          <h2 className="font-serif text-base font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200/70 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 bg-stone-50/60 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-stone-800 font-serif">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-3.5 bg-white text-xs text-stone-600 leading-relaxed border-t border-stone-100 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
