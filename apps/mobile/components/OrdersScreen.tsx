import React, { useState, useCallback } from 'react';
import { Language } from '../types.ts';
import { ShoppingBag, Package, Truck, CheckCircle, Clock, RotateCcw, ChevronDown } from 'lucide-react';
import { TRANSLATIONS } from '../constants.tsx';
import PillButton from './atoms/PillButton.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';

// ── Order timeline steps ──────────────────────────────────────────────────────
const TIMELINE_STEPS = [
  { key: 'ordered',    label: 'Order Placed',    labelMr: 'ऑर्डर दिली'    },
  { key: 'confirmed',  label: 'Payment Verified', labelMr: 'पेमेंट तपासले' },
  { key: 'dispatched', label: 'Dispatched',       labelMr: 'पाठवले'         },
  { key: 'delivered',  label: 'Delivered',        labelMr: 'पोहोचले'        },
];

const STATUS_STEP_INDEX: Record<string, number> = {
  pending:   0,
  transit:   2,
  delivered: 3,
};

// ── Mock past orders (shown once real API is wired in Phase 5) ────────────────
const MOCK_ORDERS = [
  {
    id: '#AGM-1042',
    product: 'Hybrid Tomato Seeds',
    productMr: 'हायब्रीड टोमॅटो बियाणे',
    seller: 'Krishi Seva Center',
    amount: '₹900',
    status: 'delivered' as const,
    date: 'Apr 10, 2025',
  },
  {
    id: '#AGM-1038',
    product: 'NPK 19-19-19 Fertilizer',
    productMr: 'NPK खत',
    seller: 'Gajanan Seeds',
    amount: '₹2,400',
    status: 'transit' as const,
    date: 'Apr 12, 2025',
  },
  {
    id: '#AGM-1031',
    product: 'Sugarcane Saplings',
    productMr: 'उसाची रोपे',
    seller: 'Ramachandra Nursery',
    amount: '₹17,500',
    status: 'pending' as const,
    date: 'Apr 13, 2025',
  },
];

type OrderStatus = 'pending' | 'transit' | 'delivered';

const STATUS_META: Record<OrderStatus, { label: string; labelMr: string; icon: React.ElementType; color: string; bg: string }> = {
  pending:   { label: 'Pending',   labelMr: 'प्रतीक्षेत',  icon: Clock,        color: 'text-[#D4C4A0]',  bg: 'bg-[rgba(212,196,160,0.1)]'  },
  transit:   { label: 'In Transit',labelMr: 'मार्गावर',    icon: Truck,        color: 'text-[#4A8C2A]',  bg: 'bg-[rgba(74,140,42,0.1)]'    },
  delivered: { label: 'Delivered', labelMr: 'पोहोचले',     icon: CheckCircle,  color: 'text-[#F5F0E8]',  bg: 'bg-[rgba(245,240,232,0.08)]' },
};

interface OrderCardProps {
  order: typeof MOCK_ORDERS[0];
  isMr: boolean;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

function OrderCard({ order, isMr, index, expanded, onToggle }: OrderCardProps) {
  const meta       = STATUS_META[order.status];
  const StatusIcon = meta.icon;
  const currentStep = STATUS_STEP_INDEX[order.status] ?? 0;

  return (
    <SectionReveal delay={index * 80}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
      >
        {/* Card header — tappable to expand timeline */}
        <button
          type="button"
          onClick={onToggle}
          className="w-full p-5 text-left"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#F5F0E8] truncate" style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>
                {isMr ? order.productMr : order.product}
              </p>
              <p className="text-[11px] font-light text-[rgba(245,240,232,0.4)] mt-0.5">{order.seller}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-light text-[#F5F0E8]" style={{ fontSize: '16px', letterSpacing: '-0.02em' }}>
                {order.amount}
              </span>
              <ChevronDown
                size={14}
                className={`text-[rgba(245,240,232,0.3)] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>

          {/* Status + date row */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${meta.bg}`}>
              <StatusIcon size={11} className={meta.color} />
              <span className={`text-[10px] font-medium tracking-[0.1em] uppercase ${meta.color}`}>
                {isMr ? meta.labelMr : meta.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-light text-[rgba(245,240,232,0.3)]">{order.date}</span>
              <span className="text-[10px] font-medium text-[rgba(245,240,232,0.25)]">{order.id}</span>
            </div>
          </div>
        </button>

        {/* ── Collapsible timeline ──────────────────────────────── */}
        {expanded && (
          <div
            className="px-5 pb-5"
            style={{ borderTop: '1px solid rgba(245,240,232,0.06)' }}
          >
            <p className="text-[9px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.3)] pt-4 mb-4">
              {isMr ? 'ट्रॅकिंग' : 'Tracking'}
            </p>
            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-[9px] top-0 bottom-0 w-px"
                style={{ background: 'rgba(245,240,232,0.07)' }}
              />
              <div className="space-y-4">
                {TIMELINE_STEPS.map((step, si) => {
                  const done    = si <= currentStep;
                  const current = si === currentStep;
                  return (
                    <div key={step.key} className="flex items-start gap-4 relative">
                      {/* Step dot */}
                      <div
                        style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          border: done ? 'none' : '1.5px solid rgba(245,240,232,0.15)',
                          background: done ? (current ? '#4A8C2A' : 'rgba(74,140,42,0.35)') : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          position: 'relative', zIndex: 1,
                          boxShadow: current ? '0 0 0 3px rgba(74,140,42,0.2)' : 'none',
                        }}
                      >
                        {done && (
                          <svg viewBox="0 0 10 10" width={10} height={10}>
                            <path d="M2 5.5l2 2 4-4" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                          </svg>
                        )}
                      </div>
                      {/* Label */}
                      <div className="pt-0.5">
                        <p style={{
                          fontSize: '13px', fontWeight: done ? 400 : 300,
                          color: done ? '#F5F0E8' : 'rgba(245,240,232,0.3)',
                          letterSpacing: '-0.01em',
                        }}>
                          {isMr ? step.labelMr : step.label}
                        </p>
                        {current && (
                          <p style={{ fontSize: '10px', color: '#4A8C2A', fontWeight: 500, marginTop: 2 }}>
                            {isMr ? 'सध्याची स्थिती' : 'Current status'}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionReveal>
  );
}

export default function OrdersScreen({ lang }: { lang: Language }) {
  const t    = TRANSLATIONS[lang === Language.ENGLISH ? 'en' : 'mr'];
  const isMr = lang === Language.MARATHI;
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  const isEmpty = false; // flip to true to show empty state

  return (
    <div className="px-5 pt-8 pb-28 space-y-8" style={{ minHeight: '100vh' }}>

      {/* Header */}
      <SectionReveal>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.35)] mb-1">
              {isMr ? 'माझे व्यवहार' : 'My Transactions'}
            </p>
            <h1 className="font-light text-[#F5F0E8]" style={{ fontSize: '26px', letterSpacing: '-0.02em' }}>
              {t.orders}
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.08)] bg-[rgba(245,240,232,0.05)] active:scale-90 transition-all"
            style={{ touchAction: 'manipulation' }}
            aria-label="Refresh orders"
          >
            <RotateCcw
              size={14}
              className={`text-[rgba(245,240,232,0.4)] transition-transform ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </SectionReveal>

      {isEmpty ? (
        /* ── Empty state ──────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
          >
            <ShoppingBag size={28} className="text-[rgba(245,240,232,0.25)]" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>
              {t.noOrders}
            </h2>
            <p className="font-light text-[rgba(245,240,232,0.4)] max-w-xs leading-relaxed" style={{ fontSize: '14px' }}>
              {t.noOrdersDesc}
            </p>
          </div>
          <PillButton variant="light">{t.startShopping}</PillButton>
        </div>
      ) : (
        /* ── Order list ───────────────────────────────────────────── */
        <div className="space-y-5">

          {/* Summary strip */}
          <SectionReveal>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: isMr ? 'एकूण' : 'Total',     value: '3' },
                { label: isMr ? 'मार्गावर' : 'Active', value: '1' },
                { label: isMr ? 'खर्च' : 'Spent',      value: '₹20.8k' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-4 rounded-2xl text-center"
                  style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
                >
                  <p className="font-light text-[#F5F0E8] mb-0.5" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
                    {value}
                  </p>
                  <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[rgba(245,240,232,0.35)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>

          {/* Order cards */}
          <div className="space-y-3">
            {MOCK_ORDERS.map((order, i) => (
              <OrderCard
                key={order.id}
                order={order}
                isMr={isMr}
                index={i}
                expanded={expandedId === order.id}
                onToggle={() => setExpandedId(prev => prev === order.id ? null : order.id)}
              />
            ))}
          </div>

          {/* Footer note */}
          <SectionReveal delay={240}>
            <div className="flex items-center justify-center gap-2 pt-4 opacity-25">
              <Package size={11} />
              <span className="text-[9px] font-medium tracking-[0.2em] uppercase">
                {isMr ? 'Apla AgriMart लॉजिस्टिक्स' : 'Apla AgriMart Logistics'}
              </span>
            </div>
          </SectionReveal>
        </div>
      )}
    </div>
  );
}
