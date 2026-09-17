import React, { memo } from 'react';
import { Activity } from 'lucide-react';
import { useGlobeStore, type Layers } from '../../stores/useGlobeStore';
import { GlassPanel } from '../../components/ui';
import LayerItem from './LayerItem';

interface LayerConfig {
  key: keyof Layers;
  label: string;
  icon: React.ReactNode;
  activeAccent: string;
}

const LAYERS: LayerConfig[] = [
  {
    key: 'earthquakes',
    label: 'Depremler',
    icon: <Activity size={14} />,
    activeAccent: 'text-orange-400',
  },
];

interface LayerMenuProps {
  className?: string;
}

function LayerMenuInner({ className = '' }: LayerMenuProps) {
  const layers = useGlobeStore((s) => s.layers);
  const toggleLayer = useGlobeStore((s) => s.toggleLayer);

  return (
    <GlassPanel className={`px-4 py-3.5 select-none animate-fade-in ${className}`}>
      {/* Header */}
      <span className="text-[11px] font-medium text-zinc-500 tracking-wide block mb-3 px-0.5">
        Katmanlar
      </span>

      {/* Radio Group */}
      <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="Katman Seçimi">
        {LAYERS.map((cfg) => (
          <LayerItem
            key={cfg.key}
            id={cfg.key}
            label={cfg.label}
            icon={cfg.icon}
            active={layers[cfg.key]}
            activeAccent={cfg.activeAccent}
            onToggle={() => toggleLayer(cfg.key)}
          />
        ))}
      </div>
    </GlassPanel>
  );
}

const LayerMenu = memo(LayerMenuInner);
export default LayerMenu;
