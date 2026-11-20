// These drawings are simplified, with a labeled section instead of a simulated microscope photograph.
const cases: Record<string, { title: string; drawing: string }> = {
	"b7-einzeller": {
		title: "Pantoffeltierchen mit Wimpern am Rand, seitlichem Zellmund und pulsierender Vakuole im Inneren",
		drawing: `
			<path d="M68 134C46 75 109 42 187 39c58-2 91 18 73 43-10 16-41 15-59 24-23 12-28 32-58 42-35 12-64 5-75-14Z" class="diagram-fill"/>
			<path d="M58 97l-11-6m12-3-9-9m16-2-7-12m17 1-6-12m19 5-3-13m16 6-2-12m17 7-1-13m16 9 1-13m17 10 2-14m17 12 3-14m16 13 4-13m18 14 5-11m16 14 6-11m10 16 9-8m3 18 11-4m-7 15h12m-13 11 11 4m-21 5 9 8m-145 37 4 13m-19-14 1 15m-18-19-4 13m-10-22-8 9m-1-23-13 5" class="diagram-line"/>
			<circle cx="123" cy="90" r="15" class="diagram-water"/><path d="M123 68v44m-21-22h42m-35-14 28 28m0-28-28 28" class="diagram-line"/>
			<path d="M199 110l25 17h104M123 90l48-22h197M68 149l-20 21h100" class="diagram-line"/>
			<text x="228" y="121">Zellmund</text><text x="176" y="61">Pulsierende Vakuole</text><text x="54" y="164">Wimpern</text>
		`,
	},
	"b7-wurzel": {
		title: "Wurzel im Längsschnitt mit Wurzelhaaren oberhalb der Spitze und Leitgewebe in der Mitte",
		drawing: `
			<path d="M119 14v96q1 43 37 64 36-21 37-64V14Z" class="diagram-fill"/>
			<path d="M148 14v111q3 10 8 15 5-5 8-15V14Z" class="diagram-green"/>
			<path d="M120 36q-16 1-42 9m42 10q-25 3-34 17m34 0q-23 2-44 15m44 3q-19 3-32 15m105-69q27 0 43 13m-43 6q22 4 34 14m-34 3q20 1 42 14m-42 5q18 3 33 14" class="diagram-line"/>
			<path d="M156 30H327M220 80h119M156 172h183" class="diagram-line"/>
			<text x="229" y="23">Leitgewebe</text><text x="235" y="74">Wurzelhaare</text><text x="230" y="163">Wurzelspitze</text>
		`,
	},
	"b7-sprossachse": {
		title: "Schematischer Querschnitt einer krautigen Sprossachse mit ringförmig angeordneten Leitbündeln",
		drawing: `
			<circle cx="122" cy="91" r="66" class="diagram-fill"/>
			<g class="diagram-green"><ellipse cx="122" cy="44" rx="12" ry="8"/><ellipse cx="161" cy="64" rx="11" ry="8" transform="rotate(50 161 64)"/><ellipse cx="165" cy="112" rx="11" ry="8" transform="rotate(-56 165 112)"/><ellipse cx="122" cy="139" rx="12" ry="8"/><ellipse cx="83" cy="114" rx="11" ry="8" transform="rotate(56 83 114)"/><ellipse cx="83" cy="64" rx="11" ry="8" transform="rotate(-56 83 64)"/></g>
			<path d="M160 64h190M122 92l61 28h168" class="diagram-line"/>
			<text x="216" y="54">Leitbündel</text><text x="221" y="112">Sprossgewebe</text>
			<text x="56" y="180">Querschnitt (Schema)</text>
		`,
	},
	"b7-laubblatt": {
		title: "Typischer Blattquerschnitt mit Cuticula, Epidermis, Palisadengewebe, Schwammgewebe und Spaltöffnung",
		drawing: `
			<path d="M18 28h175" stroke="#b8824a" stroke-width="5"/><path d="M18 42h175" stroke="#b4a37b" stroke-width="18"/>
			<g class="diagram-green"><rect x="20" y="54" width="23" height="48" rx="9"/><rect x="49" y="54" width="23" height="48" rx="9"/><rect x="78" y="54" width="23" height="48" rx="9"/><rect x="107" y="54" width="23" height="48" rx="9"/><rect x="136" y="54" width="23" height="48" rx="9"/><rect x="165" y="54" width="23" height="48" rx="9"/></g>
			<g class="diagram-green" opacity=".68"><ellipse cx="28" cy="118" rx="12" ry="7"/><ellipse cx="55" cy="133" rx="15" ry="8"/><ellipse cx="91" cy="115" rx="16" ry="7"/><ellipse cx="127" cy="129" rx="16" ry="8"/><ellipse cx="172" cy="117" rx="18" ry="8"/></g>
			<path d="M18 150h69m33 0h73" stroke="#b4a37b" stroke-width="13"/>
			<path d="M195 28h180M195 44h180M193 84h182M193 126h182M103 151l22 23h250" class="diagram-line"/>
			<text x="227" y="22">Cuticula</text><text x="228" y="58">Obere Epidermis</text><text x="228" y="78">Palisadengewebe</text><text x="228" y="120">Schwammgewebe</text><text x="228" y="166">Spaltöffnung</text>
		`,
	},
};

export function renderAnatomy(lessonId: string): string {
	const anatomy = cases[lessonId];
	if (!anatomy) return "";
	return `<figure class="model-figure section-art"><svg viewBox="0 0 390 190" role="img" aria-labelledby="anatomy-title">
		<title id="anatomy-title">${anatomy.title}</title>${anatomy.drawing}
	</svg></figure>`;
}
