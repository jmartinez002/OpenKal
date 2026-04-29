'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  readEntries,
  addEntry as storageAdd,
  removeEntry as storageRemove,
  updateEntry as storageUpdate,
  clearEntries as storageClear,
} from '@/lib/storage';
import type { FeedEntry } from '@/lib/types';

export function useEntries() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);

  useEffect(() => {
    setEntries(readEntries());
  }, []);

  const addEntry = useCallback((entry: FeedEntry) => {
    setEntries(storageAdd(entry));
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(storageRemove(id));
  }, []);

  const updateEntry = useCallback((id: string, patch: Partial<FeedEntry>) => {
    setEntries(storageUpdate(id, patch));
  }, []);

  const clearEntries = useCallback(() => {
    setEntries(storageClear());
  }, []);

  return { entries, addEntry, removeEntry, updateEntry, clearEntries };
}
