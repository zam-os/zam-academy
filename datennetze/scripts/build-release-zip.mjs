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
const bundleDirName = "ZAM-Academy-Datennetze";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(releaseRoot, "ZAM-Academy-Datennetze-offline.zip");
const appFile = "ZAM-Academy-Datennetze.html";

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
	"title Datennetze und Internet · ZAM Academy",
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
ZAM ACADEMY · DATENNETZE UND INTERNET / NETWORKS AND THE INTERNET
========================================================================

DEUTSCH
1. ZIP-Datei entpacken.
2. "${appFile}" im Browser öffnen oder die passende Startdatei nutzen.
3. Oben mit DE / EN die Sprache wählen.

Die App benötigt keine Installation, keinen Server und keine externe Verbindung.
18 Kernlektionen und eine HTTPS-Ergänzung; sieben Laboraufträge.
Fortschritt und Laborzustand bleiben in diesem Browser, sofern er lokales
Speichern erlaubt. Bei gesperrtem Speicher zeigt die App einen Hinweis.
Das Netzwerklabor sendet keine echten Anfragen.

ENGLISH
1. Extract the ZIP archive.
2. Open "${appFile}" in your browser, or use the launcher for your system.
3. Choose EN at the top of the app. DE switches back to German.

No installation, server or Internet connection is needed.
All 19 lessons, practice tasks, lab challenges, diagnostics and tools are
available in English. Use the module as a refresher or work through the path.
Progress and lab settings stay in this browser when local storage is allowed.
The network lab is a simulation and sends no real requests.

Direct lesson links can select a language, for example:
${appFile}#lesson=net-dns&lang=en

Windows: Start-Windows.bat
macOS:   the HTML file or Start-Mac.command
Linux:   the HTML file or ./start-linux.sh

ZAM cards currently remain in German / Die ZAM-Karten bleiben derzeit deutsch.
========================================================================
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
	cwd: releaseRoot,
});

console.log(`Created release package: ${zipFilePath}`);
