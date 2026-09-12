import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

/**
 * Dedicated hook for running the smooth earthquake ripple pulse animation loop
 */
export function usePulseAnimation(
  mapRef: React.RefObject<MapLibreMap | null>,
  isActive: boolean
) {
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) return;

    function animatePulse(timestamp: number) {
      const map = mapRef.current;
      if (map && map.getLayer('eq-pulse')) {
        const t = (timestamp % 2000) / 2000;
        const strokeW = 1.5 + t * 6;
        const opacity = 0.6 * (1 - t);

        map.setPaintProperty('eq-pulse', 'circle-stroke-width', strokeW);
        map.setPaintProperty('eq-pulse', 'circle-stroke-opacity', opacity);
      }

      animRef.current = requestAnimationFrame(animatePulse);
    }

    animRef.current = requestAnimationFrame(animatePulse);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [mapRef, isActive]);
}
