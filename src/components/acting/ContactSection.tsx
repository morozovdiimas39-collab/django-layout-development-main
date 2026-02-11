import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import PhoneForm from '@/components/PhoneForm';
import { api } from '@/lib/api';

export default function ContactSection() {
  const [phone, setPhone] = useState('+7 (999) 123-45-67');
  const [address, setAddress] = useState('Москва');
  const [workingHours, setWorkingHours] = useState('Ежедневно: 10:00 - 21:00');

  useEffect(() => {
    api.content.getAll().then((data) => {
      data.forEach(item => {
        if (item.key === 'phone') setPhone(item.value);
        if (item.key === 'address') setAddress(item.value);
        if (item.key === 'working_hours') setWorkingHours(item.value);
      });
    }).catch(() => {});
  }, []);
  return (
    <section id="contacts" className="py-12 px-4 md:py-20 md:px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Контакты</h2>
          <p className="text-center text-muted-foreground text-sm md:text-base">
            Свяжитесь с нами удобным способом
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="Phone" className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Телефон</h3>
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-muted-foreground hover:text-primary transition">
                    {phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="MapPin" className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Адрес</h3>
                  <p className="text-muted-foreground">
                    {address}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="Clock" className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Режим работы</h3>
                  <p className="text-muted-foreground">
                    {workingHours}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
              <h3 className="font-bold mb-4 text-lg">Запишитесь на пробное занятие</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Оставьте заявку, и мы свяжемся с вами для уточнения деталей
              </p>
              <PhoneForm source="contact_section" triggerText="Оставить заявку" triggerClassName="w-full" />
            </div>
          </div>

          <div className="relative h-[400px] lg:h-full min-h-[400px] rounded-xl overflow-hidden">
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A09c1aac3e1943f51198d94201d94d3d89db9eabc6caae19fa171fc991556a8ae&amp;source=constructorLink"
              width="100%"
              height="100%"
              frameBorder="0"
              className="absolute inset-0"
              title="Карта расположения"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}