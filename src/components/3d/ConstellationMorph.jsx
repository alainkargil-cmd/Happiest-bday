import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export const ConstellationMorph = ({ mode = 'heart', memories = [] }) => {
  const pointsRef = useRef();
  const particleCount = 160;

  // 1. Calculate Heart 3D target coordinates
  const heartPoints = useMemo(() => {
    const coords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 2;
      // Parametric heart formula
      const x = 16 * Math.pow(Math.sin(t), 3) * 0.35;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.35 + 4.5;
      const z = -6 + (i % 2 === 0 ? 0.4 : -0.4);

      coords[i * 3] = x;
      coords[i * 3 + 1] = y;
      coords[i * 3 + 2] = z;
    }
    return coords;
  }, [particleCount]);

  // 2. Calculate "VYOMINI" 3D target coordinates
  const namePoints = useMemo(() => {
    const coords = new Float32Array(particleCount * 3);
    const letterDefs = [
      // V
      { xOffset: -12, pts: [[-1, 3], [-0.5, 1], [0, -1], [0.5, 1], [1, 3]] },
      // Y
      { xOffset: -8, pts: [[-1, 3], [-0.5, 1.5], [0, 0], [0.5, 1.5], [1, 3], [0, -1.5]] },
      // O
      { xOffset: -4, pts: [[-1, 1], [-1, 2], [-0.7, 3], [0, 3.2], [0.7, 3], [1, 2], [1, 1], [0.7, -0.5], [0, -0.8], [-0.7, -0.5]] },
      // M
      { xOffset: 0, pts: [[-1.2, -1], [-1.2, 3], [-0.6, 1.2], [0, 0.5], [0.6, 1.2], [1.2, 3], [1.2, -1]] },
      // I
      { xOffset: 4, pts: [[0, 3], [0, 2], [0, 1], [0, 0], [0, -1], [-0.6, 3], [0.6, 3], [-0.6, -1], [0.6, -1]] },
      // N
      { xOffset: 8, pts: [[-1, -1], [-1, 1], [-1, 3], [-0.5, 1.5], [0, 0.5], [0.5, -0.5], [1, -1], [1, 1], [1, 3]] },
      // I
      { xOffset: 12, pts: [[0, 3], [0, 2], [0, 1], [0, 0], [0, -1], [-0.6, 3], [0.6, 3], [-0.6, -1], [0.6, -1]] }
    ];

    let currentDefIdx = 0;
    for (let i = 0; i < particleCount; i++) {
      const def = letterDefs[currentDefIdx % letterDefs.length];
      const pt = def.pts[i % def.pts.length];

      coords[i * 3] = (def.xOffset + pt[0] * 1.5) * 0.65;
      coords[i * 3 + 1] = (pt[1] * 1.3) * 0.65 + 4.5;
      coords[i * 3 + 2] = -6;

      if (i % 22 === 0) currentDefIdx++;
    }
    return coords;
  }, [particleCount]);

  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const morphProgress = useRef({ val: 0 });

  useEffect(() => {
    if (mode === 'name') {
      gsap.to(morphProgress.current, {
        val: 1,
        duration: 2.5,
        ease: "power2.inOut"
      });
    } else {
      gsap.to(morphProgress.current, {
        val: 0,
        duration: 2.5,
        ease: "power2.inOut"
      });
    }
  }, [mode]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const p = morphProgress.current.val;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const targetX = heartPoints[idx] * (1 - p) + namePoints[idx] * p;
      const targetY = heartPoints[idx + 1] * (1 - p) + namePoints[idx + 1] * p;
      const targetZ = heartPoints[idx + 2] * (1 - p) + namePoints[idx + 2] * p;

      currentPositions[idx] = targetX;
      currentPositions[idx + 1] = targetY + Math.sin(t * 1.5 + i * 0.1) * 0.08;
      currentPositions[idx + 2] = targetZ;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={currentPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        color={mode === 'name' ? "#fef08a" : "#f472b6"}
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
