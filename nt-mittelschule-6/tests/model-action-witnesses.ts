import type { LabState } from "../src/lab-model";
import type { LabKind } from "../src/model/types";
import { actionFor, actionState, applyModelAction } from "../src/model-actions";

// Subject answers are independent of the task's stored expected labels, edges and outcomes.
export const LABEL_WITNESSES: Partial<Record<LabKind, string[]>> = {
	waterUse: ["Lebensraum", "Lebensmittel", "Transportmittel"],
	properties: ["0 °C", "100 °C"],
	gases: ["Wasserstoff", "Sauerstoff"],
	photosynthesis: [
		"Wasser",
		"Kohlenstoffdioxid",
		"Licht",
		"Traubenzucker",
		"Sauerstoff",
	],
	soilLife: ["Ringelwürmer", "Spinnentiere", "Krebstiere"],
	aquaticKey: ["Sechs Beine", "Zwei Schwanzfäden"],
	fish: ["Kiemen", "Schwanzflosse", "Schwimmblase"],
	puberty: [
		"Körperliche Veränderung",
		"Seelische Veränderung",
		"Hygienemaßnahme",
	],
	organs: ["Eierstock", "Eileiter", "Gebärmutter", "Vagina"],
	contraception: ["Kondom", "Pille", "Kondom"],
};
export const ORDER_WITNESSES: Partial<Record<LabKind, string[]>> = {
	inquiry: [
		"Fragestellung und konstante Bedingungen festlegen",
		"Nur die Temperatur verändern, Lösezeiten messen und notieren",
		"Messwerte vergleichen und eine begrenzte Schlussfolgerung formulieren",
	],
	safety: [
		"Arbeit stoppen und Abstand zu den Splittern halten",
		"Lehrkraft informieren",
		"Weitere Schritte nur nach der Anweisung der Lehrkraft ausführen",
	],
	soil: ["Streu", "Belebter Oberboden", "Verwitterter Unterboden", "Gestein"],
	fertilisation: [
		"Befruchtung meist im Eileiter",
		"Zellteilungen auf dem Weg zur Gebärmutter",
		"Einnistung in die Gebärmutterschleimhaut",
	],
	pregnancy: [
		"Befruchtung",
		"Zellteilungen und Einnistung",
		"Organanlage sowie Wachstum und Reifung",
		"Geburt",
	],
	ergonomics: [
		"Aufgabe, Last und Werkzeugzustand prüfen",
		"Geeignete Hilfe und sichere Arbeitsbedingungen auswählen",
		"Handhabung nach Einweisung sachgerecht ausführen",
	],
};
export const EDGE_WITNESSES: Partial<Record<LabKind, [string, string][]>> = {
	foodweb: [
		["leaf", "caterpillar"],
		["leaf", "aphid"],
		["caterpillar", "bird"],
		["aphid", "bird"],
	],
	aquaticWeb: [
		["algae", "flea"],
		["flea", "fish"],
		["larva", "fish"],
	],
};
export const TRIAL_WITNESSES: Partial<Record<LabKind, Record<string, string>>> =
	{
		solutions: {
			salt: "klar und deutlich leitend",
			sugar: "klar und kaum leitend",
		},
		tension: {
			clean: "Grenzfläche kann das leichte Modellobjekt tragen",
			soap: "Tragwirkung der Grenzfläche nimmt ab",
		},
		inertia: {
			loose: "Klotz bewegt sich relativ zum Wagen weiter",
			secured: "Befestigung ändert die Klotzbewegung mit dem Wagen",
		},
	};
export function constructWitness(kind: LabKind, state: LabState): void {
	const def = actionFor(kind);
	if (!def) return;
	if (def.type === "labels")
		LABEL_WITNESSES[kind]!.forEach((label, index) => {
			applyModelAction(kind, state, { type: "select-label", label });
			applyModelAction(kind, state, { type: "place", target: String(index) });
		});
	else if (def.type === "order")
		ORDER_WITNESSES[kind]!.forEach((item, target) => {
			let index = actionState(kind, state).order.findIndex(
				(i) => def.items[i] === item,
			);
			if (index < 0)
				throw Error(`Missing independent order witness: ${kind}/${item}`);
			while (index > target)
				applyModelAction(kind, state, {
					type: "move",
					index: index--,
					delta: -1,
				});
		});
	else if (def.type === "network")
		for (const [from, to] of EDGE_WITNESSES[kind]!) {
			applyModelAction(kind, state, { type: "node", id: from });
			applyModelAction(kind, state, { type: "node", id: to });
		}
	else if (def.type === "experiment")
		for (const [trial, outcome] of Object.entries(TRIAL_WITNESSES[kind]!)) {
			applyModelAction(kind, state, { type: "predict", trial, outcome });
			applyModelAction(kind, state, { type: "run", trial });
		}
	else if (def.type === "molecule") {
		applyModelAction(kind, state, { type: "atom", element: "H", delta: 1 });
		applyModelAction(kind, state, { type: "atom", element: "H", delta: 1 });
		applyModelAction(kind, state, { type: "atom", element: "O", delta: 1 });
	} else if (def.type === "scenario") {
		applyModelAction(kind, state, {
			type: "feature",
			id: "plants",
			checked: true,
		});
		applyModelAction(kind, state, {
			type: "feature",
			id: "trash",
			checked: false,
		});
		applyModelAction(kind, state, {
			type: "feature",
			id: "weir",
			checked: false,
		});
	} else if (def.type === "point")
		applyModelAction(
			kind,
			state,
			kind === "forces"
				? { type: "point", x: 300, y: 100 }
				: { type: "point", x: 470, y: 180 },
		);
}
