/*
  One-time geocoder for Romanian cities using Nominatim
  - Reads cities from client/src/data/ro_cities.ts
  - Fetches lat/lng for entries missing coordinates (rank II/III currently added)
  - Writes back the file with coordinates filled in
  Usage: pnpm geocode:ro
*/

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Import the dataset directly using tsx runner
import roCitiesModule from "../client/src/data/ro_cities.ts";

type CityItem = {
  name: string;
  rank: "0" | "I" | "II" | "III" | "IV" | "V";
  lat?: number;
  lng?: number;
};

const roCities: CityItem[] = (roCitiesModule as any).roCities ?? roCitiesModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.resolve(__dirname, "../client/src/data/ro_cities.ts");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function geocodeOnce(name: string): Promise<{ lat: number; lng: number } | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "ro");
  url.searchParams.set("countrycodes", "ro");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", name);

  const res = await fetch(url.toString(), {
    headers: {
      "Accept-Language": "ro",
    },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as Array<{ lat: string; lon: string; address?: { country_code?: string } }>;
  if (!json || !json[0] || !json[0].lat || !json[0].lon) return null;
  if (json[0].address && json[0].address.country_code !== "ro") return null;
  const lat = parseFloat(json[0].lat);
  const lng = parseFloat(json[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

function serialize(cities: CityItem[]) {
  const header = `export type CityItem = {\n  name: string;\n  rank: "0" | "I" | "II" | "III" | "IV" | "V";\n  lat?: number;\n  lng?: number;\n};\n\nexport const roCities: CityItem[] = [\n`;
  const body = cities
    .map((c) => {
      const fields = [
        `name: ${JSON.stringify(c.name)}`,
        `rank: ${JSON.stringify(c.rank)}`,
        ...(typeof c.lat === "number" ? [`lat: ${c.lat.toFixed(6)}`] : []),
        ...(typeof c.lng === "number" ? [`lng: ${c.lng.toFixed(6)}`] : []),
      ];
      return `  { ${fields.join(", ")} },`;
    })
    .join("\n");
  const footer = `\n];\n\nexport default roCities;\n`;
  return header + body + footer;
}

async function main() {
  const missing = roCities.filter((c) => typeof c.lat !== "number" || typeof c.lng !== "number");
  if (missing.length === 0) {
    console.log("No cities missing coordinates.");
    return;
  }
  console.log(`Geocoding ${missing.length} Romanian cities (polite rate-limited)...`);
  for (const c of missing) {
    const label = `${c.name}`;
    try {
      const res = await geocodeOnce(label);
      if (res) {
        c.lat = res.lat;
        c.lng = res.lng;
        console.log(`OK  ${c.name} -> ${res.lat.toFixed(5)}, ${res.lng.toFixed(5)}`);
      } else {
        console.warn(`SKIP ${c.name} -> not found in RO`);
      }
    } catch (e) {
      console.warn(`ERR ${c.name}: ${(e as Error).message}`);
    }
    // Be polite with Nominatim
    await sleep(1200);
  }

  const updated = serialize(roCities);
  await fs.writeFile(dataFile, updated, "utf8");
  console.log(`Updated ${path.relative(process.cwd(), dataFile)} with coordinates.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
