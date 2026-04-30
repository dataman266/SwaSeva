# Dukandaar (Shopkeeper) Feature — Design Spec
**Date:** 2026-04-29
**Project:** Swaseva / AgriMart Android
**Status:** Approved — ready for implementation planning

---

## 1. Overview

The Dukandaar feature adds a dedicated shopkeeper persona to the Swaseva app. Shopkeepers sell agri-input products (seeds, fertilizers, pesticides, tools, feed) from physical shops. This is distinct from farmers who list their own produce.

**What this is not:** A backend integration. The entire feature is frontend-only with localStorage persistence and mock data. Backend wiring is a future phase once the rest of the app's backend is real.

---

## 2. Decisions Made

| Question | Decision |
|---|---|
| Navigation change? | No — same 6 tabs. Shopkeeper workspace accessed from Profile screen. |
| Market tab integration? | Both a "Nearby Dukaandaars" shelf section on Home AND an "Agri Inputs" filter chip. |
| Shop proof requirements | Shop name + 2 photos (exterior + interior) + GST number OR license number (one required). |
| Backend? | Frontend-only. localStorage + mock data throughout. |
| Dashboard complexity | Rich: stat cards + 7-day SVG chart + top products + low stock alerts + recent orders feed. |
| Workspace architecture | Single `DUKAAN` AppScreen with 3 internal tabs: Dashboard, Inventory, Orders. |

---

## 3. Data Model

### New localStorage Keys

```
agrimart_user_role        → 'farmer' | 'shopkeeper'
agrimart_shop_profile     → JSON: ShopProfile
agrimart_shop_inventory   → JSON: ShopItem[]
```

### New Types (types.ts)

```typescript
export type UserRole = 'farmer' | 'shopkeeper';

export type ShopVerificationStatus = 'pending' | 'approved' | 'rejected';

export interface ShopProfile {
  shopName: string;
  gstOrLicense: string;        // GST number OR shop/pesticide license number
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
  stockThreshold: number;      // low-stock alert when stockQty <= this
  description: string;
  descriptionMr: string;
  imageUris: string[];         // up to 4 photos
  brand?: string;
  expiryDate?: string;         // ISO date string, relevant for pesticides/fertilizers
  isActive: boolean;
  createdAt: string;           // ISO date string
}
```

### AppState Changes

- `userRole: UserRole` added — read from `agrimart_user_role` localStorage on init, defaults to `'farmer'`
- `AppScreen` union extended: `| 'DUKAAN'`

### ShopItem → Product mapping

ShopItems are mapped to a `Product`-compatible shape for display in HomeScreen and DetailsScreen:

```typescript
interface MappedShopProduct extends Product {
  isDukaanItem: true;
  brand?: string;
  expiryDate?: string;
}
```

Fields mapped: `price`, `imageUrl` (first `imageUris[0]`), `description`, `sellerId` (shopkeeperId), `name`, `nameMr`, `category` → `'agri-input'`.

---

## 4. Registration Flow Changes

### Current flow (unchanged for farmers)
Step 1 (identity) → Step 2 (address) → complete

### New shopkeeper path
Step 1 (identity) → Step 2 (address + shopkeeper toggle) → Step 3 (shop details) → complete

**Step indicator:** Shows `1/2`, `2/2` for farmers; `1/3`, `2/3`, `3/3` for shopkeepers.

### Shopkeeper toggle (bottom of RegisterStep2)
A card with a toggle. When ON, "Complete Registration" button changes to "Next — Shop Details →".

### RegisterStep3 fields
| Field | Type | Required |
|---|---|---|
| Shop Name | text | Yes |
| GST or License (radio selector) | text | Yes (one of the two) |
| Shop Exterior Photo | camera/file | Yes |
| Shop Interior Photo | camera/file | Yes |

On submit: saves `agrimart_user_role = 'shopkeeper'` and `agrimart_shop_profile` to localStorage.

### Module-level data store
`_step1` pattern (already used in AuthScreen) extended. Add `_shopData` for Step 3 data to flow to the submit handler.

---

## 5. Profile Screen Changes

### Shopkeeper-only card (above menu list)
```
🏪 Dukandaar Mode →
   Manage inventory · View dashboard
```
Taps → `changeScreen('DUKAAN')`

### Farmer-only card (above menu list)
```
🏪 Become a Shopkeeper →
   List agri-input products from your shop
```
Taps → opens `ShopRegistrationView` within Profile's slide navigation

### ShopRegistrationView
Same 4 fields as RegisterStep3. On save, writes to localStorage and sets `userRole = 'shopkeeper'`. The ProfileScreen main view re-renders to show "Dukandaar Mode" card.

### ShopStatusView (for existing shopkeepers)
Shows:
- Shop name
- Verification badge ("Under Review 🕐" always, since no admin backend)
- "Edit Shop Details" button → opens ShopRegistrationView pre-populated

---

## 6. DUKAAN Screen

**Entry:** Profile → "Dukandaar Mode" card
**Exit:** Back arrow → PROFILE screen

### Tab Bar
`[ Dashboard ]  [ Inventory ]  [ Orders ]`

Sits below the global Header (Header remains visible). Each tab is an independent scroll view.

---

### Tab 1 — Dashboard

**Shop header row:** Shop name + "Under Review 🕐" badge (always pending in mock).

**Stat cards (2×2 grid):**
- Today's Revenue (₹)
- Monthly Revenue (₹)
- Total Orders
- Pending Deliveries

**7-day Revenue Bar Chart:**
- Rendered with inline SVG — no external chart library
- `<rect>` elements scaled to a D3-style linear scale
- Mock data: 7 daily values in Indian rupee ranges (₹800–₹12,000)
- X-axis: day labels (Mon–Sun), Y-axis: implicit from bar height

**Top 3 Products:**
- Ranked list: product name | units sold | revenue
- Mock data hardcoded

**Low Stock Alerts:**
- Shows all `ShopItem` where `stockQty <= stockThreshold`
- Amber warning card per item
- "Restock →" button switches to Inventory tab

**Recent Orders Feed:**
- Last 5 mock orders
- Status badges: pending (amber) | dispatched (blue) | delivered (green)
- Fields: buyer pseudonym, product name, amount, timestamp

---

### Tab 2 — Inventory

**Header row:** Item count + "Add Item +" green pill button

**Filter chips:** All | Seeds | Fertilizer | Pesticide | Tools | Feed | Other

**Item card (list):**
- Thumbnail (first imageUri or placeholder)
- Name + category chip
- Price + unit
- Stock qty (red text if `stockQty <= stockThreshold`)
- Action row: Edit ✎ | Active toggle | Delete 🗑

**Add/Edit Item — bottom sheet (not a new screen):**
| Field | Required |
|---|---|
| Item name (EN) | Yes |
| Item name (MR) | Yes |
| Category | Yes |
| Price | Yes |
| Unit (reuses PRICE_UNITS from SellScreen) | Yes |
| Stock quantity | Yes |
| Low-stock threshold | Yes |
| Description (EN) | Yes |
| Description (MR) | Yes |
| Photos (up to 4) | No (but recommended) |
| Brand | No |
| Expiry date | No |
| Active toggle | Yes (defaults ON) |

**Delete confirmation:** Bottom sheet modal "Delete this item?" with Cancel / Delete buttons.

**Empty state:** Illustration + "No items yet. Add your first product →" CTA.

---

### Tab 3 — Orders

Mock order list. Same status badge convention as `OrdersScreen`.

Tap an order → expands inline (no new screen) to show:
- Product name + qty
- Buyer location (pseudonym)
- Amount
- Timestamp
- Status badge

**Empty state:** "No orders yet. Your orders will appear here."

---

## 7. Market Tab Integration (HomeScreen)

### Change 1 — "Nearby Dukaandaars" shelf

**Position:** Between Stats row and Search+chips row.

**Layout:** Section title "🏪 Nearby Dukaandaars" + "See all →" link. Horizontal scroll of Dukaan cards.

**Dukaan card:**
- Shop exterior photo (thumbnail)
- Shop name
- Distance (mock: "0.3 km", "1.1 km", "2.4 km")

**Tap:** Opens `SELLER_PROFILE` screen with shopkeeper's items displayed.

**Data source:** 3–4 hardcoded mock shops in `constants.tsx`.

---

### Change 2 — "Agri Inputs" filter chip

Added to existing filter chip row alongside Vegetables, Grains, Fruits, etc.

**When selected:**
- Product grid filters to show only `ShopItem` entries (localStorage items + mock constants items)
- `ProductCard` renders "Dukaan" green pill badge (top-left) instead of category label
- Card bottom row: "Brand: X" when `brand` present, otherwise description snippet

---

### DetailsScreen adaptation

When `selectedProduct.isDukaanItem === true`:
- **Hide:** harvest date, certificates, MSP badge, farmer speciality
- **Show:** Brand (if present), Expiry date (if present), "Agri Input" category chip in amber
- Seller card: shop name + "Verified Dukandaar" badge (always shown regardless of actual verification status in mock)

Implementation: ~20 lines of conditional JSX inside existing `DetailsScreen`. No new screen.

---

### SellerProfileScreen adaptation

When `sellerId` maps to a shopkeeper:
- Header shows shop name instead of farmer name
- Badge: "Dukandaar" instead of "Premium Farmer"
- Product grid shows `ShopItem` entries mapped to `Product` shape

---

## 8. Sprint Plan

### Sprint 1 — Role Foundation + Registration (~1 day)
- New types in `types.ts`
- `userRole` in `AppState`
- `'DUKAAN'` in `AppScreen`
- RegisterStep2 shopkeeper toggle
- RegisterStep3 component
- Step indicator update (1/3, 2/3, 3/3)

**QA gates:**
- [ ] Farmer path: no regression, 2-step flow unchanged
- [ ] Shopkeeper path: Step 3 appears, all fields validate
- [ ] Missing photo blocks submission with clear error
- [ ] Missing both GST and license blocks submission
- [ ] Role persists after page refresh

---

### Sprint 2 — Profile Toggle + Shop Settings (~1 day)
- Dukandaar Mode card on Profile (shopkeeper)
- Become a Shopkeeper card on Profile (farmer)
- ShopRegistrationView within Profile slide nav
- ShopStatusView for existing shopkeepers
- DUKAAN screen stub (tab bar + back nav + empty panels)

**QA gates:**
- [ ] Farmer sees correct card, shopkeeper sees correct card
- [ ] Shop registration from profile saves correctly
- [ ] Editing updates, does not duplicate
- [ ] DUKAAN screen opens and back returns to PROFILE
- [ ] Tab switching works

---

### Sprint 3 — Inventory Management (~1.5 days)
- Inventory tab: list view + filter chips
- Add/Edit bottom sheet with all fields
- Delete with confirmation
- Active/inactive toggle
- localStorage persistence
- Low stock visual indicator
- Empty state

**QA gates:**
- [ ] All required fields validate before save
- [ ] Edit pre-populates correctly
- [ ] Delete requires confirmation
- [ ] Photos: up to 4, individually removable
- [ ] Filter chips work correctly
- [ ] Low stock items show red badge
- [ ] Data persists after page reload

---

### Sprint 4 — Market Integration (~1 day)
- Mock dukaan data in `constants.tsx`
- "Nearby Dukaandaars" shelf in HomeScreen
- "Agri Inputs" chip in HomeScreen
- ProductCard dukaan variant
- DetailsScreen conditional render
- SellerProfileScreen shop handling

**QA gates:**
- [ ] Shelf renders, horizontal scroll works
- [ ] Dukaan card tap opens SellerProfileScreen
- [ ] "Agri Inputs" chip filters correctly
- [ ] Dukaan ProductCard shows badge, hides farm fields
- [ ] DetailsScreen hides farm fields, shows brand/expiry
- [ ] Switching back to other chips restores farm produce

---

### Sprint 5 — Dashboard (~1.5 days)
- Stat cards (4)
- 7-day inline SVG bar chart
- Top 3 Products list
- Low Stock Alerts with Restock button
- Recent Orders feed
- Orders tab with expand-inline detail
- All mock data

**QA gates:**
- [ ] Stat cards no overflow at 320px
- [ ] Bar chart proportional rendering
- [ ] Low stock alerts reflect actual inventory thresholds
- [ ] Restock navigates to Inventory tab
- [ ] Orders status badge colours match app convention
- [ ] All 3 tabs scroll independently
- [ ] DUKAAN screen inaccessible without shopkeeper role

---

## 9. QA Protocol (All Sprints)

Run in order before marking any sprint complete:

1. `npx tsc --noEmit` — zero errors required
2. Visual check at 375px, 390px, 412px
3. Role isolation: manually toggle localStorage role, verify correct UI per role
4. localStorage integrity: verify JSON in DevTools after every CRUD operation
5. Back-navigation stress: rapid tab switching, reopen DUKAAN, no freezes
6. Photo upload: test on mobile or Chrome Android emulation
7. Language parity: every new string present in both `en` and `mr`

---

## 10. Known Limitations (Document, Do Not Fix)

| Limitation | Reason | Mitigation |
|---|---|---|
| `verificationStatus` always `'pending'` | No admin backend | "Under Review" badge shown; feature fully usable |
| Photos stored as `blob:` URLs | No file storage backend | Note in UI: photos session-lived; backend to add real storage later |
| Dashboard numbers are hardcoded | No order/revenue backend | Clearly labelled as "sample data" in UI until real backend |
| No role-based auth on backend | Backend is all mock | localStorage role is sufficient for frontend-only phase |

---

## 11. Files to Create or Modify

### New files
- `apps/mobile/components/DukaanScreen.tsx` — main DUKAAN screen with 3 tabs
- `apps/mobile/components/dukaan/DashboardTab.tsx`
- `apps/mobile/components/dukaan/InventoryTab.tsx`
- `apps/mobile/components/dukaan/OrdersTab.tsx`
- `apps/mobile/components/dukaan/AddEditItemSheet.tsx`
- `apps/mobile/components/dukaan/ShopRegistrationView.tsx`

### Modified files
- `apps/mobile/types.ts` — new types
- `apps/mobile/App.tsx` — new screen case, userRole in AppState
- `apps/mobile/components/AuthScreen.tsx` — Step 3 + shopkeeper toggle in Step 2
- `apps/mobile/components/ProfileScreen.tsx` — Dukandaar Mode card + Become a Shopkeeper card
- `apps/mobile/components/HomeScreen.tsx` — Dukaandaars shelf + Agri Inputs chip
- `apps/mobile/components/DetailsScreen.tsx` — dukaan item conditional render
- `apps/mobile/components/SellerProfileScreen.tsx` — shop handling
- `apps/mobile/components/molecules/ProductCard.tsx` — dukaan variant
- `apps/mobile/constants.tsx` — mock dukaan data
