import { memo } from 'react';
import { Gauge, ArrowUpRight, MapPin, Clock, Compass } from 'lucide-react';
import { MetricCell, ActionButton } from '../../../components/ui';
import type { EarthquakeItem } from '../../../stores/useGlobeStore';

interface EarthquakeDetailProps {
  item: EarthquakeItem;
  onFlyTo: () => void;
}

function EarthquakeDetailInner({ item, onFlyTo }: EarthquakeDetailProps) {
  const magColor =
    item.mag >= 6.0
      ? 'text-red-400'
      : item.mag >= 5.0
      ? 'text-orange-400'
      : 'text-amber-400';

  const formattedDate = new Date(item.time).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

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
          <h3
            className="text-[13px] font-semibold text-white leading-snug truncate"
            title={item.place}
          >
            {item.place}
          </h3>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <MetricCell
          icon={<Gauge size={12} />}
          label="Büyüklük"
          value={`M${item.mag.toFixed(1)}`}
          accent={magColor}
        />
        <MetricCell
          icon={<ArrowUpRight size={12} />}
          label="Derinlik"
          value={`${item.depth.toFixed(1)} km`}
        />
        <MetricCell
          icon={<MapPin size={12} />}
          label="Konum"
          value={`${item.lat.toFixed(2)}°, ${item.lng.toFixed(2)}°`}
        />
        <MetricCell
          icon={<Clock size={12} />}
          label="Zaman"
          value={formattedDate}
        />
      </div>

      {/* FlyTo Action */}
      <ActionButton
        id="detail-flyto"
        onClick={onFlyTo}
        icon={<Compass size={14} />}
      >
        Konuma Uç
      </ActionButton>
    </>
  );
}

const EarthquakeDetail = memo(EarthquakeDetailInner);
export default EarthquakeDetail;
