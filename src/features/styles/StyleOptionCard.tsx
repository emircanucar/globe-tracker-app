import { memo } from 'react';
import { Check } from 'lucide-react';
import type { MapStyleOption } from '../map/config/mapStyles';

interface StyleOptionCardProps {
  style: MapStyleOption;
  isSelected: boolean;
  onSelect: () => void;
}

function StyleOptionCardInner({
  style,
  isSelected,
  onSelect,
}: StyleOptionCardProps) {
  return (
    <button
      id={`style-btn-${style.id}`}
      onClick={onSelect}
      className={`
        group relative flex flex-col items-start p-2.5 rounded-xl text-left
        transition-all duration-200 cursor-pointer border
        ${isSelected
          ? 'bg-white/[0.08] border-white/20 shadow-sm shadow-black/40'
          : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/10'
        }
      `}
    >
      {/* Header inside button: Swatch & Badge */}
      <div className="flex items-center justify-between w-full mb-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full ring-2 ring-white/10 transition-transform group-hover:scale-110"
          style={{ backgroundColor: style.accent }}
        />
        {isSelected ? (
          <span className="text-[10px] text-zinc-300 font-medium flex items-center gap-0.5">
            <Check size={11} className="text-white" />
          </span>
        ) : null}
      </div>

      {/* Style Name */}
      <span
        className={`text-[12px] font-semibold tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
          }`}
      >
        {style.name}
      </span>


    </button>
  );
}

const StyleOptionCard = memo(StyleOptionCardInner);
export default StyleOptionCard;
