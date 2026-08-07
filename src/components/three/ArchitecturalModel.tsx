"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ArchitecturalModelProps {
  pointerPos?: { x: number; y: number };
  isTechnicalMode?: boolean;
  isIntroActive?: boolean;
}

const MODEL_PATH = "/models/erdem-villa.glb";

// Module-level clipping plane for building reveal
const CLIP_PLANE = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);

// Preload GLB model
useGLTF.preload(MODEL_PATH);

export const ArchitecturalModel: React.FC<ArchitecturalModelProps> = ({
  pointerPos = { x: 0, y: 0 },
  isTechnicalMode = false,
  isIntroActive = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const assemblyRef = useRef<THREE.Group>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);
  const animTimeRef = useRef(0);

  const gltf = useGLTF(MODEL_PATH);

  // Process & Clone original GLB scene while preserving PBR materials
  const { clonedScene, boundingInfo } = useMemo(() => {
    if (!gltf || !gltf.scene) {
      return { clonedScene: null, boundingInfo: { center: new THREE.Vector3(), scale: 1, height: 1 } };
    }

    const sceneCopy = gltf.scene.clone(true);

    sceneCopy.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          mesh.userData.originalMaterial = mesh.material;

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              mat.needsUpdate = true;
              mat.clippingPlanes = [CLIP_PLANE];
              mat.clipShadows = true;
              if ("wireframe" in mat) mat.wireframe = false;
            });
          } else {
            mesh.material.needsUpdate = true;
            mesh.material.clippingPlanes = [CLIP_PLANE];
            mesh.material.clipShadows = true;
            if ("wireframe" in mesh.material) mesh.material.wireframe = false;
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
      boundingInfo: { center, scale: targetScale, height: size.y * targetScale },
    };
  }, [gltf]);

  // Optional technical wireframe material
  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#102B49"),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      clippingPlanes: [CLIP_PLANE],
    });
  }, []);

  // Handle technical mode toggle
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

  // Frame animation loop: Architectural emergence from plan (2.8s -> 5.8s) & Pointer interaction
  useFrame((state, delta) => {
    if (!assemblyRef.current || !groupRef.current) return;

    const maxClipHeight = boundingInfo.height * 1.5;

    // Direct settled state if intro is completed or skipped
    if (!isIntroActive) {
      assemblyRef.current.position.y = THREE.MathUtils.lerp(
        assemblyRef.current.position.y,
        0,
        0.12
      );
      assemblyRef.current.scale.set(1, 1, 1);
      CLIP_PLANE.constant = THREE.MathUtils.lerp(CLIP_PLANE.constant, maxClipHeight, 0.15);

      if (scanRingRef.current) {
        const ringMat = scanRingRef.current.material as THREE.MeshBasicMaterial;
        ringMat.opacity = THREE.MathUtils.lerp(ringMat.opacity, 0, 0.1);
      }

      // Pointer interaction (Yaw & Pitch)
      const targetYaw = (pointerPos.x * Math.PI) / 45;
      const targetPitch = (-pointerPos.y * Math.PI) / 65;

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
      return;
    }

    animTimeRef.current += delta;
    const totalTime = animTimeRef.current;

    // Timeline:
    // 0.0s - 2.8s: Architectural plan drawing phase (3D model stays flat below surface)
    // 2.8s - 5.8s: Building physically rises out of plan (3.0s emergence duration)
    // 5.8s+: Settled state
    const riseStartTime = 2.8;
    const riseDuration = 3.0;

    let riseProgress = 0;
    if (totalTime > riseStartTime) {
      riseProgress = Math.min((totalTime - riseStartTime) / riseDuration, 1);
    }

    // Smooth cubic ease-out for realistic architectural rise
    const easeProgress = 1 - Math.pow(1 - riseProgress, 3.2);

    // Vertical Y position: -1.2 to 0
    const startY = -1.2;
    const endY = 0;
    assemblyRef.current.position.y = THREE.MathUtils.lerp(startY, endY, easeProgress);

    // Vertical scale Y: flat blueprint (0.02) to full 3D (1.0)
    const scaleY = THREE.MathUtils.lerp(0.02, 1.0, easeProgress);
    assemblyRef.current.scale.set(1, scaleY, 1);

    // Clipping plane reveals the building as it ascends
    CLIP_PLANE.constant = THREE.MathUtils.lerp(-0.1, maxClipHeight, easeProgress);

    // Scan line ring accent during emergence
    if (scanRingRef.current) {
      const currentCutY = THREE.MathUtils.lerp(0, boundingInfo.height * 0.8, easeProgress);
      scanRingRef.current.position.y = currentCutY;

      const ringMat = scanRingRef.current.material as THREE.MeshBasicMaterial;
      if (riseProgress > 0 && riseProgress < 1) {
        ringMat.opacity = (1 - riseProgress) * 0.45;
      } else {
        ringMat.opacity = 0;
      }
    }

    // Gentle pointer tilt near completion
    if (riseProgress > 0.6) {
      const targetYaw = (pointerPos.x * Math.PI) / 45;
      const targetPitch = (-pointerPos.y * Math.PI) / 65;

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

        {/* Rising Blueprint Scan Line Accent */}
        <mesh ref={scanRingRef} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial
            color="#9A5C2F"
            transparent
            opacity={0}
            depthTest={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

