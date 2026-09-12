import { useEffect, useRef, useState, memo, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useGlobeStore } from '../../stores/useGlobeStore';
import { useEarthquakes, type EarthquakePoint } from '../earthquakes';
import { useFlights, type FlightPoint } from '../flights';
import { getMapStyleUrl } from './config/mapStyles';
import {
  setupGlobeLayers,
  syncGeoJsonSource,
  setLayersVisibility,
  EQ_LAYERS,
  FL_LAYERS,
} from './utils/mapLayerUtils';
import { usePulseAnimation } from './hooks/usePulseAnimation';

function GlobeCanvasInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const activeStyleRef = useRef<string>('');
  const [mapReady, setMapReady] = useState(false);

  /* Global store subscriptions */
  const currentStyle = useGlobeStore((s) => s.currentStyle);
  const cameraTarget = useGlobeStore((s) => s.cameraTarget);
  const updateCameraState = useGlobeStore((s) => s.updateCameraState);
  const setSelectedItem = useGlobeStore((s) => s.setSelectedItem);
  const flyTo = useGlobeStore((s) => s.flyTo);
  const eqVisible = useGlobeStore((s) => s.layers.earthquakes);
  const flVisible = useGlobeStore((s) => s.layers.flights);
  const setIsMapLoading = useGlobeStore((s) => s.setIsMapLoading);

  /* Telemetry data streams */
  const { data: earthquakes = [] } = useEarthquakes();
  const { data: flights = [] } = useFlights();

  /* Keep stable refs to avoid stale closures during dynamic style reloads */
  const eqDataRef = useRef<EarthquakePoint[]>(earthquakes);
  eqDataRef.current = earthquakes;

  const flDataRef = useRef<FlightPoint[]>(flights);
  flDataRef.current = flights;

  const eqVisRef = useRef<boolean>(eqVisible);
  eqVisRef.current = eqVisible;

  const flVisRef = useRef<boolean>(flVisible);
  flVisRef.current = flVisible;

  /* Helper to re-sync all sources and visibility */
  const rehydrateMap = useCallback((map: maplibregl.Map) => {
    setupGlobeLayers(map);
    syncGeoJsonSource(map, 'earthquakes', eqDataRef.current);
    syncGeoJsonSource(map, 'flights', flDataRef.current);
    setLayersVisibility(map, EQ_LAYERS, eqVisRef.current);
    setLayersVisibility(map, FL_LAYERS, flVisRef.current);
  }, []);

  /* Pulse animation hook (Single Responsibility) */
  usePulseAnimation(mapRef, mapReady);

  /* ── 1. Map Initialization ──────────────────────────────── */
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

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    map.on('load', () => {
      rehydrateMap(map);

      // Smooth transition out once initial tiles render cleanly
      let isDone = false;
      const onInitialTilesReady = () => {
        if (isDone) return;
        isDone = true;
        setTimeout(() => {
          setIsMapLoading(false);
        }, 150);
      };

      map.once('idle', onInitialTilesReady);
      // Fallback timer so it never hangs indefinitely
      setTimeout(onInitialTilesReady, 2000);

      /* Click handler for interactive points */
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

      /* Hover cursor state */
      map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['eq-main', 'fl-main'],
        });
        map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      });

      /* Synchronize camera state (bearing, pitch, center, zoom) */
      const handleCameraChange = () => {
        const center = map.getCenter();
        updateCameraState({
          lat: center.lat,
          lng: center.lng,
          zoom: map.getZoom(),
          bearing: map.getBearing(),
          pitch: map.getPitch(),
        });
      };

      map.on('rotate', handleCameraChange);
      map.on('pitch', handleCameraChange);
      map.on('moveend', handleCameraChange);

      setMapReady(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 2. Dynamic Style Switching ─────────────────────────── */
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const newStyleUrl = getMapStyleUrl(currentStyle);

    if (activeStyleRef.current === newStyleUrl) return;
    activeStyleRef.current = newStyleUrl;

    map.setStyle(newStyleUrl);
    map.once('style.load', () => {
      rehydrateMap(map);
    });
  }, [currentStyle, mapReady, rehydrateMap]);

  /* ── 3. Data Synchronization ────────────────────────────── */
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    syncGeoJsonSource(mapRef.current, 'earthquakes', earthquakes);
  }, [earthquakes, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    syncGeoJsonSource(mapRef.current, 'flights', flights);
  }, [flights, mapReady]);

  /* ── 4. Layer Visibility ────────────────────────────────── */
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    setLayersVisibility(mapRef.current, EQ_LAYERS, eqVisible);
    setLayersVisibility(mapRef.current, FL_LAYERS, flVisible);
  }, [eqVisible, flVisible, mapReady]);

  /* ── 5. Camera FlyTo Transitions ────────────────────────── */
  useEffect(() => {
    if (!mapReady || !cameraTarget || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [cameraTarget.lng, cameraTarget.lat],
      zoom: cameraTarget.zoom,
      bearing: cameraTarget.bearing ?? 0,
      pitch: cameraTarget.pitch ?? 0,
      duration: cameraTarget.duration ?? 1200,
      essential: true,
    });
  }, [cameraTarget, mapReady]);

  return <div ref={containerRef} className="w-full h-full" />;
}

const GlobeCanvas = memo(GlobeCanvasInner);
export default GlobeCanvas;
