# My Shop Tab — Role-Adaptive Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the Listings tab to "My Shop" and make it render DukaanScreen for shopkeepers, MyShopGateScreen (registration CTA + their listings) for farmers.

**Architecture:** Single conditional in `App.tsx` routes the LISTINGS screen key to one of two components based on `state.userRole`. A new `MyShopGateScreen` component self-contains the gate prompt, farmer's produce listings, and the embedded `ShopRegistrationView` registration flow. `DukaanScreen` loses its back-arrow (now a root tab destination). `ProfileScreen` drops the redundant "Dukandaar Mode →" button.

**Tech Stack:** React 19, TypeScript, motion/react, Lucide icons, Tailwind CDN, localStorage for role persistence.

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `apps/mobile/constants.tsx` | Modify | Add `myShop` key to all 11 language objects in `TRANSLATIONS` |
| `apps/mobile/components/BottomNav.tsx` | Modify | `t.listings` → `t.myShop`, `LayoutList` icon → `Store` |
| `apps/mobile/components/DukaanScreen.tsx` | Modify | Remove `onBack` from Props interface and delete back-arrow button JSX |
| `apps/mobile/components/MyShopGateScreen.tsx` | **Create** | Gate + embedded ShopRegistrationView for farmers |
| `apps/mobile/App.tsx` | Modify | LISTINGS case → conditional render; remove DUKAAN case; remove `onDukaanMode`; wire `onRegistered` |
| `apps/mobile/components/ProfileScreen.tsx` | Modify | Remove `onDukaanMode` prop; replace button with read-only status card |

---

## Task 1: Add `myShop` translation key to all 11 languages

**Files:**
- Modify: `apps/mobile/constants.tsx`

- [ ] **Step 1: Add `myShop` to every language block**

Open `apps/mobile/constants.tsx`. In the `TRANSLATIONS` object, each language block has keys like `home`, `sell`, `listings`, `orders`, `profile`. Add `myShop` immediately after `listings` in all 11 blocks:

```typescript
// English (around line 197)
listings: 'Listings',
myShop: 'My Shop',

// Marathi (around line 247)
listings: 'लिस्टिंग',
myShop: 'माझी दुकान',

// Hindi (around line 295)
listings: 'लिस्टिंग',
myShop: 'मेरी दुकान',

// Gujarati (around line 343)
listings: 'લિસ્ટિંગ',
myShop: 'મારી દુકાન',

// Telugu (around line 391)
listings: 'జాబితాలు',
myShop: 'నా దుకాణం',

// Punjabi (around line 439)
listings: 'ਲਿਸਟਿੰਗ',
myShop: 'ਮੇਰੀ ਦੁਕਾਨ',

// Kannada (around line 487)
listings: 'ಪಟ್ಟಿಗಳು',
myShop: 'ನನ್ನ ಅಂಗಡಿ',

// Tamil (around line 535)
listings: 'பட்டியல்கள்',
myShop: 'என் கடை',

// Bengali (around line 583)
listings: 'তালিকা',
myShop: 'আমার দোকান',

// Odia (around line 631)
listings: 'ତାଲିକା',
myShop: 'ମୋ ଦୋକାନ',

// Malayalam (around line 679)
listings: 'ലിസ്റ്റിംഗ്',
myShop: 'എന്റെ കട',
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/mobile && npx tsc --noEmit
```

Expected: no errors. (If TypeScript complains that `myShop` is not in the type, `getTranslations` returns `typeof TRANSLATIONS.en` — adding the key to `en` is sufficient for inference.)

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/constants.tsx
git commit -m "feat: add myShop translation key for all 11 languages"
```

---

## Task 2: Rename Listings tab label and icon in BottomNav

**Files:**
- Modify: `apps/mobile/components/BottomNav.tsx`

- [ ] **Step 1: Swap the import — add `Store`, remove `LayoutList`**

```typescript
// Before
import { Home, PlusSquare, ShoppingBag, User, LayoutList, MessageSquare } from 'lucide-react';

// After
import { Home, PlusSquare, ShoppingBag, User, Store, MessageSquare } from 'lucide-react';
```

- [ ] **Step 2: Update the nav item definition**

```typescript
// Before
{ id: 'LISTINGS' as AppScreen, label: t.listings,  icon: LayoutList   },

// After
{ id: 'LISTINGS' as AppScreen, label: t.myShop,    icon: Store        },
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/components/BottomNav.tsx
git commit -m "feat: rename Listings tab to My Shop with Store icon"
```

---

## Task 3: Remove back arrow from DukaanScreen

DukaanScreen is now a root tab destination — there is no screen to go back to.

**Files:**
- Modify: `apps/mobile/components/DukaanScreen.tsx`

- [ ] **Step 1: Remove `onBack` from Props and the import**

```typescript
// Before
import { ArrowLeft } from 'lucide-react';
// ...
interface Props {
  lang: Language;
  onBack: () => void;
  userRole: UserRole;
}
export default function DukaanScreen({ lang, onBack }: Props) {

// After — remove ArrowLeft import entirely, remove onBack from interface and destructure
interface Props {
  lang: Language;
  userRole: UserRole;
}
export default function DukaanScreen({ lang }: Props) {
```

- [ ] **Step 2: Delete the back-arrow button from the header JSX**

Find the header block (around line 39) and remove the `<button onClick={onBack}>` element:

```tsx
// Remove this entire button:
<button
  onClick={onBack}
  className="..."
  style={{ ... }}
>
  <ArrowLeft size={20} />
</button>
```

Leave the rest of the header (`shopName` display, tab row) intact.

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: errors on `App.tsx` because it still passes `onBack` — that gets fixed in Task 5. For now, note the errors and continue.

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/components/DukaanScreen.tsx
git commit -m "feat: remove back arrow from DukaanScreen (now a root tab)"
```

---

## Task 4: Create MyShopGateScreen

New component for farmers. Shows their existing produce listings and a "Register as Dukandaar" CTA. When they tap register, embeds `ShopRegistrationView` inline (no navigation needed).

**Files:**
- Create: `apps/mobile/components/MyShopGateScreen.tsx`

- [ ] **Step 1: Create the file**

```typescript
import React, { useState } from 'react';
import { Store } from 'lucide-react';
import { Language, UserRole } from '../types.ts';
import ShopRegistrationView from './dukaan/ShopRegistrationView.tsx';
import MyListingsScreen from './MyListingsScreen.tsx';

interface Props {
  lang: Language;
  onRegistered: (role: UserRole) => void;
  onCreateNew: () => void;
}

export default function MyShopGateScreen({ lang, onRegistered, onCreateNew }: Props) {
  const [showRegistration, setShowRegistration] = useState(false);
  const isMr = lang === 'mr';

  if (showRegistration) {
    return (
      <ShopRegistrationView
        lang={lang}
        onSave={(profile) => {
          localStorage.setItem('agrimart_user_role', 'shopkeeper');
          localStorage.setItem('agrimart_shop_profile', JSON.stringify(profile));
          onRegistered('shopkeeper');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A1A0A' }}>
      {/* Dukandaar registration CTA */}
      <div className="mx-4 mt-4 mb-2 rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'rgba(45,90,27,0.18)', border: '1px solid rgba(76,175,80,0.25)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(45,90,27,0.4)' }}>
          <Store size={20} color="#4CAF50" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#F5F0E8]">
            {isMr ? 'दुकानदार व्हा' : 'Open Your Dukaan'}
          </p>
          <p className="text-[11px] text-[rgba(245,240,232,0.45)] mt-0.5">
            {isMr
              ? 'कृषी निविष्ठा उत्पादने विका, इन्व्हेंटरी व्यवस्थापित करा'
              : 'Sell agri-input products, manage inventory'}
          </p>
        </div>
        <button
          onClick={() => setShowRegistration(true)}
          className="flex-shrink-0 px-3 py-2 rounded-full text-[12px] font-semibold active:scale-95 transition-all"
          style={{ background: '#2D5A1B', color: '#F5F0E8', touchAction: 'manipulation' }}
        >
          {isMr ? 'नोंदणी करा' : 'Register →'}
        </button>
      </div>

      {/* Farmer's produce listings below */}
      <MyListingsScreen lang={lang} onCreateNew={onCreateNew} />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: errors only on App.tsx (LISTINGS/DUKAAN cases not yet updated). No errors in `MyShopGateScreen.tsx` itself.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/MyShopGateScreen.tsx
git commit -m "feat: add MyShopGateScreen for farmer Dukandaar registration"
```

---

## Task 5: Update App.tsx routing

Wire the LISTINGS screen key to the correct component per role. Remove the now-dead DUKAAN case.

**Files:**
- Modify: `apps/mobile/App.tsx`

- [ ] **Step 1: Add MyShopGateScreen import**

```typescript
// Add alongside other screen imports (near top of file)
import MyShopGateScreen from './components/MyShopGateScreen.tsx';
```

- [ ] **Step 2: Update the LISTINGS case to be role-adaptive**

```typescript
// Before
case 'LISTINGS':  return <MyListingsScreen lang={state.userLanguage} onCreateNew={() => changeScreen('SELL')} />;

// After
case 'LISTINGS':
  if (state.userRole === 'shopkeeper') {
    return (
      <Suspense fallback={<div className="flex items-center justify-center h-screen" style={{ color: 'rgba(245,240,232,0.3)', fontSize: 13 }}>Loading…</div>}>
        <DukaanScreen lang={state.userLanguage} userRole={state.userRole} />
      </Suspense>
    );
  }
  return (
    <MyShopGateScreen
      lang={state.userLanguage}
      onCreateNew={() => changeScreen('SELL')}
      onRegistered={(role) => setState(s => ({ ...s, userRole: role }))}
    />
  );
```

- [ ] **Step 3: Remove the DUKAAN case from renderScreen()**

```typescript
// Delete this entire case:
case 'DUKAAN':    return <Suspense fallback={...}><DukaanScreen lang={state.userLanguage} onBack={() => changeScreen('PROFILE')} userRole={state.userRole} /></Suspense>;
```

- [ ] **Step 4: Remove `onDukaanMode` from the PROFILE case**

```typescript
// Before
case 'PROFILE':   return <ProfileScreen lang={state.userLanguage} userRole={state.userRole} onDukaanMode={() => changeScreen('DUKAAN')} onBecomeShopkeeper={(role) => {
  setState(s => ({ ...s, userRole: role }));
}} onSignOut={() => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  setIsAuthenticated(false);
  changeScreen('HOME');
}} onExplore={() => changeScreen('EXPLORE')} onOpenCalendar={() => changeScreen('CALENDAR')} onResetOnboarding={() => {
  setIsAuthenticated(false);
  changeScreen('ONBOARDING');
}} />;

// After — delete only the onDukaanMode line, keep everything else
case 'PROFILE':   return <ProfileScreen lang={state.userLanguage} userRole={state.userRole} onBecomeShopkeeper={(role) => {
  setState(s => ({ ...s, userRole: role }));
}} onSignOut={() => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  setIsAuthenticated(false);
  changeScreen('HOME');
}} onExplore={() => changeScreen('EXPLORE')} onOpenCalendar={() => changeScreen('CALENDAR')} onResetOnboarding={() => {
  setIsAuthenticated(false);
  changeScreen('ONBOARDING');
}} />;
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: errors about `onDukaanMode` still existing on ProfileScreen's interface — that gets removed in Task 6. Also verify no errors from DukaanScreen's missing `onBack` prop.

- [ ] **Step 6: Commit**

```bash
git add apps/mobile/App.tsx
git commit -m "feat: route My Shop tab to DukaanScreen or MyShopGateScreen by role"
```

---

## Task 6: Clean up ProfileScreen

Remove the now-unused `onDukaanMode` prop and replace the "Dukandaar Mode →" button with a non-interactive status card.

**Files:**
- Modify: `apps/mobile/components/ProfileScreen.tsx`

- [ ] **Step 1: Remove `onDukaanMode` from the interface and destructured props**

```typescript
// Before
interface ProfileScreenProps {
  lang: Language;
  userRole: UserRole;
  onDukaanMode: () => void;
  onBecomeShopkeeper: (role: UserRole) => void;
  // ...
}
export default function ProfileScreen({ lang, userRole, onDukaanMode, onBecomeShopkeeper, ... }: ProfileScreenProps) {

// After
interface ProfileScreenProps {
  lang: Language;
  userRole: UserRole;
  onBecomeShopkeeper: (role: UserRole) => void;
  // ...
}
export default function ProfileScreen({ lang, userRole, onBecomeShopkeeper, ... }: ProfileScreenProps) {
```

- [ ] **Step 2: Replace the "Dukandaar Mode →" button with a read-only status card**

Find the shopkeeper role card block (around line 950–964):

```tsx
// Before — interactive button
{userRole === 'shopkeeper' ? (
  <button
    onClick={onDukaanMode}
    className="w-full flex items-center justify-between p-4 rounded-2xl mb-4 active:scale-[0.98] transition-all"
    style={{ background: 'rgba(45,90,27,0.25)', border: '1px solid rgba(74,140,42,0.3)' }}
  >
    <div className="text-left">
      <p className="text-[15px] font-semibold text-[#F5F0E8]">🏪 {isMr ? 'दुकानदार मोड →' : 'Dukandaar Mode →'}</p>
      <p className="text-[12px] text-[rgba(245,240,232,0.55)] mt-0.5">{isMr ? 'इन्व्हेंटरी व्यवस्थापन · डॅशबोर्ड पहा' : 'Manage inventory · View dashboard'}</p>
    </div>
    <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0"
      style={{ background: 'rgba(76,175,80,0.15)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.3)' }}>
      {isMr ? 'सक्रिय' : 'Active'}
    </div>
  </button>
) : (
  // farmer "Become a Shopkeeper" button stays unchanged
  ...
)}

// After — non-interactive status card
{userRole === 'shopkeeper' ? (
  <div
    className="w-full flex items-center justify-between p-4 rounded-2xl mb-4"
    style={{ background: 'rgba(45,90,27,0.18)', border: '1px solid rgba(74,140,42,0.2)' }}
  >
    <div className="text-left">
      <p className="text-[15px] font-semibold text-[#F5F0E8]">🏪 {isMr ? 'माझी दुकान' : 'My Dukaan'}</p>
      <p className="text-[12px] text-[rgba(245,240,232,0.45)] mt-0.5">
        {isMr ? '"माझी दुकान" टॅबमधून पोर्टल उघडा' : 'Open portal from the My Shop tab'}
      </p>
    </div>
    <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0"
      style={{ background: 'rgba(76,175,80,0.12)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.25)' }}>
      ● {isMr ? 'सक्रिय' : 'Active'}
    </div>
  </div>
) : (
  // farmer "Become a Shopkeeper" button — unchanged
  ...
)}
```

- [ ] **Step 3: Verify TypeScript — full clean build**

```bash
npx tsc --noEmit
```

Expected: **zero errors**. All props are aligned across App.tsx, ProfileScreen, DukaanScreen, and MyShopGateScreen.

- [ ] **Step 4: Manual browser verification**

```bash
# From repo root
npm run dev:mobile
```

Verify the following scenarios in the browser:

1. **As farmer** (default): Tap "My Shop" tab → see registration CTA banner + listings below. Tap "Register →" → ShopRegistrationView appears inline. Complete registration → tab re-renders as DukaanScreen.
2. **As shopkeeper** (set `localStorage.setItem('agrimart_user_role', 'shopkeeper')` in console then refresh): Tap "My Shop" → DukaanScreen loads directly. No back arrow visible.
3. **Profile screen as shopkeeper**: "Dukandaar Mode →" button is gone, replaced by non-interactive "My Dukaan · Active" status card.
4. **BottomNav**: Listings tab label reads "My Shop" (or translated equivalent) with Store icon.
5. **Language switch**: Change language via header picker — "My Shop" tab label updates correctly in all tested languages.

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/components/ProfileScreen.tsx
git commit -m "feat: replace Dukandaar Mode button with status card, remove onDukaanMode prop"
```

---

## Task 7: Push to remote

- [ ] **Step 1: Final type check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Push**

```bash
git push origin main
```
