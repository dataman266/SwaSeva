import React from 'react';

/**
 * Swaseva logo — integrated pill badge
 *
 * Single unified pill. Icon occupies the left rounded-cap zone.
 * Wordmark occupies the right zone — both inside the same pill container.
 *
 * Script order (user intent — "Hindi first, English second"):
 *   "स्व"  — Noto Sans Devanagari Bold, gold  (Hindi half = swa = self)
 *   "Seva" — Inter ExtraBold, cream            (English half = service)
 * Together: स्वSeva → reads as one bilingual word across two scripts.
 *
 * Icon: compact wheat mark — Surya sun, stem, paired mango-leaves,
 *       earth arc + rangoli dots. All within the left cap circle.
 */
export default function Logo({ height = 34 }: { height?: number }) {
  const width = Math.round(height * (120 / 36));

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Swaseva"
    >
      <defs>
        <radialGradient id="swGlow" cx="18%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#3A7D22" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0A1A0A" stopOpacity="0"   />
        </radialGradient>
      </defs>

      {/* ── PILL (unified container) ─────────────────────────── */}
      <rect x="0.5" y="0.5" width="119" height="35" rx="17.5" fill="#0A1A0A" />
      <rect x="0.5" y="0.5" width="119" height="35" rx="17.5" fill="url(#swGlow)" />
      <rect x="0.5" y="0.5" width="119" height="35" rx="17.5"
        stroke="#E8C84A" strokeWidth="0.55" strokeOpacity="0.32" />

      {/* ── ICON: wheat stem ────────────────────────────────── */}
      <path d="M14 28.5 L14 10"
        stroke="#E8C84A" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.8" />

      {/* Surya — sun disc + inner crease + 5 rays ────────────── */}
      <circle cx="14" cy="8" r="2.1" fill="#E8C84A" opacity="0.9" />
      <circle cx="14" cy="8" r="0.9" fill="#0A1A0A" opacity="0.32" />
      <line x1="14"   y1="5.2"  x2="14"   y2="4.0"  stroke="#E8C84A" strokeWidth="0.72" strokeLinecap="round" strokeOpacity="0.62" />
      <line x1="16.6" y1="5.9"  x2="17.4" y2="5.1"  stroke="#E8C84A" strokeWidth="0.72" strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="18.0" y1="8.2"  x2="19.2" y2="8.2"  stroke="#E8C84A" strokeWidth="0.72" strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="11.4" y1="5.9"  x2="10.6" y2="5.1"  stroke="#E8C84A" strokeWidth="0.72" strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="10.0" y1="8.2"  x2="8.8"  y2="8.2"  stroke="#E8C84A" strokeWidth="0.72" strokeLinecap="round" strokeOpacity="0.55" />

      {/* Left mango-hand leaf ───────────────────────────────── */}
      <path
        d="M14 21.5 C12.8 19.8 9.8 17.8 8.0 15.4 C6.4 13.3 6.9 10.8 8.8 10.2 C10.7 9.6 12.6 12.2 13.5 15.0 C14.0 16.7 14.1 19.0 14 21.5Z"
        fill="#2D5A1B"
      />
      <path
        d="M14 21.5 C12.8 19.8 9.8 17.8 8.0 15.4 C6.4 13.3 6.9 10.8 8.8 10.2"
        stroke="#4CAF50" strokeWidth="0.42" strokeOpacity="0.36" strokeLinecap="round" fill="none"
      />

      {/* Right mango-hand leaf ──────────────────────────────── */}
      <path
        d="M14 21.5 C15.2 19.8 18.2 17.8 20.0 15.4 C21.6 13.3 21.1 10.8 19.2 10.2 C17.3 9.6 15.4 12.2 14.5 15.0 C14.0 16.7 13.9 19.0 14 21.5Z"
        fill="#2D5A1B"
      />
      <path
        d="M14 21.5 C15.2 19.8 18.2 17.8 20.0 15.4 C21.6 13.3 21.1 10.8 19.2 10.2"
        stroke="#4CAF50" strokeWidth="0.42" strokeOpacity="0.36" strokeLinecap="round" fill="none"
      />

      {/* Earth arc + rangoli dots ───────────────────────────── */}
      <path d="M8.5 28 Q14 29.5 19.5 28"
        stroke="#E8C84A" strokeWidth="0.75" strokeLinecap="round" strokeOpacity="0.2" fill="none" />
      <circle cx="10"  cy="30.2" r="0.5" fill="#E8C84A" opacity="0.18" />
      <circle cx="14"  cy="31.2" r="0.5" fill="#E8C84A" opacity="0.18" />
      <circle cx="18"  cy="30.2" r="0.5" fill="#E8C84A" opacity="0.18" />

      {/* ── HYBRID WORDMARK ─────────────────────────────────── */}
      {/* "स्व" — Hindi first · Noto Devanagari Bold · gold */}
      <text
        x="26"
        y="23"
        fontFamily="'Noto Sans Devanagari', 'Mangal', 'Arial Unicode MS', sans-serif"
        fontWeight="700"
        fontSize="17"
        fill="#E8C84A"
        dominantBaseline="auto"
      >
        स्व
      </text>

      {/* "Seva" — English second · Inter ExtraBold · cream */}
      <text
        x="44"
        y="23"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#F5F0E8"
        letterSpacing="-0.025em"
        dominantBaseline="auto"
      >
        Seva
      </text>
    </svg>
  );
}
