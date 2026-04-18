import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { logInfo, logWarn } from "./logger.js";
import { generateItinerary } from "./generateItinerary.js";

const rateLimitMessage = "Too many requests, please try again later";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

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

const app = express();
app.use(
  cors(
    allowedOrigins && allowedOrigins.length > 0
      ? { origin: allowedOrigins }
      : {},
  ),
);
app.use(express.json());

app.post("/api/itinerary", postLimiter, async (req, res) => {
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

  const result = await generateItinerary({
    requestId,
    destination: destination.trim(),
    days: Math.round(daysNum),
    budget: budget.trim(),
    style: style.trim(),
  });

  if (!result.ok) {
    res.status(200).json({
      requestId: result.requestId,
      status: "error" as const,
      errorMessage: result.errorMessage,
    });
    return;
  }

  res.json({
    requestId: result.requestId,
    status: "completed" as const,
    data: result.data,
  });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  logInfo(`Server listening on http://127.0.0.1:${PORT}`, {
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    pixabayConfigured: Boolean(process.env.PIXABAY_API_KEY?.trim()),
  });
});
