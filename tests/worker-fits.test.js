"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function stubElement() {
  const base = {
    value: "0",
    checked: false,
    disabled: false,
    hidden: false,
    textContent: "",
    innerHTML: "",
    dataset: {},
    style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {},
    setAttribute() {},
    getAttribute() { return null; },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    closest() { return null; },
    getBoundingClientRect() { return { width: 88, height: 88 }; },
    reset() {}
  };
  return new Proxy(base, {
    get(target, property) {
      return property in target ? target[property] : () => {};
    }
  });
}

function mainContext() {
  const elements = new Map();
  const defaultValues = {
    sharpnessWeight: "40",
    noiseWeight: "15",
    starsWeight: "20",
    starCountWeight: "15",
    clipWeight: "10",
    fwhmThreshold: "4.0",
    eccentricityThreshold: "0.65",
    previewStretch: "25"
  };
  const document = {
    documentElement: {},
    getElementById(id) {
      if (!elements.has(id)) {
        const element = stubElement();
        if (Object.prototype.hasOwnProperty.call(defaultValues, id)) element.value = defaultValues[id];
        elements.set(id, element);
      }
      return elements.get(id);
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    createElement() { return stubElement(); },
    body: stubElement()
  };
  const context = {
    console,
    document,
    localStorage: { getItem() { return null; }, setItem() {} },
    navigator: { hardwareConcurrency: 8 },
    performance,
    Blob,
    URL: { createObjectURL() { return "blob:test"; }, revokeObjectURL() {} },
    ImageData: function ImageData() {},
    FileReader: function FileReader() {},
    Element: function Element() {},
    HTMLInputElement: function HTMLInputElement() {},
    CustomEvent: function CustomEvent() {},
    atob,
    WebAssembly,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };
  context.window = context;
  context.globalThis = context;
  context.addEventListener = () => {};
  context.dispatchEvent = () => {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync("moon-calculation.js", "utf8"), context);
  vm.runInContext(fs.readFileSync("i18n.js", "utf8"), context);
  vm.runInContext(fs.readFileSync("app.js", "utf8"), context);
  return context;
}

function fitsCard(keyword, value) {
  const content = keyword === "END" ? "END" : `${keyword.padEnd(8, " ")}= ${String(value).padStart(20, " ")}`;
  return content.padEnd(80, " ").slice(0, 80);
}

function syntheticFits() {
  const cards = [
    fitsCard("SIMPLE", "T"),
    fitsCard("BITPIX", "16"),
    fitsCard("NAXIS", "2"),
    fitsCard("NAXIS1", "64"),
    fitsCard("NAXIS2", "64"),
    fitsCard("BZERO", "32768"),
    fitsCard("BSCALE", "1"),
    fitsCard("IMAGETYP", "'LIGHT'"),
    fitsCard("FILTER", "'L'"),
    fitsCard("EXPTIME", "300"),
    fitsCard("DATE-OBS", "'2026-01-03T10:00:00'"),
    fitsCard("OBJCTRA", "'12:00:00'"),
    fitsCard("OBJCTDEC", "'+20:00:00'"),
    fitsCard("SITELAT", "'49:36:41.76N'"),
    fitsCard("SITELONG", "'006:07:54.84E'"),
    fitsCard("SITEELEV", "300"),
    fitsCard("END", "")
  ];
  const headerText = cards.join("").padEnd(2880, " ");
  const pixels = Buffer.alloc(64 * 64 * 2);
  for (let index = 0; index < 64 * 64; index += 1) {
    const x = index % 64;
    const y = Math.floor(index / 64);
    let value = 1100 + ((x * 17 + y * 29) % 40);
    if ((x - 18) ** 2 + (y - 20) ** 2 < 5 || (x - 45) ** 2 + (y - 39) ** 2 < 7) value = 9000;
    pixels.writeInt16BE(value - 32768, index * 2);
  }
  const dataPadding = Buffer.alloc((2880 - (pixels.length % 2880)) % 2880);
  return Buffer.concat([Buffer.from(headerText, "ascii"), pixels, dataPadding]);
}

async function run() {
  const main = mainContext();
  const workerSource = vm.runInContext("createAnalysisWorkerSource()", main);
  new vm.Script(workerSource);

  const fits = syntheticFits();
  const file = {
    name: "moon-session-test.fits",
    type: "",
    size: fits.length,
    lastModified: 0,
    async arrayBuffer() {
      return fits.buffer.slice(fits.byteOffset, fits.byteOffset + fits.byteLength);
    }
  };

  let resolveMessage;
  const posted = new Promise((resolve) => { resolveMessage = resolve; });
  const worker = {
    console,
    self: {
      postMessage(message) { resolveMessage(message); }
    },
    TextDecoder,
    DOMParser: function DOMParser() {},
    atob,
    WebAssembly,
    performance,
    setTimeout,
    clearTimeout
  };
  worker.globalThis = worker;
  vm.createContext(worker);
  vm.runInContext(workerSource, worker);
  await worker.self.onmessage({
    data: {
      type: "analyze",
      id: 1,
      file,
      analysisMode: "standard",
      metadata: {
        relativePath: "TestNight/moon-session-test.fits",
        displayPath: "TestNight/moon-session-test.fits",
        identityKey: "moon-test"
      }
    }
  });
  const message = await posted;
  assert.equal(message.type, "result", message.error || "worker result expected");
  const result = message.result;
  assert.equal(result.calculationVersion, "0.4.16");
  assert.ok(["wasm-simd", "wasm"].includes(result.analysisKernel), `expected WASM kernel, got ${result.analysisKernel}`);
  assert.equal(result.frameType, "Light");
  assert.equal(result.sourceFolder, "TestNight");
  assert.equal(result.observationTimeUtc, "2026-01-03T10:02:30.000Z");
  assert.ok(Math.abs(result.siteLatitudeDegrees - 49.6116) < 1e-4);
  assert.ok(Math.abs(result.siteLongitudeDegrees - 6.1319) < 1e-4);
  assert.equal(result.siteFromHeader, true);
  assert.ok(result.siteSource.includes("SITELAT/SITELONG"));

  main.testResult = result;
  vm.runInContext("updateMoonIllumination([testResult])", main);
  assert.ok(Number.isFinite(result.moonIlluminationPercent));
  assert.ok(Number.isFinite(result.moonRightAscensionDegrees));
  assert.ok(Number.isFinite(result.moonAltitudeDegrees));
  assert.ok(Number.isFinite(result.moonAzimuthDegrees));
  assert.ok(Number.isFinite(result.moonTargetSeparationDegrees));
  assert.ok(Number.isFinite(result.targetAltitudeDegrees));
  assert.ok(Number.isFinite(result.moonExposureScore));
  assert.notEqual(result.moonExposureKey, "unavailable");
  assert.equal(result.observationSessionLabel, "Night of 2026-01-02 UTC");
  const zoomLabels = JSON.parse(vm.runInContext("JSON.stringify(zoomMetricItems(testResult).map((item) => item[0]))", main));
  assert.equal(zoomLabels.length, 13);
  assert.ok(zoomLabels.includes("Status"));
  assert.ok(zoomLabels.includes("FWHM"));
  assert.ok(zoomLabels.includes("HFR"));
  assert.ok(zoomLabels.includes("Tracking"));
  assert.ok(!zoomLabels.includes("RA"));
  assert.ok(!zoomLabels.includes("Moon Phase"));

  main.gateResult = {
    ...result,
    frameType: "Light",
    quality: 90,
    filterName: "L",
    starCount: 100,
    fwhm: 4.0,
    eccentricity: 0.65,
    elongation: 1,
    clippingPressure: 0,
    clipping: 0,
    trackingSeverity: "None"
  };
  assert.equal(vm.runInContext("recommendationFor(gateResult)", main), "Keep");
  main.gateResult.fwhm = 4.01;
  assert.equal(vm.runInContext("recommendationFor(gateResult)", main), "Discard");
  assert.equal(vm.runInContext("qualityClass(gateResult)", main), "quality-low");
  assert.equal(
    vm.runInContext(
      "applyLightQualityThresholdPenalty(0.9, gateResult, []).toFixed(1)",
      main
    ),
    "0.0"
  );
  assert.equal(
    vm.runInContext(
      "fwhmThreshold.value = '5.0'; applyLightQualityThresholdPenalty(0.9, gateResult, []).toFixed(1)",
      main
    ),
    "0.9"
  );
  vm.runInContext("fwhmThreshold.value = '4.0'", main);
  main.gateResult.fwhm = 4.0;
  main.gateResult.eccentricity = 0.66;
  assert.equal(vm.runInContext("recommendationFor(gateResult)", main), "Discard");

  const headerSiteSource = result.siteSource;
  vm.runInContext(
    "state.savedSites = [{id:'site-header',name:'Home Observatory',latitudeDegrees:49.6116,longitudeDegrees:6.1319,elevationMetres:310}]; updateMoonIllumination([testResult]);",
    main
  );
  assert.equal(result.siteName, "Home Observatory");
  assert.equal(result.siteSource, headerSiteSource, "naming a detected site must preserve the FITS header source");
  const nearbyHeaderResult = {
    ...result,
    fileKey: "nearby-header-site",
    siteLatitudeDegrees: result.siteLatitudeDegrees + 0.001,
    siteLongitudeDegrees: result.siteLongitudeDegrees + 0.001
  };
  main.detectedSiteResults = [result, nearbyHeaderResult];
  assert.equal(vm.runInContext("detectedHeaderSites(detectedSiteResults).length", main), 1);
  assert.equal(vm.runInContext("detectedHeaderSites(detectedSiteResults)[0].frameCount", main), 2);
  vm.runInContext("saveNamedSite('Renamed Observatory',49.6116,6.1319,320)", main);
  assert.equal(vm.runInContext("state.savedSites.length", main), 1);
  assert.equal(vm.runInContext("state.savedSites[0].name", main), "Renamed Observatory");
  assert.equal(vm.runInContext("state.savedSites[0].elevationMetres", main), 320);
  vm.runInContext("state.results = detectedSiteResults; renderDetectedHeaderSites()", main);
  const detectedSiteHtml = vm.runInContext("document.getElementById('moonDetectedSites').innerHTML", main);
  assert.match(detectedSiteHtml, /Renamed Observatory/);
  assert.match(detectedSiteHtml, /Update Name/);

  const crossMidnightResult = { ...result, fileKey: "cross-midnight", observationTimestampMs: Date.parse("2026-01-03T23:30:00Z") };
  const afterMidnightResult = { ...result, fileKey: "after-midnight", observationTimestampMs: Date.parse("2026-01-04T02:30:00Z") };
  main.crossNightResults = [crossMidnightResult, afterMidnightResult];
  vm.runInContext("assignObservationSessions(crossNightResults)", main);
  assert.equal(crossMidnightResult.observationSessionKey, afterMidnightResult.observationSessionKey);
  assert.equal(crossMidnightResult.observationSessionLabel, "Night of 2026-01-03 UTC");

  const laterResult = { ...result, observationTimestampMs: result.observationTimestampMs + 9 * 60 * 60 * 1000 };
  main.sessionResults = [result, laterResult];
  vm.runInContext("assignObservationSessions(sessionResults)", main);
  assert.notEqual(result.observationSessionKey, laterResult.observationSessionKey);

  const missingSite = {
    ...result,
    sourceFolder: "RemoteNight",
    siteFromHeader: false,
    siteName: "",
    siteLatitudeDegrees: NaN,
    siteLongitudeDegrees: NaN,
    siteElevationMetres: NaN,
    siteSource: "None"
  };
  main.missingSite = missingSite;
  vm.runInContext(
    "state.savedSites = [{id:'site-test',name:'Remote Site',latitudeDegrees:-31.27,longitudeDegrees:149.07,elevationMetres:1100}]; state.folderSiteAssignments = {RemoteNight:'site-test'}; updateMoonIllumination([missingSite]);",
    main
  );
  assert.equal(missingSite.siteName, "Remote Site");
  assert.equal(missingSite.siteSource, "Saved site for RemoteNight");
  assert.ok(Number.isFinite(missingSite.moonAltitudeDegrees));

  const broadband = { ...result, filterName: "L" };
  const narrowband = { ...result, filterName: "Ha" };
  main.filterResults = [broadband, narrowband];
  vm.runInContext("updateMoonIllumination(filterResults)", main);
  assert.ok(narrowband.moonExposureScore <= broadband.moonExposureScore);

  const moonlitCloud = { moonExposureScore: 60, cloudSeverity: "Possible" };
  main.moonlitCloud = moonlitCloud;
  vm.runInContext(
    "updateSkyCondition(moonlitCloud,{structureScore:0.2,rangePercent:7,starLossScore:0.4,medianLiftScore:0.5,hasRelativeReference:true})",
    main
  );
  assert.equal(moonlitCloud.skyConditionKey, "moonlitCloud");

  const scoredWithSite = { ...result, fileKey: "score-site", fileName: "score-site.fits" };
  const scoredWithoutSite = {
    ...result,
    fileKey: "score-no-site",
    fileName: "score-no-site.fits",
    sourceFolder: "UnassignedNight",
    siteFromHeader: false,
    siteName: "",
    siteLatitudeDegrees: NaN,
    siteLongitudeDegrees: NaN,
    siteElevationMetres: NaN,
    siteSource: "None"
  };
  main.scoredResults = [scoredWithSite, scoredWithoutSite];
  vm.runInContext("computeFinalScores(scoredResults)", main);
  assert.equal(
    scoredWithSite.quality,
    scoredWithoutSite.quality,
    "Moon/site context must not alter quality while the optional penalty is disabled"
  );

  vm.runInContext("localStorage.getItem = () => JSON.stringify({moonPenalty:true}); applyStoredSettings()", main);
  assert.equal(vm.runInContext("getMoonPenaltyPercent()", main), 12, "v0.4.3 enabled setting should migrate to 12%");
  vm.runInContext("localStorage.getItem = () => JSON.stringify({moonPenaltyPercent:8}); applyStoredSettings()", main);
  assert.equal(vm.runInContext("getMoonPenaltyPercent()", main), 8);
  vm.runInContext("document.getElementById('moonPenaltyPercent').value = '10'", main);
  assert.equal(vm.runInContext("moonImpactPenaltyCap(15)", main), 0);
  assert.equal(vm.runInContext("moonImpactPenaltyCap(30)", main), 0.1);
  assert.equal(vm.runInContext("moonImpactPenaltyCap(60)", main), 0.1);
  assert.equal(vm.runInContext("moonImpactPenaltyCap(80)", main), 0.1);
  main.penalisedMoonResult = {
    moonExposureScore: 60,
    cloudMedianLiftScore: 0.6,
    cloudStructureScore: 0.01,
    cloudStarLossScore: 0.05,
    cloudSeverity: "None"
  };
  const penalty = vm.runInContext("moonImpactPenaltyForResult(penalisedMoonResult)", main);
  assert.ok(Math.abs(penalty - 0.036) < 1e-10);
  assert.equal(main.penalisedMoonResult.moonPenaltyApplied, true);
  assert.equal(main.penalisedMoonResult.moonPenaltyCap, 0.1);

  main.cloudPenalisedMoonResult = { ...main.penalisedMoonResult, cloudSeverity: "Possible" };
  main.cloudPenalisedMoonResult.cloudResidualScore = 0.2;
  const cloudMoonPenalty = vm.runInContext("moonImpactPenaltyForResult(cloudPenalisedMoonResult)", main);
  assert.ok(cloudMoonPenalty > 0, "Moon impact remains distinguishable when cloud evidence is present");
  assert.equal(main.cloudPenalisedMoonResult.moonPenaltyApplied, true);
  assert.match(main.cloudPenalisedMoonResult.moonPenaltyReason, /cloud residual/);

  vm.runInContext("document.getElementById('moonPenaltyPercent').value = '100'", main);
  main.cappedMoonResult = {
    moonExposureScore: 100,
    moonSmoothLiftScore: 1,
    cloudResidualScore: 0.2,
    cloudSeverity: "Likely"
  };
  const cappedMoonPenalty = vm.runInContext("moonImpactPenaltyForResult(cappedMoonResult, 0.1, 0.2)", main);
  assert.equal(cappedMoonPenalty, 0.5, "Moon penalty respects the combined sky cap");
  assert.equal(main.cappedMoonResult.moonPenaltyCapped, true);
  vm.runInContext("document.getElementById('moonPenaltyPercent').value = '10'", main);

  main.lowExposureMoonResult = { ...main.penalisedMoonResult, moonExposureScore: 15, cloudSeverity: "None" };
  assert.equal(vm.runInContext("moonImpactPenaltyForResult(lowExposureMoonResult)", main), 0);
  assert.equal(main.lowExposureMoonResult.moonPenaltyApplied, false);

  const stableTileSignature = Array.from({ length: 16 * 12 }, () => 0);
  const noLiftResults = Array.from({ length: 5 }, (_, index) => ({
    fileKey: `no-lift-${index}`,
    median: 100,
    medianPercent: 3.4,
    noise: 100,
    starCount: 1000,
    cloudStructureScore: 0.7,
    cloudBackgroundRangePercent: 20,
    cloudTileSignature: stableTileSignature,
    observationTimestampMs: index * 300000,
    cloudSeverity: "None"
  }));
  main.noLiftResults = noLiftResults;
  vm.runInContext("updateCloudAssessmentForGroup(noLiftResults)", main);
  assert.ok(noLiftResults.every((item) => item.cloudSeverity === "None"));
  assert.ok(noLiftResults.every((item) => item.cloudTemporalAnomalyScore === 0));
  assert.ok(noLiftResults.every((item) => item.cloudTileResidualScore === 0));

  const transientCloudSignature = stableTileSignature.map((value, index) => (index < 100 ? 15 : value));
  const transientResults = [3.4, 3.4, 3.4, 3.4, 4.2].map((medianPercent, index) => ({
    fileKey: `transient-${index}`,
    median: 100,
    medianPercent,
    noise: index === 4 ? 160 : 100,
    starCount: index === 4 ? 1500 : 1000,
    cloudStructureScore: 0.7,
    cloudBackgroundRangePercent: 12,
    cloudTileSignature: index === 4 ? transientCloudSignature : stableTileSignature,
    observationTimestampMs: index * 300000,
    cloudSeverity: "None"
  }));
  main.transientResults = transientResults;
  vm.runInContext("updateCloudAssessmentForGroup(transientResults)", main);
  const transientFrame = transientResults[4];
  assert.ok(transientFrame.cloudTemporalAnomalyScore >= 0.42);
  assert.equal(transientFrame.cloudSeverity, "Likely");

  console.log("Synthetic FITS worker, Moon context, and optional Moon-penalty tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
