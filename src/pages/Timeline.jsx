import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { TIMELINE_ERAS, ARTWORKS } from '../data/museumData';
import ArtworkViewer3D from '../components/3d/ArtworkViewer3D';
import MagneticButton from '../components/ui/MagneticButton';
import { Clock } from 'lucide-react';
import { museumAudio } from '../utils/audio';

export default function Timeline() {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();

  const activeEra = TIMELINE_ERAS[activeIdx];
  const linkedArtwork = ARTWORKS.find((a) => a.id === activeEra.artifactId) || ARTWORKS[0];

  const handleSelectEra = (idx) => {
    museumAudio.playClickSound();
    setActiveIdx(idx);
  };

  return (
    <PageTransition>
      <div
        style={{
          minHeight: '100vh',
          transition: 'background-color 1s ease',
          backgroundColor: activeEra.bgTone || '#0B0A08',
          paddingTop: '8rem',
          paddingBottom: '8rem',
          color: 'var(--text-primary)',
        }}
      >
        <div className="museo-container">
          <div className="museo-flex-between museo-entrance-fade-up" style={{ flexWrap: 'wrap', borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '2rem', marginBottom: '3rem', gap: '1.5rem' }}>
            <div>
              <div className="badge-gold" style={{ marginBottom: '0.75rem' }}>
                <Clock style={{ width: '14px', height: '14px' }} />
                <span>CHRONOLOGICAL ERA ARCHIVE</span>
              </div>
              <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                HISTORICAL TIMELINE
              </h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', fontWeight: 300 }}>
              Select an era below to transition through 3,500 years of global artistic evolution and inspect key historical 3D artifacts.
            </p>
          </div>

          {/* Era Horizontal Strip */}
          <div
            style={{
              position: 'relative',
              marginBottom: '4rem',
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
              borderTop: '1px solid rgba(232, 224, 208, 0.1)',
              borderBottom: '1px solid rgba(232, 224, 208, 0.1)',
              overflowX: 'auto',
            }}
            className="no-scrollbar"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', minWidth: '900px', paddingLeft: '1rem', paddingRight: '1rem' }}>
              {TIMELINE_ERAS.map((era, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <motion.button
                    key={era.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5), ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => handleSelectEra(idx)}
                    onMouseEnter={() => museumAudio.playHoverSound()}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      opacity: isActive ? 1 : 0.6,
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s, opacity 0.3s',
                    }}
                    data-cursor="click"
                  >
                    <span className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--cream)', fontWeight: 300 }}>
                      {era.year}
                    </span>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: isActive ? '2px solid var(--gold)' : '2px solid rgba(232, 224, 208, 0.4)',
                        backgroundColor: isActive ? 'var(--gold)' : '#0B0A08',
                        boxShadow: isActive ? '0 0 15px var(--gold)' : 'none',
                        transition: 'all 0.3s',
                      }}
                    />
                    <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      {era.eraTitle}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Era Content & 3D Viewer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEra.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="museo-grid-2"
              style={{ alignItems: 'center', gap: '3rem' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="badge-gold">
                  <span>PERIOD #0{activeIdx + 1}</span>
                  <span>•</span>
                  <span>{activeEra.year}</span>
                </div>

                <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  {activeEra.headline}
                </h2>

                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.7 }}>
                  {activeEra.description}
                </p>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    KEY ANCHOR ARTIFACT
                  </span>
                  <div className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>{linkedArtwork.title}</div>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>BY {linkedArtwork.artist} ({linkedArtwork.medium})</div>
                </div>

                <div style={{ paddingTop: '1rem' }}>
                  <MagneticButton
                    variant="primary"
                    onClick={() => navigate(`/artworks/${linkedArtwork.id}`)}
                  >
                    INSPECT 3D ARTIFACT SPECIFICATIONS
                  </MagneticButton>
                </div>
              </div>

              <div>
                <div className="glass-panel" style={{ padding: '0.5rem' }}>
                  <ArtworkViewer3D artwork={linkedArtwork} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
