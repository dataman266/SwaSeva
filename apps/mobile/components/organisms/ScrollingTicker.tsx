import React from 'react';

interface TickerItem {
  label: string;
  emoji?: string;
}

interface ScrollingTickerProps {
  items: TickerItem[];
  /** Reverse direction for visual layering effect */
  reverse?: boolean;
  /** Optional label above the ticker row */
  heading?: string;
  className?: string;
}

/**
 * FarmMinerals-style infinite horizontal scrolling ticker.
 * Items are duplicated so the loop is seamless.
 * Two rows (normal + reversed) can be stacked for depth.
 */
export default function ScrollingTicker({
  items,
  reverse = false,
  heading,
  className = '',
}: ScrollingTickerProps) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      {heading && (
        <p className="text-center text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.3)] mb-4">
          {heading}
        </p>
      )}

      <div
        className={reverse ? 'ticker-track-r' : 'ticker-track'}
        aria-hidden="true"
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 mx-4 px-5 py-2 rounded-full border border-[rgba(245,240,232,0.1)] whitespace-nowrap"
            style={{ background: 'rgba(245,240,232,0.04)' }}
          >
            {item.emoji && <span className="text-base leading-none">{item.emoji}</span>}
            <span className="text-[12px] font-light tracking-[0.06em] text-[rgba(245,240,232,0.55)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Preset data for AgriMart partner / category ticker ──────────────────────

export const AGRI_TICKER_ITEMS: TickerItem[] = [
  { emoji: '🌾', label: 'Wheat · गहू' },
  { emoji: '🍅', label: 'Tomatoes · टोमॅटो' },
  { emoji: '🥦', label: 'Broccoli · ब्रोकोली' },
  { emoji: '🌱', label: 'Saplings · रोपे' },
  { emoji: '🫘', label: 'Pulses · डाळी' },
  { emoji: '🥭', label: 'Mangoes · आंबे' },
  { emoji: '🧅', label: 'Onions · कांदे' },
  { emoji: '🥔', label: 'Potatoes · बटाटे' },
  { emoji: '🌽', label: 'Corn · मका' },
  { emoji: '🍬', label: 'Sugarcane · ऊस' },
  { emoji: '🌿', label: 'Herbs · औषधी' },
  { emoji: '💧', label: 'Irrigation · सिंचन' },
];

export const PARTNER_TICKER_ITEMS: TickerItem[] = [
  { emoji: '🏅', label: 'Verified Farmers' },
  { emoji: '📦', label: 'Direct Supply' },
  { emoji: '🌡️', label: 'Quality Tested' },
  { emoji: '🔒', label: 'Secure Payments' },
  { emoji: '📍', label: 'Maharashtra · MH' },
  { emoji: '🚜', label: 'Farm Fresh' },
  { emoji: '🤝', label: 'Zero Middlemen' },
  { emoji: '⚡', label: 'Same-Day Dispatch' },
];
