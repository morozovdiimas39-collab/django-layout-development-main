import type { Metadata } from 'next';
import { Suspense } from 'react';
import MetrikaGoalPage from '@/pages/MetrikaGoalPage';

export const metadata: Metadata = {
  title: { absolute: 'Цель Метрики' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <MetrikaGoalPage />
    </Suspense>
  );
}
