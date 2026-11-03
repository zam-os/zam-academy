import { execFileSync } from "node:child_process";
import {
	chmodSync,
	cpSync,
	existsSync,
	mkdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const name = "ZAM-Forscherbuch-HSU-4";
const release = join(root, "release");
if (!existsSync(join(root, "dist/index.html"))) {
	throw new Error("Build the app first.");
}
rmSync(release, { recursive: true, force: true });
const destination = join(release, name);
mkdirSync(destination, { recursive: true });
cpSync(join(root, "dist"), destination, { recursive: true });

writeFileSync(
	join(destination, "Start-Windows.bat"),
	'@echo off\r\nstart "" "%~dp0index.html"\r\n',
);
writeFileSync(
	join(destination, "Start-Mac.command"),
	'#!/bin/sh\nTASK_DIR="$(cd "$(dirname "$0")" && pwd)"\nopen "$TASK_DIR/index.html"\n',
);
writeFileSync(
	join(destination, "start-linux.sh"),
	'#!/bin/sh\nTASK_DIR="$(cd "$(dirname "$0")" && pwd)"\nif command -v xdg-open >/dev/null 2>&1; then xdg-open "$TASK_DIR/index.html"; else printf "%s\\n" "Bitte index.html im Browser öffnen."; fi\n',
);
chmodSync(join(destination, "Start-Mac.command"), 0o755);
chmodSync(join(destination, "start-linux.sh"), 0o755);

writeFileSync(
	join(destination, "README-START.txt"),
	`ZAM ACADEMY · LOTTAS BAYERN-FORSCHERBUCH (HSU 4. KLASSE)\n\nEntpacke dieses ZIP vollständig und öffne index.html per Doppelklick im Browser.\nAlternativ kannst du das Startskript für dein Betriebssystem verwenden.\n\nAlle 20 Entdeckerstationen, Mitmach-Labore und das Forscher-Lexikon funktionieren komplett ohne Internetverbindung.\nDein Lernstand bleibt rein lokal im Browser gespeichert (localStorage), sofern Speichern erlaubt ist.\nKeine Konten, keine Werbung, keine Drittanbieter-Anfragen.\n\nHinweis: Jede Station ist für einen neugierigen Durchlauf gedacht – das langfristige Wiederholen der 60 Lernkarten erfolgt anschließend in ZAM.\n`,
);

execFileSync("zip", ["-r", "-q", join(release, `${name}-offline.zip`), name], {
	cwd: release,
});
console.log(join(release, `${name}-offline.zip`));
