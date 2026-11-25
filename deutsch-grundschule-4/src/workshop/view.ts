// HTML for the three Werkstatt kinds. Every interactive element carries a
// data-action that main.ts handles; the markup itself holds no state.
import { esc } from "../format";
import type {
	MachineState,
	MachineWorkshop,
	SlotPuzzle,
	SlotState,
	SlotWorkshop,
	TrainState,
	TrainWorkshop,
	Workshop,
} from "../types";
import {
	type AnyState,
	isQuestion,
	isSlot,
	isStatement,
	puzzleSolved,
	trainSentence,
	verbPosition,
} from "./engine";
import { capitalFirst, changedWords } from "./effects";

function penOf(ws: SlotWorkshop, value: string) {
	return ws.pens.find((p) => p.value === value);
}

function slotPuzzle(ws: SlotWorkshop, state: SlotState, puzzle: SlotPuzzle, open: boolean): string {
	const row = state.values[puzzle.id] ?? [];
	let index = -1;
	const solved = puzzleSolved(ws, state, puzzle.id);
	// Gap puzzles keep each word together with its gap, so a line break
	// never splits "Mu[tt]er" into pieces.
	const BREAK = "\u0000";
	// A line feed in a gap puzzle gives each sentence its own row.
	const ROW = "\u0001";
	if (ws.variant === "letters") return puzzleBox(ws, puzzle, solved, open, letterLine(ws, puzzle, row, solved));
	const pieces = puzzle.parts
		.flatMap((part) => {
			if (!isSlot(part)) {
				if (ws.variant === "gap")
					return part
						.split(/(\s+)/)
						.filter(Boolean)
						.map((chunk) =>
							chunk.trim()
								? `<span class="fixed">${esc(chunk)}</span>`
								: chunk.includes("\n")
									? `${BREAK}${ROW}${BREAK}`
									: BREAK,
						);
				return ws.variant === "letters"
					? `<span class="letter">${esc(part)}</span>`
					: `<span class="fixed">${esc(part)}</span>`;
			}
			index += 1;
			const value = row[index] ?? "";
			const at = `data-puzzle="${puzzle.id}" data-slot="${index}"`;
			if (part.options) {
				// A solved word snaps together: only the chosen letters stay, still tappable.
				if (solved && value)
					return `<span class="gap-group done" role="group" aria-label="Lücke ${index + 1}"><button type="button" class="gap-option chosen" data-action="slot" ${at} data-choice="${esc(value)}" aria-pressed="true">${esc(value)}</button></span>`;
				return `<span class="gap-group" role="group" aria-label="Lücke ${index + 1}">${part.options
					.map(
						(o) =>
							`<button type="button" class="gap-option${value === o ? " chosen" : ""}" data-action="slot" ${at} data-choice="${esc(o)}" aria-pressed="${value === o}">${esc(o)}</button>`,
					)
					.join("")}</span>`;
			}
			if (ws.variant === "mark") {
				const pen = penOf(ws, value);
				const text = part.text ?? "";
				// Capital-letter workshops show the word as Tinto will type it.
				const capital = pen && ws.capitals ? capitalFirst(text) : "";
				const shown = capital
					? `<span class="word-text"><span class="cap">${esc([...capital][0] ?? "")}</span>${esc([...capital].slice(1).join(""))}</span>`
					: esc(text);
				const crown = capital && ws.capitals === "crown" ? '<span class="crown" aria-hidden="true">👑</span>' : "";
				return `<button type="button" class="token${pen ? ` pen-${pen.colour}` : ""}" data-action="slot" ${at} aria-pressed="${!!pen}" aria-label="${esc(capital || text)}${pen ? `, markiert als ${esc(pen.label)}` : ""}">${crown}${shown}${pen && ws.pens.length > 1 ? `<small>${esc(pen.label.split(/[ :(]/)[0])}</small>` : ""}</button>`;
			}
			const pen = penOf(ws, value);
			return `<button type="button" class="mark-box${pen ? ` pen-${pen.colour}` : ""}" data-action="slot" ${at} aria-label="${pen ? `Lücke mit ${esc(pen.label)}` : "leere Lücke"}">${value ? esc(value) : ""}</button>`;
		});
	const parts =
		ws.variant === "gap"
			? pieces
					.join("")
					.split(BREAK)
					.filter(Boolean)
					.map((word) => (word === ROW ? '<span class="row-end"></span>' : `<span class="word">${word}</span>`))
					.join(" ")
			: pieces.join(" ");
	return puzzleBox(ws, puzzle, solved, open, parts);
}

function puzzleBox(ws: SlotWorkshop, puzzle: SlotPuzzle, solved: boolean, open: boolean, line: string): string {
	return `<div class="puzzle${solved ? " solved" : ""}" data-variant="${ws.variant}" data-puzzle-box="${puzzle.id}">
<div class="puzzle-head"><span>${ws.variant === "letters" ? `<b class="whole">${esc(puzzle.parts.filter((x) => !isSlot(x)).join(""))}</b> · ` : ""}${esc(puzzle.label ?? "")}</span>${solved ? '<span class="tick">✓ geschafft</span>' : ""}${puzzle.help ? `<button type="button" class="text-button" data-action="help" data-puzzle="${puzzle.id}" aria-expanded="${open}">🔎 Lupe</button>` : ""}</div>
<div class="puzzle-line">${line}</div>
${puzzle.help && open ? `<p class="help">${esc(puzzle.help)}</p>` : ""}
</div>`;
}

/**
 * A word to cut. The letters between two cuts stand together on one arc
 * (Silbenbogen) or, for word building blocks, in one box, so the child sees
 * at once how the word is cut right now.
 */
function letterLine(ws: SlotWorkshop, puzzle: SlotPuzzle, row: string[], solved: boolean): string {
	const open = `<span class="${ws.pens[0]?.value === "-" ? "syl" : "brick"}${solved ? " ok" : ""}">`;
	let html = open;
	let index = -1;
	for (const part of puzzle.parts) {
		if (!isSlot(part)) {
			html += `<span class="letter">${esc(part)}</span>`;
			continue;
		}
		index += 1;
		const value = row[index] ?? "";
		const cut = `<button type="button" class="cut${value ? " on" : ""}" data-action="slot" data-puzzle="${puzzle.id}" data-slot="${index}" aria-pressed="${!!value}" aria-label="Schnitt zwischen den Buchstaben">${value ? esc(value) : ""}</button>`;
		html += value ? `</span>${cut}${open}` : cut;
	}
	return `${html}</span>`;
}

function slots(ws: SlotWorkshop, state: SlotState, openHelp: string[]): string {
	const toolbar =
		ws.pens.length > 1 || ws.variant === "punct"
			? `<div class="pens" role="toolbar" aria-label="Stifte">${ws.pens
					.map(
						(p) =>
							`<button type="button" class="pen pen-${p.colour}${state.pen === p.value ? " active" : ""}" data-action="pen" data-pen="${esc(p.value)}" aria-pressed="${state.pen === p.value}">${ws.variant === "punct" ? `<b>${esc(p.value)}</b> ` : ""}${esc(p.label)}</button>`,
					)
					.join("")}</div>`
			: "";
	return `${toolbar}<div class="puzzles">${ws.puzzles.map((p) => slotPuzzle(ws, state, p, openHelp.includes(p.id))).join("")}</div>`;
}

function train(ws: TrainWorkshop, state: TrainState): string {
	const n = state.order.length;
	const wagons = state.order
		.map((w, i) => {
			const wagon = ws.wagons[w];
			const text = i === 0 ? wagon.start : wagon.mid;
			return `<li class="wagon${wagon.verb ? " verb" : ""}" data-wagon="${w}" data-pos="${i}"><span class="wagon-text" data-drag="${i}" title="Ziehen zum Umstellen">${esc(text)}</span>${wagon.verb ? '<span class="wagon-tag">Prädikat</span>' : ""}
<span class="wagon-buttons"><button type="button" data-action="wagon-left" data-pos="${i}" ${i === 0 ? "disabled" : ""} aria-label="${esc(text)} nach links">◀</button><button type="button" data-action="wagon-front" data-pos="${i}" ${i === 0 ? "disabled" : ""} aria-label="${esc(text)} an den Anfang">⇤</button><button type="button" data-action="wagon-right" data-pos="${i}" ${i === n - 1 ? "disabled" : ""} aria-label="${esc(text)} nach rechts">▶</button></span>
<span class="wheels" aria-hidden="true"><i></i><i></i></span></li>`;
		})
		.join("");
	const statement = isStatement(ws, state);
	const question = isQuestion(ws, state);
	const verb = verbPosition(ws, state);
	const status = statement
		? "✓ Ein richtiger Aussagesatz. Das Prädikat steht an zweiter Stelle."
		: question
			? "✓ Eine richtige Ja-Nein-Frage. Das Prädikat steht vorne."
			: state.end === "?"
				? "Für eine Ja-Nein-Frage muss das Prädikat ganz vorne stehen."
				: verb === 0
					? "Steht das Prädikat vorne, wird es eine Frage. Setze ein Fragezeichen!"
					: "So klingt es falsch. Im Aussagesatz steht das Prädikat an zweiter Stelle.";
	return `<ol class="train${statement || question ? " ok" : ""}" aria-label="Satzzug"><li class="loco" aria-hidden="true">${LOCO}</li>${wagons}<li class="wagon end"><span class="wagon-text">${state.end}</span><span class="wagon-buttons"><button type="button" data-action="end" data-end="." aria-pressed="${state.end === "."}">.</button><button type="button" data-action="end" data-end="?" aria-pressed="${state.end === "?"}">?</button></span></li></ol>
<p class="sentence-out ${statement || question ? "ok" : "miss"}" aria-live="polite"><strong>${esc(trainSentence(ws, state))}</strong><br><span>${status}</span></p>
<p class="small">Schon vorne gestanden: ${state.frontSeen.length ? state.frontSeen.map((w) => esc(ws.wagons[w].mid)).join(" · ") : "–"}</p>`;
}

function machine(ws: MachineWorkshop, state: MachineState, previous?: string): string {
	const view = ws.view(state.values);
	// Words that changed with the last turn of a wheel light up.
	const changed = changedWords(previous, view.display);
	const display = view.display
		.split(" ")
		.map((word, i) => (changed[i] ? `<mark class="changed">${esc(word)}</mark>` : esc(word)))
		.join(" ");
	const controls = ws.controls
		.map(
			(c) =>
				`<fieldset class="dial"><legend>${esc(c.label)}</legend>${c.options
					.map(
						(o) =>
							`<button type="button" class="dial-option${state.values[c.id] === o ? " chosen" : ""}" data-action="control" data-control="${c.id}" data-value="${esc(o)}" aria-pressed="${state.values[c.id] === o}">${esc(o)}</button>`,
					)
					.join("")}</fieldset>`,
		)
		.join("");
	return `<div class="machine">${controls}</div>
<div class="machine-out ${view.tone ?? "ok"}" aria-live="polite"><span class="gears${changed.some(Boolean) ? " turn" : ""}" aria-hidden="true">⚙️</span><strong>${display}</strong><span>${esc(view.note)}</span></div>`;
}

/** The little locomotive at the head of every Satzzug. */
const LOCO = `<svg viewBox="0 0 90 64" focusable="false"><g class="steam"><circle cx="22" cy="12" r="6"/><circle cx="14" cy="6" r="4"/><circle cx="8" cy="2" r="2.5"/></g>
<path d="M16 22h12v10H16Z" class="loco-chimney"/><path d="M10 30h50v20H10Z" class="loco-boiler"/><path d="M48 14h28v36H48Z" class="loco-cab"/><path d="M54 20h16v12H54Z" class="loco-window"/>
<path d="M4 50h80v6H4Z" class="loco-frame"/><circle cx="22" cy="56" r="7" class="loco-wheel"/><circle cx="44" cy="56" r="7" class="loco-wheel"/><circle cx="68" cy="56" r="7" class="loco-wheel"/></svg>`;

/** `previous` is the machine sentence before the last change; its changed words light up. */
export function workshopHtml(ws: Workshop, state: AnyState, openHelp: string[] = [], previous?: string): string {
	if (ws.kind === "slots") return slots(ws, state as SlotState, openHelp);
	if (ws.kind === "train") return train(ws, state as TrainState);
	return machine(ws, state as MachineState, previous);
}
