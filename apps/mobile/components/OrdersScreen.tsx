import React, { useState, useCallback } from 'react';
import { Language } from '../types.ts';
import { ShoppingBag, Package, Truck, CheckCircle, Clock, RotateCcw } from 'lucide-react';
import { TRANSLATIONS } from '../constants.tsx';
import PillButton from './atoms/PillButton.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';

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
}

function OrderCard({ order, isMr, index }: OrderCardProps) {
  const meta = STATUS_META[order.status];
  const StatusIcon = meta.icon;

  return (
    <SectionReveal delay={index * 80}>
      <div
        className="p-5 rounded-2xl space-y-4"
        style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#F5F0E8] truncate" style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>
              {isMr ? order.productMr : order.product}
            </p>
            <p className="text-[11px] font-light text-[rgba(245,240,232,0.4)] mt-0.5">{order.seller}</p>
          </div>
          <span className="font-light text-[#F5F0E8] flex-shrink-0" style={{ fontSize: '16px', letterSpacing: '-0.02em' }}>
            {order.amount}
          </span>
        </div>

        {/* Bottom row */}
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
      </div>
    </SectionReveal>
  );
}

export default function OrdersScreen({ lang }: { lang: Language }) {
  const t    = TRANSLATIONS[lang === Language.ENGLISH ? 'en' : 'mr'];
  const isMr = lang === Language.MARATHI;
  const [refreshing, setRefreshing] = useState(false);

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
              <OrderCard key={order.id} order={order} isMr={isMr} index={i} />
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
