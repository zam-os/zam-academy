import type { LabDefinition, LabValues } from "../model/types";
import { esc } from "../exercises/format";
import { action, goal, panel, readout, select } from "./workbench";

const services = ["Messenger", "E-Mail", "Forum", "Blog", "Soziales Netzwerk", "Gemeinsames Dokument"];
const jobs = [
  { title: "Treffpunkt schnell absprechen", service: 0, endpoint: "Klassenchat", server: "Messenger-Dienst" },
  { title: "Datei gezielt an Lehrkraft schicken", service: 1, endpoint: "Postfach der Lehrkraft", server: "Mailserver" },
  { title: "Antwort auf Fachfrage wiederfinden", service: 2, endpoint: "Diskussionsfaden", server: "Forensoftware" },
  { title: "Projektberichte veröffentlichen", service: 3, endpoint: "Blogbeitrag", server: "Blogplattform" },
  { title: "Updates mit einer Community teilen", service: 4, endpoint: "Beitrag im Netzwerk", server: "Plattformserver" },
  { title: "Gemeinsam einen Text überarbeiten", service: 5, endpoint: "Geteiltes Dokument", server: "Dokumentendienst" },
];

export const routeLab: LabDefinition = {
  kind: "nachrichtenweg",
  title: "Nachricht auf Reisen",
  intro: "Wähle einen Dienst für den Auftrag. Gehe dann den Weg der Nachricht Schritt für Schritt durch.",
  params: [
    select("job", "Auftrag", jobs.map((job) => job.title)),
    select("service", "Dienst", services, 1),
    { type: "state", key: "step", value: 0, resetOnChange: true },
  ],
  actions: [action("send", "Nachricht weiterleiten", (v) => ({ ...v, step: Math.min(v.step + 1, 3) }))],
  readouts: [
    readout("place", "Aktuelle Station", (v) => ["Absender", "Netz", "Dienst", "Ziel"][v.step]),
    readout("fit", "Passt zum Auftrag", (v) => v.step < 3 ? "Am Ziel prüfen" : v.service === jobs[v.job].service ? "Ja" : "Wähle einen anderen Dienst"),
  ],
  goals: [
    goal("chat", "Liefere die Treffpunkt-Nachricht über den Messenger aus.", (v) => v.job === 0 && v.service === 0 && v.step === 3),
    goal("mail", "Liefere die Datei über E-Mail ans Postfach aus.", (v) => v.job === 1 && v.service === 1 && v.step === 3),
    goal("document", "Erreiche das geteilte Dokument über den passenden Dienst.", (v) => v.job === 5 && v.service === 5 && v.step === 3),
  ],
  view: {
    render(v) {
      const route = [panel("Absender", "Dein Gerät", v.step === 0), panel("Netz", "Transportiert Daten", v.step === 1),
        panel("Dienst", jobs[v.service].server, v.step === 2), panel("Ziel", jobs[v.service].endpoint, v.step === 3)];
      return `<div class="viz-route">${route.join('<span class="viz-arrow" aria-hidden="true">→</span>')}</div>`;
    },
  },
};

interface DecisionCase {
  signal: string;
  scene: string;
  actions: [string, string, string];
  correct: number;
  reason: string;
}

export function decisionLab(
  kind: string, title: string, intro: string, cases: [DecisionCase, DecisionCase, DecisionCase], tasks: [string, string, string],
): LabDefinition {
  const selected = (v: LabValues) => cases[v.scene];
  return {
    kind, title, intro,
    params: [
      select("scene", "Fall", cases.map((entry) => entry.signal)),
      select("answer", "Deine Entscheidung", ["A", "B", "C"], 0),
      { type: "state", key: "checked", value: 0, resetOnChange: true },
    ],
    actions: [action("check", "Entscheidung prüfen", (v) => ({ ...v, checked: 1 }))],
    readouts: [
      readout("reason", "Auswertung", (v) => {
        if (!v.checked) return "Wähle A, B oder C und prüfe deine Entscheidung.";
        return v.answer === selected(v).correct ? selected(v).reason : "Prüfe den Fall erneut. Welche Folge hätte die gewählte Aktion?";
      }),
    ],
    goals: tasks.map((text, index) =>
      goal(`fall-${index + 1}`, text, (v) => Boolean(v.checked) && v.scene === index && v.answer === selected(v).correct)),
    view: {
      render(v) {
        const entry = selected(v);
        return `<div class="viz-case">${panel(entry.signal, entry.scene)}<ol type="A" aria-label="Mögliche Aktionen">${entry.actions.map((option, i) => `<li class="${v.checked && v.answer === i ? v.answer === entry.correct ? "is-correct" : "is-wrong" : ""}">${esc(option)}</li>`).join("")}</ol></div>`;
      },
    },
  };
}
