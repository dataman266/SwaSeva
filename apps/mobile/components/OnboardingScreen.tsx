import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, UserRole } from '../types.ts';
import PillButton from './atoms/PillButton.tsx';

interface Slide {
  eyebrow: string;
  eyebrowMr: string;
  headline: string;
  headlineMr: string;
  subtext: string;
  subtextMr: string;
  emoji: string;
  bg: string;
}

const SLIDES: Slide[] = [
  {
    eyebrow:    'Welcome to Swaseva',
    eyebrowMr:  'Swaseva मध्ये स्वागत',
    headline:   'The Farmers\' Market\nReimagined',
    headlineMr: 'शेतकऱ्यांचा बाजार\nनव्याने',
    subtext:    'Connect directly with verified farmers. Fresh produce, fair prices — no middlemen.',
    subtextMr:  'थेट शेतकऱ्यांशी जोडा. ताजे उत्पादन, उचित किंमत — कोणताही दलाल नाही.',
    emoji:      '🌾',
    bg:         'linear-gradient(160deg, #0D2E10 0%, #1A4A1A 50%, #0A1A0A 100%)',
  },
  {
    eyebrow:    'Verified Quality',
    eyebrowMr:  'प्रमाणित गुणवत्ता',
    headline:   'Every Product\nInspected',
    headlineMr: 'प्रत्येक उत्पादन\nतपासलेले',
    subtext:    'Our team verifies every farmer and batch. You buy with confidence every time.',
    subtextMr:  'आमची टीम प्रत्येक शेतकरी आणि बॅचची पडताळणी करते.',
    emoji:      '✅',
    bg:         'linear-gradient(160deg, #0D2818 0%, #1A4A30 50%, #0A1A0A 100%)',
  },
  {
    eyebrow:    'Grow Together',
    eyebrowMr:  'एकत्र वाढा',
    headline:   'Sell Directly\nEarn More',
    headlineMr: 'थेट विका\nजास्त कमवा',
    subtext:    'List your produce in minutes. Reach thousands of buyers across Maharashtra.',
    subtextMr:  'काही मिनिटांत तुमचा माल लिस्ट करा. महाराष्ट्रभर हजारो खरेदीदारांपर्यंत पोहोचा.',
    emoji:      '🤝',
    bg:         'linear-gradient(160deg, #1A1A0A 0%, #2E4A10 50%, #0A1A0A 100%)',
  },
];

const contentVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir * -40, opacity: 0 }),
};

const contentTransition = { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const };

interface OnboardingScreenProps {
  lang: Language;
  onComplete: (role: UserRole) => void;
}

export default function OnboardingScreen({ lang, onComplete }: OnboardingScreenProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const startXRef = useRef<number | null>(null);

  const isMr  = lang === Language.MARATHI;
  const slide  = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const finish = () => setShowRolePicker(true);

  const next = () => {
    if (isLast) { finish(); return; }
    setDirection(1);
    setCurrent(c => c + 1);
  };

  const prev = () => {
    if (current === 0) return;
    setDirection(-1);
    setCurrent(c => c - 1);
  };

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  const onTouchStart = (e: React.TouchEvent) => { startXRef.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - startXRef.current;
    if (dx < -50) next();
    else if (dx > 50) prev();
    startXRef.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
      style={{ background: '#0A1A0A' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Full-screen gradient background (crossfade per slide) ──── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          style={{ background: slide.bg }}
        />
      </AnimatePresence>

      {/* ── Skip button ───────────────────────────────────────────── */}
      {!isLast && (
        <button
          onClick={finish}
          className="absolute right-5 z-10 text-[rgba(245,240,232,0.4)] active:text-[rgba(245,240,232,0.7)] transition-colors"
          style={{ top: 'max(20px, env(safe-area-inset-top))', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
        >
          {isMr ? 'वगळा' : 'Skip'}
        </button>
      )}

      {/* ── Illustration panel (top 45%) ──────────────────────────── */}
      <div className="relative z-10 flex items-center justify-center" style={{ flex: '0 0 45%' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`ill-${current}`}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={contentTransition}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            {/* Outer decorative ring */}
            <div style={{
              width: 160, height: 160,
              borderRadius: '50%',
              background: 'rgba(245,240,232,0.04)',
              border: '1.5px solid rgba(245,240,232,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Inner glow ring */}
              <div style={{
                width: 120, height: 120,
                borderRadius: '50%',
                background: 'rgba(232,200,74,0.08)',
                border: '1.5px solid rgba(232,200,74,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 32px rgba(232,200,74,0.1)',
              }}>
                <span style={{ fontSize: 56, lineHeight: 1 }}>{slide.emoji}</span>
              </div>
            </div>
            {/* Step indicator dots on illustration */}
            <div style={{ display: 'flex', gap: 6 }}>
              {SLIDES.map((_, i) => (
                <div key={i} style={{
                  width: i === current ? 20 : 5, height: 5, borderRadius: 99,
                  background: i === current ? '#E8C84A' : 'rgba(245,240,232,0.2)',
                  transition: 'width 0.25s, background 0.25s',
                }} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Role picker (shown after slides) ─────────────────────── */}
      <AnimatePresence>
        {showRolePicker && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col justify-center px-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: '#0A1A0A' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-4 h-px bg-[#E8C84A]" />
              <span className="text-[#E8C84A] font-medium uppercase" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                {isMr ? 'तुम्ही कोण आहात?' : 'Who are you?'}
              </span>
            </div>
            <h2
              className="text-[#F5F0E8] font-light mb-8 whitespace-pre-line"
              style={{ fontSize: 'clamp(28px, 8vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
            >
              {isMr ? 'मी एक...' : 'I am a...'}
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => onComplete('farmer')}
                className="w-full text-left rounded-2xl p-5 active:scale-[0.98] transition-transform"
                style={{ background: 'rgba(45,90,27,0.25)', border: '1.5px solid rgba(74,140,42,0.35)' }}
              >
                <div className="text-3xl mb-2">🌾</div>
                <p className="text-[#F5F0E8] font-semibold" style={{ fontSize: '17px' }}>
                  {isMr ? 'शेतकरी' : 'Farmer'}
                </p>
                <p className="text-[rgba(245,240,232,0.5)] mt-0.5" style={{ fontSize: '13px' }}>
                  {isMr ? 'माझा शेतमाल विका आणि खरेदी करा' : 'Buy & sell farm produce directly'}
                </p>
              </button>

              <button
                onClick={() => onComplete('shopkeeper')}
                className="w-full text-left rounded-2xl active:scale-[0.98] transition-transform overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(45,90,27,0.35) 0%, rgba(76,175,80,0.12) 100%)',
                  border: '1.5px solid rgba(76,175,80,0.4)',
                  padding: 0,
                  position: 'relative',
                }}
              >
                {/* Green top bar — mirrors InventoryTab active indicator */}
                <div style={{
                  height: 3,
                  background: 'linear-gradient(90deg, #2D5A1B, #4CAF50)',
                  width: '100%',
                }} />
                <div style={{ padding: '16px 20px 20px' }}>
                  {/* Active badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div className="text-3xl">🏪</div>
                    <div style={{
                      background: 'rgba(76,175,80,0.15)',
                      border: '1px solid rgba(76,175,80,0.4)',
                      borderRadius: 99,
                      padding: '2px 10px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#4CAF50',
                      letterSpacing: '0.06em',
                    }}>
                      ● ACTIVE
                    </div>
                  </div>
                  <p className="text-[#F5F0E8] font-semibold" style={{ fontSize: '17px' }}>
                    {isMr ? 'दुकानदार' : 'Shopkeeper (Dukandaar)'}
                  </p>
                  <p style={{ color: 'rgba(76,175,80,0.75)', marginTop: 2, fontSize: '13px' }}>
                    {isMr ? 'माझी दुकान पोर्टल चालवा' : 'Run my shop portal & manage orders'}
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Text content (bottom 55%) ──────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col justify-between flex-1 px-6 pb-10 pt-2"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(10,26,10,0.9) 20%, #0A1A0A 50%)' }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={contentTransition}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-4 h-px bg-[#E8C84A]" />
              <span
                className="text-[#E8C84A] font-medium uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.2em' }}
              >
                {isMr ? slide.eyebrowMr : slide.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-[#F5F0E8] font-light mb-4 whitespace-pre-line"
              style={{ fontSize: 'clamp(30px, 9vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              {isMr ? slide.headlineMr : slide.headline}
            </h1>

            {/* Subtext */}
            <p
              className="font-light leading-relaxed text-[rgba(245,240,232,0.55)] max-w-sm"
              style={{ fontSize: '14px' }}
            >
              {isMr ? slide.subtextMr : slide.subtext}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div style={{ marginTop: '2rem' }}>
          <PillButton variant="light" fullWidth size="lg" onClick={isLast ? finish : next}>
            {isLast ? (isMr ? 'सुरू करा' : 'Get Started') : (isMr ? 'पुढे' : 'Continue')}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
