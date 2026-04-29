'use client';

import { AnimatePresence } from 'framer-motion';
import FeedEntry from './FeedEntry';
import type { FeedEntry as FeedEntryType } from '@/lib/types';

interface Props {
  entries: FeedEntryType[];
  onDelete: (id: string) => void;
}

export default function FoodFeed({ entries, onDelete }: Props) {
  return (
    <div className="flex flex-col px-4 pt-4 pb-2 gap-1 max-w-lg mx-auto w-full">
      <AnimatePresence initial={false}>
        {entries.map(entry => (
          <FeedEntry key={entry.id} entry={entry} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
}
