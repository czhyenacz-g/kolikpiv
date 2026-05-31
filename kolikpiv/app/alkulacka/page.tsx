import type { Metadata } from "next";
import Link from "next/link";
import AlcoholCalculator from "../components/AlcoholCalculator";

export const metadata: Metadata = {
  title: "Alkulačka – alkoholová kalkulačka online | Kolikpiv.cz",
  description:
    "Alkoholová kalkulačka online. Přepočet piva, vína a panáků na orientační množství alkoholu a piv.",
  alternates: {
    canonical: "https://kolikpiv.cz/alkulacka",
  },
  openGraph: {
    title: "Alkulačka – alkoholová kalkulačka online | Kolikpiv.cz",
    description:
      "Alkoholová kalkulačka online. Přepočet piva, vína a panáků na orientační množství alkoholu a piv.",
    url: "https://kolikpiv.cz/alkulacka",
    siteName: "Kolik piv to je?",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function AlkulackaPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 pb-16 px-4">

      {/* Receipt paper */}
      <div className="w-full max-w-md bg-[#fdf8f0] text-stone-900 shadow-2xl">

        {/* Header */}
        <div className="text-center pt-7 pb-5 px-6 border-b-2 border-dashed border-stone-400">
          <p className="text-3xl mb-2">🍺</p>
          <h1 className="font-black text-2xl tracking-widest uppercase">Alkulačka</h1>
          <p className="font-mono text-[10px] tracking-widest text-stone-500 mt-0.5">
            kolikpiv.cz
          </p>
          <p className="font-mono text-[10px] text-stone-400 mt-0.5">Vystaveno: dnes</p>
          <p className="font-mono text-xs text-stone-500 mt-3 italic leading-relaxed px-2">
            Alkoholová kalkulačka — přepočítej pivo, víno a panáky na orientační
            promile.
          </p>
          <p className="font-mono text-[10px] text-stone-400 mt-2">
            <Link
              href="/"
              className="text-amber-700 underline hover:text-amber-600 transition-colors"
            >
              ← kolikpiv.cz
            </Link>
          </p>
        </div>

        {/* Calculator */}
        <div className="px-5 py-6">
          <AlcoholCalculator />
        </div>

        {/* Perforated bottom */}
        <div className="receipt-tear" />
      </div>

      {/* SEO content — dark sections below receipt */}
      <div className="w-full max-w-md mt-5">
        <div className="pt-8 border-t border-stone-800 space-y-8 text-sm text-stone-400 leading-relaxed">
          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Co je alkulačka?
            </h2>
            <p>
              Alkulačka (nebo taky alkoholová kalkulačka) je online nástroj pro
              orientační výpočet množství alkoholu. Zadáš, co jsi pil, jakou
              máš váhu, a alkulačka ti řekne, kolika pivům to přibližně
              odpovídá a jaká může být orientační hladina alkoholu v krvi.
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Jak funguje alkoholová kalkulačka?
            </h2>
            <p>
              Alkohol v gramech se spočítá ze zadaných nápojů (objem × procenta
              × hustota ethanolu 0,789). Výsledek se vydělí tělesnou hmotností a
              Widmarkovým distribučním faktorem — pro muže přibližně 0,68, pro
              ženy přibližně 0,55. Výsledek je v g/kg krve, tedy v promile.
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Kolik alkoholu má běžné pivo?
            </h2>
            <p>
              Půllitr dvanáctky (12°, 5 % ABV) obsahuje přibližně 20 g čistého
              alkoholu. Desítka (4 % ABV) je lehčí — kolem 16 g. Sklenka vína
              (2 dcl, 12 %) má přibližně 19 g, panák 40% pálenky (4 cl) asi 13
              g. Alkulačka tohle vše zohledňuje automaticky.
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Proč je výpočet jen orientační?
            </h2>
            <p>
              Alkohol v krvi ovlivňuje spousta věcí: jak rychle piješ, jestli
              jsi jedl, tvůj individuální metabolismus a zdravotní stav. Navíc
              tělo alkohol průběžně odbourává — přibližně 0,1–0,15 ‰ za hodinu.
              Tato alkulačka dobu odbourávání záměrně nepočítá a výsledek je
              proto jen hrubý odhad.
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Rozdíl mezi pivem, vínem a panáky
            </h2>
            <p>
              Z hlediska alkoholu je rozhodující množství čistého ethanolu, ne
              druh nápoje. Pivo se zpravidla pije pomaleji díky většímu objemu,
              víno ve skleničce rychleji a panák ještě rychleji. Rychlost pití
              ovlivňuje, jak rychle alkohol vstřebáváš — alkulačka to ale
              nezohledňuje.
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Kolik piv stojí tvoje věci?
            </h2>
            <p>
              Pokud tě zajímá, kolik piv stojí telefon, dovolená nebo výplata,
              mrkni na{" "}
              <Link
                href="/"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                hlavní kalkulačku kolikpiv.cz
              </Link>
              . Přepočítá cenu čehokoliv na počet piv.
            </p>
          </section>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pb-8 text-center border-t border-stone-800 pt-6">
          <p className="text-stone-600 text-xs leading-relaxed">
            Alkulačka je čistě orientační nástroj pro zábavu a přibližný odhad.
            Neurčuje, zda můžete řídit nebo vykonávat jiné činnosti vyžadující
            střízlivost.
          </p>
          <p className="text-stone-700 text-xs mt-2">
            <Link href="/" className="hover:text-stone-500 transition-colors">
              ← zpět na kolikpiv.cz
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
