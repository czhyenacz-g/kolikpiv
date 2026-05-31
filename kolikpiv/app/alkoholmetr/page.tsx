import type { Metadata } from "next";
import Link from "next/link";
import AlcoholCalculator from "../components/AlcoholCalculator";

export const metadata: Metadata = {
  title: "Alkoholmetr – orientační výpočet alkoholu | Kolikpiv.cz",
  description:
    "Orientační alkoholmetr online. Spočítejte si přibližné promile, množství alkoholu a kolika pivům odpovídá vaše útrata.",
  alternates: {
    canonical: "https://kolikpiv.cz/alkoholmetr",
  },
  openGraph: {
    title: "Alkoholmetr – orientační výpočet alkoholu | Kolikpiv.cz",
    description:
      "Orientační alkoholmetr online. Spočítejte si přibližné promile, množství alkoholu a kolika pivům odpovídá vaše útrata.",
    url: "https://kolikpiv.cz/alkoholmetr",
    siteName: "Kolik piv to je?",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function AlkoholmetrPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 pb-16 px-4">

      {/* Receipt paper */}
      <div className="w-full max-w-md bg-[#fdf8f0] text-stone-900 shadow-2xl">

        {/* Header */}
        <div className="text-center pt-7 pb-5 px-6 border-b-2 border-dashed border-stone-400">
          <p className="text-3xl mb-2">🍺</p>
          <h1 className="font-black text-2xl tracking-widest uppercase">Alkoholmetr</h1>
          <p className="font-mono text-[10px] tracking-widest text-stone-500 mt-0.5">
            kolikpiv.cz
          </p>
          <p className="font-mono text-[10px] text-stone-400 mt-0.5">Vystaveno: dnes</p>
          <p className="font-mono text-xs text-stone-500 mt-3 italic leading-relaxed px-2">
            Orientační výpočet alkoholu v krvi — pro zábavu a přibližný odhad.
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
              Co je alkoholmetr?
            </h2>
            <p>
              Alkoholmetr je orientační nástroj, který ti umožní odhadnout
              množství alkoholu v krvi (BAC — blood alcohol concentration) na
              základě vypitého alkoholu, tvé váhy a pohlaví. Nejde o přesný
              přístroj ani lékařský nástroj — slouží čistě pro zábavu a hrubý
              odhad.
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Jak alkoholmetr funguje?
            </h2>
            <p>
              Výpočet vychází z orientačního principu tzv. Widmarkovy formule,
              která se běžně používá pro přibližný odhad hladiny alkoholu v
              krvi. Vzorec počítá čistý alkohol v gramech ze zadaných nápojů a
              vydělí ho tělesnou hmotností a distribučním faktorem (muž ≈ 0,68;
              žena ≈ 0,55).
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Kolik alkoholu má běžné pivo?
            </h2>
            <p>
              Standardní 0,5l pivo stupně 12° (5 % ABV) obsahuje přibližně 20 g
              čistého alkoholu. Pivo 10° (4 % ABV) je slabší — kolem 16 g. Víno
              (2 dcl, 12 %) má přibližně 19 g, panák vodky (4 cl, 40 %) asi 13
              g.
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Proč je výpočet jen orientační?
            </h2>
            <p>
              Skutečná hladina alkoholu v krvi závisí na mnoha faktorech:
              rychlosti pití, jídle v žaludku, individuálním metabolismu,
              zdravotním stavu a dalších. Alkohol se také průběžně odbourává
              (přibližně 0,1–0,15 ‰ za hodinu), ale tento alkoholmetr dobu
              odbourávání záměrně nezohledňuje.
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Rozdíl mezi pivem, vínem a panáky
            </h2>
            <p>
              Stejné množství čistého alkoholu způsobuje stejný efekt bez
              ohledu na to, jestli ho přijmeš ve formě piva, vína nebo
              pálenky. Rozdíl je v objemu nápoje a rychlosti konzumace — silný
              nápoj v malém objemu se zpravidla vypije rychleji, což může
              způsobit rychlejší nárůst hladiny alkoholu.
            </p>
          </section>

          <section>
            <h2 className="text-stone-200 font-semibold font-mono text-sm mb-2">
              Spočítej si, kolik piv za co zaplatíš
            </h2>
            <p>
              Na{" "}
              <Link
                href="/"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                kolikpiv.cz
              </Link>{" "}
              najdeš hlavní kalkulačku, která přepočítá cenu čehokoliv na počet
              piv. Zjisti, kolik piv stojí tvůj telefon, dovolená nebo třeba
              výplata.
            </p>
          </section>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pb-8 text-center border-t border-stone-800 pt-6">
          <p className="text-stone-600 text-xs leading-relaxed">
            Alkoholmetr je čistě orientační nástroj pro zábavu. Neurčuje, kdy
            je bezpečné řídit. Přesné hodnoty závisí na mnoha individuálních
            faktorech.
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
