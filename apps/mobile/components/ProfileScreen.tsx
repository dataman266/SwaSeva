import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types.ts';
import {
  Settings, Bell, ShieldCheck, HelpCircle, LogOut,
  ChevronRight, Sprout,
} from 'lucide-react';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  labelMr: string;
  color: string;
  action: 'settings' | 'notifications' | 'kyc' | 'help' | 'signout';
}

const MENU_ITEMS: MenuItem[] = [
  { icon: Settings,    label: 'Account Settings', labelMr: 'खाते सेटिंग्ज',   color: '#D4C4A0', action: 'settings'      },
  { icon: Bell,        label: 'Notifications',     labelMr: 'सूचना',            color: '#4A8C2A', action: 'notifications'  },
  { icon: ShieldCheck, label: 'KYC Verification',  labelMr: 'KYC पडताळणी',     color: '#F5F0E8', action: 'kyc'            },
  { icon: HelpCircle,  label: 'Help & Support',    labelMr: 'मदत आणि सहाय्य',   color: '#D4C4A0', action: 'help'           },
  { icon: LogOut,      label: 'Sign Out',           labelMr: 'बाहेर पडा',        color: '#E57373', action: 'signout'        },
];

interface ProfileScreenProps {
  lang: Language;
  onSignOut: () => void;
}

export default function ProfileScreen({ lang, onSignOut }: ProfileScreenProps) {
  const isMr = lang === Language.MARATHI;
  const [toast, setToast]             = useState('');
  const [confirmSignOut, setConfirm]  = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleAction = (action: MenuItem['action']) => {
    switch (action) {
      case 'signout':
        setConfirm(true);
        break;
      case 'settings':
        showToast(isMr ? 'लवकरच येणार आहे…' : 'Account Settings — coming soon');
        break;
      case 'notifications':
        showToast(isMr ? 'लवकरच येणार आहे…' : 'Notifications — coming soon');
        break;
      case 'kyc':
        showToast(isMr ? 'KYC लवकरच सुरू होईल' : 'KYC Verification — coming soon');
        break;
      case 'help':
        showToast(isMr ? 'मदत विभाग लवकरच' : 'Help & Support — coming soon');
        break;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '2rem 1.25rem 7rem',
      }}
    >
      {/* ── Identity card ─────────────────────────────────────────── */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
      >
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-medium text-lg text-[#F5F0E8]"
              style={{ background: '#2D5A1B', letterSpacing: '0.02em' }}
            >
              RS
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#D4C4A0', border: '2px solid #0A1A0A' }}
            >
              <ShieldCheck size={10} className="text-[#0A1A0A]" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-[#F5F0E8] truncate" style={{ fontSize: '18px', letterSpacing: '-0.02em' }}>
              Rajesh Shinde
            </h2>
            <p className="font-light text-[rgba(245,240,232,0.45)] mt-0.5" style={{ fontSize: '13px' }}>
              +91 99999 88888
            </p>
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(74,140,42,0.12)', border: '1px solid rgba(74,140,42,0.2)' }}
            >
              <Sprout size={10} className="text-[#4A8C2A]" />
              <span className="text-[9px] font-medium tracking-[0.12em] uppercase text-[#4A8C2A]">
                {isMr ? 'प्रीमियम शेतकरी' : 'Premium Farmer'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { value: '12',   label: isMr ? 'लिस्टिंग' : 'Listings' },
          { value: '4.8',  label: isMr ? 'रेटिंग'   : 'Rating'   },
          { value: '₹48k', label: isMr ? 'विक्री'   : 'Sales'    },
        ].map(({ value, label }) => (
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

      {/* ── Menu list ──────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
      >
        {MENU_ITEMS.map(({ icon: Icon, label, labelMr, color, action }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => handleAction(action)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '1rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid rgba(245,240,232,0.05)' : 'none',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'rgba(45,90,27,0.2)',
              textAlign: 'left',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <Icon size={16} style={{ color, flexShrink: 0 }} strokeWidth={1.75} />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 300,
                  color: action === 'signout' ? '#E57373' : '#F5F0E8',
                  letterSpacing: '-0.01em',
                }}
              >
                {isMr ? labelMr : label}
              </span>
            </span>
            <ChevronRight size={14} style={{ color: 'rgba(245,240,232,0.2)', flexShrink: 0 }} />
          </button>
        ))}
      </div>

      {/* ── Version footer ────────────────────────────────────────── */}
      <div className="flex items-center justify-center pt-2">
        <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.2)', textTransform: 'uppercase' }}>
          Apla AgriMart · v1.2.4
        </span>
      </div>

      {/* ── Toast ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
            style={{
              position: 'fixed',
              bottom: '6rem',
              left: '1.25rem',
              right: '1.25rem',
              background: '#1A2D1A',
              border: '1px solid rgba(45,90,27,0.4)',
              borderRadius: '1rem',
              padding: '0.875rem 1.25rem',
              color: '#F5F0E8',
              fontSize: '13px',
              fontWeight: 300,
              zIndex: 200,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sign Out confirmation ──────────────────────────────────── */}
      <AnimatePresence>
        {confirmSignOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'flex-end',
              zIndex: 300,
            }}
            onClick={() => setConfirm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 38 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                background: '#111C11',
                borderRadius: '1.5rem 1.5rem 0 0',
                padding: '1.5rem 1.5rem 2.5rem',
                border: '1px solid rgba(245,240,232,0.07)',
              }}
            >
              <p className="text-[#F5F0E8] font-light text-center mb-1" style={{ fontSize: '18px', letterSpacing: '-0.02em' }}>
                {isMr ? 'लॉग आउट करायचे?' : 'Sign out?'}
              </p>
              <p className="text-center text-[rgba(245,240,232,0.4)] font-light mb-6" style={{ fontSize: '13px' }}>
                {isMr ? 'तुम्हाला पुन्हा लॉग इन करावे लागेल' : 'You will need to log in again'}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '0.875rem',
                    background: 'rgba(245,240,232,0.06)',
                    border: 'none',
                    color: '#F5F0E8',
                    fontSize: '14px',
                    fontWeight: 400,
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                  }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={onSignOut}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '0.875rem',
                    background: 'rgba(229,115,115,0.15)',
                    border: '1px solid rgba(229,115,115,0.3)',
                    color: '#E57373',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                  }}
                >
                  {isMr ? 'बाहेर पडा' : 'Sign Out'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
