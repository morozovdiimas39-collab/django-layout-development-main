import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ } from '@/lib/api';

interface FAQSectionProps {
  faq: FAQ[];
}

const defaultFAQ = [
  {
    id: 1,
    question: 'Что такое актерская визитка?',
    answer: 'Актерская визитка (showreel) — это короткое видео (2-7 минут), в котором актер демонстрирует свои навыки, типаж, диапазон эмоций и характер. Это ваш пропуск на кастинги и в продюсерские центры.',
    order: 1
  },
  {
    id: 2,
    question: 'Как долго создается визитка?',
    answer: 'В зависимости от пакета: от 1-2 недель (базовый) до 3-4 недель (премиум). Съемка занимает 1-3 дня, остальное время — подготовка, монтаж и постпродакшн.',
    order: 2
  },
  {
    id: 3,
    question: 'Нужен ли опыт актерской игры?',
    answer: 'Нет, опыт не обязателен. Режиссер поможет вам раскрепоститься, найти свой стиль и показать себя с лучшей стороны. Мы работаем как с начинающими, так и с опытными актерами.',
    order: 3
  },
  {
    id: 4,
    question: 'Что входит в стоимость?',
    answer: 'В стоимость входят: консультация режиссера, подготовка материала, съемка, монтаж, цветокоррекция, звуковое оформление, готовое видео в HD/4K. Детали по каждому пакету указаны выше.',
    order: 4
  },
  {
    id: 5,
    question: 'Можно ли посмотреть примеры работ?',
    answer: 'Да, конечно! Свяжитесь с нами, и мы покажем примеры визиток наших выпускников, расскажем о концепции и стиле съемки.',
    order: 5
  },
  {
    id: 6,
    question: 'Что делать с готовой визиткой?',
    answer: 'Готовую визитку можно отправлять на кастинги, в актерские агентства, размещать на сайтах для актеров, в соцсетях. Мы подскажем, как эффективно использовать вашу визитку для продвижения.',
    order: 6
  }
];

export default function FAQSection({ faq }: FAQSectionProps) {
  const showreelFAQ = faq.filter(f => f.category === 'showreel').length > 0 
    ? faq.filter(f => f.category === 'showreel')
    : defaultFAQ;

  return (
    <section className="py-20 md:py-32 px-4 bg-card/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4 text-sm border border-primary/20">
            <Icon name="HelpCircle" size={16} />
            Частые вопросы
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ответы на ваши <span className="text-primary">вопросы</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Не нашли ответ? Напишите нам, и мы с радостью проконсультируем
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {showreelFAQ.map((item) => (
            <AccordionItem 
              key={item.id} 
              value={`item-${item.id}`}
              className="bg-card/50 backdrop-blur-sm rounded-xl border border-primary/10 px-6 hover:border-primary/30 transition-all"
            >
              <AccordionTrigger className="hover:text-primary hover:no-underline text-left">
                <span className="font-semibold">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
