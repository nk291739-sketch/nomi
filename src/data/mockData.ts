import { Service, Therapist } from '../types';

export const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM'
];

export const INITIAL_SERVICES: Service[] = [
  // Massage Services
  {
    id: 'srv-swedish',
    slug: 'swedish-massage',
    name: 'Swedish Massage',
    category: 'Massage Services',
    duration: '60 Minutes',
    price: 999,
    rating: 4.9,
    reviews_count: 348,
    active: true,
    featured: true,
    theme_gradient: 'from-emerald-800 to-teal-900',
    accent_color: 'emerald',
    description:
      'A classic European relaxing professional massage designed to help reduce everyday muscle tension and promote gentle full-body relaxation.',
    benefits: [
      'Deep relaxation & stress relief',
      'Gentle muscle comfort & tension release',
      'Improved blood circulation & lymphatic flow',
      'Restored overall sense of calm & wellbeing'
    ],
    includes: [
      'Consultation & aromatic oil selection',
      'Long flowing rhythmic effleurage strokes',
      'Gentle kneading & light circular friction',
      'Warm herbal towel compress'
    ]
  },
  {
    id: 'srv-deep-tissue',
    slug: 'deep-tissue-massage',
    name: 'Deep Tissue Massage',
    category: 'Massage Services',
    duration: '60 Minutes',
    price: 1199,
    rating: 4.9,
    reviews_count: 420,
    active: true,
    featured: true,
    theme_gradient: 'from-stone-800 to-emerald-950',
    accent_color: 'amber',
    description:
      'Specialized therapeutic bodywork targeting the inner layers of muscles and connective tissues to alleviate stubborn tightness and chronic stiffness.',
    benefits: [
      'Breaks down stubborn muscle knots and adhesions',
      'Relieves lower back, neck and shoulder tightness',
      'Rehabilitates athletic stiffness and fatigue',
      'Improves postural alignment & flexibility'
    ],
    includes: [
      'Postural assessment & pressure calibration',
      'Deep targeted myofascial release strokes',
      'Herbal pain-relief balm application',
      'Stretching & post-session mobility advice'
    ]
  },
  {
    id: 'srv-aromatherapy-massage',
    slug: 'aromatherapy-massage',
    name: 'Aromatherapy Massage',
    category: 'Massage Services',
    duration: '60 Minutes',
    price: 1299,
    rating: 4.9,
    reviews_count: 295,
    active: true,
    featured: true,
    theme_gradient: 'from-teal-800 to-emerald-900',
    accent_color: 'teal',
    description:
      'Harmonious therapeutic massage combining gentle lymph drainage strokes with pure organic botanical essential oils tailored to your mood.',
    benefits: [
      'Alleviates anxiety, nervous tension & insomnia',
      'Nourishes and hydrates dry skin deeply',
      'Enhances mental clarity & emotional balance',
      'Stimulates sensory rejuvenation'
    ],
    includes: [
      'Inhalation therapy with custom essential oils',
      'Lavender, Chamomile or Lemongrass organic blends',
      'Gentle pressure lymphatic drainage technique',
      'Calming herbal tea post-treatment'
    ]
  },
  {
    id: 'srv-thai',
    slug: 'thai-massage',
    name: 'Thai Massage',
    category: 'Massage Services',
    duration: '75 Minutes',
    price: 1399,
    rating: 4.8,
    reviews_count: 210,
    active: true,
    featured: false,
    theme_gradient: 'from-amber-900 to-stone-900',
    accent_color: 'amber',
    description:
      'Ancient holistic healing system incorporating rhythmic acupressure, gentle body rocking, and assisted yoga-like deep body stretches.',
    benefits: [
      'Dramatically enhances joint mobility & flexibility',
      'Re-energizes sluggish meridian energy lines',
      'Relieves back tension without greasy oils',
      'Revitalizes physical endurance and posture'
    ],
    includes: [
      'Comfortable traditional loose cotton attire provided',
      'Thumb, palm and forearm pressure along Sen lines',
      'Assisted restorative stretching',
      'Warm herbal compress application'
    ]
  },
  {
    id: 'srv-head-shoulder',
    slug: 'head-shoulder-massage',
    name: 'Head & Shoulder Massage',
    category: 'Massage Services',
    duration: '45 Minutes',
    price: 699,
    rating: 4.8,
    reviews_count: 180,
    active: true,
    featured: false,
    theme_gradient: 'from-emerald-900 to-teal-950',
    accent_color: 'emerald',
    description:
      'Targeted upper-body session focusing on the scalp, neck, cervical spine, and trapezius muscles where mental stress accumulates.',
    benefits: [
      'Instant relief from desk fatigue & tension headaches',
      'Promotes deep restful sleep & cranial ease',
      'Stimulates scalp micro-circulation',
      'Quick rejuvenation during a busy workday'
    ],
    includes: [
      'Seated or reclined ergonomic support',
      'Acupressure at cranial and neck trigger points',
      'Optional cooling Brahmi or Almond oil',
      'Gentle shoulder and neck traction'
    ]
  },
  {
    id: 'srv-foot-massage',
    slug: 'foot-massage',
    name: 'Foot Massage & Reflexology',
    category: 'Massage Services',
    duration: '45 Minutes',
    price: 649,
    rating: 4.8,
    reviews_count: 165,
    active: true,
    featured: false,
    theme_gradient: 'from-stone-800 to-stone-900',
    accent_color: 'amber',
    description:
      'Deep soothing foot reflexology targeting neural reflex points on the soles and calves that correspond to internal vitality.',
    benefits: [
      'Relieves swollen ankles, tired arches & heavy legs',
      'Stimulates systemic lymphatic detoxification',
      'Induces profound whole-body tranquility',
      'Improves plantar fascia comfort'
    ],
    includes: [
      'Warm floral foot soak with Epsom sea salts',
      'Bamboo stick & thumb reflex pressure on sole points',
      'Cooling peppermint cream application',
      'Lower calf soothing massage'
    ]
  },

  // Spa & Wellness
  {
    id: 'srv-body-spa',
    slug: 'body-spa',
    name: 'Body Spa & Polish',
    category: 'Spa & Wellness',
    duration: '90 Minutes',
    price: 1999,
    rating: 4.9,
    reviews_count: 310,
    active: true,
    featured: true,
    theme_gradient: 'from-emerald-800 to-stone-900',
    accent_color: 'emerald',
    description:
      'An opulent full-body rejuvenation ritual featuring a gentle skin polish, rich mineral wrap, and relaxing oil application.',
    benefits: [
      'Exfoliates dead surface cells for glowing radiant skin',
      'Infuses deep cellular hydration & antioxidants',
      'Flushes out accumulated toxins',
      'Ultimate sanctuary luxury experience'
    ],
    includes: [
      'Full body organic walnut and sea salt scrub',
      'Warm volcanic thermal clay wrap',
      'Private rinse in monsoon shower',
      'Silky shea butter nourishing massage'
    ]
  },
  {
    id: 'srv-steam-bath',
    slug: 'steam-bath',
    name: 'Eucalyptus Steam Bath',
    category: 'Spa & Wellness',
    duration: '45 Minutes',
    price: 599,
    rating: 4.7,
    reviews_count: 140,
    active: true,
    featured: false,
    theme_gradient: 'from-teal-800 to-cyan-950',
    accent_color: 'teal',
    description:
      'Therapeutic mist chamber infused with pure Tasmanian eucalyptus essential oil to open pores, loosen tight chest airways, and melt muscular fatigue.',
    benefits: [
      'Clears respiratory pathways & nasal congestion',
      'Deep sweat pore detoxification',
      'Relaxes joints & soothes muscular soreness',
      'Enhances the benefits of preceding massages'
    ],
    includes: [
      'Private cedarwood steam room access',
      'Continuous botanical eucalyptus mist infusion',
      'Chilled mint towels and ice water hydration',
      'Fresh luxury bathrobe and towels'
    ]
  },
  {
    id: 'srv-aromatherapy-spa',
    slug: 'aromatherapy-spa',
    name: 'Botanical Aromatherapy Ritual',
    category: 'Spa & Wellness',
    duration: '60 Minutes',
    price: 1299,
    rating: 4.9,
    reviews_count: 220,
    active: true,
    featured: false,
    theme_gradient: 'from-emerald-900 to-teal-800',
    accent_color: 'emerald',
    description:
      'Holistic sensory bath and steam wellness package with natural flower extracts and cold-pressed botanical essences.',
    benefits: [
      'Calms sensory overstimulation',
      'Promotes cellular rejuvenation and softness',
      'Deep state of meditative stillness',
      'Alleviates seasonal body fatigue'
    ],
    includes: [
      'Aromatic rose & jasmine steam session',
      'Hydrating botanical misting',
      'Light soothing pressure massage',
      'Herbal infusion beverage'
    ]
  },
  {
    id: 'srv-body-scrub',
    slug: 'body-scrub',
    name: 'Exfoliating Body Scrub',
    category: 'Spa & Wellness',
    duration: '60 Minutes',
    price: 1499,
    rating: 4.8,
    reviews_count: 188,
    active: true,
    featured: false,
    theme_gradient: 'from-amber-800 to-stone-900',
    accent_color: 'amber',
    description:
      'Intensive skin resurfacing treatment using fine coffee beans, Himalayan pink crystals, and jojoba oils to restore silky softness.',
    benefits: [
      'Removes stubborn tan, roughness and dead epidermis',
      'Restores velvety skin texture and natural glow',
      'Firms and tones loose dermal tissue',
      'Optimizes absorption of moisturizers'
    ],
    includes: [
      'Dry body brushing to stimulate circulation',
      'Coffee or Apricot fine crystal scrub polish',
      'Monsoon shower rinse with gentle wash',
      'Velvet finishing lotion application'
    ]
  }
];

export const INITIAL_THERAPISTS: Therapist[] = [
  {
    id: 'th-nomi',
    name: 'Nomi',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    experience: '6 Years Experience',
    rating: 5.0,
    total_sessions: 850,
    specializations: [
      'Swedish Massage',
      'Deep Tissue Massage',
      'Aromatherapy Massage',
      'Thai Massage',
      'Head & Shoulder Massage',
      'Foot Reflexology Massage',
      'Luxury Body Spa'
    ],
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    available_time: '9:00 AM – 9:00 PM',
    availability: 'Available',
    active: true,
    bio: 'Certified wellness & master spa practitioner. Renowned for intuitive restorative touch, stress relief techniques, and personalized calming aromatherapy rituals.'
  }
];

export const FAQS = [
  {
    q: 'What should I expect during my first massage session at RelaxCare?',
    a: 'Upon arrival, your certified therapist will conduct a brief consultation to understand your focus areas and pressure preferences. You will be escorted to a private, temperature-controlled sanctuary with calming ambient soundscapes.'
  },
  {
    q: 'How does double-booking prevention work on RelaxCare?',
    a: 'Our smart availability engine automatically locks out any time slot that has already been booked for your chosen therapist. You will always receive guaranteed one-on-one dedicated time.'
  },
  {
    q: 'What is your cancellation and rescheduling policy?',
    a: 'You can reschedule or cancel your appointment free of charge up to 2 hours before the scheduled time slot via the My Appointments tab or via WhatsApp.'
  },
  {
    q: 'What oils and products are used?',
    a: 'We use 100% cold-pressed organic carrier oils (Sweet Almond, Jojoba, Grapeseed) scented with pure therapeutic-grade essential oils (French Lavender, Peppermint, Lemongrass).'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'For your convenience, we support "Pay at Spa" after your session is completed in cash, UPI, or card at the front desk.'
  }
];
