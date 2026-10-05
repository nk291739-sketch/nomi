import React, { useEffect } from 'react';
import { Flower2, Sparkles, Droplets, Shield } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-950 text-white p-8 cursor-pointer select-none"
    >
      {/* Top subtle tap indicator */}
      <div className="w-full flex justify-end pt-2">
        <span className="text-[11px] text-amber-200/60 uppercase tracking-widest font-semibold">
          Tap to skip
        </span>
      </div>

      {/* Main Luxury Brand Identity */}
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 p-0.5 shadow-2xl shadow-emerald-950/60 transform transition-transform animate-pulse">
            <div className="w-full h-full rounded-[22px] bg-emerald-950 flex items-center justify-center border border-amber-200/30">
              <Flower2 className="w-12 h-12 text-amber-300 stroke-[1.8]" />
            </div>
          </div>
          <div className="absolute -inset-3 rounded-full bg-amber-400/10 blur-xl -z-10"></div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          RelaxCare
        </h1>
        <p className="text-amber-100/90 text-sm sm:text-base font-serif italic tracking-wide">
          “Relax. Refresh. Rejuvenate.”
        </p>

        {/* Professional Wellness Sub-badge */}
        <div className="mt-5 flex items-center gap-2 text-xs text-amber-200/80 bg-white/5 px-3.5 py-1.5 rounded-full border border-amber-300/20 backdrop-blur-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>Luxury Spa & Professional Bodywork</span>
        </div>
      </div>

      {/* Footer Assurance */}
      <div className="w-full max-w-xs flex flex-col items-center pb-6">
        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
          <div className="w-full h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-[11px] text-stone-400 text-center">
          Certified Therapists · Hygienic Private Sanctuaries · Organic Oils
        </p>
      </div>
    </div>
  );
};
