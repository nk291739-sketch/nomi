import React from 'react';
import { Sparkles, Calendar, Users, User, Flower2 } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'appointments' | 'therapists' | 'profile';
  onTabChange: (tab: 'home' | 'appointments' | 'therapists' | 'profile') => void;
  activeCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  activeCount
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-stone-50/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-colors cursor-pointer ${
            currentTab === 'home' ? 'text-emerald-900' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Flower2 className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.2]' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1 font-serif">Sanctuary</span>
        </button>

        <button
          onClick={() => onTabChange('appointments')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-colors cursor-pointer ${
            currentTab === 'appointments' ? 'text-emerald-900' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Calendar className={`w-5 h-5 ${currentTab === 'appointments' ? 'stroke-[2.2]' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1 font-serif">Bookings</span>
          {activeCount > 0 && (
            <span className="absolute top-1 right-5 w-4 h-4 bg-emerald-800 text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('therapists')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-colors cursor-pointer ${
            currentTab === 'therapists' ? 'text-emerald-900' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Users className={`w-5 h-5 ${currentTab === 'therapists' ? 'stroke-[2.2]' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1 font-serif">Therapists</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-colors cursor-pointer ${
            currentTab === 'profile' ? 'text-emerald-900' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.2]' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1 font-serif">Profile</span>
        </button>
      </div>
    </nav>
  );
};
