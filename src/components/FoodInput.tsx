'use client';

import { useRef, useState, KeyboardEvent } from 'react';

interface Props {
  onSubmit: (input: string) => void;
  loading: boolean;
}

export default function FoodInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const handleFocus = () => {
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const canSubmit = value.trim().length > 0 && !loading;

  return (
    <div style={{ backgroundColor: '#1a1c23' }}>
      <div
        className="px-3 pt-3 pb-3"      >
        <div
          className="flex items-end gap-2 rounded-2xl px-3 py-2"
          style={{ backgroundColor: '#22242d', border: '1px solid #2e3140' }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            id="food-input"
            name="food-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onFocus={handleFocus}
            placeholder="What did you eat?"
            rows={1}
            autoFocus
            className="flex-1 resize-none bg-transparent outline-none placeholder-neutral-600"
            style={{
              fontSize: '16px',
              lineHeight: '1.5',
              color: '#e8eaf0',
              overflowY: 'auto',
              textAlign: 'center',
            }}
          />

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="shrink-0 flex items-center justify-center rounded-xl transition-all active:scale-90"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: canSubmit ? '#e8eaf0' : '#2a2d38',
              color: canSubmit ? '#1a1c23' : '#4b5563',
              marginBottom: '1px',
            }}
            aria-label="Track"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
