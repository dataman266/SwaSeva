import React, { useEffect, useRef, useState } from 'react';
import SectionReveal from './SectionReveal.tsx';

interface StatCardProps {
  value: string;           // e.g. "500+"
  unit?: string;           // e.g. "Farmers" or "Cities"
  description?: string;    // e.g. "registered on the platform"
  theme?: 'dark' | 'light';
  delay?: number;
}

/**
 * FarmMinerals-style oversized stat display.
 * Large lightweight number + unit label + optional description.
 */
export default function StatCard({
  value,
  unit,
  description,
  theme = 'dark',
  delay = 0,
}: StatCardProps) {
  const isDark = theme === 'dark';

  return (
    <SectionReveal delay={delay} className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span
          className={`font-light leading-none tracking-[-0.04em] ${isDark ? 'text-[#F5F0E8]' : 'text-[#0A1A0A]'}`}
          style={{ fontSize: 'clamp(44px, 12vw, 64px)' }}
        >
          {value}
        </span>
        {unit && (
          <span
            className={`text-sm font-medium tracking-[0.08em] uppercase ${isDark ? 'text-[#E8C84A]' : 'text-[#2E7D32]'}`}
          >
            {unit}
          </span>
        )}
      </div>
      {description && (
        <p
          className={`text-[13px] font-light leading-snug ${isDark ? 'text-[rgba(245,240,232,0.5)]' : 'text-[rgba(10,26,10,0.5)]'}`}
        >
          {description}
        </p>
      )}
    </SectionReveal>
  );
}
