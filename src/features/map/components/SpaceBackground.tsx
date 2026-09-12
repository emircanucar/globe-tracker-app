import { memo, useEffect, useRef } from 'react';

const STAR_COLORS = [
  '255, 255, 255', // Pure White
  '190, 225, 255', // Icy Stellar Blue
  '215, 215, 255', // Cosmic Violet
  '255, 240, 210', // Pale Gold
];

/**
 * Zero-Overhead SpaceBackground:
 * - Rendered ONCE on mount/resize (0% continuous CPU usage, zero frame redraws).
 * - Nebulae & atmospheric glow rendered with pure GPU-composited CSS gradients.
 * - Leaves 100% of GPU & CPU frame budgets to the 3D globe.
 */
function SpaceBackgroundInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const drawStaticStarfield = () => {
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);
      const count = Math.min(140, Math.floor((width * height) / 10000));

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() < 0.85 ? Math.random() * 0.7 + 0.6 : Math.random() * 0.6 + 1.2;
        const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        const alpha = Math.random() * 0.45 + 0.25;

        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fillRect(x, y, size, size);
      }
    };

    drawStaticStarfield();
    window.addEventListener('resize', drawStaticStarfield, { passive: true });

    return () => {
      window.removeEventListener('resize', drawStaticStarfield);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none bg-[#030712]">
      {/* 1. GPU-Accelerated Nebulae (Hardware composited, 0 CPU) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(circle at 18% 22%, rgba(76, 29, 149, 0.22) 0%, rgba(30, 27, 75, 0.1) 35%, transparent 65%),
            radial-gradient(circle at 82% 78%, rgba(14, 116, 144, 0.18) 0%, rgba(15, 23, 42, 0.06) 40%, transparent 65%),
            radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.2) 0%, transparent 60%)
          `,
          transform: 'translateZ(0)',
        }}
      />

      {/* 2. Static Canvas Starfield (Painted ONCE, 0 redraw cost) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ transform: 'translateZ(0)' }}
      />

      {/* 3. Atmospheric Exosphere Rim Halo around the Globe (Gradient-based, no GPU blur filter) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0.04) 35%, rgba(99, 102, 241, 0.02) 55%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
}

const SpaceBackground = memo(SpaceBackgroundInner);
export default SpaceBackground;
