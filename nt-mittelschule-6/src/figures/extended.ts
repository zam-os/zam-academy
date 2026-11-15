import { EXTENDED_LABS, getParameter, modelReadings } from "../extended-models";
import { fmtDe, type LabState } from "../lab-model";
import type { ExtendedKind, LabKind } from "../model/types";
import { esc } from "../workshop";
import { arrow, box, text } from "./svg-helpers";
import { maleAnatomy } from "./anatomy";

const n = (v: number) => fmtDe(v, Number.isInteger(v) ? 0 : 2);
const line = (x: number, y: number, x2: number, y2: number, cls = "bio-line") =>
	`<path d="M${x},${y}L${x2},${y2}" class="${cls}"/>`;
const node = (x: number, y: number, label: string) =>
	box(x - 65, y - 22, 130, 44) + text(x, y + 6, label, "diagram-small");
const cell = (x: number, y: number, plant = true) =>
	plant
		? `<rect x="${x}" y="${y}" width="95" height="68" rx="8" class="bio-cell"/><circle cx="${x + 56}" cy="${y + 34}" r="12" class="bio-nucleus"/>${[15, 35, 70].map((dx) => `<ellipse cx="${x + dx}" cy="${y + 14}" rx="7" ry="4" class="leaf"/>`).join("")}`
		: `<ellipse cx="${x + 48}" cy="${y + 34}" rx="48" ry="34" class="bio-cell"/><circle cx="${x + 56}" cy="${y + 34}" r="12" class="bio-nucleus"/>`;
const person = (x: number, y: number) =>
	`<circle cx="${x}" cy="${y}" r="16" class="bio-person"/><path d="M${x},${y + 16}v55m0,-35l-28,25m28,-25l28,25m-28,10l-23,40m23,-40l23,40" class="bio-person-line"/>`;

/** Labelled, non-photographic diagrams; no remote assets or learner body data. */
export function drawExtendedScene(
	kind: LabKind,
	state: LabState,
): string | undefined {
	const spec = EXTENDED_LABS[kind as ExtendedKind];
	if (!spec) return undefined;
	const m = state.mode || spec.choices[0].id,
		p = getParameter(kind, state),
		r = modelReadings(kind, state);
	let b = "";
	switch (kind) {
		case "aquaticKey":
			if (m === "plants")
				b = `<path d="M30,210Q200,190 570,210V295H30Z" class="water-fill"/><path d="M100,235V65m0,55l-25,-35m25,70l30,-50m-12,150V110" class="plant-stem"/><path d="M370,280V130m0,30l-40,-20m40,45l35,-20m-35,40l-35,-5m35,30l35,-10" class="plant-stem"/>${text(110, 325, "Schilf · Ufer")}${text(390, 325, "Wasserpest · unter Wasser")}`;
			else if (m === "worm")
				b = `<path d="M140,220C180,60 300,300 430,110" class="worm-body"/>${text(300, 300, "Schlammröhrenwurm")}${text(300, 335, "Keine gegliederten Beine", "diagram-small")}`;
			else
				b = `<ellipse cx="300" cy="150" rx="28" ry="75" class="soil-animal"/>${[110, 150, 190].map((y) => `${line(280, y, 215, y + 25)}${line(320, y, 385, y + 25)}`).join("")}${line(290, 220, 255, 290)}${line(310, 220, 345, 290)}${text(130, 155, "6 Beine")}${text(440, 280, "2 Schwanzfäden")}${text(300, 345, "Vereinfachte Steinfliegenlarve", "diagram-small")}`;
			break;
		case "microscope": {
			const cells =
				m === "single"
					? cell(250, 135, false)
					: m === "parts"
						? cell(250, 135, true)
						: [0, 1, 2]
								.flatMap((x) =>
									[0, 1].map((y) => cell(145 + x * 100, 110 + y * 73)),
								)
								.join("");
			b = `<g style="filter:blur(${r.blur}px)">${cells}</g>${text(300, 65, m === "single" ? "Ein Lebewesen · eine Zelle" : m === "parts" ? "Pflanzenzelle · Modell" : "Wasserpest · viele Zellen")}${text(300, 300, "Membran · Zellplasma · Zellkern", "diagram-small")}${text(300, 338, "Modellfarben und Sichtbarkeit sind vereinfacht", "diagram-small")}`;
			if (m === "parts")
				b += `${line(250, 170, 120, 170)}${text(100, 150, "Membran", "diagram-small")}${line(306, 169, 440, 115)}${text(475, 110, "Kern", "diagram-small")}${line(275, 185, 440, 230)}${text(475, 250, "Plasma", "diagram-small")}`;
			break;
		}
		case "fish":
			b = `<ellipse cx="300" cy="170" rx="150" ry="68" class="fish"/><path d="M430,170l95,-65v130Z M280,110l50,-45 25,55 M280,220l50,50 20,-42" class="fish"/><circle cx="190" cy="150" r="6" class="eye"/>${text(300, 45, "Knochenfisch · schematisch")}`;
			b += `<path d="M235,175l45,45 -55,-20 M340,218l25,35 -40,-20" class="fish"/>`;
			if (m !== "gills")
				b += `<path d="M225,125q-22,45 0,90" class="bio-line"/>`;
			if (m === "gills")
				b += `${[0, 1, 2, 3, 4].map((i) => `<path d="M${215 + i * 6},135q-12,35 0,70" class="gill-line"/>`).join("")}${arrow(90, 175, 205)}${arrow(240, 210, 280, 260)}${text(100, 135, "Wasser hinein", "diagram-small")}${text(300, 305, "Kiemen: gelöster Sauerstoff hinein", "diagram-small")}${text(300, 338, "Kohlenstoffdioxid hinaus", "diagram-small")}`;
			else if (m === "bladder")
				b += `<ellipse cx="320" cy="160" rx="58" ry="23" class="gas-bubble"/>${line(320, 185, 320, 280)}${text(320, 315, "Schwimmblase · Auftrieb")}`;
			else
				b += `${line(465, 295, 500, 200)}${text(465, 320, "Schwanz: Antrieb", "diagram-small")}${line(310, 95, 160, 70)}${text(110, 65, "Stabilität", "diagram-small")}${text(245, 340, "Stromlinienform: weniger Widerstand", "diagram-small")}`;
			break;
		case "aquaticWeb":
			b =
				node(85, 75, "Alge") +
				node(270, 75, "Wasserfloh") +
				node(455, 75, "Jungfisch") +
				node(455, 200, "Hecht") +
				arrow(155, 75, 200) +
				arrow(340, 75, 385) +
				arrow(455, 100, 455, 170);
			if (m !== "chain")
				b += node(255, 200, "Insektenlarve") + arrow(320, 180, 405, 100);
			if (m === "recycle")
				b +=
					node(155, 290, "Zersetzer") +
					arrow(410, 220, 220, 290) +
					arrow(115, 270, 85, 110) +
					text(395, 300, "Stoffe zurück · Wärme abgegeben", "diagram-small");
			b += text(
				300,
				355,
				"Pfeil: wird gefressen von · ausgewählte Beziehungen",
				"diagram-small",
			);
			break;
		case "habitat":
			b =
				m === "straight"
					? `<path d="M30,115H570V225H30Z" class="water-fill"/><path d="M30,105H570M30,235H570" class="concrete-bank"/>`
					: `<path d="M30,130Q140,45 270,140T570,130V240Q450,330 300,230T30,240Z" class="water-fill"/>${[80, 165, 420, 520].map((x) => `<path d="M${x},100v-45m0,20l-15,-15m15,25l15,-15" class="plant-stem"/>`).join("")}`;
			if (m === "weir")
				b += `<rect x="285" y="110" width="26" height="150" class="diagram-box"/>${arrow(170, 190, 270)}${text(300, 300, "Wehr kann Wanderwege unterbrechen", "diagram-small")}`;
			else
				b += text(
					300,
					320,
					m === "straight"
						? "Wenige Randstrukturen"
						: "Verschiedene Teilräume und Verstecke",
				);
			b += text(
				300,
				365,
				"Nutzen · Lebensraumfolgen · Grenzen",
				"diagram-small",
			);
			break;
		case "puberty":
			b =
				person(180, 115) +
				person(400, 115) +
				text(300, 25, "Entwicklung verläuft individuell");
			if (m === "body")
				b += `${text(180, 285, "Wachstum · Haut", "diagram-small")}${text(410, 285, "Stimme · Behaarung", "diagram-small")}`;
			else if (m === "feelings")
				b += `${box(45, 40, 145, 45)}${text(118, 69, "Selbstständigkeit", "diagram-small")}${box(355, 40, 195, 45)}${text(452, 69, "Gefühle & Grenzen", "diagram-small")}`;
			else
				b += `${text(180, 285, "Angemessen reinigen", "diagram-small")}${text(410, 285, "Frische Kleidung", "diagram-small")}`;
			b += text(
				300,
				345,
				"Keine Rangliste · keine privaten Angaben nötig",
				"diagram-small",
			);
			break;
		case "organs":
			if (m === "male") b = maleAnatomy();
			else if (m === "functions")
				b =
					node(130, 90, "Eierstock") +
					node(450, 90, "Eizelle") +
					arrow(200, 90, 380) +
					node(130, 190, "Hoden") +
					node(450, 190, "Samenzelle") +
					arrow(200, 190, 380) +
					node(300, 295, "Gebärmutter") +
					text(300, 345, "Möglicher Entwicklungsort", "diagram-small");
			else
				b = `<path d="M260,160Q220,80 175,125 M340,160Q380,80 425,125" class="bio-duct"/><ellipse cx="165" cy="135" rx="25" ry="18" class="bio-organ"/><ellipse cx="435" cy="135" rx="25" ry="18" class="bio-organ"/><path d="M260,155Q300,175 340,155Q350,225 310,260V280H290V260Q250,225 260,155Z" class="bio-organ"/><path d="M290,280V330H310V280" class="bio-outline"/>${text(100, 90, "Eierstock", "diagram-small")}${line(135, 95, 160, 118)}${text(450, 70, "Eileiter", "diagram-small")}${line(420, 80, 390, 112)}${text(460, 230, "Gebärmutter", "diagram-small")}${line(385, 225, 332, 210)}${text(300, 355, "Vagina", "diagram-small")}${text(300, 387, "Vulva: äußere Organe · Harnröhre getrennt", "diagram-small")}`;
			break;
		case "fertilisation":
			b = `<circle cx="110" cy="140" r="35" class="bio-cell"/><circle cx="55" cy="90" r="9" class="bio-nucleus"/><path d="M45,85q-20,-20 -30,-10" class="bio-line"/>${arrow(160, 140, 220)}${[0, 1, 2, 3].map((i) => `<circle cx="${270 + (i % 2) * 22}" cy="${125 + Math.floor(i / 2) * 22}" r="15" class="bio-cell"/>`).join("")}${arrow(325, 140, 380)}${box(410, 95, 125, 100, "bio-organ")}<circle cx="470" cy="155" r="24" class="bio-cell"/>${text(110, 235, "Befruchtung", "diagram-small")}${text(285, 235, "Teilungen", "diagram-small")}${text(470, 235, "Einnistung", "diagram-small")}${text(110, 280, "meist Eileiter", "diagram-small")}${text(470, 280, "Gebärmutter", "diagram-small")}`;
			b += `<rect x="${m === "fertilise" ? 40 : m === "divide" ? 220 : 395}" y="65" width="${m === "implant" ? 155 : 140}" height="235" rx="18" class="model-highlight"/>${text(300, 350, "Reihenfolge statt individueller Zeitplan", "diagram-small")}`;
			break;
		case "pregnancy":
			if (m === "supply")
				b = `${box(40, 85, 160, 190, "bio-organ")}${box(400, 85, 160, 190, "bio-cell")}<path d="M290,70V290M310,70V290" class="bio-duct"/>${arrow(170, 135, 430)}${arrow(430, 225, 170)}${text(120, 50, "Mutter", "diagram-small")}${text(480, 50, "Kind", "diagram-small")}${text(300, 115, "Sauerstoff, Nährstoffe", "diagram-small")}${text(300, 210, "Abfallstoffe", "diagram-small")}${text(300, 320, "Plazenta: Austauschstelle", "diagram-small")}${text(300, 365, "Blutkreisläufe normalerweise getrennt", "diagram-small")}`;
			else if (m === "birth")
				b =
					node(105, 135, "Entwicklung") +
					arrow(175, 135, 225) +
					node(300, 135, "Geburt") +
					arrow(370, 135, 420) +
					node(495, 135, "Atmung") +
					person(300, 235) +
					text(
						300,
						375,
						"Nach der Geburt: eigene Sauerstoffaufnahme",
						"diagram-small",
					);
			else
				b = `<ellipse cx="300" cy="180" rx="155" ry="125" class="bio-organ"/><ellipse cx="300" cy="180" rx="125" ry="100" class="water-box"/><circle cx="290" cy="155" r="30" class="bio-cell"/><path d="M287,185q80,35 15,65q-35,10 -28,-20" class="bio-person-line"/><path d="M425,130q-30,45 0,90" class="placenta"/><path d="M310,220Q380,250 410,180" class="bio-duct"/>${text(105, 80, "Fruchtblase", "diagram-small")}${line(150, 85, 205, 105)}${text(480, 75, "Plazenta", "diagram-small")}${line(465, 85, 425, 140)}${text(480, 315, "Nabelschnur", "diagram-small")}${line(445, 295, 375, 220)}${text(300, 365, "Organe entstehen, wachsen und reifen", "diagram-small")}`;
			break;
		case "contraception":
			if (m === "hormones")
				b = `${box(175, 70, 250, 170)}${Array.from({ length: 12 }, (_, i) => `<circle cx="${210 + (i % 4) * 60}" cy="${105 + Math.floor(i / 4) * 50}" r="13" class="pill"/>`).join("")}${text(300, 290, "Pille: hormonelle Wirkung")}${text(300, 335, "Kein Schutz vor sexuell übertragbaren Infektionen", "diagram-small")}`;
			else if (m === "limits")
				b =
					node(145, 100, "Kondom") +
					node(445, 100, "Pille") +
					text(145, 170, "Barriere", "diagram-small") +
					text(445, 170, "Hormone", "diagram-small") +
					text(145, 225, "Infektionsrisiko sinkt*", "diagram-small") +
					text(445, 225, "Kein Infektionsschutz", "diagram-small") +
					text(
						300,
						305,
						"* bei richtiger Anwendung · keine absolute Garantie",
						"diagram-small",
					);
			else
				b = `${[90, 150, 210].map((x, i) => `<circle cx="${x}" cy="${130 + i * 30}" r="9" class="bio-nucleus"/>${line(x - 30, 120 + i * 30, x - 8, 130 + i * 30)}`).join("")}${arrow(220, 170, 290)}<path d="M310,70V270" class="barrier-line"/><circle cx="440" cy="170" r="38" class="bio-cell"/>${text(150, 320, "Samenzellen", "diagram-small")}${text(310, 45, "Barriere", "diagram-small")}${text(450, 320, "Eizelle", "diagram-small")}${text(300, 370, "Prinzipbild ohne anatomische Größenverhältnisse", "diagram-small")}`;
			break;
		case "forces":
			b =
				m === "deform"
					? `${box(80, 125, 100, 100)}${arrow(210, 175, 285)}<ellipse cx="400" cy="175" rx="90" ry="38" class="bio-cell"/>${text(300, 300, "Die Form ändert sich")}`
					: m === "turn"
						? `${box(240, 175, 70, 50)}${arrow(100, 200, 225)}${arrow(275, 150, 275, 60)}${text(120, 245, "Bewegung", "diagram-small")}${text(370, 100, "Kraft seitlich", "diagram-small")}${text(300, 320, "Die Richtung ändert sich")}`
						: `${box(90, 175, 70, 50)}${arrow(175, 200, 240)}${box(350, 175, 70, 50)}${arrow(435, 200, 550)}${text(300, 115, "Geschwindigkeit kann sich ändern")}${text(300, 310, "Kraftbetrag: Newton (N)")}`;
			break;
		case "forceMeter": {
			const end = 120 + r.extension * 10;
			b = `${line(170, 35, 290, 35)}<path d="M230,35${Array.from({ length: 18 }, (_, i) => `L${230 + (i % 2 ? 12 : -12)},${45 + ((end - 55) * (i + 1)) / 18}`).join("")}L230,${end}" class="spring-line"/>${box(200, end, 60, 40)}${line(280, end, 405, end)}${line(400, 100, 400, 260)}${Array.from({ length: 7 }, (_, i) => `${line(390, 120 + i * 20, 410, 120 + i * 20)}${text(445, 127 + i * 20, `${i} N`, "diagram-small")}`).join("")}${text(220, 315, `${n(r.extension)} cm Dehnung`)}${text(300, 365, "Nullpunkt prüfen · Messbereich einhalten", "diagram-small")}`;
			if (m === "table")
				b =
					text(300, 40, "Modellwerte derselben Feder") +
					text(180, 85, "Kraft in N", "diagram-small") +
					text(420, 85, "Dehnung in cm", "diagram-small") +
					line(90, 100, 510, 100) +
					line(300, 65, 300, 325) +
					Array.from(
						{ length: 7 },
						(_, i) =>
							text(180, 130 + i * 30, String(i), "diagram-small") +
							text(420, 130 + i * 30, String(2 * i), "diagram-small"),
					).join("") +
					text(
						300,
						370,
						"Messungen am echten Gerät bleiben im Unterricht",
						"diagram-small",
					);
			if (m === "limits") b += text(155, 75, "Modellskala", "diagram-small");
			break;
		}
		case "work": {
			const y = m === "hold" ? 190 : 300 - p * 35;
			b = `${line(50, 310, 555, 310)}${box(150, y - 45, 80, 45)}${arrow(270, 300, 270, y)}${text(340, 180, m === "hold" ? "Weg: 0 m" : `${n(p)} m Hubweg`)}${text(340, 225, m === "hold" ? "Hubarbeit: 0 J" : `20 N · ${n(p)} m = ${n(r.work)} J`)}${text(300, 365, m === "accelerate" ? "Schnellerwerden: Beschleunigungsarbeit" : "Konstante Kraft entlang des Weges", "diagram-small")}`;
			if (m === "accelerate")
				b =
					box(85, 170, 90, 50) +
					arrow(190, 195, 500) +
					text(300, 115, "Bewegungsenergie nimmt zu") +
					text(
						300,
						310,
						"Beschleunigungsarbeit statt Hubarbeit",
						"diagram-small",
					);
			break;
		}
		case "lever": {
			const pivot = m === "one" ? 85 : 245,
				loadX = 165,
				effortX = pivot + p * 4;
			b = `<path d="M${pivot - 22},230L${pivot},185L${pivot + 22},230Z" class="diagram-box"/>${line(m === "one" ? 75 : 70, 180, Math.min(580, effortX + 20), 180, "lever-beam")}<g data-lever-load>${arrow(loadX, 185, loadX, 257)}</g><g data-lever-effort>${m === "one" ? arrow(effortX, 185 + r.effort * 12, effortX, 185) : arrow(effortX, 175 - r.effort * 12, effortX, 175)}</g>${text(loadX, 300, "Last: 6 N", "diagram-small")}${text(effortX, 80, `${n(r.effort)} N`, "diagram-small")}${text(pivot + 45, 145, "Drehpunkt", "diagram-small")}${text(300, 340, `Lastarm 20 cm · Kraftarm ${n(p)} cm`, "diagram-small")}${text(300, 375, "Senkrechte Kräfte · Eigengewicht vernachlässigt", "diagram-small")}`;
			if (m === "table")
				b =
					text(300, 40, "Modellwerte: 6 N Last an 20 cm") +
					text(180, 90, "Kraftarm in cm", "diagram-small") +
					text(420, 90, "Kraft in N", "diagram-small") +
					line(90, 110, 510, 110) +
					line(300, 65, 300, 330) +
					[
						[20, 6],
						[40, 3],
						[60, 2],
						[80, 1.5],
					]
						.map(
							([arm, force], i) =>
								text(180, 155 + i * 50, n(arm)) +
								text(420, 155 + i * 50, n(force)),
						)
						.join("") +
					text(
						300,
						370,
						"Längerer Kraftarm → kleinere Kraft · ideal",
						"diagram-small",
					);
			break;
		}
		case "machines":
			if (m === "ramp") {
				const dx = Math.sqrt(p * p - 1) * 80;
				const angle = (Math.atan2(-80, dx) * 180) / Math.PI;
				b = `<path d="M80,260L${80 + dx},180V260Z" class="ramp-fill"/><g data-ramp-load transform="translate(${80 + dx / 2},220) rotate(${angle})">${box(-25, -35, 50, 35)}${arrow(0, -55, 65, -55)}</g>${text(300, 90, `${n(p)} m Rampe · 1 m Höhe`)}${text(300, 135, `Ideal: ${n(r.effort)} N bei 60 N Last`)}${text(300, 335, "Kleinere Kraft · längerer Weg · gleiche ideale Arbeit", "diagram-small")}`;
			} else if (m === "fixed")
				b = `${line(120, 45, 480, 45)}${line(300, 45, 300, 75)}<circle cx="300" cy="110" r="35" class="turbine"/><path d="M265,280V110A35,35 0 0 1 335,110V260" class="rope-line"/>${box(305, 260, 60, 40)}${arrow(230, 200, 230, 275)}${text(135, 180, "Zug: 60 N", "diagram-small")}${text(430, 290, "Last: 60 N", "diagram-small")}${text(300, 350, "Feste Rolle: Richtung ändern · gleicher Kraftbetrag", "diagram-small")}`;
			else
				b = `${line(120, 45, 480, 45)}${line(350, 45, 350, 75)}<circle cx="350" cy="110" r="35" class="turbine"/><circle cx="280" cy="215" r="35" class="turbine"/><path d="M245,45V215A35,35 0 0 0 315,215V110A35,35 0 0 1 385,110V300" class="rope-line"/>${line(280, 250, 280, 270)}${box(250, 270, 60, 40)}${arrow(420, 225, 420, 300)}${text(125, 195, "2 tragende", "diagram-small")}${text(125, 225, "Seilabschnitte", "diagram-small")}${text(480, 185, "Zug: 30 N", "diagram-small")}${text(300, 355, "Lose Rolle: halbe Kraft, doppelter Zugweg", "diagram-small")}`;
			break;
		case "ergonomics":
			b =
				m === "transport"
					? `${box(280, 150, 150, 80)}<path d="M250,125v130h220" class="bio-line"/><circle cx="280" cy="275" r="20" class="turbine"/><circle cx="440" cy="275" r="20" class="turbine"/>${text(300, 335, "Passende Transporthilfe · Einweisung", "diagram-small")}`
					: m === "condition"
						? `${line(100, 200, 260, 200, "lever-beam")}${line(285, 210, 470, 230, "lever-beam")}<path d="M260,185l15,15 -15,15 25,-5" class="gill-line"/>${text(300, 100, "Beschädigung: unterbrechen")}${text(300, 320, "Nicht durch mehr Kraft ausgleichen", "diagram-small")}`
						: `${person(140, 120)}${line(250, 210, 465, 125, "lever-beam")}${text(390, 260, "Passung + Zustand", "diagram-small")}${text(300, 335, "Kraftersparnis allein reicht nicht", "diagram-small")}`;
			break;
		case "speed":
			b = `${line(60, 220, 550, 220)}${[0, 1, 2, 3, 4, 5, 6].map((i) => `${line(60 + i * 80, 210, 60 + i * 80, 230)}${text(60 + i * 80, 270, `${i * 10} m`, "diagram-small")}`).join("")}${box(70, 150, 70, 45)}${arrow(160, 170, 500)}${text(300, 65, m === "average" ? "Mit Pause: Durchschnitt statt durchgehend gleichförmig" : "Gleiche Wege in gleichen Zeiten", "diagram-small")}${text(300, 320, `60 m in ${n(p)} s → ${n(r.speed)} m/s`)}${text(300, 365, `${n(r.kmh)} km/h · Modellfahrt`, "diagram-small")}`;
			if (m === "average") b += text(330, 185, "PAUSE", "diagram-small");
			break;
		case "motionGraph": {
			const points = Array.from(
				{ length: 9 },
				(_, t) =>
					`${70 + t * 58},${300 - (m === "rest" ? 12 : m === "change" ? 0.75 * t * t : p * t) * 5}`,
			);
			b = `<path d="M70,45V300H550" class="chart-axis"/><polyline points="${points.join(" ")}" class="density-curve"/>${[0, 2, 4, 6, 8].map((t) => text(70 + t * 58, 330, String(t), "diagram-small")).join("")}${[0, 12, 24, 36, 48].map((v) => text(35, 307 - v * 5, String(v), "diagram-small")).join("")}${text(125, 30, "Weg in m", "diagram-small")}${text(485, 370, "Zeit in s →", "diagram-small")}`;
			break;
		}
		case "stopping": {
			const reactionMid = 55 + r.reaction * 2,
				brakingMid = 55 + r.reaction * 4 + r.braking * 2;
			b = `<rect x="55" y="115" width="${r.reaction * 4}" height="45" class="reaction-bar"/><rect x="${55 + r.reaction * 4}" y="115" width="${r.braking * 4}" height="45" class="braking-bar"/>${text(300, 65, `${n(p)} km/h · überschlägiges Modell`)}${line(reactionMid, 115, Math.max(100, reactionMid), 102)}${text(Math.max(100, reactionMid), 95, `${n(r.reaction)} m Reaktion`, "diagram-small")}${line(brakingMid, 160, Math.max(100, brakingMid), 195)}${text(Math.max(100, brakingMid), 220, `${n(r.braking)} m Bremsen`, "diagram-small")}${text(300, 285, `Zusammen: ${n(r.total)} m`)}${text(300, 345, "Faustformeln · keine garantierte reale Strecke", "diagram-small")}`;
			if (m !== "sum")
				b += text(
					300,
					380,
					m === "reaction"
						? "Ablenkung kann die Reaktion verzögern"
						: "Fahrbahn und Bremsung können vom Modell abweichen",
					"diagram-small",
				);
			break;
		}
		case "inertia":
			b = `<path d="M90,230H400" class="bio-line"/><circle cx="135" cy="255" r="20" class="turbine"/><circle cx="355" cy="255" r="20" class="turbine"/>${box(m === "loose" ? 375 : 220, 145, m === "mass" ? 110 : 60, 70)}${arrow(95, 100, 250)}${text(400, 100, "Wagen bremst", "diagram-small")}${text(300, 340, m === "loose" ? "Loser Körper bewegt sich zunächst weiter" : m === "mass" ? "Mehr Masse: größere Trägheit" : "Befestigung ändert die Bewegung mit", "diagram-small")}`;
			if (m === "secured")
				b += '<path d="M215,230V135H285V230" class="barrier-line"/>';
			break;
		case "traffic":
			b = `<path d="M30,235H570V320H30Z" class="road"/><path d="M40,280H560" class="road-mark"/>${box(290, 130, 180, 110)}<circle cx="325" cy="250" r="20" class="turbine"/><circle cx="435" cy="250" r="20" class="turbine"/>`;
			if (m === "hidden")
				b += `<circle cx="200" cy="270" r="18" class="ball"/>${person(500, 120)}${text(225, 85, "Verdeckter Bereich?", "diagram-small")}`;
			else if (m === "wet")
				b += `${[100, 180, 260, 340, 420, 500].map((x) => line(x, 50, x - 12, 95, "rain-line")).join("")}${text(160, 170, "Nässe", "diagram-small")}`;
			else
				b +=
					person(130, 115) +
					box(165, 120, 30, 50) +
					text(340, 80, "Aufmerksam bleiben", "diagram-small");
			b += text(
				300,
				365,
				"Sicht · Reaktion · Fahrbahn · angepasste Entscheidung",
				"diagram-small",
			);
			break;
	}
	const label =
		spec.choices.find((c) => c.id === m)?.label ?? spec.choices[0].label;
	return `<svg class="chem-diagram extended-diagram" viewBox="0 0 600 410" role="img" aria-label="${esc(`${spec.title}: ${label}. Beschriftungen und die Erklärung darunter beschreiben das vereinfachte Modell.`)}" xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
}
