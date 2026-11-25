import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { frame, label, title } from "./living-diagrams";
import {
	branchCurrents,
	circuitClosed,
	effects,
	electricalCases,
	exampleWire,
	ohmicResistance,
	sites,
} from "./physics-models";
import { arrow, circle, line, path, polygon, rect } from "./svg";

function wind(v: LabValues) {
	const wheel = [0, 24, 48][v.wind];
	return frame(
		"Windkraftanlage mit Rotor, Generator und Netzanschluss.",
		path("M102 139 L89 271 H143 L129 139Z", "field-machine") +
			rect(101, 110, 83, 42, "field-machine", 'rx="10"') +
			'<g transform="rotate(' +
			wheel +
			' 110 128)">' +
			[0, 120, 240]
				.map(
					(angle) =>
						'<g transform="rotate(' +
						angle +
						' 110 128)">' +
						path("M107 129 Q93 82 107 52 Q119 66 117 128Z", "field-blade") +
						"</g>",
				)
				.join("") +
			"</g>" +
			circle(110, 128, 12, "field-position") +
			(v.wind
				? arrow(34, 157, 75, 157, "field-force") +
					arrow(161, 91, 192, 91, "field-force")
				: "") +
			arrow(
				186,
				133,
				297,
				133,
				v.wind && v.grid ? "field-power" : "field-muted-line",
			) +
			path(
				"M343 211 L368 119 L393 211 M352 174 H384 M359 146 H377 M368 118 V100 M388 145 H428 M388 170 H428",
				"field-wire",
			) +
			title(115, 298, "Rotor") +
			label(226, 113, "Generator") +
			title(382, 261, "Stromnetz") +
			label(
				260,
				323,
				v.wind && v.grid
					? "Bewegungsenergie → elektrische Energie"
					: "Im Modell keine Abgabe ans Netz",
			),
	);
}

function windSite(v: LabValues) {
	const site = sites[v.site];
	const shapes = [
		"M47 222 H471",
		"M42 244 L111 173 L133 108 H389 L471 240",
		"M42 242 L146 195 H470",
		"M42 136 L139 220 H345 L470 133",
	];
	return frame(
		site.name + ". Windstufe " + site.wind + " von 5.",
		title(260, 47, site.name) +
			path(shapes[v.site] + " V265 H42Z", "field-land") +
			Array.from({ length: 5 }, (_, i) =>
				circle(
					190 + 35 * i,
					83,
					10,
					i < site.wind ? "field-position selected" : "field-position",
				),
			).join("") +
			(v.site === 1
				? path(
						"M214 148 q12 -14 24 0 q12 -14 24 0 M253 167 q10 -12 20 0 q10 -12 20 0",
						"field-wire",
					)
				: "") +
			(v.site === 2 || v.site === 3
				? path(
						"M236 231 V203 H274 V231 M222 205 L255 178 L288 205Z M315 228 V203 H367 V227",
						"field-machine",
					)
				: "") +
			label(
				260,
				298,
				v.site
					? "Wind: " +
							site.wind +
							" von 5 · Beispiel, keine Standortentscheidung"
					: "Wind · Wege · Natur · Menschen",
			),
	);
}

function effect(v: LabValues) {
	const symbols = [
		"",
		"M278 104 Q229 120 248 169 L265 187 H292 L307 162 Q320 130 295 114Z M265 194 H295 M271 202 H289",
		"M225 171 L241 148 L258 171 L275 148 L292 171 L309 148 L326 171",
		"M240 161 A38 38 0 1 1 275 202 M264 191 L275 202 L287 190",
		"M245 134 H312 V186 H245Z M312 148 H323 V173 H312 M254 159 H271 M262 151 V167 M286 159 H303",
	];
	return frame(
		effects[v.effect].join(". "),
		title(260, 54, effects[v.effect][0]) +
			rect(88, 118, 91, 85, "diagram-box", 'rx="10"') +
			label(134, 155, "elektrische") +
			label(134, 177, "Energie") +
			arrow(184, 161, 219, 161, "field-power") +
			path(symbols[v.effect], "field-wire") +
			(v.effect ? arrow(330, 161, 366, 161, "field-power") : "") +
			label(
				424,
				166,
				["Umwandlung", "Licht/Wärme", "Wärme", "Bewegung", "chemisch"][
					v.effect
				],
			) +
			label(260, 285, "Ein Teil der Energie wird oft als Wärme abgegeben."),
	);
}

const wireClass = "field-wire";
function lamp(x: number, y: number, hot: boolean) {
	return (
		circle(x, y, 20, "field-lamp" + (hot ? " lit" : "")) +
		line(x - 13, y - 13, x + 13, y + 13, wireClass) +
		line(x + 13, y - 13, x - 13, y + 13, wireClass)
	);
}
function battery(x: number, y: number) {
	return (
		line(x - 6, y - 19, x - 6, y + 19, wireClass) +
		line(x + 6, y - 11, x + 6, y + 11, wireClass) +
		label(x - 23, y + 31, "+") +
		label(x + 24, y + 31, "−")
	);
}
function switchDiagram(x: number, y: number, closed: boolean) {
	return (
		circle(x - 24, y, 4, "field-position") +
		circle(x + 24, y, 4, "field-position") +
		line(x - 24, y, x + 24, closed ? y : y - 23, wireClass)
	);
}

function circuit(v: LabValues) {
	const on = circuitClosed(v);
	return frame(
		on
			? "Geschlossener Lampenstromkreis, die Lampe leuchtet."
			: "Der Lampenstromkreis ist unterbrochen.",
		title(260, 51, "Ein Strompfad") +
			path(
				"M109 168 V109 H183 M231 109 H380 V143 M380 183 V249 H264 M252 249 H109 V" +
					(v.fault ? 193 : 168),
				wireClass,
			) +
			switchDiagram(207, 109, !!v.sw) +
			lamp(380, 163, on) +
			battery(258, 249) +
			(on
				? arrow(129, 109, 162, 109, "field-power") +
					arrow(282, 109, 323, 109, "field-power")
				: "") +
			(v.fault ? label(130, 190, "Lücke") : "") +
			label(207, 85, "Schalter") +
			label(420, 172, "Lampe") +
			label(258, 310, "Spannungsquelle"),
	);
}

function meters(v: LabValues) {
	const kind = v.meter === 1 ? "A" : v.meter === 2 ? "V" : "?";
	const inSeries = v.placement === 1,
		inParallel = v.placement === 2;
	const meter = (x: number, y: number) =>
		circle(x, y, 19, "field-position selected") + title(x, y + 6, kind);
	return frame(
		"Messgerät " +
			kind +
			(inSeries ? " in Reihe." : inParallel ? " parallel zur Lampe." : "."),
		title(260, 43, "Messstelle an der Lampe") +
			path(
				inSeries
					? "M110 152 H314 M354 152 H380 V246 H266 M254 246 H110 V192"
					: "M110 152 H380 V246 H266 M254 246 H110 V192",
				wireClass,
			) +
			lamp(110, 172, !v.meter || !v.placement || v.meter === v.placement) +
			battery(260, 246) +
			(inSeries ? meter(334, 152) : "") +
			(inParallel
				? path("M110 152 V112 H167 V151 M167 191 V215 H110 V192", wireClass) +
					meter(167, 171)
				: "") +
			(!v.placement ? meter(261, 99) : "") +
			label(260, 304, "A misst Strom · V misst Spannung"),
	);
}

function parallel(v: LabValues) {
	const { left, right, total } = branchCurrents(v);
	const lineY = 95;
	const branch = (x: number, on: boolean) =>
		path(
			"M" + x + " 95 V153 M" + x + " 193 V213 M" + x + " 237 V250",
			wireClass,
		) +
		lamp(x, 173, on) +
		circle(x, 213, 3, "field-position") +
		circle(x, 237, 3, "field-position") +
		(on
			? line(x, 213, x, 237, wireClass) + arrow(x, 108, x, 137, "field-power")
			: line(x, 213, x + 17, 235, wireClass));
	return frame(
		"Zwei parallele Zweige. " +
			left +
			" und " +
			right +
			" Milliampere ergeben " +
			total +
			" Milliampere.",
		title(260, 43, "Knoten: " + total + " mA") +
			line(122, lineY, 397, lineY, wireClass) +
			line(122, 250, 397, 250, wireClass) +
			line(122, 95, 122, 162, wireClass) +
			line(122, 174, 122, 250, wireClass) +
			line(102, 162, 142, 162, wireClass) +
			line(111, 174, 133, 174, wireClass) +
			branch(260, !!left) +
			branch(397, !!right) +
			label(260, 294, "A · " + left + " mA") +
			label(397, 294, "B · " + right + " mA") +
			label(76, 167, "6 V"),
	);
}

function resistance(v: LabValues) {
	const r = ohmicResistance(v);
	const height = Math.min(155, r / 2);
	return frame(
		v.voltage +
			" Volt geteilt durch " +
			fmt(v.current / 1000, 2) +
			" Ampere ergibt " +
			fmt(r, 1) +
			" Ohm.",
		title(260, 48, "Spannung pro Ampere") +
			rect(134, 77, 74, 25 + v.voltage * 6, "field-air-bar", 'rx="10"') +
			title(171, 212, v.voltage + " V") +
			label(252, 145, "geteilt durch") +
			rect(320, 77, 74, 25 + v.current / 4, "field-capillary", 'rx="10"') +
			title(357, 212, fmt(v.current / 1000, 2) + " A") +
			rect(260 - height, 244, 2 * height, 21, "field-machine", 'rx="9"') +
			title(260, 303, fmt(r, 1) + " Ω"),
	);
}

function wire(v: LabValues) {
	const width = 58 + v.length * 8;
	const thickness = 18 + v.area * 9;
	return frame(
		"Leiterquerschnitt " +
			v.area +
			" Quadratmillimeter. Widerstand " +
			fmt(exampleWire(v), 3) +
			" Ohm.",
		title(260, 43, v.material ? "Aluminium" : "Kupfer") +
			rect(
				100,
				155 - thickness / 2,
				width,
				thickness,
				v.material ? "field-aluminium" : "field-copper",
				'rx="14"',
			) +
			(v.warm
				? [167, 224, 281]
						.map((x) => arrow(x, 121, x, 92, "field-carbon"))
						.join("")
				: "") +
			arrow(100, 221, 100 + width, 221, "field-force") +
			label(260, 250, "Länge: " + v.length + " m") +
			label(260, 286, "Querschnitt: " + v.area + " mm²") +
			label(260, 315, "Widerstand: " + fmt(exampleWire(v), 3) + " Ω"),
	);
}

function electricalSafety(v: LabValues) {
	const hazard = [
		"Elektrischer Strom braucht einen Weg",
		"Isolierung beschädigt",
		"Wasser kann leiten",
		"Leitung kann heiß werden",
	][v.case];
	return frame(
		electricalCases[v.case].join(". "),
		title(260, 56, hazard) +
			polygon(
				[
					{ x: 260, y: 91 },
					{ x: 349, y: 248 },
					{ x: 171, y: 248 },
				],
				"field-warning",
			) +
			path("M268 128 L226 180 H258 L249 219 L296 165 H265Z", "hazard-ink") +
			label(
				260,
				293,
				[
					"Untersuche die Situationen im Modell.",
					"Abstand halten · Gerät außer Betrieb lassen",
					"Netzgeräte vom Wasser fernhalten",
					"Zulässige Belastung beachten",
				][v.case],
			),
	);
}

export const physicsDiagrams = {
	wind,
	"wind-site": windSite,
	effects: effect,
	circuit,
	meters,
	parallel,
	resistance,
	wire,
	"electrical-safety": electricalSafety,
};
