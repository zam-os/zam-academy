import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/biologie-realschule-8/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
	base: "/biologie-realschule-8/",
	plugins: [viteSingleFile()],
	server: {
		port: 5208,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		target: "es2022",
	},
});
