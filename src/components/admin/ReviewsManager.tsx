import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Review } from '@/lib/api';

interface ReviewsManagerProps {
  reviews: Review[];
  newReview: {
    name: string;
    text: string;
    rating: number;
  };
  editingReview: Review | null;
  onNewReviewChange: (field: string, value: string | number) => void;
  onEditingReviewChange: (field: string, value: string | number) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onStartEditing: (review: Review) => void;
  onCancelEditing: () => void;
}

export default function ReviewsManager({
  reviews,
  newReview,
  editingReview,
  onNewReviewChange,
  onEditingReviewChange,
  onCreate,
  onUpdate,
  onDelete,
  onStartEditing,
  onCancelEditing
}: ReviewsManagerProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Добавить отзыв</CardTitle>
          <CardDescription className="text-slate-600">Новый отзыв студента</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-700">Имя автора</Label>
            <Input
              value={newReview.name}
              onChange={(e) => onNewReviewChange('name', e.target.value)}
              placeholder="Иван Иванов"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">Текст отзыва</Label>
            <Textarea
              value={newReview.text}
              onChange={(e) => onNewReviewChange('text', e.target.value)}
              placeholder="Отличный курс..."
              rows={4}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">Рейтинг (1-5)</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) => onNewReviewChange('rating', parseInt(e.target.value))}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <Button onClick={onCreate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить отзыв
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900">Отзывы ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id}>
                {editingReview?.id === review.id ? (
                  <Card className="border-slate-200 bg-slate-50/50">
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <Label className="text-slate-700">Имя автора</Label>
                        <Input
                          value={editingReview.name}
                          onChange={(e) => onEditingReviewChange('name', e.target.value)}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">Текст</Label>
                        <Textarea
                          value={editingReview.text}
                          onChange={(e) => onEditingReviewChange('text', e.target.value)}
                          rows={4}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">Рейтинг</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={editingReview.rating}
                          onChange={(e) => onEditingReviewChange('rating', parseInt(e.target.value))}
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
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-slate-900">{review.name}</div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Icon key={i} name="Star" size={14} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 mb-4">{review.text}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onStartEditing(review)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Icon name="Edit" size={14} className="mr-1" />
                          Изменить
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(review.id)}
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