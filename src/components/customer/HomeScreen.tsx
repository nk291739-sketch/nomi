import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Clock,
  Sparkles,
  Flower2,
  ChevronRight,
  ShieldCheck,
  Heart,
  Droplets,
  MessageCircle,
  Phone,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Service, Therapist, User } from '../../types';
import { SpaArtwork } from '../common/SpaArtwork';
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_FORMATTED,
  getGeneralSupportWhatsAppUrl
} from '../../utils/whatsapp';

interface HomeScreenProps {
  currentUser: User;
  services: Service[];
  therapists: Therapist[];
  onSelectService: (service: Service) => void;
  onBookDirect: (service: Service) => void;
  onSelectTherapist: (therapist: Therapist) => void;
  onOpenAllTherapists: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  services,
  therapists,
  onSelectService,
  onBookDirect,
  onSelectTherapist,
  onOpenAllTherapists
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Massage Services' | 'Spa & Wellness'>('All');

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchSearch =
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.benefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = activeCategory === 'All' || srv.category === activeCategory;
      return matchSearch && matchCategory && srv.active;
    });
  }, [services, searchQuery, activeCategory]);

  // Featured / Popular Treatments (Requirement #5)
  const popularServices = services.filter((s) => s.featured && s.active);

  // Available therapists for quick spotlight
  const availableTherapists = therapists.filter((t) => t.active && t.availability === 'Available');

  return (
    <div className="space-y-6 pb-20">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-amber-300/20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-serif text-amber-200">
            <Flower2 className="w-3.5 h-3.5 text-amber-300" />
            <span>RelaxCare Wellness Sanctuary</span>
          </div>

          <a
            href={getGeneralSupportWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs py-1.5 px-3 rounded-full border border-emerald-500/30 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">WhatsApp:</span>
            <span>7505741030</span>
          </a>
        </div>

        {/* Header Greeting & Question (Requirement #4) */}
        <div className="relative z-10 mt-5">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Hello, {currentUser.name ? currentUser.name.split(' ')[0] : 'Guest'} 👋
          </h1>
          <p className="text-amber-100/90 text-sm sm:text-base font-serif italic mt-1">
            What treatment are you looking for today?
          </p>
          <div className="text-xs text-stone-300/90 font-medium mt-0.5">
            “Relax. Refresh. Rejuvenate.”
          </div>
        </div>

        {/* Search Bar (Requirement #4) */}
        <div className="relative z-10 mt-5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search massage or wellness service (Swedish, Deep Tissue, Scrub)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white text-stone-900 rounded-2xl text-xs sm:text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-stone-400 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Sanctuary Guarantees */}
      <div className="grid grid-cols-3 gap-2 px-1">
        <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs text-center flex flex-col items-center">
          <ShieldCheck className="w-5 h-5 text-emerald-800 mb-1" />
          <span className="text-[11px] font-bold text-stone-900 font-serif">Certified Pros</span>
          <span className="text-[9px] text-stone-500">Licensed therapists</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs text-center flex flex-col items-center">
          <Droplets className="w-5 h-5 text-teal-700 mb-1" />
          <span className="text-[11px] font-bold text-stone-900 font-serif">Organic Oils</span>
          <span className="text-[9px] text-stone-500">100% cold-pressed</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs text-center flex flex-col items-center">
          <Sparkles className="w-5 h-5 text-amber-600 mb-1" />
          <span className="text-[11px] font-bold text-stone-900 font-serif">Private Suite</span>
          <span className="text-[9px] text-stone-500">Serene atmosphere</span>
        </div>
      </div>

      {/* FEATURED / POPULAR TREATMENTS (Requirement #5) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Popular Treatments</h2>
            <p className="text-xs text-stone-500">Guest favorites for deep muscle release & tranquility</p>
          </div>
          <span className="text-xs font-serif font-bold text-emerald-800">
            Top Rated ⭐
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {popularServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md hover:border-emerald-700/50 transition-all flex flex-col overflow-hidden cursor-pointer"
            >
              <div className="shrink-0">
                <SpaArtwork slug={service.slug} name={service.name} duration={service.duration} compact={true} />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-1">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                      <span>{service.rating}</span>
                    </div>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500 font-mono">({service.reviews_count} reviews)</span>
                  </div>

                  <h3 className="font-serif font-bold text-stone-900 text-sm group-hover:text-emerald-900 transition-colors line-clamp-1">
                    {service.name}
                  </h3>

                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                        Starting Price
                      </span>
                      <span className="font-serif text-base font-black text-stone-900">
                        ₹{service.price}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {service.duration}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 group-hover:underline font-serif">
                    Book Now
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THERAPIST SPOTLIGHT (Requirement #7 & #8) */}
      <div className="bg-stone-100/80 rounded-3xl p-5 border border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider font-serif">
              Licensed Practitioners
            </span>
            <h2 className="font-serif text-lg font-bold text-stone-900">Certified Spa Therapists</h2>
          </div>
          <button
            onClick={onOpenAllTherapists}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer font-serif"
          >
            <span>View All ({availableTherapists.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {availableTherapists.slice(0, 3).map((th) => (
            <div
              key={th.id}
              onClick={() => onSelectTherapist(th)}
              className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-700/60 transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-stone-100 border border-amber-200 shrink-0">
                <img src={th.photo} alt={th.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm truncate">
                  {th.name}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                  <span className="flex items-center text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                    {th.rating}
                  </span>
                  <span>·</span>
                  <span className="truncate">{th.experience}</span>
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                  {th.specializations[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL SERVICES CATEGORY SECTION (Requirement #4) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Spa & Massage Menu</h2>
            <p className="text-xs text-stone-500">Select any treatment for appointment reservation</p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl text-xs font-semibold">
            {(['All', 'Massage Services', 'Spa & Wellness'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all p-4.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{service.rating}</span>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-base mt-1">
                  {service.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xs text-stone-400">Starting from</span>
                  <span className="font-serif text-lg font-black text-stone-900">₹{service.price}</span>
                  <span className="text-xs text-stone-500">· {service.duration}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectService(service)}
                  className="py-2 px-3 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  View Details & Benefits
                </button>

                <button
                  type="button"
                  onClick={() => onBookDirect(service)}
                  className="py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
