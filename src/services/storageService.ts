import {
  Appointment,
  AppointmentStatus,
  Service,
  Therapist,
  User,
  Review,
  NotificationItem
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_THERAPISTS
} from '../data/mockData';

const STORAGE_KEYS = {
  SERVICES: 'rc_services_v5',
  THERAPISTS: 'rc_therapists_v5',
  APPOINTMENTS: 'rc_appointments_v5',
  USERS: 'rc_users_v5',
  CURRENT_USER: 'rc_current_user_v5',
  REVIEWS: 'rc_reviews_v5',
  NOTIFICATIONS: 'rc_notifications_v5',
  INITIALIZED: 'rc_initialized_v5'
};

export const DB_CHANGE_EVENT = 'rc_db_state_change';

export function notifyDbChange(collection: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT, { detail: { collection } }));
  }
}

export const DEFAULT_CUSTOMER: User = {
  id: 'usr-customer-1',
  name: 'Pooja Kapoor',
  mobile: '9876543210',
  email: 'pooja.kapoor@example.com',
  role: 'customer',
  created_at: new Date(Date.now() - 86400000 * 10).toISOString()
};

export const ADMIN_USER: User = {
  id: 'usr-admin-1',
  name: 'Spa Director (Admin)',
  mobile: '7505741030',
  email: 'admin@relaxcare.com',
  role: 'admin',
  created_at: new Date('2024-01-01').toISOString()
};

let isConnectedToSSE = false;
let sseSource: EventSource | null = null;
let pollInterval: any = null;

/**
 * Initializes the database, synchronizes with the server-side backend API,
 * and attaches a Server-Sent Events (SSE) listener for instant real-time admin updates!
 */
export function initDatabase() {
  if (typeof window === 'undefined') return;

  // Initial localStorage bootstrap if empty
  const rawApts = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  if (!rawApts) {
    const todayStr = new Date().toISOString().split('T')[0];
    const initialSeed: Appointment[] = [
      {
        id: 'apt-10001',
        booking_id: 'RC-10001',
        customer_id: 'usr-customer-1',
        service_id: 'srv-swedish',
        therapist_id: 'th-nomi',
        service_name: 'Swedish Massage',
        therapist_name: 'Nomi',
        customer_name: 'Pooja Kapoor',
        mobile: '9876543210',
        email: 'pooja.kapoor@example.com',
        date: todayStr,
        time: '6:00 PM',
        duration: '60 Minutes',
        price: 999,
        notes: 'Gentle pressure on shoulder blades',
        payment_method: 'Pay at Spa',
        payment_status: 'Pending',
        appointment_status: 'PENDING CONFIRMATION',
        created_at: new Date(Date.now() - 1800000).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initialSeed));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(INITIAL_THERAPISTS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_CUSTOMER, ADMIN_USER]));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_CUSTOMER));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // Pull fresh data from backend immediately
  syncWithBackend();

  // Attach Server-Sent Events (SSE) for Real-Time Push Updates
  setupSSE();

  // Setup 3s polling fallback for guaranteed real-time updates across all environments
  if (!pollInterval) {
    pollInterval = setInterval(() => {
      syncWithBackend(false); // quiet sync
    }, 3000);
  }
}

async function syncWithBackend(triggerEvent = true) {
  try {
    const [aptsRes, srvRes, thRes, notifRes] = await Promise.all([
      fetch('/api/appointments').catch(() => null),
      fetch('/api/services').catch(() => null),
      fetch('/api/therapists').catch(() => null),
      fetch('/api/notifications').catch(() => null)
    ]);

    let changed = false;

    if (aptsRes && aptsRes.ok) {
      const serverApts = await aptsRes.json();
      const currentRaw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      const serverJson = JSON.stringify(serverApts);
      if (currentRaw !== serverJson) {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, serverJson);
        changed = true;
      }
    }

    if (srvRes && srvRes.ok) {
      const serverSrv = await srvRes.json();
      const currentRaw = localStorage.getItem(STORAGE_KEYS.SERVICES);
      const serverJson = JSON.stringify(serverSrv);
      if (currentRaw !== serverJson) {
        localStorage.setItem(STORAGE_KEYS.SERVICES, serverJson);
        changed = true;
      }
    }

    if (thRes && thRes.ok) {
      const serverTh = await thRes.json();
      const currentRaw = localStorage.getItem(STORAGE_KEYS.THERAPISTS);
      const serverJson = JSON.stringify(serverTh);
      if (currentRaw !== serverJson) {
        localStorage.setItem(STORAGE_KEYS.THERAPISTS, serverJson);
        changed = true;
      }
    }

    if (notifRes && notifRes.ok) {
      const serverNotif = await notifRes.json();
      const currentRaw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const serverJson = JSON.stringify(serverNotif);
      if (currentRaw !== serverJson) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, serverJson);
        changed = true;
      }
    }

    if (changed && triggerEvent) {
      notifyDbChange('all');
    }
  } catch (e) {
    // Backend offline / network blip - fallback on local storage
  }
}

function setupSSE() {
  if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;
  if (isConnectedToSSE && sseSource) return;

  try {
    sseSource = new EventSource('/api/events');

    sseSource.onopen = () => {
      isConnectedToSSE = true;
    };

    sseSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type && payload.type !== 'connected') {
          // Immediately sync with backend upon any real-time event!
          syncWithBackend(true);
        }
      } catch {
        // ping or non-json message
      }
    };

    sseSource.onerror = () => {
      isConnectedToSSE = false;
      sseSource?.close();
      sseSource = null;
      // Re-attempt after 5s
      setTimeout(setupSSE, 5000);
    };
  } catch {
    // SSE not supported or errored
  }
}

// ============ USER / AUTH ============

export function getCurrentUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_CUSTOMER;
}

export function setCurrentUser(user: User) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  notifyDbChange('user');
}

export function loginCustomer(name: string, mobile: string, email?: string): User {
  const users = getUsers();
  let user = users.find((u) => u.mobile === mobile);
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: name.trim() || 'Valued Guest',
      mobile: mobile.trim(),
      email: email?.trim(),
      role: 'customer',
      created_at: new Date().toISOString()
    };
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } else {
    if (name.trim()) user.name = name.trim();
    if (email?.trim()) user.email = email.trim();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  setCurrentUser(user);
  return user;
}

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [DEFAULT_CUSTOMER, ADMIN_USER];
}

// ============ SERVICES ============

export function getServices(): Service[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_SERVICES;
}

export async function updateService(srv: Service) {
  const list = getServices();
  const idx = list.findIndex((s) => s.id === srv.id);
  if (idx !== -1) {
    list[idx] = srv;
  } else {
    list.push(srv);
  }
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
  notifyDbChange('services');

  // Push to server
  try {
    await fetch(`/api/services/${srv.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(srv)
    });
  } catch (e) {
    console.error('Failed to sync service with backend:', e);
  }
}

export async function deleteService(serviceId: string) {
  const list = getServices().filter((s) => s.id !== serviceId);
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
  notifyDbChange('services');

  try {
    await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Failed to delete service on backend:', e);
  }
}

// ============ THERAPISTS ============

export function getTherapists(): Therapist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THERAPISTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_THERAPISTS;
}

export async function updateTherapist(th: Therapist) {
  const list = getTherapists();
  const idx = list.findIndex((t) => t.id === th.id);
  if (idx !== -1) {
    list[idx] = th;
  } else {
    list.push(th);
  }
  localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(list));
  notifyDbChange('therapists');

  try {
    await fetch(`/api/therapists/${th.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(th)
    });
  } catch (e) {
    console.error('Failed to sync therapist with backend:', e);
  }
}

export async function addTherapist(th: Omit<Therapist, 'id' | 'rating' | 'total_sessions'>): Promise<Therapist> {
  const list = getTherapists();
  const newTherapist: Therapist = {
    ...th,
    id: `th-${Date.now()}`,
    rating: 5.0,
    total_sessions: 0
  };
  list.push(newTherapist);
  localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(list));
  notifyDbChange('therapists');

  try {
    const res = await fetch('/api/therapists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTherapist)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error('Failed to save therapist to backend:', e);
  }
  return newTherapist;
}

export async function deleteTherapist(id: string) {
  const list = getTherapists().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(list));
  notifyDbChange('therapists');

  try {
    await fetch(`/api/therapists/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Failed to delete therapist on backend:', e);
  }
}

// ============ APPOINTMENTS SYSTEM ============

export function getAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

/**
 * Checks if a therapist is already booked for a specific date and time slot.
 * Prevents double booking.
 */
export function isTherapistBooked(therapistId: string, date: string, time: string): boolean {
  const appointments = getAppointments();
  return appointments.some(
    (apt) =>
      apt.therapist_id === therapistId &&
      apt.date === date &&
      apt.time === time &&
      apt.appointment_status !== 'CANCELLED' &&
      apt.appointment_status !== 'Cancelled'
  );
}

/**
 * Creates a real appointment in the database.
 * Generates unique Booking ID such as RC-10001.
 * Initial status: PENDING CONFIRMATION.
 */
export async function createAppointmentAsync(data: {
  service: Service;
  therapist: Therapist;
  customer_id: string;
  customer_name: string;
  mobile: string;
  email?: string;
  date: string;
  time: string;
  notes?: string;
  payment_method?: 'Pay at Spa' | 'Online Payment';
}): Promise<Appointment> {
  // Prevent double booking
  if (isTherapistBooked(data.therapist.id, data.date, data.time)) {
    throw new Error(
      `Time slot ${data.time} on ${data.date} is already booked for ${data.therapist.name}. Please select another time or therapist.`
    );
  }

  // Attempt to create on real backend
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: data.customer_name,
        mobile: data.mobile,
        email: data.email,
        service: data.service,
        therapist: data.therapist,
        date: data.date,
        time: data.time,
        duration: data.service.duration,
        price: data.service.price,
        notes: data.notes,
        payment_method: data.payment_method || 'Pay at Spa',
        customer_id: data.customer_id
      })
    });

    if (res.ok) {
      const createdApt: Appointment = await res.json();
      // Update local storage
      const appointments = getAppointments();
      appointments.unshift(createdApt);
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

      // Customer notification:
      // “Your appointment request has been received.”
      // “Booking ID: RC-10001”
      // “Your appointment will be confirmed by our team.”
      addNotification({
        user_id: data.customer_id,
        title: 'Appointment Request Received',
        message: `Your appointment request has been received. Booking ID: ${createdApt.booking_id}. Your appointment will be confirmed by our team.`,
        appointment_id: createdApt.booking_id
      });

      notifyDbChange('appointments');
      return createdApt;
    } else {
      const errData = await res.json().catch(() => null);
      if (errData?.error) throw new Error(errData.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
  }

  // Fallback local creation if server cannot be reached
  const appointments = getAppointments();
  // Find highest existing sequence
  let highestNum = 10000;
  appointments.forEach((a) => {
    const match = a.booking_id.match(/RC-(\d+)/);
    if (match) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > highestNum) highestNum = val;
    }
  });
  const booking_id = `RC-${highestNum + 1}`;

  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    booking_id,
    customer_id: data.customer_id,
    service_id: data.service.id,
    therapist_id: data.therapist.id,
    service_name: data.service.name,
    therapist_name: data.therapist.name,
    customer_name: data.customer_name,
    mobile: data.mobile,
    email: data.email,
    date: data.date,
    time: data.time,
    duration: data.service.duration,
    price: data.service.price,
    notes: data.notes,
    payment_method: data.payment_method || 'Pay at Spa',
    payment_status: 'Pending',
    appointment_status: 'PENDING CONFIRMATION', // Initial status required
    created_at: new Date().toISOString()
  };

  appointments.unshift(newAppointment);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

  addNotification({
    user_id: data.customer_id,
    title: 'Appointment Request Received',
    message: `Your appointment request has been received. Booking ID: ${booking_id}. Your appointment will be confirmed by our team.`,
    appointment_id: booking_id
  });

  notifyDbChange('appointments');
  return newAppointment;
}

/**
 * Synchronous wrapper for appointment creation
 */
export function createAppointment(data: {
  service: Service;
  therapist: Therapist;
  customer_id: string;
  customer_name: string;
  mobile: string;
  email?: string;
  date: string;
  time: string;
  notes?: string;
  payment_method?: 'Pay at Spa' | 'Online Payment';
}): Appointment {
  if (isTherapistBooked(data.therapist.id, data.date, data.time)) {
    throw new Error(
      `Time slot ${data.time} on ${data.date} is already booked for ${data.therapist.name}. Please select another time or therapist.`
    );
  }

  const appointments = getAppointments();
  let highestNum = 10000;
  appointments.forEach((a) => {
    const match = a.booking_id.match(/RC-(\d+)/);
    if (match) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > highestNum) highestNum = val;
    }
  });
  const booking_id = `RC-${highestNum + 1}`;

  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    booking_id,
    customer_id: data.customer_id,
    service_id: data.service.id,
    therapist_id: data.therapist.id,
    service_name: data.service.name,
    therapist_name: data.therapist.name,
    customer_name: data.customer_name,
    mobile: data.mobile,
    email: data.email,
    date: data.date,
    time: data.time,
    duration: data.service.duration,
    price: data.service.price,
    notes: data.notes,
    payment_method: data.payment_method || 'Pay at Spa',
    payment_status: 'Pending',
    appointment_status: 'PENDING CONFIRMATION',
    created_at: new Date().toISOString()
  };

  appointments.unshift(newAppointment);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

  addNotification({
    user_id: data.customer_id,
    title: 'Appointment Request Received',
    message: `Your appointment request has been received. Booking ID: ${booking_id}. Your appointment will be confirmed by our team.`,
    appointment_id: booking_id
  });

  notifyDbChange('appointments');

  // Async push to backend server
  fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: data.customer_name,
      mobile: data.mobile,
      email: data.email,
      service: data.service,
      therapist: data.therapist,
      date: data.date,
      time: data.time,
      duration: data.service.duration,
      price: data.service.price,
      notes: data.notes,
      payment_method: data.payment_method || 'Pay at Spa',
      customer_id: data.customer_id
    })
  })
    .then((res) => res.json())
    .then((serverApt) => {
      if (serverApt && serverApt.booking_id) {
        // update with exact server generated object if different
        const currentApts = getAppointments();
        const idx = currentApts.findIndex((a) => a.id === newAppointment.id);
        if (idx !== -1) {
          currentApts[idx] = serverApt;
          localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(currentApts));
          notifyDbChange('appointments');
        }
      }
    })
    .catch(() => {});

  return newAppointment;
}

/**
 * Updates status in database and dispatches notifications:
 * When Admin confirms: “Your RelaxCare appointment has been confirmed.”
 * When Admin cancels: “Your RelaxCare appointment has been cancelled.”
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: AppointmentStatus,
  cancellationReason?: string
) {
  const appointments = getAppointments();
  const idx = appointments.findIndex((a) => a.id === appointmentId || a.booking_id === appointmentId);
  if (idx !== -1) {
    appointments[idx].appointment_status = newStatus;
    if (cancellationReason) {
      appointments[idx].cancellation_reason = cancellationReason;
    }
    if (newStatus === 'COMPLETED' || newStatus === 'Completed') {
      appointments[idx].payment_status = 'Paid';
      incrementTherapistSessions(appointments[idx].therapist_id);
    }
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

    let notifMsg = `Your appointment (${appointments[idx].booking_id}) status is now: ${newStatus}`;
    if (newStatus === 'CONFIRMED' || newStatus === 'Appointment Confirmed') {
      notifMsg = 'Your RelaxCare appointment has been confirmed.';
    } else if (newStatus === 'CANCELLED' || newStatus === 'Cancelled') {
      notifMsg = 'Your RelaxCare appointment has been cancelled.';
    } else if (newStatus === 'COMPLETED' || newStatus === 'Completed') {
      notifMsg = `Your ${appointments[idx].service_name} session is completed. Please rate your experience with ${appointments[idx].therapist_name}!`;
    }

    addNotification({
      user_id: appointments[idx].customer_id,
      title: newStatus === 'CONFIRMED' ? 'Appointment Confirmed' : newStatus === 'CANCELLED' ? 'Appointment Cancelled' : newStatus,
      message: notifMsg,
      appointment_id: appointments[idx].booking_id
    });

    notifyDbChange('appointments');

    // Sync to backend
    try {
      await fetch(`/api/appointments/${appointments[idx].id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason: cancellationReason })
      });
    } catch (e) {
      console.error('Failed to sync appointment status to backend:', e);
    }
  }
}

export async function updateAppointmentTherapist(appointmentId: string, newTherapistId: string) {
  const appointments = getAppointments();
  const therapists = getTherapists();
  const targetTech = therapists.find((t) => t.id === newTherapistId);
  const idx = appointments.findIndex((a) => a.id === appointmentId || a.booking_id === appointmentId);

  if (idx !== -1 && targetTech) {
    appointments[idx].therapist_id = newTherapistId;
    appointments[idx].therapist_name = targetTech.name;
    appointments[idx].appointment_status = 'THERAPIST ASSIGNED';
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

    addNotification({
      user_id: appointments[idx].customer_id,
      title: 'Therapist Assigned',
      message: `Therapist ${targetTech.name} has been assigned to your appointment (${appointments[idx].booking_id}).`,
      appointment_id: appointments[idx].booking_id
    });

    notifyDbChange('appointments');

    try {
      await fetch(`/api/appointments/${appointments[idx].id}/therapist`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ therapist_id: newTherapistId })
      });
    } catch (e) {
      console.error('Failed to sync reassigned therapist to backend:', e);
    }
  }
}

function incrementTherapistSessions(therapistId: string) {
  const list = getTherapists();
  const th = list.find((t) => t.id === therapistId);
  if (th) {
    th.total_sessions = (th.total_sessions || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(list));
  }
}

// ============ REVIEWS & RATINGS ============

export function getReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export async function submitReview(data: {
  appointment_id: string;
  customer_id: string;
  customer_name: string;
  therapist_id: string;
  rating: number;
  review: string;
}) {
  const reviews = getReviews();
  const newRev: Review = {
    id: `rev-${Date.now()}`,
    ...data,
    created_at: new Date().toISOString()
  };
  reviews.unshift(newRev);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

  const appointments = getAppointments();
  const aptIdx = appointments.findIndex(
    (a) => a.id === data.appointment_id || a.booking_id === data.appointment_id
  );
  if (aptIdx !== -1) {
    appointments[aptIdx].rated = true;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }

  const therapists = getTherapists();
  const th = therapists.find((t) => t.id === data.therapist_id);
  if (th) {
    const thReviews = reviews.filter((r) => r.therapist_id === data.therapist_id);
    const sum = thReviews.reduce((acc, r) => acc + r.rating, 0);
    th.rating = Number((sum / thReviews.length).toFixed(1));
    localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(therapists));
  }

  notifyDbChange('reviews');

  try {
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRev)
    });
  } catch (e) {
    console.error('Failed to sync review with backend:', e);
  }
}

// ============ NOTIFICATIONS ============

export function getNotifications(userId: string): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) {
      const all: NotificationItem[] = JSON.parse(raw);
      return all.filter((n) => n.user_id === userId || n.user_id === 'usr-customer-1');
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function addNotification(notif: Omit<NotificationItem, 'id' | 'read' | 'created_at'>) {
  const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const list: NotificationItem[] = raw ? JSON.parse(raw) : [];
  list.unshift({
    ...notif,
    id: `notif-${Date.now()}`,
    read: false,
    created_at: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  notifyDbChange('notifications');
}

export async function markNotificationsAsRead(userId: string) {
  const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  if (raw) {
    const list: NotificationItem[] = JSON.parse(raw);
    list.forEach((n) => {
      if (n.user_id === userId || n.user_id === 'usr-customer-1') n.read = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    notifyDbChange('notifications');
  }

  try {
    await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  } catch (e) {
    // fallback
  }
}
