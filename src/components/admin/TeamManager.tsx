import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { TeamMember } from '@/lib/api';

interface TeamManagerProps {
  team: TeamMember[];
  editingMember: TeamMember | null;
  newMember: {
    name: string;
    role: string;
    bio: string;
    photo_url: string;
  };
  onNewMemberChange: (field: string, value: string) => void;
  onEditingMemberChange: (field: string, value: string) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onStartEditing: (member: TeamMember) => void;
  onCancelEditing: () => void;
}

export default function TeamManager({
  team,
  editingMember,
  newMember,
  onNewMemberChange,
  onEditingMemberChange,
  onCreate,
  onUpdate,
  onDelete,
  onStartEditing,
  onCancelEditing
}: TeamManagerProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Добавить члена команды</CardTitle>
          <CardDescription className="text-slate-600">Новый преподаватель или сотрудник</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-700">ФИО</Label>
            <Input
              value={newMember.name}
              onChange={(e) => onNewMemberChange('name', e.target.value)}
              placeholder="Имя Фамилия"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">Должность</Label>
            <Input
              value={newMember.role}
              onChange={(e) => onNewMemberChange('role', e.target.value)}
              placeholder="Преподаватель актерского мастерства"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">О преподавателе</Label>
            <Textarea
              value={newMember.bio}
              onChange={(e) => onNewMemberChange('bio', e.target.value)}
              placeholder="Образование, опыт работы, достижения..."
              rows={8}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">URL фотографии</Label>
            <Input
              value={newMember.photo_url}
              onChange={(e) => onNewMemberChange('photo_url', e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <Button onClick={onCreate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900">Команда ({team.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {team.map((member) => (
              <div key={member.id}>
                {editingMember?.id === member.id ? (
                  <Card className="border-slate-200 bg-slate-50/50">
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <Label className="text-slate-700">ФИО</Label>
                        <Input
                          value={editingMember.name}
                          onChange={(e) => onEditingMemberChange('name', e.target.value)}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">Должность</Label>
                        <Input
                          value={editingMember.role}
                          onChange={(e) => onEditingMemberChange('role', e.target.value)}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">О преподавателе</Label>
                        <Textarea
                          value={editingMember.bio || ''}
                          onChange={(e) => onEditingMemberChange('bio', e.target.value)}
                          rows={8}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">URL фотографии</Label>
                        <Input
                          value={editingMember.photo_url || ''}
                          onChange={(e) => onEditingMemberChange('photo_url', e.target.value)}
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
                        {member.photo_url && (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-slate-900 mb-1">{member.name}</h3>
                          <p className="text-sm text-slate-600 mb-2">{member.role}</p>
                          {member.bio && (
                            <p className="text-xs text-slate-500 mb-3 line-clamp-3">
                              {member.bio}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => onStartEditing(member)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <Icon name="Edit" size={14} className="mr-1" />
                              Изменить
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(member.id)}
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
