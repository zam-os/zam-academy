import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "/informatik-realschule-10/",
  plugins: [viteSingleFile()],
  server: { port: 5200, open: false },
  build: { target: "es2022", outDir: "dist", emptyOutDir: true },
});
