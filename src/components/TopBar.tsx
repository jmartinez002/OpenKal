'use client';

import AnimatedNumber from './AnimatedNumber';

interface Props {
  total: number;
}

export default function TopBar({ total }: Props) {
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
      {total > 0 && (
        <div className="absolute right-4 flex items-baseline gap-1">
          <span className="font-mono text-sm font-semibold" style={{ color: '#22c55e' }}>
            <AnimatedNumber value={total} />
          </span>
          <span className="text-xs" style={{ color: '#6b7280' }}>kcal</span>
        </div>
      )}
    </div>
  );
}
