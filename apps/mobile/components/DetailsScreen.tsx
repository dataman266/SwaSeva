import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Phone, MessageSquare, Truck, Heart,
  MapPin, Calendar, ShieldCheck, Star,
} from 'lucide-react';
import { Product, Language } from '../types.ts';
import { SELLERS, TRANSLATIONS } from '../constants.tsx';
import PillButton from './atoms/PillButton.tsx';
import StatCard from './atoms/StatCard.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';

interface DetailsScreenProps {
  product: Product;
  lang: Language;
  onBack: () => void;
}

export default function DetailsScreen({ product, lang, onBack }: DetailsScreenProps) {
  const [saved, setSaved]       = useState(false);
  const [mounted, setMounted]   = useState(false);
  const seller = SELLERS.find(s => s.id === product.sellerId);
  const isMr   = lang === Language.MARATHI;
  const t      = TRANSLATIONS[isMr ? 'mr' : 'en'];

  useEffect(() => { setMounted(true); }, []);

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
      {/* ── Hero image ─────────────────────────────────────────────── */}
      <div className="relative h-[58vh] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-[1800ms] ease-out ${mounted ? 'scale-100' : 'scale-110'}`}
          style={{ filter: 'brightness(0.55) saturate(0.85)' }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A0A] via-[rgba(10,26,10,0.35)] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A1A0A] to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-safe pt-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.2)] bg-[rgba(10,26,10,0.5)] text-[#F5F0E8] active:scale-90 transition-all nav-blur"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => setSaved(s => !s)}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.2)] bg-[rgba(10,26,10,0.5)] active:scale-90 transition-all nav-blur"
          >
            <Heart
              size={17}
              className={saved ? 'text-red-400 fill-red-400' : 'text-[rgba(245,240,232,0.55)]'}
            />
          </button>
        </div>

        {/* Category badge */}
        <div className="absolute top-16 left-5">
          <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-[#D4C4A0] bg-[rgba(10,26,10,0.55)] px-3 py-1 rounded-full border border-[rgba(212,196,160,0.25)] nav-blur">
            {product.category}
          </span>
        </div>

        {/* Name block at bottom of hero */}
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

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="px-5 -mt-2 space-y-8 relative z-10">

        {/* Quick stat chips */}
        <SectionReveal>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Calendar, label: isMr ? 'वय' : 'Age',      value: age || '—' },
              { icon: ShieldCheck, label: isMr ? 'मात्रा' : 'Qty', value: `${product.quantity}` },
              { icon: MapPin,  label: isMr ? 'स्थान' : 'Distance', value: seller?.distance || '—' },
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

        {/* Seller card */}
        {seller && (
          <SectionReveal delay={120}>
            <div
              className="flex items-center gap-4 p-5 rounded-2xl"
              style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: '#1A2D1A', border: '1px solid rgba(245,240,232,0.07)' }}
              >
                🏪
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[#F5F0E8] truncate" style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>
                    {seller.name}
                  </span>
                  {seller.isVerified && <ShieldCheck size={13} className="text-[#D4C4A0] flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-[#D4C4A0] fill-[#D4C4A0]" />
                    <span className="text-[11px] font-medium text-[#D4C4A0]">{seller.rating}</span>
                  </div>
                  <span className="text-[10px] font-light text-[rgba(245,240,232,0.35)] uppercase tracking-[0.1em]">
                    {seller.location}
                  </span>
                </div>
              </div>
            </div>
          </SectionReveal>
        )}

        {/* Transport section */}
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
              <button className="flex items-center justify-between px-5 py-4 rounded-xl border border-[rgba(212,196,160,0.25)] bg-[rgba(212,196,160,0.06)] text-left active:bg-[rgba(212,196,160,0.1)] transition-all">
                <span className="font-medium text-[#D4C4A0]" style={{ fontSize: '14px' }}>{t.requestTransport}</span>
                <ArrowLeft size={14} className="rotate-180 text-[#D4C4A0]" />
              </button>
            </div>
          </div>
        </SectionReveal>
      </div>

      {/* ── Sticky bottom CTA ─────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 px-5 pb-safe pt-4 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        style={{ background: 'linear-gradient(to top, #0A1A0A 70%, transparent)' }}
      >
        <div className="flex gap-3">
          <a
            href={`tel:${seller?.phone}`}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-[rgba(245,240,232,0.15)] text-[rgba(245,240,232,0.65)] active:scale-95 transition-all font-medium text-[13px] tracking-[0.06em]"
          >
            <Phone size={16} className="text-[#D4C4A0]" />
            {t.call}
          </a>
          <PillButton variant="light" className="flex-1" onClick={() => {}}>
            <MessageSquare size={15} />
            {t.chat}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
