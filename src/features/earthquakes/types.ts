export interface EarthquakePoint {
  id: string;
  lat: number;
  lng: number;
  mag: number;
  place: string;
  depth: number;
  time: number;
}

export interface USGSFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
  };
  geometry: {
    coordinates: [number, number, number]; // [lng, lat, depth]
  };
}

export interface USGSResponse {
  features: USGSFeature[];
}
