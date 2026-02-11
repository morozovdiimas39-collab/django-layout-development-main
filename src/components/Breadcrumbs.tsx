import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeMap: Record<string, string> = {
  '': 'Главная',
  'acting': 'Актёрское мастерство',
  'oratory': 'Ораторское искусство',
  'showreel': 'Визитки',
  'team': 'Команда',
  'reviews': 'Отзывы',
  'blog': 'Блог',
  'contacts': 'Контакты',
  'admin': 'Администрирование'
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Главная', path: '/' }
  ];

  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeMap[segment] || segment;
    breadcrumbs.push({ label, path: currentPath });
  });

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.path} className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {!isLast ? (
                <>
                  <Link 
                    to={crumb.path} 
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