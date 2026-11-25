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
const bundleDirName = "ZAM-Academy-Latein-Gymnasium-5";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(
	releaseRoot,
	"ZAM-Academy-Latein-Gymnasium-5-offline.zip",
);
const appFile = "ZAM-Academy-Latein-Gymnasium-5.html";

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
	"title Latein 5 Gymnasium · ZAM Academy",
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

const readmeTxt = `ZAM ACADEMY · LATEIN 5 GYMNASIUM · BAYERN (1. FREMDSPRACHE)

1. Entpacke diese ZIP-Datei in einen Ordner.
2. Öffne "${appFile}" in einem aktuellen Browser oder nutze den
   Starter für Windows, macOS oder Linux.

Die 44 Lektionen, alle Schaubilder und die Werkstätten laufen vollständig
offline ohne Server oder Internetverbindung. Externe Quellenlinks benötigen
Internet.

Fortschritt und eigene Entwürfe bleiben lokal in diesem Browser (localStorage).
Falls mehrere Lernende ein Gerät oder Benutzerkonto teilen, lösche am Ende
Lernstand und Entwürfe über „Lokalen Fortschritt zurücksetzen“.

Die Vorlesehilfe nutzt ausschließlich eine bereits installierte Stimme deines
Geräts; ohne installierte Stimme kannst du die markierten Texte gemeinsam
mit einem Partner lesen.

Die 132 verknüpften Wiederholungskarten liegen in cell.json. Die Offline-App
verändert keine persönliche ZAM-Bibliothek.
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
	cwd: releaseRoot,
});

console.log(`Created release package: ${zipFilePath}`);
