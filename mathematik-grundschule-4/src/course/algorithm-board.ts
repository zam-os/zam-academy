import { format } from "../math/place-value";
import { COLUMN_NAMES } from "./written-addition";
import { algorithmModel, type Algorithm } from "./written-algorithms";

export function algorithmBoard(
	algorithm: Algorithm,
	work: readonly string[] = [],
	solved = false,
): string {
	const model = algorithmModel(algorithm);
	const field = (index: number) => {
		const f = model.fields[index],
			raw = work[index] ?? "",
			value = /^(0|[1-9][0-9]?)$/.test(raw) && Number(raw) <= f.max ? raw : "";
		return solved
			? `<output aria-label="${f.label}">${value || "0"}</output>`
			: `<input id="algorithm-${index}" data-action="forest-algorithm" data-col="${index}" data-max="${f.max}" tabindex="${index === 0 ? 0 : -1}" aria-label="${f.label}" aria-describedby="algorithm-input-note" type="text" inputmode="numeric" maxlength="${f.max < 10 ? 1 : 2}" pattern="[0-9]+" autocomplete="off" spellcheck="false" value="${value}">`;
	};
	const op = algorithm.kind === "multiply" ? "·" : ":";
	const correction =
		algorithm.shown === undefined
			? ""
			: `<p>Milos Ergebnis zum Überprüfen: <strong>${format(algorithm.shown)}</strong>${algorithm.kind === "divide" ? " ohne Rest" : ""}</p>`;
	const product = model.rows
		.map((row, rowIndex) => {
			const zeroRow =
				algorithm.kind === "multiply" &&
				algorithm.b >= 10 &&
				algorithm.b % 10 === 0 &&
				rowIndex === 0;
			const places = Array.from(
				{ length: row.width + row.shift },
				(_, i) => row.width + row.shift - 1 - i,
			);
			const result = (col: number) =>
				col < row.shift
					? '<span aria-label="Feste 0 in der Einerstelle der Zehnerreihe">0</span>'
					: field(row.result[col - row.shift]);
			const previews = (row.previews ?? [])
				.map(
					(line, i) =>
						`<tr><th scope="row">${i === 0 ? "Einerreihe" : "Zehnerreihe"}</th>${places.map((col) => `<td>${line[col] === -1 ? "0" : line[col] === -2 ? "" : `<span class="algorithm-preview" data-from="${line[col]}">${work[line[col]] || "?"}</span>`}</td>`).join("")}</tr>`,
				)
				.join("");
			return `<section class="algorithm-row"><h3>${row.title}${zeroRow ? " · Nullreihe" : ""}</h3>${zeroRow ? "<p>Die Einerziffer des Faktors ist 0. Trage in diese Ergebnisreihe 0 ein. Beim Addieren ändert die Nullreihe die Summe nicht.</p>" : ""}<div class="column-scroll" tabindex="0" role="region" aria-label="Multiplikationstafel, bei Bedarf seitlich verschiebbar"><table class="column-board"><caption>${row.title}</caption><thead><tr><th scope="col">Stelle</th>${places.map((col) => `<th scope="col">${COLUMN_NAMES[col]}</th>`).join("")}</tr></thead><tbody>${previews}<tr class="carry-row"><th scope="row">Übertrag</th>${places.map((col) => `<td>${col <= row.shift ? "–" : field(row.carries[col - row.shift])}</td>`).join("")}</tr><tr class="column-result"><th scope="row">${row.previews ? "Produkt" : "Teilergebnis"}</th>${places.map((col) => `<td>${result(col)}</td>`).join("")}</tr></tbody></table></div></section>`;
		})
		.join("");
	const division = model.steps
		.map(
			(step, i) =>
				`<fieldset class="division-step"><legend>Schritt ${i + 1} · nächste Ziffer: ${step.digit}</legend><div class="division-fields">${step.indices.map((index) => `<label>${model.fields[index].label.split(": ")[1]}${field(index)}</label>`).join("")}</div></fieldset>`,
		)
		.join("");
	const result = solved
		? `<p class="jump-equation">${format(algorithm.a)} ${op} ${algorithm.b} = ${format(model.result)}${algorithm.kind === "divide" ? ` Rest ${model.remainder}` : ""}</p>`
		: "";
	return `<div class="algorithm-workshop"><p class="jump-equation">${format(algorithm.a)} ${op} ${algorithm.b}</p>${correction}<p>${algorithm.kind === "multiply" ? (algorithm.b < 10 ? "Rechne von rechts nach links. Multipliziere jede Ziffer und rechne den ankommenden Übertrag mit. Schreibe die Einerziffer ins Ergebnis und die vollen Zehner als Übertrag zur nächsten Stelle links." : "Rechne jede Reihe von rechts nach links. Die feste 0 verschiebt die Zehnerreihe um eine Stelle. Danach addierst du die Teilergebnisse.") : "Rechne von links nach rechts. Teilzahl = vorheriger Rest · 10 + nächste Ziffer; im ersten Schritt nur die erste Ziffer. Schreibe bei jeder Ziffer einen Schritt, auch wenn die Ergebnisziffer 0 ist. Führende Ergebnisnullen lässt du erst beim Lesen der ganzen Antwort weg."}</p>${product}${division}${result}${solved ? "" : `<p class="fine-print" id="algorithm-input-note">Alle ${algorithm.kind === "multiply" ? "großen " : ""}Felder brauchen einen Eintrag, auch bei 0.${algorithm.kind === "multiply" ? " Kleine Übertragsfelder dürfen ohne Übertrag leer bleiben." : ""} Mit Tab gehst du in Rechenreihenfolge weiter.</p><p class="fine-print" id="algorithm-input-error" role="status"></p>`}</div>`;
}
