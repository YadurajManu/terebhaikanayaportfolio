# GangaDrishti SIH 2026 browser prototype

A standalone React/Vite/TypeScript application for demonstrating the microplastic optical screening path described in the team proposal.

## Run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. `npm run build` creates a static `dist/` suitable for offline presentation once dependencies are installed.

## Live evaluation flow

1. Open **Analysis workbench** and inspect the synthetic calibration disc.
2. Press **Run analysis**. The app reads pixels, thresholds fluorescence, measures connected regions, calculates candidates per litre and displays evidence.
3. Select a region to inspect size and measured signal. Export a draft CSV if useful.
4. Replace the image with a real fluorescence capture. Enter the measured image scale (µm/pixel), filtered volume, collection details and field blank. The app does not fabricate these values.
5. Use **Method & architecture** to explain the proposed device and where this browser demonstrator differs.

The bundled calibration image and manifest are synthetic. No PFAS or antibiotic sensor is connected. The exported CSV is a draft field record, **not** an official WQMIS integration. See `SOURCES.md` for evidence and limitations.

## Checks

```bash
npm test
npm run build
```
