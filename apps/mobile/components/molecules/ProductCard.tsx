import React, { useRef, useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Product, Seller } from '../../types.ts';

interface ProductCardProps {
  product: Product;
  seller?: Seller;
  index?: number;
  lang?: 'en' | 'mr';
  onClick: () => void;
  onSelect?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
}

/**
 * FarmMinerals-style full-bleed product card.
 * Full-width image → gradient overlay → name at bottom.
 * Price + seller info in the info strip below.
 */
export default function ProductCard({
  product,
  seller,
  index = 0,
  lang = 'en',
  onClick,
  onSelect,
  isSelected = false,
}: ProductCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isMr = lang === 'mr';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      {/* Card shell */}
      <div
        onClick={onClick}
        className="relative overflow-hidden rounded-2xl cursor-pointer group"
        style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
      >
        {/* Hero image */}
        <div className="relative h-60 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={isMr ? product.nameMr : product.name}
            className="w-full h-full object-cover group-active:scale-[1.03] transition-transform duration-700"
            loading="lazy"
          />

          {/* Gradient overlay — strong at bottom, subtle top vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A0A] via-[rgba(10,26,10,0.3)] to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block text-[9px] font-medium tracking-[0.14em] uppercase text-[#D4C4A0] bg-[rgba(10,26,10,0.6)] backdrop-blur px-3 py-1 rounded-full border border-[rgba(212,196,160,0.2)]">
              {product.category}
            </span>
          </div>

          {/* Select toggle */}
          {onSelect && (
            <button
              onClick={onSelect}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                isSelected
                  ? 'bg-[#F5F0E8] text-[#0A1A0A] scale-110'
                  : 'bg-[rgba(10,26,10,0.5)] border border-[rgba(245,240,232,0.2)] text-[rgba(245,240,232,0.4)]'
              }`}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Name overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#D4C4A0] mb-0.5">
              {isMr ? product.varietyMr : product.variety}
            </p>
            <h3 className="text-xl font-light leading-tight text-[#F5F0E8]" style={{ letterSpacing: '-0.01em' }}>
              {isMr ? product.nameMr : product.name}
            </h3>
          </div>
        </div>

        {/* Info strip */}
        <div className="flex items-end justify-between px-5 py-4">
          <div className="space-y-1">
            {seller && (
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className="text-[#D4C4A0]" />
                <span className="text-[11px] font-light text-[rgba(245,240,232,0.45)]">
                  {seller.location}
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-light text-[#F5F0E8]" style={{ letterSpacing: '-0.02em' }}>
                ₹{product.price}
              </span>
              <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-[rgba(245,240,232,0.35)]">
                / {isMr ? product.unitMr : product.unit}
              </span>
            </div>
          </div>

          {/* Arrow CTA */}
          <div className="w-10 h-10 rounded-full border border-[rgba(245,240,232,0.12)] flex items-center justify-center text-[rgba(245,240,232,0.35)] group-active:border-[#D4C4A0] group-active:text-[#D4C4A0] transition-all">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
