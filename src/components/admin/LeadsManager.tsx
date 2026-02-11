import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Lead } from '@/lib/api';
import { formatDate } from '@/lib/dates';

interface LeadsManagerProps {
  leads: Lead[];
  onUpdateStatus: (leadId: number, status: string) => void;
  onMarkAsTargeted?: (lead: Lead) => void;
}

export default function LeadsManager({ leads, onUpdateStatus, onMarkAsTargeted }: LeadsManagerProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-500/10 text-blue-500',
      trial: 'bg-green-500/10 text-green-500',
      enrolled: 'bg-purple-500/10 text-purple-500',
      thinking: 'bg-yellow-500/10 text-yellow-500',
      irrelevant: 'bg-red-500/10 text-red-500'
    };
    return styles[status as keyof typeof styles] || styles.new;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      new: 'Новый',
      trial: 'Записался на пробное',
      enrolled: 'Записался на обучение',
      thinking: 'Думает',
      irrelevant: 'Нецелевой'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getCourseLabel = (course: string | undefined) => {
    if (!course) return 'Не указан';
    const labels = {
      acting: 'Актёрское мастерство',
      oratory: 'Ораторское искусство'
    };
    return labels[course as keyof typeof labels] || course;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Лиды ({leads.length})</span>
            <div className="flex gap-2 text-sm font-normal">
              <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                Новых: {leads.filter(l => l.status === 'new').length}
              </span>
              <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">
                Записались: {leads.filter(l => l.status === 'enrolled').length}
              </span>
            </div>
          </CardTitle>
          <CardDescription>Управление заявками с сайта</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Заявок пока нет</p>
              </div>
            ) : (
              leads.map((lead) => (
                <Card key={lead.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {lead.name && (
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="User" size={16} className="text-muted-foreground" />
                            <span className="font-semibold">{lead.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="Phone" size={16} className="text-primary" />
                          <a href={`tel:${lead.phone}`} className="font-semibold hover:text-primary">
                            {lead.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          {lead.course === 'acting' ? (
                            <Icon name="Drama" size={14} />
                          ) : lead.course === 'oratory' ? (
                            <Icon name="Mic" size={14} />
                          ) : (
                            <Icon name="HelpCircle" size={14} />
                          )}
                          <span>{getCourseLabel(lead.course)}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <div>Дата: {formatDate(lead.created_at)}</div>
                        </div>
                        <Select
                          value={lead.status}
                          onValueChange={(value) => onUpdateStatus(lead.id, value)}
                        >
                          <SelectTrigger className="w-[220px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Новый</SelectItem>
                            <SelectItem value="trial">Записался на пробное</SelectItem>
                            <SelectItem value="enrolled">Записался на обучение</SelectItem>
                            <SelectItem value="thinking">Думает</SelectItem>
                            <SelectItem value="irrelevant">Нецелевой</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {onMarkAsTargeted && (
                        <Button
                          onClick={() => onMarkAsTargeted(lead)}
                          variant="default"
                          size="sm"
                          className="w-full"
                        >
                          <Icon name="Target" size={16} className="mr-2" />
                          Отметить как целевого
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}