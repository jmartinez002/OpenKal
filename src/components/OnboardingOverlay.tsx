'use client';

interface Props {
  onDismiss: () => void;
}

export default function OnboardingOverlay({ onDismiss }: Props) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          borderRadius: '16px',
          padding: '32px 28px 24px',
          maxWidth: '300px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <h2
          style={{
            color: '#f3f4f6',
            fontSize: '18px',
            fontWeight: 600,
            textAlign: 'center',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          How to use OpenKal
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Tip
            icon="◎"
            title="Set a daily goal"
            body="Tap or hover over the calorie total to set your daily calorie goal."
          />
          <Tip
            icon="✕"
            title="Remove an entry"
            body="Swipe left on any logged item or tap the delete button to remove it."
          />
          <Tip
            icon="↺"
            title="Reset everything"
            body="Tap the OpenKal logo in the top bar to clear all entries."
          />
          <Tip
            icon="✎"
            title="Add your own Kcal"
            body="Add your own Kcal by typing in the amount of calories you consumed and the name of the food."
          />

        </div>

        <p
          style={{
            color: '#4b5563',
            fontSize: '12px',
            textAlign: 'center',
            margin: 0,
            letterSpacing: '0.01em',
          }}
        >
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
}

function Tip({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <span
        style={{
          color: '#22c55e',
          fontSize: '15px',
          lineHeight: 1,
          marginTop: '2px',
          flexShrink: 0,
          width: '16px',
          textAlign: 'center',
        }}
      >
        {icon}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 500 }}>{title}</span>
        <span style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.4' }}>{body}</span>
      </div>
    </div>
  );
}
