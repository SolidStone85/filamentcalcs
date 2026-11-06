# November 2026 guide and theme release

This release adds four beginner guides, an optional Workshop color theme, two illustrative images and a small optional layer-building animation. It includes the earlier evidence, calculator-label and image-credit repairs recorded in `2026-11-06-audit-evidence.md`.

## Public changes

- `/guides/how-to-start-3d-printing`: a first useful print, safe setup, slicing, first-layer checks and troubleshooting.
- `/guides/3d-printing-beginner-equipment`: equipment worth buying initially, measurement, storage and compatibility checks.
- `/guides/useful-3d-prints-save-money`: practical household projects, transparent material/electricity/equipment examples and the costs those examples exclude.
- `/guides/start-3d-printing-business`: testing demand, quoting work, licensing, Etsy eligibility, fees and realistic worked costs.

The homepage and guide index link the new articles. Visible FAQs agree with their structured data. The existing calculator formulas, preset values, saved input keys and route URLs are preserved.

Amazon recommendation blocks identify Amazon.com, distinguish product pages from searches and carry adjacent Associate disclosures. Unverified PLA and bag variants were replaced by relevant searches. Advice now qualifies loaded-spool scale capacity, plate/nozzle compatibility and the SUNLU S4's 70°C maximum against hotter manufacturer drying requirements. No account enrollment, regional tag, commission, price, stock or physical-product testing claim was invented.

Workshop is an optional middle-tone palette. Light, Dark and System remain available; System follows OS changes. The printer diagram is static by default, plays once for 2.8 seconds on request and keeps a static equivalent under reduced motion. It is an SVG animation, not a GIF.

## Content and asset provenance

The articles adapt the complete readable text of `FilamentCalcs_Beginner_Articles_2026-11-06.docx` from ChatGPT Library. Native DOCX materialization and one supported consumer-local retry failed because the official Windows helper calls unavailable `os.setxattr`; complete Library reading succeeded. The original Library document was not modified.

The two unbranded illustrations were generated with the built-in image tool and encoded with existing Sharp as 1672×941 WebP files: `beginner-printer.webp` (96,852 bytes) and `useful-projects.webp` (112,216 bytes). Captions identify AI illustrations rather than photographed/tested products. No specific Sunburst model selection or native GIF output was available or claimed. Existing Commons images and their repaired credits remain intact.

## Independent review and verification

Separate reviewers approved editorial accuracy/practical value, affiliate wording/compatibility, design/accessibility and technical behavior after fixes and final-state review. No material findings remain. Corrections included the founder's first-Prusa wording, supervision/fire/electrical guidance, explicit household cost categories, licensing attribution, visible FAQ consistency, menu-group runtime behavior and SVG contrast.

| Check | Result |
| --- | --- |
| Unit suite | 50 passed; zero failures/skips |
| TypeScript | Passed |
| Affiliate content verifier | Passed: 10 tools, 14 guides |
| Optimized production build | Passed: 69 static pages, one worker |
| Chrome 156.0.8078.80, new features | 178 passed; no unexpected errors |
| Edge 157.0.4341.42, new features | 178 passed; no unexpected errors |
| Chrome, earlier audit/calculator regressions | 96 passed; zero failures |
| Diff whitespace check | Passed |

Browser coverage uses 320×844, 390×844 and 1280×844 viewports; it covers fixed/System themes, keyboard navigation, persistence, visible FAQ/schema, canonical headings, disclosure/link configuration, images, overflow, animation and reduced motion. Earlier regressions cover invalid/zero/all-failure inputs, early-failure material use, URL persistence, duration rounding and nine existing image credits. Phone sizes are emulated desktop-browser viewports, not physical-phone tests.

The local production server lacks Vercel's hosted `/_vercel/insights/script.js`. Only its exact 404 URL/message is recorded separately; other runtime, console and hydration errors fail verification. Local receipts recorded 42 such messages in each new-feature run and 61 in the legacy run. Safari/WebKit and analytics event delivery are not claimed verified. Deployment status and public-site verification are separate release steps.
