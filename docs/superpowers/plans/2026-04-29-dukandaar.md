# Dukandaar Feature — Implementation Plan
**Date:** 2026-04-29  
**Spec:** [2026-04-29-dukandaar-design.md](../specs/2026-04-29-dukandaar-design.md)  
**Status:** Ready to execute

---

## Overview

19 tasks across 5 sprints. Each task is self-contained with a clear scope, exact file path, and TypeScript verification step. No placeholders — all decisions resolved in the spec.

---

## Sprint 1 — Role Foundation + Registration

### Task 1 — New types in `types.ts`

**File:** `apps/mobile/types.ts`

Add after the existing type definitions:

```typescript
export type UserRole = 'farmer' | 'shopkeeper';

export type ShopVerificationStatus = 'pending' | 'approved' | 'rejected';

export interface ShopProfile {
  shopName: string;
  gstOrLicense: string;
  exteriorPhotoUri: string;
  interiorPhotoUri: string;
  verificationStatus: ShopVerificationStatus;
}

export type ShopItemCategory =
  | 'seeds'
  | 'fertilizer'
  | 'pesticide'
  | 'tools'
  | 'feed'
  | 'other';

export interface ShopItem {
  id: string;
  shopkeeperId: string;
  name: string;
  nameMr: string;
  category: ShopItemCategory;
  price: number;
  unit: string;
  stockQty: number;
  stockThreshold: number;
  description: string;
  descriptionMr: string;
  imageUris: string[];
  brand?: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MappedShopProduct extends Product {
  isDukaanItem: true;
  brand?: string;
  expiryDate?: string;
}
```

Add `'DUKAAN'` to the `AppScreen` union.  
Add `userRole: UserRole` to `AppState`.

**Verify:** `cd apps/mobile && npx tsc --noEmit`

---

### Task 2 — Wire `userRole` and `'DUKAAN'` in `App.tsx`

**File:** `apps/mobile/App.tsx`

1. Import `DukaanScreen` (create stub file first — see Task 6).
2. Init `userRole` in AppState:
   ```typescript
   userRole: (localStorage.getItem('agrimart_user_role') as UserRole) ?? 'farmer',
   ```
3. Add `'DUKAAN'` to `SCREEN_ORDER` array (after `'PROFILE'`).
4. Add case in `renderScreen()`:
   ```typescript
   case 'DUKAAN':
     return <DukaanScreen lang={state.userLanguage} onBack={() => changeScreen('PROFILE')} userRole={state.userRole} />;
   ```
5. Pass `userRole` and `onDukaanMode` to `ProfileScreen`:
   ```typescript
   userRole={state.userRole}
   onDukaanMode={() => changeScreen('DUKAAN')}
   onBecomeShopkeeper={(role) => setState(s => ({ ...s, userRole: role }))}
   ```

**Verify:** `cd apps/mobile && npx tsc --noEmit`

---

### Task 3 — Mock constants for Dukaan data

**File:** `apps/mobile/constants.tsx`

Add at the bottom (before the closing export):

```typescript
export const MOCK_SHOP_PROFILES: ShopProfile[] = [
  {
    shopkeeperId: 'shop_001',
    shopName: 'Ganesh Krishi Seva Kendra',
    shopNameMr: 'गणेश कृषी सेवा केंद्र',
    location: 'Pune, Maharashtra',
    distance: '0.3 km',
    exteriorPhotoUri: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=400',
    interiorPhotoUri: '',
    verificationStatus: 'pending' as const,
    gstOrLicense: 'GSTIN27AAACG1234A1ZD',
  },
  {
    shopkeeperId: 'shop_002',
    shopName: 'Shivaji Agro Stores',
    shopNameMr: 'शिवाजी अॅग्रो स्टोर्स',
    location: 'Nashik, Maharashtra',
    distance: '1.1 km',
    exteriorPhotoUri: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400',
    interiorPhotoUri: '',
    verificationStatus: 'pending' as const,
    gstOrLicense: 'LIC-PES-MH-2023-00142',
  },
  {
    shopkeeperId: 'shop_003',
    shopName: 'Mahalaxmi Seed House',
    shopNameMr: 'महालक्ष्मी सीड हाऊस',
    location: 'Aurangabad, Maharashtra',
    distance: '2.4 km',
    exteriorPhotoUri: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
    interiorPhotoUri: '',
    verificationStatus: 'pending' as const,
    gstOrLicense: 'GSTIN27BBBCM5678B2ZE',
  },
];

export const MOCK_SHOP_ITEMS: ShopItem[] = [
  { id: 'si_001', shopkeeperId: 'shop_001', name: 'Hybrid Tomato Seeds', nameMr: 'हायब्रिड टोमॅटो बियाणे', category: 'seeds', price: 280, unit: 'packet', stockQty: 45, stockThreshold: 10, description: '50g packet, disease resistant variety', descriptionMr: '50 ग्रॅम पॅकेट, रोगप्रतिकारक जात', imageUris: ['https://images.unsplash.com/photo-1592925741908-3c60d3a4a8c3?w=400'], brand: 'Syngenta', isActive: true, createdAt: '2026-04-01T00:00:00Z' },
  { id: 'si_002', shopkeeperId: 'shop_001', name: 'NPK Fertilizer 19:19:19', nameMr: 'NPK खत 19:19:19', category: 'fertilizer', price: 1150, unit: 'bag (25kg)', stockQty: 8, stockThreshold: 5, description: 'Water soluble complex fertilizer', descriptionMr: 'पाण्यात विरघळणारे संयुक्त खत', imageUris: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'], brand: 'Iffco', expiryDate: '2027-03-31', isActive: true, createdAt: '2026-04-01T00:00:00Z' },
  { id: 'si_003', shopkeeperId: 'shop_002', name: 'Chlorpyrifos 20% EC', nameMr: 'क्लोरपायरीफॉस 20% EC', category: 'pesticide', price: 420, unit: 'litre', stockQty: 3, stockThreshold: 5, description: 'Broad spectrum insecticide', descriptionMr: 'व्यापक स्पेक्ट्रम कीटकनाशक', imageUris: ['https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400'], brand: 'Coromandel', expiryDate: '2026-12-31', isActive: true, createdAt: '2026-04-01T00:00:00Z' },
  { id: 'si_004', shopkeeperId: 'shop_002', name: 'Hand Sprayer 16L', nameMr: 'हँड स्प्रेयर 16L', category: 'tools', price: 1850, unit: 'piece', stockQty: 12, stockThreshold: 3, description: 'Knapsack pressure sprayer', descriptionMr: 'नॅपसॅक प्रेशर स्प्रेयर', imageUris: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400'], isActive: true, createdAt: '2026-04-01T00:00:00Z' },
  { id: 'si_005', shopkeeperId: 'shop_003', name: 'Cotton Seed BG-II', nameMr: 'कापूस बियाणे BG-II', category: 'seeds', price: 920, unit: 'packet (450g)', stockQty: 30, stockThreshold: 8, description: 'Bt cotton high yield variety', descriptionMr: 'बीटी कापूस उच्च उत्पादन जात', imageUris: ['https://images.unsplash.com/photo-1573848933048-bba9a57b5bca?w=400'], brand: 'Mahyco', isActive: true, createdAt: '2026-04-01T00:00:00Z' },
];
```

Also update `getTranslations()` to add new keys:
```typescript
dukaanMode: lang === 'en' ? 'Dukandaar Mode' : 'दुकानदार मोड',
becomeShopkeeper: lang === 'en' ? 'Become a Shopkeeper' : 'दुकानदार व्हा',
manageInventory: lang === 'en' ? 'Manage inventory · View dashboard' : 'इन्व्हेंटरी व्यवस्थापन · डॅशबोर्ड पहा',
nearbyDukaandaars: lang === 'en' ? 'Nearby Dukaandaars' : 'जवळचे दुकानदार',
agriInputs: lang === 'en' ? 'Agri Inputs' : 'कृषी निविष्ठा',
```

**Verify:** `cd apps/mobile && npx tsc --noEmit`

---

### Task 4 — `ShopRegistrationView` component

**File:** `apps/mobile/components/dukaan/ShopRegistrationView.tsx` *(new)*

Reusable shop proof form — used in RegisterStep3 and Profile. Props: `onSave: (profile: ShopProfile) => void`, `initial?: Partial<ShopProfile>`, `lang: Language`.

```typescript
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
    onSave({ shopName, gstOrLicense: licenseValue, exteriorPhotoUri: exteriorUri, interiorPhotoUri: interiorUri, verificationStatus: 'pending' });
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
```

**Verify:** `cd apps/mobile && npx tsc --noEmit`

---

### Task 5 — RegisterStep3 + shopkeeper toggle in AuthScreen

**File:** `apps/mobile/components/AuthScreen.tsx`

1. At module level, add: `let _shopData: Partial<ShopProfile> = {};`
2. In `RegisterStep2`, add at the bottom of the form (before submit button):
   ```tsx
   {/* Shopkeeper toggle */}
   <div className="rounded-2xl border border-[rgba(245,240,232,0.12)] p-4 flex items-center justify-between"
     style={{ background: 'rgba(45,90,27,0.1)' }}>
     <div>
       <p className="text-[14px] font-semibold text-[#F5F0E8]">{isMr ? '🏪 दुकानदार म्हणून नोंदणी करा' : '🏪 Register as Shopkeeper'}</p>
       <p className="text-[12px] text-[rgba(245,240,232,0.5)] mt-0.5">{isMr ? 'कृषी निविष्ठा उत्पादने विका' : 'Sell agri-input products from your shop'}</p>
     </div>
     <button
       onClick={() => setIsShopkeeper(v => !v)}
       className={`w-12 h-6 rounded-full transition-colors relative ${isShopkeeper ? 'bg-[#4CAF50]' : 'bg-[rgba(245,240,232,0.15)]'}`}
     >
       <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isShopkeeper ? 'translate-x-6' : 'translate-x-0.5'}`} />
     </button>
   </div>
   ```
3. Change submit button label: when `isShopkeeper`, show `isMr ? 'पुढे — दुकान तपशील →' : 'Next — Shop Details →'`, else keep existing label.
4. When `isShopkeeper` and form is valid, advance to Step 3 instead of completing.

5. Add `RegisterStep3` component inside `AuthScreen.tsx`:
   ```tsx
   function RegisterStep3({ lang, onComplete }: { lang: Language; onComplete: () => void }) {
     const isMr = lang === 'mr';
     return (
       <div className="space-y-6">
         <div className="text-center mb-2">
           <p className="text-[11px] tracking-[0.2em] uppercase text-[rgba(245,240,232,0.4)] mb-1">3 / 3</p>
           <h2 className="text-2xl font-light text-[#F5F0E8]">{isMr ? 'दुकानाचे तपशील' : 'Shop Details'}</h2>
         </div>
         <ShopRegistrationView
           lang={lang}
           initial={_shopData}
           onSave={(profile) => {
             localStorage.setItem('agrimart_user_role', 'shopkeeper');
             localStorage.setItem('agrimart_shop_profile', JSON.stringify(profile));
             onComplete();
           }}
         />
       </div>
     );
   }
   ```
6. Update step indicator in Steps 1 and 2: when `isShopkeeper`, show `1 / 3` and `2 / 3`.

**Verify:** `cd apps/mobile && npx tsc --noEmit`  
**Commit:** `feat: Sprint 1 — role types, RegisterStep3, shopkeeper toggle, mock dukaan constants`

---

## Sprint 2 — Profile + DUKAAN Screen Stub

### Task 6 — DukaanScreen stub

**File:** `apps/mobile/components/DukaanScreen.tsx` *(new)*

```typescript
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language, UserRole } from '../types.ts';
import DashboardTab from './dukaan/DashboardTab.tsx';
import InventoryTab from './dukaan/InventoryTab.tsx';
import OrdersTab from './dukaan/OrdersTab.tsx';

interface Props {
  lang: Language;
  onBack: () => void;
  userRole: UserRole;
}

type DukaanTab = 'dashboard' | 'inventory' | 'orders';

export default function DukaanScreen({ lang, onBack, userRole }: Props) {
  const [activeTab, setActiveTab] = useState<DukaanTab>('dashboard');
  const isMr = lang === 'mr';
  const tabs: { id: DukaanTab; label: string }[] = [
    { id: 'dashboard', label: isMr ? 'डॅशबोर्ड' : 'Dashboard' },
    { id: 'inventory', label: isMr ? 'इन्व्हेंटरी' : 'Inventory' },
    { id: 'orders', label: isMr ? 'ऑर्डर्स' : 'Orders' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0A1A0A' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-[rgba(245,240,232,0.08)]"
        style={{ background: 'rgba(10,26,10,0.96)', backdropFilter: 'blur(12px)' }}>
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(245,240,232,0.12)] active:scale-90 transition-all">
          <ArrowLeft size={18} className="text-[#F5F0E8]" />
        </button>
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[rgba(245,240,232,0.4)]">{isMr ? 'दुकानदार मोड' : 'Dukandaar Mode'}</p>
          <h1 className="text-[17px] font-semibold text-[#F5F0E8] leading-tight">
            {JSON.parse(localStorage.getItem('agrimart_shop_profile') ?? '{}')?.shopName ?? (isMr ? 'माझे दुकान' : 'My Shop')}
          </h1>
        </div>
        <div className="ml-auto px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em]"
          style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.25)', color: '#F5C518' }}>
          {isMr ? 'समीक्षा अंतर्गत 🕐' : 'Under Review 🕐'}
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-[72px] z-30 flex border-b border-[rgba(245,240,232,0.08)]"
        style={{ background: 'rgba(10,26,10,0.96)', backdropFilter: 'blur(12px)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3.5 text-[13px] font-semibold transition-all border-b-2 ${activeTab === tab.id ? 'text-[#E8C84A] border-[#E8C84A]' : 'text-[rgba(245,240,232,0.45)] border-transparent'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="overflow-y-auto pb-24">
        {activeTab === 'dashboard' && <DashboardTab lang={lang} onGoToInventory={() => setActiveTab('inventory')} />}
        {activeTab === 'inventory' && <InventoryTab lang={lang} />}
        {activeTab === 'orders' && <OrdersTab lang={lang} />}
      </div>
    </div>
  );
}
```

Create stub files for sub-components:

**File:** `apps/mobile/components/dukaan/DashboardTab.tsx`
```typescript
import React from 'react';
import { Language } from '../../types.ts';
export default function DashboardTab({ lang, onGoToInventory }: { lang: Language; onGoToInventory: () => void }) {
  return <div className="p-4 text-[#F5F0E8]">Dashboard — coming in Task 9</div>;
}
```

**File:** `apps/mobile/components/dukaan/InventoryTab.tsx`
```typescript
import React from 'react';
import { Language } from '../../types.ts';
export default function InventoryTab({ lang }: { lang: Language }) {
  return <div className="p-4 text-[#F5F0E8]">Inventory — coming in Task 8</div>;
}
```

**File:** `apps/mobile/components/dukaan/OrdersTab.tsx`
```typescript
import React from 'react';
import { Language } from '../../types.ts';
export default function OrdersTab({ lang }: { lang: Language }) {
  return <div className="p-4 text-[#F5F0E8]">Orders — coming in Task 10</div>;
}
```

**Verify:** `cd apps/mobile && npx tsc --noEmit`

---

### Task 7 — ProfileScreen: role cards + ShopRegistrationView + ShopStatusView

**File:** `apps/mobile/components/ProfileScreen.tsx`

1. Add props: `userRole: UserRole`, `onDukaanMode: () => void`, `onBecomeShopkeeper: (role: UserRole) => void`.
2. Add `ShopRegistrationView` import.
3. In the slide-nav `views` array, add two new views: `'shopRegister'` and `'shopStatus'`.
4. Above the existing menu list in the main profile view, insert role-conditional card:

```tsx
{/* Role card */}
{userRole === 'shopkeeper' ? (
  <button
    onClick={onDukaanMode}
    className="mx-4 mb-4 flex items-center justify-between p-4 rounded-2xl active:scale-[0.98] transition-all"
    style={{ background: 'rgba(45,90,27,0.25)', border: '1px solid rgba(74,140,42,0.3)' }}
  >
    <div>
      <p className="text-[15px] font-semibold text-[#F5F0E8]">🏪 {isMr ? 'दुकानदार मोड' : 'Dukandaar Mode'} →</p>
      <p className="text-[12px] text-[rgba(245,240,232,0.55)] mt-0.5">{isMr ? 'इन्व्हेंटरी व्यवस्थापन · डॅशबोर्ड पहा' : 'Manage inventory · View dashboard'}</p>
    </div>
    <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(76,175,80,0.15)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.3)' }}>
      {isMr ? 'सक्रिय' : 'Active'}
    </div>
  </button>
) : (
  <button
    onClick={() => setCurrentView('shopRegister')}
    className="mx-4 mb-4 flex items-center gap-3 p-4 rounded-2xl active:scale-[0.98] transition-all"
    style={{ background: 'rgba(232,200,74,0.06)', border: '1px solid rgba(232,200,74,0.2)' }}
  >
    <span className="text-2xl">🏪</span>
    <div className="text-left">
      <p className="text-[14px] font-semibold text-[#F5F0E8]">{isMr ? 'दुकानदार व्हा →' : 'Become a Shopkeeper →'}</p>
      <p className="text-[12px] text-[rgba(245,240,232,0.5)] mt-0.5">{isMr ? 'तुमच्या दुकानातून कृषी निविष्ठा उत्पादने विका' : 'List agri-input products from your shop'}</p>
    </div>
  </button>
)}
```

5. Add ShopRegister view panel (in the slide-nav AnimatePresence):
```tsx
case 'shopRegister':
  return (
    <div className="absolute inset-0 overflow-y-auto" style={{ background: '#0A1A0A' }}>
      <div className="flex items-center gap-3 p-4 border-b border-[rgba(245,240,232,0.08)]">
        <button onClick={() => setCurrentView('main')} className="w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(245,240,232,0.12)]">
          <ArrowLeft size={18} className="text-[#F5F0E8]" />
        </button>
        <h2 className="text-[17px] font-semibold text-[#F5F0E8]">{isMr ? 'दुकान नोंदणी' : 'Shop Registration'}</h2>
      </div>
      <div className="p-4">
        <ShopRegistrationView lang={lang} onSave={(profile) => {
          localStorage.setItem('agrimart_user_role', 'shopkeeper');
          localStorage.setItem('agrimart_shop_profile', JSON.stringify(profile));
          onBecomeShopkeeper('shopkeeper');
          setCurrentView('main');
        }} />
      </div>
    </div>
  );
```

**Verify:** `cd apps/mobile && npx tsc --noEmit`  
**Commit:** `feat: Sprint 2 — DukaanScreen stub + Profile role cards + ShopRegistrationView`

---

## Sprint 3 — Inventory Management

### Task 8 — `AddEditItemSheet.tsx`

**File:** `apps/mobile/components/dukaan/AddEditItemSheet.tsx` *(new)*

Full bottom-sheet form for adding/editing ShopItem. Covers all required fields: name EN/MR, category, price, unit, stockQty, stockThreshold, description EN/MR, brand (optional), expiryDate (optional), photos (up to 4), active toggle.

```typescript
import React, { useState, useRef } from 'react';
import { X, Camera, Trash2 } from 'lucide-react';
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
  { id: 'seeds', en: 'Seeds', mr: 'बियाणे' },
  { id: 'fertilizer', en: 'Fertilizer', mr: 'खत' },
  { id: 'pesticide', en: 'Pesticide', mr: 'कीटकनाशक' },
  { id: 'tools', en: 'Tools', mr: 'साधने' },
  { id: 'feed', en: 'Animal Feed', mr: 'पशुखाद्य' },
  { id: 'other', en: 'Other', mr: 'इतर' },
];

export default function AddEditItemSheet({ lang, initial, shopkeeperId, onSave, onClose }: Props) {
  const isMr = lang === 'mr';
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? '');
  const [nameMr, setNameMr] = useState(initial?.nameMr ?? '');
  const [category, setCategory] = useState<ShopItemCategory>(initial?.category ?? 'seeds');
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [unit, setUnit] = useState(initial?.unit ?? 'kg');
  const [stockQty, setStockQty] = useState(String(initial?.stockQty ?? ''));
  const [stockThreshold, setStockThreshold] = useState(String(initial?.stockThreshold ?? '5'));
  const [description, setDescription] = useState(initial?.description ?? '');
  const [descriptionMr, setDescriptionMr] = useState(initial?.descriptionMr ?? '');
  const [brand, setBrand] = useState(initial?.brand ?? '');
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate ?? '');
  const [imageUris, setImageUris] = useState<string[]>(initial?.imageUris ?? []);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newUris = files.slice(0, 4 - imageUris.length).map(f => URL.createObjectURL(f));
    setImageUris(prev => [...prev, ...newUris].slice(0, 4));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Required';
    if (!nameMr.trim()) errs.nameMr = 'Required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errs.price = 'Valid price required';
    if (!stockQty || isNaN(Number(stockQty)) || Number(stockQty) < 0) errs.stockQty = 'Valid stock required';
    if (!description.trim()) errs.description = 'Required';
    if (!descriptionMr.trim()) errs.descriptionMr = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const item: ShopItem = {
      id: initial?.id ?? `si_${Date.now()}`,
      shopkeeperId,
      name: name.trim(),
      nameMr: nameMr.trim(),
      category,
      price: Number(price),
      unit,
      stockQty: Number(stockQty),
      stockThreshold: Number(stockThreshold),
      description: description.trim(),
      descriptionMr: descriptionMr.trim(),
      imageUris,
      brand: brand.trim() || undefined,
      expiryDate: expiryDate || undefined,
      isActive,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };
    onSave(item);
  };

  const field = (label: string, value: string, setter: (v: string) => void, errKey: string, extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.45)] mb-1.5">{label}</label>
      <input
        value={value}
        onChange={e => setter(e.target.value)}
        className="w-full bg-[rgba(245,240,232,0.06)] border border-[rgba(245,240,232,0.12)] rounded-xl px-4 py-3 text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.25)] focus:outline-none focus:border-[#E8C84A] text-[14px]"
        {...extra}
      />
      {errors[errKey] && <p className="mt-1 text-[11px] text-red-400">{errors[errKey]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div
        className="rounded-t-3xl overflow-hidden"
        style={{ background: '#111C11', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div className="px-5 pt-4 pb-4 border-b border-[rgba(245,240,232,0.08)] flex items-center justify-between">
          <div className="w-12 h-1 rounded-full bg-[rgba(245,240,232,0.2)] mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
          <h3 className="text-[17px] font-semibold text-[#F5F0E8]">
            {isEdit ? (isMr ? 'आयटम संपादित करा' : 'Edit Item') : (isMr ? 'नवीन आयटम जोडा' : 'Add New Item')}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-[rgba(245,240,232,0.12)]">
            <X size={16} className="text-[rgba(245,240,232,0.6)]" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-4 pb-8">
          {field(isMr ? 'उत्पादनाचे नाव (इंग्रजी)' : 'Item Name (English)', name, setName, 'name', { placeholder: 'e.g. Hybrid Tomato Seeds' })}
          {field(isMr ? 'उत्पादनाचे नाव (मराठी)' : 'Item Name (Marathi)', nameMr, setNameMr, 'nameMr', { placeholder: 'उदा. हायब्रिड टोमॅटो बियाणे' })}

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.45)] mb-1.5">{isMr ? 'श्रेणी' : 'Category'}</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${category === c.id ? 'bg-[rgba(232,200,74,0.15)] border-[rgba(232,200,74,0.4)] text-[#E8C84A]' : 'border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.45)]'}`}>
                  {isMr ? c.mr : c.en}
                </button>
              ))}
            </div>
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-3">
            {field(isMr ? 'किंमत (₹)' : 'Price (₹)', price, setPrice, 'price', { type: 'number', inputMode: 'decimal', placeholder: '0' })}
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.45)] mb-1.5">{isMr ? 'एकक' : 'Unit'}</label>
              <select value={unit} onChange={e => setUnit(e.target.value)}
                className="w-full bg-[rgba(245,240,232,0.06)] border border-[rgba(245,240,232,0.12)] rounded-xl px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#E8C84A] text-[14px]">
                {PRICE_UNITS.map(u => <option key={u.value} value={u.value} style={{ background: '#111C11' }}>{u.label}</option>)}
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
            <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.45)] mb-2">{isMr ? 'फोटो (जास्तीत जास्त 4)' : 'Photos (up to 4)'}</label>
            <div className="flex gap-2 flex-wrap">
              {imageUris.map((uri, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={uri} className="w-full h-full object-cover rounded-xl" />
                  <button onClick={() => setImageUris(prev => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
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
            <button onClick={() => setIsActive(v => !v)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isActive ? 'bg-[#4CAF50]' : 'bg-[rgba(245,240,232,0.15)]'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <button onClick={handleSave}
            className="w-full h-14 rounded-2xl text-[#0A1A0A] font-bold text-[15px] active:scale-95 transition-all"
            style={{ background: '#E8C84A' }}>
            {isEdit ? (isMr ? 'बदल जतन करा ✓' : 'Save Changes ✓') : (isMr ? 'आयटम जोडा ✓' : 'Add Item ✓')}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 8b — `InventoryTab.tsx` (full)

**File:** `apps/mobile/components/dukaan/InventoryTab.tsx`

Replace the stub with the full implementation:

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { ShopItem, ShopItemCategory, Language } from '../../types.ts';
import { MOCK_SHOP_ITEMS } from '../../constants.tsx';
import AddEditItemSheet from './AddEditItemSheet.tsx';

const FILTER_CATS: { id: ShopItemCategory | 'all'; en: string; mr: string }[] = [
  { id: 'all', en: 'All', mr: 'सर्व' },
  { id: 'seeds', en: 'Seeds', mr: 'बियाणे' },
  { id: 'fertilizer', en: 'Fertilizer', mr: 'खत' },
  { id: 'pesticide', en: 'Pesticide', mr: 'कीटकनाशक' },
  { id: 'tools', en: 'Tools', mr: 'साधने' },
  { id: 'feed', en: 'Feed', mr: 'पशुखाद्य' },
  { id: 'other', en: 'Other', mr: 'इतर' },
];

const STORAGE_KEY = 'agrimart_shop_inventory';

function loadItems(): ShopItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : MOCK_SHOP_ITEMS;
  } catch { return MOCK_SHOP_ITEMS; }
}

function saveItems(items: ShopItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function InventoryTab({ lang }: { lang: Language }) {
  const isMr = lang === 'mr';
  const [items, setItems] = useState<ShopItem[]>(loadItems);
  const [filter, setFilter] = useState<ShopItemCategory | 'all'>('all');
  const [showSheet, setShowSheet] = useState(false);
  const [editItem, setEditItem] = useState<ShopItem | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const shopProfile = JSON.parse(localStorage.getItem('agrimart_shop_profile') ?? '{}');
  const shopkeeperId = shopProfile?.shopkeeperId ?? 'my_shop';

  const persist = (next: ShopItem[]) => { setItems(next); saveItems(next); };

  const handleSave = (item: ShopItem) => {
    const next = items.some(i => i.id === item.id)
      ? items.map(i => i.id === item.id ? item : i)
      : [...items, item];
    persist(next);
    setShowSheet(false);
    setEditItem(undefined);
  };

  const handleDelete = (id: string) => {
    persist(items.filter(i => i.id !== id));
    setDeleteId(null);
  };

  const handleToggleActive = (id: string) => {
    persist(items.map(i => i.id === id ? { ...i, isActive: !i.isActive } : i));
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <div className="p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-[rgba(245,240,232,0.5)]">{items.length} {isMr ? 'आयटम' : 'items'}</p>
        <button
          onClick={() => { setEditItem(undefined); setShowSheet(true); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-[#0A1A0A] active:scale-95 transition-all"
          style={{ background: '#4CAF50' }}
        >
          <Plus size={15} />
          {isMr ? 'आयटम जोडा' : 'Add Item'}
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {FILTER_CATS.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${filter === c.id ? 'bg-[rgba(232,200,74,0.15)] border-[rgba(232,200,74,0.4)] text-[#E8C84A]' : 'border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.45)]'}`}>
            {isMr ? c.mr : c.en}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">📦</span>
          <p className="text-[16px] font-semibold text-[rgba(245,240,232,0.6)] mb-2">{isMr ? 'अद्याप कोणतेही आयटम नाहीत' : 'No items yet'}</p>
          <p className="text-[13px] text-[rgba(245,240,232,0.35)]">{isMr ? 'आपले पहिले उत्पादन जोडा →' : 'Add your first product →'}</p>
        </div>
      )}

      {/* Item list */}
      <div className="space-y-3">
        {filtered.map(item => {
          const isLow = item.stockQty <= item.stockThreshold;
          return (
            <div key={item.id} className="rounded-2xl overflow-hidden border border-[rgba(245,240,232,0.08)]"
              style={{ background: '#162B16' }}>
              <div className="flex gap-3 p-3">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[rgba(245,240,232,0.05)]">
                  {item.imageUris[0]
                    ? <img src={item.imageUris[0]} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🌱</div>}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-semibold text-[#F5F0E8] truncate">{isMr ? item.nameMr : item.name}</p>
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-[0.08em] uppercase"
                      style={{ background: 'rgba(232,200,74,0.1)', color: '#E8C84A', border: '1px solid rgba(232,200,74,0.2)' }}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[13px] text-[rgba(245,240,232,0.6)] mt-0.5">₹{item.price} / {item.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[12px] font-semibold ${isLow ? 'text-red-400' : 'text-[rgba(245,240,232,0.45)]'}`}>
                      {isLow && '⚠ '}{isMr ? 'साठा:' : 'Stock:'} {item.stockQty}
                    </span>
                    {item.brand && <span className="text-[11px] text-[rgba(245,240,232,0.35)]">· {item.brand}</span>}
                  </div>
                </div>
              </div>
              {/* Action row */}
              <div className="flex items-center border-t border-[rgba(245,240,232,0.06)] px-3 py-2 gap-3">
                <button onClick={() => { setEditItem(item); setShowSheet(true); }}
                  className="flex items-center gap-1 text-[12px] text-[rgba(245,240,232,0.5)] active:text-[#E8C84A] transition-colors">
                  <Edit2 size={13} /> {isMr ? 'संपादित करा' : 'Edit'}
                </button>
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-[11px] text-[rgba(245,240,232,0.35)]">{isMr ? 'सक्रिय' : 'Active'}</span>
                  <button onClick={() => handleToggleActive(item.id)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${item.isActive ? 'bg-[#4CAF50]' : 'bg-[rgba(245,240,232,0.12)]'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <button onClick={() => setDeleteId(item.id)}
                  className="text-red-400/50 active:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit sheet */}
      {showSheet && (
        <AddEditItemSheet lang={lang} initial={editItem} shopkeeperId={shopkeeperId}
          onSave={handleSave} onClose={() => { setShowSheet(false); setEditItem(undefined); }} />
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-t-3xl p-6 space-y-4" style={{ background: '#111C11' }}>
            <h3 className="text-[17px] font-semibold text-[#F5F0E8] text-center">{isMr ? 'हा आयटम हटवायचा?' : 'Delete this item?'}</h3>
            <p className="text-[13px] text-[rgba(245,240,232,0.5)] text-center">{isMr ? 'ही क्रिया पूर्ववत केली जाऊ शकत नाही.' : 'This action cannot be undone.'}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 h-12 rounded-2xl border border-[rgba(245,240,232,0.2)] text-[rgba(245,240,232,0.8)] text-[14px] font-semibold">
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-[14px] font-semibold active:scale-95 transition-all">
                {isMr ? 'हटवा' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Verify:** `cd apps/mobile && npx tsc --noEmit`  
**Commit:** `feat: Sprint 3 — InventoryTab + AddEditItemSheet with full CRUD`

---

## Sprint 4 — Market Integration

### Task 9 — "Agri Inputs" chip + ProductCard dukaan variant

**File:** `apps/mobile/components/HomeScreen.tsx`

1. Add `'agri-input'` to category filter chips list.  
2. When `activeCategory === 'agri-input'`, load items from localStorage `agrimart_shop_inventory` (fallback: `MOCK_SHOP_ITEMS`) and map to `MappedShopProduct`:
```typescript
const dukaanItems: MappedShopProduct[] = shopItems
  .filter(i => i.isActive)
  .map(i => ({
    id: i.id,
    name: i.name,
    nameMr: i.nameMr,
    variety: i.brand ?? i.category,
    varietyMr: i.brand ?? i.category,
    category: 'agri-input',
    price: Number(i.price),
    unit: i.unit,
    unitMr: i.unit,
    imageUrl: i.imageUris[0] ?? 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    sellerId: i.shopkeeperId,
    description: i.description,
    isDukaanItem: true,
    brand: i.brand,
    expiryDate: i.expiryDate,
  }));
```
3. Pass `isDukaanItem` to `ProductCard` — no `mspPrice`, no `variety` shown.

**File:** `apps/mobile/components/molecules/ProductCard.tsx`

Add dukaan variant logic:

```tsx
{/* Category badge — dukaan variant */}
{(product as MappedShopProduct).isDukaanItem ? (
  <span className="inline-block text-[11px] font-semibold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border"
    style={{ background: 'rgba(45,90,27,0.85)', border: '1px solid rgba(74,140,42,0.5)', color: '#7EC95A', backdropFilter: 'blur(8px)' }}>
    🏪 Dukaan
  </span>
) : (
  /* existing category badge */
)}
```

In the info strip: when `isDukaanItem`, hide MSP badge and replace variety with brand if available:
```tsx
{!(product as MappedShopProduct).isDukaanItem && product.mspPrice !== undefined && (
  /* existing MSP badge */
)}
```

---

### Task 10 — "Nearby Dukaandaars" shelf in HomeScreen

**File:** `apps/mobile/components/HomeScreen.tsx`

Insert between the Sell CTA section and the Product Listings section:

```tsx
{/* Nearby Dukaandaars shelf */}
<div className="mb-6">
  <div className="flex items-center justify-between px-4 mb-3">
    <h2 className="text-[16px] font-semibold text-[#F5F0E8]">🏪 {isMr ? 'जवळचे दुकानदार' : 'Nearby Dukaandaars'}</h2>
    <button className="text-[12px] text-[#E8C84A] font-medium">{isMr ? 'सर्व पहा →' : 'See all →'}</button>
  </div>
  <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
    {MOCK_SHOP_PROFILES.map(shop => (
      <button
        key={shop.shopkeeperId}
        onClick={() => onSellerPress(shop.shopkeeperId)}
        className="flex-shrink-0 w-36 rounded-2xl overflow-hidden border border-[rgba(245,240,232,0.08)] active:scale-95 transition-all"
        style={{ background: '#162B16' }}
      >
        <img src={shop.exteriorPhotoUri} alt={shop.shopName} className="w-full h-24 object-cover" />
        <div className="p-2.5">
          <p className="text-[12px] font-semibold text-[#F5F0E8] leading-tight truncate">{isMr ? shop.shopNameMr : shop.shopName}</p>
          <p className="text-[10px] text-[rgba(245,240,232,0.45)] mt-0.5">📍 {shop.distance}</p>
        </div>
      </button>
    ))}
  </div>
</div>
```

---

### Task 11 — DetailsScreen dukaan adaptation

**File:** `apps/mobile/components/DetailsScreen.tsx`

At the top of the component, derive:
```typescript
const isDukaan = !!(product as MappedShopProduct).isDukaanItem;
const dukaanProduct = isDukaan ? (product as MappedShopProduct) : null;
```

Conditional renders:
- Hide harvest date, certificates, MSP badge, farmer speciality when `isDukaan`.
- Show brand line: `{dukaanProduct?.brand && <p>Brand: {dukaanProduct.brand}</p>}`
- Show expiry: `{dukaanProduct?.expiryDate && <p>Expiry: {dukaanProduct.expiryDate}</p>}`
- Replace category chip with amber "Agri Input" chip when `isDukaan`.
- Seller card: show shop name + "Verified Dukandaar" badge.

---

### Task 12 — SellerProfileScreen dukaan adaptation

**File:** `apps/mobile/components/SellerProfileScreen.tsx`

When `seller.id` starts with `'shop_'` (or derive from `MOCK_SHOP_PROFILES`):
- Show `shopProfile.shopName` in header instead of seller name.
- Replace "Premium Farmer" badge with "Dukandaar" badge.
- Product grid: filter `MOCK_SHOP_ITEMS` by `shopkeeperId`.

**Verify:** `cd apps/mobile && npx tsc --noEmit`  
**Commit:** `feat: Sprint 4 — Agri Inputs chip, Dukaandaars shelf, DetailsScreen + SellerProfile dukaan mode`

---

## Sprint 5 — Dashboard + Orders

### Task 13 — `DashboardTab.tsx` (full)

**File:** `apps/mobile/components/dukaan/DashboardTab.tsx`

```typescript
import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Language, ShopItem } from '../../types.ts';

const MOCK_REVENUE_7D = [4200, 7800, 3100, 9200, 6400, 11800, 8500];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS_MR = ['सोम', 'मंगळ', 'बुध', 'गुरू', 'शुक्र', 'शनि', 'रवि'];

const MOCK_ORDERS = [
  { id: 'ord_1', buyer: 'Farmer R.', product: 'Hybrid Tomato Seeds', amount: 560, status: 'pending', time: '2h ago' },
  { id: 'ord_2', buyer: 'Farmer M.', product: 'NPK 19:19:19', amount: 2300, status: 'dispatched', time: '5h ago' },
  { id: 'ord_3', buyer: 'Farmer S.', product: 'Hand Sprayer 16L', amount: 1850, status: 'delivered', time: '1d ago' },
  { id: 'ord_4', buyer: 'Farmer P.', product: 'Cotton Seed BG-II', amount: 920, status: 'pending', time: '1d ago' },
  { id: 'ord_5', buyer: 'Farmer K.', product: 'Chlorpyrifos EC', amount: 840, status: 'delivered', time: '2d ago' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; labelMr: string }> = {
  pending:    { bg: 'rgba(245,197,24,0.15)', color: '#F5C518', label: 'Pending', labelMr: 'प्रलंबित' },
  dispatched: { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', label: 'Dispatched', labelMr: 'पाठवले' },
  delivered:  { bg: 'rgba(74,140,42,0.15)',  color: '#4CAF50', label: 'Delivered', labelMr: 'वितरित' },
};

function loadInventory(): ShopItem[] {
  try { return JSON.parse(localStorage.getItem('agrimart_shop_inventory') ?? '[]'); } catch { return []; }
}

export default function DashboardTab({ lang, onGoToInventory }: { lang: Language; onGoToInventory: () => void }) {
  const isMr = lang === 'mr';
  const inventory = loadInventory();
  const lowStock = inventory.filter(i => i.stockQty <= i.stockThreshold);
  const maxRev = Math.max(...MOCK_REVENUE_7D);

  const statCards = [
    { label: isMr ? 'आजचे उत्पन्न' : "Today's Revenue", value: '₹8,500', sub: '+12% vs yesterday' },
    { label: isMr ? 'मासिक उत्पन्न' : 'Monthly Revenue', value: '₹1,24,000', sub: 'April 2026' },
    { label: isMr ? 'एकूण ऑर्डर्स' : 'Total Orders', value: '47', sub: 'This month' },
    { label: isMr ? 'प्रलंबित वितरण' : 'Pending Deliveries', value: '5', sub: 'Need action' },
  ];

  const topProducts = [
    { name: 'Hybrid Tomato Seeds', sold: 28, revenue: '₹7,840' },
    { name: 'NPK 19:19:19', sold: 14, revenue: '₹16,100' },
    { name: 'Hand Sprayer 16L', sold: 9, revenue: '₹16,650' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Sample data notice */}
      <div className="px-3 py-2 rounded-xl text-[11px] text-[rgba(245,240,232,0.45)] text-center"
        style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.08)' }}>
        {isMr ? '📊 नमुना डेटा — वास्तविक डेटा लवकरच येईल' : '📊 Sample data — real data coming soon'}
      </div>

      {/* Stat cards 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)' }}>
            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.4)] mb-1">{card.label}</p>
            <p className="text-[22px] font-light text-[#F5F0E8]" style={{ letterSpacing: '-0.02em' }}>{card.value}</p>
            <p className="text-[10px] text-[rgba(245,240,232,0.35)] mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* 7-day SVG bar chart */}
      <div className="rounded-2xl p-4" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)' }}>
        <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[rgba(245,240,232,0.4)] mb-4">
          {isMr ? '७ दिवसांचे उत्पन्न' : '7-Day Revenue'}
        </p>
        <svg viewBox="0 0 280 100" className="w-full" style={{ height: 100 }}>
          {MOCK_REVENUE_7D.map((rev, i) => {
            const barH = (rev / maxRev) * 80;
            const x = i * 40 + 4;
            const y = 88 - barH;
            return (
              <g key={i}>
                <rect x={x} y={y} width={28} height={barH} rx={4}
                  fill={i === 6 ? '#E8C84A' : 'rgba(74,140,42,0.6)'} />
                <text x={x + 14} y={98} textAnchor="middle" fontSize={8} fill="rgba(245,240,232,0.35)">
                  {isMr ? DAY_LABELS_MR[i] : DAY_LABELS[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Top 3 Products */}
      <div className="rounded-2xl p-4" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)' }}>
        <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[rgba(245,240,232,0.4)] mb-3">
          {isMr ? 'शीर्ष उत्पादने' : 'Top Products'}
        </p>
        <div className="space-y-3">
          {topProducts.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-[rgba(245,240,232,0.3)] w-5">{i + 1}</span>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[#F5F0E8]">{p.name}</p>
                <p className="text-[11px] text-[rgba(245,240,232,0.4)]">{p.sold} {isMr ? 'विकले' : 'sold'}</p>
              </div>
              <span className="text-[13px] font-semibold text-[#E8C84A]">{p.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: 'rgba(245,197,24,0.06)', border: '1px solid rgba(245,197,24,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-[#F5C518]" />
            <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#F5C518]">
              {isMr ? 'कमी साठा इशारा' : 'Low Stock Alert'}
            </p>
          </div>
          <div className="space-y-2 mb-3">
            {lowStock.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <p className="text-[13px] text-[#F5F0E8]">{isMr ? item.nameMr : item.name}</p>
                <span className="text-[12px] font-semibold text-red-400">{item.stockQty} {isMr ? 'शिल्लक' : 'left'}</span>
              </div>
            ))}
          </div>
          <button onClick={onGoToInventory}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-[#F5C518] border border-[rgba(245,197,24,0.3)] active:scale-95 transition-all">
            {isMr ? 'साठा पुन्हा भरा →' : 'Restock →'}
          </button>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-2xl p-4" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)' }}>
        <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[rgba(245,240,232,0.4)] mb-3">
          {isMr ? 'अलीकडील ऑर्डर्स' : 'Recent Orders'}
        </p>
        <div className="space-y-3">
          {MOCK_ORDERS.map(order => {
            const st = STATUS_STYLE[order.status];
            return (
              <div key={order.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#F5F0E8] truncate">{order.product}</p>
                  <p className="text-[11px] text-[rgba(245,240,232,0.4)]">{order.buyer} · {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-[#F5F0E8]">₹{order.amount}</p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: st.bg, color: st.color }}>
                    {isMr ? st.labelMr : st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

### Task 14 — `OrdersTab.tsx` (full)

**File:** `apps/mobile/components/dukaan/OrdersTab.tsx`

```typescript
import React, { useState } from 'react';
import { Language } from '../../types.ts';

const ORDERS = [
  { id: 'ord_1', buyer: 'Farmer Ramesh P.', buyerLocation: 'Nashik', product: 'Hybrid Tomato Seeds', qty: '2 packets', amount: 560, status: 'pending', ts: '2026-04-29 10:30' },
  { id: 'ord_2', buyer: 'Farmer Mahesh K.', buyerLocation: 'Pune', product: 'NPK 19:19:19', qty: '2 bags', amount: 2300, status: 'dispatched', ts: '2026-04-29 07:15' },
  { id: 'ord_3', buyer: 'Farmer Suresh T.', buyerLocation: 'Satara', product: 'Hand Sprayer 16L', qty: '1 piece', amount: 1850, status: 'delivered', ts: '2026-04-28 16:00' },
  { id: 'ord_4', buyer: 'Farmer Prakash N.', buyerLocation: 'Solapur', product: 'Cotton Seed BG-II', qty: '1 packet', amount: 920, status: 'pending', ts: '2026-04-28 11:20' },
  { id: 'ord_5', buyer: 'Farmer Kishor D.', buyerLocation: 'Kolhapur', product: 'Chlorpyrifos EC', qty: '2 litres', amount: 840, status: 'delivered', ts: '2026-04-27 09:45' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; labelMr: string }> = {
  pending:    { bg: 'rgba(245,197,24,0.15)', color: '#F5C518', label: 'Pending', labelMr: 'प्रलंबित' },
  dispatched: { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', label: 'Dispatched', labelMr: 'पाठवले' },
  delivered:  { bg: 'rgba(74,140,42,0.15)',  color: '#4CAF50', label: 'Delivered', labelMr: 'वितरित' },
};

export default function OrdersTab({ lang }: { lang: Language }) {
  const isMr = lang === 'mr';
  const [expanded, setExpanded] = useState<string | null>(null);

  if (ORDERS.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">📋</span>
        <p className="text-[16px] font-semibold text-[rgba(245,240,232,0.6)]">{isMr ? 'अद्याप कोणत्याही ऑर्डर नाहीत' : 'No orders yet'}</p>
        <p className="text-[13px] text-[rgba(245,240,232,0.35)] mt-1">{isMr ? 'तुमच्या ऑर्डर्स इथे दिसतील' : 'Your orders will appear here'}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {ORDERS.map(order => {
        const st = STATUS_STYLE[order.status];
        const isOpen = expanded === order.id;
        return (
          <div key={order.id} className="rounded-2xl overflow-hidden border border-[rgba(245,240,232,0.08)]"
            style={{ background: '#162B16' }}>
            <button className="w-full flex items-center gap-3 p-4 text-left active:bg-[rgba(245,240,232,0.04)] transition-colors"
              onClick={() => setExpanded(isOpen ? null : order.id)}>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#F5F0E8] truncate">{order.product}</p>
                <p className="text-[12px] text-[rgba(245,240,232,0.45)] mt-0.5">{order.buyer}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[14px] font-semibold text-[#F5F0E8]">₹{order.amount}</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ background: st.bg, color: st.color }}>
                  {isMr ? st.labelMr : st.label}
                </span>
              </div>
              <span className="text-[rgba(245,240,232,0.3)] ml-1">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 border-t border-[rgba(245,240,232,0.06)] pt-3 space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[rgba(245,240,232,0.45)]">{isMr ? 'प्रमाण' : 'Qty'}</span>
                  <span className="text-[#F5F0E8]">{order.qty}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[rgba(245,240,232,0.45)]">{isMr ? 'ठिकाण' : 'Location'}</span>
                  <span className="text-[#F5F0E8]">{order.buyerLocation}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[rgba(245,240,232,0.45)]">{isMr ? 'वेळ' : 'Time'}</span>
                  <span className="text-[#F5F0E8]">{order.ts}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**Verify:** `cd apps/mobile && npx tsc --noEmit`  
**Build:** `npm run build:mobile`  
**Commit:** `feat: Sprint 5 — DashboardTab (SVG chart + stats + low stock) + OrdersTab`

---

## Final Verification

```bash
cd apps/mobile && npx tsc --noEmit
npm run build:mobile
```

Visual check at 375px, 390px, 412px:
- [ ] Farmer path: 2-step register unchanged
- [ ] Shopkeeper path: 3-step register, shop details saved
- [ ] Profile: correct card per role
- [ ] DUKAAN screen: 3 tabs, back to Profile
- [ ] Dashboard: stat cards, SVG chart, low stock alerts
- [ ] Inventory: CRUD, filter chips, delete confirmation
- [ ] Orders: list, expand inline
- [ ] Agri Inputs chip: filters product grid
- [ ] Dukaandaars shelf: horizontal scroll, taps SellerProfile
- [ ] DetailsScreen: hides farm fields for dukaan items
- [ ] All strings in both `en` and `mr`
- [ ] Role persists after page refresh

---

## Execution Order

Tasks are sequenced to maintain a buildable state at each commit:

| Task | Sprint | Commit? |
|------|--------|---------|
| 1–3 | 1 | Yes — after Task 3 |
| 4–5 | 1 | Yes — after Task 5 |
| 6–7 | 2 | Yes — after Task 7 |
| 8–8b | 3 | Yes — after Task 8b |
| 9–12 | 4 | Yes — after Task 12 |
| 13–14 | 5 | Yes — after Task 14 + build |
