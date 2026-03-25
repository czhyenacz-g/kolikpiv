import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kolik piv to je? | Přepočet ceny na piva",
  description: "Zjisti, kolik piv stojí cokoliv. Jednoduchá a zábavná kalkulačka, která převádí ceny na piva 🍺.",
  openGraph: {
    title: "Kolik piv to je?",
    description: "Zjisti, kolik piv stojí cokoliv 🍺",
    url: "https://kolikpiv.cz",
    siteName: "Kolik piv to je?",
    locale: "cs_CZ",
    type: "website",
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
      </body>
    </html>
  );
}
