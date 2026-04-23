import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../types.ts';
import DarkHeroSection from './organisms/DarkHeroSection.tsx';
import ScrollingTicker, {
  AGRI_TICKER_ITEMS,
  PARTNER_TICKER_ITEMS,
} from './organisms/ScrollingTicker.tsx';
import FarmingNewsSection from './organisms/FarmingNewsSection.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';
import StatCard from './atoms/StatCard.tsx';

interface ExploreScreenProps {
  lang: Language;
  location?: string;
  onBack?: () => void;
}

const STATS = [
  { value: '500+', unit: 'Farmers',    description: 'registered on the platform'  },
  { value: '50+',  unit: 'Cities',     description: 'across Maharashtra & beyond'  },
  { value: '0',    unit: 'Middlemen',  description: 'direct farm-to-buyer always'  },
  { value: '5×',   unit: 'Better ROI', description: 'vs traditional mandi prices'  },
];

export default function ExploreScreen({ lang, location = 'Maharashtra', onBack }: ExploreScreenProps) {
  const isMr = lang === Language.MARATHI;

  return (
    <div className="pb-28" style={{ minHeight: '100vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

      {/* ── Back button (when navigated from Profile) ────────────── */}
      {onBack && (
        <div style={{ padding: '1rem 1.25rem 0' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.1)',
              borderRadius: '2rem', padding: '0.5rem 1rem',
              color: '#F5F0E8', fontSize: '13px', fontWeight: 300,
              cursor: 'pointer', touchAction: 'manipulation',
              WebkitTapHighlightColor: 'rgba(45,90,27,0.2)',
            }}
          >
            <ArrowLeft size={14} />
            {isMr ? 'मागे' : 'Back'}
          </button>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <DarkHeroSection
        eyebrow={isMr ? 'थेट शेतातून' : 'Direct from Farm'}
        headline={isMr ? 'शेतकऱ्यांचा बाजार' : 'The Farmers\' Market'}
        headlineAccent={isMr ? 'थेट' : 'Reimagined'}
        subtext={
          isMr
            ? 'ताजे उत्पादन, विश्वासार्ह शेतकरी आणि उचित किंमत — सरळ तुमच्या दारावर.'
            : 'Fresh produce, verified farmers, fair prices — direct to your door. No middlemen.'
        }
        backgroundImage="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop"
        ctas={[]}
      />

      {/* ── Scrolling tickers ─────────────────────────────────────── */}
      <section className="py-8 overflow-hidden border-b border-[rgba(245,240,232,0.06)]">
        <ScrollingTicker items={AGRI_TICKER_ITEMS} />
        <div className="mt-3" />
        <ScrollingTicker items={PARTNER_TICKER_ITEMS} reverse />
      </section>

      {/* ── Farming News ──────────────────────────────────────────── */}
      <FarmingNewsSection lang={isMr ? 'mr' : 'en'} location={location} />

      {/* ── Our Impact ───────────────────────────────────────────── */}
      <section className="px-6 py-14" style={{ background: '#162B16' }}>
        <SectionReveal className="mb-10">
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.35)] mb-2">
            {isMr ? 'आमचा प्रभाव' : 'Our Impact'}
          </p>
          <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: 'clamp(24px, 7vw, 36px)', letterSpacing: '-0.02em' }}>
            {isMr ? 'संख्या बोलतात' : 'Numbers that\nspeak for themselves'}
          </h2>
        </SectionReveal>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} delay={i * 80} />
          ))}
        </div>
      </section>
    </div>
  );
}
