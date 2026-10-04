import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { EXHIBITIONS } from '../data/museumData';
import TiltCard from '../components/ui/TiltCard';
import LazyCard from '../components/ui/LazyCard';
import MagneticButton from '../components/ui/MagneticButton';
import { Sparkles } from 'lucide-react';

export default function Exhibitions() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '3rem', marginBottom: '4rem' }}
          >
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              MUSEORA TEMPORARY & SPECIAL EXHIBITS
            </span>
            <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              EXHIBITIONS
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, marginTop: '1rem' }}>
              Step inside immersive 3D curated worlds exploring specialized themes, regional masterpieces, and sculptural movements.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {EXHIBITIONS.map((exhibit, idx) => (
              <motion.div
                key={exhibit.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.85, delay: Math.min(idx * 0.1, 0.35), ease: [0.16, 1, 0.3, 1] }}
              >
                <LazyCard placeholderHeight="460px">
                  <TiltCard
                    onClick={() => navigate(`/exhibitions/${exhibit.id}`)}
                    dataCursor="view"
                    style={{ padding: '2.5rem' }}
                  >
                    <div className="museo-grid-2" style={{ alignItems: 'center', gap: '3rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="badge-gold">
                          <Sparkles style={{ width: '14px', height: '14px' }} />
                          <span>EXHIBITION HALL 0{idx + 1} • {exhibit.period}</span>
                        </div>
                        <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                          {exhibit.title}
                        </h2>
                        <p className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                          CURATED BY {exhibit.curator}
                        </p>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.7 }}>
                          {exhibit.description}
                        </p>
    
                        <div style={{ paddingTop: '1rem' }}>
                          <MagneticButton variant="primary">
                            ENTER EXHIBITION ROOM
                          </MagneticButton>
                        </div>
                      </div>
    
                      <div>
                        <div className="skeleton-shimmer-card" style={{ position: 'relative', height: '360px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(232, 224, 208, 0.15)' }}>
                          <img
                            src={exhibit.image}
                            alt={exhibit.title}
                            onLoad={(e) => e.target.classList.add('loaded')}
                            className="lazy-image"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B0A08 0%, transparent 60%)', opacity: 0.7, pointerEvents: 'none' }} />
                          <div
                            className="font-mono"
                            style={{
                              position: 'absolute',
                              bottom: '1rem',
                              left: '1rem',
                              right: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.75rem',
                              color: 'var(--cream)',
                              zIndex: 10,
                            }}
                          >
                            <span className="badge-cream" style={{ backgroundColor: 'rgba(11, 10, 8, 0.85)' }}>
                              {exhibit.room}
                            </span>
                            <span style={{ color: 'var(--gold)' }}>{exhibit.featuredCount} MASTERWORKS</span>
                          </div>
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
