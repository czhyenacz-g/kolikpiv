"use client";

import { clampPromileForThermometer, getPromileDisplay } from "../../lib/alcohol";

const TUBE_H = 200; // px — height of the tube body
const TUBE_W = 14;  // px — tube width
const BULB_D = 22;  // px — bulb diameter
const MAX_DEFAULT = 4;

const MARKS = [
  { value: 4, label: "4 ‰ ☠️" },
  { value: 3, label: "3 ‰" },
  { value: 2, label: "2 ‰" },
  { value: 1, label: "1 ‰" },
  { value: 0.5, label: "0,5 ‰" },
  { value: 0, label: "0 ‰" },
];

function fillColor(promile: number): string {
  if (promile <= 0.5) return "#f59e0b"; // amber
  if (promile <= 1.0) return "#f97316"; // orange
  if (promile <= 2.0) return "#ef4444"; // red-400
  return "#dc2626";                     // red-600
}

interface Props {
  promile: number;
  maxPromile?: number;
}

export default function PromileThermometer({
  promile,
  maxPromile = MAX_DEFAULT,
}: Props) {
  const clamped = clampPromileForThermometer(promile, maxPromile);
  const fillRatio = maxPromile > 0 ? clamped / maxPromile : 0;
  const fillH = Math.round(fillRatio * TUBE_H);
  const color = fillColor(clamped);
  const tubeLeft = (BULB_D - TUBE_W) / 2; // center tube over bulb

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <p className="text-xs text-gray-500 text-center leading-tight">
        Odhad teď
      </p>
      <p className="text-base font-black text-amber-400 text-center leading-tight whitespace-nowrap">
        {getPromileDisplay(promile, maxPromile)}
      </p>

      {/* marks + tube */}
      <div
        className="flex items-end gap-1 mt-1"
        style={{ height: TUBE_H + BULB_D + 4 }}
      >
        {/* labels column */}
        <div
          className="relative"
          style={{ width: 52, height: TUBE_H + BULB_D }}
        >
          {MARKS.map((m) => {
            const fromBottom =
              (m.value / maxPromile) * TUBE_H + BULB_D;
            return (
              <span
                key={m.value}
                className="absolute right-0 text-[10px] text-gray-500 leading-none"
                style={{
                  bottom: fromBottom,
                  transform: "translateY(50%)",
                }}
              >
                {m.label}
              </span>
            );
          })}
        </div>

        {/* thermometer column */}
        <div
          className="relative flex-shrink-0"
          style={{ width: BULB_D, height: TUBE_H + BULB_D }}
        >
          {/* tube background */}
          <div
            className="absolute border border-gray-600 bg-gray-900"
            style={{
              left: tubeLeft,
              top: 0,
              width: TUBE_W,
              height: TUBE_H,
              borderRadius: "7px 7px 0 0",
            }}
          />
          {/* fill — clipped by setting height, grows from bottom of tube */}
          {fillH > 0 && (
            <div
              className="absolute transition-all duration-500"
              style={{
                left: tubeLeft,
                bottom: BULB_D,
                width: TUBE_W,
                height: fillH,
                backgroundColor: color,
                borderRadius:
                  fillH >= TUBE_H ? "7px 7px 0 0" : "0",
              }}
            />
          )}
          {/* bulb */}
          <div
            className="absolute border border-gray-600 rounded-full transition-colors duration-500"
            style={{
              bottom: 0,
              left: 0,
              width: BULB_D,
              height: BULB_D,
              backgroundColor: fillH > 0 ? color : "#374151",
            }}
          />
        </div>
      </div>

      <p className="text-[10px] text-gray-600 text-center leading-tight mt-1">
        jen
        <br />
        orientačně
      </p>
    </div>
  );
}
