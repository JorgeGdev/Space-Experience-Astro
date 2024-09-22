import React, { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial, Text } from "@react-three/drei";
import * as THREE from "three";

// Importamos los shaders
import portalVertex from "./shaders/portalVertex.glsl";
import portalFragment from "./shaders/portalFragment.glsl";

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uColorStart: new THREE.Color("#ffffff"),
    uColorEnd: new THREE.Color("#000000"),
  },
  portalVertex,
  portalFragment,
);

extend({ PortalMaterial });

export default function Portal({ onDoubleClick, progress }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value += delta;
      meshRef.current.material.uniforms.uProgress.value = progress;
    }
  });

  return (
    <>
      <Text fontSize={0.2} position={[0, 1.3, -2.9]}>Black Hole</Text>
      <Text fontSize={0.2} position={[0, 1.1, -2.9]}>Click X 2</Text>
      <mesh
        ref={meshRef}
        onDoubleClick={progress === 0 ? onDoubleClick : null} // Escuchar doble clic
        onPointerOver={() => (document.body.style.cursor = "pointer")} // Cambiar cursor a pointer
        onPointerOut={() => (document.body.style.cursor = "default")} // Restaurar cursor a default
        position={[0, 0, -3]}
      >
        <circleGeometry args={[1, 64]} />
        <portalMaterial side={THREE.DoubleSide} transparent />
      </mesh>
    </>
  );
}
