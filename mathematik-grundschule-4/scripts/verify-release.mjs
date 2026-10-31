import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const name = "ZAM-Entdeckerinsel-Mathematik-4";
const zip = join(root, "release", `${name}-offline.zip`);
const html = readFileSync(join(root, "dist/index.html"));
assert.deepEqual(
	execFileSync("unzip", ["-p", zip, `${name}/index.html`]),
	html,
);
// An explicit outbound home link loads nothing until a learner clicks it.
const homeLink =
	/<a class="zam-home-link" href="https:\/\/academy\.zam-os\.org\/">Zur ZAM Academy<\/a>/;
assert.match(html.toString(), homeLink);
assert.doesNotMatch(
	html.toString().replace(homeLink, ""),
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
	"media-register.json",
])
	assert.ok(entries.includes(`${name}/${file}`), file);
for (const file of ["Start-Mac.command", "start-linux.sh"])
	execFileSync("sh", ["-n", join(root, "release", name, file)]);
const register = JSON.parse(
	readFileSync(join(root, "media-register.json"), "utf8"),
);
assert.deepEqual(
	JSON.parse(
		execFileSync("unzip", ["-p", zip, `${name}/media-register.json`], {
			encoding: "utf8",
		}),
	),
	register,
);
if (register.status === "approved") {
	assert.ok(
		register.teacher && register.reviewed_at && register.permission_reference,
	);
	assert.ok(register.online_distribution && register.offline_distribution);
	assert.equal(register.timings_are_draft, false);
	for (const key of ["video", "captions", "poster", "transcript"]) {
		const asset = register[key];
		assert.ok(
			asset && /^media\/[a-z0-9-]+\.(mp4|vtt|webp|txt)$/.test(asset.path),
			`${key}: bounded relative media path`,
		);
		const bytes = readFileSync(join(root, "dist", asset.path));
		assert.equal(
			createHash("sha256").update(bytes).digest("hex"),
			asset.sha256,
		);
		if (key === "captions" || key === "transcript")
			assert.equal(
				asset.text,
				bytes.toString("utf8"),
				`${key} embedded offline text matches its file`,
			);
		assert.deepEqual(
			execFileSync("unzip", ["-p", zip, `${name}/${asset.path}`]),
			bytes,
		);
	}
	assert.match(
		readFileSync(join(root, "dist", register.captions.path), "utf8"),
		/^WEBVTT/,
	);
	assert.ok(
		register.chapters.every((c) => Number.isFinite(c.start) && c.start >= 0),
	);
} else {
	assert.equal(register.status, "awaiting-recording");
	assert.equal(register.video, null);
	assert.equal(
		existsSync(join(root, "dist/media/place-value-teacher.mp4")),
		false,
	);
	assert.match(html.toString(), /Das Lehrervideo kommt noch/);
	console.log(
		"Recording and teacher approval pending: this ZIP is a draft, not completed Phase 1.",
	);
}
if (process.argv.includes("--complete")) {
	assert.equal(
		register.status,
		"approved",
		"Phase 1 requires the real teacher recording and rights metadata.",
	);
	const acceptance = JSON.parse(
		readFileSync(join(root, "acceptance.json"), "utf8"),
	);
	assert.equal(
		acceptance.teacher_review.status,
		"approved",
		"Teacher content review is required.",
	);
	assert.equal(
		acceptance.offline_video_playback.status,
		"passed",
		"Real offline playback must be observed.",
	);
}
console.log(
	"Offline package verified: exact HTML, launchers, relative assets and truthful media status.",
);
