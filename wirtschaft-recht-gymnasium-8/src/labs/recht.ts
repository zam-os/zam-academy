import { type LabDef, type LabState, mapRange, step, svg } from "./engine";

const flow = (...steps: string[]) => `<div class="flow">${steps.join("")}</div>`;

/* ------------------------------------------------------------------ */
/* Ein Steinwurf, zwei Prüfungen: Zivilrecht und Strafrecht.           */

type Civil = { liable: boolean; title: string; text: string };
type Criminal = { kind: "kind" | "unreif" | "jugend" | "heran" | "erwachsen"; title: string; text: string };

function civil(s: LabState): Civil {
  if (s.alter < 7)
    return { liable: false, title: "Nicht deliktsfähig", text: "Wer noch nicht sieben Jahre alt ist, ist für einen Schaden nicht verantwortlich (§ 828 Abs. 1 BGB)." };
  if (s.alter < 18)
    return s.einsicht === 0
      ? { liable: true, title: "Haftet auf Schadensersatz", text: "Zwischen 7 und 17 Jahren haftet, wer die nötige Einsicht in seine Verantwortung hatte (§ 828 Abs. 3 BGB). Er muss den Schaden nach § 823 Abs. 1 BGB ersetzen." }
      : { liable: false, title: "Haftet nicht selbst", text: "Ohne die nötige Einsicht ist der Minderjährige nicht verantwortlich (§ 828 Abs. 3 BGB). Zu prüfen bleibt, ob die Eltern ihre Aufsichtspflicht verletzt haben (§ 832 BGB)." };
  return { liable: true, title: "Haftet auf Schadensersatz", text: "Volljährige sind für vorsätzlich oder fahrlässig verursachte Schäden voll verantwortlich (§ 823 Abs. 1 BGB)." };
}

function criminal(s: LabState): Criminal {
  if (s.alter < 14) return { kind: "kind", title: "Schuldunfähig", text: "Wer bei der Tat noch nicht 14 Jahre alt ist, ist schuldunfähig (§ 19 StGB). Es gibt kein Strafverfahren; das Jugendamt kann Hilfen anbieten." };
  if (s.alter < 18)
    return s.einsicht === 0
      ? { kind: "jugend", title: "Jugendstrafrecht", text: "Jugendliche von 14 bis 17 Jahren sind strafrechtlich verantwortlich, wenn sie reif genug sind, das Unrecht einzusehen und danach zu handeln (§ 3 JGG). Das Jugendgericht entscheidet nach dem Erziehungsgedanken." }
      : { kind: "unreif", title: "Nicht strafrechtlich verantwortlich", text: "Fehlt einem Jugendlichen die nötige Reife, ist er nicht strafrechtlich verantwortlich. Der Richter kann aber Maßnahmen zur Erziehung anordnen (§ 3 JGG)." };
  if (s.alter < 21)
    return { kind: "heran", title: "Heranwachsender", text: "Mit 18 bis 20 Jahren prüft das Gericht, ob es Jugend- oder Erwachsenenstrafrecht anwendet, etwa wenn der Täter in seiner Entwicklung noch einem Jugendlichen gleichstand (§ 105 JGG)." };
  return { kind: "erwachsen", title: "Allgemeines Strafrecht", text: "Ab 21 Jahren gilt das allgemeine Strafrecht. Für Sachbeschädigung droht Freiheitsstrafe bis zu zwei Jahren oder Geldstrafe (§ 303 StGB)." };
}

export const VERANTWORTUNG: LabDef = {
  kind: "verantwortung",
  title: "Ein Steinwurf, zwei Prüfungen",
  intro:
    "Jemand wirft absichtlich einen Stein durch die Fensterscheibe eines Nachbarn. Stelle das Alter zur Zeit der Tat ein und ob die Person ihr Unrecht und ihre Verantwortung erkennen konnte. Das Modell prüft Schadensersatz und Strafe getrennt.",
  sliders: [{ key: "alter", label: "Alter zur Zeit der Tat", min: 5, max: 22, step: 1, unit: "Jahre", value: 16 }],
  selects: [
    {
      key: "einsicht",
      label: "Einsicht und Reife",
      options: [
        { value: 0, label: "konnte Unrecht und Verantwortung erkennen" },
        { value: 1, label: "konnte das noch nicht erkennen" },
      ],
      value: 1,
    },
  ],
  goals: [
    { id: "kind", text: "Stelle ein Alter ein, bei dem weder Schadensersatz noch Strafe in Betracht kommen.", test: (s) => s.alter < 7 },
    { id: "nur-zivil", text: "Zeige einen Fall, in dem die Person Schadensersatz leisten muss, aber noch nicht strafmündig ist.", test: (s) => s.alter >= 7 && s.alter < 14 && s.einsicht === 0 },
    { id: "jugendstrafrecht", text: "Zeige einen Fall, in dem das Jugendstrafrecht greift.", test: (s) => criminal(s).kind === "jugend" },
    { id: "heranwachsend", text: "Finde das Alter, in dem das Gericht zwischen Jugend- und Erwachsenenstrafrecht wählt.", test: (s) => criminal(s).kind === "heran" },
  ],
  witness: {
    kind: { alter: 6, einsicht: 1 },
    "nur-zivil": { alter: 12, einsicht: 0 },
    jugendstrafrecht: { alter: 15, einsicht: 0 },
    heranwachsend: { alter: 19, einsicht: 1 },
  },
  view(s) {
    const c = civil(s);
    const k = criminal(s);
    const x = (a: number) => mapRange(a, [5, 23], [20, 460]);
    const zone = (from: number, to: number, y: number, cls: string, label: string) =>
      `<rect class="${cls}" x="${x(from)}" y="${y}" width="${x(to) - x(from)}" height="26" rx="4"/><text class="lab-text" x="${x(from) + 4}" y="${y + 17}" style="font-size:11px">${label}</text>`;
    const ruler = svg(
      "Altersgrenzen im Zivil- und im Strafrecht",
      `<text class="lab-text lab-text-strong" x="20" y="14">Zivilrecht · Schadensersatz</text>
       ${zone(5, 7, 20, "lab-zone-no", "unter 7")}${zone(7, 10, 20, "lab-zone-maybe2", "7 bis 9 *")}${zone(10, 18, 20, "lab-zone-maybe", "10 bis 17: Einsicht entscheidet")}${zone(18, 23, 20, "lab-zone-yes", "ab 18")}
       <text class="lab-text lab-text-strong" x="20" y="70">Strafrecht</text>
       ${zone(5, 14, 76, "lab-zone-no", "unter 14: schuldunfähig")}${zone(14, 18, 76, "lab-zone-maybe", "14 bis 17")}${zone(18, 21, 76, "lab-zone-maybe2", "18 bis 20")}${zone(21, 23, 76, "lab-zone-yes", "ab 21")}
       <line class="lab-marker" x1="${x(s.alter + 0.5)}" y1="12" x2="${x(s.alter + 0.5)}" y2="112"/>
       <text class="lab-text lab-text-strong" x="${Math.min(410, x(s.alter + 0.5) + 4)}" y="126">${s.alter} J.</text>
       <text class="lab-text lab-text-muted" x="20" y="148">* 7 bis 9: bei Unfällen mit Kraftfahrzeugen oder Bahnen nur bei Vorsatz</text>`,
      470,
      156,
    );
    return {
      figure:
        ruler +
        flow(
          step("ok", "Tat", "Absichtlicher Steinwurf: Die Scheibe des Nachbarn geht zu Bruch."),
          step(c.liable ? "ok" : "no", `Zivilrecht: ${c.title}`, c.text),
          step(k.kind === "jugend" || k.kind === "heran" || k.kind === "erwachsen" ? "ok" : "no", `Strafrecht: ${k.title}`, k.text),
        ),
      readouts: [
        ["Alter", `${s.alter} Jahre`],
        ["Schadensersatz", c.liable ? "ja" : "nein"],
        ["Strafrecht", k.title],
      ],
      note: "Das Modell zeigt Regelfälle zu einer einzigen Tat. Der Steinwurf ist kein Unfall mit einem Kraftfahrzeug oder einer Bahn, deshalb gilt die besondere Grenze von zehn Jahren hier nicht. Ob die Eltern wegen verletzter Aufsichtspflicht haften und ob eine Haftpflichtversicherung zahlt, wird gesondert geprüft. Schuldunfähigkeit wegen einer schweren seelischen Störung bleibt ausgeklammert.",
    };
  },
};

/* ------------------------------------------------------------------ */
/* Jugendschutzgesetz: Alter, Situation, Begleitung.                    */

const SITUATIONS = [
  { label: "Bier oder Wein in einer Gaststätte trinken", law: "§ 9 Abs. 1 Nr. 1 und Abs. 2 JuSchG" },
  { label: "Schnaps oder ein Mixgetränk mit Schnaps trinken", law: "§ 9 Abs. 1 Nr. 2 JuSchG" },
  { label: "E-Zigarette kaufen und in der Öffentlichkeit rauchen", law: "§ 10 Abs. 1 JuSchG" },
  { label: "Öffentliche Disco bis 24 Uhr besuchen", law: "§ 5 Abs. 1 JuSchG" },
  { label: "Kinofilm mit Freigabe ab 16 sehen, Ende 21 Uhr", law: "§ 11 Abs. 1 JuSchG" },
] as const;

function allowed(s: LabState): { ok: boolean; why: string } {
  const withParent = s.begleitung === 1;
  switch (s.sit) {
    case 0:
      if (s.alter >= 16) return { ok: true, why: "Ab 16 Jahren dürfen Jugendliche Bier, Wein und Sekt bekommen und trinken." };
      if (s.alter >= 14 && withParent) return { ok: true, why: "Mit 14 und 15 Jahren ist das erlaubt, wenn eine personensorgeberechtigte Person, meist ein Elternteil, dabei ist." };
      return { ok: false, why: withParent ? "Unter 14 Jahren ist Alkohol in der Öffentlichkeit auch in Begleitung der Eltern nicht erlaubt." : "Unter 16 Jahren gibt es ohne Begleitung der Eltern kein Bier und keinen Wein." };
    case 1:
      return s.alter >= 18
        ? { ok: true, why: "Branntwein und branntweinhaltige Getränke sind erst ab 18 Jahren erlaubt." }
        : { ok: false, why: "Branntwein und Mixgetränke mit Schnaps sind für alle unter 18 verboten, auch in Begleitung der Eltern." };
    case 2:
      return s.alter >= 18
        ? { ok: true, why: "Tabakwaren und E-Zigaretten dürfen erst an Volljährige abgegeben werden." }
        : { ok: false, why: "Tabakwaren und andere nikotinhaltige Erzeugnisse, auch E-Zigaretten, gibt es erst ab 18. Auch das Rauchen in der Öffentlichkeit ist nicht gestattet." };
    case 3:
      if (withParent) return { ok: true, why: "In Begleitung einer personensorgeberechtigten oder erziehungsbeauftragten Person ist der Discobesuch erlaubt." };
      return s.alter >= 16
        ? { ok: true, why: "Ab 16 Jahren ist der Discobesuch ohne Begleitung bis 24 Uhr erlaubt." }
        : { ok: false, why: "Unter 16 Jahren ist eine öffentliche Tanzveranstaltung ohne Begleitung nicht erlaubt; Ausnahmen gelten etwa für Veranstaltungen anerkannter Träger der Jugendhilfe." };
    default:
      return s.alter >= 16
        ? { ok: true, why: "Der Film ist ab 16 freigegeben, und die Vorstellung endet vor 24 Uhr." }
        : { ok: false, why: "Die Altersfreigabe gilt auch in Begleitung der Eltern. Nur bei Filmen ab 12 dürfen Kinder ab 6 Jahren in Begleitung hinein." };
  }
}

export const JUGENDSCHUTZ: LabDef = {
  kind: "jugendschutz",
  title: "Jugendschutz-Check",
  intro:
    "Das Jugendschutzgesetz regelt, was in der Öffentlichkeit erlaubt ist. Wähle Alter, Situation und Begleitung. Die Ampel zeigt, ob das Gesetz es gestattet, und nennt die Vorschrift.",
  sliders: [{ key: "alter", label: "Alter", min: 12, max: 18, step: 1, unit: "Jahre", value: 15 }],
  selects: [
    { key: "sit", label: "Situation", options: SITUATIONS.map((x, value) => ({ value, label: x.label })), value: 4 },
    { key: "begleitung", label: "Begleitung", options: [{ value: 0, label: "ohne Eltern" }, { value: 1, label: "mit einem Elternteil (personensorgeberechtigt)" }], value: 0 },
  ],
  goals: [
    { id: "begleitung", text: "Finde ein Alter, in dem Bier nur in Begleitung eines Elternteils erlaubt ist, und stelle die Begleitung ein.", test: (s) => s.sit === 0 && s.alter >= 14 && s.alter < 16 && s.begleitung === 1 },
    { id: "achtzehn", text: "Zeige, dass Schnaps oder E-Zigaretten auch mit 17 und in Begleitung der Eltern verboten bleiben.", test: (s) => (s.sit === 1 || s.sit === 2) && s.alter === 17 && s.begleitung === 1 },
    { id: "disco", text: "Zeige, ab welchem Alter der Discobesuch bis 24 Uhr ohne Begleitung erlaubt ist.", test: (s) => s.sit === 3 && s.alter === 16 && s.begleitung === 0 },
    { id: "kino", text: "Stelle ein, wer den Film ab 16 allein sehen darf.", test: (s) => s.sit === 4 && s.alter >= 16 && s.begleitung === 0 },
  ],
  witness: {
    begleitung: { sit: 0, alter: 14, begleitung: 1 },
    achtzehn: { sit: 1, alter: 17, begleitung: 1 },
    disco: { sit: 3, alter: 16, begleitung: 0 },
    kino: { sit: 4, alter: 16, begleitung: 0 },
  },
  view(s) {
    const a = allowed(s);
    const situation = SITUATIONS[s.sit] ?? SITUATIONS[0];
    const body = `<rect class="lab-ampel" x="30" y="20" width="90" height="200" rx="22"/>
      <circle class="${a.ok ? "lab-light-off" : "lab-light-red"}" cx="75" cy="70" r="32"/>
      <circle class="${a.ok ? "lab-light-green" : "lab-light-off"}" cx="75" cy="170" r="32"/>
      <text class="lab-text lab-text-strong" x="150" y="60" style="font-size:22px">${a.ok ? "Erlaubt" : "Nicht erlaubt"}</text>
      <text class="lab-text lab-text-muted" x="150" y="88">${situation.law}</text>
      <text class="lab-text" x="150" y="122">${s.alter} Jahre · ${s.begleitung === 1 ? "mit Elternteil" : "ohne Eltern"}</text>`;
    return {
      figure: svg("Ampel: Ist das nach dem Jugendschutzgesetz erlaubt?", body, 470, 240) + flow(step(a.ok ? "ok" : "no", a.ok ? "Erlaubt" : "Nicht erlaubt", a.why)),
      readouts: [
        ["Ergebnis", a.ok ? "erlaubt" : "nicht erlaubt"],
        ["Vorschrift", situation.law],
      ],
      note: "Das Gesetz verpflichtet vor allem Veranstalter, Gastwirte und Verkäufer, die bei Zweifeln den Ausweis verlangen. Es schützt Kinder und Jugendliche und bestraft sie nicht.",
    };
  },
};
