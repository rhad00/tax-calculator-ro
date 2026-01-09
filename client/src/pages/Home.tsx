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
        <div className="container py-4 sm:py-6">
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">RO</span>
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 truncate">
                Calculator de impozite 2026
              </h1>
            </div>
            <div className="shrink-0">
              <ThemeSwitcher />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Calculator pentru impozitele din România, conform Legii 239/2025
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Card informativ */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h2 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
              ℹ️ Calculator Impozite și Taxe Locale 2026 - România
            </h2>
            <p className="text-blue-800 dark:text-blue-300 text-xs sm:text-sm leading-relaxed">
              Acest calculator te ajută să calculezi rapid impozitele și taxele locale pentru 2026 conform Legii 239/2025. 
              Calculează <strong>impozitul pe autoturism, mașină, vehicul</strong>, <strong>impozitul pe locuință, apartament, casă</strong>, 
              <strong>impozitul pe clădiri și construcții</strong>, precum și <strong>impozitul pe teren și terenuri</strong> (intravilan și extravilan). 
              Introdu detaliile vehiculului sau informațiile despre proprietatea imobiliară pentru a obține o estimare precisă a impozitului.
            </p>
          </div>

          {/* Taburi */}
          <Tabs defaultValue="vehicle" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-8 bg-slate-100 dark:bg-slate-800/80 border dark:border-slate-700 p-2 h-auto">
              <TabsTrigger value="vehicle" className="gap-1.5 sm:gap-2 min-h-[44px] flex-col sm:flex-row data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">
                <Car className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Impozit vehicul</span>
              </TabsTrigger>
              <TabsTrigger value="building" className="gap-1.5 sm:gap-2 min-h-[44px] flex-col sm:flex-row data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">
                <Building2 className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Impozit clădire</span>
              </TabsTrigger>
              <TabsTrigger value="land" className="gap-1.5 sm:gap-2 min-h-[44px] flex-col sm:flex-row data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">
                <Landmark className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Impozit teren</span>
              </TabsTrigger>
              <TabsTrigger value="composite" className="gap-1.5 sm:gap-2 min-h-[44px] flex-col sm:flex-row data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">
                <Calculator className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Impozit compus</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab impozit vehicul */}
            <TabsContent value="vehicle" className="space-y-6">
              <article className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Calculator Impozit Auto 2026 - Autoturism, Mașină, Vehicul
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  Calculează impozitul pentru autoturism, mașină sau orice vehicul în funcție de capacitatea cilindrică (cm³), 
                  norma de poluare (standard Euro 0-6), vehicule hibride și electrice. Calculator actualizat pentru 2026.
                </p>
                <VehicleTaxCalculator />
              </article>
            </TabsContent>

            {/* Tab impozit clădire */}
            <TabsContent value="building" className="space-y-6">
              <article className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Calculator Impozit Clădiri 2026 - Locuințe, Apartamente, Case
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  Calculează impozitul pe locuință, apartament, casă sau orice clădire în funcție de tip (rezidențial/nerezidențial), 
                  suprafață construită (m²), utilități, zona (A-D), rangul localității și cota locală. Calculator impozit imobiliare 2026.
                </p>
                <BuildingTaxCalculator />
              </article>
            </TabsContent>

            {/* Tab impozit teren */}
            <TabsContent value="land" className="space-y-6">
              <article className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Calculator Impozit pe Teren 2026 - Terenuri Intravilan și Extravilan
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  Calculează impozitul pentru teren sau terenuri (intravilan cu/fără construcții sau extravilan) în 
                  funcție de suprafață, zona (A-D), rangul localității și categoria de folosință. Calculator taxe teren 2026.
                </p>
                <LandTaxCalculator />
              </article>
            </TabsContent>

            {/* Tab impozit compus */}
            <TabsContent value="composite" className="space-y-6">
              <article className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Calculator Impozit Total 2026 - Toate Proprietățile
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  Adaugă toate proprietățile tale (vehicule, autoturisme, mașini, clădiri, locuințe, apartamente, case, terenuri) pentru
                  a calcula impozitul total și a beneficia de reducerea de 10% dacă
                  plătești până la 31 martie 2026. Exportă rezultatul în PDF pentru evidență.
                </p>
                <CompositeTaxCalculator />
              </article>
            </TabsContent>
          </Tabs>

          {/* Informații suplimentare */}
          <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                  Noutăți Calculator Impozit Auto / Vehicule 2026
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>✓ Calculator bazat pe capacitate cilindrică (cm³) ȘI norma de poluare Euro</li>
                  <li>✓ Vehicule electrice: impozit redus 40 lei/an</li>
                  <li>✓ Autoturisme hibride: lei/200 cm³ (vehicule ≤50g CO₂: reducere până la -30% locală)</li>
                  <li>✓ Noi reglementări valabile de la 1 ianuarie 2026 - Legea 239/2025</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                  Noutăți Calculator Impozit Locuințe / Clădiri / Terenuri 2026
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>✓ Valori de bază actualizate pe m² pentru apartamente, case, clădiri</li>
                  <li>✓ Cota minimă nu poate fi mai mică decât în anul 2025</li>
                  <li>✓ Reducere treptată de 50% începând cu anul 2027</li>
                  <li>✓ Taxe și impozite locale conform Legii 239/2025</li>
                </ul>
              </div>
            </div>
            
            {/* SEO Content Section */}
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Cum se calculează impozitele și taxele locale în România pentru 2026?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>Calculatorul de impozite 2026</strong> te ajută să determini rapid valoarea taxelor locale pentru toate proprietățile tale. 
                Pentru <strong>impozitul pe auto/autoturism/mașină</strong>, calculul ia în considerare capacitatea cilindrică a motorului și norma Euro. 
                Pentru <strong>impozitul pe locuință/apartament/casă/clădire</strong>, se folosește suprafața construită, utilități disponibile, zona și rangul localității. 
                Pentru <strong>impozitul pe teren/terenuri</strong> (intravilan sau extravilan), calculul depinde de suprafață, zonă și categoria de folosință. 
                Toate calculele sunt conforme cu <strong>Legea 239/2025</strong> privind taxele și impozitele locale.
              </p>
            </div>
          </section>

          {/* Avertisment legal */}
          <aside className="mt-6 sm:mt-8 p-3 sm:p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Disclaimer:</strong> Acest calculator de impozite oferă estimări orientative conform
            Legii 239/2025 pentru calculul impozitului pe auto, autoturism, mașină, vehicul, locuință, apartament, casă, clădire, teren și terenuri. 
            Sumele reale pot varia în funcție de hotărârile consiliului local, coeficienți specifici și scutiri aplicabile. 
            Pentru calcule oficiale și informații detaliate despre taxele și impozitele locale, consultă primăria sau autoritățile fiscale locale.
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 mt-8 sm:mt-12">
        <div className="container py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
              © 2026 Calculator de impozite România. Toate drepturile rezervate.
            </p>
            <a
              href="https://github.com/rhad00/tax-calculator-ro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors min-h-[44px]"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Vezi pe GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
