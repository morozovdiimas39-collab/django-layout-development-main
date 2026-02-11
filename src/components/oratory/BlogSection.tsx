import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { BlogPost } from '@/lib/api';

interface BlogSectionProps {
  blog: BlogPost[];
  onNavigate: (slug: string) => void;
  onNavigateToBlog: () => void;
}

export default function BlogSection({ blog, onNavigate, onNavigateToBlog }: BlogSectionProps) {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4 bg-card">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Блог</h2>
        {blog.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {blog.slice(0, 3).map((post) => (
                <Card 
                  key={post.id} 
                  className="group hover:shadow-xl transition cursor-pointer flex flex-col"
                  onClick={() => onNavigate(post.slug || '')}
                >
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg md:text-xl group-hover:text-primary transition">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button variant="ghost" className="w-full group-hover:bg-primary/10 transition">
                      Читать статью
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button 
                onClick={onNavigateToBlog} 
                size="lg"
                variant="outline"
                className="group"
              >
                Больше статей
                <Icon name="BookOpen" size={20} className="ml-2 group-hover:translate-x-1 transition" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Icon name="BookOpen" size={64} className="mx-auto mb-4 opacity-30" />
            <p>Статьи скоро появятся</p>
          </div>
        )}
      </div>
    </section>
  );
}