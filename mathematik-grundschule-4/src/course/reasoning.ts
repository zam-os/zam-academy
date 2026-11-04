import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import type { InvestigationField } from "./investigations";
import { worksheet } from "./measurement";
import type { ForestTask } from "./tasks";

export const REASONING_IDS = [
	"anzahlen-schaetzen-fermi",
	"rechenweg-waehlen",
	"sachaufgaben-veraendern",
	"groessen-vergleichen-ordnen",
] as const;
export type ReasoningId = (typeof REASONING_IDS)[number];
export const isReasoning = (id: string): id is ReasoningId =>
	REASONING_IDS.some((key) => key === id);
const number = (
	label: string,
	value: number,
	hint: string,
): InvestigationField => ({ label, value, hint });
const reason = (
	label: string,
	labels: [string, string, string],
	hint: string,
): InvestigationField => ({
	label,
	value: 1,
	hint,
	choices: labels.map((label, i) => ({ label, value: i + 1 })),
});

export function reasoningTask(
	id: ReasoningId,
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	const next = random(
		(seed + Math.imul(index + 1, 2654435761) + level * 104729) >>> 0,
	);
	const int = (lo: number, hi: number) =>
		lo + Math.floor(next() * (hi - lo + 1));
	const goal = ((index % 3) + 1) as 1 | 2 | 3,
		transfer = level === 2;
	if (id === "anzahlen-schaetzen-fermi") {
		const groups = int(6, 18),
			sample = int(12, 35),
			second = sample + int(2, 6);
		const hint =
			"Zähle einen passenden Teil und übertrage ihn auf gleich große Teile. Prüfe, ob diese ähnlich dicht gefüllt sind. Eine Schätzung bleibt ungefähr.";
		return worksheet(
			goal,
			goal === 1
				? "Schätze die Anzahl der Samen. Berechne den Rechenwert aus der Modellannahme, ohne weiter zu runden."
				: goal === 2
					? "Vergleiche zwei Schätzwege. Welche Stichprobe passt zur ganzen Fläche?"
					: "Fermi-Aufgabe: Wie viele Samen passen ungefähr auf die Fläche? Prüfe zwei mögliche Annahmen. Es gibt keine gemessene Gesamtzahl.",
			["fermi", groups, sample, transfer || goal === 3 ? second : 0],
			"Modellfläche: gleich große Felder",
			["Information", "Wert / Annahme"],
			[
				["Felder insgesamt", String(groups)],
				["Probe aus einem typisch gefüllten Feld", `${sample} Samen`],
				...(transfer || goal === 3
					? [["Zweite mögliche Annahme je Feld", `${second} Samen`]]
					: []),
				[
					"Vergleichsprobe",
					"Ein absichtlich besonders dicht gefülltes Randfeld",
				],
			],
			[
				number("Rechenwert aus der typischen Probe", groups * sample, hint),
				reason(
					"So begründe ich meinen Schätzweg",
					[
						"Ein typisches Feld zählen und auf gleich große, ähnlich gefüllte Felder übertragen.",
						"Das dichteste Feld nehmen: Jedes Feld muss genauso voll sein.",
						"Nur die Felder zählen, ohne Samen je Feld zu beachten.",
					],
					hint,
				),
				...(transfer || goal === 3
					? [
							number(
								"Rechenwert aus der zweiten Annahme",
								groups * second,
								hint,
							),
							number(
								"Unterschied der beiden Rechenwerte",
								groups * (second - sample),
								"Vergleiche die beiden Gesamtwerte, nicht nur die Proben.",
							),
						]
					: []),
				reason(
					"So bewerte ich das Ergebnis",
					[
						"Die Annahmen bestimmen die Schätzung; weitere typische Proben und echtes Nachzählen helfen beim Prüfen.",
						"Das Ergebnis ist genau, weil ich richtig multipliziert habe.",
						"Eine größere Probe macht das Ergebnis immer kleiner.",
					],
					hint,
				),
			],
			hint,
			`${groups} · ${sample} = ${format(groups * sample)} Samen als Schätzwert.${transfer || goal === 3 ? ` Mit ${second} je Feld: ${groups} · ${second} = ${format(groups * second)}, also ${format(groups * (second - sample))} mehr.` : ""} Die Rechnung ist unter der Annahme richtig; die wirkliche Anzahl kann abweichen. Zähle zum Prüfen weitere typische Felder oder die ganze Menge.`,
		);
	}
	if (id === "rechenweg-waehlen") {
		const a =
			goal === 1
				? int(12, 70) * 100
				: goal === 2
					? int(12, 70) * 100 + 40
					: int(123, 420) * 1000 + 687;
		const b =
			goal === 1
				? int(2, 9) * 100
				: goal === 2
					? 2900
					: int(12, 65) * 1000 + 548;
		const method =
			goal === 1
				? "Im Kopf: mit gleich großen Hunderterbündeln rechnen."
				: goal === 2
					? "Halbschriftlich: + 3 000, dann − 100; Zwischenergebnisse notieren."
					: "Schriftlich: gleiche Stellen untereinander, Ergebnisziffern und Überträge notieren.";
		const hint =
			"Mehrere Wege können richtig sein. Wähle hier den Weg zum genannten Ziel und begründe ihn mit der Struktur der Zahlen.";
		const exact = transfer && goal === 3;
		return worksheet(
			goal,
			`${format(a)} + ${format(b)}: ${goal === 1 ? "Nutze die runden Hunderter ohne Notizen." : goal === 2 ? "Nutze die Nähe zu 3 000 und halte zwei Zwischenschritte fest." : "Milo möchte jede Ziffer und jeden Übertrag nachvollziehbar notieren."}${exact ? " Für eine genaue Lagerliste wird die exakte Summe benötigt." : ""}`,
			["method", a, b, goal],
			"Wähle einen Rechenweg zum Ziel",
			["Aufgabe", "Ziel"],
			[
				[
					`${format(a)} + ${format(b)}`,
					goal === 1
						? "Mit runden Bündeln schnell rechnen"
						: goal === 2
							? "Hilfsaufgabe mit zwei Notizen"
							: "Alle Stellen und Überträge festhalten",
				],
			],
			[
				reason(
					"Passender Weg mit Begründung",
					[
						method,
						goal === 1
							? "Schriftlich, weil jede große Zahl einen Rechenturm braucht."
							: "Im Kopf ohne Notizen, auch wenn das Ziel nachvollziehbare Notizen verlangt.",
						goal === 2
							? "Schriftlich, weil die Nähe zu 3 000 nicht helfen kann."
							: "Halbschriftlich: immer nur die Einer addieren.",
					],
					hint,
				),
				...(goal === 2
					? [
							number(
								"Zwischenergebnis nach + 3 000",
								a + 3000,
								"Du addierst zuerst 100 zu viel.",
							),
						]
					: []),
				number(
					"Genaue Summe",
					a + b,
					goal === 2
						? "Nimm vom Zwischenergebnis 100 wieder weg."
						: "Prüfe mit einer anderen Zerlegung oder einer schriftlichen Rechnung auf Papier.",
				),
				...(transfer
					? [
							reason(
								"Genau rechnen oder überschlagen?",
								exact
									? [
											"Für die genaue Lagerliste brauche ich die genaue Summe.",
											"Für eine genaue Bestandszahl genügt immer ein Überschlag.",
											"Jede Schätzung ist automatisch falsch.",
										]
									: [
											"Für eine erste Vorstellung der Größenordnung reicht ein begründeter Überschlag; die genaue Liste wird danach berechnet.",
											"Ein Überschlag liefert immer die genaue Bestandszahl.",
											"Für jede erste Schätzung muss jede Einerstelle genau gezählt sein.",
										],
								"Entscheide nach dem Zweck: Größenordnung oder exakte Abrechnung?",
							),
						]
					: []),
			],
			hint,
			`${format(a)} + ${format(b)} = ${format(a + b)}. ${method} ${goal === 2 ? `Notizen: ${format(a)} + 3 000 = ${format(a + 3000)}; ${format(a + 3000)} − 100 = ${format(a + b)}.` : "Auch ein anderer korrekt ausgeführter Rechenweg kann zum selben Ergebnis führen."} Ein Überschlag prüft die Größenordnung, ersetzt aber keine genaue Lagerliste.`,
		);
	}
	if (id === "sachaufgaben-veraendern") {
		const tools = int(2, 8);
		const groups = int(3, 9),
			each = transfer ? int(21, 65) : int(2, 6) * 10,
			extra = int(11, 45),
			used = int(2, each - 1);
		const total = groups * each,
			extended = total + extra;
		const hint =
			"Die Frage bestimmt die nötigen Angaben. Verkürzen entfernt nur Unwichtiges. Erweitern kann eine neue Rechnung nötig machen. Fehlende Angaben aus einer passenden Quelle beschaffen, nicht raten.";
		return worksheet(
			goal,
			goal === 1
				? `Milo hat ${groups} Beutel mit je ${each} Samen, ${tools} rote Schaufeln und eine blaue Kiste. Wie viele Samen hat er? Verkürze die Geschichte, ohne ihre Antwort zu verändern.`
				: goal === 2
					? `Erweitere die Situation: Zu ${groups} Beuteln mit je ${each} Samen kommen ${extra} lose Samen. ${transfer ? `${used} Samen werden gesät. ` : ""}Wie viele bleiben?`
					: `In ${groups} gleich gefüllten Beuteln liegen Samen. Wie viele sind es zusammen? Beschaffe die fehlende Information aus der passenden Modellquelle.`,
			[
				"variation",
				groups,
				each,
				goal === 2 ? extra : 0,
				goal === 2 && transfer ? used : 0,
				goal,
			],
			"Ausgangslage und Modellquellen",
			["Quelle", "Angabe"],
			[
				["Beuteletikett", `${each} Samen je Beutel`],
				["Werkzeugliste", `${tools} Schaufeln`],
				["Inselplan", "3 Wege"],
				...(goal === 2 ? [["Liefernotiz", `${extra} lose Samen`]] : []),
			],
			[
				reason(
					goal === 1
						? "Passende verkürzte Geschichte"
						: goal === 2
							? "Was ändert sich durch die Erweiterung?"
							: "Welche Information brauche ich aus welcher Quelle?",
					goal === 1
						? [
								`${groups} Beutel enthalten je ${each} Samen. Wie viele Samen sind es?`,
								`${groups} Beutel sind blau. Wie viele Samen sind es?`,
								`Es gibt ${each} Samen; die Zahl der Beutel spielt keine Rolle.`,
							]
						: goal === 2
							? [
									transfer
										? "Die losen Samen addieren, danach die gesäten Samen abziehen."
										: "Die losen Samen zur Beutelmenge addieren.",
									"Nur die Beutel zählen, die losen Samen sind unwichtig.",
									"Die losen Samen mit der Beutelzahl multiplizieren.",
								]
							: [
									"Samen je Beutel auf dem Beuteletikett nachlesen.",
									"Die Anzahl der Wege aus dem Inselplan verwenden.",
									"Die fehlende Zahl beliebig erfinden und als gemessen ausgeben.",
								],
					hint,
				),
				...(goal === 3
					? [
							number(
								"Nachgelesene Samen je Beutel",
								each,
								"Lies das Beuteletikett, nicht die Werkzeugliste.",
							),
						]
					: []),
				number(
					goal === 2 ? "Samen vor der Erweiterung" : "Samen insgesamt",
					total,
					"Beutelzahl mal Samen je Beutel.",
				),
				...(goal === 2
					? [
							number(
								"Samen nach der Erweiterung",
								extended - (transfer ? used : 0),
								"Addiere die Lieferung; ziehe die gesäten Samen nur ab, wenn die Geschichte sie nennt.",
							),
						]
					: []),
				...(transfer && goal === 1
					? [
							reason(
								"Warum bleibt die Antwort gleich?",
								[
									"Schaufeln und Kistenfarbe verändern die gefragte Samenanzahl nicht.",
									"Beim Verkürzen darf ich auch die Beutelzahl streichen.",
									"Jede Zahl aus der Geschichte muss in die Rechnung.",
								],
								hint,
							),
						]
					: []),
			],
			hint,
			`${groups} · ${each} = ${total} Samen. ${goal === 2 ? `Erweitert: ${total} + ${extra}${transfer ? ` − ${used}` : ""} = ${extended - (transfer ? used : 0)} Samen.` : goal === 3 ? "Das Beuteletikett liefert die benötigte Zahl. Ohne sie ist die Anzahl nicht eindeutig bestimmbar." : "Schaufeln und Farbe können wegfallen, weil nur Samen gefragt sind."} Erkläre jemandem, welche Information du behalten oder ergänzt hast.`,
		);
	}
	return quantityComparison(level, seed, index);
}

export function quantityComparison(
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	// A goal keeps its domains in the lab, both levels, exits and later checks.
	// Goal 3 requires both sets; mass and capacity must never be compared to each other.
	const goal = ((index % 3) + 1) as 1 | 2 | 3;
	const domains = goal === 1 ? [0] : goal === 2 ? [1] : [2, 3];
	const sets = domains.map((domain) => {
		const next = random(
			(seed +
				Math.imul(index + 1, 2246822519) +
				level * 65537 +
				Math.imul(domain + 1, 104729)) >>>
				0,
		);
		const int = (lo: number, hi: number) =>
			lo + Math.floor(next() * (hi - lo + 1));
		const units = [
			{
				title: "Längen",
				large: "m",
				small: "cm",
				factor: 100,
				step: 5,
				max: 30,
			},
			{
				title: "Zeitspannen",
				large: "h",
				small: "min",
				factor: 60,
				step: 5,
				max: 3,
			},
			{
				title: "Massen",
				large: "kg",
				small: "g",
				factor: 1000,
				step: 25,
				max: 8,
			},
			{
				title: "Hohlmaße",
				large: "l",
				small: "ml",
				factor: 1000,
				step: 25,
				max: 8,
			},
		][domain];
		const base = int(1, units.max);
		const low = base * units.factor + int(1, 4) * units.step;
		const middle = base * units.factor + int(5, 9) * units.step;
		const high =
			(base + 1) * units.factor + (level === 2 ? int(0, 3) * units.step : 0);
		const values = level === 1 ? [middle, high, low] : [high, low, middle];
		const mixed = (n: number) =>
			`${Math.floor(n / units.factor)} ${units.large}${n % units.factor ? ` ${format(n % units.factor)} ${units.small}` : ""}`;
		// Even guided work contains large units: the numerical conversion is required.
		const labels = values.map((n, i) =>
			(level === 1 ? i !== 1 : i !== 2)
				? mixed(n)
				: `${format(n)} ${units.small}`,
		);
		const ordered = values.map((n, i) => ({ n, i })).sort((x, y) => x.n - y.n);
		const hint = `Wandle zuerst in ${units.small} um: 1 ${units.large} = ${format(units.factor)} ${units.small}. Vergleiche dann die Größen, nicht bloß die verschiedenen Maßzahlen.`;
		return {
			identity: [domain, low, middle, high],
			relationship: `1 ${units.large} = ${format(units.factor)} ${units.small}`,
			rows: labels.map((label, i) => [units.title, String(i + 1), label]),
			fields: [
				...ordered.map((v, i) =>
					number(
						`${units.title}: ${["Kleinstes", "Mittleres", "Größtes"][i]} Angebot (Nummer)`,
						v.i + 1,
						hint,
					),
				),
				number(`${units.title}: Kleinste Größe in ${units.small}`, low, hint),
				...(level === 2
					? [
							number(
								`${units.title}: Unterschied zwischen größter und kleinster Größe in ${units.small}`,
								high - low,
								hint,
							),
						]
					: []),
				reason(
					`${units.title}: Begründung der Reihenfolge`,
					[
						`Nach dem Umwandeln in ${units.small} kann ich alle drei Maßzahlen vergleichen.`,
						"Die größere Maßzahl bedeutet auch bei verschiedenen Einheiten immer die größere Größe.",
						"Beim Wechseln der Einheit ändert sich die wirkliche Größe.",
					],
					hint,
				),
			],
			hint,
			explanation: `${units.title}: ${ordered.map((v) => labels[v.i]).join(" < ")}. In ${units.small}: ${ordered.map((v) => format(v.n)).join(" < ")}.${level === 2 ? ` Der Unterschied zwischen größter und kleinster Größe beträgt ${format(high - low)} ${units.small}.` : ""}`,
		};
	});
	const subject =
		goal === 1
			? "die Längen"
			: goal === 2
				? "die Zeitspannen"
				: "zuerst die Massen, danach getrennt davon die Hohlmaße";
	const hint = sets.map((set) => set.hint).join(" ");
	return worksheet(
		goal,
		`Ordne ${subject} von klein nach groß. Gib je Bereich die Nummern der drei Angebote an.${level === 2 ? " Bestimme auch den Unterschied zwischen größter und kleinster Größe." : " Rechne die kleinste Größe in die angegebene kleine Einheit um."}`,
		["quantity-order-goal", goal, ...sets.flatMap((set) => set.identity)],
		level === 1
			? sets.map((set) => set.relationship).join("; ")
			: "Milos Größenvergleich: jeden Bereich getrennt ordnen",
		["Bereich", "Angebot", "Größe"],
		sets.flatMap((set) => set.rows),
		sets.flatMap((set) => set.fields),
		hint,
		`${sets.map((set) => set.explanation).join(" ")} Beim Umwandeln bleibt die Größe gleich. Prüfe echte Gegenstände bei Bedarf durch Messen; Zeitspannen haben 60 min je Stunde.`,
	);
}

export const reasoningLab = (id: ReasoningId, goal: number): ForestTask =>
	reasoningTask(id, 1, 907, goal);
export const reasoningExit = (
	id: ReasoningId,
	seed: number,
	index: number,
): ForestTask => reasoningTask(id, 2, seed ^ 0x6a09e667, index);
