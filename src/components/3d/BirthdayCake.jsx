import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

function Candle({ position, isLit = true }) {
  const flameRef = useRef();
  const flameLightRef = useRef();

  useFrame((state) => {
    if (flameRef.current && isLit) {
      const t = state.clock.getElapsedTime() * 8;
      // Realistic flame flicker jitter
      const flicker = Math.sin(t) * 0.15 + Math.cos(t * 2.3) * 0.1;
      flameRef.current.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
      flameRef.current.rotation.z = Math.sin(t * 1.5) * 0.1;

      if (flameLightRef.current) {
        flameLightRef.current.intensity = 1.2 + flicker * 0.6;
      }
    }
  });

  return (
    <group position={position}>
      {/* Candle Body */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 12]} />
        <meshStandardMaterial
          color="#fbcfe8"
          roughness={0.3}
          emissive="#f472b6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
        <meshBasicMaterial color="#1e1b4b" />
      </mesh>

      {/* Glowing Flame */}
      {isLit && (
        <group ref={flameRef} position={[0, 0.98, 0]}>
          <mesh>
            <coneGeometry args={[0.07, 0.22, 10]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <mesh scale={[1.4, 1.4, 1.4]}>
            <coneGeometry args={[0.08, 0.25, 10]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.5} />
          </mesh>
          <pointLight
            ref={flameLightRef}
            color="#fbbf24"
            intensity={1.2}
            distance={4}
          />
        </group>
      )}
    </group>
  );
}

export const BirthdayCake = ({ position = [0, 0, 0], scale = 1, isBlownOut = false, onBlowComplete }) => {
  const cakeGroup = useRef();
  const smokeGroup = useRef();
  const sparkleBurst = useRef();

  useFrame((state) => {
    if (cakeGroup.current) {
      const t = state.clock.getElapsedTime();
      cakeGroup.current.rotation.y = t * 0.15;
      cakeGroup.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
    }

    if (smokeGroup.current && isBlownOut) {
      smokeGroup.current.position.y += 0.02;
      smokeGroup.current.scale.x += 0.01;
      smokeGroup.current.scale.z += 0.01;
    }
  });

  React.useEffect(() => {
    if (isBlownOut) {
      if (smokeGroup.current) {
        gsap.to(smokeGroup.current.scale, { x: 2, y: 3, z: 2, duration: 2, ease: "power1.out" });
      }
      if (sparkleBurst.current) {
        gsap.fromTo(
          sparkleBurst.current.scale,
          { x: 0.2, y: 0.2, z: 0.2 },
          { x: 4, y: 4, z: 4, duration: 2.5, ease: "power2.out" }
        );
      }
      if (onBlowComplete) {
        setTimeout(onBlowComplete, 1800);
      }
    }
  }, [isBlownOut, onBlowComplete]);

  // Candle positions on top tier
  const candles = useMemo(() => [
    { pos: [0, 1.8, 0] },
    { pos: [0.45, 1.8, 0] },
    { pos: [-0.45, 1.8, 0] },
    { pos: [0, 1.8, 0.45] },
    { pos: [0, 1.8, -0.45] },
  ], []);

  return (
    <group ref={cakeGroup} position={position} scale={scale}>
      {/* Plate / Cake Stand */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[2.5, 2.3, 0.15, 32]} />
        <meshStandardMaterial
          color="#fef08a"
          metalness={0.8}
          roughness={0.2}
          emissive="#fbbf24"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Bottom Tier */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[2.0, 2.0, 0.9, 32]} />
        <meshStandardMaterial
          color="#fbcfe8"
          roughness={0.3}
          metalness={0.1}
          emissive="#f472b6"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Bottom Tier Frosting Ring */}
      <mesh position={[0, 0.9, 0]}>
        <torusGeometry args={[2.0, 0.08, 16, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} emissive="#fdf4ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Middle Tier */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.7, 32]} />
        <meshStandardMaterial
          color="#e9d5ff"
          roughness={0.3}
          metalness={0.1}
          emissive="#c084fc"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Middle Tier Frosting Ring */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[1.4, 0.08, 16, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} emissive="#fdf4ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Top Tier */}
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.5, 32]} />
        <meshStandardMaterial
          color="#fce7f3"
          roughness={0.2}
          metalness={0.1}
          emissive="#f472b6"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Candles */}
      {candles.map((c, i) => (
        <Candle key={i} position={c.pos} isLit={!isBlownOut} />
      ))}

      {/* Smoke puffs when blown out */}
      {isBlownOut && (
        <group ref={smokeGroup} position={[0, 2.0, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="#e2e8f0" transparent opacity={0.4} />
          </mesh>
          <mesh position={[0.2, 0.4, -0.1]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshBasicMaterial color="#cbd5e1" transparent opacity={0.3} />
          </mesh>
          <mesh position={[-0.15, 0.6, 0.15]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.25} />
          </mesh>
        </group>
      )}

      {/* Sparkle burst sphere */}
      {isBlownOut && (
        <group ref={sparkleBurst} position={[0, 1.8, 0]}>
          <pointLight color="#fbcfe8" intensity={4} distance={15} />
        </group>
      )}

      {/* Floating pearls around cake */}
      <mesh position={[0, 0.05, 2.1]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[2.1, 0.05, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};
