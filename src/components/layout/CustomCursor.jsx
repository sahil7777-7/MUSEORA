import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorMode, setCursorMode] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchOnly, setIsTouchOnly] = useState(false);

  useEffect(() => {
    const hasCoarse = window.matchMedia('(pointer: coarse)').matches;
    const hasFine = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Disable custom cursor on touch-only devices or when user prefers reduced motion
    if ((hasCoarse && !hasFine) || prefersReducedMotion) {
      setIsTouchOnly(true);
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target.closest('[data-cursor]');
      if (target) {
        const mode = target.getAttribute('data-cursor');
        setCursorMode(mode || 'click');
      } else if (e.target.closest('a, button, input, select, textarea, [role="button"]')) {
        setCursorMode('click');
      } else {
        setCursorMode('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouchOnly || !isVisible) return null;

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: '#E8E0D0',
      border: '0px solid transparent',
      borderRadius: '50%',
      x: position.x - 6,
      y: position.y - 6,
    },
    click: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(198, 165, 107, 0.18)',
      border: '1px solid #C6A56B',
      borderRadius: '50%',
      x: position.x - 24,
      y: position.y - 24,
    },
    view: {
      width: 64,
      height: 64,
      backgroundColor: 'rgba(232, 224, 208, 0.22)',
      border: '1px solid #E8E0D0',
      borderRadius: '50%',
      x: position.x - 32,
      y: position.y - 32,
    },
    rotate: {
      width: 72,
      height: 72,
      backgroundColor: 'rgba(198, 165, 107, 0.28)',
      border: '1px dashed #C6A56B',
      borderRadius: '50%',
      x: position.x - 36,
      y: position.y - 36,
    }
  };

  return (
    <>
      {/* Trailing Ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(198, 165, 107, 0.3)',
        }}
        animate={{
          x: position.x - 18,
          y: position.y - 18,
        }}
        transition={{ type: 'spring', damping: 18, stiffness: 150, mass: 0.3 }}
      />
      
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.25em',
          color: '#E8E0D0',
          textTransform: 'uppercase',
          mixBlendMode: 'difference',
        }}
        animate={cursorMode}
        variants={variants}
        transition={{ type: 'spring', damping: 28, stiffness: 350, mass: 0.2 }}
      >
        {cursorMode === 'view' && 'VIEW'}
        {cursorMode === 'rotate' && 'ROTATE'}
        {cursorMode === 'click' && 'CLICK'}
      </motion.div>
    </>
  );
}
