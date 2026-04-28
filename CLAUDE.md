# AgriMart — Claude Code Context

## What This Is
B2B agri-marketplace for Indian farmers (Maharashtra focus). Farmers list produce, buyers purchase direct — no middlemen. Primary languages: English + Marathi. Secondary: Hindi, Kannada.

## Monorepo Layout
```
e:/Agri_Mart/AgriMart_Android/
├── apps/mobile/          ← Vite + React 19 + TypeScript + Tailwind CDN + Capacitor
├── apps/backend/         ← NestJS + Prisma + JWT (early stage)
├── vercel.json           ← buildCommand: "npm run build -w apps/mobile", outputDirectory: "apps/mobile/dist"
└── package.json          ← workspaces: ["apps/*", "packages/*"]
```

## Mobile App: Key Files
```
apps/mobile/
├── App.tsx               ← root: AnimatePresence screen transitions, geolocation, lang state
├── types.ts              ← AppScreen | AppState | Product | Seller | Category | Language enum
├── constants.tsx         ← PRODUCTS[], CATEGORIES[], TRANSLATIONS{en,mr}
├── index.html            ← Tailwind CDN config with brand tokens, Inter font, global keyframes
├── theme/index.ts        ← design token constants (colors, typography, spacing)
├── services/
│   └── geminiService.ts  ← getAiMarketAssistance() — Gemini API call
└── components/
    ├── atoms/
    │   ├── PillButton.tsx     ← motion.button, variants: dark|light|outline, sizes: sm|md|lg
    │   ├── SectionReveal.tsx  ← motion.div whileInView fade-up, props: delay(ms), threshold
    │   └── StatCard.tsx       ← oversized stat number + label
    ├── molecules/
    │   └── ProductCard.tsx    ← full-bleed image, staggered reveal, check-select button
    ├── organisms/
    │   ├── DarkHeroSection.tsx   ← full-height hero, bg image + gradient overlay
    │   └── ScrollingTicker.tsx   ← CSS ticker loop, AGRI_TICKER_ITEMS + PARTNER_TICKER_ITEMS
    ├── Header.tsx             ← scroll-aware transparent→blur transition, lang toggle
    ├── BottomNav.tsx          ← pill active indicator, 5 tabs
    ├── HomeScreen.tsx         ← hero → ticker → stats → search+chips → ProductCards → AI FAB
    ├── DetailsScreen.tsx      ← ken-burns hero, seller card, transport options, sticky CTA
    ├── SellScreen.tsx         ← 3-step form: category → photo+pricing → trust+publish
    ├── OrdersScreen.tsx       ← mock orders, status badges (pending|transit|delivered)
    ├── ProfileScreen.tsx      ← identity card, stats strip, menu list
    ├── AssistantScreen.tsx    ← Gemini chat, typing indicator, mic button
    └── OnboardingScreen.tsx   ← 3 slides, AnimatePresence swipe, dot pagination, dual CTA
```

## AppScreen Type
`'HOME' | 'DETAILS' | 'SELL' | 'ORDERS' | 'PROFILE' | 'ASSISTANT' | 'ONBOARDING'`

First launch → ONBOARDING (localStorage key: `agrimart_onboarded`). Header + BottomNav hidden during ONBOARDING.

## Design System (FarmMinerals language)
| Token | Value | Usage |
|---|---|---|
| brandDark | `#0A1A0A` | page background |
| brandCream | `#F5F0E8` | primary text |
| brandGreen | `#2D5A1B` | CTA backgrounds, user bubbles |
| brandBeige | `#D4C4A0` | accents, dot decorators |
| surfaceDark | `#111C11` | cards, nav |
| surfaceMid | `#1A2D1A` | hover states |

Typography: Inter 300–500, `letter-spacing: -0.02em` on headings, `clamp()` for responsive sizes.

CSS classes (defined in index.html): `.reveal-hidden`, `.reveal-visible`, `.pill-dot`, `.glass-card`, `.nav-blur`, `.pb-safe`, `.pt-safe`, `.ticker-track`, `.ticker-track-r`

## Animation Library
`motion` v12 (from `motion/react`). Used in:
- `App.tsx` — `AnimatePresence` directional screen transitions (28ms, `[0.32,0,0.16,1]`)
- `SectionReveal.tsx` — `whileInView` fade-up
- `PillButton.tsx` — `whileTap` + `whileHover` spring (`stiffness:400, damping:22`)
- `OnboardingScreen.tsx` — bg crossfade + content slide per swipe direction

## Build Commands
```bash
# from repo root
npm run dev:mobile       # dev server (apps/mobile)
npm run build:mobile     # production build → apps/mobile/dist/

# from apps/mobile/
npx tsc --noEmit         # type check
npx vite build           # build
```

## Key Constraints
- **No Expo RN** — staying with Capacitor. Same codebase works for Android + iOS.
- **No browser-only APIs** without a Capacitor plugin fallback.
- **Tailwind via CDN** — no PostCSS build step. Use inline `style={}` for values not in Tailwind.
- **i18n pattern**: every string has `en` and `mr` variants. Check `TRANSLATIONS` in constants.tsx.
- **`as const`** on bezier arrays passed to motion `ease` prop (TypeScript strictness).

## Knowledge Graph
`apps/mobile/graphify-out/graph.html` — interactive, open in browser. 61 nodes, 21 communities.
God nodes: `HomeScreen.tsx`, `App.tsx`, `constants.tsx`

## What NOT to Do
- Don't read `App.tsx` / `types.ts` / `theme/index.ts` just to understand the architecture — this file covers it.
- Don't add `divideColor` to inline `style={}` props — it's not a valid CSS property, use Tailwind `divide-[color]` class instead.
- Don't import from `'framer-motion'` — the package is `motion`, import from `'motion/react'`.


Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.
2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.