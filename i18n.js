(function () {
  "use strict";

  const storageKey = "astronomySubAnalyser.language.v1";
  const supportedLanguages = ["en", "es", "it", "fr", "de"];
  const documentLanguages = {
    en: "en-GB",
    es: "es",
    it: "it",
    fr: "fr",
    de: "de"
  };

  const en = {
    "brand.kicker": "Local frame review",
    "brand.logoAlt": "Moon Conjunction logo",
    "brand.offline": "On-premise",
    "language.label": "Language",
    "language.ariaLabel": "Interface language",
    "folders.title": "Image Folders",
    "folders.add": "Add Folder",
    "folders.clear": "Clear Folders",
    "folders.none": "No folders selected",
    "folders.selected": "Selected folders",
    "folders.one": "{count} folder",
    "folders.many": "{count} folders",
    "folders.ignored": "{count} ignored",
    "frames.one": "1 astronomy frame",
    "frames.many": "{count} astronomy frames",
    "controls.sharpness": "Sharpness",
    "controls.sharpnessMode": "Sharpness Mode",
    "controls.hybrid": "Hybrid",
    "controls.fwhmOnly": "FWHM Only",
    "controls.noisePenalty": "Noise Penalty",
    "controls.roundness": "Roundness",
    "controls.starCount": "Star Count",
    "controls.clippingPenalty": "Clipping Penalty",
    "controls.fwhmThreshold": "Maximum FWHM",
    "controls.eccentricityThreshold": "Maximum Eccentricity",
    "controls.previewStretch": "Preview Stretch",
    "controls.defaultValue": "Default {value}",
    "controls.analysisParameter": "analysis parameter",
    "controls.restoreDefault": "Restore {parameter} default ({value})",
    "controls.analysisMode": "Analysis Mode",
    "controls.standard": "Standard",
    "controls.expert": "Expert",
    "help.sharpnessLabel": "Sharpness calculation",
    "help.sharpness": "Sharpness is relative to the current filter group. FITS/XISF files are measured from linear image data, not the stretched preview. Star sharpness blends FWHM and HFR, rewarding smaller, tighter stars. Hybrid adds 25% whole-image edge contrast.",
    "help.sharpnessModeLabel": "Hybrid and FWHM mode calculation",
    "help.sharpnessMode": "Hybrid is usually steadier because it uses star FWHM/HFR plus image edge contrast. FWHM Only ignores global edge contrast and ranks sharpness only from measured star size.",
    "help.noiseLabel": "Noise penalty calculation",
    "help.noise": "Noise is estimated from dim, non-star background pixels by comparing each pixel with its local 3x3 neighbourhood. More background residual lowers the final quality score.",
    "help.roundnessLabel": "Roundness calculation",
    "help.roundness": "Roundness is scored directly: 100% means circular stars. It uses all detected stars and blends 75% FWHM minor/major ratio with 25% moment-based shape.",
    "help.starCountLabel": "Star count calculation",
    "help.starCount": "Star Count compares each image with the current filter group. If a sub has many fewer detected stars than same-filter frames, it loses score, which helps detect clouds, haze, fog, or dawn glow.",
    "help.clippingLabel": "Clipping penalty calculation",
    "help.clipping": "Clipping uses hard-clipped pixels plus near-saturated highlights. FITS/XISF clipping is measured from full-resolution linear data before preview downsampling. Small saturated star cores can reduce this score.",
    "help.fwhmThresholdLabel": "FWHM threshold calculation",
    "help.fwhmThreshold": "This is a hard Light-frame discard gate. A frame whose median major-axis FWHM exceeds the selected value is forced to Discard, regardless of its other score components. The default is 4.0 pixels.",
    "help.eccentricityThresholdLabel": "Eccentricity threshold calculation",
    "help.eccentricityThreshold": "This is a hard Light-frame discard gate. A frame whose median star eccentricity exceeds the selected value is forced to Discard, regardless of its other score components. The default is 0.65.",
    "help.analysisModeLabel": "Analysis mode calculation depth",
    "help.analysisMode": "FITS/XISF measurements use full-resolution pixels in both modes. Standard stays faster with lighter sampling budgets; Expert uses deeper budgets for star size, roundness, drift, clouds, halos, flats, and histograms. Switching modes re-measures frames on the next Analyse run.",
    "actions.analyse": "Analyse",
    "actions.stop": "Stop Analysis",
    "actions.defaults": "Restore Analysis Defaults",
    "actions.penaliseHalo": "Penalise Halo",
    "actions.csvSeparator": "CSV Separator",
    "actions.export": "Export CSV",
    "separator.comma": "Comma (,)",
    "separator.semicolon": "Semicolon (;)",
    "separator.tab": "Tab",
    "separator.pipe": "Pipe (|)",
    "summary.initial": "Select one or more folders and click Analyse.",
    "sections.frameTypes": "Frame Types",
    "sections.frameTypesAria": "Frame type groups",
    "sections.filters": "Filters",
    "sections.filtersAria": "Filter groups",
    "sections.objectShots": "Object Shots",
    "sections.objectShotsAria": "Object shot groups",
    "sections.resultGroups": "Result Groups",
    "sections.resultGroupsAria": "Recommendation groups",
    "sections.thresholds": "Keeper Thresholds By Filter",
    "sections.thresholdsAria": "Keeper thresholds by filter",
    "selection.selectAll": "Select All",
    "selection.selectAllAria": "Select all analysed images",
    "selection.copyFilter": "Copy by Filter",
    "selection.copyFilterAria": "Copy selected images into filter folders",
    "selection.copyType": "Copy by Type",
    "selection.copyTypeAria": "Copy selected images into frame type folders",
    "selection.chooseOutput": "Choose Output Folder",
    "selection.selectKeepers": "Select Keepers",
    "selection.clear": "Clear Selection",
    "selection.send": "Send Selected",
    "output.notSelected": "Output folder: not selected",
    "output.unsupported": "Output folder: unsupported in this browser",
    "output.selected": "Output folder: {name}",
    "results.ariaLabel": "Analysed images",
    "zoom.lensStretch": "Lens Stretch",
    "zoom.stars": "Stars",
    "zoom.magnifier": "Magnifier",
    "zoom.lens": "Lens",
    "zoom.close": "Close",
    "zoom.selectImage": "Select image",
    "zoom.selectFile": "Select {name}",
    "zoom.openPreview": "Open preview for {name}",
    "zoom.previewAlt": "Preview for {name}",
    "zoom.showStars": "Show guide and reference stars",
    "zoom.lightOnlyStars": "Star overlay is only available for light frames",
    "zoom.gridDetail": "Grid preview; magnifier detail {width} x {height} px",
    "zoom.prepareDetail": "Grid preview; move over the image to prepare magnifier detail",
    "zoom.enableMagnifier": "Grid preview; enable Magnifier for high-resolution inspection",
    "zoom.starStatus": "Star HFR {hfr} px, FWHM {minor} / {major} px, roundness {roundness}%{trail}{corner}{borderline}",
    "zoom.trailRatio": ", trail ratio {value}",
    "zoom.cornerWarning": ", corner shape warning",
    "zoom.borderline": ", borderline shape",
    "common.all": "All",
    "common.unknown": "Unknown",
    "common.unknownFilter": "Unknown filter",
    "common.unknownObject": "Unknown Object",
    "common.keep": "Keep",
    "common.review": "Review",
    "common.discard": "Discard",
    "common.ok": "OK",
    "common.issue": "Issue",
    "common.notAvailable": "n/a",
    "common.on": "on",
    "common.off": "off",
    "frame.light": "Light",
    "frame.flat": "Flat",
    "frame.dark": "Dark",
    "frame.bias": "Bias",
    "frame.darkFlat": "Dark Flat",
    "metric.type": "Type",
    "metric.filter": "Filter",
    "metric.status": "Status",
    "metric.level": "Level",
    "metric.spread": "Spread",
    "metric.noise": "Noise",
    "metric.exp": "Exp",
    "metric.temp": "Temp",
    "metric.expMatch": "Exp Match",
    "metric.tempMatch": "Temp Match",
    "metric.mean": "Mean",
    "metric.setDelta": "Set Delta",
    "metric.hotPx": "Hot Px",
    "metric.darkPx": "Dark Px",
    "metric.gradient": "Gradient",
    "metric.artefact": "Artefact",
    "metric.histDiff": "Hist Diff",
    "metric.tileDiff": "Tile Diff",
    "metric.sensor": "Sensor",
    "metric.object": "Object",
    "metric.scale": "Scale",
    "metric.focal": "Focal",
    "metric.pixel": "Pixel",
    "metric.shotOffset": "Shot Offset",
    "metric.sharp": "Sharp",
    "metric.round": "Round",
    "metric.ecc": "Ecc",
    "metric.fwhm": "FWHM",
    "metric.hfr": "HFR",
    "metric.stars": "Stars",
    "metric.cloud": "Cloud",
    "metric.clip": "Clip",
    "metric.nearSat": "Near Sat",
    "metric.tracking": "Tracking",
    "metric.guideStars": "Guide Stars",
    "filter.mixedTypes": "Mixed frame types detected. Calibration frames use calibration checks.",
    "filter.mixedLightCalibration": "Light scores and calibration sets are grouped by filter.",
    "filter.mixedCalibration": "Calibration sets are grouped by filter where useful.",
    "filter.mixedScores": "Scores are grouped by filter for fair comparison.",
    "filter.mixedObjects": "Light scores are also grouped by object shot from FITS RA/DEC.",
    "filter.calibrationThresholdNote": "Calibration frames use type-specific checks for their purpose.",
    "filter.thresholdAria": "{filter} keeper threshold",
    "filter.named": "{name} filter",
    "filter.framesOne": "1 frame",
    "filter.framesMany": "{count} frames",
    "filter.noMetadata": "{frames} - no filter found in FITS header or path",
    "filter.groupDetail": "{frames} in this filter group",
    "calibration.report": "Calibration Report",
    "calibration.reportNote": "{frames} calibration frame(s) across {sets} set(s). {issues} set(s) need review.",
    "calibration.consistencyChecked": "Set consistency checked",
    "calibration.consistencyNeeds": "Set consistency needs 3+ frames",
    "calibration.frames": "Frames",
    "calibration.median": "Median",
    "calibration.range": "Range",
    "calibration.quality": "Quality",
    "calibration.outliers": "Outliers",
    "calibration.keep": "Keep",
    "calibration.artefacts": "Artefacts",
    "calibration.warnings": "Warnings",
    "calibration.noWarnings": "No calibration warnings",
    "calibration.lightAnalysis": "Light analysis",
    "calibration.flatHistogram": "Flat histogram",
    "calibration.medianValue": "Median {value}",
    "score.why": "Why this score?",
    "score.base": "Base {value}",
    "score.final": "Final {value}",
    "score.noPenalties": "No score penalties applied.",
    "score.flatLevel": "Flat Level",
    "score.biasLevel": "Bias Level",
    "score.darkLevel": "Dark Level",
    "score.darkFlatLevel": "Dark Flat Level",
    "score.saturation": "Saturation",
    "score.uniformity": "Uniformity",
    "score.hotPixels": "Hot Pixels",
    "score.brightPixels": "Bright Pixels",
    "score.spread": "Spread",
    "score.outliers": "Outliers",
    "warning.frameWarnings": "Frame warnings",
    "warning.cloudFallback": "Cloud or haze detected",
    "warning.haloFallback": "Bright-star halo detected",
    "warning.fwhmThreshold": "FWHM threshold",
    "warning.fwhmThresholdDetail": "Measured {value} px exceeds the {threshold} px limit; the frame is forced to Discard.",
    "warning.eccentricityThreshold": "Eccentricity threshold",
    "warning.eccentricityThresholdDetail": "Measured {value} exceeds the {threshold} limit; the frame is forced to Discard.",
    "warning.flatTooDark": "Flat too dark",
    "warning.flatBelowTarget": "Flat below histogram target",
    "warning.flatTooBright": "Flat too bright",
    "warning.flatAboveTarget": "Flat above histogram target",
    "warning.flatSaturated": "Flat saturated",
    "warning.flatNearSaturation": "Flat near saturation",
    "warning.flatUneven": "Flat very uneven",
    "warning.flatGradient": "Flat strong gradient",
    "warning.flatPixelOutliers": "Flat pixel outliers",
    "warning.biasHigh": "Bias signal high",
    "warning.biasSaturated": "Bias saturated pixels",
    "warning.biasUneven": "Bias uneven",
    "warning.manyHotOutliers": "Many hot-pixel outliers",
    "warning.hotOutliers": "Hot-pixel outliers",
    "warning.manyDarkOutliers": "Many dark-pixel outliers",
    "warning.darkOutliers": "Dark-pixel outliers",
    "warning.lightLeak": "Light leak/strong gradient",
    "warning.possibleLightLeak": "Possible light leak/gradient",
    "warning.darkExposureMismatch": "Dark exposure mismatch with lights",
    "warning.darkExposureDiffers": "Dark exposure differs from lights",
    "warning.temperatureMismatch": "Temperature mismatch with lights",
    "warning.temperatureDiffers": "Temperature differs from lights",
    "warning.flatSetMismatch": "Flat artefact mismatch from set",
    "warning.medianOutlier": "Median outlier from set",
    "warning.signalHigh": "{type} signal high",
    "warning.saturatedPixels": "{type} saturated pixels",
    "warning.hasBrightPixels": "{type} has bright pixels",
    "warning.uneven": "{type} uneven",
    "tracking.lowConfidence": "Low Confidence",
    "tracking.repeatDrift": "Repeat Drift",
    "tracking.trackingRepeat": "Tracking + Repeat",
    "tracking.error": "Tracking Error",
    "tracking.possibleRepeat": "Possible Repeat Drift",
    "tracking.possibleMixed": "Possible Mixed Drift",
    "tracking.possibleDrift": "Possible Drift",
    "halo.likely": "Likely Halo",
    "halo.possible": "Possible Halo",
    "cloud.likely": "Likely Cloud",
    "cloud.possible": "Possible Cloud",
    "flat.genericSensor": "Generic sensor",
    "status.defaultsRestored": "Default analysis values restored.",
    "status.previewRefreshed": "Preview stretch refreshed.",
    "status.previewFailed": "Preview refresh failed.",
    "status.refreshingPreviews": "Refreshing stretched previews... {done}/{total}",
    "status.selectFolders": "Select one or more folders with images first.",
    "status.noSupported": "No supported astronomy frames found.",
    "status.noSupportedIgnored": "No supported astronomy frames found. Ignored {count} non-frame/system file(s).",
    "status.noNewFrames": "No new supported frames to analyse; refreshed existing scores.",
    "status.analysisStopped": "Analysis stopped after {done} of {total} pending frame(s).",
    "status.newFramesKept": "Analysed {newCount} new frame(s); kept {existing} existing result(s).",
    "status.modeSelected": "{mode} mode selected.",
    "status.modeChanged": "Analysis mode changed to {mode}. Click Analyse to re-measure frames in this mode.",
    "status.noNewFiles": "No new files added from that folder.",
    "status.folderAdded": "Folder added. Click Analyse to process only the new files.",
    "status.foldersCleared": "Folder selection cleared.",
    "status.analysisFailed": "Analysis failed for one or more files.",
    "status.outputSelected": "Output folder selected.",
    "status.outputPickerFailed": "Could not open output folder picker.",
    "status.outputUnsupported": "Output folder copy is not supported in this browser.",
    "status.chooseOutput": "Choose an output folder first.",
    "status.selectImage": "Select at least one image to send.",
    "status.sending": "Sending selected images... {done}/{total}",
    "status.sendFailed": "Sending selected images failed.",
    "status.sent": "Sent {copied} image(s) to \"{name}\"{folders}. Failed: {failed}.",
    "status.usingFolders": " using {folders} folders",
    "status.typeFolder": "type",
    "status.filterFolder": "filter",
    "status.and": " and ",
    "progress.estimating": "estimating",
    "progress.new": "new",
    "progress.unknownMemory": "unknown memory",
    "progress.oneImage": "1 {adjective}image",
    "progress.manyImages": "{count} {adjective}images",
    "progress.existingKept": " {count} existing result(s) kept.",
    "progress.failed": " {count} failed.",
    "progress.workers": " using {count} auto worker(s)",
    "progress.headline": "Analysing {target} locally in {mode} mode{workers}... {done}/{total}.{kept}{failed}",
    "progress.autoWorkers": "Auto workers: {workers}/{cores} logical cores, {memorySource} {memory}.",
    "progress.desktopMemory": "desktop memory",
    "progress.browserMemory": "browser memory",
    "progress.heapMemory": "browser heap limit",
    "progress.fallbackMemory": "fallback memory estimate",
    "progress.elapsedRemaining": "Elapsed: {elapsed}. Remaining: {remaining}.",
    "progress.elapsedEstimating": "Elapsed: {elapsed}. Remaining: estimating after first frame.",
    "progress.stoppedFinalising": "Elapsed: {elapsed}. Analysis stopped. Finalising completed frames...",
    "progress.finalising": "Elapsed: {elapsed}. Remaining: 0s. Finalising results...",
    "summary.processedZero": "Processed 0 astronomy frames.{ignored}",
    "summary.ignored": " Ignored {count} non-frame/system file(s).",
    "summary.objectShots": " Object shots: {objects}.",
    "summary.normalisedFilters": " Scores are normalised within each filter.",
    "summary.normalisedObjects": " Light scores are normalised within each object shot.",
    "summary.processed": "{runNote}Processed {count} astronomy frame(s).",
    "summary.grouping": "Types: {types}. Filters: {filters}.{objects}{filterNote}{objectNote}",
    "summary.recommendations": "Keep: {keep}, Review: {review}, Discard: {discard}.",
    "summary.warnings": "Tracking alerts: {tracking} (repeat-drift: {repeat}). Cloud warnings: {clouds}. Halo warnings: {halos}.",
    "summary.settings": "Halo penalty: {haloPenalty}. Moon penalty: {moonPenalty}. Sharpness mode: {sharpnessMode}. Analysis mode: {analysisMode}.",
    "summary.analysisTime": "Analysis time: {elapsed}.",
    "summary.full": "{runNote}Processed {count} astronomy frame(s).{ignored} Types: {types}. Filters: {filters}.{objects} Keep: {keep}, Review: {review}, Discard: {discard}. Tracking alerts: {tracking} (repeat-drift: {repeat}). Cloud warnings: {clouds}. Halo warnings: {halos}. Halo penalty: {haloPenalty}. Moon penalty: {moonPenalty}. Sharpness mode: {sharpnessMode}. Analysis mode: {analysisMode}.{filterNote}{objectNote}"
  };

  const translations = {
    en,
    es: {
      "brand.kicker": "Revisión local de tomas", "brand.logoAlt": "Logotipo Moon Conjunction", "brand.offline": "Instalación local", "language.label": "Idioma", "language.ariaLabel": "Idioma de la interfaz",
      "folders.title": "Carpetas de imágenes", "folders.add": "Añadir carpeta", "folders.clear": "Borrar carpetas", "folders.none": "Ninguna carpeta seleccionada", "folders.selected": "Carpetas seleccionadas", "folders.one": "{count} carpeta", "folders.many": "{count} carpetas", "folders.ignored": "{count} ignorados", "frames.one": "1 toma astronómica", "frames.many": "{count} tomas astronómicas",
      "controls.sharpness": "Nitidez", "controls.sharpnessMode": "Modo de nitidez", "controls.hybrid": "Híbrido", "controls.fwhmOnly": "Solo FWHM", "controls.noisePenalty": "Penalización por ruido", "controls.roundness": "Redondez", "controls.starCount": "Número de estrellas", "controls.clippingPenalty": "Penalización por recorte", "controls.previewStretch": "Estirado de previsualización", "controls.defaultValue": "Predeterminado {value}", "controls.analysisMode": "Modo de análisis", "controls.standard": "Estándar", "controls.expert": "Experto",
      "help.sharpnessLabel": "Cálculo de nitidez", "help.sharpness": "La nitidez es relativa al grupo de filtro actual. Los archivos FITS/XISF se miden a partir de datos lineales, no de la previsualización estirada. La nitidez estelar combina FWHM y HFR y favorece estrellas más pequeñas y compactas. El modo Híbrido añade un 25% de contraste de bordes de toda la imagen.", "help.sharpnessModeLabel": "Cálculo de los modos Híbrido y FWHM", "help.sharpnessMode": "Híbrido suele ser más estable porque usa FWHM/HFR estelar y el contraste de bordes. Solo FWHM ignora el contraste global y clasifica la nitidez únicamente por el tamaño medido de las estrellas.", "help.noiseLabel": "Cálculo de la penalización por ruido", "help.noise": "El ruido se estima en píxeles de fondo tenues sin estrellas, comparando cada píxel con su vecindad local de 3x3. Un residuo de fondo mayor reduce la puntuación final.", "help.roundnessLabel": "Cálculo de redondez", "help.roundness": "La redondez se puntúa directamente: 100% significa estrellas circulares. Usa todas las estrellas detectadas y combina un 75% de la relación FWHM menor/mayor con un 25% de la forma basada en momentos.", "help.starCountLabel": "Cálculo del número de estrellas", "help.starCount": "El número de estrellas compara cada imagen con su grupo de filtro. Una toma con muchas menos estrellas que otras del mismo filtro pierde puntuación, lo que ayuda a detectar nubes, bruma, niebla o el brillo del amanecer.", "help.clippingLabel": "Cálculo de la penalización por recorte", "help.clipping": "El recorte combina píxeles recortados y luces casi saturadas. En FITS/XISF se mide sobre datos lineales a resolución completa antes de reducir la previsualización. Los núcleos estelares saturados pueden reducir la puntuación.", "help.analysisModeLabel": "Profundidad del modo de análisis", "help.analysisMode": "Ambos modos usan píxeles FITS/XISF a resolución completa. Estándar es más rápido con muestreos ligeros; Experto usa presupuestos más profundos para tamaño estelar, redondez, deriva, nubes, halos, flats e histogramas. Cambiar el modo vuelve a medir las tomas en el siguiente análisis.",
      "actions.analyse": "Analizar", "actions.stop": "Detener análisis", "actions.defaults": "Restaurar valores de análisis", "actions.penaliseHalo": "Penalizar halo", "actions.csvSeparator": "Separador CSV", "actions.export": "Exportar CSV", "separator.comma": "Coma (,)", "separator.semicolon": "Punto y coma (;)", "separator.tab": "Tabulador", "separator.pipe": "Barra vertical (|)", "summary.initial": "Seleccione una o varias carpetas y pulse Analizar.",
      "sections.frameTypes": "Tipos de toma", "sections.frameTypesAria": "Grupos de tipos de toma", "sections.filters": "Filtros", "sections.filtersAria": "Grupos de filtros", "sections.objectShots": "Objetos fotografiados", "sections.objectShotsAria": "Grupos de objetos fotografiados", "sections.resultGroups": "Grupos de resultados", "sections.resultGroupsAria": "Grupos de recomendación", "sections.thresholds": "Umbrales de conservación por filtro", "sections.thresholdsAria": "Umbrales de conservación por filtro",
      "selection.selectAll": "Seleccionar todo", "selection.selectAllAria": "Seleccionar todas las imágenes analizadas", "selection.copyFilter": "Copiar por filtro", "selection.copyFilterAria": "Copiar las imágenes seleccionadas en carpetas por filtro", "selection.copyType": "Copiar por tipo", "selection.copyTypeAria": "Copiar las imágenes seleccionadas en carpetas por tipo", "selection.chooseOutput": "Elegir carpeta de salida", "selection.selectKeepers": "Seleccionar conservadas", "selection.clear": "Borrar selección", "selection.send": "Enviar selección", "output.notSelected": "Carpeta de salida: no seleccionada", "output.unsupported": "Carpeta de salida: no compatible con este navegador", "output.selected": "Carpeta de salida: {name}", "results.ariaLabel": "Imágenes analizadas",
      "zoom.lensStretch": "Estirado de lupa", "zoom.stars": "Estrellas", "zoom.magnifier": "Lupa", "zoom.lens": "Aumento", "zoom.close": "Cerrar", "common.all": "Todas", "common.unknown": "Desconocido", "common.unknownFilter": "Filtro desconocido", "common.unknownObject": "Objeto desconocido", "common.keep": "Conservar", "common.review": "Revisar", "common.discard": "Descartar", "common.ok": "Correcto", "common.issue": "Problema", "common.notAvailable": "n/d", "common.on": "activada", "common.off": "desactivada",
      "frame.light": "Light", "frame.flat": "Flat", "frame.dark": "Dark", "frame.bias": "Bias", "frame.darkFlat": "Dark Flat",
      "metric.type": "Tipo", "metric.filter": "Filtro", "metric.status": "Estado", "metric.level": "Nivel", "metric.spread": "Dispersión", "metric.noise": "Ruido", "metric.exp": "Exp", "metric.temp": "Temp", "metric.expMatch": "Coinc. exp.", "metric.tempMatch": "Coinc. temp.", "metric.mean": "Media", "metric.setDelta": "Delta del conjunto", "metric.hotPx": "Píx. calientes", "metric.darkPx": "Píx. oscuros", "metric.gradient": "Gradiente", "metric.artefact": "Artefacto", "metric.histDiff": "Dif. hist.", "metric.tileDiff": "Dif. mosaico", "metric.sensor": "Sensor", "metric.object": "Objeto", "metric.scale": "Escala", "metric.focal": "Focal", "metric.pixel": "Píxel", "metric.shotOffset": "Desvío", "metric.sharp": "Nitidez", "metric.round": "Redondez", "metric.ecc": "Excentricidad", "metric.hfr": "HFR", "metric.stars": "Estrellas", "metric.cloud": "Nube", "metric.clip": "Recorte", "metric.nearSat": "Casi sat.", "metric.tracking": "Seguimiento", "metric.guideStars": "Estrellas guía",
      "filter.mixedTypes": "Se detectaron tipos de toma mezclados. Las tomas de calibración usan controles específicos.", "filter.mixedLightCalibration": "Las puntuaciones Light y los conjuntos de calibración se agrupan por filtro.", "filter.mixedCalibration": "Los conjuntos de calibración se agrupan por filtro cuando resulta útil.", "filter.mixedScores": "Las puntuaciones se agrupan por filtro para una comparación justa.", "filter.mixedObjects": "Las puntuaciones Light también se agrupan por objeto según RA/DEC de FITS.", "filter.calibrationThresholdNote": "Las tomas de calibración usan controles específicos para su función.", "filter.thresholdAria": "Umbral de conservación para {filter}", "filter.framesOne": "1 toma", "filter.framesMany": "{count} tomas", "filter.noMetadata": "{frames}: no se encontró filtro en la cabecera FITS ni en la ruta", "filter.groupDetail": "{frames} en este grupo de filtro",
      "calibration.report": "Informe de calibración", "calibration.reportNote": "{frames} toma(s) de calibración en {sets} conjunto(s). {issues} conjunto(s) requieren revisión.", "calibration.consistencyChecked": "Consistencia del conjunto comprobada", "calibration.consistencyNeeds": "La consistencia requiere 3 o más tomas", "calibration.frames": "Tomas", "calibration.median": "Mediana", "calibration.range": "Rango", "calibration.quality": "Calidad", "calibration.outliers": "Atípicos", "calibration.keep": "Conservar", "calibration.artefacts": "Artefactos", "calibration.warnings": "Avisos", "calibration.noWarnings": "Sin avisos de calibración", "calibration.lightAnalysis": "Análisis Light", "calibration.flatHistogram": "Histograma Flat", "calibration.medianValue": "Mediana {value}",
      "score.why": "¿Por qué esta puntuación?", "score.base": "Base {value}", "score.final": "Final {value}", "score.noPenalties": "No se aplicaron penalizaciones.", "warning.frameWarnings": "Avisos de la toma", "warning.cloudFallback": "Se detectaron nubes o bruma", "warning.haloFallback": "Se detectó halo de estrella brillante",
      "tracking.lowConfidence": "Baja confianza", "tracking.repeatDrift": "Deriva repetida", "tracking.trackingRepeat": "Seguimiento + repetición", "tracking.error": "Error de seguimiento", "tracking.possibleRepeat": "Posible deriva repetida", "tracking.possibleMixed": "Posible deriva mixta", "tracking.possibleDrift": "Posible deriva", "halo.likely": "Halo probable", "halo.possible": "Posible halo", "cloud.likely": "Nube probable", "cloud.possible": "Posible nube", "flat.genericSensor": "Sensor genérico"
    },
    it: {
      "brand.kicker": "Revisione locale dei fotogrammi", "brand.logoAlt": "Logo Moon Conjunction", "brand.offline": "Installazione locale", "language.label": "Lingua", "language.ariaLabel": "Lingua dell'interfaccia",
      "folders.title": "Cartelle immagini", "folders.add": "Aggiungi cartella", "folders.clear": "Cancella cartelle", "folders.none": "Nessuna cartella selezionata", "folders.selected": "Cartelle selezionate", "folders.one": "{count} cartella", "folders.many": "{count} cartelle", "folders.ignored": "{count} ignorati", "frames.one": "1 fotogramma astronomico", "frames.many": "{count} fotogrammi astronomici",
      "controls.sharpness": "Nitidezza", "controls.sharpnessMode": "Modalità nitidezza", "controls.hybrid": "Ibrida", "controls.fwhmOnly": "Solo FWHM", "controls.noisePenalty": "Penalità rumore", "controls.roundness": "Rotondità", "controls.starCount": "Numero di stelle", "controls.clippingPenalty": "Penalità clipping", "controls.previewStretch": "Stretch anteprima", "controls.defaultValue": "Predefinito {value}", "controls.analysisMode": "Modalità analisi", "controls.standard": "Standard", "controls.expert": "Esperta",
      "actions.analyse": "Analizza", "actions.stop": "Interrompi analisi", "actions.defaults": "Ripristina valori analisi", "actions.penaliseHalo": "Penalizza alone", "actions.csvSeparator": "Separatore CSV", "actions.export": "Esporta CSV", "separator.comma": "Virgola (,)", "separator.semicolon": "Punto e virgola (;)", "separator.tab": "Tabulazione", "separator.pipe": "Barra verticale (|)", "summary.initial": "Seleziona una o più cartelle e fai clic su Analizza.",
      "sections.frameTypes": "Tipi di fotogramma", "sections.frameTypesAria": "Gruppi per tipo di fotogramma", "sections.filters": "Filtri", "sections.filtersAria": "Gruppi di filtri", "sections.objectShots": "Oggetti ripresi", "sections.objectShotsAria": "Gruppi di oggetti ripresi", "sections.resultGroups": "Gruppi di risultati", "sections.resultGroupsAria": "Gruppi di raccomandazioni", "sections.thresholds": "Soglie di conservazione per filtro", "sections.thresholdsAria": "Soglie di conservazione per filtro",
      "selection.selectAll": "Seleziona tutto", "selection.selectAllAria": "Seleziona tutte le immagini analizzate", "selection.copyFilter": "Copia per filtro", "selection.copyFilterAria": "Copia le immagini selezionate in cartelle per filtro", "selection.copyType": "Copia per tipo", "selection.copyTypeAria": "Copia le immagini selezionate in cartelle per tipo", "selection.chooseOutput": "Scegli cartella di destinazione", "selection.selectKeepers": "Seleziona da conservare", "selection.clear": "Cancella selezione", "selection.send": "Invia selezionate", "output.notSelected": "Cartella di destinazione: non selezionata", "output.unsupported": "Cartella di destinazione: non supportata dal browser", "output.selected": "Cartella di destinazione: {name}", "results.ariaLabel": "Immagini analizzate",
      "zoom.lensStretch": "Stretch lente", "zoom.stars": "Stelle", "zoom.magnifier": "Lente", "zoom.lens": "Ingrandimento", "zoom.close": "Chiudi", "common.all": "Tutti", "common.unknown": "Sconosciuto", "common.unknownFilter": "Filtro sconosciuto", "common.unknownObject": "Oggetto sconosciuto", "common.keep": "Conserva", "common.review": "Rivedi", "common.discard": "Scarta", "common.ok": "OK", "common.issue": "Problema", "common.notAvailable": "n/d", "common.on": "attiva", "common.off": "disattiva",
      "frame.light": "Light", "frame.flat": "Flat", "frame.dark": "Dark", "frame.bias": "Bias", "frame.darkFlat": "Dark Flat",
      "metric.type": "Tipo", "metric.filter": "Filtro", "metric.status": "Stato", "metric.level": "Livello", "metric.spread": "Dispersione", "metric.noise": "Rumore", "metric.exp": "Esp", "metric.temp": "Temp", "metric.expMatch": "Corrisp. esp.", "metric.tempMatch": "Corrisp. temp.", "metric.mean": "Media", "metric.setDelta": "Delta serie", "metric.hotPx": "Pixel caldi", "metric.darkPx": "Pixel scuri", "metric.gradient": "Gradiente", "metric.artefact": "Artefatto", "metric.histDiff": "Diff. ist.", "metric.tileDiff": "Diff. settori", "metric.sensor": "Sensore", "metric.object": "Oggetto", "metric.scale": "Scala", "metric.focal": "Focale", "metric.pixel": "Pixel", "metric.shotOffset": "Scostamento", "metric.sharp": "Nitidezza", "metric.round": "Rotondità", "metric.ecc": "Ecc", "metric.hfr": "HFR", "metric.stars": "Stelle", "metric.cloud": "Nuvola", "metric.clip": "Clipping", "metric.nearSat": "Quasi sat.", "metric.tracking": "Inseguimento", "metric.guideStars": "Stelle guida",
      "filter.mixedTypes": "Rilevati tipi di fotogramma misti. I fotogrammi di calibrazione usano controlli specifici.", "filter.mixedLightCalibration": "I punteggi Light e le serie di calibrazione sono raggruppati per filtro.", "filter.mixedCalibration": "Le serie di calibrazione sono raggruppate per filtro quando utile.", "filter.mixedScores": "I punteggi sono raggruppati per filtro per un confronto equo.", "filter.mixedObjects": "I punteggi Light sono raggruppati anche per oggetto in base a RA/DEC FITS.", "filter.calibrationThresholdNote": "I fotogrammi di calibrazione usano controlli specifici per il loro scopo.", "filter.thresholdAria": "Soglia di conservazione per {filter}", "filter.framesOne": "1 fotogramma", "filter.framesMany": "{count} fotogrammi", "filter.noMetadata": "{frames}: nessun filtro trovato nell'intestazione FITS o nel percorso", "filter.groupDetail": "{frames} in questo gruppo di filtri",
      "calibration.report": "Rapporto di calibrazione", "calibration.reportNote": "{frames} fotogramma/i di calibrazione in {sets} serie. {issues} serie da rivedere.", "calibration.consistencyChecked": "Coerenza della serie verificata", "calibration.consistencyNeeds": "La verifica richiede almeno 3 fotogrammi", "calibration.frames": "Fotogrammi", "calibration.median": "Mediana", "calibration.range": "Intervallo", "calibration.quality": "Qualità", "calibration.outliers": "Anomali", "calibration.keep": "Conserva", "calibration.artefacts": "Artefatti", "calibration.warnings": "Avvisi", "calibration.noWarnings": "Nessun avviso di calibrazione", "calibration.lightAnalysis": "Analisi Light", "calibration.flatHistogram": "Istogramma Flat", "calibration.medianValue": "Mediana {value}",
      "score.why": "Perché questo punteggio?", "score.base": "Base {value}", "score.final": "Finale {value}", "score.noPenalties": "Nessuna penalità applicata.", "warning.frameWarnings": "Avvisi fotogramma", "warning.cloudFallback": "Rilevata nuvolosità o foschia", "warning.haloFallback": "Rilevato alone di stella luminosa", "tracking.lowConfidence": "Bassa affidabilità", "tracking.repeatDrift": "Deriva ripetuta", "tracking.trackingRepeat": "Inseguimento + ripetizione", "tracking.error": "Errore di inseguimento", "tracking.possibleRepeat": "Possibile deriva ripetuta", "tracking.possibleMixed": "Possibile deriva mista", "tracking.possibleDrift": "Possibile deriva", "halo.likely": "Alone probabile", "halo.possible": "Possibile alone", "cloud.likely": "Nuvola probabile", "cloud.possible": "Possibile nuvola", "flat.genericSensor": "Sensore generico"
    },
    fr: {
      "brand.kicker": "Contrôle local des poses", "brand.logoAlt": "Logo Moon Conjunction", "brand.offline": "Sur site", "language.label": "Langue", "language.ariaLabel": "Langue de l'interface",
      "folders.title": "Dossiers d'images", "folders.add": "Ajouter un dossier", "folders.clear": "Effacer les dossiers", "folders.none": "Aucun dossier sélectionné", "folders.selected": "Dossiers sélectionnés", "folders.one": "{count} dossier", "folders.many": "{count} dossiers", "folders.ignored": "{count} ignorés", "frames.one": "1 pose astronomique", "frames.many": "{count} poses astronomiques",
      "controls.sharpness": "Netteté", "controls.sharpnessMode": "Mode de netteté", "controls.hybrid": "Hybride", "controls.fwhmOnly": "FWHM uniquement", "controls.noisePenalty": "Pénalité de bruit", "controls.roundness": "Rondeur", "controls.starCount": "Nombre d'étoiles", "controls.clippingPenalty": "Pénalité d'écrêtage", "controls.previewStretch": "Étirement de l'aperçu", "controls.defaultValue": "Par défaut {value}", "controls.analysisMode": "Mode d'analyse", "controls.standard": "Standard", "controls.expert": "Expert",
      "actions.analyse": "Analyser", "actions.stop": "Arrêter l'analyse", "actions.defaults": "Restaurer les valeurs d'analyse", "actions.penaliseHalo": "Pénaliser le halo", "actions.csvSeparator": "Séparateur CSV", "actions.export": "Exporter le CSV", "separator.comma": "Virgule (,)", "separator.semicolon": "Point-virgule (;)", "separator.tab": "Tabulation", "separator.pipe": "Barre verticale (|)", "summary.initial": "Sélectionnez un ou plusieurs dossiers, puis cliquez sur Analyser.",
      "sections.frameTypes": "Types de poses", "sections.frameTypesAria": "Groupes de types de poses", "sections.filters": "Filtres", "sections.filtersAria": "Groupes de filtres", "sections.objectShots": "Objets photographiés", "sections.objectShotsAria": "Groupes d'objets photographiés", "sections.resultGroups": "Groupes de résultats", "sections.resultGroupsAria": "Groupes de recommandations", "sections.thresholds": "Seuils de conservation par filtre", "sections.thresholdsAria": "Seuils de conservation par filtre",
      "selection.selectAll": "Tout sélectionner", "selection.selectAllAria": "Sélectionner toutes les images analysées", "selection.copyFilter": "Copier par filtre", "selection.copyFilterAria": "Copier les images sélectionnées dans des dossiers par filtre", "selection.copyType": "Copier par type", "selection.copyTypeAria": "Copier les images sélectionnées dans des dossiers par type", "selection.chooseOutput": "Choisir le dossier de sortie", "selection.selectKeepers": "Sélectionner les conservées", "selection.clear": "Effacer la sélection", "selection.send": "Envoyer la sélection", "output.notSelected": "Dossier de sortie : non sélectionné", "output.unsupported": "Dossier de sortie : non pris en charge par ce navigateur", "output.selected": "Dossier de sortie : {name}", "results.ariaLabel": "Images analysées",
      "zoom.lensStretch": "Étirement de la loupe", "zoom.stars": "Étoiles", "zoom.magnifier": "Loupe", "zoom.lens": "Grossissement", "zoom.close": "Fermer", "common.all": "Tous", "common.unknown": "Inconnu", "common.unknownFilter": "Filtre inconnu", "common.unknownObject": "Objet inconnu", "common.keep": "Conserver", "common.review": "À revoir", "common.discard": "Rejeter", "common.ok": "OK", "common.issue": "Problème", "common.notAvailable": "n/d", "common.on": "activée", "common.off": "désactivée",
      "frame.light": "Light", "frame.flat": "Flat", "frame.dark": "Dark", "frame.bias": "Bias", "frame.darkFlat": "Dark Flat",
      "metric.type": "Type", "metric.filter": "Filtre", "metric.status": "État", "metric.level": "Niveau", "metric.spread": "Dispersion", "metric.noise": "Bruit", "metric.exp": "Exp", "metric.temp": "Temp", "metric.expMatch": "Corresp. exp.", "metric.tempMatch": "Corresp. temp.", "metric.mean": "Moyenne", "metric.setDelta": "Écart série", "metric.hotPx": "Px chauds", "metric.darkPx": "Px sombres", "metric.gradient": "Gradient", "metric.artefact": "Artefact", "metric.histDiff": "Écart hist.", "metric.tileDiff": "Écart tuiles", "metric.sensor": "Capteur", "metric.object": "Objet", "metric.scale": "Échelle", "metric.focal": "Focale", "metric.pixel": "Pixel", "metric.shotOffset": "Décalage", "metric.sharp": "Netteté", "metric.round": "Rondeur", "metric.ecc": "Excent.", "metric.hfr": "HFR", "metric.stars": "Étoiles", "metric.cloud": "Nuage", "metric.clip": "Écrêtage", "metric.nearSat": "Presque sat.", "metric.tracking": "Suivi", "metric.guideStars": "Étoiles guide",
      "filter.mixedTypes": "Plusieurs types de poses détectés. Les poses de calibration utilisent des contrôles dédiés.", "filter.mixedLightCalibration": "Les scores Light et les séries de calibration sont regroupés par filtre.", "filter.mixedCalibration": "Les séries de calibration sont regroupées par filtre lorsque cela est utile.", "filter.mixedScores": "Les scores sont regroupés par filtre pour une comparaison équitable.", "filter.mixedObjects": "Les scores Light sont aussi regroupés par objet à partir des coordonnées RA/DEC FITS.", "filter.calibrationThresholdNote": "Les poses de calibration utilisent des contrôles propres à leur fonction.", "filter.thresholdAria": "Seuil de conservation pour {filter}", "filter.framesOne": "1 pose", "filter.framesMany": "{count} poses", "filter.noMetadata": "{frames} - aucun filtre trouvé dans l'en-tête FITS ou le chemin", "filter.groupDetail": "{frames} dans ce groupe de filtres",
      "calibration.report": "Rapport de calibration", "calibration.reportNote": "{frames} pose(s) de calibration dans {sets} série(s). {issues} série(s) à revoir.", "calibration.consistencyChecked": "Cohérence de la série vérifiée", "calibration.consistencyNeeds": "La vérification nécessite au moins 3 poses", "calibration.frames": "Poses", "calibration.median": "Médiane", "calibration.range": "Plage", "calibration.quality": "Qualité", "calibration.outliers": "Aberrantes", "calibration.keep": "Conserver", "calibration.artefacts": "Artefacts", "calibration.warnings": "Alertes", "calibration.noWarnings": "Aucune alerte de calibration", "calibration.lightAnalysis": "Analyse Light", "calibration.flatHistogram": "Histogramme Flat", "calibration.medianValue": "Médiane {value}",
      "score.why": "Pourquoi ce score ?", "score.base": "Base {value}", "score.final": "Final {value}", "score.noPenalties": "Aucune pénalité appliquée.", "warning.frameWarnings": "Alertes de la pose", "warning.cloudFallback": "Nuage ou brume détecté", "warning.haloFallback": "Halo d'étoile brillante détecté", "tracking.lowConfidence": "Confiance faible", "tracking.repeatDrift": "Dérive répétée", "tracking.trackingRepeat": "Suivi + répétition", "tracking.error": "Erreur de suivi", "tracking.possibleRepeat": "Dérive répétée possible", "tracking.possibleMixed": "Dérive mixte possible", "tracking.possibleDrift": "Dérive possible", "halo.likely": "Halo probable", "halo.possible": "Halo possible", "cloud.likely": "Nuage probable", "cloud.possible": "Nuage possible", "flat.genericSensor": "Capteur générique"
    },
    de: {
      "brand.kicker": "Lokale Einzelbildprüfung", "brand.logoAlt": "Moon-Conjunction-Logo", "brand.offline": "Lokal installiert", "language.label": "Sprache", "language.ariaLabel": "Sprache der Benutzeroberfläche",
      "folders.title": "Bildordner", "folders.add": "Ordner hinzufügen", "folders.clear": "Ordner leeren", "folders.none": "Keine Ordner ausgewählt", "folders.selected": "Ausgewählte Ordner", "folders.one": "{count} Ordner", "folders.many": "{count} Ordner", "folders.ignored": "{count} ignoriert", "frames.one": "1 Astronomieaufnahme", "frames.many": "{count} Astronomieaufnahmen",
      "controls.sharpness": "Schärfe", "controls.sharpnessMode": "Schärfemodus", "controls.hybrid": "Hybrid", "controls.fwhmOnly": "Nur FWHM", "controls.noisePenalty": "Rauschabzug", "controls.roundness": "Rundheit", "controls.starCount": "Sternanzahl", "controls.clippingPenalty": "Clipping-Abzug", "controls.previewStretch": "Vorschaustrecken", "controls.defaultValue": "Standard {value}", "controls.analysisMode": "Analysemodus", "controls.standard": "Standard", "controls.expert": "Experte",
      "actions.analyse": "Analysieren", "actions.stop": "Analyse stoppen", "actions.defaults": "Analyse-Standardwerte wiederherstellen", "actions.penaliseHalo": "Halo abwerten", "actions.csvSeparator": "CSV-Trennzeichen", "actions.export": "CSV exportieren", "separator.comma": "Komma (,)", "separator.semicolon": "Semikolon (;)", "separator.tab": "Tabulator", "separator.pipe": "Senkrechter Strich (|)", "summary.initial": "Wählen Sie einen oder mehrere Ordner und klicken Sie auf Analysieren.",
      "sections.frameTypes": "Aufnahmetypen", "sections.frameTypesAria": "Gruppen nach Aufnahmetyp", "sections.filters": "Filter", "sections.filtersAria": "Filtergruppen", "sections.objectShots": "Aufgenommene Objekte", "sections.objectShotsAria": "Gruppen aufgenommener Objekte", "sections.resultGroups": "Ergebnisgruppen", "sections.resultGroupsAria": "Empfehlungsgruppen", "sections.thresholds": "Behalten-Schwellenwerte nach Filter", "sections.thresholdsAria": "Behalten-Schwellenwerte nach Filter",
      "selection.selectAll": "Alle auswählen", "selection.selectAllAria": "Alle analysierten Bilder auswählen", "selection.copyFilter": "Nach Filter kopieren", "selection.copyFilterAria": "Ausgewählte Bilder in Filterordner kopieren", "selection.copyType": "Nach Typ kopieren", "selection.copyTypeAria": "Ausgewählte Bilder in Aufnahmetypordner kopieren", "selection.chooseOutput": "Ausgabeordner wählen", "selection.selectKeepers": "Behaltene auswählen", "selection.clear": "Auswahl löschen", "selection.send": "Auswahl senden", "output.notSelected": "Ausgabeordner: nicht ausgewählt", "output.unsupported": "Ausgabeordner: von diesem Browser nicht unterstützt", "output.selected": "Ausgabeordner: {name}", "results.ariaLabel": "Analysierte Bilder",
      "zoom.lensStretch": "Lupenstreckung", "zoom.stars": "Sterne", "zoom.magnifier": "Lupe", "zoom.lens": "Vergrößerung", "zoom.close": "Schließen", "common.all": "Alle", "common.unknown": "Unbekannt", "common.unknownFilter": "Unbekannter Filter", "common.unknownObject": "Unbekanntes Objekt", "common.keep": "Behalten", "common.review": "Prüfen", "common.discard": "Verwerfen", "common.ok": "OK", "common.issue": "Problem", "common.notAvailable": "n. v.", "common.on": "ein", "common.off": "aus",
      "frame.light": "Light", "frame.flat": "Flat", "frame.dark": "Dark", "frame.bias": "Bias", "frame.darkFlat": "Dark Flat",
      "metric.type": "Typ", "metric.filter": "Filter", "metric.status": "Status", "metric.level": "Pegel", "metric.spread": "Streuung", "metric.noise": "Rauschen", "metric.exp": "Bel.", "metric.temp": "Temp.", "metric.expMatch": "Bel.-Abgleich", "metric.tempMatch": "Temp.-Abgleich", "metric.mean": "Mittelwert", "metric.setDelta": "Serienabweichung", "metric.hotPx": "Heiße Px", "metric.darkPx": "Dunkle Px", "metric.gradient": "Gradient", "metric.artefact": "Artefakt", "metric.histDiff": "Hist.-Diff.", "metric.tileDiff": "Kachel-Diff.", "metric.sensor": "Sensor", "metric.object": "Objekt", "metric.scale": "Maßstab", "metric.focal": "Brennweite", "metric.pixel": "Pixel", "metric.shotOffset": "Versatz", "metric.sharp": "Schärfe", "metric.round": "Rundheit", "metric.ecc": "Exz.", "metric.hfr": "HFR", "metric.stars": "Sterne", "metric.cloud": "Wolke", "metric.clip": "Clipping", "metric.nearSat": "Fast gesätt.", "metric.tracking": "Nachführung", "metric.guideStars": "Leitsterne",
      "filter.mixedTypes": "Gemischte Aufnahmetypen erkannt. Kalibrierungsaufnahmen verwenden eigene Prüfungen.", "filter.mixedLightCalibration": "Light-Wertungen und Kalibrierungsserien werden nach Filter gruppiert.", "filter.mixedCalibration": "Kalibrierungsserien werden bei Bedarf nach Filter gruppiert.", "filter.mixedScores": "Wertungen werden für einen fairen Vergleich nach Filter gruppiert.", "filter.mixedObjects": "Light-Wertungen werden anhand der FITS-RA/DEC auch nach Objekt gruppiert.", "filter.calibrationThresholdNote": "Kalibrierungsaufnahmen verwenden zweckspezifische Prüfungen.", "filter.thresholdAria": "Behalten-Schwellenwert für {filter}", "filter.framesOne": "1 Aufnahme", "filter.framesMany": "{count} Aufnahmen", "filter.noMetadata": "{frames} - kein Filter im FITS-Header oder Pfad gefunden", "filter.groupDetail": "{frames} in dieser Filtergruppe",
      "calibration.report": "Kalibrierungsbericht", "calibration.reportNote": "{frames} Kalibrierungsaufnahme(n) in {sets} Serie(n). {issues} Serie(n) müssen geprüft werden.", "calibration.consistencyChecked": "Serienkonsistenz geprüft", "calibration.consistencyNeeds": "Konsistenzprüfung benötigt mindestens 3 Aufnahmen", "calibration.frames": "Aufnahmen", "calibration.median": "Median", "calibration.range": "Bereich", "calibration.quality": "Qualität", "calibration.outliers": "Ausreißer", "calibration.keep": "Behalten", "calibration.artefacts": "Artefakte", "calibration.warnings": "Warnungen", "calibration.noWarnings": "Keine Kalibrierungswarnungen", "calibration.lightAnalysis": "Light-Analyse", "calibration.flatHistogram": "Flat-Histogramm", "calibration.medianValue": "Median {value}",
      "score.why": "Warum diese Wertung?", "score.base": "Basis {value}", "score.final": "Endwert {value}", "score.noPenalties": "Keine Abzüge angewendet.", "warning.frameWarnings": "Aufnahmewarnungen", "warning.cloudFallback": "Wolken oder Dunst erkannt", "warning.haloFallback": "Halo um hellen Stern erkannt", "tracking.lowConfidence": "Geringe Sicherheit", "tracking.repeatDrift": "Wiederholte Drift", "tracking.trackingRepeat": "Nachführung + Wiederholung", "tracking.error": "Nachführfehler", "tracking.possibleRepeat": "Mögliche wiederholte Drift", "tracking.possibleMixed": "Mögliche gemischte Drift", "tracking.possibleDrift": "Mögliche Drift", "halo.likely": "Wahrscheinlicher Halo", "halo.possible": "Möglicher Halo", "cloud.likely": "Wahrscheinliche Wolke", "cloud.possible": "Mögliche Wolke", "flat.genericSensor": "Allgemeiner Sensor"
    }
  };

  Object.assign(translations.es, {
    "help.analysisModeLabel": "Profundidad del modo de análisis",
    "zoom.selectImage": "Seleccionar imagen", "zoom.selectFile": "Seleccionar {name}", "zoom.openPreview": "Abrir previsualización de {name}", "zoom.previewAlt": "Previsualización de {name}", "zoom.showStars": "Mostrar estrellas guía y de referencia", "zoom.lightOnlyStars": "La superposición de estrellas solo está disponible para tomas Light", "zoom.gridDetail": "Previsualización en cuadrícula; detalle de lupa {width} x {height} px", "zoom.prepareDetail": "Previsualización en cuadrícula; mueva el puntero sobre la imagen para preparar el detalle", "zoom.enableMagnifier": "Previsualización en cuadrícula; active la Lupa para inspección de alta resolución", "zoom.starStatus": "Estrella HFR {hfr} px, FWHM {minor} / {major} px, redondez {roundness}%{trail}{corner}{borderline}", "zoom.trailRatio": ", relación de trazo {value}", "zoom.cornerWarning": ", aviso de forma en esquina", "zoom.borderline": ", forma límite",
    "filter.named": "Filtro {name}", "score.elongation": "Elongación", "score.halo": "Halo", "score.clouds": "Nubes", "score.calibration": "Calibración",
    "status.defaultsRestored": "Se restauraron los porcentajes predeterminados.", "status.previewRefreshed": "Se actualizó el estirado de la previsualización.", "status.previewFailed": "No se pudo actualizar la previsualización.", "status.refreshingPreviews": "Actualizando previsualizaciones estiradas... {done}/{total}", "status.selectFolders": "Seleccione primero una o varias carpetas con imágenes.", "status.noSupported": "No se encontraron tomas astronómicas compatibles.", "status.noSupportedIgnored": "No se encontraron tomas astronómicas compatibles. Se ignoraron {count} archivos de sistema o no válidos.", "status.noNewFrames": "No hay nuevas tomas compatibles; se actualizaron las puntuaciones existentes.", "status.analysisStopped": "Análisis detenido tras {done} de {total} tomas pendientes.", "status.newFramesKept": "Se analizaron {newCount} tomas nuevas y se conservaron {existing} resultados existentes.", "status.modeSelected": "Modo {mode} seleccionado.", "status.modeChanged": "El modo de análisis cambió a {mode}. Pulse Analizar para volver a medir las tomas.", "status.noNewFiles": "No se añadieron archivos nuevos de esa carpeta.", "status.folderAdded": "Carpeta añadida. Pulse Analizar para procesar solo los archivos nuevos.", "status.foldersCleared": "Se borró la selección de carpetas.", "status.analysisFailed": "Falló el análisis de uno o varios archivos.", "status.outputSelected": "Carpeta de salida seleccionada.", "status.outputPickerFailed": "No se pudo abrir el selector de carpeta de salida.", "status.outputUnsupported": "Este navegador no permite copiar a una carpeta de salida.", "status.chooseOutput": "Elija primero una carpeta de salida.", "status.selectImage": "Seleccione al menos una imagen para enviar.", "status.sending": "Enviando imágenes seleccionadas... {done}/{total}", "status.sendFailed": "No se pudieron enviar las imágenes seleccionadas.", "status.sent": "Se enviaron {copied} imagen(es) a \"{name}\"{folders}. Fallos: {failed}.", "status.usingFolders": " usando carpetas por {folders}", "status.typeFolder": "tipo", "status.filterFolder": "filtro", "status.and": " y ",
    "progress.estimating": "estimando", "progress.new": "nuevas", "progress.unknownMemory": "memoria desconocida", "progress.oneImage": "1 imagen {adjective}", "progress.manyImages": "{count} imágenes {adjective}", "progress.existingKept": " Se conservaron {count} resultado(s) existentes.", "progress.failed": " {count} fallaron.", "progress.workers": " usando {count} worker(s) automáticos", "progress.headline": "Analizando {target} localmente en modo {mode}{workers}... {done}/{total}.{kept}{failed}", "progress.autoWorkers": "Workers automáticos: {workers}/{cores} núcleos lógicos, {memorySource} {memory}.", "progress.desktopMemory": "memoria del equipo", "progress.browserMemory": "memoria del navegador", "progress.heapMemory": "límite de memoria del navegador", "progress.fallbackMemory": "estimación de memoria", "progress.elapsedRemaining": "Transcurrido: {elapsed}. Restante: {remaining}.", "progress.elapsedEstimating": "Transcurrido: {elapsed}. El tiempo restante se estimará tras la primera toma.", "progress.stoppedFinalising": "Transcurrido: {elapsed}. Análisis detenido. Finalizando las tomas completadas...", "progress.finalising": "Transcurrido: {elapsed}. Restante: 0 s. Finalizando resultados...",
    "summary.processedZero": "Se procesaron 0 tomas astronómicas.{ignored}", "summary.ignored": " Se ignoraron {count} archivos de sistema o no válidos.", "summary.objectShots": " Objetos fotografiados: {objects}.", "summary.normalisedFilters": " Las puntuaciones se normalizan dentro de cada filtro.", "summary.normalisedObjects": " Las puntuaciones Light se normalizan dentro de cada objeto.", "summary.full": "{runNote}Se procesaron {count} toma(s) astronómicas.{ignored} Tipos: {types}. Filtros: {filters}.{objects} Conservar: {keep}, Revisar: {review}, Descartar: {discard}. Alertas de seguimiento: {tracking} (deriva repetida: {repeat}). Avisos de nubes: {clouds}. Avisos de halo: {halos}. Penalización de halo: {haloPenalty}. Penalización lunar: {moonPenalty}. Modo de nitidez: {sharpnessMode}. Modo de análisis: {analysisMode}.{filterNote}{objectNote}"
  });

  Object.assign(translations.it, {
    "help.sharpnessLabel": "Calcolo della nitidezza", "help.sharpness": "La nitidezza è relativa al gruppo di filtri corrente. I file FITS/XISF sono misurati sui dati lineari, non sull'anteprima elaborata. La nitidezza stellare combina FWHM e HFR e premia stelle più piccole e compatte. Ibrida aggiunge il 25% di contrasto dei bordi dell'intera immagine.", "help.sharpnessModeLabel": "Calcolo delle modalità Ibrida e FWHM", "help.sharpnessMode": "Ibrida è in genere più stabile perché usa FWHM/HFR stellare e contrasto dei bordi. Solo FWHM ignora il contrasto globale e valuta la nitidezza solo dalla dimensione misurata delle stelle.", "help.noiseLabel": "Calcolo della penalità rumore", "help.noise": "Il rumore è stimato sui pixel deboli di fondo senza stelle confrontando ogni pixel con il vicinato locale 3x3. Un residuo di fondo maggiore riduce il punteggio finale.", "help.roundnessLabel": "Calcolo della rotondità", "help.roundness": "La rotondità è valutata direttamente: 100% significa stelle circolari. Usa tutte le stelle rilevate e combina il 75% del rapporto FWHM minore/maggiore con il 25% della forma basata sui momenti.", "help.starCountLabel": "Calcolo del numero di stelle", "help.starCount": "Il numero di stelle confronta ogni immagine con il gruppo di filtri corrente. Un fotogramma con molte meno stelle rispetto agli altri dello stesso filtro perde punti, aiutando a rilevare nuvole, foschia, nebbia o luce dell'alba.", "help.clippingLabel": "Calcolo della penalità clipping", "help.clipping": "Il clipping usa pixel tagliati e luci quasi sature. Nei FITS/XISF viene misurato sui dati lineari a piena risoluzione prima della riduzione dell'anteprima. Nuclei stellari saturi possono ridurre il punteggio.", "help.analysisModeLabel": "Profondità della modalità di analisi", "help.analysisMode": "Entrambe le modalità usano pixel FITS/XISF a piena risoluzione. Standard è più veloce con campionamenti leggeri; Esperta usa analisi più profonde per dimensione stellare, rotondità, deriva, nuvole, aloni, flat e istogrammi. Cambiare modalità rimisura i fotogrammi alla prossima analisi.",
    "zoom.selectImage": "Seleziona immagine", "zoom.selectFile": "Seleziona {name}", "zoom.openPreview": "Apri anteprima di {name}", "zoom.previewAlt": "Anteprima di {name}", "zoom.showStars": "Mostra stelle guida e di riferimento", "zoom.lightOnlyStars": "La sovrapposizione delle stelle è disponibile solo per i Light", "zoom.gridDetail": "Anteprima a griglia; dettaglio lente {width} x {height} px", "zoom.prepareDetail": "Anteprima a griglia; sposta il puntatore sull'immagine per preparare il dettaglio", "zoom.enableMagnifier": "Anteprima a griglia; attiva la Lente per l'ispezione ad alta risoluzione", "zoom.starStatus": "Stella HFR {hfr} px, FWHM {minor} / {major} px, rotondità {roundness}%{trail}{corner}{borderline}", "zoom.trailRatio": ", rapporto scia {value}", "zoom.cornerWarning": ", avviso forma all'angolo", "zoom.borderline": ", forma al limite",
    "filter.named": "Filtro {name}", "score.elongation": "Allungamento", "score.halo": "Alone", "score.clouds": "Nuvole", "score.calibration": "Calibrazione",
    "status.defaultsRestored": "Percentuali predefinite ripristinate.", "status.previewRefreshed": "Stretch dell'anteprima aggiornato.", "status.previewFailed": "Aggiornamento dell'anteprima non riuscito.", "status.refreshingPreviews": "Aggiornamento anteprime elaborate... {done}/{total}", "status.selectFolders": "Seleziona prima una o più cartelle con immagini.", "status.noSupported": "Nessun fotogramma astronomico supportato trovato.", "status.noSupportedIgnored": "Nessun fotogramma astronomico supportato trovato. Ignorati {count} file non validi o di sistema.", "status.noNewFrames": "Nessun nuovo fotogramma supportato; punteggi esistenti aggiornati.", "status.analysisStopped": "Analisi interrotta dopo {done} di {total} fotogrammi in attesa.", "status.newFramesKept": "Analizzati {newCount} nuovi fotogrammi; mantenuti {existing} risultati esistenti.", "status.modeSelected": "Modalità {mode} selezionata.", "status.modeChanged": "Modalità di analisi impostata su {mode}. Fai clic su Analizza per rimisurare i fotogrammi.", "status.noNewFiles": "Nessun nuovo file aggiunto da quella cartella.", "status.folderAdded": "Cartella aggiunta. Fai clic su Analizza per elaborare solo i nuovi file.", "status.foldersCleared": "Selezione cartelle cancellata.", "status.analysisFailed": "Analisi non riuscita per uno o più file.", "status.outputSelected": "Cartella di destinazione selezionata.", "status.outputPickerFailed": "Impossibile aprire la selezione della cartella di destinazione.", "status.outputUnsupported": "La copia in una cartella di destinazione non è supportata da questo browser.", "status.chooseOutput": "Scegli prima una cartella di destinazione.", "status.selectImage": "Seleziona almeno un'immagine da inviare.", "status.sending": "Invio immagini selezionate... {done}/{total}", "status.sendFailed": "Invio delle immagini selezionate non riuscito.", "status.sent": "Inviate {copied} immagine/i a \"{name}\"{folders}. Errori: {failed}.", "status.usingFolders": " usando cartelle per {folders}", "status.typeFolder": "tipo", "status.filterFolder": "filtro", "status.and": " e ",
    "progress.estimating": "stima in corso", "progress.new": "nuovi", "progress.unknownMemory": "memoria sconosciuta", "progress.oneImage": "1 immagine {adjective}", "progress.manyImages": "{count} immagini {adjective}", "progress.existingKept": " Mantenuti {count} risultati esistenti.", "progress.failed": " {count} non riusciti.", "progress.workers": " con {count} worker automatici", "progress.headline": "Analisi locale di {target} in modalità {mode}{workers}... {done}/{total}.{kept}{failed}", "progress.autoWorkers": "Worker automatici: {workers}/{cores} core logici, {memorySource} {memory}.", "progress.desktopMemory": "memoria del computer", "progress.browserMemory": "memoria del browser", "progress.heapMemory": "limite memoria del browser", "progress.fallbackMemory": "stima della memoria", "progress.elapsedRemaining": "Trascorso: {elapsed}. Rimanente: {remaining}.", "progress.elapsedEstimating": "Trascorso: {elapsed}. Stima del tempo rimanente dopo il primo fotogramma.", "progress.stoppedFinalising": "Trascorso: {elapsed}. Analisi interrotta. Completamento dei fotogrammi elaborati...", "progress.finalising": "Trascorso: {elapsed}. Rimanente: 0 s. Completamento risultati...",
    "summary.processedZero": "Elaborati 0 fotogrammi astronomici.{ignored}", "summary.ignored": " Ignorati {count} file non validi o di sistema.", "summary.objectShots": " Oggetti ripresi: {objects}.", "summary.normalisedFilters": " I punteggi sono normalizzati all'interno di ogni filtro.", "summary.normalisedObjects": " I punteggi Light sono normalizzati all'interno di ogni oggetto.", "summary.full": "{runNote}Elaborati {count} fotogrammi astronomici.{ignored} Tipi: {types}. Filtri: {filters}.{objects} Conserva: {keep}, Rivedi: {review}, Scarta: {discard}. Avvisi inseguimento: {tracking} (deriva ripetuta: {repeat}). Avvisi nuvole: {clouds}. Avvisi alone: {halos}. Penalità alone: {haloPenalty}. Penalità lunare: {moonPenalty}. Modalità nitidezza: {sharpnessMode}. Modalità analisi: {analysisMode}.{filterNote}{objectNote}"
  });

  Object.assign(translations.fr, {
    "help.sharpnessLabel": "Calcul de la netteté", "help.sharpness": "La netteté est relative au groupe de filtres actuel. Les fichiers FITS/XISF sont mesurés sur les données linéaires, et non sur l'aperçu étiré. La netteté stellaire combine FWHM et HFR et favorise les étoiles plus petites et plus serrées. Le mode Hybride ajoute 25 % de contraste des contours de l'image entière.", "help.sharpnessModeLabel": "Calcul des modes Hybride et FWHM", "help.sharpnessMode": "Hybride est généralement plus stable car il utilise le FWHM/HFR stellaire et le contraste des contours. FWHM uniquement ignore le contraste global et classe la netteté uniquement à partir de la taille mesurée des étoiles.", "help.noiseLabel": "Calcul de la pénalité de bruit", "help.noise": "Le bruit est estimé sur les pixels faibles du fond sans étoile, en comparant chaque pixel à son voisinage local 3x3. Un résidu de fond plus élevé réduit le score final.", "help.roundnessLabel": "Calcul de la rondeur", "help.roundness": "La rondeur est notée directement : 100 % signifie des étoiles circulaires. Elle utilise toutes les étoiles détectées et combine 75 % du rapport FWHM mineur/majeur avec 25 % de la forme basée sur les moments.", "help.starCountLabel": "Calcul du nombre d'étoiles", "help.starCount": "Le nombre d'étoiles compare chaque image au groupe de filtres actuel. Une pose avec beaucoup moins d'étoiles que les poses du même filtre perd des points, ce qui aide à détecter nuages, brume, brouillard ou lueur de l'aube.", "help.clippingLabel": "Calcul de la pénalité d'écrêtage", "help.clipping": "L'écrêtage combine les pixels écrêtés et les hautes lumières presque saturées. Pour les FITS/XISF, il est mesuré sur les données linéaires pleine résolution avant la réduction de l'aperçu. Les cœurs d'étoiles saturés peuvent réduire le score.", "help.analysisModeLabel": "Profondeur du mode d'analyse", "help.analysisMode": "Les deux modes utilisent les pixels FITS/XISF en pleine résolution. Standard reste rapide avec un échantillonnage léger ; Expert approfondit la taille des étoiles, la rondeur, la dérive, les nuages, les halos, les flats et les histogrammes. Changer de mode remesure les poses lors de la prochaine analyse.",
    "zoom.selectImage": "Sélectionner l'image", "zoom.selectFile": "Sélectionner {name}", "zoom.openPreview": "Ouvrir l'aperçu de {name}", "zoom.previewAlt": "Aperçu de {name}", "zoom.showStars": "Afficher les étoiles guides et de référence", "zoom.lightOnlyStars": "La superposition d'étoiles est réservée aux poses Light", "zoom.gridDetail": "Aperçu en grille ; détail de la loupe {width} x {height} px", "zoom.prepareDetail": "Aperçu en grille ; déplacez le pointeur sur l'image pour préparer le détail", "zoom.enableMagnifier": "Aperçu en grille ; activez la Loupe pour l'inspection haute résolution", "zoom.starStatus": "Étoile HFR {hfr} px, FWHM {minor} / {major} px, rondeur {roundness}%{trail}{corner}{borderline}", "zoom.trailRatio": ", rapport de traînée {value}", "zoom.cornerWarning": ", alerte de forme en bordure", "zoom.borderline": ", forme limite",
    "filter.named": "Filtre {name}", "score.elongation": "Allongement", "score.halo": "Halo", "score.clouds": "Nuages", "score.calibration": "Calibration",
    "status.defaultsRestored": "Les pourcentages par défaut ont été restaurés.", "status.previewRefreshed": "L'étirement de l'aperçu a été actualisé.", "status.previewFailed": "Échec de l'actualisation de l'aperçu.", "status.refreshingPreviews": "Actualisation des aperçus étirés... {done}/{total}", "status.selectFolders": "Sélectionnez d'abord un ou plusieurs dossiers contenant des images.", "status.noSupported": "Aucune pose astronomique prise en charge n'a été trouvée.", "status.noSupportedIgnored": "Aucune pose astronomique prise en charge n'a été trouvée. {count} fichier(s) système ou non valide(s) ignoré(s).", "status.noNewFrames": "Aucune nouvelle pose prise en charge ; les scores existants ont été actualisés.", "status.analysisStopped": "Analyse arrêtée après {done} des {total} poses en attente.", "status.newFramesKept": "{newCount} nouvelle(s) pose(s) analysée(s) ; {existing} résultat(s) existant(s) conservé(s).", "status.modeSelected": "Mode {mode} sélectionné.", "status.modeChanged": "Le mode d'analyse est passé à {mode}. Cliquez sur Analyser pour remesurer les poses.", "status.noNewFiles": "Aucun nouveau fichier ajouté depuis ce dossier.", "status.folderAdded": "Dossier ajouté. Cliquez sur Analyser pour ne traiter que les nouveaux fichiers.", "status.foldersCleared": "La sélection de dossiers a été effacée.", "status.analysisFailed": "Échec de l'analyse pour un ou plusieurs fichiers.", "status.outputSelected": "Dossier de sortie sélectionné.", "status.outputPickerFailed": "Impossible d'ouvrir le sélecteur de dossier de sortie.", "status.outputUnsupported": "La copie vers un dossier de sortie n'est pas prise en charge par ce navigateur.", "status.chooseOutput": "Choisissez d'abord un dossier de sortie.", "status.selectImage": "Sélectionnez au moins une image à envoyer.", "status.sending": "Envoi des images sélectionnées... {done}/{total}", "status.sendFailed": "Échec de l'envoi des images sélectionnées.", "status.sent": "{copied} image(s) envoyée(s) vers \"{name}\"{folders}. Échecs : {failed}.", "status.usingFolders": " avec des dossiers par {folders}", "status.typeFolder": "type", "status.filterFolder": "filtre", "status.and": " et ",
    "progress.estimating": "estimation", "progress.new": "nouvelles", "progress.unknownMemory": "mémoire inconnue", "progress.oneImage": "1 image {adjective}", "progress.manyImages": "{count} images {adjective}", "progress.existingKept": " {count} résultat(s) existant(s) conservé(s).", "progress.failed": " {count} en échec.", "progress.workers": " avec {count} workers automatiques", "progress.headline": "Analyse locale de {target} en mode {mode}{workers}... {done}/{total}.{kept}{failed}", "progress.autoWorkers": "Workers automatiques : {workers}/{cores} cœurs logiques, {memorySource} {memory}.", "progress.desktopMemory": "mémoire de l'ordinateur", "progress.browserMemory": "mémoire du navigateur", "progress.heapMemory": "limite mémoire du navigateur", "progress.fallbackMemory": "estimation de mémoire", "progress.elapsedRemaining": "Écoulé : {elapsed}. Restant : {remaining}.", "progress.elapsedEstimating": "Écoulé : {elapsed}. Estimation du temps restant après la première pose.", "progress.stoppedFinalising": "Écoulé : {elapsed}. Analyse arrêtée. Finalisation des poses terminées...", "progress.finalising": "Écoulé : {elapsed}. Restant : 0 s. Finalisation des résultats...",
    "summary.processedZero": "0 pose astronomique traitée.{ignored}", "summary.ignored": " {count} fichier(s) système ou non valide(s) ignoré(s).", "summary.objectShots": " Objets photographiés : {objects}.", "summary.normalisedFilters": " Les scores sont normalisés au sein de chaque filtre.", "summary.normalisedObjects": " Les scores Light sont normalisés au sein de chaque objet.", "summary.full": "{runNote}{count} pose(s) astronomique(s) traitée(s).{ignored} Types : {types}. Filtres : {filters}.{objects} Conserver : {keep}, À revoir : {review}, Rejeter : {discard}. Alertes de suivi : {tracking} (dérive répétée : {repeat}). Alertes de nuages : {clouds}. Alertes de halo : {halos}. Pénalité de halo : {haloPenalty}. Pénalité lunaire : {moonPenalty}. Mode de netteté : {sharpnessMode}. Mode d'analyse : {analysisMode}.{filterNote}{objectNote}"
  });

  Object.assign(translations.de, {
    "help.sharpnessLabel": "Schärfeberechnung", "help.sharpness": "Die Schärfe wird relativ zur aktuellen Filtergruppe bewertet. FITS/XISF-Dateien werden aus linearen Bilddaten gemessen, nicht aus der gestreckten Vorschau. Die Sternschärfe kombiniert FWHM und HFR und belohnt kleinere, kompaktere Sterne. Hybrid ergänzt 25 % Kantenkontrast des Gesamtbilds.", "help.sharpnessModeLabel": "Berechnung der Modi Hybrid und FWHM", "help.sharpnessMode": "Hybrid ist meist stabiler, da Stern-FWHM/HFR und Kantenkontrast verwendet werden. Nur FWHM ignoriert den globalen Kantenkontrast und bewertet die Schärfe nur anhand der gemessenen Sterngröße.", "help.noiseLabel": "Berechnung des Rauschabzugs", "help.noise": "Das Rauschen wird aus schwachen, sternfreien Hintergrundpixeln geschätzt, indem jedes Pixel mit seiner lokalen 3x3-Umgebung verglichen wird. Mehr Hintergrundrest senkt die Endwertung.", "help.roundnessLabel": "Berechnung der Rundheit", "help.roundness": "Die Rundheit wird direkt bewertet: 100 % bedeutet kreisförmige Sterne. Alle erkannten Sterne werden verwendet; 75 % stammen aus dem Verhältnis FWHM klein/groß und 25 % aus der Momentform.", "help.starCountLabel": "Berechnung der Sternanzahl", "help.starCount": "Die Sternanzahl vergleicht jedes Bild mit seiner Filtergruppe. Eine Aufnahme mit deutlich weniger Sternen als andere Aufnahmen desselben Filters verliert Punkte; dies hilft bei der Erkennung von Wolken, Dunst, Nebel oder Morgendämmerung.", "help.clippingLabel": "Berechnung des Clipping-Abzugs", "help.clipping": "Clipping umfasst hart abgeschnittene Pixel und fast gesättigte Lichter. Bei FITS/XISF wird es aus linearen Vollauflösungsdaten vor der Vorschauverkleinerung gemessen. Gesättigte Sternkerne können die Wertung senken.", "help.analysisModeLabel": "Analysetiefe", "help.analysisMode": "Beide Modi nutzen FITS/XISF-Pixel in voller Auflösung. Standard bleibt mit leichteren Stichproben schneller; Experte untersucht Sterngröße, Rundheit, Drift, Wolken, Halos, Flats und Histogramme tiefer. Ein Moduswechsel vermisst die Aufnahmen bei der nächsten Analyse neu.",
    "zoom.selectImage": "Bild auswählen", "zoom.selectFile": "{name} auswählen", "zoom.openPreview": "Vorschau für {name} öffnen", "zoom.previewAlt": "Vorschau für {name}", "zoom.showStars": "Leit- und Referenzsterne anzeigen", "zoom.lightOnlyStars": "Die Sternüberlagerung ist nur für Light-Aufnahmen verfügbar", "zoom.gridDetail": "Rastervorschau; Lupendetail {width} x {height} px", "zoom.prepareDetail": "Rastervorschau; Maus über das Bild bewegen, um das Detail vorzubereiten", "zoom.enableMagnifier": "Rastervorschau; Lupe für hochauflösende Prüfung aktivieren", "zoom.starStatus": "Stern HFR {hfr} px, FWHM {minor} / {major} px, Rundheit {roundness}%{trail}{corner}{borderline}", "zoom.trailRatio": ", Spurverhältnis {value}", "zoom.cornerWarning": ", Formwarnung am Rand", "zoom.borderline": ", grenzwertige Form",
    "filter.named": "Filter {name}", "score.elongation": "Verlängerung", "score.halo": "Halo", "score.clouds": "Wolken", "score.calibration": "Kalibrierung",
    "status.defaultsRestored": "Standardprozentsätze wiederhergestellt.", "status.previewRefreshed": "Vorschaustrecken aktualisiert.", "status.previewFailed": "Vorschau konnte nicht aktualisiert werden.", "status.refreshingPreviews": "Gestreckte Vorschauen werden aktualisiert... {done}/{total}", "status.selectFolders": "Wählen Sie zuerst einen oder mehrere Ordner mit Bildern.", "status.noSupported": "Keine unterstützten Astronomieaufnahmen gefunden.", "status.noSupportedIgnored": "Keine unterstützten Astronomieaufnahmen gefunden. {count} System- oder Nicht-Bilddatei(en) ignoriert.", "status.noNewFrames": "Keine neuen unterstützten Aufnahmen; vorhandene Wertungen wurden aktualisiert.", "status.analysisStopped": "Analyse nach {done} von {total} ausstehenden Aufnahmen gestoppt.", "status.newFramesKept": "{newCount} neue Aufnahme(n) analysiert; {existing} vorhandene Ergebnisse beibehalten.", "status.modeSelected": "Modus {mode} ausgewählt.", "status.modeChanged": "Analysemodus auf {mode} geändert. Klicken Sie auf Analysieren, um die Aufnahmen neu zu vermessen.", "status.noNewFiles": "Aus diesem Ordner wurden keine neuen Dateien hinzugefügt.", "status.folderAdded": "Ordner hinzugefügt. Klicken Sie auf Analysieren, um nur neue Dateien zu verarbeiten.", "status.foldersCleared": "Ordnerauswahl gelöscht.", "status.analysisFailed": "Analyse für eine oder mehrere Dateien fehlgeschlagen.", "status.outputSelected": "Ausgabeordner ausgewählt.", "status.outputPickerFailed": "Ausgabeordner-Auswahl konnte nicht geöffnet werden.", "status.outputUnsupported": "Das Kopieren in einen Ausgabeordner wird von diesem Browser nicht unterstützt.", "status.chooseOutput": "Wählen Sie zuerst einen Ausgabeordner.", "status.selectImage": "Wählen Sie mindestens ein zu sendendes Bild.", "status.sending": "Ausgewählte Bilder werden gesendet... {done}/{total}", "status.sendFailed": "Ausgewählte Bilder konnten nicht gesendet werden.", "status.sent": "{copied} Bild(er) nach \"{name}\" gesendet{folders}. Fehler: {failed}.", "status.usingFolders": " in Ordnern nach {folders}", "status.typeFolder": "Typ", "status.filterFolder": "Filter", "status.and": " und ",
    "progress.estimating": "wird geschätzt", "progress.new": "neue", "progress.unknownMemory": "unbekannter Speicher", "progress.oneImage": "1 {adjective} Bild", "progress.manyImages": "{count} {adjective} Bilder", "progress.existingKept": " {count} vorhandene Ergebnisse beibehalten.", "progress.failed": " {count} fehlgeschlagen.", "progress.workers": " mit {count} automatischen Workern", "progress.headline": "{target} werden lokal im Modus {mode}{workers} analysiert... {done}/{total}.{kept}{failed}", "progress.autoWorkers": "Automatische Worker: {workers}/{cores} logische Kerne, {memorySource} {memory}.", "progress.desktopMemory": "Arbeitsspeicher des Computers", "progress.browserMemory": "Browserspeicher", "progress.heapMemory": "Browser-Speicherlimit", "progress.fallbackMemory": "Speicherschätzung", "progress.elapsedRemaining": "Vergangen: {elapsed}. Verbleibend: {remaining}.", "progress.elapsedEstimating": "Vergangen: {elapsed}. Restzeit wird nach der ersten Aufnahme geschätzt.", "progress.stoppedFinalising": "Vergangen: {elapsed}. Analyse gestoppt. Abgeschlossene Aufnahmen werden finalisiert...", "progress.finalising": "Vergangen: {elapsed}. Verbleibend: 0 s. Ergebnisse werden finalisiert...",
    "summary.processedZero": "0 Astronomieaufnahmen verarbeitet.{ignored}", "summary.ignored": " {count} System- oder Nicht-Bilddatei(en) ignoriert.", "summary.objectShots": " Aufgenommene Objekte: {objects}.", "summary.normalisedFilters": " Wertungen werden innerhalb jedes Filters normalisiert.", "summary.normalisedObjects": " Light-Wertungen werden innerhalb jedes Objekts normalisiert.", "summary.full": "{runNote}{count} Astronomieaufnahme(n) verarbeitet.{ignored} Typen: {types}. Filter: {filters}.{objects} Behalten: {keep}, Prüfen: {review}, Verwerfen: {discard}. Nachführwarnungen: {tracking} (wiederholte Drift: {repeat}). Wolkenwarnungen: {clouds}. Halowarnungen: {halos}. Halo-Abzug: {haloPenalty}. Mondabzug: {moonPenalty}. Schärfemodus: {sharpnessMode}. Analysemodus: {analysisMode}.{filterNote}{objectNote}"
  });

  Object.assign(translations.es, {
    "score.flatLevel": "Nivel del Flat", "score.biasLevel": "Nivel del Bias", "score.darkLevel": "Nivel del Dark", "score.darkFlatLevel": "Nivel del Dark Flat", "score.saturation": "Saturación", "score.uniformity": "Uniformidad", "score.hotPixels": "Píxeles calientes", "score.brightPixels": "Píxeles brillantes", "score.spread": "Dispersión", "score.outliers": "Valores atípicos",
    "warning.flatTooDark": "Flat demasiado oscuro", "warning.flatBelowTarget": "Flat por debajo del objetivo del histograma", "warning.flatTooBright": "Flat demasiado brillante", "warning.flatAboveTarget": "Flat por encima del objetivo del histograma", "warning.flatSaturated": "Flat saturado", "warning.flatNearSaturation": "Flat cerca de la saturación", "warning.flatUneven": "Flat muy irregular", "warning.flatGradient": "Gradiente fuerte en el Flat", "warning.flatPixelOutliers": "Píxeles atípicos en el Flat", "warning.biasHigh": "Señal de Bias alta", "warning.biasSaturated": "Píxeles saturados en el Bias", "warning.biasUneven": "Bias irregular", "warning.manyHotOutliers": "Muchos píxeles calientes atípicos", "warning.hotOutliers": "Píxeles calientes atípicos", "warning.manyDarkOutliers": "Muchos píxeles oscuros atípicos", "warning.darkOutliers": "Píxeles oscuros atípicos", "warning.lightLeak": "Fuga de luz/gradiente fuerte", "warning.possibleLightLeak": "Posible fuga de luz/gradiente", "warning.darkExposureMismatch": "La exposición del Dark no coincide con los Light", "warning.darkExposureDiffers": "La exposición del Dark difiere de los Light", "warning.temperatureMismatch": "La temperatura no coincide con los Light", "warning.temperatureDiffers": "La temperatura difiere de los Light", "warning.flatSetMismatch": "El artefacto del Flat difiere del conjunto", "warning.medianOutlier": "Mediana atípica respecto al conjunto", "warning.signalHigh": "Señal de {type} alta", "warning.saturatedPixels": "Píxeles saturados en {type}", "warning.hasBrightPixels": "{type} contiene píxeles brillantes", "warning.uneven": "{type} irregular"
  });
  Object.assign(translations.it, {
    "score.flatLevel": "Livello Flat", "score.biasLevel": "Livello Bias", "score.darkLevel": "Livello Dark", "score.darkFlatLevel": "Livello Dark Flat", "score.saturation": "Saturazione", "score.uniformity": "Uniformità", "score.hotPixels": "Pixel caldi", "score.brightPixels": "Pixel luminosi", "score.spread": "Dispersione", "score.outliers": "Anomali",
    "warning.flatTooDark": "Flat troppo scuro", "warning.flatBelowTarget": "Flat sotto l'obiettivo dell'istogramma", "warning.flatTooBright": "Flat troppo luminoso", "warning.flatAboveTarget": "Flat sopra l'obiettivo dell'istogramma", "warning.flatSaturated": "Flat saturo", "warning.flatNearSaturation": "Flat vicino alla saturazione", "warning.flatUneven": "Flat molto irregolare", "warning.flatGradient": "Gradiente forte nel Flat", "warning.flatPixelOutliers": "Pixel anomali nel Flat", "warning.biasHigh": "Segnale Bias alto", "warning.biasSaturated": "Pixel saturi nel Bias", "warning.biasUneven": "Bias irregolare", "warning.manyHotOutliers": "Molti pixel caldi anomali", "warning.hotOutliers": "Pixel caldi anomali", "warning.manyDarkOutliers": "Molti pixel scuri anomali", "warning.darkOutliers": "Pixel scuri anomali", "warning.lightLeak": "Fuga di luce/gradiente forte", "warning.possibleLightLeak": "Possibile fuga di luce/gradiente", "warning.darkExposureMismatch": "Esposizione Dark non corrispondente ai Light", "warning.darkExposureDiffers": "Esposizione Dark diversa dai Light", "warning.temperatureMismatch": "Temperatura non corrispondente ai Light", "warning.temperatureDiffers": "Temperatura diversa dai Light", "warning.flatSetMismatch": "Artefatto Flat non coerente con la serie", "warning.medianOutlier": "Mediana anomala rispetto alla serie", "warning.signalHigh": "Segnale {type} alto", "warning.saturatedPixels": "Pixel saturi in {type}", "warning.hasBrightPixels": "{type} contiene pixel luminosi", "warning.uneven": "{type} irregolare"
  });
  Object.assign(translations.fr, {
    "score.flatLevel": "Niveau du Flat", "score.biasLevel": "Niveau du Bias", "score.darkLevel": "Niveau du Dark", "score.darkFlatLevel": "Niveau du Dark Flat", "score.saturation": "Saturation", "score.uniformity": "Uniformité", "score.hotPixels": "Pixels chauds", "score.brightPixels": "Pixels brillants", "score.spread": "Dispersion", "score.outliers": "Valeurs aberrantes",
    "warning.flatTooDark": "Flat trop sombre", "warning.flatBelowTarget": "Flat sous la cible de l'histogramme", "warning.flatTooBright": "Flat trop lumineux", "warning.flatAboveTarget": "Flat au-dessus de la cible de l'histogramme", "warning.flatSaturated": "Flat saturé", "warning.flatNearSaturation": "Flat proche de la saturation", "warning.flatUneven": "Flat très irrégulier", "warning.flatGradient": "Fort gradient dans le Flat", "warning.flatPixelOutliers": "Pixels aberrants dans le Flat", "warning.biasHigh": "Signal du Bias élevé", "warning.biasSaturated": "Pixels saturés dans le Bias", "warning.biasUneven": "Bias irrégulier", "warning.manyHotOutliers": "Nombreux pixels chauds aberrants", "warning.hotOutliers": "Pixels chauds aberrants", "warning.manyDarkOutliers": "Nombreux pixels sombres aberrants", "warning.darkOutliers": "Pixels sombres aberrants", "warning.lightLeak": "Fuite de lumière/fort gradient", "warning.possibleLightLeak": "Fuite de lumière/gradient possible", "warning.darkExposureMismatch": "L'exposition du Dark ne correspond pas aux Light", "warning.darkExposureDiffers": "L'exposition du Dark diffère des Light", "warning.temperatureMismatch": "La température ne correspond pas aux Light", "warning.temperatureDiffers": "La température diffère des Light", "warning.flatSetMismatch": "Artefact du Flat incohérent avec la série", "warning.medianOutlier": "Médiane aberrante dans la série", "warning.signalHigh": "Signal {type} élevé", "warning.saturatedPixels": "Pixels saturés dans {type}", "warning.hasBrightPixels": "{type} contient des pixels brillants", "warning.uneven": "{type} irrégulier"
  });
  Object.assign(translations.de, {
    "score.flatLevel": "Flat-Pegel", "score.biasLevel": "Bias-Pegel", "score.darkLevel": "Dark-Pegel", "score.darkFlatLevel": "Dark-Flat-Pegel", "score.saturation": "Sättigung", "score.uniformity": "Gleichmäßigkeit", "score.hotPixels": "Heiße Pixel", "score.brightPixels": "Helle Pixel", "score.spread": "Streuung", "score.outliers": "Ausreißer",
    "warning.flatTooDark": "Flat zu dunkel", "warning.flatBelowTarget": "Flat unter dem Histogrammziel", "warning.flatTooBright": "Flat zu hell", "warning.flatAboveTarget": "Flat über dem Histogrammziel", "warning.flatSaturated": "Flat gesättigt", "warning.flatNearSaturation": "Flat nahe der Sättigung", "warning.flatUneven": "Flat sehr ungleichmäßig", "warning.flatGradient": "Starker Gradient im Flat", "warning.flatPixelOutliers": "Pixelausreißer im Flat", "warning.biasHigh": "Bias-Signal zu hoch", "warning.biasSaturated": "Gesättigte Pixel im Bias", "warning.biasUneven": "Bias ungleichmäßig", "warning.manyHotOutliers": "Viele Ausreißer bei heißen Pixeln", "warning.hotOutliers": "Ausreißer bei heißen Pixeln", "warning.manyDarkOutliers": "Viele Ausreißer bei dunklen Pixeln", "warning.darkOutliers": "Ausreißer bei dunklen Pixeln", "warning.lightLeak": "Lichtleck/starker Gradient", "warning.possibleLightLeak": "Mögliches Lichtleck/Gradient", "warning.darkExposureMismatch": "Dark-Belichtung passt nicht zu den Lights", "warning.darkExposureDiffers": "Dark-Belichtung weicht von den Lights ab", "warning.temperatureMismatch": "Temperatur passt nicht zu den Lights", "warning.temperatureDiffers": "Temperatur weicht von den Lights ab", "warning.flatSetMismatch": "Flat-Artefakt weicht von der Serie ab", "warning.medianOutlier": "Median-Ausreißer in der Serie", "warning.signalHigh": "{type}-Signal zu hoch", "warning.saturatedPixels": "Gesättigte Pixel in {type}", "warning.hasBrightPixels": "{type} enthält helle Pixel", "warning.uneven": "{type} ungleichmäßig"
  });

  // Reviewed wording imported from the user-approved TRANSLATIONS.md glossary.
  Object.assign(translations.es, {
    "common.unknownObject": "Objeto celeste desconocido",
    "controls.clippingPenalty": "Penalización por clipping",
    "help.starCount": "El número de estrellas compara cada toma con su grupo de filtro. Una toma con muchas menos estrellas que otras del mismo filtro pierde puntuación, lo que ayuda a detectar nubes, bruma, niebla o el brillo del amanecer.",
    "help.clippingLabel": "Cálculo de la penalización por clipping",
    "help.clipping": "El clipping combina píxeles con valores recortados y altas luces casi saturadas. En FITS/XISF se mide sobre datos lineales a resolución completa antes de reducir la previsualización. Los núcleos estelares saturados pueden reducir la puntuación.",
    "selection.selectAllAria": "Seleccionar todas las tomas analizadas",
    "selection.copyFilterAria": "Copiar las tomas seleccionadas en carpetas por filtro",
    "selection.copyTypeAria": "Copiar las tomas seleccionadas en carpetas por tipo",
    "selection.selectKeepers": "Seleccionar tomas para conservar",
    "sections.objectShots": "Objetos celestes fotografiados",
    "sections.objectShotsAria": "Grupos de objetos celestes fotografiados",
    "results.ariaLabel": "Tomas analizadas",
    "filter.mixedObjects": "Las puntuaciones Light también se agrupan por objeto celeste según RA/DEC de FITS.",
    "metric.object": "Obj. celeste",
    "metric.shotOffset": "Desplazamiento de toma",
    "metric.clip": "Clipping",
    "status.noSupportedIgnored": "No se encontraron tomas astronómicas compatibles. Se ignoraron {count} archivos que no son tomas o son de sistema.",
    "status.selectImage": "Seleccione al menos una toma para enviar.",
    "status.sending": "Enviando tomas seleccionadas... {done}/{total}",
    "status.sendFailed": "No se pudieron enviar las tomas seleccionadas.",
    "status.sent": "Se enviaron {copied} toma(s) a \"{name}\"{folders}. Fallos: {failed}.",
    "summary.ignored": " Se ignoraron {count} archivos que no son tomas o son de sistema.",
    "summary.objectShots": " Objetos celestes fotografiados: {objects}.",
    "summary.normalisedObjects": " Las puntuaciones Light se normalizan dentro de cada objeto celeste fotografiado."
  });
  Object.assign(translations.it, {
    "common.unknownObject": "Oggetto celeste sconosciuto",
    "help.starCount": "Il numero di stelle confronta ogni fotogramma con il gruppo di filtri corrente. Un fotogramma con molte meno stelle rispetto agli altri dello stesso filtro perde punti, aiutando a rilevare nuvole, foschia, nebbia o luce dell'alba.",
    "selection.selectAllAria": "Seleziona tutti i fotogrammi analizzati",
    "selection.copyFilterAria": "Copia i fotogrammi selezionati in cartelle per filtro",
    "selection.copyTypeAria": "Copia i fotogrammi selezionati in cartelle per tipo",
    "selection.selectKeepers": "Seleziona le pose da conservare",
    "sections.objectShots": "Oggetti celesti ripresi",
    "sections.objectShotsAria": "Gruppi di oggetti celesti ripresi",
    "results.ariaLabel": "Fotogrammi analizzati",
    "filter.mixedObjects": "I punteggi Light sono raggruppati anche per oggetto celeste in base a RA/DEC FITS.",
    "metric.object": "Oggetto celeste",
    "metric.shotOffset": "Scostamento della posa",
    "status.noSupportedIgnored": "Nessun fotogramma astronomico supportato trovato. Ignorati {count} file non relativi a fotogrammi o di sistema.",
    "status.selectImage": "Seleziona almeno un fotogramma da inviare.",
    "status.sending": "Invio dei fotogrammi selezionati... {done}/{total}",
    "status.sendFailed": "Invio dei fotogrammi selezionati non riuscito.",
    "status.sent": "Inviati {copied} fotogramma/i a \"{name}\"{folders}. Errori: {failed}.",
    "summary.ignored": " Ignorati {count} file non relativi a fotogrammi o di sistema.",
    "summary.objectShots": " Oggetti celesti ripresi: {objects}.",
    "summary.normalisedObjects": " I punteggi Light sono normalizzati all'interno di ogni oggetto celeste ripreso."
  });
  Object.assign(translations.fr, {
    "common.unknownObject": "Objet céleste inconnu",
    "help.starCount": "Le nombre d'étoiles compare chaque pose au groupe de filtres actuel. Une pose avec beaucoup moins d'étoiles que les poses du même filtre perd des points, ce qui aide à détecter nuages, brume, brouillard ou lueur de l'aube.",
    "selection.selectAllAria": "Sélectionner toutes les poses analysées",
    "selection.copyFilterAria": "Copier les poses sélectionnées dans des dossiers par filtre",
    "selection.copyTypeAria": "Copier les poses sélectionnées dans des dossiers par type",
    "selection.selectKeepers": "Sélectionner les poses à conserver",
    "sections.objectShots": "Objets célestes imagés",
    "sections.objectShotsAria": "Groupes d'objets célestes imagés",
    "results.ariaLabel": "Poses analysées",
    "filter.mixedObjects": "Les scores Light sont aussi regroupés par objet céleste à partir des coordonnées RA/DEC FITS.",
    "metric.object": "Objet céleste",
    "metric.shotOffset": "Décalage de pose",
    "status.noSupportedIgnored": "Aucune pose astronomique prise en charge n'a été trouvée. {count} fichier(s) ne correspondant pas à des poses ou fichier(s) système ignoré(s).",
    "status.selectImage": "Sélectionnez au moins une pose à envoyer.",
    "status.sending": "Envoi des poses sélectionnées... {done}/{total}",
    "status.sendFailed": "Échec de l'envoi des poses sélectionnées.",
    "status.sent": "{copied} pose(s) envoyée(s) vers \"{name}\"{folders}. Échecs : {failed}.",
    "summary.ignored": " {count} fichier(s) ne correspondant pas à des poses ou fichier(s) système ignoré(s).",
    "summary.objectShots": " Objets célestes imagés : {objects}.",
    "summary.normalisedObjects": " Les scores Light sont normalisés au sein de chaque objet céleste imagé."
  });
  Object.assign(translations.de, {
    "common.unknownObject": "Unbekanntes Himmelsobjekt",
    "help.starCount": "Die Sternanzahl vergleicht jede Aufnahme mit ihrer Filtergruppe. Eine Aufnahme mit deutlich weniger Sternen als andere Aufnahmen desselben Filters verliert Punkte; dies hilft bei der Erkennung von Wolken, Dunst, Nebel oder Morgendämmerung.",
    "selection.selectAllAria": "Alle analysierten Aufnahmen auswählen",
    "selection.copyFilterAria": "Ausgewählte Aufnahmen in Filterordner kopieren",
    "selection.copyTypeAria": "Ausgewählte Aufnahmen in Aufnahmetypordner kopieren",
    "selection.selectKeepers": "Zu behaltende Aufnahmen auswählen",
    "sections.objectShots": "Aufgenommene Himmelsobjekte",
    "sections.objectShotsAria": "Gruppen aufgenommener Himmelsobjekte",
    "results.ariaLabel": "Analysierte Aufnahmen",
    "filter.mixedObjects": "Light-Wertungen werden anhand der FITS-RA/DEC auch nach Himmelsobjekt gruppiert.",
    "metric.object": "Himmelsobjekt",
    "metric.shotOffset": "Aufnahmeversatz",
    "status.noSupportedIgnored": "Keine unterstützten Astronomieaufnahmen gefunden. {count} System- oder Nicht-Aufnahmedatei(en) ignoriert.",
    "status.selectImage": "Wählen Sie mindestens eine zu sendende Aufnahme.",
    "status.sending": "Ausgewählte Aufnahmen werden gesendet... {done}/{total}",
    "status.sendFailed": "Ausgewählte Aufnahmen konnten nicht gesendet werden.",
    "status.sent": "{copied} Aufnahme(n) nach \"{name}\" gesendet{folders}. Fehler: {failed}.",
    "summary.ignored": " {count} System- oder Nicht-Aufnahmedatei(en) ignoriert.",
    "summary.objectShots": " Aufgenommene Himmelsobjekte: {objects}.",
    "summary.normalisedObjects": " Light-Wertungen werden innerhalb jedes aufgenommenen Himmelsobjekts normalisiert."
  });

  Object.assign(translations.en, {
    "metric.utc": "UTC",
    "metric.moonLit": "Moon Lit",
    "metric.moonPhase": "Moon Phase",
    "metric.moonAge": "Moon Age",
    "moon.title": "Moon Illumination",
    "moon.contextOnly": "Information only",
    "moon.explanation": "The percentage is the visible Moon disc lit by the Sun. It is not the Moon's distance from your target and does not change the image score.",
    "moon.illuminated": "Moon illuminated: {value}%",
    "moon.illuminatedRange": "Moon illuminated: {minimum}-{maximum}%",
    "moon.detail": "{phase}. Approximate lunar age: {age} days. UTC time found for {covered}/{total} Light frames.",
    "moon.detailMixed": "{phases}. UTC time found for {covered}/{total} Light frames.",
    "moon.unavailableTitle": "Moon illumination unavailable",
    "moon.unavailableDetail": "No usable UTC exposure time was found for these Light frames.",
    "moon.phaseAria": "Approximate Moon phase: {phase}",
    "moon.ageValue": "{age} d",
    "moon.phase.new": "New Moon",
    "moon.phase.waxingCrescent": "Waxing Crescent",
    "moon.phase.firstQuarter": "First Quarter",
    "moon.phase.waxingGibbous": "Waxing Gibbous",
    "moon.phase.full": "Full Moon",
    "moon.phase.waningGibbous": "Waning Gibbous",
    "moon.phase.lastQuarter": "Last Quarter",
    "moon.phase.waningCrescent": "Waning Crescent"
  });

  Object.assign(translations.es, {
    "metric.utc": "UTC", "metric.moonLit": "Luna iluminada", "metric.moonPhase": "Fase lunar", "metric.moonAge": "Edad lunar",
    "moon.title": "Iluminación lunar", "moon.contextOnly": "Solo información",
    "moon.explanation": "El porcentaje es la parte visible del disco lunar iluminada por el Sol. No es la distancia entre la Luna y el objeto fotografiado y no modifica la puntuación de la imagen.",
    "moon.illuminated": "Luna iluminada: {value}%", "moon.illuminatedRange": "Luna iluminada: {minimum}-{maximum}%",
    "moon.detail": "{phase}. Edad lunar aproximada: {age} días. Hora UTC encontrada para {covered}/{total} tomas Light.",
    "moon.detailMixed": "{phases}. Hora UTC encontrada para {covered}/{total} tomas Light.",
    "moon.unavailableTitle": "Iluminación lunar no disponible", "moon.unavailableDetail": "No se encontró una hora UTC de exposición válida para estas tomas Light.",
    "moon.phaseAria": "Fase lunar aproximada: {phase}", "moon.ageValue": "{age} d",
    "moon.phase.new": "Luna nueva", "moon.phase.waxingCrescent": "Luna creciente", "moon.phase.firstQuarter": "Cuarto creciente", "moon.phase.waxingGibbous": "Gibosa creciente", "moon.phase.full": "Luna llena", "moon.phase.waningGibbous": "Gibosa menguante", "moon.phase.lastQuarter": "Cuarto menguante", "moon.phase.waningCrescent": "Luna menguante"
  });

  Object.assign(translations.it, {
    "metric.utc": "UTC", "metric.moonLit": "Luna illuminata", "metric.moonPhase": "Fase lunare", "metric.moonAge": "Età lunare",
    "moon.title": "Illuminazione lunare", "moon.contextOnly": "Solo informazione",
    "moon.explanation": "La percentuale è la parte visibile del disco lunare illuminata dal Sole. Non è la distanza tra la Luna e il soggetto ripreso e non modifica il punteggio dell'immagine.",
    "moon.illuminated": "Luna illuminata: {value}%", "moon.illuminatedRange": "Luna illuminata: {minimum}-{maximum}%",
    "moon.detail": "{phase}. Età lunare approssimativa: {age} giorni. Ora UTC trovata per {covered}/{total} fotogrammi Light.",
    "moon.detailMixed": "{phases}. Ora UTC trovata per {covered}/{total} fotogrammi Light.",
    "moon.unavailableTitle": "Illuminazione lunare non disponibile", "moon.unavailableDetail": "Non è stata trovata un'ora UTC di esposizione valida per questi fotogrammi Light.",
    "moon.phaseAria": "Fase lunare approssimativa: {phase}", "moon.ageValue": "{age} g",
    "moon.phase.new": "Luna nuova", "moon.phase.waxingCrescent": "Luna crescente", "moon.phase.firstQuarter": "Primo quarto", "moon.phase.waxingGibbous": "Gibbosa crescente", "moon.phase.full": "Luna piena", "moon.phase.waningGibbous": "Gibbosa calante", "moon.phase.lastQuarter": "Ultimo quarto", "moon.phase.waningCrescent": "Luna calante"
  });

  Object.assign(translations.fr, {
    "metric.utc": "UTC", "metric.moonLit": "Lune éclairée", "metric.moonPhase": "Phase lunaire", "metric.moonAge": "Âge lunaire",
    "moon.title": "Illumination de la Lune", "moon.contextOnly": "Information uniquement",
    "moon.explanation": "Le pourcentage est la partie visible du disque lunaire éclairée par le Soleil. Ce n'est pas la distance entre la Lune et la cible et cela ne modifie pas le score de l'image.",
    "moon.illuminated": "Lune éclairée : {value}%", "moon.illuminatedRange": "Lune éclairée : {minimum}-{maximum}%",
    "moon.detail": "{phase}. Âge lunaire approximatif : {age} jours. Heure UTC trouvée pour {covered}/{total} poses Light.",
    "moon.detailMixed": "{phases}. Heure UTC trouvée pour {covered}/{total} poses Light.",
    "moon.unavailableTitle": "Illumination lunaire indisponible", "moon.unavailableDetail": "Aucune heure UTC d'exposition exploitable n'a été trouvée pour ces poses Light.",
    "moon.phaseAria": "Phase lunaire approximative : {phase}", "moon.ageValue": "{age} j",
    "moon.phase.new": "Nouvelle Lune", "moon.phase.waxingCrescent": "Premier croissant", "moon.phase.firstQuarter": "Premier quartier", "moon.phase.waxingGibbous": "Gibbeuse croissante", "moon.phase.full": "Pleine Lune", "moon.phase.waningGibbous": "Gibbeuse décroissante", "moon.phase.lastQuarter": "Dernier quartier", "moon.phase.waningCrescent": "Dernier croissant"
  });

  Object.assign(translations.de, {
    "metric.utc": "UTC", "metric.moonLit": "Mond beleuchtet", "metric.moonPhase": "Mondphase", "metric.moonAge": "Mondalter",
    "moon.title": "Mondbeleuchtung", "moon.contextOnly": "Nur zur Information",
    "moon.explanation": "Der Prozentwert ist der sichtbare, von der Sonne beleuchtete Anteil der Mondscheibe. Er ist nicht der Abstand zwischen Mond und Ziel und ändert die Bildwertung nicht.",
    "moon.illuminated": "Mond beleuchtet: {value}%", "moon.illuminatedRange": "Mond beleuchtet: {minimum}-{maximum}%",
    "moon.detail": "{phase}. Ungefähres Mondalter: {age} Tage. UTC-Zeit für {covered}/{total} Light-Aufnahmen gefunden.",
    "moon.detailMixed": "{phases}. UTC-Zeit für {covered}/{total} Light-Aufnahmen gefunden.",
    "moon.unavailableTitle": "Mondbeleuchtung nicht verfügbar", "moon.unavailableDetail": "Für diese Light-Aufnahmen wurde keine brauchbare UTC-Belichtungszeit gefunden.",
    "moon.phaseAria": "Ungefähre Mondphase: {phase}", "moon.ageValue": "{age} T",
    "moon.phase.new": "Neumond", "moon.phase.waxingCrescent": "Zunehmende Sichel", "moon.phase.firstQuarter": "Erstes Viertel", "moon.phase.waxingGibbous": "Zunehmender Mond", "moon.phase.full": "Vollmond", "moon.phase.waningGibbous": "Abnehmender Mond", "moon.phase.lastQuarter": "Letztes Viertel", "moon.phase.waningCrescent": "Abnehmende Sichel"
  });

  Object.assign(translations.en, {
    "metric.moonAlt": "Moon Alt", "metric.moonSep": "Moon Sep", "metric.moonExposure": "Moon Exposure", "metric.moonImpact": "Moon Impact", "metric.sky": "Sky", "metric.site": "Site",
    "moon.title": "Moon Impact", "moon.contextOnly": "Scoring context",
    "moon.explanation": "Each observing-night card shows Moon illumination, altitude, Moon-target separation, potential exposure, the applied score impact, and the reason for that result. Detailed values and the full penalty calculation remain available in CSV and Description.md.",
    "moon.manageSites": "Manage observing sites", "moon.siteNote": "Header coordinates are used first. Detected coordinates can be given a saved name; folder assignments only fill missing locations.",
    "moon.addLocationManually": "Add location manually", "moon.siteName": "Site name", "moon.latitude": "Latitude", "moon.longitude": "Longitude", "moon.elevation": "Elevation (m)", "moon.saveSite": "Save Site",
    "moon.detectedLocations": "Detected header locations", "moon.detectedLocationNote": "Give a detected coordinate a local name. Matching header coordinates will use that name automatically.", "moon.detectedFrames": "Detected in {count} Light frame(s): {folders}", "moon.detectedSiteName": "Location name", "moon.detectedSiteNameAria": "Name detected location {coordinates}", "moon.saveDetectedSite": "Save Name", "moon.updateDetectedSite": "Update Name",
    "moon.folderSiteAria": "Observing site for {folder}", "moon.headerOrUnassigned": "Header location / unassigned", "moon.headerSite": "Header site", "moon.siteMissing": "Site needed for altitude",
    "moon.unknownSession": "Unknown UTC session", "moon.nightOf": "Night of {date} UTC", "moon.timeUnavailable": "UTC time unavailable", "moon.noMatchingContext": "No Light-frame Moon context matches the selected groups.", "moon.frames": "{count} frame(s)",
    "moon.geometry": "Moon altitude {altitude} deg, target separation {separation} deg", "moon.separationOnly": "Target separation {separation} deg; site needed for altitude", "moon.geometryUnavailable": "Target coordinates unavailable",
    "moon.exposureBadge": "Moon exposure: {label} {score}/100", "moon.exposure.unavailable": "Unavailable", "moon.exposure.none": "None", "moon.exposure.low": "Low", "moon.exposure.moderate": "Moderate", "moon.exposure.high": "High", "moon.exposure.veryHigh": "Very high",
    "moon.sky.clear": "Clear evidence", "moon.sky.moonlightLikely": "Moonlight likely", "moon.sky.moonlitHaze": "Possible moonlit haze/cloud", "moon.sky.moonlitCloud": "Moonlit cloud", "moon.sky.cloudLikely": "Cloud likely", "moon.sky.brightening": "Non-Moon brightening", "moon.sky.indeterminate": "Indeterminate",
    "moon.confidence.low": "low confidence", "moon.confidence.moderate": "moderate confidence", "moon.confidence.high": "high confidence",
    "moon.skyDetail.clear": "{confidence}: no material structure or star-loss evidence.", "moon.skyDetail.moonlightLikely": "{confidence}: smooth background lift agrees with Moon exposure {exposure}/100.", "moon.skyDetail.moonlitHaze": "{confidence}: cloud evidence occurs with plausible Moon exposure, but the Moon-explained smooth lift is limited.", "moon.skyDetail.moonlitCloud": "{confidence}: cloud residual and Moon-explained smooth lift are both present; the effects are scored separately.", "moon.skyDetail.cloudLikely": "{confidence}: structure {structure} and {stars}% star-loss signal are not explained by strong Moon exposure.", "moon.skyDetail.brightening": "{confidence}: smooth brightening is not explained by the Moon; twilight or light pollution is possible.", "moon.skyDetail.indeterminate": "{confidence}: evidence is mixed or there are too few comparable frames.",
    "moon.impactExplained": "{value}% explained Moon impact", "moon.impactApplied": "{value}% score impact", "moon.impactNone": "0%",
    "moon.impactRange": "Moon score impact: {range} (variation {variation} percentage points)",
    "moon.impactDisabled": "Moon score impact: {range} (optional penalty disabled)",
    "moon.impactUnavailable": "Moon score impact: unavailable",
    "moon.valueUnavailable": "unavailable",
    "moon.nightDetails": "{illumination} illuminated ({phase}); Moon altitude {altitude}; Moon-target separation {separation}; potential exposure {exposure}",
    "moon.reasonUnavailable": "Moon details are unavailable because the required time or geometry could not be calculated.",
    "moon.reasonBelowHorizon": "{illumination} {phase}, but it remained below the horizon (altitude {altitude}), so Moon exposure and score impact stayed at {impact}.",
    "moon.reasonDisabled": "{illumination} {phase}; the optional Moon penalty is disabled, so the displayed score impact is {impact}.",
    "moon.reasonMissingGeometry": "{illumination} {phase}, but the Moon geometry is incomplete, so the displayed score impact is {impact}.",
    "moon.reasonLowExposure": "{illumination} {phase}; altitude, separation, or filter sensitivity kept potential exposure at {exposure}, so the displayed score impact is {impact}.",
    "moon.reasonNoLift": "{illumination} {phase}; potential exposure was {exposure}, but the images did not show meaningful Moon-explained smooth background lift, so the displayed score impact is {impact}.",
    "moon.reasonApplied": "{illumination} {phase}; Moon geometry and image evidence supported an applied score impact of {impact}.",
    "moon.reasonSmall": "{illumination} {phase}; Moon exposure and image evidence were present, but the resulting impact was too small to apply beyond {impact}."
  });

  Object.assign(translations.es, {
    "metric.moonAlt": "Altitud lunar", "metric.moonSep": "Separación lunar", "metric.moonExposure": "Exposición lunar", "metric.moonImpact": "Impacto lunar", "metric.sky": "Cielo", "metric.site": "Lugar",
    "moon.title": "Contexto lunar y del cielo", "moon.contextOnly": "Contexto + penalización opcional", "moon.explanation": "Cada sesión de observación se evalúa por separado. La posible exposición lunar usa iluminación, altitud, separación del objeto y filtro. No modifica por sí sola la puntuación; la penalización opcional también requiere un aumento suave del fondo mediano.",
    "moon.manageSites": "Gestionar lugares de observación", "moon.siteNote": "Primero se usan las coordenadas de la cabecera. Las coordenadas detectadas pueden recibir un nombre guardado; las asignaciones de carpeta solo completan ubicaciones ausentes.", "moon.addLocationManually": "Añadir ubicación manualmente", "moon.siteName": "Nombre del lugar", "moon.latitude": "Latitud", "moon.longitude": "Longitud", "moon.elevation": "Elevación (m)", "moon.saveSite": "Guardar lugar", "moon.detectedLocations": "Ubicaciones detectadas en la cabecera", "moon.detectedLocationNote": "Asigne un nombre local a una coordenada detectada. Las coordenadas de cabecera coincidentes usarán ese nombre automáticamente.", "moon.detectedFrames": "Detectada en {count} toma(s) Light: {folders}", "moon.detectedSiteName": "Nombre de la ubicación", "moon.detectedSiteNameAria": "Nombrar ubicación detectada {coordinates}", "moon.saveDetectedSite": "Guardar nombre", "moon.updateDetectedSite": "Actualizar nombre", "moon.folderSiteAria": "Lugar de observación para {folder}", "moon.headerOrUnassigned": "Ubicación de cabecera / sin asignar", "moon.headerSite": "Lugar de cabecera", "moon.siteMissing": "Se necesita el lugar para la altitud", "moon.unknownSession": "Sesión UTC desconocida", "moon.timeUnavailable": "Hora UTC no disponible", "moon.noMatchingContext": "Ningún contexto lunar de tomas Light coincide con los grupos seleccionados.", "moon.frames": "{count} toma(s)",
    "moon.geometry": "Altitud lunar {altitude}°, separación del objeto {separation}°", "moon.separationOnly": "Separación del objeto {separation}°; se necesita el lugar para la altitud", "moon.geometryUnavailable": "Coordenadas del objeto no disponibles", "moon.exposureBadge": "Exposición lunar: {label} {score}/100", "moon.exposure.unavailable": "No disponible", "moon.exposure.none": "Nula", "moon.exposure.low": "Baja", "moon.exposure.moderate": "Moderada", "moon.exposure.high": "Alta", "moon.exposure.veryHigh": "Muy alta",
    "moon.sky.clear": "Evidencia de cielo despejado", "moon.sky.moonlightLikely": "Luz lunar probable", "moon.sky.moonlitHaze": "Posible bruma/nube iluminada", "moon.sky.moonlitCloud": "Nube iluminada por la Luna", "moon.sky.cloudLikely": "Nube probable", "moon.sky.brightening": "Brillo no lunar", "moon.sky.indeterminate": "Indeterminado", "moon.confidence.low": "confianza baja", "moon.confidence.moderate": "confianza moderada", "moon.confidence.high": "confianza alta",
    "moon.skyDetail.clear": "{confidence}: sin estructura ni pérdida de estrellas significativa.", "moon.skyDetail.moonlightLikely": "{confidence}: el aumento suave del fondo concuerda con una exposición lunar de {exposure}/100.", "moon.skyDetail.moonlitHaze": "{confidence}: estructura {structure} y señal de pérdida de estrellas del {stars}% con exposición lunar plausible.", "moon.skyDetail.cloudLikely": "{confidence}: estructura {structure} y señal de pérdida de estrellas del {stars}% no se explican por una fuerte exposición lunar.", "moon.skyDetail.brightening": "{confidence}: el brillo suave no lo explica la Luna; puede ser crepúsculo o contaminación lumínica.", "moon.skyDetail.indeterminate": "{confidence}: la evidencia es mixta o hay pocas tomas comparables."
  });

  Object.assign(translations.it, {
    "metric.moonAlt": "Altitudine Luna", "metric.moonSep": "Separazione Luna", "metric.moonExposure": "Esposizione lunare", "metric.moonImpact": "Impatto lunare", "metric.sky": "Cielo", "metric.site": "Sito",
    "moon.title": "Contesto Luna e cielo", "moon.contextOnly": "Contesto + penalità opzionale", "moon.explanation": "Ogni sessione osservativa viene valutata separatamente. La potenziale esposizione lunare usa illuminazione, altezza, separazione dal soggetto e filtro. Non modifica da sola il punteggio; la penalità opzionale richiede anche un aumento uniforme del fondo mediano.",
    "moon.manageSites": "Gestisci siti osservativi", "moon.siteNote": "Le coordinate dell'header hanno la priorità. Alle coordinate rilevate può essere assegnato un nome salvato; le assegnazioni alle cartelle completano solo le località mancanti.", "moon.addLocationManually": "Aggiungi località manualmente", "moon.siteName": "Nome sito", "moon.latitude": "Latitudine", "moon.longitude": "Longitudine", "moon.elevation": "Quota (m)", "moon.saveSite": "Salva sito", "moon.detectedLocations": "Località rilevate nell'header", "moon.detectedLocationNote": "Assegna un nome locale a una coordinata rilevata. Le coordinate corrispondenti nell'header useranno automaticamente quel nome.", "moon.detectedFrames": "Rilevata in {count} fotogramma/i Light: {folders}", "moon.detectedSiteName": "Nome località", "moon.detectedSiteNameAria": "Assegna un nome alla località rilevata {coordinates}", "moon.saveDetectedSite": "Salva nome", "moon.updateDetectedSite": "Aggiorna nome", "moon.folderSiteAria": "Sito osservativo per {folder}", "moon.headerOrUnassigned": "Località da header / non assegnata", "moon.headerSite": "Sito da header", "moon.siteMissing": "Sito necessario per l'altitudine", "moon.unknownSession": "Sessione UTC sconosciuta", "moon.timeUnavailable": "Ora UTC non disponibile", "moon.noMatchingContext": "Nessun contesto lunare dei Light corrisponde ai gruppi selezionati.", "moon.frames": "{count} fotogramma/i",
    "moon.geometry": "Altitudine Luna {altitude}°, separazione soggetto {separation}°", "moon.separationOnly": "Separazione soggetto {separation}°; sito necessario per l'altitudine", "moon.geometryUnavailable": "Coordinate del soggetto non disponibili", "moon.exposureBadge": "Esposizione lunare: {label} {score}/100", "moon.exposure.unavailable": "Non disponibile", "moon.exposure.none": "Nessuna", "moon.exposure.low": "Bassa", "moon.exposure.moderate": "Moderata", "moon.exposure.high": "Alta", "moon.exposure.veryHigh": "Molto alta",
    "moon.sky.clear": "Evidenza di cielo sereno", "moon.sky.moonlightLikely": "Luce lunare probabile", "moon.sky.moonlitHaze": "Possibile foschia/nuvola illuminata", "moon.sky.moonlitCloud": "Nuvola illuminata dalla Luna", "moon.sky.cloudLikely": "Nuvola probabile", "moon.sky.brightening": "Schiarimento non lunare", "moon.sky.indeterminate": "Indeterminato", "moon.confidence.low": "bassa confidenza", "moon.confidence.moderate": "confidenza moderata", "moon.confidence.high": "alta confidenza",
    "moon.skyDetail.clear": "{confidence}: nessuna struttura o perdita di stelle significativa.", "moon.skyDetail.moonlightLikely": "{confidence}: l'aumento uniforme del fondo concorda con esposizione lunare {exposure}/100.", "moon.skyDetail.moonlitHaze": "{confidence}: struttura {structure} e segnale di perdita stelle {stars}% con esposizione lunare plausibile.", "moon.skyDetail.cloudLikely": "{confidence}: struttura {structure} e segnale di perdita stelle {stars}% non sono spiegati da forte esposizione lunare.", "moon.skyDetail.brightening": "{confidence}: lo schiarimento uniforme non è spiegato dalla Luna; possibile crepuscolo o inquinamento luminoso.", "moon.skyDetail.indeterminate": "{confidence}: evidenza mista o pochi fotogrammi confrontabili."
  });

  Object.assign(translations.fr, {
    "metric.moonAlt": "Hauteur Lune", "metric.moonSep": "Séparation Lune", "metric.moonExposure": "Exposition lunaire", "metric.moonImpact": "Impact lunaire", "metric.sky": "Ciel", "metric.site": "Site",
    "moon.title": "Contexte Lune et ciel", "moon.contextOnly": "Contexte + pénalité optionnelle", "moon.explanation": "Chaque session d'observation est évaluée séparément. L'exposition lunaire potentielle utilise l'illumination, la hauteur, la séparation de la cible et le filtre. Elle ne modifie pas seule le score ; la pénalité optionnelle exige aussi une hausse uniforme du fond médian.",
    "moon.manageSites": "Gérer les sites d'observation", "moon.siteNote": "Les coordonnées de l'en-tête sont prioritaires. Les coordonnées détectées peuvent recevoir un nom enregistré ; les affectations de dossier ne complètent que les lieux manquants.", "moon.addLocationManually": "Ajouter un lieu manuellement", "moon.siteName": "Nom du site", "moon.latitude": "Latitude", "moon.longitude": "Longitude", "moon.elevation": "Altitude (m)", "moon.saveSite": "Enregistrer le site", "moon.detectedLocations": "Lieux détectés dans l'en-tête", "moon.detectedLocationNote": "Donnez un nom local à des coordonnées détectées. Les coordonnées d'en-tête correspondantes utiliseront automatiquement ce nom.", "moon.detectedFrames": "Détecté dans {count} pose(s) Light : {folders}", "moon.detectedSiteName": "Nom du lieu", "moon.detectedSiteNameAria": "Nommer le lieu détecté {coordinates}", "moon.saveDetectedSite": "Enregistrer le nom", "moon.updateDetectedSite": "Modifier le nom", "moon.folderSiteAria": "Site d'observation pour {folder}", "moon.headerOrUnassigned": "Lieu de l'en-tête / non attribué", "moon.headerSite": "Site de l'en-tête", "moon.siteMissing": "Site requis pour la hauteur", "moon.unknownSession": "Session UTC inconnue", "moon.timeUnavailable": "Heure UTC indisponible", "moon.noMatchingContext": "Aucun contexte lunaire de poses Light ne correspond aux groupes sélectionnés.", "moon.frames": "{count} pose(s)",
    "moon.geometry": "Hauteur Lune {altitude}°, séparation cible {separation}°", "moon.separationOnly": "Séparation cible {separation}° ; site requis pour la hauteur", "moon.geometryUnavailable": "Coordonnées de cible indisponibles", "moon.exposureBadge": "Exposition lunaire : {label} {score}/100", "moon.exposure.unavailable": "Indisponible", "moon.exposure.none": "Nulle", "moon.exposure.low": "Faible", "moon.exposure.moderate": "Modérée", "moon.exposure.high": "Élevée", "moon.exposure.veryHigh": "Très élevée",
    "moon.sky.clear": "Indices de ciel clair", "moon.sky.moonlightLikely": "Clair de Lune probable", "moon.sky.moonlitHaze": "Brume/nuage éclairé possible", "moon.sky.moonlitCloud": "Nuage éclairé par la Lune", "moon.sky.cloudLikely": "Nuage probable", "moon.sky.brightening": "Éclaircissement non lunaire", "moon.sky.indeterminate": "Indéterminé", "moon.confidence.low": "confiance faible", "moon.confidence.moderate": "confiance modérée", "moon.confidence.high": "confiance élevée",
    "moon.skyDetail.clear": "{confidence} : aucun indice notable de structure ou de perte d'étoiles.", "moon.skyDetail.moonlightLikely": "{confidence} : la hausse uniforme du fond concorde avec une exposition lunaire de {exposure}/100.", "moon.skyDetail.moonlitHaze": "{confidence} : structure {structure} et signal de perte d'étoiles de {stars}% avec exposition lunaire plausible.", "moon.skyDetail.cloudLikely": "{confidence} : structure {structure} et signal de perte d'étoiles de {stars}% non expliqués par une forte exposition lunaire.", "moon.skyDetail.brightening": "{confidence} : l'éclaircissement uniforme n'est pas expliqué par la Lune ; crépuscule ou pollution lumineuse possible.", "moon.skyDetail.indeterminate": "{confidence} : indices mixtes ou trop peu de poses comparables."
  });

  Object.assign(translations.de, {
    "metric.moonAlt": "Mondhöhe", "metric.moonSep": "Mondabstand", "metric.moonExposure": "Mondeinfluss", "metric.moonImpact": "Mondeinfluss", "metric.sky": "Himmel", "metric.site": "Standort",
    "moon.title": "Mond- und Himmelskontext", "moon.contextOnly": "Kontext + optionaler Abzug", "moon.explanation": "Jede Beobachtungssitzung wird getrennt bewertet. Der mögliche Mondeinfluss nutzt Beleuchtung, Höhe, Zielabstand und Filter. Er ändert die Wertung nicht allein; der optionale Abzug erfordert zusätzlich eine gleichmäßige Anhebung des medianen Hintergrunds.",
    "moon.manageSites": "Beobachtungsorte verwalten", "moon.siteNote": "Koordinaten aus dem Header haben Vorrang. Erkannte Koordinaten können einen gespeicherten Namen erhalten; Ordnerzuweisungen ergänzen nur fehlende Orte.", "moon.addLocationManually": "Ort manuell hinzufügen", "moon.siteName": "Ortsname", "moon.latitude": "Breitengrad", "moon.longitude": "Längengrad", "moon.elevation": "Höhe (m)", "moon.saveSite": "Ort speichern", "moon.detectedLocations": "Im Header erkannte Orte", "moon.detectedLocationNote": "Geben Sie erkannten Koordinaten einen lokalen Namen. Übereinstimmende Header-Koordinaten verwenden diesen Namen automatisch.", "moon.detectedFrames": "In {count} Light-Aufnahme(n) erkannt: {folders}", "moon.detectedSiteName": "Ortsname", "moon.detectedSiteNameAria": "Erkannten Ort {coordinates} benennen", "moon.saveDetectedSite": "Namen speichern", "moon.updateDetectedSite": "Namen ändern", "moon.folderSiteAria": "Beobachtungsort für {folder}", "moon.headerOrUnassigned": "Header-Ort / nicht zugewiesen", "moon.headerSite": "Header-Ort", "moon.siteMissing": "Ort für Höhenberechnung nötig", "moon.unknownSession": "Unbekannte UTC-Sitzung", "moon.timeUnavailable": "UTC-Zeit nicht verfügbar", "moon.noMatchingContext": "Kein Mondkontext der Light-Aufnahmen passt zu den gewählten Gruppen.", "moon.frames": "{count} Aufnahme(n)",
    "moon.geometry": "Mondhöhe {altitude}°, Zielabstand {separation}°", "moon.separationOnly": "Zielabstand {separation}°; Ort für Höhenberechnung nötig", "moon.geometryUnavailable": "Zielkoordinaten nicht verfügbar", "moon.exposureBadge": "Mondeinfluss: {label} {score}/100", "moon.exposure.unavailable": "Nicht verfügbar", "moon.exposure.none": "Keiner", "moon.exposure.low": "Niedrig", "moon.exposure.moderate": "Mittel", "moon.exposure.high": "Hoch", "moon.exposure.veryHigh": "Sehr hoch",
    "moon.sky.clear": "Hinweise auf klaren Himmel", "moon.sky.moonlightLikely": "Mondlicht wahrscheinlich", "moon.sky.moonlitHaze": "Möglicher mondbeleuchteter Dunst/Wolke", "moon.sky.moonlitCloud": "Mondbeschienene Wolke", "moon.sky.cloudLikely": "Wolke wahrscheinlich", "moon.sky.brightening": "Nicht-mondbedingte Aufhellung", "moon.sky.indeterminate": "Unbestimmt", "moon.confidence.low": "geringe Sicherheit", "moon.confidence.moderate": "mittlere Sicherheit", "moon.confidence.high": "hohe Sicherheit",
    "moon.skyDetail.clear": "{confidence}: keine deutlichen Struktur- oder Sternverlustmerkmale.", "moon.skyDetail.moonlightLikely": "{confidence}: gleichmäßige Hintergrundaufhellung passt zu Mondeinfluss {exposure}/100.", "moon.skyDetail.moonlitHaze": "{confidence}: Struktur {structure} und {stars}% Sternverlustsignal bei plausiblem Mondeinfluss.", "moon.skyDetail.cloudLikely": "{confidence}: Struktur {structure} und {stars}% Sternverlustsignal werden nicht durch starken Mondeinfluss erklärt.", "moon.skyDetail.brightening": "{confidence}: gleichmäßige Aufhellung wird nicht durch den Mond erklärt; Dämmerung oder Lichtverschmutzung möglich.", "moon.skyDetail.indeterminate": "{confidence}: gemischte Hinweise oder zu wenige vergleichbare Aufnahmen."
  });

  Object.assign(translations.en, {
    "actions.maximumMoonPenalty": "Maximum Moon Penalty",
    "help.moonPenaltyLabel": "Moon impact penalty calculation",
    "help.moonPenalty": "Enter the maximum score reduction from 0% to 100%; 0% disables it. The actual reduction uses plausible Moon exposure and the Moon-explained smooth background lift after discounting transient cloud residuals. Moon and cloud impacts may both apply, with a combined sky-penalty cap to prevent excessive double counting.",
    "summary.moonPenaltyMaximum": "{value}% maximum",
    "score.moonImpact": "Moon Impact"
  });

  Object.assign(translations.es, {
    "actions.maximumMoonPenalty": "Penalización lunar máxima",
    "help.moonPenaltyLabel": "Cálculo de penalización por impacto lunar",
    "help.moonPenalty": "Introduzca la reducción máxima de la puntuación entre 0% y 100%; 0% la desactiva. La reducción real es este máximo multiplicado por la exposición lunar plausible y la evidencia de un aumento suave del fondo mediano. Las tomas que ya reciben una penalización por nubes nunca se penalizan dos veces.",
    "summary.moonPenaltyMaximum": "máximo {value}%",
    "score.moonImpact": "Impacto lunar"
  });

  Object.assign(translations.it, {
    "actions.maximumMoonPenalty": "Penalità lunare massima",
    "help.moonPenaltyLabel": "Calcolo della penalità per impatto lunare",
    "help.moonPenalty": "Inserisci la riduzione massima del punteggio da 0% a 100%; 0% la disattiva. La riduzione effettiva è questo massimo moltiplicato per l'esposizione lunare plausibile e per l'evidenza di un aumento uniforme del fondo mediano. I fotogrammi già penalizzati per le nuvole non vengono mai penalizzati due volte.",
    "summary.moonPenaltyMaximum": "massimo {value}%",
    "score.moonImpact": "Impatto lunare"
  });

  Object.assign(translations.fr, {
    "actions.maximumMoonPenalty": "Pénalité lunaire maximale",
    "help.moonPenaltyLabel": "Calcul de la pénalité d’impact lunaire",
    "help.moonPenalty": "Saisissez la réduction maximale du score entre 0 % et 100 % ; 0 % la désactive. La réduction réelle est ce maximum multiplié par l’exposition lunaire plausible et par l’indice d’une hausse uniforme du fond médian. Une pose déjà pénalisée pour les nuages n’est jamais pénalisée une seconde fois.",
    "summary.moonPenaltyMaximum": "maximum {value}%",
    "score.moonImpact": "Impact lunaire"
  });

  Object.assign(translations.de, {
    "actions.maximumMoonPenalty": "Maximaler Mondabzug",
    "help.moonPenaltyLabel": "Berechnung des Mondabzugs",
    "help.moonPenalty": "Geben Sie die maximale Wertungsminderung von 0 % bis 100 % ein; 0 % deaktiviert sie. Der tatsächliche Abzug ist dieses Maximum multipliziert mit dem plausiblen Mondeinfluss und dem Nachweis einer gleichmäßigen Anhebung des medianen Hintergrunds. Aufnahmen mit Wolkenabzug werden nie doppelt abgewertet.",
    "summary.moonPenaltyMaximum": "maximal {value}%",
    "score.moonImpact": "Mondeinfluss"
  });

  const phraseKeys = {
    Sharpness: "controls.sharpness", Noise: "metric.noise", Roundness: "controls.roundness",
    "Star Count": "controls.starCount", Clipping: "metric.clip", Elongation: "score.elongation",
    Tracking: "metric.tracking", Halo: "score.halo", Clouds: "score.clouds", "Moon Impact": "score.moonImpact", Calibration: "score.calibration",
    "Flat Level": "score.flatLevel", "Bias Level": "score.biasLevel", "Dark Level": "score.darkLevel",
    "Dark Flat Level": "score.darkFlatLevel", Saturation: "score.saturation", Uniformity: "score.uniformity",
    "Hot Pixels": "score.hotPixels", "Bright Pixels": "score.brightPixels", Spread: "score.spread",
    Outliers: "score.outliers", Gradient: "metric.gradient",
    "Flat too dark": "warning.flatTooDark", "Flat below histogram target": "warning.flatBelowTarget",
    "Flat too bright": "warning.flatTooBright", "Flat above histogram target": "warning.flatAboveTarget",
    "Flat saturated": "warning.flatSaturated", "Flat near saturation": "warning.flatNearSaturation",
    "Flat very uneven": "warning.flatUneven", "Flat strong gradient": "warning.flatGradient",
    "Flat pixel outliers": "warning.flatPixelOutliers", "Bias signal high": "warning.biasHigh",
    "Bias saturated pixels": "warning.biasSaturated", "Bias uneven": "warning.biasUneven",
    "Many hot-pixel outliers": "warning.manyHotOutliers", "Hot-pixel outliers": "warning.hotOutliers",
    "Many dark-pixel outliers": "warning.manyDarkOutliers", "Dark-pixel outliers": "warning.darkOutliers",
    "Light leak/strong gradient": "warning.lightLeak", "Possible light leak/gradient": "warning.possibleLightLeak",
    "Dark exposure mismatch with lights": "warning.darkExposureMismatch",
    "Dark exposure differs from lights": "warning.darkExposureDiffers",
    "Temperature mismatch with lights": "warning.temperatureMismatch",
    "Temperature differs from lights": "warning.temperatureDiffers",
    "Flat artefact mismatch from set": "warning.flatSetMismatch", "Median outlier from set": "warning.medianOutlier",
    "Low Confidence": "tracking.lowConfidence", "Repeat Drift": "tracking.repeatDrift",
    "Tracking + Repeat": "tracking.trackingRepeat", "Tracking Error": "tracking.error",
    "Possible Repeat Drift": "tracking.possibleRepeat", "Possible Mixed Drift": "tracking.possibleMixed",
    "Possible Drift": "tracking.possibleDrift", "Likely Halo": "halo.likely", "Possible Halo": "halo.possible",
    "Likely Cloud": "cloud.likely", "Possible Cloud": "cloud.possible",
    "No score penalties applied.": "score.noPenalties", Keep: "common.keep", Review: "common.review",
    Discard: "common.discard", Issue: "common.issue", OK: "common.ok", Unknown: "common.unknown"
  };

  const phraseFallbacks = {
    "score.elongation": "Elongation", "score.halo": "Halo", "score.clouds": "Clouds", "score.calibration": "Calibration"
  };

  let currentLanguage = "en";

  function interpolate(value, variables) {
    return String(value).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(variables || {}, key) ? String(variables[key]) : match
    );
  }

  function t(key, variables = {}) {
    const selected = translations[currentLanguage] || en;
    const value = selected[key] ?? en[key] ?? phraseFallbacks[key] ?? key;
    return interpolate(value, variables);
  }

  function translatePhrase(value) {
    const text = String(value ?? "");
    const key = phraseKeys[text];
    return key ? t(key) : text;
  }

  function applyStaticTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    root.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      element.setAttribute("alt", t(element.dataset.i18nAlt));
    });
    root.querySelectorAll("[data-i18n-help]").forEach((element) => {
      element.dataset.help = t(element.dataset.i18nHelp);
    });
  }

  function setLanguage(language, options = {}) {
    const next = supportedLanguages.includes(language) ? language : "en";
    currentLanguage = next;
    document.documentElement.lang = documentLanguages[next];
    const select = document.getElementById("languageSelect");
    if (select) {
      select.value = next;
    }
    applyStaticTranslations();
    try {
      localStorage.setItem(storageKey, next);
    } catch (error) {
      // Local storage can be unavailable in locked-down browser contexts.
    }
    if (!options.silent) {
      window.dispatchEvent(new CustomEvent("astro-language-change", { detail: { language: next } }));
    }
  }

  function storedLanguage() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (supportedLanguages.includes(saved)) {
        return saved;
      }
    } catch (error) {
      // Use English when storage is unavailable.
    }
    return "en";
  }

  window.AstroI18n = {
    t,
    translatePhrase,
    setLanguage,
    applyStaticTranslations,
    get language() {
      return currentLanguage;
    },
    supportedLanguages: supportedLanguages.slice()
  };

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
    languageSelect.addEventListener("change", () => setLanguage(languageSelect.value));
  }
  setLanguage(storedLanguage(), { silent: true });
})();
