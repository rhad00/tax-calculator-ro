/// <reference types="@types/google.maps" />
import { useEffect, useRef } from "react";
import { MapView } from "./Map";
import { calculateBuildingTax, BuildingTaxInput } from "@/lib/taxCalculations";

interface CityItem {
	name: string;
	rank: "0" | "I" | "II" | "III" | "IV" | "V";
}

interface CityTaxMapProps {
	className?: string;
	area: number | null;
	type: "A" | "B" | "C" | "D" | null;
	hasUtilities: boolean;
	cityZone: "A" | "B" | "C" | "D" | null;
	localRatePercent: number; // 0.08 - 0.2
	specialUsage: "none" | "locuinta" | "alte_scopuri";
}

// A small seed of cities for demo (Rank 0 + Rank I)
const CITIES: CityItem[] = [
	{ name: "București", rank: "0" },
	{ name: "Bacău", rank: "I" },
	{ name: "Brașov", rank: "I" },
	{ name: "Brăila", rank: "I" },
	{ name: "Galați", rank: "I" },
	{ name: "Cluj-Napoca", rank: "I" },
	{ name: "Constanța", rank: "I" },
	{ name: "Craiova", rank: "I" },
	{ name: "Iași", rank: "I" },
	{ name: "Oradea", rank: "I" },
	{ name: "Ploiești", rank: "I" },
	{ name: "Timișoara", rank: "I" },
];

export default function CityTaxMap({
	className,
	area,
	type,
	hasUtilities,
	cityZone,
	localRatePercent,
	specialUsage,
}: CityTaxMapProps) {
	const mapRef = useRef<google.maps.Map | null>(null);
	const infoRef = useRef<google.maps.InfoWindow | null>(null);

	const onMapReady = (map: google.maps.Map) => {
		mapRef.current = map;
		map.setCenter({ lat: 45.9432, lng: 24.9668 });
		map.setZoom(6);
		infoRef.current = new google.maps.InfoWindow();

		const geocoder = new google.maps.Geocoder();
		CITIES.forEach((city) => {
			geocoder.geocode({ address: city.name + ", România" }, (results, status) => {
				if (status === "OK" && results && results[0]) {
					const pos = results[0].geometry.location;
					const marker = new (google.maps as any).marker.AdvancedMarkerElement({
						map,
						position: pos,
						title: city.name,
					});
					marker.addListener("mouseover", () => {
						const canCompute = !!area && !!type && !!cityZone;
						let content = `<div style=\"font-family: system-ui;\">` +
							`<div><strong>${city.name}</strong> — Rang ${city.rank}</div>`;
						if (canCompute) {
							try {
								const input: BuildingTaxInput = {
									type: type!,
									area: area!,
									hasUtilities,
									cityRank: city.rank,
									cityZone: cityZone!,
									localRatePercent,
									specialUsage,
								};
								const calc = calculateBuildingTax(input);
								content += `<div>Impozit estimat: <strong>${calc.tax.toFixed(2)} lei</strong></div>`;
							} catch {
								// ignore
							}
						} else {
							content += `<div>Selectează tipul, suprafața, zona și cota pentru estimare</div>`;
						}
						content += `</div>`;
						infoRef.current!.setContent(content);
						infoRef.current!.open({ anchor: marker, map });
					});
					marker.addListener("mouseout", () => {
						infoRef.current!.close();
					});
				}
			});
		});
	};

	useEffect(() => {
		// Close info when inputs change; next hover will recompute
		infoRef.current?.close();
	}, [area, type, hasUtilities, cityZone, localRatePercent, specialUsage]);

	return (
		<div className={className}>
			<MapView onMapReady={onMapReady} />
		</div>
	);
}
