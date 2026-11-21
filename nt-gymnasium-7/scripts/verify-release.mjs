import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const name = "ZAM-Academy-Natur-und-Technik-7";
const zip = join(root, "release", `${name}-offline.zip`);
for (const path of ["index.html", "physik/index.html"]) {
  const html = readFileSync(join(root, "dist", path));
  assert.deepEqual(execFileSync("unzip", ["-p", zip, `${name}/${path}`]), html);
  assert.doesNotMatch(
    html.toString(),
    /<script[^>]+src\s*=|<link[^>]+rel=["']stylesheet["']|@import\s|<img[^>]+src=["']https?:/i,
  );
  if (path.startsWith("physik/")) assert.match(html.toString(), /href="\.\.\/index\.html"/);
}
const entries = execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" })
  .trim()
  .split("\n");
for (const file of [
  "index.html",
  "physik/index.html",
  "Start-Windows.bat",
  "Start-Mac.command",
  "start-linux.sh",
  "README-START.txt",
])
  assert.ok(entries.includes(`${name}/${file}`));
for (const starter of ["Start-Mac.command", "start-linux.sh"])
  execFileSync("sh", ["-n", join(root, "release", name, starter)]);
console.log(
  "ok: ZIP contains the exact self-contained course and Physics pages, three launchers and instructions; shell syntax passes.",
);
