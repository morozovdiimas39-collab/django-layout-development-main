import type { Metadata } from 'next';
import SettingsPage from '@/pages/SettingsPage';

export const metadata: Metadata = {
  title: { absolute: 'Настройки Telegram-бота' },
  robots: 'noindex, nofollow',
};

export default function Page() {
  return <SettingsPage />;
}
