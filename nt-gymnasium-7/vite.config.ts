import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/nt-gymnasium-7/; the
// single-file build also runs offline from the release zip.
export default defineConfig(({ mode }) => ({
  base: "/nt-gymnasium-7/",
  // The Physics copy generated into public/ is for local and offline use.
  publicDir: mode === "academy" ? false : "public",
  plugins: [viteSingleFile()],
  server: {
    port: 5269,
    open: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
  },
}));
