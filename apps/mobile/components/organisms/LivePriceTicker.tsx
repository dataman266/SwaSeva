import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceItem {
  name: string;
  nameMr: string;
  price: number;
  prevPrice: number;
  unit: string;
  unitMr: string;
  market: string;
}

const PRICE_DATA: PriceItem[] = [
  { name: 'Onion',        nameMr: 'कांदा',       price: 2240, prevPrice: 2100, unit: 'qtl', unitMr: 'क्विंटल', market: 'Lasalgaon'  },
  { name: 'Tomato',       nameMr: 'टोमॅटो',      price:  860, prevPrice:  920, unit: 'qtl', unitMr: 'क्विंटल', market: 'Pune'       },
  { name: 'Potato',       nameMr: 'बटाटा',       price: 1580, prevPrice: 1580, unit: 'qtl', unitMr: 'क्विंटल', market: 'Nashik'     },
  { name: 'Soybean',      nameMr: 'सोयाबीन',     price: 4620, prevPrice: 4400, unit: 'qtl', unitMr: 'क्विंटल', market: 'Latur'      },
  { name: 'Wheat',        nameMr: 'गहू',          price: 2275, prevPrice: 2250, unit: 'qtl', unitMr: 'क्विंटल', market: 'Solapur'    },
  { name: 'Cotton',       nameMr: 'कापूस',        price: 7200, prevPrice: 7350, unit: 'qtl', unitMr: 'क्विंटल', market: 'Akola'      },
  { name: 'Pomegranate',  nameMr: 'डाळिंब',      price: 8500, prevPrice: 8200, unit: 'qtl', unitMr: 'क्विंटल', market: 'Solapur'    },
  { name: 'Grapes',       nameMr: 'द्राक्षे',     price: 4800, prevPrice: 5100, unit: 'qtl', unitMr: 'क्विंटल', market: 'Nashik'     },
  { name: 'Sugarcane',    nameMr: 'ऊस',           price:  350, prevPrice:  345, unit: 'ton', unitMr: 'टन',      market: 'Kolhapur'   },
  { name: 'Turmeric',     nameMr: 'हळद',          price: 8800, prevPrice: 8600, unit: 'qtl', unitMr: 'क्विंटल', market: 'Sangli'     },
  { name: 'Chilli',       nameMr: 'मिरची',        price: 9200, prevPrice: 9200, unit: 'qtl', unitMr: 'क्विंटल', market: 'Nagpur'     },
  { name: 'Rice',         nameMr: 'तांदूळ',       price: 3100, prevPrice: 3050, unit: 'qtl', unitMr: 'क्विंटल', market: 'Ratnagiri'  },
];

function getChange(price: number, prev: number) {
  const diff = price - prev;
  const pct  = ((diff / prev) * 100).toFixed(1);
  return { diff, pct: parseFloat(pct) };
}

interface LivePriceTickerProps {
  isMr: boolean;
}

export default function LivePriceTicker({ isMr }: LivePriceTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const posRef  = useRef(0);
  const rafRef  = useRef<number>(0);

  // Simple JS scroll so we can pause on touch
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.5; // px per frame
    let lastTime = 0;

    const step = (ts: number) => {
      if (!paused) {
        const dt = ts - lastTime || 16;
        lastTime = ts;
        posRef.current += speed * (dt / 16);
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current -= half;
        track.style.transform = `translateX(-${posRef.current}px)`;
      } else {
        lastTime = ts;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  // Duplicate items for seamless loop
  const items = [...PRICE_DATA, ...PRICE_DATA];

  return (
    <div
      style={{
        background: '#0D1F0D',
        borderBottom: '1px solid rgba(245,240,232,0.07)',
        borderTop: '1px solid rgba(245,240,232,0.07)',
        padding: '0.5rem 0',
        overflow: 'hidden',
      }}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0 1rem 0.4rem',
      }}>
        <span style={{
          fontSize: '8px', fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#4A8C2A',
        }}>
          {isMr ? 'मंडी भाव — आज' : 'Mandi Rates — Today'}
        </span>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#4A8C2A',
          boxShadow: '0 0 0 3px rgba(74,140,42,0.2)',
          animation: 'pulse 2s infinite',
          display: 'inline-block',
          flexShrink: 0,
        }} />
      </div>

      {/* Scrolling strip */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '0.625rem',
            paddingLeft: '1rem',
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {items.map((item, i) => {
            const { diff, pct } = getChange(item.price, item.prevPrice);
            const up   = diff > 0;
            const flat = diff === 0;
            const color = flat ? 'rgba(245,240,232,0.4)' : up ? '#4A8C2A' : '#E57373';

            return (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  background: 'rgba(245,240,232,0.04)',
                  border: '1px solid rgba(245,240,232,0.07)',
                  borderRadius: '0.625rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Name */}
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#F5F0E8' }}>
                  {isMr ? item.nameMr : item.name}
                </span>

                {/* Divider */}
                <span style={{ width: 1, height: 12, background: 'rgba(245,240,232,0.1)', flexShrink: 0 }} />

                {/* Price */}
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#F5F0E8', letterSpacing: '-0.01em' }}>
                  ₹{item.price.toLocaleString('en-IN')}
                  <span style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(245,240,232,0.4)', marginLeft: 2 }}>
                    /{isMr ? item.unitMr : item.unit}
                  </span>
                </span>

                {/* Change */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {flat
                    ? <Minus size={10} style={{ color }} />
                    : up
                    ? <TrendingUp size={10} style={{ color }} />
                    : <TrendingDown size={10} style={{ color }} />}
                  <span style={{ fontSize: '10px', fontWeight: 500, color }}>
                    {flat ? '—' : `${up ? '+' : ''}${pct}%`}
                  </span>
                </div>

                {/* Market name */}
                <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.3)', fontWeight: 300 }}>
                  {item.market}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
