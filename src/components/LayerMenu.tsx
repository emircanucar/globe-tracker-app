import { Activity, Plane } from 'lucide-react';
import { useGlobeStore, type Layers } from '../stores/useGlobeStore';

/* ── Layer Config ──────────────────────────────────────── */

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
  {
    key: 'flights',
    label: 'Uçuşlar',
    icon: <Plane size={14} />,
    activeAccent: 'text-blue-400',
  },
];

/* ── Component ─────────────────────────────────────────── */

interface LayerMenuProps {
  className?: string;
}

export default function LayerMenu({ className = '' }: LayerMenuProps) {
  const layers = useGlobeStore((s) => s.layers);
  const toggleLayer = useGlobeStore((s) => s.toggleLayer);

  return (
    <div className={`glass-panel px-4 py-3.5 select-none animate-fade-in ${className}`}>
      {/* Header */}
      <span className="text-[11px] font-medium text-zinc-500 tracking-wide block mb-3 px-0.5">
        Katmanlar
      </span>

      {/* Toggles */}
      <div className="flex flex-col gap-1.5">
        {LAYERS.map((cfg) => {
          const active = layers[cfg.key];
          return (
            <button
              key={cfg.key}
              id={`toggle-${cfg.key}`}
              onClick={() => toggleLayer(cfg.key)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
                transition-all duration-200 cursor-pointer
                text-[13px] font-medium
                ${active
                  ? 'bg-white/[0.06] text-white'
                  : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300'
                }
              `}
            >
              <span className={active ? cfg.activeAccent : 'text-zinc-600'}>
                {cfg.icon}
              </span>
              <span className="flex-1 text-left">{cfg.label}</span>
              <div
                className="toggle-pill"
                data-active={active}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
