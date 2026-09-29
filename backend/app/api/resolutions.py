import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from hindsight_client import Hindsight

router = APIRouter(prefix="/api/incidents", tags=["resolutions"])

base_url = os.getenv("HINDSIGHT_BASE_URL", "http://localhost:8888")
api_key = os.getenv("HINDSIGHT_API_KEY")
client = Hindsight(base_url=base_url, api_key=api_key)


class ResolutionRequest(BaseModel):
    incident_id: str
    service: str
    symptoms: list[str]
    diagnosis: str
    recommended_action: str
    action_taken: str
    successful: bool
    root_cause: str
    lesson: str


@router.post("/resolve")
def resolve_incident(request: ResolutionRequest):
    status_label = "successful" if request.successful else "failed"
    doc_id = f"incident-resolution-{request.incident_id}"

    symptoms_formatted = "\n".join(f"- {s}" for s in request.symptoms)

    postmortem = f"""Company: NEXORA
Service: {request.service}
Incident ID: {request.incident_id}

Symptoms:
{symptoms_formatted}

Diagnosis:
{request.diagnosis}

Root cause:
{request.root_cause}

Recommended action:
{request.recommended_action}

Action taken:
{request.action_taken}

Outcome:
{status_label.capitalize()}

Important lesson:
{request.lesson}"""

    tags = [
        "incident",
        "postmortem",
        "resolution",
        status_label,
        request.service,
    ]

    try:
        client.retain(
            bank_id="recall-ops-test",
            content=postmortem,
            document_id=doc_id,
            context=f"NEXORA Production Postmortem - Incident {request.incident_id} Resolution",
            tags=tags,
            update_mode="replace",
        )
        return {
            "status": "stored",
            "incident_id": request.incident_id,
            "successful": request.successful,
            "message": "Incident resolution stored in organizational memory.",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to store incident resolution in Hindsight: {e}",
        )
