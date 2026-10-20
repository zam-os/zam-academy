import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/sql/; the single-file build also runs
// offline from the release zip. The SQLite engine (sql.js, WebAssembly) is
// inlined into the page as a data URL by the single-file plugin.
export default defineConfig({
  base: "/sql/",
  plugins: [viteSingleFile()],
  server: {
    port: 5182,
    open: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
    chunkSizeWarningLimit: 2000,
  },
});
