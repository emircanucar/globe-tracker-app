import { memo, useCallback } from 'react';
import { X } from 'lucide-react';
import { useGlobeStore } from '../../stores/useGlobeStore';
import { GlassPanel } from '../../components/ui';
import { EarthquakeDetail } from '../earthquakes';

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
    <div
      className="fixed bottom-4 inset-x-3 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-[420px] sm:px-4 sm:inset-x-auto z-40 animate-slide-up"
      role="region"
      aria-label="Deprem Detay Bilgisi"
    >
      <GlassPanel variant="card" className="p-4 sm:p-5 relative shadow-2xl">
        {/* Close Button */}
        <button
          id="detail-close"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors text-zinc-400 hover:text-white cursor-pointer"
          aria-label="Detay Kartını Kapat"
        >
          <X size={16} />
        </button>

        {/* Earthquake Detail Body */}
        <EarthquakeDetail item={selectedItem} onFlyTo={handleFlyTo} />
      </GlassPanel>
    </div>
  );
}

const DetailCard = memo(DetailCardInner);
export default DetailCard;
