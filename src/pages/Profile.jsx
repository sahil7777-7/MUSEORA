import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { getViewedArtworks, getFavorites, getCompletedToursCount, getReservedEvents, cancelEventReservation } from '../utils/storage';
import { EVENTS } from '../data/museumData';
import { Compass, Award, Bookmark, Eye, Layers, Calendar, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const viewedCount = getViewedArtworks().length;
  const favoritesCount = getFavorites().length;
  const toursCount = getCompletedToursCount();
  const exhibitionsCount = 3;

  const [reservedEventIds, setReservedEventIds] = useState(() => getReservedEvents());

  useEffect(() => {
    const handleSync = () => {
      setReservedEventIds(getReservedEvents());
    };
    window.addEventListener('museora_reservations_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('museora_reservations_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleCancelPass = (eventId) => {
    const updated = cancelEventReservation(eventId);
    setReservedEventIds(updated);
  };

  const reservedEventsList = reservedEventIds
    .map((id) => EVENTS.find((e) => e.id === id))
    .filter(Boolean);

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="museo-flex-between"
            style={{ flexWrap: 'wrap', borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '3rem', marginBottom: '4rem', gap: '1.5rem' }}
          >
            <div>
              <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                VISITOR DIGITAL PASSPORT
              </span>
              <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                CURATOR PASSPORT
              </h1>
            </div>
            <div className="badge-gold">
              <Award style={{ width: '16px', height: '16px' }} />
              <span>PATRON LEVEL • GOLD MEMBER</span>
            </div>
          </motion.div>

          <div className="museo-grid-4" style={{ marginBottom: '4rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div className="museo-flex-between text-gold-pure">
                <Eye style={{ width: '20px', height: '20px' }} />
                <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>METRIC 01</span>
              </div>
              <div className="font-serif font-hero" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', fontWeight: 300, paddingTop: '0.5rem' }}>{viewedCount}</div>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>ARTWORKS VIEWED</p>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div className="museo-flex-between text-gold-pure">
                <Layers style={{ width: '20px', height: '20px' }} />
                <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>METRIC 02</span>
              </div>
              <div className="font-serif font-hero" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', fontWeight: 300, paddingTop: '0.5rem' }}>{exhibitionsCount}</div>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>EXHIBITIONS EXPLORED</p>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div className="museo-flex-between text-gold-pure">
                <Bookmark style={{ width: '20px', height: '20px' }} />
                <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>METRIC 03</span>
              </div>
              <div className="font-serif font-hero" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', fontWeight: 300, paddingTop: '0.5rem' }}>{favoritesCount}</div>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>SAVED TO COLLECTION</p>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div className="museo-flex-between text-gold-pure">
                <Compass style={{ width: '20px', height: '20px' }} />
                <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>METRIC 04</span>
              </div>
              <div className="font-serif font-hero" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', fontWeight: 300, paddingTop: '0.5rem' }}>{toursCount}</div>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>3D TOURS COMPLETED</p>
            </motion.div>
          </div>

          {/* Reserved Event Passes Section */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="museo-flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  ACCESS PASSES
                </span>
                <h3 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                  RESERVED EVENT PASSES ({reservedEventsList.length})
                </h3>
              </div>
              <Link
                to="/events"
                className="btn-secondary-museo"
                style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                data-cursor="click"
              >
                EXPLORE ALL EVENTS →
              </Link>
            </div>

            {reservedEventsList.length === 0 ? (
              <div style={{
                padding: '2.5rem',
                textAlign: 'center',
                backgroundColor: '#0B0A08',
                borderRadius: '8px',
                border: '1px dashed rgba(232, 224, 208, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Calendar style={{ width: '28px', height: '28px', color: 'var(--text-secondary)' }} />
                <p className="font-serif" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  NO ACTIVE RESERVATIONS
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px' }}>
                  Reserve your virtual seat for upcoming live 3D walkthroughs, art history lectures, and curator symposia.
                </p>
                <Link to="/events" className="btn-primary-museo" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }} data-cursor="click">
                  BROWSE EVENTS
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reservedEventsList.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      padding: '1.5rem',
                      backgroundColor: '#0B0A08',
                      borderRadius: '8px',
                      border: '1px solid rgba(198, 165, 107, 0.25)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '600px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="badge-gold" style={{ fontSize: '0.65rem' }}>
                          CONFIRMED PASS • {event.location}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                          <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                          <span>VALIDATED</span>
                        </div>
                      </div>
                      <h4 className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        {event.title}
                      </h4>
                      <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {event.date} • SPEAKER: {event.speaker}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelPass(event.id)}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#ef4444',
                        fontSize: '0.7rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        transition: 'all 0.2s ease',
                      }}
                      data-cursor="click"
                    >
                      CANCEL PASS
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>PATRON PRIVILEGES</h3>
            <div className="museo-grid-3" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 300 }}>
              <div style={{ padding: '1rem', backgroundColor: '#0B0A08', borderRadius: '8px', border: '1px solid rgba(232, 224, 208, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem' }}>01 • AI CURATOR ACCESS</span>
                <p>Unlimited priority queries with Senior Curator AI system.</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#0B0A08', borderRadius: '8px', border: '1px solid rgba(232, 224, 208, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem' }}>02 • HIGH-RES 3D INSPECTION</span>
                <p>Full 360-degree rotation and macro zoom on all cataloged masterpieces.</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#0B0A08', borderRadius: '8px', border: '1px solid rgba(232, 224, 208, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem' }}>03 • VIRTUAL GALA PASSES</span>
                <p>Guaranteed entry passes for live curator walkthrough symposia.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
