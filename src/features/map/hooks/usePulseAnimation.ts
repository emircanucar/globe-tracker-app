import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

/**
 * Optimized Pulse Animation Hook:
 * Throttles layer paint property updates to 30 FPS.
 * Completely stops running when earthquakes layer is toggled off.
 */
export function usePulseAnimation(
  mapRef: React.RefObject<MapLibreMap | null>,
  isActive: boolean
) {
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) return;

    function animatePulse(timestamp: number) {
      // Throttle paint updates to ~30 FPS (every 33ms)
      // Human eyes cannot perceive faster than this for smooth 2s wave pulses,
      // but it frees up 50-75% WebGL cycles for 60-144 FPS globe interaction.
      if (timestamp - lastTimeRef.current >= 33) {
        lastTimeRef.current = timestamp;
        const map = mapRef.current;

        if (map && map.getLayer('eq-pulse')) {
          const t = (timestamp % 2000) / 2000;
          const strokeW = 1.5 + t * 6;
          const opacity = 0.6 * (1 - t);

          map.setPaintProperty('eq-pulse', 'circle-stroke-width', strokeW);
          map.setPaintProperty('eq-pulse', 'circle-stroke-opacity', opacity);
        }
      }

      animRef.current = requestAnimationFrame(animatePulse);
    }

    animRef.current = requestAnimationFrame(animatePulse);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [mapRef, isActive]);
}
