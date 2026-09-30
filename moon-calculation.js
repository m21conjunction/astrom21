(function (root, factory) {
  const calculation = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = calculation;
  }
  if (root) {
    root.AstroMoonCalculation = calculation;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const millisecondsPerDay = 86400000;
  const unixEpochJulianDate = 2440587.5;
  const j2000JulianDate = 2451545.0;
  const daysPerJulianCentury = 36525;
  const synodicMonthDays = 29.530588853;
  const degreesToRadians = Math.PI / 180;
  const radiansToDegrees = 180 / Math.PI;

  function normalizeDegrees(value) {
    return ((value % 360) + 360) % 360;
  }

  function julianDateFromTimestamp(timestampMs) {
    return timestampMs / millisecondsPerDay + unixEpochJulianDate;
  }

  function sinDegrees(value) {
    return Math.sin(value * degreesToRadians);
  }

  function cosDegrees(value) {
    return Math.cos(value * degreesToRadians);
  }

  function atan2Degrees(y, x) {
    return Math.atan2(y, x) * radiansToDegrees;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function solveEccentricAnomaly(meanAnomalyDegrees, eccentricity) {
    const meanAnomaly = meanAnomalyDegrees * degreesToRadians;
    let eccentricAnomaly = meanAnomaly + eccentricity * Math.sin(meanAnomaly) * (1 + eccentricity * Math.cos(meanAnomaly));
    for (let iteration = 0; iteration < 5; iteration += 1) {
      eccentricAnomaly -=
        (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
        (1 - eccentricity * Math.cos(eccentricAnomaly));
    }
    return eccentricAnomaly;
  }

  function sunEclipticPosition(daysSince2000Jan0) {
    const perihelion = normalizeDegrees(282.9404 + 4.70935e-5 * daysSince2000Jan0);
    const eccentricity = 0.016709 - 1.151e-9 * daysSince2000Jan0;
    const meanAnomaly = normalizeDegrees(356.047 + 0.9856002585 * daysSince2000Jan0);
    const eccentricAnomaly = solveEccentricAnomaly(meanAnomaly, eccentricity);
    const x = Math.cos(eccentricAnomaly) - eccentricity;
    const y = Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentricAnomaly);
    const trueAnomaly = atan2Degrees(y, x);
    const distanceAu = Math.sqrt(x * x + y * y);
    return {
      meanAnomaly,
      meanLongitude: normalizeDegrees(meanAnomaly + perihelion),
      longitude: normalizeDegrees(trueAnomaly + perihelion),
      distanceAu
    };
  }

  function moonEquatorialPosition(julianDate) {
    const daysSince2000Jan0 = julianDate - 2451543.5;
    const ascendingNode = normalizeDegrees(125.1228 - 0.0529538083 * daysSince2000Jan0);
    const inclination = 5.1454;
    const argumentOfPerigee = normalizeDegrees(318.0634 + 0.1643573223 * daysSince2000Jan0);
    const semiMajorAxis = 60.2666;
    const eccentricity = 0.0549;
    const meanAnomaly = normalizeDegrees(115.3654 + 13.0649929509 * daysSince2000Jan0);
    const eccentricAnomaly = solveEccentricAnomaly(meanAnomaly, eccentricity);
    const orbitalX = semiMajorAxis * (Math.cos(eccentricAnomaly) - eccentricity);
    const orbitalY = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentricAnomaly);
    const trueAnomaly = atan2Degrees(orbitalY, orbitalX);
    let distanceEarthRadii = Math.sqrt(orbitalX * orbitalX + orbitalY * orbitalY);
    const argument = normalizeDegrees(trueAnomaly + argumentOfPerigee);

    const eclipticX =
      distanceEarthRadii *
      (cosDegrees(ascendingNode) * cosDegrees(argument) -
        sinDegrees(ascendingNode) * sinDegrees(argument) * cosDegrees(inclination));
    const eclipticY =
      distanceEarthRadii *
      (sinDegrees(ascendingNode) * cosDegrees(argument) +
        cosDegrees(ascendingNode) * sinDegrees(argument) * cosDegrees(inclination));
    const eclipticZ = distanceEarthRadii * sinDegrees(argument) * sinDegrees(inclination);

    let eclipticLongitude = normalizeDegrees(atan2Degrees(eclipticY, eclipticX));
    let eclipticLatitude = atan2Degrees(eclipticZ, Math.sqrt(eclipticX * eclipticX + eclipticY * eclipticY));
    const sun = sunEclipticPosition(daysSince2000Jan0);
    const lunarMeanLongitude = normalizeDegrees(meanAnomaly + argumentOfPerigee + ascendingNode);
    const elongation = normalizeDegrees(lunarMeanLongitude - sun.meanLongitude);
    const argumentOfLatitude = normalizeDegrees(lunarMeanLongitude - ascendingNode);

    eclipticLongitude +=
      -1.274 * sinDegrees(meanAnomaly - 2 * elongation) +
      0.658 * sinDegrees(2 * elongation) -
      0.186 * sinDegrees(sun.meanAnomaly) -
      0.059 * sinDegrees(2 * meanAnomaly - 2 * elongation) -
      0.057 * sinDegrees(meanAnomaly - 2 * elongation + sun.meanAnomaly) +
      0.053 * sinDegrees(meanAnomaly + 2 * elongation) +
      0.046 * sinDegrees(2 * elongation - sun.meanAnomaly) +
      0.041 * sinDegrees(meanAnomaly - sun.meanAnomaly) -
      0.035 * sinDegrees(elongation) -
      0.031 * sinDegrees(meanAnomaly + sun.meanAnomaly) -
      0.015 * sinDegrees(2 * argumentOfLatitude - 2 * elongation) +
      0.011 * sinDegrees(meanAnomaly - 4 * elongation);
    eclipticLatitude +=
      -0.173 * sinDegrees(argumentOfLatitude - 2 * elongation) -
      0.055 * sinDegrees(meanAnomaly - argumentOfLatitude - 2 * elongation) -
      0.046 * sinDegrees(meanAnomaly + argumentOfLatitude - 2 * elongation) +
      0.033 * sinDegrees(argumentOfLatitude + 2 * elongation) +
      0.017 * sinDegrees(2 * meanAnomaly + argumentOfLatitude);
    distanceEarthRadii += -0.58 * cosDegrees(meanAnomaly - 2 * elongation) - 0.46 * cosDegrees(2 * elongation);

    const obliquity = 23.4393 - 3.563e-7 * daysSince2000Jan0;
    const longitudeRadians = normalizeDegrees(eclipticLongitude) * degreesToRadians;
    const latitudeRadians = eclipticLatitude * degreesToRadians;
    const eclipticCosLatitude = Math.cos(latitudeRadians);
    const correctedX = distanceEarthRadii * Math.cos(longitudeRadians) * eclipticCosLatitude;
    const correctedY = distanceEarthRadii * Math.sin(longitudeRadians) * eclipticCosLatitude;
    const correctedZ = distanceEarthRadii * Math.sin(latitudeRadians);
    const equatorialY = correctedY * cosDegrees(obliquity) - correctedZ * sinDegrees(obliquity);
    const equatorialZ = correctedY * sinDegrees(obliquity) + correctedZ * cosDegrees(obliquity);

    return {
      rightAscensionDegrees: normalizeDegrees(atan2Degrees(equatorialY, correctedX)),
      declinationDegrees: atan2Degrees(equatorialZ, Math.sqrt(correctedX * correctedX + equatorialY * equatorialY)),
      eclipticLongitudeDegrees: normalizeDegrees(eclipticLongitude),
      eclipticLatitudeDegrees: eclipticLatitude,
      distanceEarthRadii
    };
  }

  function angularSeparationDegrees(ra1Degrees, dec1Degrees, ra2Degrees, dec2Degrees) {
    const rawValues = [ra1Degrees, dec1Degrees, ra2Degrees, dec2Degrees];
    if (rawValues.some((value) => value === null || value === undefined || value === "")) {
      return null;
    }
    const values = rawValues.map(Number);
    if (!values.every(Number.isFinite)) return null;
    const [ra1, dec1, ra2, dec2] = values.map((value) => value * degreesToRadians);
    const cosine =
      Math.sin(dec1) * Math.sin(dec2) + Math.cos(dec1) * Math.cos(dec2) * Math.cos(ra1 - ra2);
    return Math.acos(clamp(cosine, -1, 1)) * radiansToDegrees;
  }

  function horizontalCoordinates(timestampMs, rightAscensionDegrees, declinationDegrees, latitudeDegrees, longitudeDegrees) {
    const values = [timestampMs, rightAscensionDegrees, declinationDegrees, latitudeDegrees, longitudeDegrees].map(Number);
    if (!values.every(Number.isFinite) || Math.abs(values[3]) > 90 || Math.abs(values[4]) > 180) {
      return null;
    }
    const [timestamp, rightAscension, declination, latitude, longitude] = values;
    const julianDate = julianDateFromTimestamp(timestamp);
    const localSiderealDegrees = normalizeDegrees(
      280.46061837 +
        360.98564736629 * (julianDate - j2000JulianDate) +
        0.000387933 * Math.pow((julianDate - j2000JulianDate) / daysPerJulianCentury, 2) +
        longitude
    );
    const hourAngle = normalizeDegrees(localSiderealDegrees - rightAscension);
    const altitude = Math.asin(
      sinDegrees(declination) * sinDegrees(latitude) +
        cosDegrees(declination) * cosDegrees(latitude) * cosDegrees(hourAngle)
    );
    const azimuth = Math.atan2(
      -sinDegrees(hourAngle),
      Math.tan(declination * degreesToRadians) * cosDegrees(latitude) -
        sinDegrees(latitude) * cosDegrees(hourAngle)
    );
    return {
      altitudeDegrees: altitude * radiansToDegrees,
      azimuthDegrees: normalizeDegrees(azimuth * radiansToDegrees),
      localSiderealDegrees,
      hourAngleDegrees: hourAngle > 180 ? hourAngle - 360 : hourAngle
    };
  }

  function phaseKeyFromCycle(phaseCycle) {
    const cycle = ((phaseCycle % 1) + 1) % 1;
    if (cycle < 1 / 16 || cycle >= 15 / 16) return "new";
    if (cycle < 3 / 16) return "waxingCrescent";
    if (cycle < 5 / 16) return "firstQuarter";
    if (cycle < 7 / 16) return "waxingGibbous";
    if (cycle < 9 / 16) return "full";
    if (cycle < 11 / 16) return "waningGibbous";
    if (cycle < 13 / 16) return "lastQuarter";
    return "waningCrescent";
  }

  function calculate(timestampMs) {
    const timestamp = Number(timestampMs);
    if (!Number.isFinite(timestamp)) {
      return null;
    }

    const julianDate = julianDateFromTimestamp(timestamp);
    const centuries = (julianDate - j2000JulianDate) / daysPerJulianCentury;
    const centuries2 = centuries * centuries;
    const centuries3 = centuries2 * centuries;
    const centuries4 = centuries3 * centuries;

    const meanElongation = normalizeDegrees(
      297.8501921 +
        445267.1114034 * centuries -
        0.0018819 * centuries2 +
        centuries3 / 545868 -
        centuries4 / 113065000
    );
    const solarMeanAnomaly = normalizeDegrees(
      357.5291092 +
        35999.0502909 * centuries -
        0.0001536 * centuries2 +
        centuries3 / 24490000
    );
    const lunarMeanAnomaly = normalizeDegrees(
      134.9633964 +
        477198.8675055 * centuries +
        0.0087414 * centuries2 +
        centuries3 / 69699 -
        centuries4 / 14712000
    );

    const correctedElongation = normalizeDegrees(
      meanElongation +
        6.289 * sinDegrees(lunarMeanAnomaly) -
        2.1 * sinDegrees(solarMeanAnomaly) +
        1.274 * sinDegrees(2 * meanElongation - lunarMeanAnomaly) +
        0.658 * sinDegrees(2 * meanElongation) +
        0.214 * sinDegrees(2 * lunarMeanAnomaly) +
        0.11 * sinDegrees(meanElongation)
    );
    const phaseCycle = correctedElongation / 360;
    const illuminationFraction = (1 - Math.cos(correctedElongation * degreesToRadians)) / 2;
    const position = moonEquatorialPosition(julianDate);

    return {
      julianDate,
      phaseCycle,
      phaseKey: phaseKeyFromCycle(phaseCycle),
      lunarAgeDays: phaseCycle * synodicMonthDays,
      illuminationFraction,
      illuminationPercent: illuminationFraction * 100,
      rightAscensionDegrees: position.rightAscensionDegrees,
      declinationDegrees: position.declinationDegrees,
      eclipticLongitudeDegrees: position.eclipticLongitudeDegrees,
      eclipticLatitudeDegrees: position.eclipticLatitudeDegrees,
      distanceEarthRadii: position.distanceEarthRadii,
      method: "internal-low-precision-ephemeris"
    };
  }

  return Object.freeze({
    calculate,
    angularSeparationDegrees,
    horizontalCoordinates,
    julianDateFromTimestamp,
    moonEquatorialPosition,
    normalizeDegrees,
    phaseKeyFromCycle,
    synodicMonthDays
  });
});
