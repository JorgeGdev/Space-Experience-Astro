// Boid.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';

export const Boid = ({
  boid,
  wanderCircle,
  wanderRadius,
  alignCircle,
  alignRadius,
  avoidCircle,
  avoidRadius,
  cohesionCircle,
  cohesionRadius,
  ...props
}) => {
  const { scene, animations } = useGLTF(`/models/${boid.model}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
  }, [clone]);

  // Reproduce la primera animación disponible en bucle
  useEffect(() => {
    const animationNames = Object.keys(actions);
    if (animationNames.length > 0) {
      actions[animationNames[0]]?.play();
    }
    return () => {
      animationNames.forEach((name) => actions[name]?.stop());
    };
  }, [actions]);

  useFrame(() => {
    const target = group.current.clone(false);
    target.lookAt(group.current.position.clone().add(boid.velocity));
    group.current.quaternion.slerp(target.quaternion, 0.1);

    group.current.position.copy(boid.position);
  });

  return (
    <group {...props} ref={group} scale={boid.scale}>
      <primitive object={clone} rotation-y={Math.PI / 2} />
      {wanderCircle && (
        <mesh>
          <sphereGeometry args={[wanderRadius, 32]} />
          <meshBasicMaterial color={'red'} wireframe />
        </mesh>
      )}
      {alignCircle && (
        <mesh>
          <sphereGeometry args={[alignRadius, 32]} />
          <meshBasicMaterial color={'green'} wireframe />
        </mesh>
      )}
      {avoidCircle && (
        <mesh>
          <sphereGeometry args={[avoidRadius, 32]} />
          <meshBasicMaterial color={'blue'} wireframe />
        </mesh>
      )}
      {cohesionCircle && (
        <mesh>
          <sphereGeometry args={[cohesionRadius, 32]} />
          <meshBasicMaterial color={'yellow'} wireframe />
        </mesh>
      )}
    </group>
  );
};
