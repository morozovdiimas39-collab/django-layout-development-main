import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { BlogPost } from '@/lib/api';
import { sampleArticles } from '@/lib/sample-articles';
import { useState } from 'react';

interface BlogManagerProps {
  blog: BlogPost[];
  newBlogPost: {
    title: string;
    excerpt: string;
    content: string;
    image_url: string;
  };
  editingBlogPost: BlogPost | null;
  onNewPostChange: (field: string, value: string) => void;
  onEditingPostChange: (field: string, value: string) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onStartEditing: (post: BlogPost) => void;
  onCancelEditing: () => void;
  onLoadSamples: () => Promise<void>;
}

export default function BlogManager({
  blog,
  newBlogPost,
  editingBlogPost,
  onNewPostChange,
  onEditingPostChange,
  onCreate,
  onUpdate,
  onDelete,
  onStartEditing,
  onCancelEditing,
  onLoadSamples
}: BlogManagerProps) {
  const [loadingSamples, setLoadingSamples] = useState(false);

  const handleLoadSamples = async () => {
    setLoadingSamples(true);
    try {
      await onLoadSamples();
    } finally {
      setLoadingSamples(false);
    }
  };

  return (
    <div className="space-y-6">
      {blog.length === 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Icon name="BookOpen" size={32} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Блог пуст — начните с примеров!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Загрузите 3 готовые экспертные статьи по актёрскому мастерству (каждая более 5000 символов). Вы сможете их отредактировать или удалить.
                </p>
                <Button onClick={handleLoadSamples} disabled={loadingSamples}>
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  {loadingSamples ? 'Загружаю...' : 'Загрузить примеры статей'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Добавить статью</CardTitle>
          <CardDescription>Новая запись в блоге</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Заголовок</Label>
            <Input
              value={newBlogPost.title}
              onChange={(e) => onNewPostChange('title', e.target.value)}
              placeholder="Как научиться актерскому мастерству"
            />
          </div>
          <div>
            <Label>Краткое описание</Label>
            <Textarea
              value={newBlogPost.excerpt}
              onChange={(e) => onNewPostChange('excerpt', e.target.value)}
              placeholder="Краткое содержание статьи..."
              rows={2}
            />
          </div>
          <div>
            <Label>Полный текст</Label>
            <Textarea
              value={newBlogPost.content}
              onChange={(e) => onNewPostChange('content', e.target.value)}
              placeholder="Полный текст статьи..."
              rows={6}
            />
          </div>
          <div>
            <Label>URL изображения</Label>
            <Input
              value={newBlogPost.image_url}
              onChange={(e) => onNewPostChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <Button onClick={onCreate} className="w-full">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить статью
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статьи блога ({blog.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blog.map((post) => (
              <div key={post.id}>
                {editingBlogPost?.id === post.id ? (
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <Label>Заголовок</Label>
                        <Input
                          value={editingBlogPost.title}
                          onChange={(e) => onEditingPostChange('title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Краткое описание</Label>
                        <Textarea
                          value={editingBlogPost.excerpt}
                          onChange={(e) => onEditingPostChange('excerpt', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Полный текст</Label>
                        <Textarea
                          value={editingBlogPost.content}
                          onChange={(e) => onEditingPostChange('content', e.target.value)}
                          rows={6}
                        />
                      </div>
                      <div>
                        <Label>URL изображения</Label>
                        <Input
                          value={editingBlogPost.image_url}
                          onChange={(e) => onEditingPostChange('image_url', e.target.value)}
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
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onStartEditing(post)}
                            >
                              <Icon name="Edit" size={14} className="mr-1" />
                              Изменить
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(post.id)}
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