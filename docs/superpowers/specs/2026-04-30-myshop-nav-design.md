# My Shop Tab — Role-Adaptive Navigation

**Date:** 2026-04-30
**Status:** Approved
**Scope:** Navigation restructure — rename Listings tab, make it role-aware

---

## Problem

The Dukaan portal is buried 3 taps deep behind the Profile screen. A shopkeeper who opens the app to manage inventory has no direct path — they must go to Profile → "Dukandaar Mode →" button → Dukaan. This is the wrong mental model: Profile is a personal settings area, not a business dashboard.

Additionally, unregistered users have no discoverable path to become a Dukandaar from the main navigation — the registration flow is hidden inside Profile.

---

## Solution

Rename the **Listings** tab to **My Shop** and make it role-adaptive. Same tab, same position (slot 3 of 6), same bottom nav for all users. The screen it renders depends on `userRole`:

| Role | Taps "My Shop" | Sees |
|------|---------------|------|
| `shopkeeper` | → | DukaanScreen (full portal) |
| `farmer` | → | MyListingsScreen (produce listings, unchanged) |
| unregistered / new user | → | Registration gate (CTA to become Dukandaar or use Sell tab) |

Home screen remains a pure marketplace feed for everyone. No capsules, no banners, no nav restructuring.

---

## Navigation Structure

**Unchanged for all roles:**
```
Home · Sell · My Shop · Messages · Orders · Profile
```

The tab icon changes to a shop/store icon. The label changes from "Listings" to "My Shop" (translated for all 11 languages).

---

## Screen Behaviour Per Role

### Shopkeeper → DukaanScreen
- Renders the existing `DukaanScreen` component directly
- No lazy-load delay on subsequent visits (already cached after first load)
- `onBack` prop removed — "My Shop" is a root nav destination, not a pushed screen
- The "Dukandaar Mode →" button in ProfileScreen becomes redundant; replace it with a read-only status card: shop name, item count, active badge

### Farmer → MyListingsScreen
- Renders the existing `MyListingsScreen` component unchanged
- Zero behaviour change for farmers

### Unregistered User → Registration Gate
- A simple full-screen prompt (new lightweight component: `MyShopGateScreen`)
- Shows: icon, "Start Selling" heading, one-line description, primary CTA → "Register as Dukandaar" (navigates into ShopRegistrationView), secondary link → "List produce via Sell tab"
- After successful Dukandaar registration: `userRole` updates to `'shopkeeper'`, re-render of "My Shop" tab now shows DukaanScreen

---

## Files Changed

| File | Change | Estimate |
|------|--------|----------|
| `App.tsx` | `LISTINGS` case becomes a conditional render based on `userRole`: `DukaanScreen` \| `MyListingsScreen` \| `MyShopGateScreen`. Remove `onDukaanMode` prop from ProfileScreen call. | ~15 lines |
| `BottomNav.tsx` | Rename label `t.listings` → `t.myShop`, swap icon from `LayoutList` to `Store` (lucide). | ~3 lines |
| `components/ProfileScreen.tsx` | Replace "Dukandaar Mode →" button with a read-only shop status card for shopkeepers. Remove `onDukaanMode` prop from interface. | ~20 lines |
| `components/MyShopGateScreen.tsx` | New component (~60 lines). Registration CTA screen for unregistered users. Calls existing `ShopRegistrationView` flow. | ~60 lines |
| `constants.tsx` / `TRANSLATIONS` | Add `myShop` key for all 11 languages. | ~11 lines |
| `types.ts` | Remove `AppScreen` entry `'LISTINGS'` (if separate); ensure `SCREEN_ORDER` in App.tsx still maps correctly. Actually `LISTINGS` AppScreen stays — only the rendered component changes. No type change needed. | 0 lines |

**Total: ~109 lines across 5 existing files + 1 new component.**

---

## Component: MyShopGateScreen

```
props: { lang: Language, onRegistered: (role: UserRole) => void }
```

Has one piece of local state: `showRegistration: boolean` (default false).

- When `showRegistration === false`: renders the gate prompt
  - Store icon (Lucide `Store`, 48px, muted green)
  - Heading: "My Shop" (translated)
  - Subtext: "Register your agri-input shop as a Dukandaar to manage inventory and receive enquiries."
  - Primary button: "Register as Dukandaar →" → sets `showRegistration = true`
  - Secondary text: "Listing farm produce? Use the Sell tab." (non-interactive)
- When `showRegistration === true`: renders `<ShopRegistrationView>` directly (imported from `./dukaan/ShopRegistrationView`)
  - On save: writes `agrimart_user_role = 'shopkeeper'` + shop profile to localStorage, then calls `onRegistered('shopkeeper')` — App.tsx re-renders the tab as DukaanScreen

No external navigation needed. Self-contained.

---

## ProfileScreen Changes

For `userRole === 'shopkeeper'`, the current "Dukandaar Mode →" button is replaced with:

```
┌─────────────────────────────────────────────┐
│ 🏪  Ramesh Agro Inputs          [Active ●]  │
│     24 items · My Shop tab for portal       │
└─────────────────────────────────────────────┘
```

Non-interactive (no `onClick`). Guides the user to the tab. Removes `onDukaanMode` dependency from ProfileScreen entirely.

---

## Translations Required

Add `myShop` key to all 11 language entries in `TRANSLATIONS`:

| Language | Translation |
|----------|-------------|
| English | My Shop |
| Hindi | मेरी दुकान |
| Marathi | माझी दुकान |
| Bengali | আমার দোকান |
| Telugu | నా దుకాణం |
| Tamil | என் கடை |
| Gujarati | મારી દુકાન |
| Kannada | ನನ್ನ ಅಂಗಡಿ |
| Odia | ମୋ ଦୋକାନ |
| Punjabi | ਮੇਰੀ ਦੁਕਾਨ |
| Malayalam | എന്റെ കട |

---

## What Does NOT Change

- `DukaanScreen` and all its sub-components (`InventoryTab`, `AddEditItemSheet`, `OrdersTab`, `DashboardTab`) — untouched
- `MyListingsScreen` — untouched
- `ShopRegistrationView` — untouched, reused by `MyShopGateScreen`
- Bottom nav tab count (still 6)
- Home screen — no capsules, no banners added
- All farmer workflows — unaffected

---

## Edge Cases

- **Role switch during session:** `userRole` is stored in `AppState`. When `onBecomeShopkeeper` fires (after registration), React re-renders the "My Shop" tab content without a full navigation change.
- **Back navigation from DukaanScreen:** DukaanScreen currently has an `onBack` prop that navigates to `PROFILE`. Since the Profile→Dukaan path is removed entirely by this change, remove the back arrow from DukaanScreen's header unconditionally. The `onBack` prop can be dropped from `DukaanScreen`'s interface.
- **SCREEN_ORDER in App.tsx:** `LISTINGS` remains in `SCREEN_ORDER` for transition direction logic. The rendered screen changes, not the screen key.
