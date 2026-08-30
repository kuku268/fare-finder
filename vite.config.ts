import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Plain Vite SPA: `vite build` emits a fully static bundle into dist/.
// Deep links are served by the host's SPA fallback (see vercel.json).
export default defineConfig({
  plugins: [react(), tailwindcss(), tsConfigPaths()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  server: {
    host: true,
    port: 8080,
  },
  preview: {
    host: true,
    port: 8080,
  },
});
