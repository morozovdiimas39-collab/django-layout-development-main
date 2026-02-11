import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQ } from '@/lib/api';

interface FAQSectionProps {
  faq: FAQ[];
}

export default function FAQSection({ faq }: FAQSectionProps) {
  if (faq.length === 0) return null;

  return (
    <section className="py-12 px-4 md:py-20 md:px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Частые вопросы</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faq.map((item) => (
            <AccordionItem key={item.id} value={`item-${item.id}`} className="bg-card px-6 rounded-lg border-0">
              <AccordionTrigger className="hover:no-underline">{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
