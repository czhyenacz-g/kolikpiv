import type { Metadata } from "next";
import Link from "next/link";
import AlcoholCalculator from "../components/AlcoholCalculator";

export const metadata: Metadata = {
  title: "Alkoholtester online – orientační test promile | Kolikpiv.cz",
  description:
    "Alkoholtester online zdarma. Otestujte orientační hladinu alkoholu v krvi — zadejte vypité nápoje, váhu a pohlaví.",
  alternates: {
    canonical: "https://kolikpiv.cz/alkoholtester",
  },
  openGraph: {
    title: "Alkoholtester online – orientační test promile | Kolikpiv.cz",
    description:
      "Alkoholtester online zdarma. Otestujte orientační hladinu alkoholu v krvi — zadejte vypité nápoje, váhu a pohlaví.",
    url: "https://kolikpiv.cz/alkoholtester",
    siteName: "Kolik piv to je?",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function AlkoholtesterPage() {
  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-md py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">🍺</p>
          <h1 className="text-3xl font-bold mb-2">Alkoholtester</h1>
          <p className="text-gray-400 text-sm">
            Orientační online test alkoholu v krvi — pro zábavu a přibližný
            odhad.
          </p>
        </div>

        {/* Calculator */}
        <div className="mb-10">
          <AlcoholCalculator />
        </div>

        {/* SEO content */}
        <div className="mt-10 pt-8 border-t border-gray-800 space-y-8 text-sm text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-base mb-2">
              Co je alkoholtester online?
            </h2>
            <p>
              Alkoholtester online je jednoduchý nástroj, který ti umožní
              přibližně otestovat, kolik alkoholu máš v krvi, aniž bys
              potřeboval skutečný přístroj. Zadáš pohlaví, váhu a co jsi pil —
              a dostaneš orientační odhad v promile. Nejde o náhradu skutečného
              alkoholtesteru.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">
              Jak funguje orientační test alkoholu?
            </h2>
            <p>
              Výpočet vychází z Widmarkovy formule, která je základem většiny
              orientačních alkohol kalkulaček. Čistý alkohol v gramech se
              vypočítá z objemu a procent každého nápoje, pak se vydělí
              tělesnou hmotností a distribučním faktorem (muž ≈ 0,68; žena ≈
              0,55). Výsledkem je přibližné promile.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">
              Jaký je rozdíl mezi skutečným alkoholtesterem a online testem?
            </h2>
            <p>
              Skutečný alkoholtester měří alkohol ve vydechovaném vzduchu
              přímo. Online alkoholtester počítá odhad na základě průměrných
              hodnot — nezohledňuje individuální metabolismus, jídlo v žaludku
              ani zdravotní stav. Reálná hladina se může lišit.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">
              Kolik alkoholu se odbouraví za hodinu?
            </h2>
            <p>
              Průměrně přibližně 0,1–0,15 ‰ za hodinu. Tento alkoholtester
              používá pro orientační výpočet hodnotu 0,12 ‰/hod. Skutečné
              odbourávání závisí na mnoha faktorech — pohlaví, věku, játrech,
              jídle a celkovém zdravotním stavu.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">
              Kolik piv odpovídá jednomu promile?
            </h2>
            <p>
              Záleží na váze a pohlaví. Přibližně: muž 80 kg potřebuje kolem 4
              piv 12° (0,5 l, 5 % ABV), aby dosáhl 1 ‰. U ženy 60 kg to mohou
              být jen 2–3 piva. Proto je pro přesný odhad důležité zadat
              správnou váhu.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">
              Přepočítej cenu pití na piva
            </h2>
            <p>
              Zajímá tě, kolik piv stojí tvoje oblíbené věci? Na{" "}
              <Link
                href="/"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                kolikpiv.cz
              </Link>{" "}
              najdeš hlavní kalkulačku, která přepočítá jakoukoli cenu na počet
              piv.
            </p>
          </section>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pb-8 text-center border-t border-gray-800 pt-6">
          <p className="text-zinc-600 text-xs leading-relaxed">
            Alkoholtester je čistě orientační online nástroj pro zábavu.
            Neurčuje, zda můžete řídit ani není náhradou skutečného měření.
          </p>
          <p className="text-zinc-700 text-xs mt-2">
            <Link href="/" className="hover:text-zinc-500 transition-colors">
              ← zpět na kolikpiv.cz
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
