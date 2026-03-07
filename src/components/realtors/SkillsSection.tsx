import Icon from '@/components/ui/icon';
import LeadForm from '@/components/LeadForm';

const realtorsSkills = [
  { icon: 'Mic', title: 'Презентации объектов', description: 'Уверенно показывайте объекты клиентам и на открытых показах' },
  { icon: 'MessageSquare', title: 'Переговоры', description: 'Ведите переговоры с покупателями и продавцами без волнения' },
  { icon: 'Phone', title: 'Холодные звонки', description: 'Постановка голоса и убедительность в телефонных разговорах' },
  { icon: 'Users', title: 'Работа с возражениями', description: 'Управление вниманием и реакциями клиентов' },
  { icon: 'Zap', title: 'Харизма и доверие', description: 'Располагайте к себе клиентов с первых минут общения' },
  { icon: 'Presentation', title: 'Структура выступления', description: 'Логичные презентации на собраниях и мероприятиях' },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-12 px-4 md:py-20 md:px-4 bg-gradient-to-b from-background/0 via-background/50 to-card/30 pt-12 md:pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4 text-sm border border-primary/20">
            <Icon name="Target" size={16} />
            Программа для риелторов
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Чему вы <span className="text-primary">научитесь</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Навыки публичных выступлений и речи для агентов недвижимости
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {realtorsSkills.map((skill, index) => (
            <div
              key={index}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Icon name={skill.icon as any} className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{skill.title}</h3>
              <p className="text-muted-foreground">{skill.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
          <div className="max-w-5xl mx-auto relative z-10 py-12 md:py-16 px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <LeadForm
                  source="skills_realtors"
                  course="oratory"
                  title=""
                  description=""
                  buttonText="Отправить заявку"
                />
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="Lock" size={14} />
                  <span>Ваши данные защищены и не передаются третьим лицам</span>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Icon name="Star" className="text-primary" size={18} />
                  <span className="text-primary font-semibold text-sm">Для риелторов и агентов</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Готовы выступать <span className="text-primary">уверенно?</span>
                </h3>
                <p className="text-base md:text-lg text-muted-foreground mb-6">
                  Пробное занятие — познакомитесь с форматом и преподавателем
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
