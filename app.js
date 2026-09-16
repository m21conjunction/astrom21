const folderInput = document.getElementById("folderInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const stopAnalyzeBtn = document.getElementById("stopAnalyzeBtn");
const exportBtn = document.getElementById("exportBtn");
const csvSeparatorSelect = document.getElementById("csvSeparator");
const resetDefaultsBtn = document.getElementById("resetDefaultsBtn");
const haloPenaltyCheckbox = document.getElementById("haloPenaltyCheckbox");
const chooseOutputBtn = document.getElementById("chooseOutputBtn");
const selectKeepBtn = document.getElementById("selectKeepBtn");
const clearSelectionBtn = document.getElementById("clearSelectionBtn");
const sendSelectedBtn = document.getElementById("sendSelectedBtn");
const outputLabel = document.getElementById("outputLabel");
const selectAllCheckbox = document.getElementById("selectAllCheckbox");
const copyByFilterCheckbox = document.getElementById("copyByFilterCheckbox");
const copyByTypeCheckbox = document.getElementById("copyByTypeCheckbox");
const summaryEl = document.getElementById("summary");
const resultsBody = document.getElementById("resultsBody");
const folderFileCount = document.getElementById("folderFileCount");
const clearFoldersBtn = document.getElementById("clearFoldersBtn");
const selectedFolderList = document.getElementById("selectedFolderList");
const filterPanel = document.getElementById("filterPanel");
const frameTypeTabs = document.getElementById("frameTypeTabs");
const filterTabs = document.getElementById("filterTabs");
const objectShotGroup = document.getElementById("objectShotGroup");
const objectShotTabs = document.getElementById("objectShotTabs");
const recommendationTabs = document.getElementById("recommendationTabs");
const filterThresholds = document.getElementById("filterThresholds");
const filterWarning = document.getElementById("filterWarning");
const calibrationReport = document.getElementById("calibrationReport");

const sharpnessWeight = document.getElementById("sharpnessWeight");
const noiseWeight = document.getElementById("noiseWeight");
const starsWeight = document.getElementById("starsWeight");
const starCountWeight = document.getElementById("starCountWeight");
const clipWeight = document.getElementById("clipWeight");
const previewStretch = document.getElementById("previewStretch");
const sharpnessModeHybrid = document.getElementById("sharpnessModeHybrid");
const sharpnessModeFwhm = document.getElementById("sharpnessModeFwhm");
const analysisModeStandard = document.getElementById("analysisModeStandard");
const analysisModeExpert = document.getElementById("analysisModeExpert");

const sharpnessWeightValue = document.getElementById("sharpnessWeightValue");
const noiseWeightValue = document.getElementById("noiseWeightValue");
const starsWeightValue = document.getElementById("starsWeightValue");
const starCountWeightValue = document.getElementById("starCountWeightValue");
const clipWeightValue = document.getElementById("clipWeightValue");
const previewStretchValue = document.getElementById("previewStretchValue");

const zoomOverlay = document.getElementById("zoomOverlay");
const zoomTitle = document.getElementById("zoomTitle");
const zoomStatus = document.getElementById("zoomStatus");
const zoomImage = document.getElementById("zoomImage");
const zoomMetrics = document.getElementById("zoomMetrics");
const zoomRange = document.getElementById("zoomRange");
const zoomValue = document.getElementById("zoomValue");
const zoomStarOverlayBtn = document.getElementById("zoomStarOverlayBtn");
const zoomMagnifierBtn = document.getElementById("zoomMagnifierBtn");
const zoomMagnifierPower = document.getElementById("zoomMagnifierPower");
const zoomStarOverlay = document.getElementById("zoomStarOverlay");
const zoomLens = document.getElementById("zoomLens");
const zoomCloseBtn = document.getElementById("zoomCloseBtn");
const zoomStage = zoomImage ? zoomImage.closest(".zoom-stage") : null;

const state = {
  results: [],
  selectedKeys: new Set(),
  selectedFiles: [],
  selectedFileKeys: new Set(),
  selectedFolders: [],
  nextFolderSelectionId: 1,
  analysisSummaryText: "",
  lastAnalysisRunNote: "",
  outputDirectoryHandle: null,
  outputDirectoryPath: "",
  outputDirectoryName: "",
  lastTotalFiles: 0,
  lastUnsupportedFiles: 0,
  activeFrameType: "all",
  activeFilter: "all",
  activeObjectShot: "all",
  activeRecommendation: "all",
  filterThresholds: {},
  zoomedKey: null,
  zoomRequestId: 0,
  magnifierActive: false,
  starOverlayActive: false,
  selectedOverlayStarId: null,
  previewRefreshTimer: null,
  previewRefreshRunId: 0,
  scoreRefreshTimer: null,
  analysisProgress: null,
  analysisRun: null
};

const settingsStorageKey = "astronomySubAnalyser.settings.v1";
const appVersion = "0.3.7";
const defaultCsvSeparatorKey = "comma";
const defaultPreviewStretch = 25;
const defaultSharpnessMode = "hybrid";
const defaultAnalysisMode = "standard";
const csvSeparators = {
  comma: ",",
  semicolon: ";",
  tab: "\t",
  pipe: "|"
};
const allFiltersKey = "all";
const allFrameTypesKey = "all";
const allObjectShotsKey = "all";
const allRecommendationsKey = "all";
const recommendationGroups = ["Keep", "Review", "Discard"];
const unknownFilterName = "Unknown";
const unknownFrameTypeName = "Unknown";
const unknownCameraModelName = "Unknown";
const unknownTargetName = "Unknown";
const unknownObjectShotKey = "unknown-object";
const unknownObjectShotLabel = "Unknown Object";
const defaultKeeperThreshold = 70;
const defaultFilterThresholds = {
  L: 75,
  R: 70,
  G: 70,
  B: 70,
  Ha: 70,
  OIII: 65,
  SII: 65,
  Clear: 70,
  Unknown: 70
};
const filterSortOrder = ["L", "R", "G", "B", "Ha", "OIII", "SII", "Clear", "Unknown"];
const frameTypeSortOrder = ["Light", "Flat", "Dark", "Bias", "Dark Flat", "Unknown"];
const calibrationFrameTypes = new Set(["Flat", "Dark", "Bias", "Dark Flat"]);
const filterHeaderKeys = [
  "FILTER",
  "FILTER1",
  "FILTER2",
  "FILTER3",
  "FILTNAME",
  "FILTNUM",
  "FILTERID",
  "INSFLNAM",
  "OPTIC",
  "FILT"
];
const frameTypeHeaderKeys = [
  "IMAGETYP",
  "IMAGETYPE",
  "FRAME",
  "FRAMETYP",
  "FRAMETYPE",
  "OBSTYPE",
  "EXPTYPE",
  "PICTYPE"
];
const exposureHeaderKeys = [
  "EXPTIME",
  "EXPOSURE",
  "EXPOS",
  "EXPT",
  "EXPTIME1",
  "DARKTIME",
  "LIVETIME",
  "ONTIME",
  "TELAPSE"
];
const temperatureHeaderKeys = [
  "CCD-TEMP",
  "CCD_TEMP",
  "CCDTEMP",
  "SET-TEMP",
  "SET_TEMP",
  "SETTEMP",
  "CAM-TEMP",
  "CAMTEMP",
  "SENSOR-T",
  "SENSORT",
  "TEMP",
  "TEMPERAT"
];
const cameraModelHeaderKeys = [
  "INSTRUME",
  "CAMERA",
  "CAMMODEL",
  "CCDNAME",
  "DETECTOR",
  "SENSOR",
  "CCD",
  "MODEL",
  "CAMNAME",
  "IMAGER"
];
const targetNameHeaderKeys = ["OBJECT", "OBJNAME", "TARGET", "TARGNAME", "OBJ-NAME"];
const coordinateHeaderPairs = [
  { raKey: "OBJCTRA", decKey: "OBJCTDEC", raMode: "hours" },
  { raKey: "OBJRA", decKey: "OBJDEC", raMode: "hours" },
  { raKey: "RA_OBJ", decKey: "DEC_OBJ", raMode: "auto" },
  { raKey: "RA-OBJ", decKey: "DEC-OBJ", raMode: "auto" },
  { raKey: "TELRA", decKey: "TELDEC", raMode: "hours" },
  { raKey: "RA", decKey: "DEC", raMode: "auto" },
  { raKey: "CRVAL1", decKey: "CRVAL2", raMode: "degrees" }
];
const focalLengthHeaderKeys = ["FOCALLEN", "FOC_LEN", "FOCLEN", "FOCAL", "EFL"];
const pixelSizeHeaderKeyPairs = [
  ["XPIXSZ", "YPIXSZ"],
  ["XPIXSIZE", "YPIXSIZE"],
  ["PIXSIZE1", "PIXSIZE2"],
  ["CCDXPIXE", "CCDYPIXE"]
];
const pixelSizeHeaderKeys = ["PIXSIZE", "PIX_SIZE", "PIXSZ"];
const binningHeaderKeyPairs = [
  ["XBINNING", "YBINNING"],
  ["CCDBINX", "CCDBINY"],
  ["XBIN", "YBIN"]
];
const binningHeaderKeys = ["BINNING", "CCDSUM"];
const objectShotFallbackToleranceDeg = 0.25;
const objectShotMinToleranceDeg = 0.035;
const objectShotMaxToleranceDeg = 0.9;
const objectShotFovToleranceFraction = 0.18;
const lowGlowBackIlluminatedCameraPatterns = [
  /IMX571/i,
  /ASI2600/i,
  /QHY268/i,
  /IMX455/i,
  /ASI6200/i,
  /QHY600/i,
  /IMX533/i,
  /ASI533/i,
  /QHY533/i
];
const exposureMatchToleranceFraction = 0.02;
const exposureMatchToleranceSeconds = 1;
const exposureSevereMismatchFraction = 0.1;
const exposureSevereMismatchSeconds = 5;
const temperatureMatchToleranceC = 2;
const temperatureSevereMismatchC = 5;
const oldDefaultScoreSettings = [
  {
    sharpnessWeight: 35,
    noiseWeight: 25,
    starsWeight: 25,
    clipWeight: 15
  },
  {
    sharpnessWeight: 40,
    noiseWeight: 25,
    starsWeight: 20,
    clipWeight: 15
  }
];
const defaultScoreSettings = {
  sharpnessWeight: 40,
  noiseWeight: 15,
  starsWeight: 20,
  starCountWeight: 15,
  clipWeight: 10
};

const imageExtensions = new Set(["jpg", "jpeg", "png", "bmp", "gif", "webp", "tif", "tiff"]);
const fitsExtensions = new Set(["fit", "fits", "fts"]);
const xisfExtensions = new Set(["xisf"]);
const xisfMaxHeaderBytes = 32 * 1024 * 1024;
const previewMaxDimension = 1400;
const bitmapAnalysisMaxDimension = 1400;
const standardDistributionMaxSamples = 250000;
const standardCloudTileSamples = 480;
const standardLaplacianSampleTarget = 900000;
const standardNoiseSampleTarget = 900000;
const standardElongationSampleTarget = 700000;
const standardTrackingTrailStarLimit = 1400;
const standardTrackingTrailWindowRadius = 10;
const standardRepeatDriftMaxPairs = 80000;
const standardRepeatDriftBrightStarLimit = 1500;
const standardStarOverlayLimit = 2500;
const trackingCentralFieldRadius = 0.72;
const trackingFallbackCentralFieldRadius = 0.88;
const trackingMinimumCentralStars = 12;
const trackingMediumPeakPercentile = 0.5;
const trackingMinimumGuideStarHfrPx = 0.85;
const trackingGuideStarHfrPercentile = 0.2;
const cornerReferenceAxisFraction = 0.55;
const cornerReferenceRoundnessWarningLimit = 0.74;
const cornerReferenceFwhmRoundnessWarningLimit = 0.72;
const cornerReferenceAxisRatioWarningLimit = 1.35;
const expertAnalysisMaxDimension = 7000;
const expertDistributionMaxSamples = 1000000;
const expertCloudTileSamples = 1600;
const expertLaplacianSampleTarget = 2600000;
const expertNoiseSampleTarget = 2600000;
const expertElongationSampleTarget = 2000000;
const expertTrackingTrailStarLimit = 4200;
const expertTrackingTrailWindowRadius = 14;
const expertRepeatDriftMaxPairs = 240000;
const expertRepeatDriftBrightStarLimit = 5000;
const expertStarOverlayLimit = 6000;
const analysisModeConfigs = {
  standard: {
    key: "standard",
    label: "Standard",
    bitmapAnalysisMaxDimension,
    fitsFullResolution: true,
    distributionMaxSamples: standardDistributionMaxSamples,
    histogramMaxSamples: standardDistributionMaxSamples,
    cloudTileSamples: standardCloudTileSamples,
    laplacianSampleTarget: standardLaplacianSampleTarget,
    noiseSampleTarget: standardNoiseSampleTarget,
    elongationSampleTarget: standardElongationSampleTarget,
    trackingTrailStarLimit: standardTrackingTrailStarLimit,
    trackingTrailWindowRadius: standardTrackingTrailWindowRadius,
    repeatDriftMaxPairs: standardRepeatDriftMaxPairs,
    repeatDriftBrightStarLimit: standardRepeatDriftBrightStarLimit,
    starOverlayLimit: standardStarOverlayLimit
  },
  expert: {
    key: "expert",
    label: "Expert",
    bitmapAnalysisMaxDimension: expertAnalysisMaxDimension,
    fitsFullResolution: true,
    distributionMaxSamples: expertDistributionMaxSamples,
    histogramMaxSamples: expertDistributionMaxSamples,
    cloudTileSamples: expertCloudTileSamples,
    laplacianSampleTarget: expertLaplacianSampleTarget,
    noiseSampleTarget: expertNoiseSampleTarget,
    elongationSampleTarget: expertElongationSampleTarget,
    trackingTrailStarLimit: expertTrackingTrailStarLimit,
    trackingTrailWindowRadius: expertTrackingTrailWindowRadius,
    repeatDriftMaxPairs: expertRepeatDriftMaxPairs,
    repeatDriftBrightStarLimit: expertRepeatDriftBrightStarLimit,
    starOverlayLimit: expertStarOverlayLimit
  }
};
const bytesPerGib = 1024 * 1024 * 1024;
const fallbackSystemMemoryGb = 8;
const workerMemoryProfiles = {
  standard: {
    baseGb: 0.45,
    fileSizeMultiplier: 5,
    reserveGb: 2
  },
  expert: {
    baseGb: 1.25,
    fileSizeMultiplier: 12,
    reserveGb: 4
  }
};
const zoomDetailMaxDimension = 6000;
const zoomLensSize = 220;
const defaultZoomLensMagnification = 4;
const bitmapClippingThreshold = 250;
const bitmapNearSaturationThreshold = 245;
const hardClippingFullPenaltyPercent = 0.01;
const nearSaturationFullPenaltyPercent = 0.1;
const nearSaturationPressureWeight = 0.8;
const cloudRelativePeerMinimum = 3;
const cloudPossibleBackgroundRangePercent = 4.3;
const cloudPossibleStructureScore = 0.03;
const cloudLikelyBackgroundRangePercent = 6.5;
const cloudLikelyStructureScore = 0.16;
const cloudSupportStarLossScore = 0.24;
const cloudStrongStarLossScore = 0.36;
const cloudMeanLiftMinimumStarLossScore = 0.18;
const cloudSupportMeanLiftScore = 0.55;
const cloudStrongMeanLiftScore = 0.55;
const cloudExtremeBackgroundRangePercent = 10.5;
const cloudExtremeStructureScore = 0.43;
const cloudExtremeSingleFrameBackgroundRangePercent = 14.5;
const cloudExtremeSingleFrameStructureScore = 0.55;
const cloudUnconfirmedStructureScoreCap = 0.34;
const flatArtifactGroupMinimum = 3;
const selectedFileMetadata = new WeakMap();
let analysisWorkerObjectUrl = "";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    };
    return map[char];
  });
}

function fileExtension(fileName) {
  const parts = fileName.toLowerCase().split(".");
  if (parts.length < 2) {
    return "";
  }
  return parts.pop();
}

function isFitsFile(file) {
  return fitsExtensions.has(fileExtension(file.name));
}

function isXisfFile(file) {
  return xisfExtensions.has(fileExtension(file.name));
}

function headerSourcePrefix(header) {
  return header && header.__SOURCE_FORMAT === "XISF" ? "XISF metadata" : "FITS";
}

function headerKeywordSource(header, key) {
  return `${headerSourcePrefix(header)} ${key}`;
}

function normalizePathText(path) {
  return String(path || "")
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\.\//, "");
}

function rawRelativeFilePath(file) {
  return normalizePathText(file.webkitRelativePath || file.name || "");
}

function normalizedFilePath(file) {
  const metadata = selectedFileMetadata.get(file);
  return normalizePathText((metadata && metadata.relativePath) || rawRelativeFilePath(file));
}

function displayFilePath(file) {
  const metadata = selectedFileMetadata.get(file);
  return normalizePathText((metadata && metadata.displayPath) || rawRelativeFilePath(file));
}

function fileIdentityKey(file) {
  const metadata = selectedFileMetadata.get(file);
  if (metadata && metadata.identityKey) {
    return metadata.identityKey;
  }
  return `${normalizedFilePath(file).toLowerCase()}|${file.size || 0}|${file.lastModified || 0}`;
}

function isSystemMetadataFile(file) {
  const pathParts = normalizedFilePath(file).split("/").filter(Boolean);
  return pathParts.some(
    (part) =>
      part === ".DS_Store" ||
      part === "Thumbs.db" ||
      part === "__MACOSX" ||
      part.startsWith("._")
  );
}

function isSupportedImage(file) {
  if (isSystemMetadataFile(file)) {
    return false;
  }
  if (isFitsFile(file)) {
    return true;
  }
  if (isXisfFile(file)) {
    return true;
  }
  if (file.type && file.type.startsWith("image/")) {
    return true;
  }
  return imageExtensions.has(fileExtension(file.name));
}

function uniqueFiles(files) {
  const seen = new Set();
  const unique = [];
  let duplicates = 0;

  for (const file of files) {
    const key = fileIdentityKey(file);
    if (seen.has(key)) {
      duplicates += 1;
      continue;
    }
    seen.add(key);
    unique.push(file);
  }

  return { unique, duplicates };
}

function selectedFileStats(files) {
  const folderFiles = files.filter((file) => !isSystemMetadataFile(file));
  const metadataCount = files.length - folderFiles.length;
  const supportedCandidates = folderFiles.filter(isSupportedImage);
  const unsupportedCount = folderFiles.length - supportedCandidates.length;
  const { unique: supported, duplicates: duplicateCount } = uniqueFiles(supportedCandidates);

  return {
    supported,
    frameCount: supported.length,
    metadataCount,
    unsupportedCount,
    duplicateCount
  };
}

function ignoredFileCount(stats) {
  return stats.metadataCount + stats.unsupportedCount + stats.duplicateCount;
}

function frameCountText(count) {
  return count === 1 ? "1 astronomy frame" : `${count} astronomy frames`;
}

function rootPathForSelectedFile(file) {
  const parts = rawRelativeFilePath(file).split("/").filter(Boolean);
  return parts.length > 1 ? parts[0] : "Selected folder";
}

function uniqueFolderDisplayPath(rootLabel) {
  const existingCount = state.selectedFolders.filter((folder) => folder.rootPath === rootLabel).length;
  return existingCount === 0 ? rootLabel : `${rootLabel} (${existingCount + 1})`;
}

function selectedDisplayPathForFile(file, displayRoot) {
  const parts = rawRelativeFilePath(file).split("/").filter(Boolean);
  if (parts.length === 0) {
    return displayRoot;
  }
  if (parts.length === 1) {
    return `${displayRoot}/${parts[0]}`;
  }
  parts[0] = displayRoot;
  return parts.join("/");
}

function addSelectedFolderFiles(fileList) {
  const incomingFiles = Array.from(fileList || []);
  if (incomingFiles.length === 0) {
    return { addedCount: 0, duplicateCount: 0 };
  }

  const incomingGroups = new Map();
  for (const file of incomingFiles) {
    const rootPath = rootPathForSelectedFile(file);
    if (!incomingGroups.has(rootPath)) {
      incomingGroups.set(rootPath, []);
    }
    incomingGroups.get(rootPath).push(file);
  }

  let totalAdded = 0;
  let totalDuplicates = 0;

  for (const [rootPath, groupFiles] of incomingGroups) {
    const displayPath = uniqueFolderDisplayPath(rootPath);
    const selectionId = state.nextFolderSelectionId;
    state.nextFolderSelectionId += 1;
    const addedFiles = [];
    let duplicateCount = 0;

    for (const file of groupFiles) {
      const relativePath = rawRelativeFilePath(file);
      const identityKey = `${relativePath.toLowerCase()}|${file.size || 0}|${file.lastModified || 0}`;
      if (state.selectedFileKeys.has(identityKey)) {
        duplicateCount += 1;
        continue;
      }

      selectedFileMetadata.set(file, {
        selectionId,
        rootPath,
        displayPath: selectedDisplayPathForFile(file, displayPath),
        relativePath,
        identityKey
      });
      state.selectedFileKeys.add(identityKey);
      state.selectedFiles.push(file);
      addedFiles.push(file);
    }

    totalAdded += addedFiles.length;
    totalDuplicates += duplicateCount;

    if (addedFiles.length > 0) {
      const stats = selectedFileStats(addedFiles);
      state.selectedFolders.push({
        id: selectionId,
        rootPath,
        displayPath,
        frameCount: stats.frameCount,
        ignoredCount: ignoredFileCount(stats) + duplicateCount
      });
    }
  }

  return {
    addedCount: totalAdded,
    duplicateCount: totalDuplicates
  };
}

function renderSelectedFolderList() {
  if (clearFoldersBtn) {
    clearFoldersBtn.disabled = state.selectedFiles.length === 0;
  }
  if (!selectedFolderList) {
    return;
  }

  if (state.selectedFolders.length === 0) {
    selectedFolderList.hidden = true;
    selectedFolderList.innerHTML = "";
    return;
  }

  selectedFolderList.hidden = false;
  selectedFolderList.innerHTML = state.selectedFolders
    .map((folder) => {
      const ignoredText = folder.ignoredCount > 0 ? `, ${folder.ignoredCount} ignored` : "";
      return `
        <div class="selected-folder-row">
          <span class="selected-folder-path" title="${escapeHtml(folder.displayPath)}">${escapeHtml(folder.displayPath)}</span>
          <span class="selected-folder-count">${escapeHtml(frameCountText(folder.frameCount))}${ignoredText}</span>
        </div>
      `;
    })
    .join("");
}

function updateFolderFileCount() {
  if (!folderFileCount) {
    renderSelectedFolderList();
    return;
  }

  const files = state.selectedFiles;
  if (files.length === 0) {
    folderFileCount.textContent = "No folders selected";
    renderSelectedFolderList();
    return;
  }

  const stats = selectedFileStats(files);
  const folderText = state.selectedFolders.length === 1 ? "1 folder" : `${state.selectedFolders.length} folders`;
  const ignoredCount = ignoredFileCount(stats);
  folderFileCount.textContent =
    ignoredCount > 0
      ? `${folderText}, ${frameCountText(stats.frameCount)}, ${ignoredCount} ignored`
      : `${folderText}, ${frameCountText(stats.frameCount)}`;
  renderSelectedFolderList();
}

function cleanFilterName(value) {
  return String(value || "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\s+/g, " ");
}

function normalizeFilterName(value) {
  const cleaned = cleanFilterName(value);
  if (!cleaned || /^none$/i.test(cleaned) || /^no filter$/i.test(cleaned)) {
    return unknownFilterName;
  }

  const lower = cleaned.toLowerCase();
  const compact = cleaned.replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (!compact || compact === "unknown" || compact === "empty") {
    return unknownFilterName;
  }
  if (/^\d+$/.test(compact)) {
    return unknownFilterName;
  }
  if (compact === "l" || compact === "lum" || compact === "luminance") {
    return "L";
  }
  if (compact === "r" || compact === "red") {
    return "R";
  }
  if (compact === "g" || compact === "green") {
    return "G";
  }
  if (compact === "b" || compact === "blue") {
    return "B";
  }
  const matchesHa =
    compact === "ha" ||
    compact === "halpha" ||
    compact === "hydrogenalpha" ||
    compact.includes("halpha") ||
    /\bha\b/.test(lower) ||
    /\bh[-\s]?alpha\b/.test(lower);
  const matchesOiii =
    compact === "oiii" ||
    compact === "o3" ||
    compact === "oxygeniii" ||
    compact.includes("oiii") ||
    compact.includes("oxygeniii") ||
    /\bo\s*iii\b/.test(lower);
  const matchesSii =
    compact === "sii" ||
    compact === "s2" ||
    compact === "sulfurii" ||
    compact === "sulphurii" ||
    compact.includes("sii") ||
    /\bs\s*ii\b/.test(lower);
  const narrowbandMatches = [matchesHa, matchesOiii, matchesSii].filter(Boolean).length;

  if (narrowbandMatches > 1) {
    return cleaned.slice(0, 32);
  }
  if (matchesHa) {
    return "Ha";
  }
  if (matchesOiii) {
    return "OIII";
  }
  if (matchesSii) {
    return "SII";
  }
  if (compact === "clear" || compact === "clr" || compact === "open") {
    return "Clear";
  }

  return cleaned.slice(0, 32);
}

function detectFilterFromHeader(header) {
  for (const key of filterHeaderKeys) {
    if (!Object.prototype.hasOwnProperty.call(header, key)) {
      continue;
    }
    const normalized = normalizeFilterName(header[key]);
    if (normalized !== unknownFilterName) {
      return {
        name: normalized,
        source: headerKeywordSource(header, key)
      };
    }
  }

  return {
    name: unknownFilterName,
    source: "None"
  };
}

function detectFilterFromPath(file) {
  const normalizedPath = normalizedFilePath(file);

  const customFilterSegment = normalizedPath
    .split("/")
    .map((segment) => segment.replace(/\.[^.]+$/g, ""))
    .find((segment) => /\b(l[-_\s]?extreme|l[-_\s]?enhance|l[-_\s]?pro|duo[-_\s]?band|dual[-_\s]?band|tri[-_\s]?band|quad[-_\s]?band|uv[-_\s]?ir|ir[-_\s]?cut|cls|uhc)\b/i.test(segment));
  if (customFilterSegment) {
    return {
      name: normalizeFilterName(customFilterSegment),
      source: "File path"
    };
  }

  const checks = [
    { name: "Ha", pattern: /(^|[\/_\s-])(ha|h[-_\s]?alpha|halpha)(?=$|[\/_\s-])/i },
    { name: "OIII", pattern: /(^|[\/_\s-])(oiii|o[-_\s]?iii|o3)(?=$|[\/_\s-])/i },
    { name: "SII", pattern: /(^|[\/_\s-])(sii|s[-_\s]?ii|s2)(?=$|[\/_\s-])/i },
    { name: "L", pattern: /(^|[\/_\s-])(l|lum|luminance)(?=$|[\/_\s-])/i },
    { name: "R", pattern: /(^|[\/_\s-])(r|red)(?=$|[\/_\s-])/i },
    { name: "G", pattern: /(^|[\/_\s-])(g|green)(?=$|[\/_\s-])/i },
    { name: "B", pattern: /(^|[\/_\s-])(b|blue)(?=$|[\/_\s-])/i },
    { name: "Clear", pattern: /(^|[\/_\s-])(clear|clr)(?=$|[\/_\s-])/i }
  ];

  for (const check of checks) {
    if (check.pattern.test(normalizedPath)) {
      return {
        name: check.name,
        source: "File path"
      };
    }
  }

  return {
    name: unknownFilterName,
    source: "None"
  };
}

function detectFilterForFile(file, header = null) {
  if (header) {
    const headerFilter = detectFilterFromHeader(header);
    if (headerFilter.name !== unknownFilterName) {
      return headerFilter;
    }
  }
  return detectFilterFromPath(file);
}

function normalizeFrameType(value) {
  const cleaned = cleanFilterName(value);
  if (!cleaned) {
    return unknownFrameTypeName;
  }

  const lower = cleaned.toLowerCase();
  const compact = cleaned.replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (!compact || compact === "unknown" || compact === "none") {
    return unknownFrameTypeName;
  }
  if (
    compact.includes("darkflat") ||
    compact.includes("flatdark") ||
    /\bdark[-_\s]?flat\b/.test(lower) ||
    /\bflat[-_\s]?dark\b/.test(lower)
  ) {
    return "Dark Flat";
  }
  if (
    compact === "light" ||
    compact === "lights" ||
    compact === "object" ||
    compact === "science" ||
    compact.includes("lightframe")
  ) {
    return "Light";
  }
  if (
    compact === "flat" ||
    compact === "flats" ||
    compact.includes("flatfield") ||
    compact.includes("flatframe") ||
    compact.includes("masterflat")
  ) {
    return "Flat";
  }
  if (compact === "dark" || compact === "darks" || compact.includes("darkframe") || compact.includes("masterdark")) {
    return "Dark";
  }
  if (
    compact === "bias" ||
    compact === "biases" ||
    compact === "offset" ||
    compact === "zero" ||
    compact.includes("biasframe") ||
    compact.includes("masterbias")
  ) {
    return "Bias";
  }

  return unknownFrameTypeName;
}

function detectFrameTypeFromHeader(header) {
  for (const key of frameTypeHeaderKeys) {
    if (!Object.prototype.hasOwnProperty.call(header, key)) {
      continue;
    }
    const normalized = normalizeFrameType(header[key]);
    if (normalized !== unknownFrameTypeName) {
      return {
        name: normalized,
        source: headerKeywordSource(header, key)
      };
    }
  }

  return {
    name: unknownFrameTypeName,
    source: "None"
  };
}

function detectFrameTypeFromPath(file) {
  const sourcePath = normalizedFilePath(file);
  const checks = [
    { name: "Dark Flat", pattern: /(^|[\/_\s-])(dark[-_\s]?flat|flat[-_\s]?dark|darkflat|flatdark)(?=$|[\/_\s-])/i },
    { name: "Light", pattern: /(^|[\/_\s-])(light|lights|object|science)(?=$|[\/_\s-])/i },
    { name: "Flat", pattern: /(^|[\/_\s-])(flat|flats|flatfield)(?=$|[\/_\s-])/i },
    { name: "Dark", pattern: /(^|[\/_\s-])(dark|darks)(?=$|[\/_\s-])/i },
    { name: "Bias", pattern: /(^|[\/_\s-])(bias|biases|offset|zero)(?=$|[\/_\s-])/i }
  ];

  for (const check of checks) {
    if (check.pattern.test(sourcePath)) {
      return {
        name: check.name,
        source: "File path"
      };
    }
  }

  return {
    name: unknownFrameTypeName,
    source: "None"
  };
}

function detectFrameTypeForFile(file, header = null) {
  if (header) {
    const headerType = detectFrameTypeFromHeader(header);
    if (headerType.name !== unknownFrameTypeName) {
      return headerType;
    }
  }
  return detectFrameTypeFromPath(file);
}

function numericMetadataValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const match = value.replace(/[dD]/g, "E").match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (match) {
      const numeric = Number(match[0]);
      if (Number.isFinite(numeric)) {
        return numeric;
      }
    }
  }
  return NaN;
}

function detectNumericMetadataFromHeader(header, keys) {
  if (!header) {
    return null;
  }
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(header, key)) {
      continue;
    }
    const value = numericMetadataValue(header[key]);
    if (Number.isFinite(value)) {
      return {
        value,
        source: headerKeywordSource(header, key)
      };
    }
  }
  return null;
}

function textMetadataValue(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function detectTextMetadataFromHeader(header, keys) {
  if (!header) {
    return null;
  }
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(header, key)) {
      continue;
    }
    const value = textMetadataValue(header[key]);
    if (value) {
      return {
        value,
        source: headerKeywordSource(header, key)
      };
    }
  }
  return null;
}

function detectExposureFromPath(file) {
  const path = normalizedFilePath(file);
  const match = path.match(/(?:^|[\/_\s-])(\d+(?:\.\d+)?)\s*s(?:$|[\/_\s-])/i);
  if (!match) {
    return null;
  }
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return {
    value,
    source: "File path"
  };
}

function detectTemperatureFromPath(file) {
  const path = normalizedFilePath(file);
  const beforeExposure = path.match(/(?:^|[\/_\s])(-?\d+(?:\.\d+)?)_(?:\d+(?:\.\d+)?)\s*s(?:$|[\/_\s-])/i);
  if (beforeExposure) {
    const value = Number(beforeExposure[1]);
    if (Number.isFinite(value)) {
      return {
        value,
        source: "File path"
      };
    }
  }

  const explicit = path.match(/(?:temp|temperature|ccdtemp|camtemp|sensor)[_\s-]*(-?\d+(?:\.\d+)?)(?:c|degc)?/i);
  if (explicit) {
    const value = Number(explicit[1]);
    if (Number.isFinite(value)) {
      return {
        value,
        source: "File path"
      };
    }
  }
  return null;
}

function detectExposureForFile(file, header = null) {
  const headerValue = detectNumericMetadataFromHeader(header, exposureHeaderKeys);
  if (headerValue && headerValue.value > 0) {
    return headerValue;
  }
  return detectExposureFromPath(file) || { value: NaN, source: "None" };
}

function detectTemperatureForFile(file, header = null) {
  const headerValue = detectNumericMetadataFromHeader(header, temperatureHeaderKeys);
  if (headerValue) {
    return headerValue;
  }
  return detectTemperatureFromPath(file) || { value: NaN, source: "None" };
}

function detectCameraModelFromPath(file) {
  const path = normalizedFilePath(file);
  const patterns = [
    /(?:^|[\/_\s-])((?:IMX|ASI|QHY)\s*-?\s*\d{3,4}[A-Z]*)(?:$|[\/_\s-])/i,
    /(?:camera|cam|sensor|detector|ccd)[_\s-]*([A-Za-z0-9._-]{3,32})/i
  ];

  for (const pattern of patterns) {
    const match = path.match(pattern);
    if (!match) {
      continue;
    }
    const value = match[1].replace(/\s+/g, "").replace(/_/g, "-");
    if (value) {
      return {
        value,
        source: "File path"
      };
    }
  }
  return null;
}

function detectCameraModelForFile(file, header = null) {
  const headerValue = detectTextMetadataFromHeader(header, cameraModelHeaderKeys);
  if (headerValue) {
    return headerValue;
  }
  return detectCameraModelFromPath(file) || { value: unknownCameraModelName, source: "None" };
}

function cleanTargetName(value) {
  const cleaned = cleanFilterName(value);
  if (!cleaned) {
    return unknownTargetName;
  }
  const compact = cleaned.replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (!compact || compact === "unknown" || compact === "none" || compact === "light" || compact === "object") {
    return unknownTargetName;
  }
  return cleaned.slice(0, 48);
}

function detectTargetNameFromHeader(header) {
  const headerValue = detectTextMetadataFromHeader(header, targetNameHeaderKeys);
  if (!headerValue) {
    return null;
  }
  const value = cleanTargetName(headerValue.value);
  if (value === unknownTargetName) {
    return null;
  }
  return {
    value,
    source: headerValue.source
  };
}

function detectTargetNameForFile(file, header = null) {
  return detectTargetNameFromHeader(header) || { value: unknownTargetName, source: "None" };
}

function sexagesimalParts(value) {
  if (value === null || value === undefined) {
    return [];
  }
  return String(value)
    .trim()
    .replace(/[hHdD]/g, ":")
    .replace(/[mM]/g, ":")
    .replace(/[sS]/g, "")
    .replace(/[,+]/g, " ")
    .split(/[:\s]+/)
    .filter(Boolean)
    .map(Number);
}

function parseSexagesimalMagnitude(parts) {
  if (parts.length === 0 || !parts.every((part) => Number.isFinite(part))) {
    return NaN;
  }
  const sign = parts[0] < 0 ? -1 : 1;
  const abs0 = Math.abs(parts[0]);
  const minutes = Math.abs(parts[1] || 0);
  const seconds = Math.abs(parts[2] || 0);
  return sign * (abs0 + minutes / 60 + seconds / 3600);
}

function normalizeRightAscensionDegrees(value) {
  if (!Number.isFinite(value)) {
    return NaN;
  }
  return ((value % 360) + 360) % 360;
}

function parseRightAscensionDegrees(value, mode = "auto") {
  const text = String(value ?? "").trim();
  const parts = sexagesimalParts(value);
  const hasSexagesimalSyntax = /[:hHmMsS]/.test(text) || parts.length >= 3;

  if (hasSexagesimalSyntax) {
    const hours = parseSexagesimalMagnitude(parts);
    return normalizeRightAscensionDegrees(hours * 15);
  }

  const numeric = numericMetadataValue(value);
  if (!Number.isFinite(numeric)) {
    return NaN;
  }
  if (mode === "degrees") {
    return normalizeRightAscensionDegrees(numeric);
  }
  if (mode === "hours") {
    return normalizeRightAscensionDegrees(Math.abs(numeric) <= 24 ? numeric * 15 : numeric);
  }
  return normalizeRightAscensionDegrees(Math.abs(numeric) <= 24 ? numeric * 15 : numeric);
}

function parseDeclinationDegrees(value) {
  const text = String(value ?? "").trim();
  const parts = sexagesimalParts(value);
  const hasSexagesimalSyntax = /[:dDmMsS]/.test(text) || parts.length >= 3;
  const numeric = hasSexagesimalSyntax ? parseSexagesimalMagnitude(parts) : numericMetadataValue(value);
  if (!Number.isFinite(numeric) || numeric < -90 || numeric > 90) {
    return NaN;
  }
  return numeric;
}

function detectCoordinatesFromHeader(header) {
  if (!header) {
    return null;
  }

  for (const pair of coordinateHeaderPairs) {
    if (
      !Object.prototype.hasOwnProperty.call(header, pair.raKey) ||
      !Object.prototype.hasOwnProperty.call(header, pair.decKey)
    ) {
      continue;
    }
    const raDegrees = parseRightAscensionDegrees(header[pair.raKey], pair.raMode);
    const decDegrees = parseDeclinationDegrees(header[pair.decKey]);
    if (Number.isFinite(raDegrees) && Number.isFinite(decDegrees)) {
      return {
        raDegrees,
        decDegrees,
        raSource: headerKeywordSource(header, pair.raKey),
        decSource: headerKeywordSource(header, pair.decKey)
      };
    }
  }

  return null;
}

function detectCoordinatesForFile(file, header = null) {
  return (
    detectCoordinatesFromHeader(header) || {
      raDegrees: NaN,
      decDegrees: NaN,
      raSource: "None",
      decSource: "None"
    }
  );
}

function averageFinite(values) {
  const finite = values.filter((value) => Number.isFinite(value) && value > 0);
  if (finite.length === 0) {
    return NaN;
  }
  return finite.reduce((sum, value) => sum + value, 0) / finite.length;
}

function detectFocalLengthForFile(file, header = null) {
  const headerValue = detectNumericMetadataFromHeader(header, focalLengthHeaderKeys);
  if (headerValue && headerValue.value > 0) {
    return headerValue;
  }
  return { value: NaN, source: "None" };
}

function detectPixelSizeForFile(file, header = null) {
  if (header) {
    for (const [xKey, yKey] of pixelSizeHeaderKeyPairs) {
      const xValue = Object.prototype.hasOwnProperty.call(header, xKey) ? numericMetadataValue(header[xKey]) : NaN;
      const yValue = Object.prototype.hasOwnProperty.call(header, yKey) ? numericMetadataValue(header[yKey]) : NaN;
      const value = averageFinite([xValue, yValue]);
      if (Number.isFinite(value)) {
        return {
          value,
          source: headerKeywordSource(header, `${xKey}/${yKey}`)
        };
      }
    }
  }

  const headerValue = detectNumericMetadataFromHeader(header, pixelSizeHeaderKeys);
  if (headerValue && headerValue.value > 0) {
    return headerValue;
  }
  return { value: NaN, source: "None" };
}

function parseBinningValue(value) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  const text = String(value ?? "").trim();
  if (!text) {
    return NaN;
  }
  const matches = text.match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) {
    return NaN;
  }
  const values = matches.map(Number).filter((item) => Number.isFinite(item) && item > 0);
  return averageFinite(values);
}

function detectBinningForFile(file, header = null) {
  if (header) {
    for (const [xKey, yKey] of binningHeaderKeyPairs) {
      const xValue = Object.prototype.hasOwnProperty.call(header, xKey) ? parseBinningValue(header[xKey]) : NaN;
      const yValue = Object.prototype.hasOwnProperty.call(header, yKey) ? parseBinningValue(header[yKey]) : NaN;
      const value = averageFinite([xValue, yValue]);
      if (Number.isFinite(value)) {
        return {
          value,
          source: headerKeywordSource(header, `${xKey}/${yKey}`)
        };
      }
    }

    for (const key of binningHeaderKeys) {
      if (!Object.prototype.hasOwnProperty.call(header, key)) {
        continue;
      }
      const value = parseBinningValue(header[key]);
      if (Number.isFinite(value)) {
        return {
          value,
          source: headerKeywordSource(header, key)
        };
      }
    }
  }

  return { value: 1, source: "Default" };
}

function detectWcsPixelScaleFromHeader(header) {
  if (!header) {
    return null;
  }

  const cdelt1 = numericMetadataValue(header.CDELT1);
  const cdelt2 = numericMetadataValue(header.CDELT2);
  const cdeltScale = averageFinite([Math.abs(cdelt1), Math.abs(cdelt2)]);
  if (Number.isFinite(cdeltScale) && cdeltScale > 0 && cdeltScale < 1) {
    return {
      value: cdeltScale * 3600,
      source: headerKeywordSource(header, "CDELT")
    };
  }

  const cd11 = numericMetadataValue(header.CD1_1);
  const cd12 = numericMetadataValue(header.CD1_2);
  const cd21 = numericMetadataValue(header.CD2_1);
  const cd22 = numericMetadataValue(header.CD2_2);
  const xScale = Math.sqrt((Number.isFinite(cd11) ? cd11 * cd11 : 0) + (Number.isFinite(cd21) ? cd21 * cd21 : 0));
  const yScale = Math.sqrt((Number.isFinite(cd12) ? cd12 * cd12 : 0) + (Number.isFinite(cd22) ? cd22 * cd22 : 0));
  const cdScale = averageFinite([xScale, yScale]);
  if (Number.isFinite(cdScale) && cdScale > 0 && cdScale < 1) {
    return {
      value: cdScale * 3600,
      source: headerKeywordSource(header, "CD matrix")
    };
  }

  return null;
}

function detectPixelScaleForFile(file, header, focalLengthInfo, pixelSizeInfo, binningInfo) {
  const wcsScale = detectWcsPixelScaleFromHeader(header);
  if (wcsScale) {
    return wcsScale;
  }

  const focalLengthMm = focalLengthInfo && Number(focalLengthInfo.value);
  const pixelSizeMicrons = pixelSizeInfo && Number(pixelSizeInfo.value);
  const binning = binningInfo && Number.isFinite(Number(binningInfo.value)) ? Number(binningInfo.value) : 1;
  if (Number.isFinite(focalLengthMm) && focalLengthMm > 0 && Number.isFinite(pixelSizeMicrons) && pixelSizeMicrons > 0) {
    return {
      value: (206.265 * pixelSizeMicrons * Math.max(binning, 1)) / focalLengthMm,
      source: "Focal length + pixel size"
    };
  }

  return { value: NaN, source: "None" };
}

function fieldOfViewFromPixelScale(pixelScaleArcsecPerPixel, width, height) {
  if (
    !Number.isFinite(pixelScaleArcsecPerPixel) ||
    pixelScaleArcsecPerPixel <= 0 ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return {
      widthDeg: NaN,
      heightDeg: NaN
    };
  }

  return {
    widthDeg: (pixelScaleArcsecPerPixel * width) / 3600,
    heightDeg: (pixelScaleArcsecPerPixel * height) / 3600
  };
}

function objectShotToleranceDegrees(pixelScaleArcsecPerPixel, width, height) {
  const fov = fieldOfViewFromPixelScale(pixelScaleArcsecPerPixel, width, height);
  const minFov = Math.min(fov.widthDeg, fov.heightDeg);
  if (Number.isFinite(minFov) && minFov > 0) {
    return clamp(
      minFov * objectShotFovToleranceFraction,
      objectShotMinToleranceDeg,
      objectShotMaxToleranceDeg
    );
  }
  return objectShotFallbackToleranceDeg;
}

function darkOutlierProfileForCamera(cameraModel) {
  const model = String(cameraModel || "");
  const lowGlowBackIlluminated = lowGlowBackIlluminatedCameraPatterns.some((pattern) => pattern.test(model));
  if (lowGlowBackIlluminated) {
    return {
      name: "Low-glow BSI",
      hotGoodLimit: 0.08,
      hotBadLimit: 0.9,
      darkGoodLimit: 0.12,
      darkBadLimit: 1.2,
      hotPossibleLimit: 0.25,
      hotSevereLimit: 0.9,
      darkPossibleLimit: 0.45,
      darkSevereLimit: 1.2
    };
  }

  return {
    name: "Generic sensor",
    hotGoodLimit: 0.35,
    hotBadLimit: 2.2,
    darkGoodLimit: 0.45,
    darkBadLimit: 2.8,
    hotPossibleLimit: 0.8,
    hotSevereLimit: 3,
    darkPossibleLimit: 1,
    darkSevereLimit: 3
  };
}

function safeDirectoryName(value) {
  const cleaned = cleanFilterName(value || unknownFilterName)
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/^\.+|\.+$/g, "");
  return cleaned || unknownFilterName;
}

function normalizeAnalysisMode(mode) {
  return Object.prototype.hasOwnProperty.call(analysisModeConfigs, mode) ? mode : defaultAnalysisMode;
}

function analysisModeLabel(mode = getAnalysisMode()) {
  return analysisModeConfigs[normalizeAnalysisMode(mode)].label;
}

function resultAnalysisMode(result) {
  return normalizeAnalysisMode(result && result.analysisMode);
}

function analysisModeSummary(results = state.results) {
  const modes = Array.from(new Set(results.map(resultAnalysisMode)));
  if (modes.length === 0) {
    return analysisModeLabel();
  }
  return modes.map(analysisModeLabel).join(", ");
}

function getResultKey(result) {
  return result.fileKey || result.fileName;
}

function analyzedResultKeys(results = state.results, analysisMode = getAnalysisMode()) {
  const normalizedMode = normalizeAnalysisMode(analysisMode);
  return new Set(
    results.filter((result) => resultAnalysisMode(result) === normalizedMode).map((result) => getResultKey(result))
  );
}

function filesMissingResults(files, existingKeys = analyzedResultKeys()) {
  return files.filter((file) => !existingKeys.has(fileIdentityKey(file)));
}

function pruneSelectedKeysToResults(results = state.results) {
  const validKeys = analyzedResultKeys(results);
  for (const key of Array.from(state.selectedKeys)) {
    if (!validKeys.has(key)) {
      state.selectedKeys.delete(key);
    }
  }
}

function hasDirectoryPicker() {
  return typeof window.showDirectoryPicker === "function";
}

function isDesktopApp() {
  return Boolean(window.astroDesktop && window.astroDesktop.isDesktop);
}

function hasOutputFolderSupport() {
  return isDesktopApp() || hasDirectoryPicker();
}

function hasOutputFolderSelected() {
  return isDesktopApp() ? Boolean(state.outputDirectoryPath) : Boolean(state.outputDirectoryHandle);
}

function selectedResults() {
  return state.results.filter((result) => state.selectedKeys.has(getResultKey(result)));
}

function selectedCount() {
  return selectedResults().length;
}

function isCalibrationFrame(result) {
  return calibrationFrameTypes.has(result.frameType || unknownFrameTypeName);
}

function resultFrameType(result) {
  return result.frameType || unknownFrameTypeName;
}

function resultsForActiveFrameType() {
  if (state.activeFrameType === allFrameTypesKey) {
    return state.results;
  }
  return state.results.filter((result) => resultFrameType(result) === state.activeFrameType);
}

function resultsForActiveFilter() {
  const typeResults = resultsForActiveFrameType();
  if (state.activeFilter === allFiltersKey) {
    return typeResults;
  }
  return typeResults.filter((result) => (result.filterName || unknownFilterName) === state.activeFilter);
}

function resultObjectShotKey(result) {
  return result.objectShotKey || unknownObjectShotKey;
}

function resultsForActiveObjectShot() {
  const filterResults = resultsForActiveFilter();
  if (state.activeObjectShot === allObjectShotsKey) {
    return filterResults;
  }
  return filterResults.filter((result) => !isCalibrationFrame(result) && resultObjectShotKey(result) === state.activeObjectShot);
}

function resultRecommendation(result) {
  return recommendationFor(result);
}

function defaultThresholdForFilter(filterName) {
  const normalized = normalizeFilterName(filterName);
  return defaultFilterThresholds[normalized] || defaultKeeperThreshold;
}

function getKeeperThreshold(filterName) {
  const normalized = normalizeFilterName(filterName);
  const stored = state.filterThresholds[normalized];
  if (Number.isFinite(Number(stored))) {
    return Math.round(clamp(Number(stored), 0, 100));
  }
  return defaultThresholdForFilter(normalized);
}

function ensureFilterThresholds(results) {
  for (const result of results) {
    const filterName = result.filterName || unknownFilterName;
    if (!Number.isFinite(Number(state.filterThresholds[filterName]))) {
      state.filterThresholds[filterName] = defaultThresholdForFilter(filterName);
    }
  }
}

function filterSortValue(filterName) {
  const index = filterSortOrder.indexOf(filterName);
  return index >= 0 ? index : filterSortOrder.length;
}

function frameTypeSortValue(frameType) {
  const index = frameTypeSortOrder.indexOf(frameType);
  return index >= 0 ? index : frameTypeSortOrder.length;
}

function visibleResults() {
  const filterResults = resultsForActiveObjectShot();
  if (state.activeRecommendation === allRecommendationsKey) {
    return filterResults;
  }
  return filterResults.filter((result) => resultRecommendation(result) === state.activeRecommendation);
}

function filterStats(results = state.results) {
  const stats = new Map();
  for (const result of results) {
    const filterName = result.filterName || unknownFilterName;
    if (!stats.has(filterName)) {
      stats.set(filterName, {
        filterName,
        count: 0,
        keep: 0,
        review: 0,
        discard: 0
      });
    }
    const stat = stats.get(filterName);
    stat.count += 1;
    const recommendation = recommendationFor(result);
    if (recommendation === "Keep") {
      stat.keep += 1;
    } else if (recommendation === "Review") {
      stat.review += 1;
    } else {
      stat.discard += 1;
    }
  }

  return Array.from(stats.values()).sort((a, b) => {
    const sortA = filterSortValue(a.filterName);
    const sortB = filterSortValue(b.filterName);
    if (sortA !== sortB) {
      return sortA - sortB;
    }
    return a.filterName.localeCompare(b.filterName);
  });
}

function frameTypeStats(results = state.results) {
  const stats = new Map();
  for (const result of results) {
    const frameType = resultFrameType(result);
    if (!stats.has(frameType)) {
      stats.set(frameType, {
        frameType,
        count: 0,
        keep: 0,
        review: 0,
        discard: 0
      });
    }
    const stat = stats.get(frameType);
    stat.count += 1;
    const recommendation = recommendationFor(result);
    if (recommendation === "Keep") {
      stat.keep += 1;
    } else if (recommendation === "Review") {
      stat.review += 1;
    } else {
      stat.discard += 1;
    }
  }

  return Array.from(stats.values()).sort((a, b) => {
    const sortA = frameTypeSortValue(a.frameType);
    const sortB = frameTypeSortValue(b.frameType);
    if (sortA !== sortB) {
      return sortA - sortB;
    }
    return a.frameType.localeCompare(b.frameType);
  });
}

function recommendationStats(results = state.results) {
  const counts = new Map(recommendationGroups.map((name) => [name, 0]));
  for (const result of results) {
    const recommendation = resultRecommendation(result);
    counts.set(recommendation, (counts.get(recommendation) || 0) + 1);
  }
  return recommendationGroups.map((name) => ({
    recommendation: name,
    count: counts.get(name) || 0
  }));
}

function objectShotSortValue(stat) {
  if (stat.objectShotKey === unknownObjectShotKey) {
    return Number.POSITIVE_INFINITY;
  }
  return Number.isFinite(stat.index) && stat.index > 0 ? stat.index : 9999;
}

function objectShotStats(results = state.results) {
  const stats = new Map();
  for (const result of results) {
    if (isCalibrationFrame(result)) {
      continue;
    }
    const objectShotKey = resultObjectShotKey(result);
    if (!stats.has(objectShotKey)) {
      stats.set(objectShotKey, {
        objectShotKey,
        label: result.objectShotLabel || unknownObjectShotLabel,
        count: 0,
        index: result.objectShotIndex || 0
      });
    }
    const stat = stats.get(objectShotKey);
    stat.count += 1;
    if (result.objectShotLabel && stat.label === unknownObjectShotLabel) {
      stat.label = result.objectShotLabel;
    }
    if (Number.isFinite(result.objectShotIndex) && result.objectShotIndex > 0) {
      stat.index = stat.index > 0 ? Math.min(stat.index, result.objectShotIndex) : result.objectShotIndex;
    }
  }

  return Array.from(stats.values()).sort((a, b) => {
    const sortA = objectShotSortValue(a);
    const sortB = objectShotSortValue(b);
    if (sortA !== sortB) {
      return sortA - sortB;
    }
    return a.label.localeCompare(b.label);
  });
}

function updateSelectionControls() {
  const hasResults = state.results.length > 0;
  const selected = selectedCount();

  selectKeepBtn.disabled = !hasResults;
  clearSelectionBtn.disabled = !hasResults || selected === 0;
  sendSelectedBtn.disabled =
    !hasResults || selected === 0 || !hasOutputFolderSupport() || !hasOutputFolderSelected();
}

function updateSelectAllState() {
  const displayed = visibleResults();
  if (displayed.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    selectAllCheckbox.disabled = true;
    return;
  }

  const total = displayed.length;
  const selected = displayed.filter((result) => state.selectedKeys.has(getResultKey(result))).length;
  selectAllCheckbox.disabled = false;
  selectAllCheckbox.checked = selected === total;
  selectAllCheckbox.indeterminate = selected > 0 && selected < total;
}

function setOutputLabel() {
  if (!hasOutputFolderSupport()) {
    outputLabel.textContent = "Output folder: unsupported in this browser";
    return;
  }
  if (isDesktopApp()) {
    outputLabel.textContent = `Output folder: ${state.outputDirectoryName || "not selected"}`;
    return;
  }
  const folderName = state.outputDirectoryHandle ? state.outputDirectoryHandle.name : "not selected";
  outputLabel.textContent = `Output folder: ${folderName}`;
}

function setSummaryMessage(extraText = "") {
  const baseText = state.analysisSummaryText || "Select one or more folders and click Analyse.";
  if (extraText) {
    summaryEl.innerHTML = `<p>${escapeHtml(baseText)}</p><p>${escapeHtml(extraText)}</p>`;
    return;
  }
  summaryEl.innerHTML = `<p>${escapeHtml(baseText)}</p>`;
}

function setTransientStatus(text) {
  summaryEl.innerHTML = `<p>${escapeHtml(text)}</p>`;
}

function formatTimerSeconds(seconds, approximate = false) {
  const numeric = Number(seconds);
  if (!Number.isFinite(numeric)) {
    return "estimating";
  }
  const rounded = Math.max(0, Math.ceil(numeric));
  return `${approximate ? "~" : ""}${rounded}s`;
}

function formatMemoryGb(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "unknown memory";
  }
  return numeric >= 10 ? `${numeric.toFixed(0)} GB` : `${numeric.toFixed(1)} GB`;
}

function estimatedAnalysisRemainingSeconds(progress, now = Date.now()) {
  if (!progress || progress.completed <= 0 || progress.completedDurationMs <= 0) {
    return NaN;
  }

  const averageFrameMs = progress.completedDurationMs / progress.completed;
  const remainingFrames = Math.max(0, progress.total - progress.completed);
  const activeFrames = Math.max(0, Number(progress.activeCount) || (progress.currentStartedAt ? 1 : 0));
  const queuedFrames = Math.max(0, remainingFrames - activeFrames);
  const concurrency = Math.max(1, Number(progress.concurrency) || 1);
  const activeRemainderMs = activeFrames > 0 ? averageFrameMs : 0;
  return Math.max(0, (queuedFrames * averageFrameMs) / concurrency + activeRemainderMs) / 1000;
}

function analysisImageCountText(count, adjective = "") {
  const prefix = adjective ? `${adjective} ` : "";
  return count === 1 ? `1 ${prefix}image` : `${count} ${prefix}images`;
}

function analysisProgressHeadline(progress) {
  const targetText =
    progress.alreadyAnalyzed > 0 ? analysisImageCountText(progress.total, "new") : analysisImageCountText(progress.total);
  const keptText = progress.alreadyAnalyzed > 0 ? ` ${progress.alreadyAnalyzed} existing result(s) kept.` : "";
  const failureText = progress.failures > 0 ? ` ${progress.failures} failed.` : "";
  const workerText =
    progress.workerPlan && progress.concurrency > 0
      ? ` using ${progress.concurrency} auto worker${progress.concurrency === 1 ? "" : "s"}`
      : "";
  return `Analysing ${targetText} locally in ${analysisModeLabel(progress.analysisMode)} mode${workerText}... ${progress.completed}/${progress.total}.${keptText}${failureText}`;
}

function analysisWorkerPlanText(progress) {
  const plan = progress && progress.workerPlan;
  if (!plan) {
    return "";
  }
  const memorySourceText =
    plan.memorySource === "desktop"
      ? "desktop memory"
      : plan.memorySource === "browser"
        ? "browser memory"
        : plan.memorySource === "heap"
          ? "browser heap limit"
          : "fallback memory estimate";
  return `Auto workers: ${plan.workerCount}/${plan.logicalCores} logical cores, ${memorySourceText} ${formatMemoryGb(plan.memoryGb)}.`;
}

function renderAnalysisProgress(progress, note = "") {
  if (!progress) {
    return;
  }

  const now = Date.now();
  const elapsed = Math.max(0, (now - progress.startedAt) / 1000);
  const remaining = estimatedAnalysisRemainingSeconds(progress, now);
  const timerText = note
    ? note
    : Number.isFinite(remaining)
      ? `Elapsed: ${formatTimerSeconds(elapsed)}. Remaining: ${formatTimerSeconds(remaining, true)}.`
      : `Elapsed: ${formatTimerSeconds(elapsed)}. Remaining: estimating after first frame.`;
  const workerPlanText = analysisWorkerPlanText(progress);
  const detailText = workerPlanText ? `${timerText} ${workerPlanText}` : timerText;

  summaryEl.innerHTML = [
    `<p>${escapeHtml(analysisProgressHeadline(progress))}</p>`,
    `<p class="analysis-timer-line">${escapeHtml(detailText)}</p>`
  ].join("");
}

function startAnalysisProgress(total, alreadyAnalyzed = 0, analysisMode = getAnalysisMode()) {
  stopAnalysisProgress();
  const progress = {
    total,
    alreadyAnalyzed,
    analysisMode: normalizeAnalysisMode(analysisMode),
    completed: 0,
    failures: 0,
    startedAt: Date.now(),
    completedDurationMs: 0,
    concurrency: 1,
    activeCount: 0,
    currentStartedAt: null,
    workerPlan: null,
    timerId: null
  };

  state.analysisProgress = progress;
  progress.timerId = window.setInterval(() => {
    if (state.analysisProgress === progress) {
      renderAnalysisProgress(progress);
    }
  }, 1000);
  renderAnalysisProgress(progress);
  return progress;
}

function stopAnalysisProgress(progress = state.analysisProgress) {
  if (progress && progress.timerId) {
    window.clearInterval(progress.timerId);
    progress.timerId = null;
  }
  if (state.analysisProgress === progress) {
    state.analysisProgress = null;
  }
}

function createAnalysisRun() {
  const run = {
    stopped: false,
    workers: new Set(),
    stopCallbacks: new Set(),
    stop() {
      if (this.stopped) {
        return;
      }
      this.stopped = true;
      for (const worker of Array.from(this.workers)) {
        worker.terminate();
      }
      this.workers.clear();
      for (const callback of Array.from(this.stopCallbacks)) {
        callback();
      }
      this.stopCallbacks.clear();
    }
  };
  state.analysisRun = run;
  return run;
}

function clearAnalysisRun(run) {
  if (!run) {
    return;
  }
  for (const worker of Array.from(run.workers)) {
    worker.terminate();
  }
  run.workers.clear();
  run.stopCallbacks.clear();
  if (state.analysisRun === run) {
    state.analysisRun = null;
  }
}

function stopCurrentAnalysis() {
  const run = state.analysisRun;
  if (!run) {
    return;
  }
  run.stop();
  if (stopAnalyzeBtn) {
    stopAnalyzeBtn.disabled = true;
  }
  if (state.analysisProgress) {
    renderAnalysisProgress(state.analysisProgress, "Stopping analysis. Completed frames will be kept.");
  }
}

function setAnalysisControlsRunning(running) {
  analyzeBtn.disabled = running;
  setAnalysisModeControlsDisabled(running);
  if (stopAnalyzeBtn) {
    stopAnalyzeBtn.hidden = !running;
    stopAnalyzeBtn.disabled = !running;
  }
}

function storedSettings() {
  try {
    return JSON.parse(window.localStorage.getItem(settingsStorageKey) || "{}");
  } catch (error) {
    return {};
  }
}

function setRangeValue(input, value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return;
  }

  const min = Number.isFinite(Number(input.min)) ? Number(input.min) : numeric;
  const max = Number.isFinite(Number(input.max)) ? Number(input.max) : numeric;
  input.value = String(clamp(numeric, min, max));
}

function sanitizeThresholdSettings(settings = {}) {
  const thresholds = {};
  for (const [filterName, value] of Object.entries(settings)) {
    const normalized = normalizeFilterName(filterName);
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      continue;
    }
    thresholds[normalized] = Math.round(clamp(numeric, 0, 100));
  }
  return thresholds;
}

function getCsvSeparatorKey() {
  const selected = csvSeparatorSelect ? csvSeparatorSelect.value : defaultCsvSeparatorKey;
  return Object.prototype.hasOwnProperty.call(csvSeparators, selected) ? selected : defaultCsvSeparatorKey;
}

function getCsvSeparator() {
  return csvSeparators[getCsvSeparatorKey()];
}

function formatCsvCell(value, separator) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);
  const shouldQuote =
    text.includes(separator) ||
    text.includes("\"") ||
    text.includes("\n") ||
    text.includes("\r") ||
    /^\s|\s$/.test(text);

  if (!shouldQuote) {
    return text;
  }

  return `"${text.replace(/"/g, "\"\"")}"`;
}

function buildCsvRow(values, separator) {
  return values.map((value) => formatCsvCell(value, separator)).join(separator);
}

function applyStoredSettings() {
  const settings = storedSettings();
  const hasOldDefaultScoreSettings = oldDefaultScoreSettings.some(
    (defaults) =>
      Number(settings.sharpnessWeight) === defaults.sharpnessWeight &&
      Number(settings.noiseWeight) === defaults.noiseWeight &&
      Number(settings.starsWeight) === defaults.starsWeight &&
      Number(settings.clipWeight) === defaults.clipWeight &&
      !Number.isFinite(Number(settings.starCountWeight))
  );
  const scoreSettings = hasOldDefaultScoreSettings ? defaultScoreSettings : settings;

  setRangeValue(sharpnessWeight, scoreSettings.sharpnessWeight);
  setRangeValue(noiseWeight, scoreSettings.noiseWeight);
  setRangeValue(starsWeight, scoreSettings.starsWeight);
  setRangeValue(starCountWeight, scoreSettings.starCountWeight);
  setRangeValue(clipWeight, scoreSettings.clipWeight);
  setRangeValue(previewStretch, settings.previewStretch);
  state.filterThresholds = sanitizeThresholdSettings(settings.filterThresholds);
  if (copyByFilterCheckbox) {
    copyByFilterCheckbox.checked = Boolean(settings.copyByFilter);
  }
  if (copyByTypeCheckbox) {
    copyByTypeCheckbox.checked = Boolean(settings.copyByType);
  }
  if (
    csvSeparatorSelect &&
    typeof settings.csvSeparator === "string" &&
    Object.prototype.hasOwnProperty.call(csvSeparators, settings.csvSeparator)
  ) {
    csvSeparatorSelect.value = settings.csvSeparator;
  }
  if (zoomMagnifierPower && [2, 4, 8].includes(Number(settings.zoomMagnifierPower))) {
    zoomMagnifierPower.value = String(Number(settings.zoomMagnifierPower));
  }
  if (haloPenaltyCheckbox) {
    haloPenaltyCheckbox.checked = Boolean(settings.haloPenalty);
  }
  state.starOverlayActive = Boolean(settings.starOverlayActive);

  if (settings.sharpnessMode === "fwhm" && sharpnessModeFwhm) {
    sharpnessModeFwhm.checked = true;
  } else if (settings.sharpnessMode === "hybrid" && sharpnessModeHybrid) {
    sharpnessModeHybrid.checked = true;
  }
  if (settings.analysisMode === "expert" && analysisModeExpert) {
    analysisModeExpert.checked = true;
  } else if (analysisModeStandard) {
    analysisModeStandard.checked = true;
  }
}

function resetDefaultPercentages() {
  const previousPreviewStretch = getPreviewStretchValue();
  setRangeValue(sharpnessWeight, defaultScoreSettings.sharpnessWeight);
  setRangeValue(noiseWeight, defaultScoreSettings.noiseWeight);
  setRangeValue(starsWeight, defaultScoreSettings.starsWeight);
  setRangeValue(starCountWeight, defaultScoreSettings.starCountWeight);
  setRangeValue(clipWeight, defaultScoreSettings.clipWeight);
  setRangeValue(previewStretch, defaultPreviewStretch);
  state.filterThresholds = {};

  if (sharpnessModeHybrid) {
    sharpnessModeHybrid.checked = defaultSharpnessMode === "hybrid";
  }
  if (sharpnessModeFwhm) {
    sharpnessModeFwhm.checked = defaultSharpnessMode === "fwhm";
  }

  updateWeightLabels();
  updatePreviewStretchLabel();
  saveSettings();
  renderFilterPanel();

  if (state.results.length > 0) {
    cancelScoreRefresh();
    state.lastAnalysisRunNote = "";
    computeFinalScores(state.results);
    state.results.sort((a, b) => b.quality - a.quality);
    renderAnalysisView();
    if (previousPreviewStretch !== getPreviewStretchValue()) {
      schedulePreviewRefresh(0, "Default percentage values restored.");
      return;
    }
  }

  setSummaryMessage("Default percentage values restored.");
}

function saveSettings() {
  try {
    window.localStorage.setItem(
      settingsStorageKey,
      JSON.stringify({
        sharpnessWeight: Number(sharpnessWeight.value),
        noiseWeight: Number(noiseWeight.value),
        starsWeight: Number(starsWeight.value),
        starCountWeight: Number(starCountWeight.value),
        clipWeight: Number(clipWeight.value),
        previewStretch: Number(previewStretch.value),
        sharpnessMode: getSharpnessMode(),
        analysisMode: getAnalysisMode(),
        filterThresholds: state.filterThresholds,
        copyByFilter: copyByFilterCheckbox ? copyByFilterCheckbox.checked : false,
        copyByType: copyByTypeCheckbox ? copyByTypeCheckbox.checked : false,
        haloPenalty: haloPenaltyCheckbox ? haloPenaltyCheckbox.checked : false,
        csvSeparator: getCsvSeparatorKey(),
        zoomMagnifierPower: zoomMagnifierPower ? Number(zoomMagnifierPower.value) : defaultZoomLensMagnification,
        starOverlayActive: state.starOverlayActive
      })
    );
  } catch (error) {
    // Browser storage may be unavailable on locked-down machines; the app still works without saved preferences.
  }
}

function updateWeightLabels() {
  sharpnessWeightValue.textContent = `${sharpnessWeight.value}%`;
  noiseWeightValue.textContent = `${noiseWeight.value}%`;
  starsWeightValue.textContent = `${starsWeight.value}%`;
  starCountWeightValue.textContent = `${starCountWeight.value}%`;
  clipWeightValue.textContent = `${clipWeight.value}%`;
}

function getPreviewStretchValue() {
  return clamp(Number(previewStretch.value) || 0, 0, 100);
}

function updatePreviewStretchLabel() {
  previewStretchValue.textContent = `${getPreviewStretchValue()}%`;
}

function getPreviewStretchSettings() {
  const strength = getPreviewStretchValue() / 100;
  if (strength <= 0) {
    return {
      neutral: true,
      lowPercentile: 0,
      highPercentile: 1,
      asinhStrength: 0,
      gamma: 1
    };
  }

  return {
    neutral: false,
    lowPercentile: strength * 0.01,
    highPercentile: 1 - strength * 0.015,
    asinhStrength: strength * 14,
    gamma: 1 - strength * 0.28
  };
}

function getWeights() {
  return {
    sharpness: Number(sharpnessWeight.value),
    noise: Number(noiseWeight.value),
    stars: Number(starsWeight.value),
    starCount: Number(starCountWeight.value),
    clipping: Number(clipWeight.value)
  };
}

function haloPenaltyEnabled() {
  return Boolean(haloPenaltyCheckbox && haloPenaltyCheckbox.checked);
}

function getSharpnessMode() {
  if (sharpnessModeFwhm && sharpnessModeFwhm.checked) {
    return "fwhm";
  }
  return "hybrid";
}

function getAnalysisMode() {
  if (analysisModeExpert && analysisModeExpert.checked) {
    return "expert";
  }
  return defaultAnalysisMode;
}

function getAnalysisModeConfig(mode = getAnalysisMode()) {
  return analysisModeConfigs[normalizeAnalysisMode(mode)];
}

function setAnalysisModeControlsDisabled(disabled) {
  if (analysisModeStandard) {
    analysisModeStandard.disabled = disabled;
  }
  if (analysisModeExpert) {
    analysisModeExpert.disabled = disabled;
  }
}

function toLuma(data) {
  const gray = new Float32Array(data.length / 4);
  let g = 0;
  for (let i = 0; i < data.length; i += 4) {
    gray[g] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    g += 1;
  }
  return gray;
}

function computeMeanStd(gray) {
  let mean = 0;
  let m2 = 0;
  let count = 0;
  for (let i = 0; i < gray.length; i += 1) {
    if (!Number.isFinite(gray[i])) {
      continue;
    }
    count += 1;
    const delta = gray[i] - mean;
    mean += delta / count;
    const delta2 = gray[i] - mean;
    m2 += delta * delta2;
  }
  const variance = count > 1 ? m2 / (count - 1) : 0;
  return { mean, std: Math.sqrt(Math.max(variance, 0)) };
}

function clippingStatsFromCounts(finitePixels, clippedHighlights, nearSaturatedHighlights) {
  const clippingPercent = finitePixels > 0 ? (clippedHighlights / finitePixels) * 100 : 0;
  const nearSaturationPercent = finitePixels > 0 ? (nearSaturatedHighlights / finitePixels) * 100 : 0;
  const hardPressure = Math.sqrt(clamp(clippingPercent / hardClippingFullPenaltyPercent, 0, 1));
  const nearPressure =
    Math.sqrt(clamp(nearSaturationPercent / nearSaturationFullPenaltyPercent, 0, 1)) *
    nearSaturationPressureWeight;
  const clippingPressure = clamp(Math.max(hardPressure, nearPressure), 0, 1);

  return {
    clippingPercent,
    nearSaturationPercent,
    clippingPressure,
    clippingScore: 1 - clippingPressure
  };
}

function computeBasicImageStats(gray, clippingThreshold = bitmapClippingThreshold, nearSaturationThreshold = null) {
  let mean = 0;
  let m2 = 0;
  let finitePixels = 0;
  let clippedHighlights = 0;
  let nearSaturatedHighlights = 0;
  const hardThreshold = Number.isFinite(clippingThreshold) ? clippingThreshold : Number.POSITIVE_INFINITY;
  const nearThreshold = Number.isFinite(nearSaturationThreshold)
    ? Math.min(nearSaturationThreshold, hardThreshold)
    : hardThreshold;

  for (let i = 0; i < gray.length; i += 1) {
    const value = gray[i];
    if (!Number.isFinite(value)) {
      continue;
    }

    finitePixels += 1;
    const delta = value - mean;
    mean += delta / finitePixels;
    const delta2 = value - mean;
    m2 += delta * delta2;

    if (value >= hardThreshold) {
      clippedHighlights += 1;
    }
    if (value >= nearThreshold) {
      nearSaturatedHighlights += 1;
    }
  }

  const variance = finitePixels > 1 ? m2 / (finitePixels - 1) : 0;
  return {
    mean,
    std: Math.sqrt(Math.max(variance, 0)),
    finitePixels,
    clippedHighlights,
    nearSaturatedHighlights,
    clippingStats: clippingStatsFromCounts(finitePixels, clippedHighlights, nearSaturatedHighlights)
  };
}

function sampleStepForTarget(width, height, targetSamples = 0) {
  const safeWidth = Math.max(1, Math.floor(width));
  const safeHeight = Math.max(1, Math.floor(height));
  const target = Number.isFinite(targetSamples) && targetSamples > 0 ? Math.floor(targetSamples) : safeWidth * safeHeight;
  return Math.max(1, Math.floor(Math.sqrt((safeWidth * safeHeight) / Math.max(target, 1))));
}

function computeLaplacianVariance(gray, width, height, options = {}) {
  let mean = 0;
  let m2 = 0;
  let count = 0;
  const step = sampleStepForTarget(Math.max(1, width - 2), Math.max(1, height - 2), options.sampleTarget);

  for (let y = 1; y < height - 1; y += step) {
    const row = y * width;
    for (let x = 1; x < width - 1; x += step) {
      const i = row + x;
      if (
        !Number.isFinite(gray[i]) ||
        !Number.isFinite(gray[i - 1]) ||
        !Number.isFinite(gray[i + 1]) ||
        !Number.isFinite(gray[i - width]) ||
        !Number.isFinite(gray[i + width])
      ) {
        continue;
      }
      const lap = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - width] - gray[i + width];
      count += 1;
      const delta = lap - mean;
      mean += delta / count;
      const delta2 = lap - mean;
      m2 += delta * delta2;
    }
  }

  return count > 1 ? m2 / (count - 1) : 0;
}

function computeNoise(gray, width, height, mean, std, options = {}) {
  let totalResidual = 0;
  let samples = 0;
  const upper = mean + std;
  const step = sampleStepForTarget(Math.max(1, width - 2), Math.max(1, height - 2), options.sampleTarget);

  for (let y = 1; y < height - 1; y += step) {
    const row = y * width;
    for (let x = 1; x < width - 1; x += step) {
      const i = row + x;
      const value = gray[i];
      if (!Number.isFinite(value) || value <= 5 || value > upper) {
        continue;
      }

      const neighborhood =
        gray[i - width - 1] +
        gray[i - width] +
        gray[i - width + 1] +
        gray[i - 1] +
        gray[i] +
        gray[i + 1] +
        gray[i + width - 1] +
        gray[i + width] +
        gray[i + width + 1];

      if (!Number.isFinite(neighborhood)) {
        continue;
      }

      const localMean = neighborhood / 9;

      totalResidual += Math.abs(value - localMean);
      samples += 1;
    }
  }

  if (samples === 0) {
    return 0;
  }
  return totalResidual / samples;
}

function lineAngleDifference(a, b) {
  let diff = Math.abs(a - b) % Math.PI;
  if (diff > Math.PI / 2) {
    diff = Math.PI - diff;
  }
  return Math.abs(diff);
}

function sampleGrayBilinear(gray, width, height, x, y) {
  const clampedX = clamp(x, 0, width - 1);
  const clampedY = clamp(y, 0, height - 1);
  const x0 = clamp(Math.floor(clampedX), 0, width - 1);
  const y0 = clamp(Math.floor(clampedY), 0, height - 1);
  const x1 = clamp(x0 + 1, 0, width - 1);
  const y1 = clamp(y0 + 1, 0, height - 1);
  const tx = clampedX - x0;
  const ty = clampedY - y0;

  const v00 = gray[y0 * width + x0];
  const v10 = gray[y0 * width + x1];
  const v01 = gray[y1 * width + x0];
  const v11 = gray[y1 * width + x1];

  const a = v00 * (1 - tx) + v10 * tx;
  const b = v01 * (1 - tx) + v11 * tx;
  return a * (1 - ty) + b * ty;
}

function measureAxisFwhm(gray, width, height, centerX, centerY, axisX, axisY, peakValue, backgroundLevel) {
  const signal = peakValue - backgroundLevel;
  if (!Number.isFinite(signal) || signal <= 1e-6) {
    return null;
  }

  const halfMaximum = backgroundLevel + signal * 0.5;
  const maxRadius = 8.5;
  const step = 0.35;

  function sideHalfDistance(direction) {
    let previousDistance = 0;
    let previousValue = peakValue;

    for (let distance = step; distance <= maxRadius; distance += step) {
      const sampleX = centerX + axisX * direction * distance;
      const sampleY = centerY + axisY * direction * distance;
      const value = sampleGrayBilinear(gray, width, height, sampleX, sampleY);

      if (value <= halfMaximum) {
        const denominator = value - previousValue;
        if (Math.abs(denominator) < 1e-9) {
          return distance;
        }
        const interpolation = clamp((halfMaximum - previousValue) / denominator, 0, 1);
        return previousDistance + interpolation * (distance - previousDistance);
      }

      previousDistance = distance;
      previousValue = value;
    }

    return null;
  }

  const distancePositive = sideHalfDistance(1);
  const distanceNegative = sideHalfDistance(-1);
  if (distancePositive === null || distanceNegative === null) {
    return null;
  }
  return distancePositive + distanceNegative;
}

function emptyRepeatDriftResult() {
  return {
    repeatScore: 0,
    repeatedStarFraction: 0,
    multiRepeatFraction: 0,
    alignedPairFraction: 0,
    alignmentCoherence: 0,
    repeatStarIndexes: [],
    repeatPairs: []
  };
}

function computeCloseRepeatDrift(
  stars,
  preferredAngle = null,
  minReferenceCoherence = 0.45,
  distanceScale = 1,
  options = {}
) {
  if (stars.length < 10) {
    return emptyRepeatDriftResult();
  }

  const safeDistanceScale = Math.max(distanceScale, 0.1);
  const minDist = 1.2 * safeDistanceScale;
  const maxDist = 9.5 * safeDistanceScale;
  const minDistSq = minDist * minDist;
  const maxDistSq = maxDist * maxDist;
  const brightnessRatioMax = 3.2;
  const cellSize = Math.max(4, 10 * safeDistanceScale);
  const maxPairs =
    Number.isFinite(options.maxPairs) && options.maxPairs > 0 ? Math.floor(options.maxPairs) : standardRepeatDriftMaxPairs;
  const alignedPairLimit =
    Number.isFinite(options.alignedPairLimit) && options.alignedPairLimit > 0
      ? Math.floor(options.alignedPairLimit)
      : 500;
  const grid = new Map();
  const pairRecords = [];

  for (let i = 0; i < stars.length; i += 1) {
    const star = stars[i];
    const cellX = Math.floor(star.x / cellSize);
    const cellY = Math.floor(star.y / cellSize);
    const key = `${cellX},${cellY}`;
    if (!grid.has(key)) {
      grid.set(key, []);
    }
    grid.get(key).push(i);
  }

  for (let i = 0; i < stars.length; i += 1) {
    if (pairRecords.length >= maxPairs) {
      break;
    }
    const a = stars[i];
    const cellX = Math.floor(a.x / cellSize);
    const cellY = Math.floor(a.y / cellSize);

    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const key = `${cellX + dx},${cellY + dy}`;
        const candidates = grid.get(key);
        if (!candidates) {
          continue;
        }
        for (const j of candidates) {
          if (j <= i) {
            continue;
          }
          const b = stars[j];
          const offsetX = b.x - a.x;
          const offsetY = b.y - a.y;
          const distSq = offsetX * offsetX + offsetY * offsetY;
          if (distSq < minDistSq || distSq > maxDistSq) {
            continue;
          }

          const high = Math.max(a.peak, b.peak);
          const low = Math.max(1e-6, Math.min(a.peak, b.peak));
          if (high / low > brightnessRatioMax) {
            continue;
          }

          pairRecords.push({
            i,
            j,
            angle: Math.atan2(offsetY, offsetX)
          });
          if (pairRecords.length >= maxPairs) {
            break;
          }
        }
        if (pairRecords.length >= maxPairs) {
          break;
        }
      }
      if (pairRecords.length >= maxPairs) {
        break;
      }
    }
  }

  if (pairRecords.length === 0) {
    return emptyRepeatDriftResult();
  }

  let referenceAngle = preferredAngle;
  if (referenceAngle === null) {
    let sumX = 0;
    let sumY = 0;
    for (const pair of pairRecords) {
      sumX += Math.cos(2 * pair.angle);
      sumY += Math.sin(2 * pair.angle);
    }
    const coherence = Math.sqrt(sumX * sumX + sumY * sumY) / pairRecords.length;
    if (coherence > minReferenceCoherence) {
      referenceAngle = 0.5 * Math.atan2(sumY, sumX);
    }
  }

  if (referenceAngle === null) {
    return emptyRepeatDriftResult();
  }

  const perStarRepeatCount = new Int16Array(stars.length);
  let alignedPairs = 0;
  let alignX = 0;
  let alignY = 0;
  const alignedPairRecords = [];

  for (const pair of pairRecords) {
    if (lineAngleDifference(pair.angle, referenceAngle) > 0.32) {
      continue;
    }
    alignedPairs += 1;
    if (alignedPairRecords.length < alignedPairLimit) {
      alignedPairRecords.push(pair);
    }
    perStarRepeatCount[pair.i] += 1;
    perStarRepeatCount[pair.j] += 1;
    alignX += Math.cos(2 * pair.angle);
    alignY += Math.sin(2 * pair.angle);
  }

  if (alignedPairs === 0) {
    return emptyRepeatDriftResult();
  }

  let repeatedStars = 0;
  let multiRepeatStars = 0;
  const repeatStarIndexes = [];
  for (let i = 0; i < perStarRepeatCount.length; i += 1) {
    if (perStarRepeatCount[i] > 0) {
      repeatedStars += 1;
      repeatStarIndexes.push(stars[i].id ?? i);
    }
    if (perStarRepeatCount[i] > 1) {
      multiRepeatStars += 1;
    }
  }

  const repeatedStarFraction = repeatedStars / stars.length;
  const multiRepeatFraction = multiRepeatStars / stars.length;
  const alignedPairFraction = alignedPairs / pairRecords.length;
  const alignmentCoherence = Math.sqrt(alignX * alignX + alignY * alignY) / alignedPairs;
  const base = 0.5 * repeatedStarFraction + 0.5 * multiRepeatFraction;
  const repeatScore = clamp(base * alignmentCoherence * (0.55 + 0.45 * alignedPairFraction), 0, 1);

  return {
    repeatScore,
    repeatedStarFraction,
    multiRepeatFraction,
    alignedPairFraction,
    alignmentCoherence,
    repeatStarIndexes,
    repeatPairs: alignedPairRecords.map((pair) => ({
      a: stars[pair.i].id ?? pair.i,
      b: stars[pair.j].id ?? pair.j
    }))
  };
}

function annulusMean(gray, width, height, centerX, centerY, innerRadius, outerRadius) {
  const innerSq = innerRadius * innerRadius;
  const outerSq = outerRadius * outerRadius;
  const minX = Math.max(0, Math.floor(centerX - outerRadius));
  const maxX = Math.min(width - 1, Math.ceil(centerX + outerRadius));
  const minY = Math.max(0, Math.floor(centerY - outerRadius));
  const maxY = Math.min(height - 1, Math.ceil(centerY + outerRadius));
  let sum = 0;
  let count = 0;

  for (let y = minY; y <= maxY; y += 1) {
    const dy = y - centerY;
    const row = y * width;
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - centerX;
      const distSq = dx * dx + dy * dy;
      if (distSq < innerSq || distSq > outerSq) {
        continue;
      }
      const value = gray[row + x];
      if (!Number.isFinite(value)) {
        continue;
      }
      sum += value;
      count += 1;
    }
  }

  return count > 0 ? sum / count : Number.NaN;
}

function brightPeakCandidates(gray, width, height, mean, std, stars, options = {}) {
  const metricScale = Number.isFinite(options.metricScale) && options.metricScale > 0 ? options.metricScale : 1;
  const noiseFloor = Math.max(Math.abs(std), Math.abs(mean) * 0.001, 1e-6);
  const threshold = mean + noiseFloor * 8;
  const margin = 44;
  const candidates = [];

  for (let y = margin; y < height - margin; y += 1) {
    const row = y * width;
    for (let x = margin; x < width - margin; x += 1) {
      const index = row + x;
      const value = gray[index];
      if (!Number.isFinite(value) || value < threshold) {
        continue;
      }

      let isLocalMaximum = true;
      let hasLowerNeighbor = false;
      for (let dy = -1; dy <= 1; dy += 1) {
        const neighborRow = index + dy * width;
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          const neighbor = gray[neighborRow + dx];
          if (!Number.isFinite(neighbor)) {
            continue;
          }
          if (neighbor > value) {
            isLocalMaximum = false;
            break;
          }
          if (neighbor < value) {
            hasLowerNeighbor = true;
          }
        }
        if (!isLocalMaximum) {
          break;
        }
      }

      if (isLocalMaximum && hasLowerNeighbor) {
        candidates.push({
          x,
          y,
          peak: value,
          hfrWorking: 2.5
        });
      }
    }
  }

  for (const candidate of candidates) {
    let nearestStar = null;
    let nearestDistSq = 16;
    for (const star of stars) {
      const dx = star.x - candidate.x;
      const dy = star.y - candidate.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < nearestDistSq) {
        nearestDistSq = distSq;
        nearestStar = star;
      }
    }
    if (nearestStar && Number.isFinite(nearestStar.hfrPx) && nearestStar.hfrPx > 0) {
      candidate.hfrWorking = clamp(nearestStar.hfrPx / metricScale, 1.5, 8);
      candidate.roundness = nearestStar.roundness;
    }
  }

  const sorted = candidates.sort((a, b) => b.peak - a.peak);
  const selected = [];
  for (const candidate of sorted) {
    const separation = Math.max(10, candidate.hfrWorking * 4);
    const tooClose = selected.some((existing) => {
      const dx = existing.x - candidate.x;
      const dy = existing.y - candidate.y;
      return dx * dx + dy * dy < separation * separation;
    });
    if (!tooClose) {
      selected.push(candidate);
    }
    if (selected.length >= 50) {
      break;
    }
  }

  return selected;
}

function computeHaloWarning(gray, width, height, mean, std, stars, options = {}) {
  const candidates = brightPeakCandidates(gray, width, height, mean, std, stars, options);
  if (candidates.length === 0) {
    return {
      haloSeverity: "None",
      haloScore: 0,
      haloStarCount: 0,
      haloMeasuredStars: 0,
      haloSummary: "No bright halo candidates",
      haloMarkers: []
    };
  }

  const measurements = [];
  for (const candidate of candidates) {
    const coreRadius = clamp(candidate.hfrWorking || 2.5, 1.5, 8);
    const shoulderInner = clamp(coreRadius * 2.2, 4, 12);
    const shoulderOuter = clamp(coreRadius * 4.2, 7, 18);
    const haloInner = clamp(coreRadius * 5.2, 10, 22);
    const haloOuter = clamp(coreRadius * 12, 22, 42);
    const bgInner = haloOuter * 1.25;
    const bgOuter = haloOuter * 1.8;

    if (
      candidate.x < bgOuter ||
      candidate.y < bgOuter ||
      candidate.x > width - bgOuter ||
      candidate.y > height - bgOuter
    ) {
      continue;
    }

    const shoulderMean = annulusMean(gray, width, height, candidate.x, candidate.y, shoulderInner, shoulderOuter);
    const haloMean = annulusMean(gray, width, height, candidate.x, candidate.y, haloInner, haloOuter);
    const backgroundMean = annulusMean(gray, width, height, candidate.x, candidate.y, bgInner, bgOuter);
    if (!Number.isFinite(shoulderMean) || !Number.isFinite(haloMean) || !Number.isFinite(backgroundMean)) {
      continue;
    }

    const signal = candidate.peak - backgroundMean;
    const haloExcess = haloMean - backgroundMean;
    const shoulderExcess = shoulderMean - backgroundMean;
    if (signal <= 0 || haloExcess <= 0 || shoulderExcess <= 0) {
      continue;
    }

    const haloRatio = haloExcess / signal;
    const contrastFloor = Math.max(std * 0.16, Math.abs(backgroundMean) * 0.004, 1e-6);
    const haloContrast = haloExcess / contrastFloor;
    const extentRatio = haloExcess / shoulderExcess;
    const ratioScore = clamp((haloRatio - 0.008) / 0.04, 0, 1);
    const contrastScore = clamp((haloContrast - 1.5) / 5, 0, 1);
    const extentScore = clamp((extentRatio - 0.08) / 0.22, 0, 1);
    const haloScore = clamp(ratioScore * 0.52 + contrastScore * 0.3 + extentScore * 0.18, 0, 1);

    measurements.push({
      score: haloScore,
      haloRatio,
      haloContrast,
      extentRatio,
      x: candidate.x,
      y: candidate.y,
      radius: haloOuter
    });
  }

  if (measurements.length === 0) {
    return {
      haloSeverity: "None",
      haloScore: 0,
      haloStarCount: 0,
      haloMeasuredStars: 0,
      haloSummary: "No measurable bright-star halo",
      haloMarkers: []
    };
  }

  measurements.sort((a, b) => b.score - a.score);
  const strongest = measurements[0];
  const haloStars = measurements.filter((item) => item.score >= 0.48).length;
  const topCount = Math.min(5, measurements.length);
  const topAverage = measurements.slice(0, topCount).reduce((sum, item) => sum + item.score, 0) / topCount;
  let haloSeverity = "None";
  if (strongest.score >= 0.82 || (haloStars >= 3 && topAverage >= 0.58)) {
    haloSeverity = "Likely";
  } else if (strongest.score >= 0.58 || (haloStars >= 2 && topAverage >= 0.44)) {
    haloSeverity = "Possible";
  }

  const haloScore = clamp(strongest.score * 0.72 + topAverage * 0.28, 0, 1);
  const haloSummary =
    haloSeverity === "None"
      ? "No strong bright-star halo"
      : `${haloSeverity} halo around ${haloStars} bright ${haloStars === 1 ? "star" : "stars"}`;
  const haloMarkers =
    haloSeverity === "None"
      ? []
      : measurements
          .filter((item) => item.score >= 0.48)
          .slice(0, 8)
          .map((item) => ({
            x: clamp(item.x / width, 0, 1),
            y: clamp(item.y / height, 0, 1),
            radiusX: clamp(item.radius / width, 0.005, 0.25),
            radiusY: clamp(item.radius / height, 0.005, 0.25),
            score: item.score
          }));

  return {
    haloSeverity,
    haloScore,
    haloStarCount: haloStars,
    haloMeasuredStars: measurements.length,
    haloSummary,
    haloMarkers
  };
}

function emptyHaloWarning(summary = "Halo check skipped") {
  return {
    haloSeverity: "None",
    haloScore: 0,
    haloStarCount: 0,
    haloMeasuredStars: 0,
    haloSummary: summary,
    haloMarkers: []
  };
}

function skippedStarTrackingMetrics(summary = "Skipped for calibration frame") {
  return {
    starCount: 0,
    starRoundness: NaN,
    fwhmRoundness: NaN,
    axisRoundness: NaN,
    eccentricity: NaN,
    hfr: NaN,
    starSharpness: NaN,
    repeatDriftSource: "skipped",
    repeatDriftScore: 0,
    repeatedStarFraction: 0,
    multiRepeatFraction: 0,
    directionalTrailScore: 0,
    directionalTrailStarFraction: 0,
    directionalTrailStarCount: 0,
    trackingSampleStarCount: 0,
    trackingSampleRegion: "skipped",
    trackingScore: 0,
    trackingSeverity: "Skipped",
    trackingReason: summary,
    haloSeverity: "None",
    haloScore: 0,
    haloStarCount: 0,
    haloMeasuredStars: 0,
    haloSummary: summary,
    haloMarkers: [],
    starOverlay: {
      stars: [],
      repeatPairs: []
    }
  };
}

function normalizedStarFieldRadius(star, width, height) {
  const halfWidth = Math.max(width / 2, 1);
  const halfHeight = Math.max(height / 2, 1);
  const dx = (star.x - width / 2) / halfWidth;
  const dy = (star.y - height / 2) / halfHeight;
  return Math.sqrt(dx * dx + dy * dy);
}

function normalizedStarCornerAxes(star, width, height) {
  const halfWidth = Math.max(width / 2, 1);
  const halfHeight = Math.max(height / 2, 1);
  return {
    dx: Math.abs((star.x - width / 2) / halfWidth),
    dy: Math.abs((star.y - height / 2) / halfHeight)
  };
}

function starInCornerReferenceZone(star, width, height) {
  const radius = normalizedStarFieldRadius(star, width, height);
  const axes = normalizedStarCornerAxes(star, width, height);
  return (
    radius > trackingFallbackCentralFieldRadius &&
    axes.dx >= cornerReferenceAxisFraction &&
    axes.dy >= cornerReferenceAxisFraction
  );
}

function starLooksPoorInCorner(star, width, height) {
  if (!starInCornerReferenceZone(star, width, height)) {
    return false;
  }

  const roundness = Number.isFinite(star.roundness) ? star.roundness : 1;
  const fwhmRoundness = Number.isFinite(star.fwhmRoundness) ? star.fwhmRoundness : roundness;
  const axisRatio = Number.isFinite(star.axisRatio) ? star.axisRatio : 1;
  return (
    roundness < cornerReferenceRoundnessWarningLimit ||
    fwhmRoundness < cornerReferenceFwhmRoundnessWarningLimit ||
    axisRatio > cornerReferenceAxisRatioWarningLimit
  );
}

function trackingRegionLabel(radius) {
  if (!Number.isFinite(radius)) {
    return "unknown";
  }
  return `central ${Math.round(radius * 100)}% radius`;
}

function brightMediumStars(stars, minimumStars = trackingMinimumCentralStars) {
  if (stars.length <= minimumStars) {
    return stars;
  }

  const peaks = stars
    .map((star) => Number(star.peak))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (peaks.length < minimumStars) {
    return stars;
  }

  let peakFloor = percentileFromSorted(peaks, trackingMediumPeakPercentile);
  let filtered = stars.filter((star) => Number.isFinite(star.peak) && star.peak >= peakFloor);
  if (filtered.length >= minimumStars) {
    return filtered;
  }

  peakFloor = percentileFromSorted(peaks, 0.18);
  filtered = stars.filter((star) => Number.isFinite(star.peak) && star.peak >= peakFloor);
  return filtered.length >= minimumStars ? filtered : stars;
}

function guideSizedStars(stars, minimumStars = trackingMinimumCentralStars) {
  const hfrs = stars
    .map((star) => Number(star.hfrPx))
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => a - b);
  if (hfrs.length === 0) {
    return [];
  }

  const percentileFloor =
    hfrs.length > minimumStars ? percentileFromSorted(hfrs, trackingGuideStarHfrPercentile) : 0;
  const hfrFloor = Math.max(trackingMinimumGuideStarHfrPx, percentileFloor);
  const filtered = stars.filter((star) => Number.isFinite(star.hfrPx) && star.hfrPx >= hfrFloor);
  if (filtered.length >= minimumStars) {
    return filtered;
  }

  return stars.filter((star) => Number.isFinite(star.hfrPx) && star.hfrPx >= trackingMinimumGuideStarHfrPx);
}

function reliableGuideStars(stars, minimumStars = trackingMinimumCentralStars) {
  return brightMediumStars(guideSizedStars(stars, minimumStars), minimumStars);
}

function evenlySampleByBrightness(stars, limit) {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : stars.length;
  if (stars.length <= safeLimit) {
    return stars;
  }

  const sorted = [...stars].sort((a, b) => b.peak - a.peak);
  const selected = [];
  const selectedIds = new Set();
  const maxIndex = sorted.length - 1;
  for (let i = 0; i < safeLimit; i += 1) {
    const t = safeLimit <= 1 ? 0 : i / (safeLimit - 1);
    const index = Math.min(maxIndex, Math.floor(Math.pow(t, 1.45) * maxIndex));
    const star = sorted[index];
    if (!selectedIds.has(star.id)) {
      selected.push(star);
      selectedIds.add(star.id);
    }
  }

  for (const star of sorted) {
    if (selected.length >= safeLimit) {
      break;
    }
    if (!selectedIds.has(star.id)) {
      selected.push(star);
      selectedIds.add(star.id);
    }
  }

  return selected;
}

function selectStarsForTracking(stars, width, height, limit, options = {}) {
  const primaryRadius =
    Number.isFinite(options.centralRadius) && options.centralRadius > 0
      ? options.centralRadius
      : trackingCentralFieldRadius;
  const fallbackRadius =
    Number.isFinite(options.fallbackCentralRadius) && options.fallbackCentralRadius > primaryRadius
      ? options.fallbackCentralRadius
      : trackingFallbackCentralFieldRadius;
  const minimumStars =
    Number.isFinite(options.minimumStars) && options.minimumStars > 0
      ? Math.floor(options.minimumStars)
      : trackingMinimumCentralStars;
  const finiteStars = stars.filter(
    (star) =>
      Number.isFinite(star.x) &&
      Number.isFinite(star.y) &&
      Number.isFinite(star.peak) &&
      Number.isFinite(star.hfrPx) &&
      star.hfrPx > 0
  );
  const primary = finiteStars.filter((star) => normalizedStarFieldRadius(star, width, height) <= primaryRadius);
  const primaryGuideStars = reliableGuideStars(primary, minimumStars);
  if (primaryGuideStars.length >= minimumStars) {
    return {
      stars: evenlySampleByBrightness(primaryGuideStars, limit),
      candidateCount: primaryGuideStars.length,
      regionRadius: primaryRadius,
      regionLabel: trackingRegionLabel(primaryRadius)
    };
  }

  const fallback = finiteStars.filter((star) => normalizedStarFieldRadius(star, width, height) <= fallbackRadius);
  const fallbackGuideStars = reliableGuideStars(fallback, minimumStars);
  return {
    stars: evenlySampleByBrightness(fallbackGuideStars, limit),
    candidateCount: fallbackGuideStars.length,
    regionRadius: fallbackRadius,
    regionLabel: trackingRegionLabel(fallbackRadius)
  };
}

function measureWideTrailShape(gray, width, height, star, mean, std, options = {}) {
  const radius = Math.max(5, Math.floor(options.windowRadius || standardTrackingTrailWindowRadius));
  const metricScale = Number.isFinite(options.metricScale) && options.metricScale > 0 ? options.metricScale : 1;
  const peakSignal = Math.max((Number(star.peak) || 0) - mean, 0);
  if (peakSignal <= Math.max(std * 0.8, 1e-6)) {
    return null;
  }

  const floor = mean + Math.max(std * 0.45, peakSignal * 0.055);
  const centerX = Number(star.x);
  const centerY = Number(star.y);
  if (!Number.isFinite(centerX) || !Number.isFinite(centerY)) {
    return null;
  }

  const x0 = Math.max(1, Math.floor(centerX - radius));
  const x1 = Math.min(width - 2, Math.ceil(centerX + radius));
  const y0 = Math.max(1, Math.floor(centerY - radius));
  const y1 = Math.min(height - 2, Math.ceil(centerY + radius));
  const radiusSquared = radius * radius;
  const localWidth = x1 - x0 + 1;
  const localHeight = y1 - y0 + 1;
  const active = new Uint8Array(localWidth * localHeight);

  for (let ly = 0; ly < localHeight; ly += 1) {
    const y = y0 + ly;
    const dy = y - centerY;
    const row = y * width;
    for (let lx = 0; lx < localWidth; lx += 1) {
      const x = x0 + lx;
      const dx = x - centerX;
      if (dx * dx + dy * dy > radiusSquared) {
        continue;
      }
      const value = gray[row + x];
      if (Number.isFinite(value) && value > floor) {
        active[ly * localWidth + lx] = 1;
      }
    }
  }

  let startX = Math.max(0, Math.min(localWidth - 1, Math.round(centerX) - x0));
  let startY = Math.max(0, Math.min(localHeight - 1, Math.round(centerY) - y0));
  let startIndex = startY * localWidth + startX;
  if (!active[startIndex]) {
    let bestIndex = -1;
    let bestValue = -Infinity;
    for (let dy = -2; dy <= 2; dy += 1) {
      const ly = startY + dy;
      if (ly < 0 || ly >= localHeight) {
        continue;
      }
      for (let dx = -2; dx <= 2; dx += 1) {
        const lx = startX + dx;
        if (lx < 0 || lx >= localWidth) {
          continue;
        }
        const index = ly * localWidth + lx;
        if (!active[index]) {
          continue;
        }
        const value = gray[(y0 + ly) * width + x0 + lx];
        if (value > bestValue) {
          bestValue = value;
          bestIndex = index;
        }
      }
    }
    if (bestIndex < 0) {
      return null;
    }
    startIndex = bestIndex;
    startX = startIndex % localWidth;
    startY = Math.floor(startIndex / localWidth);
  }

  const visited = new Uint8Array(active.length);
  const stack = [startIndex];
  const component = [];
  visited[startIndex] = 1;
  while (stack.length > 0) {
    const index = stack.pop();
    component.push(index);
    const lx = index % localWidth;
    const ly = Math.floor(index / localWidth);
    for (let oy = -1; oy <= 1; oy += 1) {
      const ny = ly + oy;
      if (ny < 0 || ny >= localHeight) {
        continue;
      }
      for (let ox = -1; ox <= 1; ox += 1) {
        if (ox === 0 && oy === 0) {
          continue;
        }
        const nx = lx + ox;
        if (nx < 0 || nx >= localWidth) {
          continue;
        }
        const neighborIndex = ny * localWidth + nx;
        if (!active[neighborIndex] || visited[neighborIndex]) {
          continue;
        }
        visited[neighborIndex] = 1;
        stack.push(neighborIndex);
      }
    }
  }

  if (component.length < 4) {
    return null;
  }

  let weightSum = 0;
  let weightedX = 0;
  let weightedY = 0;

  for (const index of component) {
    const lx = index % localWidth;
    const ly = Math.floor(index / localWidth);
    const x = x0 + lx;
    const y = y0 + ly;
    const value = gray[y * width + x];
    const weight = value - floor;
    weightSum += weight;
    weightedX += weight * x;
    weightedY += weight * y;
  }

  if (weightSum < Math.max(peakSignal * 1.8, 1e-6)) {
    return null;
  }

  const cx = weightedX / weightSum;
  const cy = weightedY / weightSum;
  let mxx = 0;
  let myy = 0;
  let mxy = 0;

  for (const index of component) {
    const lx = index % localWidth;
    const ly = Math.floor(index / localWidth);
    const x = x0 + lx;
    const y = y0 + ly;
    const value = gray[y * width + x];
    const weight = value - floor;
    const sx = x - cx;
    const sy = y - cy;
    mxx += weight * sx * sx;
    myy += weight * sy * sy;
    mxy += weight * sx * sy;
  }

  mxx /= weightSum;
  myy /= weightSum;
  mxy /= weightSum;

  const trace = mxx + myy;
  const delta = Math.sqrt(Math.max((mxx - myy) * (mxx - myy) + 4 * mxy * mxy, 0));
  const major = (trace + delta) / 2;
  const minor = (trace - delta) / 2;
  if (major <= 1e-9 || minor <= 1e-9) {
    return null;
  }

  const angle = 0.5 * Math.atan2(2 * mxy, mxx - myy);
  const majorFwhmPx = 2.355 * Math.sqrt(Math.max(major, 1e-9)) * metricScale;
  const minorFwhmPx = 2.355 * Math.sqrt(Math.max(minor, 1e-9)) * metricScale;
  return {
    axisRatio: clamp(majorFwhmPx / Math.max(minorFwhmPx, 1e-6), 1, 12),
    angle,
    majorFwhmPx,
    minorFwhmPx
  };
}

function assignWideTrailShapes(gray, width, height, mean, std, stars, options = {}) {
  const selection = selectStarsForTracking(stars, width, height, options.starLimit, options);
  const trackingStars = selection.stars;
  for (const star of trackingStars) {
    const shape = measureWideTrailShape(gray, width, height, star, mean, std, options);
    if (!shape) {
      continue;
    }
    star.trailAxisRatio = shape.axisRatio;
    star.trailAngle = shape.angle;
    star.trailMajorFwhmPx = shape.majorFwhmPx;
    star.trailMinorFwhmPx = shape.minorFwhmPx;
  }
  return {
    stars: trackingStars,
    candidateCount: selection.candidateCount,
    regionRadius: selection.regionRadius,
    regionLabel: selection.regionLabel
  };
}

function starTrackingAxisRatio(star) {
  const coreRatio = Number.isFinite(star.axisRatio) ? star.axisRatio : 1;
  const trailRatio = Number.isFinite(star.trailAxisRatio) ? star.trailAxisRatio : 1;
  return Math.max(coreRatio, trailRatio);
}

function starTrackingAngle(star) {
  const coreRatio = Number.isFinite(star.axisRatio) ? star.axisRatio : 1;
  const trailRatio = Number.isFinite(star.trailAxisRatio) ? star.trailAxisRatio : 0;
  if (Number.isFinite(star.trailAngle) && trailRatio > coreRatio * 1.08) {
    return star.trailAngle;
  }
  return star.angle;
}

function starHasDirectionalTrailShape(star) {
  const axisRatio = starTrackingAxisRatio(star);
  const major = Number(star.trailMajorFwhmPx) || 0;
  const minor = Number(star.trailMinorFwhmPx) || 0;
  return axisRatio > 1.32 && major > Math.max(2.8, minor * 1.28) && major - minor > 0.85;
}

function starLooksElongated(star) {
  if (starHasDirectionalTrailShape(star)) {
    return true;
  }

  const coreRatio = Number.isFinite(star.axisRatio) ? star.axisRatio : 1;
  const roundness = Number.isFinite(star.roundness) ? star.roundness : 1;
  return coreRatio > 1.55 && roundness < 0.68;
}

function computeDirectionalTrailMetrics(trackingStars) {
  const usable = trackingStars.filter(
    (star) =>
      Number.isFinite(star.trailAxisRatio) &&
      Number.isFinite(star.trailAngle) &&
      Number.isFinite(star.trailMajorFwhmPx) &&
      Number.isFinite(star.trailMinorFwhmPx)
  );

  if (usable.length < 8) {
    return {
      score: 0,
      trailedStars: 0,
      usableStars: usable.length,
      trailedStarFraction: 0,
      meanAxisRatio: 1,
      orientationCoherence: 0,
      orientationAngle: null
    };
  }

  const trailed = usable.filter((star) => starHasDirectionalTrailShape(star));

  if (trailed.length === 0) {
    return {
      score: 0,
      trailedStars: 0,
      usableStars: usable.length,
      trailedStarFraction: 0,
      meanAxisRatio: 1,
      orientationCoherence: 0,
      orientationAngle: null
    };
  }

  let ratioSum = 0;
  let orientationX = 0;
  let orientationY = 0;
  let weightSum = 0;
  for (const star of trailed) {
    const axisRatio = starTrackingAxisRatio(star);
    const angle = starTrackingAngle(star);
    if (!Number.isFinite(angle)) {
      continue;
    }
    const major = Number(star.trailMajorFwhmPx) || 0;
    const minor = Number(star.trailMinorFwhmPx) || 0;
    const stretchWeight =
      clamp((axisRatio - 1.18) / 1.6, 0, 1) *
      clamp((major - minor) / Math.max(major * 0.45, 1), 0.25, 1);
    if (stretchWeight <= 0) {
      continue;
    }
    ratioSum += axisRatio * stretchWeight;
    orientationX += Math.cos(2 * angle) * stretchWeight;
    orientationY += Math.sin(2 * angle) * stretchWeight;
    weightSum += stretchWeight;
  }

  if (weightSum <= 0) {
    return {
      score: 0,
      trailedStars: trailed.length,
      usableStars: usable.length,
      trailedStarFraction: trailed.length / usable.length,
      meanAxisRatio: 1,
      orientationCoherence: 0,
      orientationAngle: null
    };
  }

  const meanAxisRatio = ratioSum / weightSum;
  const orientationCoherence = Math.sqrt(orientationX * orientationX + orientationY * orientationY) / weightSum;
  const orientationAngle = 0.5 * Math.atan2(orientationY, orientationX);
  const trailedStarFraction = trailed.length / usable.length;
  const countScore = clamp((trailed.length - 6) / 44, 0, 1);
  const fractionScore = clamp((trailedStarFraction - 0.025) / 0.18, 0, 1);
  const shapeScore = clamp((meanAxisRatio - 1.22) / 1.15, 0, 1);
  let score = clamp((countScore * 0.5 + fractionScore * 0.5) * orientationCoherence * shapeScore, 0, 1);

  if (trailed.length >= 16 && orientationCoherence > 0.7 && meanAxisRatio > 1.5) {
    score = Math.max(score, 0.18);
  }
  if (trailed.length >= 28 && orientationCoherence > 0.75 && meanAxisRatio > 1.65) {
    score = Math.max(score, 0.28);
  }

  return {
    score,
    trailedStars: trailed.length,
    usableStars: usable.length,
    trailedStarFraction,
    meanAxisRatio,
    orientationCoherence,
    orientationAngle
  };
}

function selectStarsForOverlay(stars, repeatedStarIds, limit, trackingStarIds = new Set(), trackingAlert = false) {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : stars.length;
  if (stars.length <= safeLimit) {
    return stars;
  }

  const priorityStars = [...stars].sort((a, b) => {
    const repeatedA = repeatedStarIds.has(a.id) ? 1 : 0;
    const repeatedB = repeatedStarIds.has(b.id) ? 1 : 0;
    if (repeatedA !== repeatedB) {
      return repeatedB - repeatedA;
    }

    const elongatedA = trackingAlert && trackingStarIds.has(a.id) && starLooksElongated(a) ? 1 : 0;
    const elongatedB = trackingAlert && trackingStarIds.has(b.id) && starLooksElongated(b) ? 1 : 0;
    if (elongatedA !== elongatedB) {
      return elongatedB - elongatedA;
    }

    return b.peak - a.peak;
  });

  return priorityStars.slice(0, safeLimit).sort((a, b) => a.id - b.id);
}

function mergeUniqueStars(...groups) {
  const merged = [];
  const seen = new Set();
  for (const group of groups) {
    for (const star of group || []) {
      if (!star || seen.has(star.id)) {
        continue;
      }
      seen.add(star.id);
      merged.push(star);
    }
  }
  return merged;
}

function selectStarsForFullFieldOverlay(stars, trackingStars, repeatedStarIds, limit, trackingStarIds, trackingAlert) {
  const fullFieldGuideStars = reliableGuideStars(stars, trackingMinimumCentralStars);
  const overlayPool = mergeUniqueStars(trackingStars, fullFieldGuideStars);
  return selectStarsForOverlay(overlayPool, repeatedStarIds, limit, trackingStarIds, trackingAlert);
}

function computeStarRoundnessAndTracking(gray, width, height, mean, std, options = {}) {
  const metricScale = Number.isFinite(options.metricScale) && options.metricScale > 0 ? options.metricScale : 1;
  const repeatDistanceScale =
    Number.isFinite(options.repeatDistanceScale) && options.repeatDistanceScale > 0 ? options.repeatDistanceScale : 1;
  const saturationThreshold =
    Number.isFinite(options.saturationThreshold) && options.saturationThreshold > 0
      ? options.saturationThreshold
      : Number.POSITIVE_INFINITY;
  const haloEnabled = options.haloEnabled !== false;
  const repeatDriftMaxPairs =
    Number.isFinite(options.repeatDriftMaxPairs) && options.repeatDriftMaxPairs > 0
      ? options.repeatDriftMaxPairs
      : standardRepeatDriftMaxPairs;
  const repeatDriftBrightStarLimit =
    Number.isFinite(options.repeatDriftBrightStarLimit) && options.repeatDriftBrightStarLimit > 0
      ? Math.floor(options.repeatDriftBrightStarLimit)
      : standardRepeatDriftBrightStarLimit;
  const starOverlayLimit =
    Number.isFinite(options.starOverlayLimit) && options.starOverlayLimit > 0
      ? Math.floor(options.starOverlayLimit)
      : Number.POSITIVE_INFINITY;
  const trackingTrailStarLimit =
    Number.isFinite(options.trackingTrailStarLimit) && options.trackingTrailStarLimit > 0
      ? Math.floor(options.trackingTrailStarLimit)
      : standardTrackingTrailStarLimit;
  const trackingTrailWindowRadius =
    Number.isFinite(options.trackingTrailWindowRadius) && options.trackingTrailWindowRadius > 0
      ? Math.floor(options.trackingTrailWindowRadius)
      : standardTrackingTrailWindowRadius;
  const threshold = mean + std * 1.8;
  const radius = 2;
  const stars = [];

  for (let y = radius; y < height - radius; y += 1) {
    const row = y * width;
    for (let x = radius; x < width - radius; x += 1) {
      const i = row + x;
      const value = gray[i];
      if (!Number.isFinite(value) || value < threshold || value >= saturationThreshold) {
        continue;
      }

      if (
        value <= gray[i - width - 1] ||
        value <= gray[i - width] ||
        value <= gray[i - width + 1] ||
        value <= gray[i - 1] ||
        value <= gray[i + 1] ||
        value <= gray[i + width - 1] ||
        value <= gray[i + width] ||
        value <= gray[i + width + 1]
      ) {
        continue;
      }

      let sumWeight = 0;
      let sumX = 0;
      let sumY = 0;
      for (let wy = -radius; wy <= radius; wy += 1) {
        const base = i + wy * width;
        for (let wx = -radius; wx <= radius; wx += 1) {
          const sample = gray[base + wx];
          if (!Number.isFinite(sample)) {
            continue;
          }
          const weight = sample - mean;
          if (weight <= 0) {
            continue;
          }
          sumWeight += weight;
          sumX += weight * wx;
          sumY += weight * wy;
        }
      }

      if (sumWeight < 1e-6) {
        continue;
      }

      const centerX = sumX / sumWeight;
      const centerY = sumY / sumWeight;
      let mxx = 0;
      let myy = 0;
      let mxy = 0;

      for (let wy = -radius; wy <= radius; wy += 1) {
        const base = i + wy * width;
        for (let wx = -radius; wx <= radius; wx += 1) {
          const sample = gray[base + wx];
          if (!Number.isFinite(sample)) {
            continue;
          }
          const weight = sample - mean;
          if (weight <= 0) {
            continue;
          }
          const dx = wx - centerX;
          const dy = wy - centerY;
          mxx += weight * dx * dx;
          myy += weight * dy * dy;
          mxy += weight * dx * dy;
        }
      }

      mxx /= sumWeight;
      myy /= sumWeight;
      mxy /= sumWeight;

      const trace = mxx + myy;
      const delta = Math.sqrt(Math.max((mxx - myy) * (mxx - myy) + 4 * mxy * mxy, 0));
      const major = (trace + delta) / 2;
      const minor = (trace - delta) / 2;
      if (major <= 1e-9 || minor <= 0) {
        continue;
      }

      const angle = 0.5 * Math.atan2(2 * mxy, mxx - myy);
      const axisRoundness = clamp(Math.sqrt(minor / major), 0, 1);
      const majorAxisX = Math.cos(angle);
      const majorAxisY = Math.sin(angle);
      const minorAxisX = -majorAxisY;
      const minorAxisY = majorAxisX;

      const fwhmMajor = measureAxisFwhm(gray, width, height, x + centerX, y + centerY, majorAxisX, majorAxisY, value, mean);
      const fwhmMinor = measureAxisFwhm(gray, width, height, x + centerX, y + centerY, minorAxisX, minorAxisY, value, mean);

      let fwhmRoundness = axisRoundness;
      let axisRatio = Math.sqrt(major / minor);
      let majorFwhmPx = 2.355 * Math.sqrt(Math.max(major, 1e-9)) * metricScale;
      let minorFwhmPx = 2.355 * Math.sqrt(Math.max(minor, 1e-9)) * metricScale;
      if (fwhmMajor !== null && fwhmMinor !== null && fwhmMajor > 0.2 && fwhmMinor > 0.2) {
        const majorFwhm = Math.max(fwhmMajor, fwhmMinor);
        const minorFwhm = Math.min(fwhmMajor, fwhmMinor);
        fwhmRoundness = clamp(minorFwhm / majorFwhm, 0, 1);
        axisRatio = majorFwhm / minorFwhm;
        majorFwhmPx = majorFwhm * metricScale;
        minorFwhmPx = minorFwhm * metricScale;
      }

      const hfrPx = Math.sqrt(Math.max(majorFwhmPx * minorFwhmPx, 0)) / 2;
      const roundness = clamp(fwhmRoundness * 0.75 + axisRoundness * 0.25, 0, 1);
      const centerAbsX = x + centerX;
      const centerAbsY = y + centerY;
      stars.push({
        id: stars.length,
        axisRatio,
        roundness,
        axisRoundness,
        fwhmRoundness,
        majorFwhmPx,
        minorFwhmPx,
        hfrPx,
        angle,
        x: centerAbsX,
        y: centerAbsY,
        peak: value
      });
    }
  }

  if (stars.length === 0) {
    const haloMetrics = haloEnabled
      ? computeHaloWarning(gray, width, height, mean, std, stars, {
          metricScale,
          saturationThreshold
        })
      : emptyHaloWarning();
    return {
      starCount: 0,
      starRoundness: 0.5,
      fwhmRoundness: 0.5,
      axisRoundness: 0.5,
      eccentricity: 0,
      hfr: 0,
      starSharpness: 0,
      repeatDriftSource: "central-stars",
      repeatDriftScore: 0,
      repeatedStarFraction: 0,
      multiRepeatFraction: 0,
      directionalTrailScore: 0,
      directionalTrailStarFraction: 0,
      directionalTrailStarCount: 0,
      trackingSampleStarCount: 0,
      trackingSampleRegion: "none",
      trackingScore: 0,
      trackingSeverity: "Low confidence",
      trackingReason: "Low confidence",
      haloSeverity: haloMetrics.haloSeverity,
      haloScore: haloMetrics.haloScore,
      haloStarCount: haloMetrics.haloStarCount,
      haloMeasuredStars: haloMetrics.haloMeasuredStars,
      haloSummary: haloMetrics.haloSummary,
      haloMarkers: haloMetrics.haloMarkers,
      starOverlay: {
        stars: [],
        repeatPairs: []
      }
    };
  }

  let roundnessSum = 0;
  let fwhmRoundnessSum = 0;
  let axisRoundnessSum = 0;
  for (const star of stars) {
    roundnessSum += star.roundness;
    fwhmRoundnessSum += star.fwhmRoundness;
    axisRoundnessSum += star.axisRoundness;
  }
  const starRoundness = roundnessSum / stars.length;
  const fwhmRoundness = fwhmRoundnessSum / stars.length;
  const axisRoundness = axisRoundnessSum / stars.length;
  const eccentricityList = stars
    .map((star) => Math.sqrt(clamp(1 - 1 / Math.max(star.axisRatio * star.axisRatio, 1e-9), 0, 1)))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  const hfrList = stars
    .map((star) => star.hfrPx)
    .filter((value) => Number.isFinite(value) && value > 0.05)
    .sort((a, b) => a - b);
  const eccentricity = eccentricityList.length > 0 ? percentileFromSorted(eccentricityList, 0.5) : 0;
  const hfr = hfrList.length > 0 ? percentileFromSorted(hfrList, 0.5) : 0;
  const majorFwhmList = stars
    .map((star) => star.majorFwhmPx)
    .filter((value) => Number.isFinite(value) && value > 0.05)
    .sort((a, b) => a - b);
  const medianMajorFwhm =
    majorFwhmList.length > 0 ? percentileFromSorted(majorFwhmList, 0.5) : Number.POSITIVE_INFINITY;
  const p35MajorFwhm =
    majorFwhmList.length > 0 ? percentileFromSorted(majorFwhmList, 0.35) : Number.POSITIVE_INFINITY;
  const starSharpness =
    Number.isFinite(medianMajorFwhm) && Number.isFinite(p35MajorFwhm)
      ? 1 / Math.max(medianMajorFwhm * 0.8 + p35MajorFwhm * 0.2, 0.2)
      : 0;

  const trackingSelection = assignWideTrailShapes(gray, width, height, mean, std, stars, {
    metricScale,
    windowRadius: trackingTrailWindowRadius,
    starLimit: trackingTrailStarLimit,
    centralRadius: trackingCentralFieldRadius,
    fallbackCentralRadius: trackingFallbackCentralFieldRadius,
    minimumStars: trackingMinimumCentralStars
  });
  const trackingStars = trackingSelection.stars;
  const directionalTrail = computeDirectionalTrailMetrics(trackingStars);
  const elongated = trackingStars.filter((star) => starTrackingAxisRatio(star) > 1.2);
  let meanAxisRatio = 1;
  let orientationCoherence = 0;
  let orientationAngle = null;

  if (elongated.length > 0) {
    let axisRatioSum = 0;
    let orientationX = 0;
    let orientationY = 0;
    for (const star of elongated) {
      const axisRatio = starTrackingAxisRatio(star);
      const angle = starTrackingAngle(star);
      axisRatioSum += axisRatio;
      if (Number.isFinite(angle)) {
        orientationX += Math.cos(2 * angle);
        orientationY += Math.sin(2 * angle);
      }
    }
    meanAxisRatio = axisRatioSum / elongated.length;
    orientationCoherence = Math.sqrt(orientationX * orientationX + orientationY * orientationY) / elongated.length;
    if (orientationCoherence > 0) {
      orientationAngle = 0.5 * Math.atan2(orientationY, orientationX);
    }
  }

  const elongatedFraction = elongated.length / Math.max(trackingStars.length, 1);
  const shapeFactor = clamp((meanAxisRatio - 1) / 1.4, 0, 1);
  const coreTrailingScore = elongatedFraction * orientationCoherence * shapeFactor;
  const trailingScore = Math.max(coreTrailingScore, directionalTrail.score);
  const strongestTrailAngle =
    directionalTrail.score > coreTrailingScore && directionalTrail.orientationAngle !== null
      ? directionalTrail.orientationAngle
      : orientationAngle;
  const strongestTrailCoherence = Math.max(orientationCoherence, directionalTrail.orientationCoherence || 0);
  const preferredRepeatAngle =
    strongestTrailAngle !== null && strongestTrailCoherence > 0.5 && elongated.length >= 10
      ? strongestTrailAngle
      : null;
  const repeatDriftAll = computeCloseRepeatDrift(trackingStars, preferredRepeatAngle, 0.45, repeatDistanceScale, {
    maxPairs: repeatDriftMaxPairs
  });
  let repeatDrift = repeatDriftAll;
  let repeatDriftSource = "central-stars";

  if (trackingStars.length >= 800) {
    const brightStars = [...trackingStars]
      .sort((a, b) => b.peak - a.peak)
      .slice(0, Math.min(repeatDriftBrightStarLimit, trackingStars.length));
    const repeatDriftBright = computeCloseRepeatDrift(brightStars, preferredRepeatAngle, 0.05, repeatDistanceScale, {
      maxPairs: repeatDriftMaxPairs
    });

    const brightLooksReliable =
      repeatDriftBright.repeatedStarFraction > 0.14 &&
      repeatDriftBright.multiRepeatFraction > 0.03 &&
      repeatDriftBright.alignmentCoherence > 0.45;
    const brightIsClearlyStronger =
      repeatDriftBright.repeatScore > repeatDrift.repeatScore + 0.03 ||
      repeatDriftBright.repeatScore > repeatDrift.repeatScore * 1.25;

    if (brightLooksReliable && brightIsClearlyStronger) {
      repeatDrift = repeatDriftBright;
      repeatDriftSource = "central-bright-stars";
    }
  }

  const repeatScore = repeatDrift.repeatScore;
  const trackingScore = clamp(
    trailingScore * 0.65 + repeatScore * 0.7 + Math.min(trailingScore, repeatScore) * 0.35,
    0,
  1
  );

  let trackingSeverity = "None";
  let trackingReason = "None";
  const severeByCoreTrail =
    coreTrailingScore > 0.30 &&
    elongatedFraction > 0.35 &&
    meanAxisRatio > 1.35 &&
    orientationCoherence > 0.72;
  const possibleByCoreTrail =
    coreTrailingScore > 0.16 &&
    elongatedFraction > 0.22 &&
    meanAxisRatio > 1.2 &&
    orientationCoherence > 0.58;
  const severeByWideTrail =
    directionalTrail.score > 0.2 &&
    directionalTrail.trailedStars >= 18 &&
    directionalTrail.meanAxisRatio > 1.5 &&
    directionalTrail.orientationCoherence > 0.68;
  const possibleByWideTrail =
    directionalTrail.score > 0.075 &&
    directionalTrail.trailedStars >= 10 &&
    directionalTrail.meanAxisRatio > 1.34 &&
    directionalTrail.orientationCoherence > 0.56;
  const severeByTrail = severeByCoreTrail || severeByWideTrail;
  const possibleByTrail = possibleByCoreTrail || possibleByWideTrail;
  const severeByRepeat =
    repeatScore > 0.23 &&
    repeatDrift.repeatedStarFraction > 0.22 &&
    repeatDrift.multiRepeatFraction > 0.07 &&
    repeatDrift.alignmentCoherence > 0.62;
  const possibleByRepeat =
    repeatScore > 0.09 &&
    repeatDrift.repeatedStarFraction > 0.12 &&
    repeatDrift.alignmentCoherence > 0.48;

  if (trackingStars.length < 12) {
    trackingSeverity = "Low confidence";
    trackingReason = "Low confidence";
  } else if (severeByTrail || severeByRepeat) {
    trackingSeverity = "Severe";
    if (severeByTrail && severeByRepeat) {
      trackingReason = "Trailing + Repeat drift";
    } else if (severeByRepeat) {
      trackingReason = "Repeat drift";
    } else {
      trackingReason = "Trailing";
    }
  } else if (possibleByTrail || possibleByRepeat) {
    trackingSeverity = "Possible";
    if (possibleByTrail && possibleByRepeat) {
      trackingReason = "Trailing + Repeat drift";
    } else if (possibleByRepeat) {
      trackingReason = "Repeat drift";
    } else {
      trackingReason = "Trailing";
    }
  }

  const haloMetrics = haloEnabled
    ? computeHaloWarning(gray, width, height, mean, std, stars, {
        metricScale,
        saturationThreshold
      })
    : emptyHaloWarning();
  const repeatedStarIds = new Set(repeatDrift.repeatStarIndexes || []);
  const trackingStarIds = new Set(trackingStars.map((star) => star.id));
  const trackingAlert = trackingSeverity === "Possible" || trackingSeverity === "Severe";
  const overlayStars = selectStarsForFullFieldOverlay(
    stars,
    trackingStars,
    repeatedStarIds,
    starOverlayLimit,
    trackingStarIds,
    trackingAlert
  );
  const overlayStarIds = new Set(overlayStars.map((star) => star.id));
  const starOverlay = {
    stars: overlayStars.map((star) => ({
      id: star.id,
      x: clamp(star.x / width, 0, 1),
      y: clamp(star.y / height, 0, 1),
      hfr: star.hfrPx,
      majorFwhm: star.majorFwhmPx,
      minorFwhm: star.minorFwhmPx,
      trailAxisRatio: star.trailAxisRatio,
      trailMajorFwhm: star.trailMajorFwhmPx,
      trailMinorFwhm: star.trailMinorFwhmPx,
      roundness: star.roundness,
      axisRatio: starTrackingAxisRatio(star),
      angle: starTrackingAngle(star),
      trackingSample: trackingStarIds.has(star.id),
      elongated: trackingAlert && trackingStarIds.has(star.id) && starLooksElongated(star),
      cornerIssue: !trackingStarIds.has(star.id) && starLooksPoorInCorner(star, width, height),
      repeated: repeatedStarIds.has(star.id)
    })),
    repeatPairs: (repeatDrift.repeatPairs || []).filter(
      (pair) => overlayStarIds.has(pair.a) && overlayStarIds.has(pair.b)
    )
  };

  return {
    starCount: stars.length,
    starRoundness,
    fwhmRoundness,
    axisRoundness,
    eccentricity,
    hfr,
    starSharpness,
    repeatDriftSource,
    repeatDriftScore: repeatScore,
    repeatedStarFraction: repeatDrift.repeatedStarFraction,
    multiRepeatFraction: repeatDrift.multiRepeatFraction,
    directionalTrailScore: directionalTrail.score,
    directionalTrailStarFraction: directionalTrail.trailedStarFraction,
    directionalTrailStarCount: directionalTrail.trailedStars,
    trackingSampleStarCount: trackingStars.length,
    trackingSampleRegion: trackingSelection.regionLabel,
    trackingScore,
    trackingSeverity,
    trackingReason,
    haloSeverity: haloMetrics.haloSeverity,
    haloScore: haloMetrics.haloScore,
    haloStarCount: haloMetrics.haloStarCount,
    haloMeasuredStars: haloMetrics.haloMeasuredStars,
    haloSummary: haloMetrics.haloSummary,
    haloMarkers: haloMetrics.haloMarkers,
    starOverlay
  };
}

function computeHighlightClipping(gray, clippingThreshold = bitmapClippingThreshold, nearSaturationThreshold = null) {
  let clippedHighlights = 0;
  let nearSaturatedHighlights = 0;
  let finitePixels = 0;
  const hardThreshold = Number.isFinite(clippingThreshold) ? clippingThreshold : Number.POSITIVE_INFINITY;
  const nearThreshold = Number.isFinite(nearSaturationThreshold)
    ? Math.min(nearSaturationThreshold, hardThreshold)
    : hardThreshold;

  for (let i = 0; i < gray.length; i += 1) {
    if (!Number.isFinite(gray[i])) {
      continue;
    }
    finitePixels += 1;
    if (gray[i] >= hardThreshold) {
      clippedHighlights += 1;
    }
    if (gray[i] >= nearThreshold) {
      nearSaturatedHighlights += 1;
    }
  }

  return clippingStatsFromCounts(finitePixels, clippedHighlights, nearSaturatedHighlights);
}

function computeDistributionStats(gray, mean, std, saturationLevel, maxSamples = standardDistributionMaxSamples) {
  const finiteSample = [];
  const sampleLimit =
    Number.isFinite(maxSamples) && maxSamples > 0 ? Math.max(1, Math.floor(maxSamples)) : gray.length;
  const step = Math.max(1, Math.floor(gray.length / sampleLimit));

  for (let i = 0; i < gray.length; i += step) {
    const value = gray[i];
    if (Number.isFinite(value)) {
      finiteSample.push(value);
    }
    if (finiteSample.length >= sampleLimit) {
      break;
    }
  }

  if (finiteSample.length === 0) {
    return {
      p01: NaN,
      median: NaN,
      p99: NaN,
      meanPercent: NaN,
      medianPercent: NaN,
      spreadPercent: NaN,
      noisePercent: NaN
    };
  }

  finiteSample.sort((a, b) => a - b);
  const p01 = percentileFromSorted(finiteSample, 0.01);
  const median = percentileFromSorted(finiteSample, 0.5);
  const p99 = percentileFromSorted(finiteSample, 0.99);
  const level =
    Number.isFinite(saturationLevel) && saturationLevel > 0
      ? saturationLevel
      : Number.isFinite(p99) && p99 > 0
        ? p99
        : NaN;
  const percent = (value) => (Number.isFinite(level) && level > 0 ? (value / level) * 100 : NaN);

  return {
    p01,
    median,
    p99,
    meanPercent: percent(mean),
    medianPercent: percent(median),
    spreadPercent: Number.isFinite(level) && level > 0 ? ((p99 - p01) / level) * 100 : NaN,
    noisePercent: Number.isFinite(mean) && Math.abs(mean) > 1e-9 ? (std / Math.abs(mean)) * 100 : NaN
  };
}

function computeLevelHistogram(values, saturationLevel, binCount = 72, maxSamples = standardDistributionMaxSamples) {
  if (!Number.isFinite(saturationLevel) || saturationLevel <= 0 || !values || values.length === 0) {
    return null;
  }

  const bins = Array.from({ length: binCount }, () => 0);
  const sampleLimit =
    Number.isFinite(maxSamples) && maxSamples > 0 ? Math.max(1, Math.floor(maxSamples)) : values.length;
  const step = Math.max(1, Math.floor(values.length / sampleLimit));
  let samples = 0;

  for (let i = 0; i < values.length; i += step) {
    const value = values[i];
    if (!Number.isFinite(value)) {
      continue;
    }
    const percent = clamp(value / saturationLevel, 0, 0.999999);
    bins[Math.floor(percent * binCount)] += 1;
    samples += 1;
    if (samples >= sampleLimit) {
      break;
    }
  }

  const peak = Math.max(...bins, 1);
  const total = Math.max(samples, 1);
  return {
    bins: bins.map((count) => count / peak),
    probabilityBins: bins.map((count) => count / total),
    samples
  };
}

function computeCloudStructureMetrics(gray, width, height, mean, std, options = {}) {
  const cols = 16;
  const rows = 12;
  const tileSampleTarget =
    Number.isFinite(options.tileSampleTarget) && options.tileSampleTarget > 0
      ? options.tileSampleTarget
      : standardCloudTileSamples;
  const tileMedians = [];
  const rowBuckets = Array.from({ length: rows }, () => []);
  const colBuckets = Array.from({ length: cols }, () => []);

  for (let row = 0; row < rows; row += 1) {
    const y0 = Math.floor((row * height) / rows);
    const y1 = Math.max(y0 + 1, Math.floor(((row + 1) * height) / rows));
    for (let col = 0; col < cols; col += 1) {
      const x0 = Math.floor((col * width) / cols);
      const x1 = Math.max(x0 + 1, Math.floor(((col + 1) * width) / cols));
      const tileWidth = Math.max(1, x1 - x0);
      const tileHeight = Math.max(1, y1 - y0);
      const sampleStep = Math.max(1, Math.floor(Math.sqrt((tileWidth * tileHeight) / tileSampleTarget)));
      const samples = [];

      for (let y = y0; y < y1; y += sampleStep) {
        const offset = y * width;
        for (let x = x0; x < x1; x += sampleStep) {
          const value = gray[offset + x];
          if (Number.isFinite(value)) {
            samples.push(value);
          }
        }
      }

      if (samples.length < 12) {
        continue;
      }
      samples.sort((a, b) => a - b);
      const median = percentileFromSorted(samples, 0.5);
      if (!Number.isFinite(median)) {
        continue;
      }
      tileMedians.push({ row, col, value: median });
      rowBuckets[row].push(median);
      colBuckets[col].push(median);
    }
  }

  if (tileMedians.length < 24) {
    return {
      cloudStructureScore: 0,
      cloudBackgroundRangePercent: 0,
      cloudBackgroundRange: 0,
      cloudStripRangePercent: 0,
      cloudSmoothness: 0,
      tileSignature: []
    };
  }

  const sortedTiles = tileMedians.map((tile) => tile.value).sort((a, b) => a - b);
  const p10 = percentileFromSorted(sortedTiles, 0.1);
  const median = percentileFromSorted(sortedTiles, 0.5);
  const p90 = percentileFromSorted(sortedTiles, 0.9);
  const range = Math.max(p90 - p10, 0);
  const denominator = Math.max(Math.abs(median), Math.abs(mean), std * 3, 1e-6);
  const rangePercent = (range / denominator) * 100;

  const summarizeBuckets = (buckets) =>
    buckets
      .map((values) => {
        if (values.length === 0) {
          return Number.NaN;
        }
        const sorted = [...values].sort((a, b) => a - b);
        return percentileFromSorted(sorted, 0.5);
      })
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b);
  const rowSummary = summarizeBuckets(rowBuckets);
  const colSummary = summarizeBuckets(colBuckets);
  const rowRange = rowSummary.length > 1 ? percentileFromSorted(rowSummary, 0.9) - percentileFromSorted(rowSummary, 0.1) : 0;
  const colRange = colSummary.length > 1 ? percentileFromSorted(colSummary, 0.9) - percentileFromSorted(colSummary, 0.1) : 0;
  const stripRangePercent = (Math.max(rowRange, colRange, 0) / denominator) * 100;

  const tileMap = new Map(tileMedians.map((tile) => [`${tile.row},${tile.col}`, tile.value]));
  const neighborDiffs = [];
  for (const tile of tileMedians) {
    const right = tileMap.get(`${tile.row},${tile.col + 1}`);
    const down = tileMap.get(`${tile.row + 1},${tile.col}`);
    if (Number.isFinite(right)) {
      neighborDiffs.push(Math.abs(right - tile.value));
    }
    if (Number.isFinite(down)) {
      neighborDiffs.push(Math.abs(down - tile.value));
    }
  }
  neighborDiffs.sort((a, b) => a - b);
  const neighborMedian = neighborDiffs.length > 0 ? percentileFromSorted(neighborDiffs, 0.5) : 0;
  const smoothness = range > 1e-9 ? clamp(1 - neighborMedian / (range * 0.55), 0, 1) : 0;
  const rangeScore = clamp((rangePercent - 3.5) / 18, 0, 1);
  const stripScore = clamp((stripRangePercent - 2.8) / 14, 0, 1);
  const smoothScore = rangeScore * smoothness;
  const cloudStructureScore = clamp(rangeScore * 0.48 + stripScore * 0.34 + smoothScore * 0.18, 0, 1);
  const tileSignature = Array.from({ length: rows * cols }, () => NaN);
  for (const tile of tileMedians) {
    tileSignature[tile.row * cols + tile.col] = ((tile.value - median) / denominator) * 100;
  }

  return {
    cloudStructureScore,
    cloudBackgroundRangePercent: rangePercent,
    cloudBackgroundRange: range,
    cloudStripRangePercent: stripRangePercent,
    cloudSmoothness: smoothness,
    tileSignature
  };
}

function computeCalibrationOutlierMetrics(gray, distribution, mean, std) {
  const median = distribution.median;
  const p01 = distribution.p01;
  const p99 = distribution.p99;
  if (!Number.isFinite(median)) {
    return {
      brightOutlierPercent: 0,
      darkOutlierPercent: 0,
      brightOutlierThreshold: NaN,
      darkOutlierThreshold: NaN
    };
  }

  const robustSigma =
    Number.isFinite(p01) && Number.isFinite(p99) && p99 > p01
      ? Math.max((p99 - p01) / 4.65, Math.abs(median) * 0.0005, Math.abs(mean) * 0.0005, 1e-6)
      : Math.max(Number.isFinite(std) ? std : 0, Math.abs(median) * 0.0005, 1e-6);
  const outlierWidth = Math.max(robustSigma * 8, Math.abs(median) * 0.015, Math.abs(mean) * 0.015, 1e-6);
  const brightOutlierThreshold = median + outlierWidth;
  const darkOutlierThreshold = median - outlierWidth;
  let finitePixels = 0;
  let brightOutliers = 0;
  let darkOutliers = 0;

  for (let i = 0; i < gray.length; i += 1) {
    const value = gray[i];
    if (!Number.isFinite(value)) {
      continue;
    }
    finitePixels += 1;
    if (value > brightOutlierThreshold) {
      brightOutliers += 1;
    } else if (value < darkOutlierThreshold) {
      darkOutliers += 1;
    }
  }

  return {
    brightOutlierPercent: finitePixels > 0 ? (brightOutliers / finitePixels) * 100 : 0,
    darkOutlierPercent: finitePixels > 0 ? (darkOutliers / finitePixels) * 100 : 0,
    brightOutlierThreshold,
    darkOutlierThreshold
  };
}

function scoreNear(value, target, tolerance, fallback = 0.7) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return clamp(1 - Math.abs(value - target) / tolerance, 0, 1);
}

function scoreBelow(value, goodLimit, badLimit, fallback = 0.75) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  if (value <= goodLimit) {
    return 1;
  }
  if (value >= badLimit) {
    return 0;
  }
  return clamp(1 - (value - goodLimit) / (badLimit - goodLimit), 0, 1);
}

function addCalibrationWarning(result, severity, text) {
  if (!result.calibrationWarnings.includes(text)) {
    if (severity === "Severe") {
      result.calibrationWarnings.unshift(text);
    } else {
      result.calibrationWarnings.push(text);
    }
  }
  if (severity === "Severe" || result.calibrationSeverity !== "Severe") {
    result.calibrationSeverity = severity;
  }
}

function calibrationLabel(result) {
  if (!isCalibrationFrame(result)) {
    return "Light analysis";
  }
  if (result.calibrationWarnings.length === 0) {
    return `${result.frameType} OK`;
  }
  return result.calibrationWarnings[0];
}

function computeCalibrationScore(result) {
  result.calibrationWarnings = [];
  result.calibrationSeverity = "None";

  const medianPct = result.medianPercent;
  const spreadPct = result.spreadPercent;
  const clipping = result.clipping;
  const hotPixelPct = Number(result.calibrationBrightOutlierPercent) || 0;
  const darkOutlierPct = Number(result.calibrationDarkOutlierPercent) || 0;
  const backgroundRangePct = Number(result.calibrationBackgroundRangePercent) || 0;
  const structureScoreValue = Number(result.calibrationStructureScore) || 0;
  let score = 0.7;
  let components = [scoreComponent("Calibration", score, 100, 100, "Fallback score")];

  if (result.frameType === "Flat") {
    const levelScore = scoreNear(medianPct, 50, 35);
    const saturationScore = scoreBelow(clipping, 0.02, 0.5);
    const uniformityScore = scoreBelow(spreadPct, 35, 85);
    const gradientScore = scoreBelow(backgroundRangePct, 25, 55, 0.85);
    const outlierScore = scoreBelow(hotPixelPct + darkOutlierPct, 0.8, 6, 0.85);
    score =
      levelScore * 0.43 +
      saturationScore * 0.24 +
      uniformityScore * 0.15 +
      gradientScore * 0.1 +
      outlierScore * 0.08;
    components = [
      scoreComponent("Flat Level", levelScore, 43, 100, `${formatMetric(medianPct, 1)}% median`),
      scoreComponent("Saturation", saturationScore, 24, 100, `${formatMetric(clipping, 3)}% saturated`),
      scoreComponent("Uniformity", uniformityScore, 15, 100, `${formatMetric(spreadPct, 1)}% spread`),
      scoreComponent("Gradient", gradientScore, 10, 100, `${formatMetric(backgroundRangePct, 1)}% range`),
      scoreComponent("Outliers", outlierScore, 8, 100, `${formatMetric(hotPixelPct + darkOutlierPct, 2)}% pixels`)
    ];

    if (Number.isFinite(medianPct) && medianPct < 20) {
      addCalibrationWarning(result, "Severe", "Flat too dark");
    } else if (Number.isFinite(medianPct) && medianPct < 35) {
      addCalibrationWarning(result, "Possible", "Flat below histogram target");
    } else if (Number.isFinite(medianPct) && medianPct > 80) {
      addCalibrationWarning(result, "Severe", "Flat too bright");
    } else if (Number.isFinite(medianPct) && medianPct > 65) {
      addCalibrationWarning(result, "Possible", "Flat above histogram target");
    }
    if (clipping > 0.1) {
      addCalibrationWarning(result, "Severe", "Flat saturated");
    } else if (clipping > 0.02) {
      addCalibrationWarning(result, "Possible", "Flat near saturation");
    }
    if (Number.isFinite(spreadPct) && spreadPct > 85) {
      addCalibrationWarning(result, "Possible", "Flat very uneven");
    }
    if (backgroundRangePct > 55) {
      addCalibrationWarning(result, "Possible", "Flat strong gradient");
    }
    if (hotPixelPct + darkOutlierPct > 6) {
      addCalibrationWarning(result, "Possible", "Flat pixel outliers");
    }
  } else if (result.frameType === "Bias") {
    const levelScore = scoreBelow(medianPct, 1.5, 8);
    const brightPixelScore = scoreBelow(clipping, 0.001, 0.05);
    const spreadScore = scoreBelow(spreadPct, 2.5, 18);
    const hotPixelScore = scoreBelow(hotPixelPct, 0.08, 0.35, 0.85);
    const gradientScore = scoreBelow(backgroundRangePct, 4, 14, 0.85);
    score =
      levelScore * 0.38 +
      brightPixelScore * 0.25 +
      spreadScore * 0.18 +
      hotPixelScore * 0.1 +
      gradientScore * 0.09;
    components = [
      scoreComponent("Bias Level", levelScore, 38, 100, `${formatMetric(medianPct, 1)}% median`),
      scoreComponent("Bright Pixels", brightPixelScore, 25, 100, `${formatMetric(clipping, 3)}% saturated`),
      scoreComponent("Spread", spreadScore, 18, 100, `${formatMetric(spreadPct, 1)}% spread`),
      scoreComponent("Hot Pixels", hotPixelScore, 10, 100, `${formatMetric(hotPixelPct, 3)}% high outliers`),
      scoreComponent("Gradient", gradientScore, 9, 100, `${formatMetric(backgroundRangePct, 1)}% range`)
    ];

    if (Number.isFinite(medianPct) && medianPct > 8) {
      addCalibrationWarning(result, "Severe", "Bias signal high");
    }
    if (clipping > 0.05) {
      addCalibrationWarning(result, "Severe", "Bias saturated pixels");
    }
    if (Number.isFinite(spreadPct) && spreadPct > 18) {
      addCalibrationWarning(result, "Possible", "Bias uneven");
    }
    if (hotPixelPct > 0.35) {
      addCalibrationWarning(result, "Severe", "Many hot-pixel outliers");
    } else if (hotPixelPct > 0.08) {
      addCalibrationWarning(result, "Possible", "Hot-pixel outliers");
    }
    if (darkOutlierPct > 0.35) {
      addCalibrationWarning(result, "Possible", "Dark-pixel outliers");
    }
    if (backgroundRangePct > 14 || structureScoreValue > 0.72) {
      addCalibrationWarning(result, "Severe", "Light leak/strong gradient");
    } else if (backgroundRangePct > 6 || structureScoreValue > 0.42) {
      addCalibrationWarning(result, "Possible", "Possible light leak/gradient");
    }
  } else {
    const outlierProfile = darkOutlierProfileForCamera(result.cameraModel);
    const levelScore = scoreBelow(medianPct, 3, 15);
    const brightPixelScore = scoreBelow(clipping, 0.005, 0.1);
    const spreadScore = scoreBelow(spreadPct, 8, 35);
    const hotPixelScore = scoreBelow(hotPixelPct, outlierProfile.hotGoodLimit, outlierProfile.hotBadLimit, 0.85);
    const darkPixelScore = scoreBelow(darkOutlierPct, outlierProfile.darkGoodLimit, outlierProfile.darkBadLimit, 0.85);
    const outlierScore = hotPixelScore * 0.7 + darkPixelScore * 0.3;
    const gradientScore = scoreBelow(backgroundRangePct, 6, 20, 0.85);
    score =
      levelScore * 0.32 +
      brightPixelScore * 0.26 +
      spreadScore * 0.18 +
      outlierScore * 0.1 +
      gradientScore * 0.14;
    components = [
      scoreComponent(`${result.frameType} Level`, levelScore, 32, 100, `${formatMetric(medianPct, 1)}% median`),
      scoreComponent("Bright Pixels", brightPixelScore, 26, 100, `${formatMetric(clipping, 3)}% saturated`),
      scoreComponent("Spread", spreadScore, 18, 100, `${formatMetric(spreadPct, 1)}% spread`),
      scoreComponent(
        "Outliers",
        outlierScore,
        10,
        100,
        `${formatMetric(hotPixelPct, 3)}% hot, ${formatMetric(darkOutlierPct, 3)}% dark (${outlierProfile.name})`
      ),
      scoreComponent("Gradient", gradientScore, 14, 100, `${formatMetric(backgroundRangePct, 1)}% range`)
    ];

    if (Number.isFinite(medianPct) && medianPct > 15) {
      addCalibrationWarning(result, "Severe", `${result.frameType} signal high`);
    }
    if (clipping > 0.1) {
      addCalibrationWarning(result, "Severe", `${result.frameType} saturated pixels`);
    } else if (clipping > 0.005) {
      addCalibrationWarning(result, "Possible", `${result.frameType} has bright pixels`);
    }
    if (Number.isFinite(spreadPct) && spreadPct > 35) {
      addCalibrationWarning(result, "Possible", `${result.frameType} uneven`);
    }
    if (hotPixelPct > outlierProfile.hotSevereLimit) {
      addCalibrationWarning(result, "Severe", "Many hot-pixel outliers");
    } else if (hotPixelPct > outlierProfile.hotPossibleLimit) {
      addCalibrationWarning(result, "Possible", "Hot-pixel outliers");
    }
    if (darkOutlierPct > outlierProfile.darkSevereLimit) {
      addCalibrationWarning(result, "Severe", "Many dark-pixel outliers");
    } else if (darkOutlierPct > outlierProfile.darkPossibleLimit) {
      addCalibrationWarning(result, "Possible", "Dark-pixel outliers");
    }
    if (backgroundRangePct > 20 || structureScoreValue > 0.8) {
      addCalibrationWarning(result, "Severe", "Light leak/strong gradient");
    } else if (backgroundRangePct > 8 || structureScoreValue > 0.45 || (Number.isFinite(medianPct) && medianPct > 8 && backgroundRangePct > 5)) {
      addCalibrationWarning(result, "Possible", "Possible light leak/gradient");
    }
  }

  result.calibrationSummary = calibrationLabel(result);
  result.quality = Math.round(clamp(score, 0, 1) * 100);
  result.scoreBreakdown = {
    kind: "calibration",
    base: score * 100,
    final: result.quality,
    components,
    penalties: []
  };
}

function calibrationSetKey(result) {
  const frameType = result.frameType || unknownFrameTypeName;
  const filterName =
    frameType === "Flat" || frameType === "Dark Flat" ? result.filterName || unknownFilterName : "All";
  return `${frameType}|${filterName}`;
}

function calibrationSetLabelFromKey(key) {
  const [frameType, filterName] = key.split("|");
  if (filterName && filterName !== "All") {
    return `${frameType} / ${filterName}`;
  }
  return frameType || unknownFrameTypeName;
}

function sortedFiniteValues(results, field) {
  return results
    .map((result) => Number(result[field]))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
}

function nearestReferenceValue(value, references) {
  if (!Number.isFinite(value) || references.length === 0) {
    return {
      value: NaN,
      delta: NaN
    };
  }

  let bestValue = references[0];
  let bestDelta = Math.abs(value - bestValue);
  for (let i = 1; i < references.length; i += 1) {
    const reference = references[i];
    const delta = Math.abs(value - reference);
    if (delta < bestDelta) {
      bestValue = reference;
      bestDelta = delta;
    }
  }

  return {
    value: bestValue,
    delta: bestDelta
  };
}

function applyCalibrationCompatibilityPenalty(result, label, factor, capQuality, detail) {
  const before = result.quality / 100;
  result.quality = Math.round(Math.min(result.quality * factor, capQuality));
  if (result.scoreBreakdown) {
    const after = result.quality / 100;
    result.scoreBreakdown.penalties.push(scorePenalty(label, before, after, detail));
    result.scoreBreakdown.final = result.quality;
  }
}

function checkDarkExposureCompatibility(result, lightExposureValues) {
  if (result.frameType !== "Dark") {
    result.calibrationExposureMatch = "Not checked";
    return;
  }
  if (!Number.isFinite(result.exposureSeconds) || lightExposureValues.length === 0) {
    result.calibrationExposureMatch = "Missing";
    return;
  }

  const reference = nearestReferenceValue(result.exposureSeconds, lightExposureValues);
  const tolerance = Math.max(exposureMatchToleranceSeconds, Math.abs(reference.value) * exposureMatchToleranceFraction);
  const severeTolerance = Math.max(
    exposureSevereMismatchSeconds,
    Math.abs(reference.value) * exposureSevereMismatchFraction
  );

  result.calibrationExposureReferenceSeconds = reference.value;
  result.calibrationExposureDeltaSeconds = reference.delta;
  if (reference.delta <= tolerance) {
    result.calibrationExposureMatch = "OK";
    return;
  }

  if (reference.delta > severeTolerance) {
    result.calibrationExposureMatch = "Severe mismatch";
    addCalibrationWarning(result, "Severe", "Dark exposure mismatch with lights");
    applyCalibrationCompatibilityPenalty(
      result,
      "Dark Exposure",
      0.65,
      55,
      `${formatMetric(reference.delta, 1)}s from closest light exposure`
    );
    return;
  }

  result.calibrationExposureMatch = "Mismatch";
  addCalibrationWarning(result, "Possible", "Dark exposure differs from lights");
  applyCalibrationCompatibilityPenalty(
    result,
    "Dark Exposure",
    0.88,
    100,
    `${formatMetric(reference.delta, 1)}s from closest light exposure`
  );
}

function checkCalibrationTemperatureCompatibility(result, lightTemperatureValues) {
  if (!isCalibrationFrame(result)) {
    return;
  }
  if (!Number.isFinite(result.cameraTemperatureC) || lightTemperatureValues.length === 0) {
    result.calibrationTemperatureMatch = "Missing";
    return;
  }

  const reference = nearestReferenceValue(result.cameraTemperatureC, lightTemperatureValues);
  result.calibrationTemperatureReferenceC = reference.value;
  result.calibrationTemperatureDeltaC = reference.delta;
  if (reference.delta <= temperatureMatchToleranceC) {
    result.calibrationTemperatureMatch = "OK";
    return;
  }

  if (reference.delta > temperatureSevereMismatchC) {
    result.calibrationTemperatureMatch = "Severe mismatch";
    addCalibrationWarning(result, "Severe", "Temperature mismatch with lights");
    applyCalibrationCompatibilityPenalty(
      result,
      "Temperature",
      0.75,
      65,
      `${formatMetric(reference.delta, 1)}C from closest light temperature`
    );
    return;
  }

  result.calibrationTemperatureMatch = "Mismatch";
  addCalibrationWarning(result, "Possible", "Temperature differs from lights");
  applyCalibrationCompatibilityPenalty(
    result,
    "Temperature",
    0.92,
    100,
    `${formatMetric(reference.delta, 1)}C from closest light temperature`
  );
}

function compatibilitySummaryForResult(result) {
  const parts = [];
  if (result.frameType === "Dark") {
    if (result.calibrationExposureMatch === "OK") {
      parts.push(`Exposure OK (${formatExposure(result.calibrationExposureReferenceSeconds)})`);
    } else if (result.calibrationExposureMatch === "Mismatch" || result.calibrationExposureMatch === "Severe mismatch") {
      parts.push(`Exposure ${formatMetric(result.calibrationExposureDeltaSeconds, 1)}s off`);
    } else if (result.calibrationExposureMatch === "Missing") {
      parts.push("Exposure not verified");
    }
  }

  if (result.calibrationTemperatureMatch === "OK") {
    parts.push(`Temperature OK (${formatTemperature(result.calibrationTemperatureReferenceC)})`);
  } else if (
    result.calibrationTemperatureMatch === "Mismatch" ||
    result.calibrationTemperatureMatch === "Severe mismatch"
  ) {
    parts.push(`Temperature ${formatMetric(result.calibrationTemperatureDeltaC, 1)}C off`);
  } else if (result.calibrationTemperatureMatch === "Missing") {
    parts.push("Temperature not verified");
  }

  return parts.join("; ");
}

function applyCalibrationLightCompatibility(results) {
  const lightResults = results.filter((result) => !isCalibrationFrame(result));
  const lightExposureValues = sortedFiniteValues(lightResults, "exposureSeconds");
  const lightTemperatureValues = sortedFiniteValues(lightResults, "cameraTemperatureC");
  const calibrationResults = results.filter((result) => isCalibrationFrame(result));

  for (const result of calibrationResults) {
    result.calibrationExposureReferenceSeconds = NaN;
    result.calibrationExposureDeltaSeconds = NaN;
    result.calibrationExposureMatch = "Not checked";
    result.calibrationTemperatureReferenceC = NaN;
    result.calibrationTemperatureDeltaC = NaN;
    result.calibrationTemperatureMatch = "Not checked";

    checkDarkExposureCompatibility(result, lightExposureValues);
    checkCalibrationTemperatureCompatibility(result, lightTemperatureValues);
    result.calibrationCompatibilitySummary = compatibilitySummaryForResult(result);
    result.calibrationSummary = calibrationLabel(result);
  }
}

function finiteMedian(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  return sorted.length > 0 ? percentileFromSorted(sorted, 0.5) : NaN;
}

function flatHistogramComparisonBins(result) {
  const bins = result.flatHistogram?.probabilityBins || result.flatHistogram?.bins || [];
  if (bins.length === 0) {
    return [];
  }
  const sum = bins.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0);
  if (sum <= 0) {
    return [];
  }
  return bins.map((value) => (Number.isFinite(value) ? value / sum : 0));
}

function medianArray(arrays) {
  const length = Math.max(0, ...arrays.map((array) => array.length));
  if (length === 0) {
    return [];
  }

  return Array.from({ length }, (_, index) => {
    const values = arrays
      .map((array) => Number(array[index]))
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b);
    return values.length > 0 ? percentileFromSorted(values, 0.5) : NaN;
  });
}

function normalizedArray(array) {
  const sum = array.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0);
  if (sum <= 0) {
    return array;
  }
  return array.map((value) => (Number.isFinite(value) ? value / sum : NaN));
}

function histogramDistance(a, b) {
  const length = Math.min(a.length, b.length);
  if (length === 0) {
    return NaN;
  }

  let total = 0;
  let compared = 0;
  for (let i = 0; i < length; i += 1) {
    if (!Number.isFinite(a[i]) || !Number.isFinite(b[i])) {
      continue;
    }
    total += Math.abs(a[i] - b[i]);
    compared += 1;
  }
  return compared > 0 ? total / 2 : NaN;
}

function tileSignatureDistance(a, b) {
  const length = Math.min(a.length, b.length);
  if (length === 0) {
    return NaN;
  }

  const differences = [];
  for (let i = 0; i < length; i += 1) {
    if (!Number.isFinite(a[i]) || !Number.isFinite(b[i])) {
      continue;
    }
    differences.push(Math.abs(a[i] - b[i]));
  }
  differences.sort((x, y) => x - y);
  return differences.length > 0 ? percentileFromSorted(differences, 0.75) : NaN;
}

function flatArtifactLabel(result) {
  if (result.frameType !== "Flat") {
    return "n/a";
  }
  if (result.flatArtifactScore >= 0.72) {
    return "Issue";
  }
  if (result.flatArtifactScore >= 0.35) {
    return "Review";
  }
  return "OK";
}

function applyFlatArtifactConsistency(groupResults) {
  if (groupResults.length < flatArtifactGroupMinimum || groupResults[0].frameType !== "Flat") {
    return;
  }

  const medianReference = finiteMedian(groupResults.map((result) => result.medianPercent));
  const spreadReference = finiteMedian(groupResults.map((result) => result.spreadPercent));
  const gradientReference = finiteMedian(groupResults.map((result) => result.calibrationBackgroundRangePercent));
  const histogramReference = normalizedArray(
    medianArray(groupResults.map(flatHistogramComparisonBins).filter((bins) => bins.length > 0))
  );
  const tileReference = medianArray(
    groupResults.map((result) => result.calibrationTileSignature || []).filter((signature) => signature.length > 0)
  );

  for (const result of groupResults) {
    const medianDelta =
      Number.isFinite(result.medianPercent) && Number.isFinite(medianReference)
        ? Math.abs(result.medianPercent - medianReference)
        : NaN;
    const spreadDelta =
      Number.isFinite(result.spreadPercent) && Number.isFinite(spreadReference)
        ? Math.abs(result.spreadPercent - spreadReference)
        : NaN;
    const gradientDelta =
      Number.isFinite(result.calibrationBackgroundRangePercent) && Number.isFinite(gradientReference)
        ? Math.max(0, result.calibrationBackgroundRangePercent - gradientReference)
        : NaN;
    const histogramDiff = histogramDistance(flatHistogramComparisonBins(result), histogramReference);
    const tileDiff = tileSignatureDistance(result.calibrationTileSignature || [], tileReference);

    result.calibrationSetSpreadDeltaPercent = spreadDelta;
    result.calibrationSetGradientDeltaPercent = gradientDelta;
    result.flatHistogramDistance = histogramDiff;
    result.flatTileMismatchPercent = tileDiff;

    const medianSignal = Number.isFinite(medianDelta) ? clamp((medianDelta - 4) / 10, 0, 1) : 0;
    const spreadSignal = Number.isFinite(spreadDelta) ? clamp((spreadDelta - 4) / 16, 0, 1) : 0;
    const gradientSignal = Number.isFinite(gradientDelta) ? clamp((gradientDelta - 6) / 20, 0, 1) : 0;
    const histogramSignal = Number.isFinite(histogramDiff) ? clamp((histogramDiff - 0.06) / 0.18, 0, 1) : 0;
    const tileSignal = Number.isFinite(tileDiff) ? clamp((tileDiff - 2.5) / 10, 0, 1) : 0;
    const strongestSignal = Math.max(medianSignal, spreadSignal, gradientSignal, histogramSignal, tileSignal);
    const artifactScore = clamp(
      histogramSignal * 0.32 +
        tileSignal * 0.28 +
        spreadSignal * 0.18 +
        medianSignal * 0.14 +
        gradientSignal * 0.08 +
        strongestSignal * 0.22,
      0,
      1
    );
    result.flatArtifactScore = artifactScore;

    const severeArtifact =
      artifactScore >= 0.72 ||
      (Number.isFinite(histogramDiff) && histogramDiff > 0.24) ||
      (Number.isFinite(tileDiff) && tileDiff > 14) ||
      (Number.isFinite(spreadDelta) && spreadDelta > 22) ||
      (Number.isFinite(medianDelta) && medianDelta > 14);
    const possibleArtifact =
      severeArtifact ||
      artifactScore >= 0.35 ||
      (Number.isFinite(histogramDiff) && histogramDiff > 0.12) ||
      (Number.isFinite(tileDiff) && tileDiff > 6) ||
      (Number.isFinite(spreadDelta) && spreadDelta > 9) ||
      (Number.isFinite(medianDelta) && medianDelta > 8) ||
      (Number.isFinite(gradientDelta) && gradientDelta > 15);

    if (!possibleArtifact) {
      continue;
    }

    const before = result.quality / 100;
    result.quality = severeArtifact
      ? Math.round(Math.min(result.quality * 0.38, 42))
      : Math.round(Math.min(result.quality * 0.62, 68));
    if (result.scoreBreakdown) {
      const after = result.quality / 100;
      result.scoreBreakdown.penalties.push(
        scorePenalty(
          "Flat Artefact",
          before,
          after,
          `Hist ${formatMetric(histogramDiff, 3)}, tile ${formatMetric(tileDiff, 1)}%, spread ${formatMetric(spreadDelta, 1)}%`
        )
      );
      result.scoreBreakdown.final = result.quality;
    }
    addCalibrationWarning(result, severeArtifact ? "Severe" : "Possible", "Flat artefact mismatch from set");
    result.calibrationSummary = calibrationLabel(result);
  }
}

function applyCalibrationConsistency(results) {
  const groups = new Map();
  for (const result of results) {
    const key = calibrationSetKey(result);
    result.calibrationSetKey = key;
    result.calibrationSetMedianPercent = NaN;
    result.calibrationSetDeltaPercent = NaN;
    result.calibrationSetDeltaLimit = NaN;
    result.calibrationSetSpreadDeltaPercent = NaN;
    result.calibrationSetGradientDeltaPercent = NaN;
    result.calibrationSetOutlier = false;
    result.flatHistogramDistance = NaN;
    result.flatTileMismatchPercent = NaN;
    result.flatArtifactScore = 0;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(result);
  }

  for (const groupResults of groups.values()) {
    const values = groupResults
      .map((result) => result.medianPercent)
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b);
    if (values.length < 3) {
      continue;
    }
    const groupMedian = percentileFromSorted(values, 0.5);
    const allowedDelta =
      groupResults[0].frameType === "Flat" ? 8 : groupResults[0].frameType === "Dark Flat" ? 10 : 8;
    for (const result of groupResults) {
      result.calibrationSetMedianPercent = groupMedian;
      result.calibrationSetDeltaLimit = allowedDelta;
      if (!Number.isFinite(result.medianPercent)) {
        continue;
      }
      const delta = Math.abs(result.medianPercent - groupMedian);
      result.calibrationSetDeltaPercent = delta;
      if (delta > allowedDelta) {
        const before = result.quality / 100;
        const severeOutlier = delta > allowedDelta * 1.8;
        result.calibrationSetOutlier = true;
        result.quality = severeOutlier ? Math.round(Math.min(result.quality * 0.65, 55)) : Math.round(result.quality * 0.82);
        if (result.scoreBreakdown) {
          const after = result.quality / 100;
          result.scoreBreakdown.penalties.push(
            scorePenalty("Set Consistency", before, after, `${formatMetric(delta, 1)}% from group median`)
          );
          result.scoreBreakdown.final = result.quality;
        }
        addCalibrationWarning(result, severeOutlier ? "Severe" : "Possible", "Median outlier from set");
        result.calibrationSummary = calibrationLabel(result);
      }
    }
    applyFlatArtifactConsistency(groupResults);
  }
}

function computeElongation(gray, width, height, mean, std, options = {}) {
  const threshold = mean + std * 2;
  let gxx = 0;
  let gyy = 0;
  let gxy = 0;
  let count = 0;
  const step = sampleStepForTarget(Math.max(1, width - 2), Math.max(1, height - 2), options.sampleTarget);

  for (let y = 1; y < height - 1; y += step) {
    const row = y * width;
    for (let x = 1; x < width - 1; x += step) {
      const i = row + x;
      if (
        !Number.isFinite(gray[i]) ||
        !Number.isFinite(gray[i - 1]) ||
        !Number.isFinite(gray[i + 1]) ||
        !Number.isFinite(gray[i - width]) ||
        !Number.isFinite(gray[i + width]) ||
        gray[i] < threshold
      ) {
        continue;
      }

      const gx = gray[i + 1] - gray[i - 1];
      const gy = gray[i + width] - gray[i - width];

      gxx += gx * gx;
      gyy += gy * gy;
      gxy += gx * gy;
      count += 1;
    }
  }

  if (count < 30) {
    return 1;
  }

  const trace = gxx + gyy;
  const determinant = gxx * gyy - gxy * gxy;
  const temp = Math.sqrt(Math.max(trace * trace - 4 * determinant, 0));
  const lambda1 = (trace + temp) / 2;
  const lambda2 = (trace - temp) / 2;
  return Math.sqrt((lambda1 + 1e-9) / (lambda2 + 1e-9));
}

function minMaxNormalize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max - min < 1e-9) {
    return values.map(() => 0.5);
  }
  return values.map((value) => (value - min) / (max - min));
}

function scoreComponent(label, score, weight, weightTotal, detail = "") {
  const safeScore = clamp(Number(score) || 0, 0, 1);
  const safeWeight = Math.max(Number(weight) || 0, 0);
  const safeTotal = Math.max(Number(weightTotal) || 0, 1);
  return {
    label,
    score: safeScore,
    weight: safeWeight,
    points: (safeScore * safeWeight * 100) / safeTotal,
    detail
  };
}

function scorePenalty(label, before, after, detail = "") {
  return {
    label,
    points: (clamp(after, 0, 1) - clamp(before, 0, 1)) * 100,
    factor: before > 0 ? clamp(after / before, 0, 1) : 1,
    detail
  };
}

function angularSeparationDegrees(ra1Deg, dec1Deg, ra2Deg, dec2Deg) {
  if (
    !Number.isFinite(ra1Deg) ||
    !Number.isFinite(dec1Deg) ||
    !Number.isFinite(ra2Deg) ||
    !Number.isFinite(dec2Deg)
  ) {
    return NaN;
  }
  const toRad = Math.PI / 180;
  const ra1 = ra1Deg * toRad;
  const ra2 = ra2Deg * toRad;
  const dec1 = dec1Deg * toRad;
  const dec2 = dec2Deg * toRad;
  const deltaRa = ra2 - ra1;
  const deltaDec = dec2 - dec1;
  const a =
    Math.sin(deltaDec / 2) * Math.sin(deltaDec / 2) +
    Math.cos(dec1) * Math.cos(dec2) * Math.sin(deltaRa / 2) * Math.sin(deltaRa / 2);
  return (2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)))) / toRad;
}

function hasObjectCoordinates(result) {
  return Number.isFinite(result.raDegrees) && Number.isFinite(result.decDegrees);
}

function objectShotDisplayName(index, result) {
  if (result.targetName && result.targetName !== unknownTargetName) {
    return result.targetName;
  }
  return `Object ${index}`;
}

function resetObjectShotFields(result) {
  result.objectShotKey = unknownObjectShotKey;
  result.objectShotLabel = unknownObjectShotLabel;
  result.objectShotIndex = 0;
  result.objectShotMemberCount = 0;
  result.objectShotReferenceRaDeg = NaN;
  result.objectShotReferenceDecDeg = NaN;
  result.objectShotSeparationDeg = NaN;
}

function assignLightObjectShotGroups(results) {
  const lightResults = results.filter((result) => !isCalibrationFrame(result));
  for (const result of lightResults) {
    resetObjectShotFields(result);
  }

  const coordinateResults = lightResults
    .filter(hasObjectCoordinates)
    .sort((a, b) => a.raDegrees - b.raDegrees || a.decDegrees - b.decDegrees || a.fileName.localeCompare(b.fileName));
  const missingCoordinateResults = lightResults.filter((result) => !hasObjectCoordinates(result));

  for (const result of missingCoordinateResults) {
    result.objectShotMemberCount = missingCoordinateResults.length;
  }

  const groups = [];
  for (const result of coordinateResults) {
    const tolerance = Number.isFinite(result.objectShotToleranceDeg)
      ? result.objectShotToleranceDeg
      : objectShotFallbackToleranceDeg;
    let bestGroup = null;
    let bestSeparation = Number.POSITIVE_INFINITY;

    for (const group of groups) {
      const separation = angularSeparationDegrees(
        result.raDegrees,
        result.decDegrees,
        group.referenceRaDeg,
        group.referenceDecDeg
      );
      const allowed = Math.max(tolerance, group.toleranceDeg, objectShotMinToleranceDeg);
      if (Number.isFinite(separation) && separation <= allowed && separation < bestSeparation) {
        bestGroup = group;
        bestSeparation = separation;
      }
    }

    if (!bestGroup) {
      bestGroup = {
        index: groups.length + 1,
        key: `object-${groups.length + 1}`,
        label: objectShotDisplayName(groups.length + 1, result),
        referenceRaDeg: result.raDegrees,
        referenceDecDeg: result.decDegrees,
        toleranceDeg: tolerance,
        members: []
      };
      groups.push(bestGroup);
      bestSeparation = 0;
    }

    bestGroup.members.push(result);
    const memberCount = bestGroup.members.length;
    bestGroup.referenceRaDeg =
      bestGroup.referenceRaDeg + (result.raDegrees - bestGroup.referenceRaDeg) / memberCount;
    bestGroup.referenceDecDeg =
      bestGroup.referenceDecDeg + (result.decDegrees - bestGroup.referenceDecDeg) / memberCount;
    bestGroup.toleranceDeg = Math.max(bestGroup.toleranceDeg, tolerance);
  }

  for (const group of groups) {
    const namedMember = group.members.find((member) => member.targetName && member.targetName !== unknownTargetName);
    if (namedMember) {
      group.label = namedMember.targetName;
    }
    for (const result of group.members) {
      result.objectShotKey = group.key;
      result.objectShotLabel = group.label;
      result.objectShotIndex = group.index;
      result.objectShotMemberCount = group.members.length;
      result.objectShotReferenceRaDeg = group.referenceRaDeg;
      result.objectShotReferenceDecDeg = group.referenceDecDeg;
      result.objectShotSeparationDeg = angularSeparationDegrees(
        result.raDegrees,
        result.decDegrees,
        group.referenceRaDeg,
        group.referenceDecDeg
      );
    }
  }
}

function lightScoreGroupKey(result) {
  return `${result.filterName || unknownFilterName}|${result.objectShotKey || unknownObjectShotKey}`;
}

function isRepeatDriftReason(reason) {
  return reason === "Repeat drift" || reason === "Trailing + Repeat drift";
}

function applyTrackingQualityPenalty(score, result) {
  const repeatDrift = isRepeatDriftReason(result.trackingReason);
  if (result.trackingSeverity === "Severe") {
    if (repeatDrift) {
      return Math.min(score * 0.38, 0.28);
    }
    return Math.min(score * 0.45, 0.48);
  }
  if (result.trackingSeverity === "Possible") {
    if (repeatDrift) {
      return Math.min(score * 0.55, 0.4);
    }
    return Math.min(score * 0.68, 0.65);
  }
  return score;
}

function applyHaloQualityPenalty(score, result) {
  if (result.haloSeverity === "Likely") {
    return score * 0.82;
  }
  if (result.haloSeverity === "Possible") {
    return score * 0.92;
  }
  return score;
}

function resetCloudAssessment(result) {
  result.cloudSeverity = "None";
  result.cloudScore = 0;
  result.cloudStarLossScore = 0;
  result.cloudMeanLiftScore = 0;
  result.cloudSummary = "No cloud warning";
}

function updateCloudAssessmentForGroup(results) {
  const starCounts = results
    .map((result) => result.starCount)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  const means = results
    .map((result) => result.mean)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  const starReference = starCounts.length > 0 ? Math.max(percentileFromSorted(starCounts, 0.75), 1) : 1;
  const meanMedian = means.length > 0 ? percentileFromSorted(means, 0.5) : NaN;
  const meanP10 = means.length > 0 ? percentileFromSorted(means, 0.1) : NaN;
  const meanP90 = means.length > 0 ? percentileFromSorted(means, 0.9) : NaN;
  const meanRange = Number.isFinite(meanP10) && Number.isFinite(meanP90) ? Math.max(meanP90 - meanP10, 0) : 0;
  const meanDenominator = Math.max(Math.abs(meanMedian) * 0.04, meanRange * 0.6, 1e-6);
  const hasRelativeStarReference = starCounts.length >= cloudRelativePeerMinimum;
  const hasRelativeMeanReference = means.length >= cloudRelativePeerMinimum;

  for (const result of results) {
    resetCloudAssessment(result);
    const structureScore = clamp(Number(result.cloudStructureScore) || 0, 0, 1);
    const rangePercent = Number(result.cloudBackgroundRangePercent) || 0;
    const starLossScore =
      hasRelativeStarReference && starReference > 0
        ? clamp((starReference - (Number(result.starCount) || 0)) / (starReference * 0.55), 0, 1)
        : 0;
    const meanLiftScore =
      hasRelativeMeanReference && Number.isFinite(result.mean) && Number.isFinite(meanMedian)
        ? clamp((result.mean - meanMedian) / meanDenominator, 0, 1)
        : 0;
    const pairedEvidence = Math.min(structureScore, Math.max(starLossScore, meanLiftScore));
    const rangeStructurePossible =
      rangePercent >= cloudPossibleBackgroundRangePercent && structureScore >= cloudPossibleStructureScore;
    const rangeStructureLikely =
      rangePercent >= cloudLikelyBackgroundRangePercent && structureScore >= cloudLikelyStructureScore;
    const meanLiftWithStarLossEvidence =
      starLossScore >= cloudMeanLiftMinimumStarLossScore && meanLiftScore >= cloudSupportMeanLiftScore;
    const supportEvidence = starLossScore >= cloudSupportStarLossScore || meanLiftWithStarLossEvidence;
    const strongSupportEvidence =
      starLossScore >= cloudStrongStarLossScore ||
      (starLossScore >= cloudSupportStarLossScore && meanLiftScore >= cloudStrongMeanLiftScore);
    const extremeStructureEvidence =
      (rangePercent >= cloudExtremeBackgroundRangePercent &&
        structureScore >= cloudExtremeStructureScore &&
        meanLiftScore >= cloudStrongMeanLiftScore) ||
      (rangePercent >= cloudExtremeSingleFrameBackgroundRangePercent &&
        structureScore >= cloudExtremeSingleFrameStructureScore);
    let cloudScore = clamp(
      structureScore * 0.54 + starLossScore * 0.18 + meanLiftScore * 0.14 + pairedEvidence * 0.24,
      0,
      1
    );

    if (extremeStructureEvidence || (rangeStructureLikely && supportEvidence)) {
      cloudScore = Math.max(cloudScore, 0.72);
      if (supportEvidence) {
        cloudScore = Math.max(cloudScore, 0.78);
      }
    } else if (rangeStructurePossible && supportEvidence) {
      cloudScore = Math.max(cloudScore, 0.44);
      if (supportEvidence) {
        cloudScore = Math.max(cloudScore, 0.52);
      }
      if (strongSupportEvidence) {
        cloudScore = Math.max(cloudScore, 0.62);
      }
    } else if (rangeStructurePossible) {
      cloudScore = Math.min(cloudScore, cloudUnconfirmedStructureScoreCap);
    }

    let cloudSeverity = "None";
    if (
      extremeStructureEvidence ||
      (rangeStructureLikely && supportEvidence && strongSupportEvidence) ||
      (rangeStructurePossible && strongSupportEvidence && (rangePercent >= 4.8 || structureScore >= 0.06))
    ) {
      cloudSeverity = "Likely";
    } else if (rangeStructurePossible && supportEvidence) {
      cloudSeverity = "Possible";
    }

    result.cloudSeverity = cloudSeverity;
    result.cloudScore = cloudScore;
    result.cloudStarLossScore = starLossScore;
    result.cloudMeanLiftScore = meanLiftScore;
    const relativeSummary =
      hasRelativeStarReference && hasRelativeMeanReference
        ? `${formatMetric(starLossScore * 100, 0)}% star loss, ${formatMetric(meanLiftScore * 100, 0)}% mean-lift signal`
        : `single-frame structure check (${starCounts.length}/${cloudRelativePeerMinimum} same-shot/filter frames)`;
    const unconfirmedStructureSummary =
      rangeStructurePossible && !supportEvidence
        ? "No cloud warning; background structure lacks enough same-shot star-loss confirmation"
        : "No cloud warning";
    result.cloudSummary =
      cloudSeverity === "None"
        ? unconfirmedStructureSummary
        : `${cloudSeverity} cloud: ${formatMetric(rangePercent, 1)}% background range, structure ${formatMetric(
            structureScore,
            2
          )}, ${relativeSummary}`;
  }
}

function applyCloudQualityPenalty(score, result) {
  if (result.cloudSeverity === "Likely") {
    return Math.min(score * 0.45, 0.38);
  }
  if (result.cloudSeverity === "Possible") {
    return Math.min(score * 0.72, 0.55);
  }
  return score;
}

function computeFinalScoresForGroup(results) {
  updateCloudAssessmentForGroup(results);
  const sharpGlobalNorm = minMaxNormalize(results.map((r) => r.sharpnessGlobal));
  const sharpStarNorm = minMaxNormalize(results.map((r) => r.sharpnessStar));
  const hfrSharpNorm = minMaxNormalize(results.map((r) => (Number.isFinite(r.hfr) && r.hfr > 0 ? 1 / r.hfr : 0)));
  const starSizeNorm = sharpStarNorm.map((value, index) => value * 0.65 + hfrSharpNorm[index] * 0.35);
  const sharpnessMode = getSharpnessMode();
  const sharpNorm =
    sharpnessMode === "fwhm"
      ? starSizeNorm
      : sharpGlobalNorm.map((value, index) => value * 0.25 + starSizeNorm[index] * 0.75);
  const noiseNorm = minMaxNormalize(results.map((r) => r.noise));
  const roundnessScore = results.map((r) => clamp(r.starRoundness, 0, 1));
  const starCountNorm = minMaxNormalize(results.map((r) => r.starCount));
  const clippingScore = results.map((r) =>
    Number.isFinite(r.clippingScore) ? clamp(r.clippingScore, 0, 1) : clamp(1 - r.clipping / 1.5, 0, 1)
  );

  const weights = getWeights();
  const weightTotal = weights.sharpness + weights.noise + weights.stars + weights.starCount + weights.clipping;

  for (let i = 0; i < results.length; i += 1) {
    const noiseScore = 1 - noiseNorm[i];
    const components = [
      scoreComponent(
        "Sharpness",
        sharpNorm[i],
        weights.sharpness,
        weightTotal,
        sharpnessMode === "fwhm" ? "FWHM/HFR star-size score" : "Hybrid FWHM/HFR + edge score"
      ),
      scoreComponent("Noise", noiseScore, weights.noise, weightTotal, "Lower background residual scores higher"),
      scoreComponent("Roundness", roundnessScore[i], weights.stars, weightTotal, "FWHM minor/major plus moment shape"),
      scoreComponent("Star Count", starCountNorm[i], weights.starCount, weightTotal, "Relative to this object-shot/filter group"),
      scoreComponent(
        "Clipping",
        clippingScore[i],
        weights.clipping,
        weightTotal,
        `Hard ${formatMetric(results[i].clipping, 4)}%, near ${formatMetric(results[i].nearSaturation, 4)}%`
      )
    ];
    const baseScore = components.reduce((sum, component) => sum + component.points, 0) / 100;

    let score = baseScore;
    const penalties = [];
    const elongation = results[i].elongation;
    if (elongation > 2.5) {
      const before = score;
      score *= 0.84;
      penalties.push(scorePenalty("Elongation", before, score, `Elongation ${formatMetric(elongation, 2)}`));
    } else if (elongation > 1.9) {
      const before = score;
      score *= 0.92;
      penalties.push(scorePenalty("Elongation", before, score, `Elongation ${formatMetric(elongation, 2)}`));
    }

    if (results[i].trackingSeverity === "Severe") {
      const before = score;
      score = applyTrackingQualityPenalty(score, results[i]);
      penalties.push(scorePenalty("Tracking", before, score, trackingLabel(results[i])));
    } else if (results[i].trackingSeverity === "Possible") {
      const before = score;
      score = applyTrackingQualityPenalty(score, results[i]);
      penalties.push(scorePenalty("Tracking", before, score, trackingLabel(results[i])));
    }

    if (haloPenaltyEnabled() && (results[i].haloSeverity === "Likely" || results[i].haloSeverity === "Possible")) {
      const before = score;
      score = applyHaloQualityPenalty(score, results[i]);
      penalties.push(scorePenalty("Halo", before, score, haloLabel(results[i])));
    }

    if (results[i].cloudSeverity === "Likely" || results[i].cloudSeverity === "Possible") {
      const before = score;
      score = applyCloudQualityPenalty(score, results[i]);
      penalties.push(scorePenalty("Clouds", before, score, cloudLabel(results[i])));
    }

    results[i].quality = Math.round(clamp(score, 0, 1) * 100);
    results[i].scoreBreakdown = {
      kind: "light",
      base: baseScore * 100,
      final: results[i].quality,
      components,
      penalties
    };
  }
}

function computeFinalScores(results) {
  const groups = new Map();
  const calibrationResults = [];
  assignLightObjectShotGroups(results);

  for (const result of results) {
    if (isCalibrationFrame(result)) {
      calibrationResults.push(result);
      continue;
    }
    const groupKey = lightScoreGroupKey(result);
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey).push(result);
  }

  for (const groupResults of groups.values()) {
    computeFinalScoresForGroup(groupResults);
  }

  for (const result of calibrationResults) {
    computeCalibrationScore(result);
  }
  applyCalibrationConsistency(calibrationResults);
  applyCalibrationLightCompatibility(results);
}

function recommendationFor(result) {
  if (isCalibrationFrame(result)) {
    if (result.quality >= defaultKeeperThreshold && result.calibrationSeverity !== "Severe") {
      return "Keep";
    }
    if (result.quality >= Math.max(40, defaultKeeperThreshold - 8)) {
      return "Review";
    }
    return "Discard";
  }

  const keepThreshold = getKeeperThreshold(result.filterName || unknownFilterName);
  const reviewThreshold = Math.max(40, keepThreshold - 8);
  if (
    result.quality >= keepThreshold &&
    result.elongation < 2.2 &&
    (Number.isFinite(result.clippingPressure) ? result.clippingPressure < 1 : result.clipping < 1.5) &&
    result.trackingSeverity !== "Severe" &&
    result.trackingSeverity !== "Possible"
  ) {
    return "Keep";
  }
  if (result.quality >= reviewThreshold) {
    return "Review";
  }
  return "Discard";
}

function trackingLabel(result) {
  if (result.trackingSeverity === "Low confidence") {
    return "Low Confidence";
  }
  if (result.trackingSeverity === "Severe") {
    if (result.trackingReason === "Repeat drift") {
      return "Repeat Drift";
    }
    if (result.trackingReason === "Trailing + Repeat drift") {
      return "Tracking + Repeat";
    }
    return "Tracking Error";
  }
  if (result.trackingSeverity === "Possible") {
    if (result.trackingReason === "Repeat drift") {
      return "Possible Repeat Drift";
    }
    if (result.trackingReason === "Trailing + Repeat drift") {
      return "Possible Mixed Drift";
    }
    return "Possible Drift";
  }
  return "OK";
}

function trackingSampleLabel(result) {
  const count = Number(result.trackingSampleStarCount);
  if (!Number.isFinite(count) || count <= 0) {
    return "-";
  }
  const region = String(result.trackingSampleRegion || "");
  const match = region.match(/central\s+(\d+)%/i);
  return match ? `${count} / ${match[1]}%` : String(count);
}

function haloLabel(result) {
  if (result.haloSeverity === "Likely") {
    return "Likely Halo";
  }
  if (result.haloSeverity === "Possible") {
    return "Possible Halo";
  }
  return "OK";
}

function cloudLabel(result) {
  if (result.cloudSeverity === "Likely") {
    return "Likely Cloud";
  }
  if (result.cloudSeverity === "Possible") {
    return "Possible Cloud";
  }
  return "OK";
}

function qualityClass(result) {
  const score = typeof result === "number" ? result : result.quality;
  if (typeof result !== "number" && isCalibrationFrame(result)) {
    if (score >= defaultKeeperThreshold && result.calibrationSeverity !== "Severe") {
      return "quality-high";
    }
    if (score >= Math.max(40, defaultKeeperThreshold - 8)) {
      return "quality-mid";
    }
    return "quality-low";
  }
  const filterName = typeof result === "number" ? unknownFilterName : result.filterName || unknownFilterName;
  const keepThreshold = getKeeperThreshold(filterName);
  const reviewThreshold = Math.max(40, keepThreshold - 8);
  if (score >= keepThreshold) {
    return "quality-high";
  }
  if (score >= reviewThreshold) {
    return "quality-mid";
  }
  return "quality-low";
}

function formatMetric(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "-";
}

function formatExposure(value, digits = 1) {
  return Number.isFinite(value) ? `${formatMetric(value, digits)}s` : "-";
}

function formatTemperature(value, digits = 1) {
  return Number.isFinite(value) ? `${formatMetric(value, digits)}C` : "-";
}

function formatDegrees(value, digits = 3) {
  return Number.isFinite(value) ? `${formatMetric(value, digits)} deg` : "-";
}

function paddedInteger(value, width = 2) {
  return String(Math.trunc(Math.abs(value))).padStart(width, "0");
}

function formatSeconds(value, digits = 1) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) {
    return "00.0";
  }
  const fixed = seconds.toFixed(digits);
  return Number(fixed) < 10 ? `0${fixed}` : fixed;
}

function formatRightAscensionHms(raDegrees) {
  if (!Number.isFinite(raDegrees)) {
    return "-";
  }

  let totalSeconds = (((raDegrees / 15) % 24) + 24) % 24;
  totalSeconds = Math.round(totalSeconds * 3600 * 10) / 10;
  let hours = Math.floor(totalSeconds / 3600);
  let remainder = totalSeconds - hours * 3600;
  let minutes = Math.floor(remainder / 60);
  let seconds = remainder - minutes * 60;

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    hours += 1;
  }
  if (hours >= 24) {
    hours = 0;
  }

  return `${paddedInteger(hours)}h ${paddedInteger(minutes)}m ${formatSeconds(seconds)}s`;
}

function formatDeclinationDms(decDegrees) {
  if (!Number.isFinite(decDegrees)) {
    return "-";
  }

  const sign = decDegrees < 0 ? "-" : "+";
  let totalSeconds = Math.round(Math.abs(decDegrees) * 3600 * 10) / 10;
  let degrees = Math.floor(totalSeconds / 3600);
  let remainder = totalSeconds - degrees * 3600;
  let minutes = Math.floor(remainder / 60);
  let seconds = remainder - minutes * 60;

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }

  return `${sign}${paddedInteger(degrees)}deg ${paddedInteger(minutes)}' ${formatSeconds(seconds)}"`;
}

function formatArcminutes(value, digits = 1) {
  return Number.isFinite(value) ? `${formatMetric(value * 60, digits)} arcmin` : "-";
}

function formatPixelScale(value) {
  return Number.isFinite(value) ? `${formatMetric(value, 2)} arcsec/px` : "-";
}

function formatMicrons(value) {
  return Number.isFinite(value) ? `${formatMetric(value, 2)} um` : "-";
}

function formatObjectShotOffset(result) {
  if (!hasObjectCoordinates(result)) {
    return "-";
  }
  const separation = Number.isFinite(result.objectShotSeparationDeg) ? result.objectShotSeparationDeg : 0;
  const tolerance = Number.isFinite(result.objectShotToleranceDeg) ? result.objectShotToleranceDeg : NaN;
  return Number.isFinite(tolerance)
    ? `${formatArcminutes(separation)} / ${formatArcminutes(tolerance)}`
    : formatArcminutes(separation);
}

function calibrationExposureMatchLabel(result) {
  if (result.frameType !== "Dark") {
    return "n/a";
  }
  if (result.calibrationExposureMatch === "OK") {
    return "OK";
  }
  if (result.calibrationExposureMatch === "Mismatch") {
    return "Review";
  }
  if (result.calibrationExposureMatch === "Severe mismatch") {
    return "Issue";
  }
  return "n/a";
}

function calibrationTemperatureMatchLabel(result) {
  if (!isCalibrationFrame(result)) {
    return "n/a";
  }
  if (result.calibrationTemperatureMatch === "OK") {
    return "OK";
  }
  if (result.calibrationTemperatureMatch === "Mismatch") {
    return "Review";
  }
  if (result.calibrationTemperatureMatch === "Severe mismatch") {
    return "Issue";
  }
  return "n/a";
}

function metricMarkup(label, value) {
  return `
    <div class="metric">
      <span class="metric-label">${escapeHtml(String(label))}</span>
      <span class="metric-value">${escapeHtml(String(value))}</span>
    </div>
  `;
}

function metricItems(result) {
  if (isCalibrationFrame(result)) {
    const items = [
      ["Type", result.frameType || unknownFrameTypeName],
      ["Filter", result.filterName || unknownFilterName],
      ["Status", calibrationLabel(result)],
      ["Level", `${formatMetric(result.medianPercent, 1)}%`],
      ["Spread", `${formatMetric(result.spreadPercent, 1)}%`],
      ["Noise", formatMetric(result.noise, 2)],
      ["Exp", formatExposure(result.exposureSeconds)],
      ["Temp", formatTemperature(result.cameraTemperatureC)],
      ["Exp Match", calibrationExposureMatchLabel(result)],
      ["Temp Match", calibrationTemperatureMatchLabel(result)],
      ["Mean", formatMetric(result.mean, 2)],
      ["Set Delta", `${formatMetric(result.calibrationSetDeltaPercent, 1)}%`],
      ["Hot Px", `${formatMetric(result.calibrationBrightOutlierPercent, 3)}%`],
      ["Dark Px", `${formatMetric(result.calibrationDarkOutlierPercent, 3)}%`],
      ["Gradient", `${formatMetric(result.calibrationBackgroundRangePercent, 1)}%`]
    ];
    if (result.frameType === "Flat") {
      items.push(
        ["Artefact", flatArtifactLabel(result)],
        ["Hist Diff", formatMetric(result.flatHistogramDistance, 3)],
        ["Tile Diff", `${formatMetric(result.flatTileMismatchPercent, 1)}%`]
      );
    }
    if (result.frameType === "Dark" || result.frameType === "Dark Flat") {
      items.push(["Sensor", result.sensorOutlierProfile || "Generic sensor"]);
    }
    return items;
  }

  return [
    ["Type", result.frameType || unknownFrameTypeName],
    ["Filter", result.filterName || unknownFilterName],
    ["Object", result.objectShotLabel || unknownObjectShotLabel],
    ["RA", formatRightAscensionHms(result.raDegrees)],
    ["DEC", formatDeclinationDms(result.decDegrees)],
    ["Scale", formatPixelScale(result.pixelScaleArcsecPerPixel)],
    ["Focal", Number.isFinite(result.focalLengthMm) ? `${formatMetric(result.focalLengthMm, 0)} mm` : "-"],
    ["Pixel", formatMicrons(result.pixelSizeMicrons)],
    ["Shot Offset", formatObjectShotOffset(result)],
    ["Sharp", formatMetric(result.sharpness, 1)],
    ["Noise", formatMetric(result.noise, 2)],
    ["Round", `${formatMetric(result.starRoundness * 100, 1)}%`],
    ["Ecc", formatMetric(result.eccentricity, 3)],
    ["HFR", formatMetric(result.hfr, 2)],
    ["Stars", String(result.starCount)],
    ["Mean", formatMetric(result.mean, 2)],
    ["Exp", formatExposure(result.exposureSeconds)],
    ["Temp", formatTemperature(result.cameraTemperatureC)],
    ["Cloud", cloudLabel(result)],
    ["Clip", `${formatMetric(result.clipping, 4)}%`],
    ["Near Sat", `${formatMetric(result.nearSaturation, 4)}%`],
    ["Tracking", trackingLabel(result)],
    ["Guide Stars", trackingSampleLabel(result)]
  ];
}

function metricsMarkup(result) {
  return metricItems(result).map(([label, value]) => metricMarkup(label, value)).join("");
}

function haloPreviewMarkup(result) {
  const markers = result.haloMarkers || [];
  if (
    markers.length === 0 ||
    (result.haloSeverity !== "Possible" && result.haloSeverity !== "Likely") ||
    !result.previewSource
  ) {
    return "";
  }

  const imageWidth = result.previewSource.width || result.width || 1;
  const imageHeight = result.previewSource.height || result.height || 1;
  const imageAspect = imageWidth / Math.max(imageHeight, 1);
  const containerAspect = 4 / 3;
  let displayWidthPct = 100;
  let displayHeightPct = 100;
  let offsetXPct = 0;
  let offsetYPct = 0;

  if (imageAspect > containerAspect) {
    displayHeightPct = (containerAspect / imageAspect) * 100;
    offsetYPct = (100 - displayHeightPct) / 2;
  } else {
    displayWidthPct = (imageAspect / containerAspect) * 100;
    offsetXPct = (100 - displayWidthPct) / 2;
  }

  return `
    <span class="halo-preview-overlay" aria-hidden="true">
      ${markers
        .map((marker) => {
          const left = offsetXPct + marker.x * displayWidthPct;
          const top = offsetYPct + marker.y * displayHeightPct;
          const width = Math.max(marker.radiusX * 2 * displayWidthPct, 3.5);
          const height = Math.max(marker.radiusY * 2 * displayHeightPct, 3.5);
          return `<span class="halo-preview-marker" style="left: ${left.toFixed(3)}%; top: ${top.toFixed(3)}%; width: ${width.toFixed(3)}%; height: ${height.toFixed(3)}%;"></span>`;
        })
        .join("")}
    </span>
  `;
}

function flatHistogramPath(bins) {
  const width = 100;
  const height = 38;
  const lastIndex = Math.max(bins.length - 1, 1);
  let path = `M 0 ${height}`;

  for (let i = 0; i < bins.length; i += 1) {
    const x = (i / lastIndex) * width;
    const y = height - clamp(Number(bins[i]) || 0, 0, 1) * height;
    path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  return `${path} L ${width} ${height} Z`;
}

function flatHistogramMarkup(result) {
  const bins = result.flatHistogram?.bins || [];
  if (result.frameType !== "Flat" || bins.length === 0) {
    return "";
  }

  const medianPercent = Number.isFinite(result.medianPercent) ? clamp(result.medianPercent, 0, 100) : NaN;
  const medianText = Number.isFinite(medianPercent) ? `${formatMetric(medianPercent, 1)}%` : "-";
  const medianStyle = Number.isFinite(medianPercent) ? `left: ${medianPercent.toFixed(2)}%;` : "display: none;";

  return `
    <span class="flat-histogram-overlay" aria-hidden="true">
      <span class="flat-histogram-header">
        <span>Flat histogram</span>
        <strong>Median ${escapeHtml(medianText)}</strong>
      </span>
      <span class="flat-histogram-chart">
        <span class="flat-histogram-target"></span>
        <span class="flat-histogram-median" style="${medianStyle}"></span>
        <svg viewBox="0 0 100 38" preserveAspectRatio="none" focusable="false">
          <path class="flat-histogram-fill" d="${flatHistogramPath(bins)}"></path>
        </svg>
      </span>
    </span>
  `;
}

function warningItems(result) {
  const warnings = [];
  if (!isCalibrationFrame(result) && (result.cloudSeverity === "Possible" || result.cloudSeverity === "Likely")) {
    warnings.push({
      label: cloudLabel(result),
      detail: result.cloudSummary || "Cloud or haze detected"
    });
  }
  if (!isCalibrationFrame(result) && (result.haloSeverity === "Possible" || result.haloSeverity === "Likely")) {
    warnings.push({
      label: haloLabel(result),
      detail: result.haloSummary || "Bright-star halo detected"
    });
  }
  return warnings;
}

function warningMarkup(result) {
  const warnings = warningItems(result);
  if (warnings.length === 0) {
    return "";
  }

  return `
    <div class="warning-list" aria-label="Frame warnings">
      ${warnings
        .map(
          (warning) => `
            <div class="warning-chip">
              <span>${escapeHtml(warning.label)}</span>
              <small>${escapeHtml(warning.detail)}</small>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function signedPoints(value) {
  const rounded = Math.round((Number(value) || 0) * 10) / 10;
  if (Math.abs(rounded) < 0.05) {
    return "0.0";
  }
  if (rounded > 0) {
    return `+${rounded.toFixed(1)}`;
  }
  return rounded.toFixed(1);
}

function scoreBreakdownRow(item, className = "") {
  const points = Number(item.points) || 0;
  const fillWidth = `${clamp(Math.abs(points), 0, 100).toFixed(1)}%`;
  return `
    <div class="score-breakdown-row ${className}">
      <div>
        <span class="score-breakdown-label">${escapeHtml(item.label)}</span>
        ${item.detail ? `<span class="score-breakdown-detail">${escapeHtml(item.detail)}</span>` : ""}
      </div>
      <div class="score-bar" aria-hidden="true">
        <span class="score-fill" style="width: ${fillWidth}"></span>
      </div>
      <span class="score-points">${signedPoints(points)}</span>
    </div>
  `;
}

function scoreBreakdownMarkup(result) {
  const breakdown = result.scoreBreakdown;
  if (!breakdown) {
    return "";
  }
  const componentRows = (breakdown.components || []).map((item) => scoreBreakdownRow(item)).join("");
  const penaltyRows = (breakdown.penalties || []).map((item) => scoreBreakdownRow(item, "score-breakdown-penalty")).join("");
  const penaltyText = penaltyRows || `<p class="score-breakdown-empty">No score penalties applied.</p>`;

  return `
    <details class="score-details">
      <summary>Why this score?</summary>
      <div class="score-breakdown">
        <div class="score-breakdown-total">
          <span>Base ${formatMetric(breakdown.base, 1)}</span>
          <span>Final ${formatMetric(breakdown.final, 0)}</span>
        </div>
        ${componentRows}
        ${penaltyText}
      </div>
    </details>
  `;
}

function filterTabLabel(stat) {
  return `${stat.filterName} ${stat.count}`;
}

function thresholdFilterLabel(filterName) {
  return filterName === unknownFilterName ? "Unknown filter" : `${filterName} filter`;
}

function thresholdFilterDetail(stat) {
  const frameText = `${stat.count} ${stat.count === 1 ? "frame" : "frames"}`;
  if (stat.filterName === unknownFilterName) {
    return `${frameText} - no filter found in FITS header or path`;
  }
  return `${frameText} in this filter group`;
}

function renderFilterPanel() {
  if (
    !filterPanel ||
    !frameTypeTabs ||
    !filterTabs ||
    !objectShotGroup ||
    !objectShotTabs ||
    !recommendationTabs ||
    !filterThresholds ||
    !filterWarning
  ) {
    return;
  }

  if (state.results.length === 0) {
    filterPanel.hidden = true;
    frameTypeTabs.innerHTML = "";
    filterTabs.innerHTML = "";
    objectShotTabs.innerHTML = "";
    objectShotGroup.hidden = true;
    recommendationTabs.innerHTML = "";
    filterThresholds.innerHTML = "";
    filterWarning.textContent = "";
    state.activeFrameType = allFrameTypesKey;
    state.activeFilter = allFiltersKey;
    state.activeObjectShot = allObjectShotsKey;
    state.activeRecommendation = allRecommendationsKey;
    return;
  }

  const typeStats = frameTypeStats();
  const activeTypeStillExists =
    state.activeFrameType === allFrameTypesKey || typeStats.some((stat) => stat.frameType === state.activeFrameType);
  if (!activeTypeStillExists) {
    state.activeFrameType = allFrameTypesKey;
  }

  const typeResults = resultsForActiveFrameType();
  const stats = filterStats(typeResults);
  const activeStillExists =
    state.activeFilter === allFiltersKey || stats.some((stat) => stat.filterName === state.activeFilter);
  if (!activeStillExists) {
    state.activeFilter = allFiltersKey;
  }

  const filterResults = resultsForActiveFilter();
  const objectStats = objectShotStats(filterResults);
  const showObjectShotTabs =
    objectStats.some((stat) => stat.objectShotKey !== unknownObjectShotKey) || objectStats.length > 1;
  const activeObjectStillExists =
    state.activeObjectShot === allObjectShotsKey ||
    objectStats.some((stat) => stat.objectShotKey === state.activeObjectShot);
  if (!activeObjectStillExists || objectStats.length === 0 || !showObjectShotTabs) {
    state.activeObjectShot = allObjectShotsKey;
  }

  if (state.activeRecommendation !== allRecommendationsKey && !recommendationGroups.includes(state.activeRecommendation)) {
    state.activeRecommendation = allRecommendationsKey;
  }

  filterPanel.hidden = false;
  const typeTotal = state.results.length;
  const allTypeActive = state.activeFrameType === allFrameTypesKey ? " active" : "";
  frameTypeTabs.innerHTML = `
    <button class="filter-tab${allTypeActive}" type="button" role="tab" aria-selected="${state.activeFrameType === allFrameTypesKey}" data-frame-type="${allFrameTypesKey}">All ${typeTotal}</button>
    ${typeStats
      .map((stat) => {
        const active = state.activeFrameType === stat.frameType ? " active" : "";
        return `<button class="filter-tab${active}" type="button" role="tab" aria-selected="${state.activeFrameType === stat.frameType}" data-frame-type="${escapeHtml(stat.frameType)}">${escapeHtml(stat.frameType)} ${stat.count}</button>`;
      })
      .join("")}
  `;

  const total = typeResults.length;
  const allActive = state.activeFilter === allFiltersKey ? " active" : "";
  filterTabs.innerHTML = `
    <button class="filter-tab${allActive}" type="button" role="tab" aria-selected="${state.activeFilter === allFiltersKey}" data-filter="${allFiltersKey}">All ${total}</button>
    ${stats
      .map((stat) => {
        const active = state.activeFilter === stat.filterName ? " active" : "";
        return `<button class="filter-tab${active}" type="button" role="tab" aria-selected="${state.activeFilter === stat.filterName}" data-filter="${escapeHtml(stat.filterName)}">${escapeHtml(filterTabLabel(stat))}</button>`;
      })
      .join("")}
  `;

  if (!showObjectShotTabs) {
    objectShotGroup.hidden = true;
    objectShotTabs.innerHTML = "";
  } else {
    objectShotGroup.hidden = false;
    const objectTotal = objectStats.reduce((sum, stat) => sum + stat.count, 0);
    const allObjectActive = state.activeObjectShot === allObjectShotsKey ? " active" : "";
    objectShotTabs.innerHTML = `
      <button class="filter-tab${allObjectActive}" type="button" role="tab" aria-selected="${state.activeObjectShot === allObjectShotsKey}" data-object-shot="${allObjectShotsKey}">All ${objectTotal}</button>
      ${objectStats
        .map((stat) => {
          const active = state.activeObjectShot === stat.objectShotKey ? " active" : "";
          return `<button class="filter-tab${active}" type="button" role="tab" aria-selected="${state.activeObjectShot === stat.objectShotKey}" data-object-shot="${escapeHtml(stat.objectShotKey)}">${escapeHtml(stat.label)} ${stat.count}</button>`;
        })
        .join("")}
    `;
  }

  const recommendationResults = resultsForActiveObjectShot();
  const recommendationTotal = recommendationResults.length;
  const allRecommendationActive = state.activeRecommendation === allRecommendationsKey ? " active" : "";
  recommendationTabs.innerHTML = `
    <button class="filter-tab${allRecommendationActive}" type="button" role="tab" aria-selected="${state.activeRecommendation === allRecommendationsKey}" data-recommendation="${allRecommendationsKey}">All ${recommendationTotal}</button>
    ${recommendationStats(recommendationResults)
      .map((stat) => {
        const active = state.activeRecommendation === stat.recommendation ? " active" : "";
        return `<button class="filter-tab${active}" type="button" role="tab" aria-selected="${state.activeRecommendation === stat.recommendation}" data-recommendation="${escapeHtml(stat.recommendation)}">${escapeHtml(stat.recommendation)} ${stat.count}</button>`;
      })
      .join("")}
  `;

  const mixedTypeText =
    typeStats.length > 1 ? "Mixed frame types detected. Calibration frames use calibration checks." : "";
  const hasLightFrames = typeResults.some((result) => !isCalibrationFrame(result));
  const hasCalibrationFrames = typeResults.some((result) => isCalibrationFrame(result));
  const mixedFilterText =
    stats.length > 1
      ? hasLightFrames && hasCalibrationFrames
        ? "Light scores and calibration sets are grouped by filter."
        : hasCalibrationFrames
          ? "Calibration sets are grouped by filter where useful."
          : "Scores are grouped by filter for fair comparison."
      : "";
  const mixedObjectText =
    objectStats.filter((stat) => stat.objectShotKey !== unknownObjectShotKey).length > 1
      ? "Light scores are also grouped by object shot from FITS RA/DEC."
      : "";
  filterWarning.textContent = [mixedTypeText, mixedFilterText, mixedObjectText].filter(Boolean).join(" ");

  const thresholdStats = filterStats(typeResults.filter((result) => !isCalibrationFrame(result)));
  if (thresholdStats.length === 0) {
    filterThresholds.innerHTML = `<p class="threshold-note">Calibration frames use type-specific checks for their purpose.</p>`;
    return;
  }

  filterThresholds.innerHTML = thresholdStats
    .map((stat) => {
      const threshold = getKeeperThreshold(stat.filterName);
      const label = thresholdFilterLabel(stat.filterName);
      const detail = thresholdFilterDetail(stat);
      return `
        <label class="threshold-control">
          <span class="threshold-name">
            <span>${escapeHtml(label)}</span>
            <span class="threshold-detail">${escapeHtml(detail)}</span>
          </span>
          <span class="threshold-entry">
            <input class="threshold-number" type="number" min="0" max="100" step="1" value="${threshold}" data-filter="${escapeHtml(stat.filterName)}" aria-label="${escapeHtml(label)} keeper threshold">
            <span>%</span>
          </span>
        </label>
      `;
    })
    .join("");
}

function calibrationGroupSummaries(results = state.results) {
  const groups = new Map();
  for (const result of results) {
    if (!isCalibrationFrame(result)) {
      continue;
    }
    const key = result.calibrationSetKey || calibrationSetKey(result);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(result);
  }

  return Array.from(groups.entries())
    .map(([key, groupResults]) => {
      const medians = groupResults
        .map((result) => result.medianPercent)
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b);
      const qualities = groupResults.map((result) => result.quality).sort((a, b) => a - b);
      const setMedian = medians.length > 0 ? percentileFromSorted(medians, 0.5) : NaN;
      const setRange = medians.length > 1 ? percentileFromSorted(medians, 0.9) - percentileFromSorted(medians, 0.1) : 0;
      const maxHotPixels = Math.max(0, ...groupResults.map((result) => Number(result.calibrationBrightOutlierPercent) || 0));
      const maxGradient = Math.max(0, ...groupResults.map((result) => Number(result.calibrationBackgroundRangePercent) || 0));
      const flatArtifactIssues = groupResults.filter((result) => result.frameType === "Flat" && result.flatArtifactScore >= 0.35).length;
      const outliers = groupResults.filter((result) => result.calibrationSetOutlier).length;
      const exposureIssues = groupResults.filter(
        (result) =>
          result.calibrationExposureMatch === "Mismatch" ||
          result.calibrationExposureMatch === "Severe mismatch"
      ).length;
      const exposureChecked = groupResults.filter(
        (result) =>
          result.calibrationExposureMatch === "OK" ||
          result.calibrationExposureMatch === "Mismatch" ||
          result.calibrationExposureMatch === "Severe mismatch"
      ).length;
      const temperatureIssues = groupResults.filter(
        (result) =>
          result.calibrationTemperatureMatch === "Mismatch" ||
          result.calibrationTemperatureMatch === "Severe mismatch"
      ).length;
      const temperatureChecked = groupResults.filter(
        (result) =>
          result.calibrationTemperatureMatch === "OK" ||
          result.calibrationTemperatureMatch === "Mismatch" ||
          result.calibrationTemperatureMatch === "Severe mismatch"
      ).length;
      const severe = groupResults.filter((result) => result.calibrationSeverity === "Severe").length;
      const warned = groupResults.filter((result) => result.calibrationWarnings.length > 0).length;
      const keep = groupResults.filter((result) => recommendationFor(result) === "Keep").length;
      const review = groupResults.filter((result) => recommendationFor(result) === "Review").length;
      const discard = groupResults.length - keep - review;
      const warningCounts = new Map();
      for (const result of groupResults) {
        for (const warning of result.calibrationWarnings) {
          warningCounts.set(warning, (warningCounts.get(warning) || 0) + 1);
        }
      }
      const warnings = Array.from(warningCounts.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 5)
        .map(([warning, count]) => `${warning}${count > 1 ? ` x${count}` : ""}`);
      const status = severe > 0 || discard > 0 ? "Issue" : warned > 0 || outliers > 0 || review > 0 ? "Review" : "OK";
      const statusClass = status === "Issue" ? "severe" : status === "Review" ? "issue" : "";

      return {
        key,
        label: calibrationSetLabelFromKey(key),
        count: groupResults.length,
        status,
        statusClass,
        setMedian,
        setRange,
        qualityMedian: qualities.length > 0 ? percentileFromSorted(qualities, 0.5) : NaN,
        maxHotPixels,
        maxGradient,
        flatArtifactIssues,
        outliers,
        exposureIssues,
        exposureChecked,
        temperatureIssues,
        temperatureChecked,
        keep,
        review,
        discard,
        warnings
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

function compatibilitySetSummaryLabel(issues, checked) {
  if (issues > 0) {
    return `${issues} issue${issues === 1 ? "" : "s"}`;
  }
  if (checked > 0) {
    return "OK";
  }
  return "n/a";
}

function renderCalibrationReport() {
  if (!calibrationReport) {
    return;
  }

  const summaries = calibrationGroupSummaries();
  if (summaries.length === 0) {
    calibrationReport.hidden = true;
    calibrationReport.innerHTML = "";
    return;
  }

  const totalFrames = summaries.reduce((sum, item) => sum + item.count, 0);
  const issueSets = summaries.filter((item) => item.status !== "OK").length;
  calibrationReport.hidden = false;
  calibrationReport.innerHTML = `
    <div class="calibration-report-header">
      <div>
        <p class="section-label">Calibration Report</p>
        <p class="calibration-report-note">${totalFrames} calibration frame(s) across ${summaries.length} set(s). ${issueSets} set(s) need review.</p>
      </div>
    </div>
    <div class="calibration-report-grid">
      ${summaries
        .map(
          (item) => `
            <article class="calibration-set-card ${item.statusClass}">
              <div class="calibration-set-heading">
                <div>
                  <p class="calibration-set-title">${escapeHtml(item.label)}</p>
                  <p class="calibration-set-subtitle">${item.count >= 3 ? "Set consistency checked" : "Set consistency needs 3+ frames"}</p>
                </div>
                <span class="quality-pill ${item.status === "OK" ? "quality-high" : item.status === "Review" ? "quality-mid" : "quality-low"}">${item.status}</span>
              </div>
              <div class="calibration-set-metrics">
                <div class="calibration-set-metric"><span>Frames</span><strong>${item.count}</strong></div>
                <div class="calibration-set-metric"><span>Median</span><strong>${formatMetric(item.setMedian, 1)}%</strong></div>
                <div class="calibration-set-metric"><span>Range</span><strong>${formatMetric(item.setRange, 1)}%</strong></div>
                <div class="calibration-set-metric"><span>Quality</span><strong>${formatMetric(item.qualityMedian, 0)}</strong></div>
                <div class="calibration-set-metric"><span>Outliers</span><strong>${item.outliers}</strong></div>
                <div class="calibration-set-metric"><span>Keep</span><strong>${item.keep}/${item.review}/${item.discard}</strong></div>
                <div class="calibration-set-metric"><span>Exp Match</span><strong>${compatibilitySetSummaryLabel(item.exposureIssues, item.exposureChecked)}</strong></div>
                <div class="calibration-set-metric"><span>Temp Match</span><strong>${compatibilitySetSummaryLabel(item.temperatureIssues, item.temperatureChecked)}</strong></div>
                <div class="calibration-set-metric"><span>Hot Px</span><strong>${formatMetric(item.maxHotPixels, 3)}%</strong></div>
                <div class="calibration-set-metric"><span>Gradient</span><strong>${formatMetric(item.maxGradient, 1)}%</strong></div>
                <div class="calibration-set-metric"><span>Artefacts</span><strong>${item.flatArtifactIssues || 0}</strong></div>
                <div class="calibration-set-metric"><span>Warnings</span><strong>${item.warnings.length}</strong></div>
              </div>
              <div class="calibration-set-warnings">
                ${
                  item.warnings.length > 0
                    ? item.warnings.map((warning) => `<span class="calibration-set-warning">${escapeHtml(warning)}</span>`).join("")
                    : `<span class="calibration-set-warning">No calibration warnings</span>`
                }
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderResults(results = visibleResults()) {
  resultsBody.innerHTML = "";

  for (const result of results) {
    const key = getResultKey(result);
    const checked = state.selectedKeys.has(key) ? "checked" : "";
    const selectedClass = checked ? " selected" : "";
    const recommendation = recommendationFor(result);
    const card = document.createElement("article");
    card.className = `result-card${selectedClass}`;
    card.innerHTML = `
      <div class="result-visual">
        <label class="card-select" title="Select image">
          <input class="row-check" type="checkbox" data-key="${escapeHtml(key)}" ${checked} aria-label="Select ${escapeHtml(result.fileName)}">
        </label>
        <button class="preview-button" type="button" data-key="${escapeHtml(key)}" aria-label="Open preview for ${escapeHtml(result.fileName)}">
          <img class="preview" src="${result.thumbnail}" alt="Preview for ${escapeHtml(result.fileName)}">
          ${haloPreviewMarkup(result)}
          ${flatHistogramMarkup(result)}
        </button>
        <div class="image-badges">
          <span class="type-pill">${escapeHtml(result.frameType || unknownFrameTypeName)}</span>
          <span class="filter-pill">${escapeHtml(result.filterName || unknownFilterName)}</span>
          <span class="quality-pill ${qualityClass(result)}">${result.quality}</span>
          <span class="recommendation-pill">${recommendation}</span>
        </div>
      </div>
      <div class="result-analysis">
        <div class="result-heading">
          <p class="file-name">${escapeHtml(result.fileName)}</p>
          <span class="quality-pill ${qualityClass(result)}">${result.quality}</span>
        </div>
        <div class="metric-grid">
          ${metricsMarkup(result)}
        </div>
        ${warningMarkup(result)}
        ${scoreBreakdownMarkup(result)}
      </div>
    `;
    resultsBody.appendChild(card);
  }

  updateSelectAllState();
  updateSelectionControls();
}

function findResultByKey(key) {
  return state.results.find((result) => getResultKey(result) === key) || null;
}

function fittedZoomWidth() {
  const naturalWidth = zoomImage.naturalWidth || 1;
  const naturalHeight = zoomImage.naturalHeight || 1;
  const stageWidth = zoomStage ? zoomStage.clientWidth : 0;
  const stageHeight = zoomStage ? zoomStage.clientHeight : 0;

  if (stageWidth <= 0 || stageHeight <= 0 || naturalWidth <= 1 || naturalHeight <= 1) {
    return Math.max(naturalWidth, stageWidth, 1);
  }

  const fitScale = Math.min(stageWidth / naturalWidth, stageHeight / naturalHeight, 1);
  return Math.max(1, naturalWidth * fitScale);
}

function activeZoomResult() {
  return state.zoomedKey ? findResultByKey(state.zoomedKey) : null;
}

function getZoomLensMagnification() {
  const value = Number(zoomMagnifierPower ? zoomMagnifierPower.value : defaultZoomLensMagnification);
  return [2, 4, 8].includes(value) ? value : defaultZoomLensMagnification;
}

function selectedOverlayStar(result = activeZoomResult()) {
  if (!result || isCalibrationFrame(result) || state.selectedOverlayStarId === null) {
    return null;
  }
  return (result.starOverlay?.stars || []).find((star) => star.id === state.selectedOverlayStarId) || null;
}

function updateZoomStatus(result = activeZoomResult(), fallbackStatus = "") {
  if (!zoomStatus) {
    return;
  }
  const star = selectedOverlayStar(result);
  if (star) {
    const trailText =
      Number.isFinite(star.trailAxisRatio) && star.trailAxisRatio > 1.25
        ? `, trail ratio ${formatMetric(star.trailAxisRatio, 2)}`
        : "";
    const cornerText = star.cornerIssue ? ", corner shape warning" : "";
    zoomStatus.textContent = `Star HFR ${formatMetric(star.hfr, 2)} px, FWHM ${formatMetric(star.minorFwhm, 2)} / ${formatMetric(star.majorFwhm, 2)} px, roundness ${formatMetric(star.roundness * 100, 1)}%${trailText}${cornerText}`;
    return;
  }
  if (fallbackStatus) {
    zoomStatus.textContent = fallbackStatus;
    return;
  }
  if (!result) {
    zoomStatus.textContent = "";
    return;
  }
  zoomStatus.textContent = result && result.zoomDetail ? "High-resolution detail view" : "Preparing high-resolution detail view...";
}

function clearZoomStarOverlay() {
  if (!zoomStarOverlay) {
    return;
  }
  const context = zoomStarOverlay.getContext("2d");
  if (context) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, zoomStarOverlay.width, zoomStarOverlay.height);
  }
  zoomStarOverlay.hidden = true;
}

function updateStarOverlayButton() {
  if (!zoomStarOverlayBtn) {
    return;
  }
  const result = activeZoomResult();
  const supported = !!result && !isCalibrationFrame(result) && (result.starOverlay?.stars || []).length > 0;
  zoomStarOverlayBtn.disabled = !supported;
  zoomStarOverlayBtn.classList.toggle("active", supported && state.starOverlayActive);
  zoomStarOverlayBtn.setAttribute("aria-pressed", String(supported && state.starOverlayActive));
  zoomStarOverlayBtn.title = supported
    ? "Show guide and reference stars"
    : "Star overlay is only available for light frames";
}

function drawZoomStarOverlay() {
  updateStarOverlayButton();
  const result = activeZoomResult();
  if (!zoomStarOverlay || !state.starOverlayActive || !result || isCalibrationFrame(result)) {
    clearZoomStarOverlay();
    return;
  }

  const stars = result?.starOverlay?.stars || [];
  if (!result || !zoomImage.src || zoomImage.clientWidth <= 1 || zoomImage.clientHeight <= 1) {
    clearZoomStarOverlay();
    return;
  }

  const cssWidth = zoomImage.clientWidth;
  const cssHeight = zoomImage.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  zoomStarOverlay.hidden = false;
  zoomStarOverlay.style.left = `${zoomImage.offsetLeft}px`;
  zoomStarOverlay.style.top = `${zoomImage.offsetTop}px`;
  zoomStarOverlay.style.width = `${cssWidth}px`;
  zoomStarOverlay.style.height = `${cssHeight}px`;

  const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));
  const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));
  if (zoomStarOverlay.width !== pixelWidth || zoomStarOverlay.height !== pixelHeight) {
    zoomStarOverlay.width = pixelWidth;
    zoomStarOverlay.height = pixelHeight;
  }

  const context = zoomStarOverlay.getContext("2d");
  if (!context) {
    return;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, cssWidth, cssHeight);

  const haloMarkers =
    result.haloSeverity === "Possible" || result.haloSeverity === "Likely" ? result.haloMarkers || [] : [];
  if (haloMarkers.length > 0) {
    context.strokeStyle = "rgba(245, 158, 11, 0.96)";
    context.lineWidth = 2;
    for (const marker of haloMarkers) {
      const x = marker.x * cssWidth;
      const y = marker.y * cssHeight;
      const radiusX = Math.max(marker.radiusX * cssWidth, 14);
      const radiusY = Math.max(marker.radiusY * cssHeight, 14);
      context.beginPath();
      context.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
      context.stroke();
      context.lineWidth = 1.2;
      context.beginPath();
      context.ellipse(x, y, radiusX * 0.72, radiusY * 0.72, 0, 0, Math.PI * 2);
      context.stroke();
      context.lineWidth = 2;
    }
  }

  const starById = new Map(stars.map((star) => [star.id, star]));
  const pairs = result.starOverlay?.repeatPairs || [];
  if (pairs.length > 0) {
    context.strokeStyle = "rgba(250, 204, 21, 0.68)";
    context.lineWidth = 1.1;
    for (const pair of pairs) {
      const a = starById.get(pair.a);
      const b = starById.get(pair.b);
      if (!a || !b) {
        continue;
      }
      context.beginPath();
      context.moveTo(a.x * cssWidth, a.y * cssHeight);
      context.lineTo(b.x * cssWidth, b.y * cssHeight);
      context.stroke();
    }
  }

  const manyStars = stars.length > 7000;
  for (const star of stars) {
    const selected = star.id === state.selectedOverlayStarId;
    const radius = selected ? 7 : star.repeated ? 4.8 : star.elongated ? 4 : star.cornerIssue ? 3.6 : manyStars ? 2 : 2.8;
    context.strokeStyle = selected
      ? "rgba(255, 255, 255, 0.98)"
      : star.repeated
        ? "rgba(250, 204, 21, 0.92)"
        : star.elongated
          ? "rgba(248, 113, 113, 0.88)"
          : star.cornerIssue
            ? "rgba(251, 146, 60, 0.94)"
            : "rgba(45, 212, 191, 0.72)";
    context.lineWidth = selected ? 2.2 : 1.2;
    context.beginPath();
    context.arc(star.x * cssWidth, star.y * cssHeight, radius, 0, Math.PI * 2);
    context.stroke();
  }
}

function scheduleZoomStarOverlayDraw() {
  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(drawZoomStarOverlay);
    return;
  }
  drawZoomStarOverlay();
}

function setStarOverlayActive(active) {
  const result = activeZoomResult();
  state.starOverlayActive = !!active && !!result && !isCalibrationFrame(result);
  state.selectedOverlayStarId = null;
  updateStarOverlayButton();
  saveSettings();
  scheduleZoomStarOverlayDraw();
  updateZoomStatus();
}

function nearestOverlayStar(event) {
  const result = activeZoomResult();
  const stars = result?.starOverlay?.stars || [];
  if (!result || isCalibrationFrame(result) || stars.length === 0 || !zoomImage.src) {
    return null;
  }

  const rect = zoomImage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
    return null;
  }

  let bestStar = null;
  let bestDistanceSq = Number.POSITIVE_INFINITY;
  for (const star of stars) {
    const dx = star.x * rect.width - x;
    const dy = star.y * rect.height - y;
    const distanceSq = dx * dx + dy * dy;
    if (distanceSq < bestDistanceSq) {
      bestDistanceSq = distanceSq;
      bestStar = star;
    }
  }

  const maxDistance = Math.max(12, Math.min(24, Math.max(rect.width, rect.height) / 90));
  return bestStar && bestDistanceSq <= maxDistance * maxDistance ? bestStar : null;
}

function setZoomLevel(value) {
  const zoom = clamp(Number(value) || 100, 100, 800);
  zoomRange.value = String(zoom);
  zoomValue.textContent = `${zoom}%`;

  if (zoom === 100) {
    zoomImage.classList.add("fit");
    zoomImage.style.width = "";
    updateZoomLensBackground();
    scheduleZoomStarOverlayDraw();
    return;
  }

  zoomImage.classList.remove("fit");
  zoomImage.style.width = `${Math.round(fittedZoomWidth() * (zoom / 100))}px`;
  updateZoomLensBackground();
  scheduleZoomStarOverlayDraw();
}

function updateZoomContent(result) {
  zoomTitle.textContent = result.fileName;
  zoomImage.src = result.zoomDetail || result.thumbnail;
  zoomImage.alt = `Zoomed preview for ${result.fileName}`;
  zoomMetrics.innerHTML = metricsMarkup(result);
  updateZoomStatus(result);
  updateZoomLensBackground();
  scheduleZoomStarOverlayDraw();
}

async function prepareZoomDetail(result, requestId) {
  if (result.zoomDetail) {
    if (state.zoomRequestId === requestId && state.zoomedKey === getResultKey(result)) {
      updateZoomContent(result);
      setZoomLevel(zoomRange.value);
    }
    return;
  }

  try {
    const dataUrl = await buildZoomDetailDataUrl(result);
    result.zoomDetail = dataUrl;
    if (state.zoomRequestId !== requestId || state.zoomedKey !== getResultKey(result)) {
      return;
    }
    zoomImage.src = dataUrl;
    updateZoomStatus(result, "High-resolution detail view");
    setZoomLevel(zoomRange.value);
  } catch (error) {
    if (state.zoomRequestId === requestId) {
      updateZoomStatus(result, "Using grid preview");
    }
  }
}

function openZoom(result) {
  state.zoomedKey = getResultKey(result);
  state.selectedOverlayStarId = null;
  state.zoomRequestId += 1;
  updateZoomContent(result);
  zoomOverlay.hidden = false;
  document.body.classList.add("modal-open");
  setZoomLevel(100);
  prepareZoomDetail(result, state.zoomRequestId);
  zoomCloseBtn.focus();
}

function closeZoom() {
  state.zoomedKey = null;
  state.zoomRequestId += 1;
  zoomOverlay.hidden = true;
  zoomImage.removeAttribute("src");
  zoomImage.alt = "";
  zoomMetrics.innerHTML = "";
  if (zoomStatus) {
    zoomStatus.textContent = "";
  }
  clearZoomStarOverlay();
  hideZoomLens();
  document.body.classList.remove("modal-open");
}

function hideZoomLens() {
  if (zoomLens) {
    zoomLens.hidden = true;
  }
}

function updateZoomLensBackground() {
  if (!zoomLens || !zoomImage.src) {
    return;
  }
  zoomLens.style.backgroundImage = `url("${zoomImage.currentSrc || zoomImage.src}")`;
  zoomLens.style.backgroundSize = "";
}

function setMagnifierActive(active) {
  state.magnifierActive = active;
  if (zoomMagnifierBtn) {
    zoomMagnifierBtn.classList.toggle("active", active);
    zoomMagnifierBtn.setAttribute("aria-pressed", String(active));
  }
  if (!active) {
    hideZoomLens();
    return;
  }
  updateZoomLensBackground();
}

function updateZoomLens(event) {
  if (!state.magnifierActive || !zoomLens || zoomOverlay.hidden || !zoomImage.src) {
    hideZoomLens();
    return;
  }

  const imageRect = zoomImage.getBoundingClientRect();
  const x = event.clientX - imageRect.left;
  const y = event.clientY - imageRect.top;

  if (x < 0 || y < 0 || x > imageRect.width || y > imageRect.height) {
    hideZoomLens();
    return;
  }

  zoomLens.hidden = false;
  zoomLens.style.left = `${event.clientX - zoomLensSize / 2}px`;
  zoomLens.style.top = `${event.clientY - zoomLensSize / 2}px`;
  const magnification = getZoomLensMagnification();
  zoomLens.style.backgroundSize = `${imageRect.width * magnification}px ${imageRect.height * magnification}px`;
  zoomLens.style.backgroundPosition = `-${x * magnification - zoomLensSize / 2}px -${
    y * magnification - zoomLensSize / 2
  }px`;
}

function yieldToBrowser() {
  return new Promise((resolve) => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => resolve(), { timeout: 80 });
      return;
    }
    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(() => resolve());
      return;
    }
    window.setTimeout(resolve, 0);
  });
}

function previewRefreshChunkSize(count) {
  if (count >= 1000) {
    return 8;
  }
  if (count >= 500) {
    return 12;
  }
  if (count >= 200) {
    return 18;
  }
  return 30;
}

function updatePreviewImagesForResults(changedResults) {
  if (!resultsBody || changedResults.length === 0) {
    return;
  }

  const thumbnails = new Map(changedResults.map((result) => [getResultKey(result), result.thumbnail]));
  const buttons = resultsBody.querySelectorAll(".preview-button");
  for (const button of buttons) {
    const thumbnail = thumbnails.get(button.dataset.key);
    if (!thumbnail) {
      continue;
    }
    const image = button.querySelector("img.preview");
    if (image) {
      image.src = thumbnail;
    }
  }
}

function cancelPreviewRefresh() {
  if (state.previewRefreshTimer) {
    window.clearTimeout(state.previewRefreshTimer);
    state.previewRefreshTimer = null;
  }
  state.previewRefreshRunId += 1;
}

async function refreshCurrentPreviews(doneText = "Preview stretch refreshed.") {
  if (state.results.length === 0) {
    return;
  }

  const runId = state.previewRefreshRunId + 1;
  state.previewRefreshRunId = runId;
  const results = state.results.slice();
  const total = results.length;
  const chunkSize = previewRefreshChunkSize(total);
  let processed = 0;
  let lastStatusAt = 0;

  setTransientStatus(`Refreshing stretched previews... 0/${total}`);

  for (let index = 0; index < results.length; index += chunkSize) {
    if (runId !== state.previewRefreshRunId) {
      return;
    }

    const chunk = results.slice(index, index + chunkSize);
    for (const result of chunk) {
      refreshResultThumbnail(result);
      result.zoomDetail = "";
    }
    updatePreviewImagesForResults(chunk);
    processed += chunk.length;

    const now = Date.now();
    if (now - lastStatusAt > 250 || processed >= total) {
      setTransientStatus(`Refreshing stretched previews... ${processed}/${total}`);
      lastStatusAt = now;
    }

    await yieldToBrowser();
  }

  if (runId !== state.previewRefreshRunId) {
    return;
  }

  if (state.zoomedKey) {
    const result = findResultByKey(state.zoomedKey);
    if (result) {
      state.zoomRequestId += 1;
      updateZoomContent(result);
      prepareZoomDetail(result, state.zoomRequestId);
    }
  }

  setSummaryMessage(doneText);
}

function schedulePreviewRefresh(delay = 260, doneText = "Preview stretch refreshed.") {
  cancelPreviewRefresh();
  state.previewRefreshTimer = window.setTimeout(() => {
    state.previewRefreshTimer = null;
    refreshCurrentPreviews(doneText).catch(() => {
      setSummaryMessage("Preview refresh failed.");
    });
  }, delay);
}

function onPreviewStretchChanged() {
  updatePreviewStretchLabel();
  saveSettings();
  if (state.results.length === 0) {
    return;
  }

  schedulePreviewRefresh();
}

function updateSummary(results, totalFiles, unsupportedFiles) {
  state.lastTotalFiles = totalFiles;
  state.lastUnsupportedFiles = unsupportedFiles;
  const runNote = state.lastAnalysisRunNote ? `${state.lastAnalysisRunNote} ` : "";

  if (results.length === 0) {
    const ignoredText = unsupportedFiles > 0 ? ` Ignored ${unsupportedFiles} non-frame/system file(s).` : "";
    state.analysisSummaryText = `${runNote}Processed 0 astronomy frames.${ignoredText}`;
    setSummaryMessage();
    return;
  }
  const keepers = results.filter((r) => recommendationFor(r) === "Keep").length;
  const review = results.filter((r) => recommendationFor(r) === "Review").length;
  const discard = results.length - keepers - review;
  const trackingAlerts = results.filter(
    (result) =>
      !isCalibrationFrame(result) && (result.trackingSeverity === "Possible" || result.trackingSeverity === "Severe")
  ).length;
  const repeatDriftAlerts = results.filter(
    (result) =>
      !isCalibrationFrame(result) &&
      (result.trackingSeverity === "Possible" || result.trackingSeverity === "Severe") &&
      (result.trackingReason === "Repeat drift" || result.trackingReason === "Trailing + Repeat drift")
  ).length;
  const haloWarnings = results.filter(
    (result) => !isCalibrationFrame(result) && (result.haloSeverity === "Possible" || result.haloSeverity === "Likely")
  ).length;
  const cloudWarnings = results.filter(
    (result) => !isCalibrationFrame(result) && (result.cloudSeverity === "Possible" || result.cloudSeverity === "Likely")
  ).length;
  const sharpnessModeLabel = getSharpnessMode() === "fwhm" ? "FWHM only" : "Hybrid";
  const analysisModeText = analysisModeSummary(results);
  const haloPenaltyText = haloPenaltyEnabled() ? "on" : "off";
  const typeText = frameTypeStats(results).map((stat) => `${stat.frameType}: ${stat.count}`).join(", ");
  const stats = filterStats(results);
  const filterText = stats.map((stat) => `${stat.filterName}: ${stat.count}`).join(", ");
  const objectStats = objectShotStats(results);
  const showObjectSummary =
    objectStats.some((stat) => stat.objectShotKey !== unknownObjectShotKey) || objectStats.length > 1;
  const objectText =
    showObjectSummary ? ` Object shots: ${objectStats.map((stat) => `${stat.label}: ${stat.count}`).join(", ")}.` : "";
  const mixedFilterText = stats.length > 1 ? " Scores are normalised within each filter." : "";
  const mixedObjectText =
    objectStats.filter((stat) => stat.objectShotKey !== unknownObjectShotKey).length > 1
      ? " Light scores are normalised within each object shot."
      : "";
  const ignoredText = unsupportedFiles > 0 ? ` Ignored ${unsupportedFiles} non-frame/system file(s).` : "";
  state.analysisSummaryText = `${runNote}Processed ${results.length} astronomy frame(s).${ignoredText} Types: ${typeText}. Filters: ${filterText}.${objectText} Keep: ${keepers}, Review: ${review}, Discard: ${discard}. Tracking alerts: ${trackingAlerts} (repeat-drift: ${repeatDriftAlerts}). Cloud warnings: ${cloudWarnings}. Halo warnings: ${haloWarnings}. Halo penalty: ${haloPenaltyText}. Sharpness mode: ${sharpnessModeLabel}. Analysis mode: ${analysisModeText}.${mixedFilterText}${mixedObjectText}`;
  setSummaryMessage();
}

function renderAnalysisView() {
  renderFilterPanel();
  renderCalibrationReport();
  renderResults(visibleResults());
  updateSummary(state.results, state.lastTotalFiles || state.results.length, state.lastUnsupportedFiles || 0);
}

function cancelScoreRefresh() {
  if (state.scoreRefreshTimer) {
    window.clearTimeout(state.scoreRefreshTimer);
    state.scoreRefreshTimer = null;
  }
}

function rescoreCurrentResults() {
  if (state.results.length === 0) {
    return;
  }
  state.lastAnalysisRunNote = "";
  computeFinalScores(state.results);
  state.results.sort((a, b) => b.quality - a.quality);
  renderAnalysisView();
}

function scheduleScoreRefresh(delay = 220) {
  if (state.results.length === 0) {
    return;
  }
  cancelScoreRefresh();
  state.scoreRefreshTimer = window.setTimeout(() => {
    state.scoreRefreshTimer = null;
    rescoreCurrentResults();
  }, delay);
}

function prepareCanvas(imageBitmap, maxDimension = previewMaxDimension) {
  const scale = Math.min(1, maxDimension / Math.max(imageBitmap.width, imageBitmap.height));
  const width = Math.max(64, Math.round(imageBitmap.width * scale));
  const height = Math.max(64, Math.round(imageBitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx, width, height };
}

function parseFitsValue(rawValue) {
  const value = rawValue.trim();
  if (!value) {
    return null;
  }

  if (value.startsWith("'")) {
    const endQuoteIndex = value.indexOf("'", 1);
    if (endQuoteIndex > 0) {
      return value.slice(1, endQuoteIndex);
    }
    return value.slice(1);
  }

  if (value === "T") {
    return true;
  }
  if (value === "F") {
    return false;
  }

  const numeric = Number(value.replace(/[dD]/g, "E"));
  if (Number.isFinite(numeric)) {
    return numeric;
  }
  return value;
}

function parseFitsHeader(bytes) {
  const decoder = new TextDecoder("ascii");
  const header = {};
  let offset = 0;
  let foundEnd = false;

  while (offset + 80 <= bytes.length) {
    const card = decoder.decode(bytes.subarray(offset, offset + 80));
    offset += 80;

    const keyword = card.slice(0, 8).trim();
    if (keyword === "END") {
      foundEnd = true;
      break;
    }
    if (!keyword || card[8] !== "=") {
      continue;
    }

    const valueField = card.slice(10, 80);
    let inQuote = false;
    let rawValue = "";
    for (let i = 0; i < valueField.length; i += 1) {
      const character = valueField[i];
      if (character === "'") {
        inQuote = !inQuote;
      }
      if (character === "/" && !inQuote) {
        break;
      }
      rawValue += character;
    }

    header[keyword] = parseFitsValue(rawValue);
  }

  if (!foundEnd) {
    throw new Error("Invalid FITS header: missing END card.");
  }

  const dataOffset = Math.ceil(offset / 2880) * 2880;
  return { header, dataOffset };
}

function readFitsPixel(dataView, byteOffset, bitpix) {
  if (bitpix === 8) {
    return dataView.getUint8(byteOffset);
  }
  if (bitpix === 16) {
    return dataView.getInt16(byteOffset, false);
  }
  if (bitpix === 32) {
    return dataView.getInt32(byteOffset, false);
  }
  if (bitpix === 64) {
    if (typeof dataView.getBigInt64 !== "function") {
      throw new Error("64-bit integer FITS is not supported in this browser.");
    }
    return Number(dataView.getBigInt64(byteOffset, false));
  }
  if (bitpix === -32) {
    return dataView.getFloat32(byteOffset, false);
  }
  if (bitpix === -64) {
    return dataView.getFloat64(byteOffset, false);
  }
  throw new Error(`Unsupported BITPIX ${bitpix}.`);
}

function fitsIntegerRawRange(bitpix) {
  if (bitpix === 8) {
    return { min: 0, max: 255 };
  }
  if (bitpix === 16) {
    return { min: -32768, max: 32767 };
  }
  if (bitpix === 32) {
    return { min: -2147483648, max: 2147483647 };
  }
  return null;
}

function fitsSaturationLevels(bitpix, bscale, bzero) {
  const range = fitsIntegerRawRange(bitpix);
  if (!range || !Number.isFinite(bscale) || bscale === 0 || !Number.isFinite(bzero)) {
    return {
      low: Number.NEGATIVE_INFINITY,
      high: Number.POSITIVE_INFINITY,
      clippingThreshold: Number.POSITIVE_INFINITY,
      nearSaturationThreshold: Number.POSITIVE_INFINITY
    };
  }

  const scaledMin = range.min * bscale + bzero;
  const scaledMax = range.max * bscale + bzero;
  const high = Math.max(scaledMin, scaledMax);
  const low = Math.min(scaledMin, scaledMax);
  const span = Math.max(high - low, Math.abs(bscale), 1);
  return {
    low,
    high,
    clippingThreshold: high - Math.max(Math.abs(bscale) * 3, span * 0.00001),
    nearSaturationThreshold: high - Math.max(Math.abs(bscale) * 3, span * 0.005)
  };
}

function decodeXmlEntities(value) {
  return String(value ?? "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseXmlAttributes(attributeText) {
  const attributes = {};
  const pattern = /([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let match = pattern.exec(attributeText || "");
  while (match) {
    attributes[match[1]] = decodeXmlEntities(match[2] !== undefined ? match[2] : match[3]);
    match = pattern.exec(attributeText || "");
  }
  return attributes;
}

function xmlAttribute(attributes, name) {
  if (!attributes) {
    return "";
  }
  if (Object.prototype.hasOwnProperty.call(attributes, name)) {
    return attributes[name];
  }
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(attributes)) {
    if (key.toLowerCase() === lowerName) {
      return attributes[key];
    }
  }
  return "";
}

function stripXmlTags(value) {
  return decodeXmlEntities(String(value || "").replace(/<[^>]*>/g, "").trim());
}

function findXisfImageDescriptors(xmlText) {
  const descriptors = [];
  const pattern = /<(?:(?:[A-Za-z_][\w.-]*):)?Image\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:(?:[A-Za-z_][\w.-]*):)?Image>)/gi;
  let match = pattern.exec(xmlText || "");
  while (match) {
    descriptors.push({
      xml: match[0],
      body: match[2] || "",
      attributes: parseXmlAttributes(match[1] || "")
    });
    match = pattern.exec(xmlText || "");
  }
  return descriptors;
}

function parseXisfGeometry(geometryText) {
  const parts = String(geometryText || "")
    .split(":")
    .map((part) => Math.trunc(Number(part.trim())));
  const width = parts[0];
  const height = parts[1];
  const channels = parts[2] || 1;
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    !Number.isFinite(channels) ||
    width <= 0 ||
    height <= 0 ||
    channels <= 0
  ) {
    throw new Error("XISF image geometry is missing or invalid.");
  }
  return { width, height, channels };
}

function parseXisfLocation(locationText) {
  const parts = String(locationText || "").split(":");
  if (parts.length < 3 || parts[0].toLowerCase() !== "attachment") {
    throw new Error("Only monolithic XISF files with attached image data are supported.");
  }
  const position = Math.trunc(Number(parts[1]));
  const size = Math.trunc(Number(parts[2]));
  if (!Number.isFinite(position) || !Number.isFinite(size) || position < 0 || size <= 0) {
    throw new Error("XISF image attachment location is invalid.");
  }
  return { position, size };
}

function xisfSampleFormatInfo(sampleFormat) {
  const normalized = String(sampleFormat || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");
  const formats = {
    uint8: { kind: "uint", bits: 8, bytes: 1 },
    int8: { kind: "int", bits: 8, bytes: 1 },
    uint16: { kind: "uint", bits: 16, bytes: 2 },
    int16: { kind: "int", bits: 16, bytes: 2 },
    uint32: { kind: "uint", bits: 32, bytes: 4 },
    int32: { kind: "int", bits: 32, bytes: 4 },
    float32: { kind: "float", bits: 32, bytes: 4 },
    real32: { kind: "float", bits: 32, bytes: 4 },
    float64: { kind: "float", bits: 64, bytes: 8 },
    real64: { kind: "float", bits: 64, bytes: 8 }
  };
  const info = formats[normalized];
  if (!info) {
    if (normalized === "uint64" || normalized === "int64") {
      throw new Error("64-bit integer XISF images are not supported in this browser.");
    }
    throw new Error(`Unsupported XISF sample format ${sampleFormat || "(missing)"}.`);
  }
  return { ...info, name: sampleFormat };
}

function parseXisfBounds(boundsText) {
  if (!boundsText) {
    return null;
  }
  const parts = String(boundsText)
    .split(":")
    .map((part) => Number(part.trim()));
  if (parts.length < 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1]) || parts[1] <= parts[0]) {
    return null;
  }
  return { low: parts[0], high: parts[1] };
}

function xisfIntegerSampleRange(formatInfo) {
  if (!formatInfo || formatInfo.kind === "float") {
    return null;
  }
  if (formatInfo.kind === "uint") {
    return {
      low: 0,
      high: Math.pow(2, formatInfo.bits) - 1
    };
  }
  return {
    low: -Math.pow(2, formatInfo.bits - 1),
    high: Math.pow(2, formatInfo.bits - 1) - 1
  };
}

function xisfSaturationLevels(formatInfo, bounds) {
  const range = formatInfo && formatInfo.kind === "float" ? bounds : xisfIntegerSampleRange(formatInfo);
  if (!range || !Number.isFinite(range.high) || !Number.isFinite(range.low) || range.high <= range.low) {
    return {
      low: Number.NEGATIVE_INFINITY,
      high: Number.POSITIVE_INFINITY,
      clippingThreshold: Number.POSITIVE_INFINITY,
      nearSaturationThreshold: Number.POSITIVE_INFINITY
    };
  }

  const span = Math.max(range.high - range.low, 1e-12);
  const unit = formatInfo.kind === "float" ? span * 0.000001 : 3;
  return {
    low: range.low,
    high: range.high,
    clippingThreshold: range.high - Math.max(unit, span * 0.00001),
    nearSaturationThreshold: range.high - Math.max(unit, span * 0.005)
  };
}

function readXisfSample(dataView, byteOffset, formatInfo, littleEndian) {
  if (formatInfo.kind === "uint") {
    if (formatInfo.bits === 8) {
      return dataView.getUint8(byteOffset);
    }
    if (formatInfo.bits === 16) {
      return dataView.getUint16(byteOffset, littleEndian);
    }
    if (formatInfo.bits === 32) {
      return dataView.getUint32(byteOffset, littleEndian);
    }
  }
  if (formatInfo.kind === "int") {
    if (formatInfo.bits === 8) {
      return dataView.getInt8(byteOffset);
    }
    if (formatInfo.bits === 16) {
      return dataView.getInt16(byteOffset, littleEndian);
    }
    if (formatInfo.bits === 32) {
      return dataView.getInt32(byteOffset, littleEndian);
    }
  }
  if (formatInfo.kind === "float") {
    if (formatInfo.bits === 32) {
      return dataView.getFloat32(byteOffset, littleEndian);
    }
    if (formatInfo.bits === 64) {
      return dataView.getFloat64(byteOffset, littleEndian);
    }
  }
  throw new Error(`Unsupported XISF sample format ${formatInfo.name || ""}.`);
}

function parseXisfFITSKeywords(xmlText, header) {
  const pattern = /<(?:(?:[A-Za-z_][\w.-]*):)?FITSKeyword\b([^>]*?)\/?>/gi;
  let match = pattern.exec(xmlText || "");
  while (match) {
    const attributes = parseXmlAttributes(match[1] || "");
    const name = cleanFilterName(xmlAttribute(attributes, "name")).toUpperCase();
    if (!name) {
      match = pattern.exec(xmlText || "");
      continue;
    }
    const rawValue = xmlAttribute(attributes, "value");
    const value = rawValue === "" ? "" : parseFitsValue(rawValue);
    if (!Object.prototype.hasOwnProperty.call(header, name)) {
      header[name] = value;
    }
    match = pattern.exec(xmlText || "");
  }
}

function setXisfHeaderAlias(header, key, value) {
  if (value === null || value === undefined || value === "") {
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(header, key)) {
    header[key] = value;
  }
}

function xisfFocalLengthMillimeters(value) {
  const numeric = numericMetadataValue(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return value;
  }
  return numeric <= 20 ? numeric * 1000 : numeric;
}

function xisfPixelSizeMicrons(value) {
  const numeric = numericMetadataValue(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return value;
  }
  return numeric < 0.1 ? numeric * 1000000 : numeric;
}

function addXisfPropertyAlias(header, id, value) {
  const segments = String(id || "")
    .toLowerCase()
    .split(/[:./_\s-]+/)
    .filter(Boolean);
  const compact = segments.join("");
  const last = segments[segments.length - 1] || "";
  const hasSegment = (segment) => segments.includes(segment);

  if (hasSegment("filter") && (last === "name" || last === "filter" || compact.includes("filtername"))) {
    setXisfHeaderAlias(header, "FILTER", value);
  }
  if ((hasSegment("object") || hasSegment("target")) && (last === "name" || last === "object" || last === "target")) {
    setXisfHeaderAlias(header, "OBJECT", value);
  }
  if (last === "ra" || last === "rightascension" || compact.endsWith("centerra")) {
    setXisfHeaderAlias(header, "RA", value);
  }
  if (last === "dec" || last === "declination" || compact.endsWith("centerdec")) {
    setXisfHeaderAlias(header, "DEC", value);
  }
  if (compact.includes("focallength")) {
    setXisfHeaderAlias(header, "FOCALLEN", xisfFocalLengthMillimeters(value));
  }
  if (compact.includes("pixelsize") || compact.includes("pixelpitch")) {
    setXisfHeaderAlias(header, "PIXSIZE", xisfPixelSizeMicrons(value));
  }
  if (compact.includes("exposuretime") || last === "exposure") {
    setXisfHeaderAlias(header, "EXPTIME", value);
  }
  if (compact.includes("binning")) {
    setXisfHeaderAlias(header, "BINNING", value);
  }
  if (
    compact.includes("temperature") &&
    (hasSegment("camera") || hasSegment("sensor") || hasSegment("ccd") || hasSegment("detector"))
  ) {
    setXisfHeaderAlias(header, "CCD-TEMP", value);
  }
  if (
    (hasSegment("camera") || hasSegment("sensor") || hasSegment("detector") || hasSegment("ccd")) &&
    (last === "model" || last === "name")
  ) {
    setXisfHeaderAlias(header, "CAMERA", value);
  }
  if ((hasSegment("frame") || hasSegment("image")) && (last === "type" || last === "kind")) {
    setXisfHeaderAlias(header, "IMAGETYP", value);
  }
}

function parseXisfPropertyValue(rawValue, type) {
  const text = decodeXmlEntities(rawValue).trim();
  if (!text) {
    return "";
  }
  const normalizedType = String(type || "").toLowerCase();
  if (normalizedType.includes("string") || normalizedType.includes("time")) {
    return text;
  }
  if (/^(true|false)$/i.test(text)) {
    return /^true$/i.test(text);
  }
  const numeric = Number(text.replace(/[dD]/g, "E"));
  return Number.isFinite(numeric) ? numeric : text;
}

function parseXisfProperties(xmlText, header) {
  const pattern = /<(?:(?:[A-Za-z_][\w.-]*):)?Property\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:(?:[A-Za-z_][\w.-]*):)?Property>)/gi;
  let match = pattern.exec(xmlText || "");
  while (match) {
    const attributes = parseXmlAttributes(match[1] || "");
    const id = cleanFilterName(xmlAttribute(attributes, "id"));
    if (!id) {
      match = pattern.exec(xmlText || "");
      continue;
    }
    const rawValue = xmlAttribute(attributes, "value") || stripXmlTags(match[2] || "");
    const value = parseXisfPropertyValue(rawValue, xmlAttribute(attributes, "type"));
    setXisfHeaderAlias(header, id, value);
    addXisfPropertyAlias(header, id, value);
    match = pattern.exec(xmlText || "");
  }
}

function parseXisfHeader(bytes, buffer) {
  if (bytes.length < 16) {
    throw new Error("Invalid XISF file: missing preamble.");
  }

  const asciiDecoder = new TextDecoder("ascii");
  const signature = asciiDecoder.decode(bytes.subarray(0, 8));
  if (signature !== "XISF0100") {
    throw new Error("Invalid XISF file: bad signature.");
  }

  const dataView = new DataView(buffer);
  const headerLength = dataView.getUint32(8, true);
  if (!Number.isFinite(headerLength) || headerLength <= 0 || headerLength > xisfMaxHeaderBytes) {
    throw new Error("Invalid XISF file: XML header length is unreasonable.");
  }
  if (16 + headerLength > bytes.length) {
    throw new Error("Invalid XISF file: XML header is truncated.");
  }

  const xml = new TextDecoder("utf-8").decode(bytes.subarray(16, 16 + headerLength));
  const imageDescriptors = findXisfImageDescriptors(xml);
  const image = imageDescriptors.find((descriptor) => {
    const location = xmlAttribute(descriptor.attributes, "location");
    return /^attachment:/i.test(location) && xmlAttribute(descriptor.attributes, "geometry");
  });
  if (!image) {
    throw new Error("XISF file does not contain a supported attached image.");
  }

  const compression = cleanFilterName(xmlAttribute(image.attributes, "compression"));
  if (compression && !/^(none|uncompressed)$/i.test(compression)) {
    throw new Error(`Compressed XISF image data (${compression}) is not supported yet.`);
  }

  const geometry = parseXisfGeometry(xmlAttribute(image.attributes, "geometry"));
  const location = parseXisfLocation(xmlAttribute(image.attributes, "location"));
  const sampleFormat = xisfSampleFormatInfo(xmlAttribute(image.attributes, "sampleFormat"));
  const bounds = parseXisfBounds(xmlAttribute(image.attributes, "bounds"));
  const byteOrder = cleanFilterName(xmlAttribute(image.attributes, "byteOrder")).toLowerCase();
  const littleEndian = !byteOrder || byteOrder.includes("little") || byteOrder === "lsb";
  if (byteOrder && !littleEndian && !byteOrder.includes("big") && byteOrder !== "msb") {
    throw new Error(`Unsupported XISF byte order ${byteOrder}.`);
  }
  const header = { __SOURCE_FORMAT: "XISF" };

  parseXisfFITSKeywords(image.xml, header);
  if (Object.keys(header).length <= 1) {
    parseXisfFITSKeywords(xml, header);
  }
  parseXisfProperties(xml, header);
  header.NAXIS = Math.max(2, geometry.channels > 1 ? 3 : 2);
  header.NAXIS1 = geometry.width;
  header.NAXIS2 = geometry.height;
  header.NAXIS3 = geometry.channels;

  return {
    header,
    geometry,
    location,
    sampleFormat,
    bounds,
    littleEndian
  };
}

function downsampleFloatImage(source, sourceWidth, sourceHeight, maxDimension = 1400) {
  const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(16, Math.round(sourceWidth * scale));
  const height = Math.max(16, Math.round(sourceHeight * scale));

  if (width === sourceWidth && height === sourceHeight) {
    return { gray: source, width, height };
  }

  const resized = new Float32Array(width * height);
  for (let y = 0; y < height; y += 1) {
    const sourceY0 = Math.floor((y * sourceHeight) / height);
    const sourceY1 = Math.min(sourceHeight, Math.max(sourceY0 + 1, Math.ceil(((y + 1) * sourceHeight) / height)));

    for (let x = 0; x < width; x += 1) {
      const sourceX0 = Math.floor((x * sourceWidth) / width);
      const sourceX1 = Math.min(sourceWidth, Math.max(sourceX0 + 1, Math.ceil(((x + 1) * sourceWidth) / width)));
      let sum = 0;
      let count = 0;

      for (let sourceY = sourceY0; sourceY < sourceY1; sourceY += 1) {
        const sourceRow = sourceY * sourceWidth;
        for (let sourceX = sourceX0; sourceX < sourceX1; sourceX += 1) {
          const value = source[sourceRow + sourceX];
          if (!Number.isFinite(value)) {
            continue;
          }
          sum += value;
          count += 1;
        }
      }

      resized[y * width + x] = count > 0 ? sum / count : NaN;
    }
  }

  return { gray: resized, width, height };
}

function percentileFromSorted(sortedValues, percentile) {
  if (sortedValues.length === 0) {
    return 0;
  }
  if (sortedValues.length === 1) {
    return sortedValues[0];
  }
  const position = (sortedValues.length - 1) * percentile;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) {
    return sortedValues[lower];
  }
  const weight = position - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function computeStretchBounds(values, lowPercentile = 0.01, highPercentile = 0.995) {
  const finiteSample = [];
  const maxSamples = 250000;
  const step = Math.max(1, Math.floor(values.length / maxSamples));

  for (let i = 0; i < values.length; i += step) {
    const value = values[i];
    if (Number.isFinite(value)) {
      finiteSample.push(value);
    }
    if (finiteSample.length >= maxSamples) {
      break;
    }
  }

  if (finiteSample.length === 0) {
    return { low: 0, high: 255 };
  }

  finiteSample.sort((a, b) => a - b);
  let low = percentileFromSorted(finiteSample, lowPercentile);
  let high = percentileFromSorted(finiteSample, highPercentile);

  if (!Number.isFinite(low) || !Number.isFinite(high) || high <= low) {
    low = finiteSample[0];
    high = finiteSample[finiteSample.length - 1];
  }
  if (!Number.isFinite(low) || !Number.isFinite(high) || high <= low) {
    high = low + 1;
  }

  return { low, high };
}

function stretchedByte(value, low, high, asinhStrength = 8, gamma = 0.95) {
  const normalized = clamp((value - low) / (high - low), 0, 1);
  if (asinhStrength <= 0.001) {
    return Math.round(clamp(Math.pow(normalized, gamma) * 255, 0, 255));
  }
  const asinhNormalized = Math.asinh(normalized * asinhStrength) / Math.asinh(asinhStrength);
  const gammaAdjusted = Math.pow(asinhNormalized, gamma);
  return Math.round(clamp(gammaAdjusted * 255, 0, 255));
}

function stretchedGrayscaleCanvasFromData(gray, width, height, settings = getPreviewStretchSettings()) {
  const { low, high } = computeStretchBounds(gray, settings.lowPercentile, settings.highPercentile);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const imageData = context.createImageData(width, height);

  for (let i = 0; i < gray.length; i += 1) {
    const value = stretchedByte(gray[i], low, high, settings.asinhStrength, settings.gamma);
    const index = i * 4;
    imageData.data[index] = value;
    imageData.data[index + 1] = value;
    imageData.data[index + 2] = value;
    imageData.data[index + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

function stretchedColorCanvasFromPixels(data, width, height, settings = getPreviewStretchSettings()) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (settings.neutral) {
    const original = context.createImageData(width, height);
    original.data.set(data);
    context.putImageData(original, 0, 0);
    return canvas;
  }

  const luma = new Float32Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    luma[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }

  const { low, high } = computeStretchBounds(luma, settings.lowPercentile, settings.highPercentile);
  const out = context.createImageData(width, height);

  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const originalLuma = luma[p];
    const targetLuma = stretchedByte(originalLuma, low, high, settings.asinhStrength, settings.gamma);
    const scale = originalLuma > 1e-6 ? targetLuma / originalLuma : 0;

    out.data[i] = clamp(data[i] * scale, 0, 255);
    out.data[i + 1] = clamp(data[i + 1] * scale, 0, 255);
    out.data[i + 2] = clamp(data[i + 2] * scale, 0, 255);
    out.data[i + 3] = 255;
  }

  context.putImageData(out, 0, 0);
  return canvas;
}

function stretchedColorCanvasFromImageData(imageData, width, height, settings = getPreviewStretchSettings()) {
  return stretchedColorCanvasFromPixels(imageData.data, width, height, settings);
}

function previewCanvasFromSource(previewSource) {
  if (previewSource.kind === "color") {
    return stretchedColorCanvasFromPixels(previewSource.data, previewSource.width, previewSource.height);
  }
  return stretchedGrayscaleCanvasFromData(previewSource.data, previewSource.width, previewSource.height);
}

function refreshResultThumbnail(result) {
  if (!result.previewSource) {
    return;
  }
  result.thumbnail = previewCanvasFromSource(result.previewSource).toDataURL("image/png");
}

function buildAnalysisResult(file, gray, width, height, previewSource, options = {}) {
  const analysisMode = normalizeAnalysisMode(options.analysisMode || getAnalysisMode());
  const analysisConfig = options.analysisConfig || getAnalysisModeConfig(analysisMode);
  const header = options.header || null;
  const filterInfo = options.filterInfo || detectFilterForFile(file, header);
  const frameTypeInfo = options.frameTypeInfo || detectFrameTypeForFile(file, header);
  const isCalibration = calibrationFrameTypes.has(frameTypeInfo.name);
  const exposureInfo = options.exposureInfo || detectExposureForFile(file, header);
  const temperatureInfo = options.temperatureInfo || detectTemperatureForFile(file, header);
  const cameraInfo = options.cameraInfo || detectCameraModelForFile(file, header);
  const targetInfo = options.targetInfo || detectTargetNameForFile(file, header);
  const coordinateInfo = options.coordinateInfo || detectCoordinatesForFile(file, header);
  const focalLengthInfo = options.focalLengthInfo || detectFocalLengthForFile(file, header);
  const pixelSizeInfo = options.pixelSizeInfo || detectPixelSizeForFile(file, header);
  const binningInfo = options.binningInfo || detectBinningForFile(file, header);
  const pixelScaleInfo =
    options.pixelScaleInfo || detectPixelScaleForFile(file, header, focalLengthInfo, pixelSizeInfo, binningInfo);
  const fullWidth = Number.isFinite(options.fullWidth) && options.fullWidth > 0 ? options.fullWidth : width;
  const fullHeight = Number.isFinite(options.fullHeight) && options.fullHeight > 0 ? options.fullHeight : height;
  const fieldOfView = fieldOfViewFromPixelScale(pixelScaleInfo.value, fullWidth, fullHeight);
  const darkOutlierProfile = darkOutlierProfileForCamera(cameraInfo.value);
  const saturationThreshold =
    Number.isFinite(options.saturationThreshold) && options.saturationThreshold > 0
      ? options.saturationThreshold
      : 252;
  const clippingThreshold =
    Number.isFinite(options.clippingThreshold) && options.clippingThreshold > 0
      ? options.clippingThreshold
      : bitmapClippingThreshold;
  const nearSaturationThreshold =
    Number.isFinite(options.nearSaturationThreshold) && options.nearSaturationThreshold > 0
      ? options.nearSaturationThreshold
      : bitmapNearSaturationThreshold;
  const basicStats = options.basicStats || computeBasicImageStats(gray, clippingThreshold, nearSaturationThreshold);
  const mean = basicStats.mean;
  const std = basicStats.std;
  const clippingStats =
    options.clippingStats || basicStats.clippingStats || computeHighlightClipping(gray, clippingThreshold, nearSaturationThreshold);
  const distribution = computeDistributionStats(
    gray,
    mean,
    std,
    saturationThreshold,
    analysisConfig.distributionMaxSamples
  );
  const backgroundStructureMetrics = computeCloudStructureMetrics(gray, width, height, mean, std, {
    tileSampleTarget: analysisConfig.cloudTileSamples
  });
  const calibrationOutlierMetrics = isCalibration
    ? computeCalibrationOutlierMetrics(gray, distribution, mean, std)
    : {
        brightOutlierPercent: 0,
        darkOutlierPercent: 0,
        brightOutlierThreshold: NaN,
        darkOutlierThreshold: NaN
      };
  const cloudMetrics = isCalibration
    ? {
        cloudStructureScore: 0,
        cloudBackgroundRangePercent: 0,
        cloudBackgroundRange: 0,
        cloudStripRangePercent: 0,
        cloudSmoothness: 0,
        tileSignature: []
      }
    : backgroundStructureMetrics;
  const starMetrics = isCalibration
    ? skippedStarTrackingMetrics()
    : computeStarRoundnessAndTracking(gray, width, height, mean, std, {
        metricScale: options.metricScale || 1,
        repeatDistanceScale: options.repeatDistanceScale || 1,
        repeatDriftMaxPairs: analysisConfig.repeatDriftMaxPairs,
        repeatDriftBrightStarLimit: analysisConfig.repeatDriftBrightStarLimit,
        trackingTrailStarLimit: analysisConfig.trackingTrailStarLimit,
        trackingTrailWindowRadius: analysisConfig.trackingTrailWindowRadius,
        starOverlayLimit: analysisConfig.starOverlayLimit,
        saturationThreshold,
        haloEnabled: true
      });
  const sharpnessGlobal = isCalibration
    ? NaN
    : computeLaplacianVariance(gray, width, height, { sampleTarget: analysisConfig.laplacianSampleTarget });
  const sharpnessStar = starMetrics.starSharpness;
  const result = {
    calculationVersion: appVersion,
    fileName: displayFilePath(file) || file.name,
    fileKey: fileIdentityKey(file),
    sourceFile: file,
    analysisMode,
    analysisPixelSource: options.analysisPixelSource || "working image",
    filterName: filterInfo.name || unknownFilterName,
    filterSource: filterInfo.source || "None",
    frameType: frameTypeInfo.name || unknownFrameTypeName,
    frameTypeSource: frameTypeInfo.source || "None",
    exposureSeconds: exposureInfo.value,
    exposureSource: exposureInfo.source || "None",
    cameraTemperatureC: temperatureInfo.value,
    temperatureSource: temperatureInfo.source || "None",
    cameraModel: cameraInfo.value || unknownCameraModelName,
    cameraModelSource: cameraInfo.source || "None",
    sensorOutlierProfile: darkOutlierProfile.name,
    targetName: targetInfo.value || unknownTargetName,
    targetSource: targetInfo.source || "None",
    raDegrees: coordinateInfo.raDegrees,
    raSource: coordinateInfo.raSource || "None",
    decDegrees: coordinateInfo.decDegrees,
    decSource: coordinateInfo.decSource || "None",
    focalLengthMm: focalLengthInfo.value,
    focalLengthSource: focalLengthInfo.source || "None",
    pixelSizeMicrons: pixelSizeInfo.value,
    pixelSizeSource: pixelSizeInfo.source || "None",
    binning: binningInfo.value,
    binningSource: binningInfo.source || "None",
    pixelScaleArcsecPerPixel: pixelScaleInfo.value,
    pixelScaleSource: pixelScaleInfo.source || "None",
    fieldWidthDegrees: fieldOfView.widthDeg,
    fieldHeightDegrees: fieldOfView.heightDeg,
    objectShotToleranceDeg: objectShotToleranceDegrees(pixelScaleInfo.value, fullWidth, fullHeight),
    objectShotKey: unknownObjectShotKey,
    objectShotLabel: unknownObjectShotLabel,
    objectShotIndex: 0,
    objectShotMemberCount: 0,
    objectShotReferenceRaDeg: NaN,
    objectShotReferenceDecDeg: NaN,
    objectShotSeparationDeg: NaN,
    width,
    height,
    sharpness: sharpnessStar,
    sharpnessGlobal,
    sharpnessStar,
    mean,
    std,
    median: distribution.median,
    meanPercent: distribution.meanPercent,
    medianPercent: distribution.medianPercent,
    spreadPercent: distribution.spreadPercent,
    noisePercent: distribution.noisePercent,
    noise: computeNoise(gray, width, height, mean, std, { sampleTarget: analysisConfig.noiseSampleTarget }),
    starRoundness: starMetrics.starRoundness,
    fwhmRoundness: starMetrics.fwhmRoundness,
    axisRoundness: starMetrics.axisRoundness,
    eccentricity: starMetrics.eccentricity,
    hfr: starMetrics.hfr,
    starCount: starMetrics.starCount,
    clipping: clippingStats.clippingPercent,
    nearSaturation: clippingStats.nearSaturationPercent,
    clippingPressure: clippingStats.clippingPressure,
    clippingScore: clippingStats.clippingScore,
    repeatDriftSource: starMetrics.repeatDriftSource,
    repeatDriftScore: starMetrics.repeatDriftScore,
    repeatedStarFraction: starMetrics.repeatedStarFraction,
    multiRepeatFraction: starMetrics.multiRepeatFraction,
    directionalTrailScore: starMetrics.directionalTrailScore,
    directionalTrailStarFraction: starMetrics.directionalTrailStarFraction,
    directionalTrailStarCount: starMetrics.directionalTrailStarCount,
    trackingSampleStarCount: starMetrics.trackingSampleStarCount,
    trackingSampleRegion: starMetrics.trackingSampleRegion,
    trackingScore: starMetrics.trackingScore,
    trackingSeverity: starMetrics.trackingSeverity,
    trackingReason: starMetrics.trackingReason,
    haloSeverity: starMetrics.haloSeverity,
    haloScore: starMetrics.haloScore,
    haloStarCount: starMetrics.haloStarCount,
    haloMeasuredStars: starMetrics.haloMeasuredStars,
    haloSummary: starMetrics.haloSummary,
    haloMarkers: starMetrics.haloMarkers || [],
    calibrationSetKey: "",
    calibrationSetMedianPercent: NaN,
    calibrationSetDeltaPercent: NaN,
    calibrationSetDeltaLimit: NaN,
    calibrationSetOutlier: false,
    calibrationExposureReferenceSeconds: NaN,
    calibrationExposureDeltaSeconds: NaN,
    calibrationExposureMatch: "Not checked",
    calibrationTemperatureReferenceC: NaN,
    calibrationTemperatureDeltaC: NaN,
    calibrationTemperatureMatch: "Not checked",
    calibrationCompatibilitySummary: "",
    calibrationBrightOutlierPercent: calibrationOutlierMetrics.brightOutlierPercent,
    calibrationDarkOutlierPercent: calibrationOutlierMetrics.darkOutlierPercent,
    calibrationBrightOutlierThreshold: calibrationOutlierMetrics.brightOutlierThreshold,
    calibrationDarkOutlierThreshold: calibrationOutlierMetrics.darkOutlierThreshold,
    calibrationStructureScore: backgroundStructureMetrics.cloudStructureScore,
    calibrationBackgroundRangePercent: backgroundStructureMetrics.cloudBackgroundRangePercent,
    calibrationTileSignature: backgroundStructureMetrics.tileSignature || [],
    calibrationSetSpreadDeltaPercent: NaN,
    calibrationSetGradientDeltaPercent: NaN,
    flatHistogramDistance: NaN,
    flatTileMismatchPercent: NaN,
    flatArtifactScore: 0,
    flatHistogram:
      frameTypeInfo.name === "Flat"
        ? computeLevelHistogram(gray, saturationThreshold, 72, analysisConfig.histogramMaxSamples)
        : null,
    cloudSeverity: "None",
    cloudScore: 0,
    cloudStructureScore: cloudMetrics.cloudStructureScore,
    cloudStarLossScore: 0,
    cloudMeanLiftScore: 0,
    cloudBackgroundRangePercent: cloudMetrics.cloudBackgroundRangePercent,
    cloudBackgroundRange: cloudMetrics.cloudBackgroundRange,
    cloudStripRangePercent: cloudMetrics.cloudStripRangePercent,
    cloudSmoothness: cloudMetrics.cloudSmoothness,
    cloudSummary: "No cloud warning",
    starOverlay: starMetrics.starOverlay || { stars: [], repeatPairs: [] },
    calibrationSeverity: "None",
    calibrationSummary: "",
    calibrationWarnings: [],
    elongation: isCalibration
      ? NaN
      : computeElongation(gray, width, height, mean, std, { sampleTarget: analysisConfig.elongationSampleTarget }),
    previewSource,
    zoomDetail: "",
    thumbnail: ""
  };
  refreshResultThumbnail(result);
  return result;
}

async function analyzeBitmapImageFile(file, analysisMode = getAnalysisMode(), analysisConfig = getAnalysisModeConfig(analysisMode)) {
  const bitmap = await createImageBitmap(file);
  const { canvas, ctx, width, height } = prepareCanvas(bitmap, analysisConfig.bitmapAnalysisMaxDimension);
  ctx.drawImage(bitmap, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  let previewImageData = imageData;
  let previewWidth = width;
  let previewHeight = height;
  if (Math.max(width, height) > previewMaxDimension) {
    const previewCanvas = prepareCanvas(bitmap, previewMaxDimension);
    previewCanvas.ctx.drawImage(bitmap, 0, 0, previewCanvas.width, previewCanvas.height);
    previewImageData = previewCanvas.ctx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
    previewWidth = previewCanvas.width;
    previewHeight = previewCanvas.height;
  }

  if (typeof bitmap.close === "function") {
    bitmap.close();
  }
  const gray = toLuma(imageData.data);
  const previewSource = {
    kind: "color",
    width: previewWidth,
    height: previewHeight,
    data: new Uint8ClampedArray(previewImageData.data)
  };
  return buildAnalysisResult(file, gray, width, height, previewSource, {
    analysisMode,
    analysisConfig,
    analysisPixelSource: "bitmap analysis canvas"
  });
}

async function readFitsFrame(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const { header, dataOffset } = parseFitsHeader(bytes);

  const bitpix = Math.trunc(Number(header.BITPIX));
  const naxis = Math.trunc(Number(header.NAXIS || 0));
  const width = Math.trunc(Number(header.NAXIS1 || 0));
  const height = Math.trunc(Number(header.NAXIS2 || 0));

  if (!Number.isFinite(bitpix) || ![8, 16, 32, 64, -32, -64].includes(bitpix)) {
    throw new Error("Unsupported FITS BITPIX.");
  }
  if (naxis < 2 || width <= 0 || height <= 0) {
    throw new Error("FITS file does not contain a 2D image in the primary HDU.");
  }

  const bytesPerPixel = Math.abs(bitpix) / 8;
  const framePixelCount = width * height;
  const availablePixels = Math.floor((buffer.byteLength - dataOffset) / bytesPerPixel);
  if (availablePixels < framePixelCount) {
    throw new Error("FITS data section is truncated.");
  }

  const bscale = Number.isFinite(Number(header.BSCALE)) ? Number(header.BSCALE) : 1;
  const bzero = Number.isFinite(Number(header.BZERO)) ? Number(header.BZERO) : 0;
  const blank = Number.isFinite(Number(header.BLANK)) ? Number(header.BLANK) : null;
  const saturationLevels = fitsSaturationLevels(bitpix, bscale, bzero);
  const hardThreshold = Number.isFinite(saturationLevels.clippingThreshold)
    ? saturationLevels.clippingThreshold
    : Number.POSITIVE_INFINITY;
  const nearThreshold = Number.isFinite(saturationLevels.nearSaturationThreshold)
    ? Math.min(saturationLevels.nearSaturationThreshold, hardThreshold)
    : hardThreshold;

  const dataView = new DataView(buffer);
  const rawGray = new Float32Array(framePixelCount);
  let byteOffset = dataOffset;
  let mean = 0;
  let m2 = 0;
  let finitePixels = 0;
  let clippedHighlights = 0;
  let nearSaturatedHighlights = 0;

  for (let i = 0; i < framePixelCount; i += 1) {
    const raw = readFitsPixel(dataView, byteOffset, bitpix);
    byteOffset += bytesPerPixel;

    if (blank !== null && Number.isFinite(raw) && raw === blank) {
      rawGray[i] = NaN;
      continue;
    }
    const scaled = raw * bscale + bzero;
    rawGray[i] = scaled;
    if (!Number.isFinite(scaled)) {
      continue;
    }

    finitePixels += 1;
    const delta = scaled - mean;
    mean += delta / finitePixels;
    const delta2 = scaled - mean;
    m2 += delta * delta2;

    if (scaled >= hardThreshold) {
      clippedHighlights += 1;
    }
    if (scaled >= nearThreshold) {
      nearSaturatedHighlights += 1;
    }
  }

  const variance = finitePixels > 1 ? m2 / (finitePixels - 1) : 0;
  const basicStats = {
    mean,
    std: Math.sqrt(Math.max(variance, 0)),
    finitePixels,
    clippedHighlights,
    nearSaturatedHighlights,
    clippingStats: clippingStatsFromCounts(finitePixels, clippedHighlights, nearSaturatedHighlights)
  };

  return {
    rawGray,
    width,
    height,
    header,
    bitpix,
    bscale,
    bzero,
    saturationLevels,
    basicStats,
    clippingStats: basicStats.clippingStats
  };
}

async function readXisfFrame(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const descriptor = parseXisfHeader(bytes, buffer);
  const { width, height, channels } = descriptor.geometry;
  const framePixelCount = width * height;
  const expectedBytes = framePixelCount * channels * descriptor.sampleFormat.bytes;
  const dataStart = descriptor.location.position;
  const dataEnd = dataStart + expectedBytes;

  if (descriptor.location.size < expectedBytes || dataEnd > buffer.byteLength) {
    throw new Error("XISF image data section is truncated.");
  }

  const saturationLevels = xisfSaturationLevels(descriptor.sampleFormat, descriptor.bounds);
  const hardThreshold = Number.isFinite(saturationLevels.clippingThreshold)
    ? saturationLevels.clippingThreshold
    : Number.POSITIVE_INFINITY;
  const nearThreshold = Number.isFinite(saturationLevels.nearSaturationThreshold)
    ? Math.min(saturationLevels.nearSaturationThreshold, hardThreshold)
    : hardThreshold;

  const dataView = new DataView(buffer);
  const rawGray = new Float32Array(framePixelCount);
  let byteOffset = dataStart;
  let mean = 0;
  let m2 = 0;
  let finitePixels = 0;
  let clippedHighlights = 0;
  let nearSaturatedHighlights = 0;

  for (let i = 0; i < framePixelCount; i += 1) {
    let channel0 = NaN;
    let channel1 = NaN;
    let channel2 = NaN;
    let channelSum = 0;
    let channelCount = 0;

    for (let channel = 0; channel < channels; channel += 1) {
      const sample = readXisfSample(dataView, byteOffset, descriptor.sampleFormat, descriptor.littleEndian);
      byteOffset += descriptor.sampleFormat.bytes;
      if (channel === 0) {
        channel0 = sample;
      } else if (channel === 1) {
        channel1 = sample;
      } else if (channel === 2) {
        channel2 = sample;
      }
      if (Number.isFinite(sample)) {
        channelSum += sample;
        channelCount += 1;
      }
    }

    const scaled =
      channels >= 3 && Number.isFinite(channel0) && Number.isFinite(channel1) && Number.isFinite(channel2)
        ? 0.2126 * channel0 + 0.7152 * channel1 + 0.0722 * channel2
        : channelCount > 0
          ? channelSum / channelCount
          : NaN;
    rawGray[i] = scaled;
    if (!Number.isFinite(scaled)) {
      continue;
    }

    finitePixels += 1;
    const delta = scaled - mean;
    mean += delta / finitePixels;
    const delta2 = scaled - mean;
    m2 += delta * delta2;

    if (scaled >= hardThreshold) {
      clippedHighlights += 1;
    }
    if (scaled >= nearThreshold) {
      nearSaturatedHighlights += 1;
    }
  }

  const variance = finitePixels > 1 ? m2 / (finitePixels - 1) : 0;
  const basicStats = {
    mean,
    std: Math.sqrt(Math.max(variance, 0)),
    finitePixels,
    clippedHighlights,
    nearSaturatedHighlights,
    clippingStats: clippingStatsFromCounts(finitePixels, clippedHighlights, nearSaturatedHighlights)
  };

  return {
    rawGray,
    width,
    height,
    header: descriptor.header,
    sampleFormat: descriptor.sampleFormat.name,
    saturationLevels,
    basicStats,
    clippingStats: basicStats.clippingStats
  };
}

async function analyzeFitsImageFile(file, analysisMode = getAnalysisMode(), analysisConfig = getAnalysisModeConfig(analysisMode)) {
  const { rawGray, width, height, header, saturationLevels, basicStats, clippingStats } = await readFitsFrame(file);
  const previewImage = downsampleFloatImage(rawGray, width, height, previewMaxDimension);
  const oldPreviewScale = Math.min(1, previewMaxDimension / Math.max(width, height));
  const saturationThreshold = saturationLevels.clippingThreshold;
  const repeatDistanceScale = oldPreviewScale > 0 ? 1 / oldPreviewScale : 1;
  const previewSource = {
    kind: "gray",
    width: previewImage.width,
    height: previewImage.height,
    data: new Float32Array(previewImage.gray)
  };
  return buildAnalysisResult(file, rawGray, width, height, previewSource, {
    analysisMode,
    analysisConfig,
    fullWidth: width,
    fullHeight: height,
    analysisPixelSource: "full-resolution FITS",
    metricScale: 1,
    repeatDistanceScale,
    saturationThreshold,
    clippingThreshold: saturationThreshold,
    nearSaturationThreshold: saturationLevels.nearSaturationThreshold,
    basicStats,
    clippingStats,
    header,
    filterInfo: detectFilterForFile(file, header),
    frameTypeInfo: detectFrameTypeForFile(file, header)
  });
}

async function analyzeXisfImageFile(file, analysisMode = getAnalysisMode(), analysisConfig = getAnalysisModeConfig(analysisMode)) {
  const { rawGray, width, height, header, saturationLevels, basicStats, clippingStats } = await readXisfFrame(file);
  const previewImage = downsampleFloatImage(rawGray, width, height, previewMaxDimension);
  const oldPreviewScale = Math.min(1, previewMaxDimension / Math.max(width, height));
  const saturationThreshold = saturationLevels.clippingThreshold;
  const repeatDistanceScale = oldPreviewScale > 0 ? 1 / oldPreviewScale : 1;
  const previewSource = {
    kind: "gray",
    width: previewImage.width,
    height: previewImage.height,
    data: new Float32Array(previewImage.gray)
  };
  return buildAnalysisResult(file, rawGray, width, height, previewSource, {
    analysisMode,
    analysisConfig,
    fullWidth: width,
    fullHeight: height,
    analysisPixelSource: "full-resolution XISF",
    metricScale: 1,
    repeatDistanceScale,
    saturationThreshold,
    clippingThreshold: saturationThreshold,
    nearSaturationThreshold: saturationLevels.nearSaturationThreshold,
    basicStats,
    clippingStats,
    header,
    filterInfo: detectFilterForFile(file, header),
    frameTypeInfo: detectFrameTypeForFile(file, header)
  });
}

async function analyzeImageFile(file, analysisMode = getAnalysisMode(), analysisConfig = getAnalysisModeConfig(analysisMode)) {
  if (isFitsFile(file)) {
    return analyzeFitsImageFile(file, analysisMode, analysisConfig);
  }
  if (isXisfFile(file)) {
    return analyzeXisfImageFile(file, analysisMode, analysisConfig);
  }
  return analyzeBitmapImageFile(file, analysisMode, analysisConfig);
}

function workerFileMetadata(file) {
  return {
    relativePath: normalizedFilePath(file),
    displayPath: displayFilePath(file),
    identityKey: fileIdentityKey(file)
  };
}

function analysisWorkerFunctionSource() {
  return [
    clamp,
    fileExtension,
    isFitsFile,
    isXisfFile,
    headerSourcePrefix,
    headerKeywordSource,
    normalizePathText,
    rawRelativeFilePath,
    normalizedFilePath,
    displayFilePath,
    fileIdentityKey,
    cleanFilterName,
    normalizeFilterName,
    detectFilterFromHeader,
    detectFilterFromPath,
    detectFilterForFile,
    normalizeFrameType,
    detectFrameTypeFromHeader,
    detectFrameTypeFromPath,
    detectFrameTypeForFile,
    numericMetadataValue,
    detectNumericMetadataFromHeader,
    textMetadataValue,
    detectTextMetadataFromHeader,
    detectExposureFromPath,
    detectTemperatureFromPath,
    detectExposureForFile,
    detectTemperatureForFile,
    detectCameraModelFromPath,
    detectCameraModelForFile,
    cleanTargetName,
    detectTargetNameFromHeader,
    detectTargetNameForFile,
    sexagesimalParts,
    parseSexagesimalMagnitude,
    normalizeRightAscensionDegrees,
    parseRightAscensionDegrees,
    parseDeclinationDegrees,
    detectCoordinatesFromHeader,
    detectCoordinatesForFile,
    averageFinite,
    detectFocalLengthForFile,
    detectPixelSizeForFile,
    parseBinningValue,
    detectBinningForFile,
    detectWcsPixelScaleFromHeader,
    detectPixelScaleForFile,
    fieldOfViewFromPixelScale,
    objectShotToleranceDegrees,
    darkOutlierProfileForCamera,
    normalizeAnalysisMode,
    getAnalysisModeConfig,
    toLuma,
    computeMeanStd,
    clippingStatsFromCounts,
    computeBasicImageStats,
    sampleStepForTarget,
    computeLaplacianVariance,
    computeNoise,
    lineAngleDifference,
    sampleGrayBilinear,
    measureAxisFwhm,
    emptyRepeatDriftResult,
    computeCloseRepeatDrift,
    annulusMean,
    brightPeakCandidates,
    computeHaloWarning,
    emptyHaloWarning,
    skippedStarTrackingMetrics,
    normalizedStarFieldRadius,
    trackingRegionLabel,
    brightMediumStars,
    guideSizedStars,
    reliableGuideStars,
    evenlySampleByBrightness,
    selectStarsForTracking,
    measureWideTrailShape,
    assignWideTrailShapes,
    starTrackingAxisRatio,
    starTrackingAngle,
    starHasDirectionalTrailShape,
    starLooksElongated,
    computeDirectionalTrailMetrics,
    normalizedStarCornerAxes,
    starInCornerReferenceZone,
    starLooksPoorInCorner,
    selectStarsForOverlay,
    mergeUniqueStars,
    selectStarsForFullFieldOverlay,
    computeStarRoundnessAndTracking,
    computeHighlightClipping,
    computeDistributionStats,
    computeLevelHistogram,
    computeCloudStructureMetrics,
    computeCalibrationOutlierMetrics,
    computeElongation,
    percentileFromSorted,
    parseFitsValue,
    parseFitsHeader,
    readFitsPixel,
    fitsIntegerRawRange,
    fitsSaturationLevels,
    decodeXmlEntities,
    parseXmlAttributes,
    xmlAttribute,
    stripXmlTags,
    findXisfImageDescriptors,
    parseXisfGeometry,
    parseXisfLocation,
    xisfSampleFormatInfo,
    parseXisfBounds,
    xisfIntegerSampleRange,
    xisfSaturationLevels,
    readXisfSample,
    parseXisfFITSKeywords,
    setXisfHeaderAlias,
    xisfFocalLengthMillimeters,
    xisfPixelSizeMicrons,
    addXisfPropertyAlias,
    parseXisfPropertyValue,
    parseXisfProperties,
    parseXisfHeader,
    downsampleFloatImage,
    buildAnalysisResult,
    analyzeBitmapImageFile,
    readFitsFrame,
    analyzeFitsImageFile,
    readXisfFrame,
    analyzeXisfImageFile,
    analyzeImageFile
  ]
    .map((fn) => fn.toString())
    .join("\n\n");
}

function createAnalysisWorkerSource() {
  return `
const selectedFileMetadata = new WeakMap();
const appVersion = ${JSON.stringify(appVersion)};
const defaultAnalysisMode = ${JSON.stringify(defaultAnalysisMode)};
const unknownFilterName = ${JSON.stringify(unknownFilterName)};
const unknownFrameTypeName = ${JSON.stringify(unknownFrameTypeName)};
const unknownCameraModelName = ${JSON.stringify(unknownCameraModelName)};
const filterHeaderKeys = ${JSON.stringify(filterHeaderKeys)};
const frameTypeHeaderKeys = ${JSON.stringify(frameTypeHeaderKeys)};
const exposureHeaderKeys = ${JSON.stringify(exposureHeaderKeys)};
const temperatureHeaderKeys = ${JSON.stringify(temperatureHeaderKeys)};
const cameraModelHeaderKeys = ${JSON.stringify(cameraModelHeaderKeys)};
const targetNameHeaderKeys = ${JSON.stringify(targetNameHeaderKeys)};
const coordinateHeaderPairs = ${JSON.stringify(coordinateHeaderPairs)};
const focalLengthHeaderKeys = ${JSON.stringify(focalLengthHeaderKeys)};
const pixelSizeHeaderKeyPairs = ${JSON.stringify(pixelSizeHeaderKeyPairs)};
const pixelSizeHeaderKeys = ${JSON.stringify(pixelSizeHeaderKeys)};
const binningHeaderKeyPairs = ${JSON.stringify(binningHeaderKeyPairs)};
const binningHeaderKeys = ${JSON.stringify(binningHeaderKeys)};
const unknownTargetName = ${JSON.stringify(unknownTargetName)};
const unknownObjectShotKey = ${JSON.stringify(unknownObjectShotKey)};
const unknownObjectShotLabel = ${JSON.stringify(unknownObjectShotLabel)};
const objectShotFallbackToleranceDeg = ${objectShotFallbackToleranceDeg};
const objectShotMinToleranceDeg = ${objectShotMinToleranceDeg};
const objectShotMaxToleranceDeg = ${objectShotMaxToleranceDeg};
const objectShotFovToleranceFraction = ${objectShotFovToleranceFraction};
const lowGlowBackIlluminatedCameraPatterns = [${lowGlowBackIlluminatedCameraPatterns.map((pattern) => pattern.toString()).join(",")}];
const calibrationFrameTypes = new Set(${JSON.stringify(Array.from(calibrationFrameTypes))});
const fitsExtensions = new Set(${JSON.stringify(Array.from(fitsExtensions))});
const xisfExtensions = new Set(${JSON.stringify(Array.from(xisfExtensions))});
const xisfMaxHeaderBytes = ${xisfMaxHeaderBytes};
const previewMaxDimension = ${previewMaxDimension};
const bitmapAnalysisMaxDimension = ${bitmapAnalysisMaxDimension};
const standardDistributionMaxSamples = ${standardDistributionMaxSamples};
const standardCloudTileSamples = ${standardCloudTileSamples};
const standardTrackingTrailStarLimit = ${standardTrackingTrailStarLimit};
const standardTrackingTrailWindowRadius = ${standardTrackingTrailWindowRadius};
const standardRepeatDriftMaxPairs = ${standardRepeatDriftMaxPairs};
const standardRepeatDriftBrightStarLimit = ${standardRepeatDriftBrightStarLimit};
const trackingCentralFieldRadius = ${trackingCentralFieldRadius};
const trackingFallbackCentralFieldRadius = ${trackingFallbackCentralFieldRadius};
const trackingMinimumCentralStars = ${trackingMinimumCentralStars};
const trackingMediumPeakPercentile = ${trackingMediumPeakPercentile};
const trackingMinimumGuideStarHfrPx = ${trackingMinimumGuideStarHfrPx};
const trackingGuideStarHfrPercentile = ${trackingGuideStarHfrPercentile};
const cornerReferenceAxisFraction = ${cornerReferenceAxisFraction};
const cornerReferenceRoundnessWarningLimit = ${cornerReferenceRoundnessWarningLimit};
const cornerReferenceFwhmRoundnessWarningLimit = ${cornerReferenceFwhmRoundnessWarningLimit};
const cornerReferenceAxisRatioWarningLimit = ${cornerReferenceAxisRatioWarningLimit};
const expertAnalysisMaxDimension = ${expertAnalysisMaxDimension};
const expertDistributionMaxSamples = ${expertDistributionMaxSamples};
const expertCloudTileSamples = ${expertCloudTileSamples};
const expertTrackingTrailStarLimit = ${expertTrackingTrailStarLimit};
const expertTrackingTrailWindowRadius = ${expertTrackingTrailWindowRadius};
const expertRepeatDriftMaxPairs = ${expertRepeatDriftMaxPairs};
const expertRepeatDriftBrightStarLimit = ${expertRepeatDriftBrightStarLimit};
const analysisModeConfigs = ${JSON.stringify(analysisModeConfigs)};
const bitmapClippingThreshold = ${bitmapClippingThreshold};
const bitmapNearSaturationThreshold = ${bitmapNearSaturationThreshold};
const hardClippingFullPenaltyPercent = ${hardClippingFullPenaltyPercent};
const nearSaturationFullPenaltyPercent = ${nearSaturationFullPenaltyPercent};
const nearSaturationPressureWeight = ${nearSaturationPressureWeight};
const cloudRelativePeerMinimum = ${cloudRelativePeerMinimum};
const cloudPossibleBackgroundRangePercent = ${cloudPossibleBackgroundRangePercent};
const cloudPossibleStructureScore = ${cloudPossibleStructureScore};
const cloudLikelyBackgroundRangePercent = ${cloudLikelyBackgroundRangePercent};
const cloudLikelyStructureScore = ${cloudLikelyStructureScore};
const cloudSupportStarLossScore = ${cloudSupportStarLossScore};
const cloudStrongStarLossScore = ${cloudStrongStarLossScore};
const cloudMeanLiftMinimumStarLossScore = ${cloudMeanLiftMinimumStarLossScore};
const cloudSupportMeanLiftScore = ${cloudSupportMeanLiftScore};
const cloudStrongMeanLiftScore = ${cloudStrongMeanLiftScore};
const cloudExtremeBackgroundRangePercent = ${cloudExtremeBackgroundRangePercent};
const cloudExtremeStructureScore = ${cloudExtremeStructureScore};
const cloudExtremeSingleFrameBackgroundRangePercent = ${cloudExtremeSingleFrameBackgroundRangePercent};
const cloudExtremeSingleFrameStructureScore = ${cloudExtremeSingleFrameStructureScore};
const cloudUnconfirmedStructureScoreCap = ${cloudUnconfirmedStructureScoreCap};

function getAnalysisMode() {
  return defaultAnalysisMode;
}

${analysisWorkerFunctionSource()}

function prepareCanvas(imageBitmap, maxDimension = previewMaxDimension) {
  if (typeof OffscreenCanvas !== "function") {
    throw new Error("OffscreenCanvas is not available in this worker.");
  }
  const scale = Math.min(1, maxDimension / Math.max(imageBitmap.width, imageBitmap.height));
  const width = Math.max(64, Math.round(imageBitmap.width * scale));
  const height = Math.max(64, Math.round(imageBitmap.height * scale));
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx, width, height };
}

function refreshResultThumbnail() {}

self.onmessage = async (event) => {
  const message = event.data || {};
  if (message.type !== "analyze") {
    return;
  }

  try {
    const file = message.file;
    selectedFileMetadata.set(file, message.metadata || {});
    const analysisMode = normalizeAnalysisMode(message.analysisMode);
    const analysisConfig = getAnalysisModeConfig(analysisMode);
    const result = await analyzeImageFile(file, analysisMode, analysisConfig);
    result.sourceFile = null;
    result.thumbnail = "";
    const transfer = [];
    if (result.previewSource && result.previewSource.data && result.previewSource.data.buffer) {
      transfer.push(result.previewSource.data.buffer);
    }
    self.postMessage({ type: "result", id: message.id, result }, transfer);
  } catch (error) {
    self.postMessage({
      type: "error",
      id: message.id,
      error: error && error.message ? error.message : String(error)
    });
  }
};
`;
}

function analysisWorkersSupported() {
  return (
    typeof Worker === "function" &&
    typeof Blob === "function" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function"
  );
}

function analysisWorkerUrl() {
  if (!analysisWorkerObjectUrl) {
    const blob = new Blob([createAnalysisWorkerSource()], { type: "text/javascript" });
    analysisWorkerObjectUrl = URL.createObjectURL(blob);
  }
  return analysisWorkerObjectUrl;
}

function createAnalysisWorker() {
  if (!analysisWorkersSupported()) {
    return null;
  }
  try {
    return new Worker(analysisWorkerUrl());
  } catch (error) {
    return null;
  }
}

function positiveFiniteNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : NaN;
}

function desktopSystemResources() {
  if (!window.astroDesktop || typeof window.astroDesktop.systemResources !== "function") {
    return {};
  }
  try {
    return window.astroDesktop.systemResources() || {};
  } catch (error) {
    return {};
  }
}

function detectedLogicalCores() {
  const desktopResources = desktopSystemResources();
  const desktopCores = positiveFiniteNumber(desktopResources.logicalCores);
  if (Number.isFinite(desktopCores)) {
    return Math.max(1, Math.floor(desktopCores));
  }

  const browserCores =
    typeof navigator !== "undefined" ? positiveFiniteNumber(navigator.hardwareConcurrency) : NaN;
  return Number.isFinite(browserCores) ? Math.max(1, Math.floor(browserCores)) : 2;
}

function detectedSystemMemoryGb() {
  const desktopResources = desktopSystemResources();
  const desktopMemoryGb = positiveFiniteNumber(desktopResources.totalMemoryGb);
  if (Number.isFinite(desktopMemoryGb)) {
    return {
      gb: desktopMemoryGb,
      source: "desktop"
    };
  }

  const browserMemoryGb =
    typeof navigator !== "undefined" ? positiveFiniteNumber(navigator.deviceMemory) : NaN;
  if (Number.isFinite(browserMemoryGb)) {
    return {
      gb: browserMemoryGb,
      source: "browser"
    };
  }

  const heapLimitBytes =
    typeof performance !== "undefined" && performance.memory
      ? positiveFiniteNumber(performance.memory.jsHeapSizeLimit)
      : NaN;
  if (Number.isFinite(heapLimitBytes)) {
    return {
      gb: heapLimitBytes / bytesPerGib,
      source: "heap"
    };
  }

  return {
    gb: fallbackSystemMemoryGb,
    source: "fallback"
  };
}

function workerFrameCount(filesOrCount) {
  if (typeof filesOrCount === "number") {
    return Math.max(0, Math.floor(filesOrCount));
  }
  if (filesOrCount && typeof filesOrCount.length === "number") {
    return Math.max(0, Math.floor(filesOrCount.length));
  }
  return 0;
}

function largestWorkerFileSizeBytes(filesOrCount) {
  if (!filesOrCount || typeof filesOrCount === "number" || typeof filesOrCount.length !== "number") {
    return 0;
  }

  let largest = 0;
  for (const file of Array.from(filesOrCount)) {
    const size = positiveFiniteNumber(file && file.size);
    if (Number.isFinite(size)) {
      largest = Math.max(largest, size);
    }
  }
  return largest;
}

function estimatedWorkerMemoryGb(analysisMode, filesOrCount) {
  const mode = normalizeAnalysisMode(analysisMode);
  const profile = workerMemoryProfiles[mode] || workerMemoryProfiles[defaultAnalysisMode];
  const largestFileGb = largestWorkerFileSizeBytes(filesOrCount) / bytesPerGib;
  return Math.max(profile.baseGb, profile.baseGb + largestFileGb * profile.fileSizeMultiplier);
}

function workerPoolResourcePlan(analysisMode, filesOrCount) {
  const mode = normalizeAnalysisMode(analysisMode);
  const profile = workerMemoryProfiles[mode] || workerMemoryProfiles[defaultAnalysisMode];
  const frameCount = workerFrameCount(filesOrCount);
  const logicalCores = detectedLogicalCores();
  const cpuLimit = Math.max(1, logicalCores - 1);
  const memoryInfo = detectedSystemMemoryGb();
  const estimatedPerWorkerGb = estimatedWorkerMemoryGb(mode, filesOrCount);
  const usableMemoryGb = Math.max(estimatedPerWorkerGb, memoryInfo.gb - profile.reserveGb);
  const memoryLimit = Math.max(1, Math.floor(usableMemoryGb / estimatedPerWorkerGb));
  const workerCount = Math.max(1, Math.min(frameCount || 1, cpuLimit, memoryLimit));

  return {
    workerCount,
    logicalCores,
    cpuLimit,
    memoryGb: memoryInfo.gb,
    memorySource: memoryInfo.source,
    memoryLimit,
    estimatedPerWorkerGb
  };
}

function workerPoolSizeForMode(analysisMode, filesOrCount) {
  return workerPoolResourcePlan(analysisMode, filesOrCount).workerCount;
}

function attachCompletedAnalysisResult(result, file) {
  result.sourceFile = file;
  refreshResultThumbnail(result);
  return result;
}

async function analyzeFilesSequentially(files, analysisMode, analysisConfig, progress, run) {
  const newResults = [];
  let failures = 0;

  progress.workerPlan = null;
  progress.concurrency = 1;
  for (let i = 0; i < files.length; i += 1) {
    if (run.stopped) {
      break;
    }

    const file = files[i];
    const frameStartedAt = Date.now();
    progress.currentStartedAt = frameStartedAt;
    progress.activeCount = 1;
    try {
      const metrics = await analyzeImageFile(file, analysisMode, analysisConfig);
      newResults.push(metrics);
    } catch (error) {
      failures += 1;
      progress.failures = failures;
    } finally {
      progress.completedDurationMs += Math.max(0, Date.now() - frameStartedAt);
      progress.completed = i + 1;
      progress.currentStartedAt = null;
      progress.activeCount = 0;
      renderAnalysisProgress(progress);
    }
  }

  return { newResults, failures, stopped: run.stopped, usedWorkers: false };
}

function analyzeFilesWithWorkerPool(files, analysisMode, progress, run) {
  const workerPlan = workerPoolResourcePlan(analysisMode, files);
  const workerCount = workerPlan.workerCount;
  const workers = [];

  for (let i = 0; i < workerCount; i += 1) {
    const worker = createAnalysisWorker();
    if (!worker) {
      for (const existingWorker of workers) {
        existingWorker.terminate();
      }
      progress.workerPlan = null;
      return null;
    }
    workers.push(worker);
    run.workers.add(worker);
  }

  progress.workerPlan = {
    ...workerPlan,
    workerCount: workers.length
  };
  progress.concurrency = workers.length;
  renderAnalysisProgress(progress);

  return new Promise((resolve) => {
    const newResults = [];
    let failures = 0;
    let nextIndex = 0;
    let completed = 0;
    let activeCount = 0;
    let finished = false;
    const records = [];

    function cleanup() {
      for (const worker of workers) {
        worker.onmessage = null;
        worker.onerror = null;
        if (run.workers.has(worker)) {
          worker.terminate();
          run.workers.delete(worker);
        }
      }
      run.stopCallbacks.delete(onStop);
    }

    function finish(stopped = run.stopped) {
      if (finished) {
        return;
      }
      finished = true;
      progress.activeCount = 0;
      cleanup();
      resolve({ newResults, failures, stopped, usedWorkers: true });
    }

    function onStop() {
      finish(true);
    }

    function completeFrame(record, result, failed = false) {
      if (finished) {
        return;
      }
      activeCount = Math.max(0, activeCount - 1);
      completed += 1;
      progress.activeCount = activeCount;
      progress.completed = completed;
      progress.completedDurationMs += Math.max(0, Date.now() - record.startedAt);
      if (failed) {
        failures += 1;
        progress.failures = failures;
      } else if (result) {
        newResults.push(attachCompletedAnalysisResult(result, record.file));
      }
      record.file = null;
      record.startedAt = 0;
      renderAnalysisProgress(progress);
      assignWork(record);
    }

    function retireWorkerRecord(record) {
      if (finished) {
        return;
      }
      if (record.file) {
        activeCount = Math.max(0, activeCount - 1);
        completed += 1;
        failures += 1;
        progress.failures = failures;
        progress.completed = completed;
        progress.activeCount = activeCount;
        progress.completedDurationMs += Math.max(0, Date.now() - record.startedAt);
        record.file = null;
        record.startedAt = 0;
        renderAnalysisProgress(progress);
      }
      if (record.worker) {
        record.worker.onmessage = null;
        record.worker.onerror = null;
        if (run.workers.has(record.worker)) {
          run.workers.delete(record.worker);
        }
        record.worker.terminate();
        record.worker = null;
      }
      const liveRecords = records.filter((item) => item.worker);
      if (liveRecords.length === 0 && activeCount === 0) {
        finish(false);
      }
    }

    function assignWork(record) {
      if (finished) {
        return;
      }
      if (!record.worker) {
        return;
      }
      if (run.stopped) {
        finish(true);
        return;
      }
      if (nextIndex >= files.length) {
        if (activeCount === 0) {
          finish(false);
        }
        return;
      }

      const file = files[nextIndex];
      nextIndex += 1;
      record.file = file;
      record.startedAt = Date.now();
      activeCount += 1;
      progress.activeCount = activeCount;
      try {
        record.worker.postMessage({
          type: "analyze",
          id: record.id,
          file,
          metadata: workerFileMetadata(file),
          analysisMode
        });
      } catch (error) {
        completeFrame(record, null, true);
      }
    }

    run.stopCallbacks.add(onStop);
    workers.forEach((worker, index) => {
      const record = {
        id: index + 1,
        worker,
        file: null,
        startedAt: 0
      };
      records.push(record);
      worker.onmessage = (event) => {
        const message = event.data || {};
        if (message.type === "result") {
          completeFrame(record, message.result, false);
        } else {
          completeFrame(record, null, true);
        }
      };
      worker.onerror = () => {
        retireWorkerRecord(record);
      };
      assignWork(record);
    });
  });
}

async function analyzePendingFiles(files, analysisMode, analysisConfig, progress, run) {
  const workerOutcome = analyzeFilesWithWorkerPool(files, analysisMode, progress, run);
  if (workerOutcome) {
    return workerOutcome;
  }
  return analyzeFilesSequentially(files, analysisMode, analysisConfig, progress, run);
}

async function zoomCanvasForFitsFile(file) {
  const { rawGray, width, height } = await readFitsFrame(file);
  const zoomImage = downsampleFloatImage(rawGray, width, height, zoomDetailMaxDimension);
  return stretchedGrayscaleCanvasFromData(zoomImage.gray, zoomImage.width, zoomImage.height);
}

async function zoomCanvasForXisfFile(file) {
  const { rawGray, width, height } = await readXisfFrame(file);
  const zoomImage = downsampleFloatImage(rawGray, width, height, zoomDetailMaxDimension);
  return stretchedGrayscaleCanvasFromData(zoomImage.gray, zoomImage.width, zoomImage.height);
}

async function zoomCanvasForBitmapFile(file) {
  const bitmap = await createImageBitmap(file);
  const { canvas, ctx, width, height } = prepareCanvas(bitmap, zoomDetailMaxDimension);
  ctx.drawImage(bitmap, 0, 0, width, height);
  if (typeof bitmap.close === "function") {
    bitmap.close();
  }
  const imageData = ctx.getImageData(0, 0, width, height);
  return stretchedColorCanvasFromImageData(imageData, width, height);
}

async function buildZoomDetailDataUrl(result) {
  let canvas = null;
  if (isFitsFile(result.sourceFile)) {
    canvas = await zoomCanvasForFitsFile(result.sourceFile);
  } else if (isXisfFile(result.sourceFile)) {
    canvas = await zoomCanvasForXisfFile(result.sourceFile);
  } else {
    canvas = await zoomCanvasForBitmapFile(result.sourceFile);
  }
  return canvas.toDataURL("image/png");
}

async function getOrCreateDirectory(rootHandle, directoryParts) {
  let current = rootHandle;
  for (const part of directoryParts) {
    current = await current.getDirectoryHandle(part, { create: true });
  }
  return current;
}

async function copyFileToOutputDirectory(outputRootHandle, relativePath, file) {
  const safePath = relativePath.replace(/\\/g, "/");
  const parts = safePath.split("/").filter(Boolean);
  const fileName = parts.pop() || file.name;
  const folderHandle = parts.length > 0 ? await getOrCreateDirectory(outputRootHandle, parts) : outputRootHandle;
  const outputFileHandle = await folderHandle.getFileHandle(fileName, { create: true });
  const writable = await outputFileHandle.createWritable();
  await writable.write(file);
  await writable.close();
}

async function copyFileToDesktopOutputDirectory(outputDirectoryPath, relativePath, file) {
  const sourcePath = window.astroDesktop.getPathForFile(file);
  if (!sourcePath) {
    throw new Error("The selected file does not have a readable desktop path.");
  }
  await window.astroDesktop.copyFile({
    sourcePath,
    outputDirectoryPath,
    relativePath
  });
}

function outputRelativePathForResult(result) {
  const parts = [];
  if (copyByTypeCheckbox && copyByTypeCheckbox.checked) {
    parts.push(safeDirectoryName(result.frameType || unknownFrameTypeName));
  }
  if (copyByFilterCheckbox && copyByFilterCheckbox.checked) {
    parts.push(safeDirectoryName(result.filterName || unknownFilterName));
  }
  parts.push(result.fileName);
  return parts.join("/");
}

async function chooseOutputDirectory() {
  if (isDesktopApp()) {
    try {
      const folder = await window.astroDesktop.chooseOutputFolder();
      if (!folder) {
        return;
      }
      state.outputDirectoryPath = folder.path;
      state.outputDirectoryName = folder.name || folder.path || "selected";
      state.outputDirectoryHandle = null;
      setOutputLabel();
      updateSelectionControls();
      setSummaryMessage("Output folder selected.");
    } catch (error) {
      setSummaryMessage("Could not open output folder picker.");
    }
    return;
  }

  if (!hasDirectoryPicker()) {
    setSummaryMessage("Output folder copy is not supported in this browser.");
    return;
  }

  try {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    state.outputDirectoryHandle = handle;
    setOutputLabel();
    updateSelectionControls();
    setSummaryMessage("Output folder selected.");
  } catch (error) {
    if (error && error.name !== "AbortError") {
      setSummaryMessage("Could not open output folder picker.");
    }
  }
}

function selectKeepers() {
  for (const result of visibleResults()) {
    if (recommendationFor(result) === "Keep") {
      state.selectedKeys.add(getResultKey(result));
    }
  }
  renderResults(visibleResults());
}

function clearSelection() {
  for (const result of visibleResults()) {
    state.selectedKeys.delete(getResultKey(result));
  }
  renderResults(visibleResults());
}

async function sendSelectedImages() {
  if (!hasOutputFolderSelected()) {
    setSummaryMessage("Choose an output folder first.");
    return;
  }

  const resultsToSend = selectedResults();
  if (resultsToSend.length === 0) {
    setSummaryMessage("Select at least one image to send.");
    return;
  }

  sendSelectedBtn.disabled = true;
  let copied = 0;
  let failed = 0;

  for (let i = 0; i < resultsToSend.length; i += 1) {
    const result = resultsToSend[i];
    try {
      const relativePath = outputRelativePathForResult(result);
      if (isDesktopApp()) {
        await copyFileToDesktopOutputDirectory(state.outputDirectoryPath, relativePath, result.sourceFile);
      } else {
        await copyFileToOutputDirectory(state.outputDirectoryHandle, relativePath, result.sourceFile);
      }
      copied += 1;
    } catch (error) {
      failed += 1;
    }
    setTransientStatus(`Sending selected images... ${i + 1}/${resultsToSend.length}`);
  }

  updateSelectionControls();
  const folderText = [
    copyByTypeCheckbox && copyByTypeCheckbox.checked ? "type" : "",
    copyByFilterCheckbox && copyByFilterCheckbox.checked ? "filter" : ""
  ].filter(Boolean);
  const folderMessage = folderText.length > 0 ? ` using ${folderText.join(" and ")} folders` : "";
  const outputName = isDesktopApp() ? state.outputDirectoryName : state.outputDirectoryHandle.name;
  setSummaryMessage(`Sent ${copied} image(s) to "${outputName}"${folderMessage}. Failed: ${failed}.`);
}

function exportCsv() {
  if (state.results.length === 0) {
    return;
  }
  const separator = getCsvSeparator();
  const header = [
    "file",
    "calculation_version",
    "analysis_mode",
    "analysis_pixel_source",
    "frame_type",
    "frame_type_source",
    "filter",
    "filter_source",
    "exposure_seconds",
    "exposure_source",
    "camera_temperature_c",
    "temperature_source",
    "camera_model",
    "camera_model_source",
    "sensor_outlier_profile",
    "target_name",
    "target_source",
    "object_shot",
    "object_shot_key",
    "object_shot_frame_count",
    "object_shot_offset_arcmin",
    "object_shot_tolerance_arcmin",
    "ra_degrees",
    "ra_hms",
    "ra_source",
    "dec_degrees",
    "dec_dms",
    "dec_source",
    "focal_length_mm",
    "focal_length_source",
    "pixel_size_microns",
    "pixel_size_source",
    "binning",
    "binning_source",
    "pixel_scale_arcsec_per_pixel",
    "pixel_scale_source",
    "field_width_degrees",
    "field_height_degrees",
    "keeper_threshold",
    "quality",
    "recommendation",
    "calibration_status",
    "calibration_warnings",
    "calibration_set",
    "calibration_set_median_percent",
    "calibration_set_delta_percent",
    "calibration_set_spread_delta_percent",
    "calibration_set_gradient_delta_percent",
    "calibration_set_outlier",
    "flat_histogram_distance",
    "flat_tile_mismatch_percent",
    "flat_artifact_score",
    "calibration_bright_outlier_percent",
    "calibration_dark_outlier_percent",
    "calibration_background_range_percent",
    "calibration_structure_score",
    "calibration_exposure_match",
    "calibration_exposure_reference_seconds",
    "calibration_exposure_delta_seconds",
    "calibration_temperature_match",
    "calibration_temperature_reference_c",
    "calibration_temperature_delta_c",
    "calibration_compatibility_summary",
    "median_percent",
    "spread_percent",
    "noise_percent",
    "sharpness",
    "noise",
    "star_roundness",
    "fwhm_roundness",
    "axis_roundness",
    "eccentricity",
    "hfr",
    "star_count",
    "mean",
    "clipping_percent",
    "near_saturation_percent",
    "clipping_pressure",
    "clipping_score",
    "cloud_warning",
    "cloud_score",
    "cloud_structure_score",
    "cloud_star_loss_score",
    "cloud_mean_lift_score",
    "cloud_background_range_percent",
    "cloud_summary",
    "halo_warning",
    "halo_score",
    "halo_star_count",
    "halo_measured_stars",
    "halo_summary",
    "halo_penalty_applied",
    "tracking_severity",
    "tracking_reason",
    "tracking_score",
    "tracking_sample_star_count",
    "tracking_sample_region",
    "directional_trail_score",
    "directional_trail_star_fraction",
    "directional_trail_star_count",
    "repeat_drift_source",
    "repeat_drift_score",
    "repeated_star_fraction",
    "multi_repeat_fraction",
    "elongation"
  ];

  const rows = [buildCsvRow(header, separator)];
  for (const result of state.results) {
    const calibrationFrame = isCalibrationFrame(result);
    const lightOnlyMetric = (value, digits) => (calibrationFrame ? "skipped" : formatMetric(value, digits));
    const lightOnlyCount = (value) =>
      calibrationFrame ? "skipped" : Number.isFinite(Number(value)) ? Number(value) : 0;
    const lightOnlyText = (value) => (calibrationFrame ? "skipped" : value || "");
    const row = [
      result.fileName,
      result.calculationVersion || appVersion,
      resultAnalysisMode(result),
      result.analysisPixelSource || "",
      result.frameType || unknownFrameTypeName,
      result.frameTypeSource || "None",
      result.filterName || unknownFilterName,
      result.filterSource || "None",
      formatMetric(result.exposureSeconds, 4),
      result.exposureSource || "None",
      formatMetric(result.cameraTemperatureC, 3),
      result.temperatureSource || "None",
      result.cameraModel || unknownCameraModelName,
      result.cameraModelSource || "None",
      result.sensorOutlierProfile || "Generic sensor",
      result.targetName || unknownTargetName,
      result.targetSource || "None",
      calibrationFrame ? "skipped" : result.objectShotLabel || unknownObjectShotLabel,
      calibrationFrame ? "skipped" : result.objectShotKey || unknownObjectShotKey,
      calibrationFrame ? "skipped" : Number.isFinite(Number(result.objectShotMemberCount)) ? Number(result.objectShotMemberCount) : 0,
      calibrationFrame || !Number.isFinite(result.objectShotSeparationDeg)
        ? "skipped"
        : formatMetric(result.objectShotSeparationDeg * 60, 3),
      calibrationFrame || !Number.isFinite(result.objectShotToleranceDeg)
        ? "skipped"
        : formatMetric(result.objectShotToleranceDeg * 60, 3),
      formatMetric(result.raDegrees, 6),
      formatRightAscensionHms(result.raDegrees),
      result.raSource || "None",
      formatMetric(result.decDegrees, 6),
      formatDeclinationDms(result.decDegrees),
      result.decSource || "None",
      formatMetric(result.focalLengthMm, 3),
      result.focalLengthSource || "None",
      formatMetric(result.pixelSizeMicrons, 4),
      result.pixelSizeSource || "None",
      formatMetric(result.binning, 3),
      result.binningSource || "None",
      formatMetric(result.pixelScaleArcsecPerPixel, 4),
      result.pixelScaleSource || "None",
      formatMetric(result.fieldWidthDegrees, 5),
      formatMetric(result.fieldHeightDegrees, 5),
      calibrationFrame ? defaultKeeperThreshold : getKeeperThreshold(result.filterName || unknownFilterName),
      result.quality,
      recommendationFor(result),
      result.calibrationSummary || "",
      (result.calibrationWarnings || []).join("; "),
      result.calibrationSetKey || "",
      formatMetric(result.calibrationSetMedianPercent, 3),
      formatMetric(result.calibrationSetDeltaPercent, 3),
      formatMetric(result.calibrationSetSpreadDeltaPercent, 3),
      formatMetric(result.calibrationSetGradientDeltaPercent, 3),
      result.calibrationSetOutlier ? "yes" : "no",
      formatMetric(result.flatHistogramDistance, 4),
      formatMetric(result.flatTileMismatchPercent, 3),
      formatMetric(result.flatArtifactScore, 4),
      formatMetric(result.calibrationBrightOutlierPercent, 4),
      formatMetric(result.calibrationDarkOutlierPercent, 4),
      formatMetric(result.calibrationBackgroundRangePercent, 3),
      formatMetric(result.calibrationStructureScore, 4),
      result.calibrationExposureMatch || "",
      formatMetric(result.calibrationExposureReferenceSeconds, 4),
      formatMetric(result.calibrationExposureDeltaSeconds, 4),
      result.calibrationTemperatureMatch || "",
      formatMetric(result.calibrationTemperatureReferenceC, 3),
      formatMetric(result.calibrationTemperatureDeltaC, 3),
      result.calibrationCompatibilitySummary || "",
      formatMetric(result.medianPercent, 3),
      formatMetric(result.spreadPercent, 3),
      formatMetric(result.noisePercent, 3),
      lightOnlyMetric(result.sharpness, 3),
      formatMetric(result.noise, 3),
      lightOnlyMetric(result.starRoundness, 4),
      lightOnlyMetric(result.fwhmRoundness, 4),
      lightOnlyMetric(result.axisRoundness, 4),
      lightOnlyMetric(result.eccentricity, 4),
      lightOnlyMetric(result.hfr, 3),
      lightOnlyCount(result.starCount),
      formatMetric(result.mean, 3),
      formatMetric(result.clipping, 4),
      formatMetric(result.nearSaturation, 4),
      formatMetric(result.clippingPressure, 4),
      formatMetric(result.clippingScore, 4),
      cloudLabel(result),
      formatMetric(result.cloudScore, 4),
      formatMetric(result.cloudStructureScore, 4),
      formatMetric(result.cloudStarLossScore, 4),
      formatMetric(result.cloudMeanLiftScore, 4),
      formatMetric(result.cloudBackgroundRangePercent, 3),
      result.cloudSummary || "",
      lightOnlyText(haloLabel(result)),
      lightOnlyMetric(result.haloScore, 4),
      lightOnlyCount(result.haloStarCount),
      lightOnlyCount(result.haloMeasuredStars),
      lightOnlyText(result.haloSummary),
      calibrationFrame
        ? "skipped"
        : haloPenaltyEnabled() && (result.haloSeverity === "Possible" || result.haloSeverity === "Likely")
          ? "yes"
          : "no",
      lightOnlyText(result.trackingSeverity),
      lightOnlyText(result.trackingReason),
      lightOnlyMetric(result.trackingScore, 4),
      lightOnlyCount(result.trackingSampleStarCount),
      lightOnlyText(result.trackingSampleRegion),
      lightOnlyMetric(result.directionalTrailScore, 4),
      lightOnlyMetric(result.directionalTrailStarFraction, 4),
      lightOnlyCount(result.directionalTrailStarCount),
      lightOnlyText(result.repeatDriftSource),
      lightOnlyMetric(result.repeatDriftScore, 4),
      lightOnlyMetric(result.repeatedStarFraction, 4),
      lightOnlyMetric(result.multiRepeatFraction, 4),
      lightOnlyMetric(result.elongation, 3)
    ];
    rows.push(buildCsvRow(row, separator));
  }

  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "astro_quality_report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function analyzeSelectedFiles() {
  const files = state.selectedFiles.slice();
  if (files.length === 0) {
    setTransientStatus("Select one or more folders with images first.");
    return;
  }

  cancelScoreRefresh();
  cancelPreviewRefresh();
  updateFolderFileCount();
  const analysisMode = getAnalysisMode();
  const analysisConfig = getAnalysisModeConfig(analysisMode);
  const selectionStats = selectedFileStats(files);
  const supported = selectionStats.supported;
  const ignoredBeforeFailures = ignoredFileCount(selectionStats);
  const existingResultKeys = analyzedResultKeys(state.results, analysisMode);
  const pending = filesMissingResults(supported, existingResultKeys);
  const alreadyAnalyzed = supported.length - pending.length;

  if (supported.length === 0) {
    resultsBody.innerHTML = "";
    state.results = [];
    state.selectedKeys.clear();
    state.activeFrameType = allFrameTypesKey;
    state.activeFilter = allFiltersKey;
    state.activeObjectShot = allObjectShotsKey;
    state.activeRecommendation = allRecommendationsKey;
    renderFilterPanel();
    exportBtn.disabled = true;
    const ignoredCount = ignoredBeforeFailures;
    state.analysisSummaryText =
      ignoredCount > 0
        ? `No supported astronomy frames found. Ignored ${ignoredCount} non-frame/system file(s).`
        : "No supported astronomy frames found.";
    state.lastAnalysisRunNote = "";
    setSummaryMessage();
    updateSelectAllState();
    updateSelectionControls();
    return;
  }

  if (pending.length === 0 && state.results.length > 0) {
    state.lastAnalysisRunNote = "No new supported frames to analyse; refreshed existing scores.";
    computeFinalScores(state.results);
    state.results.sort((a, b) => b.quality - a.quality);
    pruneSelectedKeysToResults();
    ensureFilterThresholds(state.results);
    state.lastTotalFiles = supported.length;
    state.lastUnsupportedFiles = ignoredBeforeFailures;
    saveSettings();
    renderAnalysisView();
    exportBtn.disabled = state.results.length === 0;
    updateSelectionControls();
    return;
  }

  const analysisRun = createAnalysisRun();
  setAnalysisControlsRunning(true);
  exportBtn.disabled = state.results.length === 0;
  sendSelectedBtn.disabled = true;
  const analysisProgress = startAnalysisProgress(pending.length, alreadyAnalyzed, analysisMode);

  try {
    const analysisOutcome = await analyzePendingFiles(pending, analysisMode, analysisConfig, analysisProgress, analysisRun);
    const newResults = analysisOutcome.newResults;
    const failures = analysisOutcome.failures;

    renderAnalysisProgress(
      analysisProgress,
      analysisOutcome.stopped
        ? `Elapsed: ${formatTimerSeconds((Date.now() - analysisProgress.startedAt) / 1000)}. Analysis stopped. Finalizing completed frames...`
        : `Elapsed: ${formatTimerSeconds((Date.now() - analysisProgress.startedAt) / 1000)}. Remaining: 0s. Finalizing results...`
    );

    const completedKeys = new Set(newResults.map((result) => getResultKey(result)));
    const retainedResults = state.results.filter((result) => !completedKeys.has(getResultKey(result)));
    const results = retainedResults.concat(newResults);
    computeFinalScores(results);
    results.sort((a, b) => b.quality - a.quality);

    state.results = results;
    pruneSelectedKeysToResults(results);
    state.activeFrameType = allFrameTypesKey;
    state.activeFilter = allFiltersKey;
    state.activeObjectShot = allObjectShotsKey;
    state.activeRecommendation = allRecommendationsKey;
    ensureFilterThresholds(results);
    state.lastTotalFiles = supported.length;
    state.lastUnsupportedFiles = ignoredBeforeFailures + failures;
    if (analysisOutcome.stopped) {
      state.lastAnalysisRunNote = `Analysis stopped after ${newResults.length} of ${pending.length} pending frame(s).`;
    } else {
      state.lastAnalysisRunNote =
        alreadyAnalyzed > 0
          ? `Analysed ${newResults.length} new frame(s); kept ${alreadyAnalyzed} existing result(s).`
          : "";
    }
    saveSettings();
    renderAnalysisView();
  } finally {
    stopAnalysisProgress(analysisProgress);
    clearAnalysisRun(analysisRun);
    setAnalysisControlsRunning(false);
    exportBtn.disabled = state.results.length === 0;
    updateSelectionControls();
  }
}

function onScoreSettingChanged() {
  updateWeightLabels();
  saveSettings();
  scheduleScoreRefresh();
}

function onAnalysisModeChanged() {
  saveSettings();
  if (state.results.length === 0) {
    setSummaryMessage(`${analysisModeLabel()} mode selected.`);
    return;
  }

  const currentMode = getAnalysisMode();
  const needsRemeasure = state.results.some((result) => resultAnalysisMode(result) !== currentMode);
  if (needsRemeasure) {
    setSummaryMessage(`Analysis mode changed to ${analysisModeLabel(currentMode)}. Click Analyse to re-measure frames in this mode.`);
  } else {
    setSummaryMessage(`${analysisModeLabel(currentMode)} mode selected.`);
  }
}

sharpnessWeight.addEventListener("input", onScoreSettingChanged);
noiseWeight.addEventListener("input", onScoreSettingChanged);
starsWeight.addEventListener("input", onScoreSettingChanged);
starCountWeight.addEventListener("input", onScoreSettingChanged);
clipWeight.addEventListener("input", onScoreSettingChanged);
previewStretch.addEventListener("input", onPreviewStretchChanged);

if (sharpnessModeHybrid) {
  sharpnessModeHybrid.addEventListener("change", () => {
    saveSettings();
    scheduleScoreRefresh(120);
  });
}

if (sharpnessModeFwhm) {
  sharpnessModeFwhm.addEventListener("change", () => {
    saveSettings();
    scheduleScoreRefresh(120);
  });
}

if (analysisModeStandard) {
  analysisModeStandard.addEventListener("change", onAnalysisModeChanged);
}

if (analysisModeExpert) {
  analysisModeExpert.addEventListener("change", onAnalysisModeChanged);
}

folderInput.addEventListener("change", () => {
  const { addedCount, duplicateCount } = addSelectedFolderFiles(folderInput.files);
  folderInput.value = "";
  updateFolderFileCount();
  if (addedCount === 0 && duplicateCount > 0) {
    setSummaryMessage("No new files added from that folder.");
  } else if (state.results.length > 0) {
    setSummaryMessage("Folder added. Click Analyse to process only the new files.");
  }
});

if (clearFoldersBtn) {
  clearFoldersBtn.addEventListener("click", () => {
    cancelScoreRefresh();
    cancelPreviewRefresh();
    state.selectedFiles = [];
    state.selectedFileKeys.clear();
    state.selectedFolders = [];
    state.nextFolderSelectionId = 1;
    if (folderInput) {
      folderInput.value = "";
    }
    updateFolderFileCount();
    state.results = [];
    state.selectedKeys.clear();
    state.activeFrameType = allFrameTypesKey;
    state.activeFilter = allFiltersKey;
    state.activeObjectShot = allObjectShotsKey;
    state.activeRecommendation = allRecommendationsKey;
    state.analysisSummaryText = "";
    state.lastAnalysisRunNote = "";
    state.lastTotalFiles = 0;
    state.lastUnsupportedFiles = 0;
    resultsBody.innerHTML = "";
    exportBtn.disabled = true;
    renderFilterPanel();
    updateSelectAllState();
    updateSelectionControls();
    setSummaryMessage("Folder selection cleared.");
  });
}

if (resetDefaultsBtn) {
  resetDefaultsBtn.addEventListener("click", resetDefaultPercentages);
}

analyzeBtn.addEventListener("click", () => {
  analyzeSelectedFiles().catch(() => {
    if (state.analysisRun) {
      clearAnalysisRun(state.analysisRun);
    }
    stopAnalysisProgress();
    setSummaryMessage("Analysis failed for one or more files.");
    setAnalysisControlsRunning(false);
    updateSelectionControls();
  });
});

if (stopAnalyzeBtn) {
  stopAnalyzeBtn.addEventListener("click", stopCurrentAnalysis);
}

exportBtn.addEventListener("click", exportCsv);
chooseOutputBtn.addEventListener("click", () => {
  chooseOutputDirectory().catch(() => {
    setSummaryMessage("Could not open output folder picker.");
  });
});
selectKeepBtn.addEventListener("click", selectKeepers);
clearSelectionBtn.addEventListener("click", clearSelection);
sendSelectedBtn.addEventListener("click", () => {
  sendSelectedImages().catch(() => {
    setSummaryMessage("Sending selected images failed.");
    updateSelectionControls();
  });
});

if (copyByFilterCheckbox) {
  copyByFilterCheckbox.addEventListener("change", saveSettings);
}

if (copyByTypeCheckbox) {
  copyByTypeCheckbox.addEventListener("change", saveSettings);
}

if (haloPenaltyCheckbox) {
  haloPenaltyCheckbox.addEventListener("change", () => {
    saveSettings();
    scheduleScoreRefresh(120);
  });
}

if (csvSeparatorSelect) {
  csvSeparatorSelect.addEventListener("change", saveSettings);
}

if (frameTypeTabs) {
  frameTypeTabs.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest(".filter-tab");
    if (!button) {
      return;
    }
    const frameType = button.dataset.frameType || allFrameTypesKey;
    state.activeFrameType = frameType;
    state.activeFilter = allFiltersKey;
    state.activeObjectShot = allObjectShotsKey;
    state.activeRecommendation = allRecommendationsKey;
    renderFilterPanel();
    renderResults(visibleResults());
  });
}

if (filterTabs) {
  filterTabs.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest(".filter-tab");
    if (!button) {
      return;
    }
    const filterName = button.dataset.filter || allFiltersKey;
    state.activeFilter = filterName;
    state.activeObjectShot = allObjectShotsKey;
    state.activeRecommendation = allRecommendationsKey;
    renderFilterPanel();
    renderResults(visibleResults());
  });
}

if (objectShotTabs) {
  objectShotTabs.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest(".filter-tab");
    if (!button) {
      return;
    }
    const objectShot = button.dataset.objectShot || allObjectShotsKey;
    state.activeObjectShot = objectShot;
    state.activeRecommendation = allRecommendationsKey;
    renderFilterPanel();
    renderResults(visibleResults());
  });
}

if (recommendationTabs) {
  recommendationTabs.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest(".filter-tab");
    if (!button) {
      return;
    }
    const recommendation = button.dataset.recommendation || allRecommendationsKey;
    state.activeRecommendation = recommendation;
    renderFilterPanel();
    renderResults(visibleResults());
  });
}

if (filterThresholds) {
  filterThresholds.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.dataset.filter) {
      return;
    }
    if (target.value.trim() === "") {
      target.value = String(getKeeperThreshold(target.dataset.filter));
      return;
    }
    const filterName = normalizeFilterName(target.dataset.filter);
    const threshold = Math.round(clamp(Number(target.value), 0, 100));
    target.value = String(threshold);
    state.filterThresholds[filterName] = threshold;
    saveSettings();
    renderFilterPanel();
    renderResults(visibleResults());
    updateSummary(state.results, state.lastTotalFiles || state.results.length, state.lastUnsupportedFiles || 0);
  });
}

resultsBody.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.classList.contains("row-check")) {
    return;
  }
  const key = target.dataset.key;
  if (!key) {
    return;
  }
  if (target.checked) {
    state.selectedKeys.add(key);
  } else {
    state.selectedKeys.delete(key);
  }
  const card = target.closest(".result-card");
  if (card) {
    card.classList.toggle("selected", target.checked);
  }
  updateSelectAllState();
  updateSelectionControls();
});

resultsBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest(".preview-button");
  if (!button) {
    return;
  }

  const key = button.dataset.key;
  if (!key) {
    return;
  }

  const result = findResultByKey(key);
  if (result) {
    openZoom(result);
  }
});

selectAllCheckbox.addEventListener("change", () => {
  const displayed = visibleResults();
  if (selectAllCheckbox.checked) {
    for (const result of displayed) {
      state.selectedKeys.add(getResultKey(result));
    }
  } else {
    for (const result of displayed) {
      state.selectedKeys.delete(getResultKey(result));
    }
  }
  renderResults(displayed);
});

zoomCloseBtn.addEventListener("click", closeZoom);

zoomOverlay.addEventListener("click", (event) => {
  if (event.target === zoomOverlay) {
    closeZoom();
  }
});

zoomRange.addEventListener("input", () => {
  setZoomLevel(zoomRange.value);
});

if (zoomMagnifierBtn) {
  zoomMagnifierBtn.addEventListener("click", () => {
    setMagnifierActive(!state.magnifierActive);
  });
}

if (zoomMagnifierPower) {
  zoomMagnifierPower.addEventListener("change", () => {
    saveSettings();
    updateZoomLensBackground();
  });
}

if (zoomStarOverlayBtn) {
  zoomStarOverlayBtn.addEventListener("click", () => {
    setStarOverlayActive(!state.starOverlayActive);
  });
}

if (zoomStage) {
  zoomStage.addEventListener("pointermove", updateZoomLens);
  zoomStage.addEventListener("pointerleave", hideZoomLens);
  zoomStage.addEventListener("scroll", hideZoomLens);
  zoomStage.addEventListener("click", (event) => {
    if (!state.starOverlayActive) {
      return;
    }
    const star = nearestOverlayStar(event);
    state.selectedOverlayStarId = star ? star.id : null;
    updateZoomStatus();
    drawZoomStarOverlay();
  });
}

zoomImage.addEventListener("load", () => {
  if (!zoomOverlay.hidden) {
    setZoomLevel(zoomRange.value);
    updateZoomLensBackground();
    scheduleZoomStarOverlayDraw();
  }
});

window.addEventListener("resize", () => {
  if (!zoomOverlay.hidden) {
    setZoomLevel(zoomRange.value);
    scheduleZoomStarOverlayDraw();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !zoomOverlay.hidden) {
    closeZoom();
  }
});

applyStoredSettings();
updateWeightLabels();
updatePreviewStretchLabel();
updateStarOverlayButton();
setOutputLabel();
updateFolderFileCount();
renderFilterPanel();
renderCalibrationReport();
updateSelectAllState();
updateSelectionControls();

if (!hasOutputFolderSupport()) {
  chooseOutputBtn.disabled = true;
  outputLabel.textContent = "Output folder: unsupported in this browser";
}
