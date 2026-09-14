import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
import {
  EMPTY_FC,
  QUAKE_COLOR,
  FLIGHT_COLOR,
  EQ_LAYERS,
  FL_LAYERS,
} from '../config/layersConfig';

/**
 * Ensures globe projection and adds all custom GeoJSON sources & layers to the MapLibre instance.
 */
export function setupGlobeLayers(map: MapLibreMap) {
  /* 1. Ensure globe projection */
  map.setProjection({ type: 'globe' });

  /* 2. Sources */
  if (!map.getSource('earthquakes')) {
    map.addSource('earthquakes', { type: 'geojson', data: EMPTY_FC });
  }
  if (!map.getSource('flights')) {
    map.addSource('flights', { type: 'geojson', data: EMPTY_FC });
  }

  /* 3. Earthquake layers */
  if (!map.getLayer('eq-glow')) {
    map.addLayer({
      id: 'eq-glow',
      type: 'circle',
      source: 'earthquakes',
      paint: {
        'circle-radius': ['*', ['-', ['get', 'mag'], 3], 7],
        'circle-color': QUAKE_COLOR,
        'circle-opacity': 0.12,
        'circle-blur': 1,
      },
    });
  }

  if (!map.getLayer('eq-main')) {
    map.addLayer({
      id: 'eq-main',
      type: 'circle',
      source: 'earthquakes',
      paint: {
        'circle-radius': ['*', ['-', ['get', 'mag'], 3], 3.5],
        'circle-color': QUAKE_COLOR,
        'circle-opacity': 0.85,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-opacity': 0.25,
      },
    });
  }

  if (!map.getLayer('eq-pulse')) {
    map.addLayer({
      id: 'eq-pulse',
      type: 'circle',
      source: 'earthquakes',
      paint: {
        'circle-radius': ['*', ['-', ['get', 'mag'], 3], 5],
        'circle-color': 'transparent',
        'circle-stroke-width': 1.5,
        'circle-stroke-color': QUAKE_COLOR,
        'circle-stroke-opacity': 0.5,
      },
    });
  }

  /* 4. Flight layers */
  if (!map.getLayer('fl-glow')) {
    map.addLayer({
      id: 'fl-glow',
      type: 'circle',
      source: 'flights',
      paint: {
        'circle-radius': 6,
        'circle-color': FLIGHT_COLOR,
        'circle-opacity': 0.12,
        'circle-blur': 1,
      },
    });
  }

  if (!map.getLayer('fl-main')) {
    map.addLayer({
      id: 'fl-main',
      type: 'circle',
      source: 'flights',
      paint: {
        'circle-radius': 3,
        'circle-color': FLIGHT_COLOR,
        'circle-opacity': 0.9,
        'circle-stroke-width': 0.5,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-opacity': 0.3,
      },
    });
  }
}

/**
 * Populates a GeoJSON source with point features
 */
export function syncGeoJsonSource<T extends { lat: number; lng: number }>(
  map: MapLibreMap,
  sourceId: 'earthquakes' | 'flights',
  points: readonly T[]
) {
  const src = map.getSource(sourceId) as GeoJSONSource | undefined;
  if (!src) return;

  src.setData({
    type: 'FeatureCollection',
    features: points.map((p) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [p.lng, p.lat] },
      properties: { ...p },
    })),
  });
}

/**
 * Updates visibility for an array of layer IDs
 */
export function setLayersVisibility(
  map: MapLibreMap,
  layerIds: readonly string[],
  visible: boolean
) {
  const vis = visible ? 'visible' : 'none';
  for (const id of layerIds) {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', vis);
    }
  }
}

export { EQ_LAYERS, FL_LAYERS };
