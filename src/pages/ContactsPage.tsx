import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhoneForm from "@/components/PhoneForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import { api, SiteContent } from "@/lib/api";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function ContactsPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const data = await api.content.getAll();
      const contentMap: Record<string, string> = {};
      data.forEach((item: SiteContent) => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: "MapPin",
      title: "Адрес",
      value: content.address || "Москва",
      link: null,
    },
    {
      icon: "Phone",
      title: "Телефон",
      value: content.phone || "+7 (999) 123-45-67",
      link: `tel:${(content.phone || "").replace(/\D/g, "")}`,
    },
    {
      icon: "Clock",
      title: "Режим работы",
      value: content.working_hours || "Ежедневно: 10:00 - 21:00",
      link: null,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Контакты - Свяжитесь с нами | Школа актёрского мастерства</title>
        <meta
          name="description"
          content="Свяжитесь с нами удобным способом. Контактная информация школы актёрского мастерства: адрес, телефон, email и режим работы."
        />
        <link
          rel="canonical"
          href="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/contacts"
        />
        <meta
          property="og:url"
          content="https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/contacts"
        />
        <meta
          property="og:title"
          content="Контакты школы актёрского мастерства"
        />
      </Helmet>
      <SchemaMarkup
        type="breadcrumbs"
        breadcrumbs={[
          { name: "Главная", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/" },
          { name: "Контакты", url: "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai/contacts" }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Breadcrumbs />

        <section className="pt-20 pb-12 px-4 md:pt-32 md:pb-20 md:px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
                <span className="text-primary">Контакты</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Свяжитесь с нами удобным для вас способом
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
            ) : (
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                    Как нас найти
                  </h2>

                  <div className="grid gap-4 md:gap-6">
                    {contactInfo.map((item, index) => (
                      <Card
                        key={index}
                        className="group hover:shadow-lg transition"
                      >
                        <CardContent className="p-4 md:p-6 flex items-start gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon
                              name={item.icon}
                              className="text-primary"
                              size={20}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 text-sm md:text-base">
                              {item.title}
                            </h3>
                            {item.link ? (
                              <a
                                href={item.link}
                                className="text-sm md:text-base text-muted-foreground hover:text-primary transition block"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p className="text-sm md:text-base text-muted-foreground">
                                {item.value}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="p-6 md:p-8 text-center">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                        Запишитесь на курс
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                        Оставьте номер телефона, и мы свяжемся с вами в
                        ближайшее время
                      </p>
                      <PhoneForm
                        source="contacts_cta"
                        triggerText="Оставить заявку"
                        triggerClassName="w-full"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                    Мы на карте
                  </h2>

                  <div className="aspect-[4/3] lg:aspect-auto lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                    <iframe
                      src="https://yandex.ru/map-widget/v1/?um=constructor%3A09c1aac3e1943f51198d94201d94d3d89db9eabc6caae19fa171fc991556a8ae&amp;source=constructorLink"
                      className="w-full h-full"
                      frameBorder="0"
                      title="Карта расположения школы"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}