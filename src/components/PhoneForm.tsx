'use client';

import { useState } from 'react';
import InputMask from 'react-input-mask';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { getStoredUTM, getYandexClientID } from '@/lib/utm';

/** Номер из маски в цифры 7XXXXXXXXXX для API */
function phoneToDigits(masked: string): string {
  const digits = masked.replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('9')) return '7' + digits;
  if (digits.length === 11 && digits.startsWith('8')) return '7' + digits.slice(1);
  if (digits.length >= 11) return digits.startsWith('7') ? digits : '7' + digits.slice(-10);
  return digits;
}

const TELEGRAM_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

interface PhoneFormProps {
  source: string;
  course?: 'acting' | 'oratory' | 'showreel' | 'acting-cards';
  triggerText?: string;
  triggerVariant?: 'default' | 'outline' | 'ghost';
  triggerSize?: 'default' | 'sm' | 'lg';
  triggerClassName?: string;
  title?: string;
  description?: string;
  seatsCounter?: React.ReactNode;
  telegramHref?: string;
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
  seatsCounter,
  telegramHref = 'https://t.me/kaz9999',
}: PhoneFormProps) {
  const defaultTitle = title !== undefined ? title : 'Записаться на курс';
  const defaultDescription = description !== undefined ? description : 'Оставьте свой номер телефона, и мы свяжемся с вами в ближайшее время';
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = phoneToDigits(phone);
    if (normalized.length < 11) {
      alert('Пожалуйста, введите полный номер телефона');
      return;
    }

    setLoading(true);
    try {
      const utm = getStoredUTM();
      const clientId = await getYandexClientID();

      await api.leads.create({ 
        phone: normalized, 
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
      const message = error instanceof Error ? error.message : 'Ошибка отправки. Попробуйте позже.';
      alert(message);
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
          <div className="flex flex-col items-center justify-center py-4 sm:py-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="Check" className="text-primary" size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">Спасибо за заявку!</h3>
            <p className="text-muted-foreground text-center text-sm mb-5">
              Мы свяжемся с вами в ближайшее время
            </p>
            {telegramHref && (
              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center rounded-lg px-5 py-3 font-semibold text-white transition-colors"
                style={{ background: '#2CA5E0' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1a96cc')}
                onMouseLeave={e => (e.currentTarget.style.background = '#2CA5E0')}
              >
                {TELEGRAM_ICON}
                Подписаться на канал в Telegram
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-sm">Номер телефона</Label>
              <InputMask
                mask="+7 (999) 999-99-99"
                maskChar="_"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              >
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    id="phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    required
                    className="text-sm sm:text-base"
                  />
                )}
              </InputMask>
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
            {telegramHref && (
              <div className="pt-1 border-t border-border">
                <a
                  href={telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
                  style={{ background: '#2CA5E0' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1a96cc')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#2CA5E0')}
                >
                  {TELEGRAM_ICON}
                  Подписаться на канал в Telegram
                </a>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}