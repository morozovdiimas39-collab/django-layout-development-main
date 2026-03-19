import type { Metadata } from 'next';
import ContactsPage from '@/pages/ContactsPage';

export const metadata: Metadata = {
  title: 'Контакты | Школа актёрского и ораторского мастерства в Москве',
  description: 'Адрес, телефон, форма обратной связи. Свяжитесь со школой Казбека Меретукова для записи на курсы.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/contacts' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/contacts',
    title: 'Контакты — школа Казбека Меретукова',
    description: 'Адрес, телефон и форма для записи на курсы актёрского и ораторского мастерства в Москве.',
    type: 'website',
  },
};

export default function Page() {
  return <ContactsPage />;
}
