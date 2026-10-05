import React, { useState } from 'react';
import { User, Phone, Mail, Flower2, CheckCircle, ArrowRight, X } from 'lucide-react';
import { loginCustomer, DEFAULT_CUSTOMER } from '../../services/storageService';
import { User as UserType } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  onSwitchToAdmin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToAdmin
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setShowOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginCustomer(name, mobile, email);
    onLoginSuccess(user);
    onClose();
  };

  const handleQuickDemoLogin = () => {
    const user = loginCustomer('Guest User', '9876543210', 'guest@relaxcare.com');
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-stone-50 rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex p-2.5 rounded-2xl bg-amber-400/20 border border-amber-300/30 text-amber-300 mb-2">
            <Flower2 className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">RelaxCare</h2>
          <p className="text-amber-100/80 text-xs font-serif italic mt-0.5">
            “Relax. Refresh. Rejuvenate.”
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {!showOtpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex">
                  <div className="flex items-center justify-center px-3 bg-stone-100 border border-r-0 border-stone-200 rounded-l-xl text-sm font-semibold text-stone-600">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all font-mono text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    placeholder="e.g. guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all text-stone-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-amber-900 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>One-Click Guest Demo Login</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Enter Verification Code</h3>
                <p className="text-xs text-stone-500 mt-1">
                  We sent a 4-digit demo passcode to <span className="font-semibold text-stone-800">+91 {mobile}</span>
                </p>
                <div className="mt-2 inline-block px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
                  Demo Code: Any 4 digits (e.g. 1234)
                </div>
              </div>

              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={otp[idx] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = [...otp];
                      next[idx] = val;
                      setOtp(next);
                      if (val && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement).focus();
                      }
                    }}
                    className="w-12 h-12 text-center text-lg font-bold border-2 border-stone-200 rounded-xl focus:border-emerald-700 focus:outline-none bg-white font-mono text-stone-800"
                  />
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer"
                >
                  Verify & Enter Sanctuary
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpStep(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  Change mobile number
                </button>
              </div>
            </form>
          )}

          {/* Switch to Admin portal */}
          <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Spa Staff & Director?</span>
            <button
              onClick={() => {
                onClose();
                onSwitchToAdmin();
              }}
              className="text-emerald-800 hover:text-emerald-900 font-bold cursor-pointer underline"
            >
              Admin Dashboard Portal →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
