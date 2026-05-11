import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Language, UserRole } from '../types.ts';
import { getTranslations } from '../constants.tsx';
import { usersApi, ApiUser, ApiUserStats, auth, ApiError } from '../services/api.ts';
import ShopRegistrationView from './dukaan/ShopRegistrationView.tsx';
import {
  Settings, Bell, ShieldCheck, HelpCircle, LogOut,
  ChevronRight, Sprout, ArrowLeft, User, Phone, Mail,
  Globe, Check, X, ChevronDown,
  AlertCircle, Camera, FileText, Building2, Tractor,
  MessageCircle, PhoneCall, Star, Zap, TrendingUp,
  Volume2, Tag, Megaphone, Newspaper,
} from 'lucide-react';

type ProfileView = 'main' | 'settings' | 'notifications' | 'kyc' | 'help' | 'shopRegister';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  labelMr: string;
  color: string;
  action: 'settings' | 'notifications' | 'kyc' | 'help' | 'explore' | 'calendar' | 'signout' | 'onboarding';
}

const MENU_ITEMS: MenuItem[] = [
  { icon: Settings,    label: 'Account Settings', labelMr: 'खाते सेटिंग्ज',      color: '#E8C84A', action: 'settings'     },
  { icon: Bell,        label: 'Notifications',    labelMr: 'सूचना',               color: '#4CAF50', action: 'notifications' },
  { icon: ShieldCheck, label: 'KYC Verification', labelMr: 'KYC पडताळणी',        color: '#7EB3FF', action: 'kyc'           },
  { icon: Newspaper,   label: 'News & About',     labelMr: 'बातम्या आणि माहिती', color: '#E8C84A', action: 'explore'       },
  { icon: Sprout,      label: 'Crop Calendar',    labelMr: 'पीक दिनदर्शिका',     color: '#4CAF50', action: 'calendar'      },
  { icon: HelpCircle,  label: 'Help & Support',   labelMr: 'मदत आणि सहाय्य',    color: '#E8C84A', action: 'help'          },
  { icon: Zap,         label: 'App Tour',         labelMr: 'अ‍ॅप टूर',           color: '#4CAF50', action: 'onboarding'    },
  { icon: LogOut,      label: 'Sign Out',         labelMr: 'बाहेर पडा',           color: '#E57373', action: 'signout'       },
];

interface ProfileScreenProps {
  lang: Language;
  userRole: UserRole;
  highlightShopkeeper?: boolean;
  onHighlightDone?: () => void;
  onBecomeShopkeeper: (role: UserRole) => void;
  onSignOut: () => void;
  onExplore: () => void;
  onOpenCalendar: () => void;
  onResetOnboarding: () => void;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0 }),
};
const slideTransition = { duration: 0.26, ease: [0.32, 0, 0.16, 1] as const };

/* ─── BACK HEADER ────────────────────────────────────────── */
function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(245,240,232,0.07)',
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'rgba(245,240,232,0.06)',
          border: '1px solid rgba(245,240,232,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'rgba(45,90,27,0.2)',
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={16} style={{ color: '#F5F0E8' }} />
      </button>
      <span style={{ fontSize: '17px', fontWeight: 500, color: '#F5F0E8', letterSpacing: '-0.02em' }}>
        {title}
      </span>
    </div>
  );
}

/* ─── ACCOUNT SETTINGS ───────────────────────────────────── */
function SettingsView({
  lang, onBack, apiUser, onUserUpdated,
}: {
  lang: Language; onBack: () => void;
  apiUser: ApiUser | null; onUserUpdated: (u: ApiUser) => void;
}) {
  const isMr = lang === Language.MARATHI;
  const t = getTranslations(lang);
  const [name, setName]   = useState(apiUser?.name_en ?? '');
  const phone             = apiUser?.phone ?? '';
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [saveError, setSaveError] = useState('');

  // Sync name if apiUser loads after mount
  useEffect(() => { if (apiUser?.name_en) setName(apiUser.name_en); }, [apiUser]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const res = await usersApi.updateProfile({ name_en: name.trim() || undefined });
      onUserUpdated(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (ex) {
      setSaveError(ex instanceof ApiError ? ex.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', marginBottom: '0.5rem' }}>
      {children}
    </p>
  );

  const InputField = ({
    icon: Icon, value, onChange, type = 'text', readOnly = false, placeholder = '',
  }: {
    icon: React.ElementType; value: string; onChange?: (v: string) => void;
    type?: string; readOnly?: boolean; placeholder?: string;
  }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      background: readOnly ? 'rgba(245,240,232,0.03)' : 'rgba(245,240,232,0.06)',
      border: `1px solid ${readOnly ? 'rgba(245,240,232,0.07)' : 'rgba(74,140,42,0.25)'}`,
      borderRadius: '0.875rem', padding: '0.875rem 1rem',
    }}>
      <Icon size={15} style={{ color: readOnly ? 'rgba(245,240,232,0.3)' : '#4CAF50', flexShrink: 0 }} />
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={e => onChange?.(e.target.value)}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: readOnly ? 'rgba(245,240,232,0.4)' : '#F5F0E8',
          fontSize: '14px', fontWeight: 300,
        }}
      />
    </div>
  );

  return (
    <div style={{ padding: '2rem 1.25rem 7rem', minHeight: '100vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <SubHeader title={t.accountSettings} onBack={onBack} />

      {/* Profile photo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '1.25rem',
            background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 500, color: '#F5F0E8', letterSpacing: '0.02em',
          }}>
            {name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
          </div>
          <button
            type="button"
            style={{
              position: 'absolute', bottom: -6, right: -6,
              width: 28, height: 28, borderRadius: '50%',
              background: '#E8C84A', border: '2px solid #0A1A0A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Camera size={12} style={{ color: '#0A1A0A' }} />
          </button>
        </div>
      </div>

      {/* Personal info */}
      <div style={{
        background: '#162B16', border: '1px solid rgba(245,240,232,0.07)',
        borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1rem',
      }}>
        <Label>{t.personalInfo}</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
          <InputField icon={User}  value={name}  onChange={setName}  placeholder={t.fullName} />
          <InputField icon={Phone} value={phone} readOnly />
        </div>
      </div>

      {/* Language */}
      <div style={{
        background: '#162B16', border: '1px solid rgba(245,240,232,0.07)',
        borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1rem',
      }}>
        <Label>{t.languageLabel}</Label>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
          {[
            { code: 'EN', label: 'English' },
            { code: 'MR', label: 'मराठी' },
          ].map(({ code, label }) => (
            <button
              key={code}
              type="button"
              style={{
                flex: 1, padding: '0.75rem',
                borderRadius: '0.875rem', cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'rgba(45,90,27,0.2)',
                background: (isMr ? code === 'MR' : code === 'EN') ? 'rgba(74,140,42,0.15)' : 'rgba(245,240,232,0.04)',
                border: `1px solid ${(isMr ? code === 'MR' : code === 'EN') ? 'rgba(74,140,42,0.4)' : 'rgba(245,240,232,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              <Globe size={13} style={{ color: (isMr ? code === 'MR' : code === 'EN') ? '#4CAF50' : 'rgba(245,240,232,0.4)' }} />
              <span style={{
                fontSize: '13px', fontWeight: 400,
                color: (isMr ? code === 'MR' : code === 'EN') ? '#F5F0E8' : 'rgba(245,240,232,0.4)',
              }}>
                {label}
              </span>
              {(isMr ? code === 'MR' : code === 'EN') && (
                <Check size={12} style={{ color: '#4CAF50' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {saveError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <AlertCircle size={13} style={{ color: '#E57373', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#E57373', fontWeight: 300 }}>{saveError}</span>
        </div>
      )}

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        style={{
          width: '100%', padding: '1rem',
          borderRadius: '1rem', cursor: saving ? 'not-allowed' : 'pointer',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'rgba(45,90,27,0.2)',
          background: saved ? 'rgba(74,140,42,0.2)' : '#2E7D32',
          border: `1px solid ${saved ? 'rgba(74,140,42,0.4)' : 'transparent'}`,
          color: '#F5F0E8', fontSize: '15px', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          transition: 'background 0.2s', opacity: saving ? 0.6 : 1,
        }}
      >
        {saved ? (
          <><Check size={16} style={{ color: '#4CAF50' }} /><span style={{ color: '#4CAF50' }}>{t.saved}</span></>
        ) : saving ? (
          isMr ? 'जतन करत आहे…' : 'Saving…'
        ) : (
          t.saveChanges
        )}
      </button>
    </div>
  );
}

/* ─── NOTIFICATIONS ───────────────────────────────────────── */
function NotificationsView({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const isMr = lang === Language.MARATHI;
  const t = getTranslations(lang);

  type NotifKey = 'orders' | 'prices' | 'schemes' | 'news' | 'push' | 'sms' | 'email';
  const [toggles, setToggles] = useState<Record<NotifKey, boolean>>({
    orders: true, prices: true, schemes: false, news: false, push: true, sms: true, email: false,
  });

  const toggle = (key: NotifKey) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: 44, height: 26,
        borderRadius: 13,
        background: on ? '#2E7D32' : 'rgba(245,240,232,0.1)',
        border: `1px solid ${on ? 'rgba(74,140,42,0.4)' : 'rgba(245,240,232,0.12)'}`,
        position: 'relative', cursor: 'pointer',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        transition: 'background 0.2s, border-color 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: on ? '#E8C84A' : 'rgba(245,240,232,0.3)',
        position: 'absolute', top: 2,
        left: on ? 20 : 2,
        transition: 'left 0.18s ease, background 0.2s',
      }} />
    </button>
  );

  const Row = ({
    icon: Icon, color, label, labelMr, sub, subMr, k,
  }: {
    icon: React.ElementType; color: string; label: string; labelMr: string;
    sub: string; subMr: string; k: NotifKey;
  }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 1.25rem',
      borderBottom: '1px solid rgba(245,240,232,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, minWidth: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '0.75rem',
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={15} style={{ color }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '14px', fontWeight: 300, color: '#F5F0E8', letterSpacing: '-0.01em' }}>
            {isMr ? labelMr : label}
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>
            {isMr ? subMr : sub}
          </p>
        </div>
      </div>
      <Toggle on={toggles[k]} onToggle={() => toggle(k)} />
    </div>
  );

  const Section = ({ title }: { title: string }) => (
    <p style={{
      fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)',
      padding: '1rem 1.25rem 0.5rem',
    }}>
      {title}
    </p>
  );

  return (
    <div style={{ padding: '2rem 1.25rem 7rem', minHeight: '100vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <SubHeader title={t.notifications} onBack={onBack} />

      <div style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '1rem' }}>
        <Section title={t.alerts} />
        <Row icon={Zap}      color="#F5C518" label="Order Updates"    labelMr="ऑर्डर अपडेट"   sub="Buyer activity on your listings" subMr="तुमच्या लिस्टिंगवर खरेदीदार क्रिया" k="orders" />
        <Row icon={TrendingUp} color="#4CAF50" label="Price Alerts"  labelMr="किंमत अलर्ट"   sub="Daily MSP & mandi rate changes"  subMr="दैनिक MSP आणि मंडी दर बदल"         k="prices" />
        <Row icon={Tag}      color="#E8C84A" label="Govt Schemes"     labelMr="सरकारी योजना"  sub="PM Kisan, subsidy announcements" subMr="PM किसान, अनुदान घोषणा"            k="schemes" />
        <Row icon={Megaphone} color="#7EB3FF" label="Farming News"   labelMr="शेती बातम्या"  sub="Weather, pest & market news"     subMr="हवामान, कीड आणि बाजार बातम्या"    k="news" />
      </div>

      <div style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '1.25rem', overflow: 'hidden' }}>
        <Section title={t.channels} />
        <Row icon={Bell}         color="#E8C84A" label="Push Notifications" labelMr="पुश सूचना" sub="In-app and lock screen"     subMr="अ‍ॅप आणि लॉक स्क्रीन" k="push"  />
        <Row icon={Phone}        color="#4CAF50" label="SMS"                 labelMr="एसएमएस"   sub="Text alerts to your number"  subMr="तुमच्या नंबरवर SMS"    k="sms"   />
        <Row icon={Mail}         color="#7EB3FF" label="Email"               labelMr="ईमेल"     sub="Weekly digest & reports"    subMr="साप्ताहिक सारांश"      k="email" />
      </div>
    </div>
  );
}

/* ─── KYC VERIFICATION ────────────────────────────────────── */
function KYCView({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const isMr = lang === Language.MARATHI;
  const t = getTranslations(lang);
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);

  const steps = [
    {
      icon: User,
      label: t.aadhaarCard,
      sublabel: t.identityVerification,
      status: 'verified',
      color: '#4CAF50',
      content: (
        <div style={{ padding: '1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'rgba(74,140,42,0.08)', border: '1px solid rgba(74,140,42,0.2)', borderRadius: '0.875rem' }}>
            <Check size={14} style={{ color: '#4CAF50', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '13px', color: '#F5F0E8', fontWeight: 300 }}>XXXX XXXX 4321</p>
              <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.4)', marginTop: 2 }}>
                {isMr ? 'पडताळणी झाली · 12 जाने 2025' : 'Verified · 12 Jan 2025'}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: FileText,
      label: t.panCard,
      sublabel: t.taxId,
      status: 'verified',
      color: '#4CAF50',
      content: (
        <div style={{ padding: '1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'rgba(74,140,42,0.08)', border: '1px solid rgba(74,140,42,0.2)', borderRadius: '0.875rem' }}>
            <Check size={14} style={{ color: '#4CAF50', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '13px', color: '#F5F0E8', fontWeight: 300 }}>ABCDE1234F</p>
              <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.4)', marginTop: 2 }}>
                {isMr ? 'पडताळणी झाली · 12 जाने 2025' : 'Verified · 12 Jan 2025'}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Building2,
      label: t.bankAccount,
      sublabel: t.linkPayments,
      status: 'pending',
      color: '#F5C518',
      content: (
        <div style={{ padding: '1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(74,140,42,0.25)',
            borderRadius: '0.875rem', padding: '0.875rem 1rem',
          }}>
            <Building2 size={15} style={{ color: '#4CAF50', flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t.accountNumber}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F5F0E8', fontSize: '14px', fontWeight: 300 }}
            />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(74,140,42,0.25)',
            borderRadius: '0.875rem', padding: '0.875rem 1rem',
          }}>
            <FileText size={15} style={{ color: '#4CAF50', flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t.ifscCode}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F5F0E8', fontSize: '14px', fontWeight: 300 }}
            />
          </div>
          <button
            type="button"
            onClick={() => setStep(3)}
            style={{
              width: '100%', padding: '0.875rem', borderRadius: '0.875rem',
              background: '#2E7D32', border: 'none', color: '#F5F0E8',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'rgba(45,90,27,0.2)',
            }}
          >
            {t.linkAccount}
          </button>
        </div>
      ),
    },
    {
      icon: Tractor,
      label: t.farmDetails,
      sublabel: t.farmerIdentity,
      status: step >= 3 ? 'pending' : 'locked',
      color: step >= 3 ? '#F5C518' : 'rgba(245,240,232,0.2)',
      content: (
        <div style={{ padding: '1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(74,140,42,0.25)',
            borderRadius: '0.875rem', padding: '0.875rem 1rem',
          }}>
            <Tractor size={15} style={{ color: '#4CAF50', flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t.landArea}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F5F0E8', fontSize: '14px', fontWeight: 300 }}
            />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(74,140,42,0.25)',
            borderRadius: '0.875rem', padding: '0.875rem 1rem',
          }}>
            <FileText size={15} style={{ color: '#4CAF50', flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t.satbaraNumber}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F5F0E8', fontSize: '14px', fontWeight: 300 }}
            />
          </div>
          <div style={{
            padding: '0.875rem 1rem',
            background: 'rgba(74,140,42,0.06)', border: '1px dashed rgba(74,140,42,0.25)',
            borderRadius: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
            cursor: 'pointer', touchAction: 'manipulation',
          }}>
            <Camera size={15} style={{ color: '#4CAF50' }} />
            <span style={{ fontSize: '13px', color: 'rgba(245,240,232,0.6)', fontWeight: 300 }}>
              {t.uploadSatbara}
            </span>
          </div>
          <button
            type="button"
            style={{
              width: '100%', padding: '0.875rem', borderRadius: '0.875rem',
              background: '#2E7D32', border: 'none', color: '#F5F0E8',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'rgba(45,90,27,0.2)',
            }}
          >
            {t.submitReview}
          </button>
        </div>
      ),
    },
  ];

  const completedCount = steps.filter(s => s.status === 'verified').length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div style={{ padding: '2rem 1.25rem 7rem', minHeight: '100vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <SubHeader title={t.kycVerification} onBack={onBack} />

      {/* Progress bar */}
      <div style={{
        background: '#162B16', border: '1px solid rgba(245,240,232,0.07)',
        borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(245,240,232,0.5)' }}>
            {t.completion}
          </span>
          <span style={{ fontSize: '22px', fontWeight: 300, color: '#F5F0E8', letterSpacing: '-0.02em' }}>
            {completedCount}<span style={{ fontSize: '13px', color: 'rgba(245,240,232,0.4)' }}>/{steps.length}</span>
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(245,240,232,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2,
            background: 'linear-gradient(90deg, #2E7D32, #4CAF50)',
            width: `${progress}%`, transition: 'width 0.4s ease',
          }} />
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.3)', marginTop: '0.625rem' }}>
          {isMr
            ? `${steps.length - completedCount} पायऱ्या बाकी आहेत`
            : `${steps.length - completedCount} step${steps.length - completedCount !== 1 ? 's' : ''} remaining`}
        </p>
      </div>

      {/* Steps accordion */}
      <div style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '1.25rem', overflow: 'hidden' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ borderBottom: i < steps.length - 1 ? '1px solid rgba(245,240,232,0.05)' : 'none' }}>
            <button
              type="button"
              onClick={() => setExpanded(expanded === i ? null : i)}
              disabled={s.status === 'locked'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '1rem 1.25rem',
                background: 'transparent', border: 'none', cursor: s.status === 'locked' ? 'not-allowed' : 'pointer',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(45,90,27,0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '0.75rem',
                  background: `${s.color}18`, border: `1px solid ${s.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {s.status === 'verified'
                    ? <Check size={14} style={{ color: s.color }} />
                    : <s.icon size={14} style={{ color: s.color }} />}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '14px', fontWeight: 300, color: s.status === 'locked' ? 'rgba(245,240,232,0.25)' : '#F5F0E8' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>
                    {s.status === 'verified'
                      ? t.complete
                      : s.status === 'locked'
                      ? t.locked
                      : s.sublabel}
                  </p>
                </div>
              </div>
              <ChevronDown
                size={14}
                style={{
                  color: 'rgba(245,240,232,0.3)',
                  transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                }}
              />
            </button>
            <AnimatePresence>
              {expanded === i && s.status !== 'locked' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
                  style={{ overflow: 'hidden' }}
                >
                  {s.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── HELP & SUPPORT ──────────────────────────────────────── */
function HelpView({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const isMr = lang === Language.MARATHI;
  const t = getTranslations(lang);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: isMr ? 'माझे उत्पादन कसे लिस्ट करायचे?' : 'How do I list my produce?',
      a: isMr
        ? 'खालील "विका" टॅबवर जा → श्रेणी निवडा → फोटो आणि किंमत टाका → प्रकाशित करा.'
        : 'Go to the "Sell" tab → Select category → Add photo & price → Publish. Your listing goes live instantly.',
    },
    {
      q: isMr ? 'पेमेंट कसे मिळते?' : 'How do I receive payment?',
      a: isMr
        ? 'KYC पूर्ण करा आणि बँक खाते जोडा. खरेदीदाराच्या ऑर्डरनंतर ७२ तासांत पेमेंट थेट खात्यात जमा होते.'
        : 'Complete KYC and link your bank account. Payment is deposited directly within 72 hours of order confirmation.',
    },
    {
      q: isMr ? 'MSP किंमत कुठून येते?' : 'Where do MSP prices come from?',
      a: isMr
        ? 'सरकारी MSP आणि स्थानिक मंडी दर दररोज अपडेट केले जातात.'
        : 'We aggregate official MSP rates and local mandi (APMC) rates updated every day by 8 AM.',
    },
    {
      q: isMr ? 'ऑर्डर रद्द करता येते का?' : 'Can I cancel an order?',
      a: isMr
        ? 'ऑर्डर स्वीकारण्यापूर्वी रद्द करता येते. नंतर रद्द केल्यास दंड आकारला जाऊ शकतो.'
        : 'Orders can be cancelled before acceptance. Cancellations after acceptance may attract a penalty.',
    },
    {
      q: isMr ? 'Swaseva खर्च किती?' : 'Is Swaseva free?',
      a: isMr
        ? 'लिस्टिंग मोफत आहे. यशस्वी व्यवहारावर फक्त 2% कमिशन आकारतो.'
        : 'Listing is free. We charge a 2% commission only on successful transactions — no success, no fee.',
    },
  ];

  const contactItems = [
    {
      icon: PhoneCall,
      label: t.callUs,
      sub: '1800-XXX-XXXX',
      color: '#4CAF50',
      bg: 'rgba(74,140,42,0.1)',
      border: 'rgba(74,140,42,0.2)',
    },
    {
      icon: MessageCircle,
      label: isMr ? 'WhatsApp' : 'WhatsApp',
      sub: t.chatNow,
      color: '#25D366',
      bg: 'rgba(37,211,102,0.08)',
      border: 'rgba(37,211,102,0.2)',
    },
    {
      icon: Mail,
      label: t.emailUs,
      sub: 'support@swaseva.in',
      color: '#7EB3FF',
      bg: 'rgba(126,179,255,0.08)',
      border: 'rgba(126,179,255,0.2)',
    },
  ];

  return (
    <div style={{ padding: '2rem 1.25rem 7rem', minHeight: '100vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <SubHeader title={t.helpSupport} onBack={onBack} />

      {/* Rating CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #162B16 0%, #1E3A1E 100%)',
        border: '1px solid rgba(74,140,42,0.2)', borderRadius: '1.25rem',
        padding: '1.25rem', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '0.875rem',
          background: 'rgba(212,196,160,0.1)', border: '1px solid rgba(212,196,160,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Star size={18} style={{ color: '#E8C84A' }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '14px', fontWeight: 400, color: '#F5F0E8', letterSpacing: '-0.01em' }}>
            {t.rateApp}
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.4)', marginTop: 2, fontWeight: 300 }}>
            {t.rateDesc}
          </p>
        </div>
        <ChevronRight size={14} style={{ color: 'rgba(245,240,232,0.25)', flexShrink: 0 }} />
      </div>

      {/* Contact */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {contactItems.map(({ icon: Icon, label, sub, color, bg, border }) => (
          <button
            key={label}
            type="button"
            style={{
              padding: '1rem 0.75rem', borderRadius: '1rem',
              background: bg, border: `1px solid ${border}`,
              cursor: 'pointer', touchAction: 'manipulation',
              WebkitTapHighlightColor: 'rgba(45,90,27,0.15)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            }}
          >
            <Icon size={18} style={{ color }} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#F5F0E8', textAlign: 'center' }}>{label}</span>
            <span style={{ fontSize: '10px', color: 'rgba(245,240,232,0.4)', textAlign: 'center' }}>{sub}</span>
          </button>
        ))}
      </div>

      {/* FAQ */}
      <p style={{
        fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)',
        marginBottom: '0.75rem',
      }}>
        {t.faq}
      </p>
      <div style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '1.25rem', overflow: 'hidden' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid rgba(245,240,232,0.05)' : 'none' }}>
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '1rem 1.25rem', background: 'transparent', border: 'none',
                cursor: 'pointer', touchAction: 'manipulation',
                WebkitTapHighlightColor: 'rgba(45,90,27,0.1)',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 300, color: '#F5F0E8', textAlign: 'left', flex: 1, paddingRight: '0.5rem' }}>
                {faq.q}
              </span>
              <ChevronDown
                size={14}
                style={{
                  color: 'rgba(245,240,232,0.3)', flexShrink: 0,
                  transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{
                    padding: '0 1.25rem 1rem',
                    fontSize: '13px', fontWeight: 300,
                    color: 'rgba(245,240,232,0.55)', lineHeight: 1.6,
                  }}>
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PROFILE SCREEN ─────────────────────────────────── */
export default function ProfileScreen({ lang, userRole, highlightShopkeeper, onHighlightDone, onBecomeShopkeeper, onSignOut, onExplore, onOpenCalendar, onResetOnboarding }: ProfileScreenProps) {
  const isMr = lang === Language.MARATHI;
  const t = getTranslations(lang);
  const [profileView, setProfileView] = useState<ProfileView>('main');
  const [prevView, setPrevView]       = useState<ProfileView>('main');
  const [blinkClass, setBlinkClass]   = useState('');
  const [confirmSignOut, setConfirm]  = useState(false);
  const [apiUser, setApiUser]         = useState<ApiUser | null>(null);
  const [apiStats, setApiStats]       = useState<ApiUserStats | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!auth.getAccess()) return;
    const [userRes, statsRes] = await Promise.allSettled([
      usersApi.me(),
      usersApi.stats(),
    ]);
    if (userRes.status === 'fulfilled')  setApiUser(userRes.value.data);
    if (statsRes.status === 'fulfilled') setApiStats(statsRes.value.data);
  }, []);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  // Blink the "Become a Shopkeeper" button when directed from the Dukaan gate
  React.useEffect(() => {
    if (!highlightShopkeeper) return;
    const timer = setTimeout(() => {
      setBlinkClass('shopkeeper-blink');
      onHighlightDone?.();
      // Remove class after animation ends so it can re-trigger if needed
      setTimeout(() => setBlinkClass(''), 1200);
    }, 400); // slight delay lets the screen transition finish first
    return () => clearTimeout(timer);
  }, [highlightShopkeeper]);

  const navigateTo = (view: ProfileView) => {
    setPrevView(profileView);
    setProfileView(view);
  };
  const goBack = () => {
    setPrevView(profileView);
    setProfileView('main');
  };

  const dir = profileView === 'main' ? -1 : 1;

  const handleAction = (action: MenuItem['action']) => {
    switch (action) {
      case 'signout':       setConfirm(true);               break;
      case 'settings':      navigateTo('settings');          break;
      case 'notifications': navigateTo('notifications');     break;
      case 'kyc':           navigateTo('kyc');               break;
      case 'explore':       onExplore();                     break;
      case 'calendar':      onOpenCalendar();                break;
      case 'help':          navigateTo('help');              break;
      case 'onboarding': {
        try { localStorage.removeItem('swaseva_onboarded'); } catch {}
        onResetOnboarding();
        break;
      }
    }
  };

  const menuLabel = (action: MenuItem['action'], label: string, labelMr: string): string => {
    const map: Partial<Record<MenuItem['action'], string>> = {
      settings: t.accountSettings,
      notifications: t.notifications,
      kyc: t.kycVerification,
      help: t.helpSupport,
      signout: t.signOut,
    };
    return map[action] ?? (isMr ? labelMr : label);
  };

  return (
    <div style={{ minHeight: '100vh', overflowY: profileView === 'main' ? 'auto' : 'hidden', WebkitOverflowScrolling: 'touch', position: 'relative' }}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={profileView}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
        >
          {profileView === 'settings' && (
            <SettingsView
              lang={lang}
              onBack={goBack}
              apiUser={apiUser}
              onUserUpdated={u => setApiUser(u)}
            />
          )}
          {profileView === 'notifications' && (
            <NotificationsView lang={lang} onBack={goBack} />
          )}
          {profileView === 'kyc' && (
            <KYCView lang={lang} onBack={goBack} />
          )}
          {profileView === 'help' && (
            <HelpView lang={lang} onBack={goBack} />
          )}
          {profileView === 'shopRegister' && (
            <div style={{ minHeight: '100vh', background: '#0A1A0A', padding: '1rem 1.25rem 7rem' }}>
              <SubHeader title={t.shopRegistration} onBack={goBack} />
              <ShopRegistrationView
                lang={lang}
                onSave={(profile) => {
                  localStorage.setItem('swaseva_user_role', 'shopkeeper');
                  localStorage.setItem('swaseva_shop_profile', JSON.stringify(profile));
                  onBecomeShopkeeper('shopkeeper');
                  goBack();
                }}
              />
            </div>
          )}
          {profileView === 'main' && (
            <div style={{ padding: '2rem 1.25rem 7rem' }}>

              {/* ── Identity card ────────────────────────────────────── */}
              <div
                className="p-6 rounded-2xl mb-6"
                style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center font-medium text-lg text-[#F5F0E8]"
                      style={{ background: '#2E7D32', letterSpacing: '0.02em' }}
                    >
                      {(apiUser?.name_en ?? '?').trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: '#E8C84A', border: '2px solid #0A1A0A' }}
                    >
                      <ShieldCheck size={10} className="text-[#0A1A0A]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-medium text-[#F5F0E8] truncate" style={{ fontSize: '18px', letterSpacing: '-0.02em' }}>
                      {isMr
                        ? (apiUser?.name_mr ?? apiUser?.name_en ?? t.premiumFarmer)
                        : (apiUser?.name_en ?? t.premiumFarmer)}
                    </h2>
                    <p className="font-light text-[rgba(245,240,232,0.45)] mt-0.5" style={{ fontSize: '13px' }}>
                      {apiUser?.phone ?? ''}
                    </p>
                    <div
                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full"
                      style={{ background: 'rgba(74,140,42,0.12)', border: '1px solid rgba(74,140,42,0.2)' }}
                    >
                      <Sprout size={10} className="text-[#4CAF50]" />
                      <span className="text-[9px] font-medium tracking-[0.12em] uppercase text-[#4CAF50]">
                        {t.premiumFarmer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Role card ────────────────────────────────────────── */}
              {userRole === 'shopkeeper' ? (
                <div
                  className="w-full flex items-center justify-between p-4 rounded-2xl mb-4"
                  style={{ background: 'rgba(45,90,27,0.18)', border: '1px solid rgba(74,140,42,0.2)' }}
                >
                  <div className="text-left">
                    <p className="text-[15px] font-semibold text-[#F5F0E8]">🏪 {t.myDukaan}</p>
                    <p className="text-[12px] text-[rgba(245,240,232,0.45)] mt-0.5">
                      {isMr ? '"माझी यादी" टॅबमधून पोर्टल उघडा' : 'Open portal from the My Listings tab'}
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0"
                    style={{ background: 'rgba(76,175,80,0.12)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.25)' }}>
                    ● {isMr ? 'सक्रिय' : 'Active'}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigateTo('shopRegister')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl mb-4 active:scale-[0.98] transition-all ${blinkClass}`}
                  style={{ background: 'rgba(232,200,74,0.06)', border: '1px solid rgba(232,200,74,0.2)', borderRadius: '1rem' }}
                >
                  <span className="text-2xl flex-shrink-0">🏪</span>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold text-[#F5F0E8]">{t.becomeShopkeeper}</p>
                    <p className="text-[12px] text-[rgba(245,240,232,0.5)] mt-0.5">{isMr ? 'तुमच्या दुकानातून कृषी निविष्ठा उत्पादने विका' : 'List agri-input products from your shop'}</p>
                  </div>
                </button>
              )}

              {/* ── Stats strip ──────────────────────────────────────── */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { value: apiStats ? String(apiStats.activeListings) : '—', label: t.listingsLabel },
                  { value: '4.8',  label: t.ratingLabel },
                  { value: apiStats ? String(apiStats.totalOrders)    : '—', label: t.salesLabel    },
                ].map(({ value, label }) => (
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

              {/* ── Menu list ────────────────────────────────────────── */}
              <div
                className="rounded-2xl overflow-hidden mb-6"
                style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
              >
                {MENU_ITEMS.map(({ icon: Icon, label, labelMr, color, action }, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleAction(action)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '1rem 1.25rem',
                      background: 'transparent', border: 'none',
                      borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid rgba(245,240,232,0.05)' : 'none',
                      cursor: 'pointer', touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'rgba(45,90,27,0.2)',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <Icon size={16} style={{ color, flexShrink: 0 }} strokeWidth={1.75} />
                      <span style={{ fontSize: '14px', fontWeight: 300, color: action === 'signout' ? '#E57373' : '#F5F0E8', letterSpacing: '-0.01em' }}>
                        {menuLabel(action, label, labelMr)}
                      </span>
                    </span>
                    <ChevronRight size={14} style={{ color: 'rgba(245,240,232,0.2)', flexShrink: 0 }} />
                  </button>
                ))}
              </div>

              {/* ── Version footer ───────────────────────────────────── */}
              <div className="flex items-center justify-center pt-2">
                <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.2)', textTransform: 'uppercase' }}>
                  Swaseva · v1.2.4
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Sign Out confirmation — portalled to body to escape motion stacking context ── */}
      {createPortal(
        <AnimatePresence>
          {confirmSignOut && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'flex-end', zIndex: 9999,
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
                  width: '100%', background: '#162B16',
                  borderRadius: '1.5rem 1.5rem 0 0',
                  padding: '1.5rem 1.5rem calc(env(safe-area-inset-bottom, 0px) + 2rem)',
                  border: '1px solid rgba(245,240,232,0.07)',
                }}
              >
                <p className="text-[#F5F0E8] font-light text-center mb-1" style={{ fontSize: '18px', letterSpacing: '-0.02em' }}>
                  {t.signOutConfirm}
                </p>
                <p className="text-center text-[rgba(245,240,232,0.4)] font-light mb-6" style={{ fontSize: '13px' }}>
                  {t.signOutDesc}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirm(false)}
                    style={{
                      flex: 1, padding: '0.875rem', borderRadius: '0.875rem',
                      background: 'rgba(245,240,232,0.06)', border: 'none',
                      color: '#F5F0E8', fontSize: '14px', fontWeight: 400,
                      cursor: 'pointer', touchAction: 'manipulation',
                    }}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={onSignOut}
                    style={{
                      flex: 1, padding: '0.875rem', borderRadius: '0.875rem',
                      background: 'rgba(229,115,115,0.15)', border: '1px solid rgba(229,115,115,0.3)',
                      color: '#E57373', fontSize: '14px', fontWeight: 500,
                      cursor: 'pointer', touchAction: 'manipulation',
                    }}
                  >
                    {t.signOut}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
