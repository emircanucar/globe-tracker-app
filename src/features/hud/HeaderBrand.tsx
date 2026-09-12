import { memo } from 'react';

interface HeaderBrandProps {
  className?: string;
}

function HeaderBrandInner({ className = '' }: HeaderBrandProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="text-[13px] font-semibold tracking-[-0.01em] text-white/90">
        globe-tracker
      </span>
    </div>
  );
}

const HeaderBrand = memo(HeaderBrandInner);
export default HeaderBrand;
