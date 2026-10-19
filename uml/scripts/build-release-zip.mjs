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
const bundleDirName = "ZAM-Academy-UML";
const bundleDir = join(releaseRoot, bundleDirName);
const zipFilePath = join(
  releaseRoot,
  "ZAM-Academy-UML-offline.zip",
);

if (!existsSync(distHtml)) {
  throw new Error(
    `Missing built file at ${distHtml}. Please run "npm run build" first.`,
  );
}

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(bundleDir, { recursive: true });

// 1. Copy the self-contained single-file HTML bundle
const appHtmlTarget = join(bundleDir, "ZAM-Academy-UML.html");
copyFileSync(distHtml, appHtmlTarget);

// 2. Create Windows double-click launcher (CRLF line endings for cmd.exe)
const winBat = [
  "@echo off",
  "title UML 2.5.1 · ZAM Academy",
  'start "" "%~dp0ZAM-Academy-UML.html"',
  "",
].join("\r\n");
writeFileSync(join(bundleDir, "Start-Windows.bat"), winBat, "utf8");

// 3. Create macOS double-click launcher (.command)
const macCommand = [
  "#!/bin/sh",
  'DIR="$(cd "$(dirname "$0")" && pwd)"',
  'open "$DIR/ZAM-Academy-UML.html"',
  "",
].join("\n");
const macCommandPath = join(bundleDir, "Start-Mac.command");
writeFileSync(macCommandPath, macCommand, "utf8");
chmodSync(macCommandPath, 0o755);

// 4. Create Linux launcher (.sh)
const linuxSh = [
  "#!/bin/sh",
  'DIR="$(cd "$(dirname "$0")" && pwd)"',
  'if command -v xdg-open >/dev/null 2>&1; then',
  '  xdg-open "$DIR/ZAM-Academy-UML.html"',
  'elif command -v gio >/dev/null 2>&1; then',
  '  gio open "$DIR/ZAM-Academy-UML.html"',
  "else",
  '  echo "Open $DIR/ZAM-Academy-UML.html in your web browser."',
  "fi",
  "",
].join("\n");
const linuxShPath = join(bundleDir, "start-linux.sh");
writeFileSync(linuxShPath, linuxSh, "utf8");
chmodSync(linuxShPath, 0o755);

// 5. Create bilingual README-START.txt
const readmeTxt = `========================================================================
ZAM ACADEMY · UML 2.5.1 (DE / EN)
========================================================================

[DEUTSCH — SOFORT-START OHNE INSTALLATION]
1. Entpacke dieses ZIP-Archiv in einen beliebigen Ordner.
2. Starte die App einfach per Doppelklick:
   - Windows: Doppelklick auf "Start-Windows.bat" oder "ZAM-Academy-UML.html"
   - macOS:   Doppelklick auf "ZAM-Academy-UML.html" oder "Start-Mac.command"
   - Linux:   Doppelklick auf "ZAM-Academy-UML.html" oder "./start-linux.sh"

Keine Installation, kein Server und kein Internet erforderlich!
Oben rechts in der App kannst du jederzeit umschalten zwischen:
- Sprache: 🇩🇪 DE | 🇬🇧 EN
- Schwierigkeitsgrad: 🌱 Level 1 (Geführt) | 🦅 Level 2 (System-Übersetzung)

------------------------------------------------------------------------

[ENGLISH — ZERO-INSTALL QUICK START]
1. Extract this ZIP archive to any folder on your computer.
2. Launch the app with a double-click:
   - Windows: Double-click "Start-Windows.bat" or "ZAM-Academy-UML.html"
   - macOS:   Double-click "ZAM-Academy-UML.html" or "Start-Mac.command"
   - Linux:   Double-click "ZAM-Academy-UML.html" or run "./start-linux.sh"

Zero installation, no server and no internet connection required!
In the top-right bar of the app you can switch at any time between:
- Language: 🇩🇪 DE | 🇬🇧 EN
- Difficulty: 🌱 Level 1 (Guided) | 🦅 Level 2 (System Translation)
========================================================================
`;
writeFileSync(join(bundleDir, "README-START.txt"), readmeTxt, "utf8");

// 6. Create the cross-platform ZIP archive
execFileSync("zip", ["-r", "-q", zipFilePath, bundleDirName], {
  cwd: releaseRoot,
});

console.log(`Created release package: ${zipFilePath}`);
