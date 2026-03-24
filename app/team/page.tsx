import type { Metadata } from 'next';
import TeamPage from '@/pages/TeamPage';

export const metadata: Metadata = {
  title: 'Команда школы',
  description: 'Преподаватели актёрского и ораторского мастерства школы Казбека Меретукова.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/team' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/team',
    title: 'Команда — преподаватели школы Казбека Меретукова',
    description: 'Опытные преподаватели актёрского и ораторского мастерства. Узнайте о каждом члене команды.',
    type: 'website',
  },
};

export default function Page() {
  return <TeamPage />;
}
