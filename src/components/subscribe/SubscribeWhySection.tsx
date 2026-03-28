import Icon from '@/components/ui/icon';

const ITEMS = [
  'Материалы, новости и анонсы — в Telegram, не нужно каждый день заходить на сайт',
  'Даты пробных и наборов приходят к вам — сложнее пропустить',
  'Читайте с телефона, когда удобно',
];

export default function SubscribeWhySection() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">
            Зачем подписаться
          </h2>
          <div className="space-y-4">
            {ITEMS.map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <Icon name="CheckCircle" size={22} className="text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-base leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
