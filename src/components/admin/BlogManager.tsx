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
  onGenerate?: () => Promise<void>;
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
  onGenerate,
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
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  const handleGenerate = async () => {
    if (!onGenerate) return;
    setLoadingGenerate(true);
    try {
      await onGenerate();
    } finally {
      setLoadingGenerate(false);
    }
  };

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
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Icon name="BookOpen" size={32} className="text-slate-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">Блог пуст — начните с примеров!</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Загрузите 3 готовые экспертные статьи по актёрскому мастерству (каждая более 5000 символов). Вы сможете их отредактировать или удалить.
                </p>
                <Button onClick={handleLoadSamples} disabled={loadingSamples} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  {loadingSamples ? 'Загружаю...' : 'Загрузить примеры статей'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Добавить статью</CardTitle>
          <CardDescription className="text-slate-600">Новая запись в блоге</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-700">Заголовок</Label>
            <Input
              value={newBlogPost.title}
              onChange={(e) => onNewPostChange('title', e.target.value)}
              placeholder="Как научиться актерскому мастерству"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">Краткое описание</Label>
            <Textarea
              value={newBlogPost.excerpt}
              onChange={(e) => onNewPostChange('excerpt', e.target.value)}
              placeholder="Краткое содержание статьи..."
              rows={2}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">Полный текст</Label>
            <Textarea
              value={newBlogPost.content}
              onChange={(e) => onNewPostChange('content', e.target.value)}
              placeholder="Полный текст статьи..."
              rows={6}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">URL изображения</Label>
            <Input
              value={newBlogPost.image_url}
              onChange={(e) => onNewPostChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onCreate} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить статью
            </Button>
            {onGenerate && (
              <Button onClick={handleGenerate} disabled={loadingGenerate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Icon name="Sparkles" size={16} className="mr-2" />
                {loadingGenerate ? 'Генерирую...' : 'Сгенерировать (Gemini)'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900">Статьи блога ({blog.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blog.map((post) => (
              <div key={post.id}>
                {editingBlogPost?.id === post.id ? (
                  <Card className="border-slate-200 bg-slate-50/50">
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <Label className="text-slate-700">Заголовок</Label>
                        <Input
                          value={editingBlogPost.title}
                          onChange={(e) => onEditingPostChange('title', e.target.value)}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">Краткое описание</Label>
                        <Textarea
                          value={editingBlogPost.excerpt}
                          onChange={(e) => onEditingPostChange('excerpt', e.target.value)}
                          rows={2}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">Полный текст</Label>
                        <Textarea
                          value={editingBlogPost.content}
                          onChange={(e) => onEditingPostChange('content', e.target.value)}
                          rows={6}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">URL изображения</Label>
                        <Input
                          value={editingBlogPost.image_url}
                          onChange={(e) => onEditingPostChange('image_url', e.target.value)}
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
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{post.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">{post.excerpt}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => onStartEditing(post)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
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