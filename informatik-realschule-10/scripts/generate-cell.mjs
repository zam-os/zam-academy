import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => JSON.parse(readFileSync(join(root, file), "utf8"));
const lessons = read("src/curriculum/lessons.json");
const modules = read("src/curriculum/modules.json");
const sources = read("src/curriculum/sources.json");
const ids = read("scripts/card-ids.json");
const base = "https://academy.zam-os.org/informatik-realschule-10/";
const atoms = lessons.map((lesson) => {
  const entry = ids[lesson.id];
  if (!entry)
    throw new Error(
      `Assign stable ULIDs for ${lesson.id} in card-ids.json first.`,
    );
  const module = modules.find((module) => module.id === lesson.module);
  const link = `${base}#lesson=${lesson.id}`;
  const common = { language: "de", source_link: link, materiality: "material" };
  return {
    id: entry.atom,
    atom_uri: `urn:zam:atom:${entry.atom}`,
    namespace: "zam-academy-informatik-realschule-10",
    slug: lesson.id,
    title: lesson.title,
    domain: `informatik/${lesson.module}`,
    reduction: "classical",
    typical_age_min: 15,
    source_link: link,
    prerequisites: lesson.prerequisites.map((id) => {
      if (!ids[id]) throw new Error(`Unknown prerequisite ${id}`);
      return {
        atom_id: ids[id].atom,
        type: "hard",
        rationale: `Die Lektion baut auf „${lessons.find((item) => item.id === id).title}“ auf.`,
      };
    }),
    curricula: [
      {
        provider: "zam-academy",
        subject: "informatik-realschule-10",
        topic_code: `it-${module.code}`,
        topic_title: module.title,
      },
      // IT is modular across grades. The app name does not establish a grade,
      // track or blanket exam-relevance binding in the official curriculum.
      {
        provider: "lehrplanplus-bayern",
        school_type: "realschule",
        subject: "it",
        topic_code: `it-${module.code}`,
        topic_title: module.title,
      },
    ],
    practice_items: [
      {
        ...common,
        id: entry.check,
        slug: `${lesson.id}-check`,
        tier: "tier1_fast",
        bloom_level: 2,
        question: lesson.quiz.question,
        concept: lesson.quiz.answer,
        sample_solution: `${lesson.quiz.answer} ${lesson.quiz.explanation}`,
        fast_check: {
          type: "binary_choice",
          options: [lesson.quiz.answer, lesson.quiz.wrong[0]],
          correct_index: 0,
        },
      },
      {
        ...common,
        id: entry.transfer,
        slug: `${lesson.id}-transfer`,
        tier: "tier2_synthesis",
        bloom_level: 3,
        question: lesson.tasks["2"].prompt,
        concept: lesson.tasks["2"].model,
        sample_solution: lesson.tasks["2"].model,
      },
    ],
  };
});
const tile = {
  $schema: "https://zam.app/schemas/v1/kvt-tile.json",
  tile_id: "zam-academy:informatik-realschule-10",
  version: "2026.10.1",
  title: "Informatik 10 Realschule · IT-Vertiefungen (ZAM Academy)",
  description:
    "36 Lektionen und 72 Karten zu fünf wählbaren Modulen: Datennetze II, objektorientierte Softwareentwicklung, logische Schaltungen, Robotik und KI. Jahrgangsübergreifender IT-Aufbauunterricht nach LehrplanPLUS Bayern; keine vollständige Klasse-10-Fachabdeckung und keine Altstandsübernahme.",
  publisher: "ZAM Academy",
  published_at: "2026-10-24T12:00:00Z",
  sources: [
    { uri: base, label: "ZAM Academy: Informatik 10 · IT-Vertiefungen" },
    ...sources.map((source) => ({
      uri: source.url,
      label: source.label,
      checked: "2026-10-24",
    })),
  ],
  atoms,
};
writeFileSync(join(root, "cell.json"), `${JSON.stringify(tile, null, 2)}\n`);
console.log(
  `Generated ${atoms.length} atoms / ${atoms.length * 2} cards, preserving all assigned IDs.`,
);
