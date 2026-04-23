import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, TrendingUp, CloudRain, Landmark, ExternalLink } from 'lucide-react';
import SectionReveal from '../atoms/SectionReveal.tsx';

/** Opens URL in the system browser — works in Capacitor WebView and regular browsers. */
function openUrl(url: string) {
  window.open(url, '_system');
}

// Backend URL — set VITE_API_URL in .env for production deployment
const API_BASE = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ?? 'http://localhost:3000';

// ── Types ─────────────────────────────────────────────────────────────────────

type NewsCategory = 'market' | 'weather' | 'scheme' | 'general';

interface NewsItem {
  id: string;
  titleEn: string;
  titleMr: string;
  category: NewsCategory;
  date: string;        // human-readable
  source: string;
  url?: string;
  isLive?: boolean;
}

interface FarmingNewsSectionProps {
  lang: 'en' | 'mr';
  location: string;   // city name from geolocation
}

// ── Static fallback — curated Maharashtra farming news ────────────────────────

const STATIC_NEWS: NewsItem[] = [
  {
    id: 'n1',
    titleEn: 'Onion prices rise to ₹1,200/qtl at Lasalgaon APMC — strong export demand',
    titleMr: 'लासलगाव APMC मध्ये कांद्याचे भाव ₹१,२०० प्रति क्विंटल — निर्यात मागणीमुळे वाढ',
    category: 'market',
    date: 'आज / Today',
    source: 'APMC Nashik',
    url: 'https://www.apmc.biz/',
  },
  {
    id: 'n2',
    titleEn: 'IMD forecasts above-normal monsoon for Maharashtra; sowing season expected on time',
    titleMr: 'महाराष्ट्रात सामान्यापेक्षा जास्त पाऊस — IMD अंदाज; पेरणी वेळेत होण्याची शक्यता',
    category: 'weather',
    date: 'काल / Yesterday',
    source: 'IMD Mumbai',
    url: 'https://mausam.imd.gov.in/pune/',
  },
  {
    id: 'n3',
    titleEn: 'PM Kisan 18th instalment: ₹2,000 to be credited; check eligibility now',
    titleMr: 'PM किसान १८वा हप्ता: ₹२,०००  थेट खात्यात — पात्रता आत्ताच तपासा',
    category: 'scheme',
    date: '२ दिवसांपूर्वी / 2d ago',
    source: 'Ministry of Agriculture',
    url: 'https://pmkisan.gov.in/',
  },
  {
    id: 'n4',
    titleEn: 'Soybean MSP raised to ₹4,892/qtl for Kharif 2025 — cabinet approval',
    titleMr: 'खरीप २०२५ साठी सोयाबीनचा MSP ₹४,८९२/क्विंटल — मंत्रिमंडळ मंजुरी',
    category: 'market',
    date: '३ दिवसांपूर्वी / 3d ago',
    source: 'CACP',
    url: 'https://cacp.dacnet.nic.in/',
  },
  {
    id: 'n5',
    titleEn: 'Drip irrigation subsidy for small farmers — up to 80% via MahaDBT portal',
    titleMr: 'लहान शेतकऱ्यांसाठी ठिबक सिंचन अनुदान — MahaDBT द्वारे ८०% पर्यंत सहाय्य',
    category: 'scheme',
    date: '५ दिवसांपूर्वी / 5d ago',
    source: 'MahaDBT',
    url: 'https://mahadbt.maharashtra.gov.in/',
  },
  {
    id: 'n6',
    titleEn: 'Tur (pigeon pea) arrivals surge in Latur; prices soften to ₹6,100/qtl',
    titleMr: 'लातूरमध्ये तूर आवक वाढली; दर ₹६,१०० प्रति क्विंटलवर आले',
    category: 'market',
    date: '१ आठवड्यापूर्वी / 1w ago',
    source: 'APMC Latur',
    url: 'https://www.apmc.biz/',
  },
];

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORY_META: Record<NewsCategory, { labelEn: string; labelMr: string; color: string; icon: React.ElementType }> = {
  market:  { labelEn: 'Market Price', labelMr: 'बाजारभाव',    color: '#2E7D32', icon: TrendingUp },
  weather: { labelEn: 'Weather',      labelMr: 'हवामान',      color: '#1A3D5A', icon: CloudRain  },
  scheme:  { labelEn: 'Govt Scheme',  labelMr: 'सरकारी योजना', color: '#5A3A1A', icon: Landmark  },
  general: { labelEn: 'News',         labelMr: 'बातमी',       color: '#3A1A5A', icon: Newspaper  },
};

// ── rss2json: second-tier fallback (only when backend unreachable) ────────────

const RSS_URL  = 'https://agrowon.com/feed/';
const RSS2JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=6`;

function guessCategory(title: string): NewsCategory {
  const t = title.toLowerCase();
  if (t.includes('पाऊस') || t.includes('हवामान') || t.includes('rain') || t.includes('weather') || t.includes('monsoon')) return 'weather';
  if (t.includes('योजना') || t.includes('अनुदान') || t.includes('scheme') || t.includes('subsidy') || t.includes('msp') || t.includes('kisan')) return 'scheme';
  if (t.includes('भाव') || t.includes('दर') || t.includes('price') || t.includes('apmc') || t.includes('market')) return 'market';
  return 'general';
}

function relativeDate(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 3)  return 'आत्ता / Just now';
    if (hours < 24) return `${hours} तास / ${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7)  return `${days} दिवस / ${days}d ago`;
    return `${Math.floor(days / 7)} आठवडा / ${Math.floor(days / 7)}w ago`;
  } catch {
    return '';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FarmingNewsSection({ lang, location }: FarmingNewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>(STATIC_NEWS);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const isMr = lang === 'mr';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function loadNews() {
      // ── Tier 1: AgriMart backend (cached, no rate limits) ────────────────
      try {
        const params = location && !['Detecting...', 'Mandi', 'Rural MH'].includes(location)
          ? `?location=${encodeURIComponent(location)}`
          : '';
        const res  = await fetch(`${API_BASE}/news/farming${params}`, { signal: AbortSignal.timeout(6_000) });
        const json = await res.json();
        if (!cancelled && json.ok && Array.isArray(json.items) && json.items.length > 0) {
          setNews(json.items as NewsItem[]);
          setIsLive(true);
          setLoading(false);
          return;
        }
      } catch { /* backend not running — fall through */ }

      // ── Tier 2: rss2json direct (dev / backend down) ──────────────────────
      try {
        const res  = await fetch(RSS2JSON, { signal: AbortSignal.timeout(6_000) });
        const data = await res.json();
        if (!cancelled && data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
          const fetched: NewsItem[] = data.items.slice(0, 6).map(
            (item: { title: string; pubDate: string; link: string }, i: number) => ({
              id:       `live-${i}`,
              titleEn:  item.title,
              titleMr:  item.title,
              category: guessCategory(item.title),
              date:     relativeDate(item.pubDate),
              source:   'Agrowon',
              url:      item.link,
              isLive:   true,
            }),
          );
          setNews(fetched);
          setIsLive(true);
          setLoading(false);
          return;
        }
      } catch { /* fall through to static */ }

      // ── Tier 3: static curated fallback ──────────────────────────────────
      if (!cancelled) setLoading(false);
    }

    loadNews();
    return () => { cancelled = true; };
  }, [location]);

  // City name sanitised for display
  const city = ['Detecting...', 'Mandi', 'Rural MH'].includes(location) ? 'Maharashtra' : location;

  return (
    <section className="py-12 overflow-hidden" style={{ background: '#0D170D' }}>

      {/* Header */}
      <SectionReveal className="flex items-baseline justify-between px-6 mb-6">
        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.35)] mb-1">
            {isMr ? `${city} क्षेत्र` : `${city} Region`}
          </p>
          <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>
            {isMr ? 'शेती बातम्या' : 'Farming News'}
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          {isLive && !loading && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#6FCF4A] animate-pulse" />
          )}
          <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.4)]">
            {loading ? (isMr ? 'लोड होत आहे...' : 'Loading…') : isLive ? 'LIVE' : (isMr ? 'क्युरेटेड' : 'Curated')}
          </span>
        </div>
      </SectionReveal>

      {/* Horizontal scroll cards */}
      <div className="flex gap-4 px-6 overflow-x-auto scrollbar-hide pb-2">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : news.map((item, idx) => (
              <NewsCard key={item.id} item={item} isMr={isMr} index={idx} />
            ))
        }
      </div>

      {/* Agrowon attribution when live */}
      {isLive && !loading && (
        <p className="px-6 mt-4 text-[10px] text-[rgba(245,240,232,0.2)] font-light" style={{ letterSpacing: '0.04em' }}>
          {isMr ? 'स्रोत: Agrowon' : 'Source: Agrowon'}
        </p>
      )}
    </section>
  );
}

// ── NewsCard ──────────────────────────────────────────────────────────────────

function NewsCard({ item, isMr, index }: { item: NewsItem; isMr: boolean; index: number }) {
  const meta  = CATEGORY_META[item.category];
  const Icon  = meta.icon;
  const title = isMr ? item.titleMr : item.titleEn;

  const badgeColor = item.category === 'weather' ? '#5AC8FA'
    : item.category === 'scheme' ? '#D4A04A'
    : '#6FCF4A';

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={title}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
      whileTap={{ scale: 0.97 }}
      className="flex-shrink-0 flex flex-col justify-between rounded-2xl p-4 cursor-pointer select-none"
      style={{
        width: 220,
        minHeight: 160,
        background: '#162B16',
        border: '1px solid rgba(245,240,232,0.07)',
      }}
      onClick={() => item.url && openUrl(item.url)}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && item.url) openUrl(item.url); }}
    >
      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-[0.1em] uppercase"
          style={{ background: `${meta.color}33`, color: badgeColor }}
        >
          <Icon size={9} strokeWidth={2} />
          {isMr ? meta.labelMr : meta.labelEn}
        </span>
        {item.url && (
          <ExternalLink size={11} strokeWidth={1.5} style={{ color: 'rgba(245,240,232,0.2)' }} />
        )}
      </div>

      {/* Headline */}
      <p className="text-[#F5F0E8] font-light leading-snug flex-1" style={{ fontSize: '13px', letterSpacing: '-0.01em' }}>
        {title.length > 90 ? `${title.slice(0, 90)}…` : title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-[rgba(245,240,232,0.3)]">{item.source}</span>
        <span className="text-[10px] text-[rgba(245,240,232,0.25)]">{item.date}</span>
      </div>
    </motion.div>
  );
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="flex-shrink-0 rounded-2xl p-4 animate-pulse"
      style={{ width: 220, minHeight: 160, background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
    >
      <div className="h-4 w-20 rounded-full bg-[rgba(245,240,232,0.06)] mb-3" />
      <div className="h-3 w-full rounded bg-[rgba(245,240,232,0.06)] mb-2" />
      <div className="h-3 w-4/5 rounded bg-[rgba(245,240,232,0.06)] mb-2" />
      <div className="h-3 w-3/5 rounded bg-[rgba(245,240,232,0.06)]" />
      <div className="mt-6 flex justify-between">
        <div className="h-3 w-14 rounded bg-[rgba(245,240,232,0.04)]" />
        <div className="h-3 w-10 rounded bg-[rgba(245,240,232,0.04)]" />
      </div>
    </div>
  );
}
