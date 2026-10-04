import React, { useState } from 'react';
import PageTransition from '../components/layout/PageTransition';
import { ARTWORKS } from '../data/museumData';
import { Sliders, Activity } from 'lucide-react';

export default function Admin() {
  const [ambientIntensity, setAmbientIntensity] = useState(0.4);
  const [spotlightAngle, setSpotlightAngle] = useState(45);
  const [particleDensity, setParticleDensity] = useState(250);

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <div className="museo-flex-between" style={{ flexWrap: 'wrap', borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '3rem', marginBottom: '4rem', gap: '1.5rem' }}>
            <div>
              <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                SENIOR CURATOR PORTAL
              </span>
              <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                CURATOR DASHBOARD
              </h1>
            </div>
            <div className="badge-gold">
              GALLERY LIGHTING & RENDERING CONTROLLER
            </div>
          </div>

          <div className="museo-grid-2" style={{ gap: '3rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="font-mono text-gold-pure" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', letterSpacing: '0.15em', borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '1rem' }}>
                <Sliders style={{ width: '16px', height: '16px' }} />
                <span>SPATIAL LIGHTING CONTROLS</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="museo-flex-between font-mono" style={{ fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>AMBIENT LIGHT INTENSITY</span>
                  <span className="text-gold-pure">{ambientIntensity}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={ambientIntensity}
                  onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="museo-flex-between font-mono" style={{ fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>SPOTLIGHT BEAM ANGLE</span>
                  <span className="text-gold-pure">{spotlightAngle}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="5"
                  value={spotlightAngle}
                  onChange={(e) => setSpotlightAngle(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="museo-flex-between font-mono" style={{ fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>DUST PARTICLE FIELD DENSITY</span>
                  <span className="text-gold-pure">{particleDensity} Pts</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={particleDensity}
                  onChange={(e) => setParticleDensity(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                />
              </div>

              <div className="museo-flex-between font-mono" style={{ paddingTop: '1rem', borderTop: '1px solid rgba(232, 224, 208, 0.1)', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>STATUS:</span>
                <span style={{ color: 'var(--success)' }}>ALL 3D ENGINES NOMINAL</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="font-mono text-gold-pure" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', letterSpacing: '0.15em', borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '1rem' }}>
                <Activity style={{ width: '16px', height: '16px' }} />
                <span>ACTIVE GALLERY CATALOG</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }} className="font-mono">
                {ARTWORKS.map((art) => (
                  <div
                    key={art.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '6px',
                      backgroundColor: '#0B0A08',
                      border: '1px solid rgba(232, 224, 208, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span className="font-serif" style={{ color: 'var(--text-primary)', display: 'block' }}>{art.title}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>{art.artist} • {art.room}</span>
                    </div>
                    <span className="text-gold-pure" style={{ fontSize: '0.65rem', border: '1px solid rgba(198, 165, 107, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {art.threeDType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
