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
const bundleDirName = "ZAM-Academy-Mathematik-8";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(releaseRoot, "ZAM-Academy-Mathematik-8-offline.zip");
const appFile = "ZAM-Academy-Mathematik-8.html";

if (!existsSync(distHtml)) {
  throw new Error(`Missing built file at ${distHtml}. Please run "npm run build" first.`);
}

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(bundleDir, { recursive: true });

copyFileSync(distHtml, join(bundleDir, appFile));

const winBat = [
  "@echo off",
  "title Mathematik 8 Realschule · ZAM Academy",
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

const readme = [
  "ZAM Academy · Mathematik 8 Realschule (Offline)",
  "===============================================",
  "",
  "Dieses Paket enthält die vollständige interaktive Lern-App für Mathematik 8 Realschule",
  "(LehrplanPLUS Bayern, Zweig I und II/III: Dreiecke und Vierecke, Drehung, Raumgeometrie,",
  "Terme und Gleichungen, Bruchterme, Funktionen, Daten und Zufall).",
  "",
  "Starten:",
  "- Windows: Doppelklick auf Start-Windows.bat",
  "- macOS:   Doppelklick auf Start-Mac.command (beim ersten Mal eventuell via Rechtsklick > Öffnen)",
  "- Linux:   start-linux.sh ausführen oder ZAM-Academy-Mathematik-8.html im Browser öffnen",
  "",
  "Kein Internet erforderlich. Fortschritt wird lokal im Browser gespeichert.",
].join("\n");
writeFileSync(join(bundleDir, "README-START.txt"), readme, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
  cwd: releaseRoot,
});
console.log(`Created release bundle at ${zipFilePath}`);
