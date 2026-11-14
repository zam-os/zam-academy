import { arrow, label, labels, panel, svg } from "./draw";

export function reinstoffGemische(): string {
  const boxes = [
    ["Reinstoff", "Nur eine Teilchensorte\n(z. B. reiner Zucker)", false],
    ["Gemenge (fest + fest)", "Verschiedene feste Teile\n(z. B. Sand + Eisen)", true],
    ["Suspension (fest + fl.)", "Feine feste Teile schweben\n(z. B. Kreide in Wasser)", true],
    ["Lösung & Emulsion", "Gelöst (Salzwasser) oder\nTröpfchen (Öl + Wasser)", true],
  ] as const;
  return svg(
    600,
    190,
    "Reinstoff und Stoffgemische im Teilchenmodell",
    boxes
      .map(([t, d, mixed], i) => {
        const x = 14 + (i % 2) * 292;
        const y = 14 + Math.floor(i / 2) * 84;
        const dots = [0, 1, 2, 3]
          .map((j) => {
            const dx = x + 28 + j * 16;
            const dy = y + 48;
            const fill = mixed && j % 2 === 1 ? "var(--f-orange)" : "var(--f-blue)";
            return `<circle cx="${dx}" cy="${dy}" r="6" fill="${fill}" stroke="var(--f-ink)"/>`;
          })
          .join("");
        return `${panel(x, y, 280, 74, "panel-bg")}
          ${label(x + 20, y + 23, t, "lbl small strong", "start")}
          ${dots}
          ${labels(x + 106, y + 42, d, "lbl tiny", "start", 15)}`;
      })
      .join(""),
  );
}

export function aggregatAlltag(): string {
  return svg(
    580,
    165,
    "Aggregatzustände bei Zimmertemperatur und ihre Übergänge",
    `${panel(14, 24, 152, 92, "panel-bg")}
     ${label(90, 48, "Fest (z. B. Eisen)", "lbl strong", "middle")}
     ${labels(90, 78, "Eigene Form &\neigenes Volumen", "lbl small", "middle", 16)}
     ${arrow(170, 56, 206, 56, "arrow power")}
     ${arrow(206, 86, 170, 86, "arrow")}
     ${panel(214, 24, 152, 92, "panel-bg")}
     ${label(290, 48, "Flüssig (Wasser)", "lbl strong", "middle")}
     ${labels(290, 78, "Passt sich Gefäß an,\neigenes Volumen", "lbl small", "middle", 16)}
     ${arrow(370, 56, 406, 56, "arrow power")}
     ${arrow(406, 86, 370, 86, "arrow")}
     ${panel(414, 24, 152, 92, "panel-bg")}
     ${label(490, 48, "Gasförmig (Luft)", "lbl strong", "middle")}
     ${labels(490, 78, "Füllt den gesamten\nRaum aus", "lbl small", "middle", 16)}
     ${label(188, 140, "Schmelzen ↔ Erstarren", "lbl tiny", "middle")}
     ${label(388, 140, "Verdampfen ↔ Kondensieren", "lbl tiny", "middle")}`,
  );
}

export function stoffSteckbrief(): string {
  const cols = [
    ["Zucker", "Weiß, kristallin\nwasserlöslich: ja\nmagnetisch: nein", "var(--f-blue)"],
    ["Papier", "Faserig, leicht\nwasserlöslich: nein\nbrennbar: sehr leicht", "var(--f-orange)"],
    ["Eisen", "Metallisch grau\nmagnetisch: ja\nleitet Strom: gut", "var(--f-green)"],
  ];
  return svg(
    580,
    165,
    "Stoffsteckbriefe für Zucker, Papier und Eisen",
    cols
      .map(([t, d, col], i) => {
        const x = 14 + i * 188;
        return `${panel(x, 14, 174, 136, "panel-bg")}
          <rect x="${x}" y="14" width="174" height="28" rx="8" fill="${col}"/>
          ${label(x + 87, 33, t, "lbl strong on-dark", "middle")}
          ${labels(x + 87, 74, d, "lbl small", "middle", 20)}`;
      })
      .join(""),
  );
}

export function trennverfahrenLabor(): string {
  const procs = [
    ["1. Sieben", "Trennt nach\nTeilchengröße\n(Kies & Sand)"],
    ["2. Filtrieren", "Hält ungelösten Feststoff\nim Filterpapier zurück\n(Sand & Wasser)"],
    ["3. Verdampfen", "Flüssigkeit verdampft,\ngelöster Stoff bleibt\n(Salzgewinnung)"],
  ];
  return svg(
    580,
    170,
    "Einfache Trennverfahren nach Stoffeigenschaften",
    procs
      .map(([t, d], i) => {
        const x = 14 + i * 188;
        return `${panel(x, 16, 174, 138, "panel-bg")}
          ${label(x + 87, 42, t, "lbl strong", "middle")}
          ${labels(x + 87, 76, d, "lbl small", "middle", 18)}`;
      })
      .join(""),
  );
}

export function wertstoffSortierung(): string {
  const steps = [
    ["Auslesen", "Grobe Teile von Hand /\noptisch sortieren"],
    ["Magnettrennen", "Eisenschrott aus dem\nMüllstrom ziehen"],
    ["Windsichten", "Leichte Folien mit\nLuftstrom wegblasen"],
    ["Wiederverwerten", "Sortenreine Wertstoffe\nfür neue Produkte"],
  ];
  return svg(
    620,
    165,
    "Wertstofftrennung beim Recycling von Müll",
    steps
      .map(([t, d], i) => {
        const x = 12 + i * 152;
        return `${panel(x, 22, 136, 118, "panel-bg")}
          ${label(x + 68, 48, t, "lbl small strong", "middle")}
          ${labels(x + 68, 86, d, "lbl tiny", "middle", 16)}
          ${i < 3 ? arrow(x + 137, 81, x + 150, 81, "arrow thin") : ""}`;
      })
      .join(""),
  );
}
