import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const name = "ZAM-Forscherbuch-HSU-4";
const zip = join(root, "release", `${name}-offline.zip`);
const html = readFileSync(join(root, "dist/index.html"));

assert.deepEqual(
	execFileSync("unzip", ["-p", zip, `${name}/index.html`]),
	html,
);

const homeLink =
	/<a class="zam-home-link" href="https:\/\/academy\.zam-os\.org\/">Zur ZAM Academy<\/a>/;
assert.match(html.toString("utf8"), homeLink);

// Strip the intentional plain outbound home link and any textual https:// references inside JSON/text; check zero external asset loads.
const stripped = html.toString("utf8").replace(homeLink, "");
assert.doesNotMatch(
	stripped,
	/<script[^>]+src\s*=|<link[^>]+rel=["']stylesheet["']|@import\s|(?:src|href)=["']https?:/i,
);

const entries = execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" })
	.trim()
	.split("\n");
for (const file of [
	"index.html",
	"Start-Windows.bat",
	"Start-Mac.command",
	"start-linux.sh",
	"README-START.txt",
]) {
	assert.ok(entries.includes(`${name}/${file}`), `Missing ${file} in offline ZIP`);
}

if (process.platform !== "win32") {
	for (const file of ["Start-Mac.command", "start-linux.sh"]) {
		execFileSync("sh", ["-n", join(root, "release", name, file)]);
	}
}

console.log(
	"Offline package verified: single-file HTML, OS launchers, zero external asset requests, and ZAM Academy home link.",
);
