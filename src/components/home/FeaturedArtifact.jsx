import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FEATURED_ARTIFACT } from '../../data/museumData';
import TiltCard from '../ui/TiltCard';
import MagneticButton from '../ui/MagneticButton';
import { Sparkles, Compass } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.12 }
  }
};

export default function FeaturedArtifact() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        backgroundColor: 'var(--bg-secondary)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(232, 224, 208, 0.1)',
        borderBottom: '1px solid rgba(232, 224, 208, 0.1)',
      }}
    >
      {/* Radial Gold Background Spotlight */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(198, 165, 107, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          y: yBg
        }}
      />

      <div className="museo-container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="badge-gold"
          style={{ marginBottom: '1.25rem' }}
        >
          <Sparkles style={{ width: '14px', height: '14px' }} />
          <span>FEATURED MASTERWORK</span>
        </motion.div>

        <div className="museo-grid-2" style={{ alignItems: 'center' }}>
          {/* Metadata */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <motion.div variants={fadeInUp}>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                {FEATURED_ARTIFACT.year} — {FEATURED_ARTIFACT.era}
              </span>
              <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                {FEATURED_ARTIFACT.title}
              </h2>
              <p className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                BY {FEATURED_ARTIFACT.artist}
              </p>
            </motion.div>

            <motion.p variants={fadeInUp} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.65 }}>
              {FEATURED_ARTIFACT.description}
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
                <span className="text-gold-pure" style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>MEDIUM</span>
                <span>{FEATURED_ARTIFACT.medium}</span>
              </div>
              <div>
                <span className="text-gold-pure" style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>LOCATION</span>
                <span>{FEATURED_ARTIFACT.location}</span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} style={{ paddingTop: '0.5rem' }}>
              <MagneticButton variant="primary" onClick={() => navigate(`/artworks/${FEATURED_ARTIFACT.id}`)}>
                VIEW ARTIFACT SPECIFICATIONS
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Artwork Card */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard dataCursor="view" className="glass-panel" style={{ padding: '0.75rem' }}>
              <div style={{ position: 'relative', width: '100%', minHeight: '350px', maxHeight: '480px', borderRadius: '8px', overflow: 'hidden' }}>
                <img
                  src={FEATURED_ARTIFACT.image}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #0B0A08 0%, transparent 60%)',
                    opacity: 0.8,
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
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div className="badge-cream" style={{ backgroundColor: 'rgba(11, 10, 8, 0.85)', backdropFilter: 'blur(8px)', fontSize: '0.65rem' }}>
                    <Compass style={{ width: '12px', height: '12px', color: 'var(--gold)' }} />
                    <span>3D MODEL READY</span>
                  </div>
                  <span className="text-gold-pure" style={{ letterSpacing: '0.2em' }}>SLOT #001</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
