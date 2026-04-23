# filamentcalcs.com — Implementation Plan

**Date:** 2026-04-23
**Based on:** `docs/2026-04-23-filamentcalcs-design.md`
**Build order:** Phased — ship working core before polish, verify each phase before moving on.

---

## Overall Strategy

Build in 4 phases, each independently shippable. Phase 1 gets us a deployable MVP with 1 tool working end-to-end. Phase 2-4 expand horizontally (more tools, more content). This de-risks the project — if something breaks, we have working code to fall back on.

**Verification gate between phases:** Each phase ends with a working build + local preview Matthew can click through. Only proceed to next phase after confirming current phase works.

---

## Phase 0: Project Scaffolding (Claude, ~30 min)

**Goal:** Empty but runnable Next.js project at `F:/Projects/filamentcalcs/`.

### Steps

1. **Initialize Next.js project**
   ```bash
   cd F:/Projects/filamentcalcs
   npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*"
   ```

2. **Install additional dependencies**
   ```bash
   npm install class-variance-authority clsx tailwind-merge lucide-react
   npm install @radix-ui/react-slider @radix-ui/react-select @radix-ui/react-dropdown-menu
   npm install @radix-ui/react-accordion @radix-ui/react-tabs @radix-ui/react-tooltip
   npm install next-themes
   ```

3. **Set up shadcn/ui**
   ```bash
   npx shadcn@latest init
   # When prompted: Default style, Slate base color, CSS variables YES
   ```

4. **Create folder structure**
   ```
   src/
     app/
       (marketing)/            # Grouped route for home + about
         page.tsx              # Homepage
         about/page.tsx
       tools/
         filament-cost-calculator/page.tsx
         print-time-estimator/page.tsx
         material-comparison/page.tsx
         electricity-cost-calculator/page.tsx
         failure-rate-calculator/page.tsx
       guides/
         [slug]/page.tsx       # Dynamic MDX guide pages
       privacy/page.tsx
       terms/page.tsx
       contact/page.tsx
       layout.tsx              # Root layout (theme provider, fonts, nav)
       globals.css
       sitemap.ts              # Auto-generated sitemap
       robots.ts               # robots.txt
     components/
       ui/                     # shadcn/ui components (added via CLI)
       calculators/            # Our custom calculator components
       layout/                 # Header, footer, nav
       shared/                 # Reusable components (CalculatorCard, FormulaBreakdown, etc.)
     lib/
       formulas/               # Pure math functions (testable)
         filamentCost.ts
         printTime.ts
         materialCompare.ts
         electricityCost.ts
         failureRate.ts
       presets/                # Printer presets, material defaults, etc.
         printers.ts
         materials.ts
         electricityRates.ts
       utils.ts                # shadcn utility fns (cn, etc.)
     content/
       guides/                 # MDX files for guide articles
         *.mdx
   public/
     favicon.ico
     og-image.png              # Social share image (created later)
   ```

5. **Verify it runs**
   ```bash
   npm run dev
   ```
   Should open `http://localhost:3000` showing default Next.js welcome page.

**Phase 0 gate:** Matthew opens `http://localhost:3000` in browser, sees default Next.js page, confirms it's running.

---

## Phase 1: Core Calculator MVP (Claude, ~6-8 hrs)

**Goal:** Ship ONE fully-working calculator with complete supporting infrastructure (theme system, layout, nav). Gets the full end-to-end pipeline working before scaling to 5.

### 1.1 Theme + Layout Foundation

- [ ] Configure fonts (Inter + JetBrains Mono via `next/font`)
- [ ] Set up `next-themes` for dark/light toggle with system default
- [ ] Build root layout (`src/app/layout.tsx`):
  - `<html>` with theme class
  - `<body>` with font variables
  - Include `<ThemeProvider>` wrapper
- [ ] Build site header component (`components/layout/Header.tsx`):
  - Logo/sitename on left
  - Navigation: Tools dropdown, Guides, About
  - Theme toggle on right (sun/moon icon)
- [ ] Build site footer component (`components/layout/Footer.tsx`):
  - Legal links (Privacy, Terms, Contact)
  - Copyright
  - Note: "Not affiliated with any printer manufacturer"
- [ ] Add global CSS tokens in `globals.css`:
  - CSS custom properties for colors (light/dark variants)
  - Base typography scale

### 1.2 Shared Calculator Components

- [ ] `components/shared/CalculatorCard.tsx` — wrapper with title, description, inputs, result
- [ ] `components/shared/InputWithUnit.tsx` — number input + unit dropdown (grams/oz, USD/EUR, etc.)
- [ ] `components/shared/ResultDisplay.tsx` — animated result card with copy-value button
- [ ] `components/shared/FormulaBreakdown.tsx` — collapsible accordion showing the math
- [ ] `components/shared/PrinterPresetSelect.tsx` — dropdown with common printers + Custom
- [ ] `components/shared/ShareButton.tsx` — copy URL with state encoded in query params
- [ ] `components/shared/AdSlot.tsx` — placeholder div for AdSense (activated post-approval)

### 1.3 First Calculator: Filament Cost

- [ ] `lib/formulas/filamentCost.ts` — pure function with unit tests
  ```ts
  export function calculateFilamentCost({
    gramsUsed: number,
    pricePerKg: number,
    wasteFactor: number, // 0.05 = 5%
  }): number
  ```
- [ ] `lib/presets/materials.ts` — PLA/PETG/ABS/TPU defaults (price, waste)
- [ ] `app/tools/filament-cost-calculator/page.tsx` — the tool page:
  - Page metadata (title, description, OG image)
  - Calculator UI (InputWithUnit × 3, material preset dropdown)
  - Live-updating result
  - Formula breakdown accordion
  - FAQ section (3-5 common questions, schema.org FAQPage markup)
  - "How this works" callout
  - Placeholder ad slots (3 positions)
- [ ] URL state encoding — inputs persist in query params for sharing

### 1.4 Homepage (MVP version)

- [ ] `app/(marketing)/page.tsx`:
  - Hero section: "Free 3D printing calculators for hobbyists"
  - Grid of calculator cards (5 slots, only 1 working in Phase 1 — rest say "Coming soon")
  - Short about-the-site section
  - Link to guides (empty for now)

### 1.5 Legal Pages (skeleton)

- [ ] `app/privacy/page.tsx` — privacy policy template, customized for our case
- [ ] `app/terms/page.tsx` — terms of service template
- [ ] `app/contact/page.tsx` — simple mailto: link for now

### 1.6 Technical SEO Foundation

- [ ] `app/sitemap.ts` — auto-generated sitemap
- [ ] `app/robots.ts` — robots.txt
- [ ] `app/(marketing)/page.tsx` — JSON-LD for WebSite schema
- [ ] Each tool page — JSON-LD for SoftwareApplication schema

**Phase 1 gate:** Matthew opens `http://localhost:3000`, navigates to the Filament Cost Calculator, plugs in test values (500g, $20/kg, 5%), verifies result is correct ($10.50), shares URL, pastes in new tab, sees state restored.

---

## Phase 2: Remaining 4 Calculators (Claude, ~4-6 hrs)

**Goal:** Build the other 4 launch calculators using Phase 1 infrastructure. Each follows the same pattern (formula → tool page → share URL → tests).

### 2.1 Print Time Estimator
- [ ] `lib/formulas/printTime.ts`
- [ ] `lib/presets/printers.ts` (throughput by printer class)
- [ ] `app/tools/print-time-estimator/page.tsx`

### 2.2 Material Comparison
- [ ] `lib/presets/materials.ts` (expand with full spec table)
- [ ] `app/tools/material-comparison/page.tsx`
- [ ] "Best for your use case" quiz component

### 2.3 Electricity Cost Calculator
- [ ] `lib/formulas/electricityCost.ts`
- [ ] `lib/presets/electricityRates.ts` (US states + EU/UK defaults)
- [ ] `lib/presets/printers.ts` (expand with wattage)
- [ ] `app/tools/electricity-cost-calculator/page.tsx`

### 2.4 Failure Rate Calculator
- [ ] `lib/formulas/failureRate.ts`
- [ ] `app/tools/failure-rate-calculator/page.tsx`
- [ ] Benchmark comparison logic ("Your 12% is typical for hobbyist")

### 2.5 Homepage Update
- [ ] Remove "Coming soon" labels, activate all 5 calculator cards
- [ ] Update metadata to reflect full tool suite

**Phase 2 gate:** All 5 calculators working on localhost. Matthew QAs each one with test values.

---

## Phase 3: Content + Polish (Claude, ~6-10 hrs)

**Goal:** Write 10-12 guide articles to satisfy AdSense's substantive-content requirement and build topical authority.

### 3.1 MDX Content System
- [ ] Install `@next/mdx` and related packages
- [ ] Configure MDX with syntax highlighting (rehype-pretty-code)
- [ ] `app/guides/[slug]/page.tsx` — dynamic route for MDX files
- [ ] `app/guides/page.tsx` — index page listing all guides

### 3.2 Launch Article Set (10-12 articles, ~1200-1800 words each)
Per the research:
1. "How much does it really cost to 3D print? Full breakdown 2026"
2. "PLA vs PETG vs ABS vs TPU: which filament should you pick?"
3. "Is 3D printing worth it? True cost of owning a Bambu/Prusa/Ender"
4. "Why does my 3D print keep failing? 12 fixes ranked by frequency"
5. "How to read your 3D printer's power bill"
6. "How long does a 3D print take? Realistic times by printer"
7. "Best filament brands 2026: tested value per kg"
8. "How to dry filament (and why it matters for PETG/TPU)"
9. "First 10 things to print on a new 3D printer"
10. "When to use 10% vs 50% vs 100% infill"
11. "How to price 3D prints you sell on Etsy"
12. "How much electricity does a 3D printer actually use?"

Each article:
- Targets specific long-tail keywords
- Includes at least 2 internal links to our calculators
- Has FAQ section with schema.org markup
- Includes "Last updated" date
- Cited sources (Prusa docs, Bambu wiki, community forums)

### 3.3 Polish Pass
- [ ] Loading states on all calculators (brief delay shows "Calculating..." polish)
- [ ] Error handling on invalid inputs (friendly messages, not stack traces)
- [ ] Mobile responsive audit (open on phone emulator, verify all tools work)
- [ ] Accessibility audit (keyboard nav, screen reader labels, ARIA)
- [ ] Open Graph images for social sharing
- [ ] Lighthouse audit (target 95+ on all metrics)

**Phase 3 gate:** Matthew navigates to guides, reads 2-3 articles, confirms they're genuinely useful (not AI slop), calculators work on his phone.

---

## Phase 4: Deploy + Launch (Us both, ~2 hrs)

**Goal:** Site live at filamentcalcs.com.

### 4.1 GitHub Setup
- [ ] Matthew creates GitHub account (if needed)
- [ ] I create local git repo
- [ ] I push to Matthew's new GitHub repo

### 4.2 Vercel Deployment
- [ ] Matthew creates Vercel account (free)
- [ ] Matthew connects Vercel to GitHub
- [ ] Import filamentcalcs repo to Vercel
- [ ] Vercel auto-deploys on every push to main branch
- [ ] Site live at `filamentcalcs.vercel.app`

### 4.3 Domain Configuration
- [ ] Matthew logs into Namecheap
- [ ] Change DNS: set A record to `76.76.21.21` (Vercel's IP) + CNAME for `www`
  - OR change nameservers to Vercel's (simpler)
- [ ] Wait 0-24 hours for DNS propagation
- [ ] Verify HTTPS auto-provisions (Vercel handles this)
- [ ] Site live at `https://filamentcalcs.com`

### 4.4 Search Console + Analytics
- [ ] Matthew adds site to Google Search Console
- [ ] Verify ownership (I add verification meta tag to layout)
- [ ] Submit sitemap
- [ ] Matthew creates GA4 property
- [ ] I add GA4 tracking code to layout
- [ ] Verify analytics start recording

### 4.5 AdSense Application
- [ ] Matthew signs up for AdSense at adsense.google.com
- [ ] Fill out tax info, payment details
- [ ] I add AdSense verification script to layout
- [ ] Submit site for review
- [ ] Wait 1-7 days for approval
- [ ] Upon approval, activate ad slots (switch placeholder divs to live ads)

### 4.6 Community Promotion (Matthew, ongoing)
- [ ] Share on r/3Dprinting "Share Your Site" weekend thread
- [ ] Post on r/BambuLab for AMS calculator (when shipped in Phase 2 of Phase 2)
- [ ] Optional: brief mention in a future SSS anime video if any tie-in makes sense (unlikely but free cross-pollination)

**Phase 4 gate:** filamentcalcs.com resolves in browser, shows live site, Search Console starts reporting impressions.

---

## Phase 5: AMS Purge Waste Calculator (Claude, ~3-4 hrs, post-launch)

**Goal:** Build the differentiator tool after core site is live and indexed.

### 5.1 AMS Purge Calculator
- [ ] Research canonical AMS purge amounts (Bambu docs, community testing)
- [ ] `lib/formulas/amsPurgeWaste.ts`
- [ ] `app/tools/ams-purge-waste-calculator/page.tsx`
- [ ] Compare to "painting cost equivalent" framing
- [ ] Write 2 supporting guide articles:
  - "How much filament does Bambu AMS actually waste?"
  - "Is multi-color Bambu AMS worth it? Real math"

### 5.2 Promotion
- [ ] Post launch thread on r/BambuLab — "I built a free AMS purge waste calculator because I was tired of guessing"
- [ ] Update homepage to feature the tool prominently

**Phase 5 gate:** Tool ranks for "Bambu AMS purge waste" within 60 days.

---

## Phase 6+: Ongoing (post-launch, as traction warrants)

If traffic and AdSense earnings justify:
- Additional calculators (infill comparison, nozzle size helper, print cost break-even for Etsy sellers)
- More guide articles
- Newsletter (if Matthew wants to invest audience-building time)
- Affiliate links to filament retailers (Polymaker, Prusament, etc.)

If NO traction by month 9:
- Cease development
- Turn off Namecheap auto-renewal
- Let domain lapse in April 2027
- Document lessons learned

---

## Rollback Plan

If something breaks in production:
1. Vercel has instant rollback — click "Promote previous deployment" in dashboard
2. Git history preserves every change — can revert specific commits
3. Local dev environment always available for testing fixes before redeploying

Low risk because:
- No database (no state migrations to worry about)
- No user accounts (no logged-in users affected by downtime)
- Static pages (Vercel can serve from cache even if deployment fails)

---

## Time Budget Summary

| Phase | Claude time | Matthew time | Total elapsed time |
|---|---|---|---|
| 0. Scaffolding | 30 min | 5 min (verify local runs) | Day 1 |
| 1. Core MVP | 6-8 hrs | 30 min (QA) | Day 2-3 |
| 2. Other 4 calcs | 4-6 hrs | 30 min (QA) | Day 4-5 |
| 3. Content + polish | 6-10 hrs | 1 hr (review articles) | Day 6-9 |
| 4. Deploy + launch | 2 hrs | 1 hr (accounts + verify) | Day 10-11 |
| 5. AMS calculator | 3-4 hrs | 20 min (QA) | Day 12-14 |
| **Total** | **22-30 hrs** | **3-4 hrs** | **~2 weeks** |

---

## Critical Success Factors

1. **Formulas are correct** — triple-check, cite sources, include disclaimers. A single wrong calculation tanks trust forever.
2. **Mobile UX is perfect** — target audience uses phones for quick lookups.
3. **Fast page loads** — Vercel static + Core Web Vitals optimization. Slow sites don't rank.
4. **Substantive content at launch** — AdSense review requires real content, not just tools.
5. **Decision discipline at month 9** — if traction isn't there, don't throw good time after bad.

---

## Out of Scope (explicit non-goals for this plan)

- Backend / database
- User authentication
- Payment processing
- Mobile native app
- Multi-language support
- Affiliate network beyond AdSense
- Newsletter or email capture
- Community / forum features

These are explicitly NOT in this plan. Adding them later is fine if traffic justifies, but building them now is scope creep that delays launch and increases risk.

---

## Next Action

Phase 0: scaffolding. Starting immediately after this plan is written to disk.
