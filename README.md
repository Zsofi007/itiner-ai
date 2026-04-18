# ItinerAI

AI-assisted travel itineraries: a React + Vite + Tailwind client calls **`POST /api/itinerary`**, which is served by **Express in development** and by a **Vercel serverless function** in production. The backend calls OpenAI (and optionally Pixabay for hero images). **API keys stay on the server** and are never exposed to the browser.

## Prerequisites

- Node.js 20+
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Setup

From the repository root:

```bash
npm install
```

Configure the server:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and set `OPENAI_API_KEY`. Optional: `PIXABAY_API_KEY`, `PORT` (default **3001**), and `ALLOWED_ORIGINS` (comma-separated URLs for Express CORS in local/production API hosting).

## Development

Runs the API and Vite together: Express on **3001**, Vite on **5173**. The dev server proxies `/api` to the backend.

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Production build

Builds the server TypeScript and the client bundle:

```bash
npm run build
```

Start the compiled API:

```bash
npm run start
```

The server serves the itinerary API only (`POST /api/itinerary` returns the completed itinerary in one response).

## Deploy on Vercel

- Connect the repo and use the included [`vercel.json`](vercel.json): it runs **`npm run build -w client`** (static output in `client/dist`) and deploys **Serverless** [`api/itinerary.ts`](api/itinerary.ts). The root **`npm run build`** still builds **server + client** for local checks; Vercel does not need the Express `dist` for routing.
- In the Vercel project **Settings → Environment Variables**, set **`OPENAI_API_KEY`** and optional **`PIXABAY_API_KEY`** (same as local).
- [`vercel.json`](vercel.json) sets **`maxDuration`: 60** for this route (useful on Pro). On **Hobby**, Vercel caps execution time (often **10s**); if requests time out, upgrade or trim the OpenAI/Pixabay work.
- The API handler imports shared logic from **`server/src/`**; the import uses a **`.js` suffix** (NodeNext ESM) so Vercel can bundle it—do not switch that import to **`.ts`** or Node will look for missing `.ts` files at runtime.

## Rate limiting

- **POST `/api/itinerary`:** 5 requests per minute per IP (Express dev server). When exceeded, the API returns **429** with `Too many requests, please try again later`.
- **Vercel:** the serverless route does not use the Express limiter.

## Client behavior

- **Generate flow:** Submitting the home form **navigates to `/trip` immediately** (skeleton UI). **`TripPage`** then calls **`POST /api/itinerary`** once with the planner fields carried in router state. On success, the itinerary is shown and **saved to `localStorage`**; there is **no polling**.
- **Active trip:** The current `requestId` is stored in `localStorage` so refresh and deep links can reload a trip that was already saved on the device.
- **Saved trips:** Completed itineraries are stored locally. Open **Saved trips** (header or trip sidebar) to browse and reopen them; the drawer uses a **focus trap** for keyboard users. Data is **this device only**.

## Project layout

| Path | Role |
|------|------|
| `client/` | Vite, React, TypeScript, Tailwind, React Router |
| `server/` | Express (local API), shared **`generateItinerary`** module (OpenAI + moderation + Pixabay) |
| `api/` | Vercel serverless entry: `POST /api/itinerary` |
| `vercel.json` | Vercel build output, SPA rewrite, function `maxDuration` |
| `tsconfig.json` | Root typecheck (`noEmit`) for `api/` + `server/src/` |
