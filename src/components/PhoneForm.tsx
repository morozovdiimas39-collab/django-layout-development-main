import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { getStoredUTM, getYandexClientID } from '@/lib/utm';

interface PhoneFormProps {
  source: string;
  course?: 'acting' | 'oratory';
  triggerText?: string;
  triggerVariant?: 'default' | 'outline' | 'ghost';
  triggerSize?: 'default' | 'sm' | 'lg';
  triggerClassName?: string;
  title?: string;
  description?: string;
  seatsCounter?: React.ReactNode;
}

export default function PhoneForm({
  source,
  course,
  triggerText = 'Записаться',
  triggerVariant = 'default',
  triggerSize = 'default',
  triggerClassName = '',
  title,
  description,
  seatsCounter
}: PhoneFormProps) {
  const defaultTitle = title !== undefined ? title : 'Записаться на курс';
  const defaultDescription = description !== undefined ? description : 'Оставьте свой номер телефона, и мы свяжемся с вами в ближайшее время';
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    
    let formatted = '+7';
    
    if (cleaned.length > 1) {
      formatted += ' (' + cleaned.substring(1, 4);
    }
    
    if (cleaned.length >= 5) {
      formatted += ') ' + cleaned.substring(4, 7);
    }
    
    if (cleaned.length >= 8) {
      formatted += '-' + cleaned.substring(7, 9);
    }
    
    if (cleaned.length >= 10) {
      formatted += '-' + cleaned.substring(9, 11);
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }

    setLoading(true);
    try {
      const utm = getStoredUTM();
      const clientId = await getYandexClientID();
      
      await api.leads.create({ 
        phone, 
        source, 
        course,
        utm,
        ym_client_id: clientId || undefined
      });
      setSuccess(true);
      
      if (typeof window !== 'undefined' && (window as any).ym) {
        (window as any).ym(104854671, 'reachGoal', 'send_form');
      }
      
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setPhone('');
      }, 2000);
    } catch (error) {
      alert('Ошибка отправки. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <DialogTrigger asChild>
          <Button variant={triggerVariant} size={triggerSize} className={triggerClassName}>
            {triggerText}
          </Button>
        </DialogTrigger>
        {seatsCounter && seatsCounter}
      </div>
      <DialogContent className="sm:max-w-md w-[calc(100vw-2rem)]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl leading-tight">{defaultTitle}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">{defaultDescription}</DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="Check" className="text-primary" size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">Спасибо за заявку!</h3>
            <p className="text-muted-foreground text-center text-sm">
              Мы свяжемся с вами в ближайшее время
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-sm">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={18}
                required
                className="text-sm sm:text-base"
              />
              <p className="text-xs text-muted-foreground">
                Формат: +7 (999) 123-45-67
              </p>
            </div>
            <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading} size="sm">
              {loading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" className="mr-2" size={16} />
                  Отправить заявку
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}