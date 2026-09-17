import { memo } from 'react';
import { useGlobeStore } from '../../../stores/useGlobeStore';
import { GlassPanel } from '../../../components/ui';

interface MagnitudeFilterProps {
  className?: string;
}

function MagnitudeFilterInner({ className = '' }: MagnitudeFilterProps) {
  const minQuakeMag = useGlobeStore((s) => s.minQuakeMag);
  const setMinQuakeMag = useGlobeStore((s) => s.setMinQuakeMag);
  const earthquakesEnabled = useGlobeStore((s) => s.layers.earthquakes);

  if (!earthquakesEnabled) return null;

  return (
    <GlassPanel className={`px-5 py-4 w-full sm:w-60 select-none animate-fade-in ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-zinc-400 tracking-wide">
          Min Büyüklük
        </span>
        <span className="text-[13px] font-semibold font-mono text-white tabular-nums">
          M{minQuakeMag.toFixed(1)}
        </span>
      </div>
      <input
        id="mag-slider"
        type="range"
        min={4.5}
        max={7}
        step={0.1}
        value={minQuakeMag}
        onChange={(e) => setMinQuakeMag(parseFloat(e.target.value))}
        className="mag-slider w-full cursor-pointer"
        aria-label="Minimum Deprem Büyüklüğü"
      />
      <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1.5">
        <span>4.5</span>
        <span>7.0</span>
      </div>
    </GlassPanel>
  );
}

const MagnitudeFilter = memo(MagnitudeFilterInner);
export default MagnitudeFilter;
