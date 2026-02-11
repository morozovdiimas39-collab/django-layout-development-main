import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import PhoneForm from './PhoneForm';
import { useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [phone, setPhone] = useState('+7 (999) 123-45-67');
  const [instagram, setInstagram] = useState('https://instagram.com/');
  const [youtube, setYoutube] = useState('https://youtube.com/');
  const [telegram, setTelegram] = useState('https://t.me/');
  const [whatsapp, setWhatsapp] = useState('https://wa.me/');
  const location = useLocation();

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

  const menuItems = [
    { href: '/', label: 'Главная' },
    { href: '/teacher', label: 'О преподавателях' },
    { href: '/contacts', label: 'Контакты' },
    { href: '/blog', label: 'Блог' }
  ];

  const courseItems = [
    { href: '/acting', label: 'Актерское мастерство', description: 'Обучение актёрскому мастерству, работа на камеру' },
    { href: '/oratory', label: 'Ораторское искусство', description: 'Развитие навыков публичных выступлений' },
    { href: '/acting-cards', label: 'Актерские визитки', description: 'Профессиональная съемка визиток с режиссером' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <a href="/" className="flex items-center hover:opacity-80 transition">
          <img 
            src="https://i.1.creatium.io/disk2/c6/65/76/a52e2f86d1891f143cdb23e60a4460b61f/184x67/w_logo_text.svg" 
            alt="Логотип школы актёрского мастерства Казбека Меретукова" 
            className="h-8 sm:h-10 md:h-12"
            loading="eager"
          />
        </a>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <a
            href="/"
            className={`text-sm lg:text-base hover:text-primary transition ${
              location.pathname === '/' ? 'text-primary font-semibold' : ''
            }`}
          >
            Главная
          </a>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm lg:text-base bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground">
                  Курсы
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-2 p-3">
                    {courseItems.map((course) => (
                      <li key={course.href}>
                        <NavigationMenuLink asChild>
                          <a
                            href={course.href}
                            className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                              location.pathname === course.href ? 'bg-accent text-accent-foreground font-semibold' : ''
                            }`}
                          >
                            <div className="text-sm font-medium leading-none">{course.label}</div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                              {course.description}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {menuItems.slice(1).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm lg:text-base hover:text-primary transition ${
                location.pathname === item.href ? 'text-primary font-semibold' : ''
              }`}
            >
              {item.label}
            </a>
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
                <a
                  href="/"
                  onClick={() => setOpen(false)}
                  className={`text-lg hover:text-primary transition p-3 rounded-lg hover:bg-muted ${
                    location.pathname === '/' ? 'text-primary font-semibold bg-muted' : ''
                  }`}
                >
                  Главная
                </a>
                <div>
                  <button
                    onClick={() => setCoursesOpen(!coursesOpen)}
                    className="w-full flex items-center justify-between text-lg hover:text-primary transition p-3 rounded-lg hover:bg-muted"
                  >
                    <span>Курсы</span>
                    <Icon name={coursesOpen ? "ChevronUp" : "ChevronDown"} size={20} />
                  </button>
                  {coursesOpen && (
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {courseItems.map((course) => (
                        <a
                          key={course.href}
                          href={course.href}
                          onClick={() => setOpen(false)}
                          className={`text-base hover:text-primary transition p-3 rounded-lg hover:bg-muted ${
                            location.pathname === course.href ? 'text-primary font-semibold bg-muted' : ''
                          }`}
                        >
                          {course.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {menuItems.slice(1).map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`text-lg hover:text-primary transition p-3 rounded-lg hover:bg-muted ${
                      location.pathname === item.href ? 'text-primary font-semibold bg-muted' : ''
                    }`}
                  >
                    {item.label}
                  </a>
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