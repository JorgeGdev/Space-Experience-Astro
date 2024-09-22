import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useAtom } from "jotai";
import { Suspense } from "react";
import { themeAtom, THEMES, UI } from "./UI";
import { BoidsExperience } from "./BoidsExperience";

export default function BoidsModel() {
  const [theme] = useAtom(themeAtom);
  return (
    <>
      <UI />
      <Loader />
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 50 }}>
        <color attach="background" args={[THEMES[theme].skyColor]} />
        <fog attach="fog" args={[THEMES[theme].skyColor, 12, 20]} />
        <Suspense fallback={null}>
          <BoidsExperience />
        </Suspense>
      </Canvas>
    </>
  );
}


