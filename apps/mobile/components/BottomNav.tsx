
import React from 'react';
import { Home, PlusSquare, ShoppingBag, User } from 'lucide-react';
import { AppScreen, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface BottomNavProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  lang: Language;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate, lang }) => {
  const t = TRANSLATIONS[lang === Language.ENGLISH ? 'en' : 'mr'];

  const navItems = [
    { id: 'HOME', label: t.home, icon: Home },
    { id: 'ORDERS', label: t.orders, icon: ShoppingBag },
    { id: 'SELL', label: t.sell, icon: PlusSquare },
    { id: 'PROFILE', label: t.profile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0E1A0E]/95 backdrop-blur-xl border-t border-white/5 px-4 pt-3 pb-safe flex justify-around items-center z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as AppScreen)}
            className={`flex flex-col items-center gap-1 group transition-all duration-300 flex-1 min-w-0 py-2`}
          >
            {/* MD3 Active Indicator Pill */}
            <div className={`relative px-6 py-1 rounded-full transition-all duration-300 ${isActive ? 'bg-[#2D5A27] text-[#F59E0B]' : 'text-white/40 group-hover:bg-white/5'}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="transition-transform" />
            </div>
            <span className={`text-[10px] font-bold truncate max-w-full transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/40'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
