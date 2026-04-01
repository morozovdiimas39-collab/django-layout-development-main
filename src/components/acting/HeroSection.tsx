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

const TRIAL_HERO_TITLE = 'Бесплатное пробное занятие по актёрскому мастерству в Москве';
const TRIAL_HERO_SUBTITLE = 'Тот же зал, преподаватель и формат, что и на основном курсе — без оплаты за первый визит';
const TRIAL_HERO_DESCRIPTION =
  'Приходите познакомиться со школой, группой и режиссёром Казбеком Меретуковым. Короткая работа в зале, ответы на вопросы — и решение, идти ли в полную программу курса.';

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

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
              ? 'Бесплатное пробное занятие по актёрскому мастерству в Москве — школа Казбека Меретукова'
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
            {!isTrial && (
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm md:text-base">
                <Icon name="PlayCircle" className="text-primary flex-shrink-0" size={18} />
                <span className="whitespace-nowrap">Старт: {content.course_start_date ? formatDate(content.course_start_date) : 'дата уточняется'}</span>
              </div>
            )}
            {isTrial && (
              <Link
                href="/acting"
                className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm md:text-base hover:bg-card transition-colors"
              >
                <Icon name="GraduationCap" className="text-primary flex-shrink-0" size={18} />
                <span className="whitespace-nowrap">Полный курс — программа и сроки</span>
              </Link>
            )}
          </div>
          <div className="inline-flex flex-col gap-3">
            <PhoneForm 
              source={isTrial ? 'hero_acting_trial' : 'hero_acting'}
              course="acting"
              triggerText={isTrial ? 'Записаться на бесплатное пробное' : 'Записаться на пробный урок'}
              triggerSize="lg"
              title={isTrial ? 'Запись на бесплатное пробное' : 'Запись на пробное занятие'}
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
            {telegramHref && (
              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-lg px-5 py-3 text-base font-semibold text-white transition-colors bg-[#2CA5E0] hover:bg-[#1a96cc]"
              >
                <TelegramIcon />
                Канал курса в Telegram
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}