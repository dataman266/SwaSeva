import React, { useState, useEffect } from 'react';
import { Languages, Bell, ChevronDown } from 'lucide-react';
import { Language } from '../types.ts';
import Logo from './Logo.tsx';
import CartBadge from './atoms/CartBadge.tsx';
import LanguagePicker from './LanguagePicker.tsx';

const LANG_NAME: Record<Language, string> = {
  [Language.ENGLISH]:   'English',
  [Language.HINDI]:     'हिंदी',
  [Language.MARATHI]:   'मराठी',
  [Language.GUJARATI]:  'ગુજરાતી',
  [Language.TELUGU]:    'తెలుగు',
  [Language.TAMIL]:     'தமிழ்',
  [Language.PUNJABI]:   'ਪੰਜਾਬੀ',
  [Language.KANNADA]:   'ಕನ್ನಡ',
  [Language.BENGALI]:   'বাংলা',
  [Language.ODIA]:      'ଓଡ଼ିଆ',
  [Language.MALAYALAM]: 'മലയാളം',
};

interface HeaderProps {
  location: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAssistant: () => void;
  onOpenCart: () => void;
  onNavigateHome?: () => void;
  scrollParent?: React.RefObject<HTMLDivElement>;
}

export default function Header({
  language,
  onLanguageChange,
  onOpenCart,
  onNavigateHome,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 pt-safe transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(10,26,10,0.88)] nav-blur border-b border-[rgba(245,240,232,0.06)]'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14">

          {/* ── Logo — taps navigate to HOME with press ripple ─── */}
          <button
            onClick={onNavigateHome}
            className="active:scale-90 active:opacity-60 transition-all duration-150"
            style={{
              display: 'flex', alignItems: 'center',
              padding: '6px 4px', borderRadius: 12,
              touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
              background: 'transparent', border: 'none',
            }}
            aria-label="Go to Market"
          >
            <Logo height={30} />
          </button>

          {/* ── Right controls ───────────────────────────────────── */}
          <div className="flex items-center gap-1.5">
            {/* Language picker trigger */}
            <button
              onClick={() => setPickerOpen(true)}
              className="flex items-center gap-1 px-3 rounded-full border-2 border-[rgba(245,240,232,0.4)] text-[rgba(245,240,232,0.9)] hover:text-[#F5F0E8] transition-all active:scale-95"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(45,90,27,0.2)', minHeight: 44 }}
            >
              <Languages size={14} />
              <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>
                {LANG_NAME[language]}
              </span>
              <ChevronDown size={11} strokeWidth={2.5} style={{ opacity: 0.65 }} />
            </button>

            {/* Cart badge */}
            <CartBadge onOpen={onOpenCart} />

            {/* Notification bell */}
            <button
              className="relative w-11 h-11 flex items-center justify-center rounded-full border border-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.55)] hover:text-[#F5F0E8] transition-all active:scale-90"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(45,90,27,0.2)' }}
            >
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E8C84A] rounded-full" />
            </button>
          </div>
        </div>
      </header>

      <LanguagePicker
        open={pickerOpen}
        current={language}
        onSelect={(l) => { onLanguageChange(l); setPickerOpen(false); }}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}
