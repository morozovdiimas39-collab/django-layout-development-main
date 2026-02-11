import Icon from '@/components/ui/icon';
import LeadForm from '@/components/LeadForm';

export default function CallToActionSection() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-primary/20">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Запишитесь на курс</h3>
              <p className="text-sm text-muted-foreground">Укажите ваше имя и номер телефона</p>
            </div>
            <LeadForm 
              source="acting_cta"
              title=""
              description=""
              buttonText="Отправить заявку"
            />
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Lock" size={14} />
              <span>Ваши данные защищены и не передаются третьим лицам</span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Icon name="Star" className="text-primary" size={18} />
              <span className="text-primary font-semibold text-sm">Присоединяйтесь к нам</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Станьте частью <span className="text-primary">актёрского</span> мира
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              Запишитесь сейчас и получите:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Users" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Обучение от профессионалов</h3>
                  <p className="text-sm text-muted-foreground">Занятия с опытными актёрами и режиссёрами</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Video" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Съёмки в настоящих проектах</h3>
                  <p className="text-sm text-muted-foreground">Практический опыт работы на площадке</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Award" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Сертификат об окончании</h3>
                  <p className="text-sm text-muted-foreground">Официальный документ после завершения курса</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
