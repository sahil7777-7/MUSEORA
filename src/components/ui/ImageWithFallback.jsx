import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * MUSEORA — Resilient Image Component
 * Features:
 * - Shimmer skeleton placeholder while loading
 * - Smooth opacity fade-in once loaded
 * - Graceful fallback on HTTP 404, CORS error, or missing URL
 * - Preserves card aspect ratio and prevents Cumulative Layout Shift (CLS)
 */
export default function ImageWithFallback({
  src,
  alt = 'Museum Masterwork',
  fallbackTitle = '',
  className = '',
  style = {},
  aspectRatio,
  onLoad,
  priority = false,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(!src);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // If no source is provided or network load failed
  if (hasError || !src) {
    return (
      <div
        className={`image-fallback-container ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '220px',
          backgroundColor: '#15130F',
          border: '1px solid rgba(232, 224, 208, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          textAlign: 'center',
          gap: '0.75rem',
          aspectRatio,
          ...style,
        }}
        role="img"
        aria-label={`Image unavailable: ${fallbackTitle || alt}`}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(29, 26, 21, 0.8)',
            border: '1px solid rgba(198, 165, 107, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold)',
          }}
        >
          <ImageOff style={{ width: '20px', height: '20px', opacity: 0.7 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span
            className="font-mono text-gold-pure"
            style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            MUSEORA ARCHIVE
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: '220px',
              lineHeight: 1.3,
            }}
          >
            {fallbackTitle ? `Digital image unavailable for "${fallbackTitle}"` : 'Digital accession image unavailable in open access'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#12100D',
        aspectRatio,
        ...style,
      }}
      className={className}
    >
      {/* Shimmer Placeholder while loading */}
      {!isLoaded && (
        <div
          className="skeleton-shimmer-card"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        />
      )}

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
        }}
      />
    </div>
  );
}
