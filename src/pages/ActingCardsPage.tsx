import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaMarkup from "@/components/SchemaMarkup";
import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import PhoneForm from "@/components/PhoneForm";
import LeadForm from "@/components/LeadForm";
import { api, SiteContent, GalleryImage, Review, BlogPost } from "@/lib/api";
import { formatDate } from "@/lib/dates";
import SeatsCounter from "@/components/ui/seats-counter";
import Image from "@/components/ui/image";
import GallerySection from "@/components/acting/GallerySection";
import ReviewsSection from "@/components/acting/ReviewsSection";
import BlogSection from "@/components/acting/BlogSection";
import ContactSection from "@/components/acting/ContactSection";

import { useNavigate } from "react-router-dom";

export default function ActingCardsPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState<Record<string, string>>({});
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        contentData,
        galleryData,
        reviewsData,
        blogData,
      ] = await Promise.all([
        api.content.getAll(),
        api.gallery.getImages(),
        api.gallery.getReviews(),
        api.gallery.getBlog(1, 20),
      ]);

      const contentMap: Record<string, string> = {};
      contentData.forEach((item: SiteContent) => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
      setGallery(galleryData);
      setReviews(reviewsData);
      setBlog(blogData.items);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const problems = [
    {
      icon: "Video",
      title: "Наигрышем перед камерой",
      description:
        "Боишься камеру, зажимаешься и стесняешься перед ней. Пропадает естественность и появляется наигрыш",
    },
    {
      icon: "MessageSquare",
      title: "Текстом и его произношением",
      description:
        "Затруднения со структурированием и выражением своих мыслей перед камерой",
    },
    {
      icon: "AlertCircle",
      title: "Неубедительностью",
      description:
        "Чувствуешь что недостаточно выразителен, одинаков и неинтересен в кадре",
    },
    {
      icon: "Heart",
      title: "Недостатком эмоций",
      description:
        "Сложности с проявлением эмоций на камеру. Проблемы с передачей нужных эмоций и чувств",
    },
    {
      icon: "Eye",
      title: "Боязнью показать себя",
      description:
        "Выявление необходимого темперамента для проявления личностной составляющей",
    },
    {
      icon: "Sparkles",
      title: "Отсутствием харизмы",
      description:
        "Не знаешь как выделиться среди других актеров и показать свою уникальность в визитке",
    },
  ];

  const formats = [
    {
      title: "Актерская визитка без режиссера",
      price: "5 000 руб.",
      features: [
        "Запись визитки делает оператор",
        "В этой визитке актер представляется и рассказывает о себе",
        "Съемка визитки происходит в 4К разрешении",
        "Обработка. Добавляются именные титры актера, чистится звук и делается цветокоррекция",
      ],
      result:
        "Через 1-2 дня после съемки вы получаете профессиональную, стандартную актерскую видео визитку",
    },
    {
      title: "Визитка история с режиссером",
      price: "7 000 руб.",
      features: [
        "В этой визитке актер рассказывает историю из своей жизни",
        "С актером работает опытный кино режиссер. Он помогает актеру раскрыться и показать свою органику и выразительность, а так же продемонстрировать диапазон актерских проявлений",
        "Режиссер помогает актеру определиться с историей и найти ключевые точки сюжета",
        "Съемка визитки происходит в 4К разрешении",
        "Обработка. Добавляются именные титры актера, чистится звук и делается цветокоррекция",
      ],
      result:
        "Через 1-2 дня после съемки вы получаете профессиональную актерскую, работающую видео визитку",
      highlighted: true,
    },
    {
      title: "2 актерские визитки",
      price: "10 000 руб.",
      features: [
        "Необходимость в двух актерских визиток обусловлена их разностью. Так одна из визиток может быть записана в комедийном ключе, а вторая в драматическом",
        "С актером работает опытный кино режиссер. Он помогает актеру раскрыться и показать свою органику и выразительность, а так же продемонстрировать диапазон актерских проявлений",
        "Наличие двух визиток дает актеру возможность выбрать какую визитку отправить на тот и или иной кастинг. Такой метод дает более высокий шанс получить роль",
        "Съемка визитки происходит в 4К разрешении",
        "Обработка. Добавляются именные титры актера, чистится звук и делается цветокоррекция",
      ],
      result:
        "Через 1-2 дня после съемки вы получаете 2 профессиональные актерские, работающие видео визитки",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Актерские визитки с режиссером в Москве | Профессиональная съемка для
          актеров
        </title>
        <meta
          name="description"
          content="Профессиональные актерские визитки с опытным режиссером. Съемка в 4К, работа над органикой и выразительностью. Эффективный инструмент для продвижения карьеры актера."
        />
        <link
          rel="canonical"
          href="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting-cards"
        />
        <meta
          property="og:url"
          content="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting-cards"
        />
        <meta
          property="og:title"
          content="Актерские визитки с режиссером в Москве"
        />
        <meta
          property="og:description"
          content="Профессиональные актерские визитки с опытным режиссером. Съемка в 4К, работа над органикой и выразительностью."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://cdn.poehali.dev/projects/d006fe31-f11a-48d3-ba82-54149e58d318/files/b34e4f5d-452d-44bb-bedb-a00378237a0c.jpg"
        />
      </Helmet>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          {
            name: "Главная",
            url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/",
          },
          {
            name: "Актерские визитки",
            url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/acting-cards",
          },
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />

        <section className="pt-20 pb-12 px-4 md:pt-32 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://cdn.poehali.dev/projects/d006fe31-f11a-48d3-ba82-54149e58d318/files/113b63f7-1328-48bd-9802-5a7d977df621.jpg" 
              alt="Профессиональная съемка актерских визиток"
              className="w-full h-full object-cover"
              eager={true}
            />
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent via-background/30 via-background/60 via-background/85 to-card"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Обучение и съемка
                <br />
                <span className="text-primary">актерских визиток с режиссером</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                Режиссер Казбек Меретуков обучает работе перед камерой и сразу записывает профессиональную видеовизитку в 4К. 
                Вы получаете работающий инструмент для кастингов и навыки органичной игры на камеру.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center">
                <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
                  <Icon
                    name="PlayCircle"
                    className="text-primary"
                    size={18}
                  />
                  <span>
                    Старт: {content.acting_cards_start_date ? formatDate(content.acting_cards_start_date) : '15 марта 2025'}
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <PhoneForm
                  source="acting_cards_hero"
                  course="acting-cards"
                  triggerText="Записаться на съемку"
                  triggerSize="lg"
                  title="Запись на съемку актерской визитки"
                  description="Оставьте номер телефона, и мы свяжемся с вами"
                  seatsCounter={content.acting_cards_start_date && (
                    <SeatsCounter 
                      trialDate={content.acting_cards_start_date} 
                      maxSeats={8}
                      minSeats={2}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Если возникнет проблема с
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {problems.map((problem, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition group border-2"
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                      <Icon
                        name={problem.icon}
                        className="text-primary"
                        size={28}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
                    <p className="text-muted-foreground">{problem.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src="https://player.vimeo.com/video/997321722?badge=0&autopause=0&player_id=0&app_id=58479"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                  title="Актерские визитки"
                ></iframe>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Обучение и помощь с актерскими визитками
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Режиссер Казбек Меретуков работает с каждым актером индивидуально, 
                  помогая раскрыть органику, найти нужные эмоции и естественность перед камерой. 
                  Вы получите не просто съемку, а настоящее обучение работе на камеру.
                </p>
                <PhoneForm
                  source="acting_cards_video"
                  course="acting-cards"
                  triggerText="Записаться на съемку"
                  triggerSize="lg"
                  title="Запись на съемку актерской визитки"
                  description="Оставьте номер телефона, и мы свяжемся с вами"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Форматы актерских визиток
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {formats.map((format, index) => (
                <Card
                  key={index}
                  className={`flex flex-col ${
                    format.highlighted
                      ? "border-4 border-primary shadow-2xl scale-105"
                      : ""
                  }`}
                >
                  <CardContent className="p-8 flex flex-col flex-1">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-3">
                        {format.title}
                      </h3>
                      <div className="text-4xl font-bold text-primary">
                        {format.price}
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6 flex-1">
                      {format.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Icon
                            name="Check"
                            className="text-primary flex-shrink-0 mt-1"
                            size={18}
                          />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-background p-4 rounded-lg mb-6">
                      <h4 className="font-bold mb-2 text-sm">Результат:</h4>
                      <p className="text-sm text-muted-foreground">
                        {format.result}
                      </p>
                    </div>
                    <PhoneForm
                      source={`acting_cards_${index}`}
                      course="acting-cards"
                      triggerText="Выбрать формат"
                      triggerClassName="w-full"
                      triggerVariant={format.highlighted ? "default" : "outline"}
                      title={`Запись на ${format.title}`}
                      description="Оставьте номер телефона, и мы свяжемся с вами"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:py-20 md:px-4 bg-gradient-to-br from-primary/5 via-background to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary-rgb),0.08),transparent_50%)]"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center max-w-6xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative h-[350px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://st.business-key.com/i/files/45470/2024/02/1707986927.jpg"
                    alt="Казбек Меретуков - режиссёр телесериалов, победитель ТЕФИ-2012, преподаватель актёрского мастерства"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                    loading="lazy"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Казбек Меретуков
                  </h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-lg md:text-xl font-semibold text-primary">
                      Режиссёр-постановщик телесериалов
                    </h4>
                    <p className="text-base leading-relaxed text-foreground/90">
                      Режиссёр-постановщик на сериальных проектах разных форматов и жанров, которые получили признание на каналах России, Украины, Белоруссии, Израиля. Снял проекты: «След», «Дело врачей», «До суда», «Маруся», «Наши соседи», «Обручальное кольцо», «Принцесса цирка».
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg md:text-xl font-semibold text-primary">
                      Образование и квалификация
                    </h4>
                    <p className="text-base leading-relaxed text-foreground/90">
                      ГИТИС. Режиссура драмы. Окончил с отличием. ВГИК. Высшие режиссерские курсы повышения квалификации по специальности кинорежиссура. Прошел курс «Роль режиссера в производстве телесериалов» в кинокомпании АМЕДИА.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg md:text-xl font-semibold text-primary">
                      Художественный руководитель центра
                    </h4>
                    <p className="text-base leading-relaxed text-foreground/90">
                      Художественный руководитель центра подготовки актеров кино. Теленовелла «Обручальное кольцо» — победитель премии ТЕФИ-2012 в номинации «Телевизионный художественный сериал – телероман».
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <GallerySection gallery={gallery} />
        <ReviewsSection reviews={reviews} />
        <BlogSection 
          blog={blog} 
          onNavigate={(slug) => navigate(`/blog/${slug}`)}
          onNavigateToBlog={() => navigate('/blog')}
        />
        <ContactSection />

        <section className="py-12 px-4 md:py-20 md:px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Icon name="Sparkles" className="text-primary" size={18} />
                  <span className="text-primary font-semibold text-sm">
                    Начните прямо сейчас
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Запишитесь на <span className="text-primary">съемку</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6">
                  Оставьте заявку прямо сейчас и получите:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon
                        name="CheckCircle2"
                        className="text-primary"
                        size={20}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Консультацию режиссера
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Обсудим формат визитки и подберем историю
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Video" className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Съемку в 4К</h3>
                      <p className="text-sm text-muted-foreground">
                        Профессиональное оборудование и студия
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Star" className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Готовый материал</h3>
                      <p className="text-sm text-muted-foreground">
                        Через 1-2 дня получите работающую визитку
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-primary/20">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    Запишитесь на съемку
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Укажите номер телефона
                  </p>
                </div>
                <LeadForm
                  source="acting_cards_cta"
                  title=""
                  description=""
                  buttonText="Отправить заявку"
                />
                <div className="mt-4 sm:mt-6 flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <Icon name="Lock" size={12} className="flex-shrink-0" />
                  <span>
                    Ваши данные защищены и не передаются третьим лицам
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}