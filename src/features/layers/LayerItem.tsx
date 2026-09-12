import React, { memo } from 'react';
import { TogglePill } from '../../components/ui';

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
      onClick={onToggle}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
        transition-all duration-200 cursor-pointer
        text-[13px] font-medium
        ${
          active
            ? 'bg-white/[0.06] text-white'
            : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300'
        }
      `}
    >
      <span className={active ? activeAccent : 'text-zinc-600'}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      <TogglePill active={active} />
    </button>
  );
}

const LayerItem = memo(LayerItemInner);
export default LayerItem;
