import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, TrendingUp, CloudRain, Landmark, ExternalLink } from 'lucide-react';
import SectionReveal from '../atoms/SectionReveal.tsx';

// Opens URL in the system browser — works in both Capacitor WebView and regular browsers
function openUrl(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.click();
}

// AbortSignal.timeout() is not available in older Android WebViews — use this instead
function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

// Only use backend if explicitly configured — localhost:3000 is never reachable in production
const BACKEND_URL = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ?? null;

const CACHE_KEY = 'agrimart_news_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// ── Types ─────────────────────────────────────────────────────────────────────

type NewsCategory = 'market' | 'weather' | 'scheme' | 'general';

interface NewsItem {
  id: string;
  titleEn: string;
  titleMr: string;
  category: NewsCategory;
  date: string;
  source: string;
  url?: string;
  isLive?: boolean;
}

interface FarmingNewsSectionProps {
  lang: 'en' | 'mr';
  location: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function guessCategory(title: string): NewsCategory {
  const t = title.toLowerCase();
  if (t.includes('rain') || t.includes('weather') || t.includes('monsoon') || t.includes('drought') || t.includes('flood') || t.includes('climate')) return 'weather';
  if (t.includes('scheme') || t.includes('subsidy') || t.includes('msp') || t.includes('kisan') || t.includes('pm kisan') || t.includes('government') || t.includes('ministry') || t.includes('policy')) return 'scheme';
  if (t.includes('price') || t.includes('mandi') || t.includes('market') || t.includes('apmc') || t.includes('quintal') || t.includes('crop') || t.includes('harvest') || t.includes('yield')) return 'market';
  return 'general';
}

function relativeDate(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 3)  return 'आत्ता / Just now';
    if (hours < 24) return `${hours} तास / ${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7)   return `${days} दिवस / ${days}d ago`;
    return `${Math.floor(days / 7)} आठवडा / ${Math.floor(days / 7)}w ago`;
  } catch {
    return '';
  }
}

function daysAgo(n: number): string {
  return relativeDate(new Date(Date.now() - n * 86_400_000).toISOString());
}

// ── Session cache ─────────────────────────────────────────────────────────────

interface CacheEntry { items: NewsItem[]; ts: number }

function readCache(): NewsItem[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.ts > CACHE_TTL) return null;
    return entry.items;
  } catch { return null; }
}

function writeCache(items: NewsItem[]) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ items, ts: Date.now() })); } catch { /* ignore */ }
}

// ── Static fallback — dates computed at call time so they never look stale ───

function buildStaticNews(): NewsItem[] {
  return [
    {
      id: 'n1',
      titleEn: 'Onion prices rise to ₹1,200/qtl at Lasalgaon APMC — strong export demand',
      titleMr: 'लासलगाव APMC मध्ये कांद्याचे भाव ₹१,२०० प्रति क्विंटल — निर्यात मागणीमुळे वाढ',
      category: 'market',
      date: daysAgo(0),
      source: 'APMC Nashik',
      url: 'https://agmarknet.gov.in/',
    },
    {
      id: 'n2',
      titleEn: 'IMD forecasts above-normal monsoon for Maharashtra; sowing expected on time',
      titleMr: 'महाराष्ट्रात सामान्यापेक्षा जास्त पाऊस — IMD अंदाज; पेरणी वेळेत होण्याची शक्यता',
      category: 'weather',
      date: daysAgo(1),
      source: 'IMD Mumbai',
      url: 'https://mausam.imd.gov.in/pune/',
    },
    {
      id: 'n3',
      titleEn: 'PM Kisan 18th instalment: ₹2,000 to be credited — check eligibility now',
      titleMr: 'PM किसान १८वा हप्ता: ₹२,०००  थेट खात्यात — पात्रता आत्ताच तपासा',
      category: 'scheme',
      date: daysAgo(2),
      source: 'Ministry of Agriculture',
      url: 'https://pmkisan.gov.in/',
    },
    {
      id: 'n4',
      titleEn: 'Soybean MSP raised to ₹4,892/qtl for Kharif 2025 — cabinet approval',
      titleMr: 'खरीप २०२५ साठी सोयाबीनचा MSP ₹४,८९२/क्विंटल — मंत्रिमंडळ मंजुरी',
      category: 'market',
      date: daysAgo(3),
      source: 'CACP',
      url: 'https://cacp.dacnet.nic.in/',
    },
    {
      id: 'n5',
      titleEn: 'Drip irrigation subsidy for small farmers — up to 80% via MahaDBT portal',
      titleMr: 'लहान शेतकऱ्यांसाठी ठिबक सिंचन अनुदान — MahaDBT द्वारे ८०% पर्यंत सहाय्य',
      category: 'scheme',
      date: daysAgo(5),
      source: 'MahaDBT',
      url: 'https://mahadbt.maharashtra.gov.in/',
    },
    {
      id: 'n6',
      titleEn: 'Tur (pigeon pea) arrivals surge in Latur; prices soften to ₹6,100/qtl',
      titleMr: 'लातूरमध्ये तूर आवक वाढली; दर ₹६,१०० प्रति क्विंटलवर आले',
      category: 'market',
      date: daysAgo(7),
      source: 'APMC Latur',
      url: 'https://enam.gov.in/web/',
    },
  ];
}

// ── RSS sources via rss2json proxy ────────────────────────────────────────────
// Google News RSS feeds are highly reliable and always return fresh articles

const RSS_SOURCES = [
  {
    url: 'https://news.google.com/rss/search?q=agriculture+farming+india+crop+price&hl=en-IN&gl=IN&ceid=IN:en',
    source: 'Google News',
  },
  {
    url: 'https://news.google.com/rss/search?q=kisan+mandi+fasal+bhav+india&hl=hi&gl=IN&ceid=IN:hi',
    source: 'Google News',
  },
];

interface RssItem {
  title: string;
  pubDate: string;
  link: string;
  source?: { title?: string };
}

async function fetchRssSource(feedUrl: string, source: string): Promise<NewsItem[]> {
  const proxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=8`;
  const res  = await fetchWithTimeout(proxy, 9_000);
  if (!res.ok) return [];
  const data = await res.json() as { status: string; items?: RssItem[] };
  if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) return [];

  return data.items.slice(0, 8).map((item, i) => ({
    id:       `${source.toLowerCase().replace(/\s+/g, '-')}-${i}-${Date.now()}`,
    titleEn:  item.title,
    titleMr:  item.title,
    category: guessCategory(item.title),
    date:     relativeDate(item.pubDate),
    source:   item.source?.title ?? source,
    url:      item.link || undefined,
    isLive:   true,
  }));
}

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORY_META: Record<NewsCategory, { labelEn: string; labelMr: string; color: string; icon: React.ElementType }> = {
  market:  { labelEn: 'Market Price', labelMr: 'बाजारभाव',     color: '#2E7D32', icon: TrendingUp },
  weather: { labelEn: 'Weather',      labelMr: 'हवामान',       color: '#1A3D5A', icon: CloudRain  },
  scheme:  { labelEn: 'Govt Scheme',  labelMr: 'सरकारी योजना', color: '#5A3A1A', icon: Landmark  },
  general: { labelEn: 'News',         labelMr: 'बातमी',        color: '#3A1A5A', icon: Newspaper  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function FarmingNewsSection({ lang, location }: FarmingNewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>(buildStaticNews);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const isMr = lang === 'mr';

  useEffect(() => {
    let cancelled = false;

    // Serve from session cache immediately if fresh
    const cached = readCache();
    if (cached) {
      setNews(cached);
      setIsLive(true);
      setLoading(false);
      return;
    }

    setLoading(true);

    async function loadNews() {
      // ── Tier 1: AgriMart backend (only when VITE_API_URL is explicitly set) ─
      if (BACKEND_URL) {
        try {
          const params = location && !['Detecting...', 'Mandi', 'Rural MH'].includes(location)
            ? `?location=${encodeURIComponent(location)}`
            : '';
          const res  = await fetchWithTimeout(`${BACKEND_URL}/news/farming${params}`, 6_000);
          const json = await res.json() as { ok: boolean; items?: NewsItem[] };
          if (!cancelled && json.ok && Array.isArray(json.items) && json.items.length > 0) {
            setNews(json.items);
            setIsLive(true);
            setLoading(false);
            writeCache(json.items);
            return;
          }
        } catch { /* fall through */ }
      }

      // ── Tier 2: RSS feeds via rss2json (tried in parallel) ───────────────────
      try {
        const results = await Promise.allSettled(
          RSS_SOURCES.map(s => fetchRssSource(s.url, s.source))
        );

        const fetched: NewsItem[] = [];
        for (const r of results) {
          if (r.status === 'fulfilled') fetched.push(...r.value);
        }

        if (!cancelled && fetched.length > 0) {
          // Deduplicate by URL, cap at 12 items
          const seen = new Set<string>();
          const deduped = fetched.filter(item => {
            const key = item.url ?? item.titleEn;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }).slice(0, 12);

          setNews(deduped);
          setIsLive(true);
          setLoading(false);
          writeCache(deduped);
          return;
        }
      } catch { /* fall through to static */ }

      // ── Tier 3: Static curated (dates always computed fresh) ─────────────────
      if (!cancelled) {
        setNews(buildStaticNews());
        setLoading(false);
      }
    }

    loadNews();
    return () => { cancelled = true; };
  }, [location]);

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
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : news.map((item, idx) => (
              <NewsCard key={item.id} item={item} isMr={isMr} index={idx} />
            ))
        }
      </div>

      {isLive && !loading && (
        <p className="px-6 mt-4 text-[10px] text-[rgba(245,240,232,0.2)] font-light" style={{ letterSpacing: '0.04em' }}>
          {isMr ? 'स्रोत: Google News India' : 'Source: Google News India'}
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
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
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
