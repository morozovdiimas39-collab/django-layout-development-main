import { Suspense } from 'react';
import MetrikaGoalPage from '@/pages/MetrikaGoalPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <MetrikaGoalPage />
    </Suspense>
  );
}
