import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { RefreshCw, Sun, Eye, Layers } from 'lucide-react';
import { museumAudio } from '../../utils/audio';
import CanvasLoader from './CanvasLoader';
import ImageWithFallback from '../ui/ImageWithFallback';
import ErrorBoundary from '../layout/ErrorBoundary';

// Helper hook for reduced motion and mobile detection
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

const NeuralShader = () => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 4]} />
      <shaderMaterial
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color('#C6A56B') },
          uColor2: { value: new THREE.Color('#8EA88C') },
        }}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float uTime;
          void main() {
            vNormal = normal;
            vPosition = position;
            vec3 pos = position;
            pos += normal * sin(pos.x * 4.0 + uTime * 2.0) * 0.08;
            pos += normal * cos(pos.y * 3.0 + uTime * 1.5) * 0.06;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            float pulse = sin(vPosition.x * 5.0 + uTime * 3.0) * 0.5 + 0.5;
            vec3 color = mix(uColor1, uColor2, pulse);
            float glow = fresnel * 1.5 + pulse * 0.3;
            gl_FragColor = vec4(color * glow, 0.85 + fresnel * 0.15);
          }
        `}
        transparent
        wireframe={false}
      />
    </mesh>
  );
};

function PaintingCanvasWithTexture({ imageUrl }) {
  // If texture fails to load (CORS or network error), Drei throws to Suspense/ErrorBoundary
  const texture = useTexture(imageUrl);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh position={[0, 0, 0.08]}>
      <planeGeometry args={[2.1, 2.9]} />
      <meshStandardMaterial map={texture} roughness={0.4} />
    </mesh>
  );
}

function PaintingFrameFallback() {
  return (
    <mesh position={[0, 0, 0.08]}>
      <planeGeometry args={[2.1, 2.9]} />
      <meshStandardMaterial color="#2A241C" roughness={0.8} />
    </mesh>
  );
}

function PaintingFrame({ artwork }) {
  const imageUrl = artwork?.image;

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Golden Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 3.2, 0.15]} />
        <meshStandardMaterial color="#C6A56B" metalness={0.8} roughness={0.15} />
      </mesh>

      {/* Inner painting canvas with texture load boundary */}
      {imageUrl ? (
        <ErrorBoundary fallback={<PaintingFrameFallback />}>
          <Suspense fallback={<PaintingFrameFallback />}>
            <PaintingCanvasWithTexture imageUrl={imageUrl} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <PaintingFrameFallback />
      )}
    </group>
  );
}

function ThinkerModel() {
  const groupRef = useRef();
  const torsoRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Dignified, slow, meditative rotation
      groupRef.current.rotation.y += delta * 0.12;
    }
    if (torsoRef.current) {
      // Subtle contemplative breathing motion
      const t = state.clock.elapsedTime;
      torsoRef.current.position.y = 0.28 + Math.sin(t * 1.1) * 0.012;
      torsoRef.current.rotation.x = 0.32 + Math.sin(t * 1.1) * 0.008;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Heavy Granite Plinth Base */}
      <mesh position={[0, -1.05, 0]}>
        <boxGeometry args={[1.6, 0.25, 1.6]} />
        <meshStandardMaterial color="#14120E" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.82, 0]}>
        <boxGeometry args={[1.3, 0.22, 1.3]} />
        <meshStandardMaterial color="#1A1713" roughness={0.65} metalness={0.15} />
      </mesh>

      {/* Rough Sculpted Bronze Rock Seat */}
      <mesh position={[0, -0.35, -0.1]}>
        <cylinderGeometry args={[0.55, 0.7, 0.7, 16]} />
        <meshStandardMaterial color="#262018" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Seated Thighs and Legs */}
      <group position={[0, 0, 0.08]}>
        {/* Right Thigh */}
        <mesh position={[0.22, 0, 0.16]} rotation={[0.45, 0.1, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.65, 16]} />
          <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
        </mesh>
        {/* Left Thigh (the knee where elbow rests) */}
        <mesh position={[-0.22, 0, 0.16]} rotation={[0.4, -0.1, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.65, 16]} />
          <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
        </mesh>
        {/* Right Calf */}
        <mesh position={[0.26, -0.42, 0.35]} rotation={[-0.1, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.12, 0.6, 16]} />
          <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
        </mesh>
        {/* Left Calf */}
        <mesh position={[-0.26, -0.42, 0.35]} rotation={[-0.1, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.12, 0.6, 16]} />
          <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
        </mesh>
      </group>

      {/* Leaning Torso & Head */}
      <group ref={torsoRef} position={[0, 0.28, -0.05]}>
        {/* Waist */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.32, 16]} />
          <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
        </mesh>
        {/* Muscular Hunched Back */}
        <mesh position={[0, 0.26, 0.08]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.55, 0.44, 0.32]} />
          <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
        </mesh>
        {/* Broad Shoulders */}
        <mesh position={[0, 0.46, 0.14]}>
          <cylinderGeometry args={[0.16, 0.16, 0.72, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
        </mesh>

        {/* Head bowed forward in deep thought */}
        <group position={[0.02, 0.64, 0.34]} rotation={[0.4, 0.05, -0.05]}>
          <mesh>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
          </mesh>
          <mesh position={[0, -0.08, 0.12]}>
            <boxGeometry args={[0.14, 0.15, 0.12]} />
            <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
          </mesh>
        </group>

        {/* Iconic Right Arm: Elbow anchored on knee, hand supporting chin */}
        <group position={[0.28, 0.4, 0.14]}>
          <mesh position={[-0.14, -0.26, 0.18]} rotation={[0.7, -0.4, -0.6]}>
            <cylinderGeometry args={[0.09, 0.1, 0.48, 16]} />
            <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
          </mesh>
          <mesh position={[-0.22, -0.02, 0.34]} rotation={[-0.8, -0.2, 0.5]}>
            <cylinderGeometry args={[0.08, 0.09, 0.44, 16]} />
            <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
          </mesh>
          <mesh position={[-0.24, 0.14, 0.36]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
          </mesh>
        </group>

        {/* Left Arm: Resting casually across left thigh */}
        <group position={[-0.28, 0.4, 0.14]}>
          <mesh position={[0.04, -0.22, 0.16]} rotation={[0.5, 0.2, 0.3]}>
            <cylinderGeometry args={[0.09, 0.1, 0.46, 16]} />
            <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
          </mesh>
          <mesh position={[0.05, -0.42, 0.3]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
            <meshStandardMaterial color="#2C231A" roughness={0.32} metalness={0.78} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function NatarajaModel() {
  const groupRef = useRef();
  const ringRef = useRef();
  const lightRef = useRef();

  useFrame((state, delta) => {
    if (ringRef.current) {
      // Cosmic rotation of the Prabhamandala (flaming ring of fire)
      ringRef.current.rotation.z += delta * 0.35;
    }
    if (groupRef.current) {
      // Sacred dynamic cosmic dance floating and gentle rotation
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.position.y = -0.15 + Math.sin(state.clock.elapsedTime * 2.0) * 0.04;
    }
    if (lightRef.current) {
      // Pulsing cosmic firelight
      lightRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 3.5) * 0.4;
    }
  });

  const goldBronzeMaterial = (
    <meshStandardMaterial
      color="#C6A56B"
      metalness={0.88}
      roughness={0.18}
      emissive="#3D2808"
      emissiveIntensity={0.25}
    />
  );

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* Pulsing cosmic firelight center */}
      <pointLight ref={lightRef} position={[0, 0.3, 0.5]} color="#FFBE5C" distance={4} />

      {/* Lotus Pedestal (Padmapitha) */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.75, 0.9, 0.22, 32]} />
        {goldBronzeMaterial}
      </mesh>
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[0.62, 0.72, 0.16, 32]} />
        {goldBronzeMaterial}
      </mesh>

      {/* Apasmara (Dwarf of Ignorance) beneath right foot */}
      <mesh position={[0, -0.78, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.12, 0.55, 16]} />
        <meshStandardMaterial color="#8C6F3D" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Prabhamandala (Ring of Cosmic Fire) with flames */}
      <group position={[0, 0.35, 0]}>
        <mesh ref={ringRef}>
          <torusGeometry args={[1.35, 0.04, 16, 64]} />
          {goldBronzeMaterial}
          {/* Radiating Agni flames along the outer circle */}
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const x = Math.cos(angle) * 1.35;
            const y = Math.sin(angle) * 1.35;
            return (
              <mesh
                key={i}
                position={[x, y, 0]}
                rotation={[0, 0, angle - Math.PI / 2]}
              >
                <coneGeometry args={[0.065, 0.18, 8]} />
                <meshStandardMaterial
                  color="#E5C178"
                  metalness={0.9}
                  roughness={0.15}
                  emissive="#D4AF37"
                  emissiveIntensity={0.4}
                />
              </mesh>
            );
          })}
        </mesh>
      </group>

      {/* Dancing Deity Silhouette (Lord Shiva) */}
      <group position={[0, 0, 0]}>
        {/* Right Standing Leg (Bent, stomping on Apasmara) */}
        <mesh position={[0.06, -0.48, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.09, 0.1, 0.55, 16]} />
          {goldBronzeMaterial}
        </mesh>

        {/* Left Lifted Dancing Leg (Ananda Tandava crossed pose) */}
        <mesh position={[-0.15, -0.32, 0.22]} rotation={[0.3, 0.4, -1.25]}>
          <cylinderGeometry args={[0.08, 0.09, 0.65, 16]} />
          {goldBronzeMaterial}
        </mesh>

        {/* Dancing Torso */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 0.55, 16]} />
          {goldBronzeMaterial}
        </mesh>

        {/* Crown of Matted Locks (Jatamukuta) & Head */}
        <group position={[0, 0.55, 0]}>
          <mesh>
            <sphereGeometry args={[0.16, 24, 24]} />
            {goldBronzeMaterial}
          </mesh>
          {/* Conical Divine Crown */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.06, 0.14, 0.32, 16]} />
            {goldBronzeMaterial}
          </mesh>
          {/* Matted Hair Locks (Jatas) flaring laterally */}
          <mesh position={[0.32, 0.05, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.35, 0.04, 0.02]} />
            {goldBronzeMaterial}
          </mesh>
          <mesh position={[-0.32, 0.05, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.35, 0.04, 0.02]} />
            {goldBronzeMaterial}
          </mesh>
        </group>

        {/* Four Radiating Divine Arms */}
        {/* Upper Right: Holding the Damaru (Hourglass drum of creation) */}
        <group position={[0.18, 0.32, 0]}>
          <mesh position={[0.35, 0.22, 0]} rotation={[0, 0, -0.55]}>
            <cylinderGeometry args={[0.06, 0.07, 0.55, 16]} />
            {goldBronzeMaterial}
          </mesh>
          {/* Damaru Drum */}
          <group position={[0.55, 0.42, 0]}>
            <mesh position={[0, 0.04, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.07, 0.08, 12]} />
              {goldBronzeMaterial}
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <coneGeometry args={[0.07, 0.08, 12]} />
              {goldBronzeMaterial}
            </mesh>
          </group>
        </group>

        {/* Upper Left: Holding Agni (Flame of Dissolution) */}
        <group position={[-0.18, 0.32, 0]}>
          <mesh position={[-0.35, 0.22, 0]} rotation={[0, 0, 0.55]}>
            <cylinderGeometry args={[0.06, 0.07, 0.55, 16]} />
            {goldBronzeMaterial}
          </mesh>
          {/* Flame */}
          <mesh position={[-0.55, 0.42, 0]}>
            <dodecahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial
              color="#FFBE5C"
              emissive="#FF9900"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>

        {/* Lower Right: Abhaya Mudra (Gesture of Protection) */}
        <group position={[0.15, 0.2, 0]}>
          <mesh position={[0.22, -0.05, 0.16]} rotation={[0.4, 0.3, -0.2]}>
            <cylinderGeometry args={[0.06, 0.07, 0.42, 16]} />
            {goldBronzeMaterial}
          </mesh>
          <mesh position={[0.28, 0.1, 0.25]}>
            <boxGeometry args={[0.08, 0.12, 0.03]} />
            {goldBronzeMaterial}
          </mesh>
        </group>

        {/* Lower Left: Gajahasta (Trunk gesture pointing to lifted foot) */}
        <group position={[-0.15, 0.2, 0]}>
          <mesh position={[0.08, -0.15, 0.25]} rotation={[-0.3, -0.4, 0.85]}>
            <cylinderGeometry args={[0.06, 0.07, 0.55, 16]} />
            {goldBronzeMaterial}
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Mesh3D({ type, artwork }) {
  const meshRef = useRef();

  if (type === 'painting-frame') {
    return <PaintingFrame artwork={artwork} />;
  }

  if (type === 'sculpture-marble') {
    return (
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 2.2, 32]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.2} metalness={0.05} />
      </mesh>
    );
  }

  if (type === 'digital-cube') {
    return <NeuralShader />;
  }

  if (type === 'sculpture-thinker' || artwork?.id === 'the-thinker') {
    return <ThinkerModel artwork={artwork} />;
  }

  if (type === 'sculpture-nataraja' || artwork?.id === 'chola-nataraja') {
    return <NatarajaModel artwork={artwork} />;
  }

  // Default bronze sculpture
  return (
    <group ref={meshRef}>
      <mesh position={[0, 0.2, 0]}>
        <torusKnotGeometry args={[0.75, 0.28, 128, 32]} />
        <meshStandardMaterial color="#3A2F22" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.1, 0]}>
        <boxGeometry args={[1.2, 0.4, 1.2]} />
        <meshStandardMaterial color="#15130F" roughness={0.5} />
      </mesh>
    </group>
  );
}

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function ArtworkViewer3D({ artwork }) {
  const controlsRef = useRef();
  const [lightIntensity, setLightIntensity] = useState(1.2);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d'
  const [hasWebGL, setHasWebGL] = useState(true);
  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();

  // If mobile or reduced motion, skip expensive post-processing
  const enablePostProcessing = !isMobile && !prefersReducedMotion;

  useEffect(() => {
    const supported = checkWebGLSupport();
    setHasWebGL(supported);
    if (!supported) {
      setViewMode('2d');
    }
  }, []);

  const handleReset = () => {
    museumAudio.playClickSound();
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const toggleLighting = () => {
    museumAudio.playClickSound();
    setLightIntensity((prev) => (prev > 1.5 ? 0.6 : prev + 0.6));
  };

  const toggleViewMode = () => {
    museumAudio.playClickSound();
    setViewMode((prev) => (prev === '3d' ? '2d' : '3d'));
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '480px',
        height: '520px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(232, 224, 208, 0.15)',
        backgroundColor: '#0B0A08',
      }}
      className="glass-panel viewer-3d-container"
      data-cursor={viewMode === '3d' ? 'rotate' : 'default'}
    >
      {/* 2D Fallback View */}
      {viewMode === '2d' || !hasWebGL ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ImageWithFallback
            src={artwork?.highResImage || artwork?.image}
            alt={artwork?.title}
            fallbackTitle={artwork?.title}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        /* 3D Canvas View protected with ErrorBoundary */
        <ErrorBoundary
          fallback={
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <ImageWithFallback
                src={artwork?.highResImage || artwork?.image}
                alt={artwork?.title}
                fallbackTitle={artwork?.title}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={0.3} color="#E8E0D0" />
            <directionalLight position={[4, 6, 4]} intensity={lightIntensity} color="#F5F1E8" castShadow />
            <pointLight position={[-4, -2, -2]} intensity={0.5} color="#C6A56B" />

            <Suspense fallback={<CanvasLoader />}>
              <Mesh3D type={artwork?.threeDType || 'sculpture-bronze'} artwork={artwork} />

              <Environment preset="studio" />
              <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />

              {enablePostProcessing && (
                <EffectComposer>
                  <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.8} />
                  <Vignette eskil={false} offset={0.1} darkness={0.7} />
                  <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
                </EffectComposer>
              )}
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              minDistance={2}
              maxDistance={8}
              rotateSpeed={0.8}
            />
          </Canvas>
        </ErrorBoundary>
      )}

      {/* Floating HUD Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '0.75rem',
          right: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          gap: '0.5rem',
          flexWrap: 'wrap',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
          {/* 2D / 3D Toggle */}
          {hasWebGL && (
            <button
              onClick={toggleViewMode}
              onMouseEnter={() => museumAudio.playHoverSound()}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(11, 10, 8, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(198, 165, 107, 0.4)',
                color: 'var(--gold)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
              }}
              title={viewMode === '3d' ? 'Switch to 2D High-Res View' : 'Switch to 3D Spatial Viewer'}
              aria-label={viewMode === '3d' ? 'Switch to 2D view' : 'Switch to 3D view'}
              data-cursor="click"
            >
              {viewMode === '3d' ? (
                <>
                  <Eye style={{ width: '13px', height: '13px' }} />
                  <span>2D IMAGE</span>
                </>
              ) : (
                <>
                  <Layers style={{ width: '13px', height: '13px' }} />
                  <span>3D VIEW</span>
                </>
              )}
            </button>
          )}

          {viewMode === '3d' && (
            <>
              <button
                onClick={handleReset}
                onMouseEnter={() => museumAudio.playHoverSound()}
                style={{
                  padding: '0.55rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(11, 10, 8, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(232, 224, 208, 0.2)',
                  color: 'var(--cream)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Reset 3D Camera"
                aria-label="Reset 3D Camera"
                data-cursor="click"
              >
                <RefreshCw style={{ width: '14px', height: '14px' }} />
              </button>
              <button
                onClick={toggleLighting}
                onMouseEnter={() => museumAudio.playHoverSound()}
                style={{
                  padding: '0.55rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(11, 10, 8, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(232, 224, 208, 0.2)',
                  color: 'var(--cream)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Adjust Museum Lighting"
                aria-label="Adjust Museum Lighting"
                data-cursor="click"
              >
                <Sun style={{ width: '14px', height: '14px' }} />
              </button>
            </>
          )}
        </div>

        <div
          className="font-mono text-gold-pure badge-gold"
          style={{
            backgroundColor: 'rgba(11, 10, 8, 0.85)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.6rem',
            padding: '0.35rem 0.65rem',
          }}
        >
          {viewMode === '3d' ? 'ROTATE • ZOOM • PAN 3D MODEL' : 'HIGH-RES 2D ACCESSION VIEW'}
        </div>
      </div>
    </div>
  );
}
