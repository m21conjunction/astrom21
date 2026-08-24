# Astronomy Sub Analyser Wishlist

Created: 2026-08-13
Updated: 2026-08-21
Current app version: 0.2.0

This is the current improvement wishlist for the app before the future desktop-packaged version.

## Performance Roadmap

Best options:

1. **Web Workers**
   Process frames in background threads, possibly multiple frames at once. This is probably the biggest practical win in the browser.
   Status: implemented.

2. **Single-Pass FITS Analysis**
   While reading the FITS pixels, compute mean, clipping, near-saturation, histogram, hot/dark outliers, and tile summaries together instead of scanning the image several times.
   Status: open.

3. **Full-Res Star Detection, Small-Window Measurement**
   Scan full-res for star candidates, but only compute FWHM/HFR/roundness inside small windows around stars. That gives full-res star metrics without doing expensive math everywhere.
   Status: paused/open. A first FITS full-resolution attempt was rolled back because it changed the score scale too much and removed keeper frames in Standard mode. Revisit later with a better calibration plan and side-by-side score comparison before enabling it again.

4. **Skip Irrelevant Work By Frame Type**
   For flats/darks/biases, skip star, halo, tracking, repeat-drift logic entirely. For lights, skip calibration-only checks.
   Status: implemented for calibration frames skipping light-only work; light-frame skipping of calibration-only checks should be reviewed separately.

5. **WASM/SIMD**
   Move heavy pixel loops to WebAssembly later. That could be much faster than JavaScript for full-frame FITS math.
   Status: open.

6. **Worker Pool**
   Analyse several images in parallel, but cap it carefully, maybe 2 to 4 large FITS at once, otherwise memory becomes the bottleneck.
   Status: implemented with automatic worker selection. The app now evaluates logical CPU cores, reported/estimated memory, and largest-file memory pressure for the current batch instead of using the old fixed Standard/Expert caps. The future Electron desktop package can use real local CPU/RAM values.

## Implemented

1. **Why This Score?**
   Implemented as an expandable per-image breakdown showing weighted metric credits and score penalties.

2. **Star Overlay In Zoom**
   Implemented as an optional zoom overlay with detected stars, elongated/repeat markers, repeat-drift links, and clicked-star FWHM/HFR readouts.

7. **Calibration Frame Report**
   Implemented as a calibration report panel plus expanded Flat/Dark/Bias/Dark Flat diagnostics for set consistency, median outliers, flat histogram targets, light-leak/gradient warnings, and hot-pixel or brightness outliers.

8. **Keeper Threshold Box Inputs**
   Implemented as per-filter numeric entry boxes instead of keeper threshold sliders.

9. **Higher-Quality Zoom And Magnifier**
   Implemented with higher-resolution zoom detail rendering and selectable 2x, 4x, and 8x magnifier lens levels.

11. **Web Workers / Worker Pool With Stop Control**
   Implemented as a local browser worker pool for heavy per-frame analysis. Auto worker selection scales with detected cores and memory pressure, and the UI has a **Stop Analysis** button that terminates active worker jobs, skips queued frames, and keeps completed results.

12. **Frame-Type Shortcuts**
   Implemented as an early analysis shortcut: Flats, Darks, Biases, and Dark Flats skip light-only star detection, FWHM/HFR star sizing, repeat-drift pairing, tracking detection, halo detection, and light-frame elongation work. They keep calibration-specific checks instead.

18. **Large-Batch UI Refresh Optimisation**
   Implemented for post-analysis controls. Score-weight, sharpness-mode, and halo-penalty changes are debounced so a slider drag does not repeatedly rebuild the full result grid. Preview-stretch thumbnail refresh now runs in small chunks and yields to the browser between chunks.

## Open Ideas

3. **Quality Timeline**
   Show score, star count, HFR/FWHM, mean background, noise, and clipping over the session timeline to reveal clouds, dawn, focus drift, meridian flips, and guiding problems.

4. **Better Session Grouping**
   Group and compare frames by FITS/session values such as filter, exposure, gain, offset, binning, temperature, and target so mixed sessions are judged more fairly.
   Status: partially implemented for light-frame target grouping. The app now reads FITS RA/DEC plus focal length, pixel size, binning, WCS pixel scale, and optional target-name metadata, groups lights by object shot, and scores relative light metrics inside each object-shot/filter group. Target names come from FITS metadata only; there is no image recognition or plate solving. Exposure/gain/offset/binning session grouping remains open.

5. **Best N Frames Selection**
   Add selection modes such as best percentage, best fixed number of frames, minimum score, and balanced per-filter selection.

6. **Analysis Cache**
   Save a local sidecar results file so reopening the same folder can reload analysis instantly unless files changed.

10. **Tilt Detection In Preview**
   Detect likely sensor or optical tilt from corner-to-corner differences in star HFR/FWHM, eccentricity, and roundness, then show a preview overlay or corner map to help diagnose the field.
   Important caveat: this should be designed as a field-quality map first, not a simple "tilt detected" warning. Telescopes without a corrector, such as non-Edge Schmidt-Cassegrains or Newtonians without a coma corrector, can naturally show coma, field curvature, or edge degradation. The feature should distinguish even/radial border degradation from asymmetric corner or side degradation, and use labels such as "possible curvature/coma", "asymmetric field degradation", or "possible tilt" only when the pattern supports it.

13. **Further Full-Resolution Optimisation**
   Explore whether both Standard and Expert can avoid more downsampling without becoming painfully slow. Standard should stay fast by reducing expensive passes, using single-pass FITS statistics, local star-window measurement, and worker-friendly batching. Expert can spend more time on deeper star, flat, cloud, halo, and repeat-drift budgets. Scores should remain equivalent to the same calculation logic; optimisation should change execution speed and measurement depth, not the meaning of each score.

14. **Multi-Language UI**
   Add a language selector and externalised text strings so the app can support International English, French, and other languages without touching the calculation code.

15. **Flat Artefact Penalty Visibility**
   When a Flat frame gets a penalty for clouds, trees, dust shadows, plane trails, uneven illumination, or other artefacts, show the penalty text in red in the frame card and calibration report. The goal is to make severe Flat problems visually obvious instead of hiding them inside the general score.

16. **Frame-Type-Aware Filter Display**
   Keep filter grouping visible for Flats because Flats must match the filter used by the Lights. For Bias and Dark frames, filters are normally irrelevant, so the UI should avoid implying that Bias/Dark quality depends on filter unless a camera/software setup explicitly records something useful.

17. **App Versioning And Release Notes**
   Define a versioning approach before packaging: visible app version in the UI, changelog/release notes, calculation-version tracking for CSV exports, and local-settings migration when defaults or score formulas change.
   Status: started with `0.2.0` as the current visible app/package version. A changelog and calculation-version export still need to be designed.
