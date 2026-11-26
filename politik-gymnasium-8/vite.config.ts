import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/politik-gymnasium-8/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
  base: "/politik-gymnasium-8/",
  plugins: [viteSingleFile()],
  server: {
    port: 5292,
    open: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
  },
});
