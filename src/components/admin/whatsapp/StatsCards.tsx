import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Stats } from './types';

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-green-700">Активных кампаний</CardDescription>
            <Icon name="Zap" className="text-green-500" size={20} />
          </div>
          <CardTitle className="text-4xl text-green-600">{stats.active_campaigns}</CardTitle>
        </CardHeader>
      </Card>
      
      {stats.stats.map((stat) => {
        const config: Record<string, { icon: string, gradient: string, textColor: string }> = {
          pending: { icon: 'Clock', gradient: 'from-yellow-50 to-white', textColor: 'text-yellow-600' },
          sent: { icon: 'CheckCircle2', gradient: 'from-blue-50 to-white', textColor: 'text-blue-600' },
          failed: { icon: 'XCircle', gradient: 'from-red-50 to-white', textColor: 'text-red-600' }
        };
        
        const { icon, gradient, textColor } = config[stat.status] || { icon: 'HelpCircle', gradient: 'from-gray-50 to-white', textColor: 'text-gray-600' };
        const labels: Record<string, string> = {
          pending: 'В очереди',
          sent: 'Отправлено',
          failed: 'Ошибок'
        };

        return (
          <Card key={stat.status} className={`bg-gradient-to-br ${gradient}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className={textColor}>{labels[stat.status]}</CardDescription>
                <Icon name={icon} className={textColor} size={20} />
              </div>
              <CardTitle className={`text-4xl ${textColor}`}>{stat.count}</CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
