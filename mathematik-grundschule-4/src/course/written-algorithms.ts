import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import type { ExtraLessonId } from "./catalog";
import type { ForestTask } from "./tasks";
import { additionColumns, COLUMN_NAMES } from "./written-addition";

export type AlgorithmKind = "multiply" | "divide";
export interface Algorithm {
	kind: AlgorithmKind;
	a: number;
	b: number;
	shown?: number;
}
export const ALGORITHM_EXAMPLES: Record<AlgorithmKind, Algorithm> = {
	multiply: { kind: "multiply", a: 305, b: 24 },
	divide: { kind: "divide", a: 2138, b: 7 },
};
export interface AlgorithmField {
	label: string;
	value: number;
	max: number;
	blankZero?: boolean;
	hint: string;
}
export interface ProductRow {
	title: string;
	width: number;
	shift: number;
	result: number[];
	carries: number[];
	previews?: number[][];
}
export interface DivisionStep {
	digit: number;
	indices: number[];
}
export interface AlgorithmModel {
	fields: AlgorithmField[];
	rows: ProductRow[];
	steps: DivisionStep[];
	answer: number[];
	result: number;
	remainder: number;
}
export const isWrittenAlgorithm = (id: ExtraLessonId) =>
	id === "schriftlich-multiplizieren" || id === "schriftlich-dividieren";

export function algorithmModel({ kind, a, b }: Algorithm): AlgorithmModel {
	if (
		![a, b].every((n) => Number.isSafeInteger(n) && n >= 0) ||
		a > 1_000_000 ||
		(kind === "multiply" ? b > 99 || a * b > 1_000_000 : b < 1 || b > 10)
	)
		throw new Error("Written algorithm outside the lesson range");
	const fields: AlgorithmField[] = [],
		rows: ProductRow[] = [],
		steps: DivisionStep[] = [];
	const add = (
		label: string,
		value: number,
		max: number,
		hint: string,
		blankZero = false,
	) => {
		fields.push({
			label,
			value,
			max,
			hint,
			...(blankZero ? { blankZero: true } : {}),
		});
		return fields.length - 1;
	};
	if (kind === "multiply") {
		const factors = b < 10 ? [b] : [b % 10, Math.floor(b / 10)];
		for (const [shift, factor] of factors.entries()) {
			const width = Math.max(String(a).length, String(a * factor).length),
				result: number[] = [],
				carries: number[] = [];
			const title = shift === 0 ? "Einerreihe" : "Zehnerreihe";
			let carry = 0;
			for (let col = 0; col < width; col++) {
				const digit = Math.floor(a / 10 ** col) % 10;
				if (col > 0)
					carries[col] = add(
						`${title}: Übertrag zu ${COLUMN_NAMES[col + shift]}`,
						carry,
						8,
						`Multipliziere die vorige Ziffer mit ${factor} und rechne ihren ankommenden Übertrag mit. Die vollen Zehner dieser Spaltensumme werden hier mitgerechnet.`,
						true,
					);
				const total = digit * factor + carry;
				result[col] = add(
					`${title}: Ergebnis ${COLUMN_NAMES[col + shift]}`,
					total % 10,
					9,
					`Multipliziere in dieser Reihe die Ziffer mit ${factor}, addiere den ankommenden Übertrag und schreibe nur die Einerziffer. Der Übertrag gehört zur nächsten Stelle links.`,
				);
				carry = Math.floor(total / 10);
			}
			rows.push({
				title: `${title}: ${format(a)} · ${factor * 10 ** shift}`,
				width,
				shift,
				result,
				carries,
			});
		}
		if (factors.length === 2) {
			const model = additionColumns(a * factors[0], a * factors[1] * 10),
				result: number[] = [],
				carries: number[] = [];
			for (let col = 0; col < model.width; col++) {
				if (col > 0)
					carries[col] = add(
						`Summe: Übertrag zu ${COLUMN_NAMES[col]}`,
						model.carries[col],
						1,
						"Addiere die beiden Teilergebnisse und den ankommenden Übertrag spaltenweise. Ab zehn geht ein Zehner nach links.",
						true,
					);
				result[col] = add(
					`Summe: Ergebnis ${COLUMN_NAMES[col]}`,
					model.result[col],
					9,
					"Addiere die beiden Teilergebnisse stellenrichtig. Die Zehnerreihe ist um eine Stelle nach links verschoben; ihre Einerstelle ist 0.",
				);
			}
			rows.push({
				title: "Teilergebnisse addieren",
				width: model.width,
				shift: 0,
				result,
				carries,
				previews: rows.map((r) =>
					Array.from({ length: model.width }, (_, col) =>
						col < r.shift ? -1 : (r.result[col - r.shift] ?? -2),
					),
				),
			});
		}
	} else {
		let remainder = 0;
		for (const [i, digit] of [...String(a)].map(Number).entries()) {
			const current = remainder * 10 + digit,
				q = Math.floor(current / b),
				product = q * b;
			remainder = current - product;
			steps.push({
				digit,
				indices: [
					add(
						`Schritt ${i + 1}: Teilzahl`,
						current,
						99,
						"Hänge die nächste Ziffer rechts an den vorherigen Rest: vorheriger Rest mal zehn plus nächste Ziffer. Im ersten Schritt ist die Teilzahl die erste Ziffer.",
					),
					add(
						`Schritt ${i + 1}: Ergebnisziffer`,
						q,
						9,
						`Wie oft passt ${b} ganz in die Teilzahl? Prüfe mit dem Einmaleins. Passt der Teiler noch nicht hinein, schreibe hier 0; lasse keine Stelle aus.`,
					),
					add(
						`Schritt ${i + 1}: Abziehen`,
						product,
						90,
						`Multipliziere die Ergebnisziffer dieses Schritts mit ${b}. Diesen Betrag ziehst du von der Teilzahl ab.`,
					),
					add(
						`Schritt ${i + 1}: Rest`,
						remainder,
						b - 1,
						`Ziehe den berechneten Betrag von der Teilzahl ab. Der Rest muss kleiner als ${b} sein; sonst passt der Teiler noch einmal hinein.`,
					),
				],
			});
		}
	}
	return {
		fields,
		rows,
		steps,
		answer: fields.map((f) => f.value),
		result: kind === "multiply" ? a * b : Math.floor(a / b),
		remainder: kind === "multiply" ? 0 : a % b,
	};
}
export function validAlgorithmWork(
	work: unknown,
	algorithm: Algorithm,
): work is string[] {
	const { fields } = algorithmModel(algorithm);
	return (
		Array.isArray(work) &&
		work.length === fields.length &&
		work.every(
			(value, i) =>
				typeof value === "string" &&
				(value === "" ||
					(/^(0|[1-9][0-9]?)$/.test(value) && Number(value) <= fields[i].max)),
		)
	);
}
export function algorithmAnswer(
	algorithm: Algorithm,
	work: readonly string[],
): number[] | null {
	const { fields } = algorithmModel(algorithm);
	if (!validAlgorithmWork(work, algorithm)) return null;
	if (fields.some((f, i) => !f.blankZero && work[i] === "")) return null;
	return work.map(Number);
}
export function algorithmValidation(
	algorithm: Algorithm,
	work: readonly string[],
): string | null {
	if (!algorithmAnswer(algorithm, work))
		return `Fülle die Rechenfelder mit ganzen Zahlen im angegebenen Bereich. Auch bei 0 brauchst du einen Eintrag.${algorithm.kind === "multiply" ? " Kleine Übertragsfelder dürfen ohne Übertrag leer bleiben." : ""}`;
	const model = algorithmModel(algorithm);
	if (
		algorithm.kind === "multiply" &&
		model.fields.some((f) => f.blankZero && f.value > 0) &&
		model.fields.every((f, i) => f.blankZero || Number(work[i]) === f.value) &&
		model.fields.every((f, i) => !f.blankZero || work[i] === "")
	)
		return "Deine Ergebnisziffern passen. Trage auch deine Überträge in die kleinen Felder ein, damit Milo deinen Rechenweg sehen kann.";
	return null;
}
export function algorithmMistake(
	task: ForestTask,
	answer: number[] | null,
): string {
	if (!task.algorithm || !answer)
		return "Fülle die Rechenfelder aus, auch bei 0.";
	const { fields } = algorithmModel(task.algorithm),
		index = fields.findIndex((f, i) => f.value !== answer[i]);
	if (index < 0) return task.hint;
	const field = fields[index];
	if (field.blankZero && answer[index] > field.value) {
		return `${field.label}: ${
			field.value === 0
				? "Hier kommt kein Übertrag an: In der vorigen Spalte entsteht kein voller Zehner. Lass dieses kleine Feld leer oder schreibe 0."
				: `Dein Übertrag ist zu groß. ${field.hint} Notiere nur die Anzahl der vollen Zehner aus der vorigen Spaltensumme.`
		}`;
	}
	return `${field.label}: ${field.blankZero ? "Dein Übertrag ist zu klein. " : ""}${field.hint}`;
}
export function algorithmExplanation(algorithm: Algorithm): string {
	const { kind, a, b } = algorithm,
		model = algorithmModel(algorithm);
	if (kind === "divide") {
		const steps = model.steps.map((step, i) => {
			const [current, q, product, rest] = step.indices.map(
				(index) => model.answer[index],
			);
			return `Schritt ${i + 1}: ${current} : ${b} → ${q}; ${current} − ${product} = ${rest}`;
		});
		return `${format(a)} : ${b} = ${format(model.result)}${model.remainder ? ` Rest ${model.remainder}` : ""}. ${steps.join(". ")}. Probe: ${format(model.result)} · ${b} + ${model.remainder} = ${format(a)}. Der Rest ${model.remainder} ist kleiner als ${b}.`;
	}
	const parts =
		b < 10
			? ""
			: `Einerreihe: ${format(a)} · ${b % 10} = ${format(a * (b % 10))}. Zehnerreihe: ${format(a)} · ${Math.floor(b / 10) * 10} = ${format(a * Math.floor(b / 10) * 10)}; diese Reihe ist eine Stelle nach links verschoben. Addiere beide Teilergebnisse. `;
	const carries = model.rows
		.slice(0, b < 10 ? 1 : 2)
		.map((row, shift) => {
			const factor = Math.floor(b / 10 ** shift) % 10;
			const steps = row.result.map((index, col) => {
				const digit = Math.floor(a / 10 ** col) % 10;
				const incoming = col > 0 ? model.answer[row.carries[col]] : 0;
				const total = digit * factor + incoming;
				const outgoing = Math.floor(total / 10);
				return `${COLUMN_NAMES[col + row.shift]}: ${digit} · ${factor}${incoming ? ` + ${incoming} ankommender Übertrag` : ""} = ${total}; schreibe ${model.answer[index]}${outgoing ? `, übertrage ${outgoing} zu ${COLUMN_NAMES[col + row.shift + 1]}` : ", kein weiterer Übertrag"}`;
			});
			return `${row.title}: ${steps.join("; ")}`;
		})
		.join(". ");
	const unit = 10 ** (String(a).length - 1),
		left = Math.floor(a / unit) * unit,
		right = a - left;
	const probe =
		b === 0
			? "Beim Multiplizieren mit 0 ist das Produkt 0."
			: b >= 10
				? `Andere Zerlegung: ${format(a)} = ${format(left)} + ${format(right)}. ${format(left)} · ${b} = ${format(left * b)} und ${format(right)} · ${b} = ${format(right * b)}; zusammen ${format(a * b)}.`
				: `Umkehraufgabe: ${format(a * b)} : ${b} = ${format(a)}.`;
	return `${format(a)} · ${b} = ${format(a * b)}. ${parts}${carries}. ${probe}`;
}
function task(
	algorithm: Algorithm,
	goal: 1 | 2 | 3,
	prompt: string,
): ForestTask {
	const { kind, a, b } = algorithm;
	return {
		kind: "algorithm",
		algorithm,
		goal,
		prompt,
		answer: algorithmModel(algorithm).answer,
		calculation: { a, b, op: kind === "multiply" ? "·" : ":" },
		hint:
			kind === "multiply"
				? "Rechne jede Reihe von rechts nach links und notiere die Überträge. Bei einem zweistelligen Faktor kommt die Zehnerreihe eine Stelle weiter links. Addiere dann stellenrichtig."
				: "Rechne von links nach rechts: Teilzahl bilden, ganz teilen, multiplizieren, abziehen und die nächste Ziffer herunterholen. Schreibe auch Ergebnisziffern 0. Der letzte Rest muss kleiner als der Teiler sein.",
		explanation: algorithmExplanation(algorithm),
	};
}
export function algorithmLab(id: ExtraLessonId, goal: number): ForestTask {
	const multiply = id === "schriftlich-multiplizieren";
	const [a, b] = multiply
		? [
				[213, 3],
				[347, 6],
				[204, 23],
			][goal]
		: [
				[848, 4],
				[1206, 3],
				[1259, 6],
			][goal];
	return task(
		{ kind: multiply ? "multiply" : "divide", a, b },
		(goal + 1) as 1 | 2 | 3,
		multiply
			? [
					"Rechne 213 · 3 schriftlich. In dieser Reihe brauchst du keinen Übertrag.",
					"Rechne 347 · 6. Trage die Ergebnisziffern und jeden Übertrag ein.",
					"Rechne 204 · 23. Beachte den Wert der Zehnerreihe und addiere die beiden Teilergebnisse.",
				][goal]
			: [
					"Teile 848 durch 4 schriftlich. Fülle jeden Schritt von links nach rechts aus.",
					"Teile 1 206 durch 3. Welche Ergebnisstellen brauchen eine 0? Fülle auch diese Schritte aus.",
					"Verteile 1 259 Samen gleichmäßig auf 6 Beete. Rechne schriftlich, bestimme den Rest und prüfe ihn.",
				][goal],
	);
}
export function algorithmTask(
	id: ExtraLessonId,
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	const next = random(
		(seed + Math.imul(index + 1, 2654435761) + level * 104729) >>> 0,
	);
	const int = (lo: number, hi: number) =>
		lo + Math.floor(next() * (hi - lo + 1));
	const variant = index % 3,
		multiply = id === "schriftlich-multiplizieren";
	let a: number, b: number;
	if (multiply) {
		if (level === 1) {
			b = variant === 0 ? int(2, 3) : int(4, 9);
			a =
				variant === 0
					? int(1, 3) * 100 + int(0, 3) * 10 + int(0, 3)
					: int(1, 9) * 1000 + int(0, 9) * 100 + int(0, 9) * 10 + int(7, 9);
		} else {
			b = variant === 1 ? int(2, 9) * 10 : int(1, 8) * 10 + int(2, 9);
			a = int(1, 9) * 1000 + int(0, 9) * 100 + int(0, 9) * 10 + int(5, 9);
		}
	} else {
		b = level === 1 ? int(2, 5) : variant === 1 ? 10 : int(3, 9);
		const quotient =
			level === 1
				? int(1, 2) * 100 + int(1, 8) * 10 + int(1, 8)
				: int(1, 8) * 1000 + int(1, 8) * 10 + int(1, 8);
		a = b * quotient + (level === 2 && variant !== 1 ? int(1, b - 1) : 0);
	}
	const algorithm: Algorithm = { kind: multiply ? "multiply" : "divide", a, b };
	if (level === 1)
		return task(
			algorithm,
			variant === 0 ? 1 : 2,
			`Rechne ${format(a)} ${multiply ? "·" : ":"} ${b} schriftlich. ${multiply ? "Fülle Ergebnis und Überträge von rechts nach links aus." : "Fülle alle Schritte von links nach rechts aus; vergiss die Ergebnisstellen mit 0 nicht."}`,
		);
	if (variant === 2) {
		algorithm.shown = multiply
			? a * (b % 10) + a * Math.floor(b / 10)
			: Math.floor(a / b) + 1;
		return task(
			algorithm,
			3,
			`Milo erhält ${format(algorithm.shown)}${multiply ? " als Produkt" : " als Ergebnis ohne Rest"} bei ${format(a)} ${multiply ? "·" : ":"} ${b}. Rechne selbst schriftlich, verbessere sein Ergebnis und prüfe es.`,
		);
	}
	return task(
		algorithm,
		2,
		multiply
			? `Milo packt ${b} Kisten mit je ${format(a)} Samen. Wie viele Samen sind es zusammen? Rechne schriftlich, auch mit der Zehnerreihe.`
			: `Milo verteilt ${format(a)} Samen gleichmäßig auf ${b} Beete. Wie viele erhält jedes Beet, und wie viele bleiben übrig? Zeige deinen schriftlichen Rechenweg.`,
	);
}
export function algorithmExit(
	id: ExtraLessonId,
	seed: number,
	index: number,
): ForestTask {
	return index === 0
		? algorithmTask(id, 1, seed, 0)
		: algorithmTask(id, 2, seed, index === 1 ? 0 : 2);
}
