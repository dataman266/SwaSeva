import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { Search, Filter, Scale, Newspaper, TrendingUp, ChevronRight, RotateCcw, X, MapPin, PlusCircle, Mic, MicOff } from 'lucide-react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}
import { haptic } from '../utils/haptic.ts';
import { Language, Product, MappedShopProduct, ShopItem } from '../types.ts';
import { PRODUCTS, SELLERS, CATEGORIES, MOCK_SHOP_PROFILES, MOCK_SHOP_ITEMS, getTranslations } from '../constants.tsx';
import { productsApi, marketPricesApi, ApiProduct, ApiMarketPrice, auth } from '../services/api.ts';

function mapApiProduct(p: ApiProduct): Product {
  return {
    id:            p.id,
    name:          p.name_en,
    nameMr:        p.name_mr ?? p.name_en,
    category:      p.category.slug,
    variety:       p.category.name_en,
    varietyMr:     p.category.name_mr ?? p.category.name_en,
    price:         parseFloat(p.pricePerUnit),
    unit:          p.unit,
    unitMr:        p.unit,
    quantity:      parseFloat(p.quantityAvailable),
    imageUrl:      p.images[0] ?? 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&auto=format',
    photos:        p.images.length > 0 ? p.images : undefined,
    sellerId:      p.seller.id,
    description:   [p.district, p.taluka, p.village].filter(Boolean).join(', '),
    descriptionMr: [p.district, p.taluka, p.village].filter(Boolean).join(', '),
  };
}

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
  onOpenSell?: () => void;
  onOpenSellerProfile?: (id: string) => void;
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
      photos:      Array.isArray(l.photos) ? l.photos as string[] : undefined,
      sellerId:    'self',
      quantity:    l.quantity ?? 0,
      description: (l.description as string) ?? '',
      descriptionMr: (l.description as string) ?? '',
      isUserListing: true,
    } as unknown as Product));
  } catch { return []; }
}

export default function HomeScreen({ lang, location, onViewDetails, onOpenAssistant, onOpenExplore, onOpenMessages, onOpenSell, onOpenSellerProfile }: HomeScreenProps) {
  const [search, setSearch]           = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedIds, setSavedIds]       = useState<string[]>(getSavedIds);
  const [apiProducts, setApiProducts]         = useState<Product[] | null>(null);
  const [apiMarketPrices, setApiMarketPrices] = useState<ApiMarketPrice[] | undefined>(undefined);
  const [isLoading, setIsLoading]     = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [showFilters, setShowFilters]             = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationFilter, setLocationFilter]         = useState<LocationFilter>(DEFAULT_LOCATION_FILTER);
  const [sortBy, setSortBy]           = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [priceMin, setPriceMin]       = useState('');
  const [priceMax, setPriceMax]       = useState('');
  const [userListings, setUserListings] = useState<ReturnType<typeof getUserListings>>(() => getUserListings());
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const productsRef = useRef<HTMLElement>(null);
  const hasSpeech = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Fetch products + market prices from backend in parallel
  const fetchProducts = useCallback(async () => {
    if (!auth.getAccess()) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const [productsRes, pricesRes] = await Promise.allSettled([
        productsApi.list({ limit: 50 }),
        marketPricesApi.list(),
      ]);
      if (productsRes.status === 'fulfilled') {
        setApiProducts(productsRes.value.data.map(mapApiProduct));
      }
      if (pricesRes.status === 'fulfilled') {
        setApiMarketPrices(pricesRes.value.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Refresh user listings whenever HomeScreen mounts (e.g. after returning from Sell)
  useEffect(() => {
    setUserListings(getUserListings());
  }, []);

  const startVoiceSearch = useCallback(() => {
    if (!hasSpeech) return;
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang === Language.MARATHI ? 'mr-IN' : 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart  = () => { setIsListening(true); haptic.light(); };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setSearch(transcript);
      haptic.light();
    };
    rec.onerror  = () => { setIsListening(false); };
    rec.onend    = () => { setIsListening(false); };
    recognitionRef.current = rec;
    rec.start();
  }, [hasSpeech, isListening, lang]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const isMr = lang === Language.MARATHI;
  const t    = getTranslations(lang);

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
      : `Hi ${seller.name}, I'm interested in your ${productName} listed at ₹${product.price}/${productUnit} on Swaseva.`;
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

  const userListingIds = new Set(userListings.map(l => l.id));

  const allProducts = [...userListings, ...(apiProducts ?? PRODUCTS)];

  const loadDukaanItems = (): MappedShopProduct[] => {
    let shopItems: ShopItem[] = MOCK_SHOP_ITEMS;
    try {
      const raw = localStorage.getItem('agrimart_shop_inventory');
      if (raw) shopItems = [...JSON.parse(raw), ...MOCK_SHOP_ITEMS];
    } catch { /* use mock */ }
    return shopItems
      .filter(i => i.isActive)
      .map(i => ({
        id:          i.id,
        name:        i.name,
        nameMr:      i.nameMr,
        category:    'agri-input',
        variety:     i.brand ?? i.category,
        varietyMr:   i.brand ?? i.category,
        price:       i.price,
        unit:        i.unit,
        unitMr:      i.unit,
        quantity:    i.stockQty,
        imageUrl:    i.imageUris[0] ?? 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        sellerId:    i.shopkeeperId,
        description: i.description,
        descriptionMr: i.descriptionMr,
        isDukaanItem: true as const,
        brand:       i.brand,
        expiryDate:  i.expiryDate,
      }));
  };

  const isDukaanMode = activeCategory === 'agri-input';
  const productsToFilter: Product[] = isDukaanMode ? loadDukaanItems() : allProducts;

  const filtered = productsToFilter
    .filter(p => {
      const name    = (isMr ? p.nameMr    : p.name   ).toLowerCase();
      const variety = (isMr ? p.varietyMr : p.variety).toLowerCase();
      const q       = search.toLowerCase();
      const matchSearch = name.includes(q) || variety.includes(q);
      const matchCat    = isDukaanMode || activeCategory === 'all' || p.category === activeCategory;
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
      <LivePriceTicker isMr={isMr} location={location} apiMarketPrices={apiMarketPrices} />

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
            Refresh
          </span>
        </button>
      </div>

      {/* ── 3. SELL CTA ──────────────────────────────────────────── */}
      {onOpenSell && (
        <div style={{ padding: '0.75rem 1.25rem 0' }}>
          <button
            onClick={() => { haptic.medium(); onOpenSell(); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '1.1rem 1.5rem',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, #2D5A1B 0%, #3D7A25 100%)',
              border: '1.5px solid rgba(74,140,42,0.5)',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              boxShadow: '0 4px 16px rgba(45,90,27,0.35)',
            }}
          >
            <PlusCircle size={22} style={{ color: '#F5F0E8', flexShrink: 0 }} />
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#F5F0E8', letterSpacing: '-0.01em' }}>
              {t.addInventory}
            </span>
          </button>
        </div>
      )}

      {/* ── NEWS & IMPACT ENTRY CARD ─────────────────────────────── */}
      <button
        type="button"
        onClick={onOpenExplore}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', margin: '0.75rem 0 0',
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, #162B16 0%, #1E3A1E 100%)',
          border: 'none',
          borderTop: '1px solid rgba(245,240,232,0.06)',
          borderBottom: '1px solid rgba(245,240,232,0.06)',
          cursor: 'pointer', touchAction: 'manipulation',
          WebkitTapHighlightColor: 'rgba(45,90,27,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '0.75rem', flexShrink: 0,
            background: 'rgba(212,196,160,0.1)', border: '1px solid rgba(212,196,160,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Newspaper size={18} style={{ color: '#E8C84A' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#F5F0E8', letterSpacing: '-0.01em' }}>
              {t.newsImpact}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.55)', marginTop: 2, fontWeight: 400 }}>
              {t.newsDesc}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <TrendingUp size={12} style={{ color: '#4CAF50' }} />
          <ChevronRight size={14} style={{ color: 'rgba(245,240,232,0.25)' }} />
        </div>
      </button>

      {/* ── 3b. NEARBY DUKAANDAARS SHELF ─────────────────────────── */}
      <div className="pt-5 pb-1">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-[16px] font-semibold text-[#F5F0E8]">🏪 {t.nearbyShops}</h2>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('agri-input');
              haptic.light();
              setTimeout(() => productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
            }}
            style={{
              fontSize: '12px', color: '#E8C84A', fontWeight: 500,
              padding: '8px 2px', minHeight: 44, display: 'flex', alignItems: 'center',
              touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            {t.seeAll}
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: 'none' }}>
          {MOCK_SHOP_PROFILES.map(shop => (
            <button
              key={shop.shopkeeperId}
              onClick={() => onOpenSellerProfile?.(shop.shopkeeperId)}
              className="flex-shrink-0 w-36 rounded-2xl overflow-hidden border border-[rgba(245,240,232,0.08)] active:scale-95 transition-all text-left"
              style={{ background: '#162B16' }}
            >
              <img
                src={shop.exteriorPhotoUri}
                alt={shop.shopName}
                className="w-full h-24 object-cover"
                loading="lazy"
              />
              <div className="p-2.5">
                <p className="text-[12px] font-semibold text-[#F5F0E8] leading-tight truncate">
                  {isMr ? shop.shopNameMr : shop.shopName}
                </p>
                <p className="text-[10px] text-[rgba(245,240,232,0.45)] mt-0.5">📍 {shop.distance}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. PRODUCT LISTINGS ──────────────────────────────────── */}
      <section ref={productsRef} className="px-5 pt-6">

        {/* Section header */}
        <SectionReveal className="flex items-baseline justify-between mb-4">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.75)] mb-1">
              {t.freshListings}
            </p>
            <h2 className="font-semibold text-[#F5F0E8]" style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>
              {t.nearYou}
            </h2>
          </div>
          <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-[#E8C84A] bg-[rgba(212,196,160,0.1)] border border-[rgba(212,196,160,0.2)] px-3 py-1 rounded-full">
            {isLoading ? t.loading : 'LIVE'}
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
            style={{ color: locationActive ? '#4CAF50' : 'rgba(245,240,232,0.35)', flexShrink: 0 }}
          />
          <span style={{
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: locationActive ? '#E8C84A' : 'rgba(245,240,232,0.4)',
          }}>
            {locationActive
              ? `${isMr ? locationFilter.regionLabelMr : locationFilter.regionLabel} · ${locationFilter.radius} km`
              : `${t.allIndia} · ${locationFilter.radius} km`}
          </span>
          {locationActive && (
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#4CAF50' }} />
          )}
        </button>

        {/* Sticky search bar */}
        <div className="sticky top-14 z-30 pb-4">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-[rgba(245,240,232,0.35)] bg-[rgba(17,28,17,0.96)] nav-blur">
            <Search size={20} className="text-[rgba(245,240,232,0.75)] flex-shrink-0" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.5)] font-light"
              style={{ fontSize: '16px' }}
            />
            {hasSpeech && (
              <button
                onClick={startVoiceSearch}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  background: isListening ? 'rgba(45,90,27,0.4)' : 'transparent',
                  border: isListening ? '1.5px solid rgba(74,140,42,0.6)' : 'none',
                  transition: 'background 0.15s, border 0.15s',
                }}
              >
                {isListening
                  ? <MicOff size={16} style={{ color: '#4CAF50' }} className="animate-pulse" />
                  : <Mic size={16} style={{ color: 'rgba(245,240,232,0.45)' }} />}
              </button>
            )}
            <button
              onClick={() => setShowFilters(true)}
              className="relative transition-colors"
              style={{ touchAction: 'manipulation', color: filtersActive ? '#E8C84A' : 'rgba(245,240,232,0.3)' }}
            >
              <Filter size={16} />
              {filtersActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E8C84A]" />
              )}
            </button>
          </div>
        </div>

        {/* Category tiles */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-5">
          <CategoryTile
            icon="🛒"
            label={t.all}
            gradient="linear-gradient(145deg,#1A3A1A,#2D5A1B)"
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {CATEGORIES.map(cat => (
            <CategoryTile
              key={cat.id}
              icon={cat.icon}
              label={isMr ? cat.nameMr : cat.name}
              gradient={CAT_GRADIENTS[cat.id] ?? 'linear-gradient(145deg,#1A2D1A,#243D24)'}
              active={activeCategory === cat.name}
              onClick={() => setActiveCategory(cat.name)}
            />
          ))}
          <CategoryTile
            icon="🏪"
            label={t.agriInputs}
            gradient="linear-gradient(145deg,#1A2D3A,#1A3D5A)"
            active={activeCategory === 'agri-input'}
            onClick={() => setActiveCategory('agri-input')}
          />
        </div>

        {/* Product grid — skeletons while loading, real cards when ready */}
        <div className="flex flex-col gap-5">
          {isLoading ? (
            [0, 1, 2].map(i => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[rgba(245,240,232,0.3)] font-light text-sm">
                {t.noProducts}
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
                    lang={lang}
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
                      {t.fromOtherAreas}
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
                        lang={lang}
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
                      : `${t.noListings} ${locationFilter.regionLabel}`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Compare bar ──────────────────────────────────────────── */}
      {selectedIds.length > 1 && (
        <div className="fixed bottom-24 left-5 z-50 animate-[fadeUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
          <button
            className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-[rgba(245,240,232,0.2)] text-[#F5F0E8] shadow-2xl active:scale-95 transition-transform font-medium text-sm"
            style={{ background: '#1E3A1E' }}
          >
            <Scale size={16} className="text-[#E8C84A]" />
            <span style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
              {t.compareCount(selectedIds.length)}
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
            style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
          >
            {/* Handle + header */}
            <div className="w-10 h-1 rounded-full bg-[rgba(245,240,232,0.15)] mx-auto mb-5" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-light text-[#F5F0E8]" style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>
                {t.filterSort}
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
              {t.sortBy}
            </p>
            <div className="flex gap-2 mb-6 flex-wrap">
              {([
                { key: 'newest',     label: t.newest },
                { key: 'price_asc',  label: t.priceLow },
                { key: 'price_desc', label: t.priceHigh },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className="px-4 py-2 rounded-full border text-[12px] font-medium transition-all"
                  style={{
                    touchAction: 'manipulation',
                    background: sortBy === opt.key ? '#2E7D32' : 'transparent',
                    border: `1px solid ${sortBy === opt.key ? '#2E7D32' : 'rgba(245,240,232,0.12)'}`,
                    color: sortBy === opt.key ? '#F5F0E8' : 'rgba(245,240,232,0.5)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Price range */}
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)] mb-3">
              {t.priceRange}
            </p>
            <div className="flex items-center gap-3 mb-8">
              <input
                type="number"
                placeholder={t.min}
                value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl font-light text-[#F5F0E8] text-[14px] placeholder:text-[rgba(245,240,232,0.2)] border border-[rgba(245,240,232,0.1)] focus:border-[rgba(212,196,160,0.35)] bg-[rgba(255,255,255,0.03)] outline-none"
              />
              <span className="text-[rgba(245,240,232,0.25)] text-sm">—</span>
              <input
                type="number"
                placeholder={t.max}
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
                {t.reset}
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 rounded-full text-[#F5F0E8] text-[13px] font-medium"
                style={{ background: '#2E7D32', touchAction: 'manipulation' }}
              >
                {t.apply}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Category tile gradients ───────────────────────────────────────────────────
const CAT_GRADIENTS: Record<string, string> = {
  c1: 'linear-gradient(145deg,#1A3320,#2A5C35)',  // Seeds — deep green
  c2: 'linear-gradient(145deg,#142B14,#265226)',  // Saplings — forest
  c3: 'linear-gradient(145deg,#2E2010,#5C3D1A)',  // Fertilizer — amber-brown
  c4: 'linear-gradient(145deg,#101A2E,#1A2F52)',  // Pesticides — navy
  c5: 'linear-gradient(145deg,#1E1E1E,#3A3A3A)',  // Tools — steel
};

// ── CategoryTile ──────────────────────────────────────────────────────────────
interface TileProps { icon: string; label: string; gradient: string; active: boolean; onClick: () => void; }

function CategoryTile({ icon, label, gradient, active, onClick }: TileProps) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: 76,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.35rem',
        padding: '0.75rem 0.5rem',
        borderRadius: '1rem',
        background: gradient,
        border: active ? '2px solid #4A9A2A' : '2px solid rgba(245,240,232,0.1)',
        boxShadow: active ? '0 0 0 2px rgba(74,154,42,0.25)' : 'none',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
      <span style={{
        fontSize: 11,
        fontWeight: active ? 700 : 500,
        color: active ? '#F5F0E8' : 'rgba(245,240,232,0.7)',
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: '0.01em',
      }}>{label}</span>
    </button>
  );
}
