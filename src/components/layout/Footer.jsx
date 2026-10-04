import React from 'react';
import { Link } from 'react-router-dom';
import { museumAudio } from '../../utils/audio';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--line)',
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-12)',
        color: 'var(--text-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(198, 165, 107, 0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div className="museo-container" style={{ position: 'relative', zIndex: 10 }}>
        <div
          className="museo-grid-4"
          style={{ paddingBottom: 'var(--space-16)', borderBottom: '1px solid var(--line)' }}
        >
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              MUSEORA
            </h2>
            <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.65, maxWidth: '320px', fontWeight: 300 }}>
              A luxury virtual museum experience built around art, history, culture, and spatial 3D exploration. Reimagining global heritage for the digital age.
            </p>
            <div className="font-mono text-gold-pure" style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>
              EST. 2026 — DIGITAL ARCHIVE
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
              NAVIGATION
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <li><Link to="/artworks" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>The Collection</Link></li>
              <li><Link to="/exhibitions" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>Exhibition Halls</Link></li>
              <li><Link to="/artists" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>Master Artists</Link></li>
              <li><Link to="/timeline" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>Historical Timeline</Link></li>
              <li><Link to="/tour" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>3D Virtual Tour</Link></li>
              <li><Link to="/map" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>Museum Floor Map</Link></li>
            </ul>
          </div>

          {/* Magazine & Portal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
              MAGAZINE & EVENTS
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <li><Link to="/journal" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>Curator Journal</Link></li>
              <li><Link to="/events" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>Upcoming Symposia</Link></li>
              <li><Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>Visitor Passport</Link></li>
              <li><Link to="/admin" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => museumAudio.playHoverSound()}>Curator Dashboard</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}>
              THE CURATOR’S DISPATCH
            </h3>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.6, fontWeight: 300 }}>
              Receive monthly curatorial monographs, new 3D acquisition reveals, and private virtual exhibition invitations.
            </p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="input-museo"
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                onClick={() => museumAudio.playClickSound()}
                className="btn-primary-museo"
                style={{ padding: '0.75rem 1.25rem' }}
                data-cursor="click"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          className="font-mono"
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            opacity: 0.7,
            gap: '1rem',
          }}
        >
          <div>© 2026 MUSEORA VIRTUAL MUSEUM. ALL RIGHTS RESERVED.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>TERMS OF CURATION</span>
            <span>PRIVACY ARCHIVE</span>
            <span>ACCESSIBILITY MODE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
