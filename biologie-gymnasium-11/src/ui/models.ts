import type { Lesson } from "../model/types";
import { type Chart, type Diagram, fmt, type Readout } from "../model/readout";
import { MODELS, type ModelState } from "../models";
import { esc } from "../workshop";

function lineChart({ xLabel, yLabel, ticks, values, max }: Chart): string {
  // All current chart axes are numeric. Position the substrate levels by value,
  // so doubling the substrate does not look like a fixed-size increment.
  const numericTicks = ticks.map(Number);
  const low = numericTicks[0];
  const span = numericTicks.at(-1)! - low;
  const x = (n: number) => 58 + ((n - low) * 447) / span;
  const y = (n: number) => 177 - (n * 138) / max;
  const marks = [0, max / 2, max];
  return `<svg class="bio-figure" viewBox="0 0 540 235" role="img" aria-label="${esc(yLabel)} nach ${esc(xLabel)}. Werte stehen auch in der Tabelle.">
    <text x="22" y="23">${esc(yLabel)}</text>
    ${marks.map((mark) => `<line class="chart-grid" x1="58" x2="505" y1="${y(mark)}" y2="${y(mark)}"/><text x="49" y="${y(mark) + 5}" text-anchor="end">${fmt(mark)}</text>`).join("")}
    <path class="axis" d="M 58 39 V 177 H 505"/>
    <polyline class="data-line" points="${values.map((v, i) => `${x(numericTicks[i])},${y(v)}`).join(" ")}"/>
    ${values.map((v, i) => `<circle class="data-point" cx="${x(numericTicks[i])}" cy="${y(v)}" r="5"/>`).join("")}
    ${numericTicks.map((tick) => `<text x="${x(tick)}" y="199" text-anchor="middle">${fmt(tick)}</text>`).join("")}
    <text x="282" y="224" text-anchor="middle">${esc(xLabel)}</text>
  </svg>`;
}

function table(readout: NonNullable<Readout["table"]>): string {
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="${esc(readout.caption)}"><table>
    <caption>${esc(readout.caption)}</caption>
    <thead><tr>${readout.columns.map((heading) => `<th scope="col">${esc(heading)}</th>`).join("")}</tr></thead>
    <tbody>${readout.rows.map((row) => `<tr>${row.map((value) => `<td>${typeof value === "number" ? fmt(value) : esc(value)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

function microscope(figure: Extract<Diagram, { kind: "microscope" }>): string {
  const { sample, objective, centered } = figure;
  const size = objective === 4 ? 31 : objective === 10 ? 52 : 125;
  const offset = centered ? 0 : size * 0.55;
  const empty = sample === "none" || (objective === 40 && !centered);
  const cells = empty
    ? ""
    : Array.from({ length: 9 }, (_, row) =>
        Array.from({ length: 9 }, (_, col) => {
          const x = 145 + (col - 4) * size - offset;
          const y = 123 + (row - 4) * size * 0.72;
          if (sample === "zwiebel")
            return `<rect x="${x}" y="${y}" width="${size}" height="${size * 0.72}" rx="3" class="specimen-outline"/>`;
          const side = size * 0.76;
          const wobble = (row % 2 ? 1 : -1) * size * 0.09;
          return `<path class="specimen-outline" d="M ${x} ${y} q ${side * 0.35} ${-side * 0.22} ${side} ${wobble} q ${side * 0.18} ${side * 0.4} ${wobble} ${side * 0.68} q ${-side * 0.58} ${side * 0.12} ${-side} ${wobble} z"/>
        <ellipse class="nucleus" cx="${x + side * 0.4}" cy="${y + side * 0.29}" rx="${size * 0.1}" ry="${size * 0.08}"/>`;
        }).join(""),
      ).join("");
  const label = empty
    ? "Kein Gewebe im Bildfeld"
    : sample === "zwiebel"
      ? "Zwiebelhaut: regelmäßige Zellgrenzen"
      : "Epithel: unregelmäßige Zellgrenzen";
  return `<svg class="bio-figure" viewBox="0 0 520 246" role="img" aria-label="Schematisches Bildfeld: ${label}">
    <defs><clipPath id="sample-field"><circle cx="145" cy="123" r="103"/></clipPath></defs>
    <circle cx="145" cy="123" r="103" class="field"/>
    <g clip-path="url(#sample-field)">${cells}</g>
    <text x="275" y="89">Schematisches Bildfeld</text>
    <text x="275" y="118">Objektiv: ${objective}-fach</text>
    <text x="275" y="147">Ausschnitt: ${centered ? "zentriert" : "am Rand"}</text>
    <text x="275" y="176">${empty ? "Kein Gewebe sichtbar" : sample === "zwiebel" ? "Pflanzliches Gewebe" : "Tierisches Gewebe"}</text>
  </svg>`;
}

function cell(figure: Extract<Diagram, { kind: "cell" }>): string {
  const plant = figure.cell !== "tier";
  const names = [
    ["nucleus", "Zellkern", true],
    ["mito", "Mitochondrien", true],
    ["wall", "Zellwand", plant],
    ["vacuole", "Zentralvakuole", plant],
    ["chloroplast", "Chloroplasten", figure.cell === "blatt"],
  ] as const;
  const mark = (id: string, drawing: string) =>
    `<g class="${figure.highlight === id ? "organelle selected-part" : "organelle"}">${drawing}</g>`;
  return `<svg class="bio-figure" viewBox="0 0 520 246" role="img" aria-label="Zellschema: ${names
    .filter(([, , exists]) => exists)
    .map(([, name]) => name)
    .join(", ")}">
    ${
      plant
        ? mark("wall", '<rect class="cell-wall" x="34" y="26" width="254" height="194" rx="40"/>')
        : '<path class="cell-body" d="M 36 134 C 32 52 87 18 164 28 C 244 14 295 71 281 134 C 292 201 220 218 164 220 C 97 228 34 195 36 134 Z"/>'
    }
    ${plant ? '<rect class="cell-body" x="43" y="35" width="236" height="176" rx="34"/>' : ""}
    ${plant ? mark("vacuole", '<rect class="vacuole" x="107" y="58" width="133" height="113" rx="35"/>') : ""}
    ${mark("nucleus", `<circle class="nucleus" cx="${plant ? 80 : 158}" cy="${plant ? 139 : 115}" r="${plant ? 18 : 37}"/>`)}
    ${mark("mito", '<ellipse class="mitochondrion" cx="96" cy="79" rx="21" ry="10" transform="rotate(-20 96 79)"/><ellipse class="mitochondrion" cx="206" cy="190" rx="21" ry="10" transform="rotate(10 206 190)"/>')}
    ${figure.cell === "blatt" ? mark("chloroplast", '<ellipse class="chloroplast" cx="153" cy="50" rx="17" ry="8"/><ellipse class="chloroplast" cx="252" cy="108" rx="10" ry="18"/><ellipse class="chloroplast" cx="128" cy="190" rx="18" ry="8"/>') : ""}
    <text x="310" y="48">Vorhandene Strukturen</text>
    ${names
      .filter(([, , exists]) => exists)
      .map(
        ([id, name], i) =>
          `<text x="310" y="${80 + i * 27}" class="${figure.highlight === id ? "selected-label" : ""}">${figure.highlight === id ? "→ " : ""}${name}</text>`,
      )
      .join("")}
  </svg>`;
}

function dna(figure: Extract<Diagram, { kind: "dna" }>): string {
  const { template, complement } = figure;
  return `<svg class="bio-figure" viewBox="0 0 520 160" role="img" aria-label="Vorlage 5′ ${template} 3′${complement ? `, Gegenstrang 3′ ${complement} 5′` : ""}">
    <text x="42" y="57">5′</text><text x="462" y="57">3′</text>
    ${complement ? '<text x="42" y="118">3′</text><text x="462" y="118">5′</text>' : ""}
    ${[...template]
      .map((base, i) => {
        const x = 117 + i * 95;
        return `<rect class="base-${base}" x="${x}" y="32" width="46" height="38" rx="7"/><text x="${x + 23}" y="57" text-anchor="middle">${base}</text>
      ${complement ? `<path class="base-link" d="M ${x + 23} 71 v 22"/><rect class="base-${complement[i]}" x="${x}" y="93" width="46" height="38" rx="7"/><text x="${x + 23}" y="118" text-anchor="middle">${complement[i]}</text>` : ""}`;
      })
      .join("")}
  </svg>`;
}

function karyogram(): string {
  return `<svg class="bio-figure" viewBox="0 0 520 276" role="img" aria-label="Schematisches Karyogramm mit 22 Autosomenpaaren und zwei X-Chromosomen">
    <text x="21" y="27">Karyogramm · Beispiel 46, XX · Schema</text>
    ${Array.from({ length: 23 }, (_, i) => {
      const x = 54 + (i % 8) * 59;
      const y = 65 + Math.floor(i / 8) * 75;
      const height = i === 22 ? 14 : 16 - i * 0.4;
      const shape = (center: number) =>
        `<path class="chromosome" d="M ${center - 4} ${y - height} L ${center + 4} ${y + height} M ${center + 4} ${y - height} L ${center - 4} ${y + height}"/>`;
      return `${shape(x - 8)}${shape(x + 8)}<text x="${x}" y="${y + 34}" text-anchor="middle">${i === 22 ? "XX" : i + 1}</text>`;
    }).join("")}
  </svg>`;
}

function diagram(figure: Diagram): string {
  switch (figure.kind) {
    case "cell":
      return cell(figure);
    case "microscope":
      return microscope(figure);
    case "dna":
      return dna(figure);
    case "karyogram":
      return karyogram();
    case "flow":
      return `<ol class="bio-flow" aria-label="${esc(figure.label)}">${figure.steps
        .map(
          (step, i) =>
            `<li${i === figure.active ? ' aria-current="step"' : ""}><span>${esc(step)}</span></li>`,
        )
        .join("")}</ol>`;
  }
}

export function renderModel(lesson: Lesson, seen: readonly string[], state: ModelState): string {
  if (!lesson.model) return "";
  const model = MODELS[lesson.model];
  const result: Readout = model.read(state);
  return `<section class="panel exploration" aria-labelledby="model-heading">
    <div class="panel-heading"><span class="eyebrow">MODELL</span><span class="done-mark">${seen.length} / ${model.goals.length} Ziele</span></div>
    <h2 id="model-heading">${esc(model.title)}</h2><p>${esc(model.instruction)}</p>
    <div class="model-controls">${model.controls
      .map(
        (control, index) =>
          `<label><span>${esc(control.label)}</span><select data-model-control="${index}">${control.options
            .map(
              (option, value) =>
                `<option value="${value}" ${state[index] === value ? "selected" : ""}>${esc(option)}</option>`,
            )
            .join("")}</select></label>`,
      )
      .join("")}</div>
    <p class="model-summary" role="status">${esc(result.summary)}</p>
    ${result.diagram ? diagram(result.diagram) : ""}
    ${result.chart ? lineChart(result.chart) : ""}
    ${result.table ? table(result.table) : ""}
    <ul class="model-goals" aria-label="Ziele">${model.goals
      .map(
        (goal) =>
          `<li><span aria-label="${seen.includes(goal.id) ? "Erreicht" : "Offen"}">${seen.includes(goal.id) ? "✓" : "○"}</span> ${esc(goal.label)}</li>`,
      )
      .join("")}</ul>
  </section>`;
}
