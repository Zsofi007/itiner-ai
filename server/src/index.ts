import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import { logError, logInfo, logWarn } from "./logger.js";
import type { ItineraryJSON, StoredRequest } from "./types.js";

const requests: Record<string, StoredRequest> = {};

const SYSTEM_PROMPT = `You are an elite travel planner.

Generate a detailed, realistic, and practical travel itinerary.

Include:
- Day-by-day itinerary
- Weather tips based on destination
- Packing tips based on climate and activities
- Cultural tips (etiquette, local norms)
- Food recommendations (local dishes or experiences)

Rules:
- Be specific (use real places when possible)
- Match travel style and budget
- Keep itinerary geographically logical
- Avoid generic suggestions

Return ONLY valid JSON in this structure:

{
  "destination": "...",
  "summary": "...",
  "weatherTips": "...",
  "packingTips": ["...", "..."],
  "culturalTips": ["...", "..."],
  "foodRecommendations": [
    { "name": "...", "description": "..." }
  ],
  "days": [
    {
      "title": "Day 1",
      "activities": [
        {
          "time": "Morning",
          "title": "...",
          "description": "..."
        }
      ]
    }
  ]
}`;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const rateLimitMessage = "Too many requests, please try again later";

const postLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logWarn("POST /api/itinerary rate limited", {
      ip: req.ip ?? req.socket.remoteAddress,
    });
    res.status(429).json({ error: rateLimitMessage });
  },
});

const getLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logWarn("GET /api/itinerary/:id rate limited", {
      ip: req.ip ?? req.socket.remoteAddress,
    });
    res.status(429).json({ error: rateLimitMessage });
  },
});

const app = express();
app.use(cors());
app.use(express.json());

function parseItineraryJson(raw: string): ItineraryJSON {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const parsed = JSON.parse(cleaned) as ItineraryJSON;
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid JSON");
  return parsed;
}

async function runGeneration(
  requestId: string,
  input: {
    destination: string;
    days: number;
    budget: string;
    style: string;
  },
): Promise<void> {
  const entry = requests[requestId];
  if (!entry || entry.status !== "pending") {
    logWarn("runGeneration skipped (no pending entry)", {
      requestId,
      hasEntry: Boolean(entry),
      status: entry?.status,
    });
    return;
  }

  if (!openai) {
    logError("runGeneration aborted: missing OPENAI_API_KEY", { requestId });
    requests[requestId] = {
      status: "error",
      data: null,
      errorMessage: "Server is not configured with OPENAI_API_KEY.",
    };
    return;
  }

  logInfo("OpenAI generation started", {
    requestId,
    destination: input.destination,
    days: input.days,
    budget: input.budget,
    style: input.style,
  });

  const userMessage = `Plan a trip with the following constraints:
- Destination: ${input.destination}
- Duration: ${input.days} days
- Budget: ${input.budget}
- Travel style: ${input.style}

Respond with ONLY the JSON object described in your instructions.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty model response");

    const data = parseItineraryJson(content);
    requests[requestId] = { status: "completed", data };
    logInfo("OpenAI generation completed", {
      requestId,
      destination: data.destination,
      dayCount: data.days?.length,
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    logError("OpenAI generation failed", { requestId, reason });
    requests[requestId] = {
      status: "error",
      data: null,
      errorMessage: "We could not generate your itinerary. Please try again.",
    };
  }
}

app.post("/api/itinerary", postLimiter, (req, res) => {
  const { destination, days, budget, style, requestId } = req.body as Record<
    string,
    unknown
  >;

  if (
    typeof requestId !== "string" ||
    !requestId ||
    typeof destination !== "string" ||
    !destination.trim() ||
    typeof budget !== "string" ||
    !budget.trim() ||
    typeof style !== "string" ||
    !style.trim()
  ) {
    logWarn("POST /api/itinerary rejected: validation", {
      bodyKeys: req.body && typeof req.body === "object" ? Object.keys(req.body) : [],
    });
    res.status(400).json({ error: "Missing or invalid fields." });
    return;
  }

  const daysNum = Number(days);
  if (!Number.isFinite(daysNum) || daysNum < 1 || daysNum > 30) {
    logWarn("POST /api/itinerary rejected: days out of range", {
      requestId,
      days: daysNum,
    });
    res.status(400).json({ error: "Duration must be between 1 and 30 days." });
    return;
  }

  const existing = requests[requestId];
  if (existing) {
    logInfo("POST /api/itinerary idempotent (existing requestId)", {
      requestId,
      status: existing.status,
    });
    res.json({
      requestId,
      status: existing.status,
      ...(existing.status === "completed" && existing.data
        ? { data: existing.data }
        : {}),
      ...(existing.status === "error"
        ? { errorMessage: existing.errorMessage }
        : {}),
    });
    return;
  }

  requests[requestId] = { status: "pending", data: null };
  logInfo("POST /api/itinerary accepted → pending", {
    requestId,
    destination: destination.trim(),
    days: Math.round(daysNum),
    budget: budget.trim(),
    style: style.trim(),
  });
  void runGeneration(requestId, {
    destination: destination.trim(),
    days: Math.round(daysNum),
    budget: budget.trim(),
    style: style.trim(),
  });

  res.json({ requestId, status: "pending" as const });
});

app.get("/api/itinerary/:requestId", getLimiter, (req, res) => {
  const raw = req.params.requestId;
  const requestId = Array.isArray(raw) ? raw[0] : raw;
  if (!requestId) {
    logWarn("GET /api/itinerary/:id missing param");
    res.status(400).json({ error: "Missing request id." });
    return;
  }
  const entry = requests[requestId];
  if (!entry) {
    logWarn("GET /api/itinerary/:id not found", { requestId });
    res.status(404).json({ error: "Request not found." });
    return;
  }
  logInfo("GET /api/itinerary/:id", {
    requestId,
    status: entry.status,
    hasData: Boolean(entry.data),
  });
  res.json({
    status: entry.status,
    data: entry.data,
    ...(entry.status === "error" && entry.errorMessage
      ? { errorMessage: entry.errorMessage }
      : {}),
  });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  logInfo(`Server listening on http://127.0.0.1:${PORT}`, {
    openaiConfigured: Boolean(openai),
  });
});
