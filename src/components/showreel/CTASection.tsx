import Icon from '@/components/ui/icon';
import PhoneForm from '@/components/PhoneForm';

export default function CTASection() {
  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-6 text-sm border border-primary/20">
            <Icon name="Rocket" size={16} />
            Начните прямо сейчас
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Готовы создать свою <span className="text-primary">визитку мечты?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Запишитесь на консультацию с режиссером Казбеком Меретуковым. 
            Обсудим ваши цели, типаж и концепцию визитки. Первая консультация — бесплатно!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <PhoneForm 
              source="cta_showreel"
              course="showreel"
              triggerText="Записаться на консультацию"
              triggerSize="lg"
              title="Бесплатная консультация"
              description="Оставьте номер телефона, и мы свяжемся с вами в ближайшее время"
            />
            <a 
              href="tel:+79283161248"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon name="Phone" size={20} />
              <span>+7 (928) 316-12-48</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon name="Clock" className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Быстрый старт в течение недели</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon name="Shield" className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Гарантия качества и результата</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon name="Headphones" className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Поддержка на всех этапах</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
