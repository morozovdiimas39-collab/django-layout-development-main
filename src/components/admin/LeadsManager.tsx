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
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      trial: 'bg-green-100 text-green-800',
      enrolled: 'bg-purple-100 text-purple-800',
      thinking: 'bg-amber-100 text-amber-800',
      irrelevant: 'bg-red-100 text-red-800',
      called_target: 'bg-emerald-100 text-emerald-800'
    };
    return styles[status] || 'bg-slate-100 text-slate-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Новый',
      trial: 'Записался на пробное',
      enrolled: 'Записался на обучение',
      thinking: 'Думает',
      irrelevant: 'Нецелевой',
      called_target: 'Целевой'
    };
    return labels[status] || status;
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
      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center justify-between text-slate-900">
            <span>Лиды ({leads.length})</span>
            <div className="flex gap-2 text-sm font-normal">
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                Новых: {leads.filter(l => l.status === 'new').length}
              </span>
              <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                Записались: {leads.filter(l => l.status === 'enrolled').length}
              </span>
            </div>
          </CardTitle>
          <CardDescription className="text-slate-600">Управление заявками с сайта</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leads.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Заявок пока нет</p>
              </div>
            ) : (
              leads.map((lead) => (
                <Card key={lead.id} className="border-slate-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {lead.name && (
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="User" size={16} className="text-slate-500" />
                            <span className="font-semibold text-slate-900">{lead.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="Phone" size={16} className="text-slate-600" />
                          <a href={`tel:${lead.phone}`} className="font-semibold text-slate-900 hover:text-slate-700">
                            {lead.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
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
                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="text-xs text-slate-500">
                          Дата: {formatDate(lead.created_at)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">Статус:</span>
                          <span className={`px-2.5 py-1 rounded-md text-sm font-medium ${getStatusBadge(lead.status)}`}>
                            {getStatusLabel(lead.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-sm font-medium text-slate-700 shrink-0">Сменить статус:</label>
                        <Select
                          value={lead.status}
                          onValueChange={(value) => onUpdateStatus(lead.id, value)}
                        >
                          <SelectTrigger className="w-full sm:w-[240px] h-10 border-slate-300 bg-white text-slate-900 font-medium">
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Новый</SelectItem>
                            <SelectItem value="trial">Записался на пробное</SelectItem>
                            <SelectItem value="enrolled">Записался на обучение</SelectItem>
                            <SelectItem value="thinking">Думает</SelectItem>
                            <SelectItem value="irrelevant">Нецелевой</SelectItem>
                            <SelectItem value="called_target">Целевой</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {onMarkAsTargeted && (
                        <Button
                          onClick={() => onMarkAsTargeted(lead)}
                          size="sm"
                          className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
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