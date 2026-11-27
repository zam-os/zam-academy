import { fileURLToPath } from "node:url";
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = fileURLToPath(new URL("../../physik-gymnasium-7/", import.meta.url));
const outDir = fileURLToPath(new URL("../public/physik/", import.meta.url));

// Build the existing app with the same entry point and storage keys. The
// course adds a return link to the copy used for local and offline browsing.
await build({
  root,
  configFile: false,
  publicDir: false,
  base: "./",
  plugins: [
    {
      name: "natur-und-technik-return-link",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          const header = /<header class="header">/;
          if (!header.test(html)) throw new Error("Missing Physics header for the course return link.");
          return html.replace(
            header,
            '$&<a href="../index.html" class="button">← Natur und Technik 7</a>',
          );
        },
      },
    },
    viteSingleFile(),
  ],
  build: { outDir, emptyOutDir: true, target: "es2022" },
});
