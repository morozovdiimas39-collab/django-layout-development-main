import type { Metadata } from 'next';
import TeacherPage from '@/pages/TeacherPage';

export const metadata: Metadata = {
  title: 'О преподавателях | Казбек Меретуков — режиссёр, педагог',
  description: 'Казбек Меретуков — режиссёр телесериалов, победитель ТЕФИ-2012. Преподаватель актёрского и ораторского мастерства в Москве.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/teacher' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/teacher',
    title: 'Казбек Меретуков — режиссёр и педагог',
    description: 'Режиссёр телесериалов, победитель ТЕФИ-2012. Ведёт курсы актёрского и ораторского мастерства в Москве.',
    type: 'profile',
  },
};

export default function Page() {
  return <TeacherPage />;
}
