'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { FeedEntry as FeedEntryType } from '@/lib/types';

interface Props {
  entry: FeedEntryType;
  onDelete: (id: string) => void;
}

export default function FeedEntry({ entry, onDelete }: Props) {
  const [dragX, setDragX] = useState(0);
  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (delta < 0) setDragX(Math.max(delta, -130));
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (dragX < -110) {
      onDelete(entry.id);
    } else {
      setDragX(0);
    }
  };

  const showDelete = dragX < -60;

  const time = new Date(entry.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -280, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Delete background */}
      <div
        className="absolute inset-y-0 right-0 flex items-center px-5 rounded-xl transition-opacity"
        style={{ backgroundColor: '#7f1d1d', opacity: showDelete ? 1 : 0 }}
      >
        <svg className="w-4 h-4" style={{ color: '#fca5a5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>

      {/* Row */}
      <div
        className="relative flex items-start justify-between gap-3 px-4 py-3 rounded-xl"
        style={{

          transform: `translateX(${dragX}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.2s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex-1 min-w-0">
          {entry.status === 'pending' && (
            <div>
              <p className="text-sm truncate" style={{ color: '#e8eaf0' }}>{entry.input}</p>
              <p className="text-xs mt-0.5 animate-pulse" style={{ color: '#6b7280' }}>Calculating…</p>
            </div>
          )}

          {entry.status === 'error' && (
            <div>
              <p className="text-sm truncate" style={{ color: '#e8eaf0' }}>{entry.input}</p>
              <p className="text-xs mt-0.5" style={{ color: '#f87171' }}>Could not estimate</p>
            </div>
          )}

          {entry.status === 'done' && (
            <div className="space-y-0.5">
              {entry.items.map((item, i) => (
                <p key={i} className="text-sm" style={{ color: '#e8eaf0' }}>
                  {item.name}
                  <span className="mx-1.5" style={{ color: '#4b5563' }}>—</span>
                  <span className="font-mono" style={{ color: '#22c55e' }}>{item.calories.toLocaleString()}</span>
                  <span className="text-xs ml-0.5" style={{ color: '#4b5563' }}>kcal</span>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Right side: total + time */}
        <div className="flex flex-col items-end shrink-0 gap-0.5">
          {entry.status === 'done' && (
            <span className="font-mono text-sm font-semibold" style={{ color: '#22c55e' }}>
              {entry.total_calories.toLocaleString()}
            </span>
          )}
          {entry.status === 'pending' && (
            <span className="font-mono text-sm" style={{ color: '#4b5563' }}>—</span>
          )}
          {entry.status === 'error' && (
            <span className="font-mono text-sm" style={{ color: '#f87171' }}>—</span>
          )}
          <span className="text-xs" style={{ color: '#4b5563' }}>{time}</span>
        </div>
      </div>
    </motion.div>
  );
}
