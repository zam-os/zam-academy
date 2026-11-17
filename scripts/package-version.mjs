#!/usr/bin/env node
// The package version: what a learner sees next to the link back to the
// Academy, and what tells a teacher whether a package was reviewed.
//
//   0.n  not yet accepted by a teacher of the grade; n counts the changes
//   1.n  accepted by a teacher of the grade (Thomas records the acceptance)
//   2.n+ a fully new, modernised package type
//
// Every merged change to a package folder raises the minor number. Only
// Thomas raises the major number; `approval` in publication.json records his
// decision. This is not the cell version in cell.json, which ZAM reads.
//
// One version lives in three places that must agree: `<app>/publication.json`
// (`version`), `academy.json` (`pakete[].version`, shown by the atlas) and the
// badge inside the `zam-home-link` of `<app>/index.html`. `bump` changes all
// three; `check` is the CI gate.
//
//   node scripts/package-version.mjs bump <app> [<version>]
//   node scripts/package-version.mjs check <base commit>
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { changedFilesSince, discoverApps } from "./changed-apps.mjs";

export const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const parseVersion = (version) => {
  const match = VERSION.exec(String(version));
  if (!match) throw new Error(`invalid package version ${JSON.stringify(version)}`);
  return [Number(match[1]), Number(match[2])];
};

/** Negative, zero or positive, like a sort comparator. */
export function compareVersions(a, b) {
  const [am, an] = parseVersion(a),
    [bm, bn] = parseVersion(b);
  return am - bm || an - bn;
}

export const nextVersion = (version) => {
  const [major, minor] = parseVersion(version);
  return `${major}.${minor + 1}`;
};

/** Major 1 or higher needs Thomas's recorded decision. */
export function assertVersionRecord(publication, where) {
  const [major] = parseVersion(publication?.version);
  if (major === 0) return;
  const approval = publication.approval;
  if (
    !approval ||
    !DATE.test(approval.date ?? "") ||
    typeof approval.source !== "string" ||
    approval.source.length < 20
  ) {
    throw new Error(
      `${where}: version ${publication.version} needs an approval record (date and source of Thomas's decision)`,
    );
  }
}

export const versionNote = (version) =>
  parseVersion(version)[0] === 0
    ? "Noch nicht von einer Lehrkraft geprüft"
    : parseVersion(version)[0] === 1
      ? "Von einer Lehrkraft geprüft"
      : "Neue Paketgeneration";

/** The exact badge inside the app's `zam-home-link`. */
export const versionBadge = (version) =>
  `<span class="zam-version" title="${versionNote(version)}">· Version ${version}</span>`;

const BADGE = /<span class="zam-version" title="[^"]*">· Version [^<]*<\/span>/;
const HOME_LINK = /(<a\b[^>]*\bclass="zam-home-link"[^>]*>)([\s\S]*?)(<\/a>)/;

/** The badge text an app shows, or null. */
export function badgeIn(html) {
  const link = HOME_LINK.exec(html.replace(/<!--[\s\S]*?-->/g, ""));
  return link?.[2].match(BADGE)?.[0] ?? null;
}

export function withBadge(html, version) {
  const link = HOME_LINK.exec(html);
  if (!link) throw new Error("no zam-home-link");
  const text = BADGE.test(link[2])
    ? link[2].replace(BADGE, versionBadge(version))
    : `${link[2]} ${versionBadge(version)}`;
  return html.replace(HOME_LINK, `$1${text}$3`);
}

export function readPublication(dir) {
  return JSON.parse(readFileSync(join(dir, "publication.json"), "utf8"));
}

/** Sets one version in publication.json, academy.json and index.html. */
export function setVersion(app, version, dir = root) {
  parseVersion(version);
  const file = join(dir, app, "publication.json");
  const publication = readPublication(join(dir, app));
  publication.version = version;
  assertVersionRecord(publication, file);
  writeFileSync(file, `${JSON.stringify(publication, null, "\t")}\n`);

  const html = join(dir, app, "index.html");
  writeFileSync(html, withBadge(readFileSync(html, "utf8"), version));

  // A text edit keeps the hand-made layout of academy.json.
  const registry = join(dir, "academy.json");
  const text = readFileSync(registry, "utf8");
  const entry = new RegExp(`("app": "${app}",\\s*\\n\\s*)"version": "[^"]*"`);
  if (entry.test(text)) {
    writeFileSync(registry, text.replace(entry, `$1"version": "${version}"`));
  } else if (publication.status !== "local-only") {
    throw new Error(`academy.json: ${app} has no "version" after its "app"`);
  }
}

/**
 * Each package changed since `base` must raise its version; returns the
 * problems. An unknown base (first push, forced push) checks nothing.
 */
export function versionProblems(base, dir = root) {
  const files = changedFilesSince(base, dir);
  if (files === null) return [];
  const changed = new Set(files.map((file) => file.split("/")[0]));
  const problems = [];
  for (const app of discoverApps(dir).filter((a) => changed.has(a))) {
    const now = readPublication(join(dir, app)).version;
    let before;
    try {
      before = JSON.parse(
        execFileSync("git", ["show", `${base}:${app}/publication.json`], {
          cwd: dir,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }),
      ).version;
    } catch {
      before = undefined;
    }
    // A new package, or one from before versions, starts where it starts.
    if (before === undefined) continue;
    if (compareVersions(now, before) <= 0) {
      problems.push(
        `${app}: changed, but its version stays ${now} (was ${before}). Run: node scripts/package-version.mjs bump ${app}`,
      );
    }
  }
  return problems;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [command, arg, version] = process.argv.slice(2);
  if (command === "bump" && arg && existsSync(join(root, arg, "publication.json"))) {
    const next = version ?? nextVersion(readPublication(join(root, arg)).version);
    setVersion(arg, next);
    console.log(`${arg}: version ${next}`);
  } else if (command === "check") {
    const problems = versionProblems(arg);
    for (const problem of problems) console.error(problem);
    if (problems.length) process.exit(1);
    console.log("Every changed package raised its version.");
  } else {
    console.error("usage: package-version.mjs bump <app> [<version>] | check <base commit>");
    process.exit(2);
  }
}
