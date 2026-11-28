import { execFileSync } from "node:child_process";
import { chmodSync, copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const distHtml = join(rootDir, "dist", "index.html");
const releaseRoot = join(rootDir, "release");
const bundleDirName = "ZAM-Academy-Wirtschaft-8-Mittelschule";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(releaseRoot, "ZAM-Academy-Wirtschaft-8-Mittelschule-offline.zip");
const appFile = "ZAM-Academy-Wirtschaft-8-Mittelschule.html";

if (!existsSync(distHtml)) {
  throw new Error(`Missing built file at ${distHtml}. Please run "npm run build" first.`);
}

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(bundleDir, { recursive: true });

copyFileSync(distHtml, join(bundleDir, appFile));

const winBat = [
  "@echo off",
  "title Wirtschaft und Beruf 8 Mittelschule · ZAM Academy",
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
ZAM ACADEMY · WIRTSCHAFT UND BERUF 8 MITTELSCHULE (LehrplanPLUS Bayern)
========================================================================

SOFORT-START OHNE INSTALLATION
1. Entpacke dieses ZIP-Archiv in einen beliebigen Ordner.
2. Starte die App per Doppelklick:
   - Windows: "Start-Windows.bat" oder "${appFile}"
   - macOS:   "${appFile}" oder "Start-Mac.command"
   - Linux:   "${appFile}" oder "./start-linux.sh"

Die App benötigt keine Installation, keinen Server und keine externe Verbindung.
Nur das Öffnen der verlinkten Quellen braucht eine Internetverbindung.
Fortschritt und eigene Texte bleiben ausschließlich in diesem Browser, sofern er lokales
Speichern erlaubt. Bei gesperrtem Speicher zeigt die App einen Hinweis.
Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls du es teilst,
lösche am Ende den Lernstand und alle eigenen Texte über „Fortschritt zurücksetzen“.

In der App wählst du links deine Klassenart / deinen Lernpfad:
- Regelklasse R8 (28 Lektionen, Lernbereiche 1 bis 5)
- M-Zug M8 (29 Lektionen, Lernbereiche 1 bis 5)

Oben bei den Aufgaben wechselst du zwischen:
- 1 · Mit Leitfragen und
- 2 · Übertragen.

Behalten mit ZAM: Die Zelle "Wirtschaft und Beruf 8 Mittelschule (ZAM Academy)"
ist im Academy-Katalog verfügbar. Jede Karte führt direkt zur passenden Lektion.
========================================================================
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
  cwd: releaseRoot,
});

console.log(`Created release package: ${zipFilePath}`);
