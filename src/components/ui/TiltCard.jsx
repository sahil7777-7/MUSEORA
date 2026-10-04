import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { museumAudio } from '../../utils/audio';

export default function TiltCard({ children, className = '', onClick, dataCursor = 'view' }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 5;   // Max 5deg — subtler than before
    const rX = -((y - centerY) / centerY) * 5;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    museumAudio.playHoverSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      museumAudio.playClickSound();
      onClick && onClick(e);
    }
  };

  return (
    <div style={{ perspective: prefersReducedMotion ? 'none' : '1200px' }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          museumAudio.playClickSound();
          onClick && onClick(e);
        }}
        animate={prefersReducedMotion ? {} : {
          rotateX,
          rotateY,
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{
          transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        className={`glass-panel ${isHovered ? 'glass-panel-hover' : ''} ${className}`}
        data-cursor={dataCursor}
        tabIndex={0}
        role="button"
      >
        {children}
      </motion.div>
    </div>
  );
}
