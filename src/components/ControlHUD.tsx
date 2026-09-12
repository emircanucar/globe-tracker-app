import { Activity, Plane, Radio } from 'lucide-react';
import { useGlobeStore } from '../stores/useGlobeStore';
import { useEarthquakes } from '../hooks/useEarthquakes';
import { useFlights } from '../hooks/useFlights';

export default function ControlHUD() {
  const minQuakeMag = useGlobeStore((s) => s.minQuakeMag);
  const setMinQuakeMag = useGlobeStore((s) => s.setMinQuakeMag);
  const earthquakesEnabled = useGlobeStore((s) => s.layers.earthquakes);
  const flightsEnabled = useGlobeStore((s) => s.layers.flights);

  const { data: earthquakes = [] } = useEarthquakes();
  const { data: flights = [] }     = useFlights();

  const quakeCount  = earthquakesEnabled ? earthquakes.length : 0;
  const flightCount = flightsEnabled ? flights.length : 0;
  const totalActive = quakeCount + flightCount;

  return (
    <>
      {/* ── Top-Left: Title + Live Counts ──────────────── */}
      <div className="fixed top-6 left-6 z-20 select-none animate-fade-in">
        <div className="glass-panel px-5 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span className="relative block h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[13px] font-semibold tracking-[-0.01em] text-white/90">
              globe-tracker
            </span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded-md">
              LIVE
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.04] mb-3" />

          {/* Counts */}
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
        </div>
      </div>

      {/* ── Bottom-Left: Magnitude Slider ──────────────── */}
      {earthquakesEnabled && (
        <div className="fixed bottom-6 left-6 z-20 select-none animate-fade-in">
          <div className="glass-panel px-5 py-4 w-60">
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
              className="mag-slider w-full"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1.5">
              <span>4.5</span>
              <span>7.0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Sub-component ─────────────────────────────────────── */

function StatRow({
  icon,
  label,
  count,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}) {
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
