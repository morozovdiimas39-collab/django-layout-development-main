import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api, BlogPost } from "@/lib/api";
import { useSEO, generateArticleSchema } from "@/hooks/useSEO";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const foundPost = await api.gallery.getBlogPost(slug);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate("/blog");
      }
    } catch (error) {
      console.error("Error loading post:", error);
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  const fullUrl = post
    ? `https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/blog/${post.slug}`
    : "";
  const articleSchema = post
    ? generateArticleSchema({
        title: post.title,
        description: post.excerpt || post.content.substring(0, 200),
        content: post.content,
        author: "Казбек Меретуков",
        publishedAt: post.created_at || new Date().toISOString(),
        updatedAt: post.updated_at,
        imageUrl: post.image_url,
        url: fullUrl,
      })
    : null;

  useSEO({
    title: post
      ? `${post.title} | Блог школы актёрского мастерства`
      : "Загрузка статьи...",
    description: post
      ? post.excerpt || post.content.substring(0, 160)
      : "Загрузка статьи о актёрском мастерстве",
    keywords: post
      ? `актёрское мастерство, ${post.title.toLowerCase()}, обучение актёрскому мастерству`
      : "актёрское мастерство",
    ogTitle: post?.title || "Статья",
    ogDescription: post ? post.excerpt || post.content.substring(0, 160) : "",
    ogImage: post?.image_url,
    ogType: "article",
    canonicalUrl: fullUrl || "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/blog",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <Icon
            name="Loader"
            className="animate-spin mx-auto mb-4 text-primary"
            size={48}
          />
          <p className="text-muted-foreground">Загрузка статьи...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Helmet>
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <article className="pt-20 md:pt-32 pb-12 md:pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => navigate("/blog")}
              className="mb-6 -ml-2"
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад к блогу
            </Button>

            {post.image_url && (
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-2xl">
                <img
                  src={post.image_url}
                  alt={`${post.title} - статья о актёрском мастерстве`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg md:text-xl text-muted-foreground mb-8 border-l-4 border-primary pl-6 italic">
                {post.excerpt}
              </p>
            )}

            <div 
              className="prose prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-foreground
                prose-p:mb-4 prose-p:text-base prose-p:md:text-lg prose-p:text-foreground prose-p:leading-relaxed
                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:text-foreground
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:text-foreground
                prose-li:mb-2 prose-li:text-foreground prose-li:leading-relaxed
                prose-strong:font-bold prose-strong:text-foreground
                prose-a:text-primary prose-a:underline prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <Card className="mt-12 bg-primary/5 border-primary/20">
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
                    <a href="/">Записаться на курс</a>
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
