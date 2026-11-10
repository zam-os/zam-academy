import { type CellKind, fmt, type Model, type ModelState } from "./model/readout";

export type { ModelState } from "./model/readout";

export function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

const temperatures = [20, 40, 60];
const measurements = [
  [2, 3, 2],
  [6, 5, 7],
  [1, 0, 1],
] as const;
const enzymeTemperature = [0.28, 0.68, 1, 0.12];
const enzymePH = [0.18, 0.65, 1, 0.4];
const substrate = [0, 1, 2, 4, 8];

export function enzymeRate([t, ph, s]: ModelState): number {
  return (100 * enzymeTemperature[t] * enzymePH[ph] * substrate[s]) / (1 + substrate[s]);
}

const areas = [1, 2, 4];
const lengths = [1, 2];
const gradients = [0, 2, 4];

export function diffusionRate([area, distance, gradient]: ModelState): number {
  return (areas[area] * gradients[gradient]) / lengths[distance];
}

export function atpSeries(synthesis: number, demand: number) {
  // The model reuses a fixed pool of 12 adenine nucleotide units.
  let atp = 8;
  return Array.from({ length: 4 }, (_, i) => {
    const used = Math.min(demand, atp);
    const made = Math.min(synthesis, 12 - (atp - used));
    atp += made - used;
    return { step: i + 1, atp, adp: 12 - atp, used, made };
  });
}

const bases: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };
export function dnaComplement(sequence: string): string | null {
  return /^[ACGT]+$/.test(sequence) ? [...sequence].map((base) => bases[base]).join("") : null;
}

const antibodyCurves = [
  [0, 0, 1, 4, 6, 3],
  [0, 3, 7, 10, 8, 5],
  [10, 8, 6, 5, 3, 1],
] as const;

const circuit = [
  "Rechte Herzkammer",
  "Lungenarterie",
  "Lungenkapillaren",
  "Lungenvene",
  "Linke Herzkammer",
  "Körperarterie",
  "Körperkapillaren",
  "Körpervene",
] as const;
const circuitFacts = [
  "Die rechte Herzkammer pumpt sauerstoffärmeres Blut zur Lunge.",
  "Die Lungenarterie führt sauerstoffärmeres Blut vom Herzen weg.",
  "In den Lungenkapillaren nimmt das Blut Sauerstoff auf und gibt Kohlenstoffdioxid ab.",
  "Die Lungenvene führt sauerstoffreicheres Blut zum linken Herzen zurück.",
  "Die linke Herzkammer pumpt sauerstoffreicheres Blut in den Körper.",
  "Die Körperarterien führen das Blut zu den Geweben.",
  "Im Gewebe gibt Hämoglobin Sauerstoff ab. Sauerstoff diffundiert zu den Zellen.",
  "Die Körpervenen führen das Blut zum rechten Herzen zurück.",
] as const;

const divisionPhases = [
  "Vor DNA-Kopie",
  "Nach DNA-Kopie",
  "Nach Reifeteilung I",
  "Nach Reifeteilung II",
] as const;
export function divisionReadout(phase: number, crossed: boolean) {
  const chromosomes = phase < 2 ? 4 : 2;
  const chromatids = [4, 8, 4, 2][phase];
  const nuclei = [1, 1, 2, 4][phase];
  const left = crossed ? "1m + 2v" : "1m + 2m";
  const right = crossed ? "1v + 2m" : "1v + 2v";
  return { chromosomes, chromatids, nuclei, left, right };
}

export const MODELS = {
  messdaten: {
    title: "Datenwerkstatt: Vom Wert zur Kurve",
    instruction:
      "Wähle eine Darstellung. Achte darauf, welche Information beim Wechsel verloren geht.",
    controls: [
      {
        label: "Darstellung",
        options: ["Auswahl treffen", "Einzelwerte", "Mittelwerte", "Streuung"],
      },
    ],
    start: [0],
    goals: [
      {
        id: "roh",
        label: "Lies die drei Wiederholungen pro Temperatur ab.",
        reached: ([mode]) => mode === 1,
      },
      {
        id: "mittel",
        label: "Stelle die Mittelwerte als Diagramm dar.",
        reached: ([mode]) => mode === 2,
      },
      {
        id: "streuung",
        label: "Vergleiche die Spannweite zwischen kleinster und größter Messung.",
        reached: ([mode]) => mode === 3,
      },
    ],
    read: ([mode]) => {
      if (mode === 0)
        return { summary: "Der Modellversuch misst die Gasbildungsrate bei drei Temperaturen." };
      if (mode === 1)
        return {
          summary: "Einzelwerte zeigen, dass Wiederholungen nicht genau gleich ausfallen.",
          table: {
            caption: "Übungsdaten",
            columns: ["Temperatur (°C)", "1 (mL/min)", "2 (mL/min)", "3 (mL/min)"],
            rows: measurements.map((values, i) => [temperatures[i], ...values]),
          },
        };
      if (mode === 2) {
        const values = measurements.map(mean);
        return {
          summary:
            "Von den gemessenen Temperaturen hat 40 °C die höchste mittlere Gasbildungsrate. Das genaue Optimum ist offen.",
          chart: {
            xLabel: "Temperatur (°C)",
            yLabel: "Rate (mL/min)",
            ticks: temperatures.map(String),
            values,
            max: 8,
          },
          table: {
            caption: "Mittelwerte",
            columns: ["Temperatur (°C)", "Rate (mL/min)"],
            rows: values.map((v, i) => [temperatures[i], v]),
          },
        };
      }
      return {
        summary:
          "Bei 40 °C ist die Spannweite am größten. Die Tabelle zeigt Streuung, aber nicht, warum die Werte streuen.",
        table: {
          caption: "Streuung",
          columns: [
            "Temperatur (°C)",
            "Minimum (mL/min)",
            "Maximum (mL/min)",
            "Spannweite (mL/min)",
          ],
          rows: measurements.map((v, i) => [
            temperatures[i],
            Math.min(...v),
            Math.max(...v),
            Math.max(...v) - Math.min(...v),
          ]),
        },
      };
    },
  },
  mikroskop: {
    title: "Mikroskop: Vom Überblick zum Ausschnitt",
    instruction: "Wähle ein schematisches Präparat. Vergrößere und verschiebe den Ausschnitt.",
    controls: [
      { label: "Präparat", options: ["Kein Präparat", "Zwiebelhaut", "Tierisches Epithel"] },
      { label: "Objektiv", options: ["4-fach", "10-fach", "40-fach"] },
      { label: "Position", options: ["Am Rand", "Zentriert"] },
    ],
    start: [0, 0, 0],
    goals: [
      {
        id: "ueberblick",
        label: "Verschaffe dir bei 40-facher Gesamtvergrößerung einen Überblick über Zwiebelhaut.",
        reached: ([p, o]) => p === 1 && o === 0,
      },
      {
        id: "ausschnitt",
        label: "Sieh dir zentriertes tierisches Epithel bei 400-facher Gesamtvergrößerung an.",
        reached: ([p, o, c]) => p === 2 && o === 2 && c === 1,
      },
    ],
    read: ([p, o, c]) => {
      const objective = [4, 10, 40][o];
      const sample = (["none", "zwiebel", "tier"] as const)[p];
      const position = c ? "zentriert" : "am Rand";
      return {
        summary: `10-faches Okular · ${10 * objective}-fache Gesamtvergrößerung. ${p === 0 ? "Noch kein Präparat eingelegt." : o === 2 && !c ? "Der gewählte Ausschnitt liegt außerhalb des kleinen Bildfelds." : `Präparat ${position}; ${p === 1 ? "regelmäßig begrenzte Zellen" : "flache Zellen mit unregelmäßigen Rändern"} sind im Schema erkennbar.`}`,
        diagram: { kind: "microscope", sample, objective, centered: c === 1 },
      };
    },
  },
  zellen: {
    title: "Zellatlas: Struktur und Aufgabe",
    instruction: "Wechsle den Zelltyp und hebe eine Struktur im Schema hervor.",
    controls: [
      { label: "Zelltyp", options: ["Tierzelle", "Grüne Blattzelle", "Zwiebelhautzelle"] },
      {
        label: "Hervorhebung",
        options: [
          "Gesamtbild",
          "Zellkern",
          "Chloroplast",
          "Zentralvakuole",
          "Mitochondrium",
          "Zellwand",
        ],
      },
    ],
    start: [0, 0],
    goals: [
      {
        id: "blattschema",
        label: "Finde Chloroplasten in der grünen Blattzelle.",
        reached: ([cell, structure]) => cell === 1 && structure === 2,
      },
      {
        id: "zwiebelschema",
        label: "Finde die Zentralvakuole in der Zwiebelhautzelle.",
        reached: ([cell, structure]) => cell === 2 && structure === 3,
      },
      {
        id: "tiervergleich",
        label: "Zeige ein Mitochondrium in der Tierzelle.",
        reached: ([cell, structure]) => cell === 0 && structure === 4,
      },
    ],
    read: ([cell, structure]) => {
      const type: CellKind = (["tier", "blatt", "zwiebel"] as const)[cell];
      const keys = ["all", "nucleus", "chloroplast", "vacuole", "mito", "wall"];
      const present = [true, true, cell === 1, cell !== 0, true, cell !== 0];
      const facts = [
        cell === 0
          ? "Das Modell zeigt Membran, Zellplasma, Kern und Mitochondrien."
          : "Das Modell zeigt zusätzlich eine Zellwand und eine große Zentralvakuole.",
        "Der Zellkern enthält den größten Teil der DNA.",
        "Chloroplasten sind der Ort der Photosynthese.",
        "Die Zentralvakuole speichert Wasser und trägt zum Innendruck bei.",
        "Mitochondrien spielen bei der aeroben Energiebereitstellung eine zentrale Rolle.",
        "Die Zellwand verleiht der Pflanzenzelle Form und Festigkeit.",
      ];
      return {
        summary: present[structure]
          ? facts[structure]
          : "Diese Struktur fehlt beim gewählten Zelltyp.",
        diagram: { kind: "cell", cell: type, highlight: keys[structure] },
      };
    },
  },
  immunisierung: {
    title: "Antikörper im Zeitverlauf",
    instruction:
      "Rufe alle drei Modellkurven auf und vergleiche Beginn und Verlauf. Die Schritte sind keine Tage oder Wochen.",
    controls: [
      {
        label: "Modellfall",
        options: [
          "Fall auswählen",
          "Erster aktiver Kontakt",
          "Aktiver Wiederkontakt",
          "Passiv zugeführte Antikörper",
        ],
      },
    ],
    start: [0],
    goals: [
      { id: "erst", label: "Finde die verzögerte erste Antwort.", reached: ([n]) => n === 1 },
      {
        id: "erneut",
        label: "Finde die schnellere Antwort mit Gedächtnis.",
        reached: ([n]) => n === 2,
      },
      {
        id: "passiv",
        label: "Finde den Verlauf mit sofort verfügbaren Antikörpern.",
        reached: ([n]) => n === 3,
      },
    ],
    read: ([mode]) => {
      if (mode === 0)
        return {
          summary: "Alle Kurven verwenden dieselbe Modellskala für Zeit und Antikörpermenge.",
        };
      const values = antibodyCurves[mode - 1];
      const ticks = ["0", "1", "2", "3", "4", "5"];
      return {
        summary: [
          "Erst nach einer Verzögerung steigt die Antikörpermenge.",
          "Beim Wiederkontakt steigt die Antikörpermenge im Modell rascher und höher.",
          "Die zugeführten Antikörper sind sofort messbar und werden dann abgebaut.",
        ][mode - 1],
        chart: {
          xLabel: "Zeitschritte",
          yLabel: "Antikörper (Modellskala)",
          ticks,
          values,
          max: 10,
        },
        table: {
          caption: "Modellwerte",
          columns: ["Zeitschritt", "Antikörper (Modellskala)"],
          rows: values.map((v, i) => [i, v]),
        },
      };
    },
  },
  enzyme: {
    title: "Enzymlabor: Drei Faktoren, eine Rate",
    instruction:
      "Ändere jeweils eine Einstellung. Das Modell gilt für ein Beispielenzym, nicht für alle Enzyme.",
    controls: [
      { label: "Temperatur", options: ["20 °C", "30 °C", "40 °C", "60 °C"] },
      { label: "pH-Wert", options: ["3", "5", "7", "9"] },
      { label: "Substratangebot", options: ["0", "1", "2", "4", "8"] },
    ],
    start: [0, 2, 2],
    goals: [
      {
        id: "kein-substrat",
        label: "Zeige, dass ohne Substrat kein Produkt entsteht.",
        reached: ([, , s]) => s === 0,
      },
      {
        id: "hoch",
        label: "Erreiche mehr als 80 Einheiten bei hoher Substratmenge.",
        reached: (state) => enzymeRate(state) > 80,
      },
      {
        id: "heiss",
        label:
          "Halte pH 7 und viel Substrat fest. Senke die Rate bei 60 °C auf weniger als 15 Einheiten.",
        reached: (state) =>
          state[0] === 3 && state[1] === 2 && state[2] >= 3 && enzymeRate(state) < 15,
      },
    ],
    read: (state) => {
      const [t, ph, s] = state;
      const rate = enzymeRate(state);
      return {
        summary: `Rate: ${fmt(rate)} von 100 Modelleinheiten. ${s === 0 ? "Ohne Substrat kann kein Produkt entstehen." : t === 3 ? "Das Modellenzym verliert bei hoher Temperatur einen großen Teil seiner Aktivität." : "Vergleiche die Rate mit derselben Enzymmenge bei einer anderen Einstellung."}`,
        chart: {
          xLabel: "Substratangebot (Modellskala, Stufen)",
          yLabel: "Rate (Modelleinheiten)",
          ticks: substrate.map(String),
          values: substrate.map((_, i) => enzymeRate([t, ph, i])),
          max: 100,
        },
        table: {
          caption: "Vergleich bei aktueller Temperatur und aktuellem pH-Wert",
          columns: ["Substratangebot", "Rate"],
          rows: substrate.map((n, i) => [n, enzymeRate([t, ph, i])]),
        },
      };
    },
  },
  diffusion: {
    title: "Diffusionsmodell: Fläche, Strecke, Gefälle",
    instruction:
      "Verändere Fläche, Strecke und Unterschied. Der Modellfluss ist proportional zu Fläche und Gefälle und umgekehrt proportional zur Strecke.",
    controls: [
      { label: "Austauschfläche", options: ["1", "2", "4"] },
      { label: "Diffusionsstrecke", options: ["1", "2"] },
      { label: "Gefälle", options: ["0", "2", "4"] },
    ],
    start: [0, 0, 1],
    goals: [
      {
        id: "kein-gefaelle",
        label: "Stelle ein, dass trotz vorhandener Fläche kein Nettotransport stattfindet.",
        reached: (state) => diffusionRate(state) === 0,
      },
      {
        id: "ausgleichen",
        label: "Verdopple Fläche und Strecke bei Gefälle 2. Vergleiche mit dem Startwert 2.",
        reached: ([a, d, g]) => a === 1 && d === 1 && g === 1,
      },
      {
        id: "schnell",
        label: "Erreiche mehr als vier Modelleinheiten Fluss bei kurzer Strecke.",
        reached: (state) => state[1] === 0 && diffusionRate(state) > 4,
      },
    ],
    read: (state) => {
      const [a, d, g] = state;
      return {
        summary: `Modellfluss: ${fmt(diffusionRate(state))}. ${g === 0 ? "Teilchen bewegen sich weiter, aber es gibt keinen Nettofluss." : "Bei unverändertem Gefälle wirken größere Fläche und längere Strecke in entgegengesetzte Richtungen."}`,
        table: {
          caption: "Aktuelle Einstellung (Modelleinheiten)",
          columns: ["Fläche", "Strecke", "Gefälle", "Nettofluss"],
          rows: [[areas[a], lengths[d], gradients[g], diffusionRate(state)]],
        },
      };
    },
  },
  kreislauf: {
    title: "Kreislaufkarte: Wo wechselt der Sauerstoffgehalt?",
    instruction: "Wähle Stationen entlang des Blutwegs. Vergleiche die beiden Gefäße der Lunge.",
    controls: [{ label: "Station", options: ["Übersicht", ...circuit] }],
    start: [0],
    goals: [
      {
        id: "lungenarterie",
        label: "Prüfe, welches Blut vom Herzen zur Lunge fließt.",
        reached: ([n]) => n === 2,
      },
      {
        id: "lungenvene",
        label: "Prüfe, welches Blut von der Lunge zum Herzen zurückfließt.",
        reached: ([n]) => n === 4,
      },
      {
        id: "koerper",
        label: "Finde die Station, an der Sauerstoff an Gewebe abgegeben wird.",
        reached: ([n]) => n === 7,
      },
    ],
    read: ([n]) => ({
      summary:
        n === 0
          ? "Folge der Reihenfolge. Hinter der Körpervene beginnt der Weg am rechten Herzen erneut."
          : circuitFacts[n - 1],
      diagram: {
        kind: "flow",
        label: "Blutfluss durch Lunge und Körper",
        steps: circuit,
        active: n - 1,
      },
    }),
  },
  atp: {
    title: "ATP-Bilanz: Vorrat und laufende Erneuerung",
    instruction:
      "Starte jedes Mal mit 8 ATP und 4 ADP. Pro Schritt wird zuerst ATP umgesetzt und dann aus ADP erneuert.",
    controls: [
      { label: "Maximale ATP-Neubildung pro Schritt", options: ["0", "3", "5", "7"] },
      { label: "Bedarf pro Schritt", options: ["0", "3", "5", "7"] },
    ],
    start: [1, 2],
    goals: [
      {
        id: "deckung",
        label: "Decke vier Schritte lang einen Bedarf von 5, ohne den ATP-Vorrat zu verändern.",
        reached: ([s, d]) => s === 2 && d === 2,
      },
      {
        id: "verbrauch",
        label: "Zeige, wie der Vorrat bei Bedarf 5 ohne Neubildung erschöpft wird.",
        reached: ([s, d]) => s === 0 && d === 2,
      },
    ],
    read: ([s, d]) => {
      const rates = [0, 3, 5, 7];
      const series = atpSeries(rates[s], rates[d]);
      const unmet = series.some((row) => row.used < rates[d]);
      return {
        summary: unmet
          ? "In mindestens einem Schritt reicht der ATP-Vorrat nicht für den Bedarf."
          : "In diesen vier Schritten ist der Bedarf gedeckt. Prüfe, ob der Vorrat langfristig gleich bleiben kann.",
        chart: {
          xLabel: "Zeitschritt",
          yLabel: "ATP (Einheiten)",
          ticks: ["0", "1", "2", "3", "4"],
          values: [8, ...series.map((r) => r.atp)],
          max: 12,
        },
        table: {
          caption: "Bilanz nach jedem Schritt",
          columns: ["Schritt", "ATP genutzt", "ATP erneuert", "ATP übrig", "ADP"],
          rows: series.map((row) => [row.step, row.used, row.made, row.atp, row.adp]),
        },
      };
    },
  },
  dna: {
    title: "Genetikwerkstatt: Vom Basenpaar zum Karyogramm",
    instruction:
      "Wechsle zwischen DNA-Strang und Karyogramm. Was kannst du auf jeder Ebene erkennen?",
    controls: [
      { label: "Vorlage (5′ → 3′)", options: ["AGTC", "CAGT", "GGCA"] },
      {
        label: "Ansicht",
        options: [
          "Nur Vorlage",
          "Gegenstrang direkt darunter",
          "Gegenstrang von 5′ aus lesen",
          "Menschliches Karyogramm (Schema)",
        ],
      },
    ],
    start: [0, 0],
    goals: [
      {
        id: "direkt",
        label: "Zeige den Gegenstrang von CAGT direkt darunter.",
        reached: ([p, v]) => p === 1 && v === 1,
      },
      {
        id: "umdrehen",
        label: "Lies den Gegenstrang von GGCA vom 5′-Ende aus.",
        reached: ([p, v]) => p === 2 && v === 2,
      },
      {
        id: "chromosomen",
        label:
          "Finde eine Darstellung für die Anzahl der Chromosomen, in der du keine einzelnen Basen siehst.",
        reached: ([, v]) => v === 3,
      },
    ],
    read: ([p, view]) => {
      if (view === 3)
        return {
          summary:
            "Im Beispiel siehst du 22 Autosomenpaare und zwei X-Chromosomen: insgesamt 46 Chromosomen. Einzelne Basen sind auf dieser Ebene nicht sichtbar.",
          diagram: { kind: "karyogram" },
        };
      const template = ["AGTC", "CAGT", "GGCA"][p];
      const complement = dnaComplement(template)!;
      return {
        summary:
          view === 0
            ? `Vorlage: 5′–${template}–3′.`
            : view === 1
              ? `Direkt darunter liegt 3′–${complement}–5′. A paart mit T und G mit C.`
              : `Vom 5′-Ende aus liest du denselben Gegenstrang rückwärts: 5′–${[...complement].reverse().join("")}–3′.`,
        diagram: { kind: "dna", template, complement: view ? complement : null },
      };
    },
  },
  teilung: {
    title: "Meiosemodell: Was trennt sich wann?",
    instruction:
      "Zähle pro Kern. Verändere die Orientierung des zweiten Paars. Das Modell lässt Abschnittsaustausch weg.",
    controls: [
      { label: "Phase", options: divisionPhases },
      {
        label: "Orientierung von Paar 2",
        options: ["Gleich ausgerichtet wie Paar 1", "Anders ausgerichtet als Paar 1"],
      },
    ],
    start: [0, 0],
    goals: [
      {
        id: "homologe",
        label: "Finde den Schritt mit halber Chromosomenzahl, aber zwei Chromatiden je Chromosom.",
        reached: ([phase]) => phase === 2,
      },
      {
        id: "schwestern",
        label: "Finde den Schritt mit einem Chromatid je Chromosom.",
        reached: ([phase]) => phase === 3,
      },
      {
        id: "kombination",
        label: "Erzeuge am Ende einen Kern mit Chromosom 1m und 2v.",
        reached: ([phase, pair]) => phase === 3 && pair === 1,
      },
    ],
    read: ([phase, pair]) => {
      const r = divisionReadout(phase, pair === 1);
      return {
        summary:
          phase < 2
            ? "Vor der ersten Teilung liegen beide Chromosomensätze zusammen."
            : `Aus den zwei Ausgangssätzen entstehen die Kombinationen ${r.left} und ${r.right}. m = mütterliche, v = väterliche Herkunft.`,
        diagram: {
          kind: "flow",
          label: "Stationen des Modells",
          steps: divisionPhases,
          active: phase,
        },
        table: {
          caption: "Zählung im Modell (2n = 4)",
          columns: ["Kerne insgesamt", "Chromosomen pro Kern", "Chromatiden pro Kern"],
          rows: [[r.nuclei, r.chromosomes, r.chromatids]],
        },
      };
    },
  },
  synapse: {
    title: "Signalweg: Elektrisch, chemisch, elektrisch",
    instruction:
      "Prüfe, ob die vereinfachte Synapse die Zielzelle bei verschiedenen Bedingungen aktiviert.",
    controls: [
      { label: "Elektrisches Signal am Endknöpfchen", options: ["Kein Signal", "Signal kommt an"] },
      { label: "Rezeptor der Zielzelle", options: ["Passend und frei", "Blockiert"] },
    ],
    start: [0, 0],
    goals: [
      {
        id: "uebertragen",
        label: "Übertrage das Signal bis in die Zielzelle.",
        reached: ([signal, block]) => signal === 1 && block === 0,
      },
      {
        id: "blockieren",
        label: "Lass das Signal am Endknöpfchen ankommen, ohne die Zielzelle zu aktivieren.",
        reached: ([signal, block]) => signal === 1 && block === 1,
      },
    ],
    read: ([signal, block]) => ({
      summary:
        signal === 0
          ? "Ohne Signal wird im Modell kein Botenstoff freigesetzt."
          : block === 1
            ? "Botenstoff wird freigesetzt. Der blockierte Rezeptor aktiviert die Zielzelle nicht."
            : "Botenstoff bindet an freie Rezeptoren; die Zielzelle wird aktiviert.",
      diagram: {
        kind: "flow",
        label: "Signal bis zu seiner letzten wirksamen Station",
        steps: ["Endknöpfchen", "Botenstoff im Spalt", "Aktivierte Zielzelle"],
        active: signal ? (block ? 1 : 2) : -1,
      },
    }),
  },
  attrappe: {
    title: "Verhaltenslabor: Reiz und Fütterungszustand",
    instruction: "Vergleiche zwei Durchgänge, bei denen jeweils nur eine Bedingung wechselt.",
    controls: [
      { label: "Bewegung der Attrappe", options: ["Versuch wählen", "Unbewegt", "Bewegt"] },
      { label: "Fütterungszustand", options: ["Vor der Fütterung", "Nach der Fütterung"] },
    ],
    start: [0, 0],
    goals: [
      {
        id: "bewegung",
        label: "Lies den Wert für die bewegte Attrappe vor der Fütterung ab.",
        reached: ([m, f]) => m === 2 && f === 0,
      },
      {
        id: "kontrolle",
        label: "Lies die passende Kontrolle ohne Bewegung ab.",
        reached: ([m, f]) => m === 1 && f === 0,
      },
      {
        id: "innen",
        label: "Vergleiche dieselbe bewegte Attrappe nach der Fütterung.",
        reached: ([m, f]) => m === 2 && f === 1,
      },
    ],
    read: ([m, f]) => {
      if (!m)
        return {
          summary:
            "Wähle eine Bedingung. Das Beispiel verwendet zehn Übungsbeobachtungen je Einstellung.",
        };
      const count = [
        [2, 8],
        [1, 3],
      ][f][m - 1];
      return {
        summary: `${count} von 10 Beobachtungen zeigen Zuschnappen. Vergleiche mit einer Einstellung, bei der nur ein Faktor wechselt.`,
        table: {
          caption: "Übungsdaten dieser Einstellung",
          columns: ["Attrappe", "Fütterung", "Zuschnappen", "Kein Zuschnappen"],
          rows: [
            [m === 1 ? "unbewegt" : "bewegt", f === 0 ? "vorher" : "nachher", count, 10 - count],
          ],
        },
      };
    },
  },
} satisfies Record<string, Model>;

export type ModelKind = keyof typeof MODELS;

export const initialModelState = (kind: ModelKind): ModelState => [...MODELS[kind].start];

export function recordGoals(kind: ModelKind, seen: readonly string[], state: ModelState): string[] {
  return [
    ...new Set([
      ...seen,
      ...MODELS[kind].goals.filter((goal) => goal.reached(state)).map((goal) => goal.id),
    ]),
  ];
}

export function modelReady(kind: ModelKind, seen: readonly string[]): boolean {
  return MODELS[kind].goals.every((goal) => seen.includes(goal.id));
}
