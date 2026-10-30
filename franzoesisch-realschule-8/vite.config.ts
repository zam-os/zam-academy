import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/franzoesisch-realschule-8/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
	base: "/franzoesisch-realschule-8/",
	plugins: [viteSingleFile()],
	server: {
		port: 5215,
		strictPort: true,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		target: "es2022",
	},
});
