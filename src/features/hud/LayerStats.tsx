import React, { memo } from 'react';
import { Activity, Plane, Radio } from 'lucide-react';
import { useGlobeStore } from '../../stores/useGlobeStore';
import { useEarthquakes } from '../earthquakes';
import { useFlights } from '../flights';

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  count: number;
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
        {count.toLocaleString()}
      </span>
    </div>
  );
}

function LayerStatsInner() {
  const earthquakesEnabled = useGlobeStore((s) => s.layers.earthquakes);
  const flightsEnabled = useGlobeStore((s) => s.layers.flights);

  const { data: earthquakes = [] } = useEarthquakes();
  const { data: flights = [] } = useFlights();

  const quakeCount = earthquakesEnabled ? earthquakes.length : 0;
  const flightCount = flightsEnabled ? flights.length : 0;
  const totalActive = quakeCount + flightCount;

  return (
    <div className="flex flex-col gap-2">
      {earthquakesEnabled && (
        <StatRow
          icon={<Activity size={12} />}
          label="Depremler"
          count={quakeCount}
          color="text-orange-400"
        />
      )}
      {flightsEnabled && (
        <StatRow
          icon={<Plane size={12} />}
          label="Uçuşlar"
          count={flightCount}
          color="text-blue-400"
        />
      )}
      {totalActive === 0 && (
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
