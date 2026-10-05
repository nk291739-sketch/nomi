export const BUSINESS_PHONE = '7505741030';
export const BUSINESS_PHONE_FORMATTED = '+91 75057 41030';
export const BUSINESS_EMAIL = 'care@relaxcare.com';

/**
 * Creates a WhatsApp link for web / mobile
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates general help & support message
 */
export function getGeneralSupportWhatsAppUrl(): string {
  const message = 'Hello RelaxCare, I would like to inquire about spa & massage appointments.';
  return getWhatsAppUrl(BUSINESS_PHONE, message);
}

/**
 * Creates new appointment enquiry WhatsApp message to RelaxCare Desk
 */
export function getNewAppointmentEnquiryWhatsAppUrl(appointment: {
  booking_id: string;
  customer_name: string;
  mobile: string;
  service: string;
  therapist: string;
  date: string;
  time: string;
}): string {
  const message = `Hello RelaxCare,

New appointment enquiry:

Booking ID: ${appointment.booking_id}
Customer: ${appointment.customer_name}
Mobile: ${appointment.mobile}
Service: ${appointment.service}
Therapist: ${appointment.therapist}
Date: ${appointment.date}
Time: ${appointment.time}

Please confirm my appointment.`;

  return getWhatsAppUrl(BUSINESS_PHONE, message);
}

/**
 * Creates customer WhatsApp button message
 */
export function getCustomerBookingRequestWhatsAppUrl(appointment: {
  booking_id: string;
  service: string;
  date: string;
  time: string;
}): string {
  const message = `Hello RelaxCare, I have submitted a booking request.

Booking ID: ${appointment.booking_id}
Service: ${appointment.service}
Date: ${appointment.date}
Time: ${appointment.time}`;

  return getWhatsAppUrl(BUSINESS_PHONE, message);
}

/**
 * Creates Admin-to-Customer WhatsApp chat link
 */
export function getAdminToCustomerWhatsAppUrl(appointment: {
  mobile: string;
  customer_name: string;
  booking_id: string;
  service: string;
  therapist: string;
  date: string;
  time: string;
}): string {
  const cleanPhone = appointment.mobile.replace(/[^0-9]/g, '');
  const message = `Hello ${appointment.customer_name}, regards from RelaxCare.

Regarding your appointment:
Booking ID: ${appointment.booking_id}
Service: ${appointment.service}
Therapist: ${appointment.therapist}
Date: ${appointment.date}
Time: ${appointment.time}

How can our concierge assist you today?`;

  return getWhatsAppUrl(cleanPhone, message);
}

/**
 * Backward compatible appointment confirmation WhatsApp message
 */
export function getAppointmentWhatsAppUrl(appointment: {
  booking_id: string;
  service: string;
  therapist: string;
  date: string;
  time: string;
  customer_name?: string;
  mobile?: string;
}): string {
  if (appointment.customer_name && appointment.mobile) {
    return getNewAppointmentEnquiryWhatsAppUrl({
      booking_id: appointment.booking_id,
      customer_name: appointment.customer_name,
      mobile: appointment.mobile,
      service: appointment.service,
      therapist: appointment.therapist,
      date: appointment.date,
      time: appointment.time
    });
  }

  const message = `Hello RelaxCare, I have submitted a booking request.

Booking ID: ${appointment.booking_id}
Service: ${appointment.service}
Date: ${appointment.date}
Time: ${appointment.time}`;

  return getWhatsAppUrl(BUSINESS_PHONE, message);
}

/**
 * Direct phone dialer link
 */
export function getPhoneCallUrl(phone: string = BUSINESS_PHONE): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91${cleanPhone}`;
  return `tel:${targetPhone}`;
}

/**
 * Google Calendar / ICS helper (Requirement #10: Add to Calendar)
 */
export function createGoogleCalendarUrl(appointment: {
  booking_id: string;
  service_name: string;
  therapist_name: string;
  date: string;
  time: string;
}): string {
  // Convert date and time to simple Google Calendar template format
  const title = `RelaxCare: ${appointment.service_name} with ${appointment.therapist_name}`;
  const details = `Spa & Massage Appointment at RelaxCare\nBooking ID: ${appointment.booking_id}\nTherapist: ${appointment.therapist_name}\nTime: ${appointment.time}\nHelpline: +91 75057 41030`;
  const location = 'RelaxCare Wellness & Luxury Spa Sanctuary';

  // Format ISO date like 20261010T140000Z
  const cleanDate = appointment.date.replace(/-/g, '');
  const dates = `${cleanDate}/${cleanDate}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}
