import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// CORS & security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Database file setup
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'relaxcare_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const INITIAL_SERVICES = [
  {
    id: 'srv-swedish',
    name: 'Swedish Massage',
    slug: 'swedish-massage',
    description: 'Classic European full-body therapy utilizing long flowing strokes, kneading, and gentle friction to melt tension and boost circulation.',
    category: 'Massage Services',
    duration: '60 Minutes',
    price: 999,
    benefits: ['Relieves muscular stiffness', 'Improves blood circulation', 'Deep mental relaxation', 'Boosts sleep quality'],
    includes: ['Full body therapy (60m)', 'Warm organic sesame oil', 'Aromatic hot towel finish', 'Choice of lavender essence'],
    rating: 4.9,
    reviews_count: 248,
    active: true,
    theme_gradient: 'from-emerald-950 via-emerald-900 to-teal-900',
    accent_color: '#065f46',
    featured: true
  },
  {
    id: 'srv-deep-tissue',
    name: 'Deep Tissue Massage',
    slug: 'deep-tissue-massage',
    description: 'Targeted deep-layer myofascial therapy focusing on chronic muscle knots, postural fatigue, and tension release.',
    category: 'Massage Services',
    duration: '60 Minutes',
    price: 1199,
    benefits: ['Releases chronic muscle knots', 'Restores joint mobility', 'Reduces postural inflammation', 'Ideal for athletes & desk strain'],
    includes: ['Focused pressure on knots', 'Therapeutic eucalyptus balm', 'Heated basalt stone warmup', 'Acupressure points'],
    rating: 4.9,
    reviews_count: 312,
    active: true,
    theme_gradient: 'from-stone-900 via-emerald-950 to-stone-950',
    accent_color: '#047857',
    featured: true
  },
  {
    id: 'srv-aromatherapy',
    name: 'Aromatherapy Massage',
    slug: 'aromatherapy-massage',
    description: 'Sensory holistic massage combining gentle rhythmic touch with pure therapeutic grade botanicals and essential oils.',
    category: 'Massage Services',
    duration: '60 Minutes',
    price: 1299,
    benefits: ['Calms nervous system', 'Balances emotional state', 'Skin hydration & glow', 'Alleviates anxiety & headache'],
    includes: ['Custom scent profiling', 'Pure French lavender & rose oils', 'Sinus & scalp tension relief', 'Aromatherapeutic inhalation'],
    rating: 5.0,
    reviews_count: 189,
    active: true,
    theme_gradient: 'from-amber-950 via-emerald-950 to-stone-900',
    accent_color: '#b45309',
    featured: true
  },
  {
    id: 'srv-thai',
    name: 'Thai Massage',
    slug: 'thai-massage',
    description: 'Ancient passive stretching and assisted yoga movements on traditional tatami mats to unlock energy meridians.',
    category: 'Massage Services',
    duration: '75 Minutes',
    price: 1399,
    benefits: ['Full-body flexibility', 'Energy alignment', 'Relieves lower back compression', 'Enhanced joint mobility'],
    includes: ['Traditional cotton massage attire', 'Assisted yoga stretching', 'Energy line acupressure', 'Herbal compress warm-up'],
    rating: 4.8,
    reviews_count: 142,
    active: true,
    theme_gradient: 'from-teal-950 via-emerald-900 to-stone-900',
    accent_color: '#0f766e',
    featured: false
  },
  {
    id: 'srv-head-shoulder',
    name: 'Head & Shoulder Massage',
    slug: 'head-shoulder-massage',
    description: 'Targeted express therapy addressing the upper traps, neck, scalp, and temple tension caused by screen fatigue.',
    category: 'Massage Services',
    duration: '45 Minutes',
    price: 699,
    benefits: ['Instant relief from screen fatigue', 'Eases cervical tension', 'Stimulates scalp circulation', 'Calms headaches'],
    includes: ['Upper back & trap trigger points', 'Warm Brahmi scalp infusion', 'Temples acupressure', 'Cooling peppermint compress'],
    rating: 4.9,
    reviews_count: 220,
    active: true,
    theme_gradient: 'from-emerald-900 via-stone-900 to-teal-950',
    accent_color: '#065f46',
    featured: false
  },
  {
    id: 'srv-foot',
    name: 'Foot Reflexology Massage',
    slug: 'foot-reflexology',
    description: 'Holistic foot acupressure mapping reflex points corresponding to vital organs for whole-body vitality.',
    category: 'Massage Services',
    duration: '45 Minutes',
    price: 699,
    benefits: ['Improves plantar circulation', 'Relieves leg heaviness', 'Promotes sound sleep', 'Relaxes autonomic nerves'],
    includes: ['Himalayan pink salt soak', 'Foot scrub & exfoliation', 'Reflex zone acupressure', 'Peppermint cooling balm'],
    rating: 4.8,
    reviews_count: 175,
    active: true,
    theme_gradient: 'from-stone-900 via-emerald-950 to-stone-900',
    accent_color: '#047857',
    featured: false
  },
  {
    id: 'srv-body-spa',
    name: 'Luxury Body Spa',
    slug: 'body-spa',
    description: 'Ultra-luxurious head-to-toe ritual comprising dry brushing, warm shea butter wrap, and full-body relaxation massage.',
    category: 'Spa & Wellness',
    duration: '90 Minutes',
    price: 1899,
    benefits: ['Deep epidermal nourishment', 'Detoxifies skin layers', 'Total nervous system calm', 'Velvety skin texture'],
    includes: ['Silk body buffing', 'Warm shea butter envelope', '60m relaxing body massage', 'Herbal green tea elixir'],
    rating: 5.0,
    reviews_count: 160,
    active: true,
    theme_gradient: 'from-amber-950 via-stone-900 to-emerald-950',
    accent_color: '#b45309',
    featured: true
  },
  {
    id: 'srv-steam-bath',
    name: 'Herbal Steam Bath & Hydrotherapy',
    slug: 'steam-bath',
    description: 'Private pine cedar steam room infused with organic eucalyptus and lemongrass herbs to open pores and flush toxins.',
    category: 'Spa & Wellness',
    duration: '45 Minutes',
    price: 799,
    benefits: ['Flushes deep tissue toxins', 'Clears respiratory passages', 'Primes muscles before massage', 'Invigorates skin pores'],
    includes: ['Private cedar steam chamber', 'Eucalyptus & lemongrass infusion', 'Chilled lemon facial towel', 'Hydrating rose water spritz'],
    rating: 4.8,
    reviews_count: 110,
    active: true,
    theme_gradient: 'from-teal-950 via-emerald-950 to-stone-900',
    accent_color: '#0f766e',
    featured: false
  },
  {
    id: 'srv-aromatherapy-spa',
    name: 'Botanical Aromatherapy Ritual',
    slug: 'botanical-aromatherapy-spa',
    description: 'Multi-sensory hydro-aroma immersion with pure botanical bath extracts, sonic sound bowls, and oil massage.',
    category: 'Spa & Wellness',
    duration: '75 Minutes',
    price: 1599,
    benefits: ['Releases accumulated emotional stress', 'Deep skin hydration', 'Balances sleep rhythms', 'Soothing meditative trance'],
    includes: ['Warm essential oil body rub', 'Sound bowl vibration warmup', 'Scalp chamomile therapy', 'Warm herbal towel pack'],
    rating: 4.9,
    reviews_count: 95,
    active: true,
    theme_gradient: 'from-emerald-950 via-amber-950 to-stone-950',
    accent_color: '#065f46',
    featured: false
  },
  {
    id: 'srv-body-scrub',
    name: 'Coffee & Gold Body Scrub',
    slug: 'body-scrub',
    description: 'Gentle full-body exfoliation utilizing freshly roasted Arabica coffee grounds, walnut micro-pearls, and 24k gold essence.',
    category: 'Spa & Wellness',
    duration: '60 Minutes',
    price: 1399,
    benefits: ['Removes dead epithelial cells', 'Reduces cellulite appearance', 'Stimulates lymphatic drainage', 'Leaves radiant golden glow'],
    includes: ['Organic coffee & gold polish', 'Vichy shower rinse', 'Hydrating golden shea lotion', 'Gentle effleurage massage'],
    rating: 4.9,
    reviews_count: 130,
    active: true,
    theme_gradient: 'from-stone-900 via-stone-800 to-amber-950',
    accent_color: '#b45309',
    featured: false
  }
];

const INITIAL_THERAPISTS = [
  {
    id: 'th-nomi',
    name: 'Nomi',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    experience: '6 Years Experience',
    specializations: [
      'Swedish Massage',
      'Deep Tissue Massage',
      'Aromatherapy Massage',
      'Thai Massage',
      'Head & Shoulder Massage',
      'Foot Reflexology Massage',
      'Luxury Body Spa'
    ],
    rating: 5.0,
    total_sessions: 850,
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    available_time: '9:00 AM – 9:00 PM',
    availability: 'Available',
    active: true,
    bio: 'Certified wellness & master spa practitioner. Renowned for intuitive restorative touch, stress relief techniques, and personalized calming aromatherapy rituals.'
  }
];

interface DatabaseSchema {
  services: any[];
  therapists: any[];
  appointments: any[];
  reviews: any[];
  notifications: any[];
  lastBookingSequence: number;
}

function getInitialDb(): DatabaseSchema {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const initialAppointments = [
    {
      id: 'apt-10001',
      booking_id: 'RC-10001',
      customer_id: 'usr-customer-1',
      customer_name: 'Pooja Kapoor',
      mobile: '9876543210',
      email: 'pooja.kapoor@example.com',
      service_id: 'srv-swedish',
      service_name: 'Swedish Massage',
      therapist_id: 'th-nomi',
      therapist_name: 'Nomi',
      date: todayStr,
      time: '6:00 PM',
      duration: '60 Minutes',
      price: 999,
      notes: 'Focus on shoulder and upper neck relaxation',
      payment_method: 'Pay at Spa',
      payment_status: 'Pending',
      appointment_status: 'PENDING CONFIRMATION',
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'apt-10002',
      booking_id: 'RC-10002',
      customer_id: 'usr-customer-2',
      customer_name: 'Aditya Singhal',
      mobile: '9811223344',
      email: 'aditya.singhal@example.com',
      service_id: 'srv-deep-tissue',
      service_name: 'Deep Tissue Massage',
      therapist_id: 'th-nomi',
      therapist_name: 'Nomi',
      date: tomorrowStr,
      time: '2:00 PM',
      duration: '60 Minutes',
      price: 1199,
      notes: 'Lower back stiffness after gym workout',
      payment_method: 'Pay at Spa',
      payment_status: 'Pending',
      appointment_status: 'CONFIRMED',
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  return {
    services: INITIAL_SERVICES,
    therapists: INITIAL_THERAPISTS,
    appointments: initialAppointments,
    reviews: [],
    notifications: [
      {
        id: 'notif-1',
        user_id: 'usr-customer-1',
        title: 'Appointment Request Received',
        message: 'Your appointment request has been received. Booking ID: RC-10001. Your appointment will be confirmed by our team.',
        read: false,
        created_at: new Date(Date.now() - 1800000).toISOString(),
        appointment_id: 'RC-10001'
      }
    ],
    lastBookingSequence: 10002
  };
}

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const init = getInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), 'utf-8');
      return init;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Error reading database file, resetting to initial:', err);
    const init = getInitialDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), 'utf-8');
    return init;
  }
}

function writeDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

// Server-Sent Events (SSE) for Real-Time Updates
const sseClients: express.Response[] = [];

function broadcast(type: string, payload: any) {
  const message = `data: ${JSON.stringify({ type, payload, timestamp: Date.now() })}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    const client = sseClients[i];
    try {
      client.write(message);
    } catch {
      sseClients.splice(i, 1);
    }
  }
}

// SSE endpoint
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);
  sseClients.push(res);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// Heartbeat for SSE
setInterval(() => {
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(': ping\n\n');
    } catch {
      sseClients.splice(i, 1);
    }
  }
}, 25000);

// =================== API ROUTES ===================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET Dashboard Stats
app.get('/api/stats', (req, res) => {
  const db = readDb();
  const appointments = db.appointments || [];
  const todayStr = new Date().toISOString().split('T')[0];

  const pendingConfirmation = appointments.filter(
    (a) => a.appointment_status === 'PENDING CONFIRMATION' || a.appointment_status === 'Appointment Requested'
  ).length;

  const confirmed = appointments.filter(
    (a) => a.appointment_status === 'CONFIRMED' || a.appointment_status === 'Appointment Confirmed'
  ).length;

  const completed = appointments.filter(
    (a) => a.appointment_status === 'COMPLETED' || a.appointment_status === 'Completed'
  ).length;

  const cancelled = appointments.filter(
    (a) => a.appointment_status === 'CANCELLED' || a.appointment_status === 'Cancelled'
  ).length;

  const todaysAppointments = appointments.filter((a) => a.date === todayStr).length;

  const totalRevenue = appointments.reduce((sum, a) => {
    if (a.appointment_status !== 'CANCELLED' && a.appointment_status !== 'Cancelled') {
      return sum + (Number(a.price) || 0);
    }
    return sum;
  }, 0);

  res.json({
    newEnquiries: pendingConfirmation,
    pendingConfirmation,
    todaysAppointments,
    confirmed,
    completed,
    cancelled,
    totalRevenue,
    totalAppointments: appointments.length
  });
});

// GET Appointments
app.get('/api/appointments', (req, res) => {
  const db = readDb();
  res.json(db.appointments || []);
});

// GET Single Appointment
app.get('/api/appointments/:id', (req, res) => {
  const db = readDb();
  const apt = db.appointments.find((a) => a.id === req.params.id || a.booking_id === req.params.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });
  res.json(apt);
});

// POST Create Appointment (REAL BOOKING)
app.post('/api/appointments', (req, res) => {
  try {
    const {
      customer_name,
      mobile,
      email,
      service,
      therapist,
      date,
      time,
      duration,
      price,
      notes,
      payment_method,
      customer_id
    } = req.body;

    if (!customer_name || !mobile || !service || !therapist || !date || !time) {
      return res.status(400).json({ error: 'Missing required appointment fields' });
    }

    const db = readDb();

    // Check therapist double booking
    const isBooked = (db.appointments || []).some(
      (a) =>
        (a.therapist_id === (therapist.id || therapist) || a.therapist_name === (therapist.name || therapist)) &&
        a.date === date &&
        a.time === time &&
        a.appointment_status !== 'CANCELLED' &&
        a.appointment_status !== 'Cancelled'
    );

    if (isBooked) {
      return res.status(409).json({
        error: `Time slot ${time} on ${date} is already booked for this therapist. Please select another slot.`
      });
    }

    // Generate unique sequential Booking ID: RC-10001, RC-10002, etc.
    let seq = (db.lastBookingSequence || 10000) + 1;
    let candidateId = `RC-${seq}`;

    // ensure absolute uniqueness
    while (db.appointments.some((a) => a.booking_id === candidateId)) {
      seq += 1;
      candidateId = `RC-${seq}`;
    }

    db.lastBookingSequence = seq;

    const newAppointment = {
      id: `apt-${Date.now()}`,
      booking_id: candidateId,
      customer_id: customer_id || `usr-${Date.now()}`,
      customer_name: String(customer_name).trim(),
      mobile: String(mobile).trim(),
      email: email ? String(email).trim() : undefined,
      service_id: typeof service === 'object' ? service.id : 'srv-custom',
      service_name: typeof service === 'object' ? service.name : String(service),
      therapist_id: typeof therapist === 'object' ? therapist.id : 'th-1',
      therapist_name: typeof therapist === 'object' ? therapist.name : String(therapist),
      date: String(date),
      time: String(time),
      duration: duration || (typeof service === 'object' ? service.duration : '60 Minutes'),
      price: Number(price) || (typeof service === 'object' ? service.price : 999),
      notes: notes ? String(notes).trim() : undefined,
      payment_method: payment_method || 'Pay at Spa',
      payment_status: 'Pending',
      appointment_status: 'PENDING CONFIRMATION', // Initial status required
      created_at: new Date().toISOString()
    };

    db.appointments.unshift(newAppointment);

    // Customer Notification
    const notif = {
      id: `notif-${Date.now()}`,
      user_id: newAppointment.customer_id,
      title: 'Appointment Request Received',
      message: `Your appointment request has been received. Booking ID: ${candidateId}. Your appointment will be confirmed by our team.`,
      read: false,
      created_at: new Date().toISOString(),
      appointment_id: candidateId
    };
    db.notifications.unshift(notif);

    writeDb(db);

    // Broadcast SSE to all connected Admin & Customer clients
    broadcast('booking_created', { appointment: newAppointment });

    res.status(201).json(newAppointment);
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: err?.message || 'Failed to create appointment' });
  }
});

// PATCH Update Appointment Status
app.patch('/api/appointments/:id/status', (req, res) => {
  const { status, reason } = req.body;
  const allowedStatuses = [
    'PENDING CONFIRMATION',
    'CONFIRMED',
    'THERAPIST ASSIGNED',
    'APPOINTMENT STARTED',
    'COMPLETED',
    'CANCELLED'
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
  }

  const db = readDb();
  const idx = db.appointments.findIndex((a) => a.id === req.params.id || a.booking_id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  const prevStatus = db.appointments[idx].appointment_status;
  db.appointments[idx].appointment_status = status;

  if (reason) {
    db.appointments[idx].cancellation_reason = reason;
  }

  if (status === 'COMPLETED') {
    db.appointments[idx].payment_status = 'Paid';
    // increment therapist total sessions
    const thIdx = db.therapists.findIndex((t) => t.id === db.appointments[idx].therapist_id);
    if (thIdx !== -1) {
      db.therapists[thIdx].total_sessions = (db.therapists[thIdx].total_sessions || 0) + 1;
    }
  }

  // Create notifications based on exact instructions
  let notifMessage = `Your appointment (${db.appointments[idx].booking_id}) status is now: ${status}`;
  if (status === 'CONFIRMED') {
    notifMessage = 'Your RelaxCare appointment has been confirmed.';
  } else if (status === 'CANCELLED') {
    notifMessage = 'Your RelaxCare appointment has been cancelled.';
  } else if (status === 'COMPLETED') {
    notifMessage = `Your ${db.appointments[idx].service_name} session is completed. Please rate your experience!`;
  }

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    user_id: db.appointments[idx].customer_id,
    title: status === 'CONFIRMED' ? 'Appointment Confirmed' : status === 'CANCELLED' ? 'Appointment Cancelled' : status,
    message: notifMessage,
    read: false,
    created_at: new Date().toISOString(),
    appointment_id: db.appointments[idx].booking_id
  });

  writeDb(db);

  const updatedApt = db.appointments[idx];
  broadcast('booking_status_updated', {
    appointment: updatedApt,
    prevStatus,
    status
  });

  res.json(updatedApt);
});

// PATCH Reassign Therapist
app.patch('/api/appointments/:id/therapist', (req, res) => {
  const { therapist_id } = req.body;
  const db = readDb();
  const aptIdx = db.appointments.findIndex((a) => a.id === req.params.id || a.booking_id === req.params.id);
  const targetTech = db.therapists.find((t) => t.id === therapist_id);

  if (aptIdx === -1 || !targetTech) {
    return res.status(404).json({ error: 'Appointment or Therapist not found' });
  }

  db.appointments[aptIdx].therapist_id = targetTech.id;
  db.appointments[aptIdx].therapist_name = targetTech.name;
  db.appointments[aptIdx].appointment_status = 'THERAPIST ASSIGNED';

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    user_id: db.appointments[aptIdx].customer_id,
    title: 'Therapist Assigned',
    message: `Therapist ${targetTech.name} has been assigned to your appointment (${db.appointments[aptIdx].booking_id}).`,
    read: false,
    created_at: new Date().toISOString(),
    appointment_id: db.appointments[aptIdx].booking_id
  });

  writeDb(db);
  broadcast('therapist_assigned', { appointment: db.appointments[aptIdx] });
  res.json(db.appointments[aptIdx]);
});

// Services CRUD
app.get('/api/services', (req, res) => {
  const db = readDb();
  res.json(db.services || []);
});

app.post('/api/services', (req, res) => {
  const db = readDb();
  const newService = {
    ...req.body,
    id: `srv-${Date.now()}`,
    active: true,
    rating: 5.0,
    reviews_count: 0
  };
  db.services.push(newService);
  writeDb(db);
  broadcast('service_updated', { service: newService });
  res.status(201).json(newService);
});

app.put('/api/services/:id', (req, res) => {
  const db = readDb();
  const idx = db.services.findIndex((s) => s.id === req.params.id);
  if (idx !== -1) {
    db.services[idx] = { ...db.services[idx], ...req.body };
    writeDb(db);
    broadcast('service_updated', { service: db.services[idx] });
    return res.json(db.services[idx]);
  }
  res.status(404).json({ error: 'Service not found' });
});

app.delete('/api/services/:id', (req, res) => {
  const db = readDb();
  db.services = db.services.filter((s) => s.id !== req.params.id);
  writeDb(db);
  broadcast('service_deleted', { id: req.params.id });
  res.json({ success: true });
});

// Therapists CRUD
app.get('/api/therapists', (req, res) => {
  const db = readDb();
  res.json(db.therapists || []);
});

app.post('/api/therapists', (req, res) => {
  const db = readDb();
  const newTherapist = {
    ...req.body,
    id: `th-${Date.now()}`,
    rating: 5.0,
    total_sessions: 0,
    active: true
  };
  db.therapists.push(newTherapist);
  writeDb(db);
  broadcast('therapist_updated', { therapist: newTherapist });
  res.status(201).json(newTherapist);
});

app.put('/api/therapists/:id', (req, res) => {
  const db = readDb();
  const idx = db.therapists.findIndex((t) => t.id === req.params.id);
  if (idx !== -1) {
    db.therapists[idx] = { ...db.therapists[idx], ...req.body };
    writeDb(db);
    broadcast('therapist_updated', { therapist: db.therapists[idx] });
    return res.json(db.therapists[idx]);
  }
  res.status(404).json({ error: 'Therapist not found' });
});

app.delete('/api/therapists/:id', (req, res) => {
  const db = readDb();
  db.therapists = db.therapists.filter((t) => t.id !== req.params.id);
  writeDb(db);
  broadcast('therapist_deleted', { id: req.params.id });
  res.json({ success: true });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const db = readDb();
  const userId = req.query.userId as string;
  const list = (db.notifications || []).filter(
    (n) => !userId || n.user_id === userId || n.user_id === 'usr-customer-1'
  );
  res.json(list);
});

app.post('/api/notifications/read', (req, res) => {
  const { userId } = req.body;
  const db = readDb();
  (db.notifications || []).forEach((n) => {
    if (!userId || n.user_id === userId || n.user_id === 'usr-customer-1') {
      n.read = true;
    }
  });
  writeDb(db);
  res.json({ success: true });
});

// Reviews
app.get('/api/reviews', (req, res) => {
  const db = readDb();
  res.json(db.reviews || []);
});

app.post('/api/reviews', (req, res) => {
  const db = readDb();
  const newRev = {
    ...req.body,
    id: `rev-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  db.reviews.unshift(newRev);

  // Recalculate therapist rating
  if (newRev.therapist_id) {
    const thIdx = db.therapists.findIndex((t) => t.id === newRev.therapist_id);
    if (thIdx !== -1) {
      const thRevs = db.reviews.filter((r) => r.therapist_id === newRev.therapist_id);
      const sum = thRevs.reduce((acc, r) => acc + (r.rating || 5), 0);
      db.therapists[thIdx].rating = Number((sum / thRevs.length).toFixed(1));
    }
  }

  writeDb(db);
  broadcast('review_created', { review: newRev });
  res.status(201).json(newRev);
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RelaxCare Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
