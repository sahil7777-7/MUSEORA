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
