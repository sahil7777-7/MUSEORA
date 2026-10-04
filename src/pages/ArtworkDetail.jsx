import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { ARTWORKS } from '../data/museumData';
import ArtworkViewer3D from '../components/3d/ArtworkViewer3D';
import TiltCard from '../components/ui/TiltCard';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { ArtworkDetailSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import { Bookmark, Volume2, VolumeX, ArrowLeft, ExternalLink, Maximize2 } from 'lucide-react';
import { isFavorite, toggleFavorite, addViewedArtwork } from '../utils/storage';
import { museumAudio } from '../utils/audio';
import { getMetArtworkById } from '../services/metApi';
import Lightbox from '../components/ui/Lightbox';

export default function ArtworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fav, setFav] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const abortControllerRef = useRef(null);

  const loadArtwork = useCallback(async () => {
    window.scrollTo(0, 0);
    setIsPlayingAudio(false);
    setError(null);
    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (id && id.startsWith('met-')) {
      const metId = id.replace('met-', '');
      try {
        const data = await getMetArtworkById(metId, {
          signal: abortController.signal,
          requireImage: true,
        });

        if (data) {
          setArtwork(data);
          setFav(isFavorite(data.id));
          addViewedArtwork(data.id);
          setError(null);
        } else {
          setError(
            `Masterwork catalog record #${metId} could not be retrieved. The object may not be currently cataloged with public domain imagery or may be restricted by museum accession rights.`
          );
          setArtwork(null);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(
          `Unable to establish connection with the museum accession archive for object #${metId}. Please verify your connection and try again.`
        );
        setArtwork(null);
      } finally {
        setLoading(false);
      }
    } else {
      // Local Masterpiece resolution
      const localArt = ARTWORKS.find((a) => a.id === id);
      if (localArt) {
        setArtwork(localArt);
        setFav(isFavorite(localArt.id));
        addViewedArtwork(localArt.id);
        setError(null);
      } else {
        setError(`Masterwork record "${id}" was not found in the MUSEORA permanent archive.`);
        setArtwork(null);
      }
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadArtwork();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadArtwork]);

  const handleFav = () => {
    if (!artwork) return;
    museumAudio.playClickSound();
    toggleFavorite(artwork.id);
    setFav(!fav);
  };

  const toggleAudioCommentary = () => {
    museumAudio.playClickSound();
    setIsPlayingAudio(!isPlayingAudio);
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <PageTransition>
        <ArtworkDetailSkeleton />
      </PageTransition>
    );
  }

  // Error State with Retry and Back Action
  if (error || !artwork) {
    return (
      <PageTransition>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingTop: '10rem', paddingBottom: '6rem' }}>
          <div className="museo-container">
            <ErrorState
              title="MASTERWORK RECORD UNAVAILABLE"
              message={error || 'The requested masterwork could not be retrieved from the archives.'}
              onRetry={loadArtwork}
              retryText="RETRY ACCESSION QUERY"
              secondaryAction={() => navigate('/artworks')}
              secondaryText="RETURN TO GALLERY"
            />
          </div>
        </div>
      </PageTransition>
    );
  }

  const relatedWorks = ARTWORKS.filter((a) => a.id !== artwork.id).slice(0, 3);

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-24)' }}>
        {/* Top Back Navigation Bar */}
        <div className="museo-container museo-flex-between" style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => {
              museumAudio.playClickSound();
              navigate('/artworks');
            }}
            onMouseEnter={() => museumAudio.playHoverSound()}
            className="font-mono"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            data-cursor="click"
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>BACK TO COLLECTION</span>
          </button>

          <button
            onClick={handleFav}
            style={{
              padding: '0.6rem',
              borderRadius: '50%',
              backgroundColor: fav ? 'var(--gold)' : 'var(--bg-panel)',
              color: fav ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--line-strong)',
              cursor: 'pointer',
              transition: 'all var(--duration-normal) var(--ease-out)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={fav ? 'Remove from My Collection' : 'Save to My Collection'}
            aria-label={fav ? 'Remove from My Collection' : 'Save to My Collection'}
            data-cursor="click"
          >
            <Bookmark style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
          </button>
        </div>

        {/* 3D Masterwork & Metadata Grid Stacking */}
        <div className="museo-container" style={{ marginBottom: '4rem' }}>
          <div className="museo-grid-2" style={{ alignItems: 'start', gap: '3.5rem' }}>
            {/* 3D Model Viewer & Media Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ArtworkViewer3D artwork={artwork} />

              {/* View High-Res Image Button */}
              {artwork.highResImage && (
                <button
                  onClick={() => {
                    museumAudio.playClickSound();
                    setLightboxOpen(true);
                  }}
                  className="btn-secondary-museo"
                  style={{
                    padding: '0.75rem',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                  }}
                  data-cursor="click"
                >
                  <Maximize2 style={{ width: '14px', height: '14px' }} />
                  <span>OPEN HIGH-RESOLUTION LIGHTBOX</span>
                </button>
              )}
            </div>

            {/* Metadata Surround */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                    {artwork.year} • {artwork.era || artwork.department}
                  </span>
                  {artwork.isStale && (
                    <span className="font-mono" style={{ fontSize: '0.65rem', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      ⚠️ OFFLINE CACHE
                    </span>
                  )}
                </div>
                <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  {artwork.title}
                </h1>
                {artwork.subtitle && (
                  <p className="font-serif" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    {artwork.subtitle}
                  </p>
                )}
                <p className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
                  BY {artwork.artist}
                </p>
              </div>

              {/* Verified Museum Specs */}
              <div className="font-mono" style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(232, 224, 208, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.75rem' }}>
                <div className="museo-flex-between" style={{ paddingBottom: '0.4rem', borderBottom: '1px solid rgba(232, 224, 208, 0.05)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>MEDIUM:</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%' }}>{artwork.medium || 'Not specified'}</span>
                </div>
                <div className="museo-flex-between" style={{ paddingBottom: '0.4rem', borderBottom: '1px solid rgba(232, 224, 208, 0.05)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>DIMENSIONS:</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%' }}>{artwork.dimensions || 'Standard display'}</span>
                </div>
                <div className="museo-flex-between" style={{ paddingBottom: '0.4rem', borderBottom: '1px solid rgba(232, 224, 208, 0.05)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>REPOSITORY:</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%' }}>{artwork.location}</span>
                </div>
                <div className="museo-flex-between">
                  <span style={{ color: 'var(--text-secondary)' }}>GALLERY WING:</span>
                  <span className="text-gold-pure">{artwork.room}</span>
                </div>
              </div>

              {/* Curatorial Audio Commentary (Shown only if audioScript exists) */}
              {artwork.audioScript && (
                <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="museo-flex-between font-mono" style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Volume2 style={{ width: '15px', height: '15px' }} />
                      <span>CURATORIAL AUDIO NARRATION</span>
                    </div>
                    {artwork.audioDuration && (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>{artwork.audioDuration}</span>
                    )}
                  </div>
                  <button
                    onClick={toggleAudioCommentary}
                    className={isPlayingAudio ? 'btn-primary-museo' : 'btn-secondary-museo'}
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.7rem' }}
                    data-cursor="click"
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX style={{ width: '15px', height: '15px' }} />
                        <span>PAUSE NARRATION</span>
                      </>
                    ) : (
                      <>
                        <Volume2 style={{ width: '15px', height: '15px' }} />
                        <span>LISTEN TO CURATORIAL ANALYSIS</span>
                      </>
                    )}
                  </button>
                  {isPlayingAudio && (
                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic', backgroundColor: '#0B0A08', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(198, 165, 107, 0.3)', color: 'var(--cream)' }}>
                      "{artwork.audioScript}"
                    </p>
                  )}
                </div>
              )}

              {/* Source Attribution & Official Accession Link */}
              {artwork.objectUrl && (
                <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <span className="font-mono text-gold-pure" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    OFFICIAL ACCESSION RECORD
                  </span>
                  <a
                    href={artwork.objectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary-museo"
                    style={{ padding: '0.65rem', fontSize: '0.7rem', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    onMouseEnter={() => museumAudio.playHoverSound()}
                    onClick={() => museumAudio.playClickSound()}
                  >
                    <span>VIEW RECORD AT THE MET MUSEUM ARCHIVE</span>
                    <ExternalLink style={{ width: '13px', height: '13px' }} />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Curatorial Essay & Provenance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="museo-container"
          style={{ paddingTop: '3rem', paddingBottom: '3rem', borderTop: '1px solid rgba(232, 224, 208, 0.1)' }}
        >
          <div className="museo-grid-2" style={{ gap: '3.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                CURATORIAL RECORD & PROVENANCE
              </span>
              <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                HISTORICAL CONTEXT
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.65 }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                {artwork.description}
              </p>
              <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  CATALOG ACCESSION & PROVENANCE
                </span>
                <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--cream)' }}>
                  {artwork.provenance}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Works */}
        <div className="museo-container" style={{ paddingTop: '3rem', borderTop: '1px solid rgba(232, 224, 208, 0.1)' }}>
          <div className="museo-flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              RELATED MASTERWORKS
            </h2>
            <Link to="/artworks" className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textDecoration: 'none' }}>
              VIEW ENTIRE ARCHIVE →
            </Link>
          </div>

          <div className="museo-grid-3">
            {relatedWorks.map((art) => (
              <TiltCard
                key={art.id}
                onClick={() => navigate(`/artworks/${art.id}`)}
                dataCursor="view"
              >
                <div style={{ position: 'relative', height: '320px', overflow: 'hidden', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <ImageWithFallback
                    src={art.image}
                    alt=""
                    fallbackTitle={art.title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.65 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B0A08 0%, rgba(11, 10, 8, 0.4) 50%, transparent 100%)' }} />
                  <span className="font-mono badge-cream" style={{ position: 'relative', zIndex: 10, alignSelf: 'flex-start' }}>
                    {art.category}
                  </span>
                  <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <h3 className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
                      {art.title}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>BY {art.artist}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        <Lightbox
          image={artwork.highResImage || artwork.image}
          title={artwork.title}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </PageTransition>
  );
}
