import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import { museumAudio } from '../../utils/audio';
import CanvasLoader from './CanvasLoader';

const ARTWORKS_IN_ROOM = [
  { id: 'the-thinker', title: 'THE THINKER', pos: [0, 0, -2], type: 'thinker' },
  { id: 'chola-nataraja', title: 'NATARAJA BRONZE', pos: [-3.5, 0.5, -1], type: 'nataraja' },
  { id: 'mona-lisa', title: 'MONA LISA', pos: [3.5, 0.8, -1], type: 'frame' },
  { id: 'venus-de-milo', title: 'VENUS DE MILO', pos: [-2, 0, 2], type: 'marble' },
  { id: 'digital-consciousness', title: 'NEURAL CONSCIOUSNESS', pos: [2, 0, 2], type: 'digital' }
];

function GalleryRoomMesh({ onSelectArtwork }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const artworksInRoom = ARTWORKS_IN_ROOM;

  return (
    <group>
      {/* Museum Floor */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#12100D" roughness={0.1} metalness={0.2} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0B0A08" roughness={0.9} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1.25, -5]}>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#171410" roughness={0.8} />
      </mesh>
      <mesh position={[-6, 1.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#15130F" roughness={0.8} />
      </mesh>
      <mesh position={[6, 1.25, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#15130F" roughness={0.8} />
      </mesh>

      {/* Artworks */}
      {artworksInRoom.map((art) => {
        const isHovered = hoveredNode === art.id;
        return (
          <group
            key={art.id}
            position={art.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredNode(art.id);
              museumAudio.playHoverSound();
              const direction = art.pos[0] < -1 ? 'left' : art.pos[0] > 1 ? 'right' : 'center';
              museumAudio.playSpatialSound(direction);
            }}
            onPointerOut={() => setHoveredNode(null)}
            onClick={(e) => {
              e.stopPropagation();
              museumAudio.playClickSound();
              onSelectArtwork?.(art.id);
            }}
          >
            <spotLight
              position={[0, 3, 1]}
              intensity={isHovered ? 2.5 : 1.2}
              color={isHovered ? '#C6A56B' : '#F5F1E8'}
              angle={0.4}
              penumbra={0.5}
            />

            {art.type === 'frame' ? (
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.6, 2.2, 0.1]} />
                <meshStandardMaterial color={isHovered ? '#C6A56B' : '#806643'} metalness={0.7} />
              </mesh>
            ) : art.type === 'thinker' ? (
              <group>
                <mesh position={[0, -0.5, 0]}>
                  <cylinderGeometry args={[0.6, 0.7, 1.2, 32]} />
                  <meshStandardMaterial color="#1D1A15" roughness={0.3} />
                </mesh>
                {/* Miniature The Thinker Seated Pose */}
                <group position={[0, 0.45, 0]}>
                  <mesh position={[0, -0.2, 0]}>
                    <boxGeometry args={[0.5, 0.3, 0.5]} />
                    <meshStandardMaterial color="#221C16" roughness={0.4} metalness={0.7} />
                  </mesh>
                  <mesh position={[0, 0.1, 0]} rotation={[0.3, 0, 0]}>
                    <boxGeometry args={[0.35, 0.4, 0.28]} />
                    <meshStandardMaterial color={isHovered ? '#C6A56B' : '#2C231A'} metalness={0.8} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, 0.42, 0.12]}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshStandardMaterial color={isHovered ? '#C6A56B' : '#2C231A'} metalness={0.8} roughness={0.3} />
                  </mesh>
                </group>
              </group>
            ) : art.type === 'nataraja' ? (
              <group>
                <mesh position={[0, -0.5, 0]}>
                  <cylinderGeometry args={[0.6, 0.7, 1.2, 32]} />
                  <meshStandardMaterial color="#1D1A15" roughness={0.3} />
                </mesh>
                {/* Miniature Nataraja Golden Ring of Fire & Dance Pose */}
                <group position={[0, 0.45, 0]}>
                  <mesh position={[0, 0.15, 0]}>
                    <torusGeometry args={[0.42, 0.03, 16, 32]} />
                    <meshStandardMaterial
                      color={isHovered ? '#FFE082' : '#C6A56B'}
                      metalness={0.9}
                      roughness={0.2}
                      emissive="#C6A56B"
                      emissiveIntensity={isHovered ? 0.4 : 0.15}
                    />
                  </mesh>
                  <mesh position={[0, 0.12, 0]}>
                    <cylinderGeometry args={[0.08, 0.06, 0.45, 12]} />
                    <meshStandardMaterial color={isHovered ? '#FFE082' : '#C6A56B'} metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh position={[0, 0.4, 0]}>
                    <sphereGeometry args={[0.08, 12, 12]} />
                    <meshStandardMaterial color={isHovered ? '#FFE082' : '#C6A56B'} metalness={0.9} roughness={0.2} />
                  </mesh>
                </group>
              </group>
            ) : art.type === 'marble' ? (
              <group>
                <mesh position={[0, -0.5, 0]}>
                  <cylinderGeometry args={[0.6, 0.7, 1.2, 32]} />
                  <meshStandardMaterial color="#1D1A15" roughness={0.3} />
                </mesh>
                {/* Marble classical sculpture */}
                <mesh position={[0, 0.5, 0]}>
                  <cylinderGeometry args={[0.25, 0.35, 0.8, 24]} />
                  <meshStandardMaterial color={isHovered ? '#FFF' : '#E8E0D0'} roughness={0.2} metalness={0.05} />
                </mesh>
              </group>
            ) : (
              <group>
                <mesh position={[0, -0.5, 0]}>
                  <cylinderGeometry args={[0.6, 0.7, 1.2, 32]} />
                  <meshStandardMaterial color="#1D1A15" roughness={0.3} />
                </mesh>
                {/* Digital consciousness hologram */}
                <mesh position={[0, 0.5, 0]}>
                  <octahedronGeometry args={[0.35, 0]} />
                  <meshStandardMaterial
                    color={isHovered ? '#C6A56B' : '#8EA88C'}
                    wireframe={true}
                    emissive={isHovered ? '#C6A56B' : '#8EA88C'}
                    emissiveIntensity={0.5}
                  />
                </mesh>
              </group>
            )}

            {isHovered && (
              <Html position={[0, 1.5, 0]} center distanceFactor={8}>
                <div
                  style={{
                    backgroundColor: 'rgba(11, 10, 8, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--gold)',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    boxShadow: '0 0 25px rgba(198, 165, 107, 0.3)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                >
                  <div className="font-serif" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', letterSpacing: '0.15em' }}>
                    {art.title}
                  </div>
                  <div className="font-mono text-gold-pure" style={{ fontSize: '0.55rem', letterSpacing: '0.15em', marginTop: '2px' }}>
                    CLICK TO INSPECT
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Hook for device detection
function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    prefersReducedMotion: false
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const update = () => {
      setCapabilities({
        isMobile: mobileQuery.matches,
        prefersReducedMotion: motionQuery.matches
      });
    };
    
    update();
    mobileQuery.addEventListener('change', update);
    motionQuery.addEventListener('change', update);
    
    return () => {
      mobileQuery.removeEventListener('change', update);
      motionQuery.removeEventListener('change', update);
    };
  }, []);

  return capabilities;
}

export default function ExhibitionRoom({ onSelectArtwork }) {
  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();
  const enablePostProcessing = !isMobile && !prefersReducedMotion;
  
  const artworksInRoom = ARTWORKS_IN_ROOM;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(232, 224, 208, 0.15)',
      }}
      className="glass-panel viewer-3d-container"
      data-cursor="view"
    >
      {/* Screen reader only accessible fallback list for artwork selection */}
      <div className="sr-only" aria-label="Artworks in Exhibition Room">
        <ul>
          {artworksInRoom.map((art) => (
            <li key={art.id}>
              <button onClick={() => onSelectArtwork && onSelectArtwork(art.id)}>
                Inspect {art.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Canvas camera={{ position: [0, 0.5, 5], fov: 60 }}>
        <ambientLight intensity={0.25} color="#E8E0D0" />
        <Suspense fallback={<CanvasLoader />}>
          {!prefersReducedMotion && <ParticleField count={150} />}
          <GalleryRoomMesh onSelectArtwork={onSelectArtwork} />
          <Environment preset="studio" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          
          {enablePostProcessing && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.8} />
              <Vignette eskil={false} offset={0.1} darkness={0.7} />
            </EffectComposer>
          )}
        </Suspense>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={2}
          maxDistance={9}
        />
      </Canvas>

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
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div className="badge-gold" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}>
          3D VIRTUAL GALLERY ROOM
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: '0.6rem',
            color: 'var(--text-secondary)',
            backgroundColor: 'rgba(11, 10, 8, 0.85)',
            padding: '0.3rem 0.6rem',
            borderRadius: '9999px',
            border: '1px solid rgba(232, 224, 208, 0.1)',
          }}
        >
          DRAG TO MOVE • TAP OBJECTS TO INSPECT
        </div>
      </div>
    </div>
  );
}
