import type { FeedEntry } from './types';

const STORAGE_KEY = 'openkal_entries';
const VERSION_KEY = 'openkal_v';
const CURRENT_VERSION = '1';
const MAX_ENTRIES = 200;

export function readEntries(): FeedEntry[] {
  try {
    if (typeof window === 'undefined') return [];
    const version = localStorage.getItem(VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FeedEntry[];
  } catch {
    return [];
  }
}

function persist(entries: FeedEntry[]): void {
  try {
    const capped = entries.slice(0, MAX_ENTRIES);
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // storage full or private browsing — silently ignore
  }
}

export function addEntry(entry: FeedEntry): FeedEntry[] {
  const current = readEntries();
  const updated = [entry, ...current];
  persist(updated);
  return updated;
}

export function removeEntry(id: string): FeedEntry[] {
  const current = readEntries();
  const updated = current.filter(e => e.id !== id);
  persist(updated);
  return updated;
}

export function updateEntry(id: string, patch: Partial<FeedEntry>): FeedEntry[] {
  const current = readEntries();
  const updated = current.map(e => (e.id === id ? { ...e, ...patch } : e));
  persist(updated);
  return updated;
}

export function clearEntries(): FeedEntry[] {
  persist([]);
  return [];
}
