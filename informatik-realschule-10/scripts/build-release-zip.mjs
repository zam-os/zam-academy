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
const name = "ZAM-Academy-Informatik-10";
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
  `ZAM ACADEMY · INFORMATIK 10 REALSCHULE\n\n1. ZIP entpacken.\n2. ${app} im Browser öffnen oder den passenden Startknopf nutzen.\n\nKeine Installation und kein Server nötig. Alle fünf Werkstätten laufen lokal.\nDeine Texte, Programme und dein Fortschritt bleiben in diesem Browser. Falls\nder Browser das Speichern sperrt, zeigt die App einen Hinweis; Üben bleibt möglich.\n\n36 Lektionen: Sichere Datennetze, Objektprogrammierung, Logik, Robotik und KI.\nDie Module sind wählbar. In Bayern legt die Schule die zeitliche Zuordnung fest.\nEs ist ein Vertiefungspaket, keine vollständige IT-Fachabdeckung der Klasse 10.\n\nNach der Veröffentlichung hält die ZAM-Zelle mit 72 Karten das Wissen fest.\nSie wird über ZAM aufgenommen; die App exportiert keine zweite Kartenliste.\nExterne Quellen und andere Academy-Angebote öffnen sich nur auf einen Klick\nund benötigen eine Internetverbindung. Reale Hardwarepraxis, freies Zeichnen\nund gemeinsame Präsentation und Diskussion ergänzen die digitalen Übungen.\n`,
);
const zip = join(release, `${name}-offline.zip`);
execFileSync("zip", ["-r", "-q", zip, name], { cwd: release });
console.log(`Created ${zip}`);
