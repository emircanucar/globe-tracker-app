/**
 * Generates GeoJSON for geographic meridians (longitude) and parallels (latitude).
 * Renders curved coordinate grid lines seamlessly on the 3D globe projection.
 */
export function generateGraticuleGeoJSON(): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  // Parallels (latitude lines every 15 degrees from -75 to 75)
  for (let lat = -75; lat <= 75; lat += 15) {
    const coords: [number, number][] = [];
    for (let lng = -180; lng <= 180; lng += 4) {
      coords.push([lng, lat]);
    }
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
      properties: {
        type: lat === 0 ? 'equator' : 'parallel',
        value: lat,
      },
    });
  }

  // Meridians (longitude lines every 15 degrees from -180 to 180)
  for (let lng = -180; lng < 180; lng += 15) {
    const coords: [number, number][] = [];
    for (let lat = -85; lat <= 85; lat += 4) {
      coords.push([lng, lat]);
    }
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
      properties: {
        type: lng === 0 ? 'prime-meridian' : 'meridian',
        value: lng,
      },
    });
  }

  return {
    type: 'FeatureCollection',
    features,
  };
}
