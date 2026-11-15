import { fmt } from "../exercises/format";
import type { Lesson, ModelKind } from "../model/types";
import {
	applyScenario,
	extension,
	initialModelState,
	lampStates,
	lensImage,
	massOf,
	MODEL_SCENARIOS,
	modelReady,
	modelValues,
	PARAMS,
	refractedAngle,
	type ModelState,
	type Param,
	uniformMotion,
} from "../models";
import { esc } from "../workshop";
export { applyScenario, initialModelState, type ModelState };

const line = (
	x: number,
	y: number,
	xx: number,
	yy: number,
	color = "var(--accent)",
	dashed = false,
): string =>
	`<line x1="${x}" y1="${y}" x2="${xx}" y2="${yy}" stroke="${color}" stroke-width="3" ${dashed ? 'stroke-dasharray="6 5"' : ""}/>`;
function ray(
	x: number,
	y: number,
	xx: number,
	yy: number,
	color = "var(--accent)",
	dashed = false,
): string {
	const angle = Math.atan2(yy - y, xx - x),
		cx = x + (xx - x) * 0.65,
		cy = y + (yy - y) * 0.65;
	return (
		line(x, y, xx, yy, color, dashed) +
		(dashed
			? ""
			: `<path d="M${cx} ${cy}l${-10 * Math.cos(angle - 0.5)} ${-10 * Math.sin(angle - 0.5)}l${10 * Math.cos(angle - 0.5) - 10 * Math.cos(angle + 0.5)} ${10 * Math.sin(angle - 0.5) - 10 * Math.sin(angle + 0.5)}Z" fill="${color}"/>`)
	);
}
const label = (x: number, y: number, text: string, anchor = "middle"): string =>
	`<text x="${x}" y="${y}" text-anchor="${anchor}">${esc(text)}</text>`;
const circle = (x: number, y: number, r: number, fill: string): string =>
	`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="currentColor" stroke-width="1.5"/>`;
function svg(body: string, alt: string): string {
	return `<svg class="physics-figure" viewBox="0 0 660 300" role="img" aria-label="${esc(alt)}">${body}</svg>`;
}
function graph(
	points: [number, number][],
	xMax: number,
	yMax: number,
	xLabel: string,
	yLabel: string,
): string {
	const x = (v: number) => 65 + (530 * v) / xMax,
		y = (v: number) => 235 - (180 * v) / yMax;
	return svg(
		`<path d="M65 40V235H610" class="axis"/>${[0, 0.5, 1].map((r) => label(x(r * xMax), 257, fmt(r * xMax)) + label(48, y(r * yMax) + 5, fmt(r * yMax), "end")).join("")}<polyline points="${points.map(([xx, yy]) => `${x(xx)},${y(yy)}`).join(" ")}" class="data-line"/>${label(330, 287, xLabel)}${label(70, 25, yLabel, "start")}`,
		`${yLabel} in Abhängigkeit von ${xLabel}; Achsen von 0 bis ${fmt(xMax)} und ${fmt(yMax)}`,
	);
}
export function renderFigure(
	kind: ModelKind,
	v: Record<string, number>,
): string {
	switch (kind) {
		case "measurement": {
			const ticks = Array.from(
				{ length: 12 / v.step + 1 },
				(_, i) => i * v.step,
			);
			return svg(
				`<rect class="object-fill" x="${55 + v.start * 45}" y="65" width="${v.length * 45}" height="45" rx="5"/>${label(55 + (v.start + v.length / 2) * 45, 50, "Körper")}${line(55, 150, 595, 150, "currentColor")}${ticks.map((n) => line(55 + n * 45, 150, 55 + n * 45, Number.isInteger(n) ? 175 : 163, "currentColor") + (Number.isInteger(n) ? label(55 + n * 45, 199, String(n)) : "")).join("")}${label(610, 199, "cm")}${label(330, 250, `Anfang ${fmt(v.start)} cm · Ende ${fmt(v.start + v.length)} cm`)}`,
				`Lineal: Körper von ${fmt(v.start)} bis ${fmt(v.start + v.length)} cm; Skalenabstand ${fmt(v.step)} cm`,
			);
		}
		case "motion":
			return (
				graph(
					[
						[0, 0],
						[10, uniformMotion(v.v, 10)],
					],
					10,
					50,
					"Zeit t in s",
					"Weg s in m",
				) +
				`<p class="visual-readout">Nach ${fmt(v.t)} s: <strong>${fmt(uniformMotion(v.v, v.t))} m</strong> bei ${fmt(v.v)} m/s.</p>`
			);
		case "forces": {
			const len = 14 * v.force;
			const contactY = 160;
			const forceArrow = (
				from: number,
				to: number,
				color = "var(--accent)",
			) => {
				const head = to - Math.sign(to - from) * 9;
				return (
					line(330, from, 330, to, color) +
					`<path d="M324 ${head}L330 ${to}L336 ${head}Z" fill="${color}"/>`
				);
			};
			const bodies = `<rect class="object-fill" x="260" y="90" width="140" height="70" rx="5"/><rect class="muted-fill" x="220" y="${contactY}" width="220" height="30"/>${label(380, 118, "Buch")}${label(250, 215, "Tisch")}`;
			return svg(
				bodies +
					forceArrow(contactY, contactY - len) +
					(v.pair
						? `${forceArrow(contactY, contactY + len, "var(--compare)")}${label(420, 245, `Buch → Tisch: ${fmt(v.force)} N`, "start")}${label(330, 25, "Verschiedene Körper · Kontaktpaar")}${label(330, 285, "Beide Pfeile beginnen an der Kontaktfläche")}`
						: `${forceArrow(125, 125 + len, "var(--compare)")}${circle(330, 125, 3, "var(--compare)")}${label(420, 245, `Erde → Buch: ${fmt(v.force)} N`, "start")}${label(330, 25, "Derselbe Körper · Kräftegleichgewicht")}${label(330, 285, "Stützkraft am Kontakt · Gewichtskraft am Schwerpunkt")}`) +
					circle(330, contactY, 3, "var(--accent)") +
					label(235, 85, `Tisch → Buch: ${fmt(v.force)} N`, "end"),
				v.pair
					? "Kontaktkräfte an Buch und Tisch wirken auf verschiedene Körper in entgegengesetzte Richtungen"
					: "Stützkraft und Gewichtskraft wirken beide am Buch und gleichen sich aus",
			);
		}
		case "spring": {
			const e = extension(v.force, v.d);
			return (
				graph(
					[
						[0, 0],
						[6 / v.d, 6],
					],
					6,
					8,
					"Dehnung Δl in cm",
					"Kraft F in N",
				) +
				`<p class="visual-readout">${e === null ? "Außerhalb des bis 6 N geprüften Hooke-Bereichs: keine Dehnung berechnet." : `Bei ${fmt(v.force)} N: <strong>${fmt(e)} cm</strong> Dehnung; D = ${fmt(v.d)} N/cm.`}</p>`
			);
		}
		case "particles": {
			const state = v.state;
			const dots = Array.from({ length: 24 }, (_, i) => {
				const col = i % 6,
					row = Math.floor(i / 6);
				const x =
					state === 2
						? 105 + ((i * 79 + v.phase * ((i % 3) + 1) * 13) % 440)
						: 220 +
							col * 38 +
							(state === 1
								? Math.sin(i + v.phase) * 9
								: Math.sin(v.phase + i) * 2);
				const y =
					state === 2
						? 45 + ((i * 53 + v.phase * 17) % 185)
						: 125 +
							row * 29 +
							(state === 1
								? Math.cos(i + v.phase) * 7
								: Math.cos(v.phase + i) * 2);
				return (
					circle(x, y, 7, "var(--accent)") +
					(state ? line(x + 10, y, x + 16, y - 5, "var(--compare)") : "")
				);
			}).join("");
			return svg(
				`<rect x="75" y="25" width="510" height="225" rx="12" class="vessel"/>${dots}${label(330, 285, ["Fest: feste Nachbarn, kleine Schwingungen", "Flüssig: nahe Nachbarn wechseln", "Gas: große Abstände, ungeordnete Bewegung"][state])}`,
				`${["Festkörper", "Flüssigkeit", "Gas"][state]} mit 24 gleich großen Modellteilchen`,
			);
		}
		case "friction":
			return svg(
				`<path d="M90 205H570" class="axis"/>${v.rough ? Array.from({ length: 20 }, (_, i) => `<path d="M${100 + 23 * i} 205l7 9l7 -9" class="axis"/>`).join("") : ""}<rect class="object-fill" x="240" y="125" width="180" height="${v.kind === 2 ? 58 : 80}" rx="8"/>${v.kind === 2 ? circle(270, 191, 14, "var(--surface)") + circle(390, 191, 14, "var(--surface)") : ""}${ray(420, 150, 535, 150)}${ray(240, 180, 125, 180, "var(--compare)")}${label(490, 130, "Zug →")}${label(165, 160, "← Reibung")}${label(330, 65, ["Haften: Kontaktflächen ruhen relativ zueinander", "Gleiten: Flächen rutschen aneinander vorbei", "Rollen: Rad und Unterlage verformen sich"][v.kind])}${label(330, 275, "Pfeile zeigen Richtungen, keine gemessenen Beträge")}`,
				`${["Haftreibung", "Gleitreibung", "Rollwiderstand"][v.kind]} auf ${v.rough ? "rauer" : "glatter"} Unterlage; Zug nach rechts und Reibung nach links`,
			);
		case "density": {
			const side = 70 * Math.cbrt(v.volume / 10);
			return svg(
				`<rect class="object-fill" x="${230 - side / 2}" y="${190 - side}" width="${side}" height="${side}" rx="4"/>${label(230, 225, `Volumen: ${fmt(v.volume)} cm³`)}<rect class="compare-fill" x="430" y="${230 - massOf(v.rho, v.volume) / 2}" width="65" height="${massOf(v.rho, v.volume) / 2}"/>${label(462, 255, `${fmt(massOf(v.rho, v.volume))} g`)}${label(330, 35, `Dichte: ${fmt(v.rho)} g/cm³`)}${label(330, 290, "Homogener Körper · gleiche Bedingungen")}`,
				`Homogener Körper mit ${fmt(v.volume)} Kubikzentimetern, Dichte ${fmt(v.rho)} Gramm je Kubikzentimeter und Masse ${fmt(massOf(v.rho, v.volume))} Gramm`,
			);
		}
		case "light": {
			if (v.mode >= 2) {
				const lunar = v.mode === 3;
				return svg(
					`${circle(90, 135, 45, "#f6bf35")}<path d="M${lunar ? "330 103L600 124V146L330 167" : "310 121L535 95V175L310 149"}Z" class="shadow-fill"/>${circle(310, 135, lunar ? 32 : 14, lunar ? "#4388bd" : "#9eabbc")}${circle(515, 135, lunar ? 14 : 32, lunar ? "#9eabbc" : "#4388bd")}${label(90, 225, "Sonne")}${label(310, 225, lunar ? "Erde" : "Mond")}${label(515, 225, lunar ? "Mond im Erdschatten" : "Erde im Mondschatten")}${label(330, 40, lunar ? "Mondfinsternis" : "Sonnenfinsternis")}${label(330, 285, "Nicht maßstäblich · Bahnebenen nur im passenden Fall ausgerichtet")}`,
					lunar
						? "Mondfinsternis: Sonne, Erde und Mond in dieser Reihenfolge, der Mond im Erdschatten"
						: "Sonnenfinsternis: Sonne, Mond und Erde in dieser Reihenfolge, Mondschatten auf einem Teil der Erde",
				);
			}
			if (v.mode === 0)
				return svg(
					`${circle(100, 80, 25, "#f6bf35")}<rect class="object-fill" x="270" y="180" width="100" height="35" rx="6"/>${circle(550, 80, 25, "var(--surface)")}${circle(550, 80, 8, "var(--accent)")}${ray(123, 97, 300, 180)}${ray(350, 180, 530, 96, "var(--compare)")}${label(100, 35, "Quelle")}${label(320, 250, "Beleuchteter Gegenstand")}${label(550, 35, "Auge: Empfänger")}${label(330, 285, "Licht wird am Gegenstand in viele Richtungen gestreut")}`,
					"Licht von einer Quelle trifft einen Gegenstand; ein Teil des gestreuten Lichts gelangt ins Auge",
				);
			const h = v.size * 12,
				top = 65,
				bottom = 195,
				pen = 1.5 * h;
			return svg(
				`<rect x="580" y="${top - pen}" width="22" height="${bottom - top + 2 * pen}" class="penumbra-fill"/><rect x="580" y="${top + pen}" width="22" height="${bottom - top - 2 * pen}" class="shadow-fill"/>${[-h, h].map((dy) => ray(80, 130 + dy, 580, 130 + dy + (104 - 130 - dy) * 2.5) + ray(80, 130 + dy, 580, 130 + dy + (156 - 130 - dy) * 2.5)).join("")}<rect x="272" y="104" width="16" height="52" class="object-fill"/>${line(80, 130 - h - 3, 80, 130 + h + 3, "#d69a00")}${label(80, 270, "Quelle")}${label(280, 270, "Hindernis")}${label(575, 270, "Schirm")}${label(330, 30, h ? "Kernschatten dunkel · Halbschatten heller" : "Punktförmige Quelle: scharfer Schatten")}`,
				h
					? "Randstrahlen einer ausgedehnten Quelle begrenzen Kern- und Halbschatten"
					: "Randstrahlen einer punktförmigen Quelle begrenzen einen scharfen Schatten",
			);
		}
		case "reflection": {
			const r = (v.angle * Math.PI) / 180,
				dx = Math.sin(r) * 160,
				dy = Math.cos(r) * 160;
			const body = v.rough
				? [-1, 0, 1]
						.map((n) => {
							const x = 170 + (n + 1) * 150,
								a = ((v.angle + n * 30) * Math.PI) / 180;
							return (
								line(
									x - 43,
									190 - n * 12,
									x + 43,
									190 + n * 12,
									"currentColor",
								) +
								ray(x - dx * 0.6, 190 - dy * 0.6, x, 190) +
								ray(
									x,
									190,
									x + 95 * Math.sin(a),
									190 - 95 * Math.cos(a),
									"var(--compare)",
								)
							);
						})
						.join("")
				: `${line(90, 190, 570, 190, "currentColor")}${line(330, 25, 330, 245, "currentColor", true)}${ray(330 - dx, 190 - dy, 330, 190)}${ray(330, 190, 330 + dx, 190 - dy, "var(--compare)")}${label(330, 20, "Lot")}${label(150, 255, `Einfall: ${fmt(v.angle)}°`)}${label(510, 255, `Reflexion: ${fmt(v.angle)}°`)}`;
			return svg(
				`${body}${label(330, 285, v.rough ? "Verschiedene lokale Lote verteilen die Lichtwege" : "Beide Winkel zum Lot · ebene Spiegelfläche")}`,
				v.rough
					? "Schematische diffuse Reflexion an unterschiedlich geneigten Oberflächenstücken"
					: `Reflexion an ebenem Spiegel: Einfalls- und Reflexionswinkel jeweils ${fmt(v.angle)} Grad zum Lot`,
			);
		}
		case "refraction": {
			const a = (v.angle * Math.PI) / 180,
				b = refractedAngle(v.angle, v.out === 1);
			return svg(
				`<rect class="water-fill" x="55" y="${v.out ? 20 : 135}" width="550" height="115"/>${line(55, 135, 605, 135, "currentColor")}${line(330, 25, 330, 265, "currentColor", true)}${ray(330 - Math.sin(a) * 120, 135 - Math.cos(a) * 120, 330, 135)}${ray(330, 135, 330 + Math.sin(a) * 120, 135 - Math.cos(a) * 120, "var(--compare)")}${b === null ? label(470, 210, "Kein gebrochener Strahl") : ray(330, 135, 330 + Math.sin((b * Math.PI) / 180) * 120, 135 + Math.cos((b * Math.PI) / 180) * 120, "var(--compare)")}${label(100, 55, v.out ? "Wasser" : "Luft", "start")}${label(100, 230, v.out ? "Luft" : "Wasser", "start")}${label(330, 285, b === null ? "Totalreflexion · gesamtes Licht im idealen Modell reflektiert" : "Ein Teil wird reflektiert, ein Teil gebrochen · Intensitäten nicht dargestellt")}`,
				`${v.out ? "Wasser nach Luft" : "Luft nach Wasser"} bei ${fmt(v.angle)} Grad: ${b === null ? "Totalreflexion ohne austretenden Strahl" : "Brechung und Teilreflexion"}`,
			);
		}
		case "spectrum": {
			const colors = [
				"#cf3030",
				"#b66a00",
				"#9b8700",
				"#248643",
				"#287bca",
				"#8452b6",
			];
			return svg(
				`<path d="M300 45L230 210H390Z" class="water-fill" stroke="currentColor" stroke-width="2"/>${ray(60, 125, 264, 125, v.white ? "currentColor" : colors[0])}${line(264, 125, 344, 130, v.white ? "currentColor" : colors[0])}${(v.white ? colors : [colors[0]]).map((c, i) => ray(344, 130, 565, 155 + i * 16, c)).join("")}${label(100, 80, v.white ? "Weißes Licht" : "Rotes Licht")}${label(300, 250, "Prisma")}${label(575, 140, "Rot")}${v.white ? label(575, 260, "Violett") : ""}${label(330, 290, "Farblinien sind eine Vereinfachung des kontinuierlichen Spektrums")}`,
				v.white
					? "Prisma trennt weißes Licht: Rot wird schwächer abgelenkt als Violett"
					: "Rotes Licht wird am Prisma abgelenkt und bleibt rot",
			);
		}
		case "lens": {
			const image = lensImage(v.f, v.g),
				k = Math.min(4, 275 / Math.max(v.g, v.f * 2, Math.abs(image.b ?? 0))),
				obj = 330 - v.g * k,
				yy = 165;
			const right = 620,
				exitY = 135 + (30 * (right - 330)) / (v.f * k),
				centerY = yy + (30 * (right - 330)) / (v.g * k);
			let body = `${line(30, yy, 630, yy, "currentColor")}<path d="M330 35Q350 165 330 275Q310 165 330 35Z" class="water-fill" stroke="currentColor"/>${ray(obj, yy, obj, 135)}${label(obj, 118, "Gegenstand")}${ray(obj, 135, 330, 135)}${ray(330, 135, right, exitY)}${ray(obj, 135, 330, yy, "var(--compare)")}${ray(330, yy, right, centerY, "var(--compare)")}${[-1, 1].map((side) => circle(330 + side * v.f * k, yy, 3, "currentColor") + label(330 + side * v.f * k, yy + 22, "F")).join("")}`;
			if (image.b !== null && image.scale !== null) {
				const bx = 330 + image.b * k,
					by = yy - 30 * image.scale;
				body +=
					ray(bx, yy, bx, by, "var(--compare)") +
					label(bx, by + (image.kind === "real" ? 22 : -12), "Bild");
				if (image.kind === "virtual")
					body +=
						line(330, 135, bx, by, "var(--accent)", true) +
						line(330, yy, bx, by, "var(--compare)", true);
			}
			return svg(
				`${body}${label(330, 295, image.kind === "focus" ? "Gegenstand im Brennpunkt: kein endlicher Bildort" : image.kind === "real" ? "Reelles, umgekehrtes Bild · Schirmbild möglich" : "Virtuelles, aufrechtes Bild · gestrichelte Rückverlängerungen")}`,
				`Sammellinse, Gegenstandsweite ${fmt(v.g)} cm und Brennweite ${fmt(v.f)} cm: ${image.kind === "real" ? "reelles umgekehrtes Bild" : image.kind === "virtual" ? "virtuelles aufrechtes Lupenbild" : "kein endlicher Bildort"}`,
			);
		}
		case "magnet": {
			const n = v.reverse ? "S" : "N",
				ss = v.reverse ? "N" : "S",
				start = v.reverse ? 385 : 275,
				end = v.reverse ? 275 : 385;
			const poles = (y: number, left: number, right: number) =>
				`<rect x="${left}" y="${y}" width="65" height="45" fill="${v.reverse ? "#3279ad" : "#bf4357"}"/><rect x="${right}" y="${y}" width="65" height="45" fill="${v.reverse ? "#bf4357" : "#3279ad"}"/><text x="${left + 32}" y="${y + 29}" text-anchor="middle" fill="white" class="pole-label">${n}</text><text x="${right + 32}" y="${y + 29}" text-anchor="middle" fill="white" class="pole-label">${ss}</text>`;
			let body = "";
			if (v.shape)
				body = `<path d="M260 120V225H400V120" fill="none" stroke="var(--line)" stroke-width="28"/>${poles(75, 227, 368)}${[90, 108, 126].map((y) => ray(v.reverse ? 365 : 295, y, v.reverse ? 295 : 365, y)).join("")}${label(330, 265, "Im mittleren Spalt: annähernd parallel")}`;
			else
				body = `${[0, 1, 2]
					.map((i) => {
						const top = 130 - i * 8,
							bottom = 140 + i * 8;
						const upper = 65 - i * 20,
							lower = 205 + i * 20;
						const cyTop = (top + 3 * upper) / 4,
							cyBottom = (bottom + 3 * lower) / 4;
						return `<path d="M260 ${top}C${185 - i * 35} ${upper} ${465 + i * 35} ${upper} 390 ${top}M260 ${bottom}C${185 - i * 35} ${lower} ${465 + i * 35} ${lower} 390 ${bottom}" class="field-line"/>${ray(v.reverse ? 337 : 313, cyTop, v.reverse ? 313 : 337, cyTop)}${ray(v.reverse ? 337 : 313, cyBottom, v.reverse ? 313 : 337, cyBottom)}`;
					})
					.join(
						"",
					)}${poles(112, 260, 325)}${ray(end, 150, start, 150, "white")}${label(330, 277, "Außen N → S · innen zurück: geschlossene Feldlinien")}`;
			return svg(
				`${body}${label(330, 25, "Feldlinienmodell · Richtung des Kompass-Nordpols")}`,
				v.shape
					? `Hufeisenmagnet mit ${n} links und ${ss} rechts; Feldrichtung im Spalt vom Nordpol zum Südpol`
					: `Stabmagnet mit ${n} links und ${ss} rechts; geschlossene Feldlinien, außen vom Nordpol zum Südpol`,
			);
		}
		case "circuit": {
			const on = lampStates(
				v.parallel === 1,
				v.a === 1,
				v.b === 1,
				v.insulator === 1,
			);
			const bulb = (x: number, y: number, index: number) =>
				circle(x, y, 18, on[index] ? "#edbd41" : "var(--surface)") +
				line(x - 12, y - 12, x + 12, y + 12, "currentColor") +
				line(x - 12, y + 12, x + 12, y - 12, "currentColor") +
				label(x, y + 42, `${index ? "B" : "A"}: ${on[index] ? "an" : "aus"}`);
			const sw = (x: number, y: number, closed: boolean, name: string) =>
				line(x, y, x + 30, closed ? y : y - 20, "currentColor") +
				circle(x, y, 2, "currentColor") +
				circle(x + 30, y, 2, "currentColor") +
				label(x + 15, y - 30, `Schalter ${name}`);
			const branch = (y: number, index: number) =>
				line(130, y, 220, y, "currentColor") +
				sw(220, y, Boolean(index ? v.b : v.a), index ? "B" : "A") +
				line(250, y, 342, y, "currentColor") +
				bulb(360, y, index) +
				line(378, y, 530, y, "currentColor");
			const wires = `<path d="M130 ${v.parallel ? 80 : 120}V270H190M225 270H325M335 270H530V${v.parallel ? 80 : 120}" class="axis"/>${line(325, 250, 325, 290, "currentColor")}${line(335, 258, 335, 282, "currentColor")}${label(330, 235, "Quelle")}${line(190, 270, 225, 270, v.insulator ? "var(--compare)" : "currentColor", Boolean(v.insulator))}${label(175, 295, v.insulator ? "Kunststoff" : "Kupfer")}`;
			const serial = `${line(130, 120, 170, 120, "currentColor")}${sw(170, 120, Boolean(v.a), "A")}${line(200, 120, 252, 120, "currentColor")}${bulb(270, 120, 0)}${line(288, 120, 350, 120, "currentColor")}${sw(350, 120, Boolean(v.b), "B")}${line(380, 120, 432, 120, "currentColor")}${bulb(450, 120, 1)}${line(468, 120, 530, 120, "currentColor")}`;
			return svg(
				`${wires}${v.parallel ? branch(80, 0) + branch(180, 1) : serial}${label(330, 25, v.parallel ? "Parallel: jeder Zweig wird einzeln geschaltet" : "Reihe: beide Schalter im selben Stromweg")}`,
				`${v.parallel ? "Parallele" : "Reihen"}schaltung: Lampe A ${on[0] ? "an" : "aus"}, Lampe B ${on[1] ? "an" : "aus"}; Verbindung ${v.insulator ? "Kunststoff" : "Kupfer"}`,
			);
		}
	}
}

const NOTES: Record<ModelKind, string> = {
	measurement:
		"Die Modelllänge ist vorgegeben. Bei grober Skala ist nicht jede Endmarke genau ablesbar; unterscheide bekannte Modellwerte und Messauflösung.",
	motion:
		"Geradlinig gleichförmig ab Startweg null. Beide Achsen behalten ihre Skala; Beschleunigung und Reibung sind nicht enthalten.",
	forces:
		"Schematische Kraftpfeile mit gemeinsamem Maßstab; die Körperzeichnung beschreibt keinen zeitlichen Bewegungsvorgang.",
	spring:
		"Nur die gezeichnete Messreihe bis 6 N ist charakterisiert. Jenseits dieses Bereichs wird weder ein elastischer noch ein plastischer Verlauf erfunden.",
	particles:
		"24 gleich große Modellteilchen. Der Modellschritt verändert die Darstellung ohne automatische Animation; keine maßstäbliche Molekülansicht.",
	friction:
		"Qualitatives Modell. Rauheit und Art des Kontakts ändern die Situation; es gibt hier keine allgemeine Rangfolge für beliebige Materialien und keine Kraftberechnung.",
	density:
		"Homogener Körper bei gleichen Bedingungen. Dichtewerte frei gewählt, keine verifizierte Materialtabelle; der Balken zeigt Masse.",
	light:
		"Geradliniges Strahlmodell, Finsternisse nicht maßstäblich. Die Bahneigung erklärt, warum diese Anordnung nicht jeden Monat eintritt.",
	reflection:
		"Das ebene Modell zeigt das Reflexionsgesetz. Die raue Fläche zeigt schematisch verschiedene lokale Lote; keine Helligkeitsverteilung.",
	refraction:
		"Ebene Wasser-Luft-Grenze mit idealisierten Materialwerten. Winkel dienen dem Vergleich; Intensitäten, Dispersion und Wellen sind nicht berechnet.",
	spectrum:
		"Schematische Strahlen am Prisma; sechs Farblinien stehen für einen kontinuierlichen Übergang. Keine Berechnung einzelner Farbwinkel.",
	lens: "Dünne Sammellinse, achsennahe Strahlen, Skala passt sich dem Bildort an. Gestrichelt sind nur gedachte rückwärtige Verlängerungen.",
	magnet:
		"Schematische Feldlinien und Polflächen, keine berechnete Feldstärke. Die Pfeile zeigen die Feldrichtung, nicht eine Bewegung des Magneten.",
	circuit:
		"Idealisierte Schaltlogik ohne Strom-, Spannungs- oder Helligkeitsrechnung. Ein Modell ist keine Freigabe zum Aufbau am Stromnetz.",
};
export function renderIllustration(lesson: Lesson): string {
	if (lesson.id === "me-masse-gewicht") {
		return `<figure class="concept-figure">${svg(`${[180, 480].map((x) => `<rect x="${x - 35}" y="65" width="70" height="40" rx="4" class="object-fill"/>${label(x, 45, "Gleiche Masse: 0,5 kg")}`).join("")}${ray(180, 105, 180, 205)}${ray(480, 105, 480, 121, "var(--compare)")}${label(180, 225, "Gewichtskraft ≈ 5 N")}${label(480, 160, "Gewichtskraft ≈ 0,8 N")}${circle(180, 265, 20, "#4388bd")}${circle(480, 265, 12, "#9eabbc")}${label(180, 295, "Erde · g ≈ 10 N/kg")}${label(480, 295, "Mond · g ≈ 1,6 N/kg")}`, "Derselbe Körper mit 0,5 kg Masse hat auf der Erde ungefähr 5 N und auf dem Mond ungefähr 0,8 N Gewichtskraft")}<figcaption>Die Masse bleibt gleich. Der andere Ortsfaktor verändert die Gewichtskraft; die Pfeile zeigen die unterschiedliche Kraft.</figcaption></figure>`;
	}
	if (lesson.id === "me-volumen") {
		const cylinder = (x: number, value: number) =>
			`<rect x="${x}" y="35" width="90" height="200" rx="6" fill="none" stroke="currentColor" stroke-width="2"/><rect x="${x + 2}" y="${235 - 2 * value}" width="86" height="${2 * value - 2}" class="water-fill"/>${[30, 50, 70].map((n) => line(x - 5, 235 - 2 * n, x + 12, 235 - 2 * n, "currentColor") + label(x - 14, 240 - 2 * n, String(n), "end")).join("")}${label(x + 45, 265, `${value} ml`)}`;
		return `<figure class="concept-figure">${svg(`${cylinder(160, 50)}${cylinder(440, 68)}<path d="M458 190L477 181L504 201L495 224L466 226Z" class="object-fill"/>${label(205, 22, "Vorher")}${label(485, 22, "Nachher")}${label(330, 295, "Zunahme: 18 ml = 18 cm³ Körpervolumen")}`, "Messzylinder vor und nach dem vollständigen Eintauchen: 50 ml und 68 ml; der wasserfeste Körper verdrängt 18 ml, sein Volumen ist 18 Kubikzentimeter")}<figcaption>Schematische Wasserverdrängung: vollständig eintauchen, Luftblasen und Wasserverlust vermeiden. Die Differenz zählt.</figcaption></figure>`;
	}
	if (lesson.id === "op-spiegelbild") {
		return `<figure class="concept-figure">${svg(`<rect x="325" y="35" width="10" height="215" class="water-fill"/>${ray(150, 200, 150, 100)}${line(510, 200, 510, 100, "var(--compare)", true)}${ray(150, 100, 330, 75)}${ray(330, 75, 50, 36)}${line(330, 75, 510, 100, "var(--compare)", true)}${ray(150, 100, 330, 160)}${ray(330, 160, 60, 250)}${line(330, 160, 510, 100, "var(--compare)", true)}${label(150, 235, "Gegenstand")}${label(510, 235, "Virtuelles Bild")}${label(330, 280, "Gleicher Abstand zur Spiegelebene · nur Verlängerungen hinter dem Spiegel")}`, "Ebener Spiegel: reflektierte Lichtstrahlen vor dem Spiegel, rückwärtige gestrichelte Verlängerungen zum gleich großen aufrechten Bild dahinter")}<figcaption>Durchgezogene Linien: echte Lichtwege. Gestrichelte Linien: gedachte Verlängerungen.</figcaption></figure>`;
	}
	const kind = lesson.illustration;
	const scenario =
		lesson.id === "op-schatten"
			? "shadow"
			: lesson.id === "op-totalreflexion"
				? "total"
				: "";
	const state = scenario
		? applyScenario(kind, initialModelState(), scenario)
		: initialModelState();
	return `<figure class="concept-figure">${renderFigure(kind, modelValues(kind, state))}<figcaption>${esc(NOTES[kind])}</figcaption></figure>`;
}
function renderControl(p: Param, value: number): string {
	if (p.options)
		return `<label>${esc(p.label)}<select aria-label="${esc(p.label)}" data-model-range="${p.key}">${p.options.map((text, i) => `<option value="${i}" ${i === value ? "selected" : ""}>${esc(text)}</option>`).join("")}</select></label>`;
	return `<label>${esc(p.label)}: ${fmt(value)} ${esc(p.unit)}<input aria-label="${esc(p.label)}" type="range" data-model-range="${p.key}" min="${p.min}" max="${p.max}" step="${p.step}" value="${value}"></label>`;
}
export function renderModel(
	lesson: Lesson,
	seen: string[],
	state: ModelState,
): string {
	const kind = lesson.model!,
		v = modelValues(kind, state);
	return `<section class="panel exploration"><div class="panel-heading"><span class="eyebrow">MODELLLABOR</span><span>${modelReady(kind, seen) ? "✓ Vergleiche geöffnet" : `${seen.length} / ${MODEL_SCENARIOS[kind].length} Vergleiche geöffnet`}</span></div><h2>Verändern, vergleichen, erklären</h2><p>Sage zuerst voraus, was sich ändert. Öffne dann alle Vergleichssituationen und prüfe deine Erklärung. Geöffnete Vergleiche allein sind kein Verständnisnachweis.</p><div class="scenario-buttons">${MODEL_SCENARIOS[kind].map((s) => `<button type="button" class="button secondary" data-scenario="${s.id}" aria-pressed="${state.selected === s.id}">${seen.includes(s.id) ? "✓ " : ""}${esc(s.label)}</button>`).join("")}</div><div class="model-controls">${PARAMS[kind].map((p) => renderControl(p, v[p.key])).join("")}</div><div class="model-visual">${renderFigure(kind, v)}</div><p class="small">${esc(NOTES[kind])}</p></section>`;
}
