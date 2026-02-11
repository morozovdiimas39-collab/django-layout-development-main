interface VideoSectionProps {
  content: Record<string, string>;
}

export default function VideoSection({ content }: VideoSectionProps) {

  return (
    <section className="py-12 px-4 md:py-20 md:px-4 bg-card -mt-24 md:-mt-32 pt-24 md:pt-32">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Что вам мешает стать <span className="text-primary">актёром?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Узнайте, как за 3 месяца преодолеть страх и выйти на сцену
          </p>
        </div>
        
        <div className="aspect-video w-full md:max-w-4xl md:mx-auto md:rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src="https://player.vimeo.com/video/997327815?h=da8107aa0b"
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
            title="Видео о курсе"
          ></iframe>
        </div>
      </div>
    </section>
  );
}