import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { museumAudio } from '../../utils/audio';

export default function MagneticButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon = true,
  ...props
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.15;  // Reduced from 0.25 — subtler pull
    const y = (e.clientY - (top + height / 2)) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const btnClass = variant === 'primary' ? 'btn-primary-museo' : variant === 'secondary' ? 'btn-secondary-museo' : '';

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => museumAudio.playHoverSound()}
      onClick={(e) => {
        museumAudio.playClickSound();
        onClick && onClick(e);
      }}
      animate={prefersReducedMotion ? {} : { x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 22, mass: 0.1 }}
      className={`${btnClass} ${className}`}
      data-cursor="click"
      {...props}
    >
      <span>{children}</span>
      {icon && (
        <ArrowRight style={{ width: '15px', height: '15px' }} aria-hidden="true" />
      )}
    </motion.button>
  );
}
