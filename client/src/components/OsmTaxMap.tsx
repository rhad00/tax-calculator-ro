import React from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getBuildingTypeDetails } from "@/lib/taxCalculations";
import roCities, { CityItem } from "@/data/ro_cities";

// Default Leaflet marker fix for missing images in bundlers
// (using built-in SVG path avoids external image URLs)
const defaultIcon = new L.DivIcon({
  className: "leaflet-default-marker",
  html: '<div style="background:#2563eb;border:2px solid #fff;width:14px;height:14px;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface OsmTaxMapProps {
  className?: string;
  area: number | null;
  type: "A" | "B" | "C" | "D" | null;
  hasUtilities: boolean;
  cityZone: "A" | "B" | "C" | "D" | null;
  localRatePercent: number; // 0.08 - 0.2
  specialUsage: "none" | "locuinta" | "alte_scopuri";
}

export default function OsmTaxMap({
  className,
  area,
  type,
  hasUtilities,
  cityZone,
  localRatePercent,
  specialUsage,
}: OsmTaxMapProps) {
  const canCompute = !!area && !!type;
  // Use only local dataset; show markers only for cities with coordinates
  const citiesWithCoords = roCities.filter(
    (c) => typeof c.lat === "number" && typeof c.lng === "number"
  ) as Array<CityItem & { lat: number; lng: number }>;

  return (
    <div className={className}>
      <MapContainer
        center={[45.9432, 24.9668]}
        zoom={6}
        className="w-full h-[500px] rounded-md overflow-hidden"
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {citiesWithCoords.map((c) => {
          let taxText = "Introdu suprafața și parametrii pentru o estimare";
          if (canCompute) {
            try {
              const rateData = getBuildingTypeDetails(type!);
              const rate = hasUtilities ? rateData.withUtilities : rateData.withoutUtilities;
              const usageMultiplier =
                specialUsage === "locuinta" ? 0.75 : specialUsage === "alte_scopuri" ? 0.5 : 1.0;
              const localRateFraction = Math.min(Math.max(localRatePercent, 0.08), 0.2) / 100;
              const tax = area! * rate * usageMultiplier * localRateFraction;
              taxText = `Estimare simplificată (fără zonă): ${tax.toFixed(2)} lei`;
            } catch {
              // ignore
            }
          }
          return (
            <Marker key={c.name} position={[c.lat, c.lng]} icon={defaultIcon}>
              <Tooltip direction="top" offset={[0, -6]} opacity={1} permanent={false}>
                <div className="text-xs">
                  <div>
                    <strong>{c.name}</strong> — Rang {c.rank}
                  </div>
                  <div>{taxText}</div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
