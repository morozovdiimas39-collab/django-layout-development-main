import Icon from '@/components/ui/icon';
import PhoneForm from '@/components/PhoneForm';

export default function HeroSection() {
  return (
    <section className="pt-20 pb-32 px-4 md:pt-32 md:pb-40 md:px-4 relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/50 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full text-primary font-semibold mb-6 text-sm md:text-base border border-primary/20">
            <Icon name="Video" size={20} />
            Профессиональная актерская визитка
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Ваша визитная карточка <span className="text-primary">в мир кино</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4">
            Создайте профессиональную видеовизитку с режиссером <span className="text-primary font-semibold">Казбеком Меретуковым</span>
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Победитель ТЕФИ-2012, режиссер-постановщик телесериалов поможет вам создать showreel, 
            который откроет двери в кастинги и продюсерские центры
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
              <Icon name="Camera" className="w-8 h-8 text-primary mb-3 mx-auto" />
              <div className="text-2xl font-bold text-primary mb-1">1-2 дня</div>
              <div className="text-sm text-muted-foreground">Съемка на профессиональную технику</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
              <Icon name="Film" className="w-8 h-8 text-primary mb-3 mx-auto" />
              <div className="text-2xl font-bold text-primary mb-1">3-5 минут</div>
              <div className="text-sm text-muted-foreground">Идеальная длительность визитки</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
              <Icon name="Award" className="w-8 h-8 text-primary mb-3 mx-auto" />
              <div className="text-2xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Ваш уникальный стиль</div>
            </div>
          </div>

          <div className="flex justify-center">
            <PhoneForm 
              source="hero_showreel"
              course="showreel"
              triggerText="Записаться на консультацию"
              triggerSize="lg"
              title="Запись на консультацию"
              description="Оставьте номер телефона, и мы расскажем о создании вашей актерской визитки"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
