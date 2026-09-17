# Eagle Flame Admin

Portable React Native + Expo + TypeScript admin/stock application.

## Current state

Phase 2A source recovered from Replit and cleaned for standalone development. The app currently uses local/mock data through `context/MockStoreContext.tsx` and AsyncStorage. It is not connected to PHP/MySQL yet.

Main navigation: **Dashboard | Stock | Sales | Reports | More**. Product Master is inside Stock. Sales is separate from non-revenue Stock Out.

## Run

1. Install Node.js (LTS) and npm.
2. In this folder run `npm install`.
3. Run `npx expo start`.
4. Open the project with Expo Go on Android using the QR/link shown by Expo.

Useful scripts:

- `npm start` — start Expo
- `npm run android` — start/open Android target
- `npm run web` — web preview
- `npm run typecheck` — TypeScript check

## Important locations

- `app/` — Expo Router screens/routes
- `components/` — reusable UI
- `context/MockStoreContext.tsx` — shared mock/local transaction state
- `services/mockLedger.ts` — stock movement logic
- `mock/data.ts` — seed/demo data
- `models/index.ts` — TypeScript data models
- `constants/colors.ts` — theme colors
- `config/api.ts` — future API base URL/configuration
- `assets/` — logo/app images

## Backend plan

The future backend will be PHP + PDO + MySQL on Namecheap. Keep the API base URL centralized in `config/api.ts`. Customer-facing APIs must not expose internal fields such as landing cost.

## Remaining work

Phase 2B: proper Stock Out history/forms, Stock Adjustment, posted-only Stock Ledger with running balances and filters, dashboard calculations, and report calculations. Then master data (categories, suppliers, locations, users/permissions) and the real REST API.

## Replit cleanup

This standalone copy removes Replit workspace references, Replit-specific run scripts, caches, server wrappers, and workspace-only dependencies.
