import React, { useState } from 'react';
import {
  Edit3,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  X,
  Star
} from 'lucide-react';
import { Service, ServiceCategory } from '../../types';
import { updateService, deleteService } from '../../services/storageService';
import { SpaArtwork } from '../common/SpaArtwork';

interface AdminServiceListProps {
  services: Service[];
  onRefresh: () => void;
}

export const AdminServiceList: React.FC<AdminServiceListProps> = ({
  services,
  onRefresh
}) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Massage Services');
  const [duration, setDuration] = useState('60 Minutes');
  const [price, setPrice] = useState<number>(999);
  const [benefitsInput, setBenefitsInput] = useState('Deep relaxation, Stress relief, Muscle comfort');
  const [includesInput, setIncludesInput] = useState('Organic oil consultation, Warm herbal towel compress');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setDescription('A holistic restorative session designed to rejuvenate body and mind.');
    setCategory('Massage Services');
    setDuration('60 Minutes');
    setPrice(999);
    setBenefitsInput('Deep relaxation, Stress relief, Muscle comfort, Restored vitality');
    setIncludesInput('Aromatic oil selection, Targeted massage strokes, Warm herbal towel compress');
    setActive(true);
    setFeatured(false);
    setShowModal(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setDescription(s.description);
    setCategory(s.category);
    setDuration(s.duration);
    setPrice(s.price);
    setBenefitsInput(s.benefits.join(', '));
    setIncludesInput(s.includes.join(', '));
    setActive(s.active);
    setFeatured(!!s.featured);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this service from the menu?')) {
      deleteService(id);
      onRefresh();
    }
  };

  const handleToggleActive = (s: Service) => {
    updateService({
      ...s,
      active: !s.active
    });
    onRefresh();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const benefits = benefitsInput.split(',').map((b) => b.trim()).filter(Boolean);
    const includes = includesInput.split(',').map((i) => i.trim()).filter(Boolean);

    if (editingService) {
      updateService({
        ...editingService,
        name: name.trim(),
        description: description.trim(),
        category,
        duration: duration.trim(),
        price: Number(price),
        benefits,
        includes,
        active,
        featured
      });
    } else {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newService: Service = {
        id: `srv-${Date.now()}`,
        slug,
        name: name.trim(),
        description: description.trim(),
        category,
        duration: duration.trim(),
        price: Number(price),
        benefits,
        includes,
        rating: 4.9,
        reviews_count: 50,
        active,
        featured,
        theme_gradient: 'from-emerald-900 to-stone-900',
        accent_color: 'emerald'
      };
      updateService(newService);
    }

    setShowModal(false);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Spa Menu & Pricing Configuration
          </h2>
          <p className="text-xs text-stone-500">
            Edit service prices, descriptions, durations, and visibility dynamically without code updates
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2 px-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="p-3">Treatment</th>
                <th className="p-3">Category</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Customer Price</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-3">
                    <div className="font-serif font-bold text-stone-900 text-sm">
                      {s.name}
                      {s.featured && (
                        <span className="ml-2 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200 font-sans font-semibold">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400 line-clamp-1 mt-0.5 font-sans">
                      {s.description}
                    </div>
                  </td>

                  <td className="p-3 text-stone-600 font-medium">{s.category}</td>

                  <td className="p-3 text-stone-600 font-mono">{s.duration}</td>

                  <td className="p-3 font-serif font-black text-stone-900 text-sm">
                    ₹{s.price}
                  </td>

                  <td className="p-3 text-stone-700">
                    <div className="flex items-center gap-1 font-bold">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{s.rating}</span>
                      <span className="text-[10px] text-stone-400 font-normal">({s.reviews_count})</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleToggleActive(s)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                        s.active
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}
                    >
                      {s.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                        title="Edit Price & Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
          <div className="bg-stone-50 rounded-3xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif text-base font-bold text-stone-900">
                {editingService ? `Edit ${editingService.name}` : 'Add New Spa Treatment'}
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
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swedish Massage"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={299}
                    step={50}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700 font-serif font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="60 Minutes"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Massage Services">Massage Services</option>
                  <option value="Spa & Wellness">Spa & Wellness</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Benefits (comma separated)
                </label>
                <input
                  type="text"
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  What's Included (comma separated)
                </label>
                <input
                  type="text"
                  value={includesInput}
                  onChange={(e) => setIncludesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-800"
                  />
                  <span>Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>Featured on Home</span>
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
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
