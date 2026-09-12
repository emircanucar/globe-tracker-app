/* eslint-disable @typescript-eslint/no-explicit-any */

export const EMPTY_FC = {
  type: 'FeatureCollection' as const,
  features: [] as any[],
};

/* ── Data-Driven MapLibre Paint Expressions ─────────────── */

export const QUAKE_COLOR: any = [
  'case',
  ['>=', ['get', 'mag'], 6.0], '#ef4444',
  ['>=', ['get', 'mag'], 5.5], '#f97316',
  ['>=', ['get', 'mag'], 5.0], '#f59e0b',
  '#eab308',
];

export const FLIGHT_COLOR: any = [
  'case',
  ['>', ['get', 'altitude'], 10], '#22d3ee',
  ['>', ['get', 'altitude'], 6],  '#38bdf8',
  ['>', ['get', 'altitude'], 3],  '#facc15',
  '#a3e635',
];

/* ── Layer ID Collections ──────────────────────────────── */

export const EQ_LAYERS = ['eq-glow', 'eq-main', 'eq-pulse'] as const;
export const FL_LAYERS = ['fl-glow', 'fl-main'] as const;
export const INTERACTIVE_LAYERS = ['eq-main', 'fl-main'] as const;
