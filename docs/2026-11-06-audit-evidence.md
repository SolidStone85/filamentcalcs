# FilamentCalcs audit evidence, November 6, 2026

Scope: verified repairs to claims, input meaning and attribution in the existing project. This work does not diagnose the AdSense rejection or promise approval, traffic or revenue.

## Baseline and calculation findings

- Source: `F:/Projects/filamentcalcs`, local HEAD `48e78e146e553aa25e4a250676c057eb7073fc18`. All tracked files matched a read-only archive of HEAD at the start. The old vault `site/` copy was not used.
- Project ownership notes name Matthew, with earlier maintenance by Claude/Fable. NOW names no active FilamentCalcs work. Queue 0009 is a parked, unrelated affiliate ticket; it was not reopened or changed.
- Existing Node suite passed 41/41. Failure rate, duration rounding and the worked cost example already calculate correctly. No arithmetic formula or saved URL key was changed.
- The old failure guide nevertheless claimed a typical hobbyist range and a print-farm range; the calculator correctly stated it had no verified industry benchmark. The glossary repeated a typical range. The input said average filament per print although the formula uses average grams consumed by a failed attempt.
- The old time guide presented named-printer durations, throughput bands, slicer error percentages and timing multipliers without a reproducible test set. It also reassured readers about unattended printing and gave a universal hot-nozzle tightening rule in the failure guide.
- Baseline browser tests reproduced five missing/misleading behaviors. After repair, all six targeted checks pass, including the already-correct early-failure arithmetic.

## Primary references checked

The repaired guides link sources near their relevant sections. Manufacturer instructions are evidence for the described procedures; they do not validate FilamentCalcs' illustrative rates or constitute hands-on tests by the site.

- [PrusaSlicer FAQ](https://help.prusa3d.com/article/faq-prusaslicer_1789): print-time estimation depends on the correct printer profile, including motion settings. No cross-slicer ranking was inferred.
- [PrusaSlicer speed settings](https://help.prusa3d.com/article/speed-settings_480325): move speeds depend on acceleration; a short move need not reach the configured target.
- [Prusa extruder-blob guidance](https://help.prusa3d.com/article/extruder-blob_2005): first-layer observation and supervision. The old blanket overnight reassurance was removed.
- [MK2.5/MK3 nozzle replacement](https://help.prusa3d.com/article/changing-or-replacing-the-nozzle-mk2-5-s-mk3-s-mk3-5-s_2069) and [MK4/MK3.9 nozzle replacement](https://help.prusa3d.com/guide/how-to-replace-the-prusa-nozzle-mk4-mk3-9_421215): different hardware requires its own procedure. The guide now supplies no universal torque or temperature.
- [Klipper bed leveling](https://www.klipper3d.org/Bed_Level.html): choose the calibration mechanism for the machine.
- [Prusa layer shifting](https://help.prusa3d.com/article/layer-shifting_2020): investigate obstructions, pulleys and model-specific belt adjustment.
- [Prusa stringing](https://help.prusa3d.com/article/stringing-and-oozing_1805): material/profile/retraction checks; generic travel and retraction prescriptions removed.
- [Prusa poor bridging](https://help.prusa3d.com/article/poor-bridging_1802): reduced bridge speed/flow can help. The old advice to increase bridge flow for droop was corrected.
- [Prusa warping](https://help.prusa3d.com/article/warping_2011): environment and material matter; an enclosure is not a universal recommendation.

## Existing image attribution

The nine original assets remain unchanged. `src/lib/guideImageCredits.ts` records titles, creators, original Commons file pages and the selected license. Each guide now renders those credits adjacent to the image, with a license link and a resizing/cropping notice. Licenses apply to the images, not the site text. These metadata were read from the actual file pages on November 6; the automated tests establish asset/credit completeness, not independent legal clearance.

| Local image | Creator | License | Original file page |
|---|---|---|---|
| printer-makers-party.jpg | Subhashish Panigrahi | CC BY-SA 3.0 | [Makers Party](https://commons.wikimedia.org/wiki/File:Printing_with_a_3D_printer_at_Makers_Party_Bangalore_2013_11.JPG) |
| spaghetti-fail.jpg | A7N8X | CC0 1.0 | [Spaghetti monster](https://commons.wikimedia.org/wiki/File:Spaghetti_monster.jpg) |
| printer-in-action.jpg | MukhtaromST | CC0 1.0 | [3D Printing](https://commons.wikimedia.org/wiki/File:3D_Printing.jpg) |
| printing-materials.jpg | Maurizio Pesce | CC BY 2.0 | [3D Printing Materials](https://commons.wikimedia.org/wiki/File:3D_Printing_Materials_(16863368275).jpg) |
| printer-with-spools.jpg | Creative Tools | CC BY 2.0 | [BEETHEFIRST](https://commons.wikimedia.org/wiki/File:BEETHEFIRST_3D_printer_and_3D-printed_filament_spools.jpg) |
| filament-spools-helsinki.jpg | Kalle | CC BY-SA 2.0 | [Oodi filament](https://commons.wikimedia.org/wiki/File:Helsinki,_Oodi,_3D_printer_filament.jpg) |
| bambu-x1c-ams.jpg | Benlisquare | CC BY-SA 4.0 | [X1 Carbon with AMS (cropped)](https://commons.wikimedia.org/wiki/File:Bambu_Lab_X1_Carbon_with_AMS_module_(cropped).jpg) |
| filament-types-qidi.png | Haroldbarlow8911 | CC BY-SA 4.0 | [QiDi Filaments](https://commons.wikimedia.org/wiki/File:QiDi_3D_Printer_Filaments.png) |
| prusaslicer.png | Majkluss | CC BY-SA 4.0 | [PrusaSlicer](https://commons.wikimedia.org/wiki/File:PrusaSlicer.png) |

## Verification procedure

`npm test` exercises formulas, URL-related pure state and reference data. `scripts/verify-audit-browser.py` exercises the local UI, invalid/blank inputs, early failures, zero/all failures, shared URL reopening, duration rounding, visible/schema consistency, all nine captions, phone widths of 320/390 pixels, desktop width of 1280 pixels, themes, and runtime errors. Screenshots and the exact result JSON are retained in the containing task's evidence folder.

The browser test requires Python Playwright and an installed Chromium runtime; it does not reuse the user's signed-in browser or tabs. WebKit is not installed on this computer, so Safari-specific behavior is not claimed. The source project uses Next.js 16.2.4; its local page and Playwright guides were read before coding. Existing dependencies were copied into the isolated task workspace; no packages were installed or updated.

The strict production-mode check passed 94 functional/layout checks and flagged console 404s. A two-route diagnostic traced every observed 404 to `/_vercel/insights/script.js`, which the existing Vercel integration expects its host to supply. The plain local Next server does not supply that endpoint. The `--local-production` option records only that exact URL/message separately in the result JSON; application errors and other missing assets still fail. Analytics configuration was not changed. This is a local integration limitation, not verification of live analytics delivery.
