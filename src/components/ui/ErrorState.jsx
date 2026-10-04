import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { museumAudio } from '../../utils/audio';

/**
 * MUSEORA — Accessible Error State Presentation
 */
export default function ErrorState({
  title = 'ARCHIVE UNREACHABLE',
  message = 'We encountered an unexpected connection issue retrieving records from the museum catalog.',
  onRetry,
  retryText = 'RETRY REQUEST',
  secondaryAction,
  secondaryText = 'RETURN TO COLLECTION',
  compact = false,
}) {
  const handleRetry = () => {
    museumAudio.playClickSound();
    if (onRetry) onRetry();
  };

  const handleSecondary = () => {
    museumAudio.playClickSound();
    if (secondaryAction) secondaryAction();
  };

  return (
    <div
      role="alert"
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: compact ? '2.5rem 1.5rem' : '4.5rem 2rem',
        borderRadius: '16px',
        backgroundColor: 'rgba(21, 19, 15, 0.85)',
        border: '1px solid rgba(182, 106, 98, 0.35)',
        maxWidth: compact ? '500px' : '680px',
        margin: '0 auto',
        gap: '1.25rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(182, 106, 98, 0.15)',
          border: '1px solid var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--danger)',
        }}
      >
        <AlertCircle style={{ width: '24px', height: '24px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3
          className="font-serif"
          style={{
            fontSize: compact ? '1.25rem' : '1.75rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
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
            maxWidth: '480px',
          }}
        >
          {message}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
          marginTop: '0.5rem',
        }}
      >
        {onRetry && (
          <button
            onClick={handleRetry}
            onMouseEnter={() => museumAudio.playHoverSound()}
            className="btn-primary-museo"
            style={{
              padding: '0.65rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            data-cursor="click"
          >
            <RotateCcw style={{ width: '14px', height: '14px' }} />
            <span>{retryText}</span>
          </button>
        )}

        {secondaryAction && (
          <button
            onClick={handleSecondary}
            onMouseEnter={() => museumAudio.playHoverSound()}
            className="btn-secondary-museo"
            style={{
              padding: '0.65rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            data-cursor="click"
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            <span>{secondaryText}</span>
          </button>
        )}
      </div>
    </div>
  );
}
