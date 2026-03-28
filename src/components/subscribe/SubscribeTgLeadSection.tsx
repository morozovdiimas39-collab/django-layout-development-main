import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SUBSCRIBE_TELEGRAM_BOT_URL } from '@/components/subscribe/constants';

const TelegramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

export default function SubscribeTgLeadSection() {
  const href = SUBSCRIBE_TELEGRAM_BOT_URL;

  return (
    <section className="py-12 px-4 md:py-20 md:px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Icon name="Sparkles" className="text-primary" size={18} />
              <span className="text-primary font-semibold text-sm">Школа в Telegram</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Материалы и новости — <span className="text-primary">в одном месте</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6">
              Подпишитесь — в Telegram вы получите:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="CheckCircle2" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Материалы</h3>
                  <p className="text-sm text-muted-foreground">Про актёрство, курс и занятия — от школы</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Calendar" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Анонсы пробных и наборов</h3>
                  <p className="text-sm text-muted-foreground">Когда открывается группа и как записаться на пробное</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Heart" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Новости школы</h3>
                  <p className="text-sm text-muted-foreground">События и объявления — без лишнего шума</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-primary/20">
            <div className="mb-4 sm:mb-6 text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Перейти в Telegram</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Откроется чат — подписка бесплатная
              </p>
            </div>
            <Button asChild size="lg" className="w-full h-12 text-base gap-2">
              <a href={href} target="_blank" rel="noopener noreferrer">
                <TelegramIcon />
                Подписаться
              </a>
            </Button>
            <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
              <Icon name="Lock" size={12} className="flex-shrink-0" />
              <span>Мы не рассылаем спам и не продаём базу</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
