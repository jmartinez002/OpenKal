import type { FeedEntry } from './types';

export function getLocalMidnight(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function isSameLocalDay(a: number, b: number): boolean {
  return getLocalMidnight(a) === getLocalMidnight(b);
}

export function getDayKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getDayLabel(ts: number, nowTs: number): string {
  const diff = getLocalMidnight(nowTs) - getLocalMidnight(ts);
  if (diff === 0) return 'Today';
  if (diff === 86_400_000) return 'Yesterday';
  return new Date(ts).toLocaleDateString(undefined, { weekday: 'long' });
}

export function getWeekDays(referenceTs: number): { date: Date; label: string; dayKey: string }[] {
  const ref = new Date(referenceTs);
  ref.setHours(0, 0, 0, 0);
  const iso = (ref.getDay() + 6) % 7; // Mon=0 … Sun=6
  const monday = new Date(ref.getTime() - iso * 86_400_000);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday.getTime() + i * 86_400_000);
    const label = date.toLocaleDateString(undefined, { weekday: 'short' }).charAt(0);
    return { date, label, dayKey: getDayKey(date.getTime()) };
  });
}

export function computeDailyTotals(entries: FeedEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const e of entries) {
    if (e.status !== 'done') continue;
    const key = getDayKey(e.timestamp);
    map.set(key, (map.get(key) ?? 0) + e.total_calories);
  }
  return map;
}
