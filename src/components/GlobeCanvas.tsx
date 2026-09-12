import { useEffect, useRef, useState, memo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useGlobeStore } from '../stores/useGlobeStore';
import { useEarthquakes } from '../hooks/useEarthquakes';
import { useFlights } from '../hooks/useFlights';

/* ── Constants ─────────────────────────────────────────── */

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

const EMPTY_FC = {
  type: 'FeatureCollection' as const,
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

/* ── Earthquake layer IDs ──────────────────────────────── */

const EQ_LAYERS = ['eq-glow', 'eq-main', 'eq-pulse'] as const;
const FL_LAYERS = ['fl-glow', 'fl-main'] as const;

/* ── Component ─────────────────────────────────────────── */

function GlobeCanvasInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const animRef = useRef<number>(0);
  const [mapReady, setMapReady] = useState(false);

  /* Store selectors (stable refs) */
  const cameraTarget = useGlobeStore((s) => s.cameraTarget);
  const setSelectedItem = useGlobeStore((s) => s.setSelectedItem);
  const flyTo = useGlobeStore((s) => s.flyTo);
  const eqVisible = useGlobeStore((s) => s.layers.earthquakes);
  const flVisible = useGlobeStore((s) => s.layers.flights);

  /* Data hooks */
  const { data: earthquakes = [] } = useEarthquakes();
  const { data: flights = [] }     = useFlights();

  /* ── Init map ─────────────────────────────────────────── */

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
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
      /* Globe projection */
      map.setProjection({ type: 'globe' });

      /* ── Sources ──────────────────────────────────────── */

      map.addSource('earthquakes', { type: 'geojson', data: EMPTY_FC });
      map.addSource('flights',    { type: 'geojson', data: EMPTY_FC });

      /* ── Earthquake layers ────────────────────────────── */

      // Soft glow behind each circle
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

      // Main solid circles
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

      // Pulse ring (animated via rAF)
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

      /* ── Flight layers ────────────────────────────────── */

      map.addLayer({
        id: 'fl-glow',
        type: 'circle',
        source: 'flights',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 6,
          'circle-color': FLIGHT_COLOR,
          'circle-opacity': 0.12,
          'circle-blur': 1,
        },
      });

      map.addLayer({
        id: 'fl-main',
        type: 'circle',
        source: 'flights',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 3,
          'circle-color': FLIGHT_COLOR,
          'circle-opacity': 0.9,
          'circle-stroke-width': 0.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.3,
        },
      });

      /* ── Click handlers ───────────────────────────────── */

      map.on('click', 'eq-main', (e) => {
        if (!e.features?.length) return;
        const p = e.features[0].properties!;
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
      });

      map.on('click', 'fl-main', (e) => {
        if (!e.features?.length) return;
        const p = e.features[0].properties!;
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
      });

      /* Cursor change on hover */
      for (const layer of ['eq-main', 'fl-main']) {
        map.on('mouseenter', layer, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layer, () => {
          map.getCanvas().style.cursor = '';
        });
      }

      /* ── Pulse animation ──────────────────────────────── */

      function animatePulse(timestamp: number) {
        if (!map.getLayer('eq-pulse')) return;

        const t = (timestamp % 2000) / 2000;              // 0→1 over 2s
        const strokeW = 1.5 + t * 6;                      // 1.5→7.5 px
        const opacity = 0.6 * (1 - t);                    // 0.6→0

        map.setPaintProperty('eq-pulse', 'circle-stroke-width', strokeW);
        map.setPaintProperty('eq-pulse', 'circle-stroke-opacity', opacity);

        animRef.current = requestAnimationFrame(animatePulse);
      }

      animRef.current = requestAnimationFrame(animatePulse);

      /* Signal ready */
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

  /* ── Sync earthquake data → source ────────────────────── */

  useEffect(() => {
    if (!mapReady) return;
    const src = mapRef.current?.getSource('earthquakes') as maplibregl.GeoJSONSource | undefined;
    if (!src) return;

    src.setData({
      type: 'FeatureCollection',
      features: earthquakes.map((eq) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [eq.lng, eq.lat] },
        properties: { ...eq },
      })),
    });
  }, [earthquakes, mapReady]);

  /* ── Sync flight data → source ────────────────────────── */

  useEffect(() => {
    if (!mapReady) return;
    const src = mapRef.current?.getSource('flights') as maplibregl.GeoJSONSource | undefined;
    if (!src) return;

    src.setData({
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
    if (!mapReady) return;
    const map = mapRef.current;
    if (!map) return;

    const eqVis = eqVisible ? 'visible' : 'none';
    for (const id of EQ_LAYERS) {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', eqVis);
    }

    const flVis = flVisible ? 'visible' : 'none';
    for (const id of FL_LAYERS) {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', flVis);
    }
  }, [eqVisible, flVisible, mapReady]);

  /* ── Camera fly-to ────────────────────────────────────── */

  useEffect(() => {
    if (!mapReady || !cameraTarget) return;
    mapRef.current?.flyTo({
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
