import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cards } from "./card-content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outline = JSON.parse(readFileSync(join(root, "src/curriculum/outline.json"), "utf8"));
const ids = JSON.parse(readFileSync(join(root, "scripts/card-ids.json"), "utf8"));
const address = "https://academy.zam-os.org/mathematik-realschule-8/";
const topicTitles = {
  I: [
    "",
    "Vierecke",
    "Drehung",
    "Raumgeometrie",
    "Terme, Gleichungen und Ungleichungen",
    "Bruchterme und Bruchgleichungen",
    "Funktionen",
    "Daten und Zufall",
  ],
  II_III: [
    "",
    "Dreiecke und Vierecke",
    "Raumgeometrie",
    "Terme und Gleichungen",
    "Bruchterme und Bruchgleichungen",
    "Funktionen",
    "Daten und Zufall",
  ],
};
const field = (key, value) =>
  typeof value === "string" ? { [key]: value } : { [`${key}_segments`]: value };
const allIds = Object.values(ids);
assert.equal(new Set(allIds).size, allIds.length, "ULIDs must be globally unique");
assert.ok(
  allIds.every((id) => /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(id)),
  "Every saved id must be a ULID",
);
assert.equal(new Set(cards.map((c) => c.slug)).size, cards.length);
assert.ok(cards.every((c) => outline.lessons.some((l) => l.id === c.lesson)));

const tile = {
  $schema: "https://zam.app/schemas/v1/kvt-tile.json",
  tile_id: "zam-academy:mathematik-realschule-8",
  version: "2026.10.1",
  title: "Mathematik 8 Realschule (ZAM Academy)",
  description:
    "Dreiecke und Vierecke, Drehung, Raumgeometrie, Terme und Gleichungen, Bruchgleichungen, Funktionen sowie Daten und Zufall. Getrennte Bindungen für Zweig I und II/III nach LehrplanPLUS Bayern. Jede Karte führt zu ihrer Lektion mit Labor und Aufgaben.",
  publisher: "ZAM Academy",
  sources: Object.entries(outline.sources).map(([track, uri]) => ({
    uri,
    checked: outline.checked,
    label: `LehrplanPLUS Mathematik 8 Realschule · ${track === "I" ? "I" : "II/III"}`,
  })),
  atoms: outline.lessons.map((lesson) => {
    const atomId = ids[`atom:${lesson.id}`];
    assert.ok(atomId, `Missing stable ULID for ${lesson.id}`);
    const practice = cards.filter((c) => c.lesson === lesson.id);
    assert.equal(practice.length, 3, `${lesson.id} needs three distinct single-point questions`);
    return {
      id: atomId,
      atom_uri: `urn:zam:atom:${atomId}`,
      namespace: "zam-academy-mathematik-realschule-8",
      slug: `m8-${lesson.id}`,
      title: lesson.title,
      domain:
        lesson.stageId === "daten-zufall"
          ? "mathematik/stochastik"
          : ["dreiecke-vierecke", "drehung", "raumgeometrie"].includes(lesson.stageId)
            ? "mathematik/geometrie"
            : "mathematik/algebra",
      reduction: "axiomatic",
      typical_age_min: 13,
      source_link: `${address}#lesson=${lesson.id}`,
      prerequisites: lesson.prerequisites.map((id) => ({
        atom_id: ids[`atom:${id}`],
        type: "soft",
        rationale:
          "Die vorherige Lektion erklärt eine verwendete Grundlage; Wiederholung bleibt freiwillig.",
      })),
      curricula: [
        {
          provider: "zam-academy",
          subject: "mathematik-realschule-8",
          topic_code: lesson.stageId,
          topic_title: outline.stages.find((s) => s.id === lesson.stageId).title,
        },
        ...Object.entries(lesson.bindings).map(([track, lb]) => ({
          provider: "lehrplanplus-bayern",
          school_type: "realschule",
          grade: 8,
          subject: "mathematik",
          track,
          topic_code: `lb${lb}`,
          topic_title: topicTitles[track][lb],
        })),
      ],
      practice_items: practice.map((card, index) => {
        assert.ok(ids[card.slug], `Missing stable ULID for ${card.slug}`);
        const correctIndex = index % 2;
        return {
          id: ids[card.slug],
          slug: card.slug,
          language: "de",
          tier: "tier1_fast",
          bloom_level: 1,
          source_link: `${address}#lesson=${lesson.id}`,
          ...field("question", card.question),
          ...field("concept", card.answer),
          materiality: "material",
          fast_check: {
            type: "binary_choice",
            options: correctIndex === 0 ? [card.answer, card.wrong] : [card.wrong, card.answer],
            correct_index: correctIndex,
          },
        };
      }),
    };
  }),
};

writeFileSync(join(root, "cell.json"), `${JSON.stringify(tile, null, 2)}\n`);
console.log(
  `Generated ${tile.atoms.length} atoms / ${cards.length} cards; no replacements or retirements.`,
);
