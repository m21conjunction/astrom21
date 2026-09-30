"use strict";

const assert = require("node:assert/strict");
const moon = require("../moon-calculation.js");

// Reference fractions are rounded values from the US Naval Observatory 2024
// Fraction of the Moon Illuminated table at 00:00 UTC.
const referenceCases = [
  ["2024-01-01T00:00:00Z", 0.78],
  ["2024-01-04T00:00:00Z", 0.52],
  ["2024-01-11T00:00:00Z", 0.0],
  ["2024-01-18T00:00:00Z", 0.48],
  ["2024-01-25T00:00:00Z", 0.99],
  ["2024-09-01T00:00:00Z", 0.04],
  ["2024-09-06T00:00:00Z", 0.08]
];

for (const [iso, expectedFraction] of referenceCases) {
  const result = moon.calculate(Date.parse(iso));
  assert.ok(result, `Expected a result for ${iso}`);
  assert.ok(
    Math.abs(result.illuminationFraction - expectedFraction) <= 0.015,
    `${iso}: expected ${expectedFraction}, received ${result.illuminationFraction}`
  );
  assert.ok(result.phaseCycle >= 0 && result.phaseCycle < 1);
  assert.ok(result.lunarAgeDays >= 0 && result.lunarAgeDays < moon.synodicMonthDays);
  assert.ok(result.rightAscensionDegrees >= 0 && result.rightAscensionDegrees < 360);
  assert.ok(result.declinationDegrees >= -90 && result.declinationDegrees <= 90);
  assert.ok(result.distanceEarthRadii > 50 && result.distanceEarthRadii < 70);
}

assert.equal(moon.calculate(Number.NaN), null);
assert.equal(moon.phaseKeyFromCycle(0), "new");
assert.equal(moon.phaseKeyFromCycle(0.25), "firstQuarter");
assert.equal(moon.phaseKeyFromCycle(0.5), "full");
assert.equal(moon.phaseKeyFromCycle(0.75), "lastQuarter");

assert.ok(Math.abs(moon.angularSeparationDegrees(10, 20, 10, 20)) < 1e-6);
assert.ok(Math.abs(moon.angularSeparationDegrees(0, 0, 180, 0) - 180) < 1e-6);
assert.equal(moon.angularSeparationDegrees(null, 0, 0, 0), null);

const luxembourgMoon = moon.calculate(Date.parse("2026-09-29T22:00:00Z"));
const horizontal = moon.horizontalCoordinates(
  Date.parse("2026-09-29T22:00:00Z"),
  luxembourgMoon.rightAscensionDegrees,
  luxembourgMoon.declinationDegrees,
  49.6116,
  6.1319
);
assert.ok(horizontal);
assert.ok(horizontal.altitudeDegrees >= -90 && horizontal.altitudeDegrees <= 90);
assert.ok(horizontal.azimuthDegrees >= 0 && horizontal.azimuthDegrees < 360);
assert.equal(moon.horizontalCoordinates(Date.now(), 0, 0, 95, 0), null);

console.log(`Moon calculation tests passed (${referenceCases.length} USNO reference dates plus geometry checks).`);
