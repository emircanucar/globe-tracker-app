import { useQuery } from '@tanstack/react-query';
import { useGlobeStore } from '../stores/useGlobeStore';

/* ── Types ─────────────────────────────────────────────── */

type StateVector = (string | number | boolean | null)[];

interface OpenSkyResponse {
  time: number;
  states: StateVector[] | null;
}

export interface FlightPoint {
  callsign: string;
  originCountry: string;
  lat: number;
  lng: number;
  altitude: number;   // km
  velocity: number;    // m/s
  heading: number;
  onGround: boolean;
}

/* ── Hook ───────────────────────────────────────────────── */

const OPENSKY_ENDPOINT = 'https://opensky-network.org/api/states/all';

export function useFlights() {
  const flightsEnabled = useGlobeStore((s) => s.layers.flights);

  return useQuery<FlightPoint[]>({
    queryKey: ['flights'],
    queryFn: async () => {
      const res = await fetch(OPENSKY_ENDPOINT);
      if (!res.ok) throw new Error('OpenSky fetch failed');
      const json: OpenSkyResponse = await res.json();

      if (!json.states) return [];

      return json.states
        .slice(0, 350)
        .filter((s) => s[6] != null && s[5] != null && !s[8])
        .map((s) => {
          const altKm = ((s[7] as number) ?? 0) / 1000;
          return {
            callsign: ((s[1] as string) ?? '').trim() || 'N/A',
            originCountry: (s[2] as string) ?? 'Unknown',
            lat: s[6] as number,
            lng: s[5] as number,
            altitude: Math.round(altKm * 100) / 100,
            velocity: Math.round((s[9] as number) ?? 0),
            heading: (s[10] as number) ?? 0,
            onGround: s[8] as boolean,
          };
        });
    },
    refetchInterval: flightsEnabled ? 15_000 : false,
    staleTime: 10_000,
    enabled: flightsEnabled,
  });
}
