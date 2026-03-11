import type { Metadata } from 'next';
import SettingsPage from '@/pages/SettingsPage';

export const metadata: Metadata = {
  title: 'Настройки Telegram бота - Казбек Меретуков',
  robots: 'noindex, nofollow',
};

export default function Page() {
  return <SettingsPage />;
}
