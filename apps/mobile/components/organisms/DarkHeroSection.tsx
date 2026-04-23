import React from 'react';
import PillButton from '../atoms/PillButton.tsx';

interface HeroCTA {
  label: string;
  onClick: () => void;
  variant?: 'dark' | 'light' | 'outline';
}

interface DarkHeroSectionProps {
  eyebrow?: string;           // Small label above headline, e.g. "LIVE MARKET"
  headline: string;           // Main headline — large, light weight
  headlineAccent?: string;    // Optional word(s) rendered in brand-beige/green
  subtext?: string;           // Supporting description
  ctas?: HeroCTA[];           // 1–2 pill buttons
  backgroundImage?: string;   // URL for hero bg image
  location?: string;          // Dynamic location string
  children?: React.ReactNode; // Optional overlay content slot
}

/**
 * FarmMinerals-style full-viewport dark hero section.
 * Features: dark bg image overlay, large lightweight headline,
 * pill CTA buttons with dots, fade-in animation.
 */
export default function DarkHeroSection({
  eyebrow,
  headline,
  headlineAccent,
  subtext,
  ctas = [],
  backgroundImage,
  location,
  children,
}: DarkHeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden">
      {/* Background image */}
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.45) saturate(0.8)' }}
          />
          {/* Bottom gradient — ensures text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A0A] via-[rgba(10,26,10,0.55)] to-[rgba(10,26,10,0.2)]" />
          {/* Top vignette for nav readability */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A1A0A] to-transparent" />
        </>
      )}

      {/* Dark fallback when no image */}
      {!backgroundImage && (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0A1A0A 0%, #162B16 100%)' }} />
      )}

      {/* Texture grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 pb-16 pt-28 animate-[fadeUp_0.9s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">

        {/* Eyebrow label */}
        {eyebrow && (
          <div className="flex items-center gap-2 mb-5">
            <span className="w-4 h-px bg-[#E8C84A]" />
            <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-[#E8C84A]">
              {eyebrow}
            </span>
          </div>
        )}

        {/* Location pill */}
        {location && (
          <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full border border-[rgba(245,240,232,0.12)] bg-[rgba(245,240,232,0.04)]">
            <span className="text-[9px]">📍</span>
            <span className="text-[10px] font-medium tracking-[0.1em] text-[rgba(245,240,232,0.55)]">{location}</span>
          </div>
        )}

        {/* Headline */}
        <h1
          className="font-light text-[#F5F0E8] leading-[1.05] mb-4"
          style={{ fontSize: 'clamp(36px, 11vw, 56px)', letterSpacing: '-0.03em' }}
        >
          {headline}
          {headlineAccent && (
            <span className="text-[#E8C84A]"> {headlineAccent}</span>
          )}
        </h1>

        {/* Subtext */}
        {subtext && (
          <p className="text-[14px] font-light leading-relaxed text-[rgba(245,240,232,0.55)] mb-8 max-w-xs">
            {subtext}
          </p>
        )}

        {/* CTA row */}
        {ctas.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {ctas.map((cta, i) => (
              <PillButton
                key={i}
                variant={cta.variant ?? (i === 0 ? 'light' : 'dark')}
                onClick={cta.onClick}
                size="md"
              >
                {cta.label}
              </PillButton>
            ))}
          </div>
        )}

        {children}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce opacity-30">
        <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-[#E8C84A]">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#E8C84A] to-transparent" />
      </div>
    </section>
  );
}
