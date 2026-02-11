import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const courses = [
    {
      icon: 'Dumbbell',
      title: 'Базовый курс',
      duration: '3 месяца',
      price: '89 000 ₽',
      description: 'Основы анатомии, физиологии, техника выполнения упражнений, составление программ тренировок',
      features: ['120 часов теории', '80 часов практики', 'Сертификат международного образца', 'Стажировка']
    },
    {
      icon: 'TrendingUp',
      title: 'Продвинутый курс',
      duration: '6 месяцев',
      price: '149 000 ₽',
      description: 'Спортивная биомеханика, продвинутая диетология, работа с травмами, реабилитация',
      features: ['240 часов теории', '160 часов практики', 'Диплом тренера', 'Гарантия трудоустройства']
    },
    {
      icon: 'Users',
      title: 'Групповой фитнес',
      duration: '2 месяца',
      price: '59 000 ₽',
      description: 'Методики групповых тренировок: аэробика, HIIT, функциональный тренинг, стретчинг',
      features: ['80 часов теории', '60 часов практики', 'Сертификат инструктора', 'Поддержка']
    },
    {
      icon: 'Heart',
      title: 'Нутрициология',
      duration: '1.5 месяца',
      price: '45 000 ₽',
      description: 'Основы питания для спортсменов, составление рационов, работа с различными целями',
      features: ['60 часов теории', '40 часов практики', 'Сертификат консультанта', 'Методички']
    }
  ];

  const advantages = [
    {
      icon: 'Award',
      title: 'Лицензия и аккредитация',
      description: 'Государственная лицензия на образовательную деятельность. Дипломы признаются по всей России и за рубежом'
    },
    {
      icon: 'Users',
      title: 'Практикующие эксперты',
      description: 'Преподаватели — мастера спорта, сертифицированные тренеры с опытом 10+ лет'
    },
    {
      icon: 'Briefcase',
      title: 'Трудоустройство',
      description: 'Помогаем с поиском работы. 87% выпускников находят работу в течение месяца после обучения'
    },
    {
      icon: 'Calendar',
      title: 'Гибкий график',
      description: 'Очное, онлайн и смешанное обучение. Занятия вечером и на выходных для работающих'
    },
    {
      icon: 'BookOpen',
      title: 'Современная база',
      description: 'Собственный тренажёрный зал с новым оборудованием, анатомический кабинет, библиотека'
    },
    {
      icon: 'Zap',
      title: 'Актуальная программа',
      description: 'Программа обновляется каждые 6 месяцев с учётом новейших исследований и трендов индустрии'
    }
  ];

  const reviews = [
    {
      name: 'Анна Сергеева',
      course: 'Базовый курс',
      rating: 5,
      text: 'Прошла базовый курс и уже через месяц нашла работу в крупном фитнес-клубе! Преподаватели — профессионалы своего дела, объясняют просто и понятно. Практики очень много.',
      date: 'Октябрь 2024'
    },
    {
      name: 'Дмитрий Волков',
      course: 'Продвинутый курс',
      rating: 5,
      text: 'Уже работал тренером, но хотел повысить квалификацию. Продвинутый курс — это совершенно другой уровень! Глубокие знания, работа с травмами, реабилитация. Теперь зарабатываю в 2 раза больше.',
      date: 'Сентябрь 2024'
    },
    {
      name: 'Мария Кузнецова',
      course: 'Групповой фитнес',
      rating: 5,
      text: 'Мечтала стать инструктором групповых программ. Курс превзошёл ожидания! Научили вести разные форматы тренировок, работать с музыкой, удерживать внимание группы. Сейчас веду 15 групп в неделю!',
      date: 'Август 2024'
    }
  ];

  const faqs = [
    {
      question: 'Нужно ли иметь опыт в фитнесе, чтобы пройти обучение?',
      answer: 'Нет, для базового курса предварительный опыт не требуется. Мы начинаем с основ и постепенно переходим к более сложным темам. Главное — желание учиться и интерес к фитнесу.'
    },
    {
      question: 'Какой документ я получу после окончания курса?',
      answer: 'После успешного окончания базового и продвинутого курсов вы получаете диплом о профессиональной переподготовке установленного образца. После специализированных курсов — сертификат. Все документы вносятся в федеральный реестр.'
    },
    {
      question: 'Можно ли учиться онлайн?',
      answer: 'Да, большинство курсов доступны в онлайн-формате. Теоретические занятия проходят в виде вебинаров, доступ к записям остаётся навсегда. Практические занятия можно пройти в любом нашем филиале по гибкому графику.'
    },
    {
      question: 'Есть ли рассрочка на обучение?',
      answer: 'Да, мы предоставляем беспроцентную рассрочку на 6-12 месяцев. Никаких переплат и скрытых комиссий. Также действуют скидки при единовременной оплате и для групп от 3 человек.'
    },
    {
      question: 'Поможете ли вы с трудоустройством?',
      answer: 'Обязательно! У нас есть партнёрские соглашения с более чем 50 фитнес-клубами и студиями. Лучших студентов мы рекомендуем напрямую работодателям. Также проводим мастер-классы по составлению резюме и прохождению собеседований.'
    }
  ];

  const stats = [
    { value: '2500+', label: 'Выпускников' },
    { value: '87%', label: 'Трудоустроено' },
    { value: '12 лет', label: 'На рынке' },
    { value: '4.9/5', label: 'Рейтинг' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Icon name="Dumbbell" size={24} className="text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                FitAcademy
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Главная', 'Курсы', 'О нас', 'Отзывы', 'FAQ', 'Контакты'].map((item, idx) => {
                const id = ['home', 'courses', 'about', 'reviews', 'faq', 'contact'][idx];
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(id)}
                    className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                      activeSection === id ? 'text-orange-600' : 'text-muted-foreground'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <Button onClick={() => scrollToSection('contact')} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              Записаться
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in">
            <Badge className="mb-6 bg-orange-100 text-orange-700 border-orange-200" variant="secondary">
              Лицензированная академия фитнеса
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Станьте фитнес-тренером
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Профессиональное обучение с государственным дипломом, практика в лучших клубах и помощь в трудоустройстве
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => scrollToSection('courses')} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                <Icon name="GraduationCap" size={20} className="mr-2" />
                Выбрать курс
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection('contact')} className="border-orange-300 hover:bg-orange-50">
                Получить консультацию
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Программы обучения</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Выберите курс, который соответствует вашим целям и уровню подготовки
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course, idx) => (
              <Card key={idx} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-orange-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon name={course.icon as any} size={28} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{course.price}</div>
                      <div className="text-sm text-muted-foreground">{course.duration}</div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                  <CardDescription className="text-base">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {course.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-sm">
                        <Icon name="CheckCircle2" size={18} className="text-orange-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700" onClick={() => scrollToSection('contact')}>
                    Записаться на курс
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Почему выбирают нас</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Мы создали оптимальные условия для вашего профессионального роста
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((advantage, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                    <Icon name={advantage.icon as any} size={24} className="text-white" />
                  </div>
                  <CardTitle className="mb-2">{advantage.title}</CardTitle>
                  <CardDescription className="text-base">{advantage.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Отзывы выпускников</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Истории людей, которые уже построили карьеру в фитнес-индустрии
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <CardTitle className="text-lg mb-1">{review.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{review.course}</Badge>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="Star" size={14} className="text-orange-500 fill-orange-500" />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-base italic">"{review.text}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">{review.date}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Частые вопросы</h2>
            <p className="text-muted-foreground text-lg">
              Ответы на вопросы о процессе обучения
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="bg-white border rounded-lg mb-3 px-6">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline hover:text-orange-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Начните карьеру тренера</h2>
            <p className="text-muted-foreground text-lg">
              Оставьте заявку, и мы расскажем о программах обучения и ответим на все вопросы
            </p>
          </div>
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имя *</label>
                    <Input placeholder="Ваше имя" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Телефон *</label>
                    <Input type="tel" placeholder="+7 (___) ___-__-__" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input type="email" placeholder="your@email.com" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Интересующий курс</label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                    <option>Базовый курс</option>
                    <option>Продвинутый курс</option>
                    <option>Групповой фитнес</option>
                    <option>Нутрициология</option>
                    <option>Пока не определился</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Комментарий</label>
                  <Textarea placeholder="Расскажите о вашем опыте в фитнесе, ожиданиях от обучения..." rows={4} />
                </div>
                <Button size="lg" className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить заявку
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="Dumbbell" size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold">FitAcademy</div>
              </div>
              <p className="text-white/80 text-sm">
                Профессиональное обучение фитнес-тренеров с 2012 года
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Курсы</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>Базовый курс</li>
                <li>Продвинутый курс</li>
                <li>Групповой фитнес</li>
                <li>Нутрициология</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Академия</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>О нас</li>
                <li>Преподаватели</li>
                <li>Лицензия</li>
                <li>Партнёры</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@fitacademy.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 789-01-23
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  Москва, ул. Спортивная, 15
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
            © 2024 FitAcademy. Лицензия № 040485. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
