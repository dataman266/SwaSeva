import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Video, CheckCircle, ChevronLeft, X, ShieldCheck, MapPin } from 'lucide-react';
import L from 'leaflet';
import { Language } from '../types.ts';
import { CATEGORIES, TRANSLATIONS } from '../constants.tsx';
import PillButton from './atoms/PillButton.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';
import { haptic } from '../utils/haptic.ts';

const DRAFT_KEY         = 'agrimart_sell_draft';
const USER_LISTINGS_KEY = 'agrimart_user_listings';

const PRICE_UNITS = [
  { value: 'kg',      label: 'per kg',      labelMr: 'प्रति किलो'      },
  { value: 'gram',    label: 'per 100g',    labelMr: 'प्रति १०० ग्रॅम'  },
  { value: 'quintal', label: 'per quintal', labelMr: 'प्रति क्विंटल'    },
  { value: 'tonne',   label: 'per tonne',   labelMr: 'प्रति टन'         },
  { value: 'dozen',   label: 'per dozen',   labelMr: 'प्रति डझन'        },
  { value: 'piece',   label: 'per piece',   labelMr: 'प्रति नग'         },
  { value: 'litre',   label: 'per litre',   labelMr: 'प्रति लिटर'       },
  { value: 'bundle',  label: 'per bundle',  labelMr: 'प्रति जुडी'       },
  { value: 'bag',     label: 'per bag',     labelMr: 'प्रति बोरे'       },
  { value: 'box',     label: 'per box',     labelMr: 'प्रति पेटी'       },
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
  categoryId: string;
  variety: string;
  price: string;
  unit: string;
  qtyUnit: string;
  quantity: string;
  mobileNumber: string;
  description: string;
  location: string;
}

async function processMedia(file: File): Promise<string> {
  if (file.type.startsWith('video/')) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      video.onloadeddata = () => {
        const MAX = 900;
        const w = Math.min(video.videoWidth, MAX);
        const h = Math.round(w * video.videoHeight / video.videoWidth);
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(video, 0, 0, w, h);
        URL.revokeObjectURL(video.src);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      video.onerror = () => { URL.revokeObjectURL(video.src); resolve(''); };
      video.src = URL.createObjectURL(file);
      video.currentTime = 0.1;
    });
  }
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (ev) => {
      img.onload = () => {
        const MAX = 900;
        let w = img.width;
        let h = img.height;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function loadDraft(): Partial<DraftState> {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}'); } catch { return {}; }
}

// ── Farm location marker icon ──────────────────────────────────────────────
function farmMarkerIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center">
      <div style="width:16px;height:16px;background:#2D5A1B;border:3px solid #D4C4A0;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.5)"></div>
    </div>`,
    iconSize: [36, 36], iconAnchor: [18, 18],
  });
}

// ── Farm location map modal ────────────────────────────────────────────────
function FarmLocationModal({
  onConfirm,
  onClose,
  isMr,
}: {
  onConfirm: (label: string, lat: number, lng: number) => void;
  onClose: () => void;
  isMr: boolean;
}) {
  const mapDivRef  = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<L.Map | null>(null);
  const markerRef  = useRef<L.Marker | null>(null);
  const [label, setLabel]       = useState('');
  const [lat, setLat]           = useState(19.7515);
  const [lng, setLng]           = useState(75.7139);
  const [geocoding, setGeocoding] = useState(false);

  const geocode = useCallback(async (la: number, lo: number) => {
    setGeocoding(true);
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${la}&lon=${lo}&format=json&accept-language=en`);
      const data = await res.json();
      const parts = [
        data.address?.village || data.address?.town || data.address?.city || data.address?.suburb,
        data.address?.district || data.address?.county,
        data.address?.state,
      ].filter(Boolean);
      setLabel(parts.join(', ') || `${la.toFixed(4)}, ${lo.toFixed(4)}`);
    } catch {
      setLabel(`${la.toFixed(4)}, ${lo.toFixed(4)}`);
    } finally {
      setGeocoding(false);
    }
  }, []);

  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, { zoomControl: true }).setView([19.7515, 75.7139], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([19.7515, 75.7139], { draggable: true, icon: farmMarkerIcon() }).addTo(map);

    const updatePin = (la: number, lo: number) => {
      marker.setLatLng([la, lo]);
      setLat(la); setLng(lo);
      geocode(la, lo);
    };

    marker.on('dragend', () => {
      const p = marker.getLatLng();
      setLat(p.lat); setLng(p.lng);
      geocode(p.lat, p.lng);
    });
    map.on('click', (e) => updatePin(e.latlng.lat, e.latlng.lng));

    mapRef.current = map;
    markerRef.current = marker;

    navigator.geolocation?.getCurrentPosition(
      pos => { updatePin(pos.coords.latitude, pos.coords.longitude); map.setView([pos.coords.latitude, pos.coords.longitude], 14); },
      undefined,
      { timeout: 5000 },
    );
    geocode(19.7515, 75.7139);

    return () => { map.remove(); mapRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', height: '82vh', background: '#0F1F0F', borderRadius: '20px 20px 0 0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ flexShrink: 0, padding: '14px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(245,240,232,0.08)' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#F5F0E8', letterSpacing: '-0.01em' }}>
              {isMr ? 'शेताचे ठिकाण' : 'Farm Location'}
            </p>
            <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.4)', marginTop: 1 }}>
              {isMr ? 'नकाशावर टॅप करा किंवा मार्कर ड्रॅग करा' : 'Tap on map or drag the pin'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(245,240,232,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={15} style={{ color: 'rgba(245,240,232,0.55)' }} />
          </button>
        </div>

        {/* Map */}
        <div ref={mapDivRef} style={{ flex: 1 }} />

        {/* Location label + CTA */}
        <div style={{ flexShrink: 0, padding: '12px 16px', borderTop: '1px solid rgba(245,240,232,0.08)', background: '#0F1F0F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <MapPin size={13} style={{ color: geocoding ? 'rgba(245,240,232,0.3)' : '#D4C4A0', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: geocoding ? 'rgba(245,240,232,0.35)' : '#F5F0E8', fontWeight: 300 }}>
              {geocoding ? (isMr ? 'ठिकाण शोधत आहे...' : 'Getting address…') : (label || (isMr ? 'नकाशावर टॅप करा' : 'Tap map to select'))}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{ flex: 1, height: 42, borderRadius: 12, background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.1)', color: 'rgba(245,240,232,0.65)', fontSize: '13px', cursor: 'pointer' }}
            >
              {isMr ? 'रद्द' : 'Cancel'}
            </button>
            <button
              onClick={() => label && onConfirm(label, lat, lng)}
              style={{ flex: 2, height: 42, borderRadius: 12, background: label ? '#2D5A1B' : 'rgba(45,90,27,0.35)', border: 'none', color: '#F5F0E8', fontSize: '13px', fontWeight: 500, cursor: label ? 'pointer' : 'default', opacity: geocoding ? 0.7 : 1 }}
            >
              {isMr ? 'ठीक आहे' : 'Confirm Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────────────────────
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
            : 'Your listing is now live. Redirecting to My Listings…'}
        </p>
      </div>
    </div>
  );
}

// ── Form helpers ───────────────────────────────────────────────────────────
interface FieldProps { label: string; children: React.ReactNode; }
function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-2.5">
      <label className="block text-[13px] font-semibold tracking-[0.08em] uppercase text-[rgba(245,240,232,0.75)] px-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = [
  'w-full px-5 py-[14px] rounded-xl font-light text-[#F5F0E8] text-[17px]',
  'placeholder:text-[rgba(245,240,232,0.38)]',
  'border-2 border-[rgba(245,240,232,0.28)] focus:border-[#4A8C2A]',
  'bg-[rgba(255,255,255,0.06)] focus:bg-[rgba(255,255,255,0.09)]',
  'outline-none transition-all duration-200',
  'focus:shadow-[0_0_0_3px_rgba(74,140,42,0.2)]',
].join(' ');
const selectCls = inputCls + ' appearance-none cursor-pointer';

// ── Main component ─────────────────────────────────────────────────────────
interface SellScreenProps {
  lang: Language;
  onDone: () => void;
}

export default function SellScreen({ lang, onDone }: SellScreenProps) {
  const draft = loadDraft();
  const [step, setStep]               = useState(1);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [categoryId, setCategoryId]   = useState(draft.categoryId ?? '');
  const [variety, setVariety]         = useState(draft.variety ?? '');
  const [price, setPrice]             = useState(draft.price ?? '');
  const [unit, setUnit]               = useState(draft.unit ?? 'kg');
  const [qtyUnit, setQtyUnit]         = useState(draft.qtyUnit ?? 'kg');
  const [quantity, setQuantity]       = useState(draft.quantity ?? '');
  const [mobileNumber, setMobileNumber] = useState(draft.mobileNumber ?? '');
  const [description, setDescription] = useState(draft.description ?? '');
  const [location, setLocation]       = useState(draft.location ?? '');
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [identityUploaded, setIdentityUploaded] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const fileInputRef     = useRef<HTMLInputElement>(null);
  const identityInputRef = useRef<HTMLInputElement>(null);

  const isMr = lang === Language.MARATHI;
  const t    = TRANSLATIONS[isMr ? 'mr' : 'en'];

  useEffect(() => {
    if (isSuccess) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ categoryId, variety, price, unit, qtyUnit, quantity, mobileNumber, description, location }));
    } catch {}
  }, [isSuccess, categoryId, variety, price, unit, qtyUnit, quantity, mobileNumber, description, location]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const compressed = await processMedia(file);
    if (compressed) setPhotos(prev => prev.length < 4 ? [...prev, compressed] : prev);
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { setIdentityUploaded(true); haptic.light(); }
  };

  const handlePublish = () => {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    const catLabel = isMr ? cat?.nameMr ?? cat?.name : cat?.name ?? categoryId;
    const listingName = `${catLabel}${variety ? ` – ${variety}` : ''}`;
    const priceUnitLbl = PRICE_UNITS.find(u => u.value === unit)?.label.replace('per ', '') ?? unit;
    const qtyUnitLbl   = QTY_UNITS.find(u => u.value === qtyUnit)?.label ?? qtyUnit;

    const newListing = {
      id:           `ul_${Date.now()}`,
      name:         listingName,
      nameMr:       listingName,
      category:     cat?.name ?? categoryId,
      price:        Number(price) || 0,
      unit:         priceUnitLbl,
      quantity:     Number(quantity) || 0,
      quantityUnit: qtyUnitLbl,
      views:        0,
      inquiries:    0,
      status:       'active',
      daysLeft:     30,
      // Use data URL if available (persists), fallback to generic image
      imageUrl:     photos[0] ?? 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&auto=format&fit=crop',
      photos:       photos.length > 0 ? photos : undefined,
      mobileNumber,
      description,
      descriptionMr: description,
      location:     location || (isMr ? 'महाराष्ट्र, भारत' : 'Maharashtra, India'),
      locationMr:   location || 'महाराष्ट्र, भारत',
      lat:          locationLat,
      lng:          locationLng,
      leads:        [] as { name: string; location: string; qty: number; time: string }[],
      isUserListing: true,
    };

    const saveToStorage = (listing: typeof newListing) => {
      const existing = JSON.parse(localStorage.getItem(USER_LISTINGS_KEY) || '[]');
      localStorage.setItem(USER_LISTINGS_KEY, JSON.stringify([listing, ...existing]));
    };

    try {
      saveToStorage(newListing);
    } catch {
      // Quota exceeded — retry without photos array (keep only first image URL)
      try {
        saveToStorage({ ...newListing, photos: undefined });
      } catch {
        // Still failing — strip even the data URL imageUrl, use fallback
        try {
          saveToStorage({
            ...newListing,
            photos: undefined,
            imageUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&auto=format&fit=crop',
          });
        } catch { return; }
      }
    }
    localStorage.removeItem(DRAFT_KEY);

    haptic.success();
    setIsSuccess(true);
    setTimeout(onDone, 2000);
  };

  if (isSuccess) return <SuccessView isMr={isMr} />;

  return (
    <>
    {showLocationMap && (
      <FarmLocationModal
        isMr={isMr}
        onConfirm={(lbl, la, lo) => {
          setLocation(lbl);
          setLocationLat(la);
          setLocationLng(lo);
          setShowLocationMap(false);
        }}
        onClose={() => setShowLocationMap(false)}
      />
    )}

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
              onClick={() => setStep((s: number) => s - 1)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.45)] active:scale-90 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="h-0.5 flex-1 rounded-full transition-all duration-500"
              style={{ background: s <= step ? '#D4C4A0' : 'rgba(245,240,232,0.1)' }}
            />
          ))}
        </div>
        <p className="text-[11px] font-light text-[rgba(245,240,232,0.3)]">
          {isMr ? `पायरी ${step} / 3` : `Step ${step} of 3`}
        </p>
      </div>

      {/* ── Step 1 — Category ─────────────────────────────────────────── */}
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

      {/* ── Step 2 — Photo + Pricing + Qty + Location ─────────────────── */}
      {step === 2 && (
        <SectionReveal className="space-y-7">

          {/* Hidden file inputs */}
          <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handlePhotoChange} />
          <input ref={identityInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleIdentityChange} />

          {/* Photos / Videos */}
          <Field label={isMr ? 'फोटो / व्हिडिओ' : 'Photos / Videos'}>
            <div className="flex gap-3 flex-wrap">
              {photos.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={src} alt={`photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(10,26,10,0.75)' }}
                  >
                    <X size={12} className="text-[#F5F0E8]" />
                  </button>
                </div>
              ))}
              {photos.length < 4 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.3)] active:border-[rgba(212,196,160,0.3)] transition-all"
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="flex items-center gap-1.5">
                    <Camera size={14} />
                    <Video size={14} />
                  </div>
                  <span className="text-[9px] font-medium tracking-[0.1em] uppercase text-center leading-tight">
                    {photos.length === 0
                      ? (isMr ? 'फोटो / व्हिडिओ' : 'Photo / Video')
                      : (isMr ? 'आणखी जोडा' : 'Add More')}
                  </span>
                </button>
              )}
            </div>
          </Field>

          {/* Variety */}
          <Field label={t.variety}>
            <input
              type="text"
              placeholder={isMr ? 'उदा. CO 86032' : 'e.g. CO 86032'}
              value={variety}
              onChange={e => setVariety(e.target.value)}
              className={inputCls}
            />
          </Field>

          {/* Price + Price Unit */}
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
            <Field label={isMr ? 'किंमत एकक' : 'Price Unit'}>
              <select value={unit} onChange={e => setUnit(e.target.value)} className={selectCls} style={{ background: '#111C11' }}>
                {PRICE_UNITS.map(u => (
                  <option key={u.value} value={u.value}>{isMr ? u.labelMr : u.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Quantity + Quantity Unit */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={isMr ? 'उपलब्ध साठा प्रमाण' : 'Available Stock Quantity'}>
              <input
                type="number"
                placeholder={isMr ? 'उदा. 500' : 'e.g. 500'}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label={isMr ? 'साठा एकक' : 'Stock Unit'}>
              <select value={qtyUnit} onChange={e => setQtyUnit(e.target.value)} className={selectCls} style={{ background: '#111C11' }}>
                {QTY_UNITS.map(u => (
                  <option key={u.value} value={u.value}>{isMr ? u.labelMr : u.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Product Location picker */}
          <Field label={isMr ? 'उत्पादन ठिकाण' : 'Product Location'}>
            <button
              onClick={() => setShowLocationMap(true)}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-xl border border-[rgba(245,240,232,0.1)] active:border-[rgba(212,196,160,0.35)] transition-all text-left"
              style={{ background: 'rgba(255,255,255,0.03)', touchAction: 'manipulation' }}
            >
              <MapPin size={16} className={location ? 'text-[#4A8C2A]' : 'text-[rgba(245,240,232,0.25)]'} />
              <span className={`flex-1 font-light text-[14px] ${location ? 'text-[#F5F0E8]' : 'text-[rgba(245,240,232,0.25)]'}`}>
                {location || (isMr ? 'नकाशावर टॅप करा' : 'Pick location on map')}
              </span>
              {location && (
                <button
                  onClick={e => { e.stopPropagation(); setLocation(''); setLocationLat(null); setLocationLng(null); }}
                  className="w-5 h-5 flex items-center justify-center"
                >
                  <X size={12} className="text-[rgba(245,240,232,0.35)]" />
                </button>
              )}
            </button>
          </Field>

          {/* Mobile Number */}
          <Field label={isMr ? 'मोबाईल नंबर' : 'Mobile Number'}>
            <input
              type="tel"
              placeholder={isMr ? 'उदा. 9876543210' : 'e.g. 9876543210'}
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
              className={inputCls}
            />
          </Field>

          <PillButton variant="light" fullWidth onClick={() => setStep(3)}>
            {isMr ? 'पुढे' : 'Next Step'}
          </PillButton>
        </SectionReveal>
      )}

      {/* ── Step 3 — Trust + Description + Publish ─────────────────────── */}
      {step === 3 && (
        <SectionReveal className="space-y-7">

          {/* Trust badge */}
          <div className="p-6 rounded-2xl space-y-4" style={{ background: '#111C11', border: '1px solid rgba(212,196,160,0.12)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-px bg-[#D4C4A0]" />
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)]">
                {isMr ? 'विश्वास बॅज' : 'Trust Badge'}
              </p>
            </div>
            {identityUploaded ? (
              <div className="flex items-center gap-3 py-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(74,140,42,0.15)', border: '1px solid rgba(74,140,42,0.3)' }}>
                  <ShieldCheck size={14} className="text-[#4A8C2A]" />
                </div>
                <div>
                  <p className="font-medium text-[#4A8C2A]" style={{ fontSize: '13px' }}>
                    {isMr ? 'ओळखपत्र अपलोड झाले' : 'Identity uploaded'}
                  </p>
                  <p className="font-light text-[rgba(245,240,232,0.35)]" style={{ fontSize: '11px' }}>
                    {isMr ? 'तुम्हाला Verified Seller बॅज मिळेल' : 'Verified Seller badge will be applied'}
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

          {/* Description */}
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
    </>
  );
}
