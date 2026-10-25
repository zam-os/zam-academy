import { esc } from "./practice";
export interface Allocation {
	bus: number;
	green: number;
	culture: number;
}
export const RAT_GROUPS = [
	{ name: "Gruppe A", seats: 40, minimum: { bus: 40, green: 20, culture: 0 } },
	{ name: "Gruppe B", seats: 35, minimum: { bus: 0, green: 40, culture: 20 } },
	{ name: "Gruppe C", seats: 25, minimum: { bus: 20, green: 0, culture: 40 } },
] as const;
export function councilResult(allocation: Allocation) {
	const valid = [allocation.bus, allocation.green, allocation.culture].every(
		(v) => Number.isInteger(v) && v >= 0 && v <= 100,
	);
	const total = allocation.bus + allocation.green + allocation.culture;
	const affordable = valid && total <= 100;
	const groups = RAT_GROUPS.map((g) => ({
		name: g.name,
		seats: g.seats,
		agrees:
			affordable &&
			allocation.bus >= g.minimum.bus &&
			allocation.green >= g.minimum.green &&
			allocation.culture >= g.minimum.culture,
	}));
	const votes = groups.reduce((n, g) => n + (g.agrees ? g.seats : 0), 0);
	return {
		valid,
		total,
		remaining: 100 - total,
		affordable,
		groups,
		votes,
		majority: affordable && votes > 50,
	};
}
export function productResult(quantity: number, price: number) {
	if (
		!Number.isFinite(quantity) ||
		!Number.isFinite(price) ||
		quantity < 0 ||
		quantity > 200 ||
		price < 0 ||
		price > 30
	)
		return null;
	return {
		nominal: quantity * price,
		real: quantity * 10,
		nominalChange: ((quantity * price) / 1000 - 1) * 100,
		realChange: quantity - 100,
	};
}
export const formatNumber = (n: number) =>
	new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 })
		.format(n)
		.replace(/^-/, "−");
export function renderLab(id: string): string {
	if (id === "p10-satire")
		return `<svg class="caricature" viewBox="0 0 600 320" role="img" aria-labelledby="cartoon-title cartoon-desc"><title id="cartoon-title">Hier kommt jede Stimme zu Wort</title><desc id="cartoon-desc">Eigene erfundene Karikatur. Eine große Person steht am Redepult, zwei kleine Zuhörende daneben. Trotz des Beteiligungsversprechens zeigt ihre Redezeituhr bereits null.</desc><g fill="none" stroke="currentColor" stroke-width="3"><path d="M35 280H565"/><rect x="55" y="25" width="490" height="55" rx="10"/><circle cx="185" cy="130" r="27"/><path d="M145 202V165Q185 145 225 165V202M185 158V205"/><path d="M110 210H260L242 280H128Z"/><circle cx="400" cy="205" r="17"/><circle cx="475" cy="205" r="17"/><path d="M380 265V232H420V265M455 265V232H495V265"/><rect x="365" y="112" width="150" height="55" rx="7"/></g><g fill="currentColor" text-anchor="middle" font-family="system-ui,sans-serif"><text x="300" y="60" font-size="20">Hier kommt jede Stimme zu Wort.</text><text x="440" y="132" font-size="12">Eure Redezeit</text><text x="440" y="156" font-size="23">0:00</text><text x="185" y="246" font-size="14">Sitzungsleitung</text></g></svg>`;
	if (id === "p10-debatte")
		return `<div class="lab"><h3>Budgetwerkstatt · einen Kompromiss suchen</h3><p class="small">Erfundenes Modell: 100 frei verteilbare Punkte und 100 Sitze. Jede Gruppe stimmt geschlossen zu, sobald ihre festen Mindestwerte erfüllt sind. Keine Enthaltungen. Mehr als 50 Ja-Stimmen ergeben eine Mehrheit. Recht, Pflichtausgaben und echte Verhandlungen sind nicht abgebildet.</p><div class="lab-controls">${(
			[
				["bus", "Bus"],
				["green", "Grünflächen"],
				["culture", "Jugendkultur"],
			] as const
		)
			.map(
				([key, label]) =>
					`<label>${label}: <output id="${key}-value">30</output><input type="range" data-budget="${key}" aria-label="${label}" min="0" max="100" step="10" value="30"></label>`,
			)
			.join(
				"",
			)}</div><table><caption>Feste Rollen im Modell</caption><thead><tr><th>Gruppe / Sitze</th><th>Zustimmung ab</th></tr></thead><tbody><tr><td>A · 40</td><td>Bus 40 und Grün 20</td></tr><tr><td>B · 35</td><td>Grün 40 und Kultur 20</td></tr><tr><td>C · 25</td><td>Kultur 40 und Bus 20</td></tr></tbody></table><div id="budget-result" class="lab-result" role="status" aria-live="polite"></div><p>Finde zwei verschiedene Mehrheiten. Wer erhält jeweils weniger als gewünscht? Welchen Gegengrund würdest du in einer echten Verhandlung aufnehmen?</p></div>`;
	if (id === "p10-bip")
		return `<div class="lab"><h3>Menge oder Preis?</h3><p class="small">Einproduktmodell ohne Vorleistungen. Ausgangsjahr: 100 Einheiten zu 10 Euro. Realer Wert hier stets zu diesem Ausgangspreis. Keine vollständige BIP-Messung, keine Prognose.</p><div class="lab-controls"><label>Menge im Folgejahr <input id="quantity" aria-label="Menge im Folgejahr" type="number" min="0" max="200" step="1" value="100"></label><label>Preis je Einheit im Folgejahr (Euro) <input id="price" aria-label="Preis je Einheit im Folgejahr" type="number" min="0" max="30" step="0.5" value="12"></label></div><div id="product-result" class="lab-result" role="status" aria-live="polite"></div></div>`;
	return "";
}
export function bindLab(root: HTMLElement, id: string): void {
	if (id === "p10-debatte") {
		const inputs = [
			...root.querySelectorAll<HTMLInputElement>("[data-budget]"),
		];
		const update = () => {
			const allocation: Allocation = { bus: 0, green: 0, culture: 0 };
			for (const input of inputs) {
				const key = input.dataset.budget as keyof Allocation;
				allocation[key] = Number(input.value);
				const output = root.querySelector(`#${key}-value`);
				if (output) output.textContent = input.value;
			}
			const r = councilResult(allocation);
			const output = root.querySelector("#budget-result");
			if (output)
				output.innerHTML = !r.affordable
					? `<strong>Budget überschritten: ${r.total} von 100 Punkten.</strong><p>Verringere Ausgaben, bevor eine Mehrheit im Modell ermittelt wird.</p>`
					: `<strong>${r.votes} Ja-Stimmen · ${r.majority ? "Mehrheit erreicht" : "noch keine Mehrheit"}</strong><p>${r.total} Punkte verteilt, ${r.remaining} verbleiben.</p><ul>${r.groups.map((g) => `<li>${esc(g.name)} (${g.seats} Sitze): ${g.agrees ? "stimmt zu" : "Mindestwerte nicht erfüllt"}</li>`).join("")}</ul>`;
		};
		inputs.forEach((input) => {
			input.addEventListener("input", update);
		});
		update();
	}
	if (id === "p10-bip") {
		const quantity = root.querySelector<HTMLInputElement>("#quantity");
		const price = root.querySelector<HTMLInputElement>("#price");
		const output = root.querySelector("#product-result");
		if (!quantity || !price || !output) return;
		const update = () => {
			const r =
				quantity.value !== "" && price.value !== ""
					? productResult(Number(quantity.value), Number(price.value))
					: null;
			output.innerHTML = r
				? `<p><strong>Nominal: ${formatNumber(r.nominal)} Euro (${formatNumber(r.nominalChange)} %)</strong></p><div class="bar-track"><div class="bar-fill" style="width:${r.nominal / 60}%"></div></div><p><strong>Zu Ausgangspreisen: ${formatNumber(r.real)} Euro (${formatNumber(r.realChange)} %)</strong></p><div class="bar-track"><div class="bar-fill" style="width:${r.real / 60}%"></div></div><p class="small">Gemeinsame Balkenskala: 0 bis 6.000 Euro. Aus der nominalen Veränderung allein lässt sich kein realer Mengenzuwachs ableiten.</p>`
				: "Bitte gib eine Menge von 0 bis 200 und einen Preis von 0 bis 30 Euro ein.";
		};
		quantity.addEventListener("input", update);
		price.addEventListener("input", update);
		update();
	}
}
