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

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = join(root, "dist/index.html");
if (!existsSync(input)) throw new Error("Run npm run build first.");
const release = join(root, "release");
const name = "ZAM-Academy-Deutsch-4-Grundschule";
const bundle = join(release, name);
const app = `${name}.html`;
rmSync(release, { recursive: true, force: true });
mkdirSync(bundle, { recursive: true });
copyFileSync(input, join(bundle, app));
writeFileSync(
	join(bundle, "Start-Windows.bat"),
	`@echo off\r\nstart "" "%~dp0${app}"\r\n`,
);
writeFileSync(
	join(bundle, "Start-Mac.command"),
	`#!/bin/sh\nDIR="$(cd "$(dirname "$0")" && pwd)"\nopen "$DIR/${app}"\n`,
);
writeFileSync(
	join(bundle, "start-linux.sh"),
	`#!/bin/sh\nDIR="$(cd "$(dirname "$0")" && pwd)"\nif command -v xdg-open >/dev/null 2>&1; then\n  xdg-open "$DIR/${app}"\nelif command -v gio >/dev/null 2>&1; then\n  gio open "$DIR/${app}"\nelse\n  echo "Öffne $DIR/${app} im Browser."\nfi\n`,
);
chmodSync(join(bundle, "Start-Mac.command"), 0o755);
chmodSync(join(bundle, "start-linux.sh"), 0o755);
writeFileSync(
	join(bundle, "README-START.txt"),
	`ZAM ACADEMY · TINTOS WÖRTERSTADT · DEUTSCH 4. KLASSE (BAYERN)\n\n1. ZIP entpacken.\n2. ${app} im Browser öffnen oder den passenden Starter nutzen.\n\nKeine Installation und kein Server nötig. 23 Lektionen zu Wortarten,\nSätzen und Rechtschreibung mit Werkstatt-Spielen und Aufgaben auf zwei Stufen.\nSterne und Sticker bleiben in diesem Browser.\n\nErprobungsfassung: Eine Grundschullehrkraft hat die Inhalte noch nicht\nfachlich freigegeben. Lesen, eigene Texte und Sprechen sind noch nicht enthalten.\nExterne Links öffnen nur auf deinen Klick.\n`,
);
const zip = join(release, `${name}-offline.zip`);
execFileSync("zip", ["-r", "-q", zip, name], { cwd: release });
console.log(`Created ${zip}`);
