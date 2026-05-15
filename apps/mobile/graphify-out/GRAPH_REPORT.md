# Graph Report - apps/mobile  (2026-05-15)

## Corpus Check
- 102 files · ~146,450 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1379 nodes · 3026 edges · 77 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Bundle Core|App Bundle Core]]
- [[_COMMUNITY_Bundle Internals A|Bundle Internals A]]
- [[_COMMUNITY_Bundle HTTP Client|Bundle HTTP Client]]
- [[_COMMUNITY_Bundle Animation|Bundle Animation]]
- [[_COMMUNITY_Bundle Event System|Bundle Event System]]
- [[_COMMUNITY_Bundle PromiseAsync|Bundle Promise/Async]]
- [[_COMMUNITY_App Navigation + Screens|App Navigation + Screens]]
- [[_COMMUNITY_Bundle Gesture Handler|Bundle Gesture Handler]]
- [[_COMMUNITY_Bundle Request Handler|Bundle Request Handler]]
- [[_COMMUNITY_Dukaan + Seller Screens|Dukaan + Seller Screens]]
- [[_COMMUNITY_Bundle SetCollection|Bundle Set/Collection]]
- [[_COMMUNITY_Bundle CSS Animation|Bundle CSS Animation]]
- [[_COMMUNITY_App Root + Auth Gate|App Root + Auth Gate]]
- [[_COMMUNITY_Bundle ToolAgent|Bundle Tool/Agent]]
- [[_COMMUNITY_Bundle Pagination|Bundle Pagination]]
- [[_COMMUNITY_LocationPicker Bundle|LocationPicker Bundle]]
- [[_COMMUNITY_Farming News Feed|Farming News Feed]]
- [[_COMMUNITY_Live Price Ticker|Live Price Ticker]]
- [[_COMMUNITY_DukaanScreen Bundle|DukaanScreen Bundle]]
- [[_COMMUNITY_Auth Screen OTP|Auth Screen OTP]]
- [[_COMMUNITY_HomeScreen Logic|HomeScreen Logic]]
- [[_COMMUNITY_Cart Utilities|Cart Utilities]]
- [[_COMMUNITY_SellScreen Bundle|SellScreen Bundle]]
- [[_COMMUNITY_Location Picker Modal|Location Picker Modal]]
- [[_COMMUNITY_Onboarding Flow|Onboarding Flow]]
- [[_COMMUNITY_Inventory Management|Inventory Management]]
- [[_COMMUNITY_API Service Layer|API Service Layer]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]
- [[_COMMUNITY_Android Instrumented Tests|Android Instrumented Tests]]
- [[_COMMUNITY_Android Unit Tests|Android Unit Tests]]
- [[_COMMUNITY_My Listings Screen|My Listings Screen]]
- [[_COMMUNITY_Profile Screen|Profile Screen]]
- [[_COMMUNITY_Constants + i18n|Constants + i18n]]
- [[_COMMUNITY_Shop Types|Shop Types]]
- [[_COMMUNITY_Leaflet Map Bundle|Leaflet Map Bundle]]
- [[_COMMUNITY_Android MainActivity|Android MainActivity]]
- [[_COMMUNITY_Bottom Navigation|Bottom Navigation]]
- [[_COMMUNITY_Cart Screen|Cart Screen]]
- [[_COMMUNITY_Checkout Screen|Checkout Screen]]
- [[_COMMUNITY_Crop Calendar Screen|Crop Calendar Screen]]
- [[_COMMUNITY_Apps Mobile Components Details|Apps Mobile Components Details]]
- [[_COMMUNITY_Apps Mobile Components Header|Apps Mobile Components Header ]]
- [[_COMMUNITY_Apps Mobile Components Message|Apps Mobile Components Message]]
- [[_COMMUNITY_Apps Mobile Components Sellerp|Apps Mobile Components Sellerp]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_Addedititemsheet Addedititemsh|Addedititemsheet Addedititemsh]]
- [[_COMMUNITY_Apps Mobile Components Dukaan|Apps Mobile Components Dukaan ]]
- [[_COMMUNITY_Apps Mobile Components Molecul|Apps Mobile Components Molecul]]
- [[_COMMUNITY_Demo Demoone|Demo Demoone]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_Geminiservice Getaimarketassis|Geminiservice Getaimarketassis]]
- [[_COMMUNITY_Index Tsx|Index Tsx]]
- [[_COMMUNITY_Sw Js|Sw Js]]
- [[_COMMUNITY_Types Category|Types Category]]
- [[_COMMUNITY_Types Shopverificationstatus|Types Shopverificationstatus]]
- [[_COMMUNITY_Apps Mobile Vite Config Ts|Apps Mobile Vite Config Ts]]
- [[_COMMUNITY_Apps Mobile Android App Src Ma|Apps Mobile Android App Src Ma]]
- [[_COMMUNITY_Apps Mobile Android App Src Ma|Apps Mobile Android App Src Ma]]
- [[_COMMUNITY_Apps Mobile Components Dukaans|Apps Mobile Components Dukaans]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_Apps Mobile Components Languag|Apps Mobile Components Languag]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_Logo Logo|Logo Logo]]
- [[_COMMUNITY_Apps Mobile Components Myshopg|Apps Mobile Components Myshopg]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_E Agri Mart Agrimart Android A|E Agri Mart Agrimart Android A]]
- [[_COMMUNITY_Types Shopitemcategory|Types Shopitemcategory]]
- [[_COMMUNITY_Constants Colors|Constants Colors]]
- [[_COMMUNITY_Viteconfig Viteconfig|Viteconfig Viteconfig]]
- [[_COMMUNITY_Androidtest Exampleinstrumente|Androidtest Exampleinstrumente]]
- [[_COMMUNITY_Unittest Exampleunittest|Unittest Exampleunittest]]

## God Nodes (most connected - your core abstractions)
1. `Graph Report Document` - 61 edges
2. `oE()` - 52 edges
3. `UE()` - 34 edges
4. `x8` - 34 edges
5. `_C()` - 33 edges
6. `V4` - 31 edges
7. `o()` - 28 edges
8. `sE()` - 27 edges
9. `Wl` - 23 edges
10. `JC` - 22 edges

## Surprising Connections (you probably didn't know these)
- `AssistantScreen Component` --semantically_similar_to--> `AuthScreen Component`  [INFERRED] [semantically similar]
  components/AssistantScreen.tsx → apps/mobile/components/AuthScreen.tsx
- `SellerProfileScreen` --semantically_similar_to--> `OrderDetailPanel()`  [INFERRED] [semantically similar]
  components/SellerProfileScreen.tsx → apps\mobile\components\OrdersScreen.tsx
- `Geolocation + Nominatim Reverse Geocoding` --shares_data_with--> `Language Enum (11 langs)`  [INFERRED]
  apps/mobile/App.tsx → types.ts
- `Community: Project Setup & Env` --conceptually_related_to--> `Node.js`  [INFERRED]
  graphify-out/GRAPH_REPORT.md → README.md
- `Community: Project Setup & Env` --conceptually_related_to--> `npm install`  [INFERRED]
  graphify-out/GRAPH_REPORT.md → README.md

## Hyperedges (group relationships)
- **App Screen Routing System** — app_App, app_changeScreen, app_SCREEN_ORDER, types_AppScreen, types_AppState [EXTRACTED 1.00]
- **Authentication Flow (OTP-based, multi-step registration)** — app_authgate, authscreen_AuthScreen, authscreen_LoginView, authscreen_OtpVerify, authscreen_RegisterStep1, authscreen_RegisterStep2, services_api, app_localStorage_keys [EXTRACTED 1.00]
- **Cart and Checkout Flow** — cartscreen_CartScreen, checkoutscreen_CheckoutScreen, utils_cart, constants_PRODUCTS, services_api [EXTRACTED 1.00]
- **i18n Language System** — types_Language, constants_getTranslations, app_App, bottomnav_BottomNav, assistantscreen_AssistantScreen, authscreen_AuthScreen, cartscreen_CartScreen, checkoutscreen_CheckoutScreen, cropcalendarscreen_CropCalendarScreen [EXTRACTED 1.00]
- **PRODUCTS Data Consumers** — constants_PRODUCTS, assistantscreen_AssistantScreen, cartscreen_CartScreen, checkoutscreen_CheckoutScreen [EXTRACTED 1.00]
- **Capacitor Android Bridge** — mainactivity_MainActivity, app_App, index_entrypoint [INFERRED 0.80]
- **SectionReveal Atom Usage** — atoms_SectionReveal, cartscreen_CartScreen, checkoutscreen_CheckoutScreen, cropcalendarscreen_CropCalendarScreen [EXTRACTED 1.00]
- **Dukaan/Seller Inventory & Listing Flow** — dukaan_inventorytab, dukaan_addedititemsheet, dukaan_storage_key_inventory [EXTRACTED 0.95]
- **Order Status Tracking System** — ordersscreen_status_meta, ordersscreen_timeline_steps, ordersscreen_orderdetailpanel [EXTRACTED 0.92]
- **Profile Screen Sub-View Navigation** — profilescreen_profilescreen, profilescreen_settingsview, profilescreen_notificationsview, profilescreen_kycview, profilescreen_helpview [EXTRACTED 0.97]

## Communities

### Community 0 - "App Bundle Core"
Cohesion: 0.01
Nodes (253): _3(), a_(), a2(), a3(), A4(), a8(), aC(), Af() (+245 more)

### Community 1 - "Bundle Internals A"
Cohesion: 0.03
Nodes (52): a5(), b2(), by(), db(), Dn(), dy(), E5(), Et() (+44 more)

### Community 2 - "Bundle HTTP Client"
Cohesion: 0.07
Nodes (21): ai(), aR(), Cl(), Dp(), dR(), El(), er(), F8 (+13 more)

### Community 3 - "Bundle Animation"
Cohesion: 0.04
Nodes (80): aD(), AE(), b8(), bD(), Bi, bo(), cD(), cR() (+72 more)

### Community 4 - "Bundle Event System"
Cohesion: 0.04
Nodes (30): _8, bb(), bP(), c6(), c8(), Ct(), E3(), f6() (+22 more)

### Community 5 - "Bundle Promise/Async"
Cohesion: 0.04
Nodes (17): a1(), Ep, FE(), hf(), l8(), m1, M8, ME() (+9 more)

### Community 6 - "App Navigation + Screens"
Cohesion: 0.04
Nodes (74): Bridge Node: changeScreen() (cross-community), Bridge Node: toggleSelect() (cross-community), Community: Animated Hero UI, Community: App Entry Point, Community: App Navigation Core, Community: App Root Entry, Community: App Types, Community: Bottom Navigation (+66 more)

### Community 7 - "Bundle Gesture Handler"
Cohesion: 0.05
Nodes (24): __(), B4(), ec(), eM(), fI(), G_, g2(), i() (+16 more)

### Community 8 - "Bundle Request Handler"
Cohesion: 0.06
Nodes (17): _4(), bs(), _C(), DC(), dS, HL(), mb(), mL() (+9 more)

### Community 9 - "Dukaan + Seller Screens"
Cohesion: 0.05
Nodes (44): CartBadge, AddEditItemSheet, DashboardTab, InventoryTab, OrdersTab (Dukaan), ShopRegistrationView, agrimart_shop_inventory (localStorage), ProductCard (+36 more)

### Community 10 - "Bundle Set/Collection"
Cohesion: 0.05
Nodes (21): _5, b1(), C2(), E1(), g3(), gp, hp(), i4() (+13 more)

### Community 11 - "Bundle CSS Animation"
Cohesion: 0.06
Nodes (12): Cf(), cp(), Ef(), gc(), J4(), l1(), mp(), n_() (+4 more)

### Community 12 - "App Root + Auth Gate"
Cohesion: 0.1
Nodes (39): App (Root Component), SCREEN_ORDER Navigation Array, Auth Gate (post-onboarding token check), changeScreen Navigation Function, Geolocation + Nominatim Reverse Geocoding, LocalStorage Keys (swaseva_*), AssistantScreen Component, PillButton Atom Component (+31 more)

### Community 13 - "Bundle Tool/Agent"
Cohesion: 0.17
Nodes (6): e8(), eh, lS(), q3, t8(), z3

### Community 14 - "Bundle Pagination"
Cohesion: 0.21
Nodes (1): Ss

### Community 15 - "LocationPicker Bundle"
Cohesion: 0.2
Nodes (3): M, pe(), te()

### Community 16 - "Farming News Feed"
Cohesion: 0.29
Nodes (7): buildStaticNews(), daysAgo(), fetchOneFeed(), fetchWithTimeout(), loadNews(), relativeDate(), writeCache()

### Community 17 - "Live Price Ticker"
Cohesion: 0.2
Nodes (2): dailyPrice(), seededRandom()

### Community 18 - "DukaanScreen Bundle"
Cohesion: 0.25
Nodes (2): de(), ne()

### Community 19 - "Auth Screen OTP"
Cohesion: 0.25
Nodes (2): submit(), validate()

### Community 20 - "HomeScreen Logic"
Cohesion: 0.22
Nodes (0): 

### Community 21 - "Cart Utilities"
Cohesion: 0.5
Nodes (8): addToCart(), clearCart(), dispatch(), getCart(), getCartCount(), removeFromCart(), saveCart(), updateQty()

### Community 22 - "SellScreen Bundle"
Cohesion: 0.29
Nodes (2): Ee(), Pe()

### Community 23 - "Location Picker Modal"
Cohesion: 0.33
Nodes (2): geocode(), upsertCircle()

### Community 24 - "Onboarding Flow"
Cohesion: 0.43
Nodes (4): finish(), next(), onTouchEnd(), prev()

### Community 25 - "Inventory Management"
Cohesion: 0.48
Nodes (5): handleDelete(), handleSave(), handleToggleActive(), persist(), saveItems()

### Community 26 - "API Service Layer"
Cohesion: 0.5
Nodes (3): ApiError, req(), tryRefresh()

### Community 27 - "App Entry Point"
Cohesion: 1.0
Nodes (2): App(), getDirection()

### Community 28 - "Android Instrumented Tests"
Cohesion: 0.67
Nodes (1): ExampleInstrumentedTest

### Community 29 - "Android Unit Tests"
Cohesion: 0.67
Nodes (1): ExampleUnitTest

### Community 30 - "My Listings Screen"
Cohesion: 0.67
Nodes (0): 

### Community 31 - "Profile Screen"
Cohesion: 0.67
Nodes (0): 

### Community 32 - "Constants + i18n"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Shop Types"
Cohesion: 1.0
Nodes (2): ShopItem Interface, ShopProfile Interface

### Community 34 - "Leaflet Map Bundle"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Android MainActivity"
Cohesion: 1.0
Nodes (1): MainActivity

### Community 36 - "Bottom Navigation"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Cart Screen"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Checkout Screen"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Crop Calendar Screen"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Apps Mobile Components Details"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Apps Mobile Components Header "
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Apps Mobile Components Message"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Apps Mobile Components Sellerp"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Addedititemsheet Addedititemsh"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Apps Mobile Components Dukaan "
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Apps Mobile Components Molecul"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Demo Demoone"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Geminiservice Getaimarketassis"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Index Tsx"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Sw Js"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Types Category"
Cohesion: 1.0
Nodes (1): Category Interface

### Community 57 - "Types Shopverificationstatus"
Cohesion: 1.0
Nodes (1): ShopVerificationStatus Type

### Community 58 - "Apps Mobile Vite Config Ts"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Apps Mobile Android App Src Ma"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "Apps Mobile Android App Src Ma"
Cohesion: 1.0
Nodes (0): 

### Community 61 - "Apps Mobile Components Dukaans"
Cohesion: 1.0
Nodes (0): 

### Community 62 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "Apps Mobile Components Languag"
Cohesion: 1.0
Nodes (0): 

### Community 64 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 65 - "Logo Logo"
Cohesion: 1.0
Nodes (1): Logo SVG Component

### Community 66 - "Apps Mobile Components Myshopg"
Cohesion: 1.0
Nodes (0): 

### Community 67 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 68 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 69 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 70 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 71 - "E Agri Mart Agrimart Android A"
Cohesion: 1.0
Nodes (0): 

### Community 72 - "Types Shopitemcategory"
Cohesion: 1.0
Nodes (1): ShopItemCategory Type

### Community 73 - "Constants Colors"
Cohesion: 1.0
Nodes (1): COLORS Constant

### Community 74 - "Viteconfig Viteconfig"
Cohesion: 1.0
Nodes (1): Vite Config

### Community 75 - "Androidtest Exampleinstrumente"
Cohesion: 1.0
Nodes (1): ExampleInstrumentedTest

### Community 76 - "Unittest Exampleunittest"
Cohesion: 1.0
Nodes (1): ExampleUnitTest

## Knowledge Gaps
- **102 isolated node(s):** `Seller Interface`, `Category Interface`, `ShopProfile Interface`, `ShopItem Interface`, `MappedShopProduct Interface` (+97 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Constants + i18n`** (2 nodes): `constants.tsx`, `getTranslations()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shop Types`** (2 nodes): `ShopItem Interface`, `ShopProfile Interface`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leaflet Map Bundle`** (2 nodes): `leaflet-src-ChOJgM_c.js`, `Vo()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android MainActivity`** (2 nodes): `MainActivity.java`, `MainActivity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bottom Navigation`** (2 nodes): `BottomNav.tsx`, `BottomNav()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart Screen`** (2 nodes): `handler()`, `CartScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Checkout Screen`** (2 nodes): `CheckoutScreen.tsx`, `handleConfirm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Crop Calendar Screen`** (2 nodes): `getPhase()`, `CropCalendarScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Components Details`** (2 nodes): `DetailsScreen.tsx`, `DetailsScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Components Header `** (2 nodes): `Header.tsx`, `onScroll()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Components Message`** (2 nodes): `MessagesScreen.tsx`, `formatTime()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Components Sellerp`** (2 nodes): `SellerProfileScreen.tsx`, `handleEnquiry()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (2 nodes): `PillButton.tsx`, `PillButton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (2 nodes): `SectionReveal.tsx`, `SectionReveal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (2 nodes): `StatCard.tsx`, `StatCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (2 nodes): `WeatherWidget.tsx`, `weatherIcon()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Addedititemsheet Addedititemsh`** (2 nodes): `AddEditItemSheet()`, `AddEditItemSheet.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Components Dukaan `** (2 nodes): `DashboardTab.tsx`, `loadInventory()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Components Molecul`** (2 nodes): `ProductCard.tsx`, `ProductCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Demo Demoone`** (2 nodes): `DemoOne()`, `demo.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (2 nodes): `maharashtraLocations.ts`, `getTalukasByDistrict()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Geminiservice Getaimarketassis`** (2 nodes): `getAiMarketAssistance()`, `geminiService.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Index Tsx`** (1 nodes): `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sw Js`** (1 nodes): `sw.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Types Category`** (1 nodes): `Category Interface`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Types Shopverificationstatus`** (1 nodes): `ShopVerificationStatus Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Vite Config Ts`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Android App Src Ma`** (1 nodes): `cordova.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Android App Src Ma`** (1 nodes): `cordova_plugins.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Components Dukaans`** (1 nodes): `DukaanScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (1 nodes): `ExploreScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Components Languag`** (1 nodes): `LanguagePicker.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (1 nodes): `locationTypes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Logo Logo`** (1 nodes): `Logo SVG Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apps Mobile Components Myshopg`** (1 nodes): `MyShopGateScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (1 nodes): `SearchableDropdown.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (1 nodes): `SkeletonCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (1 nodes): `DarkHeroSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (1 nodes): `dynamic-animated-hero-section-with-gradient.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `E Agri Mart Agrimart Android A`** (1 nodes): `haptic.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Types Shopitemcategory`** (1 nodes): `ShopItemCategory Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Constants Colors`** (1 nodes): `COLORS Constant`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Viteconfig Viteconfig`** (1 nodes): `Vite Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Androidtest Exampleinstrumente`** (1 nodes): `ExampleInstrumentedTest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Unittest Exampleunittest`** (1 nodes): `ExampleUnitTest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `x8` connect `Bundle Event System` to `App Bundle Core`, `Bundle HTTP Client`, `Bundle Animation`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `_C()` connect `Bundle Request Handler` to `App Bundle Core`, `Bundle Internals A`, `Bundle HTTP Client`, `Bundle Event System`, `Bundle CSS Animation`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `V4` connect `Bundle Internals A` to `App Bundle Core`, `Bundle Set/Collection`, `Bundle CSS Animation`, `Bundle Gesture Handler`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `Seller Interface`, `Category Interface`, `ShopProfile Interface` to the rest of the system?**
  _102 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Bundle Core` be split into smaller, more focused modules?**
  _Cohesion score 0.01 - nodes in this community are weakly interconnected._
- **Should `Bundle Internals A` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._
- **Should `Bundle HTTP Client` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._