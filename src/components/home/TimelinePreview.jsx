import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TIMELINE_ERAS } from '../../data/museumData';
import MagneticButton from '../ui/MagneticButton';
import { Clock } from 'lucide-react';
import { museumAudio } from '../../utils/audio';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function TimelinePreview() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        paddingTop: '7rem',
        paddingBottom: '7rem',
        backgroundColor: 'var(--bg-secondary)',
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
            <div className="badge-gold" style={{ marginBottom: '0.75rem' }}>
              <Clock style={{ width: '14px', height: '14px' }} />
              <span>CHRONOLOGICAL JOURNEY</span>
            </div>
            <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              HISTORICAL TIMELINE
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <MagneticButton variant="secondary" onClick={() => navigate('/timeline')}>
              ENTER FULL TIMELINE
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="museo-grid-6"
        >
          {TIMELINE_ERAS.map((era) => (
            <motion.div
              key={era.year}
              variants={fadeInUp}
              onClick={() => {
                museumAudio.playClickSound();
                navigate('/timeline');
              }}
              onMouseEnter={() => museumAudio.playHoverSound()}
              className="glass-panel glass-panel-hover"
              style={{
                cursor: 'pointer',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
              data-cursor="click"
            >
              <span className="font-mono text-gold-pure font-hero" style={{ fontSize: '1.75rem', fontWeight: 300 }}>
                {era.year}
              </span>
              <h3 className="font-serif" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {era.eraTitle}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.5 }}>
                {era.headline}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
