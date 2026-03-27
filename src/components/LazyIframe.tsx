'use client';

import { useEffect, useRef, useState } from 'react';

export type LazyIframeProps = {
  src: string;
  title: string;
  /** Classes on the iframe */
  className?: string;
  /** Wrapper around iframe (should fill the layout box, e.g. absolute inset-0) */
  wrapperClassName?: string;
  allow?: string;
  allowFullScreen?: boolean;
  frameBorder?: number;
  /** IntersectionObserver rootMargin — подгрузка чуть до появления в зоне видимости */
  rootMargin?: string;
};

export default function LazyIframe({
  src,
  title,
  className = 'h-full w-full border-0',
  wrapperClassName = 'absolute inset-0',
  allow,
  allowFullScreen = true,
  frameBorder,
  rootMargin = '280px 0px',
}: LazyIframeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || active) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [active, rootMargin]);

  return (
    <div ref={ref} className={wrapperClassName}>
      {active ? (
        <iframe
          src={src}
          title={title}
          className={className}
          allow={allow}
          allowFullScreen={allowFullScreen}
          loading="lazy"
          {...(frameBorder !== undefined ? { frameBorder } : {})}
        />
      ) : (
        <div className="absolute inset-0 bg-muted/40 animate-pulse" aria-hidden />
      )}
    </div>
  );
}
