import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Island({ position, scale = 1, rotationSpeed = 0.05, floatOffset = 0, floatSpeed = 1, color = "#2e1065", grassColor = "#701a75" }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime() * floatSpeed + floatOffset;
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.25;
      meshRef.current.rotation.y += 0.001 * rotationSpeed;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Upper island platform */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 2.5, 0.8, 12]} />
        <meshStandardMaterial
          color={grassColor}
          roughness={0.8}
          metalness={0.1}
          emissive="#4a044e"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Island lower cone base */}
      <mesh position={[0, -2.2, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[2.5, 4, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Floating glowing crystals on island */}
      <mesh position={[1.2, 0.8, 0.8]} rotation={[0.2, 0.4, 0.1]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#ec4899"
          emissiveIntensity={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-1.4, 0.7, -0.6]} rotation={[-0.3, 0.2, 0.5]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

export const FloatingIslands = () => {
  return (
    <group>
      {/* Central celebration island base */}
      <Island position={[0, -2.5, 0]} scale={2.2} floatSpeed={0.6} floatOffset={0} grassColor="#581c87" color="#1e1b4b" />

      {/* Background floating islands */}
      <Island position={[-12, 2, -15]} scale={1.4} floatSpeed={0.8} floatOffset={1.2} grassColor="#831843" color="#18181b" />
      <Island position={[14, 4, -18]} scale={1.6} floatSpeed={0.7} floatOffset={2.5} grassColor="#4c1d95" color="#1e1b4b" />
    </group>
  );
};
