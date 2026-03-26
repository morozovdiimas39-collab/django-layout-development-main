'use client';
import { useState, useEffect } from "react";
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
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: "https://kazbek-meretukov.ru/" },
          { name: "Актёрская визитка", url: "https://kazbek-meretukov.ru/showreel" }
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