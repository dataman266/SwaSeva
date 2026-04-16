import { Injectable, Logger } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

// ── Types ─────────────────────────────────────────────────────────────────────

type NewsCategory = 'market' | 'weather' | 'scheme' | 'general';

export interface NewsItem {
  id: string;
  titleEn: string;
  titleMr: string;
  category: NewsCategory;
  date: string;
  source: string;
  url?: string;
  isLive: boolean;
}

interface CacheEntry {
  data: NewsItem[];
  fetchedAt: number;
}

// ── RSS sources ───────────────────────────────────────────────────────────────

const RSS_FEEDS = [
  { url: 'https://agrowon.com/feed/', source: 'Agrowon', lang: 'mr' },
  { url: 'https://krishijagran.com/feed/', source: 'Krishi Jagran', lang: 'en' },
];

const TTL_MS = 60 * 60 * 1000; // 1 hour

// ── Helpers ───────────────────────────────────────────────────────────────────

function guessCategory(title: string): NewsCategory {
  const t = title.toLowerCase();
  if (t.includes('पाऊस') || t.includes('हवामान') || t.includes('rain') || t.includes('weather') || t.includes('monsoon')) {
    return 'weather';
  }
  if (t.includes('योजना') || t.includes('अनुदान') || t.includes('scheme') || t.includes('subsidy') || t.includes('msp') || t.includes('किसान') || t.includes('kisan')) {
    return 'scheme';
  }
  if (t.includes('भाव') || t.includes('दर') || t.includes('price') || t.includes('apmc') || t.includes('market') || t.includes('quintal') || t.includes('क्विंटल')) {
    return 'market';
  }
  return 'general';
}

function relativeDate(pubDate: string): string {
  try {
    const diff = Date.now() - new Date(pubDate).getTime();
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

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private cache: CacheEntry | null = null;
  private readonly parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

  async getNews(location?: string): Promise<NewsItem[]> {
    // Serve from cache if fresh
    if (this.cache && Date.now() - this.cache.fetchedAt < TTL_MS) {
      this.logger.debug('Serving news from cache');
      return this.filterByLocation(this.cache.data, location);
    }

    this.logger.log('Cache miss — fetching RSS feeds');
    const results = await Promise.allSettled(RSS_FEEDS.map(feed => this.fetchFeed(feed)));

    const items: NewsItem[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        items.push(...result.value);
      }
    }

    // Deduplicate by URL, sort newest first
    const seen = new Set<string>();
    const deduped = items
      .filter(item => {
        const key = item.url ?? item.titleEn;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => {
        // Items with "आत्ता" or "Just now" come first
        const priority = (s: string) => (s.includes('आत्ता') ? 0 : s.includes('तास') ? 1 : s.includes('दिवस') ? 2 : 3);
        return priority(a.date) - priority(b.date);
      })
      .slice(0, 10);

    this.cache = { data: deduped, fetchedAt: Date.now() };
    return this.filterByLocation(deduped, location);
  }

  private async fetchFeed(feed: { url: string; source: string; lang: string }): Promise<NewsItem[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    try {
      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'AgriMart/1.0 (farming app; Maharashtra)' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const xml = await res.text();
      const parsed = this.parser.parse(xml);
      const channel = parsed?.rss?.channel ?? parsed?.feed;
      if (!channel) return [];

      const rawItems: Array<Record<string, unknown>> = Array.isArray(channel.item)
        ? channel.item
        : channel.item ? [channel.item] : [];

      return rawItems.slice(0, 6).map((item, i) => {
        const title   = String(item.title   ?? '').replace(/<[^>]+>/g, '').trim();
        const pubDate = String(item.pubDate ?? item.updated ?? '');
        const link    = String(item.link    ?? item.guid ?? '');

        return {
          id:       `${feed.source.toLowerCase()}-${i}`,
          titleEn:  feed.lang === 'mr' ? title : title, // Agrowon is natively Marathi
          titleMr:  title,
          category: guessCategory(title),
          date:     relativeDate(pubDate),
          source:   feed.source,
          url:      link || undefined,
          isLive:   true,
        } satisfies NewsItem;
      });
    } catch (err) {
      this.logger.warn(`Failed to fetch ${feed.url}: ${(err as Error).message}`);
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Light location filter — prioritise articles that mention the city.
   * Falls back to full list if nothing matches.
   */
  private filterByLocation(items: NewsItem[], location?: string): NewsItem[] {
    if (!location || ['Detecting...', 'Mandi', 'Rural MH', 'Maharashtra'].includes(location)) {
      return items;
    }
    const city = location.toLowerCase();
    const localFirst = [
      ...items.filter(i => i.titleEn.toLowerCase().includes(city) || i.titleMr.toLowerCase().includes(city)),
      ...items.filter(i => !i.titleEn.toLowerCase().includes(city) && !i.titleMr.toLowerCase().includes(city)),
    ];
    return localFirst.slice(0, 8);
  }

  /** Returns cache age in seconds, useful for health checks */
  getCacheAge(): number {
    if (!this.cache) return -1;
    return Math.floor((Date.now() - this.cache.fetchedAt) / 1_000);
  }
}
