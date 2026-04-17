# Itiner

Premium AI travel planner: React + Vite + Tailwind frontend, Express + OpenAI backend. OpenAI is only called from the server; the API key never ships to the browser.

## Prerequisites

- Node.js 20+
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Setup

1. Clone the repo and install dependencies from the monorepo root:

```bash
npm install
```

2. Configure the server:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and set `OPENAI_API_KEY`.

## Development

Run the API and the Vite dev server together (Express on port **3001**, Vite on **5173**; the client proxies `/api` to the server):

```bash
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
```

Run the compiled server (serves only the API; host the client `client/dist` behind the same origin or a CDN and align `/api` routing):

```bash
npm run start
```

## Rate limiting

- **POST `/api/itinerary`:** 5 requests per minute per IP. When exceeded, the API returns **429** with: `Too many requests, please try again later`.
- **GET `/api/itinerary/:requestId`:** 120 requests per minute per IP so the UI can poll every 2–3 seconds without hitting the generation cap.

## Persistence & refresh

- The active `requestId` is stored in `localStorage`. If a trip is still **pending**, reloading the app resumes polling and does **not** start a new generation.
- Completed trips are saved to `localStorage` so they remain available after a server restart (the in-memory job store is ephemeral).

## Project layout

- `client/` — Vite + React + TypeScript + Tailwind
- `server/` — Express + OpenAI (`gpt-4o-mini`)
