/**
 * solarCalculator.ts
 *
 * Highly accurate astronomical calculator for Sun position and
 * Earth's Day/Night twilight terminator polygon.
 * 100% self-contained, offline, and zero external dependencies.
 */

import type {
  GeoJSONFeatureCollection,
  GeoJSONPolygonGeometry,
  GeoJSONLineStringGeometry,
  GeoJSONPointGeometry,
} from '../../../types/geojson';

export interface SunPosition {
  lat: number;
  lng: number;
  declination: number;
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Calculates the subsolar point (latitude and longitude where the Sun is directly overhead)
 * for any given UTC Date using standard astronomical algorithms (NOAA Solar Calculator).
 */
export function getSunPosition(date: Date = new Date()): SunPosition {
  const time = date.getTime();
  // Julian Day
  const jd = time / 86400000 + 2440587.5;
  // Julian Century
  const t = (jd - 2451545.0) / 36525.0;

  // Geometric Mean Longitude of Sun (degrees)
  let l0 = 280.46646 + t * (36000.76983 + t * 0.0003032);
  l0 = ((l0 % 360) + 360) % 360;

  // Mean Anomaly of Sun (degrees)
  let m = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  m = ((m % 360) + 360) % 360;
  const mRad = m * DEG2RAD;

  // Sun Equation of Center (degrees)
  const c =
    Math.sin(mRad) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * mRad) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * mRad) * 0.000289;

  // Sun True Longitude (degrees)
  const sunTrueLong = l0 + c;
  const sunTrueLongRad = sunTrueLong * DEG2RAD;

  // Mean Obliquity of the Ecliptic (degrees)
  const eps0 = 23.439291 - 0.0130042 * t;
  const epsRad = eps0 * DEG2RAD;

  // Sun Declination (latitude of subsolar point)
  const sinDecl = Math.sin(epsRad) * Math.sin(sunTrueLongRad);
  const declination = Math.asin(sinDecl) * RAD2DEG;

  // Right Ascension (degrees)
  const raRad = Math.atan2(
    Math.cos(epsRad) * Math.sin(sunTrueLongRad),
    Math.cos(sunTrueLongRad)
  );
  let ra = raRad * RAD2DEG;
  ra = ((ra % 360) + 360) % 360;

  // Greenwich Mean Sidereal Time (degrees)
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    t * t * 0.000387933 -
    (t * t * t) / 38710000;
  gmst = ((gmst % 360) + 360) % 360;

  // Subsolar Longitude: RA - GMST
  let lng = ra - gmst;
  // Normalize to [-180, 180]
  lng = ((((lng + 180) % 360) + 360) % 360) - 180;

  return {
    lat: declination,
    lng,
    declination,
  };
}

/**
 * Generates a GeoJSON FeatureCollection containing:
 * 1. Night hemisphere polygon (covering the night half of the Earth)
 * 2. Twilight terminator line (great circle line dividing day & night)
 * 3. Subsolar point (zenith Sun position)
 */
export function generateDayNightGeoJSON(date: Date = new Date()): {
  nightPolygonFC: GeoJSONFeatureCollection<GeoJSONPolygonGeometry>;
  terminatorLineFC: GeoJSONFeatureCollection<GeoJSONLineStringGeometry>;
  sunPointFC: GeoJSONFeatureCollection<GeoJSONPointGeometry>;
} {
  const sun = getSunPosition(date);

  // Avoid divide-by-zero at exact equinox
  let latSun = sun.lat;
  if (Math.abs(latSun) < 0.0001) {
    latSun = latSun >= 0 ? 0.0001 : -0.0001;
  }
  const tanLatSun = Math.tan(latSun * DEG2RAD);

  // Compute points along the terminator great circle from -180 to +180 deg
  const terminatorPoints: [number, number][] = [];
  const step = 1; // 1 degree resolution (361 points)

  for (let lon = -180; lon <= 180; lon += step) {
    const deltaLonRad = (lon - sun.lng) * DEG2RAD;
    // Condition for points 90 degrees away from sun:
    // tan(lat) = -cos(lon - sun.lng) / tan(sun.lat)
    const tanLat = -Math.cos(deltaLonRad) / tanLatSun;
    let lat = Math.atan(tanLat) * RAD2DEG;

    // Clamp to valid latitude range
    lat = Math.max(-89.99, Math.min(89.99, lat));
    terminatorPoints.push([lon, lat]);
  }

  // Build the closed Night Hemisphere polygon:
  // If Sun is in Northern Hemisphere (latSun > 0), North Pole has polar day, South Pole has polar night.
  // The night polygon extends from terminator to the South Pole (-90).
  // If Sun is in Southern Hemisphere (latSun < 0), North Pole has polar night.
  // The night polygon extends from terminator to the North Pole (+90).
  const polygonCoordinates: [number, number][] = [...terminatorPoints];

  if (latSun > 0) {
    // Extend to South Pole (-90)
    polygonCoordinates.push([180, -90]);
    polygonCoordinates.push([-180, -90]);
    // Close polygon
    polygonCoordinates.push(terminatorPoints[0]);
  } else {
    // Extend to North Pole (+90)
    polygonCoordinates.push([180, 90]);
    polygonCoordinates.push([-180, 90]);
    // Close polygon
    polygonCoordinates.push(terminatorPoints[0]);
  }

  const nightPolygonFC: GeoJSONFeatureCollection<GeoJSONPolygonGeometry> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [polygonCoordinates],
        },
        properties: {
          name: 'Gece Gölgesi',
          sunLat: sun.lat,
          sunLng: sun.lng,
        },
      },
    ],
  };

  const terminatorLineFC: GeoJSONFeatureCollection<GeoJSONLineStringGeometry> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: terminatorPoints,
        },
        properties: {
          name: 'Alacakaranlık Sınırı (Terminator)',
        },
      },
    ],
  };

  const sunPointFC: GeoJSONFeatureCollection<GeoJSONPointGeometry> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [sun.lng, sun.lat],
        },
        properties: {
          name: 'Güneş Tepe Noktası (Zenith)',
          lat: sun.lat,
          lng: sun.lng,
        },
      },
    ],
  };

  return {
    nightPolygonFC,
    terminatorLineFC,
    sunPointFC,
  };
}
