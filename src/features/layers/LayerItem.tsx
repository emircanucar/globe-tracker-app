import React, { memo } from 'react';
interface LayerItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  activeAccent: string;
  onToggle: () => void;
}

function LayerItemInner({
  id,
  label,
  icon,
  active,
  activeAccent,
  onToggle,
}: LayerItemProps) {
  return (
    <button
      id={`toggle-${id}`}
      role="radio"
      aria-checked={active}
      onClick={onToggle}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
        transition-all duration-200 cursor-pointer
        text-[13px] font-medium
        ${
          active
            ? 'bg-white/[0.08] text-white shadow-sm border border-white/10'
            : 'text-zinc-500 border border-transparent hover:bg-white/[0.03] hover:text-zinc-300'
        }
      `}
    >
      <span className={active ? activeAccent : 'text-zinc-600'}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {/* Radio Indicator */}
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
          active
            ? 'border-white/80 bg-white/10'
            : 'border-zinc-700/70 bg-transparent'
        }`}
        aria-hidden="true"
      >
        {active && (
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
        )}
      </div>
    </button>
  );
}

const LayerItem = memo(LayerItemInner);
export default LayerItem;

