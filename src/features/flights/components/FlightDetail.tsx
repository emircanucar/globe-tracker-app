import { memo } from 'react';
import { Plane, Globe, ArrowUpRight, Compass, Navigation } from 'lucide-react';
import { MetricCell, ActionButton } from '../../../components/ui';
import type { FlightItem } from '../../../stores/useGlobeStore';

interface FlightDetailProps {
  item: FlightItem;
  onFlyTo: () => void;
}

function FlightDetailInner({ item, onFlyTo }: FlightDetailProps) {
  return (
    <>
      {/* Header */}
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

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <MetricCell
          icon={<Globe size={12} />}
          label="Ülke"
          value={item.originCountry}
        />
        <MetricCell
          icon={<ArrowUpRight size={12} />}
          label="İrtifa"
          value={`${item.altitude} km`}
          accent="text-blue-400"
        />
        <MetricCell
          icon={<Compass size={12} />}
          label="Hız"
          value={`${item.velocity} m/s`}
        />
        <MetricCell
          icon={<Navigation size={12} />}
          label="Yön"
          value={`${item.heading.toFixed(0)}°`}
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

const FlightDetail = memo(FlightDetailInner);
export default FlightDetail;
