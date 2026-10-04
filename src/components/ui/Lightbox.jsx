import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function Lightbox({ image, title, isOpen, onClose }) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));
  const handleReset = () => setScale(1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(5, 4, 3, 0.98)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Top Controls Header */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to bottom, rgba(11, 10, 8, 0.8) 0%, transparent 100%)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span
              className="font-mono text-gold-pure"
              style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              HIGH-RESOLUTION LIGHTBOX
            </span>
            <h3
              className="font-serif"
              style={{ fontSize: '1.25rem', color: '#F5F1E8', letterSpacing: '0.04em' }}
            >
              {title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={handleZoomIn} style={btnStyle} title="Zoom In">
              <ZoomIn style={{ width: '18px', height: '18px' }} />
            </button>
            <button onClick={handleZoomOut} style={btnStyle} title="Zoom Out">
              <ZoomOut style={{ width: '18px', height: '18px' }} />
            </button>
            <button onClick={handleReset} style={btnStyle} title="Reset">
              <RotateCcw style={{ width: '16px', height: '16px' }} />
            </button>
            <button onClick={onClose} style={closeBtnStyle} title="Close Lightbox">
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>

        {/* Image Container with Drag & Zoom */}
        <div
          style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.img
            src={image}
            alt={title}
            drag={scale > 1}
            dragConstraints={{
              left: -400 * (scale - 1),
              right: 400 * (scale - 1),
              top: -250 * (scale - 1),
              bottom: 250 * (scale - 1),
            }}
            animate={{ scale: scale }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            style={{
              maxHeight: '85vh',
              maxWidth: '90vw',
              objectFit: 'contain',
              cursor: scale > 1 ? 'grab' : 'zoom-in',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(232, 224, 208, 0.1)',
            }}
            onClick={() => {
              if (scale === 1) setScale(2);
              else setScale(1);
            }}
          />
        </div>

        {/* Footer Guidance */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            pointerEvents: 'none',
          }}
        >
          {scale > 1 ? 'DRAG TO PAN • DOUBLE CLICK OR RESET TO ZOOM OUT' : 'CLICK ON IMAGE TO QUICK-ZOOM'}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const btnStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(232, 224, 208, 0.15)',
  color: 'var(--text-primary)',
  padding: '0.6rem',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s var(--ease-premium)',
};

const closeBtnStyle = {
  ...btnStyle,
  backgroundColor: 'var(--gold)',
  color: 'var(--bg-primary)',
  border: '1px solid var(--gold)',
};
