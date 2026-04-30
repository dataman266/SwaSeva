import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { ShopItem, ShopItemCategory, Language } from '../../types.ts';
import { PRICE_UNITS } from '../../constants.tsx';

interface Props {
  lang: Language;
  initial?: ShopItem;
  shopkeeperId: string;
  onSave: (item: ShopItem) => void;
  onClose: () => void;
}

const CATEGORIES: { id: ShopItemCategory; en: string; mr: string }[] = [
  { id: 'seeds',      en: 'Seeds',       mr: 'बियाणे'      },
  { id: 'fertilizer', en: 'Fertilizer',  mr: 'खत'          },
  { id: 'pesticide',  en: 'Pesticide',   mr: 'कीटकनाशक'   },
  { id: 'tools',      en: 'Tools',       mr: 'साधने'        },
  { id: 'feed',       en: 'Animal Feed', mr: 'पशुखाद्य'    },
  { id: 'other',      en: 'Other',       mr: 'इतर'          },
];

export default function AddEditItemSheet({ lang, initial, shopkeeperId, onSave, onClose }: Props) {
  const isMr = lang === 'mr';
  const isEdit = !!initial;

  const [name,          setName]          = useState(initial?.name          ?? '');
  const [nameMr,        setNameMr]        = useState(initial?.nameMr        ?? '');
  const [category,      setCategory]      = useState<ShopItemCategory>(initial?.category ?? 'seeds');
  const [price,         setPrice]         = useState(String(initial?.price  ?? ''));
  const [unit,          setUnit]          = useState(initial?.unit          ?? 'kg');
  const [stockQty,      setStockQty]      = useState(String(initial?.stockQty      ?? ''));
  const [stockThreshold,setStockThreshold]= useState(String(initial?.stockThreshold ?? '5'));
  const [description,   setDescription]   = useState(initial?.description   ?? '');
  const [descriptionMr, setDescriptionMr] = useState(initial?.descriptionMr ?? '');
  const [brand,         setBrand]         = useState(initial?.brand         ?? '');
  const [expiryDate,    setExpiryDate]    = useState(initial?.expiryDate    ?? '');
  const [imageUris,     setImageUris]     = useState<string[]>(initial?.imageUris ?? []);
  const [isActive,      setIsActive]      = useState(initial?.isActive      ?? true);
  const [errors,        setErrors]        = useState<Record<string, string>>({});

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newUris = files.slice(0, 4 - imageUris.length).map(f => URL.createObjectURL(f));
    setImageUris(prev => [...prev, ...newUris].slice(0, 4));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim())          errs.name          = isMr ? 'नाव आवश्यक आहे' : 'Required';
    if (!nameMr.trim())        errs.nameMr        = isMr ? 'मराठी नाव आवश्यक आहे' : 'Required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errs.price = isMr ? 'किंमत आवश्यक आहे' : 'Valid price required';
    if (!stockQty || isNaN(Number(stockQty)) || Number(stockQty) < 0) errs.stockQty = isMr ? 'साठा आवश्यक आहे' : 'Valid stock required';
    if (!description.trim())   errs.description   = isMr ? 'वर्णन आवश्यक आहे' : 'Required';
    if (!descriptionMr.trim()) errs.descriptionMr = isMr ? 'मराठी वर्णन आवश्यक आहे' : 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const item: ShopItem = {
      id:           initial?.id ?? `si_${Date.now()}`,
      shopkeeperId,
      name:         name.trim(),
      nameMr:       nameMr.trim(),
      category,
      price:        Number(price),
      unit,
      stockQty:     Number(stockQty),
      stockThreshold: Number(stockThreshold),
      description:  description.trim(),
      descriptionMr: descriptionMr.trim(),
      imageUris,
      brand:        brand.trim() || undefined,
      expiryDate:   expiryDate   || undefined,
      isActive,
      createdAt:    initial?.createdAt ?? new Date().toISOString(),
    };
    onSave(item);
  };

  const inputCls = "w-full bg-[rgba(245,240,232,0.06)] border border-[rgba(245,240,232,0.12)] rounded-xl px-4 py-3 text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.25)] focus:outline-none focus:border-[#E8C84A] text-[14px]";
  const labelCls = "block text-[11px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.45)] mb-1.5";

  const field = (
    label: string,
    value: string,
    setter: (v: string) => void,
    errKey: string,
    extra?: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input value={value} onChange={e => setter(e.target.value)} className={inputCls} {...extra} />
      {errors[errKey] && <p className="mt-1 text-[11px] text-red-400">{errors[errKey]}</p>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl overflow-hidden"
        style={{ background: '#111C11', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-[rgba(245,240,232,0.08)] flex items-center justify-between relative">
          <div className="w-12 h-1 rounded-full bg-[rgba(245,240,232,0.2)] absolute left-1/2 -translate-x-1/2 top-2" />
          <h3 className="text-[17px] font-semibold text-[#F5F0E8]">
            {isEdit ? (isMr ? 'आयटम संपादित करा' : 'Edit Item') : (isMr ? 'नवीन आयटम जोडा' : 'Add New Item')}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-[rgba(245,240,232,0.12)]">
            <X size={16} className="text-[rgba(245,240,232,0.6)]" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 py-5 space-y-4 pb-10">
          {field(isMr ? 'उत्पादनाचे नाव (इंग्रजी)' : 'Item Name (English)', name, setName, 'name', { placeholder: 'e.g. Hybrid Tomato Seeds' })}
          {field(isMr ? 'उत्पादनाचे नाव (मराठी)' : 'Item Name (Marathi)', nameMr, setNameMr, 'nameMr', { placeholder: 'उदा. हायब्रिड टोमॅटो बियाणे' })}

          {/* Category chips */}
          <div>
            <label className={labelCls}>{isMr ? 'श्रेणी' : 'Category'}</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${category === c.id ? 'bg-[rgba(232,200,74,0.15)] border-[rgba(232,200,74,0.4)] text-[#E8C84A]' : 'border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.45)]'}`}
                >
                  {isMr ? c.mr : c.en}
                </button>
              ))}
            </div>
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-3">
            {field(isMr ? 'किंमत (₹)' : 'Price (₹)', price, setPrice, 'price', { type: 'number', inputMode: 'decimal', placeholder: '0' })}
            <div>
              <label className={labelCls}>{isMr ? 'एकक' : 'Unit'}</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className={inputCls}
                style={{ appearance: 'none' }}
              >
                {PRICE_UNITS.map(u => (
                  <option key={u.value} value={u.value} style={{ background: '#111C11' }}>
                    {isMr ? u.labelMr : u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-3">
            {field(isMr ? 'साठा (प्रमाण)' : 'Stock Qty', stockQty, setStockQty, 'stockQty', { type: 'number', inputMode: 'numeric', placeholder: '0' })}
            {field(isMr ? 'कमी साठा सीमा' : 'Low Stock Alert', stockThreshold, setStockThreshold, 'stockThreshold', { type: 'number', inputMode: 'numeric', placeholder: '5' })}
          </div>

          {field(isMr ? 'वर्णन (इंग्रजी)' : 'Description (English)', description, setDescription, 'description', { placeholder: 'Short product description' })}
          {field(isMr ? 'वर्णन (मराठी)' : 'Description (Marathi)', descriptionMr, setDescriptionMr, 'descriptionMr', { placeholder: 'उत्पादनाचे संक्षिप्त वर्णन' })}
          {field(isMr ? 'ब्रँड (ऐच्छिक)' : 'Brand (optional)', brand, setBrand, '', { placeholder: 'e.g. Syngenta' })}
          {field(isMr ? 'कालबाह्यता तारीख (ऐच्छिक)' : 'Expiry Date (optional)', expiryDate, setExpiryDate, '', { type: 'date' })}

          {/* Photos */}
          <div>
            <label className={labelCls}>{isMr ? 'फोटो (जास्तीत जास्त 4)' : 'Photos (up to 4)'}</label>
            <div className="flex gap-2 flex-wrap">
              {imageUris.map((uri, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={uri} className="w-full h-full object-cover rounded-xl" alt="" />
                  <button
                    onClick={() => setImageUris(prev => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
                  >
                    <X size={11} className="text-white" />
                  </button>
                </div>
              ))}
              {imageUris.length < 4 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[rgba(245,240,232,0.2)] flex items-center justify-center cursor-pointer">
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={handlePhoto} />
                  <Camera size={22} className="text-[rgba(245,240,232,0.3)]" />
                </label>
              )}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2">
            <span className="text-[14px] text-[#F5F0E8]">{isMr ? 'सक्रिय लिस्टिंग' : 'Active Listing'}</span>
            <button
              onClick={() => setIsActive(v => !v)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isActive ? 'bg-[#4CAF50]' : 'bg-[rgba(245,240,232,0.15)]'}`}
              role="switch"
              aria-checked={isActive}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full h-14 rounded-2xl text-[#0A1A0A] font-bold text-[15px] active:scale-95 transition-all"
            style={{ background: '#E8C84A' }}
          >
            {isEdit ? (isMr ? 'बदल जतन करा ✓' : 'Save Changes ✓') : (isMr ? 'आयटम जोडा ✓' : 'Add Item ✓')}
          </button>
        </div>
      </div>
    </div>
  );
}
