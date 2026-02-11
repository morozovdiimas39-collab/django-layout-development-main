import Icon from '@/components/ui/icon';
import PhoneForm from '@/components/PhoneForm';

const packages = [
  {
    name: 'Базовый',
    price: '35 000',
    description: 'Идеально для начинающих актеров',
    features: [
      'Консультация с режиссером',
      'Подготовка материала',
      '1 день съемки',
      'Визитка 2-3 минуты',
      'Базовый монтаж',
      'Цветокоррекция',
      'Звуковое оформление',
      'HD качество (1080p)'
    ],
    popular: false
  },
  {
    name: 'Профессиональный',
    price: '55 000',
    description: 'Для серьезных кастингов',
    features: [
      'Всё из базового пакета',
      '2 дня съемки',
      'Визитка 3-5 минут',
      'Несколько образов',
      'Профессиональный монтаж',
      'Работа с оператором',
      '2-3 локации',
      '4K качество',
      'Помощь в продвижении'
    ],
    popular: true
  },
  {
    name: 'Премиум',
    price: 'от 75 000',
    description: 'Топовое качество',
    features: [
      'Всё из профессионального',
      '3+ дня съемки',
      'Визитка 5-7 минут',
      'Множество образов',
      'Киношный монтаж',
      'Съемочная группа',
      '5+ локаций',
      'Cinema-качество',
      'Персональный продюсер',
      'Портфолио фотографий'
    ],
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4 text-sm border border-primary/20">
            <Icon name="DollarSign" size={16} />
            Пакеты услуг
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Выберите свой <span className="text-primary">пакет</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            От базовой визитки до премиального кино-showreel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className={`relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                pkg.popular 
                  ? 'border-primary shadow-xl scale-105' 
                  : 'border-primary/10 hover:border-primary/30'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                  Популярный
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-muted-foreground">₽</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon name="Check" className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <PhoneForm 
                source={`pricing_${pkg.name.toLowerCase()}`}
                course="showreel"
                triggerText="Выбрать пакет"
                triggerSize="default"
                triggerClassName={`w-full ${pkg.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                title={`Пакет "${pkg.name}"`}
                description={`Оставьте номер телефона, и мы свяжемся с вами для обсуждения деталей`}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Не нашли подходящий пакет? Свяжитесь с нами, и мы создадим индивидуальное предложение
          </p>
        </div>
      </div>
    </section>
  );
}
