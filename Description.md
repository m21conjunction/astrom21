# Astronomy Sub Analyser Calculation Description

Updated: 2026-09-16

Current app version: **0.3.10**.

This document describes the current measurements, scores, and preview annotations used by Astronomy Sub Analyser. It is general documentation, not a report for one specific image.

## Important Principles

- All analysis happens locally in the browser.
- FITS/XISF scores are measured from linear image pixel data, not from the stretched preview.
- The stretched preview is only for visual inspection.
- Light frames and calibration frames are scored differently.
- Light frames are compared within their detected object-shot/filter group where relative comparison is needed.
- Calibration frames are checked against expected calibration-frame behaviour instead of star quality.
- Calibration frames bypass light-only star, tracking, repeat-drift, halo, and elongation calculations.
- Several displayed values are raw measurements, while the final quality score uses normalised versions of those measurements.
- Analysis Mode controls how deeply expensive measurements are sampled. Standard is the default faster path; Expert is slower and uses deeper sampling budgets.
- Per-frame measurements run in a local Web Worker pool when supported. Workers change where the calculations run, not what the calculations mean.

## Processing Path

### Supported Input

The app accepts common image files plus FITS and XISF files:

- Browser image files: JPG, PNG, BMP, GIF, WebP, TIFF.
- FITS files: `.fit`, `.fits`, `.fts`.
- XISF files: `.xisf`.

Hidden/system files such as `.DS_Store`, `Thumbs.db`, `__MACOSX`, and macOS `._...` sidecar files are ignored.

### FITS Pixel Reading

For FITS files, the app reads the primary HDU image data.

Supported `BITPIX` values:

- `8`
- `16`
- `32`
- `64`
- `-32`
- `-64`

The app applies FITS scaling:

```text
scaled_pixel = raw_pixel * BSCALE + BZERO
```

If a FITS `BLANK` value is present, those pixels become `NaN` and are ignored by calculations that require finite pixels.

While reading FITS pixels, the app also computes the basic full-frame statistics in the same pass:

- finite pixel count
- mean
- standard deviation
- hard-clipped highlight count
- near-saturated highlight count

This avoids scanning the full FITS array multiple times for those core statistics.

### XISF Pixel Reading

For XISF files, the app reads uncompressed monolithic containers with the `XISF0100` preamble, a UTF-8 XML header, and attached image data referenced by `location="attachment:position:size"`.

Supported XISF sample formats:

- `UInt8`
- `Int8`
- `UInt16`
- `Int16`
- `UInt32`
- `Int32`
- `Float32`
- `Float64`

The XML header is used to read:

- image geometry
- sample format
- optional bounds
- byte order
- embedded `FITSKeyword` metadata
- common native XISF `Property` aliases for filter, frame type, exposure, camera temperature, target name, RA/DEC, focal length, pixel size, binning, and camera model

Mono XISF data is analysed directly. Colour XISF data is converted to luminance before scoring, using the same luma coefficients as bitmap files.

Compressed XISF data, distributed/external data blocks, complex samples, and 64-bit integer samples are not decoded yet. The app reports those as unsupported instead of attempting a partial or misleading score.

While reading XISF pixels, the app computes the same basic statistics as FITS in the same pass:

- finite pixel count
- mean
- standard deviation
- hard-clipped highlight count
- near-saturated highlight count

### Linear Astro Images, Preview, And Measurement

FITS and XISF frames can be large, so the app keeps separate visual and measurement paths:

- Full-resolution analysis pixels: the original FITS/XISF width and height.
- Preview image: longest side up to `1400` pixels.
- Zoom detail image: longest side up to `9000` pixels, with a `48 MP` pixel-budget cap.
- Normal zoom view: capped at `300%` and further limited to avoid enlarging beyond the native detail render.
- Magnifier lens: selectable `2x`, `4x`, `8x`, `12x`, and `16x`.

Preview and zoom images are downsampled only for display. FITS measurements in v0.3.0 and XISF measurements in v0.3.6 use the full-resolution pixel grid in both Standard and Expert modes.

Star candidates are scanned on the full-resolution data. FWHM, HFR, roundness, and eccentricity are then measured only in small local windows around each star candidate, so the app does not run expensive star-shape maths across every pixel.

Expensive whole-frame measurements such as Laplacian sharpness support, local noise, and global elongation use regular sampling steps. That keeps the calculation responsive while still sampling across the full field instead of measuring a smaller downsampled frame.

### Analysis Modes

Standard mode preserves the faster current behaviour:

- bitmap analysis longest side up to `1400` pixels
- FITS/XISF measurements use full-resolution pixels
- distribution and Flat histogram samples up to `250000` pixels
- cloud/Flat tile sampling target of `480` pixels per tile
- Laplacian sharpness support sample target of `900000` pixels
- local-noise sample target of `900000` pixels
- global-elongation sample target of `700000` pixels
- directional guiding/trail check on up to the brightest `1400` stars with a `10` pixel wide-profile radius
- guiding/tracking decisions use the central `72%` field radius first, expanding only to the central `88%` radius if too few central stars are available
- repeat-drift pairing limit of `80000` close-star pairs
- repeat-drift bright-star subset up to `1500` stars
- zoom guide-star overlay payload up to `2500` displayed stars

Expert mode is intended for borderline or suspicious frames:

- bitmap analysis longest side up to `7000` pixels
- FITS/XISF measurements use full-resolution pixels
- distribution and Flat histogram samples up to `1000000` pixels
- cloud/Flat tile sampling target of `1600` pixels per tile
- Laplacian sharpness support sample target of `2600000` pixels
- local-noise sample target of `2600000` pixels
- global-elongation sample target of `2000000` pixels
- directional guiding/trail check on up to the brightest `4200` stars with a `14` pixel wide-profile radius
- guiding/tracking decisions use the central `72%` field radius first, expanding only to the central `88%` radius if too few central stars are available
- repeat-drift pairing limit of `240000` close-star pairs
- repeat-drift bright-star subset up to `5000` stars
- zoom guide-star overlay payload up to `6000` displayed stars

Switching mode does not re-score old measurements. On the next **Analyse** run, frames measured in the other mode are decoded and measured again.

Standard and Expert use the same final scoring formula, keeper thresholds, and recommendation rules. The difference is measurement depth before scoring. Expert uses larger samples and more guide/star candidates, so it can change the measured sharpness, HFR, roundness, noise, star count, cloud structure, elongation, tracking, and repeat-drift values. A frame close to the keeper threshold can therefore move from Review/Discard to Keep, or the reverse, even though the keeper rule itself did not change.

This is expected behaviour. Standard is the fast screening mode and may be a little jumpier near thresholds because some expensive measurements are sampled more lightly. Expert is slower, but it is usually the better mode for borderline batches, suspicious guiding cases, and final keeper selection.

### Analysis Execution, Workers, And Stop

When Web Workers are available, the app sends per-frame measurement work to a local worker pool:

- Worker count is selected automatically for each **Analyse** run.
- The CPU limit uses detected logical cores and normally leaves one logical core free for the UI.
- The memory limit uses real local RAM in the Electron desktop wrapper, approximate browser memory when the browser exposes it, or a conservative fallback when memory is hidden by the browser.
- The app also estimates per-worker memory pressure from the largest selected file. Expert mode reserves more memory per worker than Standard mode because it uses deeper measurement budgets.

The selected count is the lowest of the pending frame count, CPU limit, and memory limit. During analysis, the summary panel shows the auto-selected worker count and whether the memory source was desktop memory, browser memory, browser heap limit, or fallback memory estimate.

Each worker receives the original local file object, reads FITS, XISF, or bitmap data locally, measures the frame, and sends the measurement result back to the main UI. The main UI then:

- reattaches the original file object for zoom and copy/export workflows
- regenerates the lossless preview thumbnail
- recomputes final group-relative scores after the batch finishes or stops

The worker pool does not upload data and does not require internet access.

If Web Workers are unavailable or blocked, the app falls back to single-thread local analysis on the main page.

The **Stop Analysis** button stops the current run:

- queued frames are not started
- active worker jobs are terminated
- completed frame measurements are kept
- final scores and reports are rebuilt from completed plus existing measurements
- clicking **Analyse** again processes the still-missing frames incrementally

In the single-thread fallback path, the stop request is checked between frames. In the worker path, stop is faster because active workers can be terminated immediately.

### Frame-Type Shortcuts

The detected frame type changes which expensive measurements run.

`Light` and `Unknown` frames run the normal light-frame path:

- star detection
- FWHM/HFR star size
- roundness and eccentricity
- repeat-drift pairing
- tracking detection
- halo detection
- light-frame elongation
- cloud scoring

Calibration frames (`Flat`, `Dark`, `Bias`, and `Dark Flat`) skip those light-only measurements:

- no star detection
- no FWHM/HFR star-size measurement
- no roundness/eccentricity star measurement
- no repeat-drift pairing
- no tracking detection
- no halo detection
- no light-frame elongation pass

Instead, calibration frames run calibration-specific checks: signal level, spread, saturation evidence, structure/gradient, pixel outliers, flat histograms, set consistency, and exposure/temperature compatibility.

In CSV export, skipped light-only fields on calibration rows are written as `skipped`.

### Bitmap Image Processing

Browser image files are loaded through the browser image decoder and drawn to an analysis canvas. In Standard mode the longest side is up to `1400` pixels; in Expert mode it is up to `7000` pixels. Grid previews remain limited to the normal preview size so the UI stays responsive.

Colour bitmap images are converted to luminance:

```text
luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue
```

For bitmap images, star-size measurements are in the analysis canvas pixel scale.

## Display Stretch

Preview stretch does not affect scoring. It only affects thumbnails and inspection display.

At `0%` preview stretch, the preview is neutral/linear.

Grid thumbnails and the full zoom preview use the selected stretch value directly. The magnifier lens uses a separate high-resolution source with a gentler stretch:

```text
magnifier_strength = (preview_stretch / 100) * 0.45
```

That keeps the magnifier from over-amplifying the background while the full preview stays visually consistent with the grid card. At `0%`, the grid, full zoom preview, and magnifier all remain neutral/linear.

For stretch values above `0%`:

```text
strength = preview_stretch / 100               for grid thumbnails and full zoom preview
strength = magnifier_strength                  for the magnifier lens source
low_percentile = strength * 0.01
high_percentile = 1 - strength * 0.015
asinh_strength = strength * 14
gamma = 1 - strength * 0.28
```

Each pixel is normalised between the low and high percentile bounds. Then:

```text
if asinh_strength is near zero:
    output = normalised ^ gamma
else:
    output = asinh(normalised * asinh_strength) / asinh(asinh_strength)
    output = output ^ gamma
```

For colour images, the app computes the stretched luminance and scales RGB channels by the ratio between stretched luminance and original luminance.

## Basic Statistical Measures

### Mean

Displayed as `Mean`.

The app computes the arithmetic mean of all finite grayscale pixels:

```text
mean = sum(pixel) / finite_pixel_count
```

For FITS files, this is in scaled FITS pixel units. For XISF files, this is in the decoded XISF sample units. For bitmap images, this is in luminance units from `0` to `255`.

### Standard Deviation

The app computes standard deviation with a stable one-pass algorithm.

It is used internally for:

- star detection threshold
- background/noise sampling
- tracking/elongation detection
- `noise_percent`

It is not currently shown directly in the image card.

### Median Percent

CSV field: `median_percent`.

The app samples finite pixels, sorts the sample, and finds:

- `p01`: 1st percentile
- `median`: 50th percentile
- `p99`: 99th percentile

The sample cap is `250000` pixels in Standard mode and `1000000` pixels in Expert mode.

Then:

```text
median_percent = median / saturation_level * 100
```

For FITS integer data, `saturation_level` is derived from the high end of the scaled FITS integer range. For XISF integer data, it is derived from the sample format range. For XISF floating-point data, it uses the declared XISF `bounds` when present. For bitmap images, the fallback saturation level is `252`.

### Spread Percent

CSV field: `spread_percent`.

```text
spread_percent = (p99 - p01) / saturation_level * 100
```

This is used heavily for calibration frames, especially flat uniformity and dark/bias spread.

### Noise Percent

CSV field: `noise_percent`.

```text
noise_percent = standard_deviation / abs(mean) * 100
```

This is a broad image-distribution statistic. It is different from the displayed `Noise` metric described below.

## Star Detection

Star detection is used for:

- star count
- FWHM
- HFR
- roundness
- eccentricity
- sharpness
- tracking drift
- repeat drift
- zoom star overlay

For FITS/XISF files, star detection runs on the full-resolution decoded pixel grid in both Standard and Expert modes. For bitmap files, star detection runs on the selected analysis canvas: up to `1400` pixels on the longest side in Standard mode and up to `7000` pixels in Expert mode.

### Detection Threshold

A pixel can be a star candidate if:

```text
pixel_value >= mean + 1.8 * standard_deviation
```

The candidate must also be finite and below the saturation threshold.

### Local Maximum Requirement

The candidate pixel must be brighter than its eight immediate neighbours:

```text
top-left, top, top-right,
left,          right,
bottom-left, bottom, bottom-right
```

### Centroid

For each candidate, the app examines a `5 x 5` patch around the candidate pixel.

Weights are:

```text
weight = sample_value - image_mean
```

Only positive weights are used.

The centroid is the weighted centre of the patch:

```text
center_x = sum(weight * x_offset) / sum(weight)
center_y = sum(weight * y_offset) / sum(weight)
```

### Moment Shape

The app computes weighted second moments around the centroid:

```text
mxx = sum(weight * dx * dx) / sum(weight)
myy = sum(weight * dy * dy) / sum(weight)
mxy = sum(weight * dx * dy) / sum(weight)
```

From these moments it computes a major and minor variance axis.

Moment-based axis roundness is:

```text
axis_roundness = sqrt(minor_variance / major_variance)
```

Values:

- `1.0` means circular by moment shape.
- Lower values mean more elongated.

### FWHM Along Star Axes

The app measures FWHM along the star major and minor axes.

For each axis:

1. Compute the half-maximum level:

```text
half_maximum = background_level + (peak_value - background_level) * 0.5
```

2. Sample outward in both directions along the axis using bilinear interpolation.
3. Step size is `0.35` pixels.
4. Maximum search radius is `8.5` pixels.
5. The distance where the sampled value crosses half maximum is interpolated.
6. FWHM is the positive-side distance plus the negative-side distance.

If FWHM cannot be measured reliably along both axes, the app falls back to moment-derived FWHM:

```text
moment_fwhm = 2.355 * sqrt(axis_variance)
```

### FWHM Roundness

CSV field: `fwhm_roundness`.

```text
fwhm_roundness = minor_fwhm / major_fwhm
```

Values:

- `1.0` means the measured FWHM is equal in both axes.
- Lower values mean elongated stars.

### Combined Star Roundness

Displayed as `Round`.

CSV field: `star_roundness`.

Each star gets a blended roundness:

```text
star_roundness_single = 0.75 * fwhm_roundness + 0.25 * axis_roundness
```

The image-level roundness is the average over all detected stars:

```text
star_roundness = average(star_roundness_single)
```

The UI displays it as a percent:

```text
Round = star_roundness * 100
```

This is a direct score component. It is not min/max normalised.

### Axis Roundness

CSV field: `axis_roundness`.

This is the average of moment-based axis roundness over all detected stars:

```text
axis_roundness = average(sqrt(minor_variance / major_variance))
```

It is kept in the CSV to show the moment-shape part of the roundness calculation.

### Eccentricity

Displayed as `Ecc`.

CSV field: `eccentricity`.

For each star:

```text
axis_ratio = major_fwhm / minor_fwhm
eccentricity = sqrt(1 - 1 / axis_ratio^2)
```

The image-level eccentricity is the median over detected stars.

Values:

- `0.0` means circular.
- Higher values mean more elongated.
- It is not directly a weighted score component, but it helps diagnose star shape and is related to roundness/tracking behaviour.

### HFR

Displayed as `HFR`.

CSV field: `hfr`.

For each star:

```text
hfr = sqrt(major_fwhm * minor_fwhm) / 2
```

The image-level HFR is the median over detected stars.

Interpretation:

- Lower HFR means tighter stars.
- Higher HFR means larger or softer stars.

HFR is used in the sharpness score.

### Star Count

Displayed as `Stars`.

CSV field: `star_count`.

This is the total number of detected stars. The current implementation uses all detected stars for metrics. In very dense fields this can take longer.

Star count is also used as a score component, but it is normalised within the current object-shot/filter group. A frame with far fewer detected stars than same-object and same-filter frames loses score, which helps catch clouds, haze, fog, dawn, or poor transparency without comparing different targets.

## Sharpness

Displayed as `Sharp`.

CSV field: `sharpness`.

The displayed `Sharp` value is the raw star sharpness measurement:

```text
star_sharpness = 1 / max(median_major_fwhm * 0.8 + p35_major_fwhm * 0.2, 0.2)
```

Where:

- `median_major_fwhm` is the median major-axis FWHM of detected stars.
- `p35_major_fwhm` is the 35th percentile major-axis FWHM.
- Smaller FWHM gives higher sharpness.

This displayed value is not the same as the final weighted sharpness contribution. The final quality score uses a normalised sharpness component.

### Global Sharpness

CSV field: not exported directly, but used internally.

The app also computes a whole-image edge contrast measurement using Laplacian variance:

```text
laplacian = 4 * centre - left - right - top - bottom
sharpness_global = variance(laplacian)
```

This captures image-wide edge contrast. It can be useful, but by itself it can be affected by noise, star density, and target structure.

### Sharpness Modes

The app has two sharpness modes.

#### FWHM Only

The sharpness score is based on star size:

```text
star_size_score = 0.65 * normalised(star_sharpness) + 0.35 * normalised(1 / HFR)
sharpness_score = star_size_score
```

#### Hybrid

Hybrid mode adds a smaller amount of whole-image edge contrast:

```text
star_size_score = 0.65 * normalised(star_sharpness) + 0.35 * normalised(1 / HFR)
sharpness_score = 0.25 * normalised(global_laplacian_variance) + 0.75 * star_size_score
```

Hybrid is the default.

## Noise

Displayed as `Noise`.

CSV field: `noise`.

The displayed noise metric estimates local background residuals.

The app samples pixels that are likely background:

```text
finite pixel
pixel > 5
pixel <= mean + standard_deviation
```

For each sampled pixel, the app compares the pixel value to the average of its `3 x 3` neighbourhood:

```text
local_mean = average(3x3 neighbourhood)
residual = abs(pixel - local_mean)
```

The image noise metric is:

```text
noise = average(residual)
```

Interpretation:

- Lower is better.
- Higher means more local background fluctuation.

In the final quality score, noise is min/max normalised within the object-shot/filter group and inverted:

```text
noise_score = 1 - normalised(noise)
```

So a lower raw `Noise` value gives a higher score contribution.

## Clipping

Displayed as `Clip` and `Near Sat`.

CSV fields:

- `clipping_percent`
- `near_saturation_percent`
- `clipping_pressure`
- `clipping_score`

The app counts finite pixels at or above a hard clipping threshold:

```text
clipping_percent = clipped_pixel_count / finite_pixel_count * 100
```

It also counts finite pixels at or above a lower near-saturation threshold:

```text
near_saturation_percent = near_saturated_pixel_count / finite_pixel_count * 100
```

`near_saturation_percent` includes hard-clipped pixels, because clipped pixels are also near saturation.

For bitmap files:

```text
clipping_threshold = 250
near_saturation_threshold = 245
```

For FITS integer and XISF files with a known saturation range, these measurements are made from the full-resolution linear data during pixel decoding, before any display downsampling. This matters because display downsampling can average one saturated star core with neighbouring pixels and hide the clipping.

The FITS thresholds are derived from the scaled integer range:

```text
scaled_min = raw_min * BSCALE + BZERO
scaled_max = raw_max * BSCALE + BZERO
high = max(scaled_min, scaled_max)
low = min(scaled_min, scaled_max)
span = max(high - low, abs(BSCALE), 1)
clipping_threshold = high - max(abs(BSCALE) * 3, span * 0.00001)
near_saturation_threshold = high - max(abs(BSCALE) * 3, span * 0.005)
```

So near saturation means roughly the top `0.5%` of the scaled integer range, while hard clipping means pixels essentially at the maximum.

For FITS floating-point data, the clipping and near-saturation thresholds are effectively infinite because there is no fixed integer maximum. For XISF floating-point data, the declared XISF `bounds` can provide that range, commonly `0:1`; if no usable bounds exist, the app avoids inventing a saturation point.

The clipping score used in final light-frame quality is no longer a simple linear percentage. It uses a pressure curve so small saturated star cores can affect the score:

```text
hard_clipping_pressure = sqrt(clamp(clipping_percent / 0.01, 0, 1))
near_saturation_pressure = sqrt(clamp(near_saturation_percent / 0.10, 0, 1)) * 0.8
clipping_pressure = max(hard_clipping_pressure, near_saturation_pressure)
clipping_score = 1 - clipping_pressure
```

Interpretation:

- `0%` clipping and `0%` near saturation gives full clipping credit.
- `0.01%` hard-clipped pixels gives no clipping credit.
- `0.10%` near-saturated pixels can remove up to `80%` of the clipping credit.
- The square-root curve makes tiny percentages matter, which is useful for saturated star cores in large sensors.

## Cloud Warning

Displayed as `Cloud` on light-frame cards.

Displayed as a warning chip:

- `Possible Cloud`
- `Likely Cloud`

CSV fields:

- `cloud_warning`
- `cloud_score`
- `cloud_structure_score`
- `cloud_star_loss_score`
- `cloud_mean_lift_score`
- `cloud_background_range_percent`
- `cloud_summary`

Cloud detection runs for light-frame analysis, not calibration-frame checks. It is designed for broad clouds, haze, fog, bad transparency, or dawn/moon glow crossing part of the frame.

The app measures two kinds of evidence:

1. Large-scale background structure inside the frame.
2. Same-object and same-filter differences from the rest of the batch, especially lost stars and lifted mean brightness.

In v0.3.5, cloud warnings were trained from labelled cloudy and clear batches. Background range plus structure became the warning gate. Star-loss and mean-lift signals strengthened the warning only after that gate was open, because labelled clean frames can still have relative mean lift or star-count differences.

In v0.3.6, XISF files use the same cloud calculation after their linear pixels are decoded.

In v0.3.7, the cloud gate was tightened after a labelled clear batch showed strong background/target structure but no actual cloud. Background range and structure are still measured, but they no longer create a normal cloud warning by themselves. A warning now needs same-object/filter star loss, star loss plus mean lift, or an extreme structure case. This reduces false positives on real nebulosity, smooth sky gradients, and optical background structure.

In v0.3.8, the preview inspection workflow was adjusted for better visual detail. The opened detail render can use a larger safe preview, regular zoom is capped at the native detail image scale so it does not create blurry fake enlargement, and the magnifier lens includes stronger `12x` and `16x` levels for manual artifact inspection.

In v0.3.9, the inspection detail render uses a gentler stretch than the grid thumbnail. This avoids over-stretching faint background structure when the magnifier is active, especially at `12x` or `16x`.

In v0.3.10, the full zoom preview was restored to the normal grid stretch, and the gentler stretch was moved to a separate magnifier-only high-resolution source. The lens stays hidden while that source is being prepared, instead of magnifying the temporary low-resolution thumbnail.

### Large-Scale Background Structure

The app divides the image into a `16 x 12` grid. For each tile it samples finite pixels and uses the tile median as a coarse local background estimate. Stars only occupy a small fraction of a tile, so the median is much less sensitive to star cores than the mean.

The tile medians are sorted:

```text
background_range = p90(tile_medians) - p10(tile_medians)
denominator = max(abs(tile_median), abs(image_mean), 3 * image_std, 1e-6)
cloud_background_range_percent = background_range / denominator * 100
```

The app also checks broad row/column structure:

```text
row_range = p90(row_tile_medians) - p10(row_tile_medians)
column_range = p90(column_tile_medians) - p10(column_tile_medians)
cloud_strip_range_percent = max(row_range, column_range) / denominator * 100
```

And it checks whether the structure is smooth rather than pixel-scale noise:

```text
neighbour_median = median(abs(adjacent_tile_median_difference))
cloud_smoothness = clamp(1 - neighbour_median / (background_range * 0.55), 0, 1)
```

The structure score is:

```text
range_score = clamp((cloud_background_range_percent - 3.5) / 18, 0, 1)
strip_score = clamp((cloud_strip_range_percent - 2.8) / 14, 0, 1)
smooth_score = range_score * cloud_smoothness

cloud_structure_score =
    0.48 * range_score +
    0.34 * strip_score +
    0.18 * smooth_score
```

### Same Object/Filter Batch Evidence

Clouds often reduce detected star count and can lift the background. To avoid comparing unlike filters or unlike targets, this part is computed inside the current object-shot/filter group.

```text
cloud_relative_peer_minimum = 3
star_reference = p75(star_count in same-object/filter group)
cloud_star_loss_score =
    if same-object/filter light-frame count >= cloud_relative_peer_minimum:
        clamp((star_reference - star_count) / (star_reference * 0.55), 0, 1)
    else:
        0
```

For background lift:

```text
mean_median = median(mean brightness in same-object/filter group)
mean_range = p90(mean brightness) - p10(mean brightness)
mean_denominator = max(abs(mean_median) * 0.04, mean_range * 0.6, 1e-6)
cloud_mean_lift_score =
    if same-object/filter light-frame count >= cloud_relative_peer_minimum:
        clamp((mean - mean_median) / mean_denominator, 0, 1)
    else:
        0
```

With only one or two light frames in an object-shot/filter group, the app cannot know whether a lower star count is real cloud loss or simply the normal value for that target/filter. In that case, relative cloud evidence is disabled and ordinary range/structure alone is treated conservatively. Only an extreme structure case can raise a cloud warning without normal peer confirmation.

The final cloud score blends frame-internal structure with batch-relative evidence:

```text
paired_evidence = min(cloud_structure_score, max(cloud_star_loss_score, cloud_mean_lift_score))

cloud_score =
    0.54 * cloud_structure_score +
    0.18 * cloud_star_loss_score +
    0.14 * cloud_mean_lift_score +
    0.24 * paired_evidence
```

The result is clamped to `0..1`.

The labelled batches showed that star count alone is fragile, but a later clear batch also showed that background range/structure alone is too aggressive for targets with real nebulosity or smooth gradients. The current threshold gate is:

```text
range_structure_possible =
    cloud_background_range_percent >= 4.3
    and cloud_structure_score >= 0.03

range_structure_likely =
    cloud_background_range_percent >= 6.5
    and cloud_structure_score >= 0.16

support_evidence =
    cloud_star_loss_score >= 0.24
    or (
        cloud_star_loss_score >= 0.18
        and cloud_mean_lift_score >= 0.55
    )

strong_support_evidence =
    cloud_star_loss_score >= 0.36
    or (
        cloud_star_loss_score >= 0.24
        and cloud_mean_lift_score >= 0.55
    )

extreme_structure_evidence =
    (
        cloud_background_range_percent >= 10.5
        and cloud_structure_score >= 0.43
        and cloud_mean_lift_score >= 0.55
    )
    or (
        cloud_background_range_percent >= 14.5
        and cloud_structure_score >= 0.55
    )
```

These gates raise the displayed cloud score floor:

```text
if extreme_structure_evidence or (range_structure_likely and support_evidence):
    cloud_score = max(cloud_score, 0.72)
    if support_evidence:
        cloud_score = max(cloud_score, 0.78)
else if range_structure_possible and support_evidence:
    cloud_score = max(cloud_score, 0.44)
    if support_evidence:
        cloud_score = max(cloud_score, 0.52)
    if strong_support_evidence:
        cloud_score = max(cloud_score, 0.62)
else if range_structure_possible:
    cloud_score = min(cloud_score, 0.34)
```

That final cap is important: a frame can have a measurable smooth background gradient and still show `No cloud warning` if the same-shot stars do not support a cloud interpretation.

Warning levels:

```text
Likely Cloud if:
    extreme_structure_evidence
    or (
        range_structure_likely
        and support_evidence
        and strong_support_evidence
    )
    or (
        range_structure_possible
        and strong_support_evidence
        and (
            cloud_background_range_percent >= 4.8
            or cloud_structure_score >= 0.06
        )
    )

Possible Cloud if:
    range_structure_possible
    and support_evidence
```

Cloud penalties applied to light-frame quality:

```text
Likely Cloud:
    quality *= 0.45
    final quality is capped at 38

Possible Cloud:
    quality *= 0.72
    final quality is capped at 55
```

Important caveat: very strong nebulosity, severe gradients, or aggressive moon/light-pollution gradients can still look cloud-like in the structure metrics. The same-object/filter star-count and mean comparisons reduce that bias because stable target structure should usually be present in every sub of the same target and filter, while passing clouds change from frame to frame. Mean lift alone is no longer enough, because a clear batch can brighten over time without clouds.

## Halo Warning

Displayed as a warning chip:

- `Possible Halo`
- `Likely Halo`

Displayed in previews as amber rings over the suspected bright-star halo candidates. The same amber rings are drawn in the zoom view when the star overlay is enabled.

CSV fields:

- `halo_warning`
- `halo_score`
- `halo_star_count`
- `halo_measured_stars`
- `halo_summary`
- `halo_penalty_applied`

Halo detection runs for light-frame analysis, not calibration-frame checks. By default, it is warning-only and does not change the quality score, keeper decision, or score breakdown.

If the **Penalise Halo** checkbox is enabled, halo warnings apply an extra light-frame score penalty after the normal weighted score and after tracking penalties:

```text
Likely Halo:
    quality *= 0.82
Possible Halo:
    quality *= 0.92
```

When this checkbox is off, the halo warning and preview rings remain visible, but no halo score penalty is applied.

The app looks for bright local peaks, including saturated or near-saturated peaks that may have been excluded from star-roundness measurements. It keeps up to the brightest `50` separated candidates, away from the image edge.

For each bright candidate, the app measures three annuli around the star:

```text
shoulder annulus = close star wing region
halo annulus = wider glow region
background annulus = farther local background region
```

The exact radii scale with the measured HFR when a matching detected star is available. If no matching star exists, the app uses a conservative default radius. This lets saturated stars still be checked for halo even if their core shape is unusable for FWHM/roundness.

For each candidate:

```text
signal = peak - background_mean
halo_excess = halo_mean - background_mean
shoulder_excess = shoulder_mean - background_mean
halo_ratio = halo_excess / signal
halo_contrast = halo_excess / local_contrast_floor
extent_ratio = halo_excess / shoulder_excess
```

Then the per-star halo score is:

```text
ratio_score = clamp((halo_ratio - 0.008) / 0.040, 0, 1)
contrast_score = clamp((halo_contrast - 1.5) / 5, 0, 1)
extent_score = clamp((extent_ratio - 0.08) / 0.22, 0, 1)
per_star_halo_score =
    0.52 * ratio_score +
    0.30 * contrast_score +
    0.18 * extent_score
```

The frame-level halo score combines the strongest candidate and the average of the strongest few candidates:

```text
halo_score = 0.72 * strongest_per_star_score + 0.28 * top_candidate_average
```

Warning levels:

```text
Likely Halo if:
    strongest_per_star_score >= 0.82
    or at least 3 candidates are halo-like and top_candidate_average >= 0.58

Possible Halo if:
    strongest_per_star_score >= 0.58
    or at least 2 candidates are halo-like and top_candidate_average >= 0.44
```

`halo_star_count` is the number of bright candidates with per-star halo score at least `0.48`. `halo_measured_stars` is the number of bright candidates that had valid annulus measurements.

Important caveat: this is a screening warning. Real nebulosity, gradients, or crowded bright-star regions can mimic halo. The app warns you to inspect the frame; it only penalises the quality score when **Penalise Halo** is enabled.

## Tracking And Drift Measures

### Elongation

CSV field: `elongation`.

The app computes a whole-image elongation estimate from gradients in bright pixels:

1. Use pixels above:

```text
mean + 2 * standard_deviation
```

2. Compute local gradients:

```text
gx = right - left
gy = bottom - top
```

3. Build a gradient tensor:

```text
gxx = sum(gx * gx)
gyy = sum(gy * gy)
gxy = sum(gx * gy)
```

4. Compute tensor eigenvalues:

```text
elongation = sqrt((lambda1 + 1e-9) / (lambda2 + 1e-9))
```

Interpretation:

- `1.0` means no strong global elongation.
- Higher values mean stronger directional elongation.

Elongation also applies quality penalties:

```text
if elongation > 2.5:
    quality *= 0.84
else if elongation > 1.9:
    quality *= 0.92
```

For `Keep`, light frames must also have:

```text
elongation < 2.2
```

### Trailing Score

This is internal, not directly exported.

The app identifies elongated stars from the tracking star sample. The tracking sample uses central-field big and medium stars so telescope-dependent edge/corner aberrations do not dominate the guiding judgement.

The primary tracking region is the central `72%` field radius. If that gives too few stars, the app expands only to the central `88%` radius. It does not use the full field for tracking severity, because outer-field star shape can depend strongly on telescope design, reducers, flatteners, collimation, and correctors.

The tracking sample is selected as follows:

- keep only stars with finite position, finite peak brightness, and valid HFR
- keep the central `72%` field-radius stars first
- keep stars with `HFR >= 0.85 px`
- when enough stars are available, also remove the smallest `20%` by HFR
- keep stars at or above the `50th` percentile of peak brightness inside that central sample, which removes faint detections while keeping bright and medium stars
- if fewer than `12` stars remain, relax the brightness cut to the `18th` percentile
- if fewer than `12` stars are available in the central `72%` radius, repeat the same process only inside the central `88%` radius
- if more stars remain than the mode budget allows, sample across the bright-to-medium range instead of using only the brightest stars

```text
axis_ratio > 1.2
```

It then measures:

- `elongated_fraction`: fraction of tracking-sample guide stars that are elongated.
- `mean_axis_ratio`: average axis ratio of elongated stars.
- `orientation_coherence`: how similarly those stars are oriented.

Because star elongation direction is axial, orientation uses doubled angles:

```text
orientation_x += cos(2 * angle)
orientation_y += sin(2 * angle)
orientation_coherence = sqrt(orientation_x^2 + orientation_y^2) / elongated_star_count
```

The trailing score is:

```text
shape_factor = clamp((mean_axis_ratio - 1) / 1.4, 0, 1)
trailing_score = elongated_fraction * orientation_coherence * shape_factor
```

### Directional Trail Score

CSV fields:

- `directional_trail_score`
- `directional_trail_star_fraction`
- `directional_trail_star_count`

This v0.3.1 check catches guiding, mount, or wind movement that can be missed by the tight FWHM/core measurement.

In v0.3.2 and later, this check is central-field based to reduce bias from telescope-dependent edge/corner aberrations.

For each star in the tracking sample, the app measures a wider local profile around the star. It uses a low local floor above the background, computes a weighted second-moment ellipse, and records:

- wide-profile axis ratio
- wide-profile major/minor size
- wide-profile angle

Then it counts stars that look genuinely trailed:

```text
wide_axis_ratio > 1.32
wide_major_size > max(2.8 px, wide_minor_size * 1.28)
wide_major_size - wide_minor_size > 0.85 px
```

Those trailed stars must also point in a common direction. The score rises when many bright stars have the same wide-profile angle:

```text
count_score = clamp((trailed_star_count - 6) / 44, 0, 1)
fraction_score = clamp((trailed_star_fraction - 0.025) / 0.18, 0, 1)
shape_score = clamp((mean_wide_axis_ratio - 1.22) / 1.15, 0, 1)

directional_trail_score =
    (0.5 * count_score + 0.5 * fraction_score) *
    orientation_coherence *
    shape_score
```

The final trailing score used by tracking is:

```text
trailing_score = max(core_trailing_score, directional_trail_score)
```

Interpretation:

- A few elongated stars with random directions do not score high.
- Many elongated stars sharing a direction score higher.
- A field-wide diagonal smear, such as guiding error, mount movement, or wind shake, should now be detected even when the tight star core still looks acceptable.

### Repeat Drift

CSV fields:

- `repeat_drift_source`
- `repeat_drift_score`
- `repeated_star_fraction`
- `multi_repeat_fraction`

Repeat drift is intended to detect multiple nearby copies of the same star, which can happen with drifting/tracking jumps during the exposure.

The app looks for pairs of stars that are:

```text
distance between 1.2 and 9.5 pixels, scaled to the measurement pixel grid
brightness ratio <= 3.2
```

It stores up to `80000` candidate pairs in Standard mode and up to `240000` candidate pairs in Expert mode.

Then it tries to find a common pair direction:

- If trailing stars already provide a strong preferred angle, that angle is used.
- Otherwise, the app computes pair-angle coherence.
- If coherence is high enough, that direction becomes the reference direction.

Pairs aligned with the reference direction are counted when:

```text
line_angle_difference(pair_angle, reference_angle) <= 0.32 radians
```

The app computes:

```text
repeated_star_fraction = stars_with_at_least_one_aligned_repeat / total_stars
multi_repeat_fraction = stars_with_more_than_one_aligned_repeat / total_stars
aligned_pair_fraction = aligned_pairs / candidate_pairs
alignment_coherence = common-direction strength among aligned pairs
```

Repeat drift score:

```text
base = 0.5 * repeated_star_fraction + 0.5 * multi_repeat_fraction
repeat_drift_score = clamp(base * alignment_coherence * (0.55 + 0.45 * aligned_pair_fraction), 0, 1)
```

If there are at least `800` stars, the app also runs a bright-star repeat-drift pass. Standard mode uses up to the brightest `1500` stars; Expert mode uses up to the brightest `5000` stars. That bright-star pass is used when it looks reliable and clearly stronger than the all-star pass.

`repeat_drift_source` is:

- `all-stars`
- `bright-stars`

### Tracking Score

CSV field: `tracking_score`.

The app combines trailing and repeat drift:

```text
tracking_score = clamp(
    trailing_score * 0.65 +
    repeat_drift_score * 0.7 +
    min(trailing_score, repeat_drift_score) * 0.35,
    0,
    1
)
```

`trailing_score` is the stronger of the old tight-core trailing signal and the v0.3.1 wide-profile directional trail signal.

The extra `min(...)` term increases the score when both trailing and repeat drift appear together.

### Tracking Severity And Reason

CSV fields:

- `tracking_severity`
- `tracking_reason`

Displayed as `Tracking`.

If fewer than `12` central tracking-sample stars are available:

```text
tracking_severity = "Low confidence"
tracking_reason = "Low confidence"
```

Severe trailing:

```text
trailing_score > 0.30
elongated_fraction > 0.35
mean_axis_ratio > 1.35
orientation_coherence > 0.72
```

Possible trailing:

```text
trailing_score > 0.16
elongated_fraction > 0.22
mean_axis_ratio > 1.2
orientation_coherence > 0.58
```

Severe repeat drift:

```text
repeat_drift_score > 0.23
repeated_star_fraction > 0.22
multi_repeat_fraction > 0.07
alignment_coherence > 0.62
```

Possible repeat drift:

```text
repeat_drift_score > 0.09
repeated_star_fraction > 0.12
alignment_coherence > 0.48
```

Possible display labels:

- `OK`
- `Low Confidence`
- `Tracking Error`
- `Repeat Drift`
- `Tracking + Repeat`
- `Possible Drift`
- `Possible Repeat Drift`
- `Possible Mixed Drift`

Tracking penalties applied to light-frame quality:

```text
Severe repeat drift or severe mixed drift:
    quality *= 0.38
    final quality is capped at 28
Severe trailing only:
    quality *= 0.45
    final quality is capped at 48
Possible repeat drift or possible mixed drift:
    quality *= 0.55
    final quality is capped at 40
Possible trailing only:
    quality *= 0.68
    final quality is capped at 65
```

The cap is applied after the multiplier. Repeat-drift penalties are intentionally stronger than ordinary trailing penalties because repeated nearby copies of stars usually damage the sub even when sharpness, HFR, or star count still look acceptable.

A light frame cannot be marked `Keep` if tracking severity is `Severe` or `Possible`.

## Light Frame Quality Score

Displayed as the number in the quality pill.

CSV field: `quality`.

Light frames are scored within their object-shot/filter group. For example, `Ha` frames on one target are compared to other `Ha` frames on that same target, and `OIII` frames on a different target are kept in a separate comparison group.

### Normalisation

Several components are min/max normalised within the object-shot/filter group:

```text
normalised(value) = (value - group_min) / (group_max - group_min)
```

If all values in the group are effectively the same, every frame gets `0.5` for that normalised metric.

Metrics normalised by object-shot/filter group:

- global sharpness
- star sharpness
- inverse HFR
- noise
- star count

Metrics not normalised by object-shot/filter group:

- roundness
- clipping score

### Score Components

Default weights:

```text
Sharpness: 40
Noise: 15
Roundness: 20
Star Count: 15
Clipping: 10
```

The user can change these weights.

Component scores:

```text
sharpness_score = depends on selected sharpness mode
noise_score = 1 - normalised(noise)
roundness_score = star_roundness
star_count_score = normalised(star_count)
clipping_score = 1 - max(hard_clipping_pressure, near_saturation_pressure)
```

Base score:

```text
weight_total = sharpness_weight + noise_weight + roundness_weight + star_count_weight + clipping_weight

base_score =
    (
        sharpness_weight * sharpness_score +
        noise_weight * noise_score +
        roundness_weight * roundness_score +
        star_count_weight * star_count_score +
        clipping_weight * clipping_score
    ) / weight_total
```

Then elongation, tracking, optional halo, and cloud penalties are applied.

Final quality:

```text
quality = round(clamp(score_after_penalties, 0, 1) * 100)
```

### Why This Score

The `Why this score?` panel shows:

- Base score before penalties.
- Final score after penalties.
- Component points.
- Penalty points.

Component points are:

```text
component_points = component_score * component_weight * 100 / weight_total
```

Penalty points are the difference between the score before and after a multiplicative penalty:

```text
penalty_points = after_penalty_score * 100 - before_penalty_score * 100
```

## Keeper Thresholds And Recommendations

CSV field: `keeper_threshold`.

Default light-frame keeper thresholds:

```text
L: 75
R: 70
G: 70
B: 70
Ha: 70
OIII: 65
SII: 65
Clear: 70
Unknown: 70
```

Users can change these with per-filter numeric entry boxes.

The keeper thresholds do not change between Standard and Expert analysis modes. If Expert reports more keepers than Standard, the cause is changed measurements or penalties, not a looser keeper rule. Typical causes are a deeper star sample improving HFR/roundness, a more stable noise estimate, fewer false tracking/cloud penalties, or a different relative star-count normalisation inside the same object-shot/filter group.

For light frames:

```text
review_threshold = max(40, keeper_threshold - 8)
```

Recommendation logic:

```text
Keep if:
    quality >= keeper_threshold
    elongation < 2.2
    clipping_pressure < 1
    tracking_severity is not Severe
    tracking_severity is not Possible

Review if:
    quality >= review_threshold

Discard otherwise
```

## Calibration Frame Scoring

Calibration frames are:

- `Flat`
- `Dark`
- `Bias`
- `Dark Flat`

They do not use the light-frame score formula. They use purpose-specific checks.

### Helper Scores

Near-target score:

```text
scoreNear(value, target, tolerance) = clamp(1 - abs(value - target) / tolerance, 0, 1)
```

Below-limit score:

```text
if value <= good_limit:
    score = 1
else if value >= bad_limit:
    score = 0
else:
    score = 1 - (value - good_limit) / (bad_limit - good_limit)
```

If a value is not finite, fallback values are used.

### Flat Score

Flat components:

```text
level_score = scoreNear(median_percent, 50, 35)
saturation_score = scoreBelow(clipping_percent, 0.02, 0.5)
uniformity_score = scoreBelow(spread_percent, 35, 85)
gradient_score = scoreBelow(background_range_percent, 25, 55, fallback 0.85)
outlier_score = scoreBelow(bright_outlier_percent + dark_outlier_percent, 0.8, 6, fallback 0.85)
```

Flat score:

```text
score =
    0.43 * level_score +
    0.24 * saturation_score +
    0.15 * uniformity_score +
    0.10 * gradient_score +
    0.08 * outlier_score
```

Flat warnings:

- `Flat too dark`: median percent below `20`, severe.
- `Flat below histogram target`: median percent below `35`, possible.
- `Flat too bright`: median percent above `80`, severe.
- `Flat above histogram target`: median percent above `65`, possible.
- `Flat saturated`: hard-saturated pixels above `0.1%`, severe.
- `Flat near saturation`: hard-saturated pixels above `0.02%`, possible.
- `Flat very uneven`: spread above `85%`, possible.
- `Flat strong gradient`: background range above `55%`, possible.
- `Flat pixel outliers`: combined bright/dark outliers above `6%`, possible.

Detected local peaks are not used as a Flat warning or Flat score component. Flats are expected to contain broad illumination structure from filters, dust shadows, and optical vignetting, so the app avoids treating local-peak count as star-like evidence in flat frames.

Flat previews also show a compact histogram overlay. The histogram is built from linear analysis data:

```text
bin_index = floor(clamp(pixel_value / saturation_level, 0, 0.999999) * bin_count)
normalised_bin_height = bin_count_value / max_bin_count
```

The green band marks the usual flat target zone, `35%` to `65%` of the available sensor range. The amber vertical line marks `median_percent`.

### Flat Set Artefact Consistency

After individual Flat scores are computed, Flats are compared inside their same frame-type/filter set when at least `3` Flats are available.

The app compares:

- median brightness drift
- histogram shape drift
- spread drift
- excess gradient compared with the set median
- tile-pattern mismatch from a normalised `16 x 12` flat-field signature

The tile signature is built from tile medians:

```text
tile_signature = (tile_median - frame_tile_median) / normalization_denominator * 100
```

The frame is then compared with the median set signature. Stable vignetting should mostly cancel out because it appears in every flat. Moving clouds, tree silhouettes, shadows, jet traces, panel flicker, or changing sky illumination tend to increase one or more of these mismatch values.

Signals:

```text
median_signal = clamp((median_delta_percent - 4) / 10, 0, 1)
spread_signal = clamp((spread_delta_percent - 4) / 16, 0, 1)
gradient_signal = clamp((gradient_delta_percent - 6) / 20, 0, 1)
histogram_signal = clamp((histogram_distance - 0.06) / 0.18, 0, 1)
tile_signal = clamp((tile_mismatch_percent - 2.5) / 10, 0, 1)
```

Combined score:

```text
strongest_signal = max(median_signal, spread_signal, gradient_signal, histogram_signal, tile_signal)

flat_artifact_score = clamp(
    0.32 * histogram_signal +
    0.28 * tile_signal +
    0.18 * spread_signal +
    0.14 * median_signal +
    0.08 * gradient_signal +
    0.22 * strongest_signal,
    0,
    1
)
```

Possible Flat artefact mismatch:

```text
flat_artifact_score >= 0.35
or histogram_distance > 0.12
or tile_mismatch_percent > 6
or spread_delta_percent > 9
or median_delta_percent > 8
or gradient_delta_percent > 15
```

Penalty:

```text
quality *= 0.62
final quality is capped at 68
```

Severe Flat artefact mismatch:

```text
flat_artifact_score >= 0.72
or histogram_distance > 0.24
or tile_mismatch_percent > 14
or spread_delta_percent > 22
or median_delta_percent > 14
```

Penalty:

```text
quality *= 0.38
final quality is capped at 42
```

Warning:

- `Flat artefact mismatch from set`

### Bias Score

Bias components:

```text
level_score = scoreBelow(median_percent, 1.5, 8)
bright_pixel_score = scoreBelow(clipping_percent, 0.001, 0.05)
spread_score = scoreBelow(spread_percent, 2.5, 18)
hot_pixel_score = scoreBelow(bright_outlier_percent, 0.08, 0.35, fallback 0.85)
gradient_score = scoreBelow(background_range_percent, 4, 14, fallback 0.85)
```

Bias score:

```text
score =
    0.38 * level_score +
    0.25 * bright_pixel_score +
    0.18 * spread_score +
    0.10 * hot_pixel_score +
    0.09 * gradient_score
```

Bias warnings:

- `Bias signal high`: median percent above `8`, severe.
- `Bias saturated pixels`: hard-saturated bright pixels above `0.05%`, severe.
- `Bias uneven`: spread above `18%`, possible.
- `Many hot-pixel outliers`: bright outliers above `0.35%`, severe.
- `Hot-pixel outliers`: bright outliers above `0.08%`, possible.
- `Dark-pixel outliers`: dark outliers above `0.35%`, possible.
- `Light leak/strong gradient`: background range above `14%` or structure score above `0.72`, severe.
- `Possible light leak/gradient`: background range above `6%` or structure score above `0.42`, possible.

### Dark And Dark Flat Score

Dark and Dark Flat use the same scoring branch.

Components:

```text
level_score = scoreBelow(median_percent, 3, 15)
bright_pixel_score = scoreBelow(clipping_percent, 0.005, 0.1)
spread_score = scoreBelow(spread_percent, 8, 35)
hot_pixel_score = scoreBelow(bright_outlier_percent, sensor_hot_good_limit, sensor_hot_bad_limit, fallback 0.85)
dark_pixel_score = scoreBelow(dark_outlier_percent, sensor_dark_good_limit, sensor_dark_bad_limit, fallback 0.85)
outlier_score = 0.70 * hot_pixel_score + 0.30 * dark_pixel_score
gradient_score = scoreBelow(background_range_percent, 6, 20, fallback 0.85)
```

Score:

```text
score =
    0.32 * level_score +
    0.26 * bright_pixel_score +
    0.18 * spread_score +
    0.10 * outlier_score +
    0.14 * gradient_score
```

Dark outlier thresholds are sensor-aware. The app reads camera/sensor model metadata from FITS headers or XISF metadata such as `INSTRUME`, `CAMERA`, `CCDNAME`, `DETECTOR`, or `SENSOR`, then falls back to the file path. Known low-glow back-illuminated sensors and cameras include `IMX571`, `ASI2600`, `QHY268`, `IMX455`, `ASI6200`, `QHY600`, `IMX533`, `ASI533`, and `QHY533`.

Low-glow BSI profile:

```text
sensor_hot_good_limit = 0.08
sensor_hot_bad_limit = 0.90
sensor_dark_good_limit = 0.12
sensor_dark_bad_limit = 1.20
hot possible warning above 0.25%
hot severe warning above 0.90%
dark possible warning above 0.45%
dark severe warning above 1.20%
```

Generic sensor profile:

```text
sensor_hot_good_limit = 0.35
sensor_hot_bad_limit = 2.20
sensor_dark_good_limit = 0.45
sensor_dark_bad_limit = 2.80
hot possible warning above 0.80%
hot severe warning above 3.00%
dark possible warning above 1.00%
dark severe warning above 3.00%
```

This avoids treating all dark frames as if they came from the same sensor design. A clean IMX571-style dark is expected to have fewer outliers than older or stronger amp-glow sensors, while generic sensors are allowed more hot/dark outliers before the app calls the dark bad.

Warnings:

- Signal high: median percent above `15`, severe.
- Saturated pixels: hard-saturated bright pixels above `0.1%`, severe.
- Bright pixels: hard-saturated bright pixels above `0.005%`, possible.
- Uneven: spread above `35%`, possible.
- `Many hot-pixel outliers`: bright outliers above the sensor severe limit.
- `Hot-pixel outliers`: bright outliers above the sensor possible limit.
- `Many dark-pixel outliers`: dark outliers above the sensor severe limit.
- `Dark-pixel outliers`: dark outliers above the sensor possible limit.
- `Light leak/strong gradient`: background range above `20%` or structure score above `0.8`, severe.
- `Possible light leak/gradient`: background range above `8%`, structure score above `0.45`, or elevated signal plus gradient, possible.

### Calibration Outlier And Gradient Measures

Displayed on calibration cards as:

- `Set Delta`
- `Hot Px`
- `Dark Px`
- `Gradient`
- `Artefact`, `Hist Diff`, and `Tile Diff` on Flat cards
- `Sensor` on Dark and Dark Flat cards

Calibration cards do not display `Stars`, `Clip`, or `Near Sat`. Those fields are light-frame concepts in the UI. Internally, saturated bright pixels and large-scale background structure can still contribute to calibration warnings, but they are named as calibration saturation, bright-pixel, gradient, or light-leak signals.

CSV fields:

- `calibration_bright_outlier_percent`
- `calibration_dark_outlier_percent`
- `calibration_background_range_percent`
- `calibration_structure_score`
- `calibration_set_spread_delta_percent`
- `calibration_set_gradient_delta_percent`
- `flat_histogram_distance`
- `flat_tile_mismatch_percent`
- `flat_artifact_score`
- `camera_model`
- `camera_model_source`
- `sensor_outlier_profile`

Bright and dark outliers are measured from the linear analysis data. The app estimates a robust spread from `p01`, `p99`, and the median:

```text
robust_sigma = max((p99 - p01) / 4.65, abs(median) * 0.0005, abs(mean) * 0.0005, 1e-6)
outlier_width = max(8 * robust_sigma, abs(median) * 0.015, abs(mean) * 0.015, 1e-6)
bright_threshold = median + outlier_width
dark_threshold = median - outlier_width

bright_outlier_percent = pixels_above_bright_threshold / finite_pixels * 100
dark_outlier_percent = pixels_below_dark_threshold / finite_pixels * 100
```

The calibration gradient measure reuses the same `16 x 12` tile-median background structure method used by the cloud detector. For calibration frames it is interpreted differently:

- In Flats, a high value means strong unevenness, dust/outlier structure, or a badly exposed flat field.
- In Darks, Biases, and Dark Flats, a high value suggests possible light leak, amp glow, or large-scale brightness structure.

### Calibration Set Consistency

After individual calibration scores are computed, the app checks consistency within calibration sets.

Grouping:

- Flats are grouped by frame type and filter.
- Dark Flats are grouped by frame type and filter.
- Dark and Bias frames are grouped by frame type.

If a group has at least `3` frames, the app computes the group median of `median_percent`.

Allowed difference:

```text
Flat: 8 percentage points
Dark Flat: 10 percentage points
Dark and Bias: 8 percentage points
```

If a frame differs from its group median by more than the allowed amount:

```text
quality *= 0.82
```

If the difference is more than `1.8x` the allowed amount:

```text
quality *= 0.65
final quality is capped at 55
```

The frame also gets a `Median outlier from set` warning.

### Light Compatibility Checks

Calibration frames are also checked against the light frames in the same loaded batch.

Displayed on calibration cards as:

- `Exp`
- `Temp`
- `Exp Match`
- `Temp Match`

CSV fields:

- `exposure_seconds`
- `exposure_source`
- `camera_temperature_c`
- `temperature_source`
- `calibration_exposure_match`
- `calibration_exposure_reference_seconds`
- `calibration_exposure_delta_seconds`
- `calibration_temperature_match`
- `calibration_temperature_reference_c`
- `calibration_temperature_delta_c`
- `calibration_compatibility_summary`

For Darks:

- exposure time is checked against the closest light-frame exposure
- camera temperature is checked against the closest light-frame temperature

For Flats, Biases, and Dark Flats:

- only camera temperature is checked against the closest light-frame temperature
- exposure time is displayed when available but is not used for the light compatibility check

Exposure match tolerance:

```text
exposure_delta = abs(calibration_exposure - closest_light_exposure)
exposure_match_tolerance = max(1 second, closest_light_exposure * 0.02)
exposure_severe_tolerance = max(5 seconds, closest_light_exposure * 0.10)
```

Exposure status:

```text
OK if:
    exposure_delta <= exposure_match_tolerance

Mismatch if:
    exposure_delta > exposure_match_tolerance
    and exposure_delta <= exposure_severe_tolerance

Severe mismatch if:
    exposure_delta > exposure_severe_tolerance
```

Dark exposure penalties:

```text
Mismatch:
    quality *= 0.88

Severe mismatch:
    quality *= 0.65
    final quality is capped at 55
```

Temperature match tolerance:

```text
temperature_delta = abs(calibration_temperature - closest_light_temperature)
```

Temperature status:

```text
OK if:
    temperature_delta <= 2C

Mismatch if:
    temperature_delta > 2C
    and temperature_delta <= 5C

Severe mismatch if:
    temperature_delta > 5C
```

Temperature penalties:

```text
Mismatch:
    quality *= 0.92

Severe mismatch:
    quality *= 0.75
    final quality is capped at 65
```

Warnings:

- `Dark exposure differs from lights`: possible.
- `Dark exposure mismatch with lights`: severe.
- `Temperature differs from lights`: possible.
- `Temperature mismatch with lights`: severe.

If either the calibration frame or the light frames have no usable exposure/temperature metadata, the status is `Missing` and the app reports that the match was not verified. Missing metadata is not penalised by itself.

The app detects exposure and temperature from FITS headers or XISF metadata first. It falls back to filename/path patterns when possible, including names such as:

```text
-10.00_300.00s
```

In that pattern, `-10.00` is interpreted as camera temperature in Celsius and `300.00s` as exposure seconds.

### Calibration Report

The app shows a `Calibration Report` panel when calibration frames are present. Each report card summarizes one calibration set.

Displayed report values:

- frame count
- set median
- set median range
- median quality
- set median outlier count
- Keep/Review/Discard counts
- exposure match summary
- temperature match summary
- maximum hot-pixel outlier percent
- maximum gradient percent
- Flat artefact mismatch count
- grouped warning labels

The report does not replace the per-frame calibration score. It is a batch health view that helps answer whether the calibration set is internally consistent and usable for its purpose.

### Calibration Recommendation

Calibration frames use a fixed keep line:

```text
default calibration keep line = 70
review threshold = max(40, 70 - 8) = 62
```

Recommendation logic:

```text
Keep if:
    quality >= 70
    calibration severity is not Severe

Review if:
    quality >= 62

Discard otherwise
```

## Filter Detection

Displayed as `Filter`.

CSV fields:

- `filter`
- `filter_source`

For FITS files, the app checks FITS header keywords first. For XISF files, it checks embedded `FITSKeyword` entries and common native `Property` aliases first:

```text
FILTER
FILTER1
FILTER2
FILTER3
FILTNAME
FILTNUM
FILTERID
INSFLNAM
OPTIC
FILT
```

If no usable metadata filter is found, it falls back to file and folder names.

Common normalised filter names:

- `L`, `Lum`, `Luminance` -> `L`
- `R`, `Red` -> `R`
- `G`, `Green` -> `G`
- `B`, `Blue` -> `B`
- `Ha`, `H-alpha`, `Hydrogen Alpha` -> `Ha`
- `OIII`, `O3`, `Oxygen III` -> `OIII`
- `SII`, `S2`, `Sulfur II`, `Sulphur II` -> `SII`
- `Clear`, `Clr`, `Open` -> `Clear`

Custom filter names can also be preserved up to `32` characters.

## Object Shot Detection

Displayed as `Object` and `Shot Offset` on light-frame cards.

CSV fields:

- `target_name`
- `target_source`
- `object_shot`
- `object_shot_key`
- `object_shot_frame_count`
- `object_shot_offset_arcmin`
- `object_shot_tolerance_arcmin`
- `ra_degrees`
- `ra_hms`
- `ra_source`
- `dec_degrees`
- `dec_dms`
- `dec_source`
- `focal_length_mm`
- `focal_length_source`
- `pixel_size_microns`
- `pixel_size_source`
- `binning`
- `binning_source`
- `pixel_scale_arcsec_per_pixel`
- `pixel_scale_source`
- `field_width_degrees`
- `field_height_degrees`

This feature is used for light-frame grouping. Calibration frames do not use object-shot scoring.

The UI displays coordinates in astronomy format:

```text
RA  = HHh MMm SS.Ss
DEC = +DDdeg MM' SS.S"
```

The CSV keeps both these formatted strings and numeric degree values.

### RA/DEC Reading

For FITS/XISF files, the app looks for paired coordinate metadata keys:

```text
OBJCTRA / OBJCTDEC
OBJRA / OBJDEC
RA_OBJ / DEC_OBJ
RA-OBJ / DEC-OBJ
TELRA / TELDEC
RA / DEC
CRVAL1 / CRVAL2
```

RA can be sexagesimal or decimal.

Sexagesimal RA is interpreted as hours:

```text
12:34:56 -> (12 + 34/60 + 56/3600) * 15 degrees
```

Decimal WCS `CRVAL1` is interpreted as degrees. Other decimal RA values are interpreted as hours when the absolute value is `24` or below, and as degrees when the value is above `24`. This handles common capture-software headers where `OBJCTRA` is decimal hours and WCS headers where RA is already in degrees.

DEC is interpreted as degrees:

```text
-05:30:00 -> -5.5 degrees
```

If no usable RA/DEC pair is found, the light frame is assigned to `Unknown Object`. In that case the app preserves the old same-filter comparison behaviour for those frames.

### Target Name

The app reads friendly target names from FITS keywords or XISF metadata aliases such as:

```text
OBJECT
OBJNAME
TARGET
TARGNAME
OBJ-NAME
```

The target name is used for the UI label when available. It does not override the coordinate check; RA/DEC separation decides whether frames are the same object shot.

This is metadata reading only. The app does not recognise the astronomical object from the image pixels and it does not plate solve the frame.

### Pixel Scale And Field Of View

The app first tries to read a direct WCS pixel scale:

```text
CDELT1 / CDELT2
CD1_1 / CD1_2 / CD2_1 / CD2_2
```

If WCS scale is not available, it derives pixel scale from focal length, pixel size, and binning:

```text
pixel_scale_arcsec_per_pixel =
    206.265 * pixel_size_microns * binning / focal_length_mm
```

Focal length is read from keywords such as:

```text
FOCALLEN
FOC_LEN
FOCLEN
FOCAL
EFL
```

Pixel size is read from paired or single keywords such as:

```text
XPIXSZ / YPIXSZ
XPIXSIZE / YPIXSIZE
PIXSIZE1 / PIXSIZE2
CCDXPIXE / CCDYPIXE
PIXSIZE
PIX_SIZE
PIXSZ
```

Binning is read from keywords such as:

```text
XBINNING / YBINNING
CCDBINX / CCDBINY
XBIN / YBIN
BINNING
CCDSUM
```

The field of view is then:

```text
field_width_degrees = pixel_scale_arcsec_per_pixel * image_width_pixels / 3600
field_height_degrees = pixel_scale_arcsec_per_pixel * image_height_pixels / 3600
```

For FITS/XISF files, the original decoded image dimensions are used for this field-of-view calculation.

### Object-Shot Tolerance

The allowed centre-coordinate deviation is based on the smaller field-of-view dimension:

```text
object_shot_tolerance_degrees =
    clamp(smaller_field_of_view_degrees * 0.18, 0.035, 0.9)
```

That is approximately:

- minimum tolerance: `2.1 arcmin`
- maximum tolerance: `54 arcmin`

If pixel scale cannot be estimated, the fallback tolerance is:

```text
fallback_tolerance = 0.25 degrees = 15 arcmin
```

The app groups light frames by angular separation on the sky. The separation uses the spherical angular distance between RA/DEC points, so RA wraparound near `0`/`360` degrees is handled.

For each group:

```text
object_shot_reference = running average RA/DEC centre of the group
object_shot_offset_arcmin = angular distance from this frame to the group reference
```

The final relative light scoring group is:

```text
score_group = object_shot + filter
```

This affects sharpness normalisation, noise normalisation, star-count normalisation, and cloud batch evidence. It does not change direct per-frame measurements such as roundness, HFR, clipping, tracking, halo, or the raw star count.

## Frame Type Detection

Displayed as `Type`.

CSV fields:

- `frame_type`
- `frame_type_source`

For FITS files, the app checks FITS header keywords first. For XISF files, it checks embedded `FITSKeyword` entries and common native `Property` aliases first:

```text
IMAGETYP
IMAGETYPE
FRAME
FRAMETYP
FRAMETYPE
OBSTYPE
EXPTYPE
PICTYPE
```

If no usable metadata type is found, it falls back to file and folder names.

Normalised frame types:

- `Light`, `Object`, `Science` -> `Light`
- `Flat`, `Flats`, `Flat Field`, `MasterFlat` -> `Flat`
- `Dark`, `Darks`, `MasterDark` -> `Dark`
- `Bias`, `Biases`, `Offset`, `Zero`, `MasterBias` -> `Bias`
- `Dark Flat`, `Flat Dark`, `DarkFlat`, `FlatDark` -> `Dark Flat`
- otherwise -> `Unknown`

`Unknown` frames use light-frame analysis.

## Exposure And Temperature Detection

Displayed as `Exp` and `Temp` on frame cards.

CSV fields:

- `exposure_seconds`
- `exposure_source`
- `camera_temperature_c`
- `temperature_source`

For FITS/XISF files, exposure is read from the first available metadata key:

```text
EXPTIME
EXPOSURE
EXPOS
EXPT
EXPTIME1
DARKTIME
LIVETIME
ONTIME
TELAPSE
```

Camera temperature is read from the first available keyword:

```text
CCD-TEMP
CCD_TEMP
CCDTEMP
SET-TEMP
SET_TEMP
SETTEMP
CAM-TEMP
CAMTEMP
SENSOR-T
SENSORT
TEMP
TEMPERAT
```

If FITS/XISF metadata is missing, the app falls back to file and folder names. It recognizes exposure values ending in `s`, and it recognizes camera temperature immediately before exposure in names like:

```text
-10.00_300.00s
```

It also checks explicit path labels such as `temp_-10`, `ccdtemp_-10`, or `camtemp_-10`.

## Camera And Sensor Detection

Displayed as `Sensor` on Dark and Dark Flat cards.

CSV fields:

- `camera_model`
- `camera_model_source`
- `sensor_outlier_profile`

For FITS/XISF files, camera or sensor model is read from the first available metadata key:

```text
INSTRUME
CAMERA
CAMMODEL
CCDNAME
DETECTOR
SENSOR
CCD
MODEL
CAMNAME
IMAGER
```

If FITS/XISF metadata is missing, the app falls back to file and folder names. It recognizes common model fragments such as `IMX571`, `ASI2600`, and `QHY268`.

The sensor model currently affects Dark and Dark Flat outlier scoring only. Known low-glow back-illuminated sensors use the `Low-glow BSI` profile; all other or unknown models use the `Generic sensor` profile.

## Zoom Guide-Star Overlay

For light frames, the zoom overlay shows the central guide-star sample used for tracking analysis plus reliable full-field guide/reference stars for manual inspection, including stars near the corners. It still does not show every detected star. Calibration frames disable this overlay because detected peaks in Flats, Darks, Biases, and Dark Flats are not stars.

Very small or faint detections are excluded from this overlay because their shapes are not reliable enough for guiding diagnosis. They can still contribute to the raw detected star count, but they are not used for tracking/trailing/repeat-drift decisions.

Important separation:

- Tracking severity is still calculated from central big/medium guide stars.
- The full-field corner stars are visual reference stars for human inspection.
- A corner reference star can be orange if its local shape is poor; that does not mean it was used to trigger a tracking warning.

Overlay colours:

- Teal/green circles: normal guide/reference stars, including reliable full-field stars.
- Orange circles: reliable corner reference stars with poor local shape, useful for spotting coma, field curvature, tilt, or corrector/collimation behaviour.
- Red circles: central guide-sample stars that support a `Possible` or `Severe` tracking warning.
- Yellow circles or links: repeat-drift candidates.
- White circle: clicked star.

Orange corner reference stars use this visual-only rule:

```text
outside central 88% radius
and in a corner zone on both axes
and one of:
    roundness < 0.74
    fwhm_roundness < 0.72
    axis_ratio > 1.35
```

This does not change the quality score. It is there to help the user see optical/corner behaviour separately from guiding/tracking behaviour.

A star is marked red only if the frame has a `Possible` or `Severe` tracking warning, the star belongs to the guide-star sample, and one of these stronger local shape rules is true:

```text
directional-trail shape:
    trail_axis_ratio > 1.32
    trail_major_fwhm > max(2.8 px, trail_minor_fwhm * 1.28)
    trail_major_fwhm - trail_minor_fwhm > 0.85 px

or strong core elongation:
    axis_ratio > 1.55
    roundness < 0.68
```

Clicking a star in the zoom overlay shows:

- HFR
- minor/major FWHM
- roundness

Important note: red stars are not automatically bad, but red is now reserved for real tracking-alert context. The suspicious cases are many red central guide stars sharing a direction, or red stars connected by yellow repeat-drift links. Corner stars were added back to the visual overlay after v0.3.6 so optical edge behaviour can be inspected manually without driving the tracking score. Orange corner stars are a separate optical/corner inspection aid.

## CSV Columns

The CSV export includes these fields:

```text
file
calculation_version
analysis_mode
analysis_pixel_source
frame_type
frame_type_source
filter
filter_source
exposure_seconds
exposure_source
camera_temperature_c
temperature_source
camera_model
camera_model_source
sensor_outlier_profile
target_name
target_source
object_shot
object_shot_key
object_shot_frame_count
object_shot_offset_arcmin
object_shot_tolerance_arcmin
ra_degrees
ra_hms
ra_source
dec_degrees
dec_dms
dec_source
focal_length_mm
focal_length_source
pixel_size_microns
pixel_size_source
binning
binning_source
pixel_scale_arcsec_per_pixel
pixel_scale_source
field_width_degrees
field_height_degrees
keeper_threshold
quality
recommendation
calibration_status
calibration_warnings
calibration_set
calibration_set_median_percent
calibration_set_delta_percent
calibration_set_spread_delta_percent
calibration_set_gradient_delta_percent
calibration_set_outlier
flat_histogram_distance
flat_tile_mismatch_percent
flat_artifact_score
calibration_bright_outlier_percent
calibration_dark_outlier_percent
calibration_background_range_percent
calibration_structure_score
calibration_exposure_match
calibration_exposure_reference_seconds
calibration_exposure_delta_seconds
calibration_temperature_match
calibration_temperature_reference_c
calibration_temperature_delta_c
calibration_compatibility_summary
median_percent
spread_percent
noise_percent
sharpness
noise
star_roundness
fwhm_roundness
axis_roundness
eccentricity
hfr
star_count
mean
clipping_percent
near_saturation_percent
clipping_pressure
clipping_score
cloud_warning
cloud_score
cloud_structure_score
cloud_star_loss_score
cloud_mean_lift_score
cloud_background_range_percent
cloud_summary
halo_warning
halo_score
halo_star_count
halo_measured_stars
halo_summary
halo_penalty_applied
tracking_severity
tracking_reason
tracking_score
tracking_sample_star_count
tracking_sample_region
directional_trail_score
directional_trail_star_fraction
directional_trail_star_count
repeat_drift_source
repeat_drift_score
repeated_star_fraction
multi_repeat_fraction
elongation
```

Short meanings:

- `file`: relative folder path or filename.
- `calculation_version`: app/calculation version that produced this row, such as `0.3.10`.
- `analysis_mode`: `standard` or `expert`, showing which processing mode produced the measurements.
- `analysis_pixel_source`: source grid used for measurements, such as `full-resolution FITS`, `full-resolution XISF`, or `bitmap analysis canvas`.
- `frame_type`: detected frame type.
- `frame_type_source`: FITS keyword, XISF metadata, or file path source.
- `filter`: detected filter group.
- `filter_source`: FITS keyword, XISF metadata, or file path source.
- `exposure_seconds`: exposure time detected from FITS/XISF metadata or file path.
- `exposure_source`: where exposure was detected.
- `camera_temperature_c`: camera temperature in Celsius detected from FITS/XISF metadata or file path.
- `temperature_source`: where camera temperature was detected.
- `camera_model`: camera or sensor model detected from FITS/XISF metadata or file path.
- `camera_model_source`: where camera/sensor model was detected.
- `sensor_outlier_profile`: dark-frame outlier profile used for this camera model.
- `target_name`: friendly target/object name from FITS/XISF metadata when available.
- `target_source`: where the target name was detected.
- `object_shot`: detected light-frame object-shot group label.
- `object_shot_key`: internal object-shot group key used for grouping.
- `object_shot_frame_count`: number of light frames in that object-shot group.
- `object_shot_offset_arcmin`: angular distance from this frame's RA/DEC to the group's reference RA/DEC.
- `object_shot_tolerance_arcmin`: maximum angular deviation allowed when matching this frame to an object-shot group.
- `ra_degrees`: detected right ascension in degrees.
- `ra_hms`: detected right ascension formatted as hours, minutes, and seconds.
- `ra_source`: FITS keyword, XISF metadata, or file path source used for right ascension.
- `dec_degrees`: detected declination in degrees.
- `dec_dms`: detected declination formatted as signed degrees, arcminutes, and arcseconds.
- `dec_source`: FITS keyword, XISF metadata, or file path source used for declination.
- `focal_length_mm`: detected focal length in millimetres.
- `focal_length_source`: FITS keyword or XISF metadata used for focal length.
- `pixel_size_microns`: detected pixel size in microns.
- `pixel_size_source`: FITS keyword or XISF metadata used for pixel size.
- `binning`: detected average binning value.
- `binning_source`: FITS keyword, XISF metadata, or default source for binning.
- `pixel_scale_arcsec_per_pixel`: detected or derived pixel scale.
- `pixel_scale_source`: WCS source or focal-length/pixel-size source for pixel scale.
- `field_width_degrees`: estimated image field width in degrees.
- `field_height_degrees`: estimated image field height in degrees.
- `keeper_threshold`: threshold used for Keep/Review/Discard.
- `quality`: final 0 to 100 score.
- `recommendation`: Keep, Review, or Discard.
- `calibration_status`: calibration summary or empty for light frames.
- `calibration_warnings`: calibration warnings joined together.
- `calibration_set`: frame-type/filter set used for calibration consistency checks.
- `calibration_set_median_percent`: same-set median of `median_percent` when at least 3 frames are available.
- `calibration_set_delta_percent`: absolute difference between the frame median and the same-set median.
- `calibration_set_spread_delta_percent`: for Flats, absolute spread difference from the same-set median spread.
- `calibration_set_gradient_delta_percent`: for Flats, excess gradient above the same-set median gradient.
- `calibration_set_outlier`: whether this frame was flagged as a set median outlier.
- `flat_histogram_distance`: Flat histogram-shape distance from the same-set median histogram.
- `flat_tile_mismatch_percent`: Flat normalised tile-pattern mismatch from the same-set median tile signature.
- `flat_artifact_score`: 0 to 1 Flat artefact mismatch score.
- `calibration_bright_outlier_percent`: percent of high outlier pixels used for hot-pixel checks.
- `calibration_dark_outlier_percent`: percent of low outlier pixels.
- `calibration_background_range_percent`: large-scale tile-background range used for gradient/light-leak checks.
- `calibration_structure_score`: 0 to 1 large-scale calibration structure score.
- `calibration_exposure_match`: Not checked, Missing, OK, Mismatch, or Severe mismatch.
- `calibration_exposure_reference_seconds`: closest light-frame exposure used for dark compatibility.
- `calibration_exposure_delta_seconds`: exposure difference from the closest light frame.
- `calibration_temperature_match`: Not checked, Missing, OK, Mismatch, or Severe mismatch.
- `calibration_temperature_reference_c`: closest light-frame camera temperature used for compatibility.
- `calibration_temperature_delta_c`: temperature difference from the closest light frame.
- `calibration_compatibility_summary`: short text summarizing exposure/temperature compatibility.
- `median_percent`: median brightness as percent of saturation level.
- `spread_percent`: p99 minus p01 as percent of saturation level.
- `noise_percent`: image standard deviation as percent of mean.
- `sharpness`: raw star sharpness.
- `noise`: local background residual noise.
- `star_roundness`: combined FWHM/moment roundness.
- `fwhm_roundness`: FWHM minor/major ratio.
- `axis_roundness`: moment-shape minor/major ratio.
- `eccentricity`: median star eccentricity.
- `hfr`: median star half-flux radius estimate.
- `star_count`: detected star count for light-frame analysis. For calibration frames this raw exported value is only a local-peak count and should not be interpreted as stars.
- `mean`: average grayscale brightness.
- `clipping_percent`: percent of clipped pixels. In light frames this is a highlight-clipping score input; in calibration frames it is treated as saturation or bright-pixel evidence.
- `near_saturation_percent`: percent of pixels close to saturation, including clipped pixels. This is displayed for light frames, not calibration cards.
- `clipping_pressure`: combined 0 to 1 highlight penalty pressure from hard clipping and near saturation.
- `clipping_score`: 0 to 1 clipping component score after pressure is applied.
- `cloud_warning`: OK, Possible Cloud, or Likely Cloud.
- `cloud_score`: 0 to 1 combined cloud/transparency warning score.
- `cloud_structure_score`: 0 to 1 large-scale background structure score.
- `cloud_star_loss_score`: 0 to 1 same-object/filter star-count loss signal.
- `cloud_mean_lift_score`: 0 to 1 same-object/filter background brightness lift signal.
- `cloud_background_range_percent`: p90 minus p10 tile-background range as a percent of the image/background scale.
- `cloud_summary`: short cloud warning text shown in the UI.
- `halo_warning`: OK, Possible Halo, or Likely Halo.
- `halo_score`: 0 to 1 warning score for broad bright-star halos.
- `halo_star_count`: number of bright candidates that look halo-like.
- `halo_measured_stars`: number of bright candidates with valid halo annulus measurements.
- `halo_summary`: short warning text shown in the UI.
- `halo_penalty_applied`: whether the optional halo penalty checkbox affected this row's score.
- `tracking_severity`: None, Possible, Severe, or Low confidence.
- `tracking_reason`: None, Trailing, Repeat drift, Trailing + Repeat drift, or Low confidence.
- `tracking_score`: combined trailing/repeat tracking score.
- `tracking_sample_star_count`: number of central big/medium stars used for guiding/tracking decisions.
- `tracking_sample_region`: central field radius used for guiding/tracking decisions, normally `central 72% radius` or fallback `central 88% radius`.
- `directional_trail_score`: 0 to 1 wide-profile common-direction trail score for guiding/mount/wind movement.
- `directional_trail_star_fraction`: fraction of wide-profile tracking stars that looked trailed.
- `directional_trail_star_count`: count of wide-profile tracking stars that looked trailed.
- `repeat_drift_source`: central-stars or central-bright-stars.
- `repeat_drift_score`: aligned close-repeat score.
- `repeated_star_fraction`: fraction of stars with at least one aligned repeat neighbour.
- `multi_repeat_fraction`: fraction of stars with multiple aligned repeat neighbours.
- `elongation`: global gradient-based elongation estimate.

## Practical Interpretation

### A Good Light Frame Usually Has

- High final quality.
- Low HFR.
- High roundness.
- Low eccentricity.
- High star count compared with same-object/filter frames.
- Low clipping.
- `Cloud` equal to `OK`.
- Low tracking alerts.
- No major elongation penalty.

### A Frame With Clouds, Haze, Or Dawn Often Has

- Lower star count than same-object/filter frames.
- Higher mean background.
- `Possible Cloud` or `Likely Cloud`.
- High `cloud_background_range_percent` or `cloud_structure_score`.
- Higher noise or noise percent.
- Possibly lower sharpness.

### A Frame With Tracking Problems Often Has

- Many elongated stars with common orientation.
- Possible or severe tracking label.
- High elongation.
- Repeat-drift links in the star overlay.

### A Frame With Normal Optical Edge Aberrations Can Have

- Elongated-looking stars near borders.
- Orange corner reference stars in the zoom overlay.
- Higher eccentricity near edges.
- No strong repeat-drift links.
- Often a radial or symmetric pattern.

That pattern should not automatically be interpreted as tracking drift or tilt.

### Calibration Frames Should Be Judged Differently

Calibration frames are not expected to have good stars. A Flat, Dark, Bias, or Dark Flat is judged by signal level, saturation or bright-pixel behaviour, spread/uniformity, structure, and consistency with the calibration set. Star overlays and star-count display are kept to light frames.
