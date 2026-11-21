import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Lernbereich 5: Das frühneuzeitliche Europa zwischen konfessioneller Auseinandersetzung und absolutistischem Herrschaftsanspruch. */
export const absolutism: Lesson[] = [
  {
    id: "g7-dreissigjaehriger-krieg",
    lb: 5,
    title: "1618–1648: Der Dreißigjährige Krieg und Bayern",
    period: "Frühe Neuzeit · 1618 bis 1648",
    span: [1618, 1648],
    intro:
      "Ein Streit um Glaubensrechte in Prag löste einen dreißigjährigen Flächenbrand aus, der ganze Landstriche in Mitteleuropa und Bayern verwüstete.",
    paragraphs: [
      "Der Augsburger Religionsfriede von 1555 hatte den Konflikt nur vertagt: Reformierte blieben ausgeschlossen, und über Kirchengüter stritten Katholiken und Protestanten immer erbitterter. Evangelische und katholische Reichsstände schlossen getrennte Militärbündnisse – die protestantische Union (1608, unter Führung des pfälzischen Kurfürsten) und die katholische Liga (1609, unter Führung des bayerischen Herzogs Maximilian I.). Als böhmische Protestanten 1618 kaiserliche Gesandte aus einem Fenster der Prager Burg warfen (Prager Fenstersturz), eskalierte die Lage zum Krieg.",
      "Was als konfessioneller Aufstand begann, weitete sich bald zu einem europäischen Machtkampf aus. Erst griff Dänemark ein, dann kämpften Schweden unter König Gustav Adolf und schließlich sogar das katholische Frankreich an der Seite der Protestanten gegen die Habsburger. Es ging längst nicht mehr nur um Religion, sondern um Vormacht in Europa und die Rechte der Reichsfürsten gegenüber dem Kaiser.",
      "Die Bevölkerung trug die furchtbarste Last der frühneuzeitlichen Kriegsführung. Söldnerheere lebten oft nach dem Grundsatz „Der Krieg ernährt den Krieg“, plünderten Dörfer, pressten Städte aus und schleppten Hunger und Pest ein. Auch Bayern und Franken wurden ab 1632 schwer getroffen: Schwedische wie kaiserliche Truppen verwüsteten Orte etwa um Landsberg, Landshut, Ingolstadt oder Nürnberg; mancherorts überlebte nur ein Drittel oder die Hälfte der Menschen.",
    ],
    takeaway:
      "Der Dreißigjährige Krieg (1618–1648) verband Konfessionsstreit mit europäischer Machtpolitik und verwüstete ganze Regionen einschließlich Bayerns schwer.",
    sourceIds: ["lehrplan", "pw-dreissigj", "hdbg"],
    quiz: check(
      "Warum griff das katholische Frankreich ab 1635 auf Seiten protestantischer Mächte in den Dreißigjährigen Krieg ein?",
      "Frankreich wollte eine Übermacht des Hauses Habsburg verhindern.",
      [
        "Weil der französische König selbst zum lutherischen Glauben übergetreten war.",
        "Weil Schweden Frankreich dafür das gesamte Rheinland als Geschenk versprochen hatte.",
      ],
      [
        "Frankreich blieb katholisch; das Beispiel beweist gerade, dass Machtpolitik wichtiger wurde als Konfession.",
        "Frankreich strebte Sicherheitsgewinne im Westen an, erhielt das Rheinland aber nicht von Schweden geschenkt.",
      ],
      "Spätestens mit dem Eingreifen Frankreichs wurde der Konflikt offen zu einem europäischen Machtkampf gegen habsburgische Vorherrschaft.",
    ),
    workshop: timeline(
      [
        [
          "1618 n. Chr.: Nach dem Prager Fenstersturz brechen offene Kämpfe in Böhmen und im Reich aus.",
          "Ein Streit um Glaubens- und Ständerechte löst den großen Krieg aus.",
        ],
        [
          "1620 n. Chr.: Truppen des Kaisers und der katholischen Liga unter Maximilian I. siegen in der Schlacht am Weißen Berg bei Prag.",
          "Der Sieg beendet den böhmischen Aufstand; 1623 erhält Herzog Maximilian I. von Bayern dafür förmlich die pfälzische Kurwürde (1628 auch die Oberpfalz).",
        ],
        [
          "1632 n. Chr.: Schwedens König Gustav Adolf stößt nach Süddeutschland vor und besetzt München.",
          "Bayern erlebt verheerende Plünderungen, Kontributionen und Seuchenzüge.",
        ],
        [
          "1648 n. Chr.: Nach 30 Jahren Erschöpfung endet der Krieg in Münster und Osnabrück.",
          "Etwa ein Drittel der Bevölkerung des Reiches hat den Krieg nicht überlebt.",
        ],
      ],
      "In drei Jahrzehnten wandelte sich ein Konfessionsstreit im Reich zum verheerenden Machtkrieg europäischer Staaten.",
    ),
    tasks: {
      1: writing(
        "Nenne zwei Ursachen für den Ausbruch des Dreißigjährigen Krieges 1618 und erkläre, warum er sich von einem Glaubenskrieg zu einem europäischen Machtkrieg entwickelte.",
        [
          "Denke an die Lücken im Augsburger Religionsfrieden und an Union/Liga.",
          "Erwähne das Eingreifen ausländischer Mächte wie Schweden und Frankreich.",
        ],
        "Ursachen waren die ungelösten Streitfragen seit 1555 – etwa der Ausschluss der Reformierten und Streit um Kirchengüter – sowie die Bildung bewaffneter Bündnisse: der protestantischen Union unter Kurpfalz und der katholischen Liga unter Herzog Maximilian I. von Bayern. Nach dem Prager Fenstersturz 1618 griffen Nachbarmächte wie Dänemark, Schweden und das katholische Frankreich ein, um die Vorherrschaft des Kaisers zu brechen. So wurden Machtinteressen wichtiger als die Religion.",
        [
          "Zwei Kriegsursachen genannt",
          "Eingreifen europäischer Mächte erklärt",
          "Wandel vom Religions- zum Machtkrieg benannt",
        ],
      ),
      2: writing(
        "Beurteile die Folgen der frühneuzeitlichen Kriegsführung für die Zivilbevölkerung am Beispiel Bayerns oder einer Region Süddeutschlands.",
        [
          "Erkläre, wie Söldnerheere verpflegt wurden und welche Seuchen oder Zerstörungen folgten.",
          "Beziehe ein konkretes bayerisches oder fränkisches Beispiel mit ein.",
        ],
        "Söldnerheere erhielten oft unregelmäßig Sold und ernährten sich durch Erpressung und Plünderung in den durchzogenen Gebieten. Nach dem Einfall schwedischer und auch beim Durchzug kaiserlicher Truppen ab 1632 erlitten Städte und Dörfer in Bayern und Franken wie um Landshut, Landsberg oder Nürnberg schwerste Zerstörungen, Hunger und Pestwellen. Viele Regionen brauchten Jahrzehnte, um sich von dem Bevölkerungsverlust zu erholen.",
        [
          "Verhalten der Söldnerheere erklärt",
          "Folgen wie Hunger, Pest und Verwüstung benannt",
          "Landesgeschichtlichen Bezug zu Bayern hergestellt",
        ],
      ),
    },
  },
  {
    id: "g7-westfaelischer-friede",
    lb: 5,
    title: "Der Westfälische Friede 1648 und Wege zum Frieden",
    period: "Frühe Neuzeit · 1648",
    span: [1643, 1660],
    intro:
      "Fünf Jahre lang verhandelten Gesandte aus fast ganz Europa in Münster und Osnabrück – und beendeten 1648 nicht mit einem Sieg einer Seite, sondern mit einem großen Kompromiss.",
    paragraphs: [
      "Da keine Kriegspartei den vollständigen Sieg erringen konnte und Länder ausgeblutet waren, begannen ab 1643 lange Friedensverhandlungen in den westfälischen Städten Münster (katholische Gesandte) und Osnabrück (protestantische Gesandte). Am 24. Oktober 1648 unterzeichneten Kaiser, Reichsstände, Frankreich und Schweden den Westfälischen Frieden – den ersten großen europäischen Friedenskongress.",
      "Der Vertrag ordnete sowohl die Religion als auch die Politik neu. Er bestätigte den Augsburger Religionsfrieden und nahm erstmals auch die Reformierten (Calvinisten) mit auf; Fürsten mussten Untertanen mit anderem Bekenntnis nun zumindest in der privaten Ausübung dulden. Politisch erhielten die deutschen Reichsstände fast volle Landeshoheit einschließlich eigener Bündnisrechte, Frankreich erhielt Gebiete im Elsass, Schweden Gebiete an Nord- und Ostsee, und die Schweiz sowie die Niederlande schieden endgültig aus dem Reich aus.",
      "So entstand das moderne europäische Staatensystem aus gleichberechtigten souveränen Staaten, die ihre Interessen vertraglich regeln. Der Rückblick auf 1648 macht deutlich, wie wertvoll Verhandlungen statt Endloskriege sind: Auch bei schärfsten politischen und religiösen Gegensätzen führt nur der geduldige Kompromiss zu dauerhaftem Frieden – eine Grunderfahrung, die auch für Konflikte unserer Gegenwart gilt.",
    ],
    takeaway:
      "Der Westfälische Friede 1648 schuf nach langen Verhandlungen eine konfessionelle Ausgleichsordnung und begründete ein System gleichberechtigter europäischer Staaten.",
    sourceIds: ["lehrplan", "pw-dreissigj", "hdbg"],
    quiz: check(
      "Welche drei wichtigen Regelungen enthielt der Westfälische Friede von 1648?",
      "Anerkennung der Reformierten, starke Landeshoheit der Reichsstände sowie Gebiete für Frankreich und Schweden.",
      [
        "Alleinherrschaft des Kaisers über Europa und Verbot jeder protestantischen Kirche.",
        "Auflösung aller deutschen Fürstentümer zugunsten eines zentralen Wahlparlaments in Berlin.",
      ],
      [
        "Die Macht des Kaisers über das Reich wurde 1648 im Gegenteil stark begrenzt, und drei Konfessionen galten als reichsrechtlich anerkannt.",
        "Das Reich blieb als Verband eigenständiger Fürstentümer und Reichsstädte noch bis 1806 bestehen.",
      ],
      "Verhandlungslösung statt Vernichtungssieg legte 1648 die Grundlage für das Prinzip souveräner Staaten in Europa.",
    ),
    diagram: {
      kind: "steps",
      title: "Was der Westfälische Friede 1648 neu ordnete",
      steps: [
        { label: "Konfessionen", note: "Katholiken, Lutheraner und Reformierte gleichberechtigt anerkannt" },
        { label: "Reichsverfassung", note: "Reichsstände erhalten Landeshoheit; Kaiser braucht Zustimmung" },
        { label: "Europa", note: "Souveräne Staaten lösen Streit über Diplomatie und Kongresse" },
      ],
      repeats: false,
      caption:
        "Erstmals zeigten Staaten Europas auf einem allgemeinen Kongress, dass Verträge selbst erbitterte Glaubenskriege beenden können.",
    },
    workshop: classify(
      "Bestimmungen des Westfälischen Friedens 1648",
      ["Religiöse Regelung", "Politische & territoriale Regelung", "Bedeutung für Europa heute"],
      [
        [
          "Neben Katholiken und Lutheranern erhalten nun auch Reformierte (Calvinisten) volle Anerkennung im Reich.",
          0,
          "Eine zentrale Lücke von 1555 wurde damit geschlossen.",
        ],
        [
          "Die Niederlande und die Schweiz werden völkerrechtlich als selbstständige Staaten anerkannt.",
          1,
          "Auf Geschichtskarten nach 1648 liegen beide Gebiete außerhalb der Reichsgrenze.",
        ],
        [
          "Reichsstände dürfen Verträge und Bündnisse schließen, sofern sie sich nicht gegen Kaiser und Reich richten.",
          1,
          "Bayern, Brandenburg oder Sachsen handelten nun fast wie eigenständige Staaten.",
        ],
        [
          "Untertanen eines anderen Bekenntnisses behalten das Recht auf häusliche Andacht und geordnete Auswanderung.",
          0,
          "Erste Schritte zu religiöser Duldung ersetzten den strengen Bekenntniszwang.",
        ],
        [
          "Diplomatie auf Friedenskongressen ersetzt die Idee eines einzigen alles entscheidenden Schlachtfeldsiegs.",
          2,
          "Verhandelte Kompromisse unter Achtung der Verhandlungspartner bleiben Vorbild für heutige Friedenssuche.",
        ],
      ],
      "1648 lehrt, dass Kompromisse nach verheerenden Kriegen zwar mühsam sind, aber allein Sicherheit schaffen.",
    ),
    tasks: {
      1: writing(
        "Fasse die wichtigsten religiösen und politischen Ergebnisse des Westfälischen Friedens 1648 zusammen.",
        [
          "Nenne die drei anerkannten christlichen Bekenntnisse.",
          "Beschreibe, wie sich die Macht von Kaiser, Reichsständen und Nachbarstaaten veränderte.",
        ],
        "Religiös bestätigte der Westfälische Friede 1648 den Augsburger Religionsfrieden, nahm aber die Reformierten als drittes Bekenntnis auf und verbesserte die Duldung Andersgläubiger. Politisch gewannen die Reichsstände weitgehende Landeshoheit, der Kaiser verlor an Zentralmacht, die Schweiz und die Niederlande wurden unabhängig, und Frankreich sowie Schweden erhielten Reichsgebiete.",
        [
          "Religiöse Neuerungen korrekt genannt",
          "Machtverschiebung zugunsten der Reichsstände genannt",
          "Territoriale Veränderungen erwähnt",
        ],
      ),
      2: writing(
        "Bewerte anhand von 1648, warum friedliche Verhandlungslösungen bei politischen oder religiösen Konflikten auch heute so wichtig sind.",
        [
          "Verweise auf den hohen Preis von 30 Jahren Krieg, bis schließlich doch verhandelt werden musste.",
          "Zeige, welche Haltung für Kompromisse nötig ist.",
        ],
        "Dreißig Jahre Krieg zeigten 1648, dass militärische Gewalt keine religiösen Überzeugungen beseitigen kann, sondern vor allem Zerstörung und Leid unter der Zivilbevölkerung hinterlässt. Erst das Akzeptieren verschiedener Bekenntnisse und das Aushandeln verbindlicher Verträge brachten Sicherheit. Deshalb bleibt es auch bei heutigen politischen oder religiösen Konflikten entscheidend, rechtzeitig auf Diplomatie, Rechtsregeln und Kompromisse zu setzen.",
        [
          "Lehre aus den Kriegskosten von 1618–1648 gezogen",
          "Wert von Verträgen und Duldung erklärt",
          "Übertrag auf die Gegenwart geleistet",
        ],
      ),
    },
  },
  {
    id: "g7-absolutismus-frankreich",
    lb: 5,
    title: "Absolutismus in Frankreich: Staat unter Ludwig XIV.",
    period: "Frühe Neuzeit · 17./18. Jahrhundert",
    span: [1643, 1789],
    intro:
      "Im 17. und 18. Jahrhundert beanspruchte König Ludwig XIV. von Frankreich die ungeteilte Macht – und schuf dabei zugleich Strukturen eines modernen Staates.",
    paragraphs: [
      "Nach den Schrecken der Religionskriege und Adelsaufstände baute König Ludwig XIV. (1643–1715) in Frankreich den Absolutismus aus. Der Begriff stammt vom lateinischen „absolutus“ (losgelöst) und beschreibt den Anspruch des Monarchen, allein über Gesetze, Steuern, Richter und Krieg zu entscheiden – losgelöst von Mitsprache der Ständeversammlung oder des Adels. Als „Sonnenkönig“ verstand sich Ludwig XIV. als Mittelpunkt des Staates.",
      "Zum sichtbaren Zentrum dieser Herrschaft wurde das riesige Schloss Versailles vor den Toren von Paris. In der prachtvollen Anlage mit Spiegelsaal und weiten geometrischen Parkanlagen musste sich der hohe französische Adel um die Gunst des Königs bewerben, statt auf eigenen Burgen gegen ihn Politik zu machen. Jeder Tag des Herrschers war ein genau geplantes Schauspiel zur Verherrlichung der Krone.",
      "Hinter dem Glanz entstanden jedoch auch Anfänge moderner staatlicher Strukturen. Bezahlte, vom König abhängige Berufsbeamte verwalteten Provinzen; Frankreich baute Kanäle, Straßen und staatlich geförderte Manufakturen (Merkantilismus) für mehr Steuereinnahmen aus; ein dauerhaftes, einheitlich ausgerüstetes stehendes Heer ersetzte wechselnde Söldnerhaufen. Viele Menschen trugen allerdings durch hohe Steuern und fehlende Freiheitsrechte die Last dieses Systems.",
    ],
    takeaway:
      "Unter Ludwig XIV. verkörperte der Absolutismus unbeschränkte Königsmacht in Versailles, schuf aber auch Berufsverwaltung, Infrastruktur und ein stehendes Heer.",
    sourceIds: ["lehrplan", "versailles", "pw-schloesser"],
    quiz: check(
      "Welche drei Einrichtungen bildeten neben dem Hof in Versailles die realen Machtstützen des französischen Absolutismus?",
      "Eine besoldete Verwaltung, staatliche Wirtschaftslenkung und ein stehendes Heer.",
      [
        "Freie Parlamentswahlen, unabhängige Pressefreiheit und ein starkes Streikrecht der Bauern.",
        "Die jährliche Wahl des Königs durch sieben französische Kurfürsten und den Papst.",
      ],
      [
        "Parlamente wurden im Absolutismus nicht einberufen; Pressefreiheit und demokratische Rechte fehlten.",
        "Frankreich war eine Erbmonarchie, keine Kurfürsten-Wahlmonarchie wie das Heilige Römische Reich.",
      ],
      "Gerade feste Beamte, staatliche Infrastruktur und dauerhafte Truppen veränderten die Organisation des Staates über den Hof hinaus.",
    ),
    diagram: {
      kind: "layers",
      title: "Säulen des absolutistischen Staates unter Ludwig XIV.",
      layers: [
        { label: "Monarch („von Gottes Gnaden“)", note: "beansprucht alleinige Gesetzgebung, Rechtsprechung und Außenpolitik" },
        { label: "Hof in Versailles", note: "entmachtet den Hochadel durch Pracht, Feste und Hofzeremoniell" },
        { label: "Verwaltung & Wirtschaft (Merkantilismus)", note: "abhängige Beamte, Kanäle, Straßen und staatliche Manufakturen" },
        { label: "Stehendes Heer", note: "dauerhaft bezahlte, uniformierte Truppe nur auf Befehl des Königs" },
      ],
      caption:
        "Zwischen Anspruch und Wirklichkeit blieb eine Kluft: Auch Ludwig XIV. musste Rücksicht auf lokale Rechte, Schulden und Adelsinteressen nehmen.",
    },
    workshop: classify(
      "Glanz des Hofes oder Aufbau moderner Staatsstrukturen?",
      ["Repräsentation & Hofkontrolle", "Moderne staatliche Strukturen"],
      [
        [
          "Adlige aus ganz Frankreich warten morgens in Versailles darauf, dem König beim Ankleiden zu helfen.",
          0,
          "Das Hofzeremoniell band den Adel an den König und hielt ihn von Aufständen in den Provinzen fern.",
        ],
        [
          "Königliche Intendanten treiben in den Provinzen Steuern ein und berichten direkt nach Versailles.",
          1,
          "Eine bezahlte, weisungsgebundene Verwaltung arbeitete verlässlicher als erbliche Adelsämter.",
        ],
        [
          "Der Staat lässt schiffbare Kanäle, feste Straßen und Tuchmanufakturen anlegen.",
          1,
          "Infrastruktur und Wirtschaftsförderung stärkten die Steuerkraft des Landes dauerhaft.",
        ],
        [
          "Im Spiegelsaal feiern ausländische Gesandte bei Konzerten und Feuerwerken die Macht des Sonnenkönigs.",
          0,
          "Architektur und Parkanlagen sollten Europas Fürsten die Größe Frankreichs vorführen.",
        ],
        [
          "Soldaten tragen einheitliche Uniformen und dienen ganzjährig gegen festen Sold in Kasernen.",
          1,
          "Das stehende Heer ersetzte die unberechenbaren Söldnerbanden des Dreißigjährigen Krieges.",
        ],
      ],
      "Der Absolutismus unterdrückte politische Mitbestimmung, brachte aber zugleich Verwaltung, Infrastruktur und ein staatliches Gewaltmonopol hervor.",
    ),
    tasks: {
      1: writing(
        "Erkläre, was „Absolutismus“ bedeutet und wie Schloss Versailles dazu beitrug, die Macht Ludwigs XIV. zu sichern.",
        [
          "Leite den Begriff kurz ab und nenne den Anspruch des Königs.",
          "Erkläre die doppelte Aufgabe von Versailles (Beeindrucken und Kontrolle des Adels).",
        ],
        "Absolutismus bedeutet eine Herrschaftsform, bei der der Monarch allein über Gesetze, Steuern und Militär bestimmen will, ohne an Stände oder ein Parlament gebunden zu sein. Das prachtvolle Schloss Versailles zeigte diese Macht nach außen durch Kunst, Spiegel und Parkanlagen. Zugleich lockte Ludwig XIV. den einflussreichen Adel an den Hof und beschäftigte ihn mit Rangfragen, statt ihm eigene Macht in den Provinzen zu lassen.",
        [
          "Begriff Absolutismus erklärt",
          "Repräsentative Wirkung von Versailles beschrieben",
          "Kontrolle über den Adel genannt",
        ],
      ),
      2: writing(
        "Beurteile die Aussage: „Der Absolutismus schuf nur verschwenderische Schlösser und brachte dem Staat nichts Neues.“",
        [
          "Bestätige zuerst hohe Kosten für Hofhaltung und Kriege auf Kosten der Bevölkerung.",
          "Nenne dann drei dauerhafte staatliche Neuerungen (Verwaltung, Infrastruktur, stehendes Heer).",
        ],
        "Das Urteil übersieht wesentliche Entwicklungen. Richtig ist, dass prachtvolle Bauten wie Versailles, Feste und Kriege Unsummen verschlangen, die vor allem Bauern und Bürger über hohe Steuern zahlen mussten. Zugleich entstanden unter Ludwig XIV. und seinem Finanzminister Colbert jedoch professionelle Beamte, bessere Straßen und Kanäle sowie ein diszipliniertes stehendes Heer – wichtige Vorstufen moderner Staaten.",
        [
          "Kritik an Kosten und Steuerlast anerkannt",
          "Drei moderne Staatsstrukturen genannt",
          "Ausgewogenes Gesamturteil gefällt",
        ],
      ),
    },
  },
  {
    id: "g7-barock-in-bayern",
    lb: 5,
    title: "Barock und höfische Repräsentation in Bayern",
    period: "Frühe Neuzeit · 17. und 18. Jahrhundert",
    span: [1664, 1770],
    intro:
      "Fast jeder europäische Fürst blickte bewundernd nach Versailles – auch in Bayern und Franken entstanden prachtvolle Schlösser, Gärten und Opernhäuser des Barock.",
    paragraphs: [
      "Das französische Vorbild prägte im 17. und 18. Jahrhundert die Höfe Europas bis in Kleidung, Sprache, Musik und Bauweise hinein. Auch deutsche Fürsten – Kurfürsten, Herzöge und Fürstbischöfe – wollten sichtbar machen, dass in ihrem Territorium allein ihr Wille galt. Statt wehrhafter Burgen entstanden weite, offene Schlossanlagen mit Ehrenhöfen, symmetrischen Flügeln und schnurgeraden Parkachsen.",
      "In Bayern zeigen gleich mehrere berühmte Barockbauten diesen Anspruch. Die bayerischen Kurfürsten ließen Schloss Nymphenburg bei München und das Neue Schloss Schleißheim zu herrschaftlichen Sommerresidenzen ausbauen, um Empfangssäle, Galerien und Wasserspiele nach französischem Geschmack zu präsentieren. In Franken schuf Balthasar Neumann die Würzburger Residenz als prunkvollen Sitz des Fürstbischofs, mit dem berühmten Treppenhaus und dem gewaltigen Deckenfresko von Tiepolo.",
      "Ebenso eindrucksvoll spiegelt das Markgräfliche Opernhaus in Bayreuth den höfischen Barock wider. Dort diente nicht nur das Gebäude selbst, sondern jede Festoper dem Glanz des markgräflichen Hauses: Fürstenlogen standen im Blickpunkt, Perspektiven auf der Bühne führten direkt auf die Herrscherloge zu. So wurde Kunst und Architektur des Barock zum politischen Werkzeug, das Rang und Anspruch eindrucksvoll inszenierte.",
    ],
    takeaway:
      "Europas Fürsten nahmen Versailles als Vorbild: Bayerns Barockbauten wie Nymphenburg, Schleißheim, die Würzburger Residenz und das Bayreuther Opernhaus zeigen diese repräsentative Herrschaftskunst.",
    sourceIds: ["lehrplan", "pw-barock", "nymphenburg", "schleissheim", "wuerzburg", "bayreuth"],
    quiz: check(
      "Welche Hauptaufgabe erfüllten barocke Schlösser und Parkanlagen wie Schleißheim, Nymphenburg oder die Würzburger Residenz?",
      "Sie machten Rang, Reichtum und Machtanspruch des Fürsten für Gäste und Untertanen sichtbar.",
      [
        "Sie sollten durch besonders dicke Mauern und Zinnen im Belagerungsfall Ritterheere abwehren.",
        "Sie dienten ausschließlich als Fabriken und Kornspeicher für die städtischen Zünfte.",
      ],
      [
        "Anders als mittelalterliche Burgen öffneten Barockschlösser ihre großen Fenster zu weiten Gärten und waren nicht als Festungen gedacht.",
        "Schlossanlagen dienten der Hofhaltung und Repräsentation, nicht als Zunftwerkstätten.",
      ],
      "Symmetrie, prachtvolle Treppenhäuser und endlose Parkachsen sollten Besucher überwältigen und das französische Vorbild nachahmen.",
    ),
    workshop: classify(
      "Merkmale eines barocken Herrschaftsbaus",
      ["Französisches Vorbild (Versailles)", "Bayerisches / fränkisches Beispiel", "Repräsentative Wirkung"],
      [
        [
          "Schnurgerade Sichtachsen durch den Park lassen die Landschaft wie vom Thron aus geordnet erscheinen.",
          0,
          "Der französische Barockgarten spiegelte Ordnung und Herrschaft über die Natur.",
        ],
        [
          "In der Würzburger Residenz empfängt ein riesiges, lichtdurchflutetes Treppenhaus unter einem Deckenfresko.",
          1,
          "Fürstbischöfe in Franken wetteiferten mit weltlichen Fürsten im prachtvollen Bauen.",
        ],
        [
          "Prunkvolle Empfangsräume und vergoldete Stuckdecken führen ausländischen Gesandten Reichtum vor Augen.",
          2,
          "Repräsentation beeindruckte politische Partner und sicherte Ansehen im Reich.",
        ],
        [
          "Das Neue Schloss Schleißheim und Schloss Nymphenburg rahmen weite Kanäle und Gartenparterres ein.",
          1,
          "Bayerns Kurfürsten orientierten ihre Residenzen deutlich am Stil von Versailles.",
        ],
        [
          "Im Markgräflichen Opernhaus in Bayreuth blicken prachtvoll geschmückte Ränge auf Bühne und Fürstenloge.",
          1,
          "Musik, Theater und Architektur verschmolzen zu einem höfischen Gesamtkunstwerk.",
        ],
      ],
      "Barockschlösser zeigen bis heute, wie Architektur politische Ansprüche ohne viele Worte ausdrücken konnte.",
    ),
    tasks: {
      1: writing(
        "Beschreibe an einem bayerischen Beispiel (z. B. Schloss Nymphenburg, Schleißheim, Würzburger Residenz oder Bayreuther Opernhaus), woran man den Barock und die Repräsentation eines Fürsten erkennt.",
        [
          "Nenne typische Bau- und Gestaltungsmerkmale (Symmetrie, Treppenhaus, Fresken, Gartenachse).",
          "Erkläre, welche Botschaft an Besucher ausgesandt wurde.",
        ],
        "An der Würzburger Residenz erkennt man den Barock an der streng symmetrischen Anlage, dem weiten Ehrenhof und vor allem am gewaltigen Treppenhaus mit Tiepolos Deckenfresko, Goldschmuck und lichter Pracht. Anders als eine wehrhafte Burg sollte ein solcher Bau Besucher überwältigen und sichtbar beweisen, dass der Fürstbischof im Rang den großen europäischen Höfen um Versailles ebenbürtig war.",
        [
          "Konkretes bayerisches Beispiel benannt",
          "Typische Barockmerkmale beschrieben",
          "Repräsentative Botschaft erklärt",
        ],
      ),
      2: writing(
        "Erkläre, warum selbst kleine Fürsten im Heiligen Römischen Reich so viel Geld für Schlösser nach dem Vorbild Frankreichs ausgaben.",
        [
          "Überlege, welche Bedeutung Prestige und Rang unter den Reichsständen nach 1648 hatten.",
          "Beziehe auch die Kosten für die eigenen Untertanen mit ein.",
        ],
        "Nach dem Westfälischen Frieden 1648 strebten viele Reichsfürsten nach eigener Souveränität und hohem Rang unter den europäischen Höfen. Ein Schloss im Stil von Versailles galt als notwendiger Ausweis für Macht und Kultur, um andere Herrscher und Gesandte zu beeindrucken. Die enorme Schuldenlast für diese Pracht mussten jedoch häufig die Untertanen über Steuern tragen.",
        [
          "Vorbildwirkung von Versailles nach 1648 erklärt",
          "Bedeutung von Prestige im Reich benannt",
          "Kehrseite der Kosten für Untertanen erwähnt",
        ],
      ),
    },
  },
  {
    id: "g7-hegemonie-und-balance",
    lb: 5,
    title: "Hegemonie und „balance of power“ in Europa",
    period: "Frühe Neuzeit · 17. und 18. Jahrhundert",
    span: [1660, 1789],
    intro:
      "Kaum schien ein Staat in Europa übermächtig zu werden, schlossen seine Nachbarn Gegenbündnisse. Dieses Ringen um Gleichgewicht bestimmte die Außenpolitik des 17. und 18. Jahrhunderts.",
    paragraphs: [
      "Mit seinen wirtschaftlichen Reformen und dem großen stehenden Heer stieg Frankreich unter Ludwig XIV. zur stärksten Macht Kontinentaleuropas auf. Er führte mehrere Angriffskriege gegen Nachbargebiete am Rhein, in den Spanischen Niederlanden und in der Pfalz, um die Grenzen Frankreichs auszudehnen und eine Vorherrschaft – eine Hegemonie – in Europa zu gewinnen.",
      "Eine solche Hegemonialpolitik bedrohte jedoch Sicherheit und Unabhängigkeit aller anderen Staaten. Deshalb verfolgten vor allem England (später Großbritannien), die Niederlande, Österreich (Habsburg) und wechselnde Reichsfürsten das Prinzip der „balance of power“ (Gleichgewicht der Mächte): Wurde ein Staat zu mächtig, bildeten die übrigen Länder eine große Koalition, um das Gleichgewicht wiederherzustellen.",
      "So erlebte Europa zwischen 1667 und 1763 eine ganze Reihe von Großkonflikten, etwa den Spanischen Erbfolgekrieg oder den Siebenjährigen Krieg, bei dem auch Bayern zwischen Frankreich und Habsburg geriet. Das Gleichgewichtsdenken verhinderte zwar meist, dass ein einziger Alleinherrscher ganz Europa unterwarf – führte aber zugleich zu ständigen Bündniswechseln und immer neuen Kriegen, sobald ein Hof Vorteile witterte.",
    ],
    takeaway:
      "Gegen eine Hegemonialpolitik wie die Ludwigs XIV. bildeten Nachbarstaaten Bündnisse nach dem Prinzip der „balance of power“ – das schützte vor Vorherrschaft, sicherte aber keinen dauerhaften Frieden.",
    sourceIds: ["lehrplan", "versailles", "hdbg"],
    quiz: check(
      "Was versteht man in der europäischen Außenpolitik des 17. und 18. Jahrhunderts unter „balance of power“?",
      "Staaten schließen Gegenbündnisse, damit keine einzelne Großmacht die Vorherrschaft gewinnt.",
      [
        "Jeder europäische König muss sein gesamtes stehendes Heer nach einem Friedensvertrag auflösen.",
        "Alle Länder teilen ihre gesamten Steuereinnahmen jedes Jahr zu genau gleichen Teilen untereinander auf.",
      ],
      [
        "Im 17. und 18. Jahrhundert wurden im Gegenteil immer größere stehende Heere aufgerüstet.",
        "Finanzen blieben streng Angelegenheit der einzelnen Staaten; das Gleichgewicht betraf militärische und politische Macht.",
      ],
      "„Balance of power“ sollte ein Gleichgewicht der Kräfte wahren, sobald eine Macht wie Frankreich übermächtig zu werden drohte.",
    ),
    diagram: {
      kind: "compare",
      title: "Hegemonie gegen Gleichgewicht der Mächte",
      columns: ["Hegemonialpolitik", "„Balance of power“"],
      rows: [
        {
          aspect: "Ziel",
          values: ["ein Staat gewinnt Vormacht über Nachbarn", "keine Einzelmacht soll alle anderen beherrschen"],
        },
        {
          aspect: "Mittel",
          values: ["Gebietsansprüche, Angriffskriege, überlegenes Heer", "wechselnde Gegenbündnisse mehrerer Staaten"],
        },
        {
          aspect: "Folge für den Frieden",
          values: ["ständige Bedrohung und Kriege an den Grenzen", "verhindert Weltherrschaft, führt aber zu neuen Koalitionskriegen"],
        },
      ],
      caption:
        "Das Gleichgewichtssystem verhinderte ein europäisches Einheitsreich, hielt Europa aber in ständiger Kriegsbereitschaft.",
    },
    workshop: classify(
      "Hegemonie oder „balance of power“?",
      ["Hegemonialpolitik", "„Balance of power“ (Gleichgewicht)", "Gefahr für den Frieden"],
      [
        [
          "Ludwig XIV. schickt Truppen über den Rhein, um angrenzende Gebiete Frankreich einzuverleiben.",
          0,
          "Das einseitige Ausgreifen nach Vormachtstellung kennzeichnet Hegemonialpolitik.",
        ],
        [
          "Großbritannien, die Niederlande und Österreich verbünden sich gegen Frankreichs Übermacht im Spanischen Erbfolgekrieg.",
          1,
          "Eine große Koalition gleicht das Übergewicht einer einzelnen Großmacht wieder aus.",
        ],
        [
          "Weil ein Staat seine Nachbarn überflügeln will, brechen im 17. und 18. Jahrhundert immer neue Kriege aus.",
          2,
          "Hegemoniale Ansprüche bedrohen die Sicherheit aller Nachbarn dauerhaft.",
        ],
        [
          "Im Friedensvertrag verhindert eine Staatengruppe die Vereinigung zweier Großreiche unter einer Krone.",
          1,
          "So blieb das Mächtegleichgewicht in Europa erhalten.",
        ],
        [
          "Bündnisse wechseln je nach aktuellem Vorteil rasch, sodass neue Misstrauensspiralen entstehen.",
          2,
          "Ein bloßes Kräftemessen ohne verlässliche gemeinsame Friedensordnung blieb instabil.",
        ],
      ],
      "Hegemoniestreben löst Gegenbündnisse aus – dauerhaften Frieden bringen erst verlässliche Regeln und Zusammenarbeit.",
    ),
    tasks: {
      1: writing(
        "Erkläre die beiden Begriffe „Hegemonie“ und „balance of power“ anhand der Außenpolitik im Europa des 17. und 18. Jahrhunderts.",
        [
          "Nenne Frankreich unter Ludwig XIV. als Beispiel für Hegemoniestreben.",
          "Erkläre, wie Staaten wie Großbritannien oder Österreich darauf reagierten.",
        ],
        "Hegemonie bezeichnet die Vorherrschaft eines einzelnen Staates über seine Nachbarn, wie sie etwa Frankreich unter Ludwig XIV. durch Eroberungskriege anstrebte. Um dies zu verhindern, folgten andere Mächte wie Großbritannien, die Niederlande und Österreich dem Prinzip der „balance of power“: Sie schlossen Bündnisse gegen den stärksten Staat, um ein Gleichgewicht der Kräfte in Europa zu erhalten.",
        [
          "Begriff Hegemonie erklärt",
          "Prinzip „balance of power“ erklärt",
          "Konkretes europäisches Beispiel genannt",
        ],
      ),
      2: writing(
        "Begründe, warum sowohl hegemoniale Außenpolitik als auch ein reines „balance of power“-Denken den Frieden in Europa immer wieder gefährdeten.",
        [
          "Zeige zuerst das Problem von Eroberungszielen eines übermächtigen Staates.",
          "Erkläre dann, warum auch wechselnde Gegenkoalitionen oft zu neuen Kriegen führten.",
        ],
        "Hegemoniale Außenpolitik gefährdet den Frieden unmittelbar, weil ein starker Staat Grenzen verschieben und schwächere Länder beherrschen will. Aber auch das bloße Gleichgewichtssystem schuf keinen verlässlichen Frieden: Sobald ein Staat an Stärke gewann oder ein Erbfall drohte, führten selbst die Hüter des Gleichgewichts Kriege und wechselten rasch die Bündnispartner. Erst gemeinsame internationale Regeln und Zusammenarbeit überwinden diese Logik.",
        [
          "Gefahr durch Hegemoniestreben erklärt",
          "Grenzen des reinen Gleichgewichtssystems benannt",
          "Schlussfolgerung für dauerhaften Frieden gezogen",
        ],
      ),
    },
  },
];
