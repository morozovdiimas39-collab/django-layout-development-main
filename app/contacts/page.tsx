import type { Metadata } from 'next';
import ContactsPage from '@/pages/ContactsPage';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Адрес, телефон и форма записи на курсы школы Казбека Меретукова в Москве.',
  alternates: { canonical: 'https://kazbek-meretukov.ru/contacts' },
  openGraph: {
    url: 'https://kazbek-meretukov.ru/contacts',
    title: 'Контакты — школа Казбека Меретукова',
    description: 'Адрес, телефон и форма для записи на курсы актёрского и ораторского мастерства в Москве.',
    type: 'website',
  },
};

export default function Page() {
  return <ContactsPage />;
}
