import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./", // 👈 esto asegura que cargue bien en producción
  build: {
    outDir: "dist", // 👈 Vercel usará esta carpeta
  },
});