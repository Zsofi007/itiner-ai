import { itinerError, itinerLog, itinerWarn } from "@/lib/logger";
import type {
  ItineraryJobResponse,
  PostItineraryResponse,
} from "@/types/itinerary";

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
  const data = await parseJson<PostItineraryResponse & { error?: string }>(res);
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
  itinerLog("api", "POST /api/itinerary ← ok", {
    requestId: data.requestId,
    status: data.status,
    hasData: Boolean(data.data),
  });
  return data;
}

export async function getItinerary(
  requestId: string,
): Promise<ItineraryJobResponse> {
  const res = await fetch(`/api/itinerary/${encodeURIComponent(requestId)}`);
  const data = await parseJson<
    ItineraryJobResponse & { error?: string }
  >(res);
  if (res.status === 404) {
    itinerWarn("api", "GET /api/itinerary/:id ← 404", { requestId });
    throw new ApiError("Request not found.", 404, data);
  }
  if (!res.ok) {
    const msg =
      data.error ??
      (res.status === 429
        ? "Too many requests, please try again later"
        : "Something went wrong.");
    itinerError("api", "GET /api/itinerary/:id ← error", {
      requestId,
      status: res.status,
      message: msg,
    });
    throw new ApiError(msg, res.status, data);
  }
  return data;
}
