import React from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import { museumAudio } from '../../utils/audio';

/**
 * MUSEORA — Accessible Empty State Presentation
 */
export default function EmptyState({
  title = 'NO MATCHING MASTERWORKS FOUND',
  message = 'Try modifying your search criteria or clearing applied filters to explore the broader archive.',
  action,
  actionText = 'RESET SEARCH FILTERS',
  compact = false,
}) {
  const handleAction = () => {
    museumAudio.playClickSound();
    if (action) action();
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: compact ? '3rem 1.5rem' : '5rem 2rem',
        borderRadius: '16px',
        backgroundColor: 'rgba(21, 19, 15, 0.65)',
        border: '1px solid rgba(232, 224, 208, 0.1)',
        maxWidth: compact ? '520px' : '680px',
        margin: '0 auto',
        gap: '1.25rem',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(29, 26, 21, 0.8)',
          border: '1px solid rgba(198, 165, 107, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold)',
        }}
      >
        <Compass style={{ width: '28px', height: '28px', opacity: 0.85 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3
          className="font-serif"
          style={{
            fontSize: compact ? '1.35rem' : '1.85rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontWeight: 300,
            lineHeight: 1.5,
            maxWidth: '460px',
          }}
        >
          {message}
        </p>
      </div>

      {action && (
        <button
          onClick={handleAction}
          onMouseEnter={() => museumAudio.playHoverSound()}
          className="btn-secondary-museo"
          style={{
            marginTop: '0.5rem',
            padding: '0.65rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          data-cursor="click"
        >
          <RotateCcw style={{ width: '14px', height: '14px' }} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
