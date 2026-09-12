import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobeCanvas from './components/GlobeCanvas';
import ControlHUD from './components/ControlHUD';
import LayerMenu from './components/LayerMenu';
import StyleSelector from './components/StyleSelector';
import DetailCard from './components/DetailCard';

/* ── QueryClient (singleton outside component) ─────────── */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

/* ── App ───────────────────────────────────────────────── */

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* MapLibre canvas (background layer) */}
        <div className="absolute inset-0">
          <GlobeCanvas />
        </div>

        {/* UI Overlay (separate render tree) */}
        <ControlHUD />

        {/* Right HUD Controls: Layers & Map Styles */}
        <aside className="fixed top-6 right-6 z-20 flex flex-col gap-3 w-64 select-none">
          <LayerMenu />
          <StyleSelector />
        </aside>

        <DetailCard />
      </div>
    </QueryClientProvider>
  );
}
