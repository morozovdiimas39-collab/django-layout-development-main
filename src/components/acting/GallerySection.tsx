import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GalleryImage } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GallerySectionProps {
  gallery: GalleryImage[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
    setIsDialogOpen(true);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 px-4 md:py-20 md:px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Фото с обучения</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto">
          Атмосфера занятий, работа на камеру и первые успехи наших студентов
        </p>
        {gallery.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {gallery.map((image, index) => (
                <div 
                  key={image.id} 
                  className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => openImage(index)}
                >
                  <img
                    src={image.url}
                    alt={image.caption || 'Студенты на занятиях по актёрскому мастерству'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-4xl w-full p-0 bg-black/95">
                <div className="relative">
                  <img
                    src={gallery[selectedImageIndex]?.url}
                    alt={gallery[selectedImageIndex]?.caption || 'Студенты на занятиях по актёрскому мастерству'}
                    className="w-full h-auto max-h-[85vh] object-contain"
                  />
                  {gallery[selectedImageIndex]?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-center">{gallery[selectedImageIndex].caption}</p>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={goToPrevious}
                  >
                    <Icon name="ChevronLeft" size={32} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={goToNext}
                  >
                    <Icon name="ChevronRight" size={32} />
                  </Button>

                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      <Icon name="X" size={24} />
                    </Button>
                  </div>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    {selectedImageIndex + 1} / {gallery.length}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Icon name="Image" size={64} className="mx-auto mb-4 opacity-30" />
            <p>Галерея скоро появится</p>
          </div>
        )}
      </div>
    </section>
  );
}