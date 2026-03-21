'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PhoneForm from '@/components/PhoneForm';
import SeatsCounter from '@/components/ui/seats-counter';

interface CourseButtonsProps {
  source: string;
  course: 'acting' | 'oratory' | 'showreel' | 'acting-cards';
  detailsHref: string;
  trialDate?: string;
  maxSeats?: number;
  minSeats?: number;
  triggerText?: string;
  title?: string;
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
}: CourseButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <PhoneForm
        source={source}
        course={course}
        triggerText={triggerText}
        triggerSize="lg"
        title={title}
        description="Оставьте номер телефона, и мы свяжемся с вами"
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
  );
}
