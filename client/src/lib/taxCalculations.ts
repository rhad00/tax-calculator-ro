/**
 * Tax Calculation Library for Romanian Taxes (Law 239/2025)
 * Handles vehicle tax and building tax calculations
 */

// Vehicle Tax Types
export interface VehicleTaxRate {
  type: string;
  capacityMin: number;
  capacityMax: number;
  euro0_3: number;
  euro4: number;
  euro5: number;
  euro6: number;
  hybridOver50: number;
}

export interface VehicleTaxInput {
  type: "car" | "motorcycle" | "bus" | "other";
  capacity: number; // in cm³
  euro:
    | "euro0_3"
    | "euro4"
    | "euro5"
    | "euro6"
    | "hybrid_le_50"
    | "hybrid_gt_50"
    | "electric";
  // Pentru hibride ≤50g CO₂/km, se poate aplica o reducere locală până la 30%
  localHybridDiscount?: number; // fracție 0.0 - 0.3
}

// Building Tax Types
export interface BuildingTaxRate {
  type: string;
  withUtilities: number;
  withoutUtilities: number;
}

export interface BuildingTaxInput {
  type: "A" | "B" | "C" | "D";
  area: number; // in m²
  hasUtilities: boolean;
  // Coeficienți zonă/rang
  cityRank: "0" | "I" | "II" | "III" | "IV" | "V";
  cityZone: "A" | "B" | "C" | "D";
  // Cota locală (procente) 0.08% - 0.2%
  localRatePercent: number; // percentage value e.g., 0.08 to 0.2
  specialUsage?: "none" | "locuinta" | "alte_scopuri"; // E/F: subsol/demisol/mansardă
}

// Land Tax Types
export interface LandTaxInput {
  scenario: "intravilan_construction" | "intravilan_other_large" | "extravilan";
  areaM2: number; // in m²
  // For intravilan_construction and intravilan_other_large
  cityZone?: "A" | "B" | "C" | "D";
  cityRank?: "0" | "I" | "II" | "III" | "IV" | "V";
  // For intravilan_other_large and extravilan
  landUseCategory?: string; // e.g., "arable", "pasture", etc.
}

// Vehicle Tax Rates (lei per 200 cm³)
const VEHICLE_TAX_RATES: VehicleTaxRate[] = [
  // Cars and motorcycles up to 1,600 cm³
  {
    type: "car_motorcycle_small",
    capacityMin: 0,
    capacityMax: 1600,
    euro0_3: 19.5,
    euro4: 18.8,
    euro5: 17.6,
    euro6: 16.5,
    hybridOver50: 16.2,
  },
  // Motorcycles over 1,600 cm³
  {
    type: "motorcycle_large",
    capacityMin: 1601,
    capacityMax: 1600, // Special case - only for motorcycles
    euro0_3: 22.1,
    euro4: 21.3,
    euro5: 19.9,
    euro6: 18.7,
    hybridOver50: 18.4,
  },
  // Cars 1,601-2,000 cm³
  {
    type: "car_1601_2000",
    capacityMin: 1601,
    capacityMax: 2000,
    euro0_3: 29.7,
    euro4: 28.5,
    euro5: 26.7,
    euro6: 25.1,
    hybridOver50: 24.6,
  },
  // Cars 2,001-2,600 cm³
  {
    type: "car_2001_2600",
    capacityMin: 2001,
    capacityMax: 2600,
    euro0_3: 92.2,
    euro4: 88.6,
    euro5: 82.8,
    euro6: 77.8,
    hybridOver50: 76.3,
  },
  // Cars 2,601-3,000 cm³
  {
    type: "car_2601_3000",
    capacityMin: 2601,
    capacityMax: 3000,
    euro0_3: 182.9,
    euro4: 172.8,
    euro5: 154.1,
    euro6: 151.2,
    hybridOver50: 149.8,
  },
  // Cars over 3,001 cm³
  {
    type: "car_over_3001",
    capacityMin: 3001,
    capacityMax: 999999,
    euro0_3: 319.0,
    euro4: 297.3,
    euro5: 294.4,
    euro6: 290.0,
    hybridOver50: 275.5,
  },
  // Buses and minibuses
  {
    type: "bus",
    capacityMin: 0,
    capacityMax: 999999,
    euro0_3: 31.2,
    euro4: 30.0,
    euro5: 28.1,
    euro6: 26.4,
    hybridOver50: 25.9,
  },
  // Other vehicles up to 12 tons
  {
    type: "other_vehicle",
    capacityMin: 0,
    capacityMax: 999999,
    euro0_3: 39.0,
    euro4: 37.5,
    euro5: 35.1,
    euro6: 33.0,
    hybridOver50: 32.4,
  },
];

// Building Tax Rates (lei per m²)
const BUILDING_TAX_RATES: Record<string, BuildingTaxRate> = {
  A: {
    type:
      "Clădire cu cadre din beton armat sau cu pereți exteriori din cărămidă arsă sau din materiale tratate termic/ chimic",
    withUtilities: 2677,
    withoutUtilities: 1606,
  },
  B: {
    type:
      "Clădire cu pereții exteriori din lemn, piatră naturală, cărămidă nearsă, vălătuci sau alte materiale netratate",
    withUtilities: 803,
    withoutUtilities: 535,
  },
  C: {
    type:
      "Clădire-anexă cu cadre din beton armat sau cu pereți exteriori din cărămidă arsă ori materiale tratate",
    withUtilities: 535,
    withoutUtilities: 469,
  },
  D: {
    type:
      "Clădire-anexă cu pereții exteriori din lemn, piatră naturală, cărămidă nearsă, vălătuci sau alte materiale netratate",
    withUtilities: 335,
    withoutUtilities: 201,
  },
};

// Coeficienți pentru zona (A-D) și rangul localității (0, I, II, III, IV, V)
export const CITY_COEFFICIENTS: Record<"A" | "B" | "C" | "D", Record<"0" | "I" | "II" | "III" | "IV" | "V", number>> = {
  A: { "0": 2.60, I: 2.50, II: 2.40, III: 2.30, IV: 1.10, V: 1.05 },
  B: { "0": 2.50, I: 2.40, II: 2.30, III: 2.20, IV: 1.05, V: 1.00 },
  C: { "0": 2.40, I: 2.30, II: 2.20, III: 2.10, IV: 1.00, V: 0.95 },
  D: { "0": 2.30, I: 2.20, II: 2.10, III: 2.00, IV: 0.95, V: 0.90 },
};

// Land Tax - Intravilan with Construction (lei/ha)
// Table with min-max range by zone and rank
export const LAND_TAX_INTRAVILAN_CONSTRUCTION: Record<"A" | "B" | "C" | "D", Record<"0" | "I" | "II" | "III" | "IV" | "V", { min: number; max: number }>> = {
  A: {
    "0": { min: 8282, max: 20706 },
    I: { min: 6878, max: 17194 },
    II: { min: 6042, max: 15106 },
    III: { min: 5236, max: 13090 },
    IV: { min: 711, max: 1788 },
    V: { min: 569, max: 1422 },
  },
  B: {
    "0": { min: 6878, max: 17194 },
    I: { min: 5199, max: 12998 },
    II: { min: 4215, max: 10538 },
    III: { min: 3558, max: 8894 },
    IV: { min: 569, max: 1422 },
    V: { min: 427, max: 1068 },
  },
  C: {
    "0": { min: 5199, max: 12998 },
    I: { min: 3558, max: 8894 },
    II: { min: 2668, max: 6670 },
    III: { min: 1690, max: 4226 },
    IV: { min: 427, max: 1068 },
    V: { min: 284, max: 710 },
  },
  D: {
    "0": { min: 3558, max: 8894 },
    I: { min: 1690, max: 4226 },
    II: { min: 1410, max: 3526 },
    III: { min: 984, max: 2439 },
    IV: { min: 278, max: 696 },
    V: { min: 142, max: 356 },
  },
};

// Land Tax - Intravilan without Construction >400m² (base rates lei/ha by zone and land use)
export const LAND_TAX_INTRAVILAN_OTHER_BASE: Record<"A" | "B" | "C" | "D", Record<string, number>> = {
  A: {
    arable: 75,
    pasture: 56,
    hayfield: 56,
    vine: 122,
    orchard: 143,
    forest: 75,
    water: 41,
    roads: 0,
    unproductive: 0,
    beach: 41,
  },
  B: {
    arable: 56,
    pasture: 51,
    hayfield: 51,
    vine: 94,
    orchard: 122,
    forest: 56,
    water: 36,
    roads: 0,
    unproductive: 0,
    beach: 36,
  },
  C: {
    arable: 51,
    pasture: 41,
    hayfield: 41,
    vine: 75,
    orchard: 94,
    forest: 51,
    water: 22,
    roads: 0,
    unproductive: 0,
    beach: 22,
  },
  D: {
    arable: 41,
    pasture: 36,
    hayfield: 36,
    vine: 51,
    orchard: 75,
    forest: 41,
    water: 0,
    roads: 0,
    unproductive: 0,
    beach: 0,
  },
};

// Correction coefficients for intravilan without construction >400m² and extravilan by rank
export const LAND_TAX_CORRECTION_COEFFICIENTS: Record<"0" | "I" | "II" | "III" | "IV" | "V", number> = {
  "0": 8.0,
  I: 5.0,
  II: 4.0,
  III: 3.0,
  IV: 1.1,
  V: 1.0,
};

// Land Tax - Extravilan (base rates lei/ha by land use)
export const LAND_TAX_EXTRAVILAN_BASE: Record<string, { min: number; max: number } | number> = {
  construction: { min: 60, max: 83 },
  arable: { min: 112, max: 134 },
  pasture: { min: 54, max: 75 },
  hayfield: { min: 54, max: 75 },
  vine: { min: 129, max: 148 },
  orchard: { min: 129, max: 150 },
  forest: { min: 22, max: 43 },
  water: { min: 3, max: 15 },
  roads: { min: 0, max: 0 },
  unproductive: 0,
  beach: { min: 3, max: 15 },
};

/**
 * Calculate vehicle tax based on capacity and Euro norm
 * Formula: (Capacity / 200) × Rate per 200 cm³
 */
export function calculateVehicleTax(input: VehicleTaxInput): {
  tax: number;
  breakdown: string;
} {
  // Special cases
  if (input.euro === "electric") {
    return {
      tax: 40,
      breakdown: "Vehicul electric: 40 lei/an",
    };
  }

  // Hibride ≤50g CO₂/km: se calculează ca hibride >50g, apoi se aplică reducerea locală (max 30%) dacă este setată

  // Find the appropriate rate
  let rate: VehicleTaxRate | undefined;

  if (input.type === "motorcycle") {
    // Special handling for motorcycles
    if (input.capacity <= 1600) {
      rate = VEHICLE_TAX_RATES[0];
    } else {
      rate = VEHICLE_TAX_RATES[1];
    }
  } else if (input.type === "bus") {
    rate = VEHICLE_TAX_RATES[6];
  } else if (input.type === "other") {
    rate = VEHICLE_TAX_RATES[7];
  } else {
    // Cars
    rate = VEHICLE_TAX_RATES.find(
      (r) =>
        r.type.startsWith("car_") &&
        input.capacity >= r.capacityMin &&
        input.capacity <= r.capacityMax
    );
  }

  if (!rate) {
    throw new Error("Nu s-a găsit o rată de impozit pentru vehiculul dat");
  }

  // Get the rate for the specific Euro norm
  let ratePerUnit: number;
  switch (input.euro) {
    case "euro0_3":
      ratePerUnit = rate.euro0_3;
      break;
    case "euro4":
      ratePerUnit = rate.euro4;
      break;
    case "euro5":
      ratePerUnit = rate.euro5;
      break;
    case "euro6":
      ratePerUnit = rate.euro6;
      break;
    case "hybrid_gt_50":
      ratePerUnit = rate.hybridOver50;
      break;
    case "hybrid_le_50":
      ratePerUnit = rate.hybridOver50;
      break;
    default:
      throw new Error("Normă Euro invalidă");
  }

  // Calculate: round up any fraction of 200 cm³
  const units = Math.ceil(input.capacity / 200);
  let tax = units * ratePerUnit;
  let breakdown = `(${input.capacity} cm³ ÷ 200) × ${ratePerUnit} lei = ${units} × ${ratePerUnit} = ${tax.toFixed(2)} lei`;

  if (input.euro === "hybrid_le_50") {
    const discount = Math.min(Math.max(input.localHybridDiscount || 0, 0), 0.3);
    if (discount > 0) {
      const discountedTax = tax * (1 - discount);
      breakdown += ` → aplicată reducere locală ${(discount * 100).toFixed(0)}% = ${discountedTax.toFixed(2)} lei`;
      tax = discountedTax;
    } else {
      breakdown += " (se poate aplica o reducere locală de până la 30%)";
    }
  }

  return { tax, breakdown };
}

/**
 * Calculate building tax based on type, utilities, and area
 * Formula: Area × Rate × Local Coefficient
 */
export function calculateBuildingTax(input: BuildingTaxInput): {
  tax: number;
  breakdown: string;
} {
  const rateData = BUILDING_TAX_RATES[input.type];
  if (!rateData) {
    throw new Error(`Invalid building type: ${input.type}`);
  }

  const rate = input.hasUtilities
    ? rateData.withUtilities
    : rateData.withoutUtilities;
  // Coeficient zona/rang
  const zoneCoeff = CITY_COEFFICIENTS[input.cityZone]?.[input.cityRank];
  if (zoneCoeff === undefined) {
    throw new Error("Coeficient zonă/rang invalid");
  }
  const usage = input.specialUsage || "none";
  const usageMultiplier = usage === "locuinta" ? 0.75 : usage === "alte_scopuri" ? 0.5 : 1.0;

  // Cota locală: 0.08% - 0.2% (e.g., 0.08 → 0.0008)
  const localRateFraction = Math.min(Math.max(input.localRatePercent, 0.08), 0.2) / 100;
  const taxableBase = input.area * rate * zoneCoeff * usageMultiplier;
  const tax = taxableBase * localRateFraction;

  const utilities = input.hasUtilities ? "cu utilități" : "fără utilități";
  const usageText =
    usage === "locuinta"
      ? "× 0.75 (încăperi S/D/M folosite ca locuință)"
      : usage === "alte_scopuri"
      ? "× 0.50 (încăperi S/D/M folosite în alte scopuri)"
      : "";
  const breakdown = `${input.area} m² × ${rate} lei/m² × ${zoneCoeff.toFixed(2)} (coef. zonă/rang) ${usageText} × ${(localRateFraction * 100).toFixed(2)}% (cota locală) = ${tax.toFixed(2)} lei (${utilities})`;

  return { tax, breakdown };
}

/**
 * Get all available vehicle types for the calculator
 */
export function getVehicleTypes() {
  return [
    { value: "car", label: "Autoturism" },
    { value: "motorcycle", label: "Motocicletă/Triciclu" },
    { value: "bus", label: "Autobuz/Microbuz" },
    { value: "other", label: "Altă categorie" },
  ];
}

/**
 * Get all available Euro norms
 */
export function getEuroNorms() {
  return [
    { value: "euro0_3", label: "Euro 0-3 (vehicule mai vechi)" },
    { value: "euro4", label: "Euro 4" },
    { value: "euro5", label: "Euro 5" },
    { value: "euro6", label: "Euro 6 (cel mai nou)" },
    { value: "hybrid_le_50", label: "Hibrid (≤50g CO₂/km) — lei/200 cm³ (max -30% local)" },
    { value: "hybrid_gt_50", label: "Hibrid (>50g CO₂/km) — lei/200 cm³" },
    { value: "electric", label: "Electric — 40 lei/an" },
  ];
}

/**
 * Get all available building types
 */
export function getBuildingTypes() {
  return [
    {
      value: "A",
      label:
        "A. Clădire din beton armat/ pereți exteriori din cărămidă arsă/ materiale tratate",
    },
    {
      value: "B",
      label:
        "B. Clădire din lemn/ piatră naturală/ cărămidă nearsă/ vălătuci/ materiale netratate",
    },
    {
      value: "C",
      label:
        "C. Clădire-anexă din beton armat/ pereți din cărămidă arsă/ materiale tratate",
    },
    {
      value: "D",
      label:
        "D. Clădire-anexă din lemn/ piatră naturală/ cărămidă nearsă/ vălătuci/ materiale netratate",
    },
  ];
}

export function getCityRanks() {
  return [
    { value: "0", label: "Rang 0 — București (capitală)" },
    { value: "I", label: "Rang I" },
    { value: "II", label: "Rang II" },
    { value: "III", label: "Rang III" },
    { value: "IV", label: "Rang IV" },
    { value: "V", label: "Rang V" },
  ];
}

export function getCityZones() {
  return [
    { value: "A", label: "Zona A" },
    { value: "B", label: "Zona B" },
    { value: "C", label: "Zona C" },
    { value: "D", label: "Zona D" },
  ];
}

/**
 * Get building type details
 */
export function getBuildingTypeDetails(type: "A" | "B" | "C" | "D") {
  return BUILDING_TAX_RATES[type];
}

/**
 * Calculate land tax based on scenario (intravilan with construction, intravilan >400m² other use, extravilan)
 */
export function calculateLandTax(input: LandTaxInput): {
  tax: number;
  breakdown: string;
} {
  const areaHa = input.areaM2 / 10000; // Convert m² to hectares

  if (input.scenario === "intravilan_construction") {
    // Intravilan with construction: direct table lookup, use midpoint of range
    if (!input.cityZone || !input.cityRank) {
      throw new Error("Zone and rank required for intravilan construction");
    }
    const rangeData = LAND_TAX_INTRAVILAN_CONSTRUCTION[input.cityZone]?.[input.cityRank];
    if (!rangeData) {
      throw new Error("Invalid zone or rank");
    }
    const ratePerHa = (rangeData.min + rangeData.max) / 2;
    const tax = areaHa * ratePerHa;
    const breakdown = `${input.areaM2} m² (${areaHa.toFixed(4)} ha) × ${ratePerHa.toFixed(0)} lei/ha (median din interval ${rangeData.min}–${rangeData.max}) = ${tax.toFixed(2)} lei`;
    return { tax, breakdown };
  }

  if (input.scenario === "intravilan_other_large") {
    // Intravilan without construction >400m²: base rate × correction coefficient
    if (!input.cityZone || !input.cityRank || !input.landUseCategory) {
      throw new Error("Zone, rank, and land use category required");
    }
    const baseRate = LAND_TAX_INTRAVILAN_OTHER_BASE[input.cityZone]?.[input.landUseCategory];
    if (baseRate === undefined) {
      throw new Error("Invalid zone or land use category");
    }
    const coefficient = LAND_TAX_CORRECTION_COEFFICIENTS[input.cityRank];
    if (coefficient === undefined) {
      throw new Error("Invalid rank");
    }
    const ratePerHa = baseRate * coefficient;
    const tax = areaHa * ratePerHa;
    const breakdown = `${input.areaM2} m² (${areaHa.toFixed(4)} ha) × ${baseRate} lei/ha (bază) × ${coefficient} (coef. rang) = ${ratePerHa.toFixed(2)} lei/ha × ${areaHa.toFixed(4)} = ${tax.toFixed(2)} lei`;
    return { tax, breakdown };
  }

  if (input.scenario === "extravilan") {
    // Extravilan: base range × correction coefficient, use midpoint
    if (!input.cityRank || !input.landUseCategory) {
      throw new Error("Rank and land use category required");
    }
    const rangeData = LAND_TAX_EXTRAVILAN_BASE[input.landUseCategory];
    if (rangeData === undefined) {
      throw new Error("Invalid land use category");
    }
    const coefficient = LAND_TAX_CORRECTION_COEFFICIENTS[input.cityRank];
    if (coefficient === undefined) {
      throw new Error("Invalid rank");
    }
    let baseMin: number, baseMax: number;
    if (typeof rangeData === "number") {
      baseMin = baseMax = rangeData;
    } else {
      baseMin = rangeData.min;
      baseMax = rangeData.max;
    }
    const ratePerHa = ((baseMin + baseMax) / 2) * coefficient;
    const tax = areaHa * ratePerHa;
    const breakdown = `${input.areaM2} m² (${areaHa.toFixed(4)} ha) × (${baseMin}–${baseMax} lei/ha × ${coefficient} coef. rang) ≈ ${ratePerHa.toFixed(2)} lei/ha = ${tax.toFixed(2)} lei`;
    return { tax, breakdown };
  }

  throw new Error("Invalid scenario");
}

export function getLandTaxScenarios() {
  return [
    { value: "intravilan_construction", label: "Intravilan (teren cu construcții)" },
    { value: "intravilan_other_large", label: "Intravilan (teren fără construcții, >400 m²)" },
    { value: "extravilan", label: "Extravilan (în afara localității)" },
  ];
}

export function getLandUseCategories() {
  return [
    { value: "arable", label: "Teren arabil" },
    { value: "pasture", label: "Pășune" },
    { value: "hayfield", label: "Fâneață" },
    { value: "vine", label: "Vie" },
    { value: "orchard", label: "Livadă" },
    { value: "forest", label: "Pădure / vegetație forestieră" },
    { value: "water", label: "Teren cu apă" },
    { value: "roads", label: "Drumuri și căi ferate" },
    { value: "unproductive", label: "Teren neproductiv" },
    { value: "beach", label: "Plajă cu activități economice" },
    { value: "construction", label: "Teren cu construcții (extravilan)" },
  ];
}
