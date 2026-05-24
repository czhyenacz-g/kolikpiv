export type Gender = "male" | "female";

export interface DrinkEntry {
  id: string;
  presetId?: string;
  label: string;
  volumeMl: number;
  abv: number;
  count: number;
}

export interface AlcoholResult {
  totalAlcoholG: number;
  beerEquivalents: number;
  bacEstimate: number;
  humanDescription: string;
}

// Standard reference beer: 0.5l, 5% ABV (12° pivo)
const ETHANOL_DENSITY = 0.789;
const STANDARD_BEER_ALCOHOL_G = 500 * 0.05 * ETHANOL_DENSITY; // ~19.7 g

// Widmark body water distribution factors
const WIDMARK_R: Record<Gender, number> = {
  male: 0.68,
  female: 0.55,
};

export function calcAlcoholG(volumeMl: number, abv: number): number {
  return volumeMl * (abv / 100) * ETHANOL_DENSITY;
}

export function calcTotalAlcoholG(drinks: DrinkEntry[]): number {
  return drinks.reduce(
    (sum, d) => sum + calcAlcoholG(d.volumeMl, d.abv) * d.count,
    0
  );
}

export function calcBeerEquivalents(totalAlcoholG: number): number {
  return totalAlcoholG / STANDARD_BEER_ALCOHOL_G;
}

// Returns BAC in g/kg, equivalent to ‰ (promile)
export function calcBAC(
  totalAlcoholG: number,
  weightKg: number,
  gender: Gender
): number {
  if (weightKg <= 0) return 0;
  return totalAlcoholG / (weightKg * WIDMARK_R[gender]);
}

export function calcAlcohol(
  drinks: DrinkEntry[],
  weightKg: number,
  gender: Gender
): AlcoholResult {
  const totalAlcoholG = calcTotalAlcoholG(drinks);
  const beerEquivalents = calcBeerEquivalents(totalAlcoholG);
  const bacEstimate = calcBAC(totalAlcoholG, weightKg, gender);

  return {
    totalAlcoholG: Math.round(totalAlcoholG * 10) / 10,
    beerEquivalents: Math.round(beerEquivalents * 10) / 10,
    bacEstimate: Math.round(bacEstimate * 100) / 100,
    humanDescription: buildDescription(beerEquivalents, bacEstimate),
  };
}

// Orientační rychlost odbourávání alkoholu (Widmark / průměrné hodnoty)
const ELIMINATION_RATE_PER_HOUR = 0.12; // ‰ za hodinu

export function calculateCurrentPromile(
  initialPromile: number,
  stoppedAt: Date | null,
  now: Date = new Date()
): number {
  if (!stoppedAt || stoppedAt > now) return initialPromile;
  const hours = (now.getTime() - stoppedAt.getTime()) / 3_600_000;
  return Math.max(0, initialPromile - hours * ELIMINATION_RATE_PER_HOUR);
}

export function clampPromileForThermometer(
  promile: number,
  maxPromile = 4
): number {
  return Math.max(0, Math.min(promile, maxPromile));
}

export function getPromileDisplay(
  promile: number,
  maxPromile = 4
): string {
  if (promile > maxPromile) return `${maxPromile}+ ‰`;
  return `${(Math.round(promile * 100) / 100).toFixed(2)} ‰`;
}

function buildDescription(beers: number, bac: number): string {
  const beersRounded = Math.round(beers * 10) / 10;
  const bacRounded = Math.round(bac * 100) / 100;

  if (beersRounded < 0.3) {
    return "Prakticky nic — tak akorát na chuť.";
  }
  if (beersRounded < 1) {
    return `Tohle odpovídá méně než jednomu pivu. Orientační hladina kolem ${bacRounded} ‰.`;
  }
  if (beersRounded < 2) {
    return `Zhruba jako jedno pivo. Orientační hladina kolem ${bacRounded} ‰.`;
  }
  return `Tohle odpovídá přibližně ${beersRounded} pivům. Orientační hladina alkoholu může být kolem ${bacRounded} ‰.`;
}
