import React from 'react';

/**
 * KrishiSetu logo — FarmMinerals palette
 *
 * Icon mark:  Circular lotus-ring badge.
 *   Top:     Stylised Surya (sun) with 5 rays — divinity, life, Indian identity.
 *   Middle:  Paired mango-leaf "hands" (farmer cupping + seller offering).
 *   Center:  Wheat stem rising through the leaves.
 *   Sides:   Two coin-dots on balance arms — the market/seller element.
 *   Base:    Earth arc + rangoli soil dots.
 *   Ring:    8-petal lotus outer ring — distinctly Indian.
 * Wordmark:  "कृषिसेतु" Noto Sans Devanagari ExtraBold
 *            "KRISHISETU" Inter spaced caps below.
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
      aria-label="KrishiSetu"
    >
      <defs>
        <radialGradient id="ksBadgeGlow" cx="35%" cy="28%" r="65%">
          <stop offset="0%"   stopColor="#3A7D22" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0A1A0A" stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* ── BADGE BACKGROUND ─────────────────────────────────────── */}
      <circle cx="18" cy="18" r="17"   fill="#0A1A0A" />
      <circle cx="18" cy="18" r="17"   fill="url(#ksBadgeGlow)" />

      {/* ── LOTUS PETAL RING (8 petals at r≈15) ─────────────────── */}
      {/* Each petal: small ellipse rotated to point outward from centre */}
      <ellipse cx="18"    cy="3.4"  rx="1.4" ry="2.6" fill="#E8C84A" opacity="0.22" />
      <ellipse cx="28.8"  cy="6.2"  rx="1.4" ry="2.6" fill="#E8C84A" opacity="0.18" transform="rotate(45 28.8 6.2)" />
      <ellipse cx="32.6"  cy="18"   rx="1.4" ry="2.6" fill="#E8C84A" opacity="0.22" transform="rotate(90 32.6 18)" />
      <ellipse cx="28.8"  cy="29.8" rx="1.4" ry="2.6" fill="#E8C84A" opacity="0.18" transform="rotate(135 28.8 29.8)" />
      <ellipse cx="18"    cy="32.6" rx="1.4" ry="2.6" fill="#E8C84A" opacity="0.22" transform="rotate(180 18 32.6)" />
      <ellipse cx="7.2"   cy="29.8" rx="1.4" ry="2.6" fill="#E8C84A" opacity="0.18" transform="rotate(225 7.2 29.8)" />
      <ellipse cx="3.4"   cy="18"   rx="1.4" ry="2.6" fill="#E8C84A" opacity="0.22" transform="rotate(270 3.4 18)" />
      <ellipse cx="7.2"   cy="6.2"  rx="1.4" ry="2.6" fill="#E8C84A" opacity="0.18" transform="rotate(315 7.2 6.2)" />

      {/* ── OUTER RING + INNER DASH RING ─────────────────────────── */}
      <circle cx="18" cy="18" r="16.5" fill="none" stroke="#E8C84A" strokeWidth="0.5"  strokeOpacity="0.48" />
      <circle cx="18" cy="18" r="13.2" fill="none" stroke="#E8C84A" strokeWidth="0.28" strokeOpacity="0.18" strokeDasharray="1.3 3" />

      {/* ── SURYA / SUN (top) — Indian divinity + life force ──────── */}
      {/* Sun disc */}
      <circle cx="18" cy="8.2" r="2.5" fill="#E8C84A" opacity="0.9" />
      {/* 5 rays radiating outward */}
      <line x1="18"    y1="4.5"  x2="18"    y2="3.1"  stroke="#E8C84A" strokeWidth="0.9"  strokeLinecap="round" strokeOpacity="0.65" />
      <line x1="21.6"  y1="5.3"  x2="22.6"  y2="4.3"  stroke="#E8C84A" strokeWidth="0.9"  strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="22.8"  y1="8.8"  x2="24.2"  y2="8.8"  stroke="#E8C84A" strokeWidth="0.9"  strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="14.4"  y1="5.3"  x2="13.4"  y2="4.3"  stroke="#E8C84A" strokeWidth="0.9"  strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="13.2"  y1="8.8"  x2="11.8"  y2="8.8"  stroke="#E8C84A" strokeWidth="0.9"  strokeLinecap="round" strokeOpacity="0.55" />
      {/* Sun inner crease */}
      <circle cx="18" cy="8.2" r="1.1" fill="#0A1A0A" opacity="0.35" />

      {/* ── WHEAT STEM ───────────────────────────────────────────── */}
      <path
        d="M18 28.5 L18 11.5"
        stroke="#E8C84A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.78"
      />

      {/* ── LEFT MANGO-HAND LEAF ──────────────────────────────────── */}
      {/* Leaf body */}
      <path
        d="M18 22 C16.6 20 13 18.2 10.8 15.5 C9 13.4 9.6 10.5 11.8 9.9 C14 9.3 16.2 12 17.2 15.2 C17.7 17 17.9 19.2 18 22Z"
        fill="#2D5A1B"
      />
      {/* Fingertip bumps at leaf tip — the farmer's hand reading */}
      <circle cx="11"   cy="10.6" r="0.9" fill="#3A7522" opacity="0.7" />
      <circle cx="9.8"  cy="12.5" r="0.7" fill="#3A7522" opacity="0.5" />
      {/* Leaf vein */}
      <path d="M18 22 C15.2 18.8 11.8 16.5 10.8 14.5"
        stroke="#E8C84A" strokeWidth="0.35" strokeOpacity="0.28" strokeLinecap="round" fill="none" />
      {/* Leaf edge highlight */}
      <path d="M18 22 C16.6 20 13 18.2 10.8 15.5 C9 13.4 9.6 10.5 11.8 9.9"
        stroke="#4CAF50" strokeWidth="0.5" strokeOpacity="0.38" strokeLinecap="round" fill="none" />

      {/* ── RIGHT MANGO-HAND LEAF ─────────────────────────────────── */}
      <path
        d="M18 22 C19.4 20 23 18.2 25.2 15.5 C27 13.4 26.4 10.5 24.2 9.9 C22 9.3 19.8 12 18.8 15.2 C18.3 17 18.1 19.2 18 22Z"
        fill="#2D5A1B"
      />
      {/* Fingertip bumps */}
      <circle cx="25"   cy="10.6" r="0.9" fill="#3A7522" opacity="0.7" />
      <circle cx="26.2" cy="12.5" r="0.7" fill="#3A7522" opacity="0.5" />
      {/* Vein */}
      <path d="M18 22 C20.8 18.8 24.2 16.5 25.2 14.5"
        stroke="#E8C84A" strokeWidth="0.35" strokeOpacity="0.28" strokeLinecap="round" fill="none" />
      {/* Edge highlight */}
      <path d="M18 22 C19.4 20 23 18.2 25.2 15.5 C27 13.4 26.4 10.5 24.2 9.9"
        stroke="#4CAF50" strokeWidth="0.5" strokeOpacity="0.38" strokeLinecap="round" fill="none" />

      {/* ── TARAZU ARMS (balance scale = seller/market) ───────────── */}
      {/* Left arm — curves gently from stem mid to left coin */}
      <path d="M18 19.5 Q14.5 18.8 12 21.5"
        stroke="#E8C84A" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.65" fill="none" />
      {/* Right arm */}
      <path d="M18 19.5 Q21.5 18.8 24 21.5"
        stroke="#E8C84A" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.65" fill="none" />

      {/* ── COIN DOTS at arm ends (trade/market indicator) ────────── */}
      <circle cx="12"   cy="21.5" r="1.7" fill="#E8C84A" opacity="0.72" />
      <circle cx="12"   cy="21.5" r="0.75" fill="#0A1A0A" opacity="0.45" />
      <circle cx="24"   cy="21.5" r="1.7" fill="#E8C84A" opacity="0.72" />
      <circle cx="24"   cy="21.5" r="0.75" fill="#0A1A0A" opacity="0.45" />

      {/* ── EARTH ARC + SOIL DOTS ─────────────────────────────────── */}
      <path d="M11.5 28.5 Q18 30.5 24.5 28.5"
        stroke="#E8C84A" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.25" fill="none" />
      <circle cx="13.5" cy="30.8" r="0.6" fill="#E8C84A" opacity="0.18" />
      <circle cx="18"   cy="31.8" r="0.6" fill="#E8C84A" opacity="0.18" />
      <circle cx="22.5" cy="30.8" r="0.6" fill="#E8C84A" opacity="0.18" />

      {/* ── DIVIDER ───────────────────────────────────────────────── */}
      <line x1="41.5" y1="7" x2="41.5" y2="29" stroke="#E8C84A" strokeWidth="0.45" strokeOpacity="0.22" />

      {/* ── WORDMARK ──────────────────────────────────────────────── */}
      {/* "कृषिसेतु" — Noto Sans Devanagari ExtraBold */}
      <text
        x="49" y="21"
        fontFamily="'Noto Sans Devanagari', 'Mangal', 'Arial Unicode MS', sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#F5F0E8"
        dominantBaseline="auto"
      >
        कृषिसेतु
      </text>

      {/* "KRISHISETU" — Inter spaced caps */}
      <text
        x="50" y="31"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="400"
        fontSize="9.5"
        fill="#E8C84A"
        letterSpacing="0.18em"
        dominantBaseline="auto"
      >
        KRISHISETU
      </text>
    </svg>
  );
}
