import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  isPublishedApp,
  assertPublishedApp,
  buildCatalog,
  publicationStatus,
} from "./build-catalog.mjs";
import { discoverApps } from "./changed-apps.mjs";
import {
  assertVersionRecord,
  badgeIn,
  versionBadge,
  versionNote,
  VERSION,
} from "./package-version.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(join(root, "academy.json"), "utf8"));
const pakete = registry.pakete;
const html = readFileSync(join(root, "index.html"), "utf8");
const modelStart = html.indexOf("function curriculumSlot(");
const modelEnd = html.indexOf("const nodeAt =", modelStart);
function atlasTrees(data = registry) {
  assert.ok(modelStart > 0 && modelEnd > modelStart);
  return new Function(
    "D",
    "state",
    `${html.slice(modelStart, modelEnd)}; buildTrees(); return state.trees;`,
  )(data, { trees: {} });
}
function schoolSubject(trees, grade, fach) {
  return trees.schule.children
    .find((n) => n.grade === grade)
    ?.children.find((n) => n.id === fach);
}

test("every published app with a cell is registered in academy.json, and vice versa", () => {
  for (const p of pakete) {
    assertPublishedApp(join(root, p.app), "registered in academy.json");
  }
  const apps = readdirSync(root).filter((d) =>
    existsSync(join(root, d, "cell.json")) && isPublishedApp(join(root, d)),
  );
  assert.deepEqual(pakete.map((p) => p.app).sort(), apps.sort());
});

test("registry references known subjects and schools and unique ids", () => {
  const faecher = new Set([
    ...registry.faecher.map((f) => f.id),
    ...(registry.fachverbunde ?? []).map((g) => g.id),
  ]);
  const schulen = new Set(registry.schulen.map((s) => s.id));
  const bereiche = new Set(registry.bereiche.map((b) => b.id));
  assert.equal(new Set(pakete.map((p) => p.id)).size, pakete.length);
  for (const f of registry.faecher) assert.ok(bereiche.has(f.bereich), f.id);
  for (const p of pakete) {
    assert.ok(faecher.has(p.fach), `${p.id}: unknown Fach`);
    assert.ok(p.school === null || schulen.has(p.school), `${p.id}: school`);
    assert.ok(
      p.grade === null || (p.grade >= 4 && p.grade <= 13),
      `${p.id}: grade`,
    );
    if (p.grades !== undefined) {
      assert.ok(Array.isArray(p.grades) && p.grades.length > 0, `${p.id}: grades`);
      assert.deepEqual(p.grades, [...new Set(p.grades)].sort((a, b) => a - b), `${p.id}: ordered, unique grades`);
      assert.ok(p.grades.includes(p.grade), `${p.id}: primary grade`);
      const school = registry.schulen.find((s) => s.id === p.school);
      for (const grade of p.grades) {
        assert.ok(Number.isInteger(grade) && grade >= (school?.from ?? 4) && grade <= (school?.to ?? 13), `${p.id}: grade in school range`);
      }
    }
  }
});

test("combined subjects define one canonical school offer with valid access paths", () => {
  const subjects = new Set(registry.faecher.map((f) => f.id));
  const keys = new Set();
  const ids = new Set();
  for (const group of registry.fachverbunde ?? []) {
    assert.ok(!subjects.has(group.id) && !ids.has(group.id), group.id);
    ids.add(group.id);
    const school = registry.schulen.find((s) => s.id === group.school);
    assert.ok(school);
    assert.ok(group.name && group.glyph && group.note?.length > 20);
    assert.match(group.source, /^https:\/\//);
    assert.ok(
      group.grades.length && new Set(group.grades).size === group.grades.length,
    );
    assert.ok(
      group.paths.length > 1 &&
        new Set(group.paths).size === group.paths.length,
    );
    for (const grade of group.grades) {
      assert.ok(
        Number.isInteger(grade) && grade >= school.from && grade <= school.to,
      );
      for (const path of group.paths) {
        assert.ok(subjects.has(path), path);
        const key = `${school.id}:${grade}:${path}`;
        assert.ok(!keys.has(key), `ambiguous combined-subject path: ${key}`);
        keys.add(key);
      }
    }
  }
  for (const p of pakete) {
    const group = registry.fachverbunde?.find((g) => g.id === p.fach);
    if (group) {
      assert.equal(p.school, group.school);
      assert.ok(group.grades.includes(p.grade));
    } else {
      assert.ok(
        !keys.has(`${p.school}:${p.grade}:${p.fach}`),
        `${p.id}: register the combined subject's canonical id`,
      );
    }
  }
});

test("card counts match the cell", () => {
  for (const p of pakete) {
    const tile = JSON.parse(
      readFileSync(join(root, p.app, "cell.json"), "utf8"),
    );
    const cards = tile.atoms.flatMap((a) => a.practice_items ?? []).length;
    assert.equal(p.cards, cards, `${p.id}: cards`);
  }
});

test("lesson counts match lesson-level atoms", () => {
  // UML groups several lessons per atom; its curriculum test checks this count.
  for (const p of pakete.filter((p) => p.app !== "uml")) {
    const tile = JSON.parse(
      readFileSync(join(root, p.app, "cell.json"), "utf8"),
    );
    // Mathematik 4's first lesson has four atoms, so count the cited lessons.
    const count =
      p.app === "mathematik-grundschule-4"
        ? new Set(tile.atoms.map((a) => new URL(a.source_link).hash)).size
        : tile.atoms.length;
    assert.equal(p.lessons, count, `${p.id}: lessons`);
  }
});

test("every app links back to the academy online and in an offline file", () => {
  for (const p of pakete) {
    const html = readFileSync(join(root, p.app, "index.html"), "utf8");
    const link = html.match(/<a\b[^>]*\bclass="zam-home-link"[^>]*>/)?.[0];
    const href = link?.match(/\bhref="([^"]+)"/)?.[1];
    assert.ok(href, `${p.app}: missing academy link`);
    for (const base of [
      `https://academy.zam-os.org/${p.app}/`,
      `file:///offline/${p.app}.html`,
    ]) {
      assert.equal(
        new URL(href, base).href,
        "https://academy.zam-os.org/",
        p.app,
      );
    }
  }
});

test("every package has a version, and registry, app badge and atlas show the same one", () => {
  const registered = new Map(pakete.map((p) => [p.app, p]));
  for (const app of discoverApps(root)) {
    const file = join(root, app, "publication.json");
    assert.ok(existsSync(file), `${app}: publication.json`);
    const publication = JSON.parse(readFileSync(file, "utf8"));
    assert.match(String(publication.version), VERSION, `${app}: version`);
    assertVersionRecord(publication, file);
    assert.equal(
      badgeIn(readFileSync(join(root, app, "index.html"), "utf8")),
      versionBadge(publication.version),
      `${app}: visible version badge inside the zam-home-link`,
    );
    if (publicationStatus(join(root, app)) === "ready") {
      assert.equal(registered.get(app)?.version, publication.version, `${app}: academy.json`);
    }
  }
  // The atlas explains the version in the package panel with the same words.
  const atlasNote = new Function(
    `${html.match(/const versionNote = [^\n]+/)[0]}; return versionNote;`,
  )();
  for (const v of ["0.0", "0.7", "1.0", "1.3", "2.0"])
    assert.equal(atlasNote(v), versionNote(v).replace(/^./, (c) => c.toLowerCase()), v);
  assert.ok(html.includes('h("dt", {}, "Version")'));
});

// Wording of the retired preview and draft states. "Vorschau" alone stays
// allowed in apps, where it can mean a preview of the learner's own work.
const RETIRED_STATE =
  /zam-preview-notice|zam-draft-notice|preview-label|Lokale Erprobung|lokaler Entwurf\.|ist ein lokaler Entwurf|local draft\b|Vorschau:|Vorschau;|als Vorschau|Werkstatt-Vorschau|Vorschau-Lektionen|Status der Vorschau|Erprobungsfassung|nach (?:seiner |der |einer )?Veröffentlichung|after publication/i;

function* appTexts(app) {
  const files = [join(app, "index.html"), join(app, "scripts", "build-release-zip.mjs")];
  const walk = (dir) => {
    for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(ts|tsx|js|mjs|css|html)$/.test(entry.name)) files.push(path);
    }
  };
  if (existsSync(join(root, app, "src"))) walk(join(app, "src"));
  for (const file of files)
    if (existsSync(join(root, file))) yield [file, readFileSync(join(root, file), "utf8")];
}

test("no package or atlas place is left in the retired preview or draft state", () => {
  for (const p of pakete) {
    assert.equal(p.preview, undefined, p.app);
    assert.ok(!/Vorschau|Entwurf|Erprobung/.test(p.desc ?? ""), `${p.app}: desc`);
  }
  assert.ok(!/\bpreview\b|Vorschau/.test(html));
  for (const app of discoverApps(root)) {
    if (publicationStatus(join(root, app)) !== "ready") continue;
    for (const [file, text] of appTexts(app)) {
      const found = text.match(RETIRED_STATE);
      assert.equal(found, null, `${file}: ${found?.[0]}`);
    }
  }
});

test("Grade 4 has its own island with the Grundschule packages and HSU ends there", () => {
  const trees = atlasTrees();
  const four = trees.schule.children.find((n) => n.grade === 4);
  assert.deepEqual(
    four.children.map((n) => n.id).sort(),
    ["deutsch", "hsu", "mathematik"],
  );
  for (const fach of four.children)
    assert.deepEqual(
      fach.children.map((n) => n.school.id),
      ["grundschule"],
    );
  assert.equal(schoolSubject(trees, 5, "hsu"), undefined);
  assert.ok(schoolSubject(trees, 5, "deutsch"));
});

test("kein_unterricht names known subjects and schools, explains itself and never contradicts a package", () => {
  const faecher = new Map(registry.faecher.map((f) => [f.id, f]));
  const schulen = new Map(registry.schulen.map((s) => [s.id, s]));
  const seen = new Set();
  for (const e of registry.kein_unterricht ?? []) {
    const where = `${e.fach} ${e.grade} ${e.school}`;
    assert.ok(faecher.has(e.fach), `${where}: unknown Fach`);
    const school = schulen.get(e.school);
    assert.ok(school, `${where}: unknown school`);
    assert.ok(
      e.grade >= school.from && e.grade <= school.to,
      `${where}: grade outside the school`,
    );
    assert.ok(
      e.grade >= faecher.get(e.fach).from,
      `${where}: before the Fach starts`,
    );
    assert.ok(e.note?.length > 20, `${where}: note`);
    assert.match(e.source ?? "", /^https:\/\//, `${where}: source`);
    assert.ok(!seen.has(where), `${where}: duplicate`);
    seen.add(where);
    assert.ok(
      !pakete.some(
        (p) =>
          p.fach === e.fach && (p.grades ?? [p.grade]).includes(e.grade) && p.school === e.school,
      ),
      `${where}: a package exists for a cell declared as no-lesson`,
    );
  }
});

test("every school names where it is taught, for sentences like 'am Gymnasium'", () => {
  for (const s of registry.schulen) assert.match(s.wo, /^(an|am) /, s.id);
});

test("the atlas omits untaught subjects instead of promising future packages", () => {
  const trees = atlasTrees();
  const geography = schoolSubject(trees, 10, "geographie");
  assert.deepEqual(
    geography.children.map((n) => n.school.id),
    ["gymnasium", "mittelschule"],
  );
  assert.equal(geography.total, 2);
  assert.equal(
    geography.children.find((n) => n.school.id === "mittelschule").label,
    "Geschichte/Politik/Geographie",
  );
  for (const gap of registry.kein_unterricht) {
    const subject = schoolSubject(trees, gap.grade, gap.fach);
    assert.ok(
      !subject?.children.some((n) => n.school?.id === gap.school),
      `${gap.fach} ${gap.grade} ${gap.school}`,
    );
  }
});

test("a subject's `schools` names known school types that teach some of its grades", () => {
  const schulen = new Map(registry.schulen.map((s) => [s.id, s]));
  for (const f of registry.faecher) {
    if (f.schools === undefined) continue;
    assert.ok(Array.isArray(f.schools) && f.schools.length > 0, `${f.id}: schools`);
    assert.equal(new Set(f.schools).size, f.schools.length, `${f.id}: duplicate school`);
    for (const id of f.schools) {
      const school = schulen.get(id);
      assert.ok(school, `${f.id}: unknown school ${id}`);
      assert.ok(
        f.from <= school.to && (f.to ?? 13) >= school.from,
        `${f.id}: no grade ${school.wo}`,
      );
    }
    for (const p of pakete.filter((p) => p.fach === f.id)) {
      assert.ok(f.schools.includes(p.school), `${p.id}: ${f.id} is not taught ${schulen.get(p.school)?.wo}`);
    }
    for (const e of (registry.kein_unterricht ?? []).filter((e) => e.fach === f.id)) {
      assert.ok(f.schools.includes(e.school), `${f.id} ${e.grade} ${e.school}: gap at a school without this path`);
    }
  }
});

test("second foreign languages are their own Gymnasium paths and leave the first-language cells alone", () => {
  const trees = atlasTrees();
  const world = trees.welt.children.flatMap((n) => n.children);
  const paths = { "englisch-2fs": [6, 9], "franzoesisch-2fs": [6, 9], "latein-2fs": [6, 8], latein: [5, 13] };
  for (const [fach, [from, to]] of Object.entries(paths)) {
    const subject = registry.faecher.find((f) => f.id === fach);
    assert.deepEqual(subject.schools, ["gymnasium"], fach);
    const liveGrades = new Set();
    for (let grade = 4; grade <= 13; grade++) {
      const offers = schoolSubject(trees, grade, fach)?.children ?? [];
      if (grade < from || grade > to) {
        assert.equal(offers.length, 0, `${fach} ${grade}`);
        continue;
      }
      assert.deepEqual(offers.map((n) => n.school?.id), ["gymnasium"], `${fach} ${grade}`);
      if (offers[0].pkg) {
        assert.equal(offers[0].offerKey, `package:${offers[0].pkg.app}`);
        liveGrades.add(grade);
      } else {
        assert.equal(offers[0].offerKey, `slot:gymnasium:${grade}:${fach}`);
      }
    }
    const marks = world.find((n) => n.id === fach).children.filter((n) => n.planned);
    const expectedPlanned = Array.from({ length: to - from + 1 }, (_, i) => from + i).filter(
      (grade) => !liveGrades.has(grade),
    );
    assert.deepEqual(marks.map((n) => n.grade), expectedPlanned, fach);
    assert.ok(marks.every((n) => n.sub === "Gym"), fach);
  }
  assert.equal(schoolSubject(trees, 5, "latein").children[0].pkg?.app, "latein-gymnasium-5");
  // Englisch and Französisch keep their own cells in every school type.
  assert.deepEqual(
    schoolSubject(trees, 6, "englisch").children.map((n) => n.school.id),
    ["realschule", "gymnasium", "mittelschule"],
  );
  assert.ok(schoolSubject(trees, 7, "franzoesisch").children
    .some((n) => n.pkg?.app === "franzoesisch-realschule-7"));
  assert.ok(schoolSubject(trees, 7, "franzoesisch").children
    .some((n) => n.pkg?.app === "franzoesisch-gymnasium-7"));
  // Englisch 6 as second foreign language has its own package in its own cell.
  assert.equal(schoolSubject(trees, 6, "englisch-2fs").children[0].pkg?.app, "englisch-2fs-gymnasium-6");
  assert.ok(!schoolSubject(trees, 6, "englisch").children.some((n) => n.pkg?.app === "englisch-2fs-gymnasium-6"));

  // The coverage matrix shows the paths at the Gymnasium only.
  const gym = matrix(registry, "gymnasium").nodes;
  const row = matrixRow(gym, "englisch-2fs");
  assert.equal(row.children[0].children[0], "Englisch (2. Fremdsprache)");
  for (let grade = 5; grade <= 13; grade++) {
    const mark = row.children[grade - 3].children[0];
    assert.equal(mark.attrs.class, grade >= 6 && grade <= 9 ? "cell" : "na", `grade ${grade}`);
  }
  for (const school of ["grundschule", "realschule", "mittelschule", "fosbos"]) {
    const { nodes } = matrix(registry, school);
    for (const fach of Object.keys(paths)) assert.equal(matrixRow(nodes, fach), undefined, `${fach} ${school}`);
    assert.ok(matrixRow(nodes, "englisch"), `englisch ${school}`);
  }
});

test("Gymnasium biology and economics skip grade 7 without hiding other school offers", () => {
  const trees = atlasTrees();
  const world = trees.welt.children.flatMap((node) => node.children);
  const { nodes } = matrix(registry, "gymnasium");
  const gaps = [
    ["biologie", "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym"],
    ["wirtschaft", "https://www.lehrplanplus.bayern.de/fachprofil/gymnasium/wirtschaft-und-recht"],
  ];

  for (const [subject, source] of gaps) {
    const offers = schoolSubject(trees, 7, subject)?.children ?? [];
    assert.ok(!offers.some((node) => node.school?.id === "gymnasium"));
    const slot = `slot:gymnasium:7:${subject}`;
    const worldOffers = world.find((node) => node.id === subject).children;
    assert.ok(!worldOffers.some((node) =>
      node.offerKey === slot || node.offerGroup?.includes(slot)));

    const row = matrixRow(nodes, subject);
    const grade7 = row.children[4].children[0];
    assert.equal(grade7.attrs.class, "na none");
    assert.ok(grade7.attrs["aria-label"].includes("kein Fach"));
    assert.equal(grade7.attrs.href, source);
  }

  assert.ok(schoolSubject(trees, 7, "biologie").children
    .some((node) => node.pkg?.app === "biologie-realschule-7"));
  assert.ok(schoolSubject(trees, 6, "biologie").children
    .some((node) => node.pkg?.app === "biologie-gymnasium-6"));
  assert.ok(schoolSubject(trees, 8, "wirtschaft").children
    .some((node) => node.school?.id === "gymnasium"));
});

test("Realschule physics starts with Group I in grade 7, not a promised grade-6 package", () => {
  const trees = atlasTrees();
  assert.ok(!schoolSubject(trees, 6, "physik")?.children.some((n) => n.school?.id === "realschule"));
  assert.deepEqual(schoolSubject(trees, 6, "physik").children.map((n) => n.school.id), ["mittelschule"]);
  const grade7 = schoolSubject(trees, 7, "physik").children.find((n) => n.school?.id === "realschule");
  assert.equal(grade7.pkg.app, "physik-realschule-7");
  assert.equal(grade7.pkg.zweige, "I");
  const world = trees.welt.children.flatMap((n) => n.children).find((n) => n.id === "physik");
  assert.ok(!world.children.some((n) => n.offerKey === "slot:realschule:6:physik" || n.offerGroup?.includes("slot:realschule:6:physik")));
  assert.ok(!world.children.some((n) => n.offerKey === "slot:gymnasium:6:physik" || n.offerGroup?.includes("slot:gymnasium:6:physik")));
  assert.ok(world.children.some((n) => n.pkg?.app === "physik-realschule-7"));
  const row = matrixRow(matrix(registry, "realschule").nodes, "physik");
  const grade6 = row.children[3].children[0];
  assert.equal(grade6.attrs.class, "na none");
  assert.equal(grade6.attrs.href, "https://www.isb.bayern.de/schularten/realschule/faecher/physik/");
  assert.ok(grade6.attrs["aria-label"].includes("kein Fach"));
});

test("GPG is reachable through all three paths in both lenses, including grades before the standalone subject starts", () => {
  const trees = atlasTrees();
  for (const grade of [5, 6, 7, 8, 9, 10]) {
    const offers = [];
    for (const path of ["geschichte", "pug", "geographie"]) {
      const node = schoolSubject(trees, grade, path).children.find(
        (n) => n.school?.id === "mittelschule",
      );
      // A registered GPG package replaces the shared placeholder of its grade.
      const pkg = pakete.find(
        (p) => p.fach === "gpg" && p.school === "mittelschule" && p.grade === grade,
      );
      if (pkg) {
        assert.equal(node.pkg, pkg);
        assert.equal(node.planned, false);
        assert.equal(node.offerKey, `package:${pkg.id}`);
      } else {
        assert.equal(node.combination.id, "gpg");
        assert.equal(node.label, "Geschichte/Politik/Geographie");
        assert.equal(node.planned, true);
      }
      offers.push(node.offerKey);
      const worldSubject = trees.welt.children
        .flatMap((n) => n.children)
        .find((n) => n.id === path);
      assert.ok(
        worldSubject.children.some(
          (n) =>
            n.grade === grade &&
            n.school?.id === "mittelschule" &&
            n.offerKey === node.offerKey,
        ),
      );
    }
    assert.equal(new Set(offers).size, 1);
  }
  assert.equal(trees.schule.live, pakete.length);
  assert.equal(trees.welt.live, pakete.length);
  assert.equal(trees.schule.total, trees.welt.total);
  assert.ok(
    !schoolSubject(trees, 11, "geographie").children.some(
      (n) => n.school?.id === "mittelschule",
    ),
  );
});

function withGpgPackage() {
  const data = structuredClone(registry);
  const p = {
    id: "gpg-mittelschule-10",
    app: "gpg-mittelschule-10",
    title: "Geschichte/Politik/Geographie 10",
    fach: "gpg",
    grade: 10,
    school: "mittelschule",
    lessons: 12,
    cards: 24,
    desc: "Gemeinsamer Kurs",
    gebiete: [],
    lang: ["de"],
  };
  data.pakete.push(p);
  return { data, p };
}

test("one future GPG package replaces its shared placeholder and is counted once", () => {
  const { data, p } = withGpgPackage();
  const before = atlasTrees(),
    after = atlasTrees(data);
  for (const path of ["geschichte", "pug", "geographie"]) {
    const node = schoolSubject(after, 10, path).children.find(
      (n) => n.school?.id === "mittelschule",
    );
    assert.equal(node.pkg, p);
    assert.equal(node.id, p.id);
    assert.equal(node.planned, false);
    assert.deepEqual(node.path, ["k10", path, p.id]);
    assert.equal(node.offerKey, `package:${p.id}`);
  }
  for (const lens of ["schule", "welt"]) {
    assert.equal(after[lens].live, before[lens].live + 1);
    assert.equal(after[lens].total, before[lens].total);
  }
  const grade = after.schule.children.find((n) => n.grade === 10);
  assert.equal(
    grade.live,
    before.schule.children.find((n) => n.grade === 10).live + 1,
  );
});

// Lightweight render fixture for the real inline matrix and search functions.
function element(tag, attrs = {}, ...children) {
  return {
    tag,
    attrs,
    children: children
      .flat(Infinity)
      .filter((n) => n !== null && n !== undefined),
    append(...nodes) {
      this.children.push(...nodes.flat(Infinity));
    },
    replaceChildren(...nodes) {
      this.children = nodes.flat(Infinity);
    },
  };
}
function descendants(node) {
  return typeof node === "object"
    ? [node, ...node.children.flatMap(descendants)]
    : [];
}
// The matrix leaves out subjects a school type does not teach, so rows are
// found by their subject, never by their index in `faecher`.
function matrixRow(nodes, fach) {
  return nodes.matrix.children
    .find((n) => n.tag === "tbody")
    .children.find((row) => row.attrs["data-fach"] === fach);
}
function matrix(data, school = "mittelschule") {
  const nodes = { matrix: element("table"), schulart: element("div") },
    visits = [];
  const slot = html.slice(
    modelStart,
    html.indexOf("function buildTrees()", modelStart),
  );
  const render = html.slice(
    html.indexOf("function renderMatrix()"),
    html.indexOf("/* ---------- boot"),
  );
  new Function(
    "D",
    "state",
    "$",
    "h",
    "go",
    "reduceMotion",
    `${slot}; ${render}; renderMatrix();`,
  )(
    data,
    { schulart: school, mode: "list" },
    (id) => nodes[id],
    element,
    (path) => visits.push(path),
    false,
  );
  return { nodes, visits };
}

test("coverage distinguishes pre-start grades from explicit timetable gaps and exposes their sources", () => {
  for (const school of registry.schulen) {
    const { nodes } = matrix(registry, school.id);
    for (const subject of registry.faecher) {
      const row = matrixRow(nodes, subject.id);
      if (subject.schools && !subject.schools.includes(school.id)) {
        assert.equal(row, undefined, `${subject.id}: no row ${school.wo}`);
        continue;
      }
      for (let grade = 4; grade <= 13; grade++) {
        const mark = row.children[grade - 3].children[0];
        const gap = registry.kein_unterricht.find(
          (entry) =>
            entry.fach === subject.id &&
            entry.school === school.id &&
            entry.grade === grade,
        );
        const combination = registry.fachverbunde.find(
          (group) =>
            group.school === school.id &&
            group.grades.includes(grade) &&
            group.paths.includes(subject.id),
        );
        if (
          grade < school.from ||
          grade > school.to ||
          grade > (subject.to ?? 13)
        ) {
          assert.equal(mark.attrs.class, "na");
        } else if (combination) {
          assert.equal(mark.attrs.class, "cell");
          assert.ok(mark.attrs["aria-label"].startsWith(combination.name));
        } else if (gap) {
          assert.equal(mark.attrs.class, "na none");
          assert.equal(mark.tag, "a");
          assert.equal(mark.attrs.href, gap.source);
          assert.ok(
            mark.attrs["aria-label"].includes(`kein Fach. ${gap.note}`),
          );
          assert.equal(mark.attrs.title, mark.attrs["aria-label"]);
        } else if (grade < subject.from) {
          assert.equal(mark.attrs.class, "na");
          assert.ok(mark.attrs["aria-label"].endsWith("nicht vorgesehen"));
          assert.equal(mark.attrs.title, mark.attrs["aria-label"]);
        } else {
          assert.equal(mark.attrs.class, "cell");
        }
      }
    }
  }
});

test("Realschule Informatics links Grades 6–8 to one canonical package in both atlas lenses", () => {
  const trees = atlasTrees();
  const shared = pakete.find((p) => p.id === "informatik-realschule-8");
  assert.deepEqual(shared.grades, [6, 7, 8]);
  assert.equal(shared.title, "Informatik 6–8");
  assert.equal(pakete.filter((p) => p.app === shared.app).length, 1);
  for (const grade of [6, 7, 8]) {
    const node = schoolSubject(trees, grade, "informatik").children.find((n) => n.school?.id === "realschule");
    assert.equal(node.pkg, shared);
    assert.equal(node.grade, grade);
    assert.equal(node.offerKey, `package:${shared.id}`);
    assert.deepEqual(node.path, [`k${grade}`, "informatik", shared.id]);
  }
  assert.equal(schoolSubject(trees, 9, "informatik").children.some((n) => n.pkg === shared), false);
  const world = trees.welt.children.flatMap((n) => n.children).find((n) => n.id === "informatik");
  assert.equal(world.children.filter((n) => n.pkg === shared).length, 1);
  assert.equal(new Set(world.children.map((n) => n.id)).size, world.children.length);
  assert.equal(trees.schule.live, pakete.length);
  assert.equal(trees.welt.live, pakete.length);
});

test("the coverage matrix exposes the same Informatics course in all three grades", () => {
  const { nodes, visits } = matrix(registry, "realschule");
  const row = matrixRow(nodes, "informatik");
  for (const grade of [6, 7, 8]) {
    const mark = row.children[grade - 3].children[0];
    assert.equal(mark.tag, "button");
    assert.ok(mark.attrs.title.includes("gemeinsames Paket für Klassen 6–8"));
    assert.equal(mark.attrs.title, mark.attrs["aria-label"]);
    mark.attrs.onclick();
  }
  assert.deepEqual(visits, [6, 7, 8].map((g) => [`k${g}`, "informatik", "informatik-realschule-8"]));
});

test("the coverage matrix links all three paths to one future package and counts the offer once", () => {
  const { data, p } = withGpgPackage(),
    { nodes, visits } = matrix(data);
  const links = descendants(nodes.matrix).filter(
    (n) =>
      n.tag === "button" &&
      n.attrs["aria-label"]?.startsWith(
        "Geschichte/Politik/Geographie Klasse 10,",
      ),
  );
  assert.equal(links.length, 3);
  links.forEach((n) => {
    n.attrs.onclick();
  });
  assert.deepEqual(
    visits,
    ["geschichte", "geographie", "pug"].map((path) => ["k10", path, p.id]),
  );
  const caption = descendants(nodes.matrix)
    .find((n) => n.tag === "caption")
    .children.join("");
  const before = descendants(matrix(registry).nodes.matrix)
    .find((n) => n.tag === "caption")
    .children.join("");
  const readyBefore = Number(before.match(/(\d+) von /)?.[1]);
  assert.ok(Number.isFinite(readyBefore));
  assert.ok(caption.includes(`${readyBefore + 1} von `));
  assert.equal(caption.replace(`${readyBefore + 1} von `, `${readyBefore} von `), before);
  const planned = descendants(matrix(registry).nodes.matrix).filter((n) =>
    n.attrs["aria-label"]?.startsWith(
      "Geschichte/Politik/Geographie Klasse 10,",
    ),
  );
  assert.equal(planned.length, 3);
  assert.ok(
    planned.every((n) => n.attrs.title.includes("noch nicht verfügbar")),
  );
});

test("search returns one shared package result even when it has three atlas paths", () => {
  const { data, p } = withGpgPackage();
  const code = html.slice(
    html.indexOf("function search(q)"),
    html.indexOf("/* ---------- coverage matrix"),
  );
  for (const query of [
    "Geschichte/Politik/Geographie",
    "GPG",
    "Politik und Gesellschaft",
  ]) {
    const results = element("ul");
    new Function(
      "D",
      "state",
      "$",
      "h",
      "enabled",
      "query",
      `${code}; search(query);`,
    )(
      data,
      { lens: "schule", trees: atlasTrees(data) },
      () => results,
      element,
      (n) => n.live > 0,
      query,
    );
    assert.equal(
      descendants(results).filter(
        (n) => n.tag === "button" && n.children.includes(p.title),
      ).length,
      1,
      query,
    );
  }
});

test("grade-specific searches open that grade's shared Informatics route in the school lens", () => {
  const code = html.slice(html.indexOf("function search(q)"), html.indexOf("/* ---------- coverage matrix"));
  const shared = pakete.find((p) => p.id === "informatik-realschule-8");
  for (const lens of ["schule", "welt"]) {
    for (const grade of [6, 7, 8]) {
      const results = element("ul");
      const queryInput = {value: `Informatik ${grade}`};
      const visits = [];
      new Function("D", "state", "$", "h", "enabled", "go", "query", `${code}; search(query);`)(
        registry, {lens, trees: atlasTrees()}, (id) => id === "q" ? queryInput : results,
        element, (n) => n.live > 0, (path) => visits.push(path), queryInput.value,
      );
      const matches = descendants(results).filter((n) => n.tag === "button" && n.children.includes(shared.title));
      assert.equal(matches.length, 1, `${lens}: Grade ${grade}`);
      const result = matches[0];
      if (lens === "schule") {
        assert.ok(descendants(result).some((n) => n.tag === "small" && n.children.includes(`Klasse ${grade} › Informatik`)), `breadcrumb for Grade ${grade}`);
      }
      result.attrs.onclick();
      const expected = lens === "schule"
        ? [`k${grade}`, "informatik", shared.id]
        : ["informatik", "informatik", shared.id];
      assert.deepEqual(visits, [expected], `${lens}: Grade ${grade}`);
      assert.equal(results.hidden, true);
      assert.equal(queryInput.value, "");
    }
  }
});

test("returning from list navigation fits the map only after making it visible", () => {
  const nodes = {
    board: { hidden: true },
    crumbs: {},
    outline: {},
    map: {},
    layer: {},
  };
  let measured = false;
  const code = html.slice(
    html.indexOf("function setMode(m)"),
    html.indexOf("/* ---------- search"),
  );
  new Function("state", "$", "document", "fit", `${code}; setMode("map");`)(
    {},
    (id) => nodes[id],
    { querySelectorAll: () => [] },
    (map, layer) => {
      assert.equal(nodes.board.hidden, false);
      assert.equal(map, nodes.map);
      assert.equal(layer, nodes.layer);
      measured = true;
    },
  );
  assert.equal(measured, true);
  assert.equal(nodes.outline.hidden, true);
});

function packageControls(state, location) {
  const controls = html.slice(
    html.indexOf("const interactive ="),
    html.indexOf("/* ---------- drawing"),
  );
  const activate = html.slice(
    html.indexOf("function activate("),
    html.indexOf("function applyHash("),
  );
  return new Function(
    "state",
    "location",
    `${controls}; ${activate}; return interactive;`,
  )(state, location);
}

test("a live package is selected first and opens on its next mouse or keyboard activation in either lens", () => {
  const trees = atlasTrees();
  for (const lens of ["schule", "welt"]) {
    const node = trees[lens].children
      .flatMap((n) => n.children)
      .flatMap((n) => n.children)
      .find((n) => n.pkg?.app === "geschichte-realschule-8");
    assert.ok(node);
    for (const key of [null, "Enter", " "]) {
      const opened = [];
      const location = { hash: "", assign: (url) => opened.push(url) };
      const state = { lens, sel: null };
      const controls = packageControls(state, location)(node);
      const activate = () => {
        if (key === null) controls.onclick({});
        else {
          let prevented = false;
          controls.onkeydown({
            key,
            preventDefault: () => { prevented = true; },
          });
          assert.equal(prevented, true);
        }
      };
      activate();
      const selectedHash = `#/${[lens, ...node.path].join("/")}`;
      assert.equal(location.hash, selectedHash);
      assert.deepEqual(opened, []);
      state.sel = node;
      activate();
      assert.deepEqual(opened, ["geschichte-realschule-8/"]);
      assert.equal(location.hash, selectedHash);
    }
  }
});

test("planned packages still show their details and never open an app", () => {
  const node = schoolSubject(atlasTrees(), 8, "geschichte").children.find(
    (n) => n.planned,
  );
  assert.ok(node);
  const opened = [];
  const state = { lens: "schule", sel: null };
  const location = { hash: "", assign: (url) => opened.push(url) };
  const controls = packageControls(state, location)(node);
  controls.onclick({});
  assert.equal(location.hash, `#/schule/${node.path.join("/")}`);
  state.sel = node;
  controls.onclick({});
  assert.equal(location.hash, `#/schule/${node.path.slice(0, -1).join("/")}`);
  assert.deepEqual(opened, []);
});

test("package details place the opening link after the title and reset a previous scroll position", () => {
  const trees = atlasTrees();
  const nodes = trees.schule.children
    .flatMap((n) => n.children)
    .flatMap((n) => n.children)
    .filter((n) => n.pkg);
  const render = html.slice(
    html.indexOf("function renderPanel()"),
    html.indexOf("function renderStats()"),
  );
  for (const node of nodes) {
    const panel = element("aside");
    const append = panel.append.bind(panel);
    panel.append = (...children) => {
      assert.ok(children.every((child) => child !== null && child !== undefined), "native append would display a literal null or undefined");
      append(...children);
    };
    panel.scrollTop = 200;
    const helpers = html.slice(modelStart, html.indexOf("function buildTrees()", modelStart));
    new Function("state", "$", "h", "schulName", `${helpers}; ${render}; renderPanel();`)(
      { sel: node },
      () => panel,
      element,
      (id) => registry.schulen.find((s) => s.id === id)?.name ?? "",
    );
    assert.equal(panel.scrollTop, 0);
    assert.equal(panel.children[1].tag, "h2");
    const link = panel.children[2];
    assert.equal(link.tag, "a");
    assert.equal(link.attrs.href, `${node.pkg.app}/`);
    assert.deepEqual(link.children, ["Paket öffnen →"]);
    if (node.pkg.grades?.length > 1) {
      const facts = descendants(panel).find((n) => n.attrs?.class === "facts");
      assert.ok(descendants(facts).some((n) => n.tag === "dd" && n.children.includes("Klassen 6–8")));
      assert.ok(descendants(panel).some((n) => n.tag === "p" && n.children.includes(node.pkg.desc)));
    }
    const facts = panel.children.find((c) => c.tag === "dl").children.flat(Infinity);
    const at = facts.findIndex((c) => c.tag === "dt" && c.children[0] === "Version");
    assert.ok(at >= 0, `${node.pkg.app}: version fact`);
    assert.ok(facts[at + 1].children[0].startsWith(`${node.pkg.version} · `), node.pkg.app);
  }
});

test("NT is reachable through all three science paths in both lenses and counts nt-mittelschule-5 once", () => {
  const trees = atlasTrees();
  for (const grade of [5, 6, 7, 8, 9, 10]) {
    const offers = [];
    for (const path of ["biologie", "chemie", "physik"]) {
      const node = schoolSubject(trees, grade, path).children.find(
        (n) => n.school?.id === "mittelschule",
      );
      const pkg = pakete.find(
        (p) => p.fach === "nt" && p.school === "mittelschule" && p.grade === grade,
      );
      if (pkg) {
        assert.equal(node.pkg, pkg);
        assert.equal(node.planned, false);
        assert.equal(node.offerKey, `package:${pkg.id}`);
      } else {
        assert.equal(node.combination.id, "nt");
        assert.equal(node.label, "Natur und Technik");
        assert.equal(node.planned, true);
      }
      offers.push(node.offerKey);
      const worldSubject = trees.welt.children
        .flatMap((n) => n.children)
        .find((n) => n.id === path);
      assert.ok(
        worldSubject.children.some(
          (n) =>
            n.grade === grade &&
            n.school?.id === "mittelschule" &&
            n.offerKey === node.offerKey,
        ),
      );
    }
    assert.equal(new Set(offers).size, 1);
  }
});
