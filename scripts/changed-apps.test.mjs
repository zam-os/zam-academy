import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  changedFilesSince,
  discoverApps,
  packageJobs,
  selectApps,
} from "./changed-apps.mjs";

const apps = ["sql", "uml", "physik-gymnasium-11"];
const read = (file) =>
  readFileSync(new URL(`../.github/workflows/${file}`, import.meta.url), "utf8");

test("only packages with a changed file are tested", () => {
  assert.deepEqual(
    selectApps(apps, ["physik-gymnasium-11/cell.json", "README.md"]),
    ["physik-gymnasium-11"],
  );
  assert.deepEqual(selectApps(apps, ["sql/src/main.ts", "uml/index.html"]), [
    "sql",
    "uml",
  ]);
});

test("changes outside every package test no package", () => {
  assert.deepEqual(
    selectApps(apps, ["README.md", "docs/x.md", "academy.json", "sql-notes.md"]),
    [],
  );
  assert.deepEqual(selectApps(apps, []), []);
});

test("changed package jobs or an unknown base test every package", () => {
  assert.deepEqual(selectApps(apps, ["README.md"], true), apps);
  assert.deepEqual(selectApps(apps, null), apps);
  assert.equal(changedFilesSince(""), null);
  assert.equal(changedFilesSince("0".repeat(40)), null);
  assert.equal(changedFilesSince("not-a-commit"), null);
});

test("a new step in the cells job leaves the package jobs unchanged", () => {
  const workflow = read("ci.yml");
  assert.match(workflow, /^ {2}cells:$/m);
  const withStep = `${workflow}      - name: New migration\n        run: node x/scripts/validate-migration.mjs\n`;
  assert.equal(packageJobs(withStep), packageJobs(workflow));
  assert.notEqual(
    packageJobs(workflow.replace("- run: npm test", "- run: npm run test")),
    packageJobs(workflow),
  );
  assert.equal(
    packageJobs("jobs:\n  a:\n    x\n  cells:\n    y\n  b:\n    z\n"),
    "jobs:\n  a:\n    x\n  b:\n    z\n",
  );
});

test("CI finds every package that Pages publishes", () => {
  const found = discoverApps(new URL("..", import.meta.url).pathname);
  const pages = read("pages.yml").match(/^\s*for app in (.+); do$/m)[1].split(" ");
  // CI may test more (local-only drafts), never less: Pages runs no tests.
  assert.deepEqual(pages.filter((app) => !found.includes(app)), []);
});
