export interface SeoExample {
  slug: string;
  h1: string;
  title: string;
  description: string;
  amount: number;
  beerPrice: number;
  humanText: string;
  relatedSlugs: [string, string, string];
}

export const SEO_EXAMPLES: SeoExample[] = [
  {
    slug: "kolik-piv-je-100-kc",
    h1: "Kolik piv je 100 Kč?",
    title: "Kolik piv je 100 Kč? | Kolikpiv.cz",
    description: "Za 100 Kč koupíš 2 piva v hospodě. Zjisti, kolik piv stojí cokoliv na kolikpiv.cz.",
    amount: 100,
    beerPrice: 50,
    humanText: "Stovka. Dvě piva. Ani se pořádně nerozmluvíš, a je konec. Ale začít se musí odněkud.",
    relatedSlugs: ["kolik-piv-je-500-kc", "kolik-piv-je-1000-kc", "kolik-piv-stoji-kebab"],
  },
  {
    slug: "kolik-piv-je-500-kc",
    h1: "Kolik piv je 500 Kč?",
    title: "Kolik piv je 500 Kč? | Kolikpiv.cz",
    description: "Za 500 Kč koupíš 10 piv v hospodě. Přepočítej jakoukoli částku na piva na kolikpiv.cz.",
    amount: 500,
    beerPrice: 50,
    humanText: "Pětistovka jsou 10 piv. To je solidní základ na večer — Švejk by souhlasil.",
    relatedSlugs: ["kolik-piv-je-100-kc", "kolik-piv-je-1000-kc", "kolik-piv-stoji-kebab"],
  },
  {
    slug: "kolik-piv-je-1000-kc",
    h1: "Kolik piv je 1000 Kč?",
    title: "Kolik piv je 1000 Kč? | Kolikpiv.cz",
    description: "Za 1 000 Kč koupíš 20 piv — celou basu. Zjisti kolik piv stojí cokoliv na kolikpiv.cz.",
    amount: 1000,
    beerPrice: 50,
    humanText: "Tisícovka je přesně basa. 20 piv. Na to se dá zařídit slušný večer i s přáteli.",
    relatedSlugs: ["kolik-piv-je-500-kc", "kolik-piv-je-10000-kc", "kolik-piv-stoji-vikend-v-praze"],
  },
  {
    slug: "kolik-piv-je-10000-kc",
    h1: "Kolik piv je 10 000 Kč?",
    title: "Kolik piv je 10 000 Kč? | Kolikpiv.cz",
    description: "Za 10 000 Kč koupíš 200 piv — 10 basů. Přepočítej cokoliv na piva na kolikpiv.cz.",
    amount: 10000,
    beerPrice: 50,
    humanText: "Deset tisíc jsou dvě stě piv. Nebo deset basů. Záleží, jak se na to díváš.",
    relatedSlugs: ["kolik-piv-je-1000-kc", "kolik-piv-stoji-iphone", "kolik-piv-stoji-zasnubni-prsten"],
  },
  {
    slug: "kolik-piv-stoji-iphone",
    h1: "Kolik piv stojí iPhone?",
    title: "Kolik piv stojí iPhone? | Kolikpiv.cz",
    description: "iPhone za 35 000 Kč jsou 700 piv. Přepočítej cenu čehokoliv na piva na kolikpiv.cz.",
    amount: 35000,
    beerPrice: 50,
    humanText: "Sedm set piv. Nebo jeden iPhone. Švejk by se nad tím zamyslel — a pak si dal pivo.",
    relatedSlugs: ["kolik-piv-stoji-zasnubni-prsten", "kolik-piv-stoji-auto", "kolik-piv-je-10000-kc"],
  },
  {
    slug: "kolik-piv-stoji-netflix",
    h1: "Kolik piv stojí Netflix na rok?",
    title: "Kolik piv stojí Netflix na rok? | Kolikpiv.cz",
    description: "Roční Netflix za 1 900 Kč jsou 38 piv. Zjisti, kolik piv stojí tvé předplatné na kolikpiv.cz.",
    amount: 1900,
    beerPrice: 50,
    humanText: "Roční Netflix za 1 900 Kč jsou 38 piv. Piva si pamatuješ líp — a nepotřebuješ heslo.",
    relatedSlugs: ["kolik-piv-stoji-iphone", "kolik-piv-stoji-vikend-v-praze", "kolik-piv-je-1000-kc"],
  },
  {
    slug: "kolik-piv-stoji-auto",
    h1: "Kolik piv stojí auto?",
    title: "Kolik piv stojí auto? | Kolikpiv.cz",
    description: "Auto za 300 000 Kč jsou 6 000 piv. Přepočítej cenu auta i čehokoliv jiného na piva.",
    amount: 300000,
    beerPrice: 50,
    humanText: "Šest tisíc piv. Tři sta basů. Na to by se dalo cestovat autobusem věčně — a ještě by zbylo.",
    relatedSlugs: ["kolik-piv-stoji-iphone", "kolik-piv-stoji-zasnubni-prsten", "kolik-piv-je-10000-kc"],
  },
  {
    slug: "kolik-piv-stoji-zasnubni-prsten",
    h1: "Kolik piv stojí zásnubní prsten?",
    title: "Kolik piv stojí zásnubní prsten? | Kolikpiv.cz",
    description: "Zásnubní prsten za 50 000 Kč jsou 1 000 piv. Kolik piv stojí tvůj? Zjisti na kolikpiv.cz.",
    amount: 50000,
    beerPrice: 50,
    humanText: "Tisíc piv. Nebo zásnubní prsten. Jedno z toho stojí za to — záleží na prioritách.",
    relatedSlugs: ["kolik-piv-stoji-iphone", "kolik-piv-stoji-auto", "kolik-piv-stoji-vikend-v-praze"],
  },
  {
    slug: "kolik-piv-stoji-kebab",
    h1: "Kolik piv stojí kebab?",
    title: "Kolik piv stojí kebab? | Kolikpiv.cz",
    description: "Kebab za 150 Kč jsou 3 piva. Zjisti, kolik piv stojí tvoje oblíbená jídla na kolikpiv.cz.",
    amount: 150,
    beerPrice: 50,
    humanText: "Kebab po párty za 150 Kč jsou 3 piva. Pikantní propočet — ale taky pikantní kebab.",
    relatedSlugs: ["kolik-piv-je-100-kc", "kolik-piv-je-500-kc", "kolik-piv-stoji-vikend-v-praze"],
  },
  {
    slug: "kolik-piv-stoji-vikend-v-praze",
    h1: "Kolik piv stojí víkend v Praze?",
    title: "Kolik piv stojí víkend v Praze? | Kolikpiv.cz",
    description: "Víkend v Praze za 8 000 Kč jsou 160 piv. Kolik piv stojí tvoje dovolená? Zjisti na kolikpiv.cz.",
    amount: 8000,
    beerPrice: 50,
    humanText: "Víkend v Praze za 8 000 Kč jsou 160 piv. Praha je krásná — ale to jsou taky pěkný peníze.",
    relatedSlugs: ["kolik-piv-stoji-netflix", "kolik-piv-stoji-zasnubni-prsten", "kolik-piv-je-1000-kc"],
  },
];

export function getExample(slug: string): SeoExample | undefined {
  return SEO_EXAMPLES.find((e) => e.slug === slug);
}

export function getBeerWord(count: number): string {
  if (count === 1) return "pivo";
  if (count >= 2 && count <= 4) return "piva";
  return "piv";
}
