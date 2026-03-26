import type { Metadata } from 'next';
import TeacherPage from '@/pages/TeacherPage';

export const metadata: Metadata = {
  title: 'Преподаватели',
  description:
    'Казбек Меретуков — режиссёр телесериалов, ТЕФИ-2012. Курсы актёрского и ораторского мастерства в Москве.',
  alternates: { canonical: 'https://kazbek-meretukov.ru/teacher' },
  openGraph: {
    url: 'https://kazbek-meretukov.ru/teacher',
    title: 'Казбек Меретуков — режиссёр и педагог',
    description: 'Режиссёр телесериалов, победитель ТЕФИ-2012. Ведёт курсы актёрского и ораторского мастерства в Москве.',
    type: 'profile',
  },
};

export default function Page() {
  return <TeacherPage />;
}
