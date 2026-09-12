import { useEffect, useRef, useState, memo, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useGlobeStore } from '../stores/useGlobeStore';
import { useEarthquakes, type EarthquakePoint } from '../hooks/useEarthquakes';
import { useFlights, type FlightPoint } from '../hooks/useFlights';
import { getMapStyleUrl } from '../types/mapStyles';

/* ── Constants ─────────────────────────────────────────── */

const EMPTY_FC = {
  type: 'FeatureCollection' as const,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  features: [] as any[],
};

/* ── Color expressions (MapLibre data-driven) ──────────── */

/* eslint-disable @typescript-eslint/no-explicit-any */
const QUAKE_COLOR: any = [
  'case',
  ['>=', ['get', 'mag'], 6.0], '#ef4444',
  ['>=', ['get', 'mag'], 5.5], '#f97316',
  ['>=', ['get', 'mag'], 5.0], '#f59e0b',
  '#eab308',
];

const FLIGHT_COLOR: any = [
  'case',
  ['>', ['get', 'altitude'], 10], '#22d3ee',
  ['>', ['get', 'altitude'], 6],  '#38bdf8',
  ['>', ['get', 'altitude'], 3],  '#facc15',
  '#a3e635',
];

/* ── Layer IDs ─────────────────────────────────────────── */

const EQ_LAYERS = ['eq-glow', 'eq-main', 'eq-pulse'] as const;
const FL_LAYERS = ['fl-glow', 'fl-main'] as const;

/* ── Helper: Attach custom sources and layers ──────────── */

function setupGlobeLayers(map: maplibregl.Map) {
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

/* ── Component ─────────────────────────────────────────── */

function GlobeCanvasInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const animRef = useRef<number>(0);
  const activeStyleRef = useRef<string>('');
  const [mapReady, setMapReady] = useState(false);

  /* Store selectors */
  const currentStyle = useGlobeStore((s) => s.currentStyle);
  const cameraTarget = useGlobeStore((s) => s.cameraTarget);
  const setSelectedItem = useGlobeStore((s) => s.setSelectedItem);
  const flyTo = useGlobeStore((s) => s.flyTo);
  const eqVisible = useGlobeStore((s) => s.layers.earthquakes);
  const flVisible = useGlobeStore((s) => s.layers.flights);

  /* Data hooks */
  const { data: earthquakes = [] } = useEarthquakes();
  const { data: flights = [] } = useFlights();

  /* Keep latest data & visibility in stable refs for style reload */
  const eqDataRef = useRef<EarthquakePoint[]>(earthquakes);
  eqDataRef.current = earthquakes;

  const flDataRef = useRef<FlightPoint[]>(flights);
  flDataRef.current = flights;

  const eqVisRef = useRef<boolean>(eqVisible);
  eqVisRef.current = eqVisible;

  const flVisRef = useRef<boolean>(flVisible);
  flVisRef.current = flVisible;

  /* Helper to sync current data into GeoJSON sources */
  const syncSources = useCallback((map: maplibregl.Map) => {
    const eqSrc = map.getSource('earthquakes') as maplibregl.GeoJSONSource | undefined;
    if (eqSrc) {
      eqSrc.setData({
        type: 'FeatureCollection',
        features: eqDataRef.current.map((eq) => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [eq.lng, eq.lat] },
          properties: { ...eq },
        })),
      });
    }

    const flSrc = map.getSource('flights') as maplibregl.GeoJSONSource | undefined;
    if (flSrc) {
      flSrc.setData({
        type: 'FeatureCollection',
        features: flDataRef.current.map((fl) => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [fl.lng, fl.lat] },
          properties: { ...fl },
        })),
      });
    }
  }, []);

  /* Helper to sync layer visibility */
  const syncVisibility = useCallback((map: maplibregl.Map) => {
    const eqVis = eqVisRef.current ? 'visible' : 'none';
    for (const id of EQ_LAYERS) {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', eqVis);
    }

    const flVis = flVisRef.current ? 'visible' : 'none';
    for (const id of FL_LAYERS) {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', flVis);
    }
  }, []);

  /* ── Map initialization ────────────────────────────────── */

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialStyleUrl = getMapStyleUrl(currentStyle);
    activeStyleRef.current = initialStyleUrl;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: initialStyleUrl,
      center: [20, 25],
      zoom: 1.8,
      attributionControl: false,
    });

    /* Attribution (bottom-right, minimal) */
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right',
    );

    map.on('load', () => {
      setupGlobeLayers(map);
      syncSources(map);
      syncVisibility(map);

      /* Click handler on features */
      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['eq-main', 'fl-main'],
        });
        if (!features.length) return;

        const f = features[0];
        const p = f.properties;
        if (!p) return;

        if (f.layer.id === 'eq-main') {
          setSelectedItem({
            type: 'earthquake',
            id: String(p.id),
            lat: Number(p.lat),
            lng: Number(p.lng),
            mag: Number(p.mag),
            place: String(p.place),
            depth: Number(p.depth),
            time: Number(p.time),
          });
          flyTo({ lat: Number(p.lat), lng: Number(p.lng), zoom: 6 });
        } else if (f.layer.id === 'fl-main') {
          setSelectedItem({
            type: 'flight',
            callsign: String(p.callsign),
            originCountry: String(p.originCountry),
            lat: Number(p.lat),
            lng: Number(p.lng),
            altitude: Number(p.altitude),
            velocity: Number(p.velocity),
            heading: Number(p.heading),
            onGround: p.onGround === true || p.onGround === 'true',
          });
          flyTo({ lat: Number(p.lat), lng: Number(p.lng), zoom: 6 });
        }
      });

      /* Hover cursor */
      map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['eq-main', 'fl-main'],
        });
        map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      });

      /* Pulse animation */
      function animatePulse(timestamp: number) {
        if (map.getLayer('eq-pulse')) {
          const t = (timestamp % 2000) / 2000;
          const strokeW = 1.5 + t * 6;
          const opacity = 0.6 * (1 - t);

          map.setPaintProperty('eq-pulse', 'circle-stroke-width', strokeW);
          map.setPaintProperty('eq-pulse', 'circle-stroke-opacity', opacity);
        }

        animRef.current = requestAnimationFrame(animatePulse);
      }

      animRef.current = requestAnimationFrame(animatePulse);
      setMapReady(true);
    });

    mapRef.current = map;

    return () => {
      cancelAnimationFrame(animRef.current);
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Dynamic style switching ───────────────────────────── */

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const newStyleUrl = getMapStyleUrl(currentStyle);

    if (activeStyleRef.current === newStyleUrl) return;
    activeStyleRef.current = newStyleUrl;

    map.setStyle(newStyleUrl);

    map.once('style.load', () => {
      setupGlobeLayers(map);
      syncSources(map);
      syncVisibility(map);
    });
  }, [currentStyle, mapReady, syncSources, syncVisibility]);

  /* ── Sync earthquake data changes ──────────────────────── */

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const eqSrc = map.getSource('earthquakes') as maplibregl.GeoJSONSource | undefined;
    if (!eqSrc) return;

    eqSrc.setData({
      type: 'FeatureCollection',
      features: earthquakes.map((eq) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [eq.lng, eq.lat] },
        properties: { ...eq },
      })),
    });
  }, [earthquakes, mapReady]);

  /* ── Sync flight data changes ──────────────────────────── */

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const flSrc = map.getSource('flights') as maplibregl.GeoJSONSource | undefined;
    if (!flSrc) return;

    flSrc.setData({
      type: 'FeatureCollection',
      features: flights.map((fl) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [fl.lng, fl.lat] },
        properties: { ...fl },
      })),
    });
  }, [flights, mapReady]);

  /* ── Toggle layer visibility ──────────────────────────── */

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    syncVisibility(mapRef.current);
  }, [eqVisible, flVisible, mapReady, syncVisibility]);

  /* ── Camera fly-to ────────────────────────────────────── */

  useEffect(() => {
    if (!mapReady || !cameraTarget || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [cameraTarget.lng, cameraTarget.lat],
      zoom: cameraTarget.zoom,
      duration: 1200,
      essential: true,
    });
  }, [cameraTarget, mapReady]);

  /* ── Render ───────────────────────────────────────────── */

  return <div ref={containerRef} className="w-full h-full" />;
}

const GlobeCanvas = memo(GlobeCanvasInner);
export default GlobeCanvas;
