import type { FAQ } from '@/lib/api';
import { ACTING_SEO_FAQ_ITEMS } from '@/data/acting-seo-faq';

export const ACTING_FAQ_SECTION_TITLE = 'Вопросы о курсе актёрского мастерства в Москве';

export const ACTING_FAQ_SECTION_INTRO =
  'Актёрское искусство, театральные курсы и путь к кино — ответы для тех, кто выбирает школу и формат занятий.';

/** Сравнение вопросов без регистра и лишних пробелов/знаков — чтобы не дублировать SEO и записи из API. */
function normalizeFaqQuestion(q: string): string {
  return q
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.\s]+$/g, '')
    .trim();
}

export function mergeActingSeoFaqWithApi(apiFaq: FAQ[]): FAQ[] {
  const seo: FAQ[] = ACTING_SEO_FAQ_ITEMS.map((item, i) => ({
    id: -(i + 1),
    question: item.question,
    answer: item.answer,
    order_num: i,
  }));
  const seoKeys = new Set(ACTING_SEO_FAQ_ITEMS.map((item) => normalizeFaqQuestion(item.question)));
  const sorted = [...apiFaq]
    .sort((a, b) => (a.order_num ?? 0) - (b.order_num ?? 0))
    .filter((item) => !seoKeys.has(normalizeFaqQuestion(item.question)));
  return [...seo, ...sorted];
}
