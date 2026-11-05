/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Served at https://academy.zam-os.org/deutsch-grundschule-4/ once released;
// the single-file build also runs offline from the release zip.
export default defineConfig({
	base: "/deutsch-grundschule-4/",
	plugins: [viteSingleFile()],
	// Tests read the stylesheet to check the contrast of the station colours.
	test: { css: true },
	server: {
		port: 5217,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		target: "es2022",
	},
});
