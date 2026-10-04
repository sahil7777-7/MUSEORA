import React from 'react';

/**
 * Single Artwork Card Skeleton Loader
 */
export function ArtworkCardSkeleton() {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'relative',
        height: '400px',
        borderRadius: '16px',
        overflow: 'hidden',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(21, 19, 15, 0.7)',
        border: '1px solid rgba(232, 224, 208, 0.08)',
      }}
      role="status"
      aria-label="Loading masterwork card"
    >
      {/* Background Shimmer */}
      <div className="skeleton-shimmer-card" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

      {/* Top Header Placeholder (Category Badge & Bookmark) */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '22px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(232, 224, 208, 0.1)',
          }}
        />
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(232, 224, 208, 0.1)',
          }}
        />
      </div>

      {/* Bottom Metadata Placeholders */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div
          style={{
            width: '120px',
            height: '14px',
            borderRadius: '4px',
            backgroundColor: 'rgba(198, 165, 107, 0.25)',
          }}
        />
        <div
          style={{
            width: '85%',
            height: '24px',
            borderRadius: '4px',
            backgroundColor: 'rgba(245, 241, 232, 0.15)',
          }}
        />
        <div
          style={{
            width: '55%',
            height: '14px',
            borderRadius: '4px',
            backgroundColor: 'rgba(168, 160, 147, 0.12)',
          }}
        />
      </div>
    </div>
  );
}

/**
 * Grid of Artwork Card Skeletons
 */
export function ArtworkGridSkeleton({ count = 6 }) {
  return (
    <div className="museo-grid-3" role="status" aria-label="Loading masterworks">
      {Array.from({ length: count }).map((_, i) => (
        <ArtworkCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Full Page Artwork Detail Skeleton Loader
 */
export function ArtworkDetailSkeleton() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        paddingTop: '8rem',
        paddingBottom: '8rem',
      }}
      role="status"
      aria-label="Loading artwork details"
    >
      <div className="museo-container">
        {/* Breadcrumb Skeleton */}
        <div
          style={{
            width: '180px',
            height: '16px',
            backgroundColor: 'rgba(232, 224, 208, 0.1)',
            borderRadius: '4px',
            marginBottom: '2.5rem',
          }}
        />

        {/* 2-Column Split */}
        <div className="museo-grid-2" style={{ gap: '4rem', alignItems: 'start' }}>
          {/* Media / 3D Canvas Box Skeleton */}
          <div
            className="glass-panel"
            style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: 'rgba(21, 19, 15, 0.7)',
              border: '1px solid rgba(232, 224, 208, 0.08)',
            }}
          >
            <div className="skeleton-shimmer-card" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
          </div>

          {/* Right Column: Metadata Skeletons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div
              style={{
                width: '140px',
                height: '16px',
                backgroundColor: 'rgba(198, 165, 107, 0.25)',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                width: '90%',
                height: '42px',
                backgroundColor: 'rgba(245, 241, 232, 0.15)',
                borderRadius: '6px',
              }}
            />
            <div
              style={{
                width: '60%',
                height: '20px',
                backgroundColor: 'rgba(168, 160, 147, 0.15)',
                borderRadius: '4px',
              }}
            />

            {/* Spec rows */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                borderTop: '1px solid rgba(232, 224, 208, 0.1)',
                borderBottom: '1px solid rgba(232, 224, 208, 0.1)',
                padding: '1.5rem 0',
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <div key={n} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '80px', height: '14px', backgroundColor: 'rgba(232, 224, 208, 0.1)', borderRadius: '4px' }} />
                  <div style={{ width: '160px', height: '14px', backgroundColor: 'rgba(245, 241, 232, 0.15)', borderRadius: '4px' }} />
                </div>
              ))}
            </div>

            {/* Paragraph block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(168, 160, 147, 0.12)', borderRadius: '4px' }} />
              <div style={{ width: '95%', height: '14px', backgroundColor: 'rgba(168, 160, 147, 0.12)', borderRadius: '4px' }} />
              <div style={{ width: '80%', height: '14px', backgroundColor: 'rgba(168, 160, 147, 0.12)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
