"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

// Hero taglines - rotating subtitle under the main title
const HERO_TAGLINES = [
  "Přepočítej si každou blbost na piva.",
  "Všechno má svou cenu v pivech.",
  "Kolik to stojí? Teď to víš v pivech.",
  "Realita v jednotkách, kterým rozumíš.",
  "Konečně ceny, co dávají smysl.",
];

// Fun messages for different beer count ranges
const LOW_MESSAGES = [
  "To je skoro zadarmo.",
  "Tohle ani neřeš.",
  "Nula mrdů dáno.",
  "To dáš bez mrknutí oka.",
  "Jedno rychlý a jde se dál.",
  "Tohle je ještě v klidu.",
  "Skoro jak nic.",
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
const ULTRA_MESSAGE = "Tohle už je životní rozhodnutí.";

const getRandomMessage = (beers: number): string => {
  // Special message for ultra high values
  if (beers > 100) {
    return ULTRA_MESSAGE;
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

export default function Home() {
  const [price, setPrice] = useState<string>("");
  const [beerPrice, setBeerPrice] = useState<string>("50");
  const [monthlyWage, setMonthlyWage] = useState<string>("50000");
  const [result, setResult] = useState<{ beers: number; hours: number; message: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [heroTagline] = useState<string>(() =>
    HERO_TAGLINES[Math.floor(Math.random() * HERO_TAGLINES.length)]
  );

  // Load from localStorage on mount
  useEffect(() => {
    const savedBeerPrice = localStorage.getItem("beerPrice");
    const savedMonthlyWage = localStorage.getItem("monthlyWage");

    if (savedBeerPrice) setBeerPrice(savedBeerPrice);
    if (savedMonthlyWage) setMonthlyWage(savedMonthlyWage);
  }, []);

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

    const beers = Math.round(priceNum / beerPriceNum);
    const hourlyWage = monthlyWageNum / 168;
    const hours = parseFloat((priceNum / hourlyWage).toFixed(1));
    const message = getRandomMessage(beers);

    setShowResult(false);
    setTimeout(() => {
      setResult({ beers, hours, message });
      setShowResult(true);
    }, 50);
  };

  const handleShare = async () => {
    if (!result) return;

    const shareText = `Tohle je ${result.beers} piv 🍺\n\n👉 kolikpiv.cz`;

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

        <div className="space-y-4">
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
          </div>

          <button
            onClick={calculate}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Kolik piv to je?
          </button>

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
                      Tohle je {Math.floor(result.beers / 20)}{" "}
                      {(() => {
                        const crates = Math.floor(result.beers / 20);
                        if (crates === 1) return "basa";
                        if (crates >= 2 && crates <= 4) return "basy";
                        return "bas";
                      })()}
                      {result.beers % 20 > 0 && ` a ${result.beers % 20} piv`} 🍺📦
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      ({result.beers} piv celkem)
                    </p>
                  </>
                ) : (
                  <p className="text-3xl font-bold mb-2">
                    Tohle je {result.beers} piv 🍺
                  </p>
                )}
                <p className="text-gray-400 mb-4">
                  = {result.hours} hodin práce
                </p>
                <p className="text-amber-400 text-lg italic mb-6">
                  {result.message}
                </p>
                <button
                  onClick={handleShare}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sdílet 🍺
                </button>
              </div>

              {result.beers >= 20 && (
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
                    <div className="bg-white p-4 rounded-lg">
                      <QRCodeSVG
                        value="SPD*1.0*ACC:CZ5055000000008216903002*AM:50.00*CC:CZK*MSG:Pivo"
                        size={200}
                        level="M"
                      />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    Naskenuj v bankovní aplikaci
                  </p>
                  <p className="text-amber-500 font-semibold">
                    👉 50 Kč = 1 pivo pro mě
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* SEO Summary */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            Kolikpiv.cz je jednoduchá online kalkulačka, která převádí ceny na počet piv.
            Zadej částku a zjisti, kolik piv za ni dostaneš.
          </p>
        </div>
      </div>
    </div>
  );
}
