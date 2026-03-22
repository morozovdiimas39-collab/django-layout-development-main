'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PhoneForm from '@/components/PhoneForm';
import SeatsCounter from '@/components/ui/seats-counter';

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

interface CourseButtonsProps {
  source: string;
  course: 'acting' | 'oratory' | 'showreel' | 'acting-cards';
  detailsHref: string;
  trialDate?: string;
  maxSeats?: number;
  minSeats?: number;
  triggerText?: string;
  title?: string;
  telegramHref?: string;
  telegramText?: string;
}

export default function CourseButtons({
  source,
  course,
  detailsHref,
  trialDate,
  maxSeats = 12,
  minSeats = 2,
  triggerText = 'Записаться на курс',
  title = 'Запись на курс',
  telegramHref,
  telegramText = 'Канал курса в Telegram',
}: CourseButtonsProps) {
  return (
    <div className="inline-flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <PhoneForm
          source={source}
          course={course}
          triggerText={triggerText}
          triggerSize="lg"
          title={title}
          description="Оставьте номер телефона, и мы свяжемся с вами"
          telegramHref={telegramHref}
          seatsCounter={
            trialDate ? (
              <SeatsCounter trialDate={trialDate} maxSeats={maxSeats} minSeats={minSeats} />
            ) : undefined
          }
        />
        <Button asChild size="lg" variant="outline">
          <Link href={detailsHref}>Подробнее о курсе</Link>
        </Button>
      </div>
      {telegramHref ? (
        <a
          href={telegramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg px-5 py-3 text-base font-semibold text-white transition-colors bg-[#2CA5E0] hover:bg-[#1a96cc]"
        >
          <TelegramIcon />
          {telegramText}
        </a>
      ) : null}
    </div>
  );
}
