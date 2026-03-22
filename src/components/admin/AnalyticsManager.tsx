'use client';

import { useMemo, useState } from 'react';
import { Lead } from '@/lib/api';
import { formatDate } from '@/lib/dates';
import Icon from '@/components/ui/icon';

// ── Yandex Direct Drill-Down ───────────────────────────────────────────────────
type DrillLevel = 'network' | 'campaign' | 'group' | 'keyword';

interface Crumb { level: DrillLevel; value: string; label: string; }

function getNetwork(lead: Lead): string {
  return (lead as any).utm_term ? 'Поиск' : 'РСЯ';
}

function DrillRow({ label, total, trial, enrolled, thinking, onClick }: {
  label: string; total: number; trial: number; enrolled: number; thinking: number;
  onClick?: () => void;
}) {
  return (
    <tr className={`border-b border-slate-100 transition-colors ${onClick ? 'hover:bg-blue-50 cursor-pointer' : 'hover:bg-slate-50'}`}
      onClick={onClick}>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-slate-800">{label || '—'}</span>
          {onClick && <Icon name="ChevronRight" size={14} className="text-slate-400" />}
        </div>
      </td>
      <td className="py-2.5 px-3 text-right text-slate-600">{total}</td>
      <td className="py-2.5 px-3 text-right"><span className="text-amber-600 font-medium">{thinking}</span></td>
      <td className="py-2.5 px-3 text-right"><span className="text-emerald-600 font-medium">{trial}</span></td>
      <td className="py-2.5 px-3 text-right"><span className="text-violet-600 font-medium">{enrolled}</span></td>
      <td className="py-2.5 px-3 text-right">
        <span className={`font-bold text-sm ${pct(enrolled, total) >= 10 ? 'text-emerald-600' : pct(enrolled, total) >= 3 ? 'text-amber-600' : 'text-slate-400'}`}>
          {pct(enrolled, total)}%
        </span>
      </td>
    </tr>
  );
}

function DrillTable({ title, rows, onDrill }: {
  title: string;
  rows: { key: string; label: string; leads: Lead[] }[];
  onDrill?: (key: string, label: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{title}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Название</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500">Лидов</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500">Думают</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500">Пробное</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500">Записались</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500">Конверсия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <DrillRow
                key={r.key} label={r.label} total={r.leads.length}
                trial={r.leads.filter(l => l.status === 'trial').length}
                enrolled={r.leads.filter(l => l.status === 'enrolled').length}
                thinking={r.leads.filter(l => l.status === 'thinking').length}
                onClick={onDrill ? () => onDrill(r.key, r.label) : undefined}
              />
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="text-center py-6 text-slate-400 text-sm">Нет данных</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function YandexDrillDown({ leads, onClose }: { leads: Lead[]; onClose: () => void }) {
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  function drill(level: DrillLevel, value: string, label: string) {
    setCrumbs(prev => {
      const idx = prev.findIndex(c => c.level === level);
      if (idx !== -1) return prev.slice(0, idx + 1).map((c, i) => i === idx ? { level, value, label } : c);
      return [...prev, { level, value, label }];
    });
  }

  function goToCrumb(idx: number) {
    setCrumbs(prev => prev.slice(0, idx + 1));
  }

  // Фильтруем лиды по текущему пути
  const current = useMemo(() => {
    let res = leads;
    crumbs.forEach(c => {
      if (c.level === 'network') res = res.filter(l => getNetwork(l) === c.value);
      if (c.level === 'campaign') res = res.filter(l => ((l as any).utm_campaign ?? '') === c.value);
      if (c.level === 'group') res = res.filter(l => ((l as any).utm_content ?? '') === c.value);
    });
    return res;
  }, [leads, crumbs]);

  const lastCrumb = crumbs[crumbs.length - 1];
  const currentLevel: DrillLevel = !lastCrumb ? 'network'
    : lastCrumb.level === 'network' ? 'campaign'
    : lastCrumb.level === 'campaign' ? 'group'
    : 'keyword';

  const isRSY = crumbs.find(c => c.level === 'network')?.value === 'РСЯ';

  const rows = useMemo(() => {
    if (currentLevel === 'network') {
      return ['Поиск', 'РСЯ'].map(net => ({
        key: net, label: net === 'Поиск' ? '🔍 Поиск' : '📱 РСЯ',
        leads: current.filter(l => getNetwork(l) === net),
      })).filter(r => r.leads.length > 0);
    }
    if (currentLevel === 'campaign') {
      const g = groupBy(current, l => (l as any).utm_campaign ?? '');
      return Object.entries(g).map(([k, v]) => ({ key: k, label: k || 'Без кампании', leads: v }))
        .sort((a, b) => b.leads.length - a.leads.length);
    }
    if (currentLevel === 'group') {
      const g = groupBy(current, l => (l as any).utm_content ?? '');
      return Object.entries(g).map(([k, v]) => ({ key: k, label: k || 'Без группы', leads: v }))
        .sort((a, b) => b.leads.length - a.leads.length);
    }
    // keyword / placement
    const field = isRSY ? 'utm_content' : 'utm_term';
    const g = groupBy(current, l => (l as any)[field] ?? '');
    return Object.entries(g).map(([k, v]) => ({ key: k, label: k || '—', leads: v }))
      .sort((a, b) => b.leads.length - a.leads.length);
  }, [current, currentLevel, isRSY]);

  const levelTitle: Record<DrillLevel, string> = {
    network: 'Тип трафика',
    campaign: 'Кампании',
    group: 'Группы объявлений',
    keyword: isRSY ? 'Площадки (РСЯ)' : 'Ключевые запросы',
  };

  const canDrillDeeper = currentLevel !== 'keyword';

  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onClose} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800">
            🟡 Яндекс.Директ
          </button>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              <Icon name="ChevronRight" size={14} className="text-slate-400" />
              <button onClick={() => goToCrumb(i)} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                {c.label}
              </button>
            </span>
          ))}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <Icon name="X" size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 text-sm flex-wrap">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{current.length} лидов</span>
        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
          {current.filter(l => l.status === 'trial').length} на пробное
        </span>
        <span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full font-medium">
          {current.filter(l => l.status === 'enrolled').length} записались
        </span>
      </div>

      <DrillTable
        title={levelTitle[currentLevel]}
        rows={rows}
        onDrill={canDrillDeeper ? (key, label) => drill(currentLevel, key, label) : undefined}
      />
    </div>
  );
}

interface Props { leads: Lead[]; }

const STATUS_LABELS: Record<string, string> = {
  new: 'Новые', thinking: 'Думают', trial: 'На пробное',
  enrolled: 'Записались', called_target: 'Целевые', irrelevant: 'Нецелевые', trash: 'Мусор',
};
const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6', thinking: '#f59e0b', trial: '#10b981',
  enrolled: '#8b5cf6', called_target: '#06b6d4', irrelevant: '#ef4444', trash: '#94a3b8',
};
const COURSE_LABELS: Record<string, string> = {
  acting: 'Актёрское', oratory: 'Ораторское', 'acting-cards': 'Визитка', showreel: 'Шоурил',
};

type Period = '7d' | '30d' | '90d' | 'all' | 'custom';

// Каналы трафика
const CHANNEL_ICONS: Record<string, string> = {
  'Яндекс.Директ':     '🟡',
  'Google Ads':        '🔵',
  'ВКонтакте':         '🔷',
  'Instagram':         '🟣',
  'Facebook':          '🔹',
  'Telegram':          '✈️',
  'Органика':          '🌱',
  'Органика (Яндекс)': '🌱',
  'Органика (Google)': '🌱',
  'Яндекс Карты':      '📍',
  '2ГИС':              '📍',
  'Прямой заход':      '⚡',
  'Нет меток':         '❓',
};

const UTM_SOURCE_LABELS: Record<string, string> = {
  yandex:    'Яндекс.Директ',
  google:    'Google Ads',
  vk:        'ВКонтакте',
  instagram: 'Instagram',
  facebook:  'Facebook',
  telegram:  'Telegram',
  direct:    'Прямой',
  organic:   'Органика',
};

// Все внутренние источники (место на сайте) → русский
const INTERNAL_SOURCE_LABELS: Record<string, string> = {
  hero_acting:       'Hero / Актёрское',
  hero_oratory:      'Hero / Ораторское',
  home_acting:       'Главная / Актёрское',
  home_oratory:      'Главная / Ораторское',
  home_acting_cards: 'Главная / Визитка',
  acting_cards_hero: 'Hero / Визитка',
  home_cta:          'Главная / CTA',
  header:            'Шапка сайта',
  skills_oratory:    'Секция навыков / Ораторское',
  skills_realtors:   'Секция навыков / Риелторы',
  skills_acting:     'Секция навыков / Актёрское',
  for_whom_acting:   'Для кого / Актёрское',
  for_whom_oratory:  'Для кого / Ораторское',
  contact_oratory:   'Контакты / Ораторское',
  contact_acting:    'Контакты / Актёрское',
  lead_form_oratory: 'Форма записи / Ораторское',
  lead_form_acting:  'Форма записи / Актёрское',
  hero_realtors:     'Hero / Риелторы',
  organic:           'Органика',
  direct:            'Прямой заход',
};

function parseReferrerChannel(ref: string): string | null {
  if (!ref) return null;
  try {
    const host = new URL(ref).hostname.replace('www.', '');
    if (host === 'maps.yandex.ru' || host === 'yandex.ru' && ref.includes('/maps')) return 'Яндекс Карты';
    if (host.includes('yandex.')) return 'Органика (Яндекс)';
    if (host.includes('google.')) return 'Органика (Google)';
    if (host.includes('vk.com') || host.includes('vkontakte.ru')) return 'ВКонтакте';
    if (host.includes('instagram.com')) return 'Instagram';
    if (host.includes('facebook.com') || host.includes('fb.com')) return 'Facebook';
    if (host.includes('t.me') || host.includes('telegram.')) return 'Telegram';
    if (host.includes('2gis.')) return '2ГИС';
  } catch { /* invalid URL */ }
  return null;
}

function getChannel(lead: Lead): string {
  const src = (lead.utm_source ?? '').toLowerCase();
  const medium = (lead.utm_medium ?? '').toLowerCase();
  const ref = lead.referrer ?? '';

  // Если есть UTM — определяем по ним
  if (src || medium) {
    if (src === 'yandex' && medium === 'cpc') return 'Яндекс.Директ';
    if (src === 'yandex') return 'Яндекс.Директ';
    if (src === 'google' && medium === 'cpc') return 'Google Ads';
    if (src === 'google') return 'Google Ads';
    if (src === 'vk' || src === 'vkontakte') return 'ВКонтакте';
    if (src === 'instagram' || src === 'ig') return 'Instagram';
    if (src === 'facebook' || src === 'fb') return 'Facebook';
    if (src === 'telegram' || src === 'tg') return 'Telegram';
    if (medium === 'organic' || src === 'organic') return 'Органика';
    if (medium === 'cpc' || medium === 'paid') return UTM_SOURCE_LABELS[src] ?? src;
    return UTM_SOURCE_LABELS[src] ?? src;
  }

  // Нет UTM — смотрим referrer
  const refChannel = parseReferrerChannel(ref);
  if (refChannel) return refChannel;
  if (ref === '') return 'Прямой заход';

  return 'Нет меток';
}

function pct(a: number, b: number) {
  return b === 0 ? 0 : Math.round((a / b) * 100);
}

function StatCard({ label, value, color, sub }: { label: string; value: number | string; color?: string; sub?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color: color ?? '#1e293b' }}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function FunnelBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const w = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
        <div className="h-5 rounded-full flex items-center pl-2 transition-all"
          style={{ width: `${Math.max(w, 2)}%`, background: color }}>
          {w >= 10 && <span className="text-white text-xs font-bold">{count}</span>}
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-600 w-10 text-right">{w}%</span>
    </div>
  );
}

// Группировка лидов по полю
function groupBy(leads: Lead[], key: (l: Lead) => string): Record<string, Lead[]> {
  const map: Record<string, Lead[]> = {};
  leads.forEach(l => {
    const k = key(l) || 'unknown';
    (map[k] = map[k] ?? []).push(l);
  });
  return map;
}

function SourceTable({ leads, groupKey, labelMap, title }: {
  leads: Lead[]; groupKey: (l: Lead) => string;
  labelMap: Record<string, string>; title: string;
}) {
  const groups = useMemo(() => {
    const g = groupBy(leads, groupKey);
    return Object.entries(g)
      .map(([key, items]) => ({
        key,
        label: labelMap[key] ?? key,
        total: items.length,
        trial: items.filter(l => l.status === 'trial').length,
        enrolled: items.filter(l => l.status === 'enrolled').length,
        thinking: items.filter(l => l.status === 'thinking').length,
      }))
      .sort((a, b) => b.total - a.total);
  }, [leads]);

  if (groups.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Источник</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Лидов</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Думают</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Пробное</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Записались</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Конверсия</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(g => (
              <tr key={g.key} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 font-medium text-slate-800">{g.label}</td>
                <td className="py-2.5 px-3 text-right text-slate-600">{g.total}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="text-amber-600 font-medium">{g.thinking}</span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="text-emerald-600 font-medium">{g.trial}</span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="text-violet-600 font-medium">{g.enrolled}</span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className={`font-bold ${pct(g.enrolled, g.total) >= 10 ? 'text-emerald-600' : pct(g.enrolled, g.total) >= 3 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {pct(g.enrolled, g.total)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DayChart({ leads }: { leads: Lead[] }) {
  const days = useMemo(() => {
    const map: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      map[d.toDateString()] = 0;
    }
    leads.forEach(l => {
      const key = new Date(l.created_at).toDateString();
      if (key in map) map[key]++;
    });
    return Object.entries(map).map(([d, n]) => ({ date: new Date(d), count: n }));
  }, [leads]);

  const max = Math.max(...days.map(d => d.count), 1);

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Лиды по дням (30 дней)</h3>
      <div className="flex items-end gap-0.5 h-24">
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div
              className="w-full rounded-t bg-blue-400 hover:bg-blue-600 transition-colors cursor-default"
              style={{ height: `${Math.max((d.count / max) * 88, d.count > 0 ? 4 : 0)}px` }}
            />
            {d.count > 0 && (
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-800 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                {d.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}: {d.count}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{days[0]?.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
        <span>сегодня</span>
      </div>
    </div>
  );
}

export default function AnalyticsManager({ leads }: Props) {
  const [period, setPeriod] = useState<Period>('30d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [showYandexDrill, setShowYandexDrill] = useState(false);

  const filtered = useMemo(() => {
    if (period === 'custom') {
      const from = customFrom ? new Date(customFrom) : null;
      const to = customTo ? new Date(customTo + 'T23:59:59') : null;
      return leads.filter(l => {
        const d = new Date(l.created_at);
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
    }
    if (period === 'all') return leads;
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoff = new Date(Date.now() - days * 86400000);
    return leads.filter(l => new Date(l.created_at) >= cutoff);
  }, [leads, period, customFrom, customTo]);

  const total = filtered.length;
  const today = new Date().toDateString();
  const todayCount = leads.filter(l => new Date(l.created_at).toDateString() === today).length;
  const trialCount = filtered.filter(l => l.status === 'trial').length;
  const enrolledCount = filtered.filter(l => l.status === 'enrolled').length;

  // Дубли
  const phoneMap: Record<string, number> = {};
  leads.forEach(l => { const d = l.phone.replace(/\D/g, ''); phoneMap[d] = (phoneMap[d] ?? 0) + 1; });
  const dupCount = Object.values(phoneMap).filter(n => n > 1).length;

  const channelGroups = useMemo(() => {
    const g = groupBy(filtered, getChannel);
    return Object.entries(g).map(([channel, items]) => ({
      channel,
      icon: CHANNEL_ICONS[channel] ?? '📌',
      total: items.length,
      thinking: items.filter(l => l.status === 'thinking').length,
      trial: items.filter(l => l.status === 'trial').length,
      enrolled: items.filter(l => l.status === 'enrolled').length,
    })).sort((a, b) => b.total - a.total);
  }, [filtered]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <h2 className="text-xl font-bold text-slate-900">Аналитика</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {(['7d', '30d', '90d', 'all', 'custom'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {p === '7d' ? '7 дней' : p === '30d' ? '30 дней' : p === '90d' ? '90 дней' : p === 'all' ? 'Всё время' : 'Период'}
              </button>
            ))}
          </div>
          {period === 'custom' && (
            <div className="flex items-center gap-2">
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <span className="text-slate-400 text-sm">—</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          )}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Лидов за период" value={total} color="#3b82f6" />
        <StatCard label="Сегодня" value={todayCount} color="#6366f1" />
        <StatCard label="На пробное" value={trialCount} color="#10b981"
          sub={`${pct(trialCount, total)}% конверсия`} />
        <StatCard label="Записались" value={enrolledCount} color="#8b5cf6"
          sub={`${pct(enrolledCount, total)}% конверсия`} />
        <StatCard label="Дублей в базе" value={dupCount} color="#f59e0b"
          sub="уникальных номеров" />
      </div>

      {/* Funnel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Воронка</h3>
        <div className="space-y-2">
          {Object.entries(STATUS_LABELS).filter(([k]) => k !== 'trash').map(([status, label]) => {
            const count = filtered.filter(l => l.status === status).length;
            return <FunnelBar key={status} label={label} count={count} total={total} color={STATUS_COLORS[status]} />;
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <DayChart leads={leads} />
      </div>

      {/* Yandex Direct drill-down */}
      {showYandexDrill && (
        <YandexDrillDown
          leads={filtered.filter(l => getChannel(l) === 'Яндекс.Директ')}
          onClose={() => setShowYandexDrill(false)}
        />
      )}

      {/* Channel table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">По каналу трафика</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Канал</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Лидов</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Думают</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Пробное</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Записались</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Конверсия</th>
              </tr>
            </thead>
            <tbody>
              {channelGroups.map(g => (
                <tr key={g.channel}
                  className={`border-b border-slate-100 transition-colors ${g.channel === 'Яндекс.Директ' ? 'hover:bg-yellow-50 cursor-pointer' : 'hover:bg-slate-50'}`}
                  onClick={g.channel === 'Яндекс.Директ' ? () => setShowYandexDrill(v => !v) : undefined}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{g.icon}</span>
                      <span className="font-medium text-slate-800">{g.channel}</span>
                      {g.channel === 'Яндекс.Директ' && (
                        <Icon name="ChevronRight" size={14} className={`text-slate-400 transition-transform ${showYandexDrill ? 'rotate-90' : ''}`} />
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{g.total}</td>
                  <td className="py-2.5 px-3 text-right"><span className="text-amber-600 font-medium">{g.thinking}</span></td>
                  <td className="py-2.5 px-3 text-right"><span className="text-emerald-600 font-medium">{g.trial}</span></td>
                  <td className="py-2.5 px-3 text-right"><span className="text-violet-600 font-medium">{g.enrolled}</span></td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`font-bold ${pct(g.enrolled, g.total) >= 10 ? 'text-emerald-600' : pct(g.enrolled, g.total) >= 3 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {pct(g.enrolled, g.total)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source on site + course tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <SourceTable leads={filtered} groupKey={l => l.source}
            labelMap={INTERNAL_SOURCE_LABELS} title="По месту на сайте" />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <SourceTable leads={filtered} groupKey={l => l.course ?? ''}
            labelMap={COURSE_LABELS} title="По курсу" />
        </div>
      </div>
    </div>
  );
}
