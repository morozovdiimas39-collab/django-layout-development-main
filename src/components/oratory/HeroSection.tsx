import Icon from '@/components/ui/icon';
import Image from '@/components/ui/image';
import PhoneForm from '@/components/PhoneForm';
import SeatsCounter from '@/components/ui/seats-counter';

const DEFAULT_HERO_TITLE = 'Курс ораторского мастерства в Москве от 3000 руб!';
const DEFAULT_HERO_SUBTITLE = 'Запишитесь на пробное занятие по ораторскому мастерству';
const DEFAULT_HERO_DESCRIPTION =
  'Профессиональный курс публичных выступлений от эксперта Ольги Штерц. Научитесь выступать уверенно, убедительно и харизматично. Проводите презентации, вдохновляйте аудиторию и становитесь лидером мнений!';

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

interface HeroSectionProps {
  trialDate?: string;
  courseStartDate?: string;
  telegramHref?: string;
}

export default function HeroSection({
  trialDate,
  courseStartDate,
  telegramHref,
}: HeroSectionProps) {
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
          alt="Студенты на курсе ораторского мастерства выступают перед аудиторией"
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
            {DEFAULT_HERO_TITLE}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-3 md:mb-4">
            {DEFAULT_HERO_SUBTITLE}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-8 whitespace-pre-line">
            {DEFAULT_HERO_DESCRIPTION}
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
          <div className="inline-flex flex-col gap-3">
            <PhoneForm 
              source="hero_oratory"
              course="oratory"
              triggerText="Записаться на пробный урок"
              triggerSize="lg"
              title="Запись на пробное занятие"
              description="Оставьте номер телефона, и мы пригласим вас на пробное занятие по ораторскому мастерству"
              telegramHref={telegramHref || 'https://t.me/kaz9999'}
              seatsCounter={trialDate && (
                <SeatsCounter 
                  trialDate={trialDate} 
                  maxSeats={10}
                  minSeats={2}
                />
              )}
            />
            <a
              href={telegramHref || 'https://t.me/kaz9999'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-lg px-5 py-3 text-base font-semibold text-white transition-colors bg-[#2CA5E0] hover:bg-[#1a96cc]"
            >
              <TelegramIcon />
              Канал курса в Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}