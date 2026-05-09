import React from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { Language } from '../types.ts';

interface LangOption {
  code: Language;
  native: string;
  english: string;
}

const LANG_OPTIONS: LangOption[] = [
  { code: Language.ENGLISH,   native: 'English',   english: 'English'   },
  { code: Language.HINDI,     native: 'हिंदी',      english: 'Hindi'     },
  { code: Language.BENGALI,   native: 'বাংলা',     english: 'Bengali'   },
  { code: Language.MARATHI,   native: 'मराठी',     english: 'Marathi'   },
  { code: Language.TELUGU,    native: 'తెలుగు',    english: 'Telugu'    },
  { code: Language.TAMIL,     native: 'தமிழ்',     english: 'Tamil'     },
  { code: Language.GUJARATI,  native: 'ગુજરાતી',   english: 'Gujarati'  },
  { code: Language.KANNADA,   native: 'ಕನ್ನಡ',    english: 'Kannada'   },
  { code: Language.ODIA,      native: 'ଓଡ଼ିଆ',    english: 'Odia'      },
  { code: Language.PUNJABI,   native: 'ਪੰਜਾਬੀ',   english: 'Punjabi'   },
  { code: Language.MALAYALAM, native: 'മലയാളം',   english: 'Malayalam' },
];

interface LanguagePickerProps {
  open: boolean;
  current: Language;
  onSelect: (lang: Language) => void;
  onClose: () => void;
}

export default function LanguagePicker({ open, current, onSelect, onClose }: LanguagePickerProps) {
  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Click-away backdrop — light blur, doesn't feel like a modal */}
          <motion.div
            key="lp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(5, 13, 5, 0.35)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 200,
            }}
          />

          {/* Dropdown — anchored below the header, top-right */}
          <motion.div
            key="lp-dropdown"
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.15, ease: [0.32, 0, 0.16, 1] as const }}
            style={{
              position: 'fixed',
              top: 'calc(56px + env(safe-area-inset-top, 0px) + 6px)',
              right: 12,
              zIndex: 201,
              width: 218,
              maxHeight: '62vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 18,
              overflow: 'hidden',
              background: 'rgba(12, 24, 12, 0.84)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(245,240,232,0.10)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 0.5px rgba(245,240,232,0.05)',
              transformOrigin: 'top right',
            }}
          >
            {/* Title row */}
            <div style={{
              padding: '13px 16px 11px',
              borderBottom: '1px solid rgba(245,240,232,0.07)',
              flexShrink: 0,
            }}>
              <p style={{
                fontSize: 13, fontWeight: 700, color: '#F5F0E8',
                letterSpacing: '-0.01em', lineHeight: 1.2,
              }}>
                भाषा <span style={{ color: 'rgba(245,240,232,0.28)', fontWeight: 300 }}>·</span> Language
              </p>
              <p style={{
                fontSize: 10, color: 'rgba(245,240,232,0.35)',
                marginTop: 2, letterSpacing: '0.03em',
              }}>
                Scroll to browse all languages
              </p>
            </div>

            {/* Scrollable language list */}
            <div style={{
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
              scrollbarWidth: 'none',
              flex: 1,
              padding: '5px 0 6px',
            }}>
              {LANG_OPTIONS.map((lang) => {
                const active = current === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => { onSelect(lang.code); onClose(); }}
                    aria-label={`${lang.english} — ${lang.native}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '9px 16px',
                      background: active ? 'rgba(232,200,74,0.07)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'rgba(45,90,27,0.15)',
                      transition: 'background 0.1s',
                    }}
                  >
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <span style={{
                        display: 'block',
                        fontSize: 16,
                        fontWeight: 600,
                        color: active ? '#E8C84A' : '#F5F0E8',
                        lineHeight: 1.3,
                        fontFamily: "'Noto Sans Devanagari', 'Noto Sans', system-ui, sans-serif",
                      }}>
                        {lang.native}
                      </span>
                      <span style={{
                        display: 'block',
                        fontSize: 10,
                        fontWeight: 500,
                        color: active ? 'rgba(232,200,74,0.55)' : 'rgba(245,240,232,0.30)',
                        marginTop: 1,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}>
                        {lang.english}
                      </span>
                    </div>

                    {active && (
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: '#E8C84A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 0 8px rgba(232,200,74,0.45)',
                      }}>
                        <Check size={10} strokeWidth={3} color="#0A1A0A" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
