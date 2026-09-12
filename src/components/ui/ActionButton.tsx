import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Reusable Minimalist Button with hover transitions
 */
export default function ActionButton({
  children,
  icon,
  className = '',
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={`
        w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
        bg-white/[0.05] hover:bg-white/[0.08] active:scale-[0.99]
        border border-white/[0.06] hover:border-white/[0.1]
        text-zinc-300 hover:text-white
        text-[12px] font-medium tracking-wide
        transition-all duration-200 cursor-pointer
        ${className}
      `}
      {...props}
    >
      {icon && <span className="text-zinc-400">{icon}</span>}
      {children}
    </button>
  );
}
