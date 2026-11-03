import { format, parseInteger } from "../math/place-value";
import { random } from "../practice/tasks";
import type { Answer, ForestTask } from "./tasks";

export const INVESTIGATION_IDS = [
	"muster-zahlbeziehungen",
	"sachaufgaben-mehrschrittig",
] as const;
export type InvestigationId = (typeof INVESTIGATION_IDS)[number];
export const isInvestigation = (id: string): id is InvestigationId =>
	INVESTIGATION_IDS.some((key) => key === id);
export interface InvestigationField {
	label: string;
	value: number;
	hint: string;
	choices?: { value: number; label: string }[];
}
export interface Investigation {
	// Mathematical identity, independent of prose, table layout and option order.
	identity: (string | number)[];
	caption: string;
	headers: string[];
	rows: string[][];
	fields: InvestigationField[];
}
const field = (
	label: string,
	value: number,
	hint: string,
): InvestigationField => ({ label, value, hint });
const rule = (
	label: string,
	labels: string[],
	hint: string,
): InvestigationField => ({
	label,
	value: 1,
	hint,
	choices: labels.map((text, i) => ({ value: i + 1, label: text })),
});
function task(
	goal: 1 | 2 | 3,
	prompt: string,
	investigation: Investigation,
	hint: string,
	explanation: string,
): ForestTask {
	return {
		kind: "investigation",
		goal,
		prompt,
		investigation,
		answer: investigation.fields.map((f) => f.value),
		hint,
		explanation,
	};
}

// The stated rule makes the continuation determinate: a finite prefix alone
// cannot determine a unique sequence. Transfer tasks ask for a missing value
// and continuation under an explicitly stated repeating rule.
function sequence(start: number, step: number, transfer: boolean): ForestTask {
	const sign = step > 0 ? "+" : "−",
		size = Math.abs(step);
	const values = Array.from({ length: 5 }, (_, i) => start + i * step);
	const check = `Vergleiche benachbarte Zahlen: Wie groß ist der Abstand, in welche Richtung geht es?`;
	const fields = [
		rule(
			"Die gleiche Regel für jeden Schritt",
			[
				`Immer ${format(size)} ${step > 0 ? "dazu" : "weg"}`,
				`Immer ${format(size * 10)} ${step > 0 ? "dazu" : "weg"}`,
				`Abwechselnd ${format(size)} dazu und weg`,
			],
			check,
		),
		field(
			transfer ? "Fehlende 2. Zahl" : "4. Zahl",
			transfer ? values[1] : values[3],
			check,
		),
		field(
			"5. Zahl",
			values[4],
			"Wende dieselbe Regel auch auf den letzten Übergang an.",
		),
	];
	return task(
		1,
		transfer
			? "Finde die Lücke und setze fort. Der gleiche Abstand gilt bei jedem Schritt."
			: "Untersuche die Folge. Gehe immer mit dem gleichen Abstand weiter.",
		{
			identity: ["sequence", start, step],
			caption: "Ein gleichmäßiger Zahlenpfad",
			headers: ["Platz", "Zahl"],
			rows: values.map((n, i) => [
				String(i + 1),
				i === 4 || i === (transfer ? 1 : 3) ? "?" : format(n),
			]),
			fields,
		},
		check,
		`Die Regel lautet ${sign} ${format(size)}. Die Folge ist ${values.map(format).join(" → ")}. Prüfe jeden Übergang, auch über die Lücke hinweg.`,
	);
}
function packet(
	a: number,
	b: number,
	delta: number,
	transfer: boolean,
): ForestTask {
	const changeB = transfer ? -delta : delta;
	const totalChange = delta + changeB;
	const rows = Array.from({ length: 4 }, (_, i) => [
		a + i * delta,
		b + i * changeB,
	]);
	const hint = transfer
		? `Der erste Summand wächst um ${format(delta)}, der zweite wird um ebenso viel kleiner. Was passiert zusammen?`
		: `Beide Summanden wachsen jeweils um ${format(delta)}. Berücksichtige beide Veränderungen.`;
	return task(
		2,
		transfer
			? "Ein Summand wächst, der andere schrumpft um gleich viel. Ergänze das Päckchen und beschreibe die Summe."
			: "Beide Summanden wachsen gleichmäßig. Ergänze das Päckchen und beschreibe die Summe.",
		{
			identity: ["packet", a, b, delta, changeB],
			caption: "Ein strukturiertes Aufgabenpäckchen",
			headers: ["1. Summand", "2. Summand", "Summe"],
			rows: rows.map(([x, y], i) => [
				format(x),
				format(y),
				i < 2 ? format(x + y) : "?",
			]),
			fields: [
				rule(
					"So verändert sich die Summe von Zeile zu Zeile",
					[
						transfer
							? "Sie bleibt gleich."
							: `Sie wächst um ${format(totalChange)}.`,
						transfer
							? `Sie wächst um ${format(delta)}.`
							: `Sie wächst nur um ${format(delta)}.`,
						"Sie wird kleiner.",
					],
					hint,
				),
				field("Summe in Zeile 3", rows[2][0] + rows[2][1], hint),
				field("Summe in Zeile 4", rows[3][0] + rows[3][1], hint),
			],
		},
		hint,
		`${transfer ? "Gleich viel dazu und weg gleicht sich aus: Die Summe bleibt gleich." : `Zweimal ${format(delta)} dazu macht die Summe um ${format(totalChange)} größer.`} Zeile 3: ${format(rows[2][0])} + ${format(rows[2][1])} = ${format(rows[2][0] + rows[2][1])}. Zeile 4: ${format(rows[3][0])} + ${format(rows[3][1])} = ${format(rows[3][0] + rows[3][1])}.`,
	);
}
const anna = (a: number, b: number) => 1001 * a + 110 * b;
function annaPattern(a: number, b: number, transfer: boolean): ForestTask {
	const da = 1,
		db = transfer ? 0 : 1;
	const pairs = Array.from({ length: 3 }, (_, i) => [a + i * da, b + i * db]);
	const rows = pairs.map(([x, y]) => [anna(x, y), anna(y, x)]);
	const difference = rows[2][0] - rows[2][1];
	const hint = transfer
		? "Nur die äußere Ziffer der größeren ANNA-Zahl wächst um 1. Beim Tausch wächst dieselbe Ziffer auf den inneren Stellen. Vergleiche die ersten beiden Differenzen."
		: "Beide Ziffern wachsen um 1. So werden beide Zahlen um 1 111 größer. Was bedeutet das für ihre Differenz?";
	return task(
		3,
		transfer
			? "Verändere das ANNA-Muster: Nur A wächst um 1, B bleibt gleich. Baue die dritte Zeile und prüfe die Differenz."
			: "Verändere das ANNA-Muster: A und B wachsen jeweils um 1. Baue die dritte Zeile und prüfe die Differenz.",
		{
			identity: ["anna", a, b, da, db],
			caption: "ANNA: außen A, innen B. Die Tauschzahl vertauscht A und B.",
			headers: ["A", "B", "ANNA-Zahl", "Tauschzahl", "Differenz"],
			rows: pairs.map(([x, y], i) => [
				String(x),
				String(y),
				i < 2 ? format(rows[i][0]) : "?",
				i < 2 ? format(rows[i][1]) : "?",
				i < 2 ? format(rows[i][0] - rows[i][1]) : "?",
			]),
			fields: [
				field(
					"ANNA-Zahl in Zeile 3",
					rows[2][0],
					"Schreibe A außen und B zweimal innen: A B B A.",
				),
				field(
					"Tauschzahl in Zeile 3",
					rows[2][1],
					"Schreibe B außen und A zweimal innen: B A A B.",
				),
				field("Differenz in Zeile 3", difference, hint),
				rule(
					"So verändert sich die Differenz",
					[
						transfer ? "Sie wächst jedes Mal um 891." : "Sie bleibt gleich.",
						transfer ? "Sie bleibt gleich." : "Sie wächst jedes Mal um 1 111.",
						"Sie wird jedes Mal um 1 kleiner.",
					],
					hint,
				),
			],
		},
		hint,
		`${format(rows[2][0])} − ${format(rows[2][1])} = ${format(difference)}. ${transfer ? "Die größere Zahl wächst um 1 001, die kleinere um 110. Die Differenz wächst deshalb um 891." : "Beide Zahlen wachsen um 1 111; ihre Differenz bleibt gleich."} Das gilt für dieses Muster, solange die verwendeten Ziffern einstellig bleiben.`,
	);
}
export function patternTask(
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	const next = random(
		(seed + Math.imul(index + 1, 2654435761) + level * 104729) >>> 0,
	);
	const int = (lo: number, hi: number) =>
		lo + Math.floor(next() * (hi - lo + 1));
	if (index % 3 === 0) {
		const step =
			[25, 50, 125, 250, 1000][int(0, 4)] * (level === 2 && int(0, 1) ? -1 : 1);
		return sequence(
			int(5, 300) * 1000 + int(0, 3) * 250 + (step < 0 ? -4 * step : 0),
			step,
			level === 2,
		);
	}
	if (index % 3 === 1) {
		const delta = [5, 10, 20, 50][int(0, 3)];
		return packet(
			int(10, 200) * 10,
			int(10, 200) * 10 + 3 * delta,
			delta,
			level === 2,
		);
	}
	const b = int(1, 3),
		a = int(b + 1, 6);
	return annaPattern(a, b, level === 2);
}
export function patternLab(index: number): ForestTask {
	return [
		() => sequence(1250, 250, false),
		() => packet(340, 120, 10, false),
		() => annaPattern(4, 1, false),
	][index % 3]();
}

function packing(
	groups: number,
	each: number,
	used: number,
	irrelevant: number,
	transfer: boolean,
): ForestTask {
	const total = groups * each,
		left = total - used;
	const story = `${groups} Beutel enthalten je ${format(each)} Samen. ${format(used)} Samen werden gesät. Im Schuppen stehen außerdem ${irrelevant} Gießkannen. Wie viele Samen bleiben übrig?`;
	const hint =
		"Rechne zuerst aus, wie viele Samen in allen Beuteln sind. Ziehe erst dann die gesäten Samen ab. Die Gießkannen ändern die Anzahl der Samen nicht.";
	return task(
		1,
		story,
		{
			identity: ["packing", groups, each, used],
			caption: transfer
				? "Dein Lösungsplan: Was brauchst du aus dem Text?"
				: "Beutel → alle Samen → übrige Samen",
			headers: ["Angabe", "Wert"],
			rows: [
				["Beutel", String(groups)],
				["Samen je Beutel", format(each)],
				["Gesäte Samen", format(used)],
				["Gießkannen", String(irrelevant)],
			],
			fields: [
				rule(
					"Mein Rechenplan",
					[
						"Zuerst Beutel · Samen je Beutel, dann gesäte Samen abziehen.",
						"Zuerst Samen je Beutel − gesäte Samen, dann mal Beutel.",
						"Alle Zahlen aus dem Text addieren.",
					],
					hint,
				),
				field(
					"Samen vor dem Säen",
					total,
					"Gleich gefüllte Beutel: Anzahl der Beutel mal Inhalt eines Beutels.",
				),
				field(
					"Samen nach dem Säen",
					left,
					"Ziehe die gesäten Samen vom gesamten Vorrat ab.",
				),
				rule(
					"Mein Antwortsatz und Check",
					[
						"Die Antwort zählt Samen und ist kleiner als der Vorrat vor dem Säen.",
						"Die Antwort zählt Beutel, keine Samen.",
						"Nach dem Säen müssen mehr Samen da sein als vorher.",
					],
					"Der Antwortsatz muss die Frage beantworten und die richtige Sache zählen.",
				),
			],
		},
		hint,
		`${groups} · ${format(each)} = ${format(total)} Samen vor dem Säen. ${format(total)} − ${format(used)} = ${format(left)} Samen bleiben. Die ${irrelevant} Gießkannen sind für diese Frage nicht nötig. Die Restmenge ist kleiner als der Vorrat.`,
	);
}
function boats(
	first: number,
	second: number,
	seats: number,
	transfer: boolean,
): ForestTask {
	const total = first + second,
		full = Math.floor(total / seats),
		rest = total % seats,
		needed = Math.ceil(total / seats);
	const hint =
		"Zähle zuerst alle Kinder zusammen. Teile dann durch die Plätze pro Boot. Bleiben Kinder übrig, brauchen auch sie ein Boot. Ein nur teilweise besetztes Boot zählt mit.";
	return task(
		2,
		`${first} Kinder aus dem einen Camp und ${second} aus dem anderen möchten gleichzeitig übersetzen. In jedes Boot passen ${seats} Kinder. Wie viele Boote braucht man mindestens? Zähle nur die Kinderplätze; die Bootsführer haben eigene Plätze.`,
		{
			identity: [
				"boats",
				Math.min(first, second),
				Math.max(first, second),
				seats,
			],
			caption: transfer
				? "Eine Division muss zur Situation passen"
				: "Beide Gruppen → alle Kinder → Boote",
			headers: ["Angabe", "Anzahl"],
			rows: [
				["Camp 1", String(first)],
				["Camp 2", String(second)],
				["Kinderplätze je Boot", String(seats)],
			],
			fields: [
				field(
					"Kinder insgesamt",
					total,
					"Beide Camps fahren gleichzeitig: Addiere ihre Kinderzahlen.",
				),
				field(
					"Volle Boote",
					full,
					"Wie oft passt die Platzzahl ganz in die Kinderzahl?",
				),
				field(
					"Kinder nach den vollen Booten",
					rest,
					"Prüfe: volle Boote · Plätze + Rest = alle Kinder.",
				),
				field("Benötigte Boote insgesamt", needed, hint),
				rule(
					"Darum passt meine Antwort",
					[
						rest
							? "Auch die übrigen Kinder brauchen ein Boot."
							: "Alle Kinder passen genau in die vollen Boote.",
						rest
							? "Die übrigen Kinder lasse ich am Ufer."
							: "Auch ohne übrige Kinder brauche ich immer ein zusätzliches Boot.",
						"Die Zahl der Boote ist gleich der Kinderzahl.",
					],
					hint,
				),
			],
		},
		hint,
		`${first} + ${second} = ${total} Kinder. ${total} : ${seats} = ${full}${rest ? ` Rest ${rest}` : " ohne Rest"}. ${rest ? `Für die ${rest} übrigen Kinder kommt ein weiteres Boot dazu: ${full} + 1 = ${needed}.` : `Es ${needed === 1 ? "genügt" : "genügen"} genau ${needed} ${needed === 1 ? "Boot" : "Boote"}.`} Probe: ${needed} · ${seats} = ${needed * seats} Plätze reichen; ein Boot weniger hätte nur ${(needed - 1) * seats} Plätze.`,
	);
}
function backwards(
	groups: number,
	each: number,
	given: number,
	transfer: boolean,
): ForestTask {
	const remaining = groups * each,
		original = remaining + given;
	const hint =
		"Arbeite rückwärts: Die gleich gefüllten Kisten zeigen den Rest. Rechne zuerst Kisten mal Inhalt. Die vorher verschenkten Muscheln kommen zum Anfangsvorrat wieder dazu.";
	return task(
		3,
		`Milo verschenkt ${given} Muscheln. Den Rest verteilt er gleichmäßig auf ${groups} Kisten. In jeder Kiste liegen nun ${each} Muscheln. Wie viele Muscheln hatte Milo am Anfang?${transfer ? ` Milo schlägt vor: „${groups} · ${each} − ${given}.“ Prüfe und verbessere seinen Plan.` : ""}`,
		{
			identity: ["backwards", groups, each, given],
			caption: "Rückwärts vom bekannten Rest zum Anfang",
			headers: ["Zeitpunkt", "Was ist bekannt?"],
			rows: [
				["Am Anfang", "gesucht"],
				["Danach", `${given} Muscheln verschenkt`],
				["Zum Schluss", `${groups} Kisten mit je ${each} Muscheln`],
			],
			fields: [
				rule(
					"So komme ich zurück zum Anfang",
					[
						"Erst den Rest in allen Kisten berechnen, dann die verschenkten Muscheln dazuzählen.",
						"Erst den Rest berechnen, dann die verschenkten Muscheln noch einmal abziehen.",
						"Nur Kisten und Muscheln je Kiste addieren.",
					],
					hint,
				),
				field(
					"Muscheln nach dem Verschenken",
					remaining,
					"Die Kisten enthalten zusammen den Rest, nicht schon den Anfangsvorrat.",
				),
				field("Muscheln am Anfang", original, hint),
				rule(
					"Meine Probe zur Geschichte",
					[
						"Anfangsvorrat minus verschenkte Muscheln ergibt den Rest in den Kisten.",
						"Anfangsvorrat plus verschenkte Muscheln muss den Rest ergeben.",
						"Der Anfang muss kleiner als der Rest sein.",
					],
					"Spiele die Geschichte mit deiner Anfangszahl vorwärts durch.",
				),
			],
		},
		hint,
		`${groups} · ${each} = ${format(remaining)} Muscheln sind nach dem Verschenken übrig. ${format(remaining)} + ${given} = ${format(original)} Muscheln waren es am Anfang. Vorwärtsprobe: ${format(original)} − ${given} = ${format(remaining)}, dann ${format(remaining)} : ${groups} = ${each}.`,
	);
}
export function storyTask(
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	const next = random(
		(seed + Math.imul(index + 1, 2246822519) + level * 65537) >>> 0,
	);
	const int = (lo: number, hi: number) =>
		lo + Math.floor(next() * (hi - lo + 1));
	if (index % 3 === 0) {
		const groups = int(3, 9),
			each = level === 1 ? int(2, 6) * 10 : int(21, 85);
		return packing(
			groups,
			each,
			int(1, groups * each - 1),
			int(2, 9),
			level === 2,
		);
	}
	if (index % 3 === 1) {
		const seats = int(3, 10),
			full = int(4, 12),
			rest = level === 1 ? 0 : int(1, seats - 1),
			total = seats * full + rest,
			first = int(2, total - 2);
		return boats(first, total - first, seats, level === 2);
	}
	return backwards(
		int(3, 9),
		level === 1 ? int(2, 7) * 10 : int(21, 95),
		int(11, 89),
		level === 2,
	);
}
export function storyLab(index: number): ForestTask {
	return [
		() => packing(6, 20, 18, 4, false),
		() => boats(23, 19, 6, false),
		() => backwards(4, 25, 16, false),
	][index % 3]();
}
export function investigationExit(
	id: InvestigationId,
	seed: number,
	index: number,
): ForestTask {
	return id === "muster-zahlbeziehungen"
		? patternTask(2, seed ^ 0x6a09e667, index)
		: storyTask(2, seed ^ 0xbb67ae85, index);
}
export function investigationInput(
	board: Investigation,
	values: string[],
): number[] | null {
	if (values.length !== board.fields.length) return null;
	const result: number[] = [];
	for (let i = 0; i < values.length; i++) {
		const value = parseInteger(values[i]);
		if (
			value === null ||
			(board.fields[i].choices &&
				!board.fields[i].choices?.some((c) => c.value === value))
		)
			return null;
		result.push(value);
	}
	return result;
}
export function validInvestigationWork(
	raw: unknown,
	board: Investigation,
): raw is string[] {
	return (
		Array.isArray(raw) &&
		raw.length === board.fields.length &&
		raw.every(
			(v, i) =>
				typeof v === "string" &&
				(v === "" ||
					investigationInput({ ...board, fields: [board.fields[i]] }, [v]) !==
						null),
		)
	);
}
export function investigationMistake(
	board: Investigation,
	answer: Answer | null,
): string {
	if (!Array.isArray(answer))
		return "Fülle bitte jedes Zahlenfeld aus und wähle bei jeder Auswahl eine Antwort. Ganze Zahlen bis 1 000 000 sind möglich.";
	const index = board.fields.findIndex((f, i) => f.value !== answer[i]);
	return index < 0
		? "Prüfe noch einmal alle Schritte."
		: `${board.fields[index].label}: ${board.fields[index].hint}`;
}
