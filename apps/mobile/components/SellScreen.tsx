import React, { useState } from 'react';
import { Camera, Plus, CheckCircle, ChevronLeft } from 'lucide-react';
import { Language } from '../types.ts';
import { CATEGORIES, TRANSLATIONS } from '../constants.tsx';
import PillButton from './atoms/PillButton.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';

interface SellScreenProps {
  lang: Language;
  onDone: () => void;
}

// ── Success state ─────────────────────────────────────────────────────────────
function SuccessView({ isMr }: { isMr: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-8 animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(74,140,42,0.12)', border: '1px solid rgba(74,140,42,0.25)' }}
      >
        <CheckCircle size={40} className="text-[#4A8C2A]" strokeWidth={1.5} />
      </div>
      <div className="space-y-3">
        <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
          {isMr ? 'प्रकाशित झाले!' : 'Published!'}
        </h2>
        <p className="font-light text-[rgba(245,240,232,0.45)] leading-relaxed max-w-xs" style={{ fontSize: '14px' }}>
          {isMr
            ? 'तुमचा माल आता जवळच्या खरेदीदारांना दिसेल.'
            : 'Buyers near you will now see your listing on the live market.'}
        </p>
      </div>
    </div>
  );
}

// ── Form field ─────────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  children: React.ReactNode;
}
function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)] px-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = [
  'w-full px-5 py-4 rounded-xl font-light text-[#F5F0E8] text-[15px]',
  'placeholder:text-[rgba(245,240,232,0.2)]',
  'border border-[rgba(245,240,232,0.1)] focus:border-[rgba(212,196,160,0.35)]',
  'bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)]',
  'outline-none transition-all',
].join(' ');

export default function SellScreen({ lang, onDone }: SellScreenProps) {
  const [step, setStep]           = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const isMr = lang === Language.MARATHI;
  const t    = TRANSLATIONS[isMr ? 'mr' : 'en'];

  const handlePublish = () => {
    setIsSuccess(true);
    setTimeout(onDone, 2400);
  };

  if (isSuccess) return <SuccessView isMr={isMr} />;

  return (
    <div className="px-5 pt-6 pb-32 space-y-8" style={{ background: '#0A1A0A', minHeight: '100vh' }}>

      {/* Header + stepper */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.35)] mb-1">
              {isMr ? 'नवीन लिस्टिंग' : 'New Listing'}
            </p>
            <h1 className="font-light text-[#F5F0E8]" style={{ fontSize: '26px', letterSpacing: '-0.02em' }}>
              {t.addInventory}
            </h1>
          </div>
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.45)] active:scale-90 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className="h-0.5 flex-1 rounded-full transition-all duration-500"
              style={{ background: s <= step ? '#D4C4A0' : 'rgba(245,240,232,0.1)' }}
            />
          ))}
        </div>
        <p className="text-[11px] font-light text-[rgba(245,240,232,0.3)]">
          {isMr ? `पायरी ${step} / 3` : `Step ${step} of 3`}
        </p>
      </div>

      {/* ── Step 1 — Category ──────────────────────────────────────── */}
      {step === 1 && (
        <SectionReveal className="space-y-5">
          <Field label={isMr ? 'श्रेणी निवडा' : 'Choose a Category'}>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setStep(2)}
                  className="flex flex-col items-start gap-3 p-5 rounded-2xl border border-[rgba(245,240,232,0.08)] active:border-[rgba(212,196,160,0.35)] active:bg-[rgba(212,196,160,0.05)] transition-all text-left"
                  style={{ background: '#111C11' }}
                >
                  <span className="text-3xl leading-none">{cat.icon}</span>
                  <span className="font-light text-[#F5F0E8]" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
                    {isMr ? cat.nameMr : cat.name}
                  </span>
                </button>
              ))}
            </div>
          </Field>
        </SectionReveal>
      )}

      {/* ── Step 2 — Photo + Pricing ──────────────────────────────── */}
      {step === 2 && (
        <SectionReveal className="space-y-7">

          {/* Photo upload */}
          <Field label={isMr ? 'फोटो' : 'Photos'}>
            <div className="flex gap-3">
              <button
                className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.3)] active:border-[rgba(212,196,160,0.3)] transition-all"
              >
                <Camera size={20} />
                <span className="text-[9px] font-medium tracking-[0.12em] uppercase">
                  {isMr ? 'फोटो' : 'Photo'}
                </span>
              </button>
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center border border-[rgba(245,240,232,0.06)]" style={{ background: '#111C11' }}>
                <Plus size={18} className="text-[rgba(245,240,232,0.15)]" />
              </div>
            </div>
          </Field>

          <Field label={t.variety}>
            <input type="text" placeholder="e.g. CO 86032" className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t.price}>
              <input type="number" placeholder="₹" className={inputCls} style={{ color: '#D4C4A0' }} />
            </Field>
            <Field label="Unit">
              <select
                className={inputCls + ' appearance-none cursor-pointer'}
                style={{ background: '#111C11' }}
              >
                <option value="plant">per Plant</option>
                <option value="kg">per kg</option>
                <option value="bundle">per Bundle</option>
                <option value="pack">per Pack</option>
              </select>
            </Field>
          </div>

          <PillButton variant="light" fullWidth onClick={() => setStep(3)}>
            {isMr ? 'पुढे' : 'Next Step'}
          </PillButton>
        </SectionReveal>
      )}

      {/* ── Step 3 — Trust + Publish ──────────────────────────────── */}
      {step === 3 && (
        <SectionReveal className="space-y-7">

          {/* Trust badge prompt */}
          <div
            className="p-6 rounded-2xl space-y-4"
            style={{ background: '#111C11', border: '1px solid rgba(212,196,160,0.12)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-px bg-[#D4C4A0]" />
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)]">
                {isMr ? 'विश्वास बॅज' : 'Trust Badge'}
              </p>
            </div>
            <p className="font-light text-[rgba(245,240,232,0.65)] leading-relaxed" style={{ fontSize: '14px' }}>
              {isMr
                ? 'ओळखपत्राचा फोटो अपलोड करा आणि <span>Verified Seller</span> बॅज मिळवा.'
                : 'Upload your ID photo to earn the Verified Seller badge and build buyer trust.'}
            </p>
            <PillButton variant="outline" size="sm">
              {isMr ? 'ओळखपत्र अपलोड करा' : 'Upload Identity'}
            </PillButton>
          </div>

          <Field label={isMr ? 'उपलब्ध प्रमाण' : 'Quantity Available'}>
            <input type="number" placeholder={isMr ? 'साठा...' : 'Stock count...'} className={inputCls} />
          </Field>

          <Field label={isMr ? 'वर्णन' : 'Description'}>
            <textarea
              rows={3}
              placeholder={isMr ? 'गुणवत्ता सांगा...' : 'Tell buyers about quality and source...'}
              className={inputCls + ' resize-none'}
            />
          </Field>

          <PillButton variant="light" fullWidth size="lg" onClick={handlePublish}>
            {t.publish}
          </PillButton>
        </SectionReveal>
      )}
    </div>
  );
}
