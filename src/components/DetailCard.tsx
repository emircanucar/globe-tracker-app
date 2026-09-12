import {
  X,
  MapPin,
  Gauge,
  Clock,
  Compass,
  Plane,
  ArrowUpRight,
  Navigation,
  Globe,
} from 'lucide-react';
import { useGlobeStore, type EarthquakeItem, type FlightItem } from '../stores/useGlobeStore';

export default function DetailCard() {
  const selectedItem = useGlobeStore((s) => s.selectedItem);
  const setSelectedItem = useGlobeStore((s) => s.setSelectedItem);
  const flyTo = useGlobeStore((s) => s.flyTo);

  if (!selectedItem) return null;

  const handleFlyTo = () => {
    flyTo({ lat: selectedItem.lat, lng: selectedItem.lng, zoom: 6 });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[420px] px-4 animate-slide-up">
      <div className="glass-card p-5 relative">
        {/* Close */}
        <button
          id="detail-close"
          onClick={() => setSelectedItem(null)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/[0.06] transition-colors text-zinc-500 hover:text-zinc-300 cursor-pointer"
        >
          <X size={15} />
        </button>

        {selectedItem.type === 'earthquake' ? (
          <EarthquakeDetail item={selectedItem} onFlyTo={handleFlyTo} />
        ) : (
          <FlightDetail item={selectedItem} onFlyTo={handleFlyTo} />
        )}
      </div>
    </div>
  );
}

/* ── Earthquake Detail ─────────────────────────────────── */

function EarthquakeDetail({ item, onFlyTo }: { item: EarthquakeItem; onFlyTo: () => void }) {
  const magColor =
    item.mag >= 6.0 ? 'text-red-400' :
    item.mag >= 5.0 ? 'text-orange-400' :
    'text-amber-400';

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-orange-500/10">
          <Gauge size={17} className={magColor} />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-0.5">
            Deprem
          </p>
          <h3 className="text-[13px] font-semibold text-white leading-snug truncate" title={item.place}>
            {item.place}
          </h3>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <MetricCell icon={<Gauge size={12} />} label="Büyüklük" value={`M${item.mag.toFixed(1)}`} accent={magColor} />
        <MetricCell icon={<ArrowUpRight size={12} />} label="Derinlik" value={`${item.depth.toFixed(1)} km`} />
        <MetricCell icon={<MapPin size={12} />} label="Konum" value={`${item.lat.toFixed(2)}°, ${item.lng.toFixed(2)}°`} />
        <MetricCell
          icon={<Clock size={12} />}
          label="Zaman"
          value={new Date(item.time).toLocaleDateString('tr-TR', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
          })}
        />
      </div>

      <ActionButton onClick={onFlyTo} />
    </>
  );
}

/* ── Flight Detail ─────────────────────────────────────── */

function FlightDetail({ item, onFlyTo }: { item: FlightItem; onFlyTo: () => void }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-blue-500/10">
          <Plane size={17} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-0.5">
            Uçuş
          </p>
          <h3 className="text-[13px] font-semibold text-white">
            {item.callsign}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <MetricCell icon={<Globe size={12} />} label="Ülke" value={item.originCountry} />
        <MetricCell icon={<ArrowUpRight size={12} />} label="İrtifa" value={`${item.altitude} km`} accent="text-blue-400" />
        <MetricCell icon={<Compass size={12} />} label="Hız" value={`${item.velocity} m/s`} />
        <MetricCell icon={<Navigation size={12} />} label="Yön" value={`${item.heading.toFixed(0)}°`} />
      </div>

      <ActionButton onClick={onFlyTo} />
    </>
  );
}

/* ── Shared sub-components ─────────────────────────────── */

function MetricCell({
  icon,
  label,
  value,
  accent = 'text-white',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/[0.03]">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-zinc-600">{icon}</span>
        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-[13px] font-semibold font-mono ${accent} tabular-nums`}>
        {value}
      </p>
    </div>
  );
}

function ActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      id="detail-flyto"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
        bg-white/[0.05] hover:bg-white/[0.08]
        border border-white/[0.06] hover:border-white/[0.1]
        text-zinc-300 hover:text-white
        text-[12px] font-medium tracking-wide
        transition-all duration-200 cursor-pointer"
    >
      <Navigation size={13} />
      Konuma Uç
    </button>
  );
}
