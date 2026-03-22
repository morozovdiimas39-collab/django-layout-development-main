'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import {
  api,
  Review,
  BlogPost,
  TeamMember,
  SiteContent,
  GalleryImage,
} from "@/lib/api";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import LeadForm from "@/components/LeadForm";
import PhoneForm from "@/components/PhoneForm";

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);
import SeatsCounter from "@/components/ui/seats-counter";
import { formatDate } from "@/lib/dates";
import ForWhomSection from "@/components/acting/ForWhomSection";
import ReviewsSection from "@/components/acting/ReviewsSection";
import TeamSection from "@/components/acting/TeamSection";
import BlogSection from "@/components/acting/BlogSection";
import GallerySection from "@/components/acting/GallerySection";
import ContactSection from "@/components/acting/ContactSection";

export default function HomePage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reviewsData, blogData, teamData, galleryData, contentData] =
        await Promise.all([
          api.gallery.getReviews(),
          api.gallery.getBlog(1, 6),
          api.gallery.getTeam(),
          api.gallery.getImages(),
          api.content.getAll(),
        ]);

      setReviews(reviewsData);
      setBlog(blogData.items.slice(0, 3));
      setTeam(teamData);
      setGallery(galleryData);

      const contentMap: Record<string, string> = {};
      contentData.forEach((item: SiteContent) => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <>
      <SchemaMarkup
        type="localbusiness"
        organizationData={{
          name: "Школа актёрского и ораторского мастерства Казбека Меретукова",
          description:
            "Профессиональное обучение актёрскому и ораторскому мастерству от режиссёра телесериалов. Победитель ТЕФИ-2012",
          url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/",
          logo: "https://cdn.poehali.dev/projects/d006fe31-f11a-48d3-ba82-54149e58d318/files/b34e4f5d-452d-44bb-bedb-a00378237a0c.jpg",
          phone: content.phone || "+7 (999) 123-45-67",
          address: content.address || "Москва",
          priceRange: "₽₽",
        }}
        reviews={reviews.map((r) => ({
          author: r.name,
          rating: r.rating || 5,
          text: r.text,
        }))}
      />
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/" }
        ]}
      />
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Курсы актёрского и ораторского мастерства в Москве
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                Профессиональное обучение актёрскому мастерству и публичным
                выступлениям в школе Казбека Меретукова. Преодолейте страх
                камеры и сцены, научитесь уверенно выступать и играть.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("cta-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Записаться на занятие
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/teacher")}
                >
                  О преподавателе
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={18} />
                  <span>15+ лет опыта</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Star" size={18} />
                  <span>{averageRating} рейтинг</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Award" size={18} />
                  <span>250+ выпускников</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Acting Course */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black w-full lg:w-[480px] flex-shrink-0">
                  <iframe
                    className="w-full aspect-video"
                    src="https://player.vimeo.com/video/997327815?badge=0&autopause=0&player_id=0&app_id=58479"
                    title="Курс актёрского мастерства"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    allowFullScreen
                  />
                </div>

                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Актёрское мастерство
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Профессиональный курс для тех, кто хочет работать в кино. От
                    актёрских тренингов до съёмки собственного короткометражного
                    фильма.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg text-sm">
                      <Icon
                        name="Calendar"
                        className="text-primary"
                        size={18}
                      />
                      <span>
                        Пробное:{" "}
                        {content.trial_date
                          ? formatDate(content.trial_date)
                          : "25 марта 2026"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg text-sm">
                      <Icon
                        name="PlayCircle"
                        className="text-primary"
                        size={18}
                      />
                      <span>
                        Старт:{" "}
                        {content.course_start_date
                          ? formatDate(content.course_start_date)
                          : "1 апреля 2026"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">
                    Чему вы научитесь:
                  </h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Работать с текстом и создавать убедительные образы
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Естественно вести себя перед камерой и на крупных планах
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Понимать отличия театра и кино, применять
                        кино-выразительность
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Записывать профессиональные самопробы для кастингов
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <PhoneForm
                      source="home_acting"
                      course="acting"
                      triggerText="Записаться на курс"
                      triggerSize="lg"
                      title="Запись на курс актёрского мастерства"
                      description="Оставьте номер телефона, и мы свяжемся с вами"
                      telegramHref={content.telegram_url || 'https://t.me/kaz9999'}
                      seatsCounter={
                        content.trial_date && (
                          <SeatsCounter
                            trialDate={content.trial_date}
                            maxSeats={12}
                            minSeats={2}
                          />
                        )
                      }
                    />
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push("/acting")}
                    >
                      Подробнее о курсе
                    </Button>
                  </div>
                  <a
                    href={content.telegram_url || 'https://t.me/kaz9999'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors mt-1"
                    style={{ background: '#2CA5E0' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1a96cc')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#2CA5E0')}
                  >
                    <TelegramIcon />
                    Канал курса в Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Public Speaking Course */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black w-full lg:w-[480px] flex-shrink-0">
                  <iframe
                    className="w-full aspect-video"
                    src="https://player.vimeo.com/video/997324695?badge=0&autopause=0&player_id=0&app_id=58479"
                    title="Курс ораторского мастерства"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    allowFullScreen
                  />
                </div>

                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Ораторское мастерство
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Научитесь уверенно выступать на публике, влиять на аудиторию
                    и убеждать словом. Развитие голоса, дикции и харизмы.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg text-sm">
                      <Icon
                        name="Calendar"
                        className="text-primary"
                        size={18}
                      />
                      <span>
                        Пробное:{" "}
                        {content.oratory_trial_date
                          ? formatDate(content.oratory_trial_date)
                          : "27 марта 2026"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg text-sm">
                      <Icon
                        name="PlayCircle"
                        className="text-primary"
                        size={18}
                      />
                      <span>
                        Старт:{" "}
                        {content.oratory_course_start_date
                          ? formatDate(content.oratory_course_start_date)
                          : "3 апреля 2026"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">
                    Чему вы научитесь:
                  </h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Строить убедительные выступления и презентации
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Владеть голосом, улучшить дикцию и интонацию
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Преодолевать страх публичных выступлений
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Работать с аудиторией и удерживать внимание
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <PhoneForm
                      source="home_oratory"
                      course="oratory"
                      triggerText="Записаться на курс"
                      triggerSize="lg"
                      triggerVariant="default"
                      title="Запись на курс ораторского мастерства"
                      description="Оставьте номер телефона, и мы свяжемся с вами"
                      telegramHref={content.telegram_url || 'https://t.me/kaz9999'}
                      seatsCounter={
                        content.oratory_trial_date && (
                          <SeatsCounter
                            trialDate={content.oratory_trial_date}
                            maxSeats={12}
                            minSeats={2}
                          />
                        )
                      }
                    />
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push("/oratory")}
                    >
                      Подробнее о курсе
                    </Button>
                  </div>
                  <a
                    href={content.telegram_url || 'https://t.me/kaz9999'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors mt-1"
                    style={{ background: '#2CA5E0' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1a96cc')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#2CA5E0')}
                  >
                    <TelegramIcon />
                    Канал курса в Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Acting Cards Course on Homepage */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black w-full lg:w-[480px] flex-shrink-0">
                  <iframe
                    className="w-full aspect-video"
                    src="https://player.vimeo.com/video/997321722?badge=0&autopause=0&player_id=0&app_id=58479"
                    title="Актёрская визитка"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    allowFullScreen
                  />
                </div>

                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Актёрская визитка
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Обучение работе перед камерой и съёмка профессиональной актёрской видеовизитки с режиссёром —
                    инструмент для кастингов и продвижения в кино.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg text-sm">
                      <Icon
                        name="PlayCircle"
                        className="text-primary"
                        size={18}
                      />
                      <span>
                        Старт:{" "}
                        {content.acting_cards_start_date
                          ? formatDate(content.acting_cards_start_date)
                          : "15 марта 2026"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">
                    Чему вы научитесь:
                  </h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Чувствовать себя естественно и органично перед камерой
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Показывать диапазон эмоций и актёрских состояний в кадре
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Записывать профессиональную визитку в 4К с режиссёрской поддержкой
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={16} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Получать материал, который работает на кастингах и помогает продвигаться
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                    <PhoneForm
                      source="home_acting_cards"
                      course="acting-cards"
                      triggerText="Записаться"
                      triggerSize="lg"
                      title="Запись на съёмку актёрской визитки"
                      description="Оставьте номер телефона, и мы свяжемся с вами"
                      telegramHref={content.telegram_url || 'https://t.me/kaz9999'}
                      seatsCounter={
                        content.acting_cards_start_date && (
                          <SeatsCounter
                            trialDate={content.acting_cards_start_date}
                            maxSeats={8}
                            minSeats={2}
                          />
                        )
                      }
                    />
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push("/acting-cards")}
                    >
                      Подробнее о курсе
                    </Button>
                  </div>
                  <a
                    href={content.telegram_url || 'https://t.me/kaz9999'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors mt-1"
                    style={{ background: '#2CA5E0' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1a96cc')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#2CA5E0')}
                  >
                    <TelegramIcon />
                    Канал курса в Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Whom Section */}
        <ForWhomSection />

        {/* CTA Section */}
        <section
          id="cta-section"
          className="py-12 px-4 md:py-20 md:px-4 relative overflow-hidden bg-background"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Начните прямо сейчас
              </h2>
              <p className="text-lg text-muted-foreground">
                Запишитесь на пробное занятие по актёрскому или ораторскому
                мастерству
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-primary/20">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Запишитесь на курс</h3>
                  <p className="text-sm text-muted-foreground">
                    Укажите ваше имя и номер телефона
                  </p>
                </div>
                <LeadForm
                  source="home_cta"
                  title=""
                  description=""
                  buttonText="Отправить заявку"
                />
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="Lock" size={14} />
                  <span>
                    Ваши данные защищены и не передаются третьим лицам
                  </span>
                </div>
              </div>

              <div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Users" className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Обучение от профессионалов
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Занятия с опытными актёрами и режиссёрами
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Video" className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Практический опыт</h3>
                      <p className="text-sm text-muted-foreground">
                        Работа на камеру, съёмки и выступления на публике
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Award" className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Сертификат об окончании
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Официальный документ после завершения курса
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <GallerySection gallery={gallery} />

        {/* Reviews Section */}
        <ReviewsSection reviews={reviews} />

        {/* Team Section */}
        <TeamSection team={team} />

        {/* Blog Section */}
        <BlogSection
          blog={blog}
          onNavigate={(slug) => router.push(`/blog/${slug}`)}
          onNavigateToBlog={() => router.push("/blog")}
        />

        {/* Contact Section */}
        <ContactSection />

        <Footer />
      </div>
    </>
  );
}