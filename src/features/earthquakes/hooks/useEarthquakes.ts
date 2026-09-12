import { useQuery } from '@tanstack/react-query';
import { useGlobeStore } from '../../../stores/useGlobeStore';
import type { EarthquakePoint, USGSResponse } from '../types';

const USGS_ENDPOINT =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';

export function useEarthquakes() {
  const earthquakesEnabled = useGlobeStore((s) => s.layers.earthquakes);
  const minMag = useGlobeStore((s) => s.minQuakeMag);

  return useQuery<EarthquakePoint[]>({
    queryKey: ['earthquakes'],
    queryFn: async () => {
      const res = await fetch(USGS_ENDPOINT);
      if (!res.ok) throw new Error('USGS fetch failed');
      const json: USGSResponse = await res.json();

      return json.features.map((f) => ({
        id: f.id,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        mag: f.properties.mag,
        place: f.properties.place ?? 'Bilinmeyen Konum',
        depth: f.geometry.coordinates[2],
        time: f.properties.time,
      }));
    },
    staleTime: 60_000,
    enabled: earthquakesEnabled,
    select: (data) => data.filter((q) => q.mag >= minMag),
  });
}
