import React from 'react';
import { motion } from 'motion/react';
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

// Simple stagger helper — no whileInView, just animate on mount
const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.07 },
});

interface ProfileScreenProps {
  lang: Language;
  onSignOut: () => void;
}

export default function ProfileScreen({ lang, onSignOut }: ProfileScreenProps) {
  const isMr = lang === Language.MARATHI;

  const handleAction = (action: MenuItem['action']) => {
    if (action === 'signout') onSignOut();
    // TODO: navigate to sub-screens when built
  };

  return (
    <div
      className="px-5 pt-8 pb-28 space-y-6"
      style={{ minHeight: '100vh', overflowY: 'auto' }}
    >
      {/* ── Identity card ─────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)}>
        <div
          className="p-6 rounded-2xl"
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
      </motion.div>

      {/* ── Stats strip ───────────────────────────────────────────── */}
      <motion.div {...fadeUp(1)}>
        <div className="grid grid-cols-3 gap-3">
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
      </motion.div>

      {/* ── Menu list ──────────────────────────────────────────────── */}
      <motion.div {...fadeUp(2)}>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
        >
          {MENU_ITEMS.map(({ icon: Icon, label, labelMr, color, action }, i) => (
            <motion.button
              key={label}
              type="button"
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.1 }}
              onClick={() => handleAction(action)}
              className="w-full flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid rgba(245,240,232,0.05)' : 'none',
                background: 'transparent',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'rgba(45,90,27,0.15)',
              }}
            >
              <div className="flex items-center gap-3.5">
                <Icon size={16} style={{ color }} strokeWidth={1.75} />
                <span
                  className="font-light"
                  style={{
                    fontSize: '14px',
                    color: action === 'signout' ? '#E57373' : '#F5F0E8',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {isMr ? labelMr : label}
                </span>
              </div>
              <ChevronRight size={14} style={{ color: 'rgba(245,240,232,0.2)' }} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Version footer ────────────────────────────────────────── */}
      <motion.div {...fadeUp(3)} className="flex items-center justify-center gap-2 pt-2">
        <span className="text-[9px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(245,240,232,0.2)' }}>
          Apla AgriMart · v1.2.4
        </span>
      </motion.div>
    </div>
  );
}
