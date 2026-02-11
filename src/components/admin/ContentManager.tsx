import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { SiteContent } from '@/lib/api';

interface ContentManagerProps {
  content: SiteContent[];
  editingKey: string;
  editingValue: string;
  onStartEditing: (item: SiteContent) => void;
  onValueChange: (value: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
}

const getContentLabel = (key: string): string => {
  const labels: Record<string, string> = {
    'phone': 'Телефон',
    'email': 'Email',
    'address': 'Адрес',
    'working_hours': 'Режим работы',
    'instagram_url': 'Instagram',
    'youtube_url': 'YouTube',
    'telegram_url': 'Telegram',
    'whatsapp_url': 'WhatsApp',
    'trial_date': 'Дата пробного занятия (Актерское)',
    'course_start_date': 'Дата начала курса (Актерское)',
    'oratory_trial_date': 'Дата пробного занятия (Ораторское)',
    'oratory_course_start_date': 'Дата начала курса (Ораторское)',
    'acting_cards_start_date': 'Дата начала съемки визиток'
  };
  return labels[key] || key;
};

const getContentCategory = (key: string): string => {
  if (key.includes('_url')) return 'social';
  if (key.includes('date')) return 'dates';
  if (['phone', 'email', 'address', 'working_hours'].includes(key)) return 'contacts';
  return 'other';
};

export default function ContentManager({
  content,
  editingKey,
  editingValue,
  onStartEditing,
  onValueChange,
  onUpdate,
  onCancel
}: ContentManagerProps) {
  const categories = {
    contacts: content.filter(item => getContentCategory(item.key) === 'contacts'),
    social: content.filter(item => getContentCategory(item.key) === 'social'),
    dates: content.filter(item => getContentCategory(item.key) === 'dates'),
    other: content.filter(item => getContentCategory(item.key) === 'other')
  };

  const renderContentList = (items: SiteContent[], title: string) => {
    if (items.length === 0) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-primary">{getContentLabel(item.key)}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {item.value}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStartEditing(item)}
                >
                  <Icon name="Edit" size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Редактирование контента</CardTitle>
          <CardDescription>Изменяйте текстовое содержимое сайта</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Поле</Label>
            <Input
              value={editingKey ? getContentLabel(editingKey) : ''}
              disabled
              placeholder="Выберите элемент контента из списка ниже"
            />
          </div>
          <div>
            <Label>Значение</Label>
            <Input
              value={editingValue}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder="Новое значение"
              disabled={!editingKey}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onUpdate} className="flex-1" disabled={!editingKey}>
              Обновить контент
            </Button>
            {editingKey && (
              <Button onClick={onCancel} variant="outline">
                Отмена
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {renderContentList(categories.contacts, 'Контактная информация')}
      {renderContentList(categories.social, 'Социальные сети')}
      {renderContentList(categories.dates, 'Даты и расписание')}
      {renderContentList(categories.other, 'Прочее')}
    </div>
  );
}