import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distIndex = resolve(root, "dist/index.html");
const zipPath = resolve(root, "release/ZAM-Academy-Englisch-Mittelschule-5.zip");

if (!existsSync(distIndex)) {
  throw new Error(`Missing ${distIndex}`);
}
if (!existsSync(zipPath)) {
  throw new Error(`Missing ${zipPath}`);
}

const html = readFileSync(distIndex, "utf8");
const forbiddenTags = [
  /<script[^>]+src=["']https?:/i,
  /<link[^>]+rel=["']stylesheet["'][^>]+href=["']https?:/i,
  /<iframe[^>]+src=["']https?:/i,
];
for (const pattern of forbiddenTags) {
  if (pattern.test(html)) {
    throw new Error(`External runtime request tag found in dist/index.html: ${pattern}`);
  }
}

const listing = execFileSync("unzip", ["-l", zipPath], { encoding: "utf8" });
for (const entry of ["index.html", "README.txt"]) {
  if (!listing.includes(entry)) {
    throw new Error(`Release ZIP missing expected entry: ${entry}`);
  }
}

console.log(`verify-release: ${zipPath} OK (single-file dist, 0 external script/css/iframe tags)`);
