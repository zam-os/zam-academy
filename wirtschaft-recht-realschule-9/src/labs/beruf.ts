import { fmt } from "../format";
import { type LabDef, type LabState, svg } from "./engine";

const CRITERIA = ["Sicherheit", "Einkommen", "Zukunft", "Interesse"] as const;
const KEYS = ["wS", "wE", "wZ", "wI"] as const;

/** Learner-made ratings of three invented job profiles on a scale from 1 to 5, not statistics. */
const JOBS = [
  { name: "Büro und Verwaltung", ratings: [4, 5, 2, 3] },
  { name: "Technik und Handwerk", ratings: [3, 4, 5, 3] },
  { name: "Soziales und Gesundheit", ratings: [5, 2, 4, 4] },
] as const;

const scores = (s: LabState): number[] => {
  const total = KEYS.reduce((sum, key) => sum + s[key], 0);
  return JOBS.map((job) =>
    total === 0 ? 0 : KEYS.reduce((sum, key, i) => sum + s[key] * job.ratings[i], 0) / total,
  );
};

const winner = (s: LabState): number => {
  const list = scores(s);
  const best = Math.max(...list);
  const top = list.flatMap((value, i) => (value === best ? [i] : []));
  return top.length === 1 ? top[0] : -1;
};

export const NUTZWERT: LabDef = {
  kind: "nutzwert",
  title: "Berufe nach deinen Kriterien vergleichen",
  intro:
    "Drei erfundene Berufsfelder sind nach vier Kriterien bewertet (1 bis 5, Beispielwerte, keine Statistik). Du entscheidest, wie wichtig dir jedes Kriterium ist. Die Nutzwertanalyse wird hier als gewichteter Durchschnitt berechnet.",
  sliders: CRITERIA.map((label, i) => ({
    key: KEYS[i],
    label: `Wichtigkeit: ${label}`,
    min: 0,
    max: 10,
    step: 1,
    unit: "",
    value: 5,
  })),
  selects: [],
  goals: [
    {
      id: "buero",
      text: "Gewichte so, dass „Büro und Verwaltung“ vorne liegt.",
      test: (s) => winner(s) === 0,
    },
    {
      id: "technik",
      text: "Gewichte so, dass „Technik und Handwerk“ vorne liegt.",
      test: (s) => winner(s) === 1,
    },
    {
      id: "soziales",
      text: "Gewichte so, dass „Soziales und Gesundheit“ vorne liegt.",
      test: (s) => winner(s) === 2,
    },
    {
      id: "ein-gewicht",
      text: "Alle Gewichte stehen auf 5, und zwei Berufsfelder liegen gleichauf vorn. Ändere nur ein einziges Gewicht so, dass ein eindeutiger Sieger entsteht.",
      test: (s) => KEYS.filter((key) => s[key] === 5).length === 3 && winner(s) !== -1,
    },
  ],
  witness: {
    buero: { wS: 0, wE: 10, wZ: 0, wI: 0 },
    technik: { wS: 0, wE: 0, wZ: 10, wI: 0 },
    soziales: { wS: 10, wE: 0, wZ: 0, wI: 0 },
    "ein-gewicht": { wS: 10, wE: 5, wZ: 5, wI: 5 },
  },
  view(s) {
    const list = scores(s);
    const lead = winner(s);
    const bars = JOBS.map((job, i) => {
      const y = 40 + i * 76;
      const width = (list[i] / 5) * 300;
      return `<text class="lab-text" x="10" y="${y - 8}">${job.name}</text>
        <rect class="lab-track" x="10" y="${y}" width="300" height="26" rx="6"/>
        <rect class="lab-bar lab-bar-${i}${lead === i ? " lab-bar-win" : ""}" x="10" y="${y}" width="${Math.max(0, width)}" height="26" rx="6"/>
        <text class="lab-text lab-text-strong" x="320" y="${y + 18}">${fmt(Math.round(list[i] * 100) / 100)}</text>
        <text class="lab-text lab-text-muted" x="10" y="${y + 44}">${CRITERIA.map((c, k) => `${c} ${job.ratings[k]}`).join(" · ")}</text>`;
    }).join("");
    return {
      figure: svg("Gewichtete Bewertung von drei Berufsfeldern", bars, 480, 270),
      readouts: JOBS.map((job, i) => [job.name, fmt(Math.round(list[i] * 100) / 100)] as [string, string]),
      note:
        lead === -1
          ? "Gleichstand oder keine Gewichtung: Du musst entscheiden, welches Kriterium den Ausschlag geben soll."
          : `Mit deinen Gewichten liegt „${JOBS[lead].name}“ vorne. Ändere ein Gewicht und sieh, wie schnell sich die Reihenfolge dreht: Die Bewertung ist nur so gut wie deine Kriterien.`,
    };
  },
};
