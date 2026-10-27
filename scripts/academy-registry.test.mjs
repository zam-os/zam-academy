import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

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

test("every app with a cell is registered in academy.json, and vice versa", () => {
  const apps = readdirSync(root).filter((d) =>
    existsSync(join(root, d, "cell.json")),
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
      p.grade === null || (p.grade >= 5 && p.grade <= 13),
      `${p.id}: grade`,
    );
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
    assert.equal(p.lessons, tile.atoms.length, `${p.id}: lessons`);
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
          p.fach === e.fach && p.grade === e.grade && p.school === e.school,
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

test("GPG is reachable through all three paths in both lenses, including grades before the standalone subject starts", () => {
  const trees = atlasTrees();
  for (const grade of [5, 6, 7, 8, 9, 10]) {
    const offers = [];
    for (const path of ["geschichte", "pug", "geographie"]) {
      const node = schoolSubject(trees, grade, path).children.find(
        (n) => n.school?.id === "mittelschule",
      );
      assert.equal(node.combination.id, "gpg");
      assert.equal(node.label, "Geschichte/Politik/Geographie");
      assert.equal(node.planned, true);
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
    const rows = nodes.matrix.children.find((n) => n.tag === "tbody").children;
    for (const [index, subject] of registry.faecher.entries()) {
      for (let grade = 5; grade <= 13; grade++) {
        const mark = rows[index].children[grade - 4].children[0];
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
        if (grade < school.from || grade > school.to) {
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
  assert.ok(caption.includes("1 von "));
  assert.equal(caption.replace("1 von ", "0 von "), before);
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
