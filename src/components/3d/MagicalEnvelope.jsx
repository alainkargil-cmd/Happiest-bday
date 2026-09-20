import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export const MagicalEnvelope = ({ isOpen = false, onOpenComplete }) => {
  const envelopeGroup = useRef();
  const flapRef = useRef();
  const sealRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (!isOpen && envelopeGroup.current) {
      const t = state.clock.getElapsedTime();
      envelopeGroup.current.position.y = Math.sin(t * 1.5) * 0.2;
      envelopeGroup.current.rotation.y = Math.sin(t * 0.8) * 0.2;
      envelopeGroup.current.rotation.z = Math.cos(t * 0.6) * 0.05;
    }
  });

  // When isOpen becomes true, animate the flap opening and light burst
  React.useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onOpenComplete) onOpenComplete();
        }
      });

      // Animate seal dissolve/scale down
      if (sealRef.current) {
        tl.to(sealRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "back.in(2)" });
      }

      // Animate flap unfolding backwards
      if (flapRef.current) {
        tl.to(flapRef.current.rotation, { x: Math.PI * 0.95, duration: 1.2, ease: "power3.inOut" }, "-=0.3");
      }

      // Animate internal light burst
      if (lightRef.current) {
        tl.to(lightRef.current, { intensity: 10, distance: 30, duration: 1.5, ease: "power2.out" }, "-=0.8");
      }

      // Animate envelope flying forward into camera
      if (envelopeGroup.current) {
        tl.to(envelopeGroup.current.position, { z: 4, duration: 2, ease: "power2.in" }, "-=1.0");
        tl.to(envelopeGroup.current.scale, { x: 2.5, y: 2.5, z: 2.5, duration: 2, ease: "power2.in" }, "-=2.0");
      }
    }
  }, [isOpen, onOpenComplete]);

  return (
    <group ref={envelopeGroup} position={[0, 0, 0]} scale={1.2}>
      {/* Envelope Back & Interior */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial
          color="#3b0764"
          side={THREE.DoubleSide}
          roughness={0.4}
          metalness={0.2}
          emissive="#581c87"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Envelope Front Bottom Fold */}
      <mesh position={[0, -0.2, 0.05]}>
        <planeGeometry args={[3.2, 1.4]} />
        <meshStandardMaterial
          color="#581c87"
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Envelope Flap (Top triangular flap) */}
      <group ref={flapRef} position={[0, 1.1, 0.06]}>
        <mesh position={[0, -0.6, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[1.6, 1.2, 3]} />
          <meshStandardMaterial
            color="#6b21a8"
            side={THREE.DoubleSide}
            roughness={0.3}
            metalness={0.3}
            emissive="#a855f7"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Golden Heart Wax Seal */}
        <mesh ref={sealRef} position={[0, -0.7, 0.1]} scale={0.28}>
          <octahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#fbbf24"
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Internal magical light source */}
      <pointLight ref={lightRef} position={[0, 0.2, 0.2]} color="#fef08a" intensity={isOpen ? 5 : 0.8} distance={8} />

      {/* Floating magical glitter dust */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[1.8, 2.0, 32]} />
        <meshBasicMaterial color="#f472b6" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
