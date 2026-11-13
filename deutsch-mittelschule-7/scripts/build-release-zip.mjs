import { execFileSync } from "node:child_process";
import {
	chmodSync,
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = join(root, "dist/index.html");
if (!existsSync(input)) throw new Error("Run npm run build first.");
const lessons = JSON.parse(
	readFileSync(join(root, "src/curriculum/lessons.json"), "utf8"),
);
const casesCount = lessons.reduce((n, l) => n + l.cases.length, 0);
const cardsCount = lessons.length * 2;
const release = join(root, "release");
const name = "ZAM-Academy-Deutsch-7-Mittelschule";
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
	`ZAM ACADEMY · DEUTSCH 7 MITTELSCHULE\n\n1. ZIP entpacken.\n2. ${app} im Browser öffnen oder den passenden Starter nutzen.\n\nKeine Installation und kein Server nötig. ${lessons.length} Lektionen für Regelklasse und M-Zug\nmit ${casesCount} Fallentscheidungen und eigenen Schreibaufgaben auf zwei Stufen.\nEntwürfe und Fortschritt bleiben in diesem Browser; bei gesperrtem Speicher zeigt die App einen Hinweis.\n\nEigene Texte werden nicht automatisch bewertet. Mustervergleich und\nSelbsteinschätzung ersetzen kein Lehrkraftfeedback. Gespräche, Vorträge,\nszenisches Spiel, Jugendbuchlektüre, Schreibkonferenzen und eigene Recherchen ergänzen die App.\n\nDie ${cardsCount} ZAM-Karten werden nach Veröffentlichung über ZAM aufgenommen.\nExterne Quellen benötigen eine Verbindung und öffnen nur auf deinen Klick.\n`,
);
const zip = join(release, `${name}-offline.zip`);
execFileSync("zip", ["-r", "-q", zip, name], { cwd: release });
console.log(`Created ${zip}`);
