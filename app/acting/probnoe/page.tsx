import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroSection from '@/components/acting/HeroSection';
import VideoSection from '@/components/acting/VideoSection';
import ForWhomSection from '@/components/acting/ForWhomSection';
import LeadFormSection from '@/components/acting/LeadFormSection';
import GallerySection from '@/components/acting/GallerySection';
import ReviewsSection from '@/components/acting/ReviewsSection';
import CallToActionSection from '@/components/acting/CallToActionSection';
import ContactSection from '@/components/acting/ContactSection';
import { API_URLS, type GalleryImage, type Review, type SiteContent } from '@/lib/api';
import JsonLd from '@/components/JsonLd';

const CANONICAL = 'https://kazbek-meretukov.ru/acting/probnoe';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute:
      'Бесплатное пробное занятие по актёрскому мастерству в Москве | Школа Казбека Меретукова',
  },
  description:
    'Бесплатное пробное занятие по актёрскому мастерству в Москве: тот же зал и преподаватель, что на курсе. Фото с занятий, отзывы, запись без оплаты за первый визит. Режиссёр Казбек Меретуков.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    url: CANONICAL,
    title: 'Бесплатное пробное занятие по актёрскому мастерству в Москве',
    description:
      'Пробное в формате основного курса: атмосфера школы, отзывы учеников, запись на дату.',
    type: 'website',
  },
};

async function getContentMap(): Promise<Record<string, string>> {
  try {
    const response = await fetch(API_URLS.content, { next: { revalidate: 3600 } });
    if (!response.ok) return {};
    const data = (await response.json()) as SiteContent[];
    if (!Array.isArray(data)) return {};
    const map: Record<string, string> = {};
    data.forEach((item) => {
      map[item.key] = item.value;
    });
    return map;
  } catch {
    return {};
  }
}

async function getGalleryResource<T>(resource: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_URLS.gallery}?resource=${resource}`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export default async function ActingTrialPage() {
  const [content, gallery, reviews] = await Promise.all([
    getContentMap(),
    getGalleryResource<GalleryImage>('gallery'),
    getGalleryResource<Review>('reviews'),
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Бесплатное пробное занятие по актёрскому мастерству в Москве',
    description:
      'Запись на бесплатное пробное занятие в школе актёрского мастерства. Связана с курсом, отдельный URL и контент от полной программы.',
    url: CANONICAL,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Школа актёрского мастерства Казбека Меретукова',
      url: 'https://kazbek-meretukov.ru',
    },
    about: {
      '@type': 'EducationalOrganization',
      name: 'Школа актёрского мастерства Казбека Меретукова',
      url: 'https://kazbek-meretukov.ru',
    },
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://kazbek-meretukov.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Актёрское мастерство', item: 'https://kazbek-meretukov.ru/acting' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Бесплатное пробное занятие',
        item: CANONICAL,
      },
    ],
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbsSchema} />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />
        <HeroSection content={content} variant="trial" />
        <VideoSection content={content} />
        <ForWhomSection />
        <LeadFormSection />
        <GallerySection gallery={gallery} />
        <ReviewsSection reviews={reviews} />
        <CallToActionSection variant="trial" />
        <section className="py-10 px-4 border-t border-border/60 bg-muted/15">
          <div className="container mx-auto max-w-3xl text-center text-sm text-muted-foreground leading-relaxed">
            <p>
              После пробного можно перейти на{' '}
              <Link href="/acting" className="text-primary font-medium hover:underline">
                основной курс актёрского мастерства
              </Link>
              — отдельная страница с программой; эта страница посвящена только бесплатному первому занятию.
            </p>
          </div>
        </section>
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
