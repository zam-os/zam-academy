import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const name = "ZAM-Academy-Geographie-8";
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
for (const starter of ["Start-Mac.command", "start-linux.sh"]) {
	const path = join(root, "release", name, starter);
	const source = readFileSync(path, "utf8");
	assert.ok(source.startsWith("#!/bin/sh\n"));
	assert.ok(source.split("\n").length >= 4, "starter must contain real lines");
	assert.doesNotMatch(source, /\\[nr]/, "no literal backslash-newline escapes");
	assert.match(source, /DIR=/);
	execFileSync("sh", ["-n", path]);
}
const windows = readFileSync(
	join(root, "release", name, "Start-Windows.bat"),
	"utf8",
);
assert.ok(windows.startsWith('@echo off\r\nstart "" '));
assert.ok(windows.endsWith("\r\n"));
assert.doesNotMatch(windows, /\\[nr]/);
for (const starter of [
	"Start-Windows.bat",
	"Start-Mac.command",
	"start-linux.sh",
]) {
	assert.deepEqual(
		execFileSync("unzip", ["-p", zip, `${name}/${starter}`]),
		readFileSync(join(root, "release", name, starter)),
		"ZIP must contain the exact verified starter bytes",
	);
}
console.log(
	"ok: ZIP contains the exact self-contained HTML, all three starters and instructions; shell syntax passes.",
);
