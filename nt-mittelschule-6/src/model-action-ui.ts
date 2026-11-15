import { drawScene } from "./figures";
import { arrow, box, text } from "./figures/svg-helpers";
import type { LabState } from "./lab-model";
import { actionFor, actionState, type ModelAction } from "./model-actions";
import type { LabKind } from "./model/types";
import { esc } from "./workshop";

const button = (
	key: string,
	attributes: string,
	label: string,
	disabled = false,
) =>
	`<button type="button" class="action-button" data-action-key="${key}" ${attributes} ${disabled ? "disabled" : ""}>${label}</button>`;
const picture = (
	kind: LabKind,
	state: LabState,
	mode: string,
	hide: string[] = [],
	strip = false,
) => {
	const svg = drawScene(kind, { ...state, mode });
	const viewBox = svg.match(/viewBox="([^"]+)"/)![1];
	let body = svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>"));
	body = body.replace(/<text\b[^>]*>([\s\S]*?)<\/text>/g, (whole, value) =>
		strip || hide.some((label) => esc(label) === value) ? "" : whole,
	);
	return { body, viewBox, height: Number(viewBox.split(" ")[3]) };
};
const frame = (body: string, overlay = "", height = 360, point = false) =>
	`<div class="model-action-viewport"><div class="model-action-canvas" ${point ? "data-action-canvas" : ""} style="aspect-ratio:600/${height}"><svg class="action-diagram" viewBox="0 0 600 ${height}" role="img" aria-label="Konstruktionsmodell zum Forschungsauftrag; Bedienelemente und Zuordnungen stehen daneben." xmlns="http://www.w3.org/2000/svg">${body}</svg>${overlay}</div></div>`;
const marker = (
	x: number,
	y: number,
	height: number,
	key: string,
	attrs: string,
	label: string,
	aria: string,
	filled = false,
) =>
	`<button type="button" class="action-marker ${filled ? "filled" : ""}" style="left:${x / 6}%;top:${(y / height) * 100}%" data-action-key="${key}" ${attrs} aria-label="${esc(aria)}">${label}</button>`;

function labelBackground(
	kind: LabKind,
	state: LabState,
	def: Extract<ModelAction, { type: "labels" }>,
): { body: string; height: number } {
	if (def.panels) {
		const captions: Partial<Record<LabKind, string[][]>> = {
			waterUse: [
				["Fisch im Gewässer"],
				["Wasser zum Trinken"],
				["Schiff auf dem Wasser"],
			],
			properties: [["Schmelzen"], ["Sieden"], ["Flüssig im Steckbrief"]],
			gases: [
				["Knallgasprobe:", "Geräusch"],
				["Glimmspan:", "flammt wieder auf"],
			],
			soilLife: [["Modelltier A"], ["Modelltier B"], ["Modelltier C"]],
		};
		const width = 600 / def.panels.length;
		return {
			height: 360,
			body: def.panels
				.map((mode, i) => {
					const p = picture(kind, state, mode, [], true),
						x = i * width;
					return `${box(x + 6, 35, width - 12, 215)}<svg x="${x + 10}" y="45" width="${width - 20}" height="155" viewBox="${p.viewBox}">${p.body}</svg>${(captions[kind]?.[i] ?? [mode]).map((line, j) => text(x + width / 2, 212 + j * 24, line, "diagram-small")).join("")}`;
				})
				.join(""),
		};
	}
	if (def.template === "photosynthesis")
		return {
			height: 360,
			body: `<path d="M300,150v110m0,-55q-70,-65 -70,-5q20,35 70,20m0,-30q70,-65 70,-5q-20,35 -70,20" class="plant-stem"/>${arrow(140, 105, 255, 150)}${arrow(140, 255, 255, 230)}${arrow(300, 85, 300, 140)}${arrow(345, 150, 455, 105)}${arrow(345, 230, 455, 255)}${text(90, 65, "Gasaufnahme", "diagram-small")}${text(90, 215, "Wurzelaufnahme", "diagram-small")}${text(300, 25, "Energiezufuhr", "diagram-small")}${text(500, 50, "energiereicher", "diagram-small")}${text(500, 75, "Stoff", "diagram-small")}${text(500, 215, "Gasabgabe", "diagram-small")}`,
		};
	if (def.template === "puberty")
		return {
			height: 360,
			body: `<circle cx="100" cy="90" r="20" class="bio-person"/><path d="M100,110v65m0,-45l-30,30m30,-30l30,30m-30,15l-25,40m25,-40l25,40" class="bio-person-line"/>${box(245, 70, 110, 100)}${text(300, 125, "Gefühle", "diagram-small")}<path d="M450,95l30,-20h40l30,20 -15,30 -15,-10v75h-40v-75l-15,10Z" class="bio-cell"/>${text(100, 235, "Stimme verändert sich", "diagram-small")}${text(300, 220, "Wunsch nach", "diagram-small")}${text(300, 242, "Selbstständigkeit", "diagram-small")}${text(500, 220, "Verschwitzte Kleidung", "diagram-small")}${text(500, 242, "wechseln", "diagram-small")}`,
		};
	if (def.template === "contraception")
		return {
			height: 360,
			body: `${box(15, 40, 170, 205)}${box(215, 40, 170, 205)}${box(415, 40, 170, 205)}<path d="M100,70v85" class="barrier-line"/>${arrow(35, 110, 85)}${Array.from({ length: 6 }, (_, i) => `<circle cx="${270 + (i % 3) * 30}" cy="${90 + Math.floor(i / 3) * 40}" r="9" class="pill"/>`).join("")}<path d="M500,65l45,20v45q0,35 -45,50q-45,-15 -45,-50V85Z" class="bio-cell"/>${text(100, 205, "Barriere", "diagram-small")}${text(300, 193, "Hormonelle", "diagram-small")}${text(300, 217, "Wirkung", "diagram-small")}${text(500, 193, "STI-Risiken", "diagram-small")}${text(500, 217, "verringert", "diagram-small")}`,
		};
	const p = picture(kind, state, def.scene ?? "", def.hideLabels);
	return {
		body:
			p.body +
			(kind === "fish"
				? `<path d="M130,170L210,170 M495,260L495,200" class="bio-line"/>`
				: ""),
		height: p.height,
	};
}

export function renderModelAction(kind: LabKind, state: LabState): string {
	const def = actionFor(kind);
	if (!def) return "";
	const s = actionState(kind, state);
	let content = "";
	switch (def.type) {
		case "order":
			content = `<p class="small">${kind === "soil" ? "Profil von oben nach unten" : "Ablauf von oben nach unten"}</p><ol class="action-order ${kind === "soil" ? "soil-profile" : ""}">${s.order.map((item, index) => `<li data-layer="${item}"><span>${esc(def.items[item])}</span><div>${button(`move-${index}--1`, `data-action-move="${index}" data-delta="-1" aria-label="${esc(def.items[item])} nach oben"`, "↑", index === 0)}${button(`move-${index}-1`, `data-action-move="${index}" data-delta="1" aria-label="${esc(def.items[item])} nach unten"`, "↓", index === s.order.length - 1)}</div></li>`).join("")}</ol>`;
			break;
		case "labels": {
			const background = labelBackground(kind, state, def);
			const overlay = def.targets
				.map((t, i) =>
					marker(
						t.x,
						t.y,
						background.height,
						`target-${t.id}`,
						`data-action-target="${t.id}"`,
						String(i + 1),
						`Markierung ${i + 1}${t.description ? `: ${t.description}` : ""}; zugeordnet: ${s.labels[t.id] ?? "noch nichts"}`,
						!!s.labels[t.id],
					),
				)
				.join("");
			content = `<p class="small">Erst Begriff wählen, dann eine nummerierte Markierung anklicken. Begriffe dürfen mehrfach verwendet werden.</p><div class="chip-row">${def.labels.map((label, index) => `<button type="button" class="chip" data-action-key="label-${index}" data-action-label="${index}" aria-pressed="${s.selectedLabel === label}">${esc(label)}</button>`).join("")}</div>${frame(background.body, overlay, background.height)}<ol class="action-label-list">${def.targets.map((t) => `<li>${t.description ? `${esc(t.description)}: ` : ""}<strong>${esc(s.labels[t.id] ?? "Noch nicht zugeordnet")}</strong></li>`).join("")}</ol>`;
			break;
		}
		case "network": {
			let body = "";
			for (const edge of s.edges) {
				const [from, to] = edge.split("->"),
					a = def.nodes.find((n) => n.id === from)!,
					b = def.nodes.find((n) => n.id === to)!;
				const length = Math.hypot(b.x - a.x, b.y - a.y),
					ux = (b.x - a.x) / length,
					uy = (b.y - a.y) / length;
				const offset = Math.min(65 / Math.abs(ux), 22 / Math.abs(uy)) + 5;
				body += arrow(
					a.x + ux * offset,
					a.y + uy * offset,
					b.x - ux * offset,
					b.y - uy * offset,
				);
			}
			body += text(300, 335, "Pfeil: wird gefressen von", "diagram-small");
			const overlay = def.nodes
				.map(
					(n) =>
						`<button type="button" class="action-node" style="left:${n.x / 6}%;top:${n.y / 3.6}%" data-action-key="node-${n.id}" data-action-node="${n.id}" aria-pressed="${s.selectedNode === n.id}">${esc(n.label)}</button>`,
				)
				.join("");
			content =
				frame(body, overlay) +
				`<ul class="action-edge-list">${s.edges
					.map((e) => {
						const [from, to] = e.split("->");
						return `<li>${esc(def.nodes.find((n) => n.id === from)!.label)} → ${esc(def.nodes.find((n) => n.id === to)!.label)}</li>`;
					})
					.join(
						"",
					)}</ul><p class="small">${s.selectedNode ? `Futter gewählt: ${esc(def.nodes.find((n) => n.id === s.selectedNode)!.label)}. Wähle den Fresser.` : "Noch kein Startpunkt gewählt."}</p>`;
			break;
		}
		case "molecule": {
			let body = text(300, 45, "Baue genau ein Wassermolekül");
			const atoms = [
				...Array.from({ length: s.counts.O }, () => "O"),
				...Array.from({ length: s.counts.H }, () => "H"),
			];
			if (s.counts.H === 2 && s.counts.O === 1)
				body += `<path d="M245,205L300,150L355,205" class="bio-line"/>${[
					[300, 150, "O"],
					[245, 205, "H"],
					[355, 205, "H"],
				]
					.map(
						([x, y, e]) =>
							`<circle cx="${x}" cy="${y}" r="27" class="atom-${e}"/>${text(Number(x), Number(y) + 6, String(e), "atom-label")}`,
					)
					.join("")}`;
			else
				body += atoms
					.map(
						(element, i) =>
							`<circle cx="${110 + (i % 4) * 125}" cy="${120 + Math.floor(i / 4) * 90}" r="27" class="atom-${element}"/>${text(110 + (i % 4) * 125, 126 + Math.floor(i / 4) * 90, element, "atom-label")}`,
					)
					.join("");
			body += text(
				300,
				325,
				`${s.counts.H} H-Atome · ${s.counts.O} O-Atome`,
				"diagram-small",
			);
			content =
				frame(body) +
				`<div class="action-controls">${(["H", "O"] as const).map((e) => `${button(`atom-${e}--1`, `data-action-atom="${e}" data-delta="-1"`, `${e} entfernen`, s.counts[e] === 0)}${button(`atom-${e}-1`, `data-action-atom="${e}" data-delta="1"`, `${e} hinzufügen`, s.counts[e] >= (e === "H" ? 4 : 3))}`).join("")}</div>`;
			break;
		}
		case "scenario": {
			let body = picture(
				kind,
				state,
				s.features.plants ? "diverse" : "straight",
				[],
				true,
			).body;
			if (s.features.trash)
				body += `<path d="M210,170h35v25h-35Z M390,220h25v15h-25Z" class="braking-bar"/>`;
			if (s.features.weir)
				body += `<rect x="295" y="110" width="25" height="155" class="diagram-box"/>`;
			content =
				frame(body, "", 410) +
				`<div class="action-feature-list">${def.features.map((f) => `<label><input type="checkbox" data-action-key="feature-${f.id}" data-action-feature="${f.id}" ${s.features[f.id] ? "checked" : ""}> ${esc(f.label)}</label>`).join("")}</div>`;
			break;
		}
		case "experiment": {
			const trial = def.trials.find((t) => t.id === s.activeTrial);
			if (trial) {
				const p = picture(kind, state, trial.scene);
				content = frame(p.body, "", p.height);
			} else
				content = `<p class="action-before-trial">Formuliere deine Vorhersagen. Nach dem Abspielen erscheint die jeweilige Modellbeobachtung.</p>`;
			content += def.trials
				.map(
					(t) =>
						`<div class="action-trial"><label>${esc(t.label)}<select data-action-key="predict-${t.id}" data-action-predict="${t.id}"><option value="">Vorhersage wählen</option>${def.outcomes.map((outcome, index) => `<option value="${index}" ${s.predictions[t.id] === outcome ? "selected" : ""}>${esc(outcome)}</option>`).join("")}</select></label>${button(`run-${t.id}`, `data-action-run="${t.id}"`, "Modellversuch abspielen", !s.predictions[t.id])}${s.trials[t.id] ? `<p class="small"><strong>Modellbeobachtung:</strong> ${esc(s.trials[t.id].outcome)}<br>Deine Vorhersage: ${esc(s.trials[t.id].prediction)}</p>` : ""}</div>`,
				)
				.join("");
			break;
		}
		case "point": {
			let body =
				def.template === "force"
					? `<circle cx="300" cy="200" r="32" class="bio-cell"/>${arrow(60, 200, 230)}${text(140, 165, "Bewegung", "diagram-small")}${arrow(300, 200, s.point.x, s.point.y)}${text(300, 340, "Kraftpfeil: Richtung veränderbar", "diagram-small")}`
					: `<circle cx="${def.observer.x}" cy="${def.observer.y}" r="13" class="bio-person"/>${text(def.observer.x + 15, def.observer.y - 35, "Blickpunkt", "diagram-small")}${arrow(def.observer.x + 25, def.observer.y, def.barrier.left - 40)}${box(def.barrier.left, def.barrier.top, def.barrier.right - def.barrier.left, def.barrier.bottom - def.barrier.top)}${text((def.barrier.left + def.barrier.right) / 2, (def.barrier.top + def.barrier.bottom) / 2 + 8, "Fahrzeug", "diagram-small")}${text(300, 340, "Draufsicht · mögliche Sichtbarriere", "diagram-small")}`;
			const overlay = marker(
				s.point.x,
				s.point.y,
				360,
				"point",
				"data-action-point",
				def.template === "force" ? "" : "●",
				`${def.template === "force" ? "Kraftpfeilspitze" : "Markierung"}. Mit Pfeiltasten verschieben.`,
			);
			content = frame(body, overlay, 360, true);
			break;
		}
	}
	return `<div data-model-action="${def.type}">${content}<div class="action-controls">${button("check", "data-action-check", "Konstruiertes Modell prüfen")}${button("clear", "data-action-clear", "Neu aufbauen")}</div></div>`;
}
