'use client';

import { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  eager?: boolean;
  fallback?: string;
}

export default function Image({ 
  src, 
  alt, 
  eager = false, 
  className,
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E',
  ...props 
}: ImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  /** Кэшированное изображение часто успевает загрузиться до onLoad — остаётся opacity-0 */
  useEffect(() => {
    const el = imgRef.current;
    if (!el || error) return;
    const markLoaded = () => setLoaded(true);
    if (el.complete && el.naturalHeight > 0) {
      markLoaded();
      return;
    }
    el.addEventListener('load', markLoaded, { once: true });
    return () => el.removeEventListener('load', markLoaded);
  }, [src, error]);

  return (
    <img
      ref={imgRef}
      src={error ? fallback : src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      className={cn(
        'transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      {...props}
    />
  );
}
