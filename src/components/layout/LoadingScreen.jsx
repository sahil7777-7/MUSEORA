import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsDone(true), 400);
          setTimeout(() => onFinish && onFinish(), 1400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Radial Warm Spotlight Glow */}
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(198, 165, 107, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          {/* 3D Wireframe Gem Ring System */}
          <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1px dotted rgba(198, 165, 107, 0.4)',
                animation: 'spinSlow 16s linear infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '12px',
                borderRadius: '50%',
                border: '1px dashed rgba(232, 224, 208, 0.3)',
                animation: 'spinSlow 22s linear infinite reverse',
              }}
            />
            <div
              style={{
                width: '64px',
                height: '64px',
                border: '2px solid #C6A56B',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 30px rgba(198, 165, 107, 0.3)',
                backgroundColor: 'rgba(29, 26, 21, 0.8)',
                backdropFilter: 'blur(8px)',
                animation: 'breatheScale 4s ease-in-out infinite',
              }}
            />
          </div>

          {/* Wordmark */}
          <div className="font-serif" style={{ textAlign: 'center', zIndex: 10 }}>
            <h1 style={{ fontSize: '2.5rem', letterSpacing: '0.3em', color: 'var(--text-primary)', fontWeight: 300, textTransform: 'uppercase' }}>
              MUSEORA
            </h1>
            <p className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--gold)', marginTop: '0.5rem' }}>
              DIGITAL MUSEUM
            </p>
          </div>

          {/* Progress Counter */}
          <div className="font-mono" style={{ marginTop: '3rem', fontSize: '0.9rem', letterSpacing: '0.2em', color: 'var(--text-secondary)', zIndex: 10 }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 500 }}>{Math.min(progress, 100)}</span> %
          </div>

          {/* Museum Split Door Exit Panels */}
          <motion.div
            animate={progress >= 100 ? { x: '-100%' } : { x: 0 }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '50%',
              backgroundColor: '#0B0A08',
              borderRight: '1px solid rgba(198, 165, 107, 0.2)',
              pointerEvents: 'none',
              zIndex: 20,
            }}
          />
          <motion.div
            animate={progress >= 100 ? { x: '100%' } : { x: 0 }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '50%',
              backgroundColor: '#0B0A08',
              borderLeft: '1px solid rgba(198, 165, 107, 0.2)',
              pointerEvents: 'none',
              zIndex: 20,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
