import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { ARTWORKS, ROOMS } from '../data/museumData';
import TiltCard from '../components/ui/TiltCard';
import LazyCard from '../components/ui/LazyCard';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import EmptyState from '../components/ui/EmptyState';
import { Bookmark, Filter } from 'lucide-react';
import { isFavorite, toggleFavorite } from '../utils/storage';
import { museumAudio } from '../utils/audio';

export default function Artworks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedCategory = searchParams.get('category') || 'All';
  const selectedRoom = searchParams.get('room') || 'All';
  const searchQuery = searchParams.get('q') || '';

  const [favorites, setFavorites] = useState(() => ARTWORKS.map(a => a.id).filter(id => isFavorite(id)));

  const categories = ['All', 'Painting', 'Sculpture', 'Artifacts', 'Digital'];

  const filteredArtworks = useMemo(() => {
    return ARTWORKS.filter(art => {
      const matchCat = selectedCategory === 'All' || art.category === selectedCategory;
      const matchRoom = selectedRoom === 'All' || art.roomId === selectedRoom;
      const matchSearch = !searchQuery || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        art.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchRoom && matchSearch;
    });
  }, [selectedCategory, selectedRoom, searchQuery]);

  const handleToggleFav = (e, artId) => {
    e.stopPropagation();
    museumAudio.playClickSound();
    const updated = toggleFavorite(artId);
    setFavorites(updated);
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: 'var(--space-32)', paddingBottom: 'var(--space-24)' }}>
        <div className="museo-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderBottom: '1px solid var(--line)', paddingBottom: 'var(--space-12)', marginBottom: 'var(--space-12)' }}
          >
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              MUSEORA PERMANENT COLLECTION
            </span>
            <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              THE COLLECTION
            </h1>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, marginTop: 'var(--space-4)', lineHeight: 1.6 }}>
              Explore global masterworks ranging from 1500 BCE ancient bronze castings to modern oil canvases and real-time 3D digital art.
            </p>
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="museo-flex-between" style={{ flexWrap: 'wrap', paddingBottom: 'var(--space-12)', borderBottom: '1px solid var(--line)', marginBottom: 'var(--space-12)', gap: 'var(--space-6)' }}
          >
            {/* Category Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
              <span className="font-mono text-gold-pure" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: '0.5rem' }}>
                CATEGORY:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    museumAudio.playClickSound();
                    setSearchParams((prev) => {
                      const p = new URLSearchParams(prev);
                      if (cat === 'All') p.delete('category');
                      else p.set('category', cat);
                      return p;
                    });
                  }}
                  onMouseEnter={() => museumAudio.playHoverSound()}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all var(--duration-normal) var(--ease-out)',
                    backgroundColor: selectedCategory === cat ? 'var(--gold)' : 'var(--bg-panel)',
                    color: selectedCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: selectedCategory === cat ? '1px solid var(--gold)' : '1px solid var(--line)',
                    fontWeight: selectedCategory === cat ? 600 : 400,
                  }}
                  data-cursor="click"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Room Filter Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                className="font-mono"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid rgba(232, 224, 208, 0.15)',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <Filter style={{ width: '14px', height: '14px', color: 'var(--gold)' }} />
                <span>WING:</span>
                <select
                  value={selectedRoom}
                  onChange={(e) => {
                    museumAudio.playClickSound();
                    setSearchParams((prev) => {
                      const p = new URLSearchParams(prev);
                      if (e.target.value === 'All') p.delete('room');
                      else p.set('room', e.target.value);
                      return p;
                    });
                  }}
                  style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: 'none', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="All" style={{ backgroundColor: 'var(--bg-panel)' }}>All Gallery Wings</option>
                  {ROOMS.map((r) => (
                    <option key={r.id} value={r.id} style={{ backgroundColor: 'var(--bg-panel)' }}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedCategory !== 'All' || selectedRoom !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    museumAudio.playClickSound();
                    setSearchParams({});
                  }}
                  className="font-mono text-gold-pure"
                  style={{ background: 'none', border: 'none', fontSize: '0.7rem', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  CLEAR FILTERS
                </button>
              )}
            </div>
          </motion.div>

          {/* Grid */}
          {filteredArtworks.length === 0 ? (
            <EmptyState
              title="NO MATCHING MASTERWORKS FOUND"
              message="No artworks match your selected room wing and category. Try clearing filters to explore the broader archive."
              action={() => setSearchParams({})}
              actionText="CLEAR FILTERS"
            />
          ) : (
            <div className="museo-grid-3">
              {filteredArtworks.map((art, index) => {
                const isFav = favorites.includes(art.id);
                return (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.8, delay: Math.min(index * 0.05, 0.35), ease: [0.16, 1, 0.3, 1] }}
                  >
                    <LazyCard placeholderHeight="400px">
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
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B0A08 0%, rgba(11, 10, 8, 0.4) 50%, transparent 100%)', pointerEvents: 'none' }} />

                          <div className="font-mono" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.65rem' }}>
                            <span className="badge-cream" style={{ backgroundColor: 'rgba(11, 10, 8, 0.85)' }}>
                              {art.category}
                            </span>

                            <button
                              onClick={(e) => handleToggleFav(e, art.id)}
                              onMouseEnter={() => museumAudio.playHoverSound()}
                              style={{
                                padding: '0.5rem',
                                borderRadius: '50%',
                                border: '1px solid rgba(232, 224, 208, 0.2)',
                                backgroundColor: isFav ? 'var(--gold)' : 'rgba(11, 10, 8, 0.6)',
                                color: isFav ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                              }}
                              title={isFav ? 'Remove from My Collection' : 'Save to My Collection'}
                              aria-label={isFav ? `Remove ${art.title} from favorites` : `Add ${art.title} to favorites`}
                              data-cursor="click"
                            >
                              <Bookmark style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
                            </button>
                          </div>

                          <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span className="font-mono text-gold-pure" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                              {art.year} • {art.room}
                            </span>
                            <h3 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>
                              {art.title}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 300 }}>
                              BY {art.artist}
                            </p>
                          </div>
                        </div>
                      </TiltCard>
                    </LazyCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
