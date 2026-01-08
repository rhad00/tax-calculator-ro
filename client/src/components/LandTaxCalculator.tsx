import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  calculateLandTax,
  getLandTaxScenarios,
  getLandUseCategories,
  getCityZones,
  getCityRanks,
  LandTaxInput,
} from "@/lib/taxCalculations";
import { isDiscountAvailable } from "@/lib/dateUtils";
import { AlertCircle, CheckCircle2, Building, Ruler, MapPin, Landmark, Leaf, Circle } from "lucide-react";

export default function LandTaxCalculator() {
  const [scenario, setScenario] = useState<string>("");
  const [areaM2, setAreaM2] = useState<string>("");
  const [cityZone, setCityZone] = useState<string>("");
  const [cityRank, setCityRank] = useState<string>("");
  const [landUseCategory, setLandUseCategory] = useState<string>("");
  const [result, setResult] = useState<{
    tax: number;
    breakdown: string;
  } | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    setError("");
    setResult(null);

    // Validation
    if (!scenario) {
      setError("Selectează scenariul de teren");
      return;
    }
    if (!areaM2 || isNaN(Number(areaM2)) || Number(areaM2) <= 0) {
      setError("Introdu o suprafață validă (m²)");
      return;
    }

    try {
      const input: LandTaxInput = {
        scenario: scenario as "intravilan_construction" | "intravilan_other_large" | "extravilan",
        areaM2: Number(areaM2),
        cityZone: cityZone as "A" | "B" | "C" | "D" | undefined,
        cityRank: cityRank as "0" | "I" | "II" | "III" | "IV" | "V" | undefined,
        landUseCategory: landUseCategory || undefined,
      };

      const calculation = calculateLandTax(input);
      setResult(calculation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "A apărut o eroare în calcul"
      );
    }
  };

  const handleReset = () => {
    setScenario("");
    setAreaM2("");
    setCityZone("");
    setCityRank("");
    setLandUseCategory("");
    setResult(null);
    setError("");
  };

  // Recalculare live
  const recompute = () => {
    if (!scenario || !areaM2 || isNaN(Number(areaM2)) || Number(areaM2) <= 0) {
      setResult(null);
      return;
    }

    // Check required fields based on scenario
    if (scenario === "intravilan_construction" && (!cityZone || !cityRank)) {
      setResult(null);
      return;
    }
    if (scenario === "intravilan_other_large" && (!cityZone || !cityRank || !landUseCategory)) {
      setResult(null);
      return;
    }
    if (scenario === "extravilan" && (!cityRank || !landUseCategory)) {
      setResult(null);
      return;
    }

    try {
      const input: LandTaxInput = {
        scenario: scenario as "intravilan_construction" | "intravilan_other_large" | "extravilan",
        areaM2: Number(areaM2),
        cityZone: cityZone as "A" | "B" | "C" | "D" | undefined,
        cityRank: cityRank as "0" | "I" | "II" | "III" | "IV" | "V" | undefined,
        landUseCategory: landUseCategory || undefined,
      };
      const calculation = calculateLandTax(input);
      setResult(calculation);
    } catch {
      setResult(null);
    }
  };

  React.useEffect(() => {
    recompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, areaM2, cityZone, cityRank, landUseCategory]);

  const showZoneRank = scenario === "intravilan_construction" || scenario === "intravilan_other_large";
  const showZone = scenario === "intravilan_construction" || scenario === "intravilan_other_large";
  const showLandUse = scenario === "intravilan_other_large" || scenario === "extravilan";
  const showRank = scenario !== "intravilan_construction" || (scenario === "intravilan_construction" && !!cityZone);

  return (
    <div className="space-y-6">
      {/* Formular de intrare */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="scenario" className="font-semibold">
            Tipul terenului
          </Label>
          <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger id="scenario">
              <SelectValue placeholder="Selectează tipul terenului" />
            </SelectTrigger>
            <SelectContent>
              {getLandTaxScenarios().map((s) => {
                const Icon =
                  s.value === "intravilan_construction" ? Building :
                  s.value === "intravilan_other_large" ? Ruler :
                  MapPin;
                return (
                  <SelectItem key={s.value} value={s.value}>
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{s.label}</span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Suprafață teren */}
        <div className="space-y-2">
          <Label htmlFor="area" className="font-semibold">
            Suprafață (m²)
          </Label>
          <Input
            id="area"
            type="number"
            placeholder="ex: 5000"
            value={areaM2}
            onChange={(e) => setAreaM2(e.target.value)}
            min="0"
            step="1"
          />
        </div>

        {/* Zona */}
        {showZone && (
          <div className="space-y-2">
            <Label htmlFor="city-zone" className="font-semibold">
              Zona în cadrul localității (A-D)
            </Label>
            <Select value={cityZone} onValueChange={setCityZone}>
              <SelectTrigger id="city-zone">
                <SelectValue placeholder="Selectează zona (A-D)" />
              </SelectTrigger>
              <SelectContent>
                {getCityZones().map((z) => (
                  <SelectItem key={z.value} value={z.value}>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{z.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Rangul localității */}
        {showRank && (
          <div className="space-y-2">
            <Label htmlFor="city-rank" className="font-semibold">
              Rangul localității
            </Label>
            <Select value={cityRank} onValueChange={setCityRank}>
              <SelectTrigger id="city-rank">
                <SelectValue placeholder="Selectează rangul (0, I-V)" />
              </SelectTrigger>
              <SelectContent>
                {getCityRanks().map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    <span className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>{r.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Categoria de folosință */}
        {showLandUse && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="land-use" className="font-semibold">
              Categoria de folosință a terenului
            </Label>
            <Select value={landUseCategory} onValueChange={setLandUseCategory}>
              <SelectTrigger id="land-use">
                <SelectValue placeholder="Selectează categoria" />
              </SelectTrigger>
              <SelectContent>
                {getLandUseCategories().map((cat) => {
                  const Icon =
                    cat.value === "construction" ? Building :
                    cat.value === "unproductive" ? Circle :
                    cat.value === "roads" ? Ruler :
                    cat.value === "water" || cat.value === "beach" ? MapPin :
                    Leaf;
                  return (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Mesaj de eroare */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Rezultat */}
      {result && (
        <>
          {/* Discount Warning - only show if discount is available */}
          {isDiscountAvailable() && (
            <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600/70">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">💰 Reducere de 10% disponibilă!</h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                    Dacă plătiți taxa <strong>până la 31 martie 2026</strong>, beneficiați de o reducere de <strong>10%</strong>.
                  </p>
                  <div className="bg-white dark:bg-slate-800/80 rounded p-2 border border-amber-200 dark:border-amber-700/50">
                    <p className="text-xs text-amber-700 dark:text-amber-200">
                      <span className="font-semibold">Taxa cu reducere (10%):</span> <span className="text-base font-bold text-amber-700 dark:text-amber-300">{(result.tax * 0.9).toFixed(2)} lei</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Taxa normală: {result.tax.toFixed(2)} lei</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-200 dark:border-green-700/70">
          <div className="flex gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-900 dark:text-green-200">Rezultatul calculului impozitului pe teren</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Conform Legii 239/2025</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-800/80 rounded-lg p-4 border border-green-100 dark:border-green-700/50">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Suma anuală a impozitului:</p>
              <p className="text-4xl font-bold text-green-700 dark:text-green-400">
                {result.tax.toFixed(2)} lei
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 rounded-lg p-4 border border-green-100 dark:border-green-700/50">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Detalii calcul:</p>
              <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                {result.breakdown}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Notă:</strong> Calcul estimativ. Suma finală poate varia în
                funcție de deciziile consiliului local și de eventuale scutiri.
              </p>
            </div>
          </div>
        </Card>
        </>
      )}

      {/* Butoane */}
      <div className="flex gap-3">
        <Button
          onClick={handleCalculate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          size="lg"
        >
          Calculează impozitul pe teren
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          size="lg"
        >
          Resetează
        </Button>
      </div>

      {/* Informații ajutor */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Scenarii de impozitare pe teren:</h4>
        <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
          <p>
            <strong>Intravilan (teren cu construcții):</strong> Terenul amplasat în
            intravilan, înregistrat ca teren cu construcții. Se utilizează tabel direct cu
            intervale min-max în funcție de zonă și rang.
          </p>
          <p>
            <strong>Intravilan (teren fără construcții, &gt;400 m²):</strong> Terenul amplasat
            în intravilan, fără construcții, cu suprafață mai mare de 400 m². Se calculează
            ca bază × coeficient în funcție de categoria de folosință și rang.
          </p>
          <p>
            <strong>Extravilan:</strong> Terenul amplasat în afara localității. Se calculează
            cu bază specifică × coeficient al rangului localității.
          </p>
        </div>
      </div>
    </div>
  );
}
