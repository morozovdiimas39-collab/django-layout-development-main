import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QueueItem } from './types';
import { formatDate, getCourseInfo } from './utils';
import StatusBadge from './StatusBadge';

interface MessageDialogProps {
  message: QueueItem | null;
  onClose: () => void;
}

export default function MessageDialog({ message, onClose }: MessageDialogProps) {
  if (!message) return null;

  const courseInfo = getCourseInfo(message.course);

  return (
    <Dialog open={!!message} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Просмотр сообщения</DialogTitle>
          <DialogDescription>Полная информация о сообщении в очереди</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={`${courseInfo.color} border-0 font-medium text-base px-3 py-1`}>
              {courseInfo.emoji} {courseInfo.name}
            </Badge>
            <StatusBadge status={message.status} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600">Имя</Label>
              <p className="font-medium text-lg">{message.lead_name}</p>
            </div>
            <div>
              <Label className="text-gray-600">Телефон</Label>
              <p className="font-mono font-medium text-lg">{message.phone}</p>
            </div>
          </div>

          <div>
            <Label className="text-gray-600 mb-2 block">Шаблон</Label>
            <p className="font-medium">{message.message_template}</p>
          </div>

          <div>
            <Label className="text-gray-600 mb-2 block">Текст сообщения</Label>
            <ScrollArea className="h-[200px] w-full rounded-lg border bg-gray-50 p-4">
              <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
            </ScrollArea>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label className="text-gray-600">Запланировано</Label>
              <p className="font-medium">{formatDate(message.scheduled_at)}</p>
            </div>
            {message.sent_at && (
              <div>
                <Label className="text-gray-600">Отправлено</Label>
                <p className="font-medium">{formatDate(message.sent_at)}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}