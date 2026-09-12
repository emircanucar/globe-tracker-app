export type StateVector = (string | number | boolean | null)[];

export interface OpenSkyResponse {
  time: number;
  states: StateVector[] | null;
}

export interface FlightPoint {
  callsign: string;
  originCountry: string;
  lat: number;
  lng: number;
  altitude: number; // km
  velocity: number; // m/s
  heading: number;
  onGround: boolean;
}
