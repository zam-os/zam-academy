export type CouncilPhase = "places" | "voices" | "proposal";

export const SITES = {
	schulwiese: "Schulwiese",
	obstanger: "Obstanger",
} as const;
export type Site = keyof typeof SITES;
const residents = [
	{
		name: "Mira",
		role: "Schulkind",
		skin: "#ac7357",
		hair: "#493a36",
		coat: "#c87549",
		schulwiese:
			"Nach der Schule bin ich gleich hier. Auch mein kleiner Bruder kennt den kurzen Weg.",
		obstanger:
			"Hier hätten wir viel Platz. Von der Schule müssen wir aber über die Dorfstraße.",
	},
	{
		name: "Herr Aydin",
		role: "Nachbar",
		skin: "#d2a47d",
		hair: "#7e776c",
		coat: "#477989",
		schulwiese:
			"Mein Fenster geht zur Wiese. Ich mag das Lachen der Kinder. Nach der Nachtschicht brauche ich tagsüber auch Ruhe.",
		obstanger:
			"Der Obstanger ist weiter von den Häusern weg. Dort kann ein Ballspiel lauter werden.",
	},
	{
		name: "Frau Kern",
		role: "Gärtnerin",
		skin: "#ecbd95",
		hair: "#785846",
		coat: "#668063",
		schulwiese:
			"Auf der Wiese ist schon Platz zum Spielen. Unsere alten Apfelbäume am Obstanger könnten stehen bleiben.",
		obstanger:
			"In den alten Apfelbäumen nisten Vögel. Unter den Kronen brauchen die Wurzeln lockere Erde.",
	},
] as const;

const proposals = {
	schulwiese: [
		"Der Schulweg ist kurz. Für laute Ballspiele lassen wir Abstand zu den Häusern.",
		"Die Obstbäume bleiben stehen. Die Sitz- und Leseecke kommt an den Rand bei den Häusern.",
	],
	obstanger: [
		"Die Häuser sind weit weg. Wir bauen die Geräte auf die freie Fläche neben den Baumkronen.",
		"Hier ist viel Platz. Für den längeren Weg bitten wir den Rat um eine sichere Querung der Dorfstraße.",
	],
};

export class CouncilMeeting {
	site: Site | null = null;
	resident: number | null = null;
	readonly visited = new Set<Site>();
	readonly consulted = new Set<number>();
	reason: number | null = null;
	submitted = false;

	visit(site: Site): void {
		if (site === this.site) return;
		this.site = site;
		this.visited.add(site);
		this.resident = null;
		this.reason = null;
		this.submitted = false;
	}

	listen(index: number): void {
		if (!this.site || !residents[index]) return;
		this.resident = index;
		this.consulted.add(index);
	}

	get ready(): boolean {
		return this.visited.size === 2 && this.consulted.size >= 2;
	}

	submit(): Site | null {
		if (
			!this.ready ||
			!this.site ||
			this.reason === null ||
			!proposals[this.site][this.reason]
		)
			return null;
		this.submitted = true;
		return this.site;
	}
}

function portrait(r: (typeof residents)[number], index: number): string {
	return `<svg aria-hidden="true" viewBox="0 0 50 50">
		<circle cx="25" cy="25" r="24" fill="#f3e6ca"/>
		<path d="M5 48q1-17 20-17t20 17" fill="${r.coat}"/>
		<path d="M20 30h10v8q-5 5-10 0z" fill="${r.skin}"/>
		<ellipse cx="25" cy="22" rx="11" ry="13" fill="${r.skin}"/>
		<path d="${index === 0 ? "M12 27q-5-20 9-20 17-6 17 15-8-2-12-10-4 9-12 9z" : index === 1 ? "M13 21q-1-17 14-14 11 1 11 13l-5-5-12-2z" : "M13 26Q8 5 24 6q19-2 14 21l-6-12-16 1z"}" fill="${r.hair}"/>
		${index === 2 ? '<path d="m7 15 7-3 4-8h14l4 9 7 3q-14 4-36-1" fill="#d5ad68" stroke="#866d48"/>' : ""}
		<path d="M20 22h1m8 0h1m-8 6q3 3 6 0" fill="none" stroke="#4e3c31" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}

function village(): string {
	return `<svg class="village-model" viewBox="0 0 640 185" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Dorfmodell: links die Wiese neben Schule und Wohnhäusern, rechts der Obstanger jenseits der Dorfstraße">
		<defs><g id="apple-tree"><path d="m0 4-2 25h7L4 4" fill="#8e7050"/><path d="M-12 5q-15-8-5-19 1-15 15-12 14-7 19 7 13 7 4 19-6 9-16 4z" fill="#72986c" stroke="#4e7153" stroke-width="2"/><g fill="#cf6448"><circle cx="-9" cy="-9" r="3"/><circle cx="9" cy="-4" r="3"/><circle cx="2" cy="-18" r="3"/></g></g></defs>
		<rect width="640" height="185" fill="#d5e8db"/><path d="M0 40q75-33 168-7t155-2 180-9 137 7v156H0z" fill="#bfd3a2"/>
		<path d="M0 75q140-30 243-8t192-1 205-11v130H0z" fill="#a4bf89"/>
		<path d="M337 0q-39 55-10 99t66 86" fill="none" stroke="#efe6ca" stroke-width="42"/>
		<path d="M337 0q-39 55-10 99t66 86" fill="none" stroke="#a09a89" stroke-width="31"/>
		<path d="M337 0q-39 55-10 99t66 86" fill="none" stroke="#fff4d7" stroke-width="2" stroke-dasharray="7 9"/>
		<g stroke="#72604d" stroke-width="2" stroke-linejoin="round">
			<path d="M36 83V42h82v41z" fill="#f5d7a0"/><path d="m27 43 22-24h56l22 24z" fill="#bb6748"/>
			<path d="M66 83V63h15v20m-35-31h10v9H46zm47 0h10v9H93z" fill="#68a0a2"/>
			<path d="M176 72V43h35v29zm50-8V34h32v30z" fill="#f4dfb6"/><path d="m171 43 23-20 23 20zm50-9 21-17 22 17z" fill="#bf7659"/>
		</g>
		<path d="M46 119q95-37 183-10l34 55q-146 28-228-1Z" fill="#d4df9e" stroke="#91a66e" stroke-width="2"/>
		<path d="M400 120q83-37 186-15l24 52q-88 35-206 8z" fill="#d9dfa4" stroke="#91a66e" stroke-width="2"/>
		<use href="#apple-tree" x="412" y="54"/><use href="#apple-tree" x="464" y="64"/><use href="#apple-tree" x="530" y="52"/><use href="#apple-tree" x="591" y="72"/>
		<text x="77" y="101" text-anchor="middle" fill="#303f35" font-size="13" font-weight="bold">Schule</text>
		<g class="playground-piece" stroke="#65533d" stroke-width="3" stroke-linejoin="round">
			<ellipse cx="0" cy="0" rx="46" ry="8" fill="#a8ac7f" stroke="none"/>
			<path d="M-25 0v-39H0v39m-25-12H0m-25-8H0m-25-8H0" fill="none"/>
			<path d="m-32-39 19-19 20 19Z" fill="#c66b4d"/><path d="M0-33q10 1 17 17t25 11v6Q23 6 14-9T0-25z" fill="#72b0b5"/>
		</g></svg>`;
}

export function renderCouncil(phase: CouncilPhase): string {
	const sites = `<div class="site-choices" role="group" aria-label="Standort auswählen">
		${Object.entries(SITES)
			.map(
				([id, name]) =>
					`<button type="button" class="option-pill" data-action="council-site" data-site="${id}">${name}</button>`,
			)
			.join("")}
	</div>`;
	let activity = "";
	if (phase === "voices") {
		activity = `<div class="resident-row">${residents.map((r, i) => `<button class="resident" type="button" data-action="council-listen" data-index="${i}">${portrait(r, i)}<span><b>${r.name}</b><small>${r.role}</small></span></button>`).join("")}</div>
			<div class="resident-speech"><p data-quote aria-live="polite"></p><button type="button" class="btn" data-action="council-read" hidden>Vorlesen</button></div>`;
	} else if (phase === "proposal") {
		activity = `<div class="council-decision">
				<p data-guidance></p><button type="button" class="btn" data-action="council-consult">Menschen befragen</button>
				<div class="reason-options" role="group" aria-label="Deine Begründung"></div>
				<button type="button" class="btn btn-primary" data-action="council-submit">Vorschlag einbringen</button>
				<p data-result role="status"></p></div>`;
	}
	return `<section class="council-card" id="gemeinderat" aria-label="Spielplatz im Gemeinderat">
		<div class="council-model">${phase === "places" ? village() : ""}${sites}</div>
		${activity ? `<div class="council-floor">${activity}</div>` : ""}
	</section>`;
}

export function updateCouncil(
	panel: HTMLElement,
	meeting: CouncilMeeting,
	canRead: boolean,
): void {
	const site = meeting.site;
	panel.dataset.site = site ?? "";
	for (const button of panel.querySelectorAll<HTMLButtonElement>(
		"[data-action=council-site]",
	)) {
		button.setAttribute("aria-pressed", String(button.dataset.site === site));
	}
	for (const button of panel.querySelectorAll<HTMLButtonElement>(
		"[data-action=council-listen]",
	)) {
		button.disabled = !site;
		button.setAttribute(
			"aria-pressed",
			String(Number(button.dataset.index) === meeting.resident),
		);
	}
	const speaker =
		meeting.resident === null ? null : residents[meeting.resident];
	const quote = panel.querySelector("[data-quote]");
	if (quote)
		quote.textContent =
			site && speaker
				? speaker.name + " sagt: „" + speaker[site] + "“"
				: site
					? "Wessen Meinung zum Standort " +
						SITES[site] +
						" möchtest du erfahren?"
					: "Wähle zuerst einen Standort für das Spielplatzmodell.";
	const read = panel.querySelector<HTMLButtonElement>(
		"[data-action=council-read]",
	);
	if (read) read.hidden = !canRead || !speaker;
	const reasons = panel.querySelector<HTMLElement>(".reason-options");
	if (!reasons) return;
	panel.querySelector<HTMLButtonElement>(
		"[data-action=council-consult]",
	)!.hidden = meeting.consulted.size >= 2;
	if (reasons.dataset.site !== (site ?? "")) {
		reasons.innerHTML = site
			? proposals[site]
					.map(
						(reason, i) =>
							`<button type="button" class="choice-btn" data-action="council-reason" data-index="${i}">${reason}</button>`,
					)
					.join("")
			: "";
		reasons.dataset.site = site ?? "";
	}
	reasons.hidden = !meeting.ready;
	for (const button of reasons.querySelectorAll("button")) {
		button.setAttribute(
			"aria-pressed",
			String(Number(button.dataset.index) === meeting.reason),
		);
	}
	panel.querySelector("[data-guidance]")!.textContent = !meeting.ready
		? `Vergleiche beide Orte (${meeting.visited.size}/2) und befrage zwei Menschen (${Math.min(2, meeting.consulted.size)}/2).`
		: "Wem hilft dein Vorschlag? Wessen Anliegen hast du dabei bedacht?";
	panel.querySelector<HTMLButtonElement>(
		"[data-action=council-submit]",
	)!.disabled = meeting.reason === null || meeting.submitted;
	panel.querySelector("[data-result]")!.textContent =
		site && meeting.submitted
			? `Lotta notiert für den Rat: „${SITES[site]}: ${proposals[site][meeting.reason!]}“ Die Ratsmitglieder beraten und stimmen darüber ab.`
			: "";
}
