'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeroSection from "@/components/oratory/HeroSection";
import SkillsSection from "@/components/oratory/SkillsSection";
import ForWhomSection from "@/components/oratory/ForWhomSection";
import AboutSection from "@/components/oratory/AboutSection";
import ProgramSection from "@/components/oratory/ProgramSection";
import ResultsSection from "@/components/oratory/ResultsSection";
import GallerySection from "@/components/oratory/GallerySection";
import ReviewsSection from "@/components/oratory/ReviewsSection";
import BlogSection from "@/components/oratory/BlogSection";
import LeadFormSection from "@/components/oratory/LeadFormSection";
import CTASection from "@/components/oratory/CTASection";
import CoursePricingSection from "@/components/CoursePricingSection";
import { api, SiteContent, Review, GalleryImage, BlogPost } from "@/lib/api";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function OratoryPage() {
  const router = useRouter();
  const [content, setContent] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contentData, reviewsData, galleryData, blogData] =
        await Promise.all([
          api.content.getAll(),
          api.gallery.getReviews(),
          api.gallery.getImages(),
          api.gallery.getBlog(1, 20),
        ]);

      const contentMap: Record<string, string> = {};
      contentData.forEach((item: SiteContent) => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
      setReviews(reviewsData);
      setGallery(galleryData);
      setBlog(blogData.items);
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
          { name: "Ораторское искусство", url: "https://kazbek-meretukov.ru/oratory" }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />
        <HeroSection
          trialDate={content.oratory_trial_date || ""}
          courseStartDate={content.oratory_course_start_date || ""}
          telegramHref={content.oratory_telegram_url || content.telegram_url || 'https://t.me/kaz9999'}
        />
        <SkillsSection />
        <ForWhomSection />
        <LeadFormSection />
        <AboutSection content={content} />
        <ProgramSection />
        <ResultsSection />
        <LeadFormSection />
        <ReviewsSection reviews={reviews} />
        <CoursePricingSection
          variant="oratory"
          courseStartDate={content.oratory_course_start_date || ''}
          contactPhone={content.phone || ''}
          address={content.address || ''}
        />
        <GallerySection gallery={gallery} />
        <BlogSection
          blog={blog}
          onNavigate={(slug) => router.push(`/blog/${slug}`)}
          onNavigateToBlog={() => router.push("/blog")}
        />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}