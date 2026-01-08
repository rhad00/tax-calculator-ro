import React, { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  calculateVehicleTax,
  getVehicleTypes,
  getEuroNorms,
  VehicleTaxInput,
} from "@/lib/taxCalculations";
import { AlertCircle, CheckCircle2, Car, Bike, Bus, Circle, Gauge, Leaf, Zap } from "lucide-react";

export default function VehicleTaxCalculator() {
  const [vehicleType, setVehicleType] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [euro, setEuro] = useState<string>("");
  const [hybridDiscount, setHybridDiscount] = useState<string>("0"); // % 0-30 pentru hibride ≤50g
  const [result, setResult] = useState<{
    tax: number;
    breakdown: string;
  } | null>(null);
  const [error, setError] = useState<string>("");

  // Recalculare în timp real când datele sunt valide
  const recompute = () => {
    if (!vehicleType || !capacity || isNaN(Number(capacity)) || Number(capacity) <= 0 || !euro) {
      setResult(null);
      return;
    }
    try {
      const input: VehicleTaxInput = {
        type: vehicleType as "car" | "motorcycle" | "bus" | "other",
        capacity: Number(capacity),
        euro: euro as
          | "euro0_3"
          | "euro4"
          | "euro5"
          | "euro6"
          | "hybrid_le_50"
          | "hybrid_gt_50"
          | "electric",
        localHybridDiscount: euro === "hybrid_le_50" ? Number(hybridDiscount) / 100 : 0,
      };
      const calculation = calculateVehicleTax(input);
      setResult(calculation);
    } catch {
      // Nu afișăm erori în recalcularea live
      setResult(null);
    }
  };

  // Trigger live recompute on changes
  React.useEffect(() => {
    recompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleType, capacity, euro, hybridDiscount]);

  const handleCalculate = () => {
    setError("");
    setResult(null);

    // Validation
    if (!vehicleType) {
      setError("Selectează tipul vehiculului");
      return;
    }
    if (!capacity || isNaN(Number(capacity)) || Number(capacity) <= 0) {
      setError("Introdu o cilindree validă (cm³)");
      return;
    }
    if (!euro) {
      setError("Selectează norma de poluare (Euro)");
      return;
    }
    if (euro === "hybrid_le_50") {
      const val = Number(hybridDiscount);
      if (isNaN(val) || val < 0 || val > 30) {
        setError("Introdu o reducere locală validă (0-30%) pentru hibrid ≤50g");
        return;
      }
    }

    try {
      const input: VehicleTaxInput = {
        type: vehicleType as "car" | "motorcycle" | "bus" | "other",
        capacity: Number(capacity),
        euro: euro as
          | "euro0_3"
          | "euro4"
          | "euro5"
          | "euro6"
          | "hybrid_le_50"
          | "hybrid_gt_50"
          | "electric",
        localHybridDiscount: euro === "hybrid_le_50" ? Number(hybridDiscount) / 100 : 0,
      };

      const calculation = calculateVehicleTax(input);
      setResult(calculation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "A apărut o eroare în timpul calculului"
      );
    }
  };

  const handleReset = () => {
    setVehicleType("");
    setCapacity("");
    setEuro("");
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Formular de intrare */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tip vehicul */}
        <div className="space-y-2">
          <Label htmlFor="vehicle-type" className="font-semibold">
            Tipul vehiculului
          </Label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger id="vehicle-type">
              <SelectValue placeholder="Selectează tipul vehiculului" />
            </SelectTrigger>
            <SelectContent>
              {getVehicleTypes().map((type) => {
                const Icon =
                  type.value === "car"
                    ? Car
                    : type.value === "motorcycle"
                    ? Bike
                    : type.value === "bus"
                    ? Bus
                    : Circle;
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

        {/* Cilindree motor */}
        <div className="space-y-2">
          <Label htmlFor="capacity" className="font-semibold">
            Cilindree motor (cm³)
          </Label>
          <Input
            id="capacity"
            type="number"
            placeholder="ex: 1800"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min="0"
            step="100"
          />
        </div>

        {/* Norma Euro */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="euro" className="font-semibold">
            Norma de poluare (standard Euro)
          </Label>
          <Select value={euro} onValueChange={setEuro}>
            <SelectTrigger id="euro">
              <SelectValue placeholder="Selectează norma de poluare" />
            </SelectTrigger>
            <SelectContent>
              {getEuroNorms().map((norm) => {
                const Icon =
                  norm.value === "electric" ? Zap :
                  norm.value.startsWith("hybrid") ? Leaf :
                  Gauge;
                return (
                  <SelectItem key={norm.value} value={norm.value}>
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{norm.label}</span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {euro === "hybrid_le_50" && (
          <div className="space-y-2 md:col-span-2">
            <Label className="font-semibold">Reducere locală pentru hibrid ≤50g (0-30%)</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[Number(hybridDiscount)]}
                    onValueChange={(vals) => setHybridDiscount(String(vals[0] ?? 0))}
                    min={0}
                    max={30}
                    step={1}
                    className="flex-1"
                  />
                  <div className="text-sm font-medium w-16 text-right">{Number(hybridDiscount)}%</div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                {result ? <>Taxă estimată după reducere: <strong>{result.tax.toFixed(2)} lei</strong></> : "Completează datele pentru estimare"}
              </TooltipContent>
            </Tooltip>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>0%</span>
              <span>10%</span>
              <span>20%</span>
              <span>30%</span>
            </div>
            <p className="text-xs text-slate-500">
              Această reducere depinde de hotărârea consiliului local.
            </p>
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
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-900">Rezultatul calculului impozitului</h3>
              <p className="text-sm text-green-700">Conform Legii 239/2025</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <p className="text-sm text-slate-600 mb-1">Suma anuală a impozitului:</p>
              <p className="text-4xl font-bold text-green-700">
                {result.tax.toFixed(2)} lei
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-100">
              <p className="text-sm text-slate-600 mb-2">Detalii calcul:</p>
              <p className="text-sm font-mono text-slate-700">
                {result.breakdown}
              </p>
            </div>

            {euro === "hybrid_le_50" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Notă:</strong> Pentru hibride ≤50g CO₂/km se poate
                  aplica o reducere locală de până la 30% (stabilită de
                  consiliul local).
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Butoane */}
      <div className="flex gap-3">
        <Button
          onClick={handleCalculate}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Calculează impozitul
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          Resetează
        </Button>
      </div>

      {/* Cum funcționează */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-2">Cum funcționează:</h4>
        <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
          <li>Selectează tipul vehiculului și cilindreea motorului</li>
          <li>Alege norma de poluare (standard Euro)</li>
          <li>Impozitul se calculează: (Cilindree ÷ 200) × Rata per 200 cm³</li>
          <li>Se aplică tarife speciale pentru vehicule electrice și hibride</li>
        </ol>
      </div>

      {/* Reguli pentru hibride și electrice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Reguli pentru hibride și electrice:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Hibrid ≤50g CO₂/km: lei/200 cm³ (aceleași tarife ca &gt;50g), cu reducere locală de până la 30%.</li>
          <li>Hibrid &gt;50g CO₂/km: se aplică lei/200 cm³ conform categoriei vehiculului.</li>
          <li>Vehicul electric: 40 lei/an (sumă fixă).</li>
        </ul>
        <div className="mt-3 text-xs text-blue-900 bg-white/60 border border-blue-200 rounded-md p-3">
          <p className="font-semibold mb-1">Exemplu (hibrid &gt;50g CO₂/km):</p>
          <p>
            Autoturism cu 1.800 cm³ → unități = ceil(1800/200) = 9; categoria 1.601–2.000 cm³
            are rată 24,6 lei/200 cm³. Calcul: 9 × 24,6 = 221,4 lei/an.
          </p>
        </div>
      </div>
    </div>
  );
}
