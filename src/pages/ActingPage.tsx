'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeroSection from "@/components/acting/HeroSection";
import VideoSection from "@/components/acting/VideoSection";
import ForWhomSection from "@/components/acting/ForWhomSection";
import LeadFormSection from "@/components/acting/LeadFormSection";
import ModulesSection from "@/components/acting/ModulesSection";
import FilmSection from "@/components/acting/FilmSection";
import AboutSection from "@/components/acting/AboutSection";
import GallerySection from "@/components/acting/GallerySection";
import ReviewsSection from "@/components/acting/ReviewsSection";
import TeamSection from "@/components/acting/TeamSection";
import CallToActionSection from "@/components/acting/CallToActionSection";
import BlogSection from "@/components/acting/BlogSection";
import SEOTextSection from "@/components/acting/SEOTextSection";
import FAQSection from "@/components/acting/FAQSection";
import ContactSection from "@/components/acting/ContactSection";
import {
  api,
  CourseModule,
  Review,
  FAQ,
  GalleryImage,
  BlogPost,
  SiteContent,
  TeamMember,
} from "@/lib/api";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function ActingPage() {
  const router = useRouter();
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faq, setFAQ] = useState<FAQ[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        modulesData,
        reviewsData,
        faqData,
        galleryData,
        blogData,
        teamData,
        contentData,
      ] = await Promise.all([
        api.modules.getByCourse("acting"),
        api.gallery.getReviews(),
        api.gallery.getFAQ(),
        api.gallery.getImages(),
        api.gallery.getBlog(1, 20),
        api.gallery.getTeam(),
        api.content.getAll(),
      ]);

      setModules(modulesData);
      setReviews(reviewsData);
      setFAQ(faqData);
      setGallery(galleryData);
      setBlog(blogData.items);
      setTeam(teamData);

      const contentMap: Record<string, string> = {};
      contentData.forEach((item: SiteContent) => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return (
    <>
      <SchemaMarkup
        type="course"
        courseData={{
          name: "Курс актёрского мастерства",
          description:
            "Профессиональное обучение актёрскому мастерству от режиссёра телесериалов. Работа на камеру, съёмка короткометражного фильма, практические упражнения.",
          provider: "Школа актёрского мастерства Казбека Меретукова",
          url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai",
        }}
      />
      <SchemaMarkup
        type="reviews"
        reviews={reviews.map((r) => ({
          author: r.name,
          rating: r.rating || 5,
          text: r.text,
        }))}
      />
      <SchemaMarkup
        type="faq"
        faqItems={faq.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/" },
          { name: "Актёрское мастерство", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting" }
        ]}
      />
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
        <BlogSection
          blog={blog}
          onNavigate={(slug) => router.push(`/blog/${slug}`)}
          onNavigateToBlog={() => router.push("/blog")}
        />
        <SEOTextSection />
        <FAQSection faq={faq} />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}