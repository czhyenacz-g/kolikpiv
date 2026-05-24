import type { Metadata } from "next";
import Link from "next/link";
import { calcBAC, calcTimeToPromile } from "../../lib/alcohol";

export const metadata: Metadata = {
  title: "Za jak dlouho vystřízlivím z 1 až 5 piv? | Kolikpiv.cz",
  description:
    "Orientační přehled, za jak dlouho může tělo odbourat alkohol z 1, 2, 3, 4 nebo 5 piv. Výpočet podle množství alkoholu, váhy a orientační rychlosti odbourávání.",
  alternates: { canonical: "https://kolikpiv.cz/kdy-vystrizlivim" },
  openGraph: {
    title: "Za jak dlouho vystřízlivím z 1 až 5 piv? | Kolikpiv.cz",
    description:
      "Orientační přehled, za jak dlouho může tělo odbourat alkohol z 1, 2, 3, 4 nebo 5 piv.",
    url: "https://kolikpiv.cz/kdy-vystrizlivim",
    siteName: "Kolik piv to je?",
    locale: "cs_CZ",
    type: "website",
  },
};

// Reference beer: 0.5l, 5% ABV, 12° pivo
const BEER_ALCOHOL_G = 500 * 0.05 * 0.789; // ~19.7 g

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

interface Row {
  beers: number;
  malePromile: number;
  maleTime: string;
  femalePromile: number;
  femaleTime: string;
}

function buildRows(): Row[] {
  return [1, 2, 3, 4, 5].map((beers) => {
    const totalG = beers * BEER_ALCOHOL_G;
    const malePromile = Math.round(calcBAC(totalG, 80, "male") * 100) / 100;
    const femalePromile = Math.round(calcBAC(totalG, 65, "female") * 100) / 100;
    return {
      beers,
      malePromile,
      maleTime: formatDuration(calcTimeToPromile(malePromile, 0)),
      femalePromile,
      femaleTime: formatDuration(calcTimeToPromile(femalePromile, 0)),
    };
  });
}

const rows = buildRows();

export default function KdyVystrizlivimPage() {
  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-md py-8">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs text-gray-600 hover:text-amber-400 transition-colors"
          >
            ← kolikpiv.cz
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">🍺</p>
          <h1 className="text-2xl font-bold mb-3">
            Za jak dlouho vystřízlivím z 1 až 5 piv?
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Orientační přehled, za jak dlouho může tělo odbourat alkohol z 1, 2,
            3, 4 nebo 5 piv. Záleží na váze a pohlaví.
          </p>
        </div>

        {/* Table */}
        <div className="mb-6 overflow-hidden rounded-lg border border-gray-700">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_1fr] bg-gray-800 border-b border-gray-700 text-xs text-gray-500">
            <div className="px-3 py-2.5 font-semibold">Piv</div>
            <div className="px-3 py-2.5 font-semibold border-l border-gray-700 text-center">
              Muž 80 kg
            </div>
            <div className="px-3 py-2.5 font-semibold border-l border-gray-700 text-center">
              Žena 65 kg
            </div>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.beers}
              className={`grid grid-cols-[auto_1fr_1fr] text-sm ${
                i % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"
              } ${i < rows.length - 1 ? "border-b border-gray-700/50" : ""}`}
            >
              <div className="px-3 py-3 font-bold text-amber-400 whitespace-nowrap">
                {row.beers} {row.beers === 1 ? "pivo" : row.beers <= 4 ? "piva" : "piv"}
              </div>
              <div className="px-3 py-3 border-l border-gray-700/50 text-center">
                <span className="block text-gray-300 font-semibold">
                  {formatDuration(calcTimeToPromile(row.malePromile, 0))}
                </span>
                <span className="block text-xs text-gray-600 mt-0.5">
                  cca {row.malePromile} ‰
                </span>
              </div>
              <div className="px-3 py-3 border-l border-gray-700/50 text-center">
                <span className="block text-gray-300 font-semibold">
                  {formatDuration(calcTimeToPromile(row.femalePromile, 0))}
                </span>
                <span className="block text-xs text-gray-600 mt-0.5">
                  cca {row.femalePromile} ‰
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-600 text-center mb-8">
          Referenční pivo: 0,5 l · 5 % ABV · cca 19,7 g alkoholu.
          Odbourávání: orientačně 0,12 ‰/hod.
        </p>

        {/* Disclaimer */}
        <div className="p-4 bg-yellow-900/20 border border-yellow-700/40 rounded-lg mb-8">
          <p className="text-yellow-600/90 text-xs leading-relaxed text-center">
            ⚠️ Výpočet je pouze orientační. Rychlost odbourávání alkoholu je
            individuální a závisí na mnoha faktorech. Tato stránka neurčuje,
            zda můžete řídit ani neslouží k žádnému bezpečnostnímu rozhodnutí.
          </p>
        </div>

        {/* SEO content */}
        <div className="space-y-6 text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-8 mb-8">
          <section>
            <h2 className="text-white font-semibold text-base mb-2">
              Jak funguje odbourávání alkoholu?
            </h2>
            <p>
              Tělo odbourauje alkohol průměrně přibližně 0,1–0,15 ‰ za hodinu —
              tato kalkulačka používá orientační hodnotu 0,12 ‰/hod. Skutečná
              rychlost závisí na pohlaví, věku, tělesné hmotnosti, jídle
              v žaludku, zdravotním stavu a dalších faktorech.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">
              Proč se liší muž a žena?
            </h2>
            <p>
              Ženy mají obecně nižší podíl tělesné vody, která alkohol
              rozpouští. Widmarkův distribuční faktor je u mužů přibližně 0,68,
              u žen 0,55. Při stejném množství alkoholu a stejné váze dosáhne
              žena vyšší hladiny alkoholu v krvi.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">
              Chceš přesnější odhad pro sebe?
            </h2>
            <p>
              Na{" "}
              <Link
                href="/alkoholmetr"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                alkoholmetru
              </Link>{" "}
              nebo{" "}
              <Link
                href="/alkulacka"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                alkulačce
              </Link>{" "}
              si zadáš vlastní váhu, pohlaví i přesné nápoje — a dostaneš
              orientační odhad šitý na tebe.
            </p>
          </section>
        </div>

        {/* Internal links */}
        <div className="flex flex-col gap-2 border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-600 mb-2 text-center">
            Zjisti víc:
          </p>
          <Link
            href="/alkoholmetr"
            className="flex justify-between items-center px-4 py-2.5 bg-gray-800 border border-gray-700 hover:border-amber-500 rounded-lg text-sm text-gray-300 hover:text-amber-400 transition-colors"
          >
            <span>🧪 Alkoholmetr</span>
            <span className="text-xs text-gray-600">orientační odhad promile</span>
          </Link>
          <Link
            href="/alkulacka"
            className="flex justify-between items-center px-4 py-2.5 bg-gray-800 border border-gray-700 hover:border-amber-500 rounded-lg text-sm text-gray-300 hover:text-amber-400 transition-colors"
          >
            <span>🧮 Alkulačka</span>
            <span className="text-xs text-gray-600">alkoholová kalkulačka</span>
          </Link>
          <Link
            href="/"
            className="flex justify-between items-center px-4 py-2.5 bg-gray-800 border border-gray-700 hover:border-amber-500 rounded-lg text-sm text-gray-300 hover:text-amber-400 transition-colors"
          >
            <span>🍺 Kolikpiv.cz</span>
            <span className="text-xs text-gray-600">přepočet ceny na piva</span>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-700 text-xs">
            Švejk by si dal další pivo a přepočítal to znovu. 🍺
          </p>
        </div>
      </div>
    </div>
  );
}
