'use client';

import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

export type AdminSection =
  | 'leads'
  | 'analytics'
  | 'chatbots'
  | 'content'
  | 'modules'
  | 'faq'
  | 'gallery'
  | 'reviews'
  | 'blog'
  | 'team';

const SECTIONS: { id: AdminSection; label: string; icon: string }[] = [
  { id: 'leads',     label: 'Заявки',     icon: 'Inbox'       },
  { id: 'analytics', label: 'Аналитика',  icon: 'BarChart2'   },
  { id: 'chatbots',  label: 'Боты',       icon: 'Bot'         },
  { id: 'content',   label: 'Контент',    icon: 'FileText'    },
  { id: 'modules',   label: 'Модули',     icon: 'Layers'      },
  { id: 'faq',       label: 'FAQ',        icon: 'HelpCircle'  },
  { id: 'gallery',   label: 'Галерея',    icon: 'Image'       },
  { id: 'reviews',   label: 'Отзывы',     icon: 'Star'        },
  { id: 'blog',      label: 'Блог',       icon: 'BookOpen'    },
  { id: 'team',      label: 'Команда',    icon: 'Users'       },
];

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
      <nav className="p-2 space-y-0.5">
        {SECTIONS.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            className={cn(
              'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              activeSection === id
                ? 'bg-primary text-primary-foreground'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon name={icon} size={20} className="shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
