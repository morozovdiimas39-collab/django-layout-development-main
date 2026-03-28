import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQ } from '@/lib/api';

interface FAQSectionProps {
  faq: FAQ[];
  title?: string;
  intro?: string;
}

export default function FAQSection({ faq, title = 'Частые вопросы', intro }: FAQSectionProps) {
  if (faq.length === 0) return null;

  return (
    <section className="py-12 px-4 md:py-16 md:px-4">
      <div className="container mx-auto max-w-4xl">
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center text-balance ${
            intro ? 'mb-3 md:mb-4' : 'mb-8 md:mb-10'
          }`}
        >
          {title}
        </h2>
        {intro ? (
          <p className="text-muted-foreground text-center text-sm sm:text-base max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
            {intro}
          </p>
        ) : null}
        <Accordion type="multiple" className="space-y-3">
          {faq.map((item) => (
            <AccordionItem
              key={item.id}
              value={`item-${item.id}`}
              className="bg-card px-5 sm:px-6 rounded-xl border border-border/80 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline text-left font-semibold text-base py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-4 pt-0">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
