import { memo, useCallback } from 'react';
import { X } from 'lucide-react';
import { useGlobeStore } from '../../stores/useGlobeStore';
import { GlassPanel } from '../../components/ui';
import { EarthquakeDetail } from '../earthquakes';
import { FlightDetail } from '../flights';

function DetailCardInner() {
  const selectedItem = useGlobeStore((s) => s.selectedItem);
  const setSelectedItem = useGlobeStore((s) => s.setSelectedItem);
  const flyTo = useGlobeStore((s) => s.flyTo);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
  }, [setSelectedItem]);

  const handleFlyTo = useCallback(() => {
    if (!selectedItem) return;
    flyTo({ lat: selectedItem.lat, lng: selectedItem.lng, zoom: 6 });
  }, [selectedItem, flyTo]);

  if (!selectedItem) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[420px] px-4 animate-slide-up">
      <GlassPanel variant="card" className="p-5 relative">
        {/* Close Button */}
        <button
          id="detail-close"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/[0.06] transition-colors text-zinc-500 hover:text-zinc-300 cursor-pointer"
          aria-label="Detay Kartını Kapat"
        >
          <X size={15} />
        </button>

        {/* Dynamic Detail Body based on selected entity type */}
        {selectedItem.type === 'earthquake' ? (
          <EarthquakeDetail item={selectedItem} onFlyTo={handleFlyTo} />
        ) : (
          <FlightDetail item={selectedItem} onFlyTo={handleFlyTo} />
        )}
      </GlassPanel>
    </div>
  );
}

const DetailCard = memo(DetailCardInner);
export default DetailCard;
