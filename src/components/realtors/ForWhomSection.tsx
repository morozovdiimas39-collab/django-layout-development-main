import Icon from '@/components/ui/icon';

export default function ForWhomSection() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4 text-sm border border-primary/20">
            <Icon name="Users" size={16} />
            Для кого курс
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Для кого <span className="text-primary">этот курс?</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Ораторское мастерство и техника речи для специалистов рынка недвижимости
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
              <Icon name="Briefcase" className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Агенты недвижимости</h3>
            <p className="text-muted-foreground">
              Презентации объектов, показы и переговоры с клиентами
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
              <Icon name="TrendingUp" className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Руководители агентств</h3>
            <p className="text-muted-foreground">
              Выступления на собраниях, питчи и обучение сотрудников
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
              <Icon name="Phone" className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Холодные звонки</h3>
            <p className="text-muted-foreground">
              Для тех, кто хочет уверенно вести переговоры по телефону
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
              <Icon name="Star" className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Публичные выступления</h3>
            <p className="text-muted-foreground">
              Выступления на мероприятиях, конференциях и открытых показах
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
