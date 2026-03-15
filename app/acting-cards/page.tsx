import type { Metadata } from 'next';
import ActingCardsPage from '@/pages/ActingCardsPage';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Актерские визитки | Профессиональная съемка с режиссером Казбеком Меретуковым',
  description: 'Профессиональная съемка актерских визиток под руководством режиссера. Качественная подготовка и съемка для поступления в театральные вузы и кастингов.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting-cards' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting-cards',
    title: 'Актерские визитки',
    type: 'website',
  },
};

export default function Page() {
  return <ActingCardsPage />;
}
