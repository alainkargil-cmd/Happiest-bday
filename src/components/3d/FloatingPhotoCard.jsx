import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export const FloatingPhotoCard = ({
  memory,
  boxPosition = [0, 0, 0],
  isRevealed = false,
  isFlyingToSky = false,
  skyTarget = [0, 15, -10],
  onRevealFinish,
  onFlyToSkyFinish
}) => {
  const cardGroup = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!memory?.image) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      memory.image,
      (tex) => {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipMapLinearFilter;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.warn("Could not load photo texture, creating fallback texture:", err);
        // Fallback procedural canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 700;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 512, 700);
        grad.addColorStop(0, '#f472b6');
        grad.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 700);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText(memory?.title || 'Vyomini ✨', 256, 350);
        const fbTex = new THREE.CanvasTexture(canvas);
        setTexture(fbTex);
      }
    );
  }, [memory]);

  // Elevation and flight animations
  useEffect(() => {
    if (isRevealed && cardGroup.current) {
      // Start inside box
      cardGroup.current.position.set(boxPosition[0], boxPosition[1] + 0.5, boxPosition[2]);
      cardGroup.current.scale.set(0.1, 0.1, 0.1);
      cardGroup.current.rotation.set(0, 0, 0);

      // Smoothly ascend and expand in front of camera
      gsap.to(cardGroup.current.position, {
        x: 0,
        y: 2.2,
        z: 1.8,
        duration: 2.2,
        ease: "power3.out",
        onComplete: () => {
          if (onRevealFinish) onRevealFinish();
        }
      });

      gsap.to(cardGroup.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2.2,
        ease: "back.out(1.2)"
      });
    }
  }, [isRevealed, boxPosition, onRevealFinish]);

  useEffect(() => {
    if (isFlyingToSky && cardGroup.current) {
      // Fly gracefully up into the night sky
      gsap.to(cardGroup.current.position, {
        x: skyTarget[0],
        y: skyTarget[1],
        z: skyTarget[2],
        duration: 2.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (onFlyToSkyFinish) onFlyToSkyFinish();
        }
      });

      gsap.to(cardGroup.current.scale, {
        x: 0.45,
        y: 0.45,
        z: 0.45,
        duration: 2.5,
        ease: "power2.inOut"
      });

      gsap.to(cardGroup.current.rotation, {
        y: Math.PI * 2,
        duration: 2.5,
        ease: "power1.inOut"
      });
    }
  }, [isFlyingToSky, skyTarget, onFlyToSkyFinish]);

  useFrame((state) => {
    if (isRevealed && !isFlyingToSky && cardGroup.current) {
      const t = state.clock.getElapsedTime();
      // Gentle floating hover & slight tilt
      cardGroup.current.position.y = 2.2 + Math.sin(t * 1.5) * 0.08;
      cardGroup.current.rotation.y = Math.sin(t * 0.8) * 0.06;
      cardGroup.current.rotation.z = Math.cos(t * 0.6) * 0.03;
    }
  });

  if (!isRevealed) return null;

  return (
    <group ref={cardGroup}>
      {/* Photo Frame Backing Plate */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[2.5, 3.3, 0.06]} />
        <meshStandardMaterial
          color="#fef08a"
          metalness={0.8}
          roughness={0.2}
          emissive="#fbbf24"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Outer Glow Border Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.42, 3.22, 0.05]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Main Photograph Plane */}
      <mesh position={[0, 0.1, 0.04]}>
        <planeGeometry args={[2.2, 2.8]} />
        {texture ? (
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        ) : (
          <meshStandardMaterial color="#f472b6" emissive="#ec4899" emissiveIntensity={0.5} />
        )}
      </mesh>

      {/* Frame Bottom Label Accent */}
      <mesh position={[0, -1.4, 0.04]}>
        <planeGeometry args={[2.2, 0.25]} />
        <meshStandardMaterial color="#3b0764" roughness={0.4} />
      </mesh>

      {/* Halo point light for card glow */}
      <pointLight position={[0, 0, 0.6]} color="#fde047" intensity={2.5} distance={6} />
    </group>
  );
};
