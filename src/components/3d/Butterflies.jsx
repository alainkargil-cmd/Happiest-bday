import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SingleButterfly({ color = "#f472b6", initialPos = [0, 0, 0], orbitRadius = 6, speed = 1, phase = 0 }) {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + phase;
    if (groupRef.current) {
      const x = initialPos[0] + Math.sin(t * 0.7) * orbitRadius;
      const y = initialPos[1] + Math.sin(t * 1.5) * 1.5 + Math.cos(t * 0.5) * 0.8;
      const z = initialPos[2] + Math.cos(t * 0.7) * orbitRadius;

      groupRef.current.position.set(x, y, z);

      const nextX = initialPos[0] + Math.sin((t + 0.1) * 0.7) * orbitRadius;
      const nextZ = initialPos[2] + Math.cos((t + 0.1) * 0.7) * orbitRadius;
      groupRef.current.rotation.y = Math.atan2(nextX - x, nextZ - z) + Math.PI;
    }

    const flap = Math.sin(state.clock.getElapsedTime() * 18 + phase) * 0.7;
    if (leftWingRef.current) leftWingRef.current.rotation.y = flap;
    if (rightWingRef.current) rightWingRef.current.rotation.y = -flap;
  });

  const wingShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.2, 0.4, 0.5, 0.5, 0.6, 0.2);
    shape.bezierCurveTo(0.7, -0.1, 0.4, -0.4, 0.2, -0.2);
    shape.bezierCurveTo(0.1, -0.3, 0.05, -0.1, 0, 0);
    return shape;
  }, []);

  return (
    <group ref={groupRef} scale={0.55}>
      {/* Left Wing */}
      <group ref={leftWingRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Right Wing */}
      <group ref={rightWingRef} position={[0, 0, 0]} scale={[-1, 1, 1]}>
        <mesh position={[0, 0, 0]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Butterfly Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.04, 0.3, 0.04]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

export const Butterflies = ({ count = 5 }) => {
  const butterflies = useMemo(() => {
    const colors = ["#f472b6", "#c084fc", "#38bdf8", "#fde047", "#a7f3d0"];
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        color: colors[i % colors.length],
        initialPos: [
          (Math.random() - 0.5) * 8,
          Math.random() * 3 + 1,
          (Math.random() - 0.5) * 8
        ],
        orbitRadius: Math.random() * 4 + 3,
        speed: Math.random() * 0.3 + 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }
    return items;
  }, [count]);

  return (
    <group>
      {butterflies.map((b) => (
        <SingleButterfly key={b.id} {...b} />
      ))}
    </group>
  );
};
