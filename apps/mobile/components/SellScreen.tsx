import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, Plus, CheckCircle, ChevronLeft, X, ShieldCheck, ImageIcon } from 'lucide-react';
import { Language } from '../types.ts';
import { CATEGORIES, TRANSLATIONS } from '../constants.tsx';
import PillButton from './atoms/PillButton.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';
import { haptic } from '../utils/haptic.ts';

const DRAFT_KEY         = 'agrimart_sell_draft';
const USER_LISTINGS_KEY = 'agrimart_user_listings';

const PRICE_UNITS = [
  { value: 'kg',      label: 'per kg',      labelMr: 'प्रति किलो'    },
  { value: 'gram',    label: 'per 100g',    labelMr: 'प्रति १०० ग्रॅम' },
  { value: 'quintal', label: 'per quintal', labelMr: 'प्रति क्विंटल'  },
  { value: 'tonne',   label: 'per tonne',   labelMr: 'प्रति टन'       },
  { value: 'dozen',   label: 'per dozen',   labelMr: 'प्रति डझन'      },
  { value: 'piece',   label: 'per piece',   labelMr: 'प्रति नग'       },
  { value: 'litre',   label: 'per litre',   labelMr: 'प्रति लिटर'     },
  { value: 'bundle',  label: 'per bundle',  labelMr: 'प्रति जुडी'     },
  { value: 'bag',     label: 'per bag',     labelMr: 'प्रति बोरे'     },
  { value: 'box',     label: 'per box',     labelMr: 'प्रति पेटी'     },
];

const QTY_UNITS = [
  { value: 'kg',      label: 'kg',      labelMr: 'किलो'    },
  { value: 'quintal', label: 'quintal', labelMr: 'क्विंटल'  },
  { value: 'tonne',   label: 'tonne',   labelMr: 'टन'       },
  { value: 'gram',    label: 'gram',    labelMr: 'ग्रॅम'     },
  { value: 'pieces',  label: 'pieces',  labelMr: 'नग'       },
  { value: 'dozen',   label: 'dozen',   labelMr: 'डझन'      },
  { value: 'litre',   label: 'litre',   labelMr: 'लिटर'     },
  { value: 'bundle',  label: 'bundle',  labelMr: 'जुडी'     },
  { value: 'bag',     label: 'bag',     labelMr: 'बोरे'     },
  { value: 'box',     label: 'box',     labelMr: 'पेटी'     },
];

interface DraftState {
  step: number;
  categoryId: string;
  variety: string;
  price: string;
  unit: string;
  qtyUnit: string;
  quantity: string;
  description: string;
}

function loadDraft(): Partial<DraftState> {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}'); } catch { return {}; }
}

interface SellScreenProps {
  lang: Language;
  onDone: () => void;
}

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

const selectCls = inputCls + ' appearance-none cursor-pointer';

export default function SellScreen({ lang, onDone }: SellScreenProps) {
  const draft = loadDraft();
  const [step, setStep]               = useState(draft.step ?? 1);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [categoryId, setCategoryId]   = useState(draft.categoryId ?? '');
  const [variety, setVariety]         = useState(draft.variety ?? '');
  const [price, setPrice]             = useState(draft.price ?? '');
  const [unit, setUnit]               = useState(draft.unit ?? 'kg');
  const [qtyUnit, setQtyUnit]         = useState(draft.qtyUnit ?? 'kg');
  const [quantity, setQuantity]       = useState(draft.quantity ?? '');
  const [description, setDescription] = useState(draft.description ?? '');
  const [photoUrl, setPhotoUrl]       = useState<string | null>(null);
  const [identityUploaded, setIdentityUploaded] = useState(false);

  const fileInputRef     = useRef<HTMLInputElement>(null);
  const identityInputRef = useRef<HTMLInputElement>(null);

  const isMr = lang === Language.MARATHI;
  const t    = TRANSLATIONS[isMr ? 'mr' : 'en'];

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, categoryId, variety, price, unit, qtyUnit, quantity, description }));
    } catch {}
  }, [step, categoryId, variety, price, unit, qtyUnit, quantity, description]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setIdentityUploaded(true);
  };

  const handlePublish = () => {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    const listingName = `${isMr ? cat?.nameMr ?? cat?.name : cat?.name ?? categoryId}${variety ? ` – ${variety}` : ''}`;
    const priceUnitLabel = PRICE_UNITS.find(u => u.value === unit)?.label ?? unit;

    const newListing = {
      id:          `ul_${Date.now()}`,
      name:        listingName,
      nameMr:      listingName,
      category:    cat?.name ?? categoryId,
      price:       Number(price) || 0,
      unit:        priceUnitLabel.replace('per ', ''),
      quantity:    Number(quantity) || 0,
      quantityUnit: qtyUnit,
      views:       0,
      inquiries:   0,
      status:      'active',
      daysLeft:    30,
      imageUrl:    photoUrl ?? 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&auto=format&fit=crop',
      description,
      descriptionMr: description,
      isUserListing: true,
    };

    try {
      const existing = JSON.parse(localStorage.getItem(USER_LISTINGS_KEY) || '[]');
      localStorage.setItem(USER_LISTINGS_KEY, JSON.stringify([newListing, ...existing]));
      localStorage.removeItem(DRAFT_KEY);
    } catch {}

    if (photoUrl) URL.revokeObjectURL(photoUrl);
    haptic.success();
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
                  onClick={() => { setCategoryId(cat.id); setStep(2); }}
                  className="flex flex-col items-start gap-3 p-5 rounded-2xl border transition-all text-left"
                  style={{
                    background: categoryId === cat.id ? 'rgba(74,140,42,0.12)' : '#111C11',
                    border: categoryId === cat.id ? '1px solid rgba(74,140,42,0.35)' : '1px solid rgba(245,240,232,0.08)',
                  }}
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

      {/* ── Step 2 — Photos/Videos + Pricing ─────────────────────── */}
      {step === 2 && (
        <SectionReveal className="space-y-7">

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

          {/* Photos / Videos upload */}
          <Field label={isMr ? 'फोटो / व्हिडिओ' : 'Photos / Videos'}>
            <div className="flex gap-3">
              {photoUrl ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={photoUrl} alt="listing" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { URL.revokeObjectURL(photoUrl); setPhotoUrl(null); }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(10,26,10,0.75)' }}
                  >
                    <X size={12} className="text-[#F5F0E8]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.3)] active:border-[rgba(212,196,160,0.3)] transition-all"
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="flex items-center gap-1">
                    <Camera size={14} />
                    <Video size={14} />
                  </div>
                  <span className="text-[9px] font-medium tracking-[0.1em] uppercase text-center leading-tight">
                    {isMr ? 'फोटो / व्हिडिओ' : 'Photo / Video'}
                  </span>
                </button>
              )}
              {/* Gallery / add more */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border border-[rgba(245,240,232,0.06)] active:border-[rgba(212,196,160,0.2)] transition-all"
                style={{ background: '#111C11', touchAction: 'manipulation' }}
              >
                <ImageIcon size={16} className="text-[rgba(245,240,232,0.2)]" />
                <span className="text-[9px] font-medium tracking-[0.1em] uppercase text-[rgba(245,240,232,0.2)]">
                  {isMr ? 'गॅलरी' : 'Gallery'}
                </span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl flex items-center justify-center border border-dashed border-[rgba(245,240,232,0.06)] active:border-[rgba(212,196,160,0.2)] transition-all"
                style={{ background: 'transparent', touchAction: 'manipulation' }}
              >
                <Plus size={18} className="text-[rgba(245,240,232,0.15)]" />
              </button>
            </div>
          </Field>

          <Field label={t.variety}>
            <input
              type="text"
              placeholder="e.g. CO 86032"
              value={variety}
              onChange={e => setVariety(e.target.value)}
              className={inputCls}
            />
          </Field>

          {/* Price + unit */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.price}>
              <input
                type="number"
                placeholder="₹"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className={inputCls}
                style={{ color: '#D4C4A0' }}
              />
            </Field>
            <Field label={isMr ? 'एकक' : 'Unit'}>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className={selectCls}
                style={{ background: '#111C11' }}
              >
                {PRICE_UNITS.map(u => (
                  <option key={u.value} value={u.value}>
                    {isMr ? u.labelMr : u.label}
                  </option>
                ))}
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

          {/* Hidden identity input */}
          <input
            ref={identityInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleIdentityChange}
          />

          {/* Trust badge */}
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
            {identityUploaded ? (
              <div className="flex items-center gap-3 py-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(74,140,42,0.15)', border: '1px solid rgba(74,140,42,0.3)' }}
                >
                  <ShieldCheck size={14} className="text-[#4A8C2A]" />
                </div>
                <div>
                  <p className="font-medium text-[#4A8C2A]" style={{ fontSize: '13px' }}>
                    {isMr ? 'ओळखपत्र अपलोड झाले' : 'Identity uploaded'}
                  </p>
                  <p className="font-light text-[rgba(245,240,232,0.35)]" style={{ fontSize: '11px' }}>
                    {isMr ? 'तुम्हाला Verified Seller बॅज मिळेल' : 'You will receive the Verified Seller badge'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="font-light text-[rgba(245,240,232,0.65)] leading-relaxed" style={{ fontSize: '14px' }}>
                  {isMr
                    ? 'ओळखपत्राचा फोटो अपलोड करा आणि Verified Seller बॅज मिळवा.'
                    : 'Upload your ID photo to earn the Verified Seller badge and build buyer trust.'}
                </p>
                <PillButton variant="outline" size="sm" onClick={() => identityInputRef.current?.click()}>
                  {isMr ? 'ओळखपत्र अपलोड करा' : 'Upload Identity'}
                </PillButton>
              </>
            )}
          </div>

          {/* Quantity + unit */}
          <Field label={isMr ? 'उपलब्ध प्रमाण' : 'Quantity Available'}>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder={isMr ? 'साठा...' : 'Stock count...'}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className={inputCls}
              />
              <select
                value={qtyUnit}
                onChange={e => setQtyUnit(e.target.value)}
                className={selectCls}
                style={{ background: '#111C11' }}
              >
                {QTY_UNITS.map(u => (
                  <option key={u.value} value={u.value}>
                    {isMr ? u.labelMr : u.label}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label={isMr ? 'वर्णन' : 'Description'}>
            <textarea
              rows={3}
              placeholder={isMr ? 'गुणवत्ता सांगा...' : 'Tell buyers about quality and source...'}
              value={description}
              onChange={e => setDescription(e.target.value)}
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
