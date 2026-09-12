import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobeCanvas from './components/GlobeCanvas';
import ControlHUD from './components/ControlHUD';
import LayerMenu from './components/LayerMenu';
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
        <LayerMenu />
        <DetailCard />
      </div>
    </QueryClientProvider>
  );
}
