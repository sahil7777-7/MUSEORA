import React from 'react';

export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`glass-panel ${hover ? 'glass-panel-hover' : ''} ${className}`}
      style={{
        padding: '1.5rem',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
