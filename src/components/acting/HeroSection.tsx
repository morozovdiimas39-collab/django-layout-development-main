import Link from 'next/link';
import Icon from '@/components/ui/icon';
import Image from '@/components/ui/image';
import PhoneForm from '@/components/PhoneForm';
import { formatDate } from '@/lib/dates';
import SeatsCounter from '@/components/ui/seats-counter';

const DEFAULT_HERO_TITLE = 'Курс актёрского мастерства в Москве от 3000 руб! 3 месяца';
const DEFAULT_HERO_SUBTITLE = 'Запишитесь на пробное занятие по актерскому мастерству';
const DEFAULT_HERO_DESCRIPTION =
  'Профессиональное обучение от режиссера Казбека Меретукова. Преодолейте страх камеры, обретите уверенность и снимите свое настоящее кино с прослушиванием!';

const TRIAL_HERO_TITLE = 'Пробное занятие по актерскому мастерству в Москве!';
const TRIAL_HERO_SUBTITLE = '';
const TRIAL_HERO_DESCRIPTION =
  'На занятии вы познакомитесь с преподавателем и группой, узнаете несколько рабочих секретов актёрского мастерства, погрузитесь в процесс и поймёте, подходит ли вам этот формат обучения.';

interface HeroSectionProps {
  content: Record<string, string>;
  /** Страница пробного: как основной курс по визуалу, другой текст и ссылка на полный курс */
  variant?: 'acting' | 'trial';
}

export default function HeroSection({ content, variant = 'acting' }: HeroSectionProps) {
  const telegramHref = content.acting_telegram_url || content.telegram_url || 'https://t.me/meretukovbot';
  const isTrial = variant === 'trial';

  return (
    <section className="pt-20 pb-32 px-4 md:pt-32 md:pb-40 md:px-4 relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="https://cdn.poehali.dev/projects/d006fe31-f11a-48d3-ba82-54149e58d318/files/0c090e0f-2880-4f27-8c3e-d4c43afc5fda.jpg"
          alt={
            isTrial
              ? 'Пробное занятие по актерскому мастерству в Москве — школа Казбека Меретукова'
              : 'Курсы актерского мастерства Москва — занятия актерским мастерством, школа Казбека Меретукова'
          }
          className="w-full h-full object-cover"
          eager={true}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-card"></div>
      </div>
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl lg:max-w-5xl">
          {isTrial && (
            <p className="text-sm font-medium text-primary mb-4">
              <Link href="/acting" className="hover:underline inline-flex items-center gap-1">
                ← Полная программа курса актёрского мастерства
              </Link>
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            {isTrial ? TRIAL_HERO_TITLE : DEFAULT_HERO_TITLE}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-3 md:mb-4">
            {isTrial ? TRIAL_HERO_SUBTITLE : DEFAULT_HERO_SUBTITLE}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            {isTrial ? TRIAL_HERO_DESCRIPTION : DEFAULT_HERO_DESCRIPTION}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm md:text-base">
              <Icon name="Calendar" className="text-primary flex-shrink-0" size={18} />
              <span className="whitespace-nowrap">Пробное: {content.trial_date ? formatDate(content.trial_date) : 'дата уточняется'}</span>
            </div>
            {content.course_start_date && (
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm md:text-base">
                <Icon name="PlayCircle" className="text-primary flex-shrink-0" size={18} />
                <span className="whitespace-nowrap">Старт: {formatDate(content.course_start_date)}</span>
              </div>
            )}
          </div>
          <div className="inline-flex flex-col gap-3">
            <PhoneForm 
              source={isTrial ? 'hero_acting_trial' : 'hero_acting'}
              course="acting"
              triggerText={isTrial ? 'Записаться на пробное занятие' : 'Записаться на пробный урок'}
              triggerSize="lg"
              title={isTrial ? 'Запись на пробное занятие' : 'Запись на пробное занятие'}
              description={
                isTrial
                  ? 'Оставьте номер — пригласим на пробное в том же формате, что и основной курс'
                  : 'Оставьте номер телефона, и мы пригласим вас на пробное занятие'
              }
              telegramHref={telegramHref}
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
      </div>
    </section>
  );
}