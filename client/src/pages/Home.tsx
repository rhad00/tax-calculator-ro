import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleTaxCalculator from "@/components/VehicleTaxCalculator";
import BuildingTaxCalculator from "@/components/BuildingTaxCalculator";
import LandTaxCalculator from "@/components/LandTaxCalculator";
import { Car, Building2, Landmark } from "lucide-react";

/**
 * Home page with vehicle and building tax calculators
 * Design: Modern, clean interface with clear visual hierarchy
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Antet */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">RO</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Calculator de impozite 2026
            </h1>
          </div>
          <p className="text-slate-600 text-sm">
            Calculator pentru impozitele din România, conform Legii 239/2025
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Card informativ */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              ℹ️ Despre acest calculator
            </h2>
            <p className="text-blue-800 text-sm">
              Acest calculator te ajută să calculezi impozitele pentru vehicule
              și clădiri conform Legii 239/2025, valabilă de la 1 ianuarie 2026.
              Introdu detaliile vehiculului sau informațiile despre clădire
              pentru a obține rapid o estimare a impozitului.
            </p>
          </div>

          {/* Taburi */}
          <Tabs defaultValue="vehicle" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="vehicle" className="gap-2">
                <Car className="w-4 h-4" />
                Impozit vehicul
              </TabsTrigger>
              <TabsTrigger value="building" className="gap-2">
                <Building2 className="w-4 h-4" />
                Impozit clădire
              </TabsTrigger>
              <TabsTrigger value="land" className="gap-2">
                <Landmark className="w-4 h-4" />
                Impozit teren
              </TabsTrigger>
            </TabsList>

            {/* Tab impozit vehicul */}
            <TabsContent value="vehicle" className="space-y-6">
              <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Calculator impozit vehicul
                </h2>
                <p className="text-slate-600 mb-6">
                  Calculează impozitul pentru vehicul în funcție de cilindree și
                  norma de poluare (standard Euro).
                </p>
                <VehicleTaxCalculator />
              </div>
            </TabsContent>

            {/* Tab impozit clădire */}
            <TabsContent value="building" className="space-y-6">
              <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Calculator impozit clădire
                </h2>
                <p className="text-slate-600 mb-6">
                  Calculează impozitul pentru clădire în funcție de tip, utilități
                  și suprafață.
                </p>
                <BuildingTaxCalculator />
              </div>
            </TabsContent>

            {/* Tab impozit teren */}
            <TabsContent value="land" className="space-y-6">
              <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Calculator impozit pe teren
                </h2>
                <p className="text-slate-600 mb-6">
                  Calculează impozitul pentru teren (intravilan sau extravilan) în
                  funcție de zona, rang și categoria de folosință.
                </p>
                <LandTaxCalculator />
              </div>
            </TabsContent>
          </Tabs>

          {/* Informații suplimentare */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Noutăți impozit vehicule
                </h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>✓ Bazat pe cilindree ȘI norma de poluare</li>
                  <li>✓ Vehicule electrice: 40 lei/an</li>
                  <li>✓ Hibride: lei/200 cm³ (≤50g: până la -30% local)</li>
                  <li>✓ Valabil de la 1 ianuarie 2026</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Noutăți impozit clădiri
                </h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>✓ Valori de bază actualizate pe m²</li>
                  <li>✓ Rata minimă nu poate fi mai mică decât în 2025</li>
                  <li>✓ Reducere de 50% începând cu 2027</li>
                  <li>✓ Conform Legii 239/2025</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Avertisment legal */}
          <div className="mt-8 p-4 bg-slate-100 rounded-lg text-xs text-slate-600">
            <strong>Disclaimer:</strong> Acest calculator oferă estimări conform
            Legii 239/2025. Sumele reale pot varia în funcție de deciziile
            consiliului local, coeficienți și scutiri. Consultă autoritățile
            fiscale locale pentru calcule oficiale.
          </div>
        </div>
      </main>
    </div>
  );
}
