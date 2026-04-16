# Graph Report - apps/mobile  (2026-04-16)

## Corpus Check
- 25 files · ~8,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 61 nodes · 49 edges · 21 communities detected
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Screen Components & Data|Screen Components & Data]]
- [[_COMMUNITY_App Setup & Gemini Config|App Setup & Gemini Config]]
- [[_COMMUNITY_Onboarding Flow|Onboarding Flow]]
- [[_COMMUNITY_Sell Listing Flow|Sell Listing Flow]]
- [[_COMMUNITY_AI Assistant Chat|AI Assistant Chat]]
- [[_COMMUNITY_Screen Navigation|Screen Navigation]]
- [[_COMMUNITY_Product Detail View|Product Detail View]]
- [[_COMMUNITY_PillButton Atom|PillButton Atom]]
- [[_COMMUNITY_SectionReveal Atom|SectionReveal Atom]]
- [[_COMMUNITY_StatCard Atom|StatCard Atom]]
- [[_COMMUNITY_Gemini AI Service|Gemini AI Service]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]
- [[_COMMUNITY_Service Worker|Service Worker]]
- [[_COMMUNITY_Vite Build Config|Vite Build Config]]
- [[_COMMUNITY_Orders Screen|Orders Screen]]
- [[_COMMUNITY_Profile Screen A|Profile Screen A]]
- [[_COMMUNITY_Hero Section Organism|Hero Section Organism]]
- [[_COMMUNITY_Scrolling Ticker Organism|Scrolling Ticker Organism]]
- [[_COMMUNITY_Design Token Theme|Design Token Theme]]
- [[_COMMUNITY_Type Definitions|Type Definitions]]
- [[_COMMUNITY_Profile Screen B|Profile Screen B]]

## God Nodes (most connected - your core abstractions)
1. `AgriMart Mobile App` - 5 edges
2. `onTouchEnd()` - 3 edges
3. `changeScreen()` - 2 edges
4. `DetailsScreen()` - 2 edges
5. `handlePublish()` - 2 edges
6. `PillButton()` - 2 edges
7. `SectionReveal()` - 2 edges
8. `next()` - 2 edges
9. `prev()` - 2 edges
10. `GEMINI_API_KEY` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Screen Components & Data"
Cohesion: 0.2
Nodes (0): 

### Community 1 - "App Setup & Gemini Config"
Cohesion: 0.29
Nodes (7): AgriMart Mobile App, AI Studio, .env.local, GEMINI_API_KEY, Node.js, npm install, npm run dev

### Community 2 - "Onboarding Flow"
Cohesion: 0.47
Nodes (3): next(), onTouchEnd(), prev()

### Community 3 - "Sell Listing Flow"
Cohesion: 0.4
Nodes (1): handlePublish()

### Community 4 - "AI Assistant Chat"
Cohesion: 0.5
Nodes (0): 

### Community 5 - "Screen Navigation"
Cohesion: 0.5
Nodes (1): changeScreen()

### Community 6 - "Product Detail View"
Cohesion: 0.67
Nodes (1): DetailsScreen()

### Community 7 - "PillButton Atom"
Cohesion: 0.67
Nodes (1): PillButton()

### Community 8 - "SectionReveal Atom"
Cohesion: 0.67
Nodes (1): SectionReveal()

### Community 9 - "StatCard Atom"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Gemini AI Service"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "App Entry Point"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Service Worker"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Vite Build Config"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Orders Screen"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Profile Screen A"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Hero Section Organism"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Scrolling Ticker Organism"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Design Token Theme"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Type Definitions"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Profile Screen B"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **5 isolated node(s):** `AI Studio`, `Node.js`, `.env.local`, `npm install`, `npm run dev`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `StatCard Atom`** (2 nodes): `StatCard.tsx`, `StatCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Gemini AI Service`** (2 nodes): `getAiMarketAssistance()`, `geminiService.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Entry Point`** (1 nodes): `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Service Worker`** (1 nodes): `sw.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Build Config`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Orders Screen`** (1 nodes): `OrdersScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Profile Screen A`** (1 nodes): `ProfileScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Hero Section Organism`** (1 nodes): `DarkHeroSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scrolling Ticker Organism`** (1 nodes): `ScrollingTicker.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Design Token Theme`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Type Definitions`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Profile Screen B`** (1 nodes): `ProfileScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `AI Studio`, `Node.js`, `.env.local` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._