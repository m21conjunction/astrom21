# Astronomy Sub Analyser Changelog

## 0.4.19 - 2026-10-10

- Added an individual default-reset button beside each numeric analysis control.
- Kept the global **Restore Analysis Defaults** action for resetting all analysis controls together.

## 0.4.18 - 2026-10-09

- Added a visible default value beside every numeric analysis control, including Maximum FWHM and Maximum Eccentricity.
- Renamed the reset action to **Restore Analysis Defaults** so it clearly covers thresholds as well as percentages.

## 0.4.17 - 2026-10-09

- Added small decorative icons to the compact analysis summary rows for faster visual scanning.
- Kept the icons presentational only; scoring and analysis calculations are unchanged.

## 0.4.16 - 2026-10-08

- Added a compact responsive summary grid with stronger visual hierarchy for processed counts, recommendations, warnings, settings, and elapsed time.

## 0.4.15 - 2026-10-08

- Kept the completed analysis duration visible in the final results summary.
- Split the crowded processed-frame summary into separate readable status lines.

## 0.4.14 - 2026-10-07

- FWHM and eccentricity threshold failures now set the displayed Light-frame score to `0` as a hard penalty.
- Changing the thresholds recomputes the frame from its original measurements, restoring the normal score when the frame passes.

## 0.4.13 - 2026-10-07

- FWHM and eccentricity thresholds now force Light frames to Discard when exceeded, while retaining the numeric score for diagnosis.

## 0.4.12 - 2026-10-07

- Added Moon illumination, phase, altitude range, target-separation range, and potential-exposure details to each observing-night card.
- Added plain-language explanations for low or zero Moon impact, including the below-horizon case, disabled penalty, low geometric/filter exposure, and missing Moon-explained background lift.
- Documented the Moon penalty calculation alongside the new display details.

## 0.4.11 - 2026-10-06

- Reduced the on-image Moon metadata to the score-relevant Moon impact; detailed astronomical fields remain available in CSV export.
- Grouped the Moon panel by observing night and site, keeping a continuous cross-midnight session as one night and showing the impact variation during it.
- Added remembered Maximum FWHM and Maximum Eccentricity Light-frame keeper gates, defaulting to `4.0 px` and `0.65`, with frame warnings when a gate is exceeded.
- Added image-level median major-axis FWHM to result cards, zoom metrics, and CSV export.

## 0.4.10 - 2026-10-01

- Added an embedded WebAssembly pixel-statistics kernel for full-resolution FITS/XISF analysis.
- Workers try the SIMD-enabled kernel, then scalar WASM, with the existing JavaScript path as a compatibility fallback.
- Added `analysis_kernel` to CSV export so analysis runs can be compared across environments.
- Kept the existing score formulas, thresholds, and weights unchanged.
- Added the release wishlist item for bundle/minify and platform code-signing work.

## 0.4.9 - 2026-09-30

- Separated Moon-explained smooth background lift from transient cloud residuals.
- Moon and cloud penalties can now both apply to a Light frame when the evidence supports both effects.
- Added a combined 75% sky-penalty cap, independent UI sky wording for Moonlit cloud, and CSV fields for the separate evidence.
- Updated the Moon calculation help, README, and Description documentation.

## 0.4.8 - 2026-09-30

- Replaced the v0.4.7 median-lift multiplier after labelled frames showed that zero lift does not mean no cloud.
- Added same-object/filter batch-residual cloud evidence from nearby tile-pattern, background, star-count, and noise changes.
- Kept raw background range/structure as diagnostics and added CSV fields for each transient evidence component.

## 0.4.7 - 2026-09-29

- Changed Light-frame cloud gating so the raw background range and structure are weighted by the positive same-object/filter median-background lift.
- A zero median-lift now suppresses range-only cloud warnings, reducing false positives from target structure, gradients, vignetting, and filter-dependent illumination.
- Kept the raw range/structure values for diagnostics and added the lift weight plus weighted values to CSV export.

## 0.4.6 - 2026-09-29

- Replaced the expanded preview's large multi-row metadata grid with a compact, horizontally scrollable summary strip so the image retains more of the window height.
- Reduced Light-frame preview details from 32 fields to 12 inspection-critical fields: status, filter, object, sharpness, noise, HFR, roundness, eccentricity, stars, tracking, cloud, and clipping.
- Added an equivalent compact calibration-frame summary focused on type-specific quality checks.
- Reduced preview metric padding and typography while preserving complete measurements on result cards, in **Why this score?**, and in CSV export.

## 0.4.5 - 2026-09-29

- Added a detected-header-location list to **Manage observing sites** for Light frames containing observing coordinates.
- Deduplicates nearby detected coordinates within `0.002 deg`, shows the number of matching Light frames, and lets the user save or update a local location name.
- Automatically reuses saved names for matching coordinates in later batches while preserving FITS/XISF latitude, longitude, elevation, and metadata source as authoritative.
- Updates Moon session cards, frame details, and CSV `site_name` immediately after a detected location is named.
- Added the new location-naming interface in International English, Spanish, Italian, French, and German.

## 0.4.4 - 2026-09-29

- Replaced the Moon-impact checkbox and fixed 3%/7%/12% exposure-band caps with a user-entered **Maximum Moon Penalty** percentage.
- `0%` disables the penalty; values up to `100%` are accepted and remembered locally.
- Scales the actual reduction continuously as `user maximum × Moon exposure fraction × median-lift evidence`.
- Keeps the Moderate-exposure gate, smooth-background requirement, cloud-evidence exclusions, and cloud double-counting protection.
- Added `moon_penalty_setting_percent` to CSV export and updated the five interface languages and calculation documentation.

## 0.4.3 - 2026-09-29

- Added an optional **Penalise Moon Impact** control, disabled by default and remembered locally.
- Requires both plausible, filter-aware Moon exposure and a smooth median-background lift before reducing a Light-frame score; angular separation alone never causes a penalty.
- Caps the multiplicative reduction at 3% for Moderate, 7% for High, and 12% for Very high Potential Moon Exposure.
- Skips the Moon penalty whenever the frame already receives a cloud penalty, preventing double counting.
- Added the Moon penalty decision, evidence, cap, fraction, and reason to CSV export and the **Why this score?** breakdown.
- Added the control and explanation in International English, Spanish, Italian, French, and German.

## 0.4.2 - 2026-09-29

- Replaced the batch-wide Moon range with session-aware cards grouped by time, object shot, filter, and observing site.
- Added internal low-precision Moon RA/DEC, local altitude/azimuth, target altitude, and Moon-to-target angular separation without external astronomy software or network access.
- Added named observing sites stored locally and assigned per selected folder when per-frame FITS/XISF site coordinates are absent; embedded header coordinates always have priority.
- Added a filter-aware Potential Moon Exposure indicator with deliberately distinct wording for illumination, separation, altitude, and exposure.
- Added explanatory sky context that compares Moon plausibility with median-based background structure/lift and relative star loss: clear evidence, likely moonlight, possible moonlit haze/cloud, cloud likely, non-Moon brightening, or indeterminate.
- Kept Moon context out of direct scoring. Existing image-derived cloud warnings and penalties remain unchanged.
- Added Moon/site/session/sky fields to Light-frame details and CSV export, with translations in International English, Spanish, Italian, French, and German.

## 0.4.1 - 2026-09-29

- Added a simple Moon Illumination panel for Light frames: illuminated percentage, phase, approximate lunar age, and a phase pictogram.
- Calculates the values locally from the UTC exposure midpoint with original bundled JavaScript; no external astronomy vendor, runtime, network request, location, or online geocoding is used.
- Clarified in the interface that Moon illumination is the lit fraction of the visible lunar disc, not Moon-to-target separation.
- Added observation time and Moon context to Light-frame details and CSV export.
- Added Moon terminology in International English, Spanish, Italian, French, and German.
- Moon context is informational only and does not alter scoring, cloud detection, keeper thresholds, or recommendations.

## 0.4.0 - 2026-09-28

- Added a remembered interface-language selector for International English, Spanish, Italian, French, and German.
- Externalised user-facing interface text while keeping internal frame types, recommendations, measurements, and CSV field names stable.
- Added the approved translation glossary in `TRANSLATIONS.md`.
- Improved responsive handling for translated labels and widened the preview magnification control for longer terms.
- Kept the v0.3.13 analysis formulas, thresholds, score meanings, and offline-only processing behaviour unchanged.
