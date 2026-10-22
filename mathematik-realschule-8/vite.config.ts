import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/mathematik-realschule-8/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
  base: "/mathematik-realschule-8/",
  plugins: [viteSingleFile()],
  server: {
    port: 5193,
    open: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
  },
});
