import {
  claimAmounts,
  depreciation,
  fmt,
  loanSchedule,
  supplierCredit,
  type LoanType,
} from "./finance";
import type { Lesson } from "./model/types";
import { esc } from "./workshop";
const input = (id: string, title: string, value: number, min: number, max: number, step = 1) =>
  `<label>${title}<input id="lab-${id}" type="number" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;
const table = (titles: string[], rows: (number | string)[][]) =>
  `<div class="table-scroll"><table><thead><tr>${titles.map((x) => `<th scope="col">${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((x) => `<td>${typeof x === "number" ? fmt(x) : esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
export function labHtml(kind: NonNullable<Lesson["lab"]>): string {
  let controls = "",
    description = "";
  if (kind === "depreciation") {
    controls =
      input("cost", "Anschaffungskosten (Euro)", 24000, 100, 1000000, 100) +
      input("years", "Nutzungsdauer (Jahre)", 4, 1, 30) +
      input("month", "Anschaffungsmonat (1–12)", 10, 1, 12);
    description =
      "Bewegliche Anlage, lineare Abschreibung, kein Restwert. Anschaffungsmonat zählt. Ändere Monat und Nutzungsdauer: Wie verändern sich erster Betrag und Buchwert?";
  } else if (kind === "loans") {
    controls =
      input("principal", "Kreditsumme (Euro)", 20000, 100, 1000000, 100) +
      input("rate", "Jahreszins (%)", 6, 0, 30, 0.1) +
      input("years", "Jahre", 4, 1, 30) +
      `<label>Darlehensart<select id="lab-kind"><option value="instalment">Abzahlungsdarlehen</option><option value="fixed">Festdarlehen</option><option value="annuity">Annuitätendarlehen</option></select></label>`;
    description =
      "Jährliche Zahlungen am Jahresende, gleichbleibender Zins, keine Gebühren, kein Disagio. Vergleiche bei gleicher Summe und Laufzeit die Raten und die gesamte Zinslast. Rundungsdifferenzen werden in der letzten Tilgung ausgeglichen.";
  } else if (kind === "supplier") {
    controls =
      input("net", "Nettorechnung (Euro)", 10000, 100, 1000000, 100) +
      input("discount", "Skonto (%)", 2, 0.1, 10, 0.1) +
      input("rate", "Kontokorrentzins (%)", 9, 0, 50, 0.1) +
      input("days", "Zusätzliche Kredittage", 20, 1, 360);
    description =
      "Reiner Nettovergleich mit vollem Vorsteuerabzug und 360 Tagen: Finanzierung des Nettobetrags nach Skonto. Der tatsächliche Bruttoliquiditätsbedarf ist hier nicht modelliert. Finde einen Zinssatz, bei dem der Vorteil kleiner wird.";
  } else {
    controls =
      input("gross", "Bruttoforderung (Euro)", 11900, 1, 1000000, 1) +
      input("percent", "Ausfallquote (%)", 40, 0, 100) +
      `<label>Zustand<select id="lab-state"><option value="expected">Erwarteter Ausfall: EWB</option><option value="final">Endgültige Uneinbringlichkeit</option></select></label>`;
    description =
      "19 Prozent versteuerte Forderung, kein vorhandener EWB-Bestand. Vergleiche dieselbe Quote als Risikoschätzung und als feststehenden Ausfall. Wann darf die Umsatzsteuer korrigiert werden?";
  }
  return `<section class="panel lab"><div class="eyebrow">Was ändert sich, wenn …?</div><h2>Zusammenhänge ausprobieren</h2><p>${description}</p><form id="lab-form"><div class="controls">${controls}</div><button type="submit">Modell aktualisieren</button></form><div id="lab-result" aria-live="polite"></div></section>`;
}
export function bindLab(kind: NonNullable<Lesson["lab"]>) {
  const form = document.querySelector<HTMLFormElement>("#lab-form");
  const out = document.querySelector<HTMLElement>("#lab-result");
  if (!form || !out) return;
  const val = (id: string) =>
    document.querySelector<HTMLInputElement | HTMLSelectElement>(`#lab-${id}`)?.value ?? "";
  const num = (id: string) => Number(val(id));
  const render = () => {
    if (!form.reportValidity()) return;
    try {
      if (kind === "depreciation") {
        const result = depreciation(num("cost"), num("years"), num("month"));
        const bars = result.rows
          .map(
            (row) =>
              `<div class="bar-row"><span>Jahr ${row.year}</span><div class="bar-track"><div class="bar" style="width:${Math.max(0, (row.book / num("cost")) * 100)}%"></div></div><strong>${fmt(row.book)} €</strong></div>`,
          )
          .join("");
        out.innerHTML = `<p>Volles Jahr: <strong>${fmt(result.annual)} Euro</strong> · Satz: ${fmt(result.rate)} %</p><div class="bars" role="img" aria-label="Restbuchwerte nach Kalenderjahren">${bars}</div>${table(
          ["Kalenderjahr", "AfA (Euro)", "Buchwert (Euro)"],
          result.rows.map((r) => [String(r.year), r.depreciation, r.book]),
        )}`;
      } else if (kind === "loans") {
        const result = loanSchedule(
          num("principal"),
          num("rate"),
          num("years"),
          val("kind") as LoanType,
        );
        out.innerHTML = `<p>Gesamte Zinsen: <strong>${fmt(result.reduce((s, r) => s + r.interest, 0))} Euro</strong></p>${table(
          ["Jahr", "Zins (Euro)", "Tilgung (Euro)", "Rate (Euro)", "Restschuld (Euro)"],
          result.map((r) => [String(r.year), r.interest, r.redemption, r.payment, r.balance]),
        )}`;
      } else if (kind === "supplier") {
        const r = supplierCredit(num("net"), num("discount"), num("rate"), num("days"));
        out.innerHTML = `<p class="result">${r.advantage >= 0 ? "Vorteil der frühen Zahlung" : "Mehrkosten der frühen Zahlung"}: <strong>${fmt(Math.abs(r.advantage))} Euro</strong></p>${table(["Nettoskonto", "Finanzierter Nettobetrag", "Kontokorrentzinsen"], [[r.saving, r.financed, r.interest]])}<p>Auf Jahresbasis umgerechnete Kosten des Skontoverzichts: ${fmt(r.annualized)} %. Diese einfache Vergleichszahl ist kein gesetzlicher Effektivzins.</p>`;
      } else {
        const r = claimAmounts(num("gross"), 19, num("percent"));
        const expected = val("state") === "expected";
        out.innerHTML = `<p>Forderung netto: ${fmt(r.net)} Euro.</p>${table(["Nettoausfall / Wertberichtigung", "USt-Korrektur jetzt", "Auszubuchender Bruttoausfall"], [[expected ? r.expectedLoss : r.netLoss, expected ? 0 : r.taxCorrection, expected ? 0 : r.grossLoss]])}<p>${expected ? "Nur erwarteter Verlust: EWB ohne Umsatzsteuerkorrektur; die Bruttoforderung bleibt stehen." : "Feststehende Uneinbringlichkeit: Nettoverlust und Umsatzsteuerkorrektur, Forderung nur im endgültig ausgefallenen Umfang ausbuchen."}</p>`;
      }
    } catch (error) {
      out.textContent = error instanceof Error ? error.message : "Eingaben prüfen.";
    }
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    render();
  });
  render();
}
