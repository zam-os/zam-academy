import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root)));
const grade = Number(pkg.name.match(/-(\d+)$/)[1]);
const folder = `ZAM-Academy-Mathematik-${grade}-Mittelschule`;
const app = `${folder}.html`;
const zip = new URL(`release/${folder}-offline.zip`, root);
const html = readFileSync(new URL("dist/index.html", root), "utf8");
assert.ok(html.includes(`Mathematik ${grade} Mittelschule`));
assert.ok(
  !/<script\b[^>]*\bsrc\s*=/i.test(html),
  "offline scripts must be inline",
);
assert.ok(
  !/<link\b[^>]*\brel="stylesheet"/i.test(html),
  "offline styles must be inline",
);
assert.ok(!/<(?:iframe|video)\b/i.test(html), "no third-party media player");
const files = execFileSync("unzip", ["-Z1", zip.pathname], { encoding: "utf8" })
  .trim()
  .split("\n");
for (const file of [
  app,
  "README-START.txt",
  "Start-Windows.bat",
  "Start-Mac.command",
  "start-linux.sh",
])
  assert.ok(files.includes(`${folder}/${file}`), file);
const packed = execFileSync("unzip", ["-p", zip.pathname, `${folder}/${app}`], {
  encoding: "utf8",
});
assert.equal(packed, html, "the ZIP must contain the current build");
console.log(
  `Verified self-contained HTML and ${zip.pathname.split("/").pop()}.`,
);
