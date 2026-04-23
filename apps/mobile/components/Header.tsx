import React, { useState, useEffect } from 'react';
import { Languages, Bell } from 'lucide-react';
import { Language } from '../types.ts';
import Logo from './Logo.tsx';
import CartBadge from './atoms/CartBadge.tsx';

interface HeaderProps {
  location: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAssistant: () => void;
  onOpenCart: () => void;
  scrollParent?: React.RefObject<HTMLDivElement>;
}

export default function Header({
  location,
  language,
  onLanguageChange,
  onOpenCart,
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

        {/* ── Logo ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-0.5">
          <Logo height={30} />
          {location && location !== 'Detecting...' && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: 'rgba(212,196,160,0.9)',
                textTransform: 'uppercase',
                paddingLeft: '2px',
              }}
            >
              {location}
            </span>
          )}
        </div>

        {/* ── Right controls ───────────────────────────────────── */}
        <div className="flex items-center gap-1.5">
          {/* Language toggle */}
          <button
            onClick={() => onLanguageChange(
              language === Language.ENGLISH ? Language.MARATHI : Language.ENGLISH
            )}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border-2 border-[rgba(245,240,232,0.4)] text-[rgba(245,240,232,0.9)] hover:text-[#F5F0E8] transition-all active:scale-95"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(45,90,27,0.2)' }}
          >
            <Languages size={14} />
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>
              {language === Language.ENGLISH ? 'मराठी' : 'ENG'}
            </span>
          </button>

          {/* Cart badge */}
          <CartBadge onOpen={onOpenCart} />

          {/* Notification bell */}
          <button
            className="relative w-8 h-8 flex items-center justify-center rounded-full border border-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.55)] hover:text-[#F5F0E8] transition-all active:scale-90"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(45,90,27,0.2)' }}
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D4C4A0] rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
