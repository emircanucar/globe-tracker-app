import React from 'react';

interface LivePulseBadgeProps {
  label?: string;
  className?: string;
}

/**
 * Animated Live Connectivity Indicator
 */
export default function LivePulseBadge({
  label = 'LIVE',
  className = '',
}: LivePulseBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center w-2.5 h-2.5">
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse-dot" />
        <span className="relative block h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      {label && (
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded-md">
          {label}
        </span>
      )}
    </div>
  );
}
