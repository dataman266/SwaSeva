import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types.ts';
import {
  ShoppingBag, Package, Truck, CheckCircle, Clock, RotateCcw,
  ChevronRight, ArrowLeft, Phone, MessageSquare, Star, User,
  MapPin, Calendar, IndianRupee, ShieldCheck,
} from 'lucide-react';
import { TRANSLATIONS } from '../constants.tsx';
import PillButton from './atoms/PillButton.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';

// ── Types ─────────────────────────────────────────────────────────────────────
type OrderStatus = 'pending' | 'transit' | 'delivered';
type OrderTab = 'purchased' | 'sold';

interface OrderEntry {
  id: string;
  product: string;
  productMr: string;
  imageUrl: string;
  amount: number;
  qty: number;
  unit: string;
  status: OrderStatus;
  date: string;
  time: string;
  // purchased orders: seller info; sold orders: buyer info
  counterpartyName: string;
  counterpartyPhone: string;
  counterpartyLocation: string;
  counterpartyRating?: number;
  paymentMethod: string;
  transportMode: string;
  notes?: string;
}

// ── Timeline ──────────────────────────────────────────────────────────────────
const TIMELINE_STEPS = [
  { key: 'ordered',    label: 'Order Placed',     labelMr: 'ऑर्डर दिली',    date: 'Apr 10, 2:30 PM'  },
  { key: 'confirmed',  label: 'Payment Verified',  labelMr: 'पेमेंट तपासले', date: 'Apr 10, 4:15 PM'  },
  { key: 'dispatched', label: 'Dispatched',         labelMr: 'पाठवले',         date: 'Apr 11, 9:00 AM'  },
  { key: 'delivered',  label: 'Delivered',          labelMr: 'पोहोचले',        date: 'Apr 12, 11:45 AM' },
];

const STATUS_STEP: Record<OrderStatus, number> = { pending: 0, transit: 2, delivered: 3 };

const STATUS_META: Record<OrderStatus, { label: string; labelMr: string; icon: React.ElementType; color: string; bg: string }> = {
  pending:   { label: 'Pending',    labelMr: 'प्रतीक्षेत',  icon: Clock,       color: '#E8C84A',  bg: 'rgba(212,196,160,0.1)'  },
  transit:   { label: 'In Transit', labelMr: 'मार्गावर',    icon: Truck,       color: '#4CAF50',  bg: 'rgba(74,140,42,0.1)'    },
  delivered: { label: 'Delivered',  labelMr: 'पोहोचले',     icon: CheckCircle, color: '#F5F0E8',  bg: 'rgba(245,240,232,0.08)' },
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_PURCHASED: OrderEntry[] = [
  {
    id: '#AGM-1042',
    product: 'Hybrid Tomato Seeds',
    productMr: 'हायब्रीड टोमॅटो बियाणे',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
    amount: 900,
    qty: 2,
    unit: 'pack (50g)',
    status: 'delivered',
    date: 'Apr 10, 2025',
    time: '2:30 PM',
    counterpartyName: 'Krishi Seva Center',
    counterpartyPhone: '+919876543211',
    counterpartyLocation: 'Main Market, Baramati',
    counterpartyRating: 4.5,
    paymentMethod: 'UPI (PhonePe)',
    transportMode: 'Courier (India Post)',
  },
  {
    id: '#AGM-1038',
    product: 'NPK 19-19-19 Fertilizer',
    productMr: 'NPK १९-१९-१९ खत',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=800&auto=format&fit=crop',
    amount: 2400,
    qty: 20,
    unit: 'kg',
    status: 'transit',
    date: 'Apr 12, 2025',
    time: '10:15 AM',
    counterpartyName: 'Gajanan Seeds',
    counterpartyPhone: '+919876543212',
    counterpartyLocation: 'Satara Road, Pune',
    counterpartyRating: 3.9,
    paymentMethod: 'Bank Transfer (NEFT)',
    transportMode: 'AgriMart Logistics',
    notes: 'Handle with care — granular fertilizer',
  },
  {
    id: '#AGM-1031',
    product: 'Sugarcane Saplings',
    productMr: 'उसाची रोपे',
    imageUrl: 'https://images.unsplash.com/photo-1599423521360-6395e5f5831e?q=80&w=800&auto=format&fit=crop',
    amount: 17500,
    qty: 5000,
    unit: 'sapling',
    status: 'pending',
    date: 'Apr 13, 2025',
    time: '8:45 AM',
    counterpartyName: 'Ramachandra Nursery',
    counterpartyPhone: '+919876543210',
    counterpartyLocation: 'Near Old Toll Gate, Pune',
    counterpartyRating: 4.8,
    paymentMethod: 'UPI (Google Pay)',
    transportMode: 'Self-Pickup arranged',
  },
  {
    id: '#AGM-1027',
    product: 'Mango Graft (Kesar)',
    productMr: 'केसर आंब्याची कलमे',
    imageUrl: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=800&auto=format&fit=crop',
    amount: 3600,
    qty: 20,
    unit: 'plant',
    status: 'delivered',
    date: 'Mar 28, 2025',
    time: '3:20 PM',
    counterpartyName: 'Ramachandra Nursery',
    counterpartyPhone: '+919876543210',
    counterpartyLocation: 'Near Old Toll Gate, Pune',
    counterpartyRating: 4.8,
    paymentMethod: 'UPI (PhonePe)',
    transportMode: 'Courier (DTDC)',
  },
];

const MOCK_SOLD: OrderEntry[] = [
  {
    id: '#AGM-2011',
    product: 'Alphonso Mangoes',
    productMr: 'हापूस आंबा',
    imageUrl: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=800&auto=format&fit=crop',
    amount: 32000,
    qty: 100,
    unit: 'kg',
    status: 'delivered',
    date: 'Apr 08, 2025',
    time: '11:00 AM',
    counterpartyName: 'Suresh Patil',
    counterpartyPhone: '+919823456789',
    counterpartyLocation: 'Kothrud, Pune',
    paymentMethod: 'UPI (PhonePe)',
    transportMode: 'Buyer arranged',
  },
  {
    id: '#AGM-2008',
    product: 'Pomegranate (Bhagwa)',
    productMr: 'डाळिंब (भगवा)',
    imageUrl: 'https://images.pexels.com/photos/7033816/pexels-photo-7033816.jpeg?auto=compress&cs=tinysrgb&w=800',
    amount: 18000,
    qty: 100,
    unit: 'kg',
    status: 'transit',
    date: 'Apr 14, 2025',
    time: '9:30 AM',
    counterpartyName: 'Fresh Mart Retail Pvt.',
    counterpartyPhone: '+912012345678',
    counterpartyLocation: 'Hadapsar, Pune',
    paymentMethod: 'Bank Transfer',
    transportMode: 'AgriMart Logistics',
    notes: 'Corporate buyer — invoice required',
  },
  {
    id: '#AGM-2003',
    product: 'Onion (Nasik Red)',
    productMr: 'कांदा (नाशिक लाल)',
    imageUrl: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&auto=format&fit=crop',
    amount: 28000,
    qty: 1000,
    unit: 'kg',
    status: 'delivered',
    date: 'Mar 22, 2025',
    time: '6:00 AM',
    counterpartyName: 'Nilesh Jadhav',
    counterpartyPhone: '+919765432109',
    counterpartyLocation: 'APMC, Nashik',
    paymentMethod: 'Cash (on pickup)',
    transportMode: 'Buyer arranged (truck)',
  },
];

// ── Order Detail Panel ────────────────────────────────────────────────────────
function OrderDetailPanel({
  order, tab, isMr, onClose,
}: {
  order: OrderEntry; tab: OrderTab; isMr: boolean; onClose: () => void;
}) {
  const currentStep = STATUS_STEP[order.status];

  const rupeeFormat = (n: number) =>
    n >= 1000 ? `₹${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : `₹${n}`;

  const transport = Math.round(order.amount * 0.02);
  const subtotal = order.amount - transport;

  return (
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
      <div style={{ position: 'relative', height: '42vh', overflow: 'hidden' }}>
        <img
          src={order.imageUrl}
          alt={order.product}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(0.8)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A1A0A 20%, transparent 70%)' }} />

        {/* Back button */}
        <button
          onClick={onClose}
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

        {/* Order ID + product name */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.25rem', right: '1.25rem' }}>
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8C84A', marginBottom: 4 }}>
            {order.id}
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 6vw, 28px)', fontWeight: 300, color: '#F5F0E8', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {isMr ? order.productMr : order.product}
          </h2>
          <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(245,240,232,0.5)', marginTop: 4 }}>
            {order.qty} {order.unit}  ·  {order.date}, {order.time}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem 1.25rem 6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Amount + status */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderRadius: '1rem',
          background: '#162B16', border: '1px solid rgba(245,240,232,0.07)',
        }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', marginBottom: 4 }}>
              {isMr ? 'एकूण रक्कम' : 'Total Amount'}
            </p>
            <p style={{ fontSize: '28px', fontWeight: 300, color: '#F5F0E8', letterSpacing: '-0.03em' }}>
              {rupeeFormat(order.amount)}
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0.4rem 0.875rem', borderRadius: '2rem',
            background: STATUS_META[order.status].bg,
          }}>
            {React.createElement(STATUS_META[order.status].icon, { size: 12, style: { color: STATUS_META[order.status].color } })}
            <span style={{ fontSize: '11px', fontWeight: 500, color: STATUS_META[order.status].color }}>
              {isMr ? STATUS_META[order.status].labelMr : STATUS_META[order.status].label}
            </span>
          </div>
        </div>

        {/* Tracking timeline */}
        <div style={{
          padding: '1.25rem', borderRadius: '1rem',
          background: '#162B16', border: '1px solid rgba(245,240,232,0.07)',
        }}>
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', marginBottom: '1rem' }}>
            {isMr ? 'ट्रॅकिंग' : 'Tracking'}
          </p>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 9, top: 10, bottom: 10, width: 1, background: 'rgba(245,240,232,0.07)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {TIMELINE_STEPS.map((step, si) => {
                const done = si <= currentStep;
                const current = si === currentStep;
                return (
                  <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', position: 'relative' }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: done ? 'none' : '1.5px solid rgba(245,240,232,0.15)',
                      background: done ? (current ? '#4CAF50' : 'rgba(74,140,42,0.35)') : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative', zIndex: 1,
                      boxShadow: current ? '0 0 0 3px rgba(74,140,42,0.2)' : 'none',
                    }}>
                      {done && (
                        <svg viewBox="0 0 10 10" width={10} height={10}>
                          <path d="M2 5.5l2 2 4-4" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                      )}
                    </div>
                    <div style={{ paddingTop: 1, flex: 1 }}>
                      <p style={{
                        fontSize: '13px', fontWeight: done ? 400 : 300,
                        color: done ? '#F5F0E8' : 'rgba(245,240,232,0.3)',
                        letterSpacing: '-0.01em',
                      }}>
                        {isMr ? step.labelMr : step.label}
                      </p>
                      {done && (
                        <p style={{ fontSize: '10px', color: current ? '#4CAF50' : 'rgba(245,240,232,0.3)', marginTop: 2 }}>
                          {step.date}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Counterparty card */}
        <div style={{
          padding: '1.25rem', borderRadius: '1rem',
          background: '#162B16', border: '1px solid rgba(245,240,232,0.07)',
        }}>
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', marginBottom: '0.875rem' }}>
            {isMr ? (tab === 'purchased' ? 'विक्रेता' : 'खरेदीदार') : (tab === 'purchased' ? 'Seller' : 'Buyer')}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '0.875rem', flexShrink: 0,
              background: '#1E3A1E', border: '1px solid rgba(245,240,232,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {tab === 'purchased' ? <Package size={18} style={{ color: '#E8C84A' }} /> : <User size={18} style={{ color: '#E8C84A' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '15px', fontWeight: 400, color: '#F5F0E8', letterSpacing: '-0.01em' }}>
                {order.counterpartyName}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 3 }}>
                {order.counterpartyRating && (
                  <>
                    <Star size={11} style={{ color: '#E8C84A', fill: '#E8C84A' }} />
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#E8C84A' }}>{order.counterpartyRating}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(245,240,232,0.25)' }}>·</span>
                  </>
                )}
                <MapPin size={10} style={{ color: 'rgba(245,240,232,0.3)' }} />
                <span style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.4)' }}>{order.counterpartyLocation}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <a
              href={`tel:${order.counterpartyPhone}`}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '0.65rem', borderRadius: '0.75rem',
                background: 'rgba(245,240,232,0.05)', border: '1px solid rgba(245,240,232,0.1)',
                color: 'rgba(245,240,232,0.75)', fontSize: '13px', fontWeight: 400, textDecoration: 'none',
                touchAction: 'manipulation',
              }}
            >
              <Phone size={14} style={{ color: '#E8C84A' }} />
              {isMr ? 'कॉल करा' : 'Call'}
            </a>
            <a
              href={`https://wa.me/${order.counterpartyPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hi, regarding order ${order.id} on Apla AgriMart`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '0.65rem', borderRadius: '0.75rem',
                background: '#2E7D32', border: 'none',
                color: '#F5F0E8', fontSize: '13px', fontWeight: 400, textDecoration: 'none',
                touchAction: 'manipulation',
              }}
            >
              <MessageSquare size={14} />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Price breakdown */}
        <div style={{
          padding: '1.25rem', borderRadius: '1rem',
          background: '#162B16', border: '1px solid rgba(245,240,232,0.07)',
        }}>
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', marginBottom: '0.875rem' }}>
            {isMr ? 'किंमत तपशील' : 'Price Breakdown'}
          </p>
          {[
            { label: isMr ? 'वस्तूची किंमत' : 'Item Total', value: `₹${subtotal.toLocaleString('en-IN')}` },
            { label: isMr ? 'वाहतूक खर्च' : 'Transport', value: `₹${transport.toLocaleString('en-IN')}` },
            { label: isMr ? 'पेमेंट पद्धत' : 'Payment', value: order.paymentMethod },
          ].map(({ label, value }, i, arr) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingBottom: i < arr.length - 1 ? '0.625rem' : 0,
              marginBottom: i < arr.length - 1 ? '0.625rem' : 0,
              borderBottom: i < arr.length - 1 ? '1px solid rgba(245,240,232,0.06)' : 'none',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(245,240,232,0.5)' }}>{label}</span>
              <span style={{ fontSize: '13px', fontWeight: 400, color: '#F5F0E8' }}>{value}</span>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '0.75rem', paddingTop: '0.75rem',
            borderTop: '1px solid rgba(245,240,232,0.1)',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#F5F0E8' }}>{isMr ? 'एकूण' : 'Grand Total'}</span>
            <span style={{ fontSize: '18px', fontWeight: 300, color: '#E8C84A', letterSpacing: '-0.02em' }}>
              ₹{order.amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Transport + notes */}
        <div style={{
          padding: '1rem 1.25rem', borderRadius: '1rem',
          background: '#162B16', border: '1px solid rgba(245,240,232,0.07)',
          display: 'flex', alignItems: 'center', gap: '0.875rem',
        }}>
          <Truck size={18} style={{ color: 'rgba(245,240,232,0.35)', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '13px', fontWeight: 400, color: '#F5F0E8' }}>{order.transportMode}</p>
            {order.notes && (
              <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.4)', marginTop: 2 }}>{order.notes}</p>
            )}
          </div>
        </div>

        {/* AgriMart badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.2, paddingTop: '0.5rem' }}>
          <ShieldCheck size={11} />
          <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {isMr ? 'Apla AgriMart संरक्षित' : 'Apla AgriMart Protected'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Order card ────────────────────────────────────────────────────────────────
function OrderCard({
  order, isMr, index, onClick,
}: {
  order: OrderEntry; isMr: boolean; index: number; onClick: () => void;
}) {
  const meta       = STATUS_META[order.status];
  const StatusIcon = meta.icon;

  return (
    <SectionReveal delay={index * 70}>
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left rounded-2xl overflow-hidden active:scale-[0.985] transition-all"
        style={{
          background: '#162B16', border: '1px solid rgba(245,240,232,0.07)',
          touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div className="flex gap-0">
          {/* Thumbnail */}
          <div style={{ width: 80, flexShrink: 0 }}>
            <img
              src={order.imageUrl}
              alt={isMr ? order.productMr : order.product}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) saturate(0.85)' }}
              loading="lazy"
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, padding: '0.875rem', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '14px', fontWeight: 400, color: '#F5F0E8', letterSpacing: '-0.01em' }} className="truncate">
                {isMr ? order.productMr : order.product}
              </p>
              <ChevronRight size={14} style={{ color: 'rgba(245,240,232,0.25)', flexShrink: 0 }} />
            </div>
            <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.4)', marginBottom: '0.5rem' }}>
              {order.counterpartyName}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '0.2rem 0.55rem', borderRadius: '2rem', background: meta.bg,
              }}>
                <StatusIcon size={10} style={{ color: meta.color }} />
                <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: meta.color }}>
                  {isMr ? meta.labelMr : meta.label}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '15px', fontWeight: 300, color: '#F5F0E8', letterSpacing: '-0.02em' }}>
                  ₹{order.amount.toLocaleString('en-IN')}
                </p>
                <p style={{ fontSize: '9px', fontWeight: 300, color: 'rgba(245,240,232,0.3)', marginTop: 1 }}>{order.date}</p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </SectionReveal>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function OrdersScreen({ lang }: { lang: Language }) {
  const t    = TRANSLATIONS[lang === Language.ENGLISH ? 'en' : 'mr'];
  const isMr = lang === Language.MARATHI;

  const [tab, setTab] = useState<OrderTab>('purchased');
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<OrderEntry | null>(null);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  const orders = tab === 'purchased' ? MOCK_PURCHASED : MOCK_SOLD;

  const totalSpent   = MOCK_PURCHASED.reduce((s, o) => s + o.amount, 0);
  const totalEarned  = MOCK_SOLD.reduce((s, o) => s + o.amount, 0);
  const activeCount  = orders.filter(o => o.status === 'transit' || o.status === 'pending').length;

  const rupeeFormat = (n: number) =>
    n >= 1000 ? `₹${(n / 1000).toFixed(0)}k` : `₹${n}`;

  return (
    <>
      <div className="px-5 pt-8 pb-28 space-y-5" style={{ minHeight: '100vh' }}>

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
              aria-label="Refresh"
            >
              <RotateCcw
                size={14}
                className={`text-[rgba(245,240,232,0.4)] ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </SectionReveal>

        {/* Tab switcher */}
        <SectionReveal delay={40}>
          <div
            className="flex gap-1 p-1 rounded-2xl"
            style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
          >
            {(['purchased', 'sold'] as OrderTab[]).map(key => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  background: tab === key ? '#2E7D32' : 'transparent',
                  color: tab === key ? '#F5F0E8' : 'rgba(245,240,232,0.4)',
                  border: tab === key ? '1px solid rgba(74,140,42,0.4)' : '1px solid transparent',
                  letterSpacing: '0.02em',
                }}
              >
                {key === 'purchased'
                  ? (isMr ? '🛒 खरेदी केले' : '🛒 Purchased')
                  : (isMr ? '🌾 विकले' : '🌾 Sold')}
              </button>
            ))}
          </div>
        </SectionReveal>

        {/* Summary strip */}
        <SectionReveal delay={80}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: isMr ? 'एकूण' : 'Orders',  value: `${orders.length}` },
              { label: isMr ? 'सक्रिय' : 'Active',  value: `${activeCount}` },
              {
                label: tab === 'purchased' ? (isMr ? 'खर्च' : 'Spent') : (isMr ? 'कमाई' : 'Earned'),
                value: rupeeFormat(tab === 'purchased' ? totalSpent : totalEarned),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-2xl text-center"
                style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
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

        {/* Order list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as const }}
            className="space-y-3"
          >
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
                >
                  <ShoppingBag size={24} className="text-[rgba(245,240,232,0.2)]" strokeWidth={1.5} />
                </div>
                <p className="font-light text-[rgba(245,240,232,0.4)]" style={{ fontSize: '15px' }}>
                  {t.noOrders}
                </p>
                <PillButton variant="light">{t.startShopping}</PillButton>
              </div>
            ) : (
              orders.map((order, i) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isMr={isMr}
                  index={i}
                  onClick={() => setSelected(order)}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <SectionReveal delay={280}>
          <div className="flex items-center justify-center gap-2 pt-2 opacity-25">
            <Package size={11} />
            <span className="text-[9px] font-medium tracking-[0.2em] uppercase">
              {isMr ? 'Apla AgriMart लॉजिस्टिक्स' : 'Apla AgriMart Logistics'}
            </span>
          </div>
        </SectionReveal>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <OrderDetailPanel
            order={selected}
            tab={tab}
            isMr={isMr}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
