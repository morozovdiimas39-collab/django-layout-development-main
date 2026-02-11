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
      <Card>
        <CardHeader>
          <CardTitle>Добавить отзыв</CardTitle>
          <CardDescription>Новый отзыв студента</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Имя автора</Label>
            <Input
              value={newReview.name}
              onChange={(e) => onNewReviewChange('name', e.target.value)}
              placeholder="Иван Иванов"
            />
          </div>
          <div>
            <Label>Текст отзыва</Label>
            <Textarea
              value={newReview.text}
              onChange={(e) => onNewReviewChange('text', e.target.value)}
              placeholder="Отличный курс..."
              rows={4}
            />
          </div>
          <div>
            <Label>Рейтинг (1-5)</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) => onNewReviewChange('rating', parseInt(e.target.value))}
            />
          </div>
          <Button onClick={onCreate} className="w-full">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить отзыв
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Отзывы ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id}>
                {editingReview?.id === review.id ? (
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <Label>Имя автора</Label>
                        <Input
                          value={editingReview.name}
                          onChange={(e) => onEditingReviewChange('name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Текст</Label>
                        <Textarea
                          value={editingReview.text}
                          onChange={(e) => onEditingReviewChange('text', e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label>Рейтинг</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={editingReview.rating}
                          onChange={(e) => onEditingReviewChange('rating', parseInt(e.target.value))}
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
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold">{review.name}</div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Icon key={i} name="Star" size={14} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-4">{review.text}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStartEditing(review)}
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