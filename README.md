# ItinerAI

AI-assisted travel itineraries: a React + Vite + Tailwind client talks to an Express API that calls OpenAI. **The OpenAI API key stays on the server** and is never exposed to the browser.

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

- Connect the repo and use the included [`vercel.json`](vercel.json): static **Vite** build from `client/dist`, plus **Serverless** [`api/itinerary.ts`](api/itinerary.ts).
- In the Vercel project **Settings → Environment Variables**, set **`OPENAI_API_KEY`** and optional **`PIXABAY_API_KEY`** (same as local).
- [`vercel.json`](vercel.json) sets **`maxDuration`: 60** for this route (useful on Pro). On **Hobby**, Vercel caps execution time (often **10s**); if requests time out, upgrade or trim the OpenAI/Pixabay work.

## Rate limiting

- **POST `/api/itinerary`:** 5 requests per minute per IP (Express dev server). When exceeded, the API returns **429** with `Too many requests, please try again later`.
- **Vercel:** the serverless route does not use the Express limiter; for a portfolio this is usually fine.

## Client behavior

- **Active trip:** The current `requestId` is stored in `localStorage`. Planning is **synchronous**: the client waits for `POST /api/itinerary`, then navigates to the trip with the itinerary in router state (and saves it locally).
- **Saved trips:** Completed itineraries are stored locally. Open **Saved trips** (header or trip sidebar) to browse and reopen them; data is **this device only** and survives a server restart (the in-memory job store does not).

## Project layout

| Path | Role |
|------|------|
| `client/` | Vite, React, TypeScript, Tailwind, React Router |
| `server/` | Express, OpenAI (`gpt-4o-mini`), JSON itinerary generation |
