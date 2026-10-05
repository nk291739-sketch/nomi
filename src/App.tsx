import React, { useState, useEffect, useCallback } from 'react';
import {
  initDatabase,
  getServices,
  getTherapists,
  getAppointments,
  getCurrentUser,
  setCurrentUser,
  getNotifications,
  updateAppointmentStatus,
  DEFAULT_CUSTOMER,
  ADMIN_USER,
  DB_CHANGE_EVENT
} from './services/storageService';
import {
  Service,
  Therapist,
  Appointment,
  User,
  NotificationItem
} from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { NotificationsModal } from './components/common/NotificationsModal';
import { SplashScreen } from './components/customer/SplashScreen';
import { HomeScreen } from './components/customer/HomeScreen';
import { MyAppointmentsScreen } from './components/customer/MyAppointmentsScreen';
import { SupportScreen } from './components/customer/SupportScreen';
import { ProfileScreen } from './components/customer/ProfileScreen';
import { ServiceDetailModal } from './components/customer/ServiceDetailModal';
import { TherapistListModal } from './components/customer/TherapistListModal';
import { AppointmentBookingModal } from './components/customer/AppointmentBookingModal';
import { BookingConfirmationModal } from './components/customer/BookingConfirmationModal';
import { AppointmentDetailModal } from './components/customer/AppointmentDetailModal';
import { LoginModal } from './components/customer/LoginModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { MessageCircle } from 'lucide-react';
import { getGeneralSupportWhatsAppUrl } from './utils/whatsapp';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');
  const [customerTab, setCustomerTab] = useState<'home' | 'appointments' | 'therapists' | 'profile'>('home');

  // Database states
  const [currentUser, setCurrentUserState] = useState<User>(DEFAULT_CUSTOMER);
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<Service | null>(null);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [bookingTherapist, setBookingTherapist] = useState<Therapist | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTherapistPicker, setShowTherapistPicker] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Sync DB state
  const refreshDbState = useCallback(() => {
    initDatabase();
    setCurrentUserState(getCurrentUser());
    setServices(getServices());
    setTherapists(getTherapists());
    setAppointments(getAppointments());
    const user = getCurrentUser();
    setNotifications(getNotifications(user.id));
  }, []);

  useEffect(() => {
    refreshDbState();

    const handleDbChange = () => {
      refreshDbState();
    };

    window.addEventListener(DB_CHANGE_EVENT, handleDbChange);
    return () => window.removeEventListener(DB_CHANGE_EVENT, handleDbChange);
  }, [refreshDbState]);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const activeAppointmentsCount = appointments.filter(
    (a) =>
      a.appointment_status === 'PENDING CONFIRMATION' ||
      a.appointment_status === 'CONFIRMED' ||
      a.appointment_status === 'THERAPIST ASSIGNED' ||
      a.appointment_status === 'APPOINTMENT STARTED' ||
      a.appointment_status === 'Appointment Requested' ||
      a.appointment_status === 'Appointment Confirmed'
  ).length;

  // Booking triggers
  const handleStartBookingForService = (service: Service) => {
    setSelectedServiceForDetail(null);
    setBookingService(service);
    // Open therapist selector or proceed directly with first available
    const matched = therapists.find((t) => t.active && t.availability === 'Available');
    setBookingTherapist(matched || therapists[0]);
    setShowBookingModal(true);
  };

  const handleStartBookingForTherapist = (therapist: Therapist) => {
    setBookingTherapist(therapist);
    const matchedService =
      services.find((s) => therapist.specializations.some((spec) => spec.includes(s.name))) ||
      services[0];
    setBookingService(matchedService);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (newApt: Appointment) => {
    refreshDbState();
    setConfirmedAppointment(newApt);
  };

  const handleCancelAppointment = async (apt: Appointment) => {
    if (confirm(`Are you sure you want to cancel your appointment (${apt.booking_id})?`)) {
      await updateAppointmentStatus(apt.id, 'CANCELLED', 'Cancelled by guest via app');
      refreshDbState();
    }
  };

  const handleLogout = () => {
    const guestUser: User = {
      id: 'user-guest',
      name: '',
      mobile: '',
      role: 'customer',
      created_at: new Date().toISOString()
    };
    setCurrentUser(guestUser);
    setCurrentUserState(guestUser);
    setShowLoginModal(true);
  };

  const handleLogoutAdmin = () => {
    setCurrentUser(DEFAULT_CUSTOMER);
    setCurrentUserState(DEFAULT_CUSTOMER);
    setViewMode('customer');
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (viewMode === 'admin') {
    return (
      <AdminPortal
        appointments={appointments}
        therapists={therapists}
        services={services}
        onBackToCustomerApp={() => setViewMode('customer')}
        onRefresh={refreshDbState}
        onLogoutAdmin={handleLogoutAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        unreadCount={unreadNotifsCount}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenProfile={() => setCustomerTab('profile')}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenAdmin={() => {
          if (currentUser.role === 'admin') {
            setViewMode('admin');
          } else {
            setShowAdminLoginModal(true);
          }
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-4 pb-20">
        {customerTab === 'home' && (
          <HomeScreen
            currentUser={currentUser}
            services={services}
            therapists={therapists}
            onSelectService={(srv) => setSelectedServiceForDetail(srv)}
            onBookDirect={handleStartBookingForService}
            onSelectTherapist={handleStartBookingForTherapist}
            onOpenAllTherapists={() => setShowTherapistPicker(true)}
          />
        )}

        {customerTab === 'appointments' && (
          <MyAppointmentsScreen
            appointments={appointments}
            onSelectAppointment={(apt) => setViewingAppointment(apt)}
            onBookNew={() => setCustomerTab('home')}
            onCancelAppointment={handleCancelAppointment}
            onRateAppointment={(apt) => setViewingAppointment(apt)}
          />
        )}

        {customerTab === 'therapists' && (
          <div className="space-y-4 pb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-stone-900">Spa Therapists</h1>
                <p className="text-xs text-stone-500">Certified wellness practitioners at RelaxCare</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {therapists.filter((t) => t.active).map((th) => (
                <div
                  key={th.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-amber-200 shrink-0">
                        <img src={th.photo} alt={th.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-stone-900 text-base">{th.name}</h3>
                        <div className="text-xs text-stone-500">{th.experience}</div>
                        <div className="text-[11px] font-bold text-amber-600 mt-0.5">
                          ⭐ {th.rating} ({th.total_sessions}+ sessions)
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-2">
                      {th.bio}
                    </p>
                    <div className="text-xs text-stone-500">
                      <strong>Specializations:</strong> {th.specializations.join(', ')}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartBookingForTherapist(th)}
                    className="mt-4 w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Reserve Session with {th.name.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {customerTab === 'profile' && (
          <ProfileScreen
            currentUser={currentUser}
            onOpenAppointments={() => setCustomerTab('appointments')}
            onOpenNotifications={() => setShowNotifications(true)}
            onOpenSupport={() => setCustomerTab('home')}
            onOpenAdmin={() => {
              if (currentUser.role === 'admin') {
                setViewMode('admin');
              } else {
                setShowAdminLoginModal(true);
              }
            }}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Floating Instant WhatsApp Button */}
      <a
        href={getGeneralSupportWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-4 z-30 p-3 bg-emerald-800 hover:bg-emerald-700 text-amber-300 rounded-full shadow-xl shadow-stone-950/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-amber-300/30"
        title="WhatsApp Concierge (+91 75057 41030)"
      >
        <MessageCircle className="w-6 h-6 fill-amber-300 text-emerald-800" />
        <span className="hidden md:inline text-xs font-serif font-bold text-white pr-1">
          WhatsApp Spa Desk
        </span>
      </a>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentTab={customerTab}
        onTabChange={(tab) => setCustomerTab(tab)}
        activeCount={activeAppointmentsCount}
      />

      {/* Modals */}
      {selectedServiceForDetail && (
        <ServiceDetailModal
          service={selectedServiceForDetail}
          isOpen={true}
          onClose={() => setSelectedServiceForDetail(null)}
          onBookAppointment={handleStartBookingForService}
        />
      )}

      {showTherapistPicker && (
        <TherapistListModal
          service={bookingService}
          therapists={therapists}
          isOpen={true}
          onClose={() => setShowTherapistPicker(false)}
          onSelectTherapist={(th) => {
            setShowTherapistPicker(false);
            handleStartBookingForTherapist(th);
          }}
        />
      )}

      {showBookingModal && bookingService && bookingTherapist && (
        <AppointmentBookingModal
          initialService={bookingService}
          initialTherapist={bookingTherapist}
          currentUser={currentUser}
          isOpen={true}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={handleBookingSuccess}
          onOpenLogin={() => setShowLoginModal(true)}
        />
      )}

      {confirmedAppointment && (
        <BookingConfirmationModal
          appointment={confirmedAppointment}
          isOpen={true}
          onClose={() => setConfirmedAppointment(null)}
          onViewAppointment={(apt) => {
            setConfirmedAppointment(null);
            setViewingAppointment(apt);
          }}
        />
      )}

      {viewingAppointment && (
        <AppointmentDetailModal
          appointment={viewingAppointment}
          isOpen={true}
          onClose={() => setViewingAppointment(null)}
          onRefresh={refreshDbState}
        />
      )}

      {showNotifications && (
        <NotificationsModal
          isOpen={true}
          onClose={() => setShowNotifications(false)}
          userId={currentUser.id}
          notifications={notifications}
          onSelectAppointmentId={(bId) => {
            const match = appointments.find((a) => a.booking_id === bId);
            if (match) setViewingAppointment(match);
          }}
        />
      )}

      {showLoginModal && (
        <LoginModal
          isOpen={true}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(u) => {
            setCurrentUserState(u);
            refreshDbState();
          }}
          onSwitchToAdmin={() => {
            setShowLoginModal(false);
            setShowAdminLoginModal(true);
          }}
        />
      )}

      {showAdminLoginModal && (
        <AdminLoginModal
          isOpen={true}
          onClose={() => setShowAdminLoginModal(false)}
          onAdminLoginSuccess={(adm) => {
            setCurrentUserState(adm);
            setViewMode('admin');
            setShowAdminLoginModal(false);
          }}
        />
      )}
    </div>
  );
}
