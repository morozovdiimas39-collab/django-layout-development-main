import Icon from '@/components/ui/icon';
import LeadForm from '@/components/LeadForm';

export default function LeadFormSection() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Icon name="Sparkles" className="text-primary" size={18} />
              <span className="text-primary font-semibold text-sm">Начните прямо сейчас</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Запишитесь на <span className="text-primary">пробное занятие</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6">
              Оставьте заявку прямо сейчас и получите:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="CheckCircle2" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Пробное занятие</h3>
                  <p className="text-sm text-muted-foreground">Познакомьтесь с преподавателем и форматом обучения</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Calendar" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Персональную консультацию</h3>
                  <p className="text-sm text-muted-foreground">Обсудим ваши цели и подберём программу</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Star" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Индивидуальный подход</h3>
                  <p className="text-sm text-muted-foreground">Учитываем ваш уровень и темп обучения</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-primary/20">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Запишитесь на пробное занятие</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Укажите номер телефона</p>
            </div>
            <LeadForm 
              source="lead_form_oratory"
              course="oratory"
              title=""
              description=""
              buttonText="Отправить заявку"
            />
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
              <Icon name="Lock" size={12} className="flex-shrink-0" />
              <span>Ваши данные защищены и не передаются третьим лицам</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}