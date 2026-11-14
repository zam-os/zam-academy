import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/chemie-mittelschule-6/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
	base: "/chemie-mittelschule-6/",
	plugins: [viteSingleFile()],
	server: {
		port: 5247,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		target: "es2022",
	},
});
