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
const bundleDirName = "ZAM-Academy-Physik-7";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(releaseRoot, "ZAM-Academy-Physik-7-offline.zip");
const appFile = "ZAM-Academy-Physik-7.html";

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
  "title Physik 7 Realschule · ZAM Academy",
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

const readmeTxt = `ZAM ACADEMY - PHYSICS 7 REALSCHULE, GROUP I (BAVARIA)

Unzip this archive and open ${appFile} in your browser.
Windows: Start-Windows.bat
macOS: open the HTML file or Start-Mac.command
Linux: open the HTML file or run start-linux.sh

The German-language app works offline without an account or installation.
Progress, written answers and experiment notes stay in this browser, when
local storage is available. The app shows a notice if saving is blocked.
External source links require an internet connection and open only on click.

24 lessons cover mechanics, optics, magnetism and simple circuits.
Level 1 provides guidance; Level 2 changes the task and context.
Numeric lessons require three independently solved tasks at each level.
Written work is explicitly self-assessed, never automatically graded.
Five real experiments must take place under classroom guidance, with at
least one in each area. Model use and completed notes do not verify them.

The ZAM cell contains 73 cards linked to the lessons. Taking it into ZAM
requires the separately published Academy cell; app progress is not imported.
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
  cwd: releaseRoot,
});

console.log(`Created release package: ${zipFilePath}`);
