import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MuseumScene from '../3d/MuseumScene';
import HeroArtifact from '../3d/HeroArtifact';
import MagneticButton from '../ui/MagneticButton';
import {
  museoHeroEyebrow,
  museoHeroTitle,
  museoHeroSubtitle,
  museoHeroCta,
} from '../../utils/motionVariants';

export default function HeroMuseum() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (e.clientX / innerWidth) * 2 - 1,
      y: (e.clientY / innerHeight) * 2 - 1,
    });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#0B0A08',
      }}
    >
      {/* 3D Canvas Background & Interactive Artifact */}
      <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity, y: y2, pointerEvents: 'none' }}>
        <MuseumScene cameraPos={[0, 0, 4.5]} particleCount={300}>
          <HeroArtifact mousePos={mousePos} />
        </MuseumScene>
      </motion.div>

      {/* Radial Ambient Vignette */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(circle, transparent 20%, #0B0A08 90%)',
          pointerEvents: 'none',
          opacity,
          y: y1
        }}
      />

      {/* Content */}
      <div
        className="museo-container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '7rem',
          paddingBottom: '5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        {/* Animated Badge */}
        <motion.div
          variants={museoHeroEyebrow}
          initial="hidden"
          animate="visible"
          className="badge-gold"
          style={{ marginBottom: '1.5rem' }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--gold)', animation: 'breatheScale 2s infinite' }} />
          <span>IMMERSIVE VIRTUAL ART SANCTUARY</span>
        </motion.div>

        {/* Shimmer Display Headline */}
        <motion.h1
          variants={museoHeroTitle}
          initial="hidden"
          animate="visible"
          className="font-serif font-hero"
          style={{ color: '#F5F1E8', textTransform: 'uppercase', maxWidth: '1100px', fontWeight: 300 }}
        >
          ART. HISTORY. CULTURE.<br />
          <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: 400 }}>REIMAGINED.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={museoHeroSubtitle}
          initial="hidden"
          animate="visible"
          style={{
            marginTop: '1.5rem',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            fontWeight: 300,
            lineHeight: 1.6,
            letterSpacing: '0.01em',
          }}
        >
          Step into a dark cinematic digital museum where centuries of masterworks, classical sculptures, and sacred heritage unfold in 3D spatial depth.
        </motion.p>

        {/* Magnetic Action Buttons */}
        <motion.div
          variants={museoHeroCta}
          initial="hidden"
          animate="visible"
          style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}
        >
          <MagneticButton variant="primary" onClick={() => navigate('/tour')}>
            ENTER MUSEUM
          </MagneticButton>
          <MagneticButton variant="secondary" onClick={() => navigate('/artworks')}>
            EXPLORE COLLECTION
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
