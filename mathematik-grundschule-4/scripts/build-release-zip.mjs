import { execFileSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
	chmodSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const name = "ZAM-Entdeckerinsel-Mathematik-4";
const release = join(root, "release");
if (!existsSync(join(root, "dist/index.html")))
	throw new Error("Build the app first.");
rmSync(release, { recursive: true, force: true });
mkdirSync(join(release, name), { recursive: true });
const destination = join(release, name);
cpSync(join(root, "dist"), destination, { recursive: true });
const media = JSON.parse(
	readFileSync(join(root, "media-register.json"), "utf8"),
);
cpSync(
	join(root, "media-register.json"),
	join(destination, "media-register.json"),
);
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
	`ZAM ENTDECKERINSEL · MATHEMATIK 4\n\nEntpacke das ZIP vollständig und öffne index.html per Doppelklick.\nAlternativ nutze den Starter für dein Betriebssystem.\n\nDie Stellenwert-Lektion und Milo funktionieren ohne Internet.\nDer Lernstand bleibt in diesem Browser, wenn das Speichern erlaubt ist.\nFalls Speichern nicht möglich ist, zeigt die App das deutlich an.\nKeine Konten, keine Werbung, keine Verbindung zu Modellen.\n\nStatus der Vorschau: ${media.status === "approved" ? "Lehrervideo vorhanden." : "Die echte Lehreraufnahme und fachliche Freigabe stehen noch aus. Die bebilderte Erklärung ist vollständig nutzbar."}\n\nMilo geht es in Lernpausen gut.\n`,
);
execFileSync("zip", ["-r", "-q", join(release, `${name}-offline.zip`), name], {
	cwd: release,
});
console.log(join(release, `${name}-offline.zip`));
