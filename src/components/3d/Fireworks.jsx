import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioManager } from '../../utils/audioManager';

export const Fireworks = ({ active = true }) => {
  const pointsRef = useRef();
  const particleCount = 180;

  // Preallocated buffer arrays
  const [positions, velocities, colorsArray, burstData] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const palette = [
      new THREE.Color('#f43f5e'),
      new THREE.Color('#fbbf24'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#f472b6'),
      new THREE.Color('#34d399')
    ];

    for (let i = 0; i < particleCount; i++) {
      // Offscreen until triggered
      pos[i * 3] = 0;
      pos[i * 3 + 1] = -100;
      pos[i * 3 + 2] = 0;

      const c = palette[i % palette.length];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    return [pos, vel, cols, { lastBurst: 0, currentIdx: 0 }];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!active || !pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArr = posAttr.array;

    // Trigger new burst every 2.2 seconds
    if (time - burstData.lastBurst > 2.2) {
      burstData.lastBurst = time;
      audioManager.playFirework();

      // Launch a cluster of 60 particles
      const originX = (Math.random() - 0.5) * 18;
      const originY = Math.random() * 6 + 6;
      const originZ = -10 + (Math.random() - 0.5) * 6;

      const start = (burstData.currentIdx * 60) % particleCount;
      burstData.currentIdx = (burstData.currentIdx + 1) % 3;

      for (let i = start; i < start + 60; i++) {
        posArr[i * 3] = originX;
        posArr[i * 3 + 1] = originY;
        posArr[i * 3 + 2] = originZ;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const speed = Math.random() * 3 + 1.5;

        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        velocities[i * 3 + 2] = Math.cos(phi) * speed;
      }
    }

    // Update active particles with gravity
    for (let i = 0; i < particleCount; i++) {
      if (posArr[i * 3 + 1] > -50) {
        posArr[i * 3] += velocities[i * 3] * delta;
        posArr[i * 3 + 1] += velocities[i * 3 + 1] * delta - 1.2 * delta; // Gravity
        posArr[i * 3 + 2] += velocities[i * 3 + 2] * delta;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colorsArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
