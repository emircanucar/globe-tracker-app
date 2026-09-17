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

/* ── Layer ID Collections ──────────────────────────────── */

export const EQ_LAYERS = ['eq-glow', 'eq-main', 'eq-pulse'] as const;
export const DAYNIGHT_LAYERS = [
  'night-shadow',
  'terminator-line',
  'sun-glow',
  'sun-core',
] as const;
export const INTERACTIVE_LAYERS = ['eq-main'] as const;
