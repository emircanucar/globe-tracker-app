import { memo } from 'react';
import { Globe, Compass } from 'lucide-react';
import { useGlobeStore } from '../../../stores/useGlobeStore';
import { GlassPanel } from '../../../components/ui';

interface OrientationControlProps {
  className?: string;
}

/**
 * OrientationControl (SRP):
 * Manages map perspective, North-up compass alignment, and world view reset.
 */
function OrientationControlInner({ className = '' }: OrientationControlProps) {
  const cameraState = useGlobeStore((s) => s.cameraState);
  const resetNorth = useGlobeStore((s) => s.resetNorth);
  const resetView = useGlobeStore((s) => s.resetView);

  const bearing = cameraState?.bearing ?? 0;
  const pitch = cameraState?.pitch ?? 0;

  // Normalized bearing (0-360)
  const normalizedBearing = ((bearing % 360) + 360) % 360;
  const isRotated = Math.abs(bearing) > 0.5 || Math.abs(pitch) > 0.5;

  return (
    <GlassPanel
      className={`px-2.5 py-2 flex items-center gap-2 select-none animate-fade-in ${className}`}
    >
      {/* 1. Compass / North Reset Button */}
      <button
        id="btn-reset-north"
        onClick={resetNorth}
        title={
          isRotated
            ? `Kuzeyi Sıfırla (${normalizedBearing.toFixed(0)}° / Eğim: ${pitch.toFixed(0)}°)`
            : 'Kuzey Hizalı'
        }
        className={`
          group relative flex items-center justify-center w-8 h-8 rounded-xl
          transition-all duration-300 cursor-pointer
          ${
            isRotated
              ? 'bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 shadow-sm'
              : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04]'
          }
        `}
        aria-label="Kuzeyi ve Bakış Açısını Sıfırla"
      >
        {/* Animated Compass Needle */}
        <div
          className="relative w-4 h-4 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${-bearing}deg)` }}
        >
          {/* North Point (Red) */}
          <div className="absolute -top-1 w-0 h-0 border-x-[2.5px] border-x-transparent border-b-[6px] border-b-rose-500 group-hover:border-b-rose-400" />
          {/* Center Pivot */}
          <div className="w-1 h-1 rounded-full bg-white/80 ring-1 ring-black/40" />
          {/* South Point (White/Silver) */}
          <div className="absolute -bottom-1 w-0 h-0 border-x-[2.5px] border-x-transparent border-t-[6px] border-t-zinc-400 group-hover:border-t-zinc-300" />
        </div>

        {/* Small "N" badge if rotated */}
        {isRotated && (
          <span className="absolute -top-1 -right-1 text-[8px] font-mono font-bold text-rose-400 bg-black/80 px-0.5 rounded leading-none">
            N
          </span>
        )}
      </button>

      {/* Vertical Divider */}
      <div className="w-px h-5 bg-white/[0.08]" />

      {/* 2. Full Globe View Reset Button */}
      <button
        id="btn-reset-view"
        onClick={resetView}
        title="Küre Görünümünü Sıfırla (Dünya Bakışı)"
        className="
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl
          bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98]
          border border-white/[0.04] hover:border-white/10
          text-zinc-400 hover:text-white
          text-[11px] font-medium tracking-tight
          transition-all duration-200 cursor-pointer
        "
        aria-label="Varsayılan Küre Bakışına Dön"
      >
        <Globe size={13} className="text-zinc-400 group-hover:text-white" />
        <span>Küreye Dön</span>
      </button>
    </GlassPanel>
  );
}

const OrientationControl = memo(OrientationControlInner);
export default OrientationControl;
