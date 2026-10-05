import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  Calendar,
  CheckCircle,
  User,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Therapist, Service } from '../../types';

interface TherapistListModalProps {
  service: Service | null;
  therapists: Therapist[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTherapist: (therapist: Therapist) => void;
}

export const TherapistListModal: React.FC<TherapistListModalProps> = ({
  service,
  therapists,
  isOpen,
  onClose,
  onSelectTherapist
}) => {
  const [selectedTherapistForProfile, setSelectedTherapistForProfile] = useState<Therapist | null>(
    null
  );

  if (!isOpen) return null;

  // Filter available and active therapists
  const availableTherapists = therapists.filter((t) => t.active && t.availability === 'Available');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-stone-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold font-serif">
              {service ? `For: ${service.name}` : 'RelaxCare Specialists'}
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold mt-0.5">
              Select Your Certified Therapist
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header Note */}
        <div className="p-3 bg-amber-50/80 border-b border-amber-200/70 text-xs text-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>All practitioners are licensed and verified in therapeutic bodywork.</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800">
            {availableTherapists.length} Available
          </span>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {availableTherapists.map((th) => (
            <div
              key={th.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs hover:border-emerald-700/60 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                {/* Photo with soft luxury border */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 border-2 border-amber-200/60 shrink-0">
                  <img
                    src={th.photo}
                    alt={th.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center bg-emerald-900 text-amber-200 font-serif text-xl font-bold">
                    {th.name.charAt(0)}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-stone-900 text-base">{th.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{th.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {th.experience} · <span className="text-emerald-800 font-semibold">{th.total_sessions}+ sessions</span>
                  </p>

                  <div className="mt-2 text-xs">
                    <span className="text-stone-400 font-medium">Specialization: </span>
                    <span className="text-stone-700 font-medium">
                      {th.specializations.join(', ')}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{th.available_time}</span>
                    <span className="text-stone-300">·</span>
                    <span>{th.available_days.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTherapistForProfile(th)}
                  className="text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  View Bio & Details
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTherapist(th);
                    onClose();
                  }}
                  className="py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select Therapist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Therapist Profile Dialog (Requirement #8) */}
      {selectedTherapistForProfile && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
          <div className="bg-stone-50 rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Therapist Profile
              </span>
              <button
                onClick={() => setSelectedTherapistForProfile(null)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 border-2 border-amber-200/80 shrink-0">
                <img
                  src={selectedTherapistForProfile.photo}
                  alt={selectedTherapistForProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  {selectedTherapistForProfile.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                  <span className="font-bold text-amber-600 flex items-center">
                    <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                    {selectedTherapistForProfile.rating}
                  </span>
                  <span>·</span>
                  <span>{selectedTherapistForProfile.experience}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Professional Bio
              </h5>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                {selectedTherapistForProfile.bio}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Specializations
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedTherapistForProfile.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-1 bg-white p-3 rounded-xl border border-stone-200">
              <div>
                <strong>Available Days:</strong> {selectedTherapistForProfile.available_days.join(', ')}
              </div>
              <div>
                <strong>Daily Hours:</strong> {selectedTherapistForProfile.available_time}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectTherapist(selectedTherapistForProfile);
                setSelectedTherapistForProfile(null);
                onClose();
              }}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-xs shadow-md"
            >
              Book Appointment with {selectedTherapistForProfile.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
