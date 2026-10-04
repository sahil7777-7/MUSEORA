import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { EXHIBITIONS, ARTWORKS } from '../data/museumData';
import { ArrowLeft, X } from 'lucide-react';
import { museumAudio } from '../utils/audio';

const ExhibitionRoom = lazy(() => import('../components/3d/ExhibitionRoom'));

export default function ExhibitionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const exhibition = EXHIBITIONS.find((e) => e.id === id) || EXHIBITIONS[0];
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleSelectArtworkNode = (artId) => {
    const art = ARTWORKS.find((a) => a.id === artId);
    if (art) {
      setSelectedArtwork(art);
    }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '7rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <div className="museo-flex-between" style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => {
                museumAudio.playClickSound();
                navigate('/exhibitions');
              }}
              onMouseEnter={() => museumAudio.playHoverSound()}
              className="font-mono text-gold-pure"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.75rem',
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
              <span>EXIT 3D EXHIBITION ROOM</span>
            </button>

            <div className="badge-gold">
              3D VIRTUAL GALLERY • {exhibition.room}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '3rem' }}
          >
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              SPECIAL EXHIBITION • {exhibition.period}
            </span>
            <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              {exhibition.title}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, marginTop: '0.5rem' }}>
              {exhibition.description}
            </p>
          </motion.div>

          <Suspense fallback={
            <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--gold)' }}>
              <div className="museo-spinner" style={{ width: '40px', height: '40px', border: '2px solid rgba(198, 165, 107, 0.2)', borderTopColor: '#C6A56B', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}>LOADING 3D EXHIBITION...</span>
            </div>
          }>
            <ExhibitionRoom onSelectArtwork={handleSelectArtworkNode} />
          </Suspense>

          {selectedArtwork && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9995,
                backgroundColor: 'rgba(11, 10, 8, 0.88)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
            >
              <div
                className="glass-panel"
                role="dialog"
                aria-labelledby="selected-artwork-title"
                aria-modal="true"
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '640px',
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid rgba(198, 165, 107, 0.4)',
                  borderRadius: '16px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  boxShadow: '0 0 50px rgba(0,0,0,0.9)',
                }}
              >
                <button
                  onClick={() => setSelectedArtwork(null)}
                  style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  aria-label="Close Artwork Details"
                  autoFocus
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={selectedArtwork.image}
                    alt={selectedArtwork.title}
                    style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(232, 224, 208, 0.2)' }}
                  />
                  <div>
                    <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      {selectedArtwork.year} • {selectedArtwork.category}
                    </span>
                    <h3 id="selected-artwork-title" className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{selectedArtwork.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>BY {selectedArtwork.artist}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--cream)', fontWeight: 300, lineHeight: 1.6 }}>
                  {selectedArtwork.description}
                </p>

                <div className="museo-flex-between font-mono" style={{ paddingTop: '1rem', borderTop: '1px solid rgba(232, 224, 208, 0.1)', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedArtwork.medium}</span>
                  <button
                    onClick={() => {
                      navigate(`/artworks/${selectedArtwork.id}`);
                    }}
                    className="btn-primary-museo"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    INSPECT FULL 3D MODEL
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
