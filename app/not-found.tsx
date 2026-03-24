import type { Metadata } from 'next';
import NotFound from '@/pages/NotFound';

export const metadata: Metadata = {
  title: { absolute: 'Страница не найдена' },
  description: 'Запрашиваемая страница отсутствует. Вернитесь на главную или воспользуйтесь меню.',
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return <NotFound />;
}
