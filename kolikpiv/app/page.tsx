import { Suspense } from "react";
import { Metadata } from "next";
import CalculatorClient from "./components/CalculatorClient";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // In Next.js 15, searchParams must be awaited
  const params = await searchParams;
  const price = params.price as string | undefined;
  const beerPrice = (params.beerPrice as string) || "50";

  // Base URL for OG images (absolute URLs required)
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "https://kolikpiv.cz";

  // Build dynamic OG image URL
  let ogImageUrl = `${baseUrl}/api/og`;
  if (price) {
    ogImageUrl += `?price=${price}&beerPrice=${beerPrice}`;
  }

  return {
    openGraph: {
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
      images: [ogImageUrl],
    },
  };
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="text-gray-400 text-lg">
              Načítám kalkulačku...
            </div>
          </div>
        </div>
      }
    >
      <CalculatorClient />
    </Suspense>
  );
}
