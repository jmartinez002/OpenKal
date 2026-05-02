'use client';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5" style={{ minHeight: 'calc(100dvh - 152px)' }}>
      {/* Logo placement — replace this img src with your own logo */}
      <div className="flex items-center justify-center">
        <img
          src="/dcuk.png"
          alt="OpenKal"
          className="w-auto object-contain"
          style={{ height: '53px' }}
        />
      </div>
    </div>
  );
}
