import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROOMS } from '../../data/museumData';
import TiltCard from '../ui/TiltCard';
import { ArrowUpRight } from 'lucide-react';
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

export default function ExploreRooms() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        paddingTop: '8rem',
        paddingBottom: '8rem',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="museo-container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
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
              MUSEUM GALLERIES & WINGS
            </span>
            <h2 className="font-serif font-section-heading" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              EXPLORE THE ROOMS
            </h2>
          </motion.div>
          <motion.p variants={fadeInUp} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', fontWeight: 300 }}>
            Each gallery wing houses specific historical eras, materials, and spatial lighting environments tailored to the artworks.
          </motion.p>
        </motion.div>

        {/* Room Cards Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="museo-grid-3"
        >
          {ROOMS.map((room, index) => (
            <motion.div 
              key={room.id}
              variants={fadeInUp}
            >
              <TiltCard
                onClick={() => {
                  museumAudio.playClickSound();
                  navigate(`/artworks?room=${room.id}`);
                }}
                dataCursor="view"
              >
                <div
                  style={{
                    position: 'relative',
                    height: '380px',
                    overflow: 'hidden',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Background Image */}
                  <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <img
                      src={room.image}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, transition: 'transform 0.7s, opacity 0.7s' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, #0B0A08 0%, rgba(11, 10, 8, 0.4) 50%, transparent 100%)',
                      }}
                    />
                  </div>

                  {/* Top Info */}
                  <div
                    className="font-mono"
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.7rem',
                      color: 'var(--gold)',
                    }}
                  >
                    <span className="badge-cream" style={{ backgroundColor: 'rgba(11, 10, 8, 0.85)' }}>
                      ROOM 0{index + 1}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{room.visitors}</span>
                  </div>

                  {/* Bottom Text */}
                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span className="font-mono text-gold-pure" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      {room.subtitle}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>
                        {room.title}
                      </h3>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(29, 26, 21, 0.8)',
                          border: '1px solid rgba(232, 224, 208, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--cream)',
                        }}
                      >
                        <ArrowUpRight style={{ width: '20px', height: '20px' }} />
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 300 }}>
                      {room.description}
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
