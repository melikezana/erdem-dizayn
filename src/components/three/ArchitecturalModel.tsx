"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ArchitecturalModelProps {
  pointerPos?: { x: number; y: number };
  isTechnicalMode?: boolean;
}

const MODEL_PATH = "/models/erdem-villa.glb";

// Preload GLB
useGLTF.preload(MODEL_PATH);

export const ArchitecturalModel: React.FC<ArchitecturalModelProps> = ({
  pointerPos = { x: 0, y: 0 },
  isTechnicalMode = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const assemblyRef = useRef<THREE.Group>(null);
  const animTimeRef = useRef(0);

  const gltf = useGLTF(MODEL_PATH);

  // Original & Blueprint wireframe scenes setup
  const { clonedScene, boundingInfo } = useMemo(() => {
    if (!gltf || !gltf.scene) {
      return { clonedScene: null, boundingInfo: { center: new THREE.Vector3(), scale: 1 } };
    }

    const sceneCopy = gltf.scene.clone(true);

    sceneCopy.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        if (mesh.material) {
          // Save original material reference on child userData
          mesh.userData.originalMaterial = mesh.material;
          
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              mat.needsUpdate = true;
              if ('wireframe' in mat) mat.wireframe = false;
            });
          } else {
            mesh.material.needsUpdate = true;
            if ('wireframe' in mesh.material) mesh.material.wireframe = false;
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(sceneCopy);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetScale = 4.8 / maxDim;

    return {
      clonedScene: sceneCopy,
      boundingInfo: { center, scale: targetScale, size },
    };
  }, [gltf]);

  // Wireframe material ONLY for technical reveal when toggled
  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#102B49"),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
  }, []);

  // Update material styles when technical mode changes
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (isTechnicalMode) {
          mesh.material = wireframeMaterial;
        } else if (mesh.userData.originalMaterial) {
          mesh.material = mesh.userData.originalMaterial;
        }
      }
    });
  }, [isTechnicalMode, clonedScene, wireframeMaterial]);

  // Frame animation loop - subtle pointer movement only, no continuous spin
  useFrame((state, delta) => {
    if (!assemblyRef.current || !groupRef.current) return;

    // 1. Initial Rise Animation (0s to 2.5s)
    if (animTimeRef.current < 2.5) {
      animTimeRef.current += delta;
    }
    const progress = Math.min(animTimeRef.current / 2.5, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

    // Rise smoothly from Y: -0.8 to 0
    assemblyRef.current.position.y = THREE.MathUtils.lerp(-0.8, 0, easeProgress);

    // 2. Subtle Pointer Movement (Yaw & Elevation)
    // Pointer X -> Yaw (-3 deg to +3 deg)
    const targetYaw = (pointerPos.x * Math.PI) / 60;
    // Pointer Y -> Pitch/Elevation (-2 deg to +2 deg)
    const targetPitch = (-pointerPos.y * Math.PI) / 80;

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
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <group ref={assemblyRef}>
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
    </group>
  );
};
