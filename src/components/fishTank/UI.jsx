import { useFont, useGLTF } from "@react-three/drei";
import { atom, useAtom } from "jotai";

export const themeAtom = atom("underwater");

export const THEMES = {
  underwater: {
    key: "underwater",
    skyColor: "#000000",
    sunColor: "#F7CD22",
    groundColor: "#3034FF", // Esto se puede dejar como fallback si no hay textura
    groundTexture: "/images/foto1.jpg", // Nueva propiedad de textura
    title: "Underwater",
    subtitle: "World",
    models: [`Ufo_01`, `Ufo_satellite`, `Ufo_astro1`, `Ufo_04`],
    dof: true,
    useStars: true, // No usar estrellas en este tema
  },
  space: {
    key: "space",
    skyColor: "#000000",
    sunColor: "#e1ae4e",
    groundColor: "#333333",
    groundTexture: "/images/foto1.jpg", // Textura para el suelo en el tema 'space'
    title: "Space",
    subtitle: "World",
    models: [`Ufo_07`, `Ufo_06`, `Ufo_05`],
    dof: false,
    useStars: true, // Usar estrellas en este tema
  },
};



Object.values(THEMES).forEach((theme) => {
  theme.models.forEach((model) => useGLTF.preload(`/models/${model}.glb`));
});

useFont.preload("/fonts/Poppins Black_Regular.json");

export const UI = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <>
      <main className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-center items-center flex-col">
        <a
          className="pointer-events-auto absolute top-10 left-10"
          href="https://www.jorgegdev.com/"
        >
          <img className="w-20" src="/images/logoJorge.png" />
        </a>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(0,0,0,0.0)_70%,rgba(0,0,0,1)_170%)]" />
        <div className="absolute z-10 pointer-events-auto flex flex-col items-center justify-center bottom-0 w-screen p-10 gap-2">
          
          
        </div>
      </main>
    </>
  );
};
