import Icon from '@/components/ui/icon';

const steps = [
  {
    icon: 'MessageSquare',
    title: 'Консультация',
    description: 'Обсуждаем ваши цели, характер, типаж. Выбираем концепцию и образы для визитки'
  },
  {
    icon: 'FileText',
    title: 'Подготовка материала',
    description: 'Подбираем тексты, монологи или диалоги. Работаем над образом и эмоциональной палитрой'
  },
  {
    icon: 'Camera',
    title: 'Съемка',
    description: 'Профессиональная съемка на кинокамеру с режиссером. Работаем над актерской игрой и харизмой'
  },
  {
    icon: 'Film',
    title: 'Монтаж',
    description: 'Профессиональный монтаж, цветокоррекция, звуковое оформление. Создаем целостный образ'
  },
  {
    icon: 'Sparkles',
    title: 'Готовая визитка',
    description: 'Получаете showreel в высоком качестве, готовый к отправке на кастинги и в агентства'
  }
];

export default function ProcessSection() {
  return (
    <section className="py-20 md:py-32 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4 text-sm border border-primary/20">
            <Icon name="Workflow" size={16} />
            Процесс создания
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Как мы создаем вашу <span className="text-primary">визитку</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            От идеи до готового видео — полный цикл производства с профессиональным режиссером
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex gap-6 mb-8 last:mb-0 group"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon name={step.icon} className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-primary/20 mt-2 group-hover:bg-primary/40 transition-colors"></div>
                )}
              </div>
              
              <div className="flex-1 pb-12">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
