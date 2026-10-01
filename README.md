# Astronomy Sub Analyser (Offline)

Current app version: **0.4.10**.

This app runs fully offline in your browser and ranks astronomy images by quality.

## What it does

- Imports one or more local folders of images
- Provides a remembered interface-language selector for International English, Spanish, Italian, French, and German
- After results exist, newly added folders are analysed incrementally; existing measurements are kept and only new frames are decoded
- Runs heavy per-frame measurements in a local Web Worker pool when the browser supports it, with a main-thread fallback
- Uses an embedded WASM pixel-statistics kernel in workers when supported: SIMD first, scalar WASM second, and JavaScript fallback last
- Uses full-resolution FITS/XISF pixels, while keeping Standard fast with sampled expensive passes and local star-window measurements
- Adds **Stop Analysis** for very large batches; completed frames are kept and queued/active worker jobs are cancelled
- Scores each image using:
  - sharpness
  - noise level
  - star roundness (FWHM-based, blended with minor/major axis shape)
  - highlight clipping on light frames
- Detects likely tracking drift from central big/medium stars sharing a common direction, including wider trail checks for guiding, mount, or wind movement
- Detects repeat drift where close, repeated star peaks appear at shifted positions
- Detects broad clouds or haze using transient batch anomalies: local tile-pattern residuals, background changes, star-count anomalies, and noise changes. Stable target structure and optical gradients are treated as background, not clouds
- Repeat-drift uses a bright-star pass to catch multi-copy stars even when the full-frame orientation signal is weak
- Applies cloud and tracking penalties, with repeat-drift and cloudy frames scored much lower than ordinary marginal frames
- Keeps every final image quality score between `0` and `100` when the Sharpness, Noise, Roundness, Star Count, or Clipping weights are changed, and exports that final score in the CSV `quality` column
- Ranks images and labels each one: `Keep`, `Review`, or `Discard`
- Lets you select analysed images and copy them to another local folder
- Shows larger stretched previews in a result grid, with eccentricity, HFR, star count, and mean brightness under each image
- Shows an expandable **Why this score?** breakdown under each analysed frame
- Scores clipping from hard-clipped and near-saturated highlights, with FITS/XISF clipping checks made during the full-resolution pixel read
- Shows amber preview/zoom rings and a warning when broad halos are suspected around bright stars
- Lets you adjust preview stretch after analysis and click any preview to inspect it in a higher-resolution zoom view
- Adds inspection tools for guide-star overlays, repeat-drift markers, clicked-star FWHM/HFR readouts, fit-to-window zoom, lens stretch control, and a 2x/4x/8x/12x/16x magnifier lens
- Keeps the full preview image large with a compact single-row strip of 12 inspection-critical metrics; complete metadata remains on the frame card and in CSV export
- Detects FITS/XISF filters, shows filter tabs, and keeps the All view available
- Detects FITS/XISF light-frame RA/DEC, groups lights by object shot, and compares light scores inside the same object shot and filter
- Uses focal length and pixel size metadata, or WCS pixel scale when available, to derive the allowed RA/DEC deviation for object-shot grouping
- Adds Keep/Review/Discard result-group tabs below Filters so the grid can be grouped by recommendation
- Detects `Light`, `Flat`, `Dark`, `Bias`, and `Dark Flat` frame types and shows frame-type tabs
- Uses purpose-specific checks for calibration frames instead of light-frame star scoring
- Skips star, tracking, repeat-drift, halo, and light-frame elongation work on Flats, Darks, Biases, and Dark Flats
- Shows a calibration report by set, including median consistency, flat histogram target checks, light-leak/gradient warnings, and hot-pixel or brightness outlier signals
- Shows a compact linear histogram overlay on Flat previews, with the target band and median marker
- Applies strong Flat artefact penalties when a flat's histogram, spread, gradient, or tile pattern diverges from the rest of its Flat/filter set
- Detects camera/sensor model from FITS/XISF metadata or path and uses sensor-aware dark-frame outlier thresholds, including low-glow BSI profiles for IMX571/ASI2600/QHY268-style cameras
- Checks calibration compatibility against light frames: darks need matching exposure and camera temperature; flats, bias, and dark flats check camera temperature only
- Lets you adjust keeper score thresholds with per-filter numeric entry boxes
- Can copy selected images into filter-named and/or frame-type output folders
- Remembers the scoring, preview, and magnifier lens stretch sliders, plus the sharpness mode, on the same browser
- Can restore the default percentage values from the toolbar
- Shows help markers beside the core scoring controls with calculation notes
- Exports a CSV report with all analysis parameters, including calculation version, analysis pixel source, and analysis kernel
- Groups Moon context by observing session, object shot, filter, and site; calculates illumination, phase, altitude, azimuth, target separation, and filter-aware potential exposure fully offline
- Compares Moon plausibility with median-based background structure, lift, and relative star loss to distinguish clear evidence, Moonlight, Moonlit cloud, cloud without strong Moon exposure, and other brightening
- Offers a numeric **Maximum Moon Penalty** setting, `0%` by default. Moon and cloud impacts are estimated separately: smooth predictable lift supports the Moon component, while transient same-object/filter residuals support the cloud component. Both may contribute when appropriate, with a combined sky-penalty cap
- Lists observing coordinates detected in FITS/XISF headers and lets the user save or update a local name that is reused automatically for matching coordinates

Version `0.4.10` adds the first WASM/SIMD kernel for full-resolution FITS/XISF mean, standard deviation, clipping, and near-saturation statistics. The worker records `analysis_kernel` as `wasm-simd`, `wasm`, or `javascript`; the calculation meaning and score formulas remain unchanged. Version `0.4.9` separates Moon-explained smooth background lift from transient cloud residuals. Moon and cloud penalties can now both apply to a frame, while a combined sky-penalty cap prevents excessive double counting. The UI and CSV expose the separate Moon impact and cloud residual evidence. Version `0.4.8` replaces the median-lift multiplier with a batch-residual cloud detector. It compares nearby same-object/filter frames using tile-pattern, background, star-count, and noise changes, so both bright and dark cloud events can be detected while stable gradients are suppressed. Version `0.4.7` was an interim median-lift weighting experiment. Version `0.4.6` restores more full-preview image area by replacing the repeated full metadata grid with a compact inspection strip. Version `0.4.5` lets header-detected observing coordinates be saved under a user-provided name without replacing the authoritative header coordinates. Version `0.4.4` replaced the Moon-penalty checkbox and fixed exposure-band caps with a user-entered maximum percentage. `0%` disables the penalty. Version `0.4.2` added session-aware Moon geometry, per-folder saved observing sites, and explanatory Moon/sky context. Version `0.4.0` added the multilingual interface; the approved terminology is listed in [TRANSLATIONS.md](TRANSLATIONS.md).

All processing happens locally on your machine. No cloud calls are used.

## Run

1. Open `/Users/sgrotto/Documents/Astro_Scripts/index.html` in a browser.
2. Add one or more image folders.
3. Click **Analyse**.
4. Use **Stop Analysis** if the batch is too large or you want to keep only the completed measurements so far.
5. If calibration frames are present, review the **Calibration Report**.
6. Optionally tune metric weights and re-run.
7. Select images manually (or click **Select Keepers**).
8. Click **Choose Output Folder**, then **Send Selected**.
9. Choose the CSV separator if needed, then click **Export CSV** for results.

## Desktop App With Electron

The Electron wrapper keeps the existing browser app as the renderer and adds native desktop access for the output folder workflow.

On this Mac, Homebrew's Electron runtime can launch the app without installing Electron from npm:

1. Open `/Users/sgrotto/Documents/Astro_Scripts/Launch Desktop App.command`, or run `npm start` from `/Users/sgrotto/Documents/Astro_Scripts`.
2. Use **Choose Output Folder** and **Send Selected** for native folder-to-folder copying.

For installer/package builds, `electron-builder` is still needed. If the npm registry is blocked by a corporate gateway, build packaging should be done on an unrestricted network or with an approved internal npm mirror.

Important: `package.json` must use `"main": "electron/main.js"`. Do not point Electron at `app.js`; that file is the browser UI script and needs `document`.

In the desktop app, **Choose Output Folder** uses Electron's native folder picker, and **Send Selected** copies files directly through the operating system. The browser version still uses the browser File System Access API where available.

## Notes

- Supports common browser images (JPG/PNG/WebP/TIFF), FITS (`.fit`, `.fits`, `.fts`), and uncompressed monolithic XISF (`.xisf`).
- Folders can be added one after another before or after analysis. When results already exist, clicking **Analyse** processes only newly added supported frames, then refreshes scores and reports for the combined batch. The folder list shows browser-safe relative folder paths because browsers hide full disk paths.
- **Analysis Mode** defaults to **Standard**. FITS/XISF measurements now use the full-resolution pixel array in both modes. Standard stays faster by sampling expensive whole-frame passes; Expert uses deeper sampling budgets for star size, roundness, repeat drift, flat artefacts, clouds, halos, and histograms.
- Standard and Expert use the same keeper thresholds and recommendation rules. They can still produce different keeper counts because Expert remeasures the frames with deeper samples and more guide/star candidates, which can change quality scores or penalties around the threshold.
- Analysis uses a local worker pool when available. Worker count is selected automatically from detected logical CPU cores, reported/estimated memory, and the largest files in the current batch. The app normally leaves one logical core free for the UI and reduces workers when large FITS/XISF files would create memory pressure.
- In the browser, memory detection is approximate because Safari/Firefox may not expose physical RAM. The app then uses a conservative fallback. In the Electron desktop wrapper, the app can read real local CPU and RAM values and use them for the same automatic worker choice.
- If Web Workers are unavailable or blocked, analysis falls back to the original local single-thread path.
- During analysis, the summary panel shows elapsed time and estimated remaining seconds. The estimate starts after the first frame has completed and improves as more frames finish. With workers, the remaining-time estimate accounts for parallel frames in progress.
- **Stop Analysis** terminates active workers and stops queued frames. Frames that already completed remain in the result grid, and clicking **Analyse** again processes the missing frames incrementally.
- After large-batch analysis, scoring-control changes are debounced and preview-stretch thumbnail refresh runs in small UI-friendly chunks, so changing weights, halo penalty, or preview stretch does not lock the app in one long synchronous refresh.
- The banner logo is bundled locally at `assets/logo-moon-conjunction.png`, so the app does not need the original external drive to display it.
- The **Moon & Sky Context** panel is informational. **Moon illuminated** is the lit fraction of the visible lunar disc; **Moon Sep** is the great-circle angular distance from Moon to target, so it does not assume equal altitude; **Moon Alt** is the Moon's local altitude. Potential Moon Exposure combines those distinct values with target altitude and filter sensitivity. It never changes a score by itself.
- Moon values use the UTC exposure midpoint. The app prefers `DATE-AVG`/`DATE-MID`, then derives the midpoint from `DATE-OBS` or `DATE-END` and exposure duration. `MJD`/`JD` variants and a timestamp in the file path are supported fallbacks. A timestamp without an explicit time zone is treated as UTC, which is standard for astronomy acquisition metadata.
- Moon phase and position are calculated by bundled original JavaScript in `moon-calculation.js`. It uses low-precision lunar/solar elements and principal perturbations; it does not call a vendor, load an external script, use a location service, or require an internet connection.
- Light frames are separated into observing sessions when dated exposures are more than eight hours apart. Context cards are then separated by object shot, filter, and observing site, so mixed-night and mixed-location batches are not summarised as one misleading range.
- Site coordinates are read per frame from common FITS/XISF fields (`SITELAT`/`SITELONG`, `LAT-OBS`/`LONG-OBS`, `OBSLAT`/`OBSLONG`, `LATITUDE`/`LONGITUDE`, or `OBSGEO-B`/`OBSGEO-L`). Header coordinates have priority. **Manage observing sites** deduplicates detected header locations, lets the user save or update their local names, and automatically applies a saved name to later coordinates within about `0.002 deg` (roughly 200 m). The FITS/XISF coordinates and source remain authoritative. When coordinates are missing, saved sites can instead be assigned to individual folders. City names are not resolved because the app deliberately contains no online geocoder or bundled city database.
- Potential Moon Exposure is `0` when the Moon is below the local horizon. Otherwise it combines illuminated fraction, Moon altitude, Moon-to-target separation, target altitude, and filter sensitivity. Broadband/unknown filters receive the full context factor, RGB is reduced, OIII is reduced further, and Ha/SII are least sensitive.
- The sky label compares that astronomical context with observed background impact from median-based structure, median lift, and same-object/filter star loss. Strong transient structure becomes **Cloud likely**; when plausible Moon exposure and a remaining smooth lift are also present, the label becomes **Moonlit cloud**. Smooth brightening without cloud residuals can be labelled likely Moonlight or non-Moon brightening.
- **Maximum Moon Penalty** is a remembered numeric entry from `0%` to `100%`; `0%` disables it. A Light frame must have at least Moderate Potential Moon Exposure and a meaningful Moon-explained smooth lift. The actual reduction is the entered maximum multiplied by Moon exposure and the smooth lift remaining after discounting cloud residuals. A cloud penalty can apply at the same time, and the combined Moon/cloud reduction is capped at 75% of the score entering the sky-impact stage.
- Shows the count of real astronomy frames and ignores hidden system sidecar files such as macOS `._...` entries.
- FITS support targets image data in the primary HDU with BITPIX `8`, `16`, `32`, `64`, `-32`, or `-64`.
- XISF support targets uncompressed monolithic `.xisf` files with attached image data. Supported sample formats are `UInt8`, `Int8`, `UInt16`, `Int16`, `UInt32`, `Int32`, `Float32`, and `Float64`. Compressed, distributed, external-block, complex, and 64-bit integer XISF data are reported as unsupported for now.
- Preview stretch is adjustable after analysis; `0%` is neutral/linear and higher values progressively lift faint detail.
- Preview images are rendered losslessly to avoid compression blocks in the grid and zoom viewer.
- The zoom viewer keeps the full preview stable by showing the same grid-stretch thumbnail fit-to-window. The magnifier lens uses a separate high-resolution source, up to 9000 pixels on the longest side with a 48 MP safety budget, controlled by the **Lens Stretch** slider.
- The zoom viewer shows only 12 compact Light-frame metrics: score/status, filter, object, sharpness, noise, HFR, roundness, eccentricity, star count, tracking, cloud status, and clipping. The strip stays on one horizontally scrollable row on narrow windows. RA/DEC, UTC, Moon details, camera geometry, exposure, temperature, mean, near-saturation, and guide-sample counts remain available on the frame card or in CSV export.
- In the zoom star overlay, teal/green circles are clean guide/reference stars; amber circles are borderline-shape reference stars; orange circles are reliable corner reference stars with poor local shape, useful for spotting coma/field curvature/tilt; red circles are central guide-sample stars supporting a `Possible` or `Severe` tracking warning; yellow circles or links are repeat-drift candidates; and a white circle marks the clicked star whose HFR/FWHM/roundness is shown in the zoom status line. Tiny/faint detections are not circled because they are not reliable enough for guiding diagnosis.
- Star overlays and star/tracking/halo calculations are only used for light frames; Flats, Biases, Darks, and Dark Flats are judged with calibration-specific measures instead.
- FITS/XISF sharpness, roundness, HFR, and clipping are scored from linear image data, not from the stretched preview image.
- FITS/XISF clipping and near-saturation are measured on the full-resolution data while the frame is decoded, so small saturated star cores are not averaged away.
- In v0.3.0, FITS sharpness, roundness, HFR/FWHM, clipping, clouds, flats, halos, and repeat-drift work from the original FITS pixel grid. Standard and Expert differ by sampling depth and budgets, not by a smaller FITS analysis image.
- In v0.3.1, tracking detection also measures wider profiles around the brightest stars. This catches coherent guiding/mount/wind trails when the tight star core still looks deceptively round.
- In v0.3.2, tracking detection moved to central-field big and medium stars rather than the full field, so telescope-dependent edge/corner aberrations are less likely to be mistaken for guiding drift.
- In v0.3.3, red star overlay circles were made stricter: red means a guide-sample star supporting a `Possible` or `Severe` tracking warning, not every mildly elongated detected star.
- In v0.3.4, the overlay was changed to show only the guide-star sample used for tracking analysis. Tiny/faint detections are excluded from the overlay and from guiding/tracking decisions.
- After v0.3.6, the visual overlay includes reliable full-field guide/reference stars again so corners can be inspected manually, while tracking severity remains based on the central guide-star sample. Poorly shaped corner reference stars are orange, not red, because they can be optical/corner behaviour rather than guiding drift.
- In v0.3.5, the cloud detector used background range and structure as its warning gate, with star-loss and background-lift as supporting evidence. It is a deterministic heuristic and does not require an online model or image-training dataset.
- In v0.3.6, uncompressed monolithic XISF support was added. XISF files use the same scoring pipeline as FITS after their XML header and attached linear pixels are decoded.
- In v0.3.7, the cloud detector received a conservative false-positive guard. Smooth structure alone is capped as unconfirmed; normal cloud warnings need relative star loss, star loss plus background lift, or an extreme structure case.
- In v0.3.8, the preview inspection view was sharpened: detail renders can be larger, normal zoom is capped to avoid fake enlargement, and the magnifier adds 12x and 16x levels.
- In v0.3.9, the inspection detail render uses a gentler stretch than the grid preview, reducing the over-stretched look when the magnifier is active.
- In v0.3.10, the full zoom preview was restored to the normal grid stretch. Only the magnifier lens uses the gentler stretch, and it waits for its high-resolution source instead of magnifying the temporary low-resolution thumbnail.
- In v0.3.11, the zoom slider was removed. The opened preview now stays fit-to-window, and that toolbar space is used for a **Lens Stretch** slider that rebuilds only the magnifier source.
- In v0.3.12, the opened full preview no longer swaps to a delayed high-resolution render. It stays visually identical to the grid-stretch preview, improving open speed and avoiding a delayed stretch/brightness change. High-resolution rendering is reserved for the magnifier lens, and borderline overlay stars are amber instead of green.
- In v0.3.13, cloud background structure and same-object/filter background-lift evidence use the sampled pixel median instead of the arithmetic mean. The general `Mean` metric remains available for other image measurements.
- Sharpness scoring blends FWHM and HFR so tight-star measurements are less fragile.
- Star metrics use all detected stars in each image; very dense fields can take longer to analyse.
- Star count is scored relative to the current object-shot/filter group to help catch clouds, haze, fog, or dawn reducing visible stars without comparing different targets.
- FITS/XISF filter names are detected from metadata such as `FILTER`; file and folder names are used as a fallback.
- FITS/XISF light-frame object shots are detected from RA/DEC metadata such as `OBJCTRA`/`OBJCTDEC`, `RA`/`DEC`, or WCS `CRVAL1`/`CRVAL2`.
- FITS/XISF focal length, pixel size, binning, and WCS pixel scale are detected when present and used to calculate the object-shot grouping tolerance.
- Coordinates are shown in astronomy format: RA as `HHh MMm SS.Ss` and DEC as signed `DDdeg MM' SS.S"`.
- FITS/XISF frame types are detected from metadata such as `IMAGETYP`; file and folder names are used as a fallback.
- FITS/XISF exposure and camera temperature are detected from common metadata such as `EXPTIME` and `CCD-TEMP`; filenames like `-10.00_300.00s` are used as a fallback.
- FITS/XISF camera/sensor model is detected from metadata such as `INSTRUME`, `CAMERA`, `CCDNAME`, `DETECTOR`, and `SENSOR`; the file path is used as fallback for names like `IMX571`, `ASI2600`, or `QHY268`.
- Mixed-filter sessions are grouped by filter for scoring, so `Ha`, `OIII`, `L`, `R`, `G`, and `B` frames are compared fairly.
- Mixed-target light sessions are grouped by object shot for scoring, so frames from a different RA/DEC are not compared as if they were the same deep-sky object.
- Mixed frame-type folders are grouped by type, so `Flat`, `Dark`, `Bias`, and `Dark Flat` frames are not scored as weak light frames.
- For light frames, sharpness, noise, and star count are relative to the current object-shot/filter group; roundness and clipping use absolute scoring.
- Light-frame clipping uses both `clipping_percent` and `near_saturation_percent`; the CSV also exports `clipping_pressure` and `clipping_score`. Calibration frames treat saturated bright pixels as calibration evidence, not as light-frame highlight clipping.
- Cloud detection creates `Possible Cloud` or `Likely Cloud` warnings when a frame differs from nearby same-object/filter frames in several batch-relative measurements. Raw background range remains diagnostic, but stable range/structure alone does not trigger a warning.
- Halo detection compares broad annuli around bright stars with the local background. It creates `Possible Halo` or `Likely Halo` warnings and amber preview rings; the same rings appear in the zoom view when the star overlay is enabled. By default it does not change the quality score; enable **Penalise Halo** to apply score penalties.
- Calibration report cards appear when calibration frames are present. They summarize each Flat/Dark/Bias/Dark Flat set, including frame count, set median, median range, Flat artefact mismatches, median outliers, exposure/temperature match checks, hot-pixel outliers, and gradient/light-leak warnings.
- Default scoring weights are Sharpness `40%`, Noise `15%`, Roundness `20%`, Star Count `15%`, and Clipping `10%`.
- Default keeper thresholds are `L >= 75`, `R/G/B/Ha >= 70`, `OIII/SII >= 65`, and `Unknown >= 70` unless changed in the UI.
- Calibration frames use type-specific checks with `70` as the default keep line.
- In browsers, folder-to-folder copy uses the File System Access API where available. In the Electron desktop app, folder-to-folder copy uses native filesystem access.
- Selected files keep their relative subfolder structure when copied; enabling **Copy by Filter** and/or **Copy by Type** adds those folders above that path.
- CSV export supports comma, semicolon, tab, and pipe separators, and remembers the selected separator in the same browser.
- CSV rows include `calculation_version` and `analysis_pixel_source` so score changes between app versions can be compared later.
- CSV rows also include directional-trail fields so guiding false negatives can be investigated after a batch run.
- Light-frame cards show **Guide Stars** as `count / central radius`, showing how many reliable guide-sample stars were used for the tracking judgement.

## Filter Detection

For FITS files, the app reads the FITS header first. For XISF files, it reads the XML header first, including embedded `FITSKeyword` entries and common native `Property` aliases. It checks these metadata keys:

`FILTER`, `FILTER1`, `FILTER2`, `FILTER3`, `FILTNAME`, `FILTNUM`, `FILTERID`, `INSFLNAM`, `OPTIC`, and `FILT`.

Detected values are normalised into common filter names:

- `L`, `Lum`, `Luminance` -> `L`
- `R`, `Red` -> `R`
- `G`, `Green` -> `G`
- `B`, `Blue` -> `B`
- `Ha`, `H-alpha`, `HydrogenAlpha` -> `Ha`
- `OIII`, `O3`, `OxygenIII` -> `OIII`
- `SII`, `S2`, `SulfurII`, `SulphurII` -> `SII`
- `Clear`, `Open` -> `Clear`

If the header has no usable filter, the app falls back to the file and folder path. For example, folders or filenames containing `Ha`, `OIII`, `SII`, `L`, `R`, `G`, `B`, `Clear`, or custom names such as `L-eXtreme` can be used for grouping.

If neither the header nor the path gives a usable filter, the image is grouped as `Unknown`.

## Object Shot Detection

For FITS/XISF light frames, the app checks whether frames are aimed at the same deep-sky object before doing relative scoring. It reads RA/DEC from paired metadata keys such as:

`OBJCTRA`/`OBJCTDEC`, `OBJRA`/`OBJDEC`, `RA_OBJ`/`DEC_OBJ`, `TELRA`/`TELDEC`, `RA`/`DEC`, and WCS `CRVAL1`/`CRVAL2`.

RA can be sexagesimal (`12:34:56`) or decimal. Sexagesimal RA is treated as hours. Decimal WCS `CRVAL1` is treated as degrees; other decimal RA values up to `24` are treated as hours and values above `24` as degrees.

The app also reads target names from keywords such as `OBJECT`, `OBJNAME`, and `TARGET` when available. This is metadata reading, not image recognition or plate solving. The name is used as a friendly label, but the actual grouping is based on RA/DEC separation.

To decide how much RA/DEC deviation is acceptable, the app estimates the field of view:

- First choice: WCS pixel scale from `CDELT1`/`CDELT2` or the `CD` matrix.
- Fallback: pixel scale from `206.265 * pixel_size_microns * binning / focal_length_mm`.

Focal length keywords include `FOCALLEN`, `FOC_LEN`, `FOCLEN`, `FOCAL`, and `EFL`. Pixel size keywords include `XPIXSZ`/`YPIXSZ`, `XPIXSIZE`/`YPIXSIZE`, `PIXSIZE1`/`PIXSIZE2`, `CCDXPIXE`/`CCDYPIXE`, and `PIXSIZE`. Binning is read from keywords such as `XBINNING`/`YBINNING`, `CCDBINX`/`CCDBINY`, `BINNING`, or `CCDSUM`.

The tolerance is `18%` of the smaller field-of-view dimension, clamped between about `2.1 arcmin` and `54 arcmin`. If scale metadata is missing, the fallback tolerance is `15 arcmin`.

Light-frame relative scores are then calculated inside each `object shot + filter` group. This prevents the app from comparing star count, sharpness, noise, or cloud evidence across different targets. If RA/DEC is missing, those lights stay in an `Unknown Object` group, which preserves the previous same-filter behaviour.

## Frame Type And Calibration Detection

For FITS files, the app reads the FITS header first. For XISF files, it reads embedded `FITSKeyword` entries and common native `Property` aliases first. It checks these frame-type metadata keys:

`IMAGETYP`, `IMAGETYPE`, `FRAME`, `FRAMETYP`, `FRAMETYPE`, `OBSTYPE`, `EXPTYPE`, and `PICTYPE`.

Detected values are normalised into:

- `Light`, `Object`, `Science` -> `Light`
- `Flat`, `Flats`, `Flat Field`, `MasterFlat` -> `Flat`
- `Dark`, `Darks`, `MasterDark` -> `Dark`
- `Bias`, `Biases`, `Offset`, `Zero`, `MasterBias` -> `Bias`
- `DarkFlat`, `FlatDark`, `Dark Flat`, `Flat Dark` -> `Dark Flat`

If the header has no usable frame type, the app falls back to the file and folder path. For example, folders named `LIGHT`, `FLAT`, `DARK`, `BIAS`, or `DARKFLAT` are used for grouping.

`Light` and `Unknown` frames use the normal star-quality analysis. Calibration frames bypass star, tracking, repeat-drift, halo, and light-frame elongation analysis, then use purpose-specific checks:

- `Flat`: checks for a healthy mid-level signal, saturation, reasonable uniformity, broad gradients, and pixel outliers. Flat previews include a compact linear histogram with the target band and median marker. Local peak count is not used as a flat warning because broad flat-field structure is expected.
- `Dark`: checks for low signal, bright saturated pixels, hot/dark outliers, gradients, and unusual brightness or spread.
- `Bias`: checks for very low signal, bright saturated pixels, hot/dark outliers, gradients, and unusual spread.
- `Dark Flat`: checks similarly to dark frames, with low signal and few bright saturated pixels expected.

Calibration frames are marked `Keep`, `Review`, or `Discard` from their calibration score and warnings. When several calibration frames of the same type are present, the app also flags frames whose level differs noticeably from the rest of that set.

The app also detects exposure and camera temperature for compatibility checks. FITS/XISF metadata is used first; file names like `-10.00_300.00s` are used as a fallback. Darks are checked against lights for both exposure and temperature. Flats, Biases, and Dark Flats are checked against lights for camera temperature only.
