'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroActions() {
  const scrollToCta = () => {
    document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <Button size="lg" onClick={scrollToCta}>
        Записаться на занятие
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="/teacher">О преподавателе</Link>
      </Button>
    </div>
  );
}
