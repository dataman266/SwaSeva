import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Check } from 'lucide-react';
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
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ──────────────────────────────────────── */}
          <motion.div
            key="lp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(5, 13, 5, 0.80)',
              backdropFilter: 'blur(7px)',
              WebkitBackdropFilter: 'blur(7px)',
              zIndex: 200,
            }}
          />

          {/* ── Bottom sheet ──────────────────────────────────── */}
          <motion.div
            key="lp-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 340, mass: 0.85 }}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              zIndex: 201,
              background: 'linear-gradient(180deg, #0F1F0F 0%, #0A1A0A 100%)',
              borderTop: '1px solid rgba(232,200,74,0.18)',
              borderRadius: '22px 22px 0 0',
              paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
            }}
          >
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 2 }}>
              <div style={{
                width: 40, height: 4,
                background: 'rgba(245,240,232,0.13)',
                borderRadius: 2,
              }} />
            </div>

            {/* Header row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px 12px',
            }}>
              <div>
                <p style={{
                  fontSize: 19, fontWeight: 700, color: '#F5F0E8',
                  letterSpacing: '-0.025em', lineHeight: 1.25,
                }}>
                  भाषा{' '}
                  <span style={{ color: 'rgba(245,240,232,0.28)', fontWeight: 300 }}>·</span>{' '}
                  Language
                </p>
                <p style={{
                  fontSize: 11, color: 'rgba(245,240,232,0.38)',
                  marginTop: 3, fontWeight: 400, letterSpacing: '0.02em',
                }}>
                  Select your preferred language
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close language picker"
                style={{
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  background: 'rgba(245,240,232,0.06)',
                  border: '1px solid rgba(245,240,232,0.10)',
                  color: 'rgba(245,240,232,0.55)',
                  cursor: 'pointer', touchAction: 'manipulation',
                  flexShrink: 0,
                }}
              >
                <X size={15} strokeWidth={2} />
              </button>
            </div>

            {/* Gold fade divider */}
            <div style={{
              height: 1, margin: '0 20px',
              background: 'linear-gradient(90deg, rgba(232,200,74,0) 0%, rgba(232,200,74,0.32) 35%, rgba(232,200,74,0.32) 65%, rgba(232,200,74,0) 100%)',
            }} />

            {/* 3-column language grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              padding: '14px 14px 10px',
            }}>
              {LANG_OPTIONS.map((lang, i) => {
                const active = current === lang.code;
                return (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.025, duration: 0.18, ease: 'easeOut' }}
                    onClick={() => { onSelect(lang.code); onClose(); }}
                    whileTap={{ scale: 0.93 }}
                    aria-label={`${lang.english} language`}
                    style={{
                      position: 'relative',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      padding: '14px 6px 12px',
                      borderRadius: 14,
                      border: active
                        ? '1.5px solid rgba(232,200,74,0.55)'
                        : '1.5px solid rgba(245,240,232,0.07)',
                      background: active
                        ? 'linear-gradient(135deg, rgba(232,200,74,0.10) 0%, rgba(45,90,27,0.15) 100%)'
                        : 'rgba(245,240,232,0.025)',
                      cursor: 'pointer', touchAction: 'manipulation',
                      minHeight: 76,
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    {/* Active checkmark badge */}
                    {active && (
                      <div style={{
                        position: 'absolute', top: 7, right: 7,
                        width: 17, height: 17, borderRadius: '50%',
                        background: '#E8C84A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 8px rgba(232,200,74,0.5)',
                      }}>
                        <Check size={10} strokeWidth={3} color="#0A1A0A" />
                      </div>
                    )}

                    {/* Native script name */}
                    <span style={{
                      fontSize: 19,
                      fontWeight: 700,
                      color: active ? '#E8C84A' : '#F5F0E8',
                      lineHeight: 1.2,
                      fontFamily: "'Noto Sans Devanagari', 'Noto Sans', system-ui, sans-serif",
                      textAlign: 'center',
                    }}>
                      {lang.native}
                    </span>

                    {/* English label */}
                    <span style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: active ? 'rgba(232,200,74,0.65)' : 'rgba(245,240,232,0.35)',
                      marginTop: 5,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>
                      {lang.english}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer note */}
            <p style={{
              textAlign: 'center', fontSize: 10,
              color: 'rgba(245,240,232,0.20)', fontWeight: 400,
              padding: '4px 20px 12px',
              letterSpacing: '0.05em',
            }}>
              Swaseva · Pan-India Agri Marketplace
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
