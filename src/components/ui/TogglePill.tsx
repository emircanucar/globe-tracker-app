import React from 'react';

interface TogglePillProps {
  active: boolean;
  className?: string;
}

/**
 * iOS/Vercel-style animated toggle switch indicator
 */
export default function TogglePill({ active, className = '' }: TogglePillProps) {
  return (
    <div
      className={`toggle-pill ${className}`}
      data-active={active}
      aria-hidden="true"
    />
  );
}
