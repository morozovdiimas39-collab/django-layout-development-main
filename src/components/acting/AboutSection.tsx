interface AboutSectionProps {
  content: Record<string, string>;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const kazbekPhoto = "https://st.business-key.com/i/files/45470/2024/02/1707986927.jpg";
  const kazbekName = content.acting_about_name || "Казбек Меретуков";
  const kazbekInfo = [
    {
      title: content.acting_about_title_0 || "Режиссёр-постановщик телесериалов",
      text:
        content.acting_about_text_0 ||
        "Режиссёр-постановщик на сериальных проектах разных форматов и жанров, которые получили признание на каналах России, Украины, Белоруссии, Израиля. Снял проекты: «След», «Дело врачей», «До суда», «Маруся», «Наши соседи», «Обручальное кольцо», «Принцесса цирка»."
    },
    {
      title: content.acting_about_title_1 || "Образование и квалификация",
      text:
        content.acting_about_text_1 ||
        "ГИТИС. Режиссура драмы. Окончил с отличием. ВГИК. Высшие режиссерские курсы повышения квалификации по специальности кинорежиссура. Прошел курс «Роль режиссера в производстве телесериалов» в кинокомпании АМЕДИА."
    },
    {
      title: content.acting_about_title_2 || "Художественный руководитель центра",
      text:
        content.acting_about_text_2 ||
        "Художественный руководитель центра подготовки актеров кино. Теленовелла «Обручальное кольцо» — победитель премии ТЕФИ-2012 в номинации «Телевизионный художественный сериал – телероман»."
    }
  ];

  return (
    <section id="about" className="py-12 px-4 md:py-20 md:px-4 bg-gradient-to-br from-primary/5 via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary-rgb),0.08),transparent_50%)]"></div>
      
      <div className="container mx-auto relative z-10">


        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center max-w-6xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-[350px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={kazbekPhoto}
                alt="Казбек Меретуков - режиссёр телесериалов, победитель ТЕФИ-2012, преподаватель актёрского мастерства"
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                loading="lazy"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{kazbekName}</h3>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </div>
            
            <div className="space-y-6">
              {kazbekInfo.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-lg md:text-xl font-semibold text-primary">{item.title}</h4>
                  <p className="text-base leading-relaxed text-foreground/90">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}