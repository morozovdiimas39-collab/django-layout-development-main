import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { api, BlogPost } from "@/lib/api";
import { formatDate } from "@/lib/dates";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await api.gallery.getBlog();
      setPosts(data);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Блог школы - Полезные материалы и новости | Школа актёрского
          мастерства
        </title>
        <meta
          name="description"
          content="Читайте полезные материалы, новости и истории успеха наших учеников. Советы по развитию ораторских навыков и актёрского мастерства."
        />
        <link
          rel="canonical"
          href="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/blog"
        />
        <meta
          property="og:url"
          content="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/blog"
        />
        <meta property="og:title" content="Блог школы актёрского мастерства" />
      </Helmet>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/" },
          { name: "Блог", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/blog" }
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
                  Пока статей нет. Скоро здесь появятся интересные материалы!
                </p>
              </div>
            ) : (
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
                          {post.published_at && (
                            <span className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              {formatDate(post.published_at)}
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
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}