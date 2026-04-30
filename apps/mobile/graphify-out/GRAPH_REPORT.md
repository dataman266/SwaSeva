# Graph Report - e:/Agri_Mart/AgriMart_Android/apps/mobile  (2026-04-30)

## Corpus Check
- 59 files · ~75,741 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 314 nodes · 374 edges · 58 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Graph Report Metadata|Graph Report Metadata]]
- [[_COMMUNITY_App Root & Navigation|App Root & Navigation]]
- [[_COMMUNITY_Onboarding & Registration|Onboarding & Registration]]
- [[_COMMUNITY_Product Cards & Ticker UI|Product Cards & Ticker UI]]
- [[_COMMUNITY_Dukaan Module Core|Dukaan Module Core]]
- [[_COMMUNITY_Farming News Feed|Farming News Feed]]
- [[_COMMUNITY_Project Setup|Project Setup]]
- [[_COMMUNITY_Live Price Ticker|Live Price Ticker]]
- [[_COMMUNITY_Cart State Management|Cart State Management]]
- [[_COMMUNITY_Auth Screen Logic|Auth Screen Logic]]
- [[_COMMUNITY_Home Screen|Home Screen]]
- [[_COMMUNITY_Location Picker Modal|Location Picker Modal]]
- [[_COMMUNITY_Inventory Management|Inventory Management]]
- [[_COMMUNITY_AI Assistant Screen|AI Assistant Screen]]
- [[_COMMUNITY_Onboarding Flow|Onboarding Flow]]
- [[_COMMUNITY_Profile Screen|Profile Screen]]
- [[_COMMUNITY_Shop Registration|Shop Registration]]
- [[_COMMUNITY_App Component|App Component]]
- [[_COMMUNITY_Translations & i18n|Translations & i18n]]
- [[_COMMUNITY_Bottom Navigation|Bottom Navigation]]
- [[_COMMUNITY_Cart Screen|Cart Screen]]
- [[_COMMUNITY_Checkout Screen|Checkout Screen]]
- [[_COMMUNITY_Crop Calendar Screen|Crop Calendar Screen]]
- [[_COMMUNITY_Product Details Screen|Product Details Screen]]
- [[_COMMUNITY_Header Component|Header Component]]
- [[_COMMUNITY_Logo Component|Logo Component]]
- [[_COMMUNITY_Messages & Enquiry|Messages & Enquiry]]
- [[_COMMUNITY_My Listings Screen|My Listings Screen]]
- [[_COMMUNITY_Seller Profile Screen|Seller Profile Screen]]
- [[_COMMUNITY_Cart Badge Atom|Cart Badge Atom]]
- [[_COMMUNITY_Pill Button Atom|Pill Button Atom]]
- [[_COMMUNITY_Section Reveal Animation|Section Reveal Animation]]
- [[_COMMUNITY_Stat Card Atom|Stat Card Atom]]
- [[_COMMUNITY_Weather Widget|Weather Widget]]
- [[_COMMUNITY_AddEdit Item Sheet|Add/Edit Item Sheet]]
- [[_COMMUNITY_Dukaan Dashboard Tab|Dukaan Dashboard Tab]]
- [[_COMMUNITY_Product Card Molecule|Product Card Molecule]]
- [[_COMMUNITY_Demo Components|Demo Components]]
- [[_COMMUNITY_Maharashtra Locations Data|Maharashtra Locations Data]]
- [[_COMMUNITY_Gemini AI Service|Gemini AI Service]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]
- [[_COMMUNITY_Service Worker|Service Worker]]
- [[_COMMUNITY_Type Definitions|Type Definitions]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Dukaan Screen Container|Dukaan Screen Container]]
- [[_COMMUNITY_Explore Screen|Explore Screen]]
- [[_COMMUNITY_Language Picker|Language Picker]]
- [[_COMMUNITY_Location Types|Location Types]]
- [[_COMMUNITY_Searchable Dropdown|Searchable Dropdown]]
- [[_COMMUNITY_Skeleton Card Atom|Skeleton Card Atom]]
- [[_COMMUNITY_Dukaan Orders Tab|Dukaan Orders Tab]]
- [[_COMMUNITY_Dark Hero Section|Dark Hero Section]]
- [[_COMMUNITY_Scrolling Ticker Organism|Scrolling Ticker Organism]]
- [[_COMMUNITY_Animated Hero Section|Animated Hero Section]]
- [[_COMMUNITY_Design Token System|Design Token System]]
- [[_COMMUNITY_Haptic Utilities|Haptic Utilities]]
- [[_COMMUNITY_Price Units Constants|Price Units Constants]]
- [[_COMMUNITY_Shop Verification Types|Shop Verification Types]]

## God Nodes (most connected - your core abstractions)
1. `Graph Report Document` - 61 edges
2. `App (Root Component)` - 18 edges
3. `HomeScreen Component` - 16 edges
4. `Language Enum (11 langs)` - 15 edges
5. `AuthScreen Component` - 12 edges
6. `DetailsScreen Component` - 10 edges
7. `ProfileScreen` - 8 edges
8. `AgriMart Mobile App` - 8 edges
9. `Community: Project Setup & Env` - 8 edges
10. `Product Interface` - 7 edges

## Surprising Connections (you probably didn't know these)
- `SellerProfileScreen` --semantically_similar_to--> `OrderDetailPanel()`  [INFERRED] [semantically similar]
  components/SellerProfileScreen.tsx → e:\Agri_Mart\AgriMart_Android\apps\mobile\components\OrdersScreen.tsx
- `LanguagePicker Component` --semantically_similar_to--> `TRANSLATIONS Map (11 Languages)`  [INFERRED] [semantically similar]
  components/LanguagePicker.tsx → constants.tsx
- `Geolocation + Language Auto-detect` --references--> `Language Enum (11 langs)`  [INFERRED]
  App.tsx → types.ts
- `Community: Project Setup & Env` --conceptually_related_to--> `Node.js`  [INFERRED]
  graphify-out/GRAPH_REPORT.md → README.md
- `GEMINI_API_KEY` --conceptually_related_to--> `Community: Gemini AI Service`  [INFERRED]
  README.md → graphify-out/GRAPH_REPORT.md

## Hyperedges (group relationships)
- **i18n Language System (Language enum + TRANSLATIONS map + getTranslations + LanguagePicker)** — types_Language, constants_TRANSLATIONS, constants_getTranslations, languagepicker_LanguagePicker [INFERRED 0.92]
- **Marketplace Data Layer (PRODUCTS + SELLERS + CATEGORIES shared across HomeScreen, DetailsScreen, MessagesScreen)** — constants_PRODUCTS, constants_SELLERS, homescreen_HomeScreen, detailsscreen_DetailsScreen, messagesscreen_MessagesScreen [EXTRACTED 0.95]
- **Auth & Onboarding Gate Flow (App AuthGate + AuthScreen + UserRole)** — app_AuthGate, authscreen_AuthScreen, types_UserRole [EXTRACTED 0.92]
- **Dukaan/Seller Inventory & Listing Flow** — dukaan_inventorytab, dukaan_addedititemsheet, dukaan_storage_key_inventory [EXTRACTED 0.95]
- **Order Status Tracking System** — ordersscreen_status_meta, ordersscreen_timeline_steps, ordersscreen_orderdetailpanel [EXTRACTED 0.92]
- **Profile Screen Sub-View Navigation** — profilescreen_profilescreen, profilescreen_settingsview, profilescreen_notificationsview, profilescreen_kycview, profilescreen_helpview [EXTRACTED 0.97]

## Communities

### Community 0 - "Graph Report Metadata"
Cohesion: 0.04
Nodes (64): Bridge Node: changeScreen() (cross-community), Bridge Node: toggleSelect() (cross-community), Community: Animated Hero UI, Community: App Entry Point, Community: App Navigation Core, Community: App Root Entry, Community: App Types, Community: Bottom Navigation (+56 more)

### Community 1 - "App Root & Navigation"
Cohesion: 0.11
Nodes (42): App (Root Component), Auth Gate Logic (onboarded + token check), Geolocation + Language Auto-detect, SCREEN_ORDER Navigation Array, changeScreen() Navigation Handler, getDirection() Transition Logic, AssistantScreen Component, AuthScreen Component (+34 more)

### Community 2 - "Onboarding & Registration"
Cohesion: 0.1
Nodes (17): ShopRegistrationView, contentVariants (Animation Variants), OnboardingScreen, SLIDES (Onboarding Slide Data), HelpView, KYCView, MENU_ITEMS (Profile Nav), NotificationsView (+9 more)

### Community 3 - "Product Cards & Ticker UI"
Cohesion: 0.13
Nodes (15): CartBadge, ProductCard, AGRI_TICKER_ITEMS, PARTNER_TICKER_ITEMS, ScrollingTicker, CONNECTIONS_KEY (localStorage), SellerProfileScreen, Colors (Design Token) (+7 more)

### Community 4 - "Dukaan Module Core"
Cohesion: 0.19
Nodes (12): AddEditItemSheet, DashboardTab, InventoryTab, OrdersTab (Dukaan), agrimart_shop_inventory (localStorage), MOCK_PURCHASED (Orders Data), MOCK_SOLD (Orders Data), OrderCard (+4 more)

### Community 5 - "Farming News Feed"
Cohesion: 0.29
Nodes (7): buildStaticNews(), daysAgo(), fetchOneFeed(), fetchWithTimeout(), loadNews(), relativeDate(), writeCache()

### Community 6 - "Project Setup"
Cohesion: 0.33
Nodes (10): Community: Project Setup & Env, God Node: AgriMart Mobile App, AgriMart Mobile App, AI Studio, AI Studio App URL, .env.local, GEMINI_API_KEY, Node.js (+2 more)

### Community 7 - "Live Price Ticker"
Cohesion: 0.25
Nodes (2): dailyPrice(), seededRandom()

### Community 8 - "Cart State Management"
Cohesion: 0.5
Nodes (8): addToCart(), clearCart(), dispatch(), getCart(), getCartCount(), removeFromCart(), saveCart(), updateQty()

### Community 9 - "Auth Screen Logic"
Cohesion: 0.36
Nodes (5): handlePhoto(), next(), set(), submit(), validate()

### Community 10 - "Home Screen"
Cohesion: 0.25
Nodes (0): 

### Community 11 - "Location Picker Modal"
Cohesion: 0.33
Nodes (2): geocode(), upsertCircle()

### Community 12 - "Inventory Management"
Cohesion: 0.48
Nodes (5): handleDelete(), handleSave(), handleToggleActive(), persist(), saveItems()

### Community 13 - "AI Assistant Screen"
Cohesion: 0.47
Nodes (3): handleRetry(), handleSend(), sendQuery()

### Community 14 - "Onboarding Flow"
Cohesion: 0.47
Nodes (3): next(), onTouchEnd(), prev()

### Community 15 - "Profile Screen"
Cohesion: 0.4
Nodes (2): handleAction(), navigateTo()

### Community 16 - "Shop Registration"
Cohesion: 0.67
Nodes (2): handleSubmit(), validate()

### Community 17 - "App Component"
Cohesion: 1.0
Nodes (2): App(), getDirection()

### Community 18 - "Translations & i18n"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Bottom Navigation"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Cart Screen"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Checkout Screen"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Crop Calendar Screen"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Product Details Screen"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Header Component"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Logo Component"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Messages & Enquiry"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "My Listings Screen"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Seller Profile Screen"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Cart Badge Atom"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Pill Button Atom"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Section Reveal Animation"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Stat Card Atom"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Weather Widget"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Add/Edit Item Sheet"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Dukaan Dashboard Tab"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Product Card Molecule"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Demo Components"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Maharashtra Locations Data"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Gemini AI Service"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "App Entry Point"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Service Worker"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Type Definitions"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Dukaan Screen Container"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Explore Screen"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Language Picker"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Location Types"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Searchable Dropdown"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Skeleton Card Atom"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Dukaan Orders Tab"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Dark Hero Section"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Scrolling Ticker Organism"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Animated Hero Section"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Design Token System"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Haptic Utilities"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Price Units Constants"
Cohesion: 1.0
Nodes (1): PRICE_UNITS Array

### Community 57 - "Shop Verification Types"
Cohesion: 1.0
Nodes (1): ShopVerificationStatus Type

## Knowledge Gaps
- **68 isolated node(s):** `PRICE_UNITS Array`, `Seller Interface`, `Category Interface`, `ShopVerificationStatus Type`, `OtpPhone (AuthScreen subview)` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Translations & i18n`** (2 nodes): `getTranslations()`, `constants.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bottom Navigation`** (2 nodes): `BottomNav()`, `BottomNav.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart Screen`** (2 nodes): `handler()`, `CartScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Checkout Screen`** (2 nodes): `handleConfirm()`, `CheckoutScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Crop Calendar Screen`** (2 nodes): `getPhase()`, `CropCalendarScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Details Screen`** (2 nodes): `DetailsScreen()`, `DetailsScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Header Component`** (2 nodes): `Header.tsx`, `onScroll()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Logo Component`** (2 nodes): `Logo.tsx`, `Logo()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Messages & Enquiry`** (2 nodes): `MessagesScreen.tsx`, `formatTime()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `My Listings Screen`** (2 nodes): `MyListingsScreen.tsx`, `loadUserListings()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Seller Profile Screen`** (2 nodes): `SellerProfileScreen.tsx`, `handleEnquiry()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart Badge Atom`** (2 nodes): `CartBadge()`, `CartBadge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pill Button Atom`** (2 nodes): `PillButton.tsx`, `PillButton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Section Reveal Animation`** (2 nodes): `SectionReveal.tsx`, `SectionReveal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Stat Card Atom`** (2 nodes): `StatCard.tsx`, `StatCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Weather Widget`** (2 nodes): `WeatherWidget.tsx`, `weatherIcon()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Add/Edit Item Sheet`** (2 nodes): `AddEditItemSheet()`, `AddEditItemSheet.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dukaan Dashboard Tab`** (2 nodes): `loadInventory()`, `DashboardTab.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Card Molecule`** (2 nodes): `ProductCard.tsx`, `ProductCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Demo Components`** (2 nodes): `DemoOne()`, `demo.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Maharashtra Locations Data`** (2 nodes): `maharashtraLocations.ts`, `getTalukasByDistrict()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Gemini AI Service`** (2 nodes): `getAiMarketAssistance()`, `geminiService.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Entry Point`** (1 nodes): `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Service Worker`** (1 nodes): `sw.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Type Definitions`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dukaan Screen Container`** (1 nodes): `DukaanScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Explore Screen`** (1 nodes): `ExploreScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Language Picker`** (1 nodes): `LanguagePicker.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Location Types`** (1 nodes): `locationTypes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Searchable Dropdown`** (1 nodes): `SearchableDropdown.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skeleton Card Atom`** (1 nodes): `SkeletonCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dukaan Orders Tab`** (1 nodes): `OrdersTab.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dark Hero Section`** (1 nodes): `DarkHeroSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scrolling Ticker Organism`** (1 nodes): `ScrollingTicker.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Animated Hero Section`** (1 nodes): `dynamic-animated-hero-section-with-gradient.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Design Token System`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Haptic Utilities`** (1 nodes): `haptic.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Price Units Constants`** (1 nodes): `PRICE_UNITS Array`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shop Verification Types`** (1 nodes): `ShopVerificationStatus Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Graph Report Document` connect `Graph Report Metadata` to `Project Setup`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `SellerProfileScreen` connect `Product Cards & Ticker UI` to `Onboarding & Registration`, `Dukaan Module Core`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `ProfileScreen` connect `Onboarding & Registration` to `Product Cards & Ticker UI`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `HomeScreen Component` (e.g. with `DetailsScreen Component` and `MessagesScreen Component`) actually correct?**
  _`HomeScreen Component` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Language Enum (11 langs)` (e.g. with `Geolocation + Language Auto-detect` and `TRANSLATIONS Map (11 Languages)`) actually correct?**
  _`Language Enum (11 langs)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `AuthScreen Component` (e.g. with `AssistantScreen Component` and `Auth Gate Logic (onboarded + token check)`) actually correct?**
  _`AuthScreen Component` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PRICE_UNITS Array`, `Seller Interface`, `Category Interface` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._