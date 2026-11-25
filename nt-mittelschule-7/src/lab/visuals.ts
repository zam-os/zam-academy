import { livingDiagrams } from "./living-diagrams";
import { physicsDiagrams } from "./physics-diagrams";
import {
	AIR_GASES,
	ALTITUDES,
	ELEMENT_EXAMPLES,
	ELEMENTS,
	ISOTOPES,
	MOLECULES,
	magnesiumEquation,
	shells,
} from "../chemistry/models";
import type { LabKind, LabValues } from "../model/types";
import { INSPECTIONS } from "./definitions";
import {
	arrow,
	circle,
	line,
	open,
	path,
	polygon,
	rect,
	text,
	type LabView,
} from "./svg";

function title(x: number, y: number, label: string) {
	return text(x, y, label, "diagram-title", "middle");
}

function caption(x: number, y: number, label: string) {
	return text(x, y, label, "diagram-caption", "middle");
}

function atom(x: number, y: number, label: string) {
	const hue =
		(
			{
				O: "oxygen",
				N: "nitrogen",
				C: "carbon",
				H: "hydrogen",
				S: "sulfur",
				Mg: "metal",
			} as Record<string, string>
		)[label] ?? "argon";
	return (
		circle(x, y, 24, "diagram-particle " + hue) +
		text(x, y + 5, label, "diagram-particle-label", "middle")
	);
}

function molecule(labels: readonly string[], x: number, y: number) {
	const bent = labels.length === 3 && (labels[1] === "O" || labels[1] === "S");
	return labels
		.map((label, index) =>
			atom(
				x + 39 * (index - (labels.length - 1) / 2),
				bent && index === 1 ? y - 26 : y,
				label,
			),
		)
		.join("");
}

function frame(label: string, content: string) {
	return open(label) + content + "</svg>";
}

function air(v: LabValues) {
	const cells = Array.from({ length: 100 }, (_, i) => {
		const kind = i < 78 ? 0 : i < 99 ? 1 : 2;
		const selected = !v.gas || v.gas === kind + 1;
		return rect(
			44 + (i % 10) * 23,
			61 + Math.floor(i / 10) * 23,
			19,
			19,
			"diagram-particle " + AIR_GASES[kind].color + (selected ? "" : " faded"),
			'rx="4"',
		);
	}).join("");
	const key = AIR_GASES.map(
		(gas, i) =>
			circle(314, 104 + i * 57, 9, "diagram-particle " + gas.color) +
			text(
				332,
				110 + i * 57,
				gas.formula + " · " + gas.share + " %",
				"diagram-title",
			),
	).join("");
	return frame(
		"100 Felder für trockene Luft. 78 Stickstoff, 21 Sauerstoff und ein Restfeld.",
		title(260, 33, "100 Volumenteile trockener Luft") + cells + key,
	);
}

function pressure(v: LabValues) {
	const site = ALTITUDES[Math.max(0, v.height - 1)];
	const y = [238, 175, 110][Math.max(0, v.height - 1)];
	const parcel = Array.from(
		{ length: Math.round(site.pressure / 45) },
		(_, i) =>
			circle(
				321 + ((i * 37) % 145),
				113 + ((i * 43) % 90),
				4,
				"diagram-particle nitrogen",
			),
	).join("");
	return frame(
		site.name + " bei " + site.height + " m: " + site.pressure + " hPa.",
		polygon(
			[
				{ x: 20, y: 278 },
				{ x: 132, y: 98 },
				{ x: 246, y: 278 },
			],
			"diagram-land",
		) +
			line(92, y, 241, y, "diagram-line") +
			circle(137, y, 7, "diagram-particle oxygen") +
			title(136, 305, site.name) +
			rect(299, 85, 189, 151, "diagram-box", 'rx="12"') +
			parcel +
			title(394, 262, site.pressure + " hPa") +
			caption(394, 285, "Gleich großes Luftvolumen"),
	);
}

function fire(v: LabValues) {
	const active = v.fuel && v.air && v.heat;
	return frame(
		"Feuerdreieck. " +
			(active
				? "Alle Bedingungen erfüllt."
				: "Mindestens eine Bedingung fehlt."),
		polygon(
			[
				{ x: 260, y: 60 },
				{ x: 438, y: 242 },
				{ x: 82, y: 242 },
			],
			"diagram-wire",
		) +
			[
				[260, 62, "Wärme", v.heat],
				[435, 240, "Sauerstoff", v.air],
				[85, 240, "Brennstoff", v.fuel],
			]
				.map(
					([x, y, label, on]) =>
						circle(
							Number(x),
							Number(y),
							25,
							"diagram-particle " + (on ? "green" : "pale"),
						) +
						text(
							Number(x),
							Number(y) + 6,
							on ? "✓" : "×",
							"diagram-particle-label",
							"middle",
						) +
						caption(Number(x), Number(y) + 45, String(label)),
				)
				.join("") +
			title(260, 177, active ? "Feuer möglich" : "Bedingung fehlt"),
	);
}

function oxidation(v: LabValues) {
	const element = ["Mg", "C", "S"][v.reaction];
	const names = ["Magnesium", "Kohlenstoff", "Schwefel"];
	const products = ["Magnesiumoxid", "Kohlenstoffdioxid", "Schwefeldioxid"];
	const groups = v.step
		? v.reaction === 0
			? [
					["Mg", "O"],
					["Mg", "O"],
				]
			: [["O", element, "O"]]
		: v.reaction === 0
			? [["Mg"], ["Mg"], ["O", "O"]]
			: [[element], ["O", "O"]];
	const label = v.step
		? products[v.reaction]
		: names[v.reaction] + " + Sauerstoff";
	return frame(
		label + ". Die Zeichnung zeigt die Verteilung der Atome.",
		title(260, 65, v.step ? "Produkt" : "Ausgangsstoffe") +
			groups
				.map((group, i) =>
					molecule(group, ((i + 1) * 520) / (groups.length + 1), 165),
				)
				.join("") +
			title(260, 256, label) +
			caption(260, 283, "Die Anzahl jeder Atomsorte bleibt gleich."),
	);
}

function rust(v: LabValues) {
	const rusted = v.water && !v.oxygen && !v.coat;
	const surface = rusted
		? "Rostschicht"
		: v.coat
			? "Intakter Lack"
			: "Blankes Eisen";
	return frame(
		surface + " nach derselben Zeit.",
		title(260, 68, surface) +
			rect(96, 154, 310, 28, "diagram-nail", 'rx="8"') +
			rect(96, 128, 24, 80, "diagram-nail", 'rx="4"') +
			polygon(
				[
					{ x: 399, y: 153 },
					{ x: 441, y: 168 },
					{ x: 399, y: 183 },
				],
				"diagram-nail",
			) +
			(rusted
				? [126, 171, 194, 261, 282, 346]
						.map((x, i) =>
							circle(
								x,
								167 + (i % 3) * 4,
								8 + (i % 4),
								"diagram-particle rust",
							),
						)
						.join("")
				: v.coat
					? rect(119, 150, 284, 36, "diagram-coat", 'rx="7"')
					: "") +
			caption(
				260,
				263,
				(v.water ? "feucht" : "trocken") +
					" · " +
					(v.oxygen ? "ohne Sauerstoff" : "mit Sauerstoff"),
			),
	);
}

function equation(v: LabValues) {
	const { left, right, balanced } = magnesiumEquation(v.mg, v.oxygen, v.oxide);
	const columns = [
		[126, left.mg, left.o, v.mg + " Mg + " + v.oxygen + " O₂"],
		[394, right.mg, right.o, v.oxide + " MgO"],
	] as const;
	const count = (x: number, y: number, n: number, color: string) =>
		Array.from({ length: n }, (_, i) =>
			circle(x + 25 * i, y, 9, "diagram-particle " + color),
		).join("");
	return frame(
		"Links " +
			left.mg +
			" Magnesium und " +
			left.o +
			" Sauerstoff. Rechts " +
			right.mg +
			" Magnesium und " +
			right.o +
			" Sauerstoff.",
		columns
			.map(
				([x, mg, o, formula]) =>
					title(x, 74, formula) +
					caption(x - 83, 133, "Mg") +
					count(x - 50, 127, mg, "metal") +
					caption(x - 83, 197, "O") +
					count(x - 50, 191, o, "oxygen"),
			)
			.join("") +
			arrow(228, 66, 290, 66, "diagram-line") +
			title(
				260,
				267,
				balanced ? "Beide Atomsorten ausgeglichen" : "Zähle Mg und O getrennt",
			),
	);
}

function atomScale(v: LabValues) {
	if (v.zoom === 1) {
		return frame(
			"Bei einem etwa 100 m breiten Atom wäre der Kern in diesem Beispiel etwa 1 mm breit.",
			title(260, 68, "Gedachter Maßstabsvergleich") +
				line(62, 134, 455, 134, "diagram-line") +
				caption(260, 163, "Atomdurchmesser ≈ 100 m") +
				caption(
					260,
					235,
					"Kerndurchmesser ≈ 1 mm · hier kleiner als ein Pixel",
				) +
				caption(260, 280, "Größenordnung · je nach Atom und Kern verschieden"),
		);
	}
	if (v.zoom === 2) {
		return frame(
			"Vergrößerung eines Helium-4-Kerns aus zwei Protonen und zwei Neutronen.",
			title(260, 63, "Kern von Helium–4") +
				molecule(["p⁺", "n"], 260, 135) +
				molecule(["n", "p⁺"], 260, 175) +
				caption(260, 251, "p⁺ Proton · n Neutron"),
		);
	}
	return frame(
		"Das Kern-Hülle-Modell zeigt einen kleinen Kern und eine große Elektronenhülle.",
		circle(260, 157, 108, "diagram-shell") +
			circle(260, 157, 15, "diagram-particle oxygen") +
			line(260, 157, 384, 157, "diagram-line") +
			caption(424, 162, "Kern") +
			caption(260, 295, "Elektronenhülle · Kern stark vergrößert"),
	);
}

function isotopes(v: LabValues) {
	const { name, z, a } = ISOTOPES[v.isotope];
	return frame(
		name +
			" mit " +
			z +
			" Protonen, " +
			(a - z) +
			" Neutronen und " +
			z +
			" Elektronen.",
		title(260, 52, name + "–" + a + "   ·   Z = " + z + "   ·   A = " + a) +
			[
				["Protonen", z, "oxygen"],
				["Neutronen", a - z, "metal"],
				["Elektronen", z, "nitrogen"],
			]
				.map(([label, n, hue], row) => {
					const y = 113 + row * 69;
					return (
						text(25, y + 5, String(label), "diagram-caption") +
						Array.from({ length: Number(n) }, (_, i) =>
							circle(153 + 24 * i, y, 8, "diagram-particle " + hue),
						).join("") +
						title(491, y + 5, String(n))
					);
				})
				.join("") +
			caption(260, 315, "A = Protonen + Neutronen"),
	);
}

function periodic(v: LabValues) {
	const selected = v.element ? ELEMENT_EXAMPLES[v.element - 1].z : 0;
	const groups = [1, 2, 13, 14, 15, 16, 17, 18];
	const xFor = (group: number) =>
		63 + groups.indexOf(group) * 53 + (group >= 13 ? 16 : 0);
	const tiles = ELEMENTS.map(([symbol, , period, group], i) => {
		const x = xFor(group);
		const y = 85 + (period - 1) * 59;
		return (
			rect(
				x,
				y,
				47,
				51,
				"diagram-box" + (i + 1 === selected ? " selected" : ""),
				'rx="6"',
			) +
			caption(x + 23, y + 16, String(i + 1)) +
			title(x + 23, y + 38, symbol)
		);
	}).join("");
	return frame(
		selected
			? ELEMENTS[selected - 1][1] + " ist im Ausschnitt markiert."
			: "Ausschnitt der ersten drei Perioden und acht Hauptgruppen.",
		title(260, 35, "Gruppen") +
			groups.map((g) => caption(xFor(g) + 23, 71, String(g))).join("") +
			[1, 2, 3]
				.map((n) => caption(28, 115 + (n - 1) * 59, String(n)))
				.join("") +
			tiles +
			caption(260, 291, "Perioden = Zeilen · Gruppen = Spalten"),
	);
}

function energyLevels(v: LabValues) {
	const counts = shells(v.z);
	const rings = counts
		.map((count, i) => {
			const radius = 37 + i * 36;
			return (
				circle(174, 171, radius, "diagram-wire") +
				Array.from({ length: count }, (_, j) => {
					const angle = (Math.PI * 2 * j) / count - Math.PI / 2;
					return circle(
						174 + radius * Math.cos(angle),
						171 + radius * Math.sin(angle),
						7,
						"diagram-particle nitrogen",
					);
				}).join("")
			);
		})
		.join("");
	return frame(
		ELEMENTS[v.z - 1][1] +
			", Elektronen von innen nach außen: " +
			counts.join(", "),
		rings +
			circle(174, 171, 15, "diagram-particle oxygen") +
			title(370, 106, ELEMENTS[v.z - 1][1]) +
			counts
				.map((n, i) =>
					caption(
						370,
						147 + 34 * i,
						"Schale " +
							(i + 1) +
							" · " +
							n +
							(n === 1 ? " Elektron" : " Elektronen"),
					),
				)
				.join("") +
			caption(260, 323, "Schalen stehen für Energiestufen."),
	);
}

type InspectionKind = keyof typeof INSPECTIONS;

function inspection(kind: InspectionKind, v: LabValues) {
	const rows = INSPECTIONS[kind];
	const chosen = rows[v.view];
	let detail = "";
	if (kind === "history" && v.view === 3) {
		detail =
			[128, 148, 168, 188]
				.map((y, i) =>
					arrow(80, y, 442, y + (i === 2 ? -53 : 0), "diagram-line"),
				)
				.join("") + circle(266, 169, 10, "diagram-particle oxygen");
	} else if (kind === "history" && v.view > 0) {
		detail = [172, 260, 348]
			.map((x, i) =>
				circle(
					x,
					161,
					v.view === 2 && i === 1 ? 36 : 25,
					"diagram-particle " + (i === 1 ? "metal" : "nitrogen"),
				),
			)
			.join("");
	} else if (kind === "evidence" && v.view === 1) {
		detail = AIR_GASES.map(
			(gas, i) =>
				rect(
					129,
					97 + i * 42,
					gas.share * 3,
					20,
					"diagram-particle " + gas.color,
					'rx="3"',
				) +
				text(
					134 + gas.share * 3,
					113 + i * 42,
					gas.share + " %",
					"diagram-caption",
				),
		).join("");
	} else if (kind === "evidence" && v.view === 2) {
		detail =
			molecule(["N", "N"], 135, 151) +
			molecule(["O", "O"], 260, 151) +
			atom(380, 151, "Ar");
	} else if (kind === "investigation" && v.view > 0) {
		detail = [143, 371]
			.map(
				(x, i) =>
					rect(x - 83, 103, 166, 99, "diagram-box", 'rx="12"') +
					rect(x - 32, 140, 65, 12, "diagram-nail", 'rx="5"') +
					(i === 1 && v.view > 1
						? circle(x + 10, 146, 8, "diagram-particle rust")
						: "") +
					caption(x, 180, i === 0 ? "A · trocken" : "B · feucht"),
			)
			.join("");
	} else if (kind === "safety" && (v.view === 1 || v.view === 2)) {
		const diamond = polygon(
			[
				{ x: 260, y: 82 },
				{ x: 335, y: 157 },
				{ x: 260, y: 232 },
				{ x: 185, y: 157 },
			],
			"hazard-diamond",
		);
		const symbol =
			v.view === 1
				? path(
						"M261 203 C233 203 226 186 230 172 C233 161 240 154 241 145 Q252 149 252 161 Q265 143 258 120 Q291 142 290 176 Q288 202 261 203 Z",
						"hazard-ink",
					)
				: path(
						"M213 178 H255 V187 H213 Z M270 185 L296 174 L312 182 L289 192 H270 Z M216 133 L242 145 L238 152 L212 139 Z M265 123 L293 136 L289 143 L261 129 Z M241 153 L246 164 H237 Z M291 149 L296 161 H286 Z",
						"hazard-ink",
					);
		detail = diamond + symbol;
	} else if (kind === "respiration") {
		const stages = [
			[110, "Traubenzucker", "Sauerstoff"],
			[260, "Körperzelle", "Stoffumwandlung"],
			[410, "Kohlenstoffdioxid", "Wasser"],
		] as const;
		detail =
			stages
				.map(
					([x, a, b], i) =>
						rect(
							x - 63,
							105,
							126,
							77,
							"diagram-box" +
								(i === (v.view === 0 ? 0 : v.view === 1 ? 2 : 1)
									? " selected"
									: ""),
							'rx="10"',
						) +
						caption(x, 136, a) +
						caption(x, 163, b),
				)
				.join("") +
			arrow(173, 144, 196, 144, "diagram-line") +
			arrow(323, 144, 346, 144, "diagram-line") +
			(v.view === 2
				? arrow(260, 183, 260, 216, "diagram-line") +
					caption(260, 240, "Energie für die Zelle und Wärme")
				: "");
	} else {
		detail = rows
			.map(([label], index) => {
				const y = 100 + 35 * index;
				return (
					circle(
						94,
						y - 3,
						8,
						"diagram-particle " + (index === v.view ? "green" : "pale"),
					) + text(114, y + 3, label, "diagram-title")
				);
			})
			.join("");
	}
	return frame(
		chosen[0] + ". " + chosen[1],
		title(260, 54, chosen[0]) + detail + caption(260, 282, chosen[2]),
	);
}

const diagrams: Record<LabKind, (values: LabValues) => string> = {
	...livingDiagrams,
	...physicsDiagrams,
	investigation: (v) => inspection("investigation", v),
	evidence: (v) => inspection("evidence", v),
	safety: (v) => inspection("safety", v),
	air,
	pressure,
	molecule: (v) => {
		const m = MOLECULES[v.molecule];
		return frame(
			m.name + ": " + m.atoms.join(", "),
			title(260, 72, m.name) +
				molecule(m.atoms, 260, 166) +
				title(260, 262, m.formula),
		);
	},
	fire,
	protection: (v) => inspection("protection", v),
	oxidation,
	rust,
	equation,
	history: (v) => inspection("history", v),
	atom: atomScale,
	isotopes,
	periodic,
	shells: energyLevels,
	respiration: (v) => inspection("respiration", v),
};

export function labView(kind: LabKind): LabView {
	return { render: diagrams[kind] };
}
