'use client';

import { Fragment } from 'react';
import { AnimatePresence } from 'framer-motion';
import FeedEntry from './FeedEntry';
import type { FeedEntry as FeedEntryType } from '@/lib/types';
import { getDayKey, getDayLabel } from '@/lib/dateUtils';

interface Props {
  entries: FeedEntryType[];
  onDelete: (id: string) => void;
  nowTs?: number;
  filterDayKey?: string | null;
  onClearFilter?: () => void;
}

type DayGroup = { dayKey: string; label: string; entries: FeedEntryType[] };

function DateHeader({ label, dayTotal }: { label: string; dayTotal: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px 4px' }}>
      <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
      {dayTotal > 0 && (
        <span style={{ color: '#4b5563', fontSize: '11px', fontFamily: 'monospace' }}>
          {dayTotal.toLocaleString()} kcal
        </span>
      )}
    </div>
  );
}

export default function FoodFeed({ entries, onDelete, nowTs = Date.now(), filterDayKey, onClearFilter }: Props) {
  const groups: DayGroup[] = [];
  for (const entry of entries) {
    const dayKey = getDayKey(entry.timestamp);
    const last = groups[groups.length - 1];
    if (last && last.dayKey === dayKey) {
      last.entries.push(entry);
    } else {
      groups.push({ dayKey, label: getDayLabel(entry.timestamp, nowTs), entries: [entry] });
    }
  }

  const visibleGroups = filterDayKey ? groups.filter(g => g.dayKey === filterDayKey) : groups;

  return (
    <div className="flex flex-col px-4 pt-2 pb-2 max-w-lg mx-auto w-full">
      {/* Day detail header when filtered */}
      {filterDayKey && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px 4px' }}>
          <span style={{ color: '#e8eaf0', fontSize: '13px', fontWeight: 600 }}>
            {visibleGroups[0]
              ? new Date(visibleGroups[0].entries[0].timestamp).toLocaleDateString(undefined, {
                  weekday: 'long', month: 'short', day: 'numeric',
                })
              : filterDayKey}
            {visibleGroups[0] && (
              <span style={{ color: '#6b7280', fontWeight: 400, marginLeft: '6px', fontSize: '12px', fontFamily: 'monospace' }}>
                · {visibleGroups[0].entries.filter(e => e.status === 'done').reduce((s, e) => s + e.total_calories, 0).toLocaleString()} kcal
              </span>
            )}
          </span>
          <button
            onClick={onClearFilter}
            style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '16px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
            aria-label="Show all entries"
          >
            ✕
          </button>
        </div>
      )}

      {/* No entries for selected day */}
      {filterDayKey && visibleGroups.length === 0 && (
        <p style={{ color: '#4b5563', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
          No entries for this day
        </p>
      )}

      {visibleGroups.map(group => {
        const dayTotal = group.entries
          .filter(e => e.status === 'done')
          .reduce((s, e) => s + e.total_calories, 0);
        return (
          <Fragment key={group.dayKey}>
            {!filterDayKey && <DateHeader label={group.label} dayTotal={dayTotal} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <AnimatePresence initial={false}>
                {group.entries.map(entry => (
                  <FeedEntry key={entry.id} entry={entry} onDelete={onDelete} />
                ))}
              </AnimatePresence>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
