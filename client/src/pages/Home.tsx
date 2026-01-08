import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleTaxCalculator from "@/components/VehicleTaxCalculator";
import BuildingTaxCalculator from "@/components/BuildingTaxCalculator";
import LandTaxCalculator from "@/components/LandTaxCalculator";
import CompositeTaxCalculator from "@/components/CompositeTaxCalculator";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Car, Building2, Landmark, Calculator } from "lucide-react";

/**
 * Home page with vehicle and building tax calculators
 * Design: Modern, clean interface with clear visual hierarchy
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Antet */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">RO</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Calculator de impozite 2026
              </h1>
            </div>
            <ThemeSwitcher />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Calculator pentru impozitele din România, conform Legii 239/2025
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Card informativ */}
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
              ℹ️ Despre acest calculator
            </h2>
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              Acest calculator te ajută să calculezi impozitele pentru vehicule
              și clădiri conform Legii 239/2025, valabilă de la 1 ianuarie 2026.
              Introdu detaliile vehiculului sau informațiile despre clădire
              pentru a obține rapid o estimare a impozitului.
            </p>
          </div>

          {/* Taburi */}
          <Tabs defaultValue="vehicle" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-100 dark:bg-slate-800/80 border dark:border-slate-700">
              <TabsTrigger value="vehicle" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">
                <Car className="w-4 h-4" />
                Impozit vehicul
              </TabsTrigger>
              <TabsTrigger value="building" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">
                <Building2 className="w-4 h-4" />
                Impozit clădire
              </TabsTrigger>
              <TabsTrigger value="land" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">
                <Landmark className="w-4 h-4" />
                Impozit teren
              </TabsTrigger>
              <TabsTrigger value="composite" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">
                <Calculator className="w-4 h-4" />
                Impozit compus
              </TabsTrigger>
            </TabsList>

            {/* Tab impozit vehicul */}
            <TabsContent value="vehicle" className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Calculator impozit vehicul
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Calculează impozitul pentru vehicul în funcție de cilindree și
                  norma de poluare (standard Euro).
                </p>
                <VehicleTaxCalculator />
              </div>
            </TabsContent>

            {/* Tab impozit clădire */}
            <TabsContent value="building" className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Calculator impozit clădire
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Calculează impozitul pentru clădire în funcție de tip, utilități
                  și suprafață.
                </p>
                <BuildingTaxCalculator />
              </div>
            </TabsContent>

            {/* Tab impozit teren */}
            <TabsContent value="land" className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Calculator impozit pe teren
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Calculează impozitul pentru teren (intravilan sau extravilan) în
                  funcție de zona, rang și categoria de folosință.
                </p>
                <LandTaxCalculator />
              </div>
            </TabsContent>

            {/* Tab impozit compus */}
            <TabsContent value="composite" className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Calculator impozit compus
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Adaugă toate proprietățile tale (vehicule, clădiri, terenuri) pentru
                  a calcula impozitul total și a beneficia de reducerea de 10% dacă
                  plătești până la 31 martie 2026. Exportă rezultatul în PDF.
                </p>
                <CompositeTaxCalculator />
              </div>
            </TabsContent>
          </Tabs>

          {/* Informații suplimentare */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Noutăți impozit vehicule
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>✓ Bazat pe cilindree ȘI norma de poluare</li>
                  <li>✓ Vehicule electrice: 40 lei/an</li>
                  <li>✓ Hibride: lei/200 cm³ (≤50g: până la -30% local)</li>
                  <li>✓ Valabil de la 1 ianuarie 2026</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Noutăți impozit clădiri
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>✓ Valori de bază actualizate pe m²</li>
                  <li>✓ Rata minimă nu poate fi mai mică decât în 2025</li>
                  <li>✓ Reducere de 50% începând cu 2027</li>
                  <li>✓ Conform Legii 239/2025</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Avertisment legal */}
          <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400">
            <strong>Disclaimer:</strong> Acest calculator oferă estimări conform
            Legii 239/2025. Sumele reale pot varia în funcție de deciziile
            consiliului local, coeficienți și scutiri. Consultă autoritățile
            fiscale locale pentru calcule oficiale.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 mt-12">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2026 Calculator de impozite România. Toate drepturile rezervate.
            </p>
            <a
              href="https://github.com/rhad00/tax-calculator-ro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Vezi pe GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
