import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'panel' | 'card';
  className?: string;
}

/**
 * Reusable Apple/Vercel-inspired Glassmorphic Container
 */
export default function GlassPanel({
  children,
  variant = 'panel',
  className = '',
  ...props
}: GlassPanelProps) {
  const baseClass = variant === 'card' ? 'glass-card' : 'glass-panel';

  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
