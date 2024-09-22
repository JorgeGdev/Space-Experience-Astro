// useBoidSettings.js
import { useControls } from 'leva';

export const useBoidSettings = () => {
  const generalSettings = useControls(
    'General Settings',
    {
      NB_BOIDS: { value: 100, min: 1, max: 200 },
      MIN_SCALE: { value: 0.3, min: 0.1, max: 2, step: 0.1 },
      MAX_SCALE: { value: 1.4, min: 0.1, max: 2, step: 0.1 },
      MIN_SPEED: { value: 0.9, min: 0.1, max: 10, step: 0.1 },
      MAX_SPEED: { value: 2.4, min: 0, max: 10, step: 0.1 },
      MAX_STEERING: { value: 0.1, min: 0, max: 1, step: 0.01 },
    },
    { collapsed: true }
  );

  const boidRules = useControls(
    'Boid Rules',
    {
      threeD: { value: true },
      ALIGNEMENT: { value: false },
      AVOIDANCE: { value: true },
      COHESION: { value: false },
    },
    { collapsed: true }
  );

  const wanderSettings = useControls(
    'Wander',
    {
      WANDER_CIRCLE: false,
      WANDER_RADIUS: { value: 5, min: 1, max: 10, step: 1 },
      WANDER_STRENGTH: { value: 2, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const alignmentSettings = useControls(
    'Alignment',
    {
      ALIGN_CIRCLE: false,
      ALIGN_RADIUS: { value: 1.2, min: 0, max: 10, step: 0.1 },
      ALIGN_STRENGTH: { value: 4, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const avoidanceSettings = useControls(
    'Avoidance',
    {
      AVOID_CIRCLE: false,
      AVOID_RADIUS: { value: 1.5, min: 0, max: 2 },
      AVOID_STRENGTH: { value: 2, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const cohesionSettings = useControls(
    'Cohesion',
    {
      COHESION_CIRCLE: false,
      COHESION_RADIUS: { value: 1.22, min: 0, max: 2 },
      COHESION_STRENGTH: { value: 4, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  return {
    ...generalSettings,
    ...boidRules,
    ...wanderSettings,
    ...alignmentSettings,
    ...avoidanceSettings,
    ...cohesionSettings,
  };
};
