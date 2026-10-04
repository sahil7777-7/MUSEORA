import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ARTWORKS } from '../../data/museumData';
import TiltCard from '../ui/TiltCard';
import MagneticButton from '../ui/MagneticButton';
import LazyCard from '../ui/LazyCard';
import { Calendar, Compass } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

export default function CuratedOfTheDay() {
  const navigate = useNavigate();

  // Pick artwork of the day dynamically using calendar date
  const getDailyArtwork = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % ARTWORKS.length;
    return ARTWORKS[index];
  };

  const artwork = getDailyArtwork();

  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(232, 224, 208, 0.1)',
      }}
    >
      <div className="museo-container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="badge-gold"
          style={{ marginBottom: '1.25rem' }}
        >
          <Calendar style={{ width: '13px', height: '13px' }} />
          <span>CURATED COLLECTION OF THE DAY</span>
        </motion.div>

        <div className="museo-grid-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
          {/* Artwork Card Left */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <LazyCard placeholderHeight="400px">
              <TiltCard dataCursor="view" className="glass-panel" style={{ padding: '0.75rem' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: '350px',
                  maxHeight: '480px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <div className="skeleton-shimmer-card" style={{ position: 'absolute', inset: 0, borderRadius: 0 }}>
                  <img
                    src={artwork.image}
                    alt=""
                    onLoad={(e) => e.target.classList.add('loaded')}
                    className="lazy-image"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #0B0A08 0%, transparent 60%)',
                    opacity: 0.8,
                    pointerEvents: 'none',
                  }}
                />

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
                    fontSize: '0.7rem',
                    color: 'var(--cream)',
                    zIndex: 10,
                  }}
                >
                  <span
                    className="badge-cream"
                    style={{
                      backgroundColor: 'rgba(11, 10, 8, 0.85)',
                      backdropFilter: 'blur(8px)',
                      fontSize: '0.65rem',
                    }}
                  >
                    <Compass style={{ width: '12px', height: '12px', color: 'var(--gold)' }} />
                    <span>DAILY EXHIBIT</span>
                  </span>
                  <span className="text-gold-pure" style={{ letterSpacing: '0.2em' }}>
                    {artwork.room}
                  </span>
                </div>
              </div>
            </TiltCard>
          </LazyCard>
        </motion.div>

          {/* Metadata Right */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <motion.div variants={fadeInUp}>
              <span
                className="font-mono"
                style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}
              >
                {artwork.year} — {artwork.era}
              </span>
              <h2
                className="font-serif font-section-heading"
                style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}
              >
                {artwork.title}
              </h2>
              <p
                className="font-mono text-gold-pure"
                style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.5rem' }}
              >
                BY {artwork.artist}
              </p>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.65 }}
            >
              {artwork.description}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="font-mono"
              style={{
                paddingTop: '1rem',
                borderTop: '1px solid rgba(232, 224, 208, 0.1)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div>
                <span
                  className="text-gold-pure"
                  style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                >
                  MEDIUM
                </span>
                <span>{artwork.medium}</span>
              </div>
              <div>
                <span
                  className="text-gold-pure"
                  style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                >
                  MUSEUM LOCATION
                </span>
                <span>{artwork.location}</span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} style={{ paddingTop: '0.5rem' }}>
              <MagneticButton variant="primary" onClick={() => navigate(`/artworks/${artwork.id}`)}>
                ENTER DYNAMIC 3D EXHIBIT
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
