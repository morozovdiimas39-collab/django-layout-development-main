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
  onStartEditing,
  onCancelEditing
}: ModulesManagerProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить модуль</CardTitle>
          <CardDescription>Новый модуль курса</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Тип курса</Label>
            <Select
              value={newModule.course_type}
              onValueChange={(value) => onNewModuleChange('course_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent modal={false}>
                <SelectItem value="acting">Актерское мастерство</SelectItem>
                <SelectItem value="oratory">Ораторское искусство</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Название модуля</Label>
            <Input
              value={newModule.title}
              onChange={(e) => onNewModuleChange('title', e.target.value)}
              placeholder="Основы актерской техники"
            />
          </div>
          <div>
            <Label>Описание</Label>
            <Textarea
              value={newModule.description}
              onChange={(e) => {
                const value = e.target.value;
                const lines = value.split('\n').map(line => {
                  const trimmed = line.trim();
                  if (trimmed && !trimmed.startsWith('-')) {
                    return '- ' + trimmed;
                  }
                  return line;
                });
                onNewModuleChange('description', lines.join('\n'));
              }}
              placeholder="Каждая строка автоматически станет пунктом списка..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">Каждая строка автоматически превратится в пункт списка</p>
          </div>
          <div>
            <Label>Результат</Label>
            <Textarea
              value={newModule.result}
              onChange={(e) => onNewModuleChange('result', e.target.value)}
              placeholder="Что студент получит после прохождения..."
              rows={2}
            />
          </div>
          <div>
            <Label>URL изображения (опционально)</Label>
            <Input
              value={newModule.image_url}
              onChange={(e) => onNewModuleChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <Button onClick={onCreate} className="w-full">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить модуль
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Модули курсов ({modules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id}>
                {editingModule?.id === module.id ? (
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <Label>Тип курса</Label>
                        <Select
                          value={editingModule.course_type}
                          onValueChange={(value) => onEditingModuleChange('course_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent modal={false}>
                            <SelectItem value="acting">Актерское мастерство</SelectItem>
                            <SelectItem value="oratory">Ораторское искусство</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Название</Label>
                        <Input
                          value={editingModule.title}
                          onChange={(e) => onEditingModuleChange('title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Описание</Label>
                        <Textarea
                          value={editingModule.description}
                          onChange={(e) => {
                            const value = e.target.value;
                            const lines = value.split('\n').map(line => {
                              const trimmed = line.trim();
                              if (trimmed && !trimmed.startsWith('-')) {
                                return '- ' + trimmed;
                              }
                              return line;
                            });
                            onEditingModuleChange('description', lines.join('\n'));
                          }}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Каждая строка автоматически превратится в пункт списка</p>
                      </div>
                      <div>
                        <Label>Результат</Label>
                        <Textarea
                          value={editingModule.result}
                          onChange={(e) => onEditingModuleChange('result', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>URL изображения</Label>
                        <Input
                          value={editingModule.image_url}
                          onChange={(e) => onEditingModuleChange('image_url', e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={onUpdate} size="sm" className="flex-1">
                          Сохранить
                        </Button>
                        <Button onClick={onCancelEditing} variant="outline" size="sm">
                          Отмена
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {module.image_url && (
                          <img
                            src={module.image_url}
                            alt={module.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {module.course_type === 'acting' ? 'Актерское' : 'Ораторское'}
                            </span>
                            <h3 className="font-semibold">{module.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                          {module.result && (
                            <p className="text-xs text-muted-foreground italic mb-3">
                              Результат: {module.result}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onStartEditing(module)}
                            >
                              <Icon name="Edit" size={14} className="mr-1" />
                              Изменить
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(module.id)}
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}