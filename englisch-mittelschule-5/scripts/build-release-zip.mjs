import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distIndex = resolve(root, "dist/index.html");

if (!existsSync(distIndex)) {
  throw new Error("dist/index.html missing — run `npm run build` first.");
}

const releaseDir = resolve(root, "release");
const stageDir = resolve(releaseDir, ".stage");
const zipPath = resolve(releaseDir, "ZAM-Academy-Englisch-Mittelschule-5.zip");

rmSync(stageDir, { recursive: true, force: true });
rmSync(zipPath, { force: true });
mkdirSync(stageDir, { recursive: true });

copyFileSync(distIndex, resolve(stageDir, "index.html"));
writeFileSync(
  resolve(stageDir, "README.txt"),
  [
    "ZAM Academy — Englisch 5. Klasse Mittelschule (Bayern, LehrplanPLUS)",
    "",
    "Offline-Paket: Oeffne die Datei index.html in einem aktuellen Browser",
    "(Chrome, Firefox, Safari oder Edge). Alle 36 Lektionen, Hoertexte",
    "(mit lokaler Sprachausgabe, falls vom Browser unterstuetzt) und",
    "Werkstaetten funktionieren vollstaendig offline. Dein Lernstand wird",
    "ausschliesslich lokal in deinem Browser gespeichert.",
    "",
    "Online-Version: https://academy.zam-os.org/englisch-mittelschule-5/",
    "",
  ].join("\n"),
  "utf8",
);

execFileSync("zip", ["-q", "-j", zipPath, resolve(stageDir, "index.html"), resolve(stageDir, "README.txt")], {
  stdio: "inherit",
});
rmSync(stageDir, { recursive: true, force: true });

console.log(`Built release ZIP: ${zipPath}`);
