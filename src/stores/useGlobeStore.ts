import { create } from 'zustand';
import { type MapStyleId, DEFAULT_STYLE_ID } from '../types/mapStyles';

/* ── Types ─────────────────────────────────────────────── */

export interface EarthquakeItem {
  type: 'earthquake';
  id: string;
  lat: number;
  lng: number;
  mag: number;
  place: string;
  depth: number;
  time: number;
}

export interface FlightItem {
  type: 'flight';
  callsign: string;
  originCountry: string;
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  heading: number;
  onGround: boolean;
}

export type SelectedItem = EarthquakeItem | FlightItem | null;

export interface CameraTarget {
  lat: number;
  lng: number;
  zoom: number;
}

export interface Layers {
  earthquakes: boolean;
  flights: boolean;
}

/* ── Store ──────────────────────────────────────────────── */

interface GlobeState {
  layers: Layers;
  minQuakeMag: number;
  selectedItem: SelectedItem;
  cameraTarget: CameraTarget | null;
  currentStyle: MapStyleId;

  toggleLayer: (layer: keyof Layers) => void;
  setMinQuakeMag: (mag: number) => void;
  setSelectedItem: (item: SelectedItem) => void;
  flyTo: (target: CameraTarget) => void;
  setMapStyle: (style: MapStyleId) => void;
}

export const useGlobeStore = create<GlobeState>((set) => ({
  layers: { earthquakes: true, flights: false },
  minQuakeMag: 4.5,
  selectedItem: null,
  cameraTarget: null,
  currentStyle: DEFAULT_STYLE_ID,

  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),

  setMinQuakeMag: (mag) => set({ minQuakeMag: mag }),

  setSelectedItem: (item) => set({ selectedItem: item }),

  flyTo: (target) => set({ cameraTarget: target }),

  setMapStyle: (style) => set({ currentStyle: style }),
}));

