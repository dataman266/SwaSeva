import React from 'react';
import { Home, PlusSquare, ShoppingBag, User, LayoutList, MessageSquare } from 'lucide-react';
import { AppScreen, Language } from '../types.ts';
import { TRANSLATIONS } from '../constants.tsx';

interface BottomNavProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  lang: Language;
  unreadMessages?: number;
}

export default function BottomNav({ activeScreen, onNavigate, lang, unreadMessages = 0 }: BottomNavProps) {
  const t = TRANSLATIONS[lang === Language.ENGLISH ? 'en' : 'mr'];

  const navItems = [
    { id: 'HOME'     as AppScreen, label: t.home,     icon: Home         },
    { id: 'SELL'     as AppScreen, label: t.sell,     icon: PlusSquare   },
    { id: 'LISTINGS' as AppScreen, label: t.listings,  icon: LayoutList   },
    { id: 'MESSAGES' as AppScreen, label: t.messages, icon: MessageSquare },
    { id: 'ORDERS'   as AppScreen, label: t.orders,   icon: ShoppingBag  },
    { id: 'PROFILE'  as AppScreen, label: t.profile,  icon: User          },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 nav-blur pb-safe border-t border-[rgba(245,240,232,0.12)]"
      style={{ background: 'rgba(10,26,10,0.96)' }}
    >
      <div className="flex justify-around items-center px-1 pt-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeScreen === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center gap-1.5 flex-1 py-2.5 transition-all active:scale-90"
              style={{ touchAction: 'manipulation', minHeight: 56 }}
            >
              {/* Active indicator pill */}
              <div className="relative">
                <div
                  className={`flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ${
                    active ? 'bg-[rgba(212,196,160,0.18)]' : 'bg-transparent'
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2 : 1.5}
                    className={`transition-colors duration-300 ${
                      active ? 'text-[#D4C4A0]' : 'text-[rgba(245,240,232,0.55)]'
                    }`}
                  />
                </div>
              </div>
              <span
                className={`transition-colors duration-300 ${
                  active ? 'text-[#D4C4A0] font-semibold' : 'text-[rgba(245,240,232,0.55)]'
                }`}
                style={{ fontSize: '11px', fontWeight: active ? 600 : 500, letterSpacing: '0.04em' }}
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
