import { memo } from 'react';
import { Palette, Check } from 'lucide-react';
import { useGlobeStore } from '../stores/useGlobeStore';
import { MAP_STYLES, type MapStyleId } from '../types/mapStyles';

function StyleSelectorInner() {
  const currentStyle = useGlobeStore((s) => s.currentStyle);
  const setMapStyle = useGlobeStore((s) => s.setMapStyle);

  return (
    <div className="glass-panel px-4 py-3.5 select-none animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="text-[11px] font-medium text-zinc-500 tracking-wide flex items-center gap-1.5">
          <Palette size={13} className="text-zinc-400" />
          Harita Stili
        </span>
        <span className="text-[10px] font-mono text-zinc-500 uppercase">
          Vektör
        </span>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 gap-2">
        {MAP_STYLES.map((style) => {
          const isSelected = currentStyle === style.id;
          return (
            <button
              key={style.id}
              id={`style-btn-${style.id}`}
              onClick={() => setMapStyle(style.id)}
              className={`
                group relative flex flex-col items-start p-2.5 rounded-xl text-left
                transition-all duration-200 cursor-pointer border
                ${
                  isSelected
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
                ) : (
                  <span className="text-[9px] text-zinc-600 font-mono">
                    {style.badge}
                  </span>
                )}
              </div>

              {/* Style Name */}
              <span
                className={`text-[12px] font-semibold tracking-tight transition-colors ${
                  isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              >
                {style.name}
              </span>

              {/* Micro description */}
              <span className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                {style.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const StyleSelector = memo(StyleSelectorInner);
export default StyleSelector;
