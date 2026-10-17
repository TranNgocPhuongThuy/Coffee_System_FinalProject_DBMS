'use client';

import React, { useState } from 'react';
import { Coffee } from 'lucide-react';

interface SafeProductImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  fallbackIcon?: React.ReactNode;
}

export const SafeProductImage: React.FC<SafeProductImageProps> = ({
  src,
  alt = 'Sản phẩm',
  className = 'h-full w-full object-cover',
  fallbackClassName = 'flex h-full w-full items-center justify-center bg-[#FAF6F0] text-[#6F4E37]/60',
  fallbackIcon,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={fallbackClassName}>
        {fallbackIcon || <Coffee className="h-6 w-6 stroke-[1.5]" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default SafeProductImage;
