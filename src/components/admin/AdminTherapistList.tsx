import React, { useState } from 'react';
import {
  UserPlus,
  Edit2,
  Trash2,
  Star,
  Clock,
  Calendar,
  X,
  Search,
  CheckCircle
} from 'lucide-react';
import { Therapist } from '../../types';
import {
  addTherapist,
  updateTherapist,
  deleteTherapist
} from '../../services/storageService';

interface AdminTherapistListProps {
  therapists: Therapist[];
  onRefresh: () => void;
}

export const AdminTherapistList: React.FC<AdminTherapistListProps> = ({
  therapists,
  onRefresh
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [experience, setExperience] = useState('5 Years Experience');
  const [specializationsInput, setSpecializationsInput] = useState('Swedish Massage, Aromatherapy');
  const [availableDaysInput, setAvailableDaysInput] = useState('Mon, Tue, Wed, Thu, Fri, Sat');
  const [availableTime, setAvailableTime] = useState('9:00 AM – 8:00 PM');
  const [availability, setAvailability] = useState<'Available' | 'Busy' | 'Off Duty'>('Available');
  const [bio, setBio] = useState('');
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingTherapist(null);
    setName('');
    setPhoto('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300');
    setExperience('5 Years Experience');
    setSpecializationsInput('Swedish Massage, Aromatherapy Massage');
    setAvailableDaysInput('Mon, Tue, Wed, Thu, Fri, Sat');
    setAvailableTime('9:00 AM – 8:00 PM');
    setAvailability('Available');
    setBio('Certified spa and massage practitioner dedicated to restorative holistic wellness.');
    setActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (th: Therapist) => {
    setEditingTherapist(th);
    setName(th.name);
    setPhoto(th.photo);
    setExperience(th.experience);
    setSpecializationsInput(th.specializations.join(', '));
    setAvailableDaysInput(th.available_days.join(', '));
    setAvailableTime(th.available_time);
    setAvailability(th.availability);
    setBio(th.bio);
    setActive(th.active);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this therapist profile?')) {
      deleteTherapist(id);
      onRefresh();
    }
  };

  const handleToggleActive = (th: Therapist) => {
    updateTherapist({
      ...th,
      active: !th.active
    });
    onRefresh();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specializations = specializationsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const available_days = availableDaysInput
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    if (editingTherapist) {
      updateTherapist({
        ...editingTherapist,
        name: name.trim(),
        photo: photo.trim() || editingTherapist.photo,
        experience: experience.trim(),
        specializations,
        available_days,
        available_time: availableTime.trim(),
        availability,
        bio: bio.trim(),
        active
      });
    } else {
      addTherapist({
        name: name.trim(),
        photo: photo.trim() || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
        experience: experience.trim(),
        specializations,
        available_days,
        available_time: availableTime.trim(),
        availability,
        bio: bio.trim(),
        active
      });
    }

    setShowModal(false);
    onRefresh();
  };

  const filtered = therapists.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Therapist Staff & Availability
          </h2>
          <p className="text-xs text-stone-500">
            Manage certified spa practitioners, schedules, and reviews ({therapists.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search therapist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="py-2 px-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Therapist</span>
          </button>
        </div>
      </div>

      {/* Therapists Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((th) => (
          <div
            key={th.id}
            className={`bg-white rounded-3xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
              th.active ? 'border-stone-200' : 'border-stone-200 bg-stone-100/70 opacity-70'
            }`}
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-amber-200 shrink-0">
                    <img src={th.photo} alt={th.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base">{th.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                      <span className="flex items-center text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                        {th.rating}
                      </span>
                      <span>·</span>
                      <span>{th.experience}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      th.availability === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : th.availability === 'Busy'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {th.availability}
                  </span>
                  <button
                    onClick={() => handleToggleActive(th)}
                    className="text-[10px] font-semibold text-stone-500 hover:text-stone-800 underline cursor-pointer"
                  >
                    {th.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Bio & Details */}
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-2 font-sans">
                {th.bio}
              </p>

              <div className="space-y-1 text-xs text-stone-600 py-2 border-y border-stone-100">
                <div>
                  <span className="text-stone-400">Specializations: </span>
                  <span className="font-semibold text-stone-800">
                    {th.specializations.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{th.available_time}</span>
                  <span>·</span>
                  <span>{th.available_days.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-3 pt-2 flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-medium">
                Sessions: <strong className="text-stone-800">{th.total_sessions}</strong>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(th)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                  title="Edit Therapist"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(th.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                  title="Delete Therapist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
          <div className="bg-stone-50 rounded-3xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif text-base font-bold text-stone-900">
                {editingTherapist ? 'Edit Therapist Profile' : 'Add New Certified Therapist'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nomi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 Years Experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Specializations (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Swedish Massage, Aromatherapy Massage"
                  value={specializationsInput}
                  onChange={(e) => setSpecializationsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Daily Hours
                  </label>
                  <input
                    type="text"
                    value={availableTime}
                    onChange={(e) => setAvailableTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Availability Status
                  </label>
                  <select
                    value={availability}
                    onChange={(e) =>
                      setAvailability(e.target.value as 'Available' | 'Busy' | 'Off Duty')
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Available Days (comma separated)
                </label>
                <input
                  type="text"
                  value={availableDaysInput}
                  onChange={(e) => setAvailableDaysInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                />
              </div>

              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-800"
                  />
                  <span>Active in Customer Booking App</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
