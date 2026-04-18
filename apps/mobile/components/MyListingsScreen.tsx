import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types.ts';
import {
  Plus, MoreVertical, Eye, Edit2, Trash2, TrendingUp,
  Package, CheckCircle, Clock, XCircle, Sprout, RotateCcw,
  AlertTriangle, ArrowLeft, MapPin, FileText, Users,
} from 'lucide-react';
import { haptic } from '../utils/haptic.ts';

type ListingStatus = 'active' | 'pending' | 'sold' | 'expired';

interface InquiryLead {
  name: string;
  location: string;
  qty: number;
  time: string;
}

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
  description?: string;
  descriptionMr?: string;
  location?: string;
  locationMr?: string;
  leads?: InquiryLead[];
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
    imageUrl: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=800&auto=format&fit=crop',
    description: 'Premium Ratnagiri Alphonso mangoes. Naturally ripened, no carbide. Available in 10 kg export-grade boxes. Perfect aroma and sweetness.',
    descriptionMr: 'रत्नागिरी हापूस आंब्याचे उत्कृष्ट दर्जाचे. नैसर्गिकरित्या पिकलेले, कार्बाइड नाही. १० किलो निर्यात-दर्जाच्या बॉक्समध्ये उपलब्ध.',
    location: 'Ratnagiri, Konkan, Maharashtra',
    locationMr: 'रत्नागिरी, कोकण, महाराष्ट्र',
    leads: [
      { name: 'Suresh Patil', location: 'Pune', qty: 50, time: '2h ago' },
      { name: 'Fresh Mart Retail', location: 'Mumbai', qty: 200, time: '5h ago' },
      { name: 'Nilesh Kumar', location: 'Nashik', qty: 20, time: '1d ago' },
    ],
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
    imageUrl: 'https://images.pexels.com/photos/7033816/pexels-photo-7033816.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Bhagwa pomegranate from Solapur. Medium to large size, 500–700g per fruit. Deep red arils, low brix 16–18. Ready for immediate dispatch.',
    descriptionMr: 'सोलापूरचे भगवा डाळिंब. मध्यम ते मोठा आकार, फळामागे ५०० ते ७०० ग्रॅम. गडद लाल रंग, कमी ब्रिक्स १६–१८.',
    location: 'Solapur District, Maharashtra',
    locationMr: 'सोलापूर जिल्हा, महाराष्ट्र',
    leads: [
      { name: 'Rajesh Exports', location: 'Solapur', qty: 200, time: '3h ago' },
      { name: 'Anita Desai', location: 'Kolhapur', qty: 30, time: '8h ago' },
    ],
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
    imageUrl: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&auto=format&fit=crop',
    description: 'Nasik Red onion — bulk lot. Low moisture, suitable for export and long-distance transport. All 1000 kg sold in one lot to APMC trader.',
    descriptionMr: 'नाशिक लाल कांदा — मोठा माल. कमी आर्द्रता, निर्यातीसाठी आणि दीर्घ अंतराच्या वाहतुकीसाठी योग्य.',
    location: 'Nashik District, Maharashtra',
    locationMr: 'नाशिक जिल्हा, महाराष्ट्र',
    leads: [],
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
    imageUrl: 'https://images.pexels.com/photos/4198936/pexels-photo-4198936.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Waigaon (Wardha) turmeric — Curcumin content 5.2%. Polished fingers, 5–7 cm length. Suitable for direct processing. Listing under review.',
    descriptionMr: 'वायगाव (वर्धा) हळद — करक्यूमिन सामग्री ५.२%. पॉलिश बोटे, ५–७ सेमी लांबी. थेट प्रक्रियेसाठी योग्य.',
    location: 'Wardha District, Maharashtra',
    locationMr: 'वर्धा जिल्हा, महाराष्ट्र',
    leads: [
      { name: 'Spice Hub Pune', location: 'Pune', qty: 100, time: '1d ago' },
    ],
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
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [undoItem, setUndoItem] = useState<Listing | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss undo toast after 4 s
  useEffect(() => {
    if (!undoItem) return;
    undoTimer.current = setTimeout(() => setUndoItem(null), 4000);
    return () => { if (undoTimer.current) clearTimeout(undoTimer.current); };
  }, [undoItem]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  const confirmDelete = useCallback((id: string) => {
    const item = listings.find(l => l.id === id);
    if (!item) return;
    setListings(prev => prev.filter(l => l.id !== id));
    setDeleteId(null);
    setMenuOpen(null);
    setUndoItem(item);
    haptic.medium();
  }, [listings]);

  const undoDelete = useCallback(() => {
    if (!undoItem) return;
    setListings(prev => [...prev, undoItem]);
    setUndoItem(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }, [undoItem]);

  const filters: Array<{ key: ListingStatus | 'all'; label: string; labelMr: string }> = [
    { key: 'all',     label: 'All',     labelMr: 'सर्व'      },
    { key: 'active',  label: 'Active',  labelMr: 'सक्रिय'    },
    { key: 'pending', label: 'Pending', labelMr: 'प्रलंबित'   },
    { key: 'sold',    label: 'Sold',    labelMr: 'विकले'     },
  ];

  const visible = filter === 'all' ? listings : listings.filter(l => l.status === filter);

  const activeCount    = listings.filter(l => l.status === 'active').length;
  const totalViews     = listings.reduce((s, l) => s + l.views, 0);
  const totalInquiries = listings.reduce((s, l) => s + l.inquiries, 0);

  return (
    <>
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
                  <div
                    style={{ display: 'flex', gap: '0', cursor: 'pointer' }}
                    onClick={() => { if (menuOpen) { setMenuOpen(null); return; } setSelectedListing(listing); haptic.light(); }}
                  >
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
                          { icon: Edit2,  label: isMr ? 'संपादित करा' : 'Edit Listing',  color: '#F5F0E8',  action: 'edit'    },
                          { icon: Eye,    label: isMr ? 'पूर्वावलोकन' : 'Preview',        color: '#F5F0E8',  action: 'preview' },
                          { icon: Trash2, label: isMr ? 'हटवा' : 'Delete',               color: '#E57373',  action: 'delete'  },
                        ].map(({ icon: Icon, label, color, action }, mi) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => {
                              if (action === 'edit')   { setMenuOpen(null); onCreateNew(); }
                              else if (action === 'delete') { setDeleteId(listing.id); setMenuOpen(null); }
                              else                    { setMenuOpen(null); }
                            }}
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
      {/* ── Delete confirmation modal ─────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              background: 'rgba(0,0,0,0.72)',
              padding: '0 1rem 2rem',
            }}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 400,
                background: '#1A2D1A', border: '1px solid rgba(245,240,232,0.1)',
                borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%', margin: '0 auto 1rem',
                background: 'rgba(229,115,115,0.12)', border: '1px solid rgba(229,115,115,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={22} style={{ color: '#E57373' }} />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 400, color: '#F5F0E8', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                {isMr ? 'लिस्टिंग हटवायची का?' : 'Delete this listing?'}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(245,240,232,0.45)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {isMr
                  ? 'हे पूर्ववत करता येणार नाही. तुम्ही ४ सेकंदात पूर्ववत करू शकता.'
                  : 'You can undo this within 4 seconds after deletion.'}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: '0.75rem',
                    background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.1)',
                    color: 'rgba(245,240,232,0.65)', fontSize: '14px', fontWeight: 400, cursor: 'pointer',
                    touchAction: 'manipulation',
                  }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => confirmDelete(deleteId)}
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: '0.75rem',
                    background: 'rgba(229,115,115,0.18)', border: '1px solid rgba(229,115,115,0.35)',
                    color: '#E57373', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                    touchAction: 'manipulation',
                  }}
                >
                  {isMr ? 'हटवा' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Undo toast ────────────────────────────────────────────── */}
      <AnimatePresence>
        {undoItem && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            style={{
              position: 'fixed', bottom: 96, left: '50%', transform: 'translateX(-50%)',
              zIndex: 150, display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.75rem 0.625rem 1rem',
              background: '#1A2D1A', border: '1px solid rgba(245,240,232,0.12)',
              borderRadius: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(245,240,232,0.7)' }}>
              {isMr ? 'लिस्टिंग हटवली' : 'Listing deleted'}
            </span>
            <button
              type="button"
              onClick={undoDelete}
              style={{
                padding: '0.3rem 0.75rem', borderRadius: '1rem',
                background: 'rgba(212,196,160,0.15)', border: '1px solid rgba(212,196,160,0.25)',
                color: '#D4C4A0', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                touchAction: 'manipulation',
              }}
            >
              {isMr ? 'पूर्ववत करा' : 'Undo'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* ── Listing detail overlay ────────────────────────────────── */}
    <AnimatePresence>
      {selectedListing && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.32, ease: [0.32, 0, 0.16, 1] as const }}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: '#0A1A0A', overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Hero image */}
          <div style={{ position: 'relative', height: '45vh', overflow: 'hidden' }}>
            <img
              src={selectedListing.imageUrl}
              alt={selectedListing.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(0.85)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A1A0A 25%, transparent 70%)' }} />
            <button
              onClick={() => setSelectedListing(null)}
              style={{
                position: 'absolute', top: 'max(1rem, env(safe-area-inset-top))', left: '1.25rem',
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(10,26,10,0.6)', border: '1px solid rgba(245,240,232,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', touchAction: 'manipulation', backdropFilter: 'blur(8px)',
                color: '#F5F0E8',
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.25rem', right: '1.25rem' }}>
              <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4C4A0', marginBottom: 4 }}>
                {selectedListing.category}
              </p>
              <h2 style={{ fontSize: 'clamp(22px, 6vw, 30px)', fontWeight: 300, color: '#F5F0E8', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {isMr ? selectedListing.nameMr : selectedListing.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginTop: 6 }}>
                <span style={{ fontSize: '24px', fontWeight: 300, color: '#F5F0E8', letterSpacing: '-0.03em' }}>
                  ₹{selectedListing.price}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  / {selectedListing.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '1.25rem 1.25rem 6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.625rem' }}>
              {[
                { label: isMr ? 'मात्रा' : 'Available', value: `${selectedListing.quantity} ${selectedListing.unit}` },
                { label: isMr ? 'व्ह्यूज' : 'Views', value: `${selectedListing.views}` },
                { label: isMr ? 'चौकशी' : 'Leads', value: `${selectedListing.inquiries}` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: '0.875rem 0.75rem', borderRadius: '1rem', textAlign: 'center',
                  background: '#111C11', border: '1px solid rgba(245,240,232,0.07)',
                }}>
                  <p style={{ fontSize: '16px', fontWeight: 300, color: '#F5F0E8', letterSpacing: '-0.02em' }}>{value}</p>
                  <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            {(selectedListing.description || selectedListing.descriptionMr) && (
              <div style={{
                padding: '1.25rem', borderRadius: '1rem',
                background: '#111C11', border: '1px solid rgba(245,240,232,0.07)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <FileText size={14} style={{ color: '#D4C4A0' }} />
                  <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}>
                    {isMr ? 'वर्णन' : 'Description'}
                  </p>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 300, color: 'rgba(245,240,232,0.7)', lineHeight: 1.65 }}>
                  {isMr ? (selectedListing.descriptionMr || selectedListing.description) : selectedListing.description}
                </p>
              </div>
            )}

            {/* Location */}
            {selectedListing.location && (
              <div style={{
                padding: '1rem 1.25rem', borderRadius: '1rem',
                background: '#111C11', border: '1px solid rgba(245,240,232,0.07)',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '0.75rem', flexShrink: 0,
                  background: 'rgba(45,90,27,0.2)', border: '1px solid rgba(74,140,42,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MapPin size={16} style={{ color: '#4A8C2A' }} />
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', marginBottom: 3 }}>
                    {isMr ? 'ठिकाण' : 'Farm Location'}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 400, color: '#F5F0E8' }}>
                    {isMr ? (selectedListing.locationMr || selectedListing.location) : selectedListing.location}
                  </p>
                </div>
              </div>
            )}

            {/* Inquiry leads */}
            {selectedListing.leads && selectedListing.leads.length > 0 && (
              <div style={{
                padding: '1.25rem', borderRadius: '1rem',
                background: '#111C11', border: '1px solid rgba(245,240,232,0.07)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                  <Users size={14} style={{ color: '#D4C4A0' }} />
                  <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}>
                    {isMr ? 'खरेदीची विचारणा' : 'Buyer Enquiries'}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedListing.leads.map((lead, li) => (
                    <div key={li} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingBottom: li < (selectedListing.leads?.length ?? 0) - 1 ? '0.75rem' : 0,
                      borderBottom: li < (selectedListing.leads?.length ?? 0) - 1 ? '1px solid rgba(245,240,232,0.06)' : 'none',
                    }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 400, color: '#F5F0E8' }}>{lead.name}</p>
                        <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.4)', marginTop: 1 }}>
                          {lead.location} · {lead.qty} {selectedListing.unit} · {lead.time}
                        </p>
                      </div>
                      <div style={{
                        padding: '0.25rem 0.625rem', borderRadius: '2rem',
                        background: 'rgba(212,196,160,0.1)', border: '1px solid rgba(212,196,160,0.2)',
                      }}>
                        <span style={{ fontSize: '10px', fontWeight: 500, color: '#D4C4A0' }}>
                          {isMr ? 'उत्तर द्या' : 'Reply'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <button
                type="button"
                onClick={() => { setSelectedListing(null); onCreateNew(); }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '0.75rem', borderRadius: '0.875rem',
                  background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.1)',
                  color: 'rgba(245,240,232,0.75)', fontSize: '14px', fontWeight: 400, cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                <Edit2 size={14} />
                {isMr ? 'संपादित करा' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => { setDeleteId(selectedListing.id); setSelectedListing(null); }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '0.75rem', borderRadius: '0.875rem',
                  background: 'rgba(229,115,115,0.1)', border: '1px solid rgba(229,115,115,0.25)',
                  color: '#E57373', fontSize: '14px', fontWeight: 400, cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                <Trash2 size={14} />
                {isMr ? 'हटवा' : 'Delete'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
