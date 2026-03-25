import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { GOATCOUNTER_CODE } from "./config/analytics";

export const metadata: Metadata = {
  title: "Kolik piv to je? | Přepočet ceny na piva",
  description: "Zjisti, kolik piv stojí cokoliv. Jednoduchá a zábavná kalkulačka, která převádí ceny na piva 🍺.",
  openGraph: {
    title: "Kolik piv to je? | Přepočet ceny na piva",
    description: "Zjisti, kolik piv stojí cokoliv. Jednoduchá a zábavná kalkulačka, která převádí ceny na piva 🍺.",
    url: "https://kolikpiv.cz",
    siteName: "Kolik piv to je?",
    locale: "cs_CZ",
    type: "website",
    // Note: images are generated dynamically in page.tsx based on query params
  },
  twitter: {
    card: "summary_large_image",
    title: "Kolik piv to je? | Přepočet ceny na piva",
    description: "Zjisti, kolik piv stojí cokoliv. Jednoduchá a zábavná kalkulačka, která převádí ceny na piva 🍺.",
    // Note: images are generated dynamically in page.tsx based on query params
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="bg-gray-900 text-white antialiased">
        {children}
        <Analytics />
        {GOATCOUNTER_CODE && (
          <Script
            data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`}
            src="//gc.zgo.at/count.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
