'use client';

import { useRef, useState, KeyboardEvent } from 'react';
import { getSuggestions } from '@/lib/foods';

interface Props {
  onSubmit: (input: string) => void;
  loading: boolean;
}

export default function FoodInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = getSuggestions(value);
  const showSuggestions = suggestions.length > 0 && value.trim().length > 0;

  const handleSubmit = (text = value) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setValue('');
    setActiveIndex(-1);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, -1));
        return;
      }
      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        handleSubmit(suggestions[activeIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setActiveIndex(-1);
        setValue('');
        return;
      }
    }
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
    setActiveIndex(-1);
  };

  const handleFocus = () => {
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const canSubmit = value.trim().length > 0 && !loading;

  return (
    <div style={{ backgroundColor: '#1a1c23', position: 'relative' }}>
      {/* Suggestions dropdown — floats above the input */}
      {showSuggestions && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '12px',
            right: '12px',
            backgroundColor: '#22242d',
            border: '1px solid #2e3140',
            borderRadius: '16px',
            marginBottom: '6px',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          {suggestions.map((suggestion, i) => (
            <button
              key={suggestion}
              onMouseDown={e => {
                e.preventDefault(); // prevent textarea blur
                handleSubmit(suggestion);
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '11px 16px',
                fontSize: '15px',
                color: i === activeIndex ? '#e8eaf0' : '#9ca3af',
                backgroundColor: i === activeIndex ? '#2a2d38' : 'transparent',
                borderBottom: i < suggestions.length - 1 ? '1px solid #2a2d38' : 'none',
                cursor: 'pointer',
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div
        className="px-3 pt-3 pb-3"
        style={{ borderTop: '1px solid #2e3140', borderBottom: '1px solid #2e3140' }}
      >
        <div
          className="flex items-end gap-2 rounded-2xl px-3 py-2"
          style={{ backgroundColor: '#22242d', border: '1px solid #2e3140' }}
        >
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
              lineHeight: '2',
              color: '#e8eaf0',
              overflowY: 'auto',
              textAlign: 'left',
            }}
          />

          <button
            onClick={() => handleSubmit()}
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
