import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function HeroArtifact({ mousePos = { x: 0, y: 0 } }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const crystal1Ref = useRef();
  const crystal2Ref = useRef();
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.15;
      ringRef.current.rotation.z += delta * 0.2;
    }
    if (crystal1Ref.current) {
      crystal1Ref.current.rotation.y += delta * 0.8;
      crystal1Ref.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.25;
    }
    if (crystal2Ref.current) {
      crystal2Ref.current.rotation.x += delta * 0.7;
      crystal2Ref.current.position.y = -0.2 + Math.cos(state.clock.elapsedTime * 1.2) * 0.2;
    }
    if (groupRef.current) {
      // Smooth 3D mouse parallax tracking
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.x * 0.45,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mousePos.y * 0.35,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Floating 3D Sculpture Mesh Composition */}
      <Float speed={2} rotationIntensity={0.25} floatIntensity={0.5}>
        {/* Main Central Abstract Sculptural Torso */}
        <mesh ref={meshRef} position={[0, 0.4, 0]}>
          <torusKnotGeometry args={[0.85, 0.32, 128, 32, 2, 3]} />
          <meshStandardMaterial
            color="#2A241C"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1.8}
          />
        </mesh>

        {/* Orbiting Gold Museum Ring Accent */}
        <mesh ref={ringRef} position={[0, 0.4, 0]}>
          <torusGeometry args={[1.55, 0.018, 16, 100]} />
          <meshStandardMaterial
            color="#C6A56B"
            metalness={0.9}
            roughness={0.1}
            emissive="#C6A56B"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Orbiting 3D Floating Crystals */}
        <mesh ref={crystal1Ref} position={[1.8, 0.8, 0.5]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#C6A56B" metalness={0.9} roughness={0.1} emissive="#C6A56B" emissiveIntensity={0.3} />
        </mesh>

        <mesh ref={crystal2Ref} position={[-1.8, -0.2, -0.5]}>
          <icosahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial color="#E8E0D0" metalness={0.7} roughness={0.2} />
        </mesh>
      </Float>

      {/* Marble Pedestal Base */}
      <mesh position={[0, -1.3, 0]}>
        <boxGeometry args={[1.4, 0.6, 1.4]} />
        <meshStandardMaterial color="#1D1A15" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, -1.6, 0]}>
        <boxGeometry args={[1.8, 0.2, 1.8]} />
        <meshStandardMaterial color="#0B0A08" roughness={0.6} />
      </mesh>
    </group>
  );
}
