"use client";

import { useState, useRef } from "react";
import {
  type DrinkEntry,
  type Gender,
  calcAlcohol,
  calculateCurrentPromileWithDuration,
  calcTimeToPromile,
  getPromileDisplay,
} from "../../lib/alcohol";
import { ALCOHOL_PRESETS } from "../../data/alcohol-presets";
import PromileThermometer from "./PromileThermometer";

function toDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

function formatClock(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Normalizace číselného vstupu po opuštění pole (blur).
// parseFloat zvládá "09" → 9, "08.8" → 8.8, "8.80" → 8.8.
function normalizeDecimal(s: string, min: number, max: number, fallback: number): string {
  const num = parseFloat(s);
  if (isNaN(num)) return String(fallback);
  return String(Math.min(max, Math.max(min, num)));
}

function normalizeInteger(s: string, min: number, max: number, fallback: number): string {
  const num = parseFloat(s); // parseFloat aby fungoval "80.7" → 81
  if (isNaN(num)) return String(fallback);
  return String(Math.min(max, Math.max(min, Math.round(num))));
}

export default function AlcoholCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState<string>("80");
  const [stoppedAt, setStoppedAt] = useState<string>(() =>
    toDateTimeLocal(new Date())
  );
  const [startedAt, setStartedAt] = useState<string>("");
  const [startedAtManual, setStartedAtManual] = useState(false);
  const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
  const [result, setResult] = useState<ReturnType<typeof calcAlcohol> | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const counter = useRef(0);

  // Zobrazované textové hodnoty pro volume/abv inputy — oddělené od číselných hodnot v DrinkEntry.
  // Umožňují dočasně prázdné nebo neúplné vstupy bez okamžité konverze na 0.
  const [drinkTexts, setDrinkTexts] = useState<Record<string, { volText: string; abvText: string }>>({});

  function newId() {
    counter.current += 1;
    return String(counter.current);
  }

  function getVolText(drink: DrinkEntry): string {
    return drinkTexts[drink.id]?.volText ?? String(drink.volumeMl);
  }
  function getAbvText(drink: DrinkEntry): string {
    return drinkTexts[drink.id]?.abvText ?? String(drink.abv);
  }
  function setVolText(id: string, text: string) {
    setDrinkTexts(prev => ({ ...prev, [id]: { ...(prev[id] ?? { volText: "", abvText: "" }), volText: text } }));
  }
  function setAbvText(id: string, text: string) {
    setDrinkTexts(prev => ({ ...prev, [id]: { ...(prev[id] ?? { volText: "", abvText: "" }), abvText: text } }));
  }

  function getDefaultStartedAt(): string {
    const stoppedAtDate = stoppedAt ? new Date(stoppedAt) : new Date();
    const drinkCount = drinks.reduce((s, d) => {
      const c = Number(d.count);
      return s + (isFinite(c) && c >= 1 ? c : 1);
    }, 0);
    const durationMs = Math.min(Math.max(drinkCount * 20, 30), 300) * 60_000;
    return toDateTimeLocal(new Date(stoppedAtDate.getTime() - durationMs));
  }

  const effectiveStartedAt = startedAtManual ? startedAt : getDefaultStartedAt();

  function addPreset(presetId: string) {
    const preset = ALCOHOL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const existing = drinks.find((d) => d.presetId === presetId);
    if (existing) {
      updateDrink(existing.id, { count: existing.count + 1 });
      return;
    }
    const id = newId();
    setDrinks(prev => [...prev, {
      id, presetId: preset.id, label: preset.label,
      volumeMl: preset.volumeMl, abv: preset.abv, count: 1,
    }]);
    setDrinkTexts(prev => ({
      ...prev,
      [id]: { volText: String(preset.volumeMl), abvText: String(preset.abv) },
    }));
    setResult(null);
  }

  function addCustomDrink() {
    const id = newId();
    setDrinks(prev => [...prev, { id, label: "Vlastní nápoj", volumeMl: 500, abv: 5, count: 1 }]);
    setDrinkTexts(prev => ({ ...prev, [id]: { volText: "500", abvText: "5" } }));
    setResult(null);
  }

  function removeDrink(id: string) {
    setDrinks(prev => prev.filter(d => d.id !== id));
    setDrinkTexts(prev => { const n = { ...prev }; delete n[id]; return n; });
    setResult(null);
  }

  function updateDrink(id: string, updates: Partial<DrinkEntry>) {
    setDrinks((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    setResult(null);
  }

  function calculate() {
    const weightNum = Math.round(parseFloat(weight));
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 200) {
      setError("Zadej hmotnost mezi 30 a 200 kg.");
      return;
    }
    if (drinks.length === 0) {
      setError("Přidej aspoň jeden nápoj.");
      return;
    }
    setError("");
    setResult(calcAlcohol(drinks, weightNum, gender));
  }

  // Derive current promile from result + time info on every render
  const stoppedAtDate = stoppedAt ? new Date(stoppedAt) : null;
  const startedAtDate = effectiveStartedAt ? new Date(effectiveStartedAt) : null;
  const now = new Date();
  const isFuture = stoppedAtDate ? stoppedAtDate > now : false;

  const promileCalc = result
    ? calculateCurrentPromileWithDuration({
        initialPromile: result.bacEstimate,
        startedAt: startedAtDate,
        stoppedAt: stoppedAtDate,
        now,
      })
    : null;

  const currentPromile = promileCalc?.currentPromile ?? 0;
  const drinkingDurationHours = promileCalc?.drinkingDurationHours ?? 0;
  const showStartedAfterStoppedWarning = promileCalc?.warning === "startedAfterStopped";

  // Čas do 0 ‰ a do záporné rezervy −0,3 ‰
  const hoursToZero = result ? calcTimeToPromile(currentPromile, 0) : 0;
  const targetAtZero = new Date(now.getTime() + hoursToZero * 3_600_000);
  const hoursTo03 = result ? calcTimeToPromile(currentPromile, -0.3) : 0;
  const targetAt03 = new Date(now.getTime() + hoursTo03 * 3_600_000);

  return (
    <div className="space-y-6">
      {/* Gender */}
      <div>
        <label className="block text-sm font-medium mb-2">Pohlaví</label>
        <div className="flex gap-3">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGender(g);
                setResult(null);
              }}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                gender === g
                  ? "bg-amber-600 border-amber-500 text-white"
                  : "bg-white/60 border-stone-300 text-stone-700 hover:border-stone-500"
              }`}
            >
              {g === "male" ? "Muž" : "Žena"}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-medium mb-2">Hmotnost (kg)</label>
        <input
          type="number"
          inputMode="numeric"
          step="1"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
            setResult(null);
          }}
          onBlur={() => setWeight(normalizeInteger(weight, 30, 200, 80))}
          min="30"
          max="200"
          className="w-full px-4 py-3 bg-white/70 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600 transition"
          placeholder="např. 80"
        />
      </div>

      {/* Drink presets */}
      <div>
        <p className="text-sm font-medium mb-2">Přidat nápoj:</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {ALCOHOL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => addPreset(preset.id)}
              className="px-3 py-1.5 bg-white/60 border border-stone-300 hover:border-amber-600 hover:text-amber-700 rounded-full text-xs text-stone-600 transition-colors"
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            onClick={addCustomDrink}
            className="px-3 py-1.5 bg-white/40 border border-dashed border-stone-400 hover:border-amber-600 hover:text-amber-700 rounded-full text-xs text-stone-500 transition-colors"
          >
            + vlastní
          </button>
        </div>
        <p className="font-mono text-[10px] text-stone-400 italic mt-1">
          Orientační hodnoty — skutečný obsah alkoholu se může lišit podle značky a receptury.
        </p>
      </div>

      {/* Drink list */}
      {drinks.length > 0 ? (
        <div className="space-y-3">
          {drinks.map((drink) => (
            <div
              key={drink.id}
              className="bg-white/70 border border-stone-300 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={drink.label}
                  onChange={(e) =>
                    updateDrink(drink.id, {
                      label: e.target.value,
                      presetId: undefined,
                    })
                  }
                  className="bg-transparent text-sm font-medium text-stone-900 focus:outline-none border-b border-transparent focus:border-amber-600 pb-0.5 flex-1 mr-2"
                />
                <button
                  type="button"
                  onClick={() => removeDrink(drink.id)}
                  className="text-stone-600 hover:text-red-400 transition-colors text-xl leading-none w-6 text-center"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">
                    Objem (ml)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min="10"
                    value={getVolText(drink)}
                    onChange={(e) => {
                      const text = e.target.value;
                      setVolText(drink.id, text);
                      const num = parseInt(text, 10);
                      if (!isNaN(num) && num >= 10) {
                        updateDrink(drink.id, { volumeMl: num, presetId: undefined });
                      } else {
                        setResult(null);
                      }
                    }}
                    onBlur={() => {
                      const normalized = normalizeInteger(getVolText(drink), 10, 5000, 500);
                      setVolText(drink.id, normalized);
                      updateDrink(drink.id, { volumeMl: parseInt(normalized, 10), presetId: undefined });
                    }}
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">
                    Alkohol (%)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={getAbvText(drink)}
                    onChange={(e) => {
                      const text = e.target.value;
                      setAbvText(drink.id, text);
                      const num = parseFloat(text);
                      if (!isNaN(num) && num >= 0 && num <= 100) {
                        updateDrink(drink.id, { abv: num, presetId: undefined });
                      } else {
                        setResult(null);
                      }
                    }}
                    onBlur={() => {
                      const normalized = normalizeDecimal(getAbvText(drink), 0, 100, drink.abv);
                      setAbvText(drink.id, normalized);
                      updateDrink(drink.id, { abv: parseFloat(normalized), presetId: undefined });
                    }}
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">
                    Počet
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        drink.count > 1
                          ? updateDrink(drink.id, { count: drink.count - 1 })
                          : removeDrink(drink.id)
                      }
                      className="w-7 h-[34px] bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-base font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-amber-700 flex-1 text-center">
                      {drink.count}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateDrink(drink.id, { count: drink.count + 1 })
                      }
                      className="w-7 h-[34px] bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-base font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-stone-400 text-sm text-center py-4 border border-dashed border-stone-300 rounded-lg">
          Zatím žádný nápoj — přidej ho tlačítky výše.
        </p>
      )}

      {/* Started drinking time */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Kdy jsi začal/a pít?{" "}
          <span className="text-stone-500 font-normal">(volitelné)</span>
        </label>
        <input
          type="datetime-local"
          value={effectiveStartedAt}
          onChange={(e) => {
            setStartedAt(e.target.value);
            setStartedAtManual(true);
          }}
          className="w-full px-4 py-3 bg-white/70 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600 transition text-sm"
        />
        {!startedAtManual && (
          <p className="mt-1.5 text-xs text-stone-500">
            Začátek pití jsme předvyplnili odhadem podle počtu nápojů. Můžeš ho upravit.
          </p>
        )}
        {showStartedAfterStoppedWarning && (
          <p className="mt-1.5 text-xs text-amber-600">
            Začátek pití je nastaven po konci — délka pití se pro výpočet ignoruje.
          </p>
        )}
      </div>

      {/* Stopped drinking time */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Kdy jsi přestal/a pít?{" "}
          <span className="text-stone-500 font-normal">(volitelné)</span>
        </label>
        <input
          type="datetime-local"
          value={stoppedAt}
          onChange={(e) => setStoppedAt(e.target.value)}
          className="w-full px-4 py-3 bg-white/70 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600 transition text-sm"
        />
        {isFuture && (
          <p className="mt-1.5 text-xs text-amber-600">
            Čas konce pití je v budoucnosti — počítám bez časové korekce.
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm text-center">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={calculate}
        className="w-full py-2.5 border-2 border-stone-800 text-stone-900 font-mono font-bold text-sm uppercase tracking-widest hover:bg-stone-900 hover:text-[#fdf8f0] transition-colors"
      >
        Spočítat 🍺
      </button>

      {/* Result */}
      {result && (
        <div className="border-t-4 border-double border-stone-800 pt-5 mt-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400 text-center mb-4">══ Výsledek ══</p>

          {/* Two-column layout: stats+info | thermometer */}
          <div className="sm:grid sm:grid-cols-[1fr_90px] sm:gap-5">
            {/* Left: stats + time-adjusted promile + description */}
            <div>
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 text-center mb-4">
                <div>
                  <p className="text-xs text-stone-500 mb-1 leading-tight">
                    Čistý alkohol
                  </p>
                  <p className="text-2xl font-black text-amber-700">
                    {result.totalAlcoholG}
                  </p>
                  <p className="text-xs text-stone-500">g</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 mb-1 leading-tight">
                    Jako piv
                  </p>
                  <p className="text-2xl font-black text-amber-700">
                    {result.beerEquivalents}
                  </p>
                  <p className="text-xs text-stone-500">🍺</p>
                </div>
              </div>

              {/* Promile rows */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-600">Odhad po vypití:</span>
                  <span className="font-bold text-amber-700">
                    cca {getPromileDisplay(result.bacEstimate)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-600">Odhad teď:</span>
                  <span className="font-bold text-amber-700">
                    cca {getPromileDisplay(currentPromile)}
                  </span>
                </div>
                {drinkingDurationHours > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-600">Délka pití:</span>
                    <span className="font-bold text-stone-700">
                      cca {formatDuration(drinkingDurationHours)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm pt-1 border-t border-stone-300/70">
                  <span className="text-stone-600">Na 0 ‰ <span className="text-stone-400 font-normal text-xs">(orient.)</span>:</span>
                  {currentPromile <= 0 ? (
                    <span className="text-green-700 font-semibold text-xs">
                      orientačně již na nule
                    </span>
                  ) : (
                    <span className="font-bold text-stone-700 text-xs text-right">
                      za {formatDuration(hoursToZero)}
                      <span className="block text-stone-500 font-normal">
                        kolem {formatClock(targetAtZero)}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm pt-1 border-t border-stone-300/70">
                  <span className="text-stone-600 leading-tight">
                    S rez. −0,3 ‰:
                    <span className="block text-xs text-stone-600 font-normal">
                      nula + 2,5 h navíc
                    </span>
                  </span>
                  <span className="font-bold text-stone-700 text-xs text-right">
                    za {formatDuration(hoursTo03)}
                    <span className="block text-stone-500 font-normal">
                      kolem {formatClock(targetAt03)}
                    </span>
                  </span>
                </div>
                <p className="font-mono text-[10px] text-stone-500 italic mt-0.5">
                  Časy jsou hrubý odhad. Neříkají, kdy je bezpečné řídit.
                </p>
                <p className="text-xs text-stone-600">
                  Odbourávání počítám orientačně 0,12 ‰ za hodinu.
                  {drinkingDurationHours > 0 &&
                    " Odbourávání během pití počítám zjednodušeně jako polovinu délky pití."}
                </p>
                {isFuture && (
                  <p className="text-xs text-amber-700">
                    Čas konce pití je v budoucnosti — časová korekce není
                    aplikována.
                  </p>
                )}
                {showStartedAfterStoppedWarning && (
                  <p className="text-xs text-amber-700">
                    Začátek pití je nastaven po konci — počítám bez délky pití.
                  </p>
                )}
              </div>

              {/* Human description */}
              <div className="bg-amber-50/60 rounded-sm p-3 text-center mb-4">
                <p className="text-stone-700 text-sm leading-relaxed">
                  {result.humanDescription}
                </p>
              </div>
            </div>

            {/* Right: thermometer — on mobile appears below via block + mt */}
            <div className="flex justify-center sm:justify-start mt-4 sm:mt-0">
              <PromileThermometer promile={currentPromile} />
            </div>
          </div>

          {/* Disclaimer — full width */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-sm mt-4">
            <p className="text-amber-800 text-xs text-center leading-relaxed">
              ⚠️ Výsledek je pouze orientační. Skutečná hladina alkoholu závisí na těle, jídle, rychlosti pití i zdravotním stavu. Nepoužívej výpočet jako rozhodnutí, jestli můžeš řídit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
