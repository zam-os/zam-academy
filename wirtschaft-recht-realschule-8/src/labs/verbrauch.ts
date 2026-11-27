import type { LabDef } from "./engine";

const euro = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pricePerKilo = (price: number, grams: number) => (price * 1000) / grams;

export const GRUNDPREIS: LabDef = {
  kind: "grundpreis",
  title: "Packungspreis oder Grundpreis?",
  intro: "Packung A enthält 250 g und kostet 2 €. Ändere Gewicht und Preis von Packung B. Vergleiche beide Preise pro Kilogramm.",
  sliders: [
    { key: "grams", label: "Gewicht von Packung B", min: 200, max: 600, step: 50, unit: "g", value: 300 },
    { key: "price", label: "Preis von Packung B", min: 1, max: 5, step: 0.2, unit: "€", value: 2.6 },
  ],
  selects: [],
  goals: [
    { id: "guenstiger-je-kg", text: "Mach B an der Kasse teurer als A, aber pro Kilogramm günstiger.", test: (s) => s.price > 2 && pricePerKilo(s.price, s.grams) < 8 },
    { id: "gleich", text: "Finde für B ein anderes Gewicht als bei A, aber denselben Grundpreis.", test: (s) => s.grams !== 250 && Math.abs(pricePerKilo(s.price, s.grams) - 8) < 1e-9 },
    { id: "guenstiger-kasse", text: "Mach B an der Kasse günstiger als A, aber pro Kilogramm teurer.", test: (s) => s.price < 2 && pricePerKilo(s.price, s.grams) > 8 },
  ],
  witness: {
    "guenstiger-je-kg": { grams: 400, price: 3 },
    gleich: { grams: 300, price: 2.4 },
    "guenstiger-kasse": { grams: 200, price: 1.8 },
  },
  view(s) {
    const base = pricePerKilo(s.price, s.grams);
    const maximum = Math.max(8, base);
    const pack = (label: string, price: number, weight: number, unitPrice: number) =>
      `<div class="price-pack"><strong>${label}</strong><span>${euro.format(price)} € für ${weight} g</span><div class="price-bar"><span style="width:${100 * unitPrice / maximum}%"></span></div><b>${euro.format(unitPrice)} € pro kg</b></div>`;
    return {
      figure: `<div class="price-comparison">${pack("Packung A", 2, 250, 8)}${pack("Packung B", s.price, s.grams, base)}</div>`,
      readouts: [["Abstand der Grundpreise", `${euro.format(Math.abs(base - 8))} € pro kg`]],
      note: base < 8 - 1e-9 ? "B kostet pro Kilogramm weniger." : base > 8 + 1e-9 ? "A kostet pro Kilogramm weniger." : "Beide Packungen haben denselben Grundpreis.",
    };
  },
};
