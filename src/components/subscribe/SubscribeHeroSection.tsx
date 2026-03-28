import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SUBSCRIBE_HERO_VIDEO_MP4, SUBSCRIBE_TELEGRAM_BOT_URL } from '@/components/subscribe/constants';

const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

export default function SubscribeHeroSection() {
  const href = SUBSCRIBE_TELEGRAM_BOT_URL;

  return (
    <section className="relative overflow-hidden pt-20 pb-14 md:pt-28 md:pb-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-5 leading-tight">
              Мечтаете стать актёром кино?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-3 max-w-xl">
              Подпишитесь в Telegram — там материалы, новости и анонсы школы: пробные, наборы, даты
            </p>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 md:mb-8 max-w-xl">
              Бесплатно. Всё о школе и пути к кадру — рядом в телефоне.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border/80 px-3 py-2 rounded-lg text-sm md:text-base">
                <Icon name="Clapperboard" className="text-primary flex-shrink-0" size={18} />
                <span>Материалы о кино и актёрстве</span>
              </div>
              <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border/80 px-3 py-2 rounded-lg text-sm md:text-base">
                <Icon name="Bell" className="text-primary flex-shrink-0" size={18} />
                <span>Наборы и пробные</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 max-w-md">
              <Button asChild size="lg" className="h-12 text-base px-8 inline-flex items-center gap-2 w-full sm:w-auto">
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <TelegramIcon />
                  Подписаться в Telegram
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">Отписаться можно в один клик</p>
            </div>
          </div>

          <div className="w-full shrink-0">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl ring-1 ring-white/10">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={SUBSCRIBE_HERO_VIDEO_MP4}
                controls
                playsInline
                preload="metadata"
                title="Мечтаете стать актёром кино?"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
