'use client';

import { useState } from 'react';
import InputMask from 'react-input-mask';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { getStoredUTM, getYandexClientID, getJourney } from '@/lib/utm';

function phoneToDigits(masked: string): string {
  const digits = masked.replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('9')) return '7' + digits;
  if (digits.length === 11 && digits.startsWith('8')) return '7' + digits.slice(1);
  if (digits.length >= 11) return digits.startsWith('7') ? digits : '7' + digits.slice(-10);
  return digits;
}

interface LeadFormProps {
  source: string;
  course?: 'acting' | 'oratory';
  title?: string;
  description?: string;
  buttonText?: string;
  telegramHref?: string;
  /** Без тяжёлой обводки карточки — для встраивания в секции (например, блок цен) */
  layout?: 'default' | 'embedded';
}

export default function LeadForm({ 
  source,
  course,
  title = "Запись на пробное занятие",
  description = "Оставьте номер телефона, и мы свяжемся с вами",
  buttonText = "Записаться",
  layout = 'default',
}: LeadFormProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = phoneToDigits(phone);
    if (normalized.length < 11) {
      alert('Пожалуйста, введите полный номер телефона');
      return;
    }
    setLoading(true);

    try {
      const utm = { ...getStoredUTM(), utm_journey: getJourney() };
      const clientId = await getYandexClientID();

      await api.leads.create({ 
        phone: normalized, 
        source, 
        course,
        ym_client_id: clientId || undefined,
        utm
      });
      
      setSubmitted(true);
      setPhone('');
      
      if (typeof window !== 'undefined' && (window as any).ym) {
        (window as any).ym(104854671, 'reachGoal', 'send_form');
      }
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      const message = error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте еще раз.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    if (layout === 'embedded') {
      return (
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-center">
          <Icon name="CheckCircle" className="text-primary mx-auto mb-2" size={28} />
          <h3 className="font-bold">Заявка отправлена</h3>
          <p className="text-sm text-muted-foreground mt-1">Свяжемся с вами в ближайшее время</p>
        </div>
      );
    }
    return (
      <div className="bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/40 rounded-xl md:rounded-2xl lg:rounded-3xl p-6 sm:p-8 text-center backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" className="text-primary" size={32} />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Заявка отправлена!</h3>
        <p className="text-muted-foreground text-base sm:text-lg mb-5">
          Мы свяжемся с вами в ближайшее время
        </p>
      </div>
    );
  }

  const formInner = (
    <>
      {title && <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>}
      {description && <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{description}</p>}

      <form onSubmit={handleSubmit} className={layout === 'embedded' ? 'space-y-4' : 'space-y-5'}>
        <div>
          <Label htmlFor={`phone-${source}`} className="text-sm font-semibold mb-2 block">
            Номер телефона
          </Label>
          <InputMask
            mask="+7 (999) 999-99-99"
            maskChar="_"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                id={`phone-${source}`}
                type="tel"
                placeholder="+7 (___) ___-__-__"
                required
                className={
                  layout === 'embedded'
                    ? 'h-11 text-sm border border-primary/25 bg-background focus-visible:ring-primary/40'
                    : 'h-11 sm:h-12 text-sm sm:text-base border-2 border-primary/20 focus:border-primary/60 transition-colors'
                }
              />
            )}
          </InputMask>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={
            layout === 'embedded'
              ? 'w-full h-11 text-sm font-semibold'
              : 'w-full h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
          }
          size="lg"
        >
          {loading ? (
            <>
              <Icon name="Loader2" className="animate-spin mr-2" size={20} />
              Отправка...
            </>
          ) : (
            <>
              <Icon name="Send" className="mr-2" size={20} />
              {buttonText}
            </>
          )}
        </Button>
      </form>
    </>
  );

  if (layout === 'embedded') {
    return <div className="space-y-1">{formInner}</div>;
  }

  return (
    <div className="bg-card/90 backdrop-blur-md border-2 border-primary/20 rounded-xl md:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl hover:border-primary/40 transition-all duration-300">
      {formInner}
    </div>
  );
}