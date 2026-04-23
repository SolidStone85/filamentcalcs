# filamentcalcs.com — Design Spec

**Date:** 2026-04-23
**Owner:** Matthew Carvalho
**Status:** Approved, ready for implementation planning
**Goal:** Build a niche utility website offering 3D printing calculators and guides, monetized via Google AdSense, targeting 3D printing hobbyists. Realistic 12-month revenue target: $200-400/mo passive.

---

## 1. Overview

### Project thesis
3D printing hobbyist calculators are underserved by modern web tools. Existing competitors (Prusa's calc, Omnicalculator, Printpal, etc.) either lock features behind apps, have dated UX, or don't cover the highest-pain-point gaps (like Bambu AMS purge waste). A mobile-first, fast, modern suite of calculators with clean UI and shareable URL state can capture meaningful long-tail search traffic.

### Target audience
- Hobbyist FDM 3D printer owners (Bambu Lab, Prusa, Ender, Creality)
- Tech-savvy enough to Google "filament cost calculator" but not developers
- Want instant answers, not app downloads
- Share results in Reddit threads and Discord servers

### Success criteria (12 months post-launch)
- Google indexing confirmed in Search Console
- 10K+ monthly impressions in Search Console
- 3K+ monthly page views
- AdSense approved
- $100+/month in AdSense revenue (stretch: $300+)

### Decision checkpoint
Month 9-10 (Jan-Feb 2027) — evaluate traffic and revenue. If zero indexing, turn off domain auto-renewal. If traction, expand with more tools and content.

---

## 2. Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Best-in-class React framework, static export, SEO-friendly, free on Vercel |
| Language | **TypeScript** | Type safety for calculator math, fewer runtime bugs |
| Styling | **Tailwind CSS** | Utility-first, fast, consistent, dark-mode native |
| Components | **shadcn/ui** (Radix primitives) | Accessible, customizable, modern defaults |
| Deployment | **Vercel (free tier)** | Zero-config Next.js hosting, auto-SSL, fast global CDN |
| Analytics | **Google Analytics 4 + Search Console** | Free, standard, informs SEO decisions |
| Ads | **Google AdSense** | Target monetization path |
| Fonts | **Inter** (UI) + **JetBrains Mono** (numerical values) | Free via next/font, solid readability |

### Deliberate non-choices
- ❌ **No database / backend** — all calculators are client-side math. No user accounts, no saved data, no server costs. If site ever needs backend features (saved calcs, user profiles), add later.
- ❌ **No WordPress** — Next.js static pages outperform WordPress on Core Web Vitals, which is critical for SEO ranking.
- ❌ **No CMS** — MDX files in repo for content pages. Simpler, faster, versioned with code.
- ❌ **No third-party ad networks beyond AdSense** — Ezoic, Mediavine, etc. require higher traffic thresholds. AdSense first.

---

## 3. Site Structure

```
/                                   # Homepage: value prop + links to all tools
/tools/filament-cost-calculator     # Tool 1
/tools/print-time-estimator         # Tool 2
/tools/material-comparison          # Tool 3
/tools/electricity-cost-calculator  # Tool 4
/tools/failure-rate-calculator      # Tool 5
/tools/ams-purge-waste-calculator   # Tool 6 (differentiator, ships Phase 2)
/guides/[slug]                      # 10-12 guide articles (MDX)
/about                              # About the site
/privacy                            # Privacy policy (AdSense requirement)
/terms                              # Terms of service (AdSense requirement)
/contact                            # Contact form (simple mailto: link for v1)
```

### URL structure rationale
- `/tools/*` namespace keeps calculator URLs predictable and keyword-rich
- `/guides/*` namespace separates content from tools (helps Google categorize)
- No trailing slashes (cleaner URLs, standard modern practice)

---

## 4. The 5 Launch Calculators (+ 1 Phase 2 Differentiator)

### 4.1 Filament Cost Calculator
**Purpose:** Calculate the material cost of a 3D print given weight used and spool price.

**Formula:**
```
cost = (grams_used / 1000) × price_per_kg × (1 + waste_factor)
```

**Inputs:**
- Grams used (number, required, typical range 5-2000g)
- Price per kg (currency, required, default $20, range $10-150)
- Waste factor (slider, 0-25%, default 5%)
- Currency toggle (USD / EUR / GBP / CAD)

**Outputs:**
- Total cost for this print (primary)
- Cost per gram (secondary)
- Prints remaining on current spool (if user inputs spool size)

**Typical defaults:**
- PLA: $20/kg, 5% waste
- PETG: $25/kg, 7% waste
- ABS: $22/kg, 10% waste (higher due to warping failures)
- TPU: $30/kg, 8% waste

**Edge cases:**
- 0 input: show helpful placeholder, no NaN errors
- Negative values: reject with friendly error message
- Extremely large values (>10kg): show warning, still calculate
- Unit conversion: user can input grams OR ounces, meters OR feet

### 4.2 Print Time Estimator
**Purpose:** Rough estimate of print duration from weight and printer class. Explicit disclaimer: slicers are authoritative.

**Formula (simple, what users actually want):**
```
time_hours = grams / throughput_g_per_hour
```

**Printer throughput presets:**
| Printer class | g/hr throughput |
|---|---|
| Modern CoreXY (Bambu X1C, P1S) | 30 |
| Modern bedslinger (Prusa MK4, Bambu A1) | 20 |
| Legacy (Ender 3 stock, older printers) | 10 |
| Fast custom/klipper builds | 40 |

**Inputs:**
- Weight (grams)
- Printer preset (dropdown with custom option)
- Custom throughput (when "Custom" selected)

**Outputs:**
- Estimated print time (hours + minutes)
- Disclaimer: "Actual time will vary. For precise estimates, use your slicer."

### 4.3 Material Comparison Tool
**Purpose:** Side-by-side PLA/PETG/ABS/TPU comparison with a "best for your use case" quiz.

**Data displayed per material:**
| Property | PLA | PETG | ABS | TPU |
|---|---|---|---|---|
| Nozzle temp | 190-220°C | 230-250°C | 240-260°C | 210-230°C |
| Bed temp | 0-60°C | 60-80°C | 90-110°C | 30-60°C |
| Density | 1.24 g/cm³ | 1.27 g/cm³ | 1.04 g/cm³ | 1.20-1.21 g/cm³ |
| Shrinkage | ~0.3% | ~0.5% | ~1.5% | ~0.8% |
| Typical cost/kg | $20 | $25 | $22 | $30 |
| Difficulty | Easy | Moderate | Hard | Moderate |

**Use-case quiz (routes to material recommendation):**
- Q1: Is the print for indoor or outdoor use? → Outdoor → PETG
- Q2: Will it bend or flex under use? → Yes → TPU
- Q3: Will it see temperatures above 60°C? → Yes → ABS (PETG if mild)
- Q4: Beginner or experienced? → Beginner → PLA

### 4.4 Electricity Cost Per Print
**Purpose:** Calculate power costs for a print.

**Formula:**
```
cost = (printer_watts / 1000) × print_hours × cost_per_kwh
```

**Printer wattage presets:**
- Bambu X1C: 115 W avg
- Bambu P1S / A1: 95 W
- Prusa MK4: 95 W
- Ender 3: 125 W

**kWh cost defaults:**
- US national avg: $0.18/kWh
- Expensive US (CA, HI, MA): $0.35/kWh
- Cheap US (ND, LA): $0.12/kWh
- EU avg: €0.27/kWh
- Custom input

**Inputs:**
- Print time (hours)
- Printer preset (or custom wattage)
- kWh cost (or region preset)

**Outputs:**
- Electricity cost for this print
- Cost per hour
- Annual cost at X prints per week (optional)

**Education callout:**
"Electricity is usually much cheaper than filament. Don't let power bills dominate your decisions."

### 4.5 Failure Rate Calculator
**Purpose:** Track print success rate and calculate wasted material/money over time.

**Formula:**
```
failure_rate = failed / (successful + failed) × 100
wasted_grams = failed × avg_grams
wasted_dollars = (wasted_grams / 1000) × price_per_kg
```

**Inputs:**
- Number of successful prints (this month / period)
- Number of failed prints
- Average grams per print
- Filament price per kg

**Outputs:**
- Failure rate %
- Total wasted material (grams + dollars)
- Benchmark comparison: "Your 12% failure rate is typical for a hobbyist. Pros run under 5%."
- Time wasted (failures × avg print time)

### 4.6 Bambu AMS Purge Waste Calculator (Phase 2 — differentiator)
**Purpose:** Calculate filament wasted during multi-color Bambu AMS prints.

**Why this is the killer tool:** No existing calculator handles this well. Bambu AMS purges significant material per color change (typical 8-15g per swap, dozens of swaps per print). Some users report 50%+ of total filament wasted on purge for complex multi-color prints.

**Formula:**
```
purge_per_swap_grams = configurable (default 8g, user can adjust per AMS profile)
total_purge_grams = color_swaps × purge_per_swap_grams
total_purge_cost = (total_purge_grams / 1000) × avg_filament_price_per_kg
purge_waste_percent = total_purge_grams / (total_purge_grams + actual_print_grams) × 100
```

**Inputs:**
- Number of color swaps in the print
- Grams per swap (slider, 4-20g, default 8)
- Actual print weight (grams, excluding purge)
- Avg filament price across colors

**Outputs:**
- Total wasted on purge (grams + dollars)
- Purge as % of total material
- "Is this worth printing multi-color?" — comparison to painting cost equivalent

**Ships Phase 2** (post-launch, after the 5 core tools are live and indexed).

---

## 5. Design System

### Theme
- **Dark mode default** (near-black `#0a0a0a` bg, accent blue `#3b82f6`, text `#e5e5e5`)
- **Light mode toggle** (persists via localStorage)
- Tailwind's built-in dark mode variant (`dark:` prefix)
- Respects user's `prefers-color-scheme` on first visit, then overrides per their toggle

### Typography
- **UI font:** Inter (variable weight, free via next/font)
- **Numerical values:** JetBrains Mono (monospace for aligned digit display — "24.53g" aligns nicely with "105.67g")
- **Headings:** Inter Bold / Black
- **Body:** Inter Regular, 16px base, 1.6 line-height

### Component library
- **shadcn/ui** — copy-paste component system using Radix primitives
  - Inputs, sliders, buttons, cards, tabs, dropdowns, tooltips
  - Fully accessible (keyboard nav, screen readers)
  - Dark mode native
- Custom components (built on top):
  - `<CalculatorCard>` — the container shell for each tool
  - `<InputWithUnit>` — number input + unit selector (grams/oz, etc.)
  - `<ResultDisplay>` — animated result card with copy-URL button
  - `<FormulaBreakdown>` — collapsible "how we calculated this" accordion
  - `<PrinterPresetSelect>` — dropdown with common printer models + "custom"

### Layout principles
- **Mobile-first** — every page designed for phone screen first, scales up
- **Max-width 1024px** on main content — no full-width walls of text
- **Generous whitespace** — padding and gaps to prevent cramped feel
- **No sidebars** — distracting, hurts mobile, nobody uses them

### Interaction principles
- **Live-updating results** — change a slider, result updates instantly (no "Calculate" button)
- **Visible formulas** — small accordion below each tool showing the math (technical audience wants to verify)
- **Shareable URLs** — tool state encoded in URL query params, so users can paste a link preloaded with their inputs
- **Copy-to-clipboard** on result values (easy to paste into spreadsheets)

---

## 6. SEO Strategy

### On-page SEO (per calculator page)
- Unique `<title>` and `<meta description>` per page, keyword-optimized
- H1 matches primary keyword target
- Semantic HTML (proper heading hierarchy, `<article>`, `<section>`)
- Schema.org structured data:
  - `SoftwareApplication` for each calculator
  - `FAQPage` for FAQ sections
  - `BreadcrumbList` for navigation
- Fast Core Web Vitals (static pages = instant LCP)

### Content SEO (guide articles)
- 10-12 launch articles, each 1200-1800 words
- Target long-tail keywords identified in research
- Internal linking: every guide links to related calculator + other guides
- Original images (screenshots of our tools, not stock photography)

### Technical SEO
- `/robots.txt` allowing all crawlers
- `/sitemap.xml` auto-generated (includes all tool pages + guide pages)
- Canonical URLs to prevent duplicate content
- Structured data validated via Google Rich Results Test
- Open Graph + Twitter Card meta tags for social shares

### Sitemap priorities
- Homepage: 1.0
- Tool pages: 0.9
- Guide pages: 0.7
- Legal pages: 0.3

### Launch SEO actions
1. Submit sitemap to Google Search Console
2. Request indexing on top 3 tool pages
3. Submit sitemap to Bing Webmaster Tools
4. Share on r/3Dprinting "share your site" weekend threads (genuine natural promotion)
5. Cross-link from Matthew's YouTube channels where relevant (PP, SSS, LEVELS — if any natural tie-in)

---

## 7. Analytics & Monetization

### Google Analytics 4 (free)
- Track page views, sessions, user flow
- Measure tool usage (which calculator is most popular)
- Event tracking on calculator interactions (user actually used the tool = higher quality session)

### Google Search Console (free, critical)
- Monitor indexing status
- Track impressions + clicks per keyword
- Identify query opportunities (keywords we're almost ranking for)
- Fix crawl errors as they appear

### Google AdSense (post-approval)
- Placeholder ad slots added during build (3 per tool page, 2 per guide page)
- Activated only after AdSense approval
- Placements: above fold, between tool and FAQ, below content
- **Never place inside calculator input area** (UX-first priority)

### AdSense approval prep
- Legal pages: Privacy, Terms, About, Contact (all required)
- Substantive content: 10+ guide articles live at time of application
- Original content (not scraped, not AI-slop — written with care and sources cited)
- Clean UI with clear navigation
- Target application: Week 3-4 post-launch

---

## 8. Deployment Plan

### Phase 1: Local build (Week 1)
- Next.js project scaffolded at `F:/Projects/filamentcalcs/`
- Matthew runs `npm run dev` to preview at `http://localhost:3000`
- All 5 calculators + homepage + legal pages built
- Dark/light theme working
- Mobile responsive verified

### Phase 2: Content (Week 2)
- 10-12 guide articles written as MDX files in `/content/guides/`
- Screenshots of our tools embedded (no stock photos)
- Internal linking between guides and tools

### Phase 3: Deploy to Vercel (end of Week 2)
- Matthew creates Vercel account (free, 10 min)
- Matthew creates GitHub account if he doesn't have one (free, 5 min)
- I push code to GitHub repo
- Connect GitHub → Vercel, site auto-deploys
- Available at temporary URL: `filamentcalcs.vercel.app`

### Phase 4: Domain config (Week 2-3)
- In Namecheap: change nameservers to Vercel's (or set A/CNAME records)
- Takes 0-24 hours to propagate
- Site then live at `filamentcalcs.com` with automatic HTTPS

### Phase 5: Post-launch (Week 3+)
- Submit sitemap to Google Search Console
- Apply for AdSense
- Monitor for indexing (1-30 days)
- Social/community promotion

---

## 9. Timeline

| Week | Tasks | Matthew's time | Claude's time |
|---|---|---|---|
| 1 | Scaffolding, 5 calculators, legal pages | 1-2 hrs (QA/feedback) | 10-15 hrs |
| 2 | Content articles, deploy, domain config | 2 hrs (QA + account setup) | 8-12 hrs |
| 3 | AdSense application, Search Console setup | 1 hr (account + forms) | 1-2 hrs |
| 4+ | Monitor, wait for indexing, iterate | 30 min/week (dashboard checks) | As needed |

**Total Matthew active hours: 4-6 spread over 3 weeks.**

---

## 10. Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Site doesn't rank at all | Medium | High (zero revenue) | Decision checkpoint at month 9-10, cut losses if no indexing |
| AdSense rejects application | Medium | Medium (delays revenue) | Build with substantial content (10+ articles), legal pages, clean UX |
| Formulas contain a subtle bug | Low | Medium (lose user trust) | Triple-check with canonical sources, add disclaimers, cite references |
| Another creator builds same idea | Medium | Medium (slows growth) | Move fast, ship Phase 1 in 2 weeks, lead with AMS Purge differentiator |
| Google algorithm update | Low | High | Build for quality (not SEO tricks), focus on user experience over ranking hacks |
| Vercel free tier limits hit | Very Low | Low | Upgrade to $20/mo only if 500K+ pageviews/mo — by then AdSense covers it |

---

## 11. Non-Goals (explicitly out of scope for v1)

- User accounts / authentication
- Saved calculator history (beyond URL sharing)
- Payment processing / premium tier
- Mobile app (web-only, responsive)
- Multi-language support (English only for v1)
- Affiliate links / product recommendations (can add later if traffic supports)
- Newsletter / email capture (no audience yet, adds friction)
- Forum / community features
- User-generated content

These may be considered for v2+ if the site gains traction.

---

## 12. References

### Canonical sources (cited in calculator tooltips + guide articles)
- Prusa Research documentation
- Bambu Lab Wiki (power consumption, AMS mechanics)
- Simplify3D materials guide
- Daniels 1985, running economy (for efficiency concepts)
- r/3Dprinting community consensus (failure rates, typical values)
- US EIA electricity rate data

### Research artifacts
- Full research brief: session 9dc210d0 (compacted to memory)
- Competitor UX analysis: same session
- Content topic suggestions: same session

---

## Approval

- [ ] Matthew: design approved 2026-04-23 (verbal, "Go ahead, we can tweak it after")
- [x] Claude: self-reviewed for internal consistency, scope, ambiguity — no unresolved items

Next step: invoke writing-plans skill for phased implementation plan.
