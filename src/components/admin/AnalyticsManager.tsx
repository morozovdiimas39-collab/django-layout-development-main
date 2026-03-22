'use client';

import { useMemo, useState } from 'react';
import { Lead } from '@/lib/api';
import { formatDate } from '@/lib/dates';
import Icon from '@/components/ui/icon';

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

type Period = '7d' | '30d' | '90d' | 'all';

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

  const filtered = useMemo(() => {
    if (period === 'all') return leads;
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoff = new Date(Date.now() - days * 86400000);
    return leads.filter(l => new Date(l.created_at) >= cutoff);
  }, [leads, period]);

  const total = filtered.length;
  const today = new Date().toDateString();
  const todayCount = leads.filter(l => new Date(l.created_at).toDateString() === today).length;
  const trialCount = filtered.filter(l => l.status === 'trial').length;
  const enrolledCount = filtered.filter(l => l.status === 'enrolled').length;

  // Дубли
  const phoneMap: Record<string, number> = {};
  leads.forEach(l => { const d = l.phone.replace(/\D/g, ''); phoneMap[d] = (phoneMap[d] ?? 0) + 1; });
  const dupCount = Object.values(phoneMap).filter(n => n > 1).length;

  const SOURCE_LABELS: Record<string, string> = {
    hero_acting: 'Hero / Актёрское', hero_oratory: 'Hero / Ораторское',
    home_acting: 'Главная / Актёрское', home_oratory: 'Главная / Ораторское',
    home_acting_cards: 'Главная / Визитка', acting_cards_hero: 'Hero / Визитка',
    home_cta: 'Главная / CTA', organic: 'Органика', direct: 'Прямой',
  };

  const utmSources = useMemo(() => {
    const g = groupBy(filtered.filter(l => (l as any).utm_source), l => (l as any).utm_source);
    return Object.entries(g).map(([k, v]) => ({ key: k, label: k, total: v.length,
      trial: v.filter(l => l.status === 'trial').length,
      enrolled: v.filter(l => l.status === 'enrolled').length,
      thinking: v.filter(l => l.status === 'thinking').length,
    })).sort((a, b) => b.total - a.total);
  }, [filtered]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Аналитика</h2>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(['7d', '30d', '90d', 'all'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {p === '7d' ? '7 дней' : p === '30d' ? '30 дней' : p === '90d' ? '90 дней' : 'Всё время'}
            </button>
          ))}
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

      {/* Tables */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-8">
        <SourceTable leads={filtered} groupKey={l => l.source} labelMap={SOURCE_LABELS} title="По источнику (source)" />
        <SourceTable leads={filtered} groupKey={l => l.course ?? ''} labelMap={COURSE_LABELS} title="По курсу" />
        {utmSources.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">По utm_source</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">utm_source</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Лидов</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Думают</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Пробное</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Записались</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Конверсия</th>
                  </tr>
                </thead>
                <tbody>
                  {utmSources.map(g => (
                    <tr key={g.key} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-800 font-mono text-xs">{g.label}</td>
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
        )}
      </div>
    </div>
  );
}
