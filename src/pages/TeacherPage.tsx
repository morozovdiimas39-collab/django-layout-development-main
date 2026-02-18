import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "@/components/ui/image";
import Icon from "@/components/ui/icon";
import PhoneForm from "@/components/PhoneForm";
import { Card, CardContent } from "@/components/ui/card";
import { api, TeamMember } from "@/lib/api";
import SchemaMarkup from "@/components/SchemaMarkup";
import { SITE_URL } from "@/lib/constants";

export default function TeacherPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const data = await api.gallery.getTeam();
      setTeam(data);
    } catch (error) {
      console.error("Error loading team:", error);
    } finally {
      setLoadingTeam(false);
    }
  };

  const achievements = [
    {
      icon: "Trophy",
      title: "Премия ТЕФИ-2012",
      description:
        "Теленовелла «Обручальное кольцо» — победитель премии ТЕФИ-2012 в номинации «Телевизионный художественный сериал – телероман»",
    },
    {
      icon: "Film",
      title: "Фильмография",
      description:
        "«След», «Дело врачей», «До суда», «Маруся», «Наши соседи», «Обручальное кольцо», «Принцесса цирка»",
    },
    {
      icon: "GraduationCap",
      title: "Образование",
      description:
        "ГИТИС (Режиссура драмы, с отличием), ВГИК (Высшие режиссерские курсы), курс АМЕДИА",
    },
    {
      icon: "Star",
      title: "Художественный руководитель",
      description:
        "Художественный руководитель центра подготовки актеров кино. Практикующий режиссёр.",
    },
  ];

  const experience = [
    {
      year: "2012",
      title: "Премия ТЕФИ",
      description:
        "Победитель национальной телевизионной премии ТЕФИ за режиссуру телесериала",
    },
    {
      year: "2010-2022",
      title: "Режиссёр федеральных телеканалов",
      description:
        "Работа над сериалами для Первого канала, НТВ, ТНТ. Более 1000 часов эфирного времени",
    },
    {
      year: "2015",
      title: "Основание школы актёрского мастерства",
      description:
        "Создание авторской методики обучения актёров для кино и театра",
    },
    {
      year: "2018",
      title: "Театральный режиссёр",
      description:
        "Постановка спектаклей в московских театрах. Работа с известными актёрами",
    },
    {
      year: "2020-н.в.",
      title: "Педагог актёрского мастерства",
      description:
        "Ведущий преподаватель курсов актёрского мастерства. Подготовка актёров для кино",
    },
  ];

  const methodology = [
    "Системный подход: от основ актёрской техники до профессиональной съёмки",
    "Практика на камеру с первого занятия — работа с реальным киношным оборудованием",
    "Личный опыт режиссуры: инсайды из работы над федеральными телесериалами",
    "Индивидуальный подход к каждому ученику с учётом его целей и задач",
    "Создание актёрской визитки (шоурила) для кастингов и проб",
    "Работа над короткометражным фильмом как финальный проект обучения",
  ];

  return (
    <>
      <Helmet>
        <title>
          Казбек Меретуков - Режиссёр и преподаватель актёрского мастерства |
          ТЕФИ-2012
        </title>
        <meta
          name="description"
          content="Казбек Меретуков - режиссёр-постановщик федеральных телесериалов, победитель премии ТЕФИ-2012, преподаватель актёрского мастерства. Опыт работы более 25 лет, более 500 учеников."
        />
        <link
          rel="canonical"
          href="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/teacher"
        />
        <meta
          property="og:url"
          content="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/teacher"
        />
        <meta
          property="og:title"
          content="Казбек Меретуков - Режиссёр и преподаватель"
        />
        <meta
          property="og:description"
          content="Режиссёр федеральных телесериалов, победитель ТЕФИ-2012"
        />
        <meta name="author" content="Казбек Меретуков" />
      </Helmet>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/" },
          { name: "Преподаватель", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/teacher" }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />

        <section className="pt-20 pb-12 px-4 md:pt-32 md:pb-20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Казбек <span className="text-primary">Меретуков</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                  Режиссёр-постановщик, обладатель премии ТЕФИ-2012
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {`Режиссёр-постановщик на сериальных проектах разных форматов и жанров, которые получили признание на каналах России, Украины, Белоруссии, Израиля.

Образование: ГИТИС (Режиссура драмы, окончил с отличием), ВГИК (Высшие режиссерские курсы повышения квалификации по специальности кинорежиссура), курс «Роль режиссера в производстве телесериалов» (кинокомпания АМЕДИА).

Фильмография: «След», «Дело врачей», «До суда», «Маруся», «Наши соседи», «Обручальное кольцо», «Принцесса цирка».

Теленовелла «Обручальное кольцо» — победитель премии ТЕФИ-2012 в номинации «Телевизионный художественный сериал – телероман».`}
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://st.business-key.com/i/files/45470/2024/02/1707986927.jpg"
                  alt="Казбек Меретуков - режиссёр-постановщик, обладатель премии ТЕФИ-2012"
                  className="w-full rounded-2xl shadow-2xl"
                  loading="eager"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition"
                >
                  <Icon
                    name={achievement.icon}
                    className="text-primary mb-4"
                    size={40}
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Профессиональный путь
              </h2>
              <div className="space-y-6">
                {experience.map((item, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-24 text-primary font-bold text-lg">
                      {item.year}
                    </div>
                    <div className="flex-1 border-l-2 border-primary/30 pl-6 pb-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Авторская методика обучения
              </h2>
              <ul className="space-y-4 mb-12">
                {methodology.map((item, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <Icon
                      name="CheckCircle"
                      className="text-primary flex-shrink-0 mt-1"
                      size={24}
                    />
                    <p className="text-base md:text-lg">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            {loadingTeam ? (
              <div className="text-center py-12 mb-16">
                <Icon
                  name="Loader2"
                  className="animate-spin mx-auto text-primary"
                  size={48}
                />
              </div>
            ) : (
              team.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                    Наша команда
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {team.map((member) => (
                      <Card
                        key={member.id}
                        className="group hover:shadow-xl transition-all duration-300"
                      >
                        <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                          {member.photo_url ? (
                            <img
                              src={member.photo_url}
                              alt={`${member.name} - ${member.role}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <Icon
                                name="User"
                                className="text-primary/30"
                                size={80}
                              />
                            </div>
                          )}
                        </div>
                        <CardContent className="pt-4 md:pt-6">
                          <h3 className="text-xl md:text-2xl font-bold mb-2">
                            {member.name}
                          </h3>
                          <p className="text-sm md:text-base text-primary font-semibold mb-3 md:mb-4">
                            {member.role}
                          </p>
                          {member.bio && (
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-4 whitespace-pre-line">
                              {member.bio}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            )}

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Запишитесь на курс
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Учитесь у практикующего режиссёра федеральных телесериалов
              </p>
              <PhoneForm
                source="teacher_page"
                course="acting"
                triggerText="Записаться на обучение"
                title="Запишитесь на курс актёрского мастерства"
                description="Оставьте номер телефона, и мы расскажем о программе обучения"
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Казбек Меретуков",
          jobTitle: "Режиссёр-постановщик, преподаватель актёрского мастерства",
          description:
            "Режиссёр федеральных телесериалов, победитель премии ТЕФИ-2012, преподаватель актёрского мастерства с опытом более 15 лет",
          award: "Премия ТЕФИ-2012 - Лучший режиссёр телесериала",
          alumniOf: "Российский институт театрального искусства (ГИТИС)",
          knowsAbout: [
            "Актёрское мастерство",
            "Режиссура",
            "Кинопроизводство",
            "Постановка сериалов",
            "Обучение актёров",
          ],
          url: `${SITE_URL}/teacher`,
          image:
            "https://st.business-key.com/i/files/45470/2024/02/1707986927.jpg",
          sameAs: [
            "https://www.kinopoisk.ru/name/2827460/",
            "https://www.instagram.com/kazbekmeretuko",
          ],
          worksFor: {
            "@type": "EducationalOrganization",
            name: "Школа актёрского мастерства Казбека Меретукова",
          },
        })}
      </script>
    </>
  );
}