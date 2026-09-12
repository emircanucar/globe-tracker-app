import React from 'react';

interface MetricCellProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
  className?: string;
}

/**
 * Reusable Metric Cell for Telemetry and Inspection data
 */
export default function MetricCell({
  icon,
  label,
  value,
  accent = 'text-white',
  className = '',
}: MetricCellProps) {
  return (
    <div
      className={`bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/[0.03] ${className}`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-zinc-600">{icon}</span>
        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-[13px] font-semibold font-mono ${accent} tabular-nums truncate`}>
        {value}
      </p>
    </div>
  );
}
