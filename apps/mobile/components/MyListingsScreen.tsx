import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types.ts';
import {
  Plus, MoreVertical, Eye, Edit2, Trash2, TrendingUp,
  Package, CheckCircle, Clock, XCircle, Sprout, RotateCcw,
} from 'lucide-react';

type ListingStatus = 'active' | 'pending' | 'sold' | 'expired';

interface Listing {
  id: string;
  name: string;
  nameMr: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  views: number;
  inquiries: number;
  status: ListingStatus;
  daysLeft?: number;
  imageUrl: string;
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    name: 'Alphonso Mangoes',
    nameMr: 'हापूस आंबा',
    category: 'Fruits',
    price: 320,
    unit: 'kg',
    quantity: 200,
    views: 148,
    inquiries: 12,
    status: 'active',
    daysLeft: 8,
    imageUrl: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400&auto=format&fit=crop',
  },
  {
    id: 'l2',
    name: 'Pomegranate (Bhagwa)',
    nameMr: 'डाळिंब (भगवा)',
    category: 'Fruits',
    price: 180,
    unit: 'kg',
    quantity: 500,
    views: 94,
    inquiries: 7,
    status: 'active',
    daysLeft: 14,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop',
  },
  {
    id: 'l3',
    name: 'Onion (Nasik Red)',
    nameMr: 'कांदा (नाशिक लाल)',
    category: 'Vegetables',
    price: 28,
    unit: 'kg',
    quantity: 1000,
    views: 212,
    inquiries: 19,
    status: 'sold',
    imageUrl: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&auto=format&fit=crop',
  },
  {
    id: 'l4',
    name: 'Turmeric (Waigaon)',
    nameMr: 'हळद (वायगाव)',
    category: 'Spices',
    price: 140,
    unit: 'kg',
    quantity: 300,
    views: 31,
    inquiries: 2,
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&auto=format&fit=crop',
  },
];

const STATUS_CONFIG: Record<ListingStatus, { label: string; labelMr: string; color: string; bg: string; icon: React.ElementType }> = {
  active:  { label: 'Active',   labelMr: 'सक्रिय',       color: '#4A8C2A', bg: 'rgba(74,140,42,0.12)',     icon: CheckCircle },
  pending: { label: 'Pending',  labelMr: 'प्रलंबित',      color: '#F5C518', bg: 'rgba(245,197,24,0.12)',    icon: Clock       },
  sold:    { label: 'Sold',     labelMr: 'विकले',         color: '#D4C4A0', bg: 'rgba(212,196,160,0.12)',   icon: Package     },
  expired: { label: 'Expired',  labelMr: 'कालबाह्य',      color: '#E57373', bg: 'rgba(229,115,115,0.12)',   icon: XCircle     },
};

interface MyListingsScreenProps {
  lang: Language;
  onCreateNew: () => void;
}

export default function MyListingsScreen({ lang, onCreateNew }: MyListingsScreenProps) {
  const isMr = lang === Language.MARATHI;
  const [filter, setFilter] = useState<ListingStatus | 'all'>('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  const filters: Array<{ key: ListingStatus | 'all'; label: string; labelMr: string }> = [
    { key: 'all',     label: 'All',     labelMr: 'सर्व'      },
    { key: 'active',  label: 'Active',  labelMr: 'सक्रिय'    },
    { key: 'pending', label: 'Pending', labelMr: 'प्रलंबित'   },
    { key: 'sold',    label: 'Sold',    labelMr: 'विकले'     },
  ];

  const visible = filter === 'all' ? MOCK_LISTINGS : MOCK_LISTINGS.filter(l => l.status === filter);

  const activeCount  = MOCK_LISTINGS.filter(l => l.status === 'active').length;
  const totalViews   = MOCK_LISTINGS.reduce((s, l) => s + l.views, 0);
  const totalInquiries = MOCK_LISTINGS.reduce((s, l) => s + l.inquiries, 0);

  return (
    <div
      style={{
        minHeight: '100vh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '2rem 1.25rem 7rem',
      }}
      onClick={() => menuOpen && setMenuOpen(null)}
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 400, color: '#F5F0E8', letterSpacing: '-0.02em' }}>
            {isMr ? 'माझ्या लिस्टिंग' : 'My Listings'}
          </h1>
          <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.4)', marginTop: 2, fontWeight: 300 }}>
            {isMr ? `${activeCount} सक्रिय लिस्टिंग` : `${activeCount} active listing${activeCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(245,240,232,0.06)',
              border: '1px solid rgba(245,240,232,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: refreshing ? 'default' : 'pointer',
              touchAction: 'manipulation',
            }}
            aria-label="Refresh listings"
          >
            <RotateCcw
              size={14}
              className={refreshing ? 'animate-spin' : ''}
              style={{ color: 'rgba(245,240,232,0.4)' }}
            />
          </button>
          <button
            type="button"
            onClick={onCreateNew}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.625rem 1rem', borderRadius: '2rem',
              background: '#2D5A1B', border: 'none',
              color: '#F5F0E8', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', touchAction: 'manipulation',
              WebkitTapHighlightColor: 'rgba(45,90,27,0.2)',
            }}
          >
            <Plus size={14} />
            {isMr ? 'नवीन' : 'New'}
          </button>
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { value: activeCount, label: isMr ? 'सक्रिय' : 'Active', icon: Sprout, color: '#4A8C2A' },
          { value: totalViews,  label: isMr ? 'व्ह्यूज' : 'Views',  icon: Eye,    color: '#7EB3FF' },
          { value: totalInquiries, label: isMr ? 'चौकशी' : 'Leads', icon: TrendingUp, color: '#D4C4A0' },
        ].map(({ value, label, icon: Icon, color }) => (
          <div key={label} style={{
            padding: '0.875rem', borderRadius: '1rem', textAlign: 'center',
            background: '#111C11', border: '1px solid rgba(245,240,232,0.07)',
          }}>
            <Icon size={14} style={{ color, margin: '0 auto 0.375rem' }} />
            <p style={{ fontSize: '18px', fontWeight: 300, color: '#F5F0E8', letterSpacing: '-0.02em' }}>{value}</p>
            <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter pills ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.25rem', paddingBottom: '0.25rem' }}>
        {filters.map(({ key, label, labelMr }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            style={{
              flexShrink: 0, padding: '0.4rem 0.875rem', borderRadius: '2rem',
              fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              background: filter === key ? '#2D5A1B' : 'rgba(245,240,232,0.06)',
              border: `1px solid ${filter === key ? 'rgba(74,140,42,0.4)' : 'rgba(245,240,232,0.1)'}`,
              color: filter === key ? '#F5F0E8' : 'rgba(245,240,232,0.45)',
              transition: 'all 0.15s',
            }}
          >
            {isMr ? labelMr : label}
          </button>
        ))}
      </div>

      {/* ── Listing cards ────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <div style={{
          padding: '3rem 1.5rem', textAlign: 'center',
          background: '#111C11', border: '1px solid rgba(245,240,232,0.07)',
          borderRadius: '1.25rem',
        }}>
          <Package size={32} style={{ color: 'rgba(245,240,232,0.15)', margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '15px', color: 'rgba(245,240,232,0.5)', fontWeight: 300 }}>
            {isMr ? 'या श्रेणीत लिस्टिंग नाही' : 'No listings in this category'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <AnimatePresence>
            {visible.map((listing, i) => {
              const s = STATUS_CONFIG[listing.status];
              const StatusIcon = s.icon;
              const isMenuOpen = menuOpen === listing.id;

              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] as const }}
                  style={{
                    background: '#111C11', border: '1px solid rgba(245,240,232,0.07)',
                    borderRadius: '1.25rem', overflow: 'hidden', position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0' }}>
                    {/* Image */}
                    <div style={{ width: 90, flexShrink: 0, position: 'relative' }}>
                      <img
                        src={listing.imageUrl}
                        alt={listing.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        loading="lazy"
                      />
                      {listing.status === 'sold' && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(10,26,10,0.6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ fontSize: '10px', fontWeight: 600, color: '#D4C4A0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            {isMr ? 'विकले' : 'Sold'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, padding: '0.875rem 0.875rem 0.875rem 0', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '14px', fontWeight: 400, color: '#F5F0E8', letterSpacing: '-0.01em', marginBottom: 2 }} className="truncate">
                            {isMr ? listing.nameMr : listing.name}
                          </p>
                          <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.35)', fontWeight: 300 }}>
                            {listing.category}
                          </p>
                        </div>
                        {/* 3-dot menu */}
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setMenuOpen(isMenuOpen ? null : listing.id); }}
                          style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'rgba(245,240,232,0.06)', border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', touchAction: 'manipulation',
                            flexShrink: 0,
                          }}
                        >
                          <MoreVertical size={13} style={{ color: 'rgba(245,240,232,0.4)' }} />
                        </button>
                      </div>

                      {/* Price + qty */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', margin: '0.5rem 0' }}>
                        <span style={{ fontSize: '16px', fontWeight: 400, color: '#F5F0E8', letterSpacing: '-0.01em' }}>
                          ₹{listing.price}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(245,240,232,0.35)', fontWeight: 300 }}>
                          /{listing.unit} · {listing.quantity}{listing.unit} {isMr ? 'उपलब्ध' : 'avail.'}
                        </span>
                      </div>

                      {/* Status + stats row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                          padding: '0.25rem 0.625rem', borderRadius: '2rem',
                          background: s.bg,
                        }}>
                          <StatusIcon size={10} style={{ color: s.color }} />
                          <span style={{ fontSize: '10px', fontWeight: 500, color: s.color }}>
                            {isMr ? s.labelMr : s.label}
                            {listing.daysLeft && listing.status === 'active' ? ` · ${listing.daysLeft}d` : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Eye size={11} style={{ color: 'rgba(245,240,232,0.3)' }} />
                            <span style={{ fontSize: '11px', color: 'rgba(245,240,232,0.35)', fontWeight: 300 }}>{listing.views}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <TrendingUp size={11} style={{ color: 'rgba(245,240,232,0.3)' }} />
                            <span style={{ fontSize: '11px', color: 'rgba(245,240,232,0.35)', fontWeight: 300 }}>{listing.inquiries}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Context menu */}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -6 }}
                        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] as const }}
                        onClick={e => e.stopPropagation()}
                        style={{
                          position: 'absolute', top: 44, right: 12,
                          background: '#1A2D1A', border: '1px solid rgba(245,240,232,0.1)',
                          borderRadius: '0.875rem', overflow: 'hidden', zIndex: 10, minWidth: 148,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        }}
                      >
                        {[
                          { icon: Edit2,  label: isMr ? 'संपादित करा' : 'Edit Listing',  color: '#F5F0E8' },
                          { icon: Eye,    label: isMr ? 'पूर्वावलोकन' : 'Preview',        color: '#F5F0E8' },
                          { icon: Trash2, label: isMr ? 'हटवा' : 'Delete',               color: '#E57373' },
                        ].map(({ icon: Icon, label, color }, mi) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setMenuOpen(null)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.625rem',
                              width: '100%', padding: '0.75rem 1rem',
                              background: 'transparent', border: 'none',
                              borderBottom: mi < 2 ? '1px solid rgba(245,240,232,0.06)' : 'none',
                              cursor: 'pointer', touchAction: 'manipulation',
                              WebkitTapHighlightColor: 'rgba(45,90,27,0.15)',
                            }}
                          >
                            <Icon size={13} style={{ color, flexShrink: 0 }} />
                            <span style={{ fontSize: '13px', fontWeight: 300, color }}>{label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
