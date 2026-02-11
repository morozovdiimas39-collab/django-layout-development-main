import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Template } from './types';
import { getCourseInfo } from './utils';

interface TemplatesTabProps {
  templates: Template[];
  onEditTemplate: (template: Template) => void;
  onDeleteTemplate: (id: number) => void;
  onCreateTemplate: () => void;
}

export default function TemplatesTab({ 
  templates, 
  onEditTemplate, 
  onDeleteTemplate,
  onCreateTemplate 
}: TemplatesTabProps) {
  const getFileIcon = (fileType: string | null | undefined) => {
    if (!fileType) return null;
    if (fileType === 'image') return 'Image';
    if (fileType === 'video') return 'Video';
    if (fileType === 'pdf') return 'FileText';
    return 'File';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={onCreateTemplate}
          className="bg-green-600 hover:bg-green-700"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Создать шаблон
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => {
          const courseInfo = template.course ? getCourseInfo(template.course) : null;
          const fileIcon = getFileIcon(template.file_type);
          
          return (
            <Card key={template.id} className={`${!template.active ? 'opacity-60' : ''} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-xl">{template.title}</CardTitle>
                      {courseInfo && (
                        <Badge className={`${courseInfo.color} border-0 font-medium`}>
                          {courseInfo.emoji} {courseInfo.name}
                        </Badge>
                      )}
                      <Badge variant={template.active ? 'default' : 'secondary'} className="gap-1">
                        <Icon name={template.active ? 'CheckCircle2' : 'CircleOff'} size={12} />
                        {template.active ? 'Активен' : 'Отключён'}
                      </Badge>
                      {fileIcon && (
                        <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
                          <Icon name={fileIcon} size={12} />
                          {template.file_name || 'Файл прикреплён'}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      Отправка через {template.delay_days} {template.delay_days === 1 ? 'день' : template.delay_days < 5 ? 'дня' : 'дней'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTemplate(template)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Удалить шаблон "${template.title}"?`)) {
                          onDeleteTemplate(template.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{template.content}</p>
                </div>
                
                {template.file_url && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Icon name={fileIcon || 'File'} size={20} className="text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">{template.file_name}</p>
                      <a 
                        href={template.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Открыть файл
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
