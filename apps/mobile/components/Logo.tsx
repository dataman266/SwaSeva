import React from 'react';

/**
 * AplaAgriMart logo — FarmMinerals palette
 *
 * Icon mark:  Circular badge with a sprouting seedling (wheat grains + mango-
 *             leaf shapes) and rangoli-inspired accent dots.
 * Wordmark:   "अपला" in Noto Sans Devanagari ExtraBold + "AGRIMART" in Inter
 *             spaced caps below it.
 */
export default function Logo({ height = 34 }: { height?: number }) {
  // Maintain 155:36 aspect ratio
  const width = Math.round(height * (155 / 36));

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 155 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Apla AgriMart"
    >
      {/* ── BADGE BACKGROUND ───────────────────────────────────── */}
      {/* Deep-dark fill */}
      <circle cx="18" cy="18" r="17" fill="#0A1A0A" />
      {/* Subtle radial highlight (top-left) */}
      <circle cx="18" cy="18" r="17" fill="url(#badgeGlow)" />
      {/* Outer beige ring */}
      <circle cx="18" cy="18" r="16.8" fill="none" stroke="#D4C4A0" strokeWidth="0.55" strokeOpacity="0.5" />
      {/* Inner dashed accent ring */}
      <circle cx="18" cy="18" r="13.6" fill="none" stroke="#D4C4A0" strokeWidth="0.3" strokeOpacity="0.18" strokeDasharray="1.4 3.2" />

      {/* ── RANGOLI DOTS at cardinal points of inner ring ──────── */}
      <circle cx="18"    cy="4.4"  r="0.85" fill="#D4C4A0" opacity="0.35" />
      <circle cx="31.6"  cy="18"   r="0.85" fill="#D4C4A0" opacity="0.35" />
      <circle cx="18"    cy="31.6" r="0.85" fill="#D4C4A0" opacity="0.35" />
      <circle cx="4.4"   cy="18"   r="0.85" fill="#D4C4A0" opacity="0.35" />
      {/* Diagonal dots */}
      <circle cx="27.2"  cy="8.8"  r="0.55" fill="#D4C4A0" opacity="0.2" />
      <circle cx="27.2"  cy="27.2" r="0.55" fill="#D4C4A0" opacity="0.2" />
      <circle cx="8.8"   cy="27.2" r="0.55" fill="#D4C4A0" opacity="0.2" />
      <circle cx="8.8"   cy="8.8"  r="0.55" fill="#D4C4A0" opacity="0.2" />

      {/* ── SPROUT STEM ────────────────────────────────────────── */}
      <path
        d="M18 28.5 L18 12"
        stroke="#D4C4A0"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeOpacity="0.82"
      />

      {/* ── LEFT MANGO LEAF ────────────────────────────────────── */}
      <path
        d="M18 21.5 C16.8 19.8 13.2 18.2 11 15.8 C9.2 13.8 9.8 10.8 12 10.2 C14.3 9.6 16.5 12.3 17.4 15.4 C17.8 17.2 17.9 19.2 18 21.5Z"
        fill="#2D5A1B"
      />
      {/* Left leaf vein */}
      <path
        d="M18 21.5 C15.5 18.5 12 16.5 11 14.8"
        stroke="#D4C4A0"
        strokeWidth="0.35"
        strokeOpacity="0.28"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left leaf highlight edge */}
      <path
        d="M18 21.5 C16.8 19.8 13.2 18.2 11 15.8 C9.2 13.8 9.8 10.8 12 10.2"
        stroke="#4A8C2A"
        strokeWidth="0.5"
        strokeOpacity="0.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── RIGHT MANGO LEAF ───────────────────────────────────── */}
      <path
        d="M18 21.5 C19.2 19.8 22.8 18.2 25 15.8 C26.8 13.8 26.2 10.8 24 10.2 C21.7 9.6 19.5 12.3 18.6 15.4 C18.2 17.2 18.1 19.2 18 21.5Z"
        fill="#2D5A1B"
      />
      {/* Right leaf vein */}
      <path
        d="M18 21.5 C20.5 18.5 24 16.5 25 14.8"
        stroke="#D4C4A0"
        strokeWidth="0.35"
        strokeOpacity="0.28"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18 21.5 C19.2 19.8 22.8 18.2 25 15.8 C26.8 13.8 26.2 10.8 24 10.2"
        stroke="#4A8C2A"
        strokeWidth="0.5"
        strokeOpacity="0.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── WHEAT / GRAIN HEADS ────────────────────────────────── */}
      {/* Left grain (tilted left) */}
      <ellipse cx="15.2" cy="9.8" rx="1.65" ry="2.7" fill="#D4C4A0" opacity="0.88" transform="rotate(-18 15.2 9.8)" />
      {/* Center grain (tallest, upright) */}
      <ellipse cx="18" cy="8" rx="1.75" ry="3.1" fill="#D4C4A0" />
      {/* Right grain (tilted right) */}
      <ellipse cx="20.8" cy="9.8" rx="1.65" ry="2.7" fill="#D4C4A0" opacity="0.88" transform="rotate(18 20.8 9.8)" />

      {/* Grain center crease lines */}
      <line x1="18"   y1="6.2"  x2="18"   y2="11"   stroke="#0A1A0A" strokeWidth="0.45" strokeOpacity="0.4" />
      <line x1="15.2" y1="8.2"  x2="15.2" y2="12.2" stroke="#0A1A0A" strokeWidth="0.4"  strokeOpacity="0.35" transform="rotate(-18 15.2 9.8)" />
      <line x1="20.8" y1="8.2"  x2="20.8" y2="12.2" stroke="#0A1A0A" strokeWidth="0.4"  strokeOpacity="0.35" transform="rotate(18 20.8 9.8)" />

      {/* ── SOIL / GROUND ──────────────────────────────────────── */}
      <path
        d="M11.5 28.5 Q18 30.5 24.5 28.5"
        stroke="#D4C4A0"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeOpacity="0.28"
        fill="none"
      />
      {/* Soil dots */}
      <circle cx="13.5" cy="30.8" r="0.65" fill="#D4C4A0" opacity="0.18" />
      <circle cx="18"   cy="31.8" r="0.65" fill="#D4C4A0" opacity="0.18" />
      <circle cx="22.5" cy="30.8" r="0.65" fill="#D4C4A0" opacity="0.18" />

      {/* ── DIVIDER ────────────────────────────────────────────── */}
      <line x1="41.5" y1="7" x2="41.5" y2="29" stroke="#D4C4A0" strokeWidth="0.45" strokeOpacity="0.22" />

      {/* ── WORDMARK ───────────────────────────────────────────── */}
      {/* "अपला" — Noto Sans Devanagari ExtraBold */}
      <text
        x="49"
        y="21"
        fontFamily="'Noto Sans Devanagari', 'Mangal', 'Arial Unicode MS', sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#F5F0E8"
        dominantBaseline="auto"
      >
        अपला
      </text>

      {/* "AGRIMART" — Inter spaced caps */}
      <text
        x="50"
        y="31"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="400"
        fontSize="9.5"
        fill="#D4C4A0"
        letterSpacing="0.18em"
        dominantBaseline="auto"
      >
        AGRIMART
      </text>

      {/* ── DEFS ───────────────────────────────────────────────── */}
      <defs>
        <radialGradient id="badgeGlow" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#2D5A1B" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0A1A0A" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
