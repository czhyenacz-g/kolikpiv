# PWA ikonky — Kolik piv to je?

## Soubory v `public/`

**Stav:** všechny ikonky jsou doplněny. Zdroj: `app/icon.svg` (pivní sklenička, amber/zlatá na tmavém pozadí).
Lze nahradit finálním logem — stačí přepsat PNG soubory stejných rozměrů.

## Specifikace souborů

| Soubor | Rozměr | Účel |
|---|---|---|
| `icon-192.png` | 192×192 px | Android home screen, PWA manifest |
| `icon-512.png` | 512×512 px | Android splash screen, PWA manifest |
| `icon-maskable-512.png` | 512×512 px | Android adaptivní ikona — logo na 60 % plochy, padding ~20 % |
| `apple-touch-icon.png` | 180×180 px | iOS home screen (Safari „Přidat na plochu") |

### Poznámky k maskable ikoně
- Bezpečná zóna: obsah musí být v kruhu o průměru ~80 % šířky obrázku
- `icon-maskable-512.png` má logo na ~60 % plochy (padding ~20 % na každé straně) — bezpečné pro libovolný Android ořez
- Pozadí: `#0d1520` (tmavá, odpovídá tématu webu)
- Offline režim není součástí této změny (žádný service worker)

---

## Jak přidat Kolik piv na plochu

### iOS (Safari)
1. Otevři **kolikpiv.cz** v Safari
2. Klepni na tlačítko **Sdílet** (čtverec se šipkou nahoru) ve spodní liště
3. Vyber **„Přidat na plochu"**
4. Potvrď název a klepni **Přidat**

### Android (Chrome)
1. Otevři **kolikpiv.cz** v Chrome
2. Chrome sám nabídne banner **„Přidat na plochu"** — klepni na něj
3. Nebo: menu ⋮ (vpravo nahoře) → **„Přidat na plochu"** / **„Nainstalovat aplikaci"**
4. Potvrď

---

## Technická implementace

- `app/manifest.ts` — Next.js App Router manifest route (`/manifest.webmanifest`)
- `app/layout.tsx` — `apple-touch-icon`, `appleWebApp`, `themeColor`, `Viewport`
- Žádný service worker — offline režim není implementován
