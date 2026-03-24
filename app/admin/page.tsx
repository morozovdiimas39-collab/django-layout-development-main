import type { Metadata } from 'next';
import AdminPage from '@/pages/AdminPage';

export const metadata: Metadata = {
  title: { absolute: 'Админ-панель' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminPage />;
}
