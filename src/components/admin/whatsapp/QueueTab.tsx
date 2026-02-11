import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { QueueItem } from './types';
import { formatDate, getCourseInfo } from './utils';

interface QueueTabProps {
  queue: QueueItem[];
  filter: string;
  loading: boolean;
  onFilterChange: (filter: string) => void;
  onSendNow: (id: number) => void;
  onViewMessage: (item: QueueItem) => void;
  onDelete: (id: number) => void;
  onDeleteByPhone: (phone: string) => void;
}

export default function QueueTab({ 
  queue, 
  filter, 
  loading, 
  onFilterChange, 
  onSendNow, 
  onViewMessage,
  onDelete,
  onDeleteByPhone
}: QueueTabProps) {
  const groupedQueue = queue.reduce((acc, item) => {
    const key = `${item.phone}_${item.lead_id}`;
    if (!acc[key]) {
      acc[key] = {
        phone: item.phone,
        lead_name: item.lead_name,
        lead_id: item.lead_id,
        course: item.course,
        messages: []
      };
    }
    acc[key].messages.push(item);
    return acc;
  }, {} as Record<string, { phone: string; lead_name: string; lead_id: number; course: string | null; messages: QueueItem[] }>);

  const groups = Object.values(groupedQueue).sort((a, b) => {
    const aNext = a.messages.find(m => m.status === 'pending');
    const bNext = b.messages.find(m => m.status === 'pending');
    if (aNext && !bNext) return -1;
    if (!aNext && bNext) return 1;
    if (aNext && bNext) {
      return new Date(aNext.scheduled_at).getTime() - new Date(bNext.scheduled_at).getTime();
    }
    return b.lead_id - a.lead_id;
  });

  const totalPending = queue.filter(m => m.status === 'pending').length;
  const totalSent = queue.filter(m => m.status === 'sent').length;
  const totalFailed = queue.filter(m => m.status === 'failed').length;

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
      return `+7 (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7,9)}-${cleaned.slice(9,11)}`;
    }
    return phone;
  };

  const formatDateShort = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((msgDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    if (diffDays === 0) return `Сегодня ${time}`;
    if (diffDays === 1) return `Завтра ${time}`;
    if (diffDays === -1) return `Вчера ${time}`;
    
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) + ` ${time}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        <Card 
          className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-gray-900' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          <CardContent className="p-4 text-center">
            <Icon name="Grid" size={24} className="mx-auto mb-2 text-gray-600" />
            <div className="text-sm text-gray-600 mb-1">Всего</div>
            <div className="text-3xl font-bold">{queue.length}</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all ${filter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          <CardContent className="p-4 text-center">
            <Icon name="Clock" size={24} className="mx-auto mb-2 text-yellow-600" />
            <div className="text-sm text-gray-600 mb-1">В очереди</div>
            <div className="text-3xl font-bold text-yellow-600">{totalPending}</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all ${filter === 'sent' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => onFilterChange('sent')}
        >
          <CardContent className="p-4 text-center">
            <Icon name="CheckCircle2" size={24} className="mx-auto mb-2 text-green-600" />
            <div className="text-sm text-gray-600 mb-1">Отправлено</div>
            <div className="text-3xl font-bold text-green-600">{totalSent}</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all ${filter === 'failed' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => onFilterChange('failed')}
        >
          <CardContent className="p-4 text-center">
            <Icon name="XCircle" size={24} className="mx-auto mb-2 text-red-600" />
            <div className="text-sm text-gray-600 mb-1">Ошибки</div>
            <div className="text-3xl font-bold text-red-600">{totalFailed}</div>
          </CardContent>
        </Card>
      </div>

      {queue.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon name="Inbox" size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">Нет сообщений</p>
            <p className="text-gray-400 text-sm mt-1">Сообщения появятся после новых заявок</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => {
            const courseInfo = getCourseInfo(group.course);
            const sortedMessages = group.messages.sort((a, b) => 
              new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
            );
            const pendingCount = sortedMessages.filter(m => m.status === 'pending').length;
            const sentCount = sortedMessages.filter(m => m.status === 'sent').length;
            const failedCount = sortedMessages.filter(m => m.status === 'failed').length;
            const nextPending = sortedMessages.find(m => m.status === 'pending');
            const failedMessages = sortedMessages.filter(m => m.status === 'failed');
            
            return (
              <Card key={`${group.phone}_${group.lead_id}`} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${pendingCount > 0 ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`} />
                      <div>
                        <div className="font-bold text-lg flex items-center gap-2">
                          {group.lead_name || 'Без имени'}
                          <Badge className={`${courseInfo.color} border-0 text-xs`}>
                            {courseInfo.emoji} {courseInfo.name}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 font-mono">
                          {formatPhoneDisplay(group.phone)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {sentCount}<span className="text-gray-400">/{sortedMessages.length}</span>
                        </div>
                        <div className="text-xs text-gray-500">отправлено</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Удалить ВСЕ сообщения для ${formatPhoneDisplay(group.phone)}?`)) {
                            onDeleteByPhone(group.phone);
                          }
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить номер
                      </Button>
                    </div>
                  </div>

                  {failedCount > 0 && (
                    <div className="bg-red-50 px-6 py-4 border-b">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon name="AlertCircle" size={18} className="text-red-600" />
                        <span className="font-semibold text-red-900">Ошибки отправки ({failedCount}):</span>
                      </div>
                      {failedMessages.map(msg => (
                        <div key={msg.id} className="bg-white rounded-lg p-3 mb-2 border border-red-200">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900 mb-1">{msg.message_template?.replace(/_/g, ' ')}</div>
                              <div className="text-xs text-red-600 mb-1">❌ {msg.error_message || 'Неизвестная ошибка'}</div>
                              <div className="text-xs text-gray-500">Попытка: {formatDateShort(msg.scheduled_at)}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onSendNow(msg.id)}
                              disabled={loading}
                              className="text-green-600 hover:bg-green-50 shrink-0"
                            >
                              <Icon name="RefreshCw" size={14} className="mr-1" />
                              Переотправить
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {nextPending && (
                    <div className="bg-yellow-50 px-6 py-4 border-b">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="Clock" size={18} className="text-yellow-600" />
                            <span className="font-semibold text-yellow-900">Следующее сообщение:</span>
                          </div>
                          <div className="text-gray-700 mb-2">{nextPending.message_text}</div>
                          <div className="text-sm text-gray-600">
                            📅 {formatDateShort(nextPending.scheduled_at)}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onSendNow(nextPending.id)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Icon name="Send" size={14} className="mr-1" />
                          Отправить
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="px-6 py-5">
                    <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                      Прогресс: {sentCount} из {sortedMessages.length}
                    </div>
                    
                    <div className="relative pb-2">
                      <div className="flex items-start gap-1">
                        {sortedMessages.map((msg, idx) => {
                          const isSent = msg.status === 'sent';
                          const isPending = msg.status === 'pending';
                          const isFailed = msg.status === 'failed';
                          const isNext = msg.id === nextPending?.id;
                          
                          return (
                            <div key={msg.id} className="flex-1 relative group">
                              {idx < sortedMessages.length - 1 && (
                                <div className={`absolute top-5 left-1/2 right-0 h-1 -mr-1 ${
                                  isSent ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                              )}
                              
                              <div className="relative z-10 flex flex-col items-center">
                                <div 
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all ${
                                    isNext ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
                                  } ${
                                    isSent ? 'bg-green-500 text-white' :
                                    isPending ? 'bg-yellow-400 text-yellow-900' :
                                    isFailed ? 'bg-red-500 text-white' :
                                    'bg-gray-200 text-gray-500'
                                  }`}
                                  onClick={() => onViewMessage(msg)}
                                >
                                  {isSent ? <Icon name="Check" size={18} /> :
                                   isFailed ? <Icon name="X" size={18} /> :
                                   idx + 1}
                                </div>
                                
                                <div className="mt-2 text-center w-full px-1">
                                  <div className={`text-[10px] font-medium leading-tight mb-1 ${
                                    isSent ? 'text-green-700' :
                                    isPending ? 'text-yellow-700' :
                                    isFailed ? 'text-red-700' :
                                    'text-gray-500'
                                  }`}>
                                    {msg.message_template?.replace(/_/g, ' ')}
                                  </div>
                                  <div className="text-[9px] text-gray-500">
                                    {formatDateShort(msg.scheduled_at)}
                                  </div>
                                </div>

                                <div className="invisible group-hover:visible absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-3 py-2 z-30 w-48 text-center shadow-lg">
                                  {msg.message_text.substring(0, 60)}...
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}