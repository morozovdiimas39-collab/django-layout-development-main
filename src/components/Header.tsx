'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import PhoneForm from './PhoneForm';
import { api } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [actingSubOpen, setActingSubOpen] = useState(false);
  /** Десктоп: подменю «актерское → пробное», открытие по наведению; клик по строке — страница курса */
  const [actingFlyoutOpen, setActingFlyoutOpen] = useState(false);
  const actingFlyoutCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phone, setPhone] = useState('+7 (999) 123-45-67');
  const [instagram, setInstagram] = useState('https://instagram.com/');
  const [youtube, setYoutube] = useState('https://youtube.com/');
  const [telegram, setTelegram] = useState('https://t.me/');
  const [whatsapp, setWhatsapp] = useState('https://wa.me/');
  const pathname = usePathname() ?? '';
  const router = useRouter();

  useEffect(() => {
    api.content.getAll().then((data) => {
      data.forEach(item => {
        if (item.key === 'phone') setPhone(item.value);
        if (item.key === 'instagram_url') setInstagram(item.value);
        if (item.key === 'youtube_url') setYoutube(item.value);
        if (item.key === 'telegram_url') setTelegram(item.value);
        if (item.key === 'whatsapp_url') setWhatsapp(item.value);
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setActingSubOpen(pathname.startsWith('/acting'));
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (actingFlyoutCloseTimer.current) clearTimeout(actingFlyoutCloseTimer.current);
    };
  }, []);

  const clearActingFlyoutTimer = () => {
    if (actingFlyoutCloseTimer.current) {
      clearTimeout(actingFlyoutCloseTimer.current);
      actingFlyoutCloseTimer.current = null;
    }
  };

  const openActingFlyout = () => {
    clearActingFlyoutTimer();
    setActingFlyoutOpen(true);
  };

  const scheduleCloseActingFlyout = () => {
    clearActingFlyoutTimer();
    actingFlyoutCloseTimer.current = setTimeout(() => setActingFlyoutOpen(false), 240);
  };

  const menuItems = [
    { href: '/', label: 'Главная' },
    { href: '/teacher', label: 'О преподавателях' },
    { href: '/contacts', label: 'Контакты' },
    { href: '/blog', label: 'Блог' }
  ];

  const courseItems: {
    href: string;
    label: string;
    description: string;
    trial?: { href: string; label: string; description: string };
  }[] = [
    {
      href: '/acting',
      label: 'Актерское мастерство',
      description: 'Обучение актёрскому мастерству, работа на камеру',
      trial: {
        href: '/acting/probnoe',
        label: 'Пробное занятие',
        description: 'Тот же зал и преподаватель — без оплаты за первый визит',
      },
    },
    { href: '/oratory', label: 'Ораторское искусство', description: 'Развитие навыков публичных выступлений' },
    { href: '/acting-cards', label: 'Актерские визитки', description: 'Профессиональная съемка визиток с режиссером' },
  ];

  const isCourseActive = (href: string) =>
    href === '/acting' ? pathname === '/acting' || pathname.startsWith('/acting/') : pathname === href;

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition">
          <img 
            src="https://i.1.creatium.io/disk2/c6/65/76/a52e2f86d1891f143cdb23e60a4460b61f/184x67/w_logo_text.svg" 
            alt="Логотип школы актёрского мастерства Казбека Меретукова" 
            width={184}
            height={67}
            className="h-8 sm:h-10 md:h-12 w-auto"
            loading="eager"
            fetchPriority="high"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link
            href="/"
            className={`text-sm lg:text-base hover:text-primary transition ${
              pathname === '/' ? 'text-primary font-semibold' : ''
            }`}
          >
            Главная
          </Link>
          <DropdownMenu
            modal={false}
            onOpenChange={(mainOpen) => {
              if (!mainOpen) {
                clearActingFlyoutTimer();
                setActingFlyoutOpen(false);
              }
            }}
          >
            <DropdownMenuTrigger
              className={cn(
                'inline-flex h-10 items-center gap-1 rounded-md px-3 py-2 text-sm lg:text-base font-medium outline-none',
                'bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground',
                'focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              Курсы
              <Icon name="ChevronDown" size={14} className="opacity-70" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[340px] p-2 overflow-visible" sideOffset={6}>
              {courseItems.map((course) => {
                const active = isCourseActive(course.href);
                const trialActive = course.trial && pathname === course.trial.href;

                if (course.trial) {
                  return (
                    <DropdownMenuSub
                      key={course.href}
                      open={actingFlyoutOpen}
                      onOpenChange={(next) => {
                        if (next) {
                          clearActingFlyoutTimer();
                          setActingFlyoutOpen(true);
                        } else {
                          clearActingFlyoutTimer();
                          setActingFlyoutOpen(false);
                        }
                      }}
                    >
                      <DropdownMenuSubTrigger
                        className={cn(
                          'w-full rounded-md border border-border/40 bg-card/30 px-0 py-0 h-auto min-h-[4.5rem]',
                          'flex !flex-row flex-nowrap items-stretch gap-0 text-left outline-none cursor-pointer',
                          'text-popover-foreground',
                          'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
                          'focus:bg-accent focus:text-accent-foreground',
                          '[&>svg:last-child]:shrink-0 [&>svg:last-child]:self-center [&>svg:last-child]:mr-2',
                          (active || trialActive) && 'bg-accent text-accent-foreground'
                        )}
                        onPointerEnter={openActingFlyout}
                        onPointerLeave={scheduleCloseActingFlyout}
                        onClick={() => {
                          clearActingFlyoutTimer();
                          setActingFlyoutOpen(false);
                          router.push(course.href);
                        }}
                      >
                        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-3 text-left">
                          <span className="text-sm font-semibold leading-snug text-inherit">{course.label}</span>
                          <span className="text-xs leading-snug line-clamp-2 text-inherit opacity-80 [text-wrap:pretty]">
                            {course.description}
                          </span>
                        </span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent
                        side="right"
                        align="start"
                        sideOffset={8}
                        alignOffset={-4}
                        className="z-[200] w-[min(18rem,calc(100vw-1.5rem))] overflow-visible p-2 shadow-xl"
                        onPointerEnter={openActingFlyout}
                        onPointerLeave={scheduleCloseActingFlyout}
                      >
                        <DropdownMenuItem asChild className="p-0 h-auto min-h-0 cursor-pointer rounded-sm focus:bg-transparent">
                          <Link
                            href={course.trial.href}
                            className={cn(
                              '!grid w-full grid-cols-1 gap-1 px-3 py-2.5 text-left no-underline outline-none transition-colors',
                              'text-popover-foreground',
                              'hover:bg-accent hover:text-accent-foreground',
                              'focus-visible:bg-accent focus-visible:text-accent-foreground',
                              'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                              trialActive && 'bg-primary/15 text-foreground'
                            )}
                          >
                            <span className="text-sm font-semibold text-inherit">{course.trial.label}</span>
                            <span className="text-xs leading-snug line-clamp-2 text-inherit opacity-80">
                              {course.trial.description}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  );
                }

                return (
                  <DropdownMenuItem key={course.href} asChild className="p-0 h-auto cursor-pointer focus:bg-transparent">
                    <Link
                      href={course.href}
                      className={cn(
                        'group !grid w-full grid-cols-1 gap-1 rounded-md border border-border/40 bg-card/30 p-3 no-underline outline-none transition-colors',
                        'text-popover-foreground',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus-visible:bg-accent focus-visible:text-accent-foreground',
                        'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                        active && 'bg-accent text-accent-foreground font-semibold'
                      )}
                    >
                      <span className="text-sm font-semibold leading-snug text-inherit">{course.label}</span>
                      <span className="line-clamp-2 text-xs leading-snug text-inherit opacity-80">
                        {course.description}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          {menuItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm lg:text-base hover:text-primary transition ${
                pathname === item.href ? 'text-primary font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a 
            href={`tel:${phone.replace(/\D/g, '')}`} 
            className="hidden lg:flex items-center gap-2 text-sm font-medium hover:text-primary transition"
          >
            <Icon name="Phone" size={16} />
            <span className="text-xs lg:text-sm">{phone}</span>
          </a>
          <PhoneForm 
            source="header" 
            triggerText="Записаться"
            triggerClassName="hidden sm:flex text-sm"
          />
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Icon name="Menu" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={`text-lg hover:text-primary transition p-3 rounded-lg hover:bg-muted ${
                    pathname === '/' ? 'text-primary font-semibold bg-muted' : ''
                  }`}
                >
                  Главная
                </Link>
                <div>
                  <button
                    onClick={() => setCoursesOpen(!coursesOpen)}
                    className="w-full flex items-center justify-between text-lg hover:text-primary transition p-3 rounded-lg hover:bg-muted"
                  >
                    <span>Курсы</span>
                    <Icon name={coursesOpen ? "ChevronUp" : "ChevronDown"} size={20} />
                  </button>
                  {coursesOpen && (
                    <div className="ml-4 mt-2 flex flex-col gap-1">
                      {courseItems.map((course) =>
                        course.trial ? (
                          <Collapsible
                            key={course.href}
                            open={actingSubOpen}
                            onOpenChange={setActingSubOpen}
                            className="flex flex-col gap-0"
                          >
                            <CollapsibleTrigger
                              className={cn(
                                'w-full flex items-start justify-between gap-2 text-left rounded-lg p-3 hover:bg-muted',
                                'text-base hover:text-primary transition',
                                isCourseActive(course.href) && 'text-primary font-semibold bg-muted/80'
                              )}
                            >
                              <span className="min-w-0">
                                <span className="block font-semibold">{course.label}</span>
                                <span className="block text-xs text-muted-foreground font-normal mt-1 leading-snug">
                                  {course.description}
                                </span>
                              </span>
                              <Icon
                                name="ChevronDown"
                                size={20}
                                className={cn('shrink-0 mt-0.5 transition-transform', actingSubOpen && 'rotate-180')}
                              />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-3 ml-1 border-l-2 border-primary/35 space-y-1 pb-1">
                              <Link
                                href={course.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  'block rounded-md py-2.5 px-3 text-sm hover:bg-muted transition',
                                  pathname === course.href && pathname !== course.trial.href
                                    ? 'text-primary font-semibold bg-muted'
                                    : 'text-foreground'
                                )}
                              >
                                Программа курса
                              </Link>
                              <Link
                                href={course.trial.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  'block rounded-md py-2.5 px-3 text-sm hover:bg-muted transition',
                                  pathname === course.trial.href ? 'text-primary font-semibold bg-muted' : 'text-foreground'
                                )}
                              >
                                <span className="font-medium block">{course.trial.label}</span>
                                <span className="text-xs text-muted-foreground mt-1 block leading-snug">
                                  {course.trial.description}
                                </span>
                              </Link>
                            </CollapsibleContent>
                          </Collapsible>
                        ) : (
                          <Link
                            key={course.href}
                            href={course.href}
                            onClick={() => setOpen(false)}
                            className={`text-base hover:text-primary transition p-3 rounded-lg hover:bg-muted ${
                              isCourseActive(course.href) ? 'text-primary font-semibold bg-muted' : ''
                            }`}
                          >
                            {course.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
                {menuItems.slice(1).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`text-lg hover:text-primary transition p-3 rounded-lg hover:bg-muted ${
                      pathname === item.href ? 'text-primary font-semibold bg-muted' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t border-border">
                  <PhoneForm 
                    source="mobile_menu" 
                    triggerText="Записаться на курс"
                    triggerClassName="w-full"
                  />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}