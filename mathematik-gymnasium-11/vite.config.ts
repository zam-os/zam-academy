/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/mathematik-gymnasium-11/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
  base: "/mathematik-gymnasium-11/",
  plugins: [viteSingleFile()],
  server: {
    port: 5224,
    open: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
  },
  // 28 labs walked on their grids and thousands of generated tasks: far
  // beyond vitest's 5 s default when the test files run side by side.
  test: {
    testTimeout: 120_000,
  },
});
