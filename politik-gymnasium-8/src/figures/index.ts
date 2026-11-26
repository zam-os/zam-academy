/**
 * Registry and DOM wiring for all 44 interactive lesson figures (ExplorerFigures)
 * plus the Lernpfad hero panorama and Nachschlagen overview diagram.
 */
import { esc } from "../workshop";
import type { ExplorerPart } from "./draw";
import {
  dreiGrundhaltungen,
  type ExplorerFigureOutput,
  generationenVergleich,
  gruppenVerhaltenKriterien,
  jugendkulturenVergleich,
  konfliktAnalyseKreis,
  medienNutzungReflexion,
  medienProduktionSchema,
  normenSanktionen,
  oeffentlichkeitPrivatheit,
  peergroupEinfluss,
  schutzStrategienVorbilder,
  sozialisationsMindmap,
  vorbildIdolInfluencer,
  werteVergleich,
  wertschaetzungPersonenkult,
} from "./scenes-lb1-3";
import {
  akteureZusammenwirken,
  engagementFormen,
  euregioModell,
  grenzKonfliktLoesungen,
  kompromissWaage,
  kontakteVorOrt,
  mitwirkungKommune,
  politikKreislaufSchema,
  projektAugenhoehe,
  staatGrundbegriffe,
} from "./scenes-lb4-5";
import {
  esskulturBerufe,
  etikettPruefen,
  fremdbildEigenbild,
  gesundheitsDimensionen,
  gesundheitSozialStaat,
  heimatSechsDimensionen,
  medienLandschaftVergleich,
  mobbingMassenpsychologie,
  naehrstoffBausteine,
  prophylaxeTherapie,
  regionalGlobalTrends,
  regionTrends,
  rollenkonfliktTeam,
  seriositaetCheck,
  soziogrammLesen,
  traditionWandel,
  umfragePraesentation,
  vorurteileAbbau,
  fuehrungsstileVergleich,
} from "./scenes-lb6";

export { gesamtUebersicht, heroPanorama } from "./scenes-overview";

export interface Figure {
  caption: string;
  render: (activeIndex?: number) => ExplorerFigureOutput;
}

export const FIGURES: Record<string, Figure> = {
  werteVergleich: {
    caption: "Klicke auf einen Balken, um Wertebereich und Aussage im Jugendbarometer einzuordnen.",
    render: werteVergleich,
  },
  generationenVergleich: {
    caption: "Drei Generationen im Vergleich: Klicke auf jede Station für typische Merkmale.",
    render: generationenVergleich,
  },
  peergroupEinfluss: {
    caption: "Wähle ein Einflussfeld rund um Identität und Peergroups.",
    render: peergroupEinfluss,
  },
  jugendkulturenVergleich: {
    caption: "Historische und aktuelle Jugendkulturen: Klicke eine Szene zum Vergleich an.",
    render: jugendkulturenVergleich,
  },
  medienNutzungReflexion: {
    caption: "Drei Blickwinkel auf den Umgang Jugendlicher mit digitalen Medien.",
    render: medienNutzungReflexion,
  },
  sozialisationsMindmap: {
    caption: "Klicke auf eine Sozialisationsinstanz, um ihre Wirkung im Lebenslauf zu sehen.",
    render: sozialisationsMindmap,
  },
  normenSanktionen: {
    caption: "Vom Gruppenmaßstab zur Reaktion: Wähle einen Schritt aus.",
    render: normenSanktionen,
  },
  gruppenVerhaltenKriterien: {
    caption: "Vergleiche beide Verhaltensmuster durch Anklicken der Spalten.",
    render: gruppenVerhaltenKriterien,
  },
  konfliktAnalyseKreis: {
    caption: "Vier Schritte zur Konfliktanalyse – klicke jeden Schritt an.",
    render: konfliktAnalyseKreis,
  },
  dreiGrundhaltungen: {
    caption: "Fairness, Teamfähigkeit und Toleranz: Wähle einen Baustein aus.",
    render: dreiGrundhaltungen,
  },
  wertschaetzungPersonenkult: {
    caption: "Wo verläuft die Grenze zwischen Wertschätzung und Personenkult?",
    render: wertschaetzungPersonenkult,
  },
  vorbildIdolInfluencer: {
    caption: "Drei Orientierungsrollen im Vergleich – wähle eine Rolle aus.",
    render: vorbildIdolInfluencer,
  },
  medienProduktionSchema: {
    caption: "Von der Inszenierung zur kritischen Prüfung: Klicke einen Schritt an.",
    render: medienProduktionSchema,
  },
  oeffentlichkeitPrivatheit: {
    caption: "Wähle eine Dimension von Popularität aus dem Schaubild.",
    render: oeffentlichkeitPrivatheit,
  },
  schutzStrategienVorbilder: {
    caption: "Vier Risiken und passende Schutzstrategien im Umgang mit Idolen und Influencern.",
    render: schutzStrategienVorbilder,
  },
  staatGrundbegriffe: {
    caption: "Klicke auf einen politischen Grundbegriff für die Erklärung.",
    render: staatGrundbegriffe,
  },
  politikKreislaufSchema: {
    caption: "Die vier Phasen des Politikkreislaufs interaktiv erkunden.",
    render: politikKreislaufSchema,
  },
  kompromissWaage: {
    caption: "Wähle ein Element der Waage, um Mehrheit, Kompromiss und Minderheitenschutz einzuordnen.",
    render: kompromissWaage,
  },
  mitwirkungKommune: {
    caption: "Vier Mitwirkungswege vor Ort – klicke auf eine Karte für Chancen und Grenzen.",
    render: mitwirkungKommune,
  },
  engagementFormen: {
    caption: "Vom praktischen Ehrenamt bis zur Partei: Wähle eine Engagementform.",
    render: engagementFormen,
  },
  akteureZusammenwirken: {
    caption: "Klicke Gesellschaft, Vermittlung oder Staat an, um ihre Aufgaben zu sehen.",
    render: akteureZusammenwirken,
  },
  kontakteVorOrt: {
    caption: "Vier Bereiche internationaler Kontakte direkt in Gemeinde und Schule.",
    render: kontakteVorOrt,
  },
  projektAugenhoehe: {
    caption: "Vergleiche faire Partnerschaft auf Augenhöhe mit einer Einbahnstraße.",
    render: projektAugenhoehe,
  },
  grenzKonfliktLoesungen: {
    caption: "Drei Wege bei europäischen Grenzkonflikten im Vergleich.",
    render: grenzKonfliktLoesungen,
  },
  euregioModell: {
    caption: "Wie eine Euregio Nachbarregionen verbindet: Klicke jede Station an.",
    render: euregioModell,
  },
  heimatSechsDimensionen: {
    caption: "Wähle eine Heimat-Dimension oder den politischen Gebrauch aus.",
    render: heimatSechsDimensionen,
  },
  fremdbildEigenbild: {
    caption: "Vergleiche Tourismus-Fremdbild und vielfältiges Alltagserleben.",
    render: fremdbildEigenbild,
  },
  traditionWandel: {
    caption: "Wie Traditionen, Dialekt und Vereine sich im Wandel behaupten.",
    render: traditionWandel,
  },
  regionTrends: {
    caption: "Vier Handlungsfelder für die Zukunft der Region im Überblick.",
    render: regionTrends,
  },
  medienLandschaftVergleich: {
    caption: "Klicke ein Medienformat an, um Stärken und Schwächen zu vergleichen.",
    render: medienLandschaftVergleich,
  },
  seriositaetCheck: {
    caption: "Vier Prüfschritte für verlässliche journalistische Berichte.",
    render: seriositaetCheck,
  },
  umfragePraesentation: {
    caption: "Von der Erhebung über die freie Rede bis zur fairen Debatte.",
    render: umfragePraesentation,
  },
  soziogrammLesen: {
    caption: "Klicke auf Rollen im Soziogramm (Star, Brücke, Clique, Randposition).",
    render: soziogrammLesen,
  },
  fuehrungsstileVergleich: {
    caption: "Wähle einen Führungsstil, um typische Wirkungen zu vergleichen.",
    render: fuehrungsstileVergleich,
  },
  rollenkonfliktTeam: {
    caption: "Rollenkonflikte und Voraussetzungen guter Teamarbeit erkunden.",
    render: rollenkonfliktTeam,
  },
  vorurteileAbbau: {
    caption: "Wie Vorurteile entstehen und durch Information und Kontakt abgebaut werden.",
    render: vorurteileAbbau,
  },
  mobbingMassenpsychologie: {
    caption: "Menschenwürde, Mobbing und Konformitätsdruck in Großgruppen.",
    render: mobbingMassenpsychologie,
  },
  gesundheitsDimensionen: {
    caption: "Physische, psychische und soziale Gesundheit im Zusammenhang.",
    render: gesundheitsDimensionen,
  },
  naehrstoffBausteine: {
    caption: "Klicke auf eine Lebensmittelgruppe für ihre Aufgabe im Körper.",
    render: naehrstoffBausteine,
  },
  prophylaxeTherapie: {
    caption: "Vergleiche ernährungsbedingte Krankheiten und Essstörungen.",
    render: prophylaxeTherapie,
  },
  etikettPruefen: {
    caption: "Vier Prüfpunkte für einen bewussten Einkauf im Supermarkt.",
    render: etikettPruefen,
  },
  gesundheitSozialStaat: {
    caption: "Zwischen sozialer Lebenslage, staatlicher Vorsorge und Freiheit.",
    render: gesundheitSozialStaat,
  },
  regionalGlobalTrends: {
    caption: "Ernährungstrends und Lieferketten: Klicke einen Bereich an.",
    render: regionalGlobalTrends,
  },
  esskulturBerufe: {
    caption: "Vergleiche Wandel der Esskultur und Berufsfelder rund um Ernährung.",
    render: esskulturBerufe,
  },
};

function renderExplorerBar(parts: ExplorerPart[], activeIndex: number): string {
  const safeIdx = Math.max(0, Math.min(parts.length - 1, activeIndex));
  return `<div class="exp-panel"><div class="exp-tabs" role="group" aria-label="Bereiche des Schaubilds">${parts
    .map(
      (part, i) =>
        `<button type="button" class="exp-btn" data-exp-btn="${i}" aria-pressed="${i === safeIdx}">${esc(part.label)}</button>`,
    )
    .join("")}</div><p class="exp-detail" role="status" aria-live="polite">${esc(parts[safeIdx]?.detail ?? "")}</p></div>`;
}

export function renderFigure(id: string, activeIndex = 0): string {
  const fig = FIGURES[id];
  if (!fig) return "";
  const out = fig.render(activeIndex);
  return `<figure class="lesson-figure" data-figure="${esc(id)}">${out.svg}${renderExplorerBar(out.parts, activeIndex)}<figcaption><strong>Schaubild · Interaktiv</strong> · ${esc(fig.caption)}</figcaption></figure>`;
}

export function bindFigures(
  host: HTMLElement,
  selections: Map<string, number>,
): void {
  host.querySelectorAll<HTMLElement>("[data-figure]").forEach((figEl) => {
    const id = figEl.dataset.figure!;
    const fig = FIGURES[id];
    if (!fig) return;
    const select = (nextIndex: number, focusTarget?: "btn" | "part") => {
      selections.set(id, nextIndex);
      const out = fig.render(nextIndex);
      const oldSvg = figEl.querySelector("svg");
      const oldPanel = figEl.querySelector(".exp-panel");
      if (oldSvg) oldSvg.outerHTML = out.svg;
      if (oldPanel) oldPanel.outerHTML = renderExplorerBar(out.parts, nextIndex);
      wire();
      if (focusTarget === "btn") {
        figEl
          .querySelector<HTMLElement>(`[data-exp-btn="${nextIndex}"]`)
          ?.focus({ preventScroll: true });
      } else if (focusTarget === "part") {
        figEl
          .querySelector<HTMLElement>(`[data-part="${nextIndex}"]`)
          ?.focus({ preventScroll: true });
      }
    };
    const wire = () => {
      figEl.querySelectorAll<HTMLElement>("[data-part]").forEach((partEl) => {
        const idx = Number(partEl.dataset.part);
        partEl.addEventListener("click", () => select(idx, "part"));
        partEl.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            select(idx, "part");
          }
        });
      });
      figEl.querySelectorAll<HTMLButtonElement>("[data-exp-btn]").forEach((btn) => {
        const idx = Number(btn.dataset.expBtn);
        btn.addEventListener("click", () => select(idx, "btn"));
      });
    };
    wire();
  });
}
