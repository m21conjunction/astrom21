# Astronomy Sub Analyser (Offline)

Current app version: **0.2.0**.

This app runs fully offline in your browser and ranks astronomy images by quality.

## What it does

- Imports one or more local folders of images
- After results exist, newly added folders are analysed incrementally; existing measurements are kept and only new frames are decoded
- Runs heavy per-frame measurements in a local Web Worker pool when the browser supports it, with a main-thread fallback
- Adds **Stop Analysis** for very large batches; completed frames are kept and queued/active worker jobs are cancelled
- Scores each image using:
  - sharpness
  - noise level
  - star roundness (FWHM-based, blended with minor/major axis shape)
  - highlight clipping on light frames
- Detects likely tracking drift from elongated stars sharing a common direction
- Detects repeat drift where close, repeated star peaks appear at shifted positions
- Detects broad clouds or haze using large-scale background structure plus same-object/filter star-count loss
- Repeat-drift uses a bright-star pass to catch multi-copy stars even when the full-frame orientation signal is weak
- Applies cloud and tracking penalties, with repeat-drift and cloudy frames scored much lower than ordinary marginal frames
- Ranks images and labels each one: `Keep`, `Review`, or `Discard`
- Lets you select analysed images and copy them to another local folder
- Shows larger stretched previews in a result grid, with eccentricity, HFR, star count, and mean brightness under each image
- Shows an expandable **Why this score?** breakdown under each analysed frame
- Scores clipping from hard-clipped and near-saturated highlights, with full-resolution FITS clipping checks before downsampling
- Shows amber preview/zoom rings and a warning when broad halos are suspected around bright stars
- Lets you adjust preview stretch after analysis and click any preview to inspect it in a higher-resolution zoom view
- Adds zoom tools for detected-star overlays, repeat-drift markers, clicked-star FWHM/HFR readouts, and a 2x/4x/8x magnifier lens
- Detects FITS filters, shows filter tabs, and keeps the All view available
- Detects FITS light-frame RA/DEC, groups lights by object shot, and compares light scores inside the same object shot and filter
- Uses focal length and pixel size metadata, or WCS pixel scale when available, to derive the allowed RA/DEC deviation for object-shot grouping
- Adds Keep/Review/Discard result-group tabs below Filters so the grid can be grouped by recommendation
- Detects `Light`, `Flat`, `Dark`, `Bias`, and `Dark Flat` frame types and shows frame-type tabs
- Uses purpose-specific checks for calibration frames instead of light-frame star scoring
- Skips star, tracking, repeat-drift, halo, and light-frame elongation work on Flats, Darks, Biases, and Dark Flats
- Shows a calibration report by set, including median consistency, flat histogram target checks, light-leak/gradient warnings, and hot-pixel or brightness outlier signals
- Shows a compact linear histogram overlay on Flat previews, with the target band and median marker
- Applies strong Flat artefact penalties when a flat's histogram, spread, gradient, or tile pattern diverges from the rest of its Flat/filter set
- Detects camera/sensor model from FITS metadata or path and uses sensor-aware dark-frame outlier thresholds, including low-glow BSI profiles for IMX571/ASI2600/QHY268-style cameras
- Checks calibration compatibility against light frames: darks need matching exposure and camera temperature; flats, bias, and dark flats check camera temperature only
- Lets you adjust keeper score thresholds with per-filter numeric entry boxes
- Can copy selected images into filter-named and/or frame-type output folders
- Remembers the scoring and preview sliders, plus the sharpness mode, on the same browser
- Can restore the default percentage values from the toolbar
- Shows help markers beside the core scoring controls with calculation notes
- Exports a CSV report with all analysis parameters

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

- Supports common browser images (JPG/PNG/WebP/TIFF) plus FITS (`.fit`, `.fits`, `.fts`).
- Folders can be added one after another before or after analysis. When results already exist, clicking **Analyse** processes only newly added supported frames, then refreshes scores and reports for the combined batch. The folder list shows browser-safe relative folder paths because browsers hide full disk paths.
- **Analysis Mode** defaults to **Standard**. **Expert** mode re-measures frames with larger working images and heavier sampling for star size, roundness, repeat drift, flat artefacts, clouds, and histograms. It is slower, but better for borderline or suspicious frames.
- Analysis uses a local worker pool when available. Worker count is selected automatically from detected logical CPU cores, reported/estimated memory, and the largest files in the current batch. The app normally leaves one logical core free for the UI and reduces workers when large FITS files would create memory pressure.
- In the browser, memory detection is approximate because Safari/Firefox may not expose physical RAM. The app then uses a conservative fallback. In the Electron desktop wrapper, the app can read real local CPU and RAM values and use them for the same automatic worker choice.
- If Web Workers are unavailable or blocked, analysis falls back to the original local single-thread path.
- During analysis, the summary panel shows elapsed time and estimated remaining seconds. The estimate starts after the first frame has completed and improves as more frames finish. With workers, the remaining-time estimate accounts for parallel frames in progress.
- **Stop Analysis** terminates active workers and stops queued frames. Frames that already completed remain in the result grid, and clicking **Analyse** again processes the missing frames incrementally.
- After large-batch analysis, scoring-control changes are debounced and preview-stretch thumbnail refresh runs in small UI-friendly chunks, so changing weights, halo penalty, or preview stretch does not lock the app in one long synchronous refresh.
- The banner logo is bundled locally at `assets/logo-moon-conjunction.png`, so the app does not need the original external drive to display it.
- Shows the count of real astronomy frames and ignores hidden system sidecar files such as macOS `._...` entries.
- FITS support targets image data in the primary HDU with BITPIX `8`, `16`, `32`, `64`, `-32`, or `-64`.
- Preview stretch is adjustable after analysis; `0%` is neutral/linear and higher values progressively lift faint detail.
- Preview images are rendered losslessly to avoid compression blocks in the grid and zoom viewer.
- The zoom viewer uses a higher-resolution detail render than the grid preview, up to 6000 pixels on the longest side.
- In the zoom star overlay, teal/green circles are normal detected stars, red circles are elongated stars, yellow circles or links are repeat-drift candidates, and a white circle marks the clicked star whose HFR/FWHM/roundness is shown in the zoom status line. A few red stars at the edges can be normal coma or curvature; many red stars in one direction, or red stars connected by yellow repeat-drift links, is more suspicious.
- Star overlays and star/tracking/halo calculations are only used for light frames; Flats, Biases, Darks, and Dark Flats are judged with calibration-specific measures instead.
- FITS sharpness, roundness, HFR, and clipping are scored from linear FITS data, not from the stretched preview image.
- FITS clipping and near-saturation are measured on the full-resolution FITS data before downsampling, so small saturated star cores are not averaged away.
- In Standard mode, large FITS frames are measured on a higher-resolution linear working image up to `3600` pixels on the longest side; in Expert mode this rises to `7000` pixels. FWHM/HFR are scaled back to original-pixel units when downsampling is used.
- Sharpness scoring blends FWHM and HFR so tight-star measurements are less fragile.
- Star metrics use all detected stars in each image; very dense fields can take longer to analyse.
- Star count is scored relative to the current object-shot/filter group to help catch clouds, haze, fog, or dawn reducing visible stars without comparing different targets.
- FITS filter names are detected from header keywords such as `FILTER`; file and folder names are used as a fallback.
- FITS light-frame object shots are detected from RA/DEC header keywords such as `OBJCTRA`/`OBJCTDEC`, `RA`/`DEC`, or WCS `CRVAL1`/`CRVAL2`.
- FITS focal length, pixel size, binning, and WCS pixel scale are detected when present and used to calculate the object-shot grouping tolerance.
- Coordinates are shown in astronomy format: RA as `HHh MMm SS.Ss` and DEC as signed `DDdeg MM' SS.S"`.
- FITS frame types are detected from header keywords such as `IMAGETYP`; file and folder names are used as a fallback.
- FITS exposure and camera temperature are detected from common header keywords such as `EXPTIME` and `CCD-TEMP`; filenames like `-10.00_300.00s` are used as a fallback.
- FITS camera/sensor model is detected from headers such as `INSTRUME`, `CAMERA`, `CCDNAME`, `DETECTOR`, and `SENSOR`; the file path is used as fallback for names like `IMX571`, `ASI2600`, or `QHY268`.
- Mixed-filter sessions are grouped by filter for scoring, so `Ha`, `OIII`, `L`, `R`, `G`, and `B` frames are compared fairly.
- Mixed-target light sessions are grouped by object shot for scoring, so frames from a different RA/DEC are not compared as if they were the same deep-sky object.
- Mixed frame-type folders are grouped by type, so `Flat`, `Dark`, `Bias`, and `Dark Flat` frames are not scored as weak light frames.
- For light frames, sharpness, noise, and star count are relative to the current object-shot/filter group; roundness and clipping use absolute scoring.
- Light-frame clipping uses both `clipping_percent` and `near_saturation_percent`; the CSV also exports `clipping_pressure` and `clipping_score`. Calibration frames treat saturated bright pixels as calibration evidence, not as light-frame highlight clipping.
- Cloud detection creates `Possible Cloud` or `Likely Cloud` warnings when a frame has broad background structure and/or a same-object/filter star-count loss. Star-loss and mean-brightness comparisons require at least 3 light frames in the same object-shot/filter group. Unlike halo, cloud warnings always apply a quality penalty because clouds directly damage the subframe.
- Halo detection compares broad annuli around bright stars with the local background. It creates `Possible Halo` or `Likely Halo` warnings and amber preview rings; the same rings appear in the zoom view when the star overlay is enabled. By default it does not change the quality score; enable **Penalise Halo** to apply score penalties.
- Calibration report cards appear when calibration frames are present. They summarize each Flat/Dark/Bias/Dark Flat set, including frame count, set median, median range, Flat artefact mismatches, median outliers, exposure/temperature match checks, hot-pixel outliers, and gradient/light-leak warnings.
- Default scoring weights are Sharpness `40%`, Noise `15%`, Roundness `20%`, Star Count `15%`, and Clipping `10%`.
- Default keeper thresholds are `L >= 75`, `R/G/B/Ha >= 70`, `OIII/SII >= 65`, and `Unknown >= 70` unless changed in the UI.
- Calibration frames use type-specific checks with `70` as the default keep line.
- In browsers, folder-to-folder copy uses the File System Access API where available. In the Electron desktop app, folder-to-folder copy uses native filesystem access.
- Selected files keep their relative subfolder structure when copied; enabling **Copy by Filter** and/or **Copy by Type** adds those folders above that path.
- CSV export supports comma, semicolon, tab, and pipe separators, and remembers the selected separator in the same browser.

## Filter Detection

For FITS files, the app reads the FITS header first. It checks these keywords:

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

If the FITS header has no usable filter, or if the file is not FITS, the app falls back to the file and folder path. For example, folders or filenames containing `Ha`, `OIII`, `SII`, `L`, `R`, `G`, `B`, `Clear`, or custom names such as `L-eXtreme` can be used for grouping.

If neither the header nor the path gives a usable filter, the image is grouped as `Unknown`.

## Object Shot Detection

For FITS light frames, the app checks whether frames are aimed at the same deep-sky object before doing relative scoring. It reads RA/DEC from paired FITS keywords such as:

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

For FITS files, the app reads the FITS header first. It checks these frame-type keywords:

`IMAGETYP`, `IMAGETYPE`, `FRAME`, `FRAMETYP`, `FRAMETYPE`, `OBSTYPE`, `EXPTYPE`, and `PICTYPE`.

Detected values are normalised into:

- `Light`, `Object`, `Science` -> `Light`
- `Flat`, `Flats`, `Flat Field`, `MasterFlat` -> `Flat`
- `Dark`, `Darks`, `MasterDark` -> `Dark`
- `Bias`, `Biases`, `Offset`, `Zero`, `MasterBias` -> `Bias`
- `DarkFlat`, `FlatDark`, `Dark Flat`, `Flat Dark` -> `Dark Flat`

If the FITS header has no usable frame type, the app falls back to the file and folder path. For example, folders named `LIGHT`, `FLAT`, `DARK`, `BIAS`, or `DARKFLAT` are used for grouping.

`Light` and `Unknown` frames use the normal star-quality analysis. Calibration frames bypass star, tracking, repeat-drift, halo, and light-frame elongation analysis, then use purpose-specific checks:

- `Flat`: checks for a healthy mid-level signal, saturation, reasonable uniformity, broad gradients, and pixel outliers. Flat previews include a compact linear histogram with the target band and median marker. Local peak count is not used as a flat warning because broad flat-field structure is expected.
- `Dark`: checks for low signal, bright saturated pixels, hot/dark outliers, gradients, and unusual brightness or spread.
- `Bias`: checks for very low signal, bright saturated pixels, hot/dark outliers, gradients, and unusual spread.
- `Dark Flat`: checks similarly to dark frames, with low signal and few bright saturated pixels expected.

Calibration frames are marked `Keep`, `Review`, or `Discard` from their calibration score and warnings. When several calibration frames of the same type are present, the app also flags frames whose level differs noticeably from the rest of that set.

The app also detects exposure and camera temperature for compatibility checks. FITS headers are used first; file names like `-10.00_300.00s` are used as a fallback. Darks are checked against lights for both exposure and temperature. Flats, Biases, and Dark Flats are checked against lights for camera temperature only.
