import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { ARTWORKS } from '../data/museumData';
import { getFavorites, toggleFavorite } from '../utils/storage';
import { getMetArtworkById } from '../services/metApi';
import TiltCard from '../components/ui/TiltCard';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { ArtworkGridSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Bookmark } from 'lucide-react';
import { museumAudio } from '../utils/audio';

export default function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState(() => getFavorites());
  const [metArtworks, setMetArtworks] = useState([]);
  const [isLoadingMet, setIsLoadingMet] = useState(false);
  const navigate = useNavigate();

  const abortControllerRef = useRef(null);

  // Load any saved Met API artworks
  useEffect(() => {
    const metIds = favoriteIds.filter((id) => id && id.startsWith('met-'));

    if (metIds.length === 0) {
      setMetArtworks([]);
      setIsLoadingMet(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoadingMet(true);

    const fetchSavedMetArtworks = async () => {
      const resolved = [];
      for (const id of metIds) {
        if (abortController.signal.aborted) return;
        try {
          const metId = id.replace('met-', '');
          const art = await getMetArtworkById(metId, {
            signal: abortController.signal,
            requireImage: false,
          });
          if (art) resolved.push(art);
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      if (!abortController.signal.aborted) {
        setMetArtworks(resolved);
        setIsLoadingMet(false);
      }
    };

    fetchSavedMetArtworks();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [favoriteIds]);

  // Combine local saved items and resolved Met saved items
  const localSaved = ARTWORKS.filter((a) => favoriteIds.includes(a.id));
  const allSavedArtworks = [...localSaved, ...metArtworks];

  const handleRemove = (e, artId) => {
    e.stopPropagation();
    museumAudio.playClickSound();
    const updated = toggleFavorite(artId);
    setFavoriteIds(updated);
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="museo-flex-between"
            style={{ flexWrap: 'wrap', borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '3rem', marginBottom: '4rem', gap: '1rem' }}
          >
            <div>
              <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                PERSONAL SAVED ARCHIVE
              </span>
              <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                MY COLLECTION
              </h1>
            </div>
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {allSavedArtworks.length} SAVED MASTERWORKS
            </span>
          </motion.div>

          {/* Loading Skeletons when resolving saved Met artworks */}
          {isLoadingMet && allSavedArtworks.length === 0 && (
            <ArtworkGridSkeleton count={Math.min(favoriteIds.length || 3, 6)} />
          )}

          {/* Empty State */}
          {!isLoadingMet && allSavedArtworks.length === 0 && (
            <EmptyState
              title="YOUR GALLERY WALL IS EMPTY"
              message="Explore the permanent archive or live Met Museum catalog and click the bookmark icon on any masterwork to curate your private museum collection."
              action={() => navigate('/artworks')}
              actionText="EXPLORE PERMANENT ARCHIVE"
            />
          )}

          {/* Grid */}
          {allSavedArtworks.length > 0 && (
            <div className="museo-grid-3">
              {allSavedArtworks.map((art, index) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.6), ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard
                    onClick={() => navigate(`/artworks/${art.id}`)}
                    dataCursor="view"
                  >
                    <div style={{ position: 'relative', height: '400px', overflow: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ position: 'absolute', inset: 0 }}>
                        <ImageWithFallback
                          src={art.image}
                          alt=""
                          fallbackTitle={art.title}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                        />
                      </div>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B0A08 0%, rgba(11, 10, 8, 0.45) 50%, transparent 100%)', pointerEvents: 'none' }} />

                      <div className="font-mono" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.65rem' }}>
                        <span className="badge-cream" style={{ backgroundColor: 'rgba(11, 10, 8, 0.85)' }}>
                          {art.category || 'Masterwork'}
                        </span>

                        <button
                          onClick={(e) => handleRemove(e, art.id)}
                          onMouseEnter={() => museumAudio.playHoverSound()}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '50%',
                            backgroundColor: 'var(--gold)',
                            color: 'var(--bg-primary)',
                            border: '1px solid var(--gold)',
                            cursor: 'pointer',
                          }}
                          title="Remove from My Collection"
                          aria-label={`Remove ${art.title} from favorites`}
                          data-cursor="click"
                        >
                          <Bookmark style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
                        </button>
                      </div>

                      <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span className="font-mono text-gold-pure" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                          {art.year} • {art.room || 'The Met Collection'}
                        </span>
                        <h3 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', lineHeight: 1.15 }}>
                          {art.title}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 300 }}>
                          BY {art.artist}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
