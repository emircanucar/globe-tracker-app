/**
 * Clean, lightweight GeoJSON types for map features
 */

export interface GeoJSONPointGeometry {
  type: 'Point';
  coordinates: [number, number];
}

export interface GeoJSONLineStringGeometry {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface GeoJSONPolygonGeometry {
  type: 'Polygon';
  coordinates: [number, number][][];
}

export type GeoJSONGeometry =
  | GeoJSONPointGeometry
  | GeoJSONLineStringGeometry
  | GeoJSONPolygonGeometry;

export interface GeoJSONFeature<G = GeoJSONGeometry, P = Record<string, unknown>> {
  type: 'Feature';
  geometry: G;
  properties: P;
}

export interface GeoJSONFeatureCollection<
  G = GeoJSONGeometry,
  P = Record<string, unknown>
> {
  type: 'FeatureCollection';
  features: GeoJSONFeature<G, P>[];
}
