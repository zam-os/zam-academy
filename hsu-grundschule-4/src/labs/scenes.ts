import { escapeHtml } from "../model/format";
import type { LabState, Lesson } from "../model/types";

function badge(
	x: number,
	y: number,
	w: number,
	text: string,
	ok: boolean,
): string {
	const fill = ok ? "#16803c" : "#b45309";
	return `<g transform="translate(${x},${y})">
		<rect width="${w}" height="24" rx="12" fill="${fill}" />
		<text x="${w / 2}" y="16" text-anchor="middle" font-size="11.5" font-weight="700" fill="#ffffff">${escapeHtml(text)}</text>
	</g>`;
}

function panelCard(x: number, y: number, w: number, h: number, title: string): string {
	return `<g>
		<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="var(--lab-card, #ffffff)" stroke="var(--lab-stroke, #cbd5e1)" stroke-width="1.6" />
		<text x="${x + 12}" y="${y + 21}" font-size="11.5" font-weight="800" fill="var(--lab-ink, #1e293b)">${escapeHtml(title)}</text>
	</g>`;
}

function renderSceneBody(lessonId: string, s: LabState): string {
	switch (lessonId) {
		case "gemeinschaft-kinderrechte": {
			const geheim = s.kabine === "geheim";
			const gleich = s.stimmrecht === "alleGleich";
			const fair = s.pausenstreit === "kompromiss";
			return `
				${panelCard(14, 14, 194, 212, "1. Wahlkabine")}
				<rect x="52" y="48" width="118" height="106" rx="10" fill="${geheim ? "#dcfce7" : "#fef3c7"}" stroke="${geheim ? "#16a34a" : "#d97706"}" stroke-width="2"/>
				${
					geheim
						? `<rect x="66" y="58" width="90" height="58" rx="6" fill="#15803d" opacity="0.16"/>
						   <rect x="86" y="112" width="50" height="34" rx="5" fill="#1e293b"/>
						   <rect x="99" y="106" width="24" height="6" rx="2" fill="#f8fafc"/>
						   <text x="111" y="90" text-anchor="middle" font-size="12" font-weight="700" fill="#14532d">Sichtschutz</text>`
						: `<text x="111" y="92" text-anchor="middle" font-size="26">🗣️</text>
						   <text x="111" y="122" text-anchor="middle" font-size="11" font-weight="700" fill="#92400e">Alle schauen zu!</text>`
				}
				${badge(31, 186, 160, geheim ? "Geheime Urnenwahl" : "Offener Zuruf", geheim)}

				${panelCard(223, 14, 194, 212, "2. Stimmrecht")}
				${[0, 1, 2, 3, 4, 5]
					.map((idx) => {
						const col = idx % 3;
						const row = Math.floor(idx / 3);
						const cx = 266 + col * 54;
						const cy = 78 + row * 54;
						const active = gleich || row === 0;
						return `<g>
							<circle cx="${cx}" cy="${cy}" r="18" fill="${active ? "#2563eb" : "#94a3b8"}" opacity="${active ? "0.9" : "0.35"}"/>
							<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">${active ? "1×" : "0×"}</text>
						</g>`;
					})
					.join("")}
				${badge(240, 186, 160, gleich ? "Alle: je 1 Stimme" : "Nur 1. Reihe", gleich)}

				${panelCard(432, 14, 194, 212, "3. Pausen-Kompromiss")}
				<rect x="452" y="50" width="154" height="104" rx="10" fill="${fair ? "#ecfccb" : "#fee2e2"}" stroke="${fair ? "#65a30d" : "#dc2626"}" stroke-width="2"/>
				<text x="529" y="88" text-anchor="middle" font-size="24">${fair ? "⚽ 🤝 🧑‍🦽" : "⚡ 😠 ⚡"}</text>
				<text x="529" y="118" text-anchor="middle" font-size="11.5" font-weight="700" fill="${fair ? "#365314" : "#991b1b"}">${fair ? "Fairer Wechselplan" : "Streit ohne Regeln"}</text>
				<text x="529" y="138" text-anchor="middle" font-size="10.5" fill="var(--lab-muted, #475569)">${fair ? "Inklusion gelebt" : "Kinder ausgeschlossen"}</text>
				${badge(449, 186, 160, fair ? "Kompromiss aktiv" : "Noch kein Plan", fair)}
			`;
		}

		case "unsere-gemeinde": {
			const pflichtOk = s.wasserFeuerwehr === "pflicht";
			const freiOk = s.buechereiBad === "freiwillig";
			const wieseOk = s.wiese === "ausgleich";
			return `
				${panelCard(14, 14, 194, 212, "Wasser & Feuerwehr")}
				<rect x="34" y="50" width="154" height="104" rx="10" fill="${pflichtOk ? "#dbeafe" : "#fef3c7"}" stroke="#3b82f6" stroke-width="1.8"/>
				<text x="111" y="92" text-anchor="middle" font-size="28">🚒 💧</text>
				<text x="111" y="124" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1e3a8a">Grundversorgung &amp; Schutz</text>
				${badge(31, 186, 160, pflichtOk ? "Pflichtaufgabe ✓" : "Falsch zugeordnet", pflichtOk)}

				${panelCard(223, 14, 194, 212, "Bücherei & Freibad")}
				<rect x="243" y="50" width="154" height="104" rx="10" fill="${freiOk ? "#e0e7ff" : "#fef3c7"}" stroke="#6366f1" stroke-width="1.8"/>
				<text x="320" y="92" text-anchor="middle" font-size="28">📚 🏊</text>
				<text x="320" y="124" text-anchor="middle" font-size="11.5" font-weight="700" fill="#312e81">Kultur &amp; Freizeitangebot</text>
				${badge(240, 186, 160, freiOk ? "Freiwillige Aufgabe ✓" : "Als Pflicht markiert", freiOk)}

				${panelCard(432, 14, 194, 212, "Rathaus-Wiesenplan")}
				<rect x="452" y="50" width="154" height="104" rx="10" fill="${wieseOk ? "#dcfce7" : s.wiese === "nurRuhe" ? "#fef9c3" : "#e2e8f0"}" stroke="${wieseOk ? "#16a34a" : "#64748b"}" stroke-width="2"/>
				<text x="529" y="88" text-anchor="middle" font-size="24">${wieseOk ? "🛝 🪑 🐝" : s.wiese === "nurRuhe" ? "🪑 🚫 ⚽" : "🚗 🚗 🚗"}</text>
				<text x="529" y="122" text-anchor="middle" font-size="10" font-weight="700" fill="#1e293b">${wieseOk ? "Spiel + Bank + Blühstreifen" : s.wiese === "nurRuhe" ? "Kinder gehen leer aus" : "Alles zubetoniert"}</text>
				${badge(449, 186, 160, wieseOk ? "Gemeinwohl-Lösung" : "Einseitiger Beschluss", wieseOk)}
			`;
		}

		case "medien-und-konsum": {
			const lupeAn = s.lupe === "an";
			const bueck = s.regal === "bueck";
			const mehrweg = s.wahl === "mehrweg";
			return `
				${panelCard(14, 14, 200, 212, "Werbe-Detektivlupe")}
				<rect x="34" y="48" width="160" height="108" rx="10" fill="${lupeAn ? "#dcfce7" : "#fae8ff"}" stroke="${lupeAn ? "#16a34a" : "#a855f7"}" stroke-width="2"/>
				<circle cx="114" cy="92" r="28" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
				<line x1="134" y1="112" x2="154" y2="132" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
				<text x="114" y="97" text-anchor="middle" font-size="11.5" font-weight="800" fill="${lupeAn ? "#b91c1c" : "#7e22ce"}">${lupeAn ? "42 % Zucker!" : "SUPER-FIT!"}</text>
				${badge(34, 186, 160, lupeAn ? "Werbetrick enttarnt" : "Lupe ausgeschaltet", lupeAn)}

				${panelCard(226, 14, 188, 212, "Supermarkt-Regal")}
				<rect x="248" y="48" width="144" height="32" rx="6" fill="${s.regal === "sicht" ? "#fde68a" : "#f1f5f9"}" stroke="#94a3b8"/>
				<text x="320" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">Augenhöhe: Markenware</text>
				<rect x="248" y="86" width="144" height="32" rx="6" fill="${s.regal === "kasse" ? "#fecaca" : "#f1f5f9"}" stroke="#94a3b8"/>
				<text x="320" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">Kasse: Quengelware</text>
				<rect x="248" y="124" width="144" height="32" rx="6" fill="${bueck ? "#bbf7d0" : "#f1f5f9"}" stroke="${bueck ? "#16a34a" : "#94a3b8"}" stroke-width="2"/>
				<text x="320" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="#14532d">Unten: Bückzone (günstig)</text>
				${badge(240, 186, 160, bueck ? "Preisvergleich unten ✓" : "Teure Lockzone", bueck)}

				${panelCard(426, 14, 200, 212, "Einkaufskorb")}
				<rect x="446" y="48" width="160" height="108" rx="10" fill="${mehrweg ? "#dcfce7" : "#fee2e2"}" stroke="${mehrweg ? "#16a34a" : "#ef4444"}" stroke-width="2"/>
				<text x="526" y="92" text-anchor="middle" font-size="28">${mehrweg ? "🍶 ♻️ 🍎" : "🥤 🗑️ ✈️"}</text>
				<text x="526" y="126" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">${mehrweg ? "Mehrweg &amp; regional" : "Einweg-Plastikmüll"}</text>
				${badge(446, 186, 160, mehrweg ? "Nachhaltig gewählt" : "Viel Verpackungsmüll", mehrweg)}
			`;
		}

		case "wunderwerk-auge": {
			const pupilR = s.licht === "nacht" ? 26 : s.licht === "sonne" ? 9 : 17;
			const innen = s.ansicht === "innen";
			const schutzAktiv = s.schutz !== "ruhig";
			return `
				${panelCard(14, 14, 390, 212, innen ? "Längsschnitt: Weg des Lichts im Auge" : "Vorderansicht: Regenbogenhaut & Pupille")}
				${
					innen
						? `<g>
							<circle cx="235" cy="120" r="64" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3"/>
							<path d="M 173 92 Q 154 120 173 148" fill="none" stroke="#0284c7" stroke-width="4"/>
							<ellipse cx="188" cy="120" rx="8" ry="24" fill="#93c5fd" stroke="#0369a1" stroke-width="2"/>
							<path d="M 299 112 L 352 112 L 352 128 L 299 128" fill="#fde68a" stroke="#ca8a04" stroke-width="2"/>
							<line x1="76" y1="95" x2="188" y2="114" stroke="#f59e0b" stroke-width="2.5"/>
							<line x1="188" y1="114" x2="294" y2="138" stroke="#f59e0b" stroke-width="2.5"/>
							<line x1="76" y1="145" x2="188" y2="126" stroke="#f59e0b" stroke-width="2.5"/>
							<line x1="188" y1="126" x2="294" y2="102" stroke="#f59e0b" stroke-width="2.5"/>
							<text x="58" y="125" font-size="24">🕯️</text>
							<text x="278" y="126" font-size="16" transform="rotate(180 282 120)">🕯️</text>
							<text x="188" y="164" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1e3a8a">Linse</text>
							<text x="282" y="178" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9a3412">Netzhaut</text>
							<text x="352" y="104" text-anchor="middle" font-size="10.5" font-weight="700" fill="#854d0e">Sehnerv</text>
						</g>`
						: `<g>
							<path d="M 95 72 Q 209 48 323 72" fill="none" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
							<path d="M 105 126 Q 209 64 313 126 Q 209 188 105 126 Z" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
							<circle cx="209" cy="126" r="38" fill="#0ea5e9" stroke="#0369a1" stroke-width="2"/>
							<circle cx="209" cy="126" r="${pupilR}" fill="#0f172a"/>
							<circle cx="197" cy="113" r="6" fill="#ffffff" opacity="0.9"/>
							${
								s.schutz === "staub"
									? `<path d="M 105 126 Q 209 92 313 126" fill="#fed7aa" opacity="0.72"/>
									   <text x="330" y="150" font-size="20">💧</text>`
									: s.schutz === "schweiss"
										? `<text x="332" y="78" font-size="18">💦↘</text>`
										: ""
							}
						</g>`
				}
				<text x="209" y="210" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--lab-ink, #1e293b)">Pupille: ${s.licht === "sonne" ? "klein (Blendschutz)" : s.licht === "nacht" ? "groß (viel Restlicht)" : "mittel"}</text>

				${panelCard(418, 14, 208, 212, "Licht & Schutzstatus")}
				<text x="522" y="78" text-anchor="middle" font-size="30">${s.licht === "sonne" ? "☀️" : s.licht === "nacht" ? "🌙" : "💡"}</text>
				<text x="522" y="114" text-anchor="middle" font-size="12" font-weight="700" fill="var(--lab-ink, #1e293b)">${s.schutz === "staub" ? "Lidschluss + Tränen" : s.schutz === "schweiss" ? "Braue leitet Schweiß ab" : "Ruhige Umgebung"}</text>
				${badge(442, 142, 160, s.licht === "sonne" ? "Sonnen-Reflex aktiv" : "Licht testen", s.licht === "sonne")}
				${badge(442, 182, 160, innen && schutzAktiv ? "Innenbau + Schutz ✓" : "Innenbau / Schutz prüfen", innen && schutzAktiv)}
			`;
		}

		case "wachsen-und-neues-leben": {
			const sizeR = s.monat === "m9" ? 36 : s.monat === "m5" ? 22 : 7;
			const highlightSac = s.fokus === "fruchtblase";
			const highlightCord = s.fokus === "nabelschnur";
			const pub = s.lebensphase === "pubertaet";
			return `
				${panelCard(14, 14, 384, 212, "Entwicklung in der Gebärmutter (9 Monate)")}
				<ellipse cx="206" cy="122" rx="112" ry="70" fill="#fce7f3" stroke="#db2777" stroke-width="3"/>
				<ellipse cx="206" cy="122" rx="92" ry="54" fill="#e0f2fe" stroke="${highlightSac ? "#0284c7" : "#93c5fd"}" stroke-width="${highlightSac ? "4" : "2"}" stroke-dasharray="${highlightSac ? "6 3" : "none"}"/>
				<path d="M 118 106 Q 108 122 118 138" fill="none" stroke="${highlightCord ? "#dc2626" : "#f43f5e"}" stroke-width="8" stroke-linecap="round"/>
				<path d="M 122 122 C 152 104, 172 138, 198 122" fill="none" stroke="${highlightCord ? "#dc2626" : "#fb7185"}" stroke-width="${highlightCord ? "5" : "3"}"/>
				<circle cx="218" cy="122" r="${sizeR}" fill="#fdba74" stroke="#c2410c" stroke-width="2"/>
				<text x="206" y="208" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--lab-ink, #1e293b)">${s.monat === "m9" ? "9. Monat: ca. 50 cm · bereit zur Geburt" : s.monat === "m5" ? "5. Monat: ca. 25 cm · erste Tritte spürbar" : "1. Monat: winzig wie ein Reiskorn"}</text>

				${panelCard(412, 14, 214, 212, "Lebensphasen-Blick")}
				<rect x="432" y="50" width="174" height="104" rx="10" fill="${pub ? "#ede9fe" : "#f1f5f9"}" stroke="${pub ? "#7c3aed" : "#94a3b8"}" stroke-width="2"/>
				<text x="519" y="88" text-anchor="middle" font-size="26">${pub ? "🌱 ➡️ 🧑" : "🎒 👧"}</text>
				<text x="519" y="118" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1e293b">${pub ? "Pubertät: Wachstum &amp; Gefühle" : "Grundschulzeit"}</text>
				<text x="519" y="138" text-anchor="middle" font-size="10.5" fill="var(--lab-muted, #475569)">${pub ? "Jedes Kind im eigenen Tempo" : "Wechsel zur Pubertät wählen"}</text>
				${badge(439, 182, 160, pub ? "Pubertät erkundet ✓" : "Lebensphase umschalten", pub)}
			`;
		}

		case "erste-hilfe-und-notruf": {
			const matchOk =
				(s.fall === "knie" && s.hilfe === "pflaster") ||
				(s.fall === "stich" && s.hilfe === "kuehlen") ||
				(s.fall === "bewusstlos" && s.hilfe === "seitenlage");
			const notrufOk = s.telefon === "notruf112";
			return `
				${panelCard(14, 14, 194, 212, "1. Situation")}
				<rect x="34" y="50" width="154" height="104" rx="10" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
				<text x="111" y="92" text-anchor="middle" font-size="28">${s.fall === "knie" ? "🩹 🦵" : s.fall === "stich" ? "🐝 💪" : "😵 🛌"}</text>
				<text x="111" y="126" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9a3412">${s.fall === "knie" ? "Schürfwunde am Knie" : s.fall === "stich" ? "Insektenstich am Arm" : "Bewusstlos (atmet normal)"}</text>
				${badge(31, 186, 160, s.fall === "bewusstlos" ? "Ernstfall gewählt" : "Leichte Verletzung", true)}

				${panelCard(223, 14, 194, 212, "2. Erste-Hilfe-Schritt")}
				<rect x="243" y="50" width="154" height="104" rx="10" fill="${matchOk ? "#dcfce7" : "#fee2e2"}" stroke="${matchOk ? "#16a34a" : "#dc2626"}" stroke-width="2"/>
				<text x="320" y="92" text-anchor="middle" font-size="28">${s.hilfe === "pflaster" ? "🩹" : s.hilfe === "kuehlen" ? "🧊" : s.hilfe === "seitenlage" ? "🛟" : "❓"}</text>
				<text x="320" y="126" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1e293b">${s.hilfe === "pflaster" ? "Säubern &amp; Wundpflaster" : s.hilfe === "kuehlen" ? "Kühlen gegen Schwellung" : s.hilfe === "seitenlage" ? "Stabile Seitenlage" : "Noch keine Hilfe"}</text>
				${badge(240, 186, 160, matchOk ? "Maßnahme passt ✓" : "Maßnahme prüfen", matchOk)}

				${panelCard(432, 14, 194, 212, "3. Notruf 112")}
				<rect x="452" y="50" width="154" height="104" rx="10" fill="${notrufOk ? "#fee2e2" : "#f1f5f9"}" stroke="${notrufOk ? "#dc2626" : "#94a3b8"}" stroke-width="2"/>
				<text x="529" y="86" text-anchor="middle" font-size="22" font-weight="900" fill="${notrufOk ? "#b91c1c" : "#64748b"}">${notrufOk ? "📞 112" : "📵 aus"}</text>
				<text x="529" y="114" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1e293b">${notrufOk ? "Wo · Was · Wie viele · Welche" : "Für Ernstfall 112 wählen"}</text>
				<text x="529" y="134" text-anchor="middle" font-size="10.5" font-weight="700" fill="#15803d">${notrufOk ? "+ Warten auf Rückfragen!" : ""}</text>
				${badge(449, 186, 160, notrufOk ? "5 W-Fragen bereit" : "Kein Notruf aktiv", notrufOk)}
			`;
		}

		case "gefuehle-grenzen-wohlbefinden": {
			const echt = s.plakat === "echt";
			const hilfe = s.grenze === "hilfeHolen";
			const aktiv = s.freizeit === "aktiv";
			return `
				${panelCard(14, 14, 194, 212, "Körperbilder & Werbung")}
				<rect x="34" y="50" width="154" height="104" rx="10" fill="${echt ? "#dcfce7" : "#fae8ff"}" stroke="${echt ? "#16a34a" : "#c026d3"}" stroke-width="2"/>
				<text x="111" y="92" text-anchor="middle" font-size="26">${echt ? "👧 🧑 🧑‍🦽" : "✨🪞✨"}</text>
				<text x="111" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">${echt ? "Echte Vielfalt zählt!" : "Künstlicher Foto-Filter"}</text>
				${badge(31, 186, 160, echt ? "Filter entlarvt ✓" : "Schönheitsfilter an", echt)}

				${panelCard(223, 14, 194, 212, "Eigene Grenzen schützen")}
				<rect x="243" y="50" width="154" height="104" rx="10" fill="${hilfe ? "#dbeafe" : "#fef3c7"}" stroke="${hilfe ? "#2563eb" : "#d97706"}" stroke-width="2"/>
				<text x="320" y="90" text-anchor="middle" font-size="26">${hilfe ? "🛡️ 🗣️" : "🤐"}</text>
				<text x="320" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">${hilfe ? "Klar NEIN + Hilfe holen!" : "Schlechtes Geheimnis"}</text>
				${badge(240, 186, 160, hilfe ? "Selbstbestimmt ✓" : "Hilfe fehlt noch", hilfe)}

				${panelCard(432, 14, 194, 212, "Aktive Freizeit")}
				<rect x="452" y="50" width="154" height="104" rx="10" fill="${aktiv ? "#ecfccb" : "#e2e8f0"}" stroke="${aktiv ? "#65a30d" : "#64748b"}" stroke-width="2"/>
				<text x="529" y="90" text-anchor="middle" font-size="26">${aktiv ? "🏃 🌲 🎵" : "🛋️ 📱"}</text>
				<text x="529" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">${aktiv ? "Bewegung, Freunde &amp; Ruhe" : "Nur Bildschirm allein"}</text>
				${badge(449, 186, 160, aktiv ? "Wohlfühl-Balance ✓" : "Bewegung fehlt", aktiv)}
			`;
		}

		case "lebensraeume-wald-gewaesser": {
			const baum = s.stockwerk === "baum";
			const strauch = s.stockwerk === "strauch";
			const klar = s.bach === "naturnah";
			const ketteOk = s.kette === "wasserKette";
			return `
				${panelCard(14, 14, 200, 212, "Stockwerke des Waldes")}
				<rect x="26" y="46" width="176" height="36" rx="8" fill="${baum ? "#bbf7d0" : "#f1f5f9"}" stroke="${baum ? "#15803d" : "#cbd5e1"}" stroke-width="2"/>
				<text x="114" y="68" text-anchor="middle" font-size="10.5" font-weight="700" fill="#14532d">🌲 Baumschicht: Specht &amp; Eiche</text>
				<rect x="26" y="88" width="176" height="34" rx="8" fill="${strauch ? "#bbf7d0" : "#f1f5f9"}" stroke="${strauch ? "#15803d" : "#cbd5e1"}" stroke-width="2"/>
				<text x="114" y="109" text-anchor="middle" font-size="10.5" font-weight="700" fill="#14532d">🌿 Strauch/Kraut: Hasel &amp; Reh</text>
				<rect x="26" y="128" width="176" height="34" rx="8" fill="${!baum && !strauch ? "#fde68a" : "#f1f5f9"}" stroke="#ca8a04"/>
				<text x="114" y="149" text-anchor="middle" font-size="10.5" font-weight="700" fill="#713f12">🍄 Moos/Boden: Assel &amp; Wurm</text>
				${badge(34, 186, 160, baum ? "Baumkrone aktiv ✓" : strauch ? "Strauchschicht" : "Moosschicht", baum)}

				${panelCard(226, 14, 188, 212, "Forellenbach")}
				<rect x="242" y="48" width="156" height="110" rx="10" fill="${klar ? "#bae6fd" : "#d6d3d1"}" stroke="${klar ? "#0284c7" : "#78716c"}" stroke-width="2"/>
				<text x="320" y="88" text-anchor="middle" font-size="26">${klar ? "🐟 🪨 🌿" : "🛢️ 🫧"}</text>
				<text x="320" y="120" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">${klar ? `<tspan x="320" dy="0">Kühl &amp; klar:</tspan><tspan x="320" dy="16">viel Sauerstoff</tspan>` : `<tspan x="320" dy="0">Abwasser &amp;</tspan><tspan x="320" dy="16">Sauerstoffmangel</tspan>`}</text>
				${badge(240, 186, 160, klar ? "Naturnaher Bach ✓" : "Bach verschmutzt", klar)}

				${panelCard(426, 14, 200, 212, "Nahrungskette")}
				<rect x="444" y="48" width="164" height="110" rx="10" fill="${ketteOk ? "#dcfce7" : "#fee2e2"}" stroke="${ketteOk ? "#16a34a" : "#dc2626"}" stroke-width="2"/>
				<text x="526" y="88" text-anchor="middle" font-size="11.5" font-weight="800" fill="#1e293b">${ketteOk ? "Alge → Wasserfloh →" : "Reiher → Fisch →"}</text>
				<text x="526" y="112" text-anchor="middle" font-size="11.5" font-weight="800" fill="#1e293b">${ketteOk ? "Kleinfisch → Graureiher" : "Alge (verkehrt!)"}</text>
				<text x="526" y="138" text-anchor="middle" font-size="10.5" fill="var(--lab-muted, #475569)">Pfeil = „wird gefressen von“</text>
				${badge(446, 186, 160, ketteOk ? "Nahrungskette stimmt ✓" : "Richtung falsch", ketteOk)}
			`;
		}

		case "tierentwicklung-wolf-hund": {
			const isKaefer = s.art === "kaefer";
			const stageLabels = isKaefer
				? ["1. Eier am Blatt", "2. Larve (frisst Blattläuse)", "3. Puppe (Umbau)", "4. Marienkäfer"]
				: ["1. Froschlaich", "2. Kaulquappe (Kiemen)", "3. Jungfrosch (Beine)", "4. Grasfrosch (Lunge)"];
			const stageIcons = isKaefer ? ["🥚", "🐛", "🫘", "🐞"] : ["🫧", "〰️", "🦎", "🐸"];
			const idx = s.stadium === "s4" ? 3 : s.stadium === "s3" ? 2 : s.stadium === "s2" ? 1 : 0;
			const hundOk = s.hund === "ruhig";
			return `
				${panelCard(14, 14, 390, 212, isKaefer ? "Vollkommene Verwandlung: Marienkäfer" : "Metamorphose im Teich: Grasfrosch")}
				${[0, 1, 2, 3]
					.map((i) => {
						const x = 30 + i * 92;
						const active = i === idx;
						return `<g>
							<rect x="${x}" y="52" width="82" height="96" rx="12" fill="${active ? "#dcfce7" : "#f8fafc"}" stroke="${active ? "#16a34a" : "#cbd5e1"}" stroke-width="${active ? "2.5" : "1.5"}"/>
							<text x="${x + 41}" y="94" text-anchor="middle" font-size="26">${stageIcons[i]}</text>
							<text x="${x + 41}" y="124" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1e293b">${escapeHtml(stageLabels[i].split(" ")[0])} ${escapeHtml(stageLabels[i].split(" ")[1] ?? "")}</text>
						</g>`;
					})
					.join("")}
				<text x="209" y="176" text-anchor="middle" font-size="12" font-weight="800" fill="var(--lab-ink, #1e293b)">Aktuell: ${escapeHtml(stageLabels[idx])}</text>
				${badge(129, 188, 160, idx === 3 ? "Erwachsenes Tier erreicht ✓" : "Entwicklung verfolgen", idx === 3)}

				${panelCard(418, 14, 208, 212, "Wolf & Haushund-Regel")}
				<rect x="438" y="50" width="168" height="106" rx="10" fill="${hundOk ? "#dcfce7" : "#fee2e2"}" stroke="${hundOk ? "#16a34a" : "#dc2626"}" stroke-width="2"/>
				<text x="522" y="90" text-anchor="middle" font-size="26">${hundOk ? "🐕 🧍 ✋" : "🐕 🏃💨"}</text>
				<text x="522" y="122" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1e293b">${hundOk ? "Ruhig stehen &amp; vorher fragen" : "Wegrennen weckt Jagdtrieb!"}</text>
				${badge(442, 186, 160, hundOk ? "Hunde-Profi ✓" : "Gefährliche Reaktion", hundOk)}
			`;
		}

		case "bauernhof-und-lebensmittel": {
			const goodEgg = s.haltung === "0" || s.haltung === "1";
			const reg = s.herkunft === "de09";
			const saison = s.obst === "regionalSaison";
			const code = `${s.haltung}-${reg ? "DE-09" : "NL-40"}123`;
			return `
				${panelCard(14, 14, 204, 212, "Eierstempel-Scanner")}
				<ellipse cx="116" cy="104" rx="44" ry="56" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
				<text x="116" y="108" text-anchor="middle" font-size="13" font-weight="900" fill="#be123c">${escapeHtml(code)}</text>
				<text x="116" y="174" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lab-ink, #1e293b)">${s.haltung === "0" ? "0 = Bio mit Auslauf" : s.haltung === "1" ? "1 = Freilandhaltung" : s.haltung === "2" ? "2 = Bodenhaltung" : "3 = Käfig/Kleingruppe"}</text>
				${badge(36, 186, 160, goodEgg ? "Viel Auslauf fürs Huhn ✓" : "Kein Freiland-Auslauf", goodEgg)}

				${panelCard(230, 14, 182, 212, "Transportweg")}
				<rect x="248" y="50" width="146" height="106" rx="10" fill="${reg ? "#dcfce7" : "#fef3c7"}" stroke="${reg ? "#16a34a" : "#d97706"}" stroke-width="2"/>
				<text x="321" y="92" text-anchor="middle" font-size="26">${reg ? "🚜 🏡" : "🚛 🛣️"}</text>
				<text x="321" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">${reg ? "DE-09: Hof aus Bayern" : "Weiter Ferntransport"}</text>
				${badge(241, 186, 160, reg ? "Kurzer Weg ✓" : "Lange Lieferkette", reg)}

				${panelCard(424, 14, 202, 212, "Erdbeeren im Vergleich")}
				<rect x="444" y="50" width="162" height="106" rx="10" fill="${saison ? "#dcfce7" : "#fee2e2"}" stroke="${saison ? "#16a34a" : "#dc2626"}" stroke-width="2"/>
				<text x="525" y="92" text-anchor="middle" font-size="26">${saison ? "🍓 ☀️ 🚲" : "🍓 ✈️ ❄️"}</text>
				<text x="525" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">${saison ? "Saisonal im Juni vom Feld" : "Flugware im Januar"}</text>
				${badge(445, 186, 160, saison ? "Klima geschont ✓" : "Hoher CO2-Ausstoß", saison)}
			`;
		}

		case "strom-und-energie": {
			const closed = s.schalter === "zu";
			const conducts = s.stoff === "kupfer" || s.stoff === "graphit";
			const lit = closed && conducts;
			const solar = s.darstellung === "schaltplanSolar";
			return `
				${panelCard(14, 14, 404, 212, solar ? "DIN-Schaltplan mit Solarstrom" : "Versuchsaufbau: Einfacher Stromkreis")}
				<rect x="58" y="64" width="316" height="112" rx="8" fill="none" stroke="var(--lab-ink, #334155)" stroke-width="3"/>
				<rect x="44" y="102" width="28" height="36" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
				<text x="58" y="124" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a">4,5 V</text>
				<rect x="172" y="52" width="76" height="24" rx="4" fill="var(--lab-card, #ffffff)"/>
				<line x1="176" y1="64" x2="${closed ? "244" : "234"}" y2="${closed ? "64" : "44"}" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
				<text x="210" y="88" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--lab-ink, #1e293b)">Schalter (${closed ? "zu" : "offen"})</text>
				<rect x="136" y="162" width="148" height="26" rx="6" fill="${conducts ? "#fde68a" : "#e2e8f0"}" stroke="#475569" stroke-width="2"/>
				<text x="210" y="179" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a">${s.stoff === "kupfer" ? "Kupfer (Leiter)" : s.stoff === "graphit" ? "Graphit (Leiter)" : s.stoff === "holz" ? "Holz (Nichtleiter)" : "Plastik (Nichtleiter)"}</text>
				<circle cx="374" cy="120" r="22" fill="${lit ? "#fde047" : "#f1f5f9"}" stroke="#0f172a" stroke-width="2.5"/>
				<line x1="360" y1="106" x2="388" y2="134" stroke="#0f172a" stroke-width="2.2"/>
				<line x1="388" y1="106" x2="360" y2="134" stroke="#0f172a" stroke-width="2.2"/>
				${lit ? `<circle cx="374" cy="120" r="31" fill="none" stroke="#facc15" stroke-width="3" stroke-dasharray="4 4"/>` : ""}

				${panelCard(430, 14, 196, 212, "Stromerzeugung & Status")}
				<text x="528" y="84" text-anchor="middle" font-size="30">${solar ? "☀️ 🔋" : "🏭 💨"}</text>
				<text x="528" y="116" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lab-ink, #1e293b)">${solar ? "Erneuerbar + Schaltplan" : "Kohlekraftwerk (viel CO2)"}</text>
				${badge(448, 144, 160, lit ? "Lampe leuchtet! 💡" : "Stromkreis unterbrochen", lit)}
				${badge(448, 182, 160, solar ? "Schaltsymbole + Solar ✓" : "Aufbau-Ansicht", solar)}
			`;
		}

		case "feuer-und-brandschutz": {
			const greaseExplosion = s.brand === "fettpfanne" && s.loeschmittel === "wasser";
			const extinguished =
				(s.brand === "kerze" && (s.loeschmittel === "ersticken" || s.loeschmittel === "wasser")) ||
				(s.brand === "lagerfeuer" && (s.loeschmittel === "wasser" || s.loeschmittel === "ersticken")) ||
				(s.brand === "fettpfanne" && s.loeschmittel === "ersticken");
			return `
				${panelCard(14, 14, 294, 212, "Das Verbrennungsdreieck")}
				<polygon points="161,60 76,178 246,178" fill="${extinguished ? "#dcfce7" : "#ffedd5"}" stroke="${extinguished ? "#16a34a" : "#ea580c"}" stroke-width="3"/>
				<text x="161" y="54" text-anchor="middle" font-size="11" font-weight="800" fill="var(--lab-ink, #9a3412)">Zündtemperatur</text>
				<text x="86" y="196" text-anchor="middle" font-size="11" font-weight="800" fill="var(--lab-ink, #9a3412)">Brennstoff</text>
				<text x="236" y="196" text-anchor="middle" font-size="11" font-weight="800" fill="var(--lab-ink, #9a3412)">Sauerstoff</text>
				<text x="161" y="140" text-anchor="middle" font-size="28">${extinguished ? "✅💨" : "🔥"}</text>

				${panelCard(322, 14, 304, 212, "Lösch-Prüfstand")}
				<rect x="344" y="48" width="260" height="110" rx="10" fill="${greaseExplosion ? "#fecaca" : extinguished ? "#dcfce7" : "#fff7ed"}" stroke="${greaseExplosion ? "#dc2626" : extinguished ? "#16a34a" : "#f97316"}" stroke-width="2"/>
				<text x="474" y="92" text-anchor="middle" font-size="28">${greaseExplosion ? "💥🔥💦" : extinguished ? "🛡️💨" : s.brand === "fettpfanne" ? "🍳🔥" : s.brand === "lagerfeuer" ? "🪵🔥" : "🕯️🔥"}</text>
				<text x="474" y="128" text-anchor="middle" font-size="11.5" font-weight="800" fill="${greaseExplosion ? "#991b1b" : "#1e293b"}">${greaseExplosion ? "GEFAHR: Fettexplosion durch Wasser!" : extinguished ? (s.loeschmittel === "ersticken" ? "Sauerstoff entzogen (erstickt)!" : "Unter Zündtemperatur gekühlt!") : "Feuer hat alle 3 Bedingungen"}</text>
				${badge(394, 182, 160, extinguished ? "Sicher gelöscht ✓" : greaseExplosion ? "NIEMALS Wasser auf Öl!" : "Noch nicht gelöscht", extinguished)}
			`;
		}

		case "wasser-und-wasserkreislauf": {
			const verdunstet = s.sonne === "stark";
			const regnet = verdunstet && s.hoehenluft === "kuehl";
			const bodenAuf = s.boden === "sichtbarSauber";
			return `
				${panelCard(14, 14, 392, 212, "Der natürliche Wasserkreislauf")}
				<rect x="32" y="46" width="356" height="156" rx="12" fill="#e0f2fe"/>
				<circle cx="84" cy="80" r="${verdunstet ? "22" : "14"}" fill="${verdunstet ? "#facc15" : "#fde68a"}" stroke="#eab308" stroke-width="2"/>
				<ellipse cx="104" cy="182" rx="60" ry="16" fill="#0284c7"/>
				${verdunstet ? `<text x="104" y="140" text-anchor="middle" font-size="16" font-weight="800" fill="#0369a1">↑ ↑ ↑</text>` : ""}
				<ellipse cx="246" cy="78" rx="48" ry="20" fill="${regnet ? "#94a3b8" : "#f8fafc"}"/>
				${regnet ? `<text x="246" y="118" text-anchor="middle" font-size="16" fill="#0284c7">💧 💧 💧</text>` : ""}
				<polygon points="262,198 326,108 380,198" fill="#65a30d"/>
				<path d="M 314 140 Q 250 184 156 184" fill="none" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>

				${panelCard(418, 14, 208, 212, "Bodenschichten & Grundwasser")}
				${
					bodenAuf
						? `<g>
							<rect x="438" y="50" width="168" height="24" rx="4" fill="#65a30d"/><text x="522" y="66" text-anchor="middle" font-size="10.5" font-weight="700" fill="#ffffff">Humus &amp; Wiese</text>
							<rect x="438" y="76" width="168" height="32" rx="4" fill="#fde68a"/><text x="522" y="96" text-anchor="middle" font-size="10.5" font-weight="700" fill="#713f12">Sand &amp; Kies (Filter)</text>
							<rect x="438" y="110" width="168" height="28" rx="4" fill="#38bdf8"/><text x="522" y="128" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0c4a6e">Sauberes Grundwasser</text>
							<rect x="438" y="140" width="168" height="22" rx="4" fill="#78716c"/><text x="522" y="155" text-anchor="middle" font-size="10" font-weight="700" fill="#ffffff">Wasserstauender Ton</text>
						</g>`
						: `<rect x="438" y="50" width="168" height="112" rx="10" fill="#e2e8f0"/><text x="522" y="102" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569"><tspan x="522" dy="0">Bodenschnitt</tspan><tspan x="522" dy="18">noch geschlossen</tspan></text>`
				}
				${badge(442, 184, 160, regnet && bodenAuf ? "Kreislauf komplett ✓" : "Sonne, Luft & Boden prüfen", regnet && bodenAuf)}
			`;
		}

		case "zeitreise-und-quellen": {
			const uOk = s.urkunde1340 === "text14archiv";
			const mOk = s.muffelMuenze === "sach17museum";
			const fOk = s.fotoZeitzeuge === "kombi20";
			return `
				${panelCard(14, 14, 612, 212, "Zeitleiste der Ortsgeschichte & Quellen-Schutz")}
				<line x1="54" y1="118" x2="586" y2="118" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
				<polygon points="594,118 580,110 580,126" fill="#64748b"/>

				<circle cx="136" cy="118" r="12" fill="${uOk ? "#16a34a" : "#d97706"}"/>
				<text x="136" y="72" text-anchor="middle" font-size="22">📜</text>
				<text x="136" y="96" text-anchor="middle" font-size="11.5" font-weight="800" fill="var(--lab-ink, #1e293b)">1340 · 14. Jh.</text>
				<text x="136" y="152" text-anchor="middle" font-size="10.5" font-weight="700" fill="${uOk ? "#15803d" : "#b45309"}">${uOk ? "Textquelle im Archiv ✓" : "Urkunde ungeklärt"}</text>

				<circle cx="320" cy="118" r="12" fill="${mOk ? "#16a34a" : "#d97706"}"/>
				<text x="320" y="72" text-anchor="middle" font-size="22">🪙</text>
				<text x="320" y="96" text-anchor="middle" font-size="11.5" font-weight="800" fill="var(--lab-ink, #1e293b)">1648 · 17. Jh.</text>
				<text x="320" y="152" text-anchor="middle" font-size="10.5" font-weight="700" fill="${mOk ? "#15803d" : "#b45309"}">${mOk ? "Sachquelle im Museum ✓" : "Münze ungeklärt"}</text>

				<circle cx="504" cy="118" r="12" fill="${fOk ? "#16a34a" : "#d97706"}"/>
				<text x="504" y="72" text-anchor="middle" font-size="22">📷 👵</text>
				<text x="504" y="96" text-anchor="middle" font-size="11.5" font-weight="800" fill="var(--lab-ink, #1e293b)">1905 · 20. Jh.</text>
				<text x="504" y="152" text-anchor="middle" font-size="10.5" font-weight="700" fill="${fOk ? "#15803d" : "#b45309"}">${fOk ? "Bild + Zeitzeugen ✓" : "Nur Einzelvermutung"}</text>

				${badge(220, 184, 200, uOk && mOk && fOk ? "Alle 3 Epochen belegt ✓" : "Quellen zuordnen", uOk && mOk && fOk)}
			`;
		}

		case "wandel-fakten-fiktion": {
			const rad = s.fahrradStufe;
			const getrennt = s.ritterCheck === "getrennt";
			const erinnern = s.gedenktag === "erinnern";
			return `
				${panelCard(14, 14, 224, 212, "Fahrrad-Entwicklung")}
				${
					rad === "niederrad"
						? `<g>
							<circle cx="80" cy="132" r="24" fill="none" stroke="#15803d" stroke-width="4"/>
							<circle cx="172" cy="132" r="24" fill="none" stroke="#15803d" stroke-width="4"/>
							<polyline points="80,132 118,132 146,96 102,96 80,132" fill="none" stroke="#2563eb" stroke-width="3"/>
							<line x1="146" y1="84" x2="172" y2="132" stroke="#2563eb" stroke-width="3"/>
							<ellipse cx="99" cy="132" rx="20" ry="6" fill="none" stroke="#dc2626" stroke-width="2"/>
							<text x="126" y="174" text-anchor="middle" font-size="10.5" font-weight="700" fill="#15803d">1885: Kette + Luftreifen</text>
						</g>`
						: rad === "hochrad"
							? `<g>
								<circle cx="96" cy="116" r="38" fill="none" stroke="#b45309" stroke-width="4"/>
								<circle cx="168" cy="142" r="12" fill="none" stroke="#b45309" stroke-width="3"/>
								<path d="M 96 78 Q 148 92 168 142" fill="none" stroke="#78350f" stroke-width="3"/>
								<text x="126" y="174" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b45309">1870: Hochrad (Sturzgefahr!)</text>
							</g>`
							: `<g>
								<circle cx="82" cy="132" r="22" fill="none" stroke="#92400e" stroke-width="4"/>
								<circle cx="170" cy="132" r="22" fill="none" stroke="#92400e" stroke-width="4"/>
								<line x1="82" y1="112" x2="170" y2="112" stroke="#92400e" stroke-width="5"/>
								<text x="126" y="174" text-anchor="middle" font-size="10.5" font-weight="700" fill="#92400e">1817: Draisine ohne Pedale</text>
							</g>`
				}
				${badge(46, 186, 160, rad === "niederrad" ? "Alltagssicher ✓" : "Frühe Vorstufe", rad === "niederrad")}

				${panelCard(250, 14, 184, 212, "Fakt vs. Fiktion")}
				<rect x="268" y="50" width="148" height="106" rx="10" fill="${getrennt ? "#dcfce7" : "#fef3c7"}" stroke="${getrennt ? "#16a34a" : "#d97706"}" stroke-width="2"/>
				<text x="342" y="86" text-anchor="middle" font-size="24">📜 vs. 🐉</text>
				<text x="342" y="116" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1e293b">${getrennt ? `<tspan x="342" dy="0">Urkunde = Fakt</tspan><tspan x="342" dy="15">Drache = Fiktion</tspan>` : "Sage ungeprüft geglaubt"}</text>
				${badge(262, 186, 160, getrennt ? "Sauber getrennt ✓" : "Noch vermischt", getrennt)}

				${panelCard(446, 14, 180, 212, "Erinnerung vor Ort")}
				<rect x="464" y="50" width="144" height="106" rx="10" fill="${erinnern ? "#dbeafe" : "#f1f5f9"}" stroke="${erinnern ? "#2563eb" : "#94a3b8"}" stroke-width="2"/>
				<text x="536" y="90" text-anchor="middle" font-size="26">🏛️ 🕯️</text>
				<text x="536" y="122" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1e293b">${erinnern ? "Mahnen &amp; Wurzeln kennen" : "Sinn noch unklar"}</text>
				${badge(456, 186, 160, erinnern ? "Bedeutung erkannt ✓" : "Gedenktag prüfen", erinnern)}
			`;
		}

		case "orientierung-und-kartenlesen": {
			const genordet = s.nordung === "genordet";
			const soOk = genordet && s.peilung === "suedost";
			const wander = s.kartenwahl === "wanderkarte";
			return `
				${panelCard(14, 14, 212, 212, "Windrose & Kompass")}
				<circle cx="120" cy="116" r="54" fill="#f8fafc" stroke="var(--lab-ink, #334155)" stroke-width="2"/>
				<text x="120" y="54" text-anchor="middle" font-size="12" font-weight="900" fill="#ef4444">N</text>
				<text x="184" y="120" text-anchor="middle" font-size="12" font-weight="800" fill="var(--lab-ink, #1e293b)">O</text>
				<text x="120" y="184" text-anchor="middle" font-size="12" font-weight="800" fill="var(--lab-ink, #1e293b)">S</text>
				<text x="56" y="120" text-anchor="middle" font-size="12" font-weight="800" fill="var(--lab-ink, #1e293b)">W</text>
				<text x="166" y="74" text-anchor="middle" font-size="10" font-weight="700" fill="var(--lab-muted, #64748b)">NO</text>
				<text x="166" y="164" text-anchor="middle" font-size="10" font-weight="800" fill="${soOk ? "#22c55e" : "var(--lab-muted, #64748b)"}">SO</text>
				<text x="74" y="164" text-anchor="middle" font-size="10" font-weight="700" fill="var(--lab-muted, #64748b)">SW</text>
				<text x="74" y="74" text-anchor="middle" font-size="10" font-weight="700" fill="var(--lab-muted, #64748b)">NW</text>
				<polygon points="120,70 113,116 127,116" fill="#dc2626"/>
				<polygon points="120,162 113,116 127,116" fill="#94a3b8"/>

				${panelCard(238, 14, 388, 212, wander ? "Wanderkarte 1 : 25 000 (1 cm = 250 m)" : "Europakarte 1 : 5 000 000 (zu grob)")}
				<g transform="${genordet ? "" : "rotate(180 432 116)"}">
					<rect x="262" y="48" width="340" height="128" rx="10" fill="#bbf7d0" stroke="#15803d" stroke-width="2"/>
					<path d="M 272 152 Q 360 118 446 62" fill="none" stroke="#0284c7" stroke-width="6" stroke-linecap="round"/>
					<ellipse cx="526" cy="136" rx="58" ry="30" fill="#fde68a"/>
					<ellipse cx="534" cy="138" rx="34" ry="18" fill="#a16207"/>
					<circle cx="332" cy="78" r="6" fill="#1d4ed8"/>
					<text x="332" y="68" text-anchor="middle" font-size="10.5" font-weight="800" fill="#1e293b">Schule</text>
					<text x="534" y="143" text-anchor="middle" font-size="13">🛖</text>
					${
						wander
							? `<line x1="332" y1="78" x2="524" y2="138" stroke="${soOk ? "#15803d" : "#dc2626"}" stroke-width="2.5" stroke-dasharray="5 4"/>`
							: ""
					}
				</g>
				${badge(262, 186, 160, genordet ? "Karte genordet ✓" : "Karte verdreht!", genordet)}
				${badge(442, 186, 160, soOk && wander ? "SO · 1,5 km zur Hütte ✓" : "Peilung & Maßstab prüfen", soOk && wander)}
			`;
		}

		case "bayern-deutschland-welt": {
			const ketteOk = s.raumkette === "geordnet";
			const flussOk = s.flusskarte === "richtig";
			const sanft = s.bergtal === "sanft";
			return `
				${panelCard(14, 14, 194, 212, "Zwiebelschalen")}
				<ellipse cx="111" cy="112" rx="76" ry="54" fill="#dbeafe" stroke="#2563eb"/>
				<ellipse cx="111" cy="112" rx="54" ry="38" fill="#bfdbfe" stroke="#2563eb"/>
				<ellipse cx="111" cy="112" rx="32" ry="22" fill="#93c5fd" stroke="#1d4ed8"/>
				<text x="111" y="116" text-anchor="middle" font-size="10" font-weight="800" fill="#1e3a8a">${ketteOk ? "Ort → BY → EU" : "Vertauscht!"}</text>
				${badge(31, 186, 160, ketteOk ? "6 Ebenen geordnet ✓" : "Reihenfolge prüfen", ketteOk)}

				${panelCard(222, 14, 196, 212, "Bayern-Topographie")}
				<polygon points="282,48 368,54 394,116 376,168 258,168 248,108" fill="#ecfccb" stroke="#15803d" stroke-width="2"/>
				<path d="${flussOk ? "M 358 72 Q 312 64 262 78" : "M 262 152 Q 320 148 378 152"}" fill="none" stroke="#0284c7" stroke-width="3.5"/>
				<path d="M 254 122 Q 320 124 388 126" fill="none" stroke="#0369a1" stroke-width="4.5"/>
				<text x="320" y="${flussOk ? "64" : "146"}" text-anchor="middle" font-size="9.5" font-weight="800" fill="#0c4a6e">Main</text>
				<text x="320" y="118" text-anchor="middle" font-size="9.5" font-weight="800" fill="#0c4a6e">Donau</text>
				<text x="320" y="${flussOk ? "162" : "66"}" text-anchor="middle" font-size="10" font-weight="800" fill="#78350f">⛰️ Alpen 2 962 m</text>
				${badge(240, 186, 160, flussOk ? "Main, Donau & Alpen ✓" : "Norden/Süden falsch", flussOk)}

				${panelCard(432, 14, 194, 212, "Bergtal schützen")}
				<rect x="452" y="50" width="154" height="106" rx="10" fill="${sanft ? "#dcfce7" : "#e2e8f0"}" stroke="${sanft ? "#16a34a" : "#64748b"}" stroke-width="2"/>
				<text x="529" y="92" text-anchor="middle" font-size="26">${sanft ? "🚌 🦌 🌲" : "🚗 🪓 🏗️"}</text>
				<text x="529" y="124" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1e293b">${sanft ? "Wanderbus &amp; Ruhezonen" : "Schutzwald gerodet"}</text>
				${badge(449, 186, 160, sanft ? "Sanfter Tourismus ✓" : "Naturraum belastet", sanft)}
			`;
		}

		case "fahrrad-und-mobilitaet": {
			const radOk = s.radCheck === "verkehrssicher";
			const bogenOk = s.linksabbiegen === "achtPunkte";
			const busOk = s.schulwegMobil === "radbus";
			return `
				${panelCard(14, 14, 224, 212, "Verkehrssicheres Fahrrad")}
				<circle cx="80" cy="130" r="26" fill="none" stroke="var(--lab-ink, #1e293b)" stroke-width="4"/>
				<circle cx="174" cy="130" r="26" fill="none" stroke="var(--lab-ink, #1e293b)" stroke-width="4"/>
				<polyline points="80,130 120,130 148,94 102,94 80,130" fill="none" stroke="#0284c7" stroke-width="3.5"/>
				<line x1="148" y1="80" x2="174" y2="130" stroke="#0284c7" stroke-width="3.5"/>
				${
					radOk
						? `<circle cx="184" cy="96" r="6" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
						   <circle cx="62" cy="104" r="5" fill="#ef4444"/>
						   <circle cx="80" cy="114" r="4" fill="#f59e0b"/>
						   <circle cx="174" cy="146" r="4" fill="#f59e0b"/>
						   <rect x="114" y="127" width="12" height="6" rx="2" fill="#f59e0b"/>
						   <text x="148" y="72" text-anchor="middle" font-size="14">🔔 🪖</text>`
						: `<text x="127" y="74" text-anchor="middle" font-size="12" font-weight="800" fill="#dc2626">⚠️ Licht &amp; Bremse fehlen</text>`
				}
				${badge(46, 186, 160, radOk ? "StVZO-komplett ✓" : "Nicht verkehrssicher", radOk)}

				${panelCard(250, 14, 186, 212, "Linksabbiegen (8 Punkte)")}
				<rect x="272" y="48" width="142" height="112" rx="8" fill="#cbd5e1"/>
				<rect x="322" y="48" width="42" height="112" fill="#475569"/>
				<rect x="272" y="84" width="142" height="40" fill="#475569"/>
				<path d="${bogenOk ? "M 352 154 L 346 124 Q 346 94 282 94" : "M 356 154 L 282 114"}" fill="none" stroke="${bogenOk ? "#22c55e" : "#ef4444"}" stroke-width="4" stroke-dasharray="5 3"/>
				${badge(263, 186, 160, bogenOk ? "Weiter Bogen ✓" : "Kurve geschnitten!", bogenOk)}

				${panelCard(448, 14, 178, 212, "Schulweg-Check")}
				<rect x="466" y="50" width="142" height="108" rx="10" fill="${busOk ? "#dcfce7" : "#fee2e2"}" stroke="${busOk ? "#16a34a" : "#dc2626"}" stroke-width="2"/>
				<text x="537" y="92" text-anchor="middle" font-size="26">${busOk ? "🚲 🚌 🚶" : "🚗🚗🚗"}</text>
				<text x="537" y="124" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1e293b">${busOk ? "Sicher &amp; klimafreundlich" : "Elterntaxi-Stau"}</text>
				${badge(457, 186, 160, busOk ? "Umweltverbund ✓" : "Hoher Flächenverbrauch", busOk)}
			`;
		}

		case "werkzeuge-maschinen-produktion": {
			const lang = s.hebelArm === "lang";
			const schnell = s.getriebe === "grossAufKlein";
			const rep = s.jacke === "reparieren";
			return `
				${panelCard(14, 14, 204, 212, "Hebelprinzip")}
				<rect x="42" y="${lang ? "96" : "114"}" width="44" height="40" rx="6" fill="#b45309"/>
				<text x="64" y="${lang ? "121" : "139"}" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">50 kg</text>
				<polygon points="${lang ? "98,158 88,176 108,176" : "148,158 138,176 158,176"}" fill="var(--lab-muted, #64748b)"/>
				<line x1="56" y1="${lang ? "138" : "154"}" x2="196" y2="${lang ? "166" : "158"}" stroke="var(--lab-ink, #0f172a)" stroke-width="6" stroke-linecap="round"/>
				<text x="116" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lab-ink, #1e293b)">${lang ? "Langer Kraftarm = leicht!" : "Kurzer Kraftarm = schwer!"}</text>
				${badge(36, 186, 160, lang ? "Wenig Kraft nötig ✓" : "Drehpunkt ungünstig", lang)}

				${panelCard(230, 14, 192, 212, "Zahnradgetriebe")}
				<circle cx="${schnell ? "298" : "354"}" cy="112" r="34" fill="#dbeafe" stroke="#1d4ed8" stroke-width="4" stroke-dasharray="7 4"/>
				<circle cx="${schnell ? "356" : "296"}" cy="112" r="18" fill="#fef08a" stroke="#ca8a04" stroke-width="4" stroke-dasharray="5 3"/>
				<text x="${schnell ? "298" : "354"}" y="116" text-anchor="middle" font-size="11" font-weight="800" fill="#1e3a8a">24 Z ↻</text>
				<text x="${schnell ? "356" : "296"}" y="116" text-anchor="middle" font-size="10" font-weight="800" fill="#854d0e">8 Z ↺</text>
				<text x="326" y="166" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--lab-ink, #1e293b)">${schnell ? "3× schneller + Fliehkraft!" : "Nur 1/3 Umdrehung"}</text>
				${badge(246, 186, 160, schnell ? "Übersetzung 3 : 1 ✓" : "Zu langsam", schnell)}

				${panelCard(434, 14, 192, 212, "Ressourcenschutz")}
				<rect x="454" y="50" width="152" height="108" rx="10" fill="${rep ? "#dcfce7" : "#fee2e2"}" stroke="${rep ? "#16a34a" : "#dc2626"}" stroke-width="2"/>
				<text x="530" y="92" text-anchor="middle" font-size="26">${rep ? "🧥 🪡 ✨" : "🧥 🗑️"}</text>
				<text x="530" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">${rep ? "Handwerk repariert" : "Wegwerf-Konsum"}</text>
				${badge(450, 186, 160, rep ? "Rohstoffe gespart ✓" : "Viel Abfall", rep)}
			`;
		}

		case "bruecken-und-balance": {
			const profilOk = s.fahrbahnProfil === "zickzack";
			const dreieckOk = s.aussteifung === "dreieck";
			const waageOk = s.waageRechts === "feld4";
			const rightPos = s.waageRechts === "feld4" ? 4 : s.waageRechts === "feld2" ? 2 : 1;
			const tilt = waageOk ? 0 : rightPos === 2 ? -8 : -14;
			return `
				${panelCard(14, 14, 304, 212, "Papierbrücke mit Prüfgewicht")}
				<rect x="34" y="132" width="36" height="44" rx="4" fill="#64748b"/>
				<rect x="262" y="132" width="36" height="44" rx="4" fill="#64748b"/>
				${
					profilOk
						? `<polyline points="66,132 86,122 106,132 126,122 146,132 166,122 186,132 206,122 226,132 246,122 266,132" fill="none" stroke="#15803d" stroke-width="3.5"/>`
						: `<path d="M 66 132 Q 166 168 266 132" fill="none" stroke="#dc2626" stroke-width="3.5"/>`
				}
				${
					dreieckOk
						? `<polyline points="70,128 95,96 120,128 145,96 170,128 195,96 220,128 245,96 262,128" fill="none" stroke="#0284c7" stroke-width="2.5"/>
						   <line x1="95" y1="96" x2="245" y2="96" stroke="#0284c7" stroke-width="2.5"/>`
						: `<rect x="74" y="102" width="184" height="26" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>`
				}
				<rect x="148" y="${profilOk ? "74" : "126"}" width="36" height="22" rx="4" fill="#b45309"/>
				<text x="166" y="${profilOk ? "89" : "141"}" text-anchor="middle" font-size="10" font-weight="800" fill="#ffffff">Buch</text>
				${badge(86, 186, 160, profilOk && dreieckOk ? "Profil + Dreiecke stabil ✓" : "Brücke noch nachgiebig", profilOk && dreieckOk)}

				${panelCard(330, 14, 296, 212, "Balkenwaage: Gewicht · Abstand")}
				<polygon points="478,136 462,172 494,172" fill="var(--lab-muted, #64748b)"/>
				<g transform="rotate(${tilt} 478 136)">
					<line x1="366" y1="136" x2="590" y2="136" stroke="var(--lab-ink, #0f172a)" stroke-width="5" stroke-linecap="round"/>
					<rect x="418" y="106" width="24" height="28" rx="4" fill="#2563eb"/>
					<text x="430" y="124" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">4×</text>
					<text x="430" y="152" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--lab-ink, #1e293b)">Feld 2</text>
					<rect x="${478 + rightPos * 24 - 12}" y="114" width="24" height="20" rx="4" fill="#ea580c"/>
					<text x="${478 + rightPos * 24}" y="128" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">2×</text>
					<text x="${478 + rightPos * 24}" y="152" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--lab-ink, #1e293b)">Feld ${rightPos}</text>
				</g>
				${badge(398, 186, 160, waageOk ? "Balance: 4·2 = 2·4 ✓" : "Links schwerer als rechts", waageOk)}
			`;
		}

		default:
			return `<text x="320" y="125" text-anchor="middle" font-size="14" fill="var(--lab-ink, #1e293b)">Forscher-Station bereit</text>`;
	}
}

export function renderLabSceneSvg(lesson: Lesson, state: LabState): string {
	return `<svg class="lab-scene-svg" viewBox="0 0 640 240" role="img" aria-label="${escapeHtml(lesson.lab.title)}">
		<title>${escapeHtml(lesson.lab.title)}</title>
		<rect x="0" y="0" width="640" height="240" rx="18" fill="var(--lab-bg, #f1f5f9)" />
		${renderSceneBody(lesson.id, state)}
	</svg>`;
}
