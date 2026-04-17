'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeMap: Record<string, string> = {
  '': 'Главная',
  'acting': 'Актёрское мастерство',
  'probnoe': 'Пробное занятие',
  'oratory': 'Ораторское искусство',
  'realtors': 'Ораторское мастерство для риелторов',
  'showreel': 'Визитки',
  'team': 'Команда',
  'reviews': 'Отзывы',
  'blog': 'Блог',
  'contacts': 'Контакты',
  'subscribe': 'Подписаться',
  'admin': 'Администрирование'
};

function breadcrumbsFromPathname(pathname: string): BreadcrumbItem[] {
  const pathnames = pathname.split('/').filter((x) => x);
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Главная', path: '/' }];
  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeMap[segment] || segment;
    breadcrumbs.push({ label, path: currentPath });
  });
  return breadcrumbs;
}

type BreadcrumbsProps = {
  /** Если задано — не строим цепочку из URL (для статей блога с заголовком вместо slug) */
  items?: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname() ?? '';
  const breadcrumbs = items ?? breadcrumbsFromPathname(pathname);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className={className ?? 'container mx-auto px-4 py-4'} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.path} className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {!isLast ? (
                <>
                  <Link 
                    href={crumb.path} 
                    className="hover:text-foreground transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">{crumb.label}</span>
                  </Link>
                  <meta itemProp="position" content={String(index + 1)} />
                  <ChevronRight className="w-4 h-4 mx-2" />
                </>
              ) : (
                <>
                  <span className="text-foreground" itemProp="name">{crumb.label}</span>
                  <meta itemProp="position" content={String(index + 1)} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}