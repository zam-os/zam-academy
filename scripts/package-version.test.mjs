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

test("a major version needs Thomas's recorded approval", () => {
  assert.doesNotThrow(() => assertVersionRecord({ version: "0.4" }, "x"));
  assert.throws(() => assertVersionRecord({ version: "1.0" }, "x"), /approval record/);
  assert.throws(
    () => assertVersionRecord({ version: "1.0", approval: { date: "soon", source: "Thomas said so in a chat" } }, "x"),
    /approval record/,
  );
  assert.doesNotThrow(() =>
    assertVersionRecord(
      { version: "1.0", approval: { date: "2026-12-01", source: "Thomas, PR comment after the teacher review" } },
      "x",
    ),
  );
});

test("the badge sits inside the home link, replaces itself and ignores comments", () => {
  const once = withBadge(`<body>${LINK}</body>`, "0.0");
  assert.equal(badgeIn(once), versionBadge("0.0"));
  assert.ok(once.includes(`← ZAM Academy ${versionBadge("0.0")}</a>`));
  const twice = withBadge(once, "0.1");
  assert.equal(badgeIn(twice), versionBadge("0.1"));
  assert.equal(twice.match(/zam-version/g).length, 1);
  assert.equal(badgeIn(`<!-- ${LINK.replace("</a>", `${versionBadge("0.0")}</a>`)} -->${LINK}`), null);
  assert.match(versionBadge("0.3"), /title="Noch nicht von einer Lehrkraft geprüft">· Version 0\.3</);
  assert.match(versionBadge("1.0"), /title="Von einer Lehrkraft geprüft"/);
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
