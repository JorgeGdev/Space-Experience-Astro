import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from '@astrojs/react';
import glsl from 'vite-plugin-glsl'; 
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-moon-landing.netlify.app/",
  integrations: [tailwind(), icon(), react()],
  vite: {
    plugins: [glsl()],
  },
});
