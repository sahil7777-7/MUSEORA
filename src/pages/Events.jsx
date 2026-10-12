import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import { EVENTS } from '../data/museumData';
import TiltCard from '../components/ui/TiltCard';
import MagneticButton from '../components/ui/MagneticButton';
import { Calendar, MapPin, User, CheckCircle2 } from 'lucide-react';
import { museumAudio } from '../utils/audio';
import { getReservedEvents, reserveEvent, cancelEventReservation } from '../utils/storage';

export default function Events() {
  const [reservedEvents, setReservedEvents] = useState(() => getReservedEvents());

  useEffect(() => {
    const handleSync = () => {
      setReservedEvents(getReservedEvents());
    };
    window.addEventListener('museora_reservations_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('museora_reservations_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleReserve = (eventId) => {
    museumAudio.playClickSound();
    const updated = reserveEvent(eventId);
    setReservedEvents(updated);
  };

  const handleCancel = (eventId) => {
    museumAudio.playClickSound();
    const updated = cancelEventReservation(eventId);
    setReservedEvents(updated);
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="museo-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderBottom: '1px solid rgba(232, 224, 208, 0.1)', paddingBottom: '3rem', marginBottom: '4rem' }}
          >
            <span className="font-mono text-gold-pure" style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              VIRTUAL GALAS & CURATOR SYMPOSIA
            </span>
            <h1 className="font-serif font-display-large" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              MUSEUM EVENTS
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, marginTop: '1rem' }}>
              Reserve your virtual seat for upcoming live 3D walkthroughs, art history lectures, and interactive 3D lighting workshops.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {EVENTS.map((event, index) => {
              const isReserved = reservedEvents.includes(event.id);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.8), ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard dataCursor="click" style={{ padding: '2.5rem' }}>
                    <div className="museo-grid-2" style={{ alignItems: 'center', gap: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="badge-gold">
                          <Calendar style={{ width: '14px', height: '14px' }} />
                          <span>{event.date}</span>
                        </div>
  
                        <h2 className="font-serif" style={{ fontSize: '2.25rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                          {event.title}
                        </h2>
  
                        <div className="font-mono" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin style={{ width: '14px', height: '14px', color: 'var(--gold)' }} />
                            <span>{event.location}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User style={{ width: '14px', height: '14px', color: 'var(--gold)' }} />
                            <span>SPEAKER: {event.speaker}</span>
                          </div>
                        </div>
  
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.6 }}>
                          {event.description}
                        </p>
                      </div>
  
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', borderLeft: '1px solid rgba(232, 224, 208, 0.1)', paddingLeft: '2rem' }}>
                        <span className="badge-gold">
                          {isReserved ? 'RESERVATION CONFIRMED' : `${event.seatsLeft} SEATS REMAINING`}
                        </span>
  
                        {isReserved ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', width: '100%' }}>
                            <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                              <span>PASS ADDED TO PROFILE</span>
                            </div>
                            <button
                              onClick={() => handleCancel(event.id)}
                              style={{
                                background: 'none',
                                border: '1px solid rgba(232, 224, 208, 0.2)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.65rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                padding: '0.4rem 0.8rem',
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
                        ) : (
                          <MagneticButton variant="primary" onClick={() => handleReserve(event.id)}>
                            RESERVE VIRTUAL PASS
                          </MagneticButton>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
