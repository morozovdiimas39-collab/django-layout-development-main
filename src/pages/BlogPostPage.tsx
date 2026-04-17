'use client';
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";
import {
  BlogPostTocMobile,
  BlogPostSidebarDesktop,
  type TocItem,
} from "@/components/blog/BlogPostAside";
import { BlogPost } from "@/lib/api";
import { useSEO, generateArticleSchema } from "@/hooks/useSEO";
import { prepareBlogBodyHtml, stripHtmlForDescription } from "@/lib/blog-content";
import { formatDate } from "@/lib/dates";
import { estimateReadingMinutes } from "@/lib/reading-time";

type BlogPostPageProps = {
  slug?: string;
  initialPost?: BlogPost;
};

function truncateLabel(title: string, max = 64): string {
  const t = title.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export default function BlogPostPage({ slug, initialPost }: BlogPostPageProps) {
  const router = useRouter();
  const post = initialPost ?? null;
  const [toc, setToc] = useState<TocItem[]>([]);

  const fullUrl = post
    ? `https://kazbek-meretukov.ru/blog/${post.slug || slug || ''}`
    : '';
  const metaTitle = post?.seo_title?.trim() || post?.title || '';
  const metaDescription =
    post?.seo_description?.trim() ||
    post?.excerpt?.trim() ||
    (post ? stripHtmlForDescription(post.content || "", 165) : '');

  const articleSchema = post
    ? generateArticleSchema({
        title: post.title,
        description: metaDescription,
        content: stripHtmlForDescription(post.content, 4000),
        author: "Казбек Меретуков",
        publishedAt: post.created_at || new Date().toISOString(),
        updatedAt: post.updated_at,
        imageUrl: post.image_url,
        url: fullUrl,
      })
    : null;

  const bodyHtml = useMemo(
    () => (post ? prepareBlogBodyHtml(post.content || "") : ""),
    [post]
  );
  const articleRef = useRef<HTMLDivElement>(null);

  const readingMinutes = post
    ? estimateReadingMinutes(post.content || '')
    : 1;

  const publishedLabel = post?.created_at ? formatDate(post.created_at) : null;
  const updatedRaw = post?.updated_at;
  const showUpdated =
    Boolean(
      updatedRaw &&
        post?.created_at &&
        String(updatedRaw).slice(0, 10) !== String(post.created_at).slice(0, 10)
    );

  const breadcrumbItems: BreadcrumbItem[] | undefined = post
    ? [
        { label: 'Главная', path: '/' },
        { label: 'Блог', path: '/blog' },
        { label: truncateLabel(post.title), path: fullUrl },
      ]
    : undefined;

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    // Проставляем id заголовкам для якорных ссылок.
    // Делается на клиенте, чтобы стабильно согласовать toc и DOM.
    root.querySelectorAll("h2, h3").forEach((el, i) => {
      if (el.id) return;
      const text = (el.textContent || "section").toLowerCase();
      const slugPart = text
        .replace(/[^a-zа-яё0-9\s-]+/gi, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 48);
      el.id = slugPart ? `${slugPart}-${i}` : `section-${i}`;
    });

    const items: TocItem[] = [];
    root.querySelectorAll("h2, h3").forEach((el) => {
      const id = el.id;
      if (!id) return;
      const text = (el.textContent || "").trim();
      if (!text) return;
      items.push({
        id,
        text,
        level: el.tagName === "H2" ? 2 : 3,
      });
    });
    setToc(items);
  }, [bodyHtml]);

  useSEO({
    title: post
      ? `${metaTitle} | Блог школы актёрского мастерства`
      : "Загрузка статьи...",
    description: post
      ? metaDescription
      : "Загрузка статьи о актёрском мастерстве",
    keywords: post
      ? `актёрское мастерство, ${post.title.toLowerCase()}, обучение актёрскому мастерству`
      : "актёрское мастерство",
    ogTitle: metaTitle || "Статья",
    ogDescription: post ? metaDescription : "",
    ogImage: post?.image_url,
    ogType: "article",
    canonicalUrl: fullUrl || "https://kazbek-meretukov.ru/blog",
    structuredData: articleSchema || undefined,
    article: post
      ? {
          author: "Казбек Меретуков",
          publishedTime: post.created_at || new Date().toISOString(),
          modifiedTime: post.updated_at,
          section: "Актёрское мастерство",
          tags: ["актёрское мастерство", "обучение", "курсы"],
        }
      : undefined,
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <p className="text-muted-foreground">Статья не найдена</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <Breadcrumbs
          items={breadcrumbItems}
          className="container mx-auto max-w-6xl px-4 pt-20 md:pt-28 pb-2"
        />

        <article className="pt-2 md:pt-4 pb-12 md:pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            {post.image_url && (
              <div className="aspect-video w-full max-w-4xl rounded-xl overflow-hidden mb-4 shadow-2xl">
                <img
                  src={post.image_url}
                  alt={`${post.title} - статья о актёрском мастерстве`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
              {publishedLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="Calendar" className="h-4 w-4" />
                  {publishedLabel}
                </span>
              )}
              {showUpdated && updatedRaw && (
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="RefreshCw" className="h-4 w-4" />
                  обновлено {formatDate(updatedRaw)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Clock" className="h-4 w-4" />
                {readingMinutes} мин чтения
              </span>
            </div>

            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground mb-8 border-l-4 border-primary pl-6 italic">
                  {post.excerpt}
                </p>
              )}
            </div>

            <BlogPostTocMobile toc={toc} />

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 lg:items-start">
              <div className="min-w-0">
                <div
                  ref={articleRef}
                  suppressHydrationWarning
                  className="prose prose-lg max-w-none
                prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-foreground
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:mb-4 prose-p:text-base prose-p:md:text-lg prose-p:text-foreground prose-p:leading-relaxed
                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:text-foreground
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:text-foreground
                prose-li:mb-2 prose-li:text-foreground prose-li:leading-relaxed
                prose-strong:font-bold prose-strong:text-foreground
                prose-a:text-primary prose-a:underline prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg
                prose-img:rounded-xl prose-img:shadow-md
                [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:min-h-[220px] [&_iframe]:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </div>
              <BlogPostSidebarDesktop toc={toc} />
            </div>

            <Card className="mt-12 max-w-4xl bg-primary/5 border-primary/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      Хотите узнать больше?
                    </h3>
                    <p className="text-muted-foreground">
                      Запишитесь на пробное занятие и убедитесь в эффективности
                      нашей методики
                    </p>
                  </div>
                  <Button size="lg" asChild>
                    <a href="/acting/probnoe">Записаться на пробное</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
}
