import { random } from "../practice/tasks";
import type { InvestigationField } from "./investigations";
import { quantityText } from "./quantity";
import type { ForestTask } from "./tasks";
import type { Scene, Workshop } from "./workshop";
import type { MeasureId } from "./worlds";
const num = (
	label: string,
	value: number,
	hint: string,
	fmt?: InvestigationField["format"],
): InvestigationField => ({ label, value, hint, format: fmt });
const reason = (
	label: string,
	correct: string,
	wrong: [string, string],
	hint: string,
): InvestigationField => ({
	label,
	value: 1,
	hint,
	choices: [correct, ...wrong].map((label, i) => ({ value: i + 1, label })),
});
export function worksheet(
	goal: 1 | 2 | 3,
	prompt: string,
	identity: (string | number)[],
	caption: string,
	headers: string[],
	rows: string[][],
	fields: InvestigationField[],
	hint: string,
	explanation: string,
	scene?: Scene,
): ForestTask {
	return {
		kind: "investigation",
		goal,
		prompt,
		investigation: { identity, caption, headers, rows, fields },
		answer: fields.map((f) => f.value),
		hint,
		explanation,
		scene,
	};
}
const clock = (n: number) => quantityText(n % 1440, { clock: true });
export function measureTask(
	id: MeasureId,
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
	if (id === "laengen-messen") {
		const start = transfer ? int(11, 38) : 0,
			end = start + int(21, 79),
			length = end - start;
		if (goal < 3)
			return worksheet(
				goal,
				transfer
					? "Das Band beginnt nicht bei 0. Bestimme seine Länge."
					: "Lies die Bandlänge am Modell-Lineal ab.",
				["length", start, end],
				"Lineal: große Abschnitte in cm, kleine in mm",
				["Anfang", "Ende"],
				[
					[
						transfer ? `${start} mm` : "0 mm",
						transfer ? `${end} mm` : "am Lineal ablesen",
					],
				],
				[
					num(
						"Bandlänge in mm",
						length,
						"Ziehe den Anfangswert vom Endwert ab. 1 cm hat 10 mm.",
					),
					...(goal === 2
						? [
								num(
									"Ganze cm",
									Math.floor(length / 10),
									"Bündle je 10 mm zu 1 cm.",
								),
								num(
									"Übrige mm",
									length % 10,
									"Nach den ganzen Zehnern bleiben weniger als 10 mm.",
								),
							]
						: [
								reason(
									"So misst du richtig",
									"Am Nullstrich anlegen und die Einheit notieren.",
									[
										"Am Rand des Lineals beginnen, auch wenn dort nicht 0 steht.",
										"Nur die Striche zählen, die Einheit ist egal.",
									],
									"Der Nullstrich ist der Start einer Längenmessung.",
								),
							]),
				],
				"Zwischen zwei cm-Strichen liegen zehn mm-Abschnitte. Bei verschobenem Anfang rechnest du Ende − Anfang.",
				`${end} mm − ${start} mm = ${length} mm = ${Math.floor(length / 10)} cm ${length % 10} mm.`,
				{ kind: "ruler", values: [start, end] },
			);
		const pieces = int(3, 8),
			each = int(12, 89),
			spare = transfer ? int(10, 99) : 0,
			total = pieces * each + spare;
		return worksheet(
			3,
			`Milo braucht ${pieces} Bänder von je ${each} cm${transfer ? ` und ${spare} cm Reserve` : ""}. Plane die Gesamtlänge.`,
			["ribbon", pieces, each, spare],
			"Bänder zuschneiden",
			["Anzahl", "Länge je Band", "Reserve"],
			[[String(pieces), `${each} cm`, `${spare} cm`]],
			[
				num(
					"Benötigte cm",
					total,
					"Multipliziere Anzahl und Einzellänge; addiere danach die Reserve.",
				),
				num(
					"Dieselbe Länge in m",
					total,
					"1 m enthält 100 cm. Zum Beispiel sind 125 cm gleich 1,25 m.",
					{ scale: 100 },
				),
			],
			"Bringe alle Längen in dieselbe Einheit. Prüfe, ob das Ergebnis für mehrere Bänder größer als eine Einzellänge ist.",
			`${pieces} · ${each} cm + ${spare} cm = ${total} cm = ${quantityText(total, { scale: 100 })} m.`,
		);
	}
	if (id === "masse-fassungsvermoegen") {
		if (goal === 1) {
			const kg = int(1, 8),
				g = int(1, 39) * 25,
				extra = transfer ? int(1, 19) * 25 : 0,
				total = kg * 1000 + g + extra;
			return worksheet(
				1,
				transfer
					? "Eine Kiste und ihr Inhalt werden zusammen gewogen. Ergänze die Masse."
					: "Zerlege die Masse in kg und g.",
				["mass", kg, g, extra],
				"Massen zusammenfassen",
				["Inhalt", "Kiste"],
				[[`${kg} kg ${g} g`, `${extra} g`]],
				[
					num(
						"Zusammen in g",
						total,
						"1 kg sind 1 000 g. Addiere erst nach dem Umwandeln.",
					),
					num("Ganze kg", Math.floor(total / 1000), "Bündle je 1 000 g."),
					num(
						"Übrige g",
						total % 1000,
						"Nach den ganzen kg bleiben weniger als 1 000 g.",
					),
				],
				"Masse und Fassungsvermögen sind verschiedene Größen. Hier passt die Waage.",
				`${kg * 1000} g + ${g} g + ${extra} g = ${total} g = ${Math.floor(total / 1000)} kg ${total % 1000} g.`,
			);
		}
		if (goal === 2) {
			const cup = [100, 125, 250, 500][int(0, 3)],
				count = int(3, 14),
				total = cup * count,
				available = transfer ? Math.ceil(total / 1000) * 1000 + 1000 : total;
			return worksheet(
				2,
				transfer
					? `Aus ${available} ml Saft werden ${count} Becher gefüllt. Jeder fasst ${cup} ml. Was bleibt?`
					: `Fülle ${count} Becher mit je ${cup} ml. Wie viel Saft brauchst du?`,
				["capacity", cup, count, available],
				"Ausschank",
				["Becher", "Je Becher", "Vorrat"],
				[
					[
						String(count),
						`${cup} ml`,
						transfer ? `${available} ml` : "gesucht",
					],
				],
				[
					num(
						"Ausgeschenkte ml",
						total,
						"Anzahl der Becher mal Inhalt eines Bechers.",
					),
					num(
						transfer ? "Übrige ml" : "Ganze l",
						transfer ? available - total : Math.floor(total / 1000),
						transfer
							? "Ziehe die ausgeschenkte Menge vom Vorrat ab."
							: "1 l sind 1 000 ml.",
					),
					...(transfer
						? []
						: [
								num(
									"Übrige ml nach den ganzen l",
									total % 1000,
									"Bündle nur volle Tausender.",
								),
							]),
				],
				"Lies den Messbecher auf Augenhöhe. Die Einheit ml beschreibt den Inhalt, nicht die Masse.",
				`${count} · ${cup} ml = ${total} ml.${transfer ? ` ${available} ml − ${total} ml = ${available - total} ml bleiben.` : ` Das sind ${Math.floor(total / 1000)} l ${total % 1000} ml.`}`,
			);
		}
		const denominator = [2, 4][int(0, 1)],
			liters = int(1, 20),
			parts = transfer && denominator === 4 ? 3 : 1,
			ml = (liters * 1000 * parts) / denominator;
		return worksheet(
			3,
			`Bestimme ${parts === 3 ? "drei Viertel" : denominator === 2 ? "die Hälfte" : "ein Viertel"} von ${liters} l.`,
			["capacity-fraction", liters, denominator, parts],
			"Gleich große Teile",
			["Ganzes", "Teile", "Davon gebraucht"],
			[[`${liters} l`, String(denominator), String(parts)]],
			[
				num("Das Ganze in ml", liters * 1000, "1 l = 1 000 ml."),
				num(
					"Ein Teil in ml",
					(liters * 1000) / denominator,
					"Teile das Ganze in gleich große Teile.",
				),
				num(
					"Gebrauchte ml",
					ml,
					"Nimm die angegebene Anzahl gleich großer Teile.",
				),
				...(transfer
					? [
							num(
								"Übrige ml",
								liters * 1000 - ml,
								"Ziehe den gebrauchten Teil vom Ganzen ab.",
							),
						]
					: []),
			],
			"Ein Viertel heißt: in vier gleich große Teile teilen. Drei Viertel sind drei davon.",
			`${liters} l = ${liters * 1000} ml; ein Teil hat ${(liters * 1000) / denominator} ml. ${parts} Teil(e) ergeben ${ml} ml.`,
		);
	}
	if (id === "uhrzeit-zeitspannen") {
		const start = int(6, 20) * 60 + int(0, 11) * 5,
			duration = int(3, 22) * 5,
			end = start + duration;
		if (goal === 1)
			return worksheet(
				1,
				`Lies die Uhr. Es ist ${start < 720 ? "vormittags" : "nachmittags oder abends"}.`,
				["clock-read", start],
				"Zeiger und Tagesabschnitt",
				["Hinweis", "Bedeutung"],
				[
					["Langer Zeiger", "Minuten"],
					["Kurzer Zeiger", "Stunde und Anteil der Stunde"],
				],
				[
					num(
						"Uhrzeit (Stunde:Minute)",
						start,
						"Jeder große Minutenabstand bedeutet 5 min. Der kurze Zeiger wandert während der Stunde mit.",
						{ clock: true },
					),
					num(
						transfer
							? "Minuten bis zur nächsten vollen Stunde"
							: "Minuten seit der vollen Stunde",
						transfer ? 60 - (start % 60) : start % 60,
						transfer
							? "Ergänze die abgelesenen Minuten bis 60. Bei einer vollen Stunde ist die nächste volle Stunde 60 min entfernt."
							: "Zähle am langen Zeiger in Fünferschritten.",
					),
				],
				"Die Analoguhr zeigt 12 Stunden. Der Tagesabschnitt entscheidet zwischen zum Beispiel 3 und 15 Uhr.",
				`Es ist ${clock(start)} Uhr. Seit ${Math.floor(start / 60)} Uhr sind ${start % 60} min vergangen.`,
				{ kind: "clock", values: [start] },
			);
		if (goal === 2) {
			const s = transfer ? 23 * 60 + int(3, 10) * 5 : start,
				e = transfer ? s + duration : end;
			return worksheet(
				2,
				`Der Weg beginnt um ${clock(s)} Uhr und endet um ${clock(e)} Uhr${e >= 1440 ? " am nächsten Tag" : " am selben Tag"}. Wie lange dauert er?`,
				["duration", s, e],
				"Zeitspanne",
				["Beginn", "Ende"],
				[[clock(s), `${clock(e)}${e >= 1440 ? " nächster Tag" : ""}`]],
				[
					num(
						"Zeitspanne in min",
						e - s,
						"Ergänze bis zur nächsten vollen Stunde und weiter zum Ende. Ein Tageswechsel fügt 24 h hinzu.",
					),
					num(
						"Ganze h",
						Math.floor((e - s) / 60),
						"Eine Stunde enthält 60 min, nicht 100.",
					),
					num(
						"Übrige min",
						(e - s) % 60,
						"Nach vollen Stunden bleiben höchstens 59 min.",
					),
				],
				"Rechne in Minuten oder in Schritten über volle Stunden. Schreibe eine Dauer nicht wie eine Uhrzeit als Dezimalzahl.",
				`Vom Beginn bis zum Ende vergehen ${e - s} min = ${Math.floor((e - s) / 60)} h ${(e - s) % 60} min.`,
			);
		}
		const arrival = transfer ? int(9, 21) * 60 + int(0, 11) * 5 : end,
			begin = transfer ? arrival - duration : start;
		return worksheet(
			3,
			transfer
				? `Milo muss um ${clock(arrival)} Uhr ankommen. Der Weg dauert ${duration} min. Wann geht er spätestens los?`
				: `Milo startet um ${clock(begin)} Uhr. Der Weg dauert ${duration} min. Wann kommt er an?`,
			["time-endpoint", begin, duration],
			"Zeitpunkt und Zeitspanne",
			["Gegeben", "Wert"],
			[
				[transfer ? "Ankunft" : "Start", clock(transfer ? arrival : begin)],
				["Dauer", `${duration} min`],
			],
			[
				num(
					transfer ? "Startzeit" : "Ankunft",
					transfer ? begin : arrival,
					"Rechne vorwärts zum Ende oder rückwärts zum Anfang, mit 60 min je Stunde.",
					{ clock: true },
				),
				num(
					"Dieselbe Dauer in s",
					duration * 60,
					"Jede Minute enthält 60 Sekunden.",
				),
			],
			"Eine Zeitspanne wird zu einem Zeitpunkt addiert oder davon abgezogen.",
			`${clock(begin)} Uhr + ${duration} min = ${clock(arrival)} Uhr. ${duration} min = ${duration * 60} s.`,
		);
	}
	if (id === "geld-einkaufen") {
		const euros = int(1, 8),
			cents = int(1, 19) * 5,
			price = euros * 100 + cents,
			count = transfer ? int(2, 5) : 1,
			total = price * count,
			pay = Math.ceil(total / 500) * 500 + 500;
		if (goal === 1)
			return worksheet(
				1,
				"Wechsle den Geldbetrag, ohne seinen Wert zu verändern.",
				["money", euros, cents],
				"Gleicher Wert, andere Schreibweise",
				["Euro", "Cent"],
				[[`${euros} €`, `${cents} ct`]],
				[
					num("Zusammen in ct", price, "1 € enthält 100 ct."),
					num(
						"Zusammen in €",
						price,
						"100 ct sind 1 €. Schreibe Cent mit zwei Nachkommastellen.",
						{ scale: 100 },
					),
					...(transfer
						? [
								num(
									"Anzahl ganzer Euro nach dem Wechseln",
									Math.floor(price / 100),
									"Bündle alle vollen 100 ct, auch aus den ursprünglichen Cent.",
								),
								num(
									"Übrige ct",
									price % 100,
									"Nach ganzen Euro bleiben weniger als 100 ct.",
								),
							]
						: []),
				],
				"Beim Wechseln ändert sich die Anzahl der Münzen, aber nicht der Geldwert.",
				`${euros} € ${cents} ct = ${price} ct = ${quantityText(price, { scale: 100 })} €.`,
			);
		if (goal === 2)
			return worksheet(
				2,
				`Ein Bastelset kostet ${quantityText(price, { scale: 100 })} €. Milo kauft ${count} und bezahlt mit ${quantityText(pay, { scale: 100 })} €. Berechne das Rückgeld.`,
				["shopping", price, count, pay],
				"Preisliste und Bezahlung",
				["Je Set", "Anzahl", "Bezahlt"],
				[
					[
						`${quantityText(price, { scale: 100 })} €`,
						String(count),
						`${quantityText(pay, { scale: 100 })} €`,
					],
				],
				[
					num(
						"Gesamtpreis in €",
						total,
						"Anzahl mal Preis; rechne zur Kontrolle in Cent.",
						{ scale: 100 },
					),
					num(
						"Rückgeld in €",
						pay - total,
						"Bezahlt minus Gesamtpreis. Probe: Preis + Rückgeld = bezahlt.",
						{ scale: 100 },
					),
				],
				"Berechne erst den ganzen Einkauf. Vergleiche erst danach mit dem bezahlten Betrag.",
				`${count} · ${price} ct = ${total} ct. ${pay} ct − ${total} ct = ${pay - total} ct = ${quantityText(pay - total, { scale: 100 })} €.`,
			);
		const base = int(2, 8),
			unit = int(15, 95) * 5,
			budget = (base + 1) * unit - (transfer ? 5 : 0),
			needed = (base + 1) * unit;
		return worksheet(
			3,
			`${base} gleiche Hefte kosten ${quantityText(base * unit, { scale: 100 })} €. Reicht ein Budget von ${quantityText(budget, { scale: 100 })} € für ${base + 1} Hefte?`,
			["unit-price", base, unit, budget],
			"Gleiche Hefte, gleicher Stückpreis",
			["Anzahl", "Preis"],
			[[String(base), `${quantityText(base * unit, { scale: 100 })} €`]],
			[
				num(
					"Ein Heft in ct",
					unit,
					"Teile den Gesamtpreis durch die Anzahl gleicher Hefte.",
				),
				num(
					`${base + 1} Hefte in ct`,
					needed,
					"Nimm den Stückpreis mal neue Anzahl.",
				),
				reason(
					"Budget prüfen",
					budget >= needed ? "Ja, das Geld reicht." : "Nein, es fehlt Geld.",
					[
						budget >= needed ? "Nein, es fehlt Geld." : "Ja, das Geld reicht.",
						"Bei mehr Heften bleibt der Gesamtpreis gleich.",
					],
					"Vergleiche genaue Centbeträge, wenn das Budget knapp ist.",
				),
			],
			"Bei gleichem Stückpreis kosten mehr Hefte entsprechend mehr. Für die Budgetentscheidung brauchst du den genauen Preis.",
			`Ein Heft kostet ${unit} ct, ${base + 1} Hefte kosten ${needed} ct. Das Budget beträgt ${budget} ct; ${budget >= needed ? "es reicht" : "es fehlen 5 ct"}.`,
		);
	}
	if (id === "einheiten-wechseln") {
		const pair =
			goal === 1
				? { large: "km", small: "m", factor: 1000 }
				: goal === 2
					? { large: "kg", small: "g", factor: 1000 }
					: { large: "l", small: "ml", factor: 1000 };
		const large = int(1, 8),
			small = int(1, 9) * 100,
			total = large * pair.factor + small,
			portions = [2, 4][int(0, 1)];
		return worksheet(
			goal,
			transfer
				? `Ein Vorrat von ${total} ${pair.small} wird in ${portions} gleich große Portionen aufgeteilt. Zuerst soll er in großen und kleinen Einheiten notiert werden.`
				: `Schreibe ${large} ${pair.large} ${small} ${pair.small} in der kleineren Einheit.`,
			["unit-conversion", pair.large, total],
			"Einheiten gehören zum Größenbereich",
			["Angabe", "Beziehung"],
			[
				[
					transfer
						? `${total} ${pair.small}`
						: `${large} ${pair.large} ${small} ${pair.small}`,
					`1 ${pair.large} = ${pair.factor} ${pair.small}`,
				],
			],
			[
				num(
					`Gesamtzahl ${pair.small}`,
					total,
					"Wandle die großen Einheiten um, dann addiere die kleinen.",
				),
				num(
					`Ganze ${pair.large}`,
					large,
					"Bündle volle Tausender zu einer großen Einheit.",
				),
				num(
					`Übrige ${pair.small}`,
					small,
					"Die übrigen kleinen Einheiten müssen kleiner als 1 000 bleiben.",
				),
				...(transfer
					? [
							num(
								`Menge je Portion in ${pair.small}`,
								total / portions,
								"Teile die gesamte kleine Einheit durch die Anzahl gleicher Portionen.",
							),
							reason(
								"Welche Aussage stimmt?",
								"Die Maßzahl ändert sich beim Wechseln, die Größe bleibt gleich.",
								[
									"Bei kleinerer Einheit wird auch der wirkliche Vorrat kleiner.",
									"Alle Einheiten haben immer 100 Teile.",
								],
								"Du änderst die Schreibweise derselben Größe, nicht den Vorrat.",
							),
						]
					: []),
			],
			"Länge, Masse und Inhalt nicht mischen. Hier gilt jeweils der angegebene Tausenderschritt; Zeit und Geld haben andere Schritte.",
			`${total} ${pair.small} = ${large} ${pair.large} ${small} ${pair.small}. Die Größe bleibt beim Einheitenwechsel gleich.`,
		);
	}
	const count = int(4, 12),
		reference = int(12, 28),
		estimate = count * reference;
	if (goal === 1)
		return worksheet(
			1,
			`Eine Bank ist ungefähr ${count} Vergleichsstücke lang. Ein Stück ist ungefähr ${reference} cm lang. Berechne den Rechenwert aus diesen ungefähren Angaben, ohne weiter zu runden. Das Ergebnis bleibt eine Schätzung.`,
			["estimate-reference", count, reference],
			"Schätzen mit einer Bezugsgröße",
			["Anzahl ungefähr", "Länge je Stück ungefähr"],
			[[String(count), `${reference} cm`]],
			[
				num(
					"Rechenwert in cm (noch nicht runden)",
					estimate,
					"Multipliziere Anzahl und Länge des Vergleichsstücks.",
				),
				reason(
					"Was weißt du über das Ergebnis?",
					"Es ist eine Näherung, weil beide Angaben geschätzt sind.",
					[
						"Es ist millimetergenau gemessen.",
						"Schätzungen haben keine Einheit.",
					],
					"Ein Ergebnis aus ungefähren Angaben bleibt ungefähr.",
				),
			],
			"Eine passende Bezugsgröße macht eine Schätzung nachvollziehbar. Für genaues Zuschneiden müsstest du messen.",
			`Ungefähr ${count} · ${reference} cm = ungefähr ${estimate} cm. Das ist keine gemessene Länge.`,
			{ kind: "estimate", values: [count, reference], labels: ["cm"] },
		);
	if (goal === 2) {
		const people = int(11, 39),
			per = transfer ? 250 : 500,
			total = people * per,
			bottles = Math.ceil(total / 1000);
		return worksheet(
			2,
			`${people} Kinder bekommen je ${per} ml Wasser. Wasser gibt es in vollen 1-l-Flaschen. Wie viele Flaschen reichen mindestens?`,
			["water-plan", people, per],
			"Trinkpause planen",
			["Kinder", "Je Kind", "Je Flasche"],
			[[String(people), `${per} ml`, "1 000 ml"]],
			[
				num("Benötigte ml", total, "Anzahl mal Menge je Kind."),
				num(
					"Mindestens volle Flaschen",
					bottles,
					"Eine angebrochene zusätzliche Flasche musst du ganz mitnehmen. Runde die Flaschenzahl nach oben.",
				),
				num(
					"Übrige ml",
					bottles * 1000 - total,
					"Flascheninhalt insgesamt minus benötigte Menge.",
				),
			],
			"Eine Planung darf Reserven enthalten. Runde hier nach oben, damit niemand zu wenig bekommt.",
			`${people} · ${per} ml = ${total} ml. ${bottles} Flaschen enthalten ${bottles * 1000} ml; ${bottles * 1000 - total} ml bleiben.`,
		);
	}
	const n = int(3, 8),
		price = int(11, 99) * 5,
		budget = transfer ? n * price - 5 : n * price + 50;
	return worksheet(
		3,
		`${n} Päckchen kosten je ${quantityText(price, { scale: 100 })} €. Das Budget beträgt ${quantityText(budget, { scale: 100 })} €. Entscheide mit einer passenden Rechnung.`,
		["estimate-exact", n, price, budget],
		"Knappes Budget",
		["Anzahl", "Einzelpreis", "Budget"],
		[
			[
				String(n),
				`${quantityText(price, { scale: 100 })} €`,
				`${quantityText(budget, { scale: 100 })} €`,
			],
		],
		[
			reason(
				"Welche Rechnung brauchst du?",
				"Eine genaue Rechnung, um das knappe Budget zu prüfen.",
				[
					"Nur grob schätzen; wenige Cent spielen nie eine Rolle.",
					"Die Einzelpreise addieren, ohne die Anzahl zu beachten.",
				],
				"Bei einer knappen Grenze kann ein Überschlag die Entscheidung verändern.",
			),
			num(
				"Genauer Gesamtpreis in €",
				n * price,
				"Rechne Anzahl mal Einzelpreis in Cent.",
				{ scale: 100 },
			),
			reason(
				"Reicht das Budget?",
				budget >= n * price ? "Ja." : "Nein.",
				[
					budget >= n * price ? "Nein." : "Ja.",
					"Das kann man trotz genauer Preise nicht entscheiden.",
				],
				"Vergleiche den Gesamtpreis mit dem Budget.",
			),
		],
		"Überschlagen ist gut für die Größenordnung. Eine knappe Kaufentscheidung braucht genaue Beträge.",
		`${n} · ${price} ct = ${n * price} ct. Das Budget ${budget} ct ${budget >= n * price ? "reicht" : "reicht nicht"}.`,
	);
}
function model(
	goal: 1 | 2 | 3,
	prompt: string,
	m: Workshop,
	hint: string,
	explanation: string,
): ForestTask {
	return {
		kind: "model",
		goal,
		prompt,
		model: m,
		answer: m.target,
		hint,
		explanation,
	};
}
export function measureLab(id: MeasureId, index: number): ForestTask {
	const goal = (index + 1) as 1 | 2 | 3;
	if (id === "laengen-messen") {
		const target = [
				[3, 4],
				[5, 7],
				[2, 9],
			][index],
			start = [0, 10, 23][index],
			length = target[0] * 10 + target[1];
		return model(
			goal,
			`Baue ein Band von ${target[0]} cm ${target[1]} mm. Sein Anfang liegt bei ${start} mm.`,
			{
				identity: ["ruler-build", start, length],
				scene: { kind: "ruler", values: [start] },
				controls: [
					{ label: "Ganze cm Bandlänge", max: 8, start: 1 },
					{ label: "Übrige mm Bandlänge", max: 9, start: 0 },
				],
				target,
			},
			"Ein cm enthält 10 mm. Der Anfangswert zählt nicht zur Länge.",
			`Das Band ist ${length} mm lang. Anfang ${start} mm, Ende ${start + length} mm: ${start + length} − ${start} = ${length}.`,
		);
	}
	if (id === "uhrzeit-zeitspannen") {
		const target = [
			[9, 35],
			[14, 10],
			[0, 15],
		][index];
		return model(
			goal,
			[
				"Stelle 09:35 Uhr ein.",
				"Es ist 13:45 Uhr. Stelle die Uhr 25 min später ein.",
				"Es ist 23:50 Uhr. Stelle die Uhr 25 min später, am nächsten Tag, ein.",
			][index],
			{
				identity: ["clock-build", ...target],
				scene: { kind: "clock", values: [] },
				controls: [
					{ label: "Stunde (0 bis 23)", max: 23, start: index === 2 ? 23 : 8 },
					{ label: "Minuten", max: 55, start: index === 2 ? 50 : 0, step: 5 },
				],
				target,
			},
			"Gehe über volle Stunden. Nach 23:59 Uhr beginnt der nächste Tag um 00:00 Uhr.",
			`Deine Uhr zeigt ${clock(target[0] * 60 + target[1])} Uhr. Stunden haben 60 Minuten; ein Tag hat 24 Stunden.`,
		);
	}
	if (id === "geld-einkaufen") {
		const total = [275, 420, 165][index],
			target = [
				[2, 1, 1, 1],
				[4, 0, 1, 0],
				[1, 1, 0, 3],
			][index];
		return model(
			goal,
			`Lege mit Spielmünzen genau ${quantityText(total, { scale: 100 })} €. Mehrere Zusammenstellungen sind möglich.`,
			{
				identity: ["coins-build", total],
				scene: { kind: "coins", values: [] },
				controls: [
					{ label: "1-€-Münzen", max: 8, start: 0 },
					{ label: "50-ct-Münzen", max: 12, start: 0 },
					{ label: "20-ct-Münzen", max: 15, start: 0 },
					{ label: "5-ct-Münzen", max: 19, start: 0 },
				],
				weights: [100, 50, 20, 5],
				total,
				target,
			},
			"Zähle zuerst Euro, dann Cent. 100 ct kannst du gegen 1 € wechseln.",
			`${total} ct = ${quantityText(total, { scale: 100 })} €. Verschiedene Münzlisten können denselben Wert haben.`,
		);
	}
	if (id === "masse-fassungsvermoegen") {
		const total = [1300, 1750, 750][index],
			weights = index === 0 ? [500, 100] : [500, 250],
			target = index === 0 ? [2, 3] : index === 1 ? [3, 1] : [1, 1];
		return model(
			goal,
			index === 0
				? "Lege Gewichte mit insgesamt 1 kg 300 g auf die Modellwaage."
				: `Fülle den Modellbecher mit genau ${total} ml.`,
			{
				identity: ["measure-build", index, total],
				scene: { kind: index === 0 ? "mass" : "capacity", values: [] },
				controls: weights.map((n) => ({
					label: index === 0 ? `${n}-g-Gewichte` : `${n}-ml-Portionen`,
					max: 8,
					start: 0,
				})),
				weights,
				total,
				target,
			},
			"Die großen und kleinen Portionen zählen zusammen. 1 kg = 1 000 g; 1 l = 1 000 ml.",
			index === 0
				? "1 300 g = 1 kg 300 g. Eine echte Masse prüfst du mit einer Waage."
				: `${total} ml wurden aus gleich großen Portionen zusammengesetzt. Ein Viertelliter sind 250 ml.`,
		);
	}
	if (id === "einheiten-wechseln") {
		const labels = [
				["km", "m"],
				["kg", "g"],
				["l", "ml"],
			][index],
			target = [
				[2, 400],
				[1, 700],
				[3, 250],
			][index];
		return model(
			goal,
			`Baue ${target[0] * 1000 + target[1]} ${labels[1]} aus ${labels[0]} und ${labels[1]}.`,
			{
				identity: ["units-build", ...labels, ...target],
				scene: { kind: "units", values: [1000], labels },
				controls: [
					{ label: labels[0], max: 5, start: 0 },
					{ label: labels[1], max: 950, start: 0, step: 50 },
				],
				target,
			},
			"Bündle zuerst volle Tausender. Der Rest ist kleiner als 1 000.",
			`${target[0]} ${labels[0]} und ${target[1]} ${labels[1]} sind zusammen ${target[0] * 1000 + target[1]} ${labels[1]}.`,
		);
	}
	if (index === 1)
		return model(
			2,
			"13 Kinder brauchen je 250 ml Wasser. Stelle die kleinste Anzahl voller 1-l-Flaschen bereit, die reicht.",
			{
				identity: ["estimate-supply", 13, 250],
				scene: { kind: "capacity", values: [8000] },
				controls: [{ label: "Volle 1-l-Flaschen", max: 8, start: 0 }],
				weights: [1000],
				total: 4000,
				target: [4],
			},
			"Berechne 13 · 250 ml. Drei Flaschen reichen nicht; eine zusätzliche Flasche musst du ganz mitnehmen.",
			"13 · 250 ml = 3 250 ml. Vier volle Literflaschen reichen; 750 ml bleiben.",
		);
	if (index === 2) return measureTask(id, 1, 173, 2);
	const size = [20, 25, 10][index],
		count = [6, 4, 9][index];
	return model(
		goal,
		`Eine Strecke wurde grob mit ${count * size} cm angegeben. Ein Vergleichsstück ist ungefähr ${size} cm lang. Lege die Anzahl, die zu diesen Rechenwerten passt, ohne weiter zu runden.`,
		{
			identity: ["estimate-build", size, count],
			scene: { kind: "estimate", values: [size], labels: ["cm"] },
			controls: [{ label: "Vergleichsstücke", max: 12, start: 0 }],
			target: [count],
		},
		"Lege gleich lange Stücke ohne Lücken und Überschneidungen aneinander. Es bleibt eine Schätzung.",
		`${count} · ungefähr ${size} cm = ungefähr ${count * size} cm. Für ein genaues Ergebnis misst du mit einem echten Messgerät.`,
	);
}
export function measureExit(
	id: MeasureId,
	seed: number,
	index: number,
): ForestTask {
	for (let attempt = 0; attempt < 1000; attempt++) {
		const task = measureTask(
			id,
			2,
			((seed ^ 0x3c6ef372) + Math.imul(attempt, 1640531527)) >>> 0,
			index,
		);
		if (!reservedMeasureTask(id, task)) return task;
	}
	throw new Error("Could not generate a fresh measurement exit");
}

// Evidence follows the mathematical fact, across model and worksheet views.
export function measureFamily(task: ForestTask): (string | number)[] {
	const a = task.investigation?.identity ?? task.model?.identity ?? [];
	if (a[0] === "clock-build")
		return ["clock-read", Number(a[1]) * 60 + Number(a[2])];
	if (a[0] === "time-endpoint") return ["time-span", Number(a[1]) % 1440, a[2]];
	if (a[0] === "duration")
		return ["time-span", Number(a[1]) % 1440, Number(a[2]) - Number(a[1])];
	if (a[0] === "units-build")
		return ["unit-conversion", a[1], Number(a[3]) * 1000 + Number(a[4])];
	if (a[0] === "estimate-build") return ["estimate-reference", a[2], a[1]];
	if (a[0] === "estimate-supply") return ["water-plan", a[1], a[2]];
	if (a[0] === "coins-build") return ["money-value", a[1]];
	if (a[0] === "capacity") return ["capacity", a[1], a[2]];
	if (a[0] === "money")
		return ["money-value", Number(a[1]) * 100 + Number(a[2])];
	if (a[0] === "ruler-build")
		return ["length", a[1], Number(a[1]) + Number(a[2])];
	if (a[0] === "measure-build")
		return [Number(a[1]) === 0 ? "mass-value" : "capacity-value", a[2]];
	if (a[0] === "mass")
		return ["mass-value", Number(a[1]) * 1000 + Number(a[2]) + Number(a[3])];
	return a;
}
// Written examples and quick checks are already exposed before exit practice.
// Conservative reservations also include their useful inverse/time readings.
const TEACHING_MEASURE_FAMILIES: (string | number)[][] = [
	["length", 13, 58],
	["length", 20, 70],
	["length", 30, 90],
	["time-span", 645, 85],
	["time-span", 825, 25],
	["time-span", 1430, 25],
	["time-span", 590, 25],
	...[180, 900, 575, 825, 850, 1430, 15, 645, 730, 590, 615].map((n) => [
		"clock-read",
		n,
	]),
	["mass-value", 1500],
	["capacity", 250, 3],
	["capacity", 250, 4],
	["capacity-fraction", 1, 4, 1],
	["capacity-fraction", 1, 2, 1],
	["capacity-fraction", 1, 4, 3],
	["shopping", 135, 3, 500],
	["money-value", 305],
	["money-value", 350],
	["money-value", 407],
	["unit-conversion", "m", 4600],
	["unit-conversion", "km", 4600],
	["unit-conversion", "kg", 3400],
	["unit-conversion", "kg", 2300],
	["unit-conversion", "l", 2750],
	["water-plan", 13, 250],
	["water-plan", 9, 250],
	["estimate-reference", 6, 18],
];
export function reservedMeasureTask(id: MeasureId, task: ForestTask): boolean {
	const family = JSON.stringify(measureFamily(task));
	return [
		...TEACHING_MEASURE_FAMILIES,
		...[0, 1, 2].map((i) => measureFamily(measureLab(id, i))),
	].some((a) => JSON.stringify(a) === family);
}
