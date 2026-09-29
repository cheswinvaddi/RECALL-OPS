export interface IncidentRequest {
  service: string;
  symptoms: string[];
}

export interface MemoryEvidence {
  id: string | null;
  snippet: string | null;
  service: string | null;
  outcome: "successful" | "failed" | "unknown";
  root_cause: string | null;
  resolution: string | null;
  lesson: string | null;
  raw_text?: string;
}

export interface InvestigationResponse {
  service: string;
  symptoms: string[];
  diagnosis: string;
  memory_count: number;
  memories: string[];
  memory_evidence: MemoryEvidence[];
}

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function investigateIncident(
  request: IncidentRequest = {
    service: "checkout-service",
    symptoms: ["HTTP 503", "database connection acquisition delays"],
  }
): Promise<InvestigationResponse> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/incidents/investigate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    let errorDetail = "";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || "";
    } catch {
      errorDetail = await res.text();
    }
    throw new Error(
      errorDetail || `Investigation request failed with status ${res.status}`
    );
  }

  return res.json();
}
