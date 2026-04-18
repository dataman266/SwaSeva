import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Scale, MessageCircle, Newspaper, TrendingUp, ChevronRight, RotateCcw } from 'lucide-react';
import { Language, Product } from '../types.ts';
import { PRODUCTS, SELLERS, CATEGORIES, TRANSLATIONS } from '../constants.tsx';

import LivePriceTicker from './organisms/LivePriceTicker.tsx';
import ProductCard from './molecules/ProductCard.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';
import SkeletonCard from './atoms/SkeletonCard.tsx';
import WeatherWidget from './atoms/WeatherWidget.tsx';

interface HomeScreenProps {
  lang: Language;
  location: string;
  onViewDetails: (p: Product) => void;
  onOpenAssistant: () => void;
  onOpenExplore: () => void;
}

const SAVED_KEY = 'agrimart_saved';

function getSavedIds(): string[] {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); } catch { return []; }
}

export default function HomeScreen({ lang, location, onViewDetails, onOpenAssistant, onOpenExplore }: HomeScreenProps) {
  const [search, setSearch]           = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedIds, setSavedIds]       = useState<string[]>(getSavedIds);
  const [isLoading, setIsLoading]     = useState(true);
  const [refreshing, setRefreshing]   = useState(false);

  // Simulate initial product load (800ms)
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setIsLoading(false);
    setRefreshing(false);
  }, []);

  const isMr = lang === Language.MARATHI;
  const t    = TRANSLATIONS[isMr ? 'mr' : 'en'];

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    navigator.vibrate?.(8);
  };

  const filtered = PRODUCTS.filter(p => {
    const name    = (isMr ? p.nameMr    : p.name   ).toLowerCase();
    const variety = (isMr ? p.varietyMr : p.variety).toLowerCase();
    const q       = search.toLowerCase();
    return (name.includes(q) || variety.includes(q)) &&
      (activeCategory === 'all' || p.category === activeCategory);
  });

  return (
    <div className="pb-28">

      {/* ── 1. LIVE PRICE TICKER ─────────────────────────────────── */}
      <LivePriceTicker isMr={isMr} />

      {/* ── 2. WEATHER + REFRESH ROW ─────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.5rem 1.25rem 0',
      }}>
        <WeatherWidget />
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.275rem 0.65rem', borderRadius: '2rem',
            background: 'rgba(245,240,232,0.06)',
            border: '1px solid rgba(245,240,232,0.08)',
            cursor: refreshing ? 'default' : 'pointer',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <RotateCcw
            size={11}
            className={refreshing ? 'animate-spin' : ''}
            style={{ color: 'rgba(245,240,232,0.45)' }}
          />
          <span style={{ fontSize: '10px', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.08em', fontWeight: 400 }}>
            {isMr ? 'ताज्या' : 'Refresh'}
          </span>
        </button>
      </div>

      {/* ── 3. NEWS & IMPACT ENTRY CARD ──────────────────────────── */}
      <button
        type="button"
        onClick={onOpenExplore}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', margin: '0.875rem 0 0',
          padding: '0.875rem 1.25rem',
          background: 'linear-gradient(135deg, #111C11 0%, #1A2D1A 100%)',
          border: 'none',
          borderTop: '1px solid rgba(245,240,232,0.06)',
          borderBottom: '1px solid rgba(245,240,232,0.06)',
          cursor: 'pointer', touchAction: 'manipulation',
          WebkitTapHighlightColor: 'rgba(45,90,27,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '0.75rem', flexShrink: 0,
            background: 'rgba(212,196,160,0.1)', border: '1px solid rgba(212,196,160,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Newspaper size={16} style={{ color: '#D4C4A0' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '13px', fontWeight: 400, color: '#F5F0E8', letterSpacing: '-0.01em' }}>
              {isMr ? 'बातम्या आणि आमचा प्रभाव' : 'News & Our Impact'}
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.4)', marginTop: 2, fontWeight: 300 }}>
              {isMr ? 'शेती बातम्या, MSP अपडेट आणि अधिक' : 'Farm news, MSP updates & more'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <TrendingUp size={12} style={{ color: '#4A8C2A' }} />
          <ChevronRight size={14} style={{ color: 'rgba(245,240,232,0.25)' }} />
        </div>
      </button>

      {/* ── 4. PRODUCT LISTINGS ──────────────────────────────────── */}
      <section className="px-5 pt-6">

        {/* Section header */}
        <SectionReveal className="flex items-baseline justify-between mb-5">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.35)] mb-1">
              {isMr ? 'ताजे उत्पादन' : 'Fresh Listings'}
            </p>
            <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>
              {t.nearYou}
            </h2>
          </div>
          <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-[#D4C4A0] bg-[rgba(212,196,160,0.1)] border border-[rgba(212,196,160,0.2)] px-3 py-1 rounded-full">
            {isLoading ? (isMr ? 'लोड...' : 'Loading…') : 'LIVE'}
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

        {/* Product grid — skeletons while loading, real cards when ready */}
        <div className="flex flex-col gap-5">
          {isLoading ? (
            [0, 1, 2].map(i => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
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
                  isSaved={savedIds.includes(product.id)}
                  onSave={e => toggleSave(e, product.id)}
                />
              );
            })
          )}
        </div>
      </section>

      {/* ── AI Assistant FAB ─────────────────────────────────────── */}
      <button
        onClick={onOpenAssistant}
        className="fixed bottom-24 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 border border-[rgba(245,240,232,0.15)]"
        style={{ background: '#2D5A1B' }}
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={22} className="text-[#D4C4A0]" strokeWidth={1.5} />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#D4C4A0] rounded-full border-2 border-[#0A1A0A] animate-pulse" />
      </button>

      {/* ── Compare bar ──────────────────────────────────────────── */}
      {selectedIds.length > 1 && (
        <div className="fixed bottom-24 left-5 z-50 animate-[fadeUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
          <button
            className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-[rgba(245,240,232,0.2)] text-[#F5F0E8] shadow-2xl active:scale-95 transition-transform font-medium text-sm"
            style={{ background: '#1A2D1A' }}
          >
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

// ── CategoryChip ──────────────────────────────────────────────────────────────
interface ChipProps { label: string; active: boolean; onClick: () => void; }

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
