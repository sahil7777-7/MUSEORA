import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows } from '@react-three/drei';
import { ROOMS } from '../../data/museumData';
import { Compass, ArrowUpRight } from 'lucide-react';
import { museumAudio } from '../../utils/audio';
import CanvasLoader from './CanvasLoader';
import ParticleField from './ParticleField';

const FLOOR_PLAN_NODES = [
  { id: 'classical-sculpture', title: 'SCULPTURE HALL', pos: [-3.8, 0.1, -1.2], size: [2.2, 0.35, 2.2], color: '#C6A56B' },
  { id: 'ancient-heritage', title: 'SACRED ANTIQUITIES', pos: [-1.8, 0.1, 1.8], size: [2.0, 0.35, 2.0], color: '#B8860B' },
  { id: 'renaissance-hall', title: 'RENAISSANCE GALLERY', pos: [0, 0.1, -1.8], size: [2.6, 0.35, 2.4], color: '#C6A56B' },
  { id: 'impressionist-wing', title: 'IMPRESSIONIST WING', pos: [2.6, 0.1, -0.6], size: [2.2, 0.35, 2.2], color: '#8EA88C' },
  { id: 'digital-future', title: 'DIGITAL PAVILION', pos: [3.8, 0.1, 1.8], size: [2.0, 0.35, 2.0], color: '#7E9F9D' },
];

function FloorPlanScene({ selectedRoom, onSelectRoom }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <group>
      {/* Museum Architectural Ground Base */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[14, 0.2, 10]} />
        <meshStandardMaterial color="#110F0C" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Grid Lines on Architectural Base */}
      <gridHelper args={[14, 14, '#C6A56B', '#221F19']} position={[0, -0.04, 0]} />

      {/* Luminous Connecting Hallway Tracks */}
      <group position={[0, 0.01, 0]}>
        {/* Sculpture to Renaissance */}
        <mesh position={[-1.9, 0, -1.5]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[3.8, 0.04, 0.3]} />
          <meshStandardMaterial color="#C6A56B" emissive="#C6A56B" emissiveIntensity={0.2} roughness={0.3} />
        </mesh>
        {/* Antiquities to Renaissance */}
        <mesh position={[-0.9, 0, 0]}>
          <boxGeometry args={[0.3, 0.04, 3.6]} />
          <meshStandardMaterial color="#C6A56B" emissive="#C6A56B" emissiveIntensity={0.2} roughness={0.3} />
        </mesh>
        {/* Renaissance to Impressionist */}
        <mesh position={[1.3, 0, -1.2]} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[2.8, 0.04, 0.3]} />
          <meshStandardMaterial color="#C6A56B" emissive="#C6A56B" emissiveIntensity={0.2} roughness={0.3} />
        </mesh>
        {/* Impressionist to Digital */}
        <mesh position={[3.2, 0, 0.6]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[2.8, 0.04, 0.3]} />
          <meshStandardMaterial color="#C6A56B" emissive="#C6A56B" emissiveIntensity={0.2} roughness={0.3} />
        </mesh>
      </group>

      {/* 5 Architectural Room Pavilions */}
      {FLOOR_PLAN_NODES.map((node) => {
        const isSelected = selectedRoom?.id === node.id;
        const isHovered = hoveredId === node.id;
        const matchingRoom = ROOMS.find((r) => r.id === node.id);

        return (
          <group
            key={node.id}
            position={[node.pos[0], isSelected ? 0.3 : 0.1, node.pos[2]]}
            onClick={(e) => {
              e.stopPropagation();
              if (matchingRoom) onSelectRoom(matchingRoom);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredId(node.id);
              museumAudio.playHoverSound();
            }}
            onPointerOut={() => setHoveredId(null)}
          >
            {/* Room Foundation Block */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={node.size} />
              <meshStandardMaterial
                color={isSelected ? '#2A2318' : isHovered ? '#221D16' : '#181511'}
                metalness={isSelected ? 0.8 : 0.4}
                roughness={0.25}
              />
            </mesh>

            {/* Glowing Golden Border Rim */}
            <mesh position={[0, node.size[1] / 2 + 0.01, 0]}>
              <boxGeometry args={[node.size[0] + 0.06, 0.03, node.size[2] + 0.06]} />
              <meshStandardMaterial
                color={isSelected ? '#FFE082' : isHovered ? '#C6A56B' : '#4A3E2A'}
                emissive={isSelected ? '#C6A56B' : isHovered ? '#8C7449' : '#000'}
                emissiveIntensity={isSelected ? 0.6 : 0.2}
              />
            </mesh>

            {/* Vertical Spotlight for Selected Wing */}
            {isSelected && (
              <>
                <spotLight
                  position={[0, 4, 0]}
                  target-position={[0, 0, 0]}
                  intensity={3}
                  color="#FFD700"
                  angle={0.6}
                  penumbra={0.4}
                />
                <mesh position={[0, 1.2, 0]}>
                  <cylinderGeometry args={[0.02, node.size[0] * 0.4, 2.4, 16]} />
                  <meshStandardMaterial
                    color="#C6A56B"
                    emissive="#FFD700"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.25}
                  />
                </mesh>
              </>
            )}

            {/* 3D Floating HTML Label */}
            <Html position={[0, node.size[1] + (isSelected ? 0.8 : 0.4), 0]} center distanceFactor={14}>
              <div
                style={{
                  backgroundColor: isSelected ? 'rgba(198, 165, 107, 0.95)' : 'rgba(11, 10, 8, 0.9)',
                  color: isSelected ? '#0B0A08' : '#F5F1E8',
                  border: isSelected ? '1px solid #FFE082' : '1px solid rgba(198, 165, 107, 0.3)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  boxShadow: isSelected ? '0 0 20px rgba(198, 165, 107, 0.6)' : 'none',
                  fontWeight: isSelected ? 600 : 400,
                  transform: isHovered || isSelected ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                {node.title}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          gap: '2rem',
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
            paddingBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Compass style={{ width: '22px', height: '22px', color: 'var(--gold)' }} />
            <h2 className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--text-primary)', letterSpacing: '0.1em' }}>
              MUSEUM FLOOR PLAN & SPATIAL MAP
            </h2>
          </div>
          <div className="badge-gold" style={{ fontSize: '0.65rem' }}>
            5 ACTIVE WINGS • REAL-TIME SYNC
          </div>
        </div>

        {/* Room Selection Cards Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1rem',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {ROOMS.map((room, idx) => {
            const isSelected = selectedRoom?.id === room.id;
            return (
              <motion.div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                onMouseEnter={() => museumAudio.playHoverSound()}
                whileHover={{ scale: 1.02, y: -2 }}
                animate={isSelected ? { scale: 1.02, y: -2 } : { scale: 1, y: 0 }}
                style={{
                  cursor: 'pointer',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'var(--bg-panel)' : 'rgba(21, 19, 15, 0.85)',
                  border: isSelected ? '1px solid var(--gold)' : '1px solid rgba(232, 224, 208, 0.12)',
                  boxShadow: isSelected ? '0 0 30px rgba(198, 165, 107, 0.25)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '160px',
                  transition: 'all 0.25s ease',
                }}
                data-cursor="click"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span className="font-mono text-gold-pure" style={{ fontSize: '0.7rem' }}>0{idx + 1}</span>
                    {isSelected && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--gold)', animation: 'pulseGlow 2s infinite' }} />
                    )}
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.35rem', lineHeight: 1.25 }}>
                    {room.title}
                  </h3>
                  <p className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {room.subtitle}
                  </p>
                </div>

                {/* Card Stats: Clean Vertical Stack with Status Indicator */}
                <div
                  className="font-mono"
                  style={{
                    marginTop: '1rem',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid rgba(232, 224, 208, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>
                    {room.count}
                  </div>
                  <div className="text-gold-pure" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', fontWeight: 500 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--gold)' }} />
                    <span>{room.visitors}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3D Interactive Spatial Floor Plan Canvas */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(198, 165, 107, 0.25)',
            backgroundColor: '#0B0A08',
          }}
          data-cursor="rotate"
        >
          {/* Canvas HUD Header */}
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              right: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              zIndex: 20,
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div className="badge-gold" style={{ fontSize: '0.6rem', padding: '0.25rem 0.6rem' }}>
              INTERACTIVE 3D ISOMETRIC FLOOR PLAN
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.6rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'rgba(11, 10, 8, 0.85)',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                border: '1px solid rgba(232, 224, 208, 0.1)',
              }}
            >
              DRAG TO ROTATE • CLICK WING TO SELECT
            </div>
          </div>

          <Canvas camera={{ position: [0, 8, 10], fov: 42 }}>
            <ambientLight intensity={0.5} color="#E8E0D0" />
            <directionalLight position={[6, 12, 6]} intensity={1.5} color="#F5F1E8" castShadow />
            <pointLight position={[-6, 4, -4]} intensity={0.5} color="#C6A56B" />

            <Suspense fallback={<CanvasLoader />}>
              <ParticleField count={100} />
              <FloorPlanScene selectedRoom={selectedRoom} onSelectRoom={handleRoomClick} />
              <ContactShadows position={[0, -0.2, 0]} opacity={0.5} scale={14} blur={2} far={4} />
            </Suspense>

            <OrbitControls
              enablePan={true}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2.3}
              minPolarAngle={Math.PI / 6}
              rotateSpeed={0.7}
            />
          </Canvas>
        </div>

        {/* Selected Room Bar & Direct Navigation */}
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
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="museo-flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div className="font-mono text-gold-pure" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  SELECTED WING • {selectedRoom.visitors}
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  {selectedRoom.title}
                </h3>
              </div>

              <button
                onClick={() => handleEnterRoom(selectedRoom.id)}
                onMouseEnter={() => museumAudio.playHoverSound()}
                className="btn-primary-museo"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                data-cursor="click"
              >
                <span>ENTER WING</span>
                <ArrowUpRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.6, maxWidth: '900px' }}>
              {selectedRoom.description}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
