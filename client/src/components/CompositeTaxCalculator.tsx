import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  calculateVehicleTax,
  calculateBuildingTax,
  calculateLandTax,
  getVehicleTypes,
  getEuroNorms,
  getBuildingTypes,
  getCityRanks,
  getCityZones,
  getLandTaxScenarios,
  getLandUseCategories,
  VehicleTaxInput,
  BuildingTaxInput,
  LandTaxInput,
} from "@/lib/taxCalculations";
import { isDiscountAvailable } from "@/lib/dateUtils";
import { Car, Building2, Landmark, X, Plus, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";

// Item types
type VehicleItem = {
  id: string;
  type: "vehicle";
  name: string;
  data: VehicleTaxInput;
  tax: number;
  breakdown: string;
};

type BuildingItem = {
  id: string;
  type: "building";
  name: string;
  data: BuildingTaxInput;
  tax: number;
  breakdown: string;
};

type LandItem = {
  id: string;
  type: "land";
  name: string;
  data: LandTaxInput;
  tax: number;
  breakdown: string;
};

type TaxItem = VehicleItem | BuildingItem | LandItem;

export default function CompositeTaxCalculator() {
  const [items, setItems] = useState<TaxItem[]>([]);
  const [activeTab, setActiveTab] = useState<"vehicle" | "building" | "land">("vehicle");

  // Vehicle form state
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [euro, setEuro] = useState("");
  const [hybridDiscount, setHybridDiscount] = useState("0");

  // Building form state
  const [buildingName, setBuildingName] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [area, setArea] = useState("");
  const [hasUtilities, setHasUtilities] = useState(true);
  const [cityRank, setCityRank] = useState("");
  const [cityZone, setCityZone] = useState("");
  const [localRatePercent, setLocalRatePercent] = useState(0.1);
  const [specialUsage, setSpecialUsage] = useState("none");

  // Land form state
  const [landName, setLandName] = useState("");
  const [scenario, setScenario] = useState("");
  const [areaM2, setAreaM2] = useState("");
  const [landCityZone, setLandCityZone] = useState("");
  const [landCityRank, setLandCityRank] = useState("");
  const [landUseCategory, setLandUseCategory] = useState("");

  const [error, setError] = useState("");

  const addVehicle = () => {
    setError("");

    if (!vehicleName.trim()) {
      setError("Introdu un nume pentru vehicul");
      return;
    }
    if (!vehicleType || !capacity || !euro) {
      setError("Completează toate câmpurile pentru vehicul");
      return;
    }

    try {
      const input: VehicleTaxInput = {
        type: vehicleType as "car" | "motorcycle" | "bus" | "other",
        capacity: Number(capacity),
        euro: euro as "euro0_3" | "euro4" | "euro5" | "euro6" | "hybrid_le_50" | "hybrid_gt_50" | "electric",
        localHybridDiscount: euro === "hybrid_le_50" ? Number(hybridDiscount) / 100 : 0,
      };

      const result = calculateVehicleTax(input);

      const newItem: VehicleItem = {
        id: Date.now().toString(),
        type: "vehicle",
        name: vehicleName,
        data: input,
        tax: result.tax,
        breakdown: result.breakdown,
      };

      setItems([...items, newItem]);

      // Reset form
      setVehicleName("");
      setVehicleType("");
      setCapacity("");
      setEuro("");
      setHybridDiscount("0");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la calculul impozitului vehicul");
    }
  };

  const addBuilding = () => {
    setError("");

    if (!buildingName.trim()) {
      setError("Introdu un nume pentru clădire");
      return;
    }
    if (!buildingType || !area || !cityRank || !cityZone) {
      setError("Completează toate câmpurile pentru clădire");
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

      const result = calculateBuildingTax(input);

      const newItem: BuildingItem = {
        id: Date.now().toString(),
        type: "building",
        name: buildingName,
        data: input,
        tax: result.tax,
        breakdown: result.breakdown,
      };

      setItems([...items, newItem]);

      // Reset form
      setBuildingName("");
      setBuildingType("");
      setArea("");
      setHasUtilities(true);
      setCityRank("");
      setCityZone("");
      setLocalRatePercent(0.1);
      setSpecialUsage("none");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la calculul impozitului clădire");
    }
  };

  const addLand = () => {
    setError("");

    if (!landName.trim()) {
      setError("Introdu un nume pentru teren");
      return;
    }
    if (!scenario || !areaM2) {
      setError("Completează toate câmpurile pentru teren");
      return;
    }

    try {
      const input: LandTaxInput = {
        scenario: scenario as "intravilan_construction" | "intravilan_other_large" | "extravilan",
        areaM2: Number(areaM2),
        cityZone: landCityZone ? (landCityZone as "A" | "B" | "C" | "D") : undefined,
        cityRank: landCityRank ? (landCityRank as "0" | "I" | "II" | "III" | "IV" | "V") : undefined,
        landUseCategory: landUseCategory || undefined,
      };

      const result = calculateLandTax(input);

      const newItem: LandItem = {
        id: Date.now().toString(),
        type: "land",
        name: landName,
        data: input,
        tax: result.tax,
        breakdown: result.breakdown,
      };

      setItems([...items, newItem]);

      // Reset form
      setLandName("");
      setScenario("");
      setAreaM2("");
      setLandCityZone("");
      setLandCityRank("");
      setLandUseCategory("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la calculul impozitului teren");
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalTax = items.reduce((sum, item) => sum + item.tax, 0);
  const discountedTotal = isDiscountAvailable() ? totalTax * 0.9 : totalTax;

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let y = margin;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Calcul Impozit Compus 2026", margin, y);
    y += 10;

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${new Date().toLocaleDateString("ro-RO")}`, margin, y);
    y += 15;

    // Items
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Proprietati:", margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    items.forEach((item, index) => {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = margin;
      }

      const icon = item.type === "vehicle" ? "Vehicul" : item.type === "building" ? "Cladire" : "Teren";
      doc.text(`${index + 1}. ${icon}: ${item.name}`, margin, y);
      y += 6;
      doc.text(`   Taxa: ${item.tax.toFixed(2)} lei`, margin, y);
      y += 6;

      // Split breakdown into lines if too long
      const breakdownLines = doc.splitTextToSize(`   Calcul: ${item.breakdown}`, contentWidth - 10);
      breakdownLines.forEach((line: string) => {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 5;
      });
      y += 8;
    });

    // Total
    y += 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total impozite: ${totalTax.toFixed(2)} lei`, margin, y);
    y += 8;

    if (isDiscountAvailable()) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Reducere 10% (plata pana la 31.03.2026): -${(totalTax * 0.1).toFixed(2)} lei`, margin, y);
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.text(`Total cu reducere: ${discountedTotal.toFixed(2)} lei`, margin, y);
    }

    // Footer
    y = pageHeight - 15;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Calculator impozite Romania - Legea 239/2025", margin, y);

    doc.save("impozit-compus-2026.pdf");
  };

  return (
    <div className="space-y-6">
      {/* Add Item Section */}
      <Card className="p-6 bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Adaugă proprietăți
        </h3>

        {/* Tabs for item types */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "vehicle" ? "default" : "outline"}
            onClick={() => setActiveTab("vehicle")}
            className={`gap-2 ${activeTab === "vehicle" ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"}`}
          >
            <Car className="w-4 h-4" />
            Vehicul
          </Button>
          <Button
            variant={activeTab === "building" ? "default" : "outline"}
            onClick={() => setActiveTab("building")}
            className={`gap-2 ${activeTab === "building" ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"}`}
          >
            <Building2 className="w-4 h-4" />
            Clădire
          </Button>
          <Button
            variant={activeTab === "land" ? "default" : "outline"}
            onClick={() => setActiveTab("land")}
            className={`gap-2 ${activeTab === "land" ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"}`}
          >
            <Landmark className="w-4 h-4" />
            Teren
          </Button>
        </div>

        {/* Vehicle Form */}
        {activeTab === "vehicle" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nume vehicul</Label>
              <Input
                placeholder="ex: BMW X5"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tip vehicul</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tipul" />
                  </SelectTrigger>
                  <SelectContent>
                    {getVehicleTypes().map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cilindree (cm³)</Label>
                <Input
                  type="number"
                  placeholder="ex: 1800"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Normă de poluare</Label>
                <Select value={euro} onValueChange={setEuro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează norma" />
                  </SelectTrigger>
                  <SelectContent>
                    {getEuroNorms().map((norm) => (
                      <SelectItem key={norm.value} value={norm.value}>
                        {norm.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {euro === "hybrid_le_50" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Reducere locală hibrid ≤50g (0-30%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[Number(hybridDiscount)]}
                      onValueChange={(vals) => setHybridDiscount(String(vals[0] ?? 0))}
                      min={0}
                      max={30}
                      step={1}
                      className="flex-1"
                    />
                    <div className="text-sm font-medium w-16 text-right">{hybridDiscount}%</div>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={addVehicle} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Adaugă vehicul
            </Button>
          </div>
        )}

        {/* Building Form */}
        {activeTab === "building" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nume clădire</Label>
              <Input
                placeholder="ex: Casa de pe strada Florilor"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Tip clădire</Label>
                <Select value={buildingType} onValueChange={setBuildingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tipul" />
                  </SelectTrigger>
                  <SelectContent>
                    {getBuildingTypes().map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Suprafață (m²)</Label>
                <Input
                  type="number"
                  placeholder="ex: 100"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Rangul localității</Label>
                <Select value={cityRank} onValueChange={setCityRank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează rangul" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCityRanks().map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Zona (A-D)</Label>
                <Select value={cityZone} onValueChange={setCityZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCityZones().map((z) => (
                      <SelectItem key={z.value} value={z.value}>
                        {z.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cota locală (%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[Math.round(localRatePercent * 10000) / 100]}
                    onValueChange={(vals) => setLocalRatePercent((vals[0] ?? 8) / 100)}
                    min={8}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                  <div className="text-sm font-medium w-20 text-right">
                    {localRatePercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-600">
                  <Checkbox
                    id="utilities"
                    checked={hasUtilities}
                    onCheckedChange={(checked) => setHasUtilities(checked as boolean)}
                  />
                  <Label htmlFor="utilities" className="cursor-pointer flex-1 text-slate-900 dark:text-slate-100">
                    Are utilități (apă/canalizare/curent/încălzire)
                  </Label>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Încăperi subsol/demisol/mansardă</Label>
                <Select value={specialUsage} onValueChange={setSpecialUsage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nu se aplică</SelectItem>
                    <SelectItem value="locuinta">Locuință (75%)</SelectItem>
                    <SelectItem value="alte_scopuri">Alte scopuri (50%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={addBuilding} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Adaugă clădire
            </Button>
          </div>
        )}

        {/* Land Form */}
        {activeTab === "land" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nume teren</Label>
              <Input
                placeholder="ex: Teren agricol Iași"
                value={landName}
                onChange={(e) => setLandName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Tip teren</Label>
                <Select value={scenario} onValueChange={setScenario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tipul" />
                  </SelectTrigger>
                  <SelectContent>
                    {getLandTaxScenarios().map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Suprafață (m²)</Label>
                <Input
                  type="number"
                  placeholder="ex: 5000"
                  value={areaM2}
                  onChange={(e) => setAreaM2(e.target.value)}
                />
              </div>

              {(scenario === "intravilan_construction" || scenario === "intravilan_other_large") && (
                <>
                  <div className="space-y-2">
                    <Label>Zona (A-D)</Label>
                    <Select value={landCityZone} onValueChange={setLandCityZone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCityZones().map((z) => (
                          <SelectItem key={z.value} value={z.value}>
                            {z.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Rangul localității</Label>
                    <Select value={landCityRank} onValueChange={setLandCityRank}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează rangul" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCityRanks().map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {scenario === "extravilan" && (
                <div className="space-y-2">
                  <Label>Rangul localității</Label>
                  <Select value={landCityRank} onValueChange={setLandCityRank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează rangul" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCityRanks().map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(scenario === "intravilan_other_large" || scenario === "extravilan") && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Categoria de folosință</Label>
                  <Select value={landUseCategory} onValueChange={setLandUseCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {getLandUseCategories().map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Button onClick={addLand} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Adaugă teren
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </Card>

      {/* Items List */}
      {items.length > 0 && (
        <Card className="p-6 bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Proprietăți adăugate
          </h3>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-600"
              >
                <div className="flex-shrink-0 mt-1">
                  {item.type === "vehicle" && <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  {item.type === "building" && <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />}
                  {item.type === "land" && <Landmark className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.breakdown}</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400 mt-2">
                    {item.tax.toFixed(2)} lei
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Total and Export */}
      {items.length > 0 && (
        <>
          {/* Discount Warning */}
          {isDiscountAvailable() && (
            <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600/70">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                    💰 Reducere de 10% disponibilă!
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                    Dacă plătiți taxa <strong>până la 31 martie 2026</strong>, beneficiați de o reducere de <strong>10%</strong>.
                  </p>
                  <div className="bg-white dark:bg-slate-800/80 rounded p-2 border border-amber-200 dark:border-amber-700/50">
                    <p className="text-xs text-amber-700 dark:text-amber-200">
                      <span className="font-semibold">Total cu reducere (10%):</span>{" "}
                      <span className="text-base font-bold text-amber-700 dark:text-amber-300">
                        {discountedTotal.toFixed(2)} lei
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Total normal: {totalTax.toFixed(2)} lei
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-200 dark:border-green-700/70">
            <div className="flex gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900 dark:text-green-200">
                  Total impozite
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Conform Legii 239/2025
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 rounded-lg p-4 border border-green-100 dark:border-green-700/50 mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                Suma totală anuală:
              </p>
              <p className="text-4xl font-bold text-green-700 dark:text-green-400">
                {isDiscountAvailable() ? discountedTotal.toFixed(2) : totalTax.toFixed(2)} lei
              </p>
              {isDiscountAvailable() && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Fără reducere: {totalTax.toFixed(2)} lei
                </p>
              )}
            </div>

            <Button onClick={exportToPDF} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
              <Download className="w-4 h-4" />
              Exportă în PDF
            </Button>
          </Card>
        </>
      )}

      {items.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p>Adaugă proprietăți pentru a calcula impozitul compus</p>
        </div>
      )}
    </div>
  );
}
