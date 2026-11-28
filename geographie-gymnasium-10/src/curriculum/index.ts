import type { Lesson, Source, Stage } from "../model/types";
import lb1 from "./lessons-lb1.json";
import lb2 from "./lessons-lb2.json";
import lb3 from "./lessons-lb3.json";
import lb4 from "./lessons-lb4.json";
import lb5 from "./lessons-lb5.json";
import lb6 from "./lessons-lb6.json";
import lb7 from "./lessons-lb7.json";

export const LESSONS = [
  ...lb1,
  ...lb2,
  ...lb3,
  ...lb4,
  ...lb5,
  ...lb6,
  ...lb7,
] as Lesson[];

export const CORE_LESSONS = LESSONS;

export const STAGES: Stage[] = [
  { lb: 1, title: "Geographische Arbeitstechniken", shortTitle: "Karten und Methoden", icon: "⌖" },
  { lb: 2, title: "Leben in der Einen Welt", shortTitle: "Eine Welt und Entwicklung", icon: "⊕" },
  { lb: 3, title: "Klima- und Vegetationszonen der Tropen und ariden Subtropen", shortTitle: "Tropen und Subtropen", icon: "☀" },
  { lb: 4, title: "Klima im Wandel", shortTitle: "Klima im Wandel", icon: "△" },
  { lb: 5, title: "Traditionsreicher Kulturraum im Spannungsfeld aktueller Geopolitik – Nordafrika, Naher und Mittlerer Osten", shortTitle: "Nordafrika und Nahost", icon: "◈" },
  { lb: 6, title: "Entwicklungsperspektiven in tropischen Räumen – Afrika südlich der Sahara", shortTitle: "Afrika südlich der Sahara", icon: "❀" },
  { lb: 7, title: "Herausforderungen der Entwicklung in tropischen Räumen – Mittel- und Südamerika, Karibik", shortTitle: "Lateinamerika und Karibik", icon: "▲" },
];

export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/geographie";

export const SOURCES: Source[] = [
  { id: "lehrplan", label: "LehrplanPLUS · Geographie 10 Gymnasium", url: CURRICULUM_URL },
  { id: "natural-earth", label: "Natural Earth · Public-Domain-Vektorkarten", url: "https://github.com/nvkelso/natural-earth-vector" },
  { id: "bayernatlas", label: "BayernAtlas · Digitale Karten Bayerns", url: "https://atlas.bayern.de/" },
  { id: "copernicus", label: "Copernicus Data Space · Satellitenbilder (Englisch)", url: "https://dataspace.copernicus.eu/" },
  { id: "hdr-hdi", label: "UNDP · Human Development Index (Englisch)", url: "https://hdr.undp.org/data-center/human-development-index" },
  { id: "bmz-ez", label: "BMZ · Lexikon Entwicklungszusammenarbeit", url: "https://www.bmz.de/de/service/lexikon/entwicklungszusammenarbeit-14316" },
  { id: "bmz-klima", label: "BMZ · Klimawandel und Entwicklungspolitik", url: "https://www.bmz.de/de/themen/klimawandel-und-entwicklung" },
  { id: "dwd-klima", label: "Deutscher Wetterdienst · Klimawandel", url: "https://www.dwd.de/DE/klimaumwelt/klimawandel/klimawandel_node.html" },
  { id: "dwd-daten", label: "Deutscher Wetterdienst · Klimadaten Deutschland", url: "https://www.dwd.de/DE/leistungen/klimadatendeutschland/klimadatendeutschland.html" },
  { id: "uba-klima", label: "Umweltbundesamt · Grundlagen des Klimawandels", url: "https://www.umweltbundesamt.de/themen/klima-energie/klimawandel" },
  { id: "uba-anpassung", label: "Umweltbundesamt · Klimafolgen und Anpassung", url: "https://www.umweltbundesamt.de/themen/klima-energie/klimafolgen-anpassung" },
  { id: "de-ipcc", label: "Deutsche IPCC-Koordinierungsstelle", url: "https://www.de-ipcc.de/" },
  { id: "lfu-klima", label: "LfU Bayern · Wetter und Klima", url: "https://www.lfu.bayern.de/klima/index.htm" },
  { id: "uba-wasser", label: "Umweltbundesamt · Thema Wasser", url: "https://www.umweltbundesamt.de/themen/wasser" },
  { id: "unccd", label: "UNCCD · Wüstenbekämpfung (Englisch)", url: "https://www.unccd.int/" },
  { id: "bpb-klimawandel", label: "bpb · Thema Klimawandel", url: "https://www.bpb.de/themen/klimawandel/" },
  { id: "bpb-migration", label: "bpb · Thema Migration und Integration", url: "https://www.bpb.de/themen/migration-integration/" },
  { id: "bpb-nahost", label: "bpb · Naher und Mittlerer Osten", url: "https://www.bpb.de/themen/naher-mittlerer-osten/" },
  { id: "bpb-afrika", label: "bpb · Thema Afrika", url: "https://www.bpb.de/themen/afrika/" },
  { id: "bpb-lateinamerika", label: "bpb · Thema Lateinamerika", url: "https://www.bpb.de/themen/amerika/lateinamerika/" },
  { id: "uba-tourismus", label: "Umweltbundesamt · Nachhaltiger Tourismus", url: "https://www.umweltbundesamt.de/themen/wirtschaft-konsum/nachhaltiger-tourismus" },
];

export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
