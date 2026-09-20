import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const FantasyCastle = ({ position = [0, 6, -35], scale = 1.8 }) => {
  const castleGroup = useRef();

  useFrame((state) => {
    if (castleGroup.current) {
      const t = state.clock.getElapsedTime();
      castleGroup.current.position.y = position[1] + Math.sin(t * 0.4) * 0.4;
    }
  });

  return (
    <group ref={castleGroup} position={position} scale={scale}>
      {/* Cloud Base */}
      <mesh position={[0, -2, 0]}>
        <sphereGeometry args={[7, 10, 10]} />
        <meshStandardMaterial
          color="#312e81"
          emissive="#4338ca"
          emissiveIntensity={0.3}
          roughness={0.9}
        />
      </mesh>
      <mesh position={[-3, -1.8, 2]}>
        <sphereGeometry args={[5, 8, 8]} />
        <meshStandardMaterial color="#3730a3" emissive="#4f46e5" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[4, -1.8, -1]}>
        <sphereGeometry args={[5.5, 8, 8]} />
        <meshStandardMaterial color="#3730a3" emissive="#4f46e5" emissiveIntensity={0.2} />
      </mesh>

      {/* Main Central Keep */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[2, 2.5, 6, 8]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Central Spire Roof */}
      <mesh position={[0, 8, 0]}>
        <coneGeometry args={[2.4, 5, 8]} />
        <meshStandardMaterial color="#831843" emissive="#be185d" emissiveIntensity={0.4} />
      </mesh>
      {/* Spire Crystal Topper */}
      <mesh position={[0, 11, 0]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.8} />
      </mesh>

      {/* Left Tower */}
      <mesh position={[-3.5, 1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 5, 6]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <mesh position={[-3.5, 5, 0]}>
        <coneGeometry args={[1.5, 3.5, 6]} />
        <meshStandardMaterial color="#831843" emissive="#be185d" emissiveIntensity={0.4} />
      </mesh>

      {/* Right Tower */}
      <mesh position={[3.5, 1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 5, 6]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <mesh position={[3.5, 5, 0]}>
        <coneGeometry args={[1.5, 3.5, 6]} />
        <meshStandardMaterial color="#831843" emissive="#be185d" emissiveIntensity={0.4} />
      </mesh>

      {/* Glowing arched windows */}
      <mesh position={[0, 4, 2.05]}>
        <circleGeometry args={[0.5, 8]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
    </group>
  );
};
