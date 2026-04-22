import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Phone, MessageSquare, Truck, Heart,
  MapPin, Calendar, ShieldCheck, Star, Share2, ShoppingCart, X,
} from 'lucide-react';
import { addToCart } from '../utils/cart.ts';
import { haptic } from '../utils/haptic.ts';

const SAVED_KEY = 'agrimart_saved';
const CONNECTIONS_KEY = 'agrimart_connections';
import { Product, Language } from '../types.ts';
import { SELLERS, TRANSLATIONS } from '../constants.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';

interface DetailsScreenProps {
  product: Product;
  lang: Language;
  onBack: () => void;
  onViewSeller: (sellerId: string) => void;
  onSendEnquiry: (sellerId: string, productId: string) => void;
}

export default function DetailsScreen({ product, lang, onBack, onViewSeller, onSendEnquiry }: DetailsScreenProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState<boolean>(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
      return list.includes(product.id);
    } catch { return false; }
  });
  const [mounted, setMounted] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [enquiryToast, setEnquiryToast] = useState(false);

  const seller = SELLERS.find(s => s.id === product.sellerId);
  const isMr   = lang === Language.MARATHI;
  const t      = TRANSLATIONS[isMr ? 'mr' : 'en'];

  useEffect(() => { setMounted(true); }, []);

  const toggleSaved = () => {
    const next = !saved;
    setSaved(next);
    try {
      const list: string[] = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
      const updated = next
        ? [...list.filter(id => id !== product.id), product.id]
        : list.filter(id => id !== product.id);
      localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    } catch {}
    navigator.vibrate?.(8);
  };

  const handleShare = () => {
    const productName = isMr ? product.nameMr : product.name;
    const productUnit = isMr ? product.unitMr : product.unit;
    const text = `${productName} — ₹${product.price}/${productUnit} on Apla AgriMart`;
    const url  = `https://agrimart.app/listing/${product.id}`;
    if (navigator.share) {
      navigator.share({ title: productName, text, url }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank', 'noopener');
    }
  };

  const handleViewMap = () => {
    const query = encodeURIComponent(seller?.location || 'Maharashtra, India');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener');
  };

  const handleSendEnquiry = () => {
    if (!seller) return;
    const productName = isMr ? product.nameMr : product.name;
    const productUnit = isMr ? product.unitMr : product.unit;
    const autoMsg = isMr
      ? t.enquiryAutoMsgMr(productName, product.price, productUnit)
      : t.enquiryAutoMsg(productName, product.price, productUnit);

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

    setEnquiryToast(true);
    haptic.light();
    setTimeout(() => {
      setEnquiryToast(false);
      onSendEnquiry(seller.id, product.id);
    }, 900);
  };

  const name    = isMr ? product.nameMr    : product.name;
  const desc    = isMr ? product.descriptionMr : product.description;
  const unit    = isMr ? product.unitMr    : product.unit;
  const age     = isMr ? product.ageMr     : product.age;
  const variety = isMr ? product.varietyMr : product.variety;

  return (
    <div
      className={`min-h-screen pb-36 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
      style={{ background: '#0A1A0A' }}
    >
      {/* ── Hero carousel ──────────────────────────────────────────── */}
      {(() => {
        const slides = product.photos && product.photos.length > 0
          ? product.photos
          : [product.imageUrl];
        return (
          <div className="relative h-[58vh]" style={{ overflow: 'hidden' }}>
            <div
              ref={trackRef}
              onTouchStart={e => { setTouchStartX(e.touches[0].clientX); setIsDragging(true); setDragOffset(0); }}
              onTouchMove={e => { if (isDragging) setDragOffset(e.touches[0].clientX - touchStartX); }}
              onTouchEnd={() => {
                setIsDragging(false);
                const w = trackRef.current?.clientWidth || window.innerWidth;
                if (dragOffset < -(w * 0.25) && activeSlide < slides.length - 1) setActiveSlide(s => s + 1);
                else if (dragOffset > w * 0.25 && activeSlide > 0) setActiveSlide(s => s - 1);
                setDragOffset(0);
              }}
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                transform: `translateX(calc(${-activeSlide * 100}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.32,0,0.16,1)',
                willChange: 'transform',
                touchAction: 'pan-y',
                userSelect: 'none',
              }}
            >
              {slides.map((src, i) => (
                <div
                  key={i}
                  style={{ flexShrink: 0, width: '100%', height: '100%' }}
                >
                  <img
                    src={src}
                    alt={`${name} ${i + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-[1800ms] ease-out ${mounted ? 'scale-100' : 'scale-105'}`}
                    style={{ filter: 'brightness(0.82) saturate(0.9)', pointerEvents: 'none' }}
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A0A] via-[rgba(10,26,10,0.25)] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A1A0A] to-transparent pointer-events-none" />

            {/* Dot indicators — only shown when multiple slides */}
            {slides.length > 1 && (
              <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:      i === activeSlide ? 18 : 6,
                      height:     6,
                      background: i === activeSlide ? '#D4C4A0' : 'rgba(245,240,232,0.35)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-safe pt-4">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.2)] bg-[rgba(10,26,10,0.5)] text-[#F5F0E8] active:scale-90 transition-all nav-blur"
                style={{ touchAction: 'manipulation' }}
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.2)] bg-[rgba(10,26,10,0.5)] text-[rgba(245,240,232,0.55)] active:scale-90 transition-all nav-blur"
                  style={{ touchAction: 'manipulation' }}
                  aria-label="Share listing"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={toggleSaved}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.2)] bg-[rgba(10,26,10,0.5)] active:scale-90 transition-all nav-blur"
                  style={{ touchAction: 'manipulation' }}
                  aria-label={saved ? 'Remove from saved' : 'Save listing'}
                >
                  <Heart
                    size={17}
                    className={saved ? 'text-red-400 fill-red-400' : 'text-[rgba(245,240,232,0.55)]'}
                  />
                </button>
              </div>
            </div>

            {/* Category badge */}
            <div className="absolute top-16 left-5">
              <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-[#D4C4A0] bg-[rgba(10,26,10,0.55)] px-3 py-1 rounded-full border border-[rgba(212,196,160,0.25)] nav-blur">
                {product.category}
              </span>
            </div>

            {/* Name + price block */}
            <div className={`absolute bottom-0 left-0 right-0 px-6 pb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-[#D4C4A0] mb-1.5">{variety}</p>
              <h1 className="font-light text-[#F5F0E8] mb-3" style={{ fontSize: 'clamp(28px, 8vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                {name}
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="font-light text-[#F5F0E8]" style={{ fontSize: '32px', letterSpacing: '-0.03em' }}>₹{product.price}</span>
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[rgba(245,240,232,0.4)]">/ {unit}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="px-5 -mt-2 space-y-8 relative z-10">

        {/* Quick stat chips */}
        <SectionReveal>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Calendar,    label: isMr ? 'वय' : 'Age',      value: age || '—' },
              { icon: ShieldCheck, label: isMr ? 'मात्रा' : 'Qty',  value: `${product.quantity}` },
              { icon: MapPin,      label: isMr ? 'स्थान' : 'Distance', value: seller?.distance || '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-1.5 p-4 rounded-2xl"
                style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
              >
                <Icon size={14} className="text-[#D4C4A0]" />
                <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-[rgba(245,240,232,0.35)]">{label}</span>
                <span className="font-light text-[#F5F0E8]" style={{ fontSize: '16px', letterSpacing: '-0.01em' }}>{value}</span>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Seller card — CLICKABLE */}
        {seller && (
          <SectionReveal delay={60}>
            <button
              onClick={() => onViewSeller(seller.id)}
              className="w-full text-left active:scale-[0.98] transition-transform"
              style={{ touchAction: 'manipulation' }}
              aria-label={`View ${seller.name} profile`}
            >
              <div
                className="flex items-center gap-4 p-5 rounded-2xl"
                style={{ background: '#111C11', border: '1px solid rgba(212,196,160,0.12)' }}
              >
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: seller.avatarColor, border: '1px solid rgba(245,240,232,0.1)' }}
                >
                  <span className="text-[#F5F0E8] font-medium" style={{ fontSize: '18px' }}>
                    {seller.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-[#D4C4A0] truncate" style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>
                      {seller.name}
                    </span>
                    {seller.isVerified && <ShieldCheck size={13} className="text-[#4A8C2A] flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-[#D4C4A0] fill-[#D4C4A0]" />
                      <span className="text-[11px] font-medium text-[#D4C4A0]">{seller.rating}</span>
                    </div>
                    <span className="text-[10px] font-light text-[rgba(245,240,232,0.35)] uppercase tracking-[0.1em] truncate">
                      {seller.location}
                    </span>
                  </div>
                  {/* Phone number visible in listing */}
                  <div className="flex items-center gap-1.5">
                    <Phone size={10} className="text-[rgba(245,240,232,0.4)]" />
                    <span className="text-[11px] font-medium text-[rgba(245,240,232,0.55)]">{seller.phone}</span>
                  </div>
                </div>
                <ArrowLeft size={14} className="rotate-180 text-[rgba(245,240,232,0.2)] flex-shrink-0" />
              </div>
            </button>
          </SectionReveal>
        )}

        {/* Description */}
        <SectionReveal delay={80}>
          <div className="p-6 rounded-2xl" style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-px bg-[#D4C4A0]" />
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)]">
                {t.itemDetails}
              </p>
            </div>
            <p className="font-light leading-relaxed text-[rgba(245,240,232,0.7)]" style={{ fontSize: '14px' }}>
              {desc}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(45,90,27,0.4)] bg-[rgba(45,90,27,0.1)]">
              <ShieldCheck size={13} className="text-[#4A8C2A]" />
              <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#4A8C2A]">{t.qualityVerified}</span>
            </div>
          </div>
        </SectionReveal>

        {/* Specifications */}
        <SectionReveal delay={100}>
          <div className="p-6 rounded-2xl" style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-px bg-[#D4C4A0]" />
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)]">
                {isMr ? 'तपशील' : 'Specifications'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: isMr ? 'वाण / जात' : 'Variety',  value: variety || '—' },
                { label: isMr ? 'श्रेणी' : 'Category',     value: product.category },
                { label: isMr ? 'हमीभाव' : 'MSP Price',    value: product.mspPrice ? `₹${product.mspPrice}/${unit}` : 'N/A' },
                { label: isMr ? 'कापणी' : 'Harvest',       value: product.harvestDate
                    ? new Date(product.harvestDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                    : (isMr ? 'हंगामी' : 'Seasonal') },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl"
                  style={{ background: '#0A1A0A', border: '1px solid rgba(245,240,232,0.06)' }}
                >
                  <p className="text-[9px] font-medium tracking-[0.15em] uppercase text-[rgba(245,240,232,0.3)] mb-1.5">{label}</p>
                  <p className="font-light text-[#F5F0E8]" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Listing location — fixed label + working Map link */}
        <SectionReveal delay={140}>
          <div className="p-6 rounded-2xl" style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} className="text-[#D4C4A0]" />
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)]">
                {t.listingLocation}
              </p>
            </div>
            {/* Stylised map block */}
            <div
              className="w-full h-28 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center cursor-pointer"
              style={{ background: '#0D1F0D', border: '1px solid rgba(74,140,42,0.2)' }}
              onClick={handleViewMap}
              role="button"
              aria-label="Open in Google Maps"
            >
              {[...Array(5)].map((_, i) => (
                <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${20 * i}%`, height: 1, background: 'rgba(74,140,42,0.08)' }} />
              ))}
              {[...Array(7)].map((_, i) => (
                <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${14.28 * i}%`, width: 1, background: 'rgba(74,140,42,0.08)' }} />
              ))}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(45,90,27,0.3)', border: '2px solid rgba(74,140,42,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 0 8px rgba(45,90,27,0.12)',
                }}>
                  <MapPin size={16} className="text-[#4A8C2A]" fill="rgba(74,140,42,0.3)" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="font-medium text-[#F5F0E8] mb-1" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
                  {seller?.location || (isMr ? 'महाराष्ट्र, भारत' : 'Maharashtra, India')}
                </p>
                <p className="font-light text-[rgba(245,240,232,0.4)]" style={{ fontSize: '12px' }}>
                  {seller ? `${seller.distance} ${isMr ? 'तुमच्यापासून' : 'from you'}` : (isMr ? 'अंदाजे अंतर' : 'Approx. distance')}
                </p>
              </div>
              <button
                onClick={handleViewMap}
                className="px-3 py-1.5 rounded-full border active:scale-95 transition-all"
                style={{ borderColor: 'rgba(74,140,42,0.5)', background: 'rgba(45,90,27,0.18)', touchAction: 'manipulation' }}
              >
                <span className="text-[10px] font-medium text-[#4A8C2A] tracking-[0.1em] uppercase">
                  {t.viewMap}
                </span>
              </button>
            </div>
          </div>
        </SectionReveal>

        {/* Transport */}
        <SectionReveal delay={160}>
          <div className="p-6 rounded-2xl" style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}>
            <div className="flex items-center gap-3 mb-5">
              <Truck size={16} className="text-[#D4C4A0]" />
              <p className="font-medium text-[#F5F0E8]" style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>
                {t.transport}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-between px-5 py-4 rounded-xl border border-[rgba(245,240,232,0.1)] text-left active:bg-[rgba(245,240,232,0.05)] transition-all">
                <span className="font-light text-[rgba(245,240,232,0.65)]" style={{ fontSize: '14px' }}>{t.selfPickup}</span>
                <ArrowLeft size={14} className="rotate-180 text-[rgba(245,240,232,0.3)]" />
              </button>
              {/* Coming Soon transport */}
              <button
                onClick={() => setShowTransportModal(true)}
                className="flex items-center justify-between px-5 py-4 rounded-xl border text-left active:opacity-80 transition-all"
                style={{ borderColor: 'rgba(212,196,160,0.2)', background: 'rgba(212,196,160,0.04)' }}
              >
                <div>
                  <span className="font-medium text-[rgba(212,196,160,0.55)]" style={{ fontSize: '14px' }}>{t.requestTransport}</span>
                  <span
                    className="ml-2 text-[9px] font-medium tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(212,196,160,0.12)', color: '#D4C4A0' }}
                  >
                    {t.comingSoon}
                  </span>
                </div>
                <ArrowLeft size={14} className="rotate-180 text-[rgba(212,196,160,0.25)]" />
              </button>
            </div>
          </div>
        </SectionReveal>

      </div>

      {/* ── Sticky bottom CTA ─────────────────────────────────────── */}
      <div
        className={`fixed left-0 right-0 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        style={{
          bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))',
          padding: '10px 16px 12px',
          background: 'linear-gradient(180deg, rgba(40,68,32,0.72) 0%, rgba(18,32,18,0.88) 100%)',
          backdropFilter: 'blur(20px) saturate(220%)',
          WebkitBackdropFilter: 'blur(20px) saturate(220%)',
          borderRadius: '16px 16px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.16)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 -8px 32px rgba(0,0,0,0.5)',
          zIndex: 60,
        }}
      >
        <div className="flex gap-3">
          {/* Call button */}
          <a
            href={`tel:${seller?.phone}`}
            className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-full border border-[rgba(245,240,232,0.15)] text-[rgba(245,240,232,0.75)] active:scale-95 transition-all font-medium text-[12px] tracking-[0.05em]"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(45,90,27,0.2)' }}
          >
            <Phone size={14} className="text-[#D4C4A0]" />
            {isMr ? 'कॉल' : 'Call'}
          </a>
          {/* Cart button */}
          <button
            onClick={() => { addToCart(product.id); haptic.light(); }}
            className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-full border border-[rgba(212,196,160,0.3)] text-[#D4C4A0] active:scale-95 transition-all font-medium text-[12px]"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(212,196,160,0.1)' }}
          >
            <ShoppingCart size={14} />
            {isMr ? 'कार्टमध्ये जोडा' : 'Add to Cart'}
          </button>
          {/* Send Enquiry — primary CTA */}
          <button
            onClick={handleSendEnquiry}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-full text-[#F5F0E8] font-medium text-[12px] tracking-[0.05em] active:scale-95 transition-all"
            style={{ background: '#2D5A1B', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          >
            <MessageSquare size={14} />
            {t.sendEnquiry}
          </button>
        </div>
      </div>

      {/* ── Enquiry sent toast ────────────────────────────────────── */}
      {enquiryToast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full"
          style={{ background: '#2D5A1B', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          <ShieldCheck size={15} className="text-[#F5F0E8]" />
          <span className="text-[13px] font-medium text-[#F5F0E8] tracking-[0.05em]">{t.enquirySent}</span>
        </div>
      )}

      {/* ── Coming Soon modal ─────────────────────────────────────── */}
      {showTransportModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowTransportModal(false)}
        >
          <div
            className="w-full max-w-md mx-auto rounded-t-3xl p-8 pb-12"
            style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.08)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,196,160,0.1)' }}>
                  <Truck size={18} className="text-[#D4C4A0]" />
                </div>
                <span className="font-medium text-[#F5F0E8]" style={{ fontSize: '17px', letterSpacing: '-0.01em' }}>
                  {t.comingSoon}
                </span>
              </div>
              <button
                onClick={() => setShowTransportModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(245,240,232,0.07)' }}
              >
                <X size={16} className="text-[rgba(245,240,232,0.55)]" />
              </button>
            </div>
            <p className="font-light text-[rgba(245,240,232,0.6)] leading-relaxed" style={{ fontSize: '14px' }}>
              {t.comingSoonDesc}
            </p>
            <button
              onClick={() => setShowTransportModal(false)}
              className="mt-6 w-full h-12 rounded-full font-medium text-[13px] text-[rgba(245,240,232,0.7)] border border-[rgba(245,240,232,0.12)] active:scale-95 transition-all"
            >
              {isMr ? 'बंद करा' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
