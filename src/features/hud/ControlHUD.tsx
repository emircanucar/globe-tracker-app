import { memo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { GlassPanel } from '../../components/ui';
import HeaderBrand from './HeaderBrand';
import LayerStats from './LayerStats';
import { useGlobeStore } from '../../stores/useGlobeStore';

interface ControlHUDProps {
  className?: string;
}

function ControlHUDInner({ className = '' }: ControlHUDProps) {
  const toggleMobileMenu = useGlobeStore((s) => s.toggleMobileMenu);
  const isMobileMenuOpen = useGlobeStore((s) => s.isMobileMenuOpen);

  return (
    <header
      className={`fixed top-3 inset-x-3 sm:top-6 sm:left-6 sm:right-auto z-20 select-none animate-fade-in ${className}`}
      aria-label="Kontrol ve Durum Paneli"
    >
      <GlassPanel className="px-4 py-3 sm:px-5 sm:py-4 min-w-0 sm:min-w-[200px]">
        {/* Header bar: Brand & Mobile Settings Toggle */}
        <div className="flex items-center justify-between gap-3">
          <HeaderBrand />

          {/* Mobile Layer/Settings Button (< md) */}
          <button
            id="mobile-layers-toggle"
            onClick={toggleMobileMenu}
            className={`
              flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl
              text-xs font-medium transition-all duration-200 cursor-pointer
              ${
                isMobileMenuOpen
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 border border-white/[0.08]'
              }
            `}
            aria-expanded={isMobileMenuOpen}
            aria-label="Katmanlar ve Ayarlar Menüsünü Aç"
          >
            <SlidersHorizontal size={13} />
            <span>Katmanlar</span>
          </button>
        </div>

        {/* Divider (Hidden on very small compact view if desired, or kept subtle) */}
        <div className="h-px bg-white/[0.04] my-2.5 sm:my-3" />

        {/* Live Counters */}
        <LayerStats />
      </GlassPanel>
    </header>
  );
}

const ControlHUD = memo(ControlHUDInner);
export default ControlHUD;
