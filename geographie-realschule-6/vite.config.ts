import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import cell from "./cell.json" with { type: "json" };

// Served at https://academy.zam-os.org/geographie-realschule-6/; the
// single-file build also runs offline from the release zip.
export default defineConfig({
	base: "/geographie-realschule-6/",
	plugins: [viteSingleFile()],
	// Expose only the count. The review cards stay in the separate cell file.
	define: {
		__ZAM_CARD_COUNT__: JSON.stringify(
			cell.atoms.reduce((count, atom) => count + atom.practice_items.length, 0),
		),
	},
	server: {
		port: 5256,
		open: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		target: "es2022",
	},
});
