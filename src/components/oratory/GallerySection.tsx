import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { GalleryImage } from '@/lib/api';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface GallerySectionProps {
  gallery: GalleryImage[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (gallery.length === 0) return null;

  const openImage = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const nextImage = () => {
    const newIndex = (selectedIndex + 1) % gallery.length;
    setSelectedIndex(newIndex);
    setSelectedImage(gallery[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (selectedIndex - 1 + gallery.length) % gallery.length;
    setSelectedIndex(newIndex);
    setSelectedImage(gallery[newIndex]);
  };

  return (
    <>
      <section className="py-12 px-4 md:py-20 md:px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Галерея</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {gallery.map((image, index) => (
              <div 
                key={image.id} 
                className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => openImage(image, index)}
              >
                <img
                  src={image.url}
                  alt={image.caption || 'Студенты на курсе ораторского мастерства'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
          <VisuallyHidden>
            <DialogTitle>Просмотр изображения</DialogTitle>
            <DialogDescription>Галерея изображений курса</DialogDescription>
          </VisuallyHidden>
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={prevImage}
                className="absolute left-2 md:left-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-colors"
              >
                <Icon name="ChevronLeft" size={24} />
              </button>
              <img
                src={selectedImage.url}
                alt={selectedImage.caption || 'Студенты на курсе ораторского мастерства'}
                className="max-w-full max-h-[95vh] object-contain"
              />
              <button
                onClick={nextImage}
                className="absolute right-2 md:right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-colors"
              >
                <Icon name="ChevronRight" size={24} />
              </button>
              {selectedImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                  {selectedImage.caption}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}