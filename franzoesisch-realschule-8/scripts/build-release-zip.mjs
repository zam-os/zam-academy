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
const bundleDirName = "ZAM-Academy-Franzoesisch-8";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(releaseRoot, "ZAM-Academy-Franzoesisch-8-offline.zip");
const appFile = "ZAM-Academy-Franzoesisch-8.html";

if (!existsSync(distHtml)) {
	throw new Error(
		`Missing built file at ${distHtml}. Please run "npm run build" first.`,
	);
}

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(bundleDir, { recursive: true });

copyFileSync(distHtml, join(bundleDir, appFile));

const winBat = [
	"@echo off",
	"title Französisch 8 Realschule · ZAM Academy",
	`start "" "%~dp0${appFile}"`,
	"",
].join("\r\n");
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

const readmeTxt = `ZAM ACADEMY · FRENCH 8 REALSCHULE · BAVARIA, IIIa

1. Extract this ZIP into a folder.
2. Open "${appFile}" in a modern browser, or use the included
   Windows, macOS or Linux launcher.

No installation, server or internet connection is needed for the lessons.
The teaching language is German with original French practice materials.
Progress and drafts stay in this browser. Some file:// browsers restrict
local storage; the app explains when saving is unavailable.

Level 1 counts towards core progress; Level 2 adds transfer practice.
The two relative-clause lessons are optional.
Listening uses only an already installed French voice. If none is available,
a partner can read the accessible transcript. Source links need internet.

The 84 linked ZAM cards are prepared in the source package's cell.json.
Pages publishes the app and cell together after the PR is merged.
No personal library or review history is modified by this offline app.
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
	cwd: releaseRoot,
});

console.log(`Created release package: ${zipFilePath}`);
