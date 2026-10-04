import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { ARTWORKS } from '../data/museumData';
import { Play, Pause, ChevronLeft, ChevronRight, X, Info } from 'lucide-react';

const ArtworkViewer3D = lazy(() => import('../components/3d/ArtworkViewer3D'));
import { museumAudio } from '../utils/audio';
import { incrementCompletedTours } from '../utils/storage';

export default function VirtualTour() {
  const navigate = useNavigate();
  const tourArtworks = ARTWORKS.slice(0, 8);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const currentArt = tourArtworks[currentIndex];

  const handleNext = React.useCallback(() => {
    museumAudio.playClickSound();
    setCurrentIndex((prev) => (prev + 1) % tourArtworks.length);
  }, [tourArtworks.length]);

  const handlePrev = React.useCallback(() => {
    museumAudio.playClickSound();
    setCurrentIndex((prev) => (prev - 1 + tourArtworks.length) % tourArtworks.length);
  }, [tourArtworks.length]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        handleNext();
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, handleNext]);

  useEffect(() => {
    if (currentIndex === tourArtworks.length - 1) {
      incrementCompletedTours();
    }
  }, [currentIndex, tourArtworks.length]);

  const togglePlay = () => {
    museumAudio.playClickSound();
    setIsPlaying(!isPlaying);
  };

  return (
    <PageTransition>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9900,
          backgroundColor: '#0B0A08',
          color: '#F5F1E8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to bottom, #0B0A08 0%, transparent 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--gold)', animation: 'pulseGlow 2s infinite' }} />
            <span className="font-serif" style={{ fontSize: '1.25rem', letterSpacing: '0.15em', color: '#F5F1E8' }}>
              MUSEORA VIRTUAL TOUR
            </span>
          </div>

          <button
            onClick={() => {
              museumAudio.playClickSound();
              navigate('/');
            }}
            onMouseEnter={() => museumAudio.playHoverSound()}
            className="btn-secondary-museo"
            style={{ padding: '0.5rem 1rem' }}
            data-cursor="click"
          >
            <X style={{ width: '16px', height: '16px' }} />
            <span>EXIT TOUR</span>
          </button>
        </div>

        {/* 3D Showcase */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '960px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Suspense fallback={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--gold)' }}>
                <div className="museo-spinner" style={{ width: '40px', height: '40px', border: '2px solid rgba(198, 165, 107, 0.2)', borderTopColor: '#C6A56B', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}>LOADING 3D MODULE...</span>
              </div>
            }>
              <ArtworkViewer3D artwork={currentArt} />
            </Suspense>
          </div>

          {/* Info Drawer */}
          {showInfo && (
            <div
              className="glass-panel"
              role="dialog"
              aria-labelledby="artwork-info-title"
              aria-modal="true"
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '1.5rem',
                bottom: '1.5rem',
                width: '360px',
                backgroundColor: 'rgba(21, 19, 15, 0.95)',
                border: '1px solid rgba(198, 165, 107, 0.4)',
                borderRadius: '16px',
                padding: '1.5rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                zIndex: 20,
              }}
            >
              <div className="museo-flex-between" style={{ borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '0.75rem' }}>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  CURATOR SPECIFICATIONS
                </span>
                <button 
                  onClick={() => setShowInfo(false)} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  aria-label="Close Information"
                  autoFocus
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
              <h3 id="artwork-info-title" className="font-serif" style={{ fontSize: '1.5rem', color: '#F5F1E8' }}>{currentArt.title}</h3>
              <p className="font-mono text-gold-pure" style={{ fontSize: '0.75rem' }}>BY {currentArt.artist}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.6 }}>{currentArt.description}</p>
              <div className="font-mono" style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(232, 224, 208, 0.1)', fontSize: '0.7rem', color: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>MEDIUM: {currentArt.medium}</div>
                <div>DIMENSIONS: {currentArt.dimensions}</div>
                <div>LOCATION: {currentArt.location}</div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to top, #0B0A08 0%, rgba(11, 10, 8, 0.9) 70%, transparent 100%)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Room Title */}
          <div>
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block' }}>
              ROOM 0{currentIndex + 1} — {currentArt.room}
            </span>
            <h2 className="font-serif" style={{ fontSize: '1.5rem', color: '#F5F1E8' }}>{currentArt.title}</h2>
          </div>

          {/* Controls */}
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
            }}
          >
            <button
              onClick={handlePrev}
              onMouseEnter={() => museumAudio.playHoverSound()}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              title="Previous Artwork"
              data-cursor="click"
            >
              <ChevronLeft style={{ width: '20px', height: '20px' }} />
            </button>

            <button
              onClick={togglePlay}
              onMouseEnter={() => museumAudio.playHoverSound()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--gold)',
                color: 'var(--bg-primary)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={isPlaying ? 'Pause Auto Tour' : 'Play Auto Tour'}
              data-cursor="click"
            >
              {isPlaying ? <Pause style={{ width: '16px', height: '16px', fill: 'currentColor' }} /> : <Play style={{ width: '16px', height: '16px', fill: 'currentColor', marginLeft: '2px' }} />}
            </button>

            <button
              onClick={handleNext}
              onMouseEnter={() => museumAudio.playHoverSound()}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              title="Next Artwork"
              data-cursor="click"
            >
              <ChevronRight style={{ width: '20px', height: '20px' }} />
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              onMouseEnter={() => museumAudio.playHoverSound()}
              style={{ background: 'none', border: 'none', color: showInfo ? 'var(--gold)' : 'var(--text-secondary)', cursor: 'pointer' }}
              title="Toggle Curatorial Info"
              data-cursor="click"
            >
              <Info style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* Counter */}
          <div className="font-mono" style={{ fontSize: '0.9rem', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
            <span className="text-gold-pure" style={{ fontWeight: 600 }}>0{currentIndex + 1}</span> / 0{tourArtworks.length}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
