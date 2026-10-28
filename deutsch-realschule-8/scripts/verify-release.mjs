import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const name = "ZAM-Academy-Deutsch-8";
const zip = join(root, "release", `${name}-offline.zip`);
const html = readFileSync(join(root, "dist/index.html"));
assert.deepEqual(
	execFileSync("unzip", ["-p", zip, `${name}/${name}.html`]),
	html,
);
assert.doesNotMatch(
	html.toString(),
	/<script[^>]+src\s*=|<link[^>]+rel=["']stylesheet["']|@import\s|<img[^>]+src=["']https?:/i,
);
const entries = execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" })
	.trim()
	.split("\n");
for (const file of [
	`${name}.html`,
	"Start-Windows.bat",
	"Start-Mac.command",
	"start-linux.sh",
	"README-START.txt",
])
	assert.ok(entries.includes(`${name}/${file}`));
for (const starter of ["Start-Mac.command", "start-linux.sh"])
	execFileSync("sh", ["-n", join(root, "release", name, starter)]);
console.log(
	"ok: ZIP contains the exact self-contained HTML, all three starters and instructions; shell syntax passes.",
);
