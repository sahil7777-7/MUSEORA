import React from 'react';
import { Html } from '@react-three/drei';

export default function CanvasLoader() {
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        color: '#C6A56B',
        fontFamily: 'var(--font-mono)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '2px solid rgba(198, 165, 107, 0.3)',
          borderTop: '2px solid #C6A56B',
          borderRadius: '50%',
          animation: 'spinSlow 1s linear infinite',
        }} />
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>
          LOADING 3D MODEL
        </span>
      </div>
    </Html>
  );
}
