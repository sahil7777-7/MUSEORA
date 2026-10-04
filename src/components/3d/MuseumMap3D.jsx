import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROOMS } from '../../data/museumData';
import { Compass, ArrowUpRight } from 'lucide-react';
import { museumAudio } from '../../utils/audio';

export default function MuseumMap3D() {
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
  const navigate = useNavigate();

  const handleRoomClick = (room) => {
    museumAudio.playClickSound();
    setSelectedRoom(room);
  };

  const handleEnterRoom = (roomId) => {
    museumAudio.playClickSound();
    navigate(`/artworks?room=${roomId}`);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          gap: '1.5rem',
        }}
      >
        {/* Top Info Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(232, 224, 208, 0.1)',
            paddingBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Compass style={{ width: '20px', height: '20px', color: 'var(--gold)' }} />
            <h2 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '0.1em' }}>
              MUSEUM FLOOR PLAN & SPATIAL MAP
            </h2>
          </div>
          <div className="badge-gold" style={{ fontSize: '0.65rem' }}>
            7 ACTIVE WINGS • REAL-TIME SYNC
          </div>
        </div>

        {/* 3D Isometric Map Node Matrix */}
        <div className="museo-grid-6" style={{ position: 'relative', zIndex: 10 }}>
          {ROOMS.map((room, idx) => {
            const isSelected = selectedRoom.id === room.id;
            return (
              <motion.div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                onMouseEnter={() => museumAudio.playHoverSound()}
                whileHover={{ scale: 1.03, y: -3 }}
                animate={isSelected ? { scale: 1.03, y: -3 } : { scale: 1, y: 0 }}
                style={{
                  cursor: 'pointer',
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'var(--bg-panel)' : 'rgba(21, 19, 15, 0.8)',
                  border: isSelected ? '1px solid var(--gold)' : '1px solid rgba(232, 224, 208, 0.1)',
                  boxShadow: isSelected ? '0 0 25px rgba(198, 165, 107, 0.25)' : 'none',
                  transition: 'border-color 0.3s',
                }}
                data-cursor="click"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="font-mono text-gold-pure" style={{ fontSize: '0.65rem' }}>0{idx + 1}</span>
                  {isSelected && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--gold)', animation: 'pulseGlow 2s infinite' }} />}
                </div>
                <h3 className="font-serif" style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {room.title}
                </h3>
                <p className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                  {room.subtitle}
                </p>
                <div
                  className="font-mono"
                  style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid rgba(232, 224, 208, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.6rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>{room.count}</span>
                  <span className="text-gold-pure">{room.visitors}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Room Bar */}
        {selectedRoom && (
          <motion.div
            key={selectedRoom.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'relative',
              zIndex: 10,
              backgroundColor: 'rgba(29, 26, 21, 0.95)',
              border: '1px solid rgba(198, 165, 107, 0.4)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="museo-flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div className="font-mono text-gold-pure" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  SELECTED WING • {selectedRoom.visitors}
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
                  {selectedRoom.title}
                </h3>
              </div>

              <button
                onClick={() => handleEnterRoom(selectedRoom.id)}
                onMouseEnter={() => museumAudio.playHoverSound()}
                className="btn-primary-museo"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.7rem' }}
                data-cursor="click"
              >
                <span>ENTER WING</span>
                <ArrowUpRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 300 }}>
              {selectedRoom.description}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
