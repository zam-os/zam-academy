import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  assertVersionRecord,
  badgeIn,
  compareVersions,
  nextVersion,
  setVersion,
  versionBadge,
  versionProblems,
  withBadge,
} from "./package-version.mjs";

const LINK = '<a href="https://academy.zam-os.org/" class="zam-home-link">← ZAM Academy</a>';

test("versions compare by number and count fixes in the minor part", () => {
  assert.ok(compareVersions("0.10", "0.9") > 0);
  assert.ok(compareVersions("1.0", "0.99") > 0);
  assert.equal(compareVersions("2.3", "2.3"), 0);
  assert.equal(nextVersion("0.0"), "0.1");
  assert.equal(nextVersion("0.9"), "0.10");
  assert.equal(nextVersion("1.4"), "1.5");
  for (const bad of ["1", "0.01", "01.0", "v1.0", "1.0.0", "", null])
    assert.throws(() => nextVersion(bad), /invalid package version/);
});

test("a major version needs Thomas's recorded approval of that major", () => {
  const teacher = { major: 1, date: "2026-12-01", source: "Thomas, PR comment after the teacher review" };
  assert.doesNotThrow(() => assertVersionRecord({ version: "0.4" }, "x"));
  assert.throws(() => assertVersionRecord({ version: "1.0" }, "x"), /approval record for major 1/);
  assert.throws(
    () => assertVersionRecord({ version: "1.0", approval: { ...teacher, date: "soon" } }, "x"),
    /approval record/,
  );
  assert.throws(
    () => assertVersionRecord({ version: "1.0", approval: { ...teacher, major: undefined } }, "x"),
    /approval record/,
  );
  assert.doesNotThrow(() => assertVersionRecord({ version: "1.3", approval: teacher }, "x"));
  // The teacher's acceptance does not authorise a new package generation.
  assert.throws(() => assertVersionRecord({ version: "2.0", approval: teacher }, "x"), /for major 2/);
  assert.doesNotThrow(() => assertVersionRecord({ version: "2.0", approval: { ...teacher, major: 2 } }, "x"));
});

test("the badge sits inside the home link, replaces itself and ignores comments", () => {
  const once = withBadge(`<body>${LINK}</body>`, "0.0");
  assert.equal(badgeIn(once), versionBadge("0.0"));
  assert.ok(once.includes(`← ZAM Academy ${versionBadge("0.0")}</a>`));
  const twice = withBadge(once, "0.1");
  assert.equal(badgeIn(twice), versionBadge("0.1"));
  assert.equal(twice.match(/zam-version/g).length, 1);
  assert.equal(badgeIn(`<!-- ${LINK.replace("</a>", `${versionBadge("0.0")}</a>`)} -->${LINK}`), null);
  assert.match(
    versionBadge("0.3"),
    /title="Noch nicht von einer Lehrkraft geprüft">· Version&nbsp;0\.3 · Lehrkraftprüfung&nbsp;offen</,
  );
  assert.match(versionBadge("1.0"), /title="Von einer Lehrkraft geprüft">· Version&nbsp;1\.0 · von&nbsp;Lehrkraft&nbsp;geprüft</);
  assert.match(versionBadge("2.0"), />· Version&nbsp;2\.0 · neue&nbsp;Paketgeneration</);
  // The badge of an older form is replaced, not doubled.
  const old = LINK.replace("</a>", ' <span class="zam-version" title="x">· Version 0.0</span></a>');
  assert.equal(withBadge(old, "0.1").match(/zam-version/g).length, 1);
  assert.equal(badgeIn(withBadge(old, "0.1")), versionBadge("0.1"));
});

function withRepo(run) {
  const dir = mkdtempSync(join(tmpdir(), "zam-package-version-"));
  const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim();
  const write = (file, text) => {
    mkdirSync(join(dir, file, ".."), { recursive: true });
    writeFileSync(join(dir, file), text);
  };
  const app = (name, version) => {
    write(`${name}/package.json`, "{}\n");
    write(`${name}/publication.json`, `${JSON.stringify({ schema: 1, status: "ready", version }, null, "\t")}\n`);
    write(`${name}/index.html`, `<body>${withBadge(LINK, version)}</body>\n`);
  };
  try {
    git("init", "-q");
    git("config", "user.email", "test@example.invalid");
    git("config", "user.name", "Test");
    write("academy.json", '{\n  "pakete": [\n    {\n      "app": "a",\n      "version": "0.0"\n    }\n  ]\n}\n');
    app("a", "0.0");
    write("b/package.json", "{}\n");
    write("b/publication.json", '{ "schema": 1, "status": "ready" }\n');
    write("b/index.html", `<body>${LINK}</body>\n`);
    git("add", ".");
    git("commit", "-qm", "base");
    run({ dir, git, write, app, base: git("rev-parse", "HEAD") });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const commit = (git) => {
  git("add", ".");
  git("commit", "-qm", "change");
};

test("a changed package must raise its version; bump sets all three places", () =>
  withRepo(({ dir, git, write, base }) => {
    write("a/src.txt", "fix\n");
    commit(git);
    assert.match(versionProblems(base, dir).join(), /a: changed, but its version stays 0\.0/);
    setVersion("a", "0.1", dir);
    commit(git);
    assert.deepEqual(versionProblems(base, dir), []);
    assert.equal(JSON.parse(readFileSync(join(dir, "a/publication.json"), "utf8")).version, "0.1");
    assert.match(readFileSync(join(dir, "academy.json"), "utf8"), /"app": "a",\n {6}"version": "0\.1"/);
    assert.equal(badgeIn(readFileSync(join(dir, "a/index.html"), "utf8")), versionBadge("0.1"));
  }));

test("a refused bump changes no file", () =>
  withRepo(({ dir, git }) => {
    const files = ["a/publication.json", "a/index.html", "academy.json"];
    const read = () => files.map((f) => readFileSync(join(dir, f), "utf8"));
    const before = read();
    // No approval record for major 1.
    assert.throws(() => setVersion("a", "1.0", dir), /approval record/);
    assert.deepEqual(read(), before);
    // c is ready but has no registry entry: neither its publication nor its badge changes.
    mkdirSync(join(dir, "c"));
    writeFileSync(join(dir, "c/publication.json"), `${JSON.stringify({ schema: 1, status: "ready", version: "0.0" })}\n`);
    writeFileSync(join(dir, "c/index.html"), `<body>${withBadge(LINK, "0.0")}</body>\n`);
    const c = () => ["c/publication.json", "c/index.html"].map((f) => readFileSync(join(dir, f), "utf8"));
    const cBefore = c();
    assert.throws(() => setVersion("c", "0.1", dir), /academy\.json: c has no "version"/);
    assert.deepEqual(c(), cBefore);
    assert.equal(git("status", "--porcelain", "--", "a", "academy.json"), "");
  }));

test("a file moved between packages changes both", () =>
  withRepo(({ dir, git, write, app }) => {
    app("c", "0.0");
    write("a/moved.txt", "a file that will move to c, long enough for rename detection\n");
    commit(git);
    const next = git("rev-parse", "HEAD");
    git("mv", "a/moved.txt", "c/moved.txt");
    app("c", "0.1");
    commit(git);
    // Only c raised its version; a lost a file and must raise its own.
    assert.deepEqual(versionProblems(next, dir).map((p) => p.split(":")[0]), ["a"]);
  }));

test("a changed package without a valid version is reported, not thrown", () =>
  withRepo(({ dir, git, write, base }) => {
    write("a/publication.json", '{ "schema": 1, "status": "ready" }\n');
    commit(git);
    assert.deepEqual(versionProblems(base, dir), ["a: publication.json has no valid version (undefined)"]);
  }));

test("a lowered version fails; unchanged, new and pre-version packages pass", () =>
  withRepo(({ dir, git, write, app, base }) => {
    app("c", "0.0");
    write("b/publication.json", `${JSON.stringify({ schema: 1, status: "ready", version: "0.0" })}\n`);
    write("README.md", "outside every package\n");
    commit(git);
    assert.deepEqual(versionProblems(base, dir), []);
    const next = git("rev-parse", "HEAD");
    write("c/publication.json", `${JSON.stringify({ schema: 1, status: "ready", version: "0.0" })}\n`);
    write("c/src.txt", "fix\n");
    app("a", "0.0");
    commit(git);
    assert.deepEqual(versionProblems(next, dir).map((p) => p.split(":")[0]), ["c"]);
    assert.deepEqual(versionProblems("0000000", dir), []);
  }));
