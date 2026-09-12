import { memo } from 'react';
import { GlassPanel } from '../../components/ui';
import HeaderBrand from './HeaderBrand';
import LayerStats from './LayerStats';

interface ControlHUDProps {
  className?: string;
}

function ControlHUDInner({ className = '' }: ControlHUDProps) {
  return (
    <div className={`fixed top-6 left-6 z-20 select-none animate-fade-in ${className}`}>
      <GlassPanel className="px-5 py-4 min-w-[200px]">
        {/* Brand & Status */}
        <HeaderBrand className="mb-3" />

        {/* Divider */}
        <div className="h-px bg-white/[0.04] mb-3" />

        {/* Live Counters */}
        <LayerStats />
      </GlassPanel>
    </div>
  );
}

const ControlHUD = memo(ControlHUDInner);
export default ControlHUD;
