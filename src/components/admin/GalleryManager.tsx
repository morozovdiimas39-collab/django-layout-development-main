import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { GalleryImage } from '@/lib/api';

interface GalleryManagerProps {
  gallery: GalleryImage[];
  newGalleryImage: {
    url: string;
    caption: string;
  };
  editingGalleryImage: GalleryImage | null;
  onNewImageChange: (field: string, value: string) => void;
  onEditingImageChange: (field: string, value: string | number) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onStartEditing: (image: GalleryImage) => void;
  onCancelEditing: () => void;
}

export default function GalleryManager({
  gallery,
  newGalleryImage,
  editingGalleryImage,
  onNewImageChange,
  onEditingImageChange,
  onCreate,
  onUpdate,
  onDelete,
  onStartEditing,
  onCancelEditing
}: GalleryManagerProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Добавить изображение</CardTitle>
          <CardDescription className="text-slate-600">Новое изображение в галерею</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-700">URL изображения</Label>
            <Input
              value={newGalleryImage.url}
              onChange={(e) => onNewImageChange('url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">Описание</Label>
            <Input
              value={newGalleryImage.caption}
              onChange={(e) => onNewImageChange('caption', e.target.value)}
              placeholder="Описание изображения"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <Button onClick={onCreate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить изображение
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900">Галерея ({gallery.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gallery.map((image) => (
              <div key={image.id}>
                {editingGalleryImage?.id === image.id ? (
                  <Card className="border-slate-200 bg-slate-50/50">
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <Label className="text-slate-700">URL</Label>
                        <Input
                          value={editingGalleryImage.url}
                          onChange={(e) => onEditingImageChange('url', e.target.value)}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">Описание</Label>
                        <Input
                          value={editingGalleryImage.caption || ''}
                          onChange={(e) => onEditingImageChange('caption', e.target.value)}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">Порядок</Label>
                        <Input
                          type="number"
                          value={editingGalleryImage.order_num}
                          onChange={(e) => onEditingImageChange('order_num', parseInt(e.target.value))}
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
                  <Card className="overflow-hidden border-slate-200 bg-white">
                    <div className="aspect-video relative">
                      <img
                        src={image.url}
                        alt={image.caption || 'Изображение'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <p className="text-sm text-slate-600 mb-3">{image.caption || 'Без описания'}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onStartEditing(image)}
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Icon name="Edit" size={14} className="mr-1" />
                          Изменить
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(image.id)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
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