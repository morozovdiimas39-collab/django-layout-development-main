'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { API_URLS, api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const LS_PROFILES = 'chatbot_studio_profiles';

const META_SYSTEM = `Ты — архитектор чат-ботов для школы актёрского и ораторского мастерства (Казбек Меретуков, сайт с курсами).
Помогаешь составлять system instruction (системный промпт) для Telegram-ботов на базе Google Gemini.

Правила:
- Отвечай по-русски, по делу, структурированно.
- Когда пользователь описывает задачу бота — предлагай готовый текст system prompt в блоке markdown \`\`\` ... \`\`\`.
- Учитывай: обращение на «вы», умеренно эмодзи, сценарий записи на пробное, отработка возражений, не раскрывать что это бот/нейросеть.
- Если спрашивают про деплой — напомни: Python-функция в Yandex Cloud, webhook Telegram, переменные GEMINI_API_KEY, HTTPS_PROXY.
- Можешь предложить разные тона: строгий / дружелюбный / продающий.

Если пользователь прислал черновик промпта — улучши и сократи при необходимости.`;

export interface BotProfile {
  id: string;
  name: string;
  systemPrompt: string;
  notes: string;
  updatedAt: string;
}

function loadProfiles(): BotProfile[] {
  try {
    const raw = localStorage.getItem(LS_PROFILES);
    if (!raw) return [];
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function saveProfiles(list: BotProfile[]) {
  localStorage.setItem(LS_PROFILES, JSON.stringify(list));
}

interface Props {
  token: string;
}

export default function ChatBotStudioManager({ token }: Props) {
  const [profiles, setProfiles] = useState<BotProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [botName, setBotName] = useState('Новый бот');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [notes, setNotes] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    {
      role: 'model',
      content:
        'Привет! Опиши, для какого курса или сценария нужен бот (ораторика, актёрка, визитки, поддержка). Я помогу собрать system prompt под Gemini и Telegram.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentKey, setContentKey] = useState('bot_system_instruction_draft');
  const bottomRef = useRef<HTMLDivElement>(null);

  const studioUrl = API_URLS.botStudio;
  const studioReady = !studioUrl.includes('REPLACE_');

  useEffect(() => {
    setProfiles(loadProfiles());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function applyProfile(p: BotProfile) {
    setActiveId(p.id);
    setBotName(p.name);
    setSystemPrompt(p.systemPrompt);
    setNotes(p.notes);
  }

  function newProfile() {
    const id = crypto.randomUUID();
    const p: BotProfile = {
      id,
      name: 'Новый бот',
      systemPrompt: '',
      notes: '',
      updatedAt: new Date().toISOString(),
    };
    const next = [...profiles, p];
    setProfiles(next);
    saveProfiles(next);
    applyProfile(p);
    toast({ title: 'Создан черновик' });
  }

  function saveCurrentProfile() {
    if (!activeId) {
      const id = crypto.randomUUID();
      const p: BotProfile = {
        id,
        name: botName,
        systemPrompt,
        notes,
        updatedAt: new Date().toISOString(),
      };
      const next = [...profiles, p];
      setProfiles(next);
      saveProfiles(next);
      setActiveId(id);
      toast({ title: 'Черновик создан и сохранён' });
      return;
    }
    const next = profiles.map(p =>
      p.id === activeId
        ? { ...p, name: botName, systemPrompt, notes, updatedAt: new Date().toISOString() }
        : p
    );
    setProfiles(next);
    saveProfiles(next);
    toast({ title: 'Черновик сохранён' });
  }

  async function sendChat() {
    const text = input.trim();
    if (!text || loading) return;
    if (!studioReady) {
      toast({ title: 'Не настроен URL функции', description: 'Задеплой admin-bot-studio и укажи URL в api.ts', variant: 'destructive' });
      return;
    }

    const nextMsgs = [...messages, { role: 'user' as const, content: text }];
    setMessages(nextMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(studioUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMsgs,
          system_instruction: META_SYSTEM,
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || 'Пустой ответ';
      if (data.error && !data.reply) {
        toast({ title: 'Ошибка Gemini', description: String(data.error), variant: 'destructive' });
      }
      setMessages(m => [...m, { role: 'model', content: reply }]);
    } catch (e) {
      toast({ title: 'Сеть', description: String(e), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function saveToSiteContent() {
    if (!contentKey.trim()) {
      toast({ title: 'Укажи ключ', variant: 'destructive' });
      return;
    }
    try {
      await api.content.update(contentKey.trim(), systemPrompt, token);
      toast({ title: 'Сохранено в контент', description: `Ключ: ${contentKey}` });
    } catch (e) {
      toast({ title: 'Ошибка', description: String(e), variant: 'destructive' });
    }
  }

  function insertLastAssistant() {
    const last = [...messages].reverse().find(m => m.role === 'model');
    if (!last) return;
    setSystemPrompt(prev => (prev ? `${prev}\n\n---\n\n${last.content}` : last.content));
    toast({ title: 'Текст ответа добавлен в промпт' });
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Конструктор чат-ботов</h2>
        <p className="text-sm text-slate-500 mt-1">
          Диалог с Gemini помогает собрать system prompt. Черновики хранятся в браузере; промпт можно сохранить в контент сайта и потом перенести в код облачной функции Telegram.
        </p>
      </div>

      {!studioReady && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Функция не подключена.</strong> Задеплой <code className="bg-amber-100 px-1 rounded">backend/admin-bot-studio</code>, сделай её публичной,
          добавь <code className="bg-amber-100 px-1 rounded">GEMINI_API_KEY</code> и <code className="bg-amber-100 px-1 rounded">HTTPS_PROXY</code>, затем подставь URL в{' '}
          <code className="bg-amber-100 px-1 rounded">API_URLS.botStudio</code> в <code className="bg-amber-100 px-1 rounded">src/lib/api.ts</code>.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Чат */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden min-h-[420px]">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Icon name="MessageSquare" size={18} className="text-violet-600" />
            <span className="font-semibold text-slate-800">Ассистент-архитектор</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[480px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user' ? 'bg-violet-600 text-white ml-8' : 'bg-slate-100 text-slate-800 mr-4'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Icon name="Loader2" size={16} className="animate-spin" />
                Думаю…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendChat();
                }
              }}
              placeholder="Опиши бота или задай вопрос…"
              rows={2}
              className="flex-1 resize-none bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-400"
            />
            <Button onClick={sendChat} disabled={loading || !input.trim()} className="self-end shrink-0">
              <Icon name="Send" size={16} />
            </Button>
          </div>
        </div>

        {/* Промпт и черновики — светлая карточка как слева (не тянем тёмный bg-background) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
          <div className="px-0 py-0 border-b border-slate-100 pb-3 -mt-1 flex flex-wrap gap-2 items-center">
            <Button variant="outline" size="sm" onClick={newProfile} className="border-slate-300">
              <Icon name="Plus" size={14} className="mr-1" />
              Новый черновик
            </Button>
            <Button variant="secondary" size="sm" onClick={saveCurrentProfile} className="bg-slate-100 text-slate-800 hover:bg-slate-200">
              <Icon name="Save" size={14} className="mr-1" />
              Сохранить черновик
            </Button>
            <select
              className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 min-h-9"
              value={activeId ?? ''}
              onChange={e => {
                const p = profiles.find(x => x.id === e.target.value);
                if (p) applyProfile(p);
              }}
            >
              <option value="">— черновики —</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-slate-700">Название бота</Label>
            <Input
              value={botName}
              onChange={e => setBotName(e.target.value)}
              className="mt-1 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-slate-700">System prompt (будущего бота)</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-violet-700 hover:text-violet-900" onClick={insertLastAssistant}>
                + последний ответ ассистента
              </Button>
            </div>
            <Textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={12}
              placeholder="Сюда копируй готовый промпт из чата или пиши вручную…"
              className="font-mono text-xs bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-400"
            />
          </div>

          <div>
            <Label className="text-slate-700">Заметки (webhook, токен, путь к index.py)</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="mt-1 text-sm bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-400"
            />
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/80">
            <Label className="text-slate-700">Сохранить промпт в контент сайта</Label>
            <div className="flex gap-2">
              <Input
                value={contentKey}
                onChange={e => setContentKey(e.target.value)}
                placeholder="ключ, например bot_system_telegram_oratory"
                className="flex-1 text-sm font-mono bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-400"
              />
              <Button onClick={saveToSiteContent} variant="default">
                В контент
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Значение появится в разделе «Контент»; Telegram-функцию всё равно нужно обновить вручную или читать ключ из БД при желании.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
