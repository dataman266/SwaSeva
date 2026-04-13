import React, { useState } from 'react';
import { Search, Filter, Scale, MessageCircle } from 'lucide-react';
import { Language, Product } from '../types.ts';
import { PRODUCTS, SELLERS, CATEGORIES, TRANSLATIONS } from '../constants.tsx';

import DarkHeroSection from './organisms/DarkHeroSection.tsx';
import ScrollingTicker, {
  AGRI_TICKER_ITEMS,
  PARTNER_TICKER_ITEMS,
} from './organisms/ScrollingTicker.tsx';
import ProductCard from './molecules/ProductCard.tsx';
import StatCard from './atoms/StatCard.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';
import PillButton from './atoms/PillButton.tsx';

interface HomeScreenProps {
  lang: Language;
  onViewDetails: (p: Product) => void;
  onOpenAssistant: () => void;
}

// ── Stat strip data ──────────────────────────────────────────────────────────
const STATS = [
  { value: '500+', unit: 'Farmers',  description: 'registered on the platform'  },
  { value: '50+',  unit: 'Cities',   description: 'across Maharashtra & beyond'  },
  { value: '0',    unit: 'Middlemen',description: 'direct farm-to-buyer always'  },
  { value: '5×',   unit: 'Better ROI',description: 'vs traditional mandi prices' },
];

export default function HomeScreen({ lang, onViewDetails, onOpenAssistant }: HomeScreenProps) {
  const [search, setSearch]         = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const isMr = lang === Language.MARATHI;
  const t    = TRANSLATIONS[isMr ? 'mr' : 'en'];

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filtered = PRODUCTS.filter(p => {
    const name    = (isMr ? p.nameMr    : p.name   ).toLowerCase();
    const variety = (isMr ? p.varietyMr : p.variety).toLowerCase();
    const q       = search.toLowerCase();
    const matchSearch   = name.includes(q) || variety.includes(q);
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="pb-28">

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
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
        ctas={[
          { label: isMr ? 'बाजार पाहा' : 'Browse Market', onClick: () => {} },
          { label: isMr ? 'शेतकरी व्हा' : 'Join as Farmer', onClick: () => {}, variant: 'dark' },
        ]}
      />

      {/* ── 2. TICKER — crop categories ─────────────────────────────── */}
      <section className="py-8 overflow-hidden border-b border-[rgba(245,240,232,0.06)]">
        <ScrollingTicker items={AGRI_TICKER_ITEMS} />
        <div className="mt-3" />
        <ScrollingTicker items={PARTNER_TICKER_ITEMS} reverse />
      </section>

      {/* ── 3. STAT STRIP ───────────────────────────────────────────── */}
      <section className="px-6 py-14" style={{ background: '#111C11' }}>
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

      {/* ── 4. PRODUCT LISTING ──────────────────────────────────────── */}
      <section className="px-5 pt-12">

        {/* Section header */}
        <SectionReveal className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.35)] mb-1">
              {isMr ? 'ताजे उत्पादन' : 'Fresh Listings'}
            </p>
            <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>
              {t.nearYou}
            </h2>
          </div>
          <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-[#D4C4A0] bg-[rgba(212,196,160,0.1)] border border-[rgba(212,196,160,0.2)] px-3 py-1 rounded-full">
            LIVE
          </span>
        </SectionReveal>

        {/* Sticky search bar */}
        <div className="sticky top-14 z-30 pb-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[rgba(245,240,232,0.08)] bg-[rgba(17,28,17,0.92)] nav-blur">
            <Search size={18} className="text-[rgba(245,240,232,0.3)] flex-shrink-0" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.25)] font-light"
              style={{ fontSize: '14px' }}
            />
            <button className="text-[rgba(245,240,232,0.3)] hover:text-[#D4C4A0] transition-colors">
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-5">
          <CategoryChip
            label={isMr ? 'सर्व' : 'All'}
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {CATEGORIES.map(cat => (
            <CategoryChip
              key={cat.id}
              label={`${cat.icon} ${isMr ? cat.nameMr : cat.name}`}
              active={activeCategory === cat.name}
              onClick={() => setActiveCategory(cat.name)}
            />
          ))}
        </div>

        {/* Product grid */}
        <div className="flex flex-col gap-5">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[rgba(245,240,232,0.3)] font-light text-sm">
                {isMr ? 'कोणतेही उत्पादन सापडले नाही' : 'No products found'}
              </p>
            </div>
          ) : (
            filtered.map((product, idx) => {
              const seller = SELLERS.find(s => s.id === product.sellerId);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  seller={seller}
                  index={idx}
                  lang={isMr ? 'mr' : 'en'}
                  onClick={() => onViewDetails(product)}
                  onSelect={e => toggleSelect(e, product.id)}
                  isSelected={selectedIds.includes(product.id)}
                />
              );
            })
          )}
        </div>
      </section>

      {/* ── 5. JOIN CTA SECTION ─────────────────────────────────────── */}
      <SectionReveal>
        <section className="mx-5 mt-14 mb-6 px-6 py-10 rounded-2xl text-center" style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.35)] mb-3">
            {isMr ? 'सुरुवात करा' : 'Get Started'}
          </p>
          <h3 className="font-light text-[#F5F0E8] mb-2" style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>
            {isMr ? 'AgriMart ला जॉईन करा' : 'Join AgriMart Today'}
          </h3>
          <p className="text-[13px] font-light text-[rgba(245,240,232,0.45)] mb-6 leading-relaxed">
            {isMr
              ? 'हजारो शेतकऱ्यांसोबत जुळा आणि थेट विक्री करा.'
              : 'Connect with thousands of farmers and buy direct from source.'
            }
          </p>
          <div className="flex flex-col gap-3">
            <PillButton variant="light" fullWidth>
              {isMr ? 'खरेदीदार म्हणून सुरू करा' : 'Start as Buyer'}
            </PillButton>
            <PillButton variant="dark" fullWidth>
              {isMr ? 'शेतकरी म्हणून नोंदणी' : 'Register as Farmer'}
            </PillButton>
          </div>
        </section>
      </SectionReveal>

      {/* ── AI Assistant FAB ─────────────────────────────────────────── */}
      <button
        onClick={onOpenAssistant}
        className="fixed bottom-24 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 border border-[rgba(245,240,232,0.15)]"
        style={{ background: '#2D5A1B' }}
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={22} className="text-[#D4C4A0]" strokeWidth={1.5} />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#D4C4A0] rounded-full border-2 border-[#0A1A0A] animate-pulse" />
      </button>

      {/* ── Compare bar ──────────────────────────────────────────────── */}
      {selectedIds.length > 1 && (
        <div className="fixed bottom-24 left-5 z-50 animate-[fadeUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
          <button className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-[rgba(245,240,232,0.2)] text-[#F5F0E8] shadow-2xl active:scale-95 transition-transform font-medium text-sm"
            style={{ background: '#1A2D1A' }}>
            <Scale size={16} className="text-[#D4C4A0]" />
            <span style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
              {isMr ? `${selectedIds.length} तुलना करा` : `Compare ${selectedIds.length}`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── CategoryChip ─────────────────────────────────────────────────────────────
interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function CategoryChip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-full border text-[11px] font-medium tracking-[0.06em] transition-all active:scale-95 ${
        active
          ? 'bg-[#2D5A1B] border-[#2D5A1B] text-[#F5F0E8]'
          : 'bg-transparent border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.5)] hover:border-[rgba(245,240,232,0.25)]'
      }`}
    >
      {label}
    </button>
  );
}
