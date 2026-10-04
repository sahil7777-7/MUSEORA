import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import ParticleField from './ParticleField';
import CanvasLoader from './CanvasLoader';

export default function MuseumScene({ children, className = '', cameraPos = [0, 0, 5], particleCount = 200 }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} className={className}>
      <Canvas
        camera={{ position: cameraPos, fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} color="#E8E0D0" />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#F5F1E8" castShadow />
        <pointLight position={[-5, -2, -3]} intensity={0.6} color="#C6A56B" />
        <pointLight position={[0, 4, 2]} intensity={0.8} color="#E8E0D0" />

        <Suspense fallback={<CanvasLoader />}>
          <ParticleField count={particleCount} />
          {children}
          
          <Environment preset="studio" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          
          <EffectComposer>
            <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.8} />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
