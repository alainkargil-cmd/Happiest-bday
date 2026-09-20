import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { audioManager } from '../../utils/audioManager';

export const GiftBox = ({
  id,
  position = [0, 0, 0],
  scale = 1,
  color = "#ec4899",
  ribbonColor = "#fef08a",
  isOpen = false,
  isOpening = false,
  isFinal = false,
  isActive = true,
  onClick,
  onHover
}) => {
  const groupRef = useRef();
  const lidRef = useRef();
  const ribbonRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!isOpen && groupRef.current) {
      const t = state.clock.getElapsedTime() + id * 1.5;
      groupRef.current.position.y = position[1] + Math.sin(t * 1.8) * (isFinal ? 0.25 : 0.12);
      groupRef.current.rotation.y = position[0] * 0.1 + Math.sin(t * 0.8) * 0.08;
    }
  });

  React.useEffect(() => {
    if (isOpen || isOpening) {
      if (lidRef.current) {
        gsap.to(lidRef.current.position, {
          y: isFinal ? 4.0 : 2.5,
          z: isFinal ? -1.8 : -1.0,
          duration: 1.4,
          ease: "power3.out"
        });
        gsap.to(lidRef.current.rotation, {
          x: -Math.PI * 0.45,
          z: 0.15,
          duration: 1.4,
          ease: "power3.out"
        });
      }
    }
  }, [isOpen, isOpening, isFinal]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isActive || isOpen || isOpening) return;
    audioManager.playGiftOpen();
    if (onClick) onClick(id);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (!isActive || isOpen) return;
    setHovered(true);
    document.body.style.cursor = 'pointer';
    if (onHover) onHover(id, true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
    if (onHover) onHover(id, false);
  };

  const boxSize = isFinal ? [3.0, 2.5, 3.0] : [1.8, 1.6, 1.8];
  const lidSize = isFinal ? [3.2, 0.6, 3.2] : [1.95, 0.4, 1.95];

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale * (hovered ? 1.06 : 1)}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Box Lower Body */}
      <mesh position={[0, boxSize[1] / 2, 0]}>
        <boxGeometry args={boxSize} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.2}
          emissive={hovered ? color : (isOpen ? color : "#000000")}
          emissiveIntensity={hovered ? 0.4 : (isOpen ? 0.3 : 0)}
        />
      </mesh>

      {/* Body Vertical Ribbons */}
      <mesh position={[0, boxSize[1] / 2, 0]}>
        <boxGeometry args={[boxSize[0] * 0.18, boxSize[1] + 0.02, boxSize[2] + 0.02]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.7}
          roughness={0.2}
          emissive={ribbonColor}
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0, boxSize[1] / 2, 0]}>
        <boxGeometry args={[boxSize[0] + 0.02, boxSize[1] + 0.02, boxSize[2] * 0.18]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.7}
          roughness={0.2}
          emissive={ribbonColor}
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Separable Animated Lid */}
      <group ref={lidRef} position={[0, boxSize[1] + lidSize[1] / 2, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={lidSize} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.2}
            emissive={hovered ? color : "#000000"}
            emissiveIntensity={hovered ? 0.4 : 0}
          />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[lidSize[0] * 0.19, lidSize[1] + 0.02, lidSize[2] + 0.02]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[lidSize[0] + 0.02, lidSize[1] + 0.02, lidSize[2] * 0.19]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Golden Bow Ribbon loops on top of lid */}
        <group ref={ribbonRef} position={[0, lidSize[1] / 2 + 0.2, 0]}>
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.22, 0.08, 8, 16]} />
            <meshStandardMaterial color={ribbonColor} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <torusGeometry args={[0.22, 0.08, 8, 16]} />
            <meshStandardMaterial color={ribbonColor} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color={ribbonColor} metalness={0.8} roughness={0.2} emissive={ribbonColor} emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* Lightweight local gift light */}
      {isOpen && (
        <pointLight
          position={[0, boxSize[1] + 0.5, 0]}
          color={ribbonColor}
          intensity={1.5}
          distance={6}
        />
      )}
    </group>
  );
};
