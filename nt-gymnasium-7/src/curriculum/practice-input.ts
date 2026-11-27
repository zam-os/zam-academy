import type { ExerciseGenerator, ExerciseTask, NumberField, TextField } from "../model/types";

function inputTask(
  prompt: string,
  hint: string,
  explanation: string,
  fields: Array<NumberField | TextField>,
): ExerciseTask {
  const solution = fields.map((field) => {
    const answer = field.kind === "number" ? field.answer : field.answers[0];
    return `${field.label} ${answer}`;
  });
  return {
    prompt,
    given: [],
    formulaHint: hint,
    fields,
    steps: [hint, explanation, `<strong>${solution.join(" · ")}</strong>`],
  };
}

function integer(label: string, answer: number): NumberField {
  return { kind: "number", label, answer, digits: 0, unit: "" };
}

function exactText(label: string, answer: string, placeholder: string): TextField {
  return { kind: "text", label, answers: [answer], placeholder, caseSensitive: true };
}

const TOPICS = ["Bühne", "Mensa", "Bücherei", "AGs", "Kontakt", "Sporthalle", "Termine"];
const PATHS = [
  "/ag/theater",
  "/service/buecherei",
  "/klassen/projekte",
  "/info/feste",
  "/service/speiseplan",
  "/ag/roboter",
];

export const countLinks: ExerciseGenerator = {
  id: "kanten-zaehlen",
  make(rng, level) {
    const [start, ...pages] = rng.shuffle(TOPICS);
    const count = rng.int(2, 5);
    const targets = pages.slice(0, count);
    if (level === 1) {
      const edges = rng.shuffle([
        ...targets.map((page) => `${start} → ${page}`),
        `${pages[5]} → ${start}`,
      ]);
      return inputTask(
        `Im Wiki stehen diese Verweise: ${edges.join(", ")}. Wie viele beginnen bei „${start}“?`,
        "Lies die Seite links vom Pfeil.",
        `Zähle die Pfeile von ${start} zu ${targets.join(", ")}. Der Pfeil zu ${start} beginnt auf einer anderen Seite.`,
        [integer("Ausgehende Verweise", count)],
      );
    }
    const circuit = [start, ...targets, start];
    const edges = circuit.slice(0, -1).map((page, index) => `${page} → ${circuit[index + 1]}`);
    return inputTask(
      `Die Seiten eines Veranstaltungswikis haben diese Verweise: ${rng.shuffle(edges).join(", ")}. Wie viele Klicks brauchst du von „${start}“, bis du auf diesem Weg zum ersten Mal zu „${start}“ zurückkehrst?`,
      "Ordne die Verweise, indem du jeweils von der zuletzt erreichten Seite aus weitergehst.",
      `Dein Weg lautet ${circuit.join(" → ")}. Jeder Pfeil zählt als ein Klick.`,
      [integer("Klicks", circuit.length - 1)],
    );
  },
};

export const editLink: ExerciseGenerator = {
  id: "linkziel-eintragen",
  make(rng, level) {
    const [path, wrong] = rng.shuffle(PATHS);
    if (level === 1) {
      return inputTask(
        `Im Editor soll „Details öffnen“ zur Wiki-Seite mit dem Pfad ${path} führen. Trage die Zieladresse innerhalb des Wikis ein.`,
        "Der Linktext ist die sichtbare Aufschrift. Gib den gespeicherten Pfad ein.",
        `Die Zieladresse muss genau dem Pfad der veröffentlichten Seite entsprechen: ${path}.`,
        [exactText("Zieladresse", path, "z. B. /info")],
      );
    }
    return inputTask(
      `Beim Umzug des Wikis wird der Inhalt von ${wrong} nach ${path} verschoben. Der Link „Details öffnen“ soll denselben Inhalt erreichen und gleich beschriftet bleiben. Korrigiere das gespeicherte Ziel.`,
      "Verfolge den Inhalt, der verschoben wurde.",
      `Das bisher gespeicherte Ziel ${wrong} verweist auf den alten Platz. Der neue Pfad ist ${path}.`,
      [exactText("Neue Zieladresse", path, "z. B. /info")],
    );
  },
};

export const countOriginals: ExerciseGenerator = {
  id: "originalbelege-zaehlen",
  make(rng, level) {
    const [topic, source] = rng.pick([
      ["die Wasserqualität", "Umweltamt"],
      ["den Schulweg", "Verkehrsamt"],
      ["die Stadtbäume", "Grünflächenamt"],
      ["alte Karten", "Stadtarchiv"],
      ["die Besucherzahlen", "Stadtmuseum"],
    ]);
    const ownCheck = rng.int(0, 1);
    const report = ownCheck ? "erhebt eigene Daten" : "übernimmt die Daten des Amts unverändert";
    if (level === 1) {
      return inputTask(
        `Du recherchierst über ${topic}. Quelle A enthält Originaldaten vom ${source}. B zitiert A und C ${report}. Wie viele voneinander unabhängige Belege gibt es?`,
        "Zähle jede ursprüngliche Untersuchung nur einmal.",
        ownCheck
          ? "A und C liefern eigene Daten. B stützt sich auf A."
          : "Nur A liefert eigene Daten. B und C stützen sich auf A.",
        [integer("Unabhängige Belege", 1 + ownCheck)],
      );
    }
    return inputTask(
      `Für ein Referat über ${topic} findest du drei Meldungen: Die Schule zitiert einen Blog. Der Blog nennt als Beleg das ${source}. Eine vierte Fundstelle, eine Zeitung, ${report}. Wie viele eigenständige Untersuchungen bleiben, wenn du die Herkunft zurückverfolgst?`,
      "Gehe für jede Fundstelle zurück bis zu der Stelle, an der Daten erhoben wurden.",
      ownCheck
        ? "Schule und Blog führen zur selben Untersuchung des Amts. Die Zeitung verwendet eigene Daten."
        : "Schule, Blog und Zeitung führen alle zu den Daten des Amts.",
      [integer("Eigenständige Untersuchungen", 1 + ownCheck)],
    );
  },
};

export const readUrl: ExerciseGenerator = {
  id: "url-bauen",
  make(rng, level) {
    const path = rng.pick(PATHS);
    const host = rng.pick(["schule.example", "stadt.example", "wiki.example", "archiv.example"]);
    const url = `https://${host}${path}`;
    if (level === 1) {
      return inputTask(
        `Eine Nachricht enthält die Adresse ${url}. Gib den Pfad an, der die Ressource auf dem Server auswählt.`,
        "Der Pfad beginnt beim ersten Schrägstrich nach dem Rechnernamen.",
        `Der Rechnername lautet ${host}. Direkt danach steht der Pfad ${path}.`,
        [exactText("Pfad", path, "z. B. /info")],
      );
    }
    return inputTask(
      `Das Schulwiki zieht von alt.example zu ${host}. Die Ressource bleibt unter ${path} erreichbar, und der Zugriff bleibt bei HTTPS. Gib die vollständige neue URL an.`,
      "Setze Zugriffsart, neuen Rechnernamen und unveränderten Pfad zusammen.",
      `Auf https:// folgt der neue Rechnername ${host}. Daran schließt sich ${path} an.`,
      [exactText("Neue URL", url, "z. B. https://schule.example/info")],
    );
  },
};

export const traceSequence: ExerciseGenerator = {
  id: "befehlsfolge-verfolgen",
  make(rng, level) {
    const column = rng.int(1, 3);
    const row = rng.int(4, 6);
    const steps =
      level === 1
        ? ["→", "→", "↑"]
        : rng.pick([
            ["↑", "←", "↑", "→"],
            ["↑", "→", "→", "↓"],
            ["←", "↑", "↑", "←"],
          ]);
    const finalColumn =
      column + steps.filter((s) => s === "→").length - steps.filter((s) => s === "←").length;
    const finalRow = row + steps.filter((s) => s === "↓").length - steps.filter((s) => s === "↑").length;
    if (level === 1) {
      return inputTask(
        `Der Roboter startet in Spalte ${column}, Zeile ${row}. Er führt ${steps.join(" ")} aus. Jeder Pfeil bedeutet ein Feld in diese Richtung. Die Zeilen werden von oben gezählt. Wo steht er am Ende?`,
        "Verändere die Koordinaten nach jedem Pfeil.",
        `Die beiden Rechtsschritte erhöhen die Spalte auf ${finalColumn}. Der Hoch-Schritt senkt die Zeile auf ${finalRow}.`,
        [integer("Spalte", finalColumn), integer("Zeile", finalRow)],
      );
    }
    // A coordinate on the edge would make leftward steps invalid before the replay.
    const startColumn = column + 2;
    return inputTask(
      `Der Roboter führt ${steps.join(" ")} aus und landet in Spalte ${finalColumn + 2}, Zeile ${finalRow}. Jeder Pfeil bedeutet ein Feld. Die Zeilen werden von oben gezählt. Von welcher Zelle muss das Programm gestartet sein?`,
      "Verfolge die Schritte in umgekehrter Reihenfolge und kehre jede Richtung um.",
      `Rückwärts gehst du ${steps
        .slice()
        .reverse()
        .map((step) => ({ "←": "→", "→": "←", "↑": "↓", "↓": "↑" })[step])
        .join(" ")}. Damit findest du die Startzelle.`,
      [integer("Startspalte", startColumn), integer("Startzeile", row)],
    );
  },
};

const SIGNALS = [
  ["Halle", "Platz frei", "grün", "rot"],
  ["Gewächshaus", "Erde trocken", "pumpen", "warten"],
  ["Bühne", "Tür geschlossen", "spielen", "anhalten"],
  ["Werkraum", "Licht an", "dimmen", "einschalten"],
] as const;

export const traceBranch: ExerciseGenerator = {
  id: "zweig-auswerten",
  make(rng, level) {
    const [place, condition, yes, no] = rng.pick(SIGNALS);
    const truth = rng.int(0, 1) === 1;
    const result = truth ? yes : no;
    if (level === 1) {
      return inputTask(
        `Die Steuerung (${place}) prüft „${condition}“. Bei wahr gibt sie „${yes}“ aus, sonst „${no}“. Heute ist die Bedingung ${truth ? "wahr" : "falsch"}. Welche Ausgabe erscheint?`,
        "Streiche den Zweig, der in diesem Fall nicht läuft.",
        `Die Bedingung ist ${truth ? "wahr, also läuft der Dann-Zweig" : "falsch, also läuft der Sonst-Zweig"}.`,
        [exactText("Ausgabe", result, "Ausgabe aus dem Programm")],
      );
    }
    return inputTask(
      `Im Protokoll der Steuerung (${place}) erscheint „${result}“. Das Programm lautet: WENN ${condition}, DANN „${yes}“ ausgeben, SONST „${no}“ ausgeben. Wie war die Bedingung bei der Prüfung? Gib wahr oder falsch ein.`,
      "Vergleiche die protokollierte Ausgabe mit den beiden Zweigen.",
      `Die Ausgabe „${result}“ kommt aus dem ${truth ? "Dann" : "Sonst"}-Zweig. In diesem Fall war die Bedingung ${truth ? "wahr" : "falsch"}.`,
      [
        {
          kind: "text",
          label: "Bedingung",
          answers: [truth ? "wahr" : "falsch"],
          placeholder: "wahr oder falsch",
        },
      ],
    );
  },
};

export const countRepeats: ExerciseGenerator = {
  id: "zaehlschleife-berechnen",
  make(rng, level) {
    const repeats = rng.int(2, 6);
    const perRound = rng.int(2, 4);
    if (level === 1) {
      return inputTask(
        `Eine Zählschleife läuft ${repeats}-mal. Im Block werden jeweils ${perRound} Spielmarken abgelegt. Wie viele Marken legt die Schleife insgesamt ab?`,
        "Multipliziere die Zahl der Durchläufe mit der Zahl der Marken je Durchlauf.",
        `${repeats} Durchläufe mit je ${perRound} Marken ergeben ${repeats * perRound} Marken.`,
        [integer("Abgelegte Marken", repeats * perRound)],
      );
    }
    return inputTask(
      `Ein Automat gibt in jedem Schleifendurchlauf ${perRound} Karten aus. Nach der Schleife gibt er noch eine einzelne Karte aus. Am Ende liegen ${repeats * perRound + 1} Karten da. Wie oft lief der Schleifenblock?`,
      "Ziehe die einzelne Karte ab, bevor du die Karten aus der Schleife gruppierst.",
      `In der Schleife entstanden ${repeats * perRound} Karten. Das sind ${repeats} Gruppen zu je ${perRound} Karten.`,
      [integer("Durchläufe", repeats)],
    );
  },
};

export const countWhile: ExerciseGenerator = {
  id: "solange-verfolgen",
  make(rng, level) {
    const start = rng.int(1, 6);
    const target = rng.int(3, 8);
    if (level === 1) {
      return inputTask(
        `Eine Kiste enthält ${start} Murmeln. Solange es weniger als ${target} sind, legst du eine Murmel hinein. Wie oft fügst du eine Murmel hinzu?`,
        "Prüfe die Anzahl zuerst und nach jeder neuen Murmel.",
        start >= target
          ? "Die Bedingung ist schon vor dem ersten Durchlauf falsch."
          : `Du zählst von ${start} bis ${target} hoch. Dann ist „weniger als ${target}“ falsch.`,
        [integer("Durchläufe", Math.max(0, target - start))],
      );
    }
    const rounds = Math.max(0, Math.ceil((target - start) / 2));
    return inputTask(
      `Ein Roboter füllt einen Vorrat von ${start} Teilen auf. Vor jedem Durchlauf prüft er „weniger als ${target} Teile?“. Wenn ja, legt er zwei weitere Teile dazu. Wie oft führt er den Block aus und wie viele Teile sind danach im Vorrat?`,
      "Schreibe den Bestand nach jeder Zugabe auf. Prüfe vor der ersten Zugabe und nach jeder Änderung.",
      rounds === 0
        ? "Die Grenze ist bereits erreicht oder überschritten, also führt der Roboter den Block keinmal aus."
        : `Bestandsfolge: ${Array.from({ length: rounds + 1 }, (_, i) => start + 2 * i).join(" → ")}. Der letzte Bestand ist groß genug zum Anhalten.`,
      [integer("Durchläufe", rounds), integer("Teile im Vorrat", start + 2 * rounds)],
    );
  },
};
