import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { ARTISTS, ARTWORKS } from '../data/museumData';
import TiltCard from '../components/ui/TiltCard';
import { ArrowLeft, Clock } from 'lucide-react';
import { museumAudio } from '../utils/audio';

export default function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const artist = ARTISTS.find((a) => a.id === id) || ARTISTS[0];

  useEffect(() => {
  }, [id]);

  const artistArtworks = ARTWORKS.filter((a) => a.artistId === artist.id || a.artist === artist.name);

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '7rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <button
            onClick={() => {
              museumAudio.playClickSound();
              navigate('/artists');
            }}
            onMouseEnter={() => museumAudio.playHoverSound()}
            className="font-mono text-gold-pure museo-entrance-nav museo-delay-1"
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
              marginBottom: '3rem',
            }}
            data-cursor="click"
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>BACK TO ARTISTS ARCHIVE</span>
          </button>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="museo-grid-2" style={{ alignItems: 'center', gap: '3rem', borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '5rem', marginBottom: '6rem' }}
          >
            <TiltCard className="glass-panel" style={{ padding: '0.75rem' }} dataCursor="view">
              <div style={{ position: 'relative', height: '480px', borderRadius: '8px', overflow: 'hidden' }}>
                <img
                  src={artist.portrait}
                  alt={artist.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B0A08 0%, transparent 60%)', opacity: 0.8 }} />
              </div>
            </TiltCard>
  
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                {artist.country} • {artist.years}
              </span>
              <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                {artist.name}
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.7 }}>
                {artist.bio}
              </p>
  
              <div className="font-mono" style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(232, 224, 208, 0.1)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', fontSize: '0.75rem' }}>
                <div>
                  <span className="text-gold-pure" style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>ARTISTIC MOVEMENT</span>
                  <span>{artist.style}</span>
                </div>
                <div>
                  <span className="text-gold-pure" style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>CATALOGED WORKS</span>
                  <span>{artist.worksCount} Masterworks</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline Milestones */}
          {artist.timeline && artist.timeline.length > 0 && (
            <div style={{ marginBottom: '6rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="badge-gold">
                <Clock style={{ width: '14px', height: '14px' }} />
                <span>CHRONOLOGICAL MILESTONES</span>
              </div>
              <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                LIFE & CAREER TIMELINE
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {artist.timeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: Math.min(idx * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
                    className="glass-panel"
                    style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}
                  >
                    <span className="font-mono text-gold-pure font-hero" style={{ fontSize: '1.75rem', fontWeight: 300, flexShrink: 0 }}>
                      {item.year}
                    </span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--cream)', fontWeight: 300 }}>
                      {item.event}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Artworks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              MASTERWORKS IN MUSEORA
            </h2>
            <div className="museo-grid-3">
              {artistArtworks.map((art, idx) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: Math.min(idx * 0.08, 0.25), ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard
                    onClick={() => navigate(`/artworks/${art.id}`)}
                    dataCursor="view"
                  >
                    <div style={{ position: 'relative', height: '320px', overflow: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                      <img
                        src={art.image}
                        alt={art.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B0A08 0%, rgba(11, 10, 8, 0.4) 50%, transparent 100%)' }} />
                      <span className="font-mono badge-cream" style={{ position: 'relative', zIndex: 10, alignSelf: 'flex-start' }}>
                        {art.category}
                      </span>
                      <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <h3 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                          {art.title}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{art.year}</p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
