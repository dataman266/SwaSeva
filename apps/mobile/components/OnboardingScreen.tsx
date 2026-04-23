import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types.ts';
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
  image: string;
}

const SLIDES: Slide[] = [
  {
    eyebrow:    'Welcome to AgriMart',
    eyebrowMr:  'AgriMart मध्ये स्वागत',
    headline:   'The Farmers\' Market\nReimagined',
    headlineMr: 'शेतकऱ्यांचा बाजार\nनव्याने',
    subtext:    'Connect directly with verified farmers. Fresh produce, fair prices — no middlemen.',
    subtextMr:  'थेट शेतकऱ्यांशी जोडा. ताजे उत्पादन, उचित किंमत — कोणताही दलाल नाही.',
    emoji:      '🌾',
    bg:         '#2E7D32',
    image:      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
  },
  {
    eyebrow:    'Verified Quality',
    eyebrowMr:  'प्रमाणित गुणवत्ता',
    headline:   'Every Product\nInspected',
    headlineMr: 'प्रत्येक उत्पादन\nतपासलेले',
    subtext:    'Our team verifies every farmer and batch. You buy with confidence every time.',
    subtextMr:  'आमची टीम प्रत्येक शेतकरी आणि बॅचची पडताळणी करते.',
    emoji:      '✅',
    bg:         '#4CAF50',
    image:      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    eyebrow:    'Grow Together',
    eyebrowMr:  'एकत्र वाढा',
    headline:   'Sell Directly\nEarn More',
    headlineMr: 'थेट विका\nजास्त कमवा',
    subtext:    'List your produce in minutes. Reach thousands of buyers across Maharashtra.',
    subtextMr:  'काही मिनिटांत तुमचा माल लिस्ट करा. महाराष्ट्रभर हजारो खरेदीदारांपर्यंत पोहोचा.',
    emoji:      '🤝',
    bg:         '#1E3A1E',
    image:      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop',
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
  onComplete: () => void;
}

export default function OnboardingScreen({ lang, onComplete }: OnboardingScreenProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const startXRef = useRef<number | null>(null);

  const isMr  = lang === Language.MARATHI;
  const slide  = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const next = () => {
    if (isLast) { onComplete(); return; }
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
      {/* ── Background image (crossfade) ──────────────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65 }}
        >
          <img
            src={slide.image}
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) saturate(0.7)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A0A] via-[rgba(10,26,10,0.6)] to-[rgba(10,26,10,0.25)]" />
        </motion.div>
      </AnimatePresence>

      {/* ── Accent glow (animates colour independently) ───────────── */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[40vh] opacity-20 pointer-events-none"
        animate={{ background: slide.bg }}
        transition={{ duration: 0.6 }}
        style={{ filter: 'blur(80px)' }}
      />

      {/* ── Skip button ───────────────────────────────────────────── */}
      {!isLast && (
        <button
          onClick={onComplete}
          className="absolute top-safe right-5 mt-5 z-10 text-[rgba(245,240,232,0.4)] hover:text-[rgba(245,240,232,0.65)] transition-colors"
          style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em' }}
        >
          {isMr ? 'वगळा' : 'Skip'}
        </button>
      )}

      {/* ── Slide content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-end flex-1 px-6 pb-14">
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
            {/* Emoji */}
            <div className="text-6xl mb-8">{slide.emoji}</div>

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
              style={{ fontSize: 'clamp(32px, 10vw, 48px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              {isMr ? slide.headlineMr : slide.headline}
            </h1>

            {/* Subtext */}
            <p
              className="font-light leading-relaxed mb-10 text-[rgba(245,240,232,0.55)] max-w-sm"
              style={{ fontSize: '14px' }}
            >
              {isMr ? slide.subtextMr : slide.subtext}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dot pagination — outside AnimatePresence so dots stay stable */}
        <div className="flex items-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              animate={{
                width:      i === current ? 24 : 6,
                background: i === current ? '#E8C84A' : 'rgba(245,240,232,0.2)',
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              style={{ height: 6, borderRadius: 99 }}
            />
          ))}
        </div>

        {/* CTAs */}
        <PillButton variant="light" fullWidth size="lg" onClick={isLast ? onComplete : next}>
          {isLast ? (isMr ? 'सुरू करा' : 'Get Started') : (isMr ? 'पुढे' : 'Continue')}
        </PillButton>
      </div>
    </div>
  );
}
