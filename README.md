# Calculatorul de impozite România 🇷🇴

O aplicație web informativă pentru estimarea impozitelor locale în România (dezvoltată pentru uz orientativ — nu înlocuiește acte oficiale).

## 📋 Descriere

Aplicația oferă trei module principale:

- **Impozit pe vehicule** — calcule pentru autoturisme, motociclete, autobuze și alte categorii; suport pentru vehicule hibride și electrice.
- **Impozit pe clădiri** — calcule pentru construcții rezidențiale și nerezidențiale, ținând cont de tip, suprafață, zonă, facilități și multiplicatori pentru subsol/mansardă.
- **Impozit pe teren** — trei scenarii: intravilan cu construcții, intravilan fără construcții (>400 m²) și extravilan.

Aplicația include o hartă interactivă (OpenStreetMap/Leaflet) care folosește un fișier local cu localități pentru estimări rapide.

## 🎯 Funcționalități principale

- Calcul în timp real pentru toate modulele.
- Reguli speciale pentru vehicule hibride (emisii ≤50 g CO₂/km) și reducere locală configurabilă.
- Coeficienți de zonă și rang pentru clădiri; cota locală ajustabilă.
- Tabele și coeficienți pentru scenariile de teren.
- Harta interactivă cu estimări la hover și marker-e pentru localități (dacă coordonatele sunt disponibile).

## ⚠️ Disclaimer

Această aplicație are scop informativ. Rezultatele afișate nu constituie o decizie oficială de impunere. Pentru informații sau decizii oficiale, contactați autoritățile fiscale sau un consultant specializat.

## 📚 Surse

- Legea 239/2025 și normele de aplicare
- Documente și instrucțiuni ANAF
- Hotărâri de guvern cu tarife și coeficienți

Verificați periodic sursele oficiale pentru actualizări.

## 🚀 Instalare și rulare

### Cerințe

- Node.js v20.x+
- pnpm v10.x+ (sau npm/yarn)
- Docker (opțional)

### Dezvoltare locală

1. Clonați repository-ul:

```bash
git clone <repo-url>
cd tax-calculator-ro
```

2. Instalați dependențele:

```bash
pnpm install
```

3. Porniți în modul dezvoltare:

```bash
pnpm dev
```

Frontend: http://localhost:5173

### Build pentru producție

```bash
pnpm build
pnpm preview
```

### Docker

Recomandat: Docker Compose

```bash
docker-compose up --build
```

Aplicația va fi disponibilă la http://localhost:3000

Pentru dezvoltare cu Vite hot-reload:

```bash
docker-compose --profile dev up --build tax-calculator-dev
```

Alternativ, pentru a construi manual:

```bash
docker build -t tax-calculator-ro .
docker run -p 3000:3000 tax-calculator-ro
```

## 🌍 Scriptul de geocodificare (`geocode:ro`)

Scriptul `pnpm geocode:ro` interoghează serviciul Nominatim (OpenStreetMap) pentru a completa coordonatele localităților din `client/src/data/ro_cities.ts`.

Detalii importante:

- Throttling: 1200 ms între cereri (respectă politica serviciului).
- Scriptul salvează progresul și poate fi reluat.
- Se acceptă doar rezultate pentru locații din România; unele intrări pot necesita completare manuală.

Executare:

```bash
pnpm geocode:ro
```

Timp estimat: câteva minute, în funcție de numărul de localități fără coordonate.

## 🗺️ Harta interactivă

- Folosim OpenStreetMap (Leaflet) fără cheie API.
- La plasarea mouse-ului peste o localitate apare o estimare simplificată; calculul final ia în considerare zona și coeficienții selectați.


## 🔧 Configurare și variabile de mediu

Nu sunt variabile obligatorii. Exemplu opțional:

```bash
NODE_ENV=production
```

## 📁 Structura proiectului (rezumat)

Cele mai importante fișiere și foldere:

```
tax-calculator-ro/
├── client/                    # Frontend React + Vite
│   ├── src/
│   │   ├── components/        # Componentele calculatoarelor
│   │   ├── lib/               # Logica de calcul (taxCalculations.ts)
│   │   ├── data/              # Date (ro_cities.ts cu localități și coordonate)
│   │   └── pages/
├── scripts/                   # Scripturi utilitare (geocode_ro_cities.ts)
├── Dockerfile
├── Dockerfile.dev
├── docker-compose.yaml
├── package.json
└── README.md
```

## 🛠️ Stack tehnologic

- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS + Radix UI
- Hărți: Leaflet + React-Leaflet
- Iconuri: Lucide React
- Web Server: nginx

## 📝 Licență

MIT — vedeți fișierul LICENSE pentru detalii.

## 📞 Suport

- Deschideți un issue pe GitHub pentru bug-uri sau sugestii.

## 🙏 Mulțumiri

- ANAF — surse legislative
- OpenStreetMap — hărți și geocodificare
- Radix UI, React și TypeScript

---

**Versiune**: 1.0.0  
**Data ultimei actualizări**: ianuarie 2026  
**Status**: Production-ready

⚠️ **Orice utilizare a acestei aplicații implică acceptarea disclaimer-ului de mai sus.**
