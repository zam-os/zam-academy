#!/usr/bin/env node
// Picks the packages CI has to test for one change.
//
//   node scripts/changed-apps.mjs <base commit>
//
// Prints a JSON array for the job matrix. A package is every top-level folder
// with a tracked package.json. It is tested when a file in its folder
// changed. Every package is tested when the part of the CI workflow that
// tests packages changed, or when the base commit is unknown (first push of
// a branch, forced push): then nothing says which packages are still good.
// A new step in the `cells` job, as a new package adds for its migration,
// does not count.
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WORKFLOW = ".github/workflows/ci.yml";

const git = (args, cwd) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });

/** `changedFiles === null` means the change set could not be determined. */
export function selectApps(apps, changedFiles, testAll = false) {
  if (changedFiles === null || testAll) return [...apps];
  const folders = new Set(changedFiles.map((file) => file.split("/")[0]));
  return apps.filter((app) => folders.has(app));
}

/** The workflow without its `cells` job, which tests no package. */
export function packageJobs(workflow) {
  const start = workflow.search(/^ {2}cells:$/m);
  if (start < 0) return workflow;
  const rest = workflow.slice(start + 1).search(/^ {2}\S/m);
  return workflow.slice(0, start) + (rest < 0 ? "" : workflow.slice(start + 1 + rest));
}

export function discoverApps(cwd = process.cwd()) {
  return git(["ls-files", "*/package.json"], cwd)
    .split("\n")
    .filter((file) => file.split("/").length === 2)
    .map((file) => file.split("/")[0])
    .sort();
}

/** Files changed between `base` and HEAD, or null when `base` is unusable. */
export function changedFilesSince(base, cwd = process.cwd()) {
  if (!base || /^0+$/.test(base)) return null;
  try {
    return git(["diff", "--name-only", base, "HEAD"], cwd)
      .split("\n")
      .filter(Boolean);
  } catch {
    return null;
  }
}

function packageJobsChanged(base, cwd) {
  const at = (commit) => {
    try {
      return packageJobs(git(["show", `${commit}:${WORKFLOW}`], cwd));
    } catch {
      return null;
    }
  };
  return at(base) !== at("HEAD");
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const base = process.argv[2],
    cwd = process.cwd(),
    files = changedFilesSince(base, cwd);
  console.log(
    JSON.stringify(
      selectApps(
        discoverApps(cwd),
        files,
        files !== null && packageJobsChanged(base, cwd),
      ),
    ),
  );
}
