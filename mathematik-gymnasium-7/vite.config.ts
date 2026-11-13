import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/mathematik-gymnasium-7/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
  base: "/mathematik-gymnasium-7/",
  plugins: [viteSingleFile()],
  server: {
    port: 5242,
    open: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
  },
});
