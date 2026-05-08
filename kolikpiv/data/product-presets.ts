// Product presets — data model for "Zkus třeba" quick examples and "Překvap mě" surprise picks.
// Affiliate URLs are optional placeholders; add real links when partnerships are confirmed.

export type ProductSourceType = "manual" | "affiliate" | "beer_partner";

export interface ProductPreset {
  id: string;
  label: string;
  amount: number;
  category?: string;
  sourceType: ProductSourceType;
  affiliateUrl?: string;
  productUrl?: string;
  beerCartUrl?: string;
  imageUrl?: string;
  merchantName?: string;
  ctaLabel?: string;
  note?: string;
  enabled: boolean;
  isDefaultPreset: boolean;
  isSurpriseCandidate: boolean;
}

// Full product catalog. To add a new item: append to this array and set the flags.
// To show it in the top row: isDefaultPreset: true (keep at most 6 default presets visible).
// To include in "Překvap mě": isSurpriseCandidate: true.
// To temporarily hide without deleting: enabled: false.
export const ALL_PRODUCT_PRESETS: ProductPreset[] = [
  // --- Default presets (currently shown in "Zkus třeba" row) ---
  {
    id: "kebab-po-party",
    label: "kebab po párty",
    amount: 150,
    category: "food",
    sourceType: "manual",
    enabled: true,
    isDefaultPreset: true,
    isSurpriseCandidate: true,
  },
  {
    id: "netflix-na-rok",
    label: "Netflix na rok",
    amount: 1900,
    category: "subscription",
    sourceType: "manual",
    enabled: true,
    isDefaultPreset: true,
    isSurpriseCandidate: true,
  },
  {
    id: "vikend-v-praze",
    label: "víkend v Praze",
    amount: 8000,
    category: "travel",
    sourceType: "manual",
    enabled: true,
    isDefaultPreset: true,
    isSurpriseCandidate: true,
  },
  {
    id: "iphone",
    label: "iPhone",
    amount: 35000,
    category: "electronics",
    sourceType: "manual",
    // affiliateUrl: "", // např. "https://www.alza.cz/iphone?utm_source=kolikpiv"
    enabled: true,
    isDefaultPreset: true,
    isSurpriseCandidate: true,
  },
  {
    id: "zasnubni-prsten",
    label: "zásnubní prsten",
    amount: 50000,
    category: "luxury",
    sourceType: "manual",
    enabled: true,
    isDefaultPreset: true,
    isSurpriseCandidate: true,
  },
  {
    id: "nove-auto",
    label: "nové auto",
    amount: 400000,
    category: "vehicle",
    sourceType: "manual",
    enabled: true,
    isDefaultPreset: true,
    isSurpriseCandidate: false,
  },

  // --- Surprise-only candidates (not in default row, but "Překvap mě" may pick them) ---
  {
    id: "craft-beer-balicek",
    label: "craft beer balíček",
    amount: 800,
    category: "food",
    sourceType: "manual",
    // beerCartUrl: "", // budoucí odkaz na pivní e-shop
    enabled: true,
    isDefaultPreset: false,
    isSurpriseCandidate: true,
  },
  {
    id: "kavovar",
    label: "kávovar",
    amount: 5000,
    category: "appliances",
    sourceType: "manual",
    // affiliateUrl: "", // např. Alza / Heureka
    enabled: true,
    isDefaultPreset: false,
    isSurpriseCandidate: true,
  },
  {
    id: "herni-konzole",
    label: "herní konzole",
    amount: 12000,
    category: "electronics",
    sourceType: "manual",
    // affiliateUrl: "", // např. Datart / Alza
    enabled: true,
    isDefaultPreset: false,
    isSurpriseCandidate: true,
  },
  {
    id: "dovolena",
    label: "dovolená / letenka",
    amount: 25000,
    category: "travel",
    sourceType: "manual",
    enabled: true,
    isDefaultPreset: false,
    isSurpriseCandidate: true,
  },

  // --- Future affiliate products (enabled as placeholder; swap affiliateUrl for real link when ready) ---
  {
    id: "iphone-16",
    label: "iPhone 16",
    amount: 25990,
    category: "electronics",
    sourceType: "affiliate",
    affiliateUrl: "https://www.alza.cz/",   // placeholder — doplnit reálný produktový odkaz
    imageUrl: "/products/iphone-16.jpg",     // placeholder — doplnit reálný obrázek produktu
    merchantName: "Alza",
    ctaLabel: "Zobrazit nabídku →",
    note: "Nahradí 'iPhone' až budou připraveny affiliate odkazy.",
    enabled: true,
    isDefaultPreset: false,
    isSurpriseCandidate: true,
  },
];

export function getDefaultPresets(): ProductPreset[] {
  return ALL_PRODUCT_PRESETS.filter((p) => p.enabled && p.isDefaultPreset);
}

export function getSurpriseCandidates(): ProductPreset[] {
  return ALL_PRODUCT_PRESETS.filter((p) => p.enabled && p.isSurpriseCandidate);
}