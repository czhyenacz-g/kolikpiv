"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { track } from "@vercel/analytics";
import { GOATCOUNTER_CODE } from "../config/analytics";
import {
  type ProductPreset,
  getDefaultPresets,
  getSurpriseCandidates,
} from "../../data/product-presets";

// Hero taglines - rotating subtitle under the main title
const HERO_TAGLINES = [
  "Přepočítej si každou blbost na piva.",
  "Kolik to stojí? Teď to uvidíš v pivech.",
  "Realita v pivech bolí víc. Přepočítej si ji na piva 🍺",
  "Chceš jí něco koupit? Možná si to po přepočtu rozmyslíš.",
  "Každá cena se dá vysvětlit v pivech.",
  "Zjisti, kolik piv za to vlastně je.",
];

// Fun messages for different beer count ranges
// === STARÁ SÉRIE (nepoužívá se) ===
const OLD_LOW_MESSAGES = [
  "Pár piv?\nTo ještě nic neznamená.\nTo se člověk ani nestihne ztratit.",
  "Pár piv?\nTo se teprve začíná mluvit.\nA ještě se všemu věří.",
  "Pár piv?\nTo bych ani nepočítal.\nTo je spíš na rozehřátí debaty.",
  "To bych vůbec neřešil, pane.\nTo se vypije, ani člověk neví jak.\nA ještě má chuť na jedno.\n— Švejk",
  "To je tak akorát, aby se člověk rozkoukal.\nPak teprve začne přemýšlet, co dál.\nA většinou už nepřestane.\n— Švejk",
  "To je takový zahřívací kolo.\nČlověk si řekne, že skončí.\nA pak to stejně nedopadne.\n— Švejk",
  "To bych ještě nějak uhradil, pane.\nKdyžtak se to zapomene.\nA když ne, tak se to vysvětlí.\n— Švejk",
  "To není tak hrozný.\nTo se dá obejít.\nNebo aspoň odložit.\n— Švejk",
  "Na to bych ještě měl.\nA kdyby ne, tak bych si poradil.\nTo se člověk vždycky nějak zařídí.\n— Švejk",
];
const OLD_MEDIUM_MESSAGES = [
  "Pár desítek piv?\nTo už není náhoda.\nTo už si něco vybíráš.",
  "Pár desítek piv?\nTo už se řeči začnou motat.\nA pravda se říká snáz.",
  "Pár desítek piv?\nTo už se něco domluví.\nA ráno se uvidí co.",
  "To už je, pane, slušnej základ.\nNa tom se dá stavět.\nA taky se na tom většinou staví blbě.\n— Švejk",
  "To už bych bral vážně.\nTady už se dělají rozhodnutí.\nA ráno se zase ruší.\n— Švejk",
  "To už není jen tak na chuť.\nTo už je na delší sezení.\nA někdy i na delší následky.\n— Švejk",
  "To už je, pane, trochu problém.\nAle nic, co by se nedalo vysvětlit.\nČlověk musí mluvit přesvědčivě.\n— Švejk",
  "To už bych si rozmyslel.\nAle když už je to spočítaný,\ntak se s tím musí něco udělat.\n— Švejk",
  "Na to už úplně nemám.\nAle znám lidi, co by měli.\nA když ne, tak se to odloží.\n— Švejk",
];
const OLD_HIGH_MESSAGES = [
  "Tolik piv?\nTo už není večer.\nTo už je rozhodnutí, které tě chvíli bude stát.",
  "Tolik piv?\nTo už se večer rozplyne.\nA zůstane jen to, co si kdo zapamatuje po svém.",
  "Tolik piv?\nTo už by chtělo plán.\nA pak ho stejně nedodržet.",
  "To už je, pane, regulérní akce.\nTady už se nikam nespěchá.\nA taky se většinou nikam nedojde.\n— Švejk",
  "To už je na basu.\nA když je basa, tak je i důvod.\nA když není, tak se najde.\n— Švejk",
  "To už bych si rozmyslel.\nAle ono je to stejně jedno.\nJakmile se začne, tak se pokračuje.\n— Švejk",
  "To už je, pane, na pováženou.\nTo bych asi zaplatil jen napůl.\nA zbytek bych nechal osudu.\n— Švejk",
  "Na tohle bych neměl ani kdybych chtěl.\nAle chtít je důležitý.\nTo se počítá.\n— Švejk",
  "To už bych radši neviděl.\nKdyž člověk neví, kolik to stojí,\nžije se mu líp.\n— Švejk",
];
const OLD_EXTREME_MESSAGES = [
  "Tolik piv?\nTo už není o pití.\nTo už je způsob, jak na chvíli zmizet.",
  "Tolik piv?\nTo už se člověk ztratí někde mezi řečí a ránem.\nA ani neví kde.",
  "Tolik piv?\nTo už by se mělo nejdřív probrat.\nAle nejspíš se to stejně jen zapije.",
  "To už je, pane, podnik.\nNa to by měl být plán.\nAle většinou se to řeší za pochodu.\n— Švejk",
  "To už není pití.\nTo už je program na celej den.\nA někdy i na celej další.\n— Švejk",
  "To už se člověk dostane do stavu,\nkdy ví všechno nejlíp.\nA pak si nepamatuje nic.\n— Švejk",
  "To už je, pane, situace.\nNa to by musel být rozpočet.\nA ten já nemám.\n— Švejk",
  "Tohle už bych nezaplatil.\nAle mohl bych o tom dlouho mluvit.\nA to někdy stačí.\n— Švejk",
  "To už je částka, co se neřeší.\nTo se přechází mlčením.\nA rychlým odchodem.\n— Švejk",
];
const OLD_ULTRA_MESSAGES = [
  "Tolik piv?\nTo už není večer.\nTo už je život, který se na chvíli rozpadne.",
  "Tolik piv?\nTo už není o pivu.\nTo už je o tom, co si u toho všechno řeknete,\na co si radši nepamatujete.",
  "Tolik piv?\nTo už není otázka žízně.\nTo už je otázka charakteru.",
  "To už je, pane, záležitost.\nTo už by chtělo povolení.\nA nebo aspoň svědky.\n— Švejk",
  "To už není o žízni.\nTo už je o vytrvalosti.\nA ta bývá krátká.\n— Švejk",
  "To už bych nedoporučoval.\nAle kdo jsem já, abych do toho mluvil.\nKaždej má svůj způsob, jak na to.\n— Švejk",
  "To už je, pane, mimo moje možnosti.\nTo bych musel být někdo jinej.\nA to já nejsem.\n— Švejk",
  "Tohle už není na zaplacení.\nTo je na přehodnocení života.\nA směru.\n— Švejk",
  "To už bych ani nepočítal.\nKdyž člověk neví,\nkolik nemá, je mu líp.\n— Švejk",
];

// === NOVÁ SÉRIE ===
const LOW_MESSAGES = [
  "V hospodě U Kalicha se vždycky všechno dozvědělo dřív než na úřadech. Stačilo si dát jedno pivo a hned bylo jasný, jak se věci mají.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Po pár pivech se lidi vždycky líp domluví. Každej má pravdu a nikdo se nehádá, protože se to tak nějak rozplyne.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Jedno pivo ještě nic neznamená. To si člověk jen srovná myšlenky, aby věděl, co vlastně chtěl říct.\n— Osudy dobrého vojáka Švejka, díl 1",
  "V hospodě je to jednoduchý, pane. Co se řekne u piva, to se bere vážně, dokud se nevypije další.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Když si člověk dá pár piv, tak všechno vypadá jasnější. Akorát že pak si nikdo nepamatuje proč.\n— Osudy dobrého vojáka Švejka, díl 1",
  "U Kalicha se vždycky našel někdo, kdo věděl víc než ostatní. A po třetím pivu věděli všichni všechno.\n— Osudy dobrého vojáka Švejka, díl 1",
  "To není opilost, pane, to je jen lepší nálada. Člověk pak řekne věci, co by jinak neřekl.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Po pivu se všechno vysvětluje snáz. Akorát že někdy se vysvětlí i to, co vůbec nebylo potřeba.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Já jsem si dal jen pár piv, pane. To člověk ani nepozná, že už něco říká jinak, než chtěl.\n— Osudy dobrého vojáka Švejka, díl 1",
  "V hospodě se vždycky začne mluvit o něčem jiným, než kvůli čemu tam člověk přišel. A nakonec se to stejně nedořeší.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Po druhým pivu už si lidi tykají. Po třetím si rozumějí. A po čtvrtým si myslí, že si rozumějí.\n— Osudy dobrého vojáka Švejka, díl 1",
  "U piva se všechno zdá jednodušší. Člověk má plán, který by za střízliva nikdy nevymyslel.\n— Osudy dobrého vojáka Švejka, díl 1",
  "To se jen tak řeklo, pane. U piva se říká spousta věcí, co se pak berou zpátky.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Já jsem nic nepopletl, pane. Jen jsem to řekl jinak, než jsem to myslel.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Když se sedí u piva, tak čas běží jinak. Člověk si myslí, že je chvíli, a jsou z toho hodiny.\n— Osudy dobrého vojáka Švejka, díl 1",
  "To byla jen řeč u piva. Takový řeči se nepočítají, protože by jich bylo moc.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Po pár pivech se člověk vždycky domluví. Jenom neví s kým a na čem.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Já jsem to nemyslel zle, pane. To jen tak vyšlo, jak jsme seděli u piva.\n— Osudy dobrého vojáka Švejka, díl 1",
  "V hospodě se všechno vyřeší, nebo aspoň odloží. A to je někdy to samý.\n— Osudy dobrého vojáka Švejka, díl 1",
  "Člověk jde na jedno pivo a skončí u debaty, která nemá konec. A to je na tom to nejlepší.\n— Osudy dobrého vojáka Švejka, díl 1",
];

const MEDIUM_MESSAGES = [
  "Člověk si myslí, že má všechno pod kontrolou. A zatím se to pomalu sype, jen to ještě není vidět.\n— Osudy dobrého vojáka Švejka, díl 3",
  "Po pár pivech se všechno zdá jednodušší. Akorát že pak přijde chvíle, kdy se to musí udělat, a to už tak jednoduchý není.\n— Osudy dobrého vojáka Švejka, díl 3",
  "My jsme si to vždycky nejdřív vysvětlili mezi sebou. A pak jsme zjistili, že tomu nerozumí nikdo.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už je takovej stav, kdy člověk ví, co chce říct, ale říká něco úplně jinýho. A všichni ostatní jsou na tom stejně.\n— Osudy dobrého vojáka Švejka, díl 3",
  "Jakmile se začne moc vysvětlovat, tak se to zamotá. A pak už se to nedá rozmotat ani za střízliva.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už není jen řeč u piva. To už se podle toho začíná jednat, a to bývá ten problém.\n— Osudy dobrého vojáka Švejka, díl 3",
  "Každej měl svůj plán, jak to udělat správně. A právě proto se to nepovedlo.\n— Osudy dobrého vojáka Švejka, díl 3",
  "Člověk si myslí, že ví, co dělá. A pak se ukáže, že to ví úplně někdo jinej.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už je takovej okamžik, kdy se nikdo nepřizná, že něco neví. A tím pádem to neví vůbec nikdo.\n— Osudy dobrého vojáka Švejka, díl 4",
  "My jsme si byli jistý, že to máme správně. A právě to byla ta chyba.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už se nedá vzít zpátky, pane. Jakmile se něco řekne a udělá, tak to běží dál samo.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Každej tomu rozuměl po svým. A tím pádem tomu nerozuměl nikdo pořádně.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už není taková legrace, jak to vypadalo na začátku. Ale ještě se tomu pořád někdo směje.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Člověk si myslí, že to zvládne. A pak zjistí, že to zvládá jen tak tak.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už je takovej stav, kdy se všechno zdá správně. A právě proto je to špatně.\n— Osudy dobrého vojáka Švejka, díl 4",
  "My jsme to chtěli udělat co nejlíp. A dopadlo to jako vždycky.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už se nedá vysvětlit jednou větou. A když se to vysvětluje víc, tak to nikdo neposlouchá.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Člověk si myslí, že má čas to napravit. A pak zjistí, že už je pozdě.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už není o tom, co je pravda. To je o tom, co se komu zdá pravda.\n— Osudy dobrého vojáka Švejka, díl 3",
  "Všichni jsme věděli, že to nedopadne dobře. Ale stejně jsme pokračovali.\n— Osudy dobrého vojáka Švejka, díl 4",
];
const HIGH_MESSAGES = [
  "To už je takovej stav, kdy člověk jde, ani neví kam. A přesto má pocit, že jde správně.\n— Osudy dobrého vojáka Švejka, díl 3",
  "My jsme šli kupředu, protože nám to bylo nařízeno. A nikdo se neptal, jestli to má smysl.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už není otázka rozumu, pane. To už je jen otázka, jak dlouho to ještě vydrží.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Každej věděl, že je to špatně. Ale nikdo nevěděl, jak to udělat líp.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už se nedá vrátit zpátky. Jakmile se jednou vyjde, tak se jde pořád dál.\n— Osudy dobrého vojáka Švejka, díl 3",
  "My jsme se domluvili, že to uděláme správně. A právě tím jsme to pokazili.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už není o tom, co chce člověk. To už je o tom, co se stane.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Člověk si myslí, že to zvládne. A pak už jen doufá, že to nějak dopadne.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už se nikdo nesnaží chápat. Každej jen dělá, co se mu řekne, a čeká, co bude.\n— Osudy dobrého vojáka Švejka, díl 4",
  "My jsme šli pořád dál, i když jsme nevěděli proč. A právě proto jsme tam došli.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už není legrace, jak se to zdálo na začátku. Ale pořád se tomu někdo směje.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Každej měl jiný rozkaz, a všichni ho plnili. A tím pádem se nestalo nic, co mělo.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už není o tom, co je správně. To už je o tom, co se udělá.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Člověk si říká, že se to nějak vysvětlí. A pak zjistí, že už není komu.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už není otázka času, pane. To už je otázka, kdy to skončí.\n— Osudy dobrého vojáka Švejka, díl 4",
  "My jsme to dělali tak dlouho, až to začalo dávat smysl. A to byl ten největší problém.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už není stav, kdy se rozhoduje. To už je stav, kdy se pokračuje.\n— Osudy dobrého vojáka Švejka, díl 3",
  "Každej si myslel, že to chápe. A tím pádem to nechápal nikdo.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už se nedá zastavit. To už se jen sleduje, jak to dopadne.\n— Osudy dobrého vojáka Švejka, díl 4",
  "My jsme věděli, že to nedává smysl. Ale to nám nijak nepomohlo.\n— Osudy dobrého vojáka Švejka, díl 3–4",
];
const EXTREME_MESSAGES = [
  "Tohle už člověk sám nezvládne, pane. Na to by muselo bejt víc lidí, a i tak by to bylo málo.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Já bych to klidně udělal, ale na to nestačím. A kdo by na to stačil, ten tu zrovna není.\n— Osudy dobrého vojáka Švejka, díl 3–4",
  "To už není práce pro jednoho. To už je věc, která se dělá hromadně, a i tak se nepovede.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Člověk si myslí, že to zvládne. A pak zjistí, že na to nestačí ani kdyby chtěl.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Na tohle by musel mít člověk víc sil, než má. A ty se nikde nevydávají.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už není o tom, jestli se chce. To už je o tom, že to nejde.\n— Osudy dobrého vojáka Švejka, díl 4",
  "My jsme si mysleli, že to nějak zvládneme. Ale ono se to zvládnout nedalo.\n— Osudy dobrého vojáka Švejka, díl 3",
  "To už by člověk potřeboval pomoct. A právě když ji potřebuje, tak žádná není.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Já bych do toho šel, pane. Ale musel by tam jít někdo se mnou, a ten se nenašel.\n— Osudy dobrého vojáka Švejka, díl 3–4",
  "To už není taková věc, co se udělá jen tak. To už je věc, co se neudělá vůbec.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Na tohle nestačí jeden člověk. A když je jich víc, tak se to ještě víc pokazí.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už je nad moje možnosti, pane. Já bych to zkusil, ale dopadlo by to špatně.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Člověk by potřeboval pomoct. A místo toho dostane rozkaz.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už není úkol, to je trest. A ještě k tomu takovej, co se nedá splnit.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Já bych to rád udělal správně. Ale na to bych musel bejt někdo jinej.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Tohle už není pro jednotlivce. To už je věc, co se prostě stane, a člověk u toho jen stojí.\n— Osudy dobrého vojáka Švejka, díl 4",
  "My jsme se snažili, pane. Ale ono to nešlo, ani když jsme se snažili víc.\n— Osudy dobrého vojáka Švejka, díl 3",
  "Na tohle by musel mít člověk jiný podmínky. A ty tady zrovna nejsou.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už není otázka snahy. To už je otázka, kdy se to celé rozpadne.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Člověk by to chtěl zvládnout. Ale některý věci jsou větší než on.\n— Osudy dobrého vojáka Švejka, díl 4",
];
const ULTRA_MESSAGES = [
  "Tohle už není pití, pane. To už je rozhodnutí, který člověk udělá, a pak se diví, jak se to stalo.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Když se to vezme takhle z gruntu, tak je to vlastně začátek něčeho novýho. Akorát že nikdo neví čeho.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už není na jednoho člověka. To už se děje samo, jako když začne válka.\n— Osudy dobrého vojáka Švejka, díl 3–4",
  "Člověk si myslí, že má všechno pod kontrolou. A pak přijde chvíle, kdy se to všechno rozhodne za něj.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Tohle už není jen takovej večer. To už je událost, na kterou se bude vzpomínat, i když nikdo nebude vědět proč.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už je, pane, skoro jako svatba. Všichni jsou u toho a nikdo pořádně neví, co se vlastně slaví.\n— Osudy dobrého vojáka Švejka, díl 3",
  "Když se to takhle rozjede, tak už to nejde zastavit. To je jako válka, ta se taky nerozjíždí pomalu.\n— Osudy dobrého vojáka Švejka, díl 3–4",
  "To už není o tom, kolik toho člověk zvládne. To už je o tom, co všechno přežije.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Tohle už není ani legrace, ani problém. To už je stav, ve kterým se člověk prostě ocitne.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už je taková věc, co se zapíše do života. A někdy i do úmrtního listu.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už není rozhodnutí, co by se dělalo rozumem. To už je něco, co se prostě stane.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Člověk si myslí, že to skončí. A zatím to teprve začíná.\n— Osudy dobrého vojáka Švejka, díl 3–4",
  "To už není ani chyba, ani smůla. To už je takovej běh věcí, co se nedá zastavit.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Tohle už je, pane, záležitost, která má následky. A ty se nedají vzít zpátky.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už není jen na vyprávění. To už je na to, aby se o tom mlčelo.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Tohle už je tak velký, že to přesahuje člověka. A ten se v tom jen veze.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Když se to vezme kolem a kolem, tak je to vlastně jednoduchý. Jenom to nikdo nechápe.\n— Osudy dobrého vojáka Švejka, díl 4",
  "To už není ani začátek, ani konec. To už je něco mezi, kde se všechno děje najednou.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Tohle už je, pane, věc, co se nedá vysvětlit. A právě proto se o ní mluví nejvíc.\n— Osudy dobrého vojáka Švejka, díl 4",
  "Člověk by řekl, že tohle už je konec. A zatím je to jen další začátek.\n— Osudy dobrého vojáka Švejka, díl 4",
];

const LAST_UPDATED = "26. 3. 2026";

const MESSAGE_CATS: Record<string, string[]> = {
  u: ULTRA_MESSAGES,
  l: LOW_MESSAGES,
  m: MEDIUM_MESSAGES,
  h: HIGH_MESSAGES,
  e: EXTREME_MESSAGES,
};

const getCatForBeers = (beers: number): string => {
  if (beers > 100) return "u";
  if (beers <= 5) return "l";
  if (beers <= 20) return "m";
  if (beers <= 60) return "h";
  return "e";
};

const getMessageById = (id: string): string | null => {
  const [cat, idxStr] = id.split("_");
  const idx = parseInt(idxStr);
  return MESSAGE_CATS[cat]?.[idx] ?? null;
};

const getRandomMessageWithId = (beers: number, excludeId?: string): { message: string; msgId: string } => {
  const cat = getCatForBeers(beers);
  const messages = MESSAGE_CATS[cat];
  const excludeIdx = excludeId?.startsWith(cat + "_") ? parseInt(excludeId.split("_")[1]) : -1;
  const available = messages.map((_, i) => i).filter(i => i !== excludeIdx);
  const idx = available[Math.floor(Math.random() * available.length)];
  return { message: messages[idx], msgId: `${cat}_${idx}` };
};

const getBeerWord = (count: number): string => {
  if (count === 1) return "pivo";
  if (count >= 2 && count <= 4) return "piva";
  return "piv";
};

const getDonationAmount = (beerPrice: number): number => {
  if (!beerPrice || beerPrice < 50) return 50;
  if (beerPrice > 2000) return 2000;
  return Math.floor(beerPrice);
};

interface BeerDeal {
  id: string;
  name: string;
  icon?: string;
  pricePerPiece: number;
  shop: string;
  url?: string;
  isBestDeal?: boolean;
}

export default function CalculatorClient({ beerDeals }: { beerDeals: BeerDeal[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [price, setPrice] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [beerPrice, setBeerPrice] = useState<string>("50");
  const [monthlyWage, setMonthlyWage] = useState<string>("35000");
  const [beersPerEvening, setBeersPerEvening] = useState<string>("5");
  const [recalcFlash, setRecalcFlash] = useState<boolean>(false);
  const [result, setResult] = useState<{ beers: number; hours: number; message: string; msgId: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [qrDownloadMessage, setQrDownloadMessage] = useState<string>("");
  const [copyLinkMessage, setCopyLinkMessage] = useState<string>("");
  const [heroTagline, setHeroTagline] = useState<string>(HERO_TAGLINES[0]);
  const [selectedPreset, setSelectedPreset] = useState<ProductPreset | null>(null);

  const qrRef = useRef<HTMLDivElement>(null);
  const hasInitializedFromUrl = useRef(false);
  const [visitorCount, setVisitorCount] = useState<string | null>(null);

  // Set random tagline after mount to avoid hydration mismatch
  useEffect(() => {
    const randomTagline = HERO_TAGLINES[Math.floor(Math.random() * HERO_TAGLINES.length)];
    setHeroTagline(randomTagline);
  }, []);

  // Load from URL query params and localStorage on mount
  useEffect(() => {
    // First, try to load from localStorage
    const savedBeerPrice = localStorage.getItem("beerPrice");
    const savedMonthlyWage = localStorage.getItem("monthlyWage");

    // Read query params
    const urlPrice = searchParams.get("price");
    const urlBeerPrice = searchParams.get("beerPrice");
    const urlSalary = searchParams.get("salary");
    const urlMsg = searchParams.get("msg");

    // Set values, prioritizing URL params over localStorage
    if (urlBeerPrice && !isNaN(parseFloat(urlBeerPrice))) {
      setBeerPrice(urlBeerPrice);
    } else if (savedBeerPrice) {
      setBeerPrice(savedBeerPrice);
    }

    if (urlSalary && !isNaN(parseFloat(urlSalary))) {
      setMonthlyWage(urlSalary);
    } else if (savedMonthlyWage) {
      setMonthlyWage(savedMonthlyWage);
    }

    // Initialize price and result from URL only once — subsequent router.replace calls
    // update URL but must not overwrite the user's manually edited price or current result.
    if (!hasInitializedFromUrl.current && urlPrice && !isNaN(parseFloat(urlPrice))) {
      hasInitializedFromUrl.current = true;
      setPrice(urlPrice);

      // Auto-calculate if we have all params
      const priceNum = parseFloat(urlPrice);
      const beerPriceNum = parseFloat(urlBeerPrice || savedBeerPrice || "50");
      const monthlyWageNum = parseFloat(urlSalary || savedMonthlyWage || "35000");

      if (!isNaN(priceNum) && !isNaN(beerPriceNum) && !isNaN(monthlyWageNum)) {
        const beers = Math.floor(priceNum / beerPriceNum);
        const hourlyWage = monthlyWageNum / 168;
        const hours = parseFloat((priceNum / hourlyWage).toFixed(1));
        const fromUrl = urlMsg ? getMessageById(urlMsg) : null;
        const { message, msgId } = fromUrl
          ? { message: fromUrl, msgId: urlMsg! }
          : getRandomMessageWithId(beers);

        setResult({ beers, hours, message, msgId });
        setShowResult(true);
      }
    }
  }, [searchParams]);

  // Fetch public visitor count from GoatCounter
  useEffect(() => {
    if (!GOATCOUNTER_CODE) return;
    fetch(`https://${GOATCOUNTER_CODE}.goatcounter.com/counter/%2F.json`)
      .then((r) => r.json())
      .then((data) => setVisitorCount(data.count))
      .catch(() => {});
  }, []);

  // Track QR section shown
  useEffect(() => {
    if (result && result.beers >= 20) {
      track("qr_section_shown", { beers: result.beers });
    }
  }, [result]);

  // Track deals section shown
  useEffect(() => {
    const totalPrice = parseFloat(price);
    if (result && totalPrice > 0) {
      track("deals_shown", { totalPrice });
    }
  }, [result, price]);

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("beerPrice", beerPrice);
  }, [beerPrice]);

  useEffect(() => {
    localStorage.setItem("monthlyWage", monthlyWage);
  }, [monthlyWage]);

  // Auto-recalculate when inputs change (only if result already exists)
  useEffect(() => {
    if (!result) return;
    const priceNum = parseFloat(price);
    const beerPriceNum = parseFloat(beerPrice);
    const monthlyWageNum = parseFloat(monthlyWage);
    if (isNaN(priceNum) || isNaN(beerPriceNum) || isNaN(monthlyWageNum) || priceNum <= 0) return;

    const beers = Math.floor(priceNum / beerPriceNum);
    const hourlyWage = monthlyWageNum / 168;
    const hours = parseFloat((priceNum / hourlyWage).toFixed(1));

    setResult((prev) => prev ? { ...prev, beers, hours } : null);
    setRecalcFlash(true);
    const t = setTimeout(() => setRecalcFlash(false), 1500);
    return () => clearTimeout(t);
  }, [price, beerPrice, monthlyWage, beersPerEvening]);

  const calculate = () => {
    const priceNum = parseFloat(price);
    const beerPriceNum = parseFloat(beerPrice);
    const monthlyWageNum = parseFloat(monthlyWage);

    // Check if price is empty or invalid
    if (!price || price.trim() === "" || isNaN(priceNum)) {
      setErrorMessage("Nevyplnil jsi, kolik jsi chtěl utratit mimo hospodu!");
      setResult(null);
      return;
    }

    if (isNaN(beerPriceNum) || isNaN(monthlyWageNum)) {
      return;
    }

    // Clear error message if validation passes
    setErrorMessage("");

    const beers = Math.floor(priceNum / beerPriceNum);
    const hourlyWage = monthlyWageNum / 168;
    const hours = parseFloat((priceNum / hourlyWage).toFixed(1));
    const { message, msgId } = getRandomMessageWithId(beers);

    // Update URL with current calculation
    const params = new URLSearchParams();
    params.set("price", price);
    params.set("beerPrice", beerPrice);
    params.set("salary", monthlyWage);
    if (itemName.trim()) params.set("label", itemName.trim());
    params.set("msg", msgId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    track("calculator_submit", { price: priceNum, beerPrice: beerPriceNum, beers });

    setShowResult(false);
    setTimeout(() => {
      setResult({ beers, hours, message, msgId });
      setShowResult(true);
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  const handleRefreshMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!result) return;
    playClink();
    const { message, msgId } = getRandomMessageWithId(result.beers, result.msgId);
    const params = new URLSearchParams(window.location.search);
    params.set("msg", msgId);
    params.set("price", price); // keep URL in sync with current input, not stale preset price
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setResult((prev) => prev ? { ...prev, message, msgId } : null);
  };

  const handleCopyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopyLinkMessage("Odkaz zkopírován 👍");
      setTimeout(() => setCopyLinkMessage(""), 2500);
    } catch {
      // fallback for older browsers
      setCopyLinkMessage("Zkopíruj URL z adresního řádku");
      setTimeout(() => setCopyLinkMessage(""), 2500);
    }
  };

  const handleSurprise = () => {
    const candidates = getSurpriseCandidates();
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    handleExample(pick.amount, pick.label, pick);
  };

  const handleExample = (value: number, label?: string, preset?: ProductPreset) => {
    const priceStr = String(value);
    const beerPriceNum = parseFloat(beerPrice);
    const monthlyWageNum = parseFloat(monthlyWage);

    setPrice(priceStr);
    if (label) setItemName(label);
    setSelectedPreset(preset ?? null);
    setErrorMessage("");

    if (!isNaN(beerPriceNum) && !isNaN(monthlyWageNum)) {
      const beers = Math.floor(value / beerPriceNum);
      const hourlyWage = monthlyWageNum / 168;
      const hours = parseFloat((value / hourlyWage).toFixed(1));
      const { message, msgId } = getRandomMessageWithId(beers);

      const params = new URLSearchParams();
      params.set("price", priceStr);
      params.set("beerPrice", beerPrice);
      params.set("salary", monthlyWage);
      const effectiveLabel = label || itemName.trim();
      if (effectiveLabel) params.set("label", effectiveLabel);
      params.set("msg", msgId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      track("calculator_submit", { price: value, beerPrice: beerPriceNum, beers });

      setShowResult(false);
      setTimeout(() => {
        setResult({ beers, hours, message, msgId });
        setShowResult(true);
      }, 50);
    }
  };

  const handleShare = async () => {
    if (!result) return;

    track("share_click", { beers: result.beers });

    // Always use production URL so OG image works when shared
    const queryString = typeof window !== 'undefined' ? window.location.search : '';
    const currentUrl = `https://kolikpiv.cz/${queryString}`;

    // Random emotional variants for the beer line
    const beerWord = getBeerWord(result.beers);
    const subject = itemName.trim() || `Tohle za ${price} Kč`;
    const variants = [
      `${subject} stojí ${result.beers} ${beerWord} 🍺`,
      `${subject} stojí ${result.beers} ${beerWord} 😳🍺`,
      `${subject}?! To je ${result.beers} ${beerWord}!!! 🍺`,
      `${subject}… to už bolí. ${result.beers} ${beerWord} 🍺`,
    ];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];

    const shareText = `${randomVariant}\n\nKolik piv stojí tvoje věci?\n👉 ${currentUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Zkopírováno 👍");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const playClink = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    track("qr_download_click");

    try {
      // Check for canvas element first
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        // Canvas: directly convert to PNG
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'kolikpiv-qr.png';
        link.click();

        setQrDownloadMessage("QR uložen 👍");
        setTimeout(() => setQrDownloadMessage(""), 2000);
        return;
      }

      // SVG: convert to PNG via canvas
      const svg = qrRef.current.querySelector('svg');
      if (!svg) return;

      // Get SVG dimensions
      const svgRect = svg.getBoundingClientRect();
      const svgWidth = svgRect.width;
      const svgHeight = svgRect.height;

      // Serialize SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

      // Create image from SVG
      const img = new Image();
      img.onload = () => {
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = svgWidth;
        canvas.height = svgHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          alert("Nepodařilo se uložit QR kód");
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Convert canvas to PNG and download
        const pngDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngDataUrl;
        link.download = 'kolikpiv-qr.png';
        link.click();

        // Show feedback
        setQrDownloadMessage("QR uložen 👍");
        setTimeout(() => setQrDownloadMessage(""), 2000);
      };

      img.onerror = () => {
        alert("Nepodařilo se uložit QR kód");
      };

      img.src = svgDataUrl;
    } catch (err) {
      console.error("Failed to download QR:", err);
      alert("Nepodařilo se uložit QR kód");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 pb-16 px-4">

      {/* ── RECEIPT PAPER ── */}
      <div className="w-full max-w-sm bg-[#fdf8f0] text-stone-900 shadow-2xl">

        {/* HEADER — hospodská hlavička */}
        <div className="text-center pt-7 pb-5 px-6 border-b-2 border-dashed border-stone-400">
          <div className="flex justify-center mb-2">
            <svg width="32" height="36" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="14" cy="18" rx="7" ry="7" fill="#78350f" opacity="0.7"/>
              <ellipse cx="26" cy="13" rx="9" ry="9" fill="#78350f" opacity="0.8"/>
              <ellipse cx="40" cy="13" rx="9" ry="9" fill="#78350f" opacity="0.8"/>
              <ellipse cx="52" cy="18" rx="7" ry="7" fill="#78350f" opacity="0.7"/>
              <rect x="8" y="18" width="48" height="6" fill="#78350f" opacity="0.8"/>
              <rect x="8" y="22" width="48" height="44" rx="4" fill="#92400e"/>
              <rect x="14" y="28" width="8" height="32" rx="3" fill="#b45309" opacity="0.4"/>
              <path d="M56 32 Q72 32 72 46 Q72 60 56 60" stroke="#78350f" strokeWidth="6" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="font-black text-2xl tracking-widest uppercase text-stone-900">
            Kolik piv?
          </h1>
          <p className="font-mono text-[10px] tracking-widest text-stone-500 mt-0.5">
            kolikpiv.cz
          </p>
          <p className="font-mono text-[10px] text-stone-400 mt-0.5">
            Vystaveno: dnes
          </p>
          <p className="font-mono text-xs text-stone-500 mt-3 italic leading-relaxed px-2">
            {heroTagline}
          </p>
          <div className="mt-2 flex flex-col items-center gap-1">
            <a
              href="/alkulacka"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-indigo-600 text-indigo-700 font-mono text-[10px] font-bold tracking-wider transform rotate-1 hover:rotate-0 hover:bg-indigo-50 transition-all"
            >
              🍺 alkulačka
            </a>
            <span className="font-mono text-[10px] text-stone-400 italic">— kdy vystřízlivíš?</span>
          </div>
        </div>

        {/* PRESET ITEMS — jako řádky na jídelním lístku */}
        <div className="px-5 pt-4 pb-3 border-b border-dashed border-stone-300">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
              — Zkus třeba —
            </p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-stone-400 italic">nebo</span>
              <button
                type="button"
                onClick={handleSurprise}
                className="inline-flex items-center gap-1 px-3 py-1 border border-amber-700 text-amber-800 font-mono text-[11px] font-bold uppercase tracking-wider transform -rotate-2 hover:rotate-0 hover:bg-amber-50 transition-all"
              >
                ✦ Překvap mě
              </button>
            </div>
          </div>
          <div className="space-y-0">
            {getDefaultPresets().map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleExample(preset.amount, preset.label, preset)}
                className="w-full flex justify-between items-baseline py-1.5 px-1 -mx-1 hover:bg-amber-50 transition-colors group"
              >
                <span className="font-mono text-sm text-stone-700 group-hover:text-stone-900 text-left">
                  {preset.label}
                </span>
                <span className="font-mono text-xs text-stone-400 group-hover:text-stone-600 shrink-0 ml-3 tabular-nums">
                  {preset.amount.toLocaleString("cs-CZ")} Kč
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FORM FIELDS — ručně doplnitelné řádky účtenky */}
        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-3">
            — Zadej položku —
          </p>

          <div className="flex items-baseline gap-2 py-1.5 border-b border-dotted border-stone-300">
            <label className="font-mono text-xs text-stone-500 shrink-0 w-28">Položka:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="flex-1 text-right bg-transparent font-mono text-sm text-stone-900 focus:outline-none placeholder:text-stone-300 min-w-0"
              placeholder="co kupuješ?"
            />
          </div>

          <div className="flex items-baseline gap-2 py-1.5 border-b border-dotted border-stone-300">
            <label className="font-mono text-xs text-stone-500 shrink-0 w-28">Cena:</label>
            <div className="flex items-baseline gap-1 ml-auto">
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setSelectedPreset(null);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-28 text-right bg-transparent font-mono text-sm text-stone-900 focus:outline-none placeholder:text-stone-300 tabular-nums"
                placeholder="0"
              />
              <span className="font-mono text-xs text-stone-400">Kč</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 py-1.5 border-b border-dotted border-stone-300">
            <label className="font-mono text-xs text-stone-500 shrink-0 w-28">Pivo v hospodě:</label>
            <div className="flex items-baseline gap-1 ml-auto">
              <input
                type="number"
                value={beerPrice}
                onChange={(e) => setBeerPrice(e.target.value)}
                className="w-20 text-right bg-transparent font-mono text-sm text-stone-900 focus:outline-none tabular-nums"
              />
              <span className="font-mono text-xs text-stone-400">Kč</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 py-1.5 border-b border-dotted border-stone-300">
            <label className="font-mono text-xs text-stone-500 shrink-0 w-28">Piv za večer:</label>
            <div className="flex items-baseline gap-1 ml-auto">
              <input
                type="number"
                value={beersPerEvening}
                onChange={(e) => setBeersPerEvening(e.target.value)}
                className="w-16 text-right bg-transparent font-mono text-sm text-stone-900 focus:outline-none tabular-nums"
              />
              <span className="font-mono text-xs text-stone-400">ks</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 py-1.5 border-b border-dotted border-stone-300">
            <label className="font-mono text-xs text-stone-500 shrink-0 w-28">Čistá mzda:</label>
            <div className="flex items-baseline gap-1 ml-auto">
              <input
                type="number"
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(e.target.value)}
                className="w-24 text-right bg-transparent font-mono text-sm text-stone-900 focus:outline-none tabular-nums"
              />
              <span className="font-mono text-xs text-stone-400">Kč/m</span>
            </div>
          </div>

          {errorMessage && (
            <p className="font-mono text-xs text-red-700 mt-2 text-center">
              ⚠ {errorMessage}
            </p>
          )}

          {(!result || !selectedPreset) && (
            <button
              type="submit"
              onClick={result ? handleRefreshMessage : () => { playClink(); }}
              className="mt-4 w-full py-2.5 border-2 border-stone-800 text-stone-900 font-mono font-bold text-sm uppercase tracking-widest hover:bg-stone-900 hover:text-[#fdf8f0] transition-colors"
            >
              {result ? "Jiný citát :)" : "Spočítat →"}
            </button>
          )}
        </form>

        {/* CELKEM — hlavní výsledek jako součet na účtence */}
        {result && (
          <div
            className={`px-5 pb-6 transition-opacity duration-500 ${
              showResult ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="border-t-4 border-double border-stone-800 pt-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-3">
                ══ Celkem ══
              </p>

              {result.beers < 1 ? (
                <p className="font-black text-2xl text-stone-900 mb-3">
                  Ani na jedno pivo 😄
                </p>
              ) : (
                <>
                  <p className="font-black text-7xl text-amber-900 leading-none tabular-nums">
                    {result.beers}
                  </p>
                  <p className="font-mono text-xl font-bold mt-1 text-stone-800">
                    {getBeerWord(result.beers)} 🍺
                  </p>
                  {result.beers >= 20 && (
                    <p className="font-mono text-xs text-stone-500 mt-1">
                      ({Math.floor(result.beers / 20)}{" "}
                      {(() => {
                        const crates = Math.floor(result.beers / 20);
                        if (crates === 1) return "basa";
                        if (crates >= 2 && crates <= 4) return "basy";
                        return "bas";
                      })()}
                      {result.beers % 20 > 0 &&
                        ` + ${result.beers % 20} ${getBeerWord(result.beers % 20)}`}{" "}
                      📦)
                    </p>
                  )}
                </>
              )}

              {/* Sub-položky */}
              <div className="mt-4 border-t border-dotted border-stone-300 pt-3 space-y-1 text-left">
                <div className="flex justify-between font-mono text-xs text-stone-600">
                  <span>Hodin práce:</span>
                  <span className="font-medium text-stone-800 tabular-nums">{result.hours} h</span>
                </div>
                <div className="flex justify-between font-mono text-xs text-stone-600">
                  <span>Pracovních dní:</span>
                  <span className="font-medium text-stone-800 tabular-nums">
                    {result.hours / 8 < 1
                      ? `${Math.round((result.hours / 8) * 100)} %`
                      : `${(result.hours / 8).toFixed(2)}`}
                  </span>
                </div>
                {(() => {
                  const evenings = parseFloat(beersPerEvening);
                  if (!isNaN(evenings) && evenings > 0 && result.beers > 0) {
                    const eveningCount = parseFloat((result.beers / evenings).toFixed(1));
                    const eveningWord =
                      eveningCount === 1 ? "večer" : eveningCount < 5 ? "večery" : "večerů";
                    return (
                      <div className="flex justify-between font-mono text-xs text-stone-600">
                        <span>Večerů v hospodě:</span>
                        <span className="font-medium text-stone-800 tabular-nums">
                          {eveningCount} {eveningWord}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
                {recalcFlash && (
                  <p className="text-center font-mono text-[10px] text-amber-700 mt-1">
                    přepočítáno
                  </p>
                )}
              </div>

              {/* Citát ze Švejka */}
              {(() => {
                const lastDash = result.message.lastIndexOf("\n—");
                const hasAttribution = lastDash !== -1;
                const quoteText = hasAttribution
                  ? result.message.substring(0, lastDash)
                  : result.message;
                const attribution = hasAttribution
                  ? result.message.substring(lastDash + 1)
                  : null;
                return (
                  <div className="mt-4 pt-3 border-t border-dashed border-stone-300 text-left">
                    <p className="font-mono text-xs italic text-stone-600 leading-relaxed whitespace-pre-line">
                      „{quoteText}"
                    </p>
                    {attribution && (
                      <p className="font-mono text-[10px] text-stone-400 mt-2">
                        {attribution}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Sdílení */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleShare}
                  className="w-full py-2.5 bg-stone-900 text-[#fdf8f0] font-mono font-bold text-sm uppercase tracking-widest hover:bg-stone-700 transition-colors"
                >
                  Sdílej kamarádům 🍺
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2 border border-stone-400 text-stone-600 font-mono text-xs hover:border-stone-700 hover:text-stone-900 transition-colors"
                >
                  {copyLinkMessage || "Kopírovat odkaz"}
                </button>
              </div>

              {/* Affiliate produktové / pivní karty — receipt styl */}
              {selectedPreset && selectedPreset.sourceType !== "manual" && (
                <div className="mt-4 space-y-2 border-t border-dashed border-stone-300 pt-4">
                  <div className={`border text-left ${selectedPreset.affiliateUrl ? "border-stone-400" : "border-stone-200"}`}>
                    {selectedPreset.imageUrl && (
                      <div className="bg-stone-100 flex justify-center py-2">
                        <img
                          src={selectedPreset.imageUrl}
                          alt={selectedPreset.label}
                          className="h-14 w-auto object-contain"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="px-3 py-2 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-stone-900 truncate">
                          {selectedPreset.label}
                        </p>
                        <p className="font-mono text-[10px] text-amber-700">
                          {selectedPreset.amount.toLocaleString("cs-CZ")} Kč
                          {selectedPreset.merchantName && (
                            <span className="text-stone-400"> · {selectedPreset.merchantName}</span>
                          )}
                        </p>
                      </div>
                      {selectedPreset.affiliateUrl ? (
                        <a
                          href={selectedPreset.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-2 py-1 border border-stone-400 hover:border-stone-700 hover:bg-stone-100 font-mono text-[10px] text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap"
                        >
                          {selectedPreset.ctaLabel ?? "Zobrazit →"}
                        </a>
                      ) : (
                        <span className="shrink-0 font-mono text-[10px] text-stone-400">
                          Odkaz připravujeme
                        </span>
                      )}
                    </div>
                  </div>

                  {result && result.beers >= 1 && (
                    <div
                      className="font-black text-3xl tracking-tighter text-center"
                      style={{ color: "#dc2626", animation: "vs-pulse 1.2s ease-in-out infinite" }}
                    >
                      VS
                    </div>
                  )}

                  {result && result.beers >= 1 && (
                    <div className={`border text-left ${selectedPreset.beerEquivalentOffer?.affiliateUrl ? "border-stone-400" : "border-stone-200"}`}>
                      <div className="px-3 py-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-semibold text-stone-900 truncate">
                            🍺 Piva za stejnou cenu
                          </p>
                          <p className="font-mono text-[10px] text-amber-700">
                            {result.beers} {getBeerWord(result.beers)}
                            {selectedPreset.beerEquivalentOffer?.merchantName && (
                              <span className="text-stone-400">
                                {" "}· {selectedPreset.beerEquivalentOffer.merchantName}
                              </span>
                            )}
                          </p>
                        </div>
                        {selectedPreset.beerEquivalentOffer?.affiliateUrl ? (
                          <a
                            href={selectedPreset.beerEquivalentOffer.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 px-2 py-1 border border-stone-400 hover:border-stone-700 hover:bg-stone-100 font-mono text-[10px] text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap"
                          >
                            {selectedPreset.beerEquivalentOffer.ctaLabel ?? "Objednat →"}
                          </a>
                        ) : (
                          <span className="shrink-0 font-mono text-[10px] text-stone-400">
                            Pivní nabídku připravujeme
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PERFOROVANÝ SPODNÍ OKRAJ */}
        <div className="receipt-tear" />
      </div>

      {/* ── DROBNÝM PÍSMEM — druhý receipt blok ── */}
      <div className="w-full max-w-sm bg-[#fdf8f0] text-stone-900 shadow-2xl mt-4">

        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b-2 border-dashed border-stone-400 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
            ══ Drobným písmem ══
          </p>
        </div>

        {/* QR donation */}
        {result && result.beers >= 20 && (() => {
          const beerPriceNum = parseFloat(beerPrice);
          const donationAmount = getDonationAmount(beerPriceNum);
          const isCapped = beerPriceNum > 2000;
          const qrValue = `SPD*1.0*ACC:CZ5055000000008216903002*AM:${donationAmount}.00*CC:CZK*MSG:Pivo`;
          return (
            <div className="px-5 py-4 border-b border-dashed border-stone-300">
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-3">
                — Kup mi pivo —
              </p>
              <p className="font-mono text-xs text-stone-600 mb-3">
                To už je minimálně na basu… tak ať se taky napiju 🍺
              </p>
              <div className="flex justify-center mb-3">
                <div
                  ref={qrRef}
                  onClick={handleDownloadQR}
                  className="bg-white p-3 border border-stone-300 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  title="Klikni pro uložení QR kódu"
                >
                  <QRCodeSVG value={qrValue} size={190} level="M" />
                </div>
              </div>
              {qrDownloadMessage && (
                <p className="font-mono text-xs text-green-700 text-center mb-2 font-semibold">
                  {qrDownloadMessage}
                </p>
              )}
              <p className="font-mono text-[10px] text-stone-500 text-center">
                Naskenuj v bankovní aplikaci
              </p>
              <p className="font-mono text-[10px] text-stone-400 text-center md:hidden">
                Klikni pro uložení 🍺
              </p>
              {donationAmount === 50 ? (
                <p className="font-mono text-xs text-amber-700 font-semibold text-center mt-1">
                  👉 50 Kč = 1 pivo pro mě
                </p>
              ) : (
                <>
                  <p className="font-mono text-xs text-amber-700 font-semibold text-center mt-1">
                    👉 QR je připravený na {donationAmount} Kč
                  </p>
                  {isCapped && (
                    <p className="font-mono text-[10px] text-stone-500 text-center">
                      Původní cena piva: {beerPriceNum} Kč 😄
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })()}

        {/* Alkohol ekvivalence */}
        {result && result.beers > 0 && (() => {
          const ALCOHOL_PER_BEER_ML = 25;
          const VODKA_BOTTLE_ML = 200;
          const WINE_BOTTLE_ML = 90;
          const pureAlcoholMl = result.beers * ALCOHOL_PER_BEER_ML;
          const vodkaBottles = parseFloat((pureAlcoholMl / VODKA_BOTTLE_ML).toFixed(1));
          const wineBottles = parseFloat((pureAlcoholMl / WINE_BOTTLE_ML).toFixed(1));
          const pureAlcoholDisplay = pureAlcoholMl >= 1000
            ? `${(pureAlcoholMl / 1000).toFixed(2)} l`
            : `${pureAlcoholMl} ml`;
          const vodkaWord = vodkaBottles === 1 ? "lahev" : vodkaBottles < 5 ? "lahve" : "lahví";
          const wineWord = wineBottles === 1 ? "lahev" : wineBottles < 5 ? "lahve" : "lahví";
          return (
            <div className="px-5 py-4 border-b border-dashed border-stone-300">
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                — V přepočtu na alkohol —
              </p>
              <p className="font-mono text-[9px] text-stone-400 mb-3">(12° pivo, 0.5l, 5% ABV)</p>
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-xs text-stone-600">
                  <span>Čistý alkohol:</span>
                  <span className="text-amber-700 font-medium tabular-nums">{pureAlcoholDisplay}</span>
                </div>
                <div className="flex justify-between font-mono text-xs text-stone-600">
                  <span>Vodka (0.5l, 40 %):</span>
                  <span className="text-amber-700 font-medium tabular-nums">{vodkaBottles} {vodkaWord}</span>
                </div>
                <div className="flex justify-between font-mono text-xs text-stone-600">
                  <span>Víno (0.75l, 12 %):</span>
                  <span className="text-amber-700 font-medium tabular-nums">{wineBottles} {wineWord}</span>
                </div>
              </div>
              <div className="flex gap-4 mt-3 pt-2 border-t border-dotted border-stone-300">
                <a href="/alkulacka" className="font-mono text-[10px] text-amber-700 hover:text-amber-600 transition-colors">Alkulačka</a>
                <a href="/alkoholmetr" className="font-mono text-[10px] text-amber-700 hover:text-amber-600 transition-colors">Alkoholmetr</a>
              </div>
            </div>
          );
        })()}

        {/* Kalorický přepočet */}
        {result && result.beers > 0 && (() => {
          const KCAL_PER_BEER = 200;
          const KCAL_PER_KM = 70;
          const totalKcal = result.beers * KCAL_PER_BEER;
          const runKm = parseFloat((totalKcal / KCAL_PER_KM).toFixed(1));
          const kcalDisplay = totalKcal >= 1000
            ? `${(totalKcal / 1000).toFixed(1)} tis. kcal`
            : `${totalKcal} kcal`;
          return (
            <div className="px-5 py-4 border-b border-dashed border-stone-300">
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-3">
                — Kolik toho musíš odběhat —
              </p>
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-mono text-xs text-stone-600">{result.beers} piv =</span>
                <span className="font-mono text-xs text-amber-700 font-medium">{kcalDisplay}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-stone-600">Vzdálenost:</span>
                <span className="font-black text-2xl text-amber-900 tabular-nums">{runKm} km</span>
              </div>
              <p className="font-mono text-[10px] text-stone-400 mt-1">(~70 kcal/km, průměrné tempo)</p>
              <p className="font-mono text-[10px] text-stone-500 mt-1">
                Až poběžíš maraton (42 km) = 14 piv. Což zní jako solidní plán.
              </p>
            </div>
          );
        })()}

        {/* Beer deals / reklama */}
        {(() => {
          const totalPrice = parseFloat(price);
          if (!result || isNaN(totalPrice) || totalPrice <= 0) return null;
          const SHOW_BEER_DEALS = false;
          if (!SHOW_BEER_DEALS) {
            return (
              <div className="px-5 py-3 border-b border-dotted border-stone-300 text-center">
                <p className="font-mono text-[10px] text-stone-500 mb-0.5">
                  Prodáváte, nebo vaříte pivo?
                </p>
                <p className="font-mono text-[10px] text-stone-500 mb-1">
                  Chcete tady mít jen svoji reklamu?
                </p>
                <a
                  href="mailto:reklama@kolikpiv.cz?subject=Reklama%20na%20kolikpiv.cz"
                  className="font-mono text-[10px] text-amber-700 hover:text-amber-600 transition-colors underline"
                >
                  Objednejte si zde
                </a>
                <span className="font-mono text-[10px] text-stone-400 ml-2">· Od 500 Kč měsíčně</span>
              </div>
            );
          }
          const sorted = [...beerDeals].sort((a, b) => {
            if (a.isBestDeal && !b.isBestDeal) return -1;
            if (!a.isBestDeal && b.isBestDeal) return 1;
            return a.pricePerPiece - b.pricePerPiece;
          });
          return (
            <div className="px-5 py-4 border-b border-dashed border-stone-300">
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                — Co za to koupíš v obchodě —
              </p>
              <p className="font-mono text-[9px] text-stone-400 mb-3">
                Orientačně · Ceny aktualizovány: {LAST_UPDATED}
              </p>
              <div className="space-y-1.5">
                {sorted.map((deal) => {
                  const pieceCount = Math.floor(totalPrice / deal.pricePerPiece);
                  const isClickable = Boolean(deal.url);
                  const inner = (
                    <div className="flex justify-between items-baseline">
                      <span className="font-mono text-xs text-stone-700">
                        {deal.icon ?? "🍺"} {deal.name}
                        <span className="text-stone-400 text-[10px] ml-1">od {deal.pricePerPiece} Kč</span>
                      </span>
                      {pieceCount > 0 ? (
                        <span className="font-mono text-xs text-amber-700 font-medium tabular-nums shrink-0 ml-2">
                          {pieceCount} piv
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-stone-400 shrink-0 ml-2">nestačí</span>
                      )}
                    </div>
                  );
                  if (isClickable) {
                    return (
                      <a
                        key={deal.id}
                        href={deal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("affiliate_click", {
                          beer: deal.name,
                          pricePerPiece: deal.pricePerPiece,
                          pieceCount,
                          totalPrice,
                        })}
                        className="block hover:bg-amber-50 -mx-1 px-1 rounded transition-colors"
                      >
                        {inner}
                      </a>
                    );
                  }
                  return <div key={deal.id}>{inner}</div>;
                })}
              </div>
              <p className="font-mono text-[9px] text-stone-400 mt-2">Ceny se mohou lišit podle aktuálních akcí 🍺</p>
            </div>
          );
        })()}

        {/* SEO summary */}
        <div className="px-5 py-4 border-b border-dotted border-stone-300">
          <p className="font-mono text-[10px] text-stone-500 leading-relaxed">
            Kolikpiv.cz je jednoduchá online kalkulačka, která převádí ceny na počet piv.
            Zadej částku a zjisti, kolik piv za ni dostaneš. Nejde o alkohol kalkulačku ani
            výpočet promile, ale o zábavný způsob, jak si představit hodnotu peněz. Například
            zjistíš, kolik piv stojí telefon, dovolená nebo běžné nákupy.
          </p>
        </div>

        {/* Disclaimer + footer */}
        <div className="px-5 py-4 text-center">
          <p className="font-mono text-[10px] text-stone-400">Experiment 🍺</p>
          <p className="font-mono text-[10px] text-stone-400 mt-0.5">
            Něco může být nepřesné… ale piva sedí 😄
          </p>
          <p className="font-mono text-[10px] text-stone-500 mt-4 leading-relaxed">
            Citáty na této stránce jsou inspirovány románem{" "}
            <strong className="text-stone-600">Osudy dobrého vojáka Švejka za světové války</strong>{" "}
            od Jaroslava Haška — jako pocta českému humoru, hospodské filozofii a nenapravitelnému optimismu
            tváří v tvář absurditě.
          </p>
          <p className="font-mono text-[10px] text-stone-400 mt-1">
            Švejk by tohle určitě přepočítal na piva. My jsme to udělali za něj.
          </p>
          {visitorCount && (
            <p className="font-mono text-[10px] text-stone-400 mt-2">
              Návštěv celkem: {visitorCount}
            </p>
          )}
          <p className="font-mono text-[10px] text-stone-400 mt-1">Díky, že to šíříš 🍺</p>
        </div>

        {/* Perforovaný spodní okraj */}
        <div className="receipt-tear" />
      </div>
    </div>
  );
}
