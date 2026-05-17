import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Phone, Lock, User, MapPin, Hash, Camera, ChevronRight, ArrowLeft, Loader, ChevronDown } from 'lucide-react';
import PillButton from './atoms/PillButton.tsx';
import SearchableDropdown, { DropdownOption } from './atoms/SearchableDropdown.tsx';
import LanguagePicker from './LanguagePicker.tsx';
import { Language } from '../types.ts';
import {
  INDIAN_STATES, MAHARASHTRA_DISTRICTS, getTalukasByDistrict,
} from '../data/maharashtraLocations.ts';
import { authApi, auth, ApiError } from '../services/api.ts';

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthView = 'login' | 'register-step1' | 'register-step2' | 'register-step3' | 'otp-verify';

interface AuthScreenProps {
  lang: Language;
  onAuthSuccess: (token: string) => void;
  onLanguageChange?: (lang: Language) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const AUTH_BG = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1600&auto=format&fit=crop';

const slide = {
  enter:  (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir * -40, opacity: 0 }),
};
const trs = { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const };

function err(msg: string) {
  return <p className="text-[11px] text-red-400 mt-1 ml-1" role="alert">{msg}</p>;
}

// ── Input field ───────────────────────────────────────────────────────────────

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
  error?: string;
  required?: boolean;
  rightEl?: React.ReactNode;
}

function Field({ label, icon: Icon, error, required, rightEl, className, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: '#E8C84A' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <Icon size={16} className="absolute left-4 z-10 pointer-events-none" style={{ color: 'rgba(245,240,232,0.3)' }} />
        )}
        <input
          {...props}
          className={`w-full rounded-2xl text-[#F5F0E8] font-light placeholder:text-[rgba(245,240,232,0.25)] outline-none transition-colors focus:border-[#2E7D32] ${className ?? ''}`}
          style={{
            height: 52,
            background: '#162B16',
            border: `1px solid ${error ? '#EF4444' : 'rgba(245,240,232,0.1)'}`,
            fontSize: 14,
            paddingLeft: Icon ? 44 : 16,
            paddingRight: rightEl ? 48 : 16,
          }}
          aria-invalid={!!error}
          aria-required={required}
        />
        {rightEl && (
          <div className="absolute right-3.5 z-10">{rightEl}</div>
        )}
      </div>
      {error && err(error)}
    </div>
  );
}

// ── PasswordField ─────────────────────────────────────────────────────────────

function PasswordField(props: Omit<FieldProps, 'type' | 'rightEl'>) {
  const [show, setShow] = useState(false);
  return (
    <Field
      {...props}
      type={show ? 'text' : 'password'}
      rightEl={
        <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
          {show
            ? <EyeOff size={18} style={{ color: 'rgba(245,240,232,0.35)' }} />
            : <Eye    size={18} style={{ color: 'rgba(245,240,232,0.35)' }} />}
        </button>
      }
    />
  );
}

// ── Shared layout shell ───────────────────────────────────────────────────────

function AuthShell({ children, langToggle }: { children: React.ReactNode; langToggle?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col overflow-hidden" style={{ background: '#0A1A0A' }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img src={AUTH_BG} alt="" aria-hidden className="w-full h-full object-cover" style={{ filter: 'brightness(0.25) saturate(0.6)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A0A] via-[rgba(10,26,10,0.7)] to-transparent" />
      </div>
      {/* Brand mark + language toggle */}
      <div className="relative z-10 pt-safe px-6 pt-12 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <div>
              <p className="text-[#F5F0E8] font-light" style={{ fontSize: 18, letterSpacing: '-0.02em' }}>Swaseva</p>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#E8C84A', opacity: 0.7 }}>थेट शेतातून / Direct from Farm</p>
            </div>
          </div>
          {langToggle}
        </div>
      </div>
      {/* Scrollable form area */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

const LANG_LABELS: Record<Language, { native: string; short: string }> = {
  [Language.ENGLISH]:   { native: 'English',  short: 'EN'  },
  [Language.MARATHI]:   { native: 'मराठी',   short: 'MR'  },
  [Language.HINDI]:     { native: 'हिंदी',    short: 'HI'  },
  [Language.GUJARATI]:  { native: 'ગુજરાતી', short: 'GU'  },
  [Language.TELUGU]:    { native: 'తెలుగు',  short: 'TE'  },
  [Language.PUNJABI]:   { native: 'ਪੰਜਾਬੀ',  short: 'PA'  },
  [Language.KANNADA]:   { native: 'ಕನ್ನಡ',   short: 'KN'  },
  [Language.TAMIL]:     { native: 'தமிழ்',   short: 'TA'  },
  [Language.BENGALI]:   { native: 'বাংলা',   short: 'BN'  },
  [Language.ODIA]:      { native: 'ଓଡ଼ିଆ',   short: 'OR'  },
  [Language.MALAYALAM]: { native: 'മലയാളം',  short: 'ML'  },
};

export default function AuthScreen({ lang, onAuthSuccess, onLanguageChange }: AuthScreenProps) {
  const [view,           setView]           = useState<AuthView>('login');
  const [dir,            setDir]            = useState(1);
  const [localLang,      setLocalLang]      = useState(lang);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const isMr = localLang === Language.MARATHI;

  const go = useCallback((next: AuthView, direction = 1) => {
    setDir(direction);
    setView(next);
  }, []);

  const handleLangSelect = (l: Language) => {
    setLocalLang(l);
    onLanguageChange?.(l);
    setShowLangPicker(false);
  };

  const langToggle = (
    <>
      <button
        type="button"
        onClick={() => setShowLangPicker(s => !s)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(232,200,74,0.1)',
          border: '1px solid rgba(232,200,74,0.3)',
          borderRadius: 99,
          padding: '6px 12px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#E8C84A',
          letterSpacing: '0.06em',
          cursor: 'pointer',
          touchAction: 'manipulation',
        }}
        aria-label="Select language"
      >
        <span style={{ fontFamily: "'Noto Sans Devanagari','Noto Sans',system-ui,sans-serif" }}>
          {LANG_LABELS[localLang].native}
        </span>
        <ChevronDown size={12} style={{ opacity: 0.7, transform: showLangPicker ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      <LanguagePicker
        open={showLangPicker}
        current={localLang}
        onSelect={handleLangSelect}
        onClose={() => setShowLangPicker(false)}
      />
    </>
  );

  return (
    <AuthShell langToggle={langToggle}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={view} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={trs}>
          {view === 'login'          && <LoginView      isMr={isMr} onSentOtp={() => go('otp-verify')} />}
          {view === 'otp-verify'     && <OtpVerify     isMr={isMr} onBack={() => go('login', -1)} onSuccess={onAuthSuccess} onNewUser={() => go('register-step1')} />}
          {view === 'register-step1' && <RegisterStep1  isMr={isMr} onBack={() => go('login', -1)} onNext={() => go('register-step2')} />}
          {view === 'register-step2' && <RegisterStep2  isMr={isMr} onBack={() => go('register-step1', -1)} onSuccess={onAuthSuccess} />}
        </motion.div>
      </AnimatePresence>
    </AuthShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN VIEW
// ══════════════════════════════════════════════════════════════════════════════

function LoginView({ isMr, onSentOtp }: {
  isMr: boolean; onSentOtp: () => void;
}) {
  const [mobile,  setMobile]  = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile.trim())) {
      setError(isMr ? 'बरोबर १० अंकी नंबर द्या' : 'Enter a valid 10-digit number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.sendOtp('+91' + mobile.trim());
      auth.setPhone('+91' + mobile.trim());
      onSentOtp();
    } catch (ex) {
      const detail = ex instanceof ApiError
        ? ex.message
        : `Network error: ${ex instanceof Error ? ex.message : String(ex)}`;
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="px-6 pb-safe pb-10 pt-4">
      <h1 className="text-[#F5F0E8] font-light mb-1" style={{ fontSize: 'clamp(28px,8vw,36px)', letterSpacing: '-0.03em' }}>
        {isMr ? 'लॉग इन करा' : 'Welcome back'}
      </h1>
      <p className="text-[rgba(245,240,232,0.45)] font-light mb-8" style={{ fontSize: 13 }}>
        {isMr ? 'OTP द्वारे प्रवेश करा' : 'We\'ll send an OTP to verify your number'}
      </p>

      <Field
        label={isMr ? 'मोबाइल नंबर' : 'Mobile Number'}
        icon={Phone}
        type="tel"
        inputMode="numeric"
        maxLength={10}
        placeholder="9876543210"
        value={mobile}
        onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); setError(''); }}
        error={error}
        required
        autoComplete="tel"
      />

      <div className="mt-6">
        <PillButton variant="light" fullWidth size="lg" disabled={loading}>
          {loading
            ? <Loader size={18} className="animate-spin" />
            : (isMr ? 'OTP पाठवा' : 'Send OTP')}
        </PillButton>
      </div>

      <p className="text-center text-[12px] mt-5" style={{ color: 'rgba(245,240,232,0.35)', lineHeight: 1.6 }}>
        {isMr
          ? 'नवीन आहात? वरील नंबर टाका — OTP सत्यापनानंतर आपोआप नोंदणी होईल.'
          : 'New to Swaseva? Enter your number above — we\'ll register you automatically after OTP verification.'}
      </p>
    </form>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER STEP 1 — Identity + Account credentials
// ══════════════════════════════════════════════════════════════════════════════

interface Step1Data {
  fullName: string;
  nameMr: string;
}

// Shared step1 data store (module-level ref to pass between steps without prop drilling)
let _step1: Step1Data = { fullName: '', nameMr: '' };
let _isShopkeeper = false;

function RegisterStep1({ isMr, onBack, onNext }: { isMr: boolean; onBack: () => void; onNext: () => void }) {
  const [form,   setForm]   = useState<Step1Data>(_step1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof Step1Data, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  const next = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = isMr ? 'पूर्ण नाव आवश्यक आहे' : 'Full name is required';
    if (Object.keys(e).length) { setErrors(e); return; }
    _step1 = form;
    onNext();
  };

  return (
    <div className="px-6 pb-safe pb-10 pt-2">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 mb-5 -ml-1" style={{ color: 'rgba(245,240,232,0.5)', fontSize: 13 }}>
        <ArrowLeft size={16} /> {isMr ? 'मागे' : 'Back'}
      </button>

      <div className="flex items-center gap-2 mb-3">
        <StepDot active /><StepDot />
        <span className="text-[10px] tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)] ml-1">1 / 2</span>
      </div>

      <h1 className="text-[#F5F0E8] font-light mb-1" style={{ fontSize: 'clamp(24px,7vw,32px)', letterSpacing: '-0.03em' }}>
        {isMr ? 'ओळख तयार करा' : 'Create your identity'}
      </h1>
      <p className="text-[rgba(245,240,232,0.45)] font-light mb-7" style={{ fontSize: 13 }}>
        {isMr ? 'तुमचे नाव द्या' : 'Tell us your name'}
      </p>

      <div className="flex flex-col gap-4">
        <Field
          label={isMr ? 'पूर्ण नाव (इंग्रजी)' : 'Full Name'}
          icon={User}
          placeholder={isMr ? 'उदा. Ramesh Patil' : 'e.g. Ramesh Patil'}
          type="text"
          value={form.fullName}
          onChange={e => set('fullName', e.target.value)}
          error={errors.fullName}
          required
          autoComplete="name"
        />
        <Field
          label={isMr ? 'पूर्ण नाव (मराठी — पर्यायी)' : 'Name in Marathi (optional)'}
          icon={User}
          placeholder="उदा. रमेश पाटील"
          type="text"
          value={form.nameMr}
          onChange={e => set('nameMr', e.target.value)}
        />
        <p className="text-[10px] text-[rgba(245,240,232,0.35)] ml-1 -mt-2">
          {isMr
            ? 'मोबाइल नंबर OTP द्वारे आधीच सत्यापित झाला आहे'
            : 'Your mobile number was verified via OTP in the previous step'}
        </p>
      </div>

      <div className="mt-7">
        <PillButton variant="light" fullWidth size="lg" onClick={next}>
          {isMr ? 'पुढे — पत्ता व भूमिका' : 'Next — Address & Role'} →
        </PillButton>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER STEP 2 — Address & Location
// ══════════════════════════════════════════════════════════════════════════════

function RegisterStep2({ isMr, onBack, onSuccess }: { isMr: boolean; onBack: () => void; onSuccess: (t: string) => void }) {
  const [state,         setState]         = useState('Maharashtra');
  const [district,      setDistrict]      = useState('');
  const [taluka,        setTaluka]        = useState('');
  const [isShopkeeper,  setIsShopkeeper]  = useState(localStorage.getItem('swaseva_user_role') === 'shopkeeper');
  // Shop fields (only used when isShopkeeper)
  const [shopName,      setShopName]      = useState('');
  const [licenseType,   setLicenseType]   = useState<'gst' | 'license'>('gst');
  const [licenseValue,  setLicenseValue]  = useState('');
  const [exteriorUri,   setExteriorUri]   = useState('');
  const [interiorUri,   setInteriorUri]   = useState('');
  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const [loading,       setLoading]       = useState(false);

  const isMH = state === 'Maharashtra';

  const districtOpts: DropdownOption[] = isMH
    ? MAHARASHTRA_DISTRICTS.map(d => ({ value: d.id, label: isMr ? d.nameMr : d.name }))
    : [];

  const talukaOpts: DropdownOption[] = district && isMH
    ? getTalukasByDistrict(district).map(t => ({ value: t.id, label: isMr ? t.nameMr : t.name }))
    : [];

  const stateOpts: DropdownOption[] = INDIAN_STATES.map(s => ({ value: s, label: s }));

  const handlePhoto = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!state)    e.state    = isMr ? 'राज्य निवडा'          : 'State is required';
    if (!district) e.district = isMr ? 'जिल्हा निवडा'         : 'District is required';
    if (isMH && talukaOpts.length > 0 && !taluka) e.taluka = isMr ? 'तालुका निवडा' : 'Taluka is required';
    if (isShopkeeper) {
      if (!shopName.trim()) e.shopName = isMr ? 'दुकानाचे नाव आवश्यक आहे' : 'Shop name is required';
      if (!licenseValue.trim()) e.license = isMr ? 'GST / परवाना क्रमांक आवश्यक आहे' : 'GST or license number is required';
      if (!exteriorUri) e.exterior = isMr ? 'दुकानाचा बाहेरचा फोटो आवश्यक आहे' : 'Exterior photo is required';
      if (!interiorUri) e.interior = isMr ? 'दुकानाचा आतील फोटो आवश्यक आहे' : 'Interior photo is required';
    }
    return e;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authApi.register({
        phone:       auth.getPhone(),
        name_en:     _step1.fullName,
        name_mr:     _step1.nameMr || undefined,
        state:       state || undefined,
        district:    district || undefined,
        taluka:      taluka  || undefined,
        primaryRole: isShopkeeper ? 'RETAILER' : 'FARMER',
      });
      auth.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
      if (isShopkeeper) {
        const profile = { shopName, gstOrLicense: licenseValue, exteriorPhotoUri: exteriorUri, interiorPhotoUri: interiorUri, verificationStatus: 'pending' as const };
        localStorage.setItem('swaseva_user_role', 'shopkeeper');
        localStorage.setItem('swaseva_shop_profile', JSON.stringify(profile));
      } else {
        localStorage.setItem('swaseva_user_role', 'farmer');
      }
      _isShopkeeper = false;
      onSuccess(res.data.tokens.accessToken);
    } catch (ex) {
      const msg = ex instanceof ApiError ? ex.message : (isMr ? 'नोंदणी अयशस्वी' : 'Registration failed. Please try again.');
      setErrors(prev => ({ ...prev, _form: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pb-safe pb-10 pt-2">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 mb-5 -ml-1" style={{ color: 'rgba(245,240,232,0.5)', fontSize: 13 }}>
        <ArrowLeft size={16} /> {isMr ? 'मागे' : 'Back'}
      </button>

      <div className="flex items-center gap-2 mb-3">
        <StepDot done /><StepDot active />
        <span className="text-[10px] tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)] ml-1">2 / 2</span>
      </div>

      <h1 className="text-[#F5F0E8] font-light mb-1" style={{ fontSize: 'clamp(24px,7vw,32px)', letterSpacing: '-0.03em' }}>
        {isMr ? 'तुमचा तपशील' : 'Your Details'}
      </h1>
      <p className="text-[rgba(245,240,232,0.45)] font-light mb-5" style={{ fontSize: 13 }}>
        {isMr ? 'भूमिका व स्थान निवडा' : 'Choose your role and location'}
      </p>

      {/* Role selection */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 16, height: 1, background: '#E8C84A', display: 'block' }} />
          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C84A' }}>
            {isMr ? 'मी एक आहे...' : 'I am a...'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Farmer */}
          <button
            type="button"
            onClick={() => { setIsShopkeeper(false); setErrors({}); }}
            style={{
              width: '100%', textAlign: 'left', borderRadius: 16, padding: '14px 16px',
              background: !isShopkeeper ? 'rgba(45,90,27,0.35)' : 'rgba(245,240,232,0.04)',
              border: `1.5px solid ${!isShopkeeper ? 'rgba(74,140,42,0.5)' : 'rgba(245,240,232,0.1)'}`,
              transition: 'all 0.2s',
            }}
            role="radio"
            aria-checked={!isShopkeeper}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>🌾</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#F5F0E8', margin: 0 }}>
                  {isMr ? 'शेतकरी' : 'Farmer'}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(245,240,232,0.5)', marginTop: 2, marginBottom: 0 }}>
                  {isMr ? 'शेतमाल विका आणि खरेदी करा' : 'Buy & sell farm produce directly'}
                </p>
              </div>
              {!isShopkeeper && (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, color: 'white', fontWeight: 700 }}>✓</div>
              )}
            </div>
          </button>
          {/* Shopkeeper */}
          <button
            type="button"
            onClick={() => { setIsShopkeeper(true); setErrors({}); }}
            style={{
              width: '100%', textAlign: 'left', borderRadius: 16, overflow: 'hidden',
              background: isShopkeeper
                ? 'linear-gradient(135deg, rgba(45,90,27,0.35) 0%, rgba(76,175,80,0.12) 100%)'
                : 'rgba(245,240,232,0.04)',
              border: `1.5px solid ${isShopkeeper ? 'rgba(76,175,80,0.5)' : 'rgba(245,240,232,0.1)'}`,
              padding: 0, transition: 'all 0.2s',
            }}
            role="radio"
            aria-checked={isShopkeeper}
          >
            {isShopkeeper && (
              <div style={{ height: 3, background: 'linear-gradient(90deg, #2D5A1B, #4CAF50)', width: '100%' }} />
            )}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🏪</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#F5F0E8', margin: 0 }}>
                    {isMr ? 'दुकानदार' : 'Shopkeeper (Dukandaar)'}
                  </p>
                  <p style={{ fontSize: 12, color: isShopkeeper ? 'rgba(76,175,80,0.8)' : 'rgba(245,240,232,0.5)', marginTop: 2, marginBottom: 0 }}>
                    {isMr ? 'कृषी निविष्ठा उत्पादने विका' : 'Sell agri-input products from your shop'}
                  </p>
                </div>
                {isShopkeeper && (
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, color: 'white', fontWeight: 700 }}>✓</div>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Location fields */}
      <div className="flex flex-col gap-4">
        <SearchableDropdown label={isMr ? 'राज्य' : 'State'} options={stateOpts} value={state} onChange={v => { setState(v); setDistrict(''); setTaluka(''); }} error={errors.state} required />
        {isMH ? (
          <>
            <SearchableDropdown label={isMr ? 'जिल्हा' : 'District'} options={districtOpts} value={district} onChange={v => { setDistrict(v); setTaluka(''); }} error={errors.district} required disabled={!state} />
            <SearchableDropdown label={isMr ? 'तालुका' : 'Taluka'} options={talukaOpts} value={taluka} onChange={setTaluka} error={errors.taluka} required disabled={!district} />
          </>
        ) : (
          <>
            <Field label={isMr ? 'जिल्हा' : 'District'} icon={MapPin} type="text" placeholder={isMr ? 'तुमचा जिल्हा' : 'Your district'} value={district} onChange={e => setDistrict(e.target.value)} error={errors.district} required />
            <Field label={isMr ? 'तालुका / तहसील' : 'Taluka / Tehsil'} icon={MapPin} type="text" placeholder={isMr ? 'तुमचा तालुका' : 'Your taluka'} value={taluka} onChange={e => setTaluka(e.target.value)} />
          </>
        )}
      </div>

      {/* ── Inline shop details — animated expansion ───────────────── */}
      <AnimatePresence>
        {isShopkeeper && (
          <motion.div
            key="shop-fields"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ overflow: 'hidden' }}
          >
            {/* Divider with label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(76,175,80,0.25)' }} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(76,175,80,0.7)', whiteSpace: 'nowrap' }}>
                🏪 {isMr ? 'दुकानाचे तपशील' : 'Shop Details'}
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(76,175,80,0.25)' }} />
            </div>

            <div className="flex flex-col gap-4">
              {/* Shop name */}
              <Field
                label={isMr ? 'दुकानाचे नाव' : 'Shop Name'}
                icon={User}
                type="text"
                placeholder={isMr ? 'उदा. शेतकरी कृषी केंद्र' : 'e.g. Kisan Agri Centre'}
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                error={errors.shopName}
                required
              />

              {/* License type toggle */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: '#E8C84A' }}>
                  {isMr ? 'परवाना प्रकार' : 'License Type'} <span className="text-red-400">*</span>
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['gst', 'license'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLicenseType(t)}
                      style={{
                        flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 13, fontWeight: 500,
                        background: licenseType === t ? 'rgba(45,90,27,0.45)' : 'rgba(245,240,232,0.04)',
                        border: `1.5px solid ${licenseType === t ? 'rgba(76,175,80,0.5)' : 'rgba(245,240,232,0.1)'}`,
                        color: licenseType === t ? '#F5F0E8' : 'rgba(245,240,232,0.45)',
                        transition: 'all 0.15s',
                        cursor: 'pointer',
                      }}
                    >
                      {t === 'gst' ? (isMr ? 'GST नंबर' : 'GST Number') : (isMr ? 'परवाना नंबर' : 'License No.')}
                    </button>
                  ))}
                </div>
              </div>

              {/* GST / License value */}
              <Field
                label={licenseType === 'gst' ? (isMr ? 'GST क्रमांक' : 'GST Number') : (isMr ? 'परवाना क्रमांक' : 'License Number')}
                icon={Hash}
                type="text"
                placeholder={licenseType === 'gst' ? '27XXXXX1234X1ZX' : (isMr ? 'परवाना क्रमांक' : 'License number')}
                value={licenseValue}
                onChange={e => setLicenseValue(e.target.value)}
                error={errors.license}
                required
              />

              {/* Photo upload — exterior */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: '#E8C84A' }}>
                  {isMr ? 'दुकानाचा बाहेरचा फोटो' : 'Exterior Photo'} <span className="text-red-400">*</span>
                </span>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 12, height: 52,
                  background: '#162B16', border: `1px solid ${errors.exterior ? '#EF4444' : exteriorUri ? 'rgba(76,175,80,0.4)' : 'rgba(245,240,232,0.1)'}`,
                  borderRadius: 16, padding: '0 16px', cursor: 'pointer',
                }}>
                  {exteriorUri
                    ? <img src={exteriorUri} alt="exterior" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    : <Camera size={18} style={{ color: 'rgba(245,240,232,0.3)', flexShrink: 0 }} />}
                  <span style={{ fontSize: 14, color: exteriorUri ? 'rgba(76,175,80,0.9)' : 'rgba(245,240,232,0.25)', fontWeight: 300 }}>
                    {exteriorUri ? (isMr ? 'फोटो निवडला ✓' : 'Photo selected ✓') : (isMr ? 'फोटो निवडा' : 'Choose photo')}
                  </span>
                  <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto(setExteriorUri)} />
                </label>
                {errors.exterior && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.exterior}</p>}
              </div>

              {/* Photo upload — interior */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: '#E8C84A' }}>
                  {isMr ? 'दुकानाचा आतील फोटो' : 'Interior Photo'} <span className="text-red-400">*</span>
                </span>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 12, height: 52,
                  background: '#162B16', border: `1px solid ${errors.interior ? '#EF4444' : interiorUri ? 'rgba(76,175,80,0.4)' : 'rgba(245,240,232,0.1)'}`,
                  borderRadius: 16, padding: '0 16px', cursor: 'pointer',
                }}>
                  {interiorUri
                    ? <img src={interiorUri} alt="interior" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    : <Camera size={18} style={{ color: 'rgba(245,240,232,0.3)', flexShrink: 0 }} />}
                  <span style={{ fontSize: 14, color: interiorUri ? 'rgba(76,175,80,0.9)' : 'rgba(245,240,232,0.25)', fontWeight: 300 }}>
                    {interiorUri ? (isMr ? 'फोटो निवडला ✓' : 'Photo selected ✓') : (isMr ? 'फोटो निवडा' : 'Choose photo')}
                  </span>
                  <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto(setInteriorUri)} />
                </label>
                {errors.interior && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.interior}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms */}
      <p className="text-[11px] text-[rgba(245,240,232,0.3)] mt-5 leading-relaxed text-center">
        {isMr
          ? 'नोंदणी करून तुम्ही आमच्या सेवा अटी आणि गोपनीयता धोरणास सहमत आहात'
          : 'By registering you agree to our Terms of Service and Privacy Policy'}
      </p>

      {errors._form && (
        <p className="text-[12px] text-red-400 text-center mt-3">{errors._form}</p>
      )}

      <div className="mt-4">
        <PillButton variant="light" fullWidth size="lg" disabled={loading} onClick={submit}>
          {loading
            ? <Loader size={18} className="animate-spin" />
            : (isMr ? 'नोंदणी पूर्ण करा' : 'Complete Registration')}
        </PillButton>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// OTP FLOW — Request → Verify → New Password
// ══════════════════════════════════════════════════════════════════════════════


function OtpVerify({ isMr, onBack, onSuccess, onNewUser }: {
  isMr: boolean;
  onBack: () => void;
  onSuccess: (token: string) => void;
  onNewUser: () => void;
}) {
  const [digits,    setDigits]    = useState(['','','','','','']);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const phone = auth.getPhone();

  const handleDigit = (i: number, val: string) => {
    const d = val.replace(/\D/g,'').slice(-1);
    const next = [...digits]; next[i] = d; setDigits(next);
    if (d && i < 5) refs[i + 1].current?.focus();
    if (!d && i > 0) refs[i - 1].current?.focus();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.some(d => !d)) { setError(isMr ? 'सर्व ६ अंक टाका' : 'Enter all 6 digits'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(phone, digits.join(''));
      if (res.data.isNewUser) {
        onNewUser();
      } else if (res.data.tokens) {
        auth.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
        onSuccess(res.data.tokens.accessToken);
      }
    } catch (ex) {
      setError(ex instanceof ApiError ? ex.message : (isMr ? 'OTP चुकीचा आहे' : 'Invalid OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!phone || resending) return;
    setResending(true);
    setError('');
    try {
      await authApi.sendOtp(phone);
      setDigits(['','','','','','']);
      refs[0].current?.focus();
    } catch {
      setError(isMr ? 'OTP पुन्हा पाठवता आला नाही' : 'Could not resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={submit} className="px-6 pb-10 pt-2">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 mb-5 -ml-1" style={{ color: 'rgba(245,240,232,0.5)', fontSize: 13 }}>
        <ArrowLeft size={16} /> {isMr ? 'मागे' : 'Back'}
      </button>
      <h1 className="text-[#F5F0E8] font-light mb-1" style={{ fontSize: 'clamp(24px,7vw,32px)', letterSpacing: '-0.03em' }}>
        {isMr ? 'OTP टाका' : 'Enter OTP'}
      </h1>
      <p className="text-[rgba(245,240,232,0.45)] font-light mb-8" style={{ fontSize: 13 }}>
        {isMr ? `${phone} वर OTP पाठवला` : `6-digit code sent to ${phone}`}
      </p>

      <div className="flex gap-3 justify-center mb-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) refs[i-1].current?.focus(); }}
            className="text-center text-[#F5F0E8] font-light outline-none rounded-xl transition-colors focus:border-[#2E7D32]"
            style={{ width: 46, height: 56, fontSize: 22, background: '#162B16', border: `1.5px solid ${error ? '#EF4444' : d ? '#2E7D32' : 'rgba(245,240,232,0.1)'}` }}
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>
      {error && <p className="text-center text-[11px] text-red-400 mb-4">{error}</p>}

      <button
        type="button"
        onClick={resend}
        disabled={resending}
        className="w-full text-center mt-4 mb-6 transition-opacity"
        style={{ fontSize: 12, color: '#E8C84A', opacity: resending ? 0.5 : 1 }}
      >
        {resending
          ? <Loader size={14} className="inline animate-spin mr-1" />
          : null}
        {isMr ? 'OTP पुन्हा पाठवा' : 'Resend OTP'}
      </button>

      <PillButton variant="light" fullWidth size="lg" disabled={loading}>
        {loading ? <Loader size={18} className="animate-spin" /> : (isMr ? 'सत्यापित करा' : 'Verify OTP')}
      </PillButton>
    </form>
  );
}


// ── Step dot indicator ────────────────────────────────────────────────────────

function StepDot({ active, done }: { active?: boolean; done?: boolean }) {
  return (
    <div className="w-6 h-1.5 rounded-full" style={{
      background: done ? '#2E7D32' : active ? '#E8C84A' : 'rgba(245,240,232,0.15)',
    }} />
  );
}
