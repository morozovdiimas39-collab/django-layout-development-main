'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { recordTouchpoint } from '@/lib/utm';

/** Фиксирует касания при навигации (сквозная аналитика). */
export default function TouchpointTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    recordTouchpoint();
  }, [pathname, searchParams]);

  return null;
}
