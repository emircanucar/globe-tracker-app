import { memo, useEffect, useCallback } from 'react';
import { X, SlidersHorizontal, Layers as LayersIcon } from 'lucide-react';
import { useGlobeStore } from '../../stores/useGlobeStore';
import LayerMenu from './LayerMenu';
import { StyleSelector } from '../styles';
import { MagnitudeFilter } from '../earthquakes';

/**
 * MobileDrawer:
 * Clean, touch-friendly glass sheet for mobile and small-screen devices.
 * Consolidates layers, earthquake filters, and map styles to preserve
 * an unobstructed 3D globe viewport.
 */
function MobileDrawerInner() {
  const isOpen = useGlobeStore((s) => s.isMobileMenuOpen);
  const setOpen = useGlobeStore((s) => s.setMobileMenuOpen);
  const earthquakesEnabled = useGlobeStore((s) => s.layers.earthquakes);

  // Close on ESC key for accessibility
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    [setOpen]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling while drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end md:hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Katmanlar ve Ayarlar"
    >
      {/* 1. Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Slide-up Sheet Content */}
      <div
        className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[#0c0d14]/95 border-t border-white/10 backdrop-blur-2xl shadow-2xl p-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] animate-slide-up-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull Indicator Bar */}
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/[0.06] text-white/90">
              <SlidersHorizontal size={15} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Kontroller & Ayarlar
              </h2>
              <p className="text-[11px] text-zinc-400">
                Katman, stil ve veri filtreleme
              </p>
            </div>
          </div>

          <button
            id="mobile-drawer-close"
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Sections */}
        <div className="flex flex-col gap-4">
          {/* Section 1: Active Data Layers */}
          <section aria-labelledby="heading-layers">
            <LayerMenu />
          </section>

          {/* Section 2: Magnitude Filter (Shown when earthquake layer is active) */}
          {earthquakesEnabled && (
            <section aria-labelledby="heading-filter">
              <MagnitudeFilter className="w-full" />
            </section>
          )}

          {/* Section 3: Map Style Selector */}
          <section aria-labelledby="heading-styles">
            <StyleSelector />
          </section>
        </div>
      </div>
    </div>
  );
}

const MobileDrawer = memo(MobileDrawerInner);
export default MobileDrawer;
