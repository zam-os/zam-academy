import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/gpg-mittelschule-5/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
  base: "/gpg-mittelschule-5/",
  plugins: [viteSingleFile()],
  server: {
    port: 5241,
    open: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
  },
});
