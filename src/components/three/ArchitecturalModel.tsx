"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type VillaPointerState = {
  x: number;
  targetInfluence: number;
  influence: number;
  yawOffset: number;
};

interface ArchitecturalModelProps {
  pointerRef: React.MutableRefObject<VillaPointerState>;
  isTechnicalMode?: boolean;
  isIntroActive?: boolean;
  enableRealtimeShadows?: boolean;
}

type ModelInfo = {
  scene: THREE.Group;
  center: THREE.Vector3;
  size: THREE.Vector3;
  minY: number;
};

const MODEL_PATH = "/models/erdem-villa.glb";
const FULL_REVOLUTION_SECONDS = 64;
const AUTO_ROTATION_SPEED = (Math.PI * 2) / FULL_REVOLUTION_SECONDS;
const POINTER_YAW_LIMIT = Math.PI / 110;
const INTRO_ROTATION_PAUSE_SECONDS = 1.2;
const INITIAL_YAW = -0.36;
const DESKTOP_TARGET_FOOTPRINT = 8.4;
const MOBILE_TARGET_FOOTPRINT = 6.05;

useGLTF.preload(MODEL_PATH);

function createPlanGeometry(width: number, depth: number, accent = false) {
  const geometry = new THREE.BufferGeometry();
  const points: THREE.Vector3[] = [];
  const w = width / 2;
  const d = depth / 2;

  const pushLine = (x1: number, z1: number, x2: number, z2: number) => {
    points.push(new THREE.Vector3(x1, 0, z1), new THREE.Vector3(x2, 0, z2));
  };

  if (accent) {
    pushLine(-w * 0.92, -d * 0.34, w * 0.92, -d * 0.34);
    pushLine(-w * 0.92, d * 0.34, w * 0.92, d * 0.34);
    pushLine(-w * 0.22, -d * 0.88, -w * 0.22, d * 0.88);
    pushLine(w * 0.46, -d * 0.68, w * 0.46, d * 0.74);
    pushLine(w * 0.08, d * 0.52, w * 0.72, d * 0.52);
  } else {
    pushLine(-w, -d, w, -d);
    pushLine(w, -d, w, d * 0.58);
    pushLine(w, d * 0.58, w * 0.18, d * 0.58);
    pushLine(w * 0.18, d * 0.58, w * 0.18, d);
    pushLine(w * 0.18, d, -w, d);
    pushLine(-w, d, -w, -d);

    pushLine(-w * 0.72, -d * 0.72, w * 0.76, -d * 0.72);
    pushLine(-w * 0.72, d * 0.16, w * 0.76, d * 0.16);
    pushLine(-w * 0.36, -d * 0.72, -w * 0.36, d * 0.82);
    pushLine(w * 0.18, -d * 0.72, w * 0.18, d * 0.58);

    pushLine(-w * 1.08, 0, w * 1.08, 0);
    pushLine(0, -d * 1.08, 0, d * 1.08);

    pushLine(-w, -d * 1.1, w, -d * 1.1);
    pushLine(-w, -d * 1.16, -w, -d * 1.04);
    pushLine(w, -d * 1.16, w, -d * 1.04);
  }

  geometry.setFromPoints(points);
  return geometry;
}

interface GroundingTreatmentProps {
  floorY: number;
  footprintWidth: number;
  footprintDepth: number;
  isMobileCanvas: boolean;
  enableRealtimeShadows: boolean;
}

const GroundingTreatment: React.FC<GroundingTreatmentProps> = ({
  floorY,
  footprintWidth,
  footprintDepth,
  isMobileCanvas,
  enableRealtimeShadows,
}) => {
  const planWidth = footprintWidth * (isMobileCanvas ? 0.98 : 1.08);
  const planDepth = footprintDepth * (isMobileCanvas ? 1.02 : 1.16);
  const shadowRadius = Math.max(footprintWidth, footprintDepth) * 0.56;

  const primaryPlanGeometry = useMemo(
    () => createPlanGeometry(planWidth, planDepth),
    [planDepth, planWidth]
  );
  const accentPlanGeometry = useMemo(
    () => createPlanGeometry(planWidth, planDepth, true),
    [planDepth, planWidth]
  );

  useEffect(() => {
    return () => {
      primaryPlanGeometry.dispose();
      accentPlanGeometry.dispose();
    };
  }, [accentPlanGeometry, primaryPlanGeometry]);

  return (
    <group position={[0, floorY, 0]}>
      <mesh
        receiveShadow={enableRealtimeShadows}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
        visible={enableRealtimeShadows}
      >
        <circleGeometry args={[shadowRadius, 48]} />
        <shadowMaterial
          color="#102B49"
          transparent
          opacity={isMobileCanvas ? 0.055 : 0.105}
          depthWrite={false}
        />
      </mesh>

      <lineSegments geometry={primaryPlanGeometry} renderOrder={-1}>
        <lineBasicMaterial
          color="#102B49"
          transparent
          opacity={isMobileCanvas ? 0.095 : 0.13}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      <lineSegments geometry={accentPlanGeometry} renderOrder={-1}>
        <lineBasicMaterial
          color="#9A5C2F"
          transparent
          opacity={isMobileCanvas ? 0.08 : 0.11}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
};

export const ArchitecturalModel: React.FC<ArchitecturalModelProps> = ({
  pointerRef,
  isTechnicalMode = false,
  isIntroActive = false,
  enableRealtimeShadows = true,
}) => {
  const modelGroupRef = useRef<THREE.Group>(null);
  const autoRotationRef = useRef(INITIAL_YAW);
  const pauseRemainingRef = useRef(
    isIntroActive ? Number.POSITIVE_INFINITY : 0
  );
  const { size: canvasSize } = useThree();

  const gltf = useGLTF(MODEL_PATH);

  const modelInfo = useMemo<ModelInfo | null>(() => {
    if (!gltf?.scene) return null;

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    return {
      scene: gltf.scene,
      center,
      size,
      minY: box.min.y,
    };
  }, [gltf]);

  const isMobileCanvas = canvasSize.width < 768;
  const horizontalDimension = Math.max(
    modelInfo?.size.x ?? 1,
    modelInfo?.size.z ?? 1
  );
  const targetFootprint = isMobileCanvas
    ? MOBILE_TARGET_FOOTPRINT
    : DESKTOP_TARGET_FOOTPRINT;
  const modelScale = targetFootprint / horizontalDimension;
  const scaledSize = useMemo(() => {
    return (modelInfo?.size ?? new THREE.Vector3(1, 1, 1))
      .clone()
      .multiplyScalar(modelScale);
  }, [modelInfo, modelScale]);
  const floorY = modelInfo
    ? (modelInfo.minY - modelInfo.center.y) * modelScale - 0.035
    : -1.8;
  const sceneOffsetX = isMobileCanvas ? 0 : -0.22;

  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#102B49"),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
  }, []);

  useEffect(() => {
    if (!modelInfo) return;

    modelInfo.scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;

      const mesh = child as THREE.Mesh;
      mesh.frustumCulled = true;

      if (!mesh.geometry.boundingSphere) {
        mesh.geometry.computeBoundingSphere();
      }

      const shadowRadius = (mesh.geometry.boundingSphere?.radius ?? 0) * modelScale;
      const shouldCastShadow = enableRealtimeShadows && shadowRadius > 0.38;
      mesh.castShadow = shouldCastShadow;
      mesh.receiveShadow = shouldCastShadow;

      if (!mesh.material) return;

      mesh.userData.originalMaterial = mesh.userData.originalMaterial ?? mesh.material;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        mat.needsUpdate = true;
        mat.clippingPlanes = null;
        mat.clipShadows = false;
        if ("wireframe" in mat) mat.wireframe = false;
      });
    });
  }, [enableRealtimeShadows, modelInfo, modelScale]);

  useEffect(() => {
    if (!modelInfo) return;

    modelInfo.scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;

      const mesh = child as THREE.Mesh;
      if (isTechnicalMode) {
        mesh.material = wireframeMaterial;
      } else if (mesh.userData.originalMaterial) {
        mesh.material = mesh.userData.originalMaterial;
      }
    });
  }, [isTechnicalMode, modelInfo, wireframeMaterial]);

  useEffect(() => {
    pauseRemainingRef.current = isIntroActive
      ? Number.POSITIVE_INFINITY
      : INTRO_ROTATION_PAUSE_SECONDS;
  }, [isIntroActive]);

  const cameraFit = useMemo(() => {
    if (!modelInfo || canvasSize.width <= 0 || canvasSize.height <= 0) {
      return null;
    }

    const fov = isMobileCanvas ? 38 : 36;
    const aspect = canvasSize.width / canvasSize.height;
    const verticalFov = THREE.MathUtils.degToRad(fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
    const halfHeight = scaledSize.y * 0.56;
    const horizontalFitRadius = isMobileCanvas
      ? Math.max(scaledSize.x, scaledSize.z) * 0.47
      : Math.max(scaledSize.x, scaledSize.z) * 0.5;
    const fillRatio = isMobileCanvas ? 0.91 : 0.96;
    const fitDistance =
      Math.max(
        halfHeight / Math.tan(verticalFov / 2),
        horizontalFitRadius / Math.tan(horizontalFov / 2)
      ) / fillRatio;
    const cameraDirection = new THREE.Vector3(
      isMobileCanvas ? 1.22 : 1.55,
      isMobileCanvas ? 0.54 : 0.58,
      isMobileCanvas ? 1.9 : 2.05
    ).normalize();
    const lookTarget = new THREE.Vector3(
      sceneOffsetX,
      floorY + scaledSize.y * (isMobileCanvas ? 0.4 : 0.36),
      0
    );

    return {
      fov,
      far: Math.max(100, fitDistance + 40),
      lookTarget,
      position: lookTarget.clone().add(cameraDirection.multiplyScalar(fitDistance)),
    };
  }, [
    canvasSize.height,
    canvasSize.width,
    isMobileCanvas,
    modelInfo,
    floorY,
    scaledSize,
    sceneOffsetX,
  ]);

  useFrame((state, delta) => {
    if (cameraFit) {
      const perspectiveCamera = state.camera as THREE.PerspectiveCamera;

      if (perspectiveCamera.isPerspectiveCamera) {
        perspectiveCamera.fov = cameraFit.fov;
        perspectiveCamera.near = 0.1;
        perspectiveCamera.far = cameraFit.far;
        perspectiveCamera.position.copy(cameraFit.position);
        perspectiveCamera.lookAt(cameraFit.lookTarget);
        perspectiveCamera.updateProjectionMatrix();
      }
    }

    if (!modelGroupRef.current) return;

    const frameDelta = Math.min(delta, 0.05);
    const pointer = pointerRef.current;
    pointer.influence = THREE.MathUtils.damp(
      pointer.influence,
      pointer.targetInfluence,
      4,
      frameDelta
    );
    pointer.yawOffset = THREE.MathUtils.damp(
      pointer.yawOffset,
      pointer.x * pointer.influence * POINTER_YAW_LIMIT,
      3,
      frameDelta
    );

    if (Number.isFinite(pauseRemainingRef.current)) {
      if (pauseRemainingRef.current > 0) {
        pauseRemainingRef.current = Math.max(
          0,
          pauseRemainingRef.current - frameDelta
        );
      } else {
        autoRotationRef.current += frameDelta * AUTO_ROTATION_SPEED;
      }
    }

    modelGroupRef.current.rotation.set(
      0,
      autoRotationRef.current + pointer.yawOffset,
      0
    );
  });

  if (!modelInfo) return null;

  return (
    <group position={[sceneOffsetX, -0.08, 0]}>
      <group ref={modelGroupRef}>
        <primitive
          object={modelInfo.scene}
          scale={[modelScale, modelScale, modelScale]}
          position={[
            -modelInfo.center.x * modelScale,
            -modelInfo.center.y * modelScale,
            -modelInfo.center.z * modelScale,
          ]}
        />
      </group>

      <GroundingTreatment
        floorY={floorY}
        footprintWidth={Math.max(scaledSize.x, scaledSize.z)}
        footprintDepth={Math.min(scaledSize.x, scaledSize.z)}
        isMobileCanvas={isMobileCanvas}
        enableRealtimeShadows={enableRealtimeShadows}
      />
    </group>
  );
};
