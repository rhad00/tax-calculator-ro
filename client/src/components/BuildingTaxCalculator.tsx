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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  calculateBuildingTax,
  getBuildingTypes,
  BuildingTaxInput,
  getCityRanks,
  getCityZones,
} from "@/lib/taxCalculations";
import { isDiscountAvailable } from "@/lib/dateUtils";
import { AlertCircle, CheckCircle2, Building2, Home, Building, Warehouse, Landmark, MapPin, Circle } from "lucide-react";
import OsmTaxMap from "./OsmTaxMap";

export default function BuildingTaxCalculator() {
  const [buildingType, setBuildingType] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [hasUtilities, setHasUtilities] = useState<boolean>(true);
  const [cityRank, setCityRank] = useState<string>("");
  const [cityZone, setCityZone] = useState<string>("");
  const [localRatePercent, setLocalRatePercent] = useState<number>(0.1); // 0.08 - 0.2 (%)
  const [specialUsage, setSpecialUsage] = useState<string>("none");
  const [result, setResult] = useState<{
    tax: number;
    breakdown: string;
  } | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    setError("");
    setResult(null);

    // Validation
    if (!buildingType) {
      setError("Selectează tipul clădirii");
      return;
    }
    if (!area || isNaN(Number(area)) || Number(area) <= 0) {
      setError("Introdu o suprafață validă (m²)");
      return;
    }
    if (!cityRank) {
      setError("Selectează rangul localității");
      return;
    }
    if (!cityZone) {
      setError("Selectează zona (A-D)");
      return;
    }
    if (localRatePercent < 0.08 || localRatePercent > 0.2) {
      setError("Setează cota locală între 0.08% și 0.2%");
      return;
    }

    try {
      const input: BuildingTaxInput = {
        type: buildingType as "A" | "B" | "C" | "D",
        area: Number(area),
        hasUtilities,
        cityRank: cityRank as "0" | "I" | "II" | "III" | "IV" | "V",
        cityZone: cityZone as "A" | "B" | "C" | "D",
        localRatePercent,
        specialUsage: specialUsage as "none" | "locuinta" | "alte_scopuri",
      };

      const calculation = calculateBuildingTax(input);
      setResult(calculation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during calculation"
      );
    }
  };

  const handleReset = () => {
    setBuildingType("");
    setArea("");
    setHasUtilities(true);
    setCityRank("");
    setCityZone("");
    setLocalRatePercent(0.1);
    setResult(null);
    setError("");
  };

  // Recalculare live când utilizatorul schimbă parametrii
  const recompute = () => {
    if (!buildingType || !area || isNaN(Number(area)) || Number(area) <= 0 || !cityRank || !cityZone) {
      setResult(null);
      return;
    }
    try {
      const input: BuildingTaxInput = {
        type: buildingType as "A" | "B" | "C" | "D",
        area: Number(area),
        hasUtilities,
        cityRank: cityRank as "0" | "I" | "II" | "III" | "IV" | "V",
        cityZone: cityZone as "A" | "B" | "C" | "D",
        localRatePercent,
        specialUsage: specialUsage as "none" | "locuinta" | "alte_scopuri",
      };
      const calculation = calculateBuildingTax(input);
      setResult(calculation);
    } catch {
      setResult(null);
    }
  };

  React.useEffect(() => {
    recompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingType, area, hasUtilities, cityRank, cityZone, localRatePercent, specialUsage]);

  return (
    <div className="space-y-6">
      {/* Formular de intrare */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tip clădire */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="building-type" className="font-semibold">
            Tipul clădirii
          </Label>
          <Select value={buildingType} onValueChange={setBuildingType}>
            <SelectTrigger id="building-type">
              <SelectValue placeholder="Selectează tipul clădirii" />
            </SelectTrigger>
            <SelectContent>
              {getBuildingTypes().map((type) => {
                const Icon =
                  type.value === "A"
                    ? Building2
                    : type.value === "B"
                    ? Home
                    : type.value === "C"
                    ? Building
                    : Warehouse;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Suprafață clădire */}
        <div className="space-y-2">
          <Label htmlFor="area" className="font-semibold">
            Suprafață (m²)
          </Label>
          <Input
            id="area"
            type="number"
            placeholder="ex: 100"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            min="0"
            step="1"
          />
        </div>

        {/* Rangul localității */}
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
        {/* Zona în cadrul localității (A-D) */}
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
        {/* Cota locală (0.08% - 0.2%) */}
        <div className="space-y-2 md:col-span-2">
          <Label className="font-semibold">Cota locală (0.08% - 0.2%)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[Math.round(localRatePercent * 10000) / 100]}
              onValueChange={(vals) => setLocalRatePercent((vals[0] ?? 8) / 100)}
              min={8}
              max={20}
              step={1}
              className="flex-1"
            />
            <div className="text-sm font-medium w-20 text-right">{(localRatePercent).toFixed(2)}%</div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>0.08%</span>
            <span>0.10%</span>
            <span>0.15%</span>
            <span>0.20%</span>
          </div>
        </div>

        {/* Utilități */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-600">
            <Checkbox
              id="utilities"
              checked={hasUtilities}
              onCheckedChange={(checked) => setHasUtilities(checked as boolean)}
            />
            <Label
              htmlFor="utilities"
              className="font-semibold cursor-pointer flex-1 text-slate-900 dark:text-slate-100"
            >
              Are apă/canalizare/curent electric/încălzire
            </Label>
          </div>
        </div>

        {/* Încăperi S/D/M */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="special-usage" className="font-semibold">
            Încăperi la subsol/demisol/mansardă
          </Label>
          <Select value={specialUsage} onValueChange={setSpecialUsage}>
            <SelectTrigger id="special-usage">
              <SelectValue placeholder="Selectează opțiunea" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  <span>Nu se aplică</span>
                </span>
              </SelectItem>
              <SelectItem value="locuinta">
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Locuință (75% din suma clădirii)</span>
                </span>
              </SelectItem>
              <SelectItem value="alte_scopuri">
                <span className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>Alte scopuri (50% din suma clădirii)</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">
            Se aplică doar dacă deții la aceeași adresă astfel de încăperi.
          </p>
        </div>
      </div>

      {/* Hartă interactivă cu orașe (OpenStreetMap) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Hartă interactivă (România)</h4>
        <div className="text-xs text-slate-600 dark:text-slate-300 mb-3 space-y-1">
          <p>
            Plasează cursorul peste un oraș pentru a vedea rangul și o estimare simplificată a impozitului.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Completează <span className="font-medium">Suprafața (m²)</span>.</li>
            <li>Selectează <span className="font-medium">Tipul clădirii</span> și dacă are <span className="font-medium">utilități</span>.</li>
            <li>Opțional: setează <span className="font-medium">încăperi S/D/M</span> și <span className="font-medium">cota locală</span>.</li>
            <li>
              Pentru suma exactă, alege și <span className="font-medium">Rangul</span> și <span className="font-medium">Zona (A–D)</span> în formular,
              apoi apasă <span className="font-medium">Calculează impozitul</span>.
            </li>
          </ul>
          <p>Harta folosește OpenStreetMap.</p>
        </div>
        <OsmTaxMap
          area={area ? Number(area) : null}
          type={buildingType ? (buildingType as "A" | "B" | "C" | "D") : null}
          hasUtilities={hasUtilities}
          cityZone={cityZone ? (cityZone as "A" | "B" | "C" | "D") : null}
          localRatePercent={localRatePercent}
          specialUsage={specialUsage as "none" | "locuinta" | "alte_scopuri"}
        />
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
              <h3 className="font-bold text-green-900 dark:text-green-200">Rezultatul calculului impozitului</h3>
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
                Impozitul pe clădiri va fi redus cu 50% începând cu 2027.
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
          Calculează impozitul
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

      {/* Tipuri de clădiri */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Tipuri de clădiri:</h4>
        <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
          <p>
            <strong>A.</strong> Clădire cu cadre din beton armat sau cu pereți
            exteriori din cărămidă arsă sau din materiale rezultate în urma unui
            tratament termic și/sau chimic
          </p>
          <p>
            <strong>B.</strong> Clădire cu pereții exteriori din lemn, din piatră
            naturală, din cărămidă nearsă, din vălătuci sau din orice alte
            materiale nesupuse unui tratament termic și/sau chimic
          </p>
          <p>
            <strong>C.</strong> Clădire-anexă cu cadre din beton armat sau cu
            pereți exteriori din cărămidă arsă sau din materiale rezultate în
            urma unui tratament termic și/sau chimic
          </p>
          <p>
            <strong>D.</strong> Clădire-anexă cu pereții exteriori din lemn, din
            piatră naturală, din cărămidă nearsă, din vălătuci sau din orice
            alte materiale nesupuse unui tratament termic și/sau chimic
          </p>
        </div>
      </div>

      {/* Tabel de valori (2026) */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Baze de impozitare (2026):</h4>
        <div className="text-sm text-slate-700 dark:text-slate-300">
          <p className="mb-1"><strong>A.</strong> Cu utilități: 2.677 lei/m² · Fără utilități: 1.606 lei/m²</p>
          <p className="mb-1"><strong>B.</strong> Cu utilități: 803 lei/m² · Fără utilități: 535 lei/m²</p>
          <p className="mb-1"><strong>C.</strong> Cu utilități: 535 lei/m² · Fără utilități: 469 lei/m²</p>
          <p className="mb-3"><strong>D.</strong> Cu utilități: 335 lei/m² · Fără utilități: 201 lei/m²</p>
          <p className="mb-1"><strong>E.</strong> Încăperi la subsol/demisol/mansardă utilizate ca locuință: 75% din suma care s-ar aplica clădirii</p>
          <p><strong>F.</strong> Încăperi la subsol/demisol/mansardă utilizate în alte scopuri decât locuință: 50% din suma care s-ar aplica clădirii</p>
        </div>
      </div>
    </div>
  );
}
