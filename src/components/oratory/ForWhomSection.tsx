import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const benefits = [
  'Карьерный рост и повышение',
  'Успешные презентации и питчи',
  'Уверенность на собеседованиях',
  'Эффективное управление командой',
  'Публичное признание и авторитет',
  'Нетворкинг и деловые связи'
];

export default function ForWhomSection() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4 text-sm border border-primary/20">
            <Icon name="Users" size={16} />
            Аудитория курса
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Для кого <span className="text-primary">этот курс?</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Курс подходит для всех, кто хочет научиться выступать публично, убедительно общаться и влиять на аудиторию
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
              <Icon name="Briefcase" className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Для карьеры</h3>
            <p className="text-muted-foreground">
              Руководители, менеджеры, предприниматели — для тех, кто хочет вдохновлять команду и убеждать партнёров
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
              <Icon name="Presentation" className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Для презентаций</h3>
            <p className="text-muted-foreground">
              Специалисты, которые проводят презентации, питчи, защищают проекты или выступают на конференциях
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
              <Icon name="UserX" className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Побороть страх</h3>
            <p className="text-muted-foreground">
              Для тех, кто боится выступать публично и хочет преодолеть волнение перед аудиторией
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
              <Icon name="Star" className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Развить харизму</h3>
            <p className="text-muted-foreground">
              Для всех, кто хочет говорить убедительно, ярко и запоминающееся в любой ситуации
            </p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Почему это важно?</h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-background rounded-2xl p-6 md:p-8">
              <Icon name="TrendingUp" className="text-primary mb-4" size={32} />
              <h3 className="text-xl md:text-2xl font-bold mb-4">Карьера и бизнес</h3>
              <ul className="space-y-2 md:space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 md:gap-3">
                    <Icon name="CheckCircle2" className="text-primary flex-shrink-0" size={18} />
                    <span className="text-sm md:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background rounded-2xl p-6 md:p-8">
              <Icon name="Heart" className="text-primary mb-4" size={32} />
              <h3 className="text-xl md:text-2xl font-bold mb-4">Личностный рост</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Развитие ораторских навыков трансформирует не только вашу карьеру, но и личную жизнь:
              </p>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-center gap-2 md:gap-3">
                  <Icon name="CheckCircle2" className="text-primary flex-shrink-0" size={18} />
                  <span className="text-sm md:text-base">Преодоление страха публичных выступлений</span>
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <Icon name="CheckCircle2" className="text-primary flex-shrink-0" size={18} />
                  <span className="text-sm md:text-base">Развитие уверенности в себе</span>
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <Icon name="CheckCircle2" className="text-primary flex-shrink-0" size={18} />
                  <span className="text-sm md:text-base">Улучшение навыков коммуникации</span>
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <Icon name="CheckCircle2" className="text-primary flex-shrink-0" size={18} />
                  <span className="text-sm md:text-base">Расширение зоны комфорта</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}