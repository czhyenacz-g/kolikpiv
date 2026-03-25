import { Suspense } from "react";
import CalculatorClient from "./components/CalculatorClient";

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
