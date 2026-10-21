import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
export default defineConfig({
	base: "/datennetze/",
	plugins: [viteSingleFile()],
	server: { port: 5190, open: false },
	build: { outDir: "dist", emptyOutDir: true, target: "es2022" },
});
