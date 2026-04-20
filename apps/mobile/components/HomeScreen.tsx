import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Search, Filter, Scale, MessageCircle, Newspaper, TrendingUp, ChevronRight, RotateCcw, X, MapPin } from 'lucide-react';
import { haptic } from '../utils/haptic.ts';
import { Language, Product } from '../types.ts';
import { PRODUCTS, SELLERS, CATEGORIES, TRANSLATIONS } from '../constants.tsx';

import LivePriceTicker from './organisms/LivePriceTicker.tsx';
import ProductCard from './molecules/ProductCard.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';
import SkeletonCard from './atoms/SkeletonCard.tsx';
import WeatherWidget from './atoms/WeatherWidget.tsx';
import { LocationFilter, DEFAULT_LOCATION_FILTER } from './locationTypes.ts';
const LocationPickerModal = lazy(() => import('./LocationPickerModal.tsx'));

const CONNECTIONS_KEY = 'agrimart_connections';

interface HomeScreenProps {
  lang: Language;
  location: string;
  onViewDetails: (p: Product) => void;
  onOpenAssistant: () => void;
  onOpenExplore: () => void;
  onOpenMessages: () => void;
}

const SAVED_KEY = 'agrimart_saved';
const USER_LISTINGS_KEY = 'agrimart_user_listings';

function getSavedIds(): string[] {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); } catch { return []; }
}

function getUserListings(): Product[] {
  try {
    const raw = JSON.parse(localStorage.getItem(USER_LISTINGS_KEY) || '[]');
    return raw.map((l: Record<string, unknown>) => ({
      id:          l.id,
      name:        l.name,
      nameMr:      l.nameMr ?? l.name,
      category:    l.category ?? 'Other',
      variety:     '',
      varietyMr:   '',
      price:       l.price ?? 0,
      unit:        l.unit ?? 'kg',
      unitMr:      l.unit ?? 'kg',
      imageUrl:    l.imageUrl,
      sellerId:    'self',
      quantity:    l.quantity ?? 0,
      description: (l.description as string) ?? '',
      descriptionMr: (l.description as string) ?? '',
      isUserListing: true,
    } as unknown as Product));
  } catch { return []; }
}

export default function HomeScreen({ lang, location, onViewDetails, onOpenAssistant, onOpenExplore, onOpenMessages }: HomeScreenProps) {
  const [search, setSearch]           = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedIds, setSavedIds]       = useState<string[]>(getSavedIds);
  const [isLoading, setIsLoading]     = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [showFilters, setShowFilters]             = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationFilter, setLocationFilter]         = useState<LocationFilter>(DEFAULT_LOCATION_FILTER);
  const [sortBy, setSortBy]           = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [priceMin, setPriceMin]       = useState('');
  const [priceMax, setPriceMax]       = useState('');

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
    haptic.light();
  };

  const handleEnquiry = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const seller = SELLERS.find(s => s.id === product.sellerId);
    if (!seller) return;
    const productName = isMr ? product.nameMr : product.name;
    const productUnit = isMr ? product.unitMr : product.unit;
    const autoMsg = isMr
      ? `नमस्कार ${seller.name}, मला ${productName} (₹${product.price}/${productUnit}) बद्दल अधिक माहिती हवी आहे.`
      : `Hi ${seller.name}, I'm interested in your ${productName} listed at ₹${product.price}/${productUnit} on Apla AgriMart.`;
    try {
      const connections: object[] = JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '[]');
      const existing = connections.find((c: any) => c.sellerId === seller.id && c.productId === product.id);
      if (!existing) {
        connections.push({
          id: `${seller.id}_${product.id}_${Date.now()}`,
          sellerId: seller.id,
          sellerName: seller.name,
          productId: product.id,
          productName,
          message: autoMsg,
          timestamp: Date.now(),
          unread: false,
        });
        localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
      }
    } catch {}
    haptic.light();
    onOpenMessages();
  };

  const filtersActive = sortBy !== 'newest' || priceMin !== '' || priceMax !== '';
  const locationActive = locationFilter.region !== 'all';

  const userListings = getUserListings();
  const userListingIds = new Set(userListings.map(l => l.id));

  const allProducts = [...userListings, ...PRODUCTS];

  const filtered = allProducts
    .filter(p => {
      const name    = (isMr ? p.nameMr    : p.name   ).toLowerCase();
      const variety = (isMr ? p.varietyMr : p.variety).toLowerCase();
      const q       = search.toLowerCase();
      const matchSearch = name.includes(q) || variety.includes(q);
      const matchCat    = activeCategory === 'all' || p.category === activeCategory;
      const matchMin    = priceMin === '' || p.price >= Number(priceMin);
      const matchMax    = priceMax === '' || p.price <= Number(priceMax);
      return matchSearch && matchCat && matchMin && matchMax;
    })
    .sort((a, b) => {
      // User's own listings always float to top
      const aOwn = userListingIds.has(a.id) ? 1 : 0;
      const bOwn = userListingIds.has(b.id) ? 1 : 0;
      if (aOwn !== bOwn) return bOwn - aOwn;
      if (sortBy === 'price_asc')  return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

  const isLocalProduct = (p: Product) => {
    if (!locationActive) return true;
    const seller = SELLERS.find(s => s.id === p.sellerId);
    if (!seller) return false;
    // Prefer string matching on location field (sellers don't have lat/lng in mock data)
    return seller.location.toLowerCase().includes(locationFilter.region.toLowerCase().split(',')[0].trim());
  };

  const localProducts = locationActive ? filtered.filter(p => isLocalProduct(p)) : filtered;
  const otherProducts = locationActive ? filtered.filter(p => !isLocalProduct(p)) : [];

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
        <SectionReveal className="flex items-baseline justify-between mb-4">
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

        {/* Location filter pill — always visible with current location + radius */}
        <button
          onClick={() => setShowLocationPicker(true)}
          className="flex items-center gap-2 mb-5 active:scale-[0.97] transition-all"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            background: locationActive ? 'rgba(45,90,27,0.18)' : 'rgba(245,240,232,0.05)',
            border: locationActive ? '1px solid rgba(74,140,42,0.5)' : '1px solid rgba(245,240,232,0.1)',
            touchAction: 'manipulation',
            alignSelf: 'flex-start',
          }}
        >
          <MapPin
            size={13}
            style={{ color: locationActive ? '#4A8C2A' : 'rgba(245,240,232,0.35)', flexShrink: 0 }}
          />
          <span style={{
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: locationActive ? '#D4C4A0' : 'rgba(245,240,232,0.4)',
          }}>
            {locationActive
              ? `${isMr ? locationFilter.regionLabelMr : locationFilter.regionLabel} · ${locationFilter.radius} km`
              : `${isMr ? 'सर्व भारत' : 'All India'} · ${locationFilter.radius} km`}
          </span>
          {locationActive && (
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#4A8C2A' }} />
          )}
        </button>

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
            <button
              onClick={() => setShowFilters(true)}
              className="relative transition-colors"
              style={{ touchAction: 'manipulation', color: filtersActive ? '#D4C4A0' : 'rgba(245,240,232,0.3)' }}
            >
              <Filter size={16} />
              {filtersActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D4C4A0]" />
              )}
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
            <>
              {/* Local products (or all when no location filter) */}
              {localProducts.map((product, idx) => {
                const seller = SELLERS.find(s => s.id === product.sellerId);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    seller={seller}
                    index={idx}
                    lang={isMr ? 'mr' : 'en'}
                    isSelfListing={userListingIds.has(product.id)}
                    onClick={() => onViewDetails(product)}
                    onSelect={e => toggleSelect(e, product.id)}
                    isSelected={selectedIds.includes(product.id)}
                    isSaved={savedIds.includes(product.id)}
                    onSave={e => toggleSave(e, product.id)}
                    onEnquiry={e => handleEnquiry(e, product)}
                  />
                );
              })}

              {/* Divider + other listings when a location is active */}
              {locationActive && otherProducts.length > 0 && (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px" style={{ background: 'rgba(245,240,232,0.06)' }} />
                    <span style={{
                      fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: 'rgba(245,240,232,0.22)',
                    }}>
                      {isMr ? 'इतर ठिकाणांहून' : 'From other areas'}
                    </span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(245,240,232,0.06)' }} />
                  </div>
                  {otherProducts.map((product, idx) => {
                    const seller = SELLERS.find(s => s.id === product.sellerId);
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        seller={seller}
                        index={localProducts.length + idx}
                        lang={isMr ? 'mr' : 'en'}
                        isSelfListing={userListingIds.has(product.id)}
                        onClick={() => onViewDetails(product)}
                        onSelect={e => toggleSelect(e, product.id)}
                        isSelected={selectedIds.includes(product.id)}
                        isSaved={savedIds.includes(product.id)}
                        onSave={e => toggleSave(e, product.id)}
                        onEnquiry={e => handleEnquiry(e, product)}
                      />
                    );
                  })}
                </>
              )}

              {/* Empty local state when filter active but no local matches */}
              {locationActive && localProducts.length === 0 && (
                <div className="text-center py-8">
                  <MapPin size={28} style={{ color: 'rgba(245,240,232,0.15)', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.3)', fontWeight: 300 }}>
                    {isMr
                      ? `${locationFilter.regionLabelMr} मध्ये कोणतेही लिस्टिंग नाही`
                      : `No listings near ${locationFilter.regionLabel}`}
                  </p>
                </div>
              )}
            </>
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

      {/* ── Location Picker Modal ────────────────────────────────── */}
      {showLocationPicker && (
        <Suspense fallback={null}>
          <LocationPickerModal
            isOpen={showLocationPicker}
            current={locationFilter}
            isMr={isMr}
            onApply={f => { setLocationFilter(f); haptic.light(); }}
            onClose={() => setShowLocationPicker(false)}
          />
        </Suspense>
      )}

      {/* ── Filter sheet ──────────────────────────────────────────── */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(10,26,10,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowFilters(false)}
          />
          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-6 pt-5 pb-10 animate-[slideUp_0.35s_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
          >
            {/* Handle + header */}
            <div className="w-10 h-1 rounded-full bg-[rgba(245,240,232,0.15)] mx-auto mb-5" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-light text-[#F5F0E8]" style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>
                {isMr ? 'फिल्टर करा' : 'Filter & Sort'}
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.4)]"
                style={{ touchAction: 'manipulation' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Sort */}
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)] mb-3">
              {isMr ? 'क्रमवारी' : 'Sort By'}
            </p>
            <div className="flex gap-2 mb-6 flex-wrap">
              {([
                { key: 'newest',     label: isMr ? 'नवीन' : 'Newest' },
                { key: 'price_asc',  label: isMr ? 'कमी किंमत' : 'Price: Low' },
                { key: 'price_desc', label: isMr ? 'जास्त किंमत' : 'Price: High' },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className="px-4 py-2 rounded-full border text-[12px] font-medium transition-all"
                  style={{
                    touchAction: 'manipulation',
                    background: sortBy === opt.key ? '#2D5A1B' : 'transparent',
                    border: `1px solid ${sortBy === opt.key ? '#2D5A1B' : 'rgba(245,240,232,0.12)'}`,
                    color: sortBy === opt.key ? '#F5F0E8' : 'rgba(245,240,232,0.5)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Price range */}
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)] mb-3">
              {isMr ? 'किंमत मर्यादा (₹)' : 'Price Range (₹)'}
            </p>
            <div className="flex items-center gap-3 mb-8">
              <input
                type="number"
                placeholder={isMr ? 'किमान' : 'Min'}
                value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl font-light text-[#F5F0E8] text-[14px] placeholder:text-[rgba(245,240,232,0.2)] border border-[rgba(245,240,232,0.1)] focus:border-[rgba(212,196,160,0.35)] bg-[rgba(255,255,255,0.03)] outline-none"
              />
              <span className="text-[rgba(245,240,232,0.25)] text-sm">—</span>
              <input
                type="number"
                placeholder={isMr ? 'कमाल' : 'Max'}
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl font-light text-[#F5F0E8] text-[14px] placeholder:text-[rgba(245,240,232,0.2)] border border-[rgba(245,240,232,0.1)] focus:border-[rgba(212,196,160,0.35)] bg-[rgba(255,255,255,0.03)] outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setSortBy('newest'); setPriceMin(''); setPriceMax(''); }}
                className="flex-1 py-3 rounded-full border border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.5)] text-[13px] font-medium"
                style={{ touchAction: 'manipulation' }}
              >
                {isMr ? 'रीसेट' : 'Reset'}
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 rounded-full text-[#F5F0E8] text-[13px] font-medium"
                style={{ background: '#2D5A1B', touchAction: 'manipulation' }}
              >
                {isMr ? 'लागू करा' : 'Apply'}
              </button>
            </div>
          </div>
        </>
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
