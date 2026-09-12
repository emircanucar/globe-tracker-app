import { memo } from 'react';
import { LivePulseBadge } from '../../components/ui';

interface HeaderBrandProps {
  className?: string;
}

function HeaderBrandInner({ className = '' }: HeaderBrandProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-white/90">
          globe-tracker
        </span>
      </div>
      <LivePulseBadge label="LIVE" />
    </div>
  );
}

const HeaderBrand = memo(HeaderBrandInner);
export default HeaderBrand;
