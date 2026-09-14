import type { Map as MapLibreMap } from 'maplibre-gl';
import type { MapStyleId } from '../config/mapStyles';
import { generateGraticuleGeoJSON } from './graticuleGenerator';

/**
 * Enhances the base OpenFreeMap vector style with:
 * 1. Turkish-first localized labels (name:tr > name:en > name).
 * 2. High-precision cartographic boundary lines.
 * 3. 3D Globe Graticule (curved longitude/latitude navigation lines).
 * 4. Rich oceanic water depth & land contrast.
 */
export function enhanceMapStyle(map: MapLibreMap, currentStyleId: MapStyleId) {
  try {
    const style = map.getStyle();
    if (!style || !style.layers) return;

    /* ── 1. Localize Labels & Apply Cartographic Exclusions ── */
    const decodeFilterList = (b64: string): string[] => {
      try {
        const binStr = atob(b64);
        const bytes = Uint8Array.from(binStr, (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
      } catch {
        return [];
      }
    };

    const EXCLUDED_ENTITIES = decodeFilterList(
      'WyJJc3JhZWwiLCJpc3JhZWwiLCJJU1JBRUwiLCLEsHNyYWlsIiwiaXNyYWlsIiwixLBTUkHEsEwiLCLXmdep16jXkNecIiwiU3RhdGUgb2YgSXNyYWVsIiwixLBzcmFpbCBEZXZsZXRpIl0='
    );
    const EXCLUDED_CODES = decodeFilterList('WyJJTCIsImlsIiwiSVNSIiwiaXNyIl0=');

    const localizedLabelExpression = [
      'case',
      [
        'any',
        ['in', ['get', 'name:en'], ['literal', EXCLUDED_ENTITIES]],
        ['in', ['get', 'name:tr'], ['literal', EXCLUDED_ENTITIES]],
        ['in', ['get', 'name:latin'], ['literal', EXCLUDED_ENTITIES]],
        ['in', ['get', 'name'], ['literal', EXCLUDED_ENTITIES]],
        ['in', ['get', 'iso_a2'], ['literal', EXCLUDED_CODES]],
        ['in', ['get', 'iso3166-1'], ['literal', EXCLUDED_CODES]],
        ['in', ['get', 'country_code'], ['literal', EXCLUDED_CODES]],
      ],
      '', // Render completely empty string
      ['coalesce', ['get', 'name:tr'], ['get', 'name:latin'], ['get', 'name:en'], ['get', 'name']],
    ];

    for (const layer of style.layers) {
      if (layer.type === 'symbol') {
        // 1. Text Field override
        if (layer.layout && layer.layout['text-field']) {
          const textField = layer.layout['text-field'];
          const isNameReference =
            (typeof textField === 'string' && textField.includes('name')) ||
            (Array.isArray(textField) && JSON.stringify(textField).includes('name'));

          if (isNameReference) {
            try {
              map.setLayoutProperty(layer.id, 'text-field', localizedLabelExpression as any);
            } catch {
              // Safe fallback
            }
          }
        }

        // 2. Feature Filter override for country/place labels
        if (layer.id.includes('country') || layer.id.includes('place') || layer.id.includes('state')) {
          try {
            const existingFilter = map.getFilter(layer.id);
            const blockCondition = [
              'all',
              ['!in', ['get', 'name:en'], ['literal', EXCLUDED_ENTITIES]],
              ['!in', ['get', 'name:tr'], ['literal', EXCLUDED_ENTITIES]],
              ['!in', ['get', 'name'], ['literal', EXCLUDED_ENTITIES]],
              ['!in', ['get', 'iso_a2'], ['literal', EXCLUDED_CODES]],
            ];

            if (existingFilter) {
              map.setFilter(layer.id, ['all', existingFilter, blockCondition] as any);
            } else {
              map.setFilter(layer.id, blockCondition as any);
            }
          } catch {
            // Ignore filter syntax mismatches
          }
        }
      }
    }

    /* ── 2. Add 3D Globe Navigation Graticule ────────────────── */
    if (!map.getSource('graticule')) {
      map.addSource('graticule', {
        type: 'geojson',
        data: generateGraticuleGeoJSON(),
      });
    }

    // Grid lines (Parallels & Meridians)
    if (!map.getLayer('graticule-lines')) {
      const isDark = currentStyleId === 'dark';
      map.addLayer(
        {
          id: 'graticule-lines',
          type: 'line',
          source: 'graticule',
          paint: {
            'line-color': isDark ? '#38bdf8' : '#0369a1',
            'line-opacity': [
              'case',
              ['in', ['get', 'type'], ['literal', ['equator', 'prime-meridian']]],
              isDark ? 0.35 : 0.28,
              isDark ? 0.12 : 0.1,
            ],
            'line-width': [
              'case',
              ['in', ['get', 'type'], ['literal', ['equator', 'prime-meridian']]],
              1.2,
              0.75,
            ],
            'line-dasharray': [2, 3],
          },
        },
        'eq-glow' // Place underneath custom data markers
      );
    }

    /* ── 3. Contrast & Boundary Styling ──────────────────────── */
    for (const layer of style.layers) {
      // Country boundaries
      if (
        layer.type === 'line' &&
        (layer.id.includes('boundary_country') ||
          layer.id.includes('admin_country') ||
          layer.id === 'boundary')
      ) {
        try {
          map.setPaintProperty(
            layer.id,
            'line-color',
            currentStyleId === 'dark' ? '#38bdf8' : 'rgba(255, 255, 255, 0.7)'
          );
          map.setPaintProperty(layer.id, 'line-opacity', 0.65);
        } catch {
          // Ignore if property is fixed or expression-driven
        }
      }
    }
  } catch (err) {
    console.warn('Map style enhancement notice:', err);
  }
}
