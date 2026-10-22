import { fmt } from "../format";
import { type LabDef, type LabState, mapRange, points, svg } from "./engine";

const X: [number, number] = [0, 150];
const demand = (s: LabState, p: number) => Math.max(0, 120 + s.n - 10 * p);
const supply = (s: LabState, p: number) => Math.max(0, 10 * p - 20 + s.a);
const equilibrium = (s: LabState) => {
  const price = (140 + s.n - s.a) / 20;
  return { price, quantity: 10 * price - 20 + s.a };
};

interface Words {
  price: string;
  quantity: string;
  priceUnit: string;
  show: (p: number) => string;
  surplus: string;
  shortage: string;
  buyers: string;
  sellers: string;
}

/** One model for goods and for work: the labour market reads the same curves as wage and jobs. */
function marketLab(kind: "markt" | "arbeitsmarkt", words: Words): LabDef {
  const labour = kind === "arbeitsmarkt";
  return {
    kind,
    title: labour ? "Der Arbeitsmarkt als Markt" : "Angebot, Nachfrage und Preis",
    intro: labour
      ? "Unternehmen fragen Arbeit nach, Menschen bieten Arbeit an. Verschiebe beide Seiten und den Lohn und beobachte, wann Stellen fehlen und wann Fachkräfte fehlen."
      : "Verschiebe Nachfrage und Angebot und setze den Marktpreis. Beobachte, wo sich die Kurven schneiden und was bei einem anderen Preis passiert.",
    sliders: [
      {
        key: "n",
        label: labour ? "Nachfrage nach Arbeit verschieben" : "Nachfrage verschieben",
        min: -30,
        max: 30,
        step: 10,
        unit: labour ? "Tsd." : "Stück",
        value: 0,
      },
      {
        key: "a",
        label: labour ? "Angebot an Arbeit verschieben" : "Angebot verschieben",
        min: -30,
        max: 30,
        step: 10,
        unit: labour ? "Tsd." : "Stück",
        value: 0,
      },
      {
        key: "p",
        label: words.price,
        min: 1,
        max: 13,
        step: 0.5,
        unit: words.priceUnit,
        value: 7,
        show: (v) => words.show(v),
      },
    ],
    selects: [],
    goals: [
      {
        id: "ueberschuss",
        text: labour
          ? "Stelle einen Lohn ein, bei dem mehr Menschen Arbeit suchen als Stellen angeboten werden (Angebotsüberhang an Arbeit)."
          : "Stelle einen Preis ein, bei dem mehr angeboten als nachgefragt wird (Angebotsüberhang).",
        test: (s) => supply(s, s.p) - demand(s, s.p) >= 10,
      },
      {
        id: "knappheit",
        text: labour
          ? "Stelle einen Lohn ein, bei dem mehr Stellen offen sind, als Menschen sie besetzen wollen, ähnlich einem Fachkräftemangel."
          : "Stelle einen Preis ein, bei dem mehr nachgefragt als angeboten wird (Nachfrageüberhang).",
        test: (s) => demand(s, s.p) - supply(s, s.p) >= 10,
      },
      {
        id: "nachfrage-steigt",
        text: labour
          ? "Lass die Nachfrage nach Arbeit wachsen, ohne das Angebot zu ändern: Der Gleichgewichtslohn steigt."
          : "Lass die Nachfrage wachsen, ohne das Angebot zu ändern: Der Gleichgewichtspreis steigt.",
        test: (s) => s.n > 0 && s.a === 0 && equilibrium(s).price > 7,
      },
      {
        id: "angebot-steigt",
        text: labour
          ? "Lass das Angebot an Arbeit wachsen, ohne die Nachfrage zu ändern: Der Gleichgewichtslohn sinkt."
          : "Lass das Angebot wachsen, ohne die Nachfrage zu ändern: Der Gleichgewichtspreis sinkt.",
        test: (s) => s.a > 0 && s.n === 0 && equilibrium(s).price < 7,
      },
      {
        id: "gleichgewicht",
        text: labour
          ? "Verschiebe eine Seite des Marktes und stelle dann genau den neuen Gleichgewichtslohn ein."
          : "Verschiebe eine Kurve und stelle dann genau den neuen Gleichgewichtspreis ein: Kein Überhang bleibt.",
        test: (s) => (s.n !== 0 || s.a !== 0) && s.p === equilibrium(s).price,
      },
    ],
    witness: {
      ueberschuss: { n: 0, a: 0, p: 10 },
      knappheit: { n: 0, a: 0, p: 4 },
      "nachfrage-steigt": { n: 20, a: 0, p: 8 },
      "angebot-steigt": { n: 0, a: 20, p: 6 },
      gleichgewicht: { n: 20, a: 0, p: 8 },
    },
    view(s) {
      const eq = equilibrium(s);
      const px = (q: number) => mapRange(q, X, [58, 452]);
      const py = (p: number) => mapRange(p, [0, 14], [262, 22]);
      const line = (f: (p: number) => number) =>
        points(
          [1, 2, 4, 6, 8, 10, 12, 13].map((p) => [px(f(p)), py(p)] as [number, number]),
        );
      const dm = demand(s, s.p);
      const sp = supply(s, s.p);
      const body = `<line class="lab-axis" x1="58" y1="262" x2="458" y2="262"/><line class="lab-axis" x1="58" y1="262" x2="58" y2="14"/>
        <text class="lab-text" x="458" y="282" text-anchor="end">${words.quantity}</text><text class="lab-text" x="6" y="12">${words.price}</text>
        <polyline class="lab-line lab-line-demand" points="${line((p) => demand(s, p))}"/><polyline class="lab-line lab-line-supply" points="${line((p) => supply(s, p))}"/>
        <text class="lab-text lab-text-demand" x="${px(demand(s, 12.5)) + 6}" y="${py(12.5)}">${words.buyers}</text><text class="lab-text lab-text-supply" x="${Math.min(px(supply(s, 12.5)) - 4, 400)}" y="${py(12.5) - 2}" text-anchor="end">${words.sellers}</text>
        <line class="lab-guide" x1="58" y1="${py(s.p)}" x2="${px(Math.max(dm, sp))}" y2="${py(s.p)}"/>
        <line class="lab-gap" x1="${px(Math.min(dm, sp))}" y1="${py(s.p)}" x2="${px(Math.max(dm, sp))}" y2="${py(s.p)}"/>
        <circle class="lab-dot lab-dot-demand" cx="${px(dm)}" cy="${py(s.p)}" r="5"/><circle class="lab-dot lab-dot-supply" cx="${px(sp)}" cy="${py(s.p)}" r="5"/>
        <circle class="lab-eq" cx="${px(eq.quantity)}" cy="${py(eq.price)}" r="8"/><text class="lab-text" x="${px(eq.quantity) + 12}" y="${py(eq.price) + 4}">Gleichgewicht</text>`;
      const gap = sp - dm;
      return {
        figure: svg(`${words.price} und ${words.quantity} mit Nachfrage- und Angebotskurve`, body),
        readouts: [
          [labour ? "Gleichgewichtslohn" : "Gleichgewichtspreis", `${words.show(eq.price)} ${words.priceUnit}`],
          [labour ? "Beschäftigung im Gleichgewicht" : "Gleichgewichtsmenge", `${fmt(eq.quantity)} ${labour ? "Tsd." : "Stück"}`],
          [labour ? "Offene Stellen bei diesem Lohn" : "Beim eingestellten Preis: nachgefragt", `${fmt(dm)} ${labour ? "Tsd." : "Stück"}`],
          [labour ? "Arbeitsuchende bei diesem Lohn" : "Beim eingestellten Preis: angeboten", `${fmt(sp)} ${labour ? "Tsd." : "Stück"}`],
        ],
        note:
          gap > 0
            ? `${words.surplus} von ${fmt(gap)} ${labour ? "Tsd." : "Stück"}: ${labour ? "Es suchen mehr Menschen Arbeit, als Stellen frei sind. Der Lohn gerät unter Druck nach unten." : "Es wird mehr angeboten, als Käufer wollen. Der Preis gerät unter Druck nach unten."}`
            : gap < 0
              ? `${words.shortage} von ${fmt(-gap)} ${labour ? "Tsd." : "Stück"}: ${labour ? "Es sind mehr Stellen frei, als Menschen sie besetzen wollen. Der Lohn gerät unter Druck nach oben." : "Es wollen mehr Käufer kaufen, als Ware da ist. Der Preis gerät unter Druck nach oben."}`
              : `Der Markt ist geräumt: ${labour ? "Jede Person, die bei diesem Lohn arbeiten will, findet eine Stelle." : "Jeder, der zu diesem Preis kaufen will, bekommt Ware; nichts bleibt übrig."}`,
      };
    },
  };
}

export const MARKT = marketLab("markt", {
  price: "Preis (Euro)",
  quantity: "Menge (Stück)",
  priceUnit: "Euro",
  show: (p) => fmt(p),
  surplus: "Angebotsüberhang",
  shortage: "Nachfrageüberhang",
  buyers: "Nachfrage",
  sellers: "Angebot",
});

export const ARBEITSMARKT = marketLab("arbeitsmarkt", {
  price: "Stundenlohn (Euro)",
  quantity: "Arbeitskräfte und Stellen (Tausend)",
  priceUnit: "Euro/Std.",
  show: (p) => fmt(2 * p + 8),
  surplus: "Angebotsüberhang an Arbeit",
  shortage: "Nachfrageüberhang nach Arbeit",
  buyers: "Stellen",
  sellers: "Arbeitsuchende",
});

const INCOME = 1000;
const incomeIn = (s: LabState, round: number) => INCOME * (s.c / 100) ** (round - 1);

export const KREISLAUF: LabDef = {
  kind: "kreislauf",
  title: "Der einfache Wirtschaftskreislauf",
  intro:
    "Haushalte beziehen Einkommen, kaufen damit Güter, und die Unternehmen zahlen aus den Einnahmen wieder Einkommen. Was geschieht, wenn die Haushalte nicht alles ausgeben?",
  sliders: [
    {
      key: "c",
      label: "Anteil des Einkommens, der ausgegeben wird",
      min: 50,
      max: 100,
      step: 10,
      unit: "%",
      value: 80,
    },
    { key: "r", label: "Betrachtete Runden", min: 1, max: 6, step: 1, unit: "", value: 4 },
  ],
  selects: [],
  goals: [
    {
      id: "geschlossen",
      text: "Gib alles Einkommen aus (100 %): Einkommen, Ausgaben und Umsatz bleiben in jeder Runde gleich groß.",
      test: (s) => s.c === 100 && s.r >= 3,
    },
    {
      id: "schwund",
      text: "Zeige, wie das Modell schrumpft: Bei 70 % ist das Einkommen nach der vierten Runde unter 500 gesunken.",
      test: (s) => s.r >= 4 && incomeIn(s, s.r) < 500,
    },
    {
      id: "grenze",
      text: "Finde einen Anteil unter 100 %, bei dem nach drei Runden noch mindestens 800 Einkommen fließen.",
      test: (s) => s.c < 100 && s.r === 3 && incomeIn(s, 3) >= 800,
    },
  ],
  witness: {
    geschlossen: { c: 100, r: 4 },
    schwund: { c: 70, r: 4 },
    grenze: { c: 90, r: 3 },
  },
  view(s) {
    const rounds = Array.from({ length: s.r }, (_, i) => incomeIn(s, i + 1));
    const saved = rounds.reduce((sum, income) => sum + income * (1 - s.c / 100), 0);
    const leak = (1 - s.c / 100) * 40;
    const barWidth = 300 / Math.max(6, s.r);
    const bars = rounds
      .map((income, i) => {
        const h = (income / INCOME) * 70;
        const x = 150 + i * (barWidth + 4);
        return `<rect class="lab-bar" x="${x}" y="${330 - h}" width="${barWidth}" height="${h}" rx="3"/><text class="lab-text" x="${x + barWidth / 2}" y="${324 - h}" text-anchor="middle">${fmt(Math.round(income))}</text>`;
      })
      .join("");
    const body = `<defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="lab-arrow-head"/></marker></defs>
      <rect class="lab-node lab-node-a" x="30" y="86" width="150" height="62" rx="12"/><text class="lab-node-text" x="105" y="122" text-anchor="middle">Haushalte</text>
      <rect class="lab-node lab-node-b" x="300" y="86" width="150" height="62" rx="12"/><text class="lab-node-text" x="375" y="122" text-anchor="middle">Unternehmen</text>
      <path class="lab-flow lab-flow-money" d="M180 100 L300 100" marker-end="url(#arr)"/><text class="lab-text" x="240" y="92" text-anchor="middle">Ausgaben (Geld)</text>
      <path class="lab-flow lab-flow-goods" d="M300 134 L180 134" marker-end="url(#arr)"/><text class="lab-text" x="240" y="152" text-anchor="middle">Güter und Dienste</text>
      <path class="lab-flow lab-flow-money" d="M375 86 C375 20 105 20 105 82" marker-end="url(#arr)"/><text class="lab-text" x="240" y="34" text-anchor="middle">Löhne und Gehälter (Einkommen)</text>
      <path class="lab-flow lab-flow-goods" d="M105 148 C105 210 375 210 375 152" marker-end="url(#arr)"/><text class="lab-text" x="240" y="226" text-anchor="middle">Arbeitsleistung</text>
      ${leak > 1 ? `<path class="lab-flow lab-flow-leak" stroke-width="${3 + leak / 6}" d="M60 148 L60 186"/><text class="lab-text lab-text-leak" x="6" y="204">Gespart</text>` : ""}
      <text class="lab-text" x="20" y="302">Einkommen je Runde</text><line class="lab-axis" x1="140" y1="330" x2="460" y2="330"/>${bars}`;
    return {
      figure: svg("Wirtschaftskreislauf mit Haushalten und Unternehmen", body, 480, 340),
      readouts: [
        ["Einkommen in der letzten Runde", `${fmt(Math.round(incomeIn(s, s.r)))}`],
        ["Umsatz der Unternehmen in der letzten Runde", `${fmt(Math.round(incomeIn(s, s.r) * (s.c / 100)))}`],
        ["Insgesamt gespart (fehlt im Kreislauf)", `${fmt(Math.round(saved))}`],
      ],
      note:
        s.c === 100
          ? "Alles, was die Haushalte einnehmen, geben sie aus; alles, was die Unternehmen einnehmen, zahlen sie als Einkommen aus. Der Kreislauf ist geschlossen."
          : "Das einfache Modell kennt weder Sparen noch Banken: Was nicht ausgegeben wird, fehlt im Kreislauf, und die Einkommen schrumpfen. Genau hier stößt das Modell an seine Grenze.",
    };
  },
};
