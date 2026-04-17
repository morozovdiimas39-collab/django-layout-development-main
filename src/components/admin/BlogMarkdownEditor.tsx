'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { prepareBlogBodyHtml } from '@/lib/blog-content';
import { cn } from '@/lib/utils';

function insertAtCursor(textarea: HTMLTextAreaElement, text: string) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const next = before + text + after;
  textarea.value = next;
  const pos = start + text.length;
  textarea.selectionStart = textarea.selectionEnd = pos;
  textarea.focus();
  return next;
}

function toVideoEmbedUrl(raw: string): string | null {
  const u = String(raw).trim();
  if (!u) return null;
  try {
    const url = new URL(u);
    const h = url.hostname.replace(/^www\./, '');
    if (h === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (h.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
      const m = url.pathname.match(/\/embed\/([^/?]+)/);
      if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
    }
    if (h.includes('vimeo.com')) {
      const m = url.pathname.match(/\/(\d+)/);
      if (m) return `https://player.vimeo.com/video/${m[1]}`;
    }
    if (h.includes('rutube.ru')) {
      const m = url.pathname.match(/\/video\/([a-f0-9]+)/i);
      if (m) return `https://rutube.ru/play/embed/${m[1]}`;
    }
    if (h.includes('vk.com') && url.pathname.includes('video')) {
      return u;
    }
  } catch {
    return null;
  }
  return null;
}

const BTN = 'h-8 px-2 text-xs font-medium';

type BlogMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  minHeight?: string;
};

export default function BlogMarkdownEditor({
  value,
  onChange,
  className,
  minHeight = 'min-h-[320px]',
}: BlogMarkdownEditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const formId = useId();
  const [imgOpen, setImgOpen] = useState(false);
  const [vidOpen, setVidOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [imgAlt, setImgAlt] = useState('');
  const [vidUrl, setVidUrl] = useState('');

  const apply = useCallback(
    (fn: (el: HTMLTextAreaElement) => string) => {
      const el = taRef.current;
      if (!el) return;
      const next = fn(el);
      onChange(next);
    },
    [onChange]
  );

  const wrap = (prefix: string, suffix = '') => {
    apply((el) => {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const sel = el.value.slice(start, end) || 'текст';
      const text = el.value.slice(0, start) + prefix + sel + suffix + el.value.slice(end);
      el.value = text;
      const pos = start + prefix.length + sel.length + suffix.length;
      el.selectionStart = el.selectionEnd = pos;
      el.focus();
      return el.value;
    });
  };

  const linePrefix = (prefix: string) => {
    apply((el) => insertAtCursor(el, `${prefix}`));
  };

  const insertImageMd = () => {
    if (!imgUrl.trim()) return;
    const alt = imgAlt.trim() || 'Иллюстрация';
    apply((el) =>
      insertAtCursor(
        el,
        `\n\n![${alt.replace(/]/g, '')}](${imgUrl.trim()})\n\n`
      )
    );
    setImgOpen(false);
    setImgUrl('');
    setImgAlt('');
  };

  const insertVideoIframe = () => {
    const embed = toVideoEmbedUrl(vidUrl);
    if (!embed) return;
    const block = `\n\n<div class="my-6 aspect-video overflow-hidden rounded-lg border border-border">\n<iframe class="h-full w-full min-h-[220px]" src="${embed}" title="Видео" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>\n</div>\n\n`;
    apply((el) => insertAtCursor(el, block));
    setVidOpen(false);
    setVidUrl('');
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Tabs defaultValue="edit" className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="edit">Редактор</TabsTrigger>
            <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap gap-1">
            <Button type="button" variant="outline" className={BTN} onClick={() => linePrefix('## ')}>
              H2
            </Button>
            <Button type="button" variant="outline" className={BTN} onClick={() => linePrefix('### ')}>
              H3
            </Button>
            <Button type="button" variant="outline" className={BTN} onClick={() => wrap('**', '**')}>
              Жирный
            </Button>
            <Button type="button" variant="outline" className={BTN} onClick={() => wrap('*', '*')}>
              Курсив
            </Button>
            <Button type="button" variant="outline" className={BTN} onClick={() => linePrefix('- ')}>
              Список
            </Button>
            <Button type="button" variant="outline" className={BTN} onClick={() => linePrefix('1. ')}>
              Нумерация
            </Button>
            <Button type="button" variant="outline" className={BTN} onClick={() => linePrefix('> ')}>
              Цитата
            </Button>
            <Button type="button" variant="outline" className={BTN} onClick={() => wrap('[', '](https://)')}>
              Ссылка
            </Button>
            <Button type="button" variant="secondary" className={BTN} onClick={() => setImgOpen(true)}>
              Картинка
            </Button>
            <Button type="button" variant="secondary" className={BTN} onClick={() => setVidOpen(true)}>
              Видео
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="mt-2 space-y-2">
          <textarea
            ref={taRef}
            id={formId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              minHeight,
              'font-mono'
            )}
            placeholder="Пишите в **Markdown**: заголовки ##, списки, ![описание](url картинки)…"
          />
          <p className="text-xs text-muted-foreground">
            Поддерживается Markdown и вставка HTML-блоков с видео. Также поддерживаются заголовки в формате `#Заголовок#`.
            Обложка статьи — отдельное поле «URL изображения».
          </p>
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <div
            className={cn(
              'prose prose-lg max-w-none dark:prose-invert rounded-md border border-border bg-muted/30 p-4',
              minHeight,
              'overflow-auto'
            )}
            dangerouslySetInnerHTML={{ __html: prepareBlogBodyHtml(value) }}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={imgOpen} onOpenChange={setImgOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Картинка по ссылке</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>URL изображения (https://…)</Label>
              <Input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label>Подпись (alt, для SEO)</Label>
              <Input value={imgAlt} onChange={(e) => setImgAlt(e.target.value)} placeholder="Описание для поиска и скринридеров" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImgOpen(false)}>
              Отмена
            </Button>
            <Button onClick={insertImageMd}>Вставить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={vidOpen} onOpenChange={setVidOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Видео по ссылке</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Вставьте ссылку на ролик YouTube, Vimeo или Rutube — в статью добавится встроенный плеер.
          </p>
          <div>
            <Label>Ссылка на видео</Label>
            <Input value={vidUrl} onChange={(e) => setVidUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVidOpen(false)}>
              Отмена
            </Button>
            <Button onClick={insertVideoIframe} disabled={!toVideoEmbedUrl(vidUrl)}>
              Вставить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
