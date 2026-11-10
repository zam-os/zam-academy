import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/physik-gymnasium-11/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
  base: "/physik-gymnasium-11/",
  plugins: [viteSingleFile()],
  server: {
    port: 5226,
    open: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
  },
});
