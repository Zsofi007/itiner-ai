import { itinerError, itinerLog, itinerWarn } from "@/lib/logger";
import type { PostItineraryResponse } from "@/types/itinerary";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export async function postItinerary(body: {
  destination: string;
  days: number;
  budget: string;
  style: string;
  requestId: string;
}): Promise<PostItineraryResponse> {
  itinerLog("api", "POST /api/itinerary → start", {
    requestId: body.requestId,
    destination: body.destination,
    days: body.days,
    budget: body.budget,
    style: body.style,
  });
  const res = await fetch("/api/itinerary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseJson<
    PostItineraryResponse & { error?: string }
  >(res);
  if (!res.ok) {
    const msg =
      data.error ??
      (res.status === 429
        ? "Too many requests, please try again later"
        : "Something went wrong.");
    itinerError("api", "POST /api/itinerary ← error", {
      status: res.status,
      message: msg,
      body: data,
    });
    throw new ApiError(msg, res.status, data);
  }

  if (data.status === "error") {
    const msg =
      data.errorMessage ??
      "We could not generate your itinerary. Please try again.";
    itinerWarn("api", "POST /api/itinerary ← generation error", {
      requestId: data.requestId,
      message: msg,
    });
    throw new ApiError(msg, 400, data);
  }

  if (data.status === "completed" && data.data) {
    itinerLog("api", "POST /api/itinerary ← ok", {
      requestId: data.requestId,
      hasData: true,
    });
    return data;
  }

  itinerError("api", "POST /api/itinerary ← unexpected body", { body: data });
  throw new ApiError("Unexpected response from server.", 500, data);
}
