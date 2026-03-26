'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import RealtorsHeroSection from "@/components/realtors/HeroSection";
import RealtorsSkillsSection from "@/components/realtors/SkillsSection";
import RealtorsForWhomSection from "@/components/realtors/ForWhomSection";
import RealtorsLeadFormSection from "@/components/realtors/LeadFormSection";
import RealtorsCTASection from "@/components/realtors/CTASection";
import AboutSection from "@/components/oratory/AboutSection";
import ProgramSection from "@/components/oratory/ProgramSection";
import ResultsSection from "@/components/oratory/ResultsSection";
import GallerySection from "@/components/oratory/GallerySection";
import ReviewsSection from "@/components/oratory/ReviewsSection";
import BlogSection from "@/components/oratory/BlogSection";
import { api, SiteContent, Review, GalleryImage, BlogPost } from "@/lib/api";
import SchemaMarkup from "@/components/SchemaMarkup";

const BASE_URL = "https://kazbek-meretukov.ru";

export default function RealtorsPage() {
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
      const [contentData, reviewsData, galleryData, blogData] = await Promise.all([
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
          { name: "Главная", url: `${BASE_URL}/` },
          { name: "Ораторское мастерство для риелторов", url: `${BASE_URL}/realtors` },
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />
        <RealtorsHeroSection
          trialDate={content.oratory_trial_date || ""}
          courseStartDate={content.oratory_course_start_date || ""}
        />
        <RealtorsSkillsSection />
        <RealtorsForWhomSection />
        <RealtorsLeadFormSection />
        <AboutSection content={content} />
        <ProgramSection />
        <ResultsSection />
        <RealtorsLeadFormSection />
        <GallerySection gallery={gallery} />
        <ReviewsSection reviews={reviews} />
        <BlogSection
          blog={blog}
          onNavigate={(slug) => router.push(`/blog/${slug}`)}
          onNavigateToBlog={() => router.push("/blog")}
        />
        <RealtorsCTASection />
        <Footer />
      </div>
    </>
  );
}
