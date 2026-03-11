import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { CourseModule } from '@/lib/api';

interface ModulesManagerProps {
  modules: CourseModule[];
  newModule: {
    course_type: string;
    title: string;
    description: string;
    result: string;
    image_url: string;
  };
  editingModule: CourseModule | null;
  onNewModuleChange: (field: string, value: string) => void;
  onEditingModuleChange: (field: string, value: string) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onReorder: (id: number, direction: 'up' | 'down') => void;
  onStartEditing: (module: CourseModule) => void;
  onCancelEditing: () => void;
}

export default function ModulesManager({
  modules,
  newModule,
  editingModule,
  onNewModuleChange,
  onEditingModuleChange,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
  onStartEditing,
  onCancelEditing
}: ModulesManagerProps) {
  const actingModules = modules.filter(m => m.course_type === 'acting').sort((a, b) => (a.order_num ?? 0) - (b.order_num ?? 0));
  const oratoryModules = modules.filter(m => m.course_type === 'oratory').sort((a, b) => (a.order_num ?? 0) - (b.order_num ?? 0));

  const renderModuleCard = (module: CourseModule, canMoveUp: boolean, canMoveDown: boolean) => (
    <div key={module.id}>
      {editingModule?.id === module.id ? (
        <Card className="border-slate-200 bg-slate-50/50">
          <CardContent className="pt-6 space-y-3">
            <div>
              <Label className="text-slate-700">Тип курса</Label>
              <Select
                value={editingModule.course_type}
                onValueChange={(value) => onEditingModuleChange('course_type', value)}
              >
                <SelectTrigger className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent modal={false}>
                  <SelectItem value="acting">Актерское мастерство</SelectItem>
                  <SelectItem value="oratory">Ораторское искусство</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-700">Название</Label>
              <Input
                value={editingModule.title}
                onChange={(e) => onEditingModuleChange('title', e.target.value)}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label className="text-slate-700">Описание</Label>
              <Textarea
                value={editingModule.description}
                onChange={(e) => {
                  const value = e.target.value;
                  const lines = value.split('\n').map(line => {
                    const trimmed = line.trim();
                    if (trimmed && !trimmed.startsWith('-')) return '- ' + trimmed;
                    return line;
                  });
                  onEditingModuleChange('description', lines.join('\n'));
                }}
                rows={3}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1">Каждая строка автоматически превратится в пункт списка</p>
            </div>
            <div>
              <Label className="text-slate-700">Результат</Label>
              <Textarea
                value={editingModule.result}
                onChange={(e) => onEditingModuleChange('result', e.target.value)}
                rows={2}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label className="text-slate-700">URL изображения</Label>
              <Input
                value={editingModule.image_url}
                onChange={(e) => onEditingModuleChange('image_url', e.target.value)}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onUpdate} size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Сохранить
              </Button>
              <Button onClick={onCancelEditing} variant="outline" size="sm" className="border-slate-300 bg-white text-slate-800 hover:bg-slate-100">
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              {module.image_url && (
                <img src={module.image_url} alt={module.title} className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 mb-1">{module.title}</h3>
                <p className="text-sm text-slate-600 mb-2 line-clamp-2">{module.description}</p>
                {module.result && (
                  <p className="text-xs text-slate-500 italic mb-3">Результат: {module.result}</p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => onReorder(module.id, 'up')}
                      disabled={!canMoveUp}
                      title="Поднять выше"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Icon name="ChevronUp" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onReorder(module.id, 'down')}
                      disabled={!canMoveDown}
                      title="Опустить ниже"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Icon name="ChevronDown" size={14} />
                    </Button>
                  </div>
                  <Button size="sm" onClick={() => onStartEditing(module)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Icon name="Edit" size={14} className="mr-1" />
                    Изменить
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(module.id)}>
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Добавить модуль</CardTitle>
          <CardDescription className="text-slate-600">Новый модуль курса</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-700">Тип курса</Label>
            <Select value={newModule.course_type} onValueChange={(value) => onNewModuleChange('course_type', value)}>
              <SelectTrigger className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent modal={false}>
                <SelectItem value="acting">Актерское мастерство</SelectItem>
                <SelectItem value="oratory">Ораторское искусство</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-700">Название модуля</Label>
            <Input
              value={newModule.title}
              onChange={(e) => onNewModuleChange('title', e.target.value)}
              placeholder="Основы актерской техники"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">Описание</Label>
            <Textarea
              value={newModule.description}
              onChange={(e) => {
                const value = e.target.value;
                const lines = value.split('\n').map(line => {
                  const trimmed = line.trim();
                  if (trimmed && !trimmed.startsWith('-')) return '- ' + trimmed;
                  return line;
                });
                onNewModuleChange('description', lines.join('\n'));
              }}
              placeholder="Каждая строка автоматически станет пунктом списка..."
              rows={3}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-500 mt-1">Каждая строка автоматически превратится в пункт списка</p>
          </div>
          <div>
            <Label className="text-slate-700">Результат</Label>
            <Textarea
              value={newModule.result}
              onChange={(e) => onNewModuleChange('result', e.target.value)}
              placeholder="Что студент получит после прохождения..."
              rows={2}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">URL изображения (опционально)</Label>
            <Input
              value={newModule.image_url}
              onChange={(e) => onNewModuleChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <Button onClick={onCreate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить модуль
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900">Актерское мастерство</CardTitle>
          <CardDescription className="text-slate-600">{actingModules.length} модулей</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {actingModules.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">Модулей пока нет. Добавьте модуль выше, выбрав тип «Актерское мастерство».</p>
            ) : (
              actingModules.map((module, pos) => renderModuleCard(module, pos > 0, pos < actingModules.length - 1))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900">Ораторское искусство</CardTitle>
          <CardDescription className="text-slate-600">{oratoryModules.length} модулей</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {oratoryModules.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">Модулей пока нет. Добавьте модуль выше, выбрав тип «Ораторское искусство».</p>
            ) : (
              oratoryModules.map((module, pos) => renderModuleCard(module, pos > 0, pos < oratoryModules.length - 1))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}