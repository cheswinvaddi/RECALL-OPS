from fastapi import FastAPI
from app.api.incidents import router as incidents_router
from app.api.resolutions import router as resolutions_router

app = FastAPI(title="RECALL-OPS Backend")

app.include_router(incidents_router)
app.include_router(resolutions_router)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "recall-ops-backend",
    }
