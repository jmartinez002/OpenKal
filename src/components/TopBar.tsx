'use client';

import { useState, useEffect, useRef } from 'react';
import AnimatedNumber from './AnimatedNumber';

interface Props {
  total: number;
}

const GOAL_KEY = 'openkal_goal';

export default function TopBar({ total }: Props) {
  const [goal, setGoal] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GOAL_KEY);
      if (stored) setGoal(parseInt(stored, 10));
    } catch { }
  }, []);

  const saveGoal = (val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setGoal(num);
      try { localStorage.setItem(GOAL_KEY, String(num)); } catch { }
    }
    setEditing(false);
    setHovered(false);
  };

  const openEditor = () => {
    setInputVal(goal ? String(goal) : '');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center"
      style={{
        height: '56px',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        backgroundColor: '#1a1c23'
      }}
    >
      {/* Centered branding */}
      <div className="flex items-center gap-2">
        <span
          className="font-semibold tracking-tight"
          style={{ color: '#e8eaf0', fontSize: '15px', letterSpacing: '-0.01em' }}
        >
          Open<span style={{ color: '#22c55e' }}>Kal</span>
        </span>
      </div>

      {/* Calorie total — top right */}
      {(total > 0 || goal) && (
        <div className="absolute right-4 flex items-baseline gap-1">
          {editing ? (
            <input
              ref={inputRef}
              type="number"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onBlur={() => saveGoal(inputVal)}
              onKeyDown={e => {
                if (e.key === 'Enter') saveGoal(inputVal);
                if (e.key === 'Escape') { setEditing(false); setHovered(false); }
              }}
              placeholder="goal"
              style={{
                width: '72px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #22c55e',
                outline: 'none',
                color: '#22c55e',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'monospace',
                textAlign: 'right',
                paddingBottom: '1px',
              }}
            />
          ) : (
            <button
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={openEditor}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: '4px' }}
            >
              {hovered ? (
                <span className="font-mono text-sm font-semibold" style={{ color: '#22c55e' }}>
                  SET GOAL
                </span>
              ) : (
                <>
                  <span className="font-mono text-sm font-semibold" style={{ color: '#22c55e' }}>
                    <AnimatedNumber value={total} />
                    {goal ? `/${goal.toLocaleString()}` : ''}
                  </span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>kcal</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
