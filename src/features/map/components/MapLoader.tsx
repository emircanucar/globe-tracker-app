import { memo, useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { useGlobeStore } from '../../../stores/useGlobeStore';

/**
 * Minimalist, Apple/Vercel-inspired MapLoader (SRP):
 * Pure visual loading screen that seamlessly conceals WebGL canvas
 * initialization and tile rendering with a smooth fade-out.
 */
function MapLoaderInner() {
  const isMapLoading = useGlobeStore((s) => s.isMapLoading);
  const [shouldRender, setShouldRender] = useState(true);

  // Keep in DOM while fading out, unmount after transition completes
  useEffect(() => {
    if (!isMapLoading) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
    }
  }, [isMapLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-[#050810]/95 backdrop-blur-2xl select-none
        transition-all duration-700 ease-out
        ${isMapLoading ? 'opacity-100' : 'opacity-0 pointer-events-none scale-[1.02]'}
      `}
      aria-busy={isMapLoading}
      aria-label="Harita yükleniyor"
    >
      {/* Background ambient light radial glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none animate-pulse" />

      {/* Center Card */}
      <div className="relative flex flex-col items-center px-8 py-7 rounded-2xl glass-card text-center shadow-2xl border border-white/[0.08]">
        {/* Animated Globe Orb */}
        <div className="relative flex items-center justify-center w-18 h-18 mb-4">
          {/* Outer pulse wave */}
          <div className="absolute inset-0 rounded-full border border-sky-500/25 animate-ping opacity-30 duration-1000" />

          {/* Rotating celestial ring */}
          <div
            className="absolute inset-1 rounded-full border border-dashed border-sky-400/35 animate-spin"
            style={{ animationDuration: '6s' }}
          />

          {/* Inner glowing orb */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/30 shadow-inner">
            <Globe size={22} className="text-sky-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[14px] font-semibold tracking-tight text-white">
            Globe Tracker
          </span>
          <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.06]">
            3D
          </span>
        </div>

        {/* Indeterminate Shimmer Progress Bar */}
        <div className="w-40 h-1 bg-white/[0.06] rounded-full overflow-hidden relative">
          <div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-sky-500 via-indigo-400 to-sky-400 animate-pulse"
            style={{
              width: '100%',
              animation: 'shimmer 1.8s infinite ease-in-out',
            }}
          />
        </div>
      </div>
    </div>
  );
}

const MapLoader = memo(MapLoaderInner);
export default MapLoader;
