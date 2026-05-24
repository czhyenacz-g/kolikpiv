import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { SEO_EXAMPLES, getExample, getBeerWord } from "../../data/seo-examples";

export const dynamicParams = false;

export function generateStaticParams() {
  return SEO_EXAMPLES.map((e) => ({ slug: e.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const example = getExample(slug);
  if (!example) return {};
  return {
    title: example.title,
    description: example.description,
    alternates: { canonical: `https://kolikpiv.cz/${slug}` },
    openGraph: {
      title: example.title,
      description: example.description,
      url: `https://kolikpiv.cz/${slug}`,
      siteName: "Kolik piv to je?",
      locale: "cs_CZ",
      type: "website",
    },
  };
}

export default async function SeoExamplePage({ params }: Props) {
  const { slug } = await params;
  const example = getExample(slug);
  if (!example) notFound();

  const beers = Math.floor(example.amount / example.beerPrice);
  const beerWord = getBeerWord(beers);
  const crates = Math.floor(beers / 20);
  const related = example.relatedSlugs.map(
    (s) => SEO_EXAMPLES.find((e) => e.slug === s)!
  );

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

        {/* H1 */}
        <h1 className="text-2xl font-bold text-center mb-8">{example.h1}</h1>

        {/* Result card */}
        <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg text-center mb-6">
          <p className="text-sm text-gray-400 mb-1">To je přibližně</p>
          <p className="text-7xl font-black text-amber-400 leading-none mb-1">
            {beers.toLocaleString("cs-CZ")}
          </p>
          <p className="text-2xl font-bold mb-3">{beerWord} 🍺</p>
          {crates >= 1 && (
            <p className="text-gray-500 text-sm mb-2">
              ({crates} {crates === 1 ? "basa" : crates < 5 ? "basy" : "basů"}
              {beers % 20 > 0
                ? ` a ${beers % 20} ${getBeerWord(beers % 20)}`
                : ""}{" "}
              📦)
            </p>
          )}
          <p className="text-gray-600 text-xs">
            při ceně piva {example.beerPrice} Kč
          </p>
        </div>

        {/* Human text */}
        <p className="text-gray-300 text-center leading-relaxed mb-8">
          {example.humanText}
        </p>

        {/* CTA */}
        <div className="text-center mb-10">
          <Link
            href={`/?price=${example.amount}&beerPrice=${example.beerPrice}`}
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Přepočítej sám 🍺
          </Link>
          <p className="text-xs text-gray-600 mt-2">
            nebo zadej vlastní částku na kolikpiv.cz
          </p>
        </div>

        {/* Related */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <p className="text-xs text-gray-600 mb-4 text-center">
            Podobné přepočty:
          </p>
          <div className="flex flex-col gap-3">
            {related.map((r) => {
              const rBeers = Math.floor(r.amount / r.beerPrice);
              return (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="flex justify-between items-center px-4 py-2.5 bg-gray-800 border border-gray-700 hover:border-amber-500 rounded-lg text-sm text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <span>{r.h1}</span>
                  <span className="text-amber-500 font-semibold ml-3 whitespace-nowrap">
                    {rBeers.toLocaleString("cs-CZ")} {getBeerWord(rBeers)} 🍺
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-zinc-700 text-xs">
            Výpočet je orientační. Cena piva se liší podle hospody.
          </p>
        </div>
      </div>
    </div>
  );
}
