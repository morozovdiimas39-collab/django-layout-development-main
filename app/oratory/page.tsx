import type { Metadata } from 'next';
import OratoryPage from '@/pages/OratoryPage';

export const metadata: Metadata = {
  title: 'Курсы ораторского искусства в Москве | Обучение риторике и публичным выступлениям',
  description: 'Профессиональные курсы ораторского искусства. Научитесь уверенно выступать на публике, управлять голосом, побеждать волнение. Обучение риторике от профессионалов.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/oratory' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/oratory',
    title: 'Курсы ораторского искусства в Москве',
    type: 'website',
  },
};

export default function Page() {
  return <OratoryPage />;
}
