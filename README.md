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

Edit `server/.env` and set `OPENAI_API_KEY`. Optional: `PORT` (default **3001**).

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

The server serves the itinerary API only. Deploy `client/dist` with your static host and route `/api` to the same origin as the app (or adjust the client’s API base URL to match your deployment).

## Rate limiting

- **POST `/api/itinerary`:** 5 requests per minute per IP. When exceeded, the API returns **429** with `Too many requests, please try again later`.
- **GET `/api/itinerary/:requestId`:** 120 requests per minute per IP so the UI can poll every few seconds without competing with the stricter POST limit.

## Client behavior

- **Active trip:** The current `requestId` is stored in `localStorage`. If a job is still **pending**, returning to the app resumes polling instead of starting a new run.
- **Saved trips:** Completed itineraries are stored locally. Open **Saved trips** (header or trip sidebar) to browse and reopen them; data is **this device only** and survives a server restart (the in-memory job store does not).

## Project layout

| Path | Role |
|------|------|
| `client/` | Vite, React, TypeScript, Tailwind, React Router |
| `server/` | Express, OpenAI (`gpt-4o-mini`), JSON itinerary generation |
