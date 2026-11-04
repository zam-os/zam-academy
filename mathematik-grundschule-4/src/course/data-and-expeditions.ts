import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import {
	type DataChart,
	type ChanceExperiment,
	compositionChoice,
	colouredBalls,
	drawsFor,
} from "./data-model";
import type { InvestigationField } from "./investigations";
import { worksheet } from "./measurement";
import { quantityText } from "./quantity";
import type { ForestTask } from "./tasks";
import type { Scene } from "./workshop";
import type { FinalId } from "./worlds";
const number = (
	label: string,
	value: number,
	hint: string,
	format?: InvestigationField["format"],
): InvestigationField => ({ label, value, hint, format });
const choose = (
	label: string,
	value: number,
	labels: string[],
	hint: string,
): InvestigationField => ({
	label,
	value,
	hint,
	choices: labels.map((label, i) => ({ label, value: i + 1 })),
});
const why = (
	label: string,
	correct: string,
	wrong: [string, string],
	hint: string,
) => choose(label, 1, [correct, ...wrong], hint);
const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);
const fmtEuro = (n: number) => `${quantityText(n, { scale: 100 })} €`;
const clock = (n: number) => quantityText(n % 1440, { clock: true });
const chart = (
	values: number[],
	scale = 1,
	labels = ["Äpfel", "Birnen", "Pflaumen"],
	hidden: number[] = [],
): Scene => ({
	kind: "data",
	values: [],
	chart: {
		labels,
		values,
		scale,
		max: Math.max(24, Math.ceil(Math.max(...values) / scale) * scale),
		unit: "Stück",
		hidden,
	},
});
const chanceLabels = [
	"Rot hat die größere Chance.",
	"Blau hat die größere Chance.",
	"Beide haben die gleiche Chance.",
];
export function finalTask(
	id: FinalId,
	level: 1 | 2,
	seed: number,
	index: number,
	revision = 1,
): ForestTask {
	const next = random(
			(seed + Math.imul(index + 1, 2654435761) + level * 104729) >>> 0,
		),
		int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
	const goal = ((index % 3) + 1) as 1 | 2 | 3,
		transfer = level === 2;
	if (
		id === "daten-sammeln-darstellen" &&
		transfer &&
		goal === 1 &&
		revision === 1
	) {
		const labels = ["Äpfel", "Birnen", "Pflaumen", "Kirschen", "Aprikosen"];
		const values = labels.map(() => int(2, 12) * 2),
			total = sum(values);
		return worksheet(
			1,
			`Eine Modellsammlung hat ${total} Früchte. Übertrage die fünf Kategorien in ein Diagramm mit dem Skalenschritt 2 und erschließe die fehlende Häufigkeit.`,
			["data-five", ...values],
			"Fünf Kategorien derselben Sammlung",
			["Kategorie", "Anzahl"],
			labels.map((label, i) => [
				label,
				i === 4 ? "gesucht" : String(values[i]),
			]),
			[
				...labels.map((label, i) =>
					number(
						`Anzahl ${label}`,
						values[i],
						i === 4
							? "Ziehe die vier bekannten Häufigkeiten von der Gesamtzahl ab."
							: "Lies die Tabelle sorgfältig.",
					),
				),
				number(
					"Skalenstufen der Aprikosensäule",
					values[4] / 2,
					"Eine Skalenstufe bedeutet zwei Früchte.",
				),
			],
			"Jede Kategorie bekommt eine beschriftete Säule. Zeichne alle fünf Säulen auf Papier; die fünfte Häufigkeit musst du zuerst erschließen.",
			`${labels.map((label, i) => `${label}: ${values[i]}`).join("; ")}. Zusammen ${total}. Die Aprikosensäule braucht ${values[4] / 2} Skalenstufen.`,
			chart(values, 2, labels, [4]),
		);
	}
	if (id === "daten-sammeln-darstellen") {
		const scale = transfer ? 2 : 1,
			values = Array.from({ length: 3 }, () => int(2, 12) * scale),
			labels = ["Äpfel", "Birnen", "Pflaumen"],
			total = sum(values);
		if (goal === 1) {
			const observations = values.flatMap((n, i) => Array(n).fill(labels[i]));
			for (let i = observations.length - 1; i > 0; i--) {
				const j = int(0, i);
				[observations[i], observations[j]] = [observations[j], observations[i]];
			}
			return worksheet(
				1,
				transfer
					? `In einer Modellsammlung sind ${total} Früchte. Zwei Kategorien sind in der Tabelle gezählt. Ergänze die fehlende Häufigkeit.`
					: "Ordne die Beobachtungen der Modellsammlung den drei Kategorien zu und zähle ihre Häufigkeiten.",
				["data-counts", ...values],
				"Modelldaten: jede Frucht genau einmal zählen",
				transfer ? ["Kategorie", "Anzahl"] : ["Beobachtungen"],
				transfer
					? labels.map((s, i) => [s, i === 2 ? "gesucht" : String(values[i])])
					: observations.map((s) => [s]),
				labels.map((s, i) =>
					number(
						`Anzahl ${s}`,
						values[i],
						transfer && i === 2
							? "Gesamtzahl minus die beiden bekannten Häufigkeiten."
							: "Gehe die Beobachtungsliste geordnet durch; jede Beobachtung gehört zu genau einer Kategorie.",
					),
				),
				"Eine Strichliste kann beim Zählen helfen. Vergiss keine Beobachtung und zähle keine doppelt.",
				`Äpfel: ${values[0]}, Birnen: ${values[1]}, Pflaumen: ${values[2]}. Zusammen sind es ${total}.`,
			);
		}
		return worksheet(
			goal,
			goal === 2
				? `Lies die Häufigkeiten im Diagramm. Eine kleine Skalenstufe bedeutet ${scale} Stück.`
				: "Fasse die Diagrammdaten zusammen und prüfe, ob die Kategorien alle Beobachtungen erfassen.",
			["data-chart", ...values, goal],
			"Milos Modelldaten, keine echte Befragung",
			["Frage", "Hinweis"],
			[
				["Einheit", "Stück"],
				["Skalenstufe", String(scale)],
			],
			[
				number(
					goal === 2 ? "Äpfel in Stück" : "Beobachtungen insgesamt",
					goal === 2 ? values[0] : total,
					"Lies zuerst die Skala. Addiere für die Gesamtzahl alle drei Häufigkeiten.",
				),
				number(
					goal === 2
						? "Skalenstufen der Birnensäule"
						: "Äpfel und Birnen zusammen",
					goal === 2 ? values[1] / scale : values[0] + values[1],
					goal === 2
						? "Ein Skalenabschnitt zählt mehr als ein Stück, wenn die Skala größer als 1 ist."
						: "Fasse genau die beiden genannten Kategorien zusammen.",
				),
				number(
					"Pflaumen in Stück",
					values[2],
					"Lies auch die dritte Säule an derselben Skala ab.",
				),
				why(
					"Eine geordnete Sammlung braucht",
					"Klare Kategorien und jede Beobachtung genau einmal.",
					[
						"Doppelte Einträge, damit das Bild voller aussieht.",
						"Keine Beschriftung, weil man die Bedeutung immer errät.",
					],
					"Kategorien, Einheit und Beschriftung machen Daten nachvollziehbar.",
				),
			],
			"Unterscheide die Anzahl kleiner Skalenstufen von der Zahl der gezählten Früchte.",
			`Das Diagramm zeigt ${values.join(", ")} Stück. Gesamt: ${total}. Die Birnen belegen ${values[1] / scale} kleine Skalenstufen.`,
			chart(values, scale),
		);
	}
	if (id === "tabellen-diagramme-auswerten") {
		const scale = transfer ? 5 : 2,
			a = int(2, 9) * scale,
			b = a + int(1, 5) * scale,
			c = int(2, 12) * scale,
			values = [a, b, c];
		if (goal === 1)
			return worksheet(
				1,
				"Lies das Säulendiagramm und vergleiche zwei Kategorien. Beachte die Skala.",
				["read-chart", ...values],
				"Modelldaten: Besucher an drei Ständen",
				["Kategorie", "Einheit"],
				[["Stand A, B, C", "Personen"]],
				[
					number(
						"Besucher bei A",
						a,
						"Die kleinen Skalenstufen sind gleich groß. Lies die beschrifteten Zahlen mit.",
					),
					number(
						"Besucher bei B",
						b,
						"Zähle nicht nur die Zahl der Gitterlinien.",
					),
					number(
						"Besucher bei C",
						c,
						"Lies die dritte Kategorie mit derselben Skala.",
					),
					number(
						"Mehr Besucher bei B als bei A",
						b - a,
						"Gesucht ist die Differenz, nicht die Summe.",
					),
					...(transfer
						? [
								number(
									"A und B zusammen",
									a + b,
									"Fasse nur die beiden genannten Stände zusammen.",
								),
							]
						: []),
				],
				"Die Achse startet bei 0. Größere Säulenhöhen bedeuten mehr Personen, nicht automatisch doppelt so viele.",
				`A hat ${a}, B hat ${b} Besucher. B hat ${b - a} mehr; zusammen sind es ${a + b}.`,
				{
					kind: "data",
					values: [],
					chart: {
						labels: ["A", "B", "C"],
						values,
						scale,
						max: Math.ceil(Math.max(...values) / scale) * scale,
						unit: "Personen",
					},
				},
			);
		if (goal === 2) {
			const start = (transfer ? 23 : int(7, 17)) * 60 + int(0, 8) * 5,
				first = int(2, 10) * 5,
				pause = transfer ? int(1, 3) * 5 : 0,
				second = int(3, 12) * 5,
				end = start + first + pause + second;
			const timetableTime = (minutes: number) =>
				`${clock(minutes)}${minutes >= 1440 ? " (nächster Tag)" : ""}`;
			return worksheet(
				2,
				`Berechne aus dem Modellfahrplan die Reisezeit.${end >= 1440 ? " Die Ankunft am Ziel ist am nächsten Tag." : " Alle Angaben gelten am selben Tag."}`,
				["timetable", start, first, pause, second],
				"Fahrplan mit Zwischenhalt",
				["Ort", "Ankunft", "Abfahrt"],
				[
					["Start", "—", timetableTime(start)],
					[
						"Zwischenhalt",
						timetableTime(start + first),
						timetableTime(start + first + pause),
					],
					["Ziel", timetableTime(end), "—"],
				],
				transfer
					? [
							number(
								"Reine Fahrtzeit in min",
								first + second,
								"Zähle beide Fahrabschnitte, aber nicht den Aufenthalt.",
							),
							number(
								"Aufenthalt in min",
								pause,
								"Am Zwischenhalt: Abfahrtszeit minus Ankunftszeit.",
							),
							number(
								"Reisezeit mit Aufenthalt in min",
								first + pause + second,
								"Zum Reisen gehört hier der Aufenthalt dazu; beachte den Tageswechsel.",
							),
						]
					: [
							number(
								"Erster Abschnitt in min",
								first,
								"Ergänze vom Startzeitpunkt bis zur Ankunft am Zwischenhalt.",
							),
							number(
								"Zweiter Abschnitt in min",
								second,
								"Lies die Abfahrt am Zwischenhalt und die Zielankunft.",
							),
							number(
								"Gesamte Reisezeit in min",
								first + second,
								"Addiere die beiden Abschnitte.",
							),
						],
				"Uhrzeiten sind Zeitpunkte. Für Zeitspannen rechne mit 60 Minuten je Stunde, über Mitternacht mit dem nächsten Tag.",
				`Die Fahrt dauert ${first + second} min, der Aufenthalt ${pause} min. Die gesamte Reise dauert ${first + pause + second} min.`,
			);
		}
		if (transfer)
			return worksheet(
				3,
				`Die drei Stände hatten insgesamt ${a + b + c} Besucher. Bei der dritten Säule fehlt die Angabe. Erschließe sie aus den übrigen Daten.`,
				["missing-chart", a, b, c],
				"Gesamtzahl und unvollständiges Diagramm",
				["Angabe", "Wert"],
				[["Insgesamt", String(a + b + c)]],
				[
					number(
						"Fehlende Besucherzahl bei C",
						c,
						"Ziehe die beiden bekannten Besucherzahlen von der Gesamtzahl ab.",
					),
					number(
						"A und C zusammen",
						a + c,
						"Nutze deine erschlossene Zahl für eine neue Frage.",
					),
					why(
						"Eine passende mathematische Frage ist",
						"Wie viele Besucher hatte C, wenn ich Gesamtzahl, A und B kenne?",
						[
							"Welche Lieblingsfarbe hat ein nicht genannter Besucher?",
							"Wie alt ist Milo, wenn die Tabelle kein Alter nennt?",
						],
						"Eine beantwortbare Frage braucht passende Daten.",
					),
				],
				"Die fehlende Säulenhöhe ist nicht direkt ablesbar. Verwende die Gesamtzahl und die bekannten Häufigkeiten.",
				`C: ${a + b + c} − ${a} − ${b} = ${c}. A und C zusammen: ${a + c}.`,
				{
					kind: "data",
					values: [],
					chart: {
						labels: ["A", "B", "C"],
						values,
						scale,
						max: 90,
						unit: "Personen",
						hidden: [2],
					},
				},
			);
		const price = int(1, 8) * 25;
		return worksheet(
			3,
			`Die Tabelle nennt die Zahl gleicher Hefte, die Preisliste ${fmtEuro(price)} je Heft. Verbinde beide Quellen.`,
			["chart-price", ...values, price],
			"Modelldaten und Preisliste",
			["Gruppe", "Hefte"],
			[
				["A", String(a)],
				["B", String(b)],
				["C", String(c)],
			],
			[
				number(
					"Hefte von A und B zusammen",
					a + b,
					"Entnimm beide Anzahlen aus der Tabelle.",
				),
				number(
					"Gesamtpreis dieser Hefte in €",
					(a + b) * price,
					"Gleicher Stückpreis für jedes Heft, kein Rabatt.",
					{ scale: 100 },
				),
				number(
					"Preis für die doppelte Zahl dieser Hefte in €",
					2 * (a + b) * price,
					"Bei gleichem Stückpreis verdoppelt sich der Preis mit der Menge.",
					{ scale: 100 },
				),
			],
			"Informationen aus zwei Quellen gehören zusammen: Anzahl und Stückpreis bestimmen den Gesamtpreis.",
			`${a + b} Hefte kosten ${format((a + b) * price)} ct = ${fmtEuro((a + b) * price)}. Doppelte Menge: ${fmtEuro(2 * (a + b) * price)}.`,
		);
	}
	if (id === "zufallsexperimente") {
		const red = int(1, 9),
			blue = int(1, 9);
		if (goal === 1)
			return worksheet(
				1,
				transfer
					? "Aus dem Beutel wurde dreimal Rot gezogen und jedes Mal zurückgelegt. Beurteile die Chancen bei der nächsten Ziehung."
					: "Vergleiche die Chancen von Rot und Blau vor einer Ziehung. Alle Kugeln sind gleich groß und gleich gut zu greifen.",
				["chance-composition", red, blue],
				"Ziehung mit Zurücklegen und neuem Mischen",
				["Farbe", "Kugeln im Beutel"],
				[
					["Rot", String(red)],
					["Blau", String(blue)],
				],
				[
					choose(
						"Welche Chance ist größer?",
						compositionChoice({ red, blue, seed: 0, draws: 12 }),
						chanceLabels,
						"Vergleiche den Beutelinhalt; die Kugeln wurden zurückgelegt.",
					),
					number(
						"Rote Kugeln jetzt im Beutel",
						red,
						"Zurücklegen erhält den Beutelinhalt, auch nach mehreren gleichen Ergebnissen.",
					),
					...(transfer
						? [
								why(
									"Die drei roten Ziehungen bedeuten",
									"Der Beutelinhalt bleibt gleich; die nächste Farbe ist trotzdem nicht sicher.",
									[
										"Jetzt muss Blau kommen, um auszugleichen.",
										"Rot kommt von nun an garantiert.",
									],
									"Frühere Ergebnisse erzwingen bei Zurücklegen und neuem Mischen keine nächste Farbe.",
								),
							]
						: []),
				],
				"Mehr gleich gut greifbare Kugeln einer Farbe bedeuten eine größere Chance. Gleiche Anzahlen bedeuten gleiche Chancen.",
				`Im Beutel bleiben ${colouredBalls(red, blue)}. ${chanceLabels[compositionChoice({ red, blue, seed: 0, draws: 12 }) - 1]} Eine einzelne Ziehung bleibt offen.`,
			);
		if (goal === 2) {
			const total = int(5, 18),
				a = int(1, total - 2),
				change = transfer ? int(1, Math.min(3, total - a - 1)) : 0,
				b = int(1, total - 1),
				after = a + change;
			return worksheet(
				2,
				transfer
					? `Beide Beutel enthalten je ${total} Kugeln. In A tauscht man ${change} blaue Kugel${change === 1 ? "" : "n"} gegen die gleiche Anzahl roter Kugeln. Vergleiche danach die Chance auf Rot.`
					: `Beide Beutel enthalten je ${total} gleich große Kugeln. Welcher bietet die größere Chance auf Rot?`,
				["chance-bags", total, a, change, b],
				"Beutelbedingungen vergleichen",
				["Beutel", "Rot vorher", "Blau vorher"],
				[
					["A", String(a), String(total - a)],
					["B", String(b), String(total - b)],
				],
				[
					number(
						transfer
							? "Rote Kugeln in A nach der Änderung"
							: "Rote Kugeln in A",
						after,
						"Getauschte blaue Kugeln werden rot; die Gesamtzahl bleibt gleich.",
					),
					choose(
						"Größere Chance auf Rot",
						after === b ? 3 : after > b ? 1 : 2,
						["Beutel A.", "Beutel B.", "Beide gleich."],
						"Bei gleicher Gesamtzahl entscheidet die größere Anzahl roter Kugeln.",
					),
					number(
						transfer ? "Blaue Kugeln in A danach" : "Blaue Kugeln in A",
						total - after,
						"Gesamtzahl minus rote Kugeln.",
					),
				],
				"Vergleiche die Bedingungen. Hier ist die Gesamtzahl gleich; deshalb kannst du die Zahl roter Kugeln direkt vergleichen.",
				`In A sind danach ${colouredBalls(after, total - after)}. In B sind ${b} von insgesamt ${total} Kugeln rot. ${after === b ? "Die Chancen auf Rot sind gleich." : `${after > b ? "A" : "B"} bietet die größere Chance auf Rot.`}`,
			);
		}
		const count = transfer ? 20 : 12,
			e = { red, blue, seed: (seed ^ 0x510e527f) >>> 0, draws: count },
			observed = sum(drawsFor(e)),
			second = sum(drawsFor({ ...e, seed: (seed ^ 0x9b05688c) >>> 0 }));
		return worksheet(
			3,
			"Untersuche dokumentierte Modellversuche mit Zurücklegen. Unterscheide Beobachtung und sichere Vorhersage.",
			["chance-observed", red, blue, observed, second, count],
			"Modelldaten; keine Vorhersage einer echten Ziehung",
			["Versuch", "Rot beobachtet", "Ziehungen"],
			[
				["Erste Reihe", String(observed), String(count)],
				...(transfer ? [["Zweite Reihe", String(second), String(count)]] : []),
			],
			[
				number(
					"Blau in der ersten Reihe beobachtet",
					count - observed,
					"Alle Ziehungen sind entweder rot oder blau.",
				),
				...(transfer
					? [
							number(
								"Unterschied der roten Häufigkeiten",
								Math.abs(observed - second),
								"Vergleiche die beiden Häufigkeiten; gesucht ist der nichtnegative Abstand.",
							),
						]
					: []),
				why(
					"Was folgt für die nächste Ziehung?",
					"Die nächste Farbe ist nicht garantiert; die Bedingungen des Beutels bestimmen die Chancen.",
					[
						"Die zuletzt häufigere Farbe muss wieder kommen.",
						"Die zuletzt seltenere Farbe muss jetzt ausgleichen.",
					],
					"Eine kurze Reihe kann schwanken. Mit Zurücklegen bleiben die Beutelbedingungen gleich.",
				),
			],
			"Eine beobachtete Häufigkeit ist eine Beschreibung dieser Reihe, keine Garantie für die nächste Ziehung.",
			`In der ersten Reihe wurden ${colouredBalls(observed, count - observed)} beobachtet.${transfer ? ` Die rote Häufigkeit unterscheidet sich um ${Math.abs(observed - second)}.` : ""} Die einzelne nächste Farbe ist nicht sicher.`,
		);
	}
	if (id === "expedition-werkstatt") {
		if (goal === 1) {
			const pieces = int(7, 24),
				length = int(3, 8) * 10,
				board = 200,
				perBoard = Math.floor(board / length),
				boards = Math.ceil(pieces / perBoard),
				price = int(12, 49) * 10;
			const t = worksheet(
				1,
				`Die Werkstatt braucht ${pieces} ganze Leisten zu je ${format(length)} cm. Ein Brett ist 2 m lang. Stücke dürfen nicht zusammengesetzt werden; der Schnitt ist im Modell ohne Breitenverlust. Plane die kleinste Brettanzahl.`,
				["workshop-boards", pieces, length, board, price],
				"Materialliste und Preisliste",
				["Angabe", "Wert"],
				[
					["Leisten", String(pieces)],
					["Länge je Leiste", `${format(length)} cm`],
					["Brett", `${format(board)} cm`],
					["Preis je Brett", fmtEuro(price)],
				],
				[
					number(
						"Ganze Leisten je Brett",
						perBoard,
						"Wie oft passt eine vollständige Leiste in 200 cm? Ein Rest ist keine weitere ganze Leiste.",
					),
					number(
						"Mindestens Bretter",
						boards,
						"Verteile alle Leisten auf Bretter; ein angebrochenes zusätzliches Brett zählt ganz.",
					),
					number(
						transfer
							? "Preis der Bretter in €"
							: "Gesamtlänge aller Leisten in cm",
						transfer ? boards * price : pieces * length,
						transfer
							? "Brettanzahl mal Brettpreis, nicht Leistenanzahl mal Brettpreis."
							: "Anzahl der Leisten mal Einzellänge.",
						transfer ? { scale: 100 } : undefined,
					),
				],
				"Wähle Materialliste, Skizze oder Preisliste als Hilfe. Die reine Gesamtlänge genügt nicht immer, weil die Leisten ganz bleiben müssen.",
				`Je Brett passen ${perBoard} Leisten. Für ${pieces} Leisten brauchst du ${boards} Bretter. Die Leistenlänge insgesamt ist ${format(pieces * length)} cm; die Bretter kosten ${fmtEuro(boards * price)}.`,
			);
			t.toolViews = [
				{
					label: "Brett als Einheitenskizze",
					scene: { kind: "units", values: [2, 0, 100], labels: ["m", "cm"] },
				},
				{
					label: "Preis eines Bretts ansehen",
					scene: { kind: "coins", values: [price] },
				},
			];
			return t;
		}
		if (goal === 2) {
			const sets = int(3, 9),
				price = int(15, 95) * 5,
				brushes = int(2, 8),
				each = int(10, 39) * 5,
				total = sets * price + brushes * each,
				budget = transfer
					? total + (int(0, 1) ? -5 : 5)
					: Math.ceil(total / 500) * 500 + 500;
			return worksheet(
				2,
				"Die Werkstatt kauft zwei Arten Material. Berechne den genauen Preis und prüfe das Budget.",
				["workshop-budget", sets, price, brushes, each, budget],
				"Einkaufsliste",
				["Material", "Anzahl", "Je Stück"],
				[
					["Bastelsets", String(sets), fmtEuro(price)],
					["Pinsel", String(brushes), fmtEuro(each)],
					["Budget", "—", fmtEuro(budget)],
				],
				[
					number(
						"Bastelsets zusammen in ct",
						sets * price,
						"Anzahl mal Stückpreis.",
					),
					number(
						"Ganzer Einkauf in €",
						total,
						"Addiere die beiden Teilpreise in derselben Einheit.",
						{ scale: 100 },
					),
					choose(
						"Reicht das Budget?",
						budget >= total ? 1 : 2,
						["Ja.", "Nein."],
						"Vergleiche genaue Centbeträge, gerade bei einem knappen Budget.",
					),
				],
				"Die Tabelle ist ein Werkzeug. Du kannst auch zwei Teilrechnungen auf Papier notieren und anschließend addieren.",
				`Sets: ${format(sets * price)} ct; Pinsel: ${format(brushes * each)} ct; insgesamt ${fmtEuro(total)}. Das Budget ${fmtEuro(budget)} ${budget >= total ? "reicht" : "reicht nicht"}.`,
			);
		}
		const crates = int(5, 17),
			content = int(3, 9) * 100,
			empty = transfer ? int(1, 4) * 100 : 0,
			each = content + empty,
			limit = 3000,
			perTrip = Math.floor(limit / each),
			trips = Math.ceil(crates / perTrip);
		return worksheet(
			3,
			`${crates} gleich schwere Kisten müssen in einem Wagen transportiert werden. Höchstens 3 kg dürfen pro Fahrt geladen werden. Jede Kiste bleibt ganz.`,
			["workshop-load", crates, content, empty, limit],
			"Kisten packen",
			["Angabe", "Wert"],
			[
				["Inhalt je Kiste", `${format(content)} g`],
				["Leere Kiste", `${format(empty)} g`],
				["Grenze pro Fahrt", `${format(limit)} g`],
			],
			[
				number(
					"Eine volle Kiste in g",
					each,
					"Inhalt und leere Kiste zählen zusammen.",
				),
				number(
					"Ganze Kisten pro Fahrt höchstens",
					perTrip,
					"Wie oft passt die volle Kiste in die Grenze? Ein Rest ist keine ganze Kiste.",
				),
				number(
					"Fahrten mindestens",
					trips,
					"Teile die Kistenzahl in passende Gruppen und plane eine zusätzliche Fahrt für den Rest.",
				),
			],
			"Arbeite mit g, bevor du vergleichst. Die Gewichtsgrenze darf nicht überschritten werden.",
			`Eine Kiste wiegt ${format(each)} g. Höchstens ${perTrip} passen pro Fahrt; für ${crates} Kisten brauchst du mindestens ${trips} Fahrten.`,
		);
	}
	if (id === "expedition-reise") {
		if (goal === 1) {
			const east = int(2, 8),
				north = int(2, 7),
				scale = int(2, 12) * 10,
				minutes = int(2, 5),
				pause = transfer ? int(1, 4) * 5 : 0,
				steps = east + north,
				totalTime = steps * minutes + pause;
			const t = worksheet(
				1,
				`Der Weg führt ${east} Planabstände nach Osten und ${north} nach Norden. Ein Abstand bedeutet ${format(scale)} m; dafür werden ${minutes} min geplant.${transfer ? ` Eine Pause dauert ${pause} min.` : ""}`,
				["journey-route", east, north, scale, minutes, pause],
				"Weg und Zeitplan",
				["Angabe", "Wert"],
				[
					["Wegabschnitte", `${east} und ${north}`],
					["Ein Abstand", `${format(scale)} m / ${minutes} min`],
					["Pause", `${pause} min`],
				],
				[
					number(
						"Weglänge in m",
						steps * scale,
						"Addiere die beiden Wegabschnitte und nutze dann die Längenangabe je Abstand.",
					),
					number(
						"Geplante Dauer in min",
						totalTime,
						"Zeit für alle Abstände plus Pause.",
					),
					number(
						"Ganze h in dieser Dauer",
						Math.floor(totalTime / 60),
						"Eine Stunde hat 60 Minuten.",
					),
				],
				"Ein Lageplan hilft bei der Strecke, eine Zeitleiste bei der Dauer. Für die Ecke addierst du beide Abschnitte.",
				`${steps} Abstände ergeben ${format(steps * scale)} m. Die Zeit ist ${steps * minutes} min + ${pause} min = ${totalTime} min.`,
			);
			t.toolViews = [
				{
					label: "Ein Planabstand als Vergleichsstück",
					scene: { kind: "estimate", values: [1, scale], labels: ["m"] },
				},
			];
			return t;
		}
		if (goal === 2) {
			const start = int(7, 17) * 60 + int(0, 10) * 5,
				walk = int(2, 8) * 5,
				wait = transfer ? int(1, 5) * 5 : 0,
				ride = int(3, 12) * 5,
				departure = start + walk + wait,
				arrival = departure + ride;
			const t = worksheet(
				2,
				`Milo startet um ${clock(start)} Uhr. Der Fußweg dauert ${walk} min.${wait ? ` Danach wartet er ${wait} min.` : ""} Die Bootsfahrt dauert ${ride} min. Alle Zeitpunkte liegen am selben Tag.`,
				["journey-time", start, walk, wait, ride],
				"Weg zum Boot und Bootsfahrt",
				["Abschnitt", "Dauer"],
				[
					["Fußweg", `${walk} min`],
					["Warten", `${wait} min`],
					["Boot", `${ride} min`],
				],
				[
					number(
						"Abfahrt des Boots",
						departure,
						"Start plus Fußweg plus Wartezeit.",
						{ clock: true },
					),
					number(
						"Ankunft am Ziel",
						arrival,
						"Addiere zur Bootsabfahrt die Fahrtdauer.",
						{ clock: true },
					),
					number(
						"Gesamte Dauer in min",
						walk + wait + ride,
						"Alle Zeiten gehören zur Reise; zähle Wartezeit mit.",
					),
				],
				"Du kannst die Startuhr oder die Tabelle öffnen und eine eigene Zeitleiste zeichnen. Rechne mit 60 Minuten je Stunde.",
				`Bootsabfahrt: ${clock(departure)} Uhr; Ankunft: ${clock(arrival)} Uhr. Insgesamt ${walk + wait + ride} min.`,
			);
			t.toolViews = [
				{
					label: "Startuhr ansehen",
					scene: { kind: "clock", values: [start] },
				},
			];
			return t;
		}
		const children = int(9, 29),
			adults = int(2, 6),
			childPrice = int(10, 29) * 10,
			adultPrice = childPrice * 2,
			seats = transfer ? int(5, 9) : children + adults,
			total = children * childPrice + adults * adultPrice,
			boats = Math.ceil((children + adults) / seats);
		return worksheet(
			3,
			`${children} Kinder und ${adults} Erwachsene planen eine Bootsfahrt. Im Modell kostet ein Kinderticket ${fmtEuro(childPrice)}, ein Erwachsenenticket doppelt so viel. Pro Boot gibt es ${seats} Plätze.`,
			["journey-tickets", children, adults, childPrice, seats],
			"Tickets und Plätze",
			["Gruppe", "Anzahl", "Ticketpreis"],
			[
				["Kinder", String(children), fmtEuro(childPrice)],
				["Erwachsene", String(adults), "doppelt so viel"],
			],
			[
				number(
					"Erwachsenenticket in ct",
					adultPrice,
					"Doppelter Preis bedeutet mal 2.",
				),
				number(
					"Alle Tickets in €",
					total,
					"Berechne beide Gruppenpreise und addiere.",
					{ scale: 100 },
				),
				number(
					"Boote mindestens",
					boats,
					"Alle Personen brauchen einen Platz. Runde die ganze Bootszahl ausreichend nach oben.",
				),
			],
			"Die Ticketkosten und die benötigten Plätze sind zwei verschiedene Fragen. Die Modellangaben sind keine echten Angebote.",
			`Alle Tickets kosten ${fmtEuro(total)}. ${children + adults} Personen benötigen mindestens ${boats} Boote zu ${seats} Plätzen.`,
		);
	}
	if (goal === 1) {
		const children = int(13, 37),
			helpers = int(3, 9),
			per = transfer ? 250 : 500,
			people = children + helpers,
			total = people * per,
			bottles = Math.ceil(total / 1000),
			seats = int(4, 8),
			tables = Math.ceil(people / seats);
		return worksheet(
			1,
			`${children} Kinder und ${helpers} Helfer planen ein Inselfest. Für jede Person sind ${format(per)} ml Wasser und ein Sitzplatz vorgesehen.`,
			["festival-supply", children, helpers, per, seats],
			"Getränke und Tische",
			["Angabe", "Wert"],
			[
				["Je Flasche", "1 l"],
				["Plätze je Tisch", String(seats)],
				["Je Person", `${format(per)} ml`],
			],
			[
				number(
					"Wasser insgesamt in ml",
					total,
					"Zähle Kinder und Helfer zusammen und nimm dann die Portion je Person.",
				),
				number(
					"Volle 1-l-Flaschen mindestens",
					bottles,
					"Eine zusätzliche Flasche muss ganz eingeplant werden.",
				),
				number(
					"Tische mindestens",
					tables,
					"Alle Personen brauchen einen Platz, auch bei einem nicht ganz gefüllten letzten Tisch.",
				),
			],
			"Eine Tabelle hilft dir, Personen, Portionen und ganze Vorratspackungen auseinanderzuhalten.",
			`${people} Personen brauchen ${format(total)} ml Wasser: ${bottles} volle Literflaschen. Bei ${seats} Plätzen je Tisch brauchst du ${tables} Tische.`,
		);
	}
	if (goal === 2) {
		const values = [int(4, 19), int(4, 19), int(4, 19)];
		let max = Math.max(...values);
		while (values.filter((n) => n === max).length !== 1) {
			values[1]++;
			max = Math.max(...values);
		}
		const winner = values.indexOf(max),
			second = [...values].sort((a, b) => b - a)[1],
			labels = ["Bauen", "Malen", "Spielen"];
		return worksheet(
			2,
			"Eine Modellabstimmung legt das Festprogramm fest: Die Aktivität mit den meisten Stimmen wird gewählt. Werte das Ergebnis aus.",
			["festival-votes", ...values],
			"Fiktive Abstimmung, jede Person eine Stimme",
			["Hinweis", "Wert"],
			[["Kleine Skalenstufe", "1 Stimme"]],
			[
				choose(
					"Welche Aktivität wird gewählt?",
					winner + 1,
					labels,
					"Die höchste Stimmenzahl entscheidet nach der angegebenen Regel.",
				),
				number(
					"Stimmen insgesamt",
					sum(values),
					"Zähle alle drei Häufigkeiten zusammen.",
				),
				number(
					"Vorsprung vor dem zweiten Platz",
					max - second,
					"Vergleiche den höchsten und den zweithöchsten Wert.",
				),
				...(transfer
					? [
							number(
								"Stimmen für die beiden übrigen Aktivitäten zusammen",
								sum(values) - max,
								"Gesamtzahl minus Stimmen der gewählten Aktivität.",
							),
						]
					: []),
			],
			"Eine Abstimmungsregel muss vorher feststehen. Diese Modelldaten sagen nichts über andere Kinder aus.",
			`${labels[winner]} hat ${max} Stimmen, insgesamt gibt es ${sum(values)}. Der Vorsprung vor dem zweiten Platz beträgt ${max - second}.`,
			{
				kind: "data",
				values: [],
				chart: { labels, values, scale: 1, max: 24, unit: "Stimmen" },
			},
		);
	}
	const start = int(12, 17) * 60 + int(0, 8) * 5,
		first = int(3, 8) * 5,
		second = int(2, 7) * 5,
		breakTime = transfer ? int(1, 3) * 5 : 0,
		cleanup = int(2, 5) * 5,
		end = start + first + second + breakTime + cleanup;
	const t = worksheet(
		3,
		`Das Fest beginnt um ${clock(start)} Uhr. Plane Spiel, Basteln${transfer ? ", Pause" : ""} und Aufräumen bis zum Ende.`,
		["festival-time", start, first, second, breakTime, cleanup],
		"Alle Zeitabschnitte gehören zum Plan",
		["Abschnitt", "Dauer"],
		[
			["Spiel", `${first} min`],
			["Basteln", `${second} min`],
			["Pause", `${breakTime} min`],
			["Aufräumen", `${cleanup} min`],
		],
		[
			number(
				"Dauer mit Aufräumen in min",
				first + second + breakTime + cleanup,
				"Addiere alle angegebenen Abschnitte.",
			),
			number(
				"Endzeit des Festes",
				end,
				"Startzeit plus gesamte Dauer; eine Stunde hat 60 Minuten.",
				{ clock: true },
			),
			why(
				"Warum zählt das Aufräumen mit?",
				"Es ist ein eigener Abschnitt des gesamten Zeitplans.",
				[
					"Es dauert keine Zeit, weil es nach dem Spiel liegt.",
					"Minuten nach einer vollen Stunde zählen grundsätzlich doppelt.",
				],
				"Ein vollständiger Plan berücksichtigt auch Vor- oder Nacharbeiten.",
			),
		],
		"Du darfst die Startuhr ansehen und die Abschnitte auf einer eigenen Zeitleiste ordnen.",
		`Die Dauer ist ${first + second + breakTime + cleanup} min. Von ${clock(start)} Uhr führt sie bis ${clock(end)} Uhr.`,
	);
	t.toolViews = [
		{
			label: "Startuhr für deine Zeitleiste",
			scene: { kind: "clock", values: [start] },
		},
	];
	return t;
}
function chartLab(
	goal: 1 | 2 | 3,
	values: number[],
	scale: number,
	observations?: number[],
	collection = false,
): ForestTask {
	const labels = ["Äpfel", "Birnen", "Pflaumen"],
		c: DataChart = {
			labels,
			values,
			scale,
			max: 24,
			unit: "Stück",
			observations,
			collection,
		};
	const target = collection ? [...values, observations?.length ?? 0] : values;
	return {
		kind: "model",
		goal,
		prompt: collection
			? "Decke die Modellbeobachtungen einzeln auf und erfasse jede Frucht selbst in deinem Säulendiagramm."
			: "Baue aus der Liste ein beschriftetes Säulendiagramm. Jede Säule soll die richtige Häufigkeit zeigen.",
		answer: target,
		hint: "Ordne jede Beobachtung genau einer Kategorie zu. Die Skala zeigt, wie viele Stück ein Höhenabschnitt bedeutet. Prüfe die eingetragenen Häufigkeiten und ihre Summe.",
		explanation: `Zur Quelle passen die Häufigkeiten ${values.join(", ")} Stück; zusammen ${sum(values)}. Dies sind Modelldaten, keine beobachtete echte Befragung.`,
		model: {
			identity: ["data-counts", ...values],
			scene: { kind: "data", values: [], chart: c },
			controls: target.map((_, i) => ({
				label: i < labels.length ? labels[i] : "Aufgedeckte Beobachtungen",
				max: i < labels.length ? 24 : (observations?.length ?? 0),
				start: 0,
				step: i < labels.length ? scale : 1,
			})),
			target,
		},
	};
}
export function finalLab(id: FinalId, index: number): ForestTask {
	if (id === "daten-sammeln-darstellen") {
		if (index === 0)
			return chartLab(1, [4, 6, 3], 1, [0, 1, 2, 1, 0, 1, 1, 2, 0, 1, 2, 1, 0]);
		if (index === 1) return chartLab(2, [8, 12, 6], 2);
		return chartLab(
			3,
			[5, 4, 3],
			1,
			[0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1, 0],
			true,
		);
	}
	if (id === "zufallsexperimente") {
		const e: ChanceExperiment = {
				red: [1, 3, 2][index],
				blue: [3, 1, 2][index],
				seed: [601, 607, 613][index],
				draws: 12,
				...(index === 1
					? {
							previous: { red: 1, blue: 3, seed: 601 },
							variable: { total: 4, initialRed: 1 },
						}
					: {}),
			},
			correct = compositionChoice(e),
			target = [
				correct,
				e.draws,
				sum(drawsFor(e)),
				correct,
				1,
				...(e.variable ? [e.red] : []),
			];
		return {
			kind: "model",
			goal: (index + 1) as 1 | 2 | 3,
			prompt: [
				"Vermute, ziehe und zähle: Unterscheide die Chance von einer beobachteten Reihe.",
				"Verändere die Beutelbedingungen: Vergleiche jetzt mit dem vorigen Versuch.",
				"Beobachte den Beutel mit gleichen Anzahlen. Prüfe, was gleiche Chancen für eine kurze Reihe bedeuten.",
			][index],
			answer: target,
			hint: "Deine Vermutung vor dem Versuch darf abweichen. Für die Schlussfolgerung zählen Beutelinhalt, tatsächlich gezählte Häufigkeiten und die Ungewissheit einer einzelnen Ziehung.",
			explanation: `In diesem Modellversuch wurden ${colouredBalls(target[2], e.draws - target[2])} beobachtet. ${chanceLabels[correct - 1]} Die nächste einzelne Ziehung ist nicht garantiert. Eine anfängliche andere Vermutung durfte durch die Untersuchung korrigiert werden.`,
			model: {
				identity: ["chance-composition", e.red, e.blue],
				scene: { kind: "chance", values: [], experiment: e },
				controls: [
					{ label: "Anfangsvermutung", max: 3, start: 0 },
					{ label: "Ziehungen", max: 12, start: 0 },
					{ label: "Rot beobachtet", max: 12, start: 0 },
					{ label: "Chancenvergleich", max: 3, start: 0 },
					{ label: "Grenze der Vorhersage", max: 3, start: 0 },
					...(e.variable
						? [
								{
									label: "Rote Kugeln im Beutel",
									max: e.variable.total - 1,
									start: e.variable.initialRed,
								},
							]
						: []),
				],
				target,
			},
		};
	}
	return finalTask(id, index === 2 ? 2 : 1, 421 + index * 101, index);
}
export function finalFamily(task: ForestTask): (string | number)[] {
	const a = task.investigation?.identity ??
		task.model?.identity ?? [task.prompt];
	if (a[0] === "chance-composition") {
		let r = Number(a[1]),
			b = Number(a[2]);
		const red = r,
			blue = b;
		while (b) {
			[r, b] = [b, r % b];
		}
		return ["chance-composition", red / r, blue / r];
	}
	if (a[0] === "chance-observed")
		return [
			"chance-observed",
			a[5],
			a[3],
			...(task.investigation && task.investigation.rows.length > 1
				? [a[4]]
				: []),
		];
	if (a[0] === "chart-price") return ["chart-price", a[1], a[2], a[4]];
	if (a[0] === "data-chart" || a[0] === "data-counts")
		return ["data-counts", ...a.slice(1, 4)];
	return a;
}
export function finalExit(
	id: FinalId,
	seed: number,
	index: number,
	revision = 1,
): ForestTask {
	const reserved = new Set(
		[
			...TEACHING_FINAL_FAMILIES,
			...[0, 1, 2].map((i) => finalFamily(finalLab(id, i))),
		].map((a) => JSON.stringify(a)),
	);
	for (let n = 0; n < 1000; n++) {
		const t = finalTask(
			id,
			2,
			((seed ^ 0x5be0cd19) + Math.imul(n, 1640531527)) >>> 0,
			index,
			revision,
		);
		if (!reserved.has(JSON.stringify(finalFamily(t)))) return t;
	}
	throw new Error("Could not generate a fresh final-world task");
}

const TEACHING_FINAL_FAMILIES: (string | number)[][] = [
	["data-counts", 4, 6, 3],
	["data-counts", 8, 12, 6],
	["data-counts", 5, 4, 3],
	["read-chart", 6, 12, 8],
	["timetable", 490, 25, 10, 30],
	["chance-composition", 1, 3],
	["chance-composition", 3, 1],
	["chance-composition", 1, 1],
	["workshop-boards", 7, 60, 200, 200],
	["workshop-load", 6, 800, 200, 3000],
	["journey-route", 3, 2, 20, 5, 10],
	["journey-time", 500, 15, 10, 35],
	["journey-time", 580, 15, 10, 0],
	["journey-tickets", 10, 2, 150, 6],
	["festival-supply", 13, 3, 250, 6],
	["festival-time", 850, 30, 25, 10, 15],
];
