import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { getStatusConfig } from './utils';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { variant, icon, label } = getStatusConfig(status);

  return (
    <Badge variant={variant} className="gap-1">
      <Icon name={icon} size={12} />
      {label}
    </Badge>
  );
}
