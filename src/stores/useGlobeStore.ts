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
  bearing?: number;
  pitch?: number;
  duration?: number;
}

export interface CameraState {
  lat: number;
  lng: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export const DEFAULT_CAMERA: CameraState = {
  lat: 25,
  lng: 20,
  zoom: 1.8,
  bearing: 0,
  pitch: 0,
};

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
  cameraState: CameraState;
  currentStyle: MapStyleId;
  isMapLoading: boolean;

  toggleLayer: (layer: keyof Layers) => void;
  setMinQuakeMag: (mag: number) => void;
  setSelectedItem: (item: SelectedItem) => void;
  flyTo: (target: CameraTarget) => void;
  setMapStyle: (style: MapStyleId) => void;
  updateCameraState: (state: Partial<CameraState>) => void;
  resetNorth: () => void;
  resetView: () => void;
  setIsMapLoading: (loading: boolean) => void;
}

export const useGlobeStore = create<GlobeState>((set, get) => ({
  layers: { earthquakes: false, flights: false },
  minQuakeMag: 6.0,
  selectedItem: null,
  cameraTarget: null,
  cameraState: DEFAULT_CAMERA,
  currentStyle: DEFAULT_STYLE_ID,
  isMapLoading: true,

  toggleLayer: (layer) =>
    set((state) => {
      const isCurrentlyActive = state.layers[layer];
      const newLayers: Layers = {
        earthquakes: false,
        flights: false,
      };
      if (!isCurrentlyActive) {
        newLayers[layer] = true;
      }

      // Deselect item if its layer is deactivated or if another layer is selected
      let newSelectedItem = state.selectedItem;
      if (newSelectedItem) {
        if (!newLayers[newSelectedItem.type === 'earthquake' ? 'earthquakes' : 'flights']) {
          newSelectedItem = null;
        }
      }

      return {
        layers: newLayers,
        selectedItem: newSelectedItem,
      };
    }),

  setMinQuakeMag: (mag) => set({ minQuakeMag: mag }),

  setSelectedItem: (item) => set({ selectedItem: item }),

  flyTo: (target) => set({ cameraTarget: target }),

  setMapStyle: (style) => set({ currentStyle: style }),

  setIsMapLoading: (loading) => set({ isMapLoading: loading }),

  updateCameraState: (state) =>
    set((prev) => ({
      cameraState: { ...prev.cameraState, ...state },
    })),

  resetNorth: () => {
    const current = get().cameraState;
    set({
      cameraTarget: {
        lat: current.lat,
        lng: current.lng,
        zoom: current.zoom,
        bearing: 0,
        pitch: 0,
        duration: 800,
      },
    });
  },

  resetView: () => {
    set({
      cameraTarget: {
        ...DEFAULT_CAMERA,
        duration: 1400,
      },
    });
  },
}));


