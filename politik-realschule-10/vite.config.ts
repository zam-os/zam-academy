import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/politik-realschule-10/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
	base: "/politik-realschule-10/",
	plugins: [viteSingleFile()],
	server: {
		port: 5206,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		target: "es2022",
	},
});
