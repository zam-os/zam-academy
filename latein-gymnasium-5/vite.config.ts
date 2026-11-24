import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/latein-gymnasium-5/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
	base: "/latein-gymnasium-5/",
	plugins: [viteSingleFile()],
	server: {
		port: 5280,
		strictPort: true,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		target: "es2022",
	},
});
