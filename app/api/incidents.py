import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.hindsight_service import HindsightService

router = APIRouter(prefix="/api/incidents", tags=["incidents"])
hindsight_service = HindsightService()


class IncidentRequest(BaseModel):
    service: str
    symptoms: list[str]


def extract_section(header_pattern: str, text: str) -> str | None:
    pattern = rf"^(?:{header_pattern}):\s*(.*(?:\n(?!^[A-Z][a-zA-Z\s-]+:).*)*)"
    m = re.search(pattern, text, re.MULTILINE)
    if m and m.group(1):
        cleaned = m.group(1).strip()
        return cleaned if cleaned else None
    return None


def extract_snippet(text: str) -> str | None:
    if not text:
        return None
    inc = extract_section(r"Incident", text)
    if inc:
        line = inc.split("\n")[0].strip()
        if line:
            return line[:200]
    diag = extract_section(r"Diagnosis", text)
    if diag:
        line = diag.split("\n")[0].strip()
        if line:
            return line[:200]
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    return lines[0][:200] if lines else None


def determine_outcome(text: str) -> str:
    # Prefer explicit final Outcome section
    out_final = extract_section(r"Outcome|Resolution outcome", text)
    target = out_final or extract_section(r"Initial outcome", text) or ""
    lowered = target.lower()

    if any(w in lowered for w in ["unsuccessful", "failed", "failure"]):
        return "failed"
    if any(w in lowered for w in ["successful", "success", "normal", "stopped", "resolved"]):
        return "successful"

    # Fallback to inspecting text mentions of outcome
    lowered_full = text.lower()
    if any(p in lowered_full for p in ["outcome:\nsuccessful", "outcome: successful", "outcome: resolved"]):
        return "successful"
    if any(p in lowered_full for p in ["outcome:\nunsuccessful", "outcome: unsuccessful", "outcome: failed", "outcome:\nfailed"]):
        return "failed"

    return "unknown"


def parse_memory_evidence(item) -> dict:
    text = getattr(item, "text", "") or ""
    mem_id = getattr(item, "id", None) or getattr(item, "document_id", None)

    service = extract_section(r"Service", text)
    root_cause = extract_section(r"Root cause", text)
    resolution = extract_section(r"Resolution|Action taken|Successful resolution", text)
    lesson = extract_section(r"Important lesson|Lesson", text)
    outcome = determine_outcome(text)
    snippet = extract_snippet(text)

    return {
        "id": mem_id,
        "snippet": snippet,
        "service": service,
        "outcome": outcome,
        "root_cause": root_cause,
        "resolution": resolution,
        "lesson": lesson,
        "raw_text": text,
    }


@router.post("/investigate")
def investigate_incident(request: IncidentRequest):
    symptoms_str = ", ".join(request.symptoms)
    query = f"{request.service} {symptoms_str}"
    bank_id = "recall-ops-test"

    try:
        recall_resp = hindsight_service.recall(bank_id=bank_id, query=query)
        reflect_resp = hindsight_service.reflect(bank_id=bank_id, query=query)

        results = getattr(recall_resp, "results", []) or []
        memories = [r.text for r in results if hasattr(r, "text") and r.text]
        memory_evidence = [parse_memory_evidence(r) for r in results]

        diagnosis = getattr(reflect_resp, "text", "") or str(reflect_resp)

        return {
            "service": request.service,
            "symptoms": request.symptoms,
            "diagnosis": diagnosis,
            "memory_count": len(memories),
            "memories": memories,
            "memory_evidence": memory_evidence,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hindsight investigation error: {e}")
