import { memo } from 'react';
import { Palette } from 'lucide-react';
import { useGlobeStore } from '../../stores/useGlobeStore';
import { GlassPanel } from '../../components/ui';
import { MAP_STYLES } from '../map/config/mapStyles';
import StyleOptionCard from './StyleOptionCard';

interface StyleSelectorProps {
  className?: string;
}

function StyleSelectorInner({ className = '' }: StyleSelectorProps) {
  const currentStyle = useGlobeStore((s) => s.currentStyle);
  const setMapStyle = useGlobeStore((s) => s.setMapStyle);

  return (
    <GlassPanel className={`px-4 py-3.5 select-none animate-fade-in ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="text-[11px] font-medium text-zinc-500 tracking-wide flex items-center gap-1.5">
          <Palette size={13} className="text-zinc-400" />
          Harita Stili
        </span>

      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 gap-2">
        {MAP_STYLES.map((style) => (
          <StyleOptionCard
            key={style.id}
            style={style}
            isSelected={currentStyle === style.id}
            onSelect={() => setMapStyle(style.id)}
          />
        ))}
      </div>
    </GlassPanel>
  );
}

const StyleSelector = memo(StyleSelectorInner);
export default StyleSelector;
