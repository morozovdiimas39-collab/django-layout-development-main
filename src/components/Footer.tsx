import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import EditableContent from './EditableContent';

export default function Footer() {
  const [phone, setPhone] = useState('+7 (999) 123-45-67');
  const [email, setEmail] = useState('info@school.ru');
  const [address, setAddress] = useState('г. Москва');
  const [instagram, setInstagram] = useState('https://instagram.com/');
  const [youtube, setYoutube] = useState('https://youtube.com/');
  const [telegram, setTelegram] = useState('https://t.me/');
  const [whatsapp, setWhatsapp] = useState('https://wa.me/');

  useEffect(() => {
    api.content.getAll().then((data) => {
      data.forEach(item => {
        if (item.key === 'phone') setPhone(item.value);
        if (item.key === 'email') setEmail(item.value);
        if (item.key === 'address') setAddress(item.value);
        if (item.key === 'instagram_url') setInstagram(item.value);
        if (item.key === 'youtube_url') setYoutube(item.value);
        if (item.key === 'telegram_url') setTelegram(item.value);
        if (item.key === 'whatsapp_url') setWhatsapp(item.value);
      });
    }).catch(() => {});
  }, []);
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="md:col-span-2">
            <EditableContent
              contentKey="footer_title"
              defaultValue="Школа Казбека Меретукова"
              type="text"
              page="common"
              section="footer"
              as="h3"
              className="text-2xl font-bold text-primary mb-4"
            />
            <EditableContent
              contentKey="footer_description"
              defaultValue="Профессиональное обучение актерскому и ораторскому мастерству в Москве. Преодолейте страх сцены и камеры, станьте уверенным в себе и харизматичным."
              type="textarea"
              page="common"
              section="footer"
              as="p"
              className="text-muted-foreground mb-4"
            />
            <div className="flex gap-4">
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
                <Icon name="Instagram" size={20} />
              </a>
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
                <Icon name="Youtube" size={20} />
              </a>
              <a href={telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              </a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Курсы</h4>
            <ul className="space-y-2">
              <li>
                <a href="/acting" className="text-muted-foreground hover:text-primary transition">
                  Актерское мастерство
                </a>
              </li>
              <li>
                <a href="/oratory" className="text-muted-foreground hover:text-primary transition">
                  Ораторское искусство
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">О школе</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition">
                  Главная
                </a>
              </li>
              <li>
                <a href="/teacher" className="text-muted-foreground hover:text-primary transition">
                  О преподавателях
                </a>
              </li>
              <li>
                <a href="/blog" className="text-muted-foreground hover:text-primary transition">
                  Блог
                </a>
              </li>
              <li>
                <a href="/contacts" className="text-muted-foreground hover:text-primary transition">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Связаться</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Icon name="MapPin" size={18} className="text-primary" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Phone" size={18} className="text-primary" />
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-primary transition">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Mail" size={18} className="text-primary" />
                <a href={`mailto:${email}`} className="hover:text-primary transition">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Школа Казбека Меретукова. Все права защищены.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="/admin" className="text-muted-foreground hover:text-primary transition">
              Админка
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}