"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { HOTSPOTS_DATA } from "@/data/hotspots";
import { Hotspot } from "./Hotspot";

interface ArchitecturalModelProps {
  activeHotspot: string | null;
  setActiveHotspot: (id: string | null) => void;
  pointerPos?: { x: number; y: number };
}

const MODEL_PATH = "/models/erdem-villa.glb";

// Preload the GLB model
useGLTF.preload(MODEL_PATH);

export const ArchitecturalModel: React.FC<ArchitecturalModelProps> = ({
  activeHotspot,
  setActiveHotspot,
  pointerPos = { x: 0, y: 0 },
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const assemblyRef = useRef<THREE.Group>(null);
  const animTimeRef = useRef(0);

  // Load GLB model safely
  const gltf = useGLTF(MODEL_PATH);

  // Clone scene & configure materials/shadows
  const { clonedScene, boundingInfo } = useMemo(() => {
    if (!gltf || !gltf.scene) {
      return { clonedScene: null, boundingInfo: { center: new THREE.Vector3(), scale: 1 } };
    }

    const sceneCopy = gltf.scene.clone(true);
    
    // Enable shadows on all meshes
    sceneCopy.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Compute bounding box for auto centering & scaling
    const box = new THREE.Box3().setFromObject(sceneCopy);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Target max dimension ~ 5.5 units
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetScale = 5.5 / maxDim;

    return {
      clonedScene: sceneCopy,
      boundingInfo: { center, scale: targetScale, size },
    };
  }, [gltf]);

  // Assembly animation & subtle mouse tracking interpolation
  useFrame((state, delta) => {
    if (!assemblyRef.current) return;

    // 1. Assembly Entrance Animation (0 to 1 over ~2.5 seconds)
    if (animTimeRef.current < 2.5) {
      animTimeRef.current += delta;
    }
    const progress = Math.min(animTimeRef.current / 2.5, 1);
    // Smooth cubic ease out
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    // Assembly vertical rise from -1.0 to 0
    const startY = -1.0;
    assemblyRef.current.position.y = THREE.MathUtils.lerp(startY, 0, easeProgress);

    // 2. Controlled Pointer Interaction (NO dizzying auto-rotate)
    if (groupRef.current) {
      // Pointer X: yaw ~ -5 deg to +5 deg (-0.087 to +0.087 rad)
      const targetYaw = (pointerPos.x * Math.PI) / 36;
      
      // Pointer Y: elevation ~ -3 deg to +5 deg (-0.052 to +0.087 rad)
      const targetPitch = (-pointerPos.y * Math.PI) / 48;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetYaw,
        0.05
      );

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetPitch,
        0.05
      );
    }
  });

  if (!clonedScene) {
    return null;
  }

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Assembly Entrance Group */}
      <group ref={assemblyRef}>
        {/* Centered and scaled GLB Villa Model */}
        <primitive
          object={clonedScene}
          scale={[boundingInfo.scale, boundingInfo.scale, boundingInfo.scale]}
          position={[
            -boundingInfo.center.x * boundingInfo.scale,
            -boundingInfo.center.y * boundingInfo.scale,
            -boundingInfo.center.z * boundingInfo.scale,
          ]}
        />
      </group>

      {/* 3D Hotspots */}
      {HOTSPOTS_DATA.map((spot) => (
        <Hotspot
          key={spot.id}
          data={spot}
          activeHotspot={activeHotspot}
          setActiveHotspot={setActiveHotspot}
        />
      ))}
    </group>
  );
};
