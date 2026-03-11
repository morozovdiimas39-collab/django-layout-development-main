'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="h-14 shrink-0 border-b border-slate-200 bg-white flex items-center px-4 gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
          <Icon name="Settings" size={20} className="text-slate-600" />
        </div>
        <span className="font-semibold text-lg text-slate-800 hidden sm:inline">Админ-панель</span>
      </div>
      <div className="flex-1" />
      <Link href="/" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
          <Icon name="Globe" size={16} className="mr-1.5" />
          Сайт
        </Button>
      </Link>
      <Button size="sm" onClick={onLogout} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Icon name="LogOut" size={16} className="mr-1.5" />
        Выйти
      </Button>
    </header>
  );
}
