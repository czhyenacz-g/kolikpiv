import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kolik piv to je? 🍺",
  description: "Kalkulačka ceny v pivech",
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
