import { memo, useEffect, useState } from 'react';
import { useGlobeStore } from '../../../stores/useGlobeStore';

/**
 * Apple & Vercel-inspired Luxury MapLoader:
 * Precision typography, multi-axis orbital rings, Vercel-style laser sweep progress,
 * and seamless GPU-accelerated exit transition.
 */
function MapLoaderInner() {
  const isMapLoading = useGlobeStore((s) => s.isMapLoading);
  const [shouldRender, setShouldRender] = useState(true);

  // Production Failsafe: Never let loading overlay stay mounted longer than 3.5s under any circumstance
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      useGlobeStore.getState().setIsMapLoading(false);
    }, 3500);
    return () => clearTimeout(fallbackTimer);
  }, []);

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
        bg-black/85 backdrop-blur-3xl select-none
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isMapLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}
      `}
      aria-busy={isMapLoading}
      aria-label="Harita yükleniyor"
    >
      {/* Ambient Celestial Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Floating Center Card */}
      <div className="relative flex flex-col items-center px-10 py-9 rounded-3xl bg-zinc-950/70 border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl">
        {/* Multi-Axis Orbital Celestial Gyroscope */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          {/* Outer Dashed Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/20 animate-orbit-spin" />

          {/* Reverse Orbit Ring with Satellite Node */}
          <div className="absolute inset-2 rounded-full border border-white/[0.06] animate-orbit-reverse">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          </div>

          {/* Latitude / Longitude 3D Ellipses */}
          <div
            className="absolute inset-3 rounded-full border border-cyan-400/30 animate-spin"
            style={{ animationDuration: '8s', transform: 'rotateX(65deg)' }}
          />
          <div
            className="absolute inset-3 rounded-full border border-indigo-400/30 animate-spin"
            style={{ animationDuration: '6s', transform: 'rotateY(65deg)' }}
          />

          {/* Central Glowing Core Orb */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/30 border border-cyan-400/40 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping opacity-75" />
            <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
          </div>
        </div>

        {/* Title & Precision Badge */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-[15px] font-semibold tracking-tight text-white/95">
            globe-tracker
          </span>
          <span className="text-[9px] font-mono font-medium tracking-wider text-cyan-300/80 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            3D GLOBE
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase mb-5">
          Harita Yükleniyor
        </p>

        {/* Vercel-Style Precision Laser Sweep Bar */}
        <div className="w-44 h-[2px] bg-white/[0.08] rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser-sweep" />
        </div>
      </div>
    </div>
  );
}

const MapLoader = memo(MapLoaderInner);
export default MapLoader;

