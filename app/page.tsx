import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Icon from '@/components/ui/icon';
import ForWhomSection from '@/components/acting/ForWhomSection';
import GallerySection from '@/components/acting/GallerySection';
import ReviewsSection from '@/components/acting/ReviewsSection';
import TeamSection from '@/components/acting/TeamSection';
import BlogSection from '@/components/acting/BlogSection';
import ContactSection from '@/components/acting/ContactSection';
import LeadForm from '@/components/LeadForm';
import HeroActions from '@/components/home/HeroActions';
import CourseButtons from '@/components/home/CourseButtons';
import { formatDate } from '@/lib/dates';
import type { Review, BlogPost, TeamMember, GalleryImage } from '@/lib/api';

const BASE = 'https://kazbek-meretukov.ru';
const CONTENT_URL = 'https://functions.yandexcloud.net/d4eqrbaalbc7nhcuj3qq';
const GALLERY_URL = 'https://functions.yandexcloud.net/d4efvkeujnc7nmk8at71';

async function getContent(): Promise<Record<string, string>> {
  try {
    const res = await fetch(CONTENT_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const data = await res.json();
    if (!Array.isArray(data)) return {};
    const map: Record<string, string> = {};
    data.forEach((item: { key: string; value: string }) => {
      map[item.key] = item.value;
    });
    return map;
  } catch {
    return {};
  }
}

async function getResource<T>(resource: string): Promise<T[]> {
  try {
    const res = await fetch(`${GALLERY_URL}?resource=${resource}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  } catch {
    return [];
  }
}

const HOME_DESCRIPTION =
  'Курсы актёрского и ораторского мастерства: режиссёр телесериалов, ТЕФИ-2012. Для взрослых и детей. Пробное занятие бесплатно.';

export const metadata: Metadata = {
  title: {
    absolute: 'Актёрское и ораторское мастерство в Москве | Казбек Меретуков',
  },
  description: HOME_DESCRIPTION,
  alternates: { canonical: `${BASE}/` },
  openGraph: {
    url: `${BASE}/`,
    title: 'Актёрское и ораторское мастерство в Москве | Казбек Меретуков',
    description: HOME_DESCRIPTION,
    type: 'website',
  },
};

const ACTING_SKILLS = [
  'Работать с текстом и создавать убедительные образы',
  'Естественно вести себя перед камерой и на крупных планах',
  'Понимать отличия театра и кино, применять кино-выразительность',
  'Записывать профессиональные самопробы для кастингов',
];

const ORATORY_SKILLS = [
  'Строить убедительные выступления и презентации',
  'Владеть голосом, улучшить дикцию и интонацию',
  'Преодолевать страх публичных выступлений',
  'Работать с аудиторией и удерживать внимание',
];

const ACTING_CARDS_SKILLS = [
  'Чувствовать себя естественно и органично перед камерой',
  'Показывать диапазон эмоций и актёрских состояний в кадре',
  'Записывать профессиональную визитку в 4К с режиссёрской поддержкой',
  'Получать материал, который работает на кастингах и помогает продвигаться',
];

export default async function Page() {
  const [content, reviews, blogItems, team, gallery] = await Promise.all([
    getContent(),
    getResource<Review>('reviews'),
    getResource<BlogPost>('blog'),
    getResource<TeamMember>('team'),
    getResource<GalleryImage>('gallery'),
  ]);

  const blog = blogItems.slice(0, 3);
  const phone = content.phone || '+7 (999) 123-45-67';
  const address = content.address || 'Москва';
  const workingHours = content.working_hours || 'Ежедневно: 10:00 - 21:00';

  const trialDate = content.trial_date ? formatDate(content.trial_date) : '25 марта 2026';
  const courseStartDate = content.course_start_date ? formatDate(content.course_start_date) : '1 апреля 2026';
  const oratoryTrialDate = content.oratory_trial_date ? formatDate(content.oratory_trial_date) : '27 марта 2026';
  const oratoryStartDate = content.oratory_course_start_date ? formatDate(content.oratory_course_start_date) : '3 апреля 2026';
  const actingCardsStartDate = content.acting_cards_start_date ? formatDate(content.acting_cards_start_date) : '15 марта 2026';

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : '5.0';

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Школа актёрского и ораторского мастерства Казбека Меретукова',
    description: 'Профессиональное обучение актёрскому и ораторскому мастерству от режиссёра телесериалов. Победитель ТЕФИ-2012',
    url: `${BASE}/`,
    telephone: phone,
    address: { '@type': 'PostalAddress', addressLocality: address, addressCountry: 'RU' },
    priceRange: '₽₽',
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: reviews.length,
      },
    }),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: `${BASE}/` }],
  };

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />

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
                Профессиональное обучение актёрскому мастерству и публичным выступлениям
                в школе Казбека Меретукова. Преодолейте страх камеры и сцены,
                научитесь уверенно выступать и играть.
              </p>
              <HeroActions />
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

        {/* Актёрское мастерство */}
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
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">Актёрское мастерство</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Профессиональный курс для тех, кто хочет работать в кино.
                    От актёрских тренингов до съёмки собственного короткометражного фильма.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg text-sm">
                      <Icon name="Calendar" className="text-primary" size={18} />
                      <span>Пробное: {trialDate}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg text-sm">
                      <Icon name="PlayCircle" className="text-primary" size={18} />
                      <span>Старт: {courseStartDate}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Чему вы научитесь:</h3>
                  <div className="space-y-3 mb-8">
                    {ACTING_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon name="Check" size={16} className="text-primary" />
                        </div>
                        <p className="text-muted-foreground">{skill}</p>
                      </div>
                    ))}
                  </div>
                  <CourseButtons
                    source="home_acting"
                    course="acting"
                    detailsHref="/acting"
                    trialDate={content.trial_date}
                    maxSeats={12}
                    title="Запись на курс актёрского мастерства"
                    telegramHref={content.acting_telegram_url || content.telegram_url || 'https://t.me/kaz9999'}
                    telegramText="Канал по актёрскому мастерству"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ораторское мастерство */}
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
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">Ораторское мастерство</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Научитесь уверенно выступать на публике, влиять на аудиторию
                    и убеждать словом. Развитие голоса, дикции и харизмы.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg text-sm">
                      <Icon name="Calendar" className="text-primary" size={18} />
                      <span>Пробное: {oratoryTrialDate}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg text-sm">
                      <Icon name="PlayCircle" className="text-primary" size={18} />
                      <span>Старт: {oratoryStartDate}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Чему вы научитесь:</h3>
                  <div className="space-y-3 mb-8">
                    {ORATORY_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon name="Check" size={16} className="text-primary" />
                        </div>
                        <p className="text-muted-foreground">{skill}</p>
                      </div>
                    ))}
                  </div>
                  <CourseButtons
                    source="home_oratory"
                    course="oratory"
                    detailsHref="/oratory"
                    trialDate={content.oratory_trial_date}
                    maxSeats={12}
                    title="Запись на курс ораторского мастерства"
                    telegramHref={content.oratory_telegram_url || content.telegram_url || 'https://t.me/kaz9999'}
                    telegramText="Канал по ораторскому мастерству"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Актёрская визитка */}
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
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">Актёрская визитка</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Обучение работе перед камерой и съёмка профессиональной актёрской
                    видеовизитки с режиссёром — инструмент для кастингов и продвижения в кино.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg text-sm">
                      <Icon name="PlayCircle" className="text-primary" size={18} />
                      <span>Старт: {actingCardsStartDate}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Чему вы научитесь:</h3>
                  <div className="space-y-3 mb-8">
                    {ACTING_CARDS_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon name="Check" size={16} className="text-primary" />
                        </div>
                        <p className="text-muted-foreground">{skill}</p>
                      </div>
                    ))}
                  </div>
                  <CourseButtons
                    source="home_acting_cards"
                    course="acting-cards"
                    detailsHref="/acting-cards"
                    trialDate={content.acting_cards_start_date}
                    maxSeats={8}
                    triggerText="Записаться"
                    title="Запись на съёмку актёрской визитки"
                    telegramHref={content.acting_cards_telegram_url || content.telegram_url || 'https://t.me/kaz9999'}
                    telegramText="Канал по актёрской визитке"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ForWhomSection />

        {/* CTA */}
        <section id="cta-section" className="py-12 px-4 md:py-20 md:px-4 relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Начните прямо сейчас</h2>
              <p className="text-lg text-muted-foreground">
                Запишитесь на пробное занятие по актёрскому или ораторскому мастерству
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-primary/20">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Запишитесь на курс</h3>
                  <p className="text-sm text-muted-foreground">Укажите ваше имя и номер телефона</p>
                </div>
                <LeadForm source="home_cta" title="" description="" buttonText="Отправить заявку" />
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="Lock" size={14} />
                  <span>Ваши данные защищены и не передаются третьим лицам</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: 'Users', title: 'Обучение от профессионалов', desc: 'Занятия с опытными актёрами и режиссёрами' },
                  { icon: 'Video', title: 'Практический опыт', desc: 'Работа на камеру, съёмки и выступления на публике' },
                  { icon: 'Award', title: 'Сертификат об окончании', desc: 'Официальный документ после завершения курса' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={icon} className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <GallerySection gallery={gallery} />
        <ReviewsSection reviews={reviews} />
        <TeamSection team={team} />
        <BlogSection blog={blog} />
        <ContactSection phone={phone} address={address} workingHours={workingHours} />

        <Footer />
      </div>
    </>
  );
}
