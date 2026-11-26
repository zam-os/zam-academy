import type { Lesson } from "../types";

export const LESSONS_RESPUBLICA: Lesson[] = [
	{
		id: "l7-rom-karthago",
		stage: "respublica",
		title: "Rom und Karthago: Hannibal im 2. Punischen Krieg",
		skill: "Die mittlere Republik, den Konflikt mit Karthago (Hannibal, Scipio) und den historischen Epochenüberblick darstellen",
		lehrplan: "L7 LB 1 & 3 · Geschichte (Mittlere Republik)",
		bindings: ["1-geschichte", "3-geschichte", "3-epochen"],
		paragraphs: [
			"In der 6. Klasse hast du Königszeit (753–509 v. Chr.) und frühe Republik kennengelernt. In der mittleren Republik (ca. 264–133 v. Chr.) prallten zwei Großmächte im westlichen Mittelmeer aufeinander: die Landmacht Rom und die reiche phönizische Handels- und Seemacht Karthago (im heutigen Tunesien). Nachdem Rom im 1. Punischen Krieg Sizilien gewonnen hatte, führte im 2. Punischen Krieg (218–201 v. Chr.) der geniale karthagische Feldherr Hannibal sein Heer samt Kriegselefanten überraschend über die Alpen nach Italien.",
			"Hannibal fügte den Römern vernichtende Niederlagen zu, besonders 216 v. Chr. bei Cannae — doch Rom gab nicht auf, sondern hielt mit äußerster Standhaftigkeit (cōnstantia) durch. Selbst als Hannibal 211 v. Chr. während der Belagerung Capuas vor die Mauern Roms zog (was später den Schreckensruf ‚Hannibal ad portās!‘ prägte), blieb die Stadt uneingenommen. Schließlich trug der römische Feldherr Publius Cornelius Scipio (später ‚Africanus‘ genannt) den Krieg nach Afrika und besiegte Hannibal 202 v. Chr. in der Entscheidungsschlacht bei Zama. Karthago verlor seine Flotte und seine Macht; im 3. Punischen Krieg (146 v. Chr.) zerstörten die Römer die Stadt vollständig und richteten die Provinz Africa ein. Rom war nun unangefochtene Vormacht des Mittelmeers.",
		],
		diagram: {
			title: "Der 2. Punische Krieg in drei Wendepunkten",
			subtitle: "Verfolge, wie der Konflikt zwischen Rom und Karthago das Gleichgewicht im Mittelmeer kippte.",
			layout: "flow",
			parts: [
				{
					tag: "218 v. Chr.",
					title: "Hannibals Alpenübergang",
					formula: "Hispania → Alpēs → Italia",
					note: "Mit einem kühnen Marsch über die Alpen überraschte Hannibal die Römer von Norden her.",
				},
				{
					tag: "216 / 211 v. Chr.",
					title: "Cannae & Marsch vor Rom",
					formula: "216: Cannae · 211: ‚Hannibal ad portās!‘",
					note: "216 erlitt Rom bei Cannae seine schwerste Niederlage, verhandelte aber nicht; 211 v. Chr. (während der Belagerung Capuas) zog Hannibal kurz vor die Mauern Roms.",
				},
				{
					tag: "202 / 146 v. Chr.",
					title: "Zama & Zerstörung Karthagos",
					formula: "Scipio Africanus → prōvincia Africa",
					note: "Scipios Sieg bei Zama beendete den 2. Punischen Krieg; 146 v. Chr. wurde Karthago endgültig zerstört.",
				},
			],
		},
		material:
			"Hannibal exercitū per Alpēs trāductō Rōmānōs ad Cannās graviter vīcit. Paucīs annīs post, cum dux Poenōrum ante moenia urbis appāruisset, cīvēs perterritī clāmābant: ‚Hannibal ad portās!‘ Sed senātus cōnstantiā suā rem pūblicam servāvit; tandem Scīpiō Hannibale ad Zamam victō bellum fīnīvit.",
		materialLabel: "Übungstext · Vom Alpenübergang bis zur Schlacht bei Zama",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "In welcher Schlacht (202 v. Chr.) besiegte Scipio Africanus schließlich Hannibal und entschied den 2. Punischen Krieg?",
			answer: "In der Schlacht bei Zama (in Nordafrika).",
			wrong: [
				"In der Schlacht bei Cannae (216 v. Chr.).",
				"In der Schlacht bei Actium (31 v. Chr.).",
			],
			explanation: "Bei Cannae (216 v. Chr.) siegte Hannibal; bei Zama (202 v. Chr.) gewann Scipio Africanus den Krieg für Rom.",
		},
		takeaway:
			"Im 2. Punischen Krieg (218–201 v. Chr.) bedrohte Hannibal Rom nach dem Alpenübergang und Cannae existenziell; Scipios Sieg bei Zama (202) und die Zerstörung Karthagos (146) machten Rom zur Mittelmeergroßmacht.",
		practice: [
			{
				prompt: "Welches Gebirge überquerte Hannibal 218 v. Chr. auf seinem Zug nach Italien? (die ___): ___",
				answers: ["Alpen", "Alpēs"],
				feedback: "Der Alpenübergang mit Soldaten und Kriegselefanten machte Hannibal legendär.",
			},
			{
				prompt: "Wie heißt der römische Sieger von Zama mit seinem Ehrenbeinamen? (Scipio ___): ___",
				answers: ["Africanus", "Āfricānus"],
				feedback: "Publius Cornelius Scipio erhielt für seinen Sieg in Nordafrika den Beinamen Africanus.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und markiere beide Ablativi absoluti im Text.",
				model: "Nachdem Hannibal sein Heer über die Alpen geführt hatte (exercitū per Alpēs trāductō), besiegte er die Römer bei Cannae (216 v. Chr.) schwer. Wenige Jahre später (211 v. Chr.), als der Feldherr der Punier vor den Mauern der Stadt erschienen war, riefen die verängstigten Bürger: ‚Hannibal steht vor den Toren!‘ Aber der Senat rettete durch seine Standhaftigkeit den Staat; schließlich beendete Scipio den Krieg, nachdem er Hannibal bei Zama (202 v. Chr.) besiegt hatte (Hannibale ad Zamam victō).",
				criteria: [
					"Ich übersetze beide Ablativi absoluti (exercitū trāductō, Hannibale victō) vorzeitig und flüssig.",
					"Ich gebe den historischen Ausruf ‚Hannibal ad portās!‘ treffend wieder.",
					"Ich ordne den Ablauf historisch korrekt ein.",
				],
			},
			2: {
				language: "de",
				prompt: "Ordne die vier Epochen der römischen Geschichte bis 14 n. Chr. chronologisch (Königszeit, frühe Republik, mittlere/späte Republik, Augusteische Zeit) und begründe, warum der Sieg über Karthago ein Wendepunkt für Rom war.",
				model: "Reihenfolge: 1. Königszeit (753–509 v. Chr.), 2. Frühe Republik (509–264 v. Chr.), 3. Mittlere und späte Republik (264–27 v. Chr.), 4. Augusteische Zeit / Beginn der Kaiserzeit (27 v.–14 n. Chr.). Der Sieg über Karthago war ein Wendepunkt, weil Rom von einer italischen Mittelmacht zur beherrschenden Großmacht im gesamten Mittelmeerraum aufstieg — zugleich lösten die neuen Reichtümer und Kriege später die Krise der späten Republik aus.",
				criteria: [
					"Ich ordne alle vier Epochen mit passenden Eckdaten chronologisch richtig ein.",
					"Ich begründe die historische Tragweite des Siegs über Karthago.",
					"Ich stelle die Verbindung zur anschließenden späten Republik her.",
				],
			},
		},
		workshop: {
			kind: "history",
			liveModel: "epochs",
			goals: [
				{
					label: "Schlacht bei Cannae zuordnen",
					before: "216 v. Chr. erlitt Rom seine schwerste Niederlage gegen Hannibal bei →",
					after: "",
					options: ["Cannae", "Zama", "Alexandria"],
					answer: "Cannae",
					explanation: "Hannibal kesselte das römische Heer bei Cannae in Süditalien ein.",
				},
				{
					label: "Ende Karthagos datieren",
					before: "Im Jahr 146 v. Chr. wurde Karthago zerstört und es entstand die Provinz →",
					after: "",
					options: ["Africa", "Sicilia", "Raetia"],
					answer: "Africa",
					explanation: "Nach dem 3. Punischen Krieg (146 v. Chr.) richtete Rom die Provinz Africa ein.",
				},
				{
					label: "Bedeutung von ‚Hannibal ad portās!‘",
					before: "Die Wendung ‚Hannibal ante/ad portās!‘ drückt bis heute aus →",
					after: "",
					options: ["Eine große Gefahr steht unmittelbar bevor.", "Ein Friedensvertrag wurde unterzeichnet.", "Ein Triumphzug beginnt."],
					answer: "Eine große Gefahr steht unmittelbar bevor.",
					explanation: "Das geflügelte Wort geht auf den Schrecken der Römer im Jahr 211 v. Chr. zurück, als Hannibal während der Belagerung Capuas vor die Mauern Roms zog.",
				},
			],
		},
	},
	{
		id: "l7-spaete-republik",
		stage: "respublica",
		title: "Späte Republik, Bürgerkriege & Caesar · Cicero",
		skill: "Die Krise der späten Republik und die Doppelrolle von Caesar und Cicero als Politiker und Autoren erläutern",
		lehrplan: "L7 LB 1 & 3 · Geschichte & Persönlichkeiten",
		bindings: ["1-geschichte", "3-geschichte", "3-persoenlichkeiten"],
		paragraphs: [
			"Nach den großen Eroberungen geriet die römische Republik im 1. Jahrhundert v. Chr. in eine tiefe Krise (späte Republik, ca. 133–27 v. Chr.). Kleinbauern verarmten durch die langen Kriege, Land und Reichtum sammelten sich bei wenigen Großgrundbesitzern, und ehrgeizige Feldherren banden ihre Berufssoldaten persönlich an sich statt an den Senat. Politische Konflikte wurden immer öfter nicht mehr durch Gesetze, sondern mit Gewalt und in blutigen Bürgerkriegen (u. a. Marius gegen Sulla, Caesar gegen Pompeius) ausgetragen.",
			"Zwei überragende Persönlichkeiten prägten diese Zeit — und beide waren zugleich politische Handlungsträger und bedeutende lateinische Autoren: Marcus Tullius Cicero (106–43 v. Chr.) stieg als brillanter Redner bis zum Konsul (63 v. Chr.) auf, deckte die Catilinarische Verschwörung auf, verteidigte die Freiheit der Republik und schrieb Reden, Briefe und philosophische Werke. Gaius Iulius Caesar (100–44 v. Chr.) eroberte Gallien (58–51 v. Chr.), überschritt 49 v. Chr. mit den berühmten Worten ‚Ālea iacta est‘ (Der Würfel ist gefallen) den Grenzfluss Rubikon, gewann den Bürgerkrieg, wurde Diktator auf Lebenszeit und hielt seine Feldzüge als geschickter Schriftsteller im ‚Bellum Gallicum‘ fest. An den Iden des März (15. März 44 v. Chr.) wurde er von Verschwörern um Brutus im Senat ermordet — doch die Republik ließ sich nicht mehr retten.",
		],
		diagram: {
			title: "Späte Republik: Krise, Cicero & Caesar",
			subtitle: "Entdecke die Ursachen der Bürgerkriege und die gegensätzlichen Rollen von Cicero und Caesar.",
			layout: "contrast",
			parts: [
				{
					tag: "Krise",
					title: "Bürgerkriege statt Kompromiss",
					formula: "Heeresklientel · Machtkämpfe",
					note: "Soldaten waren auf die Versorgung durch ihren Feldherrn angewiesen — einzelne Generäle wurden mächtiger als der Senat.",
				},
				{
					tag: "Cicero (106–43)",
					title: "Redner, Konsul & Verteidiger",
					formula: "Macht des Wortes · rēs pūblica",
					note: "Als ‚homo novus‘ (erster Konsul seiner Familie) setzte Cicero auf Recht, Redekunst und die Erhaltung der Senatsrepublik.",
				},
				{
					tag: "Caesar (100–44)",
					title: "Feldherr, Diktator & Autor",
					formula: "Gallien · Rubikon (49) · Bellum Gallicum",
					note: "Vereinigte militärische Genialität mit klarer, wirkungsvoller Selbstdarstellung als Schriftsteller; ermordet am 15. März 44 v. Chr.",
				},
			],
		},
		material:
			"Cicerō ōrātiōnibus suīs lībertātem reī pūblicae dēfendēbat et cīvēs ad concordiam vocābat. Caesar autem, cum Galliam vīcisset et flūmen Rubicōnem trānsīsset, dīxit: ‚Ālea iacta est!‘ Post bellum cīvīle Caesar dictātor factus est, sed Idibus Mārtiīs necātus est.",
		materialLabel: "Übungstext · Cicero und Caesar in der späten Republik",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Wofür steht Caesars Überschreitung des Rubikon im Jahr 49 v. Chr. (‚Ālea iacta est‘)?",
			answer: "Für den unwiderruflichen Beginn des Bürgerkriegs gegen den Senat und Pompeius.",
			wrong: [
				"Für den Beginn des 2. Punischen Krieges gegen Hannibal.",
				"Für die Krönung des Augustus zum ersten Kaiser.",
			],
			explanation: "Kein Feldherr durfte mit bewaffneten Truppen die Grenze nach Italien überschreiten; mit dem Schritt über den Rubikon löste Caesar den Bürgerkrieg aus.",
		},
		takeaway:
			"In der späten Republik zerrissen Bürgerkriege den römischen Staat. Cicero (Redner, Konsul, Verteidiger der Republik) und Caesar (Eroberer Galliens, Diktator, Autor des ‚Bellum Gallicum‘) waren Politiker und bedeutende Schriftsteller zugleich.",
		practice: [
			{
				prompt: "Wie heißt das berühmte Werk Caesars über seine Feldzüge in Gallien? (zwei lateinische Wörter: Bellum ___): ___",
				answers: ["Bellum Gallicum", "Gallicum"],
				feedback: "In ‚De bello Gallico‘ (Bellum Gallicum) schilderte Caesar seine gallischen Feldzüge in der 3. Person.",
			},
			{
				prompt: "In welchem Jahr vor Christus wurde Caesar an den Iden des März ermordet? (nur die Zahl): ___",
				answers: ["44"],
				feedback: "Caesar wurde am 15. März (Iden des März) 44 v. Chr. im Senat ermordet.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und beschreibe die Doppelrolle von Cicero und Caesar als Politiker und Schriftsteller.",
				model: "Cicero verteidigte mit seinen Reden die Freiheit des Staates und rief die Bürger zur Eintracht auf. Caesar aber sagte, nachdem er Gallien besiegt und den Fluss Rubikon überschritten hatte: ‚Der Würfel ist gefallen!‘ Nach dem Bürgerkrieg wurde Caesar Diktator, aber an den Iden des März wurde er getötet. Beide wirkten doppelt: Cicero gestaltete Politik als Konsul und prägte mit Reden, Briefen und Philosophie die lateinische Prosa; Caesar veränderte Rom als Feldherr und Diktator und rechtfertigte sein Handeln im ‚Bellum Gallicum‘.",
				criteria: [
					"Ich übersetze den Text inkl. cum + Konj. Plusq. (vīcisset, trānsīsset) richtig.",
					"Ich stelle politische Rolle und schriftstellerische Leistung für beide Personen dar.",
					"Ich benenne den historischen Konflikt zwischen Republik und Alleinherrschaft.",
				],
			},
			2: {
				language: "de",
				prompt: "Warum führte die Ermordung Caesars am 15. März 44 v. Chr. nicht zur Rückkehr der alten Republik? Begründe deine Antwort historisch.",
				model: "Die Mörder um Brutus hatten keinen Plan für die Zeit nach Caesar, und die tiefen Ursachen der Krise (soziale Ungleichheit, Heeresklientel, Machtkämpfe) bestanden fort. Außerdem genoss Caesar bei Volk und Veteranen große Beliebtheit, sodass neue Bürgerkriege ausbrachen, aus denen schließlich sein Großneffe und Adoptivsohn Octavian (Augustus) als Alleinherrscher hervorging.",
				criteria: [
					"Ich benenne strukturelle Gründe für das Scheitern der Republik.",
					"Ich erkläre die Folgen nach 44 v. Chr. (neue Bürgerkriege, Aufstieg Octavians).",
					"Ich argumentiere zusammenhängend und historisch treffend.",
				],
			},
		},
		workshop: {
			kind: "history",
			goals: [
				{
					label: "Geflügeltes Wort Caesars deuten",
					before: "‚Ālea iacta est‘ (wörtlich: Der Würfel ist geworfen) meint →",
					after: "",
					options: ["Eine unumkehrbare Entscheidung ist gefallen.", "Ein Spiel hat noch gar nicht begonnen.", "Der Frieden ist gesichert."],
					answer: "Eine unumkehrbare Entscheidung ist gefallen.",
					explanation: "iacta est ist 3. Sg. Perfekt Passiv von iacere (werfen).",
				},
				{
					label: "Ciceros Rolle bestimmen",
					before: "Als Konsul des Jahres 63 v. Chr. setzte Cicero vor allem auf →",
					after: "",
					options: ["Redekunst, Gesetze und Senatsherrschaft", "eine lebenslange Diktatur", "die Abschaffung des Senats"],
					answer: "Redekunst, Gesetze und Senatsherrschaft",
					explanation: "Cicero war der bekannteste Verteidiger der republikanischen Ordnung.",
				},
				{
					label: "Autor und Werk verbinden",
					before: "Der Bericht über die Eroberung Galliens (‚Bellum Gallicum‘) stammt von →",
					after: "",
					options: ["Gaius Iulius Caesar", "Hannibal", "Horaz"],
					answer: "Gaius Iulius Caesar",
					explanation: "Caesar verfasste das ‚Bellum Gallicum‘ als Rechenschaftsbericht für die Öffentlichkeit in Rom.",
				},
			],
		},
	},
	{
		id: "l7-augustus",
		stage: "respublica",
		title: "Die Augusteische Zeit: pax Augusta & aurea aetas",
		skill: "Augustus’ Prinzipat, Restaurationspolitik, Horaz sowie das Verhältnis von Römern und Germanen erläutern",
		lehrplan: "L7 LB 1 & 3 · Augusteische Zeit & Römer und Germanen",
		bindings: ["1-geschichte", "3-geschichte", "3-persoenlichkeiten", "3-werte"],
		paragraphs: [
			"Nach dem Sieg über Marcus Antonius und Kleopatra bei Actium (31 v. Chr.) beendete Caesars Adoptivsohn Octavian das Jahrhundert der Bürgerkriege. 27 v. Chr. erhielt er vom Senat den Ehrentitel ‚Augustus‘ (der Erhabene). Geschickt vermied er das verhasste Wort ‚rēx‘ (König) und nannte sich ‚prīnceps‘ (erster Bürger): Äußerlich blieben Senat, Konsuln und Ämter bestehen, tatsächlich aber lag die höchste militärische und politische Macht in seiner Hand (Prinzipat). Sein Programm war die Restauration: Rückkehr zu alten römischen Werten, Erneuerung von Tempeln, Sitten und Religion — gepriesen als ‚pāx Augusta‘ (Augusteischer Friede) und ‚aurea aetās‘ (Goldenes Zeitalter).",
			"Bedeutende Dichter wie Vergil, Ovid und besonders Quintus Horatius Flaccus (Horaz, 65–8 v. Chr., Autor von ‚Carpe diem!‘ = Nutze den Tag!) machten die Augusteische Zeit zu einer literarischen Blütezeit — oft im Spannungsfeld zwischen Friedensdank und höfischer Propaganda. Außenpolitisch prägte das Verhältnis zwischen Römern und Germanen die Epoche: Schon Caesar hatte den Rhein als Grenze beschrieben; unter Augustus stießen römische Legionen weit nach Germanien vor, erlitten aber 9 n. Chr. in der Varusschlacht (im Teutoburger Wald gegen Arminius) eine vernichtende Niederlage. Danach sicherten Rhein und Donau (samt der neuen Provinz Raetia!) die Nordgrenze des Reiches.",
		],
		diagram: {
			title: "Die Augusteische Epoche im Überblick",
			subtitle: "Prinzipat, Kulturblüte und die Nordgrenze zwischen Römern und Germanen.",
			layout: "triptych",
			parts: [
				{
					tag: "Politik",
					title: "Prinzipat & Restauration",
					formula: "prīnceps · pāx Augusta (27 v.–14 n.)",
					note: "Augustus wahrte die republikanische Fassade, sicherte aber als Alleinherrscher inneren Frieden und erneuerte alte Sitten.",
				},
				{
					tag: "Kultur",
					title: "Aurea aetās & Horaz",
					formula: "Horaz · Vergil · Ovid · ‚Carpe diem!‘",
					note: "Bauprogramme (‚aus Ziegel wurde Marmor‘) und große Dichtung prägten das Bild eines Goldenen Zeitalters.",
				},
				{
					tag: "Nordgrenze",
					title: "Römer und Germanen",
					formula: "Caesar (Rhein) · Varusschlacht (9 n. Chr.)",
					note: "Nach der Niederlage des Varus gegen Arminius blieben Rhein und Donau (später der Limes) die Grenze.",
				},
			],
		},
		material:
			"Post bella cīvīlia Augustus pācem imperiō Rōmānō dedit, quam cīvēs ‚pācem Augustam‘ appellābant. Templa vetera restituit et mōrēs maiōrum laudāvit; poēta Horātius vītam pācātam celebrāvit. Ad Rhēnum autem et Dānuvium Rōmānī cum Germānīs pugnāvērunt.",
		materialLabel: "Übungstext · Friedensprogramm des Augustus und Nordgrenze",
		materialLanguage: "la",
		sourceIds: ["lp", "archbayern"],
		quiz: {
			optionLanguage: "de",
			question: "Warum nannte sich Augustus bewusst ‚prīnceps‘ (erster Bürger) statt ‚rēx‘ (König) oder ‚dictātor‘?",
			answer: "Um die republikanische Tradition nach außen zu wahren und Widerstand gegen offene Alleinherrschaft zu vermeiden.",
			wrong: [
				"Weil er überhaupt kein militärisches Kommando besaß.",
				"Weil der Senat alle Ämter der Republik abgeschafft hatte.",
			],
			explanation: "Nach Caesars Ermordung wusste Augustus, wie empfindlich Rom auf Königstitel reagierte; der Titel ‚prīnceps‘ verschleierte seine faktische Alleinherrschaft.",
		},
		takeaway:
			"Augustus (27 v.–14 n. Chr.) beendete die Bürgerkriege durch den Prinzipat, verband Friedensordnung (pāx Augusta) mit Sittenrestauration und Kulturblüte (Horaz, aurea aetās) und prägte nach 9 n. Chr. die Rhein-Donau-Grenze zu den Germanen.",
		practice: [
			{
				prompt: "Wie lautet der lateinische Begriff für das ‚Goldene Zeitalter‘, mit dem Dichter die Zeit des Augustus feierten? (zwei Wörter): ___",
				answers: ["aurea aetas", "aurea aetās"],
				feedback: "aurea aetās = das Goldene Zeitalter.",
			},
			{
				prompt: "Von welchem Dichter der Augusteischen Zeit stammt das weltberühmte Motto ‚Carpe diem‘? ___",
				answers: ["Horaz", "Horatius", "Horātius"],
				feedback: "Quintus Horatius Flaccus (Horaz) prägte ‚Carpe diem‘ (wörtlich: Pflücke den Tag!).",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und erkläre die beiden Schlüsselbegriffe ‚pāx Augusta‘ und ‚Restaurationspolitik‘.",
				model: "Nach den Bürgerkriegen gab Augustus dem Römischen Reich Frieden, den die Bürger ‚Augusteischen Frieden‘ nannten. Er stellte alte Tempel wieder her und lobte die Sitten der Vorfahren; der Dichter Horaz feierte das befriedete Leben. An Rhein und Donau aber kämpften die Römer mit den Germanen. ‚pāx Augusta‘ meint den inneren Frieden nach jahrzehntelangen Bürgerkriegen; ‚Restaurationspolitik‘ bezeichnet Augustus’ Versuch, alte Tempel, Religion, Ehegesetze und römische Werte neu zu beleben.",
				criteria: [
					"Ich übersetze alle drei Sätze genau ins Deutsche.",
					"Ich erkläre pāx Augusta im Kontrast zu den Bürgerkriegen.",
					"Ich benenne konkrete Merkmale der Augusteischen Restaurationspolitik.",
				],
			},
			2: {
				language: "de",
				prompt: "War die Zeit des Augustus wirklich eine ‚aurea aetās‘ (Goldenes Zeitalter)? Diskutiere Pro und Contra aus der Sicht eines einfachen römischen Bürgers und eines Senators.",
				model: "Für viele einfache Bürger bedeutete Augustus das ersehnte Ende von Bürgerkrieg, Hunger und Chaos sowie sichere Versorgung und prächtige Bauten (Pro). Aus Sicht vieler Senatoren dagegen ging die echte politische Freiheit der Republik verloren, weil alle wichtigen Entscheidungen beim Princeps lagen; zudem gingen die Kriege an den Außengrenzen (z. B. gegen die Germanen) weiter (Contra).",
				criteria: [
					"Ich stelle die Friedensleistung und Kulturblüte sachlich dar.",
					"Ich benenne den Verlust der republikanischen Freiheit und die Grenzkriege.",
					"Ich nehme abschließend begründet Stellung.",
				],
			},
		},
		workshop: {
			kind: "history",
			goals: [
				{
					label: "Bedeutung von ‚prīnceps‘ bestimmen",
					before: "Augustus’ Staatsform heißt Prinzipat nach dem Titel prīnceps →",
					after: "",
					options: ["erster Bürger", "alleiniger König", "Oberpriester der Provinz"],
					answer: "erster Bürger",
					explanation: "prīnceps (von prīmus + capere) bezeichnete den ersten, angesehensten Bürger im Senat.",
				},
				{
					label: "Römer und Germanen einordnen",
					before: "9 n. Chr. scheiterte Roms Eroberung Germaniens in der →",
					after: "",
					options: ["Varusschlacht", "Schlacht bei Zama", "Schlacht bei Cannae"],
					answer: "Varusschlacht",
					explanation: "Arminius vernichtete drei Legionen unter Publius Quinctilius Varus.",
				},
				{
					label: "Horaz’ bekanntes Motto übersetzen",
					before: "Horaz’ ‚Carpe diem‘ bedeutet wörtlich →",
					after: "",
					options: ["Pflücke (nutze) den Tag!", "Vergiss die Vergangenheit!", "Fürchte den morgigen Tag!"],
					answer: "Pflücke (nutze) den Tag!",
					explanation: "carpere heißt ‚pflücken, genießen‘ — nutze den heutigen Tag bewusst!",
				},
			],
		},
	},
	{
		id: "l7-politik-gesellschaft",
		stage: "respublica",
		title: "Politische Karriere (cursus honōrum) & Mischverfassung",
		skill: "Ämterlaufbahn (cursus honōrum), Klientelwesen und die römische ‚Mischverfassung‘ anschaulich erklären",
		lehrplan: "L7 LB 1 & 3 · Politik & Gesellschaft",
		bindings: ["1-politik", "3-politik"],
		paragraphs: [
			"Wer in der römischen Republik politisch aufsteigen wollte, durchlief eine streng geregelte Ämterlaufbahn — den ‚cursus honōrum‘ (wörtlich: Laufbahn der Ehrenämter, denn Politiker erhielten kein Gehalt!). Von unten nach oben führte der Weg über den Quästor (Finanzen, Eintritt in den Senat), optional den Ädil (Märkte, Straßen, öffentliche Spiele) und den Prätor (Rechtsprechung) bis zur Spitze: dem Konsul (Oberbefehl, Leitung von Senat und Staat). Zwei Schutzregeln sollten jede Alleinherrschaft verhindern: Annuität (Amtszeit von nur einem Jahr) und Kollegialität (jedes Amt war mindestens doppelt besetzt, mit gegenseitigem Vetorecht).",
			"Griechische Beobachter wie Polybios bewunderten dieses System als ‚Mischverfassung‘ aus drei Elementen: die beiden Konsuln (monarchisches Element), der Senat aus erfahrenen Ex-Beamten (aristokratisches Element) und die Volksversammlung samt Volkstribunen (demokratisches Element). In der gesellschaftlichen Wirklichkeit stützte das Klientelwesen die Macht vornehmer Familien: Ein wohlhabender ‚patrōnus‘ schützte seine ‚clientēs‘ (Klienten) vor Gericht und unterstützte sie materiell; im Gegenzug erschienen die Klienten morgens zur ‚salūtātiō‘ (Begrüßung), begleiteten ihn aufs Forum und wählten ihn bei den Ämterwahlen.",
		],
		diagram: {
			title: "Wie Macht in der Republik verteilt war",
			subtitle: "Ämterlaufbahn, Mischverfassung und Klientelwesen bildeten das politische Netz Roms.",
			layout: "hierarchy",
			parts: [
				{
					tag: "Cursus honōrum",
					title: "Quästor → Ädil → Prätor → Konsul",
					formula: "Annuität (1 Jahr) · Kollegialität (Veto)",
					note: "Nur wohlhabende Bürger konnten sich die unbezahlten Ehrenämter und aufwendigen Spiele leisten.",
				},
				{
					tag: "Mischverfassung",
					title: "Konsuln · Senat · Volk",
					formula: "S. P. Q. R. = Senat und Volk",
					note: "Drei Organe kontrollierten einander — faktisch besaß der Senat jedoch das größte politische Gewicht.",
				},
				{
					tag: "Klientelwesen",
					title: "Patrōnus ↔ Cliens (fidēs)",
					formula: "Schutz & Hilfe ↔ Gefolgschaft & Stimme",
					note: "Ein gegenseitiges Treueverhältnis (fidēs) ohne geschriebenen Vertrag, aber mit enormer sozialer Bindekraft.",
				},
			],
		},
		material:
			"Quī in rē pūblicā Rōmānā honōrēs petēbat, prīmum quaestor, deinde praetor, postrēmō cōnsul creārī cupiēbat. Duo cōnsulēs ūnum annum rem pūblicam regēbant, nē ūnus vir nimiam potestātem habēret. Patrōnī clientēs suōs dēfendēbant, clientēs patrōnōs honōrābant.",
		materialLabel: "Übungstext · Ämterlaufbahn und Klientelwesen in Rom",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche beiden Prinzipien sollten im ‚cursus honōrum‘ eine Alleinherrschaft verhindern?",
			answer: "Annuität (einjährige Amtszeit) und Kollegialität (mindestens zwei gleichberechtigte Amtsinhaber mit Vetorecht).",
			wrong: [
				"Lebenslange Erblichkeit und geheime Ernennung durch den König.",
				"Bezahlung der Beamten durch ausländische Provinzen.",
			],
			explanation: "Durch das einjährige Mandat (annus = Jahr) und das Vetorecht des Amtskollegen sollte kein Einzelner dauerhaft alle Macht an sich reißen.",
		},
		takeaway:
			"Der cursus honōrum (Quästor → Ädil → Prätor → Konsul) war unbezahlt und durch Annuität und Kollegialität begrenzt. Zusammen mit Senat, Volksversammlung (Mischverfassung) und Klientelwesen (patrōnus ↔ cliens) prägte er die Republik.",
		practice: [
			{
				prompt: "Wie heißt das Schutzprinzip der einjährigen Amtszeit im römischen Ämterwesen? (von lat. annus = Jahr): ___",
				answers: ["Annuität", "Annuitaet"],
				feedback: "Annuität (ein Jahr Amtszeit) verhinderte dauerhafte Machtkonzentration.",
			},
			{
				prompt: "Wie nennt man den mächtigen Beschützer im römischen Klientelwesen? ___",
				answers: ["Patron", "Patronus", "patrōnus"],
				feedback: "Der patrōnus schützte seine clientēs (Klienten) und erhielt im Gegenzug politische Gefolgschaft.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und erkläre die drei Elemente der römischen ‚Mischverfassung‘.",
				model: "Wer im römischen Staat Ehrenämter anstrebte, wünschte zuerst zum Quästor, dann zum Prätor, schließlich zum Konsul gewählt zu werden. Zwei Konsuln leiteten ein Jahr lang den Staat, damit nicht ein einzelner Mann zu große Macht hätte. Patrone verteidigten ihre Klienten, Klienten ehrten ihre Patrone. Die Mischverfassung vereinte das monarchische (zwei Konsuln), aristokratische (Senat) und demokratische Element (Volksversammlung).",
				criteria: [
					"Ich übersetze den Text inkl. Finalsatz ‚nē … habēret‘ und doppeltem Nominativ ‚cōnsul creārī‘ korrekt.",
					"Ich benenne alle drei Organe der Mischverfassung.",
					"Ich erkläre die Gegenseitigkeit des Klientelwesens.",
				],
			},
			2: {
				language: "de",
				prompt: "Warum war die römische Republik trotz Volksversammlung und ‚Mischverfassung‘ keine moderne Demokratie im heutigen Sinn? Nenne drei konkrete Gründe.",
				model: "1. Alle Ämter des cursus honōrum waren unbezahlt, sodass praktisch nur sehr reiche Familien antreten konnten. 2. Das Klientelwesen und das gewichtete Wahlrecht (nach Vermögensklassen) begünstigten vornehme Senatorenfamilien. 3. Frauen, Sklaven und Nichtbürger hatten kein Wahlrecht; zudem besaß der Senat faktisch das größte politische Gewicht.",
				criteria: [
					"Ich nenne mindestens drei historisch präzise Unterschiede zur heutigen Demokratie.",
					"Ich verknüpfe Ehrenamtsprinzip und Klientelwesen mit sozialer Macht.",
					"Ich urteile sachlich und differenziert.",
				],
			},
		},
		workshop: {
			kind: "history",
			liveModel: "cursus",
			goals: [
				{
					label: "Amt des Prätors zuordnen",
					before: "Für Rechtsprechung und Gerichte in Rom war zuständig der →",
					after: "",
					options: ["Prätor", "Quästor", "Ädil"],
					answer: "Prätor",
					explanation: "Der Prätor leitete das Gerichtswesen und vertrat die Konsuln.",
				},
				{
					label: "Kollegialitätsprinzip erkennen",
					before: "Jedes Jahr wurden an die Spitze der Republik gewählt →",
					after: "",
					options: ["zwei gleichberechtigte Konsuln", "ein Konsul auf Lebenszeit", "zwölf Quästoren als Oberbefehlshaber"],
					answer: "zwei gleichberechtigte Konsuln",
					explanation: "Zwei Konsuln kontrollierten sich gegenseitig (Kollegialität).",
				},
				{
					label: "Klientelwesen richtig beschreiben",
					before: "Das Verhältnis zwischen patrōnus und cliens beruhte auf gegenseitiger →",
					after: "",
					options: ["fidēs (Treue und Verlässlichkeit)", "Sklaverei ohne Rechte", "schriftlichen Steuerpflicht"],
					answer: "fidēs (Treue und Verlässlichkeit)",
					explanation: "Schutz durch den Patron und Loyalität durch den Klienten gründeten auf fidēs.",
				},
			],
		},
	},
	{
		id: "l7-militaer-werte",
		stage: "respublica",
		title: "Römisches Militär, Triumphzug & römische Werte",
		skill: "Grundzüge des römischen Militärwesens, die Bedeutung von Triumphzügen und zentrale Wertbegriffe (fides, virtus) erläutern",
		lehrplan: "L7 LB 1 & 3 · Militär & römische Werte",
		bindings: ["1-politik", "3-politik", "3-werte", "3-wertevergleich"],
		paragraphs: [
			"Die Stärke Roms ruhte auf einem hochorganisierten Heer: Eine Legion umfasste rund 5000 bis 6000 schwerbewaffnete Fußsoldaten (mit Schild scūtum, Wurfspeer pīlum und Kurzschwert gladius), gegliedert in Kohorten und Zenturien unter dem Kommando von Zenturionen. Am Ende jedes Marschtages bauten die Soldaten ein streng symmetrisches Marschlager (castra) mit Wall und Graben. Hatte ein Feldherr einen großen, blutigen Sieg für Rom errungen, konnte ihm der Senat die höchste militärische Ehre verleihen: den Triumphzug (triumphus). Auf einem vierspännigen Wagen zog der ‚triumphātor‘ im Purpurgewand durch Rom hinauf zum Kapitol, begleitet von Beute, Gefangenen und jubelnden Soldaten — hinter ihm flüsterte ein Sklave mahnend, er sei sterblich (‚mementō morī‘ / ‚respice post tē, hominem tē esse mementō!‘).",
			"Zusammengehalten wurden Militär, Politik und Gesellschaft durch den ‚mōs maiōrum‘ (die Sitte der Vorfahren) und feste römische Wertbegriffe: ‚virtūs‘ (von vir = Mann: Tapferkeit, Tüchtigkeit, moralische Stärke), ‚fidēs‘ (Treue, Zuverlässigkeit, Wort halten — sogar gegenüber Gegnern), ‚pietās‘ (Pflichtbewusstsein gegenüber Göttern, Eltern und Vaterland), ‚cōnstantia‘ (Standhaftigkeit) und ‚clēmentia‘ (Milde gegenüber Besiegten, wie sie Caesar und Augustus betonten). Gerade in der Augusteischen Restaurationspolitik wurden diese Werte gezielt auf Münzen, Denkmälern und in Dichtungen beschworen, um dem neuen Staat moralische Legitimität zu geben.",
		],
		diagram: {
			title: "Heer, Triumph und römischer Wertekompass",
			subtitle: "Wie Disziplin, öffentliche Ehre und Wertbegriffe das römische Selbstbild formten.",
			layout: "triptych",
			parts: [
				{
					tag: "Militär",
					title: "Legion & Lager (castra)",
					formula: "gladius · pīlum · scūtum · disciplīna",
					note: "Tägliches Schanzen, klare Befehlsstrukturen und eiserne Disziplin machten die Legionen weltweit gefürchtet.",
				},
				{
					tag: "Triumphzug",
					title: "Höchste Ehre & Mahnung",
					formula: "Forum → Kapitol · ‚Hominem tē esse mementō!‘",
					note: "Der Triumph feierte den Sieger, erinnerte ihn aber zugleich an seine Sterblichkeit — gegen Überheblichkeit (Hybris).",
				},
				{
					tag: "Römische Werte",
					title: "fidēs · virtūs · clēmentia",
					formula: "mōs maiōrum · Restaurationspolitik",
					note: "Werte wie Verlässlichkeit (fidēs) und Zivilcourage (virtūs) sind bis heute aktuell, wenn wir sie kritisch von Kriegsverherrlichung trennen.",
				},
			],
		},
		material:
			"Mīlitēs Rōmānī disciplīnā et virtūte multās gentēs vīcērunt. Imperātor, quī magnam victōriam reportāverat, triumphō ā senātū honōrābātur. Rōmānī autem nōn sōlum virtūtem in bellō, sed etiam fidem et clēmentiam laudābant.",
		materialLabel: "Übungstext · Militärische Disziplin, Triumph und Wertbegriffe",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Bedeutung hat der zentrale römische Wertbegriff ‚fidēs‘?",
			answer: "Treue, Verlässlichkeit, Vertrauen und das Einhalten gegebener Versprechen.",
			wrong: [
				"Reichtum an Gold und Ländereien.",
				"Rücksichtsloser Ehrgeiz im Bürgerkrieg.",
			],
			explanation: "fidēs war ein Fundament von Freundschaft, Klientelwesen, Verträgen und internationaler Politik in Rom.",
		},
		takeaway:
			"Disziplinierte Legionen und der feierliche Triumphzug (samt Mahnung zur Demut) prägten das römische Militär. Wertbegriffe wie virtūs (Tüchtigkeit/Tapferkeit), fidēs (Verlässlichkeit) und clēmentia (Milde) nutzte besonders Augustus zur Stärkung seines Staates.",
		practice: [
			{
				prompt: "Welches lateinische Substantiv bezeichnet ‚Tapferkeit / Tüchtigkeit‘ (abgeleitet von ‚vir‘)? ___",
				answers: ["virtus", "virtūs"],
				feedback: "virtūs, virtūtis f. bedeutet ursprünglich Mannhaftigkeit, Tapferkeit, Tüchtigkeit und moralische Stärke.",
			},
			{
				prompt: "Wie nennt man den feierlichen Siegeszug eines römischen Feldherrn hinauf zum Kapitol? ___",
				answers: ["Triumph", "Triumphzug", "triumphus"],
				feedback: "Der triumphus war die höchste militärische Ehrung, die der Senat verleihen konnte.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und erkläre die drei Wertbegriffe ‚virtūs‘, ‚fidēs‘ und ‚clēmentia‘ jeweils mit einem Beispiel.",
				model: "Die römischen Soldaten besiegten durch Disziplin und Tapferkeit viele Völker. Ein Feldherr, der einen großen Sieg davongetragen hatte, wurde vom Senat mit einem Triumphzug geehrt. Die Römer aber lobten nicht nur Tapferkeit im Krieg, sondern auch Verlässlichkeit (Treue) und Milde. Beispiele: virtūs = Mut und Standhaftigkeit in Gefahr; fidēs = ein Versprechen oder Bündnis zuverlässig einhalten; clēmentia = Besiegte schonen statt grausam zu bestrafen.",
				criteria: [
					"Ich übersetze alle drei Sätze (inkl. Plusquamperfekt reportāverat und Passiv honōrābātur) genau.",
					"Ich definiere virtūs, fidēs und clēmentia treffend.",
					"Ich belege jeden Wertbegriff mit einem passenden Beispiel.",
				],
			},
			2: {
				language: "de",
				prompt: "Deute den Brauch, dass beim Triumphzug ein Sklave hinter dem siegreichen Feldherrn stand und ihn an seine Sterblichkeit erinnerte. Warum war diese Mahnung für Rom politisch wichtig, und was sagt sie uns heute?",
				model: "Der Triumph hob einen einzelnen Feldherrn fast göttergleich aus der Bürgerschaft heraus. Die Mahnung des Sklaven sollte Überheblichkeit (Hybris) bremsen und daran erinnern, dass auch der größte Sieger nur ein sterblicher Mensch unter dem Gesetz der Republik bleibt. Heute erinnert das Motiv daran, dass Erfolg und Macht Kritikfähigkeit, Maßhalten und Demut brauchen.",
				criteria: [
					"Ich erkläre die Doppelwirkung des Triumphzugs (Ehre vs. Gefahr der Überhebung).",
					"Ich deute die Rolle des mahnenden Sklaven politisch und menschlich.",
					"Ich ziehe einen reflektierten Vergleich zu heute.",
				],
			},
		},
		workshop: {
			kind: "history",
			goals: [
				{
					label: "Waffen eines Legionärs erkennen",
					before: "Zur Grundausrüstung des römischen Legionärs gehörten scūtum, gladius und der Wurfspeer →",
					after: "",
					options: ["pīlum", "toga", "stilus"],
					answer: "pīlum",
					explanation: "Das pīlum war ein schwerer Wurfspeer, der feindliche Schilde unbrauchbar machen sollte.",
				},
				{
					label: "Milde gegenüber Besiegten benennen",
					before: "Der Wertbegriff für Schonung und Milde lautet im Lateinischen →",
					after: "",
					options: ["clēmentia", "superbia", "invidia"],
					answer: "clēmentia",
					explanation: "clēmentia (Milde) war ein berühmtes Leitwort von Caesar und Augustus.",
				},
				{
					label: "Zielpunkt des Triumphzugs kennen",
					before: "Der Triumphzug endete mit einem Opfer für Jupiter auf dem →",
					after: "",
					options: ["Kapitol", "Vesuv", "Rubikon"],
					answer: "Kapitol",
					explanation: "Auf dem Kapitol brachte der triumphātor Jupiter Optimus Maximus ein Dankopfer dar.",
				},
			],
		},
	},
];
