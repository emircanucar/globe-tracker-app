import type { Map as MapLibreMap } from 'maplibre-gl';

/**
 * Pulse Animation Hook (Disabled for Max Performance):
 * Constant setPaintProperty calls in an animation loop force WebGL
 * to recalculate 650+ geometry buffers every frame, causing noticeable lag.
 * By keeping the pulse layer static with GPU data expressions, 60+ FPS is guaranteed.
 */
export function usePulseAnimation(
  _mapRef: React.RefObject<MapLibreMap | null>,
  _isActive: boolean
) {
  // Intentionally static to prevent GPU shader buffer re-uploads
}
