import Icon from '@/components/ui/icon';

const benefits = [
  {
    icon: 'Award',
    title: 'Режиссер с опытом',
    description: 'Казбек Меретуков — победитель ТЕФИ-2012, режиссер телесериалов с многолетним опытом работы с актерами'
  },
  {
    icon: 'Camera',
    title: 'Профессиональная съемка',
    description: 'Кинокамеры, освещение, звук — всё на уровне киностудии. Ваша визитка будет выглядеть как кадры из фильма'
  },
  {
    icon: 'Users',
    title: 'Индивидуальный подход',
    description: 'Создаем визитку под ваш типаж и характер. Помогаем раскрыть уникальность и найти свой стиль'
  },
  {
    icon: 'Sparkles',
    title: 'Полный цикл',
    description: 'От идеи до готового видео — консультация, съемка, монтаж, цветокоррекция, озвучка. Вы получаете готовый продукт'
  },
  {
    icon: 'Target',
    title: 'Ориентация на результат',
    description: 'Ваша визитка должна работать — привлекать внимание кастинг-директоров и продюсеров'
  },
  {
    icon: 'Heart',
    title: 'Атмосфера съемок',
    description: 'Комфортная обстановка, поддержка режиссера, возможность раскрепоститься и показать себя'
  }
];

export default function WhySection() {
  return (
    <section className="py-20 md:py-32 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4 text-sm border border-primary/20">
            <Icon name="Star" size={16} />
            Почему выбирают нас
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Почему актеры <span className="text-primary">выбирают нас</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Профессионализм, качество и понимание того, что нужно актеру для успешной карьеры
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Icon name={benefit.icon} className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
