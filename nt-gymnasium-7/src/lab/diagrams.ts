import type { ChoiceParam, LabDefinition, LabValues } from "../model/types";
import { arrow, open, rect, text } from "./svg";

export function choices(key: string, label: string, labels: string[]): ChoiceParam {
  return {
    key,
    label,
    type: "choice",
    value: 0,
    options: labels.map((label, value) => ({ value, label })),
  };
}

export function tile(
  x: number,
  y: number,
  w: number,
  title: string,
  note: string,
  active = false,
): string {
  return (
    rect(x, y, w, 61, active ? "lab-fill-ok" : "lab-panel", 'rx="12"') +
    text(x + w / 2, y + 26, title, "lab-text", "middle") +
    text(x + w / 2, y + 47, note, "lab-text-small", "middle")
  );
}

const PAGES = ["Startseite", "Bücherei", "AGs"];
const URLS = ["/start", "/buecherei", "/ags"];
const graphEdges = (v: LabValues): Array<[number, number]> => [
  ...(v.forward ? [[0, v.forward - 1] as [number, number]] : []),
  ...(v.cross ? [[1, 2] as [number, number]] : []),
  ...(v.back ? [[2, 0] as [number, number]] : []),
];

export const hypertextGraph: LabDefinition = {
  kind: "hypertext-graph",
  title: "Das Schulwiki vernetzen",
  intro:
    "Lege Ziele für die Verweise fest und folge den Pfeilen. Lies am Graphen ab, welche Seiten du erreichen kannst.",
  params: [
    choices("forward", "Ziel des Verweises auf der Startseite", [
      "Kein Verweis",
      "/start",
      "/buecherei",
      "/ags",
    ]),
    choices("cross", "Verweis von der Bücherei zu den AGs", ["Fehlt", "Einfügen"]),
    choices("back", "Verweis von den AGs zur Startseite", ["Fehlt", "Einfügen"]),
    { type: "state", key: "page", value: 0, resetOnChange: true },
    { type: "state", key: "steps", value: 0, resetOnChange: true },
  ],
  actions: [
    {
      id: "follow",
      label: "Verweis folgen",
      apply(v) {
        const edge = graphEdges(v).find(([from]) => from === v.page);
        return edge ? { ...v, page: edge[1], steps: v.steps + 1 } : v;
      },
    },
  ],
  readouts: [
    { key: "page", label: "Geöffnete Seite", compute: (v) => PAGES[v.page] },
    {
      key: "url",
      label: "Zieladresse des nächsten Verweises",
      compute: (v) => {
        const edge = graphEdges(v).find(([from]) => from === v.page);
        return edge ? URLS[edge[1]] : "Kein ausgehender Verweis";
      },
    },
    { key: "edges", label: "Gerichtete Kanten", compute: (v) => graphEdges(v).length, digits: 0 },
  ],
  goals: [
    {
      id: "library",
      text: "Gelange von der Startseite über einen Verweis zur Bücherei.",
      check: (v) => v.page === 1,
    },
    {
      id: "clubs",
      text: "Gelange in zwei Schritten über die Bücherei zu den AGs.",
      check: (v) => v.page === 2 && v.forward === 2 && v.steps === 2,
    },
    {
      id: "cycle",
      text: "Kehre nach Startseite, Bücherei und AGs zur Startseite zurück.",
      check: (v) => v.page === 0 && v.steps === 3 && v.forward === 2 && v.cross === 1 && v.back === 1,
    },
  ],
  view: {
    render(v) {
      let out = open("Gerichteter Graph des Schulwikis. Aktuelle Seite: " + PAGES[v.page]);
      out += text(260, 42, "Seiten sind Knoten · Verweise sind gerichtete Kanten", "lab-text", "middle");
      if (v.forward === 1) {
        out += '<path d="M 210 90 C 168 45, 354 45, 310 90" class="lab-side-a" fill="none"/>';
        out += arrow(315, 81, 306, 91, "lab-side-a");
      }
      if (v.forward === 2) out += arrow(214, 151, 132, 218, "lab-side-a");
      if (v.forward === 3) out += arrow(306, 151, 392, 218, "lab-side-a");
      if (v.cross) out += arrow(177, 249, 343, 249, "lab-side-b");
      if (v.back) out += arrow(369, 218, 289, 151, "lab-side-c");
      out += tile(188, 90, 144, PAGES[0], URLS[0], v.page === 0);
      out += tile(33, 218, 144, PAGES[1], URLS[1], v.page === 1);
      out += tile(343, 218, 144, PAGES[2], URLS[2], v.page === 2);
      out += text(260, 314, "Geöffnet: " + PAGES[v.page], "lab-text-ok", "middle");
      return out + "</svg>";
    },
  },
};

const HOSTS = ["Schulwiki", "Stadtbücherei"];
const WEB_URLS = ["https://schule.example/wiki", "https://buecherei.example/katalog"];
const HOST_ADDRESSES = ["192.0.2.12", "192.0.2.24"];
const networkSteps = [
  "Bereit",
  "Anfrage beim Router",
  "Anfrage beim Server",
  "Antwort beim Router",
  "Antwort beim Client",
];

export const webRequest: LabDefinition = {
  kind: "web-request",
  title: "Eine Webanfrage verfolgen",
  intro:
    "Wähle eine Modelladresse. Schicke eine Anfrage los und verfolge ihren Weg bis zur Antwort. Die Adressen sind Beispiele.",
  params: [
    choices("host", "URL", WEB_URLS),
    { type: "state", key: "step", value: 0, resetOnChange: true },
  ],
  actions: [
    {
      id: "packet",
      label: "Anfrage / Antwort weiterleiten",
      apply: (v) => ({ ...v, step: Math.min(4, v.step + 1) }),
    },
    { id: "request", label: "Neue Anfrage vorbereiten", apply: (v) => ({ ...v, step: 0 }) },
  ],
  readouts: [
    { key: "server", label: "Ziel-IP im Modell", compute: (v) => HOST_ADDRESSES[v.host] },
    { key: "phase", label: "Übertragung", compute: (v) => networkSteps[v.step], emphasis: true },
    {
      key: "document",
      label: "Anzeige im Browser",
      compute: (v) => (v.step === 4 ? HOSTS[v.host] : "Dokument noch nicht empfangen"),
    },
  ],
  goals: [
    {
      id: "forward",
      text: "Bringe die Anfrage für das Schulwiki zum Server.",
      check: (v) => v.host === 0 && v.step === 2,
    },
    {
      id: "reply",
      text: "Lass das Schulwiki im Browser anzeigen.",
      check: (v) => v.host === 0 && v.step === 4,
    },
    {
      id: "second",
      text: "Rufe anschließend den Katalog der Stadtbücherei auf.",
      check: (v) => v.host === 1 && v.step === 4,
    },
  ],
  view: {
    render(v) {
      const returning = v.step >= 3;
      const position = [84, 260, 436, 260, 84][v.step];
      let out = open(networkSteps[v.step] + " · " + HOSTS[v.host]);
      out += text(
        260,
        46,
        returning ? "Antwort mit dem Dokument" : v.step ? "Anfrage nach dem Dokument" : "Browser bereit",
        "lab-text-big",
        "middle",
      );
      out += arrow(
        returning ? 440 : 80,
        133,
        returning ? 80 : 440,
        133,
        returning ? "lab-side-b" : "lab-side-a",
        3,
      );
      if (v.step) out += rect(position - 15, 117, 30, 31, "lab-fill-ok", 'rx="6"');
      out += tile(12, 184, 144, "Client", "Browser", v.step === 4);
      out += tile(188, 184, 144, "Router", "leitet Daten weiter", v.step === 1 || v.step === 3);
      out += tile(364, 184, 144, "Server", HOSTS[v.host], v.step === 2);
      out += text(260, 296, networkSteps[v.step], "lab-text", "middle");
      return out + "</svg>";
    },
  },
};

const SLOTS = ["Noch offen", "0–10 Min.", "10–25 Min.", "25–40 Min."];

export const timeline: LabDefinition = {
  kind: "project-timeline",
  title: "Vierzig Minuten für ein Schulwiki",
  intro:
    "Plane drei aufeinander aufbauende Aufgaben. Sam entwirft die Seiten, Kim setzt die Links, Jo übernimmt den Test.",
  params: [
    choices("plan", "Sam: Seiten und Verweise skizzieren", SLOTS),
    choices("build", "Kim: Seiten und Links umsetzen", SLOTS),
    choices("test", "Jo: Verweise und Quellen testen", SLOTS),
    { type: "state", key: "reviewed", value: 0, resetOnChange: true },
  ],
  actions: [{ id: "review", label: "Plan prüfen", apply: (v) => ({ ...v, reviewed: 1 }) }],
  readouts: [
    {
      key: "check",
      label: "Rückmeldung",
      emphasis: true,
      compute: (v) => {
        if (!v.reviewed) return "Lege Zeitfenster fest und prüfe sie.";
        if (!v.plan || !v.build || !v.test)
          return "Für jede Aufgabe fehlt noch ein eindeutiger Plan, solange ein Feld offen ist.";
        return v.plan < v.build && v.build < v.test
          ? "Alle Übergaben passen."
          : "Entwurf, Umsetzung und Test brauchen hier getrennte Zeitfenster in dieser Reihenfolge.";
      },
    },
  ],
  goals: [
    { id: "owner", text: "Plane den Entwurf im ersten Zeitfenster ein.", check: (v) => v.plan === 1 },
    {
      id: "handoff",
      text: "Plane die Umsetzung nach dem Entwurf.",
      check: (v) => v.plan === 1 && v.build === 2,
    },
    {
      id: "test",
      text: "Plane den Test am Ende ein und prüfe den Zeitplan.",
      check: (v) => v.reviewed === 1 && v.plan === 1 && v.build === 2 && v.test === 3,
    },
  ],
  view: {
    render(v) {
      let out = open("Zeitplan mit drei Zeitfenstern");
      const tasks = [
        [v.plan, "Sam · Entwurf"],
        [v.build, "Kim · Umsetzung"],
        [v.test, "Jo · Test"],
      ] as const;
      SLOTS.slice(1).forEach((label, index) => {
        const x = 15 + index * 165;
        out += rect(x, 85, 157, 180, "lab-panel", 'rx="12"');
        out += text(x + 78, 55, label, "lab-text", "middle");
        const assigned = tasks.filter(([slot]) => slot === index + 1);
        assigned.forEach(([, name], row) => {
          out += tile(x + 6, 98 + row * 52, 145, name, "", assigned.length === 1);
        });
        if (!assigned.length) out += text(x + 78, 176, "Noch frei", "lab-text-muted", "middle");
      });
      return out + "</svg>";
    },
  },
};
