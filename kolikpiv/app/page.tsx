import { Suspense } from "react";
import { Metadata } from "next";
import CalculatorClient from "./components/CalculatorClient";
import beerDeals from "../data/beer-deals.json";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // In Next.js 15, searchParams must be awaited
  const params = await searchParams;
  const price = (params.price as string) || "0";
  const beerPrice = (params.beerPrice as string) || "50";
  const label = (params.label as string) || "";

  // Build dynamic OG image URL with query params
  const ogImageUrl = `https://kolikpiv.cz/api/og?price=${price}&beerPrice=${beerPrice}${label ? `&label=${encodeURIComponent(label)}` : ""}`;

  return {
    title: "Kolik piv to je? | Přepočet ceny na piva",
    description: "Zjisti, kolik piv stojí cokoliv 🍺",
    openGraph: {
      title: "Kolik piv to je? | Přepočet ceny na piva",
      description: "Zjisti, kolik piv stojí cokoliv 🍺",
      url: "https://kolikpiv.cz",
      siteName: "Kolik piv to je?",
      locale: "cs_CZ",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Kolik piv to je?",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Kolik piv to je? | Přepočet ceny na piva",
      description: "Zjisti, kolik piv stojí cokoliv 🍺",
      images: [ogImageUrl],
    },
  };
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#fdf8f0] shadow-2xl p-8 text-center">
            <p className="font-mono text-sm text-stone-500">Načítám kalkulačku…</p>
          </div>
        </div>
      }
    >
      <CalculatorClient beerDeals={beerDeals} />
    </Suspense>
  );
}
