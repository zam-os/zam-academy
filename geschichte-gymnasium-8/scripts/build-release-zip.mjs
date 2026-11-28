import { execFileSync } from "node:child_process";
import { chmodSync, copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const distHtml = join(rootDir, "dist", "index.html");
const releaseRoot = join(rootDir, "release");
const bundleDirName = "ZAM-Academy-Geschichte-8-Gymnasium";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(releaseRoot, "ZAM-Academy-Geschichte-8-Gymnasium-offline.zip");
const appFile = "ZAM-Academy-Geschichte-8-Gymnasium.html";

if (!existsSync(distHtml)) {
  throw new Error(`Missing built file at ${distHtml}. Please run "npm run build" first.`);
}

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(bundleDir, { recursive: true });

copyFileSync(distHtml, join(bundleDir, appFile));
copyFileSync(join(rootDir, "cell.json"), join(bundleDir, "geschichte-gymnasium-8-cell.json"));

const winBat = [
  "@echo off",
  "title Geschichte 8 Gymnasium · ZAM Academy",
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
ZAM ACADEMY · GESCHICHTE 8 GYMNASIUM (LehrplanPLUS Bayern)
========================================================================

SOFORT-START OHNE INSTALLATION
1. Entpacke dieses ZIP-Archiv in einen beliebigen Ordner.
2. Starte die App per Doppelklick:
   - Windows: "Start-Windows.bat" oder "${appFile}"
   - macOS:   "${appFile}" oder "Start-Mac.command"
   - Linux:   "${appFile}" oder "./start-linux.sh"

Keine Installation, kein Server und kein Internet erforderlich.
Dein Fortschritt bleibt im Browser gespeichert.

Oben in der App wechselst du zwischen
- 🌱 Level 1 (geführt: Leitfragen helfen) und
- 🦅 Level 2 (Transfer: selbständig begründen).

Die Datei "geschichte-gymnasium-8-cell.json" enthält die Lernkarten zum Paket.
Jede Karte ist mit ihrer Lektion verknüpft.
========================================================================
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], { cwd: releaseRoot });

console.log(`Created release package: ${zipFilePath}`);
