import { execFileSync } from "node:child_process";
import { chmodSync, copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const distHtml = join(rootDir, "dist", "index.html");
const releaseRoot = join(rootDir, "release");
const bundleDirName = "ZAM-Academy-Informatik-8";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(releaseRoot, "ZAM-Academy-Informatik-8-offline.zip");
const appFile = "ZAM-Academy-Informatik-8.html";

if (!existsSync(distHtml)) {
  throw new Error(`Missing built file at ${distHtml}. Please run "npm run build" first.`);
}

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(bundleDir, { recursive: true });

copyFileSync(distHtml, join(bundleDir, appFile));

const winBat = [
  "@echo off",
  "title Informatik 6–8 Realschule · ZAM Academy",
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

const readmeTxt = `========================================================================
ZAM ACADEMY · INFORMATICS 6–8 REALSCHULE (BAVARIA)
========================================================================

One shared course for Grades 6, 7 and 8: the same 40 lessons and 87 ZAM cards.
Your school chooses when to teach each introductory IT module (1.1–1.9).

START WITHOUT INSTALLATION
1. Extract this ZIP archive to a folder.
2. Open the app with a double click:
   - Windows: "Start-Windows.bat" or "${appFile}"
   - macOS:   "${appFile}" or "Start-Mac.command"
   - Linux:   "${appFile}" or "./start-linux.sh"

No installation, server or internet connection is required.
Learner content is in German. Progress stays in this browser.

Switch levels at the top:
- Level 1: guided tasks with hints and intermediate steps
- Level 2: transfer tasks in new contexts

The same ZAM cell serves all three grades. Its existing title remains
"Informatik 8 Realschule (ZAM Academy)"; each card links to its lesson.
========================================================================
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], { cwd: releaseRoot });

console.log(`Created release package: ${zipFilePath}`);
