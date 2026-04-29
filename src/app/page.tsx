'use client';

import { useState, useCallback } from 'react';
import { useEntries } from '@/hooks/useEntries';
import { useHaptic } from '@/hooks/useHaptic';
import TopBar from '@/components/TopBar';
import FoodInput from '@/components/FoodInput';
import FoodFeed from '@/components/FoodFeed';
import type { EstimateResponse } from '@/lib/types';
import { parseManualCalories } from '@/lib/parseCalories';

export default function Page() {
  const { entries, addEntry, removeEntry, updateEntry, clearEntries } = useEntries();
  const { vibrate } = useHaptic();
  const [submitting, setSubmitting] = useState(false);

  const total = entries
    .filter(e => e.status === 'done')
    .reduce((sum, e) => sum + e.total_calories, 0);

  const handleSubmit = useCallback(
    async (input: string, knownCalories?: number) => {
      vibrate(10);

      // If the most recent entry is an error, replace it instead of stacking
      const lastEntry = entries[0];
      if (lastEntry?.status === 'error') {
        removeEntry(lastEntry.id);
      }

      const id = crypto.randomUUID();

      // Known food from dropdown — instant entry, no API call
      if (knownCalories !== undefined) {
        addEntry({
          id,
          input,
          items: [{ name: input, calories: knownCalories }],
          total_calories: knownCalories,
          status: 'done',
          timestamp: Date.now(),
        });
        return;
      }

      const manual = parseManualCalories(input);

      if (manual) {
        // Instant local entry — no API call needed
        addEntry({
          id,
          input,
          items: [{ name: manual.name, calories: manual.calories }],
          total_calories: manual.calories,
          status: 'done',
          timestamp: Date.now(),
        });
        return;
      }

      addEntry({
        id,
        input,
        items: [],
        total_calories: 0,
        status: 'pending',
        timestamp: Date.now(),
      });

      setSubmitting(true);

      try {
        const res = await fetch('/api/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input }),
        });

        if (!res.ok) throw new Error('API error');

        const data: EstimateResponse = await res.json();
        updateEntry(id, {
          items: data.items,
          total_calories: data.total_calories,
          status: 'done',
        });
      } catch {
        updateEntry(id, { status: 'error' });
      } finally {
        setSubmitting(false);
      }
    },
    [addEntry, updateEntry, vibrate]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#1a1c23',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <TopBar total={total} onClear={clearEntries} />

      {/* Upper half — logo centered, hint when empty */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          paddingTop: '56px', // TopBar height
        }}
      >
        <img
          src="/dcuk.png"
          alt="OpenKal"
          style={{ height: '52px', width: 'auto', objectFit: 'contain', opacity: 0.92 }}
        />
        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', maxWidth: '220px', lineHeight: '1.5' }}>
          Type anything you ate to log calories
        </p>
      </div>

      {/* Input — anchored at center */}
      <FoodInput onSubmit={handleSubmit} loading={submitting} />

      {/* Lower half — feed entries scroll below input */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <FoodFeed entries={entries} onDelete={removeEntry} />
      </div>
    </div>
  );
}
