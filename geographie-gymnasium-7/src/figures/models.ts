import { arrow, f1, label, labels, svg } from "./draw";

type Row = readonly [label: string, value: number];
const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const climate = {
  coast: {
    name: "Atlantikküste", temp: [5, 5, 7, 9, 12, 14, 16, 16, 14, 11, 8, 6],
    rain: [76, 63, 62, 54, 55, 63, 65, 72, 75, 83, 83, 81],
  },
  inland: {
    name: "Landesinneres", temp: [-4, -2, 3, 8, 14, 18, 21, 20, 15, 9, 3, -1],
    rain: [34, 30, 34, 41, 53, 63, 74, 62, 46, 40, 38, 36],
  },
  south: {
    name: "Mittelmeerküste", temp: [9, 10, 12, 15, 19, 23, 26, 26, 22, 18, 13, 10],
    rain: [66, 53, 52, 45, 29, 15, 7, 13, 38, 66, 76, 72],
  },
};
export type ClimateSite = keyof typeof climate;

export function climateChart(site: ClimateSite): string {
  const { name, temp, rain } = climate[site];
  const x = (i: number) => 55 + i * 42;
  const ty = (value: number) => 177 - value * 4;
  const bars = rain.map((value, i) =>
    `<rect class="geo-rain" x="${x(i) - 11}" y="${f1(177 - value * 1.5)}" width="22" height="${f1(value * 1.5)}"/>`
  ).join("");
  const grid = [-5, 0, 10, 20, 30].map((value) =>
    `<line class="geo-axis" x1="44" y1="${ty(value)}" x2="530" y2="${ty(value)}"/>` +
    label(35, ty(value) + 4, String(value).replace("-", "−"), "lbl small", "end")
  ).join("");
  const right = [0, 40, 80].map((value) => label(540, 181 - value * 1.5, String(value), "lbl small", "start")).join("");
  const path = temp.map((value, i) => `${x(i)},${ty(value)}`).join(" ");
  return svg(580, 234, `Klimadiagramm für das Modell ${name}`,
    label(291, 21, name + " · Modelldaten", "lbl strong") + label(30, 42, "°C", "lbl small") + label(552, 42, "mm", "lbl small") +
    grid + right + bars + `<polyline class="geo-temp" points="${path}"/>` +
    months.map((m, i) => label(x(i), 221, m, "lbl small")).join(""));
}

export function climateTable(site: ClimateSite): string {
  const { name, temp, rain } = climate[site];
  const observations = [0, 3, 6, 9];
  return `<table class="lab-table geo-table"><caption>Vier Monatswerte · ${name} (Modell)</caption>
    <thead><tr><th scope="col">Monat</th><th scope="col">Temperatur</th><th scope="col">Niederschlag</th></tr></thead>
    <tbody>${observations.map((i) => `<tr><th scope="row">${months[i]}</th><td>${String(temp[i]).replace("-", "−")} °C</td><td>${rain[i]} mm</td></tr>`).join("")}</tbody></table>`;
}

export function comparisonBars(title: string, values: readonly Row[], unit: string, maximum: number): string {
  const body = values.map(([name, value], i) => {
    const y = 48 + 43 * i;
    return label(156, y + 19, name, "lbl small", "end")
      + `<rect class="geo-bar-bg" x="170" y="${y}" width="330" height="29" rx="6"/><rect class="geo-color-${i}" x="170" y="${y}" width="${f1(330 * value / maximum)}" height="29" rx="6"/>`
      + label(510, y + 19, `${value} ${unit}`, "lbl small", "start");
  }).join("");
  return svg(580, 62 + 43 * values.length, title, label(290, 26, title, "lbl strong") + body);
}

export function processFigure(title: string, names: readonly string[], subtitle: readonly string[], ordered = false): string {
  const body = names.map((name, i) => {
    const x = 25 + i * (530 / names.length), w = 530 / names.length - 13;
    return `<rect class="geo-step geo-color-${i}" x="${x}" y="46" width="${w}" height="94" rx="13"/>`
      + labels(x + w / 2, 72, name, "lbl strong")
      + labels(x + w / 2, 115, subtitle[i], "lbl small")
      + (ordered && i < names.length - 1 ? arrow(x + w + 2, 148, x + w + 17, 148) : "");
  }).join("");
  return svg(580, 165, title, label(290, 24, title, "lbl strong") + body);
}

export function coastProfile(phase: "low" | "rising" | "high"): string {
  const waterLevel = { low: 136, rising: 109, high: 79 }[phase];
  const waterExtent = { low: 184, rising: 337, high: 460 }[phase];
  return svg(580, 207, "Wattenmeerprofil mit Wasser, Wattfläche, Salzwiese und Deich",
    `<path class="geo-sand" d="M0 160Q120 147 183 136Q263 122 338 109Q419 96 460 79L500 79L525 38L546 38L565 79L580 79V207H0Z"/>
    <path class="sea" d="M0 ${waterLevel}H${waterExtent}L0 160Z"/>
    <path class="geo-shore" d="M0 160Q120 147 183 136Q263 122 338 109Q419 96 460 79L500 79L525 38L546 38L565 79L580 79"/>
    ${label(92, 116, "Nordsee", "lbl strong")}${label(300, 162, "Wattfläche", "lbl strong")}
    ${label(469, 67, "Salzwiese", "lbl small")}${label(536, 26, "Deich", "lbl small")}`);
}

export function plateProfile(motion: "apart" | "under" | "past"): string {
  const titles = { apart: "Platten driften auseinander", under: "Eine Platte taucht ab", past: "Platten gleiten seitlich vorbei" };
  const body = {
    apart: `<path class="geo-plate" d="M20 95H222L265 130L222 146H20Z M560 95H358L315 130L358 146H560Z"/>
      <path class="geo-magma" d="M265 151L290 94L315 151Z"/>${arrow(237, 74, 165, 74)}${arrow(341, 74, 414, 74)}
      ${label(290, 178, "Magma steigt auf", "lbl small")}`,
    under: `<path class="geo-plate" d="M20 95H241L430 156L397 169L220 124H20Z M255 71H560V115H386Z"/>
      <path class="geo-magma" d="M367 70L394 40L425 70Z"/>${arrow(130, 77, 209, 77)}${arrow(512, 59, 438, 59)}
      ${label(237, 156, "Absinkende Platte", "lbl small")}`,
    past: `<path class="geo-plate" d="M35 56H545V103H35Z M35 112H545V160H35Z"/>
      ${arrow(190, 80, 370, 80)}${arrow(372, 135, 182, 135)}${label(286, 179, "Störung in Draufsicht", "lbl small")}`,
  };
  return svg(580, 196, titles[motion], label(290, 25, titles[motion], "lbl strong") + body[motion]);
}

export function rainfallProfile(): string {
  return svg(580, 212, "Feuchte Luft steigt an der Windseite eines Gebirges, trockenere Luft sinkt im Lee",
    `<rect class="sea" x="0" y="145" width="114" height="66"/>
    <path class="geo-sand" d="M110 196L157 155L210 141L293 49L402 152L506 178L580 197V211H110Z"/>
    <path class="geo-rain" d="M160 105h3v27h-3zm15-10h3v24h-3zm14 4h3v23h-3z"/>
    ${arrow(87, 123, 204, 66)}${arrow(336, 74, 466, 143)}
    ${label(154, 48, "Feuchte Luft steigt", "lbl strong")}
    ${label(443, 58, "Luft sinkt im Lee", "lbl strong")}
    ${label(165, 166, "Windseite", "lbl small")}
    ${label(455, 166, "Leeseite", "lbl small")}`);
}
