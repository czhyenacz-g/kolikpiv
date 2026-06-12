// Product presets — data model for "Zkus třeba" quick examples and "Překvap mě" surprise picks.
// Affiliate URLs are optional placeholders; add real links when partnerships are confirmed.

export type ProductSourceType = "manual" | "affiliate" | "beer_partner";
export type CommercialIntent = "none" | "possible_affiliate" | "possible_sponsor";

export interface BeerEquivalentOffer {
  affiliateUrl?: string;
  merchantName?: string;
  ctaLabel?: string;
}

export interface ProductPreset {
  id: string;
  slug: string;
  label: string;
  amount: number;
  category: string;
  sourceType: ProductSourceType;
  commercialIntent: CommercialIntent;
  affiliateUrl?: string;
  productUrl?: string;
  beerCartUrl?: string;
  beerEquivalentOffer?: BeerEquivalentOffer;
  imageUrl?: string;
  merchantName?: string;
  ctaLabel?: string;
  note?: string;
  enabled: boolean;
  isDefaultPreset: boolean;
  isSurpriseCandidate: boolean;
}

export const PRODUCT_PRESET_CATEGORIES = [
  { id: "bezny-zivot",         label: "Běžný život" },
  { id: "technika-a-hracky",   label: "Technika a hračky" },
  { id: "auto-a-pokuty",       label: "Auto a pokuty" },
  { id: "vztahy-a-rodina",     label: "Vztahy a rodina" },
  { id: "dovolena-a-zazitky",  label: "Dovolená a zážitky" },
  { id: "bydleni-a-velke-rany",label: "Bydlení a velké rány" },
  { id: "kolik-piv-je",        label: "Kolik piv je…" },
] as const;

export type CategoryId = typeof PRODUCT_PRESET_CATEGORIES[number]["id"];

export const ALL_PRODUCT_PRESETS: ProductPreset[] = [

  // ─── 1. Běžný život ────────────────────────────────────────────────────────
  {
    id: "kebab-po-party", slug: "kebab-po-party",
    label: "kebab po párty", amount: 150,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "taxi-z-vecirku", slug: "taxi-z-vecirku",
    label: "taxi z večírku", amount: 650,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "kafe-a-dortik", slug: "kafe-a-dortik",
    label: "kafe a dortík", amount: 220,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "drahe-obedove-menu", slug: "drahe-obedove-menu",
    label: "drahé obědové menu", amount: 189,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "nakup-v-lidlu", slug: "nakup-v-lidlu",
    label: "nákup v Lidlu", amount: 780,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "rohlik-na-vikend", slug: "rohlik-na-vikend",
    label: "Rohlík na víkend", amount: 1800,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "possible_sponsor",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "zubar-bez-usmevu", slug: "zubar-bez-usmevu",
    label: "zubař bez úsměvu", amount: 3800,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "veterinar-po-ponozce", slug: "veterinar-po-ponozce",
    label: "veterinář po ponožce", amount: 6500,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "oprava-pracky", slug: "oprava-pracky",
    label: "oprava pračky", amount: 4500,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "lednice-po-zaruce", slug: "lednice-po-zaruce",
    label: "lednice po záruce", amount: 12000,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "novy-bojler", slug: "novy-bojler",
    label: "nový bojler", amount: 14000,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "granule-brit-na-rok", slug: "granule-brit-na-rok",
    label: "granule Brit na rok", amount: 12000,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "skolni-vybava", slug: "skolni-vybava",
    label: "školní výbava", amount: 6500,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "nova-matrace", slug: "nova-matrace",
    label: "nová matrace", amount: 16000,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "kotel-v-zime", slug: "kotel-v-zime",
    label: "kotel v zimě", amount: 45000,
    category: "bezny-zivot", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },

  // ─── 2. Technika a hračky ───────────────────────────────────────────────────
  {
    id: "iphone-16e", slug: "iphone-16e",
    label: "iPhone 16e", amount: 13990,
    category: "technika-a-hracky", sourceType: "affiliate", commercialIntent: "possible_affiliate",
    affiliateUrl: "https://www.alza.cz/EN/iphone-16e-128gb-black-d12812524.htm",
    merchantName: "Alza", ctaLabel: "Zobrazit nabídku →",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "samsung-galaxy-s25", slug: "samsung-galaxy-s25",
    label: "Samsung Galaxy S25", amount: 19990,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "playstation-5", slug: "playstation-5",
    label: "PlayStation 5", amount: 11990,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "nintendo-switch-2", slug: "nintendo-switch-2",
    label: "Nintendo Switch 2", amount: 11500,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "pracovni-lenovo-notebook", slug: "pracovni-lenovo-notebook",
    label: "pracovní Lenovo notebook", amount: 24990,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "macbook-air", slug: "macbook-air",
    label: "MacBook Air", amount: 29990,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "apple-watch", slug: "apple-watch",
    label: "Apple Watch", amount: 10990,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "airpods-pro", slug: "airpods-pro",
    label: "AirPods Pro", amount: 5990,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "oprava-displeje", slug: "oprava-displeje",
    label: "oprava displeje", amount: 4000,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "herni-zidle-dxracer", slug: "herni-zidle-dxracer",
    label: "herní židle DXRacer", amount: 7500,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "graficka-karta-rtx", slug: "graficka-karta-rtx",
    label: "grafická karta RTX", amount: 18000,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "delonghi-kavovar", slug: "delonghi-kavovar",
    label: "De'Longhi kávovar", amount: 15000,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "eta-roboticky-vysavac", slug: "eta-roboticky-vysavac",
    label: "ETA robotický vysavač", amount: 8990,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "philips-airfryer", slug: "philips-airfryer",
    label: "Philips Airfryer", amount: 3990,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "domena-dalsiho-napadu", slug: "domena-dalsiho-napadu",
    label: "doména dalšího nápadu", amount: 2000,
    category: "technika-a-hracky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },

  // ─── 3. Auto a pokuty ──────────────────────────────────────────────────────
  {
    id: "dalnicni-znamka", slug: "dalnicni-znamka",
    label: "dálniční známka", amount: 2440,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "stk-a-emise", slug: "stk-a-emise",
    label: "STK a emise", amount: 2500,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "zimni-pneumatiky-barum", slug: "zimni-pneumatiky-barum",
    label: "zimní pneumatiky Barum", amount: 9000,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "nova-autobaterie-varta", slug: "nova-autobaterie-varta",
    label: "nová autobaterie Varta", amount: 3500,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "pokuta-za-rychlost", slug: "pokuta-za-rychlost",
    label: "pokuta za rychlost", amount: 1500,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "modra-zona", slug: "modra-zona",
    label: "modrá zóna", amount: 700,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "telefon-na-semaforu", slug: "telefon-na-semaforu",
    label: "telefon na semaforu", amount: 2500,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "oprava-klimatizace", slug: "oprava-klimatizace",
    label: "oprava klimatizace", amount: 6000,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "servis-po-dovolene", slug: "servis-po-dovolene",
    label: "servis po dovolené", amount: 12000,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "prepis-auta", slug: "prepis-auta",
    label: "přepis auta", amount: 800,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "opel-meriva-2003", slug: "opel-meriva-2003",
    label: "Opel Meriva 2003", amount: 39999,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "felicie-po-dedovi", slug: "felicie-po-dedovi",
    label: "Felicie po dědovi", amount: 25000,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "bazarove-bmw", slug: "bazarove-bmw",
    label: "bazarové BMW", amount: 180000,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "skoda-octavia-ojeta", slug: "skoda-octavia-ojeta",
    label: "Škoda Octavia ojetá", amount: 350000,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "tesla-model-y", slug: "tesla-model-y",
    label: "Tesla Model Y", amount: 1200000,
    category: "auto-a-pokuty", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },

  // ─── 4. Vztahy a rodina ────────────────────────────────────────────────────
  {
    id: "kytka-po-prusvihu", slug: "kytka-po-prusvihu",
    label: "kytka po průšvihu", amount: 890,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "prvni-rande", slug: "prvni-rande",
    label: "první rande", amount: 1800,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "vyroci-na-posledni-chvili", slug: "vyroci-na-posledni-chvili",
    label: "výročí na poslední chvíli", amount: 2500,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "zasnubni-prsten", slug: "zasnubni-prsten",
    label: "zásnubní prsten", amount: 50000,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "svatba-pro-skromne", slug: "svatba-pro-skromne",
    label: "svatba pro skromné", amount: 180000,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "rozlucka-se-svobodou", slug: "rozlucka-se-svobodou",
    label: "rozlučka se svobodou", amount: 12000,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "kocárek-cybex", slug: "kocárek-cybex",
    label: "kočárek Cybex", amount: 22000,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "autosedacka-britax", slug: "autosedacka-britax",
    label: "autosedačka Britax", amount: 7000,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "narozeninova-oslava", slug: "narozeninova-oslava",
    label: "narozeninová oslava", amount: 9000,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "darek-pro-tchyni", slug: "darek-pro-tchyni",
    label: "dárek pro tchýni", amount: 1500,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "rodinny-obed", slug: "rodinny-obed",
    label: "rodinný oběd", amount: 3500,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "skolka-v-prirode", slug: "skolka-v-prirode",
    label: "školka v přírodě", amount: 4500,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "krouzky-na-pololeti", slug: "krouzky-na-pololeti",
    label: "kroužky na pololetí", amount: 6000,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "dovolena-s-detmi", slug: "dovolena-s-detmi",
    label: "dovolená s dětmi", amount: 55000,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "vanoce-pro-rodinu", slug: "vanoce-pro-rodinu",
    label: "Vánoce pro rodinu", amount: 25000,
    category: "vztahy-a-rodina", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },

  // ─── 5. Dovolená a zážitky ─────────────────────────────────────────────────
  {
    id: "vikend-v-praze", slug: "vikend-v-praze",
    label: "víkend v Praze", amount: 8000,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "dovolena-v-chorvatsku", slug: "dovolena-v-chorvatsku",
    label: "dovolená v Chorvatsku", amount: 35000,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "lyze-v-alpach", slug: "lyze-v-alpach",
    label: "lyže v Alpách", amount: 45000,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "festival-colours", slug: "festival-colours",
    label: "festival Colours", amount: 3500,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "possible_sponsor",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "wellness-po-stresu", slug: "wellness-po-stresu",
    label: "wellness po stresu", amount: 9500,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "letenka-ryanair-do-londyna", slug: "letenka-ryanair-do-londyna",
    label: "letenka Ryanair do Londýna", amount: 2800,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "booking-na-vikend", slug: "booking-na-vikend",
    label: "Booking na víkend", amount: 9000,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "airbnb-v-centru", slug: "airbnb-v-centru",
    label: "Airbnb v centru", amount: 12000,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "all-inclusive-bez-all", slug: "all-inclusive-bez-all",
    label: "all inclusive bez all", amount: 42000,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "machac-po-sleve", slug: "machac-po-sleve",
    label: "Mácháč po slevě", amount: 9000,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "stanovani-v-desti", slug: "stanovani-v-desti",
    label: "stanování v dešti", amount: 4500,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "pobyt-v-laznich", slug: "pobyt-v-laznich",
    label: "pobyt v lázních", amount: 18000,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "unikova-hra", slug: "unikova-hra",
    label: "úniková hra", amount: 1800,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "koncert-v-o2", slug: "koncert-v-o2",
    label: "koncert v O2", amount: 3200,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "let-balonem", slug: "let-balonem",
    label: "let balonem", amount: 5500,
    category: "dovolena-a-zazitky", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },

  // ─── 6. Bydlení a velké rány ───────────────────────────────────────────────
  {
    id: "najem-v-praze", slug: "najem-v-praze",
    label: "nájem v Praze", amount: 25000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "kauce-na-byt", slug: "kauce-na-byt",
    label: "kauce na byt", amount: 50000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "gauc-z-ikea", slug: "gauc-z-ikea",
    label: "gauč z IKEA", amount: 28000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "kuchynska-linka-oresi", slug: "kuchynska-linka-oresi",
    label: "kuchyňská linka Oresi", amount: 120000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "malovani-bytu", slug: "malovani-bytu",
    label: "malování bytu", amount: 18000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "ucet-za-energie", slug: "ucet-za-energie",
    label: "účet za energie", amount: 18500,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "hypoteka-mesicne", slug: "hypoteka-mesicne",
    label: "hypotéka měsíčně", amount: 28000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "nova-podlaha", slug: "nova-podlaha",
    label: "nová podlaha", amount: 65000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "rekonstrukce-koupelny", slug: "rekonstrukce-koupelny",
    label: "rekonstrukce koupelny", amount: 180000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "stehovaci-firma", slug: "stehovaci-firma",
    label: "stěhovací firma", amount: 12000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "klimatizace-daikin", slug: "klimatizace-daikin",
    label: "klimatizace Daikin", amount: 35000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "satni-skrin-ikea", slug: "satni-skrin-ikea",
    label: "šatní skříň IKEA", amount: 22000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "jidelni-stul-jysk", slug: "jidelni-stul-jysk",
    label: "jídelní stůl JYSK", amount: 14000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "chytry-termostat", slug: "chytry-termostat",
    label: "chytrý termostat", amount: 4500,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "possible_affiliate",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "oprava-strechy", slug: "oprava-strechy",
    label: "oprava střechy", amount: 250000,
    category: "bydleni-a-velke-rany", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },

  // ─── 7. Kolik piv je… ──────────────────────────────────────────────────────
  {
    id: "prumerna-vyplata", slug: "prumerna-vyplata",
    label: "průměrná výplata", amount: 46200,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "minimalni-mzda", slug: "minimalni-mzda",
    label: "minimální mzda", amount: 20800,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "prumerny-duchod", slug: "prumerny-duchod",
    label: "průměrný důchod", amount: 21000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "rodicovsky-prispevek", slug: "rodicovsky-prispevek",
    label: "rodičovský příspěvek", amount: 350000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "materska-mesicne", slug: "materska-mesicne",
    label: "mateřská měsíčně", amount: 25000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "milion-korun", slug: "milion-korun",
    label: "milion korun", amount: 1000000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "miliarda-korun", slug: "miliarda-korun",
    label: "miliarda korun", amount: 1000000000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "byt-v-praze", slug: "byt-v-praze",
    label: "byt v Praze", amount: 8500000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "hypoteka-na-30-let", slug: "hypoteka-na-30-let",
    label: "hypotéka na 30 let", amount: 10000000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "vyplata-pred-najmem", slug: "vyplata-pred-najmem",
    label: "výplata před nájmem", amount: 46200,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "vyplata-po-najmu", slug: "vyplata-po-najmu",
    label: "výplata po nájmu", amount: 21200,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "prvni-milion", slug: "prvni-milion",
    label: "první milion", amount: 1000000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "rocni-mzda", slug: "rocni-mzda",
    label: "roční mzda", amount: 554400,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "duchod-za-rok", slug: "duchod-za-rok",
    label: "důchod za rok", amount: 252000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
  {
    id: "auto-za-hotove", slug: "auto-za-hotove",
    label: "auto za hotové", amount: 350000,
    category: "kolik-piv-je", sourceType: "manual", commercialIntent: "none",
    enabled: true, isDefaultPreset: false, isSurpriseCandidate: true,
  },
];

// Returns one random preset from each category.
// Call once at component init (useState lazy initializer or useEffect) — never in render.
export function getRandomHomepagePresetsByCategory(): ProductPreset[] {
  return PRODUCT_PRESET_CATEGORIES.map((cat) => {
    const items = ALL_PRODUCT_PRESETS.filter(
      (p) => p.enabled && p.category === cat.id
    );
    if (items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
  }).filter((p): p is ProductPreset => p !== null);
}

// Returns all enabled surprise candidates (pool for "Překvap mě").
export function getSurpriseCandidates(): ProductPreset[] {
  return ALL_PRODUCT_PRESETS.filter((p) => p.enabled && p.isSurpriseCandidate);
}

// Legacy helper — kept for backward compatibility.
export function getDefaultPresets(): ProductPreset[] {
  return ALL_PRODUCT_PRESETS.filter((p) => p.enabled && p.isDefaultPreset);
}
