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
const bundleDirName = "ZAM-Academy-Latein-Gymnasium-7-L2";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(
	releaseRoot,
	"ZAM-Academy-Latein-Gymnasium-7-L2-offline.zip",
);
const appFile = "ZAM-Academy-Latein-Gymnasium-7-L2.html";

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
	"title Latein 7 (2. Fremdsprache) Gymnasium · ZAM Academy",
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

const readmeTxt = `ZAM ACADEMY · LATEIN 7 (2. FREMDSPRACHE, L2) GYMNASIUM BAYERN

1. Entpacke dieses ZIP-Archiv in einen Ordner.
2. Öffne "${appFile}" in einem modernen Browser oder nutze die beigelegte
   Startdatei für Windows, macOS oder Linux.

Für alle 40 Lektionen, Schaubilder und 8 interaktiven Sprach- und Kulturmodelle
sind weder Installation noch Server oder Internetverbindung nötig.
Dein Fortschritt und deine Übersetzungen bleiben lokal in diesem Browser.

Werkstattziele, Schnellcheck, Kurzaufgaben und Level 1 zählen zum Kernpfad;
Level 2 bietet zusätzliche Transferaufgaben. Externe Quellen öffnen erst auf Klick.

Die 120 verknüpften ZAM-Karten stehen im Academy-Katalog (zam-academy:latein-gymnasium-7-l2).
Diese Offline-App verändert keine persönliche ZAM-Bibliothek.
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
	cwd: releaseRoot,
});

console.log(`Created release package: ${zipFilePath}`);
