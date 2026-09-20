import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

import { FloatingIslands } from './FloatingIslands';
import { FantasyCastle } from './FantasyCastle';
import { Particles } from './Particles';
import { Butterflies } from './Butterflies';
import { Fireworks } from './Fireworks';

// Smooth Cinematic Camera Controller with Mobile Adaptation
function CameraDirector({ sceneId, selectedGiftId, isCakeWished, isFinale }) {
  const { camera, viewport } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isMobile = viewport.width < 5.5;

  useEffect(() => {
    let targetPos = { x: 0, y: 0, z: isMobile ? 5.2 : 4.5 };
    let lookTarget = { x: 0, y: 0, z: 0 };
    let duration = 2.0;

    switch (sceneId) {
      case 1: // Intro Envelope
        targetPos = { x: 0, y: 0, z: isMobile ? 5.0 : 4.2 };
        lookTarget = { x: 0, y: 0, z: 0 };
        break;
      case 2: // Dream World Panorama
        targetPos = { x: 0, y: isMobile ? 4.0 : 3.5, z: isMobile ? 18 : 15 };
        lookTarget = { x: 0, y: 2, z: -10 };
        duration = 3.0;
        break;
      case 3: // Birthday Cake
        if (isCakeWished) {
          targetPos = { x: 0, y: isMobile ? 2.4 : 2.2, z: isMobile ? 5.8 : 4.8 };
          lookTarget = { x: 0, y: 1.5, z: 0 };
          duration = 1.8;
        } else {
          targetPos = { x: 0, y: isMobile ? 2.3 : 2.0, z: isMobile ? 8.2 : 6.8 };
          lookTarget = { x: 0, y: 1.2, z: 0 };
          duration = 2.2;
        }
        break;
      case 4: // Gift World
        if (selectedGiftId !== null) {
          targetPos = { x: 0, y: isMobile ? 2.6 : 2.2, z: isMobile ? 6.2 : 5.2 };
          lookTarget = { x: 0, y: isMobile ? 2.3 : 2.0, z: 0 };
          duration = 1.8;
        } else {
          targetPos = { x: 0, y: isMobile ? 3.6 : 3.2, z: isMobile ? 13.0 : 10.5 };
          lookTarget = { x: 0, y: 1.0, z: 0 };
          duration = 2.2;
        }
        break;
      case 5: // Final Gift
        targetPos = { x: 0, y: isMobile ? 3.2 : 2.8, z: isMobile ? 10.5 : 8.5 };
        lookTarget = { x: 0, y: 1.8, z: 0 };
        duration = 2.5;
        break;
      case 6: // Finale
        targetPos = { x: 0, y: isMobile ? 5.5 : 5.0, z: isMobile ? 18 : 15 };
        lookTarget = { x: 0, y: 4.0, z: -6 };
        duration = 3.0;
        break;
      default:
        break;
    }

    gsap.to(camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: duration,
      ease: "power2.inOut"
    });

    gsap.to(targetLookAt.current, {
      x: lookTarget.x,
      y: lookTarget.y,
      z: lookTarget.z,
      duration: duration,
      ease: "power2.inOut"
    });
  }, [sceneId, selectedGiftId, isCakeWished, isFinale, isMobile, camera]);

  useFrame(() => {
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

export const DreamWorldCanvas = ({
  sceneId,
  selectedGiftId,
  isCakeWished,
  children
}) => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, 1.25]}
        performance={{ min: 0.5 }}
      >
        {/* Atmospheric Fog */}
        <color attach="background" args={["#07071a"]} />
        <fogExp2 attach="fog" args={["#07071a", 0.035]} />

        {/* Cinematic Dream Lighting */}
        <ambientLight intensity={0.65} color="#c4b5fd" />
        <directionalLight
          position={[10, 20, 15]}
          intensity={1.1}
          color="#fef08a"
        />
        <pointLight position={[-8, -4, -8]} intensity={0.7} color="#f472b6" />

        {/* Stars Background */}
        <Stars
          radius={70}
          depth={40}
          count={1500}
          factor={3.5}
          saturation={0.7}
          fade
          speed={0.6}
        />

        {/* Global Floating Stardust */}
        <Particles count={120} radius={25} size={0.07} color="#fef08a" />

        {/* Ambient Butterflies */}
        {sceneId > 1 && sceneId < 6 && <Butterflies count={5} />}

        {/* Distant Castle & Floating Islands */}
        {sceneId > 1 && (
          <>
            <FloatingIslands />
            <FantasyCastle />
          </>
        )}

        {/* Grand Finale Fireworks */}
        <Fireworks active={sceneId === 6} />

        {/* Dynamic Camera Director */}
        <CameraDirector
          sceneId={sceneId}
          selectedGiftId={selectedGiftId}
          isCakeWished={isCakeWished}
          isFinale={sceneId === 6}
        />

        {/* Scene-specific 3D children */}
        {children}
      </Canvas>
    </div>
  );
};
