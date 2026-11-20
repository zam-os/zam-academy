import type { LabValues } from "../model/types";
import {
	activityAt,
	airway,
	animals,
	blood,
	healthChoices,
	movementAt,
	routes,
} from "./living-models";
import { arrow, circle, line, open, path, rect, text } from "./svg";

export const title = (x: number, y: number, label: string) =>
	text(x, y, label, "diagram-title", "middle");
export const label = (x: number, y: number, caption: string) =>
	text(x, y, caption, "diagram-caption", "middle");
export const frame = (description: string, figure: string) =>
	open(description) + figure + "</svg>";

const silhouettes = [
	"M126 164 Q196 86 323 153 L396 111 L384 163 L396 216 L324 178 Q205 230 126 172Z M205 183 L246 231 L269 187 M238 131 L265 91 L305 151",
	"M174 172 Q158 132 196 129 Q215 106 251 132 Q295 128 317 159 Q349 151 372 178 L396 206 L371 204 L349 186 L310 199 Q273 230 222 201 L185 213 L154 202 L193 189Z M203 195 L188 221 L163 222",
	"M120 161 Q159 135 194 155 L220 160 Q270 135 302 158 Q351 181 430 171 Q399 192 347 193 L299 178 Q276 190 233 183 L216 211 L184 219 L203 198 L202 175 L175 171 L161 196 L133 198 L150 181 L157 173Z",
	"M117 108 Q189 108 243 150 Q252 135 268 145 L285 153 L306 151 L286 165 Q275 181 252 188 L236 220 L229 206 L204 223 L217 178 Q161 153 117 108Z M263 150 Q319 89 403 104 Q359 133 311 160 L280 178",
	"M112 122 Q168 124 215 155 L239 167 L244 144 L257 156 L268 145 L273 165 Q323 126 406 122 Q386 147 376 184 Q349 168 337 203 Q313 187 297 215 Q277 194 259 224 Q240 199 220 216 Q204 188 181 203 Q168 169 144 183 Q130 146 112 122Z",
];

function animalFigure(v: LabValues, moving: boolean) {
	const animal = animals[v.animal];
	const medium = ["Land", "Wasser", "Luft"][v.medium ?? 0];
	const compatible = [
		v.medium === 1,
		v.medium < 2,
		v.medium === 0,
		v.medium === 2,
		v.medium === 2,
	][v.animal];
	const y = moving ? 245 : 262;
	return frame(
		animal.name +
			". " +
			(moving
				? movementAt(v)
				: animal.group + ", " + animal.cover + ", " + animal.trait),
		title(260, 54, animal.name) +
			(moving
				? rect(
						93,
						79,
						334,
						162,
						"field-medium " +
							["field-land", "field-water", "field-sky"][v.medium],
						'rx="14"',
					)
				: "") +
			path(silhouettes[v.animal], "field-animal animal-" + v.animal) +
			(moving && compatible
				? arrow(177, 231, 133, 231, "field-force") +
					arrow(333, 231, 284, 231, "field-force")
				: "") +
			label(
				260,
				y,
				moving
					? medium +
							(compatible
								? " · passende Fortbewegung"
								: " · hier nicht angepasst")
					: animal.trait,
			) +
			(!moving ? label(260, 290, animal.group + " · " + animal.cover) : ""),
	);
}

const bronchialTree =
	"M260 88 V152 M260 152 L204 187 L161 222 M204 187 L216 222 M260 152 L316 187 L359 222 M316 187 L302 222";
const lungShape =
	"M242 123 Q196 112 160 152 Q130 184 137 234 Q140 271 194 260 Q221 252 239 228Z M278 123 Q324 112 360 152 Q390 184 383 234 Q380 271 326 260 Q299 252 281 228Z";

function airwayFigure(v: LabValues) {
	const highlights = [
		"M205 75 H247 L260 86",
		"M260 88 V152",
		"M260 152 L204 187 L161 222 M204 187 L216 222 M260 152 L316 187 L359 222 M316 187 L302 222",
		"",
	];
	return frame(
		airway[v.step].join(". "),
		title(260, 35, airway[v.step][0]) +
			path(lungShape, "field-organ") +
			path("M205 75 H247 L260 86", "field-airway") +
			path(bronchialTree, "field-airway") +
			path(highlights[v.step], "field-current-path") +
			[156, 216, 304, 364]
				.map((x, i) =>
					circle(
						x,
						229,
						11,
						"field-alveolus" + (v.step === 3 && i >= 2 ? " lit" : ""),
					),
				)
				.join("") +
			label(260, 301, "Nase/Mund → Luftröhre → Atemwege → Lungenbläschen"),
	);
}

function ventilation(v: LabValues) {
	const inhale = v.phase === 1,
		exhale = v.phase === 2;
	const edge = inhale ? 107 : exhale ? 151 : 131;
	const top = inhale ? 99 : exhale ? 136 : 120;
	const y = inhale ? 259 : exhale ? 233 : 246;
	const chest =
		"M" +
		edge +
		" " +
		(top + 86) +
		" Q" +
		edge +
		" " +
		top +
		" 260 " +
		top +
		" Q" +
		(520 - edge) +
		" " +
		top +
		" " +
		(520 - edge) +
		" " +
		(top + 86);
	const lungs =
		'<g transform="translate(260,202) scale(' +
		(inhale ? 1.12 : exhale ? 0.8 : 1) +
		') translate(-260,-202)">' +
		path(lungShape, "field-organ") +
		"</g>";
	return frame(
		"Schema der Atembewegung mit Rippen, Lunge und Zwerchfell.",
		title(260, 47, ["Atempause", "Einatmen", "Ausatmen"][v.phase]) +
			lungs +
			path(chest, "field-airway") +
			line(260, 77, 260, 164, "field-airway") +
			path(
				"M" +
					edge +
					" " +
					y +
					" Q260 " +
					(inhale ? 259 : exhale ? 165 : 202) +
					" " +
					(520 - edge) +
					" " +
					y,
				"field-muscle",
			) +
			(v.phase
				? arrow(260, inhale ? 66 : 135, 260, inhale ? 141 : 65, "field-force")
				: "") +
			label(260, 304, "Zwerchfell · Rippen bilden den Brustraum"),
	);
}

function exchange(v: LabValues) {
	const oxygen = v.gas === 1;
	return frame(
		[
			"Lungenbläschen oberhalb der Kapillare.",
			"Sauerstoff geht ins Blut.",
			"Kohlenstoffdioxid geht in die Luft.",
		][v.gas],
		title(260, 37, "Dünne Trennwand") +
			rect(83, 70, 354, 102, "field-organ", 'rx="42"') +
			rect(83, 190, 354, 90, "field-capillary", 'rx="35"') +
			text(
				260,
				102,
				"Luft im Lungenbläschen",
				"diagram-caption field-on-pink",
				"middle",
			) +
			text(
				260,
				256,
				"Blut in der Kapillare",
				"diagram-caption field-on-pink",
				"middle",
			) +
			line(98, 181, 422, 181, "diagram-line") +
			(v.gas
				? arrow(
						260,
						oxygen ? 130 : 221,
						260,
						oxygen ? 221 : 130,
						oxygen ? "field-oxygen" : "field-carbon",
					) + title(312, 186, oxygen ? "O₂" : "CO₂")
				: ""),
	);
}

function bloodFigure(v: LabValues) {
	const component = (index: number, content: string) =>
		'<g class="' +
		(v.part !== index ? "field-muted" : "") +
		'">' +
		content +
		"</g>";
	return frame(
		blood[v.part].join(". "),
		title(260, 43, blood[v.part][0]) +
			rect(65, 77, 390, 202, "field-plasma", 'rx="26"') +
			component(
				1,
				[
					[134, 138],
					[190, 210],
					[343, 212],
					[369, 132],
				]
					.map(
						([x, y]) =>
							'<ellipse cx="' +
							x +
							'" cy="' +
							y +
							'" rx="26" ry="18" class="field-red-cell"/>' +
							circle(x, y, 9, "field-red-center"),
					)
					.join(""),
			) +
			component(
				2,
				circle(264, 147, 36, "field-white-cell") +
					circle(256, 145, 14, "field-nucleus") +
					circle(278, 154, 11, "field-nucleus"),
			) +
			component(
				3,
				[260, 280, 303]
					.map((x, i) => circle(x, 222 + 9 * (i % 2), 7, "field-platelet"))
					.join(""),
			) +
			label(260, 310, "Formen und Farben sind schematisch."),
	);
}

function circulation(v: LabValues) {
	const positions = [
		[165, 172],
		[260, 89],
		[355, 172],
		[260, 260],
	] as const;
	return frame(
		routes[v.station].join(". "),
		title(260, 43, "Lunge") +
			title(260, 319, "Körper") +
			arrow(165, 159, 245, 100, "field-carbon", 6) +
			arrow(275, 100, 355, 159, "field-oxygen", 6) +
			arrow(355, 184, 276, 248, "field-oxygen", 6) +
			arrow(244, 248, 165, 184, "field-carbon", 6) +
			positions
				.map(([x, y], i) =>
					circle(
						x,
						y,
						i === v.station ? 19 : 10,
						i === v.station ? "field-position selected" : "field-position",
					),
				)
				.join("") +
			label(108, 211, "rechts") +
			label(412, 211, "links") +
			label(260, 174, "Herz"),
	);
}

function pump(v: LabValues) {
	const filled = v.beat === 1,
		out = v.beat === 2;
	const chamber = filled
		? "M200 169 Q260 129 320 169 L305 233 Q260 275 215 233Z"
		: "M215 175 Q260 148 305 175 L290 229 Q260 252 230 229Z";
	return frame(
		"Pumpmodell. " +
			(filled
				? "Einlass offen."
				: out
					? "Auslass offen."
					: "Vorhof, Kammer und Arterie."),
		rect(81, 103, 111, 67, "field-organ", 'rx="22"') +
			path(chamber, "field-heart") +
			path("M311 174 L374 147 V80", "field-airway") +
			line(193, 151, 209, 173, filled ? "field-force" : "field-valve") +
			line(
				314,
				175,
				312,
				out ? 148 : 191,
				out ? "field-force" : "field-valve",
			) +
			(filled
				? arrow(146, 142, 242, 196, "field-force")
				: out
					? arrow(277, 211, 371, 126, "field-force")
					: "") +
			title(130, 75, "Vorhof") +
			title(259, 290, "Kammer") +
			title(406, 65, "Arterie") +
			label(260, 315, "Klappen begrenzen die Flussrichtung."),
	);
}

function health(v: LabValues) {
	const heading = [
		"Herz und Gefäße",
		"Bewegung",
		"Rauch",
		"Salzreiche Ernährung",
	][v.case];
	const effect = [
		"Alltag vergleichen",
		"Ausdauer kann steigen",
		"Gefäßrisiko steigt",
		"Blutdruck kann steigen",
	][v.case];
	return frame(
		healthChoices[v.case].join(". "),
		title(260, 58, heading) +
			rect(91, 116, 338, 125, "diagram-box", 'rx="18"') +
			path(
				"M109 175 H173 L188 156 L206 195 L229 133 L252 193 L267 175 H412",
				v.case > 1 ? "field-carbon" : "field-force",
			) +
			label(260, 275, effect),
	);
}

function load(v: LabValues) {
	const { activity, pulse, breath } = activityAt(v);
	return frame(
		activity +
			": " +
			pulse +
			" Herzschläge und " +
			breath +
			" Atemzüge pro Minute.",
		title(260, 52, activity) +
			label(260, 90, "Herzschläge pro Minute · Skala bis 180") +
			rect(74, 107, 360, 35, "diagram-box", 'rx="7"') +
			rect(74, 107, pulse * 2, 35, "field-capillary", 'rx="7"') +
			title(462, 133, String(pulse)) +
			label(260, 196, "Atemzüge pro Minute · Skala bis 45") +
			rect(74, 211, 360, 35, "diagram-box", 'rx="7"') +
			rect(74, 211, breath * 8, 35, "field-air-bar", 'rx="7"') +
			title(462, 237, String(breath)) +
			label(260, 294, "Beispielwerte · vergleiche jede Skala für sich"),
	);
}

export const livingDiagrams = {
	animals: (v: LabValues) => animalFigure(v, false),
	locomotion: (v: LabValues) => animalFigure(v, true),
	airway: airwayFigure,
	ventilation,
	exchange,
	blood: bloodFigure,
	circulation,
	pump,
	health,
	load,
};
