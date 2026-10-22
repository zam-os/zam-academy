import { COIN_EVENTS, COIN_OUTCOMES, hitFor } from "../curriculum/stage-7-zufall";
import { fmt } from "../exercises/format";
import type { LabKind } from "../model/types";
import { circle, line, open, rect, text, type LabView } from "./svg";

const outcomes: LabView = {
  render: (v) => {
    let out = open("Vier geordnete Münzergebnisse und ihre Zugehörigkeit zum Ereignis");
    COIN_OUTCOMES.forEach((result, i) => {
      const x = 55 + (i % 2) * 230,
        y = 40 + Math.floor(i / 2) * 130,
        selected = v.result === i,
        belongs = COIN_EVENTS[v.event].includes(i);
      out +=
        rect(x, y, 180, 100, belongs ? "lab-fill-ok" : "lab-ghost") +
        text(x + 90, y + 45, result, "lab-text-big", "middle") +
        text(
          x + 90,
          y + 76,
          belongs ? "gehört zu E" : "gehört nicht zu E",
          "lab-text-small",
          "middle",
        );
      if (selected) out += rect(x - 5, y - 5, 190, 110, "lab-selected");
    });
    return (
      out +
      text(
        260,
        325,
        "KZ und ZK unterscheiden sich durch die Reihenfolge.",
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const tree: LabView = {
  render: (v) => {
    const values = [v.kk, v.kz, v.zk, v.zz];
    let out =
      open("Baumdiagramm und Vierfeldertafel derselben Beobachtungszahlen") +
      text(125, 25, "Baumdiagramm", "lab-text", "middle") +
      text(385, 25, "Vierfeldertafel", "lab-text", "middle");
    const origin = { x: 25, y: 170 },
      first = [
        { x: 100, y: 95 },
        { x: 100, y: 245 },
      ],
      leaves = [60, 130, 210, 280];
    first.forEach((p, i) => {
      out +=
        line(origin.x, origin.y, p.x, p.y, "lab-thin") +
        circle(p.x, p.y, 15, "lab-shape") +
        text(p.x, p.y + 5, i === 0 ? "K" : "Z", "lab-text", "middle");
    });
    leaves.forEach((y, i) => {
      const p = first[Math.floor(i / 2)];
      out +=
        line(p.x, p.y, 180, y, "lab-thin") +
        text(190, y + 5, `${COIN_OUTCOMES[i]}: ${values[i]}`, "lab-text-small");
    });
    const x = 305,
      y = 95,
      cell = 52;
    out +=
      text(370, 55, "2. Wurf", "lab-text-small", "middle") +
      text(260, 180, "1. Wurf", "lab-text-small");
    ["K", "Z", "Σ"].forEach((s, i) => {
      out +=
        text(x + i * cell + cell / 2, y - 13, s, "lab-text", "middle") +
        text(x - 14, y + i * cell + 32, s, "lab-text", "middle");
    });
    const table = [
      [v.kk, v.kz, v.kk + v.kz],
      [v.zk, v.zz, v.zk + v.zz],
      [v.kk + v.zk, v.kz + v.zz, values.reduce((a, b) => a + b, 0)],
    ];
    table.forEach((row, i) => {
      row.forEach((n, j) => {
        out +=
          rect(
            x + j * cell,
            y + i * cell,
            cell,
            cell,
            i === 2 || j === 2 ? "lab-cell-sum" : "lab-cell",
          ) + text(x + j * cell + cell / 2, y + i * cell + 32, String(n), "lab-text", "middle");
      });
    });
    return (
      out +
      text(
        260,
        330,
        "Ein vollständiger Pfad entspricht einer inneren Zelle.",
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const frequencies: LabView = {
  render: (v) => {
    const model = Array.from({ length: v.model === 0 ? 6 : 7 }, (_, i) => (i === 6 ? 6 : i + 1)),
      fraction = model.filter((die) => hitFor(die, v.event)).length / model.length,
      relative = v.throws ? v.hits / v.throws : 0;
    const out =
      open("Beobachteter Trefferanteil im Vergleich mit dem Anteil im gewählten Modell") +
      text(40, 40, `n = ${v.throws}, Treffer = ${v.hits}`, "lab-text-big") +
      text(40, 90, "Beobachteter Anteil", "lab-text") +
      rect(40, 110, 400, 40, "lab-ghost") +
      rect(40, 110, 400 * relative, 40, "lab-fill-a") +
      text(450, 137, v.throws ? `${fmt(100 * relative, 1)} %` : "–", "lab-text-small") +
      text(
        40,
        200,
        `Anteil im Modell (${model.filter((die) => hitFor(die, v.event)).length}/${model.length})`,
        "lab-text",
      ) +
      rect(40, 220, 400, 40, "lab-ghost") +
      rect(40, 220, 400 * fraction, 40, "lab-fill-b") +
      text(450, 247, `${fmt(100 * fraction, 1)} %`, "lab-text-small") +
      text(40, 285, "0 %", "lab-text-tick") +
      text(440, 285, "100 %", "lab-text-tick", "end") +
      text(
        260,
        330,
        v.throws
          ? `Letzter Wurf: ${v.last}. Der nächste Ausgang bleibt offen.`
          : "Starte eine Versuchsserie.",
        "lab-text-small",
        "middle",
      );
    return `${out}</svg>`;
  },
};

export const ZUFALL_VIEWS: Partial<Record<LabKind, LabView>> = {
  outcomes,
  "tree-table": tree,
  frequencies,
};
