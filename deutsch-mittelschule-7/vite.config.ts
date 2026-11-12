import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/deutsch-mittelschule-7/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
	base: "/deutsch-mittelschule-7/",
	plugins: [viteSingleFile()],
	server: {
		port: 5232,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		target: "es2022",
	},
});
