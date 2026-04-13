import React, { useState, useEffect } from 'react';
import { Languages, Bell } from 'lucide-react';
import { Language } from '../types.ts';

interface HeaderProps {
  location: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAssistant: () => void;
  scrollParent?: React.RefObject<HTMLDivElement>;
}

/**
 * Sticky top nav — FarmMinerals style.
 * Transitions from fully transparent → dark frosted glass
 * once the user scrolls past 60px.
 */
export default function Header({
  location,
  language,
  onLanguageChange,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 pt-safe transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(10,26,10,0.88)] nav-blur border-b border-[rgba(245,240,232,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-5 h-14">
        {/* Logo wordmark */}
        <div className="flex flex-col leading-none">
          <span
            className="font-light text-[#F5F0E8]"
            style={{ fontSize: '18px', letterSpacing: '-0.03em' }}
          >
            Apla
            <span style={{ color: '#D4C4A0' }}>.</span>
            AgriMart
          </span>
          {location && location !== 'Detecting...' && (
            <span
              className="font-medium text-[#D4C4A0] mt-0.5"
              style={{ fontSize: '9px', letterSpacing: '0.18em' }}
            >
              {location.toUpperCase()}
            </span>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          {/* Language toggle */}
          <button
            onClick={() => onLanguageChange(
              language === Language.ENGLISH ? Language.MARATHI : Language.ENGLISH
            )}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(245,240,232,0.15)] text-[rgba(245,240,232,0.65)] hover:text-[#F5F0E8] transition-all active:scale-95"
          >
            <Languages size={14} />
            <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em' }}>
              {language === Language.ENGLISH ? 'मराठी' : 'ENG'}
            </span>
          </button>

          {/* Notification bell */}
          <button className="relative w-8 h-8 flex items-center justify-center rounded-full border border-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.55)] hover:text-[#F5F0E8] transition-all active:scale-90">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D4C4A0] rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
