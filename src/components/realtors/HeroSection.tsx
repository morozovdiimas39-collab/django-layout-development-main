import Icon from '@/components/ui/icon';
import Image from '@/components/ui/image';
import PhoneForm from '@/components/PhoneForm';
import SeatsCounter from '@/components/ui/seats-counter';

interface HeroSectionProps {
  trialDate?: string;
  courseStartDate?: string;
}

export default function HeroSection({ trialDate, courseStartDate }: HeroSectionProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  return (
    <section className="pt-20 pb-0 px-4 md:pt-32 md:pb-0 md:px-4 relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="https://cdn.poehali.dev/projects/d006fe31-f11a-48d3-ba82-54149e58d318/files/829de8e6-6182-458d-9aa3-3afb8faa0acc.jpg"
          alt="Курс ораторского мастерства для риелторов"
          className="w-full h-full object-cover"
          eager={true}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70"></div>
        <div className="absolute bottom-0 inset-x-0 h-48 md:h-64 bg-gradient-to-t from-background to-transparent"></div>
      </div>
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl lg:max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 backdrop-blur-sm rounded-full text-primary font-semibold mb-4 md:mb-6 text-sm md:text-base border border-primary/20">
            <Icon name="Sparkles" size={16} className="md:w-5 md:h-5" />
            Курс с Ольгой Штерц
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            Ораторское мастерство для риелторов
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-3 md:mb-4">
            Уверенные презентации объектов, переговоры и выступления
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            Научитесь презентовать объекты убедительно, вести переговоры без страха и выступать перед клиентами и на мероприятиях. Курс публичных выступлений и техники речи для агентов недвижимости.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            {trialDate && (
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm md:text-base">
                <Icon name="Calendar" className="text-primary flex-shrink-0" size={18} />
                <span className="whitespace-nowrap">Пробное: {formatDate(trialDate)}</span>
              </div>
            )}
            {courseStartDate && (
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm md:text-base">
                <Icon name="PlayCircle" className="text-primary flex-shrink-0" size={18} />
                <span className="whitespace-nowrap">Старт: {formatDate(courseStartDate)}</span>
              </div>
            )}
          </div>
          <PhoneForm
            source="hero_realtors"
            course="oratory"
            triggerText="Записаться на пробный урок"
            triggerSize="lg"
            title="Запись на пробное занятие"
            description="Оставьте номер — пригласим на пробное занятие по ораторскому мастерству для риелторов"
            seatsCounter={trialDate && (
              <SeatsCounter trialDate={trialDate} maxSeats={10} minSeats={2} />
            )}
          />
        </div>
      </div>
    </section>
  );
}
