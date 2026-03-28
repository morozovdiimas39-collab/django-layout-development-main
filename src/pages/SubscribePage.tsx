'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import SchemaMarkup from '@/components/SchemaMarkup';
import ContactSection from '@/components/acting/ContactSection';
import SubscribeHeroSection from '@/components/subscribe/SubscribeHeroSection';
import ForWhomSection from '@/components/acting/ForWhomSection';
import SubscribeTgLeadSection from '@/components/subscribe/SubscribeTgLeadSection';
import SubscribeFeaturesSection from '@/components/subscribe/SubscribeFeaturesSection';
import SubscribeWhySection from '@/components/subscribe/SubscribeWhySection';
import SubscribeFinalCtaSection from '@/components/subscribe/SubscribeFinalCtaSection';
import { api, SiteContent } from '@/lib/api';

export default function SubscribePage() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    api.content
      .getAll()
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((item: SiteContent) => {
          map[item.key] = item.value;
        });
        setContent(map);
      })
      .catch(() => {});
  }, []);

  const ogImage =
    content.og_image ||
    'https://cdn.poehali.dev/projects/d006fe31-f11a-48d3-ba82-54149e58d318/files/7cddbd50-0847-4321-92b1-f534403d6a21.jpg';

  return (
    <>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: 'Главная', url: 'https://kazbek-meretukov.ru/' },
          { name: 'Подписаться', url: 'https://kazbek-meretukov.ru/subscribe' },
        ]}
      />
      <SchemaMarkup
        type="webpage"
        pageData={{
          name: 'Подписаться — Telegram',
          description:
            'Материалы, новости и анонсы актёрской школы в Telegram: пробные, наборы, даты.',
          url: 'https://kazbek-meretukov.ru/subscribe',
          inLanguage: 'ru-RU',
          image: ogImage,
        }}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />
        <SubscribeHeroSection />
        <ForWhomSection />
        <SubscribeTgLeadSection />
        <SubscribeFeaturesSection />
        <SubscribeWhySection />
        <SubscribeFinalCtaSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
