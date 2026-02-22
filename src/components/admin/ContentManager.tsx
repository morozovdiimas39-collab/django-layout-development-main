import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { SiteContent } from '@/lib/api';

/** Все известные ключи контента — можно добавить, даже если в БД их ещё нет */
export const ALL_CONTENT_KEYS = [
  'phone', 'email', 'address', 'working_hours',
  'instagram_url', 'youtube_url', 'telegram_url', 'whatsapp_url',
  'trial_date', 'course_start_date', 'oratory_trial_date', 'oratory_course_start_date', 'acting_cards_start_date',
  'hero_video_url', 'final_video_url', 'map_embed', 'kazbek_bio', 'olga_bio',
  'acting_hero_title', 'acting_hero_subtitle', 'acting_hero_description',
  'acting_about_name', 'acting_about_title_0', 'acting_about_title_1', 'acting_about_text_0', 'acting_about_text_1',
  'oratory_hero_title', 'oratory_hero_subtitle', 'oratory_hero_description',
  'footer_title', 'footer_description',
] as const;

interface ContentManagerProps {
  content: SiteContent[];
  editingKey: string;
  editingValue: string;
  onStartEditing: (item: SiteContent) => void;
  onValueChange: (value: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
  onAdd?: (key: string, value: string) => Promise<void>;
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
    'acting_cards_start_date': 'Дата начала съемки визиток',
    'hero_video_url': 'Видео (герой)',
    'final_video_url': 'Видео (финальное)',
    'map_embed': 'Карта (embed)',
    'kazbek_bio': 'Био Казбека',
    'olga_bio': 'Био Ольги',
    'acting_hero_title': 'Актерское — заголовок героя',
    'acting_hero_subtitle': 'Актерское — подзаголовок',
    'acting_hero_description': 'Актерское — описание',
    'acting_about_name': 'Актерское — имя блока О нас',
    'acting_about_title_0': 'Актерское — заголовок блока 1',
    'acting_about_title_1': 'Актерское — заголовок блока 2',
    'acting_about_text_0': 'Актерское — текст блока 1',
    'acting_about_text_1': 'Актерское — текст блока 2',
    'oratory_hero_title': 'Ораторское — заголовок героя',
    'oratory_hero_subtitle': 'Ораторское — подзаголовок',
    'oratory_hero_description': 'Ораторское — описание',
    'footer_title': 'Футер — заголовок',
    'footer_description': 'Футер — описание',
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
  onCancel,
  onAdd
}: ContentManagerProps) {
  const [addKey, setAddKey] = useState<string>('');
  const [addCustomKey, setAddCustomKey] = useState('');
  const [addValue, setAddValue] = useState('');
  const [adding, setAdding] = useState(false);

  const existingKeys = new Set(content.map((c) => c.key));
  const keysToSuggest = ALL_CONTENT_KEYS.filter((k) => !existingKeys.has(k));
  const effectiveAddKey = addKey === '__other__' ? addCustomKey.trim() : addKey;

  const handleAdd = async () => {
    if (!onAdd || !effectiveAddKey) return;
    setAdding(true);
    try {
      await onAdd(effectiveAddKey, addValue);
      setAddKey('');
      setAddCustomKey('');
      setAddValue('');
    } finally {
      setAdding(false);
    }
  };

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
          <CardDescription>
            {content.length === 0
              ? 'Пока нет ни одного поля. Добавьте первое в блоке «Добавить поле» ниже.'
              : 'Выберите элемент из списка и нажмите карандаш, затем измените значение выше.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Поле</Label>
            <Input
              value={editingKey ? getContentLabel(editingKey) : ''}
              disabled
              placeholder="Выберите элемент контента из списка ниже или добавьте новое"
            />
          </div>
          <div>
            <Label>Значение</Label>
            <Input
              value={editingValue}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder={editingKey ? 'Новое значение' : 'Сначала выберите поле из списка или добавьте новое'}
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

      {onAdd && (
        <Card>
          <CardHeader>
            <CardTitle>Добавить поле</CardTitle>
            <CardDescription>Создайте новую запись контента, если её ещё нет в списке</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Ключ поля</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={addKey}
                onChange={(e) => setAddKey(e.target.value)}
              >
                <option value="">— Выберите ключ —</option>
                {keysToSuggest.map((k) => (
                  <option key={k} value={k}>
                    {getContentLabel(k)}
                  </option>
                ))}
                <option value="__other__">Другое (ввести вручную)</option>
              </select>
              {addKey === '__other__' && (
                <Input
                  className="mt-2"
                  value={addCustomKey}
                  onChange={(e) => setAddCustomKey(e.target.value)}
                  placeholder="Например: my_custom_key"
                />
              )}
            </div>
            <div>
              <Label>Значение</Label>
              <Input
                value={addValue}
                onChange={(e) => setAddValue(e.target.value)}
                placeholder="Введите значение"
              />
            </div>
            <Button onClick={handleAdd} disabled={!effectiveAddKey || adding}>
              {adding ? 'Сохранение...' : 'Добавить'}
            </Button>
          </CardContent>
        </Card>
      )}

      {renderContentList(categories.contacts, 'Контактная информация')}
      {renderContentList(categories.social, 'Социальные сети')}
      {renderContentList(categories.dates, 'Даты и расписание')}
      {renderContentList(categories.other, 'Прочее')}
    </div>
  );
}