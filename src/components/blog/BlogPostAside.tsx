'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import type { MouseEvent } from 'react';

export type TocItem = { id: string; text: string; level: 2 | 3 };

/** Оглавление: только мобильный аккордеон (над текстом статьи) */
export function BlogPostTocMobile({ toc }: { toc: TocItem[] }) {
  if (toc.length === 0) return null;
  return (
    <Collapsible className="lg:hidden mb-8 rounded-xl border border-border bg-card/50">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left font-semibold">
        <span>Содержание статьи</span>
        <Icon
          name="ChevronDown"
          className="h-5 w-5 shrink-0 transition-transform [[data-state=open]_&]:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-3">
        <TocList toc={toc} />
      </CollapsibleContent>
    </Collapsible>
  );
}

/** Боковая колонка: оглавление + ссылки (только lg+) */
export function BlogPostSidebarDesktop({ toc }: { toc: TocItem[] }) {
  return (
    <aside className="hidden lg:block min-w-0">
      <div className="sticky top-28 space-y-6">
        {toc.length > 0 && (
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base font-semibold">В этой статье</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <TocList toc={toc} />
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
}

function TocList({ toc }: { toc: TocItem[] }) {
  const normalizeText = (s: string) => s.replace(/\s+/g, ' ').trim();

  const handleAnchorClick = (
    e: MouseEvent<HTMLAnchorElement>,
    id: string,
    text: string
  ) => {
    // Браузерный jump по #fragment может не скроллить корректно,
    // т.к. на странице возможен кастомный layout. Делаем скролл гарантированно.
    e.preventDefault();
    const scrollTo = () => {
      const byId = document.getElementById(id);
      const normalized = normalizeText(text);
      const el =
        byId ||
        Array.from(document.querySelectorAll<HTMLElement>('.prose h2, .prose h3'))
          .find((h) => normalizeText(h.textContent || '') === normalized);

      if (!el) return false;

      const headerOffset = 90;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
      return true;
    };

    if (!scrollTo()) {
      // Иногда id под заголовки проставляется чуть позже (после рендера).
      // Даем 2 короткие попытки, чтобы якорь сработал гарантированно.
      setTimeout(scrollTo, 50);
      setTimeout(scrollTo, 150);
    }
  };

  return (
    <nav aria-label="Содержание статьи">
      <ul className="space-y-1.5 text-sm">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleAnchorClick(e, item.id, item.text)}
              className={cn(
                'text-muted-foreground hover:text-foreground transition-colors block border-l-2 border-transparent hover:border-primary pl-2 -ml-px',
                item.level === 3 && 'pl-4 text-[13px]'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
