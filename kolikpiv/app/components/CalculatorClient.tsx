"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { track } from "@vercel/analytics";
import { GOATCOUNTER_CODE } from "../config/analytics";

// Hero taglines - rotating subtitle under the main title
const HERO_TAGLINES = [
  "Přepočítej si každou blbost na piva.",
  "Kolik to stojí? Teď to víš v pivech.",
  "Realita v pivech bolí víc.",
  "Možná si to po přepočtu rozmyslíš.",
  "Každá cena se dá vysvětlit v pivech.",
  "Zjisti, kolik piv za to vlastně je.",
];

// Fun messages for different beer count ranges
const LOW_MESSAGES = [
  "To mě ani nezačne.",
  "To mě akorát naštve.",
  "To je jen na chuť.",
  "Tohle si dám a pak koukám.",
  "Tohle fakt nechceš.",
];

const MEDIUM_MESSAGES = [
  "To už je slušná jízda.",
  "Tady už začíná sranda.",
  "Jedna lepší noc.",
  "Tohle už ucítíš.",
  "Za tohle už něco máš.",
  "To už není jen tak.",
  "Tohle má následky.",
];

const HIGH_MESSAGES = [
  "To už je na basu.",
  "Tohle už je víkend s partou.",
  "To už není sranda.",
  "Tady už se píšou příběhy.",
  "Tohle si budeš pamatovat… možná.",
  "Tohle už má grády.",
  "To už je větší akce.",
];

const EXTREME_MESSAGES = [
  "Tohle bude pořádnej fesťák!",
  "Legend… wait for it… dární.",
  "Tohle je na kroniku.",
  "Tohle už je jiná liga.",
  "Tohle bolí ještě v pondělí.",
  "Tady končí sranda a začíná legenda.",
  "Tohle už chce vlastní aftermovie.",
];

// Special message for very high beer counts (>100)
const ULTRA_MESSAGES = [
  "Jdeš se upít k smrti? Tak nalej i mě :-)",
  "Máš dědictví v pivech?",
];

const LAST_UPDATED = "26. 3. 2026";

const getRandomMessage = (beers: number): string => {
  // Special message for ultra high values
  if (beers > 100) {
    return ULTRA_MESSAGES[Math.floor(Math.random() * ULTRA_MESSAGES.length)];
  }

  let messages: string[];

  if (beers <= 5) {
    messages = LOW_MESSAGES;
  } else if (beers <= 20) {
    messages = MEDIUM_MESSAGES;
  } else if (beers <= 60) {
    messages = HIGH_MESSAGES;
  } else {
    messages = EXTREME_MESSAGES;
  }

  return messages[Math.floor(Math.random() * messages.length)];
};

const getBeerWord = (count: number): string => {
  if (count === 1) return "pivo";
  if (count >= 2 && count <= 4) return "piva";
  return "piv";
};

const getDonationAmount = (beerPrice: number): number => {
  if (!beerPrice || beerPrice < 50) return 50;
  if (beerPrice > 2000) return 2000;
  return Math.floor(beerPrice);
};

interface BeerDeal {
  id: string;
  name: string;
  icon?: string;
  pricePerPiece: number;
  shop: string;
  url?: string;
  isBestDeal?: boolean;
}

export default function CalculatorClient({ beerDeals }: { beerDeals: BeerDeal[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [price, setPrice] = useState<string>("");
  const [beerPrice, setBeerPrice] = useState<string>("50");
  const [monthlyWage, setMonthlyWage] = useState<string>("35000");
  const [result, setResult] = useState<{ beers: number; hours: number; message: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [qrDownloadMessage, setQrDownloadMessage] = useState<string>("");
  const [copyLinkMessage, setCopyLinkMessage] = useState<string>("");
  const [heroTagline, setHeroTagline] = useState<string>(HERO_TAGLINES[0]);

  const qrRef = useRef<HTMLDivElement>(null);
  const [visitorCount, setVisitorCount] = useState<string | null>(null);

  // Set random tagline after mount to avoid hydration mismatch
  useEffect(() => {
    const randomTagline = HERO_TAGLINES[Math.floor(Math.random() * HERO_TAGLINES.length)];
    setHeroTagline(randomTagline);
  }, []);

  // Load from URL query params and localStorage on mount
  useEffect(() => {
    // First, try to load from localStorage
    const savedBeerPrice = localStorage.getItem("beerPrice");
    const savedMonthlyWage = localStorage.getItem("monthlyWage");

    // Read query params
    const urlPrice = searchParams.get("price");
    const urlBeerPrice = searchParams.get("beerPrice");
    const urlSalary = searchParams.get("salary");

    // Set values, prioritizing URL params over localStorage
    if (urlBeerPrice && !isNaN(parseFloat(urlBeerPrice))) {
      setBeerPrice(urlBeerPrice);
    } else if (savedBeerPrice) {
      setBeerPrice(savedBeerPrice);
    }

    if (urlSalary && !isNaN(parseFloat(urlSalary))) {
      setMonthlyWage(urlSalary);
    } else if (savedMonthlyWage) {
      setMonthlyWage(savedMonthlyWage);
    }

    if (urlPrice && !isNaN(parseFloat(urlPrice))) {
      setPrice(urlPrice);

      // Auto-calculate if we have all params
      const priceNum = parseFloat(urlPrice);
      const beerPriceNum = parseFloat(urlBeerPrice || savedBeerPrice || "50");
      const monthlyWageNum = parseFloat(urlSalary || savedMonthlyWage || "35000");

      if (!isNaN(priceNum) && !isNaN(beerPriceNum) && !isNaN(monthlyWageNum)) {
        const beers = Math.floor(priceNum / beerPriceNum);
        const hourlyWage = monthlyWageNum / 168;
        const hours = parseFloat((priceNum / hourlyWage).toFixed(1));
        const message = getRandomMessage(beers);

        setResult({ beers, hours, message });
        setShowResult(true);
      }
    }
  }, [searchParams]);

  // Fetch public visitor count from GoatCounter
  useEffect(() => {
    if (!GOATCOUNTER_CODE) return;
    fetch(`https://${GOATCOUNTER_CODE}.goatcounter.com/counter/%2F.json`)
      .then((r) => r.json())
      .then((data) => setVisitorCount(data.count))
      .catch(() => {});
  }, []);

  // Track QR section shown
  useEffect(() => {
    if (result && result.beers >= 20) {
      track("qr_section_shown", { beers: result.beers });
    }
  }, [result]);

  // Track deals section shown
  useEffect(() => {
    const totalPrice = parseFloat(price);
    if (result && totalPrice > 0) {
      track("deals_shown", { totalPrice });
    }
  }, [result, price]);

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("beerPrice", beerPrice);
  }, [beerPrice]);

  useEffect(() => {
    localStorage.setItem("monthlyWage", monthlyWage);
  }, [monthlyWage]);

  const calculate = () => {
    const priceNum = parseFloat(price);
    const beerPriceNum = parseFloat(beerPrice);
    const monthlyWageNum = parseFloat(monthlyWage);

    // Check if price is empty or invalid
    if (!price || price.trim() === "" || isNaN(priceNum)) {
      setErrorMessage("Nevyplnil jsi, kolik jsi chtěl utratit mimo hospodu!");
      setResult(null);
      return;
    }

    if (isNaN(beerPriceNum) || isNaN(monthlyWageNum)) {
      return;
    }

    // Clear error message if validation passes
    setErrorMessage("");

    const beers = Math.floor(priceNum / beerPriceNum);
    const hourlyWage = monthlyWageNum / 168;
    const hours = parseFloat((priceNum / hourlyWage).toFixed(1));
    const message = getRandomMessage(beers);

    // Update URL with current calculation
    const params = new URLSearchParams();
    params.set("price", price);
    params.set("beerPrice", beerPrice);
    params.set("salary", monthlyWage);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    track("calculator_submit", { price: priceNum, beerPrice: beerPriceNum, beers });

    setShowResult(false);
    setTimeout(() => {
      setResult({ beers, hours, message });
      setShowResult(true);
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  const handleCopyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopyLinkMessage("Odkaz zkopírován 👍");
      setTimeout(() => setCopyLinkMessage(""), 2500);
    } catch {
      // fallback for older browsers
      setCopyLinkMessage("Zkopíruj URL z adresního řádku");
      setTimeout(() => setCopyLinkMessage(""), 2500);
    }
  };

  const handleSurprise = () => {
    const r = Math.random();
    let value: number;
    if (r < 0.3) {
      value = Math.round(100 + Math.random() * 400);
    } else if (r < 0.7) {
      value = Math.round(500 + Math.random() * 4500);
    } else {
      value = Math.round(5000 + Math.random() * 45000);
    }
    handleExample(value);
  };

  const handleExample = (value: number) => {
    const priceStr = String(value);
    const beerPriceNum = parseFloat(beerPrice);
    const monthlyWageNum = parseFloat(monthlyWage);

    setPrice(priceStr);
    setErrorMessage("");

    if (!isNaN(beerPriceNum) && !isNaN(monthlyWageNum)) {
      const beers = Math.floor(value / beerPriceNum);
      const hourlyWage = monthlyWageNum / 168;
      const hours = parseFloat((value / hourlyWage).toFixed(1));
      const message = getRandomMessage(beers);

      const params = new URLSearchParams();
      params.set("price", priceStr);
      params.set("beerPrice", beerPrice);
      params.set("salary", monthlyWage);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      track("calculator_submit", { price: value, beerPrice: beerPriceNum, beers });

      setShowResult(false);
      setTimeout(() => {
        setResult({ beers, hours, message });
        setShowResult(true);
      }, 50);
    }
  };

  const handleShare = async () => {
    if (!result) return;

    track("share_click", { beers: result.beers });

    // Get current URL with query params
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://kolikpiv.cz';

    // Random emotional variants for the beer line
    const beerWord = getBeerWord(result.beers);
    const variants = [
      `To je za ${result.beers} ${beerWord} 🍺`,
      `To je za ${result.beers} ${beerWord} 😳🍺`,
      `To je za ${result.beers} ${beerWord}!!! 🍺`,
      `To už bolí… za ${result.beers} ${beerWord} 🍺`,
    ];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];

    const shareText = `Za ${price} Kč?\n\n${randomVariant}\n\nKolik piv stojí tvoje věci?\n👉 ${currentUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Zkopírováno 👍");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    track("qr_download_click");

    try {
      // Check for canvas element first
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        // Canvas: directly convert to PNG
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'kolikpiv-qr.png';
        link.click();

        setQrDownloadMessage("QR uložen 👍");
        setTimeout(() => setQrDownloadMessage(""), 2000);
        return;
      }

      // SVG: convert to PNG via canvas
      const svg = qrRef.current.querySelector('svg');
      if (!svg) return;

      // Get SVG dimensions
      const svgRect = svg.getBoundingClientRect();
      const svgWidth = svgRect.width;
      const svgHeight = svgRect.height;

      // Serialize SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

      // Create image from SVG
      const img = new Image();
      img.onload = () => {
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = svgWidth;
        canvas.height = svgHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          alert("Nepodařilo se uložit QR kód");
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Convert canvas to PNG and download
        const pngDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngDataUrl;
        link.download = 'kolikpiv-qr.png';
        link.click();

        // Show feedback
        setQrDownloadMessage("QR uložen 👍");
        setTimeout(() => setQrDownloadMessage(""), 2000);
      };

      img.onerror = () => {
        alert("Nepodařilo se uložit QR kód");
      };

      img.src = svgDataUrl;
    } catch (err) {
      console.error("Failed to download QR:", err);
      alert("Nepodařilo se uložit QR kód");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-1">
          Kolik piv to je?
        </h1>
        <p className="text-gray-500 text-center text-xs mb-3">
          (zjistíš na kolikpiv.cz)
        </p>
        <p className="text-gray-400 text-center mb-8 text-sm">
          {heroTagline}
        </p>

        {/* Quick examples */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs">Zkus třeba:</p>
            <button
              type="button"
              onClick={handleSurprise}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-amber-500 hover:text-amber-400 rounded-full text-xs text-gray-300 transition-colors"
            >
              🎲 Překvap mě
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "kebab po párty", value: 150 },
              { label: "Netflix na rok", value: 1900 },
              { label: "víkend v Praze", value: 8000 },
              { label: "iPhone", value: 35000 },
              { label: "zásnubní prsten", value: 50000 },
              { label: "nové auto", value: 400000 },
            ].map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => handleExample(ex.value)}
                className="px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-amber-500 hover:text-amber-400 rounded-full text-xs text-gray-300 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Kolik to stojí? (CZK)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition"
              placeholder="např. 1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cena piva v hospodě (CZK)
            </label>
            <input
              type="number"
              value={beerPrice}
              onChange={(e) => setBeerPrice(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Měsíční mzda (CZK)
            </label>
            <input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition"
            />
            <p className="mt-1 text-xs text-zinc-400 text-center">Průměr v ČR ~30–33 tisíc čistého</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Kolik piv to je?
          </button>
        </form>

        {errorMessage && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-center">
            <p className="text-red-400 font-semibold">
              {errorMessage}
            </p>
          </div>
        )}

        {result && (
          <>
            <div
              className={`mt-6 p-6 bg-gray-800 border border-gray-700 rounded-lg text-center transition-opacity duration-500 ${
                showResult ? "opacity-100" : "opacity-0"
              }`}
            >
              {result.beers < 1 ? (
                <p className="text-3xl font-bold mb-2">
                  Ani na jedno pivo 😄
                </p>
              ) : result.beers >= 20 ? (
                <>
                  <p className="text-3xl font-bold mb-2">
                    Tohle je za {Math.floor(result.beers / 20)}{" "}
                    {(() => {
                      const crates = Math.floor(result.beers / 20);
                      if (crates === 1) return "basa";
                      if (crates >= 2 && crates <= 4) return "basy";
                      return "bas";
                    })()}
                    {result.beers % 20 > 0 && ` a ${result.beers % 20} ${getBeerWord(result.beers % 20)}`} 🍺📦
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    ({result.beers} {getBeerWord(result.beers)} celkem)
                  </p>
                </>
              ) : (
                <p className="text-3xl font-bold mb-2">
                  Tohle je za {result.beers} {getBeerWord(result.beers)} 🍺
                </p>
              )}
              <p className="text-gray-400 mb-1">
                = {result.hours} hodin práce
              </p>
              <p className="text-gray-400 text-sm mb-4">
                = {Math.round((result.hours / 8) * 100)} % pracovního dne
                {Math.round((result.hours / 8) * 100) > 100 && " (víc než jeden den 😄)"}
              </p>
              <p className="text-amber-400 text-lg italic mb-6">
                {result.message}
              </p>
              <button
                onClick={handleShare}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sdílej kamarádům 🍺
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition"
              >
                {copyLinkMessage || "Kopírovat odkaz"}
              </button>
            </div>

{result.beers >= 20 && (() => {
              const beerPriceNum = parseFloat(beerPrice);
              const donationAmount = getDonationAmount(beerPriceNum);
              const isCapped = beerPriceNum > 2000;
              const qrValue = `SPD*1.0*ACC:CZ5055000000008216903002*AM:${donationAmount}.00*CC:CZK*MSG:Pivo`;

              return (
                <div
                  className={`mt-6 p-6 bg-gray-800 border border-gray-700 rounded-lg text-center transition-opacity duration-500 ${
                    showResult ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <h2 className="text-xl font-bold mb-4">
                    Kup mi pivo 🍺
                  </h2>
                  <p className="text-gray-300 mb-6">
                    To už je minimálně na basu… tak ať se taky napiju 🍺
                  </p>
                  <div className="flex justify-center mb-4">
                    <div
                      ref={qrRef}
                      onClick={handleDownloadQR}
                      className="bg-white p-4 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      title="Klikni pro uložení QR kódu"
                    >
                      <QRCodeSVG
                        value={qrValue}
                        size={200}
                        level="M"
                      />
                    </div>
                  </div>
                  {qrDownloadMessage && (
                    <p className="text-green-400 text-sm mb-2 font-semibold">
                      {qrDownloadMessage}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mb-2">
                    Naskenuj v bankovní aplikaci
                  </p>
                  <p className="text-zinc-400 text-xs mb-2 md:hidden">
                    Klikni pro uložení 🍺
                  </p>
                  {donationAmount === 50 ? (
                    <p className="text-amber-500 font-semibold">
                      👉 50 Kč = 1 pivo pro mě
                    </p>
                  ) : (
                    <>
                      <p className="text-amber-500 font-semibold">
                        👉 QR je připravený na {donationAmount} Kč
                      </p>
                      {isCapped && (
                        <p className="text-gray-500 text-xs mt-2">
                          Původní cena piva: {beerPriceNum} Kč 😄
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })()}
          </>
        )}

        {/* Store beer deals */}
        {(() => {
          const totalPrice = parseFloat(price);
          if (!result || isNaN(totalPrice) || totalPrice <= 0) return null;

          const sorted = [...beerDeals].sort((a, b) => {
            if (a.isBestDeal && !b.isBestDeal) return -1;
            if (!a.isBestDeal && b.isBestDeal) return 1;
            return a.pricePerPiece - b.pricePerPiece;
          });

          return (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-center mb-1">🔥 Co za to koupíš v obchodě</h2>
              <p className="text-gray-500 text-sm text-center mb-1">Orientačně podle ceny za kus 🍺</p>
              <p className="text-zinc-500 text-xs text-center mb-6">Ceny aktualizovány: {LAST_UPDATED}</p>
              <div className="space-y-3">
                {sorted.map((deal) => {
                  const pieceCount = Math.floor(totalPrice / deal.pricePerPiece);
                  const isClickable = Boolean(deal.url);

                  const inner = (
                    <>
                      {deal.isBestDeal && (
                        <p className="text-amber-400 text-xs font-semibold mb-1">🔥 Nejvýhodnější</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-2xl leading-none">{deal.icon ?? "🍺"}</span>
                        <p className="font-semibold text-white text-sm">{deal.name}</p>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">od {deal.pricePerPiece} Kč / kus</p>
                      {pieceCount > 0 ? (
                        <p className="text-amber-400 text-sm mt-1">{pieceCount} piv 🍺</p>
                      ) : (
                        <p className="text-gray-600 text-sm mt-1">Na tohle zatím nestačí</p>
                      )}
                      {deal.isBestDeal && (
                        <p className="text-gray-500 text-xs mt-1">Nejlepší cena právě teď</p>
                      )}
                      {isClickable && (
                        <p className="text-blue-400 text-xs mt-1.5">Mrkni na ceny 🍺</p>
                      )}
                    </>
                  );

                  if (isClickable) {
                    return (
                      <a
                        key={deal.id}
                        href={deal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("affiliate_click", {
                          beer: deal.name,
                          pricePerPiece: deal.pricePerPiece,
                          pieceCount,
                          totalPrice,
                        })}
                        className={`block p-4 rounded-lg border transition-colors ${
                          deal.isBestDeal
                            ? "bg-gray-800 border-amber-500/60 hover:border-amber-400 hover:bg-gray-700"
                            : "bg-gray-800 border-gray-600 hover:border-amber-500 hover:bg-gray-700"
                        }`}
                      >
                        {inner}
                      </a>
                    );
                  }
                  return (
                    <div
                      key={deal.id}
                      className={`p-4 rounded-lg border ${
                        deal.isBestDeal
                          ? "bg-gray-800 border-amber-500/60"
                          : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      {inner}
                    </div>
                  );
                })}
              </div>
              <p className="text-zinc-600 text-xs text-center mt-4">Ceny se mohou lišit podle aktuálních akcí 🍺</p>
            </div>
          );
        })()}

        {/* SEO Summary */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto">
            Kolikpiv.cz je jednoduchá online kalkulačka, která převádí ceny na počet piv.
            Zadej částku a zjisti, kolik piv za ni dostaneš. Nejde o alkohol kalkulačku ani
            výpočet promile, ale o zábavný způsob, jak si představit hodnotu peněz. Například
            zjistíš, kolik piv stojí telefon, dovolená nebo běžné nákupy.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center">
          <p className="text-zinc-500 text-xs">Experiment 🍺</p>
          <p className="text-zinc-500 text-xs">Něco může být nepřesné… ale piva sedí 😄</p>
        </div>

        {/* Footer stats */}
        <div className="mt-4 pb-6 text-center">
          {visitorCount && (
            <p className="text-gray-600 text-xs">
              Návštěv celkem: {visitorCount}
            </p>
          )}
          <p className="text-gray-700 text-xs mt-1">
            Díky, že to šíříš 🍺
          </p>
        </div>
      </div>
    </div>
  );
}
