import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { api, BlogPost } from "@/lib/api";
import { formatDate } from "@/lib/dates";
import SchemaMarkup from "@/components/SchemaMarkup";

const BLOG_PER_PAGE = 12;
const SITE_BASE = "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai";

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await api.gallery.getBlog(pageNum, BLOG_PER_PAGE);
      setPosts(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setPosts([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(page);
  }, [page, loadPosts]);

  const setPage = (p: number) => {
    const next = Math.max(1, Math.min(p, totalPages));
    if (next === 1) {
      searchParams.delete("page");
    } else {
      searchParams.set("page", String(next));
    }
    setSearchParams(searchParams, { replace: true });
  };
  const pageSearch = (p: number) => (p <= 1 ? "" : `?page=${p}`);

  const canonicalUrl = page === 1 ? `${SITE_BASE}/blog` : `${SITE_BASE}/blog?page=${page}`;
  const prevUrl = page > 1 ? (page === 2 ? `${SITE_BASE}/blog` : `${SITE_BASE}/blog?page=${page - 1}`) : null;
  const nextUrl = page < totalPages ? `${SITE_BASE}/blog?page=${page + 1}` : null;
  const pageTitle = page === 1
    ? "Блог школы - Полезные материалы и новости | Школа актёрского мастерства"
    : `Блог — страница ${page} из ${totalPages} | Школа актёрского мастерства`;
  const description = page === 1
    ? "Читайте полезные материалы, новости и истории успеха наших учеников. Советы по развитию ораторских навыков и актёрского мастерства."
    : `Полезные материалы и новости школы актёрского мастерства. Страница ${page} из ${totalPages}.`;

  const showLeftEllipsis = page > 3;
  const showRightEllipsis = totalPages > 3 && page < totalPages - 2;
  const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const endPage = Math.min(totalPages, startPage + 4);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={page === 1 ? "Блог школы актёрского мастерства" : `Блог — страница ${page}`} />
      </Helmet>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: `${SITE_BASE}/` },
          { name: "Блог", url: `${SITE_BASE}/blog` },
          ...(page > 1 ? [{ name: `Страница ${page}`, url: canonicalUrl }] : []),
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />

        <section className="pt-20 pb-12 px-4 md:pt-32 md:pb-20 md:px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
                Блог о{" "}
                <span className="text-primary">актёрском мастерстве</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Полезные материалы, новости и истории успеха наших учеников
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Страница {page} из {totalPages} · всего статей: {total}
                </p>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12 md:py-20">
                <Icon
                  name="Loader2"
                  className="animate-spin mx-auto text-primary"
                  size={48}
                />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <Icon
                  name="FileText"
                  className="mx-auto mb-4 text-muted-foreground"
                  size={64}
                />
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
                  {page > 1
                    ? "На этой странице нет статей."
                    : "Пока статей нет. Скоро здесь появятся интересные материалы!"}
                </p>
                {page > 1 && (
                  <a
                    href="/blog"
                    className="text-primary font-medium mt-4 inline-block"
                  >
                    Вернуться на первую страницу блога
                  </a>
                )}
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {posts.map((post) => (
                    <a key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                        {(post.cover_image_url || post.image_url) && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.cover_image_url || post.image_url}
                              alt={`Обложка статьи: ${post.title}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="line-clamp-2 group-hover:text-primary transition">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            {post.author && (
                              <span className="flex items-center gap-1">
                                <Icon name="User" size={14} />
                                {post.author}
                              </span>
                            )}
                            {(post.published_at || post.created_at) && (
                              <span className="flex items-center gap-1">
                                <Icon name="Calendar" size={14} />
                                {formatDate(post.published_at || post.created_at)}
                              </span>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-4">
                            {post.excerpt || post.content}
                          </p>
                          <span className="text-primary text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                            Читать далее
                            <Icon name="ArrowRight" size={16} />
                          </span>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination className="mt-10">
                    <PaginationContent>
                      <PaginationItem>
                        {prevUrl ? (
                          <PaginationPrevious
                            href={prevUrl}
                            onClick={(e) => { e.preventDefault(); setPage(page - 1); }}
                            aria-label="Предыдущая страница"
                          >
                            <Icon name="ChevronLeft" className="h-4 w-4" />
                            Назад
                          </PaginationPrevious>
                        ) : (
                          <span className="flex h-9 items-center gap-1 rounded-md px-4 text-muted-foreground pointer-events-none">
                            <Icon name="ChevronLeft" className="h-4 w-4" />
                            Назад
                          </span>
                        )}
                      </PaginationItem>
                      {showLeftEllipsis && (
                        <>
                          <PaginationItem>
                            <PaginationLink href={`${SITE_BASE}/blog`} onClick={(e) => { e.preventDefault(); setPage(1); }}>1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        </>
                      )}
                      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href={`${SITE_BASE}/blog${pageSearch(p)}`}
                            isActive={p === page}
                            onClick={(e) => { e.preventDefault(); setPage(p); }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      {showRightEllipsis && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href={`${SITE_BASE}/blog?page=${totalPages}`} onClick={(e) => { e.preventDefault(); setPage(totalPages); }}>
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}
                      <PaginationItem>
                        {nextUrl ? (
                          <PaginationNext
                            href={nextUrl}
                            onClick={(e) => { e.preventDefault(); setPage(page + 1); }}
                            aria-label="Следующая страница"
                          >
                            Вперёд
                            <Icon name="ChevronRight" className="h-4 w-4" />
                          </PaginationNext>
                        ) : (
                          <span className="flex h-9 items-center gap-1 rounded-md px-4 text-muted-foreground pointer-events-none">
                            Вперёд
                            <Icon name="ChevronRight" className="h-4 w-4" />
                          </span>
                        )}
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
