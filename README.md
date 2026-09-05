# FilamentCalcs

Nine free browser calculators for hobbyist 3D printing. Next.js App Router, TypeScript and Tailwind.

## Development and verification

Use Node.js24 or newer (the formula tests import TypeScript directly).

```sh
npm ci
npm run dev
npm test
npm run build
```

The build runs TypeScript checks and prerenders all routes. It fetches the existing fonts from Google at build time. Before release, also check calculator inputs, sharing and mobile layout in the browser; pure formula tests cannot validate React state behavior.

## Calculator contracts

- Formulas live in `src/lib/formulas`. Add a reproducible regression case before changing arithmetic.
- Keep existing shared URL keys compatible. A blank input must remain blank; never silently substitute a plausible answer for invalid input.
- `useCalculatorState` keeps jobs in URLs. Only explicitly allowed settings may be saved on-device, and only after opt-in. Shared inputs take precedence.
- Price and hardware presets are editable assumptions. Do not imply measured industry averages, manufacturer validation or firsthand printer testing without evidence.
- AMS slicer mode counts non-overlapping model, flush, support, tower and other material once. Estimate mode accepts an explicit grams/mm³ average; it has no universal purge default.
- Vercel Analytics event URLs have calculator query parameters removed. Shared URLs still contain inputs. Keep public privacy wording consistent.
- AdSense is disabled. Relevant affiliate components remain below the tools, configured by the existing deployment environment.

The site is deployed from the existing GitHub/Vercel project. Preserve production environment settings and existing public URLs.
