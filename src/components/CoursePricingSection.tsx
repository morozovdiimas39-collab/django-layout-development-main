'use client';

import Icon from '@/components/ui/icon';
import LeadForm from '@/components/LeadForm';

function formatStart(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

const CONFIG = {
  oratory: {
    courseTitle: 'Курс ораторского мастерства',
    bannerBase: '8 занятий · 2 раза в неделю',
    perLessonLabel: 'За одно занятие',
    perLessonPrice: '3 000 ₽',
    perLessonHint: 'без скрытых платежей',
    fullLabel: 'Весь курс',
    fullBadge: 'итого',
    fullPrice: '25 000 ₽',
    fullHint: 'полная программа',
    checklist: [
      '2 занятия в неделю — удобный ритм',
      '8 занятий: от основ до уверенных выступлений',
    ],
    leadSource: 'pricing_oratory' as const,
    course: 'oratory' as const,
  },
  acting: {
    courseTitle: 'Курс актёрского мастерства',
    bannerBase: '3 месяца · 2 раза в неделю',
    perLessonLabel: 'За одно занятие',
    perLessonPrice: '3 000 ₽',
    perLessonHint: 'ориентировочно, в рамках курса',
    fullLabel: 'Весь курс',
    fullBadge: 'итого',
    fullPrice: '80 000 ₽',
    fullHint: 'вся программа и практика',
    checklist: [
      '2 занятия в неделю на протяжении 3 месяцев',
      'Работа на камеру, фильм, обратная связь преподавателя',
    ],
    leadSource: 'pricing_acting' as const,
    course: 'acting' as const,
  },
} as const;

export type CoursePricingVariant = keyof typeof CONFIG;

interface CoursePricingSectionProps {
  variant: CoursePricingVariant;
  /** ISO-дата старта курса для строки в баннере */
  courseStartDate?: string;
  /** Телефон из контента сайта (подвал левой карточки) */
  contactPhone?: string;
  /** Адрес из контента сайта (ключ `address`) */
  address?: string;
}

export default function CoursePricingSection({
  variant,
  courseStartDate = '',
  contactPhone = '',
  address = '',
}: CoursePricingSectionProps) {
  const c = CONFIG[variant];
  const startFormatted = formatStart(courseStartDate);
  const bannerText = startFormatted
    ? `${c.bannerBase} · старт ${startFormatted}`
    : c.bannerBase;
  const telDigits = contactPhone.replace(/\D/g, '');
  const addressLine = address.trim();

  return (
    <section
      id="pricing"
      className="py-14 md:py-20 px-4 relative overflow-hidden bg-gradient-to-br from-background via-primary/[0.07] to-background border-y border-primary/15"
    >
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none bg-[radial-gradient(ellipse_at_30%_0%,hsl(var(--primary))_0%,transparent_55%),radial-gradient(ellipse_at_100%_80%,hsl(var(--primary))_0%,transparent_45%)]" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Цены</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Левая карточка: цены и условия */}
          <div className="lg:col-span-8 flex flex-col rounded-2xl border border-primary/25 bg-card shadow-xl shadow-black/20 overflow-hidden">
            <div className="bg-primary/15 px-4 py-3 md:px-5 md:py-3.5 border-b border-primary/20">
              <p className="text-sm md:text-base font-medium text-primary text-center md:text-left">
                {bannerText}
              </p>
            </div>

            <div className="p-5 md:p-8 flex-1 flex flex-col">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight">
                {c.courseTitle}
              </h3>

              <div className="grid sm:grid-cols-2 gap-6 md:gap-8 mb-8">
                <div className="rounded-xl border border-border/80 bg-background/50 p-4 md:p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                    {c.perLessonLabel}
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
                    {c.perLessonPrice}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{c.perLessonHint}</p>
                </div>

                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 md:p-5 relative">
                  <div className="absolute top-3 right-3 md:top-4 md:right-4">
                    <span className="inline-flex min-w-[4.25rem] items-center justify-center rounded-md bg-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wide px-2 py-1">
                      {c.fullBadge}
                    </span>
                  </div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2 pr-16">
                    {c.fullLabel}
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-primary tabular-nums">
                    {c.fullPrice}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{c.fullHint}</p>
                </div>
              </div>

              <div className="h-px bg-border mb-6" />

              <ul className="space-y-3 mb-8 flex-1">
                {c.checklist.map((text) => (
                  <li key={text} className="flex gap-3 text-sm md:text-base">
                    <Icon name="CheckCircle2" className="text-primary shrink-0 mt-0.5" size={20} />
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-3 rounded-xl bg-muted/90 border border-border px-4 py-3 text-xs md:text-sm text-muted-foreground">
                {addressLine && (
                  <p className="flex gap-2 items-start">
                    <Icon name="MapPin" className="text-primary shrink-0 mt-0.5" size={18} />
                    <span className="text-foreground/90">{addressLine}</span>
                  </p>
                )}
                <p>
                  {contactPhone && telDigits ? (
                    <>
                      По вопросам и оплате:{' '}
                      <a
                        href={`tel:${telDigits}`}
                        className="font-semibold text-foreground hover:text-primary underline-offset-2 hover:underline"
                      >
                        {contactPhone}
                      </a>
                    </>
                  ) : (
                    <>По вопросам и оплате оставьте заявку в форме справа — перезвоним и всё расскажем.</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Правая карточка: заявка */}
          <div className="lg:col-span-4 flex">
            <div className="flex flex-col w-full rounded-2xl border border-primary/25 bg-card p-5 md:p-7 shadow-xl shadow-black/20">
              <h3 className="text-lg md:text-xl font-bold mb-1 leading-snug">
                Запишитесь на курс или получите консультацию
              </h3>
              <p className="text-xs text-muted-foreground mb-5">
                Оставьте номер телефона — перезвоним и ответим на вопросы
              </p>
              <div className="flex-1 flex flex-col">
                <LeadForm
                  source={c.leadSource}
                  course={c.course}
                  layout="embedded"
                  title=""
                  description=""
                  buttonText="Записаться"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
