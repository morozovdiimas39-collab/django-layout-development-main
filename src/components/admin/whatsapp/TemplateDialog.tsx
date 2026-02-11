import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Template } from './types';

interface TemplateDialogProps {
  template: Template | null;
  loading: boolean;
  onChange: (template: Template) => void;
  onSave: () => void;
  onClose: () => void;
  onFileUpload: (file: File) => Promise<string>;
}

export default function TemplateDialog({ 
  template, 
  loading, 
  onChange, 
  onSave, 
  onClose,
  onFileUpload 
}: TemplateDialogProps) {
  if (!template) return null;



  return (
    <Dialog open={!!template} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Редактирование шаблона</DialogTitle>
          <DialogDescription>Измените параметры шаблона сообщения</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Название шаблона</Label>
            <Input
              id="title"
              value={template.title}
              onChange={(e) => onChange({ ...template, title: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="content">Текст сообщения</Label>
            <Textarea
              id="content"
              value={template.content}
              onChange={(e) => onChange({ ...template, content: e.target.value })}
              rows={8}
              className="mt-1 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Доступные переменные: {'{name}'}, {'{course}'}
            </p>
          </div>

          <div>
            <Label htmlFor="delay">Задержка отправки (дней)</Label>
            <Input
              id="delay"
              type="number"
              min="0"
              value={template.delay_days}
              onChange={(e) => onChange({ ...template, delay_days: parseInt(e.target.value) })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="file_url">Ссылка на файл (опционально)</Label>
            <Input
              id="file_url"
              value={template.file_url || ''}
              onChange={(e) => onChange({ ...template, file_url: e.target.value || null })}
              placeholder="https://example.com/file.pdf"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Введите прямую ссылку на файл. Файл должен быть доступен по URL без авторизации.
            </p>
            {template.file_url && (
              <a 
                href={template.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
              >
                Просмотреть файл →
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file_name">Название файла</Label>
              <Input
                id="file_name"
                value={template.file_name || ''}
                onChange={(e) => onChange({ ...template, file_name: e.target.value || null })}
                placeholder="document.pdf"
                className="mt-1"
                disabled={!template.file_url}
              />
            </div>
            <div>
              <Label htmlFor="file_type">Тип файла</Label>
              <Input
                id="file_type"
                value={template.file_type || ''}
                onChange={(e) => onChange({ ...template, file_type: e.target.value || null })}
                placeholder="image, video, pdf"
                className="mt-1"
                disabled={!template.file_url}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="active">Статус шаблона</Label>
              <p className="text-sm text-gray-600">
                {template.active ? 'Шаблон активен и будет использоваться' : 'Шаблон отключён'}
              </p>
            </div>
            <Switch
              id="active"
              checked={template.active}
              onCheckedChange={(checked) => onChange({ ...template, active: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onSave}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Icon name="Save" className="mr-2" size={16} />
              Сохранить изменения
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