import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ARTISTS } from '../../data/museumData';
import TiltCard from '../ui/TiltCard';
import { ArrowUpRight } from 'lucide-react';
import { museumAudio } from '../../utils/audio';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.12 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function FeaturedArtists() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        paddingTop: '8rem',
        paddingBottom: '8rem',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(232, 224, 208, 0.1)',
      }}
    >
      <div className="museo-container">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="museo-flex-between" 
          style={{ flexWrap: 'wrap', marginBottom: '4rem', gap: '1.5rem' }}
        >
          <motion.div variants={fadeInUp}>
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              MASTERS & VISIONARIES
            </span>
            <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              THE ARTISTS
            </h2>
          </motion.div>
          <motion.button
            variants={fadeInUp}
            onClick={() => {
              museumAudio.playClickSound();
              navigate('/artists');
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
            <span>VIEW ALL MASTER ARTISTS</span>
            <ArrowUpRight style={{ width: '16px', height: '16px' }} />
          </motion.button>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="museo-grid-4"
        >
          {ARTISTS.map((artist) => (
            <motion.div variants={fadeInUp} key={artist.id}>
              <TiltCard
                onClick={() => {
                  museumAudio.playClickSound();
                  navigate(`/artists/${artist.id}`);
                }}
                dataCursor="view"
              >
                <div
                  style={{
                    position: 'relative',
                    height: '420px',
                    overflow: 'hidden',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <img
                    src={artist.portrait}
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, #0B0A08 0%, rgba(11, 10, 8, 0.4) 50%, transparent 100%)',
                    }}
                  />

                  <div
                    className="font-mono"
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.65rem',
                      color: 'var(--gold)',
                    }}
                  >
                    <span className="badge-cream" style={{ backgroundColor: 'rgba(11, 10, 8, 0.85)' }}>
                      {artist.country}
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>{artist.worksCount} WORKS</span>
                  </div>

                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{artist.years}</span>
                    <h3 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>
                      {artist.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 300 }}>
                      {artist.style}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
