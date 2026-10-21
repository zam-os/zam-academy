import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
export default defineConfig({
	base: "/algorithmen/",
	plugins: [viteSingleFile()],
	server: { port: 5189, open: false },
	build: { target: "es2022", outDir: "dist", emptyOutDir: true },
});
