import {
  Center,
  Environment,
  Float,
  OrbitControls,
  SoftShadows,
  Stars,
  useTexture,
} from "@react-three/drei";
import { useAtom } from "jotai";
import { Boids } from "./Boids";
import { themeAtom, THEMES } from "./UI";
import { Leva, useControls } from "leva";
import * as THREE from "three"; // Importamos todo el objeto THREE
import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber"; // Importamos useFrame para manejar la animación
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  GodRays,
} from "@react-three/postprocessing";
import { degToRad } from "three/src/math/MathUtils.js";
import Portal from "./Portal";
import "./BoidsExperience.css";

export const BoidsExperience = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false); // Control del overlay
  const overlayMaterialRef = useRef(); // Referencia al material para actualizarlo
  const overlayMeshRef = useRef(); // Referencia al mesh para aplicar la rotación

  // Cargar la textura del overlay
  const overlayTexture = useTexture('/images/overlay.jpg');

  // Aplicar espacio de color sRGB y filtro para mejorar la calidad
  overlayTexture.colorSpace = THREE.SRGBColorSpace; // Aplicar SRGBColorSpace
  overlayTexture.minFilter = THREE.LinearFilter; // Usar LinearFilter para evitar pérdida de calidad

  // Crear una referencia al audio
  const audio = new Audio('/images/audio1.mp3');  // Ruta al archivo mp3

  const boundaries = useControls(
    "Boundaries",
    {
      debug: false,
      x: { value: 12, min: 0, max: 40 },
      y: { value: 8, min: 0, max: 40 },
      z: { value: 20, min: 0, max: 40 },
    },
    { collapsed: true }
  );

  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  const scaleX = Math.max(0.5, size[0] / 1920);
  const scaleY = Math.max(0.5, size[1] / 1080);
  const responsiveBoundaries = {
    x: boundaries.x * scaleX,
    y: boundaries.y * scaleY,
    z: boundaries.z,
  };

  useEffect(() => {
    let timeOut;
    function updateSize() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        setSize([window.innerWidth, window.innerHeight]);
      }, 50);
    }

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const [sunRef, setSunRef] = useState();

  const { focusRange, focusDistance, focalLength, bokehScale } = useControls(
    "Depth of Field",
    {
      focusRange: { value: 15.1, min: 0, max: 20, step: 0.01 },
      focusDistance: { value: 0.36, min: 0, max: 1, step: 0.01 },
      focalLength: { value: 0.76, min: 0, max: 1, step: 0.01 },
      bokehScale: { value: 1.2, min: 0, max: 10, step: 0.1 },
    },
    { collapsed: true }
  );

  // Cargar la textura del suelo según el tema
  const groundTexture = useTexture(THEMES[theme].groundTexture);

  // Función para manejar el doble clic en el portal y la transición del tema
  const handleDoubleClick = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setOverlayVisible(true); // Mostrar el overlay

      // Reproducir el audio cuando inicia la transición
      audio.play();

      let progressValue = 0;

      const interval = setInterval(() => {
        progressValue += 0.05;
        if (progressValue >= 1) {
          setTheme((prevTheme) =>
            prevTheme === "underwater" ? "space" : "underwater"
          );
          setProgress(0); // Reset del progreso después de la transición
          clearInterval(interval);
          setIsTransitioning(false);

          // Ocultar el overlay después de 500ms
          setTimeout(() => {
            setOverlayVisible(false); // Aquí se desaparece por completo
          }, 500);
        } else {
          setProgress(progressValue);
        }
      }, 100);
    }
  };

  useEffect(() => {
    // Marcar el material como necesita actualización cuando se cambia la textura
    if (overlayMaterialRef.current) {
      overlayMaterialRef.current.needsUpdate = true;
    }
  }, [overlayTexture]);

  // Usamos useFrame para hacer girar el overlay en el eje X
  useFrame(() => {
    if (overlayVisible && overlayMeshRef.current) {
      overlayMeshRef.current.rotation.z += 0.2; // Incrementar la rotación en el eje y
    }
  });

  return (
    <>
      <OrbitControls enableZoom={false} />
      <Leva hidden />

      {THEMES[theme].useStars && (
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      )}

      <Boids boundaries={responsiveBoundaries} />

      <mesh visible={boundaries.debug}>
        <boxGeometry
          args={[
            responsiveBoundaries.x,
            responsiveBoundaries.y,
            responsiveBoundaries.z,
          ]}
        />
        <meshStandardMaterial
          color={"orange"}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Aplicar textura al suelo */}
      <mesh
        position-y={-responsiveBoundaries.y / 2}
        rotation-x={-Math.PI / 2}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={groundTexture} />
      </mesh>

      {/* LUCES */}
      <SoftShadows size={15} focus={1.5} samples={12} />
      <Environment preset="sunset"></Environment>
      <directionalLight
        position={[15, 15, 15]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-far={300}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
      />
      <hemisphereLight
        intensity={1.35}
        color={THEMES[theme].skyColor}
        groundColor={THEMES[theme].groundColor}
      />

      <mesh
        ref={setSunRef}
        position-y={responsiveBoundaries.y / 4}
        position-z={-10}
        rotation-x={degToRad(70)}
      >
        <circleGeometry args={[12, 64]} />
        <meshBasicMaterial
          depthWrite={false}
          color={THEMES[theme].sunColor}
          transparent
          opacity={1}
        />
      </mesh>

      {/* MODELOS FLOTANTES SEGÚN EL TEMA */}
      <group key={theme + scaleX}>
        {/* Primer objeto flotante para el tema 'underwater' */}
        <Float
          floatIntensity={5}
          rotationIntensity={theme === "underwater" ? 2 : 0}
        >
          <Center>
            {theme === "underwater" && (
              <Portal scale={3.5} onDoubleClick={handleDoubleClick} progress={progress} />
            )}
          </Center>
        </Float>

        {/* Segundo objeto flotante para el tema 'space' */}
        <Float
          speed={3}
          floatIntensity={5}
          rotationIntensity={theme === "space" ? 2 : 0}
        >
          <Center>
            {theme === "space" && (
              <Portal scale={3.5} onDoubleClick={handleDoubleClick} progress={progress} />
            )}
          </Center>
        </Float>
      </group>

      {/* POSTPROCESADO */}
      <EffectComposer>
        {THEMES[theme].dof && (
          <DepthOfField
            target={[0, 0, 0]} // donde enfocar
            worldFocusRange={focusRange} // rango de desenfoque
            worldFocusDistance={focusDistance} // distancia de enfoque
            focalLength={focalLength} // longitud focal
            bokehScale={bokehScale} // tamaño del bokeh
          />
        )}
        {sunRef && <GodRays sun={sunRef} exposure={0.34} decay={0.89} blur />}
        <Bloom luminanceThreshold={1.5} intensity={0.4} mipmapBlur />
      </EffectComposer>

      {/* Overlay solo durante la transición */}
      {overlayVisible && (
        <mesh ref={overlayMeshRef} position={[0, 0, 2]} scale={[8, 8, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={overlayMaterialRef}
            map={overlayTexture}
            transparent
            opacity={1}
          />
        </mesh>
      )}
    </>
  );
};
