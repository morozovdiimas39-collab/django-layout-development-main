import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Review } from '@/lib/api';
import useEmblaCarousel from 'embla-carousel-react';

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  return (
    <section id="reviews" className="py-12 px-4 md:py-20 md:px-4 bg-gradient-to-b from-background to-card/50">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Отзывы наших учеников</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto">
          Что говорят те, кто уже прошёл наши курсы
        </p>
        {reviews.length > 0 ? (
          <>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 md:gap-6">
                {reviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                    itemScope 
                    itemType="https://schema.org/Review"
                  >
                    <Card className="h-full bg-card/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition">
                      <CardHeader>
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <CardTitle className="text-lg" itemProp="author" itemScope itemType="https://schema.org/Person">
                              <span itemProp="name">{review.name}</span>
                            </CardTitle>
                            <div className="bg-primary/10 rounded-full p-2">
                              <Icon name="Quote" className="text-primary" size={16} />
                            </div>
                          </div>
                          <div className="flex gap-0.5" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                            <meta itemProp="ratingValue" content={review.rating.toString()} />
                            <meta itemProp="bestRating" content="5" />
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Icon key={i} name="Star" size={14} className="text-primary fill-primary" />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm leading-relaxed italic" itemProp="reviewBody">"{review.text}"</p>
                      </CardContent>
                      <meta itemProp="itemReviewed" itemScope itemType="https://schema.org/Course" content="Курсы актёрского мастерства" />
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi?.scrollPrev()}
                className="rounded-full"
              >
                <Icon name="ChevronLeft" size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi?.scrollNext()}
                className="rounded-full"
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Icon name="MessageSquare" size={64} className="mx-auto mb-4 opacity-30" />
            <p>Отзывы скоро появятся</p>
          </div>
        )}
      </div>
    </section>
  );
}