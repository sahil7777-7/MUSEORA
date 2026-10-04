import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { ARTISTS } from '../data/museumData';
import TiltCard from '../components/ui/TiltCard';
import LazyCard from '../components/ui/LazyCard';
import { ArrowUpRight } from 'lucide-react';
import { museumAudio } from '../utils/audio';

export default function Artists() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '3rem', marginBottom: '4rem' }}
          >
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              MUSEORA BIOGRAPHICAL ARCHIVES
            </span>
            <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              THE ARTISTS
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, marginTop: '1rem' }}>
              Explore the sculptors, painters, and royal guilds whose vision shaped human artistic evolution across empires and centuries.
            </p>
          </motion.div>

          <div className="museo-grid-4">
            {ARTISTS.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.5), ease: [0.22, 1, 0.36, 1] }}
              >
                <LazyCard placeholderHeight="480px">
                  <TiltCard
                    onClick={() => navigate(`/artists/${artist.id}`)}
                    dataCursor="view"
                  >
                    <div style={{ position: 'relative', height: '480px', overflow: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div className="skeleton-shimmer-card" style={{ position: 'absolute', inset: 0, borderRadius: 0 }}>
                        <img
                          src={artist.portrait}
                          alt={artist.name}
                          onLoad={(e) => e.target.classList.add('loaded')}
                          className="lazy-image artists-card-image"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B0A08 0%, rgba(11, 10, 8, 0.4) 50%, transparent 100%)', pointerEvents: 'none' }} />
  
                      <div className="font-mono" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.65rem' }}>
                        <span className="badge-cream" style={{ backgroundColor: 'rgba(11, 10, 8, 0.85)' }}>
                          {artist.country}
                        </span>
                        <span style={{ color: 'var(--text-primary)' }}>{artist.worksCount} WORKS</span>
                      </div>
  
                      <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{artist.years}</span>
                        <h3 className="font-serif" style={{ fontSize: '1.85rem', color: 'var(--text-primary)' }}>
                          {artist.name}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 300 }}>
                          {artist.style}
                        </p>
                        <div className="font-mono text-gold-pure" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', letterSpacing: '0.15em', marginTop: '0.5rem' }}>
                          <span>VIEW MONOGRAPH</span>
                          <ArrowUpRight style={{ width: '16px', height: '16px' }} />
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </LazyCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
