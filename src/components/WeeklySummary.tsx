'use client';

import type { FeedEntry } from '@/lib/types';
import { getWeekDays, computeDailyTotals, isSameLocalDay } from '@/lib/dateUtils';
import AnimatedNumber from './AnimatedNumber';

interface Props {
  entries: FeedEntry[];
  goal: number | null;
}

export default function WeeklySummary({ entries, goal }: Props) {
  const now = Date.now();
  const weekDays = getWeekDays(now);
  const totals = computeDailyTotals(entries);

  const dayTotals = weekDays.map(d => totals.get(d.dayKey) ?? 0);
  const hasAny = dayTotals.some(t => t > 0);
  if (!hasAny) return null;

  const weekSum = dayTotals.reduce((s, t) => s + t, 0);
  const maxTotal = Math.max(...dayTotals, goal ?? 0, 1);

  return (
    <div style={{ padding: '12px 16px 8px', maxWidth: '512px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
        <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          This week
        </span>
        <span style={{ color: '#22c55e', fontSize: '12px', fontFamily: 'monospace', fontWeight: 600 }}>
          <AnimatedNumber value={weekSum} /> kcal
        </span>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
        {weekDays.map((day, i) => {
          const total = dayTotals[i];
          const isToday = isSameLocalDay(day.date.getTime(), now);
          const isFuture = day.date.getTime() > now && !isToday;
          const fillPct = (total / maxTotal) * 100;
          const goalPct = goal ? (goal / maxTotal) * 100 : null;

          return (
            <div key={day.dayKey} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {/* Track */}
              <div style={{ position: 'relative', width: '100%', height: '48px', backgroundColor: '#22242d', borderRadius: '4px', overflow: 'visible' }}>
                {/* Fill */}
                {total > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${fillPct}%`,
                      backgroundColor: '#22c55e',
                      opacity: isToday ? 1 : 0.65,
                      borderRadius: '4px',
                    }}
                  />
                )}
                {/* Empty future day tint */}
                {isFuture && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: '#1e2029', borderRadius: '4px' }} />
                )}
                {/* Goal line */}
                {goalPct !== null && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: `${goalPct}%`,
                      left: 0,
                      right: 0,
                      height: '1px',
                      backgroundColor: '#22c55e',
                      opacity: 0.25,
                    }}
                  />
                )}
              </div>

              {/* Day label */}
              <span style={{
                fontSize: '10px',
                color: isToday ? '#22c55e' : '#6b7280',
                fontWeight: isToday ? 600 : 400,
              }}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
