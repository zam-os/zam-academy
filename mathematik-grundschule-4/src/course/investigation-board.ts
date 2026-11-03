import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import type { Investigation } from "./investigations";

const html = (text: string) =>
	text.replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			] ?? c,
	);
export function investigationBoard(
	board: Investigation,
	work: readonly string[] = [],
	solved = false,
): string {
	const next = random(
		board.identity
			.join("/")
			.split("")
			.reduce((n, c) => Math.imul(n, 31) + c.charCodeAt(0), 0) >>> 0,
	);
	const fields = board.fields
		.map((f, i) => {
			const value = work[i] ?? "";
			if (solved)
				return `<div class="investigation-field"><strong>${html(f.label)}</strong><output>${html(f.choices?.find((c) => String(c.value) === value)?.label ?? (value === "" ? "—" : format(Number(value))))}</output></div>`;
			const options = [...(f.choices ?? [])];
			for (let j = options.length - 1; j > 0; j--) {
				const k = Math.floor(next() * (j + 1));
				[options[j], options[k]] = [options[k], options[j]];
			}
			const attributes = `id="investigation-${i}" data-action="forest-investigation" data-col="${i}" aria-describedby="investigation-note"`;
			return f.choices
				? `<fieldset class="investigation-field investigation-choice"><legend>${html(f.label)}</legend>${options.map((c) => `<label for="investigation-${i}-${c.value}"><input type="radio" id="investigation-${i}-${c.value}" name="investigation-${i}" data-value="${c.value}" data-action="forest-investigation" data-col="${i}" aria-describedby="investigation-note" value="${c.value}" ${String(c.value) === value ? "checked" : ""}><span>${html(c.label)}</span></label>`).join("")}</fieldset>`
				: `<label class="investigation-field" for="investigation-${i}">${html(f.label)}<input ${attributes} inputmode="numeric" type="text" autocomplete="off" spellcheck="false" maxlength="12" value="${html(value)}" placeholder="Zahl eingeben"></label>`;
		})
		.join("");
	return `<div class="investigation-workshop"><div class="investigation-scroll" tabindex="0" role="region" aria-label="Aufgabentabelle, bei Bedarf seitlich verschiebbar"><table><caption>${html(board.caption)}</caption><thead><tr>${board.headers.map((h) => `<th scope="col">${html(h)}</th>`).join("")}</tr></thead><tbody>${board.rows.map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${html(cell)}</th>` : `<td>${html(cell)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div><div class="investigation-fields">${fields}</div>${solved ? "" : '<p id="investigation-note" class="fine-print">Trage deine Zwischenschritte ein und begründe deine Entscheidung. Du kannst alles vor dem Prüfen ändern.</p><p id="investigation-error" class="fine-print" role="status"></p>'}</div>`;
}
