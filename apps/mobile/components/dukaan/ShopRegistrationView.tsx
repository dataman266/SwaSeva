import React, { useState } from 'react';
import { ShopProfile, Language } from '../../types.ts';

interface Props {
  onSave: (profile: ShopProfile) => void;
  initial?: Partial<ShopProfile>;
  lang: Language;
}

export default function ShopRegistrationView({ onSave, initial, lang }: Props) {
  const isMr = lang === 'mr';
  const [shopName, setShopName] = useState(initial?.shopName ?? '');
  const [licenseType, setLicenseType] = useState<'gst' | 'license'>('gst');
  const [licenseValue, setLicenseValue] = useState(initial?.gstOrLicense ?? '');
  const [exteriorUri, setExteriorUri] = useState(initial?.exteriorPhotoUri ?? '');
  const [interiorUri, setInteriorUri] = useState(initial?.interiorPhotoUri ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhoto = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!shopName.trim()) errs.shopName = isMr ? 'दुकानाचे नाव आवश्यक आहे' : 'Shop name is required';
    if (!licenseValue.trim()) errs.license = isMr ? 'GST किंवा परवाना क्रमांक आवश्यक आहे' : 'GST or license number is required';
    if (!exteriorUri) errs.exterior = isMr ? 'दुकानाचा बाहेरचा फोटो आवश्यक आहे' : 'Exterior photo is required';
    if (!interiorUri) errs.interior = isMr ? 'दुकानाचा आतील फोटो आवश्यक आहे' : 'Interior photo is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      shopName,
      gstOrLicense: licenseValue,
      exteriorPhotoUri: exteriorUri,
      interiorPhotoUri: interiorUri,
      verificationStatus: 'pending',
    });
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Shop Name */}
      <div>
        <label className="block text-[12px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.55)] mb-2">
          {isMr ? 'दुकानाचे नाव' : 'Shop Name'} *
        </label>
        <input
          value={shopName}
          onChange={e => setShopName(e.target.value)}
          placeholder={isMr ? 'उदा. गणेश कृषी केंद्र' : 'e.g. Ganesh Krishi Kendra'}
          className="w-full bg-[rgba(245,240,232,0.06)] border border-[rgba(245,240,232,0.12)] rounded-xl px-4 py-3.5 text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.3)] focus:outline-none focus:border-[#E8C84A] text-[15px]"
        />
        {errors.shopName && <p className="mt-1.5 text-[12px] text-red-400">{errors.shopName}</p>}
      </div>

      {/* License Type Radio */}
      <div>
        <label className="block text-[12px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.55)] mb-2">
          {isMr ? 'ओळखपत्र प्रकार' : 'Proof Type'} *
        </label>
        <div className="flex gap-3 mb-3">
          {(['gst', 'license'] as const).map(t => (
            <button
              key={t}
              onClick={() => setLicenseType(t)}
              className={`flex-1 py-2.5 rounded-xl border text-[13px] font-semibold transition-all ${licenseType === t ? 'border-[#E8C84A] bg-[rgba(232,200,74,0.1)] text-[#E8C84A]' : 'border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.5)]'}`}
            >
              {t === 'gst' ? 'GST Number' : isMr ? 'परवाना क्रमांक' : 'License No.'}
            </button>
          ))}
        </div>
        <input
          value={licenseValue}
          onChange={e => setLicenseValue(e.target.value)}
          placeholder={licenseType === 'gst' ? 'GSTIN27AAACX1234A1ZD' : isMr ? 'परवाना क्रमांक प्रविष्ट करा' : 'Enter license number'}
          className="w-full bg-[rgba(245,240,232,0.06)] border border-[rgba(245,240,232,0.12)] rounded-xl px-4 py-3.5 text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.3)] focus:outline-none focus:border-[#E8C84A] text-[15px]"
        />
        {errors.license && <p className="mt-1.5 text-[12px] text-red-400">{errors.license}</p>}
      </div>

      {/* Photo uploads */}
      {[
        { key: 'exterior', label: isMr ? 'दुकानाचा बाहेरचा फोटो' : 'Shop Exterior Photo', uri: exteriorUri, setter: setExteriorUri, error: errors.exterior },
        { key: 'interior', label: isMr ? 'दुकानाचा आतील फोटो' : 'Shop Interior Photo', uri: interiorUri, setter: setInteriorUri, error: errors.interior },
      ].map(({ key, label, uri, setter, error }) => (
        <div key={key}>
          <label className="block text-[12px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.55)] mb-2">{label} *</label>
          <label className="block w-full cursor-pointer">
            <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto(setter)} />
            {uri ? (
              <img src={uri} alt={label} className="w-full h-36 object-cover rounded-xl border border-[rgba(245,240,232,0.12)]" />
            ) : (
              <div className="w-full h-36 rounded-xl border-2 border-dashed border-[rgba(245,240,232,0.2)] flex flex-col items-center justify-center gap-2 text-[rgba(245,240,232,0.4)]">
                <span className="text-3xl">📷</span>
                <span className="text-[13px]">{isMr ? 'फोटो अपलोड करा' : 'Upload photo'}</span>
              </div>
            )}
          </label>
          {error && <p className="mt-1.5 text-[12px] text-red-400">{error}</p>}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full h-14 rounded-2xl text-[#0A1A0A] font-bold text-[15px] tracking-[0.05em] active:scale-95 transition-all mt-2"
        style={{ background: '#E8C84A' }}
      >
        {isMr ? 'दुकान नोंदवा ✓' : 'Register Shop ✓'}
      </button>
    </div>
  );
}
