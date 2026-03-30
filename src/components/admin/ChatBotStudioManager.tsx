'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { API_URLS, api, type ChatBot } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface Props {
  token: string;
}

/** Админка: что отправить пользователю в Telegram после нажатия Start (/start). Без нейросетей и промптов. */
export default function ChatBotStudioManager({ token }: Props) {
  const [bots, setBots] = useState<ChatBot[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [name, setName] = useState('Бот');
  const [startMessage, setStartMessage] = useState('');
  const [loadingBots, setLoadingBots] = useState(true);

  const chatBotsApiReady = !API_URLS.chatBots.includes('REPLACE_');

  const resetEmptyForm = useCallback(() => {
    setActiveId(null);
    setName('Бот');
    setStartMessage('');
  }, []);

  const refreshBots = useCallback(
    async (preferId?: number | null) => {
      if (!chatBotsApiReady) {
        setBots([]);
        setLoadingBots(false);
        resetEmptyForm();
        return;
      }
      setLoadingBots(true);
      try {
        const list = await api.chatBots.list(token);
        const normalized = list.map(normalizeChatBotRow);
        setBots(normalized);
        if (normalized.length === 0) {
          resetEmptyForm();
        } else {
          setActiveId((prev) => {
            if (preferId != null && normalized.some((x) => x.id === preferId)) return preferId;
            if (prev !== null && normalized.some((x) => x.id === prev)) return prev;
            return normalized[0].id;
          });
        }
      } catch (e) {
        toast({
          title: 'Не удалось загрузить',
          description: String(e),
          variant: 'destructive',
        });
        setBots([]);
        resetEmptyForm();
      } finally {
        setLoadingBots(false);
      }
    },
    [token, chatBotsApiReady, resetEmptyForm]
  );

  useEffect(() => {
    void refreshBots();
  }, [refreshBots]);

  useEffect(() => {
    if (activeId === null) return;
    const b = bots.find((x) => x.id === activeId);
    if (!b) return;
    setName(b.name);
    setStartMessage(b.start_message ?? '');
  }, [activeId, bots]);

  async function newBot() {
    if (!chatBotsApiReady) {
      toast({ title: 'Функция chat-bots не подключена', variant: 'destructive' });
      return;
    }
    try {
      const created = await api.chatBots.create({ name: 'Новый бот', start_message: '' }, token);
      await refreshBots(normalizeChatBotRow(created).id);
      toast({ title: 'Добавлено' });
    } catch (e) {
      toast({ title: 'Ошибка', description: String(e), variant: 'destructive' });
    }
  }

  async function saveBot() {
    if (!chatBotsApiReady || activeId === null) {
      toast({ title: 'Выбери запись или создай новую', variant: 'destructive' });
      return;
    }
    const existing = bots.find((b) => b.id === activeId);
    if (!existing) return;
    try {
      await api.chatBots.update(
        {
          ...existing,
          name: name.trim() || 'Бот',
          start_message: startMessage,
        },
        token
      );
      await refreshBots(activeId);
      toast({ title: 'Сохранено' });
    } catch (e) {
      toast({ title: 'Ошибка сохранения', description: String(e), variant: 'destructive' });
    }
  }

  async function deleteBot() {
    if (!chatBotsApiReady || activeId === null) return;
    if (!confirm('Удалить эту запись?')) return;
    try {
      await api.chatBots.delete(activeId, token);
      await refreshBots();
      toast({ title: 'Удалено' });
    } catch (e) {
      toast({ title: 'Ошибка', description: String(e), variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Telegram: ответ после /start</h2>
        <p className="text-sm text-slate-500 mt-1">
          Заранее задаёте текст (и при необходимости несколько вариантов для разных ботов). Облачная функция бота должна брать сообщение отсюда и отправлять его пользователю при старте диалога.
        </p>
      </div>

      {!chatBotsApiReady && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Подключи <code className="bg-amber-100 px-1 rounded">backend/chat-bots</code>, миграции{' '}
          <code className="bg-amber-100 px-1 rounded">V0028</code> и <code className="bg-amber-100 px-1 rounded">V0029</code>, затем URL в{' '}
          <code className="bg-amber-100 px-1 rounded">API_URLS.chatBots</code> в <code className="bg-amber-100 px-1 rounded">api.ts</code>.
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <div className="flex flex-wrap gap-2 items-center border-b border-slate-100 pb-3">
          <Button variant="outline" size="sm" onClick={() => void newBot()} disabled={!chatBotsApiReady || loadingBots}>
            <Icon name="Plus" size={14} className="mr-1" />
            Добавить
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void saveBot()}
            disabled={!chatBotsApiReady || activeId === null}
            className="bg-slate-100 text-slate-800"
          >
            <Icon name="Save" size={14} className="mr-1" />
            Сохранить
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void deleteBot()}
            disabled={!chatBotsApiReady || activeId === null}
            className="border-red-200 text-red-700"
          >
            <Icon name="Trash2" size={14} className="mr-1" />
            Удалить
          </Button>
          <select
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 min-h-9 min-w-[200px] ml-auto"
            value={activeId ?? ''}
            disabled={loadingBots}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                resetEmptyForm();
                return;
              }
              setActiveId(Number(v));
            }}
          >
            <option value="">{loadingBots ? 'Загрузка…' : '— выбрать —'}</option>
            {bots.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} (#{b.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-slate-700">Название (для себя в админке)</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 bg-white border-slate-300 text-slate-900"
            placeholder="Например: основной бот школы"
          />
        </div>

        <div>
          <Label className="text-slate-700">Текст, который уйдёт пользователю после /start</Label>
          <Textarea
            value={startMessage}
            onChange={(e) => setStartMessage(e.target.value)}
            rows={14}
            className="mt-1 text-sm bg-white border-slate-300 text-slate-900"
            placeholder="Привет! Здесь вы можете записаться на пробное…"
          />
          <p className="text-xs text-slate-500 mt-2">
            Можно использовать переносы строк. Кнопки и форматирование задаются в коде Telegram-бота, если понадобятся.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Совместимость, если бэкенд ещё отдаёт старое поле до миграции V0029 */
function normalizeChatBotRow(row: ChatBot | Record<string, unknown>): ChatBot {
  const r = row as Record<string, unknown>;
  const start =
    typeof r.start_message === 'string'
      ? r.start_message
      : typeof r.system_prompt === 'string'
        ? r.system_prompt
        : '';
  return {
    id: Number(r.id),
    name: String(r.name ?? 'Бот'),
    start_message: start,
    order_num: Number(r.order_num ?? 0),
    created_at: r.created_at as string | undefined,
    updated_at: r.updated_at as string | undefined,
  };
}
