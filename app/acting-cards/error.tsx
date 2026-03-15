'use client';

import Link from 'next/link';

export default function ActingCardsError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <h1 className="text-xl font-semibold mb-2">Не удалось загрузить страницу</h1>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Попробуйте обновить страницу или перейти на главную.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium"
        >
          Обновить
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-md border border-input bg-background font-medium"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
