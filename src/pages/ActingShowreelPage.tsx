import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeroSection from "@/components/showreel/HeroSection";
import ProcessSection from "@/components/showreel/ProcessSection";
import ExamplesSection from "@/components/showreel/ExamplesSection";
import WhySection from "@/components/showreel/WhySection";
import PricingSection from "@/components/showreel/PricingSection";
import CTASection from "@/components/showreel/CTASection";
import FAQSection from "@/components/showreel/FAQSection";
import { api, SiteContent, Review, FAQ, GalleryImage } from "@/lib/api";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function ActingShowreelPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faq, setFAQ] = useState<FAQ[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contentData, reviewsData, faqData, galleryData] =
        await Promise.all([
          api.content.getAll(),
          api.gallery.getReviews(),
          api.gallery.getFAQ(),
          api.gallery.getImages(),
        ]);

      const contentMap: Record<string, string> = {};
      contentData.forEach((item: SiteContent) => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
      setReviews(reviewsData);
      setFAQ(faqData);
      setGallery(galleryData);
    } catch (error) {
      console.error("Error loading content:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Актерская визитка | Профессиональная видеовизитка для актеров от
          режиссера Казбека Меретукова
        </title>
        <meta
          name="description"
          content="Создание профессиональной актерской визитки (showreel) под руководством режиссера-постановщика. Качественная съемка, монтаж, продюсирование. Ваш пропуск в кино и театр."
        />
        <link
          rel="canonical"
          href="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/showreel"
        />
        <meta
          property="og:url"
          content="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/showreel"
        />
        <meta
          property="og:title"
          content="Актерская визитка | Профессиональная видеовизитка"
        />
      </Helmet>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/" },
          { name: "Актёрская визитка", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/showreel" }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />
        <HeroSection />
        <ProcessSection />
        <ExamplesSection gallery={gallery} />
        <WhySection />
        <PricingSection />
        <CTASection />
        <FAQSection faq={faq} />
        <Footer />
      </div>
    </>
  );
}