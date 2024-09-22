// Boids.jsx
import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { randFloat, randInt } from 'three/src/math/MathUtils.js';
import { Boid } from './Boid';
import { themeAtom, THEMES } from './UI';
import { useBoidSettings } from './useBoidSettings';

function remap(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

const limits = new Vector3();
const wander = new Vector3();
const horizontalWander = new Vector3();
const alignment = new Vector3();
const avoidance = new Vector3();
const cohesion = new Vector3();
const steering = new Vector3();

export const Boids = ({ boundaries }) => {
  const [theme] = useAtom(themeAtom);
  const settings = useBoidSettings();

  const {
    NB_BOIDS,
    MIN_SCALE,
    MAX_SCALE,
    MIN_SPEED,
    MAX_SPEED,
    MAX_STEERING,
    threeD,
    ALIGNEMENT,
    AVOIDANCE,
    COHESION,
    WANDER_RADIUS,
    WANDER_STRENGTH,
    WANDER_CIRCLE,
    ALIGN_RADIUS,
    ALIGN_STRENGTH,
    ALIGN_CIRCLE,
    AVOID_RADIUS,
    AVOID_STRENGTH,
    AVOID_CIRCLE,
    COHESION_RADIUS,
    COHESION_STRENGTH,
    COHESION_CIRCLE,
  } = settings;

  // Boids.jsx

const boids = useMemo(() => {
  return new Array(NB_BOIDS).fill().map(() => {
    const model = THEMES[theme].models[randInt(0, THEMES[theme].models.length - 1)];
    const scale = randFloat(MIN_SCALE, MAX_SCALE);
    // Ajustar la escala si el modelo es Ufo_01
    const adjustedScale = model === 'Ufo_01' ? scale * 0.7 : scale;

    return {
      model,
      position: new Vector3(
        randFloat(-boundaries.x / 2, boundaries.x / 2),
        randFloat(-boundaries.y / 2, boundaries.y / 2),
        threeD ? randFloat(-boundaries.z / 2, boundaries.z / 2) : 0
      ),
      velocity: new Vector3(0, 0, 0),
      wander: randFloat(0, Math.PI * 2),
      scale: adjustedScale,
    };
  });
}, [
  NB_BOIDS,
  boundaries,
  theme,
  MIN_SCALE,
  MAX_SCALE,
  threeD,
]);


  useFrame((_, delta) => {
    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i];

      // WANDER
      boid.wander += randFloat(-0.05, 0.05);

      wander.set(
        Math.cos(boid.wander) * WANDER_RADIUS,
        Math.sin(boid.wander) * WANDER_RADIUS,
        0
      );

      wander.normalize();
      wander.multiplyScalar(WANDER_STRENGTH);

      horizontalWander.set(
        Math.cos(boid.wander) * WANDER_RADIUS,
        0,
        Math.sin(boid.wander) * WANDER_RADIUS
      );

      horizontalWander.normalize();
      horizontalWander.multiplyScalar(WANDER_STRENGTH);

      // RESET FORCES
      limits.set(0, 0, 0);
      steering.set(0, 0, 0);
      alignment.set(0, 0, 0);
      avoidance.set(0, 0, 0);
      cohesion.set(0, 0, 0);

      // LIMITS
      if (Math.abs(boid.position.x) + 1 > boundaries.x / 2) {
        limits.x = -boid.position.x;
        boid.wander += Math.PI;
      }

      if (Math.abs(boid.position.y) + 1 > boundaries.y / 2) {
        limits.y = -boid.position.y;
        boid.wander += Math.PI;
      }

      if (Math.abs(boid.position.z) + 1 > boundaries.z / 2) {
        limits.z = -boid.position.z;
        boid.wander += Math.PI;
      }

      limits.normalize();
      limits.multiplyScalar(50);

      let totalCohesion = 0;

      // LOOP THROUGH ALL BOIDS
      for (let b = 0; b < boids.length; b++) {
        if (b === i) continue; // Skip self

        const other = boids[b];
        let d = boid.position.distanceTo(other.position);

        // ALIGNMENT
        if (d > 0 && d < ALIGN_RADIUS) {
          const copy = other.velocity.clone();
          copy.normalize();
          copy.divideScalar(d);
          alignment.add(copy);
        }

        // AVOIDANCE
        if (d > 0 && d < AVOID_RADIUS) {
          const diff = boid.position.clone().sub(other.position);
          diff.normalize();
          diff.divideScalar(d);
          avoidance.add(diff);
        }

        // COHESION
        if (d > 0 && d < COHESION_RADIUS) {
          cohesion.add(other.position);
          totalCohesion++;
        }
      }

      // APPLY FORCES
      steering.add(limits);
      steering.add(wander);

      if (threeD) {
        steering.add(horizontalWander);
      }

      if (ALIGNEMENT) {
        alignment.normalize();
        alignment.multiplyScalar(ALIGN_STRENGTH);
        steering.add(alignment);
      }

      if (AVOIDANCE) {
        avoidance.normalize();
        avoidance.multiplyScalar(AVOID_STRENGTH);
        steering.add(avoidance);
      }

      if (COHESION && totalCohesion > 0) {
        cohesion.divideScalar(totalCohesion);
        cohesion.sub(boid.position);
        cohesion.normalize();
        cohesion.multiplyScalar(COHESION_STRENGTH);
        steering.add(cohesion);
      }

      steering.clampLength(0, MAX_STEERING * delta);
      boid.velocity.add(steering);
      boid.velocity.clampLength(
        0,
        remap(boid.scale, MIN_SCALE, MAX_SCALE, MAX_SPEED, MIN_SPEED) * delta
      );

      // APPLY VELOCITY
      boid.position.add(boid.velocity);
    }
  });

  return boids.map((boid, index) => (
    <Boid
      key={index + boid.model}
      boid={boid}
      wanderCircle={WANDER_CIRCLE}
      wanderRadius={WANDER_RADIUS / boid.scale}
      alignCircle={ALIGN_CIRCLE}
      alignRadius={ALIGN_RADIUS / boid.scale}
      avoidCircle={AVOID_CIRCLE}
      avoidRadius={AVOID_RADIUS / boid.scale}
      cohesionCircle={COHESION_CIRCLE}
      cohesionRadius={COHESION_RADIUS / boid.scale}
    />
  ));
};
