import { esc } from "./practice";

export interface ItalyPlace {
	id: string;
	name: string;
	layer: "campania" | "italy" | "carthage" | "greece";
	x: number;
	y: number;
	labelX: number;
	labelY: number;
	anchor?: "start" | "middle" | "end";
	note: string;
}

export const ITALY_PLACES: ItalyPlace[] = [
	{
		id: "rom",
		name: "Rom (Rōma)",
		layer: "italy",
		x: 218,
		y: 120,
		labelX: 218,
		labelY: 106,
		anchor: "middle",
		note: "Rōma: Hauptstadt der Republik am Tiber in Latium; von hier aus breitete sich die Macht über ganz Italien und das Mittelmeer aus.",
	},
	{
		id: "misenum",
		name: "Misenum",
		layer: "campania",
		x: 244,
		y: 152,
		labelX: 230,
		labelY: 154,
		anchor: "end",
		note: "Mīsēnum (Kampanien): Römischer Flottenstützpunkt am Nordwestrand des Golfs von Neapel; hier beobachtete Plinius d. J. den Ausbruch des Vesuvs.",
	},
	{
		id: "vesuv",
		name: "Vesuv (79 n. Chr.)",
		layer: "campania",
		x: 266,
		y: 150,
		labelX: 268,
		labelY: 136,
		anchor: "middle",
		note: "Vesuvius: Vulkan am Golf von Neapel; begrub 79 n. Chr. Pompeji unter Bimsstein/Asche und Herkulaneum unter pyroklastischen Strömen.",
	},
	{
		id: "herkulaneum",
		name: "Herkulaneum",
		layer: "campania",
		x: 260,
		y: 162,
		labelX: 246,
		labelY: 178,
		anchor: "end",
		note: "Herculāneum: Küstenstadt westlich des Vesuvs; bis zu 20 m heiße Schlamm- und Gesteinsströme erhielten Holzdecken und verkohlte Papyrusrollen.",
	},
	{
		id: "pompeji",
		name: "Pompeji",
		layer: "campania",
		x: 274,
		y: 166,
		labelX: 288,
		labelY: 180,
		anchor: "start",
		note: "Pompēiī: Wohlhabende Stadt am Vesuv; unter meterdickem Bimsstein und Asche als einzigartige Momentaufnahme des römischen Alltags konserviert.",
	},
	{
		id: "cannae",
		name: "Cannae (216 v. Chr.)",
		layer: "italy",
		x: 310,
		y: 138,
		labelX: 324,
		labelY: 132,
		anchor: "start",
		note: "Cannae (Apulien): Schauplatz der schwersten römischen Niederlage gegen Hannibal Barkas im Zweiten Punischen Krieg (216 v. Chr.).",
	},
	{
		id: "syrakus",
		name: "Syrakus (Magna Graecia)",
		layer: "italy",
		x: 294,
		y: 244,
		labelX: 308,
		labelY: 248,
		anchor: "start",
		note: "Syrācūsae (Sizilien / Magna Graecia): Führende griechische Stadt in Großgriechenland, Heimat des Archimedes (212 v. Chr. von Rom eingenommen).",
	},
	{
		id: "karthago",
		name: "Karthago",
		layer: "carthage",
		x: 214,
		y: 284,
		labelX: 200,
		labelY: 280,
		anchor: "end",
		note: "Carthāgō (Nordafrika, heutiges Tunesien): Mächtige Handels- und Seemacht; Roms große Rivalin in den drei Punischen Kriegen (146 v. Chr. zerstört).",
	},
	{
		id: "zama",
		name: "Zama (202 v. Chr.)",
		layer: "carthage",
		x: 196,
		y: 308,
		labelX: 184,
		labelY: 324,
		anchor: "end",
		note: "Zama (Nordafrika): Südwestlich von Karthago besiegte der römische Feldherr Scipio hier 202 v. Chr. Hannibal endgültig im 2. Punischen Krieg.",
	},
	{
		id: "athen",
		name: "Athen",
		layer: "greece",
		x: 484,
		y: 160,
		labelX: 484,
		labelY: 146,
		anchor: "middle",
		note: "Athēnae (Attika/Griechenland): Zentrum der Attischen Demokratie (5. Jh. v. Chr.), der Vasenmalerei, der Philosophie und Heimat des Theseus.",
	},
	{
		id: "kreta",
		name: "Kreta (Labyrinth)",
		layer: "greece",
		x: 504,
		y: 250,
		labelX: 504,
		labelY: 274,
		anchor: "middle",
		note: "Crēta: Südliche Ägäisinsel; Schauplatz der Sagen um Europa, König Minos, Theseus, Ariadne sowie Daedalus und Ikarus.",
	},
	{
		id: "troja",
		name: "Troja",
		layer: "greece",
		x: 566,
		y: 122,
		labelX: 578,
		labelY: 118,
		anchor: "start",
		note: "Trōia (Kleinasien nahe der Dardanellen): Schauplatz des zehnjährigen Trojanischen Krieges um Helena, Achilles, Hektor und das Holzpferd.",
	},
];

export function renderItalyMap(
	activeLayer: "all" | ItalyPlace["layer"] = "all",
	selectedId = "pompeji",
): string {
	const selected =
		ITALY_PLACES.find((entry) => entry.id === selectedId) ?? ITALY_PLACES[4];
	const opacityFor = (layer: ItalyPlace["layer"]) =>
		activeLayer === "all" || activeLayer === layer ? "1" : "0.22";

	return `<figure class="rome-map">
		<div class="explorer-controls" role="group" aria-label="Kartenebenen filtern">
			<button type="button" data-map-focus="all" aria-pressed="${activeLayer === "all"}">Gesamtraum</button>
			<button type="button" data-map-focus="campania" aria-pressed="${activeLayer === "campania"}">Vesuv &amp; Kampanien</button>
			<button type="button" data-map-focus="italy" aria-pressed="${activeLayer === "italy"}">Italien &amp; Magna Graecia</button>
			<button type="button" data-map-focus="carthage" aria-pressed="${activeLayer === "carthage"}">Karthago &amp; Punier</button>
			<button type="button" data-map-focus="greece" aria-pressed="${activeLayer === "greece"}">Athen · Kreta · Troja</button>
		</div>
		<svg viewBox="0 0 640 340" role="img" aria-label="Karte des antiken Italiens, Magna Graecia und des Mittelmeerraums mit Vesuv, Pompeji, Herkulaneum, Karthago, Athen, Kreta und Troja">
			<rect x="0" y="0" width="640" height="340" rx="12" fill="var(--rome-water)"/>
			<!-- Alps & northern landmass -->
			<path d="M12 12 L348 12 L352 46 Q278 44 236 62 L212 52 Q162 42 124 72 L12 88 Z" fill="var(--rome-land)" stroke="var(--line-strong)" stroke-width="1.2"/>
			<path d="M84 34 Q188 14 294 34" fill="none" stroke="var(--v-line)" stroke-width="2.2" stroke-dasharray="4 4"/>
			<text x="188" y="24" text-anchor="middle" font-size="10" font-weight="700" class="rome-label-halo">Alpen (Alpēs)</text>
			<!-- Italian Peninsula -->
			<path d="M172 48 L228 54 L268 88 L302 124 L336 146 L342 158 L320 174 L326 206 L310 220 L294 196 L264 166 L220 132 L182 86 Z" fill="var(--rome-land)" stroke="var(--line-strong)" stroke-width="1.4"/>
			<!-- Sicily & Sardinia/Corsica -->
			<path d="M250 224 L302 222 L296 254 L264 246 Z" fill="var(--rome-land)" stroke="var(--line-strong)" stroke-width="1.3"/>
			<path d="M140 112 L162 108 L164 142 L144 142 Z" fill="var(--rome-land)" stroke="var(--line-strong)" stroke-width="1.1"/>
			<path d="M138 150 L166 148 L168 196 L140 198 Z" fill="var(--rome-land)" stroke="var(--line-strong)" stroke-width="1.1"/>
			<!-- North Africa (Carthage) -->
			<path d="M68 292 Q158 278 214 274 L240 296 L286 326 L68 328 Z" fill="var(--rome-land)" stroke="var(--line-strong)" stroke-width="1.4"/>
			<!-- Greece, Peloponnese, Crete, Asia Minor -->
			<path d="M402 48 L478 52 L506 112 L498 164 L478 168 L466 196 L438 198 L422 152 L396 108 Z" fill="var(--rome-land)" stroke="var(--line-strong)" stroke-width="1.4"/>
			<path d="M466 244 L542 246 L540 258 L468 256 Z" fill="var(--rome-land)" stroke="var(--line-strong)" stroke-width="1.3"/>
			<path d="M554 96 L628 96 L628 218 L556 208 L546 154 Z" fill="var(--rome-land)" stroke="var(--line-strong)" stroke-width="1.4"/>
			<text x="380" y="294" text-anchor="middle" font-size="11" font-style="italic" opacity="0.65">Mare Nostrum (Mittelmeer)</text>

			<!-- Layer accents -->
			<g data-map-layer="italy" style="opacity:${opacityFor("italy")}">
				<path d="M254 206 C282 182 324 198 318 252" fill="none" stroke="var(--v-orange)" stroke-width="2" stroke-dasharray="5 4"/>
				<text x="328" y="220" text-anchor="start" font-size="10" font-weight="700" class="rome-label-halo">Magna Graecia</text>
			</g>
			<g data-map-layer="carthage" style="opacity:${opacityFor("carthage")}">
				<path d="M214 284 C236 258 258 248 270 236" fill="none" stroke="var(--v-coral)" stroke-width="2" stroke-dasharray="4 4"/>
			</g>
			<g data-map-layer="campania" style="opacity:${opacityFor("campania")}">
				<polygon points="266,143 260,154 272,154" class="v-coral"/>
			</g>

			${ITALY_PLACES.map((place) => {
				const isSelected = place.id === selected.id;
				const visible = activeLayer === "all" || activeLayer === place.layer;
				return `<g class="visual-part" data-place="${esc(place.id)}" data-map-layer="${place.layer}" style="opacity:${visible ? "1" : "0.22"}" tabindex="0" role="button" aria-label="${esc(place.name)}">
					<circle cx="${place.x}" cy="${place.y}" r="${isSelected ? 7.5 : 5.5}" fill="${isSelected ? "var(--stage-color, var(--accent))" : "var(--v-paper)"}" stroke="var(--stage-color, var(--accent))" stroke-width="2.2"/>
					<text x="${place.labelX}" y="${place.labelY}" text-anchor="${place.anchor ?? "middle"}" class="rome-label-halo">${esc(place.name.replace(/ \(.*\)/, ""))}</text>
				</g>`;
			}).join("")}
		</svg>
		<div class="explorer-controls" role="group" aria-label="Stätten und Orte auswählen" style="margin-top:0.65rem">
			${ITALY_PLACES.map((place) => `<button type="button" data-place-btn="${esc(place.id)}" aria-pressed="${place.id === selected.id}">${esc(place.name.replace(/ \(.*\)/, ""))}</button>`).join("")}
		</div>
		<p id="rome-map-note" class="explorer-readout" role="status" aria-live="polite"><strong>${esc(selected.name)}:</strong> ${esc(selected.note)}</p>
	</figure>`;
}
