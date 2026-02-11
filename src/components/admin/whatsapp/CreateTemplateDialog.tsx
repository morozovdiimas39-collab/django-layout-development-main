import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface CreateTemplateDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: (template: any) => void;
  onFileUpload: (file: File) => Promise<string>;
}

export default function CreateTemplateDialog({ 
  open, 
  loading, 
  onClose, 
  onCreate,
  onFileUpload
}: CreateTemplateDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    delay_days: 0,
    course: '',
    file_url: '',
    file_type: '',
    file_name: ''
  });
  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      alert('Заполните название и текст сообщения');
      return;
    }
    onCreate(formData);
    setFormData({
      name: '',
      title: '',
      content: '',
      delay_days: 0,
      course: '',
      file_url: '',
      file_type: '',
      file_name: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Создание нового шаблона</DialogTitle>
          <DialogDescription>Создайте шаблон сообщения для автоматической рассылки</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Название шаблона *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Например: Приветствие после регистрации"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="name">Идентификатор (name)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="welcome_day_1"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Используется для идентификации в системе</p>
          </div>

          <div>
            <Label htmlFor="content">Текст сообщения *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              placeholder="Привет, {name}! Спасибо за интерес к курсу {course}..."
              className="mt-1 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Доступные переменные: {'{name}'}, {'{course}'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="delay">Задержка отправки (дней)</Label>
              <Input
                id="delay"
                type="number"
                min="0"
                value={formData.delay_days}
                onChange={(e) => setFormData({ ...formData, delay_days: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="course">Курс</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => setFormData({ ...formData, course: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Выберите курс" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все курсы</SelectItem>
                  <SelectItem value="acting">🎭 Актёрское мастерство</SelectItem>
                  <SelectItem value="oratory">🎤 Ораторское искусство</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="file_url">Прикрепить файл (опционально)</Label>
            <Input
              id="file_url"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              placeholder="https://example.com/file.pdf"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Введите прямую ссылку на файл (изображение, видео или PDF). Файл должен быть загружен на Яндекс.Диск, Google Drive или любой другой хостинг с публичным доступом.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file_name">Название файла</Label>
              <Input
                id="file_name"
                value={formData.file_name}
                onChange={(e) => setFormData({ ...formData, file_name: e.target.value })}
                placeholder="document.pdf"
                className="mt-1"
                disabled={!formData.file_url}
              />
            </div>
            <div>
              <Label htmlFor="file_type">Тип файла</Label>
              <Select
                value={formData.file_type}
                onValueChange={(value) => setFormData({ ...formData, file_type: value })}
                disabled={!formData.file_url}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">🖼 Изображение</SelectItem>
                  <SelectItem value="video">🎥 Видео</SelectItem>
                  <SelectItem value="pdf">📄 PDF</SelectItem>
                  <SelectItem value="document">📎 Документ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Icon name="Plus" className="mr-2" size={16} />
              Создать шаблон
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}