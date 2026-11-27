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
const bundleDirName = "ZAM-Academy-Latein-Gymnasium-8-L1";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(
	releaseRoot,
	"ZAM-Academy-Latein-Gymnasium-8-L1-offline.zip",
);
const appFile = "ZAM-Academy-Latein-Gymnasium-8-L1.html";

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
	"title Latein 8 Gymnasium (1. Fremdsprache) · ZAM Academy",
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

const readmeTxt = `ZAM ACADEMY · LATEIN 8 GYMNASIUM · BAYERN, 1. FREMDSPRACHE

1. Entpacke diese ZIP-Datei in einen Ordner.
2. Öffne "${appFile}" in einem aktuellen Browser oder nutze das passende
   Startskript für Windows, macOS oder Linux.

Für die Lektionen werden weder Installation noch Server oder Internetverbindung
benötigt. Die Unterrichtssprache ist Deutsch mit lateinischen Lehrbuchtexten.

Lernstand und eigene Entwürfe bleiben lokal in diesem Browser (localStorage).
Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls mehrere
Lernende ein gemeinsames Konto nutzen, lösche am Ende einer Sitzung über
„Lokalen Fortschritt zurücksetzen“ in der Fußzeile sowohl den Lernstand als
auch die eigenen Texte. Einige file://-Browser schränken lokalen Speicher ein;
die App weist dann sichtbar darauf hin.

Level 1 zählt zum Kernpfad; Level 2 bietet zusätzliche Transferaufgaben.
Die Entdeckerwerkstatt (3 Ziele je Lektion) und Level-1-Aufgaben zählen zum
Kernfortschritt. Externe Quellenlinks öffnen erst beim Anklicken.

Die 120 verknüpften ZAM-Karten stehen im Academy-Katalog. Diese Offline-App
verändert keine persönliche ZAM-Bibliothek und keinen Lernverlauf.
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
	cwd: releaseRoot,
});

console.log(`Created release package: ${zipFilePath}`);
