// Der verbindliche Grundwortschatz 3/4 (LehrplanPLUS Deutsch 3/4, 4.4), wie ihn
// das ISB nach Rechtschreibprinzipien ordnet. Quelle: Staatsinstitut für
// Schulqualität und Bildungsforschung München, „Grundwortschatz für die
// Jahrgangsstufen 3 und 4“. tests/grundwortschatz.test.ts vergleicht jede Gruppe
// wortgetreu mit tests/fixtures/official-grundwortschatz.json.
//
// Schreibweise in `source`:
//   Br{ie|i}f   richtig „Brief“, typischer Fehler „Brif“, Lückenwort „Br__f“
//   Bo·den      Trennstelle am Zeilenende
//   „, “ trennt Einträge, „ – “ die Formen eines Eintrags.

export type GroupId =
	| "silben"
	| "r"
	| "ie"
	| "doppel"
	| "tz"
	| "ck"
	| "h"
	| "verhaertung"
	| "umlaut"
	| "flexion"
	| "kombination"
	| "praeteritum"
	| "haeufig"
	| "sz"
	| "ch"
	| "v"
	| "y"
	| "ks"
	| "zz"
	| "dt"
	| "dehnung"
	| "doppelvokal"
	| "ae"
	| "i"
	| "ai";

export interface WordGroup {
	id: GroupId;
	/** Überschrift des ISB, kindgerecht nur dort gekürzt, wo sie es verlangt. */
	title: string;
	/** Tipp, wie das Kind die Schreibung findet. */
	rule: string;
	source: string;
}

export interface Word {
	word: string;
	group: GroupId;
	/** Typischer Fehler; fehlt bei Wörtern, die hier nur als Bezugsform stehen. */
	wrong?: string;
	/** Das Wort mit Unterstrichen an der schwierigen Stelle. */
	masked?: string;
	/** Trennstellen, z. B. Ge-schich-te; nur bei der Gruppe „silben“. */
	hyphenated?: string;
	/** Die erste Form desselben Eintrags ohne Schwierigkeit, z. B. „Berge“. */
	clue?: string;
}

export const WORD_GROUPS: WordGroup[] = [
	{
		id: "silben",
		title: "Wörter nach Schreibsilben trennen",
		rule: "Sprich das Wort deutlich und klatsche die Silben. ch und sch bleiben zusammen.",
		source:
			"Bo·den, Ding, et·was, Fin·ger, Fisch, Fla·sche, ge·gen, ge·hö·ren, ge·nau, ge·ra·de, Ge·schich·te, Ge·sicht, gleich, Hals, hel·fen, heu·te, la·chen, Licht, Loch, Luft, ma·chen, Mensch, Milch, Na·se, ne·ben, neu, oben, reich, rei·ten, Sa·che, schen·ken, schlecht, Sei·te, spre·chen, sprin·gen, Stein, tan·ken, Ta·sche, Wa·gen, wei·nen, Wo·che, Zei·tung",
	},
	{
		id: "r",
		title: "Wörter mit r nach einem Selbstlaut",
		rule: "Das r hörst du hier kaum. Sprich das Wort überdeutlich, dann merkst du: Da steht ein r.",
		source:
			"A{r|h}m, Do{r|h}f, do{r|h}t, Elt{er|a}n, E{r|h}de, e{r|h}st, ge{r|h}n, geste{r|h}n, ku{r|h}z, me{r|h}ken, mo{r|h}gen, schwe{r|h}, sofo{r|h}t, sta{r|h}k, Tü{r|h}, we{r|h}fen, Wu{r|h}st",
	},
	{
		id: "ie",
		title: "Wörter mit ie",
		rule: "Hörst du ein langes i, schreibst du meistens ie.",
		source:
			"Beisp{ie|i}l, Br{ie|i}f – Br{ie|i}fe, geschr{ie|i}ben, lesen – l{ie|i}st, n{ie|i} – n{ie|i}mals, r{ie|i}chen – r{ie|i}cht, sch{ie|i}ben – sch{ie|i}bt, schw{ie|i}rig, t{ie|i}f – t{ie|i}fer, T{ie|i}r – T{ie|i}re, verl{ie|i}ren, z{ie|i}hen – z{ie|i}ht, z{ie|i}len – z{ie|i}lt, Zw{ie|i}bel",
	},
	{
		id: "doppel",
		title: "Wörter mit doppeltem Mitlaut",
		rule: "Hörst du einen kurzen Selbstlaut, folgen oft zwei gleiche Mitlaute.",
		source:
			"du{mm|m}, e{ss|s}en, ko{mm|m}en, schli{mm|m}, schwi{mm|m}en, schne{ll|l}, ste{ll|l}en, verge{ss|s}en, Zi{mm|m}er, zusa{mm|m}en",
	},
	{
		id: "tz",
		title: "Wörter mit tz",
		rule: "Nach einem kurzen Selbstlaut schreibst du tz statt z.",
		source: "Pla{tz|z}, Pfü{tz|z}e, plö{tz|z}lich, schü{tz|z}en",
	},
	{
		id: "ck",
		title: "Wörter mit ck",
		rule: "Nach einem kurzen Selbstlaut schreibst du ck statt k.",
		source:
			"Glü{ck|k} – glü{ck|k}lich, Schre{ck|k} – erschre{ck|k}en, Stü{ck|k}, verste{ck|k}en, zurü{ck|k}",
	},
	{
		id: "h",
		title: "Wörter mit einem h zwischen den Silben",
		rule: "Sprich das Wort in zwei Silben: blü-hen. Das h trennt die Silben, auch in der kurzen Form: Kuh, Kü-he.",
		source:
			"blü{h|}en, dre{h|}en, ge{h|}en, Ku{h|} – Kü{h|}e, Schu{h|} – Schu{h|}e, se{h|}en, ste{h|}en, Ze{h|} – Ze{h|}en",
	},
	{
		id: "verhaertung",
		title: "Wörter, die du verlängerst",
		rule: "Am Wortende klingt d wie t, g wie k und b wie p. Verlängere das Wort, dann hörst du den richtigen Laut.",
		source:
			"Aben{d|t} – Abende – aben{d|t}s, Ber{g|k} – Berge, erlauben – erlau{b|p}t, frem{d|t} – fremder, Gel{d|t} – Gelder, lieben – lie{b|p}t, liegen – lie{g|k}t, run{d|t} – runder, steigen – stei{g|k}t, werden – wir{d|t}",
	},
	{
		id: "umlaut",
		title: "Wörter, die du ableitest",
		rule: "Suche ein verwandtes Wort mit a oder au: alt – älter, laufen – läuft.",
		source:
			"alt – {ä|e}lter, Ast – {Ä|E}ste, lang – l{ä|e}nger, laufen – l{äu|eu}ft, Nacht – N{ä|e}chte, Saft – S{ä|e}fte",
	},
	{
		id: "flexion",
		title: "Gebeugte Wörter im Satz",
		rule: "Lies den ganzen Satz. Frage nach: wem oder was? Die Endung hängt vom Satz ab.",
		source:
			"am – an, dein – deinem – deinen, dem – den, dies – diesem – diesen, ein – einem – einen, euer – eurem – euren, ganz – ganzem – ganzen, ihm – ihn – ihnen, ihr – ihre – ihrem – ihren, im – in, jede – jedem – jeden, kein – keinem – keinen, mein – meinem – meinen, mich – mir, sein – seinem – seinen, seit, uns – unserem – unseren, vom – von, welche – welchem – welchen, wem – wen, zu – zum – zur",
	},
	{
		id: "kombination",
		title: "Wörter, bei denen du Tricks verbindest",
		rule: "Leite von einem Wort mit a oder au ab: Hand – Hände, kaufen – Verkäufer.",
		source:
			"Arzt – {Ä|E}rzte, backen – B{ä|e}cker, Band – B{ä|e}nder, Hand – H{ä|e}nde, kaufen – Verk{äu|eu}fer, Land – L{ä|e}nder, lassen – l{ä|e}sst, Mann – M{ä|e}nner, Rad – R{ä|e}der, stark – st{ä|e}rker, Wald – W{ä|e}lder",
	},
	{
		id: "praeteritum",
		title: "Verben in der Vergangenheit",
		rule: "Diese Verben ändern im Präteritum ihren Selbstlaut. Achte darauf, ob er kurz oder lang klingt.",
		source:
			"bleiben – bl{ie|i}ben, essen – a{ß|ss}en, fallen – f{ie|i}len, geben – g{a|ah}ben, gehen – g{i|a}ngen, halten – h{ie|i}lten, heißen – hie{ß|ss}en, kommen – ka{m|mm}en, können – ko{nn|n}ten, lassen – lie{ß|s}en, laufen – l{ie|i}fen, lesen – liest – l{a|ah}sen, liegen – l{a|ah}gen, müssen – mu{ss|s}ten, rufen – r{ie|i}fen, scheinen – sch{ie|i}nen, schieben – sch{o|oh}ben, singen – s{a|u}ngen, sitzen – sa{ß|ss}en, schlafen – schl{ie|i}fen, schneiden – schni{tt|t}en, schreiben – schr{ie|i}ben, steigen – st{ie|i}gen, schwimmen – schwa{mm|m}en, tragen – tr{u|uh}gen, trinken – tr{a|u}nken, vergessen – verga{ß|ss}en, ziehen – z{o|oh}gen",
	},
	{
		id: "haeufig",
		title: "Wörter, die du sehr oft brauchst",
		rule: "Diese kleinen Wörter schreibst du so oft, dass du sie auswendig können solltest.",
		source:
			"a{b|p}, b{i|ie}n, b{i|ie}s, b{i|ie}st, da{nn|n}, h{ie|i}r, h{i|ie}n, i{mm|m}er, i{n|nn}s, m{a|ah}n, nich{t|} – n{ichts|ix}, n{ie|i}, n{u|uh}r, o{b|p}, o{f|ff}t, se{h|}r, vo{ll|l}, wa{nn|n}, wa{r|rr}um, weni{g|ch}, w{ie|i}, wied{er|a}, z{u|uh}, zule{tz|z}t, zusa{mm|m}en",
	},
	{
		id: "sz",
		title: "Wörter mit ß",
		rule: "Nach einem langen Selbstlaut oder ei, au, eu steht ß, wenn das s scharf klingt.",
		source: "au{ß|ss}er, drau{ß|ss}en, hei{ß|ss}en, Stra{ß|ss}e",
	},
	{
		id: "ch",
		title: "Wort mit Ch am Anfang",
		rule: "Dieses Wort merkst du dir. Du hörst ein k, schreibst aber Ch.",
		source: "{Ch|K}rist",
	},
	{
		id: "v",
		title: "Wörter mit v",
		rule: "Du hörst ein f, schreibst aber v. Merke dir diese Wörter.",
		source: "{v|f}ielleicht, {v|f}ier, {v|f}oll",
	},
	{
		id: "y",
		title: "Wort mit y",
		rule: "Dieses Wort kommt aus dem Englischen. Du hörst ein i, schreibst aber y.",
		source: "Hand{y|i}",
	},
	{
		id: "ks",
		title: "Wörter mit dem Laut ks",
		rule: "Der Laut ks hat verschiedene Schreibungen: chs, ks oder x. Merke dir jedes Wort.",
		source: "Fu{chs|ks}, lin{ks|x}, Ta{x|ks}i, Te{x|ks}t, se{chs|ks}",
	},
	{
		id: "zz",
		title: "Wörter mit zz",
		rule: "Hier steht ausnahmsweise zz statt tz. Merke dir beide Wörter.",
		source: "Pi{zz|z}a, Ski{zz|z}e",
	},
	{
		id: "dt",
		title: "Wörter mit dt",
		rule: "Hier schreibst du dt, obwohl du nur ein t hörst.",
		source: "Sta{dt|t}, verwan{dt|t}",
	},
	{
		id: "dehnung",
		title: "Wörter mit Dehnungs-h",
		rule: "Das h macht den Selbstlaut davor lang. Du hörst es nicht, darum merkst du dir das Wort.",
		source: "erzä{h|}len, fa{h|}ren, wa{h|a}r, ze{h|}n",
	},
	{
		id: "doppelvokal",
		title: "Wörter mit doppeltem Selbstlaut",
		rule: "Der Selbstlaut klingt lang und steht doppelt da. Merke dir diese Wörter.",
		source: "H{aa|a}r, M{ee|e}r, Schn{ee|e}, S{ee|e}",
	},
	{
		id: "ae",
		title: "Wörter mit ä ohne verwandtes Wort",
		rule: "Es gibt kein verwandtes Wort mit a. Merke dir das ä.",
		source: "K{ä|e}fer, K{ä|e}fig, M{ä|e}rchen",
	},
	{
		id: "i",
		title: "Wörter mit i statt ie",
		rule: "Das i klingt lang, trotzdem steht kein ie. Merke dir diese Wörter.",
		source: "T{i|ie}ger, Masch{i|ie}ne, Fam{i|ie}lie",
	},
	{
		id: "ai",
		title: "Wort mit ai",
		rule: "Der Brotlaib schreibt sich mit ai. Merke dir dieses Wort.",
		source: "L{ai|ei}b",
	},
];

const NOTATION = /\{([^|}]*)\|([^}]*)\}/g;

/** Der Text der Gruppe ohne Schreibhilfen, so wie ihn das ISB druckt. */
export const plainSource = (source: string): string =>
	source.replace(NOTATION, "$1").replaceAll("·", "");

/** Ein Wort in der Schreibweise oben in seine Formen auflösen. */
function parseWord(raw: string, group: GroupId): Word {
	const word = raw.replace(NOTATION, "$1").replaceAll("·", "");
	const parsed: Word = { word, group };
	if (raw.includes("·")) parsed.hyphenated = raw.replaceAll("·", "-");
	if (raw.includes("{")) {
		parsed.wrong = raw.replace(NOTATION, "$2");
		parsed.masked = raw.replace(NOTATION, (_, right: string) =>
			"_".repeat([...right].length),
		);
	}
	return parsed;
}

const parseEntry = (entry: string, group: GroupId): Word[] => {
	const forms = entry.split(" – ").map((raw) => parseWord(raw, group));
	const clue = forms.find((form) => !form.wrong)?.word;
	return clue
		? forms.map((form) => (form.wrong ? { ...form, clue } : form))
		: forms;
};

export const wordsOfGroup = (group: WordGroup): Word[] =>
	group.source.split(", ").flatMap((entry) => parseEntry(entry, group.id));

/** Alle Wörter der genannten Gruppen. */
export const wordsIn = (ids: readonly GroupId[]): Word[] =>
	WORD_GROUPS.filter((group) => ids.includes(group.id)).flatMap(wordsOfGroup);

/** Wörter der Gruppen, zu denen es eine typische Falschschreibung gibt. */
export const spellable = (ids: readonly GroupId[]): (Word & {
	wrong: string;
	masked: string;
})[] =>
	wordsIn(ids).filter(
		(word): word is Word & { wrong: string; masked: string } =>
			word.wrong !== undefined && word.masked !== undefined,
	);

export const groupOf = (id: GroupId): WordGroup => {
	const group = WORD_GROUPS.find((g) => g.id === id);
	if (!group) throw new Error(`Unbekannte Wortgruppe ${id}`);
	return group;
};

/** Für die Wortliste in der Lektion: Überschrift und Wörter wie beim ISB. */
export const wordbook = (ids: readonly GroupId[]) =>
	ids.map((id) => {
		const group = groupOf(id);
		return { title: group.title, words: plainSource(group.source) };
	});

export const SOURCE_NOTE =
	"Wörter: Grundwortschatz für die Jahrgangsstufen 3 und 4, Staatsinstitut für Schulqualität und Bildungsforschung München (ISB).";
