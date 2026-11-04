import { random } from "../practice/tasks";
import type { InvestigationField } from "./investigations";
import { worksheet } from "./measurement";
import {
	type Geometry,
	cellIndex,
	frontHeights,
	hexominoes,
	isCubeNet,
	mirrorCells,
	polyKey,
	rectangleCorners,
	transformPoly,
} from "./geometry-model";
import type { ForestTask } from "./tasks";
import type { Workshop } from "./workshop";
import type { ShapeId } from "./worlds";
const field = (
	label: string,
	value: number,
	hint: string,
): InvestigationField => ({ label, value, hint });
const rule = (
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
const scene = (geometry: Geometry) => ({
	kind: "geometry" as const,
	values: [],
	geometry,
});
const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);
const allHexominoes = hexominoes();
const allCubeNets = allHexominoes.filter((p) => {
	const c = Array(36).fill(0);
	for (const [x, y] of p) c[y * 6 + x] = 1;
	return isCubeNet(c, 6);
});
const grid = (
	columns: number,
	rows: number,
	cells: number[],
	kind: Geometry["kind"] = "points",
): Geometry => ({ kind, columns, rows, cells });
function model(
	goal: 1 | 2 | 3,
	prompt: string,
	geometry: Geometry,
	target: number[],
	hint: string,
	explanation: string,
	options: {
		max?: number;
		given?: number[];
		property?: Workshop["property"];
	} = {},
): ForestTask {
	const start = options.given ?? target.map(() => 0);
	return {
		kind: "model",
		goal,
		prompt,
		answer: target,
		hint,
		explanation,
		model: {
			identity: [
				"shape-model",
				geometry.kind,
				prompt,
				JSON.stringify(geometry.source ?? []),
				JSON.stringify(target),
			],
			scene: scene(geometry),
			controls: target.map((_, i) => ({
				label: `Spalte ${(i % geometry.columns) + 1}, Zeile ${Math.floor(i / geometry.columns) + 1}`,
				max: options.max ?? 1,
				start: start[i],
				locked: !!options.given?.[i],
			})),
			target,
			property: options.property,
		},
	};
}
export function shapeTask(
	id: ShapeId,
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	const next = random(
			(seed + Math.imul(index + 1, 2654435761) + level * 104729) >>> 0,
		),
		int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
	const goal = ((index % 3) + 1) as 1 | 2 | 3,
		transfer = level === 2;
	if (id === "wege-lageplaene") {
		const x = int(0, 3),
			y = int(0, 3),
			dx = transfer ? (x > 1 ? -int(1, x) : int(1, 4 - x)) : int(1, 4 - x),
			dy = transfer ? (y > 1 ? -int(1, y) : int(1, 4 - y)) : int(1, 4 - y),
			endX = x + dx,
			endY = y + dy,
			unit = int(1, 20) * 5,
			steps = Math.abs(dx) + Math.abs(dy);
		const path = `${Math.abs(dx)} Feld(er) nach ${dx > 0 ? "Osten" : "Westen"}, dann ${Math.abs(dy)} nach ${dy > 0 ? "Süden" : "Norden"}`;
		const cells = Array(25).fill(0);
		cells[cellIndex(x, y, 5)] = 1;
		return worksheet(
			goal,
			goal === 3
				? `Milo endet bei Spalte ${endX + 1}, Zeile ${endY + 1}. Vorher ging er ${path}. Finde seinen Start.`
				: `Milo startet bei Spalte ${x + 1}, Zeile ${y + 1} und geht ${path}.${goal === 2 ? ` Ein Feldabstand bedeutet ${unit} m in Wirklichkeit.` : ""}`,
			["map", x, y, dx, dy, goal === 2 ? unit : 0, goal],
			"Lageplan: Norden ist oben",
			["Angabe", "Wert"],
			[
				[
					goal === 3 ? "Ziel" : "Start",
					`Spalte ${(goal === 3 ? endX : x) + 1}, Zeile ${(goal === 3 ? endY : y) + 1}`,
				],
				["Weg", path],
				...(goal === 2 ? [["Ein Feldabstand", `${unit} m`]] : []),
			],
			goal === 2
				? [
						field(
							"Zurückgelegte Feldabstände",
							steps,
							"Zähle beide Wegabschnitte, nicht die diagonale Luftlinie.",
						),
						field(
							"Weglänge in m",
							steps * unit,
							"Jeder Feldabstand entspricht derselben wirklichen Länge.",
						),
					]
				: [
						field(
							goal === 3 ? "Startspalte" : "Zielspalte",
							(goal === 3 ? x : endX) + 1,
							"Osten erhöht die Spaltenzahl, Westen verringert sie. Rückwärts kehrst du die Richtung um.",
						),
						field(
							goal === 3 ? "Startzeile" : "Zielzeile",
							(goal === 3 ? y : endY) + 1,
							"Norden verringert die Zeilenzahl, Süden erhöht sie.",
						),
						...(transfer
							? [
									rule(
										"Beim Rückwärtsgehen",
										"Die letzte Bewegung zuerst umkehren.",
										[
											"Dieselben Bewegungen unverändert anhängen.",
											"Norden und Süden zeigen immer nach rechts.",
										],
										"Kehre Reihenfolge und Richtung der Bewegungen um.",
									),
								]
							: []),
					],
			"Lies die Orientierung des Plans. Spalten zählen von links, Zeilen von oben. Ein Feldabstand liegt zwischen zwei benachbarten Feldern.",
			`Von (${x + 1}/${y + 1}) führen ${path} nach (${endX + 1}/${endY + 1}).${goal === 2 ? ` ${steps} · ${unit} m = ${steps * unit} m.` : " Rückwärts machst du die Bewegungen in umgekehrter Reihenfolge und Richtung."}`,
			scene(
				grid(
					5,
					5,
					goal === 3
						? cells.map((_, i) => Number(i === cellIndex(endX, endY, 5)))
						: cells,
					"map",
				),
			),
		);
	}
	if (id === "wuerfelgebaeude-ansichten") {
		const columns = transfer ? 3 : 2,
			rows = 2,
			cells = Array.from({ length: columns * rows }, () => int(1, 4)),
			total = sum(cells),
			front = frontHeights(cells, columns);
		const missing = int(0, cells.length - 1),
			shown =
				goal === 3 && transfer
					? cells.map((n, i) => (i === missing ? 0 : n))
					: cells;
		const fields =
			goal === 1
				? [
						field(
							"Einheitswürfel insgesamt",
							total,
							"Addiere alle Stapelhöhen, auch die hinteren und verdeckten Würfel.",
						),
						field(
							"Belegte Plätze von oben",
							cells.length,
							"Ein Stapel belegt einen Platz, unabhängig von seiner Höhe.",
						),
					]
				: goal === 2
					? front.map((n, i) =>
							field(
								`Höhe der Vorderansicht in Spalte ${i + 1}`,
								n,
								"Von vorne verdeckt ein höherer Stapel niedrigere dahinter. Nimm je Spalte die größte Höhe.",
							),
						)
					: transfer
						? [
								field(
									"Würfel in den sichtbaren Stapeln",
									sum(shown),
									"Addiere die angegebenen Höhen.",
								),
								field(
									"Höhe des fehlenden Stapels",
									cells[missing],
									"Die Gesamtzahl minus die bekannten Stapel ergibt den fehlenden Stapel.",
								),
							]
						: [
								field("Würfel jetzt", total, "Addiere alle Höhen."),
								field(
									"Würfel nach einem zusätzlichen Würfel auf jedem Stapel",
									total + cells.length,
									"Ein Würfel kommt je belegtem Platz dazu, nicht nur einmal insgesamt.",
								),
							];
		return worksheet(
			goal,
			goal === 1
				? "Zähle alle Einheitswürfel des lückenlos gebauten Gebäudes."
				: goal === 2
					? "Bestimme die Vorderansicht. Du schaust vom unteren Rand des Bauplans nach hinten."
					: transfer
						? `Im vollständigen Gebäude sind ${total} Würfel. Der Stapel in Spalte ${(missing % columns) + 1}, Zeile ${Math.floor(missing / columns) + 1} fehlt noch im gezeigten Modell.`
						: "Auf jeden belegten Platz kommt genau ein weiterer Würfel. Plane die neue Gesamtzahl.",
			["building", ...cells, columns, goal, transfer ? missing : -1],
			"Bauplan und Schrägbild",
			["Spalte/Zeile", "Stapelhöhe"],
			shown.map((n, i) => [
				`${(i % columns) + 1}/${Math.floor(i / columns) + 1}`,
				goal === 3 && transfer && i === missing ? "fehlt" : String(n),
			]),
			fields,
			"Jede Zahl beschreibt einen von unten lückenlos gefüllten Stapel. Für die Gesamtzahl addierst du; für die Vorderansicht suchst du die größte Höhe je Spalte.",
			`Vollständig stehen ${total} Würfel im Gebäude. Die Vorderansicht hat von links die Höhen ${front.join(", ")}.${goal === 3 && transfer ? ` Der fehlende Stapel ist ${cells[missing]} Würfel hoch.` : ""}`,
			scene(grid(columns, rows, shown, "building")),
		);
	}
	if (id === "figuren-zeichnen") {
		const w = int(2, 28),
			h = int(2, 25),
			opening = int(5, 49);
		return worksheet(
			goal,
			goal === 1
				? `Ein Rechteck hat eine ${w} cm lange obere und eine ${h} cm lange rechte Seite. Ergänze die gegenüberliegenden Seiten.`
				: goal === 2
					? `Eine rechteckige Karte hat Seiten ${w} cm und ${h} cm. Untersuche Winkel und Rand.`
					: `Der Zirkel bleibt ${opening} mm weit geöffnet. Untersuche die Abstände eines Kreises.`,
			["drawing", goal, w, h, opening, transfer ? 1 : 0],
			goal === 3
				? "Kreis mit unveränderter Zirkelöffnung"
				: "Rechteck: Skizze, nicht in echter Bildschirmgröße",
			["Angabe", "Wert"],
			goal === 3
				? [["Abstand von Mitte zum Rand", `${opening} mm`]]
				: [
						["Oben", `${w} cm`],
						["Rechts", `${h} cm`],
					],
			[
				...(goal === 1
					? [
							field(
								"Untere Seite in cm",
								w,
								"Gegenüberliegende Seiten eines Rechtecks sind gleich lang.",
							),
							field(
								"Linke Seite in cm",
								h,
								"Oben und unten bilden ein Paar, links und rechts das andere.",
							),
						]
					: goal === 2
						? [
								field(
									"Rechte Winkel",
									4,
									"Jede Ecke eines Rechtecks hat einen rechten Winkel, auch bei gedrehter Lage.",
								),
								field(
									"Randlänge in cm",
									2 * w + 2 * h,
									"Addiere alle vier Seiten. Der Rand ist etwas anderes als die ausgelegte Fläche.",
								),
							]
						: [
								field(
									"Abstand von Mitte zu einem anderen Randpunkt in mm",
									opening,
									"Alle Randpunkte haben denselben Abstand zur Mitte, wenn der Zirkel unverändert geöffnet bleibt.",
								),
								field(
									"Strecke durch die Mitte von Rand zu Rand in mm",
									2 * opening,
									"Die Strecke besteht aus zwei gleichen Abständen Mitte–Rand.",
								),
							]),
				...(transfer
					? [
							rule(
								"Welches Hilfsmittel hilft?",
								goal === 3
									? "Ein Zirkel mit festgehaltener Öffnung."
									: "Lineal und Geodreieck zum Prüfen der Längen und rechten Winkel.",
								[
									goal === 3
										? "Zirkelöffnung bei jedem Punkt ändern."
										: "Nur gleiche Seitenlängen prüfen, Winkel spielen keine Rolle.",
									"Die Bildschirmgröße liefert immer echte Zentimeter.",
								],
								"Ein Rechteck braucht vier rechte Winkel; ein Kreis überall denselben Abstand zur Mitte.",
							),
						]
					: []),
			],
			"Prüfe die geometrischen Eigenschaften, statt nur nach dem Aussehen zu entscheiden. Echte cm und mm misst und zeichnest du auf Papier.",
			goal === 3
				? `Alle Randpunkte sind ${opening} mm von der Mitte entfernt. Durch die Mitte liegen zwei solche Strecken hintereinander: ${2 * opening} mm.`
				: `Gegenüberliegende Seiten sind ${w} cm und ${h} cm lang. Vier rechte Winkel gehören zum Rechteck. Die Randlänge ist ${w} + ${h} + ${w} + ${h} = ${2 * w + 2 * h} cm.`,
			scene({
				kind: goal === 3 ? "circle" : "rectangle",
				columns: 1,
				rows: 1,
				cells: [],
				dimensions: goal === 3 ? [opening] : [w, h],
			}),
		);
	}
	if (id === "koerper-netze") {
		if (transfer && goal === 2) {
			const nets = allCubeNets;
			const poly = transformPoly(nets[int(0, nets.length - 1)], int(0, 7)),
				width = Math.max(...poly.map((p) => p[0])) + 1,
				height = Math.max(...poly.map((p) => p[1])) + 1,
				offsetX = int(0, 6 - width),
				offsetY = int(0, 6 - height),
				target = Array(36).fill(0);
			for (const [x, y] of poly) target[(y + offsetY) * 6 + x + offsetX] = 1;
			const positions = target.flatMap((n, i) => (n ? [i] : [])),
				a = int(0, 5),
				b = (a + int(1, 5)) % 6,
				given = target.map((_, i) =>
					Number(i === positions[a] || i === positions[b]),
				);
			return model(
				2,
				"Baue selbst ein gültiges Würfelnetz aus genau sechs Quadraten. Die zwei festen Quadrate müssen dazugehören. Mehrere Lösungen können passen.",
				{ ...grid(6, 6, [], "net"), source: given },
				target,
				"Verbinde die festen Flächen über passende Kanten. Prüfe beim Falten, ob sechs verschiedene Würfelseiten entstehen.",
				"Deine sechs Quadrate bilden ein geschlossenes Würfelnetz ohne Überlappung.",
				{ given, property: "cube-net" },
			);
		}
		if (goal === 3) {
			const l = int(2, 9),
				w = l + int(1, 5),
				h = w + int(1, 5),
				pairs = [
					[l, w],
					[l, h],
					[w, h],
				],
				missing = transfer ? int(0, 2) : 0;
			return worksheet(
				3,
				`Untersuche das Netz eines Quaders mit Kantenlängen ${l}, ${w} und ${h} Längeneinheiten.${transfer ? ` Die Skizze zeigt das vollständige Netz. Bei einem zweiten Papiernetz fehlt die Gegenfläche zu einem Rechteck mit Seiten ${pairs[missing].join(" und ")}. Wähle die passenden Seitenlängen des Ersatzstücks.` : ""}`,
				["cuboid-net", l, w, h],
				"Je zwei gegenüberliegende Flächen sind deckungsgleich",
				["Flächenform", "Seitenlängen"],
				[
					["Paar A", `${l} und ${w}`],
					["Paar B", `${l} und ${h}`],
					["Paar C", `${w} und ${h}`],
				],
				[
					field(
						"Flächen insgesamt",
						6,
						"Jedes der drei Paare enthält zwei Flächen.",
					),
					field(
						"Flächen vom Typ A",
						2,
						"Gegenüberliegende Flächen sind deckungsgleich.",
					),
					rule(
						"Ist dieser Quader ein Würfel?",
						"Nein, seine Kanten sind nicht alle gleich lang.",
						[
							"Ja, jeder Quader hat nur gleich große Quadrate.",
							"Nein, weil ein Würfel keine rechten Winkel hat.",
						],
						"Beim Würfel sind alle Kanten gleich lang; er ist ein besonderer Quader.",
					),
					...(transfer
						? [
								{
									label: "Seitenlängen der fehlenden Gegenfläche",
									value: missing + 1,
									hint: "Gegenüberliegende Flächen müssen deckungsgleich sein: Beide Seitenlängen stimmen überein.",
									choices: pairs.map((p, i) => ({
										value: i + 1,
										label: `${p[0]} und ${p[1]} Längeneinheiten.`,
									})),
								},
							]
						: []),
				],
				"Beim gedanklichen Falten treffen passende Kanten aufeinander. Ein Quader hat drei Paare deckungsgleicher Rechtecke.",
				`Der Quader hat 6 Flächen, je 2 mit Seiten ${l}/${w}, ${l}/${h} und ${w}/${h}. Seine Kantenlängen sind verschieden.${transfer ? ` Das Ersatzstück braucht die Seitenlängen ${pairs[missing].join(" und ")}, wie die gegenüberliegende Fläche.` : ""}`,
				scene({
					kind: "cuboid-net",
					columns: 1,
					rows: 1,
					cells: [],
					dimensions: [l, w, h],
				}),
			);
		}
		const base = allHexominoes[int(0, allHexominoes.length - 1)],
			poly = transformPoly(base, int(0, 7)),
			width = Math.max(...poly.map((p) => p[0])) + 1,
			height = Math.max(...poly.map((p) => p[1])) + 1,
			x = int(0, 6 - width),
			y = int(0, 6 - height),
			cells = Array(36).fill(0);
		for (const [a, b] of poly) cells[(b + y) * 6 + a + x] = 1;
		const valid = isCubeNet(cells, 6);
		return worksheet(
			goal,
			transfer
				? "Prüfe durch gedankliches Falten, ob diese sechs verbundenen Quadrate einen Würfel schließen. Begründe deine Entscheidung."
				: "Kannst du diese sechs Quadrate ohne Überlappung zu einem geschlossenen Würfel falten?",
			["cube-net", polyKey(base), goal],
			"Nur gemeinsame Kanten werden gefaltet",
			["Eigenschaft", "Angabe"],
			[
				["Quadrate", "6, alle gleich groß"],
				["Zusammenhang", "an ganzen Kanten verbunden"],
			],
			[
				{
					label: "Geschlossener Würfel möglich?",
					value: valid ? 1 : 2,
					hint: "Prüfe die Anordnung durch Falten. Jede Fläche muss auf eine andere Würfelseite kommen.",
					choices: [
						{
							value: 1,
							label:
								"Ja, die sechs Flächen bedecken sechs verschiedene Seiten ohne Überlappung.",
						},
						{
							value: 2,
							label:
								"Nein, beim Falten liegen Flächen übereinander oder der Körper schließt nicht.",
						},
					],
				},

				field(
					"Flächen eines Würfels",
					6,
					"Unterscheide Flächen von acht Ecken und zwölf Kanten.",
				),
				...(transfer
					? [
							rule(
								"Was bleibt beim Drehen des ganzen Netzes gleich?",
								"Die Möglichkeit, daraus einen Würfel zu falten.",
								[
									"Ein ungültiges Netz wird durch Drehen immer gültig.",
									"Die Anzahl der Flächen verdoppelt sich.",
								],
								"Eine Drehung verändert weder Nachbarschaften noch die Form der Flächen.",
							),
						]
					: []),
			],
			"Halte eine Fläche gedanklich als Boden fest. Klappe ihre Nachbarn hoch und prüfe weiter. Bei Bedarf baue ein Papiermodell.",
			valid
				? "Das Netz schließt einen Würfel: Sechs Flächen kommen auf sechs verschiedene Seiten. Drehen oder Wenden des Netzes ändert das nicht."
				: "Die Anordnung ist kein Würfelnetz. Beim Falten kommen nicht sechs verschiedene Seiten ohne Überlappung zustande. Eine andere Drehung repariert diese Anordnung nicht.",
			scene(grid(6, 6, cells, "net")),
		);
	}
	if (id === "spiegeln-symmetrie") {
		const axis = transfer ? "horizontal" : "vertical",
			source = Array(25).fill(0),
			positions = new Set<number>();
		while (positions.size < 3) {
			const x = axis === "vertical" ? int(0, 1) : int(0, 4),
				y = axis === "horizontal" ? int(0, 1) : int(0, 4);
			positions.add(y * 5 + x);
		}
		for (const p of positions) source[p] = 1;
		const reflected = mirrorCells(source, 5, 5, axis),
			p = [...positions][int(0, 2)],
			x = p % 5,
			y = Math.floor(p / 5),
			rx = axis === "vertical" ? 4 - x : x,
			ry = axis === "horizontal" ? 4 - y : y,
			dist = axis === "vertical" ? 2 - x : 2 - y;
		return worksheet(
			goal,
			goal === 3
				? "Ergänze gedanklich die Figur zum Spiegelbild. Die Achse verläuft durch die Mitte der mittleren Spalte oder Zeile."
				: `Spiegle den markierten Punkt in Spalte ${x + 1}, Zeile ${y + 1} an der ${axis === "vertical" ? "senkrechten" : "waagerechten"} Mittelachse.`,
			["reflection", axis, ...source, goal, p],
			"Spiegelachse: gestrichelte Mittellinie",
			["Punkt", "Spalte/Zeile"],
			[
				["Ausgangspunkt", `${x + 1}/${y + 1}`],
				["Achse", axis === "vertical" ? "durch Spalte 3" : "durch Zeile 3"],
			],
			goal === 3
				? [
						field(
							"Markierte Felder nach vollständigem Ergänzen",
							sum(source) + sum(reflected),
							"Jeder der drei Ausgangspunkte liegt neben der Achse und erhält genau einen Spiegelpunkt.",
						),
						rule(
							"So prüfst du das Spiegelbild",
							"Gleiche Abstände zur Achse, genau gegenüber und deckungsgleich beim Falten.",
							[
								"Alle Punkte um dieselbe Zahl nach rechts verschieben.",
								"Nur dieselbe Anzahl Punkte setzen, ihre Lage ist egal.",
							],
							"Gleiche Anzahl allein genügt nicht. Die Lage zur Achse muss stimmen.",
						),
					]
				: [
						field(
							"Spalte des Spiegelpunkts",
							rx + 1,
							"Senkrechte Achse: links und rechts tauschen; waagerechte Achse: die Spalte bleibt.",
						),
						field(
							"Zeile des Spiegelpunkts",
							ry + 1,
							"Waagerechte Achse: oben und unten tauschen; senkrechte Achse: die Zeile bleibt.",
						),
						...(goal === 2
							? [
									field(
										"Feldabstände zur Achse",
										dist,
										"Zähle vom Mittelpunkt des Feldes bis zur mittleren Spalte oder Zeile, nicht die Achsenlinie als zusätzlichen Abstand.",
									),
								]
							: []),
					],
			"Spiegelpunkte liegen genau gegenüber, im gleichen Abstand zur Symmetrieachse. Ein Punkt auf der Achse bliebe an seinem Platz.",
			`Der Punkt (${x + 1}/${y + 1}) wird zu (${rx + 1}/${ry + 1}). Beide haben ${dist} Feldabstände zur Achse. Das vollständige Bild hat sechs markierte Felder.`,
			scene({ ...grid(5, 5, source, "mirror"), axis }),
		);
	}
	if (id === "vergroessern-verkleinern") {
		const w = int(1, 12),
			h = int(1, 12),
			factor = transfer ? int(2, 4) : 2,
			reduce = goal === 2,
			newW = reduce ? w : w * factor,
			newH = reduce ? h : h * factor,
			oldW = reduce ? w * factor : w,
			oldH = reduce ? h * factor : h;
		return worksheet(
			goal,
			transfer
				? `Ein Plan zeigt ein Rechteck vorher mit ${oldW} cm Breite und ${oldH} cm Höhe. Nach dem ${reduce ? "Verkleinern" : "Vergrößern"} ist es ${newW} cm breit. Finde, ${reduce ? "durch welche Zahl geteilt" : "mit welcher Zahl multipliziert"} wurde, und bestimme die neue Höhe.`
				: goal === 3
					? `Milo vergrößert ein ${oldW} cm breites und ${oldH} cm hohes Rechteck mit Faktor ${factor}. Er hat nur die Breite verändert. Verbessere den Plan.`
					: `${reduce ? "Verkleinere" : "Vergrößere"} das Rechteck mit Seiten ${oldW} cm und ${oldH} cm. Jede Länge soll ${reduce ? `auf den ${factor}. Teil verkürzt` : `${factor}-mal so lang`} werden.`,
			["scale", oldW, oldH, factor, reduce ? "reduce" : "enlarge", goal],
			"Alle entsprechenden Längen ändern sich gleich",
			["Vorher", "Länge"],
			[
				["Breite", `${oldW} cm`],
				["Höhe", `${oldH} cm`],
			],
			[
				field(
					transfer
						? reduce
							? "Durch welche Zahl teilst du?"
							: "Mit welcher Zahl multiplizierst du?"
						: "Neue Breite in cm",
					transfer ? factor : newW,
					reduce
						? "Teile jede Länge durch denselben Faktor."
						: "Multipliziere jede Länge mit demselben Faktor.",
				),
				field(
					"Neue Höhe in cm",
					newH,
					reduce ? "Teile auch die Höhe." : "Auch die Höhe wird mitvergrößert.",
				),
				...(goal === 3
					? [
							rule(
								"Welche Regel gilt für beide Seiten?",
								"Alle entsprechenden Längen müssen denselben Vergrößerungsfaktor haben.",
								[
									"Es genügt, eine beliebige Seite zu verändern.",
									"Beim Vergrößern müssen alle Seiten gleich lang werden.",
								],
								"Das Seitenverhältnis der Figur bleibt beim maßstäblichen Vergrößern erhalten.",
							),
						]
					: []),
			],
			"Ändere jede entsprechende Länge mit demselben Faktor. Die Kästchen des Bildschirms sind keine echten Zentimeter.",
			`Die Breite wird ${newW} cm und die Höhe ${newH} cm. ${reduce ? `Teile beide Längen durch ${factor}.` : `Multipliziere beide Längen mit ${factor}.`}`,
			scene({
				kind: "rectangle",
				columns: 1,
				rows: 1,
				cells: [],
				dimensions: [oldW, oldH],
			}),
		);
	}
	if (id === "parkette-ornamente") {
		if (transfer && goal === 3) {
			const period = int(3, 5),
				unit = Array.from({ length: period }, () => int(1, 3));
			unit[period - 1] = (unit[0] % 3) + 1;
			const target = Array.from(
					{ length: period * 3 },
					(_, i) => unit[i % period],
				),
				given = target.map((n, i) => (i === 0 || i === period - 1 ? n : 0));
			return model(
				3,
				`Erfinde ein Grundmuster aus ${period} markierten quadratischen Fliesen. Behalte die zwei festen Markierungen und wiederhole die ganze Einheit dreimal. Verwende mindestens zwei verschiedene Markierungen.`,
				{ ...grid(period, 3, [], "tiles"), dimensions: [period] },
				target,
				"Fülle zuerst deine ganze erste Einheit. Wiederhole dann alle Markierungen in derselben Reihenfolge.",
				"Dein selbst ergänztes Grundmuster wiederholt sich dreimal vollständig und enthält mindestens zwei verschiedene Markierungen.",
				{ given, max: 3, property: "ornament" },
			);
		}
		const period = int(2, 4),
			unit = Array.from({ length: period }, () => int(1, 3));
		if (new Set(unit).size === 1) unit[period - 1] = (unit[0] % 3) + 1;
		const repetitions = transfer ? 4 : 3,
			pattern = Array.from(
				{ length: period * repetitions },
				(_, i) => unit[i % period],
			),
			missing = period + int(0, period - 1),
			symbols = ["leer", "Kreis", "Dreieck", "Quadrat"],
			shown = pattern.map((n, i) => (i === missing ? 0 : n));
		return worksheet(
			goal,
			goal === 1
				? "Das angegebene Grundmuster wird immer wiederholt. Ergänze die fehlende Markierung."
				: goal === 2
					? "Untersuche das Bandornament. Nutze das ausdrücklich vorgegebene Grundmuster."
					: "Quadratische Fliesen mit diesen Markierungen werden ohne Lücken und Überlappung nebeneinander gelegt. Plane weitere ganze Grundmuster.",
			["ornament", ...unit, repetitions, missing, goal],
			`Grundmuster: ${unit.map((n) => symbols[n]).join(" – ")}`,
			["Angabe", "Wert"],
			[
				["Fliesen je Grundmuster", String(period)],
				["Geplante Wiederholungen", String(repetitions)],
				["Markierung fehlt an Platz", String(missing + 1)],
			],
			[
				{
					label: "Fehlende Markierung",
					value: pattern[missing],
					hint: "Zähle vom Anfang des Grundmusters. Nach seinem Ende beginnt dasselbe Muster wieder.",
					choices: [1, 2, 3].map((value) => ({ value, label: symbols[value] })),
				},
				field(
					goal === 3
						? "Fliesen für zwei zusätzliche Grundmuster"
						: "Fliesen insgesamt",
					goal === 3 ? period * 2 : period * repetitions,
					"Ein ganzes Grundmuster enthält die angegebene Anzahl Fliesen.",
				),
				...(transfer
					? [
							field(
								"Fliesen nach zwei weiteren ganzen Grundmustern",
								period * (repetitions + 2),
								"Füge zwei ganze Grundmuster hinzu, nicht nur zwei einzelne Fliesen.",
							),
						]
					: []),
			],
			"Wiederhole die ganze angegebene Einheit. Die Zeichen liegen auf quadratischen Fliesen; die Fliesen müssen die Fläche ohne Lücken und Überlappungen bedecken.",
			`Die fehlende Markierung ist ${symbols[pattern[missing]]}. ${repetitions} Grundmuster brauchen ${period * repetitions} Fliesen, zwei weitere ${period * 2}.`,
			scene({
				...grid(period, repetitions, shown, "tiles"),
				dimensions: [period],
			}),
		);
	}
	if (id === "flaechen-vergleichen") {
		const widths = Array.from({ length: 5 }, () => int(1, 5)),
			a = widths.flatMap((n) =>
				Array.from({ length: 5 }, (_, x) => Number(x < n)),
			),
			count = sum(a),
			b = [...a].reverse(),
			extra = transfer ? int(1, 5) : 0;
		return worksheet(
			goal,
			goal === 1
				? `Zähle die gleich großen Einheitsflächen der ausgelegten Figur.${transfer ? ` Für ein Fenster werden ${extra} Plättchen herausgenommen. Bestimme auch die verbleibende Fläche.` : ""}`
				: goal === 2
					? "Die zweite Figur entsteht, indem du genau dieselben Plättchen anders anordnest, ohne Lücken oder Überlappung. Vergleiche die Flächen."
					: `Ein Rahmen hat 25 Plätze für dieselben Einheitsplättchen. Die gezeigte Figur füllt einen Teil davon. Plane das vollständige Auslegen.${transfer ? ` Danach kommen ${extra} weitere Plättchen außerhalb hinzu.` : ""}`,
			["surface", ...widths, goal, extra],
			"Einheitsflächen sind gleich groß",
			["Figur", "Beschreibung"],
			[
				["A", "markierte Felder im Gitter"],
				[
					"B",
					goal === 2
						? "dieselben Plättchen neu angeordnet"
						: "noch nicht ausgelegt",
				],
			],
			[
				field(
					"Einheitsflächen in A",
					count,
					"Zähle die ausgelegten Felder je Reihe und addiere; Randstriche sind keine Flächenteile.",
				),
				...(goal === 1 && transfer
					? [
							field(
								"Einheitsflächen nach dem Herausnehmen",
								count - extra,
								"Ziehe die herausgenommenen Plättchen ab. Ein Loch gehört nicht mehr zur bedeckten Fläche.",
							),
						]
					: []),
				...(goal === 2
					? [
							rule(
								"Flächen vergleichen",
								"Beide sind gleich groß, weil genau dieselben Einheitsflächen verwendet werden.",
								[
									"Die länglicher aussehende Figur ist immer größer.",
									"Eine andere Anordnung verdoppelt die Fläche.",
								],
								"Zerlegen und lückenloses Umlegen verändert die Anzahl gleicher Einheitsflächen nicht.",
							),
						]
					: goal === 3
						? [
								field(
									"Noch fehlende Plättchen im Rahmen",
									25 - count,
									"Der volle Rahmen braucht 25 Plättchen. Ziehe die vorhandenen ab.",
								),
								...(transfer
									? [
											field(
												"Plättchen im Rahmen und außerhalb zusammen",
												25 + extra,
												"Erst den Rahmen füllen, dann die zusätzlichen Plättchen addieren.",
											),
										]
									: []),
							]
						: []),
			],
			"Eine Einheitsfläche bedeckt ein Stück Fläche. Vergleiche mit derselben Einheit; eine andere Anordnung macht dieselben Plättchen nicht größer.",
			`Die Figur hat ${count} Einheitsflächen.${goal === 1 && transfer ? ` Nach dem Herausnehmen: ${count} − ${extra} = ${count - extra} Einheitsflächen.` : ` Umgelegt bleiben es ${count}. Im 25er-Rahmen fehlen ${25 - count} Plättchen.`}`,
			scene(grid(5, 5, goal === 2 && transfer ? b : a, "surface")),
		);
	}
	const columns = int(2, 5),
		rows = int(2, 5),
		height = int(1, 5),
		cells = Array(columns * rows).fill(height),
		total = columns * rows * height,
		removed = transfer ? int(1, height) : 1,
		remaining = total - removed;
	return worksheet(
		goal,
		goal === 1
			? `Die Kiste wird lückenlos mit gleich großen Einheitswürfeln gefüllt. Zähle schichtweise.${transfer ? " Für eine höhere Kiste kommt eine vollständige gleich große Schicht hinzu. Plane auch die neue Gesamtzahl." : ""}`
			: goal === 2
				? `Ein anderes Gebäude enthält ${transfer ? remaining : total} genau gleich große Einheitswürfel. Vergleiche seine Raummenge mit der gezeigten Kiste.`
				: `Die Kiste ist voll. ${removed} Würfel werden herausgenommen. Wie viele bleiben und wie viele fehlen bis zur vollen Kiste?`,
		["volume", columns, rows, height, removed, goal],
		"Jede Schicht ist vollständig und gleich aufgebaut",
		["Angabe", "Wert"],
		[
			["Würfel je Reihe", String(columns)],
			["Reihen je Schicht", String(rows)],
			["Schichten", String(height)],
		],
		[
			field(
				"Würfel je Schicht",
				columns * rows,
				"Zähle gleich lange Reihen einer Schicht.",
			),
			field(
				"Würfel in der vollen Kiste",
				total,
				"Jede vollständige Schicht enthält dieselbe Anzahl; zähle alle Schichten mit.",
			),
			...(goal === 1 && transfer
				? [
						field(
							"Würfel nach einer zusätzlichen ganzen Schicht",
							total + columns * rows,
							"Die neue Kiste enthält eine Schicht mehr, jede Schicht enthält gleich viele Würfel.",
						),
					]
				: []),
			...(goal === 2
				? [
						rule(
							"Vergleich",
							transfer
								? "Die volle Kiste enthält mehr Einheitswürfel."
								: "Beide enthalten gleich viele Einheitswürfel.",
							[
								transfer
									? "Beide enthalten gleich viele Einheitswürfel."
									: "Nur die äußere Form entscheidet, nicht die Anzahl gleicher Würfel.",
								"Die Zahl sichtbarer Außenflächen ist immer der Rauminhalt.",
							],
							"Bei gleich großen Einheitswürfeln vergleicht die Gesamtzahl den Rauminhalt.",
						),
					]
				: goal === 3
					? [
							field(
								"Verbleibende Würfel",
								remaining,
								"Ziehe die herausgenommenen Würfel ab.",
							),
							field(
								"Fehlende Würfel bis zur vollen Kiste",
								removed,
								"Ergänze zur ursprünglichen Gesamtzahl.",
							),
						]
					: []),
		],
		"Zähle Würfel im Inneren und hinten mit. Vergleiche nur mit gleich großen Einheitswürfeln; Außenflächen sind kein Maß für den Rauminhalt.",
		`Eine Schicht hat ${columns * rows} Würfel. ${height} Schichten enthalten ${total} Würfel.${goal === 1 && transfer ? ` Mit einer weiteren Schicht sind es ${total} + ${columns * rows} = ${total + columns * rows} Würfel.` : goal === 3 ? ` Nach dem Herausnehmen von ${removed} bleiben ${remaining}.` : ""}`,
		scene(grid(columns, rows, cells, "volume")),
	);
}
export function shapeLab(id: ShapeId, index: number): ForestTask {
	const goal = (index + 1) as 1 | 2 | 3;
	if (id === "wege-lageplaene") {
		if (index > 0) return shapeTask(id, 1, 613, index);
		const start = [0, 0],
			end = [2, 1],
			cells = Array(25).fill(0),
			target = Array(25).fill(0);
		cells[start[1] * 5 + start[0]] = 1;
		target[end[1] * 5 + end[0]] = 1;
		return model(
			goal,
			`Start (${start[0] + 1}/${start[1] + 1}). Gehe ${Math.abs(end[0] - start[0])} nach ${end[0] > start[0] ? "Osten" : "Westen"} und ${Math.abs(end[1] - start[1])} nach ${end[1] > start[1] ? "Süden" : "Norden"}. Markiere nur das Zielfeld.`,
			{ ...grid(5, 5, cells, "map"), source: cells },
			target,
			"Spalten von links, Zeilen von oben. Norden zeigt nach oben.",
			`Das Ziel ist Spalte ${end[0] + 1}, Zeile ${end[1] + 1}.`,
		);
	}
	if (id === "wuerfelgebaeude-ansichten" || id === "rauminhalte-wuerfel") {
		if (index > 0) return shapeTask(id, index === 2 ? 2 : 1, 887, index);
		const target =
			id === "wuerfelgebaeude-ansichten" ? [1, 2, 3, 1] : [2, 2, 2, 2];
		return model(
			goal,
			`Baue lückenlose Stapel nach diesem Plan, hintere Reihe zuerst: ${target.slice(0, 2).join(", ")}; vordere Reihe: ${target.slice(2).join(", ")}.${id === "rauminhalte-wuerfel" ? " Jeder Würfel hat dieselbe Größe." : ""}`,
			grid(2, 2, [], id === "rauminhalte-wuerfel" ? "volume" : "building"),
			target,
			"Jedes Feld zeigt eine Stapelhöhe. Tippe zum Erhöhen; nach 3 wird das Feld wieder leer.",
			`Der Plan enthält ${sum(target)} Einheitswürfel. Verdeckte Würfel zählen mit.`,
			{ max: 3 },
		);
	}
	if (id === "figuren-zeichnen") {
		if (index === 2) return shapeTask(id, 1, 443, 2);
		const target = rectangleCorners(
			5,
			5,
			index === 0 ? 0 : 1,
			index === 0 ? 0 : 1,
			index === 0 ? 3 : 2,
			index === 0 ? 2 : 3,
		);
		return model(
			goal,
			index === 0
				? "Zeichne ein Rechteck: Markiere die vier Ecken, beginnend bei Spalte 1/Zeile 1, 3 Feldabstände breit und 2 hoch."
				: "Markiere vier Ecken eines beliebigen Rechtecks mit waagerechten und senkrechten Seiten. Vier rechte Winkel müssen entstehen.",
			grid(5, 5, [], "points"),
			target,
			"Gegenüberliegende Seiten sind gleich lang. Wähle zwei verschiedene Spalten und zwei verschiedene Zeilen.",
			"Die vier gewählten Ecken bilden ein Rechteck mit vier rechten Winkeln.",
			{ property: index === 1 ? "rectangle" : undefined },
		);
	}
	if (id === "koerper-netze") {
		if (index === 2) return shapeTask(id, 1, 219, 2);
		const target = Array(25).fill(0);
		for (const p of [
			[1, 0],
			[1, 1],
			[0, 1],
			[2, 1],
			[1, 2],
			[1, 3],
		])
			target[p[1] * 5 + p[0]] = 1;
		const given =
			index === 0
				? target.map((n, i) => (i === 16 ? 0 : n))
				: Array(25).fill(0);
		return model(
			goal,
			index === 0
				? "Ergänze die fünf festen Quadrate mit genau einem Quadrat zu einem Würfelnetz."
				: "Baue ein beliebiges gültiges Würfelnetz aus genau sechs Quadraten. Sie müssen an Kanten verbunden sein.",
			grid(5, 5, [], "net"),
			target,
			"Halte eine Fläche als Boden fest und klappe die Nachbarn gedanklich hoch. Keine zwei Flächen dürfen dieselbe Würfelseite bedecken.",
			"Sechs verbundene Quadrate schließen ohne Überlappung einen Würfel.",
			{ given, property: "cube-net" },
		);
	}
	if (id === "spiegeln-symmetrie") {
		const source = Array(25).fill(0),
			axis = index === 2 ? "horizontal" : "vertical";
		for (const p of index === 0
			? [[0, 1]]
			: index === 1
				? [
						[0, 0],
						[1, 2],
						[0, 4],
					]
				: [
						[0, 0],
						[2, 1],
						[4, 0],
					])
			source[p[1] * 5 + p[0]] = 1;
		const reflected = mirrorCells(source, 5, 5, axis),
			target = source.map((n, i) => Number(n || reflected[i]));
		return model(
			goal,
			`Ergänze das Spiegelbild an der ${axis === "vertical" ? "senkrechten" : "waagerechten"} Mittelachse. Die Ausgangspunkte bleiben fest.`,
			{ ...grid(5, 5, [], "mirror"), axis, source },
			target,
			"Setze jeden Spiegelpunkt genau gegenüber, im gleichen Abstand von der Achse.",
			"Beim Falten an der Mittelachse liegen Ausgangspunkte und Spiegelpunkte deckungsgleich aufeinander.",
			{ given: source },
		);
	}
	if (id === "vergroessern-verkleinern") {
		const w = [1, 4, 2][index],
			h = [2, 2, 1][index],
			factor = index === 1 ? 0.5 : 2,
			newW = w * factor,
			newH = h * factor,
			target = rectangleCorners(5, 5, 0, 0, newW, newH),
			source = rectangleCorners(5, 5, 0, 0, w, h);
		return model(
			goal,
			`${index === 1 ? "Verkleinere" : "Vergrößere"} das ursprüngliche Rechteck (Breite ${w}, Höhe ${h} Feldabstände) ${index === 1 ? "auf die Hälfte" : "auf das Doppelte"}. Markiere nur die vier neuen Ecken; linke obere Ecke ist Spalte 1/Zeile 1.`,
			{ ...grid(5, 5, [], "scale"), source },
			target,
			"Ändere Breite und Höhe mit demselben Faktor. Die linke obere Ecke bleibt fest.",
			`Das neue Rechteck ist ${newW} Feldabstände breit und ${newH} hoch.`,
		);
	}
	if (id === "parkette-ornamente") {
		const columns = index === 0 ? 3 : 4,
			rows = index === 2 ? 3 : 2,
			target = Array.from({ length: columns * rows }, (_, i) =>
				index === 0
					? (((i % columns) + Math.floor(i / columns)) % 2) + 1
					: [1, 2, 2, 1][i % 4],
			);
		return model(
			goal,
			index === 0
				? "Lege quadratische Fliesen lückenlos: Kreis und Dreieck wechseln in jeder Reihe und Spalte ab. Links oben beginnt ein Kreis."
				: index === 1
					? "Setze das Band fort: Kreis, Dreieck, Dreieck, Kreis. Wiederhole dieses Grundmuster zweimal."
					: "Erfinde ein Grundmuster aus vier markierten quadratischen Fliesen und wiederhole es dreimal. Verwende mindestens zwei verschiedene Markierungen.",
			{ ...grid(columns, rows, [], "tiles"), dimensions: [4] },
			target,
			"Ein Klick wechselt die Markierung. Jede Fliese ist ein gleich großes Quadrat; wiederhole das ganze Grundmuster.",
			"Die Fliesen füllen das Gitter ohne Lücken. Das vorgegebene oder selbst gewählte Grundmuster wiederholt sich vollständig.",
			{ max: 3, property: index === 2 ? "ornament" : undefined },
		);
	}
	const target = Array.from({ length: 20 }, (_, i) =>
		Number(i % 5 < [3, 4, 2, 3][Math.floor(i / 5)]),
	);
	if (index === 1) return shapeTask(id, 1, 391, 1);
	if (index === 2) return shapeTask(id, 1, 512, 2);
	return model(
		goal,
		"Lege auf jedes markierte Feld der Figur ein Einheitsplättchen. Außerhalb bleibt der Rahmen leer.",
		{ ...grid(5, 4, [], "surface"), source: target },
		target,
		"Zähle und bedecke die Felder Reihe für Reihe. Ein Plättchen bedeckt genau ein Feld.",
		"Die Figur ist lückenlos und ohne Überlappung ausgelegt; 12 gleich große Plättchen bedecken sie.",
	);
}

function repeatUnit(a: number[]): number[] {
	for (let n = 1; n <= a.length; n++)
		if (a.length % n === 0 && a.every((v, i) => v === a[i % n]))
			return a.slice(0, n);
	return a;
}
export function shapeFamily(
	task: ForestTask,
	answer?: number | number[] | null,
): (string | number)[] {
	const a = task.investigation?.identity;
	if (a) {
		if (a[0] === "map")
			return [
				Number(a[5]) ? "map-distance" : "map-movement",
				a[1],
				a[2],
				Number(a[1]) + Number(a[3]),
				Number(a[2]) + Number(a[4]),
				...(Number(a[5]) ? [a[5]] : []),
			];
		if (a[0] === "building")
			return ["building", a[a.length - 3], ...a.slice(1, -3)];
		if (a[0] === "drawing")
			return a[1] === 3 ? ["circle-opening", a[4]] : ["rectangle", a[2], a[3]];
		if (a[0] === "cube-net") return a.slice(0, 2);
		if (a[0] === "cuboid-net") return a;
		if (a[0] === "reflection") {
			const goal = Number(a[27]),
				p = Number(a[28]);
			return goal === 3
				? a.slice(0, 27)
				: ["reflection-point", a[1], p % 5, Math.floor(p / 5)];
		}
		if (a[0] === "scale") {
			const factor = Number(a[3]),
				r = a[4] === "reduce";
			return [
				"scale",
				a[1],
				a[2],
				Number(a[1]) * (r ? 1 / factor : factor),
				Number(a[2]) * (r ? 1 / factor : factor),
			];
		}
		if (a[0] === "ornament")
			return ["ornament", ...repeatUnit(a.slice(1, -3).map(Number))];
		if (a[0] === "surface") return a.slice(0, 6);
		if (a[0] === "volume") return a.slice(0, 4);
		return a;
	}
	const m = task.model,
		g = m?.scene.geometry;
	if (!m || !g) return [task.prompt];
	const cells = m.property && Array.isArray(answer) ? answer : m.target;
	if (g.kind === "map") {
		const start = (g.source ?? []).findIndex(Boolean),
			end = cells.findIndex(Boolean);
		return [
			"map-movement",
			start % g.columns,
			Math.floor(start / g.columns),
			end % g.columns,
			Math.floor(end / g.columns),
		];
	}
	if (g.kind === "building") return ["building", g.columns, ...cells];
	if (g.kind === "volume" && cells.every((n) => n === cells[0]))
		return ["volume", g.columns, g.rows, cells[0]];
	if (g.kind === "net")
		return [
			"cube-net",
			polyKey(
				cells.flatMap((n, i) =>
					n
						? [[i % g.columns, Math.floor(i / g.columns)] as [number, number]]
						: [],
				),
			),
		];
	if (g.kind === "mirror")
		return ["reflection", g.axis ?? "vertical", ...(g.source ?? [])];
	if (g.kind === "scale") {
		const bounds = (c: number[]) => {
			const points = c.flatMap((n, i) =>
				n ? [[i % g.columns, Math.floor(i / g.columns)]] : [],
			);
			return [
				Math.max(...points.map((p) => p[0])) -
					Math.min(...points.map((p) => p[0])),
				Math.max(...points.map((p) => p[1])) -
					Math.min(...points.map((p) => p[1])),
			];
		};
		return ["scale", ...bounds(g.source ?? []), ...bounds(cells)];
	}
	if (g.kind === "tiles" && (m.property === "ornament" || g.columns === 4))
		return [
			"ornament",
			...repeatUnit(cells.slice(0, g.dimensions?.[0] ?? g.columns)),
		];
	return [g.kind, g.columns, g.rows, ...cells];
}
const SHAPE_TEACHING_FAMILIES: (string | number)[][] = [
	["reflection-point", "vertical", 1, 0],
	["reflection-point", "horizontal", 1, 0],
	["map-movement", 0, 1, 2, 2],
	["map-distance", 0, 1, 2, 2, 20],
	["building", 2, 1, 3, 2, 1],
	["rectangle", 5, 3],
	["circle-opening", 20],
	["cuboid-net", 2, 3, 4],
	["scale", 2, 3, 4, 6],
	["scale", 3, 2, 6, 4],
	["scale", 8, 4, 4, 2],
	["scale", 6, 4, 3, 2],
	["scale", 2, 4, 4, 8],
	["ornament", 1, 2, 2, 1],
	["ornament", 1, 2, 2],
	["volume", 3, 2, 3],
];
export function shapeExit(
	id: ShapeId,
	seed: number,
	index: number,
): ForestTask {
	const reserved = new Set(
		[
			...SHAPE_TEACHING_FAMILIES,
			...[0, 1, 2].flatMap((i) =>
				expandShapeFamily(shapeFamily(shapeLab(id, i))),
			),
		].map((a) => JSON.stringify(a)),
	);
	for (let n = 0; n < 1000; n++) {
		const task = shapeTask(
			id,
			2,
			((seed ^ 0xa54ff53a) + Math.imul(n, 1640531527)) >>> 0,
			index,
		);
		if (!reserved.has(JSON.stringify(shapeFamily(task)))) return task;
	}
	throw new Error("No fresh geometry exit");
}

export function expandShapeFamily(
	family: (string | number)[],
): (string | number)[][] {
	if (
		family[0] !== "reflection" ||
		family.length !== 27 ||
		!["vertical", "horizontal"].includes(String(family[1])) ||
		!family.slice(2).every((n) => n === 0 || n === 1)
	)
		return [family];
	return [
		family,
		...family
			.slice(2)
			.flatMap((n, i) =>
				n ? [["reflection-point", family[1], i % 5, Math.floor(i / 5)]] : [],
			),
	];
}
