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
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}