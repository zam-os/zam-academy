import { execFileSync } from "node:child_process";
import {
	chmodSync,
	copyFileSync,
	existsSync,
	mkdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const distHtml = join(rootDir, "dist", "index.html");
const releaseRoot = join(rootDir, "release");
const bundleDirName = "ZAM-Academy-Biologie-6";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(releaseRoot, "ZAM-Academy-Biologie-6-offline.zip");
const appFile = "ZAM-Academy-Biologie-6.html";

if (!existsSync(distHtml)) {
	throw new Error(
		`Missing built file at ${distHtml}. Please run "npm run build" first.`,
	);
}

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(bundleDir, { recursive: true });

copyFileSync(distHtml, join(bundleDir, appFile));

const winBat = ["@echo off", `start "" "%~dp0${appFile}"`, ""].join("\r\n");
writeFileSync(join(bundleDir, "Start-Windows.bat"), winBat, "utf8");

const macCommand = [
	"#!/bin/sh",
	'DIR="$(cd "$(dirname "$0")" && pwd)"',
	`open "$DIR/${appFile}"`,
	"",
].join("\n");
const macCommandPath = join(bundleDir, "Start-Mac.command");
writeFileSync(macCommandPath, macCommand, "utf8");
chmodSync(macCommandPath, 0o755);

const linuxSh = [
	"#!/bin/sh",
	'DIR="$(cd "$(dirname "$0")" && pwd)"',
	"if command -v xdg-open >/dev/null 2>&1; then",
	`  xdg-open "$DIR/${appFile}"`,
	"elif command -v gio >/dev/null 2>&1; then",
	`  gio open "$DIR/${appFile}"`,
	"else",
	`  echo "Open $DIR/${appFile} in your web browser."`,
	"fi",
	"",
].join("\n");
const linuxShPath = join(bundleDir, "start-linux.sh");
writeFileSync(linuxShPath, linuxSh, "utf8");
chmodSync(linuxShPath, 0o755);

const readmeTxt = `ZAM ACADEMY · GRADE 6 BIOLOGY · BAVARIAN REALSCHULE

Local draft: teacher review and teacher videos are still open.

Unzip this archive. Open ${appFile} in a modern browser, or use the launcher:
Windows: Start-Windows.bat
macOS: Start-Mac.command
Linux: start-linux.sh

The complete training app works offline without installation or an account.
It includes 30 lessons, two exercise levels, workshops, four qualitative
visual models, a reference view and a field notebook. Progress and notes stay
in this browser. If local storage is unavailable, the app shows a notice.
External reference links open only when clicked and require internet access.
Practical investigations, presentations and classroom discussion take place
outside the app. Written answers are self-assessed against explicit criteria.

The companion ZAM cell contains 60 cards. It is stored separately as cell.json
in the source package. This local draft is excluded from the public catalog.
Publication and any transfer of existing learning histories are separate steps.
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
	cwd: releaseRoot,
});

console.log(`Created release package: ${zipFilePath}`);
