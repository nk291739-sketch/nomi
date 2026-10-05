export type UserRole = 'customer' | 'admin' | 'therapist';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  profile_image?: string;
  role: UserRole;
  created_at: string;
}

export type ServiceCategory = 'Massage Services' | 'Spa & Wellness';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  duration: string; // e.g. "60 Minutes"
  price: number; // e.g. 999
  benefits: string[];
  includes: string[];
  rating: number;
  reviews_count: number;
  active: boolean;
  theme_gradient: string;
  accent_color: string;
  featured?: boolean;
}

export interface Therapist {
  id: string;
  name: string;
  photo: string;
  experience: string; // e.g. "5 Years Experience"
  specializations: string[];
  rating: number;
  total_sessions: number;
  available_days: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  available_time: string; // e.g. "9:00 AM – 8:00 PM"
  availability: 'Available' | 'Busy' | 'Off Duty';
  active: boolean;
  bio: string;
}

export type AppointmentStatus =
  | 'PENDING CONFIRMATION'
  | 'CONFIRMED'
  | 'THERAPIST ASSIGNED'
  | 'APPOINTMENT STARTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'Completed'
  | 'Cancelled'
  | 'Appointment Requested'
  | 'Appointment Confirmed';

export type PaymentMethod = 'Pay at Spa' | 'Online Payment';

export interface Appointment {
  id: string;
  booking_id: string; // e.g. RC-10492
  customer_id: string;
  service_id: string;
  therapist_id: string;
  service_name: string;
  therapist_name: string;
  customer_name: string;
  mobile: string;
  email?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "2:00 PM"
  duration: string;
  price: number;
  notes?: string;
  payment_method: PaymentMethod;
  payment_status: 'Pending' | 'Paid';
  appointment_status: AppointmentStatus;
  cancellation_reason?: string;
  created_at: string;
  rated?: boolean;
}

export interface Review {
  id: string;
  appointment_id: string;
  customer_id: string;
  customer_name: string;
  therapist_id: string;
  rating: number;
  review: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  appointment_id?: string;
}
