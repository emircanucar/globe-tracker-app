import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobeCanvas, OrientationControl, MapLoader } from './features/map';
import { ControlHUD } from './features/hud';
import { MagnitudeFilter } from './features/earthquakes';
import { LayerMenu } from './features/layers';
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
      <main className="relative w-full h-screen overflow-hidden bg-black select-none">
        {/* Dynamic Map Initialization Loader (eliminates glitchy tile loading) */}
        <MapLoader />

        {/* 1. 3D WebGL Globe Viewport */}
        <section className="absolute inset-0" aria-label="3D Harita Küresi">
          <GlobeCanvas />
        </section>

        {/* 2. Top-Left: Branding & Telemetry Counts */}
        <ControlHUD />

        {/* 3. Bottom-Left: Earthquake Magnitude Filter */}
        <div className="fixed bottom-6 left-6 z-20">
          <MagnitudeFilter />
        </div>

        {/* 4. Top-Right: Layer & Style Controls */}
        <aside className="fixed top-6 right-6 z-20 flex flex-col gap-3 w-64">
          <LayerMenu />
          <StyleSelector />
        </aside>

        {/* 5. Bottom-Right: Pole (North) & Perspective Reset Control */}
        <div className="fixed bottom-6 right-6 z-20">
          <OrientationControl />
        </div>

        {/* 6. Center-Bottom: Active Entity Telemetry Inspection */}
        <DetailCard />
      </main>
    </QueryClientProvider>
  );
}
