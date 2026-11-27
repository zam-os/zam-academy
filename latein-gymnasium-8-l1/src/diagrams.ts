import { esc } from "./practice";
import type { DiagramNode, Lesson } from "./types";

export interface PaenultimaEntry {
	id: string;
	word: string;
	syllables: string[];
	stressIndex: number;
	paenultimaRule: string;
	meaning: string;
}

export const PAENULTIMA_WORDS: PaenultimaEntry[] = [
	{
		id: "iustitia",
		word: "iūstĭtĭa",
		syllables: ["iūs", "tĭ", "tĭ", "a"],
		stressIndex: 1,
		paenultimaRule:
			"Die vorletzte Silbe -tĭ- steht vor Vokal (-a) und ist kurz → Ton auf der drittletzten Silbe: iūs-TÍ-ti-a.",
		meaning: "die Gerechtigkeit",
	},
	{
		id: "philosophia",
		word: "phĭlŏsŏphĭa",
		syllables: ["phĭ", "lŏ", "sŏ", "phĭ", "a"],
		stressIndex: 2,
		paenultimaRule:
			"Auch bei griechischen Lehnwörtern gilt im Lateinischen oft die Kürze vor Vokal (-phĭ-a) → phi-lo-SÓ-phi-a.",
		meaning: "die Philosophie / Liebe zur Weisheit",
	},
	{
		id: "gerundivum",
		word: "gĕrundīvum",
		syllables: ["gĕ", "run", "dī", "vum"],
		stressIndex: 2,
		paenultimaRule:
			"Langes ī im Suffix -īv- macht die vorletzte Silbe naturlang → ge-run-DĪ-vum.",
		meaning: "das Gerundiv",
	},
	{
		id: "semideponens",
		word: "sēmĭdēpōnēns",
		syllables: ["sē", "mĭ", "dē", "pō", "nēns"],
		stressIndex: 3,
		paenultimaRule:
			"Langes ō in -pō- macht die vorletzte Silbe naturlang → se-mi-de-PŌ-nens.",
		meaning: "das Semideponens",
	},
	{
		id: "imperator",
		word: "impĕrātor",
		syllables: ["im", "pĕ", "rā", "tor"],
		stressIndex: 2,
		paenultimaRule:
			"Langes ā in -rā- hält den Ton auf der vorletzten Silbe → im-pe-RĀ-tor.",
		meaning: "der Feldherr / Kaiser",
	},
	{
		id: "patria",
		word: "pătrĭa",
		syllables: ["pă", "trĭ", "a"],
		stressIndex: 0,
		paenultimaRule:
			"Vokal -ĭ- vor -a ist kurz; zudem bleibt tr (muta cum liquida) zusammen → PÁ-tri-a.",
		meaning: "die Heimat / das Vaterland",
	},
];

export function paenultimaModel(wordId: string): PaenultimaEntry {
	return (
		PAENULTIMA_WORDS.find((entry) => entry.id === wordId) ?? PAENULTIMA_WORDS[0]
	);
}

export type VerbKind =
	| "i-deponens"
	| "kons-deponens"
	| "kons-i-deponens"
	| "semideponens"
	| "perfektopraesens"
	| "fieri";

export interface VerbModelResult {
	kind: VerbKind;
	label: string;
	presentBox: string;
	perfectBox: string;
	ruleBadge: string;
	latin: string;
	german: string;
	hint: string;
}

export function verbModel(kind: VerbKind): VerbModelResult {
	const table: Record<VerbKind, VerbModelResult> = {
		"i-deponens": {
			kind: "i-deponens",
			label: "Deponens i-Konj. (mentīrī)",
			presentBox: "mentītur (Passivform)",
			perfectBox: "mentītus est (PPP aktiv!)",
			ruleBadge: "Passive Form → Aktive Bedeutung",
			latin: "Testis numquam mentitur; falsus testis mentitus est.",
			german: "Der Zeuge lügt niemals; der falsche Zeuge hat gelogen.",
			hint: "Deponentien der i-Konjugation (mentiri, oriri, experiri) zeigen nur passive Endungen, bedeuten aber stets aktiv.",
		},
		"kons-deponens": {
			kind: "kons-deponens",
			label: "Deponens kons. Konj. (loquī / ūtī)",
			presentBox: "loquitur / ūtitur",
			perfectBox: "locūtus est / ūsus est",
			ruleBadge: "Passive Form → Aktiv (ūtī + Abl.!)",
			latin: "Orator sapienter loquitur et iustis verbis utitur.",
			german: "Der Redner spricht weise und gebraucht gerechte Worte.",
			hint: "Bei uti, frui und potiri steht das Objekt im Ablativ; locutus (PPP) heißt aktivisch „nachdem er gesprochen hatte“.",
		},
		"kons-i-deponens": {
			kind: "kons-i-deponens",
			label: "Deponens kons. m. i-Erw. (patī / prōgredī)",
			presentBox: "patitur / patiuntur",
			perfectBox: "passus est / prōgressus est",
			ruleBadge: "i-Erweiterung: patior, patitur",
			latin: "Philosophus iniurias patitur nec tamen fugit.",
			german: "Der Philosoph erleidet Unrecht und flieht dennoch nicht.",
			hint: "Im Infinitiv Präsens Passiv erscheint wie bei capi -> capi hier pati, progredi, mori.",
		},
		semideponens: {
			kind: "semideponens",
			label: "Semideponens (audēre / gaudēre / fīdere)",
			presentBox: "audet (Aktivform!)",
			perfectBox: "ausus est (Passivform!)",
			ruleBadge: "Präsensstamm aktiv · Perfektstamm passiv",
			latin: "Iuvenis verum dicere audet et postea ausus est.",
			german:
				"Der junge Mann wagt es, die Wahrheit zu sagen, und hat es später gewagt.",
			hint: "Semideponentien wie audere (ausus sum), gaudere (gavisus sum), solere (solitus sum) und fidere (fisus sum) bedeuten durchgängig aktiv.",
		},
		perfektopraesens: {
			kind: "perfektopraesens",
			label: "Perfektopräsens (ōdisse / meminisse)",
			presentBox: "Perfektform = Gegenwart!",
			perfectBox: "Plusquamperfekt = Vergangenheit!",
			ruleBadge: "ōdit = er hasst · ōderat = er hasste",
			latin: "Qui tyrannum odit, libertatem semper meminerat.",
			german:
				"Wer den Tyrannen hasst, hatte sich stets an die Freiheit erinnert.",
			hint: "Perfektopräsentien (odisse, meminisse, coepisse als Perfekt-Start, nosse = kennen) besitzen nur Formen vom Perfektstamm.",
		},
		fieri: {
			kind: "fieri",
			label: "fierī (werden / geschehen / gemacht werden)",
			presentBox: "fit / fīunt (unregelm. Präs.)",
			perfectBox: "factus est (facere Passiv)",
			ruleBadge: "Präs. Passiv-Ersatz zu facere",
			latin: "Vir iustus consul fit; pax tandem facta est.",
			german:
				"Ein gerechter Mann wird Konsul; schließlich ist Frieden geschlossen worden.",
			hint: "Im Präsensstamm stehen aktive Endungen mit passivischer bzw. Vorgangs-Bedeutung (fio, fis, fit, fimus, fitis, fiunt); Konj. Impf. lautet fierem.",
		},
	};
	return table[kind];
}

export type GerundivMode = "gerund" | "attributiv" | "praedikativ" | "auctoris";
export type GerundivStyle = "passivisch" | "idiomatisch";

export interface GerundivResult {
	mode: GerundivMode;
	leftLabel: string;
	leftText: string;
	rightLabel: string;
	rightText: string;
	relationBadge: string;
	latin: string;
	german: string;
	hint: string;
}

export function gerundivModel(
	mode: GerundivMode,
	style: GerundivStyle,
): GerundivResult {
	const data: Record<
		GerundivMode,
		Omit<GerundivResult, "mode" | "german"> & Record<GerundivStyle, string>
	> = {
		gerund: {
			leftLabel: "Verbalsubstantiv (-nd-)",
			leftText: "discendī (Gen. Sg. n.)",
			rightLabel: "KNG-Partner",
			rightText: "keiner (regiert ggf. Akk.)",
			relationBadge: "Gerund (Kl. 7): aktivisch · „das Tun“",
			latin: "Cupiditas verum discendi philosophos movet.",
			hint: "Das Gerund ist ein substantivierter Infinitiv im Neutrum Singular ohne KNG-Bezugswort.",
			passivisch: "Das Verlangen nach dem Lernen der Wahrheit bewegt die Philosophen.",
			idiomatisch: "Der Wunsch, die Wahrheit zu lernen, bewegt die Philosophen.",
		},
		attributiv: {
			leftLabel: "Bezugswort (KNG)",
			leftText: "urbis (Gen. Sg. f.)",
			rightLabel: "Attributives Gerundiv",
			rightText: "servandae (Gen. Sg. f.)",
			relationBadge: "KNG-Kongruenz → substantivischer Ausdruck",
			latin: "Spes urbis servandae cives confirmavit.",
			hint: "Beim attributiven Gerundiv stehen Nomen und -nd-Form in Kasus, Numerus und Genus zusammen (oft nach ad: ad pacem faciendam = um Frieden zu schließen).",
			passivisch: "Die Hoffnung auf die zu rettende Stadt stärkte die Bürger.",
			idiomatisch: "Die Hoffnung auf Rettung der Stadt (die Stadt zu retten) stärkte die Bürger.",
		},
		praedikativ: {
			leftLabel: "Subjekt (Nom.)",
			leftText: "Carthāgō (Nom. Sg. f.)",
			rightLabel: "Gerundiv + esse",
			rightText: "dēlenda est",
			relationBadge: "Notwendigkeit / Pflicht („müssen“)",
			latin: "Carthago delenda est. / Leges servandae sunt.",
			hint: "Prädikatives Gerundiv mit Form von esse drückt Pflicht oder Notwendigkeit aus; verneint mit non bedeutet es „nicht dürfen“.",
			passivisch: "Karthago muss zerstört werden. / Gesetze müssen geachtet werden.",
			idiomatisch: "Man muss Karthago zerstören. / Man muss die Gesetze achten.",
		},
		auctoris: {
			leftLabel: "Dativus auctoris (Urheber)",
			leftText: "cīvĭbus (Dat. Pl.)",
			rightLabel: "Gerundiv + esse",
			rightText: "lēx servanda est",
			relationBadge: "Dativ statt a/ab + Abl. → wird Subjekt im Deutschen",
			latin: "Leges bonis civibus semper servandae sunt.",
			hint: "Die Person, die etwas tun muss, steht bei Gerundiv + esse im Dativ (Dativ des Urhebers) und wird im aktiven deutschen Satz zum Subjekt.",
			passivisch: "Die Gesetze müssen von guten Bürgern immer geachtet werden.",
			idiomatisch: "Gute Bürger müssen die Gesetze immer achten.",
		},
	};
	const entry = data[mode];
	return {
		mode,
		leftLabel: entry.leftLabel,
		leftText: entry.leftText,
		rightLabel: entry.rightLabel,
		rightText: entry.rightText,
		relationBadge: entry.relationBadge,
		latin: entry.latin,
		hint: entry.hint,
		german: entry[style],
	};
}

export type NciTrigger = "dicitur" | "videtur" | "traduntur" | "iubetur";
export type NciRel = "gleichzeitig" | "vorzeitig";
export type NciStyle = "unpersoenlich" | "modal";

export interface NciResult {
	trigger: NciTrigger;
	rel: NciRel;
	style: NciStyle;
	subjNom: string;
	verbPass: string;
	infinitive: string;
	latin: string;
	german: string;
	hint: string;
}

export function nciModel(
	trigger: NciTrigger,
	rel: NciRel,
	style: NciStyle,
): NciResult {
	const table: Record<
		NciTrigger,
		Record<NciRel, Omit<NciResult, "trigger" | "rel" | "style" | "german"> & Record<NciStyle, string>>
	> = {
		dicitur: {
			gleichzeitig: {
				subjNom: "Sōcrătēs (Nom.)",
				verbPass: "dīcĭtur (3. Sg. Pass.)",
				infinitive: "sapientiam docēre",
				latin: "Socrates sapientiam docere dicitur.",
				hint: "Gleichzeitiger Infinitiv Präsens: Der Nominativ Socrates wird im deutschen dass-Satz zum Subjekt.",
				unpersoenlich: "Man sagt, dass Sokrates Weisheit lehre / lehrt.",
				modal: "Sokrates soll Weisheit lehren.",
			},
			vorzeitig: {
				subjNom: "Sōcrătēs (Nom.)",
				verbPass: "dīcĭtur (3. Sg. Pass.)",
				infinitive: "sapiēns fuisse (Nom.!)",
				latin: "Socrates sapiens fuisse dicitur.",
				hint: "Beachte: Im NcI steht auch das Prädikatsnomen (sapiens) im Nominativ!",
				unpersoenlich: "Man sagt, dass Sokrates weise gewesen sei.",
				modal: "Sokrates soll weise gewesen sein.",
			},
		},
		videtur: {
			gleichzeitig: {
				subjNom: "Seneca (Nom.)",
				verbPass: "vidētur (3. Sg. Pass.)",
				infinitive: "recte monēre",
				latin: "Seneca recte monere videtur.",
				hint: "videri heißt im NcI „scheinen / den Anschein haben“ (nicht „gesehen werden“).",
				unpersoenlich: "Es scheint, dass Seneca richtig mahnt.",
				modal: "Seneca scheint richtig zu mahnen.",
			},
			vorzeitig: {
				subjNom: "Seneca (Nom.)",
				verbPass: "vidētur (3. Sg. Pass.)",
				infinitive: "multa scrīpsisse",
				latin: "Seneca multa scripsisse videtur.",
				hint: "Infinitiv Perfekt drückt Vorzeitigkeit gegenüber videtur aus.",
				unpersoenlich: "Es scheint, dass Seneca vieles geschrieben hat.",
				modal: "Seneca scheint vieles geschrieben zu haben.",
			},
		},
		traduntur: {
			gleichzeitig: {
				subjNom: "Germānī (Nom. Pl.)",
				verbPass: "trāduntur (3. Pl. Pass.)",
				infinitive: "cum Rōmānīs mercārī",
				latin: "Germani cum Romanis mercari traduntur.",
				hint: "Personalverb stimmt im Numerus (Plural traduntur) mit dem Subjekt Germani überein.",
				unpersoenlich: "Man überliefert, dass die Germanen mit den Römern Handel treiben.",
				modal: "Die Germanen sollen mit den Römern Handel treiben.",
			},
			vorzeitig: {
				subjNom: "Germānī (Nom. Pl.)",
				verbPass: "trāduntur (3. Pl. Pass.)",
				infinitive: "lītem composuisse",
				latin: "Germani litem composuisse traduntur.",
				hint: "traduntur (Plural!) wird im Deutschen unpersönlich („man überliefert / es wird berichtet“) oder mit „sollen“ wiedergegeben.",
				unpersoenlich: "Man überliefert, dass die Germanen den Streit beigelegt haben.",
				modal: "Die Germanen sollen den Streit beigelegt haben.",
			},
		},
		iubetur: {
			gleichzeitig: {
				subjNom: "Lēgātus (Nom.)",
				verbPass: "iubētur (3. Sg. Pass.)",
				infinitive: "lītem dīiūdicāre",
				latin: "Legatus litem diiudicare iubetur.",
				hint: "Bei iuberi (anordnen/befehlen) und vetari (verbieten) steht im Deutschen der Befehl als Subjekt oder mit „sollen / müssen“.",
				unpersoenlich: "Man befiehlt, dass der Statthalter den Streit schlichtet (dem Statthalter wird befohlen, …).",
				modal: "Der Statthalter soll / muss den Streit auf Befehl schlichten.",
			},
			vorzeitig: {
				subjNom: "Lēgātus (Nom.)",
				verbPass: "iubētur (3. Sg. Pass.)",
				infinitive: "lēgem tulisse (selten)",
				latin: "Legatus pacem fecisse existimatur.",
				hint: "Verben des Meinens wie existimatur drücken eine Einschätzung in Gleich- oder Vorzeitigkeit aus.",
				unpersoenlich: "Man meint, dass der Statthalter Frieden geschlossen habe.",
				modal: "Der Statthalter dürfte Frieden geschlossen haben / soll Frieden geschlossen haben.",
			},
		},
	};
	const entry = table[trigger][rel];
	return {
		trigger,
		rel,
		style,
		subjNom: entry.subjNom,
		verbPass: entry.verbPass,
		infinitive: entry.infinitive,
		latin: entry.latin,
		hint: entry.hint,
		german: entry[style],
	};
}

export type HauptsatzModus8 =
	| "deliberativ-pr"
	| "deliberativ-vg"
	| "potentialis"
	| "vergleich-l7";

export interface Modus8Result {
	id: HauptsatzModus8;
	title: string;
	form: string;
	negation: string;
	latin: string;
	german: string;
}

export function hauptsatzModusModel(mood: HauptsatzModus8): Modus8Result {
	const table: Record<HauptsatzModus8, Modus8Result> = {
		"deliberativ-pr": {
			id: "deliberativ-pr",
			title: "Deliberativ der Gegenwart (Zweifelsfrage)",
			form: "Konjunktiv Präsens (meist 1. Person)",
			negation: "non (nicht ne!)",
			latin: "Quid faciam? Cur non respondeam?",
			german: "Was soll ich tun? Warum soll ich nicht antworten?",
		},
		"deliberativ-vg": {
			id: "deliberativ-vg",
			title: "Deliberativ der Vergangenheit",
			form: "Konjunktiv Imperfekt (1. Person)",
			negation: "non (nicht ne!)",
			latin: "Quid facerem? Quo me verterem?",
			german: "Was hätte ich tun sollen? Wohin hätte ich mich wenden sollen?",
		},
		potentialis: {
			id: "potentialis",
			title: "Potentialis der Gegenwart (Möglichkeit)",
			form: "Konj. Präsens oder Perfekt (z. B. dixerim)",
			negation: "non (nicht ne!)",
			latin: "Aliquis dicat: Hoc fieri non potest. / Hoc non dixerim.",
			german:
				"Jemand könnte sagen: Dies kann nicht geschehen. / Das möchte ich nicht behaupten.",
		},
		"vergleich-l7": {
			id: "vergleich-l7",
			title: "Abgrenzung zu Klasse 7 (Begehren/Wunsch)",
			form: "Hortativ / Jussiv / Prohibitiv / Optativ",
			negation: "ne!",
			latin: "Ne dubitaveris! (Prohibitiv) ≠ Non dubitem? (Deliberativ)",
			german:
				"Zweifle nicht! (Verbot mit ne) ≠ Sollte ich nicht zweifeln? (Frage mit non)",
		},
	};
	return table[mood];
}

export type RelativSense = "final" | "kausal" | "konsekutiv" | "konzessiv";

export interface RelativKonjResult {
	sense: RelativSense;
	title: string;
	signal: string;
	latin: string;
	german: string;
	hint: string;
}

export function relativKonjModel(sense: RelativSense): RelativKonjResult {
	const table: Record<RelativSense, RelativKonjResult> = {
		final: {
			sense: "final",
			title: "Finaler Relativsatz (Zweck)",
			signal: "nach mittere, eligere, dare",
			latin: "Imperator legatos misit, qui pacem peterent.",
			german:
				"Der Feldherr schickte Gesandte, damit sie um Frieden bäten (um … zu bitten).",
			hint: "Ein Relativsatz mit Konjunktiv nach mittere/eligere ersetzt einen ut-Finalsatz.",
		},
		kausal: {
			sense: "kausal",
			title: "Kausaler Relativsatz (Grund)",
			signal: "oft mit quippe qui / ut qui",
			latin: "Felix es, qui verum amicum inveneris.",
			german: "Du bist glücklich, weil du einen wahren Freund gefunden hast.",
			hint: "Der Konjunktiv zeigt, dass der Relativsatz eine Begründung für den Hauptsatz liefert.",
		},
		konsekutiv: {
			sense: "konsekutiv",
			title: "Konsekutiver Relativsatz (Folge)",
			signal: "nach dignus / nemo / sunt qui",
			latin: "Sunt, qui philosophiam contemnant. / Dignus est, qui laudetur.",
			german:
				"Es gibt Leute, die (von der Art, dass sie) die Philosophie verachten. / Er ist wert, gelobt zu werden.",
			hint: "Nach allgemeinen Existenzaussagen (sunt qui) oder dignus steht der Relativsatz im Konjunktiv.",
		},
		konzessiv: {
			sense: "konzessiv",
			title: "Konzessiver Relativsatz (obwohl)",
			signal: "Kontrast zu Hauptsatz / tamen",
			latin: "Cicero, qui consul fuisset, tamen exsilium passus est.",
			german: "Cicero musste, obwohl er Konsul gewesen war, dennoch ins Exil gehen.",
			hint: "Wenn das Relativsatz-Geschehen im Kontrast zum Hauptsatz steht, löst „obwohl“ ihn treffend auf.",
		},
	};
	return table[sense];
}

export interface TimelinePhase {
	id: string;
	title: string;
	badge: string;
	detail: string;
}

export const KAISERZEIT_PHASES: TimelinePhase[] = [
	{
		id: "julisch",
		title: "Frühe Kaiserzeit",
		badge: "14–96 n. Chr.",
		detail:
			"Nach Augustus regieren Julisch-Claudier (Tiberius, Caligula, Claudius, Nero) und Flavier (Vespasian, Titus, Domitian). Übermacht Einzelner führt bei Caligula oder Nero oft zum sogenannten „Caesarenwahn“.",
	},
	{
		id: "adoptiv",
		title: "Adoptivkaiser & Blüte",
		badge: "96–192 n. Chr.",
		detail:
			"Nerva, Trajan, Hadrian, Antoninus Pius und Mark Aurel sichern Reichsgrenzen (Limes), Verwaltung, Handel und Rechtskultur; größte Reichsausdehnung unter Trajan (117 n. Chr.).",
	},
	{
		id: "krise",
		title: "Reichskrise & Reform",
		badge: "235–305 n. Chr.",
		detail:
			"Soldatenkaiser, Bürgerkriege und Einfälle an Rhein und Donau erschüttern das Imperium; Diokletian stabilisiert es durch Teilung in West- und Ostreich (Tetrarchie).",
	},
	{
		id: "spaet",
		title: "Spätantike",
		badge: "306–476 n. Chr.",
		detail:
			"Konstantin (Mailand 313, Konstantinopel) und Theodosius (Staatsreligion, Reichsteilung 395); 476 n. Chr. Ende des weströmischen Kaisertums.",
	},
];

export const CHRISTENTUM_PHASES: TimelinePhase[] = [
	{
		id: "verfolgung",
		title: "Verfolgung & Konflikt",
		badge: "64–311 n. Chr.",
		detail:
			"Die Verweigerung des Kaiserkults bringt Christen in Konflikt mit Rom (Nero 64, Decius, Diokletian); dennoch wachsen Gemeinden in den Städten des Mittelmeerraums.",
	},
	{
		id: "mailand",
		title: "Mailänder Vereinbarung",
		badge: "313 n. Chr.",
		detail:
			"Konstantin der Große und Licinius gewähren Religionsfreiheit und Toleranz für das Christentum (noch keine Staatsreligion!).",
	},
	{
		id: "staatsreligion",
		title: "Staatsreligion",
		badge: "380/391 n. Chr.",
		detail:
			"Kaiser Theodosius I. erhebt das nizänische Christentum zur Staatsreligion und verbietet öffentliche heidnische Kulte.",
	},
	{
		id: "synthese",
		title: "Wechselseitiger Einfluss",
		badge: "4.–5. Jh. n. Chr.",
		detail:
			"Kirchenväter (z. B. Hieronymus mit der Vulgata, Augustinus) übernehmen antike Rhetorik, Philosophie und lateinische Bildung für christliche Texte und Kultur.",
	},
];

export const EUROPA_PHASES: TimelinePhase[] = [
	{
		id: "karolinger",
		title: "Karolingische Renaissance",
		badge: "um 800 n. Chr.",
		detail:
			"Karl der Große und Gelehrte wie Alkuin pflegen Klosterschulen, karolingische Minuskel und ein einheitliches Latein für Verwaltung, Kirche und Bildung.",
	},
	{
		id: "humanismus",
		title: "Renaissance-Humanismus",
		badge: "14.–16. Jh.",
		detail:
			"Petrarca und Erasmus entdecken antike Handschriften wieder; Latein dient als elegante Bildungssprache in Literatur, Diplomatie und europäischen Universitäten.",
	},
	{
		id: "reformation",
		title: "Reformation & Wissenschaft",
		badge: "16.–18. Jh.",
		detail:
			"Auch in der Reformationszeit (z. B. Melanchthon) und bei Naturwissenschaftlern wie Kopernikus, Kepler oder Newton bleibt Latein internationale Gelehrtensprache.",
	},
	{
		id: "neuzeit",
		title: "Neuzeit & Vatikan",
		badge: "19. Jh. – heute",
		detail:
			"Im Vatikan (Enzykliken), in Rechtsbegriffen, Medizin, Botanik und modernen Lehnwörtern wirkt Latein bis in die Gegenwart weiter.",
	},
];

export type LimesLayer = "all" | "kastelle" | "handel";

export interface LimesPlace {
	id: string;
	name: string;
	layers: ("kastelle" | "handel")[];
	x: number;
	y: number;
	labelAnchor: "start" | "end" | "middle";
	labelDx: number;
	labelDy: number;
	info: string;
}

export const LIMES_PLACES: LimesPlace[] = [
	{
		id: "mogontiacum",
		name: "Mogontiacum",
		layers: ["kastelle", "handel"],
		x: 122,
		y: 124,
		labelAnchor: "end",
		labelDx: -10,
		labelDy: 4,
		info: "Mogontiacum (heute Mainz): Hauptstadt der Provinz Germania Superior, Legionsstandort und wichtiger Rheinhafen.",
	},
	{
		id: "saalburg",
		name: "Saalburg",
		layers: ["kastelle"],
		x: 162,
		y: 84,
		labelAnchor: "start",
		labelDx: 10,
		labelDy: -4,
		info: "Kastell Saalburg im Taunus (heute rekonstruiert): Kohortenkastell mit angeschlossenem Zivildorf (vicus) am Obergermanischen Limes.",
	},
	{
		id: "aalen",
		name: "Aalen",
		layers: ["kastelle", "handel"],
		x: 248,
		y: 170,
		labelAnchor: "end",
		labelDx: -10,
		labelDy: 4,
		info: "Ala-Kastell Aalen (größtes Reiterkastell am Raetischen Limes); kontrollierte Grenzübergänge und Verkehrswege.",
	},
	{
		id: "biriciana",
		name: "Weißenburg",
		layers: ["kastelle"],
		x: 320,
		y: 156,
		labelAnchor: "middle",
		labelDx: 0,
		labelDy: -13,
		info: "Biriciana (Weißenburg in Bayern): Bedeutendes Kastell am Raetischen Limes mit Thermen und berühmtem römischem Schatzfund.",
	},
	{
		id: "castra-regina",
		name: "Castra Regina",
		layers: ["kastelle", "handel"],
		x: 390,
		y: 176,
		labelAnchor: "start",
		labelDx: 8,
		labelDy: -10,
		info: "Castra Regina (Regensburg): Unter Mark Aurel 179 n. Chr. angelegtes Legionslager (Porta Praetoria) an der Donau.",
	},
	{
		id: "quintana",
		name: "Künzing",
		layers: ["kastelle"],
		x: 458,
		y: 194,
		labelAnchor: "end",
		labelDx: -8,
		labelDy: 16,
		info: "Quintana (Künzing in Niederbayern): Kastell am Donaulimes mit einzigartigem Holz-Erde-Amphitheater und Museum.",
	},
	{
		id: "batavis",
		name: "Batavis (Passau)",
		layers: ["kastelle", "handel"],
		x: 518,
		y: 204,
		labelAnchor: "start",
		labelDx: 10,
		labelDy: -8,
		info: "Batavis (Passau) am Zusammenfluss von Donau, Inn und Ilz: Grenzstützpunkt und Umschlagplatz für Fluss- und Fernhandel.",
	},
	{
		id: "augusta-vindelicum",
		name: "Augsburg",
		layers: ["handel"],
		x: 294,
		y: 238,
		labelAnchor: "middle",
		labelDx: 0,
		labelDy: 18,
		info: "Augusta Vindelicum (Augsburg): Hauptstadt der Provinz Raetia und Knotenpunkt römischer Fernstraßen (Via Claudia Augusta) nach Italien.",
	},
];

export interface RechtCase {
	id: string;
	maxim: string;
	german: string;
	romanOrigin: string;
	modernCase: string;
	principle: string;
	shortPrinciple: string;
}

export const RECHT_CASES: RechtCase[] = [
	{
		id: "in-dubio",
		maxim: "In dubio pro reo",
		german: "Im Zweifel für den Angeklagten",
		romanOrigin:
			"Grundgedanke des römischen Beweisrechts (Unschuldsvermutung: Wer anklagt, trägt die Beweislast).",
		modernCase:
			"Kann ein Gericht nicht zweifelsfrei klären, ob ein Beschuldigter eine Tat begangen hat, erfolgt ein Freispruch.",
		principle: "Rechtsstaatsprinzip & Unschuldsvermutung (u. a. EMRK / StPO)",
		shortPrinciple: "Unschuldsvermutung",
	},
	{
		id: "audiatur",
		maxim: "Audiatur et altera pars",
		german: "Man höre auch die andere Seite",
		romanOrigin:
			"Römisches Prozessprinzip vor dem Prätor und bekannt aus Senecas Medea.",
		modernCase:
			"In jedem Gerichts- oder Schulordnungsverfahren erhält nicht nur der Kläger, sondern auch der Betroffene das Wort.",
		principle: "Anspruch auf rechtliches Gehör (Art. 103 Abs. 1 GG)",
		shortPrinciple: "Rechtliches Gehör (GG)",
	},
	{
		id: "pacta",
		maxim: "Pacta sunt servanda",
		german: "Verträge sind einzuhalten",
		romanOrigin:
			"Zentraler Grundsatz der bona fides (Treu und Glauben) im römischen Vertragsrecht.",
		modernCase:
			"Wer einen Kauf- oder Mietvertrag schließt, bleibt an seine Zusage gebunden und kann nicht willkürlich zurücktreten.",
		principle: "Vertragsbindung im Zivil- und Völkerrecht (BGB)",
		shortPrinciple: "Vertragstreue (BGB)",
	},
	{
		id: "nulla-poena",
		maxim: "Nulla poena sine lege",
		german: "Keine Strafe ohne Gesetz",
		romanOrigin:
			"Anknüpfend an geschriebene römische Gesetze (seit dem Zwölftafelgesetz 450 v. Chr.) und im 19. Jh. lateinisch geprägt.",
		modernCase:
			"Eine Handlung darf nur bestraft werden, wenn sie vor der Tat gesetzlich mit Strafe bedroht war.",
		principle: "Gesetzlichkeitsprinzip & Rückwirkungsverbot (Art. 103 Abs. 2 GG)",
		shortPrinciple: "Rückwirkungsverbot (GG)",
	},
];

export interface PhiloSchool {
	id: string;
	name: string;
	keyTerm: string;
	thinker: string;
	goal: string;
	lifeQuestion: string;
}

export const PHILO_SCHOOLS: PhiloSchool[] = [
	{
		id: "vorsokratiker",
		name: "Vorsokratiker",
		keyTerm: "Archē & Logos (Urprinzip)",
		thinker: "Thales, Heraklit, Demokrit",
		goal: "Die Welt vernünftig durch Naturbeobachtung (Wasser, Werden, Atome) statt bloßer Göttermythen erklären.",
		lifeQuestion: "Woraus besteht die Natur, und nach welchen Regeln wandelt sie sich?",
	},
	{
		id: "sokrates",
		name: "Sokrates",
		keyTerm: "Mäeutik & Selbstprüfung",
		thinker: "Sokrates (Athen, 5. Jh. v. Chr.)",
		goal: "Durch gezieltes Fragen (Dialog) Scheinwissen entlarven („Ich weiß, dass ich nichts weiß“) und das Gute erkennen.",
		lifeQuestion: "Welche Überzeugungen halten einer kritischen Nachfrage wirklich stand?",
	},
	{
		id: "epikur",
		name: "Epikureer",
		keyTerm: "Ataraxia (Seelenruhe)",
		thinker: "Epikur · in Rom z. B. Lukrez",
		goal: "Angst vor Göttern und Tod abbauen; ein bescheidenes Leben mit guten Freunden und maßvoll gewählter Freude führen.",
		lifeQuestion: "Was brauche ich wirklich für ein ruhiges, freies Leben im Freundeskreis?",
	},
	{
		id: "stoa",
		name: "Stoiker",
		keyTerm: "Apatheia & Virtus (Tugend)",
		thinker: "Zenon, Chrysipp · in Rom Seneca, Mark Aurel",
		goal: "Zwischen Kontrollierbarem (eigene Haltung) und Unverfügbarem unterscheiden und vernünftig für die Gemeinschaft handeln.",
		lifeQuestion: "Wie bleibe ich auch in Krisen gelassen, gerecht und handlungsfähig?",
	},
	{
		id: "cicero-seneca",
		name: "Cicero & Seneca",
		keyTerm: "Humanitas & Pflichtethik",
		thinker: "M. Tullius Cicero · L. Annaeus Seneca",
		goal: "Griechische Philosophie ins Lateinische übertragen, Begriffe prägen und Ethik für Politik und Alltag nutzbar machen.",
		lifeQuestion: "Wie verbinde ich philosophisches Nachdenken mit Verantwortung im Gemeinwesen?",
	},
];

export function renderStageIcon(icon: string): string {
	switch (icon) {
		case "scroll":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h11a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h11"/><path d="M7 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/><path d="M10 13h6"/></svg>`;
		case "pillar":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h14M6 8h12M7 19h10M5 21h14M8 8v11M12 8v11M16 8v11"/></svg>`;
		case "verb":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15c2.5-6 6-9 8-9s5.5 3 8 9"/><path d="M8 15h8"/><circle cx="12" cy="6" r="1.5" fill="currentColor"/><path d="M4 19h16"/></svg>`;
		case "scale":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M5 7h14M8 20h8"/><path d="M5 7l-2.5 6h5L5 7zM19 7l-2.5 6h5L19 7z"/></svg>`;
		case "map":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v14M15 6v14"/></svg>`;
		case "justice":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v17M6 7h12M8 20h8"/><path d="M6 7l-2 5h4l-2-5zM18 7l-2 5h4l-2-5z"/><circle cx="12" cy="4.5" r="1.2" fill="currentColor"/></svg>`;
		case "temple":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10L12 4l9 6H3zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 18h18M2 21h20"/></svg>`;
		default:
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="15.5,8.5 13.2,13.2 8.5,15.5 10.8,10.8" fill="currentColor" stroke="none"/></svg>`;
	}
}

function defaultParts(lesson: Lesson): [DiagramNode, DiagramNode, DiagramNode] {
	return (
		lesson.diagram.parts ?? [
			{
				id: "part-1",
				label: "1 · Form",
				badge: "Erkennen",
				detail: lesson.takeaway,
			},
			{
				id: "part-2",
				label: "2 · Funktion",
				badge: "Einordnen",
				detail: lesson.skill,
			},
			{
				id: "part-3",
				label: "3 · Anwendung",
				badge: "Übertragen",
				detail: "Prüfe stets Sinnrichtung und Kontextbezug im Material.",
			},
		]
	);
}

function wrapSvgText(text: string, maxChars: number): string[] {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let current = "";
	for (const word of words) {
		if (current && `${current} ${word}`.length > maxChars) {
			lines.push(current);
			current = word;
		} else {
			current = current ? `${current} ${word}` : word;
		}
	}
	if (current) lines.push(current);
	return lines.slice(0, 2);
}

function renderThreeNodeSvg(
	lesson: Lesson,
	layout: "morph" | "myth" | "syntax",
): string {
	const parts = defaultParts(lesson);
	const xs = [18, 224, 430];
	const shapes = parts.map((part, i) => {
		const x = xs[i];
		const cx = x + 96;
		const connector =
			i < 2
				? layout === "myth"
					? `<line x1="${x + 194}" y1="116" x2="${xs[i + 1] - 2}" y2="116" stroke="var(--stage-color)" stroke-width="2.5" stroke-dasharray="5 4"/>`
					: `<path d="M${x + 194} 116 H${xs[i + 1] - 8} l-6 -5 m6 5 l-6 5" fill="none" stroke="var(--stage-color)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`
				: "";
		const badgeFont = part.badge.length > 24 ? 10.5 : 11.5;
		const labelLines = wrapSvgText(part.label, 21);
		const labelHtml = labelLines
			.map(
				(line, li) =>
					`<tspan x="${cx}" dy="${li === 0 ? 0 : 17}">${esc(line)}</tspan>`,
			)
			.join("");
		const latinLines = part.latin ? wrapSvgText(part.latin, 24) : [];
		const latinStartY = labelLines.length > 1 ? 148 : 140;
		const latinHtml = latinLines
			.map(
				(line, li) =>
					`<tspan x="${cx}" dy="${li === 0 ? 0 : 15}">${esc(line)}</tspan>`,
			)
			.join("");
		return `${connector}<g class="svg-node" data-part-index="${i}" tabindex="0" role="button" aria-pressed="${i === 0}">
			<rect x="${x}" y="38" width="192" height="156" rx="14" fill="var(--surface)" stroke="${i === 0 ? "var(--stage-color)" : "var(--line)"}" stroke-width="${i === 0 ? 3 : 1.5}"/>
			<rect x="${x + 10}" y="50" width="172" height="24" rx="12" fill="var(--accent-soft)"/>
			<text x="${cx}" y="66" text-anchor="middle" font-size="${badgeFont}" font-weight="700" class="svg-accent">${esc(part.badge)}</text>
			<text x="${cx}" y="102" text-anchor="middle" font-size="14" font-weight="700">${labelHtml}</text>
			${latinLines.length ? `<text x="${cx}" y="${latinStartY}" text-anchor="middle" font-size="12" font-style="italic" class="svg-muted">${latinHtml}</text>` : ""}
		</g>`;
	});
	return `<svg class="diagram-svg" viewBox="0 0 640 218" role="img" aria-label="${esc(lesson.diagram.title)}">
		<text x="20" y="24" font-size="13" font-weight="700" class="svg-muted">Klicke auf einen der drei Bausteine:</text>
		${shapes.join("")}
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(parts[0].label)}</strong> · <span class="small">${esc(parts[0].badge)}</span><p>${esc(parts[0].detail)}</p></div>`;
}

function renderPaenultimaLab(lesson: Lesson): string {
	const init = PAENULTIMA_WORDS[0];
	return `<div class="diagram-controls" role="group" aria-label="Beispielwort für Pänultima-Betonung">
		${PAENULTIMA_WORDS.map(
			(entry, i) =>
				`<button type="button" class="button secondary" data-paen-word="${entry.id}" aria-pressed="${i === 0}">${esc(entry.id)}</button>`,
		).join("")}
	</div>
	<svg class="diagram-svg" id="paen-svg" viewBox="0 0 640 165" role="img" aria-label="${esc(lesson.diagram.title)}">
		${renderPaenultimaSvgBody(init)}
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong lang="la">${esc(init.word)}</strong> · <span>${esc(init.meaning)}</span><p>${esc(init.paenultimaRule)}</p></div>`;
}

function renderPaenultimaSvgBody(entry: PaenultimaEntry): string {
	const n = entry.syllables.length;
	const boxW = Math.min(104, Math.floor(540 / n) - 10);
	const totalW = n * boxW + (n - 1) * 10;
	const startX = Math.round((640 - totalW) / 2);
	const boxes = entry.syllables
		.map((syl, i) => {
			const x = startX + i * (boxW + 10);
			const stressed = i === entry.stressIndex;
			const role =
				i === n - 1
					? "Ultima"
					: i === n - 2
						? "Paenultima"
						: i === n - 3
							? "Antepaen."
							: `Silbe ${i + 1}`;
			return `<g>
				<rect x="${x}" y="38" width="${boxW}" height="64" rx="10" fill="${stressed ? "var(--accent-soft)" : "var(--surface)"}" stroke="${stressed ? "var(--stage-color)" : "var(--line)"}" stroke-width="${stressed ? 3 : 1.5}"/>
				<text x="${x + boxW / 2}" y="66" text-anchor="middle" font-size="16" font-weight="700" class="${stressed ? "svg-accent" : ""}">${esc(syl)}</text>
				<text x="${x + boxW / 2}" y="88" text-anchor="middle" font-size="10.5" class="svg-muted">${esc(role)}</text>
			</g>`;
		})
		.join("");
	return `<text x="320" y="24" text-anchor="middle" font-size="12" font-weight="700" class="svg-muted">Silbengewicht von hinten prüfen (Ultima ← Paenultima ← Antepaenultima):</text>
		${boxes}
		<text x="320" y="138" text-anchor="middle" font-size="14" font-weight="700" class="svg-accent">${esc(entry.syllables.map((s, i) => (i === entry.stressIndex ? s.toUpperCase() : s)).join("-"))}</text>`;
}

function renderVerbLab(lesson: Lesson): string {
	const initKind: VerbKind =
		lesson.diagram.preset === "semi"
			? "semideponens"
			: lesson.diagram.preset === "fieri"
				? "fieri"
				: "i-deponens";
	const init = verbModel(initKind);
	const keys: [VerbKind, string][] = [
		["i-deponens", "i-Deponens"],
		["kons-deponens", "kons. Deponens"],
		["kons-i-deponens", "kons. i-Erw."],
		["semideponens", "Semideponens"],
		["perfektopraesens", "Perfektopräsens"],
		["fieri", "fieri"],
	];
	return `<div class="diagram-controls" role="group" aria-label="Verbklasse">
		${keys
			.map(
				([k, label]) =>
					`<button type="button" class="button secondary" data-verb-kind="${k}" aria-pressed="${k === initKind}">${esc(label)}</button>`,
			)
			.join("")}
	</div>
	<svg class="diagram-svg" viewBox="0 0 640 175" role="img" aria-label="${esc(lesson.diagram.title)}">
		<rect x="28" y="28" width="272" height="62" rx="10" fill="var(--surface)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="164" y="50" text-anchor="middle" font-size="11" class="svg-muted">Präsensstamm</text>
		<text id="vl-pres" x="164" y="74" text-anchor="middle" font-size="13" font-weight="700">${esc(init.presentBox)}</text>
		<rect x="340" y="28" width="272" height="62" rx="10" fill="var(--accent-soft)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="476" y="50" text-anchor="middle" font-size="11" class="svg-muted">Perfektstamm / Besonderheit</text>
		<text id="vl-perf" x="476" y="74" text-anchor="middle" font-size="13" font-weight="700">${esc(init.perfectBox)}</text>
		<text id="vl-badge" x="320" y="132" text-anchor="middle" font-size="15" font-weight="700" class="svg-accent">${esc(init.ruleBadge)}</text>
		<text id="vl-label" x="320" y="156" text-anchor="middle" font-size="12" class="svg-muted">${esc(init.label)}</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong lang="la">${esc(init.latin)}</strong><p>→ ${esc(init.german)}</p><p class="small">${esc(init.hint)}</p></div>`;
}

function renderGerundivLab(lesson: Lesson): string {
	const initMode: GerundivMode =
		lesson.diagram.preset === "attributiv" ||
		lesson.diagram.preset === "praedikativ" ||
		lesson.diagram.preset === "auctoris"
			? (lesson.diagram.preset as GerundivMode)
			: "gerund";
	const init = gerundivModel(initMode, "passivisch");
	return `<div class="diagram-controls" role="group" aria-label="nd-Konstruktion">
		<button type="button" class="button secondary" data-ger-mode="gerund" aria-pressed="${initMode === "gerund"}">Gerund (Kl. 7)</button>
		<button type="button" class="button secondary" data-ger-mode="attributiv" aria-pressed="${initMode === "attributiv"}">Gerundiv attributiv</button>
		<button type="button" class="button secondary" data-ger-mode="praedikativ" aria-pressed="${initMode === "praedikativ"}">Gerundiv + esse</button>
		<button type="button" class="button secondary" data-ger-mode="auctoris" aria-pressed="${initMode === "auctoris"}">Dativus auctoris</button>
	</div>
	<div class="diagram-controls" role="group" aria-label="Deutsche Übersetzung">
		<button type="button" class="button secondary" data-ger-style="passivisch" aria-pressed="true">Wörtlich / passivnah</button>
		<button type="button" class="button secondary" data-ger-style="idiomatisch" aria-pressed="false">Idiomatisches Deutsch</button>
	</div>
	<svg class="diagram-svg" viewBox="0 0 640 175" role="img" aria-label="${esc(lesson.diagram.title)}">
		<rect x="30" y="28" width="260" height="62" rx="10" fill="var(--surface)" stroke="var(--stage-color)" stroke-width="2"/>
		<text id="gl-left-label" x="160" y="50" text-anchor="middle" font-size="11" class="svg-muted">${esc(init.leftLabel)}</text>
		<text id="gl-left-text" x="160" y="74" text-anchor="middle" font-size="14" font-weight="700">${esc(init.leftText)}</text>
		<path d="M298 59 H342 l-6 -5 m6 5 l-6 5" fill="none" stroke="var(--stage-color)" stroke-width="2.4" stroke-linecap="round"/>
		<rect x="350" y="28" width="260" height="62" rx="10" fill="var(--accent-soft)" stroke="var(--stage-color)" stroke-width="2"/>
		<text id="gl-right-label" x="480" y="50" text-anchor="middle" font-size="11" class="svg-muted">${esc(init.rightLabel)}</text>
		<text id="gl-right-text" x="480" y="74" text-anchor="middle" font-size="14" font-weight="700">${esc(init.rightText)}</text>
		<text id="gl-rel" x="320" y="134" text-anchor="middle" font-size="14" font-weight="700" class="svg-accent">${esc(init.relationBadge)}</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong lang="la">${esc(init.latin)}</strong><p>→ ${esc(init.german)}</p><p class="small">${esc(init.hint)}</p></div>`;
}

function renderNciLab(lesson: Lesson): string {
	const initStyle: NciStyle =
		lesson.diagram.preset === "modal" ? "modal" : "unpersoenlich";
	const init = nciModel("dicitur", "gleichzeitig", initStyle);
	return `<div class="diagram-controls" role="group" aria-label="Auslösendes NcI-Verb">
		<button type="button" class="button secondary" data-nci-trig="dicitur" aria-pressed="true">dicitur</button>
		<button type="button" class="button secondary" data-nci-trig="videtur" aria-pressed="false">videtur</button>
		<button type="button" class="button secondary" data-nci-trig="traduntur" aria-pressed="false">traduntur (Pl.)</button>
		<button type="button" class="button secondary" data-nci-trig="iubetur" aria-pressed="false">iubetur</button>
	</div>
	<div class="diagram-controls" role="group" aria-label="Zeitverhältnis und Übersetzungsart">
		<button type="button" class="button secondary" data-nci-rel="gleichzeitig" aria-pressed="true">Gleichzeitig (Inf. Präs.)</button>
		<button type="button" class="button secondary" data-nci-rel="vorzeitig" aria-pressed="false">Vorzeitig (Inf. Perf.)</button>
		<button type="button" class="button secondary" data-nci-style="unpersoenlich" aria-pressed="${initStyle === "unpersoenlich"}">Unpersönlich (dass-Satz)</button>
		<button type="button" class="button secondary" data-nci-style="modal" aria-pressed="${initStyle === "modal"}">Modal (soll / scheint)</button>
	</div>
	<svg class="diagram-svg" viewBox="0 0 640 175" role="img" aria-label="${esc(lesson.diagram.title)}">
		<rect x="24" y="28" width="180" height="62" rx="10" fill="var(--surface)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="114" y="50" text-anchor="middle" font-size="11" class="svg-muted">Subjekt (Nominativ)</text>
		<text id="nl-subj" x="114" y="74" text-anchor="middle" font-size="14" font-weight="700">${esc(init.subjNom)}</text>
		<rect x="220" y="28" width="190" height="62" rx="10" fill="var(--accent-soft)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="315" y="50" text-anchor="middle" font-size="11" class="svg-muted">Prädikat (3. Pers. Passiv)</text>
		<text id="nl-verb" x="315" y="74" text-anchor="middle" font-size="14" font-weight="700" class="svg-accent">${esc(init.verbPass)}</text>
		<rect x="426" y="28" width="190" height="62" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
		<text x="521" y="50" text-anchor="middle" font-size="11" class="svg-muted">Infinitivgruppe</text>
		<text id="nl-inf" x="521" y="74" text-anchor="middle" font-size="13.5" font-weight="700">${esc(init.infinitive)}</text>
		<text id="nl-lat" x="320" y="134" text-anchor="middle" font-size="15" font-weight="700" class="svg-accent" lang="la">${esc(init.latin)}</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>Deutsch:</strong> <p>→ ${esc(init.german)}</p><p class="small">${esc(init.hint)}</p></div>`;
}

function renderModusLab(lesson: Lesson): string {
	if (lesson.diagram.preset === "relativ") {
		const init = relativKonjModel("final");
		return `<div class="diagram-controls" role="group" aria-label="Sinnrichtung im Relativsatz">
			<button type="button" class="button secondary" data-rel-sense="final" aria-pressed="true">Final (Zweck)</button>
			<button type="button" class="button secondary" data-rel-sense="kausal" aria-pressed="false">Kausal (Grund)</button>
			<button type="button" class="button secondary" data-rel-sense="konsekutiv" aria-pressed="false">Konsekutiv (Folge)</button>
			<button type="button" class="button secondary" data-rel-sense="konzessiv" aria-pressed="false">Konzessiv (obwohl)</button>
		</div>
		<svg class="diagram-svg" viewBox="0 0 640 165" role="img" aria-label="${esc(lesson.diagram.title)}">
			<rect x="24" y="24" width="276" height="58" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
			<text x="162" y="46" text-anchor="middle" font-size="11" class="svg-muted">Signal im Hauptsatz</text>
			<text id="rm-sig" x="162" y="66" text-anchor="middle" font-size="11.5" font-weight="700">${esc(init.signal)}</text>
			<path d="M306 53 H334 l-6 -4 m6 4 l-6 4" fill="none" stroke="var(--stage-color)" stroke-width="2.2" stroke-linecap="round"/>
			<rect x="340" y="24" width="276" height="58" rx="10" fill="var(--accent-soft)" stroke="var(--stage-color)" stroke-width="2"/>
			<text x="478" y="46" text-anchor="middle" font-size="11" class="svg-muted">Konjunktiv-Relativsatz</text>
			<text id="rm-title" x="478" y="66" text-anchor="middle" font-size="11.5" font-weight="700" class="svg-accent">${esc(init.title)}</text>
			<text id="rm-lat" x="320" y="122" text-anchor="middle" font-size="14" font-weight="700" font-style="italic">${esc(init.latin)}</text>
		</svg>
		<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(init.title)}</strong><p>→ ${esc(init.german)}</p><p class="small">${esc(init.hint)}</p></div>`;
	}
	const init = hauptsatzModusModel("deliberativ-pr");
	const moods: [HauptsatzModus8, string][] = [
		["deliberativ-pr", "Deliberativ (Gegenw.)"],
		["deliberativ-vg", "Deliberativ (Verg.)"],
		["potentialis", "Potentialis"],
		["vergleich-l7", "Vergleich Kl. 7 (ne vs. non)"],
	];
	return `<div class="diagram-controls" role="group" aria-label="Hauptsatzmodus">
		${moods
			.map(
				([k, label], i) =>
					`<button type="button" class="button secondary" data-m8-mood="${k}" aria-pressed="${i === 0}">${esc(label)}</button>`,
			)
			.join("")}
	</div>
	<svg class="diagram-svg" viewBox="0 0 640 165" role="img" aria-label="${esc(lesson.diagram.title)}">
		<rect x="24" y="24" width="320" height="58" rx="10" fill="var(--surface)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="184" y="46" text-anchor="middle" font-size="11" class="svg-muted">Tempus &amp; Modus</text>
		<text id="m8-form" x="184" y="66" text-anchor="middle" font-size="12" font-weight="700">${esc(init.form)}</text>
		<rect x="360" y="24" width="256" height="58" rx="10" fill="var(--accent-soft)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="488" y="46" text-anchor="middle" font-size="11" class="svg-muted">Verneinung</text>
		<text id="m8-neg" x="488" y="66" text-anchor="middle" font-size="14" font-weight="700" class="svg-accent">${esc(init.negation)}</text>
		<text id="m8-lat" x="320" y="124" text-anchor="middle" font-size="14" font-weight="700" font-style="italic">${esc(init.latin)}</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(init.title)}</strong><p>→ ${esc(init.german)}</p></div>`;
}

function getTimelineItems(lesson: Lesson): TimelinePhase[] {
	if (lesson.diagram.preset === "christentum") return CHRISTENTUM_PHASES;
	if (lesson.diagram.preset === "europa") return EUROPA_PHASES;
	return KAISERZEIT_PHASES;
}

function renderKaiserzeitTimeline(lesson: Lesson): string {
	const items = getTimelineItems(lesson);
	const first = items[0];
	return `<svg class="diagram-svg" viewBox="0 0 640 190" role="img" aria-label="${esc(lesson.diagram.title)}">
		<line x1="48" y1="98" x2="592" y2="98" stroke="var(--stage-color)" stroke-width="4" stroke-linecap="round"/>
		${items
			.map((item, i) => {
				const x = 88 + i * 155;
				const titleLines = wrapSvgText(item.title, 18);
				return `<g class="svg-node" data-kz-index="${i}" tabindex="0" role="button" aria-pressed="${i === 0}">
					<rect x="${x - 68}" y="22" width="136" height="58" rx="10" fill="var(--surface)" stroke="${i === 0 ? "var(--stage-color)" : "var(--line)"}" stroke-width="${i === 0 ? 3 : 1.5}"/>
					<text x="${x}" y="42" text-anchor="middle" font-size="11.5" font-weight="700">${titleLines.map((ln, li) => `<tspan x="${x}" dy="${li === 0 ? 0 : 14}">${esc(ln)}</tspan>`).join("")}</text>
					<text x="${x}" y="70" text-anchor="middle" font-size="10.5" class="svg-muted">${esc(item.badge)}</text>
					<circle cx="${x}" cy="98" r="9" class="svg-accent" stroke="var(--surface)" stroke-width="2.5"/>
				</g>`;
			})
			.join("")}
		<text x="320" y="156" text-anchor="middle" font-size="12" class="svg-muted">Klicke auf einen Abschnitt auf dem Zeitstrahl, um Details zu öffnen.</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(first.title)}</strong> · <span class="small">${esc(first.badge)}</span><p>${esc(first.detail)}</p></div>`;
}

function renderLimesMap(lesson: Lesson): string {
	const first = LIMES_PLACES[0];
	return `<div class="diagram-controls" role="group" aria-label="Kartenebenen Limes">
		<button type="button" class="button secondary" data-limes-layer="all" aria-pressed="true">Alle Orte</button>
		<button type="button" class="button secondary" data-limes-layer="kastelle" aria-pressed="false">Kastelle &amp; Limes</button>
		<button type="button" class="button secondary" data-limes-layer="handel" aria-pressed="false">Handel &amp; Fernstraßen</button>
	</div>
	<svg class="diagram-svg" viewBox="0 0 640 320" role="img" aria-label="${esc(lesson.diagram.title)}">
		<rect x="0" y="0" width="640" height="320" class="sea"/>
		<rect x="16" y="16" width="608" height="288" rx="12" class="land"/>
		<path d="M104 34 L104 72 L162 84 L208 112 L248 170 L320 156 L378 174 L596 174 V302 H18 V34 Z" class="province-zone"/>
		<path class="river" d="M98 28 Q106 86 122 124 T112 220 L92 292"/>
		<path class="river" d="M122 124 Q188 116 266 102"/>
		<path class="river" d="M148 228 Q232 210 318 184 T390 176 Q456 188 518 204 L604 224"/>
		<path class="limes-wall" d="M106 72 L162 84 L214 114 L248 170 L320 156 L378 174"/>
		<path class="trade-arrow" d="M294 238 L248 170 M294 238 L390 176 M162 84 L210 46"/>
		<text x="415" y="48" font-size="12" font-weight="700" class="svg-muted">Magna Germania (jenseits des Limes)</text>
		<text x="148" y="280" font-size="12" font-weight="700" class="svg-muted">Germania Superior</text>
		<text x="366" y="284" font-size="12" font-weight="700" class="svg-muted">Raetia</text>
		<text x="42" y="216" font-size="11" font-style="italic" class="svg-muted">Rhenus</text>
		<text x="536" y="246" font-size="11" font-style="italic" class="svg-muted">Danubius (Donau)</text>
		<text x="246" y="108" font-size="11" font-weight="700" class="svg-accent">Obergerm.-Raet. Limes</text>
		${LIMES_PLACES.map((p, i) => {
			const labelX = p.x + p.labelDx;
			const labelY = p.y + p.labelDy;
			return `<g class="svg-node" data-limes-id="${p.id}" data-limes-layers="${p.layers.join(",")}" tabindex="0" role="button" aria-pressed="${i === 0}">
				<circle cx="${p.x}" cy="${p.y}" r="12" fill="transparent"/>
				<circle cx="${p.x}" cy="${p.y}" r="6.5" class="svg-accent" stroke="var(--surface)" stroke-width="2"/>
				<text x="${labelX}" y="${labelY}" text-anchor="${p.labelAnchor}" font-size="11.5" font-weight="700">${esc(p.name)}</text>
			</g>`;
		}).join("")}
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(first.name)}</strong><p>${esc(first.info)}</p></div>`;
}

function renderRechtLab(lesson: Lesson): string {
	const initIdx =
		lesson.diagram.preset === "vergleich"
			? 1
			: lesson.diagram.preset === "fall"
				? 2
				: 0;
	const init = RECHT_CASES[initIdx];
	return `<div class="diagram-controls" role="group" aria-label="Römischer Rechtsgrundsatz">
		${RECHT_CASES.map(
			(item, i) =>
				`<button type="button" class="button secondary" data-recht-idx="${i}" aria-pressed="${i === initIdx}">${esc(item.maxim)}</button>`,
		).join("")}
	</div>
	<svg class="diagram-svg" viewBox="0 0 640 185" role="img" aria-label="${esc(lesson.diagram.title)}">
		<line x1="320" y1="30" x2="320" y2="122" stroke="var(--stage-color)" stroke-width="3.5" stroke-linecap="round"/>
		<line x1="150" y1="54" x2="490" y2="54" stroke="var(--stage-color)" stroke-width="3" stroke-linecap="round"/>
		<line x1="274" y1="122" x2="366" y2="122" stroke="var(--stage-color)" stroke-width="3.5" stroke-linecap="round"/>
		<circle cx="320" cy="30" r="6" class="svg-accent"/>
		<rect x="34" y="68" width="234" height="58" rx="10" fill="var(--surface)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="151" y="90" text-anchor="middle" font-size="11" class="svg-muted">Römische Grundlage</text>
		<text id="rl-maxim" x="151" y="112" text-anchor="middle" font-size="13.5" font-weight="700" font-style="italic">${esc(init.maxim)}</text>
		<rect x="372" y="68" width="234" height="58" rx="10" fill="var(--accent-soft)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="489" y="90" text-anchor="middle" font-size="11" class="svg-muted">Rechtsprinzip heute</text>
		<text id="rl-princ" x="489" y="112" text-anchor="middle" font-size="12" font-weight="700" class="svg-accent">${esc(init.shortPrinciple)}</text>
		<text id="rl-german" x="320" y="158" text-anchor="middle" font-size="14" font-weight="700">${esc(init.german)}</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(init.maxim)}</strong> · <span class="small">${esc(init.principle)}</span><p>${esc(init.romanOrigin)} → ${esc(init.modernCase)}</p></div>`;
}

function renderPhiloLab(lesson: Lesson): string {
	const initIdx =
		lesson.diagram.preset === "sokrates"
			? 1
			: lesson.diagram.preset === "schulen"
				? 2
				: lesson.diagram.preset === "rom"
					? 4
					: 0;
	const init = PHILO_SCHOOLS[initIdx];
	return `<svg class="diagram-svg" viewBox="0 0 640 198" role="img" aria-label="${esc(lesson.diagram.title)}">
		<line x1="60" y1="92" x2="580" y2="92" stroke="var(--line)" stroke-width="3" stroke-linecap="round"/>
		${PHILO_SCHOOLS.map((school, i) => {
			const x = 68 + i * 126;
			const active = i === initIdx;
			return `<g class="svg-node" data-philo-idx="${i}" tabindex="0" role="button" aria-pressed="${active}">
				<rect x="${x - 55}" y="26" width="110" height="52" rx="10" fill="${active ? "var(--accent-soft)" : "var(--surface)"}" stroke="${active ? "var(--stage-color)" : "var(--line)"}" stroke-width="${active ? 3 : 1.5}"/>
				<text x="${x}" y="48" text-anchor="middle" font-size="11.5" font-weight="700">${esc(school.name)}</text>
				<text x="${x}" y="66" text-anchor="middle" font-size="10" class="svg-muted">${esc(school.keyTerm.split(" ")[0])}</text>
				<circle cx="${x}" cy="92" r="8" class="svg-accent" stroke="var(--surface)" stroke-width="2"/>
			</g>`;
		}).join("")}
		<text id="pl-term" x="320" y="138" text-anchor="middle" font-size="14" font-weight="700" class="svg-accent">${esc(init.keyTerm)} (${esc(init.thinker)})</text>
		<text id="pl-question" x="320" y="164" text-anchor="middle" font-size="12" class="svg-muted">${esc(init.lifeQuestion)}</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(init.name)}</strong> · <span class="small">${esc(init.thinker)}</span><p>${esc(init.goal)}</p></div>`;
}

export function renderDiagram(lesson: Lesson): string {
	let body = "";
	switch (lesson.diagram.kind) {
		case "paenultima-lab":
			body = renderPaenultimaLab(lesson);
			break;
		case "verb-lab":
			body = renderVerbLab(lesson);
			break;
		case "gerundiv-lab":
			body = renderGerundivLab(lesson);
			break;
		case "nci-lab":
			body = renderNciLab(lesson);
			break;
		case "modus-lab":
			body = renderModusLab(lesson);
			break;
		case "kaiserzeit-timeline":
			body = renderKaiserzeitTimeline(lesson);
			break;
		case "limes-map":
			body = renderLimesMap(lesson);
			break;
		case "recht-lab":
			body = renderRechtLab(lesson);
			break;
		case "philo-lab":
			body = renderPhiloLab(lesson);
			break;
		case "myth-values":
			body = renderThreeNodeSvg(lesson, "myth");
			break;
		case "syntax-tree":
			body = renderThreeNodeSvg(lesson, "syntax");
			break;
		default:
			body = renderThreeNodeSvg(lesson, "morph");
			break;
	}
	return `<figure class="diagram-card">
		<div class="diagram-header"><h3>${esc(lesson.diagram.title)}</h3><span class="small">Interaktives Schaubild</span></div>
		${body}
		<figcaption class="diagram-caption">${esc(lesson.diagram.caption)}</figcaption>
	</figure>`;
}

export function bindDiagram(lesson: Lesson, container: HTMLElement): void {
	const detail = container.querySelector<HTMLElement>("#diagram-detail");
	if (!detail) return;

	// 1. Three-part interactive explorer
	const partNodes = container.querySelectorAll<SVGGElement>("[data-part-index]");
	if (partNodes.length) {
		const parts = defaultParts(lesson);
		const selectPart = (idx: number) => {
			partNodes.forEach((node, i) => {
				node.setAttribute("aria-pressed", String(i === idx));
				const rect = node.querySelector("rect");
				if (rect) {
					rect.setAttribute(
						"stroke",
						i === idx ? "var(--stage-color)" : "var(--line)",
					);
					rect.setAttribute("stroke-width", i === idx ? "3" : "1.5");
				}
			});
			const p = parts[idx];
			detail.innerHTML = `<strong>${esc(p.label)}</strong> · <span class="small">${esc(p.badge)}</span><p>${esc(p.detail)}</p>`;
		};
		partNodes.forEach((node) => {
			const idx = Number(node.dataset.partIndex);
			node.addEventListener("click", () => selectPart(idx));
			node.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectPart(idx);
				}
			});
		});
	}

	// 2. Paenultima word explorer
	const paenBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-paen-word]");
	if (paenBtns.length) {
		paenBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				const entry = paenultimaModel(btn.dataset.paenWord ?? "");
				paenBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				container.querySelector("#paen-svg")!.innerHTML =
					renderPaenultimaSvgBody(entry);
				detail.innerHTML = `<strong lang="la">${esc(entry.word)}</strong> · <span>${esc(entry.meaning)}</span><p>${esc(entry.paenultimaRule)}</p>`;
			}),
		);
	}

	// 3. Verb lab (Deponentien, Semideponentien, Perfektopraesentien, fieri)
	const verbBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-verb-kind]");
	if (verbBtns.length) {
		verbBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				const res = verbModel(btn.dataset.verbKind as VerbKind);
				verbBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				container.querySelector("#vl-pres")!.textContent = res.presentBox;
				container.querySelector("#vl-perf")!.textContent = res.perfectBox;
				container.querySelector("#vl-badge")!.textContent = res.ruleBadge;
				container.querySelector("#vl-label")!.textContent = res.label;
				detail.innerHTML = `<strong lang="la">${esc(res.latin)}</strong><p>→ ${esc(res.german)}</p><p class="small">${esc(res.hint)}</p>`;
			}),
		);
	}

	// 4. Gerundiv lab
	const gerModeBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-ger-mode]");
	const gerStyleBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-ger-style]");
	if (gerModeBtns.length && gerStyleBtns.length) {
		let mode: GerundivMode =
			lesson.diagram.preset === "attributiv" ||
			lesson.diagram.preset === "praedikativ" ||
			lesson.diagram.preset === "auctoris"
				? (lesson.diagram.preset as GerundivMode)
				: "gerund";
		let style: GerundivStyle = "passivisch";
		const updateGer = () => {
			const res = gerundivModel(mode, style);
			container.querySelector("#gl-left-label")!.textContent = res.leftLabel;
			container.querySelector("#gl-left-text")!.textContent = res.leftText;
			container.querySelector("#gl-right-label")!.textContent = res.rightLabel;
			container.querySelector("#gl-right-text")!.textContent = res.rightText;
			container.querySelector("#gl-rel")!.textContent = res.relationBadge;
			detail.innerHTML = `<strong lang="la">${esc(res.latin)}</strong><p>→ ${esc(res.german)}</p><p class="small">${esc(res.hint)}</p>`;
		};
		gerModeBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				mode = btn.dataset.gerMode as GerundivMode;
				gerModeBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				updateGer();
			}),
		);
		gerStyleBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				style = btn.dataset.gerStyle as GerundivStyle;
				gerStyleBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				updateGer();
			}),
		);
	}

	// 5. NcI lab
	const nciTrigBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-nci-trig]");
	const nciRelBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-nci-rel]");
	const nciStyleBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-nci-style]");
	if (nciTrigBtns.length && nciRelBtns.length && nciStyleBtns.length) {
		let trig: NciTrigger = "dicitur";
		let rel: NciRel = "gleichzeitig";
		let style: NciStyle =
			lesson.diagram.preset === "modal" ? "modal" : "unpersoenlich";
		const updateNci = () => {
			const res = nciModel(trig, rel, style);
			container.querySelector("#nl-subj")!.textContent = res.subjNom;
			container.querySelector("#nl-verb")!.textContent = res.verbPass;
			container.querySelector("#nl-inf")!.textContent = res.infinitive;
			container.querySelector("#nl-lat")!.textContent = res.latin;
			detail.innerHTML = `<strong>Deutsch:</strong> <p>→ ${esc(res.german)}</p><p class="small">${esc(res.hint)}</p>`;
		};
		nciTrigBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				trig = btn.dataset.nciTrig as NciTrigger;
				nciTrigBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				updateNci();
			}),
		);
		nciRelBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				rel = btn.dataset.nciRel as NciRel;
				nciRelBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				updateNci();
			}),
		);
		nciStyleBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				style = btn.dataset.nciStyle as NciStyle;
				nciStyleBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				updateNci();
			}),
		);
	}

	// 6. Modus lab (Deliberativ/Potentialis + Konjunktiv im Relativsatz)
	const m8Btns =
		container.querySelectorAll<HTMLButtonElement>("[data-m8-mood]");
	if (m8Btns.length) {
		m8Btns.forEach((btn) =>
			btn.addEventListener("click", () => {
				const res = hauptsatzModusModel(btn.dataset.m8Mood as HauptsatzModus8);
				m8Btns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				container.querySelector("#m8-form")!.textContent = res.form;
				container.querySelector("#m8-neg")!.textContent = res.negation;
				container.querySelector("#m8-lat")!.textContent = res.latin;
				detail.innerHTML = `<strong>${esc(res.title)}</strong><p>→ ${esc(res.german)}</p>`;
			}),
		);
	}
	const relBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-rel-sense]");
	if (relBtns.length) {
		relBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				const res = relativKonjModel(btn.dataset.relSense as RelativSense);
				relBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				container.querySelector("#rm-sig")!.textContent = res.signal;
				container.querySelector("#rm-title")!.textContent = res.title;
				container.querySelector("#rm-lat")!.textContent = res.latin;
				detail.innerHTML = `<strong>${esc(res.title)}</strong><p>→ ${esc(res.german)}</p><p class="small">${esc(res.hint)}</p>`;
			}),
		);
	}

	// 7. Kaiserzeit / Christentum / Europa timeline
	const kzNodes = container.querySelectorAll<SVGGElement>("[data-kz-index]");
	if (kzNodes.length) {
		const items = getTimelineItems(lesson);
		const selectKz = (idx: number) => {
			const item = items[idx];
			if (!item) return;
			kzNodes.forEach((node, i) => {
				node.setAttribute("aria-pressed", String(i === idx));
				const rect = node.querySelector("rect");
				if (rect) {
					rect.setAttribute(
						"stroke",
						i === idx ? "var(--stage-color)" : "var(--line)",
					);
					rect.setAttribute("stroke-width", i === idx ? "3" : "1.5");
				}
			});
			detail.innerHTML = `<strong>${esc(item.title)}</strong> · <span class="small">${esc(item.badge)}</span><p>${esc(item.detail)}</p>`;
		};
		kzNodes.forEach((node) => {
			const idx = Number(node.dataset.kzIndex);
			node.addEventListener("click", () => selectKz(idx));
			node.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectKz(idx);
				}
			});
		});
	}

	// 8. Limes map
	const limesLayerBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-limes-layer]");
	const limesPlaceNodes =
		container.querySelectorAll<SVGGElement>("[data-limes-id]");
	if (limesLayerBtns.length && limesPlaceNodes.length) {
		limesLayerBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				const layer = btn.dataset.limesLayer;
				limesLayerBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				limesPlaceNodes.forEach((node) => {
					const layers = (node.dataset.limesLayers ?? "").split(",");
					const show = layer === "all" || (layer ? layers.includes(layer) : false);
					node.style.opacity = show ? "1" : "0.22";
				});
			}),
		);
		const selectPlace = (id: string) => {
			const place = LIMES_PLACES.find((p) => p.id === id);
			if (!place) return;
			limesPlaceNodes.forEach((node) =>
				node.setAttribute("aria-pressed", String(node.dataset.limesId === id)),
			);
			detail.innerHTML = `<strong>${esc(place.name)}</strong><p>${esc(place.info)}</p>`;
		};
		limesPlaceNodes.forEach((node) => {
			const id = node.dataset.limesId ?? "";
			node.addEventListener("click", () => selectPlace(id));
			node.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectPlace(id);
				}
			});
		});
	}

	// 9. Recht lab (Waage der Iustitia)
	const rechtBtns =
		container.querySelectorAll<HTMLButtonElement>("[data-recht-idx]");
	if (rechtBtns.length) {
		rechtBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				const item = RECHT_CASES[Number(btn.dataset.rechtIdx)] ?? RECHT_CASES[0];
				rechtBtns.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				container.querySelector("#rl-maxim")!.textContent = item.maxim;
				container.querySelector("#rl-princ")!.textContent = item.shortPrinciple;
				container.querySelector("#rl-german")!.textContent = item.german;
				detail.innerHTML = `<strong>${esc(item.maxim)}</strong> · <span class="small">${esc(item.principle)}</span><p>${esc(item.romanOrigin)} → ${esc(item.modernCase)}</p>`;
			}),
		);
	}

	// 10. Philosophie compass
	const philoNodes =
		container.querySelectorAll<SVGGElement>("[data-philo-idx]");
	if (philoNodes.length) {
		const selectPhilo = (idx: number) => {
			const school = PHILO_SCHOOLS[idx];
			if (!school) return;
			philoNodes.forEach((node, i) => {
				node.setAttribute("aria-pressed", String(i === idx));
				const rect = node.querySelector("rect");
				if (rect) {
					rect.setAttribute(
						"fill",
						i === idx ? "var(--accent-soft)" : "var(--surface)",
					);
					rect.setAttribute(
						"stroke",
						i === idx ? "var(--stage-color)" : "var(--line)",
					);
					rect.setAttribute("stroke-width", i === idx ? "3" : "1.5");
				}
			});
			container.querySelector("#pl-term")!.textContent =
				`${school.keyTerm} (${school.thinker})`;
			container.querySelector("#pl-question")!.textContent = school.lifeQuestion;
			detail.innerHTML = `<strong>${esc(school.name)}</strong> · <span class="small">${esc(school.thinker)}</span><p>${esc(school.goal)}</p>`;
		};
		philoNodes.forEach((node) => {
			const idx = Number(node.dataset.philoIdx);
			node.addEventListener("click", () => selectPhilo(idx));
			node.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectPhilo(idx);
				}
			});
		});
	}
}
