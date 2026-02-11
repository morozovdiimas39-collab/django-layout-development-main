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
      <Card>
        <CardHeader>
          <CardTitle>Добавить члена команды</CardTitle>
          <CardDescription>Новый преподаватель или сотрудник</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>ФИО</Label>
            <Input
              value={newMember.name}
              onChange={(e) => onNewMemberChange('name', e.target.value)}
              placeholder="Имя Фамилия"
            />
          </div>
          <div>
            <Label>Должность</Label>
            <Input
              value={newMember.role}
              onChange={(e) => onNewMemberChange('role', e.target.value)}
              placeholder="Преподаватель актерского мастерства"
            />
          </div>
          <div>
            <Label>О преподавателе</Label>
            <Textarea
              value={newMember.bio}
              onChange={(e) => onNewMemberChange('bio', e.target.value)}
              placeholder="Образование, опыт работы, достижения..."
              rows={8}
            />
          </div>
          <div>
            <Label>URL фотографии</Label>
            <Input
              value={newMember.photo_url}
              onChange={(e) => onNewMemberChange('photo_url', e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <Button onClick={onCreate} className="w-full">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Команда ({team.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {team.map((member) => (
              <div key={member.id}>
                {editingMember?.id === member.id ? (
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <Label>ФИО</Label>
                        <Input
                          value={editingMember.name}
                          onChange={(e) => onEditingMemberChange('name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Должность</Label>
                        <Input
                          value={editingMember.role}
                          onChange={(e) => onEditingMemberChange('role', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>О преподавателе</Label>
                        <Textarea
                          value={editingMember.bio || ''}
                          onChange={(e) => onEditingMemberChange('bio', e.target.value)}
                          rows={8}
                        />
                      </div>
                      <div>
                        <Label>URL фотографии</Label>
                        <Input
                          value={editingMember.photo_url || ''}
                          onChange={(e) => onEditingMemberChange('photo_url', e.target.value)}
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
                        {member.photo_url && (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                          <p className="text-sm text-primary mb-2">{member.role}</p>
                          {member.bio && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                              {member.bio}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onStartEditing(member)}
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
