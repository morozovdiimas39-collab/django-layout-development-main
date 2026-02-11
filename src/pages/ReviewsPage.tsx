import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhoneForm from "@/components/PhoneForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import { api, Review } from "@/lib/api";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await api.gallery.getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Icon
        key={index}
        name={index < rating ? "Star" : "Star"}
        size={16}
        className={
          index < rating ? "text-primary fill-primary" : "text-muted-foreground"
        }
      />
    ));
  };

  return (
    <>
      <Helmet>
        <title>
          Отзывы учеников - Истории успеха | Школа актёрского мастерства
        </title>
        <meta
          name="description"
          content="Читайте отзывы наших учеников о курсах ораторского искусства и актёрского мастерства. Истории успеха реальных людей."
        />
        <link
          rel="canonical"
          href="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/reviews"
        />
        <meta
          property="og:url"
          content="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/reviews"
        />
        <meta
          property="og:title"
          content="Отзывы учеников школы актёрского мастерства"
        />
      </Helmet>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/" },
          { name: "Отзывы", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/reviews" }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />

        <section className="pt-20 pb-12 px-4 md:pt-32 md:pb-20 md:px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
                Отзывы о{" "}
                <span className="text-primary">
                  курсах актёрского мастерства
                </span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Истории успеха тех, кто прошел наши курсы и изменил свою жизнь
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
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <Icon
                  name="MessageSquare"
                  className="mx-auto mb-4 text-muted-foreground"
                  size={64}
                />
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8">
                  Скоро здесь появятся первые отзывы наших учеников!
                </p>
                <PhoneForm
                  source="reviews_empty"
                  triggerText="Стать первым"
                  title="Запишитесь первым"
                  description="Оставьте номер телефона и станьте одним из первых учеников нашей школы"
                />
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
                  {reviews.map((review) => (
                    <Card
                      key={review.id}
                      className="group hover:shadow-xl transition-all duration-300"
                    >
                      <CardContent className="pt-4 md:pt-6">
                        <div className="flex items-start gap-3 md:gap-4 mb-4">
                          {review.image_url ? (
                            <img
                              src={review.image_url}
                              alt={`Фотография ученика ${review.name}`}
                              className="w-16 h-16 rounded-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon
                                name="User"
                                className="text-primary"
                                size={28}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-base md:text-lg">
                              {review.name}
                            </h3>
                            <div className="flex gap-0.5 md:gap-1 mt-2">
                              {renderStars(review.rating || 5)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {review.text}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-card p-6 md:p-12 rounded-2xl md:rounded-3xl max-w-2xl mx-auto text-center">
                  <Icon
                    name="Sparkles"
                    size={40}
                    className="mx-auto mb-3 md:mb-4 text-primary md:w-12 md:h-12"
                  />
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                    Станьте частью истории успеха
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    Запишитесь на курс и поделитесь своим опытом
                  </p>
                  <PhoneForm
                    source="reviews_cta"
                    triggerText="Записаться на курс"
                    triggerClassName="w-full sm:w-auto"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}