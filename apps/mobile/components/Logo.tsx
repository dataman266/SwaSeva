import React from 'react';

/**
 * Swaseva logo — integrated pill badge
 *
 * Single unified pill mark. Nothing is separate from the badge.
 *
 * Left zone:  Compact icon — Surya sun (5 rays), wheat stem, paired
 *             mango-hand leaves with edge highlights, earth arc + rangoli dots.
 * Right zone: Hybrid wordmark on one baseline:
 *               "Swa"  — Inter ExtraBold, cream   (Latin half of the name)
 *               "सेवा" — Noto Devanagari Bold, gold (Hindi half of the name)
 *             Together they read as one word across two scripts.
 *
 * The pill border and glow are the only container — no separate circle badge.
 */
export default function Logo({ height = 34 }: { height?: number }) {
  // 148 × 36 aspect ratio
  const width = Math.round(height * (148 / 36));

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 148 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Swaseva"
    >
      <defs>
        <radialGradient id="swPillGlow" cx="20%" cy="28%" r="65%">
          <stop offset="0%"   stopColor="#3A7D22" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#0A1A0A" stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* ── PILL BADGE (unified container) ──────────────────────── */}
      <rect x="0.5" y="0.5" width="147" height="35" rx="17.5" fill="#0A1A0A" />
      <rect x="0.5" y="0.5" width="147" height="35" rx="17.5" fill="url(#swPillGlow)" />
      <rect x="0.5" y="0.5" width="147" height="35" rx="17.5"
        stroke="#E8C84A" strokeWidth="0.55" strokeOpacity="0.3" />

      {/* ── ICON: wheat stem ────────────────────────────────────── */}
      <path d="M18 29 L18 10.5"
        stroke="#E8C84A" strokeWidth="1.15" strokeLinecap="round" strokeOpacity="0.78" />

      {/* Surya sun disc + 5 rays ────────────────────────────────── */}
      <circle cx="18" cy="8.8" r="2.2" fill="#E8C84A" opacity="0.9" />
      <circle cx="18" cy="8.8" r="0.95" fill="#0A1A0A" opacity="0.35" />
      <line x1="18"   y1="5.6"  x2="18"   y2="4.3"  stroke="#E8C84A" strokeWidth="0.78" strokeLinecap="round" strokeOpacity="0.62" />
      <line x1="21.3" y1="6.2"  x2="22.1" y2="5.4"  stroke="#E8C84A" strokeWidth="0.78" strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="22.7" y1="9.1"  x2="24.0" y2="9.1"  stroke="#E8C84A" strokeWidth="0.78" strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="14.7" y1="6.2"  x2="13.9" y2="5.4"  stroke="#E8C84A" strokeWidth="0.78" strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="13.3" y1="9.1"  x2="12.0" y2="9.1"  stroke="#E8C84A" strokeWidth="0.78" strokeLinecap="round" strokeOpacity="0.55" />

      {/* Left mango-hand leaf ───────────────────────────────────── */}
      <path
        d="M18 22 C16.8 20.2 13.3 18.2 11.3 15.6 C9.6 13.5 10.1 10.8 12.1 10.2 C14.1 9.6 16.2 12.3 17.1 15.3 C17.6 17.1 17.9 19.4 18 22Z"
        fill="#2D5A1B"
      />
      <circle cx="11.3" cy="10.9" r="0.85" fill="#3A7522" opacity="0.68" />
      <circle cx="10.1" cy="12.7" r="0.65" fill="#3A7522" opacity="0.48" />
      <path d="M18 22 C15.2 18.8 11.8 16.4 10.8 14.4"
        stroke="#E8C84A" strokeWidth="0.32" strokeOpacity="0.26" strokeLinecap="round" fill="none" />
      <path d="M18 22 C16.8 20.2 13.3 18.2 11.3 15.6 C9.6 13.5 10.1 10.8 12.1 10.2"
        stroke="#4CAF50" strokeWidth="0.45" strokeOpacity="0.36" strokeLinecap="round" fill="none" />

      {/* Right mango-hand leaf ──────────────────────────────────── */}
      <path
        d="M18 22 C19.2 20.2 22.7 18.2 24.7 15.6 C26.4 13.5 25.9 10.8 23.9 10.2 C21.9 9.6 19.8 12.3 18.9 15.3 C18.4 17.1 18.1 19.4 18 22Z"
        fill="#2D5A1B"
      />
      <circle cx="24.7" cy="10.9" r="0.85" fill="#3A7522" opacity="0.68" />
      <circle cx="25.9" cy="12.7" r="0.65" fill="#3A7522" opacity="0.48" />
      <path d="M18 22 C20.8 18.8 24.2 16.4 25.2 14.4"
        stroke="#E8C84A" strokeWidth="0.32" strokeOpacity="0.26" strokeLinecap="round" fill="none" />
      <path d="M18 22 C19.2 20.2 22.7 18.2 24.7 15.6 C26.4 13.5 25.9 10.8 23.9 10.2"
        stroke="#4CAF50" strokeWidth="0.45" strokeOpacity="0.36" strokeLinecap="round" fill="none" />

      {/* Earth arc + rangoli soil dots ──────────────────────────── */}
      <path d="M12.5 28 Q18 29.8 23.5 28"
        stroke="#E8C84A" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.22" fill="none" />
      <circle cx="14.5" cy="30.6" r="0.52" fill="#E8C84A" opacity="0.2" />
      <circle cx="18"   cy="31.6" r="0.52" fill="#E8C84A" opacity="0.2" />
      <circle cx="21.5" cy="30.6" r="0.52" fill="#E8C84A" opacity="0.2" />

      {/* ── SEPARATOR ───────────────────────────────────────────── */}
      <line x1="33" y1="8" x2="33" y2="28"
        stroke="#E8C84A" strokeWidth="0.42" strokeOpacity="0.2" />

      {/* ── HYBRID WORDMARK ─────────────────────────────────────── */}
      {/* "Swa" — Latin half · Inter ExtraBold · cream */}
      <text
        x="39" y="23"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#F5F0E8"
        letterSpacing="-0.025em"
        dominantBaseline="auto"
      >
        Swa
      </text>

      {/* "सेवा" — Hindi half · Noto Sans Devanagari Bold · gold */}
      <text
        x="70" y="23"
        fontFamily="'Noto Sans Devanagari', 'Mangal', 'Arial Unicode MS', sans-serif"
        fontWeight="700"
        fontSize="16"
        fill="#E8C84A"
        dominantBaseline="auto"
      >
        सेवा
      </text>
    </svg>
  );
}
