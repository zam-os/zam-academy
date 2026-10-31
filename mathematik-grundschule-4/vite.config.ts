import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
	base: "./",
	plugins: [viteSingleFile()],
	server: { host: "127.0.0.1", port: 5216, strictPort: true, open: false },
	build: { outDir: "dist", emptyOutDir: true, target: "es2022" },
});
