import { type LabDef, type LabState, step } from "./engine";

const flow = (...steps: string[]) => `<div class="flow">${steps.join("")}</div>`;

const ACTS = [
  { label: "Ein Eis für 2 Euro kaufen und sofort bezahlen", pocket: true },
  { label: "Einen Laptop für 600 Euro auf Raten kaufen", pocket: false },
  { label: "Ein Fahrrad geschenkt bekommen und annehmen", pocket: false },
  { label: "Einen Handyvertrag über 24 Monate abschließen", pocket: false },
];

type Validity = { kind: "nichtig" | "wirksam" | "schwebend"; reason: string };

function validity(s: LabState): Validity {
  const act = ACTS[s.act];
  if (s.age < 7)
    return {
      kind: "nichtig",
      reason:
        "Wer unter sieben Jahre alt ist, ist geschäftsunfähig (§ 104 BGB). Seine Willenserklärung ist nichtig (§ 105 BGB); die Eltern können als gesetzliche Vertreter handeln.",
    };
  if (s.age >= 18)
    return { kind: "wirksam", reason: "Ab 18 Jahren ist man voll geschäftsfähig und bindet sich selbst." };
  if (s.act === 2)
    return {
      kind: "wirksam",
      reason:
        "Die Annahme eines Geschenks bringt dem Minderjährigen nur einen rechtlichen Vorteil (§ 107 BGB). Er braucht keine Zustimmung.",
    };
  if (act.pocket && s.consent === 0)
    return {
      kind: "wirksam",
      reason:
        "Taschengeldparagraf (§ 110 BGB): Der Vertrag ist wirksam, wenn der Minderjährige die Leistung mit Mitteln bewirkt, die ihm zu diesem Zweck oder zur freien Verfügung überlassen wurden.",
    };
  if (s.consent === 1)
    return {
      kind: "wirksam",
      reason:
        "Die Eltern haben vorher zugestimmt (Einwilligung, § 107 BGB). Der Vertrag ist von Anfang an wirksam.",
    };
  if (s.consent === 2)
    return {
      kind: "wirksam",
      reason:
        "Die Eltern genehmigen nachträglich (§ 108 Abs. 1 BGB). Der Vertrag ist rückwirkend von Anfang an wirksam.",
    };
  return {
    kind: "schwebend",
    reason:
      "Ohne Zustimmung der Eltern ist der Vertrag schwebend unwirksam (§ 108 Abs. 1 BGB): Er gilt erst, wenn die Eltern genehmigen. Der Händler darf sie zur Genehmigung auffordern (§ 108 Abs. 2 BGB).",
  };
}

const isMinor = (s: LabState) => s.age >= 7 && s.age < 18;
const needsConsent = (s: LabState) => s.act === 1 || s.act === 3;

export const GESCHAEFTSFAEHIGKEIT: LabDef = {
  kind: "geschaeftsfaehigkeit",
  title: "Wer darf welchen Vertrag schließen?",
  intro:
    "Stelle Alter, Geschäft und Zustimmung der Eltern ein. Das Modell zeigt, ob die Willenserklärung nichtig, schwebend unwirksam oder wirksam ist, und nennt die Vorschrift.",
  sliders: [{ key: "age", label: "Alter", min: 0, max: 25, step: 1, unit: "Jahre", value: 12 }],
  selects: [
    {
      key: "act",
      label: "Rechtsgeschäft",
      options: ACTS.map((a, value) => ({ value, label: a.label })),
      value: 1,
    },
    {
      key: "consent",
      label: "Zustimmung der Eltern",
      options: [
        { value: 0, label: "keine" },
        { value: 1, label: "vorher (Einwilligung)" },
        { value: 2, label: "nachträglich (Genehmigung)" },
      ],
      value: 1,
    },
  ],
  goals: [
    {
      id: "geschaeftsunfaehig",
      text: "Stelle ein Alter ein, bei dem jede eigene Willenserklärung nichtig ist.",
      test: (s) => s.age < 7,
    },
    {
      id: "schwebend",
      text: "Lass eine Zwölfjährige einen Raten- oder Handyvertrag ohne Zustimmung der Eltern schließen: Er ist schwebend unwirksam.",
      test: (s) => s.age === 12 && needsConsent(s) && s.consent === 0,
    },
    {
      id: "genehmigung",
      text: "Mache denselben Vertrag durch nachträgliche Genehmigung wirksam.",
      test: (s) => isMinor(s) && needsConsent(s) && s.consent === 2,
    },
    {
      id: "taschengeld",
      text: "Zeige den Taschengeldparagrafen: Ein Minderjähriger kauft ohne Zustimmung ein Eis, und der Kauf ist wirksam.",
      test: (s) => isMinor(s) && s.act === 0 && s.consent === 0,
    },
    {
      id: "volljaehrig",
      text: "Zeige, dass mit 18 Jahren keine Zustimmung mehr nötig ist.",
      test: (s) => s.age >= 18 && needsConsent(s) && s.consent === 0,
    },
  ],
  witness: {
    geschaeftsunfaehig: { age: 5, act: 0, consent: 0 },
    schwebend: { age: 12, act: 1, consent: 0 },
    genehmigung: { age: 12, act: 1, consent: 2 },
    taschengeld: { age: 12, act: 0, consent: 0 },
    volljaehrig: { age: 18, act: 1, consent: 0 },
  },
  view(s) {
    const v = validity(s);
    const stage =
      s.age < 7
        ? "geschäftsunfähig (unter 7)"
        : s.age < 18
          ? "beschränkt geschäftsfähig (7 bis 17)"
          : "voll geschäftsfähig (ab 18)";
    return {
      figure: flow(
        step("ok", "Rechtsfähig", "Jeder Mensch ist von Geburt an rechtsfähig: Er kann Rechte und Pflichten haben."),
        step(s.age < 7 ? "no" : s.age < 18 ? "skip" : "ok", `Geschäftsfähigkeit: ${stage}`, "Die Geschäftsfähigkeit ist die Fähigkeit, durch eigene Willenserklärungen wirksame Verträge zu schließen."),
        step(
          v.kind === "wirksam" ? "ok" : v.kind === "nichtig" ? "no" : "skip",
          v.kind === "wirksam" ? "Der Vertrag ist wirksam" : v.kind === "nichtig" ? "Die Willenserklärung ist nichtig" : "Der Vertrag ist schwebend unwirksam",
          v.reason,
        ),
      ),
      readouts: [
        ["Alter", `${s.age} Jahre`],
        ["Ergebnis", v.kind === "wirksam" ? "wirksam" : v.kind === "nichtig" ? "nichtig" : "schwebend unwirksam"],
      ],
      note: "Das Modell zeigt Regelfälle. Besondere Vorschriften bleiben ausgeklammert, etwa für Arbeitsverträge oder für lange Verträge, die über die Volljährigkeit hinauslaufen und zusätzlich die Zustimmung des Familiengerichts brauchen können.",
    };
  },
};

const FIRST = [
  "Das Fahrrad steht mit Preisschild im Schaufenster",
  "Die Händlerin sagt: „Das Rad bekommen Sie für 300 Euro.“ (verbindlich)",
  "Der Kunde sagt: „Ich nehme das Rad für 300 Euro.“",
];
const REPLY = [
  "Die andere Seite sagt nichts",
  "Die andere Seite sagt: „Einverstanden.“",
  "Die andere Seite sagt: „Nur für 250 Euro.“",
];

const contract = (s: LabState) => (s.first === 1 || s.first === 2) && s.reply === 1;
const owner = (s: LabState) => contract(s) && s.handed === 1 && (s.paid === 1 || s.ev === 0);

export const KAUFVERTRAG: LabDef = {
  kind: "kaufvertrag",
  title: "Vom Antrag bis zum Eigentum",
  intro:
    "Ein Kaufvertrag entsteht durch zwei übereinstimmende Willenserklärungen. Danach folgt die Erfüllung. Spiele den Ablauf durch und beobachte, wann der Vertrag steht und wem die Ware gehört.",
  sliders: [],
  selects: [
    { key: "first", label: "Erste Erklärung", options: FIRST.map((label, value) => ({ value, label })), value: 0 },
    { key: "reply", label: "Antwort der anderen Seite", options: REPLY.map((label, value) => ({ value, label })), value: 0 },
    {
      key: "handed",
      label: "Ware übergeben",
      options: [
        { value: 0, label: "noch nicht" },
        { value: 1, label: "ja, Käufer hat die Ware" },
      ],
      value: 0,
    },
    {
      key: "paid",
      label: "Kaufpreis bezahlt",
      options: [
        { value: 0, label: "noch nicht" },
        { value: 1, label: "ja, vollständig" },
      ],
      value: 0,
    },
    {
      key: "ev",
      label: "Eigentumsvorbehalt",
      options: [
        { value: 0, label: "nicht vereinbart" },
        { value: 1, label: "vereinbart" },
      ],
      value: 0,
    },
  ],
  goals: [
    {
      id: "vertrag",
      text: "Lass einen Kaufvertrag zustande kommen: ein Antrag und eine passende Annahme.",
      test: (s) => contract(s),
    },
    {
      id: "nur-verpflichtung",
      text: "Zeige das Verpflichtungsgeschäft allein: Der Vertrag besteht, aber weder Ware noch Geld sind geflossen.",
      test: (s) => contract(s) && s.handed === 0 && s.paid === 0,
    },
    {
      id: "vorbehalt",
      text: "Zeige den Eigentumsvorbehalt: Der Käufer hat die Ware, aber der Verkäufer bleibt Eigentümer.",
      test: (s) => contract(s) && s.handed === 1 && s.ev === 1 && s.paid === 0,
    },
    {
      id: "eigentum",
      text: "Mache den Käufer zum Eigentümer.",
      test: (s) => owner(s),
    },
  ],
  witness: {
    vertrag: { first: 1, reply: 1, handed: 0, paid: 0, ev: 0 },
    "nur-verpflichtung": { first: 1, reply: 1, handed: 0, paid: 0, ev: 0 },
    vorbehalt: { first: 1, reply: 1, handed: 1, paid: 0, ev: 1 },
    eigentum: { first: 2, reply: 1, handed: 1, paid: 1, ev: 1 },
  },
  view(s) {
    const made = contract(s);
    let negotiation: string;
    if (s.first === 0)
      negotiation =
        s.reply === 1
          ? "Die Auslage ist nur eine Aufforderung, selbst ein Angebot abzugeben. Dein „Einverstanden“ ist erst der Antrag; der Vertrag kommt zustande, wenn der Händler annimmt."
          : "Die Auslage im Schaufenster ist noch kein Antrag, sondern nur eine Aufforderung an Kunden, selbst ein Angebot abzugeben.";
    else if (s.reply === 1) negotiation = "Antrag und Annahme stimmen überein: Der Kaufvertrag ist zustande gekommen.";
    else if (s.reply === 2)
      negotiation = "Eine Annahme mit Änderung gilt als Ablehnung verbunden mit einem neuen Antrag (§ 150 Abs. 2 BGB). Ein Vertrag entsteht erst, wenn die andere Seite zustimmt.";
    else negotiation = "Schweigen gilt in der Regel nicht als Annahme. Ein Vertrag entsteht durch eine Willenserklärung.";
    return {
      figure: flow(
        step(made ? "ok" : "no", "1 · Verpflichtungsgeschäft: Kaufvertrag", negotiation),
        step(
          !made ? "skip" : s.handed === 1 ? "ok" : "no",
          "2 · Erfüllung: Übergabe der Ware",
          !made
            ? "Ohne Vertrag besteht keine Pflicht zur Übergabe."
            : s.handed === 1
              ? "Der Käufer besitzt die Ware: Er hat die tatsächliche Gewalt über sie."
              : "Der Käufer kann die Übergabe verlangen, der Verkäufer ist dazu verpflichtet (§ 433 Abs. 1 BGB).",
        ),
        step(
          !made ? "skip" : s.paid === 1 ? "ok" : "no",
          "3 · Erfüllung: Zahlung des Kaufpreises",
          !made
            ? "Ohne Vertrag besteht keine Pflicht zur Zahlung."
            : s.paid === 1
              ? "Der Verkäufer hat sein Geld."
              : "Der Verkäufer kann die Zahlung und die Abnahme verlangen (§ 433 Abs. 2 BGB).",
        ),
        step(
          owner(s) ? "ok" : "skip",
          owner(s) ? "Eigentümer ist der Käufer" : "Eigentümer bleibt der Verkäufer",
          owner(s)
            ? "Mit Übergabe und Einigung geht das Eigentum über (§ 929 BGB); ein Eigentumsvorbehalt ist durch die Zahlung erledigt, oder es gab keinen."
            : made && s.handed === 1 && s.ev === 1
              ? "Der Eigentumsvorbehalt schützt den Verkäufer: Die Ware gehört ihm, bis der Kaufpreis vollständig bezahlt ist."
              : "Das Eigentum geht erst mit der Übergabe über, bei einem Eigentumsvorbehalt erst mit der vollständigen Zahlung.",
        ),
      ),
      readouts: [
        ["Kaufvertrag", made ? "besteht" : "besteht nicht"],
        ["Besitzer der Ware", made && s.handed === 1 ? "Käufer" : "Verkäufer"],
        ["Eigentümer der Ware", owner(s) ? "Käufer" : "Verkäufer"],
      ],
      note: "Besitz heißt, die Sache tatsächlich zu haben; Eigentum heißt, ihr Eigentümer zu sein. Beides kann auseinanderfallen.",
    };
  },
};

const OUTCOME = {
  tatbestand: [
    "Ein Fundstück wird gemeldet. Keine strafbare Handlung beschrieben.",
    "Eine Person wird absichtlich verletzt (Körperverletzung, § 223 StGB).",
    "Noch nicht gewählt: Was ist geschehen?",
  ],
  rechtfertigung: [
    "Kein Rechtfertigungsgrund",
    "Notwehr: Die Tat wehrt einen gegenwärtigen rechtswidrigen Angriff ab (§ 32 StGB)",
  ],
  schuld: [
    "Die Person ist schuldfähig",
    "Die Person ist ein Kind unter 14 Jahren (schuldunfähig, § 19 StGB)",
    "Die Person handelt wegen einer schweren seelischen Störung ohne Einsicht (§ 20 StGB)",
  ],
};

const chain = (s: LabState) => ({
  tatbestand: s.t === 1,
  rechtswidrig: s.t === 1 && s.r === 0,
  schuldhaft: s.t === 1 && s.r === 0 && s.s === 0,
});

export const STRAFBARKEIT: LabDef = {
  kind: "strafbarkeit",
  title: "Die drei Stufen der Strafbarkeit",
  intro:
    "Strafbar ist eine Tat nur, wenn sie den Tatbestand erfüllt, rechtswidrig ist und schuldhaft begangen wurde. Ändere die Umstände und beobachte, auf welcher Stufe die Prüfung endet.",
  sliders: [],
  selects: [
    {
      key: "t",
      label: "Tatbestand",
      options: OUTCOME.tatbestand.map((label, value) => ({ value, label })),
      value: 2,
    },
    {
      key: "r",
      label: "Rechtfertigung",
      options: OUTCOME.rechtfertigung.map((label, value) => ({ value, label })),
      value: 0,
    },
    {
      key: "s",
      label: "Schuld",
      options: OUTCOME.schuld.map((label, value) => ({ value, label })),
      value: 0,
    },
  ],
  goals: [
    {
      id: "strafbar",
      text: "Mache die Tat strafbar: Alle drei Stufen sind erfüllt.",
      test: (s) => chain(s).schuldhaft,
    },
    {
      id: "gerechtfertigt",
      text: "Zeige eine erfüllte Tat, die nicht rechtswidrig ist: Notwehr.",
      test: (s) => s.t === 1 && s.r === 1,
    },
    {
      id: "schuldunfaehig",
      text: "Zeige eine rechtswidrige Tat, die trotzdem nicht bestraft wird, weil die Schuld fehlt.",
      test: (s) => s.t === 1 && s.r === 0 && s.s !== 0,
    },
    {
      id: "kein-tatbestand",
      text: "Zeige, dass die Prüfung schon auf der ersten Stufe endet, wenn kein Tatbestand erfüllt ist.",
      test: (s) => s.t === 0,
    },
  ],
  witness: {
    strafbar: { t: 1, r: 0, s: 0 },
    gerechtfertigt: { t: 1, r: 1, s: 0 },
    schuldunfaehig: { t: 1, r: 0, s: 1 },
    "kein-tatbestand": { t: 0, r: 0, s: 0 },
  },
  view(s) {
    const c = chain(s);
    return {
      figure: flow(
        step(c.tatbestand ? "ok" : s.t === 2 ? "skip" : "no", "1 · Tatbestand erfüllt?", OUTCOME.tatbestand[s.t]),
        step(
          !c.tatbestand ? "skip" : c.rechtswidrig ? "ok" : "no",
          "2 · Rechtswidrig?",
          !c.tatbestand
            ? s.t === 2
              ? "Folgt, sobald du gewählt hast, was geschehen ist."
              : "Entfällt: Ohne Tatbestand wird nicht weiter geprüft."
            : OUTCOME.rechtfertigung[s.r],
        ),
        step(
          !c.rechtswidrig ? "skip" : c.schuldhaft ? "ok" : "no",
          "3 · Schuldhaft?",
          !c.rechtswidrig
            ? s.t === 2
              ? "Folgt, sobald du gewählt hast, was geschehen ist."
              : s.t === 0
                ? "Entfällt: Ohne Tatbestand wird nicht weiter geprüft."
                : "Entfällt: Eine gerechtfertigte Tat ist nicht rechtswidrig."
            : OUTCOME.schuld[s.s],
        ),
        s.t === 2
          ? step("skip", "Ergebnis: noch offen", "Wähle zuerst, was geschehen ist. Dann prüfst du die drei Stufen der Reihe nach.")
          : step(c.schuldhaft ? "no" : "ok", c.schuldhaft ? "Ergebnis: strafbar" : "Ergebnis: nicht strafbar", c.schuldhaft ? "Alle drei Voraussetzungen liegen vor. Das Gericht bestimmt die Rechtsfolge." : "Mindestens eine Voraussetzung fehlt, deshalb gibt es keine Strafe."),
      ),
      readouts: [["Strafbar?", s.t === 2 ? "noch offen" : c.schuldhaft ? "ja" : "nein"]],
      note: "Die Prüfung läuft immer in dieser Reihenfolge. Fehlt eine Stufe, endet sie dort.",
    };
  },
};

const jugend = (s: LabState): { group: string; law: string; text: string; jgg: boolean } => {
  if (s.age < 14)
    return {
      group: "Kind",
      law: "keine Strafe",
      text: "Kinder unter 14 Jahren sind schuldunfähig (§ 19 StGB). Sie werden nicht bestraft; Jugendamt und Familiengericht können helfen.",
      jgg: false,
    };
  if (s.age < 18)
    return s.dev === 0
      ? {
          group: "Jugendlicher",
          law: "Jugendstrafrecht (JGG)",
          text: "Jugendliche sind verantwortlich, wenn sie reif genug sind, das Unrecht einzusehen und danach zu handeln (§ 3 JGG). Es gilt das Jugendgerichtsgesetz.",
          jgg: true,
        }
      : {
          group: "Jugendlicher",
          law: "keine Strafe",
          text: "Ein Jugendlicher, der nicht reif genug ist, das Unrecht einzusehen, ist nicht verantwortlich (§ 3 JGG). Es kommen Erziehungsmaßnahmen in Betracht.",
          jgg: false,
        };
  if (s.age < 21)
    return s.dev === 1
      ? {
          group: "Heranwachsender",
          law: "Jugendstrafrecht (JGG)",
          text: "Auf Heranwachsende wendet das Gericht Jugendstrafrecht an, wenn sie in ihrer Entwicklung noch einem Jugendlichen gleichstehen oder es sich um eine Jugendverfehlung handelt (§ 105 JGG).",
          jgg: true,
        }
      : {
          group: "Heranwachsender",
          law: "Erwachsenenstrafrecht (StGB)",
          text: "Ein Heranwachsender, der in seiner Entwicklung einem Erwachsenen entspricht, wird nach dem Strafgesetzbuch beurteilt, solange die Tat keine Jugendverfehlung ist (§ 105 JGG).",
          jgg: false,
        };
  return {
    group: "Erwachsener",
    law: "Erwachsenenstrafrecht (StGB)",
    text: "Ab 21 Jahren gilt immer das allgemeine Strafrecht.",
    jgg: false,
  };
};

export const JUGENDSTRAFRECHT: LabDef = {
  kind: "jugendstrafrecht",
  title: "Welches Strafrecht gilt für wen?",
  intro:
    "Stelle Alter und Entwicklungsstand ein. Das Modell zeigt, ob Jugendstrafrecht gilt, ob Erwachsenenstrafrecht gilt oder ob gar keine Strafe in Betracht kommt, und welche Folgen das Jugendstrafrecht kennt.",
  sliders: [{ key: "age", label: "Alter zur Tatzeit", min: 10, max: 24, step: 1, unit: "Jahre", value: 16 }],
  selects: [
    {
      key: "dev",
      label: "Entwicklungsstand",
      options: [
        { value: 0, label: "entspricht dem Alter" },
        { value: 1, label: "bleibt hinter dem Alter zurück" },
      ],
      value: 0,
    },
  ],
  goals: [
    {
      id: "kind",
      text: "Zeige, dass ein 13-Jähriger nicht bestraft werden kann.",
      test: (s) => s.age === 13,
    },
    {
      id: "jugendlicher",
      text: "Zeige einen 15-Jährigen, der nach Jugendstrafrecht beurteilt wird.",
      test: (s) => s.age === 15 && s.dev === 0,
    },
    {
      id: "nicht-reif",
      text: "Zeige einen 17-Jährigen, der nicht verantwortlich ist, weil er nicht reif genug ist.",
      test: (s) => s.age === 17 && s.dev === 1,
    },
    {
      id: "heranwachsend-jgg",
      text: "Zeige einen 19-Jährigen, auf den wegen Reifeverzögerung Jugendstrafrecht angewendet wird.",
      test: (s) => s.age === 19 && s.dev === 1,
    },
    {
      id: "heranwachsend-stgb",
      text: "Zeige einen 19-Jährigen, für den das Erwachsenenstrafrecht gilt.",
      test: (s) => s.age === 19 && s.dev === 0,
    },
  ],
  witness: {
    kind: { age: 13, dev: 0 },
    jugendlicher: { age: 15, dev: 0 },
    "nicht-reif": { age: 17, dev: 1 },
    "heranwachsend-jgg": { age: 19, dev: 1 },
    "heranwachsend-stgb": { age: 19, dev: 0 },
  },
  view(s) {
    const j = jugend(s);
    return {
      figure: flow(
        step(j.group === "Kind" ? "no" : "ok", `Altersgruppe: ${j.group}`, `${s.age} Jahre zur Tatzeit.`),
        step(j.jgg ? "ok" : j.law === "keine Strafe" ? "no" : "skip", `Anwendbares Recht: ${j.law}`, j.text),
        step(
          j.jgg ? "ok" : "skip",
          "Mögliche Folgen im Jugendstrafrecht",
          j.jgg
            ? "Erziehungsmaßregeln (zum Beispiel Weisungen), Zuchtmittel (Verwarnung, Auflagen, Jugendarrest) und die Jugendstrafe, wenn die anderen Mittel nicht reichen oder die Schuld schwer wiegt. Der Erziehungsgedanke steht im Vordergrund."
            : "Hier kommen die Folgen des Jugendstrafrechts nicht zur Anwendung.",
        ),
      ),
      readouts: [
        ["Altersgruppe", j.group],
        ["Anwendbares Recht", j.law],
      ],
      note: "Maßgeblich ist das Alter zur Tatzeit, nicht zum Zeitpunkt des Urteils.",
    };
  },
};
