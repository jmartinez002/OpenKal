'use client';

import type { FeedEntry } from '@/lib/types';
import { getWeekDays, computeDailyTotals, isSameLocalDay } from '@/lib/dateUtils';
import AnimatedNumber from './AnimatedNumber';

interface Props {
  entries: FeedEntry[];
  goal: number | null;
  selectedDayKey: string | null;
  onDaySelect: (key: string | null) => void;
}

export default function WeeklySummary({ entries, goal, selectedDayKey, onDaySelect }: Props) {
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
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
        {weekDays.map((day, i) => {
          const total = dayTotals[i];
          const isToday = isSameLocalDay(day.date.getTime(), now);
          const isFuture = day.date.getTime() > now && !isToday;
          const isSelected = day.dayKey === selectedDayKey;
          const tappable = total > 0;
          const fillPct = (total / maxTotal) * 100;
          const goalPct = goal ? (goal / maxTotal) * 100 : null;

          return (
            <div
              key={day.dayKey}
              onClick={tappable ? () => onDaySelect(isSelected ? null : day.dayKey) : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: tappable ? 'pointer' : 'default',
              }}
            >
              {/* Track */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '48px',
                backgroundColor: '#1e2029',
                borderRadius: '8px 8px 0px 0px',
                overflow: 'visible',
                outline: isSelected ? '1.5px solid #22c55e' : 'none',
                outlineOffset: '2px',
              }}>
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
                      opacity: isSelected || isToday ? 1 : 0.65,
                      borderRadius: '8px 8px 0px 0px',
                    }}
                  />
                )}
                {/* Empty future day tint */}
                {isFuture && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: '#1e2029', borderRadius: '8px 8px 0px 0px' }} />
                )}
                {/* Goal line */}
              </div>

              {/* Day label */}
              <span style={{
                fontSize: '10px',
                color: isSelected || isToday ? '#22c55e' : '#6b7280',
                fontWeight: isSelected || isToday ? 600 : 400,
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
