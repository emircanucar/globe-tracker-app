/* ── OpenFreeMap Style Definitions ───────────────────────── */

export type MapStyleId = 'liberty' | 'dark' | 'positron' | 'bright';

export interface MapStyleOption {
  id: MapStyleId;
  name: string;
  url: string;
  description: string;
  accent: string;
  badge: string;
}

export const MAP_STYLES: MapStyleOption[] = [
  {
    id: 'liberty',
    name: 'Liberty',
    url: 'https://tiles.openfreemap.org/styles/liberty',
    description: 'Renkli & Topoğrafik',
    accent: '#38bdf8',
    badge: 'Varsayılan',
  },
  {
    id: 'dark',
    name: 'Dark',
    url: 'https://tiles.openfreemap.org/styles/dark',
    description: 'Karanlık & Gece',
    accent: '#a855f7',
    badge: 'Gece',
  },
  {
    id: 'positron',
    name: 'Positron',
    url: 'https://tiles.openfreemap.org/styles/positron',
    description: 'Açık & Minimal',
    accent: '#10b981',
    badge: 'Minimal',
  },
  {
    id: 'bright',
    name: 'Bright',
    url: 'https://tiles.openfreemap.org/styles/bright',
    description: 'Canlı & Detaylı',
    accent: '#f59e0b',
    badge: 'Vektör',
  },
];

export const DEFAULT_STYLE_ID: MapStyleId = 'liberty';

export function getMapStyleUrl(id: MapStyleId): string {
  const found = MAP_STYLES.find((s) => s.id === id);
  return found ? found.url : MAP_STYLES[0].url;
}
