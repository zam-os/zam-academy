import { defineConfig } from "vitest/config";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/franzoesisch-realschule-9/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
  base: "/franzoesisch-realschule-9/",
  plugins: [viteSingleFile()],
  server: {
    port: 5198,
    open: false,
  },
  // The jsdom file starts slowly; with five workers at once it can miss the start timeout.
  test: { fileParallelism: false },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
  },
});
