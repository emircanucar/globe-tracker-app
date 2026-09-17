import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  GlobeCanvas,
  OrientationControl,
  MapLoader,
  SpaceBackground,
} from './features/map';
import { ControlHUD } from './features/hud';
import { MagnitudeFilter } from './features/earthquakes';
import { LayerMenu, MobileDrawer } from './features/layers';
import { StyleSelector } from './features/styles';
import { DetailCard } from './features/details';

/* ── QueryClient Configuration ──────────────────────────── */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

/* ── Application Root ──────────────────────────────────── */

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="relative w-full h-screen h-[100dvh] overflow-hidden bg-[#030712] select-none">
        {/* Dynamic Map Initialization Loader */}
        <MapLoader />

        {/* 0. Synthetic Space & Galaxy Environment */}
        <SpaceBackground />

        {/* 1. 3D WebGL Globe Viewport */}
        <section className="absolute inset-0" aria-label="3D Harita Küresi">
          <GlobeCanvas />
        </section>

        {/* 2. Top-Left / Top-Bar: Branding & Telemetry Counts */}
        <ControlHUD />

        {/* 3. Bottom-Left: Earthquake Magnitude Filter (Desktop view) */}
        <div className="hidden md:block fixed bottom-6 left-6 z-20">
          <MagnitudeFilter />
        </div>

        {/* 4. Top-Right: Layer & Style Controls (Desktop view) */}
        <aside className="hidden md:flex fixed top-6 right-6 z-20 flex-col gap-3 w-64">
          <LayerMenu />
          <StyleSelector />
        </aside>

        {/* 5. Mobile Drawer: Bottom sheet on mobile / tablet */}
        <MobileDrawer />

        {/* 6. Bottom-Right: Pole (North) & Perspective Reset Control */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
          <OrientationControl />
        </div>

        {/* 7. Center-Bottom / Responsive Bottom-Sheet: Active Entity Detail */}
        <DetailCard />
      </main>
    </QueryClientProvider>
  );
}
