import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Phone, Lock, User, Mail, MapPin, Hash, Camera, ChevronRight, ArrowLeft, Loader } from 'lucide-react';
import PillButton from './atoms/PillButton.tsx';
import SearchableDropdown, { DropdownOption } from './atoms/SearchableDropdown.tsx';
import { Language } from '../types.ts';
import {
  INDIAN_STATES, MAHARASHTRA_DISTRICTS, getTalukasByDistrict,
} from '../data/maharashtraLocations.ts';

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthView = 'login' | 'register-step1' | 'register-step2' | 'otp-phone' | 'otp-verify' | 'new-password';

interface AuthScreenProps {
  lang: Language;
  onAuthSuccess: (token: string) => void;
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

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col overflow-hidden" style={{ background: '#0A1A0A' }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img src={AUTH_BG} alt="" aria-hidden className="w-full h-full object-cover" style={{ filter: 'brightness(0.25) saturate(0.6)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A0A] via-[rgba(10,26,10,0.7)] to-transparent" />
      </div>
      {/* Brand mark */}
      <div className="relative z-10 pt-safe px-6 pt-12 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <div>
            <p className="text-[#F5F0E8] font-light" style={{ fontSize: 18, letterSpacing: '-0.02em' }}>AgriMart</p>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: '#E8C84A', opacity: 0.7 }}>थेट शेतातून / Direct from Farm</p>
          </div>
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

export default function AuthScreen({ lang, onAuthSuccess }: AuthScreenProps) {
  const [view, setView]       = useState<AuthView>('login');
  const [dir,  setDir]        = useState(1);
  const isMr = lang === Language.MARATHI;

  const go = useCallback((next: AuthView, direction = 1) => {
    setDir(direction);
    setView(next);
  }, []);

  return (
    <AuthShell>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={view} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={trs}>
          {view === 'login'        && <LoginView        isMr={isMr} onRegister={() => go('register-step1')} onForgot={() => go('otp-phone')} onSuccess={onAuthSuccess} />}
          {view === 'register-step1' && <RegisterStep1  isMr={isMr} onBack={() => go('login', -1)} onNext={() => go('register-step2')} />}
          {view === 'register-step2' && <RegisterStep2  isMr={isMr} onBack={() => go('register-step1', -1)} onSuccess={onAuthSuccess} />}
          {view === 'otp-phone'    && <OtpPhone         isMr={isMr} onBack={() => go('login', -1)} onSent={() => go('otp-verify')} />}
          {view === 'otp-verify'   && <OtpVerify        isMr={isMr} onBack={() => go('otp-phone', -1)} onVerified={() => go('new-password')} />}
          {view === 'new-password' && <NewPassword       isMr={isMr} onDone={() => go('login', -1)} />}
        </motion.div>
      </AnimatePresence>
    </AuthShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN VIEW
// ══════════════════════════════════════════════════════════════════════════════

function LoginView({ isMr, onRegister, onForgot, onSuccess }: {
  isMr: boolean; onRegister: () => void; onForgot: () => void; onSuccess: (t: string) => void;
}) {
  const [mobile,   setMobile]   = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!mobile.trim())       e.mobile   = isMr ? 'मोबाइल नंबर आवश्यक आहे' : 'Mobile number is required';
    if (mobile && !/^\d{10}$/.test(mobile.trim())) e.mobile = isMr ? 'बरोबर १० अंकी नंबर द्या' : 'Enter a valid 10-digit number';
    if (!password)            e.password = isMr ? 'पासवर्ड आवश्यक आहे'     : 'Password is required';
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // TODO: replace with real API call
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    onSuccess('mock-token-' + Date.now());
  };

  return (
    <form onSubmit={submit} className="px-6 pb-safe pb-10 pt-4">
      <h1 className="text-[#F5F0E8] font-light mb-1" style={{ fontSize: 'clamp(28px,8vw,36px)', letterSpacing: '-0.03em' }}>
        {isMr ? 'लॉग इन करा' : 'Welcome back'}
      </h1>
      <p className="text-[rgba(245,240,232,0.45)] font-light mb-8" style={{ fontSize: 13 }}>
        {isMr ? 'तुमच्या खात्यात प्रवेश करा' : 'Sign in to your AgriMart account'}
      </p>

      <div className="flex flex-col gap-4">
        <Field
          label={isMr ? 'मोबाइल नंबर' : 'Mobile Number'}
          icon={Phone}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="9876543210"
          value={mobile}
          onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
          error={errors.mobile}
          required
          autoComplete="tel"
        />
        <PasswordField
          label={isMr ? 'पासवर्ड' : 'Password'}
          icon={Lock}
          placeholder={isMr ? 'तुमचा पासवर्ड' : 'Your password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={errors.password}
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="button"
        onClick={onForgot}
        className="mt-3 text-right w-full text-[#E8C84A] hover:text-[#F5F0E8] transition-colors"
        style={{ fontSize: 12, letterSpacing: '0.04em' }}
      >
        {isMr ? 'पासवर्ड विसरलात?' : 'Forgot password?'}
      </button>

      <div className="mt-6">
        <PillButton variant="light" fullWidth size="lg" disabled={loading}>
          {loading
            ? <Loader size={18} className="animate-spin" />
            : (isMr ? 'लॉग इन' : 'Sign In')}
        </PillButton>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[rgba(245,240,232,0.08)]" />
        <span className="text-[11px] text-[rgba(245,240,232,0.3)]">{isMr ? 'किंवा' : 'or'}</span>
        <div className="flex-1 h-px bg-[rgba(245,240,232,0.08)]" />
      </div>

      <button
        type="button"
        onClick={onRegister}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border transition-colors active:bg-[rgba(245,240,232,0.05)]"
        style={{ borderColor: 'rgba(245,240,232,0.12)', color: '#F5F0E8', fontSize: 14, fontWeight: 300 }}
      >
        {isMr ? 'नवीन खाते तयार करा' : 'Create new account'}
        <ChevronRight size={16} />
      </button>
    </form>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER STEP 1 — Identity + Account credentials
// ══════════════════════════════════════════════════════════════════════════════

interface Step1Data {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  photoUri: string;
  photoFile: File | null;
}

// Shared step1 data store (simple module-level ref to pass between steps without prop drilling)
let _step1: Step1Data = { fullName:'', mobile:'', email:'', password:'', confirmPassword:'', photoUri:'', photoFile:null };

function RegisterStep1({ isMr, onBack, onNext }: { isMr: boolean; onBack: () => void; onNext: () => void }) {
  const [form,   setForm]   = useState<Step1Data>(_step1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef             = useRef<HTMLInputElement>(null);

  const set = (k: keyof Step1Data, v: string | File | null) =>
    setForm(f => ({ ...f, [k]: v }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set('photoFile', file);
    set('photoUri', URL.createObjectURL(file));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim())   e.fullName = isMr ? 'पूर्ण नाव आवश्यक आहे' : 'Full name is required';
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile)) e.mobile = isMr ? 'बरोबर १० अंकी नंबर द्या' : 'Enter valid 10-digit mobile';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = isMr ? 'बरोबर ईमेल द्या' : 'Enter a valid email address';
    if (!form.password || form.password.length < 8) e.password = isMr ? 'पासवर्ड किमान ८ अक्षरांचा असावा' : 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = isMr ? 'पासवर्ड जुळत नाही' : 'Passwords do not match';
    if (!form.photoUri) e.photo = isMr ? 'प्रोफाइल फोटो आवश्यक आहे' : 'Profile photo is required';
    return e;
  };

  const next = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    _step1 = form;
    onNext();
  };

  return (
    <div className="px-6 pb-safe pb-10 pt-2">
      {/* Back */}
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 mb-5 -ml-1" style={{ color: 'rgba(245,240,232,0.5)', fontSize: 13 }}>
        <ArrowLeft size={16} /> {isMr ? 'मागे' : 'Back'}
      </button>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-3">
        <StepDot active /><StepDot /><span className="text-[10px] tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)] ml-1">1 / 2</span>
      </div>

      <h1 className="text-[#F5F0E8] font-light mb-1" style={{ fontSize: 'clamp(24px,7vw,32px)', letterSpacing: '-0.03em' }}>
        {isMr ? 'ओळख तयार करा' : 'Create your identity'}
      </h1>
      <p className="text-[rgba(245,240,232,0.45)] font-light mb-7" style={{ fontSize: 13 }}>
        {isMr ? 'खाते माहिती आणि फोटो' : 'Account info & profile photo'}
      </p>

      {/* Profile photo */}
      <div className="flex flex-col items-center mb-7">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} aria-label="Upload profile photo" />
        <button type="button" onClick={() => fileRef.current?.click()}
          className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden transition-opacity active:opacity-70"
          style={{ background: '#162B16', border: `2px dashed ${errors.photo ? '#EF4444' : 'rgba(245,240,232,0.15)'}` }}
          aria-label={isMr ? 'प्रोफाइल फोटो अपलोड करा' : 'Upload profile photo'}
        >
          {form.photoUri
            ? <img src={form.photoUri} alt="Profile preview" className="w-full h-full object-cover" />
            : <div className="flex flex-col items-center gap-1">
                <Camera size={26} style={{ color: 'rgba(245,240,232,0.3)' }} />
                <span className="text-[9px] tracking-[0.1em] uppercase" style={{ color: 'rgba(245,240,232,0.3)' }}>
                  {isMr ? 'फोटो' : 'Photo'}
                </span>
              </div>
          }
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#2E7D32' }}>
            <Camera size={13} className="text-white" />
          </div>
        </button>
        {errors.photo && <p className="text-[11px] text-red-400 mt-2">{errors.photo}</p>}
        <p className="text-[11px] text-[rgba(245,240,232,0.3)] mt-1.5">{isMr ? 'फोटो आवश्यक *' : 'Required *'}</p>
      </div>

      <div className="flex flex-col gap-4">
        <Field label={isMr ? 'पूर्ण नाव' : 'Full Name'} icon={User} placeholder={isMr ? 'तुमचे पूर्ण नाव' : 'Your full name'} type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} error={errors.fullName} required autoComplete="name" />
        <Field label={isMr ? 'मोबाइल नंबर' : 'Mobile Number'} icon={Phone} type="tel" inputMode="numeric" maxLength={10} placeholder="9876543210" value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g,''))} error={errors.mobile} required autoComplete="tel" />
        <Field label={isMr ? 'ईमेल पत्ता' : 'Email Address'} icon={Mail} type="email" inputMode="email" placeholder="name@example.com" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} required autoComplete="email" />
        <p className="text-[10px] text-[rgba(245,240,232,0.3)] -mt-2 ml-1">
          {isMr ? '* प्रत्येक व्यवहाराची माहिती ईमेलवर पाठवली जाईल' : '* Transaction notifications will be sent to this email'}
        </p>
        <PasswordField label={isMr ? 'पासवर्ड' : 'Password'} icon={Lock} placeholder={isMr ? 'किमान ८ अक्षरे' : 'Minimum 8 characters'} value={form.password} onChange={e => set('password', e.target.value)} error={errors.password} required autoComplete="new-password" />
        <PasswordField label={isMr ? 'पासवर्ड पुष्टी' : 'Confirm Password'} icon={Lock} placeholder={isMr ? 'पुन्हा पासवर्ड टाका' : 'Re-enter password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} error={errors.confirmPassword} required autoComplete="new-password" />
      </div>

      <div className="mt-7">
        <PillButton variant="light" fullWidth size="lg" onClick={next}>
          {isMr ? 'पुढे — पत्ता' : 'Next — Address'} →
        </PillButton>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER STEP 2 — Address & Location
// ══════════════════════════════════════════════════════════════════════════════

function RegisterStep2({ isMr, onBack, onSuccess }: { isMr: boolean; onBack: () => void; onSuccess: (t: string) => void }) {
  const [address,  setAddress]  = useState('');
  const [pincode,  setPincode]  = useState('');
  const [state,    setState]    = useState('Maharashtra');
  const [district, setDistrict] = useState('');
  const [taluka,   setTaluka]   = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);

  const isMH = state === 'Maharashtra';

  const districtOpts: DropdownOption[] = isMH
    ? MAHARASHTRA_DISTRICTS.map(d => ({ value: d.id, label: isMr ? d.nameMr : d.name }))
    : [];

  const talukaOpts: DropdownOption[] = district && isMH
    ? getTalukasByDistrict(district).map(t => ({ value: t.id, label: isMr ? t.nameMr : t.name }))
    : [];

  const stateOpts: DropdownOption[] = INDIAN_STATES.map(s => ({ value: s, label: s }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!address.trim())   e.address  = isMr ? 'पत्ता आवश्यक आहे'    : 'Address is required';
    if (!pincode || !/^\d{6}$/.test(pincode)) e.pincode = isMr ? 'बरोबर ६ अंकी पिनकोड' : 'Enter valid 6-digit pincode';
    if (!state)    e.state    = isMr ? 'राज्य निवडा'          : 'State is required';
    if (!district) e.district = isMr ? 'जिल्हा निवडा'         : 'District is required';
    if (isMH && talukaOpts.length > 0 && !taluka) e.taluka = isMr ? 'तालुका निवडा' : 'Taluka is required';
    return e;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // TODO: replace with real API call using _step1 + address fields
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onSuccess('mock-token-' + Date.now());
  };

  return (
    <div className="px-6 pb-safe pb-10 pt-2">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 mb-5 -ml-1" style={{ color: 'rgba(245,240,232,0.5)', fontSize: 13 }}>
        <ArrowLeft size={16} /> {isMr ? 'मागे' : 'Back'}
      </button>

      <div className="flex items-center gap-2 mb-3">
        <StepDot done /><StepDot active /><span className="text-[10px] tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)] ml-1">2 / 2</span>
      </div>

      <h1 className="text-[#F5F0E8] font-light mb-1" style={{ fontSize: 'clamp(24px,7vw,32px)', letterSpacing: '-0.03em' }}>
        {isMr ? 'पत्ता आणि ठिकाण' : 'Address & Location'}
      </h1>
      <p className="text-[rgba(245,240,232,0.45)] font-light mb-7" style={{ fontSize: 13 }}>
        {isMr ? 'जवळचे शेतकरी आणि खरेदीदार शोधण्यासाठी' : 'So we can connect you with nearby farmers and buyers'}
      </p>

      <div className="flex flex-col gap-4">
        <Field label={isMr ? 'पूर्ण पत्ता' : 'Full Address'} icon={MapPin} type="text" placeholder={isMr ? 'घर नं., गल्ली, गाव' : 'House no., street, village'} value={address} onChange={e => setAddress(e.target.value)} error={errors.address} required autoComplete="street-address" />

        <Field label={isMr ? 'पिनकोड' : 'Pincode'} icon={Hash} type="tel" inputMode="numeric" maxLength={6} placeholder="411001" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g,''))} error={errors.pincode} required autoComplete="postal-code" />

        <SearchableDropdown
          label={isMr ? 'राज्य' : 'State'}
          options={stateOpts}
          value={state}
          onChange={v => { setState(v); setDistrict(''); setTaluka(''); }}
          error={errors.state}
          required
        />

        {isMH ? (
          <>
            <SearchableDropdown
              label={isMr ? 'जिल्हा' : 'District'}
              options={districtOpts}
              value={district}
              onChange={v => { setDistrict(v); setTaluka(''); }}
              error={errors.district}
              required
              disabled={!state}
            />
            <SearchableDropdown
              label={isMr ? 'तालुका' : 'Taluka'}
              options={talukaOpts}
              value={taluka}
              onChange={setTaluka}
              error={errors.taluka}
              required
              disabled={!district}
            />
          </>
        ) : (
          <>
            <Field label={isMr ? 'जिल्हा' : 'District'} icon={MapPin} type="text" placeholder={isMr ? 'तुमचा जिल्हा' : 'Your district'} value={district} onChange={e => setDistrict(e.target.value)} error={errors.district} required />
            <Field label={isMr ? 'तालुका / तहसील' : 'Taluka / Tehsil'} icon={MapPin} type="text" placeholder={isMr ? 'तुमचा तालुका' : 'Your taluka'} value={taluka} onChange={e => setTaluka(e.target.value)} />
          </>
        )}
      </div>

      {/* Terms */}
      <p className="text-[11px] text-[rgba(245,240,232,0.3)] mt-6 leading-relaxed text-center">
        {isMr
          ? 'नोंदणी करून तुम्ही आमच्या सेवा अटी आणि गोपनीयता धोरणास सहमत आहात'
          : 'By registering you agree to our Terms of Service and Privacy Policy'}
      </p>

      <div className="mt-5">
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

function OtpPhone({ isMr, onBack, onSent }: { isMr: boolean; onBack: () => void; onSent: () => void }) {
  const [mobile,  setMobile]  = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) { setError(isMr ? 'बरोबर १० अंकी नंबर द्या' : 'Enter a valid 10-digit mobile number'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // TODO: send OTP API
    setLoading(false);
    onSent();
  };

  return (
    <form onSubmit={submit} className="px-6 pb-10 pt-2">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 mb-5 -ml-1" style={{ color: 'rgba(245,240,232,0.5)', fontSize: 13 }}>
        <ArrowLeft size={16} /> {isMr ? 'मागे' : 'Back'}
      </button>
      <h1 className="text-[#F5F0E8] font-light mb-1" style={{ fontSize: 'clamp(24px,7vw,32px)', letterSpacing: '-0.03em' }}>
        {isMr ? 'पासवर्ड रीसेट' : 'Reset Password'}
      </h1>
      <p className="text-[rgba(245,240,232,0.45)] font-light mb-8" style={{ fontSize: 13 }}>
        {isMr ? 'नोंदणीकृत मोबाइल नंबर टाका — OTP पाठवला जाईल' : 'Enter your registered mobile — we\'ll send an OTP'}
      </p>
      <Field label={isMr ? 'मोबाइल नंबर' : 'Mobile Number'} icon={Phone} type="tel" inputMode="numeric" maxLength={10} placeholder="9876543210" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g,''))} error={error} required autoComplete="tel" />
      <div className="mt-6">
        <PillButton variant="light" fullWidth size="lg" disabled={loading}>
          {loading ? <Loader size={18} className="animate-spin" /> : (isMr ? 'OTP पाठवा' : 'Send OTP')}
        </PillButton>
      </div>
    </form>
  );
}

function OtpVerify({ isMr, onBack, onVerified }: { isMr: boolean; onBack: () => void; onVerified: () => void }) {
  const [digits,  setDigits]  = useState(['','','','','','']);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleDigit = (i: number, val: string) => {
    const d = val.replace(/\D/g,'').slice(-1);
    const next = [...digits]; next[i] = d; setDigits(next);
    if (d && i < 5) refs[i + 1].current?.focus();
    if (!d && i > 0) refs[i - 1].current?.focus();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.some(d => !d)) { setError(isMr ? 'सर्व ६ अंक टाका' : 'Enter all 6 digits'); return; }
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // TODO: verify OTP API
    setLoading(false);
    onVerified();
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
        {isMr ? 'तुमच्या मोबाइलवर आलेला ६ अंकी कोड' : '6-digit code sent to your mobile'}
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

      <button type="button" className="w-full text-center mt-4 mb-6" style={{ fontSize: 12, color: '#E8C84A' }}>
        {isMr ? 'OTP पुन्हा पाठवा' : 'Resend OTP'}
      </button>

      <PillButton variant="light" fullWidth size="lg" disabled={loading}>
        {loading ? <Loader size={18} className="animate-spin" /> : (isMr ? 'सत्यापित करा' : 'Verify OTP')}
      </PillButton>
    </form>
  );
}

function NewPassword({ isMr, onDone }: { isMr: boolean; onDone: () => void }) {
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!password || password.length < 8) errs.password = isMr ? 'किमान ८ अक्षरे' : 'Minimum 8 characters';
    if (password !== confirm) errs.confirm = isMr ? 'पासवर्ड जुळत नाही' : 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // TODO: set new password API
    setLoading(false);
    setSuccess(true);
    setTimeout(onDone, 1800);
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center px-6 py-20">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(45,90,27,0.3)', border: '1.5px solid #2E7D32' }}>
          <span style={{ fontSize: 36 }}>✓</span>
        </div>
      </motion.div>
      <p className="text-[#F5F0E8] font-light text-xl text-center">{isMr ? 'पासवर्ड बदलला!' : 'Password updated!'}</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="px-6 pb-10 pt-2">
      <h1 className="text-[#F5F0E8] font-light mb-1 mt-4" style={{ fontSize: 'clamp(24px,7vw,32px)', letterSpacing: '-0.03em' }}>
        {isMr ? 'नवीन पासवर्ड' : 'New Password'}
      </h1>
      <p className="text-[rgba(245,240,232,0.45)] font-light mb-8" style={{ fontSize: 13 }}>
        {isMr ? 'एक मजबूत पासवर्ड निवडा' : 'Choose a strong password'}
      </p>
      <div className="flex flex-col gap-4">
        <PasswordField label={isMr ? 'नवीन पासवर्ड' : 'New Password'} icon={Lock} placeholder={isMr ? 'किमान ८ अक्षरे' : 'Minimum 8 characters'} value={password} onChange={e => setPassword(e.target.value)} error={errors.password} required autoComplete="new-password" />
        <PasswordField label={isMr ? 'पासवर्ड पुष्टी' : 'Confirm Password'} icon={Lock} placeholder={isMr ? 'पुन्हा टाका' : 'Re-enter'} value={confirm} onChange={e => setConfirm(e.target.value)} error={errors.confirm} required autoComplete="new-password" />
      </div>
      <div className="mt-7">
        <PillButton variant="light" fullWidth size="lg" disabled={loading}>
          {loading ? <Loader size={18} className="animate-spin" /> : (isMr ? 'पासवर्ड सेट करा' : 'Set Password')}
        </PillButton>
      </div>
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
