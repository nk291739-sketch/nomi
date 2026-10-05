import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, X, AlertCircle, Flower2 } from 'lucide-react';
import { ADMIN_USER, setCurrentUser } from '../../services/storageService';
import { User } from '../../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: (admin: User) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess
}) => {
  const [email, setEmail] = useState('admin@relaxcare.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email === 'admin@relaxcare.com' &&
      (password === 'admin123' || password === 'admin')
    ) {
      setCurrentUser(ADMIN_USER);
      onAdminLoginSuccess(ADMIN_USER);
      onClose();
    } else {
      setError('Invalid admin credentials. Use admin@relaxcare.com / admin123');
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@relaxcare.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex p-2.5 rounded-2xl bg-amber-400/20 border border-amber-300/30 text-amber-300 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold">RelaxCare Spa Admin</h2>
          <p className="text-amber-100/80 text-xs font-serif italic mt-0.5">
            Director & Scheduling Management Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none text-stone-800"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-amber-950 font-medium">Demo: admin@relaxcare.com / admin123</span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-emerald-800 font-bold hover:underline cursor-pointer"
            >
              Fill Demo
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>Log In to Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
