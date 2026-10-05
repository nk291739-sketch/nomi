import React from 'react';
import {
  Sparkles,
  Heart,
  Droplets,
  Wind,
  Flame,
  Sun,
  ShieldCheck,
  Feather,
  Flower2
} from 'lucide-react';

interface SpaArtworkProps {
  slug: string;
  name: string;
  duration?: string;
  compact?: boolean;
}

export const SpaArtwork: React.FC<SpaArtworkProps> = ({
  slug,
  name,
  duration,
  compact = false
}) => {
  const getTheme = () => {
    switch (slug) {
      case 'swedish-massage':
        return {
          bg: 'from-emerald-900 via-teal-900 to-stone-900',
          accent: 'text-amber-300',
          label: 'Classic European Relaxation',
          icon: <Flower2 className="w-5 h-5 text-amber-200" />
        };
      case 'deep-tissue-massage':
        return {
          bg: 'from-stone-900 via-emerald-950 to-stone-950',
          accent: 'text-amber-400',
          label: 'Targeted Muscle Release',
          icon: <Sparkles className="w-5 h-5 text-amber-300" />
        };
      case 'aromatherapy-massage':
        return {
          bg: 'from-teal-900 via-emerald-900 to-slate-900',
          accent: 'text-emerald-300',
          label: 'Organic Botanical Essences',
          icon: <Droplets className="w-5 h-5 text-emerald-200" />
        };
      case 'thai-massage':
        return {
          bg: 'from-amber-950 via-stone-900 to-emerald-950',
          accent: 'text-amber-200',
          label: 'Acupressure & Yoga Stretches',
          icon: <Feather className="w-5 h-5 text-amber-300" />
        };
      case 'head-shoulder-massage':
        return {
          bg: 'from-emerald-950 via-teal-950 to-stone-900',
          accent: 'text-teal-200',
          label: 'Cranial & Desk Fatigue Relief',
          icon: <Wind className="w-5 h-5 text-teal-300" />
        };
      case 'foot-massage':
        return {
          bg: 'from-stone-900 via-stone-800 to-emerald-950',
          accent: 'text-amber-300',
          label: 'Acupressure Reflexology',
          icon: <Heart className="w-5 h-5 text-amber-200" />
        };
      case 'body-spa':
        return {
          bg: 'from-emerald-900 via-stone-900 to-teal-950',
          accent: 'text-amber-300',
          label: 'Full Body Mineral Sanctuary',
          icon: <Sparkles className="w-5 h-5 text-amber-300" />
        };
      case 'steam-bath':
        return {
          bg: 'from-teal-900 via-cyan-950 to-stone-900',
          accent: 'text-cyan-200',
          label: 'Tasmanian Eucalyptus Mist',
          icon: <Droplets className="w-5 h-5 text-cyan-300" />
        };
      case 'aromatherapy-spa':
        return {
          bg: 'from-emerald-950 via-teal-900 to-stone-900',
          accent: 'text-emerald-200',
          label: 'Floral Bath Ritual',
          icon: <Flower2 className="w-5 h-5 text-emerald-300" />
        };
      case 'body-scrub':
        return {
          bg: 'from-stone-900 via-amber-950 to-stone-900',
          accent: 'text-amber-300',
          label: 'Himalayan Crystals & Coffee',
          icon: <Sparkles className="w-5 h-5 text-amber-200" />
        };
      default:
        return {
          bg: 'from-emerald-900 to-stone-900',
          accent: 'text-amber-300',
          label: 'Professional Wellness',
          icon: <Flower2 className="w-5 h-5 text-amber-300" />
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${theme.bg} text-white flex flex-col justify-between ${
        compact ? 'h-24 p-3.5' : 'h-40 sm:h-48 p-5'
      }`}
    >
      {/* Delicate decorative botanical pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`glow-${slug}`} cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#glow-${slug})`} />
          <circle cx="85%" cy="25%" r="70" stroke="#fef3c7" strokeWidth="0.5" fill="none" opacity="0.4" />
          <circle cx="85%" cy="25%" r="40" stroke="#fef3c7" strokeWidth="0.5" fill="none" opacity="0.3" />
        </svg>
      </div>

      {/* Top badges */}
      <div className="relative z-10 flex items-start justify-between">
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-amber-100/90 bg-black/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-300/20">
          {theme.label}
        </span>
        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/15">
          {theme.icon}
        </div>
      </div>

      {/* Bottom details */}
      <div className="relative z-10">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide leading-tight drop-shadow-xs">
          {name}
        </h3>
        {duration && (
          <div className="flex items-center gap-1.5 text-xs text-amber-100/80 mt-0.5 font-medium">
            <span>{duration} Session</span>
            <span className="text-amber-300/40">·</span>
            <span className="text-[11px] text-emerald-300">Certified Spa Therapist</span>
          </div>
        )}
      </div>
    </div>
  );
};
