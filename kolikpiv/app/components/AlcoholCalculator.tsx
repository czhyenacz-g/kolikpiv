"use client";

import { useState, useRef } from "react";
import {
  type DrinkEntry,
  type Gender,
  calcAlcohol,
  calculateCurrentPromile,
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

export default function AlcoholCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState<string>("80");
  const [stoppedAt, setStoppedAt] = useState<string>(() =>
    toDateTimeLocal(new Date())
  );
  const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
  const [result, setResult] = useState<ReturnType<typeof calcAlcohol> | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const counter = useRef(0);

  function newId() {
    counter.current += 1;
    return String(counter.current);
  }

  function addPreset(presetId: string) {
    const preset = ALCOHOL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setDrinks((prev) => {
      const existing = prev.find((d) => d.presetId === presetId);
      if (existing) {
        return prev.map((d) =>
          d.presetId === presetId ? { ...d, count: d.count + 1 } : d
        );
      }
      return [
        ...prev,
        {
          id: newId(),
          presetId: preset.id,
          label: preset.label,
          volumeMl: preset.volumeMl,
          abv: preset.abv,
          count: 1,
        },
      ];
    });
    setResult(null);
  }

  function addCustomDrink() {
    setDrinks((prev) => [
      ...prev,
      { id: newId(), label: "Vlastní nápoj", volumeMl: 500, abv: 5, count: 1 },
    ]);
    setResult(null);
  }

  function removeDrink(id: string) {
    setDrinks((prev) => prev.filter((d) => d.id !== id));
    setResult(null);
  }

  function updateDrink(id: string, updates: Partial<DrinkEntry>) {
    setDrinks((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    setResult(null);
  }

  function calculate() {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      setError("Zadej váhu mezi 30 a 300 kg.");
      return;
    }
    if (drinks.length === 0) {
      setError("Přidej aspoň jeden nápoj.");
      return;
    }
    setError("");
    setResult(calcAlcohol(drinks, weightNum, gender));
  }

  // Derive current promile from result + stoppedAt on every render
  const stoppedAtDate = stoppedAt ? new Date(stoppedAt) : null;
  const now = new Date();
  const isFuture = stoppedAtDate ? stoppedAtDate > now : false;
  const currentPromile = result
    ? calculateCurrentPromile(result.bacEstimate, stoppedAtDate, now)
    : 0;

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
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
              }`}
            >
              {g === "male" ? "Muž" : "Žena"}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-medium mb-2">Váha (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
            setResult(null);
          }}
          min="30"
          max="300"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition"
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
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-amber-500 hover:text-amber-400 rounded-full text-xs text-gray-300 transition-colors"
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            onClick={addCustomDrink}
            className="px-3 py-1.5 bg-gray-800 border border-dashed border-gray-600 hover:border-amber-500 hover:text-amber-400 rounded-full text-xs text-gray-400 transition-colors"
          >
            + vlastní
          </button>
        </div>
      </div>

      {/* Drink list */}
      {drinks.length > 0 ? (
        <div className="space-y-3">
          {drinks.map((drink) => (
            <div
              key={drink.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-3"
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
                  className="bg-transparent text-sm font-medium text-white focus:outline-none border-b border-transparent focus:border-amber-500 pb-0.5 flex-1 mr-2"
                />
                <button
                  type="button"
                  onClick={() => removeDrink(drink.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors text-xl leading-none w-6 text-center"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Objem (ml)
                  </label>
                  <input
                    type="number"
                    value={drink.volumeMl}
                    onChange={(e) =>
                      updateDrink(drink.id, {
                        volumeMl: parseFloat(e.target.value) || 0,
                        presetId: undefined,
                      })
                    }
                    min="10"
                    className="w-full px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Alkohol (%)
                  </label>
                  <input
                    type="number"
                    value={drink.abv}
                    onChange={(e) =>
                      updateDrink(drink.id, {
                        abv: parseFloat(e.target.value) || 0,
                        presetId: undefined,
                      })
                    }
                    min="0"
                    max="80"
                    step="0.1"
                    className="w-full px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
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
                      className="w-7 h-[34px] bg-gray-700 hover:bg-gray-600 rounded text-base font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-amber-400 flex-1 text-center">
                      {drink.count}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateDrink(drink.id, { count: drink.count + 1 })
                      }
                      className="w-7 h-[34px] bg-gray-700 hover:bg-gray-600 rounded text-base font-bold transition-colors"
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
        <p className="text-gray-600 text-sm text-center py-4 border border-dashed border-gray-800 rounded-lg">
          Zatím žádný nápoj — přidej ho tlačítky výše.
        </p>
      )}

      {/* Stopped drinking time */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Kdy jsi přestal/a pít?{" "}
          <span className="text-gray-500 font-normal">(volitelné)</span>
        </label>
        <input
          type="datetime-local"
          value={stoppedAt}
          onChange={(e) => setStoppedAt(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition text-sm"
        />
        {isFuture && (
          <p className="mt-1.5 text-xs text-amber-600">
            Čas konce pití je v budoucnosti — počítám bez časové korekce.
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={calculate}
        className="w-full py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Spočítat 🍺
      </button>

      {/* Result */}
      {result && (
        <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
          <h2 className="text-lg font-bold text-center mb-5">Výsledek</h2>

          {/* Two-column layout: stats+info | thermometer */}
          <div className="sm:grid sm:grid-cols-[1fr_90px] sm:gap-5">
            {/* Left: stats + time-adjusted promile + description */}
            <div>
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 text-center mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 leading-tight">
                    Čistý alkohol
                  </p>
                  <p className="text-2xl font-black text-amber-400">
                    {result.totalAlcoholG}
                  </p>
                  <p className="text-xs text-gray-500">g</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 leading-tight">
                    Jako piv
                  </p>
                  <p className="text-2xl font-black text-amber-400">
                    {result.beerEquivalents}
                  </p>
                  <p className="text-xs text-gray-500">🍺</p>
                </div>
              </div>

              {/* Promile rows */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Odhad po vypití:</span>
                  <span className="font-bold text-amber-400">
                    cca {getPromileDisplay(result.bacEstimate)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Odhad teď:</span>
                  <span className="font-bold text-amber-300">
                    cca {getPromileDisplay(currentPromile)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-700/50">
                  <span className="text-gray-400">Na 0 ‰:</span>
                  {currentPromile <= 0 ? (
                    <span className="text-green-400 font-semibold text-xs">
                      orientačně již na nule
                    </span>
                  ) : (
                    <span className="font-bold text-gray-300 text-xs text-right">
                      za {formatDuration(hoursToZero)}
                      <span className="block text-gray-500 font-normal">
                        kolem {formatClock(targetAtZero)}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-700/50">
                  <span className="text-gray-400 leading-tight">
                    S rez. −0,3 ‰:
                    <span className="block text-xs text-gray-600 font-normal">
                      nula + 2,5 h navíc
                    </span>
                  </span>
                  <span className="font-bold text-gray-300 text-xs text-right">
                    za {formatDuration(hoursTo03)}
                    <span className="block text-gray-500 font-normal">
                      kolem {formatClock(targetAt03)}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Odbourávání počítám orientačně 0,12 ‰ za hodinu.
                </p>
                {isFuture && (
                  <p className="text-xs text-amber-700">
                    Čas konce pití je v budoucnosti — časová korekce není
                    aplikována.
                  </p>
                )}
              </div>

              {/* Human description */}
              <div className="bg-gray-900/60 rounded-lg p-3 text-center mb-4">
                <p className="text-gray-300 text-sm leading-relaxed">
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
          <div className="p-3 bg-yellow-900/20 border border-yellow-700/40 rounded-lg">
            <p className="text-yellow-600/90 text-xs text-center leading-relaxed">
              ⚠️ Výpočet je pouze orientační. Odbourávání alkoholu je
              individuální a tento odhad neurčuje, zda můžete řídit nebo
              vykonávat činnosti vyžadující střízlivost.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
