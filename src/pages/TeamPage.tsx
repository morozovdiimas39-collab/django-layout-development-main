import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhoneForm from "@/components/PhoneForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import { api, TeamMember } from "@/lib/api";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Наша команда - Профессиональные преподаватели | Школа актёрского
          мастерства
        </title>
        <meta
          name="description"
          content="Познакомьтесь с нашей командой профессиональных преподавателей ораторского искусства и актёрского мастерства. Опытные наставники для вашего развития."
        />
        <link
          rel="canonical"
          href="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/team"
        />
        <meta
          property="og:url"
          content="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/team"
        />
        <meta
          property="og:title"
          content="Команда преподавателей школы актёрского мастерства"
        />
      </Helmet>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/" },
          { name: "Команда", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/team" }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />

        <section className="pt-20 pb-12 px-4 md:pt-32 md:pb-20 md:px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
                Преподаватели{" "}
                <span className="text-primary">актёрского мастерства</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Профессионалы своего дела, которые помогут вам раскрыть
                потенциал
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12 md:py-20">
                <Icon
                  name="Loader2"
                  className="animate-spin mx-auto text-primary"
                  size={48}
                />
              </div>
            ) : team.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <Icon
                  name="Users"
                  className="mx-auto mb-4 text-muted-foreground"
                  size={64}
                />
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
                  Скоро здесь появится информация о нашей команде!
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
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

                <div className="bg-card p-6 md:p-12 rounded-2xl md:rounded-3xl max-w-2xl mx-auto text-center">
                  <Icon
                    name="GraduationCap"
                    size={40}
                    className="mx-auto mb-3 md:mb-4 text-primary md:w-12 md:h-12"
                  />
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                    Учитесь у лучших
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                    Запишитесь на курс и работайте с профессионалами
                  </p>
                  <PhoneForm
                    source="team_cta"
                    triggerText="Записаться на курс"
                    triggerClassName="w-full sm:w-auto"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}