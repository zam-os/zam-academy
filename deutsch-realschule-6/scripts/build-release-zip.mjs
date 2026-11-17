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
const name = "ZAM-Academy-Deutsch-Realschule-6";
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
	`ZAM ACADEMY · DEUTSCH 6 REALSCHULE\n\n1. Extract this ZIP.\n2. Open ${app} in your browser or use the matching starter.\n\nNo installation, server or account is needed. The package contains 50 lessons,\n100 case decisions and guided and transfer tasks. Audio and visuals are embedded.\nDrafts and progress remain in this browser. A notice appears if storage is blocked.\n\nFree writing uses model comparison and self-assessment. It is not automatically\ngraded. Real conversations, talks, performances, independent research and at least\ntwo complete children's/youth books by different authors complement the app.\n\nVersion 0: teacher review and videos remain open. The 100 ZAM cards are in the\nAcademy catalog. Source links\nneed a connection and open only when clicked.\n`,
);
const zip = join(release, `${name}-offline.zip`);
execFileSync("zip", ["-r", "-q", zip, name], { cwd: release });
console.log(`Created ${zip}`);
