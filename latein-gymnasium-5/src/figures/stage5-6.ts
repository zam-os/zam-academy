import {
	badge,
	card,
	type ConceptFigure,
	label,
	partGroup,
	pill,
	threeColumns,
} from "./draw";

export const STAGE5_6_FIGURES: Record<string, ConceptFigure> = {
	"l5-rom-topografie": {
		title: "Höhenprofil: Kapitol, Forum Romanum und Palatin",
		question: "Wie lagen Hügel, Tal und Fluss im Herzen des antiken Roms zusammen?",
		alt: "Querschnitt der Topografie Roms: Tiber mit Tiberinsel, steiles Kapitol mit Jupitertempel, Forum Romanum im Tal und Palatin.",
		caption: "Zwischen steilem Kapitol und Palatin entstand im Tal der Markt-, Gerichts- und Kultplatz.",
		parts: [
			{
				label: "Tiber & Kapitol",
				note: "An der Furt durch den Tiber bot die Tiberinsel Schutz; darüber thronte das Kapitol mit dem Tempel des Jupiter.",
			},
			{
				label: "Forum Romanum (Tal)",
				note: "Im trockengelegten Tal lagen Curia (Senat), Rostra (Rednerbühne), Basiliken (Markthallen) und Heiligtümer.",
			},
			{
				label: "Palatin & sieben Hügel",
				note: "Auf dem Palatin (Namensgeber für 'Palast') entstanden Kaiserpaläste; sechs weitere Hügel bildeten den Ring Roms.",
			},
		],
		draw: () => `${card(4, 4, 592, 242, "v-banner-bg", 14)}
			${label(300, 26, "Querschnitt: Vom Tiber über das Forum zum Palatin", "heading")}
			${partGroup(
				1,
				`${card(16, 46, 174, 184, "v-paper", 12)}
				${badge(34, 46, 1)}
				<path d="M26 208 Q50 198 76 208 T118 208 L118 220 L26 220 Z" class="v-blue-fill"/>
				<polygon points="104,195 122,126 164,126 180,195" class="v-gold-fill"/>
				${pill(30, 56, 146, 26, "Tiber & Kapitol", "v-gold-fill", "micro")}
				${label(103, 112, "Jupitertempel", "micro")}
				${label(103, 182, "Furt & Insel", "micro")}`,
			)}
			${partGroup(
				2,
				`${card(208, 46, 184, 184, "v-paper", 12)}
				${badge(226, 46, 2)}
				${pill(224, 56, 152, 26, "Forum Romanum (Tal)", "v-orange-fill", "micro")}
				${pill(224, 102, 72, 30, "Cūria", "v-paper", "micro")}
				${pill(304, 102, 72, 30, "Rōstra", "v-paper", "micro")}
				${pill(224, 144, 152, 30, "Basiliken & Tempel", "v-paper", "micro")}
				${label(300, 206, "Politik · Recht · Markt", "micro")}`,
			)}
			${partGroup(
				3,
				`${card(408, 46, 176, 184, "v-paper", 12)}
				${badge(426, 46, 3)}
				<polygon points="424,195 446,118 546,118 568,195" class="v-coral-fill"/>
				${pill(424, 56, 144, 26, "Palatin & 7 Hügel", "v-coral-fill", "micro")}
				${label(496, 146, "Kaiserpaläste", "micro")}
				${label(496, 174, "(→ Palast)", "micro")}
				${label(496, 214, "Aventin · Quirinal ...", "micro")}`,
			)}`,
	},
	"l5-spiele-bauten": {
		title: "Kolosseum, Circus Maximus und Konstantinsbogen",
		question: "Woran erkennst du Bauform und Zweck der drei berühmten Großbauten Roms?",
		alt: "Dreiteiliges Bauwerk-Schaubild zu Kolosseum (oval), Circus Maximus (Rennbahn) und Konstantinsbogen (dreitorig).",
		caption: "Arena (Sandplatz), Spina (Mittelstreifen) und dreitoriger Bogen prägten das römische Stadtbild.",
		parts: [
			{
				label: "Kolosseum (Amphitheater)",
				note: "Ovaler Großbau für ca. 50 000 Zuschauer: Schauplatz für Gladiatorenkämpfe und Tierhetzen auf Sandboden (arēna).",
			},
			{
				label: "Circus Maximus",
				note: "Über 600 m lange Rennbahn für Viergespanne (quadrīgae) zwischen Palatin und Aventin für bis zu 150 000 Besucher.",
			},
			{
				label: "Konstantinsbogen",
				note: "Dreitoriger Triumphbogen direkt beim Kolosseum zur Erinnerung an militärische Siege und feierliche Einzüge.",
			},
		],
		draw: () => `${card(4, 4, 592, 242, "v-banner-bg", 14)}
			${label(300, 26, "Drei berühmte Monumentalbauten Roms", "heading")}
			${partGroup(
				1,
				`${card(16, 46, 178, 184, "v-paper", 12)}
				${badge(34, 46, 1)}
				${pill(32, 56, 146, 26, "Kolosseum (oval)", "v-coral-fill", "micro")}
				<ellipse cx="105" cy="126" rx="58" ry="30" class="v-coral-fill"/>
				<ellipse cx="105" cy="126" rx="34" ry="15" class="v-paper"/>
				${label(105, 130, "arēna", "micro")}
				${label(105, 182, "Gladiatoren & Tiere", "micro")}
				${label(105, 206, "ca. 50 000 Plätze", "micro")}`,
			)}
			${partGroup(
				2,
				`${card(208, 46, 184, 184, "v-paper", 12)}
				${badge(226, 46, 2)}
				${pill(224, 56, 152, 26, "Circus Maximus", "v-gold-fill", "micro")}
				<rect x="230" y="102" width="140" height="48" rx="24" class="v-gold-fill"/>
				<line x1="258" y1="126" x2="342" y2="126" class="v-outline-thick"/>
				${label(300, 182, "Wagenrennen (Quadriga)", "micro")}
				${label(300, 206, "> 150 000 Plätze", "micro")}`,
			)}
			${partGroup(
				3,
				`${card(406, 46, 178, 184, "v-paper", 12)}
				${badge(424, 46, 3)}
				${pill(422, 56, 146, 26, "Konstantinsbogen", "v-teal-fill", "micro")}
				<rect x="440" y="96" width="110" height="58" class="v-teal-fill"/>
				<path d="M452 154 V128 A8 8 0 0 1 468 128 V154 M485 154 V116 A10 10 0 0 1 505 116 V154 M522 154 V128 A8 8 0 0 1 538 128 V154" class="v-paper"/>
				${label(495, 182, "dreitoriges Denkmal", "micro")}
				${label(495, 206, "Siegeserinnerung", "micro")}`,
			)}`,
	},
	"l5-thermen-aquaedukt-ostia": {
		title: "Versorgungssystem: Aquädukt, Thermen und Ostia",
		question: "Wie kamen Frischwasser und Getreide in die Millionenstadt Rom?",
		alt: "Dreiteiliges Infrastrukturbild: Quellwasser über Bogen-Aquädukt -> Badeabfolge in Thermen -> Seehafen Ostia an der Tibermündung.",
		caption: "Hochleistungs-Technik und Hafenhandel hielten eine der größten Städte der Antike am Leben.",
		parts: [
			{
				label: "Aquädukte (Berg → Rom)",
				note: "Elf Wasserleitungen brachten sauberes Quellwasser mit genauem Gefälle auf Bogenreihen und in Kanälen in die Stadt.",
			},
			{
				label: "Thermen (Bad & Begegnung)",
				note: "Öffentliche Bäder für alle mit Tepidarium (lau), Caldarium (heiß), Frigidarium (kalt), Sportplatz und Bibliothek.",
			},
			{
				label: "Ostia (Seehafen am Meer)",
				note: "An der Tibermündung luden große Frachtschiffe Getreide und Öl auf Flusskähne Richtung Rom um.",
			},
		],
		draw: () =>
			threeColumns(
				"Wasser, Bad und Getreideversorgung Roms",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Aquädukt (Gefälle)",
						lines: ["Quelle in den Bergen", "Bogenreihen & Tunnel", "aqua + dūcere", "Brunnen & Thermen"],
						footer: "frisches Trinkwasser",
					},
					{
						badge: "2",
						fill: "v-coral-fill",
						heading: "Thermen-Rundgang",
						lines: ["1. Sport (Palaestra)", "2. Tepidārium (lau)", "3. Caldārium (heiß)", "4. Frīgidārium (kalt)"],
						footer: "plus Bibliothek",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "Hafenstadt Ostia",
						lines: ["an der Tibermündung", "Hochseeschiffe anlegen", "Getreide auf Kähne", "Sicherung Roms"],
						footer: "Tor zum Mittelmeer",
					},
				],
				false,
			),
	},
	"l5-caput-mundi-kunst": {
		title: "Caput mundi: Roms Baukunst und Erbe im Alltag",
		question: "Welche technischen Erfindungen und Kunstformen zeichnen Rom bis heute aus?",
		alt: "Dreiteiliges Schaubild zu Rom als caput mundi, den Bauelementen Rundbogen/Beton/Kuppel und römischer Kunst/Rezeption heute.",
		caption: "Rundbogen, Gewölbe und Gussbeton prägen noch heute Brücken, Museen und Rathäuser.",
		parts: [
			{
				label: "Rom als caput mundī",
				note: "Von der Stadt am Tiber zum politischen und rechtlichen Zentrum rund ums Mittelmeer; Spuren bis nach Bayern.",
			},
			{
				label: "Rundbogen, Gewölbe, Beton",
				note: "Der Rundbogen (arcus), Kuppeln und wasserfester Beton (opus caementicium) trugen weite Hallen und Brücken.",
			},
			{
				label: "Porträts, Mosaike & Heute",
				note: "Antikenmuseen zeigen charaktervolle römische Porträts und Mosaike; Bauwerke bei uns greifen Säulen und Bögen auf.",
			},
		],
		draw: () =>
			threeColumns(
				"Caput mundī: Technik, Kunst und Nachleben",
				[
					{
						badge: "1",
						fill: "v-gold-fill",
						heading: "Caput mundī",
						lines: ["'Haupt der Welt'", "Recht & Straßennetz", "Regensburg / Augsburg", "römische Stadtwurzeln"],
						footer: "Zentrum des Reichs",
					},
					{
						badge: "2",
						fill: "v-orange-fill",
						heading: "Technik-Revolution",
						lines: ["Rundbogen (arcus)", "Tonnen- & Kreuzgewölbe", "Kuppel (Pantheon)", "Beton (caementum)"],
						footer: "trägt große Weiten",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "Kunst & Gegenwart",
						lines: ["realistische Porträts", "farbige Mosaike", "Königsplatz München", "Säulen am Rathaus"],
						footer: "sichtbar im Umfeld",
					},
				],
				false,
			),
	},
	"l5-griechenland-rom": {
		title: "Graecia capta: Griechische Kultur in Rom",
		question: "Was übernahmen die Römer von Griechenland – und was veränderten sie?",
		alt: "Dreiteiliges Vergleichs-Schaubild zwischen Griechenland und Rom bei Tempeln, Göttern/Mythen und Sprache/Bildung.",
		caption: "Rom übernahm griechische Ordnungen, Mythen und Bildung, fügte aber Eigenes (Podiumstempel, Recht) hinzu.",
		parts: [
			{
				label: "Tempel & Säulen",
				note: "Säulenordnungen (dorisch, ionisch, korinthisch) stammten aus Griechenland; Rom hob Tempel auf ein hohes Podium.",
			},
			{
				label: "Götter & Mythen",
				note: "Römische Götter verschmolzen mit den Olympiern; Aeneas verband Rom direkt mit Homers Troja-Epos.",
			},
			{
				label: "Bildung & eigene Stärke",
				note: "Griechische Lehrer unterrichteten Roms Jugend, während Rom Latein als Rechts- und Staatssprache ausbaute.",
			},
		],
		draw: () =>
			threeColumns(
				"Kulturtransfer: Griechenland → Rom",
				[
					{
						badge: "1",
						fill: "v-teal-fill",
						heading: "Tempelbau",
						lines: ["GR: Stufen rundum", "RO: hohes Podium", "+ Fronttreppe", "3 Säulenordnungen"],
						footer: "übernommen & angepasst",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "Götter & Sagen",
						lines: ["Zeus ↔ Iuppiter", "Athene ↔ Minerva", "Homer (Troja)", "→ Vergils Aeneas"],
						footer: "gemeinsamer Mythos",
					},
					{
						badge: "3",
						fill: "v-gold-fill",
						heading: "Bildung & Staat",
						lines: ["griech. Hauslehrer", "zweisprachige Elite", "Roms Eigenanteil:", "Recht, Werte, Latein"],
						footer: "Graecia capta ...",
					},
				],
				true,
			),
	},
	"l5-senat-werte": {
		title: "Senat und römische Grundwerte",
		question: "Welche Rolle spielte der Senat und wofür stehen pietās, virtūs und fidēs?",
		alt: "Dreiteiliges Schaubild zu Senat/Curia, den drei Säulen von pietas und den Grundwerten virtus und fides.",
		caption: "Der Rat erfahrener Amtsträger stützte sich auf den Ehrenkodex der Vorfahren (mōs maiōrum).",
		parts: [
			{
				label: "Der Senat (senātus)",
				note: "Rat erfahrener Männer (patrēs) in der Curia mit breitem Purpurstreifen auf der Tunika; beriet über Krieg, Finanzen, Kult.",
			},
			{
				label: "Dreifache pietās",
				note: "Pflichtbewusstsein gegenüber 1. den Göttern, 2. den Eltern/der Familie und 3. dem Vaterland.",
			},
			{
				label: "virtūs & fidēs",
				note: "virtūs = Tapferkeit und Charakterstärke; fidēs = Worttreue und Zuverlässigkeit bei Verträgen.",
			},
		],
		draw: () =>
			threeColumns(
				"Politik und Wertewelt (mōs maiōrum)",
				[
					{
						badge: "1",
						fill: "v-coral-fill",
						heading: "Senātus (Curia)",
						lines: ["von senex (Ältester)", "300–600 Senatoren", "breiter Purpurstreifen", "Rat zu Krieg & Staat"],
						footer: "auctōritās (Ansehen)",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "pietās (3-fach)",
						lines: ["1. gegen die Götter", "2. gegen Eltern/Familie", "3. gegen den Staat", "Vorbild: pius Aenēās"],
						footer: "Pflicht & Respekt",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "virtūs & fidēs",
						lines: ["virtūs = Tatkraft / Mut", "fidēs = Treue zum Wort", "gravitās = Würde", "Maßstab in Texten"],
						footer: "Verlässlichkeit",
					},
				],
				false,
			),
	},
	"l5-familie-namen": {
		title: "Die römische familia und Tria Nomina",
		question: "Wer gehörte zur familia und wie war ein römischer Bürgername gebaut?",
		alt: "Dreiteiliges Schaubild zum Aufbau des Hauses unter dem pater familias, den Tria Nomina (Marcus Tullius Cicero) und Frauennamen (Tullia).",
		caption: "Ein Bürger trug Vor-, Sippen- und Beinamen; Frauen erhielten die weibliche Form des Sippennamens.",
		parts: [
			{
				label: "Die erweiterte familia",
				note: "Eltern, Kinder und Unfreie unter der rechtlichen Hausgewalt (patria potestās) des pater familiās; mātrōna leitete den Haushalt.",
			},
			{
				label: "Tria Nomina (Männer)",
				note: "1. Praenōmen (Vorname: M.), 2. Nōmen gentīle (Sippenname: Tullius), 3. Cognōmen (Beiname: Cicerō).",
			},
			{
				label: "Namen der Frauen",
				note: "Töchter übernahmen die weibliche Form des Nōmen gentīle (Tullius → Tullia; Iūlius → Iūlia).",
			},
		],
		draw: () =>
			threeColumns(
				"Hausverband (familia) und Namenssystem",
				[
					{
						badge: "1",
						fill: "v-teal-fill",
						heading: "Hausverband (familia)",
						lines: ["pater familiās (Leiter)", "mātrōna + Kinder", "plus Haussklaven", "patria potestās"],
						footer: "Hausgemeinschaft",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Tria Nomina",
						lines: ["M. = Mārcus (Vorname)", "Tullius (Sippenname)", "Cicerō (Beiname)", "C. = Gāius · P. = Pūblius"],
						footer: "3 Namen freier Bürger",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "Frauennamen",
						lines: ["kein eigener Vorname", "vom Sippennamen:", "Iūlius → Iūlia", "Cornēlius → Cornēlia"],
						footer: "Maior / Minor / Tertia",
					},
				],
				false,
			),
	},
	"l5-sklaven-gladiatoren": {
		title: "Lebenswelten: Sklaven, Freigelassene und Gladiatoren",
		question: "Wie unterschieden sich Sklavenalltag, Freilassung und Gladiatorenschulen?",
		alt: "Dreiteiliges Schaubild zu Versklavung und Alltag der servi, Freilassung zu liberti und dem Leben im ludus gladiatorius.",
		caption: "Unfreie hatten keine Bürgerrechte, doch ein Teil konnte als lībertī durch Freilassung aufsteigen.",
		parts: [
			{
				label: "Wege & Alltag der servī",
				note: "Versklavung meist durch Krieg oder Geburt; schwere Arbeit in Minen/auf Gütern vs. gebildete Hauslehrer und Ärzte.",
			},
			{
				label: "Freilassung (lībertī)",
				note: "Durch manūmissiō wurde ein Sklave zum Freigelassenen (lībertus) und erhielt meist das römische Bürgerrecht.",
			},
			{
				label: "Gladiatoren (lūdus)",
				note: "Berufskämpfer in strengen Schulen mit teurem Training; Publikum entschied bei Aufgabe oft über Gnade (missiō).",
			},
		],
		draw: () =>
			threeColumns(
				"Unfreiheit, Aufstieg und Arena",
				[
					{
						badge: "1",
						fill: "v-coral-fill",
						heading: "servī (Unfreie)",
						lines: ["Kriegsgefangenschaft", "Bergwerk & Landgut", "vs. Arzt / Hauslehrer", "rechtlich Besitz"],
						footer: "große Unterschiede",
					},
					{
						badge: "2",
						fill: "v-green-fill",
						heading: "manūmissiō → lībertī",
						lines: ["Freilassung durch Herrn", "status: lībertus", "Bürgerrecht (oft)", "Verbindung als Klient"],
						footer: "Weg in die Freiheit",
					},
					{
						badge: "3",
						fill: "v-orange-fill",
						heading: "Gladiatoren",
						lines: ["Training im lūdus", "Waffengattungen", "teure Ausbildung", "nicht jeder Kampf tödlich"],
						footer: "missiō = Begnadigung",
					},
				],
				true,
			),
	},
	"l5-schule-schreiben-kleidung": {
		title: "Schulranzen und Kleiderschrank in Rom",
		question: "Womit schrieben Schülerinnen und Schüler, und was verriet die Kleidung über den Stand?",
		alt: "Dreiteiliges Schaubild zu Wachstafel/Griffel (tabula/stilus), Papyrusrolle/Codex und der Kleidung (tunica, toga, stola).",
		caption: "Wachstafeln konnte man glätten und neu beschreiben; Toga und Stola zeigten Bürgerrecht und Stand.",
		parts: [
			{
				label: "Üben: tabula & stilus",
				note: "Unterricht beim lūdī magister; ritzen mit dem spitzen stilus ins Wachs, löschen mit dem flachen Ende.",
			},
			{
				label: "Bücher: volūmen & cōdex",
				note: "Fertige Texte mit Tinte auf geklebten Papyrusrollen (volūmen), in der Kaiserzeit auch gebundene Hefte (cōdex).",
			},
			{
				label: "Kleidung: tunica, toga, stola",
				note: "Alle trugen die tunica; Bürger draußen die weiße toga, verheiratete Frauen die stola, Kinder die toga praetexta.",
			},
		],
		draw: () =>
			threeColumns(
				"Schule, Schreibmaterial und Kleidung",
				[
					{
						badge: "1",
						fill: "v-gold-fill",
						heading: "Schule & Wachstafel",
						lines: ["lūdī magister · paedagōgus", "tabula cērāta (Holz+Wachs)", "stilus: spitz = schreiben", "flach = glätten/löschen"],
						footer: "tägliches Üben",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Rolle & Buch",
						lines: ["ātrāmentum (Tinte)", "calamus (Schilfrohr)", "Papyrusrolle (volūmen)", "später: gebundener Cōdex"],
						footer: "bleibende Texte",
					},
					{
						badge: "3",
						fill: "v-purple-fill",
						heading: "Kleidung als Zeichen",
						lines: ["tunica (Untergewand)", "toga (nur freie Bürger!)", "stola + palla (mātrōna)", "praetexta + bulla (Kind)"],
						footer: "zeigt Stand & Alter",
					},
				],
				false,
			),
	},
	"l5-kalender-zeit": {
		title: "Römische Stunden, Jahre und die drei Monatsanker",
		question: "Wie teilten die Römer Tag, Jahr und die Tage eines Monats ein?",
		alt: "Dreiteiliges Schaubild zur variablen 12-Stunden-Sonnenuhr, der Jahreszählung (Konsuln / a. u. c.) und Kalenden/Nonen/Iden.",
		caption: "Kalenden (1.), Nonen (5./7.) und Iden (13./15.) bildeten das Grundgerüst jedes Monats.",
		parts: [
			{
				label: "12 variable Stunden",
				note: "Tag von Sonnenaufgang bis Untergang immer 12 Stunden: im Winter ca. 45 min, im Sommer ca. 75 min.",
			},
			{
				label: "Jahre & Caesars Kalender",
				note: "Datierung nach zwei Konsuln oder ab urbe conditā (753 v. Chr.). Caesar führte 45 v. Chr. 365 Tage + Schaltjahr ein.",
			},
			{
				label: "Kalenden, Nonen, Iden",
				note: "Kalenden = 1.; Nonen = 5. (März, Mai, Juli, Okt.: 7.); Iden = 13. (März, Mai, Juli, Okt.: 15.).",
			},
		],
		draw: () => `${card(4, 4, 592, 242, "v-banner-bg", 14)}
			${label(300, 26, "Stunden, Jahreszählung und die drei Kalendertage", "heading")}
			${partGroup(
				1,
				`${card(16, 46, 174, 184, "v-paper", 12)}
				${badge(34, 46, 1)}
				${pill(30, 56, 146, 26, "12 Tagesstunden", "v-gold-fill", "micro")}
				${label(103, 108, "Sonnenaufgang → Untergang", "micro")}
				${label(103, 134, "Winter: ca. 45 Min./Std.", "micro")}
				${label(103, 158, "Sommer: ca. 75 Min./Std.", "micro")}
				${pill(30, 190, 146, 26, "immer 12 hōrae", "v-gold-fill", "micro")}`,
			)}
			${partGroup(
				2,
				`${card(202, 46, 182, 184, "v-paper", 12)}
				${badge(220, 46, 2)}
				${pill(216, 56, 154, 26, "Jahre & Schaltjahr", "v-teal-fill", "micro")}
				${label(293, 108, "nach 2 Konsuln", "micro")}
				${label(293, 132, "oder ab urbe conditā", "micro")}
				${label(293, 156, "(seit 753 v. Chr.)", "micro")}
				${pill(216, 190, 154, 26, "Caesar 45 v. Chr.", "v-teal-fill", "micro")}`,
			)}
			${partGroup(
				3,
				`${card(396, 46, 188, 184, "v-paper", 12)}
				${badge(414, 46, 3)}
				${pill(410, 56, 160, 26, "Monats-Stichtage", "v-coral-fill", "micro")}
				${label(490, 108, "Kalenden = immer 1.", "micro")}
				${label(490, 132, "Nonen = 5. (MMJO: 7.)", "micro")}
				${label(490, 156, "Iden = 13. (MMJO: 15.)", "micro")}
				${pill(410, 190, 160, 26, "MMJO: März/Mai/Jul/Okt", "v-coral-fill", "micro")}`,
			)}`,
	},
};
