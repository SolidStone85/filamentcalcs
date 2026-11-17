# Same-model nozzle/profile comparison

Software-only predictions, November 17, 2026. One 40 x 40 x 20 mm block, flat
40 x 40 face on the bed, one copy, no scaling/rotation/supports. No physical
print was timed. These settings are for reproducing a slice, not for sending
a job to an unverified printer. No printer connection is required.

## Version and profile sensitivity

The recorded tool is PrusaSlicer 2.9.4 for Windows. Original named selections:

| File | Printer profile | Print profile | Filament |
| --- | --- | --- | --- |
| 04-quality.ini | Original Prusa i3 MK3S & MK3S+ | 0.20mm QUALITY @MK3 | Generic PLA |
| 04-speed.ini | Original Prusa i3 MK3S & MK3S+ | 0.20mm SPEED @MK3 | Generic PLA |
| 06-detail.ini | Original Prusa i3 MK3S & MK3S+ 0.6 nozzle | 0.20mm DETAIL @0.6 nozzle MK3 | Generic PLA |

The original bundled Prusa Research profiles were version 2.4.0. Online
profile updates and different application versions can change a named
preset. Use the included exact configurations to compare these records.
The recorded predictions and command-line workflow were verified on Windows.
The byte hashes cover LF files.

## Expected software results

| Profile | Normal-mode estimate | Predicted filament |
| --- | --- | --- |
| 0.4 QUALITY | 55m 19s | 11.91 g |
| 0.4 SPEED | 37m 21s | 12.04 g |
| 0.6 DETAIL | 38m 17s | 13.49 g |

All use 0.20 mm layers, two walls, five top/four bottom layers, 15% infill,
Generic PLA and the same configured 15 mm3/s filament cap. SPEED uses grid;
the other two use gyroid. Widths, wall/fill speeds and material use differ.
This does not isolate nozzle size or control strength, finish or printed quality.
The maximum internal-fill feedrate observed in the SPEED G-code was about
177.17 mm/s despite a 200 mm/s request. A nominal 0.45 mm-wide, 0.20 mm-high
rounded cross-section calculation gives about 184.24 mm/s at 15 mm3/s; that
calculation is not an observed command. Neither figure measures actual motion
under acceleration. Complete settings and both prediction modes: predictions.json.

## Verified Windows CLI reproduction (Python 3.10+, standard library)

Obtain the official 2.9.4 application for your OS, if needed:
https://github.com/prusa3d/PrusaSlicer/releases/tag/version_2.9.4

Windows PowerShell, from the extracted package directory:

    python ./reproduce.py --slicer 'C:/path/PrusaSlicer-2.9.4/prusa-slicer-console.exe' --output-dir './new-results'

The script checks the application version and the package checksums, creates
a fresh isolated data directory, slices all three exact configurations and
compares time/grams to predictions.json. It refuses an existing output folder.
Windows CLI execution is verified here; predictions on other platforms have
not been validated. Configured host fields,
private paths, credentials, raw G-code and raw application logs are absent
from this package. The optional script writes local G-code and sanitised logs;
it neither connects to a printer nor uploads files.

## Provenance

Settings derive from the official Prusa Research bundle inside PrusaSlicer
2.9.4 (bundle version 2.4.0), flattened with inheritance resolved in order.
Only empty connection fields are omitted; binary G-code is disabled for
inspectable output. No application binaries or vendor bundle are redistributed.
Source bundle SHA256:
d871d5a81575eda6051237b143842aeb3b416eb61c636b153f538480b6accdf1

Official portable Windows ZIP SHA256, verified before use:
1eee41ed81134797936cc69ba9f8caa179ae066f5c00fe405a199291b5af860a

Model geometry and reproduction script were generated for this comparison.
SHA256SUMS.txt allows the inputs to be checked after download.
