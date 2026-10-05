import React, { useState } from 'react';
import {
  Search,
  Phone,
  MessageCircle,
  Eye,
  XCircle,
  CheckCircle,
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  Filter,
  Check
} from 'lucide-react';
import { Appointment, AppointmentStatus, Therapist } from '../../types';
import {
  updateAppointmentStatus,
  updateAppointmentTherapist,
  getTherapists
} from '../../services/storageService';
import {
  getPhoneCallUrl,
  getAdminToCustomerWhatsAppUrl,
  getNewAppointmentEnquiryWhatsAppUrl
} from '../../utils/whatsapp';

interface AdminAppointmentListProps {
  appointments: Appointment[];
  onRefresh: () => void;
}

export const AdminAppointmentList: React.FC<AdminAppointmentListProps> = ({
  appointments,
  onRefresh
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] = useState<Appointment | null>(
    null
  );
  const [showCancelModal, setShowCancelModal] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('Guest requested schedule change or cancellation');
  const [reassigningAppointment, setReassigningAppointment] = useState<Appointment | null>(null);

  const therapists = getTherapists();

  // The 6 exact statuses required
  const allStatuses: AppointmentStatus[] = [
    'PENDING CONFIRMATION',
    'CONFIRMED',
    'THERAPIST ASSIGNED',
    'APPOINTMENT STARTED',
    'COMPLETED',
    'CANCELLED'
  ];

  const filtered = appointments.filter((a) => {
    const matchStatus =
      filterStatus === 'All' ||
      a.appointment_status === filterStatus ||
      (filterStatus === 'PENDING CONFIRMATION' && a.appointment_status === 'Appointment Requested') ||
      (filterStatus === 'CONFIRMED' && a.appointment_status === 'Appointment Confirmed') ||
      (filterStatus === 'COMPLETED' && a.appointment_status === 'Completed') ||
      (filterStatus === 'CANCELLED' && a.appointment_status === 'Cancelled');

    const matchSearch =
      a.booking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.mobile.includes(searchQuery) ||
      a.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.therapist_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    await updateAppointmentStatus(id, newStatus);
    onRefresh();
  };

  const handleConfirm = async (a: Appointment) => {
    await updateAppointmentStatus(a.id, 'CONFIRMED');
    onRefresh();
  };

  const handleConfirmCancel = async () => {
    if (showCancelModal) {
      await updateAppointmentStatus(showCancelModal.id, 'CANCELLED', cancelReason);
      setShowCancelModal(null);
      onRefresh();
    }
  };

  const handleReassignTherapist = async (therapistId: string) => {
    if (reassigningAppointment) {
      await updateAppointmentTherapist(reassigningAppointment.id, therapistId);
      setReassigningAppointment(null);
      onRefresh();
    }
  };

  const handleWhatsAppCustomer = (a: Appointment) => {
    const url = getAdminToCustomerWhatsAppUrl({
      mobile: a.mobile,
      customer_name: a.customer_name,
      booking_id: a.booking_id,
      service: a.service_name,
      therapist: a.therapist_name,
      date: a.date,
      time: a.time
    });
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Appointments & Schedule Desk
          </h2>
          <p className="text-xs text-stone-500">
            Manage real database bookings, update status stages, and connect with guests ({appointments.length} total)
          </p>
        </div>

        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by ID, guest, therapist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterStatus('All')}
          className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            filterStatus === 'All'
              ? 'bg-stone-900 text-white'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          All ({appointments.length})
        </button>
        {allStatuses.map((st) => {
          const count = appointments.filter(
            (a) =>
              a.appointment_status === st ||
              (st === 'PENDING CONFIRMATION' && a.appointment_status === 'Appointment Requested') ||
              (st === 'CONFIRMED' && a.appointment_status === 'Appointment Confirmed') ||
              (st === 'COMPLETED' && a.appointment_status === 'Completed') ||
              (st === 'CANCELLED' && a.appointment_status === 'Cancelled')
          ).length;

          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterStatus === st
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Appointments Cards / Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">Customer Details</th>
                <th className="p-3">Service</th>
                <th className="p-3">Therapist</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Price</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    No appointments found matching filter.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-900">
                      {a.booking_id}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{a.customer_name}</div>
                      <div className="text-[11px] font-mono text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <span>+91 {a.mobile}</span>
                      </div>
                    </td>

                    <td className="p-3 font-medium text-stone-900">{a.service_name}</td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800">{a.therapist_name}</span>
                        <button
                          onClick={() => setReassigningAppointment(a)}
                          className="text-[10px] text-emerald-800 underline font-bold cursor-pointer"
                        >
                          Reassign
                        </button>
                      </div>
                    </td>

                    <td className="p-3 text-stone-600">
                      <div>{a.date}</div>
                      <div className="text-[10px] text-stone-400 font-medium">{a.time}</div>
                    </td>

                    <td className="p-3">
                      <select
                        value={
                          a.appointment_status === 'Appointment Requested'
                            ? 'PENDING CONFIRMATION'
                            : a.appointment_status === 'Appointment Confirmed'
                            ? 'CONFIRMED'
                            : a.appointment_status === 'Completed'
                            ? 'COMPLETED'
                            : a.appointment_status === 'Cancelled'
                            ? 'CANCELLED'
                            : a.appointment_status
                        }
                        onChange={(e) =>
                          handleStatusChange(a.id, e.target.value as AppointmentStatus)
                        }
                        className={`text-[11px] font-bold p-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                          a.appointment_status === 'PENDING CONFIRMATION' || a.appointment_status === 'Appointment Requested'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : a.appointment_status === 'CONFIRMED' || a.appointment_status === 'Appointment Confirmed'
                            ? 'bg-teal-50 text-teal-900 border-teal-300'
                            : a.appointment_status === 'COMPLETED' || a.appointment_status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : a.appointment_status === 'CANCELLED' || a.appointment_status === 'Cancelled'
                            ? 'bg-red-50 text-red-900 border-red-300'
                            : 'bg-white text-stone-900 border-stone-200'
                        }`}
                      >
                        {allStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3 font-serif font-black text-stone-900">
                      ₹{a.price}
                    </td>

                    {/* Action Buttons: CONFIRM, CALL, WHATSAPP, CANCEL */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* CONFIRM button if pending */}
                        {(a.appointment_status === 'PENDING CONFIRMATION' || a.appointment_status === 'Appointment Requested') && (
                          <button
                            onClick={() => handleConfirm(a)}
                            className="py-1 px-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                            title="Confirm Booking"
                          >
                            <Check className="w-3 h-3 text-amber-300" />
                            <span>CONFIRM</span>
                          </button>
                        )}

                        {/* CALL */}
                        <a
                          href={getPhoneCallUrl(a.mobile)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-800" />
                        </a>

                        {/* WHATSAPP */}
                        <button
                          onClick={() => handleWhatsAppCustomer(a)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 cursor-pointer"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-emerald-700" />
                        </button>

                        {/* DETAILS */}
                        <button
                          onClick={() => setSelectedAppointmentForDetails(a)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* CANCEL */}
                        {a.appointment_status !== 'CANCELLED' && a.appointment_status !== 'Cancelled' && (
                          <button
                            onClick={() => setShowCancelModal(a)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Therapist Modal */}
      {reassigningAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
          <div className="bg-stone-50 rounded-3xl max-w-sm w-full p-6 space-y-4 border border-stone-200">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Assign Therapist for {reassigningAppointment.booking_id}
            </h3>
            <p className="text-xs text-stone-500">
              Selected service: {reassigningAppointment.service_name}
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {therapists.map((th) => (
                <button
                  key={th.id}
                  onClick={() => handleReassignTherapist(th.id)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between cursor-pointer ${
                    reassigningAppointment.therapist_id === th.id
                      ? 'border-emerald-800 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <div>
                    <div>{th.name}</div>
                    <div className="text-[10px] text-stone-400 font-normal">{th.experience}</div>
                  </div>
                  <span className="text-[10px] text-amber-600 font-bold">⭐ {th.rating}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setReassigningAppointment(null)}
              className="w-full py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
          <div className="bg-stone-50 rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="font-serif text-base font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Cancel Appointment {showCancelModal.booking_id}</span>
            </h3>
            <p className="text-xs text-stone-600">
              Please provide the reason for cancellation. The slot will be marked as Cancelled and client notified.
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(null)}
                className="flex-1 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Details Modal */}
      {selectedAppointmentForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
          <div className="bg-stone-50 rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="font-mono text-sm font-bold text-emerald-900">
                Booking ID: {selectedAppointmentForDetails.booking_id}
              </span>
              <button
                onClick={() => setSelectedAppointmentForDetails(null)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div><strong>Customer Name:</strong> {selectedAppointmentForDetails.customer_name}</div>
              <div><strong>Mobile:</strong> +91 {selectedAppointmentForDetails.mobile}</div>
              {selectedAppointmentForDetails.email && (
                <div><strong>Email:</strong> {selectedAppointmentForDetails.email}</div>
              )}
              <div><strong>Service:</strong> {selectedAppointmentForDetails.service_name}</div>
              <div><strong>Therapist:</strong> {selectedAppointmentForDetails.therapist_name}</div>
              <div><strong>Date:</strong> {selectedAppointmentForDetails.date}</div>
              <div><strong>Time:</strong> {selectedAppointmentForDetails.time}</div>
              <div><strong>Duration:</strong> {selectedAppointmentForDetails.duration}</div>
              <div><strong>Price:</strong> ₹{selectedAppointmentForDetails.price}</div>
              <div><strong>Status:</strong> {selectedAppointmentForDetails.appointment_status}</div>
              <div><strong>Created At:</strong> {new Date(selectedAppointmentForDetails.created_at).toLocaleString('en-IN')}</div>
              {selectedAppointmentForDetails.notes && (
                <div><strong>Customer Notes:</strong> "{selectedAppointmentForDetails.notes}"</div>
              )}
              {selectedAppointmentForDetails.cancellation_reason && (
                <div className="text-red-700"><strong>Cancellation Reason:</strong> {selectedAppointmentForDetails.cancellation_reason}</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => handleWhatsAppCustomer(selectedAppointmentForDetails)}
                className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-700" />
                <span>WhatsApp Guest</span>
              </button>
              <a
                href={getPhoneCallUrl(selectedAppointmentForDetails.mobile)}
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-center"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-800" />
                <span>Call Guest</span>
              </a>
            </div>

            <button
              onClick={() => setSelectedAppointmentForDetails(null)}
              className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
