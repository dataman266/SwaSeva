import React, { useEffect, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

interface PriceItem {
  name: string;
  nameMr: string;
  price: number;
  prevPrice: number;
  unit: string;
  unitMr: string;
  market: string;
  lat: number;
  lng: number;
  sourceUrl: string;
}

const PRICE_DATA: PriceItem[] = [
  { name: 'Onion',       nameMr: 'कांदा',      price: 2240, prevPrice: 2100, unit: 'qtl', unitMr: 'क्विंटल', market: 'Lasalgaon', lat: 20.12, lng: 74.38, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Onion&Tx_State=MH&Tx_Market=Lasalgaon' },
  { name: 'Tomato',      nameMr: 'टोमॅटो',     price:  860, prevPrice:  920, unit: 'qtl', unitMr: 'क्विंटल', market: 'Pune',      lat: 18.52, lng: 73.86, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Tomato&Tx_State=MH&Tx_Market=Pune' },
  { name: 'Potato',      nameMr: 'बटाटा',      price: 1580, prevPrice: 1580, unit: 'qtl', unitMr: 'क्विंटल', market: 'Nashik',    lat: 20.01, lng: 73.79, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Potato&Tx_State=MH&Tx_Market=Nashik' },
  { name: 'Soybean',     nameMr: 'सोयाबीन',    price: 4620, prevPrice: 4400, unit: 'qtl', unitMr: 'क्विंटल', market: 'Latur',     lat: 18.40, lng: 76.56, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Soyabean&Tx_State=MH&Tx_Market=Latur' },
  { name: 'Wheat',       nameMr: 'गहू',         price: 2275, prevPrice: 2250, unit: 'qtl', unitMr: 'क्विंटल', market: 'Solapur',   lat: 17.68, lng: 75.91, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Wheat&Tx_State=MH&Tx_Market=Solapur' },
  { name: 'Cotton',      nameMr: 'कापूस',       price: 7200, prevPrice: 7350, unit: 'qtl', unitMr: 'क्विंटल', market: 'Akola',     lat: 20.71, lng: 77.00, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Cotton&Tx_State=MH&Tx_Market=Akola' },
  { name: 'Pomegranate', nameMr: 'डाळिंब',     price: 8500, prevPrice: 8200, unit: 'qtl', unitMr: 'क्विंटल', market: 'Solapur',   lat: 17.68, lng: 75.91, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Pomegranate&Tx_State=MH&Tx_Market=Solapur' },
  { name: 'Grapes',      nameMr: 'द्राक्षे',    price: 4800, prevPrice: 5100, unit: 'qtl', unitMr: 'क्विंटल', market: 'Nashik',    lat: 20.01, lng: 73.79, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Grapes&Tx_State=MH&Tx_Market=Nashik' },
  { name: 'Sugarcane',   nameMr: 'ऊस',          price:  350, prevPrice:  345, unit: 'ton', unitMr: 'टन',      market: 'Kolhapur',  lat: 16.70, lng: 74.24, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Sugarcane&Tx_State=MH&Tx_Market=Kolhapur' },
  { name: 'Turmeric',    nameMr: 'हळद',         price: 8800, prevPrice: 8600, unit: 'qtl', unitMr: 'क्विंटल', market: 'Sangli',    lat: 16.86, lng: 74.57, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Turmeric&Tx_State=MH&Tx_Market=Sangli' },
  { name: 'Chilli',      nameMr: 'मिरची',       price: 9200, prevPrice: 9200, unit: 'qtl', unitMr: 'क्विंटल', market: 'Nagpur',    lat: 21.15, lng: 79.09, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Chilli&Tx_State=MH&Tx_Market=Nagpur' },
  { name: 'Rice',        nameMr: 'तांदूळ',      price: 3100, prevPrice: 3050, unit: 'qtl', unitMr: 'क्विंटल', market: 'Ratnagiri', lat: 16.99, lng: 73.30, sourceUrl: 'https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=Rice&Tx_State=MH&Tx_Market=Ratnagiri' },
];

// Lat/lng for common Indian cities — used to compute proximity to mandi markets
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  nashik:      { lat: 20.01, lng: 73.79 },
  pune:        { lat: 18.52, lng: 73.86 },
  mumbai:      { lat: 19.08, lng: 72.88 },
  nagpur:      { lat: 21.15, lng: 79.09 },
  aurangabad:  { lat: 19.88, lng: 75.34 },
  solapur:     { lat: 17.68, lng: 75.91 },
  kolhapur:    { lat: 16.70, lng: 74.24 },
  sangli:      { lat: 16.86, lng: 74.57 },
  latur:       { lat: 18.40, lng: 76.56 },
  akola:       { lat: 20.71, lng: 77.00 },
  ratnagiri:   { lat: 16.99, lng: 73.30 },
  amravati:    { lat: 20.93, lng: 77.75 },
  jalgaon:     { lat: 21.00, lng: 75.56 },
  dhule:       { lat: 20.90, lng: 74.77 },
  // Madhya Pradesh
  indore:      { lat: 22.72, lng: 75.86 },
  bhopal:      { lat: 23.26, lng: 77.41 },
  ujjain:      { lat: 23.18, lng: 75.78 },
  jabalpur:    { lat: 23.18, lng: 79.94 },
  gwalior:     { lat: 26.22, lng: 78.18 },
  // North India
  delhi:       { lat: 28.66, lng: 77.23 },
  jaipur:      { lat: 26.91, lng: 75.79 },
  lucknow:     { lat: 26.85, lng: 80.95 },
  kanpur:      { lat: 26.45, lng: 80.33 },
  varanasi:    { lat: 25.32, lng: 83.01 },
  // South India
  bangalore:   { lat: 12.97, lng: 77.59 },
  hyderabad:   { lat: 17.38, lng: 78.49 },
  chennai:     { lat: 13.08, lng: 80.27 },
  // West India
  ahmedabad:   { lat: 23.03, lng: 72.58 },
  surat:       { lat: 21.17, lng: 72.83 },
  // East India
  kolkata:     { lat: 22.57, lng: 88.36 },
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function resolveUserCoords(location: string): { lat: number; lng: number } | null {
  if (!location) return null;
  const normalized = location.toLowerCase().trim();
  // Direct match first
  if (CITY_COORDS[normalized]) return CITY_COORDS[normalized];
  // Partial match (e.g. "Nashik, Maharashtra" → "nashik")
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (normalized.includes(city)) return coords;
  }
  return null;
}

function getChange(price: number, prev: number) {
  const diff = price - prev;
  const pct  = ((diff / prev) * 100).toFixed(1);
  return { diff, pct: parseFloat(pct) };
}

interface LivePriceTickerProps {
  isMr: boolean;
  location?: string;
}

export default function LivePriceTicker({ isMr, location = '' }: LivePriceTickerProps) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const posRef    = useRef(0);

  // Sort PRICE_DATA by distance to user's location (nearest first)
  const sorted = useMemo<PriceItem[]>(() => {
    const userCoords = resolveUserCoords(location);
    if (!userCoords) return PRICE_DATA;
    return [...PRICE_DATA].sort(
      (a, b) =>
        haversineKm(userCoords.lat, userCoords.lng, a.lat, a.lng) -
        haversineKm(userCoords.lat, userCoords.lng, b.lat, b.lng)
    );
  }, [location]);

  // Nearest market name (for the header label)
  const nearestMarket = useMemo(() => {
    const userCoords = resolveUserCoords(location);
    if (!userCoords || sorted.length === 0) return null;
    return sorted[0].market;
  }, [location, sorted]);

  // Single RAF loop — empty deps so it never restarts on re-render.
  // Reads pausedRef.current directly; lastTime resets to null when paused
  // so the first resumed frame uses dt=16 instead of a huge accumulated gap.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const speed = 0.5;
    let lastTime: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (!pausedRef.current) {
        if (lastTime === null) lastTime = ts;
        const dt = Math.min(ts - lastTime, 50); // clamp — prevents giant jumps after tab switch
        lastTime = ts;
        posRef.current += speed * (dt / 16);
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current -= half;
        track.style.transform = `translateX(-${posRef.current}px)`;
      } else {
        lastTime = null; // reset so resume starts from a clean dt
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTap = (sourceUrl: string) => {
    window.open(sourceUrl, '_blank', 'noopener,noreferrer');
  };

  // Duplicate for seamless loop
  const items = [...sorted, ...sorted];

  return (
    <div
      style={{
        background: '#0D1F0D',
        borderBottom: '1px solid rgba(245,240,232,0.07)',
        borderTop: '1px solid rgba(245,240,232,0.07)',
        padding: '0.5rem 0',
        overflow: 'hidden',
      }}
      onPointerDown={() => { pausedRef.current = true; }}
      onPointerUp={() => { pausedRef.current = false; }}
      onPointerLeave={() => { pausedRef.current = false; }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem 0.4rem' }}>
        <span style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4CAF50' }}>
          {isMr ? 'मंडी भाव — आज' : 'Mandi Rates — Today'}
        </span>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#4CAF50', boxShadow: '0 0 0 3px rgba(74,140,42,0.2)',
          animation: 'pulse 2s infinite', display: 'inline-block', flexShrink: 0,
        }} />
        {nearestMarket && (
          <span style={{ fontSize: '8px', color: 'rgba(245,240,232,0.35)', fontWeight: 400, letterSpacing: '0.06em' }}>
            · {isMr ? 'जवळचा बाजार' : 'nearest first'}: {nearestMarket}
          </span>
        )}
        {/* Tap hint */}
        <span style={{
          marginLeft: 'auto', marginRight: '0.75rem',
          fontSize: '8px', color: 'rgba(245,240,232,0.28)',
          fontWeight: 400, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <ExternalLink size={8} />
          {isMr ? 'दर तपासा' : 'tap to verify'}
        </span>
      </div>

      {/* Scrolling strip */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div
          ref={trackRef}
          style={{ display: 'flex', gap: '0.625rem', paddingLeft: '1rem', width: 'max-content', willChange: 'transform' }}
        >
          {items.map((item, i) => {
            const { diff, pct } = getChange(item.price, item.prevPrice);
            const up   = diff > 0;
            const flat = diff === 0;
            const color = flat ? 'rgba(245,240,232,0.4)' : up ? '#4CAF50' : '#E57373';

            return (
              <button
                key={i}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handleTap(item.sourceUrl)}
                className="active:scale-95 active:opacity-70"
                style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  background: 'rgba(245,240,232,0.04)',
                  border: '1px solid rgba(245,240,232,0.07)',
                  borderRadius: '0.625rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.1s, opacity 0.1s',
                }}
                aria-label={`${isMr ? item.nameMr : item.name} ₹${item.price} — ${isMr ? 'स्रोत उघडा' : 'open source'}`}
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

                {/* Market + source icon */}
                <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.3)', fontWeight: 300 }}>
                  {item.market}
                </span>
                <ExternalLink size={8} style={{ color: 'rgba(245,240,232,0.2)', flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
