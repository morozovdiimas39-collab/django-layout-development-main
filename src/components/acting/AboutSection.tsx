import Icon from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { TeamMember } from '@/lib/api';
import EditableContent from '@/components/EditableContent';

interface AboutSectionProps {
  content: Record<string, string>;
  team: TeamMember[];
}

export default function AboutSection({ content, team }: AboutSectionProps) {
  const kazbekPhoto = "https://st.business-key.com/i/files/45470/2024/02/1707986927.jpg";
  const kazbekName = "Казбек Меретуков";
  const kazbekInfo = [
    {
      title: "Режиссёр-постановщик телесериалов",
      text: "Режиссёр-постановщик на сериальных проектах разных форматов и жанров, которые получили признание на каналах России, Украины, Белоруссии, Израиля. Снял проекты: «След», «Дело врачей», «До суда», «Маруся», «Наши соседи», «Обручальное кольцо», «Принцесса цирка»."
    },
    {
      title: "Образование и квалификация",
      text: "ГИТИС. Режиссура драмы. Окончил с отличием. ВГИК. Высшие режиссерские курсы повышения квалификации по специальности кинорежиссура. Прошел курс «Роль режиссера в производстве телесериалов» в кинокомпании АМЕДИА."
    },
    {
      title: "Художественный руководитель центра",
      text: "Художественный руководитель центра подготовки актеров кино. Теленовелла «Обручальное кольцо» — победитель премии ТЕФИ-2012 в номинации «Телевизионный художественный сериал – телероман»."
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
              <EditableContent
                contentKey="acting_about_name"
                defaultValue={kazbekName}
                type="text"
                page="acting"
                section="about"
                as="h3"
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              />
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </div>
            
            <div className="space-y-6">
              {kazbekInfo.map((item, index) => (
                <div key={index} className="space-y-2">
                  <EditableContent
                    contentKey={`acting_about_title_${index}`}
                    defaultValue={item.title}
                    type="text"
                    page="acting"
                    section="about"
                    as="h4"
                    className="text-lg md:text-xl font-semibold text-primary"
                  />
                  <EditableContent
                    contentKey={`acting_about_text_${index}`}
                    defaultValue={item.text}
                    type="textarea"
                    page="acting"
                    section="about"
                    as="p"
                    className="text-base leading-relaxed text-foreground/90"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}