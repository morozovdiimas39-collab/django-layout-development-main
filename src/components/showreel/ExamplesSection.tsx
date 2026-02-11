import Icon from '@/components/ui/icon';
import { GalleryImage } from '@/lib/api';

interface ExamplesSectionProps {
  gallery: GalleryImage[];
}

export default function ExamplesSection({ gallery }: ExamplesSectionProps) {
  const showreelGallery = gallery.filter(img => img.category === 'showreel').slice(0, 6);

  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4 text-sm border border-primary/20">
            <Icon name="Play" size={16} />
            Примеры работ
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Визитки наших <span className="text-primary">выпускников</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Каждая визитка — это уникальная история актера, созданная с профессионализмом и душой
          </p>
        </div>

        {showreelGallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showreelGallery.map((item) => (
              <div 
                key={item.id}
                className="group relative rounded-2xl overflow-hidden aspect-video bg-card/50 hover:shadow-2xl transition-all duration-300"
              >
                <img 
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-white/80 text-sm">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                    <Icon name="Play" className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="rounded-2xl aspect-video bg-card/50 border border-primary/10 flex items-center justify-center"
              >
                <div className="text-center">
                  <Icon name="Video" className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Скоро появятся примеры</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
