import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { FAQ } from '@/lib/api';

interface FAQManagerProps {
  faqs: FAQ[];
  newFAQ: {
    question: string;
    answer: string;
  };
  editingFAQ: FAQ | null;
  onNewFAQChange: (field: string, value: string) => void;
  onEditingFAQChange: (field: string, value: string) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onStartEditing: (faq: FAQ) => void;
  onCancelEditing: () => void;
}

export default function FAQManager({
  faqs,
  newFAQ,
  editingFAQ,
  onNewFAQChange,
  onEditingFAQChange,
  onCreate,
  onUpdate,
  onDelete,
  onStartEditing,
  onCancelEditing
}: FAQManagerProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Добавить FAQ</CardTitle>
          <CardDescription className="text-slate-600">Новый вопрос и ответ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-700">Вопрос</Label>
            <Input
              value={newFAQ.question}
              onChange={(e) => onNewFAQChange('question', e.target.value)}
              placeholder="Сколько длится курс?"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-700">Ответ</Label>
            <Textarea
              value={newFAQ.answer}
              onChange={(e) => onNewFAQChange('answer', e.target.value)}
              placeholder="Курс длится 8 недель..."
              rows={4}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <Button onClick={onCreate} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить FAQ
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900">Часто задаваемые вопросы ({faqs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id}>
                {editingFAQ?.id === faq.id ? (
                  <Card className="border-slate-200 bg-slate-50/50">
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <Label className="text-slate-700">Вопрос</Label>
                        <Input
                          value={editingFAQ.question}
                          onChange={(e) => onEditingFAQChange('question', e.target.value)}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700">Ответ</Label>
                        <Textarea
                          value={editingFAQ.answer}
                          onChange={(e) => onEditingFAQChange('answer', e.target.value)}
                          rows={4}
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
                      <div className="flex items-start gap-3 mb-3">
                        <Icon name="HelpCircle" className="text-slate-500 mt-1" size={20} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                          <p className="text-sm text-slate-600">{faq.answer}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onStartEditing(faq)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Icon name="Edit" size={14} className="mr-1" />
                          Изменить
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(faq.id)}
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
