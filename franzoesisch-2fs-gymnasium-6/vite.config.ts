import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/franzoesisch-2fs-gymnasium-6/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
	base: "/franzoesisch-2fs-gymnasium-6/",
	plugins: [viteSingleFile()],
	server: {
		port: 5282,
		strictPort: true,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		target: "es2022",
	},
});
