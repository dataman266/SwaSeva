# Graph Report - e:/Agri_Mart/AgriMart_Android/apps/mobile  (2026-04-27)

## Corpus Check
- 196 files · ~50,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 196 nodes · 191 edges · 52 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Navigation Core|App Navigation Core]]
- [[_COMMUNITY_Sell  Listing Flow|Sell / Listing Flow]]
- [[_COMMUNITY_Farming News Feed|Farming News Feed]]
- [[_COMMUNITY_Live Price Ticker|Live Price Ticker]]
- [[_COMMUNITY_Cart & Checkout State|Cart & Checkout State]]
- [[_COMMUNITY_Multi-Step Form Logic|Multi-Step Form Logic]]
- [[_COMMUNITY_Soybean Product Images|Soybean Product Images]]
- [[_COMMUNITY_Project Setup & Env|Project Setup & Env]]
- [[_COMMUNITY_Location Picker Map|Location Picker Map]]
- [[_COMMUNITY_NPK Fertilizer Product|NPK Fertilizer Product]]
- [[_COMMUNITY_Sugarcane Saplings Product|Sugarcane Saplings Product]]
- [[_COMMUNITY_Home Screen Listings|Home Screen Listings]]
- [[_COMMUNITY_Onboarding Flow|Onboarding Flow]]
- [[_COMMUNITY_Profile Screen|Profile Screen]]
- [[_COMMUNITY_Drip Irrigation Product|Drip Irrigation Product]]
- [[_COMMUNITY_Turmeric Product Image|Turmeric Product Image]]
- [[_COMMUNITY_App Root Entry|App Root Entry]]
- [[_COMMUNITY_Pill Button Atom|Pill Button Atom]]
- [[_COMMUNITY_Section Reveal Atom|Section Reveal Atom]]
- [[_COMMUNITY_Stat Card Atom|Stat Card Atom]]
- [[_COMMUNITY_Gemini AI Service|Gemini AI Service]]
- [[_COMMUNITY_Bottom Navigation|Bottom Navigation]]
- [[_COMMUNITY_Cart Screen|Cart Screen]]
- [[_COMMUNITY_Checkout Screen|Checkout Screen]]
- [[_COMMUNITY_Crop Calendar Screen|Crop Calendar Screen]]
- [[_COMMUNITY_Logo Component|Logo Component]]
- [[_COMMUNITY_Messages Screen|Messages Screen]]
- [[_COMMUNITY_My Listings Screen|My Listings Screen]]
- [[_COMMUNITY_Seller Profile Screen|Seller Profile Screen]]
- [[_COMMUNITY_Cart Badge Atom|Cart Badge Atom]]
- [[_COMMUNITY_Weather Widget|Weather Widget]]
- [[_COMMUNITY_Demo Component|Demo Component]]
- [[_COMMUNITY_Maharashtra Locations Data|Maharashtra Locations Data]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]
- [[_COMMUNITY_Service Worker|Service Worker]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Orders Screen|Orders Screen]]
- [[_COMMUNITY_Profile Screen Alt|Profile Screen Alt]]
- [[_COMMUNITY_Dark Hero Section|Dark Hero Section]]
- [[_COMMUNITY_Scrolling Ticker|Scrolling Ticker]]
- [[_COMMUNITY_Theme Tokens|Theme Tokens]]
- [[_COMMUNITY_App Types|App Types]]
- [[_COMMUNITY_Constants & Products|Constants & Products]]
- [[_COMMUNITY_Vite Config Alt|Vite Config Alt]]
- [[_COMMUNITY_Explore Screen|Explore Screen]]
- [[_COMMUNITY_Location Types|Location Types]]
- [[_COMMUNITY_Searchable Dropdown|Searchable Dropdown]]
- [[_COMMUNITY_Skeleton Card Atom|Skeleton Card Atom]]
- [[_COMMUNITY_Dark Hero Section Alt|Dark Hero Section Alt]]
- [[_COMMUNITY_Animated Hero UI|Animated Hero UI]]
- [[_COMMUNITY_Mobile Theme|Mobile Theme]]
- [[_COMMUNITY_Haptic Utils|Haptic Utils]]

## God Nodes (most connected - your core abstractions)
1. `saveCart()` - 6 edges
2. `NPK 19:19:19 Fertilizer` - 6 edges
3. `Soybean Product Photo` - 6 edges
4. `Sugarcane Saplings` - 6 edges
5. `AgriMart Mobile App` - 5 edges
6. `getCart()` - 5 edges
7. `Drip Irrigation Kit` - 5 edges
8. `loadNews()` - 4 edges
9. `removeFromCart()` - 4 edges
10. `updateQty()` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "App Navigation Core"
Cohesion: 0.09
Nodes (8): changeScreen(), handleRetry(), handleSend(), sendQuery(), DetailsScreen(), onScroll(), toggleSelect(), ProductCard()

### Community 1 - "Sell / Listing Flow"
Cohesion: 0.2
Nodes (3): handlePhotoChange(), handlePublish(), processMedia()

### Community 2 - "Farming News Feed"
Cohesion: 0.29
Nodes (7): buildStaticNews(), daysAgo(), fetchOneFeed(), fetchWithTimeout(), loadNews(), relativeDate(), writeCache()

### Community 3 - "Live Price Ticker"
Cohesion: 0.25
Nodes (2): dailyPrice(), seededRandom()

### Community 4 - "Cart & Checkout State"
Cohesion: 0.5
Nodes (8): addToCart(), clearCart(), dispatch(), getCart(), getCartCount(), removeFromCart(), saveCart(), updateQty()

### Community 5 - "Multi-Step Form Logic"
Cohesion: 0.36
Nodes (5): handlePhoto(), next(), set(), submit(), validate()

### Community 6 - "Soybean Product Images"
Cohesion: 0.5
Nodes (8): AgriMart Marketplace, Pulses & Oilseeds Category, Soybean (Crop), Farmer Holding Soybeans, Soybean Field with Irrigation, Soybean Grains (Harvested), Soybean Product Photo, Jute Sack of Soybeans

### Community 7 - "Project Setup & Env"
Cohesion: 0.29
Nodes (7): AgriMart Mobile App, AI Studio, .env.local, GEMINI_API_KEY, Node.js, npm install, npm run dev

### Community 8 - "Location Picker Map"
Cohesion: 0.33
Nodes (2): geocode(), upsertCircle()

### Community 9 - "NPK Fertilizer Product"
Cohesion: 0.33
Nodes (7): Fertilizer, Water-Soluble Powder Form, Nitrogen (N), Phosphorus (P), Potassium (K), NPK 19:19:19 Fertilizer, Crop Nutrition / Agri Input

### Community 10 - "Sugarcane Saplings Product"
Cohesion: 0.38
Nodes (7): Seedlings / Planting Material Category, Sugarcane Crop, Sugarcane Saplings Product Photo, Maharashtra Sugarcane Farming Context, Sugarcane Saplings, Propagation Tray / Seedling Tray, Field Transplanting Use Case

### Community 11 - "Home Screen Listings"
Cohesion: 0.33
Nodes (0): 

### Community 12 - "Onboarding Flow"
Cohesion: 0.47
Nodes (3): next(), onTouchEnd(), prev()

### Community 13 - "Profile Screen"
Cohesion: 0.4
Nodes (2): handleAction(), navigateTo()

### Community 14 - "Drip Irrigation Product"
Cohesion: 0.47
Nodes (6): Agricultural Irrigation Equipment, Barbed T-Connector Fitting, Adjustable Drip Emitter, Drip Irrigation Kit, Precision Micro-Irrigation for Crops, Flow Control Valve

### Community 15 - "Turmeric Product Image"
Cohesion: 0.67
Nodes (4): Agricultural Produce, Product Listing Image (Turmeric), Spices & Condiments Category, Fresh Turmeric Root

### Community 16 - "App Root Entry"
Cohesion: 1.0
Nodes (2): App(), getDirection()

### Community 17 - "Pill Button Atom"
Cohesion: 0.67
Nodes (1): PillButton()

### Community 18 - "Section Reveal Atom"
Cohesion: 0.67
Nodes (1): SectionReveal()

### Community 19 - "Stat Card Atom"
Cohesion: 0.67
Nodes (1): StatCard()

### Community 20 - "Gemini AI Service"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Bottom Navigation"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Cart Screen"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Checkout Screen"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Crop Calendar Screen"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Logo Component"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Messages Screen"
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

### Community 30 - "Weather Widget"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Demo Component"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Maharashtra Locations Data"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "App Entry Point"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Service Worker"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Orders Screen"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Profile Screen Alt"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Dark Hero Section"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Scrolling Ticker"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Theme Tokens"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "App Types"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Constants & Products"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Vite Config Alt"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Explore Screen"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Location Types"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Searchable Dropdown"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Skeleton Card Atom"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Dark Hero Section Alt"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Animated Hero UI"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Mobile Theme"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Haptic Utils"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **14 isolated node(s):** `AI Studio`, `Node.js`, `.env.local`, `npm install`, `npm run dev` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Gemini AI Service`** (2 nodes): `getAiMarketAssistance()`, `geminiService.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bottom Navigation`** (2 nodes): `BottomNav()`, `BottomNav.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart Screen`** (2 nodes): `handler()`, `CartScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Checkout Screen`** (2 nodes): `handleConfirm()`, `CheckoutScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Crop Calendar Screen`** (2 nodes): `getPhase()`, `CropCalendarScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Logo Component`** (2 nodes): `Logo.tsx`, `Logo()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Messages Screen`** (2 nodes): `MessagesScreen.tsx`, `formatTime()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `My Listings Screen`** (2 nodes): `MyListingsScreen.tsx`, `loadUserListings()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Seller Profile Screen`** (2 nodes): `SellerProfileScreen.tsx`, `handleEnquiry()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart Badge Atom`** (2 nodes): `CartBadge()`, `CartBadge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Weather Widget`** (2 nodes): `WeatherWidget.tsx`, `weatherIcon()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Demo Component`** (2 nodes): `DemoOne()`, `demo.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Maharashtra Locations Data`** (2 nodes): `maharashtraLocations.ts`, `getTalukasByDistrict()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Entry Point`** (1 nodes): `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Service Worker`** (1 nodes): `sw.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Orders Screen`** (1 nodes): `OrdersScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Profile Screen Alt`** (1 nodes): `ProfileScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dark Hero Section`** (1 nodes): `DarkHeroSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scrolling Ticker`** (1 nodes): `ScrollingTicker.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme Tokens`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Types`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Constants & Products`** (1 nodes): `constants.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config Alt`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Explore Screen`** (1 nodes): `ExploreScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Location Types`** (1 nodes): `locationTypes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Searchable Dropdown`** (1 nodes): `SearchableDropdown.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skeleton Card Atom`** (1 nodes): `SkeletonCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dark Hero Section Alt`** (1 nodes): `DarkHeroSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Animated Hero UI`** (1 nodes): `dynamic-animated-hero-section-with-gradient.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mobile Theme`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Haptic Utils`** (1 nodes): `haptic.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toggleSelect()` connect `App Navigation Core` to `Home Screen Listings`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `changeScreen()` connect `App Navigation Core` to `App Root Entry`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `NPK 19:19:19 Fertilizer` (e.g. with `Water-Soluble Powder Form` and `Crop Nutrition / Agri Input`) actually correct?**
  _`NPK 19:19:19 Fertilizer` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Sugarcane Saplings` (e.g. with `Field Transplanting Use Case` and `Maharashtra Sugarcane Farming Context`) actually correct?**
  _`Sugarcane Saplings` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AI Studio`, `Node.js`, `.env.local` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Navigation Core` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._