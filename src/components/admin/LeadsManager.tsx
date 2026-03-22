'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Lead, api, API_URLS } from '@/lib/api';
import { formatDate } from '@/lib/dates';

interface LeadsManagerProps {
  leads: Lead[];
  onUpdateStatus: (leadId: number, status: string) => void;
  onMarkAsTargeted?: (lead: Lead) => void;
  token?: string;
}

// ── Config ─────────────────────────────────────────────────────────────────────
const COLUMNS = [
  { id: 'new',           label: 'Новые',       color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  { id: 'thinking',      label: 'Думают',      color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { id: 'trial',         label: 'На пробное',  color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  { id: 'enrolled',      label: 'Записались',  color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  { id: 'called_target', label: 'Целевые',     color: '#06b6d4', bg: '#ecfeff', border: '#a5f3fc' },
  { id: 'irrelevant',    label: 'Нецелевые',   color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
];

// Статусы только для карточки, без колонки на доске
const HIDDEN_STATUSES = [
  { id: 'trash', label: 'Мусор', color: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0' },
];

const ALL_STATUSES = [...COLUMNS, ...HIDDEN_STATUSES];

const COURSE_LABELS: Record<string, string> = {
  acting: 'Актёрское', oratory: 'Ораторское', 'acting-cards': 'Визитка', showreel: 'Шоурил',
};
const SOURCE_LABELS: Record<string, string> = {
  hero_acting: 'Hero / Актёрское', hero_oratory: 'Hero / Ораторское',
  home_acting: 'Главная / Актёрское', home_oratory: 'Главная / Ораторское',
  home_acting_cards: 'Главная / Визитка', acting_cards_hero: 'Hero / Визитка', home_cta: 'Главная / CTA',
};

function formatPhone(p: string) {
  const d = p.replace(/\D/g, '');
  if (d.length === 11) return `+${d[0]} (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7,9)}-${d.slice(9)}`;
  return p;
}

// ── Notes (localStorage) ───────────────────────────────────────────────────────
interface Note { id: string; text: string; createdAt: string; }

function getNotes(leadId: number): Note[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(`crm_notes_${leadId}`) ?? '[]'); } catch { return []; }
}
function saveNotes(leadId: number, notes: Note[]) {
  localStorage.setItem(`crm_notes_${leadId}`, JSON.stringify(notes));
}

// ── Tasks (localStorage) ────────────────────────────────────────────────────────
type TaskResult = 'reached' | 'no_answer';
interface Task {
  id: string;
  text: string;
  deadline: string;
  attempt: number;
  maxAttempts: number;
  completedAt?: string;
  result?: TaskResult;
  createdAt: string;
}

function getLeadTasks(leadId: number): Task[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(`crm_tasks_${leadId}`) ?? '[]'); } catch { return []; }
}
function saveLeadTasks(leadId: number, tasks: Task[]) {
  localStorage.setItem(`crm_tasks_${leadId}`, JSON.stringify(tasks));
}

function makeFirstTask(lead: Lead): Task {
  const deadline = new Date(new Date(lead.created_at).getTime() + 15 * 60 * 1000).toISOString();
  return { id: crypto.randomUUID(), text: 'Позвонить лиду', deadline, attempt: 1, maxAttempts: 4, createdAt: new Date().toISOString() };
}
function makeRetryTask(attempt: number): Task {
  const deadline = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
  return { id: crypto.randomUUID(), text: 'Перезвонить лиду', deadline, attempt, maxAttempts: 4, createdAt: new Date().toISOString() };
}

function formatDeadline(iso: string): { label: string; overdue: boolean; soon: boolean } {
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const overdue = diff < 0;
  const soon = !overdue && diff < 30 * 60 * 1000;
  let label = '';
  if (overdue) {
    label = hours > 0 ? `просрочено на ${hours} ч` : `просрочено на ${mins} мин`;
  } else {
    label = hours > 0 ? `через ${hours} ч` : mins <= 1 ? 'прямо сейчас' : `через ${mins} мин`;
  }
  return { label, overdue, soon };
}

// ── Detail Panel ───────────────────────────────────────────────────────────────
function LeadDetailPanel({
  lead,
  localStatus,
  localName,
  isDuplicate,
  onClose,
  onUpdateStatus,
  onUpdateName,
}: {
  lead: Lead;
  localStatus: string;
  localName?: string;
  isDuplicate?: boolean;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => void;
  onUpdateName: (id: number, name: string) => void;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ action: string; task?: { text: string; deadline: string }; status?: string; summary?: string } | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(localName ?? lead.name ?? '');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [confirmReached, setConfirmReached] = useState<string | null>(null); // taskId ожидающий подтверждения
  const nameInputRef = useRef<HTMLInputElement>(null);
  const col = ALL_STATUSES.find(c => c.id === localStatus) ?? COLUMNS[0];

  useEffect(() => { setNotes(getNotes(lead.id)); }, [lead.id]);
  useEffect(() => { setNameValue(localName ?? lead.name ?? ''); }, [lead.id, localName]);
  useEffect(() => { if (editingName) nameInputRef.current?.focus(); }, [editingName]);

  // Загрузка задач + автосоздание первой задачи для новых лидов
  useEffect(() => {
    const existing = getLeadTasks(lead.id);
    if (existing.length === 0 && localStatus === 'new') {
      const first = makeFirstTask(lead);
      saveLeadTasks(lead.id, [first]);
      setTasks([first]);
    } else {
      setTasks(existing);
    }
  }, [lead.id]);

  function completeTask(taskId: string, result: TaskResult) {
    const now = new Date().toISOString();
    const updated = tasks.map(t => t.id === taskId ? { ...t, completedAt: now, result } : t);

    if (result === 'no_answer') {
      const task = tasks.find(t => t.id === taskId)!;
      if (task.attempt < task.maxAttempts) {
        updated.push(makeRetryTask(task.attempt + 1));
      }
    }

    setTasks(updated);
    saveLeadTasks(lead.id, updated);
    setConfirmReached(null);
  }

  function saveName() {
    const trimmed = nameValue.trim();
    onUpdateName(lead.id, trimmed);
    setEditingName(false);
  }

  const utm = [
    { key: 'utm_source',   label: 'Source'   },
    { key: 'utm_medium',   label: 'Medium'   },
    { key: 'utm_campaign', label: 'Campaign' },
    { key: 'utm_content',  label: 'Content'  },
    { key: 'utm_term',     label: 'Term'     },
    { key: 'yclid',        label: 'yclid'    },
    { key: 'gclid',        label: 'gclid'    },
  ].filter(u => (lead as any)[u.key]);

  function addNote(text?: string) {
    const t = (text ?? noteText).trim();
    if (!t) return;
    const updated = [
      { id: Date.now().toString(), text: t, createdAt: new Date().toISOString() },
      ...notes,
    ];
    setNotes(updated);
    saveNotes(lead.id, updated);
    setNoteText('');
    setAiSuggestion(null);
  }

  function deleteNote(id: string) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(lead.id, updated);
  }

  async function addNoteWithAI() {
    const text = noteText.trim();
    if (!text) return;
    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const res = await fetch(API_URLS.analyzeNote, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: text }),
      });
      const data = await res.json();
      if (data.action === 'none') {
        // просто добавляем заметку без AI действий
        addNote(text);
      } else {
        setAiSuggestion(data);
      }
    } catch {
      addNote(text);
    } finally {
      setAiLoading(false);
    }
  }

  function applyAiSuggestion(confirm: boolean) {
    if (!aiSuggestion) return;
    // всегда сохраняем заметку
    addNote(noteText.trim());
    if (!confirm) return;

    if (aiSuggestion.task) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: aiSuggestion.task.text,
        deadline: aiSuggestion.task.deadline,
        attempt: 1,
        maxAttempts: 1,
        createdAt: new Date().toISOString(),
      };
      const updated = [...tasks, newTask];
      setTasks(updated);
      saveLeadTasks(lead.id, updated);
    }
    if (aiSuggestion.status) {
      onUpdateStatus(lead.id, aiSuggestion.status);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* panel */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200" style={{ background: col.bg }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: col.color }} />
            <span className="font-semibold text-slate-700 text-sm">{col.label}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* lead info */}
          <div>
            {editingName ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  ref={nameInputRef}
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                  className="flex-1 text-xl font-bold text-slate-900 border-b-2 border-blue-400 outline-none bg-transparent pb-0.5"
                  placeholder="Введите имя..."
                />
                <button onClick={saveName} className="text-green-500 hover:text-green-600 transition-colors">
                  <Icon name="Check" size={18} />
                </button>
                <button onClick={() => setEditingName(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Icon name="X" size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1 group">
                <h2 className="text-xl font-bold text-slate-900">
                  {localName ?? lead.name ?? <span className="italic text-slate-400">Без имени</span>}
                </h2>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-slate-300 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Изменить имя"
                >
                  <Icon name="Pencil" size={14} />
                </button>
              </div>
            )}
            <a href={`tel:${lead.phone}`} className="text-lg font-mono text-blue-600 hover:underline">
              {formatPhone(lead.phone)}
            </a>
          </div>

          {isDuplicate && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5 text-sm text-orange-700">
              <Icon name="Copy" size={15} className="shrink-0 text-orange-500" />
              <span>Дубль — этот номер уже есть в базе</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'BookOpen', label: 'Курс',     value: lead.course ? COURSE_LABELS[lead.course] ?? lead.course : '—' },
              { icon: 'MapPin',   label: 'Источник', value: lead.source ? SOURCE_LABELS[lead.source] ?? lead.source : '—' },
              { icon: 'Clock',    label: 'Создан',   value: formatDate(lead.created_at) },
              { icon: 'Hash',     label: 'ID',       value: `#${lead.id}` },
            ].map(row => (
              <div key={row.label} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Icon name={row.icon as any} size={12} />
                  {row.label}
                </div>
                <div className="text-sm font-medium text-slate-800">{row.value}</div>
              </div>
            ))}
          </div>

              {/* status change */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Статус</label>
            <Select value={localStatus} onValueChange={val => onUpdateStatus(lead.id, val)}>
              <SelectTrigger className="w-full border-2 bg-white font-semibold" style={{ borderColor: col.color, color: col.color }}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: col.color }} />
                  <span>{col.label}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {COLUMNS.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                      <span style={{ color: c.color }} className="font-medium">{c.label}</span>
                    </div>
                  </SelectItem>
                ))}
                <div className="my-1 border-t border-slate-200" />
                {HIDDEN_STATUSES.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                      <span style={{ color: c.color }} className="font-medium">{c.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* UTM */}
          {utm.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block flex items-center gap-1.5">
                <Icon name="Tag" size={12} />
                UTM метки
              </label>
              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                {utm.map(u => (
                  <div key={u.key} className="flex items-start gap-2 text-sm">
                    <span className="text-slate-400 w-20 shrink-0 text-xs font-medium mt-px">{u.label}</span>
                    <span className="text-slate-800 font-mono text-xs break-all">{(lead as any)[u.key]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* telegram */}
          <a
            href={`https://t.me/+${lead.phone.replace(/\D/g,'')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors bg-[#2CA5E0] hover:bg-[#1a96cc]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            Написать в Telegram
          </a>

          {/* tasks */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block flex items-center gap-1.5">
              <Icon name="CheckSquare" size={12} />
              Задачи
              {tasks.filter(t => !t.completedAt).length > 0 && (
                <span className="ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
                  {tasks.filter(t => !t.completedAt).length}
                </span>
              )}
            </label>

            <div className="space-y-2">
              {tasks.map(task => {
                const dl = formatDeadline(task.deadline);
                const isPending = !task.completedAt;
                return (
                  <div key={task.id} className={`rounded-xl border p-3 ${
                    !isPending ? 'bg-slate-50 border-slate-200 opacity-60' :
                    dl.overdue ? 'bg-red-50 border-red-200' :
                    dl.soon ? 'bg-orange-50 border-orange-200' :
                    'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${
                        !isPending && task.result === 'reached' ? 'bg-green-500' :
                        !isPending && task.result === 'no_answer' ? 'bg-slate-400' :
                        dl.overdue ? 'bg-red-400' : 'bg-blue-400'
                      }`}>
                        {task.attempt}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{task.text}</p>
                        <div className={`flex items-center gap-1 text-xs mt-0.5 ${
                          !isPending ? 'text-slate-400' :
                          dl.overdue ? 'text-red-500 font-semibold' :
                          dl.soon ? 'text-orange-500 font-semibold' :
                          'text-slate-500'
                        }`}>
                          <Icon name="Clock" size={11} />
                          {dl.label}
                        </div>
                        {!isPending && (
                          <span className={`inline-flex items-center gap-1 text-xs font-medium mt-1 px-2 py-0.5 rounded-full ${
                            task.result === 'reached' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {task.result === 'reached' ? '✓ Дозвонился' : '✗ Не дозвонился'}
                          </span>
                        )}
                      </div>
                    </div>

                    {isPending && confirmReached !== task.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmReached(task.id)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors"
                        >
                          ✓ Дозвонился
                        </button>
                        <button
                          onClick={() => completeTask(task.id, 'no_answer')}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          ✗ Не дозвонился
                        </button>
                      </div>
                    )}

                    {isPending && confirmReached === task.id && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-slate-600 mb-1">Сменить статус лида:</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {COLUMNS.filter(c => c.id !== 'new').map(c => (
                            <button key={c.id}
                              onClick={() => { completeTask(task.id, 'reached'); onUpdateStatus(lead.id, c.id); }}
                              className="py-1.5 px-2 rounded-lg text-xs font-semibold text-white transition-colors"
                              style={{ background: c.color }}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => { completeTask(task.id, 'reached'); }} className="w-full py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 transition-colors">
                          Оставить статус без изменений
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {tasks.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-sm bg-slate-50 rounded-xl">
                  Задач нет
                </div>
              )}

              {tasks.length > 0 && tasks.every(t => t.completedAt) && tasks[tasks.length - 1]?.result === 'no_answer' && tasks[tasks.length - 1]?.attempt >= 4 && (
                <div className="text-center py-3 text-xs text-red-500 bg-red-50 rounded-xl border border-red-200">
                  4 попытки исчерпаны — лид не отвечает
                </div>
              )}
            </div>
          </div>

          {/* notes */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">
              Заметки {notes.length > 0 && <span className="text-slate-400">({notes.length})</span>}
            </label>

            {/* add note */}
            <div className="space-y-2 mb-4">
              <textarea
                value={noteText}
                onChange={e => { setNoteText(e.target.value); setAiSuggestion(null); }}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote(); }}
                placeholder="Написать заметку... Gemini сам создаст задачу или сменит статус"
                rows={2}
                className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <div className="flex gap-2">
                <button
                  onClick={addNoteWithAI}
                  disabled={!noteText.trim() || aiLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-colors bg-violet-500 hover:bg-violet-600"
                >
                  {aiLoading
                    ? <><Icon name="Loader2" size={14} className="animate-spin" /> Анализирую...</>
                    : <><span>✨</span> Добавить умно</>
                  }
                </button>
                <button
                  onClick={() => addNote()}
                  disabled={!noteText.trim()}
                  className="px-3 rounded-xl text-white font-medium text-sm disabled:opacity-40 transition-colors bg-[#2CA5E0] hover:bg-[#1a96cc]"
                  title="Добавить без AI"
                >
                  <Icon name="Plus" size={18} />
                </button>
              </div>

              {/* AI suggestion */}
              {aiSuggestion && (
                <div className="rounded-xl border-2 border-violet-300 bg-violet-50 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-700">
                    <span>✨</span> Gemini предлагает:
                  </div>
                  <p className="text-sm text-slate-700">{aiSuggestion.summary}</p>
                  {aiSuggestion.task && (
                    <div className="flex items-center gap-1.5 text-xs bg-white rounded-lg px-2.5 py-1.5 border border-violet-200">
                      <Icon name="Clock" size={12} className="text-violet-500" />
                      <span className="font-medium text-slate-700">Задача:</span>
                      <span className="text-slate-600">{aiSuggestion.task.text} — {new Date(aiSuggestion.task.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                  {aiSuggestion.status && (
                    <div className="flex items-center gap-1.5 text-xs bg-white rounded-lg px-2.5 py-1.5 border border-violet-200">
                      <Icon name="ArrowRight" size={12} className="text-violet-500" />
                      <span className="font-medium text-slate-700">Статус:</span>
                      <span className="font-semibold" style={{ color: ALL_STATUSES.find(c => c.id === aiSuggestion.status)?.color }}>
                        {ALL_STATUSES.find(c => c.id === aiSuggestion.status)?.label ?? aiSuggestion.status}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => applyAiSuggestion(true)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white bg-violet-500 hover:bg-violet-600 transition-colors"
                    >
                      ✓ Применить
                    </button>
                    <button
                      onClick={() => applyAiSuggestion(false)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Только заметку
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* notes list */}
            {notes.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm bg-slate-50 rounded-xl">
                Заметок пока нет
              </div>
            ) : (
              <div className="space-y-2">
                {notes.map(note => (
                  <div key={note.id} className="bg-slate-50 rounded-xl p-3 group relative">
                    <p className="text-sm text-slate-900 whitespace-pre-wrap pr-6">{note.text}</p>
                    <p className="text-xs text-slate-500 mt-1.5">{formatDate(note.createdAt)}</p>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Lead Card ──────────────────────────────────────────────────────────────────
function LeadCard({
  lead, localStatus, localName, isDuplicate, onDragStart, onClick,
}: {
  lead: Lead; localStatus: string; localName?: string; isDuplicate?: boolean;
  onDragStart: (lead: Lead) => void;
  onClick: (lead: Lead) => void;
}) {
  const col = ALL_STATUSES.find(c => c.id === localStatus);
  const notesCount = typeof window !== 'undefined' ? getNotes(lead.id).length : 0;
  const pendingTasks = typeof window !== 'undefined'
    ? getLeadTasks(lead.id).filter(t => !t.completedAt) : [];
  const hasOverdue = pendingTasks.some(t => new Date(t.deadline) < new Date());
  const hasPending = pendingTasks.length > 0;
  const displayName = localName ?? lead.name;

  return (
    <div
      draggable
      onDragStart={e => { e.stopPropagation(); onDragStart(lead); }}
      onClick={() => onClick(lead)}
      className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 transition-all select-none"
    >
      <div className="flex items-start justify-between gap-1 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {displayName
              ? <p className="font-semibold text-slate-900 text-sm truncate">{displayName}</p>
              : <p className="text-slate-400 text-sm italic">Без имени</p>
            }
            {isDuplicate && (
              <span title="Дубль — этот номер уже есть в базе" className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-300">
                2x
              </span>
            )}
          </div>
          <p className="text-sm text-slate-700 font-mono">{formatPhone(lead.phone)}</p>
        </div>
        <span className="shrink-0 text-xs font-medium px-1.5 py-0.5 rounded-full border"
          style={{ background: col?.bg, borderColor: col?.border, color: col?.color }}>
          #{lead.id}
        </span>
      </div>

      <div className="space-y-1 mb-2">
        {lead.course && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Icon name="BookOpen" size={11} />{COURSE_LABELS[lead.course] ?? lead.course}
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Icon name="Clock" size={11} />{formatDate(lead.created_at)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <a
          href={`https://t.me/+${lead.phone.replace(/\D/g,'')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#2CA5E0] hover:bg-[#1a96cc] transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          TG
        </a>
        <div className="flex items-center gap-2">
          {hasOverdue && (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-500" title="Есть просроченная задача">
              <Icon name="Clock" size={11} />{pendingTasks.length}
            </span>
          )}
          {!hasOverdue && hasPending && (
            <span className="flex items-center gap-1 text-xs font-semibold text-orange-400" title="Есть активная задача">
              <Icon name="Clock" size={11} />{pendingTasks.length}
            </span>
          )}
          {notesCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Icon name="MessageSquare" size={11} />{notesCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Kanban Column ──────────────────────────────────────────────────────────────
function KanbanColumn({ col, leads, dragOverId, localStatuses, localNames, duplicatePhones, customLabel, onRenameColumn, onDragStart, onDragOver, onDrop, onCardClick, onUpdateStatus }: {
  col: typeof COLUMNS[number]; leads: Lead[]; dragOverId: string | null;
  localStatuses: Record<number, string>;
  localNames: Record<number, string>;
  duplicatePhones: Set<string>;
  customLabel?: string;
  onRenameColumn: (id: string, label: string) => void;
  onDragStart: (l: Lead) => void; onDragOver: (id: string) => void; onDrop: (id: string) => void;
  onCardClick: (l: Lead) => void; onUpdateStatus: (id: number, s: string) => void;
}) {
  const isOver = dragOverId === col.id;
  const displayLabel = customLabel ?? col.label;
  const [editing, setEditing] = useState(false);
  const [labelValue, setLabelValue] = useState(displayLabel);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLabelValue(displayLabel); }, [displayLabel]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  function saveLabel() {
    const trimmed = labelValue.trim();
    if (trimmed) onRenameColumn(col.id, trimmed);
    setEditing(false);
  }

  return (
    <div
      className="flex flex-col flex-1 min-w-[300px] rounded-2xl"
      style={{ background: col.bg, border: `1.5px solid ${isOver ? col.color : col.border}`, transition: 'border-color 0.15s' }}
      onDragOver={e => { e.preventDefault(); onDragOver(col.id); }}
      onDrop={e => { e.preventDefault(); onDrop(col.id); }}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: col.border }}>
        <div className="flex items-center gap-2 flex-1 min-w-0 group">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: col.color }} />
          {editing ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                ref={inputRef}
                value={labelValue}
                onChange={e => setLabelValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveLabel(); if (e.key === 'Escape') setEditing(false); }}
                onBlur={saveLabel}
                className="flex-1 text-sm font-semibold text-slate-800 bg-transparent border-b-2 outline-none min-w-0"
                style={{ borderColor: col.color }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <span className="font-semibold text-slate-800 text-sm truncate">{displayLabel}</span>
              <button
                onClick={() => { setLabelValue(displayLabel); setEditing(true); }}
                className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Переименовать"
              >
                <Icon name="Pencil" size={12} />
              </button>
            </div>
          )}
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0 ml-2" style={{ background: col.color }}>
          {leads.length}
        </span>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
        {isOver && (
          <div className="rounded-xl border-2 border-dashed h-14 flex items-center justify-center text-xs font-medium opacity-60"
            style={{ borderColor: col.color, color: col.color }}>
            Перетащить сюда
          </div>
        )}
        {leads.map(l => (
          <LeadCard
            key={l.id} lead={l}
            localStatus={localStatuses[l.id] ?? l.status}
            localName={localNames[l.id]}
            isDuplicate={duplicatePhones.has(l.phone.replace(/\D/g, ''))}
            onDragStart={onDragStart}
            onClick={onCardClick}
          />
        ))}
        {leads.length === 0 && !isOver && (
          <div className="text-center py-8 text-xs text-slate-400">Пусто</div>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function LeadsManager({ leads, onUpdateStatus, token }: LeadsManagerProps) {
  const [search, setSearch]           = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [draggedLead, setDraggedLead]   = useState<Lead | null>(null);
  const [dragOverCol, setDragOverCol]   = useState<string | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<number, string>>({});
  const [localNames, setLocalNames]     = useState<Record<number, string>>({});
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDupsOnly, setShowDupsOnly] = useState(false);
  const [columnLabels, setColumnLabels] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('crm_column_labels') ?? '{}'); } catch { return {}; }
  });

  function handleRenameColumn(id: string, label: string) {
    const next = { ...columnLabels, [id]: label };
    setColumnLabels(next);
    localStorage.setItem('crm_column_labels', JSON.stringify(next));
  }

  function getStatus(lead: Lead) { return localStatuses[lead.id] ?? lead.status; }
  function getName(lead: Lead) { return localNames[lead.id] ?? lead.name; }

  // Просроченные задачи по всем лидам
  const overdueTasksCount = useMemo(() => {
    const now = new Date();
    return leads.reduce((acc, l) => {
      const overdue = getLeadTasks(l.id).filter(t => !t.completedAt && new Date(t.deadline) < now).length;
      return acc + overdue;
    }, 0);
  }, [leads]);

  // Телефоны, встречающиеся больше одного раза (цифры без форматирования)
  const duplicatePhones = useMemo(() => {
    const count: Record<string, number> = {};
    leads.forEach(l => {
      const digits = l.phone.replace(/\D/g, '');
      count[digits] = (count[digits] ?? 0) + 1;
    });
    return new Set(Object.entries(count).filter(([, n]) => n > 1).map(([d]) => d));
  }, [leads]);

  const filtered = useMemo(() => {
    let res = leads;
    if (search.trim()) {
      const q = search.toLowerCase();
      const qDigits = q.replace(/\D/g, '');
      res = res.filter(l => {
        const phoneDigits = l.phone.replace(/\D/g, '');
        return (
          phoneDigits.includes(qDigits || q) ||
          l.phone.includes(q) ||
          (getName(l) ?? '').toLowerCase().includes(q)
        );
      });
    }
    if (filterCourse !== 'all') res = res.filter(l => l.course === filterCourse);
    if (showDupsOnly) res = res.filter(l => duplicatePhones.has(l.phone.replace(/\D/g, '')));
    return res;
  }, [leads, search, filterCourse, localNames, showDupsOnly, duplicatePhones]);

  const byStatus = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    COLUMNS.forEach(c => { map[c.id] = []; });
    filtered.forEach(l => {
      const s = getStatus(l);
      if (HIDDEN_STATUSES.some(h => h.id === s)) return; // не показывать на доске
      (map[s] ?? map['new']).push(l);
    });
    return map;
  }, [filtered, localStatuses]);

  function handleUpdateStatus(id: number, status: string) {
    setLocalStatuses(prev => ({ ...prev, [id]: status }));
    onUpdateStatus(id, status);
    if (selectedLead?.id === id) setSelectedLead(prev => prev ? { ...prev, status } : null);
  }

  async function handleUpdateName(id: number, name: string) {
    setLocalNames(prev => ({ ...prev, [id]: name }));
    if (token) {
      try { await api.leads.updateName(id, name, token); } catch { /* silent */ }
    }
  }

  const today = new Date().toDateString();

  return (
    <div className="flex flex-col h-full" onDragEnd={() => { setDraggedLead(null); setDragOverCol(null); }}>

      {/* stats */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { label: 'Всего',      value: leads.length,                                           color: '#64748b' },
          { label: 'Сегодня',    value: leads.filter(l => new Date(l.created_at).toDateString() === today).length, color: '#6366f1' },
          { label: 'Новых',      value: leads.filter(l => getStatus(l) === 'new').length,       color: '#3b82f6' },
          { label: 'На пробное', value: leads.filter(l => getStatus(l) === 'trial').length,     color: '#10b981' },
          { label: 'Записались', value: leads.filter(l => getStatus(l) === 'enrolled').length,  color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2">
            <span className="text-xl font-bold" style={{ color: s.color }}>{s.value}</span>
            <span className="text-xs text-slate-500">{s.label}</span>
          </div>
        ))}
        {overdueTasksCount > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            <Icon name="Clock" size={16} className="text-red-500" />
            <span className="text-xl font-bold text-red-500">{overdueTasksCount}</span>
            <span className="text-xs text-red-500">Просрочено</span>
          </div>
        )}
        {duplicatePhones.size > 0 && (
          <button
            onClick={() => setShowDupsOnly(v => !v)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 border transition-colors ${
              showDupsOnly
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'bg-white border-orange-300 text-orange-600 hover:bg-orange-50'
            }`}
          >
            <Icon name="Copy" size={14} />
            <span className="text-xl font-bold">{duplicatePhones.size}</span>
            <span className="text-xs">Дублей</span>
          </button>
        )}
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Поиск по имени или телефону..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-300 h-9 text-sm text-slate-900 placeholder:text-slate-400" />
        </div>
        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger className="w-[180px] bg-white border-slate-300 h-9 text-sm text-slate-900">
            <SelectValue placeholder="Все курсы" />
          </SelectTrigger>
          <SelectContent className="text-slate-900">
            <SelectItem value="all">Все курсы</SelectItem>
            <SelectItem value="acting">Актёрское мастерство</SelectItem>
            <SelectItem value="oratory">Ораторское мастерство</SelectItem>
            <SelectItem value="acting-cards">Актёрская визитка</SelectItem>
          </SelectContent>
        </Select>
        {(search || filterCourse !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterCourse('all'); }} className="text-slate-500 gap-1 h-9">
            <Icon name="X" size={14} /> Сбросить
          </Button>
        )}
        <span className="text-sm text-slate-500 self-center ml-auto">{filtered.length} из {leads.length}</span>
      </div>

      {/* board */}
      <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id} col={col}
            leads={byStatus[col.id] ?? []}
            dragOverId={dragOverCol}
            localStatuses={localStatuses}
            localNames={localNames}
            duplicatePhones={duplicatePhones}
            customLabel={columnLabels[col.id]}
            onRenameColumn={handleRenameColumn}
            onDragStart={l => setDraggedLead(l)}
            onDragOver={id => setDragOverCol(id)}
            onDrop={colId => {
              if (draggedLead && getStatus(draggedLead) !== colId) handleUpdateStatus(draggedLead.id, colId);
              setDraggedLead(null); setDragOverCol(null);
            }}
            onCardClick={l => setSelectedLead(l)}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>

      {/* detail panel */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          localStatus={localStatuses[selectedLead.id] ?? selectedLead.status}
          localName={localNames[selectedLead.id]}
          isDuplicate={duplicatePhones.has(selectedLead.phone.replace(/\D/g, ''))}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateName={handleUpdateName}
        />
      )}
    </div>
  );
}
