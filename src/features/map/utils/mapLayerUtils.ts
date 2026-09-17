import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
import type { GeoJSONFeatureCollection } from '../../../types/geojson';
import {
  EMPTY_FC,
  QUAKE_COLOR,
  EQ_LAYERS,
  DAYNIGHT_LAYERS,
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

  if (!map.getSource('daynight-shadow')) {
    map.addSource('daynight-shadow', { type: 'geojson', data: EMPTY_FC });
  }

  if (!map.getSource('daynight-terminator')) {
    map.addSource('daynight-terminator', { type: 'geojson', data: EMPTY_FC });
  }

  if (!map.getSource('daynight-sun')) {
    map.addSource('daynight-sun', { type: 'geojson', data: EMPTY_FC });
  }

  /* 3. Day / Night Environmental Overlay Layers (Placed below data layers) */
  if (!map.getLayer('night-shadow')) {
    map.addLayer({
      id: 'night-shadow',
      type: 'fill',
      source: 'daynight-shadow',
      paint: {
        'fill-color': '#020617',
        'fill-opacity': 0.52,
      },
    });
  }

  if (!map.getLayer('terminator-line')) {
    map.addLayer({
      id: 'terminator-line',
      type: 'line',
      source: 'daynight-terminator',
      paint: {
        'line-color': '#38bdf8',
        'line-width': 2,
        'line-opacity': 0.45,
        'line-blur': 3,
      },
    });
  }

  if (!map.getLayer('sun-glow')) {
    map.addLayer({
      id: 'sun-glow',
      type: 'circle',
      source: 'daynight-sun',
      paint: {
        'circle-radius': 22,
        'circle-color': '#f59e0b',
        'circle-opacity': 0.28,
        'circle-blur': 1,
      },
    });
  }

  if (!map.getLayer('sun-core')) {
    map.addLayer({
      id: 'sun-core',
      type: 'circle',
      source: 'daynight-sun',
      paint: {
        'circle-radius': 6,
        'circle-color': '#fef08a',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-opacity': 0.9,
      },
    });
  }

  /* 4. Earthquake Data Layers (Always visible on top of environmental shadow) */
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
}

/**
 * Populates a GeoJSON source with point features
 */
export function syncGeoJsonSource<T extends { lat: number; lng: number }>(
  map: MapLibreMap,
  sourceId: 'earthquakes',
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
 * Directly updates a GeoJSON source with a FeatureCollection
 */
export function syncGeoJsonDirect(
  map: MapLibreMap,
  sourceId: string,
  data: GeoJSONFeatureCollection<any>
) {
  const src = map.getSource(sourceId) as GeoJSONSource | undefined;
  if (!src) return;
  src.setData(data as any);
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

export { EQ_LAYERS, DAYNIGHT_LAYERS };
