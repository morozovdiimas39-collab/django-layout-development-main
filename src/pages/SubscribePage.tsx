'use client';
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { api, SiteContent } from "@/lib/api";

/**
 * Медиа — подставьте значения и картинки появятся.
 * Фото → public/subscribe/название.jpg
 * Видео → embed-ссылка Vimeo или YouTube
 */
const SUBSCRIBE_MEDIA = {
  heroImage:      "",
  videoEmbedUrl:  "",
  rowImageLeft:   "",
  rowImageRight:  "",
  midWideImage:   "",
  bottomImage:    "",
};

const CHANNEL_CARDS = [
  {
    icon: "Mic",
    title: "Голос и дикция",
    text: "Короткие упражнения, которые можно делать прямо дома — станешь звучать чище и увереннее.",
  },
  {
    icon: "Video",
    title: "Работа на камеру",
    text: "Приёмы, которые убирают зажимы в кадре. Реальные примеры с занятий.",
  },
  {
    icon: "Users",
    title: "Публичные выступления",
    text: "Как держать внимание зала, справляться с волнением и выглядеть уверенно.",
  },
  {
    icon: "BookOpen",
    title: "Разборы и практика",
    text: "Примеры с занятий, разборы ошибок и рабочие схемы — без воды и теории.",
  },
  {
    icon: "Bell",
    title: "Анонсы школы",
    text: "Ближайшие пробные занятия и старты групп — первым узнаёшь о свободных местах.",
  },
  {
    icon: "Zap",
    title: "Только полезное",
    text: "Никакого инфошума. Каждый пост — конкретный инструмент или важная новость.",
  },
];

const WHO_CARDS = [
  { icon: "Film",       text: "Хочешь в кино или на сцену" },
  { icon: "Presentation", text: "Выступаешь публично или на камеру" },
  { icon: "TrendingUp", text: "Хочешь убрать зажимы и прокачать подачу" },
  { icon: "Search",     text: "Выбираешь школу и хочешь понять подход" },
];

const WHY_LIST = [
  { icon: "CheckCircle", text: "Практика вместо теории — применяй сразу" },
  { icon: "CheckCircle", text: "Коротко и по делу, без бесконечных постов" },
  { icon: "CheckCircle", text: "Полезно даже без курса — многое можно делать дома" },
  { icon: "CheckCircle", text: "Telegram или MAX — где тебе удобнее" },
];

function ImageSlot({
  src, alt = "", hint, aspectClass = "aspect-video",
}: {
  src: string; alt?: string; hint: string; aspectClass?: string;
}) {
  if (src.trim()) {
    return (
      <div className={`relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden bg-muted ${aspectClass}`}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`flex flex-col items-center justify-center gap-2 w-full max-w-5xl mx-auto rounded-2xl border-2 border-dashed border-border bg-muted/40 text-center px-6 py-10 ${aspectClass} min-h-[200px]`}>
      <Icon name="Image" size={28} className="text-muted-foreground/40" />
      <span className="text-sm font-medium text-foreground">{hint}</span>
      <span className="text-xs text-muted-foreground max-w-md">
        Путь укажи в <code className="rounded bg-muted px-1 py-0.5 text-[11px]">SUBSCRIBE_MEDIA</code>,
        файл положи в <code className="rounded bg-muted px-1 py-0.5 text-[11px]">public/subscribe/</code>
      </span>
    </div>
  );
}

function VideoSlot({ embedUrl, hint }: { embedUrl: string; hint: string }) {
  if (embedUrl.trim()) {
    return (
      <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
        <iframe src={embedUrl} className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Видео" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full max-w-4xl mx-auto aspect-video min-h-[220px] rounded-2xl border-2 border-dashed border-border bg-muted/40 text-center px-6 py-10">
      <Icon name="PlayCircle" size={36} className="text-muted-foreground/40" />
      <span className="text-sm font-medium text-foreground">{hint}</span>
      <span className="text-xs text-muted-foreground max-w-lg">
        Вставь embed-ссылку в{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-[11px]">SUBSCRIBE_MEDIA.videoEmbedUrl</code>
      </span>
    </div>
  );
}

export default function SubscribePage() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    api.content.getAll()
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((item: SiteContent) => { map[item.key] = item.value; });
        setContent(map);
      })
      .catch(() => {});
  }, []);

  const telegramUrl = content.telegram_url || "https://t.me/";
  const maxUrl      = content.max_url      || "https://max.ru/";
  const ogImage     = content.og_image     ||
    "https://cdn.poehali.dev/projects/d006fe31-f11a-48d3-ba82-54149e58d318/files/7cddbd50-0847-4321-92b1-f534403d6a21.jpg";

  return (
    <>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная",    url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/" },
          { name: "Подписаться", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/subscribe" },
        ]}
      />
      <SchemaMarkup
        type="webpage"
        pageData={{
          name: "Подписаться — Telegram или MAX",
          description: "Подпишитесь на канал: упражнения для голоса и дикции, приёмы актёрского и ораторского мастерства, разборы и анонсы школы.",
          url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/subscribe",
          inLanguage: "ru-RU",
          image: ogImage,
        }}
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">

          {/* ── HERO ─────────────────────────────────────────── */}
          <section className="relative overflow-hidden py-14 sm:py-20 pb-28 sm:pb-36">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background pointer-events-none" />
            <div className="absolute top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none z-10" />

            <div className="relative container mx-auto px-4">
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-14">

                {/* Левая колонка — текст */}
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-6">
                    <Icon name="Zap" size={14} />
                    Бесплатно — подписка и контент
                  </span>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">
                    Канал про актёрское и ораторское мастерство
                  </h1>

                  <p className="text-lg text-muted-foreground mb-8">
                    Практика без «воды»: упражнения для голоса и дикции, работа на камеру, разборы и приёмы — в Telegram или MAX.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <Button asChild size="lg" className="text-base px-8 h-12">
                      <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                        <svg className="mr-2 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                        </svg>
                        Подписаться в Telegram
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="text-base px-8 h-12">
                      <a href={maxUrl} target="_blank" rel="noopener noreferrer">
                        <Icon name="MessageSquare" size={20} className="mr-2 shrink-0" />
                        Подписаться в MAX
                      </a>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Отписаться можно в любой момент
                  </p>
                </div>

                {/* Правая колонка — видео */}
                <div className="w-full lg:w-[520px] shrink-0">
                  <VideoSlot
                    embedUrl={SUBSCRIBE_MEDIA.videoEmbedUrl}
                    hint="Видео для первого экрана"
                  />
                </div>

              </div>
            </div>
          </section>

          {/* ── ГЛАВНОЕ ФОТО ────────────────────────────────── */}
          <section className="container mx-auto px-4 pb-12">
            <ImageSlot
              src={SUBSCRIBE_MEDIA.heroImage}
              hint="Блок 1 — главное фото (широкое)"
              aspectClass="aspect-[21/9] min-h-[180px] sm:min-h-[240px]"
            />
          </section>

          {/* ── ЧТО ВНУТРИ КАНАЛА — КАРТОЧКИ ───────────────── */}
          <section className="bg-card border-y border-border py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
                  Что ты найдёшь в канале
                </h2>
                <p className="text-center text-muted-foreground mb-10">
                  Если тебе интересны реальные инструменты — заходи.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CHANNEL_CARDS.map((card, i) => (
                    <div key={i} className="rounded-xl border border-border bg-background p-5 flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon name={card.icon as any} size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{card.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── ДВА ФОТО ────────────────────────────────────── */}
          <section className="container mx-auto px-4 pb-14">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageSlot src={SUBSCRIBE_MEDIA.rowImageLeft}  hint="Блок 3 — фото слева"  aspectClass="aspect-[4/3] min-h-[200px]" />
              <ImageSlot src={SUBSCRIBE_MEDIA.rowImageRight} hint="Блок 4 — фото справа" aspectClass="aspect-[4/3] min-h-[200px]" />
            </div>
          </section>

          {/* ── КОМУ ПОДОЙДЁТ ───────────────────────────────── */}
          <section className="bg-card border-y border-border py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
                  Кому подойдёт канал
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {WHO_CARDS.map((card, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-4">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon name={card.icon as any} size={18} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium">{card.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── ШИРОКОЕ ФОТО ────────────────────────────────── */}
          <section className="container mx-auto px-4 py-14">
            <ImageSlot
              src={SUBSCRIBE_MEDIA.midWideImage}
              hint="Блок 5 — фото перед «Почему стоит подписаться»"
              aspectClass="aspect-video min-h-[200px]"
            />
          </section>

          {/* ── ПОЧЕМУ ПОДПИСАТЬСЯ ──────────────────────────── */}
          <section className="container mx-auto px-4 pb-14">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                Почему стоит подписаться
              </h2>
              <div className="space-y-4">
                {WHY_LIST.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Icon name="CheckCircle" size={20} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA БЛОК ────────────────────────────────────── */}
          <section className="container mx-auto px-4 pb-14">
            <div className="max-w-xl mx-auto text-center bg-card rounded-2xl border border-border p-8">
              <h3 className="text-xl font-bold mb-2">Подписывайся — это бесплатно</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Выбери удобный мессенджер и получай контент сразу.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button asChild size="lg" className="h-12">
                  <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                    Перейти в Telegram
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12">
                  <a href={maxUrl} target="_blank" rel="noopener noreferrer">
                    Перейти в MAX
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* ── НИЖНЕЕ ФОТО ─────────────────────────────────── */}
          <section className="container mx-auto px-4 pb-14">
            <ImageSlot
              src={SUBSCRIBE_MEDIA.bottomImage}
              hint="Блок 6 — фото перед финальным блоком"
              aspectClass="aspect-[2/1] min-h-[200px]"
            />
          </section>

          {/* ── ФИНАЛЬНЫЙ CTA (тёмный) ──────────────────────── */}
          <section className="relative overflow-hidden bg-foreground py-16">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary rounded-full blur-3xl" />
            </div>
            <div className="relative container mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-background mb-3">
                Канал для тех, кто хочет говорить уверенно
              </h2>
              <p className="text-background/70 mb-8 max-w-xl mx-auto">
                Здесь нет мотивационных постов и бесконечной теории. Только практика, примеры и упражнения.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button asChild size="lg" variant="secondary" className="h-12 px-8">
                  <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                    Подписаться в Telegram
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 border-background/30 text-background hover:bg-background/10 hover:text-background">
                  <a href={maxUrl} target="_blank" rel="noopener noreferrer">
                    Подписаться в MAX
                  </a>
                </Button>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}
