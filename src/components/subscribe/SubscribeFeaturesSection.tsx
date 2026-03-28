import Icon from '@/components/ui/icon';

const ITEMS = [
  {
    icon: 'Flame',
    title: 'Материалы школы',
    text: 'Короткие материалы про школу, актёрство и то, чем мы живём',
  },
  {
    icon: 'MessageCircle',
    title: 'Новости',
    text: 'Новости курса и школы — что меняется и что важно знать',
  },
  {
    icon: 'Video',
    title: 'Кино и кадр',
    text: 'Тексты про кино, кадр и ремесло — в духе нашей программы',
  },
  {
    icon: 'Bell',
    title: 'Анонсы',
    text: 'Пробные, наборы в группы, свободные места — с датами',
  },
  {
    icon: 'Sparkles',
    title: 'События',
    text: 'Если что-то происходит в школе — тоже напишем в Telegram',
  },
  {
    icon: 'Shield',
    title: 'Бесплатно',
    text: 'Подписка бесплатная, отписаться можно в любой момент',
  },
];

export default function SubscribeFeaturesSection() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4 bg-card border-y border-border">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">
          Что мы публикуем в Telegram
        </h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 text-sm md:text-base max-w-2xl mx-auto">
          Материалы, новости и анонсы — всё в одном месте, удобно читать с телефона
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-background p-6 flex gap-4 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon name={item.icon as any} size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
