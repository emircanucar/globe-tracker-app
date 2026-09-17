import React, { memo } from 'react';
import { Activity, SunMoon, Radio } from 'lucide-react';
import { useGlobeStore } from '../../stores/useGlobeStore';
import { useEarthquakes } from '../earthquakes';

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  count: number | string;
  color: string;
}

function StatRow({ icon, label, count, color }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className={`flex items-center gap-2 text-xs ${color}`}>
        {icon}
        <span className="text-zinc-400">{label}</span>
      </div>
      <span className="text-[13px] font-semibold font-mono text-white tabular-nums">
        {typeof count === 'number' ? count.toLocaleString() : count}
      </span>
    </div>
  );
}

function LayerStatsInner() {
  const earthquakesEnabled = useGlobeStore((s) => s.layers.earthquakes);
  const dayNightEnabled = useGlobeStore((s) => s.layers.dayNight);
  const { data: earthquakes = [], isLoading: isEarthquakesLoading } = useEarthquakes();

  const hasAnyLayer = earthquakesEnabled || dayNightEnabled;

  return (
    <div className="flex flex-col gap-2">
      {earthquakesEnabled && (
        <StatRow
          icon={<Activity size={12} />}
          label="Depremler"
          count={isEarthquakesLoading ? '...' : earthquakes.length}
          color="text-orange-400"
        />
      )}
      {dayNightEnabled && (
        <StatRow
          icon={<SunMoon size={12} />}
          label="Aydınlanma"
          count="Canlı"
          color="text-amber-300"
        />
      )}
      {!hasAnyLayer && (
        <div className="flex items-center gap-2 text-zinc-600 text-xs">
          <Radio size={12} />
          <span>Katman seçilmedi</span>
        </div>
      )}
    </div>
  );
}

const LayerStats = memo(LayerStatsInner);
export default LayerStats;
