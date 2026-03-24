import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroSection from '@/components/acting/HeroSection';
import VideoSection from '@/components/acting/VideoSection';
import ForWhomSection from '@/components/acting/ForWhomSection';
import LeadFormSection from '@/components/acting/LeadFormSection';
import ModulesSection from '@/components/acting/ModulesSection';
import FilmSection from '@/components/acting/FilmSection';
import AboutSection from '@/components/acting/AboutSection';
import GallerySection from '@/components/acting/GallerySection';
import ReviewsSection from '@/components/acting/ReviewsSection';
import TeamSection from '@/components/acting/TeamSection';
import CallToActionSection from '@/components/acting/CallToActionSection';
import BlogSection from '@/components/acting/BlogSection';
import SEOTextSection from '@/components/acting/SEOTextSection';
import FAQSection from '@/components/acting/FAQSection';
import ContactSection from '@/components/acting/ContactSection';
import { API_URLS, type BlogPost, type CourseModule, type FAQ, type GalleryImage, type Review, type SiteContent, type TeamMember } from '@/lib/api';
import JsonLd from '@/components/JsonLd';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Курс актёрского мастерства',
  description:
    'Работа на камеру, короткометражный фильм, самопробы для кастингов. Режиссёр Казбек Меретуков, ТЕФИ-2012. Пробное бесплатно.',
  alternates: { canonical: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting' },
  openGraph: {
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting',
    title: 'Курс актёрского мастерства — режиссёр Казбек Меретуков',
    description: 'Работа на камеру, съёмка фильма, самопробы для кастингов. Режиссёр телесериалов, победитель ТЕФИ-2012.',
    type: 'website',
  },
};

async function getContentMap(): Promise<Record<string, string>> {
  try {
    const response = await fetch(API_URLS.content, { next: { revalidate } });
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
    const response = await fetch(`${API_URLS.gallery}?resource=${resource}`, { next: { revalidate } });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

async function getModules(): Promise<CourseModule[]> {
  try {
    const response = await fetch(`${API_URLS.modules}?course_type=acting`, { next: { revalidate } });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? (data as CourseModule[]) : [];
  } catch {
    return [];
  }
}

async function getBlog(): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams({ resource: 'blog', page: '1', per_page: '20' });
    const response = await fetch(`${API_URLS.gallery}?${params}`, { next: { revalidate } });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data?.items) ? (data.items as BlogPost[]) : [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const [modules, reviews, faq, gallery, blog, team, content] = await Promise.all([
    getModules(),
    getGalleryResource<Review>('reviews'),
    getGalleryResource<FAQ>('faq'),
    getGalleryResource<GalleryImage>('gallery'),
    getBlog(),
    getGalleryResource<TeamMember>('team'),
    getContentMap(),
  ]);

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Курс актёрского мастерства',
    description:
      'Профессиональное обучение актёрскому мастерству от режиссёра телесериалов. Работа на камеру, съёмка короткометражного фильма, практические упражнения.',
    provider: {
      '@type': 'Organization',
      name: 'Школа актёрского мастерства Казбека Меретукова',
      sameAs: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai',
    },
    url: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai',
  };

  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Школа актёрского мастерства Казбека Меретукова',
    aggregateRating:
      reviews.length > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
            bestRating: '5',
            worstRating: '1',
          }
        : undefined,
    review: reviews.slice(0, 10).map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.name },
      reviewRating: { '@type': 'Rating', ratingValue: review.rating || 5, bestRating: '5' },
      reviewBody: review.text,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/' },
      { '@type': 'ListItem', position: 2, name: 'Актёрское мастерство', item: 'https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting' },
    ],
  };

  return (
    <>
      <JsonLd data={courseSchema} />
      <JsonLd data={reviewsSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbsSchema} />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />
        <HeroSection content={content} />
        <VideoSection content={content} />
        <ForWhomSection />
        <LeadFormSection />
        <ModulesSection modules={modules} />
        <FilmSection content={content} />
        <LeadFormSection />
        <AboutSection content={content} />
        <GallerySection gallery={gallery} />
        <ReviewsSection reviews={reviews} />
        <TeamSection team={team} />
        <CallToActionSection />
        <BlogSection blog={blog} />
        <SEOTextSection />
        <FAQSection faq={faq} />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
