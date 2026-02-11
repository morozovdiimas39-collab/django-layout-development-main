import Icon from '@/components/ui/icon';
import Image from '@/components/ui/image';
import PhoneForm from '@/components/PhoneForm';
import { formatDate } from '@/lib/dates';
import SeatsCounter from '@/components/ui/seats-counter';
import EditableContent from '@/components/EditableContent';

interface HeroSectionProps {
  content: Record<string, string>;
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="pt-20 pb-32 px-4 md:pt-32 md:pb-40 md:px-4 relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="https://cdn.poehali.dev/projects/d006fe31-f11a-48d3-ba82-54149e58d318/files/0c090e0f-2880-4f27-8c3e-d4c43afc5fda.jpg"
          alt="Курсы актёрского мастерства в Москве - обучение от режиссёра Казбека Меретукова"
          className="w-full h-full object-cover"
          eager={true}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-card"></div>
      </div>
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl lg:max-w-5xl">
          <EditableContent
            contentKey="acting_hero_title"
            defaultValue="Курсы актёрского мастерства в Москве за 3 месяца!"
            type="text"
            page="acting"
            section="hero"
            as="h1"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight"
          />
          <EditableContent
            contentKey="acting_hero_subtitle"
            defaultValue="Запишитесь на пробное занятие по актерскому мастерству"
            type="text"
            page="acting"
            section="hero"
            as="p"
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-3 md:mb-4"
          />
          <EditableContent
            contentKey="acting_hero_description"
            defaultValue="Профессиональное обучение от режиссера Казбека Меретукова. Преодолейте страх камеры, обретите уверенность и снимите свое настоящее кино с прослушиванием!"
            type="textarea"
            page="acting"
            section="hero"
            as="p"
            className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-8"
          />
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm md:text-base">
              <Icon name="Calendar" className="text-primary flex-shrink-0" size={18} />
              <span className="whitespace-nowrap">Пробное: {content.trial_date ? formatDate(content.trial_date) : '25 марта 2025'}</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm md:text-base">
              <Icon name="PlayCircle" className="text-primary flex-shrink-0" size={18} />
              <span className="whitespace-nowrap">Старт: {content.course_start_date ? formatDate(content.course_start_date) : '1 апреля 2025'}</span>
            </div>
          </div>
          <PhoneForm 
            source="hero_acting"
            course="acting"
            triggerText="Записаться на пробный урок"
            triggerSize="lg"
            title="Запись на пробное занятие"
            description="Оставьте номер телефона, и мы пригласим вас на пробное занятие"
            seatsCounter={content.trial_date && (
              <SeatsCounter 
                trialDate={content.trial_date} 
                maxSeats={12}
                minSeats={2}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
}