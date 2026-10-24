import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "/englisch-realschule-9/",
  plugins: [viteSingleFile()],
  server: { port: 5198, open: false },
  build: { target: "es2022", outDir: "dist", emptyOutDir: true },
});
