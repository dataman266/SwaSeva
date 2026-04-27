import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, TrendingUp, CloudRain, Landmark, ExternalLink } from 'lucide-react';
import SectionReveal from '../atoms/SectionReveal.tsx';

function openUrl(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.click();
}

// AbortSignal.timeout() is not in older Android WebViews
async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { signal: ctrl.signal }); }
  finally { clearTimeout(timer); }
}

const BACKEND_URL = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ?? null;
const CACHE_KEY   = 'agrimart_news_v2';
const CACHE_TTL   = 30 * 60 * 1000; // 30 min

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
  if (/rain|weather|monsoon|drought|flood|climate|imd|forecast/.test(t)) return 'weather';
  if (/scheme|subsidy|msp|kisan|government|ministry|policy|pm kisan|nabard|loan/.test(t)) return 'scheme';
  if (/price|mandi|market|apmc|quintal|crop|harvest|yield|commodity|rate|bhav/.test(t)) return 'market';
  return 'general';
}

function relativeDate(dateStr: string): string {
  try {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 3)  return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7)   return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  } catch { return ''; }
}

function daysAgo(n: number): string {
  return relativeDate(new Date(Date.now() - n * 86_400_000).toISOString());
}

// ── Session cache ─────────────────────────────────────────────────────────────

function readCache(): NewsItem[] | null {
  try {
    const raw   = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { items: NewsItem[]; ts: number };
    return Date.now() - entry.ts < CACHE_TTL ? entry.items : null;
  } catch { return null; }
}

function writeCache(items: NewsItem[]) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ items, ts: Date.now() })); } catch { /* ignore */ }
}

// ── Static fallback ───────────────────────────────────────────────────────────

function buildStaticNews(): NewsItem[] {
  return [
    {
      id: 'n1', category: 'market', source: 'APMC Nashik', date: daysAgo(0),
      titleEn: 'Onion prices rise to ₹1,200/qtl at Lasalgaon APMC — strong export demand',
      titleMr: 'लासलगाव APMC मध्ये कांद्याचे भाव ₹१,२०० प्रति क्विंटल — निर्यात मागणीमुळे वाढ',
      url: 'https://agmarknet.gov.in/',
    },
    {
      id: 'n2', category: 'weather', source: 'IMD India', date: daysAgo(1),
      titleEn: 'IMD forecasts above-normal monsoon for Maharashtra; sowing expected on time',
      titleMr: 'महाराष्ट्रात सामान्यापेक्षा जास्त पाऊस — IMD अंदाज; पेरणी वेळेत होण्याची शक्यता',
      url: 'https://mausam.imd.gov.in/',
    },
    {
      id: 'n3', category: 'scheme', source: 'Ministry of Agriculture', date: daysAgo(2),
      titleEn: 'PM Kisan 18th instalment: ₹2,000 to be credited — check eligibility now',
      titleMr: 'PM किसान १८वा हप्ता: ₹२,०००  थेट खात्यात — पात्रता आत्ताच तपासा',
      url: 'https://pmkisan.gov.in/',
    },
    {
      id: 'n4', category: 'market', source: 'CACP', date: daysAgo(3),
      titleEn: 'Soybean MSP raised to ₹4,892/qtl for Kharif 2025 — cabinet approval',
      titleMr: 'खरीप २०२५ साठी सोयाबीनचा MSP ₹४,८९२/क्विंटल — मंत्रिमंडळ मंजुरी',
      url: 'https://cacp.dacnet.nic.in/',
    },
    {
      id: 'n5', category: 'scheme', source: 'MahaDBT', date: daysAgo(5),
      titleEn: 'Drip irrigation subsidy for small farmers — up to 80% via MahaDBT portal',
      titleMr: 'लहान शेतकऱ्यांसाठी ठिबक सिंचन अनुदान — MahaDBT द्वारे ८०% पर्यंत सहाय्य',
      url: 'https://mahadbt.maharashtra.gov.in/',
    },
    {
      id: 'n6', category: 'market', source: 'APMC Latur', date: daysAgo(7),
      titleEn: 'Tur (pigeon pea) arrivals surge in Latur; prices soften to ₹6,100/qtl',
      titleMr: 'लातूरमध्ये तूर आवक वाढली; दर ₹६,१०० प्रति क्विंटलवर आले',
      url: 'https://enam.gov.in/web/',
    },
  ];
}

// ── RSS → JSON via rss2json proxy ─────────────────────────────────────────────
// These feeds are standard RSS and work reliably through rss2json

const RSS_SOURCES = [
  // Economic Times — Agriculture section (very reliable)
  'https://economictimes.indiatimes.com/news/economy/agriculture/rssfeeds/7377991.cms',
  // The Hindu BusinessLine — Agri section
  'https://www.thehindubusinessline.com/economy/agri-business/feeder/default.rss',
  // Business Standard — Agriculture
  'https://www.business-standard.com/rss/agriculture-39.rss',
];

interface RawRssItem { title: string; pubDate: string; link: string; source?: { title?: string } }
interface Rss2JsonResp { status: string; feed?: { title?: string }; items?: RawRssItem[] }

async function fetchOneFeed(feedUrl: string): Promise<NewsItem[]> {
  const proxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=10`;
  const res   = await fetchWithTimeout(proxy, 9_000);
  if (!res.ok) return [];
  const data  = await res.json() as Rss2JsonResp;
  if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) return [];
  const feedName = data.feed?.title ?? new URL(feedUrl).hostname.replace('www.', '');
  return data.items.map((item, i) => ({
    id:       `feed-${i}-${feedUrl.slice(-8)}`,
    titleEn:  item.title,
    titleMr:  item.title,
    category: guessCategory(item.title),
    date:     relativeDate(item.pubDate),
    source:   feedName,
    url:      item.link || undefined,
    isLive:   true,
  }));
}

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORY_META: Record<NewsCategory, {
  labelEn: string; labelMr: string; accent: string; dim: string; icon: React.ElementType
}> = {
  market:  { labelEn: 'Market',   labelMr: 'बाजार',   accent: '#6FCF4A', dim: '#6FCF4A22', icon: TrendingUp },
  weather: { labelEn: 'Weather',  labelMr: 'हवामान',  accent: '#5AC8FA', dim: '#5AC8FA22', icon: CloudRain  },
  scheme:  { labelEn: 'Scheme',   labelMr: 'योजना',   accent: '#F0A500', dim: '#F0A50022', icon: Landmark   },
  general: { labelEn: 'News',     labelMr: 'बातमी',   accent: '#B48EFF', dim: '#B48EFF22', icon: Newspaper  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function FarmingNewsSection({ lang, location }: FarmingNewsSectionProps) {
  const [news,    setNews]    = useState<NewsItem[]>(buildStaticNews);
  const [loading, setLoading] = useState(true);
  const [isLive,  setIsLive]  = useState(false);

  const isMr = lang === 'mr';

  useEffect(() => {
    let cancelled = false;

    const cached = readCache();
    if (cached) { setNews(cached); setIsLive(true); setLoading(false); return; }

    setLoading(true);

    async function loadNews() {
      // Tier 1: backend (only if VITE_API_URL explicitly set)
      if (BACKEND_URL) {
        try {
          const params = location && !['Detecting...', 'Mandi', 'Rural MH'].includes(location)
            ? `?location=${encodeURIComponent(location)}` : '';
          const res  = await fetchWithTimeout(`${BACKEND_URL}/news/farming${params}`, 6_000);
          const json = await res.json() as { ok: boolean; items?: NewsItem[] };
          if (!cancelled && json.ok && Array.isArray(json.items) && json.items.length > 0) {
            setNews(json.items); setIsLive(true); setLoading(false);
            writeCache(json.items); return;
          }
        } catch { /* fall through */ }
      }

      // Tier 2: RSS feeds via rss2json (in parallel)
      try {
        const results = await Promise.allSettled(RSS_SOURCES.map(fetchOneFeed));
        const fetched: NewsItem[] = [];
        for (const r of results) {
          if (r.status === 'fulfilled') fetched.push(...r.value);
        }

        if (!cancelled && fetched.length > 0) {
          const seen = new Set<string>();
          const deduped = fetched.filter(item => {
            const key = item.url ?? item.titleEn;
            if (seen.has(key)) return false;
            seen.add(key); return true;
          }).slice(0, 10);

          setNews(deduped); setIsLive(true); setLoading(false);
          writeCache(deduped); return;
        }
      } catch { /* fall through */ }

      // Tier 3: static (dates always fresh)
      if (!cancelled) { setNews(buildStaticNews()); setLoading(false); }
    }

    loadNews();
    return () => { cancelled = true; };
  }, [location]);

  const city = ['Detecting...', 'Mandi', 'Rural MH'].includes(location) ? 'Maharashtra' : location;

  return (
    <section className="py-10" style={{ background: '#0D170D' }}>

      {/* Header */}
      <SectionReveal className="flex items-end justify-between px-5 mb-5">
        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.3)] mb-1">
            {isMr ? `${city} क्षेत्र` : `${city} Region`}
          </p>
          <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>
            {isMr ? 'शेती बातम्या' : 'Farming News'}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 pb-0.5">
          {isLive && !loading && <span className="w-1.5 h-1.5 rounded-full bg-[#6FCF4A] animate-pulse" />}
          <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)]">
            {loading ? 'Loading…' : isLive ? 'LIVE' : 'Curated'}
          </span>
        </div>
      </SectionReveal>

      {/* Vertical news list */}
      <div className="flex flex-col gap-2.5 px-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          : news.map((item, idx) => (
              <NewsRow key={item.id} item={item} isMr={isMr} index={idx} />
            ))
        }
      </div>

      {isLive && !loading && (
        <p className="px-5 mt-5 text-[10px] text-[rgba(245,240,232,0.18)]" style={{ letterSpacing: '0.03em' }}>
          {isMr ? 'स्रोत: ET · BusinessLine · Business Standard' : 'Source: ET · BusinessLine · Business Standard'}
        </p>
      )}
    </section>
  );
}

// ── NewsRow — full-width vertical list card ───────────────────────────────────

function NewsRow({ item, isMr, index }: { item: NewsItem; isMr: boolean; index: number }) {
  const meta  = CATEGORY_META[item.category];
  const Icon  = meta.icon;
  const title = isMr ? item.titleMr : item.titleEn;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={title}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
      whileTap={{ scale: 0.985, opacity: 0.85 }}
      className="flex overflow-hidden rounded-xl cursor-pointer select-none"
      style={{ background: '#111E11', border: '1px solid rgba(245,240,232,0.06)' }}
      onClick={() => item.url && openUrl(item.url)}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && item.url) openUrl(item.url); }}
    >
      {/* Left accent bar */}
      <div style={{ width: 3, background: meta.accent, flexShrink: 0 }} />

      {/* Content */}
      <div className="flex-1 px-3.5 py-3">
        {/* Top: category pill + external icon */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold tracking-[0.08em] uppercase"
            style={{ background: meta.dim, color: meta.accent }}
          >
            <Icon size={8} strokeWidth={2.5} />
            {isMr ? meta.labelMr : meta.labelEn}
          </span>
          {item.url && (
            <ExternalLink size={12} strokeWidth={1.5} style={{ color: 'rgba(245,240,232,0.22)', flexShrink: 0 }} />
          )}
        </div>

        {/* Headline */}
        <p
          className="text-[#F5F0E8] leading-snug font-light"
          style={{ fontSize: '13.5px', letterSpacing: '-0.01em' }}
        >
          {title.length > 110 ? `${title.slice(0, 110)}…` : title}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[10px] text-[rgba(245,240,232,0.28)] font-medium">{item.source}</span>
          <span className="text-[10px] text-[rgba(245,240,232,0.22)]">{item.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── SkeletonRow ───────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div
      className="flex overflow-hidden rounded-xl animate-pulse"
      style={{ background: '#111E11', border: '1px solid rgba(245,240,232,0.05)', minHeight: 88 }}
    >
      <div style={{ width: 3, background: 'rgba(245,240,232,0.08)', flexShrink: 0 }} />
      <div className="flex-1 px-3.5 py-3">
        <div className="h-4 w-20 rounded-full bg-[rgba(245,240,232,0.06)] mb-3" />
        <div className="h-3 w-full rounded bg-[rgba(245,240,232,0.05)] mb-1.5" />
        <div className="h-3 w-3/4 rounded bg-[rgba(245,240,232,0.05)] mb-4" />
        <div className="flex justify-between">
          <div className="h-2.5 w-20 rounded bg-[rgba(245,240,232,0.04)]" />
          <div className="h-2.5 w-10 rounded bg-[rgba(245,240,232,0.04)]" />
        </div>
      </div>
    </div>
  );
}
