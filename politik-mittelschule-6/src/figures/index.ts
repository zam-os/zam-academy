import { esc } from "../workshop";

interface FigureDef {
  title: string;
  caption: string;
  layout: "grid" | "hierarchy" | "flow";
  items: ReadonlyArray<readonly [icon: string, label: string, description: string]>;
}

export const FIGURES: Record<string, FigureDef> = {
  burg: {
    title: "Drei Orte auf der Burg",
    caption: "Schematische Auswahl. Burgen konnten unterschiedlich aufgebaut sein.",
    layout: "grid",
    items: [
      ["🚪", "Tor · schützen", "Die Wache kontrolliert den Zugang."],
      ["🥖", "Küche · versorgen", "Hier bereitet das Personal Mahlzeiten zu."],
      ["🏰", "Saal · herrschen", "Hier empfängt der Burgherr beispielsweise Gäste."],
    ],
  },
  kloster: {
    title: "Gebet, Arbeit und Wissen",
    caption: "Beispiele für einen Klosteralltag. Gebetszeiten wiederholten sich über den Tag.",
    layout: "grid",
    items: [
      ["🔔", "Kirche", "Das gemeinsame Gebet hat feste Zeiten."],
      ["🌿", "Garten", "Hier wächst Gemüse für die Küche."],
      ["📖", "Schreibstube", "Hier entsteht aus einer Vorlage eine neue Handschrift."],
    ],
  },
  macht: {
    title: "Zwei Ämter und eine Überschneidung",
    caption: "Die Rechte hingen von Ort und Zeit ab. Das Schema zeigt mögliche Beispiele.",
    layout: "grid",
    items: [
      ["🏰", "Herzog · weltlich", "Ein Gebiet verwalten, ein Gericht einsetzen."],
      ["🌾", "Gemeinsame Möglichkeit", "Land besitzen und Abgaben erhalten."],
      ["🔔", "Abt · geistlich", "Das Gebet und das Zusammenleben nach der Ordensregel leiten."],
    ],
  },
  bildung: {
    title: "Wer zeigt dir was?",
    caption: "Lernen konnte an verschiedenen Orten stattfinden. Die Beispiele sind eine Auswahl.",
    layout: "grid",
    items: [
      ["🐎", "Hof", "Eine erfahrene Person zeigt dir das Reiten."],
      ["✍️", "Schreibstube", "Jemand lehrt dich, eine Handschrift zu kopieren."],
      ["🪡", "Werkstatt", "Eine Meisterin zeigt dir, wie du Leder vernähst."],
    ],
  },
  staende: {
    title: "Das Modell der drei Stände",
    caption: "Die Form zeigt vereinfacht Rang und Einfluss. Die Breite steht für keine gemessene Personenzahl.",
    layout: "hierarchy",
    items: [
      ["🔔", "Klerus · beten", "Zum Beispiel Priester und Äbtissinnen"],
      ["🏰", "Adel · schützen und herrschen", "Zum Beispiel Grafen und Herzoginnen"],
      ["🌾", "Arbeitende Menschen · versorgen", "Zum Beispiel Bauern, Handwerker und Kaufleute"],
    ],
  },
  "stadt-land": {
    title: "Vom Feld über den Markt zur Bäckerei",
    caption: "Ein möglicher Handelsweg. Der Markt verbindet Menschen aus Stadt und Land.",
    layout: "flow",
    items: [
      ["🌾", "Dorf", "Eine Bauernfamilie erntet Korn."],
      ["🧺", "Markt", "Ein Händler vermittelt Ware an Käufer."],
      ["🥖", "Bäckerei", "Die Bäckerin macht aus Mehl Brot."],
    ],
  },
  freiheit: {
    title: "Eine Berufswahl im Vergleich",
    caption: "Der Vergleich zeigt einen möglichen Fall aus dem Mittelalter und ein heutiges Grundrecht.",
    layout: "grid",
    items: [
      ["🌾", "Auf einem abhängigen Hof", "Pflichten gegenüber dem Grundherrn können den Wechsel von Arbeit oder Wohnort erschweren."],
      ["📜", "Heute in Deutschland", "Deutsche dürfen ihren Beruf frei wählen. Für die Ausübung können Voraussetzungen gelten."],
    ],
  },
};

export function renderFigure(id: string): string {
  const { title, caption, layout, items } = FIGURES[id];
  return `<figure class="lesson-figure" data-figure="${esc(id)}">
    <figcaption><strong>${esc(title)}</strong><br>${esc(caption)}</figcaption>
    <ol class="diagram diagram-${layout}" role="list">${items
      .map(([icon, label, description]) => `<li><span class="diagram-icon" aria-hidden="true">${icon}</span><strong>${esc(label)}</strong><span>${esc(description)}</span></li>`)
      .join("")}</ol>
  </figure>`;
}
