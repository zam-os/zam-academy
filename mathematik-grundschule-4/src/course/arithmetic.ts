import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import type { ExtraLessonId } from "./catalog";
import type { ForestTask } from "./tasks";

type ArithmeticId =
	| "geschickt-addieren"
	| "geschickt-subtrahieren"
	| "malnehmen-teilen";
export function isArithmetic(id: ExtraLessonId): id is ArithmeticId {
	return (
		id === "geschickt-addieren" ||
		id === "geschickt-subtrahieren" ||
		id === "malnehmen-teilen"
	);
}
export function arithmeticTask(
	id: ArithmeticId,
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	const next = random(
		(seed + Math.imul(index + 1, 2654435761) + level * 104729) >>> 0,
	);
	const int = (lo: number, hi: number) =>
		lo + Math.floor(next() * (hi - lo + 1));
	const variant = index % 3;
	if (id === "malnehmen-teilen") {
		const count = int(2, 10),
			base = int(2, 9),
			unit = [1, 10, 100, 1000][int(level === 1 ? 0 : 1, 3)];
		const each = base * unit,
			total = count * each;
		if (level === 2 && variant === 2)
			return {
				kind: "choice",
				goal: 3,
				prompt: `Milo weiß: ${count} · ${base} = ${count * base}. Welche Begründung passt zu ${count} · ${format(each)}?`,
				answer: 1,
				choices: [
					{
						value: 1,
						label: `${format(each)} sind ${base} Bündel zu je ${format(unit)}. ${count * base} solche Bündel ergeben ${format(total)}.`,
					},
					{
						value: 2,
						label: `Die Bündelgröße ist egal. Das Ergebnis bleibt ${count * base}.`,
					},
					{
						value: 3,
						label: `Addiere die beiden Zahlen: ${count} + ${format(each)} = ${format(count + each)}.`,
					},
				],
				hint: "Rechne zuerst mit der Anzahl der Bündel und behalte deren Wert bei.",
				explanation: `${count} · ${base} = ${count * base}. Jedes Bündel hat den Wert ${format(unit)}: ${count} · ${format(each)} = ${format(total)}. Probe: ${format(total)} : ${count} = ${format(each)}.`,
			};
		const divide = variant === 1;
		const missing = level === 2 && variant === 0;
		return {
			kind: "number",
			goal: divide ? 2 : missing ? 3 : 1,
			prompt: divide
				? level === 1
					? `Teile ${format(total)} durch ${count}. Welche Zahl ergibt mit ${count} multipliziert wieder ${format(total)}?`
					: `${format(total)} Samen werden gleichmäßig auf ${count} Körbe verteilt. Wie viele Samen kommen in jeden Korb?`
				: missing
					? `Milo packt je ${format(each)} Samen in einen Korb. Insgesamt sind es ${format(total)} Samen. Wie viele gleich gefüllte Körbe braucht er?`
					: `Rechne ${count} · ${format(each)}. ${unit === 1 ? "Nutze gleich große Gruppen oder eine bekannte Nachbaraufgabe." : `Nutze ${count} · ${base} = ${count * base} und achte auf die Bündelgröße.`}`,
			answer: divide ? each : missing ? count : total,
			calculation: missing
				? { a: total, b: each, op: ":" }
				: divide
					? { a: total, b: count, op: ":" }
					: { a: count, b: each, op: "·" },
			hint: "Zeichne gleich große Gruppen. Zum Teilen suchst du die passende Malaufgabe. Rechne mit der richtigen Bündelgröße.",
			explanation: `${count} Körbe · ${format(each)} Samen je Korb = ${format(total)} Samen. Deshalb: ${format(total)} : ${count} = ${format(each)} und ${format(total)} : ${format(each)} = ${count}.`,
		};
	}
	const subtract = id === "geschickt-subtrahieren",
		op = subtract ? "−" : "+";
	const unit = [100, 1000, 10000][int(0, 2)];
	const a = variant === 0 ? int(12, 70) * unit : int(120, 700) * 100;
	const b =
		variant === 0 ? int(2, 9) * unit : int(2, 8) * 1000 + int(1, 9) * 100;
	const result = subtract ? a - b : a + b;
	const thousands = Math.floor(b / 1000) * 1000,
		rest = b - thousands;
	const middle = subtract ? a - thousands : a + thousands;
	if (level === 2 && variant === 2) {
		const helper = Math.ceil(b / 1000) * 1000,
			delta = helper - b;
		const interim = subtract ? a - helper : a + helper;
		return {
			kind: "choice",
			goal: 3,
			prompt: `Für ${format(a)} ${op} ${format(b)} rechnet Milo zuerst ${format(a)} ${op} ${format(helper)} = ${format(interim)}. Wie geht es richtig weiter?`,
			answer: 1,
			choices: [
				{
					value: 1,
					label: `${format(delta)} ${subtract ? "dazugeben, weil er zu viel weggenommen" : "abziehen, weil er zu viel addiert"} hat.`,
				},
				{
					value: 2,
					label: `${format(delta)} ${subtract ? "weiter abziehen, obwohl er schon zu viel weggenommen" : "noch dazugeben, obwohl er schon zu viel addiert"} hat.`,
				},
				{
					value: 3,
					label:
						"Die Hilfsaufgabe ist schon das genaue Ergebnis; ein Ausgleich ist nicht nötig.",
				},
			],
			hint: subtract
				? "Zu viel weggenommen? Gib genau diesen Unterschied wieder dazu."
				: "Zu viel addiert? Nimm genau diesen Unterschied wieder weg.",
			explanation: `${format(a)} ${op} ${format(helper)} ${subtract ? "+" : "−"} ${format(delta)} = ${format(result)}. ${subtract ? "Gib den zu viel abgezogenen Betrag zurück." : "Ziehe den zu viel addierten Betrag ab."}`,
		};
	}
	if (level === 2 && variant === 1)
		return {
			kind: "number",
			goal: 2,
			inverseProbe: subtract,
			prompt: subtract
				? `Die Differenz von ${format(a)} und ${format(b)} ist ${format(result)}. Ergänze die Probe: ${format(result)} + □ = ${format(a)}.`
				: `Zerlege ${format(b)} in ${format(thousands)} und ${format(rest)}. Rechne ${format(a)} + ${format(thousands)} = □. Welche Zwischenzahl fehlt vor dem letzten Sprung um ${format(rest)}?`,
			answer: subtract ? b : middle,
			calculation: subtract
				? { a, b: result, op: "−" }
				: { a, b: thousands, op: "+" },
			hint: subtract
				? "Welche Zahl wurde ursprünglich abgezogen? Genau diese gibst du bei der Probe zur Differenz dazu."
				: "Gefragt ist erst das Zwischenergebnis nach den ganzen Tausendern, noch nicht die Endsumme.",
			explanation: subtract
				? `Die Probe lautet ${format(result)} + ${format(b)} = ${format(a)}. Sie macht die Subtraktion rückgängig.`
				: `${format(a)} + ${format(thousands)} = ${format(middle)}. Danach ${format(middle)} + ${format(rest)} = ${format(result)}.`,
		};
	return {
		kind: "number",
		goal: variant === 0 ? 1 : 2,
		prompt:
			level === 2
				? subtract
					? `Milos Samenvorrat enthält ${format(a)} Samen. ${format(b)} werden ausgesät. Wie viele Samen bleiben im Vorrat?`
					: `Im ersten Vorrat liegen ${format(a)} Samen, im zweiten ${format(b)}. Wie viele Samen sind es zusammen?`
				: `Rechne ${format(a)} ${op} ${format(b)}. ${variant === 0 ? "Nutze bekannte Aufgaben mit passenden Bündeln." : `Zerlege ${format(b)} in ${format(thousands)} und ${format(rest)} und rechne in zwei Schritten.`}`,
		answer: result,
		calculation: { a, b, op },
		hint:
			variant === 0
				? "Rechne mit gleich großen Bündeln. Hunderter und Tausender dürfen ihre Plätze nicht tauschen."
				: `Rechne zuerst mit ${format(thousands)}, danach mit ${format(rest)}. Notiere dein Zwischenergebnis.`,
		explanation: `${format(a)} ${op} ${format(b)} = ${format(result)}.${variant !== 0 ? ` In Schritten: ${format(a)} ${op} ${format(thousands)} = ${format(middle)}; ${format(middle)} ${op} ${format(rest)} = ${format(result)}.` : ""}${subtract ? ` Probe: ${format(result)} + ${format(b)} = ${format(a)}.` : ` Probe: ${format(result)} − ${format(b)} = ${format(a)}.`}`,
	};
}
export function arithmeticLab(id: ArithmeticId, goal: number): ForestTask {
	if (id === "malnehmen-teilen") {
		const each = [4, 6, 400][goal],
			count = [6, 7, 8][goal];
		return {
			kind: "groups",
			goal: (goal + 1) as 1 | 2 | 3,
			groups: { each },
			calculation: { a: count, b: each, op: "·" },
			answer: count,
			prompt: [
				"Packe 6 Körbe mit je 4 Samen und prüfe die Malaufgabe.",
				"Verteile 42 Samen auf Körbe mit je 6 Samen. Wie viele gleich gefüllte Körbe brauchst du?",
				"Packe 8 Körbe mit je 400 Samen. Nutze 8 · 4 und die Hunderterbündel.",
			][goal],
			hint: "Mit dem Regler veränderst du die Anzahl der gleich gefüllten Körbe. Die Anzeige zeigt dir die passende Malaufgabe.",
			explanation: `${count} · ${format(each)} = ${format(count * each)}. Die Umkehraufgabe lautet ${format(count * each)} : ${format(each)} = ${count}.`,
		};
	}
	const subtract = id === "geschickt-subtrahieren";
	const starts = subtract ? [12000, 30200, 47000] : [32000, 26800, 49000];
	const units = [1000, 100, 100],
		positions = subtract ? [4, 5, 3] : [6, 3, 1];
	const direction = (goal === 2 ? (subtract ? 1 : -1) : subtract ? -1 : 1) as
		| 1
		| -1;
	const result = starts[goal] + direction * positions[goal] * units[goal];
	return {
		kind: "hops",
		goal: (goal + 1) as 1 | 2 | 3,
		hops: { start: starts[goal], unit: units[goal], direction },
		calculation: {
			a: starts[goal],
			b: positions[goal] * units[goal],
			op: direction === 1 ? "+" : "−",
		},
		answer: positions[goal],
		prompt: subtract
			? [
					"Rechne 12 000 − 4 000. Gehe in Tausenderschritten zurück.",
					"Rechne 30 200 − 500. Gehe in Hunderterschritten über den Tausender zurück.",
					"Für 52 000 − 4 700 bist du mit − 5 000 bei 47 000 gelandet. Gib den zu viel abgezogenen Betrag zurück.",
				][goal]
			: [
					"Rechne 32 000 + 6 000. Gehe in Tausenderschritten vorwärts.",
					"Rechne 26 800 + 300. Gehe in Hunderterschritten über den Tausender.",
					"Für 46 000 + 2 900 bist du mit + 3 000 bei 49 000 gelandet. Nimm den zu viel addierten Betrag wieder weg.",
				][goal],
		hint: `Jeder Sprung verändert die Zahl um ${format(units[goal])}. ${goal === 2 ? "Vergleiche die Hilfsaufgabe mit der ursprünglichen Aufgabe." : "Prüfe, wie viele solche Sprünge du brauchst."}`,
		explanation: `${format(starts[goal])} ${direction === 1 ? "+" : "−"} ${positions[goal]} · ${format(units[goal])} = ${format(result)}. ${goal === 2 ? "Der Ausgleich macht die Hilfsaufgabe zur ursprünglichen Aufgabe." : "Die Sprünge ergeben zusammen den gesuchten Betrag."}`,
	};
}
