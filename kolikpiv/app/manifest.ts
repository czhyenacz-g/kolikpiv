import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kolik piv to je?",
    short_name: "Kolik piv",
    description: "Zjisti, kolik piv stojí cokoliv. Jednoduchá kalkulačka, která převádí ceny na piva.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0d1520",
    theme_color: "#fbbf24",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
