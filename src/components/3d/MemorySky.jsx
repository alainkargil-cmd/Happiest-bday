import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const textureCache = new Map();

function SkyMemoryItem({ memory, position, index }) {
  const meshRef = useRef();
  const [texture, setTexture] = useState(() => textureCache.get(memory?.image) || null);

  useEffect(() => {
    if (!memory?.image || textureCache.has(memory.image)) return;
    const loader = new THREE.TextureLoader();
    loader.load(memory.image, (tex) => {
      textureCache.set(memory.image, tex);
      setTexture(tex);
    });
  }, [memory]);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime() + index * 1.5;
      meshRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.2;
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.12;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={0.45}>
      {/* Golden Star Frame */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[2.5, 3.3, 0.05]} />
        <meshStandardMaterial color="#fde047" emissive="#eab308" emissiveIntensity={0.6} />
      </mesh>

      {/* Photo plane */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[2.3, 3.1]} />
        {texture ? (
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        ) : (
          <meshBasicMaterial color="#ec4899" />
        )}
      </mesh>
    </group>
  );
}

export const MemorySky = ({ collectedMemories = [] }) => {
  const skyPositions = useMemo(() => {
    return collectedMemories.map((_, idx) => {
      const count = Math.max(collectedMemories.length, 1);
      const angle = ((idx / (count + 1)) - 0.5) * Math.PI * 0.8;
      const radius = 18;
      const x = Math.sin(angle) * radius;
      const y = 10 + Math.cos(angle) * 4;
      const z = -12 + Math.abs(x) * 0.2;
      return [x, y, z];
    });
  }, [collectedMemories]);

  if (collectedMemories.length === 0) return null;

  return (
    <group>
      {collectedMemories.map((memory, idx) => (
        <SkyMemoryItem
          key={memory.id}
          memory={memory}
          position={skyPositions[idx] || [0, 12, -10]}
          index={idx}
        />
      ))}
    </group>
  );
};
