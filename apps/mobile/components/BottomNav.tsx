import React from 'react';
import { Home, PlusSquare, ShoppingBag, User, LayoutList } from 'lucide-react';
import { AppScreen, Language } from '../types.ts';
import { TRANSLATIONS } from '../constants.tsx';

interface BottomNavProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  lang: Language;
}

export default function BottomNav({ activeScreen, onNavigate, lang }: BottomNavProps) {
  const t = TRANSLATIONS[lang === Language.ENGLISH ? 'en' : 'mr'];

  const navItems = [
    { id: 'HOME'     as AppScreen, label: t.home,     icon: Home        },
    { id: 'SELL'     as AppScreen, label: t.sell,     icon: PlusSquare  },
    { id: 'LISTINGS' as AppScreen, label: t.listings, icon: LayoutList  },
    { id: 'ORDERS'   as AppScreen, label: t.orders,   icon: ShoppingBag },
    { id: 'PROFILE'  as AppScreen, label: t.profile,  icon: User        },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 nav-blur pb-safe border-t border-[rgba(245,240,232,0.06)]"
      style={{ background: 'rgba(10,26,10,0.92)' }}
    >
      <div className="flex justify-around items-center px-2 pt-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeScreen === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center gap-1 flex-1 py-2 transition-all active:scale-90"
            >
              {/* Active indicator pill */}
              <div
                className={`flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300 ${
                  active
                    ? 'bg-[rgba(212,196,160,0.15)]'
                    : 'bg-transparent'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 1.75 : 1.5}
                  className={`transition-colors duration-300 ${
                    active ? 'text-[#D4C4A0]' : 'text-[rgba(245,240,232,0.35)]'
                  }`}
                />
              </div>
              <span
                className={`transition-colors duration-300 ${
                  active
                    ? 'text-[#D4C4A0]'
                    : 'text-[rgba(245,240,232,0.35)]'
                }`}
                style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
