# Business model — kolikpiv.cz

## Co je kolikpiv.cz

Meme kalkulačka, která přepočítává ceny věcí na počet piv.
Primárně virální nástroj, sekundárně monetizační platforma.

## Základní pravidlo

**Humor first, affiliate second.**
Web musí pořád působit jako jednoduchý vtipný nástroj, ne jako MFA affiliate katalog.
Affiliate CTA má být maximálně jedno, nebo velmi nenápadné.

---

## Monetizační strategie

### 1. Affiliate produktové presety

Místo náhodných fake příkladů se postupně nasazují reálné produkty s reálnými cenami.
U každého produktu může být affiliate odkaz (Alza, Heureka, Datart apod.).

Příklady budoucích affiliate produktů:
- iPhone 16 → Alza / Heureka
- Herní konzole → Datart / Alza
- Kávovar → různí partneři
- Craft beer balíček → pivní e-shop

### 2. Beer e-shop partnerství

Alternativní CTA místo nebo vedle affiliate odkazu: **"Objednat tolik piv"**.
Ideálně přes pivní e-shop partnera s předvyplněným košíkem.

Technické možnosti pro předvyplněný košík:
- Shopify cart permalink (`/cart/add?id=XXX&quantity=N`)
- Shoptet / WooCommerce add-to-cart endpoint
- Custom endpoint pivotéky: `/kolikpiv?count=545`
- Smart beer bundles (zaokrouhlení na balení místo přesného počtu)

### 3. Shareable produktový obsah

Každý výsledek je shareable: **"iPhone 16 = 545 piv"**
Virální šíření = organický dosah bez nákladů na reklamu.

---

## Technická architektura pro monetizaci

Produktová data jsou v `kolikpiv/data/product-presets.ts`.

Každý produkt podporuje:
- `label` — název zobrazovaný uživateli
- `amount` — cena v CZK
- `category` — kategorie (electronics, food, travel, …)
- `sourceType` — `manual` | `affiliate` | `beer_partner`
- `affiliateUrl?` — volitelný affiliate odkaz
- `productUrl?` — volitelný odkaz na produkt (bez affiliate)
- `beerCartUrl?` — volitelný odkaz na pivní košík
- `note?` — interní poznámka
- `enabled` — zapnutí/vypnutí bez mazání
- `isDefaultPreset` — zobrazit v horní řadě "Zkus třeba"
- `isSurpriseCandidate` — zařadit do "Překvap mě"

### Jak přidat nový affiliate produkt

1. Otevřít `kolikpiv/data/product-presets.ts`
2. Přidat nový objekt do `ALL_PRODUCT_PRESETS`
3. Vyplnit `affiliateUrl` reálným odkazem s UTM parametry
4. Nastavit `sourceType: "affiliate"`, `enabled: true`
5. Případně nastavit `isDefaultPreset: true` (max 6 v horní řadě) nebo `isSurpriseCandidate: true`

---

## Co zatím neděláme

- Žádný backend ani databáze — vše je statické
- Žádné agresivní bannery ani pop-upy
- Žádná reklama třetích stran (AdSense apod.)
- Žádný paywall

---

## Prioritizace

1. Udržovat virální a humorný charakter webu
2. Postupně nahrazovat fake příklady reálnými produkty
3. Prověřit affiliate programy (Alza, Heureka, Datart)
4. Najít pivního e-shop partnera pro "objednat tolik piv" CTA
5. Testovat, která CTA konvertuje, aniž by poškodila UX
