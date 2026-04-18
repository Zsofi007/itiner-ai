import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateItinerary } from "../server/src/generateItinerary.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as Record<
    string,
    unknown
  >;

  const { destination, days, budget, style, requestId } = body;

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
    return res.status(400).json({ error: "Missing or invalid fields." });
  }

  const daysNum = Number(days);
  if (!Number.isFinite(daysNum) || daysNum < 1 || daysNum > 30) {
    return res.status(400).json({ error: "Duration must be between 1 and 30 days." });
  }

  const result = await generateItinerary({
    requestId,
    destination: destination.trim(),
    days: Math.round(daysNum),
    budget: budget.trim(),
    style: style.trim(),
  });

  if (result.ok === false) {
    return res.status(200).json({
      requestId: result.requestId,
      status: "error" as const,
      errorMessage: result.errorMessage,
    });
  }

  return res.status(200).json({
    requestId: result.requestId,
    status: "completed" as const,
    data: result.data,
  });
}
